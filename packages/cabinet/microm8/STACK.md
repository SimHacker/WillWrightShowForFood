# A transparent emulator stack in TypeScript

The plan to rebuild microM8's Apple ][ in TypeScript, as machines and plugins on the cabinet's
backplane rather than one Go program compiled to WebAssembly. microM8 is April and Melody
Ayres-Griffiths's emulator ([paleotronic/microm8-cln](https://github.com/paleotronic/microm8-cln),
MIT). Its Go source is the reference for what works: we read it, test against it, and translate
from it where its design fits the browser. Where the browser offers something better, we change
the design and measure the result.

Companion documents:

- [TEACHING.md](TEACHING.md): the live source graph from schematics to BASIC, and the tours.
- [TRANSPARENCY.md](TRANSPARENCY.md): overlays, tracing, profiling, source maps, rewind, lockstep
  and distributed devices.
- [GO-AND-TYPESCRIPT.md](GO-AND-TYPESCRIPT.md): what each language gives this job.
- [MODULE-MAP.md](MODULE-MAP.md): every microM8 package, and where it goes.
- [PLAN.md](PLAN.md): the order of work, each step with a test that can fail.

## What it is for

The cabinet's [manifesto](../MANIFESTO.md) says we control the horizontal and the vertical: every
register, every byte, every device and the host around them, with nothing sealed off. The Go build
in the page today is the opposite of that. It is one 41 MB module, one machine per JavaScript
realm, opaque to the browser's debugger, with every new hook a Go change and a rebuild, and its
frames copied out through `syscall/js`. It runs at about 1.7 MHz in the browser
([`src/microm8/microm8.ts`](../src/microm8/microm8.ts)).

The TypeScript stack is meant to be:

0. **Teaching.** It shows how the Apple works and why Woz designed it that way: the video, the
   Disk II, the speaker, cassette, paddles, buttons and slots, from the schematics through the ROM
   listings to the program running, with the emulator's own code and data linked to the hardware
   they model ([TEACHING.md](TEACHING.md)).
1. **Live coding first.** Every part of the machine can be read, replaced and extended while it
   runs, from the console, from a cartridge, or from a panel, with no rebuild and no lost state.
2. **Transparent.** Every read, write and execute can be watched, counted, traced, mapped to source
   and rewound, at no cost while nobody is watching ([TRANSPARENCY.md](TRANSPARENCY.md)).
3. **Exact.** Programs behave as they do on the hardware. microM8, apple2js and the SingleStepTests
   suite are the oracles, run against the same inputs ([PLAN.md](PLAN.md)).
4. **Fast, by measurement.** Every speed claim is a number from a benchmark, kept with the change
   that produced it.
5. **Browser first, Node second.** The same modules run in a page, in a worker and in Node; Node
   runs tests, benchmarks, headless machines and the server side of services.
6. **Many machines, many peers.** Several machines on one backplane, mapped into each other, and
   the same machines in lockstep across the network.

## The rules

**Re-cut along the cabinet's seams, not microM8's.** microM8's structure grew around one desktop
program: `Interpretable` is one Go interface of about 355 methods, the `settings` package holds 102
global arrays indexed by VM slot (158 files reach into it), and machine state lives at fixed
addresses in a 1 MB space per slot. Translating that line by line would carry those problems into
TypeScript. Instead the Apple is cut into the cabinet's parts: a processor, a memory map, units,
ports, codecs and services ([ARCHITECTURE-AND-LINEAGE.md](../ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices)).

**Guest memory is exactly as wide as the guest's word.** The Apple's banks are `Uint8Array`s, 64K
main and 64K aux. microM8 stores every byte in a `uint64` (8 MB per slot) so it can keep colour
attributes in the upper bits of text-page cells; every read pays a mask, and every write to
`$400–$7FF` reads the cell first to keep its upper bits (`core6502.go`, `StoreByteAddr`). Here those
attributes go in a plane. Byte banks make mapping, sharing and DMA a `subarray` or a `set()`, and a
panel reads the same bytes the 6502 reads.

**Everything else lives in planes beside memory.** A plane is a typed array or a sparse map keyed
by address, owned by whoever turned it on: heat counts, the last reader, writer and executor, the
type map, source maps, microM8's text colours. A machine pays only for the planes in use. This is
the cabinet's rule already: tags and shadow layers are never written into core
([`src/core.ts`](../src/core.ts); DESIGN.md, "Shadow memory").

**State is data, behaviour is code.** A unit's state is plain data: numbers, typed arrays and
plain objects, with no closures and no class instances inside it. Its behaviour is a module that
operates on that state. Snapshots, rewind, lockstep, worker transfer and hot reload then all work
the same way: copy the state, or keep the state and swap the module.

**Time is cycles.** Every input enters the machine stamped with a cycle count. Nothing reads the
wall clock. The same inputs at the same cycles after the same snapshot give the same machine, which
is what the cabinet's sessions rely on already ([`src/session.ts`](../src/session.ts)).

**Every hook says who installed it.** A replaced opcode, a memory handler, a watch or a trap carries
the name of the plugin or cartridge that put it there, and the debugger lists them. Live patching
without provenance becomes impossible to reason about.

## The parts

```
machine "apple2e"
  processor   65C02                 registers, opcode table, cycle count
  memory map  page tables           256 read pages, 256 write pages, watch flags
  banks       Uint8Array            main 64K, aux 64K, ROM, card ROMs, language card
  units       iou, video, speaker, keyboard, game port, slots 1-7 (cards)
  planes      heat, last access, types, source, text attributes (only those switched on)
  ports       memory ports and request ports to other machines and services
  log         cycle-stamped inputs; snapshots
```

The whole machine saves to a file each unit and card adds its own part to, readable and editable
without running the emulator ([SAVE-FILES.md](../SAVE-FILES.md)).

### The processor

A 6502 and a 65C02, one module each or one with a variant table, in the shape the cabinet's
`Processor` interface needs: `pc`, `step()`, `read`, `write`, a disassembler
([ARCHITECTURE-AND-LINEAGE.md](../ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices)). The PDP-7's
`Cpu` type is accumulator-and-IOT shaped; the Apple has neither, so `Cabinet` grows the processor
list that section already plans, rather than the Apple pretending its soft switches are IOTs.

The opcode table is data: 256 entries of `{ mnemonic, mode, bytes, cycles, run }`. A plugin can
wrap or replace an entry; the disassembler, the assembler and the typed-memory declarations read
the same table ([DESIGN.md](../DESIGN.md#typed-memory-core-as-typed-blocks)).

**Traps** replace guest code with TypeScript at an address: microM8's firmware handlers
(`FirmwareExec` on the SmartPort, mouse, Mockingboard and SoftCard cards) and its call shims
(`RegisterCallShim`, used for DOS's RWTS) become one mechanism. A trap runs when the PC reaches its
address, reads and sets registers and memory, charges cycles, and returns. This is high-level
emulation on purpose, the cabinet's native-CPU idea at the scale of one routine.

### The memory map

Two tables of 256 pages, one for reads and one for writes, as microM8's `MemoryManagementUnit`
has (`PageREAD`, `PageWRITE`). A page is either a bank and an offset, read and written directly, or
a handler, for I/O. Soft switches rewire pages; they don't add tests to every access.

```ts
type Page =
  | { kind: "bank"; bank: Uint8Array; base: number }            // RAM, ROM: direct
  | { kind: "io"; read(addr: number): number; write(addr: number, v: number): void }
  | { kind: "port"; port: MemoryPort; base: number };           // another machine's memory
```

The fast path is one table lookup and one typed-array access. Which representation is fastest
(an array of objects, or parallel arrays of banks and offsets) is measured, not assumed.

**Watch flags** are a third table: one bit per page per access kind. A page with no watch takes the
fast path. A watched page takes the slow path, which feeds the planes and calls watchers. Heat maps,
breakpoints on data, the reader, writer and executor overlays, and shared-memory capture all cost
nothing on pages nobody watches. microM8 tests `settings.DebuggerOn` on every access and calls
listeners per 256-byte bank; this keeps the same reach and moves the cost to where it is wanted.

**Port pages** are how another machine's memory appears: a window of a PDP-7's core, a tiny-titan
segment, a remote peer's bank ([MAPPING.md](../MAPPING.md), [CORE-LINKS.md](../CORE-LINKS.md)). Byte
banks on both sides need no codec; unlike widths go through one.

### The IOU and the soft switches

The //e's soft switches at `$C000–$C0FF` as a declared table: address, read or write, name, what it
sets, and which pages it rewires. microM8 spreads this over `apple2io.go` and `memcxxx.go` (about
5,000 lines) as handler functions per switch. As a table, the debugger can list every switch and
its state, a panel can flip one, and the typed-memory map can name the I/O page.

### Units and time

microM8 clocks every device on every bus cycle: `IO.Increment(1)` from the CPU, which loops over
the video scanner, the recorder, the speaker, the cassette and every card. Its own profiling put
per-cycle device clocking as the largest cost left ([FORK.yml](FORK.yml), `next`).

Here a unit catches up when touched. It records the cycle at which it last ran, and when the CPU
reads or writes it, or when its next event is due, it advances by the difference:

- **Video**: the beam position is a function of the cycle count, so the scanner doesn't tick. A
  soft-switch change or a write to a video page is logged with its cycle, and the frame is built at
  vertical blank from the banks and that log, which is what microM8's scan renderer captures per
  scan segment.
- **Speaker**: each `$C030` access is a timestamp. The audio unit turns timestamps into samples in
  an AudioWorklet.
- **Disk II**: the logic state sequencer advances by elapsed cycles when the drive is read,
  written or polled, as microM8 already does in batches (`lastLSSCycles`, `currentLSSCycles`).
- **Timers** (the 6522s on a Mockingboard, a serial card's baud clock) schedule their next event
  on a cycle queue.

Whether catch-up beats per-cycle ticking for each unit is measured on the same workloads, and a
unit that needs per-cycle work keeps it.

### Cards

A card is a unit with three windows, as microM8's `SlotCard` has: registers at `$C0n0–$C0nF`, a ROM
page at `$Cn00`, and the shared `$C800–$CFFF` expansion space when selected. It may have traps,
an interrupt line, and state it saves as data. Disk II, SmartPort, Videx, the 2651 serial card, the
Super Serial Card, the Mockingboard, the mouse, the parallel printer and the Z80 SoftCard each
become one. The Videx and 2651 cards we added to microM8 ([FORK.yml](FORK.yml)) translate first,
since we wrote them.

### Video, on the GPU

The machine never makes pixels. Its job ends at two facts per frame: what is in memory, and which
video mode was in force at each moment of the scan. Turning that into a picture is the GPU's job,
where it is cheap, parallel and off the 6502's thread. microM8 decodes video in Go, on the CPU
thread, and the WebAssembly build then copies the frame out to JavaScript; here no frame is ever
built on the CPU.

**What the machine hands over at vertical blank:**

- **The banks**, main and aux, as one 8-bit texture. The whole 128K is about 7.7 MB a second at 60
  frames, which is little for any GPU; uploading only the video areas is an option if measurement
  says it matters.
- **The mode log**: each soft-switch change that affects video (text, mixed, page 2, hires, 80
  columns, double hires, alternate characters), with the cycle it happened at. A frame is 262 lines
  of 65 cycles, and the beam position is a function of the cycle, so the log converts to a small
  per-line, per-column mode table. Mid-line mode changes, which some programs use, come out exact,
  because the table is indexed by the column the beam was on.
- **The character ROM** as a texture, loaded once, and the flash phase as a uniform.

**Two passes:**

1. **Dots.** For each of the 192 visible lines, the shader works out which bytes the scanner reads
   for each of the 40 columns (main and aux interleaved for 80-column text and double hires), looks
   up the mode for that column, and produces the line's 560 dots, with hires's half-dot delay from
   the high bit. This is the signal the Apple puts out before colour.
2. **Colour.** The dots become a picture: an NTSC decoder that recovers colour from the dot pattern
   the way a television did, or monochrome green, amber or white, or the idealised colours of an RGB
   card. Each is its own shader, chosen per view. microM8's decoders (`core/hires`, the scan
   renderer) and its colour tables are the reference for what each mode should look like.

**Overlays are passes too.** The planes ([TRANSPARENCY.md](TRANSPARENCY.md#overlays-reader-writer-executor))
upload as textures the same way, and the overlay pass draws heat, last writer or type over the
picture, byte for byte where the scanner read it. A hires page can show which routine drew each
byte without the CPU side doing anything per pixel.

**The same address function, twice.** Which byte the scanner reads at a given line and column is
also needed on the CPU side: some programs read the floating bus, the last byte the video scanner
put on the data bus, to synchronise with the beam. And clicking a pixel to find its address is the
same function backwards. So it is written once in TypeScript and once in the shader language, and
a test runs every line and column of every mode through both and compares them.

**A reference decoder for Node and for tests.** A slow, plain TypeScript decoder produces the same
dots and pictures without a GPU. Node uses it for headless machines and for golden-image tests
against microM8's frames; the shaders are tested against it. When they disagree, the reference is
easier to step through.

**What runs where:**

| Thread | Does |
|---|---|
| machine (page or worker) | the 6502, the units, the mode log, the input log |
| GPU | dots, colour, overlays, the 3D presentation |
| AudioWorklet | sound, from the speaker's timestamps and the other sources |
| page | panels, debugger, editors, network |

microM8's upcycled presentation (3D voxel depth, cameras, layers, backdrops, sprites, lighting) is
a renderer plugin over the same banks and mode log, in WebGPU, not part of the machine. WebGPU is
the first target, with WebGL 2 as the fallback for browsers without it.

### Sound

Sources write to a mixer in an AudioWorklet: the speaker's timestamps, the Mockingboard's AY-3-8910s,
the cassette, Restalgia instruments and microTracker songs. The worklet runs on its own thread, so
sound keeps time even when the machine's frame is late.

### Storage

Disk images are files the cartridge names. The cabinet already reads DOS 3.3, ProDOS and Pascal
volumes, sector orders, 2MG and WOZ ([`src/apple2/`](../src/apple2/)). The Disk II runs WOZ tracks as
bit streams, so copy-protected disks boot; sector images are nibblised on insert. A drive's image
can be local, in the browser's storage, or served by tiny-titan.

### Services

The machine reaches the host through services, by name, not through more devices: tiny-titan's
call namespaces ([TINY-TITAN.md](../TINY-TITAN.md#one-call-for-the-host-call-on-device-24)),
microM8's MCP tool set (same tool names, so agents that drive microM8 drive this), its HTTP control
API on Node, its debugger protocol, and microLink-style sharing ([TRANSPARENCY.md](TRANSPARENCY.md)).
A service's answer enters the machine as a cycle-stamped input, so replay stays exact.

### Profiles and cartridges

microM8's machine profiles are YAML (`octalyzer/assets/profile-extra/apple2-plus-videx.yaml`):
RAM areas, ROM regions, components, slots and their ROMs, layers. They become the `machine:` and
`devices:` parts of a cartridge ([CARTRIDGES.md](../CARTRIDGES.md)), read in microM8's own terms so
a profile file can be loaded as it is.

## Plugin surfaces

Each of these is a table or a list on the running machine, with a name for each entry and the
name of whoever installed it:

| Surface | What a plugin adds | microM8's counterpart |
|---|---|---|
| Opcodes | wrap or replace an instruction; a new CPU variant | `Opref [256]*Op6502` |
| Traps | TypeScript at an address, in place of guest code | `FirmwareExec`, `RegisterCallShim` |
| Pages | a bank, a handler, a port to another machine | `MemoryBlock`, `MappedRegion` |
| Watches | read, write or execute hooks on a range | `MemoryListener`, `@counter`, `@mem.lock` |
| Planes | per-address data beside memory | high bits of `uint64` cells; heat map |
| Soft switches | a switch, its state, the pages it rewires | `apple2io.go`, `memcxxx.go` |
| Cards | a slot device | `SlotCard` |
| Units | anything that advances with time | `Countable.Increment` |
| Renderers | a view of the banks and the mode log | `octalyzer/video`, `core/hires` |
| Audio sources | samples into the mixer | speaker, Mockingboard, Restalgia |
| Input devices | keys, paddles, buttons, mouse, pens, hands | `vduproto` events, keymap |
| Storage | an image format, a volume, a remote drive | `disk`, `files`, `woz` |
| Services | a named call on the host or the network | MCP tools, HTTP API, `@share` |
| Recorders | a consumer of the input log and snapshots | `interpreter/recorder.go` |
| Interpreters | a language beside the 6502 | `core/dialect/*` |

## Hot reload

Because state is data, a module can be reloaded while the machine runs: Vite's hot module
replacement swaps the module, the machine keeps its state, and the next instruction runs the new
code. A cartridge's LIVE CODING panel edits a card, a trap or a renderer the same way it edits Forth
([DESIGN.md](../DESIGN.md#cartridges-and-live-coding)). From the console, the running machine is
an object: `apple.pages.read[0xc0]`, `apple.cpu.ops[0xea]`, `apple.slots[6].state`.

## Faster, later: compiling 6502 to JavaScript

Once the interpreter is exact and measured, a second tier can compile hot 6502 code into
JavaScript functions with `new Function`, which the browser's JIT then optimises. A write to a page
holding compiled code invalidates it through the same watch flags. Apple programs modify
themselves, so this is an experiment with a benchmark, not a promise. It is Vanessa Freudenberg's
SqueakJS approach applied to a 6502: generate JavaScript the engine can optimise, rather than
leave the engine
([jit notes](../../../characters/vanessa-freudenberg/sources/jit-notes/README.md)).

## Threads

One machine runs on one thread. Linked machines share a thread, so a mapped write is visible on the
next cycle with no coherence protocol ([CORE-LINKS.md](../CORE-LINKS.md#modes)). A machine can run in
a worker, with its banks in a `SharedArrayBuffer` that the page's panels read directly; that needs
the page served with cross-origin isolation headers (COOP and COEP). Rendering runs on the GPU and
sound in an AudioWorklet. Go's WebAssembly port, by contrast, runs every goroutine on one thread.

## What stays Go, for now

microM8's Applesoft, Integer BASIC and Logo are interpreters written in Go, about 51,000 lines with
their shell and parser, plus 26,000 lines of `@` commands. They run beside the 6502, not on it. Until one is translated,
the patched WebAssembly build stays available as a peer, linked to the TypeScript machine through a
memory port and tiny-titan, and as the oracle for the machine it replaces
([MODULE-MAP.md](MODULE-MAP.md)).

## Credit and license

microM8 is MIT, copyright 2025 Paleotronic. A TypeScript file translated from microM8's Go keeps
that copyright notice and names the Go files it came from, at the commit in [FORK.yml](FORK.yml).
Our own additions (the Videx, the 2651 card, the write-protect fix) are credited to us, and the
design changes are ours; microM8's design is theirs, credited by name wherever it is used.

↑ [README](README.md) · [MICROM8](../MICROM8.md) · [MANIFESTO](../MANIFESTO.md) · [ARCHITECTURE-AND-LINEAGE](../ARCHITECTURE-AND-LINEAGE.md)

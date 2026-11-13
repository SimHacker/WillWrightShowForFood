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

## Why not use just the Go build

The Go build in the page today: one 41 MB module; one machine per JavaScript realm; no breakpoints,
no inspection and no profiling of the Go from the browser's tools; every new hook a Go change and a
rebuild; frames copied out through `syscall/js`; about 1.7 MHz in the browser
([`src/microm8/microm8.ts`](../src/microm8/microm8.ts)). The cabinet's
[manifesto](../MANIFESTO.md) wants every register, byte and device of every machine reachable from
the page.

Requirements:

0. **Teaching.** The video, the Disk II, the speaker, cassette, paddles, buttons and slots, linked
   from the schematics through the ROM listings to the running program, with the emulator's own code
   and data linked to the hardware they model ([TEACHING.md](TEACHING.md)).
1. **Live coding.** Any part of the machine can be read, replaced and extended while it runs, from
   the console, a cartridge or a panel, without a rebuild or losing state.
2. **Transparent.** Any read, write or execute can be watched, counted, traced, mapped to source and
   rewound; unwatched pages cost nothing ([TRANSPARENCY.md](TRANSPARENCY.md)).
3. **Exact.** Checked against microM8, apple2js and SingleStepTests on the same inputs
   ([PLAN.md](PLAN.md)).
4. **Fast, measured.** Every speed claim is a benchmark number, committed with the change.
5. **Browser and Node.** The same modules in a page, a worker and Node; Node runs tests, benchmarks,
   headless machines and the server side of services.
6. **Several machines, several peers.** Machines on one backplane mapped into each other; copies in
   lockstep over the network.

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
the name of the plugin or cartridge that put it there, and the debugger lists them.

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

`bus.ts`'s `Cpu` is PDP-7 specific: `ac`, `skip()`, word-addressed core, I/O through IOTs. The
6502 has no I/O instructions; everything is a memory access. It implements the `Processor`
interface planned in [ARCHITECTURE-AND-LINEAGE.md](../ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices),
and `Cabinet` takes a list of processors.

```ts
interface Processor6502 {
  regs: { pc: number; a: number; x: number; y: number; s: number; p: number };  // saved as cpu.yml
  cycle: number;                       // bus cycles since power-on
  ops: Opcode[];                       // 256 entries, per variant
  bus: { read(addr: number): number; write(addr: number, v: number): void };
  step(): number;                      // one instruction; returns its cycles
  irq(level: boolean): void;
  nmi(): void;
  reset(): void;
}

type Opcode = {
  mnemonic: string; mode: Mode; bytes: 1 | 2 | 3; cycles: number;
  run(cpu: Processor6502): void;       // makes every bus cycle itself
  by?: string;                         // who installed it, if not the base table
};
```

**One bus call per bus cycle.** `run` calls `bus.read` or `bus.write` once for each cycle the chip
puts on the bus, in the chip's order, and `cycle` advances by one per call. That includes the cycles
that aren't the instruction's own access:

- NMOS: the dummy read at the unfixed address on indexed addressing (always for stores and
  read-modify-write, on a page cross for loads); the double write of read-modify-write instructions
  (old value, then new); the dummy reads of implied and stack instructions.
- 65C02: read-modify-write reads twice instead of writing twice; indexed dummy reads go to the last
  instruction byte instead of the unfixed address.

On the Apple these matter, because the soft switches react to any access. The language card's
write enable needs two reads in a row; `STA $C0xx,X` on an NMOS part reads the switch before it writes
it, so the switch sees two accesses; the Disk II's write sequence depends on the exact cycle of each access. SingleStepTests
records the bus activity of every opcode, so all of this is tested, not hoped for ([PLAN.md](PLAN.md)).

**Variants.** The NMOS table holds all 256 entries, including the stable undocumented opcodes
(`LAX`, `SAX`, `DCP`, `ISC`, `SLO`, `RLA`, `SRE`, `RRA`, `ANC`, `ALR`, `ARR`, `SBX`) and the `JAM`s. The
65C02 table is the NMOS table with overrides: `BRA`, `PHX`, `PHY`, `PLX`, `PLY`, `STZ`, `TRB`, `TSB`,
`(zp)` addressing, `BIT #imm`, `INC A`, `DEC A`, `JMP (abs,X)`; `JMP ($xxFF)` fixed, at one more cycle;
valid N and Z in decimal mode, at one more cycle; D cleared on interrupts; unused opcodes as NOPs of
the right length and timing. The enhanced //e's 65C02 has no Rockwell bit instructions (`RMB`, `SMB`,
`BBR`, `BBS`), so they are a third table, for cards and machines that have them.

**Interrupts** are sampled where the chip samples them, before the last cycle of an instruction,
including the NMOS part's one-instruction delay after a taken branch that doesn't cross a page.

**The table is the only description of the instruction set.** The disassembler, the assembler's back
end and the typed-memory declarations read it ([DESIGN.md](../DESIGN.md#typed-memory-core-as-typed-blocks)).
A plugin wraps or replaces an entry (`cpu.ops[0x00] = trapBrk(cpu.ops[0x00])`), and `by` records it.

**Traps** run TypeScript when the PC reaches an address: they read and set registers and memory,
charge cycles, and return with an `RTS` or a jump. microM8's firmware handlers (`FirmwareExec` on the
SmartPort, mouse, Mockingboard and SoftCard cards) and its call shims (`RegisterCallShim`, used for
DOS's RWTS) become traps. A trap is checked at instruction fetch through the execute watch flags of
its page, so pages without traps pay nothing.

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

The //e's soft switches at `$C000–$C0FF` as declared slots (below): address bits, read or write, name,
what it sets, and which configuration bits it changes. microM8 spreads this over `apple2io.go` and
`memcxxx.go` (about 5,000 lines) as handler functions per switch. As slots, the debugger can list
every switch and its state, a panel can flip one, and the typed-memory map can name the I/O page.

### Dispatch: guarded slots, resolved ahead of time

Memory handlers, soft switches, traps, watches and opcode table entries are all slots in one sea, in
the manner of Korz (Ungar, Ossher and Kimelman, *Korz: Simple, Symmetric, Subjective,
Context-Oriented Programming*, Onward! 2014; notes in
[moollm/designs/korz](https://github.com/SimHacker/moollm/blob/main/designs/korz/README.md)). A slot
has a guard over dimensions; an access or an opcode is dispatched to the most specific slot whose
guard matches. Nothing here is a framework: a slot type, add and remove, a resolver, and a compile
step that fills the tables the fast path already uses.

```ts
type Bits = { mask: number; match: number };          // x & mask === match
type Guard = {
  access?: "read" | "write" | "fetch";
  addr?: Bits;
  op?: Bits;                                          // opcode bit fields
  who?: "cpu" | "video" | "dma" | "debugger";
  machine?: string;                                   // "apple2plus", "apple2e", ...
  variant?: "nmos" | "65c02" | "rockwell";
  config?: Bits;                                      // memory configuration soft-switch bits
};
type Slot = { guard: Guard; run: (c: Access) => number | void; by: string };
```

**Specificity is a partial order.** Guard A is more specific than B when every access A matches, B
matches too: A's masks contain B's bits with the same values, and A constrains every dimension B
does. The unique most specific match runs. Two matching slots with neither more specific is an
error, reported when the second one is added, with both slots' `by`.

**Resolved when slots change, never per access.** Adding or removing a slot recomputes the affected
pages and table entries:

- A page wholly covered by one bank slot becomes a direct `Uint8Array` page, as before.
- An I/O page gets a 256-entry handler array, one resolved slot per address.
- `config` dimensions (language card banks, aux read and write, `80STORE`, `PAGE2`, `HIRES`) are
  resolved per configuration, and the resolved page tables are cached by configuration bits. A
  soft switch that changes banking swaps the table, the way the hardware switches its decoders.
  How many configurations real programs use is measured.
- The opcode table is compiled per `variant` into the 256 entries the processor dispatches on.

The inner loop sees arrays, as in [the memory map](#the-memory-map); the slots are how the arrays get
made, listed, explained and changed.

**Decoding by address bits, as the hardware does.** Much of the Apple's I/O is addressable latches:
address bits select a latch, `A0` is the value written. The motherboard's `$C050–$C05F` (graphics,
mixed, page 2, hires, the annunciators) and the Disk II's `$C0n0–$C0nF` (four stepper phases, motor,
drive select, Q6, Q7) both decode `A1–A3` as the latch and `A0` as the value, so each is one slot:

```ts
slot({ addr: { mask: 0xfff0, match: 0xc050 } },
  (c) => { latch[(c.addr >> 1) & 7] = c.addr & 1; return floatingBus(c); }, "motherboard");

slot({ addr: { mask: 0xfff0, match: 0xc080 + 16 * 6 } },
  (c) => disk2.latch(c, (c.addr >> 1) & 7, c.addr & 1), "disk2 in slot 6");

slot({ addr: { mask: 0xff00, match: 0xc000 }, who: "debugger" },
  (c) => ioPeek(c.addr), "debugger: read I/O without side effects");

slot({ access: "fetch", addr: { mask: 0xffff, match: 0xfded } }, cout, "trace COUT");
```

The third slot is the reason for `who`: a debugger or a panel reading `$C0xx` must not flip a switch,
so its reads dispatch to a peek that returns the value without the side effect, with no test in the
CPU's path. The fourth is a trap: traps, execute breakpoints and execute watches are `fetch` slots.

**Opcodes by bit field.** The 6502 decodes an opcode as `aaabbbcc`: `cc` picks the group, `aaa` the
operation, `bbb` the addressing mode. The table is built from slots on those fields: operation slots
guarded on `aaa` and `cc`, mode slots on `bbb` and `cc`, and exact-opcode slots (`mask: 0xff`) for
the irregular ones, the undocumented NMOS opcodes and the 65C02's additions, which are more specific
and win. A plugin that wraps one opcode adds an exact slot; a variant adds slots guarded on
`variant`.

**Views of the sea.** The slots can be listed along any dimension: everything slot 6's card
installed, everything that touches `$C0xx`, everything a plugin added, everything that applies to the
//e and not the ][+. That is Korz's subjectivity, and it is what the debugger's plugin list and the
teaching graph's `drives` and `decodes` links read ([TEACHING.md](TEACHING.md)).

**Self practices, in TypeScript.**

- **Prototypes, not classes.** A card definition is a prototype: plugging it into a slot copies its
  state template and shares its behaviour. No class hierarchy of cards.
- **Stable shapes.** State objects are created with every field present, in a fixed order, numbers
  staying numbers, so V8's hidden classes (Self's maps) stay monomorphic and the JIT keeps its fast
  paths.
- **Customise, then invalidate.** Resolved tables are specialised per configuration and variant, as
  Self compiled methods per receiver map; adding or removing a slot invalidates the tables and any
  compiled 6502 blocks that depend on the pages it covers, as Self deoptimised on dependency change.
- **Mirrors.** Reflection goes through the `debugger` coordinate and the slot listing, not through
  the machine's own paths.

Where a unit's behaviour is a state machine or a timing model (the video scanner, the Disk II's
sequencer, a 6522) it is ordinary code; the slots are its entry points on the bus.

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

The machine produces memory and a log of video mode changes; the GPU produces pixels. microM8
decodes video in Go on the emulation thread, and the WebAssembly build then copies each frame out to
JavaScript. Here no frame is built on the CPU side.

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
the cassette, Restalgia instruments and microTracker songs. The worklet runs on the audio thread and
is fed ahead by a frame, so a late emulation frame doesn't drop samples.

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

Each of these is a set of slots or a list on the running machine ([dispatch](#dispatch-guarded-slots-resolved-ahead-of-time)),
with a name for each entry and the name of whoever installed it:

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

After the interpreter passes the oracles: compile hot 6502 basic blocks to JavaScript with
`new Function` and let the engine's JIT optimise them, as SqueakJS does for Smalltalk bytecode
([Vanessa Freudenberg's jit notes](../../../characters/vanessa-freudenberg/sources/jit-notes/README.md)).
A write to a page holding compiled code invalidates it through the write watch flags. Compiled blocks
must make the same bus calls in the same order, so the dummy cycles above are part of the generated
code. Apple programs modify themselves often, so whether this wins is a benchmark result.

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

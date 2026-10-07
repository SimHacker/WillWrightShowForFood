# Cabinet: Architecture and Lineage

Cabinet is a small, opinionated emulator for a particular historical world:
Heinz Lemke's PDP-7, Type 340 display, and the programs that ran on them. It is
not an attempt to put every SIMH machine in a browser. Its architecture starts
from a different question: what is the smallest, testable machine contract
that lets this software live again, and what should remain replaceable around
it?

The cabinet is the reusable platform and backplane; the **cartridge configures
the machine**. A cartridge chooses a CPU, memory, devices, instruction and I/O
connections, timing and interrupt lines, host-facing input and rendering, plus
the program, build steps and panels. The PDP-7 executes its own instruction
set. The Type 340 executes a second, display-specific instruction stream from
core. Devices expose contracts; the cartridge wires those contracts to the
selected machine. The browser host provides the console, rendering, input,
inspection, and distribution. The seams preserve what the guest program can
observe while letting the host be something the original designers could not
have imagined.

The current TypeScript backplane is the first simple wiring harness: one CPU,
a list of devices claiming IOT select codes, an OR-combined interrupt line,
and per-cycle device ticks. The CPU owns the memory interface today, and the
current program configurations are still partly hard-coded in the app. The
cartridge is the machine's wiring diagram: it selects the CPU and memory model,
installs devices, and connects device ports, instruction bindings, interrupt
sources, display producers, and instruments through adapters. A future
cartridge manifest can make those connections inspectable and reproducible
without requiring every cartridge to use the same topology.

```text
CPU instruction set ── memory/bus ── device ports ── display/input adapters
	│                  │               │                    │
	└── interrupt line ┴── clock ──────┴──── host renderer / controls
```

## Preserve the contract, not the implementation

An emulator succeeds when software written for the old machine behaves as it
expects. For PIXIE, the strongest specification is not the full PDP-7
handbook: it is the recovered listing, its display files, and the devices
those programs actually exercise. The DEC manuals explain ambiguous behavior;
SIMH provides a working reference model and a differential oracle. The corpus
sets the scope.

This is why Cabinet can be exact about the PDP-7's word arithmetic and the
340's display instructions without reproducing every transistor, every DEC
option, or every host operating system. A browser number can hold the
accumulator. The guest cannot tell. Cycle budgets can pace the animation
without making an old program depend on monitor refresh rate. That is
emulation: preserve the machine-visible contract, then make deliberate,
documented choices outside it.

Nor does one successful PDP-7 imply a universal simulator. A new processor
earns a plugin when a program, corpus, or preservation goal needs it. A new
device earns an IOT when a program issues one. Each addition should bring its
own source evidence and acceptance test. Unknown IOTs remain no-ops unless the
program or machine evidence requires another behavior. The architecture is
open to more processors and devices precisely because it does not require
building them in advance.

## MIMIC, SIMH, Cabinet

This is a lineage of interfaces and accumulated knowledge, not one unbroken
source tree.

**MIMIC** supplied an early virtual-machine framework and a published
interface specification. **SIMH** says plainly that it is based on MIMIC;
Bob Supnik's implementor paper credits MIMIC's design to Len Fehskens, Mike
McCarthy, and Supnik, and its VM-interface paper to Fehskens and Supnik. SIMH
grew into a portable family of emulators with a shared device model,
scheduler, debugging and control surface, and many historically significant
machines.

**Cabinet** takes that work seriously without taking all of SIMH along. The
PDP-7 CPU semantics are ported from Supnik's `pdp18b_cpu.c`. The Type 340
instruction engine is ported from Philip Budne's simulator-independent
`type340.c`. The XY display model and phosphor history come from Budne's
`display.c`, with revisions by Douglas A. Gwyn and roots in Douglas W. Jones's
PDP-8/E display emulator. Lars Brinkhoff supplied the PDP-7-specific Type 340
interface in `pdp18b_dpy.c`; he also recovered Type 342 character shapes from
MIT AI Lab film and the Knight TV font. Heinz Lemke's PIXIE listing tells us
which of those behaviors the target programs need.

Those are different contributions: CPU, display processor, XY display model,
machine-specific glue, and program evidence. Cabinet re-expresses selected
behavior in TypeScript and adds browser-facing tools around it. It does not
embed the SIMH runtime, and it does not claim that one person built the whole
machine. The full source-to-port ledger is in [SIMH-MAP.md](SIMH-MAP.md).

Validation is separate from source lineage. DEC's light-pen diagnostic,
Cambridge's DUEL, Mitch Bradley's PDP-7 Forth and turtle, and HILO and LANDER
exercise complementary CPU and device paths: pen IOTs and tracking, tape loading
and console switches, EAE arithmetic and 340 display lists, and KSR-33 input and
output. The spoken-number, smart-TTY path normalizes dictated numbers before
feeding them as ordinary keystrokes. The acceptance tests cover the [light-pen
diagnostic](src/lp370.test.ts), [DUEL](src/cabinet.test.ts),
[Forth and turtle](src/forth.test.ts), [HILO](src/hilo.test.ts),
[LANDER](src/lander.test.ts), and [spoken TTY input](src/spoken.test.ts).

This is also where the cabinet metaphor earns its keep. DEC's cabinet held a
processor and its devices; a plug-in added IOT behavior to the backplane.
Cabinet keeps that tangible idea as software, while the cartridge says which
parts are installed and how they are wired. The PDP-7 and 340 meet through
memory and device calls, not by reaching into each other's implementation.
Another CPU can have another word width. Another display can emit another
kind of picture. The machine is the cartridge's composition, not a fixed CPU
with a pile of built-in peripherals.

## The wheel of reincarnation

Myer and Sutherland's 1968 *On the Design of Display Processors* describes a
recurring temptation: put more intelligence near the display to free the host;
then the display processor becomes a second computer, so designers add a
third processor to draw for it. The paper places the DEC 340/347 at the
half-turn, its “cardinal point”: a display instruction stream with jumps,
subroutine operations, and enough state to look unmistakably like a small
processor. The Type 338 is farther around because it adds a hardware
pushdown stack. The wheel is a model of where computation moves, not a score
for graphical quality.

PIXIE uses the 340 as a specialized display processor alongside the PDP-7.
Its display file is a program, but one for drawing and interaction; the PDP-7
remains the general-purpose host. Cabinet preserves that boundary rather than
turning the 340 into an all-purpose UI computer. The browser does provide the
outer application, but the guest machine still sees its own CPU, IOTs, display
words, and light-pen behavior.

Forth's turtle makes that boundary tangible: Forth computes in the PDP-7,
builds vector words in the Type 340 display list, and leaves the 340 to execute
and refresh that display program.

The same placement question reappears in later systems, without a simple
descent from one to the next. NeWS moved executable PostScript and window
behavior into a programmable display server. AJAX put more interaction code
in the browser and used asynchronous requests for server data. WebGL and
WebGPU move graphics work—and, increasingly, compute—to a specialized GPU.
Each trades communication, latency, programmability, and complexity at a
different boundary. Cabinet is another answer: run a complete, inspectable
machine model close to the user, but keep its CPU and devices specialized and
composable.

## JavaScript as a living substrate

Gary Bernhardt's [*The Birth & Death of JavaScript*](https://www.destroyallsoftware.com/talks/the-birth-and-death-of-javascript)
offers another useful frame. Its speculative “death” is JavaScript ceasing to
be the language programmers write everything in, while remaining an
important browser execution target. The source language can change; the
platform and its accumulated engineering remain.

Vanessa Freudenberg made a closely related, very practical choice in SqueakJS.
Her [JIT notes](../../characters/vanessa-freudenberg/sources/jit-notes/jit.md)
describe generating JavaScript from Smalltalk bytecodes in forms that the
browser's own JIT can optimize: arguments and local variables instead of a
generic stack, and inline caches at dynamic method sends. Her stated trade was
not “WASM cannot be fast.” She valued the readability, flexibility, and fun of
developing and debugging in a dynamic high-level language, and wanted to
leverage the enormous work already invested in JavaScript engines.

That strategy has a Self lineage. Self's dynamic object model pushed virtual
machines toward maps, inline caches, speculation, and deoptimization: optimize
what actually runs, then recover when an assumption stops holding. Those
ideas and people influenced later dynamic-language VMs, including the engine
lineages that made JavaScript fast. This is an intellectual and engineering
lineage, not a claim that V8 is simply Self reincarnated; see also the
[Vanessa memorial sources](../../characters/vanessa-freudenberg/README.md) and
[David Ungar's room](../../characters/david-ungar/README.md).

Cabinet's position is related, but narrower. TypeScript compiles to
JavaScript, and the browser JIT optimizes the emulator's host code. Cabinet
does **not** currently compile PDP-7 programs into JavaScript; it interprets
guest instructions and tests their behavior. SqueakJS's guest-language JIT is
a useful precedent, not a feature Cabinet already has.

Likewise, WebAssembly is not inherently “no JIT”: browser engines can compile
WASM in tiers and optimize hot functions. The distinction is the working
surface and feedback path. A conventional C-to-WASM toolchain emits a
statically shaped module; JS's dynamic objects, generated functions, devtools,
and runtime feedback make a different set of optimizations and live-debugging
practices natural. For Cabinet, choosing TypeScript/JavaScript is not a claim
that it wins every benchmark. It is choosing a substrate where the emulator,
its debugger, and its user interface can be developed together—and where the
host JIT is a shared platform resource.

The browser need not be the final substrate. Cabinet already treats the
Type 340's segment stream as a boundary consumed by Canvas, snapshots, and
recording; WebGPU or another renderer can join without changing the PDP-7's
instruction semantics. If a later runtime is better, the guest contract and
its tests are the things to carry forward.

## Different processors, one cabinet

The PDP-7 is the first CPU plugin, not the cabinet's definition of a CPU.
Later candidates differ in word size, instruction set, memory organization,
display model, and I/O architecture:

| Candidate | What differs | Status and design implication |
|---|---|---|
| PDP-7 | 18-bit words, accumulator CPU, IOT devices, optional Type 340 vector display | Implemented for the PIXIE corpus; acceptance is old programs behaving from their recovered listings. |
| Apple ][ | 6502 and 8-bit memory, memory-mapped soft switches, raster video, game-port paddles and buttons | A planned CPU plugin; ROMs come from the user. It is not a PDP-7 variant and should not inherit the PDP-7's IOT assumptions. |
| PDP-10 / KA10 | 36-bit words, byte pointers, ITS and its own device/channel conventions | A later plugin for ITS; word arithmetic, memory and I/O all need their own contracts. |
| PDP-1 | 18-bit ones'-complement words, the 18-bit family's ancestor (Supnik: the PDP-4 cut its instruction set in half); Type 30 point-plotting display with light pen, no display processor; sequence break instead of interrupts; FIODEC tape and typewriter | A planned plugin from SIMH's `PDP1/`, which is the oracle and already includes Spacewar! (`PDP1/spacewar1/`). It shares the 18-bit memory representation, but not the PDP-7's IOT set or its 340. Its showcase is L Peter Deutsch's PDP-1 Lisp, with source maps to his own scanned listings and documentation. |
| Knuth's MIX | A sign and five bytes per word, where a byte may be binary (at least 64 values) or decimal (100); field specs `(L:R)`; registers A, X, I1–I6 and J; 4000 words; block I/O to tapes, disks, card reader and punch, line printer, typewriter and paper tape; timing in units *u* | A planned plugin whose acceptance is TAOCP's own programs giving the results and timings Knuth prints, with GNU MDK (GPL) as oracle only. A correct MIX program must not care what size a byte is, so the plugin runs both byte sizes and the tests run everything twice. Its I/O units are blocks on unit numbers, not IOTs: the line printer goes to the lineprinter viewer, the typewriter to the teletype. |
| Turing machine | A transition table and a tape, rather than a conventional instruction set | The Turing-machine toolkit already exists separately. It could be a one-transition CPU plugin, or a shared-memory transition engine attached as a device to a von Neumann host; the latter is the cabinet-composition experiment described below. |

**A native CPU: the app is the processor.** A CPU plugin doesn't have to simulate an
instruction set. The contract is small: `step()`, `read`/`write` of core, a PC, an interrupt line.
So a TypeScript program can fill it and *be* the processor. It drives the cabinet's devices
directly through their native APIs (pulses to the 340, characters to the teletype, words into core
for the display to fetch) with no guest code and no instruction decoding between the intent and
the device. This is what emulators call high-level emulation (HLE), done on purpose: UltraHLE
and console BIOS HLE replace guest code with native host routines. Uses:

- **Bespoke CPUs**: a special-purpose machine that never existed, built for one job. The Turing
  machine row above is one; a cellular-automaton stepper is another.
- **Prototyping devices** before any guest driver exists: the device's API is exercised by the app
  directly, and the guest binding comes later.
- **Reference implementations**: the JavaScript leg of the CAM-off
  ([DESIGN.md](DESIGN.md#cam-on-the-pdp-7-a-cam-off)) runs as a native CPU beside the PDP-7
  assembly and the Forth, on the same devices.
- **Apps that just want the devices**: a 340 drawing tool, or a teletype game, written straight to
  the device APIs, which still gets the cabinet's run, stop, trace, recording and panels.

**Wrapping engines that already exist.** A native CPU or a device can be a thin wrapper around a
TypeScript or JavaScript library that was never written for the cabinet. The wrapper supplies
`step()`, exposes the engine's state as memory or as device properties, and turns its events into
device events. The engine keeps its own code and tests. In return it gets the cabinet's run, stop,
single-step, trace, recording, panels and source maps, and it can sit on the same bus beside a
PDP-7. Candidates, each its own project already:

| Engine | Where it is | As a cabinet |
|---|---|---|
| CAM-6 | Don's simulator, `CAM6/javascript/CAM6.js`, rules compiled to lookup tables | a device a PDP-7 drives by IOT, or a native CPU stepping the planes |
| Micropolis | MicropolisCore, C++ in WASM behind `MicropolisReactive` (`poke`, `peek`, callbacks, `getSnapshot()`) | a native CPU whose core is the city map, with tools and budget as device calls |
| Turing machine | [`packages/turing`](../turing/SCHEMA.yml), with Minsky's universal machine (AI Memo 33's 7-state, 4-symbol UTM; the [TECO UTM](../tiny-teco/README.md)) | a CPU, or a device on a von Neumann host (below) |
| Movable Feast Machine | Dave Ackley's robust-first, asynchronous cellular computing ([characters/dave-ackley](../../characters/dave-ackley/)); Andrew Walpole's native TypeScript [MFM-JS](https://github.com/walpolea/MFM-JS) ([mfm.rocks](https://mfm.rocks/)) is the engine to wrap | a native CPU with no global clock: events at random sites, which the cabinet's stepping has to respect rather than force into lockstep |
| von Neumann's 29-state CA | the universal constructor, ([three kinds of universal constructors](../../characters/john-von-neumann/sources/three-kinds-of-universal-constructors.md)) | a native CPU stepping the 29-state grid, watched building a copy of itself |

The display side is shared. A grid engine draws through the raster framebuffer and cell renderer
([DESIGN.md](DESIGN.md#raster-a-vanilla-virtual-video-display-and-a-cell-renderer)), so CAM-6, the
MFM and the 29-state CA all get the same views, recordings and inspector. A wrapper is also what
Snap! sees: one block library per engine, with commands, reporters and hat blocks over the same
wrapper ([snap-logo-brian-jens](../../repo-shows/snap-logo-brian-jens/README.md)).

A native CPU still has core when its devices need it, since the 340 fetches its display list
from memory, and it steps in cycles so device timing stays honest. It has no instruction words,
so the disassembler has nothing to show. Its source map is the TypeScript itself: from the step
or device call that wrote a word, to the line of TypeScript that made it.

These are not six skins over one processor. Their differences are exactly
why the CPU contract stays small: a plugin owns its stepping, word/memory
semantics, and machine-specific I/O boundary. Shared cabinet services—run,
stop, inspection, recording, debugger, and host presentation—sit outside that
boundary. A PDP-10 should not pretend its channels are PDP-7 IOTs; an Apple
II should not pretend its soft switches are IOT pulses, nor MIX its `IN`/`OUT` blocks.

## CPUs are devices

The cabinet already runs two processors. The Type 340 is a display *processor*: it has its own
program counter (`dac`), fetches its own instruction stream from core, executes it, branches,
calls subroutines (`DJS`), and raises interrupts. In the code it is a `Device` with a `tick()`
and a pair of `fetch`/`store` closures onto core ([type340.ts](src/plugins/type340.ts)). The
PDP-7 is the other processor. The only things that make it special are that the `Cabinet`
calls its `step()` first and that it masters the IOT bus.

So the general rule is the one the 340 already follows:

- **A unit** is anything with state that advances on the clock: `tick(cycles)`, `reset()`, and
  optionally `irq()`.
- **A processor** is a unit with a program: a PC, an instruction stream it fetches from some
  memory, a disassembler, and source maps. The PDP-7, the 340, a Turing machine and a MIX are
  processors. So is a native CPU, whose "program" is TypeScript.
- **A bus master** is a processor that issues requests to other units: the PDP-7's IOTs, the
  340's core fetches and pen interrupts, a Snap! script's device blocks.
- **Memory** is a unit too, shared by whoever is wired to it: the 340 and the PDP-7 share core
  today.

**Several processors in one cabinet** then follows naturally: a list of units, each ticked at
its own rate on one clock, wired by memory ports and request ports. The PDP-7, the 340, a CAM-6
stepping its planes, a raster display with layers and a tile and sprite engine, and a Turing
engine reading a transition table out of shared memory (§ below) can all sit on one backplane.
Each one shows up in the debugger with its own PC, trace, disassembler and source maps, which
the memory panel already does for the 340's display words.

**What changes in the code** is small and can come when the second bus master needs it:
`Cabinet` keeps `cpu` as the processor that masters the IOT bus, for compatibility, and gains a
list of processors that `step()` ticks alongside the devices. A `Processor` interface
(`pc`, `step()`, `read`, `write`, a disassembler) is shared by the PDP-7 and the 340, so the
panels stop special-casing the 340.

**Snap!, then, can be either.** As a bus master it is a native CPU whose program is blocks,
driving the 340 and the teletype through their device calls. As a unit controlled by another
processor it is a device: the PDP-7 sends it requests and Snap! answers them. Same wrapper, two
wirings, and the cartridge picks which.

## Devices can travel farther than CPUs

A device should travel with its own abstract interface: methods, properties,
status flags, events, and any memory regions it exposes. A cartridge binds
that interface to a selected CPU and memory system. It can map methods to
instruction definitions, IOT pulses, MMIO registers, or channels; map
properties and buffers to addresses and layouts; and map device events to
CPU-specific flags and interrupt lines. A machine-specific adapter can
convert protocols between the stable device contract and the guest's actual
hardware conventions. Today Cabinet's `Device.iot` is the PDP-7-facing port;
an Apple II or PDP-10 cartridge needs its own adapter, not a fiction that all
machines share one IOT bus.

The same separation can apply to instruction extensions. A device package may
describe an abstract operation—its operands, effects, timing needs, and
device-facing semantics—and optionally provide instruction definitions for
machines that can expose those operations in their instruction stream. The
selected CPU plugin must explicitly bind those definitions to available
encodings and implement their architectural effects. If the guest CPU has a
fixed ISA or no safe extension point, the device remains reachable through its
native IOT, memory-mapped register, channel, or message port instead. This is
not permission to inject colliding opcodes into an unrelated processor: the
cartridge composes compatible definitions and wiring, and the CPU remains the
authority on what its instruction words mean.

The cartridge can also provide a smart adapter in JavaScript: translate a
device's abstract methods and properties into a CPU's instruction encodings,
IOT pulses, MMIO registers, channels, interrupt requests and flags. A device
can travel with a stable interface while each cartridge supplies the wiring
and protocol converter appropriate to its machine. The PDP-7 cartridge might
map a request to IOT plus AC bits; an Apple II cartridge might map the same
request to soft switches and paddle timers. The device contract stays put;
the machine-specific glue moves with the cartridge.

This is a design direction, not the current script mechanism. URL-loaded
cartridge scripts are constrained declarative data, not arbitrary JavaScript.
Executable adapters should be explicitly trusted modules or granted
capabilities with declared interfaces—not unrestricted code silently run
from a cartridge URL. The cartridge owns the choice and wiring; the host owns
the trust boundary.

Open Firmware's FCode is a useful nearby precedent, with a precise difference.
A PCI option ROM can carry tokenized Forth; Open Firmware executes that FCode
in its firmware interpreter so a card can initialize itself and publish
methods in the device tree before an operating system boots. The card brings
executable device support to the firmware environment, but it does not add
native opcodes to the host CPU. A cartridge can use the analogous pattern:
select device packages and bind their interfaces to the host machine. A
device may contribute an abstract instruction vocabulary or initialization
program, while the cartridge's CPU binding decides whether that vocabulary
can be represented as legal guest instructions. Otherwise it remains an IOT,
memory-mapped, or channel service. The PCI FCode image layout and loader path are visible in the
[OpenFirmware workspace](../../../OpenFirmware/ofw/tokenizer/readme.pci) and
[its FCode loader](../../../OpenFirmware/ofw/core/dlfcode.fth).

Mitch Bradley's PDP-7 Forth is another part of this story: the same language
can be implemented over a very different processor when its primitives and
threaded representation are mapped to that machine. His new PDP-7 system
boots on the emulated CPU and draws through the Type 340; it is a concrete
example of Forth as a machine-facing, extensible environment, not evidence
that one binary runs unchanged on every ISA. Cabinet's
[PDP-7 Forth notes](reference/PDP7-FORTH.md) document the connection to
Mitch's Open Firmware work. The detailed
[XCT-threading analysis on GitHub](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/reference/PDP7-FORTH.md#xct-the-instruction-that-executes-another-instruction)
shows how each Forth thread cell is itself a PDP-7 instruction.

At a higher level, [tiny-its](TINY-ITS.md) takes inspiration from Open
Firmware's discoverable Forth command environment and ITS DDT. It is intended
to inspect, configure, and operate a room of unlike machines and devices from
a teletype-like command surface. That control language is above the guest
instruction sets: commands can be added to the tool without pretending the
PDP-7, Apple II, PDP-10, MIX, or Turing machine share opcodes.

The Engelbart mouse and chorded keyset make this tangible. On the PDP-7, a
mouse can be adapted as a Type 340 light pen, while keyset chords become
teletype characters. On the Apple II, the same mouse's x/y become PDL(0) and
PDL(1), with its three buttons mapped to PB0-PB2; the chorded keyset becomes
keyboard input. Those are proposed emulation mash-ups, not claims that an
Engelbart device historically shipped with an Apple II. The instrument stays
the same; the adapters make it legible to each guest. See
[`ROADMAP.md`'s mash-ups](ROADMAP.md#13-emulation-mash-ups).

The raster plan applies the same composition rule to graphics:

There is a direct DEC precedent. The Type 340 remained a vector display
processor, with separately named Type 342 character generation, Type 343
slave-display control, and Type 347 subroutine options. A raster display can
have the same layered shape: a plain framebuffer is the pixel sink, while
optional cell, tile, and sprite engines produce or compose its contents. The
display need not become one monolithic “smart raster computer,” and a CPU can
use a framebuffer without installing every drawing engine. The framebuffer
is the raster display's primitive mechanism; cell, tile, and sprite engines
are optional producers or accelerators connected to it, much as character
generation enriches the 340 without replacing its vector core.

- A **dumb framebuffer** is a descriptor over memory—base pointer, dimensions,
	strides and pixel format. A program writes pixels; a host renderer shows
	them.
- A **smart cell/tile renderer** interprets cell state through a colour map
	or tile table and writes a raster image. A cellular-automaton rule changes
	the cells; the renderer decides how those states look.
- **Sprites** are composited records—position, shape or pixel pointer, and
	transparency—moved by changing data rather than teaching the CPU a new
	graphics instruction set.
- **CAM6** can be a cellular-automata device with rule tables and planes, or
	an independently stepped machine for side-by-side comparison against the
	same rule running in PDP-7 assembly or Forth.

The vector tube and raster display can coexist: the Type 340 continues to emit
segments, while framebuffer descriptors, cell renderers, tiles, sprites, and
pens form another display path. These are designs in
[`DESIGN.md`](DESIGN.md) and [`TODO.md`](TODO.md), not all shipped Cabinet
features. The CAM6 device, general framebuffer, tile renderer, and sprites
remain future work; the Apple II, PDP-10 and MIX processors are not implemented.

Forth and turtle graphics show this split in a working machine: the PDP-7
executes Forth and writes Type 340 display words; the 340 executes that drawing
program. The Turing-machine proposal asks a different question: where should
computation itself live?

### A Turing-machine cabinet inside another computer

A Turing machine's transition table and tape are the machine's computation,
not an ordinary peripheral protocol; by themselves they provide no keyboard,
framebuffer, or other I/O. It is naturally a CPU plugin when the Turing machine
is the computer being emulated: one `step()` performs one transition over its
tape. But a Turing engine can also be a **device** in another von Neumann
machine. In that configuration, the
host CPU keeps running its own ISA while a Turing engine reads a transition
table and tape from shared memory, updates the tape/head/state, and reports
status or interrupts through an attached control port. The same transition
table is then both program and data for the little engine; the host can
inspect, edit, checkpoint, or visualize it without translating it into the
host CPU's instructions.

Conceptually, the wiring might be:

```text
host CPU ───────┐                 ┌── software tape viewer / debugger
                ├── shared RAM ───┤
TM engine ──────┘                 └── framebuffer or vector display
	│
	└── start / stop / step / status / interrupt adapter
```

To attach this to different hosts, the Turing engine needs a memory-port
adapter for each cabinet's bus and a control-port adapter for that machine's
IOTs, memory-mapped registers, channels, or message interface. Shared memory
is a capability of the configured machine, not a claim that all processors
have the same bus. The backplane also defines scheduling and visibility: for
example, advance the TM by one transition at a deterministic point in the
master clock, so a host read cannot observe a half-written transition. A
later design could allow independent rates, but it still needs explicit
ordering and memory-consistency rules.

**A bounded window can present an unbounded tape.** Keep a finite tape window
resident in shared memory, with guard bounds around the head. When a completed
transition moves the head across a guard, raise an interrupt before the next
step. The host can advance the window, initialize newly exposed cells as blank,
and page older nonblank regions to disk-backed storage. A separate viewer can
scroll its viewport to keep the head visible. The Turing machine sees a tape
that extends as needed; physical memory and backing storage remain finite. This
interrupt-and-paging scheme is a design option, not a current Cabinet feature.

Because the tape and transition table are data in core, the host can provide
the visualization without requiring special display hardware. A software
panel can show state, scanned symbol, tape cells, and head position; a raster
device can render cells as pixels or tiles; a vector display can draw a tape
diagram and moving head. If the host already has a framebuffer, tile engine,
or Type 340, the Turing device need not know which one is drawing it. It
publishes inspectable state; the cabinet routes that state to whichever
renderer is wired in.

That makes the Turing engine a particularly clear demo of the architecture:
the same device could sit beside a PDP-7, an Apple II, or a PDP-10, even
though their native instructions, memory widths, and I/O conventions differ.
The adapters and shared-memory map change; the transition semantics do not.
Conversely, the Turing toolkit can still be the CPU itself when the experiment
is to build a machine out of a machine. Minsky's universal machine makes
transition tables universal as data, but it does not automatically provide
the host-visible device contract. See the [`packages/turing` schema](../turing/SCHEMA.yml),
[`TinyTeco`](../tiny-teco/README.md), and the separate stretch goal in
[`tiny-teco`'s design](../tiny-teco/README.md#the-trick-marvin-already-played).

## Add the next machine when it is needed

The design is not “never add another processor or device.” It is “add one
when a real program, corpus, artifact, or teaching goal makes the need
concrete.” The plugin should state its visible contract, cite its primary
evidence, expose inspectable state, and earn an acceptance test. A shared
instrument can have several adapters; a shared renderer can consume several
machine formats. Neither requires pretending the underlying machines are the
same.

That is the practical escape from both wheels: do not rebuild SIMH's entire
scope to run PIXIE, and do not turn the display processor into another general
computer. Preserve historically meaningful guest behavior, borrow proven host
ideas, and let the next useful processor or device arrive on demand.

## Reading and sources

- Myer and Sutherland, [*On the Design of Display Processors* (1968)](../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md).
- Supnik, [*Writing a Simulator for the SIMH System*](https://simh.trailing-edge.com/docs/simh.pdf), including SIMH's MIMIC lineage.
- [Cabinet manifesto](MANIFESTO.md), [implementation design](DESIGN.md), [cartridge format](CARTRIDGES.md), and [SIMH source map](SIMH-MAP.md).
- [Roadmap: mouse/keyset mash-ups](ROADMAP.md#12-the-engelbart-mouse-and-chorded-keyset) and [virtual devices on unlike CPUs](ROADMAP.md#13-emulation-mash-ups).
- [Turing machine schema](../turing/SCHEMA.yml), [TinyTeco's UTM](../tiny-teco/README.md), and [CAM6/raster design](DESIGN.md).
- [Robert M. Supnik](../../characters/bob-supnik/README.md), [Philip L. Budne](../../characters/phil-budne/README.md), and [Lars Brinkhoff](../../characters/lars-brinkhoff/README.md).
- Vanessa Freudenberg, [SqueakJS JIT notes](../../characters/vanessa-freudenberg/sources/jit-notes/jit.md) and [memorial profile](../../characters/vanessa-freudenberg/README.md).

↑ [Cabinet README](README.md) · [Manifesto](MANIFESTO.md) · [SIMH map](SIMH-MAP.md)
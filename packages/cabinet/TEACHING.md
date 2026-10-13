# Forth, the 340, and co-processors in one core: what the cabinet teaches

Don Hopkins, October 2026. For Mitch Bradley, Alan Kay, Heinz Lemke, Norman Margolus, Roy
Eagleson's students, and anyone who teaches computer science and wants a machine small enough to
see all at once.

This page is the overview. It says what has been built and why, which ideas recur, and where
CAM-6 comes in. Each section links to the detailed page.

**Try it first.** Each one boots in the browser, and a DEMO button plays a scripted tour:

| | |
|---|---|
| [FORTH + TURTLE](https://hyperties.org/cabinet/forth/) | Mitch's PDP-7 Forth drawing turtle graphics on the Type 340 |
| [ULTIMATE MACHINE](https://hyperties.org/cabinet/ultimate/) | Minsky's box that switches itself off. Click its switch with the light pen |
| [TURING MACHINE](https://hyperties.org/cabinet/turing/) | a Turing machine co-processor, its tape drawn by the 342 character generator: busy beavers, a binary counter, Minsky's universal machine |
| [PIXIE SYMELEC](https://hyperties.org/cabinet/symelec/) | Heinz Lemke's 1972 interactive graphics editor, running from his listing |

## The machine, in one paragraph

A PDP-7 has 8K words of 18-bit core. It has one accumulator, and it reaches its devices through
IOT instructions: plugging in a device literally added instructions to the machine. The Type 340
display is a second processor. It has its own program counter and fetches its own instruction
stream, the display file, from the same core the PDP-7 uses. It runs subroutines in that stream
(DJS) and interrupts the PDP-7 when it stops or the light pen sees something. The PDP-7 writes
a program; the 340 runs it. Everything in this cabinet grows out of that arrangement.
[reference/GUIDE.md](reference/GUIDE.md) is the student's tour of the iron.

## Seven themes

### 1. A display is a processor, and a program can write programs for it

Mitch's Forth computes on the PDP-7 and writes 340 instructions into a display list; the 340
executes them and refreshes the tube. The turtle's `FD` doesn't draw a line. It compiles a vector
instruction. `turing.fs` goes further: it builds a 40-line subroutine for the tape's cell
dividers once, then calls it every frame with a single DJS. The labels are stored as packed 342
strings, and each costs four display words to draw.

This is Myer and Sutherland's **wheel of reincarnation** (1968), which puts the 340 at the
"cardinal point" where a display processor turns into a computer. The cabinet doesn't hide this.
The memory panel disassembles the 340's display words next to the PDP-7's own instructions.
[ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#the-wheel-of-reincarnation) follows the
wheel through NeWS, AJAX and GPUs.

### 2. A device's interface becomes vocabulary

A device's IOTs are its interface. In Forth each one becomes a word, defined in one line by its
shape (pulse, read, skip, write):

```forth
705421 iot-skip  tm-running?  \ TMSR ( -- flag )
705424 iot-pulse tm-go        \ TMGO ( -- ) reload, run
```

Plugging in a device adds instructions to the PDP-7, and adding those words gives the language
the same new instructions. [code.fs](tapes/pdp7forth/code.fs) is the start of a PDP-7 assembler in
Forth, which is how those defining words are made. [interrupt.fs](tapes/pdp7forth/interrupt.fs)
writes interrupt handlers in Forth. The ISR patches the inner interpreter's NEXT, so the handler
runs at the next word boundary.

### 3. One co-processor contract, used again and again

The Turing engine (device 54) copies the 340's contract exactly. Its program, a control block and
a transition table, sits in core. One IOT starts it, with AC holding the address, and another
restarts it once the host has fixed something. It runs at its own rate, sets flags, and
interrupts when it halts or needs the host. [TURING-ENGINE.md](TURING-ENGINE.md#the-340-as-the-model)
has the side-by-side table. The tape is unbounded: when the head leaves its window in core, the
engine pages, either by itself or, with a fault interrupt, by asking the PDP-7 to do it. That is
a page-fault protocol, small enough to read in one sitting.

The same contract fits a power switch. Minsky's Ultimate Machine (device 56) is the smallest unit
that has one, and its only act is to use it on itself. It tests the rule that every unit on the
backplane has a power switch the unit itself can flip
([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices)). CAM-6 is next
(below).

### 4. A shared data format means nothing gets translated

The Turing engine's tape window holds 6-bit cells, three to a word. That is exactly the 340's
character-mode format, so the tape *is* a display list. Minsky's alphabet `0 1 y A` is chosen
from Type 342 codes (60, 61, 31, 01) for that reason. `turing.fs` copies 13 words of the window
into each frame. It never converts them: the 342 draws the engine's own cells. When two
processors agree on a memory format, the interface is the memory.

### 5. Forth as a compiler for other machines' tables

Toffoli and Margolus programmed CAM-6 by writing its rules in Forth, which compiled them to lookup
tables for the hardware. TM-Forth ([tmforth.ts](src/tmforth.ts)) does the same for the Turing
engine. Machines are written as Forth rules, or as Minsky's TECO rows from AI Memo 33, and
compiled into the engine's table format. The tests check that both notations produce the same
table, and that the result matches Cherniak's 1980s PCOMP disk, machine by machine.

[tm340.ts](src/tm340.ts) then emits each machine as a Forth record
([pcomp-tm.fs](tapes/pdp7forth/pcomp-tm.fs)), and loading the record defines a word with the
machine's name. Today TM-Forth runs on the host. Moving it into the PDP-7's own Forth, so the
machine compiles its own tables, is the next step.

### 6. Inspectable all the way down

Nothing is a black box. Forth itself is compiled the way Mitch compiles it under SIMH: the kernel
boots, reads its sources from the paper-tape reader, and the core image is kept
([forth.ts](src/forth.ts)). Every part a program draws can carry a **tag**, a 340 word saying
what is being drawn. Hovering it with the pen names it, and the plan is for a pie menu to offer
what can be done to it ([TAGS-AND-PIES.md](TAGS-AND-PIES.md)). Heinz's 1972 ring structures run
inside Forth unchanged, and a panel draws them as they grow
([FORTH-RINGS.md](FORTH-RINGS.md)). The [MANIFESTO.md](MANIFESTO.md) states the attitude: the
1960s machine stays honest, and everything around it is ours to make better.

### 7. Small machines make costs visible

8K words is a budget you can feel. The Turing view and the nine machines did not fit until the
strings were packed three characters to a word, a trick PDP-7 programmers knew well. Forth
reads 80 columns, and so the generator keeps its lines short. The Ultimate Machine's animation
speed is a question of how many frames Forth draws while the hand moves. Each limit is a lesson
in representation, and students hit them for real, not in an exercise.

## Anatomy: every layer, and the file it lives in

A cartridge is a stack of languages, each one compiling or interpreting the next. Here is the
whole stack of the TURING MACHINE cartridge. The other Forth cartridges differ only in which
sources they compile in and which devices they plug in.

```text
 the page        hyperties.org/cabinet/turing/          CabinetPage.svelte, CabinetApplet.svelte
   │
 cartridge       forthProgram({ id: 'turing', ... })    cabinet-programs.js  (JavaScript)
   │  picks: kernel, Forth sources, devices, typeAhead, demo script, help
   │
 backplane       Cabinet: one CPU, devices on the IOT bus, one clock     cabinet.ts  (TypeScript)
   ├── PDP-7 CPU        Pdp7                                              pdp7.ts
   ├── Type 340         Type340: a display processor fetching from core   type340.ts
   ├── teletype, paper tape reader, clock                                 teletype.ts papertape.ts
   └── device 54        TuringDevice: a TM processor fetching from core   turing.ts
   │
 8K words of 18-bit core, shared by all three processors
   │
 PDP-7 assembly  sop.s + kernel-names-full.s [+ pixie.s + rsppix.s] + end.s
   │             assembled in the page by as7.ts (Ken Thompson's assembler, reimplemented)
   │
 Forth           prelude.fs does.fs turtle.fs code.fs interrupt.fs tags.fs turing.fs pcomp-tm.fs
   │             compiled ON the emulated PDP-7, read from the paper tape reader
   │
 co-processor    340 display list: vectors, 342 text, DJS subroutines, DTG tags
 programs        TM control block, transition table, tape window
                 (both written into core by Forth, run by their own processors)
   ▲
 host compilers  TM-Forth (tmforth.ts) → records (tm340.ts) → pcomp-tm.fs
                 from pcomp.tmf, Minsky's rows and Cherniak's disk
```

### The layers, file by file

**The page and the cartridge** (JavaScript, Svelte):

| File | What it is |
|---|---|
| [cabinet-programs.js](../../apps/ties/src/lib/cabinet-programs.js) | every cartridge on the menu, as an object: what to load, how to build it, what devices to plug in |
| [`FORTH_EXTRAS`](../../apps/ties/src/lib/cabinet-programs.js#L106) | the Forth sources a cartridge can add, by name |
| [`forthProgram`](../../apps/ties/src/lib/cabinet-programs.js#L115) | the Forth cartridge factory: assembles the kernel, compiles the Forth, boots it |
| [ULTIMATE](../../apps/ties/src/lib/cabinet-programs.js#L382), [TURING](../../apps/ties/src/lib/cabinet-programs.js#L404), [SYMELEC](../../apps/ties/src/lib/cabinet-programs.js#L204) | three cartridges: extras, `peripherals`, `typeAhead`, demo, help |
| [CabinetApplet.svelte](../../apps/ties/src/lib/CabinetApplet.svelte) | the tube, panels, teletype, pen and DEMO button around any cartridge |
| [CARTRIDGES.md](CARTRIDGES.md) | where cartridges are going: a directory of resources and build steps, not code |

**The backplane and the device emulators** (TypeScript, [src/plugins/](src/plugins/)):

| File | Unit | IOT device |
|---|---|---|
| [cabinet.ts](src/cabinet.ts) | the backplane: steps the CPU, ticks every device, routes IOTs | |
| [bus.ts](src/bus.ts) | what a CPU puts on the I/O bus; devices never see the ISA | |
| [pdp7.ts](src/plugins/pdp7.ts) | [`Pdp7`](src/plugins/pdp7.ts#L49), the CPU, ported from Open SIMH | |
| [type340.ts](src/plugins/type340.ts) | [`Type340`](src/plugins/type340.ts#L151): the display processor. [`tick`](src/plugins/type340.ts#L224) fetches and runs a display word, [`iot`](src/plugins/type340.ts#L260) answers the PDP-7, [DJS](src/plugins/type340.ts#L464) calls a display subroutine | 05, 06, 07 |
| [turing.ts](src/plugins/turing.ts) | [`TuringEngine`](src/plugins/turing.ts#L186), the shape-independent core; [`TuringDevice`](src/plugins/turing.ts#L439), its PDP-7 face ([`iot`](src/plugins/turing.ts#L456), [`tick`](src/plugins/turing.ts#L493)); [`RleTape`](src/plugins/turing.ts#L96), the paged-out tape; [`TuringCpu`](src/plugins/turing.ts#L528), the same engine as a CPU of its own | 54 |
| [ultimate.ts](src/plugins/ultimate.ts) | [`UltimateMachine`](src/plugins/ultimate.ts#L86): lever, lid, arm, phases, power switch | 56 |
| [teletype.ts](src/plugins/teletype.ts), [papertape.ts](src/plugins/papertape.ts), [clock.ts](src/plugins/clock.ts), [rb09.ts](src/plugins/rb09.ts) | keyboard and printer, the reader Forth compiles from, the line clock, UNIX's disk | 03/04, 01, 00, 71 |
| [lightpen.ts](src/plugins/lightpen.ts) | the pen as host input; the 340 decides what it sees | |
| [tiny-titan.ts](src/plugins/tiny-titan.ts) | the far end of PIXIE's link to Cambridge's Titan | |

**The toolchain** (TypeScript): [as7.ts](src/asm/as7.ts) is Ken Thompson's PDP-7 UNIX assembler,
which Mitch builds his Forth with. [cambridge-as7.ts](src/asm/cambridge-as7.ts) reads Cambridge's
1972 dialect. [disasm.ts](src/disasm.ts) disassembles PDP-7 words and 340 display words for the
memory panel. [forth.ts](src/forth.ts) does Mitch's `make`:
[`assembleForthKernel`](src/forth.ts#L25) concatenates and assembles the kernel, and
[`compileForth`](src/forth.ts#L101) boots it, mounts the `.fs` files on the paper tape reader,
types `TAPE`, and keeps the core when the machine is done reading.

**PDP-7 assembly** ([tapes/pdp7forth/](tapes/pdp7forth/)):

| File | Layer |
|---|---|
| [sop.s](tapes/pdp7unix/sop.s) | the opcode symbols, from the PDP-7 UNIX sources |
| [kernel-names-full.s](tapes/pdp7forth/kernel-names-full.s) | Mitch's Forth kernel, with whole names: [`next`](tapes/pdp7forth/kernel-names-full.s#L66) is the inner interpreter, [`cold`](tapes/pdp7forth/kernel-names-full.s#L679) the boot |
| [kernel.s](tapes/pdp7forth/kernel.s) | Mitch's kernel as he wrote it |
| [pixie.s](tapes/pdp7forth/pixie.s) | **the Forth glue** for PIXIE's rings (below) |
| [rsppix.s](tapes/pdp7forth/rsppix.s) | **the shared ring library**, RSPPIX, Cambridge 1972 (below) |
| [end.s](tapes/pdp7forth/end.s) | marks where the dictionary starts |
| [utm-driver.s](tapes/turing/utm-driver.s) | a Turing engine driver in plain PDP-7 assembly: [`int,`](tapes/turing/utm-driver.s#L50) slides the tape window on a fault |

**Forth** ([tapes/pdp7forth/](tapes/pdp7forth/)), compiled on the machine in this order:

| File | Layer |
|---|---|
| [prelude.fs](tapes/pdp7forth/prelude.fs), [does.fs](tapes/pdp7forth/does.fs) | the language: `SPACE`, `[']`, `CREATE … DOES>` |
| [turtle.fs](tapes/pdp7forth/turtle.fs) | the 340 library: [`dl,`](tapes/pdp7forth/turtle.fs#L37) appends a display word, [`vec`](tapes/pdp7forth/turtle.fs#L73) compiles a vector, [`fd`](tapes/pdp7forth/turtle.fs#L108) and friends are the turtle |
| [pixie.fs](tapes/pdp7forth/pixie.fs) | **the Forth wrapper** for rings: `RINGS`, `NAMED`, `.RING`, `RCOUNT` |
| [code.fs](tapes/pdp7forth/code.fs) | PDP-7 code words, written in Forth: [`iot-pulse` `iot-read` `iot-skip` `iot-write`](tapes/pdp7forth/code.fs#L84) turn a device's IOTs into words |
| [interrupt.fs](tapes/pdp7forth/interrupt.fs) | interrupts in Forth: the [ISR](tapes/pdp7forth/interrupt.fs#L59) plants a jump in NEXT, and [`interrupts-on`](tapes/pdp7forth/interrupt.fs#L69) wires location 1 |
| [tags.fs](tapes/pdp7forth/tags.fs) | [`tag"`](tapes/pdp7forth/tags.fs#L30): DTG words that name what is drawn |
| [ultimate.fs](tapes/pdp7forth/ultimate.fs) | **device code**: device 56's IOTs as words, the box drawn from its registers, the [`plate`](tapes/pdp7forth/ultimate.fs#L123) the pen can see, [`pen-check`](tapes/pdp7forth/ultimate.fs#L242), [`ultimate`](tapes/pdp7forth/ultimate.fs#L250) |
| [turing.fs](tapes/pdp7forth/turing.fs) | **device code**: device 54's IOTs as words, [`tm-load`](tapes/pdp7forth/turing.fs#L57), the [`tape`](tapes/pdp7forth/turing.fs#L157) drawn from the window, [`run`](tapes/pdp7forth/turing.fs#L246), [`demo`](tapes/pdp7forth/turing.fs#L253) |
| [pcomp-tm.fs](tapes/pdp7forth/pcomp-tm.fs) | **data**, generated on the host: one record and one loading word per machine |
| [scheme.fs](tapes/pdp7forth/scheme.fs) | a tiny S-expression evaluator, a sketch |

**Host-side compilers for the co-processors** (TypeScript):
[tmforth.ts](src/tmforth.ts)'s [`compileTmForth`](src/tmforth.ts#L941) compiles TM-Forth.
[tm.ts](src/tm.ts) is the table format and a reference [`runTm`](src/tm.ts#L364). [tm340.ts](src/tm340.ts)'s
[`tm340Record`](src/tm340.ts#L89) and [`pdp7TmDeck`](src/tm340.ts#L123) write the Forth records.
The machines themselves are in [pcomp.tmf](tapes/turing/pcomp.tmf) and
[minsky-7x4.tmf](tapes/turing/minsky-7x4.tmf).

### Follow one machine down through every layer: BUSY2

1. **TM-Forth source**, [pcomp.tmf](tapes/turing/pcomp.tmf#L27), as Cherniak's disk has it:

   ```forth
   tm: pcomp-busy2
   note" BUSY2.TM: a 2-state Busy-Beaver takes 6 steps to print 4 ones."
   symbols: 0 1 ;
   tm*-table
     1 0   1 R  2
     1 1   1 L  2
     2 0   1 L  1
     2 1   1 L  0
   end-table
   ```

2. **The host compiles it.** `compileTmForth` builds the table. `pdp7TmDeck` runs it (6 steps),
   picks a speed, and writes a record of numbers into
   [pcomp-tm.fs](tapes/pdp7forth/pcomp-tm.fs): a header, the alphabet as 342 codes, the table
   in the engine's format (`69634` is *write 1, move right, go to 2*), the tape, and the names
   packed three characters to a word. Then it adds one word:

   ```forth
   : busy2 ( -- ) tm-busy2 (load) ;
   ```

3. **The PDP-7 compiles that.** At boot, `compileForth` feeds the file through the paper tape
   reader, and Mitch's kernel lays the record into the dictionary in core.
4. **You type `BUSY2`.** [`tm-load`](tapes/pdp7forth/turing.fs#L57) copies the tape into the
   window and fills the control block with addresses in core. It then issues TMLA through a word
   that [`iot-write`](tapes/pdp7forth/code.fs#L87) made: `705404 iot-write tm-go-at`.
5. **The IOT crosses the bus.** [`Pdp7.iot`](src/plugins/pdp7.ts#L420) puts device 54 on the
   bus. [`TuringDevice.iot`](src/plugins/turing.ts#L456) reads the TCB out of core, and from then
   on [`tick`](src/plugins/turing.ts#L493) runs transitions: it fetches table entries and
   rewrites tape cells in the same 18-bit core the PDP-7 uses.
6. **Forth draws it.** Each frame, [`tape`](tapes/pdp7forth/turing.fs#L157) copies 13 window
   words into the 340's display list unchanged, because the cells are already 342 codes. It then
   calls the divider subroutine with DJS, and labels the state with packed strings.
7. **The 340 runs that.** [`Type340.tick`](src/plugins/type340.ts#L224) fetches the display list
   from core, draws the tape in character mode, follows DJS, and carries DTG tags. The page turns
   its segments into phosphor on the canvas, and hovering the tape says "The tape".

### The PIXIE ring stack: a 1972 library, shared by two languages

The same ring code serves Heinz's SYMELEC and Mitch's Forth, unchanged:

```text
rsppix.asm         Cambridge 1972, Heinz's listing           tapes/symelec/
   │  scripts/translate-cambridge.mjs  (Cambridge dialect → as7, do not edit the output)
rsppix.s           the shared library: RSETUP RINIT RCAR RINSRT ... the garbage collector
   │  rsppixForForth (forth.ts): moved up to px.org, its variables left to pixie.s
pixie.s            the glue, in assembly: SYMELEC's variables and error exits where RSPPIX
   │               expects them, and a Forth header per routine (jms rsetup; jmp next)
pixie.fs           the wrapper, in Forth: RINGS NAMED .RING RCOUNT RFIRST RNEXT
   │
RINGS panel        draws the rings in 3D as they grow, from RSAVINS
```

- **The library:** [rsppix.asm](tapes/symelec/rsppix.asm), from the
  [listing](tapes/symelec/rsppix-listing.txt), translated by
  [translate-cambridge.mjs](scripts/translate-cambridge.mjs) into [rsppix.s](tapes/pdp7forth/rsppix.s)
  ([`rsetup`](tapes/pdp7forth/rsppix.s#L5), [`rinsrt`](tapes/pdp7forth/rsppix.s#L512)).
  SYMELEC itself ([symelec.s](tapes/symelec/symelec.s)) is built on the same code.
- **The glue:** [pixie.s](tapes/pdp7forth/pixie.s) lays out the memory (`px.org`, the ring area,
  the stacks) and wraps each routine as a Forth primitive. It does exactly the job SYMELEC's
  own code does for RSPPIX.
- **The wrapper:** [pixie.fs](tapes/pdp7forth/pixie.fs) gives Forth names and loops to it.
- **The build:** [`assembleForthKernel`](src/forth.ts#L25) puts pixie.s and rsppix.s between the
  kernel and end.s. [FORTH-RINGS.md](FORTH-RINGS.md) tells the whole story.

The rings and the Turing view don't both fit in 8K, so the TURING and ULTIMATE cartridges set
`pixie: false`. The cartridge decides which libraries a machine gets, just as the person
building a real PDP-7 decided what went on its tape.

### Follow one pen tap: the Ultimate Machine's switch

[`plate`](tapes/pdp7forth/ultimate.fs#L123) draws the switch with the 340's light pen enabled,
and nothing else on the screen is pen-sensitive. A click becomes a pen hit in
[type340.ts](src/plugins/type340.ts), which freezes the display and raises an interrupt. The
[ISR](tapes/pdp7forth/interrupt.fs#L59) plants a jump in NEXT, so Forth runs
[`on-interrupt`](tapes/pdp7forth/ultimate.fs#L219) at the next word boundary: it counts the hit
and resumes the 340 with IDRS. Once a frame, [`pen-check`](tapes/pdp7forth/ultimate.fs#L242)
takes the count (a CODE word, so the handler can't slip in between the read and the clear) and
flips the lever with UMON or UMOF,
and device 56 ([`UltimateMachine.iot`](src/plugins/ultimate.ts#L203),
[`tick`](src/plugins/ultimate.ts#L192)) opens the lid and sends the hand out. Forth reads the
phase, lid and arm registers each frame and redraws them. The scripted demo makes the same
touch at [`ULTIMATE_SWITCH`](src/forth.ts#L180).

## Minsky's machines, as lessons

- **The Ultimate Machine**: a unit whose function is to turn itself off. It raises lifecycle,
  reset and who owns the power switch, and it is funny, which helps.
- **The universal Turing machine**: AI Memo 33's 7-state, 4-symbol UTM, recovered from Minsky's
  TECO program. Students can watch one machine run another written on its own tape, and the
  display shows the rule that fires at each step.
- **The busy beavers**: BB5 takes 11,798,826 steps to halt. Watching it run free while the engine
  pages its tape thousands of cells away is a feel for the halting problem no proof gives.

## Where CAM-6 fits

CAM-6 is the third co-processor on the same contract, and the one these ideas originally came from.

- **The device.** Its rule table (a lookup table) and its cell planes live in PDP-7 core, as the
  Turing engine's table and tape do. IOTs load a rule, step a generation, and read and write
  cells. It runs off-the-shelf CAM-6 rules.
- **The language.** Toffoli and Margolus's rule compiler is ported into Mitch's PDP-7 Forth. Don
  cloned it in Mitch's Forth decades ago, and his [CAM6](https://github.com/SimHacker/CAM6)
  simulator (CAM6.js with jsforth) runs the same rules in the browser today. TM-Forth was the
  rehearsal.
- **The picture.** Cells want pixels and the 340 draws vectors, so the plan adds two raster
  devices that also read core directly: a cell renderer (state through a colour map) and a
  framebuffer described by a byte pointer and strides
  ([DESIGN.md](DESIGN.md#raster-a-vanilla-virtual-video-display-and-a-cell-renderer)). The 340
  can still label and annotate the cells, as it does the Turing tape.
- **The CAM-off.** The same rule runs twice side by side: once on the CAM-6 device, compiled from
  Forth, and once as plain PDP-7 assembly on the bare CPU. The trace counts cycles per generation
  for each. That is the wheel of reincarnation as an experiment students can run
  ([DESIGN.md](DESIGN.md#cam-on-the-pdp-7-a-cam-off)).
- **The layers.** JavaScript runs the PDP-7, which runs Forth, which compiles the rule, which
  drives the CAM device, which draws on the display. Each layer has its own panel and source
  map.

CAM-6 is designed but not built yet. Everything above it on this page runs today.

## For particular readers

- **Mitch:** your Forth is the spine of all of this. The cabinet runs
  [kernel-names-full.s](tapes/pdp7forth/kernel-names-full.s), a version that keeps names whole
  ([FORTH-RINGS.md](FORTH-RINGS.md)), and compiles it on the emulated machine from paper tape, as
  your prelude.py does. [code.fs](tapes/pdp7forth/code.fs), [interrupt.fs](tapes/pdp7forth/interrupt.fs),
  [ultimate.fs](tapes/pdp7forth/ultimate.fs) and [turing.fs](tapes/pdp7forth/turing.fs) are
  what has been built on it.
- **Alan:** the machine is live and inspectable down to the core word. Devices are objects that
  answer messages (IOTs), and the 340 sits where Sketchpad's lineage and the wheel of
  reincarnation cross. [ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md) is the
  longer argument, including why a device's contract travels farther than any CPU.
- **Heinz:** PIXIE's 1972 answers are under all of this. Display files are compiled from
  structures, the light pen finds its owner, and rings hold the data
  ([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md)). [reference/FORTH-TURTLE-340.md](reference/FORTH-TURTLE-340.md)
  shows students building the same things in Forth and then reading how you did them.
- **Norman:** the Turing engine is a dry run for a CAM-6 device on the PDP-7, with rules compiled
  from Forth as you and Tommaso did ([DESIGN.md](DESIGN.md#cam-on-the-pdp-7-a-cam-off)).

## Exercises

1. Write a new Turing machine in TM-Forth, add it to [pcomp.tmf](tapes/turing/pcomp.tmf),
   regenerate, and load it by name on the PDP-7.
2. Make `turing.fs` draw the tape with no copy at all: DJS into the window itself, and work out
   what the ESC that ends a 342 string needs.
3. Turn on host paging and write the tape-fault handler in Forth with
   [interrupt.fs](tapes/pdp7forth/interrupt.fs): spill the tape to paper tape or DECtape.
4. Time a busy beaver at `1 SPEED`, `100 SPEED` and `0 SPEED`. Where do the cycles go?
5. Give the Ultimate Machine a second switch. Who wins now?
6. Read [reference/FORTH-TURTLE-340.md](reference/FORTH-TURTLE-340.md)'s exercises and compare
   your answers with SYMELEC's.

## Reading map

| If you want | Read |
|---|---|
| the iron, for students | [reference/GUIDE.md](reference/GUIDE.md), [reference/GUIDE-340.md](reference/GUIDE-340.md) |
| Forth, turtles and light pens as a course | [reference/FORTH-TURTLE-340.md](reference/FORTH-TURTLE-340.md) |
| co-processors, devices, lineage | [ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md) |
| the Turing engine, the Ultimate Machine, TM-Forth | [TURING-ENGINE.md](TURING-ENGINE.md) |
| tags and pies | [TAGS-AND-PIES.md](TAGS-AND-PIES.md) |
| Forth holding PIXIE's rings | [FORTH-RINGS.md](FORTH-RINGS.md) |
| CAM-6 and raster devices, the plan | [DESIGN.md](DESIGN.md#cam-on-the-pdp-7-a-cam-off) |
| the attitude | [MANIFESTO.md](MANIFESTO.md) |
| what runs today | [README.md](README.md) |

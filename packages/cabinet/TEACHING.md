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

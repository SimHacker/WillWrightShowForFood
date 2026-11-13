# The plan: an exact Apple first, then everything that looks into it

Each step ends in a test that can fail and a number that gets written down. A step is done when its
test passes in Node and in the page. The order puts exactness first: nothing gets faster or more
transparent until it is checked against the oracles.

## The oracles

- **microM8**, the patched WebAssembly build in this directory, run beside the TypeScript machine on
  the same inputs; and the native build, for what the browser build can't show.
- **[SingleStepTests/65x02](https://github.com/SingleStepTests/65x02)** (MIT): JSON tests of every
  opcode, with the bus activity cycle by cycle.
- **Klaus Dormann's [6502 functional tests](https://github.com/Klaus2m5/6502_65C02_functional_tests)**
  (GPL-3.0): fetched and run, never vendored.
- **[apple2js](https://github.com/whscullin/apple2js)** and its CPU
  [cpu6502](https://github.com/whscullin/cpu6502) (MIT, TypeScript): a second opinion, and a speed
  comparison.
- **The ROMs and the printed listings**: the bytes the machine boots, and what Woz printed
  ([TRANSPARENCY.md](TRANSPARENCY.md#down-from-a-byte-in-rom-to-the-printed-page)).

## Steps

### 0. The baseline

[`scripts/microm8-bench.mjs`](../scripts/microm8-bench.mjs) already boots DOS 3.3 in the Go build
and runs four workloads flat out: Applesoft waiting for a key, a floating-point loop, hires line
drawing, and text scrolling. The same workloads, unchanged, run on the TypeScript machine from step
2 on. Add a WOZ boot and a disk-heavy one.

**Done when** emulated MHz and frame time for the Go build, in Node and in one browser, are in a
`BENCH.md` in this directory, with the commit, browser and computer they ran on.

### 1. The 6502 and 65C02

The processor module, the opcode table as data, the disassembler.

**Done when** every SingleStepTests case passes, registers, memory and bus cycles; Klaus's
functional and decimal tests pass for both variants.
**Measure** emulated MHz in Node, against cpu6502 on the same test program.

### 2. Memory map and an Apple ][+

Byte banks, read and write page tables, the soft-switch table, the language card, ROMs from a
microM8 profile.

**Done when** the machine boots to the Monitor and to Applesoft, and a differential run against
microM8 (same ROM, same keys at the same cycles) gives the same 64K at every vertical blank for a
minute of scripted input. Where the Go build can't report its memory per frame, the patch that adds
it goes into [FORK.yml](FORK.yml).

### 3. Video on the GPU

The mode log, the TypeScript reference decoder, the shaders ([STACK.md](STACK.md#video-on-the-gpu)).

**Done when** text, lores, hires and mixed modes match microM8's frames for a set of test screens;
the shader's address function equals the TypeScript one at every line and column; a program that
switches modes mid-line shows the split where the reference puts it; a vapor-lock program (Don
Lancaster's floating-bus sync) finds its marker and splits the screen at the scanline it chose.
**Measure** frame time on the CPU side (should be the upload only) and on the GPU.

### 4. Speaker and Disk II

The speaker as timestamps into an AudioWorklet; the Disk II card catching up by elapsed cycles; WOZ
bit streams.

**Done when** DOS 3.3 and ProDOS boot from sector images and from WOZ; a copy-protected WOZ boots;
the speaker's timestamps match microM8's clicks for the same program.

### 5. The //e and //e enhanced

Aux memory, 80-column text, double hires, the IOU, the 65C02.

**Done when** the same differential run as step 2 passes with aux memory; double hires test screens
match.

### 6. Cards

Videx and 2651 first, then the Super Serial Card, Mockingboard, SmartPort, mouse, SoftCard.

**Done when** each card's own tests from microM8 (where it has them, `videx_test.go`) pass in
TypeScript, and a program that uses the card runs the same on both machines.

### 7. Catch-up time, measured

Per-cycle ticking and catch-up, one unit at a time, behind a switch.

**Done when** both give the same differential results, and the faster one per unit is kept, with
its numbers.

### 8. Overlays, trace, profiler

Watch flags, planes, the instruction and bus traces, the profiler by PC and symbol
([TRANSPARENCY.md](TRANSPARENCY.md)).

**Done when** with no watches on, the bench is within 5% of step 7's numbers; with the
reader, writer and executor overlays on for all 64K, the cost is measured and listed; clicking a
hires pixel opens the routine that last wrote it.

### 9. The Monitor, from the printed page

Inventory the listings in the 1978 Red Book and the 1979 *Apple II Reference Manual*; transcribe the
Monitor; map the scans; assemble and compare byte for byte with the ROM.

**Done when** the assembled transcription equals the ROM, or every difference is listed with its
cause; stepping through `COUT` highlights the line on the scanned page.

### 10. Interpreter layers

Applesoft first, then SWEET 16, Integer BASIC, Pascal and Forth
([TRANSPARENCY.md](TRANSPARENCY.md#up-from-the-6502-to-the-program-it-is-interpreting)).

**Done when** a breakpoint on a BASIC line stops there; the profiler charges a BASIC program's
cycles to its lines, and the totals equal the 6502's.

### 10a. The graph and the first tours

Unit annotations (`models`, `abstracts`, `drives`), the Red Book figures as layers with regions,
live values on nodes, the logic analyser view; then the video and speaker tours
([TEACHING.md](TEACHING.md)).

**Done when** every unit and every soft switch links to a figure or says why it can't; from any
figure region the graph reaches the code that models it, the addresses that touch it and the ROM
lines that use them; a student can run each tour's experiment start to finish. The Disk II, game
I/O and slot tours follow once their sources are chosen.

### 10b. The video circuit in 3D

The video pipeline split into stages, the netlist of figures S-4, S-7, S-8 and S-11, the 3D scene
([TEACHING.md](TEACHING.md#the-video-circuit-in-3d)).

**Done when** each stage's value at every line and column equals what the reference decoder
implies; the netlist, simulated for a frame, gives the reference decoder's dots for every test
screen; the beam can be frozen, slowed and run backwards in the scene.

### 11. Rewind and sessions

Save files ([SAVE-FILES.md](../SAVE-FILES.md)) as the snapshot format, with the library and the
command line; the input log; the cabinet's session format; the microM8 freeze importer.

**Done when** rewinding to any cycle and running forward gives the same state hash as the first run;
a session recorded in one browser replays in another with the same hashes; save, load, save gives
the same bytes; a save with an unknown card loads and writes that card's part back unchanged.
**Measure** snapshot size, interval, and seek time.

### 11a. Speedrun tools

Frame advance, the input grid, branches, splicing, headless search in Node and workers
([TRANSPARENCY.md](TRANSPARENCY.md#speedruns-and-demos)).

**Done when** a run built by editing the grid replays to the same final state hash in another
browser; a search over key cycles finds a known random outcome in a game that seeds from the
Monitor's keyboard counter; seek time to any frame of a ten-minute run is measured.

### 12. Peers

Lockstep between two pages, rollback for late input, streaming for a peer that can't be
deterministic, a remote renderer and a remote keyboard over tiny-bus, ownership of devices.

**Done when** two pages stay in lockstep for ten minutes of a game, with equal hashes every frame;
a peer that joins mid-session catches up from a snapshot; the microM8 build joins as a streaming
peer.

### 13. Services

microM8's MCP tool names and HTTP control routes, served from Node, driving the TypeScript machine;
its debugger protocol for existing clients; tiny-titan's call namespaces.

**Done when** the scripts and agents that drive microM8 today drive the TypeScript machine
unchanged.

### 14. Compiling hot code, as an experiment

6502 basic blocks to JavaScript, invalidated by writes to their pages.

**Done when** the differential and SingleStepTests results are unchanged with it on, and its speed
on the step 0 workloads is written down, whether or not it wins.

## Not in order

The Spectrum and BBC profiles, Restalgia, microTracker, the 3D presentation, `dskalyzer` and a
TypeScript Logo each start when someone wants them, on the same oracles.

↑ [STACK](STACK.md) · [MODULE-MAP](MODULE-MAP.md) · [TRANSPARENCY](TRANSPARENCY.md) · [README](README.md)

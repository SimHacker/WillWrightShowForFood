# A transparent Apple ][: overlays, traces, source maps, rewind and peers

Debugging, tracing, profiling, heat maps, source maps, rewind and network sharing for the
TypeScript Apple ([STACK.md](STACK.md)): what microM8 has, what the TypeScript machine keeps, and
what it adds.

## What microM8 already shows

From its source and its [web debugger help](https://paleotronic.com/software/microm8/help/web-debugger/)
([MICROM8.md](../MICROM8.md#what-microm8-exposes)):

- **A web debugger**: pause, step, step over, step out, breakpoints that tell main from aux memory,
  memory search and edit, soft switches flipped live, a lookahead and the recent instructions
  (`debugger/websocket.go`).
- **Live rewind**: the recorder saves CPU state at intervals and memory changes as they happen, and
  plays forwards or backwards at 0.25× to 4× (`interpreter/recorder.go`, `player.go`,
  `cpudelta.go`). A 100% mode records everything.
- **A heat map**: 256 counters of 4-bit read and 4-bit write intensity, one per page or one per byte
  of a chosen page, for main or aux (`memory/mmu.go`, `HeatMapRead`, `HeatMapWrite`).
- **Counters and searches from BASIC**: `@counter.set` counts reads, writes or executes at an
  address; `@scan.sequence` finds addresses written a given sequence of values; `@scan.jumps` finds
  addresses jumped to a given number of times; `@mem.lock` holds an address at a value.
- **Sharing a machine over the network**: a share service streams memory changes to connected
  clients and sends a compressed snapshot to a client that joins (`memory/shareservice.go`,
  `FullHandler`, `MemHandler`), with ownership of the controls passed between users
  (`OwnershipHandler`) and the world stopped while someone joins (`StopTheWorld`).
- **Devices at a distance**: a VDU server and client that carry key presses, paddles, screen memory
  and scanline events (`core/vduproto`, `core/vduserver`, `core/glumbyclient`), an audio server for
  speaker clicks, and `remint`, a headless interpreter server.

The TypeScript machine keeps every one of these, with the cost moved to where it is used and the
data kept in a form other tools can read.

## Overlays: reader, writer, executor

An overlay is a plane beside memory ([STACK.md](STACK.md#the-rules)), filled from the slow path of
watched pages. For each watched address it can keep:

| Plane | Holds | Answers |
|---|---|---|
| counts | reads, writes and executes, 32 bits each | the heat map, at any resolution, over any span of time |
| last reader | the PC and cycle of the last read | "who looked at this?" |
| last writer | the PC and cycle of the last write | "who put this here?" ([CAUSE-AND-EFFECT.md](../CAUSE-AND-EFFECT.md)) |
| last executor | the cycle it last ran as an instruction | code against data; dead code; self-modifying code, when a written byte is later executed |
| first touch | the cycle of the first read, write and execute | load order; what a program uses at all |
| type | the region's type, from the typed-memory map | how the memory panel draws it ([DESIGN.md](../DESIGN.md#typed-memory-core-as-typed-blocks)) |
| source | the layers and spans this byte maps to | the next section |

Overlays turn on per machine, per range and per kind, from a panel, a cartridge profile or the
console. Pages nobody watches stay on the fast path. A view of an overlay is a renderer like any
other: a 256×256 grid of the 64K coloured by reads, writes and executes; the text page with its
last writers; the hires page with the PC that last drew each byte, so clicking a pixel opens the
code that drew it.

## Traces and profiles

- **The instruction trace**: a ring of the last N instructions, PC, opcode, operand, registers and
  cycle, in typed arrays like the PDP-7's [`trace.ts`](../src/trace.ts). It costs a few array writes
  per instruction and can stay on.
- **The bus trace**: every read and write with its cycle, for the pages being watched; what the
  SingleStepTests suite checks, and what a Disk II or video timing bug needs.
- **The profiler**: cycles by PC, then by symbol, by source line, by routine in a listing, and by
  line of the BASIC, Pascal or Forth program the 6502 was running at the time (below). A flame
  graph whose frames are 6502 subroutines from the JSR and RTS stack, with interpreter layers above
  them.
- **Accelerated calls**: a routine run as TypeScript leaves one trace record, overlay entries from
  the spans it reports, and an accelerated frame in the profiler; opening it reruns the 6502 code
  from a snapshot for the full trace ([STACK.md](STACK.md#seeing-what-an-accelerator-did)).
- **The JavaScript underneath**: the host's own profiler sees the TypeScript functions that ran the
  6502, by name, so the emulator's cost and the program's cost show in the same tools.

## Source maps, all the way up and all the way down

The cabinet already maps a PDP-7 word to its source line in several assembler dialects and to the
rectangles of that line on a scanned 1972 line-printer listing ([`src/source.ts`](../src/source.ts),
[DESIGN.md](../DESIGN.md#source-maps-as-transclusion-layers-spans-links),
[CAUSE-AND-EFFECT.md](../CAUSE-AND-EFFECT.md#down-the-build-from-core-to-the-scanned-page)). The
Apple gets the same model, with more layers above the machine code, because so much Apple software
is an interpreter running a program of its own.

### Down: from a byte in ROM to the printed page

```
byte at $FDED  →  6502 instruction  →  assembly source line  →  listing line  →  rectangle on the scanned page
```

**The printed listings.** The *Apple II Reference Manual* of January 1978, the Red Book, prints the
Monitor's listing as Woz wrote it; the 1979 *Apple II Reference Manual* prints the Autostart Monitor's.
Both are scanned and public; the repo already holds the Red Book's schematics
([`characters/steve-wozniak/media/apple-ii-redbook`](../../../characters/steve-wozniak/media/apple-ii-redbook/apple-ii-redbook.yml)).
The first job is an inventory: which listings each book prints (we expect the Monitor and, in the
Red Book, more of Woz's routines; the scans decide), on which pages, and for which ROM revision.

Then the same steps as PIXIE ([PIXIE-RESTORATION.md](../PIXIE-RESTORATION.md)):

1. **Transcribe** each listing into a source file, one line per printed line, with `scan page N`
   markers as the PDP-7 listings have.
2. **Map the scan**: rectangles for every printed line, measured from the ink by the scan-map tool
   that mapped PIXIE's listing
   ([`scanmap.py`](../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/scripts/scanmap.py)),
   into the same `ScanLines` form `source.ts` reads. That tool is tuned to a 1972 line printer; a
   typeset 1978 manual page needs its own line and column pitch.
3. **Assemble** the transcription with a 6502 back end, and **compare** it byte for byte with the ROM
   images the machine boots. Every difference is a transcription error, a misprint in the book, or a
   different ROM revision, and each one is written down.
4. **Run** it: the trace, the profiler, the overlays and the debugger now show Woz's own lines and
   the page they are printed on. Step through `COUT` and the book's page highlights the line.

The assemblers share one back end, as the PDP-7's do ([ASSEMBLERS.md](../ASSEMBLERS.md)): one 6502
encoder, the opcode table from the processor, and front ends for the listing as printed, for
dialects people use now (Merlin, the S-C Assembler, ca65), and for the mini-assembler's own
syntax. Every front end produces the same symbol table and source map.

### Up: from the 6502 to the program it is interpreting

Most of the time an Apple is running somebody's interpreter, and the question is not "which 6502
instruction?" but "which line of my program?". Each interpreter has a register that says where it
is in its own program, and a way to decode that program from memory. An **interpreter layer** is a
declaration of both:

```ts
type InterpreterLayer = {
  name: string;                         // "applesoft", "sweet16", "pascal-p", "forth"
  active(m: Machine): boolean;          // is the 6502 inside this interpreter now?
  position(m: Machine): Position;       // where it is in its program, read from memory
  decode(m: Machine, at: Position): Span;   // that position as a span of its program
  maps: SourceMap[];                    // its program to its source, when there is source
};
```

| Layer | Its program | Where it is | Source above it |
|---|---|---|---|
| Applesoft | tokenized lines from `$801` | `CURLIN` (`$75`) and `TXTPTR` (`$B8`) | the listing the program prints with `LIST`, or the file it was typed from |
| Integer BASIC | Woz's tokenized lines | its own line pointer | the same |
| SWEET 16 | bytecode in memory | its register R15, which is its program counter, in page zero | the listing it was written in |
| Pascal | p-code from the compiler | the p-machine's IPC | the compiler's listing, which gives each statement's offset |
| Forth | threaded code | the inner interpreter's IP | the screens or files, as the PDP-7 Forth views do |
| microM8's Go dialects | Go structures | the dialect's own state | the program text; when translated, TypeScript |

With these, a trace entry becomes a stack of positions: 6502 `$D7D2` in Applesoft's `NEWSTT`, on
Red Book or other listing line N, running BASIC line 120 statement 2, from `GAME.BAS`. The profiler
charges cycles to each level; the heat map can be drawn over the BASIC program's lines; a
breakpoint can be set on a BASIC line or a Pascal statement, and the debugger stops when the
interpreter reaches it.

ROM interpreters whose source was never printed (Applesoft, Integer BASIC) get their maps from
commented disassemblies published by others, as further layers with their authors and licenses
named, and from symbols we add ourselves. Each claim is linked to its evidence, as DESIGN.md's
"reverse over-engineering" asks.

### The schematics and the emulator's own code

The same graph reaches below the machine code, to the schematics the hardware was built from and
to the emulator's code and data that model them, and it is what the teaching tours walk through
([TEACHING.md](TEACHING.md)).

### The scanned page in the debugger

The memory panel already offers, per program, the views it has maps for: octal, disassembly, source
in each dialect, and the scan. For the Apple the views are hex, disassembly, the listing as printed,
the scan with its rectangle highlighted, and the interpreter layer's program, all following the PC.
The Red Book's schematics are a layer too: the video generator figure (S-11) is where the hires
decoder's shader explains itself, which is the view Don asked Melody about in 2018
([CAUSE-AND-EFFECT.md](../CAUSE-AND-EFFECT.md#along-time-from-a-hand-to-the-phosphor-and-back)).

## Time: rewind without recording everything

Because the machine is deterministic and every input is stamped with its cycle
([STACK.md](STACK.md#the-rules)), a snapshot plus the inputs since it reproduce any moment exactly.
So the recorder keeps:

- **snapshots** of every unit's state at intervals (each one the banks and the units' data, the
  banks deduplicated by page against the previous snapshot);
- **the input log**: keys, paddles, buttons, disk inserts, service answers, each with its cycle.

Rewinding to cycle C restores the snapshot before C and runs forward to C. Anything microM8's 100%
mode records (every instruction, every bus access) is regenerated on demand by replaying the stretch
being looked at, with the trace and the overlays switched on, instead of being stored for the whole
run. That makes questions like "who last wrote this byte before cycle C?" answerable over a whole
session: replay with a write watch on that byte. The interval between snapshots trades memory for
seek time and is measured.

A session is the cabinet's existing format ([`src/session.ts`](../src/session.ts)), so a recorded
Apple session can be shared, committed to git and replayed in another browser.

## Speedruns and demos

The same pieces are a tool-assisted speedrun kit, in the manner of TASVideos and BizHawk's TAStudio:
a deterministic machine, an input log, cheap snapshots, rewind and branches.

- **Frame advance.** A frame is one video frame, 17,030 cycles on an NTSC Apple. Step a frame, a
  scanline, an instruction or a cycle; the input for the next step is set before it runs.
- **The input log as an editable grid.** Rows are frames, columns are inputs: keys, the three
  buttons, the four paddles, disk inserts and swaps. Inputs can sit at any cycle inside a frame,
  since the Apple has no input polling of its own; the grid shows the cycle when it isn't the frame
  start. Editing a row replays from the nearest snapshot before it.
- **Snapshots along the run.** Kept densely near the edit point and thinned further back, so any
  frame is a short replay away. Seek time and memory are measured ([PLAN.md](PLAN.md)).
- **Branches.** Any point can be forked: a branch is a save ([SAVE-FILES.md](../SAVE-FILES.md)) plus
  an input log from it. Branches are compared by state hash, by any memory location, or side by
  side on screen, and spliced: the input log of one, from a frame on, onto another.
- **Search.** Forks are plain data, so a Node script or a pool of workers can run thousands of
  them headless: try a key on every cycle of a window and keep the ones where a memory condition
  holds. Much Apple randomness comes from timing. The Monitor's keyboard wait counts in `$4E–$4F`
  while it waits, and programs seed from it, so the cycle a key lands on is the luck being
  manipulated. Disk timing is in the state too: where the disk is in its rotation when a read starts.
- **Watches for runners.** The overlays and `@scan.sequence`-style searches
  ([above](#what-microm8-already-shows)) find the lives counter, the level number, the player's
  position and the random seed; those become columns beside the input grid.
- **Verification.** A finished run is a save at power-on (or a boot state) and an input log. Anyone
  replays it in a browser and gets the same state hash at the end; a lockstep peer can check it
  frame by frame. The run's rerecord count, the number of edits that went into it, is kept in the log.

A demo is the same thing published: a session that opens in the cabinet already running, the
boot-state URLs of [WEB-BENCH.md](../WEB-BENCH.md), with the input grid and the overlays available
to anyone who wants to see how it was made.

## Peers: three ways to share a machine

### Lockstep: send the inputs

Every peer runs its own copy of the machine. Only the inputs travel, stamped with cycles, and every
copy reaches the same state. Each frame, peers exchange a short hash of their state; a mismatch
means a copy has diverged and gets a snapshot from the others. This is the manifesto's "lockstep
copies in every browser that agree cycle by cycle", and the traffic is small: keys and paddle
moves, not memory.

For latency, a peer runs ahead on its own inputs and the others' last known ones. When a late input
arrives for an earlier cycle, it rewinds to that cycle and replays, using the rewind above. Games
call this rollback.

### Streaming: send the changes

For anything that can't be deterministic (a service answering from the real network, a peer
running a different emulator, a machine that is microM8 itself), one copy is the authority and
streams what changed: the pages written since the last frame, the unit states that changed, and the
inputs it accepted. A peer that joins gets a snapshot, then the stream. This is microM8's share
service, with the write watch flags doing the capture and the page as the unit of transfer.

The two modes mix: lockstep while the copies agree, streaming for the stretches that can't be
replayed, and a snapshot to rejoin.

### Distributed devices

A unit can be somewhere else. Its port to the machine stays the same, and a proxy carries its
requests and answers over tiny-titan's bus ([TINY-TITAN.md](../TINY-TITAN.md#tiny-bus-the-backplane-between-machines)):

- **a renderer** in another window or another browser, fed the banks and the mode log;
- **a speaker or a Mockingboard** on another machine's audio;
- **a disk drive** served from a server, or from another user's browser;
- **a keyboard, paddles, a pen or a hand** on someone else's machine, which is how several people
  play one Apple ([MANIFESTO.md](../MANIFESTO.md#many-hands-on-one-machine)).

Input from a remote device enters the authority's input log with its cycle, then goes to every
lockstep peer, so distribution never breaks replay. Who holds which device is ownership, as
microM8's share service has it, extended from one set of controls to every device.

### And between different machines

The same mechanisms carry memory between unlike machines: a window of the Apple's 64K in a PDP-7's
core, a PIXIE ring area mirrored into the Apple, a page shared with a microM8 running natively on
someone's desktop, through its debug WebSocket or its share service
([CORE-LINKS.md](../CORE-LINKS.md)). Each end sees the other through its own debugger.

↑ [STACK](STACK.md) · [PLAN](PLAN.md) · [MODULE-MAP](MODULE-MAP.md) · [CAUSE-AND-EFFECT](../CAUSE-AND-EFFECT.md) · [MANIFESTO](../MANIFESTO.md)

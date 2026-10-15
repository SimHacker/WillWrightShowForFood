# The Turing engine, the Ultimate Machine, and TM-Forth

Two new units for the cabinet, both Marvin Minsky's, and a language for one of them:

- **Minsky's Ultimate Machine** ([ultimate.ts](src/plugins/ultimate.ts)), device 56: switch it
  on and it switches itself off. It is the smallest test of the power-switch contract.
- **The Turing engine** ([turing.ts](src/plugins/turing.ts)), device 54: a Turing machine
  co-processor that runs transition tables out of the PDP-7's own 18-bit core, the way the
  Type 340 runs display files. It pages an unbounded tape through a window in core.
- **TM-Forth** ([tmforth.ts](src/tmforth.ts)): a Forth that compiles high-level Turing machine
  programs into the engine's table format, as Toffoli and Margolus used Forth to generate CAM-6
  rule tables.

Everything is TypeScript and runs in the browser. Tests:
[turing.test.ts](src/turing.test.ts), [tmforth.test.ts](src/tmforth.test.ts),
[ultimate.test.ts](src/ultimate.test.ts).

## Where it comes from

**Minsky's UTM in TECO.**
[characters/marvin-minsky/sources/teco-utm](../../characters/marvin-minsky/sources/teco-utm/README.md)
has the recovered TECO program and its analysis. It covers AIM-33's 7-state, 4-symbol universal
machine as a TECO macro: one row per state, each a group of four `symbol write move next`
quadruples, which TECO parses and interprets on a buffer that is the tape.

TM-Forth's `row:` word takes those rows as Minsky wrote them. The rows below are from
[minsky-7x4.tmf](tapes/turing/minsky-7x4.tmf):

```forth
symbols: 0 1 y A ;
octal codes: 60 61 31 1 ; decimal
\       y      0      1      A
row: 1  y0L1   00L1   11L2   A1L1
row: 2  y0L1   0yR2   1AR2   AyR6
```

The same machine is written again as Forth rules in the same file. The tests check that the two
tables are identical, and that it halts after 1870 transitions leaving
`11010111000001001101100000000000000000000000000yAAAA`.

**Cherniak's PCOMP TM\*.** Christopher Cherniak's TM\* simulator came with a disk of machines
and tapes
([sources](../../characters/christopher-cherniak/sources/pcomp/disk/),
[PCOMP.md](../turing/PCOMP.md)). [pcomp.tmf](tapes/turing/pcomp.tmf) recreates every machine
on it in TM-Forth: ADD, BUSY2, BUSY5, BB5, BCOUNT, EQUALS (and a patched version), SQUARE, and the
UTM. The tests read each `.TM` file straight off the disk, compile it, and require the same table
as the Forth version. They then run the disk's own numbers:

| machine | result |
|---|---|
| ADD | 5 steps, `111111` |
| BUSY2 | 6 steps, 4 ones |
| BUSY5 | 2,133,492 steps, 1915 ones |
| BB5 | 11,798,826 steps, 4098 ones. Started at 0 on TM\*'s finite tape, it walks off the left end at step 6,503,981 |
| SQUARE | 155 steps, 9 ones |
| EQUALS | answers by the scanned cell; the original says 3 = 2, the patch fixes it |
| BCOUNT | counts forever |
| UTM on UTMADD.INP / UTMBUSY.INP | halts at 3095 / 2931 steps |

## The 340 as the model

The 340 is a processor that happens to be wired as a device. It has its own PC, fetches its own
instruction stream from core, and interrupts the PDP-7 when it stops. The PDP-7 starts it with
IDLA (`AC` = display file address) and finds it on the skip chain with IDSI and friends
([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices)).

The Turing engine copies that arrangement exactly:

| | Type 340 | Turing engine |
|---|---|---|
| program in core | display file | control block (TCB) and transition table |
| start | IDLA: AC is the address | TMLA: AC is the TCB |
| restart after the host fixes things | IDRS | TMGO |
| stops and interrupts on | stop code, edges, pen hit | halt, undefined, tape fault, single step |
| host finds it with | IDSI, IDVE, IDHE, IDSP | TMSF |
| per backplane tick | about one display word | `rate` transitions (default 1) |

They also share a data format. A tape window of six-bit cells packed three to a word is a 340
CHAR-mode display list, so the 340 can draw the Turing machine's tape straight out of the core
the engine is writing. That works when the cells are Type 342 codes, which is why Minsky's
alphabet is `0 1 y A` with codes `60 61 31 01`. The test "the 340 draws the tape window straight
out of shared core" draws it.

## Memory format

Everything is in host words, sized by a **shape**:

```ts
type TmShape = { wordBits: number; cellBits: number; symBits: number; addrBits: number };
const PDP7_TM_SHAPE = { wordBits: 18, cellBits: 6, symBits: 4, addrBits: 13 };
```

### Control block (TCB)

Ten words. The engine reads it on TMLA, TMGO and TMSS, and writes its registers back after every
transition, so the host and the panels see live state in core.

| offset | name | |
|---|---|---|
| +0 | STATE | current state; 0 is halt |
| +1 | HEAD | head, as a cell index into the window (signed) |
| +2 | ORIGIN | absolute tape position of window cell 0 (signed) |
| +3 | WINDOW | address of the window's first word |
| +4 | WLEN | window length in cells |
| +5 | TABLE | address of the transition table |
| +6 | NSYM | number of symbols |
| +7 | ALPHA | address of the alphabet (NSYM cell codes), or 0: codes are symbol indices |
| +8 | COUNT | transitions, low word |
| +9 | COUNTH | transitions, high word |

### Transition table

One word per (state, symbol), row-major by state: `TABLE + state × NSYM + symbol`. Row 0 is the
halt state and is never read.

```text
 move   write      next state
[ 2 ][ symBits ][ wordBits - 2 - symBits ]
```

- **Move:** 0 undefined (no rule: the engine stops with UNDEF), 1 right, 2 left, 3 stay.
- **Write:** a symbol index.
- **Next:** a state number. On the PDP-7 that is 12 bits, 4096 states.

An all-zero word is "no rule", so a cleared table is all undefined. That makes the table trivial
to decode in hardware (two fields and a shift) and trivial to generate from code: one word per
rule, with no parsing.

### Tape window

`WLEN` cells of `cellBits`, packed from the high end of each word, `floor(wordBits / cellBits)`
to a word. With an alphabet, cells hold host character codes (the cell is what a display or
printer shows); without one, they hold symbol indices.

## IOTs

**Device 54, the Turing engine** (cabinet extension, free code):

| IOT | name | |
|---|---|---|
| 705401 | TMSF | skip on flag (halt, undefined, fault, step) |
| 705402 | TMRS | OR status into AC (705412: clear AC first) |
| 705404 | TMLA | AC is the TCB: load it, clear flags, run |
| 705421 | TMSR | skip while running |
| 705422 | TMRQ | OR the current state into AC (705432: clear first) |
| 705424 | TMGO | reload the TCB, clear flags, run |
| 705441 | TMSS | reload, run one transition, raise STEP |
| 705442 | TMLM | mode from AC: bit 17 host pages, bit 16 forget the spilled tape (705452: engine pages) |
| 705444 | TMST | stop and clear flags |

Status bits: RUN 400000, HALT 200000, UNDEF 100000, FAULT 040000, STEP 020000, and LEFT 010000
(the fault was off the left end). Any flag raises the interrupt request, on the PDP-7's one
level, like the 340's.

**Device 56, the Ultimate Machine:**

| IOT | name | |
|---|---|---|
| 705601 | UMSF | skip if the switch is on |
| 705602 | UMRC | OR the press count into AC (705612: clear first) |
| 705604 | UMON | a solenoid on the lever: switch it on |

The lever and the counter are mechanical, so these answer even when the box is off (`offIot`).

## Paging an unbounded tape

A Turing machine's tape is unbounded; core is not. The window is the resident part. There are two
ways to handle the head leaving it, chosen by TMLM.

**The engine pages (the default).** When the head leaves the window, the engine itself spills the
window into a run-length-encoded store ([`RleTape`](src/plugins/turing.ts)), recentres the window
on the head, and loads the cells back. It then updates ORIGIN and HEAD in the TCB. Turing machine
tapes are mostly blank and long runs of one symbol, so RLE is compact. Lookups are binary searches, and a store splices only the
runs it overlaps. A three-cell window gives the same tape as a roomy one (the "auto paging" test).
BB5's 11.8 million transitions take about 2.4 s.

**The host pages.** With TMLM bit 17 set, the engine instead stops after the transition that left
the window. It raises FAULT (and LEFT for the left end), and leaves HEAD at -1 or WLEN. The host
then fixes the window and says TMGO, which reloads the TCB. This is the natural PDP-7 arrangement,
the same as the 340's edge interrupts. [utm-driver.s](tapes/turing/utm-driver.s) is a complete
driver:

```text
int,  tmsf            / ours?
      tmrs            / status
      HALT?  → done
      FAULT? no → undefined
      LEFT?  → slide WINDOW left 4 words,  HEAD += 12, ORIGIN -= 12
      else   → slide WINDOW right 4 words, HEAD -= 12, ORIGIN += 12
      tmgo; ion; jmp i 0
```

The tape lives in 64 words of core, and the window is an 8-word slice of it that the TCB points
at. A fault never copies a cell: the driver moves the WINDOW pointer, like a segment base register.
When the slice reaches either end of the core tape, the driver stops with "too far", as TM\*
does. The test runs Minsky's machine through that 8-word window and gets the same tape as the
engine paging for itself.

**Next: spilling to devices.** The driver is where disk, DECtape and paper tape spill goes, and
nothing in the engine changes:

- A fault at an end of core-tape becomes a block write of the far end to the RB09 disk or DECtape,
  a shift, and a block read (or blanks) at the near end.
- Paper tape suits a spill that only grows: punch the left end as it leaves; read it back
  the other way.
- Guard bands (fault a few cells before the edge) let the host start the I/O while the engine keeps
  running. That is one more TCB word and one comparison.

## Portability: any host, any memory shape

The engine knows memory only through a two-function port and a shape:

```ts
interface MemoryPort { read(addr: number): number; write(addr: number, word: number): void }
new TuringEngine({ mem, shape });
```

The transition semantics never change. Only the shape and the control-port adapter do:

- **PDP-7 / PDP-4 / PDP-9** (18-bit): `{18, 6, 4, 13}` cells are 342/SIXBIT characters,
  three a word.
- **PDP-10** (36-bit): `{36, 6, 4, 18}` puts six SIXBIT cells in a word, or `{36, 7, …}` five
  ASCII, as the PDP-10 packs text.
- **Apple II / 6502** (8-bit memory): a table entry needs more than 8 bits, so the port presents
  byte pairs as 16-bit words: `{16, 8, 4, 15}` gives two byte cells a word, 16 symbols and 1024
  states.
- **A modern host**: `{32, 8, 8, 32}` gives one ASCII cell per byte, 256 symbols and 4 million
  states.

`layoutTm(program, opts)` lays out the TCB, alphabet, table and window in any shape.
`packCells`/`unpackCells` convert between cells and words. Adapters per host:

- **`TuringDevice`** is the PDP-7's: IOTs on device 54, fetch and store onto shared core.
- **`TuringCpu`** is the engine as the whole cabinet, Minsky's "Universal Turing Machine" box:
  - Its core holds a TCB, a table and a tape.
  - `step()` is one transition, PC is the state, and AC is the scanned symbol.
  - The 340 can still hang off its backplane and draw the tape.
- **`runTm`** runs a program with no cabinet at all, in a private memory.

## TM-Forth

A small Forth: colon definitions, `if`/`else`/`then`, `begin` loops, `do` loops, `case`,
`constant`, `variable`, `create`, `'` and `execute`, and the usual stack words. On top of it is a
Turing machine vocabulary. A program is a dictionary of rules; compiling it evaluates each rule
once per symbol and records what it did.

```forth
tm: bb2
symbols: 0 1 ;
states: a b ;
state: a  0 = if 1 write right else left then b goto ;
state: b  1 write left 0 = if a else halt then goto ;
a start
end-tm
```

**A rule** is `state: name … ;`, with stack effect `( sym -- )`. The engine's table entry for
(state, symbol) is whatever the body does with that symbol on the stack:

- `write ( sym -- )`
- `left`, `right`, `stay`
- `goto ( q -- )`

Defaults keep the cell, stay, and remain in the same state. A body that does nothing, or calls
`undefined`, leaves the entry empty. The stack must balance.

**Names.** Symbols are words that push their index; states are words that push their number.
`halt` is state 0. `states:` declares names ahead of use for forward references.

**M-functions.** Turing's own abbreviation device, parametrized states, is
`m-state ( args… n xt -- q )`. The rule word gets the arguments under the scanned symbol:

```forth
: seek ( target q sym -- )  rot = if goto else drop right then ;
state: fill  drop 1 write right  0 end 2 ['] seek m-state goto ;
```

It makes one state per distinct argument tuple, the first time it is asked for, and names it like
`seek(0,2)`. That is a table generator in the CAM-6 sense: write the rule once as Forth, and get
as many states as it needs.

**Tables verbatim.** Two forms take rows as they were written:

- `row:` takes Minsky's TECO quadruples.
- `tm*-table … end-table` takes Cherniak's TM\* rows unchanged. `?` means any other symbol in
  the input column and "leave it" in the output column.

`tmStarSource(file)` wraps a TM\* file from the disk this way.

**Program data:**

- `start ( q -- )`
- `tape: 0110^1` (`^` before the scanned cell)
- `origin ( n -- )`
- `note" text"`
- `codes: … ;` for host character codes.

**Disassemblers** go the other way, and each round-trips through the compiler:

- `disasmForth` prints a `state:` per state with a `case` per symbol.
- `disasmTeco` prints Minsky's rows.
- `disasmTmStar` prints Cherniak's file format.

### Running it: TURING MACHINE on the menu

The cabinet applet's menu has **TURING MACHINE (2026)**, which also has its own page at
`/cabinet/turing/`. It is the same Forth as ULTIMATE MACHINE, built without the rings. Device 54
sits on the backplane and makes a transition every three cycles when it runs free.

Two sources are compiled after `tags.fs`:

- [turing.fs](tapes/pdp7forth/turing.fs) is the 340 view and the words you type. The window is
  128 words of core: 384 cells, three 6-bit Type 342 codes to a word. The 342 draws exactly those
  codes, so each frame copies 13 window words into the display list as character data, which is
  39 cells at scale 4. The head stays in the middle and the tape slides under it. Under the tape
  the view shows the current state, the rule that fires next (`READS 0 WRITES 1 MOVES RIGHT
  GOES TO Q2`), the step count (36 bits, so BB5's millions print correctly), where the head is,
  and the engine's status. The lines between cells are a 40-stroke 340 subroutine built once and
  called with DJS. The names and notes are packed 342 strings ending in the 342's ESC, also
  reached by DJS, so drawing them costs four display words each.
- [pcomp-tm.fs](tapes/pdp7forth/pcomp-tm.fs) holds the machines. It is generated by
  `pdp7TmDeck` ([tm340.ts](src/tm340.ts)) from [pcomp.tmf](tapes/turing/pcomp.tmf), the
  TM-Forth source. Each machine is one record: a header, its alphabet in 342 codes, the
  transition table in the engine's format, the tape packed around the middle, and then its name,
  note and state names. The generator also runs each machine on the host to pick a speed, so a
  halting machine takes about 100 frames. Machines that run longer than 100,000 steps run free.

To run it:

1. At boot the cabinet types `DEMO`, which loads and runs every machine in turn. Any key stops
   it. That key is consumed, so it is not read as the start of a command.
2. Load a machine by typing its name. `MACHINES` lists them: `ADD BUSY2 BUSY5 BB5 BCOUNT EQUALS
   EQUALS-PATCHED SQUARE UTM`.
3. `STEP` makes one transition. `RUN` runs until the machine halts, gets stuck, or a key is
   typed.
4. `n SPEED` sets transitions per frame, with TMSS and a wait for each one. `0 SPEED` runs the
   engine free with TMGO while Forth only draws: BCOUNT gets about 150,000 steps between frames,
   and BB5 shows the head wandering thousands of cells off while the engine pages the window.

**Demo** reboots and does all of this by itself.

| Word | |
|---|---|
| `ADD` `BUSY2` … `UTM` | load that machine: the tape into the window, the TCB filled |
| `RUN` `STEP` `n SPEED` | run it, one transition, transitions a frame (0: free) |
| `MACHINES` `DEMO` | list them, run them all |
| `TM-STATUS` `TM-GO` `TM-STEP` `TM-STOP` `TM-MODE!` `TM-GO-AT` | device 54's IOTs |
| `TCB` `WINDOW` | the control block and the window, in core |

To add a machine, add it to `pcomp.tmf`, run
`npx tsc -p tsconfig.json && UPDATE=1 node --test dist/tm340.test.js`, and the deck is rewritten.
The dictionary nearly fills the 8K core: a few hundred words are left for longer notes or more
machines. [tm340.test.ts](src/tm340.test.ts) runs the same program headless. It loads BUSY2,
steps it, runs it to HALTED with four ones, and checks that free running stops when a key is
typed.

**Next:** the same vocabulary in the cabinet's own PDP-7 Forth ([forth.ts](src/forth.ts)), so the
PDP-7 compiles TM tables into its own core and starts the engine with TMLA. The CAM-6 arrangement
again, a Forth host generating tables for a co-processor, on 1960s iron.

## The Ultimate Machine

Minsky's 1952 design, which Shannon built: switch it on, a hand comes out and switches it off.
[PORTRAIT.md](PORTRAIT.md#minskys-ultimate-machine) is the front panel.

In code, the switch *is* the unit's power switch (`Device.power`):

- **On.** `Cabinet.setPower`, a finger on the panel and the UMON solenoid all flip it here.
- **The press.** The phases run `wait`, `open`, `reach`, `press`, `return`, `close`, `rest`, each
  as long as its timing says (`UM_DEFAULT_TIMING`, or UMLT from the PDP-7). The press turns
  `power` off. After `rest` it goes again if someone has switched it back on, and stops otherwise.
- **Off.** While off, the cabinet skips its tick, its interrupt and its IOTs. The only exception
  is `offIot`, for the lever and counter.
- **Interrupted.** Switching it off before the hand arrives counts as an abort, and the arm
  retracts from wherever it was.
- **Manual press.** Off by default. UMLT with phase 0 sets the mode: AC bit 17 on means the arm
  reaches the lever and waits there without moving it. When the program switches the lever off
  (UMOF), that counts as the hand's press, and `press`, `return`, `close` and `rest` follow as
  usual. The PDP-7 then drives that one transition (say, when a tracked finger touches the
  switch) and the machine drives the rest. The ULTIMATE MACHINE demo leaves it automatic.

`pose()` gives the panel the phase, and how far the lid and the arm have come; the animation
follows the device, never the reverse.

A PDP-7 program can argue with it:

```text
fight, umrc        / how many times has it won?
       sad (5
       hlt
       umsf        / on?
       umon        / off: switch it back on
       jmp fight
```

The test shows how that ends. The fifth press lands after the PDP-7 read the count, so the PDP-7
switches it on a sixth time and halts. A hundred cycles later, with the PDP-7 halted, the box
switches itself off: it gets the last word.

### Running it: ULTIMATE MACHINE on the menu

The cabinet applet's menu has **ULTIMATE MACHINE (2026)**; it also has a page of its own at
`/cabinet/ultimate/`. This is Mitch Bradley's Forth, without PIXIE's rings (8K holds those or
this, not both), with four more sources compiled into it, the same build
[ultimate.test.ts](src/ultimate.test.ts) runs, and
device 56 plugged into the backplane at four times its default timing (about 7 seconds a round
at 1x). The Forth frame loop never waits: it redraws as fast as it can, about a frame per
100,000 cycles, so a round gets about 40 frames. A slower box gets more frames; `UM-TIME!` sets it.

The four sources:

- [code.fs](tapes/pdp7forth/code.fs) is a PDP-7 assembler in Forth. IOT words are laid down
  with `,`.
- [interrupt.fs](tapes/pdp7forth/interrupt.fs) has interrupt handlers written in Forth.
- [tags.fs](tapes/pdp7forth/tags.fs) has `TAG"` and `NOTAG`, which tag what is drawn with a
  name ([TAGS-AND-PIES.md](TAGS-AND-PIES.md)).
- [ultimate.fs](tapes/pdp7forth/ultimate.fs) is the 340 view. Each lamp is captioned with its
  phase in Type 342 text, ON or OFF is written under the switch, and every part is tagged, so
  hovering it names it.

To run it:

1. The cabinet types `ULTIMATE` and Return at boot (the program's `typeAhead`), so it is
   already running. The box is drawn once; after that, each frame redraws only
   the lid, the lever, the hand and the meters, from UMRP, UMRL and UMRA.
2. Click the switch. Its plate is the only thing drawn with the light pen enabled. The pen's
   hit raises an interrupt, and the frame loop flips the lever once per touch.
3. Watch the lid open and the hand switch it off. Each phase change also raises an interrupt.
   OFF does not, because a box that is off is unpowered.
4. Type any key to stop `ULTIMATE` and get the Forth prompt. The box carries on without the
   program. Change it (`8000 PH-REACH UM-TIME!`), then type `ULTIMATE` to run it again.

**Demo** reboots and does all of this by itself.

The words, at the `ok` prompt:

| Word | |
|---|---|
| `UM-ON` `UM-OFF` `UM-ON?` | the lever |
| `UM-PHASE` `UM-LID` `UM-ARM` | the registers, `0 .. PH-MAX` and `0 .. UM-MAX` |
| `PH-OFF` … `PH-REST` | the phase numbers |
| `UM-PRESSES` | how many times the hand has won |
| `n phase UM-TIME!` | a phase's length, in units of 64 cycles: `8000 PH-REACH UM-TIME!` is a slow reach |
| `UM-BUSY?` `UM-CHANGED?` `UM-ACK` `UM-IE!` | the mechanism's flags and its interrupt |

[ultimate.test.ts](src/ultimate.test.ts) runs the same program headless. It checks the pen
scenario and the menu's demo, and that NEXT and the interrupt are put back afterwards.


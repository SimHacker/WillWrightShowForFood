# PDP-7 Forth — Mitch Bradley, 26 September 2026

On 25 September Don asked Mitch Bradley, with David Rosenthal copied, whether an 18-bit
Forth existed for the PDP-7. The next day Mitch had written one:
[**MitchBradley/pdp7forth**](https://github.com/MitchBradley/pdp7forth) (MIT). It runs on
the machine Unix was born on, in 8K words of core, and draws with a Logo turtle on the Type
340 display, the same display PIXIE used. This page is the exchange, what the Forth is, how
it works, and where it goes next in this repo. The course sketch it answers is
[FORTH-TURTLE-340.md](FORTH-TURTLE-340.md).

Mitch invented Open Firmware (IEEE 1275), the Forth boot firmware in Sun workstations,
Apple's PowerPC Macs and the OLPC XO, and chaired the ANSI Forth technical subcommittee. His
Sun Forth is also the Forth that compiled the rules for Don's CAM6 cellular automata
emulator ([Norman Margolus](../../../characters/norman-margolus/CHARACTER.yml)).

![A flower of twelve squares drawn by the turtle on the emulated Type 340 (Mitch Bradley, docs/turtle.png)](https://raw.githubusercontent.com/MitchBradley/pdp7forth/main/docs/turtle.png)

## The exchange

**Don Hopkins to Mitch Bradley, cc David S. H. Rosenthal, 25 Sep 2026:**

> I have made a PDP-7 and 340 vector graphics display emulator to run Heinz Lemke's PIXIE
> CAD system developed from 1967-1971 at Cambridge University, on the same PDP-7 that David
> Rosenthal used to hack late at night.
>
> It also runs the original light pen test program from DEC, the DUAL space wars game, and I
> had Claud write a couple of non-graphics TTY-only programs like guess-the-number and
> lunar-lander.
>
> Now it REALLY NEEDS a FORTH system with a turtle graphics package for the 340 display.
>
> Mitch, do you know of any 18 bit FORTH systems for DEC dinosaurs? How hard would it be to
> write another back-end for Open Firmware, and a PDP-7 assembler in Forth?
>
> I also had Claude write my own PDP-7 assembler and disassembler in TypeScript so I could
> build it into the emulator running in the browser, and it outputs a map from machine
> language addresses => source code line numbers, so the emulator can show the original
> source code as it's executing it (though it helps to slow it down with the speed slider to
> watch).
>
> https://hyperties.org/databases/playground/pixie-live/
>
> Here are my adventures debugging it, some of them quite incredible, worth writing a paper
> about itself:
>
> https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/BUG-JOURNAL.md
>
> -Don

(The space war game is [DUEL](../tapes/duel/README.md), DECUS 7-40.
PIXIE live now has its own database:
[hyperties.org/databases/pixie/pixie-live](https://hyperties.org/databases/pixie/pixie-live/).)

**Mitch Bradley to Don and David, 27 Sep 2026, 01:31 CEST:**

> Ask and ye shall receive (but I wouldn't do it for just anybody :-)
>
> https://github.com/MitchBradley/pdp7forth
>
> Used up half of the $100 of free cloud credits that Anthropic offered. Good test of
> in-the-cloud projects.

Two screenshots came with it: the turtle's star of rotated squares and spokes on the
emulated 340, and the first session at the SIMH console:

```
wmb@Mac-mini pdp7forth % make run
pdp7 build/forth.do

PDP-7 simulator V3.12-3
PDP-7 FORTH
: HI ." HELLO DON" CR ; HI HELLO DON
 OK
```

His README's credits date the project the same way: an email exchange on 25 September,
written the next day, with Claude Code (Opus 5.5).

**Mitch Bradley, 27 Sep 2026, 03:11 CEST, on how it was made:**

> I woke up this morning thinking about the project. I issued the first Claude prompt
> before going to breakfast. By 1 PM the project was finished. By and large, Claude's design
> ideas were quite good, though I did seed it with the basic outline of the header and thread
> format. It correctly identified all of the canonical issues that drive the implementation of
> a Forth VM. I barely even looked at the PDP-7 instruction set. If I had to do this on my
> own, it would have certainly taken me more than 2 weeks.
>
> PDP-7 turns out to be an amazingly good target instruction set for Forth. The threaded code
> threads are machine instructions that map naturally to primitive words, colon definitions,
> variables and constants.

That last paragraph is the design in two sentences; the table under "How it works" below is
the mapping he means.

## What it is

From the [README](https://github.com/MitchBradley/pdp7forth#readme) and
[DESIGN.md](https://github.com/MitchBradley/pdp7forth/blob/main/DESIGN.md):

- A small, mostly standard Forth: interpreter, compiler, `IF`/`DO`/`BEGIN`, strings,
  `WORDS`, `*/`, `.` in any base, errors that name the word at fault.
- **Size:** the kernel with its headers is about 1.5K words; with the 1K-word display list,
  stacks and buffers it ends at 05422 octal (~2.8K words). The prelude adds ~200. About
  5,150 words, nearly two thirds of an 8K machine, are left for definitions.
- **Toolchain:** PDP-7 assembly (`src/kernel.s`, ~1,800 lines) assembled with `as7`, the
  assembler of the [pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) restoration (a git
  submodule). Words that are easier in Forth live in `src/prelude.fs`, compiled into the
  memory image at build time by running the kernel under SIMH, so their source costs no core.
- **Runs under SIMH.** SimH 3.8 for text; Open SIMH built from source with SDL2 for the
  340 display (Homebrew's build lacks it). `make run GRAPHICS=1` enables the display and
  disables the Graphics-2 device that otherwise claims the same device code.
- **Paper tape is the file system.** `TAPE` switches input to the emulated reader, which SIMH
  backs with a host file; source echoes as it loads, as an ASR-33 would print it.
- **Tested:** `make test` runs over a hundred scripted SIMH sessions and compares exact
  transcripts; with an Open SIMH display it also checks a drawing via SDL's screenshot.

## How it works

**Every thread cell is a PDP-7 instruction, and its opcode is its type.** The inner
interpreter executes cells with `XCT`:

| Cell | Opcode | What executing it does |
|---|---|---|
| colon word | `00` a bare address, i.e. `CAL` | `CAL` always acts as `JMS 20`; `nest` at 21 pushes IP and enters the thread |
| primitive | `60` `JMP code` | runs machine code, which ends with `jmp next` |
| constant | `20` `LAC body` | loads the value; NEXT pushes it |
| variable | `76` `LAW body` | loads the address; NEXT pushes it |

```
next,  xct i 10       / IP = auto-index 10; pre-increment, execute the cell
       dac i 12       / push AC (SP = auto-index 12); only LAC/LAW cells reach here
       jmp next
```

So NEXT is three instructions and constants and variables need no code of their own. IP,
RP and SP live in auto-index locations 10, 11 and 12; both stacks grow up, pushes are free
(`dac i 12` pre-increments), pops are the manual direction. The top of stack is not cached
in AC, because `XCT` loads AC before the old top could be saved. Literals compile as
`LAC pool-entry`, sharing a pool that grows down from the top of memory.

**Headers are two words** in Mitch's kernel: the name's length, an immediate bit, a 3-bit
type tag and a 9-bit relative link in one; the first three characters in SIXBIT in the other.
The cabinet runs a copy that keeps the whole name ([below](#in-the-cabinet-full-names-create-does-and-pixie-rings)).

**Arithmetic:** the EAE's signed multiply and divide assume ones'-complement signs, so `*`
uses unsigned `MUL` and `/` fixes signs in software; `*/` keeps the EAE's 36-bit product.
`OR` has no instruction and is `(a^b)^(a&b)`.

**Interactive control structures,** Mitch's idea from Open Firmware: `IF`, `DO` and `BEGIN`
typed at the prompt compile into a scratch buffer and run when the outermost structure
closes, so `4 0 DO I . LOOP` works without a definition.

## XCT: the instruction that executes another instruction

`XCT Y` fetches the word at `Y` and executes it as if it stood where the `XCT` is. The
program counter stays put: if the executed instruction jumps, control goes where it jumps;
if it skips, it skips the instruction after the `XCT`; otherwise execution carries on after
the `XCT`. With the indirect bit, `XCT I P` executes the instruction whose *address* is in
`P`. The PDP-1, PDP-4/7/9/15 and PDP-6/10 had it; so did the IBM 709 (`XEC`) and the
System/360 (`EX`, which also ORs a register into the target's second byte).

**What it was for.** Anywhere a program wants to choose, pass or build *one instruction*
without writing a subroutine or patching its own code:

- **Tables of one-instruction handlers.** Index a table and `XCT` the entry. SYMELEC's
  teletype commands work this way (listing p.45, `MESSAG`): `LABEL` is `ISZ RLABEL`,
  `UNLABEL` is `DZM RLABEL`, `GRID` is `LAC (1760` falling into the `DAC GRID` that follows
  the `XCT`, and `TITAN` and `START` are `JMP`s. Some entries act and fall through, some jump
  away: exactly Mitch's thread cells, fifty-four years earlier on the same machine.
- **Instructions as arguments.** A caller writes instructions after its call, and the
  subroutine `XCT`s them through its return address. SYMELEC's `GRHA` (p.35, "go round head
  applying function") is called as `LAW GRHA; ENTER; LAW X; LAW F1; LAW F2` and reads its
  arguments with `XCT I ENTER-JMS`: the arguments, including the functions to apply, are
  `LAW` instructions it executes to get their values. `DRLTD` (p.95) takes a
  set-visible/invisible instruction the same way. Higher-order functions, in 1972, in 8K.
- **Out-of-line execution.** Debuggers replaced an instruction with a breakpoint and, to
  continue, `XCT`ed the saved original. Linux kprobes and uprobes still do this in software
  ("execute out of line": copy the probed instruction to a scratch slot and single-step
  it there), as does GDB's displaced stepping.
- **Hardware that executes a location.** The same idea with the hardware choosing the word:
  the PDP-4's multi-level interrupt executed the instruction in the channel's vector
  location, so a single instruction could service a device and return (Supnik); the PDP-10
  executed the instruction at 40+2n, often a `BLKI`/`BLKO` that moved one word and resumed
  with no handler at all; the 8080's interrupting device jammed an instruction (usually
  `RST`) onto the data bus. The PDP-10 monitor used `PXCT` ("previous context XCT") to run one
  instruction against the *user's* address space, which is how the kernel touched user
  memory.

**Why modern machines dropped it.** Pipelines fetch instructions ahead; `XCT` makes the next
instruction depend on a data load, and an executed instruction can itself jump, skip, fault
or `XCT` again, which makes precise exceptions and branch prediction awkward. RISC designs
compose the same effects from indirect jumps and calls (jump tables, function pointers,
computed `goto` in interpreters), and JIT compilers generate the instruction instead of
executing a word of data. IBM kept it: z/Architecture still has `EX` and adds `EXRL` (execute
relative long), used above all to run a storage-to-storage instruction such as `MVC` with a
length taken from a register.

**What Mitch does with it.** His inner interpreter is one `XCT`:

```
next:   xct i 010       " pre-increment IP, execute the thread cell
        dac i 012       " push AC (only reached by constant/variable cells)
        jmp next
```

`xct i 10` bumps auto-index location 10 (IP) and executes the thread cell it now points at,
so the thread is data that is also a program. A cell that transfers control (a `CAL` for a
colon word, a `JMP` for a primitive) never comes back to the `dac`; a cell that only loads
AC (`LAC` for a constant or literal, `LAW` for a variable, whose "operand" is the address
itself) falls through and gets pushed. The `CAL` saves a return address in location 20 that
`nest` ignores: nest takes IP from location 10 instead, which is why "`CAL I` jumps through
location 20, which every ordinary CAL overwrites" rules out using it for branches.

That makes location 10 a **second program counter**. The PDP-7 runs NEXT with its own PC,
and NEXT runs the Forth program one instruction at a time with the PC in location 10: a
virtual machine whose instruction set is the PDP-7's own. Subroutine threading (a thread of
`JMS` instructions) would be faster but would store return addresses in the callees; indirect
threading would add a code-field fetch. `XCT` gets direct execution without either, which is
Mitch's "the threaded code threads are machine instructions". The 340 is the other second
program counter in this story: it fetches display words from the same core with its own
address register. Myer & Sutherland's wheel, turning inside one machine.

(The cabinet already implements `XCT`, because SYMELEC uses it everywhere above.)

### What to call it

The usual threading taxonomy (Anton Ertl's: direct, indirect, subroutine, call, token,
switch) has no entry for it. The nearest is **call threading**, where the interpreter loop
*calls* each cell. Mitch's loop *executes* each cell, and the opcode of the cell is its code
field. We haven't found it named in the Forth literature; ask Mitch and Anton Ertl.

- **Precise:** *XCT threading*. *Execute threading*, the sibling of call threading.
  *Opcode-typed threading*, for where the word's type lives. *Native-cell threading*.
- **Witty:** *ventriloquist threading* (`XCT` puts words in another instruction's mouth).
  *Stunt-double threading* (the cell performs in the `XCT`'s place and takes the fall if it
  jumps). *Borrowed-PC threading*.
- **tiny-titan grade:** *indirectly direct threading*: the most direct threading there is,
  reached through an indirect `XCT I`. *Out-of-line inline threading*. *Subroutine threading
  with no subroutines*.
- **Self-referential, his dictionary's own:** headers keep a name's length and first three
  letters, so `XCT-THREADING` is stored as `XCT` and ten underscores, the same word as any
  other thirteen-letter name starting `XCT`. The only name for it his Forth stores
  completely is `XCT`.

For the paper, *XCT threading*. For the T-shirt, *indirectly direct threading*.

## The turtle

[`lib/turtle.fs`](https://github.com/MitchBradley/pdp7forth/blob/main/lib/turtle.fs), 112
lines, loaded from tape. Logo's conventions: the turtle starts in the middle of the
1024×1024 screen, heading 0 is up, turns are degrees, `RIGHT` is clockwise.

```
4 0 DO 200 FD 90 RT LOOP
: SQ 4 0 DO 200 FD 90 RT LOOP ;
: FLOWER 8 0 DO SQ 45 RT LOOP ;
CS FLOWER
: STAR 5 0 DO 400 FD 144 RT LOOP ;
CS PU 200 BK 90 LT 200 FD 90 RT PD STAR
```

- **Fixed point, no floating point:** a 91-entry table of sin × 16384, symmetry for the
  other quadrants, position kept in 1/64 pixel so rounding never accumulates.
- **The display list is built in Forth and run by the 340.** A parameter word, two point
  words, then one vector word per step of at most 127 pixels; a move of any length becomes N
  steps whose sizes add up exactly. The turtle's triangle goes after the path, where the
  beam already is, then an escape and a stop.
- **The 340 may be running the list while Forth appends to it,** so the new terminator is
  written before the word that replaces the old one, and the triangle is built aside and
  copied in last word first.
- **Moves that would leave the screen are refused:** a vector hitting the edge would make
  the 340 escape to parameter mode and misread the rest of the list.
- **Refresh:** while waiting for a key, the input routine restarts the 340 whenever it has
  stopped. The picture stays lit at the keyboard and fades during long computations, as it
  would on the real machine.

## How it fits what we've been building

- **PIXIE did the same two tricks.** PIXIE's ring-structure names are addresses tagged with
  the `JMS` opcode so the machine can indirect through them; Mitch's thread cells are
  addresses tagged with opcodes so the machine can execute them. And SYMELEC's `WAITLK`
  restarts the 340 while it waits on the Titan link, as Mitch's `getc` does while it waits on
  the keyboard.
- **The course sketch's open exercises have answers** (which stack direction pays, why the
  top of stack can't live in AC): see [FORTH-TURTLE-340.md](FORTH-TURTLE-340.md#it-exists-mitch-bradleys-pdp-7-forth-26-sep-2026).
- **On the wheel of reincarnation** ([Myer & Sutherland](../../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md)):
  his turtle is the "turtle as a compiler" layer. Geometry happens in the PDP-7; the 340
  only executes the vectors Forth wrote, which is the division of labour the 1968 paper
  recommends.
- **One open question for us.** DESIGN.md puts the display list below 4K because the 340's
  address counter is 12 bits, as SIMH has it. SYMELEC starts the 340 at `12301`, in the upper
  4K of an 8K machine, and our emulator needs 13 bits to run it. Either Cambridge's 340 had a
  wider counter or SYMELEC depends on something we haven't found. The H-340 manual should say.

## In the cabinet: full names, CREATE DOES>, and PIXIE rings

Mitch's Forth runs in the browser on the cabinet's emulated PDP-7, as **FORTH + TURTLE** on
the program menu ([hyperties.org/cabinet/forth/](https://hyperties.org/cabinet/forth/)). The
page assembles the kernel itself with an `as7` front end, then does what his `prelude.py`
does under SIMH: it mounts the Forth sources on the paper tape reader, types `TAPE`, and keeps
the core. His files are in [`tapes/pdp7forth/`](../tapes/pdp7forth/) unchanged, and the
first test checks that the page's build of `kernel.s` matches his `as7` output word for word.
The cabinet's additions are copies and files beside his, never edits to them.
[VARIANTS.yml](../tapes/pdp7forth/VARIANTS.yml) records what each copy is, what it differs
in, and what it must keep identical.

**Full names.** [`kernel-names-full.s`](../tapes/pdp7forth/kernel-names-full.s) keeps every
character of a name, up to 31, three SIXBIT characters to a word. A word is laid out as Open
Firmware lays one out: the name, then the header, then the body. The xt is still the
header's address, links still run header to header, and the body is at xt+1. `parse`
packs the whole token, `find` compares the count and then every name word, and `WORDS`
prints names whole. Only `mkcell` knows where the body is.
[`make-forth-names-full.py`](../scripts/make-forth-names-full.py) generates the copy from
`kernel.s`, so changes to `kernel.s` carry over when the script is run again. Mitch's own
SIMH suite passes with the copy as `src/kernel.s`, except for eight tests that check the
upstream encoding: four expect `EXI_` and `CELLX` redefining `CELL+`, and four deposit only
the first name word for `find`. With full names, the prelude can define `CELLS` and `CHARS`.

**CREATE DOES>, named as in Open Firmware and CForth.** [`does.fs`](../tapes/pdp7forth/does.fs)
is fifteen lines of Forth, with no kernel change:

```
: konst  create ,  does> @ ;      42 konst answer   answer .  42
: array  create allot  does> + ;  10 array a        7 3 a !   3 a @ .  7
' answer >body @ .  42
```

`CREATE` makes a colon word whose body is a call to `(CREATE)`, then a slot for the `DOES>`
code, then the data. `(CREATE)` pushes the data address and, if the slot is set, runs the
code it holds. `(DOES>)` fills in the slot of the latest `CREATE`d word, which it finds
through `LASTACF`. `>BODY` is `xt+3`. This is the same arrangement as CForth's `(does)`,
which also needs no machine code in the defining word: OFW's `place-does` is a no-op there
for the same reason. `;CODE` is `DOES>` with machine code after it, and it waits for an
assembler (below).

**PIXIE rings, on the 1972 code.** RSPPIX, the ring structure processor SYMELEC is built on,
is linked into the Forth. It is translated from the 1972 Cambridge listing and must assemble
to it word for word. To use it from Forth, it is moved up 014000, so that the offsets the
Cambridge assembler ORs into addresses still add. [`pixie.s`](../tapes/pdp7forth/pixie.s)
provides what SYMELEC provided:
- its variables, in SYMELEC's order;
- its two error exits, which print `ring?` or `rings full?` and return to the prompt;
- a Forth primitive for each routine: `RSETUP RINIT RGETSP RCAR RCDR RPUSH RPOP RNULLR RINSRT
  RFINDS RFINDN RFINDP RFEL RFELN RADDW RDELB`.

A Forth `VARIABLE` leaves the same address as RSPPIX's `LAW X` calling convention, so most
of these primitives are three instructions. [`pixie.fs`](../tapes/pdp7forth/pixie.fs) builds
on them:

```
RSAVINS S" SQUARE" NAMED   RSAVINS S" TRIANGLE" NAMED
RSAVINS .RING     TRIANGLE SQUARE  ok
```

The RINGS panel reads `RBEG`, `REND` and `RSAVINS`, the same three cells it reads in a running
SYMELEC, and draws the live structure in 3D with printnames spelled out. Running out of space
runs the 1972 garbage collector. The turtle draws as before with all of this loaded. The
whole story is in [FORTH-RINGS.md](../FORTH-RINGS.md).

## Next

**Aligning with Open Firmware.** The intent is to make this Forth a small Open Firmware, not a
separate dialect, and to build [tiny-its](../TINY-ITS.md), the cabinet's command line and
debugger, by Open Firmware's practices:
- Name things as OFW and CForth do (`>BODY`, `(DOES>)`, `LASTACF`).
- Adopt its layout-independent header words (`>LINK`, `>NAME`, `N>LINK`, `L>NAME`, `>FLAGS`,
  `NAME>STRING`), so code above them doesn't care where a name lives.
- Add `DEFER`, then `SEE`, then wordlists, or rings standing in for them.
- Port the line editor (`editcmd.fth`) and TENEX completion (`cmdcpl.fth`).
- Pair each command with a `$` version that takes its argument as a string, for programs.
- Give tiny-its a device tree you walk with `dev` and `ls`.

Mitch is the person to ask how he would cut it down to 8K.

**A PDP-7 assembler in Forth.** This is the assembler `;CODE` and `CODE` need. It should
assemble Type 340 display instructions as well: parameter, point, vector, increment and
character words, and subroutine jumps. Then display lists are written by name, not as raw
octal. The turtle's `vword` and `dl,` are its first two words. The PIXIE-to-340 renderer
would use it to compile ring structures into display code.

**Tiny Titan: sending and receiving rings.** [Tiny Titan](../TINY-TITAN.md) is the far end of
Neil Wiseman's PDP-7 to Titan link, and 1972 SYMELEC already uploads its drawings to it.
The plan is two cabinets side by side, Forth in one and SYMELEC in the other, sharing one
Tiny Titan:
1. The turtle draws, and records the drawing as PIXIE rings.
2. Forth sends the rings over the link, the way `/LTPIX` does.
3. SYMELEC loads the drawing, relocates it and edits it with the light pen.
4. SYMELEC sends it back, and Forth walks it, edits it and redraws it.

The steps are a filestore and serving back in Tiny Titan, Forth words for the link IOTs, the
relocation pass in Forth, block data from Forth (RSPPIX's `RBDN`), and SYMELEC's drawing
schema. [FORTH-RINGS.md](../FORTH-RINGS.md#next-two-pdp-7s-one-titan) has the order.

**Upstream.** If Mitch wants them, the full-names copy, a `KERNEL` parameter for his
Makefile, and the test harness changes would go to him as pull requests.

**Smaller.** A light pen vocabulary: the turtle writes the display list, but nothing reads
the pen yet.

## Credits

Mitch Bradley, with Claude Code. Warren Toomey and the pdp7-unix team for `as7`; Bob Supnik
and the Open SIMH project for SimH and its Type 340; the turtle from Logo, by Seymour Papert,
Wally Feurzeig and Cynthia Solomon. MIT license; the pdp7-unix submodule is GPL v3.

↑ [reference library](README.md) · [course sketch](FORTH-TURTLE-340.md) · [turist guide](GUIDE.md) ·
[cabinet](../README.md) · [Seymour Papert](../../../characters/seymour-papert/README.md) ·
[Charles Moore](../../../characters/charles-moore/README.md)

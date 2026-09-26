# Forth, turtles and light pens on a PDP-7 + Type 340 — a teaching sketch

For Heinz, Roy and his students, Lars, Andrew, and any turist who wants a project. The
question: how would you build a Forth on this machine, then a Logo-style turtle library
for the 340, then light-pen widgets on top — and what does that teach about the **wheel of
reincarnation**?

**Provenance.** Harvested from a design conversation Don had with an AI assistant on 26 Sep
2026, then checked against the manuals in this directory, against Heinz's
[1972 listing](../pixie-assembler-listing-1972/symelec-listing.txt), and against Bob Supnik,
[*Architectural Evolution in DEC's 18b Computers*](https://archive.computerhistory.org/resources/text/DEC/pdp-1/dec.pdp-1_15.supnik.rchitectural_evolution_in_dec%27s_18b_computers.2003.102630392.pdf)
(2003; Supnik built SIMH's 18-bit family). The code below is a
**sketch, not tested PDP-7 assembly**. Items still to check are listed at the end.

## The punchline first: PIXIE already did most of this

Every piece of the "ambitious" plan has a working 1972 answer in SYMELEC's ~5000 words.
The course can run both ways: students build it in Forth, then read how Heinz did it.

| The plan asks for | SYMELEC, 1972 |
|---|---|
| Recursive subroutines on a machine whose `JMS` isn't reentrant | `ENTER`/`EXIT`: a software **link stack** (listing p.29, 2472–2515) |
| A data stack and a return stack, Forth-style | `STAK`/`UNSTAK` on the **LOP** stack (operands) + `ENTER`/`EXIT` on the **LINK** stack (returns): two stacks, adjacent in core, bounds-checked |
| User-defined words that read like instructions | `ENTER = JMS .`, `PUSH = JMS .`, `NAME=JMS,` — the Cambridge assembler turns subroutines into opcodes (`CAR`, `CDR`, `FLST`, `STAK`, `ENTER` …). A dictionary, in an assembler |
| Two vocabularies, CPU and display, with explicit switches | `DISP` / `NODISP` in the Cambridge assembler: `JMP` is a CPU word, `VEC` a display word, and the listing switches between them |
| Compile an editable structure into a native display file | `COMP` walks subpicture instances and plants `DJS` words in the display file, recursively (`LAW COMP` / `ENTER /RECURSE`, listing p.91) |
| Tag displayed objects so a pen hit finds its owner | Each lightbutton is a `DDS` block; the 347's return linkage at location 3 says which block was drawing when the pen fired ([DESIGN.md](../../../../packages/cabinet/DESIGN.md)) |
| Widgets: buttons, menus, dragging | Lightbuttons, the radial ring that rides with the tracking cross, rubber-band lines, blink selection ([TRACKING.md](../../../../packages/cabinet/TRACKING.md)) |
| Double-buffered display lists | `TEMPDF` for what's being drawn, `PERMDF` for the finished picture, joined by `DJP` |
| Memory management for the structures | A garbage collector, recursive, with its own branch stack (`GBRNCH`…`GBRTN`, p.30) |

## It exists: Mitch Bradley's PDP-7 Forth (26 Sep 2026)

The day after an email exchange with Don and David Rosenthal, Mitch Bradley (Open
Firmware) wrote one with Claude Code: [**MitchBradley/pdp7forth**](https://github.com/MitchBradley/pdp7forth)
(MIT), with a [DESIGN.md](https://github.com/MitchBradley/pdp7forth/blob/main/DESIGN.md)
worth reading line by line. About 1.5K words of kernel plus a 1K-word display list,
leaving ~5,150 words for definitions in 8K. Assembled with `as7` from pdp7-unix, run under
Open SIMH, turtle graphics on the emulated 340 ([`lib/turtle.fs`](https://github.com/MitchBradley/pdp7forth/blob/main/lib/turtle.fs),
loaded from paper tape with `TAPE`). His first session: `: HI ." HELLO DON" CR ; HI`.

Where it answers the questions this sketch left open:

- **Threading: every thread cell is a PDP-7 instruction, and the opcode is the type.** A
  colon call is a bare address, which executes as `CAL` (always `JMS 20`) and traps to
  `nest` at 21; a primitive is `JMP code`; a constant is `LAC body`; a variable is `LAW
  body`. So constants and variables need no code at all, and NEXT is
  `xct i 10 / dac i 12 / jmp next`: three instructions, better than the `LAC I 10 / DAC W /
  JMP I W` in §3 below. The same idea as PIXIE's names, which are addresses tagged with the
  `JMS` opcode so the machine can indirect through them.
- **Exercise 2 (which of push and pop pays):** IP, RP and SP live in auto-index 10, 11, 12;
  both stacks grow up, push is the free direction (`dac i 11`), pop is the manual one.
- **Exercise 3 (top of stack in AC):** no. The `XCT` loads AC before the old top could be
  saved, so TOS stays in memory.
- **Recursion:** a word isn't visible until `;`, and there is no `RECURSE`, so a word can't
  call itself. Heinz's `ENTER`/`EXIT` (§2) is still the worked example of how to.
- **Arithmetic:** the EAE's signed `MULS`/`IDIVS` assume ones'-complement signs, so `*` uses
  unsigned `MUL` and `/` fixes signs in software. `*/` uses the EAE's 36-bit multiply and
  divide, so the turtle's `n × sine` can't overflow. (Supnik's point that ones' complement
  stayed predominant in the EAE, in practice.)
- **Turtle (§4):** degrees, a 91-entry sine table scaled by 16384 (the same Q14), position
  kept in 1/64 pixel so rounding doesn't accumulate, moves split into ≤127-unit vectors.
  Moves that would leave the screen are refused, because a vector hitting the edge makes the
  340 escape to parameter mode and misread the rest of the list. Appending writes the new
  terminator before overwriting the old one, because the 340 may be running the list.
- **Refresh:** the teletype input routine restarts the 340 whenever it has stopped, so the
  picture stays lit at the keyboard and fades during long computations: SYMELEC's `WAITLK`
  trick (service the display while waiting on I/O) arrived at independently.
- **Interactive control structures** (`4 0 DO I . LOOP` at the prompt), Mitch's idea from
  Open Firmware; two-word headers holding a name's length and first three characters.

What's next with it, in this repo: run it on the cabinet (see its README), and teach §9's
ring vocabulary to *this* Forth rather than a hypothetical one. The exchange, the design and
the turtle in full: [**PDP7-FORTH.md**](PDP7-FORTH.md).

## 1. The machine a programmer sees

The [turist guide](GUIDE.md) covers the history. The programmer's model is small:

- **AC**, 18 bits, where the work happens. **L**, a one-bit link extending it for adds and
  rotates (Supnik: "essentially the 19th bit of the AC"). **PC**. **MQ** only if the EAE
  (Type 177) is installed.
- Memory-reference instructions: 4-bit opcode, 1 indirect bit, 13 address bits. Words, not bytes.
- **Auto-index locations 10–17 (octal):** an indirect reference through one increments it
  *before* use. The only index-register-like thing on the machine. Introduced on the PDP-4;
  on the PDP-7 each memory bank has its own set (the PDP-9 changed that to bank 0 only).
- **Two adds:** `ADD` is ones' complement (with its −0); `TAD` is two's complement. PIXIE
  uses `TAD (777777` for −1. Gordon Bell called keeping ones' complement "a mistake"
  (quoted by Supnik). There is no complement-and-increment operate, so negating takes
  `CMA` then `TAD (1` (HILO does exactly that); the PDP-15 finally added `IAC`.
- **Conditionals are skips:** `SZA SNA SMA SPA SZL SNL` on AC and link, `SAD` (skip if AC
  differs from memory), `ISZ` (increment and skip on zero), and device IOTs that skip when
  a flag is up. The device flag that a program polls is also what raises the interrupt.
- **`JMS X`** writes the return address (and the link) into word `X` and runs from `X+1`;
  the subroutine returns with `JMP I X`. No hardware stack. The interrupt does the same
  trick at location 0 and jumps to 1, which is why SYMELEC's boot deposits `JMP INT` there;
  `ION` takes effect one instruction late so the handler's final `JMP I 0` gets out first.
- **`LAW`** copies the whole instruction word into AC, which is how `LAW LB` loads a
  display-file address and why PIXIE's names can be tagged opcodes.
- **Text:** the ASR-33 console speaks an early ASCII with the high-order bit forced on,
  which is why SYMELEC's characters are mark-parity (`S` is `323`, Return `215`).
- **Trap mode** makes IOTs and `HLT` privileged and, with extend mode off, confines indirect
  addresses to the current bank: enough protection for simple time-sharing, and what PDP-7
  UNIX ran on. A multitasking Forth could use it to fence tasks into banks.

## 2. JMS and reentrancy

If `X` calls itself, the second `JMS X` overwrites the first return address. If an
interrupt handler calls `X` while the main program is inside it, same thing. The repair is
to move return addresses off the shared entry word onto a stack. Heinz's version,
verbatim from the listing:

```
                          ENTER = JMS .
   2472/      0           0                          /ENTER SUBROUTINE (NAME ENTER
   2473/  42235           DAC OP+3                   /SAVE ENTRY POINT
   2474/ 452013           ISZ LINK
   2475/ 212013           LAC LINK
   2476/ 545173           SAD LKEND
   2477/ 102221           JMS ERR
   2500/ 202472           LAC ENTER-JMS
   2501/ 512212           AND (17777
   2502/  72013           DAC I LINK                 /SAVE LINK
   2503/ 622235           JMP I OP+3                 /ENTER SUBROUTINE

                          EXIT = JMP .
   2504/ 232013           LAC I LINK                 /EXIT SUBROUTINE
   2505/ 552241           SAD (100000
   2506/ 102221           JMS ERR                    /ERROR EXIT
   2507/  42235           DAC OP+3                   /PLANT LINK
   2510/ 212013           LAC LINK
   2511/ 545172           SAD LKBEG
   2512/ 102221           JMS ERR
   2513/ 352232           TAD (777777
   2514/  52013           DAC LINK
   2515/ 622235           JMP I OP+3                 /EXIT
```

The caller puts the target in AC and "calls" through `ENTER`: `LAW COMP` / `ENTER`.
`ENTER`'s own entry word is still shared, but it is copied to the stack three
instructions later. Locals go on the other stack with `STAK`/`UNSTAK`. That is recursion
done right for one task. It is not yet reentrant: a second task, or an interrupt handler
that also used `ENTER`, would need its own `LINK`, `LOP` and `OP` scratch.

## 3. A PDP-7 Forth kernel

Use a **threaded interpreter**, not `JMS` per word. Each task gets a data stack, a return
stack, an instruction pointer (IP), and its scratch cells. Definitions are shared.

**Direct threading fits this machine.** A compiled definition is a list of 18-bit
addresses. Each address points at *executable code*: a primitive starts with its own
instructions; a colon definition starts with `JMP DOCOL`. Put IP in an auto-index location
and it points one cell *before* the next token, so the hardware does the increment:

```
/ sketch, untested. IP = location 10, return-stack pointer = 11.
NEXT,   LAC I 10        / 10 := 10+1, fetch the next execution token
        DAC W
        JMP I W         / run the word's first instruction

DOCOL,  LAC 10          / push the caller's IP
        DAC I 11        / 11 := 11+1, store
        LAC W           / W holds the address of this word's JMP DOCOL;
        DAC 10          / the thread starts at W+1 and auto-index adds the 1
        JMP NEXT
```

`NEXT` is three instructions. `EXIT` has to pop, and auto-index only counts up, so one of
push and pop pays for arithmetic (`LAC 11` / `DAC T` / `LAC I T` / `DAC 10`, then
`TAD (777777` back into 11). Which one should pay is exercise 2.

Choices that follow from the hardware:

- **One cell = one word.** Addresses and tokens are cells.
- **Integers are two's complement via `TAD`**, −131072 … 131071. Treat `ADD` with care.
  The cabinet's assembler evaluates expressions in ones' complement, as DEC's did.
- **Text:** one character per cell to start. Pack later if memory runs out.
- **Where does top-of-stack live?** An accumulator machine begs you to keep it in AC.
  `NEXT` clobbers AC. What would `NEXT` have to give up? (Exercise 3.)
- **Task switches** save IP, both stack pointers, `W`, AC and link. Private stacks don't
  make shared scratch cells reentrant.
- `VARIABLE` is shared on purpose; give tasks task-local variables where needed.

Build single-tasked first: the kernel, `DOCOL`/`EXIT`, stack words, `@ !`, branches,
literals, teletype I/O. Then add task-local state and scheduling.

## 4. Turtle graphics without floating point

The 340 already draws vectors, so Forth only computes their X and Y components and
assembles a display file. Facts from the [H-340 manual](H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf):
a 1024×1024 grid; a vector word carries signed dx and dy up to 127 each, plus intensify
and escape bits; scale ×1/2/4/8; intensity 0–7. (Heinz specified exactly this in March
1967: *"a vector length of 127 dots seemed to be sufficient"*, [system analysis](../1967-03-10-system-analysis/TRANSCRIPT.md).)

```
512 512 SETXY  0 SETHEADING  PENDOWN
100 FORWARD  90 LEFT  100 FORWARD
```

- **`PENUP`** emits invisible vectors; **`PENDOWN`** visible ones. A long `FORWARD` splits
  into ≤127-unit vectors.
- **Fixed point is enough.** 256 heading units per turn; a 65-entry quarter-wave sine table
  scaled by 16384 (Q14); symmetry gives the other quadrants. `dx = d·cos`, `dy = d·sin`: EAE
  multiply into AC:MQ, shift right 14. Without EAE, a shift-and-add primitive.
- **Keep the fractional remainders** in the turtle state, or curves drift.
- **It's a vector CRT, not a bitmap.** The drawing *is* a display file the 340 re-reads
  every refresh. Build the next picture in a second buffer and switch with one `DJP`, so the
  340 never fetches half-written words — PIXIE's `TEMPDF`/`PERMDF` trick.

Order: a 90° turtle with no trig (a square needs only additions and proves the whole
Forth-to-340 path); display-file redraw; arbitrary headings; curves; light pen.

## 5. The spectrum, from assembler to interpreter

| Layer | You write | What runs at refresh |
|---|---|---|
| 340 assembler in Forth | Words that emit display words: `PARAM`, `POINT`, `VECTOR`, `DJS`, `STOP` | The 340 executes them directly |
| Turtle as a compiler | `100 FORWARD 90 LEFT …` | Precomputed 340 words; no turtle math at refresh |
| Turtle list as source | Records `MOVE 100`, `TURN 90`, `PEN DOWN`, recompiled on demand | 340 words, regenerated when scale or view changes |
| Live turtle interpreter | Forth updates turtle state each frame | The PDP-7 rewrites the display file continuously |

Recommended shape: turtle words → optional editable turtle list → Forth 340 assembler →
native display file → 340. The assembler stays useful by itself for hand-written display
programs. Give CPU and display their own vocabularies with explicit switches between them,
as the Cambridge assembler's `DISP`/`NODISP` already did. The 340 assembler must track the
current display mode, because a word means different things in different modes.

## 6. Light pen, tags and widgets

On a hit the 340 stops with its state intact. The PDP-7 skips on the pen flag (`IDSP`),
reads the beam coordinates (`IDRC`), decides what was hit, and resumes (`IDRS`). To turn
that into objects, keep a table beside the display file:

```
display-file address range  ->  object id  ->  handler
```

- A button's outline and label occupy two ranges and map to one id.
- **Shared display subroutines are ambiguous.** A glyph called from ten places gives the
  same address wherever it's hit. The 347 has one save register; Myer & Sutherland name
  exactly this traceback problem. Start by compiling clickable instances separately.
- **The pen sees only lit strokes**, never an abstract box. A thin outline is a thin
  target: fill it with a bright pattern, or use the hit coordinates against logical bounds.
- **Interaction needs state:** press, drag, release from a stream of hits. Sliders map hit
  position to value; dials map angle around a centre.
- **Fonts:** the 342 character generator is the fast path; stroke fonts through the
  geometry compiler give any size and symbol. Layout sits above both.
- Display-file length is the budget. More words, more flicker.

First milestone: three tagged buttons in native 340 words; hit one with the pen; its Forth
handler changes the display file. The [cabinet](../../../../packages/cabinet/README.md)
already records every stroke with the display-file address, subroutine and block that
drew it, and [`symelec-hints.js`](../../../../apps/ties/src/lib/symelec-hints.js) maps
SYMELEC's own addresses to what the buttons mean. That's the tag table, built from the
outside.

## 7. The wheel of reincarnation, as a design exercise

T. H. Myer and I. E. Sutherland, *On the Design of Display Processors* (CACM, June 1968) —
reading notes: [`../../../ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md`](../../../ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md).
They place the **DEC 340–347** at the wheel's half-turn: the display address is a program
counter, the X/Y registers an accumulator, and the display file has jumps and subroutine
calls. Their exit from the wheel: give the display enough to *execute* picture structures,
and leave **compiling** them from rotation, scaling and curves to the parent computer. They
allow more computing near the display when bandwidth forces it.

A PDP-7 Forth makes the boundary something students can move and measure:

| Where | Job |
|---|---|
| PDP-7 Forth | Turtle geometry, transforms, widget state, hit interpretation, compiling display files |
| 340 + 347 | Execute display files; report pen hits |
| A smarter display (hypothetical) | Stacks, conditionals, local interaction: once more around the wheel |
| Titan, across the link | For PIXIE: analysis and file store. The bandwidth case, for real ([thesis §3.3](../phd-thesis-1972/annotated/02-chapters-3-4.md)) |

**NeWS** is a later lap with a different boundary: the client downloads PostScript into the
window server, which runs drawing *and* local interaction and sends back only meaningful
events. The case for it is the same one Myer & Sutherland allow: when the display is across
a network, move behaviour to the display. Don made that case in September 1988, in a
position statement for Robin Schaufler's proposed CHI panel,
[*Rapid Prototyping in Interactive Programming Environments*](https://www.donhopkins.com/home/catalog/text/interactive-programming.html):

> With NeWS, a programmer can use object oriented PostScript to build a graphical front end
> to an application that provides local input processing and feedback, resulting in low
> client/server network traffic and high interactive performance.

**The exercise.** Build one light-pen menu three ways:

1. The host interprets every action.
2. The host compiles tagged native 340 display words.
3. NeWS-style: the menu's behaviour runs at the display end.

For each, ask: where does the event become meaningful? At the beam hit, the display
word, the widget, or the application command? What crosses the processor or network
boundary, and how often? Forth is the right tool for this because the assembler, compiler,
interpreter and debugger are one live language, so moving the boundary is an edit, not a
rewrite. The same 1988 statement says to pick the language by what you want to talk about,
and lists what each is good at. NeWS: "graphics, geometry, transformations, ... input
devices, events, canvases, processes ... windows, menus". Forth: "hardware, registers,
interrupts, real time control, diagnostics, integers, pointers, stacks, words, vocabularies,
control structures, interpreters, assemblers, disassemblers, compilers, decompilers, meta
compilers". A PDP-7 with a 340 needs the Forth list at the bottom and the NeWS list on top,
which is this course.

## 8. Exercises

1. **Read `ENTER`/`EXIT`** (above). What breaks if an interrupt handler calls `ENTER`?
   Does any interrupt path in SYMELEC call it?
2. **Write `NEXT`, `DOCOL`, `EXIT`** in the DEC dialect of the cabinet's
   [assembler](../../../../packages/cabinet/src/asm.ts), boot them as a tape like
   [HILO](../../../../packages/cabinet/tapes/hilo/hilo.s), and count cycles per word. Which
   of push and pop should pay for the arithmetic?
3. **Top of stack in AC:** redesign `NEXT` so the AC survives. What does it cost?
4. **90° turtle:** draw a square as a display file and start it with `IDLA`.
5. **Sine-table turtle** with fractional remainders. Draw a circle as a 256-gon; did it close?
6. **Three tagged buttons** and a pen handler (the milestone in §6).
7. **Read `COMP`** (listing pp. 87–92) and compare it with your turtle compiler.
8. **The wheel, three ways** (§7).

The cabinet follows a corpus rule: it implements only what its programs execute. A Forth
tape would be a new corpus entry, and whatever it needs that SYMELEC never used (EAE
multiply, perhaps) gets implemented because it asked.

## 9. Rings as a Forth data type

PIXIE's RSP words carry their own type tags ([turist guide](GUIDE.md#pixies-data--ring-structures-from-the-ground-up)),
so rings fit Forth without changing Forth: everything is still an 18-bit cell, and
`ATOM?`, `NIL?`, `NAME?`, `BLOCK?`, `RING-END?` are one-instruction bit tests.

**Layer 1: wrap Heinz's own routines as code words** instead of rewriting them.

```
CODE CAR   LAC TOS  JMS CAR7  DAC TOS  JMP NEXT     / sketch
```

- `CAR CDR CONS` (a cell from `FLST`) `PUSH POP NIL`; `RPLACA`/`RPLACD` if RSPPIX has them
- `EACH ( ring xt -- )`, which stops at the ring's closing link, not at NIL
- `" FERN" PNAME ( -- name )`, printnames as mark-parity character atoms, as `COPIN` stores them
- `.RING` prints tagged structure the way Lisp prints lists; `RDUMP` prints octal with classes.
  A teletype REPL on his own data structure, which Heinz never had
- checked by default (`CAR` aborts on a non-name), `(CAR)` unchecked
- not reentrant: RSPPIX shares `OP`, `LOP` and `LINK`, so one ring-owning task, or swap a
  per-task `OP` area on task switch

**Garbage collection versus Forth's stacks.** SYMELEC's collector marks from its own roots
(`SAVINS`, the name list, hand-protected cells like `EL1`: "prevent tail being swept up").
A Forth adds names on its data and return stacks. The tags make it safe to scan both stacks
**conservatively**, skipping block data as the relocation pass does. Keep collection
**non-moving** while the Forth is live (the mark-and-sweep `GARB` path); compact or
relocate only at `SAVE` or a Titan transfer, when no stack holds names. Or give rings their
own stack, as PIXIE's `LOP` is used, so the roots are precise.

**Layer 2: PIXIE's element vocabulary**, `NODE BRANCH SEGMENT SUBPICTURE INSTANCE ATTACH
GROUP CATALOGUE LABEL`, after the RSPPIX element semantics are decoded. Two hooks: a `DOWN`
word that compiles rings to the permanent display file as `COMP` does, recording display
address → ring name so a pen hit returns the element (the tag table of §6); and PIXIE's
`LABEL` names becoming Forth words, so `R1 .RING` inspects the resistor you just drew.

**The turtle's display list is ring data.** Store each polyline as an RSP block (raw
coordinates the relocation pass leaves alone) named from a picture list, and let `DOWN`
compile it. The TypeScript twin of this plan is in the cabinet's
[DESIGN.md](../../../../packages/cabinet/DESIGN.md#the-application-layer--packagespixie-separate-module),
sharing `graftal.ts`'s display-word emitter; both should produce the same words.

**Acceptance.** `TITAN-SEND` / `TITAN-RECEIVE` words speak to tiny-titan. A Forth-built
`" FERN" PNAME` sent over the link must decode to `"FERN"` in `packages/pixie`, as its
existing test does. The prize: 1972 SYMELEC loads a ring image the Forth built and draws it.

Exercises: 9. Write `EACH` and `.RING` against a `RingBuilder` image loaded into the
cabinet. 10. Make a Forth-built turtle picture survive `relocate` and draw identically.

## To check before this goes to class

- Auto-index: increment before use is confirmed (Supnik, and SYMELEC's `DAC I 10` ring
  loops); check the timing detail in the [Users Handbook](F-75_PDP-7userHbk_Jun65.pdf), and
  that the cabinet implements it per bank.
- What the 340 reports when the pen hits a character or an increment-mode word: which dot?
- The 347's subroutine nesting depth, and exactly what `DDS` deposits at location 3.
- The 340's display address counter: Mitch's DESIGN.md (and SIMH) say 12 bits, so his display
  list sits below 4K; SYMELEC starts the 340 at `12301` in the upper 4K, and the cabinet
  uses 13 bits to run it. Did Cambridge's 340 have a wider counter, or does SYMELEC depend on
  something else? Check the H-340 manual.
- ~~Trap mode~~ confirmed by Supnik (IOT and `HLT` privileged; KA70A adds a bounds register);
  find its IOTs in the Users Handbook before a Forth relies on it.
- All sketch code above: assemble it and run it before anyone trusts it.

↑ [reference library](README.md) · [turist guide](GUIDE.md) · [emulation plan](EMULATION-PLAN.md) ·
[PIXIE listing](../pixie-assembler-listing-1972/README.md) · [cabinet](../../../../packages/cabinet/README.md) ·
[Roy Eagleson](../../../roy-eagleson/README.md) · [Lars Brinkhoff](../../../lars-brinkhoff/README.md) ·
[Seymour Papert](../../../seymour-papert/README.md) · [Charles Moore](../../../charles-moore/README.md)

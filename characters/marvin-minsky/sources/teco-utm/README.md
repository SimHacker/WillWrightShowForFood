# Marvin Minsky's TECO Universal Turing Machine

Ongoing recovery of the program Minsky posted to ITS `*BBOARD` on 11 March 1981
as `Re: too-short programs`. He wrote: "When I wrote the following Universal
Turing Machine, which works, I actually understood it." And: "I do not advise
attempting to understand this code, which is almost as bad as that for the
Universal Turing machine."

Against that advice: the mail is not a generic TECO TM interpreter. It *is*
the 7-state 4-symbol UTM from **AI Memo 33** (1961/62), published as
"Universality of (p=2) Tag Systems and a 4 Symbol 7 State Universal Turing
Machine" (AMS 1962). Same table in *Computation: Finite and Infinite Machines*
(1967) §14.8. Paper `X` is TECO `y`; paper `B` is TECO `A`; states `q1`–`q7`
are Q-registers 1–7.

This directory is the research room. The 2015 ask that recovered the mail is
the method for the next ask: [`open-ask.md`](open-ask.md).

## In this room

| File | What |
|------|------|
| [`minsky-TECO-turing-machine.txt`](minsky-TECO-turing-machine.txt) | The 1981-03-11 mail, kept whole. Ancell dump, 690 bytes |
| [`minsky-utm.teco`](minsky-utm.teco) | TECO command only, 318 bytes, raw `ESC` / `^^` / evacuated CR |
| [`minsky-utm.teco.hex`](minsky-utm.teco.hex) | Same bytes as a hex dump |
| [`minsky-utm.teco.txt`](minsky-utm.teco.txt) | Same program as eight logical lines (`$` = ESC) |
| [`teco-in-javascript.md`](teco-in-javascript.md) | No *complete* JS ITS TECO; subset engine is `@wwsff/teco` |
| [`../../../../packages/teco/`](../../../../packages/teco/README.md) | Extensible TypeScript TECO — register commands, run the raw `.teco` |
| [`table.yml`](table.yml) | 28 transitions + initial tape + the 1,870-step halt |
| [`simulate.py`](simulate.py) | Independent stepper of that table |
| [`simulator.html`](simulator.html) | Browser tape + state-space "body" |
| [`hn-2015-ask.md`](hn-2015-ask.md) | Don asked; Harold Ancell answered |
| [`hn-2016-dang-wolfram.md`](hn-2016-dang-wolfram.md) | dang on Wolfram's Minsky farewell: the tic is off topic |
| [`open-ask.md`](open-ask.md) | Next ask, to anyone |
| [`tots-request.md`](tots-request.md) | Henry → Distinctive Collections: versions, DUMP dates, neighbors |
| [`oral-history.yml`](oral-history.yml) | Henry Minsky, 2026-09-22 |

AIM-33 PDF is not cached here yet. Historic CSAIL browse lists it as AIM-33,
no date on the card, abstract: tag-system proof plus "a Universal Turing
machine with just four symbols and seven states — the smallest yet reported."
AIM-52 (Cocke & Minsky, April 1963) is the later *p*=2 tag-system writeup,
not the UTM table.

## What the TECO is doing

One command is four programs at once:

1. An assembler for the compact `read write dir next` table.
2. A TM interpreter (computed macro dispatch through Q-registers).
3. A tape: encoded tag-system rules, working sequence, blank padding.
4. A trace: print the tape, run one transition, print the state.

The 28 four-character groups are the whole finite table. Example: `0yR2`
means "if reading `0`, write `y`, move right, enter state 2." Seven rows of
four, one row per state, symbol order `y 0 1 A` (paper `X 0 1 B`):

```
q1: y0L1 00L1 11L2 A1L1
q2: y0L1 0yR2 1AR2 AyR6
q3: yyL3 00L0 1AL3 A1L4
q4: yyL4 0yR5 11L7 A1L4
q5: yyR5 0yL3 1AR5 A1R5
q6: yyR6 0AL3 1AR6 A1R6
q7: y0R7 0yR6 11R7 A0R2
```

State 0 has no row. That is halt. The paper's halt is the same transition
that is sitting in the table: state 3 reading blank `0` does `00L0`.

### The compile pass

Two search-replace loops rewrite every `R` and `L` in that table into
executable TECO. Conceptually `0yR2` becomes:

```
QL-^^0"E D ^^yI 2UQ '
```

`QL` is the character under the head (numeric). `^^0` is ASCII `0`.
`"E … '` is the equality conditional. `D` deletes the old cell, `I` inserts
the new symbol, `nUQ` sets the state. A left move also inserts `-2C`: after
an insert, point sits to the right of the new character, so two steps back
select the cell on the left.

Minsky is compiling a pleasant four-character notation into TECO
conditionals *by editing the notation itself*. Then

```
J XB L X1 L X2 L X3 L X4 L X5 L X6 L X7 HK
```

copies the dispatcher into Q-register B, the seven compiled rows into
Q-registers 1–7, and kills the temporary source.

### The dispatcher

The first generated line is:

```
1A UL
QQ+^^0 :IQ
M ^]Q
```

`1A UL` reads the tape character immediately right of point into Q-register
L. `QQ+^^0 :IQ` turns numeric state 3 into the one-character string `3`.
`M ^]Q` substitutes that Q-register, so the command becomes `M3` and runs
the compiled row. Computed macro dispatch in a few characters.

The `\356` in Ancell's interpolation is not an opcode. The downloaded file
is in Alan Bawden's evacuated PDP-10 encoding; octal 356 is a standalone
carriage return (`itstar`). It separates the dispatcher from state 1. The
mail copy also grew Unix line wraps. Run from the eight logical lines in
[`minsky-utm.teco.txt`](minsky-utm.teco.txt), not from the wrapped dump.

### The tape

```
110101110000010011011 yyAyyAyy 00000000000000000000000000000000
                      ^
```

Head = TECO point, the gap before the current cell. Initial state 1.

Paper regions: rules | erased | working sequence | blank. Here the erased
region starts at length zero. `y` is `X`, `A` is `B`.

Tag-system encoding, from the memo:

- `Abar(j) = j + sum(r(i) for i < j)`
- Symbol `A_j` in the working sequence is `X^(Abar(j)-1) B`, except the
  last symbol needs no trailing `B`.
- A production `A_j → A_j1 … A_jr` becomes a binary rule string starting
  `11`, then unary encodings of the output symbols in reverse:
  `11 0^Abar(jr) 1 … 0^Abar(j1) 1`
- Rules concatenate in descending symbol order.

`yyAyyAyy` is three symbols in that code. The bit string on the left is
their productions. Worked examples are in AIM-33, not reconstructed here.

### The run loop

```
< HT MB QQ= >
```

Forever: type the whole tape, execute dispatcher B, type the new state.
State 0 has no macro, so TECO errors or stops. That is halt.

`simulate.py` of the embedded table and tape reaches state 0 after **1,870**
transitions. Significant tape at halt:

```
11010111000001001101100000000000000000000000000yAAAA
```

Consistent with the documented halt: state 3, reading `0`, `00L0`.

## The visualization

A TM has two moving parts. The tape *head* is the one everyone draws. The
other is the *body*: the current state, walking a graph that never changes.
Don wrote this out on HN in 2016 (item 10989396): each state is a room;
each door is labeled with the tape symbol that opens it, writes a symbol,
moves the head, and leads to another room. The rooms encode data in their
connections. The tape can change; the floor plan cannot.

[`simulator.html`](simulator.html) is that picture running the 1962 table.
It does not interpret TECO. It runs the machine the TECO compiles. That is
the honest translation. A Cherniak-class assignment is "write a TM on a
simulator." This page is the simulator with Minsky's UTM already loaded.

## Henry, 22 September 2026

Two notes, same day, [`oral-history.yml`](oral-history.yml):

1. A visitor told Marvin he had a UTM with fewer states. Marvin said the
   visitor had changed the rules. Henry does not remember how.
2. Marvin once wrote a paper in TECO on a printing terminal, hit a command
   that sorted the whole paper, and had no undo.

The first is an open question about *definitions*, filed as
[`open-ask.md`](open-ask.md) item 5. Later machines that beat 7×4 on one
parameter usually move the other, or leave the 1962 model: infinite
periodic background (weak universality), 2-symbol conversions, different
halt. Robinson 1991 still treated Minsky's 7×4 as minimal in the
decrease-one-without-increasing-the-other sense; Rogozhin's later family
keeps a 7×4 as one of the tradeoff points. Do not turn Henry's memory into
a named challenge.

The second sits next to this program because it is the same editor. The
UTM mail is TECO compiling a table by editing itself. The lost paper is
TECO on a printing terminal with no undo. The surviving object is a
BBOARD mail, not a file from `AI:MINSKY;`. That is why.

## What is still missing

The original `AI:MINSKY;` FN1, every FN2, and the DUMP dates (create,
last-write, last-read). Public ITS trees still show only `TVDIS`.
Neighbors matter as much as the hit: data files, docs, AIM-33 drafts.
Henry already has ToTS pulls of Marvin's files; he is the asker —
[`tots-request.md`](tots-request.md). The everyone-ask stays
[`open-ask.md`](open-ask.md).

↑ [sources](../README.md) · [character room](../../README.md)

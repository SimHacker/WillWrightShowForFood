# *LLOGO: An Implementation of LOGO in LISP* (MIT AI Memo 307, 1974)

Ira Goldstein, Henry Lieberman, Harry Bochner and Mark L. Miller. MIT Artificial Intelligence
Laboratory, AI Memo 307 and Logo Memo 11, June 27, 1974. 93 scanned pages.

- [The scan (PDF)](aim-307-llogo-1974.pdf), from [MIT DSpace](https://dspace.mit.edu/handle/1721.1/6220)
- [OCR text](aim-307-llogo-1974.ocr.txt), with a `=== scan page N ===` marker at each page
- [Metadata and structural index (YAML)](aim-307-llogo-1974.yml): every section and subsection with
  its scan page, the devices the memo drives, and the passages on variable binding
- Quotations below are from the OCR, corrected against the scan where the OCR garbled them.

**What this scan contains.** Scans 1 to 76 are the June 1974 memo. Scans 77 to 93 are pages
dated March 4, 1975, from the revision [AIM-307A](../aim-307a-llogo-1975/README.md): the second
half of a new Section 17 on the Knight TV turtle, and the revised indexes. DSpace's copy of the
1974 memo has them bound in, so this file holds the best text of LLOGO's TV implementation
(Section 17.22) even though it is labelled 1974.

## What LLOGO is

LLOGO is Logo written in MacLisp. It ran on ITS at the MIT AI Lab, on DEC's TEN50 and BBN's
TENEX on other PDP-10s, and on Multics. The other two Logos at the AI Lab, CLOGO on the PDP-10
and 11LOGO on the PDP-11/45, were in assembly language. LLOGO turns each Logo line into Lisp as
it is defined, so "LISP LOGO is basically a compiler": a Logo procedure is a Lisp `PROG`, and its
line numbers are the `PROG`'s tags (Section 3.3).

The memo is three things at once: an argument about what a beginner's language should be, a
description of how to build one inside Lisp, and a user's manual for the Logo you get, including
its devices. Its source survives; see [the LLOGO source and its rescue](../../../don-hopkins/sources/llogo-maclisp-its.md)
and the [ITS repository's `src/llogo`](https://github.com/PDP-10/its/tree/master/src/llogo).

## Why build Logo in Lisp (Section 1)

Lisp's power, the memo says, comes from "the uniform representation of programs and data", from
s-expressions, and from recursion. "Power, however, is not necessarily good pedagogy." The two
languages share a core: both are time-shared, interpretive and fully recursive, with sub-procedures
defined independently of their callers and numbers and lists handled equally well. So a Logo
written in Lisp gets lists, recursion, garbage collection, error traps and interrupts for free,
and its programmers can spend their time on "better error analysis" and "pedagogical
simplifications". LLOGO "unifies language development across a broad spectrum ranging from
PLANNER and CONNIVER through LISP to LOGO".

The second reason is a path upward: a student who outgrows Logo can reach arrays, functions of any
number of inputs, functions that don't evaluate their inputs, Micro-PLANNER and CONNIVER,
interrupts, the Lisp compiler, property lists, floating point, cursor control and bignums,
without changing systems.

## Logo versus Lisp: simplicity, naturalness, disparity (Section 2)

The longest argument in the memo, and the part most worth reading today. It sorts the
differences between Logo and Lisp under three educational goals, "Simplicity of both the
computational and explanatory kind", "Naturalness wherein the overhead for a naive user is
minimized by following standard English conventions", and "Disparity which emphasizes the
distinction between various modes such as defining versus running programs", and then argues with
itself. Almost every design choice is followed by a "Criticism" or an "Alternative view". The
memo says the goals conflict and offers "a spectrum of possibilities from which a teacher can
build a computational world tailored to his own pedagogical purposes".

**Simplicity (2.1).**
- *Lists versus sentences.* CLOGO allows only flat "sentences", because nested lists need
  recursion to explain; the alternative view is that recursion is too important to leave out.
  `FIRST`, `BUTFIRST`, `LAST` and `BUTLAST` work on words as well as sentences, whatever they cost
  Lisp. Repeated `BUTFIRST` always ends in the empty list, so Logo avoids Lisp's "slip-through"
  bugs with dotted pairs.
- *Rigid program form.* Numbered lines make it easy to name where a bug is. The criticism: Logo
  lets a line hold any number of calls, which defeats the point; the memo suggests DDT-style
  labels with offsets instead of line numbers.
- *Integer arithmetic.* CLOGO starts with integers only; the criticism is that this confuses
  children too, and that Lisp's unbounded integers avoid arbitrary limits.
- *Conditionals.* `TEST` sets a flag that later `IFTRUE` and `IFFALSE` lines read. The criticism:
  conditionals can't nest, and "In LLOGO, the flag set by TEST is simply a LISP variable. Since it
  is global, TEST's in sub-procedures can affect IFTRUE's in the super-procedure. This introduces a
  non-local nature to control structure." The lack of loops like `DO` and `MAPCAR` encourages
  `GO`, and Logo programs can't be pretty-printed to show their structure.

**Naturalness (2.2).** Mnemonic names (`FIRST` for `CAR`); CLOGO's noise words (`AND`, `THEN`,
`TO`), mostly dropped in 11LOGO and LLOGO because they complicate the parser; English words that
mislead (`IS` for equality, `TO` for defining, where "define" might be better); and parsing
without parentheses, so `FORWARD 100 RIGHT 90` reads to anyone, with infix arithmetic and
parentheses allowed when programs get complicated.

**Disparity (2.3).** Logo separates defining a procedure from running it, which Lisp doesn't;
the memo criticises Logo for running unnumbered lines typed during a definition: "In its wistful
desire for more computational power, LOGO has forgotten its epistemological foundations." Logo
forbids homonyms: a word preceded by `:` is a variable and otherwise a procedure call, where Lisp
decides by position. Lisp's `NIL` as both empty list and false is convenient but "has no
conceptual basis". Line-oriented input lets Logo catch extra right parentheses that Lisp can't.

## How LLOGO is built (Section 3)

- **Reader (3.1).** A line-oriented Lisp reader. Separate readtables give Logo and Lisp their own
  character syntax, and separate obarrays keep Logo users away from LLOGO's internals. "MACLISP
  allows any number of separate 'readtable's and 'obarray's. This permits multiple worlds,
  PLANNER, CONNIVER, LISP, LOGO, to co-exist with no conflict. Switching worlds is computationally
  fast. All that is necessary is to rebind the READTABLE and OBARRAY variables to the desired
  world."
- **Parser (3.2).** The hardest part, because of infix operators, primitives whose number of
  inputs changes inside parentheses (`SUM`, `SENTENCE`), primitives like `TO` that don't parse
  their input, and names that mean different things in Logo and Lisp. Parsing information lives on
  each function's property list.
- **Evaluation (3.3).** Arithmetic, list and logical primitives are Lisp's, renamed, with more
  type checking and better error messages.
- **Printing (3.4).** Because procedures are stored parsed, printing and editing them needs an
  "unparser"; user-typed parentheses are marked with a do-nothing `USER-PAREN` so nothing is lost.
  Lines calling procedures not yet defined are parsed at run time, once.
- **Error analysis (3.5).** Type checking on every primitive, the offending line and line number,
  a chance to retype a line the parser rejects, breakpoints, stack exploration, and Lisp's `TRACE`.

## Performance (Section 4)

Lisp took 26 blocks of 1024 36-bit words, and compiled LLOGO 14 more, 40 in all, of which 11 of
LLOGO's 14 were pure and shared among users. Parsing and interning happen once, at definition, so
LLOGO usually ran faster than CLOGO and 11LOGO; CLOGO was faster with words, because it stored
strings. Almost all of CLOGO's and 11LOGO's primitives were implemented, "including the music box,
display turtle for the PDP-6 and GT40", and the turtle, music and GERMLAND packages could be loaded
into a plain Lisp too.

## Using it (Sections 5 to 13)

- **Getting started (5).** Log in to ITS and run `LLOGO`, `11LOGO`-vocabulary `LLOGO` or the
  experimental `NLLOGO`. LLOGO then asks which device packages to load, and that is where the
  sentence about seeing your program comes from: "It is not necessary that you have the 340
  display scope, or the GT40 display, to do just defining and editing. You can even run the
  procedure if you do not mind not being able to see what the procedure does."
- **Parsing (6).** Infix and prefix mix freely; LLOGO follows the usual arithmetic precedence,
  unlike CLOGO, which gave all operators the same precedence "on the grounds that precedence would
  be difficult to explain clearly to children". "LLOGO tries to please everybody": precedences can
  be redefined and new infix operators added. Then the minus sign, homonyms and abbreviations.
- **Editing (7).** `TO` and `EDIT` enter an edit mode with a `>` prompt; setting `:EDITMODE` to
  `NIL` removes the separate mode for users who find it a nuisance.
- **Errors and debugging (8).** "The philosophy of the LISP LOGO error handling system is to try
  to be as forgiving as possible." Parsing errors let you fix the line and carry on. Breakpoints
  (`PAUSE`), moving up and down the stack, printing frames, and returning a new value with
  `CONTINUE` make Logo its own debugging language. Control-@ switches between the Logo and Lisp top
  levels.
- **Compiling (9).** Logo procedures compile with the MacLisp compiler, with declarations for the
  primitives; see [variable binding](#variable-binding-what-the-memo-says), below.
- **Files (10)**, **differences from 11LOGO (11)**, **Multics (12)** and **TEN50 and TENEX
  (13).** Section 11 is the list an 11LOGO user needs: quoting with `'`, `"` and `$`, square
  brackets, `#` to cross between the Logo and Lisp obarrays, `T` and `NIL` for true and false,
  a read-eval-print top level (`SUM 4 8` prints `12`, where 11LOGO says "YOU DON'T SAY WHAT TO DO
  WITH 12"), arrays, `RANDOM`, one global test box, and `LOCAL`. On Multics, the display packages
  were missing, but "We do hope to have available soon, however, facilities for using the
  mechanical floor turtles (controlled by the Thornton Box) on both ITS and MULTICS."

## Variable binding: what the memo says

The memo does not argue for dynamic scope as a design principle. It inherits MacLisp's: an
interpreted MacLisp variable was dynamically bound, and compiled code had to declare a variable
`SPECIAL` to behave the same way. LLOGO's compiler does that for every Logo variable (Section 9,
scan 34): "For safety's sake, all variables are automatically declared SPECIAL. However, the
sophisticated user is free to include in his program DECLAREs to UNSPECIAL input or local variables
which he knows will not be referenced globally, or provide declarations which will make use of the
fast-arithmetic LISP compiler." It adds that "procedures which depend heavily on maintaining the
dynamic environment of the interpreter may fail to compile correctly without modification."

The rest is consistent with that: `LOCAL` makes a variable local to the whole procedure, "a PROG
variable in LISP" (Section 11); `MAKE` sets a Lisp atom whose name begins with a colon; the `TEST`
flag is one global variable (Section 2.1); and LLOGO switches between the Logo and Lisp worlds by
rebinding `READTABLE` and `OBARRAY` (Section 3.1).

The argument for keeping dynamic scope in Logo, made deliberately, is in the 2020
[*History of Logo*](../../../cynthia-solomon/sources/history-of-logo-hopl-2020/README.md), Section 3.7,
"Dynamic Scope". Brian Harvey's side of the same argument with Jens Mönig is collected in
[Snap! macros and metaprogramming](../../../brian-harvey/sources/snap-macros-metaprogramming.md) and the
[Snap!/Logo show's dynamic binding question](../../../../repo-shows/snap-logo-brian-jens/audience/palm/questions.md#3--dynamic-binding-controversy).

## The devices (Sections 14 to 17)

The memo's Section 3 says why devices get their own sections: "The 'LOGO project' is concerned with
more than the development of a computer language. Of major interest is the design of various
computer-driven devices which provide a rich problem solving environment for the student." And
for devices like the music box, driven by ASCII characters, Lisp is an advantage: "the primitives
can be written in LISP or LOGO and then compiled. It is not necessary to create code at the
machine level."

- **GERMLAND (14).** A grid on any character display terminal at the AI Lab, where up to ten
  "germs", each run by its own Logo program, move about and eat food. Ira Goldstein's Logo Working
  Paper 7 describes the problems it was for. Primitives for the grid, properties, several germs,
  turtle moves on the grid, and touch.
- **The display turtle (15)** for the Type 340, driven through a "display slave" on the PDP-6 (if
  it dies, "check that the run light is on"), and for the GT40, which "must not be logged in to ITS
  as a console" while the turtle uses it. Moving, turning and examining the turtle (`:XCOR`,
  `:YCOR` and `:HEADING` are floating point); the pen; global navigation; trigonometry; text;
  `SNAP`, which saves a picture as a display-list subroutine; the **plotter** (15.12), which plots
  the display on a new or the current page; **pots** (15.13), where `DIALS` reads a pot as a
  fraction from 0 to 1 ("the dials on the pots are marked in octal"); points; and the turtle's
  global state.
- **The music box (16):** "a tone generator for from one to four simultaneous voices, having a
  range of five octaves". Because of time-sharing, music is compiled into a buffer and sent all at
  once. The old music box ("Minsky") plugs into the back of an Execuport terminal on a 300 baud ITS
  line, or is "all set up in the music room on the third floor"; the new one ("Thornton box
  compatible") goes into port 1, 2 or 3 of a Thornton box, with a "terminal controller card" from
  General Turtle "in the basement of 545 Tech Square" in port 4: "Putting it in backwards will burn
  out the card."
- **The Knight TV turtle (17, the March 1975 pages).** A raster turtle on Tom Knight's TV
  terminals: screen and turtle sizes; positive and negative screen colour; **windows**, rectangles
  of the screen saved as arrays of points. Unlike the 340's `SNAP`, which saves display lists, a
  window is "What you see is what you get", and a point array suits "say, a space war program,
  where the space ship must be redisplayed rapidly"; printing on the Xerox Graphics Printer; shading and
  shading patterns; an invisible mode for debugging the non-graphic parts of a program; and
  extensions it hoped for, including input "from a light pen, joystick, tablet, or mouse".

  Its implementation (17.22) is the cabinet's model for shared memory: "The PDP-11 which controls
  the TV terminals maintains the user's screen in its memory, one bit per point. An ITS system call
  allows the 11's memory to be mapped into the address space of a program running on the PDP-10. An
  initialization routine written in LAP assembly language performs this system call, and sets up an
  array header which convinces LISP that this area of memory is really the data for a LISP
  two-dimensional integer array." Each array element is a 36-bit word holding "two 16 bit PDP-11
  words, left justified", whose low four bits must stay zero; lines run 0 to 454 and words 0 to 17,
  "for a total of 18 × 32 = 576 bits per line". `DRAWMODE` sets the PDP-11's write function, so a
  store from the PDP-10 is combined with what is already there: `IOR`, `XOR`, `ANDC`, `SAME`, `COMP`,
  `EQV`, `SETO`, `SETZ` or `SET`. The cabinet's reading of the same code, line by line:
  [MAPPING.md, "LLOGO: a Lisp array that is the screen"](../../../../packages/cabinet/MAPPING.md#llogo-a-lisp-array-that-is-the-screen).

The cabinet plans to emulate every one of these devices:
[LOGO-TURTLE.md, "Every device Logo drove, to emulate"](../../../../packages/cabinet/LOGO-TURTLE.md#every-device-logo-drove-to-emulate),
with the layering that lets a data hand turn LLOGO's `DIALS` in
[DEVICES.md](../../../../packages/cabinet/DEVICES.md).

## Related

- [Henry Lieberman's page](../../README.md), with all of his Logo papers in this repo
- [AIM-307A, the March 1975 revision](../aim-307a-llogo-1975/README.md)
- [*The TV Turtle* (AIM-361, 1976)](../aim-361-tv-turtle-1976/README.md), Henry's paper on the raster
  turtle that Section 17 documents
- [*Logo Turtle Graphics for the Lisp Machine* (WP-214, 1981)](../wp-214-lisp-machine-turtle-1981/README.md),
  the TV turtle carried to the Lisp Machine, with colour and a 3D turtle
- [*History of Logo* (2020)](../../../cynthia-solomon/sources/history-of-logo-hopl-2020/README.md),
  which Henry and Mark L. Miller co-wrote
- [The LLOGO source and its rescue](../../../don-hopkins/sources/llogo-maclisp-its.md), and
  [the Logo turtle at the AI Lab, as the cabinet tells it](../../../../packages/cabinet/LOGO-TURTLE.md)
- People in the memo with pages here: [Seymour Papert](../../../seymour-papert/README.md),
  [Marvin Minsky](../../../marvin-minsky/README.md) (the old music box),
  [Cynthia Solomon](../../../cynthia-solomon/README.md),
  [Lars Brinkhoff](../../../lars-brinkhoff/README.md), who got LLOGO running again on an emulated
  PDP-10 with an emulated Knight TV

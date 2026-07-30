# Interactive Graphics in an Integrated CAD System — annotated edition

**Front matter** (thesis pages i–vi · PDF 000–006) ·
[edition index](README.md) · [original scan](../PIXIE-PhD-Thesis-HULEMKE-Interactive-Graphics-in-an-integrated-CAD-system-1972.pdf)

Editorial notes appear in blockquotes marked ✎. Transcription is otherwise faithful,
1972 spellings included.

---

<!-- p.title / pdf.000 -->

INTERACTIVE GRAPHICS

IN AN

INTEGRATED CAD SYSTEM

Heinz Ulrich Lemke

University College

*This dissertation is submitted in partial fulfilment of the requirements for the degree
of Doctor of Philosophy in the University of Cambridge, March, 1972.*

> ✎ [University College, Cambridge](https://en.wikipedia.org/wiki/Wolfson_College,_Cambridge)
> was renamed Wolfson College the year after this was submitted. The work was done at the
> [Mathematical Laboratory](https://en.wikipedia.org/wiki/Department_of_Computer_Science_and_Technology,_University_of_Cambridge)
> (renamed the Computer Laboratory, also within the year) under
> [Maurice Wilkes](https://en.wikipedia.org/wiki/Maurice_Wilkes), on the
> [PDP-7](https://en.wikipedia.org/wiki/PDP-7) + Type 340 + [Titan](https://en.wikipedia.org/wiki/Titan_(1963_computer))
> stack documented in this repo's [turist guide](../../pdp7-reference/GUIDE.md). The program
> this thesis describes was recovered in 2026 as a
> [128-page assembler listing](../../pixie-assembler-listing-1972/README.md).

---

## Preface

<!-- p.i / pdf.001 -->

The activity which is understood to be computer-aided design (CAD) or computer-assisted
design is practised in most companies which have to face complex design processes.
Nevertheless, there appear to be very few design offices whose CAD systems and techniques
show tangible or intangible benefits. Various reasons for the widespread failure of CAD
to satisfy the needs of industry have been given, for example, ineffective
designer-machine communication, ad hoc data base design resulting in frequent
redefinition of data when moving from one design task to another, economic obstacles like
the high cost of computer graphics and application program developments, as well as
sundry technical difficulties in actually using CAD.

In the belief that these problems can be overcome, an experimental integrated
computer-aided design system known as RAINBOW is being developed at Cambridge University,
aimed at exposing some principles of good practice in the construction of large suites of
CAD programs. Some of the results of this work have been implemented in industry; it is
through this that an evaluation of RAINBOW is possible. The thesis discusses three
aspects of this work:

(a) Part 1. The laying down of a philosophical foundations [sic] for the design of a CAD
system. Emphasis will be on man-machine communication in general and computer graphics in
particular.

(b) Part 2. Systems techniques used in implementing these fundamental considerations.

<!-- p.ii / pdf.002 -->

(c) Part 3. The pursuit of a number of applications to evaluate the roles of interactive
graphics.

> ✎ "Ineffective designer-machine communication" as industry's founding failure, 1972 —
> the same diagnosis Don's [QGCon frame](../../../../don-hopkins/sources/qgcon-inclusivity-paper/README.md)
> makes of games and [Bogost's procedural rhetoric](../../../../ian-bogost/CHARACTER.yml)
> makes of software generally: the interface *is* the argument.

### Originality

I have participated in the conceptual design of RAINBOW but my main work has been
concerned with the design of the interactive graphic system PIXIE. For the systems
structure and data representations I should like to claim originality.

I also would like to claim originality for writing a syntax analyser with graphical input
and a control systems analysis program with graphical input and output in form of a PIXIE
like data structure.

### Acknowledgement

It is not possible for me to mention all persons by name who have helped me towards
completing my research work. I therefore should like to single out my supervisor
Dr. N.E.Wiseman who continously [sic] helped me to overcome the many hurdles I have
encountered in this research project. In particular, I owe to him gratitude for freeing
my mind of the many misconceptions and prejudices with respect to the research work
described. In addition, I should like to acknowledge Dr. N.E.Wiseman for writing the DOWN
compiler, the ring structure processor RSP and for his continous [sic] effort in the
conceptual design of PIXIE as well as coauthering [sic] the PIXIE manual, Dr. J.Hiles for
the ring structure processor RSP, M.Etherton for the link routine and C.Cheney for a new
garbage collector.

> ✎ Four credits, four artifacts we now hold or can point at:
> **[Neil Wiseman](../../../pixie-constellation.yml)** (DOWN compiler, RSP, PIXIE co-design);
> **John Hiles** (RSP — the ring engine filling
> [RSPPIX](../../pixie-assembler-listing-1972/README.md));
> **M. Etherton** — *the link routine*, i.e. the
> [blocklet protocol decoded in this repo](../../pdp7-reference/TITAN-LINK-PROTOCOL.md),
> now has an author's name;
> **C. Cheney** — "a new garbage collector" is
> [**Cheney's algorithm**](https://en.wikipedia.org/wiki/Cheney%27s_algorithm), published
> in CACM 1970, running here against live light-pen traffic. The GC that every copying
> collector descends from was PIXIE's roommate.

<!-- p.iii / pdf.003 -->

I also should like to express my thanks to Prof.M.V.Wilkes for making available the
facilities needed to carry out this research and the Plessey Company for their generous
financial support. I very much appreciate the interest shown by the Plessey Company in
using RAINBOW for industrial design purposes.

My wife Jean, I like to thank not only for typing this dissertation but also for her
understanding of my unusual working habits in the course of completing the research work
described.

All drawings of the dissertation have been prepared with the RAINBOW system.

*This dissertation is the result of my own individual work and no part has been carried
out in collaboration with anyone else.* [signed] Heinz U. Lemke

> ✎ Three sentences to sit with: [Plessey](https://en.wikipedia.org/wiki/Plessey) funding
> academic CAD in 1972; Jean Lemke typing all 219 pages (and living with the "unusual
> working habits" — the *nightly* Titan link sessions in
> [the interview question](../../../ideas.md)); and **"all drawings of the dissertation
> have been prepared with the RAINBOW system"** — the thesis illustrated itself. The
> system is its own witness, like a compiler bootstrapping.

---

## Contents

<!-- p.iv–vi / pdf.004–006 -->

| | | page |
|---|---|---|
| **PART 1** | **BASIC CONSIDERATIONS** | |
| 1 | INTRODUCTION — design process; computer-aided design; a design strategy | 1 |
| 2 | INTEGRATED COMPUTER-AIDED DESIGN — design criteria (generality, flexibility, machine independence, schedule); data base design and management (modelling techniques, BCPL, Ring Structure Processor, file structuring) | 7 |
| 3 | MAN-MACHINE INTERACTION — ergonomical considerations (communication language, real-time response, accessibility); computer graphics (interaction with data base, interaction with programs, satellite graphics, main frame driven graphics, storage tubes) | 26 |
| **PART 2** | **IMPLEMENTATION** | |
| 4 | THE RAINBOW SYSTEM — a user's view; systems description; data structures; man-machine communication programs (PIXIE, CONNSTRUCT); data management programs | 41 |
| 5 | THE PIXIE SUBSYSTEM — user's view; systems description (task co-ordination, implementation); data representation (PIXIE data structure, temporary display file TDF, permanent display file PDF); the real-time program (light pen, display processor, keyboard, teleprinter, clock interrupts; drawing mode, pointing mode, keyboard commands); data handling routines (UP compiler, DOWN compiler, sundry routines); other PIXIE implementations | 52 |
| **PART 3** | **APPLICATIONS** | |
| 6 | CAD OF SPECIAL PURPOSE TRANSLATOR SYSTEMS — syntax; the parse tree; syntax directed analysis (analyser algorithm, recogniser, generator) | 121 |
| 7 | CAD OF CONTROL SYSTEMS — syntax analysis of transfer functions; semantic analysis of parse trees; frequency analysis | 133 |
| 8 | COMPUTER-AIDED CIRCUIT DESIGN — problem definition; analysis; non-linear analysis | 144 |
| 9 | APPRAISAL AND FUTURE POSSIBILITIES — generality; flexibility; sundry changes | 156 |
| | REFERENCES | 173 |
| | Appendix 1 — Graph theoretic definitions | 177 |
| | Appendix 2 — Grammatical definitions | 179 |
| | Appendix 3 — RAINBOW User Manual | 181 |
| | Appendix 4 — **PIXIE User Manual** | 187 |

> ✎ In the scan, "PIXIE" (5) and "PIXIE User Manual" (App 4) are highlighted in yellow,
> with "187–208" added by hand — Heinz marking the trail for us in 2026. Chapter 5 is the
> [assembler listing](../../pixie-assembler-listing-1972/README.md) in prose; chapters 7–8
> are the Titan-side applications whose verbs the
> [link protocol](../../pdp7-reference/TITAN-LINK-PROTOCOL.md) deliberately doesn't carry.

---

Next: [Part 1 — chapters 1–2](01-chapters-1-2.md) *(in preparation)*

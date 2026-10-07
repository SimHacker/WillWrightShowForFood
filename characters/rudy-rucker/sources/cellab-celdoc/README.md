# *Cellular Automata Laboratory*: Rudy Rucker and John Walker (cached)

A local mirror of the third, World-Wide Web edition (February 1997) of the CelLab manual,
**© 1989–1997 Rudy Rucker and John Walker**, from
<https://www.rudyrucker.com/oldhomepage/celdoc/>. Its licence: *"This publication and the
accompanying software may be reproduced and redistributed in unmodified form."* The files here
are unmodified: 16 HTML pages and 81 figures, mirrored 2026-10-07. John Walker died in 2024; his
own copy lives on at [fourmilab.ch/cellab](https://www.fourmilab.ch/cellab/).

Start at [`cellab.html`](cellab.html), the table of contents.

## What it is

CelLab was two DOS programs and this manual, first released in 1989 from John Walker's Autodesk
(chapter 5 tells how Rudy met Walker and the Autodesk crowd):

- **RC**, *Rudy's Cellular Automata*: an interactive, low-resolution, text-mode CA you "play like
  a colour organ", written in assembly language (RCC.COM is 12K), with a C control panel by Joseph
  Cusick. Rulestyles RUG, BRAIN/LIFE, RANDOM, VOTE and ASCII, plus a 3D disk (LIFE3D, PARITY,
  LANGTON, SOUNDCA).
- **JC**, *John's Cellular Automata*: a programmable, 320×200, 256-colour CA engine by John
  Walker. A rule is a program (Pascal, C or BASIC) that the JCMake library runs over every
  neighbourhood to generate a lookup table, the `.JC` file. That's the CAM-6's method moved to a
  PC with no special hardware. "Own code" evaluators in 8086 assembly handle what a table can't.

Rudy calls RC the right-brain hands-on program and JC the left-brain analytic one.

## Index

| Page | Words | What's in it |
|---|---:|---|
| [`cellab.html`](cellab.html) | 259 | Title and table of contents |
| [`about.html`](about.html) | 240 | Edition, copyright, licence, production notes |
| [`chap1.html`](chap1.html) | 6,059 | **Getting Started.** What CAs are; RC and JC; demos; *Why cellular automata?*, Rudy's answer and John's; applications in image processing, biology, chemistry, physics and computer science |
| [`chap2.html`](chap2.html) | 11,453 | **The RC Program.** Keyboard controls, control panel, the rulestyles RUG, BRAIN (and LIFE), RANDOM, VOTE, ASCII; the 3D disk: LIFE3D, PARITY, LANGTON, SOUNDCA |
| [`chap3.html`](chap3.html) | 8,341 | **The JC Program.** Cast (rule), scenery (pattern) and lighting (colour palette); menus, pattern editor, command line |
| [`ruledef.html`](ruledef.html) | 1,394 | **Defining JC rules**, overview |
| [`ruledef-pas.html`](ruledef-pas.html) | 4,313 | Rules in Turbo Pascal, with the JCMake `GenRule` interface and world types |
| [`ruledef-c.html`](ruledef-c.html) | 2,713 | Rules in C |
| [`ruledef-bas.html`](ruledef-bas.html) | 3,197 | Rules in BASIC |
| [`ruledef-own.html`](ruledef-own.html) | 2,802 | "Own code" evaluators in 8086 assembly (how Langton was done) |
| [`patterns.html`](patterns.html) | 1,715 | **Pattern design.** Predefined patterns; converting AutoCAD and AutoSketch drawings to patterns; patterns to PostScript |
| [`rules.html`](rules.html) | 13,286 | **The JC Rules**, the catalogue: one entry per rule with its source (below) |
| [`chap4.html`](chap4.html) | 13,486 | **Cellular Automata Theory.** Neighbourhoods; Vote and totalistic rules; Life; Brain; semitotalistic and NLUKY rules; Ranch; Rug and ASCII; lattice gases (Margolus's partitioning trick) |
| [`chap5.html`](chap5.html) | 5,205 | **Origins of CelLab.** Von Neumann to Gosper; Rudy's 1985 visits to Wolfram and Packard at the IAS and to Toffoli and Margolus at MIT; Lynchburg to San José State in 1986; the CAM-6 in styrofoam peanuts, August 1987; Hackers 3.0; meeting John Walker and Autodesk |
| [`footnote.html`](footnote.html) | 5,950 | Footnotes for the whole book |
| [`refs.html`](refs.html) | 598 | Bibliography (below) |
| [`figures/`](figures/) | | 81 images: screenshots of rules, diagrams, navigation icons |

## The JC rules

36 entries in [`rules.html`](rules.html), most with Pascal source. The table at the top of that page
gives, for each rule, the closest rule in Toffoli and Margolus's *Cellular Automata Machines*
(1987) with its page, and `=` where they're identical. That cross-reference is what makes the
catalogue directly portable to CAM-6 and to Don's CAM6 simulator.

| Kind | Rules |
|---|---|
| 1D | Aurora, Axons (reversible rule 22), Parks, ShortPi, SoundCa |
| Life, Brain and their crosses | Life (with echo), Brain, BraiLife, EcoLiBra, Faders, Ranch, Balloons (Silverman's Brain driving membranes) |
| Excitable media, Zhabotinsky spirals | Hodge, Bob, RainZha, Zhabo, ZhaboF, ZhaboFF |
| Reversible | Axons, Fractal (Me-Neither), TimeTun, RevEcoli (with an encryption scheme), Flick |
| Voting | Vote, VoteDNA |
| Lattice gases and growth | PerfumeT (TM-gas), PerfumeX (HPP-gas), XTC, Pond, Sublime (Brownian), Soot, Dendrite, DenTim |
| Averaging, heat | Rug, RugF, RugLap, Heat, HeatWave |
| Other | Border, FredMem (Fredkin parity), Gyre (Gosper), HGlass, Langton, Venus |

Rules identical to *Cellular Automata Machines*: Border (p. 113), Brain (47), Fractal (132),
HGlass (29), Life (23), PerfumeT (160), Sublime (156), TimeTun (52), Zhabo (83).

**EcoLiBra**, Brain in the sea and AntiLife on land, and **Ranch**, Life and Brain partitioned by
Vote, are the parents of **eco**, the rule in every SimCity Don worked on (NeWS, X11, OLPC,
Micropolis): Brain and AntiLife in two domains split by Anneal
([details](../../README.md#symbiotic-programming-on-the-cam-6-1989)). **Ranch** and **BraiLife**
are Rudy's 1987 CAM-6 rules from the [1989 *Complex Systems* paper](../README.md).

## The bibliography

[`refs.html`](refs.html) has 38 entries. The ones that matter most here:

- **[Margolus&Toffoli87]** *Cellular Automata Machines*, MIT Press 1987, cached in
  [Norman Margolus's sources](../../../norman-margolus/sources/README.md).
- **[CalifanoMargolus&Toffoli87]** *CAM-6 User's Guide* (Version 2.1), MIT LCS 1987.
- **[Rucker89]** "Symbiotic Programming", *Complex Systems*, cached in [`../`](../README.md).
- **[Silverman87]** Brian Silverman, *The Phantom Fishtank*, Logo Computer Systems 1987, the source
  of Brain and Balloons ([characters/brian-silverman](../../../brian-silverman/)).
- **[Langton84]**, **[Langton86]**, **[Langton88]**: self-reproduction, artificial life, the first
  A-Life proceedings.
- **[VonNeumann66]** *Theory of Self-Reproducing Automata*; **[Burks70]** *Essays on Cellular
  Automata*.
- **[Wolfram84]**, **[Wolfram86]**: the articles that got Rudy started.
- **[Gardner70]**, **[Gardner71]**: Life in *Scientific American*.
- **[DewdneyColumn88a]**, **[DewdneyColumn88b]**: the Hodgepodge machine and SloGro.
- **[Levy84]** *Hackers*; **[Levy85]** "The Portable Universe".

## Uses here

- **Cabinet CAM-6 cartridges**: each JC rule is a candidate cartridge, starting with the nine that
  are identical to the book's.
- **The MOOLLM CA skill** Rudy is invited to co-design ([`../../ideas.md`](../../ideas.md)): this
  catalogue, with its sources and its book cross-references, is the seed.
- **Snap!**: JC's "rule as a function that generates the table" is exactly the higher-order block
  in the [Snap! show seed](../../../../repo-shows/snap-logo-brian-jens/README.md).

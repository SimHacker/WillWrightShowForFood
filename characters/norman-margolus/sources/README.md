# Sources — Norman Margolus 🔲

## The CAM book — primary source

[`cellular-automata-machines-toffoli-margolus-1987.pdf`](cellular-automata-machines-toffoli-margolus-1987.pdf) —
Tommaso Toffoli & Norman Margolus, ***Cellular Automata Machines: A New Environment for
Modeling***, MIT Press, 1987. 262-page scan (Author metadata: "Norman Margolus", scanned 2017).

The book and the CAM-6 board it documents taught a generation how to actually *do* cellular
automata — Margolus neighborhoods, reversible rules, lattice gases, billiard-ball computation,
and the Forth-programmed rule tables that Don's CAM6 simulator
([SimHacker/CAM6](https://github.com/SimHacker/CAM6)) remains compatible with.

### Provenance and permission

- Downloaded 2026-07-20 from Don's mirror: <https://donhopkins.com/home/cam-book.pdf>
- sha256: `6e668e005ba3c8e03c1cb919a1a72dca277d59a788ac4faa4994b8faefdfc33f`
- **Norman Margolus has personally given Don permission to distribute this PDF**, and to make
  interactive versions of any of its chapters. He said his favorites are the physical
  simulations, "because they have something to say about nature and physics."
  Stated publicly by Don in the [Cagire HN thread](https://news.ycombinator.com/item?id=48976579)
  (July 2026). The book is long out of print; MIT Press sells no copies.

## CAM-8 — the machine after CAM-6

[`cam8.pdf`](cam8.pdf) — Norman Margolus, ***CAM-8: a computer architecture based on cellular
automata***, MIT Laboratory for Computer Science, 15 December 1993 (10 pages; ARPA grant
N0014-89-J-1988).

CAM-8 rearranges the hardware of a low-end workstation into a CA multiprocessor that, in 1993,
matched any existing supercomputer on large CA calculations. Each module streams its site data
from DRAM through an SRAM lookup table and back into DRAM, and many modules form a 3D mesh that
can be extended indefinitely. Each module time-shares its processor over a chunk of space, and
all modules run in lockstep, so computation and communication are both pipelined. Lookup tables
are double-buffered so the host can load the next rule while the current one runs, and data
movement is done by shifting the scan order of each DRAM bit-slice. The CAM-6 idea at scale,
and the direct ancestor of the cabinet's CAM device design.

- **Full summary: [`cam8.md`](cam8.md).**
- Downloaded 2026-10-07 from <https://people.csail.mit.edu/nhm/cam8.pdf>
- sha256: `dacc2e543b2aafb06ebd622b79f9e25802c16bb34eeb8dc60ff540212bd344d9`
- Cached here as a public paper from Norman's own MIT page; ask him before redistributing beyond
  this repo.

### Companion materials

- [CAM6 Demo video](https://www.youtube.com/watch?v=LyLMHxRNuck) — Don demonstrating the
  simulator, the original Forth code, and the book's rules
- Original CAM-6 Forth code Don saved:
  [tomt-cam-forth-scr.txt](https://donhopkins.com/home/code/tomt-cam-forth-scr.txt) ·
  [tomt-users-forth-scr.txt](https://donhopkins.com/home/code/tomt-users-forth-scr.txt)
- Don's compatible CA rule compiler and simulator glue:
  [cam.f.txt](https://donhopkins.com/home/code/cam.f.txt) ·
  [compile.f.txt](https://donhopkins.com/home/code/compile.f.txt)
- C-era simulator: [micropolis CellEngine](https://github.com/SimHacker/micropolis/tree/master/MicropolisCore/src/CellEngine/src) ·
  JavaScript rewrite: [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)
- Related: Rudy Rucker & John Walker's [CelLab](https://www.fourmilab.ch/cellab/) and its
  [rule fieldbook](https://www.fourmilab.ch/cellab/manual/rules.html), which credits the book's
  rules page by page — including EcoLiBra, the Life/Brain/Anneal composite Don used for
  SimCity's DRM
- See [`../the-cam6-demo-for-norman.md`](../the-cam6-demo-for-norman.md)
- Don's CAM6 wiki page, backed up with its 1988 CAM-6 price list and 1991 CAM-PC release:
  [cam6-simulator-wiki](../../don-hopkins/sources/cam6-simulator-wiki/README.md) ·
  [CAM hardware history](../../don-hopkins/sources/cam6-simulator-wiki/cam-hardware-history.md)

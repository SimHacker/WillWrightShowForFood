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

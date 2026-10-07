# CAM hardware, as it reached people: CAM-6, CAM-PC, CAM-8

Harvested from the [wiki transcript](CAM6_Simulator.transcript.md), with the CAM-8 paper.

## CAM-6 (Systems Concepts, 1987–88)

Frank McKenney, comp.theory.cell-automata, 25 Sep 1988, after tracking down Systems Concepts of
San Francisco and getting a price list dated 30 June 1988:

| Item | Price |
|---|---:|
| CAM-6 hardware and technical manual | $1,400 |
| CAM-6 software for one computer, and user's manual | $150 |
| Package: hardware, software, programming and user's manual | $1,500 |
| *Cellular Automata Machines* (the book) | $30 |

An IBM PC, XT or AT board with its own video connector (pass-through when idle), driving an IBM
colour monitor, 1.5 A at 5 V. 256×256 cells, 4 bits each, 60 frames a second synced to video.
Rules written in Forth on the PC are compiled to tables and downloaded to the board. That's the
$1,500 board Rudy Rucker waited months for in 1987.

## CAM-PC (Automatrix, 1990–91)

David Hiebeler, comp.theory.cell-automata, 20 Dec 1991, forwarding Automatrix's 1 Oct 1991 press
release:

- "The first single-board, 24-MIPS cellular automata machine for under $2000": $1,950 with
  software, documentation and the book.
- 256×256 cells, eight 64K-bit lookup tables, scanned and displayed 60 times a second.
- **The first machine with Margolus neighbourhoods directly in hardware**, plus temporal phase and
  spatial parity inputs.
- Up to four boards glued horizontally, vertically or in depth (more bits per cell).
- Beta in December 1990, upgraded in the field through programmable parts. Lead engineer Mukesh
  Chatter; David Cross, VP of application software. Automatrix, Rexford NY.

## CAM-8 (MIT, 1993)

Norman Margolus's paper, [cached in his room](../../../norman-margolus/sources/README.md#cam-8--the-machine-after-cam-6):
site data streamed from DRAM through an SRAM lookup table and back, modules in an indefinitely
extendable 3D mesh, data moved by shifting bit-fields instead of fixed neighbourhoods.

## Then software

Toffoli's own retrospective, quoted on the page: his Automata 2008 abstract, "Lattice-gas vs
cellular automata: the whole story at last", arguing they are opposite trade-offs between machine
complexity and thermodynamic efficiency, not rival camps. Don's own line runs from Sun Forth and C
through PostScript, C++ and Python to CAM6.js ([moollm's CAM6 page](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam6-cellular-automata-machine.md)).

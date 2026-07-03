# Visual programming taxonomy — not all boxes and lines are alike

Don's HN comment when whiteboards devolve into "boxes and lines" ([40842599](https://news.ycombinator.com/item?id=40842599), context: Yahoo Pipes successors).

## Models differ

| Style | Examples | Lines mean… |
|-------|----------|-------------|
| Flowchart boxes + lines | DRAKON, some Pipes clones | Control flow, sometimes data |
| Patch-cord | Hookup, Max/MSP, Isadora, Bounce | Data flow and/or control; live performance |
| Puzzle blocks (no wires) | Snap!, Scratch, Nassi–Shneiderman | Nesting + snap fit |
| Grid adjacency | Spreadsheets, cellular automata | Implicit neighbor relations |

## Control vs data flow

- **Data-flow** boxes can emit many outputs in parallel
- **Control-flow** boxes usually one branch at a time (except fork/Petri-net operators)
- **Max/MSP** mixes simulation-tick control with **signal-rate** audio (thousands of samples per tick on one wire)

## Snap! (Scheme in blocks)

Gray **gaskets** = lambda/delay — functions, macros, continuations, user-defined control structures.
Not "toy blocks" — full Scheme power with visual syntax.

→ [`../../characters/jens-monig/README.md`](../../characters/jens-monig/README.md)

## Trail

Full patch-cord lineage: [`../../process/trails/visual-programming-patch-cord.md`](../../process/trails/visual-programming-patch-cord.md)

Control vs data flow (SimAntics angle): [`drakon-control-flow-vs-dataflow.md`](drakon-control-flow-vs-dataflow.md)

Excel / dimensionality debate (HN 22978454): [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md)

Yahoo Pipes successors (HN 40841980): [`yahoo-pipes-successors.md`](yahoo-pipes-successors.md)

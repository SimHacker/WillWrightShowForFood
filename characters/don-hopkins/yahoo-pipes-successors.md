# Yahoo Pipes successors — pipes.digital and the taxonomy

Don's comments when [pipes.digital](https://pipes.digital) relaunched as a Yahoo Pipes spiritual successor
([HN 40841980](https://news.ycombinator.com/item?id=40841980), Jul 2024).

Extends [`visual-programming-taxonomy.md`](visual-programming-taxonomy.md) (same lineage, sibling thread
[40842599](https://news.ycombinator.com/item?id=40842599)).

## Don's quip

> "Put down the Yahoo Pipe and step away from the keyboard!" ;)

## Not all VPLs are boxes-and-lines

Replying to "every visual programming I've ever seen is boxes and lines":

| Model | Examples | Wires? |
|-------|----------|--------|
| Flowchart + lines | Yahoo Pipes, Node-RED, n8n | Yes — often data or control |
| Puzzle blocks | Snap!, Scratch, Nassi–Shneiderman | No — nesting |
| Grid adjacency | Spreadsheets, cellular automata | Implicit neighbors |
| Patch-cord live | Max/MSP, Bounce, Image/ine | Yes — mixed frequencies |

### Control vs data on the same canvas

- **Data-flow** — parallel outputs; partial dependency order; no single program counter
- **Control-flow** — one branch at a time (except Petri-net forks)
- **Max/MSP** — simulation-tick control *and* audio signal-rate (thousands of samples per wire per tick)
- **Body Electric / Bounce** — data flow + per-node **enable** input (latched outputs when off)

### Blender geometry nodes (2024 thread context)

Don noted left-to-right data flow with functions passed and applied right-to-left — loops in Blender 4.0.

## Pipes as data-flow RSS wrangler

**pipes.digital** (onli): block chain for RSS/feeds — download, filter, extract/insert (xpath), regex replace.
Architectural shift: pass RSS objects block-to-block instead of re-parsing strings every hop.

**Chainability:** pipe A output → pipe B input; POST-per-item manipulators as future block type (thread discussion with onli).

Related successors named in thread: [n8n](https://n8n.io), [Node-RED](https://nodered.org), Retool's [Pipes history](https://retool.com/pipes).

## Trail

- [`../../process/trails/visual-programming-patch-cord.md`](../../process/trails/visual-programming-patch-cord.md) — Hookup → Max → Bounce → Pipes
- [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md) — Excel dimensionality debate
- [`drakon-control-flow-vs-dataflow.md`](drakon-control-flow-vs-dataflow.md) — control vs data flow

## Show hook

Live: same feed through **pipes.digital** (data-flow boxes) vs **Snap!** (blocks without wires) vs **spreadsheet** (grid) — three faces of "visual."

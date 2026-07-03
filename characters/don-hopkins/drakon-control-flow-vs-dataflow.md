# DRAKON — control flow vs data flow (SimAntics, Grasshopper, Bounce)

Don's comment on the DRAKON thread ([HN 10100932](https://news.ycombinator.com/item?id=10100932), Aug 2015)
— extending the taxonomy in [`visual-programming-taxonomy.md`](visual-programming-taxonomy.md).

## DRAKON is control flow

DRAKON (Russian aerospace flowcharts) describes **algorithms and behaviour** — what flows on the wires is
effectively the **program counter**, not values. Sister notation **ERIL** handles entity-relationship
data models.

- Editor: [drakon-editor.sourceforge.net](http://drakon-editor.sourceforge.net/)
- Straight-line-only rule — human-eye-friendly; contrasts with diagonal patch cords in Max/MSP/VVVV

## Two ways to do "if"

| Paradigm | "If" shape | Reads like |
|----------|------------|------------|
| **Data flow** | Node: Condition, A, B → output A or B | `Condition ? A : B` |
| **Control flow** | Branch node: flow goes to A or B | `if Condition goto A else goto B` |

## Three exemplars Don named

| Language | Orientation | Notes |
|----------|-------------|-------|
| **Grasshopper** (Rhino) | Data flow, functional | Arrays/trees on wires; implicit iteration; Don used it for [3D Print Canal House](http://3dprintcanalhouse.com/) |
| **SimAntics** (The Sims) | Control flow, imperative | Visual assembly; implicit VM state travels with program counter — [SimAntics wiki](http://simswiki.info/wiki.php?title=SimAntics) · [pie menu demo movie](http://donhopkins.com/home/movies/TheSimsPieMenus.mov) |
| **Body Electric / Bounce** | Real-time data flow for VR | Partial-order execution; optional **enable** I/O per node for side-effect ordering (drawing) — [`levity-bounce-space-seed.md`](levity-bounce-space-seed.md) |

## Don's caution

Do not project one VPL's ergonomics onto all others — they differ as much as text languages.
Success depends on UI design, primitive vocabulary, and libraries as much as paradigm.

## Trail links

- [`../../process/trails/visual-programming-patch-cord.md`](../../process/trails/visual-programming-patch-cord.md) — patch-cord lineage
- [`visual-programming-taxonomy.md`](visual-programming-taxonomy.md) — boxes/lines taxonomy (HN 40842599)
- [`../chris-trottier/`](../chris-trottier/) · [`the-sims-transmogrifier-mod-tools.md`](the-sims-transmogrifier-mod-tools.md) — Sims tooling

## Show hook

Live: same algorithm as DRAKON control-flow chart vs Grasshopper data-flow graph vs SimAntics bytecode —
three faces of one idea.

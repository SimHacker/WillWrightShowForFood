# Bounce dataflow — switch, enable, while (not CPS)

## Why this exists

On the Snap! forum (**Sep 2020**), **spdegabrielle** praised Snap!, waved off macros as probably a
bridge too far, and said **dataflow** (Pure Data fan) felt more natural than scope or macros.
**Brian Harvey** replied: he's thought about dataflow too, but gets hung up on **conditional
evaluation** unless you use explicit **continuation-passing style** — though it does fit the visual
metaphor.

Don's answer from lived work: **Bounce** (David Levitt's patch-cord language, derivative of VPL
**Body Electric**) already solved that without CPS.

## Execution model

- **Partial order** from wires — each icon runs once per frame in dependency order. You think in
  dataflow, not program-counter navigation (unlike Max).
- **Against-the-flow wires** — output fed back to an upstream input uses **last frame's** value
  (one-frame delay). Enough to build counters and mouse-velocity without a latch.
- **Feedback loop** — constant `1` into one input of `+`, output back to the other → per-frame counter.

## Two ways to do "if"

| Mechanism | What it is | Reads like |
|-----------|------------|------------|
| **Switch** icon | Pure dataflow relay | `condition ? A : B` |
| **Enable** line | Power gate on every module | Turn subgraphs on/off; sequence side effects |

### Enable line (the subtle one)

Every Bounce module has an implicit **enable** input and output (same value through).

- **Control flow:** disable whole nested modules or individual icons.
- **Sequencing:** when partial order isn't enough for side effects (drawing, globals), chain enable
  wires — the wire creates an ordering dependency even when the boolean is just "pass through true."
- **Implicit latch:** when off, last computed output **holds**. **David Levitt** discourages relying on
  that — use an explicit **latch** icon instead.

## Looping

| Mechanism | Behavior |
|-----------|----------|
| **While encapsulation** | Folder module with matching inputs/outputs + binary condition. While true, interior runs; outputs feed back to inputs — telescoping loop. |
| **Frame-delay feedback** | Against-the-flow wire as a simpler loop/counter pattern |

**Caveat (Don's house-fly demo):** stateful modules like **`smooth`** remember one previous value. Inside
a while over many flies, they shared state and all swarmed together. Fix was manual per-object state in
dict keys — reusable modules need execution-context / closure-like state (open design question in the
MediaFlow essay).

## Contrast table (Don's HN taxonomy)

| Language | Style | "If" |
|----------|-------|------|
| **Grasshopper** | Functional dataflow | Condition node → A or B |
| **Bounce** | Real-time dataflow + enable | Switch + enable + while |
| **Max** | Explicit control flow | Drawn loops/branches on the page |
| **SimAntics** | Visual VM control flow | Program counter follows branches |

Full taxonomy: [`drakon-control-flow-vs-dataflow.md`](../drakon-control-flow-vs-dataflow.md) (HN
[10100932](https://news.ycombinator.com/item?id=10100932)).

## Primary sources in this repo

| Doc | What |
|-----|------|
| [`mediaflow-design-comments.md`](../mediaflow-design-comments.md) | Don's full § "Bounce control flow vs Max" |
| [`body-electric-bounce-vr-stack.md`](../body-electric-bounce-vr-stack.md) | VR stack, COM-on-wires, live coding |
| [`levity-bounce-space-seed.md`](../levity-bounce-space-seed.md) | Levity Mac product, rights chain |
| [`../../david-levitt/don-and-david-history.md`](../../david-levitt/don-and-david-history.md) | Don + David collaboration narrative |
| [`../../../repo-shows/rebounce/README.md`](../../../repo-shows/rebounce/README.md) | Rewrite Bounce together on air |

External: [Bounce Stuff (Medium)](https://medium.com/@donhopkins/bounce-stuff-8310551a96e3) ·
[bounce-notes.txt](https://www.donhopkins.com/home/archive/visual-programming/bounce-notes.txt) ·
[c2: BounceLanguage](https://wiki.c2.com/?BounceLanguage)

## Snap! forum cross-ref

Harvest target for [`snap-macros-metaprogramming.yml`](../../brian-harvey/sources/snap-macros-metaprogramming.yml):
spdegabrielle Sep 2020 + Brian's CPS reply. **Rebounce** show seed: implement these three control
ideas in TypeScript and pair with Snap! blocks (patch-cord half + blocks half).

↑ [Don sources](README.md) · [Brian metaprogramming digest](../../brian-harvey/sources/snap-macros-metaprogramming.md)

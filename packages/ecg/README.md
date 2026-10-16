# @wwsff/ecg — Embedded Constraint Graphics, as courseware 🔺

A free reimplementation of **Tom Ngo's Embedded Constraint Graphics** (Interval Research,
1996), written to be **read, played with, and learned from**, not just imported.

Draw a few example pictures. Put them at the corners of a triangle (or a tetrahedron, or a
bigger simplex), glue the triangles together, then **grab any part of the drawing and drag
it**. The system works out how much of each example to blend so the part you're holding
follows your mouse. You manipulate the result; the math recovers the weights.

Patent [US5933150](https://patents.google.com/patent/US5933150) (J. Thomas Ngo and Bruce
Randall Donald, Interval Research) was filed 6 August 1996 and expired on 6 August 2016. The
technique is free.

> *Gluing high-dimensional simplices at their edges and faces is an extremely general way to
> represent blending manifolds — in the same way that gluing polygons together has done us so
> much good in 3D modeling.* — Tom Ngo, to Don, after the patent expired

**Status: design only. No solver code yet.** `src/index.ts` is a stub so the workspace builds.

---

## Courseware, not just a library

The goal is that you (and Don, who says he's "not a big math head") can learn the math by
**playing with it live**, then by **reading and changing the code**, then by **applying it to
something else**. Every piece is built for that:

| Piece | What it teaches |
|-------|-----------------|
| **Lessons** ([COURSE.md](COURSE.md)) | A ladder from "blend two pictures with a slider" to "drag a face through a complex of glued simplices." Each rung has a live demo, a source file, and exercises. |
| **Source** (`src/`, planned in [DESIGN.md](DESIGN.md#source-layout)) | One file per idea, read top to bottom. Every file opens with the lesson it implements: the picture, the idea in words, then in symbols, then the code. No hidden linear algebra library. |
| **Playground** (planned) | Every internal on screen: the simplex with the current state as a dot, the weights as bars, the Jacobian and its pseudo-inverse as live numbers, the drawing with its handles. Turn any knob and watch everything else move. |
| **Tests** | Worked examples with numbers small enough to check by hand. |
| **Applications** | The same engine driving breakfasts, glyphs, wigs, faces, pie menus — so you see what's general and what's specific. |

## Map of the docs

| Doc | Read it for |
|-----|-------------|
| [COURSE.md](COURSE.md) | The lesson ladder — what you'll learn, in what order, and what to play with |
| [DESIGN.md](DESIGN.md) | How the engine works and how the code will be laid out; the solver, zone walking, feel knobs, rendering targets, open questions |
| [PATENT-NOTES.md](PATENT-NOTES.md) | Close reading of US5933150: what Tom specified, in his words, and what he left open |
| [REFERENCES.md](REFERENCES.md) | Papers and prior/related work, every citation checked |
| [GLANCE.yml](GLANCE.yml) | One-screen summary |

## Related docs in this repo and its siblings

| Where | What |
|-------|------|
| [ECG at Interval](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md) | Don's essay: the mechanism, Mouther, the 2016 HN comment, the 2013 Syntertainment pitch, WigFabrik and Faceball plans |
| [Breakfast simplex](../../characters/don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md) | ECG applied to egg/milk/flour space and pie menus — the friendliest first example |
| [Tom Ngo](../../characters/tom-ngo/README.md) · [ideas](../../characters/tom-ngo/ideas.md) | Character room and brainstorm topics |
| [Golan Levin](../../characters/golan-levin/README.md) | Mouther, built in Tom's ECG editor |
| [Repo Show seed — Tom + Golan](../../repo-shows/tom-and-golan-ecg-mouther/README.md) | ECG and Mouther brainstorm (consent not yet asked) |
| [Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml) | `ecg_blend` — drag faces and parts, solve the blend |
| [Direct manipulation trail](../../process/trails/direct-manipulation.md) | The lineage this belongs to |
| [Interval Research](../../characters/don-hopkins/interval-research-pluggers-and-mediaflow.md) | Era context |
| [WigFabrik — portal §6](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio) (MicropolisCore) | The shippable showcase: mesh and texture targets, AI-authored targets, drag to solve |
| [GLYPH-BENCHMARK.md](https://github.com/SimHacker/moollm/blob/main/designs/webtop/GLYPH-BENCHMARK.md) (MOOLLM) | ECG as a glyph vocabulary: the model places documents in a designed simplex instead of drawing |

## Run

Nothing to run yet.

```
pnpm --filter @wwsff/ecg build
```

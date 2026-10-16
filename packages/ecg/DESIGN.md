# ECG — design 🔺

How the engine works, how the code will be laid out, and what's still open. Written before any
code, so we can argue about it first.

Two audiences, one design: **people learning the math** (see [COURSE.md](COURSE.md)) and
**people building things** (WigFabrik, Faceball, glyphs). When those pull in different
directions, readability wins and speed gets an optional fast path next to the readable one.

Tom's own terms are used throughout, so the code can be read against the patent. See
[PATENT-NOTES.md](PATENT-NOTES.md) for where each comes from.

---

## The model in one picture

```
   state space                 configuration space                 pixels
 (where you are)             (what the drawing is)              (what you see)

   B                          handle positions,
  / \        drive  ───▶       colours, any numbers   ── render ──▶   🙂
 / • \       ◀─── tug
A─────C        (solve)
 \   /
  \ /
   D
 zones ABC, ACD
 glued along AC
```

- **Examples** sit at the vertices. Each example is a full configuration: a list of numbers.
- **Zones** are simplices of examples that are allowed to blend. An author declares them.
- **State** is a zone plus barycentric weights in it (all ≥ 0, sum to 1).
- **Driving** turns a state into a configuration: a weighted sum of the zone's examples.
- **Tugging** turns "I want this handle over there" into a new state.
- **Rendering** turns a configuration into pixels. The engine doesn't care how; SVG, Canvas
  and WebGPU are separate skins.

## Driving

For a zone with examples `x₀ … xₖ` (each a column of `m` numbers) and weights `λ₀ … λₖ`:

```
configuration = λ₀·x₀ + λ₁·x₁ + … + λₖ·xₖ        with  Σλ = 1,  λ ≥ 0
```

Written as a matrix, `X · λ`, where `X` is `m × (k+1)` with one column per example. That's it.
Driving is cheap and always well defined.

## Tugging inside one zone

The user grabs some handles (a subset of the configuration numbers) and moves the cursor.
Let `H` be the rows of `X` for the grabbed handles. A change in weights `Δλ` moves the handles
by `H · Δλ`. So the Jacobian is just `H`, and **it is constant inside a zone**. This is why ECG
is easier than general inverse kinematics, where the Jacobian changes every frame.

The weights must keep summing to 1, so any change must sum to 0. We handle that by working in
**edge coordinates**: pick one example as the base, `x₀`, and describe the state by how far
it has moved toward each of the others.

```
configuration = x₀ + μ₁·(x₁ − x₀) + … + μₖ·(xₖ − x₀)
λ₀ = 1 − Σμ,   λᵢ = μᵢ
```

Now the `μ` are free, the Jacobian is `J = [hᵢ − h₀]` (handle columns minus the base), and the
sum constraint takes care of itself. The course teaches it this way because it's also the
clearest picture: the edges of the simplex become the axes.

Solving for the change:

```
Δμ = J⁺ · Δx                       pseudo-inverse: least change that best meets the drag
Δμ = Jᵀ (J Jᵀ + d²I)⁻¹ · Δx        damped: stays calm when J is nearly singular
```

The three shapes of `J`, and what each means for the user:

| Shape | When | Behaviour |
|-------|------|-----------|
| Square, full rank | One 2D handle in a triangle | Exactly one answer; the handle tracks the cursor exactly |
| Wide (more weights than handle numbers) | One handle in a tetrahedron | Many answers; pseudo-inverse picks the smallest weight change. The leftover freedom (**null space**) is where secondary goals go |
| Tall (more handle numbers than weights) | Several handles in a triangle | No exact answer; least squares gets as close as possible |

**The one-handle-one-triangle case is barycentric coordinates in reverse.** The handle's three
positions form a triangle in the drawing; the new weights are the cursor's barycentric
coordinates in that triangle. Lesson 3 starts there before generalising.

### Absolute, not incremental

Because driving is linear inside a zone, we don't have to step the state by little `Δλ`s and
accumulate error. Each frame we can solve for the state that puts the handles at the cursor
**directly**, starting from the state at mouse-down. Incremental stepping is kept as a
teaching mode, because watching it drift is how you understand why the direct solve exists.

## Hitting a boundary

If the solve wants a weight below zero, the state is trying to leave the zone. Tom's rules
(see [PATENT-NOTES.md](PATENT-NOTES.md#boundaries)):

1. Move along the path until the first weight reaches zero.
2. If **no zone** lies across that face, drop that vertex and keep solving in the smaller
   simplex with the rest of the drag. The state slides along the edge.
3. If down to **one vertex**, stop.
4. If **one zone** lies across, enter it at the equivalent state (Tom's **via point**: same
   proportions for shared examples, zero for the new one) and continue.
5. If **several zones** lie across, pick one. Tom's candidates: least state movement for this
   drag, or least movement of the handles not being dragged. We'll make the chooser
   pluggable and show the scores in the playground.

Our improvement over stepping-and-clamping: treat "all weights ≥ 0" as real constraints and
solve with a small **active-set** loop, so a single frame can slide along an edge and into a
corner without overshoot. The simplices are tiny, so this is cheap.

## Gluing zones: the complex

- Zones are lists of example ids. Faces are derived, not declared.
- A face index maps each face (sorted id list) to the zones that contain it.
- Tom's authoring rules become validator warnings: every example in at least one zone;
  the complex connected.
- Zones of different dimensions can be glued (a triangle hanging off an edge, an edge
  hanging off a vertex). The walker handles any dimension.

## Many handles, pins and priorities

- Each grabbed handle contributes rows to `J` and to the target.
- A **pinned** handle contributes rows with target "stay where you are."
- Per-handle **importance** scales its rows (weighted least squares).
- Strict priority (pins always beat drags) is a later option, done by solving the drag inside
  the pins' null space. Weighted is simpler and teaches better, so it comes first.
- Multitouch is just many handles at once.

## Automatic transformations

Tom's patent lets each edge carry a transformation, so reused poses register correctly (a
walk cycle that actually travels). We'll implement it in two steps:

1. **Translations only.** They add a constant per edge, so everything stays linear.
2. **General transforms** using Tom's **linearized configuration map**: when the state enters
   a zone, transform each example once, then blend those. The map is flat, so tugging stays a
   linear solve, and it's computed once per zone entry rather than every frame. The exact
   path-integral version is kept as a reference implementation to compare against.

## Feel

This is the part the patent doesn't write down and the part Don is best at. Every knob is
exposed live in the playground, defaults are chosen by playing, and each knob's code is a few
lines with a comment saying what it trades away.

| Knob | What it does | Costs |
|------|--------------|-------|
| Damping `d` | Calms jitter near degenerate examples | Handle lags the cursor |
| Snap radius | Pulls the state onto an example when close | Hard to land just off an example |
| Release spring | State eases back toward an example or rest pose on mouse-up | Can feel floaty |
| Inertia | State keeps moving after a flick | Overshoot |
| Overshoot allowance | Lets weights go slightly negative for squash and stretch, springs back | Can look broken if too large |
| Sticky boundaries | A little resistance before crossing into a neighbour zone | Feels notchy if overdone |
| Zone chooser | Which neighbour to enter at a shared face | Surprise when it picks "wrong" |

## Blending things that aren't points

| Thing | Approach | Status |
|-------|----------|--------|
| Points, scalars | Weighted sum | Lesson 0 |
| Colours | Blend in a perceptual space (e.g. OKLab), not raw RGB | Early |
| Angles, rotations | Blend as transforms (Lesson 8), or as unit vectors and renormalise | Lesson 8 |
| SVG paths | Require matching structure in examples; validator explains mismatches; resampling helper later | Early |
| Meshes (WigFabrik, Faceball) | Same vertex count and order per example; GPU blend | Later |
| Textures | Blend per pixel with the same weights; GPU | Later |

## Model files

Models are plain YAML so people can write them by hand, diff them in git, and have an LLM
draft them. Sketch:

```yaml
model: smiley
examples:
  neutral:  { mouth_left: [-20, 10], mouth_right: [20, 10], brow: [0, -30] }
  smile:    { mouth_left: [-24, 4],  mouth_right: [24, 4],  brow: [0, -32] }
  surprise: { mouth_left: [-10, 18], mouth_right: [10, 18], brow: [0, -42] }
  frown:    { mouth_left: [-18, 16], mouth_right: [18, 16], brow: [0, -26] }
zones:
  - [neutral, smile, surprise]
  - [neutral, surprise, frown]
handles: [mouth_left, mouth_right, brow]
feel: { damping: 0.05, snap_radius: 0.03 }
```

The schema is an open question until the first two applications exist.

## Source layout

Planned. One file per lesson, so the code and the course line up.

```
packages/ecg/
  src/
    00-lerp.ts               mix two configurations
    01-barycentric.ts        point in simplex ↔ weights
    02-drive.ts              state → configuration
    03-tiny-linear-algebra.ts   multiply, transpose, solve, pseudo-inverse, damped
    04-tug-one-zone.ts       drag → weights inside one zone
    05-walls.ts              active set: slide along faces, stop at corners
    06-complex.ts            zones, faces, adjacency, via points, zone chooser
    07-many-handles.ts       stacking, pins, importance
    08-transforms.ts         automatic transformations, linearized map
    09-feel.ts               damping, snap, springs, inertia, overshoot
    10-paste.ts              motion / skeleton / skin
    model.ts                 YAML model loading and validation
    index.ts                 public API
    *.test.ts                worked examples, checkable by hand
  playground/                live lessons (SVG first)
  models/                    example models: smiley, breakfast, walk cycle
```

### Code style for courseware

- Each file opens with a comment block: the lesson number, the picture (ASCII), the idea in
  plain words, then the same idea in symbols.
- Names match the patent and the course: `zone`, `state`, `configuration`, `drive`, `tug`,
  `viaPoint`. One glossary, used everywhere.
- No linear algebra dependency. The matrices are a few rows by a few columns; writing the
  operations out is the lesson. A fast path can come later behind the same interface.
- Pure functions on plain arrays. Every intermediate value can be logged or shown.
- Tests are worked examples with small round numbers, so a reader can check them by hand.
- No dependencies at runtime except `yaml` for model files.

## Rendering targets

| Target | Role | Order |
|--------|------|-------|
| **SVG** | Teaching. Inspectable in devtools, every handle a DOM node | First |
| **Canvas 2D** | Faster immediate-mode demos, many characters | Second |
| **WebGPU** | Meshes and textures: WigFabrik, Faceball stage | Later |

The solver never imports a renderer.

## Open questions

- Model schema: how much structure do SVG paths need to declare?
- The smallest change in edge coordinates `μ` isn't quite the smallest change in weights `λ`
  (the base weight `λ₀` moves too). Does the difference show up in feel? Solving in `λ` with
  the sum constraint as an extra row is the alternative; try both.
- Zone chooser default: least state movement, or least movement of unheld handles?
- Strict priority for pins, or weighted only?
- Should the playground live in this package or in an app under `apps/`?
- How close can we get to the feel of Tom's editor without seeing it? (Ask Tom and Golan.)
- Can the Mouther cartoons be recovered as test models? (Ask Golan.)

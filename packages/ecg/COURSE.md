# ECG — the course 🔺

A ladder of lessons from "blend two pictures with a slider" to "drag a face through a complex
of glued simplices." You don't need to be a math head. Each rung adds **one idea**, and each
idea gets four things:

- **Play** — a live demo where you can feel the idea before you read about it.
- **Read** — the source file that implements it, written to be read top to bottom.
- **Try** — small changes to make, things to break, questions to answer.
- **Words** — the official math names, so you can look things up elsewhere.

The rule for the whole course: **every number the solver uses is on screen.** If the code
computes it, the playground shows it, and you can poke it.

Status: **planned.** The file names below are the [source layout](DESIGN.md#source-layout)
we'll build to. Nothing is coded yet.

---

## Lesson 0 — Blend two pictures

**Play.** Two drawings of a face: neutral and smiling. A slider from 0 to 1. Slide it and the
face morphs. Every point on the drawing moves in a straight line from where it is in one
picture to where it is in the other.

**Read.** `src/00-lerp.ts`. One function: `mix(a, b, t) = a + t·(b − a)`, applied to every
number in the drawing.

**Try.**
- Push the slider past 1, or below 0. What happens to the smile? (This is *extrapolation* —
  remember it for squash and stretch in Lesson 9.)
- Blend two drawings whose points are numbered differently. Why does it turn to spaghetti?

**Words.** Linear interpolation (*lerp*). The two weights are `1 − t` and `t`; they add up to 1.
A line segment between two examples is a **1-simplex**.

## Lesson 1 — Three pictures and a triangle

**Play.** Three faces at the corners of a triangle: neutral, smile, surprise. Drag a dot around
inside the triangle. The face is a mix of all three, with more of whichever corner you're
nearest. Bars show the three weights.

**Read.** `src/01-barycentric.ts`. Given a dot inside a triangle, find the three weights.
It's a 2×2 equation solve, written out longhand.

**Try.**
- Put the dot exactly on an edge. Which weight is zero?
- Drag the dot outside the triangle. One weight goes negative. What does the face do?
- Why must the weights add up to 1? Try a version where they don't, and watch the face grow
  and shrink.

**Words.** **Barycentric coordinates.** A triangle is a **2-simplex**, a tetrahedron is a
3-simplex. Tom's patent calls a simplex of compatible examples a **zone**. The set of all
blends is the **state space**; a single blend is a **state**.

## Lesson 2 — Driving: weights in, drawing out

**Play.** Same triangle, but now the screen shows the drawing's handle positions as a column
of numbers, and the examples as a table of columns. Move the state dot and watch the numbers
change.

**Read.** `src/02-drive.ts`. The drawing is the examples' numbers multiplied by the weights and
added up. That's one matrix times one vector.

**Try.**
- Add a fourth example. The triangle becomes a tetrahedron. How do you show a 3D state on a
  2D screen? (The playground shows a few options; pick the one you find clearest.)
- Make the handle's position identical in all three examples. Can moving the state ever move
  that handle?

**Words.** Tom calls this **driving**: state → **configuration**. The configuration is all the
numbers that describe the drawing (handle positions, colours, anything). Because it's a
weighted sum, the map is **linear**.

## Lesson 3 — Tugging: drag the drawing, solve the weights

This is the heart of ECG.

**Play.** Grab the corner of the mouth and drag it. The face follows: the weights change by
themselves so the mouth corner stays under your cursor.

**Read.** `src/04-tug-one-zone.ts`.

Here's the key insight, and it's worth stopping on. For **one handle in one triangle**, the
handle has a position in each of the three examples. Those three positions form *another*
triangle, out in the drawing. Dragging the handle to a spot means: **find the barycentric
coordinates of the cursor in that triangle.** That's Lesson 1 again, run backwards. Those
coordinates are the weights.

**Try.**
- Show the handle's triangle on screen as a ghost. Drag outside it. What should happen? (That
  question is Lesson 5.)
- Use a tetrahedron (four examples) and one handle. Now there are infinitely many weight
  choices that put the handle in the same spot. Drag the handle and watch the *rest* of the
  face — which choice did the solver make? Why?
- Use an edge (two examples) and one handle. The handle can only move along a line. What does
  the solver do when you drag off the line?

**Words.** Tom calls this **tugging**: configuration → state, the inverse of driving. The
matrix relating weight changes to handle movement is the **Jacobian** (J). Three cases:
**square** (exactly one answer), **wide / underdetermined** (many answers; the solver picks the
smallest change), **tall / overdetermined** (no exact answer; the solver gets as close as it
can). One tool handles all three: the **pseudo-inverse** (J⁺).

## Lesson 4 — The pseudo-inverse, by hand

**Play.** A panel showing J, J⁺, and their product live as you drag. A "damping" slider.

**Read.** `src/03-tiny-linear-algebra.ts`. Matrix multiply, transpose, a small linear solve,
pseudo-inverse, damped pseudo-inverse. No library; about the size of this page. Every
function says what it's for in plain words before the code.

**Try.**
- Make two examples put the handle in the same spot. The handle's triangle collapses to a
  line. Turn damping to zero and drag. Feel the jitter? Turn damping up. What did you trade
  away?
- Prove to yourself that for a square J, J⁺ is just the ordinary inverse.
- In the tetrahedron case, find a weight change that doesn't move the handle at all. What
  does the face do?

**Words.** **Moore–Penrose pseudo-inverse.** **Normal equations.** **Minimum-norm** solution.
**Null space** — the weight changes that don't move the handle; the free choices the solver can
spend on other goals. **Singular** and **near-singular** Jacobians. **Damped least squares**.

## Lesson 5 — Hitting walls

**Play.** Drag the mouth until one weight hits zero. Instead of the face breaking, the state
slides along the edge of the triangle. Keep going and it stops at a corner.

**Read.** `src/05-walls.ts`. Walk from the current state toward the solution. If a weight would
go negative, stop where it hits zero, drop that example, and solve again in the smaller
simplex with what's left of the drag.

**Try.**
- Change the rule: let weights go a little negative before stopping. When does that look
  better? When does it look broken?
- What should happen if two weights hit zero at the same moment?

**Words.** Simplex **faces** and **boundaries**. This is Tom's rule: a boundary with no zone on
the other side means "continue with one vertex removed"; down to one vertex means "stop."
(Optimisation people would call it an **active-set** method.)

## Lesson 6 — Gluing triangles together

**Play.** Two triangles sharing an edge: ABC and ABD. Drag the face toward D's expression. The
state crosses from one triangle into the other without a bump.

**Read.** `src/06-complex.ts`. Which zones share which faces, and how to hand the state from
one zone to its neighbour.

**Try.**
- Glue three triangles to the same edge. When the state reaches that edge, which one should
  it enter? Try Tom's suggestions: the zone where the state moves least, or where the handles
  you *aren't* dragging move least. Which feels better?
- Build a walk cycle: four poses joined in a loop of edges. Can you drag the foot and walk
  the figure?

**Words.** **Simplicial complex.** **Adjacent** zones. A **connected** complex. Tom's **via
points**: equivalent states in two zones, with the same proportions of the shared examples
and zero for the rest.

## Lesson 7 — More than one handle

**Play.** Pin the eyes and drag the mouth. Then grab two handles with two fingers.

**Read.** `src/07-many-handles.ts`. Stack each handle's rows into one bigger Jacobian. Pinned
handles get a target of "don't move." Weights say which handles matter more.

**Try.**
- Pin so many handles that the face can't move. What does the solver do?
- Give the mouth weight 10 and the eyes weight 1. Then swap.

**Words.** **Weighted least squares.** **Task priority.** **Over-constrained** systems.

## Lesson 8 — Beyond sliding points: transformations

**Play.** A figure walks across the screen. Each step reuses the same four poses, but the
figure keeps moving forward instead of snapping back.

**Read.** `src/08-transforms.ts`. Each edge carries an **automatic transformation** (e.g.
"shift one pace right"). Going along an edge one way applies it; going back undoes it. Then
Tom's trick for making rotations and other non-linear transforms draggable: the
**linearized configuration map**.

**Try.**
- Add a rotation to an edge. Drag a handle and watch how far it drifts from your cursor.
  Compare the linearized map with re-solving every frame.
- Why does Tom say the flat map gives the designer "a good degree of control over the 'feel'
  of the handle"?

**Words.** **Registration.** **Anti-symmetric** edge transforms. A transformation **vector
field** and its **path integral**. **Linearization.**

## Lesson 9 — Feel

This is the craft lesson, and the one the patent doesn't write down.

**Play.** A panel of feel knobs, live: damping, snap-to-example radius, springiness on
release, inertia, how far weights may overshoot, sticky boundaries.

**Read.** `src/09-feel.ts`. Each knob is a few lines, and each one says what it costs.

**Try.**
- Tune it until the face feels like rubber. Then like clay. Then like a marionette. Save your
  three settings and compare the numbers.
- Allow a little overshoot past the examples and add a spring back. That's squash and stretch.

**Words.** None official. This is the part you learn with your hands.

## Lesson 10 — Motion, skeleton, skin

**Play.** Record a dance on one character. Paste it onto a different character drawn by someone
else.

**Read.** `src/10-paste.ts`. Tom splits an animation into three swappable parts: the **clip
motion** (a path through state space), the **graphic skeleton** (state → configuration), and
the **graphic skin** (configuration → pixels).

**Try.**
- Paste a motion onto a character whose state space has an extra example the motion never
  uses. Does it still work? (Tom says yes.)

**Words.** Tom's terms: clip motion, clip character, clip art. **Isomorphic** configuration
spaces.

## Lesson 11 — Same engine, other worlds

The point of a general engine is that it isn't about faces. Each of these is a small example
model, with its own lesson page:

| World | Examples at the corners | What you drag |
|-------|------------------------|---------------|
| **Breakfast** ([essay](../../characters/don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md)) | Egg, milk, flour | The recipe dot; find the Dark Breakfast Abyss |
| **Colour** | Paint swatches | A colour toward the one you want |
| **Glyphs** ([MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/webtop/GLYPH-BENCHMARK.md)) | Designed icon extremes | An icon feature; the model places documents in the same space |
| **Wigs** ([WigFabrik](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio)) | Hair shapes and textures, some AI-authored | The silhouette; the texture blend follows |
| **Faces** ([Faceball](../../apps/performance-space/faceball-construction-set.yml)) | Blend-shape targets | The mouth and eyes; out come ARKit-style coefficients |
| **Pie menus** ([CHI '88](../../characters/don-hopkins/pie-menus-chi-88-and-beyond.md)) | Menu items around a circle | Direction picks the blend |

**Try.** Bring your own world. The model format (see [DESIGN.md](DESIGN.md#model-files)) is a
plain YAML file you can write by hand, or ask an LLM to draft.

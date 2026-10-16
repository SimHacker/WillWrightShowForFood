# Reading US5933150 🔺

Notes on **[US5933150](https://patents.google.com/patent/US5933150)**, *System for image
manipulation and animation using embedded constraint graphics*. Inventors **J. Thomas Ngo and
Bruce Randall Donald**; original assignee Interval Research Corp. Filed 6 August 1996, granted
3 August 1999, expired at end of term on 6 August 2016 (Google Patents: "Expired - Lifetime").

The point of these notes: separate what Tom **specified** (we can implement it from the text)
from what he **left open** (we have to design it, or ask him). Quotes are from the patent text
on Google Patents.

---

## Vocabulary

| Patent term | Meaning | Our code |
|-------------|---------|----------|
| Example | One drawing at a vertex | `example` |
| Zone | A simplex of examples that may blend | `zone` |
| State space | All zones glued together | `complex` |
| State | Barycentric weights in a zone | `state` |
| Configuration | The numbers that describe a drawing (control points, colours, …) | `configuration` |
| Driving | State → configuration | `drive()` |
| Tugging | Configuration → state; "essentially the inverse of the driving operation" | `tug()` |
| Automatic transformation | A transform attached to edges, for registration | `transform` |
| Via points | Equivalent states in two adjacent zones | `viaPoint()` |
| Clip motion / graphic skeleton / graphic skin | Motion, state→configuration, configuration→image | `paste` (Lesson 10) |

## Zones and the state space

Specified:

- Zones can be any dimension: "a line whose end points are defined by two examples, as well
  as multi-dimensional zones such as a tetrahedron defined by four examples."
- Zones are adjacent when they share at least one vertex, and the state space is connected if
  you can walk between any two zones through adjacent ones.
- Authoring constraint: "Every vertex should appear in at least one zone. Otherwise, some of
  the example images will never be used." → a validator warning.
- The author decides which examples may blend. Tom's walk-cycle example keeps two poses out of
  the same zone because blending them "would result in a figure in which each leg was at
  least partially raised, and hence the figure would appear to be floating off the ground."
- Weights are barycentric: "The percentages sum up to unity." Interpolation is linear in the
  simple embodiment, though "the interpolation could employ non-linear functions, such as
  cubic polynomials."

## Tugging inside a zone

Specified, almost as a recipe:

> Since the relationship between the interpolation weights and the handle locations is linear,
> it can be expressed by the matrix equation ΔX=JΔλ … The pseudo-inverse technique computes a
> matrix J⁻¹ such that, for a given desired change ΔX in the handle locations, a change to the
> interpolation weights is made that will approximately produce such a change, i.e.
> Δλ=J⁻¹ΔX. The computation of the pseudo-inverse matrix J⁻¹ can be carried out in any of a
> number of well known manners.

Left open: which pseudo-inverse method, damping, and how to keep the weights summing to 1.
See [DESIGN.md → Tugging inside one zone](DESIGN.md#tugging-inside-one-zone).

## The linearized configuration map

The key design insight. With automatic transformations other than translation, the map from
state to handle positions becomes non-linear. Tom describes the naive fix and why he rejected
it:

> a small increment of movement along a tangent to the surface is taken for each unit of
> movement of the input device. For each such increment of movement, a new Jacobian matrix is
> computed. While this approach causes the state to closely track the handle movement, it can
> be appreciated that it is computationally expensive. Furthermore, since the transformed
> configuration space is non-linear, the surface can contain cusps or other anomalies, and
> errors can accumulate.

His preferred approach: transform each example's configuration first, `T(a)×X(a)`, then
interpolate those linearly to build a flat map.

> A particular advantage of this approach is the fact that the configuration map defines a
> flat surface, thereby giving the designer a good degree of control over the "feel" of the
> handle during tugging. Furthermore, the linearized configuration map only needs to be
> computed once as the state enters a zone, rather than for each incremental change in the
> configuration parameter.

This is what makes ECG feel solid rather than squishy, and it's the main thing to get right
in Lesson 8.

## Boundaries

Specified, case by case:

- **No zone across the boundary:** "the operation continues in the current zone, but with one
  vertex removed. If the procedure reaches a point at which the zone is reduced to only one
  vertex, the tugging operation stops."
- **One zone across:** "the state can continue into the zone ABD, taking all of its vertices
  into account."
- **Several zones across:** "one of the zones is chosen as the destination." Tom's suggestions:
  "the one that was first created by the system designer"; "choose the zone in which the state
  moves the least to accomplish a given ΔX"; "choose the zone in which the handles which are
  not being dragged by the user would move the least amount"; or balance several criteria
  "through a rapid matrix computation."

Left open: the exact stepping or constraint method, what to do when two weights hit zero at
once, and hysteresis (so the state doesn't flicker between zones on a shared face).

## Via points

Specified: "Two states are said to be equivalent if they have the same relative proportions
for all of the examples shared between the two zones, and zero for all of the examples in
either zone that are not shared." For a path between distant states, "the system may choose
to take the shortest path" through a sequence of adjacent zones.

## Automatic transformations

Specified: each zone has a transformation vector field `V`, and the transformation between two
states is a path integral of `V`. Constraints in the preferred embodiment: `V` is linear in
the barycentric coordinates, and along an edge the integral equals that edge's transformation,
which is anti-symmetric (going back undoes going forward). For linear paths "the automatic
transformations reduce to the matrix computation described above."

Left open for us: a readable derivation for the course. Lesson 8 should build it from the
walk-cycle example in the patent, where each reused pose is shifted "by the distance of one
pace to the right."

## Tugging more than positions

Specified: colour can be tugged too. "A zone might be composed of example images which depict
the same scene but in different respective colors," with a colour tool whose sliders work in a
colour space while the system solves for the state.

## Pasting

Specified: an animation factors into **clip motion** (a state sequence), **graphic skeleton**
(state → configuration and transformation), and **graphic skin** (configuration → rendered
image), which can be mixed and matched when their spaces are compatible. Pasting works "even
when f is not surjective" — a motion that only uses two of five zones only needs a mapping for
those two.

## What the patent doesn't tell us

- How the editor felt, and the tuning that made it feel that way.
- Default damping, snapping, springs, hysteresis.
- How Golan and other artists actually authored with it — workflow, mistakes, tricks.
- Performance tricks for 1996 hardware that might still matter on phones.

These are questions for Tom and Golan
([Repo Show seed](../../repo-shows/tom-and-golan-ecg-mouther/README.md)), and for play.

## Prior art cited in the patent

The patent contrasts ECG with Michael Gleicher's differential approach (CMU PhD thesis, *A
Differential Approach To Graphical Interaction*, CMU-CS-94-217, 1994), which "utilizes a
Jacobian matrix to determine the relationships which graphical objects should occupy to
conform to a given set of controls defined by the user. The Jacobian matrix varies arbitrarily
with state, and therefore must be recomputed for each change of state." ECG's constant
per-zone Jacobian is the difference.

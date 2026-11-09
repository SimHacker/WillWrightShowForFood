# Declarative Dragging and direct manipulation

By Don Hopkins. A reading of *Declarative Dragging* (Joshua Horowitz, Andrew Blinn, Jeffrey Heer,
2026; [paper](https://declarative-dragging.github.io/D2.pdf), [site](https://declarative-dragging.github.io/),
[HN thread](https://news.ycombinator.com/item?id=50368481)) against Ben Shneiderman's definition of
direct manipulation, and against earlier systems that address the limitations the paper lists.

## What D2 does

An interface developer writes a function from model state to an SVG view and says which states a
drag can reach. The library, Dragology, renders those candidate states speculatively, finds where
the dragged element ends up in each, and interpolates between the rendered views as the pointer
moves. A `vary` operator handles continuous parameters by numerical optimization (COBYLA, from
JSXGraph). Drag behaviors compose. The demos include sortable lists, trees, permutations, canvases
and tessellations.

The developer never writes hit testing, drop zones or the in-between animation: positions come
from rendering the states the developer already knows how to render. That moves dragging from
event-handling code into the model, which is where direct manipulation says the user's attention
is.

## The paper's definition

The introduction opens:

> Direct manipulation (DM) is an interaction paradigm which maximizes directness – the "qualitative
> feeling that one is directly engaged with... the semantic objects of our goals and intentions"
> [20]. Direct manipulation is exemplified by drag-and-drop, which builds analogically from the
> familiar activity of picking up, moving, and dropping physical objects.

Reference [20] is Hutchins, Hollan and Norman (1985). Shneiderman, who named direct manipulation
("Direct Manipulation: A Step Beyond Programming Languages," *IEEE Computer* 16(8), 1983), is not
cited. After the second sentence the paper says "drag-and-drop" throughout. The project site and
the HN thread don't use the term direct manipulation at all.

Drag and drop is one case of direct manipulation: moving an object from a source to a target, where
the drop is the operation. Shneiderman's definition has three parts:

1. continuous representation of the objects of interest;
2. physical actions or labeled button presses instead of complex syntax;
3. rapid, incremental, reversible operations whose effect on the object of interest is immediately
   visible.

Most of the D2 demos have no drop in them. Scrubbing a parameter with `vary`, reshaping a tree, or
watching the parallel representations in the permutation demo update mid-drag are continuous
manipulations of a model through a view. That is direct manipulation in Shneiderman's sense, and a
larger claim than "drag-and-drop".

Checked against the three parts:

| Part | D2 |
|---|---|
| Continuous representation | Yes. The view is a function of the model, re-rendered as you drag. |
| Physical action instead of syntax | Yes, for dragging. Selection, menus, gestures and handles on the object are outside the paper's scope. |
| Rapid, incremental, immediately visible | Yes. Speculative rendering shows the result before release. |
| Reversible | During a drag, yes, without being claimed: the library is history-independent, so dragging back returns to the earlier state. After release, cancel and undo are not discussed. |

## The paper's limitations, and earlier work on each

Section 9 of the paper lists its limitations. Each has prior work.

### Velocity and path

> It offers no principled model for velocity- or path-dependent drag effects

In the HN thread terabytest asked whether the library supports springs between states, and
Andrew Blinn (disconcision) answered: "so far the library is history-independent wrt transitions, which is a nice
simplification but does preclude more physics-y interactions."

Randall B. Smith's **Alternate Reality Kit** (Xerox PARC, Smalltalk-80) put physics under direct
manipulation. ARK objects have mass and velocity. You move them with a hand
that is itself an object in the world; let go while moving and the object is thrown and keeps its
momentum. Physical laws such as gravity are objects too, and can be turned off or changed. Smith's
paper on it, "Experiences with the Alternate Reality Kit: An Example of the Tension Between
Literalism and Magic" (CHI+GI 1987, [ACM](https://dl.acm.org/doi/10.1145/29933.30861)), is about
how far an interface should follow physics and where it should break it on purpose. See
[Randall Smith](../randall-smith/README.md).

Pie menus make the opposite choice deliberately: selection depends only on the line from press to
release, not on the path or speed, so the user can wander, reconsider and reselect before letting go.
See [angle at release](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/angle-at-release.md).

### One touch at a time

> Although Dragology supports touch devices, it can only handle one touch at a time; multi-touch
> is a natural avenue for future work

Tom Ngo's **Embedded Constraint Graphics** (Interval Research; [US patent 5933150](https://patents.google.com/patent/US5933150),
Ngo and Bruce Donald, filed 1996, expired 2016) solves for several handles at once. Example
drawings sit at the vertices of simplices glued into a simplicial complex; a state is a point with
barycentric weights; dragging a feature is mapped through the pseudoinverse of the Jacobian into a
change of weights. Golan Levin used the ECG editor to draw the faces for Mouther. Ngo's later
SIGGRAPH paper: [graphics.stanford.edu/papers/simplicial-animation](https://graphics.stanford.edu/papers/simplicial-animation/).
See [ECG at Interval](tom-ngo-embedded-constraint-graphics-at-interval.md).

In October 2013 I proposed an ECG-style character designer to Will Wright at Syntertainment, for
phone screens, with artist-made target meshes for heads and expressions. From the email:

> Touch one finger to each end of the mouth, and drag them around. It will smoothly "do what you
> want" by finding the best weighted average of the five expressions, to satisfy the position where
> you move both of your fingers.

and

> The main goal is to use the face or body itself as the user interface -- direct manipulation --
> instead of throwing up a lot of user interface gadgetry

See [2013 at Syntertainment](tom-ngo-embedded-constraint-graphics-at-interval.md#2013--ecg-conscience-at-syntertainment).

D2 and ECG are close relatives. D2 interpolates between speculatively rendered views; ECG
interpolates between drawn examples. D2's `vary` finds parameters by optimization; ECG finds
weights by the Jacobian pseudoinverse. The [`@wwsff/ecg`](../../packages/ecg/README.md) package
reimplements ECG as courseware, and [view blending](../../packages/ecg/VIEW-BLENDING.md) applies it
to window layouts, which is the D2 problem with saved views as the states.

### Coinciding drop targets

> Drop states in Dragology must be spatially unambiguous; when two drop targets coincide, the
> system cannot disambiguate intent and throws an error.

Direction can separate targets that share a location. A pie menu puts every choice at the same
distance from the press point and tells them apart by angle, which also gives each target a large
wedge and wins on Fitts's law against linear menus (Callahan, Hopkins, Weiser and Shneiderman,
"An Empirical Comparison of Pie vs. Linear Menus," CHI '88). See
[pie menus, CHI '88 and after](pie-menus-chi-88-and-beyond.md) and
[pie menus and Fitts's law](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md).

### Enumerating states

> Our study found that the most significant obstacle to learning Dragology was difficulty in
> enumerating reachable states

Programming by demonstration gets states from the user's actions instead of from code. Pygmalion
(David Canfield Smith, 1975), KidSim (Cypher and Smith, CHI '95, later Stagecast Creator), and the
systems collected in Allen Cypher's *Watch What I Do* (1993) and Henry Lieberman's *Your Wish Is My
Command* (2001) record what is done to visible objects and generalize it. ECG gets its states by
drawing examples. [View blending](../../packages/ecg/VIEW-BLENDING.md#finding-views-to-add-near-where-you-are)
adds states to the complex where the user's manipulation goes. See
[Allen Cypher](../allen-cypher/README.md) and [Henry Lieberman](../henry-lieberman/README.md).

### Not listed: discovery and cancelling

The paper does not discuss how a user finds out what can be dragged and what dragging it will do
before grabbing it, or how to let go without committing. Pie menus address both:

- **Self-revealing.** Press and wait, and the menu appears and shows every choice.
- **Browsing.** Moving around the center highlights the slice in that direction; nothing commits.
- **Changing the selection.** Move to another slice before release.
- **Undoing the selection.** Return to the center and release to cancel.
- **Rehearsal.** The novice's motion is the expert's motion; with mark-ahead the menu need not
  display at all. Kurtenbach and Buxton studied this transfer in marking menus.

Gesture recognizers lack all five: the gestures are invisible until learned, nothing prompts, the
result is unknown until the stroke ends, and a misrecognition can't be corrected mid-stroke. See
[gesture space](gesture-space.md),
[self-revealing gestures](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/self-revealing-gestures.md) and
[gesture space and pie menus](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/gesture-space-and-pie-menus.md).

## Direct manipulation and agents

Shneiderman and Pattie Maes debated "Direct Manipulation vs. Interface Agents" at IUI 97 and CHI 97
(*interactions* 4(6), 1997). With LLM agents the question is current again. My position is an
interface to agency instead of agents instead of interfaces: no capability reachable only by asking
an agent, and the agent's actions shown on the same objects with the same direct manipulation the
user has. Programming by demonstration is the link: people demonstrate by direct manipulation, and
the system's generalization is shown back the same way. See
[the 1997 agents debate](https://github.com/SimHacker/moollm/blob/main/designs/AGENTS-DEBATE-1997.md)
and [An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md).

## See also

- [Direct manipulation trail](../../process/trails/direct-manipulation.md)
- [Breakfast simplex](breakfast-simplex-barycentric-direct-manipulation.md): barycentric interpolation and pie menus
- [Direct manipulation lens](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/direct-manipulation.md)
- [Ben Shneiderman](../ben-shneiderman/README.md)

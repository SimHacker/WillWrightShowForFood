# Fitts and foveation — the mountain, the cursor, and the eye 🥧👁️

*From a conversation between Don and David Ungar about Don's Unity3D pie menus —
Don's recollection, paraphrased per [portrayal standards](../../schemas/portrayal-standards.md).
The design principle at the end is the takeaway; the disagreement in the middle is why it's earned.*

## Don's demo: bring the mountain to Mohammed

Don's Unity3D pie menus play an aggressive game with attention. When you move out
into a slice:

- **The selected item comes to you.** The label slides right up to the cursor, and a
  description progressively reveals itself *under* the cursor — right where you're
  looking. Instead of making the eye travel to the information (then the hand travel
  to the target), the menu predicts where the eyes will be focused and brings the
  item of interest there. Fitts' law says cost grows with distance and shrinks with
  size; the cheapest target is the one that walks over and stands under your gaze.
- **The unselected items dramatically get out of the way.** The other slices go
  inactive by shrinking and retreating deep into the menu center — or underneath
  anything opaque you put there — disappearing with a flourish.

The first move is pure mountain-to-Mohammed. The second felt like good stagecraft:
clear the stage, spotlight the star.

## David's counterpoint: motion is a foveation summons

David pointed out that the retreat animation of the *deselected* items is
counterproductive: it attracts your foveation to exactly the things you just decided
don't matter.

His explanation, paraphrased: what you perceive as sight is a **reconstructed
illusion** — the brain composites a stable scene from a tiny high-resolution fovea
plus a blurry, motion-sensitive periphery. And we evolved as animals who were
stimulated and frightened by visual motion; peripheral movement is a hardware
interrupt that yanks the eye toward it, because the things that moved in the
underbrush were the things that mattered. Animate a dozen slices collapsing inward
and you fire a dozen interrupts, all pointed away from the one thing the user chose.

Don saw the point. The stagecraft reading was backwards: dramatic exits don't clear
the stage, they *steal the scene*.

## The lift: an ambient design awareness

The takeaway Don proposed on the spot: this belongs in a designer's head **at all
times**, the same way Fitts' law awareness does — not a checklist item but an
ambient constraint, always on. A candidate MOOLLM ambient design skill, sibling to
the fitts-shaped one:

> **Motion is a foveation summons. Only send it where you want the eye.**

Spend the animation budget on the selected item — the label sliding to the cursor,
the description unfolding under it. Make deselection cheap and quiet: a **slow
ramping blur and fade**, dimming and defocusing gradually enough to stay under the
periphery's motion-detection threshold — anything but a flourish. The
retreat-into-the-center trick can stay, but as a *state*, not a *show*: the
periphery should already be still by the time the eye would have noticed it moving.

## Prior art from The Sims: the turning head and its private twilight

Don had been playing both sides of this rule since The Sims — without knowing the
rule. The pie menus there have the **Sim's own head in the center**, and it looks
around at the currently selected item like the Brady Bunch title grid. That's
center-stage motion — technically a foveation violation, committed for fun and
dramatic focus — but it cheats in the right direction: assuming your eyes start at
the center (they do; you just clicked there), the head's turn *sends* them along
the exact vector of your selection. A violation that works as a signpost. The
source (`PopupHead.cpp` — "Don Hopkins, Maxis") even confesses the intent in a
comment: *"Shimmer the head a little bit to make it noticeable."* Summoning
foveation on purpose, years before hearing the mechanism explained.

The head's choreography, from the code: selection maps to eight compass slices
(nod/shake deltas 0.6 cardinal, 0.4 diagonal; menus past seven items alternate
top/bottom, so the head looks up for even, down for odd), the turn eases over
400 ms with a square-root slowdown near the end, the head leans toward the cursor
proportional to the square root of its distance, and the ambient light brightens
from 0.8 to 1.0 the moment something is selected — the head literally glows when
you choose.

And behind the head, the part designed *against* attention: a **desaturated,
darkened radial filter** separating the popup from the scene. The motivation was
compositing, not foveation: the bright colorful head should **POP out of the
scene** like an overlay thought bubble — Donnie Darko universe — *not* read as a
household scene with a gigantic Zardoz head materializing in the living room. The
shadow was designed and tuned specifically to separate the two planes. From
`HouseViewer::RenderRoundShadow`:

- **A 100-pixel-radius circular scrim**, animated in over 400 ms as the menu pops
  (and sliding smoothly when submenus recenter it).
- **Z-guarded**: only pixels *behind* the overlay plane are filtered — the head and
  pie stay full-color; only the scene enters twilight.
- **One formula, three jobs**: each scene pixel becomes the single gray
  `(R+G+B)/6 + 8` — half the channel average, floor-lifted by 8. Desaturation,
  ~50% darkening, and contrast compression in one move ("convert rgb to dark low
  contrast gray," says the comment).
- **A gentle taper**: full effect within the inner ⅔ of the radius; across the
  outer third the gray blends back to the original color with weights linear in
  *squared* distance — the falloff eases in, so the edge never draws a line for
  the eye to find.

Which makes the shadow accidentally exemplary foveation hygiene: it removes the
periphery's color and contrast (the very things that compete for the eye) with a
static, softly-tapered state change — while all the motion budget goes to the one
thing in the spotlight. The Sims menu got the split right by theatrical instinct:
**the head is the show; the shadow is the stage going dark.**

## Ties

- **PieCraft's teaching goal is Fitts' law** — good layout as survival skill
  ([Edd Coates show notes](../../repo-shows/edd-coates/pie-menus-discussion-notes.md)).
  This is the companion lesson: Fitts governs where the *hand* can cheaply go,
  foveation governs where the *eye* will involuntarily go. A UI literacy game should
  teach both — and could score layouts on misdirected motion the way it scores them
  on target distance.
- **Fitts' law design notes** —
  [pie-menus-fitts-law.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/pie-menus-fitts-law.md)
  in MicropolisCore.
- **Self's Stage Magic Principle** — David has been applying theatrical attention
  discipline to UIs since the Self morphs: the magician controls where you look.
  Same instinct, now with the evolutionary mechanism spelled out.
- **Correspondence thread** — [correspondence.yml](correspondence.yml).

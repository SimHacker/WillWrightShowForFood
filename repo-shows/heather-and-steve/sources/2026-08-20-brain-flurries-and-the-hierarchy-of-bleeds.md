# 2026-08-20 — Brain Flurries and the Hierarchy of Bleeds

Digest of Don's side of an August 20, 2026 chat with Heather and Steve — a design
jam that escalated from zombie tower defense to a full fluid cellular-automata
spec in about six messages. Kept as source for the
[Afterlife × ZombieSims episode](../afterlife-zombie-bridge.yml).

## The Brain Flurry defense

Mod the McFlurry so it advertises **Brain Flurries** that zombies can't resist —
then they get the shits and run away. Station several McFlurry stands around
your encampment to defend yourself from zombie invasions: tower defense by
advertisement, no bullets fired. The Sims ad auction does the targeting — a
zombie's brain-hunger re-weights the Brain Flurry ad sky-high, and the zombie
walks itself into the trap.

There would be a hell of a lot of shit all over the place. But you could use
that to fertilize your garden — siege → sewage → soil → supper, a closed-loop
economy where every repelled invasion feeds next season's harvest.

## The flood asks

Don, to Steve: *"Did you clone the blue flood into a red blood flood? Or chum
flood with lots of niblets? 😉"*

## The Hierarchy of Bleeds

Chum flows into and replaces blood; blood and chum flow into and replace
water. But once you're blood you're no longer water, and once you're chum
you're no longer blood. One-way escalation, a total order:

**water < blood < chum**

Don linked [Maslow's hierarchy of needs](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs)
— the Hierarchy of Bleeds. Fluids self-actualize upward and never come back down.

## Brown and yellow join the pyramid

Of course we need **brown diarrhea floods** — they fit into the hierarchy and
the cellular automata, and they're the Brain Flurry defense's own byproduct:
the zombie-repellent aftermath piped straight into the flood system.

And **yellow pee** — does that pool or not? Vanilla Sims pee is a static
puddle; the design question is whether a puddle is just a flood with spread
radius zero, which would make pee the hierarchy's humble ground floor — the
physiological base of the pyramid, fittingly.

## Moveable feces

Like a moveable feast, there could be **random combination rules** — moveable
feces: when two fluids meet, roll on a combination table, and let the rules
themselves mutate mid-flood, Fluxx-style
([fluxx-rules-change-as-you-play](../../fluxx-rules-change-as-you-play/)).

## Flood z-buffers

Can floods stack into layers? Not raised — **overlapping**, co-located strata
on the same tile, with z-buffers that composite them in disgusting patterns.
Painter's algorithm for filth; Porter–Duff operators for bodily fluids —
chum-over-blood-over-water, marbled per tile.

## Attachment points — plates stack, so do fluids

Each layer could have **"same height"** and **"above"** attachment points to
layer objects on, the way plates stack. The Sims already has the mechanism —
object slots are how plates land on counters — so a flood layer with slots is
just an object that happens to be a liquid: put a raft in the *same-height*
slot of the water layer, a corpse in the *same-height* slot of the blood
layer, a McFlurry stand in the *above* slot riding the whole disgusting
parfait.

## Why it's in the show

Steve's SimSlice flood is the shipped precedent — the blue flood is already a
tile-spreading machine, so the whole pyramid is a palette-and-rules mod away.
Heather's Zombie Sims supplies the horde the Brain Flurry stands repel. The
episode gets a defense segment and a fluids segment out of one chat.

# Questions for Will — Spore (2008)

*Grounded in a survey of how games represent temporary and permanent modifiers.
Spore came out of it as the richest case examined: a different modifier system
at each of the five stages, plus one that spans all of them. Source:*
`moollm/skills/buff/buffopedia/systems/spore/SYSTEM.yml`

[Questions index](README.md) · [ideas.md §5, §6, §9](../ideas.md) hold the Spore
*show* lanes; this file holds the mechanism questions · premise rule: [README](README.md)

## Why we care, plainly

MOOLLM is building a modifier system — buffs, moodlets, dispositions, whatever
they end up called — and Spore already answered several of its open questions in
shipped form. Two answers in particular have no equal anywhere else surveyed:
granting an ability based on **how the player has behaved**, and hanging state on
a **planet** rather than on a creature. So these are not trivia; they are
"you already solved this, what did it cost."

---

## 1. The archetype count

**PREMISE** — Choices across the earlier stages accumulate into one of roughly
ten archetypes (Zealot, Warrior, Scientist, Trader, Shaman, Bard, Diplomat,
Ecologist, Knight, Wanderer), which determines a permanent activatable ability
in the Space stage.
**CONFIDENCE** — high on the mechanism, medium on the list being complete and
exactly ten.

**THE QUESTION.** How did the number land where it did? Was it ever
substantially larger — or continuous, with no named buckets at all — and what
made bucketing win? The suspicion is that ten exists because a player has to be
able to *say what they are*, and a continuous position on five axes cannot be
said.

*Why we care: MOOLLM's version of this classifier is a language model, which has
no natural bucket count. Ten-or-so from someone who shipped it is the most
useful number available.*

## 2. Was the Consequence system understood as the most Sims-like idea in Spore?

**PREMISE** — The Consequence abilities are granted by a summary of accumulated
conduct: the game watches how you played and hands you something permanent that
reflects it.
**CONFIDENCE** — high.

**THE QUESTION.** That shape — behavior accumulating into a durable trait the
system then acts on — is closer to The Sims than to anything else in Spore. Was
that connection explicit internally, or does it only look like a family
resemblance from outside? And was there ever an intent for the archetype to feel
like a *diagnosis* — the game telling you who you turned out to be?

**The follow-up worth the whole segment.** Proxi is a model of a person built
from what they contribute. Spore's archetype is a model of a player built from
what they did. Is there a line between them in his own head — is Spore's
classifier an ancestor of Proxi, or an unrelated mechanism that happens to
rhyme?

*Why we care: this is the crossing point between the buff work and the Proxi/Soul
City work, and Don has both.*

## 3. The editor's range versus the ability tracks

**PREMISE** — Creature parts map onto a small fixed set of ability tracks
(bite, charge, strike, spit, sing, dance, charm, pose, plus health, speed,
stealth) at levels one to five. The editor's expressive range is effectively
unbounded; what the simulation reads is about ten numbers.
**CONFIDENCE** — high that the tracks are few and fixed; low on the exact list
and on whether duplicate parts raise a level or only the best part counts.

**THE QUESTION.** Was the narrow projection a **legibility** decision — players
must be able to predict what their creature will do, and that requires few
readable dimensions — or did richer creature-to-mechanic mappings get prototyped
and cut for time? Both are respectable answers and they imply opposite lessons.

Phrased for air, without the accusation the internet usually attaches: *the gap
between what the editor can express and what the game can notice is the single
most-discussed thing about Spore. From the inside, was that gap a choice?*

*Why we care: this is the sharpest warning available about player-authored
buffs. If the guard vocabulary cannot notice what was authored, authoring
becomes decoration — and MOOLLM is about to hand players an authoring surface.*

## 4. The budget as a design tool

**PREMISE** — Two different conservation laws ship in one game. Creature parts
cost DNA points from a finite pool. The Civilization-stage vehicle editor gives
sliders for speed, power and health that share one budget, so raising one
visibly lowers the others.
**CONFIDENCE** — high.

**THE QUESTION.** Was the budget there to *create decisions* or to *bound the
simulation*? And in playtest, did people enjoy the tradeoff or resent it — did
the slider triangle read as expressive or as a tax?

*Why we care: MOOLLM's buffs currently have no cost and no cap, so nothing
pushes back on a character accumulating twenty of them. Every long-lived
modifier system surveyed eventually grew a budget, and the question is whether
the budget is the fun or the fence.*

## 5. Terrascore — state that belongs to a world

**PREMISE** — Planets carry a habitability rating (T0–T3), raised by
terraforming, that gates what can live there and how large cities can grow.
**CONFIDENCE** — high.

**THE QUESTION.** Was that modeled as a property *of the planet* — the world as
an object with stats — or as a value the empire holds about the planet? The
implementation question is the interesting one: did planets get to be
first-class stat-carrying entities, and if so, was that always true or did it
arrive when terraforming did?

*Why we care: MOOLLM currently insists modifiers attach to characters, so a
room needing a modifier gets a fictional "room spirit" character invented to own
it. Spore hangs state on a planet with no resident and nothing looks strange.*

## 6. Five stages, five systems, and the handoffs between them

**PREMISE** — Each stage has a genuinely different mechanical vocabulary: parts
as anatomy, per-member tools, budgeted vehicle stats, cooldown-gated space
tools. Information carried across a stage boundary is a small summary.
**CONFIDENCE** — high.

**THE QUESTION.** How much of the cross-stage carry was designed up front versus
negotiated between teams as the stages firmed up? And the question behind it:
**what did you want to carry forward that couldn't be?** Something that made
sense in Creature and had no representation in Space.

*Why we care: this is exactly the problem of moving a character between worlds —
Soul City's whole premise — and Spore is a rare case where both ends shipped in
the same box, by the same studio, and the handoff still lost things. Whatever
was learned there is directly applicable.*

## 7. The editor as the primary feedback surface

**PREMISE** — Drag a part onto a creature and the ability bars move as you drag,
before committing. The aggregation of all installed parts is shown continuously
while authoring.
**CONFIDENCE** — high.

**THE QUESTION.** Was showing the aggregated result always the plan, or did it
start as a debug view? And was there ever a version that showed **which part
contributed what** — attribution rather than just the total?

*Why we care: the MOOLLM design specifies the arithmetic of combining modifiers
and says nothing about how anybody sees it. Spore's editor is proof that the
aggregation view can be the primary interface rather than a diagnostic screen,
and the attribution question is exactly the missing piece.*

## 8. Was advertisement-style scoring ever considered for creatures?

**PREMISE** — In The Sims, objects broadcast advertisements and a Sim picks by
scoring them against its current state. Spore's creature is driven much more
directly by the player.
**CONFIDENCE** — high on the Sims side; medium on how much autonomous scoring
exists in Spore's creature stage.

**THE QUESTION.** Did the advertisement economy ever get tried on Spore's
creatures — a world of objects and other creatures bidding for attention — and
if so, what broke? A galaxy of advertisers is a different scale problem than a
house full of them.

*Why we care: the advertisement auction is the mechanism Don is rebuilding, and
its scaling limits are worth knowing from someone who hit them.*

## 9. The first ten minutes decide the diet

**PREMISE** — The Cell stage's herbivore / carnivore / omnivore choice is made
early and governs what is edible for the rest of the run.
**CONFIDENCE** — high.

**THE QUESTION.** An irreversible choice in the first ten minutes, before the
player knows what they are choosing between — was that tension deliberate (you
live with who you were) or a consequence of the stage structure? Did anyone
argue for making it revisable?

*Why we care: buffs that cannot be dispelled are a category MOOLLM has no field
for, and "permanent because it was chosen before you understood it" is the most
interesting version of that category.*

---

## Already covered elsewhere — do not duplicate

- **2005 GDC reveal versus what shipped** — [`ideas.md` §5](../ideas.md), with
  Don's Will-reviewed field notes in
  [`sources/2005-03-11-spore-gdc-future-of-content/`](../sources/2005-03-11-spore-gdc-future-of-content/README.md)
- **Long Now *Playing with Time* Spore demo** — [`ideas.md` §5](../ideas.md)
- **Clean-room web-native creature editor/animator** —
  [`ideas.md` §9](../ideas.md)
- **Powers-of-ten map across his own games** — [`ideas.md` §6](../ideas.md)

## Research to do before asking any of this

The premises above are from documentation, play memory, and structural analysis
— **not** from extracted game data. Before these go on air:

- verify the archetype list and the ability granted by each
- verify the creature ability tracks and how duplicate parts aggregate
- check whether creature-stage autonomy is more sophisticated than assumed in §8

The survey entry flags the same gaps under `confidence_note` and `caution`:
`moollm/skills/buff/buffopedia/systems/spore/SYSTEM.yml`

# Vladimir Putin — a model from the public record

Modeled from the public record as **the restorer**: standing comes first, an attack is filed as protecting people, and the other side decides whether the war ends. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-restorer`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-restorer.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`drive-face`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/drive-face.yml) | standing first; a concession costs it | — |
| [`defensive-war`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/defensive-war.yml) | an attack is re-filed as protecting people | "The purpose of this operation is to protect people who, for eight years now, have been facing humiliation and genocide perpetrated by the Kiev regime." (2022) |
| [`the-other-side-chooses`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/the-other-side-chooses.yml) | escalation is re-filed as the other side's choice | "...it lies with the Ukrainian side." (Shenzhen, 2026) |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | Annual address to the Federal Assembly, 25 Apr 2005: "the collapse of the Soviet Union was a major geopolitical disaster of the century" (Kremlin translation; usually rendered "the greatest geopolitical catastrophe of the century"). |
| 2 | Helsinki, 16 Jul 2018, handing Trump a World Cup ball. — "Mr. President, I will give this ball to you and now the ball is in your court." |
| 3 | Televised address, 24 Feb 2022, as the full-scale invasion of Ukraine began. — "We will seek to demilitarize and denazify Ukraine, as well as bring to trial those who perpetrated numerous bloody crimes against civilians, including against citizens of the Russian Federation. It is not our plan to occupy the Ukrainian territory. We do not intend to impose anything on anyone by force." |
| 4 | Shenzhen press conference, 19 Nov 2026. The BBC's Steve Rosenberg: Russia continues to strike Ukraine; is he prepared to end the war? — "I assure you, we have no desire to continue this armed conflict. However, the issue today does not lie solely – or perhaps even primarily – with us; it lies with the Ukrainian side." |
| 5 | Same answer, on the territory Ukraine still holds. — "Ukraine says: we will hold the remaining 10 percent of Donetsk [People's Republic] territory for some time. But even if they manage to hold it for a while, only to eventually lose it anyway, is there any point in clinging to that 10 percent at all costs?" |

## What the model says

**Face fits all four choices** (the World Cup ball at Helsinki, the invasion, Shenzhen twice), in
94% of random weightings. The 2005 "geopolitical disaster" line and the 2022 promise that "It is not
our plan to occupy the Ukrainian territory" are in the record as said. `the-other-side-chooses` is
shared with Kim Jong Un: the same cover, a different war.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it, not litigated.

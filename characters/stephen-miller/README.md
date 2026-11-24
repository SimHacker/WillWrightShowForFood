# Stephen Miller — a model from the public record

Modeled from the public record as **the ideologue**: the convert's shape (he knows what he's saying and agrees with it, so there's nothing to censor), on stage, with power. Don Hopkins calls him "nazi chief of staff"; that's Don's characterization, and the record below is what it rests on. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-ideologue`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-ideologue.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`the-convert`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-convert.yml) | knows and agrees; no contradiction to manage | — |
| [`civilization-frame`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/civilization-frame.yml) | excluding a group is re-filed as defending a civilization | "...why would any civilization that actually wants to preserve itself allow for any migration that is negative to the country as a whole?" (2025) |
| [`smear-the-watchdog`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/smear-the-watchdog.yml) | won't hear out the group that documents it | none of his own: the White House answered the SPLC for him |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | Email to Breitbart editor Katie McHugh, 6 Sep 2015, on the Pope's remarks on migration. — "On the education angle? Makes sense. Also, you see the Pope saying west must, in effect, get rid of borders. Someone should point out the parallels to Camp of the Saints." |
| 2 | Email to McHugh, 23 Oct 2015, on Hurricane Patricia and refugees. Nineteen minutes later he sent her a link to a VDARE article by Steve Sailer. — "100 percent. And they will all get TPS. And all the ones here will get TPS too. That needs to be the weekend's BIG story. TPS is everything." |
| 3 | 12 Nov 2019: the SPLC publishes its review of more than 900 of his emails to Breitbart. The White House answers for him; press secretary Stephanie Grisham calls the SPLC an "utterly discredited, long-debunked far-left smear organization". It didn't address what he wrote. |
| 4 | Trump rally, Madison Square Garden, 27 Oct 2024. — "America is for Americans and Americans only!" |
| 5 | White House gaggle, 30 May 2025, asked about new visa screening. — "Like, why would any society, why would any civilization that actually wants to preserve itself allow for any migration that is negative to the country as a whole?" |
| 6 | 6 Nov 2026, after the midterm losses, Trump names him the 33rd White House chief of staff, replacing Susie Wiles. He starts on 9 Nov. |

## What the model says

**Knows-and-agrees fits all five choices** in every random weighting: the Camp of the Saints
email, the VDARE link, the SPLC response, "America is for Americans and Americans only!", and the
civilization line. No censor is needed, which is the convert's signature: nothing to hide from
himself. SPLC Hatewatch describes Camp of the Saints as a racist French novel popular among white
nationalists and neo-Nazis, and VDARE as a white nationalist site; VDARE's founder denies the
label. He became White House chief of staff on 9 November 2026.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it in [`disputes.yml`](disputes.yml), not litigated.

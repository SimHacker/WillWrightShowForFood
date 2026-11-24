# Xi Jinping — a model from the public record

Modeled from the public record as **the helmsman**: standing comes first, and every dispute is filed as stability being managed. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-helmsman`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-helmsman.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`drive-face`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/drive-face.yml) | standing first; a concession costs it | — |
| [`harmony-script`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/harmony-script.yml) | a dispute is re-filed as stability being managed | "Differences that cannot be resolved for the time being should be managed in a constructive way, and escalation should be prevented." (Shenzhen, 2026) |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | Meeting with Trump, May 2026: ABC reports he warned that China and the US could "come into conflict" if Taiwan is handled "improperly". |
| 2 | Shenzhen, 19 Nov 2026, bilateral meeting with Trump, per China's readout. — "I look forward to working with President Trump to continue taking the helm of China-U.S. relations, and ensure that this giant ship always stays on the right course and forge ahead at full sail." |
| 3 | Same meeting, on Taiwan. — "On the question of Taiwan, the U.S. side should keep doing the right thing and avoid major setbacks in China-U.S. relations." |
| 4 | November 2026: US officials say Alice Huang, who had an affair with Nvidia's CEO, worked with China's Ministry of State Security. His government, not he, answers: China's foreign ministry rejected the allegation and called it unsubstantiated. |

## What the model says

**Face fits all four choices** (the May 2026 Taiwan warning, flattering Trump at Shenzhen, the
Taiwan line, the spy denial), in 86% of random weightings. Most of his record comes through
Chinese government readouts, not his own transcripts, and the spy denial came from his foreign
ministry, not from him. The record says so at each event.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it in [`disputes.yml`](disputes.yml), not litigated.

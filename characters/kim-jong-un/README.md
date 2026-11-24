# Kim Jong Un — a model from the public record

Modeled from the public record as **the dynast**: standing comes first, the one counterpart who matters gets flattered while a deal is open, and the other side decides. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-dynast`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-dynast.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`drive-face`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/drive-face.yml) | standing first; a concession costs it | — |
| [`the-other-side-chooses`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/the-other-side-chooses.yml) | taken from the restorer | "Whether it's peaceful coexistence or permanent confrontation, we are ready for either, and the choice is not ours to make." (2026) |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | 2018, before and after the Singapore summit: letters to Trump, which Trump called "beautiful letters". John Bolton: they read as if written by the Party's agitprop bureau. |
| 2 | To the Supreme People's Assembly, September 2025. — "The concept of 'denuclearisation' has already lost its meaning. We have become a nuclear state. I say 'denuclearisation' is the last, last thing to expect from us." |
| 3 | Ninth Party Congress, 26 Feb 2026, on relations with the US. — "Whether it's peaceful coexistence or permanent confrontation, we are ready for either, and the choice is not ours to make." |
| 4 | Same speech. — "We will focus on projects to increase the number of nuclear weapons and expand nuclear operational means." |
| 5 | 20 Aug 2026, after Trump said Kim had answered his requests to talk. His sister, Kim Yo Jong, through KCNA, speaking for the state. — "The relationship between the two leaders remains excellent. However, the US's hostile policies toward the Democratic People's Republic of Korea haven't changed." |

## What the model says

**Face plus one deal fits all five choices** (the 2018 letters, "the last, last thing to expect
from us", the 2026 congress twice, his sister's August statement), but only in 70% of random
weightings: flattering for a deal only narrowly beats escalating. That's the weakest fit of the
six, and the most interesting forecast: the model says he flatters when a deal is open and
escalates when it isn't. His sister's statement speaks for the state, and the record says so.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it, not litigated.

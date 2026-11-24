# Jensen Huang — a model from the public record

Modeled from the public record as **the founder**: keeping the position matters more than the whole truth; he confesses the private failing and refers the public question to an inquiry. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-founder`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-founder.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`drive-the-company`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/drive-the-company.yml) | keeping the position matters more than the whole truth | — |
| [`the-smaller-sin`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/the-smaller-sin.yml) | confess the private failing, not the public question | "I was unfaithful to my wife. ... I am deeply sorry." (8 Nov 2026) |
| [`investigation-pending`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/investigation-pending.yml) | taken from the dealmaker | "I support the investigation and will cooperate fully." (8 Nov 2026) |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | October 2025, after the NYT reported Nvidia's unusually close business with Megaspeed, where Alice Huang worked: board members asked him about her. Per two people familiar with the board's discussions, he denied any inappropriate relationship. |
| 2 | 29 Oct 2026, the NYT reports the relationship. Nvidia's spokesperson, John Rizzo, answers for him. — "Jensen's interactions with Ms. Huang are not unusual or unexpected. Meetings with customers are part of a CEO's job; Jensen talks with thousands of customer executives every year." |
| 3 | 8 Nov 2026: the board opens an independent investigation into reports that he "has been the target of a foreign intelligence effort". He writes to employees the same day. — "I was unfaithful to my wife. My actions hurt her and our children. There is no excuse for what I did. I am deeply sorry. ... Regarding the national security concerns raised in news reports, NVIDIA's Board of Directors has initiated an independent investigation. I support the investigation and will cooperate fully." |
| 4 | 11 Nov 2026: the NYT reports an affair with Kimberly Powell, a vice president who reports to him, and reaches him by phone. — "I don't think you should be talking to me directly" |
| 5 | 12 Nov 2026: he resigns as CEO and leaves the board. Reuters reports a third affair. WIRED, citing people close to the board: "what could be determined was [Huang's] lying, and that spanned a year". |
| 6 | 17 Nov 2026, his first public statement since the letter. — "If the Board of Directors decides that my return is in the best interest of our shareholders, our employees, the company, and America, I would be honored to answer these calls and return as CEO." |
| 7 | 23 Nov 2026: the board reinstates him unanimously, saying it is satisfied with his candor and sees no national security risk after input from senior US officials. Semafor reports Trump called into the board meeting. |

## What the model says

**Keeping the company fits all five choices** (denying to his board in 2025, the spokesperson's
denial, the letter, "I don't think you should be talking to me directly", asking to come back), in
97% of random weightings. The letter is the center of it: he apologized for the affair and sent
"the national security concerns raised in news reports" to the board's investigation. The board's
view, per people close to it, was that the problem was "the lying". He was reinstated on 23
November after, Semafor reports, Trump called into the board meeting. Shares the
`investigation-pending` trait with Trump.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it in [`disputes.yml`](disputes.yml), not litigated.

# Donald Trump — a model from the public record

Modeled from the public record as **the dealmaker**: applause and the deal pay, a friend accused is a friend who'll owe him, and a warning about the friend doesn't arrive or waits for an inquiry. Built with the [Brainball kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md) under the
[public-power rule](../../schemas/portrayal-standards.md#public-power): his words verbatim, every
event sourced, hypotheses labeled, no claim about intent.

## How he's built

[`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml) inherits the abstract
[`the-dealmaker`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-dealmaker.yml) archetype. Each trait is a named, reusable part; his
own sentence, with a source, replaces its template cover.

| Trait | What it does | His words |
|---|---|---|
| [`drive-the-deal`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/drive-the-deal.yml) | what the friend owes and the deal outweigh what the friend did | — |
| [`friend-of-the-strongman`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/friend-of-the-strongman.yml) | the friend's denial outweighs the evidence | "President Putin was extremely strong and powerful in his denial today." (Helsinki, 2018) |
| [`i-havent-heard-that`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/i-havent-heard-that.yml) | a warning about a friend doesn't arrive | "I haven't heard that. I haven't heard that, no." (on Alice Huang, 2026) |
| [`investigation-pending`](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/parts/investigation-pending.yml) | the inquiry will answer it | "We'll determine that." (2026) |

## The record

[`record.yml`](record.yml) has the sources, the moves open to him at each moment, and the one he
made.

| t | What |
|---|---|
| 1 | Helsinki, 16 Jul 2018, beside Putin, asked whether he believed US intelligence or Putin on interference in the 2016 election. — "My people came to me. Dan Coats came to me, and some others. They said they think it's Russia. I have President Putin. He just said it's not Russia. I will say this: I don't see any reason why it would be." |
| 2 | The next day, after criticism from Republicans as well as Democrats (Newt Gingrich called it "a mistake"), he told reporters he had meant to say "wouldn't", not "would". |
| 3 | Rally in Wheeling, West Virginia, 29 Sep 2018, on Kim Jong Un. — "And we would go back and forth. And then we fell in love, ok? No really. He wrote me beautiful letters. And they're great letters. And then we fell in love." |
| 4 | 8 Nov 2026: Jensen Huang admits an affair; US officials suspect the woman, Alice Huang, of working for Chinese intelligence. The NYT reported Trump had been briefed on that intelligence in late 2025. — "I have not spoken to him about it. I just know he's a fine person, but you never know what's going on." |
| 5 | 16 Nov 2026, asked whether he trusted the intelligence on Alice Huang. — "Usually what happens with that is that any woman coming to the country that's a beautiful woman that comes from China, they say she's a spy." |
| 6 | Shenzhen, 19 Nov 2026, bilateral meeting with Xi Jinping, per China's readout; the US had not released its own. — "The United States does not support "Taiwan Independence."" |
| 7 | White House briefing, 20 Nov 2026, on Huang. — "I would love to see Jensen be given a second chance. You know we're a country of second chances." |
| 8 | Same briefing: Russia's deputy foreign minister had just rejected the NATO-style guarantee for Ukraine that Kushner said the Russians were "comfortable with". — "Look, our side put out things because it's also a public relations war. And we'll say things, and they'll say things. I can only tell you that President Putin would like to get this settled, and that's with surety." |
| 9 | 23 Nov 2026: Semafor reports he called into Nvidia's board meeting to push for Huang's return; he posts that "the United States government has no reason to believe that Jensen's return to Nvidia poses any risk to national security." The board reinstates Huang. |

## What the model says

**The friend wins every time but one, and the one is the Musk pattern.** Across eight choices from
2018 to 2026 (Putin at Helsinki, Kim's letters, Huang twice, Xi on Taiwan, Putin again), the
`deal-pays` run fits 7, in every one of 1,000 random weightings. The miss is the day after
Helsinki, when he said he'd meant "wouldn't". That followed a documented cost: criticism from his
own party. The `power-pays` run is the one found for Musk, unchanged: stopping a documented cost is
worth more than the applause. It fits all 8. Two men, one weight, the same kind of retraction.

**The Huang case shows the censors at work.** He'd been briefed on the intelligence about Alice
Huang in late 2025 (per the NYT). Asked in November 2026, he said "I haven't heard that" and "We'll
determine that", then "any woman coming to the country that's a beautiful woman that comes from
China, they say she's a spy". In the model those are two precursor censors and a cover. The
ablation says the values alone already pick the friend, so the censors are his account of those
moments rather than their cause.

Run it: `python3 censor_sim.py test minds/censor-mind/on-stage.yml` (and `sweep`, `ablate`,
`induce`, `predict`) with the moollm kit's `scripts/censor_sim.py`.

## Changing this model

He's welcome to correct, add to, or argue with any of it, or to ask for its deletion, like anyone.
Factual corrections with evidence change the record. Denials and Gish gallops without evidence are
recorded beside it in [`disputes.yml`](disputes.yml), not litigated.

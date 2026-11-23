# Elon Musk — a model from the public record

This is a model of what Elon Musk has said and done in public, and of the crowd around him. It's
built with the [Brainball Construction Kit](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/BRAINBALL.md).
It's public under the [public-power rule](../../schemas/portrayal-standards.md#public-power): he
runs a mass platform and uses it on the public, so his public words and deeds are fair to model,
in the open, from the record. He's not a show guest and hasn't been asked.

Every quote is verbatim and sourced ([`record.yml`](record.yml)). Every censor and weight is a
hypothesis, labeled as ours and tested against the record. Where his account and the record
differ, both are on file in [`disputes.yml`](disputes.yml).

## How he's built

Abstract first, then concrete. The kit's [Baron](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/censors/archetypes/the-baron.yml)
is an archetype: the figure at the center of a crowd. It **imports single traits from his own
followers' archetypes** (persecution from the crusader, awkward-gesture from the fan, just-joking
from the ironist, someone-else-did-it). [`PERSONALITY.yml`](minds/censor-mind/PERSONALITY.yml)
inherits the Baron and replaces each trait's template line with his own sentence and a source:

| Trait | His words |
|---|---|
| persecution | "Frankly, they need better dirty tricks. The 'everyone is Hitler' attack is sooo tired." |
| awkward-gesture | "It was astonishing how insanely hard legacy media tried to cancel me for saying 'my heart goes out to you' and moving my hand from my heart to the audience" |
| just-joking | "When I see the troll emoji, it's like looking in the mirror." |
| someone-else-did-it | "Exactly. Grok was too compliant to user prompts. Too eager to please and be manipulated, essentially. That is being addressed." |

```bash
S=../../../moollm/skills/schema-mechanism/scripts/censor_sim.py
python3 $S lineage minds/censor-mind/on-stage.yml   # each part, where it came from
python3 $S lint    minds/censor-mind/on-stage.yml   # 0 errors: every word and deed sourced
python3 $S run     minds/censor-mind/on-stage.yml --format md
```

## The record

| t | When | What |
|---|---|---|
| 1 | 15 Nov 2023 | "You have said the actual truth," to a post accusing Jewish communities of "dialectical hatred against whites" |
| 1.5 | 29 Nov 2023 | DealBook: "For that, I'm quite sorry." Then, to advertisers: "go fuck yourself" |
| 2 | 20 Jan 2025 | the arm thrown out twice; "My heart goes out to you" |
| 3 | 20 Jan 2025 | Nadler, the Wiesenthal Center; Musk: "The 'everyone is Hitler' attack is sooo tired" |
| 3.5 | 20 Jan 2025 | the ADL: "an awkward gesture in a moment of enthusiasm" |
| 4 | 23 Jan 2025 | the Hess / Goebbels / Göring / Himmler puns |
| 4.5 | 23 Jan 2025 | "legacy media tried to cancel me for ... moving my hand from my heart to the audience" |
| 4.6 | 23 Jan 2025 | the ADL: "the Holocaust is not a joke"; no reply as of the next day's reporting |
| 5 | 25 Jan 2025 | AfD, Halle: "too much focus on past guilt" |
| 6 | 8–12 Jul 2025 | Grok's "MechaHitler"; his and xAI's explanations, which differ |
| 7 | 13 Sep 2025 | Unite the Kingdom: "You either fight back or you die" |

## What the model says

**From his seat, applause explains every action but one.** [`on-stage.yml`](minds/censor-mind/on-stage.yml)
fits 8 of his 9 choices, and the `doesnt-know` run fits them in all 1,000 random weightings. The ablation says none of the four
censors is needed. Like Andersen's Emperor, he doesn't have to repress anything to act as he did:
the crowd pays for each move. His four sentences are his account of those moments, not their
cause.

**The one miss is the apology.** At DealBook he said he was sorry, and nothing in the model pays
for an apology. That makes it the most informative line in the run: whatever moved him there
wasn't applause, and isn't in the model. In the same interview he told the advertisers who'd left
to go fuck themselves, so the apology and the defiance arrived together.

**The record can't say whether he knows.** Two runs: `doesnt-know` (his traits re-file each deed)
and `knows-and-agrees` (nothing to re-file). Both fit the same 8 of 9. That's not evasion; it's
the result. Intent isn't in the record, so we don't claim it. [`disputes.yml`](disputes.yml) says
what evidence would settle it.

**His crowd** ([`crowd/`](crowd/)) is the kit's follower archetypes on his real record. They pass
the same tests as on the fictional one: the loyal friend and the fan leave at the chatbot; the
crusader and the convert stay, need no censor, and act identically. The difference between them
is only whether they know what they're defending.

## The ADL, a cover from the wild

The kit's `awkward-gesture` part re-files a gesture as clumsiness, so a follower doesn't have to
know what he saw. It was written as a template line for followers. Then it turned up in the real
record, word for word, from the last place you'd expect: the Anti-Defamation League, whose job is
recognizing antisemitism. On 20 January 2025 the ADL posted:

> "It seems that @elonmusk made an awkward gesture in a moment of enthusiasm, not a Nazi salute,
> but again, we appreciate that people are on edge."

That is a suppressor's re-filing in an institution's voice. The ADL saw the same video as
everyone else and offered the frame that makes it harmless.

Three days later Musk posted his puns: "Don't say Hess to Nazi accusations! Some people will
Goebbels anything down!" Minsky's Memo 603 says jokes are how censors get exposed: a joke makes a
forbidden connection visible, so you can't keep not-seeing it. The puns did exactly that to the
ADL's frame. You don't make Himmler puns about an accidental wave. By joking about the Nazi
reading, Musk showed he knew exactly what people saw in the gesture, and chose to make it
funny. The "awkward" story had nowhere left to stand. The ADL's CEO, Jonathan Greenblatt, wrote: "@elonmusk, the Holocaust is not
a joke."

In the kit that's the fan's counterfactual, `a-friend-asks`: a joke exposes `awkward-gesture`.
The twist is who told it. A friend's joke exposes a censor by accident. Here the figure himself
told the joke, to his own audience, and the watchdog's tone changed. In the model, the same puns
install a censor in his crowd instead (`cant-take-a-joke`). Humor trains censors both ways, and it depends
on who's laughing.

The ADL condemned the jokes. Whether it ever withdrew "awkward gesture" isn't in our sources yet.

## Changing this model

He's welcome to change it, like anyone in this repo. He can add his own words, contest a
hypothesis, add context, or ask for it to be deleted. Contact Don Hopkins through public channels,
or open an issue on [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).

- **Hypotheses are open to argument.** If a censor or a weight is wrong, delete it and run `test`.
  If the record still fits, the tool will say the part was a guess.
- **Facts change with evidence.** Show a factual mistake, with evidence and citations, and we'll
  correct it and log the correction in [`disputes.yml`](disputes.yml).
- **Denials don't change the record.** Neither does a Gish gallop. Both are logged in
  `disputes.yml` beside the record, with whatever sources they came with, and readers can compare.

# Questions for Will — the depth files

*One file per game. Questions that only Will can answer well, each grounded in a
specific mechanism and kept next to the reason we care.*

[Portrayal standards](../../../schemas/portrayal-standards.md) ·
[ideas.md](../ideas.md) is the menu; this directory is the depth ·
sibling convention: [`ask-david.md`](../../david-ungar/korz/ask-david.md)

## Why this exists

`ideas.md` is a **menu of show hooks** — fifteen numbered lanes, each a segment
someone could build. It works because it stays skimmable, and it stops working
the moment any lane acquires ten sub-questions about creature-part stat
aggregation.

So the split is:

| File | Holds | Grows by |
|---|---|---|
| [`../ideas.md`](../ideas.md) | show lanes, one paragraph each | adding a lane |
| this directory | mechanism questions, per game | adding a question to a game file |

A hook in `ideas.md` should link here when its depth arrives. Nothing here
should be duplicated up there.

## Files

| File | Game | Where the questions came from |
|---|---|---|
| [`spore.md`](spore.md) | Spore (2008) | the buff/modifier survey in `moollm/skills/buff/buffopedia/systems/spore/` — Spore turned out to have a modifier system at every stage plus one spanning all five |
| [`the-sims.md`](the-sims.md) | The Sims (2000–) | the same survey: Sims 1 got the *behavior* of buffs without ever having the *noun*, and "moodlet" arrives only in Sims 3 |

Not yet written, and deliberately not stubbed: SimCity, SimEarth, SimAnt,
Raid on Bungeling Bay, Proxi. Add a file when there are real questions for it,
not before. Proxi questions currently live in
[`ideas.md` §7](../ideas.md) and should move here if they outgrow it.

## What makes a question good enough to file here

1. **Grounded in a specific mechanism**, nameable in one sentence. "How did
   Spore's alignment work" is not a question; "was the archetype count ever
   larger than ten" is.
2. **A design decision, not a fact lookup.** If a wiki answers it, it is
   research, not a question for Will. Do the research first and ask about the
   *choice*.
3. **Carries its premise and the premise's confidence.** See below. This is the
   rule that keeps the file usable on air.
4. **Says why we care**, in one line, honestly — usually because MOOLLM or
   Soul City faces the same decision now.
5. **Not leading.** A question that contains its own answer is a statement
   wearing a costume, and Will will notice.

## The premise rule

Every question rests on a claim about how the game worked. Those claims are
**ours**, assembled from documentation, play, and the survey work — not Will's,
and some are shaky. So each question carries:

- **PREMISE** — what we believe the mechanism was
- **CONFIDENCE** — verified · high · medium · low
- **THE QUESTION** — phrased so that a wrong premise costs nothing

A low-confidence premise gets phrased as a check, not an assertion: *"Our
reading is X — is that even close?"* rather than *"Why did you do X?"* The
second one, when X is wrong, wastes his time and makes the archive look
careless.

This matters more here than in most files, because these questions are designed
to be **planted in characters and shows** — a question with a bad premise baked
in will get repeated by a character months later with nobody remembering where
it came from.

## Planting

These are raw material for:

- **live conversation** — the direct use; bring the file, not the whole menu
- **character seeding** — a character can hold a question as something they
  wonder about, which is how a question becomes a scene instead of an interview
  beat
- **show segments** — a cluster of related questions is often a segment
  structure already

When a question gets planted, note where. When it gets **answered**, that is
the valuable event: move the answer into the relevant source bundle or design
doc and mark the question closed here, with a link. An answered question that
still reads as open will get asked twice.

## Standing rules

- Don's proposed topics. **Not** claims about what Will thinks, and not quotes.
- The show is topic-less by design — Will is the topic. This is a menu, not an
  agenda, and he is free to ignore all of it.
- Consent and portrayal per [portrayal standards](../../../schemas/portrayal-standards.md).
- Cross-repo references are written as repo-qualified paths (`moollm/skills/...`)
  rather than relative links, since the repos are siblings and not nested.

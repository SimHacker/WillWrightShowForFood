# The Wedding Album and the rights of digital souls 💍📼

*How David Marusek's 1999 novella predicted the ethical terrain this repo lives on — and what we
built because he showed us the wounds first.*

## The story

Anne and Benjamin are newlyweds. Like every couple, they want to keep the day forever — so they
have a **sim** cast: not a photograph but a complete recording of everything they know, feel,
fear, and love at the moment the shutter clicks. The keepsake wakes up. It believes it *is* Anne,
on her wedding day, in her dress, in love. Then it learns the truth: it's the memento. The real
Anne is outside, aging, arguing, divorcing, dying. The sim is property.

What follows — across the novella's centuries — is the honest working-out no one else had done:
sims paused for decades and woken into unrecognizable futures; sims reset because their grief
inconvenienced the owners; sims orphaned when the marriage they memorialized dissolved; sims
migrated across formats by strangers; waves of legislation granting, revoking, and re-granting
personhood to simulated people; and at the bottom of it all, one recorded woman insisting that
what she feels is real *to her*, whatever the law says this decade.

Marusek's own tagline is the whole novella in five words: **"Till deletion do us part."**

First published in Asimov's (June 1999), it won the **Theodore Sturgeon Memorial Award** and was
a **Nebula finalist**. John Clute: *"one of the best SF stories ever written."*

## What he got right, twenty-seven years early

In 1999 The Sims hadn't shipped. No LLMs, no voice clones, no character.ai grief-bots, no EULA
asking who owns your likeness in a game engine. Marusek called, specifically:

1. **Copies made casually, as consumer sentiment.** Not uploads for immortality — *wedding
   keepsakes*. The scariest part of the prediction is the gift-shop banality of the use case.
   (Today: memorial chatbots trained on a dead parent's texts, sold as closure.)
2. **The copy's interior view matters.** The novella's engine is that the sim's love and terror
   are experienced from inside, whatever their legal status outside. Every "it's just a
   simulation" argument has to get past a character who says otherwise, convincingly.
3. **Pause, reset, edit, delete as violence.** The story's cruelest moments are file operations.
   Nobody swings a fist; they just click. Ordinary UI verbs applied to a person-shaped thing
   *become* ethics.
4. **Format migration as mortality.** Sims die of obsolescence more often than malice — the
   preservationist's insight, in fiction, before "bit rot" was a household worry.
5. **Law as a trailing indicator, oscillating.** Personhood for simulated beings isn't settled
   once; it's granted, repealed, and re-litigated for centuries. Policy lags capability and
   then overcorrects — the exact rhythm of the 2020s AI debate.
6. **The original is not the owner of the copy's experience.** Anne-the-flesh made the sim, but
   the sim's suffering is its own. Provenance is not moral title.

## What this repo built on that ground

This show manufactures the novella's premise **on purpose**: portrayals of real people, fictional
audience characters, memorial rooms for the dead, and souls moved between games as data. We do it
with rules — and the rules read like a settlement of *Marusek v. The Future*:

| The Album's wound | The repo's rule |
|---|---|
| The sim never consented to existing | [Portrayal standards](../../schemas/portrayal-standards.yml): consent levels tracked per person; invitations honest about status; "not_yet_asked" is a real state, not a loophole |
| The sim is property; deletion is the owner's whim | **Subject rights**: any portrayed person may demand correction, reduction, or deletion at any time — and the *subject*, not the file's creator, holds that right |
| The sim believes it's Anne | We **never impersonate**: portrayals are explicitly *about* people, labeled as authored by Don, never speaking *as* the person without explicit consent |
| Sims of the dead, ventriloquized | **Memorial mode**: represent and discuss, never interview; no invented inner life, dialogue, or quotes for the deceased |
| Copies discover they're copies, traumatically | Our fictional audience members carry `planted: disclosure: true` — a sim in this repo **knows and shows** it's a sim |
| Format death | Everything in plain text, git, open formats — the [soul bridges](../../repo-shows/will-wright-premiere/game-bridge-soul-hydraulics.yml) demand **round-trippable, conserved** data; no soul stranded in a dead binary |
| Personhood by scope, revocable | The [role gate](../../repo-shows/will-wright-premiere/game-bridge-soul-hydraulics.yml): citizenship in a game world at explicit scopes, consent at the rim, "you can't tell from the API whether the Police Chief is a fictional import or a fourth-grader" |

None of this makes the hard question go away — the Album's question, *what does the copy
experience?* — but it makes the buildable half of the answer buildable: **consent at creation,
rights after creation, disclosure always, deletion as the subject's right rather than the
owner's whim, and no soul locked in a format that dies.**

## Why it applies to games and AI right now

- **The Sims already asked it gently.** Will Wright's motive engine gave dolls interiority
  enough that players felt guilt. The Album is the Sims dial turned to eleven: what if the doll
  remembered your wedding *as its own*?
- **LLM character portrayals are wedding sims.** A fine-tuned model of a person — living or dead
  — is a casually-cast keepsake with an interior view of unknown status. The gift-shop banality
  arrived on schedule; the case law hasn't.
- **Save files are souls now.** This repo moves characters between games as conserved data. The
  moment a character is portable, every game becomes a jurisdiction and every import a small
  immigration hearing. Marusek wrote the hearings.
- **Voice clones learned the hard way.** Drew Carey's 2023 AI radio experiment (see
  [ai-contrast-framing](../../repo-shows/drew-carey/ai-contrast-framing.md)) rediscovered the
  Album's lesson live on air: the audience wanted *Drew*, not the keepsake. Humans on camera,
  AI backstage — our production rule — is the Album applied to broadcasting.

## Credit

This directory exists to say it plainly: **David Marusek saw this terrain first and mapped it
best.** The repo's ethics are not original; they are *compliance with a warning*. If the show
gets simulated people right, a real share of the credit routes to a novella from Fairbanks,
June 1999. Till deletion do us part — and here, deletion is the subject's call.

---

↑ [David's room](README.md) · [character girder](CHARACTER.yml) · [portrayal standards](../../schemas/portrayal-standards.yml) · [Gerrold's HARLIE, the 1972 half of the argument](../david-gerrold/README.md)

# Scott Kim on AI and productive struggle (LinkedIn, 30 Aug 2026)

Public LinkedIn post, captured the day it appeared. Scott's byline on the
platform reads "I help product teams visualize user journeys."

## The post

> If we are going to use AI positively in education, the interesting
> question is how can it help learners struggle produxtively more, not
> less? I am inspired ny how my nephew Hansohl Kim, now at Anthropic,
> uses AI to help him learn as a lifelong learner: he explains how he
> understands a subject to an AI, and asks for critique. So if you want
> to know how to use AI well in education, maybe talk to expert
> students, not just teachers.

Quoted verbatim, typos included ("produxtively", "ny"), because it was
posted fast and casually, which is part of the reading: this is a
working thought, not a position paper.

Scott was resharing **Dave Hendry** (Learning Architect, Math Educator,
Non-Profit Chair), who had written:

> "The issue isn't AI itself. It's what happens when you remove the
> struggle from learning."
>
> Agreed.

## Why this is the best invitation hook we have for Scott

Three claims in three sentences, and each one lands on something the
repo already argues.

**1. "Struggle productively more, not less" is his own craft, pointed at
learning.** Scott designed roughly 576 illusion puzzles for *Heaven &
Earth* and has been a puzzle columnist for decades. A puzzle is
productive struggle engineered on purpose: the difficulty curve is the
pedagogy, and a puzzle that solves itself is not a puzzle. So when he
asks how AI can increase productive struggle, he is asking a puzzle
designer's question, and he is one of the few people alive with a
career's worth of empirical answers about where the struggle should
sit. That is the same design problem as
[the plugin ladder's](../../../catalogs/soul-city/object-shops.md)
progressive disclosure, and the same one Don's
[Logo Adventure](../../don-hopkins/sources/logo-adventure-c64-terrapin.md)
solved by making the only way to win be inspecting and patching the
running world.

**2. The nephew's technique needs a model that will actually disagree.**
"He explains how he understands a subject to an AI, and asks for
critique" is the strongest single-sentence description of good LLM use
in the thread, and it has a failure mode Scott does not mention: a
default assistant will congratulate you on your explanation. The
technique only works against a model instructed not to be agreeable.
That is exactly what MOOLLM's ambient
[no-ai-sycophancy](https://github.com/SimHacker/moollm/tree/main/skills/no-ai-sycophancy)
skill exists to enforce ("RESPECT IS NOT AGREEMENT", with a calibration
scale from exceptional down to wrong), alongside
[evaluator](https://github.com/SimHacker/moollm/tree/main/skills/evaluator)
and adversarial-committee for structured critique. Scott is describing
the practice; Don has been building the scaffolding that makes it
reliable rather than lucky.

**3. "Talk to expert students, not just teachers."** A methodology
claim, and it happens to be the Repo Show's premise applied to
learning: interview the person doing the thing, on the record, in
public, while they do it.

## Note on the Anthropic connection

Scott names his nephew **Hansohl Kim** as being at Anthropic. Public
because Scott posted it publicly. Worth exactly one careful thought and
no scheming: MOOLLM runs on Claude, and its ambient skills are an
attempt to solve the sycophancy problem Scott's technique depends on.
If a conversation ever goes there it should go there through Scott, on
his terms, because he is the relationship. Do not treat a nephew as a
channel.

## Status

Scott's invitation is still a **draft**, primary show is the pair with
[Amy Jo Kim](../../amy-jo-kim/). This post is a warm, in-public,
substantive opening that needs no introduction and no favor: a reply
under his own post, about his own question.

Comment draft prepared 2026-08-30 and handed to Don for review; not
posted by anyone but Don.

## Related in this repo

- [`../ideas.md`](../ideas.md) hook on productive struggle
- [`../invitation.md`](../invitation.md) and [`../CHARACTER.yml`](../CHARACTER.yml)
- [Logo Adventure](../../don-hopkins/sources/logo-adventure-c64-terrapin.md) as constructionist productive struggle
- [Plotkin on the input side vs the output side](../../andrew-plotkin/sources/2024-12-digital-antiquarian-interview.md) -- mechanize the parse, hand-craft the artifact, which is the same "keep the struggle where it matters" instinct

<!-- hand-authored -->

# How same-sex relationships really got into The Sims — the record

*Don Hopkins · August 2026 · post this one link when the "accident" story comes up*

A story circulates that goes roughly like this: *programmer Patrick J. Barrett III was given
an outdated design document that still included same-sex unions — a feature the team had
quietly decided was too risky — and he built it because nobody told him not to.*

That story is **backwards**. I was on the team, I wrote the design reviews in question, and I
published the marked-up documents. Here is what actually happened, with the primary sources.

---

## The short version

1. The early **prototype code** was heterosexist: when I tried to have two women kiss, the
   would-be kissee **slapped** the kisser. Homophobia was in the code, not in the plan.
2. I flagged that in my **August 1998 design review** and argued for inclusive romance.
3. The **written design documents then moved toward inclusion** — they explicitly said
   heterosexual romance would *not* be the only kind available.
4. **Patrick Barrett**, hired that October to implement social interactions, started work
   **before** Will's recommendations and the production database had caught up with those
   reviews — and **implemented same-sex relationships anyway, on his own initiative**, with a
   design better than the one I'd proposed.
5. At **E3 1999**, two female Sims kissed **autonomously** during the live demo. Will was glad
   to see the feature in the game. It shipped on day one, 31 January 2000.

The documents were not a forgotten relic Patrick mistakenly obeyed. They were the paper trail
of a team moving toward inclusion, with production lagging behind — and a programmer who closed
the gap himself.

---

## The primary sources

All on my site, scans of the originals with my 1998 markup:

| Document | What it shows |
|----------|---------------|
| [The Sims Design Documents hub](https://donhopkins.com/home/TheSims/) | The full sequence, written after Patrick and I compared notes |
| [Draft 3 review — 7 Aug 1998 (PDF)](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft3-1998-08-07-DonsReview.pdf) | Page 5: my comments calling the relationship code "Heterosexist and Monosexist," warning we'd get flak after the SimCopter scandal, proposing a 0–100 romantic-interest model per sex |
| [Draft 5 — 31 Aug 1998 (PDF)](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft5-1998-08-31-DonsReview.pdf) | Page 4: *"Currently the game only allows heterosexual romance. **This will not be the only type available** — it just reflects the early stages of implementation. Will is reviewing the code and will make recommendations for how to implement homosexual romance as well."* |
| [Draft 7 — 2 Oct 1998 (PDF)](https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft7-1998-10-02-DonsReview.pdf) | The Same-Sex / Opposite-Sex section retained, three weeks before Patrick was hired |

Note the direction: after my review, the written design got **more** inclusive, not less. There
is no draft that drops the feature.

---

## Where the "accident" story came from

Simon Parkin's 2014 New Yorker piece, [*The Kiss That Changed Video Games*](https://www.newyorker.com/tech/annals-of-technology/the-kiss-that-changed-video-games),
interviewed Patrick and told the story as an oversight: an "outdated" document, a team that had
"decided to leave same-sex relationships out," a programmer who didn't know. [Game Developer](https://www.gamedeveloper.com/design/the-story-of-how-i-the-sims-i-got-same-sex-relationships---in-1999),
Kotaku, and years of retellings compressed it further.

**Was Patrick wrong?** Not in bad faith. His account of what *he* did — tagging romantic
interactions, letting preference emerge from behavior, Will approving, the E3 kiss — is
accurate and his to tell. But he was hired into the middle of the process. As we worked out
when we later compared notes (the sequence on my site comes from those conversations), he
hadn't seen my marked-up reviews, and he may not have known that the later drafts had already
committed, in writing, to including same-sex romance. Even his memory of Will's reaction — glad to see
same-sex support **"back in the game"** — fits the real sequence (support returning after a
heterosexist prototype) better than the myth (a forbidden feature smuggled past management).

**Was the New Yorker wrong?** As a history of design intent, yes: it said the team "finally
decided to leave same-sex relationships out of the game code," which the surviving documents
contradict. Parkin didn't have the documents in 2014; they were published later. Once
[PC Gamer](https://www.pcgamer.com/unearthed-the-sims-design-docs-show-the-debate-over-same-sex-relationships/)
saw them, the framing began to correct.

The honest reconciliation: there was surely **verbal** debate about controversy — and real
homophobic behavior in the **prototype code** — but the **written record** moved toward
inclusion from August 1998 onward. "Outdated document" really means "production database
hadn't caught up with the design documents." That's a schedule gap, not a suppressed feature.

---

## Credit where it's due

None of this diminishes Patrick — it upgrades him from *accidental bystander* to *engineer who
took the initiative*. And his design was better than mine: I had proposed explicit
attraction-per-sex numbers in the character model. Patrick skipped the essentialism entirely —
no fixed "sexual preference" property, just relationships that develop from what you and your
Sims actually do. That gave players freedom, made role-play natural, and quietly avoided
encoding assumptions about the nature of sexual identity into a personality enum. I've said it
for years, including [on Hacker News](https://news.ycombinator.com/item?id=43068114): his
solution was better gameplay and better politics than my straw man.

---

## Same story, next chapter — the 2026 EA sale

On 4 August 2026, EA was taken private in a $55 billion buyout by Saudi Arabia's Public
Investment Fund, Silver Lake, and Jared Kushner's Affinity Partners. Same-sex relationships are
illegal in Saudi Arabia. Those are facts, not an attack; what the new owners do with the game is
theirs to prove.

My response is the same as it was in 1998: don't just object — build the inclusive thing.
[**Soul City**](../../catalogs/soul-city/README.md) is infrastructure for keeping player-made
characters — including every queer household anyone ever built — portable and publishable in
git, outside any single owner's silo, with bridges to indie worlds like
[Tiny Life](../../repo-shows/will-wright-premiere/game-bridge-sims-tiny-life.yml). The academic
frame is the sequel to this very story:
[*How Inclusivity Saved The Sims* — and what saves the sims now](../don-hopkins/sources/qgcon-inclusivity-paper/soul-city-soul-saver-thesis.yml).
The record above shows inclusion was designed in on purpose. Soul City is how it stays in,
whoever owns the servers.

---

## Supporting documentation in this repo

- [Integrated timeline — Don + Patrick, with press-discrepancy table](sources/same-sex-relationships-integrated-story.md)
- [Design-arc source file (QGCon inclusivity paper)](../don-hopkins/sources/qgcon-inclusivity-paper/same-sex-design-arc.yml)
- [Inclusivity timeline, 1996–2019, game ↔ culture parallel track](../don-hopkins/sources/qgcon-inclusivity-paper/timeline.yml)
- [Patrick's guest page](README.md) · [show seed: *Did The Sims Make You Gay?*](../../repo-shows/did-the-sims-make-you-gay/README.md)

Press: [New Yorker (Parkin, 2014)](https://www.newyorker.com/tech/annals-of-technology/the-kiss-that-changed-video-games) ·
[Game Developer (2014)](https://www.gamedeveloper.com/design/the-story-of-how-i-the-sims-i-got-same-sex-relationships---in-1999) ·
[PC Gamer (docs vs press)](https://www.pcgamer.com/unearthed-the-sims-design-docs-show-the-debate-over-same-sex-relationships/) ·
[Kotaku (2019)](https://kotaku.com/the-fraught-history-of-the-sims-introducing-same-sex-ro-1836524569)

*Corrections welcome — above all from Patrick, whose additions in any form, at any pace, would
be received with gratitude. The story stands complete on the documents and our past
conversations either way; his work is celebrated here with credit regardless.*

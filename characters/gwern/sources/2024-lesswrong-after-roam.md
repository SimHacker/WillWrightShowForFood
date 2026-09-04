# Gwern on what comes after Roam (LessWrong, 2024)

**Comment:** <https://www.lesswrong.com/posts/CoqFpaorNHsWxRzvz/what-comes-after-roam-s-renaissance?commentId=M3qHiKqx48KhWYv5Y>
**On:** "What comes after Roam's renaissance?" by Itay Dreyfus, 12 May 2024 (linkpost for productidentity.co)

The top comment on the post, and the clearest statement of the thesis that reappears as footnote 174
of the Xanadu essay a year later
([`2025-xanadu-even-more-hindsight.md`](2025-xanadu-even-more-hindsight.md)).

## The diagnosis

On the cost side, personal knowledge management systems ask for a large deposit against a payoff
most users will never collect:

> any note-taking, personal knowledge management, or personal wiki system is inherently limited by
> the fact that they require a lot of work for what is, for most people, little gain. For most
> people, trying to track all of this stuff is as useful as exact itemized grocery store receipts
> from 5 years ago.

The Zettelkasten test:

> This is what people always miss about Zettelkasten: are you writing a book? Are you a historian or
> German scholar? Do you publish a dozen papers a year? No? Then why do you think you need a
> Zettelkasten?

The payoff, when it exists, is a long-tail bet: you enter references knowing most will never be
used, and the value comes from the few plus the serendipity of periodically looking them over. No
long tail, no benefit.

Then the sharpest paragraph, and the one that indicts every outliner:

> Further, these systems are inherently **passive**, and force people to become secretaries,
> typists, reference librarians, archivists, & writers simply to keep it from rotting (quite aside
> from any mere software issue), to keep it up to date, revise tenses or references, fix spelling
> errors, deal with link rot, and so on. (Surprisingly, most people do not find that enjoyable.)
> **There is no intelligence in such systems, and they don't do anything.** The user still has to do
> all the thinking, and it adds on a lot of thinking overhead.

## The prescription

> So what comes after Roam and other personal systems which force the user to do all the thinking? I
> should think that would be obvious: **systems which can think for the user instead.** LLMs and
> other contemporary AI are wildly underused in the personal system space right now, and can
> potentially fix a lot of these issues, through approaches like **actively surfacing connections**
> instead of passively waiting for the user to make them on their own and manually record them, and
> can **proactively suggest edits & updates & fixes that the user simply approves in batches.**
> (Think of how much easier it is to copyedit a document using a spellcheck as a series of Y/N
> semi-automatic edits, than to go through it by eye, fixing typos.)

And the warning against retrofits:

> like most such paradigm shifts, it will be hard to tack it onto existing systems. You can't reap
> the full benefits of LLMs with some tweaks like 'let's embed documents and add a little retrieval
> pane!'. You need to **rethink the entire system and rewrite it from the ground up on the basis of
> making neural nets do as much as possible**, to figure out the new capabilities and design
> patterns, and what to drop from the old obsolete personal wikis like Roam.
>
> ... It seems like if one wanted to do that, it would be better to start with a clean sheet (and an
> empty cap table).

He also flags Fernando Borretti's 2022 "Unbundling Tools for Thought" as making similar points at
greater length, and largely agrees with it.

## Where this lands in MOOLLM

| Gwern's complaint | The MOOLLM answer |
|---|---|
| Systems are **passive** | Rooms, skills, and ambient agents that act when entered |
| No intelligence in the system | The LLM *is* the runtime, not a retrieval pane bolted on |
| Users become unpaid archivists | Sister-script and cursor-mirror do the archiving |
| Author must build the whole hierarchy | Summary pyramids generated on demand, in context |
| Link rot, stale references | Git provenance plus local archive mirrors |
| Y/N batch approval of proposed edits | Diff review — already the native git idiom |
| "Start with a clean sheet" | MOOLLM was not retrofitted onto a wiki |

The `2y` LessWrong thread also contains a small piece of evidence for the thesis: `sarahconstantin`,
a heavy daily Roam user who defended it at length in 2024, posts seven months before this writing
that she has replaced her private Roam with a Claude-Code-generated app — "a natural-language-
queryable, endlessly reconfigurable interface? yes please."

And `TsviBT`'s objection, worth keeping honest: if you want to improve *thinking* rather than
snippet management, "you have to watch thinking think" — build from observed cognition, not from
cool-sounding features. That is a fair charge to answer, not dodge.

↑ [sources](README.md) · [`../ideas.md`](../ideas.md)

# A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar (2014)

Primary source bundle for Don Hopkins's planned async follow-up article (Aug 2026).
Charles Torre interview — shared memory vs message passing, locks, actors, and where those
ideas came from.

## Video and mirrors

| Mirror | URL |
|--------|-----|
| **ISO C++ blog post** (Sep 2014) | https://isocpp.org/blog/2014/09/stroustrup-hewitt-ungar |
| **Channel 9** (Charles Torre) | https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar |
| **Wayback** (Channel 9, Apr 2015) | https://web.archive.org/web/20150403234147/https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar |
| **Don's mirror** (LangNEXT panel clip) | https://donhopkins.com/home/movies/BjarneCarlDaveLangNEXT_mid.mp4 |
| **Reddit** (r/cpp, 2014) | https://www.reddit.com/r/cpp/comments/2gl7th/a_conversation_with_bjarne_stroustrup_carl_hewitt/ |

## Contemporary reception

| Source | What |
|--------|------|
| **[Bulldozer00 review](2014-stroustrup-hewitt-ungar-bulldozer00-review.md)** (22 Oct 2014) | Anthony DaSilva Jr — watched 3×, commute MP3; lay summary of Hewitt / Ungar / Stroustrup multicore positions · [original post](https://bulldozer00.blog/2014/10/22/a-fascinating-conversation/) |
| **Don's HN comment** (Nov 2022) | Seymour Papert thread — *"fascinating (and polite, respectful) argument about shared memory, message passing, locks, synchronization, and lock free message passing!"* — [`hn-self-1989-selfishscript-45706924.md`](hn-self-1989-selfishscript-45706924.md) |

### Three positions (Bulldozer00 checksum)

| Speaker | 2014 summary |
|---------|----------------|
| **Hewitt** | Revolutionary actor languages; abandon Von Neumann — current languages won't scale with cores |
| **Ungar** | Incoherent unsynchronized memory + background cache error correction — reliable from unreliable parts |
| **Stroustrup** | Revolutions are rare; layered libraries hiding locks (C++ threads → tasks → *next?*) |

Full digest + async questions for David: [`2014-stroustrup-hewitt-ungar-bulldozer00-review.md`](2014-stroustrup-hewitt-ungar-bulldozer00-review.md)

## Participants

| Person | Repo room | Notes |
|--------|-----------|-------|
| **David Ungar** | [`../`](../README.md) | Self — prototypes, simplicity, adaptive JIT |
| **Carl Hewitt** | [`../../carl-hewitt/`](../../carl-hewitt/README.md) | Actor model (memorial 🕯️ 1944–2022) |
| **Bjarne Stroustrup** | — (no character room yet) | C++ — value vs pointer semantics, systems pragmatism |

## Topics worth revisiting (2026)

Don's pitch (Aug 2026): technology makes many 2014 arguments worth **re-evaluating** — actors vs
shared memory, lock-free message passing, prototype OO vs class-based C++, and the **people who
inspired them** (the "where did the great ideas come from?" thread in the talk).

Cross-links in this repo:

- [Live objects trail](../../../process/trails/live-objects.md) — Smalltalk → Self → live systems
- [Ken Kahn](../../ken-kahn/README.md) — Hewitt PhD advisor; actor-model animated films (1979)
- [Alan Kay on Hewitt](../../alan-kay/media/discussions/malleable-systems-systems-vs-data.md) — messaging neighborhood
- [Will Wright — revisit weird ideas](https://youtu.be/ofA6YWVTURU?t=3657) — Don's framing quote for why old arguments deserve another pass ([full source bundle](../../will-wright/sources/2005-03-11-spore-gdc-future-of-content/README.md))

## Planned follow-up (async)

Don proposes (Aug 2026 email to Ungar):

1. Re-listen to the talk (Don associates different city bike routes with different segments).
2. Write comments and questions; email to David — **answer any you choose, on your schedule**.
3. Don drafts a **deep article** — what was said in 2014 + what they discuss afterward.
4. Optional: Carl Hewitt (memorial — discussants / estate TBD) and Bjarne Stroustrup chime in.
5. Don will **upload a clean mirror to YouTube** with transcription for accessibility.

Format fits [TicketPR / written Q&A](../../../process/repo-show-format.md#ticketpr) — no new video
required from David unless he wants one.

**Same conference:** [Korz — Dancing with Symmetry](2014-lang-next-korz-dancing-with-symmetry.md) ([Microsoft Learn](https://learn.microsoft.com/en-us/shows/lang-next-2014/dancing-symmetry-to-harness-power-of-complexity-subjective-programming-in-context))

See: [`2014-async-revisits-index.md`](2014-async-revisits-index.md) ·
[`2026-08-correspondence-facetime-and-async-pitch.md`](2026-08-correspondence-facetime-and-async-pitch.md) ·
[`2026-08-stroustrup-hewitt-followup-article-scaffold.md`](2026-08-stroustrup-hewitt-followup-article-scaffold.md) ·
[`2026-08-korz-dancing-with-symmetry-article-scaffold.md`](2026-08-korz-dancing-with-symmetry-article-scaffold.md)

↑ [sources](README.md) · [character](../README.md)

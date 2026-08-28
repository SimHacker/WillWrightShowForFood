# A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar

https://www.youtube.com/watch?v=52o5FPymtD0

Lang.NEXT 2014. Host: **Charles Torre**. Don's YouTube mirror, uploaded 26 Aug 2026
(processing when first posted). Channel 9 original is gone; this is the watch copy.

Published description (YouTube):

> "A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar" is a classic 2014 technical panel discussion hosted by Charles Torre that brings together three prominent computer scientists to discuss programming language design, concurrency, and computing models.
>
> **Overview of Participants**
>
> **Bjarne Stroustrup:** Creator of the C++ programming language.
> **Carl Hewitt:** Creator of the Actor model for concurrent computation.
> **Dave Ungar:** Co-designer of the Self programming language and expert in object-oriented systems and garbage collection.
>
> **Key Themes**
>
> **Concurrency and Parallelism:** The panel explores how modern hardware shifts require rethinking traditional locks and shared-state programming.
> **Actor Model vs. Traditional Models:** Carl Hewitt’s Actor model is contrasted with other approaches to managing concurrent execution safely.
> **Language Evolution:** The discussion reflects on the design trade-offs, historical context, and future direction of programming languages.

ISO C++ blog, 23 Sep 2014: [isocpp.org/blog/2014/09/stroustrup-hewitt-ungar](https://isocpp.org/blog/2014/09/stroustrup-hewitt-ungar)

---

## Transcript

*(Paste here when YouTube captions / Don's transcript land.)*

---

## Who is in the room

| | Room | Notes |
|---|---|---|
| **Dave Ungar** | [this room](../README.md) | Self — prototypes, simplicity, adaptive JIT |
| **Carl Hewitt** | [`../../carl-hewitt/`](../../carl-hewitt/README.md) | Actor model — memorial 🕯️ 1944–2022 |
| **Bjarne Stroustrup** | — | C++ — no character room yet |
| **Charles Torre** | — | Host; Channel 9 |

## Mirrors

| | URL |
|---|---|
| **Watch (YouTube)** | https://www.youtube.com/watch?v=52o5FPymtD0 |
| ISO C++ blog (23 Sep 2014) | https://isocpp.org/blog/2014/09/stroustrup-hewitt-ungar |
| Channel 9 (dead) | https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar |
| Wayback (Apr 2015) | https://web.archive.org/web/20150403234147/https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar |
| Don's mp4 | https://donhopkins.com/home/movies/BjarneCarlDaveLangNEXT_mid.mp4 |
| Reddit r/cpp (2014) | https://www.reddit.com/r/cpp/comments/2gl7th/a_conversation_with_bjarne_stroustrup_carl_hewitt/ |

## Don on HN — as posted

[33527561](https://news.ycombinator.com/item?id=33527561), 9 Nov 2022, on
[The influence of Self](https://news.ycombinator.com/item?id=33502897). Also
linked from [45707646](https://news.ycombinator.com/item?id=45707646) (1989 Self
implementation paper).

```
A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar

https://web.archive.org/web/20150403234147/https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar

https://donhopkins.com/home/movies/BjarneCarlDaveLangNEXT_mid.mp4

They have a fascinating (and polite, respectful) argument about shared memory, message passing, locks, synchronization, and lock free message passing!
```

Wayback URL as posted sometimes used `20150428011217` / `http://channel9.m…` —
same Channel 9 page. The mp4 path as posted used an underscore-truncated
`BjarneCarlDaveLangNEXT_mi…`. Full URLs above.

## Three positions (2014 checksum)

Anthony DaSilva Jr watched it three times in 2014
([full digest](2014-stroustrup-hewitt-ungar-bulldozer00-review.md) ·
[original](https://bulldozer00.blog/2014/10/22/a-fascinating-conversation/)):

| Speaker | As summarized then |
|---|---|
| **Hewitt** | Revolutionary actor languages; abandon Von Neumann — current languages won't scale with cores |
| **Ungar** | Incoherent unsynchronized memory + background cache error correction — reliable from unreliable parts |
| **Stroustrup** | Revolutions are rare; layered libraries hiding locks (C++ threads → tasks → *next?*) |

## Same conference

[Korz — Dancing with Symmetry](2014-lang-next-korz-dancing-with-symmetry.md)
([Microsoft Learn](https://learn.microsoft.com/en-us/shows/lang-next-2014/dancing-symmetry-to-harness-power-of-complexity-subjective-programming-in-context))

Async revisit (TicketPR, no new video from David required):
[2014-async-revisits-index.md](2014-async-revisits-index.md) ·
[article scaffold](2026-08-stroustrup-hewitt-followup-article-scaffold.md)

↑ [sources](README.md) · [character](../README.md)

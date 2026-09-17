# Udanax: what was released, who wrote it, and what is still unsettled

A worksheet, not a history. Everything here is either cited or explicitly marked as memory, so that
Roger Gregory can **correct a table instead of reconstructing a story**. Where a line is wrong, the
fix is a commit with his name on it.

## Timeline, as publicly documented

| When | What | Source |
|------|------|--------|
| 1970s | Gregory founds the **Ann Arbor Computer Club** while studying mathematics at Michigan | [Wikipedia](https://en.wikipedia.org/wiki/Roger_Gregory_(programmer)) |
| 1974 | Meets Ted Nelson, author of *Computer Lib / Dream Machines* | [Wikipedia](https://en.wikipedia.org/wiki/Roger_Gregory_(programmer)) |
| 1979 | The **Swarthmore Summer** — Nelson, Gregory, Stuart Greene, Mark Miller. Gregory and Miller design **tumblers**: transfinite-number addresses naming any range of any version | [Project Xanadu](https://en.wikipedia.org/wiki/Project_Xanadu) |
| 1983 | Nelson meets John Walker at the Hackers Conference; Autodesk backing follows | [Project Xanadu](https://en.wikipedia.org/wiki/Project_Xanadu) |
| 1988 | The team moves to Sausalito; Autodesk buys a controlling interest | Denise Caruso, *SF Examiner*, Apr 1988, quoting Gregory on the rumours about the buyer (cited by [Wikipedia](https://en.wikipedia.org/wiki/Roger_Gregory_(programmer)); her archive copy of the column is currently dead) |
| Autodesk years | A version **in C**, led by Gregory, is completed and demonstrated at the Hackers Conference. Programmers hired from Xerox PARC then argue for a **rewrite in Smalltalk**, splitting the group and blowing the Autodesk deadline | [Project Xanadu](https://en.wikipedia.org/wiki/Project_Xanadu) |
| Aug 1992 | Autodesk divests; the group becomes the **Xanadu Operating Company**. Gregory later serves as founder, CEO, CTO and chairman | [Wikipedia](https://en.wikipedia.org/wiki/Roger_Gregory_(programmer)) |
| Aug 1999 | The code is published as open source at **udanax.com**, in two flavours: **Udanax Green** and **Udanax Gold** | [udanax.com](http://udanax.com/); Don's review, 25–27 Aug 1999 |
| 2001 | US patent 6,212,876 — rotary rocket engine, from Robert Goddard's posthumous patents, Gregory co-designer | [Wikipedia](https://en.wikipedia.org/wiki/Roger_Gregory_(programmer)) |

Wikipedia dates the release decision to **1998** and the release pages to `udanax.xanadu.com`; Don's
contemporaneous correspondence is dated **25–27 August 1999**, days after the announcement. Both may
be right about different events. Which is which is a question for Roger.

## Two codebases, one name

| | **Green** (Xu88) | **Gold** |
|---|---|---|
| Lineage | The earlier system — the one that ran for years and got demonstrated | The later rewrite |
| Language | C, per Wikipedia's account of the Autodesk-era implementation Gregory led | Smalltalk, plus a C++ translation of it |
| Team | Gregory's | The later **XOC** team, including hires from Xerox PARC |
| In the 1999 release | Yes | Yes — and Don's review is overwhelmingly about this half |

**Ted Nelson's correction.** On Hacker News, replying to Don, Ted distinguished Green/Xu88 from Gold
and said the dual Smalltalk/C++ Gold implementation was developed by the later XOC team under
**neither his direction nor Roger's**. That correction is currently held from Don's memory of the
thread; the Hacker News item is not yet located and linked here, which is itself a gap worth closing
before anyone cites this file. Wikipedia's independent account of PARC hires pushing a Smalltalk
rewrite points the same way.

## What Don saw, and when

Two demonstrations, decades apart, that every retelling so far has quietly merged.

**1980s, MIT AI Lab.** Recorded contemporaneously in
[msg 010164](../../gwern/sources/1999-userland-xanadu-thread.md), 27 Aug 1999: a high-school-age Don
on a pilgrimage to the AI Lab sees the Xanadu hypertext demo running on an **Ann Arbor Ambassador**
terminal, and meets **Hugh Daniel** — "this energetic excited big hairy hippie guy in a Xanadu
baseball cap with wings." His 1999 guess in that same post, that this was "presumably the same code
they've finally released," is exactly the conflation at issue.

**Later, at the Xanadu offices.** Don remembers **Roger himself** demonstrating a **Smalltalk**
Xanadu, and thinking Smalltalk was the perfect language for it. Undated, and not written down
anywhere at the time.

If the AI Lab demo was Green and the office demo was Gold, then Don watched the two lineages years
apart and has been describing them as one system ever since. Roger is the person who can say.

## The 1999 charge, and its unanswered question

Don's review, published as five UserLand posts because the board capped a post at about 6K characters
and now [reassembled whole](../../gwern/sources/1999-userland-xanadu-thread.md):

> Sheez. You don't actually believe anybody will be able to do anything useful with all that source
> code, do you? Take a look at the code. It's mostly uncommented glue gluing glue to glue. Nothing
> reusable there.

> Has Xanadu been used to document its own source code? How does it compare to, say, the browseable
> cross-referenced mozilla source code? Or Knuth's classic Literate Programming work with TeX?

Gwern quotes both passages in [*Project Xanadu: Even More
Hindsight*](https://gwern.net/xanadu) — see the
[digest](../../gwern/sources/2025-xanadu-even-more-hindsight.md) — and builds an argument on the
second one: that Xanadu never made itself its own convincing use case. Twenty-seven years later the
question has still not been answered by anyone who was there.

## Open questions for Roger

**Lineage.** Where is Don's account wrong — what did he see at the AI Lab, what did Roger show him at
the offices, and which released tree corresponds to which?

**Self-documentation.** Did anyone ever use Xanadu to hold Xanadu's own source? Was the source
documentation ever published in any form?

**The 1999 release.** What source, licensing and organizational constraints determined what could go
out? Why the machine-generated C++ rather than the readable Smalltalk? Was the **Smalltalk-to-C++
translator** itself ever released, so the original could be read, modified and the C++ regenerated —
or was the expectation that people would work on the generated code?

**Open source.** Ted is reported to be strongly anti-open-source. Is that accurate, what are his
reasons, and does Roger agree? Was secrecy — and the failure to invite outside collaboration — a
major reason Xanadu did not ship? (Don's parallel: NeWS died because Sun promised to make the source
freely available and did not follow through.)

**If you did it again — already done.** This was written as a hypothetical, with Smalltalk-to-C++
again, Smalltalk in the browser on [Vanessa Freudenberg's SqueakJS](../../vanessa-freudenberg/README.md),
and Don's preference — the original translated into **literate TypeScript** in
[Knuth's](../../donald-knuth/README.md) sense, readable and commented and compiling to JavaScript — as
the candidates. Roger's answer, [14 September 2026](2026-09-14-facebook-reply-c-and-rust.md): the
150,000 lines are now **C and Rust, byte identical in output, about 27,000 lines each**, waiting on
Ted. The live questions moved with it — which Smalltalk tree, turned into them by what, byte identical
measured against what, do the tumblers survive without objects, and above all **is either port meant
to be read**, which is the 1999 dogfood question with two more languages on it.

## Artifacts to work from

| Repo | What is in it |
|------|---------------|
| [rfinz/udanax-gold](https://github.com/rfinz/udanax-gold) | Mirror of the Gold **Smalltalk** sources |
| [jonesd/udanax-gold2java](https://github.com/jonesd/udanax-gold2java) | David G. Jones: released Smalltalk and C++, an automatic Smalltalk-to-Java translator, generated Java, some hand-translated classes |
| [sisbell/xanadu-spec](https://github.com/sisbell/xanadu-spec) | A formal specification derived by an agentic AI process from Ted's design and Udanax Green. **Accuracy unvalidated** — reviewing and correcting it in public is the concrete deliverable on offer |
| [udanax.com](http://udanax.com/) | The 1999 release itself |
| Roger's C and Rust ports | ~27,000 lines each, byte identical in output, from the ~150,000 lines of Smalltalk. **Not yet available** — release gated on Ted. [His announcement](2026-09-14-facebook-reply-c-and-rust.md) |

↑ [Roger Gregory](../README.md) · [`CHARACTER.yml`](../CHARACTER.yml) · [invitation](../invitation.md) · [Don's 1999 review](../../gwern/sources/1999-userland-xanadu-thread.md)

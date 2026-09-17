# Roger Gregory

Invitation portrayal — **not** Roger Gregory. [Standards](../../schemas/portrayal-standards.md)

**Field:** Project Xanadu implementation — tumblers (with Mark Miller), the Autodesk-era codebase, Xanadu Operating Company; Ann Arbor Computer Club; rotary rocket engine design

[Invitation](invitation.md) · [**His reply, 14 Sep 2026**](sources/2026-09-14-facebook-reply-c-and-rust.md) · [Ideas](ideas.md) · [Lineage questions](sources/udanax-lineage-questions.md) · [**Don's 1999 Udanax review, whole**](../gwern/sources/1999-userland-xanadu-thread.md)

Ted Nelson wrote the vision. Roger Gregory is one of the people who had to make it run. He met Ted
in 1974, moved to Swarthmore in 1979 for the summer that produced **tumblers** — the
transfinite-number addressing scheme he designed with **Mark Miller**, which is what let Xanadu claim
that any range of any version of any document could be named, quoted and linked — and moved to
Sausalito in 1988 when Autodesk bought a controlling interest and the project finally had money.

**Invited 13 September 2026**, by Facebook message. [`invitation.md`](invitation.md) is that message
rebuilt as a repo document, with every claim, quote and artifact linked instead of pasted.

## He answered the next day, with news

The 150,000 lines of Smalltalk have been turned into **two apps, C and Rust, byte identical in output,
about 27,000 lines each** — "so much fro OO" — and the release is waiting on Ted, not on the code. He
had not yet read the material the invitation pointed at, and said he would.

So the hypothetical at the bottom of the lineage worksheet — *if you did it again, what would you write
it in* — was already answered before it was asked, in two languages nobody here guessed. What survives
the port untouched is Don's 1999 charge, which was never about the language: the released C++ was
unreadable, a generated artifact shipped as the only artifact. Two more translations invite the same
question one language further on, and it is the interesting one to put to him:
**is either of them meant to be read?** The claims, and the seven questions they earn, are in
[`sources/2026-09-14-facebook-reply-c-and-rust.md`](sources/2026-09-14-facebook-reply-c-and-rust.md).

## Why this invitation exists

Three post-mortems of Xanadu are in play, and none of them was written from inside the
implementation:

| Text | Verdict |
|------|---------|
| [Gwern, *Project Xanadu: Even More Hindsight*](https://gwern.net/xanadu) | The grand side-by-side range-transclusion interface was a solution in search of a problem; popups, backlinks, local archives and semantic zoom are what work. [Digest](../gwern/sources/2025-xanadu-even-more-hindsight.md) |
| [Ben Shneiderman on *Computer Lib*](https://eagereyes.org/influences/ben-shneiderman) | High praise for Ted, and a wish that his innovative thinking had connected more closely to practical realities and impact. [In context](../ben-shneiderman/sources/2022-01-13-hyperties-computer-lib.md) |
| [Don's 1999 Udanax review](../gwern/sources/1999-userland-xanadu-thread.md) | The release was machine-generated C++ — "uncommented glue gluing glue to glue" — and Xanadu never used itself to document its own source code. Gwern quotes both charges |

Roger can settle what the outsiders are guessing at: what existed, in what language, in which year.

## The record that needs correcting

Don's account — Xanadu written in Smalltalk, compiled to C++, and the compiler's output released in
1999 — was corrected in public by **Ted Nelson**, who separates the earlier **Green / Xu88** system
from **Gold**, and attributes the dual Smalltalk/C++ Gold implementation to the later XOC team, under
neither his direction nor Roger's. Don also remembers Roger himself demonstrating a Smalltalk Xanadu
at the Xanadu offices, which does not fit the 1980s MIT AI Lab demo recorded in his own 1999 post.

Everything currently believed, with its source and its uncertainty, is laid out in
[`sources/udanax-lineage-questions.md`](sources/udanax-lineage-questions.md) so that Roger can
correct a table rather than reconstruct a history. Corrections land as commits with his name on them.

## Recent turns he has not seen yet — his words, 14 Sep 2026

- [**rfinz/udanax-gold**](https://github.com/rfinz/udanax-gold) — a mirror of the Gold Smalltalk sources.
- [**jonesd/udanax-gold2java**](https://github.com/jonesd/udanax-gold2java) — David G. Jones's released Smalltalk and C++, an automatic Smalltalk-to-Java translator, generated Java, and hand-translated classes.
- [**sisbell/xanadu-spec**](https://github.com/sisbell/xanadu-spec) — a formal specification derived by an agentic AI process from Ted's design and Udanax Green. Accuracy unvalidated; reviewing it with Roger is the concrete first deliverable on the table.

Verifiable sources in [`CHARACTER.yml`](CHARACTER.yml). Subject may correct, expand, replace or
remove this directory at any time, or take direct edit access.

↑ [characters](../README.md) · [Ted Nelson](../ted-nelson/README.md) · [Hugh Daniel](../hugh-daniel/README.md) · [Gwern](../gwern/README.md) · [trail: augmentation and hypertext](../../process/trails/augmentation-and-hypertext.md)

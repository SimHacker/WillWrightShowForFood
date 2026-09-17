---
status: replied
character_id: roger-gregory
public: true
consent: not_addressed
channel: facebook
sent: 2026-09-13
replied: 2026-09-14
reply: sources/2026-09-14-facebook-reply-c-and-rust.md
supersedes: "Facebook message of the same date — this is that letter with the links attached"
---

# Repo Show invitation — Roger Gregory

*Sent as a Facebook message. This is the same letter, rebuilt as a repo document: every quote,
claim and artifact linked rather than pasted, and the 1999 material it argues about
[assembled in one piece](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/sources/1999-userland-xanadu-thread.md)
for the first time since it was published in five fragments.*

*[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md)
— [your directory](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/roger-gregory)
is yours to correct, expand, replace or delete at any time, or to take direct edit access to. Written
answers and audio-only are first-class formats here, not accommodations.*

Hi, Roger!

I would love to hear your perspective on three things: **Gwern's essay about Xanadu**, **Ben
Shneiderman's assessment of *Computer Lib***, and **my own review of the August 1999 Udanax
source-code release**.

If you're willing, I would also love to record, transcribe and publish the discussion as a **Repo
Show** — the format I'm doing with **Will Wright**, creator of SimCity and The Sims, called *Will
Wright Show for Food*. A Repo Show is a living, forkable, runnable GitHub repository;
[what that means](#what-a-repo-show-is) is at the bottom, and
[Will's premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md)
is the working example.

## Gwern

Have you ever read [Gwern's essay about Xanadu](https://gwern.net/xanadu)? Are you familiar with his
body of work and the [gwern.net](https://gwern.net/) site?

He cited the review and comments I wrote about the August 1999 Udanax open-source release, which I
emailed to Dave Winer, who asked me to post them on Scripting News.

**His conclusion:** Xanadu's grand side-by-side range-transclusion interface was a solution in search
of a problem, while practical, use-case-driven features — popups, backlinks, local archives, semantic
zoom — actually work. His own sentence for it, which is worth arguing with directly:

> I would say the flaw of Xanadu's UI was treating transclusion as 'horizontal' and side-by-side and
> assuming that all reading/writing must be done at the lowest raw level of text (motivating the
> 'tumblers' etc.), when it should have been **'vertical' with popups, and 'zooming in' and 'zooming
> out' at different levels of abstraction**.

That is a direct shot at tumblers, from someone who shipped the alternative and documents what he
rejected. You and Mark Miller designed the addressing; I would rather hear you answer him than
paraphrase either of you. My notes on the essay, including both places where he quotes me, are in
[`2025-xanadu-even-more-hindsight.md`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/sources/2025-xanadu-even-more-hindsight.md).

If you haven't explored his website, you should, because its user interface and content-management
system directly answer many of the questions and criticisms he raised about Xanadu — with runnable,
production-quality, open-source code and designs you can read and build on top of in his GitHub
repository. I have written down what I think is worth inheriting from it, in detail, in
[`webtop-gwern-inheritance`](https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance).

## Ben Shneiderman

I recently read [Ben Shneiderman's assessment of *Computer
Lib*](https://eagereyes.org/influences/ben-shneiderman), from his list of the books that were key
influences on his professional and personal life, and his criticism of Ted rings true. It is fair and
well thought out, and I agree with both his high praise of Ted, his books and his other work, and his
wish that Ted would connect himself more closely to the practical realities of the deeply flawed real
web.

I worked on **HyperTIES** in Ben's lab at Maryland, so I have skin in that argument; the mail where I
sent him the whole lineage is
[here](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ben-shneiderman/sources/2022-01-13-hyperties-computer-lib.md),
and he has [a room in this repo](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ben-shneiderman)
too. My 2020 Hacker News post that manually transcluded that exchange is
[item 22176317](https://news.ycombinator.com/item?id=22176317).

## My own opinion, for the record

The world still needs transclusion in the broadest sense, and is headed in the wrong direction —
especially with Musk fucking everything up, and the trend away from long-form writing toward short,
write-only tweets, Truth Social posts and TikTok videos. **Repo Shows are intentionally swimming
against that tide.**

The fact that I have to link, quote, summarize, remix and reformat all this material yet again is
itself an example of why Gwern is right: useful features have to be driven by real use cases, and the
useful form of transclusion is not necessarily Xanadu's famous side-by-side interface.

## The five-post joke, and the one thing this letter can do that Facebook can't

Instead of publishing the whole correspondence once and simply transcluding it in 1999, I had to break
it into **five UserLand posts**, because Scripting News apparently limited each post to about 6K
characters. Sigh.

Maybe if Dave Winer had arbitrarily limited the message size to 140 characters instead of 6K, I would
have been forced to break it into 182 tweets, with personalized ads on each one, and Dave Winer would
have gone on to be the world's first trillionaire instead of Elon Musk. ;)

As a fan of transclusion frustrated by Facebook's and Hacker News's lack of support, I would be remiss
not to link the originals:

**Re: Xanadu — some initial reactions** · Don Hopkins · 8/27/1999; 9:50:10 PM

- <http://static.userland.com/userlanddiscussarchive/msg010163.html>
- <http://static.userland.com/userlanddiscussarchive/msg010164.html>
- <http://static.userland.com/userlanddiscussarchive/msg010165.html>
- <http://static.userland.com/userlanddiscussarchive/msg010166.html>
- <http://static.userland.com/userlanddiscussarchive/msg010167.html>

My [2018 Hacker News post](https://news.ycombinator.com/item?id=16224154) links all five, because
linking was all it could do. It's so frustrating that I couldn't just transclude it all in 2018
either, 19 years after I posted it to Scripting News, right?

So the repo does the thing the platforms won't:
[**all five posts, verbatim, in one document**](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/sources/1999-userland-xanadu-thread.md)
— original spelling, original line breaks, the archive chrome dropped, the header on each part
pointing back at its permalink. That is not transclusion, but it is the honest 2026 approximation:
addressed, attributed, and pointing home. It also means you can read what I actually wrote in 1999
instead of what Gwern quoted from it.

## The question I asked in 1999 that Gwern quoted

> Has Xanadu been used to document its own source code? How does it compare to, say, the browseable
> cross-referenced mozilla source code? Or Knuth's classic Literate Programming work with TeX?

Did you or anyone else ever do anything like that, and have you ever published the Xanadu source-code
documentation in any form?

He also quoted me as saying:

> They originally wrote Xanadu in Smalltalk, then implemented a Smalltalk-to-C++ compiler, and finally
> they released the machine-generated output of that compiler, which was unreadable and practically
> useless. It completely missed the point and purpose of "open source software."

And:

> Sheez. You don't actually believe anybody will be able to do anything useful with all that source
> code, do you? Take a look at the code. It's mostly uncommented glue gluing glue to glue. Nothing
> reusable there.

**However, Ted later corrected my account on Hacker News.** He distinguished the earlier **Green /
Xu88** system from **Gold**, and said the dual Smalltalk/C++ Gold implementation was developed by the
later XOC team, under neither your direction nor his.

Since I remember you demonstrating a Smalltalk Xanadu system to me, I would love to understand the
actual lineage, what I saw, and exactly what was released in 1999. **Where is my recollection or
description wrong?**

I have laid out everything I currently believe, with each claim's source and each gap marked, so that
you can correct a table instead of reconstructing a history:
[**`sources/udanax-lineage-questions.md`**](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/roger-gregory/sources/udanax-lineage-questions.md).
One thing already sticks out from my own 1999 text: it records a demo at the **MIT AI Lab in the
1980s, running on an Ann Arbor Ambassador**, where I first met
[Hugh Daniel](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/hugh-daniel) —
which cannot be the same event as the Smalltalk system I remember you showing me at the Xanadu
offices. I have been describing two demos, decades apart, as one system.

Corrections here work the way
[**prestoration**](https://github.com/SimHacker/moollm/tree/main/designs/prestoration) works
elsewhere in these repos: the original stays byte-for-byte, the correction sits beside it, and every
change is enumerated and attributed. Nothing of yours gets quietly rewritten, and nothing of mine
gets quietly preserved either.

## Questions I'd love to put to you

**Open source.** I've heard that Ted is quite anti-open-source. Is that true, do you agree with him,
and what are his reasons?

**The 1999 release.** What source, licensing and organizational constraints determined what could be
released? Do you regret that the Smalltalk code was not open-sourced earlier?

**Secrecy as cause of death.** Do you think secrecy and the failure to invite outside collaboration
are major reasons we're not communicating via Xanadu and effortlessly transcluding my 27-year-old
quotes, instead of copying and pasting them into a textarea? I certainly think that's the biggest
reason **NeWS** failed — Sun promised to make its source code freely available and refused to follow
through.

**The translator.** Did you ever release the tools developed to translate Smalltalk to C++, so it
would be possible to read and modify the original Smalltalk and regenerate the C++? Or was the
expectation that people would work directly on the machine-generated C++?

**If you did it all over again.** Would you still write it in Smalltalk and translate it to C++? Or
just run it in a browser-based Smalltalk VM like
[Vanessa Freudenberg's SqueakJS](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/vanessa-freudenberg)?

**AI.** Have you thought of using AI to reimplement Xanadu in TypeScript from scratch, or by
translating the original Smalltalk or the derived C++? Or doing it by hand, if you choose to abstain
from AI?

I remember you giving me demos of the Smalltalk system when I visited you at the Xanadu offices decades
ago. I thought it was really cool, and that Smalltalk was the perfect language for it.

## What I think the best version looks like

Translate the original Smalltalk into readable, maintainable, well-commented **literate** code in
[Knuth's](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/donald-knuth) sense:
self-documenting TypeScript that human beings could comprehensibly read and maintain, and that
compiles to JavaScript which runs natively in web browsers.

That is exactly what I was getting at when I asked whether anyone had used Xanadu to document its own
source code. It would be decades before that became possible, and even easy, with AI.

## What already exists to work from

I've now found a mirror of the Udanax Gold Smalltalk source:

- <https://github.com/rfinz/udanax-gold>

And David G. Jones's Udanax Gold-to-Java project, containing released Smalltalk and C++ sources, an
automatic Smalltalk-to-Java translator, generated Java, and some hand-translated classes:

- <https://github.com/jonesd/udanax-gold2java>

Even more remarkably, someone has recently used an agentic AI process to derive a formal specification
from Ted's design and your Udanax Green implementation:

- <https://github.com/sisbell/xanadu-spec>

I have not yet validated how accurate that specification is. **Would you be interested in reviewing it
with me, using it as a starting point, and correcting it in a public repository?** That is the
smallest concrete thing on this entire list, and probably the most valuable: a specification of your
work, corrected by you, in public, with your corrections attributed.

## What a Repo Show is

A Repo Show **is a GitHub repository**. Not a dead clip, deck, post, podcast or video — a living,
forkable, runnable repo that can contain and point to all of those, and much more interestingly:
runnable code. [Format, in detail](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/repo-show-format.md).

The guest isn't handed a topic; **the guest is the topic**, starting from their own work. We talk, then
implement what we talked about in the same repo. You read the repo beforehand and follow along on
whatever rig you like.

Everyone who shows up is a **player**, not an audience member. Questions arrive as issues and pull
requests under the show's `audience/` folder, and the guest can reply and merge them —
[TicketPR](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/ticket-pr.md).

**Why a repo.** Xanadu specified what a medium owes its documents; the web shipped without those
guarantees. Git and GitHub accidentally reconstructed weaker, repository-scoped versions of several
Xanadu properties, because version control could not work otherwise:

- **Content-addressed identities** — within a preserved repository, object IDs name exact, immutable objects.
- **Versions as first-class objects** — the complete retained history stays addressable and diffable.
- **Span addressing** — a permalink pins a commit, path and line range together, so the referenced text does not change underneath it.
- **Per-fragment provenance** — `blame` gives approximate line-level information about who wrote each line, when, and in what change.
- **Links that know both ends** — references among commits, issues and pull requests produce backlinks maintained by GitHub's index rather than by the documents themselves.
- **Inclusion with visible ancestry** — a fork records its parentage, and GitHub renders references to historical fragments with attribution and a link home.

These are partial recoveries with weaker guarantees. Git and GitHub still lack permanent availability
(GitHub's been crashing all the time now that Microsoft runs it), universal identity, live
transclusion, character-level provenance, general two-way links as a document primitive, and
transcopyright.

But despite all its problems, the important thing about GitHub is that it adds a layer of social
networking, plus workflow action automation, and is essentially an industrial-strength massively
multiplayer online role-playing game and collaborative code and content development, validation,
transformation and publishing pipeline.

So **the participation mechanism and the addressing mechanism are one thing**. A Repo Show question can
be an open issue with a full discussion, debate, answers, resolution and closure. Or a pull request —
addressed, attributed, reviewable — and merging it is the document absorbing a reader's contribution
with its provenance intact.

The same argument, run as a checklist against my own system rather than as a pitch, including the
strongest objection to it — that guarantees enforced by an interpreter are exactly the compromise
Xanadu existed to refuse — is
[`XANADU.md`](https://github.com/SimHacker/moollm/blob/main/indexes/XANADU.md). You have better
standing than anyone alive to press that objection, which is precisely why I want to hand it to you.

## Your links

- **Your room:** <https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/roger-gregory>
- **The lineage table to correct:** <https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/roger-gregory/sources/udanax-lineage-questions.md>
- **Conversation hooks:** <https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/roger-gregory/ideas.md>
- **My 1999 review, whole:** <https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/sources/1999-userland-xanadu-thread.md>
- **Gwern's essay, annotated:** <https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/gwern/sources/2025-xanadu-even-more-hindsight.md>
- **Ted Nelson's room:** <https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/ted-nelson>
- **Premiere (Will Wright):** <https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md>

**Zero homework — as much *homefun* as you are up to.**

**Next step:** if this sounds fun, reply with a rough week, or "later," or nothing. Interested,
delayed, declined and no reply are all honored. If you would rather just fix the lineage table and
skip the recording entirely, that is a real answer and I will take it.

— Don Hopkins *(User Interface Flower Child)*

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just
yet.*

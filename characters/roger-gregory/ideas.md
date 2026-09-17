# Ideas to explore with Roger Gregory 🔢

*Conversation hooks — Don's proposed topics, grounded in the public record.
Not quotes from Roger.*
[Portrayal standards](../../schemas/portrayal-standards.md)

The invitation is [`invitation.md`](invitation.md). The homework Don already did, so Roger does not
have to: [`sources/udanax-lineage-questions.md`](sources/udanax-lineage-questions.md). What he said
back: [`sources/2026-09-14-facebook-reply-c-and-rust.md`](sources/2026-09-14-facebook-reply-c-and-rust.md).

## 0. The ports, and whether anyone can read them

Front of the line, because he brought it: the Smalltalk is now C and Rust, byte identical in output,
about 27,000 lines each, unreleased pending Ted. The question that carries the whole conversation is
not which language won but **whether either port is meant to be read** — commented, documented,
modifiable by someone who was not there. That is [hook 5](#5-using-xanadu-to-document-xanadu) and
Don's 1999 charge, arriving twenty-seven years later at exactly the same door.

Underneath it: which Smalltalk tree, turned into them by what means, and what the byte-identical claim
was measured against. That last one is the most reusable thing in the story — an equivalence harness
for Xanadu operations is the artifact a reimplementation needs and nobody has.

And the fight he started with three words. *"So much fro OO"* is a verdict on object orientation from
the man whose group was split by a Smalltalk rewrite, delivered in a repo that also holds
[David Ungar](../david-ungar/README.md). 150,000 lines becoming 27,000 twice is real evidence and a
badly controlled experiment at the same time — different library baselines, generated accessors, dead
code the translation dropped. Two people with standing to argue it, and an artifact to argue over.

## 1. Tumblers, and what addressing costs

He and **Mark Miller** built transfinite-number addresses so that any range of any version of any
document could be named. Gwern's post-mortem argues the arbitrary-range machinery was the wrong bet —
that once you have popups and semantic zoom, "being able to specify arbitrary ranges becomes much
less important, especially as any key ranges can just be hoisted into a higher level." That is a
direct attack on tumblers by the person who shipped the alternative. Roger is the one who can say
what the ranges bought that the summaries do not, and what the addressing scheme cost to implement.

Neighbouring question for the same conversation: **git resolved addressing by giving up on ranges**.
Content-addressed objects name whole blobs; a permalink pins commit, path and line span but is not a
document primitive, and it cannot follow a moved line. Cheap and universal versus exact and hard —
that trade is the whole story of why the weaker system is the one everybody uses.

## 2. Which system did Don actually see

The 1980s AI Lab demo on an Ann Arbor Ambassador, versus the Smalltalk system Roger showed him at
the Xanadu offices. Two lineages, decades apart, blurred together in every retelling — including
Don's own 1999 review, which Gwern now quotes as a primary source. Table to correct in
[`udanax-lineage-questions.md`](sources/udanax-lineage-questions.md).

## 3. What could legally go out in 1999, and why the readable half stayed in

Don's 1999 complaint was aimed at the released artifact — machine-generated C++, "uncommented glue
gluing glue to glue" — and not at the people. The interesting question is not whether the criticism
landed but **what determined the shape of the release**: source ownership after Autodesk, licensing,
who was still around to sign, and whether releasing the Smalltalk was ever on the table. Also whether
the Smalltalk-to-C++ translator could have gone out, which is what would have made the C++ a
*generated* artifact instead of the only artifact.

## 4. Secrecy as a cause of death

Don's parallel case is **NeWS**: Sun promised to make the source freely available, did not follow
through, and the system died with it. The claim to test on Roger is that Xanadu's long silence — and
the failure to invite outside collaboration — is a bigger cause of its non-arrival than any technical
decision. He is also positioned to say whether Ted's reported hostility to open source is accurately
reported, and what the reasoning behind it is.

## 5. Using Xanadu to document Xanadu

Don's 1999 question, quoted by Gwern in 2025, and still unanswered by anyone who was there: was the
system ever turned on its own source code? Ted's answer to
[Knuth's](../donald-knuth/README.md) literate programming, in other words. This is the hook that
connects the historical conversation to a live one, because the reason it was impossible in 1999 is
the reason it is cheap now.

## 6. Reimplementation, and which language deserves it

Three artifacts already exist: [rfinz/udanax-gold](https://github.com/rfinz/udanax-gold),
[jonesd/udanax-gold2java](https://github.com/jonesd/udanax-gold2java), and
[sisbell/xanadu-spec](https://github.com/sisbell/xanadu-spec) — the last of which is an AI-derived
formal specification of Ted's design and Udanax Green whose accuracy nobody has checked. Options
worth arguing about on air:

- **Literate TypeScript** — translate the Smalltalk into readable, commented, maintainable code that compiles to JavaScript and runs in a browser. Don's preferred answer, and the one that finally answers hook 5.
- **Smalltalk, still** — run it in the browser on [SqueakJS](../vanessa-freudenberg/README.md), keeping the language Roger chose.
- **By hand, no AI** — a legitimate choice, and worth hearing defended by someone with standing to defend it.
- **Validate the spec first** — cheapest useful move: Roger reviews `xanadu-spec` against what he built and corrects it in public.

## 7. Xanadu's checklist, run against a repo

MOOLLM's [`XANADU.md`](https://github.com/SimHacker/moollm/blob/main/indexes/XANADU.md) walks the
Xanadu guarantees — two-way links, transclusion, unbreakable addresses, version-aware naming,
intertwingularity — and claims that a language model reading plain files in git satisfies them by
interpretation rather than by plumbing. It also states the strongest objection to itself: guarantees
enforced by an interpreter are exactly the compromise Xanadu existed to refuse. Roger has the best
standing of anyone alive to press that objection, which is the reason to hand it to him.

## 8. Rocket engines

He co-designed a rotary rocket engine from Robert Goddard's posthumous patents (US 6,212,876). It is
not a hypertext topic and it is not filler: recovering a dead inventor's unbuilt design and making it
run is the same move as the one being proposed for the Smalltalk. Worth ten minutes at least.

↑ [Roger Gregory](README.md) · [invitation](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml)

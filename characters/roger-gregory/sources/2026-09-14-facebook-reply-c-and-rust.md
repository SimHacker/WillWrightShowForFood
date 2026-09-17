# Roger replied: the Smalltalk is now C and Rust

*Facebook comment thread, 14 September 2026 — one day after the [invitation](../invitation.md) went
out. Roger's comment is marked edited. **The audience setting of the thread is not recorded here**; if
the post was friends-only, house policy for private messages applies
([the Coco precedent](../../coco-conn/sources/2026-07-06-messenger-reply.md): substance stays,
verbatim text goes) and this quote should be reduced to paraphrase before the repo is public.
Quoting permission not yet asked.*

## What he said

> There is new work on xanadu, I had the 150,000 lines of smalltalk turned into 2 equivalent apps
> C & rust both byte identical in output, both about 27,000 lines (so much fro OO). I'm waiting on
> Ted , then I'll make it available. I haven't seen the stuff you pointed to, Ill get to it !

Spelling and punctuation as posted.

## What that claims

Four claims, all first-person from the person best placed to make them, none verifiable until the
code is out. This table is the thing to check against the release.

| Claim | Status |
|-------|--------|
| The Smalltalk is ~**150,000 lines** | His count. Which tree it is — the released Gold sources or a later working copy — is not stated |
| It has been turned into **two apps, C and Rust** | His work, means not stated |
| The two are **byte identical in output** | An equivalence claim that implies a test corpus and a harness. Both are more interesting than the ports |
| Each is about **27,000 lines** | ~5.5× collapse, which he reads as a verdict on OO |
| Release is **gated on Ted** | Not on the code |

He has not yet read the material the invitation pointed at, and says he will.

## What it does to the open questions

The last question in [`udanax-lineage-questions.md`](udanax-lineage-questions.md) was *if you did it
again, what would you write it in* — asked as a hypothetical, with literate TypeScript and SqueakJS as
Don's candidates. It is not a hypothetical. It is done, in two languages neither of us guessed, and
the only thing standing between the answer and the public is Ted's sign-off.

The [1999 dogfood question](../../gwern/sources/1999-userland-xanadu-thread.md) survives the port
intact and gets sharper. Don's charge in 1999 was not that the C++ was wrong but that it was
unreadable — "uncommented glue gluing glue to glue" — a *generated* artifact shipped as the only
artifact, with the readable Smalltalk held back. Two new translations raise exactly the same question
one language further on: is either of them commented, documented, meant to be read and modified by
someone who was not there? If not, the release is the 1999 release again with better tooling, and
Gwern's argument — that Xanadu never made itself its own convincing use case — is still standing.

## Questions this earns

1. **Which Smalltalk?** The released [Gold sources](https://github.com/rfinz/udanax-gold), or a working tree that never shipped? If the latter, the diff against Gold is itself a historical document.
2. **Turned into, by what?** AI translation, a translator he wrote, or by hand? "I had it turned into" leaves all three open, and the answer determines whether the C and Rust are readable code or generated code.
3. **Byte identical on what?** Which operations, which corpus, which serialization — and does the comparison harness ship with the two ports? The harness is the reusable artifact; the ports are downstream of it.
4. **150k → 27k.** How much is genuine structural collapse and how much is the Smalltalk image's own accounting — class-library boilerplate, generated accessors, dead code that the translation dropped? Line counts across languages with different baselines are not a controlled experiment, and the uncontrolled version is still a good story.
5. **Do the tumblers survive?** Transfinite addressing in C and in Rust, with no objects to hang it on — that is the interesting half of the port.
6. **Which one is the reference?** Two implementations means one of them is going to rot. C or Rust, and who maintains it.
7. **What is Ted's sign-off about** — license, naming, both? And does it cover the Smalltalk too, so the original can be read next to the translations?

## The argument he started

*"So much fro OO"* is a swipe at object orientation from the man who watched a Smalltalk rewrite split
his group and blow the Autodesk deadline — Wikipedia's account of the PARC hires arguing for that
rewrite is in [the lineage table](udanax-lineage-questions.md). It is also a swipe delivered inside a
repo that has [David Ungar](../../david-ungar/README.md) in it, whose whole career is Smalltalk and
Self and now [Korz](https://github.com/SimHacker/moollm/blob/main/designs/korz/README.md). Two people
with standing, opposite verdicts, and a concrete artifact to argue over: 150,000 lines that became
27,000 twice. Nobody has to be persuaded of anything for that to be worth an hour.

## Don's reply

Don answered that cheap code makes old designs valuable rather than obsolete — revisiting a tested
design with new tools is now easier than the original build was — and quoted Will Wright's GDC 2005
*The Future of Content*, the talk where he first showed Spore, at
[1:01:28](https://youtu.be/ofA6YWVTURU?t=3688):

> So I'd encourage all of you: if you've got like some totally weird idea that is just so far outside
> the box that you think, you know, there's no way that would work — go back occasionally and revisit
> those ideas, because you just never know where they might lead to.

Transcribed from YouTube auto-captions; the clip is catalogued as `revisit-weird-outside-the-box` in
[`../../will-wright/sources/2005-03-11-spore-gdc-future-of-content/short-form-clips.yml`](../../will-wright/sources/2005-03-11-spore-gdc-future-of-content/short-form-clips.yml)
with `caption_status: draft`, which means verify against the audio before it goes anywhere with
quotation marks on it.

↑ [Roger Gregory](../README.md) · [invitation](../invitation.md) · [lineage questions](udanax-lineage-questions.md) · [ideas](../ideas.md)

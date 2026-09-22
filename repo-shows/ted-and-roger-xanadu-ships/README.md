# Xanadu Ships — Ted Nelson × Roger Gregory

**Seed.** Neither guest has been asked about this show. [Portrayal standards](../../schemas/portrayal-standards.md)

Interface: [`SHOW.yml`](SHOW.yml)

A reimplementation of Xanadu is finished and sitting unreleased, and the only thing between it and
the world is Ted Nelson's sign-off. Roger Gregory said so himself on 14 September 2026:

> [150,000 lines of Smalltalk, now two apps, C and Rust, byte identical in output, about 27,000 lines
> each — release waiting on Ted.](../../characters/roger-gregory/sources/2026-09-14-facebook-reply-c-and-rust.md)

That is a news peg with a clock on it, which no other seed in this directory has. Every other Xanadu
conversation ever recorded was a retrospective. This one can happen **while it is still a pending
release**, with the author and the implementer in the same room, and the recording can be part of the
release instead of coverage of it.

## The offer, in one sentence

Come tell people what you built, together, before it goes out — and then let's build the thing the
release needs and does not have.

## Why these two and not a panel

| | What they hold |
|---|---|
| **Ted Nelson** | Wrote the vision, named hypertext, and holds the veto. The release is gated on him. |
| **Roger Gregory** | Had to make it run, since 1974. Tumblers with Mark Miller. Led the Autodesk-era implementation. |

Every widely read post-mortem of Xanadu was written from outside the implementation — [Gwern's
essay](https://gwern.net/xanadu), Ben Shneiderman's assessment of *Computer Lib*, and Don's own 1999
Udanax review, which Gwern quotes twice. This pair is the inside of it, they do not agree about
everything, and that disagreement is the show rather than a problem to manage.

Don is not a neutral interviewer here and should not pretend to be. He met Hugh Daniel at the MIT AI
Lab Xanadu demo, reviewed the 1999 release in public and was hard on it, and got corrected by Ted on
Hacker News about the Green/Gold lineage. He has standing and a stake, which is the only honest way to
sit in that chair.

## What we would actually make

The Repo Show form is conversation, then implementation, with the repo as the deliverable. Three
candidates, all of which outlive the episode:

1. **An equivalence harness for Xanadu operations.** Roger's claim is that two independent ports are
   byte identical in output. Whatever measured that is the most reusable artifact in the story, and
   any future reimplementation needs it. If it does not exist yet, build it on air.
2. **Review [`sisbell/xanadu-spec`](https://github.com/sisbell/xanadu-spec) with Roger** — a formal
   spec derived by an agentic AI process from Ted's design and Udanax Green, whose accuracy nobody has
   validated. Validating it with the man who built the thing is a real deliverable.
3. **Rescue the Pale Fire demo.** Ted's own transclusion demo, linked from the front of xanadu.com, is
   a meta-refresh to `perma.pub`, which no longer resolves at all. The archived fulfil page is in the
   Wayback Machine (28KB, Aug 2019), **and the source documents are still live on hyperland.com** — only
   the fulfiller died. The spans still resolve against the live sources, verified. So a static
   client-side fulfiller on GitHub Pages brings it back, forkable, with the EDL as data in the repo.
   Measurements, recovered formats, and the build plan:
   [moollm `designs/XANADU-RESCUE.md`](https://github.com/SimHacker/moollm/blob/main/designs/XANADU-RESCUE.md).
   **Bring this as a gift, not an announcement** — the right outcome is that it lands back at
   xanadu.com/demo, or that Edward Betts takes the repo.

## The hard question, and how to ask it

The question the whole conversation turns on is **whether either port is meant to be read** —
commented, documented, modifiable by somebody who was not there. That is Don's 1999 charge arriving
twenty-seven years later at the same door, and in 1999 it was aimed at an artifact (machine-generated
C++, "uncommented glue gluing glue to glue") and never at the people who shipped it.

Roger raised the ports himself, unprompted. He is not being ambushed with them. Ask about the
artifact, keep it about the artifact, and let him answer at whatever length he wants.

Related: Ted's own position on this, from BayCHI 2021, is that automatic comprehension of code is hard
and what matters is "the author actually putting it into the words." He may be the best possible
person to ask whether a generated port can be literate. See
[moollm `designs/STRUCTURE-EDITORS.md`](https://github.com/SimHacker/moollm/blob/main/designs/STRUCTURE-EDITORS.md).

## Will Wright is invited

On the merits. Bar Karma was a branching, community-authored story graph; StoryMaker was Don's tool
for it; the Sims family album was transclusion shipped to millions of players who never heard the
word. Ted's objection to single-column documents and Will's whole career in navigating possibility
space are the same objection from two directions.

No homework, no assigned role, and if he passes the show stands on the pair.

## Also worth putting to them

Mike Travers asked Ted at BayCHI in 2021 about the recent explosion of hypertext writing tools, and
Ted had not looked at any of them. Since then it has only grown: [Roam](https://roamresearch.com/)
ships block-level transclusion and automatic backlinks to paying customers, and Obsidian and Logseq
keep the whole graph in markdown files you can put in git. Ted's mechanism is in shipping products
now. Neither he nor Roger has said anything about that on the record.

The scorecard, measured against Ted's own three criteria for a document — sendable, expresses a point
of view, made by a person — is in
[moollm `designs/PAIRED-LINKS.md`](https://github.com/SimHacker/moollm/blob/main/designs/PAIRED-LINKS.md).

## Status and consent

| Who | Where things stand |
|-----|--------------------|
| Roger Gregory | Invited to the repo 13 Sep 2026, replied 14 Sep with the news. **The show has never been raised with him.** |
| Ted Nelson | Invitation seed exists ([Têd-à-Têd](../ted-nelson/SHOW.yml)); not asked about this episode. |
| Will Wright | Signed on to the series; not asked about this episode. |

Quoting permission has not been asked of either principal. Everything in this directory is Don's
proposal and is subject to their correction, delay, refusal, or removal.

↑ [repo-shows](../INDEX.yml) · [Roger Gregory](../../characters/roger-gregory/README.md) · [Ted Nelson](../../characters/ted-nelson/README.md) · [trail: augmentation and hypertext](../../process/trails/augmentation-and-hypertext.md)

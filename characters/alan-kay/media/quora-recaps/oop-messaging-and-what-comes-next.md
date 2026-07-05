# OOP, messaging, MVC — and what comes after

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md) · *Corpus map:*
[`quora-corpus-2023-index.md`](quora-corpus-2023-index.md)

**Sources:** Alan Kay's public **Quora** answers to (among others):
- *"What did Alan Kay mean by, 'I made up the term object-oriented, and I did not have C++ in mind.'?"*
- *"What paradigm is the successor to OOP?"*
- *"What is the origin of model-view-controller?"*
- *"What is the idea that is better than semaphores from John McCarthy in [the] 60s?"*
- *"If you had to teach 'Computer Science 101', how would you begin your first lecture?"*

**Also drawn from:** natecull's [Malleable Systems Forum thread](https://forum.malleable.systems/t/alan-kays-quora-dialogues-and-the-philosophical-dilemma-of-systems-thinking/173)
— which quotes the OOP and CS-101 answers — and the Internet Archive capture
[Alan Kay Quora 2023 11](https://archive.org/details/alan-kay-quora-2023-11).

**Nature:** Summary of Alan's public Quora writing with **short verbatim quotes** in quotation marks;
elisions marked `[…]`. Verify wording against Quora before citing formally. Credit: **Quora**.
Governed by [`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

> **Project tie-in:** this cluster feeds hooks **#13** (systems vs. data), **#14** (successor to OOP), and
> **MOOLLM**'s relational/messaging debate. Pairs with
> [`../discussions/malleable-systems-systems-vs-data.md`](../discussions/malleable-systems-systems-vs-data.md).

---

## "I made up the term object-oriented" — and C++ wasn't the target

Kay coined the phrase accidentally in grad school (~1967) when asked what he was working on — "a very bad
choice as it turned out." The *ideas* came from **Sketchpad**, **Simula**, biological structures, networked
computers, and time-sharing processes — a "systems approach" made practical at PARC with **Dan Ingalls** and
**Chuck Thacker's** hardware.

By the 80s, "object-oriented" had been **colonized**: C++ (via Abstract Data Types, a preprocessor to C) got
popular; Smalltalk-lineage work could no longer be explained as "OOP" without confusion. Kay started saying
"real objects." Stroustrup wasn't stealing from Smalltalk — he was doing with C what Simula did with Algol.

The punchline for *today*: 70s "real OOP" was "hugely powerful back then, but what was implemented was far
from a complete set of ideas, especially with regard to scaling, networking, etc." **Dave Reed's** 1978 thesis
(dovetailing with Kay's networking ideas) didn't become **Croquet** until the early 2000s. **Goldstein &
Bobrow's PIE** papers were the best Smalltalk extensions — two ideas "deserved to be the start of a new
language."

## The turn toward "relational" — Sketchpad over messaging

Kay's clearest forward-looking statement in this thread:

> "I don't think that 'real OOP' as we thought of it then, is the way to go in the future (and didn't then).
> Consider Sketchpad … it is programmed in terms of **constraints** that the system solves … This is an early
> glimpse into **'requirements-based programming'**. It has something like objects … but is **'relational'
> rather than message-based** (the messages are implicit) … Today I think this is doable via a half dozen new
> techniques plus enormously larger machine capacities."

"Stuff like this is what we should be working on!"

*(This is the quote the Malleable Systems Forum seized on — is it a correction to "the big idea is messaging,"
or a layer above it?)*

## Successor to OOP — not a language, but knowledge-based system building

Kay reframes "OOP" (as he thinks of it) as a **universal definition scheme**: an abstraction of unlimited
complete computers networked together (interiors can be computers too). Like NAND/NOR universality — you can
build anything, but no hint of *organization*.

Historically, 80s OOP **simulated old familiar things** (Abstract Data Types) and "kills graceful scaling."
It should have been packaged as a **framework loaded with powerful design schema** — that didn't happen.

**Declarative programming** he analogizes to simultaneous equations: add an equation per new situation, let a
solver find a viable joint solution — but systems quickly become hard to gist, and many have no solution.
Real insurance systems have "over 100,000 requirements" and the working artifact is a partial approximation.

The next deep paradigm: **"knowledge based system building"** — systems that understand the *goals* of new
components added to them, do feasibility checking humans do sporadically today. Example: Facebook's outage —
code that "didn't even know that it was hookeded up to the Internet." Kay sees little taste for this scale of
re-invention in the field or among funders today.

Physics paradigms (Newton vs. quantum) are qualitatively separated; computing should look for something
similarly **revolutionary and large**.

## MVC — from Sketchpad's clipping window to Flex to Smalltalk

Kay traces MVC to **Ivan Sutherland's Sketchpad (~1962)**: a clipping window as a camera on a large world;
each object knows how to render itself; the windowing apparatus transforms world → screen coordinates.

**Sketchpad III** (Timothy Johnson) added 3D multiple views. Ivan's VR HMD continued the pattern — a "camera"
with six degrees of freedom sampling the virtual world for each eye.

At Utah, Kay overlapped with Ivan and the HMD project. The Flex Machine (with **Ed Cheadle**, 1967) generalized
beyond graphics: every object renders itself + a viewing mechanism; multiple windows show different aspects
of the same objects (seen in Sketchpad III, Engelbart's filtering panes, then Flex). Early Smalltalk had
multiple windows and clipping "turtles."

*(Kay's answer includes Smalltalk-72 screenshots — galley editor, painting views — as evidence the pattern was
live at PARC, not a later pattern name.)*

**Related (HN 2015):** Kay's post-PARC stance — views as **watchers**, unsolved **inverter** for projection,
HyperCard-style view construction — in Don Hopkins's HN comment on MVC/Morphic:
[`../discussions/hn-mvc-morphic-watchers-2015.md`](../discussions/hn-mvc-morphic-watchers-2015.md).

## McCarthy's "better than semaphores" — pseudotime / fluents

Asked about John McCarthy's 60s idea (referenced in Kay's "Rethinking Design, Risk, and Software" keynote
~38:00), Kay points to his other Quora answers on **"pseudotime"** (or "fluents"): don't let the CPU determine
time — **simulate time** along with everything else. That gives a real definition of "simultaneous" and a
scalable way to eliminate race conditions.

In the CS-101 answer he ties this to McCarthy's **"logic of fluents"** — preserving functional relationships
and reasoning while allowing state and the passage of time — "still not understood today in the rough and
tumble world of ad hoc programming."

Kay's soapbox in related threads: computing **hangs onto obsolete ideas by patching** and avoids learning new
ones even when tremendously useful → "dangerous bloated messes."

## Computer Science 101 — Perlis, systems, and what beginners should touch

Kay's tour of CS departments found no one who could define "Computer Science" except as engineering; few knew
**Doug Engelbart** beyond "something to do with the mouse."

He prefers **Alan Perlis** (~1960s): *"'Computer Science' is the 'science of processes'. All processes."*
Science = models/maps that exhibit, track, and predict phenomena (**Herb Simon**, *Sciences of the Artificial*).

First lecture should let beginners **touch real stuff** — e.g. two rulers as an "adding machine" where
first-graders outperform 5th graders on fractions: not digital, not stored-program, but the **essence of a
computer** (like the Antikythera mechanism).

On **Lisp**: McCarthy's `eval` "just does fit on a T-Shirt" — a mathematical theory of computation more
powerful than Fortran's bridge.

The quote that launched the Malleable Systems debate:

> "computing in the large is much more about making **systems** of many kinds than it is about algorithms,
> 'data structures', or even programming per se."

The **Internet** doesn't need to be stopped to fix it — "much more like a biological system — by our intention."
First courses should have students build a **system of thousands of dynamically interacting parts**; weak
fluency in a limited subset "just kills them."

## Questions for Alan (show fodder)

- Is Sketchpad-style **relational/requirements programming** a *replacement* for messaging, or the layer that
  *coordinates* messages?
- You said declarative systems with 100K requirements are already real — what would a **solver + knowledge
  context** look like for *end-users*, not insurance companies?
- **Pseudotime/fluents** vs actors vs semaphores — if McCarthy had won, would today's "hostile Internet"
  debate look different?
- MVC started as a **rendering** pattern; when did it become a data-pattern fad — and is that the same mistake
  as OOP→ADT?
- PIE deserved a new language and term — if you coined one today, what would you call it?

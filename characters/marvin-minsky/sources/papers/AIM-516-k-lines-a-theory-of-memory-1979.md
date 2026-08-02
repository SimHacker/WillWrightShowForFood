# K-Lines: A Theory of Memory — reader's guide

Structural companion to Marvin Minsky's AI Memo 516 (June 1979). Section anchors, page
pointers, and short quotes for citation; the memo itself is the text of record. The memo
is still under MIT copyright, so this guide maps it rather than reprints it.

| | |
|--|--|
| **Local PDF** | [AIM-516-k-lines-a-theory-of-memory-1979.pdf](AIM-516-k-lines-a-theory-of-memory-1979.pdf) |
| **Searchable OCR** (uncorrected) | [AIM-516-k-lines-a-theory-of-memory-1979-ocr.txt](AIM-516-k-lines-a-theory-of-memory-1979-ocr.txt) |
| **DSpace original** | https://dspace.mit.edu/handle/1721.1/5739 |
| **Journal version** | Cognitive Science 4(2):117-133, 1980 — https://doi.org/10.1207/s15516709cog0402_1 |
| **Living MOOLLM homes** | [k-lines skill](https://github.com/SimHacker/moollm/tree/main/skills/k-lines) · [P-PYRAMID](https://github.com/SimHacker/moollm/blob/main/designs/P-PYRAMID.md) |

## Contents

- [Abstract and thesis](#abstract-and-thesis) (pp. 1-3)
- [Dispositions vs. Propositions](#dispositions-vs-propositions) (p. 3)
- [Mental States and the Society of Mind](#mental-states-and-the-society-of-mind) (pp. 3-5)
- [Memories and Partial Brain States](#memories-and-partial-brain-states) (pp. 5-6)
- [Cross-Exclusion and Persistence](#cross-exclusion-and-persistence) (pp. 6-7)
- [K-Lines and Level Bands](#k-lines-and-level-bands) (pp. 7-8)
- [The Level-Band Principle](#the-level-band-principle) (pp. 8-9)
- [Connections Among K-Nodes](#connections-among-k-nodes) (pp. 9-10)
- [The Crossbar Problem](#the-crossbar-problem) (pp. 10-11)
- [The Knowledge-Tree](#the-knowledge-tree) (pp. 11-12)
- [K-Knowledge](#k-knowledge) (pp. 12-14)
- [Learning and Reinforcement](#learning-and-reinforcement) (pp. 14-16)
- [Tacit vs. Articulate Knowledge](#tacit-vs-articulate-knowledge) (pp. 16-17)
- [Notes](#notes) (pp. 17-22)
- [References](#references) (p. 23)

## Abstract and thesis

Most memory theories ask how information is represented, stored, retrieved, used — and
how it gets abstracted so old answers fit new questions. Minsky answers all at once with
one move: **the function of a memory is to re-create a state of mind.** When you get an
idea, you create a K-line; the K-line connects to the mental agencies active at that
moment; reactivating it later induces a **partial mental state** resembling the original.
The whole memo unpacks the translation:

> "I once solved a similar problem. If I can get into that old state, I could probably
> handle this one the same way."

## Dispositions vs. Propositions

Feelings, attitudes, and "ways of seeing things" are usually deferred as too hard; Minsky
inverts the order — dispositions are the *elements* propositions are later built from.
Memory is treated structurally, as re-setting the states of parts of the nervous system,
starting from an infantile dispositional memory that evolves into the adult kind.

## Mental States and the Society of Mind

The mind as a society of small agents (Divisions → subspecialist agents, each active or
quiet). A **total mental state** is a selection of which agents are active; a **partial
mental state** fixes only some of them — so several partial states can be entertained at
once when compatible, and local conflict-resolution between them is proposed as the
ancestor of reasoning. The concert example: the novice remembers *being at* it, the
professional remembers the music — so concrete recollection requires the most refined
expertise, and attitudes really do precede propositions.

## Memories and Partial Brain States

Agents sit in a lattice: inputs from below or the side, outputs upward. From any agent P's
vantage the agents below arrange into a hierarchy — the **P-pyramid** — with the memo's
crucial caveat:

> "I emphasize that the network as a whole need not be pyramidal; the P-pyramid we speak
> of is an illusion of an agent's perspective."

## Cross-Exclusion and Persistence

Agents cluster in small mutually inhibiting groups — radio buttons, described as
physiology. Forcing one member on resets the whole group cheaply. Consequences: built-in
short-term memory (a forced partial state tends to persist), and **dispositions** —
persistent activation patterns that read from outside as styles of behavior, changed only
by re-setting many groups at once. Higher up, different pre-activated subsets induce
different "ways of seeing" (the Necker cube flip is preference signals, not sensory data);
each P-pyramid carries a repertory of such dispositions.

## K-Lines and Level Bands

The mechanism, in two steps: **K-node assignment** (a memorable event, judged memorable by
another part G of the mind, mints a new agent AK linked to the goal) and **K-line
attachment** (AK's K-line makes an excitatory attachment to every currently active
P-agent). Reactivating AK later makes P re-enact that partial state — "virtually
hallucinate" the event.

## The Level-Band Principle

The memo's self-declared most important idea: perfect hallucination would be harmful, so
the K-line attaches only to an intermediate band of levels. The lower limit keeps old
detail from imposing false perceptions that conceal the present problem; the upper limit
keeps the old solution from making you hallucinate the present problem as already solved.
The band leaves the top free for current goals and the bottom sensitive to current
contingencies — and (Note 9) weak attachments at the band's fringes behave exactly like
frame default assignments, losing cross-exclusion competition to anything the present
asserts.

## Connections Among K-Nodes

The **K-recursion principle**: since every memorable event was itself largely produced by
existing K-lines, a new K-line need attach only to the currently active K-nodes — "new
memories are composed mainly of ingredients from earlier memories." Fewer connections,
more meaningful structure; genetics presumably shifts attachment preferences from P-agents
to K-agents during development.

## The Crossbar Problem

How can every K-line potentially reach every agent? Level bands cut the dimensionality by
one; sparse random-subset coding over a shared bundle of "M-lines" (Mooers' zatocoding
1956, Willshaw's associative nets 1969) handles the rest — hashing proposed as
neuroanatomy. But the deep answer is the Society itself: specialists that intercommunicate
only sparsely mostly have no need to talk, and unusual associations go indirect — "via
words, images, or whatever," as mnemonists' devious pathways suggest.

## The Knowledge-Tree

The K-nodes grow into a **K-pyramid lying against the P-pyramid**, mirroring its
connections with information flowing the other way (P activates upward, K activates
downward); local computation spirals between them and the locus of activity can drift up
or down. Minsky flags the missing piece honestly: the P→K connection — how P-events get
related to goals — is left unresolved, and he argues non-trivial learning needs at least
three nets.

## K-Knowledge

What do K-nodes *mean*? Three readings. **Logical**: concurrent K-lines at comparable
levels superpose disjunctively; when they conflict inside a cross-exclusion group, the
whole group drops out and control defaults upward — "it is often better not to seek a
compromise, but to seek another, less ambiguous viewpoint" (Papert's reading of Piaget's
conservation). **Abstract**: accumulating instances onto one node (box, chair, table →
"something to stand on") gives extensional class-abstraction, and conflict-cancellation
automatically extracts common non-conflicting properties. **Procedural**: cross-level
K-line interaction can instantiate frames, displace defaults with sensed values, and
perhaps chain deductions through the K-P-K cycle.

## Learning and Reinforcement

Against uniform reinforcement: deciding what is "memorable" takes too much intelligence to
be a single central process, and credit assignment spans too many time scales for recency
to sort out. The three-net model — G (goals) controls how K (memory) learns to operate P
(performance) — with link formation always held by a separate agency that can itself
learn. The aside worth keeping: people may differ in intelligence more by mnemonic
strategy than by problem-solving strategy.

## Tacit vs. Articulate Knowledge

Most knowledge stays where it was formed and works there; being able to say what one knows
is the exception. Self-awareness is "a complex, constructed illusion" — no part of a mind
sees deeply into other parts, only models them — yet those models are essential, because
thinkers must adapt strategies to their own mental resources.

## Notes

Twelve notes, several load-bearing: **Note 1** situates the memo in the Society of Mind
theory with Papert (the C-lines of AIM-430 correspond to K→P connections here). **Note 5**
argues circularity must be introduced in a controlled way — feedback loops built up
gradually as the K-net trains, watched for "instability and oscillation, distraction and
obsession" — and proposes an external **facilitation signal** that selects the active
level band, instructing K-P to "try a more general method" or "pay more attention to the
input." **Note 7** observes no negative attachments are needed (cross-exclusion suppresses
automatically). **Note 9** derives frame defaults from weak fringes. **Note 10** sizes the
crossbar problem (thousands of P-nets of thousands of agents) and cites Mooers and
Willshaw. **Note 12**, on saturation, ends with Clarke's *The City and the Stars* — minds
that from time to time erase their least welcome recollections.

## References

Twelve entries, including Minsky's *Plain Talk about Neurodevelopmental Epistemology*
(IJCAI 1977; [local copy](AIM-430-plain-talk-about-neurodevelopmental-epistemology-1977.pdf)),
the Frames memo ([AIM-306](AIM-306-a-framework-for-representing-knowledge-1974.pdf)),
Doyle's TMS memo, Hebb, Marr, Mountcastle, Mooers, Willshaw, Fahlman's NETL, Winston, and
the Clarke novel. Acknowledgments credit discussions with Hillis, Sussman, Richards,
Doyle, Solomonoff, Berwick, "and especially S. Papert — for the basic idea came in
conversations with him."

↑ [papers index](README.md) · [sources](../README.md) · [character room](../../README.md)

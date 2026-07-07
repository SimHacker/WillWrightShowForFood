# STEPS, Nile, and the intermodule problem — 500 lines vs. 100,000

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Sources:** Alan Kay's public **Quora** answers on:
- *"In the STEPS report, an unresolved problem of massive intermodule coordination… hardware or software?"*
- *"What is declarative programming?"* (Nile / runnable math section)
- *"What does Alan Kay think of a new Smalltalk system more focused on the problem… (Jackson/Harel)?"* (STEPS POLs)
- Literacy/graphics thread (Nile replacing 50K–100K lines C++)

**Nature:** Summary with **short verbatim quotes**; verify against Quora. Credit: **Quora**. Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md).

> **Project tie-in:** VPRI lineage, **Alex Warth/OMeta**, **Dan Amelang**, MOOLLM inter-module coordination,
> [`late-binding-and-rethinking-the-os.md`](late-binding-and-rethinking-the-os.md) (LINDA, CYC-about-systems).

---

## The STEPS intermodule problem — still open

STEPS report flagged **massive intermodule coordination/communication** — Kay thought "someone" should work on
it; listed for STEPS interesting techniques but **didn't make the cut** (some subproblem infrastructure built).

**Insight:** extreme scaling makes **knowing actual labels** (e.g. function named "sine") untenable → need
**search by descriptions** of structures/objects.

**Ted Kaehler's method finder** in Smalltalk: give I/O relationships — 30 + 0.5 → `degreeSin`; unsorted +
sorted array → sorting functions. Inspired by Doug Lenat's **AM** ("discovery system" extracting meanings from
possibilities) — description scheme could address module problem.

Also pondered at PARC: **semantic typing**; admired **LINDA** (80s) for messaging/concurrency metaphor.

Kay (2010s): surprised no modern Kaehler/Lenat/Gelernter stepped up — **important and would be quite beautiful**.

## Nile — runnable math for graphics

**Dan Amelang's Nile** (STEPS): dataflow between processes from **projective mappings** — graphical
mathematics + rendering. **~500 lines** replaced **~50K–100K lines C++** for virtually all 2.5D PC graphics
(rendering, compositing, filtering, curves, fills, masks) real-time; multi-core via dataflow independence.

~10 pages — **"eyeful"** on one desktop screen. APL lineage → **"runnable mathematics"** when possible =
"wonderful as it gets."

Ties to literacy answer: programming in **written mathematical form** expands art like literacy expanded oral art.

## STEPS + OMeta — problem-oriented languages live

Squeak + **Alex Warth's OMeta** + late binding + live turtles → wide **Problem Oriented Languages** for STEPS
(variety built). Extensible syntax needed for some POLs beyond Ingalls's readable but limited scheme.

## Hardware or software?

Kay treats intermodule coordination as **software/design** — though scaling may need new HW assists. Same
family as CYC-like expert system about dependencies in OS rethink answer.

## Questions for Alan (show fodder)

- **MOOLLM skills** as semantic typing + method finder for modules — practical?
- Would you restart STEPS if funded today — or is the web the wrong substrate?
- **500 lines of Nile** — could Micropolis rendering live in a similar eyeful?
- Who is today's **Kaehler** for intermodule search?

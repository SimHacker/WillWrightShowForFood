# LLMs, copilots, and trust — why not for teaching programming

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Sources:** Alan Kay's public **Quora** answers to:
- *"What does Alan Kay think about programming and teaching programming with copilots and LLMs of today?"*
- *"What are the most advanced programming languages?"* (addendum on LLMs + knowledge systems)

**Nature:** Summary with **short verbatim quotes**; verify against Quora before formal citation. Credit:
**Quora**. Governed by [`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

> **Project tie-in:** MOOLLM, constructionism (trust in teachers/microworlds), pairs with
> [`lenat-cyc-knowledge-and-slow-thinking.md`](lenat-cyc-knowledge-and-slow-thinking.md) and
> [`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md).

---

## Summary answer: not a good idea at all

Kay frames the question around **trust** — from single-program days through multiprogramming, networking,
Moore's Law, and now **"NCANIPs"** (non-cognitive artificial non-intelligent processes) that "hack the language
communications systems of our species" (Harari).

For automated, scaled systems, **trust requirements must expand and tighten**. Using LLM copilots to teach
programming today: **"I don't think it would be a good idea at all."**

## Why current CS teaching is already wrong

Programming is taught (at major universities Kay has seen) in ways obsolete for ~60 years — languages, OSes,
infrastructure, and **ability to trust what's online** all changed qualitatively. Universities were once "keepers
of the flame" and vanguard for "reinventing better fire"; today most CS departments are **trade schools** for
what businesses got themselves into trouble with.

Patching vs. addressing root problems — putting typical businesses in charge has been "an unmitigated
disaster"; government isn't up to the task either, but something like government will be required.

## What could help instead

Kay praises the **Internet design** (he wasn't involved enough to claim credit): **no direct sending of
commands** — only bits; local software interprets and decides whether to act. A model for organizing processes.

An **expert system** could teach programming **better than a book or most teachers** — if "learn" means
processes and relationships created **between the learner's ears** by their own brain. "Help" means proximity
to a **"special human"** strong enough to force epistemological rethinking — trust as "consistently
interesting, worth listening to," not always right.

## ML/LLMs — a part, not the core; correlation is superstition

> "ML and LLMs, etc., do have a part in 'actual machine intelligence' in the future, but **not nearly the most
> important parts**."

Today's systems: **not to be trusted at all**. Using one LLM to explain another's output = **"piling BS on BS."**
"Reasoning by correlation" amounts to **superstition**; civilization requires moving toward scientific methods.

In the "most advanced languages" thread: reasonable candidates need **active knowledge** of the world their
results touch (737 Max autopilot, Facebook/Google crashes). LLM/ML approaches are **"really dangerous
without serious grounding in a cognitive knowledge-based system."**

## The larger frame — Spaceship Earth

The issue exceeds computing disasters: humans cooperate with limited trust, then compete and cheat as if
society exists to be strip-mined. Scaling makes this a **Spaceship Earth** problem. Heinlein: "The bull wears
itself out on the cape and fails to see the sword."

---

## Our guess — MOOLLM as partial answer (draft; not Alan's words)

*Canonical full analysis:*
[`../../moollm-trust-and-teaching-guess.md`](../../moollm-trust-and-teaching-guess.md)

**Short answer:** [MOOLLM](https://github.com/SimHacker/moollm) is **half** what Kay seems to mean — microworld
OS for constructionist learning, **not** a GitHub Copilot — but **not yet trustworthy** by his bar. Make the LLM
**the least trusted component in the loop**. See the artifact for copilot-vs-MOOLLM table, architecture diagram,
roadmap, show segments, and agent analysis.

---

## Question to pose to Alan

**Lead question (MOOLLM):**

> We built **MOOLLM** as a microworld OS — directories as rooms, skills as inspectable programs, the LLM as
> `eval()`, constructionism not copilot autocomplete. Reading your answer on copilots and teaching
> programming: is that **anything like** what you mean by an expert system that creates understanding
> "between the ears"? If not, what would we have to add or **forbid** to get there — and would a Cyc-class
> commonsense layer be enough, or is the "special human" irreplaceable?

*Review protocol:* show Alan the recap + [`../../moollm-trust-and-teaching-guess.md`](../../moollm-trust-and-teaching-guess.md);
fold his reply back in (see
[`../../../david-rosenthal/slots-all-the-way-down.md`](../../../david-rosenthal/slots-all-the-way-down.md)).

## Further questions for Alan (show fodder)

See full question bank in [`../../moollm-trust-and-teaching-guess.md`](../../moollm-trust-and-teaching-guess.md#question-to-pose-to-alan). Highlights:

- Could a **Cyc-class commonsense layer + LLM** ever be trustworthy enough for learners — or is the "special
  human" irreplaceable?
- Is the Internet's **bits-not-commands** design the right pattern for LLM tool-calling protocols — and does
  **MOOAM**-style declared permissions get anywhere close?
- What would an **expert teaching system** look like that creates understanding between the ears — Etoys?
  A microworld with a **skeptical tutor**? What would you *not* let it do?
- NCANIPs hacking language — does that make **kids-reading real transcripts** (human voices, verifiable
  sources) more important, not less?
- If you rebuilt **MOOLLM** with a Cyc-class layer, what stays **late-bound** vs what must stay **human-only**?
- **ML + symbolic** — trustworthy copilots, or still missing pseudotime/fluents and "active knowledge" of
  dependencies?
- Lenat's **"white space"** vs training on all the words — did we automate the wrong part of the encyclopedia?
  (McCloud **gutter** + Will **two computers** —
  [`lenat-cyc-knowledge-and-slow-thinking.md`](lenat-cyc-knowledge-and-slow-thinking.md#repo-show-connection--white-space-gutter-two-computers-dons-guess).)
- Should the first job of semi-AI be **free learn-to-read** (Carnegie vision) rather than copilots for coders?

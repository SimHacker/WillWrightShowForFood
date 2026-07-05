# Douglas Lenat's Cyc — commonsense, slow thinking, and the next pass

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"What does Alan Kay think about Douglas Lenat's Cyc?"*
**Related:** successor-to-OOP → knowledge-based building
([`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md)); LLM critique
([`llms-copilots-trust-and-teaching.md`](llms-copilots-trust-and-teaching.md)); rewrite-Linux OS answer
(CYC-like "expert system about systems").

**Nature:** Summary with **short verbatim quotes**; verify against Quora. Credit: **Quora** (+ Ken Kahn comment
Kay copied). Governed by [`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

---

## The original idea — automate the white space

Early 80s, Doug Lenat: **"Instead of automating the words in an encyclopedia, we should automate the
'white space'"** — what a reader must know to read an article: commonsense context. An **engineering
project**: brute force if needed, respond flexibly (not brittlely) across contexts.

Expert systems = **brittle islands**; need a **"commonsense canoe"** as universal fallback where expertise
runs out.

Kay: **great insight** — pretty much **lacking in today's "AI"**; needs much more than ML correlations.

## What Cyc achieved

Enormous work → millions of relationships modeling commonsense; deeper than any artifact Kay knows; many
successes. Struggled through **AI winter** as ML drew funding from "deep requirements of real AI."

**Symbolic ≠ antithetical to ML — both needed.** Today symbolic side **omitted or too weak.** Post-Kahneman:
missing **deep slow thinking** in models of the world vs. Type-1 fast neural correlations/reactions.

## Bottom line — study it, learn organization for next pass

> "CYC is well worthy of study, both for what it can do that other systems can't, and also to learn more about
> how such a system should be organized for a next pass."

Grateful Lenat was a **bulldog** — without persistence, no artifact **"good enough to be criticized."**

Ken Kahn's comment (Kay copied): Lenat's recent **30-million-rule** paper; example of **ML + Cyc together**
at the end.

## Where Kay would use it today

In *"rewrite Linux in Smalltalk"* / OS rethink: make a **CYC-like "expert system about systems"** for
**dependencies management** — scaling makes names less useful; modules negotiate via **descriptions and safe
testing**; expert system assists. Same thread as **knowledge-based system building** preventing Facebook-style
crashes (code that doesn't know it's on the Internet).

## Questions for Alan (show fodder)

- If you rebuilt **MOOLLM** with a Cyc-class commonsense layer, what would you *not* let it do?
- Is **ML + symbolic** the architecture for trustworthy copilots — or still missing pseudotime/fluents?
- Lenat's "white space" vs LLM training on **all the words** — did we automate the wrong part of the
  encyclopedia?
- Who picks up the **next pass** now that Doug is gone?

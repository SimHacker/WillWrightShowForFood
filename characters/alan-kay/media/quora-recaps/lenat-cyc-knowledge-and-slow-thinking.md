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

---

## Repo Show connection — white space, gutter, two computers (Don's guess)

*Not Alan's words — a rhyme Don sees between Lenat, **Scott McCloud**, and **Will Wright**. See
[`../../../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/README.md`](../../../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/README.md)
(Simulator Effect / two computers) · [`../../../scott-mccloud/`](../../../scott-mccloud/) ·
[`../../moollm-trust-and-teaching-guess.md`](../../moollm-trust-and-teaching-guess.md).*

### Did we automate the wrong part of the encyclopedia?

Lenat: automate the **"white space"** — what you must already know to read an article — not the words.
LLM training on **all the words** in the corpus is the inverse mistake: maximum explicit text, minimum
curated commonsense structure. Kay's critique of correlation-as-superstition rhymes: you got fluent paragraphs
where you needed **relations in the gutter**.

### The same trick in comics and games

**Scott McCloud — closure and the gutter.** In _Understanding Comics_, the mind fills the **gap between
frames** — the gutter — with motion, time, and causality the artist never drew. The comic supplies **panels**;
the reader supplies **connection**. Amplification through simplification: less ink, more imagination.

**Will Wright — two computers.** From the **1996 Winograd talk** (Don on camera): the game runs on two
machines — the shallow tame one on the desk, and the **deep wild one in the player's head**. Good design
**downloads instructions and models** into a **commonsense-saturated environment** (the player already knows
how people, hunger, jealousy, cities work) and **masks the machinery** so the player completes the simulation.
*Implication is more efficient than simulation.* Same move as McCloud's gutter — and Will's **Simlish** /
**Julie doll** story: literal speech **dictates** fantasy; structural ambiguity **invites** it.

| Lenat (Cyc) | McCloud (comics) | Will (simulation) |
|-------------|------------------|-------------------|
| White space between encyclopedia words | Gutter between comic frames | Gap between sim state and player story |
| Commonsense the reader already has | Closure — reader imagination | Player's mental model / apophenia |
| Expert system encodes relations | Artist draws panels, not motion | Game ships rules + cues, not full life |
| Automate what's *implicit* | Leave gaps; audience completes | Never simulate more than one layer below observation |

### MOOLLM read (draft)

- **Wrong:** LLM as encyclopedia — generating all the words, pretending the white space is already inside
  the weights.
- **Right (Kay + Lenat + Will + McCloud):** microworld ships **sparse, inspectable frames** (skills, rules,
  save files, explorable overlays) into a learner who **already has** commonsense; the **gutter** is where
  understanding happens — *between the ears*, not in the chat transcript.
- **Cyc-class layer (if any):** not to replace the player's canoe — to **assist negotiation** between
  explicit frames (dependencies, safety, "expert system about systems") while the human/comic-reader/player
  still performs **closure**.

**Live segment:** Alan reacts to a triple stack — Lenat recap + McCloud gutter diagram + Will's two-computer
clip — then we ask whether **Repo Show** itself is a comic strip (sparse repo frames, audience closure) or an
LLM slop hose.

---

## Questions for Alan (show fodder)

- If you rebuilt **MOOLLM** with a Cyc-class commonsense layer, what would you *not* let it do?
- Is **ML + symbolic** the architecture for trustworthy copilots — or still missing pseudotime/fluents?
- Lenat's **"white space"** vs LLM training on **all the words** — did we automate the wrong part of the
  encyclopedia? (Don's rhyme: McCloud **gutter/closure** + Will's **two computers** — see
  [§ white space, gutter, two computers](lenat-cyc-knowledge-and-slow-thinking.md#repo-show-connection--white-space-gutter-two-computers-dons-guess).)
- Who picks up the **next pass** now that Doug is gone?

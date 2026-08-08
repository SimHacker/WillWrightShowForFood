# Spore Rethinks Multiplayer, Time, and Ownership

*Will Wright's Spore quietly broke three things we treat as absolute — what "multiplayer" means,
what **time** means, and what **ownership** means. Each one fragments from a single global thing
into many local things. That fragmentation is the conceptual foundation beneath moving content
between games through [Soul City](character-endosymbiosis.md) — and beneath git's many-worlds
cosmology that the [artifactory](artifactory.yml) runs on.*

Girder: [`character-endosymbiosis.md`](character-endosymbiosis.md) (the biology of moving content) ·
[`../characters/david-rosenthal/slots-all-the-way-down.md`](../characters/david-rosenthal/slots-all-the-way-down.md)
(the object-model half) · [`../characters/mark-weiser/pkd-lem-ai-sf.md`](../characters/mark-weiser/pkd-lem-ai-sf.md)
(the PKD "Faith of Our Fathers" many-realities half)

---

## The idea in one breath

Spore didn't synchronize *players in real time*. It synchronized **content**. Your creatures,
buildings, vehicles, and spaceships were uploaded to the **Sporepedia** and — through
"**Pollination**" — other players' creations flowed **asynchronously** into *your* private galaxy to
populate it. Maxis called it **"massively single-player."** No shared clock, no shared session:
a shared **ecology of artifacts**. That one design choice quietly rewrites three concepts.

## 1. Multiplayer → a content commons, not co-presence

"Multiplayer" almost always means **co-presence**: one live session, one shared clock, avatars in
the same room at the same time. Spore threw that out. Other people's creations arrive as **autonomous
artifacts** and live in *your* world, doing their own thing, long after their author logged off.
You're never together in **time** — you're together in **stuff**. *Together, apart.*

This is exactly how [Soul City](character-endosymbiosis.md) works: a Sim doesn't need Stardew's
author online to move into Stardew. Content crosses the membrane and takes up residence. And it's
exactly how **git** works: you never share a live session, you exchange immutable objects.
**Collaboration is a shared ecology of artifacts, not a shared "now."**

## 2. Time → local and causal, not a global now

If content flows asynchronously between worlds, there is **no global clock** — and that's a feature.
A creature authored in 2008 is *fresh* the instant it lands in your 2026 game. "When it was made" is
provenance metadata; "when you experience it" is **local**.

Git says this precisely: order is the **causal parent-DAG** (a *partial* order), not a wall clock.
Two worlds can each be perfectly self-consistent and never agree on "when." **Time slips by at
different rates in different places, and nothing breaks** — because correctness rides on the causal
graph, not a shared present. It's relativity, not a bug: no absolute simultaneity, just local
histories and the events that connect them. (David Ungar's *"Everything You Know (About Parallel
Programming) Is Wrong"* argues the same from the other side — give up perfect synchronization to
scale. See [`slots-all-the-way-down.md`](../characters/david-rosenthal/slots-all-the-way-down.md).)

**Celebrate the drift.** A branch can be a Donnie-Darko pocket universe named
`MicropolisCity_HaightAshbury` that floats free with its own lifecycle and merges back whenever it's
ready — or never.

## 3. Ownership → authorship + fork-lineage, not exclusive control

This is the sharpest inversion. Once you share a Spore creature, copies **fork into other players'
universes and mutate there** — remixed, mashed up, evolved past you. So ownership splits in two:

- You keep **authorship / provenance** — the signed id, the attribution, your creation's lineage.
- You do **not** own the **descendants** or their fate — each fork stewards its own copy.

**Copying isn't theft — it's the medium.** This is *selfish inheritance* (own your local slots,
delegate the parent) and David Rosenthal's **LOCKSS** (identity by **replication**, not by lock) in
one breath. Content-addressing makes it literal: an object's **hash is its identity**, so a copy
isn't a rival — it's the same thing, everywhere at once. (This is the live tension with
[`auto-art-theft-grand.yml`](auto-art-theft-grand.yml): when is a fork homage, and when is it
theft? The honest answer is a *provenance* answer, not a *lock* answer.)

## Why this is foundational

[Character Endosymbiosis](character-endosymbiosis.md) explains **how** content moves between games —
membranes, diffusion, selective transport, honest exchange rates. **This doc explains what that
movement *does to our concepts*, and why the async, content-not-clocks model is the right one.**
They're two halves of the same foundation:

| Question | Answered by |
|----------|-------------|
| *How* does content cross between games? | Endosymbiosis — membranes, diffusion, currency exchange |
| *What* does async content-sharing do to multiplayer / time / ownership? | **This doc** — the three inversions |
| *On what substrate* does it all persist and branch? | [Artifactory](artifactory.yml) — git as a many-worlds parallel-universe editor |

Get the three inversions right and the whole architecture stops being scary and starts being
generative: **fearless copying, local time, attribution-not-control.** The commons grows *because*
nobody has to hold still, agree on a clock, or ask permission to fork a world.

## The reveal, PKD-style

PKD's *"Faith of Our Fathers"* makes **singular** reality the drug and **plural** reality the hidden,
horrifying truth. Spore — and git — invert the ethics: the **plural** reality is the real one, and
it's *editable, navigable, and safe*. Most people run a many-worlds machine (git) every day without
noticing. Naming it this way — *you already live in parallel timelines; here is the editor* — is a
small **calm-technology** win, in Mark Weiser's exact sense. (Full thread:
[`pkd-lem-ai-sf.md`](../characters/mark-weiser/pkd-lem-ai-sf.md).)

---

## Draw in

- **Will Wright** — built Spore and the "massively single-player" model. [`../characters/will-wright/`](../characters/will-wright/)
- **David Rosenthal** — LOCKSS (replication-as-identity); the object-model equivalences. [`../characters/david-rosenthal/`](../characters/david-rosenthal/)
- **Dan Ingalls / Dave Ungar** — live/malleable objects; relativistic parallelism (via `slots-all-the-way-down.md`).

## Sources

- **Spore** (Maxis / Will Wright, 2008) — Sporepedia, Pollination, "massively single-player" asynchronous content sharing
- Related here: [`character-endosymbiosis.md`](character-endosymbiosis.md) · [`artifactory.yml`](artifactory.yml) · MOOLLM `artifactory` skill (*cosmology* / *spore_rethinks*) · [`../repo-shows/INDEX.yml`](../repo-shows/INDEX.yml) (the Soul City bridges)

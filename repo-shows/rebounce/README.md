# Rebounce 🔌🌀

> A nominal salute to **Bounce** (né **Body Electric**) — check in the old source, and rewrite it
> together: by hand and with AI, competing, cooperating, exchanging ideas.

**Bounce** was one of the most productive, delightful visual programming languages Don ever used — a
patch-cord dataflow environment where you **live-coded a running VR world**: reach in, re-patch it,
and it keeps going. It began as **Body Electric** at **VPL Research** — led by **Chuck Blanchard**, with
[Jaron Lanier](../../characters/jaron-lanier/README.md) founding VPL and driving the vision — and became
**Bounce**, [David Levitt](../../characters/david-levitt/README.md)'s derivative of it (David also
created **Hookup**, his own patch-cord language, at MIT). Don serial-contracted at Levity to productize
it (COM datatypes, objects on wires, the *Space Seed* demo).

**Rebounce** honors it by bringing it back:

1. **Check in the source.** Don has the original Bounce source (Pascal → machine-mangled C). It goes
   in [`source/`](source/) as the reference seed — the starting point, not the destination.
2. **Rewrite it together.** Invite **many** people to reimplement Bounce in a modern (TypeScript/web)
   stack — **by hand and with AI**, **competing and cooperating**, cross-pollinating ideas. Best-of-N
   energy: many parallel attempts, shared learnings, every attempt published.
3. **Seeded by the originals.** [David Levitt](../../characters/david-levitt/README.md) and Don seed
   the design discussion; [Jaron Lanier](../../characters/jaron-lanier/README.md) — VPL co-founder &
   Body Electric visionary (its lead designer/programmer was **Chuck Blanchard**), VR rock-star legend —
   warmly invited to riff on where it came from.

## What made Bounce special (the targets to recapture)

From Don's firsthand [Body Electric / Bounce VR-stack history](../../characters/don-hopkins/body-electric-bounce-vr-stack.md):

- **Live-coding a running world** — edit while it runs; never stops.
- **The model is a data type** — a **Swivel 3D transform tree** as the skeleton, parameters projected
  in real time, streamed via **UDP to two SGI renderers (one per eye)** for stereo VR.
- **One real-time nervous system** — MIDI, Ethernet, Polhemus, DataGlove, headsets, Convolvotron.
- **Whole objects on typed, colored wires** — pass a structured JSON-like object as **one** thing,
  beating the max-6-parameters nested-module limit. (The seed of Pantomime JSON → MOOLLM.)

## The story beat — Rush, Jesse, the Truth Fly, and Faceball

Bounce's Interval demo put **Jesse Jackson, Rush Limbaugh, and a house fly** over live TV, driven by
the synchronized **closed-caption track** — MST3K with political puppets, years before anyone named
the format. That demo grew a **clearly-labeled-fiction** mythology in Don's LLOOOOMM tomb (the
**Truth Fly**, the **Great Transformation**, comment-out-don't-delete), and David is the perfect
person to excavate it with on air: real Interval history and labeled fiction, distinguished out loud.
The payoff: **tell the story Bounce was trying to tell**, reimagined and reimplemented in the
**[Faceball Construction Kit](../../apps/performance-space/faceball-construction-set.yml)** —
with **SimFaux** (Don's 2006 OpenLaszlo Fox News parody, inspired by the Interval work —
[video](https://www.youtube.com/watch?v=gRodlxUZ9SQ)) as the bridge demo between eras.

## How to play

Anyone can submit an attempt — **by-hand**, **AI-assisted**, or **hybrid**. Publish it, diff it
against the others, lift the best patterns. **We never gateway; we always invite duplication.** Full
credit to the originals and to every contributor.

Part of the [Snap! visual-engines vision](../../characters/don-hopkins/snap-visual-engines-fundable-goals.md)
— Bounce is the **patch-cord / dataflow** half (blocks author rules; patch-cords wire live streams).

Full proposal: [`rebounce.md`](../../characters/don-hopkins/rebounce.md). See [`SHOW.yml`](SHOW.yml).
**Party deck:** [`PARTY-DECK.md`](PARTY-DECK.md) · [`party-deck.yml`](party-deck.yml) — who to invoke together.
**Orchestrator hub:** [`ORCHESTRATOR.yml`](ORCHESTRATOR.yml) — Repo Show mirror of SimProv/SliceCity dispatch ([design doc](../../designs/orchestrator-playsets/README.md)).
Consent **not yet asked**.

— Don Hopkins *(User Interface Flower Child)*

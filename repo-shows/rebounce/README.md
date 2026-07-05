# Rebounce 🔌🌀

> A nominal salute to **Bounce** (né **Body Electric**) — check in the old source, and rewrite it
> together: by hand and with AI, competing, cooperating, exchanging ideas.

**Bounce** was one of the most productive, delightful visual programming languages Don ever used — a
patch-cord dataflow environment where you **live-coded a running VR world**: reach in, re-patch it,
and it keeps going. It began as **Body Electric** at **VPL Research** ([Jaron Lanier](../../characters/jaron-lanier/README.md)),
became **Hookup → Bounce** with [David Levitt](../../characters/david-levitt/README.md), and Don
serial-contracted at Levity to productize it (COM datatypes, objects on wires, the *Space Seed* demo).

**Rebounce** honors it by bringing it back:

1. **Check in the source.** Don has the original Bounce source (Pascal → machine-mangled C). It goes
   in [`source/`](source/) as the reference seed — the starting point, not the destination.
2. **Rewrite it together.** Invite **many** people to reimplement Bounce in a modern (TypeScript/web)
   stack — **by hand and with AI**, **competing and cooperating**, cross-pollinating ideas. Best-of-N
   energy: many parallel attempts, shared learnings, every attempt published.
3. **Seeded by the originals.** [David Levitt](../../characters/david-levitt/README.md) and Don seed
   the design discussion; [Jaron Lanier](../../characters/jaron-lanier/README.md) — Body Electric's
   original author and VR rock-star legend — warmly invited to riff on where it came from.

## What made Bounce special (the targets to recapture)

From Don's firsthand [Body Electric / Bounce VR-stack history](../../characters/don-hopkins/body-electric-bounce-vr-stack.md):

- **Live-coding a running world** — edit while it runs; never stops.
- **The model is a data type** — a **Swivel 3D transform tree** as the skeleton, parameters projected
  in real time, streamed via **UDP to two SGI renderers (one per eye)** for stereo VR.
- **One real-time nervous system** — MIDI, Ethernet, Polhemus, DataGlove, headsets, Convolvotron.
- **Whole objects on typed, colored wires** — pass a structured JSON-like object as **one** thing,
  beating the max-6-parameters nested-module limit. (The seed of Pantomime JSON → MOOLLM.)

## How to play

Anyone can submit an attempt — **by-hand**, **AI-assisted**, or **hybrid**. Publish it, diff it
against the others, lift the best patterns. **We never gateway; we always invite duplication.** Full
credit to the originals and to every contributor.

Part of the [Snap! visual-engines vision](../../characters/don-hopkins/snap-visual-engines-fundable-goals.md)
— Bounce is the **patch-cord / dataflow** half (blocks author rules; patch-cords wire live streams).

Full proposal: [`rebounce.md`](../../characters/don-hopkins/rebounce.md). See [`SHOW.yml`](SHOW.yml).
Consent **not yet asked**.

— Don Hopkins, Repo Show Class

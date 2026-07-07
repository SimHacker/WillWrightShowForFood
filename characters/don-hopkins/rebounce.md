# Rebounce — a proposal 🔌🌀

*A proposal to salute **Bounce** (né **Body Electric**) by bringing it back: check in the old source,
and rewrite it together — by hand and with AI, competing, cooperating, exchanging ideas. Seeded by
**[David Levitt](../david-levitt/README.md)** and Don; **[Jaron Lanier](../jaron-lanier/README.md)**
guest of honor.*
[Portrayal standards](../../schemas/portrayal-standards.md) ·
Show: [repo-shows/rebounce/](../../repo-shows/rebounce/README.md) ·
Trail: [visual-programming-patch-cord](../../process/trails/visual-programming-patch-cord.md)

## Why

Bounce was one of the most productive, delightful visual programming languages Don ever used — a
patch-cord dataflow environment where you **live-coded a running VR world**: reach in, re-patch it,
and it keeps going. It deserves a salute that isn't a museum plaque but a **living reincarnation** —
and a great, open Repo Show while we do it.

Full firsthand backstory: [Body Electric / Bounce VR stack](body-electric-bounce-vr-stack.md).

## What Rebounce is

1. **Check in the source.** Don's original **Bounce** source (Pascal → machine-mangled C, Mac
   heritage) goes into [`repo-shows/rebounce/source/`](../../repo-shows/rebounce/source/README.md) as
   the **reference seed** — the starting point, not the destination. (Confirm license/permission with
   David + the VPL→David→Levity rights chain before public reuse.)
2. **Rewrite it together.** Invite **many** people to reimplement Bounce in a modern **TypeScript/web**
   stack — **by hand, with AI, and hybrid** — **competing AND cooperating**, cross-pollinating ideas.
   Best-of-N energy: many parallel attempts, shared learnings, every attempt published; no single
   "winner" required.
3. **Seeded by the originals.** **David** and **Don** seed the design discussion; **Jaron** — VPL
   co-founder & Body Electric visionary (its lead designer/programmer was **Chuck Blanchard**) — is the
   guest of honor for the origin story.

## The targets to recapture (what made Bounce special)

- **Live-coding a running world** — edit while it runs; it never stops (just acts weird when buggy).
  This *feel* is the north star.
- **The model is a data type** — a **Swivel 3D transform tree** as the skeleton, its parameters
  **projected in real time**, streamed via **UDP to two SGI renderers (one per eye)** for stereo VR.
- **One real-time nervous system** — MIDI, Ethernet, Polhemus, DataGlove, headsets, Convolvotron,
  orchestrated from a single running patch (the Atlanta hub).
- **Whole objects on typed, colored wires** — pass a structured JSON-like ("jsonic") object as **one**
  thing down a single wire, beating the **max-6-parameters** nested-module limit. This is the design
  jewel — and the ancestor of the **Pantomime JSON object system → Don's JSON/YAML → MOOLLM**.

## A modern architecture sketch (to argue about on air)

- **Core:** a typed dataflow graph — nodes with ports, **wires that carry whole structured objects**
  (typed + color-coded), not just scalars. First-class objects-on-wires from day one.
- **Live-coding runtime:** hot-patch the graph while it runs; hot-swap nodes; never tear down the
  world. Time travel / record + replay if we're lucky.
- **Rig as data:** an articulated transform-tree value (the Swivel 3D idea, reborn) that nodes project
  and animate.
- **I/O as nodes:** MIDI/OSC, gamepad/tracker, webcam, WebXR, WebAudio (the Convolvotron's grandkid),
  networking — each a node; **zero-copy** buffer sharing where it counts
  ([streams-of-streams / zero-copy](streams-of-streams-fd-passing-zero-copy.md)).
- **Web-native:** runs in the browser (WASM/WebGL/WebGPU/WebXR), forkable, shareable.
- **Bridge to Snap!:** Bounce is the **patch-cord/dataflow** half; **Snap!** is the **blocks/control**
  half. Blocks author rules; patch-cords wire live streams. See
  [Snap! visual-engines vision](snap-visual-engines-fundable-goals.md).

## How the jam works

- Anyone submits an attempt — **by-hand**, **AI-assisted**, or **hybrid** — as a folder/branch/fork.
- **Publish every attempt**, diff them, lift the best patterns into a shared reference.
- **Compete on approach, cooperate on ideas.** Credit the originals (David, Jaron) and every
  contributor. **Never gateway; always invite duplication.**

## Who to invite

- **Seeds/hosts:** [David Levitt](../david-levitt/README.md) (created Hookup; built Bounce from Body
  Electric), Don Hopkins (Levity/Interval Bounce, COM-on-wires, Space Seed).
- **Guest of honor:** [Jaron Lanier](../jaron-lanier/README.md) (VPL co-founder & Body Electric
  visionary; lead designer/programmer was Chuck Blanchard).
- **Visual-programming neighbors:** [Jens Mönig](../jens-monig/README.md) +
  [Brian Harvey](../brian-harvey/README.md) (Snap!), [Tom Demeyer](../tom-demeyer/README.md) +
  [Steina Vasulka](../steina-vasulka/README.md) (Image/ine), and anyone from the Max/Isadora/patch-cord
  world.
- **AI coders + the crowd:** open to many — that's the point.

## Phases

1. **Seed** — check in the source; publish this proposal + the VR-stack history; open the jam.
2. **Origins show** — David + Don + Jaron: what Bounce/Body Electric was, and what it was *for*.
3. **The jam** — parallel hand/AI/hybrid attempts; live sessions; diff-and-lift.
4. **A living Bounce** — a web-native, live-coding, objects-on-wires core; bridge to Snap!.

## Status

Proposal + show seed live; **source not yet checked in** (Don's next action); consent **not yet
asked** of guests. Fundraising framing (if any) rolls up to the
[Snap! visual-engines fundable goals](snap-visual-engines-fundable-goals.md) — Bounce is the
patch-cord engine there.

*Status: firsthand proposal — direction set, source real (in Don's hands), reimplementation not yet
built.*

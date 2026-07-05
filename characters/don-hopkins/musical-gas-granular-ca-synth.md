# Musical Gas — a granular cellular-automata synthesizer (Don, firsthand)

*Don's own work — source still exists. A reimplementation target for the show, ideally built **with**
Laurie Anderson and friends. Not a claim about anyone else's work.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

## What it was
Don built a **"Musical Gas"** cellular automaton — a gas-lattice CA where particles move and **collide** on
a grid — and wired the **collision events to granular synthesis**. Every collision fires a **grain of
sound**, so the drifting, colliding gas *is* the score: the CA's dynamics play themselves.

**The sound mapping (Don's firsthand recollection):**
- **Granular synthesis driven by particle collisions** — each collision = one grain.
- **Combines one person's voice with another's pitch** — the grain's source material is one voice; its
  pitch comes from another source. Two people, braided into every grain.
- **Horizontal position → stereo panning** — a particle's **x** on the grid pans the grain left↔right, so
  you *hear* where the gas is churning.
- Built on **DirectSound** (Windows-era) for the real-time grain playback.

## Why it belongs in the show
- **Granular = resampling.** Chopping audio into grains and replaying them any-which-way is the show's
  [riff loop](../../repo-shows/ideas/themes/the-riff-loop.yml) in physical form — the same instinct as
  Laurie Anderson's **Talking Stick** (the MIDI audio-granulator she built with **Bob Bielecki** at
  **Interval**, the lab where Don worked). See [`../laurie-anderson/ideas.md`](../laurie-anderson/ideas.md).
- **CA lineage.** Sits right next to Don's **CAM6** cellular-automata machine (© 1992; 128×128
  wrap-around array; Toffoli & Margolus) — see [`media/simprov-exploratorium/simprov-exploratorium.yml`](media/simprov-exploratorium/simprov-exploratorium.yml).
  Same family as the show's CA/complexity guests: **Norman Margolus** (CAM-6),
  **Jim Crutchfield** (video-feedback / edge-of-chaos), **Scott Draves** (Electric Sheep).
- **Voice toys.** A sibling to **Pink Trombone** and the [Pink Trombone jam](../../apps/performance-space/pink-trombone-jam.yml) —
  the gas turns *voices* into an emergent, playable instrument.

## Also great with: Diffusion-Limited Aggregation (DLA)
The same grain-per-event mapping is **great with DLA** — diffusion-limited aggregation, where random
walkers stick and grow branching, coral-like structures. Every **stick / aggregation event** fires a
grain: the crystal *sings itself* as it grows. Two dynamical systems (colliding gas, growing dendrite),
one granular-synth voice engine.

## Reimplementation target — web tech, with Laurie & friends
- **Port to the browser:** CA/DLA sim in **WASM** (or a shader), grains via the **Web Audio API /
  `AudioWorklet`** — replacing the old **DirectSound** path. Runs anywhere, forkable, live.
- **Live segment idea:** two guests each donate a voice; the audience nudges the gas (or seeds the DLA
  crystal); everyone hears the collision-music braid their voices together in real time.
- **Ask Don for the source** — he still has it; the mapping above is the spec to rebuild from.

*Status: firsthand artifact + web-reimplementation target — not yet ported. Discuss + build with Laurie
Anderson and the granular/CA crew.*

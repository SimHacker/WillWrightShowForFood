# Musical Gas — a granular cellular-automata synthesizer (Don, firsthand)

*Don's own work — source still exists. A reimplementation target for the show (web port). Thematic
overlap with Laurie Anderson's granular instruments — a segment idea **if** she's interested, not
assumed. Not a claim about anyone else's work.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## What it was
Don built a **"Musical Gas"** cellular automaton — a gas-lattice CA where particles move and **collide** on
a grid — and wired **collision events to granular synthesis**. Every collision fires a **grain of
sound**, so the drifting, colliding gas *is* the score: the CA's dynamics play themselves.

Built on **DirectSound** (Windows-era) for real-time grain playback.

## Sound model (Don's firsthand)

**Two people, braided into every grain** — but the braid is not “person A's timbre + person B's timbre.”
One axis is **voice** (timbre/source material); the other is **pitch** (just a number — not somebody's
voice).

### Voice = 16 samples
A **voice** is a **set of 16 sounds** — not necessarily speech. Could be a human voice (David Levitt
**scat** sounds), or just **farts, laughs, burps**. Sixteen source grains to draw from.

### Note index = 16-way selection
The other dimension works like **MIDI notes**: each collision picks **one of 16 voice samples** (note
index 0–15). Don tried several spatial mappings — **pitch may have been vertical, pan horizontal** —
and various combinations.

### Frozen vs moving particles
Think of **static (frozen) particles** as **microphones**: each holds a **fixed note selection** — one
of 16 slots, like a mic tuned to a particular note.

**Moving particles** are the **voices** — each carries its own **16 samples**, one per note index.

When a **moving voice particle hits a frozen mic particle**, the collision **triggers the moving
voice's sample at the frozen particle's note index** — the mic picks the note; the voice supplies the
timbre. Two parameters, one event: *which note* (from the frozen particle) × *which voice bank* (from
the mover).

### Pan / pitch experiments
- **Horizontal position → stereo pan** was one mapping Don tried (hear where the gas churns).
- **Vertical → pitch** was another axis he experimented with.
- The exact axis assignment varied — the core contract is **voice bank + note index**, not a single
  fixed x/y→pan/pitch table.

## Why it belongs in the show
- **Granular = resampling.** Chopping audio into grains and replaying them any-which-way is the show's
  [riff loop](../../repo-shows/ideas/themes/the-riff-loop.md) in physical form — the same instinct as
  Laurie Anderson's **Talking Stick** (the MIDI audio-granulator she built with **Bob Bielecki** at
  **Interval**, the lab where Don worked). See [`../laurie-anderson/ideas.md`](../laurie-anderson/ideas.md).
- **CA lineage.** Sits right next to Don's **CAM6** cellular-automata machine (© 1992; **256×256**
  wrap-around array; Toffoli & Margolus) — HyperLook Exploratorium demo in [`media/simprov-exploratorium/simprov-exploratorium.yml`](media/simprov-exploratorium/simprov-exploratorium.yml).
  Same family as the show's CA/complexity guests: **Norman Margolus** (CAM-6),
  **Jim Crutchfield** (video-feedback / edge-of-chaos), **Scott Draves** (Electric Sheep).
- **Ambient gas.** Brian Eno's generative-ambient thread — set rules, let it run — meets Don's literal
  **Musical Gas**: collision grains into an emergent, listenable atmosphere. See
  [`../brian-eno/ideas.md`](../brian-eno/ideas.md).
- **Voice toys.** A sibling to **Pink Trombone** and the [Pink Trombone jam](../../apps/performance-space/pink-trombone-jam.md) —
  the gas turns *voices* into an emergent, playable instrument.

## Also great with: Diffusion-Limited Aggregation (DLA)
The same grain-per-event mapping is **great with DLA** — diffusion-limited aggregation, where random
walkers stick and grow branching, coral-like structures. Every **stick / aggregation event** fires a
grain: the crystal *sings itself* as it grows. Two dynamical systems (colliding gas, growing dendrite),
one granular-synth voice engine.

## Reimplementation target — web tech
- **Port to the browser:** CA/DLA sim in **WASM** (or a shader), grains via the **Web Audio API /
  `AudioWorklet`** — replacing the old **DirectSound** path. Runs anywhere, forkable, live.
- **Live segment idea:** two guests each donate a voice; the audience nudges the gas (or seeds the DLA
  crystal); everyone hears the collision-music braid their voices together in real time.
- **Ask Don for the source** — he still has it; the mapping above is the spec to rebuild from.

*Status: firsthand artifact + web-reimplementation target — not yet ported. Discuss + build with Laurie
Anderson and the granular/CA crew.*

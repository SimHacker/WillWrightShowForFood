# James P. Crutchfield 🦋

*Invitation portrayal — a respectful, source-grounded sketch, not Jim Crutchfield and not his words.*
[Portrayal standards](../../schemas/portrayal-standards.md) · consent level 3 · authored by Don Hopkins

## Who

**James P. Crutchfield** — "**Chaos**" — is a physicist and mathematician of complex systems:
**Distinguished Professor of Physics at UC Davis** and director of its **Complexity Sciences
Center**, external faculty at the **Santa Fe Institute**, and president of the **Art & Science
Laboratory** in Santa Fe.

As a UC Santa Cruz grad student in the late 1970s he was part of the legendary **Dynamical Systems
Collective** — the "Chaos Cabal" — with **Doyne Farmer, Norman Packard, and Rob Shaw**. Their
**"Geometry from a Time Series"** (1980) showed you could reconstruct a system's hidden attractor
from one stream of measurements; on the side they built hidden wearable computers to beat
**roulette** (told in *The Eudaemonic Pie*). The group is a centerpiece of James Gleick's *Chaos:
Making a New Science*.

His work runs right through this repo's obsessions: **video feedback** as a spatiotemporal
dynamical system (point a camera at its own monitor and watch chaos bloom); the **"edge of chaos"**
and **evolving cellular automata to perform computation** (with **Melanie Mitchell**); and
**computational mechanics** — the **ε-machine**, a method for discovering the intrinsic structure
and hidden computation inside any process.

## Why a Repo Show

This isn't a cold call: Don and Jim have known each other and corresponded for
decades (the history stays in Don's private archive), and Jim's public work —
video feedback, evolving cellular automata, computational mechanics — runs
straight through this repo's obsessions.

The show runs on **Will Wright's rule from the Spore talk: dust off your old
ideas every few years, because the world changes underneath them and the
reasons they were shelved expire.** The plans below are dusted-off old ideas
whose blockers are gone — *things have changed*.

### Don & Jim, over the years 🚤

The friendship predates Don's mail archive. Around **1990**, **Kathy Abelson** —
Don's office mate at Sun and technical writer on The NeWS Toolkit — handed him
a videotape of Jim's video-feedback film, correctly guessing he would love it.
It rewired him: Don's own feedback experiments (up through Mac-era video
feedback with live background removal) and the CAM6 performance platform grew
in its afterglow — see the [papers & film annex](papers/README.md).

Since then the conversation has kept circling the same strange attractors, in
person and by mail:

- **Video feedback** — the physics, the art, and the **director's-cut dream**:
  Don's old tape carried explanatory narration the online transfer lacks; it
  would be wonderful to hear it again — or better, record Jim narrating over
  the film, live.
- **Cellular automata** — evolving CA rules, structural complexity, CA
  pedagogy, and the CA-machine hardware lineage that runs to Norman Margolus.
- **Art & science** — talks in Santa Fe about Jim's **Art & Science
  Laboratory**: CA and video feedback for artistic purposes as well as
  scientific ones, and applying science to art.
- **Immersive visualization and games** — Jim's CAVE work and his
  long-standing wish to show it to the games world, Will Wright very much
  included.
- **Browser-based dynamics** — the shared itch to get chaos, CAs, and class
  demos running where anyone can touch them.
- **Amsterdam** — Jim visits; there has been canal boating with Ben Cerveny
  and friends, demos traded, and a standing invitation to come back — the
  Internet Archive's new European home is right on the boat route.

### The CA playground plan 🌸

**Norman Margolus has given Don permission to turn chapters of *Cellular Automata Machines* into
interactive instructional and artistic CA web apps.** The plan:

1. **First cut:** rewrite Don's old monolithic **CAM6** simulator as **modern, modular
  TypeScript** — the engine the playgrounds share.
2. **Design in the open:** brainstorm on air, write the designs down, check them in — this repo
  is the whiteboard and the archive.
3. **Jim's layer:** structural complexity on top of Norman's rules — excess entropy, ε-machines,
  1D CAs with 1+1D space-time diagrams (his stated pedagogy wish), the dripping handrail in a
   browser tab.
4. **Then a thousand flowers bloom** from the seeds — collaborators fork the playgrounds, and
  Jim's students get **homefun** ([homefun, not homework](../../process/homefun-grading.md)) that ships
   in public.

This is exactly what the show is for: brainstorm, document, commit, inspire.

### Somebody already built the rig 🎛️

While the browser-simulator question from Don's 2025 mail sat open, a stranger answered
most of it in native OpenGL: **[splashkes/crutchfield-machine](https://github.com/splashkes/crutchfield-machine)**,
an MIT-licensed GPU reimplementation whose credits map **Table I of the 1984 paper onto
named shader uniforms**, one row per knob. Twelve hot-reloadable layers, Kaneko-style
coupled fields on a flag, a camera layer that makes **variation (6)** the default
architecture, and an 8/16/32-bit precision switch that turns the paper's ~20-bits-per-pixel
Appendix budget into a live experiment about how long a cascade can last. Write-up,
corrections, and show beats: [`crutchfield-machine.md`](crutchfield-machine.md).

### The lineage — and remembering Ralph 🌀

The video-feedback thread starts a generation before Jim's 1984 paper: **Ralph Abraham**
published the camera-at-monitor loop as "Simulation of cascades by video feedback" at UCSC in
**1976**; Jim turned the demo into the formal dynamical-systems treatment. The handoff is
written up in [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md). Ralph died in September
2024; the show carries a **memorial segment** where Jim remembers him —
[`../ralph-abraham/memorial.md`](../ralph-abraham/memorial.md).

### The room

Dream companions for the CA/feedback jam: **[Scott Draves](../scott-draves/README.md)** (Electric
Sheep, generative feedback art) and **[Norman Margolus](../norman-margolus/README.md)** (CAM-6,
reversible CA — and the book behind the playgrounds). All Santa Fe Institute–adjacent; Jim's
**Art & Science Laboratory** is the shared turf where science and art are made in the same room.

## Browse

- Show seed: [`repo-shows/jim-crutchfield/`](../../repo-shows/jim-crutchfield/README.md)
- Papers & film annex: [`papers/README.md`](papers/README.md)
- The lineage: [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md)
- The GPU rig: [`crutchfield-machine.md`](crutchfield-machine.md)
- Joint CA show: [Norman Margolus](../norman-margolus/README.md) · Dream co-guest: [Scott Draves](../scott-draves/README.md)
- Live work / sources: [UC Davis CSC](https://csc.ucdavis.edu/~chaos/) · [Art & Science Laboratory](https://artscilab.com/) · [Wikipedia](https://en.wikipedia.org/wiki/James_P._Crutchfield)


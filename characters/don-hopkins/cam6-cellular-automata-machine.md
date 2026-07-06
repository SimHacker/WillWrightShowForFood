# CAM6 — Don's cellular-automata machine simulator (firsthand)

*Don's own work — source still exists and runs. The centerpiece of the
[Norman Margolus Repo Show](../../repo-shows/norman-margolus/). Not a claim about anyone else's work.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

## What it is
A **CAM6 simulator** — software-compatible with the **CAM-6** hardware described in Toffoli &
Margolus's ***Cellular Automata Machines*** (MIT Press, 1987). **256×256** wrap-around cell array.
Runs the classic rules straight out of the pages of the book, plus many rules and image-processing
effects Don added over the years.

Live app: <https://donhopkins.com/home/CAM6> · Source:
[`CAM6.js`](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) ·
Demo (tailored for Norman as the audience): <https://www.youtube.com/watch?v=LyLMHxRNuck>

## The lineage: C + Sun Forth → lookup tables → JavaScript

### C era — Mitch Bradley's Sun Forth
- **C emulator** for the CAM-6 hardware, plus a **Forth rule compiler / orchestrator** in **Mitch
  Bradley's Sun Forth** (Open Firmware lineage) — **compatible with the Forth rules in the book**.
- Forth ran each rule over **every possible neighborhood combination** and **compiled + saved lookup
  tables** — the same contract the CAM-6 hardware uses: neighbor bits → index → new cell state. Rule
  *definition* is compile-time luxury; the inner loop is always a table read.

### Ports in between
- **C++** and **Python** re-hosts along the way — same table contract, new platforms.

### JavaScript — `CAM6.js` (today)
1. **Bootstrap:** imported the **Forth-compiled lookup tables** into the JS codebase — faithful to
   what Sun Forth had already baked.
2. **Then:** rewrote **rules and the rule compiler in JS** — easier and better than carrying Forth
   forward in the browser stack. New rules compile to the **same lookup-table contract**; book rules
   still match bit-for-bit.

### Optional Forth extension (not shipped)
- CAM6.js **does not embed** a Forth interpreter at runtime. Rules live in **JS source**.
- **JS-Forth** in the repo ("delivered as-is, do not stick your tongue into the power supply") is a
  **possible extension** — or wire in WASM/JS Forth later for live Forth authoring like the book.
  Never the path Don took for the shipped JS version.

## DLA — straight out of the book
Don has a **Diffusion-Limited Aggregation** simulation running in it right now — the
**Margolus-dendrite** rule, **p. 167, §15.7** of *Cellular Automata Machines*. It runs on the
**Margolus-neighborhood** engine using the **same lookup-table contract** as the Forth rule compiler.
Random walkers diffuse, stick, and grow branching coral-like crystals — a direct, live-runnable Margolus artifact,
and a natural bridge to Don's [Musical Gas granular-CA synth](musical-gas-granular-ca-synth.md),
where every stick/aggregation event can fire a grain of sound.

## Shared memory — same library as HyperLook SimCity

The C-era CAM stack and **HyperLook SimCity** both used Don's **NeWS client/server shared-memory
raster library**: C backends write pixel planes; PostScript in the NeWS server renders them. The
**HyperLook CAM-6 playground** paired the C simulator with **HyperDraw** — **multiple zooming views**
of one live field, cut/paste between PostScript art and running cells, and a **lava-lamp window**
(bubbling CA clipped to a lamp-shaped mask). See
[`hyperlook-news-postscript-simcity.md`](hyperlook-news-postscript-simcity.md) and
[`../norman-margolus/the-cam6-demo-for-norman.md`](../norman-margolus/the-cam6-demo-for-norman.md).

## Rules & neighborhoods (a sampler)
Marble/Flower (anisotropic convolution kernels + heat diffusion), Life / Brain / Eco, **Margolus**
(HV-Gas, Critters, Wavers, Tron, **Dendrite**), Moore & VonNeumann lookup-table rules,
**JohnVonNeumann29** (the 29-state self-reproducing rule), and **RISCA** (a "Ridiculous Instruction
Set" where the top bits pick an opcode — Life, Brain, Torben, Anneal, logic, heat — per cell).
Heat-diffusion overlays, echo trails, pie-menu control, and script record/playback round it out.

## The show idea — two acts
1. **Play.** Bring up the existing thing live and run the classic rules with **Norman narrating** —
   Margolus neighborhood, Critters running backward, the DLA/dendrite rule aggregating in real time.
2. **Design.** The code is a gnarly, honest **monolith** — "ugly, but with some nice designs to
   cauldron out." Sketch, with Norman, what a **modern web version** wants to be: **JS rules with
   parameters and layered overlays** (ECHO trails, heat diffusion in upper bits) when that's easier
   than tables; lookup tables when speed demands it; something **better than XML templating** for
   composition; optional Forth; Snap! front end; shareable presets. Norman has already OK'd turning
   **book chapters into interactive playgrounds** — build **ground-up modular** rather than break down
   the monolith; gang layers **zero-copy**
   ([streams-of-streams notes](streams-of-streams-fd-passing-zero-copy.md)).

## Credits & connections
- **Source material:** Tommaso Toffoli & **Norman Margolus**, *Cellular Automata Machines* (MIT
  Press, 1987). Don's simulator follows their book and hardware directly.
- **The bridge:** **Milan and Henry Minsky** (MIT AI Lab) introduced Don to Norman.
- **Neighbors in the repo:** [Norman Margolus show](../../repo-shows/norman-margolus/),
  [Musical Gas](musical-gas-granular-ca-synth.md), and CA/complexity guests
  [Jim Crutchfield](../jim-crutchfield/) and [Scott Draves](../scott-draves/).

*Status: firsthand artifact — runs today; the "cauldron out a modern version" arc is a show-time
design goal, not done yet.*

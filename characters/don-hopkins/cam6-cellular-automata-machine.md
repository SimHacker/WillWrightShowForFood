# CAM6 — Don's cellular-automata machine simulator (firsthand)

*Don's own work — source still exists and runs. The centerpiece of the
[Norman Margolus Repo Show](../../repo-shows/norman-margolus/). Not a claim about anyone else's work.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

## What it is
A **CAM6 simulator** — software-compatible with the **CAM-6** hardware described in Toffoli &
Margolus's ***Cellular Automata Machines*** (MIT Press, 1987). It runs the classic rules straight
out of the pages of the book, plus many rules and image-processing effects Don added over the years.

Live app: <https://donhopkins.com/home/CAM6> · Source:
[`CAM6.js`](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) ·
Demo (tailored for Norman as the audience): <https://www.youtube.com/watch?v=LyLMHxRNuck>

## The lineage: C + FORTH → C++ → Python → JavaScript
- **Started** as a CAM6 simulator in **C and FORTH**, emulating the original CAM-6 hardware and
  compatible with the brilliant FORTH software Toffoli & Margolus wrote. FORTH is great at exactly
  this: defining rules and orchestrating the hardware.
- The FORTH ran the rule over **every possible neighborhood combination** to generate a **lookup
  table** — the same trick the CAM-6 hardware uses, concatenating neighbor bits into an index into
  the rule table. Rule *definition* can be as slow and high-level as you like, because it only runs
  at compile time, not in the inner loop.
- It **evolved a life of its own**: translated to **C++** and **Python**, then rewritten from the
  ground up in **JavaScript** (`CAM6.js`).
- **Today:** rules are defined in **JavaScript** and compiled to the **same lookup-table contract**
  the Forth rule compiler used — bit-for-bit faithful to the book while readable and hackable.

## Optional Forth extension (not shipped)
- CAM6.js **does not embed** a Forth interpreter. Rules are defined in **JS**, not interpreted in
  Forth at runtime.
- The repo includes **JS-Forth** ("delivered as-is, do not stick your tongue into the power supply")
  as a **possible extension** — or an off-the-shelf WASM/JS Forth could be wired in later so people
  can define rules in Forth live, the way the book teaches. That was never the shipped path.

## DLA — straight out of the book
Don has a **Diffusion-Limited Aggregation** simulation running in it right now — the
**Margolus-dendrite** rule, **p. 167, §15.7** of *Cellular Automata Machines*. It runs on the
**Margolus-neighborhood** engine using the **same lookup-table contract** as the Forth rule compiler.
Random walkers diffuse, stick, and grow branching coral-like crystals — a direct, live-runnable Margolus artifact,
and a natural bridge to Don's [Musical Gas granular-CA synth](musical-gas-granular-ca-synth.md),
where every stick/aggregation event can fire a grain of sound.

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
   cauldron out." Sketch, with Norman, what a **modern web version** wants to be: sim in **WASM** or
   a **shader**, a clean rule/neighborhood API, an optional embedded Forth, shareable presets/scripts.
   Norman has already OK'd turning **book chapters into interactive playgrounds** — build it
   **ground-up modular** (each rule a self-describing unit) rather than break down the monolith, and
   gang layers **zero-copy** ([streams-of-streams notes](streams-of-streams-fd-passing-zero-copy.md)).

## Credits & connections
- **Source material:** Tommaso Toffoli & **Norman Margolus**, *Cellular Automata Machines* (MIT
  Press, 1987). Don's simulator follows their book and hardware directly.
- **The bridge:** **Milan and Henry Minsky** (MIT AI Lab) introduced Don to Norman.
- **Neighbors in the repo:** [Norman Margolus show](../../repo-shows/norman-margolus/),
  [Musical Gas](musical-gas-granular-ca-synth.md), and CA/complexity guests
  [Jim Crutchfield](../jim-crutchfield/) and [Scott Draves](../scott-draves/).

*Status: firsthand artifact — runs today; the "cauldron out a modern version" arc is a show-time
design goal, not done yet.*

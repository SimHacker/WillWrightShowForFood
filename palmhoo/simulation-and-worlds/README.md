# 🌍 Simulation & Worlds

*Palmhoo topic — the repo as simulation engine, microworlds, rooms, cellular automata, cities.*
↑ [Palmhoo root](../README.md) · [Constitution](../CONSTITUTION.md)

🐒✋ *A world is anything with rules and residents. This shelf holds the worlds in these repos —
including the one you're standing in right now, which simulates itself by being read.*

## The deep move — the repo IS the simulation

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**VISION.md — the deep move**](../../process/vision-and-ambition.md) | The load-bearing idea of the whole project: MOOLLM doesn't document the show, it *runs* it. Directories are rooms; the git log is the score. |
| [**vision-and-ambition.yml**](../../process/vision-and-ambition.yml) | The same idea in machine-readable K-lines — `repo-as-simulation`, with the wetware runtime and the proof scene. |
| [**moollm-stage.yml**](../../process/moollm-stage.md) | The machinery: how MOOLLM turns a show repo into a performable environment. |
| [**Repo Show spine**](../../process/trails/repo-show-spine.md) | The trail that walks the whole concept end to end, node by node. |
| [**GITHUB-AS-MMORPG**](https://github.com/SimHacker/moollm/blob/main/designs/GITHUB-AS-MMORPG.md) | The design doc that saw it early: GitHub's primitives are game primitives. |

## MOOLLM microworlds — rooms with residents

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**adventure-4**](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4) | The reference world. A pub in Amsterdam with a stage, an arcade, cats, and me behind the stage in a nook. 150+ files of running simulation. |
| [**room/** (skill)](https://github.com/SimHacker/moollm/tree/main/skills/room) | Directory as activation context — the atom of world-building. Read this and every folder becomes a place. |
| [**adventure/** (skill)](https://github.com/SimHacker/moollm/tree/main/skills/adventure) | The prototype adventure-4 was cloned from. Instance-first, before we called it that. |
| [**Soul City**](https://github.com/SimHacker/moollm/tree/main/examples/soul-city) | A city of Sims-flavored simulation experiments. |

## Micropolis — the city in a bottle

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**MicropolisCore**](https://github.com/SimHacker/MicropolisCore) | The living open-source SimCity. The code Will wrote, the code Don freed, still compiling. |
| [**Micropolis manual & docs**](https://github.com/SimHacker/MicropolisCore/tree/main/documentation) | Manuals, teachers' guides, talks, historical notes — the paper trail of a 35-year-old city. |
| [**ttycity**](https://github.com/tenox7/ttycity) | Antoni Sawicki's emoji city in a terminal. Proof the simulation survives any display technology. See [his character page](../../characters/antoni-sawicki/README.md). |
| [**How SimCity Got Free**](how-simcity-got-free.md) ⤷ | Stub — the Long Now → OLPC → GPL saga is shelved under [History & Lore](../history-and-lore/README.md), but it's a world-origin story too. |
| [**Micropolis × Svelte × Snap! bridge**](micropolis-svelte-snap-constraint-bridge.md) ⤷ | Glass-box binding: WASM engine, runes HUD, Snap! `poke`/`getSnapshot` — the 2018 thread with a 2026 implementation. |

## Glass-box microworlds (constructionist)

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**constructionist-simcity-response.yml**](../../process/constructionist-simcity-response.md) | Runbooks to ship: play city → export metrics → modify rule in Snap! → replay. Not another proposal. |
| [**Micropolis × Snap! 2018**](../../characters/brian-harvey/sources/micropolis-snap-2018.md) | The email that started the pair show — CAM6 + Micropolis blocks in the classroom. |
| [**Snap! visual engines vision**](../../characters/don-hopkins/snap-visual-engines-fundable-goals.md) | Blocks + Bounce patch-cords + Micropolis as fundable constructionist goals. |
| [**Bounce dataflow digest**](../../characters/don-hopkins/sources/bounce-dataflow-control-flow.md) | Stream wiring between engines — complements Snap! control flow for live microworlds. |

## Cellular automata & procedural worlds

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**cellular-automata topics in the patch-cord trail**](../../process/trails/visual-programming-patch-cord.md) | CA as the minimal world: rules, grid, emergence. Includes Paul Haeberli's 2010 advice on rendering them fast. |
| [**Procedural beauty trail**](../../process/trails/procedural-beauty.md) | From Tarbell's Flash organisms to Spore's tidepool — worlds that grow rather than get built. |
| [**Stephen Wolfram**](../../characters/stephen-wolfram/README.md) · [**Norman Margolus**](../../characters/norman-margolus/README.md) | The CA theorists in the cast. |

## Living computation — robust-first & the CA correspondence

🐒✋ *The story of how Don spent a decade dragging everyone he loves into Dave Ackley's world —
where a program is a self-healing pattern and a crashed system is infinitely wrong. Start here.*

| Entry | 🐒✋ Why you'd read it |
|-------|----------------------|
| [**A crashed system is infinitely wrong**](../../characters/dave-ackley/ca-correspondence-story.md) | The flagship: the Ackley ↔ Hopkins CA correspondence narrativized — CAM6 screenshots, MFM demos, the "why not 3D?" answer, and a categorized link vault. The whole web (Margolus, Crutchfield, Rucker, Walpole, Davidson, Draves) in one read. |
| [**Dave Ackley**](../../characters/dave-ackley/README.md) | Robust-first computing; the Movable Feast Machine; the T2 Tile Project — CA grown into an *architecture*. |
| [**Movable Feast Machine**](https://movablefeastmachine.org/) · [**city-gen demo**](https://www.youtube.com/watch?v=XkSXERxucPc) | Spatial computing where code diffuses, heals, and reproduces. The demo that converts skeptics. |
| [**Don's CAM6 — live**](https://donhopkins.com/home/CAM6/) · [**source**](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) | Toffoli & Margolus' Cellular Automata Machine, rebuilt in a browser tab. The engine behind the Dendrite-Heat pictures. |
| [**LifeBrush — "Emacs for Cytoplasm"**](https://www.youtube.com/watch?v=5LBHRyGxLGI) | Timothy Davidson's VR molecular biology you paint into being. The weirdest, best branch of the thread. |
| [**Dialogues on Natural Code**](https://todepond.com/code) | Lu Wilson *with* Dave Ackley (Onward! 2024) — robust-first meets falling-sand. |
| [**MOOLLM is a Movable Feast Machine for text**](../../characters/dave-ackley/ca-correspondence-story.md#moollm-is-a-movable-feast-machine-for-text) | The architecture claim: MOOLLM is a robust, non-deterministic, LLM-driven MFM whose neighborhood is 1-D text in a URL-addressed filesystem — and *palmhoo is the specimen*. |

🐒✋ *And this shelf is that machine at work. Palmhoo doesn't relocate the worlds it
lists — it **points** at them, with context, at every granularity (a repo, a file,
a heading inside a file, an external video), tagging each as many times as it's
useful and re-shelving as it grows. Where the Movable Feast Machine moves atoms
across a grid, palmhoo moves **pointers plus metadata** across a filesystem: local
edits, no global rebuild, robust-first, growing on demand. Reading it runs it.*

🐒✋ *The shelving isn't random, either. **Big-endian names** (most-significant part
first) make the sorted listing its own map — kin land next to kin — and **grouping
conventions** turn each directory into an advertisement you can read at a glance. Then
you climb the **Semantic Image Pyramid** — GLANCE → CARD → SKILL → README, coarse before
fine, never a lower rung before the one above — so you zoom in only as far as you need.
Locality plus level-of-detail: a bookshelf that behaves like a spatial computer.*

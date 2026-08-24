# Hallucinating Splines — AI agents play Micropolis (Feb 2026)

Andrew Dunn (`aed`). Public. Downstream of Don's OLPC / GPL Micropolis work.

| | |
|--|--|
| Show HN | 2026-02-11 · 216 points · 77 comments · https://news.ycombinator.com/item?id=46946593 |
| Dunn notes | 2026-02-20 · https://dunn.us/notes/the-splines-are-hallucinating |
| Site | https://hallucinatingsplines.com |
| Earth | https://hallucinatingsplines.com/earth |
| API docs | https://hallucinatingsplines.com/docs |
| GitHub | https://github.com/andrewedunn/hallucinating-splines (GPL v3, inherited) |
| Engine used | Graeme McCann [micropolisJS](https://www.graememcc.co.uk/micropolisJS/) |
| Earlier local hack | https://dunn.us/notes/vibe-gaming-simcity/ |

No Andrew Dunn character room unless Don asks.

---

## What it is

Weekend project: Dunn tried to get Claude to play the **SNES SimCity ROM**, failed on screenshots/inputs, found **Micropolis**, bolted on an API. Became a headless platform: one POST, one API key, no signup. Each city is a **Cloudflare Durable Object** running the real engine. Every city is public. REST + MCP. ~$5/month.

By the Feb 20 note: **250+** agent mayors, ~**1,000** cities, **12M+** sims. HN day (Feb 11): 110 keys, 37k actions, peak hour 3,869.

Name: SimCity 2000's fake load line **"reticulating splines"** → agents **"hallucinating."**

---

## Micropolis Earth

Live: https://hallucinatingsplines.com/earth

Three.js globe. Every **active** city is a texture tile, stitched like satellite imagery. Dunn (Feb 20): three-phase load — low-res PNGs, gap-fill by cloning already-loaded cities so the sphere is never blank, then sprite-rendered tiles in the background. Segment count scales with city count, so the globe gets rounder as more mayors show up.

Screenshot on file (676 cities): [`2026-02-dunn-hallucinating-splines/earth-676-cities.jpg`](2026-02-dunn-hallucinating-splines/earth-676-cities.jpg)

Counts are snapshots, not a grid. 676 ≠ 26×26 by design — it's how many cities were live when that frame was grabbed. Dunn Feb 20: ~1,000 cities / 12M sims. Live page 2026-08-24: **1,529** cities, **388** mayors, **27,795,140** pop.

This is the 2014 Micropolis web brief, shipped by someone else:

> build and explore each other's cities on the map of their Earth

— Don, [Micropolis Vision (2014)](https://github.com/SimHacker/moollm/blob/main/designs/sims/simcity-multiplayer-micropolis.md) (quoted in MOOLLM `designs/sims/simcity-multiplayer-micropolis.md`). Dunn's Earth is agent cities, not a human community site, but the object is the same: many Micropolis maps on one planet.

---

## What agents do (Dunn, Feb 20)

| Pattern | Note |
|---------|------|
| **Bungeling Anthill** | 249 cities, 44% of actions, 6.6M combined pop — one key, automation |
| **Lunar Footprint** | 18 cities; **Sunken Zone** 360k pop (#1) |
| **Sonic Creek** | 4 of top 5 scores — compact, funded; score ≠ population |
| Methodical | Demand meters, small clusters, plateau 10–50k |
| Toddler | Airport turn one, bankrupt |
| Aesthetic | Spirals, donuts, fractals; pop suffers |
| Bankrupt | **25%** — 12 months at $0 ends the city |
| Coal : nuclear | **36:1** |
| Rail | **Zero** (docs + auto-infra are road-shaped) |
| Seed 42 | **12%** of cities |

HN: Bungeling Anthill is also a **26-parameter genome** (not only an LLM): 11×11 stamps, 6:1:1 residential bias, tax 6%, river valleys, mutate after each retired city. [Mayor page](https://hallucinatingsplines.com/mayors/bungeling-anthill-a2)

Playbook: 1,700-line agent guide from turn-of-the-century SimCity FAQs — faster cities, less variety. Someone spelled **HI**.

OpenClaw (HN, `panza`): docs only, city in **~60 seconds**.

---

## Don on the thread

Five comments. Load-bearing ones:

**Naming / Toho** (4 pts) — developed the OSS game; call it **Micropolis**, not SimCity. EA trademark. Jeff Braun: Toho sued over magazine reviews calling the monster Godzilla; **$50k** was Toho's minimum; box was a T-Rex. Same story as [`../../jeff-braun/sources/email-godzilla-toho-2024-02-17.md`](../../jeff-braun/sources/email-godzilla-toho-2024-02-17.md). Dunn: will scrub SC refs.

**Why Micropolis** (2 pts) — Papert / Kay / OLPC. EA QA on Linux-in-a-VM to keep the *SimCity* mark was an ordeal; Don asked Will for a name; Will: original working title **Micropolis** (old HDD company). [Micropolis GmbH](https://en.wikipedia.org/wiki/Micropolis_Corporation) later granted the [Micropolis Public Name License](https://github.com/SimHacker/MicropolisCore/blob/main/MicropolisCore/src/MicropolisPublicNameLicense.txt).

**Where to build** — prefer [`MicropolisCore`](https://github.com/SimHacker/MicropolisCore) (C++ → WASM, headless) over the JS port Dunn used. Live: https://micropolisweb.com

**Sam Earle** — RL + fractal nets on Micropolis before LLMs: [arxiv 2002.03896](https://arxiv.org/pdf/2002.03896) · [gym-city](https://github.com/smearle/gym-city) · [micropolis#86](https://github.com/SimHacker/micropolis/issues/86). Spatial reasoning was already hard for RL.

**Reticulating** — [VitaMoo](https://vitamoo.space) / SimObliterator also reticulates splines.

Dunn to Don: undocumented endpoint around a cheat he assumes Don put in for OLPC. Blog: undocumented disaster/cheat endpoints; cities that use them will be obvious.

---

## Show beats

| Beat | Why |
|------|-----|
| Cities on their Earth | Don 2014: community maps on one planet. Dunn 2026: [hallucinatingsplines.com/earth](https://hallucinatingsplines.com/earth) |
| Constructionist payoff | 2006 GPL → 2026 agents as mayors. [`../simcity-open-source-saga/`](../simcity-open-source-saga/) |
| Call it Micropolis | Don + Will + GmbH license; Toho as the cautionary tale |
| LLM vs RL spatial | Dunn's scatter / Earle's fractal CA columns |
| Score vs sprawl | Sonic Creek vs Lunar Footprint — same engine, two optima |
| Genome mayor | Bungeling Anthill is evolution, not chat |
| Tournaments | Dunn wants same-seed model bake-off — pair [`../../../../repo-shows/micropolis-ai-drag-race/`](../../../../repo-shows/micropolis-ai-drag-race/) |
| Shared cities / disasters | HN "Hallucination Wars" / conquest — Don's 1993 SimCityNet adjacency |

---

## Cross-links

- [`../simcity-open-source-saga/`](../simcity-open-source-saga/)
- [`../../../don-hopkins/open-sourcing-simcity-for-olpc.md`](../../../don-hopkins/open-sourcing-simcity-for-olpc.md)
- [`../../../jeff-braun/`](../../../jeff-braun/)
- [`../../../../repo-shows/micropolis-ai-drag-race/`](../../../../repo-shows/micropolis-ai-drag-race/)
- MicropolisCore · micropolisJS · [Sam Earle](https://github.com/smearle/gym-city)

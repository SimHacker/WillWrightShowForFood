# Will Wright Show For Food

**A Repo Show with Will Wright** — polyglot **MOOLLM microworld** + **pnpm monorepo**.
Browse without a GitHub account. Clone to play along.

> *"So you have a Repo to Show us?"*

**Stumbled here?** Long-term ambition since Will's **1996 Stanford talk** (and before) —
this repo is the **first public point of origin** (tip of the pyramid). Not a launch promise:
curb appeal up top, **brutalist GitHub underneath** (yaml girders, verify CI, real monorepo).
→ [**Vision** (readable)](process/VISION.md) · [yaml girder](process/vision-and-ambition.yml)

[![The User Interface Flower Child](repo-shows/will-wright/assets/DonHopkinsSimsCreditsIcon.jpg)](repo-shows/will-wright/README.md)

## The cream (start here)

| What | Where |
|------|--------|
| **Vision** (platforms, archives, viral readers) | [**process/VISION.md**](process/VISION.md) |
| **ShowMaker network** | [`process/showmaker-network.yml`](process/showmaker-network.yml) |
| **Repo Show format** | [`process/repo-show-format.yml`](process/repo-show-format.yml) |
| **Setup (dev)** | [**SETUP.md**](SETUP.md) |
| **The show pitch** | [`repo-shows/will-wright/README.md`](repo-shows/will-wright/README.md) · [**Will: browse any order**](repo-shows/will-wright/BROWSE.md) |
| **🤖 Slats / RoboResurrection** | [`slats-reincarnation.yml`](repo-shows/will-wright/slats-reincarnation.yml) · [`characters/slats/`](characters/slats/) |
| **1996 Winograd talk** (centerpiece) | [`repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/`](repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/) |
| **Draft invitation to Will** | [`repo-shows/will-wright/invitation.md`](repo-shows/will-wright/invitation.md) |
| **Guest roster** | [`characters/INDEX.yml`](characters/INDEX.yml) · [`characters/README.md`](characters/README.md) |
| **Portrayal standards** | [`schemas/portrayal-standards.yml`](schemas/portrayal-standards.yml) |
| **Live repo policy** | [`process/live-repo.yml`](process/live-repo.yml) |
| **AI-offs** (spend proof + thoughtful commits) | [`process/ai-offs.yml`](process/ai-offs.yml) |
| **Rig schema** | [`schemas/rig-schema.yml`](schemas/rig-schema.yml) · [`rigs/`](rigs/) |
| **Micropolis AI Drag Race** | [`process/micropolis-ai-drag-race.yml`](process/micropolis-ai-drag-race.yml) |
| **Manual Transmission** (smallest model that ships) | [`process/manual-transmission.yml`](process/manual-transmission.yml) |
| **Model branching** (fork chat, compare trajectories) | [`process/model-branching.yml`](process/model-branching.yml) |
| **Brain stream** (live Cursor on overlay) | [`process/brain-stream.yml`](process/brain-stream.yml) · [`apps/stream-gateway/`](apps/stream-gateway/) |
| **Slats** (judge + RoboResurrection) | [`characters/slats/`](characters/slats/) |
| **Code That Spec** (game show) | [`process/code-that-spec.yml`](process/code-that-spec.yml) |
| **Don Hopkins** (host bio) | [`characters/don-hopkins/README.md`](characters/don-hopkins/README.md) |
| **All show seeds** | [`repo-shows/INDEX.yml`](repo-shows/INDEX.yml) |
| **MOOLLM interface** | [`GLANCE.yml`](GLANCE.yml) · [`CARD.yml`](CARD.yml) |

## What this is

A **Repo Show**: live conversation whose stage is *this repo*, following through to working
code and shared technique. **Micropolis Class** — real people, credited ideas in public.
**Show, don't tell.** You do **not** need AI — bring your own rig.

**Long-term ambition** Don and Will have discussed since the **1996 Winograd microworlds
talk** (and earlier): a living repo you enter, fork, and breed — not just a video about
simulation. This public tree is the **apex seed** — small, inspectable, growing downward.
No production promises; see [**process/VISION.md**](process/VISION.md).

**Skills are the big harvest** — each show melts ideas in the cauldron and lifts
MOOLLM skills into [`skills/`](skills/) (composable with [moollm](https://github.com/SimHacker/moollm)).
Shows are the stage; inheritable technique is the stack that grows downward.

**Will Wright — first guest, topic-less.** Orbit the 1996 Dollhouse talk; crown jewel = **data portability**
(Proxi ↔ Sims ↔ …).

## How a Repo Show runs

Announced ahead of time (e.g. Hacker News) as a **pointer to this repo** — people **RTFR**
(read the repo) and follow along on **whatever rig they bring**: vim, Cursor, notebook, or
*pencil. **AI optional.** Man-against-the-machine encouraged — *dance-off optional.*
**[Code That Spec](process/code-that-spec.yml):** bid tokens — audience yells **CODE THAT SPEC!!!!!**
**[Manual Transmission](process/manual-transmission.yml):** *what's the smallest model that ships?* — Rubik-scoring on many rubrics; spend CSV = piss test; **orchestration gold** for multi-LLM training; MOOLLM [`rubric`](https://github.com/SimHacker/moollm/tree/main/skills/rubric) + [`experiment`](https://github.com/SimHacker/moollm/tree/main/skills/experiment) (Mike Gallaher); **[Slats](characters/slats/)** judges the werk.
**[Brain stream](process/brain-stream.yml):** prompts + thinking on the live overlay (Twitch/YouTube/OBS).
Rig costumes welcome (*Let's Make a Deal* / Stiletto Sprint energy). Guest = **Repo Man**. Audience = consensual characters + question PRs;
**Don Philahue** wrangles live. Ideas → cauldron → skills + code → **breed technique DNA**
back via git (branches, merges, nested worlds).

Run **your own show** on your branch; **PR to link** it into the [ShowMaker network](process/showmaker-network.yml).

Full definition: [`process/repo-show-format.yml`](process/repo-show-format.yml)

## Your rig — artisanal, intentional, vibe, or orchestrated

**Artisanal programmers** (humans programming by hand, **no AI**) earn **extra respect
here** — TextEdit to Emacs to VS Code and beyond; honesty appreciated. We also honor
**intentional coders** and **conscientious coders** — deliberate craft and show-your-work
ethics (Don coined **consciencious objectors** at a Kaleida meetup with **David Ungar**;
proposed show: [Self × MOOLLM](repo-shows/david-ungar-self-moollm.yml)).

**Vibe coders** — declare AI-forward flow; dance-off optional. **Orchestrated rigs** —
tell us the stack (below).

**Using AI?** We want real setups — tools, models, MCP, skills, repos, MOOLLM wiring,
contexts. Report **token usage and spending** too: we score **cost to ship** (efficiency
vs extravagance) *and* **solution quality**, then merge winners back and abstract reusable
parts into [`skills/`](skills/) and [`packages/`](packages/). **[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues)**
or PR with `rig-feedback` — preferably [`rigs/<slug>.rig.yml`](rigs/) per [`schemas/rig-schema.yml`](schemas/rig-schema.yml)
(lifecycle: download → install → configure → use → replicate → mash up). Details: [`process/repo-show-format.yml`](process/repo-show-format.yml).

## Polyglot monorepo

Two layers, one repo — patterned after [MicropolisCore](https://github.com/SimHacker/MicropolisCore)
(apps/packages/pnpm) and [moollm](https://github.com/SimHacker/moollm) (skills/characters/yaml-jazz):

| Layer | Paths |
|-------|--------|
| **MOOLLM microworld** | `repo-shows/`, `characters/`, `skills/`, `kernel/`, `schemas/` |
| **Code monorepo** | `apps/`, `packages/`, `pnpm-workspace.yaml`, `requirements.txt` |

Future: many apps sharing `@wwsff/*` packages + deps from MicropolisCore. Future show: teach Will
to build a MOOLLM adventure world — record it, ship it ([`examples/README.md`](examples/README.md)).

```bash
nvm use && corepack enable && pnpm install && pnpm run verify
```

Full instructions: [**SETUP.md**](SETUP.md).

## MOOLLM plugin world

Open alongside [`SimHacker/moollm`](https://github.com/SimHacker/moollm) in Cursor if you want
orchestration — composes via [`kernel/moollm-plugin.yml`](kernel/moollm-plugin.yml). Many
participants won't; that's fine.

## Wanna chat?

**[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues)** or submit a PR.

Platforms, archives, publishers, production shops: read [**VISION.md**](process/VISION.md) first —
inspect the yaml, run verify, then talk. No NDAs to understand the shape.

## Status

| Item | State |
|------|--------|
| Repo | **Public** — `SimHacker/WillWrightShowForFood` |
| Monorepo scaffold | pnpm + Python venv + verify CI |
| Will invitation | Draft ready — not sent (`consent: not_yet_asked`) |
| Phone call | 2026-06-24 |

## Sibling repos

| Repo | Role |
|------|------|
| [SimHacker/moollm](https://github.com/SimHacker/moollm) | Orchestrator + skills |
| [SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore) | Engine + packages |

— Don Hopkins *(the User Interface Flower Child)* 🌀

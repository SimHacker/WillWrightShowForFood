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
| **The show pitch** | [`repo-shows/will-wright/README.md`](repo-shows/will-wright/README.md) |
| **1996 Winograd talk** (centerpiece) | [`repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/`](repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/) |
| **Draft invitation to Will** | [`repo-shows/will-wright/invitation.md`](repo-shows/will-wright/invitation.md) |
| **Guest roster** | [`characters/INDEX.yml`](characters/INDEX.yml) |
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

**Will Wright — first guest, topic-less.** Orbit the 1996 Dollhouse talk; crown jewel = **data portability**
(Proxi ↔ Sims ↔ …).

## How a Repo Show runs

Announced ahead of time (e.g. Hacker News) as a **pointer to this repo** — people **RTFR**
(read the repo) and follow along on **whatever rig they bring**: vim, Cursor, notebook, or
pencil. **AI optional.** Man-against-the-machine taste and power competitions encouraged —
*dance-off optional.* Guest = **Repo Man**. Audience = consensual characters + question PRs;
**Don Philahue** wrangles live. Ideas → cauldron → skills + code → **breed technique DNA**
back via git (branches, merges, nested worlds).

Run **your own show** on your branch; **PR to link** it into the [ShowMaker network](process/showmaker-network.yml).

Full definition: [`process/repo-show-format.yml`](process/repo-show-format.yml)

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

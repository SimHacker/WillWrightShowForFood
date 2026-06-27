# Will Wright Show For Food

**A Repo Show with Will Wright** — polyglot **MOOLLM microworld** + **pnpm monorepo**.
Browse without a GitHub account. Clone to play along.

> *"So you have a Repo to Show us?"*

[![The User Interface Flower Child](repo-shows/will-wright/assets/DonHopkinsSimsCreditsIcon.jpg)](repo-shows/will-wright/README.md)

## The cream (start here)

| What | Where |
|------|--------|
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

A **Repo Show**: live conversation whose stage is *this repo*, following through to working code.
**Micropolis Class** — real people, credited ideas in public, AI implements on stream. **Show, don't tell.**

**Will Wright — first guest, topic-less.** Orbit the 1996 Dollhouse talk; crown jewel = **data portability**
(Proxi ↔ Sims ↔ …).

## How a Repo Show runs

Announced ahead of time (e.g. to Hacker News) as a **pointer to this repo** — people **RTFR**
(read the repo), open it in their own AI tools, and follow along live. The guest is introduced
as a **Repo Man**. The audience incarnates consensual characters and submits questions as PRs;
**Don Philahue** surfaces the relevant ones live. Design ideas get melted (**cauldron**) into
MOOLLM skills and built in Cursor.

Full definition + cauldron scoop semantics: [`process/repo-show-format.yml`](process/repo-show-format.yml)

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

Open alongside [`SimHacker/moollm`](https://github.com/SimHacker/moollm) in Cursor → composes via
[`kernel/moollm-plugin.yml`](kernel/moollm-plugin.yml). Export/sync from private DonHopkins:
[`process/sync-with-donhopkins.yml`](process/sync-with-donhopkins.yml).

## Wanna chat?

**[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues)** or submit a PR.

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
| DonHopkins (private) | Filtered export source |

— Don Hopkins *(the User Interface Flower Child)* 🌀

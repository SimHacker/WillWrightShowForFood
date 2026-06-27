# Repo Show skill — public live instance

**This repo is the public home of the Repo Show orchestrator.**

| Level | File |
|-------|------|
| Sniff | [`GLANCE.yml`](GLANCE.yml) |
| Interface | [`CARD.yml`](CARD.yml) |
| Protocol | [`SKILL.md`](SKILL.md) |
| Pitch | this README |

## What it is

A **Repo Show** is a collaborative, GitHub-native, live-streamed design conversation that **follows through to implementation**. The announcement is a pointer to a repo. People **RTFR** — read the fucking repo — and play along on whatever rig they bring.

> *"So you have a Repo to Show us?"*

## Where things live in WWSFF

| Concern | Path |
|---------|------|
| Canonical format (generated markup) | [`process/FORMAT.md`](../../process/FORMAT.md) — `pnpm run facades` |
| Format yaml girder | [`process/repo-show-format.yml`](../../process/repo-show-format.yml) |
| Show collection | [`repo-shows/`](../../repo-shows/) |
| Guests + invitations | [`characters/`](../../characters/) |
| Harvest landing | [`skills/`](../) |
| Rig personas | [`rigs/`](../../rigs/) |
| Flagship planted show | [`repo-shows/will-wright/`](../../repo-shows/will-wright/) |

## Lifecycle (short)

`SEED → PLANT → ELABORATE → INVITE → TEND → ANNOUNCE → AIR → HARVEST → RESEED`

- **Seed** — one yaml file (`repo-shows/foo.yml`)
- **Plant** — directory with room to grow (`repo-shows/foo/`)
- **RTFR** — audience reads + PRs before air
- **Air** — live stream; Cursor screencast; Don Philahue wrangles Q&A
- **Harvest** — cauldron → skills land in [`skills/`](../)

## Lineage

Transplanted from [`SimHacker/DonHopkins/skills/repo-show`](https://github.com/SimHacker/DonHopkins/tree/main/skills/repo-show). DonHopkins remains the private scratchpad; **WillWrightShowForFood is the public live microworld**.

Compose with [`SimHacker/moollm`](https://github.com/SimHacker/moollm).

## Run your own

Fork a show seed, plant it, link into [`process/showmaker-network.yml`](../../process/showmaker-network.yml). Declare your rig in [`rigs/`](../../rigs/) + [`SETUP.md`](../../rigs/_TEMPLATE.SETUP.md).

— Don Hopkins, Micropolis Class

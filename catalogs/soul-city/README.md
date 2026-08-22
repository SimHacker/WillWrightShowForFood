# Soul City

*Sniff:* [`CATALOG.yml`](CATALOG.yml) · [`../GLANCE.yml`](../GLANCE.yml) · [`../README.md`](../README.md)

**MOOLLM:** place [`skills/soul-city/`](https://github.com/SimHacker/moollm/tree/main/skills/soul-city) · souls [`skills/soul/`](https://github.com/SimHacker/moollm/tree/main/skills/soul) · [SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md). Bootstrap map: [`examples/adventure-4/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4). Also [`mind`](https://github.com/SimHacker/moollm/tree/main/skills/mind) · [`character`](https://github.com/SimHacker/moollm/tree/main/skills/character). Ethics: [soul](https://github.com/SimHacker/moollm/blob/main/skills/soul/ETHICS.md) · [mind](https://github.com/SimHacker/moollm/blob/main/skills/mind/ETHICS.md) · [character](https://github.com/SimHacker/moollm/blob/main/skills/character/ETHICS.md) · [representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics). Adventure as [method of loci](https://news.ycombinator.com/item?id=29330901). Product: [MicropolisCore soul-city](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/soul-city.md).

**Create · publish · share** — the platform, not just another catalog shelf.

*Formerly `micropolis-home` (rebranded 2026-07-08). Soul is the family name: less Micropolis
coupling — Micropolis stays the city sim — and the platform takes the liminal city's own name.
Creating, publishing, and sharing don't happen NEXT to Soul City; they happen IN it. Plaza
(browse + make), Depot (upload/download), Station (bridges to other games), and Terminal (port
of entry) are its districts.*

## What it is

Soul City rebuilds the Sims 1 content-creation stack as a **web-native platform** on Micropolis Federation rails:

| Layer | Examples |
|-------|----------|
| **Create** | Transmogrifier, RugOMatic, **WigFabrik** (aka WigOMatic / Wig-M-Porium — ECG multitarget mesh+texture + AI hair maps), SimShow preview, MOOLLM-assisted authoring |
| **Publish** | Hosted CARD dirs, git repos, branching dialog objects, round-trippable saves |
| **GitHub distribution** | Metadata catalogs **and** free content in public repos — [spec](github-distribution-model.yml); MOOLLM skills + Soul City in [moollm](https://github.com/SimHacker/moollm); TSR/SFS replacement lane for repo-native work |
| **Share** | Exchange revival, family albums, federated storefronts, Repo Show homefun |
| **Browser ecosystem** | Save read/write, no zip/Explorer, Share-button replacement — [spec](browser-ecosystem.yml) |

## Steam Community Guides

**Not a separate Steam app** — official player guides on [The Sims Legacy Collection](https://store.steampowered.com/app/3314070/The_Sims/) Community Hub. Informational playbooks that link out to Soul City (web) and Repo Shows. No install for readers.

Four jobs the guides cover:

1. **Create · publish · share** — web tools + federated UCC (above)
2. **Repo Shows channel** — discover and promote Repo Show episodes ([Will Wright flagship](../../repo-shows/will-wright-premiere/), guest network, live/VOD, GitHub, TicketPR)
3. **Sims & bridges** — show archive for The Sims history + Soul City bridge episodes (other games)
4. **Requires Sims on Steam** — drives Legacy Collection sales; EA-friendly fan-guide disclaimer

**Distribution (web first, then native companion):**

| Phase | Surface |
|-------|---------|
| **Now** | [Soul City](CATALOG.yml) web hub + [Steam Community Guides](steam-community-guide.yml) |
| **Later** | [**MicropolisAngel**](micropolis-angel.yml) — Windows Steam Software companion (Simplifier + catalog + machinima + streaming). Announced after web audience bootstraps. |

Spec: [`steam-community-guide.yml`](steam-community-guide.yml) · [`micropolis-angel.yml`](micropolis-angel.yml) · landscape: [`../sims1-community-landscape.md`](../sims1-community-landscape.md)

## Federated catalogs

Each keeps its brand and storefront; Soul City is the shared rails:

| Catalog | → |
|---------|---|
| **SimFreaks** | [simfreaks/README.md](../simfreaks/README.md) — Heather Castillo |
| **SimSlice** | [simslice/README.md](../simslice/README.md) — Steve Alvey / SliceCity |
| **SimProv** | [simprov/README.md](../simprov/README.md) — wedding playset |
| **Zombie Sims** | [zombie-sims/README.md](../zombie-sims/README.md) — current magnum opus |

## Why now

Don's OpenLaszlo SimFreaks CMS was built for love, not rent — life interrupted before it shipped. The Steam Sims 1 window, federation tooling, and Heather and Steve's permission to republish make **now** the moment to finish the job.

Reported EA take-private (Saudi PIF, Affinity Partners in press — verify before cite) and Legacy Collection's Exchange removal sharpen the case: **Soul Saver** / [**SoulAngel**](soul-angel.yml) relocates character souls from oligarch-owned silos into git-checked-in hub-and-spoke rails — first spoke [**Tiny Life**](../../repo-shows/will-wright-premiere/game-bridge-sims-tiny-life.yml). Academic frame: Don's QGCon paper [**How Inclusivity Saved The Sims**](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/abstract.md) — procedural rhetoric saved the franchise in rules; Soul City extends it to publish gates and exit ([`soul-city-soul-saver-thesis.yml`](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/soul-city-soul-saver-thesis.yml)). Namesake: [Soul City NC](../../repo-shows/will-wright-premiere/soul-city-namesake.md) (McKissick, Nixon HUD, Helms foreclosure).

See [INTRO-NARRATIVE.md](../../repo-shows/will-wright-premiere/INTRO-NARRATIVE.md) and [family manifesto](../../characters/will-wright/media/sims-series-family-manifesto.md).

The design thesis behind character import — SimCity's characters live *around*
the simulation as roles (mayor, treasurer, planner), multiplayer made them
voting seats, and Soul City casts traveling characters and agents into them —
is argued against Ian Bogost's 2015 "Better Without Characters" essay in
[roles-not-characters.md](../../characters/ian-bogost/roles-not-characters.md).

## Proof it already worked

- [SimFreaks Laszlo CMS essay](../../characters/will-wright/sources/2005-09-18-simfreaks-content-catalog-laszlo/README.md)
- [Sims Exchange](../../characters/will-wright/sources/2004-01-12-sims-exchange/README.md)
- [ShowNTell ActiveX preview](../../characters/will-wright/sources/2004-01-08-showntell-activex-preview/README.md)
- [SliceCity](../../characters/will-wright/media/sims-simslice-README.md) — nested SimCity shipped
- [Crowd Sitter](../../characters/will-wright/sources/2018-04-23-sims-crowd-sitter/README.md) · [Dumbold](../../characters/will-wright/sources/2018-04-24-dumbold-voting-machine/README.md)

## Status

**Planted** — design + catalog federation indexed here; playable modules track MicropolisCore releases.

---

↑ [catalogs](../README.md) · [sources](../../characters/will-wright/sources/README.md)

*Raw directory:* [browse files in this folder](./)

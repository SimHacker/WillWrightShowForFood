# Soul City portals and modules

*Architecture ruling (Don, 2026-08-29). One universe, many doors, all
of it built from reusable modules. Siblings:
[browser-ecosystem.md](browser-ecosystem.md),
[soul-angel.md](soul-angel.md),
[steam-app-strategy.md](steam-app-strategy.md). Naming:
`SOUL-FAMILY-NAMING.md` in the DonHopkins strategy repo.*

## Portals: game-specific doors into one universe

Each bridge destination gets a **portal**: a game-specific entry point
published at its own URL (tokens per the naming rules: `sims1`,
`tinylife`, `proxi`, later `sims2`..`sims4`). You start in the portal
for your game by default, and the entire Soul City universe is
reachable from inside every portal. The portal is the front door, not
a walled room.

Publisher brands appear nominatively only; the portals carry our
brands. The sims1 portal's toolset is **TMog**.

## Modules: local-first online tools

A portal is composed of **modules**: online tools for that game. The
defining rule is **local-first**:

- Modules perform content **read / write / edit / generate** against
  the player's own local files in the browser (the
  [browser ecosystem](browser-ecosystem.md) save read/write layer).
- No server round-trip is required to use a tool. No login gauntlet.
- **Private game save data is never uploaded as a side effect.**
  Publishing to Soul City is a separate, explicit, consent-first step,
  never a prerequisite for using the tools.

This is the Transmogrifier ethic carried forward: the 2000 tool ran on
your machine against your files; the 2026 modules run in your browser
against your files.

## Reuse: many things built from the same modules

Modules are the unit of reuse. The same module runs in:

| Host | How |
|------|-----|
| **Soul City portals** (web) | Default home; game-specific URL |
| **SoulAngel** (native) | WebView2 embeds the same modules beside the DVR/capture tier ([soul-angel.md](soul-angel.md)) |
| **Repo Shows** | Episodes embed or link modules as live demonstrations |
| **Steam Community Guides** | Guides deep-link into portal modules ([steam-community-guide.md](steam-community-guide.md)) |

Shared platform services under all portals: catalogs, Soul Albums,
souls, federation rails, the Depot/Plaza/Station/Terminal districts.

## TMog: the umbrella for sims1 content tools

**TMog** is the umbrella brand for our sims1 content tools -- the
continuation of the Transmogrifier / Rug-O-Matic / SimShow / ShowNTell
/ Tombstone Generator / Simplifier lineage. The **sims1 Soul Bridge**
(today specced as [micropolis-angel.md](micropolis-angel.md), rename
pending) *uses* TMog modules; the bridge is Soul family plumbing, the
tools are TMog.

Candidate TMog modules for the sims1 portal:

| Module | Lineage |
|--------|---------|
| Object cloner / converter (TMog proper) | Transmogrifier |
| Skin and body previewer | SimShow |
| Pattern generators (rugs, walls, floors) | Rug-O-Matic |
| Hair and mesh tool | WigFabrik (planned) |
| Family Album reader/writer | ShowNTell + native album round-trip |
| Tray and save inspector | TMog Bridge save layer |
| Graveyard manager | Tombstone Generator |
| Catalog browser and favorites | SimFreaks Laszlo CMS, the Plaza |
| [Stat-U-Matic](stat-u-matic.md) statue photo booth and scene poser | SimShow + the SimFreaks playset prototype; seed: VitaMoo viewer |

Below the modules sits a shared **texture plugin registry**: generic
generate/edit/apply texture plugins (material library, cellular
automata generator, AI image generation and editing) that any module
consumes -- Rug-O-Matic, WigFabrik, and Stat-U-Matic all pull from the
same plugins. Spec: [stat-u-matic.md](stat-u-matic.md).

Friend portals are cooperative, not extractive: Tiny Life modules with
Ell, Proxi modules with Galium -- shared formats, credit, and where
possible payment.

## Rules of thumb

1. Build the module before the monolith; every tool ships as a module
   something else can embed.
2. Local-first always; upload is a verb the player conjugates, never
   the platform.
3. Portals default in, never lock in: every portal exposes the whole
   universe.
4. Brand tools TMog (ours), bridges and platform Soul (ours), games by
   their own names (theirs, nominatively).

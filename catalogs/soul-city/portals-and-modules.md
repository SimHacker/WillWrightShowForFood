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
/ Tombstone Generator / Simplifier lineage. The **TMog suite** is its
codebase: TypeScript, running in the browser, based on the
SimObliterator Suite (the prior Python generation) -- the modules
below are TMog suite modules. The **sims1 Soul Bridge**
([sims1-soul-bridge.md](sims1-soul-bridge.md)) *uses* TMog modules;
the bridge is Soul family plumbing, the tools are TMog.

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
| [Stat-U-Matic](stat-u-matic.md) statue photo booth and scene poser | SimShow + the SimFreaks playset prototype; seed: VitaMoo viewer in the TMog suite |

| [GUID registry + remapper](guid-registry.md) (file cop on shrooms) | Magic Cookie registry + The Sims File Cop; the 2004 renovation plan asked for it |
| Object viewer + template instance browser | every template gets a stats page listing all public objects made from it -- the Tombstone Generator's index page, generalized |

Below the modules sits a shared **texture plugin registry**: generic
generate/edit/apply texture plugins (material library, cellular
automata generator, AI image generation and editing) that any module
consumes -- Rug-O-Matic, WigFabrik, and Stat-U-Matic all pull from the
same plugins. Spec: [stat-u-matic.md](stat-u-matic.md).

## Appliances: the AnythingOMatic pattern (Don, 2026-08-29)

WigFabrik keeps its exotic shop name -- and **WigOMatic is an
appliance WigFabrik sells**: a custom in-game object, like a dresser,
that manages all your wigs. Place it with the house editor or just
inject it into your catalog; pick a wig; dress and undress; organize
your own wig categories online, and the appliance **renders its pie
menu tree custom** from your categories and your wigs.

The pattern is generic: an accessory manager reskinnable as
**AnythingOMatic** -- DongOMatic, Pixel8OMatic, whatever the shop
stocks. Dress and undress accessories, easy peasy. Precedent with
full credit: the one-armed-bandit TMog Steve Alvey (SimSlice) made
for Don -- but less random.

Appliances are the sibling of tools-as-characters (rule 5 below):
the same online module embodied in the game as an OBJECT rather than
a character. Death fronts the graveyard toolchain; WigOMatic fronts
your wig library. Both render their pie menus from live online state.

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
5. Tools can be characters: embody a module as a character with a pie
   menu when the game already gives it a face -- Death is the
   graveyard manager ([sims1-soul-bridge.md](sims1-soul-bridge.md),
   "Tools as characters").

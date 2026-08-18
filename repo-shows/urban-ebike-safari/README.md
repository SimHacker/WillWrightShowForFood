# Urban eBike Safari

> Voice-controlled adventure navigation through a hidden graph of story cards at real-world places — Ray-Bans see and hear, phone shows the route, Bosch moves the bike, LLM translates intent.

| Field | Value |
|-------|-------|
| **Status** | seed |
| **Host** | Don Hopkins |
| **Participants** | Don Hopkins, Will Wright, Will's son |
| **Parent show** | [Urban Safari LIVE](../urban-safari-live/README.md) |
| **Live app** | [apps/ebike-safari](../../apps/ebike-safari/README.md) · [ebike-safari.com](https://ebike-safari.com/) |

## What this is

**Urban eBike Safari** is the 2026+ product layer on a fifteen-year lineage: geolocated scene cards, topical link layers, and adventure-style voice navigation while riding. Meta Ray-Ban glasses capture POV and handle mic/speakers; any phone on a handlebar mount is display-only (map, Bosch stats, turn-by-turn). Apple SpeechAnalyzer drives hands-free control. The rider never sees the graph — the LLM interprets natural language, hops virtual focus across nearby POIs and cards, then **set destination** arms Bosch/Apple routing.

Same family of ideas as **StoryMaker** and **Bar Karma** at Stupid Fun Club: audience-authored stories at real places — now rebuilt with modern maps, FIT rides, and open git instead of a dead server stack.

## Start here

| What | Where |
|------|--------|
| **Code + design cauldron** | [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) — FIT pipeline, MapLibre viewer, gesture/exposure design |
| **Live ride map** | [ebike-safari.com](https://ebike-safari.com/) — Amsterdam safaris (home scrub pending before public launch) |
| **Companion Repo Show** | [Urban Safari LIVE](../urban-safari-live/README.md) — real streets, scene cards, Will's son on camera |
| **StoryMaker / Urban Safari (2011)** | [storymaker-urban-safari.yml](../../characters/don-hopkins/media/storymaker-urban-safari/storymaker-urban-safari.yml) · [comprehensive demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ) |
| **SFC lineage + Will rejoin** | [stupid-fun-club.yml](../../characters/don-hopkins/career/stupid-fun-club.yml) · [lineage.yml](../../characters/don-hopkins/career/lineage.yml) |
| **Idea reactor (urban cluster)** | [crazy-idea-jam.yml](../../process/crazy-idea-jam.yml) — iLoci, coffeeshops, StoryMaker, GPS storytelling, Voystick, DreamScape |
| **MOOLLM skill** | [ebike-safari/SKILL.md](../../skills/ebike-safari/SKILL.md) |
| **Ride-game simulation example** | [urban-safari-ride-game.yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml) |

## Lineage at a glance

Not one prototype — a family of clients on one server idea: **rooms that kiss, cards at places, links between cards.**

| Era | Project | Note |
|-----|---------|------|
| 1995 | DreamScape (ScriptX @ WWDC) | Rooms + kiss-to-connect; [WWDC demo](https://www.youtube.com/watch?v=5NytloOy7WM) |
| 2008–11 | iLoci → StoryMaker → Urban Safari | TomTom trilogy; Will recalls Don to SFC; [StoryMaker demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ) |
| 2011–14 | MediaGraph | Songs on roads; pie-menu flick navigation |
| 2026 | Urban Safari LIVE | Git audience cards; async Will |
| 2026+ | **Urban eBike Safari** | This seed — eBike + voice + Ray-Ban + LLM narrator |

Deep spec: [`urban-ebike-safari.yml`](urban-ebike-safari.yml) (machine reading).

## In this directory

- [`urban-ebike-safari.yml`](urban-ebike-safari.yml) — full product seed (hardware, voice stack, licensing pitch, lineage chain)
- `SHOW.yml` — *not yet*; add when ready to run the show (lazy prototype promotion)

↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)

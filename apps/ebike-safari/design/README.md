# Ebike Safari — design cauldron

**Phase:** slurping — melt sources into this room, then distill into code and viewer.

Ebike Safari is **new from scratch** (FIT → GeoJSON → OSM → gestures + exposure + stories).
Urban Safari (SFC, Google Maps, MySQL) is [amber](../LEGACY-URBAN-SAFARI.md) — mine for lore,
don't port the stack.

## Read order

| File | Lines | Question |
|------|-------|----------|
| [`GLANCE.yml`](GLANCE.yml) | sniff | What room is this? |
| [`VISION.md`](VISION.md) | thesis | Why ride a bike through a graph? |
| [`ARCHITECTURE.yml`](ARCHITECTURE.yml) | layers | What gets built, in what order? |
| [`CAULDRON.yml`](CAULDRON.yml) | queue | What are we slurping in? |
| [`INDEX.yml`](INDEX.yml) | registry | Full file map |

## Pillars (design docs)

| Pillar | Doc | Status |
|--------|-----|--------|
| **Bike computer** | [`bike-computer.md`](bike-computer.md) | draft — **the shippable product**; a browser on the handlebar, replaces Bosch Flow |
| Bumps as input | [`bumps-as-input.md`](bumps-as-input.md) | draft — **a bump is a measurement, not a dialog box**; three axes, spoken labels, hits and dodges, puddles as next winter's potholes, Signalen loop |
| Mechanical Turk on an eBike | [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md) | draft — **verification worklists as a game**; tasks from measurements not map gaps, saddle/desk tiers, the prize is a door not a number, and the refusal list that keeps it from becoming gig work |
| Camera | [`camera.md`](camera.md) | draft — **half the app**; distance-sampled frames, four directions, local blur |
| Every screen | [`virtual-ride.md`](virtual-ride.md) | draft — **the desktop is a bike**; WASD, turtle graphics, dynamic queries, one point stream |
| Map distribution | [`map-distribution.md`](map-distribution.md) | draft — region packs, peer-assisted, the TomTom consent panel |
| City record | [`city-record.md`](city-record.md) | draft — **every street is a groove**; scrobbling, radio dial |
| Speech track | [`speech-track.md`](speech-track.md) | draft — commands vs impressions; Drescher food |
| Geometry as language | [`geometry-as-language.md`](geometry-as-language.md) | draft |
| Transgression | [`transgression.md`](transgression.md) | draft — late-night full-moon rides encouraged; 1 Hz replay |
| Patience | [`patience.md`](patience.md) | draft — wait at lights/signs; spend elsewhere; flowing heat map |
| Wait points | [`wait-points.md`](wait-points.md) | draft — ride-learned envelopes (TomTom tod/dow); anchor+radius; gather; lottery |
| Privacy | [`privacy.md`](privacy.md) | draft — 24h buffer default; home clip + dither; live is opt-in |
| Exposure Pac-Man | [`exposure-pac-man.md`](exposure-pac-man.md) | draft |
| Urban garden loop | [`urban-garden-loop.md`](urban-garden-loop.md) | draft — **don't complete, cooperate** |
| Animal herding | [`animal-herding.md`](animal-herding.md) | draft — pastures, paths, collies, cozy view |
| Peerboard and brews | [`peerboard-and-brews.md`](peerboard-and-brews.md) | draft — MMORPG |
| Semantic polder | [`semantic-polder.md`](semantic-polder.md) | draft — waterschap / Git-as-MMORPG |
| Map game platform | [`map-game-platform.md`](map-game-platform.md) | draft — many games, one map, layer composability; **the third-party test** — Safe Lanes as a contract, the frame not the plate |
| ONI / pinball platform | [`oni-map-platform.md`](oni-map-platform.md) | draft — street-graph ONI, bike pinball, replay branches |
| Embedding views | [`embedding-views.md`](embedding-views.md) | draft — factories, multi-embed plugins |
| Git ↔ Postgres sync | [`git-postgres-sync.md`](git-postgres-sync.md) | draft — yaml-jazz source of truth |
| Taxonomy pyramid | [`semantic-taxonomy-pyramid.md`](semantic-taxonomy-pyramid.md) | draft — LLM tags, coalesce |
| Smell navigation | [`navigation-smell-steer.md`](navigation-smell-steer.md) | draft — hill-climb, pie menu, MediaGraph |
| Graveyard layers | [`graveyard-soul-city.md`](graveyard-soul-city.md) | draft — real memorial + Soul City |
| Blocked bike lanes | [`sources/blocked-bike-lanes-record.md`](sources/blocked-bike-lanes-record.md) | harvested — Safe Lanes matched SFMTA's whole citation output; enforcement geography ≠ problem geography; loading zones not tickets; the measure-vs-capture fork |
| TomTom on HN | [`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md) | harvested — 38 comments, 2014–2026; BitTorrent maps, trace anonymisation, EPT, dynamic queries, why the PND died |
| CloudMade 2009 | [`sources/cloudmade-2009-stack.md`](sources/cloudmade-2009-stack.md) | harvested — **the map vendor is rented**; style 8558 switched off from London |
| Ben Cerveny jam | [`sources/ben-cerveny-city-record-jam.md`](sources/ben-cerveny-city-record-jam.md) | harvested |
| Ride gestures Sep 2026 | [`sources/ride-gestures-2026-09.md`](sources/ride-gestures-2026-09.md) | harvested — clockwise undo, De Pijp coloring book, maps |
| SotM 2026 Paris | [`sources/sotm-2026-paris.md`](sources/sotm-2026-paris.md) | harvested — **OSM ids aren't stable**; Panoramax opportunity |
| Amsterdam GPS lineage | [`sources/amsterdam-gps-lineage.md`](sources/amsterdam-gps-lineage.md) | harvested |
| TomTom rejected ideas | [`sources/tomtom-rejected-ideas.md`](sources/tomtom-rejected-ideas.md) | harvested |
| Lifelogging lineage | [`sources/foursquare-lineage.md`](sources/foursquare-lineage.md) | reference |
| XOSS collaboration | [`sources/abraham-moller-xoss.md`](sources/abraham-moller-xoss.md) | harvested |
| Product lineage | [`lineage.yml`](lineage.yml) | slurping |
| Demo bar | [`demo-bar.yml`](demo-bar.yml) | skeleton |

## Skeletons (implementation targets)

| Module | Skeleton | Depends on |
|--------|----------|------------|
| Road graph + snap | [`skeleton/road-graph.md`](skeleton/road-graph.md) | FIT pipeline ✓ |
| Gesture engine | [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md) | road-graph |
| Exposure log | [`skeleton/exposure-log.md`](skeleton/exposure-log.md) | road-graph, OSM |
| OSM enrichment | [`skeleton/osm-enrichment.md`](skeleton/osm-enrichment.md) | exposure-log |
| MapLibre viewer | [`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md) | DATA-CONTRACT ✓ |
| Story layer | [`skeleton/story-layer.md`](skeleton/story-layer.md) | gestures + exposure |
| Urban garden | [`skeleton/urban-garden.md`](skeleton/urban-garden.md) | gesture-engine, road-graph |

## Implemented today

[`../scripts/`](../scripts/) · [`../DATA-CONTRACT.md`](../DATA-CONTRACT.md) · [`../demo/`](../demo/)

## Show + history

- [`../../../repo-shows/ebike-safari/`](../../../repo-shows/ebike-safari/) — 2026 product seed (voice, camera, Bosch)
- [`../../../characters/don-hopkins/media/storymaker-urban-safari/`](../../../characters/don-hopkins/media/storymaker-urban-safari/) — 2011 Urban Safari artifacts
- [`../../../skills/ebike-safari/`](../../../skills/ebike-safari/) — skill activation

↑ [`../README.md`](../README.md)

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
| City record | [`city-record.md`](city-record.md) | draft — **every street is a groove**; scrobbling, radio dial |
| Speech track | [`speech-track.md`](speech-track.md) | draft — commands vs impressions; Drescher food |
| Geometry as language | [`geometry-as-language.md`](geometry-as-language.md) | draft |
| Exposure Pac-Man | [`exposure-pac-man.md`](exposure-pac-man.md) | draft |
| Urban garden loop | [`urban-garden-loop.md`](urban-garden-loop.md) | draft — **don't complete, cooperate** |
| Animal herding | [`animal-herding.md`](animal-herding.md) | draft — pastures, paths, collies, cozy view |
| Peerboard and brews | [`peerboard-and-brews.md`](peerboard-and-brews.md) | draft — MMORPG |
| Semantic polder | [`semantic-polder.md`](semantic-polder.md) | draft — waterschap / Git-as-MMORPG |
| Map game platform | [`map-game-platform.md`](map-game-platform.md) | draft — many games, one map, layer composability |
| ONI / pinball platform | [`oni-map-platform.md`](oni-map-platform.md) | draft — street-graph ONI, bike pinball, replay branches |
| Embedding views | [`embedding-views.md`](embedding-views.md) | draft — factories, multi-embed plugins |
| Git ↔ Postgres sync | [`git-postgres-sync.md`](git-postgres-sync.md) | draft — yaml-jazz source of truth |
| Taxonomy pyramid | [`semantic-taxonomy-pyramid.md`](semantic-taxonomy-pyramid.md) | draft — LLM tags, coalesce |
| Smell navigation | [`navigation-smell-steer.md`](navigation-smell-steer.md) | draft — hill-climb, pie menu, MediaGraph |
| Graveyard layers | [`graveyard-soul-city.md`](graveyard-soul-city.md) | draft — real memorial + Soul City |
| Ben Cerveny jam | [`sources/ben-cerveny-city-record-jam.md`](sources/ben-cerveny-city-record-jam.md) | harvested |
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

- [`../../../repo-shows/urban-ebike-safari/`](../../../repo-shows/urban-ebike-safari/) — 2026 product seed (voice, Ray-Ban, Bosch)
- [`../../../repo-shows/urban-safari-live/`](../../../repo-shows/urban-safari-live/) — 2011 performed live
- [`../../../skills/ebike-safari/`](../../../skills/ebike-safari/) — skill activation

↑ [`../README.md`](../README.md)

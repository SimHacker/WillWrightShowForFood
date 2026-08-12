# Skeleton — OSM enrichment

**Status:** not started  
**Feeds:** exposure-log, gesture-engine (encircle polygons)

## Job

Given bbox around ride, fetch or cache OSM features tagged for pellet mapping and gesture context.

## v0 approach

- Overpass query per ride bbox (dev)
- Later: regional PBF extract + local index

## Tag map

Maintain `osm-pellets.yml` (TODO) — `amenity=cafe` → `cafe`, etc.

**Read only.** Pellet tallies and game state never write back to OSM — emit overlay GeoJSON
for the viewer ([`viewer-maplibre.md`](viewer-maplibre.md#base-map-vs-overlays--do-not-pollute-osm)).
OSM way/node ids in territory YAML are **foreign keys**, not tags to upload.

## Caching

- `demo/` uses frozen extract for synthetic loop
- Real rides: gitignore cache under local data dir

↑ [`exposure-log.md`](exposure-log.md)

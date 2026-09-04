# Skeleton — MapLibre viewer

**Status:** not started  
**Proves:** demo-bar `map-replay`

## Job

SvelteKit (or static) app reading [`../../DATA-CONTRACT.md`](../../DATA-CONTRACT.md) manifest + GeoJSON.

## v0 features

- OSM raster/vector tiles (MapLibre)
- Ride polyline + scrubber/playhead
- Speed / elevation from `*.series.json`
- Home marker from manifest
- Layer toggle: gestures, exposure, transgression (when available)
- **Transgression replay:** playhead warped to **1 event/sec** — not FIT wall-clock.
  See [`../transgression.md`](../transgression.md). First tape: Schipluidenlaan clockwise loops.

## Base map vs overlays — do not pollute OSM

**OpenStreetMap is the shared world.** Pee layers, Peecons, polder dike seals, smell strength,
menus, and peer brews are **not** OSM tags — they reference OSM ids (`way/482910`, `node/…`)
but live in **Git YAML → build artifacts → MapLibre sources**.

| Layer | Source | Library / format |
|-------|--------|------------------|
| **Basemap** | OSM vector/raster tiles | MapLibre style + tile URL (OpenMapTiles, Protomaps, etc.) |
| **Rides / video** | FIT pipeline | GeoJSON ([`DATA-CONTRACT.md`](../../DATA-CONTRACT.md)) — already implemented |
| **Exposure pellets** | OSM query + ride log | GeoJSON built at ingest; OSM read via Overpass/pyosmium only |
| **Territory / smell** | `territory/` YAML | GeoJSON or MVT colored by `s(L,e)` on snapped way ids |
| **Polders / windmills** | `territory/polders/` | Polygon + point overlays |
| **Story cards** | Git scene YAML | Point GeoJSON at lat/lon or OSM node ref |

Nothing uses the **OSM editing API**. Overpass, Valhalla, and pyosmium **read** the base graph;
MapLibre **draws** your layers on top.

### MapLibre — native overlay stack

One style, many **sources**, stacked **layers**:

```javascript
map.addSource('safari-rides', { type: 'geojson', data: '/data/trips/demo-loop.geojson' });
map.addLayer({ id: 'ride-line', source: 'safari-rides', type: 'line', paint: { … } });

map.addSource('territory-strength', { type: 'geojson', data: '/data/territory/strength.geojson' });
map.addLayer({ id: 'pee-heat', source: 'territory-strength', type: 'line',
  paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'width'] } });

// skywriting: optional elevated contrail / fade-by-age on ride replay
map.addLayer({ id: 'skywrite-trail', source: 'safari-rides', type: 'line',
  paint: { 'line-blur': 2, 'line-opacity': ['interpolate', ['linear'], ['get', 'age'], 0, 1, 3600, 0] } });
```

At scale: **PMTiles** / vector tiles from territory ticks (tippecanoe, Protomaps). OSM untouched.
Toggle: **realistic** (exposure, isochrones) vs **cozy** (herding, farming) — same data, different style JSON ([`animal-herding.md`](../animal-herding.md#cozy-map-view)).

## Layer stack — enable / disable anything

The viewer is a **map game platform** — games **share data** on one graph; layers project slices
of that store ([`map-game-platform.md`](../map-game-platform.md)).

```yaml
# viewer/layers/catalog.yml  (built from design pillars)
groups:
  ride:
    - { id: ride_line, default: true }
    - { id: skywrite_trail, default: false }
  world:
    - { id: exposure_pellets, default: true }
    - { id: territory_smell, default: false }
    - { id: polder_dike, default: false }
  cozy:
    - { id: pasture_cozy, default: false }
    - { id: flocks, default: false }
    - { id: eggs_wool, default: false }
    - { id: bacon, default: false }        # meat / slaughter — opt-in
    - { id: mobile_vegetables, default: false }
    - { id: slime, default: false }
    - { id: manure, default: false }
  story:
    - { id: scene_cards, default: false }
  games:   # presets → see map-game-platform.md
    - { id: preset_touring, layers: [ride_line, exposure_pellets, scene_cards] }
    - { id: preset_mmorp_pee, layers: [territory_smell, skywrite_trail, peerboard_hud] }
    - { id: preset_cozy_farm, layers: [pasture_cozy, flocks, eggs_wool, manure, semantic_graze] }
    - { id: preset_waterschap, layers: [polder_dike, windmills, territory_smell] }
```

| Concern | Layer approach |
|---------|----------------|
| Vegan | disable `bacon`; optionally enable `mobile_vegetables` |
| Smell-averse | disable `territory_smell` |
| Real ride review | enable `ride_line` + `exposure_pellets` only |
| Full cozy farm | enable cozy group |
| MMORPG peerboard | enable `territory_smell` + `skywrite_trail` |

Persist in `viewer/layers/prefs.yml` or Capacitor localStorage. Sim ticks all layers; client
filters render + interaction prompts (no butcher UI if `bacon` off).

```javascript
function setLayer(id, on) {
  map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
}
// vegan: setLayer('bacon', false)
```

**Not OSM pollution** — every id is our overlay source, not a map tag.

### OSM-ecosystem tools — what each does

| Tool | Role | User overlays? |
|------|------|----------------|
| **MapLibre / Leaflet / OpenLayers** | Display | **Yes** — GeoJSON, MVT on OSM tiles |
| **Overpass API** | Query OSM | No — read-only enrichment |
| **pyosmium / libosmium** | Parse `.osm.pbf` | No — local index; game data separate |
| **Valhalla / OSRM / GraphHopper** | Route, isochrone, map-match | No — math; you render results as overlay |
| **uMap** | Product | **Yes** — OSM base + user GeoJSON, no OSM edits |

**uMap** is the reference product for "user overlays without polluting OSM." Ebike Safari = same
split, Git YAML as source of truth instead of uMap's server ([`semantic-polder.md`](../semantic-polder.md) GitHub-as-MMORPG).

Link by id, store semantics in repo:

```yaml
spawn: { edge: way/482910 }              # OSM ref — not an OSM tag
payload_ref: territory/payloads/menu.yml
```

Build joins way geometry from local PBF → overlay GeoJSON with game properties.

## Paths

```
viewer/                 # TODO — SvelteKit app
  src/
  static/data/          # symlink or copy from demo/web/data/
```

## Quick win

Load existing [`../../demo/web/data/manifest.json`](../../demo/web/data/manifest.json) + `demo-loop.geojson` first.

↑ [`../ARCHITECTURE.yml`](../ARCHITECTURE.yml)

# OSM pipeline — staged download, filter, PostGIS import

Raw Geofabrik PBF stays on disk under `deploy/osm/` (gitignored). PBF is already compact binary; we keep `.osm.pbf` as the canonical archive.

## Layout

```
deploy/osm/
  raw/           # netherlands-latest.osm.pbf, california-latest.osm.pbf
  filtered/      # nl-ways.osm.pbf, california-ways.osm.pbf (tag-filtered)
  valhalla/      # tile build output (Valhalla profile only)
```

## Containers

| Service | Profile | Role |
|---------|---------|------|
| **db** | always | PostGIS — `osm_ways`, rides |
| **osm-tools** | `tools` | osmium + import scripts; shares `./osm` mount |
| **valhalla** | `valhalla` | Map-match / isochrones / routing (optional, later) |

**Shared directory:** `deploy/osm` is mounted read-write into `osm-tools` and `/custom_files` for Valhalla. PostGIS does not need the PBF files — import talks to `db` over the Docker network.

No dynamic fetch service. Scripts only.

## npm scripts (from `apps/ebike-safari/`)

```bash
npm run osm:build        # build osm-tools image
npm run osm:download     # stage 1 — Geofabrik PBF
npm run osm:filter       # stage 2 — osmium tags-filter
npm run osm:import       # stage 3 — load osm_ways in PostGIS
npm run osm:pipeline     # all three
npm run osm:status       # disk + row counts
npm run valhalla:up      # optional map-match server (builds tiles from PBF)
npm run rides:import-pg  # FIT/json → rides + ride_points
npm run rides:edges      # snap ride to osm_ways → .edges.json
```

Or directly: `bash deploy/scripts/osm-docker.sh pipeline all`

## Stages (redo individually)

```bash
npm run osm:download -- all          # or nl | california
npm run osm:filter -- nl
npm run osm:import -- california
```

Delete `filtered/*.pbf` or `raw/*.pbf` to force redo of that stage.

## Valhalla (separate, not required for PG import)

Valhalla builds routing tiles from PBF in `deploy/osm/raw/`. First start can take hours for California. Bind to localhost `:8002`. Use for proper map-match later; v0 edge tracks use PostGIS nearest-way (`scripts/build_ride_edges.py`).

Copy or symlink PBF into `deploy/osm/` before `npm run valhalla:up`:

```bash
# valhalla container expects files under /custom_files
ls deploy/osm/raw/*.osm.pbf
npm run valhalla:up
```

## Import binge on VM

```bash
cd /opt/WillWrightShowForFood/apps/ebike-safari
sudo docker compose -f deploy/docker-compose.yml stop caddy viewer
npm run osm:build
npm run osm:download -- all
# filter + import after downloads finish
npm run osm:filter -- all
npm run osm:import -- all
sudo docker compose -f deploy/docker-compose.yml start viewer caddy
```

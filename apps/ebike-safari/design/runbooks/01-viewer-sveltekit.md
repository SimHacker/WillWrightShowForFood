# Runbook 01 — SvelteKit viewer (MapLibre replay)

**Goal:** Load [`DATA-CONTRACT.md`](../../DATA-CONTRACT.md) manifest + GeoJSON on a map with scrubber.  
**App:** [`../../viewer/`](../../viewer/)

## Prerequisites

- Node **20+** (22 recommended for MapLibre 6 engine field; viewer uses `.npmrc` `engine-strict=false` on 20)
- pnpm

## One-time setup

```bash
cd apps/ebike-safari/viewer
pnpm install
pnpm run sync:data    # demo/web/data → static/data
```

## Dev on laptop (primary loop)

```bash
pnpm run dev
# open http://localhost:5173 — synthetic demo-loop near 52°N 5°E
```

After a real FIT pipeline run:

```bash
cd apps/ebike-safari
python scripts/pipeline.py --sync --trips-dir demo/rides --out demo/web/data \
  --home-label "Badhoevedorp" --home-lat 52.333 --home-lon 4.789
cd viewer && pnpm run sync:data && pnpm run dev
```

## Build (static SPA for Capacitor)

```bash
pnpm run sync:data
pnpm run build      # output: viewer/build/
pnpm run preview    # smoke-test production bundle
```

## v0 checklist (demo-bar)

- [x] OSM raster tiles from manifest
- [x] Ride polyline
- [x] Scrubber + speed/alt from `*.series.json`
- [x] Play/pause animation (timestamp-paced)
- [ ] Layer toggles (gestures, exposure — when layers exist)

## Next

- [`02-capacitor-ios.md`](02-capacitor-ios.md) — same `build/` on device
- [`skeleton/viewer-maplibre.md`](../skeleton/viewer-maplibre.md) — full layer catalog

↑ [`README.md`](README.md)

---
name: ebike-safari
description: FIT ride pipeline for e-bike map views and video sync — Bosch Flow, GeoJSON, OSM tiles, ffprobe. New from scratch; distinct from legacy Urban Safari (SFC era).
allowed-tools: [Shell, Read, Write]
tags: [gps, fit, video, ebike, map, pipeline, bosch-flow]
---

# Ebike Safari — WWSFF skill

**Scripts:** [`../../apps/ebike-safari/scripts/`](../../apps/ebike-safari/scripts/)  
**Demo data:** [`../../apps/ebike-safari/demo/web/data/`](../../apps/ebike-safari/demo/web/data/)  
**Design:** [`../../apps/ebike-safari/design/README.md`](../../apps/ebike-safari/design/README.md)

Fresh stack: FIT → static JSON → MapLibre (planned). Git + YAML, not MySQL. OSM tiles, not Google Maps.

**Urban Safari** (2008–2011 SFC) is done — preserved in [`../../apps/ebike-safari/LEGACY-URBAN-SAFARI.md`](../../apps/ebike-safari/LEGACY-URBAN-SAFARI.md). Mine sources for show lore; don't port the old codebase.

## Quick start

```bash
cd apps/ebike-safari
pip install fitparse pymobiledevice3

python scripts/pipeline.py --sync \
  --trips-dir demo/rides --out demo/web/data \
  --home-label "Demo City" --home-lat 52.0 --home-lon 5.0
```

## Protocol

| Phase | Script | Purpose |
|-------|--------|---------|
| SYNC | `sync_flow_trips.py` | Pull `.fit` from iPhone Bosch Flow Documents |
| BUILD | `build_web_assets.py` | FIT → manifest + GeoJSON + series + meta |
| INSPECT | `inspect_fit.py` | Diagnose Bosch duplicate-row quirks |
| SYNC_VIDEO | `sync_video.py` | ffprobe wall-clock → GPS interpolation |
| MAP_TRANSCRIPT | `map_transcript.py` | Whisper words clustered on route |

Docs: [`DATA-CONTRACT.md`](../../apps/ebike-safari/DATA-CONTRACT.md) · [`design/`](../../apps/ebike-safari/design/) · [`bosch-fit-quirks.md`](../../apps/ebike-safari/bosch-fit-quirks.md)

## Show hooks

- [`../../repo-shows/ebike-safari/`](../../repo-shows/ebike-safari/) — 2026 product seed (voice, camera, Bosch)
- [`../../characters/don-hopkins/media/storymaker-urban-safari/`](../../characters/don-hopkins/media/storymaker-urban-safari/) — 2011 Urban Safari artifacts (amber)

Part of [WillWrightShowForFood](../../README.md).

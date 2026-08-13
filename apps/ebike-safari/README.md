# Ebike Safari — FIT pipeline + design cauldron

**New from scratch** — not a port of Urban Safari (SFC/Google Maps/MySQL era). GPS ride
tracking, Bosch Flow ingest, static map JSON, and a **design room** for gestures, exposure,
and the MapLibre viewer.

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · [`CARD.yml`](CARD.yml)  
*Design:* [`design/README.md`](design/README.md) — **slurping phase**  
*History:* [`LEGACY-urban-safari.md`](LEGACY-urban-safari.md)

## Rooms

| Room | Path |
|------|------|
| **Design cauldron** | [`design/`](design/) — vision, architecture, slurp queue, skeletons |
| **Scripts** | [`scripts/`](scripts/) — FIT → GeoJSON + video/transcript sync |
| **Viewer** | [`viewer/`](viewer/) — SvelteKit + MapLibre replay (Capacitor iOS) |
| **Runbooks** | [`design/runbooks/`](design/runbooks/) — scaffold, iOS, Postgres |
| **DB init** | [`db/init/`](db/init/) — PostGIS extensions + ride schema |
| **Demo data** | [`demo/`](demo/) — synthetic track |
| **Media** | [`media/`](media/MANIFEST.yml) — live viewer screenshots (all rides, De Pijp flood fill, backwards roundabout…) |
| **Skill** | [`../../skills/ebike-safari/`](../../skills/ebike-safari/) |
| **Show seed** | [`../../repo-shows/urban-ebike-safari/`](../../repo-shows/urban-ebike-safari/) |

## Quick start (pipeline)

```bash
cd apps/ebike-safari
pip install fitparse pymobiledevice3

python scripts/pipeline.py --sync \
  --trips-dir demo/rides --out demo/web/data \
  --home-label "Demo City" --home-lat 52.0 --home-lon 5.0
```

See [`scripts/README.md`](scripts/README.md) · [`DATA-CONTRACT.md`](DATA-CONTRACT.md)

## Design quick start

1. Read [`design/VISION.md`](design/VISION.md)
2. Check [`design/CAULDRON.yml`](design/CAULDRON.yml) for slurp queue
3. Pick a skeleton under [`design/skeleton/`](design/skeleton/)

## Related tools

| Tool | Role |
|------|------|
| [flowfit](https://hacdias.github.io/flowfit/) | Fix malformed Bosch FIT |
| [enhanced_xoss_sync](https://github.com/molleraj/enhanced_xoss_sync) | XOSS G BLE → FIT (future) |

↑ [`../README.md`](../README.md) · [`../../skills/ebike-safari/SKILL.md`](../../skills/ebike-safari/SKILL.md)

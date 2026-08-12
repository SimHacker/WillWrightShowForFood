# Abraham Moller — XOSS G adapter (collaboration)

Public collaboration note for the Ebike Safari ingest layer.

## Who

[Abraham Moller](https://github.com/molleraj) — Python tooling author. Don wants to
collaborate on a shared ride-mapping pipeline.

## What he built

[`enhanced_xoss_sync`](https://github.com/molleraj/enhanced_xoss_sync) — BLE sync for the
[XOSS G](https://www.xoss.co) bike computer. Argparse CLI, `bleak` for BLE, FIT export
without the XOSS cloud. Fork/improvement of [ekspla/xoss_sync](https://github.com/ekspla/xoss_sync).

House style matches Ebike Safari: small Python scripts, explicit CLI flags, files on disk.

## How it fits Ebike Safari

**Source adapters, shared sink.** Multiple ingest paths converge on FIT, then one pipeline:

```
{ sync_flow_trips.py | enhanced_xoss_sync.py | future GPX } → rides/ → build_web_assets.py → web JSON
```

| Path | Device | Status |
|------|--------|--------|
| `sync_flow_trips.py` | Bosch eBike Flow (iPhone USB) | live |
| `enhanced_xoss_sync.py` | XOSS G (BLE) | external adapter — Abraham |
| `build_web_assets.py` | — | live — vendor-agnostic |

XOSS FITs are expected to be clean (no Bosch duplicate-record merge). Run `inspect_fit.py`
once to confirm before relying on the shared contract.

Implementation notes: [`../../adapters/README.md`](../../adapters/README.md).

## Collaboration goals

Don and Abraham share:

- **FIT as interchange** — both pipelines land `.fit` in a trips directory
- **Argparse sister-scripts** — thin device adapters, fat shared builder
- **Map-all-rides view** — one manifest, many trips on OSM tiles
- **Video sync layer** — wall-clock match + route interpolation; video frame paths on the map

Ebike Safari owns the map contract, viewer skeleton, gesture/exposure layers. Abraham's tool
owns XOSS BLE ingest. No merge of codebases required — plug-in adapter pattern.

## Before reaching out

Demo the shared sink on Don's side first:

1. Map replay — all trips from `manifest.json` on MapLibre + OSM
2. Video sync — `sync_video.py` producing frame tracks over the route
3. One XOSS FIT through `inspect_fit.py` → `build_web_assets.py` (borrowed or synthetic)

Then propose: Abraham's BLE sync → `./rides` → same web JSON → same viewer.

## Design hooks (not his scope, but shared vision)

- Continuous ride trace beats manual check-ins (see [foursquare-lineage.md](foursquare-lineage.md))
- Bicycle as instrument — power/cadence/GPS from the computer, not just the phone
- Git + YAML + static JSON — no proprietary ride cloud required

↑ [`../CAULDRON.yml`](../CAULDRON.yml) · [`../../adapters/README.md`](../../adapters/README.md)

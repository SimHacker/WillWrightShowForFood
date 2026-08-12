# Runbook 04 — Real FIT through pipeline (pending)

**Goal:** One real Bosch Flow ride → `demo/web/data` → viewer replay.

```bash
cd apps/ebike-safari
pip install fitparse pymobiledevice3

# iPhone connected, Bosch Flow app installed
python scripts/pipeline.py --sync \
  --trips-dir demo/rides \
  --out demo/web/data \
  --home-label "Home" \
  --home-lat YOUR_LAT \
  --home-lon YOUR_LON

cd viewer && pnpm run sync:data && pnpm run dev
```

See [`../../scripts/README.md`](../../scripts/README.md) · [`../../bosch-fit-quirks.md`](../../bosch-fit-quirks.md).

↑ [`README.md`](README.md)

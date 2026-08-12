# Demo data — public-safe

| Path | What |
|------|------|
| [`web/data/`](web/data/) | Synthetic loop — checked in, no real GPS |
| [`rides/`](rides/) | Drop local `.fit` here for dev sync (gitignored except `.gitkeep`) |

Build:

```bash
python ../scripts/build_web_assets.py --trips-dir rides --out web/data \
  --home-label "Demo City" --home-lat 52.0 --home-lon 5.0
```

↑ [../README.md](../README.md)

# Runbooks — enabling work from the cauldron

Executable steps scooped from [`CAULDRON.yml`](../CAULDRON.yml) `next_slurp` and [`ARCHITECTURE.yml`](../ARCHITECTURE.yml) `build_order`.

| # | Runbook | Status | Proves |
|---|---------|--------|--------|
| 01 | [viewer-sveltekit.md](01-viewer-sveltekit.md) | **started** | demo-bar `map-replay` |
| 02 | [capacitor-ios.md](02-capacitor-ios.md) | **ios/ added** | iPhone shell loads same build |
| 03 | [postgres-postgis.md](03-postgres-postgis.md) | **live** | demo-loop in `rides` table |
| 04 | [pipeline-real-fit.md](04-pipeline-real-fit.md) | pending | ingest on real Bosch ride |

**Current wedge:** SvelteKit viewer on laptop → Capacitor iOS wrapper → Postgres when graph layers need it.

↑ [`../README.md`](../README.md)

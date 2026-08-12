# Skeleton — semantic polder (waterschap)

**Status:** not started  
**Spec:** [`../semantic-polder.md`](../semantic-polder.md)

## Job

Run **polder sim** on sealed hoods: track water level (aggregate layer strength), operate
**windmill pumps** with **semantic filters**, route outflow to canal/pond/sewage/black hole.
Git YAML is source of truth; PRs = water board votes.

## Modules

| Module | Input | Output |
|--------|-------|--------|
| `load_polder` | `territory/polders/*.yml` | polder config + dike boundary |
| `water_level` | polder P + active layers | scalar + per-layer breakdown |
| `tick_windmill` | mill config + layers in P | pull strength, filter, deposit/destroy |
| `apply_filter` | strength chunk + `{q, τ}` | pass → outflow target, fail → sewage |
| `deposit_outflow` | target ref + strength | update canal/pond/tank graph strength |
| `destroy_sewage` | strength | subtract from network (black hole) |
| `gesture_pump_boost` | ENCIRCLE(windmill) event | temporary pump_rate multiplier |
| `polder_metrics` | tick history | passed_volume, sewage_volume, peak level |

## v0 → v2

- v0: one sealed hood + one windmill + fixed filter → log pass/reject counts
- v1: canal outflow deposits to waterway edges; sewage destroys
- v2: Git PR workflow documented; multi-mill polder; board metrics artifact in build

↑ [`../semantic-polder.md`](../semantic-polder.md)

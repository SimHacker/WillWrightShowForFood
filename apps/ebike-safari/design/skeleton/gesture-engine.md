# Skeleton — gesture engine

**Status:** not started  
**Spec:** [`../geometry-as-language.md`](../geometry-as-language.md) · [`../urban-garden-loop.md`](../urban-garden-loop.md)

## Job

Detect **semantic gestures** on the road graph — not raw GPS wiggles.

## v0 gestures (pick one for demo bar)

| Priority | Gesture | Detection sketch |
|----------|---------|------------------|
| P0 | `ROUNDABOUT_LOOP` | Enter mini-roundabout graph; ~360°; exit same arm |
| P0 | `ENCIRCLE` | Closed loop around OSM `natural=water` / `leisure=park` polygon |
| P0 | `ENCIRCLE(fountain)` × N | Repeated loops — pump strokes into **commons tank** |
| P1 | `ENCIRCLE(block)` | Perimeter → **tend** shared community bed (not solo claim) |
| P1 | `COMPLETE_STREET` | Traverse all edges of a named way both directions |
| P1 | `CROSS_BRIDGE` | Edge with `bridge=yes` |
| P2 | `CLIMB_HILL` | Sustained elevation gain band |

## Outputs

- `trips/{id}.gestures.json` — `{ type, at_edge, osm_context, t_start, t_end }`

## Rules

- Engine emits **facts** only; no story text
- False positives OK in v0 if logged with confidence

↑ [`../demo-bar.yml`](../demo-bar.yml)

# Skeleton — gesture engine

**Status:** not started  
**Spec:** [`../geometry-as-language.md`](../geometry-as-language.md) · [`../urban-garden-loop.md`](../urban-garden-loop.md)

## Job

Detect **semantic gestures** on the road graph — not raw GPS wiggles.

## v0 gestures (pick one for demo bar)

| Priority | Gesture | Detection sketch |
|----------|---------|------------------|
| P0 | `ROUNDABOUT_LOOP` | Enter mini-roundabout graph; ~360°; exit same arm. Clockwise = undo + transgression ([`../transgression.md`](../transgression.md)) |
| P0 | `STOP` | Speed → 0 / brake event. Focus this node; dismiss on roll-on |
| P0 | `STOP(wait)` | Snap to a wait point (light, sign, **drawbridge**). Typical band → patience. Short pass → Bernoulli(`p`) ([`../wait-points.md`](../wait-points.md)) |
| P1 | `STOP(fake)` | In-band dwell where short-pass rate is high — patience + transgression |
| P1 | `GATHER` | Live bodies at a ferry / bus / tram wait point — social wait, `p` = 0 |
| P0 | `ENCIRCLE` | Closed loop around OSM `natural=water` / `leisure=park` polygon |
| P0 | `ENCIRCLE(fountain)` × N | Repeated loops — pump strokes into **commons tank** |
| P1 | `ENCIRCLE(block)` | Perimeter → **tend** shared community bed (not solo claim) |
| P1 | `COMPLETE_STREET` | Traverse all edges of a named way both directions |
| P1 | `CROSS_BRIDGE` | Edge with `bridge=yes` |
| P2 | `CLIMB_HILL` | Sustained elevation gain band |
| P0 | `BUMP` | Impulse in the motion stream — the one family measured in newtons rather than geometry. Classes and signatures in [`../bumps-as-input.md`](../bumps-as-input.md) |
| P1 | `CAPTURE` | Rider marks a frame — one touch, a spoken word, or retroactively from the buffer ([`../camera.md`](../camera.md)) |
| P0 | `BRAKE(hard)` | Deceleration beyond a threshold. Clusters are conflict points — the near-miss channel |
| P0 | `LAUNCH` | Acceleration from rest. Count them: launches are the true cost of a route, not meters |
| P0 | `SWERVE` | Lateral excursion that returns with no net heading change. Went around something. Carries side and offset, so dodges bound an obstacle the way hits measure one |
| P1 | `WOBBLE` | Low-speed lateral instability — the street is too full to ride, not too rough |
| P1 | `RAIL_TRACK(along)` | Sustained small lateral corrections on an edge whose lane holds tram rails |
| P0 | `DISMOUNT` → `WALK` | Speed to walking pace, ~2 Hz footfall, bike still rolling. The least ambiguous statement in the corpus |
| P1 | `LABEL` | Spoken word attached to the most recent event — the rider names what the sensors only measured |
| P1 | `CONFIRM(task)` | Answer to a question the corpus asked, about something just passed ([`../mechanical-turk-ebike.md`](../mechanical-turk-ebike.md)). `LABEL` names the unasked; this answers the asked. "Nothing there" is a valid answer and pays |

## Outputs

- `trips/{id}.gestures.json` — `{ type, at_edge, osm_context, t_start, t_end }`
- `trips/{id}.bumps.json` — impulse events, kept separate because they are dense and continuous
- `trips/{id}.dynamics.json` — brake, launch, swerve and gait events, with side and offset where lateral

## Rules

- Engine emits **facts** only; no story text
- False positives OK in v0 if logged with confidence
- Every event carries weather conditions, or hazards and drainage cannot be told apart later
- A dodge is evidence too. Absence of a bump never means absence of a hazard

↑ [`../demo-bar.yml`](../demo-bar.yml)

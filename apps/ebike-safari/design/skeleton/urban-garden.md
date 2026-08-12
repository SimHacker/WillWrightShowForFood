# Skeleton — urban garden loop

**Status:** not started  
**Spec:** [`../urban-garden-loop.md`](../urban-garden-loop.md)

## Job

Persistent **commons garden state** on road-graph nodes: shared beds, collective water,
contributor ledger, crops, virtual animals. Rides advance the sim via detected gestures.

**Don't complete, cooperate** — no solo plot lockout.

## State model (shared YAML — not per-rider deeds)

```yaml
# garden/commons/{block_osm_id}.yml
bed:
  kind: community
  opened_by: rider_a
  opened_at: 2026-08-10T12:00:00Z
  gesture: ENCIRCLE_BLOCK
contributors:
  - rider: rider_a
    action: plant
    item: tomato
    at: 2026-08-10T12:05:00Z
  - rider: rider_b
    action: water
    amount: 0.2
    at: 2026-08-10T18:00:00Z
crops:
  - type: tomato
    stage: mature
    water: 1.0
    planted_by: rider_a
    seed_scarce: true
spawns:
  - id: spawn_2026_08_10_a
    at: 2026-08-11T09:00:00Z
    items: { tomato: 5, basil: 2 }
    picks:
      rider_a: { tomato: 1, basil: 1 }
      rider_b: { tomato: 1 }   # visited; basil still available for rider_b
```

```yaml
# garden/fountains/{osm_id}.yml
pump_strokes_total: 47
commons_tank: 0.8
contributors:
  - rider: rider_a
    strokes: 12
  - rider: rider_b
    strokes: 8
```

## Modules

| Module | Input | Output |
|--------|-------|--------|
| `tend_bed` | ENCIRCLE block / ROUNDABOUT at plot | open or +1 tend credit on commons bed |
| `pump_water` | ENCIRCLE/ROUNDABOUT at fountain | `commons_tank` += stroke |
| `water_beds` | route proximity + draw from tank | bed `water` += ; log contributor |
| `tick_growth` | real time + collective water | stage transitions → **spawn** wave |
| `pick_spawn` | ride through bed + player_id | one of each item type per player per spawn |
| `spend_seed` | plant action | deduct from player's scarce seed inventory |
| `pigeon_flock` | scatter events | rare seed dispersal to open communal beds |

## v0 scope

- One **shared** block bed — two riders water it
- One fountain commons tank
- One crop matures → spawn wave with 5 tomatoes
- Two riders each pick 1 tomato (fair share); no race
- Planting next row requires a **seed** from scarce inventory

## Depends on

- [`road-graph.md`](road-graph.md)
- [`gesture-engine.md`](gesture-engine.md)

↑ [`../urban-garden-loop.md`](../urban-garden-loop.md)

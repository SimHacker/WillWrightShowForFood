# Ebike Safari — vision

**The world is the controller.** The bicycle is the turtle; OpenStreetMap is the microworld;
the ride is a program written on the street graph.

**Many games, one map — one shared data plane.** Exposure, territory, garden, polder, herding,
story, and future tenants **read and write the same stores**; layers are projections
([`map-game-platform.md`](map-game-platform.md)).

## One line

Continuous GPS rides become **semantic events** (gestures on the graph) and **exposure logs**
(what place-types passed you on both sides of the road) — the bike **skywrites** brew trails
as it moves — then optional **stories** an LLM reads from those events, not from hand-authored quests.

## Three layers of meaning

```
GPS trace
  → road graph (snap, edges, left/right frontage)
    → gestures (ROUNDABOUT, ENCIRCLE, COMPLETE_STREET, …)
    → exposure (homes, cafes, parks, bridges — Pac-Man on both sides)
      → stories (LLM interprets sequences; engine stays honest)
```

## Not Urban Safari

| Urban Safari (amber) | Ebike Safari (active) |
|----------------------|------------------------|
| Google Maps / MapKit | OpenStreetMap + MapLibre |
| MySQL scene graph | Git + YAML + static JSON |
| Proprietary map SDKs | FIT pipeline in [`../scripts/`](../scripts/) |
| SFC server stack | This repo + local FIT drops |

See [`../LEGACY-URBAN-SAFARI.md`](../LEGACY-URBAN-SAFARI.md) for where history lives.

## Not gamified distance

Score **novel exposure** and **recognized gestures**, not kilometers.

> Passed 83 homes, 14 cafes, 2 bridges — first windmill — ROUNDABOUT(clockwise) at Fountain Square.

## Show direction

Voice-first touring companion seed: [`../../../repo-shows/ebike-safari/`](../../../repo-shows/ebike-safari/).
Pipeline first; viewer + gestures prove the idea on real rides.

↑ [`README.md`](README.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

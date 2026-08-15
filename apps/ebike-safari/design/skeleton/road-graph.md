# Skeleton — road graph

**Status:** not started  
**Blocks:** gesture-engine, exposure-log

## Job

Snap FIT GPS points onto OSM **directed edges**. Each edge traversal records:

- `edge_id`, `way_id`, direction, duration, speed
- left / right frontage slots (for exposure)
- sequence index along ride

## Inputs

- GeoJSON from [`../../DATA-CONTRACT.md`](../../DATA-CONTRACT.md) (`trips/*.geojson`)
- OSM ways (Overpass or prebuilt extract)

## Outputs

- `trips/{id}.edges.json` — ordered edge log (see exposure-pac-man sketch)

## Open questions

- Map matching library (**Valhalla** preferred — map-match + `/isochrone` + bicycle costing)?
- Isochrone provider for time-budget smell hunts — Valhalla self-host vs ORS free tier vs GraphHopper
- Bidirectional ways vs inferred travel direction
- Tunnel / bridge disambiguation

## Isochrones (travel-time reach)

Same OSM graph as smell distribution ([`../peerboard-and-brews.md`](../peerboard-and-brews.md#isochrones--travel-time-reach-on-the-same-channels)).
Road-graph layer should expose:

- snap point → graph node/edge
- `reachable_edges(origin, minutes, profile=bicycle)` → edge set or GeoJSON contour
- optional `travel_time(a, b)` for path scoring during smell hunt

Valhalla and OpenRouteService both ship isochrone endpoints; see peerboard spec for full API table.

## Permeability (smell gates)

Road graph exports **edge ids** and **node ids** for territory layer. Each may carry
`permeability p ∈ [0,1]` — how smell diffuses across that segment or intersection
([`../peerboard-and-brews.md`](../peerboard-and-brews.md#permeability--seal-neighborhoods-block-leaks)).

- Default `p=1` on all edges/nodes from OSM extract
- Overrides in `territory/graph/permeability.yml`
- Hood seals: perimeter boundary list in `territory/hoods/{name}-seal.yml`
- OSM seeds for low-`p`: `barrier=wall`, `access=private`, gated paths

Physical **bike routing** may still traverse sealed edges; permeability gates **diffusion only**
(unless routing profile later respects the same gates).

## Slurp from amber

- [`../../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md`](../../../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) — pie network on map (viewer UX)

↑ [`../ARCHITECTURE.yml`](../ARCHITECTURE.yml)

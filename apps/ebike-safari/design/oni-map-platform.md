# ONI on the street graph — map pinball platform

**Ebike Safari = Oxygen Not Included on an OSM road + water graph.** Same conservation
instincts: phased fluids, pressure/level, pumps, pipes, tanks, refineries, animals at shared
holes, overflow if you skimp on **dijken**. Our base map is streets and canals; layers are
smell, tags, turds, gems — not oxygen and polluted water — but the **math rhymes**.

Strong reference: Klei ONI (gas/liquid layers, reaction, critters, ranching, plumbing).
Our twist: **bike as pinball flipper**, **GPS replay as time scrub**, **Git branches as
ride forks**, **MOOLLM characters as AI players**.

## ONI ↔ our mapping

| ONI | Street graph sim |
|-----|------------------|
| Gas pressure | Smell **concentration** / tag mass in polder air |
| Liquid level | **Water level** = `Σ s(L,e)` inside sealed hood |
| Overflow | Dike breach → leak to neighbor polder / canal |
| High dijk investment | Permanent fence, low permeability — costs tend credit |
| Multiple elements | Multiple **layer types** on same edge (Thai + manure + peer) |
| Pipes / pumps | Git events + windmills + locks + Factorio-style **pipe graph** |
| Refinery | **Embedding factory** — combine/break layers (see [`embedding-views.md`](embedding-views.md)) |
| Wild critters at hole | Ducks/geese at pond; sheep graze smell |
| Ranch / capture | `ENCIRCLE(pond)` → carry flock; Link chickens |
| Polluted → clean | Windmill filter τ; sewage destroy |

## Pinball construction set on the map

The **demo is the game**. Web/mobile browser — no install required for audience; real bikers
play with remote operators later.

| Piece | Behavior |
|-------|----------|
| **Bike** | Pinball body — mass, velocity, scrub playhead |
| **Flippers** | Remote players / AI bots trigger gates, fences, pumps |
| **Gadgets** | Roundabout-around detector, pond lap harvest, canal fill |
| **Multiplayer** | Many bikes + bots on same world; real-time or async |
| **AI players** | MOOLLM characters tend shops, parks, chess, concession stands |
| **Construction set** | Place windmills, temp fences, Peecons on map (permissions via Git) |

### Real rides → living demo (not a ghost town)

Your FIT library = **demo GPS streams**. Retrocon: add gadgets later, **re-simulate** old
traces → score goes up/down.

```
ride branch main     — original FIT
ride branch pond-lap — fork: scrub to t=12:04, take simulated bike, re-record
```

Git stores ride events; replay applies **current** gadget set → new score. Debugging tools
(scrubber, layer toggles, sim params) are **in-game UI**, not dev-only.

### Real POI → virtual inventory

| Real OSM POI | Virtual drop |
|--------------|--------------|
| `historic=windmill` | Collect **virtual windmill** token → place on map anywhere |
| `shop=bakery` | Buy **virtual bread** → feed ducks/geese/swans/pigeons |
| `natural=water` / pond in park | Lap `ENCIRCLE` → harvest water → carry to plants |

Virtual items are Git YAML + sim state; OSM stays read-only.

## Animals, herding, ONI ranching

See [`animal-herding.md`](animal-herding.md), [`semantic-polder.md`](semantic-polder.md).
Animals **need and produce** resources: gas-like layers, liquids, turds, food, gems. Shared
**drinking holes** = pond nodes where multiple species compete for concentration.

## Product stance

1. **Standalone fun** — bike simulator + pinball map playable alone in browser.
2. **Real bike writes facts** — FIT → manifest; web replays with simulated bike.
3. **Online** — remote flipper operators, multiple bikes, bots as citizens.
4. **Branching time** — scrub, take over, re-record, merge via PR.

↑ [`map-game-platform.md`](map-game-platform.md) · [`VISION.md`](VISION.md) · [`git-postgres-sync.md`](git-postgres-sync.md)

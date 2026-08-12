# Map game platform — sharing data between games

**This is ALL about sharing data between games.**

Layers are just the **view**. The platform is a **shared data plane** on one OSM graph —
many map-based games **read and write the same cells**, the same edges, the same Git YAML,
the same ride event log. Enable/disable layers chooses what you **see**; the world **interoperates**
through common contracts whether or not you're looking.

```
                    ┌─────────────────────────────────┐
                    │  Shared data (Git + build JSON) │
                    │  graph · layers · beds · flocks │
                    │  ride events · exposure · gates   │
                    └───────────────┬─────────────────┘
            read/write      read/write      read/write
                 │                │                │
           ┌─────▼─────┐   ┌──────▼──────┐  ┌─────▼─────┐
           │  Smell /  │   │   Garden /  │  │  Touring  │
           │  pee game │   │   herding   │  │  + story  │
           └─────┬─────┘   └──────┬──────┘  └─────┬─────┘
                 │                │                │
                 └────────────────┼────────────────┘
                                  │ project
                          ┌───────▼────────┐
                          │ MapLibre layers│  ← optional visibility
                          │ (bacon off…)   │
                          └────────────────┘
```

OSM is the floor (read-only). **Git YAML + built artifacts** are the shared database.
MapLibre is projection. The bike produces **ride facts** every game may consume.

## Platform vs product

| Monolith | Platform (this design) |
|----------|------------------------|
| siloed game state | **games share writes** on graph cells |
| duplicate gesture detection | **one event**, many sims react |
| parallel inventories | commons pools + fair pick |
| UI modes | **data interlock**; layers are skins |
| pollute OSM | foreign keys `way/id` + overlay payloads |

Ebike Safari tenants (exposure, territory, garden, polder, herding) are **consumers and producers**
of the same data — not separate apps glued in a viewer.

## Shared data contracts — the actual platform

Every game **declares what it reads and writes**. No private shadow graphs.

| Shared store | Writers | Readers | Example flow |
|--------------|---------|---------|--------------|
| **`road_graph`** (edge log) | ingest, snap | all sims | `way/482910` is the join key |
| **territory/layers/`** strength + embedding | pee, Peecon, skywrite, poo | smell nav, windmill, **grazing**, **ambient rise** |
| **`territory/ambient/`** L1+ bins | rise from L0 fade | wide nostrils, block haze, grazing fallback | sheep **writes** bite; windmill **reads** |
| **`garden/beds/`** | tend, plant, water | harvest, pigeons, story | exposure **reads** frontage → seed hint |
| **`herding/flocks/`** | sim tick, gates | collies, garden (pollinate) | manure layer **writes** fertility |
| **`polders/`** | waterschap PR | windmill, permeability | pump **mutates** layer strength |
| **`graph/permeability.yml`** | dike seal, gates | diffusion, slime, animals | one gate table, many sims |
| **`rides/{id}/events.json`** | gesture engine | story, peerboard, bingo | one ENCIRCLE → N game reactions |
| **`exposure/{id}.json`** | exposure log | garden, bingo, LLM | pellet tallies are facts |
| **`manifest.json`** | pipeline | viewer, all games | index into shared artifacts |

**Interlock = data flow**, not a feature bullet. Herding doesn't "integrate with" smell — it
**eats** `s(L,e)` from the same sparse strength file the pee game wrote.

```yaml
# design/games/herding.contract.yml  (pattern for every game)
id: game/herding
reads:
  - territory/layers/*/strength.yml
  - garden/beds/*
  - graph/permeability.yml
  - territory/gates/*
writes:
  - herding/flocks/*
  - territory/layers/manure-*   # new layers = shared store
  - garden/beds/*/pollinated
emits_events: [graze, poo, gate_cross, fair_pick]
```

New game = new contract file listing **reads, writes, events** — not a forked codebase.

## Ride event bus — detect once, share everywhere

```
GPS trace → snap → gestures + exposure + edge crossings
  → append ride/{id}/events.json

[
  { "t": "…", "kind": "gesture", "name": "ENCIRCLE", "target": "block/demo-7" },
  { "t": "…", "kind": "exposure", "edge": "way/482910", "left": { "cafe": 2 } },
  { "t": "…", "kind": "territory", "op": "skywrite", "edge": "way/482911", "layer": "L-0042" }
]
```

| Consumer | Reads event | Does |
|----------|-------------|------|
| Garden | `ENCIRCLE(block/demo-7)` | +1 tend credit |
| Herding | same event | fold flock to pasture |
| Story | whole log | LLM narration — no invented geometry |
| Peerboard | `territory/*` | async credit |
| Bingo | `exposure` novel-types | mark tile |

Games you **disable in the viewer** may still run on the server tick — or pause if nobody
enabled them; policy choice. **Data** stays in the shared store for others.

## Games as presets — views over shared data

Layer bundles ([`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md)) pick **which slices**
of the shared store to render and which prompts to offer. **`bacon` off** = hide meat **data
products** in UI — not a separate vegan universe.

```yaml
# viewer/games/cozy-farm.yml
id: game/cozy-farm
reads_store: [garden/, herding/, territory/layers/]   # data dependency
layers: [pasture_cozy, flocks, manure, semantic_graze]
sim_modules: [urban_garden, animal_herding]          # writers to shared store
```

Presets document **data dependencies**, not just eye candy.

## Interlock matrix = shared writes (examples)

| Writer game | Data mutation | Reader game |
|-------------|---------------|-------------|
| Pee / skywrite | `s(L,e) += …` | Herding grazes; smell nav sniffs |
| Herding | `s(L,e) -= bite`; spawn manure layer | Garden fertility |
| **PacBot** (Micropolis lineage) | `traffic/density -= eat` or shared `s(L,e)` | Congestion relief; score |
| Windmill | transfer strength → canal / sewage | Canal diffusion; fewer ads for sheep |
| Garden | bed spawn `{ tomato: 5 }` | Herding fair pick; TomTomagotchi craft |
| Exposure | `{ cafe: 14, home: 83 }` | Garden seed hints; bingo tiles |
| Gesture engine | `events.json` | All sims subscribed to `kind` |

**Conflicts are shared-state negotiations** — sheep stripped your ad; fix in Git (re-pee, windmill, dike).

## Cohabitation rules (data-first)

1. **One graph** — join on `way/id`, `node/id`, `block/id`
2. **Declare reads/writes** — game contract YAML; no secret tables
3. **Events are append-only facts** — story and audit consume the same log
4. **Layers = projections** — toggling visibility does not delete shared data
5. **Namespaces, not silos** — `territory/`, `garden/` — cross-read encouraged
6. **Never write OSM** — shared game data stays in Git/build artifacts

## Adding a new map game

1. **`design/games/{id}.contract.yml`** — reads, writes, events
2. Design doc — which existing stores mutated?
3. Sim module ticks shared store (others may read your writes same tick)
4. Build step → overlay GeoJSON (view of your slice of shared data)
5. Register in `viewer/layers/catalog.yml` + optional preset

Lineage tenants (BONGO BINGO, iLoci, MediaGraph) = new contracts on same Amsterdam data plane.

## Viewer UX (projection only)

Layer drawer = **which shared data slices to draw**. Presets = common read bundles.
See [`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md).

## Tie-in

| Doc | Shared data role |
|-----|------------------|
| [`DATA-CONTRACT.md`](../DATA-CONTRACT.md) | ride manifest + geo — entry point |
| [`peerboard-and-brews.md`](peerboard-and-brews.md) | writes `territory/layers/` |
| [`animal-herding.md`](animal-herding.md) | reads/writes layers + beds |
| [`semantic-polder.md`](semantic-polder.md) | mutates strength via windmill |
| [`urban-garden-loop.md`](urban-garden-loop.md) | beds, fair pick pools |
| [`exposure-pac-man.md`](exposure-pac-man.md) | writes exposure JSON |
| [`skeleton/story-layer.md`](skeleton/story-layer.md) | reads events only |

↑ [`VISION.md`](VISION.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

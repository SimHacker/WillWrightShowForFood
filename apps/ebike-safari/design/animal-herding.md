# Animal herding — pastures, paths, and collies

**Cozy farm sim on the city graph.** Bright, colorful map view — blocks as fenced **pastures**,
roads as **paths** animals walk. Herd with rides, equipped lures, burst gestures, and **collie
agents**. Animals **feast on semantic layers** (smell/peel strength on the graph), **hill-climb**
toward tasty embeddings, then **poo**, lay eggs, breed, and (optionally) slaughter — or flip
**vegan mode** where livestock are **mobile vegetables**. Plus **slime mold** characters: one
mind, many nodes, split/join on the network — Sims puddle on the graph, not a grid.

Extends community garden ([`urban-garden-loop.md`](urban-garden-loop.md)); uses the same
**gates** family as smell permeability and polder dike seals
([`peerboard-and-brews.md`](peerboard-and-brews.md), [`semantic-polder.md`](semantic-polder.md)).

## Two spaces — 2D pastures and 1D paths

| Space | Topology | Animals |
|-------|----------|---------|
| **Pasture** | city **block** polygon (2D) | free-ranging diffusion inside fence |
| **Path** | **road graph** edges (1D) | walk along snapped segments |

Default: species preference — pigeons diffuse on paths *and* roofs; sheep **pasture**; goats
bridges; ducks path toward `waterway=*`.

**Gates** — controlled portals between pasture ↔ path (shared concept with smell **permeability**):

```yaml
# territory/gates/market-square-north.yml
id: gate/market-square-north
pasture: block/demo-block-7
path_edge: way/482910
species: [sheep, goat]
throughput: 0.8          # how many can cross per tick when open
open: true               # steward PR or collie can toggle
```

Open gate → animals migrate between grazing and walking. Closed gate → flock trapped in pasture
or on path segment — herding puzzle.

**Gate controls** (viewer tools + steward YAML):

| Control | Effect |
|---------|--------|
| **Open / close** | `open: true` → throughput; `false` → block crossing (fence at one portal) |
| **Lock / unlock** | `locked: true` → only `key_holder` may toggle |
| **Unlock** | steward PR, tend credit, or equipped **gate key** brew |

Add to gate YAML: `locked: false`, `key_holder: [rider/alice, collie/demo-block-7]`.

## Herding toolkit

### Fence tools — temporary, permanent, bulldozer

Lay **fences along roads** to block animals on path edges. Flocks **hill-climb only through open
directions** — **animal permeability** `p_a(e, species)` on edges (same machinery as smell
dike seals — [`peerboard-and-brews.md`](peerboard-and-brews.md),
[`semantic-polder.md`](semantic-polder.md)).

| Tool | Cost | Duration | Store |
|------|------|----------|-------|
| **Temporary fence** | low (ride tokens / gesture) | **fades** — `fade_rate` per tick or wall-clock | `herding/fences/temp-*.yml` |
| **Permanent fence** | high (tend credit + brew spend) | until bulldozed | `herding/fences/permanent-*.yml` |
| **Fence bulldozer** | medium; higher vs permanent | removes fence on crossed edges | deletes fence record |
| **Gate** | pasture infra | until PR removes | `territory/gates/*.yml` |

**Lay temp fence:** equip tool → ride along path → each snapped edge gets `p_a(e) → 0` for
listed species. Blocked flocks **turn back** or **flow along unblocked neighbors**.

```yaml
# herding/fences/temp-marconi-arm.yml
id: fence/temp-marconi-arm
kind: temporary
edges: [way/482910, way/482911, way/482912]
species: [sheep, goat]
placed_by: rider/alice
placed_at: 2026-08-10T15:00:00Z
p_block: 0.0
fade_rate: 0.08                 # per sim hour
```

```yaml
# herding/fences/perimeter-demo-7.yml
id: fence/perimeter-demo-7
kind: permanent
edges: [way/483001, way/483002]
species: [sheep]
cost: { tend_credit: 5, brew_tokens: 2 }
fade_rate: 0
steward: block/demo-block-7
```

**Fade:** each tick decay `p_fence`; record deleted when gone — corral opens without bulldozer.
**Bulldozer:** ride or tap edge in replay → clear temp in one pass; permanent needs extra cost
or steward unlock on `steward` field.

**Slime** ignores animal fences unless `species: [slime]` or polder seal applies.

**Web replay demo:** simulated bike lays temp fence → flock redirects on next ticks — no live GPS.

### Equipped items — attract / repel over time

Rider (or pasture steward) equips **lures** and **deterrents** with radius, strength, and TTL:

| Item | Effect | Example |
|------|--------|---------|
| **Salt lick** | attract + slow converge | sheep drift toward equipped edge |
| **Bell collar** (peer brew) | attract peers' animals slightly | social flair |
| **Predator scent** | repel over minutes | clears path for a convoy |
| **Seed scatter** | attract pigeons / birds | cross-pollinate beds downroute |

Strength falls off with distance on graph (paths) or Euclidean (pastures). Multiple riders stack
cooperatively — not zero-sum.

### Instantaneous actions — burst disperse / converge

Gesture or voice **burst** — one-shot flock impulse:

| Action | Effect |
|--------|--------|
| **Shout / clap** | instant **disperse** — radial scatter on current pasture or path |
| **Whistle** | instant **converge** on rider position or equipped lure |
| `LASSO(park)` | sustained herding arc — steer flow along your ride ([`geometry-as-language.md`](geometry-as-language.md)) |
| `ENCIRCLE(block)` | gentle **fold** flock into block pasture center |

Burst cooldown prevents spam; equipped items handle slow steering.

### Collie agents — helper herders

**Collies** are autonomous or semi-autonomous agents on the graph:

- Patrol assigned pasture or path segment
- Respond to steward YAML (`collies/demo-block-7.yml`) — species, gate policy, sleep hours
- Player can **summon** collie to edge for one convergence push (costs tend credit)
- Multiple peers' collies **cooperate** on commons pasture — don't complete, cooperate

Collie = NPC peer — fits MMORPG / GitHub-as-board without requiring every rider online.

## Semantic grazing — feast on layers

Animals don't only eat crop tiles — they **feast on diffusion layers**
([`peerboard-and-brews.md`](peerboard-and-brews.md)). Each species has a **taste vector**
`diet` (embedding or tag set). At edge `e`, **nutrition** from layer `L`:

```
taste(L) = s(L, e) · cosine(diet, embed(L))^γ
```

Flocks **hill-climb** the road graph (paths) or pasture interior (2D) toward rising `taste` —
same gradient family as smell navigation, but animals **consume** strength:

```
s(L, e) ← s(L, e) − bite(F, L, e)     # layer weakens when grazed
bite ∝ flock_size · hunger · taste(L)
```

| Layer flavor | Who feasts |
|--------------|------------|
| `generic_fruit`, garden gazette | pigeons, goats |
| `cuisine:dutch`, herring menu | ducks near canal |
| feral vintage, spam brew | goats (or windmill filters it out first) |
| solidarity / commons tags | sheep (tend credit if well-managed pasture) |

Overgrazing peels ads bare — peers must **re-pee** or Peecon renews. Polder windmills can pump
spent semantics to sewage before flocks strip the block.

### Micropolis PacBot lineage — same algorithm, different field

Don Hopkins's **PacBot** ([MicropolisCore `micropolisrobot.py`](../../../../micropolis/MicropolisCore/src/pyMicropolis/micropolisEngine/micropolisrobot.py)) already does this on a **road grid**:

| PacBot (SimCity microworld) | Ebike Safari (OSM graph) |
|-----------------------------|---------------------------|
| `getTrafficDensity(x,y)` | `s(L, e)` semantic layer strength |
| `scanRoads(dir, dist)` — sum density ahead, distance-attenuated | sniff / hill-climb toward increasing smell |
| pick direction with **highest score** | `argmax taste(L)` on neighbor edges |
| `eatTraffic()` — zero density, add score | `graze_layer` — bite strength, poo/manure |
| **roads only** | **1D path** mode (pasture = 2D extra) |
| Pacmania church spawns bots, generates traffic | Peecon spawns layers (ads as bait) |

PacBot tool description: *"Follows roads towards heavy traffic, and eats cars, reducing traffic."*
Semantic grazing: *follows roads towards rich embeddings, eats layer strength, reducing smell."*

Shared **data plane** pattern ([`map-game-platform.md`](map-game-platform.md)): one scalar field on
the transport network; agents **climb the gradient** and **mutate the shared store** on contact.
Micropolis traffic density ↔ territory strength — interlocking games read/write the same kind of map.

Optional future **game/PacBot** tenant: real ride traffic or peer activity as density field;
PacBots on Amsterdam graph eating congestion layers — shares `territory/layers/` or a dedicated
`traffic/density/` store with herding and smell games.

**Ambient L1+** — when L0 cells rise, block-level haze remains grazeable at lower `taste` —
sheep strip sharp ads first; neighborhood retains fuzzy memory until windmill or slow fade.

### Lifecycle — poo, eggs, babies, slaughter

| Stage | Effect |
|-------|--------|
| **Graze** | consume layer strength + optional crop spawn |
| **Poo** | spawn low-strength **manure layer** (fertility brew) on edge — feeds beds |
| **Eggs / milk / wool** | commons spawn pool — fair pick ([`urban-garden-loop.md`](urban-garden-loop.md)) |
| **Babies** | flock `count` grows when pasture well-tended + nutrition sustained |
| **Slaughter** | opt-in harvest → meat resource to commons (steward policy in Git) |

World sim can include meat; **your viewer** chooses what to render — see **overlay layers** below.

### Overlay layers — enable what you want

All ecology exists in Git/sim; the **map is a stack of toggleable layers** — same architecture
as smell, exposure, cozy vs realistic ([`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md)).
Don't ban mechanics globally; let riders **hide layers** they don't want to see or play toward.

| Layer id | Shows | Default |
|----------|-------|---------|
| `pasture_cozy` | block fills, fences | on |
| `flocks` | animals on path/pasture | on |
| `eggs_wool` | produce pickups | on |
| **`bacon`** | meat, slaughter harvest, butcher icons | **off** for vegans — they simply don't enable it |
| `mobile_vegetables` | vegan skin sprites (optional reskin) | off |
| `slime` | multi-edge puddle characters | off |
| `manure` | poo fertility layers | on |
| `semantic_graze` | layer bite / nutrition heat | on |

**Vegans don't enable the bacon layer.** Carnivores opt in. Omnivores toggle per ride. World
state unchanged — slaughter may still happen in commons YAML somewhere; you just don't render or
prompt it. Optional `mobile_vegetables` skin is cosmetic — walking cabbages instead of sheep.

```yaml
# viewer/layers/prefs.yml  (per player — local or synced)
enabled:
  - pasture_cozy
  - flocks
  - eggs_wool
  - manure
  - semantic_graze
disabled:
  - bacon                 # that's it — no special "vegan mode" fork
  # - mobile_vegetables   # optional cute reskin
```

Steward policy in pasture YAML can still gate **commons slaughter** (economy); player layers gate
**UX**. Two knobs, not one moral switch.

## Slime mold — network puddle characters

**Physarum on the graph.** One character = a **set of active nodes/edges** simultaneously —
not a single dot. The slime mold **exists in all places at once** (within its mass budget),
extends pseudopods along edges, **subdivides** (fork identity) or **joins** (merge two puddles).

| Grid Sims | Network slime |
|-----------|---------------|
| one tile per Sim | one **mass** spread across many graph cells |
| pathfind A→B | **solve maze** — explore all arms, thicken shortest nutrient path |
| split household | **subdivide** — two slimes, half mass each |
| move out | **join** — merge at shared edge if compatible embedding |

```
slime S: { mass, cells: { edge → amount }, embedding, player_ref }
each tick:
  extend into neighbors proportional to taste(layer) + unexplored bonus
  retract from low-nutrition arms (maze efficient like real slime mold)
  subdivide(S, cut_set) → S1, S2  if steward or gesture splits
  join(S1, S2) → S  if embeddings similar and cells touch
```

Slime **grazes semantic layers** like animals but doesn't need 1D vs 2D — flows anywhere
permeability allows. Collies can't herd slime; **barriers** and **polder seals** shape it.
Multiple riders can each be a slime puddle — MMORPG mycelium.

Cozy view: translucent **yellow-green blob** spanning several block faces; pulsing when feasting
on a rich Peecon cluster.

## Ecology — crops + layers (summary)

| | Pasture / path / slime behavior |
|--|--------------------------------|
| **Consume** | **semantic layer strength** (primary) + crop spawns |
| **Produce** | poo layers, eggs, wool, babies; slime → spore bursts |
| **Pollinate** | pigeons / drifting tomatoes between beds |
| **Overgraze** | strip ads; windmill or re-pee restores |

Fair pick on commons products ([`urban-garden-loop.md`](urban-garden-loop.md)).

## Simulation sketch

```
each tick:
  for each flock F:
    hill_climb toward argmax taste(L) on graph or pasture
    bite semantic layers; poo / lay / breed per rules
    # bacon/meat events written to sim either way; viewer layer filters display

  for each slime S:
    extend/retract on graph; graze; subdivide/join on policy

  apply equipped lure/repel fields (decay over time)
  collies nudge flocks (not slime)
  at open gates: transfer flocks pasture ↔ path
  apply fence fade; skip edges where p_a(e, species) = 0 in hill_climb

  render only layers enabled in viewer prefs (see overlay layers)

```

Flock state in Git YAML — `{ species, count, pasture|edge, lat/lon or edge_id }` — not OSM tags.

## Cozy map view

Viewer mode distinct from realistic OSM replay — each feature is an **optional layer**:

- **Pastures** — soft fill inside block polygons; fence stroke on perimeter; warm palette
- **Paths** — simplified road ribbons; animals as chunky sprites / particles on edges
- **Gates** — visible gap or arch where pasture meets path; open/closed + lock icon
- **Fences** — dashed stroke on path edges (temp = fading opacity; permanent = solid)
- **Bulldozer** — brief scrape animation when fence removed on edge
- **Collies** — small animated marker patrolling
- **Slime** — translucent multi-edge blob (`slime` layer)
- **`mobile_vegetables`** — optional reskin when `flocks` on (walking cabbages)
- **`bacon`** — meat/slaughter icons — **opt-in**; vegans leave off
- **Lures** — pulsing halo (attract) or striped zone (repel)

MapLibre: basemap optionally **toned down** (pastel style or simplified tiles) + overlay layers
for pastures, flocks, items ([`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md)).
Stardew-on-the-graph — readable at glance while riding or replaying.

Toggle layers in viewer catalog — not a single global mode ([`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md#layer-stack--enable--disable-anything)).

## Tie-in

| Pillar | Link |
|--------|------|
| [`urban-garden-loop.md`](urban-garden-loop.md) | beds, fair pick, pigeons, feed |
| [`peerboard-and-brews.md`](peerboard-and-brews.md) | layers as food; permeability; map object consume |
| [`semantic-polder.md`](semantic-polder.md) | sealed pasture = polder; windmill drains smell not sheep |
| [`geometry-as-language.md`](geometry-as-language.md) | LASSO, ENCIRCLE, whistle burst |
| [`skeleton/urban-garden.md`](skeleton/urban-garden.md) | shared beds |
| new: [`skeleton/animal-herding.md`](skeleton/animal-herding.md) | sim modules |

## v0 demo slice

One block pasture + one gate to a path + pigeon flock + salt lick equip + one collie.
Ride whistle → converge pigeons to gate → open gate → pigeons hit communal bed → pollinate.

**Fence demo (web replay):** temp fence three edges → flock redirects into open arm → fence
fades → flock escapes. Bulldozer clears one permanent segment after steward unlock.

↑ [`README.md`](README.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

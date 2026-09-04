# Peerboard and brews — territory paint layer

**Massively Multi Peer Online Roll Peeing Game** (MMORPG).

Replace the TomTom co-worker's **segment speed leaderboard** (rejected — lawyers, danger) with
a **peerboard**: ostensibly every player is a **peer** (equal citizen). The hidden meaning:
all peers are **pee-ers**. Urination of democracy — *you are a nation of democracy*.

Bike-safe, virtual, crafted — inspired by
[Andrew Quitmeyer's Mark Your Territory](../../../characters/andrew-quitmeyer/sources/mark-your-territory.md).

## Leaderboard → peerboard

| Segment speed leaderboard (reject) | Peerboard (harvest) |
|-----------------------------------|---------------------|
| Fastest time per road edge | **No speed** — ever |
| Zero-sum racing | Recognition among **equals** |
| Lawyers say no | Brew artistry, tend credit, fair picks, map flair |
| One winner per segment | Many peers leave signature on segments they helped |

Peerboard ranks **contribution and craft**, async and opt-in:

- tend / water / pump credits on commons beds
- fair picks shared with the community
- **brew quality** and variety of segment paint
- novel exposure, gesture spells — see [`sources/tomtom-rejected-ideas.md`](sources/tomtom-rejected-ideas.md)

Everyone visible as a peer. Nobody crowned for going fast.

Published traces go through [`privacy.md`](privacy.md): **buffered + home-masked
by default.** Live is a switch, not the pipe.

## Craft brews — high-dimensional virtual pee

Gather ride tokens → **craft different brews** → spend painting road segments.

Not one urine color — a **vector** in high-dimensional pee-space. And the punchline: **pee is
an embedding.** The brew vector is the compressed fingerprint of **arbitrary text or YAML jazz**
you chose to leave on that edge.

### Pee = embedding vector

| Layer | What it is |
|-------|------------|
| **Payload** | Plain text, markdown, or **YAML jazz** — comments as semantic data, room notes, recipe, joke, scene card |
| **Embedding** | `embed(payload)` → high-D vector — the *actual* brew |
| **Paint** | MapLibre style derived from vector (project to hue/dash/opacity — display is lossy) |
| **Segment store** | `{ edge_id, rider, embedding, payload_ref, applied_at }` in Git YAML |

When you paint a segment, you are not merely tinting polylines — you are **marking territory
with meaning**. Ride past later (or search the map) to **decode** what peers embedded:

- Nearest-neighbor on embeddings → "what pee on this street rhymes with?"
- Exact decode when `payload_ref` points at committed YAML in the repo
- Similarity trail along a ride → semantic path through the city

**YAML jazz** fits naturally: the pee *is* the comment block you'd write in a `.yml` sidecar.
Three audiences — humans read payload, LLMs read everything, machines parse structure — same
file, same embedding, same segment.

Example payload embedded as brew:

```yaml
# territory/payloads/marconistraat-tomato-run.yml
# Peer: don · gesture: ENCIRCLE(fountain)×3 · bed: demo-block-7
note: |
  First solidarity stain on this arm. Pumped with Alice.
  Tomatoes fair-picked. Pigeons pending.
tags: [commons, fountain_pump, fair_pick]
```

Craft recipe: tokens + **your text/yaml** → `embed()` → brew → spend on edge `way/482910`.

### Visual brew table (display projections)

Embedding is primary; appearance is a **projection** for the map:

| Input (gather) | Example brew | Example payload snippet |
|----------------|--------------|-------------------------|
| fountain pump laps | *Aqua vitae* | `# pumped 12 strokes into commons` |
| tomato + basil pick | *Garden gazette* | `crop: [tomato, basil] · pick: fair_share` |
| ROUNDABOUT clockwise | *Stirred spirits* | `gesture: ROUNDABOUT_LOOP(cw)` |
| pigeon scatter event | *Feral vintage* | `seed_spread: feral_pigeon · rare: true` |
| commons tend streak | *Solidarity stain* | `# we tend this block — don't complete` |

Recipes in `brews/recipes.yml`. Optional: fixed recipe + **rider-supplied yaml jazz** → unique embedding every time.

**Spend:** ride a segment with brew in inventory → apply layer + store embedding/payload.
**Skywrite:** with brew active, every edge you traverse gets a continuous smoke drip — bike as
plane ([`geometry-as-language.md`](geometry-as-language.md#bike-as-skywriting-plane)).
Segments you **helped tend** accept richer payloads; garden beds stay commons
([`urban-garden-loop.md`](urban-garden-loop.md)).

### Read paths

1. **Glance** — color/pattern on map (lossy view of embedding)
2. **Sniff** — tap segment → show YAML jazz / text if you have payload_ref
3. **Sniff adjacent** — compare strength on neighbor edges; **follow the gradient**
4. **Follow the smell** — ride toward increasing `s(L,e)` to find spawn source
5. **Market hunt** — widen/pinch nostrils; filter layers by goal smell; multi-stand pathfinding
6. **Search** — query embedding space: "find peers who peed about fountains near me"
7. **Ride decode** — passing within N meters of painted edge triggers optional audio/story layer

## Diffusion layers — strength fields, constant meaning

**Canonical model.** Diffusion moves **concentration**, not semantics. Each pee spawns a
**distinct layer**: one immutable embedding (full YAML jazz) + a **strength field** on the road
graph. Strength diffuses and fades; **embedding never changes** on that layer. When strength
drops below ε, don't waste it — **rise** into coarser **ambient** layers; when a specific layer
is empty, **recycle** its id.

Factorio with **tubes instead of conveyor belts**: each layer is a fluid type (fixed composition)
flowing at a concentration that spreads and decays.

### Smells are advertisements; roads are distribution channels

Every layer is an **ad**. The **creative** is the payload — menu YAML, stand inventory, peer
note, garden gazette. The **embedding** is the brand fingerprint. **Spawn** at an edge is
the buy: proprietor, stand keeper, or peer pays attention at the source.

The **road graph** is the **distribution network**. Strength diffusion is **placement along
channels riders actually use** — not Euclidean radius, not quest pins. Concentration propagates
segment to segment; **fade** is **flight end** unless someone **re-pees** to renew the campaign.

| Ad / media | Territory layer |
|------------|-----------------|
| Creative | payload YAML jazz |
| Brand / offer vector | fixed embedding |
| Outlet / placement | spawn edge (kitchen door, stand, peer stain) |
| Distribution | strength `s(L,e)` on graph edges |
| Reach & frequency | how strong the smell is on edges you ride |
| Campaign flight | `fade_rate`; **re-pee** renews |
| Targeting | `nostril_width` + goal vector `q` |
| Conversion | gradient ascent → local max → decode full payload |
| **Renewal** | manual re-pee or **Peecon** (scheduled beacon) |

**Passive vs pull:** [`exposure-pac-man.md`](exposure-pac-man.md) logs frontage you *pass*
(billboards on the ride). Smell navigation is *pull* — you set intent ("fruit", "Thai",
"Alice's tomatoes") and follow the distributed ad back to source. Same OSM city; two channels:
exposure pellets on the sides, scent fields on the roads between.

Market stands and restaurants are **local advertisers** with YAML menus as creatives; peer
brews are **UGC ads** on segments they helped tend. The city sells itself through the graph.

### Isochrones — travel-time reach on the same channels

**Isochronal maps** answer the complementary question: not "how strong is the smell here?" but
**"how long from here to there?"** on the **same road graph** that carries scent distribution.
Both are reach on channels — one in **minutes**, one in **semantic strength**.

| Field | Smell diffusion | Isochrone |
|-------|-----------------|-----------|
| Metric | strength `s(L,e)` | travel time / cost |
| From | ad spawn edge | rider position |
| Spread | Laplacian + fade | shortest-path tree (bike profile) |
| Query | "follow Thai smell" | "what's reachable in 15 min?" |
| Combined | **Thai ads I can reach before lunch** | intersect time contour ∩ nostril filter |

Use isochrones to **cap the hunt** — filter layers whose spawn is inside the time budget, or
weight path score by `1 / travel_time_remaining`. Diffusion without time is "billboard reach";
isochrone without smell is vanilla routing UI. Together: **intent + time + scent gradient**.

#### Routing APIs (isochrone support)

Already in our orbit via [`skeleton/road-graph.md`](skeleton/road-graph.md) and
[`ebike-safari`](../../../repo-shows/ebike-safari/README.md):

| Engine | Isochrone? | Bike / e-bike | Notes |
|--------|------------|---------------|-------|
| **[Valhalla](https://valhalla.github.io/valhalla/api/isochrone/api-reference/)** | yes `/isochrone` | `bicycle`, `pedestrian` | Open source; same engine as map-matching candidate; contours by time or distance |
| **[OpenRouteService](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post)** | yes `/v2/isochrones` | `cycling-*`, `foot-*` | OSM-based; free tier; GeoJSON polygons |
| **[GraphHopper](https://docs.graphhopper.com/openapi/isochrone)** | yes Isochrone API | `bike`, `mtb`, `racebike` | Hosted + self-host; time or distance limits |
| **[Mapbox Isochrone](https://docs.mapbox.com/api/navigation/isochrone/)** | yes | `cycling` profile | Commercial; pairs with MapLibre tiles if licensed |
| **[TomTom Routing](https://developer.tomtom.com/routing-api/documentation/routing/calculate-reachable-range)** | yes **Reachable Range** | travelMode incl. bicycle | Lineage stack; range polygon from a point |
| **OSRM** | partial | `cycling` profile | `/route`, `/table` (many-to-many times); no native isochrone polygon — expand from `/table` or use Valhalla/ORS instead |
| **Bosch Flow / Apple Maps** | no (A→B) | yes turn-by-turn | **Set destination** after smell hunt commits; not bulk reach polygons |

**Suggested split:** Valhalla or ORS for **graph + isochrone + map-match** in the design pipeline;
Bosch/Apple for **committed navigation** once the rider converts (voice: "take me there").

```yaml
# territory/hunt/thai-lunch.yml — combined query (sketch)
from: { lat: 52.367, lon: 4.904 }      # rider GPS
time_budget_min: 20
profile: bicycle
goal: { embed: cuisine:thai, nostril_width: 0.6 }
steps:
  - isochrone → reachable edge set E_T
  - perceive_layers(goal) → candidate layers L
  - keep L where spawn_edge(L) ∈ E_T
  - navigate_market(q, start) with score gated on E_T
```

### One layer = one pee event

```yaml
# territory/layers/L-0042.yml  (recycled id when empty)
id: L-0042
payload_ref: territory/payloads/garden-gazette-01.yml
embedding: [0.12, -0.04, …]          # constant for lifetime of layer
spawn:
  edge: way/482910
  rider: rider_a
  at: 2026-08-10T15:00:00Z
  strength_initial: 1.0
params:
  diffusion_rate: 0.15      # graph Laplacian mix per tick
  fade_rate: 0.02           # global decay per tick — **re-pee knob**
  amplify: 1.0              # optional >1 near fountains, <1 near drains
epsilon_zero: 0.001         # below → cell rises to ambient (not discarded)
resolution: L0_specific      # see ambient pyramid
```

**Strength grid** (sparse — only non-zero cells stored):

```yaml
# territory/layers/L-0042/strength.yml  (edge_id → float)
way/482910: 1.0
way/482911: 0.42
way/482905: 0.18

# territory/ambient/L1-generic-fruit/strength.yml  (sparse map — slow diffuse)
way/482910: 0.22
way/482920: 0.18
meta: { abstract: generic-fruit, diffusion_rate: 0.03, fade_rate: 0.003 }
```

### Tick — diffuse strength, not embedding

Each **segment** (edge) and **node** (intersection) carries a **permeability** `p ∈ [0, 1]` —
how freely smell crosses that piece of the distribution network. Default `p = 1` (open road).
**Seal** by driving `p → 0` on boundary segments and nodes to **block leaks** in or out.

For each active layer `L`:

```
for each edge e with s(L, e) > 0:
  out_flux ← diffusion_rate · p_out(e) · s(L, e)
  s(L, e) ← (1 − fade) · s(L, e) − out_flux

for each neighbor pair (e, e') sharing node n:
  p_link ← p(e) · p(n) · p(e')              # product gate; min() also works
  transfer ← diffusion_rate · p_link · s(L, e)
  s(L, e') ← s(L, e') + transfer

s(L, e) ← s(L, e) × amplify(map_object at e)

if s(L, e) < epsilon_zero:
  rise(L, e) → ambient pyramid (see below)   # concentration preserved, semantics coarsen
  delete s(L, e)

if layer L has no cells left → recycle layer id
```

**Embedding vector stays fixed on layer L.** Only scalar **strength** moves. Specific meaning
**compresses upward** into ambient buckets — never thrown away, only **blurred**.

#### Ambient pyramid — rise, collapse, slow diffuse

Semantic **image pyramid** for smell. Fine **L0** layers hold exact payloads; fading cells
**rise** and **collapse** into coarser **ambient** layers — sparse maps like L0, but more
abstract semantics and **much slower** diffusion/fade so gradients reach **long range** for
hill climbing when sharp L0 is gone.

| Level | Spatial | Semantics | Dynamics |
|-------|---------|-----------|----------|
| **L0** | edge `way/*` sparse | full payload, exact embed | fast diffuse + fade |
| **L1** | edge or block sparse | category collapse | slow diffuse |
| **L2** | hood-scale sparse | blended neighborhood | slower |
| **L3** | district sparse | city haze | slowest |

**Ambient layers are sparse maps too** — not only scalar bins per block:

```yaml
# territory/ambient/L1-generic-fruit/strength.yml  (sparse on graph, like L0)
way/482910: 0.22
way/482920: 0.18
way/483001: 0.09

meta:
  level: L1
  abstract: generic-fruit          # collapsed from many L0 payloads
  embedding: territory/market/centroids.yml#generic-fruit
  diffusion_rate: 0.03               # << L0 (0.15)
  fade_rate: 0.003                   # << L0 (0.02)
  collapsed_from: [L-0042, L-0088, L-0091]   # audit trail
```

Same tick math as L0 — permeability, diffuse, fade — but **knobs tuned for reach**.

##### Semantic collapse — many smells → abstract layers

Rising isn't only spatial coarsening — **multiple L0 layers collapse** into one **abstract**
ambient layer when their semantics bucket together:

```
collapse: { tomato, mango, apple, pear } → generic-fruit
          { generic-fruit, bread, cheese } → food
          { food, pleasant_brews } → good
          { feral_vintage, sewage } → bad
```

Market block with ten fruit stands → ten L0 embeds fade → mass **pools** into one
`L1/generic-fruit` sparse map; later `L2/food`; optional **valence** layers `good` / `bad`
for very wide nostrils ("something tasty this way" vs "avoid").

| Abstraction | Example sources | Nostril use |
|-------------|-----------------|-------------|
| `generic-fruit` | apple, tomato, mango Peecons | "find fruit" |
| `generic_meat` | butcher, duck, lamb | "find meat" |
| `food` | fruit + meat + bakery collapse | "something to eat" |
| `cuisine:dutch` | menu YAML cluster | "Dutch food" |
| `good` / `bad` | valence tag on payloads | long-range vibe hunt |

Centroids in `territory/market/centroids.yml`; collapse rules in `territory/config/ambient.yml`
(tag hierarchy + embedding distance threshold).

##### Rise + collapse (tick)

```
if s(L0, e) < epsilon_zero:
  for each abstract layer A in collapse_chain(embed(L0)):
    ambient[A].strength[e] += s(L0,e) · rise_yield · split(A)   # sparse map write
  delete s(L0, e)

tick ambient layer A (sparse):
  diffuse with A.diffusion_rate   # slow — long-range gradient
  fade with A.fade_rate           # slow — lingers
  if s(A,e) < ε: rise to next coarser abstract/spatial level
```

**Long-range hill climbing:** when local L0 is eaten or faded, **PacBot/flocks/riders** still
climb `generic-fruit` or `food` ambient gradients across the hood — faint but navigable.
Pinch nostrils → drop ambient, hunt residual L0. Widen → ambient + L0 combined score.

Windmill **sewage** rejects mass; **canal** deposits ambient-compatible strength downstream.
Re-pee renews sharp L0; ambient is **compressed memory** of what the market used to smell like.

```yaml
# territory/config/ambient.yml
rise_yield: 0.85
L0: { diffusion_rate: 0.15, fade_rate: 0.02, epsilon_zero: 0.001 }
L1: { diffusion_rate: 0.03, fade_rate: 0.003, epsilon_zero: 0.0005 }
L2: { diffusion_rate: 0.01, fade_rate: 0.001 }
L3: { diffusion_rate: 0.004, fade_rate: 0.0003 }

collapse:
  - tags: [apple, tomato, mango, pear, generic-fruit]
    into: generic-fruit
  - tags: [generic-fruit, generic_meat, bakery, food]
    into: food
  - tags: [food, comfort, fair_pick]
    into: good
  - tags: [feral, sewage, spam]
    into: bad

centroids: territory/market/centroids.yml
```

**Recycle:** empty **L0** id returns to pool. **Ambient** sparse layers persist as shared
stores — many writers collapse in; slow fade; no semantic garbage collection, only coarsening.

#### Permeability — seal neighborhoods, block leaks

| `p` | Effect |
|-----|--------|
| `1.0` | default — full diffusion along channel |
| `0.1–0.5` | leaky hedge — slow bleed, muffled gradient |
| `0.0` | **sealed** — no cross-boundary transfer |

**Seal a neighborhood:** mark perimeter **segments and nodes** with low `p`. Smells spawned
inside stay inside (longer); outside ads don't leak in. Useful for:

- **Commons garden block** — keep solidarity brews local; block feral pigeon invasions
- **Market hall** — optional high internal `p`, low on exits (concentrated aroma)
- **Peer territory** — Mark Your Territory play: seal your block, re-pee inside the membrane
- **OSM hints** — `barrier=wall`, `access=private`, bridges, gates as default low-`p` candidates

```yaml
# territory/graph/permeability.yml  (sparse overrides on road graph)
defaults: { edge: 1.0, node: 1.0 }

edges:
  way/482910: 0.0      # sealed gate — no smell crosses
  way/482911: 0.25     # leaky hedge

nodes:
  node/991024: 0.0     # corked intersection

# territory/hoods/demo-block-7-seal.yml
hood: demo-block-7
steward: peer:alice
boundary:
  edges: [way/1001, way/1002, way/1003, way/1004]
  nodes: [node/501, node/502]
  permeability: 0.05     # nearly sealed — 5% leak
note: Commons garden gazette stays in; block external meat-market bleed
```

**Asymmetric seals (later):** `p_in` vs `p_out` on directed edges — one-way valves (smell
exits but doesn't enter, or vice versa). **Unseal** by peer gesture (COMPLETE_BLOCK, fountain
pump ritual) or steward edit in Git.

Permeability applies to **diffusion only** — riders still **traverse** sealed edges physically;
isochrones still route through unless routing profile also respects gates (separate concern).

**Semantic polder:** sealed hood + windmill pumps + adjustable filter → canal or sewage
([`semantic-polder.md`](semantic-polder.md)). Dikes are permeability; windmills drain the
"water level" of accumulated smell.

### Sample at a point — read many layers

At edge `e` (or node), gather all layers with `s(L,e) > 0`:

```
weights = { L: s(L,e) }
normalize → ŵ_L = s(L,e) / Σ s(L',e)

display_vector = Σ ŵ_L · embedding(L)     # for map color (optional)
decode_list    = sort layers by s(L,e)    # top-K YAML payloads to show
```

At any point you see a **mixture of distinct meanings** by strength — not a corrupted blend
of embeddings. Each layer still decodes to its original YAML jazz when sniffed.

### Follow the smell — gradient ascent on the graph

Strength diffusion creates a **scent field**. Spawn edge is the peak (initial strength ~1);
outward cells hold lower `s(L,e)`. Gameplay and navigation:

```
sniff(edge e, layer L):
  neighbors ← adjacent segments on road graph
  strongest ← argmax_{e'} s(L, e')   among e' in neighbors ∪ {e}

if s(L, strongest) > s(L, e):
  hint ← "smell intensifies toward {strongest}"
else if at local maximum:
  hint ← "source nearby" · decode payload · show spawn metadata
```

**Ride the gradient:** bike toward adjacent segments where strength **increases** — urban
safari as **scent tracking**. Same family as Micropolis **PacBot** `scanRoads` → `eatTraffic`
on traffic density ([`animal-herding.md`](animal-herding.md#micropolis-pacbot-lineage--same-algorithm-different-field)).
Multiple layers → multiple smells; pick which layer to follow (decode top-K by strength at current edge).

| Mode | UX |
|------|-----|
| **Passive sniff** | Viewer highlights neighbor edge with strongest gain per selected layer |
| **Active ride** | Optional haptic/audio cue when crossing into higher-strength cell |
| **Arrival** | Local max ≈ spawn point → full YAML jazz + peer credit + "you found the pee" |
| **Cold trail** | Fade_rate high → gradient shallow; must re-pee or hunt while strength lasts |
| **Crossed trails** | Intersection of two layers — choose which smell to follow (democracy of odors) |

Ties to [`geometry-as-language.md`](geometry-as-language.md) — the city is a microworld;
**following a semantic trail** is adventure navigation without proprietary quest pins. Story
layer can narrate the hunt ([`skeleton/story-layer.md`](skeleton/story-layer.md)).

**Why diffusion matters:** without spread strength, there is no gradient — only a point tap.
Diffusion turns pee into **discoverable geography** — ads with **reach** on the road network.

### Market stands and restaurants — clustered smells

A **market** is a dense neighborhood of specialized stands — each stand spawns its own
diffusion layer (distinct YAML jazz, distinct embedding), but **categories cluster** in
embedding space:

| Source | Smell cluster | Examples |
|--------|---------------|----------|
| **Fruit stands** | `generic-fruit` | apple, tomato, mango — unique payloads, **similar** embedding |
| **Meat stands** | `generic_meat` | beef, lamb, duck — smell like *meat*, not *fruit* |
| **Restaurants** | `cuisine:*` + house signature | Thai, Italian, ramen — **menu in YAML** |
| **Herb / flower / fish / …** | own centroids | many variants per category |

OSM hooks: `shop=greengrocer`, `amenity=marketplace`, **`amenity=restaurant`**, `cuisine=*`.
Peers and proprietors **re-pee** at their stand or kitchen door to keep the smell alive —
neighborhood as **living scent map**.

Individual venues = **distinct layers**. Category = **semantic neighborhood** — widen
nostrils to catch "anything Thai" or pinch to one house's `# signature_dish`.

#### Restaurant menu as YAML jazz

A restaurant's smell layer embeds the **whole menu** — or spawns **one layer per service
period / chef's special**. The payload is the menu file; the embedding is the house aroma.

```yaml
# territory/payloads/de-polder-keuken-menu.yml
# Restaurant: De Polder Keuken · OSM node/way ref · peer: proprietor_or_fan
venue:
  name: De Polder Keuken
  cuisine: [dutch, seafood]
  osm: node/12345678

# Comments are semantic — YAML jazz menu for humans, LLMs, and embed()
menu:
  stamppot:
    note: Smoked sausage, kale, potato — winter anchor
    tags: [comfort, dutch, meat]
  herring:
    note: Raw with onion — lunch counter smell
    tags: [fish, dutch, cold]
  bitterballen:
    note: Fryer scent spikes at opening
    tags: [fried, snack, bar]

signature_smell: herring   # which line drives the spawn embedding (or embed full menu)
layers:
  - id: lunch_service
    active_hours: "11:30-15:00"
  - id: fryer_evening
    active_hours: "17:00-22:00"
```

**Spawn policy (later):** lunch layer fades after service; evening fryer layer **re-pee**
at open — or attach a **Peecon** ([§ Peecon](#peecon--beacon-that-drops-pee-on-schedule)) so
the restaurant drops smell on schedule without a rider present.

| Sniff goal | Nostril | Finds |
|------------|---------|-------|
| "Something to eat" | very wide | all food layers nearby |
| "Fish" | wide | fish stands + fish-forward menus |
| "Thai" | medium | `cuisine:thai` cluster |
| "This restaurant's stamppot" | narrow | one menu line or one venue layer |

Menu YAML doubles as **honest decode** at source — ride the smell, arrive, read the full
menu you were already semantically chasing.

### Nostril width — filter layers by goal smell

You don't follow one layer id — you set a **target smell** `q` (embedding of "fruit",
"marzipan", a specific YAML jazz, or a crafted brew). At edge `e`, among all perceptible
layers, keep those **close enough** to smell good:

```
sim(L) = cosine(q, embedding(L))
perceive(L, e) iff sim(L) ≥ τ(nostril_width)

nostril_width ↑  →  τ ↓  →  dilated nostrils  →  more layers match ("generic fruit")
nostril_width ↓  →  τ ↑  →  pinched nostrils  →  only precise matches ("Fujis only")
```

**Widen nostrils:** L0 stands plus **ambient** sparse maps — `generic-fruit`, `food`, even
`good`/`bad` valence for long-range "something tasty this way." **Pinch:** L0 only.

### Multi-smell pathfinding — climb by weighted goodness

When multiple layers pass the nostril filter, **weigh** each neighbor edge by how good it
smells relative to your goal — strength × similarity:

```
score(e → e') = Σ_{L : perceive(L)}  s(L, e') · sim(L)^β · gain(L, e→e')

gain(L, e→e') = max(0, s(L, e') − s(L, e))   # gradient toward source

pick e' = argmax score   among neighbors e'
```

- High `s(L,e')` — strong on that segment
- High `sim(L)` — matches what you're hunting
- Positive `gain` — uphill on the diffusion field
- `β` — how much category vs specificity matters

**Follow several smells at once:** widen nostrils → many fruit layers qualify → path climbs
the **combined** fruit-scented gradient toward the market hall. Pinch → single stand.

| Player intent | Nostril | Goal vector `q` |
|-------------|---------|-----------------|
| "Find any fruit" | wide | `embed(generic-fruit)` or category centroid |
| "Find Thai food" | medium | `embed(cuisine:thai)` or centroid |
| "Stamppot tonight" | narrow | menu YAML line or `signature_smell` |
| "Find Alice's tomato stand" | narrow | Alice's specific payload embedding |
| "Fruit and cheese" | wide + multi-goal | max sim to `{q_fruit, q_cheese}` |
| "Follow this pee trail" | single layer | one layer's frozen embedding |

### UX knobs

| Control | Maps to |
|---------|---------|
| Widen / pinch nostrils | `nostril_width` → threshold τ |
| Goal smell picker | `q` — category, stand, or layer |
| Sniff panel | list perceive(L) at edge with sim and strength bars |
| Path highlight | top neighbor by `score(e→e')` |

Voice-first seed ([`../../../repo-shows/ebike-safari/`](../../../repo-shows/ebike-safari/)):
"I'm hungry for fruit" → set `q`, widen nostrils, ride highlighted gradient.
"I want Thai" → `q = cuisine:thai`. Arrival → decode menu YAML at source.

### Tie-in

- [`urban-garden-loop.md`](urban-garden-loop.md) — fair pick harvest → stand inventory → stand pee
- [`exposure-pac-man.md`](exposure-pac-man.md) — frontage pellets announce stand categories; `amenity=restaurant` pellets
- Diffusion layers — constant embedding per venue; strength fades → re-pee to stay on the map
- BONGO BINGO / Coffeeshops lineage — POI corpus with **YAML behind the smell** ([`sources/amsterdam-gps-lineage.md`](sources/amsterdam-gps-lineage.md))

### Re-pee and tuning knobs

| Knob | Effect |
|------|--------|
| `fade_rate` | How fast layers die globally — **how often you must re-pee** |
| `diffusion_rate` | How fast strength spreads — territorial reach vs local puddle |
| `epsilon_zero` | Sub-ε cell **rises** to ambient L1+ (not deleted) |
| `rise_yield` | Fraction of sub-ε cell entering ambient collapse chain |
| `L1+ diffusion/fade` | Much slower than L0 — **long-range** hill climb |
| `collapse.into` | Many specific tags → `generic-fruit` → `food` → `good`/`bad` |
| `strength_initial` | Splash size on spawn |
| per-layer params | Rare brews diffuse slow; feral pigeon pee fades fast |

Fading layers empty out → **recycle** layer slots from a pool. Git stores spawn events;
sim can run sparse strength ticks offline or on ride ingest.

### Peecon — beacon that drops pee on schedule

A **Peecon** (pee + beacon) is a **fixed-location emitter** that **spawns layers automatically**
on a cadence — so menus and stands stay on the scent map without a human riding by to re-pee
every hour.

| iBeacon | Peecon |
|---------|--------|
| UUID at a place | `payload_ref` + spawn edge |
| Proximity ping | diffusion layer spawn |
| Advertises app/content | **advertises YAML jazz** on the road graph |
| Battery-powered hardware | Git config + sim tick (or proprietor phone cron) |

Manual **re-pee** = rider or keeper visits and splashes once. **Peecon** = the venue *is* the
keeper — lunch service opens → spawn; fryer hours → spawn; fruit stand dawn delivery → spawn.
Restaurants, market stands, and commons fountains are natural Peecon hosts.

```yaml
# territory/peecons/de-polder-keuken.yml
id: peecon/de-polder-keuken
edge: way/482910                    # kitchen door on graph
payload_ref: territory/payloads/de-polder-keuken-menu.yml
embedding_from: signature_smell       # or embed(full menu)

schedule:
  - cron: "30 11 * * 1-5"           # weekdays 11:30 — lunch layer
    layer_id: lunch_service
    strength_initial: 1.0
  - cron: "0 17 * * *"               # 17:00 — fryer evening
    layer_id: fryer_evening
    strength_initial: 0.8

policy:
  skip_if: layer_strength_above(0.3)  # don't spam if smell still alive
  fade_rate: inherit                  # from payload or world defaults
  steward: peer:proprietor_or_fan     # who owns the Peecon config in Git
```

**Tick integration:** each sim or ingest pass, Peecons due for drop → `spawn_layer(edge,
payload)` → strength diffuses as usual. Stale Peecon (venue closed, config abandoned) → layers
fade like any other ad flight.

| Peecon type | Schedule | Payload |
|-------------|----------|---------|
| Restaurant | service hours | menu YAML |
| Market stand | market open days | stand inventory YAML |
| Commons fountain | ENCIRCLE events (optional) | aqua-vitae brew template |
| Peer shrine | weekly cron | peer's signature brew |

Peecon turns **re-pee** from a chore into **infrastructure** — the smell ad network runs on
beacons at fixed outlets, distributed through roads.

### Map objects — produce, consume, transform (Factorio)

Objects on the graph are **layer machines** — not blender of meaning, operators on strength:

| Object | OSM hint | Layer behavior |
|--------|----------|----------------|
| **Fountain** | `amenity=fountain` | **Produce** — ENCIRCLE adds strength to aqua-vitae-class layers; **amplify** water-tagged |
| **Commons bed** | community garden | **Consume** fertility layers; **produce** solidarity drip on tend |
| **Roundabout** | `junction=roundabout` | **Transform** — redistributes strength across arms (stir kernel); may **split** one layer into arm-weighted copies |
| **Drain / canal** | `waterway=*` | **Consume** — accelerated fade downstream |
| **Gate / wall** | `barrier=*`, sealed hood boundary | **Permeability** `p → 0` — block cross-boundary leaks |
| **Windmill** | `man_made=windmill`, historic mill | **Pump** — pull strength through semantic filter → canal or sewage ([`semantic-polder.md`](semantic-polder.md)) |
| **Pigeon roost** | (virtual) | **Produce** feral-vintage layers; scatter spawn on herd gesture |
| **Pasture flock** | block + gates | **Consume** layer strength; poo fertility layers ([`animal-herding.md`](animal-herding.md)) |
| **Slime colony** | multi-edge mass | **Consume** across graph; maze explore; subdivide/join |

**Tubes, not belts:** layers flow through the road network as distinct fluids. A fountain doesn't
change your embedding — it **injects strength** into (or amplifies) compatible layers. A garden
**pulls** strength out as water credit. Roundabouts **route** strength between arms.

Later: explicit **layer transformers** — map one layer id to a new spawn of another (recipe
machine on the graph).

### Craft-time mix vs runtime sample

| When | Operation | Embedding |
|------|-----------|-----------|
| **Craft (optional)** | Mix brews before pee → **one new layer**, one new embedding | New YAML jazz |
| **Runtime sample** | Many layers at edge, normalize strengths | Each embedding unchanged |
| **Diffuse tick** | Strength only | Frozen per layer |

Pre-pee interpolation (`lerp` of brew vectors) still valid to **spawn** a single new layer.
Runtime read never interpolates meaning unless the rider explicitly crafts a merged payload.

### Display

MapLibre: `project(Σ ŵ_L · embedding(L))` per edge for glance; or **stacked halos** per top-3
layers when strengths are comparable. Sniff UI lists payloads by strength.

### Design payoff

- **Democracy:** many voices overlap at intersections — normalize strengths, don't erase peers
- **Forgotten unless tended:** re-pee to maintain presence — ties to commons care loop
- **Follow the smell:** sniff adjacent segments → ride the gradient → find source + peer
- **Market navigation:** nostril width + goal vector → hunt fruit/meat stands by clustered smell
- **Search:** find edges where layer L still has s > threshold
- **Peerboard:** credit layers spawned, refreshed, and longevity — not speed

### v0 → v1

| Phase | Scope |
|-------|--------|
| v0 | Spawn one layer, one edge, strength=1, no tick — decode on tap |
| v1 | Single-layer diffusion + fade on demo block; **sniff neighbors, follow smell to spawn** |
| v2 | Multi-layer sample + nostril width + market stand clusters |
| v3 | Fountain produce / garden consume; multi-goal path scoring |

## Mixing brews (craft-time only)

Optional **before** spawn — combine brews in proportions → **one new layer**:

```
v_new = normalize(α·v_a + β·v_b)   →   embed or store as new payload   →   spawn layer L
```

Runtime **never** diffuses embedding components — only **strength**. See diffusion layers above.

## Democracy framing (straight and crooked)

**Ostensible:** Peerboard = all players equal; influence through **care** (water, plant, pump,
pick fairly), not conquest. A nation of democracy — many voices, shared map.

**Hidden:** Peerboard = pee board. MMORPG. Roll through the city; leave your mark. Quitmeyer's
spirit without the hardware.

Both readings true. Design for the cooperative layer; enjoy the pun in the name.

## Loop

```
ride → gather tokens → compose YAML jazz → embed → spawn diffusion layer (strength=1)
  → tick: strength diffuses on graph, embedding constant, fade → zero → recycle
  → sample at edge: normalize strengths across layers → display / decode / search
  → re-pee to refresh · map objects produce/consume/transform layers
```

## Not this

- Speed scores on the peerboard
- Brew spend evicting others from commons beds
- Real bodily check-in (that's Quitmeyer's art project — we stay virtual)
- Pay-to-win rare brews

## v0 demo slice

Two riders embed different YAML jazz payloads on adjacent segments; map shows distinct paint;
tap or ride-decode reveals comments. Peerboard lists both — no velocity.

## Implementation notes (later)

- `embed`: local small model or API — pick at pipeline time; store model id with vector
- **Layer pool**: dynamic ids; recycle when all cells below epsilon
- Sparse strength storage per layer; tick on ingest or scheduled job
- Keep **payload in Git** (canonical); embedding frozen at spawn
- `fade_rate` / `diffusion_rate` in world config — **re-pee frequency knob**
- Tie to [`skeleton/story-layer.md`](skeleton/story-layer.md) for narrated decode on ride

## Skeleton

[`skeleton/territory-layer.md`](skeleton/territory-layer.md)

↑ [`sources/tomtom-rejected-ideas.md`](sources/tomtom-rejected-ideas.md) · [`urban-garden-loop.md`](urban-garden-loop.md)

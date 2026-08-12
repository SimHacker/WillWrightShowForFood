# Skeleton — territory layer (peerboard + brews)

**Status:** not started  
**Spec:** [`../peerboard-and-brews.md`](../peerboard-and-brews.md)

## Job

Spawn **diffusion layers**: fixed embedding per layer + **strength field** on road graph.
Strength diffuses and fades; embedding never changes on L0. Sub-ε cells **rise** to **ambient**
pyramid (L1 block → L2 hood → L3 district); empty L0 layers recycle ids. Map objects
produce/consume/transform.

## Layer lifecycle

```
spawn_pee(edge, payload) → L0 layer, embedding fixed, s(L, edge)=1
  → tick: diffuse s (permeability gates), fade, amplify
  → s < ε → rise mass to ambient[L1+]; delete L0 cell
  → L0 empty → recycle id
re_pee(same payload) → new L0 or boost strength (policy TBD)
ambient bins combine category strength; coarsen upward on further fade
collapse: many L0 → abstract sparse ambient (generic_fruit, food, good/bad); slow diffuse
```

## State

```yaml
# territory/layers/L-0042.yml
id: L-0042
payload_ref: territory/payloads/garden-gazette-01.yml
embedding: [0.12, -0.04, …]
params: { diffusion_rate: 0.15, fade_rate: 0.02, amplify: 1.0 }
epsilon_zero: 0.001

# territory/layers/L-0042/strength.yml  (sparse)
way/482910: 0.88
way/482911: 0.31

# territory/config/world.yml  — re-pee knobs
defaults: { fade_rate: 0.02, diffusion_rate: 0.15, strength_initial: 1.0 }
sniff:
  nostril_width_default: 0.5    # 0=pinch, 1=dilate
  similarity_beta: 1.5          # path score exponent on cos(q, embed(L))

# territory/market/centroids.yml  (collapse targets)
generic_fruit: { embedding: [...], tags: [apple, tomato, mango] }
generic_meat: { embedding: [...], tags: [beef, lamb, duck] }
food: { embedding: [...], tags: [generic_fruit, generic_meat, bakery] }
good: { embedding: [...], tags: [food, comfort, fair_pick] }
bad: { embedding: [...], tags: [feral, sewage, spam] }
cuisine_thai: { embedding: [...], tags: [curry, basil, chili] }

# territory/ambient/L1-generic-fruit/strength.yml  — sparse; slow diffuse
# territory/config/ambient.yml  — collapse chain, per-level rates

# territory/payloads/{venue}-menu.yml  — restaurant smell source (see peerboard-and-brews.md)

# territory/peecons/{venue}.yml  — scheduled spawn beacon (Peecon)

# territory/ambient/L1-block/{block-id}.yml  — risen ambient smell bins
# territory/config/ambient.yml  — rise_yield, level fade rates

# territory/graph/permeability.yml  — edge/node p values; seal neighborhoods
# territory/hoods/{name}-seal.yml   — boundary perimeter + steward
```

## Modules

| Module | Input | Output |
|--------|-------|--------|
| `compose_payload` | rider text, menu YAML, or venue template | payload file |
| `spawn_menu_layer` | restaurant menu YAML + service window | layer(s) with cuisine smell |
| `tick_peecon` | peecon config + clock | spawn_layer if due and policy allows |
| `craft_brew` | payload + tokens | embedding (for spawn) |
| `spawn_layer` | edge + embedding + params | new layer L, s=1 at edge |
| `tick_layer` | layer L + road graph + permeability | updated sparse strength |
| `rise_to_ambient` | sub-ε L0 cell | collapse into abstract sparse ambient maps |
| `collapse_layers` | tag chain + centroids | pool many L0 into one L1 generic_* |
| `tick_ambient` | ambient sparse layer | slow diffuse/fade; long-range gradient |
| `apply_hood_seal` | boundary edges/nodes + p | permeability overrides |
| `zero_cells` | layer L | prune; recycle if empty |
| `sample_edge` | edge id | `[{ layer, strength, payload_ref }, …]` normalized |
| `sniff_neighbors` | edge + layer L | adjacent strengths + gradient hint toward source |
| `trace_smell` | start edge + layer L | path of edges toward spawn local maximum |
| `perceive_layers` | edge + goal q + nostril_width | layers passing similarity threshold τ |
| `score_neighbor` | e→e' + perceive set + q | weighted smell goodness for path pick |
| `navigate_market` | q, nostril_width, start edge | next-edge hints toward stand cluster |
| `project_display` | sample weights + embeddings | MapLibre style |
| `map_object_ops` | fountain / bed / roundabout | produce / consume / transform strength |
| `search_layers` | query vector or threshold | active layers on map |
| `peerboard_update` | spawn, refresh, longevity | peer credit |

## Map objects (Factorio tubes)

| Op | Example |
|----|---------|
| produce | fountain ENCIRCLE injects strength into aqua layers |
| consume | commons bed drains fertility-tagged strength → water credit |
| transform | roundabout stir redistributes strength across arms |
| amplify | `amplify > 1` near source; `< 1` near drain |

## v0 → v2

- v0: spawn one layer, no tick, decode on tap
- v1: one layer diffuses; sniff neighbors, follow gradient to spawn
- v2: market block — fruit cluster layers, widen nostrils, navigate by weighted smell
- v3: restaurant menus as YAML payloads; service-hour layers; cuisine centroids
- v4: Peecons — scheduled beacons drop pee at fixed edges (venues, stands)
- v5: permeability on segments/nodes — seal neighborhoods, block smell leaks

↑ [`../peerboard-and-brews.md`](../peerboard-and-brews.md)

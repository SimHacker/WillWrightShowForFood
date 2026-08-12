# Urban garden loop — community garden on the street graph

**Farmville / Stardew Valley** planting and growth — but the **city is the farm** and
**rides are the tools**. No button-mash farming; gestures on real geography.

**Don't complete, cooperate!** Community garden dynamics — not solo homesteading, not
zero-sum claiming. Riders **tend shared plots** together; contributions stack; harvest
is collective credit.

Inspiration: casual farm sims + TomTomagotchi geography needs + real-world community gardens.

## Core loop

```
join a shared plot (encircle block or roundabout — tend, don't deed)
  → plant seeds (anyone adds; patch grows together)
  → pump water (laps around fountains — fills commons tank)
  → carry water → water shared beds on your route
  → harvest together → split credit · feed animals · pigeons pollinate
```

State lives on **graph nodes** (blocks, roundabouts, fountain POIs) — Git + YAML shared
corpus, not per-rider walled gardens.

## Tend — encircle to cooperate

| Gesture | Opens / tends | Notes |
|---------|---------------|-------|
| `ENCIRCLE(block)` | **Community bed** on a city block | Perimeter ride = *membership*, not ownership — plot stays shared; optional **hood seal** lowers permeability on boundary segments so garden gazette smell stays in ([`peerboard-and-brews.md`](peerboard-and-brews.md#permeability--seal-neighborhoods-block-leaks)) |
| `ROUNDABOUT_LOOP` | Shared **roundabout garden** | Clockwise vs counterclockwise = different recipes ([`geometry-as-language.md`](geometry-as-language.md)); everyone stirs |
| `ENCIRCLE(park\|plot)` | Communal patch in parks, squares, traffic islands | Multiple riders extend the same YAML bed |

**Reject solo `COMPLETE_BLOCK` as conquest.** The gesture may still *detect* a full block
perimeter, but the outcome is **+1 tend credit** on a commons plot — never "plot locked to rider X."

| Solo (reject) | Community (harvest) |
|---------------|---------------------|
| I claimed this block | We tend this block |
| I finished the garden | The garden grew because we all watered |
| Harvest mine | Harvest pool — take what you need, leave some for others |
| Speed to win | Steady laps help everyone |

Plant **seeds** into the **shared bed** — seed type + OSM context sets growth; multiple
planters diversify the patch (tomatoes from Alice, basil from Bob).

## Water — fountain pumping (commons)

Fountains are **shared pumps**:

1. **Ride by** a fountain (`amenity=fountain`, historic fountain, pond with fountain tag)
2. **Encircle** again and again — each loop = one **pump stroke** into the **commons tank**
3. Any rider draws from the tank to water **any** shared bed they pass
4. Two riders pumping the same jet = cooperation bonus (social, not competitive)

Ponds and canals = lower-tier commons sources. Hill climbs (`CLIMB_HILL`) = shared greenhouse heat.

## Grow, spawn, and pick (fair share)

| Phase | Trigger | Output |
|-------|---------|--------|
| Plant | **seed** spent on shared bed | crop row in commons YAML — seeds are **scarce** |
| Water | any rider passes with water | `water` += contribution; log who helped |
| Mature | growth completes | **spawn** useful resources on the bed (fruit, veg, craft inputs) |
| Pick | rider rides through mature bed | each player may **pick one of each** spawned type |

### Pick rule — no race for harvest types

When a plant (or any spawner) produces fruit, vegetables, or other useful resources:

- Each **spawn wave** lists what appeared: e.g. `{ tomato: 5, basil: 3, wool: 1 }`
- Each **player** who visits may **pick one of each type** — Alice gets a tomato *and* a basil;
  Bob gets a tomato *and* a basil. No fistfight over the last tomato if types differ.
- Picking is **per player per spawn**, not first-come-first-served looting
- Unpicked spawns can remain for latecomers (same fair-share rule) or compost back into the bed

**No competition for resource types** — cooperation to grow; everyone who shows up gets a taste
of what the bed produced.

### Seeds — scarce and exclusive

| Resource | Scarcity | Rule |
|----------|----------|------|
| **Seeds** | **Scarce** | Found, crafted, traded, pigeon-dispersed — planting consumes them |
| **Harvest** (fruit, veg, wool, water…) | **Abundant at spawn** | Fair pick: one of each type per player per spawn |
| **Rare seeds** | **Exclusive** | Some varieties only from specific rides, gestures, or pigeon drops |

Seeds are the **planning** layer — who brings what to the commons bed matters. Harvest is the
**reward** layer — generous and non-zero-sum on types.

Picked goods feed TomTomagotchi, craft recipes, animal feed — player inventory, taken fairly.
Some picks are **brew inputs** for high-dimensional virtual pee ([`peerboard-and-brews.md`](peerboard-and-brews.md)).

## Animals — flock, herd, scatter (shared ecology)

Free-ranging **virtual animals** — city-wide, not caged in one rider's plot. Full herding
mechanic: **2D block pastures**, **1D road paths**, **gates** between them, lure/repel items,
burst disperse/converge, **collie agents**, consume/produce — see [`animal-herding.md`](animal-herding.md).

| Animal | Behavior | Role |
|--------|----------|------|
| **Pigeons** | Flocking + scatter when herded | **Pollination**; **spread seeds** across *open* communal beds |
| **Ducks / birds** | Flock dynamics near water | Seed carriers; fountain ecosystem |
| **Sheep / goats** | Pasture diffusion + path walks via gates | Wool, milk; commons pasture |

**Scatter virtual pigeons** — riding through a flock disperses them; they land on **shared**
beds and cross-pollinate what the community planted. Ecology nobody owns alone.

## Cooperation mechanics (design targets)

- **Partial progress stacks** — your water + my water + their laps
- **No plot lockout** — latecomers always welcome
- **Fair pick** — one of each spawned resource type per player; no harvest-type racing
- **Scarce seeds** — exclusive varieties; harvest is generous, planting is strategic
- **Tend ledger** — who planted, pumped, watered (async leaderboard of *helping*, not speed)
- **Commons decay** — beds dry without collective care (gentle nudge to cooperate, not nag)

## Tie-in to other pillars

| Pillar | Link |
|--------|------|
| [`geometry-as-language.md`](geometry-as-language.md) | Gestures = farm tools |
| [`exposure-pac-man.md`](exposure-pac-man.md) | Frontage pellets → seed types, soil hints |
| [`peerboard-and-brews.md`](peerboard-and-brews.md) | Personal territory *paint* is flair; **garden beds stay commons** |
| [`animal-herding.md`](animal-herding.md) | Pastures, gates, collies, cozy map view |
| [`semantic-polder.md`](semantic-polder.md) | Fountain tank as windmill outflow; dike = hood seal |
| [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md) | Detect tend + pump gestures |
| [`skeleton/story-layer.md`](skeleton/story-layer.md) | LLM narrates **our** harvest day |

## Will Wright flavor

Emergent city ecology: pigeons spread seeds nobody solo-planned; the roundabout pumpkin patch
is **ours**; fountain laps are better with friends. Prosocial simulation — the interesting
emergence is **cooperation**, not completion.

## Not this

- Solo claim-and-lock plots
- Racing other riders to grab the last tomato (fair pick prevents this)
- Infinite seeds / zero-cost planting
- Farmville energy bars / pay-to-skip
- Speed or racing to pick first

## v0 demo slice

One **shared** block bed + one fountain commons tank + one crop spawn.
Two riders: both pick one tomato each from the same spawn wave; seeds remain scarce to plant the next row.

↑ [`README.md`](README.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

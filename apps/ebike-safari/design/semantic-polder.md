# Semantic polder — waterschap on the smell network

**Dutch water board** (`waterschap`) as multiplayer game mechanic. A **polder** is land kept
dry by collective infrastructure: **dikes** seal the perimeter, **windmills** pump water out,
**canals** carry it away. Here the "water" is **layer strength** — smell liquid on the road
graph — and peers collaborate via **Git-as-MMORPG** (PRs, stewards, shared YAML) to manage
semantic drainage.

Amsterdam lineage: real polders, canals, windmills on OSM; ebike safaris already ride through
this geography ([`sources/amsterdam-gps-lineage.md`](sources/amsterdam-gps-lineage.md)).

## Map — polder ↔ territory model

| Waterschap | Territory layer |
|------------|-----------------|
| **Polder** | sealed neighborhood — hood with low-permeability **dike** boundary |
| **Water level** | aggregate strength of layers inside the polder |
| **Dike** | `permeability → 0` on perimeter edges/nodes ([`peerboard-and-brews.md`](peerboard-and-brews.md)) |
| **Inflow** | Peecons, stands, peer brews spawning inside |
| **Windmill** | pump that **pulls** strength out through a **semantic filter** |
| **Filter** | adjustable nostril — `cos(q, embed(L)) ≥ τ` decides what may pass |
| **Canal / pond** | approved outflow — strength deposited to `waterway=*`, target hood, or commons tank |
| **Sewage / black hole** | rejected semantics — strength **destroyed**, not relocated |
| **Water board** | steward peers — Git PRs set dikes, filters, pump schedules |

Smells are ads on roads ([`peerboard-and-brews.md`](peerboard-and-brews.md)); polders are
**managed ad ecology** — keep the good stuff in, pump the rest out, don't let the neighborhood
flood with feral pigeon pee.

## Core loop — collaborative drainage

```
peers seal a block (dike / hood permeability)
  → inflow: Peecons, gardens, markets spawn layers inside
  → strength accumulates ("water level" rises)
  → windmill pumps (gesture or tick) pull strength toward mill node
  → semantic filter: pass (canal) vs reject (sewage)
  → board adjusts τ, pump rate, outflow target via Git PR
  → unseal or breach dike = multiplayer incident (optional drama)
```

**Don't complete, cooperate** — same ethic as community garden
([`urban-garden-loop.md`](urban-garden-loop.md)). No one owns the polder; the **waterschap**
maintains shared infrastructure.

## Windmill — semantic pump

Plant a windmill on a graph node (OSM `man_made=windmill`, `historic=windmill`, or virtual
mill after peer vote). Each tick or **ENCIRCLE(windmill)** stroke adds pump work.

```
for each layer L with strength inside polder P:
  s_avail ← s(L, e) on edges within P
  pull ← pump_rate × s_avail

  if cosine(embed(L), filter.q) ≥ filter.τ:
    deposit(pull, outflow_target)     # canal, pond, neighbor polder, commons tank
  else:
    destroy(pull)                     # sewage system or black hole — gone from network

  s(L, e) ← s(L, e) − pull
```

**Adjustable semantic filter** — same knob family as nostril width:

| Filter setting | Passes | Rejects to sewage |
|----------------|--------|-------------------|
| `q = generic_fruit`, τ wide | fruit stand layers | meat, feral, spam brews |
| `q = cuisine:dutch`, τ medium | Dutch restaurant Peecons | Thai bleed from outside |
| `q = peer:alice`, τ narrow | Alice's solidarity brews | everything else |
| `τ → 1` (pinch shut) | almost nothing — polder floods | — |
| `τ → 0` (open sluice) | everything passes to canal | — |

Filter config is **YAML in Git** — the water board debates in PR comments, merges the sluice
setting, sim picks it up on next tick.

```yaml
# territory/polders/jordaan-demo.yml
id: polder/jordaan-demo
steward: waterschap:jordaan-peers          # GitHub team or CODEOWNERS
dike:
  ref: territory/hoods/jordaan-demo-seal.yml
  permeability: 0.05

inflow:
  - peecon/de-polder-keuken
  - bed/demo-block-7

windmills:
  - id: mill/westertoren-sluis
    node: node/8842101                   # or OSM historic=windmill
    pump_rate: 0.12
    gesture: ENCIRCLE(windmill)            # optional boost on ride
    filter:
      q_ref: embed(cuisine:dutch)        # or payload ref
      tau: 0.55                          # board adjusts via PR
    outflow:
      target: waterway/gracht/4821       # canal — strength joins aqua-class layers
      reject: sewage                     # black hole — destroy strength

    # alternate outflow targets:
    # target: polder/noord-brew          — pump into neighbor polder (gift or flood)
    # target: commons/fountain-tank-7    — urban garden water credit
    # target: black_hole                  — pure destruction, no downstream

metrics:
  water_level: sum(s(L,e) for e in P)      # dashboard for board
  passed_volume: …
  sewage_volume: …
```

## Outflow targets

| Target | Effect |
|--------|--------|
| **Canal** | `waterway=canal` — strength becomes aqua-tagged diffusion downstream along water graph |
| **Pond / lake** | `natural=water` — local reservoir; may amplify compatible layers at shore |
| **Neighbor polder** | cross-dike transfer (requires sluice gate — asymmetric permeability) |
| **Commons tank** | [`urban-garden-loop.md`](urban-garden-loop.md) fountain water credit |
| **Sewage** | destroy filtered-out strength — sanitation win |
| **Black hole** | destroy **all** pumped volume regardless of filter — emergency drain |

Canals and roads are both **distribution channels** — liquid moves on whichever graph edge
type the outflow policy attaches to.

## GitHub-as-MMORPG — the water board

Multiplayer without a proprietary server: **the repo is the world state**.

| Player action | Git mechanic |
|---------------|--------------|
| Propose new polder | PR adds `territory/polders/*.yml` + dike seal |
| Adjust filter τ | PR edits windmill `filter.tau` — board review |
| Plant windmill | PR + OSM node ref; maybe peerboard credit threshold |
| Breach / repair dike | PR changes boundary `permeability` — incident log in commit message |
| Operate pump today | merge schedule cron or ride gesture logged in ride YAML |
| Audit sewage | read `metrics.sewage_volume` in built artifacts |

**Waterschap** = CODEOWNERS on `territory/polders/` — merge rights as elected board. Ride
events and Peecon ticks are **world ticks**; Git history is the **audit trail** of who moved
the sluice when. MMORPG pun intact: Massively Multi Peer Online Roll Peeing Game, now with
civil engineering.

## Gestures

| Gesture | Polder effect |
|---------|---------------|
| `ENCIRCLE(block)` | tend dike / join waterschap ([`urban-garden-loop.md`](urban-garden-loop.md)) |
| `ENCIRCLE(windmill)` | boost pump for session |
| `ENCIRCLE(pond)` | collect — inverse pump? fill from canal (later) |
| `CROSS_BRIDGE` | traverse dike without opening sluice — rider only, smell stays |
| `COMPLETE_BLOCK` | weave dike segment — raise steward credit |

OSM: `man_made=windmill`, `waterway=canal`, `natural=water`, `barrier=ditch` as world props.

## Tie-in

| Doc | Link |
|-----|------|
| [`peerboard-and-brews.md`](peerboard-and-brews.md) | layers, Peecons, permeability, nostril filter |
| [`urban-garden-loop.md`](urban-garden-loop.md) | commons tank as outflow; ENCIRCLE block |
| [`geometry-as-language.md`](geometry-as-language.md) | ENCIRCLE pond/fountain; windmill gesture |
| [`skeleton/territory-layer.md`](skeleton/territory-layer.md) | tick, pump, filter modules |
| [`skeleton/road-graph.md`](skeleton/road-graph.md) | edge/node ids for dikes and mills |

## Games (sketch)

- **Keep the polder dry** — board sets filter; feral pigeon Peecon spam rises water level; peers
  must pump or tighten dike before overflow leaks to neighbors
- **Semantic reclamation** — pump meat-market smell to sewage, keep fruit inside for market day
- **Canal gifting** — pass Dutch cuisine to gracht outflow; downstream hood gets free ad boost
- **Sluice war** — asymmetric PR battle over `tau` (pinch vs dilate) — social, not PvP speed

## Conserved mass — bounce, pumps, and setpoints

When sub-threshold smell **bounces** to top-N centers instead of being destroyed
([`peerboard-and-brews.md`](peerboard-and-brews.md)), each layer keeps a **spatially coherent
fixed budget** of that scent on the map — ONI-style conservation, not evaporation. Controllers
(windmills, locks, waterfalls) **pump in or out** to drive **total mass** toward a goal, subject
to `pump_rate`, filter τ, and sluice state.

```
M(L, polder) = Σ s(L,e)   # conserved unless sewage, graze, or cross-polder transfer

controller observes M vs setpoint M*
  → pump_in  if M < M* − deadband   (emitters, Peecon boost, upstream canal gift)
  → pump_out if M > M* + deadband   (windmill + filter, lock drain, sewage)
  → bounce recenters weak fringe on peaks without changing M
```

| Infrastructure | OSM prop | Sim role |
|----------------|----------|----------|
| **Windmill** | `historic=windmill` | semantic pump + filter |
| **Lock / sluice** | `waterway=lock` | open = transfer; closed = block; **fill/drain** schedules water_level between reaches |
| **Waterfall** | weir / `waterway=dam` | one-way outflow, destroys or downgrades strength |
| **Canal segment** | `waterway=canal` | 1D water graph — smell + **boats** move here |

**Intersection-Canalization** (Trent Small, [Ackley room](../../../characters/dave-ackley/sources/tsmall-local-routing-mfm/full-text.md)) on the water graph: locks remember last good through-direction for duck traffic.

## Waterway herding — ducks, boats, Link chickens

**Path animals** on land ([`animal-herding.md`](animal-herding.md)); **water animals** on canal/pond graph only — ducks, geese, swans constrained to `waterway=*` and `natural=water` edges.

| Action | Gesture / tool | Effect |
|--------|----------------|--------|
| **Round up** | `ENCIRCLE(pond)` | pick up flock into rider inventory (Link chickens) |
| **Carry** | ride road graph with inventory | ducks in basket — not on water until release |
| **Release** | stop at canal/pond, throw in | spawn flock on water graph at edge |
| **Boat traffic** | optional NPC | moves on canal; opens lock schedule; carries layer packets |

Ride to Vondelpark pond → circle → collect ducks → bike along gracht → release at another pond.
Fences on **road** graph don't block water; **locks** block canal edges until opened (PR or ride gesture).

↑ [`README.md`](README.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

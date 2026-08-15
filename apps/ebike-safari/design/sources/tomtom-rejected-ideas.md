# TomTom rejected ideas — harvest index

Ideas TomTom did **not** ship — kept here as inspiration. Reject the **product context**
(PND, car speed); harvest the **mechanics** for Ebike Safari.

## How they happened

TomTom asked employees for **out-of-the-box** ideas for **TomTom Navigator** features —
especially the **internet-connected** versions. Two proposals from that brainstorm were
**shot down with prejudice** (not gently deferred — rejected outright).

## Rejected at TomTom

| Idea | Who | Why rejected | Ebike Safari reinterpretation |
|------|-----|--------------|-------------------------------|
| **TomTomagotchi** | **Don Hopkins** | PND with simulated personality begging you to drive to POIs for cravings/mood; product-placement revenue (Burger King, car washes) | **Harvest** — pet needs from **geography**, not buttons. Thirsty → circle pond; wants apples → encircle orchard. See [`../geometry-as-language.md`](../geometry-as-language.md#tomtomagotchi) |
| **Segment speed leaderboard** | **Unnamed TomTom co-worker** (Don does not recall the name; will not take credit — original and devious; Don wishes he'd thought of it) | High score = fastest time on **every road segment** on the map. Lawyers would not approve — actively dangerous | **Reject speed.** Replace with **[peerboard](../peerboard-and-brews.md)** — peers not racers |

Don's HN telling of TomTomagotchi: [`../../../process/hn-harvest/will-wright.md`](../../../../process/hn-harvest/will-wright.md) (search "TomTomagotchi").

## Safe scores (not speed)

What *can* we rank on a segment graph without encouraging reckless riding?

| Score | Measures | Fits Ebike Safari |
|-------|----------|-------------------|
| **Novel exposure** | First time passing a place-type on this edge (both sides) | [`../exposure-pac-man.md`](../exposure-pac-man.md) |
| **Gesture recognition** | ROUNDABOUT, ENCIRCLE, COMPLETE_STREET spells detected | [`../geometry-as-language.md`](../geometry-as-language.md) |
| **Token gather** | OSM "pellets" collected along frontage during ride | exposure log tallies |
| **Craft quality** | Combine gathered tokens into recipes (TomTomagotchi soup) | geometry-as-language crafting |
| **Garden yield** | Collective harvest from shared beds | [`../urban-garden-loop.md`](../urban-garden-loop.md) |
| **Tend credit** | Water / pump / plant contributions on commons plots | cooperation ledger — not ownership |
| **Fair pick** | One of each spawned resource type per player | no harvest-type competition |
| **Territory paint** | Crafted brew spent on segments — **peerboard** flair | [`../peerboard-and-brews.md`](../peerboard-and-brews.md) |
| **Coverage** | % of named streets in a bbox visited (slow is fine) | exploration, not racing |
| **Review depth** | Field notes / video sync richness at check-in points | BONGO BINGO lineage |

Leaderboards if any: **async, anonymized, opt-in** — never real-time speed on public roads.

Use a **peerboard** instead — see [`../peerboard-and-brews.md`](../peerboard-and-brews.md).

## Gather → craft brew → spend (territory paint)

Wild TomTom-era concept, highly inspirational — now with **brew recipes**:

1. **Gather** — ride collects tokens from the map (OSM frontage pellets, gesture completions, garden picks)
2. **Craft** — combine into **brews** of high-dimensional virtual pee (distinct recipes, vectors, hues)
3. **Spend** — paint segments you helped tend — personal flair on the peerboard map

Full spec: [`../peerboard-and-brews.md`](../peerboard-and-brews.md) — MMORPG (*Massively Multi Peer
Online Roll Peeing Game*). Ostensibly peers = democratic equals; hidden: peers = pee-ers.

Garden **beds** are always commons ([`../urban-garden-loop.md`](../urban-garden-loop.md) —
don't complete, cooperate). Paint is signature, not eviction.

### Inspiration: Mark Your Territory

[**Andrew Quitmeyer**](../../../../characters/andrew-quitmeyer/README.md) — Stupid Fun Club intern,
Georgia Tech (Janet Murray). [**Mark Your Territory**](../../../../characters/andrew-quitmeyer/sources/mark-your-territory.md)
(Oct 2011): open-source **Pee-to-Check-In-to-Foursquare** — bodily ubicomp as playful territory claim.

| Mark Your Territory | Ebike Safari harvest |
|---------------------|----------------------|
| Check in by peeing | Check in by **riding through** — continuous trace |
| Foursquare API | FIT trace + OSM snap |
| Bodily / hardware gag | **Virtual** territory paint on segments — same spirit, bike-safe |
| Single POI mark | Polyline **segment** ownership / color layer |

Video: [Mark Your Territory](https://www.youtube.com/watch?v=rRdfeb7vDWg) ·
GitHub: [quitmeyer/Mark-Your-Territory](https://github.com/quitmeyer/Mark-Your-Territory---Pee-to-Check-In-to-Foursquare)

## Skeleton targets

| Mechanic | Skeleton | Status |
|----------|----------|--------|
| Token gather + exposure | [`../skeleton/exposure-log.md`](../skeleton/exposure-log.md) | not started |
| Craft recipes | [`../geometry-as-language.md`](../geometry-as-language.md) | draft |
| Segment paint layer | [`../skeleton/territory-layer.md`](../skeleton/territory-layer.md) | not started |
| Peerboard + brews | [`../peerboard-and-brews.md`](../peerboard-and-brews.md) | draft |
| TomTomagotchi needs | [`../skeleton/story-layer.md`](../skeleton/story-layer.md) | noted |
| Urban garden sim | [`../skeleton/urban-garden.md`](../skeleton/urban-garden.md) | not started |

## Reject forever

- Per-segment **speed** leaderboards on public roads
- Car-centric TomTomagotchi product placements
- Anything that rewards faster riding through traffic

↑ [`../CAULDRON.yml`](../CAULDRON.yml) · [`amsterdam-gps-lineage.md`](amsterdam-gps-lineage.md)

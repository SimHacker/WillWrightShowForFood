# Geometry as language

Core shift: **the world is the controller**. The bicycle is the turtle; OpenStreetMap is
the microworld; the ride is a program written on the street graph.

## Semantic gestures (spells)

Recognize movement patterns on the road graph — not raw GPS wiggles:

| Gesture | Example |
|---------|---------|
| ROUNDABOUT(clockwise) | stir soup |
| ROUNDABOUT(counterclockwise) | whisk cream |
| ENCIRCLE(pond) | collect water |
| COMPLETE_STREET | weave cloth |
| COMPLETE_BLOCK | build a brick |
| VISIT_CUL_DE_SAC | — |
| CROSS_BRIDGE | — |
| RIDE_ALONG_RIVER | — |
| TRACE_RAILROAD | — |
| CLIMB_HILL | heat (crafting) |
| COAST_DOWNHILL | — |
| FIGURE_EIGHT | — |
| LASSO(park) | herd virtual animals — sustained arc ([`animal-herding.md`](animal-herding.md)) |
| SPIRAL_IN / SPIRAL_OUT | — |
| COMPLETE_BLOCK | weave cloth / **tend** shared bed ([`urban-garden-loop.md`](urban-garden-loop.md)) |
| ENCIRCLE(block) | join community garden — cooperate, don't conquest |
| ENCIRCLE(fountain) × N | pump into **commons** water tank |
| ENCIRCLE(windmill) | boost semantic polder pump ([`semantic-polder.md`](semantic-polder.md)) |

OSM tags supply objects without hand-placed collectibles:

- `natural=water`, `landuse=forest`, `leisure=park`, `historic=castle`
- `amenity=school`, `waterway=river`, `waterway=canal`, `railway=rail`, `bridge=yes`
- `man_made=windmill` — semantic polder pump ([`semantic-polder.md`](semantic-polder.md))

## Hierarchical recognition

```
GPS trace
  → road graph (snap + edges)
    → gestures (ROUNDABOUT_LOOP, ENCIRCLE, …)
      → OSM objects (Fountain Square, pond, forest)
        → stories (LLM interprets; engine does not invent narrative)
```

Example chain:

```
entered roundabout → 360° → exited same branch
  → ROUNDABOUT_LOOP
    → around Fountain Square
      → "Fed ducklings" (LLM reward)
```

## Bike as skywriting plane

The bicycle is not a dot on a map — it is a **skywriting plane**. As you pedal, you **trail
smoke** across the city: continuous emission along the ride path, visible from above, written
on the street graph below.

| Skywriting | Ebike Safari |
|------------|--------------|
| Plane altitude | rider on the road (GPS truth) |
| Smoke trail | recent edges painted with active **brew** / layer strength |
| Smoke color | projection of `embed(YAML jazz)` — semantic ink |
| Letters fade | `fade_rate` — ephemeral; re-pee or Peecon renews |
| Aerobatics | gestures — ROUNDABOUT = loop-de-loop, FIGURE_EIGHT = signature |
| Message | payload decode when someone **sniffs** your trail |
| Billboard hunt | follow someone else's smoke gradient to source |

**Continuous write, not point taps:** every traversed segment can receive a drip of the brew
you're carrying — skywriting mode vs single **spawn_pee** at one edge. The FIT trace is the
flight path; MapLibre overlay is the contrail ([`skeleton/viewer-maplibre.md`](skeleton/viewer-maplibre.md)).

Optional viewer treat: render trail slightly **above** the basemap (extruded line, soft particle
haze) so the city reads as canvas and rides read as **text in the sky**. Smells still diffuse
on the road network ([`peerboard-and-brews.md`](peerboard-and-brews.md)) — ground-level
distribution; skywriting is the **glance** layer peers see from zoomed out.

Peers spell solidarity over blocks, market routes become aromatic cursive, polder windmills
**pump smoke down** from the canal. MMORPG sky: many planes, many trails, Git audit of who
wrote what when.

## TomTomagotchi++

**Don's idea** — submitted during TomTom's employee brainstorm for out-of-the-box Navigator
features (~2007–2009). Shot down with prejudice as a car PND product; harvested here for bikes.

Pet needs emerge from geography — no arbitrary button presses:

- thirsty → ride around nearest pond
- wants apples → encircle orchard
- wants to play → ride around playground

Crafting from rides: soup needs water (pond circle), vegetables (farmland visit),
heat (hill climb).

Rejected at TomTom as a car PND product — harvested here for bikes. Territory paint loop
(gather tokens → craft → spend on segment claims) inspired by
[Andrew Quitmeyer's Mark Your Territory](../../../characters/andrew-quitmeyer/sources/mark-your-territory.md).
See [`sources/tomtom-rejected-ideas.md`](sources/tomtom-rejected-ideas.md).
Full farm loop: [`urban-garden-loop.md`](urban-garden-loop.md) — **community garden**:
tend shared blocks/roundabouts (don't complete, cooperate), pump fountains to commons,
water together, harvest collectively, pigeons for pollination.

## Will Wright flavor

Consistent simulation rules; emergent behavior over scripted outcomes. Question is not
"did the player press the right button?" but "what meaningful thing did they do in the world?"

↑ [README.md](README.md) · [exposure-pac-man.md](exposure-pac-man.md)

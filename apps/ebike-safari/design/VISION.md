# Ebike Safari — vision

**Pinball Construction Set meets OpenStreetMap. Your bike is your pinball and joystick.**

A bike is a joystick and pinball you can actually ride and roll around in the
real world — being Mario and driving his cart directly, with Marble Madness.

Bill Budge's *Pinball Construction Set* — you drop bumpers on a table and then
play it — except the table is the city and you did not have to draw the
walls — OSM already did. Gadgets (roundabouts, fountains, blocks, dikes) you
place or recognize. You do not hold a stick and watch a ball. You *are* both.
You do not remote-control a sprite. You *are* Mario in the kart. You *are*
the marble. The city is the track and the isometric maze. Brake levers are
the flippers: stop and the place comes into focus; roll on and the UI gets
out of the way. Lead, follow, or get out of the way.
A wait at a light or sign is the other stop — patience, spendable somewhere
else, feeding transgression and fed by it; the city carries a flowing heat
map of where it was minted ([`patience.md`](patience.md)).

The joystick metaphor is not a gag. In every way — physical, emotional, mental —
the bike is already joy, transportation, exercise, and freedom. That is why it
is the controller: it is how you *move through the world*, not a plastic stick
you aim at a screen. The game sits on top of a thing that already mattered.

**Live is multiball.** Several bodies on the table at once — bikes, Sims, a
van with a party inside. Gathering for a ferry, a bus, a tram is a
wonderful social pastime — the wait point *is* the party
([`wait-points.md`](wait-points.md)). **Async is following a trail:** someone else's path
and the cards they left. You play a card at a place; cards link *both* ways,
in time (before / after) and in meaning (same story, a reply). That is the
Urban Safari / StoryMaker model, still the right one
([`../LEGACY-URBAN-SAFARI.md`](../LEGACY-URBAN-SAFARI.md) ·
[`skeleton/story-layer.md`](skeleton/story-layer.md)).

**The world is the controller.** The bicycle is the turtle; OpenStreetMap is the microworld;
the ride is a program written on the street graph.

**Many games, one map — one shared data plane.** Exposure, territory, garden, polder, herding,
story, and future tenants **read and write the same stores**; layers are projections
([`map-game-platform.md`](map-game-platform.md)).

## One line

Continuous GPS rides become **semantic events** (gestures on the graph) and **exposure logs**
(what place-types passed you on both sides of the road) — the bike **skywrites** brew trails
as it moves — then optional **stories** an LLM reads from those events, not from hand-authored quests.

## Three layers of meaning

```
GPS trace
  → road graph (snap, edges, left/right frontage)
    → gestures (ROUNDABOUT, ENCIRCLE, COMPLETE_STREET, …)
    → exposure (homes, cafes, parks, bridges — Pac-Man on both sides)
      → stories (LLM interprets sequences; engine stays honest)
```

## Not Urban Safari

| Urban Safari (amber) | Ebike Safari (active) |
|----------------------|------------------------|
| Google Maps / MapKit | OpenStreetMap + MapLibre |
| MySQL scene graph | Git + YAML + static JSON |
| Proprietary map SDKs | FIT pipeline in [`../scripts/`](../scripts/) |
| SFC server stack | This repo + local FIT drops |

See [`../LEGACY-URBAN-SAFARI.md`](../LEGACY-URBAN-SAFARI.md) for where history lives.

## Not gamified distance

Score **novel exposure** and **recognized gestures**, not kilometers.

> Passed 83 homes, 14 cafes, 2 bridges — first windmill — ROUNDABOUT(clockwise) at Fountain Square.

## Show direction

Voice-first touring companion seed: [`../../../repo-shows/ebike-safari/`](../../../repo-shows/ebike-safari/).
Pipeline first; viewer + gestures prove the idea on real rides.

↑ [`README.md`](README.md) · [`ARCHITECTURE.yml`](ARCHITECTURE.yml)

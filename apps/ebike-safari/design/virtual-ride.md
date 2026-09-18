# Every screen runs the whole app — and the desktop is a bike

The question "what hardware is this for, if not a phone" has the wrong shape. The answer is
**everything**, and the important target is not some niche head unit — it is the browser window on a
desk, running the same app, with every feature working and a simulated bike instead of a real one.

This is not a demo mode and not a development harness, though it is both of those for free. Riding a
city you have never visited, or one you love, from a desk is **its own pleasure** — planning, touring,
remembering, teaching, showing off, wandering. Most people who ever use this will use it that way,
and they should get the whole thing.

## The acceptance test

You find a link on Hacker News. You open it in a desktop browser. No signup, no app store, no
hardware. You load the city you love, drag a bike onto your old street, and ride.

Everything works: the map, the layers, the smells, the gardens, the animals, the exposure, the
record, the eggs, the voice, the story. Nothing says "not available in simulation." If a feature
cannot be reached from a desk, that is a bug in the feature.

That single scenario is simultaneously the demo, the tutorial, the marketing, the test suite and a
large part of the product.

## One point stream, three sources

The architecture that makes this affordable is already in place. The viewer consumes a series of
points; a live ride is that same series arriving one at a time
([`bike-computer.md`](bike-computer.md)). So there is exactly one pipeline, tagged by origin:

| Source | What produces the points |
|---|---|
| `gps` | A real bike, live |
| `replay` | A recorded ride, scrubbing and time-compressible |
| `sim` | A virtual bike being driven right now, on the real road graph |

**Two code paths for real and simulated is the failure mode.** Everything downstream — gestures,
bumps, exposure, garden, story, voice — reads the stream and cannot tell, except by reading the tag
when it matters. The dual-drivable rule from
[interfaces to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)
extends here: every step is performable on the bike, at the desk, or by an agent, and a simulated
rider is how an agent rides.

## Driving a virtual bike

| Control | Behaviour |
|---|---|
| **WASD / arrows** | Real-time first-person riding. Momentum, gradient, and assist as modelled; the road graph constrains where the wheels can go |
| **Drag and drop** | Grab the bike and put it anywhere — your house, a station, the middle of a bridge |
| **Click to place** | Waypoints, destinations, garden beds, territory paint |
| **Turtle graphics** | `forward 100`, `left 90`, `follow Prinsengracht` — Logo on the street grid, scriptable, recordable, shareable. Papert's turtle is already the right ancestor for the rest of this project |
| **On-screen controls** | A simulated cockpit: assist level, brake, bell, gesture buttons, the pie menu — like a driving sim's panel, or a device emulator |
| **Time compression** | Boring stretches at 8×. The clock is the playhead's, not the world's ([`city-record.md`](city-record.md)) |
| **Hyperjump** | Teleport to a place, a saved point, or a moment in a recorded ride, without pretending you rode there |
| **Scrubber** | Any recorded ride, forward and back, with the map and the video and the transcript in sync ([`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)) |

Phone browsers get the same thing, including desktop-width mode. A phone on a table is a small desk.

## Synthesised senses, and why that is useful

A simulated ride can synthesise the sensors a real ride measures, and this closes a loop that is
genuinely hard to close otherwise:

- **Bumps out of surface tags.** The road graph already knows `surface=sett`; the simulator can
  generate the vibration a cobbled street would produce, so the desk ride *feels* like the city, in
  sound and in the record ([`bumps-as-input.md`](bumps-as-input.md)).
- **Bumps back in as tests.** The same generator produces synthetic input for the bump classifier,
  with ground truth attached. Render what the sensor would have seen, then check what the reader says
  — the same method used to test the optical code readers in MicropolisCore.
- **GPS with realistic failure.** Urban canyon noise, tunnel dropouts, the dead-reckoning case TomTom
  built EPT for. A route planner that has never seen a dropout will fail on the first bridge.

Measured rides make the simulation truthful; the simulation makes the measurement testable.

## Dynamic queries, not a search box

Planning is where Shneiderman's dynamic queries belong, and Don has built this interface before — the
Dynamic Zone Filter in SimCity, an homage to the Dynamic HomeFinder
([`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md)). Two-ended sliders over the layers the
city has: roughness, greenery, quiet, shade, traffic, smell, exposure, unvisited-ness. The map
updates continuously as you drag, at a hundred queries a second, with no syntax and no submit button.

A route emerges from filtering a city rather than from naming a destination. That is the same act as
the smell hill-climb on the bike ([`navigation-smell-steer.md`](navigation-smell-steer.md)), done with
a mouse and a whole city in view.

## Massively single-player

The social layer is asynchronous by design, and virtual riders are full participants:

- Rides, routes, tours, gardens, territory and stories are files in the shared data plane
  ([`map-game-platform.md`](map-game-platform.md), [`git-postgres-sync.md`](git-postgres-sync.md)).
- You meet other people's traces, tended beds and worn grooves, not their cursors. Presence is
  something the city remembers, not something that has to be simultaneous.
- A virtual rider can plan a tour that a physical rider then rides, and the physical rider brings
  back photographs, bumps and speech that the virtual rider tours afterwards. That exchange is the
  actual community mechanic.
- Desktop peers also seed the map packs ([`map-distribution.md`](map-distribution.md)).

## Consequences worth stating

- **Someone who cannot ride can use all of it.** Parity is not a courtesy; it is why the rule is
  absolute.
- A city you toured virtually and then rode is a different experience from either alone, and the
  system holds both records against the same streets.
- The desk is where the archive is legible: the ride you did today, the city as it was, the version of
  the street before it was repaved.

↑ [`bike-computer.md`](bike-computer.md) · [`city-record.md`](city-record.md) · [`map-game-platform.md`](map-game-platform.md) · [`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md)

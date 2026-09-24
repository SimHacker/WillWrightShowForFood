# Layers and games over the ride

**Status:** draft
**Mechanics:** [`map-game-platform.md`](map-game-platform.md) · **History:** [`lineage.yml`](lineage.yml),
[`sources/amsterdam-gps-lineage.md`](sources/amsterdam-gps-lineage.md)

Ebike Safari is the platform that Urban Safari and StoryMaker were reaching for at Stupid Fun Club.
The ride is the one shared input. On top of it sit **information layers**, which hold what is known
about places, and **games**, which read the ride and the layers and keep their own score. Each is a
tenant with a contract. None of them owns the ride, and none of them needs another company's
platform to exist.

## Where this comes from

**One database, many surfaces (2009).** The Amsterdam Coffeeshops database was a spreadsheet of
every coffeeshop, with photos and notes. On top of it Don built an iPhone app, a website, a LayAR
augmented-reality overlay, and in 2011 [Bongo Bingo](bongo-bingo.md). The lesson was that the
content layer sits behind the map, and the apps are views of it.

**Stories made by many people in real places (2009–2011).** At Stupid Fun Club, with Will Wright,
StoryMaker ran collaborative branching stories, and Bar Karma turned them into a network TV series
whose audience branched the plot. Urban Safari was StoryMaker's geolocated branch: you captured
scene cards in the field, followed paths through a shared graph, and in 2011 it was performed live
in Amsterdam ([`../LEGACY-URBAN-SAFARI.md`](../LEGACY-URBAN-SAFARI.md)). The lesson was that a
story can be built from what people actually did in actual places, through many clients at once.

**What was missing then.** Every one of those projects stood on something it did not control:

- **Points, not paths.** A check-in or a scene card records where you were at one moment. The
  route between them, where you slowed down and where you waited, was lost.
- **Borrowed maps.** Google Maps and Apple MapKit drew the city, on their terms.
- **Borrowed data.** Scene graphs lived in MySQL on a server, and the social layer lived in
  Foursquare. When Foursquare moved check-ins into Swarm and changed its API, Bongo Bingo's way of
  marking a square was gone.

**What Ebike Safari supplies.** A continuous ride trace from the bike, snapped to OpenStreetMap,
turned into stops, gestures and exposure ([`VISION.md`](VISION.md)). Git and YAML instead of a
server database. And a rule that every tenant declares what it reads and writes
([`map-game-platform.md`](map-game-platform.md#shared-data-contracts--the-actual-platform)), so
layers and games share data without sharing code.

## Two kinds of tenant

| Tenant | Kind | Reads | Writes |
| --- | --- | --- | --- |
| [amsterdank](https://github.com/SimHacker/amsterdank) | information layer | your photos at stops, the city's tolerance roster, other sources | claims about places, each with source, date and confidence |
| [Bongo Bingo](bongo-bingo.md) | game | `STOP` events, your photos, amsterdank's list of coffeeshops | its own cards: seeds, marks, bingos |
| [Story layer](skeleton/story-layer.md) | story | the ride's event log | narration, never new geometry |
| [Exposure](exposure-pac-man.md) | measurement | the snapped trace | what passed you on the left and right |
| [Clippings](https://github.com/SimHacker/moollm/blob/main/designs/editing-history/CLIPPING-SERVICE.md) | personal layer | `STOP` events, photos and voice notes at stops | your clippings keyed on place, resurfaced when you stop there again |

**An information layer** is a register of places that other tenants can read. Amsterdank is the
first one: a coffeeshop register that keeps disagreements instead of averaging them away, keyed on
the address rather than the business, with the provenance of every value on record. It never writes
to OpenStreetMap, and it keeps OpenStreetMap data out of its own records, because the licences
point in both directions
([amsterdank README](https://github.com/SimHacker/amsterdank#provenance-which-is-the-whole-architecture)).

**A game** reads the ride and any layers it wants, and writes only its own state. Bongo Bingo does
not know how the ride was recorded, and the ride does not know Bongo Bingo exists.

## One stop, four tenants

You ride to a coffeeshop, stop outside and take a photograph.

1. **Exposure** has already counted the cafés you passed on the way.
2. **Amsterdank** gets survey evidence: a photograph of the door, with a position and a time, which
   becomes a claim about that address.
3. **Bongo Bingo** sees a `STOP` within N metres of a coffeeshop on your card, plus your photo, and
   marks the square.
4. **The story layer** has one more event to narrate.

None of these tenants called another. Each one read the same stop from the shared store. Playing the
game produced data for the register, which is what the 2011 version already did with check-ins: in
GEOTOKING's words, "a poor life decision and an excellent data collection strategy."

## Other cities, other layers

Amsterdank is bound to one city because coffeeshop tolerance is a Dutch municipal policy. The
pattern is not. Any register of places can be a layer: bike repair shops, drinking fountains,
drawbridges and their schedules, or blocked bike lanes, which is the third-party test in
[`map-game-platform.md`](map-game-platform.md#the-third-party-test--somebody-elses-app-as-a-contract).
Any game that can be stated as a selection over rides and layers can be a tenant, and the
monsters are already waiting
([`map-game-platform.md`](map-game-platform.md#sims-style-tenants-let-the-monsters-loose)).

## Rules

- **The ride is the rider's.** It stays on the rider's device unless the rider publishes it
  ([`privacy.md`](privacy.md)). A layer receives claims about places, not the trace of a person.
- **Layers keep their provenance.** A value without a source, a date and a confidence is not data.
- **Games keep their own state.** A game may read any layer; it writes only under its own name.
- **No leaderboards by default.** Scores are local and opt-in.
- **Never write OpenStreetMap.** Findings leave as a worklist a person reviews
  ([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md)).

↑ [`INDEX.yml`](INDEX.yml) · [`VISION.md`](VISION.md) · [`map-game-platform.md`](map-game-platform.md)

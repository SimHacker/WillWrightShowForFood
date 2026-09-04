# Wait points

A **wait point** is a place the city asks you to pause — light, signal, sign,
drawbridge, **ferry, bus, tram**, or a pin someone dropped. Auto-generated
from OSM, or placed and edited by hand. Both meters read the same objects
([`patience.md`](patience.md) · [`transgression.md`](transgression.md)).

Do not reconstruct the light. Do not identify the crossing. Weigh how likely
it is that a short pass was a transgression, and **dither** the points.

## Where they come from

| Source | How |
|--------|-----|
| OSM | `highway=traffic_signals` / `stop` / `give_way`, signaled crossings |
| OSM drawbridge | `bridge=movable` / `bridge:movable=*` — every one is a lottery |
| OSM transit | `amenity=ferry_terminal`, `highway=bus_stop`, `railway=tram_stop` / `station`, `public_transport=platform` — a gather |
| Rides | Enough traces: cluster dwells, learn typical and envelope. Time of day + weekday. |
| Manual | Dropped pin, dragged, typed `p` and typical — local rule OSM missed |

Manual wins on collision. Ride-learned numbers fill `typical` and `p` when
the cluster is thick enough. Edit the OSM-born point the same way: change
`p`, typical, or retire it. The overlay is Git-visible YAML on the graph,
like any other tenant.

## Learn from rides — TomTom's trick, for waits

OSM says *where a control is*. Rides say *how long people actually sit*,
and *how wide the sit is*. That is what TomTom does for traffic and
routing: bake observed speeds into the map, sliced by **time of day** and
**weekday**, so Tuesday 8:30 and Sunday 11:00 are different edges. Same
method. We bake **wait envelopes**, not speed.

Do not harvest their rejected speed leaderboard
([`sources/tomtom-rejected-ideas.md`](sources/tomtom-rejected-ideas.md)).
Harvest the adaptive map.

Enough FIT files:

1. Find dwells (speed → 0, or below a crawl).
2. Cluster in space. A wait is not always one OSM node — **anchor + radius**.
   The ferry plaza, the light with a bike box, the spot you roll up and stand.
3. Per cluster, per `(weekday, hour)`: median dwell, spread, short-pass rate.
   That *is* `typical`, the band, and `p`.
4. Recompute as new rides land. The map adapts.

A single number `typical: 18s` is the cold start. The live object is a
small table: Wednesday rush is fat; 3am is thin; Saturday noon at the
IJ ferry is a gather.

```yaml
source: rides                 # rides | osm | manual  (or stacked)
anchor: [4.897, 52.377]
radius: 25                    # meters — the envelope
typical:
  default: 18s
  wed/08: 42s
  sun/11: 12s
p:
  default: 0.35
  wed/08: 0.55
```

## Frequent stops are a sniff

Stopping somewhere **often** — the way a real ride already does — is a
strong signal. Do not wait for OSM to name it. Cluster *your* dwells.
Where the same body keeps parking, **sniff** for an anchor + radius:
café terrace, lockers, a quiet rail, a view. Then see if other rides
agree, or if OSM has a thing there.

A personal frequent stop is a probe, not an instant public wait point.
Home and work already get clipped ([`privacy.md`](privacy.md)). Those
clusters stay local. A cluster that many riders share, or that sits on
a control / dock / plaza, graduates to the overlay.

## Fields

```yaml
id: wait/amsterdam/leidseplein-west
at: node/123456789          # or a dropped lon/lat
source: osm                 # osm | rides | manual
control: traffic_signals
anchor: [4.879, 52.364]     # or node/…
radius: 18                  # meters — learned envelope, or a default
typical: 18s                # cold start; prefer the tod/weekday table
p: 0.35                     # P(fine | short pass) — also sliced in time
fine: 1                     # transgression base if the coin lands
```

Default `p` by control type until someone edits: stop sign high (you were
supposed to stop), light medium (greens happen), give-way lower. Drawbridge
`p` is how often it is actually up at that hour — usually down, so a short
pass is the common luck; the coin still fires. Time of day can scale `p`.
Do not wait for a signal API. Do not ask the bridge.

## Drawbridges are the lottery

A movable bridge is a wait point with a fat typical (minutes, not seconds)
and a low duty cycle. Most rides roll through. Some sit while the deck is
in the sky. Same rule as the light: short pass draws `p`. Long wait mints
patience. The engine does not know if the Magere Brug was open. The coin
does not care.

Every drawbridge becomes a lottery.

## Gathering is the pastime

A ferry slip, a bus stop, a tram island — the wait *is* the activity.
You are not posing at a green. You are collecting a boat. Other people
doing the same thing is the point.

Live at the same transit wait point is multiball on a dock
([`VISION.md`](VISION.md)). Cards, grooves, talk. The heat map pools here
on purpose. Catching it with no sit is luck, not a ran light — default
`p` is **0**. Miss it and sit: patience, and company.

A gather is not a fake. Hanging at an empty stop after the last bus to
farm the band still can be. Peers who are actually going somewhere can
tell the difference.

## Pass — no identity

Snap the ride to the wait point. Measure dwell.

| Dwell | What happens |
|-------|----------------|
| In the typical band | Patience mint. No coin. |
| Below the band | Short pass. Draw Bernoulli(`p`). Heads: transgression `fine`. Tails: nothing. |
| Above the cap | No farm. No coin. |

A short pass is *lucky or transgressive*. The engine does not care which.
Green light and ran-it look the same. The coin is the whole verdict.

That is the point: **do not analyze every crossing as an identified event.**
Weigh the wait point, dither the fine onto whoever didn't wait long enough.
Luck is the chance you were not chosen.

Same family as the home-hole dither ([`privacy.md`](privacy.md)) — entropy
instead of a clean fact.

## Fake waits

You sat when the city was not asking — staged the typical, farmed the
band, waited at a down bridge, posed at a green. That is transgressive.
It is also patient. Both meters tick. They feed.

Do not prove the light was green. A fake is a *shape*: in-band dwell at a
wait point whose short-pass rate at this hour is high (bridge usually
down, light usually with you), or you held still while the edge kept
flowing. Optional coin at `1 - p` — how likely this point was *not*
asking. Heads: transgression on top of the patience you already earned.

Farming the cap still mints nothing extra. A fake is one performed wait,
not an all-afternoon sit.

### Other players can report you

Live only ([`privacy.md`](privacy.md)). Someone else is at the same wait
point — they rolled through, you are posing — and they flag it. The report
is a fact: `FAKE_WAIT(reported)`, who, where, `t`. It weights the fake coin
or lands the transgression outright. You still keep the patience. You sat.

A flag is **good fun**. A tap, a wink, a coin. Not a hunt. Not a dossier.
No following people home. Live is already opt-in because that is how you
meet a stalker — flags do not get to punch a hole in that.

The flag is **not a camera**. Want a picture? Post it in the app you
already use and **link** it. We pull the embed when we can
([`privacy.md`](privacy.md)).

Buffered rides cannot be reported in the moment. No live playhead, no
witness. Yesterday's tape is just a tape.

A false flag is also a fact. Stories can read both. Same fun, not a
court.

## Outputs

`wait-points/*.yml` — the overlay

Per ride, on each snap:

`{ wait_point, dwell, typical, short, p, drawn, reported_by, patience_delta, transgression_delta }`

`drawn` is `null` when there was no coin (waited enough, or over cap).

↑ [README.md](README.md) · [patience.md](patience.md) · [transgression.md](transgression.md)

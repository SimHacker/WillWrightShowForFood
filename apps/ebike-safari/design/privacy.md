# Privacy — local-first, publish delay, home mask

Live tracking is cool. It is also how you meet a stalker. So it is a *choice*,
not the default.

## Local-first is a policy about your data, not about tiles

Caching the map offline is a convenience. Most phones have fast, effectively unlimited data, which
softens the must-work-without-signal problem to a nice-to-have
([`map-distribution.md`](map-distribution.md) is an optimisation, not a foundation).

**The policy that is not negotiable is that your ride belongs on your device.** Exact GPS, the
unclipped FIT, the photographs, the speech, the bump traces, the home and work coordinates: all of it
is usable in full, locally, by an app that has never uploaded anything and works completely that way
forever. Every upload is a separate, explicit, revocable decision about a specific class of artifact.

Nothing about the product requires a server. A server is where you choose to put something.

## Two modes

| Mode | What peers see | When |
|------|----------------|------|
| **Live** | Playhead on the graph, now | You opted in — ride-along, guest bike, a show. Peers can flag a fake wait — good fun, not a hunt. |
| **Buffered** | Yesterday's ride, masked | Default. Sleep on it. |

Buffered: hold the FIT locally for **one day**, then publish a clipped trace.
You still have the full file. They get the safari, not the driveway.

## Private regions — you declare them, the app works out the shape

You name places, not radii. "I live in Badhoevedorp." "Work is here." "This pin, never." The app
resolves each declaration against OSM and clips.

| You say | What it resolves to |
|---|---|
| A town or neighbourhood name | The OSM administrative or place boundary, buffered outward by a margin |
| An address or a dropped pin | A polygon around it, sized to the local street density rather than to a fixed radius |
| "This whole area" drawn by hand | Exactly that, buffered |
| A named route ("the school run") | Every traversal of it, whenever it happens |

Declaring the town is the point of the feature, not a failure of it: *"I live in Badhoevedorp and
nothing more"* is a sentence you are allowed to say, and the app's job is to make sure nothing finer
than that ever leaves. The hole will be recognisably the shape of a town. Fine. A town is thirteen
thousand people.

Per region, the knobs:

| Knob | Default | What it does |
|---|---|---|
| `clip` | `inside` | Discard everything within the polygon. Nothing inside is measured into anything published |
| `margin` | 300 m, jittered | How far beyond the boundary the discarding continues |
| `resume_at` | `junction` | Where the published trace is allowed to begin — a public junction outside the margin, varied between rides |
| `also_clip_time` | first/last 3 min | Duration as well as distance, because a timestamp at the edge dates your departure |
| `on_enter` | `clip_rest` | Entering mid-ride clips from there. Alternative: `clip_visit`, drop only the dwell |
| `hide_existence` | off | Do not even publish that a ride happened that day |

Two things deliberately **not** offered:

- **No decoy routing.** Publishing a plausible ride you did not take poisons the aggregate everyone
  else depends on, and there is no way to mark it as fiction without marking it as fiction.
- **No regenerated boundaries.** A region is resolved once and kept. Re-randomising per ride hands an
  attacker more independent samples of the same protected location — the CCS 2022 paper found exactly
  that (below).

## Why the clip happens at the source, and not to the finished ride

Strava has been solving this since before it used git, and has been publicly broken twice. The record
is in [`sources/strava-privacy-zones.md`](sources/strava-privacy-zones.md); the part that changes our
architecture is short.

Their mechanism hides part of the map *after* the fact. In 2018, USENIX Security showed a circle can
be fitted from the endpoints that survive: **84% of protected locations recovered, 95.1% for active
users.** Strava responded by moving the zone's centre to a random nearby point. In 2022, CCS showed
that fix does not matter, because the published activity still reports **how far you travelled inside
the hidden part** — and with the street grid to constrain which paths cover exactly that distance,
regression finds the house anyway: **up to 85% of zones, across 1.4 million activities.**

Of the six countermeasures they evaluated, five fail or backfire. Random noise on the distance
averages out. Shifted endpoints average out. Bigger radii swallow short rides. Fancier zone shapes
only hide the zone, not the distance. The one that works is truncation: **do not count the hidden part
in any published number.**

Strava cannot do that, because for them the personal total *is* the product — a ride whose distance is
a lie is not worth logging. We are not selling personal totals. So:

- **The clip happens before a ride record exists.** Distance, duration, ascent and per-edge
  contributions are computed from the clipped trace. There is no inner distance to leak, because it
  was never measured into anything that leaves the device.
- **Dithering the cut is cosmetic and stays anyway.** Ragged edge, varied resume junction — it defeats
  a naive visual read and costs nothing, but it is not the defence. The defence is the arithmetic.
- **Default publishing is aggregate-only, which removes the attack's input.** Every one of these
  attacks needs *the set of activities belonging to one rider* in order to intersect them. Per-edge
  counts over a multi-rider threshold do not offer that set.
- **The village is the hard case.** Sparse street grids make the regression *better*, and rides that
  approach from several different directions help the attacker more than many rides down one road. The
  threshold rule and the sparse-grid problem happen to pull the same way: out in Badhoevedorp, almost
  nothing clears the threshold, so almost nothing is published.

The published polyline should look like a ride that *began on a street* — not one amputated at a
bedroom, and not one carrying a receipt for the amputated part.

## The TomTom model — clip the ends, aggregate the middle

TomTom's traffic and routing product ran on rider-contributed traces, and it survived because the
anonymisation was structural rather than promised: **no identity recorded, and the beginning and end
of every trip dropped**, so the source and destination that would identify a driver were never in the
upload. What TomTom kept was the middle, aggregated into a per-road speed model by hour and by
weekday/weekend — "not 7 individual days, but 2 kinds of days" — which came back to the contributor as
a better route ([HN](https://news.ycombinator.com/item?id=7602137),
[HN](https://news.ycombinator.com/item?id=46270813),
[`sources/tomtom-hn-record.md`](sources/tomtom-hn-record.md)).

That is the shape for everything this app publishes. The interesting content of a ride is what
happened *along* it, and that survives anonymisation almost intact.

| Layer | Raw (stays local) | Aggregate (publishable) |
|---|---|---|
| Track | Exact polyline, exact times | Per-edge traversal counts, binned by hour × weekday/weekend |
| Bumps | Full impulse series with timestamps | Per-edge roughness statistic ([`bumps-as-input.md`](bumps-as-input.md)) |
| Waits | Every dwell, exactly where | Per-node wait envelope by time of day ([`wait-points.md`](wait-points.md)) |
| Smell / exposure | Your own coverage and history | Popularity counts, no identities ([`peerboard-and-brews.md`](peerboard-and-brews.md)) |
| Speech | Everything said, verbatim | Nothing, unless you publish an utterance deliberately |
| Photographs | All frames, with EXIF | Only frames you publish, blurred and stripped |

Three rules make the right column safe:

- **Coarse bins beat precise ones.** Hour × two kinds of day was enough to ship a global routing
  product. Finer bins buy accuracy nobody needs and re-identify a rider who takes one street at 06:12
  on Sundays.
- **A threshold before anything appears.** An edge statistic publishes only once several *independent*
  riders and multiple passes have contributed. Below that it stays local, because a statistic derived
  from one person is that person's diary.
- **Clip the ends, then dither the cut** — as below, and for the same reason.

## Withdrawal, honestly

You can delete anything local, and refuse any upload. Aggregates are harder: a contribution mixed into
a per-edge count cannot be unmixed by wishing. So contributions are recorded locally with what they
went into, withdrawal recomputes the aggregate without them, and the published bins are coarse enough
that removing one rider changes little — which is the same property that makes them safe to publish in
the first place.

## Flags are not stalking

A live fake-wait flag ([`wait-points.md`](wait-points.md)) is a game tap.
No following, no dossier, no camera.

## The camera is ours; the photo network is not

This app captures imagery — it is [half the app](camera.md) — and every frame it captures stays local
by default, blurred locally before it can leave, EXIF stripped or clipped on export, and treated
exactly like the track it was taken along.

What we are not is the place your pictures *live in public*. We do not run a comment graph, a
moderation queue, a takedown process, or a second copy of your selfie as the source of truth. When a
frame is meant for an audience, it goes wherever you already publish, and we **point** and **embed**.

Do your pictures and social-network selfies where they already live.
We are not Instagram. We **point**. We **embed**. A card, a gather, a
flag can hold a URL. Open Graph, oEmbed, the usual pull. If the pull
dies, the link remains.

Instagram (and whoever they posted to) already does reporting, privacy
controls, and AI review. Let them. We do not run a camera, a comment
graph, a takedown queue, or a second copy of the selfie as source of
truth. Their app, their fight.

## What stays local

Home coordinates, the unclipped FIT, live location.
Never in the peer GeoJSON, the transgression replay tape, or the smell
layer — unless you flipped **Live** for this ride, and even then: playhead
and taps. Pictures stay at the URL you pointed at.

↑ [README.md](README.md) · [peerboard-and-brews.md](peerboard-and-brews.md)

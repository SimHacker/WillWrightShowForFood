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

## Clip near home — then dither

A clean hole around the house *is* the house. Do not publish a perfect circle.

- Drop everything inside a home radius (and the start/end stubs that point at it).
- **Dither** the cut: jitter the radius, ragged edge, snap the published start
  to a public junction a few blocks out — not the same corner every time.
- Optional: also mask work, or any saved "do not publish" pin.

The published polyline should look like a ride that *began on a street*, not
one that was amputated at a bedroom.

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

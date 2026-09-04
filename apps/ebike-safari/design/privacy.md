# Publish delay and home mask

Live tracking is cool. It is also how you meet a stalker. So it is a *choice*,
not the default.

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

## Flags are not stalking

A live fake-wait flag ([`wait-points.md`](wait-points.md)) is a game tap.
No following, no dossier, no camera.

## Photos live in their own apps

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

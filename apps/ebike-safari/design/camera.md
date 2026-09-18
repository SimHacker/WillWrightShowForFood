# The camera is half the app

This is a digital photography app. Using the phone as a camera to show the environment around you is
not a side feature bolted onto a bike computer — it is how the world gets into the record at all.
GPS says where you were. The camera says what was there.

The pipeline already exists on the replay side: video is synced to rides by wall clock, sampled into
a bearing-tagged track, and spoken words are clustered onto the route
([`../DATA-CONTRACT.md`](../DATA-CONTRACT.md), [`../scripts/sync_video.py`](../scripts/sync_video.py),
[`../scripts/map_transcript.py`](../scripts/map_transcript.py)). What is missing is capture as a
first-class act during the ride.

## Capture without hands

You are riding. Every capture affordance has to survive that:

| Trigger | Behaviour |
|---|---|
| **Distance sampling** | A frame every N metres, not every N seconds. Time sampling gives you two hundred photographs of one red light; distance sampling gives even coverage of a city |
| **Retroactive mark** | Record continuously into a short buffer; a single gesture keeps the last few seconds. You notice things *after* you pass them |
| **Voice** | A word marks the frame and the location together — the utterance and the picture are the same event ([`speech-track.md`](speech-track.md)) |
| **Bump-triggered** | A measured impulse takes a downward frame. The IMU says *rough*; the photograph says *sett, wet, 8 cm stones* ([`bumps-as-input.md`](bumps-as-input.md)) |
| **Wait points** | Stopped at a light or a bridge is the one moment with full attention and zero risk — the natural place to aim deliberately ([`wait-points.md`](wait-points.md)) |
| **One touch** | A single large target that never needs aiming, because a mounted phone is already aimed |

## Four directions, four subjects

- **Forward** — the street as you meet it. Route memory, junction recognition, street-level imagery.
- **Sideways** — the facades. In Amsterdam the sideways frame is the actual subject: shopfronts, doors,
  bikes, gables, canal houses. Almost nothing in mapping captures this well because cars point forward.
- **Up** — light, weather, cranes, trees, the sky between buildings.
- **Down** — the surface, paired with the bump that provoked it, which is how a roughness measurement
  acquires ground truth.

## What photographs are for

**Pleasure first.** The album is the thing you show someone. A ride that produced fifty good frames of
your own neighbourhood is worth more to the rider than any dataset, and the album is already a
universal artifact type in this family of projects — the family album is a
[Soul City](https://github.com/SimHacker/moollm/tree/main/skills/soul-city) souvenir, portable
between games and now between rides.

**Evidence for claims.** A photograph with a time, a place and a bearing is what turns "this street is
cobbled" or "there is no bike parking here" from an opinion into a claim with provenance. Nothing is
auto-submitted anywhere; findings leave as a reviewed worklist.

**Proposals from machine reading.** A vision model can read a shopfront, spot bike racks, notice a
traffic-calming feature nobody tagged — as **proposals only**, each one attached to the frame that
produced it so a human can check it in one glance. Let the rider caption first; the model can go
second, and everything it writes stays editable.

**Street-level imagery, contributed on purpose.** [Panoramax](https://panoramax.fr/) is the open
alternative for street-level imagery, and its consent and blurring governance should be read before
any Dutch street gets filmed — already flagged in
[`sources/sotm-2026-paris.md`](sources/sotm-2026-paris.md).

**The record's cover art.** [`city-record.md`](city-record.md) makes streets grooves; the photographs
are the sleeve, the postcard, and the illustration on the story the ride generated.

## Privacy: the camera is the sharpest thing here

The rules from [`privacy.md`](privacy.md) apply hardest to imagery, and the ones specific to it:

- **Blur faces and plates locally, before anything leaves the device.** Not server-side, not later.
- **Nothing uploads by default.** Publishing is a deliberate act, per artifact or per ride.
- **Strip or clip EXIF on export.** A photograph is a location log with a picture attached, and the
  home end of the ride gets the same clipping and dithering as the track.
- Continuous recording near home stays in the buffer and is discarded, like the rest of the ride.

## Parity with the desk

A virtual ride takes screenshots the same way a real ride takes photographs, into the same album with
the same fields ([`virtual-ride.md`](virtual-ride.md)). A tour planned from a desk can be handed to a
rider who brings back real frames of the same corners — which is the exchange that makes the two modes
one product rather than two.

## Hardware, in order of ambition

Phone in a mount is the default. An action camera with its own GPS is already in the ingest plan
(GoPro GPMF, [`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)). A 360 rig is what Panoramax contribution
wants. None of them change the data model, which is: frames, on a clock, on a route, with a bearing.

↑ [`bike-computer.md`](bike-computer.md) · [`speech-track.md`](speech-track.md) · [`bumps-as-input.md`](bumps-as-input.md) · [`privacy.md`](privacy.md) · [`city-record.md`](city-record.md)

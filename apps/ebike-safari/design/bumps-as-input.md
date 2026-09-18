# Bumps are input, not interruptions

A bump is a measurement of the world. Hitting one is as much an input event as stopping the bike or
clicking a mouse, and it carries information nothing else in the system can supply: what the road
is actually like, right there, right now, under a real load.

So a bump gets written down with its measured impulse and moved on from. It never asks for
attention, never covers the map, and never requires a rider in traffic to read text and touch glass.

Don made this argument about navigation interfaces in 2015, ten years before the dialog box in
question, reading Bret Victor's *Magic Ink* and its claim that interactivity is a failure state of
software that could not work out what the user wanted from context
([HN](https://news.ycombinator.com/item?id=10645012)):

> Working at TomTom on GPS navigation really drove that one home, where an "interactive" user
> interface could cost people their lives. Imagine a popup that said "Did you really mean to miss
> that exit? [yes] [no]", instead of just recomputing the route without asking.

## The failure this is a correction of

Ride over a pothole with Google Maps open on an iPhone and a modal alert can appear over the map
asking whether you want to undo. The cause is **iOS Shake to Undo**: `applicationSupportsShakeToEdit`
defaults to true, a jolt registers as a shake, and once there is anything on the undo stack — you
typed a destination — the system puts up its dialog. Google Maps did not invent the gesture; it
failed to switch it off, which for an app used in moving vehicles is a one-line omission
([`applicationSupportsShakeToEdit`](https://developer.apple.com/documentation/uikit/uiapplication/applicationsupportsshaketoedit)).
Riders can only escape it globally, under Settings → Accessibility → Touch.

Two things are wrong, and the smaller one is the bug:

1. **The referent is wrong.** A physical event in the world was interpreted as an assertion about
   the software's own internal state. The road became a claim about typing.
2. **The response is wrong.** The interpretation was expressed as a modal demand for eye contact
   and a touch, from a person whose hands are on the bars.

The platform assigned a single global meaning to a physical signal, and every app inherited an
interpretation it never chose. Meaning belongs to the context that can know it — which is the whole
[interfaces to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)
argument, arriving as a dialog box on a bridge.

**Our rule:** disable shake-to-undo, consume the motion stream ourselves, and interpret it as
terrain.

## What a bump is, measured

Source is the phone's IMU through `DeviceMotionEvent` — around 60 Hz in mobile browsers, gated
behind a permission gesture on iOS. Each detected event records:

| Field | Why |
|---|---|
| `peak_g` | Sharpness. Distinguishes a lip from a landing |
| `impulse` | ∫\|a\|dt over the event window — the energy the rider's wrists and the cargo actually absorbed |
| `duration_ms` | A joint is milliseconds; a hump is a fraction of a second |
| `band_energy` | Energy in a few frequency bands. Texture, not events |
| `speed_kmh`, `heading` | Severity scales with speed. Store both, normalise at read time |
| `mount_profile` | Which device, which mount, so calibration is attachable later |
| `confidence` | Everything downstream must be able to discount a guess |

**Honest limit:** this measures *the phone's experience of the bike*, not the pavement. A handlebar
mount reads fork and mount resonance; a pannier reads the rack; a jersey pocket reads the rider.
Cross-rider aggregation is what converts it into a road measurement, because bikes and mounts vary
randomly while the road does not. A single rider's bump log is a comfort diary; forty riders' logs
are a survey.

Calibration comes from known features rather than a lab: a speed hump and a stretch of cobbles with
known OSM tags give each device-and-mount pair a scale factor. Uncalibrated mounts still log,
at lower confidence.

## Signatures

| Class | Signature | Cross-check |
|---|---|---|
| `POTHOLE` | Single sharp asymmetric impulse, high peak, short duration, repeating at one coordinate across riders and days | New clusters are reportable; old ones are map features |
| `COBBLES` / klinkers | Sustained broadband energy over a distance band, scaling with speed, starting and ending at segment boundaries | OSM `surface=sett` / `cobblestone` / `paving_stones` |
| `TRAM_RAILS` | Two or four closely spaced impulses at a crossing angle | OSM `railway=tram` intersections — also a wheel-trapping hazard |
| `SPEED_HUMP` (drempel) | Symmetric double impulse with a speed dip | OSM `traffic_calming=*`; undocumented ones are proposals |
| `BRIDGE_JOINT` | Paired impulses at the ends of one edge | OSM `bridge=yes` |
| `CURB_DROP` | Single impulse with a heading change across a kerb | Kerb hopping is also [transgression](transgression.md) |
| `GRAVEL` / `SAND` | Broadband energy with speed loss | OSM `surface=gravel`, `sand` |
| `FALL?` | Very high peak, orientation change, speed to zero, no resumption | **The one class allowed to interrupt** |

That last row is the exception that proves the rule. An interruption is permitted when the *world*
demands it, never when the software wants confirmation about itself.

## What aggregation buys

This is why bumps are worth measuring rather than merely surviving.

**Map contributions.** Measured roughness proposes OSM `surface=*` and `smoothness=*` values, and
finds `traffic_calming` that nobody tagged. Proposals only — a worklist a human reviews and enters,
never an automated edit. Store snapped geometry alongside way ids, because
[OSM ids are not stable](sources/sotm-2026-paris.md).

**Comfort-weighted routing.** "Avoid the cobbles" is the feature Amsterdam actually wants, and it
is unavailable from every routing engine on the market because none of them have the measurements.
It matters most to the people who need it most: cargo bikes with children aboard, anyone with a
wrist or back injury, and anyone on narrow tyres. A comfort cost on an edge is a small change to a
routing profile and a large change to a ride.

But note what TomTom's aggregate did to the people who lived on the shortcuts it discovered — Don's
account is that convoys of trucks arrived on quiet wooden-house roads that turned out to be efficient
([HN](https://news.ycombinator.com/item?id=7602137)). **Publishing the smooth route moves traffic
onto it**, and the residents did not opt in. A comfort layer that finds one calm street and sends
everyone down it has destroyed the thing it measured. Spread load deliberately, prefer several good
routes to one best route, and treat a street's own quiet as a value in the routing cost rather than a
resource to spend.

**Civic reporting.** A cluster that appears suddenly, repeats, and is corroborated by unrelated
riders is a pothole with a start date and a witness count. That is a different object from one
person's complaint, and cities treat it differently.

**A roughness index.** The established measure is IRI, and phone-based estimation of it is a real
literature. Ours is a *proxy* — comparable across our own riders, not calibrated to a road
authority's instrument. Say so wherever a number is displayed.

**The record's surface noise.** [`city-record.md`](city-record.md) makes streets grooves and the bike
a needle; a bump is a click in the vinyl, and a cobbled street is surface hiss with a pitch. The
bump track is the percussion of a ride, available to the music and to the story layer, and a repaved
street literally changes the city's sound.

**A personal budget.** Total impulse absorbed per ride, per wrist, per week. Route learning
(canalization, in [`navigation-smell-steer.md`](navigation-smell-steer.md)) can be biased by comfort
without ever being asked to.

## Rules

- A bump event is an **observation**, so under the legibility taxonomy in
  [`navigation-smell-steer.md`](navigation-smell-steer.md) it is free: it commits nothing, so it needs
  no legibility window and no attention.
- **Never modal. Never text to read.** If a bump surfaces live it is a sound or a mark on the map, at
  the bias level, ignorable by design.
- The engine emits facts, not stories — same rule as the rest of
  [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md). Keep the raw window so a better
  classifier can re-read it later.
- Only `FALL?` may interrupt.
- **Privacy:** IMU traces can fingerprint a device, and a bump log is a location log with extra
  channels. Aggregate to segments before sharing, drop sub-threshold events, and inherit the 24-hour
  buffer and home dithering from [`privacy.md`](privacy.md).

## The same sensor keeps position

The motion stream has a second job. TomTom shipped Enhanced Positioning Technology in 2007-era
devices — accelerometers and gyros dead-reckoning through tunnels, underpasses and street canyons
where GPS fails ([HN](https://news.ycombinator.com/item?id=13748977)), and Don knew the engineer who
built it. His summary of why it works is the useful part
([HN](https://news.ycombinator.com/item?id=46270813)):

> Well it registers gravity, so you can detect i.e. driving off a cliff. ;) What helps is that
> tunnels don't usually branch, so once you're in it, your path is usually quite predictable.

Amsterdam supplies both cases constantly: canal-house canyons, underpasses, the long tunnels under
the Rijksmuseum and the IJ. The road graph is the constraint that makes short-range dead reckoning
work, because a tunnel has no forks. So the IMU earns its power budget twice — terrain going in,
position coming out.

## Data

New artifact alongside the existing trip files ([`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)):

```
trips/{id}.bumps.json     # events with the fields above, plus edge snap and osm_context
```

And `BUMP` joins the gesture vocabulary in [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md),
where it is unusual in being the only family measured in newtons rather than geometry.

↑ [`bike-computer.md`](bike-computer.md) · [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md) · [`city-record.md`](city-record.md) · [`skeleton/exposure-log.md`](skeleton/exposure-log.md)

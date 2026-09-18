# Bumps are input, not interruptions

A bump is a measurement of the world. Hitting one is as much an input event as stopping the bike or
clicking a mouse, and it carries information nothing else in the system can supply: what the road
is actually like, right there, right now, under a real load.

So a bump gets written down with its measured impulse and moved on from. It never asks for
attention, never covers the map, and never requires a rider in traffic to read text and touch glass.

The vertical axis is only where this starts. The same sensors measure braking, acceleration, swerving,
wobble and the rider's own footfall, and those channels together describe the traffic and the crowd
rather than the pavement — including, from the swerves alone, the hazards nobody hit.

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
| `label` | What it was, if anybody said — spoken word, classifier guess, or nothing |
| `deliberate` | Whether the rider aimed at it. Changes what the event may be counted for |
| `conditions` | Wet or dry, hours since rain, temperature, freeze flag. Without it a puddle and a pothole are one cluster |

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
| `PUDDLE` | Damped long impulse, or a swerve cluster with no impulse at all, present only when wet | Low point — drainage, and next winter's pothole |
| `FALL?` | Very high peak, orientation change, speed to zero, no resumption | **The one class allowed to interrupt** |

That last row is the exception that proves the rule. An interruption is permitted when the *world*
demands it, never when the software wants confirmation about itself.

## Calling your shot

Read the pothole row again and notice what it does not contain: a name. The corpus is full of
measurements that nothing has ever identified. So you can measure and report a pothole by riding into
it on purpose and saying "pothole" — the impulse supplies the severity, the word supplies the class,
and your hands never leave the bars.

One spoken word, four artifacts:

| From | What it produces |
|---|---|
| The motion buffer | The bump that just happened, retroactively marked — you speak *after* the hit, because the window is already recorded |
| The word | A class, in your language, from a witness who was there |
| The camera ring buffer | The frames from a second ago, before you rode past it ([`camera.md`](camera.md)) |
| The position | A coordinate, a heading, and a speed the hole was hit at |

Voice is the right channel for the same reason a bump must never be a dialog: it costs no eye contact
and no glass. Speaking is the one input a rider in traffic can afford.

**Why the label is worth more than the measurement.** A classifier needs labelled examples, and for
bicycles on European city streets nobody has any. Forty annoyed riders naming forty holes is a
training set that no survey crew budget would buy. The word is also the veto: where the classifier
guessed, the rider's word overrides it, and where the classifier guessed nothing, the word fills it
in. Either side may act at any step, and neither has to wait for the other.

**Deliberate hits are labelled data and nothing else.** A hole that ten riders aim at to confirm it
looks, in the raw histogram, like a hole that ten riders failed to avoid. So `deliberate: true` is
excluded from prevalence and severity statistics, and included in the training set and the report.
The mirror-image bias is worth naming too: riders swerve around holes they know, so **a missing bump
is not a missing hole**, and a well-known hazard goes quiet in the corpus precisely because it is
well known. The `deliberate` flag is what keeps enthusiasm out of the epidemiology.

**Deliberate hits also calibrate.** The same feature taken twice at different speeds fits the
response curve for one device-and-mount pair — the calibration described above, done on purpose
rather than by luck. The app never asks anyone to hit anything: a rim costs more than a data point.

**Vocabulary.** Small, spoken, either language, and open-ended: *pothole, kuil, cobbles, klinkers,
tram rails, glass, roadworks, dog, nice.* Unrecognised words attach as free text on the event rather
than being discarded, so nothing you said is ever lost. **`nice` matters as much as `pothole`** — a
corpus that only records complaints will describe a city nobody wants to ride in, and the smooth
stretch of new asphalt along the Amstel is a finding too.

## Three axes, not one

The IMU does not only measure up and down, and the vertical channel is the least interesting one
socially. The same stream, split by axis, measures the road, the traffic and the crowd separately.

| Axis | Reads | Finds what no map has |
|---|---|---|
| **Vertical** | Terrain — the whole table above | Surface, holes, joints, rails crossed |
| **Longitudinal** | Braking and acceleration | Conflict points, and the real cost of a route |
| **Lateral + roll** | Cornering, swerving, wobble | Obstacles, crowding, and the rails you are fighting |
| **Gait** | Footfall while the bike still moves | The rider gave up and walked |

**Braking is the near-miss channel.** Crashes leave police reports; near-misses leave nothing but a
deceleration. Hard braking repeating at one coordinate is a conflict point, and it locates the thing
OSM structurally cannot hold: the terrace that blocks the sightline, the door zone, the driveway
behind a hedge, the tram door that opens into the bike lane. It is the same surrogate-safety measure
fleets and insurers already run on cars, pointed at the road user who actually gets hurt.

**Acceleration is the honest cost of a route.** A cyclist's fatigue tracks launches, not distance —
every stop is paid for twice, once in waiting and once in getting back up to speed — and an e-bike's
assist makes each launch a clean, recognisable signature. So **launch count** belongs in a routing
profile next to length, and a short route with eleven stops can be correctly described as more
expensive than a long one with two. No routing engine offers this, because none of them are counting.

**Lateral is where the avoidance bias gets fixed.** A swerve is a lateral excursion that returns with
no net heading change: you went around something. Repeated at one coordinate, it means an obstacle
nobody tagged — a delivery van, scaffolding, terrace creep, a pile of parked bikes. And it closes the
hole in the section above: **the pothole you dodge is not a missing bump, it is a swerve.** Riders who
hit it and riders who avoid it now report through different channels, so the hazard survives being
well known.

Two more lateral readings matter in Amsterdam specifically. Low-speed **wobble** — the inability to
hold a line — is the signature of a street too crowded to ride rather than one that is rough. And
riding *along* a tram groove instead of across it is a continuous fight of small corrections, which is
measurable as a sustained lateral cost on exactly the streets where the rails share the lane.

**Gait is the strongest thing a rider can say.** Footfall around 2 Hz, four to six km/h, the bike
still rolling: the rider dismounted and walked. Nothing else in the corpus is that unambiguous. The
fraction of passages that include a dismount is a street-quality measure no city collects — and it is
double-edged on purpose, because dismounting is frequently what the signs asked for, so the same event
is both a complaint about the street and evidence of compliance with it.

### Leidsestraat, all channels at once

Ride down Leidsestraat on a summer afternoon and every channel lights up simultaneously. Paving stones
under the tyres as continuous broadband hiss. Tram rails in the surface, so a steady lateral fight to
stay out of the groove. Ambling tourists who stop without looking, so hard braking again and again
with no conflict that any report would ever record. No room to overtake, so wobble at walking pace.
Bridge joints as the street crosses each canal. Trams and other bikes claiming the same three metres.
Police who would rather you were not there at all. And then the dismount, and the walk, with the bike
rolling beside you.

None of those readings alone says anything much. Together they say the thing that matters, which is
that **this street costs more to cross than its length** — and they say it in numbers, from riders,
without a survey, about a street that looks perfectly fine in the routing graph.

### Holes from hits and dodges

Put the two channels on the same coordinate and the hazard stops being a point. Riders who hit it
report depth through the vertical axis; riders who avoid it report **extent** through the lateral
axis, because a swerve says which side they went and how far out they had to go. Stack enough
passages and the space nobody rides through is the obstacle's footprint, while the space everyone
threads is the gap that is left. You get the shape of the thing from the shape of its absence — the
hazard is the hole in the traffic.

The ratio of hits to dodges, plus persistence, is also the classifier:

| Hits | Dodges | Persists | Reading |
|---|---|---|---|
| yes | yes | months | A hole or broken surface. Depth from the hits, width from the dodges |
| no | yes | days | A vehicle, delivery, scaffolding, terrace. Transient obstruction |
| no | yes | months | Fixed furniture — bollard, pole, tree, narrowing. Belongs in OSM; propose it |
| **yes** | **no** | months | **Nobody sees it coming** |

That last row is the one to act on. A hazard everybody avoids has been priced in by every rider on
the street; a hazard everybody hits is invisible — bad light, deep shade, a flat-reading sunken drain,
or water sitting on top of it. So **danger is severity times invisibility**, and invisibility is
measurable as the missing dodges. A city with a repair budget should be given the invisible holes
first, and no existing method can tell it which those are, because complaint volume rewards the
obvious ones.

### Puddles are drainage, and next year's potholes

Some swerve clusters only exist when it has rained. Those are puddles, and they are worth more than
the potholes.

A puddle marks a low point where water is not draining — a blocked or missing gully, a settled patch,
a badly graded repair. That is cheap to fix and almost never reported, because a puddle is nobody's
emergency. It is also **how a crack becomes a hole**: water sits, works into the surface, freezes,
and lifts the pavement apart. So a map of where water stands in autumn is a forecast of where the
holes will be in spring, which turns a maintenance department's job from responding to predicting.

The same low points ice first, so the puddle layer is also the black-ice layer, and in a Dutch winter
that is the higher-stakes reading of the two.

A water-filled hole changes what the vertical channel can be trusted for. Hitting standing water is
softer and longer than hitting an edge — the water damps the impact and hides the lip — so wet passages
measure extent well and depth badly. Which gives a clean division of labour: **measure the hole dry,
measure the puddle wet**, same coordinate, two conditions. And the invisibility rule above becomes
literal, since a puddle is a hole with a lid on it.

The camera can corroborate cheaply, because standing water on asphalt is a specular reflection of the
sky and reads as an unusually bright patch on the ground ([`camera.md`](camera.md)).

**Weather has to be attached to every event or none of this separates.** Each bump, swerve and brake
carries a coarse condition — wet or dry, hours since rain, air temperature, and a freeze flag — from
an open source such as KNMI for the Netherlands. Without that field, a puddle and a pothole are the
same cluster, and the whole corpus is only as good as its worst-conditioned event. It costs one small
join and it is the difference between a hazard map and a drainage map.

It is also the clearest case for the [vampire clock](transgression.md): the same edge at three in the
morning is empty, and the identical passage is a different act at a different price. One street, two
completely different measurements, and the difference is the crowd rather than the pavement.

**Enforcement is a private event.** A rider being told to get off is their own experience, so it may
be logged and it stays local by default. What it does not become is a map of where police stand — that
is a different product with consequences that are not ours to hand out. The aggregate that *is* fair
inherits the rule from [`privacy.md`](privacy.md): aggregate to the street and the month, never to the
coordinate and the hour. Which street is contested is useful public information. When and where an
officer was standing is not.

## What aggregation buys

This is why bumps are worth measuring rather than merely surviving.

**Map contributions.** Measured roughness proposes OSM `surface=*` and `smoothness=*` values, and
finds `traffic_calming` that nobody tagged. Proposals only — a worklist a human reviews and enters,
never an automated edit. That worklist is its own product surface, and its own hazard:
[`mechanical-turk-ebike.md`](mechanical-turk-ebike.md). Store snapped geometry alongside way ids, because
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

In the Netherlands there is somewhere specific to send it. **Signalen** is the open-source platform
Dutch municipalities run for reports about public space — MPL-2.0, around 800,000 reports a year,
Amsterdam's replacement for MORA ([signalen.org](https://signalen.org/) ·
[Amsterdam/signals](https://github.com/Amsterdam/signals)). Amsterdam also publishes past reports as
open geodata, with GeoJSON, WFS and vector-tile endpoints
([API docs](https://api.data.amsterdam.nl/v1/docs/datasets/meldingen.html)), which makes the loop
run both ways:

- **Outbound.** A deliberate hit produces a report that is already complete — location, date, photo,
  a measured impulse, and a witness count. The rider presses send; the app does not file on anyone's
  behalf, and a prefilled form is where the automation stops.
- **Inbound, as corroboration.** Where bump clusters land on existing reports, the classifier gets
  confirmation with no labelling work at all, and the rider gets told **this one is already
  reported** instead of filing the fourth duplicate.
- **Inbound, as accountability.** The city's report has a date. Our corpus knows when the impulse
  stopped appearing. The difference is a **repair time**, per district, measured from the saddle —
  and it arrives free from continuing to ride the same streets. No city publishes that number.

The honest limit: a rider verifies a hole exists, not who owns the road or whose budget fixes it.
Report volume is also a wealth signal, since the neighbourhoods that complain most are not the ones
with the worst pavement — so treat measured roughness as the correction to reported roughness rather
than a second copy of it.

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
trips/{id}.bumps.json     # vertical events with the fields above, plus edge snap and osm_context
trips/{id}.dynamics.json  # brake, launch, swerve, wobble, gait — side and offset where lateral
```

Aggregates are per-edge and conditional, because an unconditional average of a wet street and a dry
one describes neither:

```
hazards/{edge}.json       # hits, dodges, footprint, hit:dodge ratio, first_seen, last_seen
drainage/{edge}.json      # wet-only swerve clusters — puddles, and the freeze watch list
```

And `BUMP`, `BRAKE`, `LAUNCH`, `SWERVE` and `DISMOUNT` join the gesture vocabulary in
[`skeleton/gesture-engine.md`](skeleton/gesture-engine.md), where they are unusual in being the only
families measured in newtons rather than geometry.

↑ [`bike-computer.md`](bike-computer.md) · [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md) · [`city-record.md`](city-record.md) · [`skeleton/exposure-log.md`](skeleton/exposure-log.md)

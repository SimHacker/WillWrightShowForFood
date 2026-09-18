# Feng shui measurement — the city in the frequency domain

Feng shui means wind and water, and whatever else it is, it is a vocabulary for how movement flows
through a place. Take the metaphysics out and something measurable is left: surfaces have
**wavelengths**, paths have **periods**, and a street full of bicycles has **laminar and turbulent
regimes**. The bike is the instrument, and the rider's body is the sensor mount.

This is the frequency-domain companion to [`bumps-as-input.md`](bumps-as-input.md), which counts
events. Events are the impulses; this is the texture between them.

## Resample by distance, not by time

Everything here depends on one implementation decision. The IMU produces samples in **time**, so a
spectrum in hertz mixes the road's geometry with how fast the rider happened to be going. Integrate
speed into distance, resample the motion stream onto a uniform **distance** grid — two centimetres is
plenty — and window that instead. Now the spectrum is measured in **cycles per metre**, and its peaks
are wavelengths of the street rather than facts about the ride.

The payoff is agreement: two riders crossing the same brick paving at twelve and at twenty-five
kilometres an hour report the same wavelength, where in hertz they would differ by a factor of two and
look like different streets.

Limits worth stating. Wheel speed beats GPS speed for the integration, so use it where a sensor exists.
Below walking pace the distance grid starves and short wavelengths are lost. Tyre pressure, suspension
and the mount are a low-pass filter, which is why `mount_profile` travels with every event, and why the
calibration pass matters more here than for impulses.

## Surfaces have wavelengths, not just roughness

A roughness index throws away the most identifying part of the signal. Paving is made of units of a
known size, and the joints between them arrive at the wavelength of the unit — so the spectrum names
the material instead of merely rating it.

| Surface | Signature | Wavelength |
|---|---|---|
| Asphalt | Broadband, low amplitude, no peak | none |
| Sidewalk tiles (tegels) | One clean peak | ≈ 0.30 m |
| Brick pavers (klinkers) | Sharp peak, low amplitude, depends on the bond and the angle you cross it | ≈ 0.10–0.21 m |
| Sett / granite keien | Broader peak, higher amplitude, irregular | ≈ 0.10–0.15 m |
| Concrete slabs | Low-frequency thump at the expansion joints | ≈ 1–2 m |
| Wooden bridge deck | Peak at plank spacing, hollow resonance | ≈ 0.15–0.30 m |
| Rails, joints, a single hole | Isolated impulse, **not periodic** — belongs to the event channel | — |

Two things fall out of this that a roughness number cannot give:

**The laying pattern shows up in the coupling between axes.** Herringbone presents diagonal joints, so
it pushes the wheel sideways as well as up, and the vertical and lateral channels correlate. Stretcher
bond laid square to the direction of travel does not. So the **bond** is recoverable from the
cross-correlation, which is a level of detail no map has ever held.

**A repair patch breaks the periodicity.** Three metres where the wavelength disappears and returns is
a patch, and a patch has a date if anybody was measuring before it appeared.

This is what upgrades an OSM `surface=*` proposal from an opinion to an argument: not "this felt rough"
but "this has a 0.21 metre period, which is brick, and the tagging says asphalt."

## Paths have a period too, and the rose garden proves it

The formal geometry of the rose garden in the Vondelpark makes you steer on a schedule. The hexagonal
path layout imposes a turn every segment, so on the heat map it does not read as *rough* — it reads as
**swervy at one particular frequency**, which is the geometry of the garden showing up in the lateral
channel.

| Layout | Lateral spectrum |
|---|---|
| Formal geometric garden | One sharp peak at the segment length |
| Meandering park path | Broad low-frequency hump |
| Straight canal street | Flat — no peak at all |
| Chicanes, slalom bollards | Peak at the obstacle spacing |
| Roundabout | A single large excursion, not periodic |

Nothing in OSM describes this, and it is not a defect to be fixed — it is the shape of the place, and
the signature of whoever laid it out. A city could be searched for it: *find me the paths that feel
like the rose garden.*

## Kerb ramps, found by where the bump is not

Some stretches have no smooth transition between road and sidewalk, so every crossing lands a sharp
impulse. That means the **ramps are locatable as the gaps in a line of impulses** — the same
negative-space trick as [hazards found by dodges](bumps-as-input.md#holes-from-hits-and-dodges), but
pointed at good infrastructure instead of bad.

Impulse amplitude at a crossing scales with the height of the step, so a bicycle is a crude kerb gauge.
That maps directly onto tagging that already exists and that almost nobody surveys at scale:
`kerb=flush`, `lowered`, `raised`, with heights.

The people who need that data most are not us. A dropped kerb is a minor annoyance on a bike, a serious
obstacle on a cargo bike with children aboard, and the difference between a possible and an impossible
route in a wheelchair. Measuring it incidentally, while riding for fun, and publishing it into the
commons is the best argument in this whole design folder — and it is **presence** mapping rather than
complaint mapping, which is rarer and more useful.

## The flow field — laminar, turbulent, choked

Speed is not one number per street. Across riders and hours it is a **field**, and it behaves like one.

| Regime | What the field shows | Where |
|---|---|---|
| **Laminar** | Low speed variance, steady headways, little braking | A wide path at an off hour |
| **Turbulent** | High variance, weaving, braking cascades, low-speed wobble | Above a critical density — the crowded path at five o'clock |
| **Shear** | Two speeds side by side | Commuters beside rental bikes; a path along a terrace |
| **Stagnation and vortices** | Speed near zero with rotation | Plazas, ferry queues, roundabout arms |
| **Stop-and-go waves** | Speed dips propagating *backwards* against the flow | Approaches to lights, measurable as anticorrelation between successive riders |

Bicycle traffic has a fundamental diagram like any other traffic: flow rises with density up to a
capacity and then collapses, and the collapse is what riders experience as a street "not working". So
the field is worth storing per hour bin, alongside brake density and wobble density.

This buys routing a second axis. Today's ambition is *smooth*; the missing one is **calm**. Leidsestraat
is smooth and turbulent; a cobbled side street at midnight is rough and perfectly calm. Riders choose
between those two all the time, and no router can currently express the choice.

## What it changes

- Surface proposals arrive with a wavelength, so they can be argued with rather than trusted.
- Kerb ramps become mappable at scale, which serves wheelchair routing more than it serves us.
- The layout of paths becomes a measurable aesthetic property, searchable across a city.
- Comfort routing gains **calm** as a separate quantity from **smooth**.
- The single "heat map" becomes several fields, each with units.

## Data

```
fields/{edge}/spectrum.yml   # spatial spectrum, cycles per metre, per condition and mount class
fields/{edge}/flow.yml       # speed mean and variance, brake and wobble density, per hour bin
fields/{edge}/kerbs.yml      # crossing impulses, inferred kerb class, confidence
```

Rules: always distance-resampled, always with [conditions](bumps-as-input.md#what-a-bump-is-measured)
attached, always with the mount class recorded — a suspension fork is a filter and its readings are not
comparable to a rigid frame's without one.

## Not this

- **No single quality score.** Several fields with units beat one number without. A street that scores
  4.2 has told you nothing you can act on.
- **Not IRI.** Same honesty as in [`bumps-as-input.md`](bumps-as-input.md): this is a proxy, comparable
  within our own corpus.
- **No ranking of neighbourhoods by calm.** Publishing a calm league table moves traffic and destroys
  the quiet it measured — the same trap as comfort routing, and the same answer: spread load, and treat
  a street's quiet as a value in the cost rather than a resource to spend.

↑ [`bumps-as-input.md`](bumps-as-input.md) · [`city-record.md`](city-record.md) · [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md) · [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md)

# Paid capture — what a million euros of narrated riding buys

The thought experiment: pay delivery riders by the minute to ride the city filming, photographing and
**talking about what they see**, with human-written prompts saying what to look for and where to go.

Two findings come out of taking it seriously. Coverage turns out to be almost free, so the money is
not buying kilometres. And the value of a captured hour varies by an order of magnitude depending on
**who is narrating it** — which makes the rider's expertise the thing being purchased, not their
motion.

## The arithmetic

Assumptions marked. Change them and the conclusion holds, because it survives a factor of three.

| | Value | Basis |
|---|---|---|
| Budget | €1,000,000 | The premise |
| To riders | €600,000 | 60%. The rest is review and kit, below |
| Rate | €25/hour | Deliberately above Amsterdam courier effective pay (~€13–16/hr). Attractive, not exploitative |
| **Rider-hours** | **24,000** | €600k ÷ €25 |
| Average speed | 12 km/h | Urban e-bike with stops, narrating |
| **Kilometres ridden** | **288,000** | 24,000 × 12 |

24,000 hours is roughly **twenty part-time riders for a year**, or fifty riders for five months.

Now the denominator. Amsterdam's cyclable network is on the order of **2,000 km** — do not trust that
number, compute it, because the query is two lines of Overpass and the answer is exact. Taking it:

> **288,000 km ÷ 2,000 km ≈ 140 passes over every cyclable street in the city.**

That is the finding. One complete pass of Amsterdam is about 2,000 km, or **170 rider-hours, or
€4,250.** Ten passes — enough for a defensible surface statistic on every street — is **€42,000,
four percent of the budget.**

So a million euros is not a mapping project. Baseline coverage is a rounding error. What the other 96%
buys is everything coverage cannot:

| Spend | Buys |
|---|---|
| Repeat passes over a year | Change detection: a pothole forming, roadworks arriving and leaving, a kerb getting ramped, a repair that lasted four months |
| Night, rain, ice, wind, dark-at-five | The conditions that decide whether infrastructure works, and that no survey crew is sent out in |
| Neglected districts | Nieuw-West, Zuidoost, Noord above the ring, the polder edges. Uniform payment buys more Vondelpark; scarcity bounties buy the map's actual holes |
| Narration by people who know things | Below. This is where the order of magnitude lives |
| Review capacity | The real bottleneck |

Or: **€1M is baseline coverage of about twenty-five European cities.** That is a different programme,
and possibly the better one.

## What the artifacts weigh

| Stream | Volume at 24,000 hours | Note |
|---|---|---|
| Frames, one per 10 m | ~28.8 M frames, ~8.6 TB at 300 KB | Distance-sampled, not video. Video at 1080p30 would be ~54 TB and is not kept |
| Spoken utterances | **~1,000,000**, at one per 90 seconds of riding | The asset. Geolocated, timestamped, in Dutch and English, from witnesses who were there |
| IMU at 100 Hz | ~200 GB | Free, effectively |
| Transcription | ~€8,600 at cloud rates | Which is the argument for on-device Whisper, not the argument for a budget line |

Storage for all of it, cold, is a few hundred euros a month. **The corpus is cheap to hold and
impossible to buy.** A million geolocated spoken observations about European cycling environments does
not exist anywhere, at any price, because nobody has ever paid anyone to say them out loud.

## Review is the bottleneck, and that is what sets the split

€250,000 of review at €25/hour is **10,000 review-hours**. At two minutes per item that is **300,000
items reviewed**; at thirty seconds for a simple confirm, over a million.

That number lands on the same order as the utterance count, which is why the split is 60/25/15 rather
than 90/10. Spend it all on riding and you have bought a million observations nobody looked at, which
is not a dataset, it is a landfill. The saddle tier and the desk tier are both paid work
([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#two-tiers--saddle-and-desk)).

Remaining 15% — €150,000 — is mounts, power banks, data, insurance, coordination, and the person
writing the prompts, who is doing the highest-leverage job in the programme.

## The rider is the classifier

Same street, same sensors, same route, same hour. Different narrator, different dataset. This is the
human version of the mapping layer that decides what a swerve *means*
([`transgression.md`](transgression.md#where-a-swerve-means-something-the-construction-set-level)) —
and here the mapping is a person's education and biography, which cannot be authored, only invited.

| Who is riding | What their hour produces | Checkable against |
|---|---|---|
| **Courier** | The working city: door zones, wind corridors, which bridges are up when, which courtyards connect, unreachable addresses, where the police wait, which stretch destroys a wheel | Repeat passes, other riders, the impulse record |
| **Architecture student** | Gable types, building periods, schools — Amsterdamse School brick against 1970s infill against a 1990s pastiche of both — and the misattributions that make a street legible | **BAG**, the national building registry, which carries a construction year for every building in the Netherlands; **RCE** monument numbers for the listed ones |
| **Someone who grew up here** | What that building used to be, where the tram ran, which shop closed, which alley was a canal, whose grandmother's window that was | Old maps, photo archives, other locals, and nothing else — which is exactly why it is worth paying for |
| **Wheelchair or cargo-bike user** | Which kerb is actually flush, which "ramp" is a lie, which crossing needs three light cycles | Direct measurement, and the kerb impulse record |
| **Parent on the school run** | Where children are made to do something adults would refuse | Time-of-day traffic, wait-point envelopes |
| **Night worker** | The city at 03:00, which is a different city and is mapped by no one | Lighting, `lit=*`, the transgression buffs |

The architecture case is the sharpest because it is the most checkable, and that produces the rule for
all of them:

> **An expert claim is worth most exactly where it disagrees with the registry.**

BAG says 1965; the student says the facade is 1890 with a post-war rebuild behind it. Both are right,
and the disagreement is the finding — it is a renovation year in a field labelled construction year,
which is a known weakness of the registry and invisible until somebody stands in front of the building
and says so. A claim that merely agrees with BAG has confirmed an import. A claim that fights it has
produced knowledge.

Same for the local who grew up there: **their claim has no register to check it against**, so it never
gets promoted to a fact automatically. It gets recorded as testimony, with the person's name if they
want it, and it corroborates or fails to corroborate against other people's testimony. That is what
the city record is for ([`city-record.md`](city-record.md)) — and it is oral history with coordinates,
which is a genre that exists and has methods.

## Prompts are the product

An hour of unprompted riding produces an hour of "yeah, this bit's rough." An hour with a written
brief produces the thing you wanted. The prompt is the research instrument.

| Bad prompt | Better prompt |
|---|---|
| "Describe the street" | "Ride Bos en Lommer after dark. Tell me every place you would not stop" |
| "Note the architecture" | "This block has four periods on it. Walk me along and date them, and say where you are unsure" |
| "Look for problems" | "Show me every kerb you have to bump down, and say whether you could do it with a full cargo box" |
| "Find potholes" | "You know this route. What has changed since last winter?" |

The highest-value prompt for a local expert involves no riding at all: **"tell me what you already
know."** Twenty minutes of a courier at a table describing which bridges open when is worth more than
five hours of them riding past those bridges in silence.

This is not a new method. It is **photovoice** (Wang & Burris, 1997 —
[HEB 24(3)](https://doi.org/10.1177/109019819702400309)): participants photograph their own
environment, narrate the images, and the narration is the data, aimed at policymakers. Its ethics
protocol is thirty years old and already written
([Flint Photovoice](https://journals.sagepub.com/doi/10.1177/109019810102800504)) — bystander consent,
image ownership, minors, dissemination. And it is **ride-along interviewing**, the mobile-ethnography
method used specifically for cycling and walking perceptions
([Marquart & Schicketanz, 2022](https://elib.dlr.de/190113/1/Marquart_Schicketanz_2022_Experiences%20of%20safe%20and%20healthy%20walking%20and%20cycling%20in%20urban%20areas.pdf)).
Use the literature; do not re-derive it badly.

## Prior art on paying for capture

| Programme | Model | What it tells us |
|---|---|---|
| [Hivemapper](https://docs.hivemapper.com/honey-token/earning-honey/) | Dashcams, paid in HONEY tokens, weighted by coverage, freshness, quality, with regional bounties and customer-funded "bursts" for requested areas | The **incentive design is genuinely good** and worth copying: pay for the *unsaturated* area, not the easy one. The **economics are a warning** — contributors report on the order of a few dollars per thousand miles at recent token prices, against a device costing several hundred, so payoff is measured in six-figure mileages. Pay people money |
| Mapillary | Volunteer and campaign imagery, later acquired by Meta | Imagery without narration. A photo of a street does not know why the rider swerved |
| Street View | Employees and contractors, one pass every few years | Coverage is solved; freshness and interpretation are not |
| Premise, Gigwalk, Streetbees | Paid micro-task field observation with prompts | The prompt-authoring craft, and the piecework failure modes |
| StreetComplete, MapRoulette | Unpaid, gamified, quality-gated | Where our review path already points ([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#prior-art-and-what-we-take-from-each)) |

## The labour part, which is not a footnote

Delivery riders are already the most surveilled and most exposed workers in the city. A programme that
pays them to generate more footage has to be structurally different from their day job, not just
better-intentioned.

- **Pay by the minute, never by the finding.** The user's instinct is correct and the reason is worth
  stating: pay-per-hazard invents hazards and rewards hitting things harder. Time-based pay buys honest
  boredom, which is the correct output for a street where nothing is wrong. Same rule as the sacrificial
  hit — score the report, never the impact
  ([`bumps-as-input.md`](bumps-as-input.md#the-sacrificial-hit)).
- **They own the footage.** They can review it, withhold it, and delete it, and they are paid for the
  hour regardless of what is in it. Faces and plates are blurred on the device before anything leaves
  ([`camera.md`](camera.md), [`privacy.md`](privacy.md)).
- **Not during a shift.** In the Netherlands this is not a nicety: the Hoge Raad held on 24 March 2023
  that Deliveroo's riders were employees, not contractors
  ([ECLI:NL:HR:2023:443](https://uitspraken.rechtspraak.nl/details?id=ECLI%3ANL%3AHR%3A2023%3A443)).
  Third-party paid work layered onto someone else's employment relationship is a mess involving
  liability, insurance and their employer's terms. Contract for capture hours as capture hours.
- **No prompt may require the screen.** Speaking is the one input a rider in traffic can afford; that
  is the whole premise of voice here, and a brief that asks for a tap has broken it.
- **Their route is their business.** The programme buys hours in a district, not a trace from a home
  address, and the private-region rules apply to a paid rider exactly as to anyone else.

## What the million actually produces

1. A **surface, roughness and hazard record** for every cyclable metre of a city, with enough repeat
   passes to be seasonal rather than anecdotal, and with the change over a year visible.
2. **~1,000,000 geolocated spoken observations** — the labelled corpus for European cycling
   environments that currently does not exist, in riders' own words, with `nice` recorded as carefully
   as `pothole`.
3. **~300,000 reviewed, human-confirmed findings** feeding OSM tags, municipal reports, and the
   worklist — bounded by review capacity, which is why review is funded.
4. A **testimony layer**: architecture, history and local knowledge attached to coordinates, some of it
   checkable against BAG and the monument registers, some of it checkable against nobody, all of it
   attributed.
5. Twenty to fifty people **paid properly** to pay attention to their own city, which is the part that
   would make the number worth spending even if the dataset were mediocre.

↑ [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md) · [`bumps-as-input.md`](bumps-as-input.md) · [`camera.md`](camera.md) · [`city-record.md`](city-record.md) · [`privacy.md`](privacy.md) · [`speech-track.md`](speech-track.md)

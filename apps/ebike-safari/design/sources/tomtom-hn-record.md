# TomTom, as Don told it on Hacker News (2014–2026)

Primary source: 38 comments by [DonHopkins](https://news.ycombinator.com/user?id=DonHopkins) mentioning
TomTom, written across twelve years. He worked there in Amsterdam **2007–2009**. This is the record
the design docs draw on, kept with links so nothing has to be remembered twice.

Each section says what eBike Safari takes.

## "An interactive user interface could cost people their lives"

The founding statement of [`../bumps-as-input.md`](../bumps-as-input.md), written in 2015 about
Bret Victor's *Magic Ink* and "Interactivity Considered Harmful"
([id=10645012](https://news.ycombinator.com/item?id=10645012)):

> Working at TomTom on GPS navigation really drove that one home, where an "interactive" user
> interface could cost people their lives. Imagine a popup that said "Did you really mean to miss
> that exit? [yes] [no]", instead of just recomputing the route without asking.

Ten years before Google Maps put an undo dialog over the map because the road shook the phone. Same
argument, same domain, and Victor's frame explains why: interactivity is a failure state of software
that could not work out what the user wanted from history and context.

**Taken:** the rule that a moving vehicle's interface may not demand confirmation about the
software's own state. Recompute, record, move on.

## Dynamic queries — Shneiderman's HomeFinder, and SimCity's Frob-O-Matic

[id=22744573](https://news.ycombinator.com/item?id=22744573) and
[id=44631581](https://news.ycombinator.com/item?id=44631581): Shneiderman sent Don
*Beyond Intelligent Machines* (IEEE Software, Jan 1993) to review; the Dynamic HomeFinder inspired
the Dynamic Zone Filter in SimCity — two-ended sliders over population density, pollution, traffic,
land value, crime, growth, with the map updating continuously.

> Users of Dynamic HomeFinder can execute up to 100 queries per second (rather than one query per
> 100 seconds as is typical in a database query language) … and there are no syntax errors.

And Shneiderman's points, as Don summarised them: don't call machines intelligent; enable people to
do what was not possible before rather than automating what they can already do; predictability and
control are desirable; the "intelligent machine" label erases human responsibility; if you treat
machines like people you end up treating people like machines. HCIL, not CHIL — humans first.

**Taken:** the ride planner and the city browser are dynamic queries, not search boxes. Filter the
graph by roughness, greenery, quiet, shade, traffic, smell, exposure — continuously, reversibly,
with no syntax and no query button. This is the same interface in
[`../virtual-ride.md`](../virtual-ride.md) as in the live map, and it is why the layers exist.

## Peer-assisted map distribution, and the consent panel

The long one ([id=7601083](https://news.ycombinator.com/item?id=7601083), with more at
[id=7602137](https://news.ycombinator.com/item?id=7602137) and
[id=20141872](https://news.ycombinator.com/item?id=20141872)). Founder Pieter Geelen's idea,
implemented and beta-tested by Don: distribute TomTom's maps — 1 GB and growing, wanted by many
people in the same region at the same time — over BitTorrent instead of paying Akamai.

Findings worth keeping:

- **The economics were real.** Analysis of Akamai's logs projected about **€1M saved in the first
  year**, growing. Australia was the extreme case: bad international connectivity, excellent
  domestic bandwidth, and everybody wanting the same map.
- **Architecture:** don't build a torrent client into the app. Red Swoosh, FoxTorrent and BitTorrent
  DNA all ran as **separate processes controlled over HTTP** — trivial to drive from a browser-based
  app, no native plugin, no bloating the UI process. And it should be **one shared system service**,
  or every app competes for the same disk and network.
- **Fallback:** BitTorrent DNA served from the CDN while the swarm warmed up, and fell back when the
  swarm was thin.
- **The user interface was the hard part, and the founder micromanaged it**: explain what it is, set
  the defaults right, get explicit consent for upload bandwidth, disclose the costs and the risks,
  and be clear about who benefits — never leave the impression that it exists only to save the
  company money.
- **Why the care:** TomTom's traffic prediction depended on riders trusting the company enough to
  upload anonymised traces. Saving a million euros was not worth spending that trust.
- **How it died:** Akamai unilaterally cut its prices once a competing quote existed, and middle
  management cancelled the project.

**Taken:** [`../map-distribution.md`](../map-distribution.md). A city's offline basemap is a large
file that many riders in one place all want — the same shape, twenty years later. Ours is
OSM-derived, so sharing it peer-to-peer is legal, which is exactly what a commercial tile licence
forbids. And the consent panel is copied wholesale, because it was got right once already.

## The trust ledger

[id=7602137](https://news.ycombinator.com/item?id=7602137) and
[id=42979048](https://news.ycombinator.com/item?id=42979048): TomTom anonymised uploaded traces by
recording no identity and **clipping the start and end of each trip**, so origin and destination
could not identify the driver. The aggregate produced a per-road speed model by hour and by
weekday/weekend, which fed the next map update — so the data a driver contributed came back to them
as a better route.

Also the honest side effect, in his words: the people living on obscure roads that turn out to be
efficient shortcuts do not experience the aggregate as a gift when the truck convoys arrive.

**Taken:** the trip-end clipping is the ancestor of [`../privacy.md`](../privacy.md)'s home clip and
dither. The side effect is a live warning for comfort-weighted routing: **publishing the smooth
route moves traffic onto it.** A recommendation changes the thing it measured, and the people who
live there did not opt in.

## IQ Routes — the statistical model of a road's speed

[id=46270813](https://news.ycombinator.com/item?id=46270813): a speed model per stretch of road, by
hour, split weekday/weekend — "not 7 individual days, but 2 kinds of days" — used for route planning
and time estimates.

**Taken:** already credited in [`../wait-points.md`](../wait-points.md) as the tod/dow envelope for
learning how long a light or bridge makes you wait. The coarseness is the lesson: two kinds of day
was enough to ship.

## The IMU has two jobs

[id=13748977](https://news.ycombinator.com/item?id=13748977),
[id=46264687](https://news.ycombinator.com/item?id=46264687),
[id=46270813](https://news.ycombinator.com/item?id=46270813): TomTom's Enhanced Positioning
Technology used accelerometers and gyros for dead reckoning where GPS failed — tunnels, underpasses,
tall buildings. Don knew the engineer who built it.

> Well it registers gravity, so you can detect i.e. driving off a cliff. ;) What helps is that
> tunnels don't usually branch, so once you're in it, your path is usually quite predictable.

**Taken:** the motion stream that measures bumps is also the one that keeps position under a bridge,
in a tunnel, or in the canyon between canal houses — and the road graph constrains the guess, because
a tunnel does not branch. Two products from one sensor, and Amsterdam has plenty of both cases.

## Gamification, and what the lawyers killed

[id=20734665](https://news.ycombinator.com/item?id=20734665) and many re-tellings: TomTom ran an
employee contest for ways to gamify internet-connected PNDs.

- A co-worker's **real-time top-ten speeders leaderboard for every road on Earth** — "Foursquare for
  speeding." Legal said no, correctly.
- Don's **TomTomagotchi**: a navigation device with a personality that begs to be driven to places it
  wants to visit, with product placement as the revenue model.

Both already harvested in [`tomtom-rejected-ideas.md`](tomtom-rejected-ideas.md); the leaderboard is
why this project scores novel exposure instead of speed
([`../peerboard-and-brews.md`](../peerboard-and-brews.md)).

## Why the PND died, from inside the building

[id=31582257](https://news.ycombinator.com/item?id=31582257),
[id=13747015](https://news.ycombinator.com/item?id=13747015),
[id=16262260](https://news.ycombinator.com/item?id=16262260):

> TomTom was just on the cusp of a small company turning into a big company. And the savings and
> loan crisis was about to cause the economy to collapse. Then TomTom got into a bidding war with
> Garmin over Tele Atlas. So they ended up borrowing a whole lot of money at a really bad time. Just
> as the iPhone was hitting the market, and Google and Apple were rolling out free maps and
> turn-by-turn navigation on smart phones that everybody already had.

The mechanism, in his reading: Garmin bid €2.3B for Tele Atlas knowing it could never switch off
Navteq data, TomTom raised to €2.9B to keep it away, Garmin walked and renegotiated a cheaper Navteq
contract. A head-fake that cost TomTom close to a billion euros and saved Garmin money. Etak's 1984
digitisation is the same data, by descent. Later: [dropping map updates for older
devices](https://news.ycombinator.com/item?id=16262260) (2018), then automation-driven job cuts
(2022).

**Taken:** the steamroller analogy in [`../bike-computer.md`](../bike-computer.md), with the
correction that free software on hardware people already owned was the *coup de grâce* to a company
already carrying defensive debt into a recession. Bosch is not leveraged, but it is defending a
hardware-plus-subscription margin, which is the same instinct that made the Tele Atlas bid feel
necessary.

## Browsers on devices, twice

[id=44631581](https://news.ycombinator.com/item?id=44631581),
[id=16245942](https://news.ycombinator.com/item?id=16245942),
[id=34228410](https://news.ycombinator.com/item?id=34228410): TomTom Home — the iTunes-for-your-PND
desktop app — was built on **XULRunner**, and the embedded Linux devices ran **WebKit**, because
Mozilla's platform could not go small and Mozilla never supported third-party use of it anyway.

**Taken:** the "browser on every screen" thesis in [`../virtual-ride.md`](../virtual-ride.md) is not
novel for this author — he shipped the desktop half and the device half of exactly that
architecture in this product category, in 2007. The scar is the platform bet: XULRunner was
abandoned, so the app layer should be the plain web platform, with the wrapper replaceable.

## Not harvested

The 2025 comment about a named TomTom executive and why a colleague left is public on HN, personal,
about third parties, and has nothing to do with the design. It stays out of these docs.

↑ [`../bike-computer.md`](../bike-computer.md) · [`../bumps-as-input.md`](../bumps-as-input.md) · [`../map-distribution.md`](../map-distribution.md) · [`amsterdam-gps-lineage.md`](amsterdam-gps-lineage.md) · [`tomtom-rejected-ideas.md`](tomtom-rejected-ideas.md)

# Blocked bike lanes — the prior art, and what the data showed

Harvested because a rider reporting a car in the bike lane is the same machinery as a rider reporting a
pothole, pointed at a different subject — and the difference in subject is the whole design problem.
Worse than potholes, as Don puts it: a hole damages a rim, a blocked lane pushes you into the traffic
lane.

## Safe Lanes — San Francisco, 2019

Stephen Braitsch built [**Safe Lanes**](https://www.safelanes.org/) after a cyclist was killed riding
in an unprotected San Francisco bike lane in 2019. A mobile website: photograph the obstruction,
record the plate and a vehicle category (private car, ridehail, moving truck, commercial), and the
report is automatically filed with the city's 311 service.

The [peer-reviewed analysis](https://doi.org/10.32866/001c.12651) of its first nine months (*Eyes on
the Bike Lane: Crowdsourced Traffic Violations and Bicycle Infrastructure in San Francisco*, Findings,
[PDF](https://findingspress.org/article/12651.pdf)) is the part worth keeping:

| Finding | Number |
|---|---|
| Reports, 1 May 2019 – 31 Jan 2020 | **9,477** — about 34 a day |
| SFMTA citations over the same period | **9,817** — about 36 a day |
| Peak reporting hours | 10:00–16:00, then the 16:00–19:00 commute |
| Weekday vs weekend reports | 39 vs 22 a day |
| Most common offender category | Private vehicles (5,769), then ridehail and delivery, then commercial trucks |

**A volunteer website matched the entire enforcement output of a city agency.** Two structural
findings came with it: blockages happen across the whole network rather than only in the dense core,
and **the geography of enforcement does not match the geography of the problem**. The paper's policy
conclusion is not "write more tickets" — it is to build separated lanes at the hotspots and **convert
curb space from long-term parking to loading zones**, because the offenders are mostly people
delivering things.

For scale on the enforcement side, [Streetsblog SF
(2022)](https://sf.streetsblog.org/2022/08/08/commentary-use-third-party-video-pics-for-traffic-enforcement)
reported 45 officers in SFPD's traffic division issuing about ten citations a day between them, with
311 reports logged mostly for data collection. The same article makes the argument that matters
technically: SFMTA's **TOLE** program already issues automatic citations from cameras mounted on
transit vehicles for cars in transit lanes and bus stops. The precedent for camera-based enforcement
exists; it has simply never been pointed at bike lanes.

## Bike Bureau — the automated successor

[**Bike Bureau**](https://loudbicycle.com/bb/) (Loud Bicycle) automates the whole capture: point the
phone, and it locks onto the vehicle, takes the photo, reads the plate, attaches the location and
prepares the report in about three seconds. Reports become points on a public map, the aggregate data
is published anonymised for advocates and researchers, submissions worldwide are accepted, and
auto-filing to 311 or SeeClickFix works in roughly twenty-eight named cities — Boston, Cambridge,
Somerville, Minneapolis, Oakland, Daly City, Las Vegas and others. No Dutch city is on that list.

It is also gamified, and its choice of what to reward is the fork in the road for our own design: the
profile screen offers trophies including **"License plates you've captured"**.

## The fork

Two things can be scored, and they are not the same thing:

| Score the measurement | Score the capture |
|---|---|
| This lane was blocked here, at these hours, this often | This person's plate, collected by you |
| Aggregate is the artifact; it argues for a loading zone | Individual report is the artifact; it argues for a ticket |
| No subject has rights to violate, because there is no subject | The subject is a person, and the rider is now a witness |
| Survives being wrong — a miscount is a miscount | Being wrong means accusing someone |

Both are legitimate; only one is safe to make into a leaderboard. The position taken in
[`mechanical-turk-ebike.md`](../mechanical-turk-ebike.md) is that **the platform rewards the
measurement, and filing a citation stays a private act by the rider that earns no points** — because
a trophy case of other people's licence plates is a surveillance incentive, however good the cause.

The measurement route also turns out to be stronger evidence. Photographs prove one instance and
require a person to stop and take them; the [forced-merge
signature](../bumps-as-input.md#three-axes-not-one) is recorded by every rider who passes, needs no
camera, names nobody, and produces exactly the thing the SF study had to infer — **the hours the
obstruction happens**. A ticket argues with one driver. A schedule argues with a curb.

↑ [`../map-game-platform.md`](../map-game-platform.md) · [`../mechanical-turk-ebike.md`](../mechanical-turk-ebike.md) · [`../bumps-as-input.md`](../bumps-as-input.md)

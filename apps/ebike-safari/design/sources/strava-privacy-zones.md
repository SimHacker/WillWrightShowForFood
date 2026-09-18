# Strava's privacy zones — fifteen years of the obvious version leaking

Prior art for [`../privacy.md`](../privacy.md). Strava has had the home-masking problem longer than
anyone and has been publicly wrong about it twice. The attacks are documented, peer-reviewed, and
they tell us which of our own instincts are fine and which are decoration.

## What Strava actually does

There are two separate mechanisms and they are often confused.

**Explicit start and stop.** A Strava activity is bounded by the rider pressing record and pressing
stop. That is the whole trip model — no passive background collection, no trip inference. This is
*not* a privacy feature; it is a recording feature, and it is the reason a privacy feature is needed
at all, because what people actually do is press start in the hallway and stop in the driveway.

**Endpoint Privacy Zones (EPZs), from nearly the beginning.** The rider enters an address and picks
a radius. Any part of an activity that starts or ends within the circle is hidden from other members.
Radii were a fixed set — ⅛, ¼, ⅜, ½, or ⅝ mile — and the published track was redrawn as if the ride
had begun on the circle's edge, with no marker saying a zone was applied
([Strava engineering](https://medium.com/strava-engineering/update-to-privacy-zones-functionality-98a570f6ebb)).

**Distance-based cloaking, announced Aug 2021, defaulted on around Jun 2022.** Three options: hide
start and end near a given *address*; hide start and end of *every* activity regardless of where it
is, adjustable 0–1600 m; or hide the entire map. New accounts get the first and last **200 m** hidden
by default once they have had an account seven days and uploaded one activity. Hidden portions are
also excluded from the Global Heatmap, and you are not eligible for segments inside them
([DC Rainmaker](https://www.dcrainmaker.com/2021/08/privacy-features-options.html),
[Strava support](https://support.strava.com/en-us/articles/15402012-edit-map-visibility)).

The usability bill for the default arrived immediately: a published activity's distance no longer
matches the polyline, so routes built from someone's ride come out short, and riders who live near
the start of a segment lose their local legend
([r/Strava](https://www.reddit.com/r/Strava/comments/xf86u8/unpopular_opinion_the_new_privacy_changes_screwed/)).

## Attack 1 — the circle has a centre (2018)

Given a fixed set of possible radii and a few activity endpoints sitting on the boundary, you fit a
circle. One endpoint leaves a large space of candidates; two shrink it sharply; three usually pin the
radius and the centre.

Hassan, Hussain, Rahman, Bertino and Hunter, **USENIX Security 2018**, *Analysis of Privacy
Protections in Fitness Tracking Social Networks — or — You can run, but can you hide?*:
**84% of users who had EPZs enabled revealed the protected location anyway; 95.1% for moderate and
highly active users.** They scraped 21 million public activities to get there
([paper](https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-hassan_0.pdf)).

A simpler variant — take the midpoint of the exposed start and end — was published the same year by
Wandera and covered by [ZDNet](https://www.zdnet.com/article/researchers-found-a-way-to-unmask-strava-users-hidden-locations/).

Context for why anyone cared: in January 2018 Strava's global heatmap had just been observed to
reveal the layouts of classified military bases and intelligence sites.

**Strava's fix (2018):** stop centring the circle on the address. Pick a random nearby point as the
centre, uniformly among points within a distance smaller than the radius, so the true location is
inside the zone but not at its middle. The pin the athlete sees does not move; the zone around it
shifts ([Strava engineering](https://medium.com/strava-engineering/update-to-privacy-zones-functionality-98a570f6ebb)).

Mink et al. (2022) then showed humans can eyeball the zones by hand.

## Attack 2 — the metadata still says how far you rode inside the hole (2022)

This is the one that matters to us, because it defeats the fix.

Dhondt, Le Pochat, Voulimeneas, Joosen and Volckaert, **ACM CCS 2022**, *A Run a Day Won't Keep the
Hacker Away* ([DOI](https://doi.org/10.1145/3548606.3560616)): the published activity still carries
the **total and accumulated distance**, so the attacker knows how many metres were travelled inside
the blind spot. The road network constrains which paths could account for exactly that distance, and
regression across several activities converges on the house.

Evaluated on **1.4 million Strava activities: up to 85% of EPZs broken** (at 200 m radii; 55% at
1 km), with a stricter error threshold than the 2018 work, *against the spatially cloaked
implementation the 2018 work recommended*.

Two findings that read like they were written for Badhoevedorp:

- **Sparse street grids make the attack better.** Fewer candidate paths can explain a given distance.
  A village is more exposed than a dense city, not less.
- **Geographic diversity of entry points helps the attacker.** Many rides through the same gate add
  little; a few rides arriving from different directions add a lot. Suburban living, in other words.

### Their six countermeasures, and only one works

| # | Countermeasure | Verdict |
|---|---|---|
| C1 | Round reported distances | Effective — fully breaks the attack past ~500 m rounding — and destroys the product, since accurate small achievement differences are why people are there |
| C2 | Add random noise to distances | **No change in success rate.** Multiple activities from one gate average the noise out |
| C3 | Shift reported endpoints, keep true total | **No change.** Averages out the same way |
| C4 | **Truncate: drop the inside portion from the reported totals entirely** | **Thwarts the attack.** Nothing remains but a guess among all candidate locations |
| C5 | Bigger radii | Helps, but short rides vanish inside the zone; riders already avoid large radii |
| C6 | Complex or non-circular zones, cloaked endpoints | Only makes *finding the zone* harder. Distances and endpoints remain, so the regression is unaffected |

And one trap: **regenerating a zone can help the attacker**, by yielding more independent samples of
the same protected location.

## What this means for us

1. **Redaction after the fact is the wrong architecture.** Every one of these attacks operates on a
   complete record with a hole in it, where the hole's dimensions are recoverable from the metadata
   around it. Strava cannot adopt C4 without breaking its own product, because the personal total *is*
   the product. Our published artifact is a per-edge aggregate, not a personal distance, so C4 is free
   for us: clip at the source, and compute distance, duration and elevation from the clipped trace, so
   there is no inner distance to leak because it was never measured into anything published.
2. **Publish nothing per-ride by default and the attack loses its input.** Every attack needs the set
   of activities belonging to one rider, to intersect them. Aggregate-only publishing with a
   multi-rider threshold does not offer that set.
3. **Do not rely on a randomised centre.** It was the state of the art in 2018 and was broken in 2022.
   Ours is a plain rectangle-free polygon that we never publish and never regenerate.
4. **Fix the region once.** No regeneration, no per-ride re-randomisation of the boundary — those add
   samples.
5. **Random dithering of the cut is cosmetic, not protective.** Keep it, because it stops the naive
   visual read and costs nothing, but do not count it as the defence. The defence is that the
   discarded metres are not in any number we publish.
6. **The village is the hard case, and the threshold rule is what saves it.** In sparse grids the
   attack works better and the multi-rider threshold publishes less. Those pull the same direction,
   which is lucky and worth stating out loud.

## The other half — aggregate publishing

- **Jan 2018:** the global heatmap revealed the layouts of classified bases, because aggregating a
  population that is unusual in one place is not anonymisation. An Australian student looked at the
  Syrian desert and found glowing trails where the map should have been dark.
- **Oct 2024:** *Le Monde*'s three-part **StravaLeaks** identified 26 US Secret Service agents, 12 of
  the French GSPR and 6 of the Russian FSO by their public profiles, and used their runs to place the
  people they protect — Macron's undisclosed 2021 weekend in Honfleur, Biden's San Francisco hotel
  hours before meeting Xi Jinping in 2023, Putin's guards jogging past properties the Kremlin denies
  he owns. Nothing was hacked; the bodyguards' own default settings did it
  ([Le Monde](https://www.lemonde.fr/en/pixels/article/2024/10/27/strava-the-exercise-app-filled-with-security-holes_6730709_13.html),
  [AP](https://apnews.com/article/biden-trump-macron-bodyguards-security-strava-0a48afca09c7aa74d703e72833dcaf72)).
  Macron's office called the risk slight and told the agents to stop using the app.

The pattern in both: the leak came from the population the designers did not model, and the defence
that failed was a setting the user was expected to find.
- **Strava Metro** is the aggregated product sold to city planners, and is the closest existing thing
  to what [`mechanical-turk-ebike.md`](../mechanical-turk-ebike.md) proposes giving away.

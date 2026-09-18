# Mechanical Turk on an eBike

The name indicts itself, which is why it is the right one.

Von Kempelen's Turk (1770) was a chess automaton with a person folded into the cabinet. It toured for
decades, beat Napoleon and Franklin, and Poe took it apart in print in 1836. The fraud was never the
chess — it was the curtain. Amazon then named its piecework marketplace after it on purpose and sold
the product as "artificial artificial intelligence": human labour, billed by the task, invisible by
design.

So there are two lessons in the same object, one to take and one to refuse. **The work is human — say
so.** And **the human must not be hidden, and must not be underpaid in points.**

This is the doc for the sentence in [`bumps-as-input.md`](bumps-as-input.md) that says measured
roughness produces *proposals only — a worklist a human reviews and enters*. That worklist is a
product surface, and it is the one part of this project that could quietly turn into gig work.

## What a task is

Every system below generates tasks from **gaps in the map**. Ours generates them from
**measurements**, which is the entire difference: a task arrives already carrying a suspicion, a
coordinate, a photo, a date, and a count of how many unrelated riders felt the same thing.

| Task | Generated from |
|---|---|
| "Forty impulses here since March and nobody has named it. Pothole?" | Unlabelled hit cluster |
| "Riders swerve here only when it has rained. Does water stand?" | Wet-conditional dodges |
| "Everybody goes around this. What is in the way?" | Dodges with no hits |
| "Nobody dodges and everybody hits it. Can you see it coming?" | The invisibility case |
| "This went quiet in June. Was it repaired?" | A signature that stopped |

That last row is a question no other system can even ask, because asking it requires having measured
the street before and after.

The bar is StreetComplete's bar: **answerable on site, by looking, in one question.** If it needs a
survey wheel, a tape measure, or an argument, it is not a task.

## The task is already on your route

StreetComplete sends you out to find quest pins. We already know where you ride, so a task can be
offered on something you were going to pass anyway — which makes the labour nearly free, and makes
the temptation obvious.

**Hard rule: the worklist never bends the route.** The instant this app routes a rider to raise task
throughput, it has become the thing in the title. Detours are asked for, never suggested mid-ride, and
a task is an [observation-grade](navigation-smell-steer.md) offer — it commits nothing, so it earns no
attention and gets no legibility window.

## Two tiers — saddle and desk

| Tier | Where | Cost to the rider |
|---|---|---|
| **Confirm** | On the bike | One spoken word or one swipe, about something already passed. No forms, no typing, no reading |
| **Enter** | At the desk | Review the frames, make the OSM edit or file the municipal report — desk mode in [`virtual-ride.md`](virtual-ride.md) |

Credit splits three ways, because three different people did three different things: **measured**,
**confirmed**, **entered**. OSM credits only the changeset author, so the rider who rode over a hole
forty times is invisible in the one ledger that exists. Recording all three is how we avoid
reproducing the invisibility this doc is named after.

## Prior art, and what we take from each

| System | What it does | What we take |
|---|---|---|
| [StreetComplete](https://wiki.openstreetmap.org/wiki/StreetComplete) | Android surveyor app: missing OSM data becomes quest pins, each a single question, answers upload under the user's own OSM account. No geometry editing | The question bar, and the on-site discipline |
| [StreetComplete achievements](https://wiki.openstreetmap.org/wiki/StreetComplete/Achievements) | Solving quests unlocks **links to other OSM projects** — weeklyOSM, MapComplete, Valhalla, Mapillary — rather than points or prizes | **The prize is a door, not a number.** The best reward design in the field, and it costs nothing |
| [MapComplete](https://mapcomplete.org/) | Thematic maps, each editing one kind of feature | Worklists scoped per theme instead of one undifferentiated queue |
| [MapRoulette](https://maproulette.org/) | Challenge and task manager for machine-detectable OSM problems | Publish our clusters as a challenge rather than building another editor. Their documented risk — mass "verified" clicking — is why the credit rules below exist |
| [OSM Notes](https://wiki.openstreetmap.org/wiki/Notes) | Anyone can drop "something is wrong here" without being a mapper | The escape hatch: **"I don't know what this is"** must always be an answer |
| [HOT Tasking Manager](https://tasks.hotosm.org/) | Mapathon workflow where validation is a distinct, credited role | Validation is a job, not a formality |
| [Signalen](https://signalen.org/) | The municipal side — reports about public space, not map data | Some tasks end at the city, not at OSM |
| [Safe Lanes](https://www.safelanes.org/) · [Bike Bureau](https://loudbicycle.com/bb/) | The same worklist aimed at **people** — photograph a car in the bike lane, read the plate, file with 311. Volunteers matched a whole city agency's citation output ([record](sources/blocked-bike-lanes-record.md)) | The report-sink pattern, and the clearest cautionary case in the table: Bike Bureau's trophy case includes *licence plates you have captured* |

That last row is the fork this doc exists to name. **Score the measurement, never the capture.** A
lane blocked at this edge between nine and eleven on weekdays is an argument for a loading zone that no
subject can be wronged by; a leaderboard of other people's plates is a surveillance incentive wearing a
good cause. Filing a citation stays available to any rider and earns nothing — see
[`map-game-platform.md`](map-game-platform.md#the-third-party-test--somebody-elses-app-as-a-contract)
for where the platform draws the line, which is that a layer gets the frame and never the plate.

## Credit that cannot be farmed

Use the existing currency in [`peerboard-and-brews.md`](peerboard-and-brews.md) — tend credit, fair
picks, brews, no speed ever — rather than minting a second economy. Five rules make the difference
between a survey and a click farm:

- **Pay the null result.** "Checked, nothing there" is the most valuable and least rewarded answer in
  every system in that table. If only findings pay, you have purchased findings.
- **Corroboration pays more than first report.** Inverts the land grab, and matches the existing
  *don't complete, cooperate* rule in [`urban-garden-loop.md`](urban-garden-loop.md).
- **The bounty grows with neglect.** Reuse the `wild` multiplier from
  [`transgression.md`](transgression.md): an unchecked task in Aalsmeer is worth more than one on the
  Damrak, and coverage spreads itself without anyone assigning work.
- **No count board.** The peerboard shows what was checked recently and what nobody has checked, so
  the scoreboard *is* the worklist. Overview first, zoom, details on demand — Shneiderman, doing double
  duty as an anti-cheating mechanism.
- **A wrong answer costs nothing and pays nothing.** No punishment, because punishment produces
  cautious lying; no payment, because payment produces confident lying.

## Where this turns into Amazon

The refusal list. Each of these is checkable by reading the code, which is the point of writing them
down.

- **Routing for throughput.** Never. See above.
- **Play and paid never blur.** If a municipality wants a survey, it pays riders in money, disclosed,
  and that is a job rather than a quest. Gamified wages are wages with the receipt torn off.
- **The output stays in the commons.** ODbL for map data, so the labour builds something the labourer
  keeps. Nobody's afternoon becomes a proprietary dataset because a game was fun.
- **Provenance on every fact:** who measured, who confirmed, who entered, which classifier guessed
  first, and when. The Turk's crime was the curtain, and an agent that claims to have surveyed a street
  is a Turk with the operator still in the cabinet.
- **No manufactured urgency.** No streaks that punish a week off the bike, no notifications inventing
  a deadline. The app is for riding.

## Data

```
worklist/tasks/{id}.yml       # question, evidence refs, geometry, opened_at, bounty, state
worklist/answers/{id}.yml     # answer, answerer, tier, conditions at the time, corroborates
worklist/ledger.yml           # measured / confirmed / entered credit, per peer, no counts on top
```

`CONFIRM(task)` joins the gesture vocabulary in
[`skeleton/gesture-engine.md`](skeleton/gesture-engine.md), next to `LABEL` — the difference being
that a label names something nobody asked about, while a confirmation answers something the corpus
asked.

↑ [`bumps-as-input.md`](bumps-as-input.md) · [`peerboard-and-brews.md`](peerboard-and-brews.md) · [`skeleton/osm-enrichment.md`](skeleton/osm-enrichment.md) · [`virtual-ride.md`](virtual-ride.md)

# Transgression score

A running total of *against the grain*. Wrong-way, off-graph, restricted, clockwise
on a Dutch roundabout. Not a wanted-star moral — a second exposure channel.

Clockwise undo is already a gesture ([`geometry-as-language.md`](geometry-as-language.md)).
This is the meter that gesture feeds.

The other meter is **patience** ([`patience.md`](patience.md)) — waiting at a light,
signal, or sign for a typical dwell. Same `STOP`. Not the opposite grain.
They feed each other.

## Accumulators

| Act | Graph fact |
|-----|------------|
| Against `oneway` / bike-lane arrows | snapped edge, reverse of `direction` |
| Clockwise on a NL roundabout | `ROUNDABOUT(clockwise)` — legal flow is counter-clockwise |
| On grass / off the road graph | GPS off snapped edges, onto `landuse=grass` / park interior |
| Restricted | `access=private`, `access=no`, rails, motorway |
| Sidewalk when bikes are barred | `highway=footway` without `bicycle=yes` |
| Short pass at a wait point | dwell below typical; coin lands ([`wait-points.md`](wait-points.md)) |
| Fake wait | performed sit when the point was probably not asking — also patience |
| Fake wait, reported | live peer flag at the same wait point |
| Rode what others walk | high `DISMOUNT` rate on the edge, and you stayed on the bike ([`bumps-as-input.md`](bumps-as-input.md)) |
| **Swerve** | lateral impulse without a graph turn — the smallest transgression there is |

Engine emits the fact and a signed delta. Stories interpret.

## Swerve is the smallest unit

A swerve is a lateral impulse where the graph says straight
([`bumps-as-input.md`](bumps-as-input.md), [`feng-shui-measurement.md`](feng-shui-measurement.md)).
Somebody left the line they were given. It counts, mildly.

It also belongs to the *dithered* family rather than the verdict family, for the same reason a short
pass does: a swerve is deniable by construction. Puddle, pothole, tourist, tram rail, pigeon, whim —
the sensor cannot tell and must not guess. So a swerve draws a coin like a wait point does, at low
`p`, and over a hundred swerves the meter is honest while any single one is a shrug.

Ledsestraat is the reference tape: cobbles under the wheel, ambling tourists, a tram, a police van,
and a continuous swerve track that is one long mild transgression with a dismount at the end.

## Dithered fine at wait points

Do not ask whether the light was green. Do not identify the crossing.

A [wait point](wait-points.md) carries `p` — how likely a short pass is a
transgression. Anyone who did not wait long enough is in the lottery:
Bernoulli(`p`). Heads, you take the fine. Tails, luck held.

Lucky green and ran-it are the same observation. The dither *is* the score.
Over many lights the expectation tracks `p`. One light is a coin, not a
verdict.

## Vampire clock — late night, full moon, go

The game *wants* you out after midnight under a full moon. That combo is the
jackpot: `time_of_day` high, `traffic` low, `moon` = 1. Clockwise undo, grass
cuts, lasso a fountain — all pay.

Notify on the calendar. "Full moon tonight. The roundabouts are open." Not a
disclaimer. An invitation.

Daylight and rush hour *discourage* the same acts. Sun is a modifier, not a
ban. Tuesday lunch clockwise still undoes; it just does not feast.

```
delta = base(act) * time_of_day * traffic * moon * wild
```

That formula is the *default* stack, not the engine. Each factor is a **buff**.

| Window | `time_of_day` | Feel |
|--------|---------------|------|
| Late night + full moon | >> 1 | *encouraged* — get on the bike |
| Late night, any moon | > 1 | still the hour; full moon is louder |
| Daylight | < 1 | counts, costs civic heat |
| Rush / school-run | << 1, maybe negative | same loop at 8:30 is a different spell |

`moon` is illumination at `t` (0 new → 1 full). New moon is stealth, smaller
tick. Full moon is charged. `traffic` starts as a clock heuristic (weekday
AM/PM peaks). Do not wait for live data.

Same clockwise lap, four spells: Tuesday lunch, 1am new moon, 1am full moon,
full moon *and* they told you to go.

## Buffs — the multipliers are data, and they say where they came from

Full-moon mode is not a mode. It is a **buff**: a named, timed, visible modifier with a source you
can read. Sims moodlets, and for the same reason — a Sim who is grumpy tells you *why*, and the why
is a row you can inspect, not a number buried in a curve.

```yaml
buff:
  id: full-moon
  name: "Full Moon"
  emoji: 🌕
  driver: lunar          # ephemeris, evaluated at t
  affects: [transgression.delta]
  factor: 1 + 2*moon     # 1.0 new → 3.0 full
  window: dusk..dawn
  says: "The roundabouts are open."
```

| Field | Why it exists |
|---|---|
| `driver` | What computes it: `lunar`, `calendar`, `clock`, `weather`, `graph`, `peer`, `manual` |
| `factor` | A function of the driver, not a constant. Full moon ramps; it does not switch |
| `window` | When it can apply at all. A moon buff at noon is not a moon buff |
| `says` | The line shown to the rider. A buff with no sentence is a bug |
| `stacks` | `multiply` (default), `add`, `max`, or `exclusive` within a tag |

Drivers we get for free, with no data feed and no server: **lunar** phase and illumination from the
ephemeris, **calendar** for the date-shaped ones, **clock** for hour and weekday. Those three already
carry the vampire clock. `weather` and `peer` come later and degrade to absent, not to zero.

Calendar buffs are where the city's own character shows up: King's Day, Ramadan nights, the week the
canals freeze, the Saturday of Pride, the first warm evening in March, the Sunday when the clocks go
back and everyone rides home in sudden darkness. Those are not achievements. They are the year having
a shape, and a scoring system that ignores the shape of the year is measuring a treadmill.

Buffs are visible, always, with the reason attached — `🌕 Full Moon ×3 · until 06:14` — because a
multiplier the player cannot see is not a game mechanic, it is a rigged slot machine.

## Where a swerve *means* something: the construction-set level

The engine emits `SWERVE(lateral_impulse, edge, t)`. It does **not** decide that a swerve is a
transgression. That mapping is a part you snap on, at the same layer as
[`faceball-construction-set.yml`](../../performance-space/faceball-construction-set.yml): same verbs
— paste on, wire up, play — aimed at scoring instead of face puppets. Bill Budge's Pinball
Construction Set, applied to what your ride *counts as*.

So one signal, many readings, all live at once:

| Who is reading | `SWERVE` means |
|---|---|
| Vampire character | A mild transgression. Feeds the meter, ×3 tonight |
| Cargo-bike parent character | Wobble. A *cost*, and a reason to prefer the calm route |
| Safe Lanes layer ([`map-game-platform.md`](map-game-platform.md)) | Evidence of something in the lane, worth a look |
| Surface survey | A puddle, if it repeats where water would pool |
| Nobody's character | Nothing. An unmapped signal is discarded, not stockpiled |

A character is a **mapping bundle**: which signals it subscribes to, what each one scores, which
buffs it accepts, and what it refuses. The vampire declines the calm-route buff. The parent declines
the moon. Two riders can take the identical line down the identical street and score different games,
from the same measurements, without either of them being wrong — which is the point of measuring the
street rather than judging the rider.

Buffs are construction-set parts too. A character ships its own: a bundle in `characters/<id>/` may
add `buffs/*.yml`, and the same lunar driver serves a werewolf, a night-shift nurse and a
photographer chasing moonlight, scoring three different things.

## Full-moon night is Pac-Man on a maze of power pellets

You do not need to go clockwise. Just being *out* — late, full moon — turns
every street into a power pellet. The city is the maze. Ordinary legal riding
chomps. Frontages light up. That is
[exposure Pac-Man](exposure-pac-man.md) with every dot supercharged: same
graph, every edge a pellet, the multiplier is the sky.

Wrong-way and grass are still cherries. The base feast is the ride itself.

## Nether lands

The farther from the city, the better the score. Woods, dunes, polder lanes,
the last unlit path — `wild` goes up as *people* go down.

Start with inverse building/address density on nearby edges, plus OSM
`landuse=forest` / `natural=wood` / `natural=heath`. Distance from the urban
centroid is a cheap proxy until density is wired.

A full-moon night *in the woods* is the feast on a maze that is almost all
power pellets and almost no witnesses. Canal-belt clockwise at noon is a
cherry. Aalsmeer at 1am under a full moon is the board.

## Replay — one transgression per second

Wall-clock of the FIT file is the wrong playhead. Warp time so the
*transgression stream* is a metronome: **1 Hz**. Each signed delta is one beat
of playback.

On a daylight tape, empty legal riding compresses away; the Schipluidenlaan
clockwise stack is the click track. On a full-moon night tape, *do not*
compress: every edge is a pellet, so the whole ride plays at one chomp per
second.

Viewer: draw the polyline, but the scrubber steps event-to-event at 1/sec, not
meters-per-second. Counter ticks the running score on each beat. Optional
audio: a click, or a rising tone with `|delta|`.

The [Schipluidenlaan loops](sources/ride-gestures-2026-09.md) are the first
tape to play this way.

↑ [skeleton/viewer-maplibre.md](skeleton/viewer-maplibre.md)

## What it is not

- Not a real-world instruction to break traffic law.
- Not a leaderboard of who angered the most cars. Score novel *kinds* of trespass
  the way exposure scores novel place types — first clockwise fountain, first
  grass cut-through after midnight — not raw laps.
- Undo still undo. The clock only changes the *price* of the undo, not the verb.

## Outputs

`trips/{id}.transgression.json` — `{ act, edge, t, base, buffs: [{id, factor}], delta, running }`

`buffs` replaces the fixed `time_of_day / traffic / moon / wild` columns — same numbers, named, so a
replay can say *why* a beat was worth what it was worth.

Wait-point draws add `{ wait_point, p, drawn: true }` on the same stream. Swerve draws are the same
shape with `{ swerve, lateral_impulse, p, drawn }`.

↑ [README.md](README.md) · [geometry-as-language.md](geometry-as-language.md) · [wait-points.md](wait-points.md) · [bumps-as-input.md](bumps-as-input.md) · [`faceball-construction-set.yml`](../../performance-space/faceball-construction-set.yml)

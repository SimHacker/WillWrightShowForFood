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

Engine emits the fact and a signed delta. Stories interpret.

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

`trips/{id}.transgression.json` — `{ act, edge, t, base, time_of_day, traffic, moon, wild, delta, running }`

Wait-point draws add `{ wait_point, p, drawn: true }` on the same stream.

↑ [README.md](README.md) · [geometry-as-language.md](geometry-as-language.md) · [wait-points.md](wait-points.md)

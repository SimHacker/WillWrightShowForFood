# Navigation — smell hill-climb, pie menu, MediaGraph hands

No A→B route as primary UX. **Steer toward smell** — goal is any text; dot product against
field on nearby edges; default auto-picks most popular; rider overrides anytime.

## Hill-climb steering

```
goal text → embed(q)
each GPS tick / replay frame:
  for neighbor edges e within horizon:
    score(e) = Σ_L s(L,e) · max(0, cos(embed(L), q))
  suggest_heading = argmax score(e)   # or blended direction
  if user silent → take suggest_heading
  if user picks pie item or grabs map → override
```

**Trent Small sidewalk maps** without global routing — local signs only. **Canalization** =
remember last good turn per goal cluster.

## Pie menu navigation + auto default

| State | Behavior |
|-------|----------|
| Idle | Top smell match pre-highlighted (like default pie wedge) |
| Confirm | Ride toward it — or do nothing → auto commit, but only once legible (below) |
| Override | Pie menu: popular goals, recent, typed text → new q |
| Fine steer | Grab map — MediaGraph-style |

## Nothing commits that was not legible first

The bike has two actuators — a suggested heading and motor assist — and this is the only place
in the system where software can act rather than interpret. A suggestion that takes effect
before the rider could read it is a private control channel, which is the exact thing
[interfaces to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)
is against. Being a gentle nudge does not exempt it.

Three levels, and only the first two are free:

| Level | What it does | Gate |
|---|---|---|
| **Bias** | Map drifts toward the suggested heading; the wedge is pre-highlighted | None. It is a display, not an act |
| **Suggestion** | Announced heading, voice or glyph, with the goal that produced it | Must be legible for the window below |
| **Commitment** | Turn-by-turn engaged, canalization updated, the turn counted as intended | Legibility window met, or it does not commit |

**Only *continue as you are* may commit silently.** A turn nobody saw coming is the failure
mode, so silence defaults to the current heading — never to a new one. Where the hill-climb
loop says `if user silent → take suggest_heading`, that holds for the **bias** and for replay
of a simulated bike. A heading CHANGE needs the window.

### N, in the two units that matter

Time is what a person needs to notice and decide. Distance is what the bike needs to act
without a swerve. Require both, and take whichever is satisfied later:

- **4 seconds** of continuous legibility — announced, unchanged, not competing with another
  prompt. Roughly notice plus decide plus reach the bar, with the decision being a low-stakes one.
- **25 metres** of travel before the decision point. At 20–25 km/h that is about 4 seconds, so
  the two agree at cruising speed and diverge exactly where they should: crawling in traffic gets
  the distance, coasting downhill gets the time.

**If the window cannot be met, it does not commit.** A fork that arrives too fast to announce is
a fork the rider takes on their own, and the system reports where it went rather than deciding.
No shortening the window because the suggestion is confident.

**Stopped is free.** A wait point has no window at all: zero speed, zero risk, full attention,
and it is already the place the interface expands
([`wait-points.md`](wait-points.md) · [`patience.md`](patience.md)). Announce there by preference.

### Assist may answer the terrain, never the route

Making the preferred route easier to pedal is influence below the level of perception — the rider
feels a hill, not a recommendation, and cannot override what they cannot detect. So assist
responds to gradient, load and the rider's own setting, and takes no input from the suggested
heading. Two routes that meet the same hill get the same assist.

Every commitment, every override, and every window that failed to be met is logged the same way
the gestures are, because the only way to audit a nudge is to have the record admit it happened.

## MediaGraph direct manipulation

Reference: inertial pan/zoom/**flick** — velocity carries to destination; **grab anytime**
to cancel momentum. Map navigation same aesthetic:

- Map **drifts** toward suggested smell heading (gentle camera bias)
- Flick ride intent vector → boost that direction in score
- Touch grab → user owns heading until release
- Scrubber replay: same physics on **simulated bike** playhead

Not turn-by-turn voice until user **commits** ("take me there") — then Valhalla/Bosch.

## Popular smells

Aggregate `cos(q, embed)` hits across riders (privacy-safe counts) → **suggest popular**
in pie menu. Anonymous cemetery **respect** counts separate from Pee popularity.

↑ [`geometry-as-language.md`](geometry-as-language.md) · [`peerboard-and-brews.md`](peerboard-and-brews.md) · [`oni-map-platform.md`](oni-map-platform.md)

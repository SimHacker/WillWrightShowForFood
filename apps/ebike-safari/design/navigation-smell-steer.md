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
| Confirm | Ride toward it — or do nothing → auto commit after N sec |
| Override | Pie menu: popular goals, recent, typed text → new q |
| Fine steer | Grab map — MediaGraph-style |

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

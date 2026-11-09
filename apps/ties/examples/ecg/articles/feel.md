---
title: Feel
synonyms:
  - feel knobs
definition: "The two-zone face with every feel knob live: damping, snap, spring, inertia, overshoot, sticky. Rubber, clay and puppet presets."
---

The patent says what the state is. It doesn't say how dragging it should feel. That part you learn with your hands.

| Knob | What it does | What it costs |
|------|--------------|---------------|
| damping | calms jitter when examples nearly agree | the point lags the cursor |
| snap | lands exactly on an example when close | hard to stop just short of one |
| spring | eases back to the nearest example on release | can feel floaty |
| inertia | a flick keeps going after you let go | overshoots what you aimed at |
| overshoot | lets weights dip below zero at a wall, then springs back | too much looks broken |
| sticky | a detent at the face between zones | notchy if overdone |

Try the presets, then make your own. **Rubber** stretches past the walls and wobbles back. **Clay** stays where you leave it. **Puppet** keeps moving when you flick it and clicks between zones.

```ecg
title: Feel
examples:
  - id: neutral
    points: { ml: [-16, -18], mm: [0, -18], mr: [16, -18], lo: [-24, 20], li: [-8, 20], ri: [8, 20], ro: [24, 20] }
  - id: smile
    points: { ml: [-22, -11], mm: [0, -25], mr: [22, -11], lo: [-24, 22], li: [-8, 23], ri: [8, 23], ro: [24, 22] }
  - id: surprise
    points: { ml: [-7, -20], mm: [0, -30], mr: [7, -20], lo: [-24, 27], li: [-8, 30], ri: [8, 30], ro: [24, 27] }
  - id: frown
    points: { ml: [-17, -25], mm: [0, -16], mr: [17, -25], lo: [-24, 22], li: [-8, 16], ri: [8, 16], ro: [24, 22] }
zones:
  - [neutral, smile, surprise]
  - [neutral, surprise, frown]
layout: { smile: [-1, 0], neutral: [0, -1], surprise: [0, 1], frown: [1, 0] }
strokes: [[ml, mm, mr], [lo, li], [ri, ro]]
decor:
  - { circle: [0, 0, 40] }
  - { circle: [-14, 8, 3.5] }
  - { circle: [14, 8, 3.5] }
view: [-46, -46, 92, 92]
ghosts: none
knobs: true
presets:
  rubber: { damping: 0.01, spring: 180, overshoot: 0.35 }
  clay: { damping: 0.12 }
  puppet: { inertia: 0.85, sticky: 0.15, snap: 0.06 }
```

Next: ~Colour~

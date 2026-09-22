---
title: Spinning Earths
synonyms:
  - Spin
definition: "An example of animated targets."
source: doc/demos/spin.st0
---

NeWS makes the world go round:

```yaml target
# tall-earth.pn0 — globe1.im1 scaled 32×64. spin.tn0 cycles globe1–30.
picture: tall-earth
shapes:
  - shape: spin
    to: nowhere
```

```yaml target
# wide-earth.pn0 — same globe, 64×32.
picture: wide-earth
shapes:
  - shape: spin
    to: nowhere
```

```yaml target
# pivot.tn0 also rotated. The thirty rasters *are* that rotation.
picture: earth
shapes:
  - shape: pivot
    to: nowhere
```

```yaml target
# chomp.tn0: clip a wedge, half-angle abs(sin(t))*30°. Pac-Man eats the world.
picture: earth
shapes:
  - shape: chomp
    to: nowhere
```

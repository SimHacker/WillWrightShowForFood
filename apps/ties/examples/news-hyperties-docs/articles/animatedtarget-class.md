---
title: AnimatedTarget Class
synonyms:
  - AnimatedTarget
definition: "A description of the AnimatedTarget class."
source: doc/classes/anim.st0
---

These is still too gross to document, but here are some to try out...

```yaml target
# blink-open.tn0 — Icon font flipbook, hover starts it (ClientEnter).
# ItemPath was 0 0 1 .5 rectpath. No picture: the eye IS the applet.
# Frames: eye_bld3 eye_bld2 eye_bld1 eye eye1 eye2 eye3 eye4
# bld = bloody. Bloodshot, then clear.
# AnimateDelay .1 60 div  →  100ms. NeWS time is in minutes.
shapes:
  - shape: blink-open   # TARGETS · class AnimatedTarget
    to: nowhere         # demo, no DOCUMENT
```

```yaml target
# earth is ScaledRaster of NEWSHOME /smi/globes/globe1.im1 at 64².
# pivot.tn0: thirty globe views, plus a rotate. Hover the disk.
picture: earth          # PICTURES
shapes:
  - shape: pivot        # the globe turns
    to: nowhere
  - shape: blink-close  # blink-close.tn0: clear, then bloody
    to: nowhere
```

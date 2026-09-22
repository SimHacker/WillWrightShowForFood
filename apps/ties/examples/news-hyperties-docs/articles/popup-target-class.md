---
title: PopupTarget Class
synonyms:
  - PopupTarget
definition: "A target that lifts a clipped piece of its picture on ClientEnter."
source: doc/obj/target.ps
---

Hover a head. Press the picture (not a path) to pop all three.

The popped canvas is the *applied* picture, clipped to ItemPath, translated by PopX/PopY (fractions of the item), scaled by PopScale around the path bbox center. The hole is HoleColor, 25% gray. No NeWS `.cc` cache.

`target.ps` has no class default for those three numbers: `/new` takes them from the instance. Founder heads are 2×. Hubble's orbital telescope is `{ .03 .03 1 }`; the Main view instruments are all scale 1 with a 1–2% slide. An unknown PopupTarget gets Hubble's idiom, not Larry's.

```yaml target
# founders.st0 at 200². Same three PopupTargets as The Founders.
picture: founders.medium
shapes:
  - shape: founder.larry   # {  0    .1   2 }
    to: nowhere
  - shape: founder.moe     # { -.02  .13  2 }
    to: nowhere
  - shape: founder.curly   # { -.05  .1   2 }
    to: nowhere
```

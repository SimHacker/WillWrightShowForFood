---
title: The Founders
synonyms:
  - founders
definition: The three founders of Sun Microsystems, Inc., demonstrating Scalable Picture Architecture.
source: doc/demos/founders.st0
---

```yaml target
# founders.small — ScaledRaster of founders.im8 at 120².
# Same three PopupTargets on every size. ClientEnter lifts the head;
# press the picture (not a path) to pop all three.
# Harvested from founder.{larry,moe,curly}.tn0: { PopX PopY PopScale }.
# We clip the applied picture. The NeWS .cc cache stays in the archive.
picture: founders.small
shapes:
  - shape: founder.larry   # {  0    .1   2 }  pop only — no destination
  - shape: founder.moe     # { -.02  .13  2 }
  - shape: founder.curly   # { -.05  .1   2 }
```

```yaml target
# founders.medium — 200². Same paths, same pop, bigger raster.
picture: founders.medium
shapes:
  - shape: founder.larry
  - shape: founder.moe
  - shape: founder.curly
```

```yaml target
# founders.big — 320². SPA: one geometry, three renderings.
picture: founders.big
shapes:
  - shape: founder.larry
  - shape: founder.moe
  - shape: founder.curly
```

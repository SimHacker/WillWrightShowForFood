---
title: Walking
synonyms:
  - inchworm
  - walk cycle
  - automatic transformations
definition: "An inchworm with three poses in a loop. One edge of the loop carries a step forward, so dragging the hump walks it across the screen."
---

An inchworm has three poses: lying flat, humped with its tail pulled up behind, and reaching forward with its head. They're joined in a loop of edges: flat to humped, humped to reaching, reaching back to flat.

The trick is on the last edge. Going from reaching to flat, the flat pose is **shifted one stride forward**. Tom calls this an **automatic transformation**: each edge can carry one, and walking the edge backwards undoes it.

Drag the hump to the right. The worm humps, reaches, lies flat a stride further on, and does it again as long as you keep dragging. Drag left and it backs up.

```ecg
title: An inchworm
examples:
  - id: flat
    points: [[0, 0], [2.5, 0], [5, 0], [7.5, 0], [10, 0]]
  - id: humped
    points: [[6, 0], [7, 2], [8, 3.5], [9, 2], [10, 0]]
  - id: reaching
    points: [[6, 0], [8, 2.5], [10, 3], [12, 2], [14, 0.5]]
zones:
  - [flat, humped]
  - [humped, reaching]
  - [reaching, flat]
edges:
  - { from: reaching, to: flat, translate: [6, 0] }
strokes: [[0, 1, 2, 3, 4]]
decor:
  - { line: [-4, 0, 44, 0] }
view: [-3, -3, 44, 14]
```

Only the hump (the middle point) moves steadily forward in every pose, so it's the handle that walks. The head stands still while the tail catches up, and the tail stands still while the head reaches. Drag those and see.

In the panel, the dashed edge is the one carrying the stride. The state goes round the loop once per step.

Next: ~Tumbling~

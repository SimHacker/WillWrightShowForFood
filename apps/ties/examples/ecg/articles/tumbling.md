---
title: Tumbling
synonyms:
  - rotation
  - linearized configuration map
definition: "A box with three tilts, and an edge that sets it down one box-width along with its corners renamed. Push it and it rolls."
---

The same trick, rolling instead of crawling. A box has three poses: sitting flat, tilted 30° up onto its bottom-right corner, and tilted 60°. Past 60° it lands flat again, one box-width along.

But it lands on its side: the corner it pivoted on is now bottom-left, and the next roll has to pivot on the corner that was top-right. So the edge from 60° back to flat carries "one box-width right, **and rename the corners**". Renaming points is a linear map on the drawing like any other, so an edge can carry it, and walking the edge backwards renames them back.

Push the box to the right by a top corner. The bottom-right corner is the pivot, so it can't push this roll; after the roll, a different corner is the pivot. Push it left and it rolls back.

```ecg
title: A box that rolls
examples:
  - id: flat
    points: [[0, 0], [1, 0], [1, 1], [0, 1]]
  - id: tilt30
    label: "30°"
    points: [[0.134, 0.5], [1, 0], [1.5, 0.866], [0.634, 1.366]]
  - id: tilt60
    label: "60°"
    points: [[0.5, 0.866], [1, 0], [1.866, 0.5], [1.366, 1.366]]
zones:
  - [flat, tilt30]
  - [tilt30, tilt60]
  - [tilt60, flat]
edges:
  - { from: tilt60, to: flat, translate: [1, 0], permute: [3, 0, 1, 2] }
strokes:
  - { path: [0, 1, 2, 3], closed: true }
decor:
  - { line: [-2, 0, 9, 0] }
view: [-1.5, -0.6, 10, 4]
```

Look closely mid-roll: the box shrinks a little. Each pose is placed once when the state enters a zone, and then the placed poses are blended linearly, so a corner cuts across the chord of its arc instead of following it. That's Tom's **linearized configuration map**. It costs a little accuracy and keeps the drag a small linear solve. More poses make the chords shorter.

Next: ~Feel~

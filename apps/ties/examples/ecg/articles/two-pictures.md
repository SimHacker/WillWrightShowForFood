---
title: Two Pictures
synonyms:
  - blend two pictures
definition: "Two examples of a mouth. Every in-between is a blend: so much frown, so much smile."
---

Two drawings of a mouth with the same three points: a frown and a smile. Any mix of the two is a mouth too. The mix is two **weights** that add up to 1, and the drawing is each point at its weighted average.

Click **frown** and **smile** in the panel to drive the blend. Then grab a corner of the mouth and pull it up or down. The engine finds the weights that bring the corner closest to your cursor; the other two points come along.

Two examples make a line segment of blends. Pull past either end and the mouth stops there: there's no blend beyond 100% smile.

```ecg
title: A mouth, two ways
examples:
  - id: frown
    points: { left: [-20, -8], middle: [0, 2], right: [20, -8] }
  - id: smile
    points: { left: [-22, 6], middle: [0, -8], right: [22, 6] }
strokes: [[left, middle, right]]
decor:
  - { circle: [0, 0, 34] }
  - { circle: [-12, 14, 3] }
  - { circle: [12, 14, 3] }
view: [-40, -40, 80, 80]
ghosts: all
```

The readout says **J is 2×1, tall**: you asked for two numbers (the corner's x and y) and there's one free number (how much smile). You can't always get both, so the solver gets as close as it can.

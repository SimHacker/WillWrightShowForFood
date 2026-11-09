---
title: Colour
synonyms:
  - color
  - blending things that aren't points
  - oklab
definition: "A paint blob with three examples: a red square, a yellow diamond, a blue pillar. The same weights blend the shape and the colour."
---

Anything you can add up and scale can ride along on the same weights as the points. Here each example has a colour as well as a shape: a red square, a yellow diamond, a blue pillar. Drag a corner and the blob changes shape and colour together, because it's one blend.

```ecg
title: A paint blob
examples:
  - id: red
    points: [[-10, -10], [10, -10], [10, 10], [-10, 10]]
    fill: "#e63946"
  - id: yellow
    points: [[0, -15], [15, 0], [0, 15], [-15, 0]]
    fill: "#ffd23f"
  - id: blue
    points: [[-6, -17], [6, -17], [6, 17], [-6, 17]]
    fill: "#3a86ff"
strokes:
  - { path: [0, 1, 2, 3], fill: true }
view: [-24, -24, 48, 48]
```

Drag halfway between red and blue, then switch **blend in** from OKLab to raw sRGB. Averaging raw sRGB numbers sags darker in the middle: perceived lightness 0.61 at red and 0.64 at blue, but 0.57 halfway, against 0.63 in OKLab. Equal steps in sRGB aren't equal steps to your eye. OKLab (Björn Ottosson, 2020) is built so they are. Same weights, same simplex; only the space the colour numbers live in changes.

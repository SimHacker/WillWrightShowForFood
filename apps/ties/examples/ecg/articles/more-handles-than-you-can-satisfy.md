---
title: More Handles Than You Can Satisfy
synonyms:
  - more than one handle
  - pins
definition: "A face with seven points and four expressions. Hold two points, or pin some, and the solver compromises."
---

A face: three points of mouth, two of each brow, four expressions blended in one tetrahedron.

Grab a mouth corner and pull it up: the face smiles, and the brows lift too, because in these examples they move with the mouth. Grab a brow and push it down: the face frowns.

```ecg
title: A face, four expressions
examples:
  - id: neutral
    points: { ml: [-16, -18], mm: [0, -18], mr: [16, -18], lo: [-24, 20], li: [-8, 20], ri: [8, 20], ro: [24, 20] }
  - id: smile
    points: { ml: [-22, -11], mm: [0, -25], mr: [22, -11], lo: [-24, 22], li: [-8, 23], ri: [8, 23], ro: [24, 22] }
  - id: surprise
    points: { ml: [-7, -20], mm: [0, -30], mr: [7, -20], lo: [-24, 27], li: [-8, 30], ri: [8, 30], ro: [24, 27] }
  - id: frown
    points: { ml: [-17, -25], mm: [0, -16], mr: [17, -25], lo: [-24, 22], li: [-8, 16], ri: [8, 16], ro: [24, 22] }
strokes: [[ml, mm, mr], [lo, li], [ri, ro]]
decor:
  - { circle: [0, 0, 40] }
  - { circle: [-14, 8, 3.5] }
  - { circle: [14, 8, 3.5] }
view: [-46, -46, 92, 92]
ghosts: none
```

Now **shift-click** both inner brow points to pin them, and pull the mouth again. Each pin adds two rows to J; with three handles **J is 6×3, tall**, and the solver splits the difference. Pull the mouth into a big smile with the brows pinned low and you get something sly that isn't any of the four examples.

On a touch screen, drag two points at once with two fingers. It's the same stacking.

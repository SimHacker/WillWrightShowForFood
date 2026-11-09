---
title: A Triangle of Pictures
synonyms:
  - three pictures and a triangle
  - hitting walls
  - walls
definition: "One point in three examples. Inside the triangle it follows the cursor exactly; past an edge it slides along the wall."
---

One point, at a different place in each of three examples A, B and C. Three examples make a triangle of blends, and the point's three positions happen to draw that triangle on screen.

Drag the point. Inside the triangle it follows the cursor exactly: **J is 2×2, square**, one exact answer, and the weights are the cursor's barycentric coordinates.

```ecg
title: One point, three examples
examples:
  - { id: A, points: [[0, 0]] }
  - { id: B, points: [[10, 0]] }
  - { id: C, points: [[0, 10]] }
```

Try: drag to (2, 3) and read the weights: 0.5, 0.2, 0.3.

Now drag out past an edge. A weight would have to go below zero ("less than none of B"), so the engine pins it at zero and the state **slides along the wall**. The crosshair is where you asked for; the point is the nearest blend. Keep going past a corner and everything stops at that one example.

Next: ~More Examples Than You Need~

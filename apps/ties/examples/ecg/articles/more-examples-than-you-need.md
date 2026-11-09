---
title: More Examples Than You Need
synonyms:
  - many answers
  - tetrahedron
definition: "Four examples for one point. Many blends put it in the same place; the solver picks the smallest change."
---

Add a fourth example, D. Four examples make a tetrahedron of blends, but the point still lives on a flat screen, so many different blends put it in the same place.

Drag it. **J is 2×3, wide**: two numbers asked for, three free. The solver picks the answer that changes the weights least, so the state stays near where it was. Watch the weights: dragging the same path from A and from D gives the same point and different blends.

```ecg
title: One point, four examples
examples:
  - { id: A, points: [[0, 0]] }
  - { id: B, points: [[10, 0]] }
  - { id: C, points: [[0, 10]] }
  - { id: D, points: [[10, 10]] }
```

The free choices left over are the **null space**: weight changes that don't move the point. A later step spends them on something useful.

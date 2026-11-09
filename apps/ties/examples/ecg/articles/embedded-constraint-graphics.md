---
title: Embedded Constraint Graphics
synonyms:
  - "!home"
  - home
  - ecg
definition: "Tom Ngo's technique from Interval Research (1996): draw a few examples, then drag the drawing itself and let the engine solve for the blend."
---

Tom Ngo's **Embedded Constraint Graphics** (Interval Research, 1996, patent US5933150, expired 2016). You draw a few examples of a picture. Each example sits at a corner of a simplex: two examples span a line, three a triangle, four a tetrahedron, and n+1 examples an n-dimensional simplex. A point in the simplex is a blend, given by weights that are never negative and add up to 1.

Then you **drag the picture itself**. The engine works out which blend puts the part you're holding under your cursor. You never see the simplex in the original; here it's on screen, with every number the solver uses, so you can watch it think.

These are the worked examples from the engine's tests.

## One point, three examples

A single point, at a different place in each of three examples. Drag it. Inside the triangle of its three positions, it follows the cursor exactly: the weights are the cursor's barycentric coordinates, run backwards. Drag past an edge and the state slides along that edge instead of leaving the triangle. The crosshair is where you asked for; the point is the nearest blend.

```ecg
title: One point, three examples
examples:
  - { id: A, points: [[0, 0]] }
  - { id: B, points: [[10, 0]] }
  - { id: C, points: [[0, 10]] }
```

Try: drag to (2, 3) and read the weights, 0.5, 0.2, 0.3. Drag far past C and everything stops at C.

## One point, four examples

The same point with a fourth example. Now there are many blends that put the point where you want it, and the solver picks the one that changes the weights least. The Jacobian readout says **wide**.

```ecg
title: One point, four examples
examples:
  - { id: A, points: [[0, 0]] }
  - { id: B, points: [[10, 0]] }
  - { id: C, points: [[0, 10]] }
  - { id: D, points: [[10, 10]] }
```

## A face, four expressions

Five points: three for the mouth, two for the brow. Four examples blended in one tetrahedron. Grab a mouth corner and pull it up into a smile; the brow comes along, because in these examples it moves with the mouth. Shift-click the brow to pin it, then pull the mouth again. With two or more fingers on a touch screen, drag two points at once.

```ecg
title: A face, four expressions
strokes: [[0, 1, 2], [3, 4]]
examples:
  - id: neutral
    points: [[-20, -10], [0, -10], [20, -10], [-15, 30], [15, 30]]
  - id: smile
    points: [[-26, -4], [0, -16], [26, -4], [-15, 32], [15, 32]]
  - id: surprise
    points: [[-10, -14], [0, -26], [10, -14], [-15, 42], [15, 42]]
  - id: frown
    points: [[-20, -18], [0, -10], [20, -18], [-13, 26], [13, 26]]
```

## What's next

Gluing several simplices together at shared faces, so the state can walk from one zone of examples into the next, is the next lesson. After it: Golan Levin's Mouther (1995), a talking face of ten mouth shapes, rebuilt on this engine.

The engine, the course and the design: [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg). The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

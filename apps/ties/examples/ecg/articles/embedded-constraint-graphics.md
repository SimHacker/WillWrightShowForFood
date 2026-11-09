---
title: Embedded Constraint Graphics
synonyms:
  - "!home"
  - home
  - ecg
definition: "Tom Ngo's technique from Interval Research (1996): draw a few examples, then drag the drawing itself and let the engine solve for the blend."
---

Tom Ngo's **Embedded Constraint Graphics** (Interval Research, 1996, patent US5933150, expired 2016). You draw a few examples of a picture. Then you **drag the picture itself**, and the engine works out which blend of your examples puts the part you're holding under your cursor.

You never see the machinery in Tom's original. Here every demo shows it beside the drawing: the weights, the simplex, the shape of the matrix the solver inverts. Each step adds one idea to the one before.

1. ~Two Pictures~ — a mouth, a frown and a smile
2. ~A Triangle of Pictures~ — one point, three examples, and the walls
3. ~More Examples Than You Need~ — four examples for one point
4. ~More Handles Than You Can Satisfy~ — a face; pin the brows, pull the mouth
5. ~Gluing Triangles Together~ — two zones, and the state walks between them
6. ~A Fork in the Complex~ — three zones on one edge: which way?
7. ~Walking~ — an inchworm that keeps going
8. ~Tumbling~ — a box that rolls over
9. ~Feel~ — rubber, clay, puppet
10. ~Colour~ — blending things that aren't points
11. ~Motion, Skeleton, Skin~ — one performance, two characters

Next on this road: Golan Levin's Mouther (1995), a talking face of ten mouth shapes, rebuilt on this engine.

The engine, with a worked test for every step: [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg). The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

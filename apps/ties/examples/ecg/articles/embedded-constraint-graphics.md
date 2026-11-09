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

1. ~Tour: Two Pictures~ — a mouth, a frown and a smile
2. ~Tour: A Triangle of Pictures~ — one point, three examples, and the walls
3. ~Tour: More Examples Than You Need~ — four examples for one point
4. ~Tour: More Handles Than You Can Satisfy~ — a face; pin the brows, pull the mouth
5. ~Tour: Gluing Triangles Together~ — two zones, and the state walks between them
6. ~Tour: A Fork in the Complex~ — three zones on one edge: which way?
7. ~Tour: Walking~ — an inchworm that keeps going
8. ~Tour: Tumbling~ — a box that rolls over
9. ~Tour: Feel~ — rubber, clay, puppet
10. ~Tour: Colour~ — blending things that aren't points
11. ~Tour: Motion, Skeleton, Skin~ — one performance, two characters
12. ~Tour: Mouther~ — a face that talks, after Golan Levin's Mouther (1995)

All of it on one scrolling page: ~ECG: The Whole Story~.

The engine, with a worked test for every step: [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg). The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

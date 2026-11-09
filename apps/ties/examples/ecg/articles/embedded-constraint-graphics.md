---
title: Embedded Constraint Graphics
synonyms:
  - "!home"
  - home
  - ecg
definition: "Tom Ngo's technique from Interval Research (1996): draw a few examples, then drag the drawing itself and let the engine solve for the blend."
---

Tom Ngo's **Embedded Constraint Graphics** (Interval Research, 1996, patent US5933150, expired 2016). You draw a few examples of a picture. Then you **drag the picture itself**, and the engine works out which blend of your examples puts the part you're holding under your cursor.

You never see the machinery in Tom's original. Here every demo shows it beside the drawing: the weights, the map of the state space, the shape of the matrix the solver inverts.

The whole idea, in one face:

- ~Tour: Mouther~ — a face that talks, listens and lets you pull, after Golan Levin's Mouther (1995)

How it works, one idea at a time:

- ~Tour: Two Pictures~ — a mouth, a frown and a smile
- ~Tour: A Triangle of Pictures~ — one point, three examples, and the walls
- ~Tour: More Examples Than You Need~ — four examples for one point
- ~Tour: More Handles Than You Can Satisfy~ — a face; pin the brows, pull the mouth
- ~Tour: Gluing Triangles Together~ — two zones, and the state walks between them
- ~Tour: A Fork in the Complex~ — three zones on one edge: which way?
- ~Tour: Walking~ — an inchworm that keeps going
- ~Tour: Tumbling~ — a box that rolls over
- ~Tour: Feel~ — rubber, clay, puppet
- ~Tour: Colour~ — blending things that aren't points
- ~Tour: Motion, Skeleton, Skin~ — one performance, two characters

The same engine, other things:

- ~Tour: Turning a Head~ — 3D poses through a camera; steer by the nose
- ~Tour: Blendshapes~ — ARKit coefficients out of a dragged face
- ~Tour: Arranging Views~ — window layouts that follow a resize

All of it on one scrolling page, with how it could live in Godot, Blender, Illustrator, D3 and D2, and what it has in common with how language models blend ideas: ~ECG: The Whole Story~.

The engine, MIT licensed, with a worked test for every step: [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg). The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

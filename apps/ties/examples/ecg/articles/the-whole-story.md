---
title: "ECG: The Whole Story"
synonyms:
  - the whole story
  - ecg on one page
  - play
definition: "Embedded Constraint Graphics, every demo live on one page: a face that talks first, then how it works, from two pictures up."
---

Tom Ngo's **Embedded Constraint Graphics** (Interval Research, 1996, patent US5933150, expired 2016). You draw a few examples of a picture. Then you **drag the picture itself**, and the engine works out which blend of your examples puts the part you're holding under your cursor.

The whole idea first: a face that talks, listens, and lets you pull its lips. Then it comes apart, one idea at a time, from two pictures up.

Every demo is live. Beside each drawing is the machinery Tom's editor kept hidden: the weights, the map of the state space, the shape of the matrix the solver inverts. Drag the drawing, the dot on the map, or a weight bar.

## Mouther

```transclude
article: "Mouther"
```

## How it works

Everything Mouther does, built up from nothing.

## Two Pictures

```transclude
article: "Two Pictures"
```

## A Triangle of Pictures

```transclude
article: "A Triangle of Pictures"
```

## More Examples Than You Need

```transclude
article: "More Examples Than You Need"
```

## More Handles Than You Can Satisfy

```transclude
article: "More Handles Than You Can Satisfy"
```

## Gluing Triangles Together

```transclude
article: "Gluing Triangles Together"
```

## A Fork in the Complex

```transclude
article: "A Fork in the Complex"
```

## Walking

```transclude
article: "Walking"
```

## Tumbling

```transclude
article: "Tumbling"
```

## Feel

```transclude
article: "Feel"
```

## Colour

```transclude
article: "Colour"
```

## Motion, Skeleton, Skin

```transclude
article: "Motion, Skeleton, Skin"
```

## Where it comes from

The engine is [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg), MIT licensed, with a worked test for every step. It blends any list of numbers, so the same engine drives 2D drawings or a 3D face's blendshape coefficients. Blending authored poses to drive a character also runs through Ken Perlin's **Improv** (with Athomas Goldberg, NYU Media Research Lab, [SIGGRAPH 96](https://mrl.nyu.edu/projects/improv/)), which inspired Don Hopkins's character animation system for The Sims 1.

Next for the engine: a body. Sim-Heinz Lemke at the PDP-7, drawing on the Type 340 display with a light pen, his poses blended by ECG so the pen tip lands where the demo needs it ([the portrait design](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PORTRAIT.md#ecg-drives-the-body)).

The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

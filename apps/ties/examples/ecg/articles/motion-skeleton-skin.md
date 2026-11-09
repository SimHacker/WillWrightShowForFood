---
title: Motion, Skeleton, Skin
synonyms:
  - paste
  - clip motion
definition: "A person and a cat drawn with the same four expressions. Drag either and both make the face; record a performance and play it back on both."
---

Tom splits an animation into three parts you can swap:

- the **clip motion**: how the state moves over time, a path through the simplices
- the **graphic skeleton**: one character's examples, turning a state into points
- the **graphic skin**: how the points are drawn

A person and a cat, drawn separately, with the same four expressions under the same names. Their points have nothing in common: the cat has ears and no brows. But they share a state space, so one state drives both. Drag either one.

Pull the cat's ears up and the person looks surprised, though the person has no ears. The cat's ears and the person's brows are different ways of saying the same thing, and the state is the thing they say.

So one state can drive any number of characters, each with its own way of showing it. A dog drops its ears where a cat flattens them; a bird puffs its feathers. Add an expression called *lie*, and Pinocchio's nose grows while Nixon's jowls give the tell.

Then press **Record**, perform something on the person, press **Stop** and **Play**. The motion is only weights over time, so it plays on the cat too.

```ecg
title: Same face, two characters
zones:
  - [neutral, smile, surprise]
  - [neutral, surprise, frown]
layout: { smile: [-1, 0], neutral: [0, -1], surprise: [0, 1], frown: [1, 0] }
view: [-56, -50, 112, 112]
ghosts: none
record: true
characters:
  - name: person
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
  - name: cat
    examples:
      - id: neutral
        points: { elo: [-36, 22], elt: [-32, 52], eli: [-14, 36], eri: [14, 36], ert: [32, 52], ero: [36, 22], ml: [-10, -14], mm: [0, -10], mr: [10, -14] }
      - id: smile
        points: { elo: [-36, 22], elt: [-30, 56], eli: [-14, 36], eri: [14, 36], ert: [30, 56], ero: [36, 22], ml: [-14, -9], mm: [0, -16], mr: [14, -9] }
      - id: surprise
        points: { elo: [-36, 22], elt: [-26, 63], eli: [-14, 36], eri: [14, 36], ert: [26, 63], ero: [36, 22], ml: [-5, -16], mm: [0, -23], mr: [5, -16] }
      - id: frown
        points: { elo: [-36, 22], elt: [-52, 34], eli: [-14, 36], eri: [14, 36], ert: [52, 34], ero: [36, 22], ml: [-10, -21], mm: [0, -12], mr: [10, -21] }
    strokes: [[elo, elt, eli], [eri, ert, ero], [ml, mm, mr]]
    decor:
      - { circle: [0, 0, 38] }
      - { circle: [-13, 8, 4] }
      - { circle: [13, 8, 4] }
      - { line: [-30, -6, -50, -2] }
      - { line: [30, -6, 50, -2] }
```

This is how Mouther works: the voice drives the state, and the face is a skin.

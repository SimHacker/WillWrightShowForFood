---
title: A Fork in the Complex
synonyms:
  - zone chooser
  - chooser
definition: "A kite and its tail, with three zones glued to one edge. When the state reaches the edge, which zone should it enter?"
---

A kite and its tail. Examples A and B hold the kite low on either side; C flies it high; D and E are two different ways to dive, with the tail swinging differently. Three zones share the edge AB: ABC above, ABD and ABE below.

Start at C and drag the kite straight down past AB. Both ABD and ABE can put the kite under your cursor, so the engine has to pick one. Tom suggested two rules, and the chooser offers both:

- **least state movement**: the zone where the weights change least for this drag
- **least movement of unheld points**: the zone where the points you aren't holding (here, the tail) move least

Drag down with one rule, press Reset, switch the rule, and drag down again. The readout shows each candidate's score.

```ecg
title: A kite at a fork
examples:
  - { id: A, points: { kite: [0, 0], tail: [-2, -4] } }
  - { id: B, points: { kite: [10, 0], tail: [12, -4] } }
  - { id: C, points: { kite: [5, 10], tail: [5, 6] } }
  - { id: D, points: { kite: [5, -10], tail: [5, -8] } }
  - { id: E, points: { kite: [5, -20], tail: [15, -24] } }
zones:
  - [A, B, C]
  - [A, B, D]
  - [A, B, E]
layout: { A: [-1, 0], B: [1, 0], C: [0, 1], D: [0, -1], E: [0, -2] }
start: C
strokes: [[kite, tail]]
knobs: [chooser]
view: [-12, -28, 40, 40]
```

Neither rule is always right. That's why it's a knob.

Next: ~Walking~

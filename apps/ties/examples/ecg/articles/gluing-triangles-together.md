---
title: Gluing Triangles Together
synonyms:
  - complex
  - zones
  - via point
definition: "The same face, split into two triangles that share an edge. The state walks from one into the other without a bump."
---

One big simplex blends everything with everything, which is rarely what an artist wants: a frown mixed with a smile is mush. So Tom glues small simplices, **zones**, along shared faces. Here the face has two zones that share the edge neutral–surprise:

- neutral, smile, surprise
- neutral, surprise, frown

In the panel, the current zone is shaded. Start at smile and drag the mouth's middle up into a frown. The state runs into the boundary between the zones, steps across at exactly the blend it reached (Tom's **via point**: the shared examples keep their proportions, the new one starts at zero), and keeps going. The face never jumps, and it never passes through a smile-frown blend, because no zone contains both.

```ecg
title: Two zones
examples:
  - id: neutral
    points: { ml: [-16, -18], mm: [0, -18], mr: [16, -18], lo: [-24, 20], li: [-8, 20], ri: [8, 20], ro: [24, 20] }
  - id: smile
    points: { ml: [-22, -11], mm: [0, -25], mr: [22, -11], lo: [-24, 22], li: [-8, 23], ri: [8, 23], ro: [24, 22] }
  - id: surprise
    points: { ml: [-7, -20], mm: [0, -30], mr: [7, -20], lo: [-24, 27], li: [-8, 30], ri: [8, 30], ro: [24, 27] }
  - id: frown
    points: { ml: [-17, -25], mm: [0, -16], mr: [17, -25], lo: [-24, 22], li: [-8, 16], ri: [8, 16], ro: [24, 22] }
zones:
  - [neutral, smile, surprise]
  - [neutral, surprise, frown]
layout: { smile: [-1, 0], neutral: [0, -1], surprise: [0, 1], frown: [1, 0] }
start: smile
strokes: [[ml, mm, mr], [lo, li], [ri, ro]]
decor:
  - { circle: [0, 0, 40] }
  - { circle: [-14, 8, 3.5] }
  - { circle: [14, 8, 3.5] }
view: [-46, -46, 92, 92]
ghosts: none
```

Under the panel, the readout names each crossing: which zone it left, which it entered, and through which face. Drag the mouth's middle straight up and it crosses at neutral itself: a face can be a single shared example, not only a whole edge.

Next: ~A Fork in the Complex~

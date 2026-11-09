---
title: Mouther
synonyms:
  - mouther stand-in
  - talking face
definition: "A talking cartoon face with ten mouth shapes and twelve expressions, after Golan Levin's Mouther (1995). It says what you type, listens to your voice, pulls faces, and you can grab its lips and pull."
---

Golan Levin's **Mouther** (Interval Research, 1995, with Malcolm Slaney and Tom Ngo) listened to your voice and drove a cartoon face through the sounds you made, in real time. The face was built with Tom Ngo's Embedded Constraint Graphics: ten drawings of a mouth, and an engine that blends between them.

This face is a stand-in with its own cartoons. Ten mouths, M, OO, R, OH, UH, L, AY, EE, F and S, each a few numbers (how wide, how open, how round, how much teeth and tongue) turned into twenty points.

Four ways to move it, all moving the same weights:

- **Pull a face.** Smile, grin, laugh, smirk, sad, cry, angry, disgust, surprise, kiss, raspberry, yawn. Each is one more drawing of the same twenty points. From any mouth it eases back through M and out to the face.
- **Say.** Type something and press Say. It speaks, and the mouth follows the letters, re-syncing on every word.
- **Listen.** Press Listen and talk. Loudness opens the mouth; how bright the sound is picks the shape, dark OO and R to bright EE and S. Your voice drags the dot on the map.
- **Pull.** Grab the lips, teeth or brows and drag. The engine finds the blend of mouths that puts the point under your finger, and switches between them as you go. Or drag the dot on the map, or one weight bar.

```ecg
title: Mouther, a stand-in
examples:
  - id: M
    points: [[-14, -17], [-6.3, -17.12], [0, -17.58], [6.3, -17.12], [14, -17], [7, -18.21], [0, -18.6], [-7, -18.21], [-5.88, -18.51], [5.88, -18.51], [4.12, -18.51], [-4.12, -18.51], [-7.7, -17.59], [7.7, -17.59], [7.7, -17.59], [-7.7, -17.59], [-30, 26], [-12, 28], [12, 28], [30, 26]]
  - id: OO
    points: [[-6, -19], [-4.8, -13.4], [0, -13], [4.8, -13.4], [6, -19], [4.8, -24.3], [0, -24], [-4.8, -24.3], [-2.52, -23.1], [2.52, -23.1], [1.76, -23.1], [-1.76, -23.1], [-1.98, -14.6], [1.98, -14.6], [1.98, -14.6], [-1.98, -14.6], [-30, 32], [-12, 32], [12, 32], [30, 32]]
  - id: R
    points: [[-9, -18], [-6.57, -12.24], [0, -12.36], [6.57, -12.24], [9, -18], [6.66, -24.79], [0, -25], [-6.66, -24.79], [-3.78, -23.95], [3.78, -23.95], [2.65, -22.39], [-2.65, -22.39], [-3.37, -13.92], [3.37, -13.92], [3.37, -16.08], [-3.37, -16.08], [-30, 27], [-12, 31], [12, 31], [30, 27]]
  - id: OH
    points: [[-10, -19], [-8, -8.4], [0, -8], [8, -8.4], [10, -19], [8, -31.3], [0, -31], [-8, -31.3], [-4.2, -29.05], [4.2, -29.05], [2.94, -24.91], [-2.94, -24.91], [-3.3, -11.2], [3.3, -11.2], [3.3, -11.2], [-3.3, -11.2], [-30, 33], [-12, 35], [12, 35], [30, 33]]
  - id: UH
    points: [[-14, -20], [-8.26, -14.4], [0, -13.9], [8.26, -14.4], [14, -20], [8.68, -27.7], [0, -28], [-8.68, -27.7], [-5.88, -26.5], [5.88, -26.5], [4.12, -23.8], [-4.12, -23.8], [-6.47, -14.6], [6.47, -14.6], [6.47, -16.4], [-6.47, -16.4], [-30, 24], [-12, 30], [12, 30], [30, 24]]
  - id: L
    points: [[-15, -17], [-8.33, -10.72], [0, -11.68], [8.33, -10.72], [15, -17], [8.85, -27.54], [0, -29], [-8.85, -27.54], [-6.3, -27.35], [6.3, -27.35], [4.41, -15.95], [-4.41, -15.95], [-7.26, -12.56], [7.26, -12.56], [7.26, -15.08], [-7.26, -15.08], [-30, 29], [-12, 31], [12, 31], [30, 29]]
  - id: AY
    points: [[-18, -16], [-9.99, -8.6], [0, -10.1], [9.99, -8.6], [18, -16], [10.62, -32.62], [0, -35], [-10.62, -32.62], [-7.56, -32.45], [7.56, -32.45], [5.29, -26.78], [-5.29, -26.78], [-8.71, -11.2], [8.71, -11.2], [8.71, -14.08], [-8.71, -14.08], [-30, 30], [-12, 34], [12, 34], [30, 30]]
  - id: EE
    points: [[-23, -12], [-10.35, -12.4], [0, -15.2], [10.35, -12.4], [23, -12], [11.5, -21.3], [0, -24], [-11.5, -21.3], [-9.66, -23.1], [9.66, -23.1], [6.76, -23.1], [-6.76, -23.1], [-12.65, -15.28], [12.65, -15.28], [12.65, -18.88], [-12.65, -18.88], [-30, 29], [-12, 29], [12, 29], [30, 29]]
  - id: F
    points: [[-17, -18], [-7.65, -14.8], [0, -15.2], [7.65, -14.8], [17, -18], [8.5, -18.85], [0, -19], [-8.5, -18.85], [-7.14, -18.85], [7.14, -18.85], [5, -18.85], [-5, -18.85], [-9.35, -15.28], [9.35, -15.28], [9.35, -19.11], [-9.35, -19.11], [-30, 29], [-12, 27], [12, 27], [30, 29]]
  - id: S
    points: [[-19, -15], [-8.55, -14.4], [0, -15.9], [8.55, -14.4], [19, -15], [9.5, -19.65], [0, -21], [-9.5, -19.65], [-7.98, -20.55], [7.98, -20.55], [5.59, -20.55], [-5.59, -20.55], [-10.45, -15.96], [10.45, -15.96], [10.45, -18.66], [-10.45, -18.66], [-30, 27], [-12, 29], [12, 29], [30, 27]]
  - id: smile
    points: [[-20, -11], [-9, -14.4], [0, -17.3], [9, -14.4], [20, -11], [10, -19.3], [0, -22], [-10, -19.3], [-8.4, -21.4], [8.4, -21.4], [5.88, -21.4], [-5.88, -21.4], [-11, -17.32], [11, -17.32], [11, -18], [-11, -18], [-30, 29], [-12, 31], [12, 31], [30, 29]]
  - id: grin
    points: [[-24, -10], [-10.8, -10.8], [0, -14.5], [10.8, -10.8], [24, -10], [12, -23.25], [0, -27], [-12, -23.25], [-10.08, -25.65], [10.08, -25.65], [7.06, -25.65], [-7.06, -25.65], [-13.2, -14.6], [13.2, -14.6], [13.2, -19.28], [-13.2, -19.28], [-30, 30], [-12, 32], [12, 32], [30, 30]]
  - id: laugh
    points: [[-22, -12], [-12.21, -7], [0, -10.1], [12.21, -7], [22, -12], [12.98, -34.1], [0, -38], [-12.98, -34.1], [-9.24, -35], [9.24, -35], [6.47, -26], [-6.47, -26], [-10.65, -11.2], [10.65, -11.2], [10.65, -14.44], [-10.65, -14.44], [-30, 35], [-12, 35], [12, 35], [30, 35]]
  - id: surprise
    points: [[-10, -18], [-8, -7], [0, -7], [8, -7], [10, -18], [8, -32], [0, -32], [-8, -32], [-4.2, -29.9], [4.2, -29.9], [2.94, -26.9], [-2.94, -26.9], [-3.3, -10.52], [3.3, -10.52], [3.3, -10.52], [-3.3, -10.52], [-30, 37], [-12, 39], [12, 39], [30, 37]]
  - id: yawn
    points: [[-13, -19], [-9.95, -6.64], [0, -6.36], [9.95, -6.64], [13, -19], [10.01, -37.02], [0, -37], [-10.01, -37.02], [-5.46, -34.15], [5.46, -34.15], [3.82, -26.71], [-3.82, -26.71], [-4.58, -9.84], [4.58, -9.84], [4.58, -9.84], [-4.58, -9.84], [-30, 20], [-12, 28], [12, 28], [30, 20]]
  - id: kiss
    points: [[-4, -18], [-3.2, -15.5], [0, -15.5], [3.2, -15.5], [4, -18], [3.2, -20.5], [0, -20.5], [-3.2, -20.5], [-1.68, -20.12], [1.68, -20.12], [1.18, -20.12], [-1.18, -20.12], [-1.32, -16.3], [1.32, -16.3], [1.32, -16.3], [-1.32, -16.3], [-30, 30], [-12, 36], [12, 36], [30, 30]]
  - id: raspberry
    points: [[-14, -19], [-7.28, -16.72], [0, -16.48], [7.28, -16.72], [14, -19], [7.84, -20.94], [0, -21], [-7.84, -20.94], [-7.7, -18.9], [7.7, -18.9], [5.39, -32.9], [-5.39, -32.9], [-7.08, -16.64], [7.08, -16.64], [7.08, -16.64], [-7.08, -16.64], [-30, 33], [-12, 31], [12, 31], [30, 33]]
  - id: smirk
    points: [[-17, -21], [-7.65, -18.4], [0, -17.3], [7.65, -14.4], [17, -11], [8.5, -17.6], [0, -20], [-8.5, -20.6], [-7.14, -19.7], [7.14, -19.7], [5, -19.7], [-5, -19.7], [-9.35, -17.32], [9.35, -17.32], [9.35, -17.59], [-9.35, -17.59], [-30, 32], [-12, 34], [12, 26], [30, 24]]
  - id: disgust
    points: [[-16, -18], [-7.2, -14.8], [0, -15.2], [7.2, -17.2], [16, -24], [8, -21.5], [0, -20], [-8, -19.7], [-6.72, -19.7], [6.72, -19.7], [4.7, -19.7], [-4.7, -19.7], [-8.8, -15.28], [8.8, -15.28], [8.8, -17.98], [-8.8, -17.98], [-30, 25], [-12, 21], [12, 27], [30, 31]]
  - id: angry
    points: [[-16, -21], [-7.2, -16.8], [0, -15.9], [7.2, -16.8], [16, -21], [8, -22.3], [0, -22], [-8, -22.3], [-6.72, -21.4], [6.72, -21.4], [4.7, -21.4], [-4.7, -21.4], [-8.8, -15.96], [8.8, -15.96], [8.8, -21], [-8.8, -21], [-30, 29], [-12, 19], [12, 19], [30, 29]]
  - id: cry
    points: [[-18, -26], [-10.62, -14.16], [0, -11.44], [10.62, -14.16], [18, -26], [11.16, -33.14], [0, -32], [-11.16, -33.14], [-7.56, -29.9], [7.56, -29.9], [5.29, -27.26], [-5.29, -27.26], [-8.32, -12.56], [8.32, -12.56], [8.32, -13.64], [-8.32, -13.64], [-30, 22], [-12, 38], [12, 38], [30, 22]]
  - id: sad
    points: [[-15, -24], [-6.75, -19.6], [0, -17.3], [6.75, -19.6], [15, -24], [7.5, -20.65], [0, -19], [-7.5, -20.65], [-6.3, -18.85], [6.3, -18.85], [4.41, -18.85], [-4.41, -18.85], [-8.25, -17.32], [8.25, -17.32], [8.25, -17.32], [-8.25, -17.32], [-30, 23], [-12, 35], [12, 35], [30, 23]]
zones:
  - [M, OO, R]
  - [M, R, OH]
  - [M, OH, UH]
  - [M, UH, L]
  - [M, L, AY]
  - [M, AY, EE]
  - [M, EE, F]
  - [M, F, S]
  - [M, S, OO]
  - [M, smile, grin]
  - [M, grin, laugh]
  - [M, laugh, surprise]
  - [M, surprise, yawn]
  - [M, yawn, kiss]
  - [M, kiss, raspberry]
  - [M, raspberry, smirk]
  - [M, smirk, disgust]
  - [M, disgust, angry]
  - [M, angry, cry]
  - [M, cry, sad]
  - [M, sad, smile]
layout:
  M: [0, 0]
  OO: [0.000, 1.000]
  R: [0.643, 0.766]
  OH: [0.985, 0.174]
  UH: [0.866, -0.500]
  L: [0.342, -0.940]
  AY: [-0.342, -0.940]
  EE: [-0.866, -0.500]
  F: [-0.985, 0.174]
  S: [-0.643, 0.766]
  smile: [0.000, 1.000]
  grin: [0.500, 0.866]
  laugh: [0.866, 0.500]
  surprise: [1.000, 0.000]
  yawn: [0.866, -0.500]
  kiss: [0.500, -0.866]
  raspberry: [0.000, -1.000]
  smirk: [-0.500, -0.866]
  disgust: [-0.866, -0.500]
  angry: [-1.000, -0.000]
  cry: [-0.866, 0.500]
  sad: [-0.500, 0.866]
start: M
strokes:
  - { path: [0, 1, 2, 3, 4, 5, 6, 7], fill: "#5b0e2d", stroke: false }
  - { path: [8, 9, 10, 11], fill: "#ff6f91", stroke: false }
  - { path: [12, 13, 14, 15], fill: "#ffffff", stroke: false }
  - { path: [0, 1, 2, 3, 4, 5, 6, 7], closed: true, width: 5 }
  - { path: [16, 17], width: 6 }
  - { path: [18, 19], width: 6 }
decor:
  - { circle: [0, 2, 52], fill: "#ffd23f", width: 3 }
  - { circle: [-34, -14, 8], fill: "#ff9eb5", color: "none" }
  - { circle: [34, -14, 8], fill: "#ff9eb5", color: "none" }
  - { circle: [-19, 13, 10], fill: "#ffffff", width: 3 }
  - { circle: [19, 13, 10], fill: "#ffffff", width: 3 }
view: [-60, -58, 120, 120]
map: { size: 230, pages: down }
poses:
  - [smile, grin, laugh, smirk]
  - [sad, cry, angry, disgust]
  - [surprise, kiss, raspberry, yawn]
ghosts: none
handles: dots
say:
  text: Hello! I am Mouther. Pleased to meet you.
  rest: M
  ms: 120
  aloud: true
  letters: { a: AY, e: EE, i: EE, y: EE, o: OH, u: UH, w: OO, q: OO, r: R, s: S, z: S, c: S, x: S, j: S, t: S, d: S, n: S, k: S, g: S, h: UH, f: F, v: F, l: L, m: M, b: M, p: M }
  pairs: { th: L, oo: OO, ee: EE, ea: EE, sh: S, ch: S, ow: OH, ou: OO, ay: AY, ai: AY, er: R, ph: F }
listen: { rest: M, ring: [OO, R, OH, UH, L, AY, EE, F, S] }
eyes:
  examples:
    - { id: ahead, points: [[-19, 13], [19, 13]] }
    - { id: left, points: [[-23.8, 13], [14.2, 13]] }
    - { id: right, points: [[-14.2, 13], [23.8, 13]] }
    - { id: up, points: [[-19, 17.8], [19, 17.8]] }
    - { id: down, points: [[-19, 8.2], [19, 8.2]] }
    - { id: cross, points: [[-14.2, 13], [14.2, 13]] }
    - { id: wall, points: [[-23.8, 13], [23.8, 13]] }
  zones:
    - [ahead, left, up, cross]
    - [ahead, left, up, wall]
    - [ahead, up, right, cross]
    - [ahead, up, right, wall]
    - [ahead, right, down, cross]
    - [ahead, right, down, wall]
    - [ahead, down, left, cross]
    - [ahead, down, left, wall]
  start: ahead
  centers: [[-19, 13], [19, 13]]
  reach: 4.8
  far: 80
  near: 10
  pupil: { r: 4.5, fill: "#000000" }
```

The map is the face's state space. M, lips pressed, is in the middle; the nine sounds sit around it, dark to bright, and every triangle of M and two neighbours is a zone. A point in a triangle is a blend of three mouths. The twelve faces make a second fan around the same M. Both fans can't lie flat in one picture, so the faces get their own page, glued to the sounds at M: when the state is at rest, the dot shows on both pages, and you can grab it on either. Driving (Say, Listen) and tugging (Pull) are two ways of moving that one point.

How that works, one idea at a time, is the rest of this story, starting from ~Two Pictures~.

The mouths come from `examples/ecg/tools/mouther.py`; change a number and run it to restyle the face.

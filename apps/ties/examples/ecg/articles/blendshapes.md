---
title: Blendshapes
synonyms:
  - arkit
  - faceit
  - blend shapes
  - shape keys
  - morph targets
definition: "A face rigged with fifteen of ARKit's blendshape coefficients. Seven expressions are seven settings of the coefficients. Drag the face and the engine finds the coefficients."
---

Film and game faces are rigged with **blendshapes**: one sculpted offset of the mesh per muscle-ish movement, mixed by coefficients from 0 to 1. Apple's ARKit face tracking reports 52 of them every frame, with names like `jawOpen`, `mouthSmileLeft` and `eyeBlinkRight`, and tools such as FaceIt for Blender build those 52 on any character's mesh. Blender calls them shape keys, glTF calls them morph targets, three.js calls them morph target influences.

This face is rigged with fifteen of them. Each expression is not a drawing but a setting of the coefficients:

| Face | Coefficients |
|------|--------------|
| smile | `mouthSmileLeft` 1, `mouthSmileRight` 1, `browOuterUpLeft` 0.2, `browOuterUpRight` 0.2 |
| wink | `eyeBlinkLeft` 1, `mouthSmileLeft` 0.8, `mouthSmileRight` 0.3, `browDownLeft` 0.3 |
| skeptical | `browOuterUpRight` 1, `browDownLeft` 0.7, `mouthSmileRight` 0.4, `mouthFrownLeft` 0.3 |
| surprise | `jawOpen` 0.7, `browInnerUp` 1, `browOuterUpLeft` 1, `browOuterUpRight` 1, `eyeWideLeft` 1, `eyeWideRight` 1 |
| kiss | `mouthPucker` 1, `eyeBlinkLeft` 0.6, `eyeBlinkRight` 0.6, `browInnerUp` 0.3 |
| sad | `mouthFrownLeft` 1, `mouthFrownRight` 1, `browInnerUp` 1, `eyeBlinkLeft` 0.25, `eyeBlinkRight` 0.25 |
| angry | `browDownLeft` 1, `browDownRight` 1, `mouthFrownLeft` 0.6, `mouthFrownRight` 0.6, `eyeWideLeft` 0.4, `eyeWideRight` 0.4 |

The rig is linear: the face is the neutral face plus each offset times its coefficient. So blending the expressions' coefficients and then rigging gives exactly the face you get by blending their points. ECG can work on the points you see, and hand the rig the coefficients.

Drag a mouth corner, an eyelid or a brow. The engine finds the blend of expressions that puts it under your finger, and the bars under the weights show the fifteen coefficients that blend works out to: the numbers a game engine or Blender would get.

```ecg
title: Seven faces, fifteen coefficients
examples:
  - id: neutral
    points: { bl1: [-26.0, 21.0], bl2: [-16.0, 25.0], bl3: [-7.0, 23.0], br1: [7.0, 23.0], br2: [16.0, 25.0], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 16.0], el_u2: [-12.0, 16.0], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 16.0], er_u2: [20.0, 16.0], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 12.5], pr2: [16.0, 14.0], pr3: [17.5, 12.5], pr4: [16.0, 11.0], ml: [-15.0, -20.0], mu1: [-7.0, -18.0], mu2: [0.0, -17.5], mu3: [7.0, -18.0], mr: [15.0, -20.0], md3: [7.0, -22.0], md2: [0.0, -23.0], md1: [-7.0, -22.0] }
  - id: smile
    points: { bl1: [-26.0, 22.2], bl2: [-16.0, 25.6], bl3: [-7.0, 23.0], br1: [7.0, 23.0], br2: [16.0, 25.6], br3: [26.0, 22.2], el_o: [-24.0, 12.0], el_u1: [-20.0, 16.0], el_u2: [-12.0, 16.0], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 16.0], er_u2: [20.0, 16.0], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 12.5], pr2: [16.0, 14.0], pr3: [17.5, 12.5], pr4: [16.0, 11.0], ml: [-18.0, -13.0], mu1: [-8.0, -15.5], mu2: [0.0, -17.5], mu3: [8.0, -15.5], mr: [18.0, -13.0], md3: [8.0, -19.5], md2: [0.0, -23.0], md1: [-8.0, -19.5] }
  - id: wink
    points: { bl1: [-26.0, 21.0], bl2: [-16.0, 25.0], bl3: [-7.0, 23.0], br1: [6.4, 21.2], br2: [15.7, 24.1], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 16.0], el_u2: [-12.0, 16.0], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 9.5], er_u2: [20.0, 9.5], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 9.5], pr2: [16.0, 9.5], pr3: [17.5, 9.5], pr4: [16.0, 9.5], ml: [-15.9, -17.9], mu1: [-7.3, -17.25], mu2: [0.0, -17.5], mu3: [7.8, -16.0], mr: [17.4, -14.4], md3: [7.8, -20.0], md2: [0.0, -23.0], md1: [-7.3, -21.25] }
  - id: skeptical
    points: { bl1: [-26.0, 27.0], bl2: [-16.0, 28.0], bl3: [-7.0, 23.0], br1: [5.6, 18.8], br2: [15.3, 22.9], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 16.0], el_u2: [-12.0, 16.0], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 16.0], er_u2: [20.0, 16.0], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 12.5], pr2: [16.0, 14.0], pr3: [17.5, 12.5], pr4: [16.0, 11.0], ml: [-16.2, -17.2], mu1: [-7.4, -17.0], mu2: [0.0, -17.5], mu3: [7.0, -18.0], mr: [15.0, -21.8], md3: [7.0, -22.0], md2: [0.0, -23.0], md1: [-7.4, -21.0] }
  - id: surprise
    points: { bl1: [-26.0, 27.0], bl2: [-16.0, 30.0], bl3: [-7.0, 29.0], br1: [7.0, 29.0], br2: [16.0, 30.0], br3: [26.0, 27.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 19.0], el_u2: [-12.0, 19.0], el_i: [-8.0, 12.0], el_l2: [-12.0, 8.0], el_l1: [-20.0, 8.0], er_i: [8.0, 12.0], er_u1: [12.0, 19.0], er_u2: [20.0, 19.0], er_o: [24.0, 12.0], er_l2: [20.0, 8.0], er_l1: [12.0, 8.0], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 12.5], pr2: [16.0, 14.0], pr3: [17.5, 12.5], pr4: [16.0, 11.0], ml: [-14.3, -22.8], mu1: [-7.0, -18.0], mu2: [0.0, -17.5], mu3: [7.0, -18.0], mr: [14.3, -22.8], md3: [7.0, -29.7], md2: [0.0, -32.1], md1: [-7.0, -29.7] }
  - id: kiss
    points: { bl1: [-26.0, 21.0], bl2: [-16.0, 25.6], bl3: [-7.0, 24.8], br1: [7.0, 24.8], br2: [16.0, 25.6], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 12.1], el_u2: [-12.0, 12.1], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 12.1], er_u2: [20.0, 12.1], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 10.7], pl2: [-16.0, 11.3], pl3: [-14.5, 10.7], pl4: [-16.0, 10.1], pr1: [14.5, 10.7], pr2: [16.0, 11.3], pr3: [17.5, 10.7], pr4: [16.0, 10.1], ml: [-7.0, -20.0], mu1: [-4.0, -17.0], mu2: [0.0, -16.0], mu3: [4.0, -17.0], mr: [7.0, -20.0], md3: [4.0, -23.0], md2: [0.0, -24.5], md1: [-4.0, -23.0] }
  - id: sad
    points: { bl1: [-26.0, 21.0], bl2: [-16.0, 27.0], bl3: [-7.0, 29.0], br1: [7.0, 29.0], br2: [16.0, 27.0], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 14.38], el_u2: [-12.0, 14.38], el_i: [-8.0, 12.0], el_l2: [-12.0, 9.0], el_l1: [-20.0, 9.0], er_i: [8.0, 12.0], er_u1: [12.0, 14.38], er_u2: [20.0, 14.38], er_o: [24.0, 12.0], er_l2: [20.0, 9.0], er_l1: [12.0, 9.0], pl1: [-17.5, 11.75], pl2: [-16.0, 12.88], pl3: [-14.5, 11.75], pl4: [-16.0, 10.62], pr1: [14.5, 11.75], pr2: [16.0, 12.88], pr3: [17.5, 11.75], pr4: [16.0, 10.62], ml: [-15.0, -26.0], mu1: [-7.0, -18.0], mu2: [0.0, -17.5], mu3: [7.0, -18.0], mr: [15.0, -26.0], md3: [7.0, -22.0], md2: [0.0, -23.0], md1: [-7.0, -22.0] }
  - id: angry
    points: { bl1: [-26.0, 21.0], bl2: [-15.0, 22.0], bl3: [-5.0, 17.0], br1: [5.0, 17.0], br2: [15.0, 22.0], br3: [26.0, 21.0], el_o: [-24.0, 12.0], el_u1: [-20.0, 17.2], el_u2: [-12.0, 17.2], el_i: [-8.0, 12.0], el_l2: [-12.0, 8.6], el_l1: [-20.0, 8.6], er_i: [8.0, 12.0], er_u1: [12.0, 17.2], er_u2: [20.0, 17.2], er_o: [24.0, 12.0], er_l2: [20.0, 8.6], er_l1: [12.0, 8.6], pl1: [-17.5, 12.5], pl2: [-16.0, 14.0], pl3: [-14.5, 12.5], pl4: [-16.0, 11.0], pr1: [14.5, 12.5], pr2: [16.0, 14.0], pr3: [17.5, 12.5], pr4: [16.0, 11.0], ml: [-15.0, -23.6], mu1: [-7.0, -18.0], mu2: [0.0, -17.5], mu3: [7.0, -18.0], mr: [15.0, -23.6], md3: [7.0, -22.0], md2: [0.0, -23.0], md1: [-7.0, -22.0] }
zones:
  - [neutral, smile, wink]
  - [neutral, wink, skeptical]
  - [neutral, skeptical, surprise]
  - [neutral, surprise, kiss]
  - [neutral, kiss, sad]
  - [neutral, sad, angry]
strokes:
  - [bl1, bl2, bl3]
  - [br1, br2, br3]
  - { path: [el_o, el_u1, el_u2, el_i, el_l2, el_l1], closed: true }
  - { path: [er_i, er_u1, er_u2, er_o, er_l2, er_l1], closed: true }
  - { path: [pl1, pl2, pl3, pl4], fill: "#222" }
  - { path: [pr1, pr2, pr3, pr4], fill: "#222" }
  - { path: [ml, mu1, mu2, mu3, mr, md3, md2, md1], closed: true, fill: "#b5485d", width: 2 }
decor:
  - { circle: [0, 0, 40], fill: "#f6d6b8" }
  - { line: [0, 6, -3, -8] }
  - { line: [-3, -8, 2, -9] }
handles: dots
ghosts: none
view: [-46, -46, 92, 92]
outputs:
  title: ARKit blendshape coefficients
  names: ["jawOpen", "mouthSmileLeft", "mouthSmileRight", "mouthFrownLeft", "mouthFrownRight", "mouthPucker", "browInnerUp", "browOuterUpLeft", "browOuterUpRight", "browDownLeft", "browDownRight", "eyeBlinkLeft", "eyeBlinkRight", "eyeWideLeft", "eyeWideRight"]
  values:
    neutral: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    smile: [0, 1, 1, 0, 0, 0, 0, 0.2, 0.2, 0, 0, 0, 0, 0, 0]
    wink: [0, 0.8, 0.3, 0, 0, 0, 0, 0, 0, 0.3, 0, 1, 0, 0, 0]
    skeptical: [0, 0, 0.4, 0.3, 0, 0, 0, 0, 1, 0.7, 0, 0, 0, 0, 0]
    surprise: [0.7, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1]
    kiss: [0, 0, 0, 0, 0, 1, 0.3, 0, 0, 0, 0, 0.6, 0.6, 0, 0]
    sad: [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0.25, 0.25, 0, 0]
    angry: [0, 0, 0, 0.6, 0.6, 0, 0, 0, 0, 1, 1, 0, 0, 0.4, 0.4]
```

That's the inverse of what rigs usually offer. An animator sets coefficients and watches the face; here you pull the face and get coefficients, and the expressions keep the result looking like a face instead of fifteen sliders' worth of possible faces. J.P. Lewis and Ken Anjyo brought this to production blendshapes in *Direct Manipulation Blendshapes* (2010); ECG's complex of expressions adds that the faces you blend are chosen, a few at a time, and you walk between them.

The rig comes from `examples/ecg/tools/worlds.py`.

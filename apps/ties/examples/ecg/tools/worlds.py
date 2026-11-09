#!/usr/bin/env python3
"""Write three ECG articles that take the engine out of 2D cartoons:

    articles/turning-a-head.md    3D points seen through a fixed camera; drag the nose
    articles/blendshapes.md       an ARKit-named rig; the weights blend coefficients
    articles/arranging-views.md   window layouts as examples; drag a corner

    python3 apps/ties/examples/ecg/tools/worlds.py

Every example is generated from a few numbers here, so change them and run this again.
"""

import json
import math
from pathlib import Path

ARTICLES = Path(__file__).resolve().parent.parent / "articles"


def num(v):
    return round(v, 2) + 0.0


def flow(v):
    return json.dumps(v, separators=(", ", ": "))


def examples_yaml(examples, indent="  "):
    lines = []
    for e in examples:
        lines.append(f"{indent}- id: {e['id']}")
        if e.get("label"):
            lines.append(f"{indent}  label: {flow(e['label'])}")
        pts = e["points"]
        if isinstance(pts, dict):
            body = ", ".join(f"{k}: {flow([num(x), num(y)])}" for k, (x, y) in pts.items())
            lines.append(f"{indent}  points: {{ {body} }}")
        else:
            lines.append(f"{indent}  points: {flow([[num(x), num(y)] for x, y in pts])}")
    return lines


# A head: a sphere with features on its surface, turned by rotations, seen straight on.

R = 40


def on_sphere(x, y, lift=0.0):
    return (x, y, math.sqrt(max(0.0, R * R - x * x - y * y)) + lift)


def ellipse(cx, cy, rx, ry, n, lift=0.6):
    return [on_sphere(cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n), lift) for i in range(n)]


HEAD = {}  # name -> list of 3D points, in drawing order
HEAD["midline"] = [on_sphere(0, y) for y in (36, 27, 18, 9, 0, -9, -18, -27, -36)]
HEAD["equator"] = [on_sphere(R * math.sin(math.radians(a)), 0) for a in range(-80, 81, 20)]
for side, sx in (("l", -1), ("r", 1)):
    HEAD[f"eye_{side}"] = ellipse(15 * sx, 10, 7, 4, 8)
    HEAD[f"pupil_{side}"] = ellipse(15 * sx, 10, 2.4, 2.4, 4, lift=0.9)
    HEAD[f"brow_{side}"] = [on_sphere(x * sx, y, 0.6) for x, y in ((7, 19), (15, 22), (23, 19))]
HEAD["nose"] = [on_sphere(0, 15, 0.5), (0, -2, R + 11), on_sphere(-5, -6, 3), on_sphere(5, -6, 3)]
HEAD["mouth"] = [on_sphere(x, y, 0.6) for x, y in ((-14, -18), (-7, -21), (0, -22), (7, -21), (14, -18))]

GUIDE = "#c8c8c8"
HEAD_STROKES = [
    ("midline", {"color": GUIDE}),
    ("equator", {"color": GUIDE}),
    ("eye_l", {"closed": True}),
    ("eye_r", {"closed": True}),
    ("pupil_l", {"fill": "#222"}),
    ("pupil_r", {"fill": "#222"}),
    ("brow_l", {"width": 2.5}),
    ("brow_r", {"width": 2.5}),
    ("mouth", {"width": 2}),
]

TURNS = [  # id, label, yaw (to the viewer's right), pitch (up)
    ("ahead", None, 0, 0),
    ("left", "turn left", -50, 0),
    ("up", "look up", 0, 38),
    ("right", "turn right", 50, 0),
    ("down", "look down", 0, -38),
]


def turned(p, yaw, pitch):
    x, y, z = p
    a = math.radians(yaw)
    x, z = x * math.cos(a) + z * math.sin(a), -x * math.sin(a) + z * math.cos(a)
    b = math.radians(pitch)
    y, z = y * math.cos(b) + z * math.sin(b), -y * math.sin(b) + z * math.cos(b)
    return (x, y)  # a camera straight down the z axis: drop depth


def head_fence():
    order, index = [], {}
    for name, pts in HEAD.items():
        index[name] = list(range(len(order), len(order) + len(pts)))
        order.extend(pts)
    examples = [
        {"id": i, "label": label, "points": [turned(p, yaw, pitch) for p in order]} for i, label, yaw, pitch in TURNS
    ]
    tip = index["nose"][1]
    n = index["nose"]
    lines = ["title: A head you turn by the nose", "examples:"]
    lines += examples_yaml(examples)
    lines += [
        "zones:",
        "  - [ahead, left, up]",
        "  - [ahead, up, right]",
        "  - [ahead, right, down]",
        "  - [ahead, down, left]",
        "layout: { left: [-1, 0], up: [0, 1], right: [1, 0], down: [0, -1], ahead: [0, 0] }",
        "strokes:",
    ]
    for name, style in HEAD_STROKES:
        lines.append(f"  - {flow({'path': index[name], **style})}")
    lines.append(f"  - {flow({'path': [n[0], n[1], n[2]], 'width': 2})}")
    lines.append(f"  - {flow({'path': [n[1], n[3]], 'width': 2})}")
    lines += [
        "decor:",
        f"  - {{ circle: [0, 0, {R}] }}",
        "  - { line: [-15, -37, -17, -58] }",
        "  - { line: [15, -37, 17, -58] }",
        f"importance: {{ {tip}: 6 }}",
        "handles: dots",
        "ghosts: none",
        "view: [-62, -62, 124, 124]",
    ]
    return "```ecg\n" + "\n".join(lines) + "\n```"


HEAD_ARTICLE = """---
title: Turning a Head
synonyms:
  - 3d
  - head turn
  - three dimensions
definition: "A wireframe head drawn from 3D points, posed five ways: ahead, left, right, up, down. Grab the nose and turn it."
---

Nothing in ECG is 2D. An example is a list of numbers, and here each one is a head: points on a sphere, turned in three dimensions, then seen through a camera. Five poses: ahead, turned left, turned right, looking up, looking down.

The camera is fixed and looks straight on, so a point's place on the screen is a linear function of where it is in 3D. Blending 3D poses and then projecting gives the same picture as projecting and then blending, which means the engine can solve on the screen and the head moves in 3D.

Grab the tip of the nose and steer. Up and to the right is a blend of three poses, ahead, up and right, and the map shows you which triangle you're in.

{fence}

Turn it all the way and watch the eyes: they get a little closer to the middle than a real turn would put them. That's the linearized configuration map from ~Tumbling~ again: blended poses cut across the chord of a rotation instead of following the arc. Add poses at 25° and the chords get shorter. A real character uses the same trick with poses of a skeleton, and a renderer draws the mesh the skeleton carries.

The head comes from `examples/ecg/tools/worlds.py`.
"""


# Blendshapes: an ARKit-named rig. The neutral face plus one displacement per coefficient.

FACE = {
    "bl1": (-26, 21), "bl2": (-16, 25), "bl3": (-7, 23),
    "br1": (7, 23), "br2": (16, 25), "br3": (26, 21),
    "el_o": (-24, 12), "el_u1": (-20, 16), "el_u2": (-12, 16), "el_i": (-8, 12), "el_l2": (-12, 9), "el_l1": (-20, 9),
    "er_i": (8, 12), "er_u1": (12, 16), "er_u2": (20, 16), "er_o": (24, 12), "er_l2": (20, 9), "er_l1": (12, 9),
    "pl1": (-17.5, 12.5), "pl2": (-16, 14), "pl3": (-14.5, 12.5), "pl4": (-16, 11),
    "pr1": (14.5, 12.5), "pr2": (16, 14), "pr3": (17.5, 12.5), "pr4": (16, 11),
    "ml": (-15, -20), "mu1": (-7, -18), "mu2": (0, -17.5), "mu3": (7, -18), "mr": (15, -20),
    "md3": (7, -22), "md2": (0, -23), "md1": (-7, -22),
}


def side(name):
    """'l' or 'r': which half of the face a point is on, in the picture."""
    return "l" if FACE[name][0] < 0 else "r"


def eye_points(s):
    return [k for k in FACE if k.startswith(("e" + s, "p" + s))]


def blink(s):
    d = {}
    for k in eye_points(s):
        x, y = FACE[k]
        if k.startswith("p"):
            d[k] = (0, 9.5 - y)  # the pupil squashes onto the closed lid
        elif "_u" in k:
            d[k] = (0, -6.5)
    return d


def wide(s):
    return {k: (0, 3) for k in eye_points(s) if "_u" in k} | {k: (0, -1) for k in eye_points(s) if "_l" in k}


def smile(s):
    corner = "ml" if s == "l" else "mr"
    sx = -1 if s == "l" else 1
    near = ["mu1", "md1"] if s == "l" else ["mu3", "md3"]
    return {corner: (3 * sx, 7)} | {k: (sx, 2.5) for k in near}


def frown(s):
    corner = "ml" if s == "l" else "mr"
    return {corner: (0, -6)}


def brow_outer(s):
    return {("bl1" if s == "l" else "br3"): (0, 6), ("bl2" if s == "l" else "br2"): (0, 3)}


def brow_down(s):
    inner, mid = ("bl3", "bl2") if s == "l" else ("br1", "br2")
    sx = 1 if s == "l" else -1
    return {inner: (2 * sx, -6), mid: (sx, -3)}


# ARKit's Left and Right are the face's own: its left is the viewer's right.
RIG = {
    "jawOpen": {"md1": (0, -11), "md2": (0, -13), "md3": (0, -11), "ml": (1, -4), "mr": (-1, -4)},
    "mouthSmileLeft": smile("r"),
    "mouthSmileRight": smile("l"),
    "mouthFrownLeft": frown("r"),
    "mouthFrownRight": frown("l"),
    "mouthPucker": {"ml": (8, 0), "mr": (-8, 0), "mu1": (3, 1), "mu3": (-3, 1), "md1": (3, -1), "md3": (-3, -1), "mu2": (0, 1.5), "md2": (0, -1.5)},
    "browInnerUp": {"bl3": (0, 6), "br1": (0, 6), "bl2": (0, 2), "br2": (0, 2)},
    "browOuterUpLeft": brow_outer("r"),
    "browOuterUpRight": brow_outer("l"),
    "browDownLeft": brow_down("r"),
    "browDownRight": brow_down("l"),
    "eyeBlinkLeft": blink("r"),
    "eyeBlinkRight": blink("l"),
    "eyeWideLeft": wide("r"),
    "eyeWideRight": wide("l"),
}

EXPRESSIONS = [  # around neutral; neighbours blend well
    ("smile", {"mouthSmileLeft": 1, "mouthSmileRight": 1, "browOuterUpLeft": 0.2, "browOuterUpRight": 0.2}),
    ("wink", {"eyeBlinkLeft": 1, "mouthSmileLeft": 0.8, "mouthSmileRight": 0.3, "browDownLeft": 0.3}),
    ("skeptical", {"browOuterUpRight": 1, "browDownLeft": 0.7, "mouthSmileRight": 0.4, "mouthFrownLeft": 0.3}),
    ("surprise", {"jawOpen": 0.7, "browInnerUp": 1, "browOuterUpLeft": 1, "browOuterUpRight": 1, "eyeWideLeft": 1, "eyeWideRight": 1}),
    ("kiss", {"mouthPucker": 1, "eyeBlinkLeft": 0.6, "eyeBlinkRight": 0.6, "browInnerUp": 0.3}),
    ("sad", {"mouthFrownLeft": 1, "mouthFrownRight": 1, "browInnerUp": 1, "eyeBlinkLeft": 0.25, "eyeBlinkRight": 0.25}),
    ("angry", {"browDownLeft": 1, "browDownRight": 1, "mouthFrownLeft": 0.6, "mouthFrownRight": 0.6, "eyeWideLeft": 0.4, "eyeWideRight": 0.4}),
]


def rigged(coefficients):
    pts = {}
    for k, (x, y) in FACE.items():
        for name, c in coefficients.items():
            dx, dy = RIG[name].get(k, (0, 0))
            x, y = x + c * dx, y + c * dy
        pts[k] = (x, y)
    return pts


def blend_fence():
    names = list(RIG)
    examples = [{"id": "neutral", "points": rigged({})}] + [{"id": i, "points": rigged(c)} for i, c in EXPRESSIONS]
    ring = [i for i, _ in EXPRESSIONS]
    lines = ["title: Seven faces, fifteen coefficients", "examples:"]
    lines += examples_yaml(examples)
    lines.append("zones:")
    for a, b in zip(ring, ring[1:]):  # a fan, not a closed ring, so the map lies flat
        lines.append(f"  - [neutral, {a}, {b}]")
    lines += [
        "strokes:",
        "  - [bl1, bl2, bl3]",
        "  - [br1, br2, br3]",
        "  - { path: [el_o, el_u1, el_u2, el_i, el_l2, el_l1], closed: true }",
        "  - { path: [er_i, er_u1, er_u2, er_o, er_l2, er_l1], closed: true }",
        '  - { path: [pl1, pl2, pl3, pl4], fill: "#222" }',
        '  - { path: [pr1, pr2, pr3, pr4], fill: "#222" }',
        '  - { path: [ml, mu1, mu2, mu3, mr, md3, md2, md1], closed: true, fill: "#b5485d", width: 2 }',
        "decor:",
        '  - { circle: [0, 0, 40], fill: "#f6d6b8" }',
        "  - { line: [0, 6, -3, -8] }",
        "  - { line: [-3, -8, 2, -9] }",
        "handles: dots",
        "ghosts: none",
        "view: [-46, -46, 92, 92]",
        "outputs:",
        "  title: ARKit blendshape coefficients",
        f"  names: {flow(names)}",
        "  values:",
        f"    neutral: {flow([0] * len(names))}",
    ]
    for i, c in EXPRESSIONS:
        lines.append(f"    {i}: {flow([c.get(n, 0) for n in names])}")
    return "```ecg\n" + "\n".join(lines) + "\n```"


def coefficient_table():
    rows = ["| Face | Coefficients |", "|------|--------------|"]
    for i, c in EXPRESSIONS:
        rows.append(f"| {i} | " + ", ".join(f"`{k}` {v:g}" for k, v in c.items()) + " |")
    return "\n".join(rows)


BLEND_ARTICLE = """---
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

{table}

The rig is linear: the face is the neutral face plus each offset times its coefficient. So blending the expressions' coefficients and then rigging gives exactly the face you get by blending their points. ECG can work on the points you see, and hand the rig the coefficients.

Drag a mouth corner, an eyelid or a brow. The engine finds the blend of expressions that puts it under your finger, and the bars under the weights show the fifteen coefficients that blend works out to: the numbers a game engine or Blender would get.

{fence}

That's the inverse of what rigs usually offer. An animator sets coefficients and watches the face; here you pull the face and get coefficients, and the expressions keep the result looking like a face instead of fifteen sliders' worth of possible faces. J.P. Lewis and Ken Anjyo brought this to production blendshapes in *Direct Manipulation Blendshapes* (2010); ECG's complex of expressions adds that the faces you blend are chosen, a few at a time, and you walk between them.

The rig comes from `examples/ecg/tools/worlds.py`.
"""


# Views: four windows on a screen, laid out four ways.

SCREEN_W, SCREEN_H = 160, 100
WINDOWS = [  # name, colour, where it shrinks to when a layout hides it
    ("article", "#ffd23f", (0, 100)),
    ("source", "#b8e0a8", (0, 0)),
    ("memory", "#f4a7b9", (160, 0)),
    ("map", "#8ecae6", (160, 100)),
]
LAYOUTS = {  # window -> x, y, w, h (y up); missing windows are hidden
    "reading": {"article": (0, 0, 112, 100), "source": (112, 0, 48, 50), "map": (112, 50, 48, 50)},
    "comparing": {"article": (0, 0, 80, 100), "source": (80, 0, 80, 100)},
    "debugging": {"source": (0, 0, 80, 100), "memory": (80, 0, 80, 62), "map": (80, 62, 80, 38)},
    "overview": {"article": (0, 50, 80, 50), "map": (80, 50, 80, 50), "source": (0, 0, 80, 50), "memory": (80, 0, 80, 50)},
}


def corners(name, rect, hidden):
    if rect is None:
        return {f"{name}{i}": hidden for i in range(4)}
    x, y, w, h = rect
    g = 1.5  # a gutter between windows
    x, y, w, h = x + g, y + g, w - 2 * g, h - 2 * g
    return {f"{name}0": (x, y), f"{name}1": (x + w, y), f"{name}2": (x + w, y + h), f"{name}3": (x, y + h)}


def views_fence():
    examples = []
    for layout, rects in LAYOUTS.items():
        pts = {}
        for name, _, hidden in WINDOWS:
            pts |= corners(name, rects.get(name), hidden)
        examples.append({"id": layout, "points": pts})
    lines = ["title: Four windows, four layouts", "examples:"]
    lines += examples_yaml(examples)
    lines += [f"zones: [[{', '.join(LAYOUTS)}]]", "strokes:"]
    for name, colour, _ in WINDOWS:
        lines.append(f"  - {{ path: [{name}0, {name}1, {name}2, {name}3], fill: \"{colour}\" }}")
    lines += [
        "decor:",
        f"  - {{ line: [0, 0, {SCREEN_W}, 0] }}",
        f"  - {{ line: [{SCREEN_W}, 0, {SCREEN_W}, {SCREEN_H}] }}",
        f"  - {{ line: [{SCREEN_W}, {SCREEN_H}, 0, {SCREEN_H}] }}",
        f"  - {{ line: [0, {SCREEN_H}, 0, 0] }}",
        "handles: dots",
        "ghosts: none",
        f"view: [-6, -6, {SCREEN_W + 12}, {SCREEN_H + 12}]",
    ]
    return "```ecg\n" + "\n".join(lines) + "\n```"


VIEWS_ARTICLE = """---
title: Arranging Views
synonyms:
  - views
  - window layouts
  - zoomable views
  - view blending
definition: "Four windows on a screen, saved in four layouts: reading, comparing, debugging, overview. Drag a window's corner and the whole screen moves toward the layouts that make that window that size."
---

A layout of windows is a list of numbers too: each window's corners. Save a few layouts you like and they're examples, and the arrangement on the screen is a blend of them.

Four windows: the yellow **article**, the green **source**, the pink **memory** and the blue **map**. Four layouts: **reading** (the article big, source and map beside it), **comparing** (article and source side by side), **debugging** (source, memory and map) and **overview** (all four tiled). A layout that hides a window shrinks it to a point at the edge of the screen, so blending toward that layout shrinks it away.

Grab a corner of a window and drag it. The engine finds the blend of layouts that makes that window that size, and every other window follows the layouts it's heading for. Four layouts glued into one tetrahedron: the map shows it from three sides.

{fence}

Nothing here is about windows. The same numbers could be a camera's position and zoom over a map, the panels open in an emulator, or the scroll position of each article: the views you saved are the examples, and pinching, scrolling or resizing drags you between them. The design for doing this to the whole HyperTIES reader, with "views you were heading toward" to finish a move with one click, is [VIEW-BLENDING.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/ecg/VIEW-BLENDING.md).

The layouts come from `examples/ecg/tools/worlds.py`.
"""


def main():
    for name, article, fence in (
        ("turning-a-head.md", HEAD_ARTICLE, head_fence),
        ("blendshapes.md", BLEND_ARTICLE.replace("{table}", coefficient_table()), blend_fence),
        ("arranging-views.md", VIEWS_ARTICLE, views_fence),
    ):
        out = ARTICLES / name
        out.write_text(article.replace("{fence}", fence()))
        print(f"wrote {out}")


if __name__ == "__main__":
    main()

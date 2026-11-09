#!/usr/bin/env python3
"""Write articles/mouther.md: a stand-in Mouther face, ten mouth shapes from a few numbers each.

The cartoons are original, drawn from parameters, not traced from Golan Levin's. Edit SHAPES
and run this again to restyle the face:

    python3 apps/ties/examples/ecg/tools/mouther.py

Every mouth has the same 20 points, so ECG can blend any of them:
    0-7    the lips, corner to corner round the top, back round the bottom
    8-11   the tongue, a band rising from the lower lip
    12-15  the upper teeth, a band hanging from the upper lip (zero height when hidden)
    16-19  two brows
"""

import math
from pathlib import Path

MOUTH_Y = -18

# w: half width   u: upper lip opening   d: lower lip opening   c: corners up
# r: roundness 0-1   t: teeth showing   g: tongue up 0-1, below 0 sticks out   b: brows up
# k: brows tilt, inner ends up   s: smirk, right corner up and left down   a: left brow up, right down
SHAPES = {
    "M": dict(w=14, u=0.6, d=0.6, c=1, r=0.0, t=0.0, g=0.0, b=0, k=0),
    "AY": dict(w=18, u=10, d=17, c=2, r=0.3, t=0.8, g=0.35, b=5, k=1),
    "EE": dict(w=23, u=4, d=6, c=6, r=0.0, t=1.0, g=0.0, b=2, k=-1),
    "S": dict(w=19, u=3, d=3, c=3, r=0.0, t=1.0, g=0.0, b=1, k=0),
    "F": dict(w=17, u=4, d=1, c=0, r=0.0, t=1.7, g=0.0, b=1, k=-2),
    "L": dict(w=15, u=8, d=11, c=1, r=0.3, t=0.7, g=1.0, b=3, k=0),
    "UH": dict(w=14, u=5, d=10, c=-2, r=0.4, t=0.5, g=0.3, b=0, k=2),
    "OH": dict(w=10, u=10, d=13, c=-1, r=1.0, t=0.0, g=0.3, b=7, k=0),
    "OO": dict(w=6, u=5, d=6, c=-1, r=1.0, t=0.0, g=0.0, b=5, k=-1),
    "R": dict(w=9, u=6, d=7, c=0, r=0.8, t=0.6, g=0.2, b=2, k=1),
}
RING = ["OO", "R", "OH", "UH", "L", "AY", "EE", "F", "S"]  # around the rest pose M, dark sounds to bright

# Faces, not sounds: a second fan around M, its own page on the map. Neighbours blend well.
EXPRESSIONS = {
    "smile": dict(w=20, u=1, d=4, c=7, r=0.0, t=0.3, g=0.0, b=3, k=0),
    "grin": dict(w=24, u=5, d=9, c=8, r=0.0, t=1.3, g=0.0, b=4, k=0),
    "laugh": dict(w=22, u=10, d=20, c=6, r=0.3, t=0.9, g=0.5, b=8, k=-1),
    "surprise": dict(w=10, u=11, d=14, c=0, r=1.0, t=0.0, g=0.2, b=11, k=0),
    "yawn": dict(w=13, u=12, d=19, c=-1, r=0.9, t=0.0, g=0.4, b=-3, k=3),
    "kiss": dict(w=4, u=2.5, d=2.5, c=0, r=1.0, t=0.0, g=0.0, b=6, k=2),
    "raspberry": dict(w=14, u=2, d=3, c=-1, r=0.2, t=0.0, g=-1.0, b=5, k=-2),
    "smirk": dict(w=17, u=1, d=2, c=2, r=0.0, t=0.2, g=0.0, b=2, k=0, s=5, a=4),
    "disgust": dict(w=16, u=4, d=2, c=-3, r=0.0, t=1.0, g=0.0, b=-1, k=-3, s=-3, a=-3),
    "angry": dict(w=16, u=3, d=4, c=-3, r=0.0, t=1.6, g=0.0, b=-3, k=-6),
    "cry": dict(w=18, u=8, d=14, c=-8, r=0.4, t=0.3, g=0.2, b=3, k=7),
    "sad": dict(w=15, u=1, d=1, c=-6, r=0.0, t=0.0, g=0.0, b=2, k=5),
}
FACES = list(EXPRESSIONS)
POSES = [
    ["smile", "grin", "laugh", "smirk"],
    ["sad", "cry", "angry", "disgust"],
    ["surprise", "kiss", "raspberry", "yawn"],
]

LETTERS = {
    "a": "AY", "e": "EE", "i": "EE", "y": "EE", "o": "OH", "u": "UH", "w": "OO", "q": "OO",
    "r": "R", "s": "S", "z": "S", "c": "S", "x": "S", "j": "S", "t": "S", "d": "S", "n": "S",
    "k": "S", "g": "S", "h": "UH", "f": "F", "v": "F", "l": "L", "m": "M", "b": "M", "p": "M",
}
PAIRS = {
    "th": "L", "oo": "OO", "ee": "EE", "ea": "EE", "sh": "S", "ch": "S", "ow": "OH", "ou": "OO",
    "ay": "AY", "ai": "AY", "er": "R", "ph": "F",
}


def mouth(w, u, d, c, r, t, g, b, k, s=0, a=0):
    y = MOUTH_Y
    cl, cr = c - s, c + s
    lips = [
        (-w, y + cl),
        (-w * (0.45 + 0.35 * r), y + u * (0.8 + 0.2 * r) + cl * 0.4),
        (0, y + u * (0.7 + 0.3 * r)),
        (w * (0.45 + 0.35 * r), y + u * (0.8 + 0.2 * r) + cr * 0.4),
        (w, y + cr),
        (w * (0.5 + 0.3 * r), y - d * (0.85 + 0.15 * r) + cr * 0.3),
        (0, y - d),
        (-w * (0.5 + 0.3 * r), y - d * (0.85 + 0.15 * r) + cl * 0.3),
    ]
    if g < 0:
        gw, base = max(w * 0.55, 7), y - d * 0.3
        gh = g * 14
    else:
        gw, base = w * 0.42, y - d * 0.85
        gh = g * (u + d) * 0.6
    tongue = [(-gw, base), (gw, base), (gw * 0.7, base + gh), (-gw * 0.7, base + gh)]
    tw, top = w * 0.55 * (1 - 0.4 * r), y + u * 0.68
    th = t * min(u + d, 8) * 0.45
    teeth = [(-tw, top), (tw, top), (tw, top - th), (-tw, top - th)]
    brows = [(-30, 26 + b + a - k), (-12, 28 + b + a + k), (12, 28 + b - a + k), (30, 26 + b - a - k)]
    return lips + tongue + teeth + brows


# The eyes are a second complex, tracked in parallel with the mouth: seven pupil poses, and
# tetrahedra of a direction pair plus a vergence. A pose outside them isn't in the space.
EYES = [(-19, 13), (19, 13)]
REACH = 4.8
GAZES = {
    "ahead": ((0, 0), (0, 0)),
    "left": ((-REACH, 0), (-REACH, 0)),
    "right": ((REACH, 0), (REACH, 0)),
    "up": ((0, REACH), (0, REACH)),
    "down": ((0, -REACH), (0, -REACH)),
    "cross": ((REACH, 0), (-REACH, 0)),
    "wall": ((-REACH, 0), (REACH, 0)),
}


def eyes():
    lines = ["eyes:", "  examples:"]
    for name, offsets in GAZES.items():
        pts = ", ".join(pair((cx + dx, cy + dy)) for (cx, cy), (dx, dy) in zip(EYES, offsets))
        lines.append(f"    - {{ id: {name}, points: [{pts}] }}")
    lines.append("  zones:")
    for a, b in [("left", "up"), ("up", "right"), ("right", "down"), ("down", "left")]:
        for v in ("cross", "wall"):
            lines.append(f"    - [ahead, {a}, {b}, {v}]")
    lines += [
        "  start: ahead",
        "  centers: [" + ", ".join(pair(c) for c in EYES) + "]",
        f"  reach: {REACH}",
        "  far: 80",
        "  near: 10",
        '  pupil: { r: 4.5, fill: "#000000" }',
    ]
    return lines


def pair(p):
    return f"[{round(p[0], 2):g}, {round(p[1], 2):g}]"


def fence():
    lines = ["```ecg", "title: Mouther, a stand-in", "examples:"]
    shapes = {**SHAPES, **EXPRESSIONS}
    for name in ["M"] + RING + FACES:
        pts = ", ".join(pair(p) for p in mouth(**shapes[name]))
        lines.append(f"  - id: {name}")
        lines.append(f"    points: [{pts}]")
    lines.append("zones:")
    for ring in (RING, FACES):
        for a, b in zip(ring, ring[1:] + ring[:1]):
            lines.append(f"  - [M, {a}, {b}]")
    lines.append("layout:")
    lines.append("  M: [0, 0]")
    for ring in (RING, FACES):
        for i, name in enumerate(ring):
            a = math.pi / 2 - 2 * math.pi * i / len(ring)
            lines.append(f"  {name}: [{math.cos(a):.3f}, {math.sin(a):.3f}]")
    lines += [
        "start: M",
        "strokes:",
        '  - { path: [0, 1, 2, 3, 4, 5, 6, 7], fill: "#5b0e2d", stroke: false }',
        '  - { path: [8, 9, 10, 11], fill: "#ff6f91", stroke: false }',
        '  - { path: [12, 13, 14, 15], fill: "#ffffff", stroke: false }',
        "  - { path: [0, 1, 2, 3, 4, 5, 6, 7], closed: true, width: 5 }",
        "  - { path: [16, 17], width: 6 }",
        "  - { path: [18, 19], width: 6 }",
        "decor:",
        '  - { circle: [0, 2, 52], fill: "#ffd23f", width: 3 }',
        '  - { circle: [-34, -14, 8], fill: "#ff9eb5", color: "none" }',
        '  - { circle: [34, -14, 8], fill: "#ff9eb5", color: "none" }',
        '  - { circle: [-19, 13, 10], fill: "#ffffff", width: 3 }',
        '  - { circle: [19, 13, 10], fill: "#ffffff", width: 3 }',
        "view: [-60, -54, 120, 120]",
        "map: { size: 230, pages: down }",
        "poses:",
        *[f"  - [{', '.join(row)}]" for row in POSES],
        "ghosts: none",
        "handles: dots",
        "say:",
        "  text: Hello! I am Mouther. Pleased to meet you.",
        "  rest: M",
        "  ms: 120",
        "  aloud: true",
        "  letters: { " + ", ".join(f"{k}: {v}" for k, v in LETTERS.items()) + " }",
        "  pairs: { " + ", ".join(f"{k}: {v}" for k, v in PAIRS.items()) + " }",
        "listen: { rest: M, ring: [" + ", ".join(RING) + "] }",
        *eyes(),
        "```",
    ]
    return "\n".join(lines)


ARTICLE = """---
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

{fence}

The map is the face's state space. M, lips pressed, is in the middle; the nine sounds sit around it, dark to bright, and every triangle of M and two neighbours is a zone. A point in a triangle is a blend of three mouths. The twelve faces make a second fan around the same M. Both fans can't lie flat in one picture, so the faces get their own page, glued to the sounds at M: when the state is at rest, the dot shows on both pages, and you can grab it on either. Driving (Say, Listen) and tugging (Pull) are two ways of moving that one point.

How that works, one idea at a time, is the rest of this story, starting from ~Two Pictures~.

The mouths come from `examples/ecg/tools/mouther.py`; change a number and run it to restyle the face.
"""


def main():
    out = Path(__file__).resolve().parent.parent / "articles" / "mouther.md"
    out.write_text(ARTICLE.replace("{fence}", fence()))
    print(f"wrote {out}")


if __name__ == "__main__":
    main()

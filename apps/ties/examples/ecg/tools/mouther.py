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
# r: roundness 0-1   t: teeth showing   g: tongue up 0-1   b: brows up   k: brows tilt
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
RING = ["AY", "EE", "S", "F", "L", "UH", "OH", "OO", "R"]  # around the rest pose, M

LETTERS = {
    "a": "AY", "e": "EE", "i": "EE", "y": "EE", "o": "OH", "u": "UH", "w": "OO", "q": "OO",
    "r": "R", "s": "S", "z": "S", "c": "S", "x": "S", "j": "S", "t": "S", "d": "S", "n": "S",
    "k": "S", "g": "S", "h": "UH", "f": "F", "v": "F", "l": "L", "m": "M", "b": "M", "p": "M",
}
PAIRS = {
    "th": "L", "oo": "OO", "ee": "EE", "ea": "EE", "sh": "S", "ch": "S", "ow": "OH", "ou": "OO",
    "ay": "AY", "ai": "AY", "er": "R", "ph": "F",
}


def mouth(w, u, d, c, r, t, g, b, k):
    y = MOUTH_Y
    lips = [
        (-w, y + c),
        (-w * (0.45 + 0.35 * r), y + u * (0.8 + 0.2 * r) + c * 0.4),
        (0, y + u * (0.7 + 0.3 * r)),
        (w * (0.45 + 0.35 * r), y + u * (0.8 + 0.2 * r) + c * 0.4),
        (w, y + c),
        (w * (0.5 + 0.3 * r), y - d * (0.85 + 0.15 * r) + c * 0.3),
        (0, y - d),
        (-w * (0.5 + 0.3 * r), y - d * (0.85 + 0.15 * r) + c * 0.3),
    ]
    gw, base = w * 0.42, y - d * 0.85
    gh = g * (u + d) * 0.6
    tongue = [(-gw, base), (gw, base), (gw * 0.7, base + gh), (-gw * 0.7, base + gh)]
    tw, top = w * 0.55 * (1 - 0.4 * r), y + u * 0.68
    th = t * min(u + d, 8) * 0.45
    teeth = [(-tw, top), (tw, top), (tw, top - th), (-tw, top - th)]
    brows = [(-30, 26 + b - k), (-12, 28 + b + k), (12, 28 + b + k), (30, 26 + b - k)]
    return lips + tongue + teeth + brows


def pair(p):
    return f"[{round(p[0], 2):g}, {round(p[1], 2):g}]"


def fence():
    lines = ["```ecg", "title: Mouther, a stand-in", "examples:"]
    for name in ["M"] + RING:
        pts = ", ".join(pair(p) for p in mouth(**SHAPES[name]))
        lines.append(f"  - id: {name}")
        lines.append(f"    points: [{pts}]")
    lines.append("zones:")
    for a, b in zip(RING, RING[1:] + RING[:1]):
        lines.append(f"  - [M, {a}, {b}]")
    lines.append("layout:")
    lines.append("  M: [0, 0]")
    for i, name in enumerate(RING):
        a = math.pi / 2 - 2 * math.pi * i / len(RING)
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
        '  - { circle: [-17, 11, 4.5], fill: "#000000" }',
        '  - { circle: [21, 11, 4.5], fill: "#000000" }',
        "view: [-60, -54, 120, 120]",
        "ghosts: none",
        "handles: dots",
        "say:",
        "  text: Hello! I am Mouther. Pleased to meet you.",
        "  rest: M",
        "  ms: 120",
        "  letters: { " + ", ".join(f"{k}: {v}" for k, v in LETTERS.items()) + " }",
        "  pairs: { " + ", ".join(f"{k}: {v}" for k, v in PAIRS.items()) + " }",
        "```",
    ]
    return "\n".join(lines)


ARTICLE = """---
title: Mouther
synonyms:
  - mouther stand-in
  - talking face
definition: "A talking cartoon face with ten mouth shapes, after Golan Levin's Mouther (1995). Type something and it says it; grab its lips and pull."
---

Golan Levin's **Mouther** (Interval Research, 1995, with Malcolm Slaney and Tom Ngo) listened to your voice, recognized the sounds you were making, and drove a cartoon face through them in real time. The face was built with ECG: ten drawings of a mouth, blended by the recognizer the way the demos before this one are blended by your mouse.

This face is a stand-in with its own cartoons, after Golan's: the same ten mouth shapes, AY, EE, UH, OH, R, OO, S, F, L and M, each a few numbers (how wide, how open, how round, how much teeth and tongue) turned into twenty points. M, lips pressed, is the rest pose in the middle; the other nine sit around it, each zone a triangle of M and two neighbours.

Type something and press **Say**. Letters stand in for the sounds a recognizer would hear, so English spelling makes it mumble in places. Then grab the lips, teeth or brows and pull: it's the same engine, tugged instead of driven.

{fence}

Driving and tugging meet here. A speech recognizer, a timeline or a letter-by-letter script **drives** the state; your hand **tugs** it. Both move the same weights, so one face answers to both.

The mouths come from `examples/ecg/tools/mouther.py`; change a number and run it to restyle the face.
"""


def main():
    out = Path(__file__).resolve().parent.parent / "articles" / "mouther.md"
    out.write_text(ARTICLE.replace("{fence}", fence()))
    print(f"wrote {out}")


if __name__ == "__main__":
    main()

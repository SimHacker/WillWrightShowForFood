---
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

```ecg
title: Four windows, four layouts
examples:
  - id: reading
    points: { article0: [1.5, 1.5], article1: [110.5, 1.5], article2: [110.5, 98.5], article3: [1.5, 98.5], source0: [113.5, 1.5], source1: [158.5, 1.5], source2: [158.5, 48.5], source3: [113.5, 48.5], memory0: [160.0, 0.0], memory1: [160.0, 0.0], memory2: [160.0, 0.0], memory3: [160.0, 0.0], map0: [113.5, 51.5], map1: [158.5, 51.5], map2: [158.5, 98.5], map3: [113.5, 98.5] }
  - id: comparing
    points: { article0: [1.5, 1.5], article1: [78.5, 1.5], article2: [78.5, 98.5], article3: [1.5, 98.5], source0: [81.5, 1.5], source1: [158.5, 1.5], source2: [158.5, 98.5], source3: [81.5, 98.5], memory0: [160.0, 0.0], memory1: [160.0, 0.0], memory2: [160.0, 0.0], memory3: [160.0, 0.0], map0: [160.0, 100.0], map1: [160.0, 100.0], map2: [160.0, 100.0], map3: [160.0, 100.0] }
  - id: debugging
    points: { article0: [0.0, 100.0], article1: [0.0, 100.0], article2: [0.0, 100.0], article3: [0.0, 100.0], source0: [1.5, 1.5], source1: [78.5, 1.5], source2: [78.5, 98.5], source3: [1.5, 98.5], memory0: [81.5, 1.5], memory1: [158.5, 1.5], memory2: [158.5, 60.5], memory3: [81.5, 60.5], map0: [81.5, 63.5], map1: [158.5, 63.5], map2: [158.5, 98.5], map3: [81.5, 98.5] }
  - id: overview
    points: { article0: [1.5, 51.5], article1: [78.5, 51.5], article2: [78.5, 98.5], article3: [1.5, 98.5], source0: [1.5, 1.5], source1: [78.5, 1.5], source2: [78.5, 48.5], source3: [1.5, 48.5], memory0: [81.5, 1.5], memory1: [158.5, 1.5], memory2: [158.5, 48.5], memory3: [81.5, 48.5], map0: [81.5, 51.5], map1: [158.5, 51.5], map2: [158.5, 98.5], map3: [81.5, 98.5] }
zones: [[reading, comparing, debugging, overview]]
strokes:
  - { path: [article0, article1, article2, article3], fill: "#ffd23f" }
  - { path: [source0, source1, source2, source3], fill: "#b8e0a8" }
  - { path: [memory0, memory1, memory2, memory3], fill: "#f4a7b9" }
  - { path: [map0, map1, map2, map3], fill: "#8ecae6" }
decor:
  - { line: [0, 0, 160, 0] }
  - { line: [160, 0, 160, 100] }
  - { line: [160, 100, 0, 100] }
  - { line: [0, 100, 0, 0] }
handles: dots
ghosts: none
view: [-6, -6, 172, 112]
```

Nothing here is about windows. The same numbers could be a camera's position and zoom over a map, the panels open in an emulator, or the scroll position of each article: the views you saved are the examples, and pinching, scrolling or resizing drags you between them. The design for doing this to the whole HyperTIES reader, with "views you were heading toward" to finish a move with one click, is [VIEW-BLENDING.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/ecg/VIEW-BLENDING.md).

The layouts come from `examples/ecg/tools/worlds.py`.

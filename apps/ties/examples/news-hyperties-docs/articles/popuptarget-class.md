---
title: PopupTarget Class
synonyms:
  - PopupTarget
definition: A description and an example of the PopupTarget class.
source: doc/classes/popup.st0
---

A PopupTarget is an unconstrained shape defined by an outline. When touched by the mouse cursor, the shape pops up. The body includes an argument list and an initialization function. The argument list specifies the the X, Y of the translation vector, the expansion ratio, and the raster image for the popup. The initialization function defines /ItemPath, the stencil of the target, as a NeWS function that creates a path. It can also define /HoleColor, the color of the hole left when the target pops up. HoleColor, which is a NeWS color object, defalts to 25% gray.

Today all the information is in a PostScript form but we will later develop additional classes easier to author, and authoring tools to create objects interactively.

Turn the page to see an example of how to use a PopupTarget!

<!-- page -->

Target file miscellaneous.bunny.tn0:

```target
shape: file-view-scroller
to: miscellaneous.bunny.tn0
```

```target
shape: file-view
to: miscellaneous.bunny.tn0
```

In storyboard file example.st0:

`.picture` miscellaneous

`.target` miscellaneous.bunny

nowhere

```target
picture: miscellaneous
shapes:
  - shape: miscellaneous.bunny
    to: nowhere
```

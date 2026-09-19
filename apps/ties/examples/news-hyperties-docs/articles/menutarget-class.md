---
title: MenuTarget Class
synonyms:
  - MenuTarget
definition: A description and an example of the MenuTarget class.
source: doc/classes/menu.st0
---

A MenuTarget is a target that pops up a menu when you click it with the right mouse button.

Today all the information is in a PostScript form but we will later develop additional classes easier to author.

Turn the page to see an example of how to use a MenuTarget!

<!-- page -->

Target file tree-menu.tn0:

```target
shape: file-view-scroller
to: tree-menu.tn0
```

```target
shape: file-view
to: tree-menu.tn0
```

Target file days-menu.tn0:

```target
shape: file-view-scroller
to: days-menu.tn0
```

```target
shape: file-view
to: days-menu.tn0
```

In storyboard file example.st0:

`.font` Helvetica-Bold 24

Tree `.target` tree-menu

nowhere

`.picture` earth

`.target` days-menu

nowhere

Click the right mouse button on these menu buttons:

Tree .target tree-menu nowhere

```target
picture: earth
```

```target
shape: days-menu
to: nowhere
```

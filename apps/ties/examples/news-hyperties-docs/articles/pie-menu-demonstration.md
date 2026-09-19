---
title: Pie Menu Demonstration
synonyms:
  - The Pie Menu Demonstration
  - Pie Demo
definition: A description of the advantages to pie menus, with some example menus to play with.
source: doc/demos/piedemo.st0
---

How to Choose with Pie Menus

Don Hopkins

University of Maryland

Human Computer Interaction Lab

Jack Callahan

University of Maryland

Heterogeneous Systems Lab

```target
picture: framemenu
```

<!-- page -->

Pie menus have their choices positioned in a circle around the menu center.

Pressing a mouse button pops up a menu, with the cursor initially located in a small inactive region at the menu center.

Each choice is adjacent to the cursor, but in a different direction.

Moving the cursor in the direction of one of the choices highlights its label.

Clicking the mouse button selects the currently hightlighted item.

<!-- page -->

Selection is defined by the direction of relative cursor motion between button clicks.

The selection accuracy becomes more precise as the cursor moves further away from the menu center.

The distance may also serve as a parameter to the choice.

<!-- page -->

You can click the right mouse button on the following targets to pop up example pie menus!

The circular layout of a pie menu is very appropriate for certian applications:

Spatially oriented items can be placed in their corresponding directions.

```target
shape: compass-menu
label: "[Compass Menu]"
to: compass
```

```target
shape: tree-menu
label: "[Binary Tree Menu]"
to: tree
```

Pairs of complementary items can be placed in opposite directions.

```target
shape: confirm-menu
label: "[Confirmation Menu]"
to: confirm
```

```target
shape: zoom-menu
label: "[Zoom Menu]"
to: zoom
```

Other natural and intuitive arrangments are possible.

```target
shape: days-menu
label: "[Week Days Menu]"
to: days
```

```target
shape: hours-menu
label: "[Hour Menu]"
to: hours
```

<!-- page -->

Selecting without seeing:

Pie menus do not require a lot of visual attention to use, because they are based on direction of relative mouse movement, instead of absolute cursor positioning.

An experienced pie menu user can make selections quite reliably from a familiar, reasonably sized menu, without even looking at the display!

<!-- page -->

Mouse ahead:

Pie menus work very well with mouse ahead! Mouse ahead is when the user gives commands to the computer with the mouse more quickly than the computer can process, but instead of the computer ignoring the commands, it buffers them, and processes them all in order.

Because it possible to use a pie menu without seeing it, experienced pie menu users are able to mouse ahead through severel levels of nested menus without waiting for them to be displayed.

<!-- page -->

Display suppression:

With mouse ahead display suppression, a menu is not displayed on the screen if the user mouses ahead through it quickly enough.

When the user completely specifies a selection before the computer can display the menu, seeing the menu is no longer necessary, if feedback is not required, or acting on the selection provides feedback. This feature speeds up interaction considerably if the user is fast or the system is unresponsive.

<!-- page -->

Chunking:

Experienced users can learn to "chunk" selection actions into single gestures they can perform quickly and automatically, utilizing mouse ahead display suppression more often than novice users.

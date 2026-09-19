---
title: Visual Representation of Function
synonyms:
  - visual representation
definition: Design principles for the visual representation of pie menu function.
source: cookbook/visual.st0
---

One challenge is to develop a simple, consistent look for visually representing the meaning and function of a pie menu. The graphics and text of the menu, labels, and feedback should convey useful information about the meaning of the items, and the way in which direction and distance are interpreted.

DIRECTION

The cursor's direction from the menu center can be interpreted as a discrete or continuous input.

DISCRETE DIRECTION

Cursor direction can be used to select between several discrete choices. The fewer choices there are, the easier the menu is to select from, because each choice get a bigger slice of the pie. The slices should be delimited to show their bounds, and labeled to show their function.

The labels do not have to be confined within their respective slices, but it is important that no two labels overlap, and that it's obvious which label is associated with which slice.  Textual names or graphical icons can be used as item labels.  Horizontal text labels are better than slanted or vertical text, which is hard to read and can take up a lot of room. Graphical labels can be cryptic and unrecognizable to the inexperienced user, but they can be compact, meaningful, and interesting looking, if well designed.

CONTINUOUS DIRECTION

Direction can also be used as a continuous analog input, so that the menu behaves like a dial.  A menu should have a scale indicating its range of values, or give dynamic feedback of the currently selected value.

DISTANCE

Distance can be used as a continuous analog input, or it can select between one of several discrete "layers" of sub-choices within a slice. A scale, delimiters, or interactive feedback should be used to indicate the value selected by the distance.

→ ~Label Arrangement~

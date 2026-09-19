---
title: Font Selection Menu
synonyms:
  - Font Menu
definition: The description of an application of pie menus to font selection.
source: cookbook/font.st0
---

The second pie menu application that will be described is a set of nested font selection menus (figures 9 and 10).  They are used to choose between one of four font families, and to select the style and size of the font.  The initial menu is labeled with the font family names, "Helvetica", "Courier", "Times-Roman", and "Hershey", shown in the appropriate fonts.

Selecting any one of these pops up a two dimensional submenu to select the style and point size of the font.  The style is selected by the direction, and the point size is controlled by the distance.

The style/size submenus are labeled with four different styles in the top, bottom, left, and right slices. labeled in the appropriate font and style. (Normal (the font family name), Italic or Oblique, Bold, and Bold Italic or Bold Oblique.) The style submenus are orthogonal (except for the Hershey family, which has a different set of styles), so they are simpler to remember.

When the cursor is moved into one of the slices, a point size label is shown in the inner part of the selected wedge. The label is dynamically displayed in the point size selected by the cursor distance, and in the font style selected by the direction.  As the cursor is moved out farther, the label grows larger.  This animated feedback allows the user to see exactly what she will get, before making a selection.

The style/size submenus are designed so that the style is the primary selection, to which the size is an argument.  If the two dimensional style/size submenus were instead arranged as size/style submenus, using direction to select the point size, and distance to select the style, it would be more difficult to change the point size without changing the style.

→ ~Design Principles~

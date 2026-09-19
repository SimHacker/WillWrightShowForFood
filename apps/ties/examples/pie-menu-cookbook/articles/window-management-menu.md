---
title: Window Management Menu
synonyms:
  - window management menu,
definition: The description of an application of pie menus to window managment.
source: cookbook/wm.st0
---

In a graphical environment supporting multiple overlapping windows on the screen, such as the NeWS window system, pie menus can be a very effective interaction technique for window management tasks. They can be used to issue commands to move, resize, and manipulate windows, invoke programs, and control the environment in many ways.

In NeWS, windows generally have a border around them called the frame. When the cursor is in a window's frame, pressing the mouse's menu button pops up a frame menu of window management commands.

The standard frame menu, in linear format, is illustrated in figure 3. The items are grouped in more or less logical order.  The "Move" item lets the user reposition the window with the mouse. "Move Constrained" allows user to indicate either the x or y axis with the next mouse click, and then to position the window horizontally or vertically with the following click.  "Top" brings the window to the top of the stack of overlapping windows, and "Bottom" puts it on the bottom.  "Zap" destroys the window. "Resize" prompts the user to specify two corners of a rectangle, to which the window is moved and reshaped.  "Stretch corner" and "Stretch edge" allow the user to indicate either a corner or an edge with the next mouse click, and then to reposition it with the following click. "Close" replaces the window with a small icon representing the window. "Redisplay" erases and redraws the graphics in the window.

A pie menu with the same functions in the same order as the standard frame menu is illustrated in figure 4. The pie menu has a larger area than the linear menu, and the logical label grouping does not especially take advantage of the circular layout.

The goal was to design a pie menu with the functionality of the standard frame menu, but with its items labeled and arranged so that the menu would be easy to learn and use.

Figure 5 is an illustration of a window management pie menu designed and implemented in object oriented PostScript, for the NeWS window system. The following is an explanation of the rationale behind the choice of functions, labels, and positions.

The items in the window managment pie menu are ~Top and Bottom,~ ~Close Icon,~ ~Paint,~ ~Stretch,~ ~Move,~ ~Reshape,~ and ~Zap.~

→ ~Top and Bottom~

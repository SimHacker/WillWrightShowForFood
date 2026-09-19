---
title: Label Arrangement
synonyms:
  - Arrangement
definition: Design principles for the arrangment of pie menu items.
source: cookbook/arrangement.st0
---

For many applications, a well thought out label arrangement can help to make a pie menu intuitive, learnable, and efficient to use.  This effort is mainly worthwhile with menus that will always have the same number of items, however. (Changing the number of choices in a pie menu changes the direction the choices are in, and requires the user to look at the menu to be sure of the selection direction.) By choosing appropriate and convenient directions, the menu designer can strive to make a menu with a mnemonic layout and a good kinesthetic feel.

INTUITIVE

A pie menu is intuitive if there is an obvious, well known, or natural correspondence between the meaning of the items and their directions, the visual look of the labels and feedback, and the kinesthetic feel of mouse movement and clicks.

LEARNABLE

The learnability of a pie menu can be enhanced by taking advantage of arrangements that the user is already familiar with, such as the positions of the hours on a clock face. A menu with orthogonal submenus, such as the font menu, is simpler to learn than one without such organization.

GOOD KINESTHETIC FEEL

There are several ways to design a pie menu to have a good kinesthetic feel. Since these heuristics may not all be compatible with each other when applied to the design of a particular menu, the menu designer is encouraged to try out the feel of several different layouts first hand. Intellectualization and hand waving cannot replace prototyping and the actual evaluation of hands on experience.

Some input devices favor certain directions of movement, making them easier to indicate than others (Buxton, 1986). In the experiment comparing pie menus with linear menus (Callahan, et all, 1988), it was found that the top and bottom items of an eight-item pie menu could be chosen faster than the other six, by novices using an optical mouse.  Therefore, putting commonly used items in the top and bottom slices of a pie menu can make it more kinesthetically efficient.

Placing a commonly used submenu items in the same direction as the submenu is in its parent menu will enable the user to choose that item without changing the direction of mouse movement. Since the unconstrained movement command in the "Move..." submenu (figure 7) is the most commonly used item, it is placed to the right, in the same direction as the "Move..."  item in the window management pie menu (figure 5).

Some commands will require the user to move the mouse to a new point on the screen and click the mouse button after making a menu selection.  Try to place such items in directions corresponding to the way the user would usually want to move the cursor after making the selection. For example, the corner and edge items in the "Stretch..." submenu are placed in the directions corresponding to the actual corners and edges of the window (figure 6). After the selection is made, the user moves the cursor to a new location for the specified corner or edge, and clicks the button. The new location is often in the same direction as the item, in which case there is less wasted mouse movement.

Another such example is that the vertical and horizontal constrained window movement commands in the "Move..." submenu are the top and left items of the menu, on the axis corresponding to types of movement they select (figure 7). To change a window's vertical or horizontal position, the user selects one of the constrained movement items, and points and clicks at a new vertical or horizontal position, which is commonly in the same direction as the selected item.

→ ~Menu Size~

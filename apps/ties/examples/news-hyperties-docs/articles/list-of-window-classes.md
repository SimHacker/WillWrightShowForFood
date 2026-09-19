---
title: List of Window Classes
synonyms:
  - Window Classes
definition: "A list of the classes of windows used by NeWS HyperTIES for an article's contents, its definition, the control panel, and the interactive Forth system."
source: doc/classes/windows.st0
---

NeWS Forth HyperTIES maintains several ~piles~ of pages on the screen, each displayed in a windows of a particular class, as well as a ~TTY~ window for interacting with the forth system.

The page display windows are all based on class ~TIESWindow~. Windows of class ~TIESContentsWindow~ are used to display the contents of a storyboard. Windows of class ~TIESDefinitionWindow~ are used to display definitions of referenced articles. Class ~TIESControlWindow~ is used for the control panel.

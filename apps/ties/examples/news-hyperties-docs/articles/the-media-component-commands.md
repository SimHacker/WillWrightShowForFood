---
title: The media component commands
synonyms:
  - component commands
definition: The commands marking the different components of the content or description of an article.
source: doc/componentcommand.st0
---

These are the commands marking the different components (pictures, text, sound, etc.) of the content or description of an article.

A media component begins after a component command and ends with the next component command or field command.

The available commands are:

`.text or .text`

Begins a text component. In fact this command is the default component command. Everything which is not a command or its argument is considered text.

`.picture or .PICTURE <name of the picture>`

Begins a picture component. It's followed by an argument which is the name of the picture. (see ~picture name file format~, and ~list of available stamp classes~)

PROJECTS: other media components will be created if the hardware is available (sound, video...)

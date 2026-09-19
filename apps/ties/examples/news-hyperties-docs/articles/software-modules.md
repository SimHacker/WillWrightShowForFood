---
title: Software Modules
synonyms:
  - organization of the software
definition: The parts of the HyperTIES system.
source: doc/software-modules.st0
---

This stuff lives in the directory "ties".

~Master index builder~

Builds the master index by looking at all of the storyboard, picture, and target files in a database.

make-index.c

~Storyboard Interpreter~

Reads in and parses storyboard files. fmt.f

~Formatter~

Figures out where to put everything on the page.

fmt.c

~Index manager~

Maps names of objects and storyboards to parts of the file system.

entry.c entry.h index.c index.h master-index.c master-index.h object.c object.h primitives.c primitives.h tree.c tree.h

~C to PostScript interface~

Handles the layout of text, pictures and targets.

fmt.cps

~PostScript objects and handlers~

Builds display lists, creates objects, sends messages to objects. fmt.ps win.ps stamp.ps target.ps

~Random PostScript utilities~

textcan.ps term.ps hookup.ps

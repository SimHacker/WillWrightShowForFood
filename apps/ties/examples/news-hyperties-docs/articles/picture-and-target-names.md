---
title: picture and target names
synonyms:
  - associated files
definition: The full name used to refer to a picture or a graphic target
source: doc/picandtarname.st0
---

A picture is generally a bitmap or a postcript file, etc... A graphic target could be a bitmap, a rectangle or a shape, but anyway those objects don't have a simple name to refer to them.

For this reason we ask the author of a database to give a name to those objects.  Therefore a picture has a picture name, and a target has a target name. The author creates `.pn0` (for picture names) and `.tn0` (for target names) files to create the link between the name, the class of the object, and the data necessary to display it.  See the articles on ~picture name file format~ and ~target name file format~.

Today, because of the ~Forth formatter~, a picture or target name must end by a new line.

For example, to include a picture in a storyboard you have to say:

`.picture` name of a picture (newline)

For an example, look at the storyboard "spacetel/spacetel.st0" in the space telescope database.

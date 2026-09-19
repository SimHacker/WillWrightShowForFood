---
title: target name file format
synonyms:
  - target files
definition: "Describes the format of the `.tn0` file."
source: doc/tnformat.st0
---

For each target, the target file should include:

target name a (new line)

target class (new line)

body (any number of non-blank lines)

A target file can contain several target descriptions in the above format, separated from each other by blank lines.

The class name determines what type of object the target is. It also tells what information is available in the body and how to read it.

The target name can be any ascii string, enclosed in double quotes. It can include blanks or any punctuation (to embed double quotes, use two double quotes for each one). The name should be on one line. Remember, it is the name that is used in the storyboard.

The body contains all the information to the data necessary to handle the target, or a pointer to the file where the information is.

The `.tn0` file can be anywhere under the root directory of the database.  The author can for example choose to put it "near" the associated storyboard, or in a special directory where all the `.tn0` files are stored.  It is the role of the ~master index builder~ to find them...

<!-- page -->

Today the possible classes are:

~Target~

~MenuTarget~

~PageTrackerTarget~

~PopupTarget~

~ScrollbarTarget~

~SliderTarget~

~TextEditTarget~

~TextCanvasTarget~

~AnimatedTarget~

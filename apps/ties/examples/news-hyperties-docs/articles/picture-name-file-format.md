---
title: picture name file format
synonyms:
  - picture files
definition: "Describes the format of the `.pn0` file."
source: doc/pnformat.st0
---

For each picture, the picture file should include:

target name (new line)

target class (new line)

body (any number of non-blank lines)

A picture file can contain several picture descriptions in the above format, separated from each other by blank lines.

The class name determines what type of object the picture is (eg. A bitmap, a PostScript file, etc...). It also tells what information is available in the body and how to read it.

The picture name can be any ascii string, enclosed in double quotes. It can include blanks or any punctuation (to include double quotes in a name, use two double quotes for each one). The name should be on one line. Remember, it is the name that is used in the storyboard.

The body contains all the information necessary to handle the picture, or a pointer to the file where the information is.

The `.pn0` file can be anywhere under the root directory of the database.  The author can for example choose to put it "near" the associated storyboard, or in a special directory where all the `.pn0` files are stored.  It is the role of the master-index builder to find them...

<!-- page -->

Today the possible classes are:

~Stamp~

~Picture~

~UnitPicture~

~ScaledRaster~

~Raster~

See for example : spacetel/main.image.pn0 or fosexplo/fos.pn0

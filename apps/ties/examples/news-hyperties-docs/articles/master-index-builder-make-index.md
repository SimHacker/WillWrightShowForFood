---
title: master index builder (make-index)
synonyms:
  - make-index program
  - master index builder
definition: A utility program of the compiler which creates the master-index and the index storyboard.
source: doc/makeindex.st0
---

Syntax: .spaces 5  make-index <directory> [ other directories]

make-index scans the directories given as arguments (and, recursively, their subdirectories) for storyboards and associated files.  It uses the ~standard 3 letter extensions~ of those files to perform its search with the UNIX find command.

Today the directory ties/global contains all the defaults storyboards and associated files necessary to run any database, including the control panel description.

You will usually run make index with 2 arguments: your database root directory and global. (eg. make-index doc global)

Make-index also creates or updates the index.st0 (the storyboard of the index article). It builds the article which consists of the alphabetical list of article titles and is accessed with the INDEX option of the control panel.

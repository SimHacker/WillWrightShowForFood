---
title: formatter
synonyms:
  - Forth formatter
definition: The formatter is the main part of the browser. It formats the components of the storyboard to fit in the display windows.
source: doc/formatter.st0
---

Several simplifying assumptions have been made, which impose limits on the browser interface. It is assumed that articles are to be viewed by paging rather than scrolling, so that formatting produces a collection of page images. On more powerful systems, the formatting could be performed at browsing time for resizable and/or scrolling windows.  Finally, a Hyperties database is assumed to be static, i.e.  the contents of a database will not change during browsing.  With a more powerful database management system to handle file requests and arbitrate access conflicts, dynamic databases should be possible as well.

These restrictions, however, are not inherent in the database structure, but have been introduced out of considerations of efficiency in implementation.  In future versions, some of these restrictions may be relaxed.

TECHNICALLY:

Today the formatter is a temporary version written by Don Hopkins in Forth, because it made it easy to implement. Unfortunately it doesn't handle tildes and names with embedded blanks too well... So we had to compensate by using a dot-tilde command, followed by a space, then the button name, terminated by a tilde, so buttons appear as `.~ button~` in the storyboard.

TO BE CONTINUED...

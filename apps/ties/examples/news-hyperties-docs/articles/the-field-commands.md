---
title: the field commands
synonyms:
  - field commands
definition: "A list and description of the field commands of a storyboard ( `.title`, .synonym, etc...)"
source: doc/fieldcommands.st0
---

The field commands separate the main fields of a ~storyboard~. This is the highest level in the hierarchy of commands.

The available field commands are:

`.title or .TITLE`

Indicate the beginning of the ~title~. The title follows one of the above commands and ends in a newline

`.synonyms, .SYNONYM, or .SYNONYMS`

Indicates the beginning of the ~synonyms~. The synonyms follow one of the above commands, one per line until the next field command or the end of the file.

`.content, .contents, .CONTENT, or .CONTENTS`

Indicates the beginning of the ~content~ of the article. The content is everything between one of the above commands and the next field command or the end of the file.

`.note, .notes, .NOTE or .NOTES`

Indicates the beginning of the notes about an article. The notes start after one of the above commands and cause the rest of the file to be ignored.

PROJECTS TO COME: We plan to add other fields like topic, keywords etc..

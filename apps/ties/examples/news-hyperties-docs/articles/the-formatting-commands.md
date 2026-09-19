---
title: the formatting commands
synonyms:
  - formatting commands
definition: The commands used to specify how the media components like text and pictures should be presented.
source: doc/formatcommand.st0
---

Without any formatting commands, the text and pictures will be glued together. Multiple white spaces are reduced to a single blank. .nl .nl

1- text formatting commands:

`.para or .PARA`

Paragraph: equivalent to two newlines and indentation of xxx characters for the first line of the paragraph

`.nl`

Newline

``<a` word>`

The word argument is taken literally, ignoring command or other special characters in it. For example to show the command `.nl,` the author has to write `.quote` .nl

``<a` line>`

Same as quote, but takes the whole line as its argument.

`.spaces <number of spaces>`

Insert N spaces

`.rem`

Remark. The rest of the line is ignored. Used to put comments in a storyboard

PROJECTS:

- a blank line in the storyboard will be equivalent to a newline

- `.table-on/off` will be used to turn-off or turn on the formatting. When the formatting is turned off, the text is displayed exactly as typed.

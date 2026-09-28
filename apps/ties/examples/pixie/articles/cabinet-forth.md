---
title: Forth and the turtle on the cabinet
synonyms:
  - cabinet-forth
definition: "Mitch Bradley's PDP-7 Forth, with turtle graphics on the Type 340, running in this page. Type 4 0 DO 200 FD 90 RT LOOP."
---

A small Forth for the PDP-7 by Mitch Bradley, 2026. See ~PDP-7 Forth~ for where it came from and how it works.

**Type.** Click the teletype paper so it has the keyboard. Each line answers `ok`, or names the word it did not know with a `?`. The teletype is set up for Forth: full duplex, since Forth echoes what it reads, and line input, so you edit a line with Backspace and send it with Return. `WORDS` fits its listing to the paper's width, because the teletype tells Forth how wide it is. ⚙ under the paper shows the settings and the font size; drag the bar under the paper to make it taller.

    2 3 + .
    4 0 DO 200 FD 90 RT LOOP
    : SQ 4 0 DO 200 FD 90 RT LOOP ;
    : FLOWER 8 0 DO SQ 45 RT LOOP ;
    CS FLOWER

The turtle words: `FD` `BK` (pixels), `RT` `LT` (degrees, clockwise is right), `PU` `PD` pen up and down, `CS` clear the screen, `HOME`, `HT` `ST` hide and show the turtle. `WORDS` lists the whole dictionary.

**Demo** reboots and types the pdp7forth README's turtle session: a square, a flower, a star.

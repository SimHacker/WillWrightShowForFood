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

**Names.** A name keeps every letter, up to 31, in SIXBIT, three letters to a word. Each word is laid out the way Open Firmware lays one out: the name, then the header, then the body. The cabinet's Forth is `kernel-names-full.s`, made from Mitch's `kernel.s`, which stays beside it in `packages/cabinet/tapes/pdp7forth/` as the reference the tests compare against; `VARIANTS.yml` says what differs.

**PIXIE rings.** RSPPIX, the 1969 ring structure processor that ~PIXIE~'s SYMELEC is built on, runs inside this Forth, its 1972 code unchanged. Each of its routines is a Forth word (`RSETUP` `RFEL` `RINSRT` `RCAR` `RCDR` `RADDW` `RDELB` and the rest), and `pixie.fs` builds on them. Open RINGS to watch the structure in 3D as you type:

    RSAVINS S" SQUARE" NAMED
    RSAVINS S" TRIANGLE" NAMED
    RSAVINS .RING
    RSAVINS RCOUNT .

`RINGS` starts again with an empty ring at `RSAVINS`, the front door the panel looks through. When the ring area fills, RSPPIX's own garbage collector takes back what nothing reaches; when nothing can be taken back, Forth says `rings full?`.

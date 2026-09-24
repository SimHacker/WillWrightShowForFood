---
title: Drawing with SYMELEC
synonyms:
  - cabinet-symelec
  - draw a line
definition: "How to draw with Heinz Lemke's 1972 SYMELEC on the emulated PDP-7: tap S, pick a line type, drag the cross, tap F."
---

Everything on the tube is drawn by SYMELEC, ~Heinz Lemke~'s 1972 PIXIE program, run from his listing. Your mouse is the light pen.

- **The + in the middle** is the tracking cross. It follows the pen. How it does that is ~Tracking~.
- **The letters around it** are a radial menu, the earliest known one.
- **The column on the right** is the command menu. IN, SC, CA, RE and RO act on a selected element, so on an empty picture they do nothing.

**Draw a line.** Press on the cross and drag slowly; too fast and the cross is left behind.

1. Tap **S**, upper left of the cross. It turns into **F**: an element is open.
2. For a straight line tap **RU** on the right; the default, HV, draws in steps.
3. Drag. Let go and drag again for the next corner.
4. Tap **F** to finish.

Tap, don't hold. SYMELEC reads a menu item still under the pen about half a second later as a second tap, so a held S opens the element and closes it again. A light pen was touched to the glass and taken away; the page turns a click into the same short touch. The story is in the ~Bug journal~, "S would not stay F".

A lit line the pen passes over catches the cross, so carry it around the picture, not across it.

**Demo** reboots and lets a scripted pen draw a house, a sun, a tree and a circuit. Every stroke is SYMELEC's; the script only moves the pen. The picture then nearly fills memory: one or two more elements and SYMELEC starts over, blank.

**The readout** at the top right is the pen position, read from SYMELEC's own variables at 5641 and 5640. **Memory**, source view, shows the 1972 listing with 👉 on the line the PDP-7 is running.

The three words this page patches, and why, are in the ~Bug journal~. How 128 pages of printout became the file the page loads is the ~Transcription report~.

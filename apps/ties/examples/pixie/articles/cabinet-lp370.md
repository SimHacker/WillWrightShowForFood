---
title: The light pen test
synonyms:
  - cabinet-lp370
  - lp370
  - light pen diagnostic
definition: "DEC's Type 370 light pen diagnostic, C. Stein, 1964, assembled in the page from a hand transcription. Three tests, chosen with the console switches."
---

DEC's diagnostic for the Type 370 light pen on a Type 340 display, written by C. Stein and dated 29 April 1964. A service engineer ran it to check the pen. Every error is visual: you look at the tube and judge.

The page assembles it from a hand transcription of the listing each time it boots. Page 6 of the only known scan is missing, so the code at 22 that reads the switches is reconstructed from how the surviving pages use it, and marked as not DEC's.

**Pick a test with the console switches.** A test runs while its switch is up; set more than one and they take turns. Hover a switch for its name.

1. **Switch 1, sensitivity.** Eight horizontal lines at intensities 0 to 7. Press the pen on a line right of centre and the line stops at the pen. Left of centre it is drawn in full: the display resumes after the hit.
2. **Switch 3, follow.** A tracking cross follows the pen and stops at the edge of the screen. It is steered by where on its arms the pen saw it.
3. **Switch 5, field of view.** A box of points, placed by switches 7 to 9 (x) and 11 to 13 (y), at the intensity of switches 15 to 17. Beside it, four times larger, the points the pen saw, and above that a count. Switch 0 down removes the count.

**Demo** reboots and walks through the three tests, setting the switches and placing the pen.

**The readout** is the last point the pen saw, x and y in octal, and the count, read from the program's variables `xpt`, `ypt` and `lpct`. **Memory**, source view, is the transcription the page just assembled.

Running it taught the emulator something: the pen used to latch the end of a line instead of the point it saw, and the follow test's cross never moved. That and the reconstructed page are in the ~Bug journal~, rung 7.

# 370 Light Pen Diagnostic (DEC-4-45-M, 7-78-M)

C. Stein, DEC, 29 April 1964. A PDP-4 library program, also issued for the PDP-7, that tests the
Type 370 light pen on a Type 340 display. It starts at location 22. All error detection is visual.

Source: `characters/heinz-lemke/sources/pdp7-reference/DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf`
(bitsavers). No paper tape image is known.

- `lp370.s`: the diagnostic, listing pages 7–15.
- `outnox.s`: the octal/decimal readout routine, listing pages 16–20, assembled separately.

Both are hand transcriptions in DEC PDP-7 assembler syntax. `/?` marks a doubtful reading.

## Page 6 is missing

The scan jumps from page 5 to page 7. Page 6 held the start of the listing: the code at 22 that
reads the AC switches and dispatches to the three tests, the interrupt linkage at 0–1, the field of
view setup that falls into `bthsid`, and the storage for `temp1`, `temp2`, `lpct`, `noswit`,
`bufdon`, `bufd1`, `hole`, `xpt`, `ypt`, `x1`, `y1`, `mag` and `sign`. It must be reconstructed from
the test descriptions on pages 3–5 and from how the surviving code uses those symbols. The
reconstruction is `page6.s`, marked as not DEC's code; its header says what the surviving pages
fix and what is a choice. `lpct`, `xpt` and the other storage are left undefined and the assembler
allocates them after the literal pool, as OUTNOX already requires for `t1x`..`t69x`.

## Assembling and running

`src/lp370.ts` assembles `page6.s`, `lp370.s` and `outnox.s` in that order with `src/asm.ts` and
boots at 22 with the AC switches set. `src/lp370.test.ts` runs all three tests against the cabinet.
In the browser it is the "Type 370 light pen test" entry in the cabinet applet's program menu, with
the console switches under the tube.

## Tests

1. Sensitivity and resume (`senst`): eight horizontal vectors, intensities 0–7. The pen truncates
   a line right of centre; left of centre the line resumes in full (IDRS, `iot 504`).
2. Follow (`follow`): a tracking cross that follows the pen and stops at the screen edge.
3. Field of view: a box of points at a switch-selected position and intensity, with a 4×
   enlargement of the points the pen saw and a decimal count above it (`outnox`).

## IOTs against the cabinet's Type 340

The cabinet models 501 (v-edge skip), 504 (resume), 601 (stop skip), 606 (load address and go),
701 (pen skip), 712 (read beam coordinates) and 1001 (h-edge skip), taken from SYMELEC's usage.
The diagnostic also uses 704, before every interrupt dispatch, and 716, to read coordinates after
a pen hit. 704 clears every flag and leaves the display stopped (SIMH's `ty340_clear(~0)`); 716 is
712 and 704. Running the diagnostic also showed the pen latched the wrong point: see
[BUG-JOURNAL.md](../../BUG-JOURNAL.md), rung 7.

# Cause and effect: source maps, extended in both directions

Web developers debug minified JavaScript through source maps: the browser shows the TypeScript line
that produced the code that is running. The cabinet takes that idea in two directions. Down the
build, it maps every word in core to its source line, in whichever assembler dialect it was
written, and on to the line on the scanned page of the printed listing. Along time, it follows a
single event from the person at the machine, through the hardware and the software, to the light
on the screen, and back through the light pen to the person.

Both are needed for preservation and for teaching. A preserved program should be checkable against
its documents, and its documents against the running program. And anyone watching it should be
able to ask "why did that happen?" and follow the answer to its cause.

This page gathers ideas already in [DESIGN.md](DESIGN.md#source-maps-as-transclusion-layers-spans-links),
which links core to source to scan, and in the portrait's
[scene player](PORTRAIT.md#scene-player-bodies-devices-and-connected-time-scales), whose
"From pen contact to executing source" follows one interaction from the pen on the glass to the
scanned listing and back to the operator's next move. It lays the chain out layer by layer and
says what runs today.

## Down the build: from core to the scanned page

```
word in core  →  source line (Cambridge 1972, DEC 1964, or as7)  →  listing line  →  scanned page
```

- The assemblers share one back end, so every dialect produces the same symbol table and source
  map ([ASSEMBLERS.md](ASSEMBLERS.md)); `source.ts` turns it into the memory panel's `source` and
  `code` views.
- One source line can become several words, several lines one word, and some words have no source
  at all (literals, variables, return addresses). A word that no longer matches its source, because
  the program patched itself or a variable changed, is marked as differing from the original.
- The listing line points at the page and rectangle in the scan, which never change.
- This is how the OCR errors in PIXIE were found: assemble the transcription, run it, and see where
  the running machine disagrees with the paper ([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md)).

The general form, with typed links between spans of any two layers (core, source, listing, scan,
documentation), is in [DESIGN.md](DESIGN.md#source-maps-as-transclusion-layers-spans-links).

## Along time: from a hand to the phosphor and back

A light pen press, followed through the machine:

| | Layer | In the cabinet today |
|---|---|---|
| 1 | The person, their body, the chair, the console, the room | Planned: the [portrait](PORTRAIT.md) and its scene player |
| 2 | The physical input device and its chassis: light pen, Teletype, console switches, a hand | Virtual devices bound to real ones: a mouse or touch as the pen, a keyboard as the Teletype, a webcam hand as the [DataHand](HAND-TRACKING.md) (device 57) |
| 3 | The sensor: the pen's photocell, the switch contact, the camera | The light pen sees a stroke within its aperture ([TRACKING.md](TRACKING.md)); a photocell model is planned in [BEAM-AND-PEN.md](BEAM-AND-PEN.md) |
| 4 | The device flag and register | Each device's flag on the backplane; the 340's status bits, including the pen hit |
| 5 | Polling or an interrupt | Skip IOTs that test a flag; the interrupt line ORs every device's request |
| 6 | IOT transfers and the display's own memory access | IOTs on the bus; the 340 fetching its display file from core |
| 7 | The handler | Mapped to source and scan: PIXIE's light pen dispatch, Forth's device words |
| 8 | The driver and the layers above it | Mapped to source: the routines a handler calls, up to the program |
| 9 | The program's decision | Mapped to source: what PIXIE or the Forth program does with the hit |
| 10 | The renderer: the display file the program builds | The display file in core, editable while it draws |
| 11 | The display processor | The Type 340, ported from SIMH; every stroke carries the display-file address and the backplane cycle that drew it |
| 12 | The phosphor | A phosphor pass draws the stroke stream, with strokes grouped as the program built them (`hover.ts`); the P7's two phosphors, a fast blue flash the pen sees and a slow yellow-green glow the eye sees, are planned in the [portrait](PORTRAIT.md#the-tube-phosphor-on-curved-glass) |
| 13 | The light pen again | Its next hit closes the loop at layer 3 |

The screen is both output and input, so the chain is a loop, which is what made the light pen
interesting in 1964 and what makes it a good teaching machine now.

Pieces 3 to 12 run today, and most links in that span can already be followed by hand: a stroke
gives its display-file address and cycle, the address gives the source line and the page, and the
instruction trace gives the code that ran. What is missing is the record that joins them: each
event stamped with its cycle and linked to the event that caused it, kept so the whole chain can be
replayed, stepped and scrubbed. That record is the scene player's history in
[PORTRAIT.md](PORTRAIT.md#scene-player-bodies-devices-and-connected-time-scales), with the build
links of [DESIGN.md](DESIGN.md#source-maps-as-transclusion-layers-spans-links) attached to every
event that executes code.

The same chain runs through any machine the cabinet hosts. On an Apple ][ the most beautiful
stretch is layers 10 to 12: the video circuitry reading screen memory and turning it into NTSC, with
Woz's tricks for colour and timing. Don proposed showing exactly that in a November 2018 letter to
Paleotronic's editor, Melody Ayres-Griffiths, after seeing microM8 draw pixels in 3D: "a 3d diagram
representing all the logic and circuitry behind the pixels, reading from video memory and mutating
it into NTSC video, like a cybertronic rube goldberg device, to illustrate the brilliance of WOZ's
hardware design." With microM8 as a federation peer ([MICROM8.md](MICROM8.md)), that becomes a
view the cabinet can build over a running Apple.

## Views are authored

The machine, the program and the event history are shared and never change. How a person looks at
them is their own work: where the camera is, how fast time runs, which seam to slow down at, which
links to follow from a stroke to a source line to a scanned page, and what to say along the way. In
the portrait these are views and tours, user-editable content with an author, provenance and
history, stored on their own track so two people can explore the same recording without altering
it, and linked from an article by URL ([PORTRAIT.md](PORTRAIT.md#a-camera-you-can-inhabit-steer-and-record)).

A tour of the chain is the same kind of thing. A teacher's walk from Heinz's hand through the
interrupt to the handler's line in the scanned listing, a historian's path from a scan to the stroke it still draws, and
a student's first attempt at the same question are three readings of one machine. Each is worth
keeping, crediting and sharing, and each can be taken over and steered by someone else, who
records their own.

## What it is for

- **Preservation.** David Rosenthal's 2015 report separates execution fidelity, whether the
  emulation runs the program correctly, from experiential fidelity, whether using it is like using
  the original ([notes](../../characters/david-rosenthal/sources/rosenthal-emulation-2015.md)).
  The build maps check the first against the documents. The chain from the room to the phosphor is
  how the second can be shown, and every step points at its evidence: a scan, a manual, a schematic
  or a recording.
- **Teaching.** Start from anything and go either way. Why is that dot there? Follow it back to the
  display file, the code that wrote it, the pen hit that ran that code, and the hand that moved the
  pen. What happens when I press here? Follow it forward to the light.
- **Debugging.** The same links give the trace, the memory panel and the debugger their sources,
  and turn "the emulator disagrees with the listing" into a finding.

## Order of work

1. Event records with cycle stamps for device flags, interrupts and IOTs, alongside the stroke
   log that already has them.
2. `caused-by` links between events: pen hit to flag, flag to the skip or interrupt that tested it,
   handler entry to the display-file words it wrote, those words to the strokes.
3. A chain view in the page: click a stroke and walk back to the input, or press the pen and walk
   forward, with each step opening its source line and scan.
4. Tours that record a walk through the chain, with camera, time scale and annotations, saved as
   authored content beside the portrait's tours.
5. Real memory-cycle timing, so the chain's times are the machine's (the same prerequisite as the
   [AM radio](AM-RADIO.md)).
6. The scene player's people, furniture and room at layer 1.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [PORTRAIT](PORTRAIT.md) · [TRACKING](TRACKING.md)

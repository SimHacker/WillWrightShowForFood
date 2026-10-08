---
title: PIXIE tutorial
synonyms:
  - pixie-tutorial
  - symelec tutorial
  - demo script
definition: "A walkthrough of everything SYMELEC can do in the emulator, in an order you can follow while recording a screen demo."
---

This tour covers ~Heinz Lemke~'s 1972 SYMELEC from start to finish, in the emulator at [hyperties.org/cabinet/symelec](https://hyperties.org/cabinet/symelec/). It follows his PIXIE user manual (thesis appendix 4), and every step below was checked against the running program. Each section is one take: what to do, then what to say.

## Before you record

- Open the cabinet. Turn on the panels you want in shot: **PLAY**, **TTY**, **RINGS** and **MEMORY**. Shift-click a chip to show that panel alone.
- Leave the speed at 1×.
- **Tap, don't hold.** SYMELEC reads a button still under the pen as a second tap, so if you hold S it opens the element and closes it again.
- **Drag slowly.** The cross follows the pen only as fast as its search raster can find it.
- **Go around lit lines, not across them.** A lit line the pen passes over catches the cross.
- **Memory is small:** room for 35 to 50 nodes and branches. To start clean, drag **RESET** down or type `START`.

## 1. The screen

*Say:* "This is a PDP-7 with a DEC 340 display, running the program from Heinz Lemke's 1972 listing. My mouse is the light pen."

- The **+** is the tracking cross. It is always live to the pen, in either mode.
- The **six letters around it** are the control buttons. They move with the cross, so your hand is always near them: a radial menu, in 1972. They show only what is legal right now.
- The **right-hand column** holds the twelve command buttons: DR, HV, RU and SF for drawing; PO, AT, IN, SC, CA, RE, RO and EN for pointing.
- **PIXIE** sits at the lower left. Leave it alone for now (§9).
- The readout at the top right is the cross position, read live from SYMELEC's own variables.
- Hover over anything on the tube and a tooltip names it, quoting the manual.

## 2. Moving the cross

Press on the + and drag it somewhere empty. Nothing is drawn, because no element is open.

*Say:* "The cross follows the pen. Between elements it moves without ink."

## 3. A line: S, drag, F

1. Tap **S**, upper left of the cross. It turns into **F**: an element is open.
2. Drag. A trail of light follows. HV, the default, turns the path into horizontal and vertical steps.
3. Let go and drag again. Every release is a corner.
4. Drag back over the trail: it undraws. Corrections cost nothing until you finish.
5. Tap **F**. The element freezes and is compiled into the picture.

*Say:* "S starts a segment and F finishes it. Same button: it changes its letter."

## 4. Straight lines: RU

Move the cross away, tap **S**, then tap **RU** in the right column. Drag: one rubber-band line at any angle, from the start to the cross. Tap **F**.

The mode stays set until you tap another, so tap **HV** to go back to stairs. A diagonal drag in HV makes a staircase.

The program helps your aim:
- A corner closer than about 25 units to the last one is dropped.
- An end near an existing node snaps onto it.
- S or F next to a branch, but not on one of its terminals, is refused.

## 5. Components: R, C, L, S; A for V, I, U, O

With an element open in HV mode:

1. Draw a short wire.
2. Tap **R**. A resistor goes in at the cross, turned to the direction you were drawing.
3. **Draw some line before the next component.** A symbol needs wire on both sides, so a second component tapped straight after the first does not go in.
4. Tap **C** for a capacitor, draw more wire, then tap **L** for an inductor, or **S** for a switch. This S is the ring's lower-right S, not the S/F button.
5. Tap **A**. The ring changes to the second set: **V** voltage source, **I** current source, **U** nullator, **O** norator. **B** brings the first set back.
6. Tap **F**.

Each component gets a type number automatically, for programs on Titan to read: R 1, C 2, L 3, V 4, I 5, S 6, O 7, U 10.

*Say:* "Components are just part of the line you're drawing. Wire, resistor, wire, capacitor, wire."

## 6. Pointing mode: blink, M and L

1. Tap **PO**. The ring changes to **C E T M L G**.
2. Tap a line in the picture. Part of the picture blinks, about twice a second. At first the whole schematic blinks.
3. Tap **L** ("less"), then tap the line again: now only the node or branch you hit blinks. Tap **L** again and re-tap to go down one more level. **M** ("more") goes back up.

   Every button turns the blink off, so tap the picture again after M or L.
4. At the lowest level, a single line, the teletype says **NOTE 6** when you try something that cannot apply to a line, such as naming it. Tap **M** to go up a level.

*Say:* "The drawing isn't pixels. It's a model, schematic, nodes, branches, lines, and M and L walk up and down it."

## 7. Names and data on the teletype

With something blinking, click the **TTY** panel and type. Each line ends with Return.

| You type | It does |
| :-- | :-- |
| `R1` | Names the blinking instance R1. Every new instance starts with a two-digit name, 00 to 99. |
| `/10K` | Adds the line `10K` to the instance's parameter data. |
| `:RESISTOR` | Sets the type of its subpicture, the prototype every copy shares. |
| Return on its own | Lists the name, the data and the type: `R1`, `10K`, `:RESISTOR`. |
| `?` before Return | Cancels the line. |

*Say:* "An instance has a name and data. Its subpicture, the prototype every copy points to, has a type. That's 1972 object-oriented graphics."

## 8. Edit: C, T, E, G, EN

With something blinking:

- **T** moves it: drag the cross, and the object follows at a fixed offset.
- **C** copies it, then you are carrying the copy.
- **E** erases it.
- **G** adds it to the current group. Blink several pieces and press G after each.
- **EN** ends the group and turns the blink off.

## 9. Your own symbols: CA, RE, RO, AT

1. Draw a shape. Blink it, at a level below the whole picture.
2. Tap **CA** to catalogue it as a new basic symbol. **RE** makes a half-size copy and **RO** a copy turned 90°; neither of those copies has terminals.
3. Put the cross on each terminal in turn and tap **AT** to make it an attachment point.

If you blink the whole schematic, CA gets **NOTE 7**: tap **L** first.

**IN** and **SC** are in the menu but were "not yet implemented" in 1972.

Tapping **PIXIE** at the lower left deletes the drawing-mode control buttons and IN, SC, CA, RE and RO, to free core for a bigger drawing. There is no undo except a reboot.

## 10. Teletype commands

These work only while nothing blinks: tap **EN** or **DR** first. The first three letters of a command are enough.

| Command | Effect |
| :-- | :-- |
| `LABEL` | Writes every instance's name on the picture. |
| `UNLABEL` | Removes the names from the screen; the model keeps them. |
| `GRID` | Snaps drawing to an invisible grid about 0.1 inch apart. LABEL, UNLABEL or START turns it off. |
| `TITAN` | Freezes PIXIE and sends the ring structure down the link to the Cambridge Titan, here ~Tiny Titan~. Return thaws it. Draw something first: TITAN on an empty picture crashes the 1972 program. |
| `START` | A clean start: a blank frame. |

PIXIE answers `?` to anything else.

## 11. Messages

| | |
| :-- | :-- |
| NOTE 1, 2 | Out of data-structure or display-file space. Save to Titan, or stop drawing: SYMELEC soon starts over on its own. |
| NOTE 3, 4, 5 | Titan link errors: checksum, not PIXIE data, file too large. |
| NOTE 6 | That command cannot apply to a single line. Tap M. |
| NOTE 7 | That command cannot apply to the whole schematic. Tap L. |
| NOTE 8 | The working stacks are full. |

## 12. The rings in 3D

Open **RINGS**. This panel is the data structure itself, read live from core between BEG and END, starting from SAVINS. It is not the display file.

- On a blank frame the panel is empty.
- One line is about 20 cells. A wire with a resistor is about 60.
- Cells are green and blocks purple. Car pointers are blue, cdr links green, and the yellow link is where a chain closes into a ring. Cells that just changed flash white.
- Drag to turn the model, scroll to zoom, and hover to read a cell's address and words. Click a cell to open it in **MEMORY**.
- **spin** toggles the slow turn. **file** loads a saved ring image (YAML, JSON or a transfer stream) instead of live core.

*Say:* "Every stroke you draw is a few dozen list cells. This is what went down the wire to Titan."

Draw with RINGS open and the structure grows each time you tap F.

## 13. The program running

Open **MEMORY** and choose the **source** view: the 1972 listing, with 👉 on the line the PDP-7 is running right now. The **1972 listing**, **Cambridge source** and **as7 translation** are each one line of code per row, with the scanned printout page beside it. **REGS** is the front panel: switches, AC, PC and device flags.

*Say:* "That's Heinz's code, transcribed word for word from 128 pages of lineprinter paper, running."

## 14. The demo, and recording

- **DEMO** (in **PLAY**) reboots and lets a scripted pen draw a house, a sun, a tree, a hedge, a circuit and a flag. Captions explain each move. Every stroke is SYMELEC's; the script only moves the pen. Afterwards memory is nearly full.
- **⏺️** reboots and records your switches, keys and pen until you press it again. **📼** replays the recording from a fresh boot. **⬇️** downloads it as JSON.

Time is counted in machine cycles, so a replay draws the same picture at any speed. A good way to film: record your session first, then replay it at 1× while the screen recorder runs.

- Copy screen copies the tube to the clipboard as a PNG. Print screen saves it as SVG.

## A five-minute take

1. Screen tour (§1). Drag the cross (§2).
2. An HV wire with **R**, more wire, then **C**; tap **F** (§3, §5).
3. **S RU**, one diagonal, **F** (§4).
4. **PO**, tap the resistor, **L**, re-tap until only it blinks (§6).
5. Type `R1`, `/10K`, `:RESISTOR`, then Return to list them (§7).
6. **T** and move it; **EN**; type `LABEL` (§8, §10).
7. **RINGS**: turn it, hover over a cell (§12).
8. **MEMORY** source view (§13).
9. **DEMO** to close (§14).

More: ~Drawing with SYMELEC~, ~Tracking~, ~Tiny Titan~, ~Bug journal~, ~The listing~, ~PIXIE~.

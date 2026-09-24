---
title: PIXIE live
synonyms:
  - symelec
  - pixie live
  - the running pdp-7
definition: "SYMELEC, Heinz Lemke's 1972 PIXIE program, running on an emulated PDP-7 and Type 340 in this page. Press and drag on the tube: the mouse is the light pen."
---

```yaml cabinet
title: PIXIE, 1972, on a PDP-7 and 340 display emulator.
machine: pdp7
program: symelec
boot: idla
pens: [pointer]
mode: honest
size: 512
```

**What you are looking at.** Everything on the tube is drawn by SYMELEC, running on an emulated PDP-7 and Type 340 display. Your mouse is the light pen.

- **The + in the middle** is the tracking cross. It follows the pen.
- **The letters around it** are a radial menu, the earliest known one.
- **The column on the right** is the command menu. IN, SC, CA, RE and RO act on a selected element, so on an empty picture they do nothing.

**Draw a line.** Press on the cross and drag slowly; too fast and the cross is left behind.

1. Tap **S**, upper left of the cross. It turns into **F**.
2. For a straight line tap **RU** on the right; the default, HV, draws in steps.
3. Drag. Let go and drag again for the next corner.
4. Tap **F** to finish.

A lit line the pen passes over catches the cross, so carry it around the picture, not across it.

**Demo**, under the tube, reboots and lets a scripted pen draw a house, a sun, a tree and a circuit. Every stroke is SYMELEC's; the script only moves the pen. The picture then nearly fills memory: one or two more elements and SYMELEC starts over, blank.

**Under the tube.** The top row is the PDP-7 console: the eighteen AC switches, ⏸️ stop and ▶️ run, and 🔄 reset. Below it, the program menu, speed (**1×** is the real PDP-7), 🖨️ to save the tube as SVG and 📷 to copy it as a PNG. Then the program's own rows: Demo, ⏺️ to record what you do, 📼 to replay it, and a live view of core. The menu also has DEC's 1964 light pen test, whose Demo walks through its three tests, and DUEL, spacewar for two on one keyboard.

The three words this page patches, and why, are in the ~Bug journal~.

**Where to go next.**

- ~PIXIE~ — the PIXIE database: who made it, the films, and the plan.
- ~Heinz Lemke~ — co-author, 1969; the listing this page runs is his.
- ~Bug journal~ — every bug found getting here, including the one-digit transcription errors that running the program exposed: one of them made every line invisible.
- ~Transcription report~ — how 128 pages of 1972 printout became the file this page loads.
- ~The emulator~ — how the browser PDP-7 was built, and the desktop SIMH bench that checks it.
- ~Lars Brinkhoff~ — the Type 340 character glyphs the display draws with.
- ~playground/HyperLook~ — why a HyperTIES page can host a running machine at all.

**The real thing, 1969.** Heinz Lemke on the light pen in Cambridge, from the two PIXIE demonstration films that David Chapman at Cambridge University Library found and had digitized in 2019. I cut the highlights to Yuja Wang playing *Flight of the Bumblebee*, to show how fast PIXIE's radial menus were.

```yaml youtube
id: jDrqR9XssJI
title: Flight of the PIXIE
caption: "Flight of the PIXIE — Wiseman, Lemke, Hiles, 1969. Film: Cambridge University Library. Edit: Don Hopkins."
```

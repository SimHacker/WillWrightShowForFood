---
title: PIXIE live
synonyms:
  - symelec
  - pixie live
  - the running pdp-7
definition: "SYMELEC, Heinz Lemke's 1972 PIXIE program, running on an emulated PDP-7 and Type 340 in this page. Press and drag on the tube: the mouse is the light pen."
---

**PIXIE, 1972, running.** Press and drag on the tube.

```yaml cabinet
machine: pdp7
program: symelec
boot: idla
pens: [pointer]
mode: honest
size: 512
```

**What you are looking at.** The picture is drawn by the program, not by this web page: SYMELEC's own display file, executed by an emulated Type 340 vector display. Nothing on the tube is a web button.

- **The column on the right** is PIXIE's lightbutton menu: DR, HV, RU, SF, PO, AT, IN, SC, CA, RE, RO, EN. IN (intensity), SC (scale), CA, RE (reduce) and RO (rotate) act on a selected element, so on an empty picture they do nothing. That is the 1972 behavior, not a fault.
- **The + in the middle** is the tracking cross. The faint square around it is the small search raster: a light pen only sees light, so the program draws something for the pen to see and moves it wherever the pen goes. Every pen hit, including a hit on a lightbutton, turns the raster up to full brightness; the next display stop turns it back down. That is why it flares while you hold the button.
- **The letters around the cross** are the control lightbuttons that ride with the cross: the earliest known radial menu. The buttons on the right change which letters it shows. While the pen sits on the cross they are not drawn, so they dim while you drag.
- **PIXIE at the bottom left** is a patched word. The 1972 listing has `201128` there, which contains an 8 and is not an octal number. The assembler printed `*DECIMAL DIGIT IN OCTAL NUMBER` and stored 0, so the machine as printed draws garbage before "IE". Heinz circled it in pencil, dated it 12.7.72 and ticked it. This page loads the listing exactly as printed, then patches that one word to `201130`, P I X in the 340's character code. Add `patches: []` to the cabinet block to see the 1972 garbage.

**How to drive it.** Press on the cross and drag slowly; the cross follows because SYMELEC's tracking loop recenters it on every pen hit. Move too fast and the pen outruns the search raster, so the cross stays behind: the authentic way to lose it. Let go and the pen is lifted; it sees nothing.

**Draw a line.**

1. Tap **S** in the ring, the letter at the upper left of the cross. It turns into **F**: you are drawing.
2. Lines step horizontally and vertically by default (HV). For a straight line, tap **RU** in the right column now, before you move.
3. Drag the cross. The line follows it. Let go and drag again for the next corner.
4. Tap **F** to finish.

For now one line is all you get: after F, SYMELEC hands the element to Titan and waits, and the emulated Titan does not answer that yet. Reload the page to start over.

The caption under the tube shows the speed, the pen, and where the cross is. **1×** runs the PDP-7 at its real speed; tap it for 10× or max. **Print screen** saves the picture as SVG, each stroke tagged with the display-file address that drew it.

**Where to go next.**

- ~pixie/PIXIE~ — the PIXIE database: who made it, the films, and the plan.
- ~pixie/Heinz Lemke~ — co-author, 1969; the listing this page runs is his.
- ~pixie/The emulator~ — how the browser PDP-7 was built, and the desktop SIMH bench that checks it.
- ~pixie/Lars Brinkhoff~ — the Type 340 character glyphs the display draws with.
- ~HyperLook~ — why a HyperTIES page can host a running machine at all.
- ~Playground~ — the other demos.

**The real thing, 1969.** Heinz Lemke on the light pen in Cambridge, from the two PIXIE demonstration films that David Chapman at Cambridge University Library found and had digitized in 2019. I cut the highlights to Yuja Wang playing *Flight of the Bumblebee*, to show how fast PIXIE's radial menus were.

```yaml youtube
id: jDrqR9XssJI
title: Flight of the PIXIE
caption: "Flight of the PIXIE — Wiseman, Lemke, Hiles, 1969. Film: Cambridge University Library. Edit: Don Hopkins."
```

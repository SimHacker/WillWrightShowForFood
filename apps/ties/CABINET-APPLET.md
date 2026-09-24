# The cabinet applet — a running PDP-7 inside a HyperTIES article

The lineage demo, closed into a loop: HyperTIES (1988, the embedded-menu
ancestor) transcludes PIXIE (1969–72, the radial-menu ancestor) **running
live** — SYMELEC's own lightbutton ring on the Type 340, operated by the
reader's pointer standing in as a light pen. The menus are not a
screenshot and not a re-creation; they are the 1972 display file,
executed, pen-tested, drawn.

This fulfils [WEB-BENCH](../../packages/cabinet/WEB-BENCH.md) item 8
("a cabinet manifest per page, PCjs-style") with a mechanism the ties
app already owns: the fenced YAML applet block.

## The block

````markdown
```yaml cabinet
machine: pdp7                  # cabinet plugin set
program: symelec               # first program on the menu: symelec | lp370 | duel
boot: idla                     # run until the display starts, then settle
pens: [pointer]                # reader's pointer joins the quiver
mode: honest                   # honest | assist (DESIGN.md pen modes)
size: 512                      # CSS pixels; grid is always 1024
```
````

Same contract as every ties applet: **a reader that has not loaded the
applet module still shows readable YAML** — graceful degradation, the
house rule. A reader that has loaded it replaces the block with a live
tube.

## The component

`CabinetApplet.svelte`, thin by design — every hard part already exists
in [`@wwsff/cabinet`](../../packages/cabinet/):

- boot: `loadOct` both files, run in chunks off-thread-friendly budgets
  until `IDLA` (the same chunked loop as the acceptance test);
- draw: stroke the segment log to a canvas each `requestAnimationFrame`,
  cycles-per-frame budget, pause on `visibilitychange`;
- pen: `setPointerCapture` + `touch-action: none`, pointer position →
  `LightPen.point()` in grid coordinates; `pointerType === "pen"` and
  touch get wider apertures (WEB-BENCH item 6);
- print screen: a control that downloads `toSvg(lastFrame)` — every
  reader can take home a provenance-carrying snapshot.

No new emulator surface. The applet consumes the same four seams as
every other consumer: loader, run budget, segment log, pen input.

## Programs

The caption has a program menu; `program:` in the block picks the first
one. Each entry in `src/lib/cabinet-programs.js` loads its tapes, adds
the peripherals it needs, deposits itself and sets the console:

| id | What | Loaded from |
|---|---|---|
| `symelec` | PIXIE's SYMELEC, 1972 (the default; Demo draws a house and a circuit) | the `.oct` transcription and its literal pool |
| `lp370` | DEC's 370 light pen diagnostic, 1964 (Demo walks through the three tests) | `packages/cabinet/tapes/lp370/*.s`, assembled in the browser by `src/asm.ts` |
| `duel` | DUEL, two-player spacewar | `tapes/duel/rim.pt` and `duel.pt`, read in through the RIM loader and a paper tape reader |

Programs that read the AC switches get a row of eighteen switch buttons
under the tube, bit 0 on the left, grouped in threes like the console,
with the octal value at the end. Named switches are outlined; hover for
the name. DUEL also maps keys to switches while the tube has focus
(click it): A D W S Q for the left ship, the arrows and / or Enter for
the right. A held key holds its switch down, which is DUEL's active
state. Text is inlined with `?raw` and tape with `?url&inline`, so the
offline bundle carries every program.

The rows under the tube keep one order: the console switches, the menu
row (program, readout), then the program's rows: Demo and the
recorder, key help, and the Memory drawer. The drawer's header is the
machine's controls and stays visible when the drawer is closed:
⏸️/▶️ Stop/Run, ⏭️ Step (stop, then one instruction), speeds .01 .1
1 10 max (1 is a real PDP-7), 🔄 Reset, and at the right the outputs,
🖨️ SVG and 📷 PNG to the clipboard. Reset is pulled, not clicked: drag
it down its track and let go at the bottom, or press arrow down four
times; letting go early puts it back. Opened, the drawer is a core
browser, live while open, with four views. 👉 marks the PC in code,
source and octal, and the 👉 PC button in the view bar brings it back
into view; a step that leaves the page does the same. **octal** is the words, changed ones lit.
**code** is a word a line, disassembled with symbols (`disasm.ts`),
beside the source line that assembled it; ≠ marks a word that no
longer holds what the source assembled (patches, variables, JMS return
addresses). **source** is the program's commented source. **trace** is
the last 65,536 instructions executed, disassembled, with the AC each
one found (`trace.ts`, recorded on every fetch). **follow PC** keeps the
PC in view, or in the trace the newest instruction; the PC's word or
line is yellow in every view. Click a word to follow it as an address.
The wheel or trackpad scrolls at a rate the eye can follow; ctrl is
slower, shift faster, shift and ctrl cross core in about a second.
Sources come from `source()`: the light pen test's from its assembly,
SYMELEC's from the 1972 listing, loaded when a view first needs it
(`source.ts`). A program's `symbols()`
feeds the drawer's symbol menu and address box, which takes octal, a
name, or `NAME+offset`; words with a symbol are underlined, and every
tooltip names its location as `NAME+offset`. SYMELEC's come from
`symelec-symbols.tsv` (`scripts/extract-symbols.mjs`, from the
listing), the light pen test's from its own assembly; DUEL has none.
The tube's size reserves room for the first three rows only, so it
does not change with the program. The tube stays square; the figure's
shape can change. Drag the left or right edge to scale the figure,
keeping its shape (it stays centred). Drag the bottom edge to change
only the height, down to the height of the content: the extra height
gives the open Memory drawer more lines, and otherwise stays blank.
Double-click a side edge to fit the width to the pane again, or the
bottom edge to go back to the content's height. Both are kept in
`localStorage`.

## Record and replay

⏺️ reboots and records everything that reaches the machine from
outside, stamped with machine cycles since boot: switches (`sw`) and
the pen (`pen x y down aperture`). ⏺️ again stops. 📼 reboots and plays
it back; ⬇️ downloads it as JSON. The emulator only advances by cycles,
so a replay is the same run at any speed: `lp370.test.ts` replays a
recording in different chunk sizes and compares all of core. A session
is `[cycle, kind, ...args]` events (`src/session.ts`); a replayer skips
kinds it has no handler for, so new inputs, such as Tiny Titan
messages, extend the format without breaking old pages. The last
recording per program is kept in the browser's local storage.

## The rack, and the round window

The applet's grown-up form is not one canvas in the article flow but a
**rack of windows**: the tube, the console lamps, the teletype, the
debugger, the frame recorder — each resizable, zoomable, iconifiable,
with pie menus on the frames and controls. The tube's window is
**round**, because the 340's glass is round with the square 1024 raster
inscribed — Bauhaus black and white, a hairline ring on a black field,
no skeuomorphism (that end of the dial is
[PORTRAIT.md](../../packages/cabinet/PORTRAIT.md)). On a round frame
the bezel *is* the pie menu's ring, and the lineage stacks three rings
deep: PIXIE's lightbuttons inside the round tube window inside a
HyperTIES article. The design lives at the webtop level —
[ROUND-WINDOWS.md](../../../moollm/designs/webtop/ROUND-WINDOWS.md),
with [FRAMES.md](../../../moollm/designs/webtop/FRAMES.md) as the
contract it extends — because every webtop view inherits it, not just
this one.

## Corpus discipline

The converted 1988 corpus in `examples/` is derived and stays derived.
The PIXIE article is **authored**, in its own database directory — new
prose about a 1972 program, linked into the reader like any article,
with the cabinet block where a `picture` block would go. Its `definition`
(the single-click preview) can be the boot-picture SVG, static; the
double-click article gets the live machine.

## Ladder

1. **Static first:** the article ships with `snapshots/symelec-boot.svg`
   as its picture — zero new code, corpus entry proves the article side.
2. **Live tube:** `CabinetApplet.svelte` boots SYMELEC, draws frames.
   Accept: the boot picture matches the static SVG pixel-for-pixel.
3. **The pen:** pointer joins `pens`, tracking cross follows (PIXIE's
   `TRCR` doing the work). Accept: pen-hit a lightbutton, location 3
   carries the dispatch linkage.
4. **Two pens:** a second pointer (multitouch) or a presence-channel
   visitor. Stock SYMELEC cannot tell; an IDPN-aware build can.
5. **The rack:** the single canvas splits into framed device windows —
   round tube first — per ROUND-WINDOWS and FRAMES above.

↑ [GLANCE](GLANCE.yml) · [FORMAT](FORMAT.md) ·
[cabinet DESIGN](../../packages/cabinet/DESIGN.md) ·
[WEB-BENCH](../../packages/cabinet/WEB-BENCH.md)

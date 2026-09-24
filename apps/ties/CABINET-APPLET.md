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
  touch get wider apertures (WEB-BENCH item 6); a press that has not
  moved 4 px is a tap: the pen sees for 100,000 cycles and then goes
  blind until it moves, and a click shorter than 20,000 cycles is held
  that long, because SYMELEC takes a lightbutton held past about 250,000
  cycles as a second tap ([BUG-JOURNAL](../../packages/cabinet/BUG-JOURNAL.md),
  "S would not stay F");
- print screen: a control that downloads `toSvg(lastFrame)` — every
  reader can take home a provenance-carrying snapshot.

No new emulator surface. The applet consumes the same four seams as
every other consumer: loader, run budget, segment log, pen input.

## Programs

The program menu is the top row; `program:` in the block picks the first
one. Under it a title row, **PDP-7 / 340 DISPLAY**, opens and closes the
tube. Each program sets it when chosen (`display: false` closes it) and
the reader can flip it any time. The menu stays put either way; boot
messages and errors show under the title row while the tube is closed.
The applet publishes `{ program, label }` on the page's board under its
`id:` (default `cabinet`, `src/lib/applets.svelte.js`); a `transclude`
with `follows: cabinet` and `article: cabinet-{program}` shows the
article for the running program (`src/lib/transclude.js`,
`FollowSlot.svelte`). In the pixie database those are `cabinet-symelec`,
`cabinet-lp370`, `cabinet-duel`, `cabinet-hilo` and `cabinet-lander`.
Each entry in `src/lib/cabinet-programs.js` loads its tapes, adds
the peripherals it needs, deposits itself and sets the console:

| id | What | Loaded from |
|---|---|---|
| `symelec` | PIXIE's SYMELEC, 1972 (the default; Demo draws a house and a circuit) | the `.oct` transcription and its literal pool |
| `lp370` | DEC's 370 light pen diagnostic, 1964 (Demo walks through the three tests) | `packages/cabinet/tapes/lp370/*.s`, assembled in the browser by `src/asm.ts` |
| `duel` | DUEL, two-player spacewar | `tapes/duel/rim.pt` and `duel.pt`, read in through the RIM loader and a paper tape reader |
| `hilo` | HILO, a number guessing game on the teletype, written here in 2026 (Demo plays one game by halving) | `packages/cabinet/tapes/hilo/hilo.s`, assembled in the browser |
| `lander` | LANDER, a lunar landing game on the teletype: a burn each second, exact touchdown speed (Demo flies one descent) | `packages/cabinet/tapes/lander/lander.s`, assembled in the browser |

A program with `tty: true` opens the TTY panel when it is chosen, and
`display: false` closes the tube and boots without waiting for a picture
on it. A
demo's host has `type(text)` besides `cpu` and `pen`: the script types
as an operator would, and the paper shows it under LOCAL COPY. Replayed
`tty` events print the same way.

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
recorder, key help, then the control row and its panels. The control
row holds three panel chips, REGS TTY MEMORY, then ⏸️/▶️ Stop/Run,
⏭️ Step (stop, then one instruction), the speed slider, 🔄 Reset, and at
the right the outputs, 🖨️ SVG and 📷 PNG to the clipboard.

The speed slider is one notched slot, slowest at the left. The puck
shows only the notch it is on and snaps; arrow keys, Home and End move
it. The first four notches are trace, one instruction every 1 s, .3 s,
.1 s or .03 s, with REGS and MEMORY following each one. The rest are
multiples of a real PDP-7, whose memory cycle is 1.75 µs: 571,429
cycles a second, and an instruction takes one cycle (operate, IOT), two
(memory reference) or three (indirect). So 1× is 190,000 to 570,000
instructions a second, and even .001× is a blur. Then .01× .1× 1× 10×
MAX. Reset is pulled, not clicked: drag it down its track
and let go at the bottom, or press arrow down four times; letting go
early puts it back.

A chip opens or closes its panel; shift-click shows that panel alone.
Open panels stack in the chip order, memory last so it takes the spare
height, and the set is remembered. A closed chip still reports: REGS
shows a red dot when the processor has halted, TTY counts characters
printed since it was last open and flashes on BEL.

**REGS** is the processor (PC, AC, link, MQ, SC, lamps for ION, IRQ,
HLT, and cycles since boot), the 340 (DAC, the display's own PC; mode;
beam X and Y; scale and intensity; lamps for RUN, LP, HIT, EDGE; frame
count) and the device flags (teletype KBD and TTO, clock ON and FLAG).
PC and AC go to memory; DAC goes to memory in the octal view, since
display words disassembled as instructions are nonsense.

**TTY** is the KSR-33 on devices 03 and 04: the paper the program
prints on, and the keyboard. Click the paper and type. Lower case is
sent as upper, the only case a KSR-33 has, with the eighth bit set;
Return is CR, Backspace and Delete are RUBOUT, Ctrl+letter is the
control code, and paste types the text. CR returns the carriage and LF
feeds the paper, so overprinting prints as the machine drove it.
Recordings keep typed keys as `tty` events.

LOCAL COPY, on by default, is half duplex: the teletype prints each key
as it is typed, and Return prints a bare CR. That is what SYMELEC
expects. Its interrupt chain reads the keyboard (`INP`, "SERVICE
KEYBOARD") into a message ended by CR, and prints only the LF after it
("OUTPUT LINEFEED AFTER I/P"). With nothing blinking, the first three
letters are a command from `MESL`: LABEL, UNLABEL, TITAN, GRID, START.
With an element blinking, a line names it, a line starting `:` names
its subpicture, one starting `/` attaches a message, and a bare Return
prints its name and messages (listing 3732–4125). Off, the line is full duplex and the paper
shows only what the program prints back. Keys a program has not read
are counted under the paper. The paper and the speed slider keep focus
through the page's blur-on-mouseup by carrying `data-keep-focus`.

**MEMORY** is a core browser, live while open, with four views. 👉 marks the PC in code,
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

# Roadmap: what the bench needs next, in order

Everything designed in the 2026-10-02 session with Heinz's feedback in hand, sorted and
deduplicated. Where a design already has a home it is linked, not repeated:
[TAGS-AND-PIES.md](TAGS-AND-PIES.md) owns the tag word, focus and pies;
[TINY-ITS.md](TINY-ITS.md) owns the command language; [TRACKING.md](TRACKING.md) owns the
1972 tracking machinery. This file owns the order, and the designs that had no home.

## Order of work

| # | What | Why first | Section |
|---|---|---|---|
| 1 | Pen interpolation | Heinz's first complaint; cause measured, fix proven | [§1](#1-tracking-the-pen-is-sampled-once-per-browser-frame) |
| 2 | Display knobs in CONFIG | Heinz's second; half done | [§2](#2-contrast-display-knobs-in-config) |
| 3 | Tooltip hold and fade | small, felt on every hover | [§3](#3-tooltips-titles-and-tips) |
| 4 | Answers to Heinz's other points | owed | [§4](#4-heinzs-seven-points) |
| 5 | Forth `wait` and `say"` | Forth programs that draw while they speak | [§5](#5-forth-that-draws-and-speaks) |
| 6 | Round screen | the 25 cm question, historically framed | [§6](#6-round-screen) |
| 7 | Multi-pen IDPN and the LP370 test | promised in DESIGN.md | [§7](#7-several-pens) |
| 8 | Tags, focus, the first pie | [TAGS-AND-PIES §12](TAGS-AND-PIES.md#12-order-of-work) steps 2–7 | — |
| 9 | The UI driver | menus, tiny-its and macros drive the bench | [§8](#8-driving-the-ui) |
| 10 | The big dive | TAGS-AND-PIES §12 steps 8–10, mostly MicropolisCore | — |

Odds and ends are in [§9](#9-small-items).

## 1. Tracking: the pen is sampled once per browser frame

Heinz: *"Press on the cross and drag slowly; too fast and the cross is left behind"
wasn't much of a problem in 1969!* He is right, and it is our bug, not 1972's.

**Measured** (a throwaway script against `dist/`):

- A SYMELEC refresh frame is about 201 machine cycles, so the 340 redraws the picture
  about 47 times in one 60 Hz browser frame at 1× (about 9,500 cycles).
- The applet calls `pen.point(x, y)` once per pointer event, so for all 47 refreshes
  the pen sits still, then jumps.
- PIXIE's `SRAST` net reacquires up to about 16 units per jump. At 32 units or more per
  browser frame (about 28 cm/s on a 15 cm tube) the cross is lost. A 1969 pen was
  sampled by every refresh, so it never jumped.

**Fix:** slice each frame's cycles and move the pen along the path from the last
position to the new one, so every refresh sees a small step.

| units per browser frame | 1 slice (today) | 8 slices | 32 slices |
|---|---|---|---|
| 32 | lost | follows | follows |
| 64 | lost | follows | follows |
| 128 | lost | follows | follows |
| 256 (about 225 cm/s) | lost | lost | follows |

- In `runMachine`, split the cycles into slices and call `pen.point` with the
  interpolated position before each slice.
- Use `PointerEvent.getCoalescedEvents()`, so the path is the real path, not a chord.
- Recording and replay store the same path, so a replay tracks the same way.
- Then: drop "drag slowly" from [cabinet-symelec.md](../../apps/ties/examples/pixie/articles/cabinet-symelec.md)
  and [lp370.ts](src/lp370.ts); fix TRACKING.md's "period-correct maximum drag speed",
  which was really our sampling rate; add a fast-drag test to `cabinet.test.ts`.

**Accept:** a test drags 128 units per 9,500 cycles and the cross follows; the
existing "lose" test still loses when the pen teleports with no path.

## 2. Contrast: display knobs in CONFIG

Heinz: contrast is low and reading the buttons takes concentration. The floor and
gamma lift in 57afbf7b helped, but the four numbers in `PHOSPHOR` are hard-coded.

- A **Display** section in CONFIG, beside Teletype: brightness, contrast, gamma, floor
  sliders, each with a reset, stored with `store()` like the other settings.
- A "high contrast" preset for reading, next to the period look.

## 3. Tooltips, titles and tips

**Hold and fade.** Switch to a new tip at once; hold it about 1–1.5 s after the last
switch (today 300 ms); then fade over about 150 ms. A pen sweeping across strokes
then shows one steady caption instead of flicker.

**Two channels, two switches.** A tag's **title** is its name and its **tip** is the
body (tag records: [TAGS-AND-PIES §1](TAGS-AND-PIES.md#1-the-tag-word-dtg)).

| Titles | Tips | Hover shows |
|---|---|---|
| off | off | nothing |
| on | off | a title chip |
| off | on | the tooltip |
| on | on | the title in large bold upper case, then the tooltip |

Self-voicing (browser speech for users without a screen reader) is a third switch, so
it never talks over a screen reader.

**Tabs and pins** (after the pie; webtop owns the windows):

- Each frame's distinct titles form a tab strip, a live table of contents. Hovering a
  tab lights that object's strokes; opening it shows its tip in a window beside it, as
  gwern.net popups do.
- The pushpin follows OPEN LOOK honestly: pressed in only while the pointer is over
  it with the button down, popping back out if you drag off; release over it commits;
  a second press pulls it out and closes the window.

## 4. Heinz's seven points

| # | Heinz | Answer | Work |
|---|---|---|---|
| 1 | tracking is slow | our sampling, not 1969 | §1 |
| 2 | contrast is low | half fixed | §2 |
| 3 | 15 cm window, not 25 cm | the tube can be dragged larger; a true-size button needs the screen's pixels per cm | §6 |
| 4 | what do the 17 switches do? | the console's ACCUMULATOR switches, read by `OAS`/`LAS`. SYMELEC never reads them; DUEL's players fly with them | label them per tape, and say so on SYMELEC's page |
| 5 | a line printout of the house | 🖨️ saves the tube as SVG, with DJS subpictures as groups; `toYaml` gives the display list as text | add YAML and PNG to the button, and tell him |
| 6 | the RSP data of his Bayesian network | PIXIE exchange, [TAGS-AND-PIES §7](TAGS-AND-PIES.md#7-pixie-as-the-exchange-format) | walk the structure from core, export as YAML and `encodeTransfer`; a "save structure" button |
| 7 | a lit line catches the cross | authentic 1972 behaviour, and he agrees he'd now program it differently | none; it stays, documented in TRACKING.md |

## 5. Forth that draws and speaks

The turtle in [turtle.fs](tapes/pdp7forth/turtle.fs) already draws. Two words make it
perform:

- **`wait ( n -- )`**: let the 340 refresh for n sixtieths of a second before the next
  stroke, timed in machine cycles from the clock, so a drawing unfolds at a pace you
  can watch and a recording replays the same.
- **`say" text"`**: speak text. The PDP-7 sends it through a cabinet IOT (or a teletype
  escape), and the applet hands it to `speechSynthesis`. Speech blocks the next `say"`
  until done, so `say"` and `wait` pace each other.

```forth
say" a square"  4 0 do 200 fd 30 wait 90 rt loop
say" and a star" 5 0 do 300 fd 30 wait 144 rt loop
```

Later, with tags, `title"` announces what is drawn and `talk` makes `fd` and `rt`
narrate themselves ([TAGS-AND-PIES §1](TAGS-AND-PIES.md#in-forth)).

## 6. Round screen

The 340's tube is round, about 10 inches across, with the square drawing area inside.

- A **round screen** mode draws a circular bezel with the 1:1 square inscribed, in
  the real proportions.
- Drag the rim to change the radius; the square always stays 1:1 inside it.
- A **true size** setting: calibrate once (hold a credit card to the screen), then the
  tube shows at 25 cm, Heinz's point 3.

## 7. Several pens

IDPN (device 011) is already built: it reports which pen fired
([DESIGN.md](DESIGN.md), IOT table). Pens have colours (`PEN_COLORS`, pen 0 amber).

- Upgrade the LP370 test for several pens: show, in each pen's colour, which pen each
  hit came from.
- Stock programs are unaffected: they never issue IDPN, and the mouse is pen 0.

## 8. Driving the UI

Anything tiny-its can do, a pie menu can do. One async TypeScript layer finds things
on the tube and works the pen there, so menus, macros, tests, demos, tiny-its and an
LLM all drive the bench the same way: through the input path, as a user.

**Find.** `find(pattern)` matches display-list items, from segments and their
provenance (`addr`, `subr`, `block`, `kind`, `ch`, `pen`) and, once tags exist, the
tag's title, id or numeric id:

```ts
type Pattern = {
  id?: string | [number, number];   // tag id or 36-bit numeric id
  title?: string | RegExp;
  kind?: SegmentKind;
  addr?: number | string;           // display address, or "SYMBOL+offset" from the listing
  subr?: number | string;           // DJS subpicture
  text?: string | RegExp;           // characters drawn
};
```

Results are items (strokes grouped by tag, then subpicture, then block) with a bounding
box and their strokes. Symbol names come from the assembler's symbol table.

**Act.**

| call | does |
|---|---|
| `tapOn(item, where)` | pen down and up on the item; `where` is a point along a stroke, a fraction of the box, or "centre" |
| `penTo(x, y)` | move the pen without touching |
| `dragAlong(path, duration)` | pen down, follow the path over time, pen up; interpolated as in §1 |
| `key(text)`, `switches(n)` | keyboard and switch register |
| `waitFor(pattern)` | resolve when a match appears on the tube |

All of them are `async`, timed in machine cycles like `DemoPlayer` in
[symelec-demo.ts](src/symelec-demo.ts), which this generalises: its `tap`, `drag`,
`glide` and `tapMenu` become calls on the driver, with `find` replacing hard-coded
coordinates. So a script survives the picture moving.

**Who calls it.**

- **Pie items:** an advertised action is a driver script ([TAGS-AND-PIES §6](TAGS-AND-PIES.md#6-what-items-can-do)).
  The trust rules there still hold: tape memory can name only input-event macros.
- **tiny-its:** a pie item can send a tiny-its command, and tiny-its can send driver
  calls to a PIXIE VM, so a macro on one node can work the light pen on another
  ([TINY-ITS.md](TINY-ITS.md#macros-handlers-nodes-users)).
- **Tests and demos:** the acceptance tests and the SYMELEC demo move to it.
- **Rides:** a running script is a vehicle ([TAGS-AND-PIES §8](TAGS-AND-PIES.md#8-cursors-are-vehicles)):
  you watch the pen move, and Escape stops it.

**Accept:** the SYMELEC demo, rewritten on `find` and `dragAlong`, still draws the
same picture; and a test finds a lightbutton by symbol name and taps it.

## 9. Small items

- TRACKING.md: a note on `SRAST`'s diagonal step 6.
- Replace the dead Prefab and aQuery links with Wayback copies in
  [cars-2027-medicine.md](../../characters/heinz-lemke/cars-2027-medicine.md) and
  [voystick-correspondence-lineage.md](../../characters/don-hopkins/sources/voystick-correspondence-lineage.md).
- Find the GRID point display in the listing.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TAGS-AND-PIES](TAGS-AND-PIES.md)

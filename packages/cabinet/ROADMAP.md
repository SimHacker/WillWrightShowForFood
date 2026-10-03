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
| 7 | The UI driver, on tiny-bus; tests become driver scripts | everything below drives the bench through it | [§8](#8-driving-the-ui) |
| 8 | The Engelbart Cursor Party: several pens, several users, the LP370 test as the show | promised in DESIGN.md; the first multi-pen script | [§7](#7-several-pens-the-engelbart-cursor-party) |
| 9 | One transport, and a demo library | demos, sessions, the PC and macros share one set of controls | [§11](#11-one-transport-and-a-demo-library) |
| 10 | Tags, focus, the first pie (Target/Pie/Slice/Item, NeWS 1.1 skin, callbacks, tiny-cursor, in HyperTIES) | [TAGS-AND-PIES §12](TAGS-AND-PIES.md#12-order-of-work) steps 2–7 | [§9](#9-the-first-pie-target-pie-slice-item-in-a-news-11-skin) |
| 11 | Info goes upstairs: the definition window | PIXIE embedded in HyperTIES, the showcase | [§10](#10-info-goes-upstairs-the-definition-window) |
| 12 | The Engelbart mouse and chorded keyset | simulated first; digital twins of Don's pair | [§12](#12-the-engelbart-mouse-and-chorded-keyset) |
| 13 | Emulation mash-ups: virtual devices in machines they never met | the keyset and the glove, on the PDP-7 and the Apple ][ | [§13](#13-emulation-mash-ups) |
| 14 | The big dive | TAGS-AND-PIES §12 steps 8–10, mostly MicropolisCore | — |
| 15 | DUEL from tape to source, proven by round trip | a showpiece, not a blocker: DUEL already runs and explains its halt | [§15](#15-duel-from-tape-to-source) |
| 16 | Forth turtle with a 340 and a PIXIE back end; Forth symbols as subpictures; drag a vertex on the tube | Forth drawings PIXIE can edit; needs serve-back and the element decode | [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module) |
| 17 | Cartridges as files: build cache, `extends`, eggs, live decode, GitHub commits and PRs, CI | many programs from one Forth; edits that end up deployed | [CARTRIDGES.md](CARTRIDGES.md#8-order-of-work) |

Odds and ends are in [§14](#14-small-items).

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

**To do: turtle shapes, as in Logo's `SETSHAPE`.** `hideturtle` and `showturtle` (`ht`, `st`)
are already in turtle.fs; the turtle itself is a fixed triangle built by `redraw`. Let it wear
any symbol drawn with the turtle:

```forth
shape: bug  4 0 do 10 fd 90 rt loop  5 fd 8 lt 6 fd  ;shape
bug wear   200 fd   90 rt   200 fd
```

- `shape: … ;shape` records the moves into a shape (the emitter seam,
  [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module)), as relative
  steps, so it draws wherever the turtle is. The same thing as a tile or a symbol.
- `wear ( shape -- )` makes the turtle draw as that shape, rotated to the heading. The 340
  can't rotate a subroutine, so we rotate its words ourselves:
  - **The ideal shape** is kept unrotated, as absolute points in the turtle's 1/64-pixel fixed
    point, never as 340 words.
  - **One reserved subroutine** of fixed length, called by a `DJS` from the turtle's spot in the
    display list. A heading change rotates the ideal points with `sin`/`cos`, rounds each to a
    pixel, and pokes the differences into the subroutine as vector words. The call site never
    changes; only the words behind it do.
  - **Rounding never drifts.** Deltas come from rounded absolute points, not rotated deltas, so a
    closed shape stays closed at every heading.
  - **It always fits.** `shape:` refuses a step longer than 127 pixels end to end, so no rotation
    pushes either axis past a vector word's 127, and a shape of n steps always takes exactly n
    words. A shorter one pads with dark zero-length words, so the slot never moves.
  - **Or precompute.** For a shape worn often, rotate it once into 24 subroutines, a 15° step
    each, and turning only rewrites the `DJS` target: one word per turn, more core.

  The same transform is the edit tools' rotate and scale, and works for tiles and symbols.
- `shapes` lists them; `triangle wear` puts the old turtle back.
- With the round screen and tags, a worn shape can carry a title, so pointing at the turtle
  says what it is.

## 6. Round screen

The 340's tube is round, about 10 inches across, with the square drawing area inside.

- A **round screen** mode draws a circular bezel with the 1:1 square inscribed, in
  the real proportions.
- Drag the rim to change the radius; the square always stays 1:1 inside it.
- A **true size** setting: calibrate once (hold a credit card to the screen), then the
  tube shows at 25 cm, Heinz's point 3.

## 7. Several pens: the Engelbart Cursor Party

*A multi-user click and drag show.* In 1968 Engelbart and Bill Paxton shared one NLS
screen from two cities, each with a cursor (Engelbart's a bug, Paxton's a dot). The
cabinet's 340 takes any number of pens, so the party is the same thing on 1964 iron.

**What is built.** The 340 takes a list of pens, all sharing the one LPHIT flag, as
on the real hardware. IDPN (device 011, a cabinet extension) reports which pen fired
([DESIGN.md](DESIGN.md), IOT table). Pens have colours (`PEN_COLORS`, pen 0 amber).
The applet drives one pen from one pointer (`pressedId`).

**Guests.**

- **Every pointer is a pen.** Each `pointerId` (mouse, each finger, each stylus) gets
  its own `LightPen`, coloured and labelled, created on press and kept while it
  hovers. Two hands on a touch screen are two pens.
- **Every user is a pen.** A watcher on another node ([DESIGN.md](DESIGN.md),
  watchers and pens) sends pen events over tiny-its; the host adds a pen for them.
  Who may hold a pen is the host's call: watch only, one pen, or open party.
- **Every script is a pen.** A driver script (§8) takes `pen: n`, so a test or demo can
  play several users at once, and a recording stores which pen did what.
- **Each pen is a vehicle** ([TAGS-AND-PIES §8](TAGS-AND-PIES.md#8-cursors-are-vehicles)):
  a cursor in its colour with its owner's name, and its own coverage and hit feedback.

**The show.** The LP370 diagnostic is the dance floor:

- Upgrade the LP370 program so each hit is drawn in the colour of the pen that made
  it (read with IDPN), with a per-pen hit count; stock LP370 still runs unchanged.
- A party demo: three scripted guests at once. One drags the box corner, one sweeps
  the lines, one holds still on a dot, so you see three trackers and three colours
  sharing one flag, and where 1964's single flag makes them collide.
- Then the Engelbart tributes from DESIGN.md: two pens drag two corners of one
  rectangle; two pies open at once; a quiver of eight wands.
- **With the AM radio** ([AM-RADIO.md](AM-RADIO.md)): every guest's pen moves the
  program, the program's loops sing on the radio, so the party is heard as well as
  seen. Three pens at once is a trio, and you can hear when they collide.

**Tests are party scripts.** The light pen tests move onto the driver (§8): find the
box, `dragAlong` it with pen 1 while pen 2 taps a line, and assert on the
`cabinet.pen.hit` events, each with its pen number. The same script, with a caption
per step, is the demo; the same script, recorded, is the replay.

- Stock programs are unaffected: they never issue IDPN, and the first pen is pen 0.

**Accept:** two scripted pens on LP370 produce hits tagged with the right pen numbers;
two fingers on a touch screen drive two pens; a remote watcher's pen shows up in its
own colour on the host and in the recording.

## 8. Driving the UI

Anything tiny-its can do, a pie menu can do. One async TypeScript layer finds things
on the tube and works the pen there, so menus, macros, tests, demos, tiny-its and an
LLM all drive the bench the same way: through the input path, as a user.

**The display list is an accessibility DOM.** Segments with their provenance and
tags are a tree of things on the screen, with names, roles and bounds, which is all an
accessibility tree is. So `find` is
[aQuery](https://web.archive.org/web/20180826132551/http://donhopkins.com/mediawiki/index.php/AQuery)
for the 340: selectors over the tree, and actions on what they select, as
[MANIFESTO.md](MANIFESTO.md) traces from Triggers and Prefab. Here we own both the
tree and the input path, so nothing has to be scraped or guessed.

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
| `as(pen, script)` | run calls with pen n, so one script plays several users (§7) |

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
- **Tests and demos:** the acceptance tests and the SYMELEC demo move to it. A test
  is a script that navigates the screen and works the inputs, then asserts on events;
  with captions it is a demo, and recorded it is a session (§11).
- **Rides:** a running script is a vehicle ([TAGS-AND-PIES §8](TAGS-AND-PIES.md#8-cursors-are-vehicles)):
  you watch the pen move, and Escape stops it.

**On tiny-bus.** Commands and events ride **tiny-bus**, which lives in tiny-titan
([TINY-TITAN.md](TINY-TITAN.md#tiny-bus-the-backplane-between-machines)). Its shape follows the command bus
in the MicropolisCore repo (`apps/micropolis/src/lib/CommandBus.ts`): commands are
data, every surface dispatches the same ids, and an LLM proposes while a person
approves. The names are our own: `TinyCommand`, `TinyEvent`, `TinyBus`. The city
simulator's name is used under a generous but limited permission, so none of our
classes, ids or wire formats carry it.

- **Commands in.** Driver calls and bench controls register as commands with
  big-endian ids: `cabinet.pen.tap`, `cabinet.pen.drag`,
  `cabinet.key.type`, `cabinet.switches.set`, `cabinet.tape.load`, `cabinet.run.toggle`.
  Pie items, buttons, keys, tiny-its (`source: 'script'`), MCP and LLMs all dispatch
  them, so a pie item is a command id plus args, not a closure.
- **Policy.** Pen, key and switch commands are `reversible`; loading a tape or clearing
  core is `destructive`, so an LLM previews and proposes, and the user approves. Tape
  memory naming only input-event macros (TAGS-AND-PIES §6) becomes: a tag may name only
  `cabinet.pen.*` and `cabinet.key.*` ids.
- **Events out.** The bench reports facts as `TinyEvent`s: `cabinet.pen.hit`,
  `cabinet.picture.changed`, `cabinet.tag.focused`, `cabinet.teletype.printed`,
  stamped with the machine cycle. `waitFor` subscribes to these instead of polling, and
  the recorder writes them as the replay log.
- **Across nodes.** tiny-its forwards commands and events between buses, so a macro on
  one node drives the pen on another, and the same log replays on either.

Tiny is better than worse (a rejoinder to Gabriel's Worse is Better; see
[TINY-TITAN.md](TINY-TITAN.md#tiny-bus-the-backplane-between-machines)): tiny-bus is ours, small, and stays. If the bus in the
MicropolisCore repo is ever lifted into a package, an adapter maps one envelope onto
the other at the edge (TAGS-AND-PIES §12 step 8).

**Accept:** the SYMELEC demo, rewritten on `find` and `dragAlong`, still draws the
same picture; a test finds a lightbutton by symbol name and taps it; and the same tap,
dispatched as `cabinet.pen.tap` from a pie item and from a script, produces the same
`cabinet.pen.hit` event.

## 9. The first pie: Target, Pie, Slice, Item, in a NeWS 1.1 skin

Plan only; nothing here is built yet. We start simple and iterate on the design: the
new slice model with a retro skin first, and fancier fake-3D skins later. HyperTIES
(`apps/ties`) gets it as soon as it works.

**Model.** The cabinet gets a small pie that follows MicropolisCore's
[PIE-MENU-MODEL.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/piecraft/PIE-MENU-MODEL.md)
in shape and in names, exactly:

| Layer | In the cabinet |
|---|---|
| **Target** | a surface (the tube, a HyperTIES link, a button); `findPie(event)` picks the pie |
| **Pie** | a fixed list of slices, plus an optional `onshowpie` that may refill them |
| **Slice** | a fixed direction; the slice count (4, 8, 12) is chosen first and does not change when items come and go |
| **Item** | label, optional icon, and a command id with args ([§8](#8-driving-the-ui)), dispatched with `source: 'pie-menu'` |

- **Selection** follows the model's §3: the slice comes from the angle from the centre,
  and the item from the distance along the slice. Inside the numb radius nothing is
  selected; there is no outer limit, so moving further out only adds precision.
- **First iteration:** one item per slice, which is exactly the NeWS 1.1 case. An empty
  slice keeps its wedge and selects nothing. Several items per slice, and pull-out
  strips, come in the next iteration without moving any other slice.
- **Advertisers** (TAGS-AND-PIES §6) only fill slices with items. They never see the
  geometry, the skin or the event code. That is the whole contract, and it is why the
  cabinet swaps to MicropolisCore's pie and cursor packages, when they exist, with no
  change to any advertiser (TAGS-AND-PIES §12 step 8).
- **Placement policies (later; brace for it).** A slice, or a whole pie, may carry
  a policy that decides where an incoming item lands: by tag, by kind, by command id
  prefix, by score. Throw an item at the root of a nested pie and it falls through to
  the most fitting submenu, as a room in a map editor takes the exit that matches.
  Advertisers stay ignorant of the policy; they offer, the pie places.
- **Direct-manipulation editor (later).** Users grab an item and drag it to another
  slice, into a submenu or out to another pie; dragging a submenu onto a slice links
  it there, like kissing two rooms together in a map editor. The edit is a
  `TinyCommand`, so it is undoable, recordable and scriptable, and the result is
  saved as data. Prior art: the ActiveX pie menu editor in the PieMenus repo.
- **Where it lives.** The model, layout and selection are plain TypeScript in
  `packages/cabinet`, tested with the rest. Layout returns a list of paint operations;
  a small Svelte component beside `CabinetApplet.svelte` draws them on a canvas, so
  HyperTIES can use it outside the cabinet too.
- **Skins** are separate from the model: a skin takes the laid-out pie and the
  selected slice, and paints. The NeWS 1.1 skin is the first; fake-3D skins (see
  `fake-5d.ps` and friends in the PieMenus repo) come later on the same interface.

**Callbacks.** The best-developed callback sets are Don's later ones, not NeWS's:
[jquery-pie](https://github.com/SimHacker/CAM6/tree/master/jquery-pie) and the Unity
C# pie menus (`PieMenus/Misc/Unity3DPieMenu/PieMenu.cs`). Take their coverage, not
their names:

- **Three levels:** the pie, each slice, each item, every hook available at each, so
  an item can preview itself while a slice highlights and the pie updates its centre.
- **Lifecycle:** down, up, start, show (after mouse-ahead delay), update (every move,
  with direction and distance), enter and leave of a slice or item, pin and unpin
  (click-up mode), select, submenu, cancel, stop, and a timer for dwell.
- **Scope:** handlers per pie and global ones for every pie (Unity's `onGlobal…`),
  so a recorder or a screen reader hears all pies without being wired into each.
- **Each call gets** the pie, the slice and item if any, direction and distance, and
  the pen that drives it (§7), so two pies opened by two pens stay apart.
- **On the bus:** every lifecycle step is also a `TinyEvent` (`cabinet.pie.show`,
  `cabinet.pie.select` …), so tests and scripts wait on them like anything else.

**tiny-cursor.** NeWS pie menus warped the cursor (screen edge, Ker), and the pie
rides need parked pens, a pie cursor and a warp back. The browser cannot warp the
real pointer, so the cabinet draws its own: **tiny-cursor**, virtual cursors with
pointer grab, warp, park, hide, per-pen ownership and nesting rides
([TAGS-AND-PIES §8](TAGS-AND-PIES.md#8-cursors-are-vehicles)). Pointer Lock gives
raw motion when a ride needs it. Same approach as tiny-bus: minimal but complete,
ready to grow, alongside the bigger virtual cursor design in the MicropolisCore repo
with the same shape, so either can replace the other, or the tiny one simply wins.
LLMs make blending two versions cheap; we lean into that.

**The NeWS 1.1 skin.** Black and white, stencil and paint, specified from Don's
`SimplePieMenu` in
[PieMenus/NeWS/piemenu.ps](https://github.com/SimHacker/PieMenus/blob/master/NeWS/piemenu.ps)
(1987, rewritten for NeWS 1.1's `litemenu.ps` for SIGGRAPH). Numbers are its class
variables (lines 308–354); units are pixels at 1×, PostScript y up. No PostScript
renderer or interpreter: take the spirit, the measurements and the styles, not its
APIs or naming conventions.

- **Font:** Helvetica-Bold 12, black on white.
- **Angles:** slice 0 points up (`PieInitialAngle 90`) and slices go clockwise. Slice
  width is 360/n. MicropolisCore's `sliceDirection` maps onto this; the skin converts.
- **Label placement** (`layout`, line 366): each label sits at its slice angle on a
  circle of `LabelRadius`. Within 0.05 of straight up or down (|cos| < .05) it is
  centred horizontally, above the point at the top and hanging below it at the bottom.
  Otherwise it is left-justified on the right half, right-justified on the left half,
  and centred vertically.
- **Label radius:** start at `LabelMinRadius` 25 and step out by `LabelRadiusStep` 5
  until no two neighbouring label boxes overlap, then add `LabelRadiusExtra` 10.
- **Pie radius:** the farthest label-box corner from the centre, plus `Gap` 9, plus
  `Border` 3, rounded. The menu is a circle of that radius.
- **Frame** (`PaintMenuFrame`, line 577): fill the circle white, then a black ring
  `Border` 3 wide inside the edge (even-odd fill between the two circles).
- **Items** (`PaintMenuItems`, line 592): each label in black, and a hairline (line
  width 0, round cap) on each slice boundary, at angle − width/2, from `NumbRadius` 14
  out to `LabelRadius − Gap`.
- **Highlight** (`PaintSlice`, line 823), painted in XOR (raster op 5), so painting it
  again removes it:
  - an arrow along the slice, with r = `LabelRadius − Gap`: from (14, 0) to
    (0.6r, 0.6r·sin(w/3)), (0.9r, 0), (0.6r, −0.6r·sin(w/3)), closed and filled;
  - the label box grown by 4 on every side, as a filled round rect. `insetrrect` with
    delta −4 and radius 2 makes the corner radius 2 − (−4) = 6.

  On black and white, XOR is invert: the arrow and the label turn white on black.
- **Mouse-ahead** (`MapLongDelay`, `MapShortDelay`, `NoMapDist`, lines 349–351): the
  menu waits 0.6 s (a submenu 0.25 s) before it shows, and does not show at all if the
  pointer has already moved 10 out. A quick flick selects without the menu ever
  appearing.
- **Wocka** (`popdown`, line 739): if the menu was never shown, a black wedge (the
  whole slice, out to `PieRadius`) flashes for 0.05 s at the chosen slice, so a flick
  still shows what it picked.
- **Screen edge:** a pie that would not fit is pushed on screen, and the pointer is
  warped by the same amount, so it stays over the same spot.
- **Ker and Chunk** (`KerProc`, `ChunkProc`, lines 682–693): the adjust button (middle,
  or a modifier on one-button devices) pulls the pointer back to the centre on press,
  and pops back to the parent menu on release.
- **Submenus** are items whose command opens a pie; they show where the button came up.
- **Cursor:** the `beye` cursor (line 456) while the pie is up.

**Accept:** a pie of 4, 6 and 8 labels rendered by the skin matches, side by side,
a period NeWS screenshot; the slice and highlight geometry have
unit tests against the numbers above; a flick selects with no menu shown and the wocka
flashes; and a HyperTIES link pops a pie whose items dispatch command-bus ids.

## 10. Info goes upstairs: the definition window

Plan only. PIXIE embedded in HyperTIES is the showcase, so the tube keeps its
phosphor and the information goes to the frame.

Popping text up at the cursor is shouting: it covers the picture you are pointing
at. A light pen already gives coverage and hit feedback on the glass in real time;
what the thing *is* belongs out of the way, upstairs, in the HyperTIES definition
window at the bottom of the screen, as in the LispM's mouse documentation line and
the Emacs mode line.

- **Tap selects.** A tap latches the tagged graphic (TAGS-AND-PIES §2–§3) and shows
  its title, definition and links in the pile's definition window, through
  `browser.definition.preview`, exactly as a HyperTIES link or picture target does
  ([definition-previews.md](../../apps/ties/examples/hyperties/articles/definition-previews.md)).
  No overlay on the tube.
- **Double tap goes.** Follows the tag's link or invokes its command: the "Double
  Click to Go" of `DefinitionWindow.svelte`, same armed state.
- **The definition has its own links.** You can point at them and follow them there,
  like any definition.
- **Mechanism.** `CabinetApplet` gets `onpreview` and `onnavigate` props, as
  `TargetApplet` has. A tag's record (TAGS-AND-PIES §1) becomes a definition: a
  corpus article when the tag names one, otherwise a small synthetic article built
  from the tag's title, tip and links.
- **Standalone** (no pile around it), the light tooltip (§3) stays, and a setting picks
  tooltip, definition, or both.
- Hover can still write a one-line documentation line in the definition window's
  title bar, LispM style, without taking the window from the last tap.

**Accept:** in a HyperTIES article, tapping a tagged lightbutton puts its definition
in the bottom window with nothing drawn over the tube; double tap follows it; a link
inside that definition is followable.

## 11. One transport, and a demo library

Todo. Today each program has one `demo` generator, there is one recorded session per
program in localStorage, and DEMO, 📼, ▶️/⏸️ and ⏭️ are separate controls with separate
logic.

**One playback head.** The PC, demos, sessions, tiny-its macros and pie macros are
all a head moving along something. One interface, one component, the same buttons
everywhere:

```ts
type HeadState = "idle" | "playing" | "paused" | "recording";
interface PlayHead {
  state: HeadState;
  position: number;          // cycles, events or steps
  length?: number;           // unknown for the PC and for live recording
  play(): void; pause(): void; stop(): void;
  step(): void;              // one event, one instruction, one script yield
  seek?(to: number): void;   // replay from boot to `to`, so seeking is exact
  record?(): void;
  speed?: number;
}
```

- A `Transport.svelte` shows ⏺️ ▶️ ⏸️ ⏭️ ⏹️, a position bar when `length` is known, and
  speed. The CPU's run/pause/step becomes one `PlayHead`; a demo script another; a
  session replay another.

**A demo library.** The cartridge (the program's entry in `cabinet-programs.js`)
carries a list instead of one function:

```ts
type Demo = {
  id: string;
  dc: { title: string; description?: string; creator?: string; date?: string; subject?: string[] };
  switches?: number;
  script?: (h: DemoHost) => DemoScript;   // built in, written as a driver script
  session?: Session;                      // recorded events
};
```

- A picker beside DEMO lists the cartridge's demos and the user's own; DEMO plays the
  selected one.
- CRUD for the user's: record new, edit the Dublin Core fields, duplicate, delete,
  export and import as JSON (and YAML). Built-ins are read only; duplicate to edit.
- Stored in localStorage per program, replacing the single `cabinet-session-${id}`,
  which migrates in as the first user demo.
- The party demo (§7) and Heinz's walkthroughs ship as built-ins.

**Accept:** the PC, a demo and a recording all run from the same transport component
with the same buttons; a recorded demo can be titled, saved, reloaded, single
stepped and exported.

## 12. The Engelbart mouse and chorded keyset

Don has an actual pair. Simulated in the bench first, then digital twins.

- **Simulated.** An on-screen three-button mouse and five-key chord keyset, driven by
  the real mouse and keyboard keys, or tapped. A chord is the five keys as a binary
  number, `a` = 1 through `z` = 26, with the mouse buttons as case and mode shifts
  (tables taken from the NLS documentation, not guessed). The keyset sends
  characters to the teletype and to tiny-its; the mouse buttons are its pen buttons.
- **A teaching toy.** The keyset shows the chord it is reading and the character, so
  you learn the code by watching, and a practice mode drills it.
- **One more input device on the bus.** Chords become `cabinet.key.type` commands
  (§8), so scripts, recordings and the party treat the keyset like any keyboard.
- **Digital twins.** Measured from Don's pair: 3D models, printable shells, a maker
  kit, and finished Bluetooth HID devices that work with the simulator and with any
  computer. The hardware project gets its own home when it starts; this bench is its
  first software.

## 13. Emulation mash-ups

Plug virtual devices into virtual machines that never met: a VPL DataGlove on a
PDP-7, tracking your real hand with computer vision; an Engelbart mouse and keyset on
the PDP-7, or on an Apple ][ as PDL(0), PDL(1) and three buttons.

**Split the device from the port.** A device is two halves:

- **The instrument**: what the hand does, machine-free. Mouse: relative x, y and
  three buttons. Keyset: five keys. Glove: per-finger flex, hand position and
  orientation. Fed by real hardware, a simulation on screen, a recording, or a
  driver script (§8), so every instrument can be scripted, recorded and partied with
  (§7).
- **The port**: how one machine sees it. On the PDP-7, a `Device` on the IOT bus
  ([bus.ts](src/bus.ts)). On the Apple ][, the game port: paddle timers read through
  `$C070`/`$C064`–`$C067` (`PDL(n)` in BASIC) and pushbuttons at `$C061`–`$C063`.
  Any instrument plugs into any port that has an adapter between them.

**Adapters.**

| Instrument | PDP-7 | Apple ][ |
|---|---|---|
| Engelbart mouse | a pen: integrated x, y aim the light pen, a button enables it, so PIXIE programs run unchanged; or raw counts on a new IOT | integrated x, y clamp to 0–255 as PDL(0), PDL(1); the three buttons are PB0–PB2 |
| Chord keyset | chords as teletype characters, so DDT, Forth and tiny-its take them as typing | chords as keys at `$C000`, so any program takes them |
| DataGlove | a pinch is pen-down at the hand's position; flex and position on a new IOT for programs written for it | position as PDL(0), PDL(1); fist, point and pinch as PB0–PB2 |

- The new IOTs are cabinet extensions, like IDPN: free device codes, marked "not
  1972" in DESIGN.md's IOT table, never touched by stock software.
- The glove's camera half runs in the browser: a hand-landmark model on the webcam
  gives finger joints and hand position, mapped to the DataGlove's flex and tracker
  values. Video stays on the machine; only the instrument values leave it.
- The Apple ][ needs a 6502 machine in the cabinet (DESIGN.md already plans a 6502
  description for the disassembler). Until then the Apple column is design only.

**Accept:** the simulated keyset types into PDP-7 Forth; the mouse draws in SYMELEC
through the pen adapter; a webcam pinch draws in SYMELEC; and the same instruments,
unchanged, drive an Apple ][ paddle program once the 6502 runs.

## 14. Small items

- TRACKING.md: a note on `SRAST`'s diagonal step 6.
- Replace the dead Prefab and aQuery links with Wayback copies in
  [cars-2027-medicine.md](../../characters/heinz-lemke/cars-2027-medicine.md) and
  [voystick-correspondence-lineage.md](../../characters/don-hopkins/sources/voystick-correspondence-lineage.md).
- Find the GRID point display in the listing.
- Panel order: drag the tabs left and right; a pie on a tab with first, last, earlier,
  later. Once order is the user's, the bottom-most open resizable panel takes the spare
  height instead of the last opened.
- **DUEL with two game controllers.** The Gamepad API (`navigator.getGamepads()`, polled
  each frame; Bluetooth pads appear like USB ones) maps each pad to one player's five
  switches: stick or d-pad left and right turn, up thrust, down back, A fire. The keyboard
  stays as it is, so one pad and one keyboard player also works. Same `keys` table shape as
  today, with `pad: { index, button | axis }` entries, so any switch program can take pads.
- **Drag text and symbols, not just corners.** The ✋ edit mode moves one vector corner
  ([edit340.ts](src/edit340.ts)). A string or a subpicture moves as a whole by moving the
  beam before it: the POINT words that set x and y, or for a `DJS`-called symbol, the point
  words in front of the call. The hover already groups strokes by block and subroutine
  (`hoverAt`), so grab the group, find the point words that open it, and poke those; a
  shared subroutine stays shared, since only the call site moves. Ephemeral like corners:
  PIXIE's next recompile puts its picture back.

## 15. DUEL from tape to source

DUEL survives only as a symbol-less FunnyFormat tape ([tapes/duel](tapes/duel/README.md)).
The goal is a `duel.dec` that `asm/dec.ts` assembles to the tape's core image word for word,
with the test as the proof; the tape stays the program.

1. **Core image.** Boot the tape headless without the SIMH patches; record the loaded
   ranges from the FunnyFormat blocks (cross-check Frode's analysis log in
   `DECUS.7-40.DUEL.zip`). Save them as a fixture.
2. **Code or data.** Trace from 4000 and the interrupt entry: follow `jmp`, `jms`, skips
   and indirect calls through known tables. Reached words are code; the rest data.
   Run the game in the emulator with an execution map as a second witness.
3. **Labels.** One label per jump/call target and per data reference, named by address
   (`l1157`) at first.
4. **Emit.** `duel.dec` in the dialect `dec.ts` reads; data as octal words, 340 display
   lists as display words.
5. **Round trip test.** Assemble, compare with the fixture, fail on any word.
6. **Names.** By hand, test green after each: `hit` (1157), the ship records 1471/1514,
   torpedoes, the switch reader, the display list builder. Comments one line each.
7. **Patches.** Frode's five words stay a load-time overlay, never in the source.
8. **Show it.** The cabinet's source view and symbols for DUEL, the halt panel citing
   `hit` by name; the same tool then serves other symbol-less tapes from Oslo.

All of it runs in the page as a panel, verifying on every edit:
[CARTRIDGES.md §4](CARTRIDGES.md#4-live-decoding-from-a-binary-back-to-source).

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TAGS-AND-PIES](TAGS-AND-PIES.md)

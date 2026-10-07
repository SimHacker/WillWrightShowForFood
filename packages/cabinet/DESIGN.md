# Cabinet design — what PIXIE actually demands

Extracted from the transcribed listing
([`symelec-listing.txt`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt),
zero transcription findings), not from DEC manuals alone. The rule throughout:
**instance first** — hardwire what SYMELEC needs, comment where the abstraction
would go, generate it lazily when a second instance demands it. Stated in full
as the porting method — *work backwards from the software you want to run* —
in the [TinyTeco runbook](../tiny-teco/FULL-ITS-TECO.md), where it was
discovered the first time the same week.

## Memory representation (decided)

One word per typed-array element. `Uint32Array` for word sizes ≤ 32 bits.
Never bit-pack: the whole PDP-7 core is 32KB unpacked and indexed typed-array
access is one machine load; packed access is multi-byte reconstruction in the
hottest loop. JS bitwise ops truncate at 32 bits, so a future wide-word cabinet
(36-bit PDP-10, 48-bit Titan) picks its own representation per plugin —
hi/lo pairs or plain numbers with arithmetic (safe to 2^53). **Word storage is
a plugin choice, not a backplane abstraction.** The backplane promises only:
a word is a JS number.

## The target program

- Load `symelec.oct` alone. It is self-contained: 0o21–0o11741 (17–5089 words),
  fits 8K. Boot: start at 0o22 (`JMP BEGRTP`).
- `rsppix.oct` overlays the same addresses with different contents — a separate
  standalone program, not a co-resident module. (688 shared addresses, 687
  differ. Measured 22 Sep 2026; closes the EMULATION-PLAN layout question.)

## Device contract — every IOT SYMELEC issues

| dev | IOTs (octal) | box |
|-----|--------------|-----|
| 00 | CLSF 700001 · IOF 700002 · ION 700042 · CLON 700044 | clock + interrupt system |
| 03 | KSF 700301 · KRB 700312 | keyboard |
| 04 | TSF 700401 · TCF 700402 · TLS 700406 | teleprinter |
| 05 | IDVE 700501 · IDRS 700504 | display: v-edge skip, resume |
| 06 | IDSI 700601 · IDLA 700606 | display: stop-code skip, load addr & go |
| 07 | IDSP 700701 · IDRC 700712 | display: pen skip, read beam coords |
| 10 | IDHE 701001 | display: h-edge skip |
| 11 | IDPN 701101 skip · 701112 read | **cabinet extension, not 1972**: which pen fired (1–8, 0 = none). Free device code; no PIXIE binary issues it, so stock software is unaffected. Reassemble PIXIE to use it — multiple pens, Engelbart tribute: drag two corners of a rectangle, two radial menus at once, a quiver of eight wands. |
| 12 | MSF · MRB · MRC · MRS (planned) | **cabinet extension, not 1972**: the pointer as events, x, y and buttons, for programs that drag ([pointer devices](#the-application-layer--packagespixie-separate-module)). |
| 22–23 | LSF 702201 · LCF 702222 · LRB18 702252 · LLB18!LLAM 702264 · LRB18!LLAM 702276 · LSA 702301 · LKD 702322 · LLB6 702344 · LKE!LLB6 702364 | Titan link |
| 33 | CAF 703302 | clear all flags |

Everything else: no-op (already the backplane default).

## Interrupts — the one missing bus concept

PIXIE is interrupt-driven. `BEGRTP` deposits `JMP INT` at location 1, `ION`.
The PDP-7 facility: on request with interrupts enabled, save PC (link in the
sign bit) at 0, jump to 1, interrupts off; `ION` re-enables (one-instruction
delay); handler returns `LAC INT1; ION; JMP I 0`. One level, no vectors —
the handler identifies the device by skip-chain:

    INT: IDSP→PEN · IDSI→STPCD · IDVE→EDGEV · IDHE→EDGEH · TSF→OUT · KSF→INP · CLSF→CLOCK

Backplane addition: a single IRQ line devices can raise; the CPU plugin
samples it and owns what an interrupt *does*. Roy's SIMH `GO` blanks for
exactly this reason — no device ever fires.

## The Type 340 is a display processor, not a segment sink

Contract decoded from `INT`/`PEN`/`TRCR`/`STPCD` (listing 5320–5533):

1. **Executes display words fetched from core** starting at the `IDLA`
   address. Hardwire: hand the 340 `cpu.read`.
   `// abstract to a DMA port when a second DMA device exists`
2. **Stoppable and resumable mid-file.** Pen hit or stop code freezes the
   display PC; `IDRS` resumes in place.
3. **Segments carry provenance** — the display-file address that drew them.
   PIXIE identifies *what* was hit via Type 347 `DJS` return linkage in low
   core (it reads locations 3 and 5 to tell lightbutton from drawing).
4. **`IDRC` returns packed beam coordinates**, read twice: rotate-1 +
   `AND 1776` → TEMPY, rotate-8 + `AND 1776` → TEMPX. Hardwire that exact
   packing; it satisfies the only program that reads it.
5. **Edge flags** (IDVE/IDHE) when the beam runs off the 1024×1024 grid.
6. **Stop codes** raise IDSI — frame boundaries; the clock handler flips
   intensity bits in the display file for blink.

Display-word codec: the Cambridge assembler's `DISP` encodings are
undocumented but recoverable — thousands of octal+mnemonic pairs in the
listing (`PAR SB`=160000 · `VEC ES -34 14`=406234 · `DJP TEMPDF`=404441 ·
`DDS SB 3`=360003), cross-checked against the mirrored H-340 manual.
**Decode only the words SYMELEC contains**; unknown display word = log and
skip (robust-first). No Type 342 character generator until a character word
appears in the file — and when one does, the glyph shapes come from the
`chars[]` table in SIMH's `display/type340.c`, where **Lars Brinkhoff
recovered the letterforms from AI lab film footage** (annotated per glyph:
`AI film 75`, `AI film 104`, Knight TV fills). The shapes question is
already answered, on celluloid.

## The light pen

Pen hit = pointer within aperture of a *freshly intensified* segment during
display execution (the real pen saw the blue flash, never the afterglow).
The hit stops the display; PIXIE's own `TRCR` moves the tracking cross —
the cross follows the mouse because 1969 software tracks it. The radial
lightbuttons (`LBD`, `PSD/PAD/PRD/PCD/PLD/PXD`) are PIXIE's display file:
**we do not implement radial menus; we implement the pen honestly and the
radial menus appear.** The full tracking machinery — cross, `TRCR`,
`POSCR`, the `SRAST` reacquisition raster, the Promethean acquisition
handoff — is walked through against the listing in
[TRACKING.md](TRACKING.md), and proven live by the tracking acceptance
test.

Two pen modes as a dimensional control:
- `honest` — PIXIE's incremental tracking; can lose the cross on fast
  motion, which is period-correct. The demo mode.
- `assist` — teleport the cross to the pointer. For kiosks and impatience.

**How a program knows what was hit: `DDS`.** The 340 only reports *that* the pen fired and
where the beam was. The display list says who owns what is drawn next, before drawing it:
`DJS ,2` puts the address of the next word (a CPU `JMP` stored in the display list) in the save
register; `DDS 3` writes "DJP <that address>" into core location 3; then come the letters.
Every stroke after that belongs to that button until the next `DDS` overwrites 3. SYMELEC's
`PEN` handler reads 3 and does `JMP I 3`. Any run of drawing, letters, a subroutine or a whole
picture, can be one button this way; subroutines nest one deep (one save register). The pen bit
in a PARAM word hides a run from the pen entirely. Walked through in the
[guide](reference/GUIDE-LIGHTPEN.md#how-a-program-knows-what-was-hit-dds).

**Interrupts or polling.** Both work for both events. `IDSP` skips on a pen hit and `IDSI` on a
display stop, and either flag also raises the interrupt. The 340 stays frozen after a hit until
`IDRS` resumes it or `IDLA` restarts it, so a polling program loses nothing but time. SYMELEC
and LP370 use interrupts (a skip chain in one handler), suited to programs that compute between
frames. Mitch's Forth polls `IDSI` while waiting for a key and has no pen handling yet.

**Several pens, two modes.** *Shared* (done, the default): pens are ORed onto the one pen input,
like extra photocells on one amplifier; one hit flag, one coordinate register, first pen wins
the latch, and `IDPN` (dev 11) says which pen it was. Every 1972 program works unchanged, but two
pens can't hit two buttons in the same frame: the first hit freezes the display. *Separate*
(will, a cabinet setting): each pen gets its own hit flag, coordinates and tag latch, read
through new IOTs by pen number, and a hit no longer freezes the display for the others. Old
programs can't use it and needn't: the cabinet chooses the mode, so the fun of eight people at
one tube never breaks a stock program. It is more circuitry than DEC ever built; it's marked as
an extension.

**Pens in Forth** (will). Kernel words: `pen? ( -- f )`, `pen@ ( -- x y n )`, `resume`, and with
tags (TAGS-AND-PIES.md) `tag@ ( -- record )`. Then handlers, run from the interrupt through an
assembly thunk ([ROADMAP §14](ROADMAP.md#14-small-items)): `pen-hit ( x y n tag -- )`. A tag's
title can be Forth to run when it's hit, once the kernel has `EVALUATE`; it runs in the machine,
never as JavaScript in the page.

## CPU plugin — verified gaps against the source

| Gap | Evidence | Cost of skipping |
|-----|----------|------------------|
| OPR group (RCL RTR RAL SZA SNA SMA SKP CMA HLT…) | ~280 uses | nothing runs |
| LAW (76xxxx) | `LAW LB` before every IDLA | display never starts |
| XCT | `XCT I ENTER-JMS` computed dispatch | silent corruption |
| Auto-index 10–17 (increment before use on indirect) | `DAC I 10`, `LAC I 11` in ring inner loops | ring walks garbage |
| EAE subset | ~11 words (64xxxx) | implement only the ops present |
| Interrupt facility | whole architecture | see above |

## tiny-titan

Per [`TITAN-LINK-PROTOCOL.md`](reference/TITAN-LINK-PROTOCOL.md)
— the codec and plug-in surface are designed there; the module is
[`src/plugins/tiny-titan.ts`](src/plugins/tiny-titan.ts), and
[TINY-TITAN.md](TINY-TITAN.md) is its own page — what it does now,
what it could do, and why the name is the punchline. Two layers,
split so the far side is repackageable:

- **`TinyTitan`** is the cabinet device, claiming devs 22–23. Its pulses
  are what the CPU delivers after stripping bit `010` (clear-AC): `LSF`
  arrives as pulse 01, `LRB18` as 42, `LRB18!LLAM` as 66, `LLB18!LLAM`
  as 64; on dev 23, `LLB6` as 44, `LKE!LLB6` as 64 — and the NAK
  spelling `LLB6 10` reaches the device as control 0 with AC
  pre-cleared, the `010` being the clear-AC bit itself. The link ran
  with interrupts off, so the device raises no IRQ.
- **`TitanPort`** is the seam: `control / send / recv / ready /
  disconnect`, five calls a transport can carry anywhere. The PDP-7
  polls `LSF` in `WAITLK` — the 1969 polling loop *is* the await — so
  an in-process port answers instantly and a remote one (WebSocket,
  fetch) just buffers arrivals behind `ready()`. Same host class,
  three deployments: in the browser beside the emulator, in-process on
  node, or a real server streaming frames. Repackaging is lifting the
  file into its own package; it imports only the bus types.
- **`BlockletHost`** implements the session state machine from the
  `/LTPIX` listing: serves the 4-word redundantly-checked headers
  (`(w1^w2)+(w3^w4)` must be all-ones), sets the count per blocklet
  (a blocklet carries exactly `count` RW words — the end test's
  `ISZ BSZ` pre-increments the complemented count), accumulates RW's
  running 18-bit checksum, answers it for `SAD CKS`, and says goodbye
  with a zero-count header.

Ladder: **stub met** (portless `TinyTitan`: `LSF` always skips, the
`TITAN` command cannot wedge the machine) and **echo met** — the
acceptance test boots SYMELEC, types `TITAN` on the teletype, and the
recorded transfer opens with `PXID` followed by `DSBEG`/`DSEND`/
`SAVINS` and the live ring words from core. **Decode met** in
[`packages/pixie`](../pixie/): its acceptance test decodes that
transfer, checks the heading against the `BEG`, `END` and `SAVINS`
variables in core, classifies every word, and re-encodes the image to
exactly the words that crossed the wire. Next: `filestore` (named
slots; localStorage in browser, fs on node), then serving structures
*back* (direction bit `0o200000`), which is the same machine with the
queue running the other way.

### The command language it answers to

SYMELEC's teletype language is five commands and two message forms.
`INP` buffers a line (mark-parity ASCII, CR = `215` ends it); `MESIN`
hashes the **first three characters** — `SUMB = (SUMB<<6) + char` —
against the `MESL` table and `XCT`s the matching entry:

| typed | hash | does |
|---|---|---|
| `LABEL` | `170402` | `ISZ RLABEL` — name elements as you draw |
| `UNLABEL` | `302114` | `DZM RLABEL` — stop |
| `TITAN` | `271424` | `JMS LTPX` — phone the filestore |
| `GRID` | `122511` | coarsen the snap grid to 16 units |
| `START` | `262701` | reinitialize |

Anything else prints `?`. A line starting `/` is a label text; `:`
moves the working pointer to a subpicture. `TITAN`'s four-way skip
return maps to typed error notes — checksum fail, not PIXIE data,
data won't fit — and on success SYMELEC rebuilds its name list and
puts the received picture on the tube.

Remote control is not a console protocol: the Cabinet is a TS object.
Examine/deposit/step over the same WebSocket, a dozen lines.

## The application layer — `packages/pixie` (separate module)

The cabinet is the machine; PIXIE's ring structures are an application format
and live beside it, not inside it — the way SYMELEC sat on the PDP-7.

**Ring codec, wire-compatible.** The blocklet transfer ships the
data-structure core area verbatim (stream heading `PXID`/`DSBEG`/`DSEND`/
`SAVINS`, raw words, pointers relocated on receive), so one codec covers
everything: decode 18-bit words → TS object graph (nodes, branches, rings,
subpictures), encode back. Not RAM-byte-compatible — wire-compatible; the
graph representation is ours.

Format truth, in order:
1. Wire envelope: [`TITAN-LINK-PROTOCOL.md`](reference/TITAN-LINK-PROTOCOL.md)
   — atoms (top 5 bits zero), NIL = the `JMS` opcode value, block headers
   `20000` + 13-bit length, `RELCON` relocation.
2. Semantics: RSPPIX itself (the Ring Structure Processor, transcribed clean),
   thesis §5, Heinz's data-structures paper.

One codec, three consumers: the mini-Titan filestore; **test-model
generation** (build a drawing in TS, feed it to 1969 PIXIE over the link,
watch it render); **extraction** (pull out what the user drew with the pen).
Acceptance test for free: encode → link → PIXIE → link → decode → deep-equal.

Built in `packages/pixie` (16 tests pass, 3 Oct 2026):

- the word classes and the relocation pass; `RingBuilder` cells with CAR/CDR walks;
  `encodeTransfer`/`decodeTransfer`, round-tripped through relocation; `photograph` of a
  running SYMELEC's data-structure area;
- the acceptance test against the transfer 1972 SYMELEC actually sends (PDP → Titan,
  re-encoded word for word);
- Graftals through the real 340 to SVG: the fern, and Rehmi Post and Don's NeWS pot leaf in
  two loads, since its 11K display words exceed core;
- rings as data: `readRings` for YAML, JSON and binary, graph ⇄ ring conversion, and the PSIBER
  ARPA and Adventure maps as rings;
- a 3D ring renderer (`scene`, `view`, the holodeck plugin), shown in the cabinet's RINGS panel
  with roots per program; rings are Tiny Titan's file format.

Not built: the Titan → PDP half, so a structure made in TypeScript has not yet been drawn by
PIXIE. `scripts/trace-serveback.mjs` is the diagnostic written ahead of it: it boots SYMELEC
and photographs the rings, then stops at `BlockletHost.serving`, which doesn't exist yet.
Building that method is the serve-back rung.

The build was broken on 26 Sep (`package.json`, `tsconfig.json` and `src/image.ts` never
committed); `b6cf8fc2` restored them. The zero-length-stroke bug in `toDisplayFile`, where a
run that only positioned the beam left the 340 in VECTOR mode for the next PARAM word, is fixed
and has a test.

**To do: a live view and editor of ring structures, in memory and on
disk.** The emulator exposes every word of core, so the page can show
PIXIE's ring structure as a graph while PIXIE runs: nodes, branches,
rings and subpictures from `DSBEG` to `DSEND`, with `SAVINS` marked,
updating as the pen draws. The same view opens the ring files
tiny-titan records, so the copy in memory and the copy on disk sit side
by side and a difference between them is visible. Editing goes through
the codec in both places: edit a stored file and serve it back over the
link, or deposit into core while PIXIE runs and watch the tube change.
Uses beyond the demonstration: a check on the transcription, since a
misread word shows up as a pointer to nowhere or a ring that does not
close, and a way to show Heinz his 1969 data structures running.

Panes, all linked, all driven by the running cabinet:

1. **Tube** — the live 340, as now.
2. **Core strip** — `BEG..END` as a bar, one tick per word, coloured by
   class (atom, name, NIL, block, nonitem, free list, GC mark). Watch it
   fill as the pen draws and watch the collector sweep. A second layout:
   all of core on a Hilbert curve (8K words as two 64×64 squares end to
   end), so neighbouring addresses stay neighbours on screen with no
   jumps, coloured by class, or by read and write heat from shadow
   memory.
3. **Ring graph** — elements as nodes, pointers as edges, rings drawn as
   literal circles; printnames shown as strings, blocks as arrays.
4. **Inspector** — a selected cell's octal word, class, `CAR`/`CDR`, who
   points at it (reverse pointers, computed), and which display-file
   words it compiled to.
5. **Linked brushing** — hover a stroke and its ring element lights; hover
   an element and its strokes light, through segment provenance plus a
   display-address → ring-name map recorded by the DOWN compiler. Selecting
   an element can make PIXIE blink it, as pointing mode does.
6. **Text pane** — an editable projection that round-trips (below).

Two levels, like any structured-data viewer: the cell level is universal,
because every word carries its own tag; the element level (branch between
nodes 3 and 7, a resistor) needs a schema, gated on decoding RSPPIX's
element semantics. Other RSP applications would plug in their own.

Safe editing: `photograph()` a copy, edit it, check `pointersResolve`,
and serve it back over the link (type `TITAN`). That is the 1972
workflow with the browser as Titan, and it is the serve-back rung.
Photographing each frame also gives time travel: diff before and after a
stroke.

Text formats, two layers:

- **Lossless, the golden copy:** a flat table keyed by octal address with
  class tags, in YAML or JSON. Round-trips exactly, diffs in git:
  ```yaml
  beg: 0o10000
  savins: 0o10000
  words:
    0o10000: { name: 0o10002 }   # car
    0o10001: nil                 # cdr
    0o10002: { block: [512, 400, 530, 400] }
  ```
- **Projections for people:** sexprs with `#n=` labels (cells are conses,
  NIL is NIL, labels express sharing and ring closure, e.g.
  `#1=(OWNER (MEMBER-A MEMBER-B . #1#))`, printnames read as `"FERN"`);
  YAML anchors and aliases; domain words (`node:`, `branch:`) once the
  element schema is decoded. JSON only as the flat table.

**To do: a Forth turtle with two back ends, so PIXIE can edit what Forth drew.**
[turtle.fs](tapes/pdp7forth/turtle.fs) turns every move into 340 vector words (`vec`, `dl,`).
Split it at `moveto`: the path goes to an emitter held in a variable and run with `EXECUTE`
(Mitch's kernel has no `DEFER`), and any number of emitters can listen.

- **340 back end:** today's `vec` and `dl,`, unchanged, so the tube and Mitch's turtle tests
  see the same display list word for word.
- **PIXIE back end:** the same moves as SYMELEC's own elements in the ring heap, through
  `rsp.fs` (below). Our own polyline layout (next paragraph) is enough to store and redraw
  a drawing, but only SYMELEC's element format lets PIXIE *edit* it, so the ring back end
  writes that format: a straight move becomes an RU line, an axis-aligned run an HV
  staircase. Measured so far (3 Oct): an RU line from (298, 400) to (600, 400) keeps its
  start as two atoms, y at 14015 and x at 14016, and its extent, 302, at 14070. The rest of
  the element is still to decode.
- **Saving:** `TITAN-SEND` puts the ring image on the link, tiny-titan stores it as a ring
  file, and SYMELEC loads it over the serve-back path, then edits it with the pen like
  anything it drew. Serve-back is the missing piece (`BlockletHost.serving`).
- **Symbols:** a Forth word that draws a symbol (a resistor, a battery, a gate) builds a
  SUBPICTURE once. In the 340 back end it is a 347 subroutine called by `DJS`, so every
  instance shares one copy of the words; in the ring back end it goes in the catalogue, and
  PIXIE's INSTANCE places it in drawings. Forth draws the parts, PIXIE composes them.

Order: the emitter seam, with Mitch's tests passing under SIMH and ours; the TypeScript twin
in `packages/pixie` (turtle moves to SYMELEC elements, RU lines first, accepted when 1972
SYMELEC draws them and the pen moves them); serve-back; `rsp.fs` and the Forth ring back
end; symbols as subpictures.

**To do: drag a vertex on the tube.** A pen hit gives the display word that drew the stroke
(`Segment.addr`); dragging pokes new positions into the running machine. What the probe found
(3 Oct, one RU line drawn by the demo pen):

- The vectors in the display file are relative (`200177` is 127 across), so moving a
  stroke's start means moving whatever positions the beam before it; that word is not yet
  identified in the words the 340 fetched.
- The heap is the truth. Poking the line's start atoms moved nothing on the tube until
  PIXIE recompiled the display file, which it did when the next element was finished; the
  line then moved to the poked start, keeping its 302 extent. Tapping RE, RO, EN or SC did
  not recompile.
- Recompiling moves the whole picture in PERMDF (the line went from 12342 to 12376), so a
  display address names a stroke only until the next recompile.

So a drag pokes the element's atoms (lasting) and patches the display words for immediate
feedback (until the recompile replaces them), then asks PIXIE to recompile, once the
routine that does it is found and can be called at a safe point. Every poke goes through the
Monitor, so the session records it and a replay drags the same vertex.

**Built: editing the 340's words directly** ([edit340.ts](src/edit340.ts)). Without touching
any program's own structures: `cornerAt` finds the vector corner under a point in the frame
just drawn, and `moveCorner` returns the two pokes that move it, the word into the corner
taking the new end and the word out of it absorbing the difference, so the rest of the
picture stays put. It refuses a move a 7-bit field can't hold, and a clipped vector. On a
turtle drawing, which Forth only appends to, the edit lasts; on PIXIE's, it lasts until the
next recompile. Don did the same by hand from the Forth prompt: point at a line, read its
address from the tooltip, and `!` a new word into it.

**Built: instant feedback with the CPU stopped** ([preview340.ts](src/preview340.ts)). In edit
mode the tube is drawn by a shadow 340: a throwaway one, over a read-only view of core, started
where the program last issued IDLA (`Type340.startAddr`) and run for one pass. It drops stores,
has no pens and never touches the real 340 or the CPU, so a drag redraws at pointer rate at any
speed, paused included (tested: 0 CPU cycles, frame corner moved). The real 340 is not ticked
on its own, which would be the madness: SYMELEC's display interrupts would fire with no CPU to
answer them. The shadow reads; the machine stays exactly as it was. Every corner gets a handle,
and the nearest within 40 grid units is picked, so pointing need not be precise.

**To do: a tool palette, so editing never takes the light pen away.** The ✋ button becomes a
palette of tools for the pointer, one active at a time, each a plain object with `down`, `move`,
`up` and `draw`:

- **Light pen** (the default): what the pointer is today, the program's own input.
- **Corner**: today's ✋.
- **Select**: drag a rectangle, or shift-click, to collect corners, strings and subroutine calls;
  the selection is a set of display addresses, drawn as handles.
- **Move, rotate, scale**: about a pivot the user places (default: the selection's centre).
  Each transforms the selection's points and re-encodes the words that hold them: vector words
  for corners, the point words in front of a string or a `DJS` call for a whole thing. A word
  that can't hold the result is refused and shown red, as now. Rotating a character string
  moves it, but its letters stay upright, as the 342 draws them.
- **Inspect**: point and read, without the tooltip's delay.

All of them poke core through the Monitor, so a session records the edits and replays them, and
none sends anything to the program. The pointer pen and MOUSE device below are the other
route: tools the program writes for itself.

**To do: a clock per machine.** The CPU, the 340 and every other executable part of a cabinet
(a Turing machine, the CAM, a raster framebuffer, the Titan link's far end) gets its own run,
stop and speed, under one master. Rules, so this stays sane:

- **Time is one clock.** Each part is stepped in cycles of the one backplane clock, at its own
  ratio. A part that is stopped doesn't advance, and the cycles it didn't use are not banked.
- **A part may stop only if nothing waits on it.** The 340 can run with the CPU stopped (it
  needs nothing back but its interrupts, which wait until the CPU runs again); the CPU can't
  usefully run with the 340 stopped if the program waits for a stop interrupt, and the panel
  says so instead of hanging.
- **Previews are not clocks.** The shadow 340 above draws without advancing anything. Use it
  for feedback; give the real parts their own speeds only for watching them work: the 340
  slowed to a word a second, drawing its display file stroke by stroke, while the CPU sits.
- **One recording.** Sessions are stamped with backplane cycles, so a recording made with the
  parts at different speeds replays the same.

### A universal 340 editor

Independent of PIXIE and Forth: it knows only the 340, and everything about it. Read any display
program into an ideal form, edit that, and compile it back into the best words the 340 has,
within core and the instruction set, showing every limit on the tube instead of hiding it.

**Two editors.** The *instruction editor* (done) is low level and stays: it edits the 340's
words in place while the machine runs, one vector corner at a time, within what that word can
encode, and shows the limit box. Nothing is lifted, recompiled or relocated; what you drag is
exactly what changes in core, and the program may overwrite it (PIXIE's next recompile, the
turtle's next move). It is the way to see and poke the instruction set itself. The *drawing
editor* (next) works on the universal drawing, with no per-word limits, and pauses the machine.

**Plan, by status.** Done: the instruction editor; the shadow 340.
Next: the universal drawing (read any display list into it, compile it back to 340 words, YAML
and JSON files), and an edit mode that pauses the machine. Will: the cartridge's `display:`
declarations, so the editor knows which lists it may rewrite. Could, and won't:
[DRAWING-CONSTRAINTS.md](DRAWING-CONSTRAINTS.md), longer term and open to volunteers.

**Draw now.** The shadow 340 (`preview340`) runs a display list from its start until it stops,
all at once, without the machine's clock, the CPU or any device. The steady display already
uses it every browser frame, which is why a paused machine still shows its picture and an edit
appears the moment it is written. The paused edit mode draws this way, so the picture tracks the
mouse with no emulation running at all.

**The drawing editor's edit mode** (next). Press Edit: the machine pauses at the end of a 340 frame, the display list
is lifted into the universal drawing, and the edit tools take over the pointer. Light pens still
show what they would hit, but nothing reaches the program. Save writes the drawing back,
compiling it to whatever words the cartridge allows, and resumes; Cancel restores the words and
resumes. Like HyperCard's and HyperLook's edit modes. The goal is any 340 program's screen:
SYMELEC, the Forth turtle, the LP370 test, DUEL, each as its cartridge permits; where nothing is
declared, edit and export freely but don't write back.

**What the instruction set really allows** (measured on SYMELEC's own file, 3 Oct):

- *Scale multiplies.* A vector word holds 7 bits each way, but the PARAM word before it sets a
  scale of 1, 2, 4 or 8. SYMELEC's frame is drawn at scale 8: `277400` is dy 127, which is 1016
  units, the whole screen. That is why the frame's corners drag so far and the turtle's barely
  do. Every word is the same size; scale is what makes lines long.
- *PIXIE doesn't use scale to draw lines.* The frame (`WAREA`) is a hand-written display file at
  `SC3`. Drawn lines go through `VECGN`, P. Cross's straight-line generator (1967): it divides a
  line by 127 (`IDIV 177`) and chains scale-1 vector words, so every endpoint is exact to the
  unit. The 16-unit grid is not scale either: `POSCR` ANDs the cross position with `GRID` (1760
  on, 1777 off) on the CPU. The staircase is HV mode, where `SEGX` and `SEGY` emit an x leg then a
  y leg. Scale in PIXIE is a per-item attribute: `SCAMO` cycles an item's SC field, magnifying a
  whole picture or instance.
- *Scale is a shift, so the compiler can mix.* Long runs at scale 8, and a scale-1 word at the end
  to land on the exact unit. Changing scale costs an escape and a PARAM word, so it pays only on
  long lines.
- *Absolute is always available.* A POINT word sets x or y to any of 0–1023. A run of vectors can
  be broken anywhere by escaping to PARAM and placing the beam, at the cost of three words (PARAM,
  Y, X) instead of one. This is the way out of any relative constraint.
- *Characters are relative to each other.* The character generator advances the beam after each
  letter, so each character's place is the previous one's plus a fixed step. That is why dragging
  one menu letter takes the rest with it. Moving one alone needs absolute positioning: end the
  string, POINT to the new place, start a new string, and if the letters after it should stay,
  POINT again before them. Characters have no per-letter delta field to adjust, so unlike
  vectors, "move one and keep the rest" always costs words.
- *The pen sees strokes, not objects.* A pen hit is the dot or stroke being drawn when the
  photocell fired, so points, vectors and each letter's strokes can all be hit. The program learns
  only where the beam was and what word was being drawn; a letter or a subroutine is one thing
  to the pen only because the program groups them, as SYMELEC does with a DDS block per
  lightbutton. Turning the pen off (the PARAM pen bit) makes a whole run unhittable.
- *Subroutines are shared.* A `DJS` target drawn from several call sites is one set of words, so
  editing inside it edits every instance; editing one instance means copying it first.

**The ideal form** is a display graph, not words: nodes are absolute points (x, y, bright,
intensity, pen) in strokes; text runs (position, characters, size); subpicture definitions and
their instances (position); and the PARAM state each needs. It is what the 340 draws, with the
encoding thrown away, so an edit is plain geometry: move, insert, delete, rotate, scale.

**Reading** runs the file through the shadow 340 (`preview340`), records every word with its
mode, the beam before and after, scale, intensity, the enclosing block and subroutine, and builds
the graph. Each node remembers the words it came from.

**Compiling** walks the graph and picks the cheapest encoding for each step:

| Need | Encoding | Words |
|---|---|---|
| a step within 127 × scale | one vector | 1 |
| a longer step, same direction | raise the scale for the run, or chain vectors | 1–2, or n |
| a jump anywhere | escape, PARAM, Y, X | 3–4 |
| a repeated shape | one subroutine and `DJS` per instance | 1 per instance |
| a short wiggle | increment mode | 1 per 4 steps |

It chooses the scale per run that minimises words without losing a point that isn't on that
scale's grid, splits a step that won't fit, and merges dark moves that cancel.

**Where the result goes** depends on what kind of words were edited, which the editor knows from
the source map and the cartridge:

- *Assembled into the program:* the same number of words, rewritten in place, if the edit fits;
  otherwise a `DJP` to a patch area the cartridge names and back, with the original words left
  where they were. Nothing in the program moves.
- *A generated buffer the cartridge declares* (start, end pointer, capacity): rewritten whole,
  with the end pointer moved, and every `DJS`/`DJP` target and saved pointer into it relocated.
- *A buffer the program regenerates from its own data* (PIXIE's rings): the edit is shown and
  kept until the next regeneration, and the editor says so.

**When to write.** The 340 runs on its own, fetching a word at a time, so a push can land
mid-frame. In the emulator a push is atomic between instruction steps, but a frame can still be
half old and half new, and if words moved, the display PC can be left pointing into the middle of
something else. Three ways, cheapest last:

- *Double buffer.* Compile into a second buffer while the 340 draws from the first, then switch by
  rewriting one word: the `DJP` at the entry the program starts the 340 at, or the address the
  program hands `IDLA`. One word is atomic; the 340 has either fetched the old jump or will fetch
  the new one, so the switch takes effect at the start of the next frame and no frame is torn. A
  patch-area edit is already double-buffered this way: the patch is written first and the one
  `DJP` into it last. The cost is a second buffer: for the turtle, another 1,024 words of the
  4,455 free.
- *Extended memory for the display.* Core is tight (the turtle has 4,455 words free). The CPU now
  runs up to 32K with extend mode ([GUIDE-PDP7](reference/GUIDE-PDP7.md#memory-beyond-8k)), but
  the 340 addresses only 8K: the display address register is 13 bits (`ADDR` in `type340.ts`),
  and so is a `DJS`/`DJP` target (bits 5–17). Whether a real 340 reached past the first 8K is
  still to be checked in the 340 and PDP-7 manuals. If it didn't, a
  display bank would be a cabinet extension like `IDPN` (device 11): an IOT that sets the bank
  the 340 fetches from, and Forth words to write words into it. It would hold display lists and
  both double buffers, and a switch would be one IOT. Mark it as an extension in the UI, like
  the mouse pen.
- *Terminator first.* For a buffer rewritten in place: write a stop at the start, rewrite the rest,
  then replace the stop. The turtle's own trick. One frame may be blank.
- *Between frames, or stopped.* Push when the 340 is stopped or the program is waiting for
  it. Simple, but it only works when the program leaves such a gap.

**Showing the limits.** While dragging: the box a step can reach in its current word, shaded; a
second, larger outline where it can reach after the compiler re-encodes it; the word count of the
compiled result against the space available; and, when a move changes encoding (a vector becomes
an absolute jump, a string splits), a note saying so. Nothing is refused silently.

**The ideal form is the hub.** Like Atlanta's airport, every trip changes planes here. Each format
gets a pair of routes to the ideal form and back, never one straight to another format, so n
formats need 2n translators, not n².

| Spoke | In (to the ideal form) | Out (from it) |
|---|---|---|
| any 340 display file | lift through `preview340`, whoever made it | compile to the best words |
| PIXIE rings | walk elements in core (`packages/pixie`) | build rings with `RingBuilder`, link into PIXIE's free list |
| PIXIE transfer data | `decodeTransfer` | `encodeTransfer`, the Titan link and files |
| YAML, JSON | parse | write, with metadata |
| raw core | `core.ts` | `core.ts` |
| Forth turtle | run it and lift the result | generate `fd`/`rt` text (ROADMAP §16) |
| demonstration | record the DM edits as steps | replay them on another drawing |

So any picture any program drew becomes a PIXIE drawing: lift it, then write rings. A PIXIE
drawing gets edited with the same DM tools as everything else: lift, drag, push, and write the
rings back so PIXIE keeps the change. The round trip is the picture, not the bytes; what PIXIE
can't express (a 340 subroutine shared by two calls, characters at scale 8) is kept as
metadata in the ideal form and reported, not dropped.

**Metadata rides along.** Nodes, strokes and groups in the ideal form carry open-ended
annotations: titles, ids and links (the DTG tag records of [TAGS-AND-PIES.md](TAGS-AND-PIES.md)),
provenance (the display addresses and PIXIE elements they came from), and anything a simulation
or an LLM wants: what a part is, what it connects to, how it behaves. They are saved with the
drawing in YAML or JSON, go into PIXIE as tag records and name rings, and go to the 340 as DTG
words, so the same annotations reach the pen, the pie and a model reading the file.

**Lift, manipulate, push.** Direct manipulation works on the ideal form only, so nothing is
special: the first point is a point like any other, and there are no per-word limits while
dragging. On press, lift the display file into the graph. On every move, change the graph and
push it: compile and write the words back. On release, keep the last push. The words that go back
need not match the words that came out: the goal is what is drawn, not the program text, so a
file that was not optimal comes back better. Lifting again reads whatever is there now, so the
two directions can alternate freely; only the picture round-trips.

**Out of scope here:** display words the PDP-7 program itself rewrites as it runs (SYMELEC moving
its cross). Editing those means editing the code that writes them, a different layer with its own
limits.

**Layers above, later.**

- *PDP-7 code in place:* patch words, or reassemble a routine from source and hot-patch it in,
  with the source map telling which words belong to which line.
- *Forth:* redefine words, read and write variables by name, and generate Forth text: command
  streams typed at the prompt, and colon definitions (ROADMAP \u00a716).
- *PIXIE's drawings, at the source.* Edit the ring structure in place (an element's start atoms,
  its extent), then let PIXIE regenerate the display file itself, so the edit is PIXIE's and
  lasts. Measured so far: poking an RU line's start at 14015/14016 moved it on PIXIE's next
  recompile. Two things are missing: the rest of the element format, so every kind of element
  can be found and changed, and the routine that recompiles (`COMP` and its caller), found and
  callable at a safe point (`WAITLK`), so the picture updates while dragging instead of on the
  next finished element. During a drag the 340 editor can patch the display words for instant
  feedback, while the ring edit is the one that stays.
- *A Forth PDP-7 assembler:* Forth assemblers are usually a vocabulary of words that lay down
  instructions at `HERE` (`lac`, `dac`, `jmp`, labels as words). With one in Mitch's Forth, the
  emulator can assemble PDP-7 code into the running machine by typing a command stream at
  Forth, and Forth code words can be written in the same syntax. The TypeScript assemblers and a
  Forth one should agree word for word, the same proof as `as7` against Mitch's `kernel.a7out`.

**Then the dragging goes into the program, not the emulator.** Two ways to give a program
the pointer, both cabinet extensions on free device codes, neither touching stock software:

- **A pointer pen**: a pen that needs no light. It latches every time the program asks,
  wherever the beam is, so `IDSP` skips and `IDRC` reads the pointer, not the beam. Programs
  written for the light pen (Forth's pen words, SYMELEC with no change) can drag at any
  point, not just on lit strokes. It is the light pen's API with the physics turned off:
  cheap, and it can't tell the program which display word is under it.
- **A MOUSE device** (dev 12): `MSF` skips on a new event, `MRB` reads x, `MRC` reads y,
  `MRS` reads buttons, raising the interrupt like the keyboard. Events, not polling, so
  press, drag and release are never missed between refreshes, and the program pairs them
  with the 340's own provenance: the hit address from the frame (IDPN pulse 4 in
  [TAGS-AND-PIES.md](TAGS-AND-PIES.md)) says what is under the press.

Both, in that order: the pointer pen is an afternoon and lights up pen programs at once;
MOUSE is what a Forth editor wants. In Forth: `mouse ( -- x y buttons )`, `pick ( x y --
addr )`, and a drag loop of a few lines that reads a vector word, decodes it, and `!`s it
back, written by whoever wants it, at the Forth prompt, with the same decode as
`edit340.ts`. The emulator only delivers events and draws; the tool lives in the machine.
The same MOUSE device is ROADMAP §13's Engelbart mouse port.

**To do: the turtle display list as ring data, sharing graftal's code.**
Split `toDisplayFile` into `polylines(strokes)` and one shared emitter,
`compilePolylines(lines) → { words, starts }`, so `toDisplayFile` keeps
its output. Store each polyline as an RSP block (raw coordinates, which
the relocation pass already leaves alone) named from a picture list
whose name is `SAVINS`. `downCompile(image)` walks the list through the
shared emitter and returns the words plus tags (display-address range →
ring name) for the pen. Acceptance: `downCompile` equals `toDisplayFile`
for the fern, still after `relocate` and a wire round trip, and a pen
hit on the tube resolves to its polyline's name. The layout is ours, not
SYMELEC's segment format, and says so until the element decode lands.
The same structure is what a PDP-7 Forth builds
([FORTH-TURTLE-340.md §9](reference/FORTH-TURTLE-340.md#9-rings-as-a-forth-data-type)).
Background for all of this: the ring-structures section of the
[turist guide](reference/GUIDE-RINGS.md).

**To do: the RSP library, extracted from PIXIE and shared by every VM.**
One format, two halves.

**Layers, each optional above the first.** Lift Heinz's code verbatim, beautified and commented
with attribution; change only packaging and calling conventions. The PDP-7 side stays flat and
non-reentrant. Anything that recurses brings its own stack, and RSPPIX already does: `LOP`
(`STAK`/`UNSTAK`) is an operand stack, `LINK` (`ENTER`/`EXIT`) is a return stack, and the
collector keeps a branch stack at `GSTKP`. New recursive code goes in Forth, which has stacks.

| Layer | Source | Needs | Holds |
|---|---|---|---|
| `rsp.s` | RSPPIX, scan pp. 113–127, assembled 29 1 72 by HL1470 | the layout words | `SETUP`, `FLST`, `GETSP`, `INIT`, `CAR`, `CDR`, `PUSH`, `POP`, `STAK`/`UNSTAK`, `ENTER`/`EXIT`, collector `LIM`…`GARB2`, `BDN`, Ring Structure Processor (May 1969): `FEL`/`FELN`, `NULLR`, `INSRT`, `FINDS`/`FINDN`/`FINDP`, `GRHA`/`GRRB`, `ADDW`, `DSON`, `DELB` |
| `reloc.s` | SYMELEC `/LTPIX/RELOC`, pp. 24 (`RELOC1`…`RLCEND`) | `BEG`, `END`, `RELCON` | the relocation pass alone: load a ring image from tape or disk at a new address with no link |
| `ltpix.s` | SYMELEC `/LTPIX`, pp. 21–25 (`LTPX`, `RW`, `WAITLK`, `PXID`) | `reloc.s`, `BEG`, `END`, `SAVINS`, `ERRGB` | the blocklet transfer: 4-word heading, checksums, PDP-7 ↔ Titan |
| `rsp.fs` | new | `rsp.s` | Forth words over RSP, both Lisp names (`CAR CDR CONS`) and RSP names (`INSERT NEXT HEAD`); recursion lives here |
| `net.fs` | new | `rsp.fs`, `ltpix.s` | send, receive, request, reply, handlers |

Packaging changes only: `WAITLK`'s PIXIE-specific idle work (restart the display file at `DFB`,
Control-X abort to `BERTP1`) becomes two hook words the host program fills, defaulting to
nothing. The layout table that ends RSPPIX (`BEG FREE ENDRES BOT TOP SAVINS LPBEG LOP LKBEG LINK
… LKEND ERRGB GDM BCC`) is exactly the interface each program supplies, so it stays data. Test:
SYMELEC assembled from the layers is word-for-word `symelec.oct` at the same addresses.

- **On the PDP-7:** RSPPIX's own routines (`SETUP`, `FLST`, `CAR`, `CDR`,
  `PUSH`, `POP`, `STAK`/`UNSTAK`, `ENTER`/`EXIT`, the collector) lifted out of
  SYMELEC as a loadable image with its layout words, so Forth (as code
  words, [FORTH-TURTLE-340.md §9](reference/FORTH-TURTLE-340.md#9-rings-as-a-forth-data-type)),
  a Lisp or any other PDP-7 program runs the same code PIXIE does. Beside
  it, new code, never patched into PIXIE:
  - a link client: open a session, send and receive ring transfers, both
    `PXID` drawings and messages;
  - a teletype client: type at another machine, read its printout;
  - handlers: a name list from message names to routines (`HANDLES name`
    in Forth), and a dispatch loop that polls the way `WAITLK` does;
  - send, request and reply, and the device-event kinds;
  - shared windows at the same address everywhere, `ISZ` locks (lock word
    777777), safe points, and barriers through Titan.
- **In TypeScript** (`packages/pixie`, to be renamed `rsp` if Don agrees):
  the codec as now, plus the host side of all the above: message
  encode/decode, device events on the [session](src/session.ts) vocabulary,
  the tiny-its services ([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do)),
  and window mapping.

Threading stays as [WEB-BENCH.md](WEB-BENCH.md) decided: none. Several
cabinets in one thread share a window by sharing one `Uint32Array`
segment, and a lock is a scheduling rule. That needs a window map in
`Pdp7.read`/`write`, whose core is one private array today. Workers and
`SharedArrayBuffer` only if one thread stops being enough.

**Sharing PIXIE's own window, unmodified.** PIXIE's memory layout is data:
sixteen words at 5157–5177 (`DFE` … `STSAVE`) that `SETUP` reads, which is
what the `core8k` and `bigpic` patches poke. With them loaded, PIXIE's data
sits in the top of the 8K: RSPPIX's `FREE`, `LOP`, `LINK` and `GDM` at
12011–12020, the compiled picture (PERMDF) from 12301, the heap `BEG`–`END`
at 13741–17200, and the name list from `BOT` at 17301. Map 12000–17777 into
every VM and keep the others' code below 12000.

- One PIXIE writes and the rest read. The name list is the root set, since
  the collector marks from it, so readers walk it too.
- The host is the lock: readers run only while PIXIE polls in `WAITLK`,
  where no splice is half done and no collection is running.
- The collector marks and sweeps in place (mark bit 200000, masked with
  577777), so pointers stay valid, but anything off the name list is swept.
  A reader that keeps a pointer, or takes cells from `FREE` to write at a
  safe point, hangs them on a named ring.
- Two PIXIEs on one heap would need changes: `TOP+1` (5170) and `OP` (2232)
  are private while `FREE`, `LOP` and `LINK` would be shared. Until then
  they trade rings over tiny-titan.
- Our own writers lock with `ISZ`: the lock word rests at 777777, the `ISZ`
  that reaches 0 skips and owns it, and unlock stores 777777 again
  (`LAW 17777` / `DAC LOCK`). Under Web Workers, `Atomics.add` or a
  test-and-set IOT on `Atomics.compareExchange`.

**Sharing is per-VM configuration, not wiring.** A VM maps none, one or
several named segments, each at an address and with an access mode.
Segments holding rings must sit at the same address in every VM, because
ring words are absolute; a flat buffer or a mailbox can go anywhere.
Sketch:

```yaml
segments:
  rings:   { words: 0o6000 }          # PIXIE's own data area, 12000-17777
  mailbox: { words: 0o100 }
vms:
  pixie: { program: symelec,   map: [{ segment: rings, at: 0o12000 }] }
  forth: { program: pdp7forth, map: [{ segment: rings, at: 0o12000 },
                                     { segment: mailbox, at: 0o7700 }] }
  view:  { program: pdp7forth, map: [{ segment: rings, at: 0o12000, access: ro }] }
  duel:  { program: duel,      map: [] }
locks:
  rings: { segment: rings, held-in: [[SETUP, GARB2]], free-in: [WAITLK] }
```

**Magic implicit locks, enforced by the emulator.** We own the emulator,
so a lock can belong to the machine instead of the program. A lock
section is a start and length taken from the symbol table, named in the
config by symbol so a reassembly moves the lock with the code. Examples:
RSPPIX, which was assembled as one block, or just its collector, `LIM`
to `GARB2`. The emulator gives a VM the lock when its PC enters a
section. Another VM about to enter a section of the same lock is not
stepped until the lock is free. Its devices keep running, so to the
program the wait looks like a slow instruction. Entry is a `JMS` into
the section and exit is the `JMP I` through that entry's return word,
so a section that calls out (`FLST` calling `LIM`) still holds the lock.
The inverse policy, *free inside*, covers PIXIE: it holds its window
everywhere except `WAITLK`. Cost: one byte per word of core, a lock
number per address, looked up on each fetch. What it can't see: a store
to shared memory from outside every section. The emulator can watch the
window and flag those. It can also see deadlock (two VMs each stalled on
the other's lock) and report it instead of hanging. The unmodified
program never knows.

**Shadow memory: bits only the emulator sees.** Core is a `Uint32Array`
holding 18-bit words, so every word has 14 spare bits, and `write` masks
them off today. Use them for tags the machine can never see. Tags live
in the segment's array, so a shared segment shares its tags too. The rule
that makes it cheap: an untagged word has its top bits zero, so the fast
path is one test (`raw > 0o777777`), and only tagged words take the slow
path. Sketch of the 14:

| Bits | Tag | Kind |
|---|---|---|
| 18 | break on execute | trap |
| 19 | watch reads | trap |
| 20 | watch writes | trap |
| 21 | watch 340 fetches | trap |
| 22–25 | lock section, 15 locks (replaces the separate byte per word) | trap |
| 26 | executed (code coverage, like `ccov7` in pdp7-unix) | sticky |
| 27 | written since boot (a read without it is an uninitialised read) | sticky |
| 28 | dirty since last snapshot | sticky |
| 29–31 | spare | |

Trap bits send the access to the slow path. Sticky bits are set by
ordinary accesses, only while that feature is on, since each costs a
store. A trap bit says only that someone cares; who and what (which VM's
breakpoint, which watch, what condition) sits in a side table keyed by
address, so two VMs can watch the same shared word differently.

**Thicker layers, in parallel arrays.** Whatever does not fit in 14
bits goes in shadow arrays of any width, indexed like core and attached
to the segment: last writer (VM, PC, cycle) for every word, read and
write counts for a heat map, the source line or message a word came
from, a short history per word. That is the shape of Valgrind's memcheck
and AddressSanitizer, here for free because we own the machine. It
covers all memory, not only shared segments, and it feeds the panels:
break on a word, show who last wrote it and from which source line, and
colour the core strip by heat or coverage.

What changes in `Pdp7`: `write` must keep the tag bits and replace only
the low 18 (`core[a] = (core[a] & ~0o777777) | word`), every read the
machine or a device sees must mask them off, and tags get their own
calls. Snapshots stay 18-bit words, portable by construction as
[WEB-BENCH.md](WEB-BENCH.md) requires; tags and layers save beside them,
optionally.

**RSP in Unix syntax.** RSPPIX is written for the Cambridge assembler,
which `asm.ts` already parses. An emitter that prints `as7` syntax
(Ken Thompson's, as in `pdp7-unix`) gives an `rsp.s`. PDP-7 Unix had no
separate linker: `as` assembled several files together (`as7 -o boot.rim
sop.s pbboot.s` in the pdp7-unix build), so linking RSP into a program
means adding it to the command line. Mitch's Forth builds with `as7`, so
its kernel takes `rsp.s` directly and wraps the routines as code words.
The layout words stay data, so each program puts the heap where it
wants. To check: whether `as7` accepts the `NAME = JMS .` idiom, or the
emitter spells the calls out.

**Shared segments under Unix: swap the mapping with the process.** PDP-7
Unix already does this for one mapping, the display buffer. The `capt`
system call stores the process's buffer address in `u.dspbuf` and calls
`movdsp`; `rele` gives it back; and the swapper (`swap` in `s1.s`) points
the display at the kernel's own buffer before swapping a process out and
back at `u.dspbuf` after swapping it in. `dskswap` (`s5.s`) moves the
64-word user area and all 4096 words of user memory (010000–017777) to
and from swap space. A shared-segment hack has the same shape:

1. the user area gains a short map list: segment, address, length;
2. two system calls beside `capt` and `rele`, map and unmap, added to the
   `swp` dispatch table;
3. a new IOT asks the emulator to map or unmap a segment for the memory
   now in core;
4. the swapper unmaps before `dskswap; 07000` and maps after
   `dskswap; 06000`, where it already calls `movdsp`;
5. `dskswap` skips mapped ranges, splitting its 4096-word transfer around
   them. Otherwise swap-out writes the shared contents to disk and
   swap-in brings a stale copy back over the live one.

Then processes share segments with each other (one is in core at a time,
and each maps its segments when it comes back in) and with other VMs: a
display list any VM's 340 refreshes from, like a frame buffer, or
PIXIE's rings read by a B program. The swap-in IOT also tells the
emulator which process is in core, so symbol tables, lock sections,
breakpoints and shadow tags switch with it. The limit is size: user space
is 4K, and PIXIE's window 12000–17777 would leave a program only
010000–011777, so map the part it needs or a smaller segment.

## Local mode and remote mode

The same cabinets run in two places. **Local:** everything in the tab, as
now. **Remote:** any number of VMs on a cloud instance under Node (they
already run headless in the tests), with the tab as a terminal. The 340's
display list goes down and device events come up: interaction local,
computation remote, the split the 1967 Cambridge system analysis drew.

- **Down: the display list.** Each frame as the segment rows
  [`toYaml`](src/media.ts) already writes (`[addr, kind, x0, y0, x1, y1,
  int, scale, subr, cycle]`), or the JSONL the `Recorder` writes. The
  provenance travels with it, so hover, the inspector and linked brushing
  work remotely. PIXIE's picture is mostly still, so send a frame only
  when it differs from the last one sent, or send only the rows that
  changed, keyed by display address.
- **Up: device events,** the [session](src/session.ts) vocabulary (`sw`,
  `pen`, `tty`, `poke`, and the console kinds). The server stamps each
  with the cycle it was applied at, so its log replays the run exactly.
- **The pen stays in the machine.** The light pen device tests segments
  as the 340 draws them, in machine time; the tab only says where the pen
  is. Latency shows up as a lagging cross, as a fast hand already
  outruns SYMELEC's tracking, so the tab draws its own pointer locally
  and the hand never lags. The cabinet's 340 takes several pens, so two
  people in two places can each hold one.
- **Later: ship the 340's program instead.** The 340 is a computer, so
  the server could send display-file words and let the tab run the 340,
  the way NeWS sent PostScript rather than pixels. Smaller, and the
  phosphor timing is exact locally, but pen hits must then travel back
  into machine time. Segments first.
- **Watchers and pens.** A VM's frames broadcast to every viewer; who
  holds a pen is floor control, handed out by tiny-its.
- **Pacing.** The server runs each machine at 1969 speed or faster; the
  tab draws at `requestAnimationFrame`. Drop frames, never events.

One seam serves both modes, as `TitanPort` already does for the link: a
display port and an event port, in-process when local, a WebSocket when
remote.

**On a shared server** the emulated code cannot leave the emulator, but
the server still trusts nothing from a tab: validate every message
against its schema, cap VMs and CPU per user, rate-limit events, cap
segments per frame (a runaway display file makes huge frames), require
ownership or an invitation for any write (the tiny-its rule), and give
VMs no host files beyond their scoped filestore.

## Media — what the machine eats and excretes

SYMELEC issues **no reader or punch IOTs** — paper tape was how code arrived
(hardware read-in mode), not a device the program touches. So tape is a
loader-side module, not a Device.

| Module | In | Out | Validation |
|--------|----|----|------------|
| tape | `.oct`, `.rim` → core | core → `.rim` | diff against Roy's converter output |
| lister | core / `.oct` | 1972 Cambridge lineprinter column format | **diff clean against the 1972 listing itself** — second full-corpus check of transcription and decoder at once |
| assembler | transcribed Cambridge-dialect source | core / `.oct` | **round-trip bit-identical against `symelec.oct`** — the lister's inverse. SYMELEC was assembled on Titan (`BY HL1470`, 12 Feb 72) in a dialect no surviving assembler speaks: `(literal` pools, `JMP , n` relative, and the `DISP` display-word mnemonics, which share the 340 codec built for rung 2. `as7` from pdp7-unix is the cross-platform precedent; the DEC assembler on the emulated iron is the period-authentic stunt. Once the round-trip is clean, PIXIE is editable — patch, reassemble, boot, and diff the segment log against the original to see exactly what changed. |
| snapshot | segment stream | SVG (provenance as data attributes), PNG | eyeball vs 1969 film frames |
| recorder | segment stream | timestamped segment log (JSONL); WebM via `captureStream` | deterministic replay |
| phosphor | segment stream | canvas fade; WebGPU dual-phosphor later | the pretty-pass, never a blocker |

Load-bearing choice: **the segment log is the one stream** — snapshot, video,
phosphor, and the pen all consume it. Record and replay it and every display
bug is reproducible; the film comparison becomes a diff, not a squint.
Media files carry YAML-jazz sidecars (source, date, provenance), repo style.

The SVG snapshot is vector-to-vector with no rasterization between: a 340
display file is already closer to SVG than to pixels. Structure survives —
**a 347 `DJS` subroutine call becomes an SVG `<g>` group**, so PIXIE's
subpicture hierarchy is the export's hierarchy, and provenance rides as
`data-` attributes: click a stroke in the browser inspector and read the
display-file address that drew it in 1972. A dead vector format translated
into the living one, structure intact.

**Provenance is a timestamp too — the drawing maps back to machine state.**
Each segment carries the display-file address that drew it *and* the
backplane cycle it was drawn on, plus the 340's state at that instant
(display PC, mode, scale, intensity, `lp_ena`). Because execution is
deterministic from a snapshot plus the input log, a cycle stamp is a
**seekable address into machine time**: click a stroke — in the live canvas,
the SVG export, or the portrait's tube — and the debugger frame re-runs to
that cycle and lands with the whole machine posed: CPU registers, the 340
mid-file, the console lamps' duty cycles. The pen already needs
freshly-intensified segments, so recency is in the record anyway; the
debugger just reads the same field. Slow mode is this scrubbed
continuously; single-step is this at grain one. Nothing new to build in the
emulator — it is the segment log, the snapshot, and the frame manager
composing.

## Cartridges and live coding

The format, the build cache, `extends`, live decoding, eggs and the git workflow are in
[CARTRIDGES.md](CARTRIDGES.md). This section keeps the name, variants and the LIVE CODING panel.

**The name.** What the menu calls a program is really a whole configuration: which machine, which
devices, what to load and from where, how to build it, how its keys map, which panels open, its
help and its demo. Emulators have names for parts of this. SIMH has the `.do` script, MAME has
drivers and software lists, and Docker's *container* means an isolated running process, which
this is not. We call the file a **cartridge**: a thing you plug into the cabinet that carries
everything needed to run one program. A **profile** is a named overlay on a cartridge (trace on,
the memory panel open in source view, speed 10×), and several can stack. Everything the cabinet
knows about a program lives in its cartridge or is referred to by it.

**The URL is a cartridge plus profiles.** `/cabinet/<cartridge>/?profile=trace,wide&size=768`.
A `yaml cabinet` fence in an article says the same things in the same words, so a link and a
transclusion embed the same preconfigured machine. `src/lib/cabinet-url.js` in the ties app is the
one parser; today it knows `program` and `size`. The query overrides the path, profiles apply left
to right, and explicit parameters win last.

**A cartridge, sketched** (today these are the objects in `apps/ties/src/lib/cabinet-programs.js`,
which become files):

```yaml
id: forth-self-hosted
label: FORTH, BUILT HERE
machine: { cpu: pdp7, core: 8192, eae: true }
devices: [teletype, clock, papertape, type340]
keyboard: { case: upper, echo: program }        # Forth echoes; UNIX is { case: lower, map: simh-unix }
listing: { user: wmb }                          # who the listings say assembled it
sources:                                        # what LIVE CODING edits, in build order
  - { path: tapes/pdp7forth/kernel.s, lang: as7 }   # assembled after pdp7-unix's sop.s, then end.s
  - { path: tapes/pdp7forth/prelude.fs, lang: forth }
  - { path: tapes/pdp7forth/turtle.fs, lang: forth }
build:
  - { step: assemble, dialect: as7, sources: [kernel.s], out: kernel }   # our assembler: source map + symbols
  - { step: paper-tape-compile, image: kernel, tape: [prelude.fs, turtle.fs], type: "TAPE\r" }
boot: { start: cold }
panels: { tty: open, display: open, live: open }
demo: forth-turtle
help: articles/cabinet-forth.md
```

**Two Forths on the menu.** `forth` boots the kernel Mitch's `as7` assembled (committed, the
baseline). `forth-self-hosted` assembles `kernel.s` in the page. Both have to agree word for word
before the second one counts. What the second needs is an `as7` front end (see Assemblers, below):
`label:`, `name = expr`, `" comments`, `.=.+n`, `<c` character literals, `1f`/`1b` relative
labels, `;` between words, and numbers that are decimal unless they start with 0. Then the
assembler's source map gives the trace, the memory panel and the debugger Mitch's own source lines,
not just addresses.

**Variants are copies, not ifdefs.** This is a design rule. Neither `as7` nor our assembler
has conditional assembly, and we won't add it. A variant is a copy of the file, changed, with a
big-endian descriptive name (most general word first), so the family sorts together and each
name says what it is. Its provenance is written down in the open, not left in git history:

- **In the file:** a header comment saying what it was copied from, at which commit, what it
  changes, and which parts must stay in step with the parent.
- **Beside the files:** a `VARIANTS.yml` listing each variant, its parent, the upstream commit,
  the differences, and the sections that have to stay the same.

Keeping the copies coherent is the LLM's job. It reads `VARIANTS.yml`, sees a change to one copy,
and carries it into the others, or says why it doesn't apply. That makes several copies cheaper
than one file full of switches: each copy reads straight through, Mitch's `as7` builds every one
of them unchanged, and the differences are visible in the names and the list.

**The first variant: name format.** Mitch's headers keep a length and three SIXBIT characters
(`EXIT` lists as `EXI_`). The copies:

- `kernel.s`: Mitch's, unchanged, the upstream.
- `kernel-names-full.s`: every character of a name kept. What differs: the 84 two-word headers
  (generated by his `tools/hdr.py`), `find`, the parser's packing of the sought name into
  `tcnt`/`tname`, the header builders in `colon`, `const`, `var` and `create`, WORDS, and any code
  that goes from a header to its name. Only `mkcell` and `find` go from header to body, so with
  the extra name words placed before the two-word header, as Open Firmware lays names out, the
  threading is untouched (VARIANTS.yml has the layout).

The cartridge picks the file, as `as7` has always picked files: by the list it is given.

**Then finer grains.** The kernel splits into pieces that recombine, each with its variants,
closer to a metacompiler. A cartridge's build lists which pieces and which variants; the LIVE
CODING panel shows each choice as a switch or a dropdown, and Run reassembles, rebuilds the image
and boots it.

The Forth sources don't need to know. If one ever does (a decompiler that prints names, say), the
kernel variant defines a constant, `FULLNAMES`, and the Forth reads it.

**The LIVE CODING panel**, before MEMORY, for cartridges that list `sources`:

- a menu of the cartridge's source files, and an editor on the chosen one;
- **Save** (to the browser's local storage), **Revert** (back to the cartridge's copy), **Build**,
  and **Run**, which builds first;
- **Load**, for Forth sources: mount the file on the paper tape reader of the machine that is
  running and type `TAPE`, so the definitions go into the live image with no rebuild;
- below the editor, the build output: assembler errors with their lines, the listing, and what
  the paper-tape compile printed.

**Images.** Save the running core, or a built image, to local storage and load it again later.
All local for now; tiny-its will be the one that knows about servers and cloud storage, and
uploads and downloads images through its own interface.

**And tiny-its itself.** Once tiny-its is Forth running on the cabinet, the LIVE CODING panel
edits the mainframe too.

**Full names: developed here, given back.** The full-names kernel is built in the page first, with
the `as7` front end, the LIVE CODING panel and the source-mapped debugger, since that is where it is
easiest to see what goes wrong. Once it works, it goes back to Mitch's repo as two tested PRs: a
`KERNEL` parameter for his Makefile, `test/run_tests.py` and `check_names`, and then
`src/kernel-names-full.s`, passing his tests under SIMH ([ASSEMBLERS.md](ASSEMBLERS.md#next)).

### Games anyone can write

**HILO's talk tape.** HILO splits into an engine (`hilo.s`) and a talk tape, the only file a
student needs to write:

- **Remarks**: a number, then the line to say about it. 42, 67 and 69 get their jokes; 0 and 100
  are edgy; 13, 7 and 99 have something to say. The range is 0 to 100 inclusive.
- **A binary-search remark**: the engine notices two midpoint guesses in a row (50, then 25 or 75)
  and says what it thinks of you.
- **Rounds**: numbers to be guessed in order, each with the message you win by finding it. With no
  rounds, the number is random, as now.

It's ELIZA crossed with guess-the-number, reading your numerology. The remarks are printed, so a
screen reader speaks them, and a teletype setting reads them aloud for everyone. A talk tape is
just source: upload one, or paste someone else's into the LIVE CODING panel, and the page assembles
it with the engine and runs it.

**Animal, in Forth.** The classic guess-the-animal game, which learns a question each time it
loses. Its save file is a Forth program: loading it builds the tree of questions and animals in
memory, and playing adds to the tree. SAVE prints the new tree as source again, so the game you
share is readable, diffable text, not a binary image (though an image can be saved too). We work in
source-code space.

**To do: Animal's tree as pixie rings.** The tree is a ring structure: each question is an
element with a yes ring and a no ring, and each animal is an atom leaf. Learning a question is RSP
`INSRT`, splicing a new element in where the wrong guess stood. Playing is a walk with `FINDN`, and
the recursion (SAVE printing the tree as source) lives in Forth over `rsp.fs`, not in `rsp.s`. The
same rings can be drawn on the 340 as a live tree, sent whole over `net.fs` so two machines share
one animal brain, and shown in the ring editor above. PIXIE built drawings out of rings; this
builds a mind out of them.

**To do: Animal on the 340, played with the pen.** The tree is drawn on the screen: each question
and each animal is a box with its title in 342 characters and its id beside it, joined by yes and
no lines. You answer with the light pen, not the keyboard: point at YES or NO under the current
question, or at any node to jump there and browse. The keyboard is only for what the game can't
know, the name of a new animal and the question that tells it apart. No parser beyond Forth's own:
every pen hit becomes a line typed on the teletype, a Forth word with a number (`YES`, `NO`,
`17 GO`), so the teletype shows exactly what the pen did and a typed line does the same thing. It
makes no pretence to read English; it shows how a decision tree is stored, walked and grown, and
the tree on the screen is the data structure, not a picture of it.

What it needs:

- `text` in `turtle.fs`: append 342 character-mode words (three six-bit codes a word) to DLIST at
  the beam, then escape back to vectors.
- A hit table the program keeps in core, at a label the cartridge names: one entry per pickable
  thing, the first and last DLIST address of its words and its id. The 340 already records which
  display word drew each segment (`Segment.addr`), so a pen hit is an address, and the table turns
  it into an id.
- The cartridge's pen handler (below) reads the table and types the line.

**To do: Gosling's lunar lander, as the turtle.** James Gosling mailed Don "a cheezy lunar lander
game" in NeWS PostScript on 3 November 1988
([lander.ps](https://donhopkins.com/home/archive/news-tape/fun/lander/lander.ps)). Ported to Forth
over `turtle.fs`, the lander replaces the turtle's triangle: `redraw` draws Gosling's body, legs,
windows and a flame as long as the thrust, rotated to the heading. The physics are his, in the
turtle's fixed point: each tick `dy += cos(theta) * thrust / 30 - .1`, `dx -= sin(theta) * thrust
/ 30`, bounce off the screen's sides, and land when the altitude over the terrain is under 77 with
both speeds under 3 and the tilt under 20 degrees; otherwise the shards. The terrain is his random
walk with slope, drawn once as the backdrop, stars and all. His mouse becomes the light pen:
across sets the attitude and up and down the thrust, read through the same handler as Animal's,
which types the numbers as `THRUST` and `TILT`. A landing walks the little person out.

### Pen events and cartridge scripts

The display emulator delivers pen hits to handlers the cartridge defines. A hit carries the 340's
provenance: the display address that drew the segment, the beam position, and which pen. The
cartridge says what to do with it, in a `scripts` section of named scripts that handlers and other
scripts call, as many as a program needs. Libraries of scripts are imported by path, so Animal and
the lander share one `pen-to-tty` library rather than two copies.

```yaml
imports: [scripts/pen-to-tty.yml]          # each library is a file of named scripts
on:
  pen: animal-pick                         # also: key, tick, boot
scripts:
  animal-pick:
    - lookup: { table: HITS, addr: $hit.addr, as: id }   # first, last, id entries in core
    - if: { set: id }
      then: [{ call: type-line, text: "$id GO" }]
```

Scripts are data, a short list of steps from a fixed vocabulary: read core, look up a hit table,
type on the teletype, set a register or a panel, call another script, and a conditional. No loops
and no eval: cartridges arrive by URL and get pasted into LIVE CODING, so a script must not be
able to run arbitrary JavaScript in the page. Anything that wants a loop belongs in Forth or
assembler on the machine, where the cabinet can show it. Yes, this will get out of hand; the
fixed vocabulary is where it stops.

**Sources as linguistic motherboard cards.** Each of these sources carries a header of what it is:
title, description, prompt and style. With that, a program is a card that can be regenerated in
another language or style: the same animal database as Forth, as Lisp, as a talk tape. MOOLLM's
cards, for code.

**TODO: cellular automata, and a tile engine under them.** A cellular automata library that many
small programs can be made from, the same kind of personal, user-made games as the talk tapes.
Under it, a tile engine that stacks layers on the 340:

- the character generator;
- selection and editing cursors;
- procedural, parameterized symbols;
- flow fields;
- and more, all on one grid.

A representation layer decides how a cell's state looks. The inner loop, the rule that makes each
automaton what it is, is the only code a new program needs, and it plugs into the rest. Don's
[CAM6](https://github.com/SimHacker/CAM6), in this workspace, is the model to follow.

### CAM on the PDP-7: a CAM-off

**Rules as sub-cartridges.** Each cellular automaton rule, like each guessing game, is a small
cartridge of its own:

- a natural-language description;
- a HyperTIES article that explains it, with illustrations, in the manner of Rudy Rucker and John
  Walker's CelLab rule catalog;
- and the rule itself. Code for any target is generated from it: PDP-7 assembly, Mitch's Forth,
  JavaScript.

The same card makes every version.

**Harvest, with the people who made it.** The rule descriptions come from CelLab's catalog, and
from Toffoli and Margolus's *Cellular Automata Machines* (MIT Press, 1987), the CAM-6 book. We
engage Rudy Rucker and Norman Margolus to harvest them and fold them in; both have characters here,
with invitations (`characters/rudy-rucker`, `characters/norman-margolus`). John Walker died in 2024,
so his half of CelLab comes from fourmilab.ch; check its terms when we harvest.

**The rule compiler, ported.** Toffoli and Margolus defined CAM-6 rules in Forth. Don cloned their
rule compiler in Mitch's Forth decades ago, and his CAM6 simulator (`CAM6/javascript/CAM6.js`,
with `jsforth.js`) runs the same rules in the browser. It gets ported once more, into Mitch's
PDP-7 Forth.

**A CAM6 cabinet.** A CAM-6 device for the PDP-7, with IOT instructions to load a rule table, step
the planes, and read and write cells. It runs off-the-shelf CAM-6 rule tables, defined in Mitch's
Forth with Don's rule compiler.

**The CAM-off.** The same rule, twice, side by side on the 340:

- once on the CAM6 device, from its Forth definition;
- once as plain PDP-7 assembly on the bare CPU.

The trace counts the cycles each takes per generation, and the page shows them as they run. The
two play music together as they go, realistic (the AM radio) or interpretive, from what the cells
are doing. Brian Eno would love it (`characters/brian-eno/speculative-jams.md`).

**The layers, shown.** The page can show every layer at once:

- JavaScript runs the PDP-7 emulator;
- the emulator runs Mitch's Forth;
- the Forth compiles the rule;
- the rule drives the CAM device, which draws on the 340.

Each layer has its own source map and its own panel, and a click goes down a layer. 

### Raster: a vanilla virtual video display, and a cell renderer

The 340 draws vectors; cells want pixels. Two more cabinet devices, both marked as extensions,
both reading core directly as the 340 does, so the PDP-7 program only writes memory and never
sees how pixels are pulled out. All the cleverness is on the TypeScript side.

**The pipeline:**

1. *Cells.* The CAM6 device, or the PDP-7 rule in assembly, or Forth, steps cell buffers in core
   through lookup tables (the CAM-off above).
2. *Cell renderer.* A device pointed at a cell buffer, a colour map and a framebuffer writes
   pixels from cells: state through the colour map, each cell as a block of pixels. Colour-map
   animation (cycling, fading, blink) is the renderer changing the map, not the cells, so a still
   automaton can shimmer, after CAM6.js's colormap generators.
3. *Framebuffer.* Shows any memory as a picture on a canvas beside the tube.

**The framebuffer is a descriptor**, set by IOTs or written to core and pointed at:

| Field | Meaning |
|---|---|
| base | a *byte pointer*: word address, bit offset and byte size, PDP-10 style (`POINT 6,BUF,5`) |
| width, height | in pixels, any size |
| colbytes | step from one pixel to the next along a row, in bytes (can skip, for interleaving) |
| rowbytes | step from one row to the next, in bytes; negative flips vertically |
| flip h / v | mirror, cheap since the stride is already there |
| format | monochrome (1 bit), indexed (any byte size up to 18) through a colour map, or direct RGB (3 fields) |
| colour map | another byte pointer: a table of RGB entries in shared core, so programs animate it by writing it |

With byte pointers and strides, one bank can hold several interleaved planes, a framebuffer can
be a window into a larger picture, and the same cells can be viewed as monochrome, indexed or RGB
by three descriptors at once. Layouts that fit a 32K machine are in
[GUIDE-PDP7](reference/GUIDE-PDP7.md#the-pdp-7-next-to-an-apple-): RGB planes one per bank, or a
256² monochrome screen in bank 0.

**Eight displays, eight pens.** The device holds eight descriptors, each its own canvas, so one
machine can show eight views at once: the same cells as monochrome, indexed and RGB, a zoomed
window, a mirror, a colour plane alone. Any pen can point at any display. On a raster, a pen hit
needs no beam: the device reports which display, the pixel, and the byte pointer of the word and
bits under it, so a program knows exactly which cell it touched, through the same pen IOTs and
`IDPN`. Eight people, eight pens, eight screens, one PDP-7.

**Tile renderer.** Each cell state picks a *tile*, a small picture from a tile table in core, so
cells tessellate into a pattern: a fluffy, textured colour map. A colour map is the special case
of 1×1 tiles, so there is one renderer, not two: cells × tile size = image. 16² cells of 16²
tiles make a 256² image; 256² cells of 1×1 tiles are the same image as a colour-mapped screen;
anything between trades cell resolution for texture. Tiles are framebuffer descriptors too, so a tile can be
indexed through its own colour map, and animating either the tiles or the map restyles a running
automaton without touching a cell. The raster twin of the 340's tiles-as-subroutines below, and
of CAM6.js's tile views. Tile selection can also use the neighbours (a cell's state plus which
neighbours are alive picks the tile), so edges join up into continuous shapes, Wang-tile style.

**Sprites** (later): a short list of descriptors (position, size, byte pointer, transparent
index) composited over the framebuffer, read from core every frame, so a program moves a sprite
by writing two words. Spacewar's ships on a raster, or the turtle as a sprite.

**From Forth:** `fb!` (set a descriptor), `pixel!`, `pixel@`, `cmap!`, and words to point the
renderer. Cost on our side is tiny: a 256² frame is 65K pixel extractions in JavaScript per
browser frame.

### Cells as display calls, in two buffers

**The state is the display list.** Each cell is one `DJS` word whose target is a tile, a 340
subroutine that draws the cell's state and moves the beam one cell on. A generation step rewrites
those words, and the rule reads a neighbour from the low 13 bits of its word. There is no separate
state array, so an edit to a cell is an edit to running display code: the pen, the map editor or a
script writes a word and the 340 draws it on its next refresh.

**Past and present, swapped.** Two buffers, as in `CAM6/javascript/CAM6.js` ("Optimization
Techniques"): the rule reads the past and writes the future, then they swap. The 340 refreshes from
whichever buffer was finished last, so it never shows a half-written generation, and the swap is
one word: the display's start address. Edits go into the buffer on screen, which is the one the
next step reads.

**Wrapping without bounds checks.** Each buffer is two cells wider and taller than the grid. Before
a step, the edge copy writes each border cell from the opposite edge, so the inner loop reads its
eight neighbours at fixed offsets (±1, ±stride, ±stride±1) and never tests for an edge. Will Wright
suggested this one; it came down through CAM6.js's predecessors. Other edge treatments, clamp or reflect, are
only a different edge copy.

**Layout of a row.** `[P] [L] [cells] [R]`, stride W+3:

- `P` is the 340 point word that puts the beam at the row's start. No cell reads it: the nearest
  neighbour offsets from row cells land on `L` and `R`.
- `L` and `R` are the border cells. The beam draws them too, as a one-cell frame outside the grid.
- The frame shows the wrap. The edge copy writes border calls to a dim twin of each tile, one
  address bit apart, and the rule masks that bit, so the frame is a ghost of the far edges and
  clamp or reflect is visible as it runs.

**Tiles as numbers.** Tiles sit at `T + state * size` with `size` a power of two, so a neighbour's
state is its target minus `T`, shifted; a two-state rule like Life only compares with the live
tile's address. A 32 by 32 grid is 34 rows of 35 words, 1,190 words a buffer and 2,380 for the
pair, plus the tiles.

### Or: both generations in one word

An 18-bit word holds two 9-bit halves, so the past and the future can share a cell instead of a
buffer each (Don's suggestion). A cell is `[M1 | layer 1 (8) | M0 | layer 0 (8)]`: each half is
eight bits of state and its own modified bit.

- **Why halves, not two layers and two spare bits at the top:** both halves are the same shape,
  so one routine handles either, offset by a 9-bit shift (EAE `LRS 9`). Nine bits is three octal
  digits, so a word in the memory panel reads as two cells, `123 456`. And each modified bit
  sits beside the state it describes, so writing a layer and marking it are one store.
- **Modified means "differs from the other half".** The step sets it when it writes a next
  state that differs from now. After the parity flips, the now half's modified bit says which
  cells changed this generation; the tile engine rewrites those cells' `DJS` words and clears
  the bits.

- **A parity word says which layer is now.** A step reads the neighbours' now layer and writes
  each cell's other layer, then flips parity. Neighbours' now layers are never written during
  the step, so one array is safe where one buffer of whole states was not. No swap, no copy.
- **One rule for everyone else: now is what you see and what you edit.** The tile engine
  renders the now layer; the pen, the map editor and scripts write the now layer; the next step
  reads it. All three ask the parity word which layer that is.
- **The edge copy copies whole words.** The other layer is about to be overwritten, so it
  doesn't matter that it comes along.
- **Eight bits of state a cell.** CAM-6's four planes fit with four to spare, which is room
  for echo planes or a history plane. The step pays for the half it reads: the low half is an
  `AND`, the high one a shift, so the rule's lookup table comes in two copies, one per parity,
  indexed from where that parity's bits already are. The PDP-7 has no OR, so writing the next
  half is `AND` to clear it, then `XOR` the new bits and modified bit in.
- **The display list is separate now.** A packed cell is not a 340 word, so the tile engine
  keeps one `DJS` word per cell beside the state, pointing at the tile for the now half, and
  rewrites only the cells whose modified bit is set, so a still pattern costs no display writes
  and a refresh never sees a cell half done. Memory comes out the same as two buffers (1,190
  state words plus 1,190 display words for 32 by 32), but a cell has 256 states, not as many as
  there are tiles.
- **Reversible rules come free.** Fredkin's second-order rules compute
  `next = f(neighbours now) XOR past`, and the past is the very layer being overwritten, in
  the same word. Flip parity once without stepping and the same rule runs backward:
  Toffoli and Margolus's reversible CAM-6 rules, run forward and back on a PDP-7, with
  `characters/norman-margolus` to check the details.

Both layouts stay: cells as display calls for two-state rules and the CAM-off's plain
assembly, packed layers for the CAM-6 device and anything with planes.

### Tiles are subroutines, drawn by the Forth turtle

The tile engine draws nothing itself: each cell is a `DJS` to a tile, and a tile is a 340
subroutine. So a rule brings its own tiles, drawn in Forth with the turtle.

- **`n TILE ... ENDTILE`** points the turtle's emitter at tile slot n instead of the display list
  (the emitter seam above), so `fd`, `rt` and friends compile into the tile. `ENDTILE` adds a
  dark move to the next cell's corner and the escape that returns from the subroutine.
- **Tiles are relative.** A tile starts in vector mode wherever the beam is and leaves it one
  cell on; an absolute POINT word would draw every cell in one place, so `TILE` refuses `home`
  and `moveto`. The turtle's own vectors are relative already.
- **A tile table, not a tile per state.** 256 states times a tile slot is more core than there
  is, so state indexes a table of tile addresses and many states share a tile. That table is the
  340's colour map: CAM6.js's colormap generators, with strokes instead of colours, and swapping
  the table restyles a running automaton without touching a cell.
- **Rules carry their tiles.** A rule cartridge (CARTRIDGES.md) holds `rule.fs` and `tiles.fs`;
  Life might draw a filled square and an empty dot, a heat rule a ladder of hatchings, Langton's
  ant an arrow per heading.
- **Edit one tile, every cell follows.** The cells share the subroutine, so dragging a corner of
  one tile with the edit tools changes it everywhere on the next refresh.
- **The same tiles are symbols.** A tile is the Forth-drawn subpicture of the turtle section
  above, so tiles, PIXIE symbols and the CA share one library.
- **Viewpoint is the model.** Scott Kim's Viewpoint (Xerox PARC and Stanford, 1987; demo at
  <https://www.youtube.com/watch?v=9G0r7jL3xl8>) keeps the whole system's state in the pixels:
  the keyboard on the screen is the font, so redrawing a key's cell changes what typing that key
  types, everywhere, at once. Its "visual boot" draws the editor with itself. Here the display
  list is the state the same way: the tile table is the keyboard, a tile is a key's cell, and
  editing a tile while the rule runs restyles every cell in that state on the next refresh, with
  the 340 itself as the puff box. The visual boot follows: a CA whose cells are tiles drawn with
  the turtle, whose tile table and rule controls are drawn as cells of the same automaton.

## Assemblers: several front ends, one back end

As in GNU's BFD, the shared part is the back end, not the parsers. Today `src/asm.ts` is one
assembler with `dialect === "cambridge"` tests scattered through it. It becomes:

- **The back end** (`asm/core`): the assembled object (words or bytes at addresses, each tied to
  its tape and line), placing them and reporting overlaps, the symbol table, the source map
  (`source.ts`), loaders, and the writers: the listing, the symbol table, `.oct`, `a7out`, paper tape.
  It knows nothing about any syntax.
- **A machine description**, which is all the back end knows about the hardware: word size (18 bits,
  or 8), address width, the radix and digit counts it prints in (octal 5/6, hex 4/2), and the
  opcode table the disassembler shares. PDP-7 first; a 6502 is a second description. It prints
  bytes where the PDP-7 prints words, several to a line, and continues a long `.byte` on the lines
  below.
- **Front ends**, one per language, each a parser that gives the back end statements:
  - **DEC-family**: DEC's 1964 dialect and Cambridge's 1972 one really are one language (`name,`
    labels, `/` origins, literals, variables for undefined names). They keep one two-pass engine and
    differ by a dialect object: its extra symbols, whether `,` is the location counter, `DISP`
    and `VEC`, how variables are ordered, and whether variables or literals are placed first.
  - **as7**: Ken Thompson's `as`, a different language, with its own small parser.
  - **Later, 6502**: symbols and source maps for a JavaScript 6502 emulator, ours or an existing one.

The front ends are written here from what each language does, not ported. pdp7-unix's `as7` is
GPL, so it is the reference we test against, not code we copy.

**Every front end is proved against the real thing.** `as7` on Mitch's `kernel.s` must give
`kernel.a7out` word for word and the same `Labels:`. The DEC-family engine must give
`symelec.oct` and `symelec-symbols.tsv`.

**Listings in the 1972 house style**, the one on Heinz's Titan listings
(`characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt`). All the front
ends share it, whatever the machine:

```
/SYMELEC   ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470   PAGE  1
    1                                                      /SYMELEC
    6      21/ 740040  21/      HLT
   10      24/ 212257  BEGRTP,  LAC (JMP INT               /INTERRUPT ENTRY
```

- A page header with the title, the date and time, the user, and the page number. Then one row per
  source line: its sequence number, the address, the word, the label, then the statement, with the
  comment in a column of its own.
- At the end, the symbol table, four to a row and sorted by name, as `NAME = value`. A `*` marks a
  value that is more than an address: 28 of SYMELEC's 29 stars are on six-digit values, and those
  whose definitions survive are Cambridge `name=JMS,` labels ([ASSEMBLERS.md](ASSEMBLERS.md)).
- Options: `title`, `user`, `date`, and
  `pageLines` (60 for page breaks with a form feed and the header on every page; 0 for one
  continuous listing, headed once). Also `width`, and the case the listing is printed in.

**Each cartridge says who assembles it**, in `listing: { user, title }`. The user is printed in
the period's case, and chosen for tribute over technicality: the programmer's own user ID if one
is known; otherwise a typical user name made from their name (`DHOPKINS`), whether or not their
machine had logins; a made-up, mysterious-sounding hacker one only when nobody's name is known.
Several authors are comma separated (`PETERSON,VINER`) and printed as given. Today:

| Cartridge | User | Why |
|---|---|---|
| PIXIE SYMELEC | `HL1470` | Heinz Lemke's Titan ID, on every page of the 1972 listing |
| LIGHT PEN TEST | `CSTEIN` | C. Stein, DEC, the author |
| DUEL | `PETERSON,VINER` | both authors; their first names aren't known here |
| HILO, LANDER | `A2DEH,CLAUDE` | Don's, and Claude's, who wrote them with him |
| FORTH | `wmb,claude` | Mitch Bradley's own, and Claude's, in his lower case; Claude has commits in his repo too |
| UNIX v0 | `ken` | Ken Thompson |

Each front end also keeps its own tool's native format for comparison: `as7 -f list` with its
`Labels:`. The house style is what the cabinet shows and prints. The LIVE CODING panel's build
output is this listing, and a listing can be saved as a text file or printed on paper.

## Source maps as transclusion: layers, spans, links

A built program is an address space that code and documentation are transcluded into. The model
is Ted Nelson's Xanadu and gwern.net's include-links (Said Achmiz, `js/transclude.js`), applied
to core.

- **Layer**: one immutable artifact, `{ hash, kind, media, units }`. Kinds are core, source in
  some dialect (Cambridge, as7, Forth), intermediate code, a listing, a scan, a PDF, a Markdown
  doc. `units` says what an index counts: words, lines, rectangles, sections. A rebuild makes a
  new layer with a new hash and never edits an old one. That is Xanadu's I-space: positions can't
  move because content is never changed in place.
- **Span**: `{ layer, ranges }`, half-open ranges by position, as in gwern's `#from:to`. Several
  ranges cover a line broken across a page, a routine split over pages 113 and 114, or a doc
  section in two places.
- **Arrangement**: an ordered list of spans, Xanadu's V-space edit decision list. The core image is
  an arrangement whose positions are addresses; a listing, a woven literate document and a page of
  notes are others.
- **Link**: `{ type, from: Span, to: Span }`, stored once in an edge table, with the reverse
  index built on load, so every link can be followed from either end, the way gwern's backlinks
  can. Types include `assembled-from`, `translated-from`, `compiled-from`, `printed-at`,
  `explained-by` and `tested-by`. Presentation hints come from gwern: inline or popup, unwrap,
  with context.

**Addressing is by position inside a build, and by hash across builds.** The tools number
everything at build time, and nothing is inserted or deleted afterwards. That is what DWARF, JS
source maps and LLVM metadata do. A reference into another layer carries that layer's hash, so a
stale reference reports itself as stale instead of binding to whatever now sits at index 412.
Only links into hand-edited text (Markdown) anchor symbolically, by heading slug plus a short
quote, Web Annotation style, and those resolve to positions when the bundle is built, or fail
loudly. Scans and PDFs never change, so page plus rectangle is permanent (IIIF's `#xywh=`). To
keep the cursor and selection across rebuilds, the UI uses `tape:line` or a symbol, which is never
stored in the maps.

**Vertical relationships are just spans and links.** One-to-many (a Cambridge line split into
several as7 lines, a Forth word into many cells), many-to-one (a label line and the line below
it, an expression continued over several lines), interleaved spans, broken spans, and generated
words with no source (literal pools, variables, alias labels) need no special cases. A cell whose
word in core no longer matches its link's word (a patch, self-modification, a variable, a JMS
return address) is Xanadu's "differs from the original"; `source.ts` already tracks it.

**Inherited mappings.** Not every link is written by hand. A doc section that covers a file,
directory or tape covers everything inside it. A comment block covers the routine under it. A
cartridge's README covers the cartridge. Mappings inherit along lexical and file-system
containment, and a nearer, more specific link overrides an inherited one. One doc section may
map to many places in the code, and one routine may be explained by many docs.

**Reading and writing docs are live coding too.** The same environment that edits and assembles
code is where you:

- read a paper or a scan and lay rectangles on it;
- select text and transclude it into documentation;
- map that documentation onto the code it explains.

Every one of those acts makes layers and links in the same bundle the assembler writes.

**What the network then drives:**

- **Validation**: a link whose ends disagree (the scan's octal against the transcription, against
  the assembled word) is a finding. That is how the SYMELEC misreads were caught, by hand; the
  network makes it mechanical.
- **Testing**: `tested-by` links say which tests cover which words, and which words no test
  touches.
- **Generation**: a layer generated from another (as7 from Cambridge, glue from a Forth word list)
  carries its `translated-from` links for free.
- **Refactoring**: renaming or moving follows every link, across dialects and into the docs.
- **Debugging**: the trace, the memory panel and the debugger follow links from the PC up through
  the dialects to the scan and the design doc.
- **Reverse over-engineering**: start from an image and a scan and grow the layers upward
  (labels, symbols, structure, prose), with every claim linked to the evidence it rests on.

Today `source.ts` has one map per image, one line per address. The plan is in
[TODO.md](TODO.md#could): several maps per image, chosen in the dev tools, then this model under
them.

## Order of work — each step falsifiable

1. CPU completion + interrupts + `.oct` loader + console + clock.
   **Accept:** SYMELEC boots and issues `IDLA` (no display needed to verify).
2. 340 display processor → segments with provenance → canvas.
   **Accept:** tracking cross + radial lightbuttons match the 1969 film frame.
3. Pen synthesis from pointer → `TRCR` runs → cross follows mouse.
   **Accept: met at the emulator level** — the tracking acceptance test
   acquires, drags, and loses the cross ([TRACKING.md](TRACKING.md));
   the browser pointer wiring lands with the web bench.
4. Draw with the S/L/F lightbuttons. Radial menu question answered live.
5. Link stub → echo → filestore.
6. Phosphor pretty-pass: canvas 2D fade first; WebGPU dual-phosphor
   (fast blue flash for the pen, slow green for the human) is a stretch,
   never a blocker. **Calibrated against the real tube**: test-pattern tapes for sn 129
   (each intensity, a timed single flash, refresh rates down to flicker, a moving dot), filmed
   with locked exposure, frame rate and white balance, give brightness per intensity, colour,
   and the two decay curves. Fit the shader's parameters (the `PHOSPHOR` knobs, then the
   uniforms) to the films; check the fit on the demos, with the emulator's run rendered beside
   the film frame by frame. The draft letter asks for the films
   ([UNIX-V0.md](UNIX-V0.md#draft-letter-not-sent)).
   **Synced to music**: the machine runs on cycles, so a demo's timeline is exact. Cut cleared
   music to it (beats on frame or clock ticks), and the film and the emulator's run share the
   soundtrack. With the AM radio ([AM-RADIO.md](AM-RADIO.md)) the machine can play its own part.
7. The portrait ([PORTRAIT.md](PORTRAIT.md)): 3D cabinet with
   duty-cycle lamps, the phosphor texture on curved glass, and
   sim-Heinz — whose pen tip drives the LightPen plugin. Rides the
   pretty-pass lane; consumes only existing seams.
8. Tags, focus and pies ([TAGS-AND-PIES.md](TAGS-AND-PIES.md)): the
   undefined SUBR jump type 00 becomes DTG, which tags what follows with a
   title, link and 36-bit id; a pen tap latches and focuses it.
   **Accept:** every existing tape draws the same segments as before, and
   a Forth turtle drawing with tags gets focus, a tooltip and an
   announcement when tapped.

What comes before and after step 8 (pen interpolation, display knobs, Forth
that speaks, the round screen, several pens, the UI driver) is ordered in
[ROADMAP.md](ROADMAP.md).

Discipline: **differential trace vs SIMH.** One line format (`addr ir ac link`)
emitted by both benches over the same `.oct`; diff. Roy already steps the
binary natively — the oracle made mechanical.

↑ [README](README.md) · [SCHEMA](SCHEMA.yml) · [emulation plan](reference/EMULATION-PLAN.md)

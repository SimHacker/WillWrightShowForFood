# TODO: the cabinet's loose ends, ranked

Things with no other home. Designs that have one are linked, not repeated: the order of the big
work is [ROADMAP.md](ROADMAP.md), the editor is [DESIGN.md](DESIGN.md#a-universal-340-editor),
the long-term edit questions are [DRAWING-CONSTRAINTS.md](DRAWING-CONSTRAINTS.md). Anyone may
take an item; say so in the commit.

Status: **next** · **will** · **could** · **won't**.

## Next

1. **Copy the screen as a YAML display list**, beside 🖨️ SVG and 📷 PNG. `toYaml(frame)`
   exists in `media.ts`; the applet doesn't offer it yet.
2. **Point at the display, find what drew it.** A memory-panel button like the browser
   inspector's: hover the tube, the panel scrolls to the display word (octal or disassembled
   340), or to its source line if it was assembled. Segments already carry `addr`, `block` and
   `subr`.
3. **The disassembler explains itself.** One short English comment per word ("load AC from
   1234", "skip if the pen fired"), and 340 display words decoded as display words. Which is
   which: the source map knows for assembled code; for generated lists, the caller says (the
   340's start address, `DJS` targets, the cartridge's `display:` buffers), and the shadow 340
   marks every word it fetched.
4. **Deploy** the commits since `f7f10ff6` to hyperties.org.
5. **The universal drawing and the paused drawing editor**
   ([DESIGN.md](DESIGN.md#a-universal-340-editor)).

Done 4 October: the guide split into [reference/GUIDE.md](reference/GUIDE.md) and one
`GUIDE-<TOPIC>.md` per subject; the reference library moved into the cabinet; memory extension
to 32K.

## Will

- **Separate pens mode** (cabinet setting): a hit flag, coordinates and tag latch per pen
  ([DESIGN.md, The light pen](DESIGN.md#the-light-pen)).
- **Forth pen words** `pen?`, `pen@`, `resume`, `tag@`, and Forth interrupt handlers
  ([ROADMAP §14](ROADMAP.md#14-small-items)).
- **RGB pen colours**, watch the beam, Prefab-style controls for PIXIE (ROADMAP §14).
- **Full-names Forth kernel**: built and on the menu (FORTH, FULL NAMES); next, Mitch's SIMH tests and the PRs ([VARIANTS.yml](tapes/pdp7forth/VARIANTS.yml)).
- **DUEL game panel**: ship records at 1471 and 1514, torpedoes 1537–1544.
- **Instruction editor:** grab POINT words and whole strings; skip dark vectors when picking.
- **Forth `random`, `atan2`, shapes** (ROADMAP §5); **gamepads** (ROADMAP §14).

- **Ask Lars** to add a licence to [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation),
  then port its phosphor shaders to the cabinet ([WEB-BENCH.md](WEB-BENCH.md#the-field)).
- **An Apple ][ in the cabinet**, borrowing apple2js's MIT `cpu6502` as a CPU plugin and reading
  Apple2TS for the rest; ROMs from the user. Gives ROADMAP §13's mash-ups a machine.

## Could

- **A PDP-1, and L Peter Deutsch's PDP-1 Lisp with its scans.** A CPU plugin and a Type 30
  device, with SIMH's `PDP1/` as the oracle (it already has `spacewar1/`), and a front end for
  the PDP-1's assembler dialect. Then the first full test of the
  [transclusion model](DESIGN.md#source-maps-as-transclusion-layers-spans-links): Deutsch's
  Lisp, with layers for its transcribed source, rectangles on the scans of his listings, his
  documentation (Deutsch and Berkeley's 1964 "The LISP Implementation for the PDP-1 Computer"),
  and the walkthroughs others have written, all linked to the words they explain. Spacewar!
  can follow the same route. Harvest first: find and check the scans and their licences, and
  record them in [characters/l-peter-deutsch](../../characters/l-peter-deutsch/CHARACTER.yml),
  which has no PDP-1 material yet.
- **Knuth's MIX in the cabinet, running his own examples**, alongside the Apple ][ and PDP-10
  ([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md)): a CPU plugin, a machine
  description, and a MIXAL front end on the shared assembler back end, for symbols and source
  maps. Acceptance: TAOCP's programs give the results and timings Knuth prints, in both byte
  sizes, with GNU MDK (GPL) as the oracle. MMIX after, with Knuth's `mmix-sim`/`mmixal` as its
  oracle.
- **Re-implement the CAM-6 Forth environment**, as Mitch's Forth was done here: the original
  Toffoli–Margolus CAM-6 Forth vocabulary (rule definitions, plane and table words, the
  run/step/display controls), rebuilt on Mitch's PDP-7 Forth and driving the CAM6 device. Don's
  CAM6 simulator (`CAM6/javascript/CAM6.js` with `jsforth.js`) is the reference: its rules should
  run unchanged and produce the same tables
  ([DESIGN.md, CAM on the PDP-7](DESIGN.md#cam-on-the-pdp-7-a-cam-off)).

- **Skewmorphic lineprinter viewer (student project).** Link each authoritative line in the
  1972 transcription to one or more rectangles on its original A3 scan, then make the listing
  and page view navigate each other. Keep OCR's job geometric, not editorial: retain cheap OCR
  token boxes, fuzzy-match their noisy text to the corrected transcription using page, sequence,
  address and octal anchors, and store normalized rectangles. The transcription stays the source
  of truth; low OCR confidence must not rewrite it. Pipeline notes and assets:
  [listing scan archive](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md).
- **Raster, in order** ([DESIGN.md, Raster](DESIGN.md#raster-a-vanilla-virtual-video-display-and-a-cell-renderer)):
  1. the framebuffer device: descriptor with byte-pointer base, width, height, colbytes,
     rowbytes, flips, monochrome / indexed / RGB, colour map in core; a canvas beside the tube;
  2. Forth `fb!`, `pixel!`, `pixel@`, `cmap!`; a Life cartridge on a 256² monochrome screen in
     bank 0;
  3. the cell renderer device: cells through a colour map into the framebuffer, with colour-map
     animation; then tiles, a picture per state (and per neighbour pattern), animated too;
  4. the CAM6 device and the CAM-off against PDP-7 assembly;
  5. RGB planes in banks 1–3, after `far@`;
  6. sprites.
- **Check the Apple ][ column** of that comparison against the 1978 Apple ][ Reference Manual.

- **Scenes in cartridges**: 3D models of the machine, room and input devices, plus Sims 1
  characters animated by VitaMoo and driven by device events. Heinz with PIXIE, Ken and dmr with
  UNIX, Mitch with FORTH. Shared device models come from a library cartridge, chosen by the
  machine configuration, and the virtual devices are moved by real input or by demo playback
  ([CARTRIDGES.md §6a](CARTRIDGES.md#6a-scenes-the-machine-the-room-and-the-people-at-it)).
- **The cabinet as a Snap! library.** Blocks to load a cartridge, step and run, peek and poke
  core, type at the teletype, and draw the 340's segments on the stage; hat blocks on halts and
  pen hits. A Snap! script can also be a native CPU (below). Show seed:
  [snap-logo-brian-jens](../../repo-shows/snap-logo-brian-jens/README.md), with Micropolis and
  CAM6 as the other two engines.
- **Cabinets and front panels for the wrapped engines**: CAM-6, Micropolis, the Turing machine
  and Minsky's UTM, the MFM's snap-together T2-style tiles, von Neumann's 29 states on a
  split-flap station board (a tile-engine specialisation with photographic flap tiles). Every control is
  bound to real state ([PORTRAIT.md](PORTRAIT.md#cabinets-for-machines-that-never-had-one)).
- **tiny-titan's `type` service**: deliver a Forth (or any) file by typing it into the teletype at
  a fast, configurable rate, waiting for ` ok` per line, errors returned. The live-coding path into
  a running Forth without rebuilding the image ([TINY-TITAN.md](TINY-TITAN.md)).
- **Power switches on every device**, and **Minsky's Ultimate Machine** as the first device that
  uses one: switch it on and it switches itself off. `power` on `Device`; the `Cabinet` skips
  unpowered devices' ticks, interrupts and IOTs; power-on resets
  ([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices),
  [PORTRAIT.md](PORTRAIT.md#minskys-ultimate-machine)).
- **Several processors per cabinet.** CPUs are devices: the 340 already is a processor running
  off shared core. Add a `Processor` interface shared by the PDP-7 and the 340, and a list of
  processors the `Cabinet` ticks beside its devices, so CAM-6, a Turing engine, raster layers and
  tile/sprite engines can sit on one backplane, each with its own PC, trace and source maps
  ([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices)).
- **A new CAM engine, on CAM-8's machine model** (stub). Margolus's CAM-8
  ([summary](../../characters/norman-margolus/sources/cam8.md)) replaces fixed neighbourhoods with
  bit-fields kicked across space and 16-bit lookup events, behind a small machine language that runs
  unchanged on any number of modules, or none. Plan to fill in:
  - **Core model**: an N-dimensional periodic space, bit-fields as typed arrays, kicks as index
    offsets (CAM-8's scan-offset trick, no copying), lookup events, event counters, step programs.
  - **CAM-6 as a library** over it: Moore, von Neumann and Margolus neighbourhoods, echo and heat,
    as Margolus did on CAM-8. CAM6.js's tables and the CelLab rules must run bit for bit.
  - **Zero-module scalability**: one step program on plain JS, on workers splitting space into
    modules with halos (the generalised gutter), and on the GPU (lookups and kicks as shaders).
  - **The cabinet device**: IOTs for the machine language (load table, kick, run, read counters),
    so PDP-7 Forth drives it; the CAM-off against plain PDP-7 assembly.
  - **First test**: the paper's Figure 8 HPP gas, then DLA, then Critters running backward.

  Related: [DESIGN.md, CAM-off](DESIGN.md#cam-on-the-pdp-7-a-cam-off) ·
  [CARTRIDGES.md §5](CARTRIDGES.md#5-the-cellular-automata-machine-as-cartridges) ·
  [engine wrappers](ARCHITECTURE-AND-LINEAGE.md) ·
  [PORTRAIT.md, CAM-6 cabinet](PORTRAIT.md#cabinets-for-machines-that-never-had-one) ·
  [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) ·
  [CAM6 engine techniques](../../characters/don-hopkins/sources/cam6-simulator-wiki/engine-techniques.md) ·
  moollm's [CAM Construction Set](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md),
  [schedulers](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/schedulers.md),
  [turn tables](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/turn-tables.md),
  [CAM6](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam6-cellular-automata-machine.md) ·
  [CelLab rules](../../characters/rudy-rucker/sources/cellab-celdoc/README.md) ·
  [the CAM book](../../characters/norman-margolus/sources/README.md) ·
  [Snap! show](../../repo-shows/snap-logo-brian-jens/README.md).
- **Engine wrappers**: CPUs and devices around existing TypeScript libraries: CAM-6, Micropolis,
  the Turing machine with Minsky's UTM, the Movable Feast Machine, von Neumann's 29-state CA
  ([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md)). CAM-6 first, since the
  CAM-off needs it.
- **A native CPU**: a TypeScript app as the CPU plugin, driving devices through their own APIs
  with no instruction set ([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md)). The first
  one could be the CAM-off's JavaScript leg, or a 340 drawing app.
- **Zero or more source maps per image, picked in the dev tools.** *Step one done (7 Oct):* maps
  carry `meta` (id, label, kind, dialect, origin, scanUrl) and lines carry file, line and scan
  page; a program's `sources()` returns several, and the memory panel picks one at a time. SYMELEC
  offers the 1972 listing, the Cambridge source and the as7 translation, with a link from the PC or
  focused line to its scan page; the code view disassembles as7 when the as7 map is shown. The
  scan map is done too: every line knows its rectangles on the page, and the source view shows the
  line outlined on a strip of the scan
  ([pixie listing README](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md#geometric-source-map-scanmap)).
  Next: the other direction (click the paper, find the line), RSPPIX as a program, then
  several at once, and the span/link model below. The model is
  [DESIGN.md, Source maps as transclusion](DESIGN.md#source-maps-as-transclusion-layers-spans-links).
  One image can have several
  maps over the same words. SYMELEC and RSPPIX already have two each, the 1972 Cambridge source
  and its generated as7 translation, which assemble to the same octal (`src/asm/cambridge-as7.ts`).
  Let the memory panel, trace and debugger show none, one, or several side by side. That covers:
  - parallel dialects of one program;
  - stacked layers, e.g. Forth or a higher-level language over the intermediate as7 it emits
    over the octal, with a click going down a layer
    ([DESIGN.md, The layers, shown](DESIGN.md#cam-on-the-pdp-7-a-cam-off));
  - **vertical literacy**: a map from addresses to sections of a markup document that explains
    the code and its design, so a routine's words carry their prose as well as their source. It's
    literate programming turned sideways: you walk the memory, and the source and the documentation
    are transcluded in at each location.

  The general idea: a linked image, one module or many, is an address space. Code and
  documentation are transcluded into it through source maps of many kinds and depths, all the
  way back to the originals:
  - source lines in any dialect, and the intermediate code a compiler emitted;
  - sections of Markdown design docs;
  - rectangles on scans: the printed lines of a lineprinter listing (see the skeuomorphic
    lineprinter viewer below), handwritten notes, typewritten papers;
  - regions of PDFs, scanned or typeset.

  A map can point at another map: an address goes to an as7 line, that line to its Cambridge
  line, and that to a rectangle on Heinz's A3 page. The live programming environment doesn't own
  any of these formats. It brings them together by transcluding each one into core addresses.

  A link between layers is many-to-many, between spans, not one line to one line. Each layer
  keeps its own spans. Cases it must represent:
  - **one to many**, a split: one Cambridge line becomes several as7 lines, or one Forth word
    compiles to many cells;
  - **many to one**, coalescing: several source lines make one word, as with a label line and the
    line under it, or a long expression continued over several lines;
  - **interleaved**: an optimizer's or translator's spans cross over each other;
  - **broken spans**: one logical line split across a page break of the scan, a routine that
    starts on page 113 and ends on 114, a doc section in two places;
  - **generated with no source**: literal pools, variables, alias labels, padding.
- **Attention overlays** per memory word: last read, write and execute by the PDP-7, the 340
  and Forth's IP (010), with counts ([DRAWING-CONSTRAINTS.md §4](DRAWING-CONSTRAINTS.md#4-attention-overlays-could)).
- **Use the 32K.** The CPU has it; Forth needs `far@`, `far!` and bank moves, and CONFIG a
  memory size ([GUIDE-PDP7](reference/GUIDE-PDP7.md#memory-beyond-8k)). PIXIE's rings in upper
  banks ([DRAWING-CONSTRAINTS.md §6](DRAWING-CONSTRAINTS.md#6-extended-memory-could)).
- **Verify Supnik's "upside down and backward" PDP-4 loader** (Architectural Evolution, p. 10):
  how the loader read the tape reversed. A frame is 8 holes; at about 300 frames a second there
  are a few hundred instructions between frames, plenty to reverse bits, but read the source.
- **How PIXIE uses names as `JMS` words.** A name is `JMS` (100000) plus an address, so it is a
  pointer you can also execute, and NIL is `JMS 0`. Find the places PIXIE indirects or `XCT`s
  through one, and compare with Mitch's Forth, whose thread cells are instructions run by
  `xct i 010`. Add the answer to [GUIDE-RINGS](reference/GUIDE-RINGS.md#names-are-jms-words).
- **Mark Weiser / Severe Tire Damage** source page: the 1995 Computer Chronicles band segment
  (4:00–7:27), std.org setlists, footage, people.

## Won't

- **Replace the instruction editor.** It stays, as the low-level way to poke 340 words live; the
  drawing editor sits beside it.

↑ [README](README.md) · [ROADMAP](ROADMAP.md) · [DESIGN](DESIGN.md)

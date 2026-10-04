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
- **Full-names Forth kernel** and a PR to Mitch.
- **DUEL game panel**: ship records at 1471 and 1514, torpedoes 1537–1544.
- **Instruction editor:** grab POINT words and whole strings; skip dark vectors when picking.
- **Forth `random`, `atan2`, shapes** (ROADMAP §5); **gamepads** (ROADMAP §14).

- **Ask Lars** to add a licence to [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation),
  then port its phosphor shaders to the cabinet ([WEB-BENCH.md](WEB-BENCH.md#the-field)).
- **An Apple ][ in the cabinet**, borrowing apple2js's MIT `cpu6502` as a CPU plugin and reading
  Apple2TS for the rest; ROMs from the user. Gives ROADMAP §13's mash-ups a machine.

## Could

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

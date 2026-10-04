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
4. **Split Heinz's GUIDE.md** into a short top-level guide that summarises and links one
   `GUIDE-<TOPIC>.md` per subject: `GUIDE-PDP7`, `GUIDE-340`, `GUIDE-LIGHTPEN`, `GUIDE-TITAN`,
   `GUIDE-RINGS`, `GUIDE-SYMELEC`, `GUIDE-PHOSPHOR`, `GUIDE-BENCH`. Each marks what is done,
   next, will, could and won't, as an invitation to students and hackers.
5. **Deploy** the commits since `f7f10ff6` to hyperties.org.

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

## Could

- **Attention overlays** per memory word: last read, write and execute by the PDP-7, the 340
  and Forth's IP (010), with counts ([DRAWING-CONSTRAINTS.md §4](DRAWING-CONSTRAINTS.md#4-attention-overlays-could)).
- **Extended memory** for Forth and PIXIE ([DRAWING-CONSTRAINTS.md §6](DRAWING-CONSTRAINTS.md#6-extended-memory-could)).
- **Verify Supnik's "upside down and backward" PDP-4 loader** (Architectural Evolution, p. 10):
  how the loader read the tape reversed. A frame is 8 holes; at about 300 frames a second there
  are a few hundred instructions between frames, plenty to reverse bits, but read the source.
- **How PIXIE uses names as `JMS` words.** A name is `JMS` (100000) plus an address, so it is a
  pointer you can also execute, and NIL is `JMS 0`. Find the places PIXIE indirects or `XCT`s
  through one, and compare with Mitch's Forth, whose thread cells are instructions run by
  `xct i 010`. Write it into GUIDE-RINGS.
- **Mark Weiser / Severe Tire Damage** source page: the 1995 Computer Chronicles band segment
  (4:00–7:27), std.org setlists, footage, people.

## Won't

- **Replace the instruction editor.** It stays, as the low-level way to poke 340 words live; the
  drawing editor sits beside it.

↑ [README](README.md) · [ROADMAP](ROADMAP.md) · [DESIGN](DESIGN.md)

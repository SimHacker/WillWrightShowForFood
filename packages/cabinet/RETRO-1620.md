# What to take from retro-1620

[retro-1620](https://github.com/pkimpel/retro-1620) is Paul Kimpel's
browser emulator for the IBM 1620 Model 2, MIT licensed, started in 2022
and still active (last commit 2026-09-22). It is not his first: file
headers say which pieces came from his retro-g15 (Bendix G-15) and
retro-220 (Burroughs 220) emulators. It runs at
[phkimpel.us/IBM-1620](http://www.phkimpel.us/IBM-1620/), he writes up
the work on [retro-emulation.blogspot.com](https://retro-emulation.blogspot.com/),
and a local clone sits next to this repo at `../retro-1620`.

It is plain ES modules with no build step: an 8454-line `Processor.js`,
a handful of emulator classes, and one module per panel widget and
device window. Code links below are pinned to commit
[2cb4ed7](https://github.com/pkimpel/retro-1620/tree/2cb4ed7) so the
line numbers hold.

The MIT license lets us copy code with the copyright notice kept.
Credit him in the file and in the README rung that uses it.

## Worth taking

### 1. Core images as text files: save and load a drawing

**His.** A "CMEM" file is a text dump of core: an address, twenty digits
per line, an alpha reading after `//`, runs of zeroes skipped, and
comment lines at the top saying what the program is and how to set the
switches. The panel saves one as a download and loads one from a file
picker; the IBM diagnostics ship in this form.
[`formatCMEMDump`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ControlPanel.js#L518-L606),
[`saveCMEMFile`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ControlPanel.js#L639-L658),
[a CMEM file](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/software/diagnostics/CU01-Mod2_General_Op_Codes.cmem).

**Ours.** We already have the format. [`parseOct`](src/loader.ts) reads
`addr word` lines and skips `;` and `#` comments. We only load; we never
dump.

**Plan.**
- `dumpOct(cpu, ranges)` in `loader.ts`: octal pairs, zero words
  skipped, a `;` comment with the SYMELEC label on each line that has
  one (see 5), a header comment with date, patches loaded and DFE.
- The applet gets Save (download `.oct`, and a copy in IndexedDB) and
  Load (file picker and drop).
- A saved drawing is then a checked-in text file. An article can load
  `house.oct` instead of replaying the demo, and a changed drawing
  shows up as a readable diff.

**Open question.** CMEM is memory only; after loading you press START.
SYMELEC keeps state outside core too: the AC, the link, the 340's
position and mode, the pen. Find a start address that keeps the display
file instead of clearing it (BEGRTP resets DFE and END, so not that
one), or save the few registers alongside and restore them. Test it
headless with the house before building any buttons.

### 2. A console panel with lamps that glow

**His.** Every visible register bit keeps a time-weighted average of how
long it was on, in emulated time, with a 17 ms persistence like an
incandescent bulb. The average is updated only when the value changes,
so it costs nothing while a register holds still. The panel reads the
averages every 50 ms and draws each lamp at one of 6 CSS levels. If
emulated time hasn't moved for twice the persistence, the lamps freeze
instead of fading, so a halted machine shows its last state.
[`FlipFlop.updateLampGlow`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/emulator/FlipFlop.js#L76-L93),
[`Register.updateLampGlow`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/emulator/Register.js#L492-L524),
[`ColoredLamp.set`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ColoredLamp.js#L81-L94),
[`updatePanel`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ControlPanel.js#L936-L950),
[the constants](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ControlPanel.js#L36-L38).

**Ours.** No panel. The applet shows a text readout of speed, pen and
cross position ([`CabinetApplet.svelte`](../../apps/ties/src/lib/CabinetApplet.svelte)).
The switch register exists in [`pdp7.ts`](src/plugins/pdp7.ts) for DUEL,
but nothing on screen shows it.

**Plan.**
- Lamps for AC (18), link, PC (13), MB (18) and run; a row of 18
  switches under them. Lay it out like the real PDP-7 console, from a
  photo, not from the 1620.
- Don't hook every register write in `pdp7.ts`; that is the hot loop.
  Instead run each frame's cycles in, say, 32 slices and add up each
  bit once per slice. At 60 frames a second that samples every half a
  millisecond, which is finer than the 17 ms the eye sees. Then use his
  decay and his 6 levels as they are.
- Freeze when stopped, as he does.
- The switch row is also DUEL's on-screen controls: the keyboard
  mapping from the DUEL design moves the same switches, so players see
  what they are pressing.

### 3. The paper tape reader page

**His.** A file picker that accepts several files, reading each as
binary bytes or as text, and splicing them into one continuous tape.
Each device lives in its own window, and each window warns before it
closes.
[`PaperTapeReader.js`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/PaperTapeReader.js#L1-L40).

**Ours.** [`PaperTape`](src/plugins/papertape.ts) has `mount()` and HRI
read-in; [`duel.ts`](src/duel.ts) boots from `rim.pt` and `duel.pt`.
There is no browser side yet.

**Plan.** When the DUEL page is built: a tape picker (drop a `.pt` or
`.bin`, choose RIM or HRI read-in) and a strip showing how far the tape
has been read. One page, inside the applet, not separate windows: this
runs inside HyperTIES articles.

### 4. DEC's own tests, and more tapes

**His.** He ships IBM's diagnostics (CU01 general op codes, CU03,
disk and printer tests) and runs them in the emulator, with their
switch settings written at the top of each file.
[`software/diagnostics/`](https://github.com/pkimpel/retro-1620/tree/2cb4ed7/software/diagnostics).

**Ours.** Every check of `pdp7.ts` so far is one we wrote, plus
SYMELEC and DUEL running.

**What exists.** bitsavers has a PDP-7 paper tape directory,
[bits/DEC/pdp7/papertape](http://www.bitsavers.org/bits/DEC/pdp7/papertape/),
with a [labels.txt](http://www.bitsavers.org/bits/DEC/pdp7/papertape/labels.txt)
transcribing each tape's label. Three matter here:

| Tape | Label | Why |
| --- | --- | --- |
| `digital-7-54-m-rim.bin` | MAINDEC 701 INSTRUCTION TEST, 3/11/66, RIM | DEC's test of the PDP-7 instruction set |
| `digital-4-3-i-ascii.bin` | PEN FOLLOW SUBROUTINE (PDP-4) | DEC's light pen tracking routine, to set against the 1972 loop in [TRACKING.md](TRACKING.md) |
| `digital-4-18-o-ascii.bin` | CHARACTER DISPLAY SUBROUTINE, 9/25/62 | DEC's character drawing, for comparison |

The same directory has DECUS 7-43, a music player with two concert
tapes (Bach, the Star Spangled Banner, and Michigan fight songs).

**Plan.**
- Fetch MAINDEC 701 into `tapes/maindec-701/` with its label and the
  bitsavers link, and find its manual (bitsavers `pdf/dec/pdp7` is the
  place to look first).
- Boot it headless the way `bootDuel` boots DUEL: RIM loader, then
  the switch settings from the manual.
- It will test instructions and options SYMELEC never uses. We emulate
  only what SYMELEC uses, so expect failures there; write down which
  tests are out of scope and why, and fix only real bugs in what we do
  emulate. That list is useful on its own: it says exactly what our
  PDP-7 is.
- Read the pen-follow source for TRACKING.md before touching the
  tracking code again.

### 5. How to lay out a recovered program

**His.** [`software/IPL-V/`](https://github.com/pkimpel/retro-1620/tree/2cb4ed7/software/IPL-V)
holds the source, the listing, the object decks, a symbol list, a label
index, the assembly transcript, and each of IBM's modification letters
as its own unified diff. The
[README](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/software/IPL-V/README.txt)
says where the listing came from, down to call number, box and folder.

**Ours.** The same rule already holds: the `.oct` files follow the
listing and every departure is a named patch in
[`symelec-patches.ts`](src/symelec-patches.ts). The listing directory,
[`pixie-assembler-listing-1972/`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md),
has the PDF, the page scans, the OCR, the transcription, and checkers
in `scripts/`.

**Plan.**
- `check-symbol-operands.py` already builds a symbol table. Write it
  out as `symelec-symbols.txt` (name, octal address, page of the
  listing) and a label index sorted by address.
- `dumpOct` (1) and the tracer (6) read that file to put names on
  addresses.
- Put the source details in the listing README the way he does: whose
  papers, which archive, which box.

### 6. An instruction trace with names

**His.** A tracing checkbox on the debug panel writes each instruction
with its operands and their labels.
[Processor tracing fields](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/emulator/Processor.js#L866-L872).

**Plan.** A trace ring buffer in the cabinet, off by default, that the
tests can dump when an acceptance test fails, labelled from
`symelec-symbols.txt`. Most of the bugs in [BUG-JOURNAL.md](BUG-JOURNAL.md)
were found by stepping through by hand; this would have shown them in
the first failing run.

## Already done, or not for us

- **Pacing.** He runs in 10 ms slices and waits with `setTimeout`,
  keeping a running average of how late each wait was
  ([throttle](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/emulator/Envir.js#L253-L267),
  [its use](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/emulator/Processor.js#L8004-L8020)).
  We owe cycles per animation frame, with 1×, 10× and max, and stop
  when the tab is hidden. Ours fits a page with a display better. The
  one thing to take is showing speed as a percentage of a real PDP-7
  next to the M/s readout.
- **Batching device output per frame.** His plotter caches pen steps
  and draws them once per animation frame
  ([`drawSteps`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/Plotter.js#L787-L806)).
  Our 340 already writes to the media log and the page draws from that.
- **A window per device**, opened through a queue that retries when a
  popup is blocked ([`PopupUtil.js`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/PopupUtil.js)).
  Right for a whole machine room; wrong inside an article.
- **Configuration in localStorage**, written after a delay, exported
  as a zip ([`SystemConfig.js`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/SystemConfig.js)).
  We only need speed and patch choices. If we store them, use his
  delayed write.
- **Power-up and Emergency Off.** Power-up takes 4.5 seconds while the
  "DC supplies" come up, and Emergency Off takes a double click and
  plays a siren ([`emergencyOffClick`](https://github.com/pkimpel/retro-1620/blob/2cb4ed7/webUI/ControlPanel.js#L875-L888)).
  Good theatre, but nothing the PDP-7 did.

## People

- **Paul Kimpel.** He would understand what the SYMELEC recovery took
  better than almost anyone. Writing to him is a cold message to a
  stranger: draft it carefully, lead with his work, and send it only
  once there is something working to show.
- **David Moews** found the IPL-V listing in the Feigenbaum collection
  at the Stanford Digital Repository (SC0340, box 46, folder 52). IPL
  was Newell, Shaw and Simon's list language, the one Lisp replaced.
  The pattern is the same as the PIXIE film: an archive, and one person
  who went and asked.

## Order

| Step | What | Needs |
| --- | --- | --- |
| 1 | MAINDEC 701 headless (4) | the tape, its manual, `bootDuel`'s RIM path |
| 2 | Symbol file (5) | the listing scripts |
| 3 | `dumpOct` and a headless save/restore of the house (1) | the symbol file for labels; the restart question answered |
| 4 | Save and Load in the applet (1) | step 3 |
| 5 | Console panel with glow and the switch row (2) | nothing |
| 6 | DUEL page: panel, keyboard, tape picker (2, 3) | step 5 |
| 7 | Trace buffer (6) | the symbol file |

Steps 1 and 2 are cheap and make everything after them easier to debug.
Step 3 decides whether saved drawings work at all, so it comes before
any buttons.

↑ [cabinet](README.md)

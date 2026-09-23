# Bug journal

Every bug the cabinet has met, in the order it met them, with the
evidence that settled each one. The referee is always the 1972
listing: when the machine and the listing disagree, one of them is
wrong, and the job is finding out which. Three kinds turn up:

- **ours** — the emulator, the loader, or the web page got it wrong;
- **the transcription's** — the listing was read off a scan, and the
  scan was right;
- **1972's** — the listing itself is wrong, and the emulator should
  faithfully reproduce the mistake.

## Rungs 1–4: boot, display, tracking, the Titan link

Told in full in [OFF-BY-ONE.md](OFF-BY-ONE.md). One line each:

| Bug | Kind | Settled by |
|---|---|---|
| Literal pool cut off at 11741; every `(JMP INT` read 0, boot looped forever | transcription | the listing's literal-pool pages; `symelec-literals.oct` |
| `RTR` asserted as 740060, a word that rotates nothing | ours | reading the OPR bits |
| Clock test expected 0 right after overflow; the clock kept ticking | ours | `< 0o10` |
| Strokes after `DDS` lost their subpicture identity | ours | the SVG acceptance diff |
| Pen coordinates lose their low bit | 1972, by design | `TRCR`'s `1776` masks |
| tiny-titan matched IOT pulses with the clear-AC bit still in them | ours | the CPU dispatch in `pdp7.ts` |
| Blocklet host expected `count + 1` words; SYMELEC NAK'd it | ours | `ISZ BSZ` at 1734–1735 |

## Rung 5: the machine in a web page

The browser bench boots SYMELEC inside a HyperTIES article
([apps/ties/CABINET-APPLET.md](../../apps/ties/CABINET-APPLET.md)).
The first person to use it found everything below in about an hour.

### Node in the browser

**Symptom.** The article loaded, the tube stayed on "Loading…", and the
console said `Module "node:fs" has been externalized for browser
compatibility`.

**Cause.** `index.ts` re-exported `symelec-fixtures.ts`, the test
helper that reads the `.oct` files with `readFileSync`. Any browser
import of `@wwsff/cabinet` pulled in `node:fs`.

**Fix.** The fixtures moved to their own entry point,
`@wwsff/cabinet/fixtures`. The main entry is browser-safe; the web
page inlines the same two `.oct` files at build time
([symelec-boot.js](../../apps/ties/src/lib/symelec-boot.js)).
**Kind:** ours.

### Clicking the tube lit up every link on the page

**Symptom.** Pressing on the tube highlighted every link in the
article.

**Cause.** HyperTIES has a 1988 rule: press on the empty paper and
every link reveals itself. The canvas was, as far as that handler
could tell, empty paper.

**Fix.** Applets carry `data-applet`; the paper's press handler and its
selection blocker skip anything inside one. An applet owns its own
presses. **Kind:** ours.

### The menu popped in and out

**Symptom.** Dragging on the cross, the ring of letters around it
vanished and reappeared.

**Cause.** Two things multiplied. First, 1972: when the pen hits the
cross, the display stops at the hit, `TRCR` recenters the cross, and
the refresh starts over. Nothing after the cross in the display file
is drawn in that refresh — not the search raster, not the ring. With
the pen parked on the cross the ring measures 0 dots against 90 with
the pen up. On the real tube this happened hundreds of times a second
and the phosphor blended it into a dimmer ring.

Second, ours: the emulator runs about 500 refreshes per browser frame,
and the page drew only the last one. Whichever state that one refresh
happened to be in, all or nothing, was what you saw.

**Fix.** The page now blends the last 48 refreshes completed during
the browser frame. Each stroke's brightness is its 340 intensity,
scaled by the fraction of those refreshes that drew it. Anything the program draws
intermittently comes out dim, the way it did on the glass.
**Kind:** 1972 behavior, our rendering.

### The pen never let go

**Symptom.** After releasing the mouse, the machine kept acting as if
the pen were on the screen.

**Cause.** The light pen was enabled from boot and stayed enabled at
its last position after the button came up.

**Fix.** Button down is the pen aimed at the glass; button up is the
pen lifted, and a lifted pen sees nothing. **Kind:** ours.

### The raster ignored its intensity

**Symptom.** The search raster was always drawn at full brightness.

**Cause.** The renderer ignored each segment's intensity. SYMELEC
deliberately switches the raster between two intensities: the pen
interrupt deposits `100177` into `SRAST` ("HIGH INTENSITY"), and the
stop-code interrupt deposits `100170` ("LOW INTENSITY").

**Fix.** Strokes are drawn at their 340 intensity. The raster now
flares whenever the pen is hitting something — a lightbutton
included — and fades when it stops. That flare is the "glitch" that
appeared while holding a button down and vanished on release. It is
1972 feedback that the pen sees light. **Kind:** ours.

### The animation stopped

**Symptom.** In the test browser the machine froze: zero cycles in 1.5
seconds, no error.

**Cause.** Not found in the emulator. Four thousand random pen presses
across 20 fresh boots never threw. The test browser was delivering
about eight animation frames a second and then none. Whatever the
cause, the loop scheduled its next frame *after* doing the work, so
one exception anywhere would have stopped it for good, silently.

**Fix.** The loop schedules first, then works; a fault is caught and
shown in the applet's status line instead of freezing the tube. The
status line also shows cycles per second, pen up or down, and the
cross position, so a stall is visible at a glance. **Kind:**
unresolved, made loud.

### The + was not in the middle of the menu

**Symptom.** The tracking cross sat at the left edge of its search
raster, not in the middle. The ring of letters was centered on the
raster instead of the cross. A solid square dot sat inside the raster.

**Cause.** One word. `SRAST+3`, at 5661, reads in the listing:

```
  386    5661/ 200200           VEC ON -2 0
```

The source says draw 2 units left. The octal says draw 0. At the
raster's scale of 8, the missing move shifted every later stroke of
the raster 16 grid units right. The ring shifted too, because SYMELEC
draws the ring from wherever the raster ends, and the raster is
supposed to end exactly back on the cross. The dot was the dropped
vector itself: a zero-length stroke, drawn as an 8×8 square.

Which half of the line is wrong? The assembler cannot have produced
`200200` from `VEC ON -2 0`: the operands assemble to `200202`. The
raw OCR of scan page 060 reads `209202` — the OCR's usual 0-for-9
confusion, but the last digit is a 2. Scan and source agree; the
transcription dropped the 2.

**Why the checkers missed it.** The transcription pipeline
cross-checks every memory-reference instruction's opcode against its
mnemonic, and reported zero findings on all 128 pages
([TRANSCRIPTION-REPORT](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md)).
Display words are not memory-reference instructions, so none of them
had been checked. Only running the program exposed this one.

**Fix.** `200202` in `symelec.oct` and `symelec-listing.txt`. Then a
new check: decode every `VEC` line in the listing and compare it with
its operands. One other line differed, `VEC ON -170` at 5300 — a false
alarm from the checker's guess about one-operand vectors; that word
closes the working-area box and matches the geometry. No other
display word disagrees with its source.
**Kind:** the transcription's.

### F halted the machine

**Symptom.** Draw a line — S, drag, drag — and press F to finish it.
The status line drops to `0.00M/s` and nothing moves again. The CPU
has halted.

**Cause.** One digit, in the list processor. The routine at 2376 walks
a list: load a word, and if it is a non-item pointer, loop back and
follow it. The listing:

```
  186    2404/ 602375           JMP .-5                    /DO AGAIN IF ON NONITEM
```

2404 − 5 is 2377, which assembles to `602377`. The transcription says
`602375`. That jumps two words too far back, onto `JMP I CAR-JMS`, the
exit of the routine before it, which returns to wherever that routine
was last called from. The list code carried on with a bad pointer, and
`DAC I OP` at 2364 wrote a name link over the first instruction of the
interrupt routine at 5320. The next interrupt executed the name link
as `JMS 12040`, ran off into data, and landed on the `HLT` at 21.

The printout says `602377`: the 7 is clear on scan page 029. The raw
OCR read `69237` and the transcription settled on a 5.

**Fix.** `602377` in `symelec.oct` and `symelec-listing.txt`. Then a
new check, the same idea as the `VEC` check: recompute every
`.`-relative operand in the listing — `JMP .-5`, `JMP . 4` — and compare
it with the assembled word. Every other one agrees. The machine now
survives F and 20 rounds of random drags and ring presses.
**Kind:** the transcription's.

**Still open.** After F, SYMELEC hands the finished element to Titan
(`UPCOMP`, then `COMPIL`) and holds `CBUSY` until that finishes. In the
cabinet `CBUSY` stays at 2, so S is refused and a second line cannot
start. The next thing to trace is `COMPIL`, and what it expects from
the other end of the link.

### The garbage in PIXIE's own name

**Symptom.** The label at the bottom left, which should read PIXIE,
draws garbage and then `IE`.

**Cause.** The listing:

```
*DECIMAL DIGIT IN OCTAL NUMBER
   70    5270/      0           201128                     /PIX
```

`201128` has an 8 in it. The 1972 assembler said so, stored 0, and
moved on. Heinz circled the number in pencil and dated it 12.7.72. The
next word, `110537`, is `I E` and the stop code 37; the `EN` button is
`051637`. So the 340 codes the letters A to Z as octal 01 to 32, and
`P I X` is `20 11 30`: the intended word is `201130`.

**Fix.** The `.oct` file keeps the 0: it is what the listing says, and
the node tests run the image as printed. The browser loader applies a
named patch on top, `pix` in
[symelec-boot.js](../../apps/ties/src/lib/symelec-boot.js), which
writes `201130` to 5270 only if the word there is still the printed 0.
The circle, the date and the tick say Heinz found it and dealt with
it in July 1972. The pencil note beside it was transcribed as "x 38",
reading uncertain; if it says "X 30", that is the fix itself. A cabinet
block with `patches: []` shows the tube as the listing left it.
**Kind:** 1972's, fixed the way Heinz would have: one word, by hand.

### The PDP-7 ran at the speed of your monitor

**Symptom.** Nobody noticed. The status line said `10.0M cycles/s`, and
nobody asked what a PDP-7 is supposed to do. The answer is one memory
cycle every 1.75 µs: 571,429 a second. The machine on the page was
running Heinz's program about 17 times faster than Heinz ever saw it.

**Cause.** The loop ran a fixed 100,000 cycles every time the browser
asked for an animation frame. The browser asks at the monitor's
refresh rate. On a 60 Hz screen the PDP-7 ran at 6 million cycles a
second; on a 120 Hz screen, 12 million. The clock speed of a 1965
computer was set by the refresh rate of whichever laptop screen you
had. Drag the window to another monitor and the PDP-7 changes speed.

SYMELEC could not tell. Everything inside the cabinet is counted in
cycles, so the machine was consistent with itself: its 60 Hz clock
ticked every 9,500 cycles, which came to about a thousand ticks per
wall-clock second, and the tracking cross followed the pen 17 times
faster than the real one could.

The rule it broke was already written down. [WEB-BENCH.md](WEB-BENCH.md),
decision 1: a fixed-timestep loop driven by the frame callback, the
elapsed time clamped at 250 ms, reset when the tab is hidden. The
applet ignored its own design document.

**Fix.** Each frame runs the elapsed wall time × 571,429 cycles a second
× a speed switch in the caption: 1× (the default), 10×, or max, which
is the old behavior. The elapsed time is clamped at 250 ms, so a
stalled browser slows the machine down instead of making it race to
catch up. The test browser, which delivers two animation frames a
second, now shows 200,000 cycles a second: the clamp doing its job.
**Kind:** ours.

**Still wrong at 1×.** Pacing only fixes the wall clock. The cabinet
counts every instruction as one cycle; a memory-reference instruction
takes two. The 340 draws each display word in zero time, so the
refresh rate, the flicker, and the speed of the cross are still too
high. And the Teletype prints a character every 1,000 cycles, 1.75 ms,
where a Model 33 took 100 ms. Those are the next rungs: a
cycle-accurate CPU, then a 340 with the timings from its manual.

## Rung 6: drawing

Drawing one line, then two, then a house, found eight bugs. Six were
the transcription, one was ours, one was the listing's own memory
layout. Two new checkers in the listing's `scripts/` now catch the
kinds that were found by running: `check-symbol-operands.py` checks
every memory-reference word against the symbol table, and
`check-operate.py` computes every operate instruction from its
mnemonic.

### The menu stopped answering after the first line

**Symptom.** Draw one line, and the ring and the right column went
dead. **Cause.** The garbage collector. `GETSP` calls it when the free
list runs out, and nine words in the list machinery (2416–2545) were
misread: operands off by a digit, `445` read for `442` and `452`, an
operate word off by one bit. The collector marked the wrong cells,
freed live ones, and walked on into the display file and the interrupt
vector. **Fix.** Each word against the scan. **Kind:** transcription.

### F never finished

**Symptom.** After F, `CBUSY` stayed at 2 and nothing else happened.
**Cause.** `WAIT8` compiles the picture with `JMS COMPIL`, 110170. The
transcription had 103170 at 3604 and 3724, a jump into the middle of
something else. **Fix.** The scan. **Kind:** transcription.

The PIXIE page said F hands the element to Titan and waits for an
answer. It does not. `COMPIL` and `UPCOMP` never
touch the link; only the typed `TITAN` command does.

### The tube went dark after F

**Cause.** The compiled picture lives at 12301, in the upper 4K of an
8K machine. Our 340 masked display addresses to 12 bits, like SIMH's,
and ran 2301 instead. The 347's jump field is 13 bits. **Fix.** 13-bit
display addresses. **Kind:** ours.

### The display stopped at 12311

**Cause.** A compiled element ends with `DDS SVAD`, built by `TAD
(200000`. At 10665 the word was read 352212, which adds the pool word
at 12212 (17777) instead of 12210 (200000); the 340 got a parameter
word with the stop bit. 10540, 10647 and 3725 pointed at the wrong
pool word the same way. **Fix.** The scan. **Kind:** transcription.

### The second line wiped the picture

**Symptom.** Line one fine; after line two's F, a blank screen.
**Cause.** SYMELEC printed an error and restarted. `ERRDF`, "PERMDF RUNS
OUT OF SPACE": as assembled, the picture gets 77 words of display
file, 12301–12400, and one line uses most of them. Beside each of the
seven layout words (5157–5165) Heinz wrote a bigger number in the
comment: 13300, 13400, 13401, 17200, 17300. Those are an 8K machine.
**Fix.** The `core8k` patch loads what he wrote. The `.oct` stays as
printed. **Kind:** 1972, the listing's own layout.

### Every line was invisible

**Symptom.** Lines compiled, the display file grew, nothing lit.
**Cause.** `DRLTO` executes the instruction after its call to decide
visible or invisible: `CLL` for a move, `STL` for a line. At 11204 the
`STL` was transcribed 144002, which is `DZM 4002`. The link stayed
clear and every stroke went out with the beam off. **Fix.** 744002, as
the scan says. `check-operate.py` then found three more misread
operate words (1011, 1170, 1247). **Kind:** transcription.

### TITAN with an empty picture

After a Titan session `MESIN5` forces a collection with the picture as
the only root. With nothing drawn that root is 0, and the collector
walks location 0 into the interrupt vector. That is the 1972 program:
save a picture, not an empty screen. The acceptance test draws a line
first. **Kind:** 1972.

### The demo pen missed

Not a machine bug; the script's. A pen that crosses a lit line hands
the cross to that line, and a press on a cross that sits on the end of
the line just drawn can land on the line instead. The demo grips the
cross on the side it is about to travel toward, carries it around the
picture, and checks the ring after F. Open: rays drawn in the lower
half of a sun still fail, so the sun rises.

### HLT at 2222 on a bigger drawing

**Symptom.** Halt at 2222, `/STACKS TO SHORT OR ?`, called from 2250,
"ERROR IF BLOCK DATA". **Cause.** `core8k` moved the display file and
the free list but left the name list and stacks (BOT through STSAVE,
5166–5177) where the 4K layout puts them, inside the new free list.
Heinz's comments give 8K values for those too. **Fix.** `core8k` loads
all sixteen layout words. **Kind:** ours, an incomplete patch.

### The big picture vanished

**Symptom.** The extended demo ran to the end without a halt or an error
on the teleprinter, and the tube showed only the flag. **Cause.** Two.
The script's render caught 3000 cycles of refresh, and a 700-word
display file takes longer than that, so the SVG held only the last
element. And the free list ran out: `ERRGB` at the battery fell back to
its reserve, the next element tripped it again, and `ERRMEB` restarted
SYMELEC, which zeroes the word at 12301 that turns the display file on.
Every element costs 60 to 100 free cells whatever its size; a single
sun ray costs 66. **Fix.** Fewer elements: the tree is one HV element,
the circuit two wires, two plates and a switch. Then the `bigpic` patch,
ours, moves the display-file boundary from 13300 to 13640. The acceptance
test fails if either reserve is touched. **Kind:** the script's, and a
patch of ours.

Three more rules turned up drawing the circuit. A corner nearer than
about 25 to the last one is dropped. An endpoint within about 20 of a
node snaps to it, so the battery plates sit well clear of the wire ends.
And the cross wraps to the bottom if carried much above 970.

## Not the machine

The dev server listened only on IPv6 `::1`, so a browser that took
`localhost` to mean `127.0.0.1` got "connection failed"; it now listens
on every interface, on a fixed port. And the emulator could not be
found from the site at all: the PIXIE page still said the browser
PDP-7 was "not today". It links to the running machine now, as do the
HyperTIES home page and The emulator.

## What the journal says so far

Every bug so far had its answer on paper before anyone went looking:
the literal pool on pages 105–106, the `ISZ` at 1734, the `1776`
masks, the `-2` in the source column, the 7 on page 029, Heinz's
pencil circle, his 8K layout in the comments, the 7 in `STL` on page
096, and a
2026 design document nobody reread. The
emulator's job is to run the listing until it disagrees with itself,
and then to show where.

↑ [README](README.md) · [OFF-BY-ONE](OFF-BY-ONE.md) · [TRACKING](TRACKING.md) · [DESIGN](DESIGN.md)

# A light pen for the Apple, both kinds

One pointer, the same object the Type 340 already uses, and two drivers behind it. The Videx
driver latches the 6845's light-pen registers when the pointer is over a lit cell. The paddle
driver feeds `PDL(0)` from how bright the Apple's own picture is under the pointer, which is the
pen made from a photo sensor on the game port. Forth and games call the same two words either
way; which file they include picks the driver that matches the screen they draw on.

Read first:

- [GUIDE-LIGHTPEN.md](reference/GUIDE-LIGHTPEN.md): the Type 370 pen, and the Forth words `pen?`
  and `pen@` this plan copies.
- [src/plugins/lightpen.ts](src/plugins/lightpen.ts) and `PenInput` in
  [src/plugins/type340.ts](src/plugins/type340.ts): `enabled`, `x`, `y`, `aperture`, `name`.
  The page already calls `pen.point(x, y)` from the pointer
  (`apps/ties/src/lib/CabinetApplet.svelte`).
- [VIDEX.md](VIDEX.md): the card. R16 and R17 are reserved there for this plan. Device I/O
  memory, and what has to be added, is [that section](VIDEX.md#device-io-memory). The pen does
  not add an address.
- [reference/apple2/videx/SPEC.md](reference/apple2/videx/SPEC.md): R16/R17, and why the paddle
  cannot see the beam (a full-scale `PDL` read is about 2.8 ms, roughly forty scan lines).

## The split

```ts
/** What the 340 already is. Both Apple drivers take one. */
interface PenDriver {
  /** Once per displayed frame. pen.x and pen.y are pixels of the picture on the canvas. */
  sample(pen: PenInput): void;
}
```

The Apple canvas has its own `LightPen`. Pointer down, move, and up call `pen.point` in the
pixels of whichever picture is showing, 560×192 for the Apple and 720×216 for the Videx, top
left origin. That is the same class and the same handler shape as the 340, and a different
coordinate space: the 340 pen stays in its 1024 grid, on its own canvas.

The frame tick then calls one driver:

```ts
function drivePen(pen: PenInput, videxShowing: boolean) {
  if (!pen.enabled) return;
  (videxShowing ? videxPen : pdlPen).sample(pen);
}
```

`videxShowing` is the monitor switch (`status().videxShowing` in [VIDEX.md](VIDEX.md) step 7):
annunciator 0 on, and text mode. The picture on the canvas is the tube the pen is held against,
so the other driver is idle. A program flips the switch with `$C059`/`$C058` and the driver
follows on the next frame. No menu.

## Forth

The same stack as the PDP-7 words, minus the pen number (one pointer) and minus `resume`
(neither Apple device freezes the beam):

```
pen? ( -- flag )
pen@ ( -- x y )
```

Two files, one included by a program:

| File | `pen?` | `pen@` returns | Units |
|---|---|---|---|
| `pen-videx.fth` | the latched cell is on the screen | column, row of the cell R16/R17 hold | 0–79, 0–23 |
| `pen-pdl.fth` | a probe of the whole screen reads bright | the point the search found | hires pixels, 0–279 by 0–191 |

They live next to Don's Forth
([Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md)), as source to load
into it, not as blocks on the disk image until that image is being rebuilt.

`pen-videx.fth` reads the 6845. With the card in slot 3:

```
$C0B0 !   ( register number )
$C0B1 @   ( register value )
```

Register 16 is the high 6 bits, 17 the low 8. The cell address is `(hi << 8 | lo) - (R12 << 8 | R13)`,
masked to `$7FF`, then `y = addr / 80` and `x = addr mod 80`. R12 and R13 are write-only, so use
the screen-hole byte `$6FB` instead: the firmware keeps it equal to the start address divided by
16, and the address of cell (0, 0) is that byte times 16 ([SPEC](reference/apple2/videx/SPEC.md)).

The chip has no hit flag and no way to clear R16/R17. A strobe latches the cell and the registers
keep it until the next strobe, including after the pen moves onto black. `pen?` is true when the
latched address falls inside the 80×24 page. Tracking works the way the 340's does: draw a lit
mark, read the cell, redraw the mark there. Move onto black and the mark stops, because nothing
strobes.

`pen-pdl.fth` is the search, and the driver only supplies the brightness:

1. Calibrate. Read `PDL(0)` over a black screen and over a white one. The threshold is the
   midpoint. Do this again if the room-light floor in the driver changes.
2. Probe a rectangle: paint it white, leave it up across a vertical blank, read `PDL(0)`, paint
   it back. Bright is a reading below the threshold.
3. Find the point: split the screen in half, probe, keep the bright half, repeat for x and then
   y. Eight probes each way.
4. Track: run step 3 inside a window around the last hit, and fall back to the whole screen when
   the window reads dark.

A probe has to stay on the screen until the browser has drawn a frame. The paddle value is
updated once per browser frame from that frame, not mid-scan. An `HPLOT` of half a hires screen
takes longer than a frame, so Applesoft stumbles into the right timing. A tight loop that paints
and reads inside one frame will read the previous picture. Wait on something slow, or spin, before
the `PDL`. Run these tests at 1×: at warp many Apple frames pass per browser frame and the paddle
stays stale.

## The Videx driver

`src/apple2/pen-videx.ts`. `sample` sends the pen to the module:

```ts
// microM8.videxPen(x, y, aperture, enabled) — pixels of the 720×216 picture
```

In `videx.go`, store those four numbers. `Render` (VIDEX.md step 6) calls `considerPen` after it
has decided which dots are lit, cursor included:

- Walk cells in scan order, row then column.
- A cell hits when any lit dot lies within `aperture` pixels of `(x, y)`. Dots are the glyph bits
  as `Render` already computes them, dot 8 repeating bit 0, cursor lines inverted.
- The first hit latches `reg[16]` and `reg[17]` with `(ma + row*cols + col) & 0x7ff`, high 6 bits
  and low 8. This writes the registers directly. `writeReg` ignores numbers above 15, and the
  6502 must not be able to.
- No hit leaves the registers as they were.

`aperture` is in Videx pixels. The page can pass the 340's default (8) straight through; a cell
is 9 wide.

Check, in `microm8-videx.test.ts`, after `PR#3`:

- `POKE` an `A` (`65`) at screen start. Put the pen on its pixels, render, then
  `POKE 49328,16:PRINT PEEK(49329)` and the same for 17. The address is 0.
- Move the pen onto a blank cell and read again. The address is still 0.
- `POKE` a second character at column 10 and point at it. The address is 10.

## The paddle driver

`src/apple2/pen-pdl.ts`. `sample` reads the latest Apple frame (`frame()`, 560×192 RGBA) and calls
`paddle(0, value)`.

- Hires pixels are 280 across, and the frame draws each one two pixels wide. Sample at frame x
  `pen.x`, and when a program is working in hires coordinates it passes `x * 2`.
- Luminance is the mean of `max(r, g, b)` over the pixels inside the aperture, 0 to 1.
- `value = dark + (bright - dark) * (1 - luminance)`, with `dark = 220` and `bright = 30`. Bright
  reads low, because a photoresistor in place of the pot charges the paddle timer faster. The
  floor of 30 is the room light, so a black screen does not read 0.
- Pen up (`enabled` false): send `dark` once, then stop. Lifting the sensor off the tube reads
  dark.

Check, in a test that starts the ordinary Apple (no Videx profile), hires:

- Paint nothing. Pen up. `PDL(0)` is at least 200.
- Paint a white rectangle and hold the pen inside it for a frame. `PDL(0)` is below 80.
- Hold the pen outside it. `PDL(0)` is at least 200.

Then the Forth search, once `pen-pdl.fth` exists: park the pen at a known hires point, run
`pen@`, and accept a result within 4 pixels. That test waits several seconds.

## What this does not change in microM8

The paddle path is the `paddle(0, v)` already in `wasm/main.go`. The Videx path is four numbers
into the card and two registers the 6502 already reads at `$C0B1`. No new soft switch, no new
address, no write into guest memory from the page. The memory work the card itself needs is
[VIDEX.md, Device I/O memory](VIDEX.md#device-io-memory): `$C0Bx` already reads and writes, and
`$CC00`-`$CDFF` has to gain a write path so the firmware's screen RAM works. The pen doesn't use
that window.

## Order

1. The paddle driver and its three `PDL(0)` checks. No Videx card required.
2. `considerPen` and `videxPen`, after VIDEX.md steps 3, 6 and 7. The three register checks.
3. `pen-videx.fth`, loaded into Don's Forth, pointed at a character the terminal drew.
4. `pen-pdl.fth` and the search test.

↑ [VIDEX](VIDEX.md) · [GUIDE-LIGHTPEN](reference/GUIDE-LIGHTPEN.md) · [APPLE2](APPLE2.md)

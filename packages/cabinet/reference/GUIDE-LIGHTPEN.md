# The Type 370 light pen

A photocell on a cable. Hold it to the tube; when the beam passes under it, the cell sees the
flash and the 340 stops. That is the whole device. Everything else, picking, tracking, menus,
is software.

## What it sees

**Strokes, not objects.** A hit means the cell saw whatever the beam was drawing at that moment:
a dot, part of a vector, one of a letter's strokes. The 340 freezes with the beam where it was,
raises its pen flag, and waits. The program can read where the beam was (`IDRC`, 9 bits a side:
the hardware drops each coordinate's low bit) and which display word was running. Only the
fresh blue flash counts, never the afterglow, so the pen can't see what isn't being drawn now.

**The pen bit.** Each PARAM and POINT word can turn the pen on or off for what follows. A run with
the pen off is invisible to it: SYMELEC's frame, for instance.

## How a program knows what was hit: `DDS`

The 340 can't say "you hit the S button". The display list says, ahead of time, who owns what is
about to be drawn. SYMELEC's lightbutton for S:

```
DJS SB ,2      / call the next word as a subroutine: the save register now holds its address
JMP SD         / a CPU instruction, stored in the display list, never run by the 340
DDS CH 3       / deposit "DJP <save register>" in core location 3, then go to character mode
233700         / the letter S
```

`DDS` (display dispatch, from the Type 347 subroutine option) writes a pointer to `JMP SD` into
location 3. Every stroke after it belongs to that button until the next `DDS` overwrites 3. On a
pen hit, SYMELEC's `PEN` handler reads 3 and does `JMP I 3`, landing on `JMP SD`, the S button's
code.

- **Any group can be one button.** Letters, a subroutine, a whole picture: whatever is drawn
  between one `DDS` and the next.
- **Subroutines nest one deep.** The 340 has one save register.
- **Shared subroutines are shared buttons.** A symbol drawn by `DJS` from several places is one
  set of words; tell the instances apart by the `DDS` before each call.

## Interrupts or polling

Both work. `IDSP` skips if the pen fired, `IDSI` if the display stopped, and either flag also
raises the PDP-7's one interrupt. After a hit the 340 stays frozen until `IDRS` resumes it in
place or `IDLA` restarts it, so a polling program loses nothing but time.

| | Suits | Who |
|---|---|---|
| Interrupts | programs that compute between frames | SYMELEC, the LP370 diagnostic (a skip chain in one handler) |
| Polling | a simple loop that waits | Mitch Bradley's Forth, which polls `IDSI` while waiting for a key |

## Tracking

Pointing at something lit is easy. Moving a cross with the pen means the program must keep
something lit under the pen as it moves: SYMELEC re-centres its cross on every hit and draws a
small spiral around it to catch the pen when it slips. [TRACKING.md](../TRACKING.md) walks
through it against the listing.

## Several pens

**Shared** (done, the default). Pens are ORed onto the one pen input, like extra photocells on
one amplifier: one hit flag, one coordinate register, first pen wins. `IDPN` (device 11, a
cabinet extension, not 1972) says which pen fired. Every old program works unchanged. Limit: the
first hit freezes the display, so two pens can't hit two buttons in the same frame.

**Separate** (will, a per-cabinet setting). Each pen gets its own hit flag, coordinates and tag
latch, read through new IOTs by pen number, and one pen's hit doesn't freeze the display for the
others. More circuitry than DEC built; marked as an extension. Old programs don't need it and the
cabinet chooses the mode, so several people at one tube never breaks a stock program.

## Pens in Forth

**Will.** Kernel words `pen? ( -- f )`, `pen@ ( -- x y n )`, `resume`, and with tags
([TAGS-AND-PIES.md](../TAGS-AND-PIES.md)) `tag@ ( -- record )`. Then handlers run from the
interrupt through a short assembly thunk: `pen-hit ( x y n tag -- )`. A tag's title can be Forth
to run when it's hit, once the kernel has `EVALUATE`.

## Status

- **Done:** the pen in the emulator (aperture test against fresh strokes, `IDSP`, `IDRC`,
  `IDRS`, freeze and resume); `DDS`; any number of shared pens and `IDPN`; pen colours; the
  LP370 diagnostic passing.
- **Next:** pen interpolation between browser frames, so fast drags don't lose the cross
  ([ROADMAP §1](../ROADMAP.md#1-tracking-the-pen-is-sampled-once-per-browser-frame)).
- **Will:** separate pens; Forth pen words and handlers.
- **Could:** a period photocell model (spot size, response time, the 1964 diagnostic's timing
  tests); the Engelbart Cursor Party, eight people at one tube
  ([ROADMAP §7](../ROADMAP.md#7-several-pens-the-engelbart-cursor-party)).

↑ [GUIDE](GUIDE.md) · [reference library](README.md)

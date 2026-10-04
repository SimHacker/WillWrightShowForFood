# How SYMELEC works, end to end

SYMELEC is PIXIE's circuit-drawing program, the one in the listing (assembled 12 Feb 1972 by
`HL1470`). Labels below are the listing's; the addresses are in its symbol table.

**Boot.** `BEGRTP` stores `JMP INT` at location 1 (the interrupt entry), clears every device
flag with `CAF`, loads the display address with `LAW LB` and starts the 340 with `IDLA`, turns
interrupts on with `ION`, and sits in `WAIT; JMP .-1`. From then on everything happens in the
interrupt handler.

**One interrupt, a skip chain.** The PDP-7 has one interrupt level: save the PC at 0, jump to 1.
`INT` asks each device in turn whether it raised its flag (`IDSP` pen, `IDSI` stop, `IDVE` and
`IDHE` edges, `TSF`/`KSF` teletype, `CLSF` clock) and calls its handler, then `ION` and
`JMP I 0`. Polling or interrupts are both possible on this machine; SYMELEC and the LP370 test
use interrupts, Mitch's Forth polls.

**What the pen hit.** Each lightbutton in the display file starts with a `DDS` word that writes
its handler's address into core location 3; on a hit, `PEN` reads 3 (and 5, which drawings use)
and jumps there. Walked through word by word in [GUIDE-LIGHTPEN](GUIDE-LIGHTPEN.md).

**Tracking.** The cross is display words whose position words (`YCROSS`, `XCROSS`) the CPU
rewrites. `TRCR` reads the hit with `IDRC`, `POSCR` deposits it and snaps the logical point to the
grid (`AND GRID`: 1760 for 16 units, 1777 for off), and `SRAST`, a small spiral around the cross,
catches the pen when it slips. [TRACKING.md](../TRACKING.md) walks it.

**Display files.** `LB` is the lightbuttons, `WAREA` the frame (the only thing drawn at scale 8,
`PAR PO PF SC3`, by hand), `TEMPDF` the element being drawn, and `PERMDF` at `DFB` the finished
picture, which `COMPIL` builds from the ring structure named by `SAVINS` every time an element is
finished. Lines go through `VECGN`, P. Cross's 1967 line generator: it divides a line by 127 and
chains scale-1 vector words, so endpoints are exact. HV mode makes staircases with `SEGX` then
`SEGY`. Drawings are data (rings); display files are compiled output.

**Scale and intensity, per item.** The menu's `IN`, `SC`, `CA`, `RE`, `RO` buttons act on the
blinking (selected) item. `SCAMO` reads that item's "blink, scale and intensity word"
(`BSWOR`), steps its scale field (`AND (60`, add 20, wrapping from SC3 back to SC0) and
recompiles; `INTMO` steps intensity the same way. So PIXIE supports scale as an attribute of an
instance or line, using the 340's own magnification, not as a way to draw long lines.

**Titan.** `LTPX` and friends send the ring structure as checksummed blocklets over Wiseman's
link; [TITAN-LINK-PROTOCOL.md](TITAN-LINK-PROTOCOL.md). In the browser, tiny-titan answers.

## Status

- **Done:** SYMELEC runs from the 1972 listing, unchanged; the house demo draws a picture by pen
  as an acceptance test; tracking, menus and Titan transfer work.
- **Next:** pen interpolation so fast drags keep the cross; the rest of the element format.
- **Could:** call `COMPIL` at a safe point so an edit to the rings redraws at once; controls
  outside the tube that drive SYMELEC through its own buttons (scale, intensity), reading the
  result back by symbol ([ROADMAP §14](../ROADMAP.md#14-small-items)).

↑ [GUIDE](GUIDE.md) · [reference library](README.md)

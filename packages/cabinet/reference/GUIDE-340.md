# The Type 340 display: a second computer

Beyond its IOTs, the **Type 340** fetches *display words* from the same core memory by DMA
(data break) and executes them itself: parameter words, point words, vector / vector-continue
/ increment words, character words (with the Type 342 Symbol Generator — 6-bit codes
expanding to stroke sequences), and — with the Type 347 option — `DJS`/`DJP`, **display
jump-to-subroutine**. A whole second instruction set cohabiting in memory, which is why
PIXIE's display files read like programs and its subpictures are display subroutines.

Myer & Sutherland formalized the consequence in 1968 as the **wheel of reincarnation**: give
a display a subroutine capability, then conditionals, then registers, and you've built
another computer — so you offload *its* display work to something simpler, and around the
wheel goes. They name the **PDP-1 + Type 30** as the start (no processor) and the
**340–347** as the cardinal half-turn — still thought to be a channel, already a processor.
PIXIE sits on that cell: DJS/DJP, no hardware stack. Analysis and PDF:
[Myer & Sutherland, *On the Design of Display Processors*](../../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md).
The modern GPU executing command buffers (long literally called *display lists*) is the
same wheel, many revolutions later. The IBM System/360 channels — processors executing
Channel Command Word programs from main memory, contemporaries of the 340 — are the same
idea at datacenter scale.

## The instruction set, in one table

Bit 0 is the most significant, DEC's numbering. The 340 is always in one of eight modes; a word
is read according to the current mode, and most words name the next.

| Mode | A word holds | Notes |
|---|---|---|
| PARAM | next mode, pen on/off, scale (1, 2, 4, 8), intensity (0–7), stop | the 340's settings, changed between runs |
| POINT | x or y, absolute, 0–1023; intensify | the only absolute placement |
| VECTOR | escape, intensify, dy and dx, 7 bits each plus sign | relative; times the scale, so 127 × 8 = 1016, the whole screen |
| VCONT | the same, repeated until the beam leaves the screen | lines to the edge |
| INCR | four 4-bit steps of one unit times scale | short wiggles, 1 word per 4 steps |
| CHAR | three 6-bit characters (Type 342) | each letter advances the beam; LF and CR move it |
| SUBR | `DJS` call, `DJP` jump, `DDS` dispatch, target address | Type 347; one save register, so calls nest one deep |
| SLAVE | Type 343 slave displays | not modelled |

**Scale is a shift count on relative moves.** Vectors, increments and characters are multiplied
by 1, 2, 4 or 8; points are not. A long line at scale 8 costs one word and lands on multiples of
8; PIXIE instead chains scale-1 vectors so every endpoint is exact, and uses scale only to magnify
whole items ([GUIDE-SYMELEC](GUIDE-SYMELEC.md)).

**IOTs, the CPU's side.** `IDLA` loads the display address and starts; `IDRS` resumes after a
pen hit or edge; `IDSI` skips if stopped; `IDSP` skips on a pen hit and `IDRC` reads where the
beam was; `IDVE`, `IDHE` skip on the beam leaving the screen. Devices 05, 06, 07, 10; device 11
(`IDPN`) and 12 are cabinet extensions.

**Addresses.** The display address register is 13 bits: the 340 sees 8K, bank 0 on a bigger
PDP-7 ([GUIDE-PDP7](GUIDE-PDP7.md#memory-beyond-8k)).

## A real 340 coming back

The [Interim Computer Museum](https://icm.museum/) has a 340's cabinet and round CRT, attached to
their PDP-6, whose insides are now a Raspberry Pi simulating the machine. Most of the 340's logic is
missing. The deflection and intensity analog cards were re-implemented with substitutes for
unobtainable parts, so they no longer match the drawings. The plan in Charles Anthony's
[Opening up the DEC Precision Display 340](https://icm.museum/blog/?p=49) (three parts, from June
2025) skips rebuilding the digital side: the Pi simulates the 340's I/O bus and sends X/Y point
coordinates and control signals out its GPIO pins to two DACs driving the deflection pre-amplifiers
(0 V left, −10 V right). Deflection checks out; the intensity board is set aside until an EE can
look at it. He began with the 30E documentation and found the 340 is quite different inside; both
manuals are here ([H-340](H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf),
[Type 30E](Type_30E_Precision_CRT_Display_Dec63.pdf)).

The cabinet's 340 already produces that point stream with every point in order, so the same
emulated display could drive a real tube through those DACs: a cartridge running on the ICM's
glass, and a check of our phosphor rendering against the P7 it imitates.

## Status

- **Done:** the 340 as a processor, ported from SIMH's `display/type340.c`, every mode but
  SLAVE; segments with provenance (address, cycle, subroutine, pen bit, glyph); the shadow 340
  for steady drawing; the low-level instruction editor.
- **Next:** the universal drawing and a paused drawing editor
  ([DESIGN.md](../DESIGN.md#a-universal-340-editor)); copy the screen as a YAML display list.
- **Will:** a display-bank IOT, marked as an extension, if a real 340 couldn't reach past 8K.
- **Could:** check the 340 manuals for anything the port missed; the Type 343 slave displays.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)

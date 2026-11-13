# Videx Videoterm: the facts an emulator needs

Extracted from the documents in this folder ([README](README.md)), checked against the ROM images
in microM8's `octalyzer/data` (patch 0002) and MAME's `src/devices/bus/a2bus/a2videoterm.cpp`
(BSD-3, R. Belmont). Line numbers point into `text/`. Where the sources disagree, the ROM wins, and
the disagreement is written down. The implementation plan is [VIDEX.md](../../../VIDEX.md).

Expansion slot n is 3 throughout: the firmware assumes it, and the manual says the card must be in expansion slot 3.

## Address map

| Range | What | Source |
|---|---|---|
| `$C0B0`-`$C0BF` | Device select, 16 bytes. Bit 0: 0 = 6845 address register, 1 = 6845 data register. Bits 2-3: screen RAM page 0-3, latched on **any** access, read or write. Bit 1: 8 or 9 dot cells; ignored (always 9) | manual 3514-3546; MAME `read_c0nx`/`write_c0nx` |
| `$C300`-`$C3FF` | Expansion slot ROM: the last 256 bytes of the 1K firmware (ROM offset `$300`-`$3FF`). The same bytes also appear at `$CB00`-`$CBFF` | MAME `read_cnxx` returns `m_rom[offset+0x300]`; ROM `$300` = `2C CB FF 70`, the listing's `$CB00: BIT IORTS` (manual 4298) |
| `$C800`-`$CBFF` | Firmware, 1K, ROM offset `$000`-`$3FF` | manual 3610; MAME `read_c800` |
| `$CC00`-`$CDFF` | Screen RAM window, 512 bytes, read and write: byte `(addr & $1FF) + page*512` of the card's 2K | manual 3610-3690; MAME `read_c800`/`write_c800` |
| `$CE00`-`$CFFF` | Not used (open bus) | manual 3614 |
| `$CFFF` | Any access releases every card's `$C800` space (Apple convention). The firmware does `STA $CFFF` at `$CB36` | ROM scan |

The `$C800` space belongs to expansion slot 3 once code runs or reads in `$C300`-`$C3FF` (the 6502 fetching
the expansion slot ROM is enough). The firmware never writes `$Cnxx` to claim it.

Firmware accesses to card space, from a scan of `videx_fw24.rom`:
`STA $C0B0`/`STA $C0B1` pairs at `$C81C`, `$C8D3`, `$C8E5`, `$C9CF`, `$C9DA` (register writes);
`LDA $C0B0,X` at `$CA69` (page select, X = page*4); `STA $CC00,X`/`STA $CD00,X` at `$CA80`/`$CA85`;
`LDA $CC00,X`/`LDA $CD00,X` at `$CBA3`/`$CBA8`; `STA $CFFF` at `$CB36`.

## Screen RAM addressing

2048 bytes, one byte per character cell, no attribute bytes. The 6845 start address (R12/R13)
says which byte is the top-left cell, and the screen wraps at 2K:

```
cell(x, y) = (START*16 + y*80 + x) mod 2048        x 0-79, y 0-23
page       = cell / 512                            select with any access to $C0B0 + page*4
window     = $CC00 + cell mod 512
```

`START` is the screen-hole byte `$6F8+3` = `$6FB` (1787), which the firmware keeps equal to the
6845 start address divided by 16 (manual 3656-3690, Applesoft example 1980-2400). An emulator
does not read `$6FB`; it uses R12/R13 directly: `ma = (R12<<8 | R13) + y*R1 + x`, masked to `$7FF`.

## The 6845 registers

The register select at `$C0B0` takes the low 5 bits. Writes to `$C0B1` go to the selected
register. Reads of `$C0B1` return R14-R17 when selected; the others read as 0 on the Motorola
part (MAME returns `register_r()`).

| Reg | Bits | Name | Use in the emulator | Firmware 2.4 init |
|---|---|---|---|---|
| R0 | 8 | Horizontal total | ignore | `$7A` |
| R1 | 8 | Horizontal displayed | columns (80) | `$50` |
| R2 | 8 | H sync position | ignore | `$5E` |
| R3 | 4 | Sync width | ignore | `$2F` |
| R4 | 7 | Vertical total | ignore | `$22` |
| R5 | 5 | V total adjust | ignore | `$00` |
| R6 | 7 | Vertical displayed | rows (24; 18 after Ctrl-Z 1 in the manual's table) | `$18` |
| R7 | 7 | V sync position | ignore | `$1D` |
| R8 | 2 | Interlace mode | ignore (0 = normal) | `$00` |
| R9 | 5 | Max scan line | scan lines per row minus 1 (8 = 9 lines) | `$08` |
| R10 | 7 | Cursor start | bits 0-4 first cursor line; bits 5-6 mode, below | `$E0` |
| R11 | 5 | Cursor end | last cursor line | `$08` |
| R12 | 6 | Start address high | top-left cell, write-only | `$00` |
| R13 | 8 | Start address low | | `$00` |
| R14 | 6 | Cursor address high | cursor cell, read/write | `$00` |
| R15 | 8 | Cursor address low | | `$00` |
| R16 | 6 | Light pen high | read-only; latched by the pen, else 0 ([LIGHTPEN.md](../../../LIGHTPEN.md)) | |
| R17 | 8 | Light pen low | read-only | |

Register descriptions: manual 3272-3446; datasheet register table near line 1400. The init values
are the 16 bytes at `$C8A1` in `videx_fw24.rom`, which the loop at `$C819`-`$C828` writes to
R0-R15. The manual's listing shows the table at `$C8A7` holding `7B 50 5E 29 1B 08 18 19 00 08 E0 08`
(OCR, 3884-3887): that listing is the 60 Hz firmware, and our ROM is MAME's "v2.4 (50 Hz)"
(SHA-1 `bb653836e84850ce3197f461d4e19355f738cfbf`). Only R0-R5 and R7 differ; the emulator
ignores them.

**Cursor mode**, R10 bits 6-5 (datasheet Table 4, line 1179; manual 3403-3412):

| Bit 6 | Bit 5 | Cursor |
|---|---|---|
| 0 | 0 | Steady |
| 0 | 1 | Not shown |
| 1 | 0 | Blinks, period 16 fields |
| 1 | 1 | Blinks, period 32 fields |

The firmware's `$E0` is blink at 32 fields from line 0 to line 8 (R11): a full block, on half of
each 32-field period. The cursor shows in the cell whose address equals R14/R15, on scan lines
R10&31 through R11.

## Characters

- Cell: 9 dots wide (MAME `set_char_width(9)`), R9+1 = 9 scan lines tall. 80x24 cells make a
  720x216 picture. The manual describes the glyph as 7x9 in an 8x10 cell (1336-1345); MAME's
  9-dot clock and 9 lines are what the 6845 values give, and what the plan uses.
- Character ROM: 2K, 128 glyphs of 16 bytes; byte `(c & $7F)*16 + line`, bit 7 is the leftmost
  dot. Dot 9 repeats bit 0 (MAME shifts left and keeps bit 0). Checked: glyph `$41` is an `A`
  on lines 0-6.
- Bit 7 of the screen byte selects the alternate set (manual Table 2: Ctrl-Z 3, "alternate
  character set, or inverse video"). MAME's default alternate set is "Inverse Video".
- ROM files (`octalyzer/data`, patch 0002): `videx_chr.rom` normal, SHA-1 `410b54f3…`, same as
  MAME; `videx_chr_uc.rom` uppercase, same as MAME; `videx_chr_inverse.rom` inverse, SHA-1
  `c5c1f726…`, not MAME's clone dump (`50c3df52…`); plus APL, Epson, French, German, graphics,
  Katakana, Russian, Spanish, std7x9, super/subscript and symbol sets.

## Screen holes the firmware uses (expansion slot 3)

Manual Table 1, line 1294, and listing equates 3741-3750:

| Address | Use |
|---|---|
| `$47B` | Screen base address, low |
| `$4FB` | Screen base address, high |
| `$57B` | Cursor column, 0-79 |
| `$5FB` | Cursor row, 0-23 |
| `$67B` | Pascal character |
| `$6FB` | First line on screen (`START`, start address / 16) |
| `$77B` | Power-off and lead-in counter |
| `$7FB` | Flags: bit 0 alternate set, bit 4 24 lines, bit 6 lower case, bit 7 GETLN (3549-3597) |

Useful in tests: after `PR#3`, `$57B`/`$5FB` follow the cursor.

## The Soft Video Switch and annunciator 0

The switch replaces the 74LS259 at F14 and picks the monitor's picture
([text](text/Videx_Soft_Video_Switch.txt), OCR):

- When the color killer is off (a graphics mode is on), it shows the Apple's 40 columns.
- Otherwise it follows annunciator 0: AN0 on shows the Videx, AN0 off shows the Apple.

AN0 on is a reference to `$C059`, AN0 off to `$C058`, as in Apple's documentation and microM8's
`annunciators()` bit 0. The Soft Video Switch manual says the reverse. The firmware settles it:
the general output routine does `STA $C059` at `$CA8F` on every character, init ends with
`SETEXIT STA $C059` at `$C82A`, and `STA $C058` at `$C995` is the Ctrl-Z 1 command, which the switch
manual calls the way back to 40 columns. The Autostart ROM's reset reads `$C058` at `$FA6F`, so reset
shows the Apple's screen, which matches the switch manual's description of reset.

In microM8 terms, the Videx picture shows when `annunciators & 1` and `SW_TEXT()`.

## Firmware entry points

| Address | What |
|---|---|
| `$C300` | `PR#3`/`IN#3` entry, `BIT IORTS` to set V (listing 4295-4310) |
| `$C30B`-`$C30F` | Pascal 1.1 signature and offsets: `01 82`, then init/read/write/status |
| `$C800` | Init (`$C800`-`$C82D`): clears the screen, loads R0-R15 from `$C8A1`, `STA $C059` |
| `$CA89` | `OUTPT1`, the general output routine |

## Control codes (manual Table 2, line 1379)

Ctrl-Z then `0`: clear, 24 lines. Ctrl-Z `1`: clear, 18 lines in the manual (and AN0 off in
firmware 2.4, above). Ctrl-Z `2`: normal set. Ctrl-Z `3`: alternate set. Ctrl-A toggles lower case.
Shift-Ctrl-N x y moves the cursor (3431-3436). The card starts in upper case.

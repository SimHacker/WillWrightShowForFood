# Videx Videoterm reference library

The documents behind the cabinet's Videx Videoterm card for microM8: the card's manual with its
firmware listing, the Soft Video Switch that picks between the Apple's screen and the card's, and
the Motorola 6845 the card is built around. [SPEC.md](SPEC.md) is what an emulator needs, pulled
out of them with line references; [VIDEX.md](../../../VIDEX.md) is the plan for the card.

| Local copy | Public URL | Why you need it |
|---|---|---|
| [`Videx_Videoterm_Installation_and_Operation_Manual.pdf`](Videx_Videoterm_Installation_and_Operation_Manual.pdf) | [mirrors.apple2.org.za](https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/hardware/video/Videx%20Videoterm%20-%20Installation%20and%20Operation%20Manual.pdf) | **The card.** 138 pages: installation, control codes (Table 2), screen holes (Table 1), BASIC and Pascal programming examples, the 6845 registers (chapter 5), memory mapping and paging, and the full source listing of firmware 2.4 by Darrell Aldrich (1981) |
| [`Videx_Soft_Video_Switch.pdf`](Videx_Soft_Video_Switch.pdf) | [mirrors.apple2.org.za](https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/hardware/video/Videx%20-%20The%20Soft%20Video%20Switch.pdf) | 4 pages, scanned: how annunciator 0 and the color killer choose 40 or 80 columns, and the schematic. Its prose has `$C058` and `$C059` swapped; see [SPEC.md](SPEC.md#the-soft-video-switch-and-annunciator-0) |
| [`Motorola_MC6845_CRTC.pdf`](Motorola_MC6845_CRTC.pdf) | [bitsavers](https://bitsavers.org/components/motorola/_dataSheets/6845.pdf) | The CRT controller's datasheet: registers R0-R17, cursor blink modes (Table 4), timing. bitsavers refuses requests without a browser user agent |

The same manuals, with more Videx documents, are in the
[Apple II Documentation Project](https://www.mirrors.apple2.org.za/Apple%20II%20Documentation%20Project/Interface%20Cards/80%20Column%20Cards/Videx%20Videoterm/Manuals/).

## Text

[`text/`](text/) holds searchable text, so the PDFs needn't be opened to look something up:

| File | Made with | Where things are |
|---|---|---|
| [`Videx_Videoterm_Installation_and_Operation_Manual.txt`](text/Videx_Videoterm_Installation_and_Operation_Manual.txt) | `pdftotext -layout` (the PDF's own OCR layer; hex in the listing is sometimes misread, `8D` as `80`, `O` for `0`) | Table 1 screen holes 1294; initialization 1336; Table 2 control codes 1379; programming examples 1930-2420; CRTC registers 3272-3446; changing a register 3457-3512; device select 3514-3546; set-up flags 3549-3597; memory mapping and paging 3602-3698; firmware listing 3703 on (init 3796, `TABLE` 3884, output routine 4215) |
| [`Motorola_MC6845_CRTC.txt`](text/Motorola_MC6845_CRTC.txt) | `pdftotext -layout` | Cursor modes 1168-1193; register summary near 1400 |
| [`Videx_Soft_Video_Switch.txt`](text/Videx_Soft_Video_Switch.txt) | `pdftoppm -r 200 -gray`, converted to PNG, then `tesseract` | Theory of operation on page 2; the schematic's labels on page 4 |

## ROMs

The firmware and character ROMs aren't here; they live in the microM8 fork beside its Apple ROMs
(`octalyzer/data/videx_*.rom`, [patch 0002](../../../microm8/FORK.yml)). Their checksums against
MAME's are in [SPEC.md](SPEC.md#characters).

↑ [reference](../../README.md) · [APPLE2](../../../APPLE2.md) · [VIDEX](../../../VIDEX.md)

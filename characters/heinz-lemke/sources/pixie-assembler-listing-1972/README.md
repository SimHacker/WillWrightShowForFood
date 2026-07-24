# PIXIE Assembler Listing — the crown jewel (scanned 2026, assembled 1972)

The complete PIXIE program for the PDP-7 + DEC 340 display, as lineprinter listings from the
**Cambridge University CAD Group Assembler** (cross-assembled on Titan, user `HL1470`).
~5000 instructions: light-pen handling, interrupt management, interactive model building —
delivered by Heinz Lemke 24 July 2026 ([thread](../2026-07-24-pixie-storyline-thread.md)).

| File | What |
|------|------|
| [`PIXIE-Assembler-Program-HULEMKE.pdf`](PIXIE-Assembler-Program-HULEMKE.pdf) | Original scan as received (128 pages, image-only, A3 lineprinter) |
| [`pages/page-000.png` … `page-127.png`](pages/) | Per-page grayscale rasters (200 dpi) for OCR |
| [`thumbs/`](thumbs/) | 480px thumbnails |
| [`ocr-pages/`](ocr-pages/) | Per-page TSV transcriptions (swarm output; arbitration in progress) |
| `symelec-listing.txt` / `rsppix-listing.txt` | Stitched faithful listing text |
| `symelec.asm` / `rsppix.asm` | Clean assembly source for SIMH round-trip |
| `symelec.oct` / `rsppix.oct` | Transcribed octal memory images (4,674 + 651 words) |
| [`TRANSCRIPTION-REPORT.md`](TRANSCRIPTION-REPORT.md) | **Research report** — process, costs, failure taxonomy, learnings |

## Structure map (from scan survey)

| PDF pages | Raster files | Content |
|-----------|--------------|---------|
| 1–2 | `page-000`–`page-001` | Job cover sheets: `JOB (1@27HL1470/CNSL 10)…12 2 72`, "CAMBRIDGE UNIVERSITY CAD GROUP ASSEMBLER", "HARD ERROR(S) IN ASSEMBLY" (struck through). Handwritten: "PDP7", margin notes "pp 33 → RSP(1969?)", "pp 54 → …"[?] |
| 3–112 | `page-002`–`page-111` | **`/SYMELEC`** — main PIXIE program, listing pages 1–~110, "ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470" |
| 113 | `page-112` | Job cover sheet `29 1 72 – 17 15`, handwritten "**RSP**" divider |
| 114–128 | `page-113`–`page-127` | **`/RSPPIX`** — RSP data-structure package, listing pages 1–15, "ASSEMBLED 29 1 72 AT 17,15,40 BY HL1470" |

Matches Heinz's 15 July description exactly: ~110 A3 pages + 15 RSP pages.

Listing format per line: `seq-no  address/ octal-word  [label,]  mnemonic operands  /comment`.
PDP-7 instruction set (LAC, DAC, JMS, ISZ, SZA, SAD, LAW, ION…) plus display-file words (PAR,
POH, POV, VEC, DJS, DJP — DEC 340 parameter/point/vector/subroutine modes).

## Routines spotted in the survey pass

- `BEGRTP` — `/INTERRUPT ENTRY` (SYMELEC p.1)
- `GARB`, `GARB1`, `3BRTN` — **`/GARBAGE COLLECTOR PHASE THREE`**, "COLLECT GARBAGE & RESTORE
  LISTS", recursive exit routine (SYMELEC p.31) — a GC in PDP-7 assembly; thesis acknowledges
  **C. Cheney "for a new garbage collector"**
- `TD` `/TRACK`, `TRACK` tracking cross, `PSD/PAD/PRD/PCD/PLD/PXD` `/POS LB'S AT CROSS` —
  light-button layout **around the tracking cross** (radial-menu forensics target)
- `INT` — `/INTERRUPT ROUTINE`: `IDSP`, `JMS PEN`, `JMS STPCD`, `JMS EDGEV`, `IDVE`, `IDHE`
  (SYMELEC p.54) — **the light-pen interrupt dispatch Lars needs**
- `STRAIG` `/DRAW STRAIGHT LINE`, `RUBBER` `/RUBBER BAND LINE`, `DRAMO`, `ENDCOM`
  `/END OF COMMAND MODE`, `ENDDRA` `/RESET ALL CONSTANTS ETC` (SYMELEC p.52)
- Subpicture machinery: `COMP9`/`COMP10`, blink bits, FLEA structures, `/LOAD SUBPICTURE`
  (SYMELEC p.88)
- RSPPIX: `SETUP` `/SETUP PACKAGE` `/FORM FREELIST`, name list, LOP/LINK stacks, `ERR`
  `/STACKS TO SHORT OR ?` (RSPPIX p.1)

## OCR status

All 128 pages transcribed by LLM subagent swarm against a shared spec
([`scripts/TRANSCRIPTION-SPEC.md`](scripts/TRANSCRIPTION-SPEC.md)), stitched and validated by
[`scripts/stitch.py`](scripts/stitch.py) + [`scripts/opcheck.py`](scripts/opcheck.py) (octal
alphabet, address continuity, mnemonic-vs-opcode encoding). Arbitration of flagged rows and
tainted pages in progress; then the assembler round-trip: assemble `*.asm` under SIMH and
diff against `*.oct` — the 1972 assembler as referee. Full process, cost, and quality
analysis: [`TRANSCRIPTION-REPORT.md`](TRANSCRIPTION-REPORT.md).

## Show use

Walk the interrupt handler on air; settle the **target-area vs direction** radial-menu question
from `TD`/`TRACK` + light-button code (see [`../../pixie-source-recovery.md`](../../pixie-source-recovery.md)
"Questions the listing should answer"); Lars assembles under SIMH → **CARS 2027 Berlin, 29 June
2027** demo target. Hardware + programming manuals for the PDP-7, Type 340 display, and Type 370
light pen (mirrored from bitsavers, with the emulator/light-pen mission brief for students):
[`../pdp7-reference/`](../pdp7-reference/README.md).

↑ [character README](../../README.md) · [source recovery](../../pixie-source-recovery.md) · [pull-in gaps](../../pull-in-gaps.md) · [24 Jul thread](../2026-07-24-pixie-storyline-thread.md)

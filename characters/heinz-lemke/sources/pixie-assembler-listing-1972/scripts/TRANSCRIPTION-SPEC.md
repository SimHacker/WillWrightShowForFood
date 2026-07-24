# PIXIE listing transcription spec

You are transcribing scanned lineprinter pages of the 1972 PIXIE PDP-7 assembler listing
(Cambridge University CAD Group Assembler, cross-assembled on Titan). Page images live in
`pages/page-NNN.png` (200 dpi grayscale) in this directory. For each assigned page, read the
image and write a TSV transcript to `ocr-pages/page-NNN.tsv` (same NNN, create the dir if
needed).

## Listing line anatomy

A typical printed line:

```
  371            GARB,     LAC BEG        /COLLECT GARBAGE & RESTORE LISTS
  372  2627/ 205162        LAC BEG        /START ADDRESS
```

Columns: decimal sequence number · octal address + `/` · assembled octal word · optional
label (with trailing comma) · instruction (mnemonic + operands) · optional `/comment`.
Many sequence lines are blank apart from the number. Some lines are literal data (an octal
word with no mnemonic). Page header: `/SYMELEC   ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470   PAGE  n`
(RSP pages say `/RSPPIX … ASSEMBLED 29 1 72 AT 17,15,40 …`).

## Output format — one row per printed line, in printed order

Tab-separated fields: `SEQ<TAB>ADDR<TAB>OCTAL<TAB>LABEL<TAB>INSTR<TAB>COMMENT`

- `SEQ`: the decimal sequence number as printed (e.g. `371`). Blank-content lines: emit the
  SEQ with all other fields empty.
- `ADDR`: octal address WITHOUT the trailing slash (e.g. `2627`); empty if the line has none.
- `OCTAL`: the assembled word (e.g. `205162`); empty if none. May be shorter than 6 digits
  (leading spaces in print, e.g. `1` or `77777`); transcribe digits only.
- `LABEL`: label including its trailing comma exactly as printed (e.g. `GARB,`); empty if none.
- `INSTR`: mnemonic and operands exactly as printed, single spaces between tokens
  (e.g. `LAC I OP+7`, `JMP .-4`, `VEC ES -34 14`, `PAR PO PF SC3 IN5`). Literal-constant
  lines put the printed value here (e.g. `051637` or `0`).
- `COMMENT`: comment including its leading slash (e.g. `/ADVANCE ADDRESS`); empty if none.

Special rows:
- `RAW<TAB><literal text>` — for non-listing lines: the page header (transcribe it fully),
  title lines like `*DECIMAL DIGIT IN OCTAL NUMBER`, standalone comment lines like
  `/GARBAGE COLLECTOR PHASE THREE` (put those in RAW too, at their printed position).
- `HAND<TAB><description or reading>` — handwritten annotations/marks (pen ticks, margin
  notes). Describe briefly; transcribe if legible.
- Start each file with two comment lines:
  `# page-NNN.png` and `# <module> listing page <n>` (from the printed header).

## Accuracy rules — the whole point

1. **Octal fields (`ADDR`, `OCTAL`) contain ONLY digits 0–7.** If you think you see an 8 or 9
   there, look again — it is a smudged 0, 3, 5, or 6. Sequence numbers (SEQ) are decimal and
   MAY contain 8 and 9.
2. Common confusions in this font: `0`/`9` (0 is wider), `1`/`I` (mnemonics use letters,
   numeric fields use digits), `5`/`6` when faded, `B`/`8`. Instructions are UPPERCASE.
3. PDP-7 mnemonics you will see a lot: LAC DAC JMS JMP ISZ SZA SNA SAD TAD AND ADD XOR LAW
   DZM RAL RAR CLL CMA CAF HLT ION IOF SKP IDLA WAIT plus IOT names (IDSP IDSI IDVE IDHE…)
   and display-file words: PAR POH POV VEC DJS DJP DDS PXD. `JMS` and `JMP` both occur —
   read the third glyph carefully (S vs P).
4. Operand idioms: `I` = indirect (e.g. `LAC I OP+7`), `(` = literal (e.g. `LAC (777777`),
   `.` = here (e.g. `JMP .-4`, `DJS SB , 2`). Transcribe exactly as printed, including a
   space before `,` if printed that way.
5. Do not invent or normalize. Preserve misprints. If a character is genuinely illegible,
   use `?` in its place. If a whole field is uncertain, append `<TAB>?UNSURE` as an extra
   trailing field on that row.
6. Do not skip lines. Every printed line (including blank-numbered ones) gets a row, in order.
7. Some pages are sparse (end of a module: a few literal words only) — transcribe what is
   there; short files are fine.

An OCR witness from Apple Vision may exist at `ocr-raw/page-NNN.txt` — you may consult it as
a second opinion, but the page image is the source of truth (the witness is known to garble
octal digits and JMS/JMP).

When done with all assigned pages, reply with: pages completed, total rows, and a list of
rows you marked `?UNSURE` or `?` (page + SEQ).

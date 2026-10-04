# SYMELEC and RSPPIX, as the cabinet runs them

Heinz Lemke's PIXIE programs, assembled 12 February 1972 at Cambridge (`HL1470`). These are the
finished artifacts, copied here so the cabinet has everything it runs in one place. Where they
come from, how they were transcribed, and every scan, OCR pass and report:
[characters/heinz-lemke/sources/pixie-assembler-listing-1972/](../../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md).
That folder is the master. Fix things there, then copy the changed file here.

| File | What |
|---|---|
| `symelec-listing.txt` | the listing, page by page: address, octal word, source line, comment |
| `symelec.asm` | the source, from the listing |
| `symelec.oct` | the assembled words, `addr word` per line |
| `symelec-literals.oct` | the literal pool, from the listing's literal table (`scripts/extract-literals.mjs`) |
| `symelec-symbols.tsv` | the symbol table (`scripts/extract-symbols.mjs`) |
| `rsppix-listing.txt`, `rsppix.asm`, `rsppix.oct` | the ring structure processor, the same three forms |

The two extract scripts in `packages/cabinet/scripts/` write into Heinz's folder; copy the results
here after running them.

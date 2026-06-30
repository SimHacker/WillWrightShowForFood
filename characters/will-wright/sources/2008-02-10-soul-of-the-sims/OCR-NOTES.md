# Motive.c transcription notes

## Sources (priority order)

1. **Primary:** `images/MotivePage1.png` … `MotivePage5.png` from https://www.donhopkins.com/home/images/Sims/
2. **OCR raw:** `ocr-raw/MotivePage*.txt` (tesseract 5.5.1, 2026-06-29)
3. **Cross-check:** community transcriptions (e.g. gingerbeardman gist, alexcu/motive-simulator) — used only where scan + OCR agreed

## Cleanup choices

| Issue | Resolution |
|-------|------------|
| `mHappyLife` spelling | Scan page 1 + page 5 OCR |
| `Motive[mHunger] -= tem` | Present on page 2 scan; included |
| Mental calc uses `tem +=` after physical | As on page 4 printout — prototype quirk preserved |
| `Motive[mHappyWeek]` weekly average | Uses `mHappyWeek`, not `mHappyDay` (page 5) |
| Mac `AlertCancel`, `Rect`, `\p` strings | Kept verbatim; `-DMOTIVE_STANDALONE` stubs for gcc |
| `AdjustMotives`, `DrawMotive*` | Declared on page 1; implementations not in published scan |

## Compile

```bash
gcc -DMOTIVE_STANDALONE -std=c89 -o motive Motive.c && ./motive
```

Original harness: `XmotiveHarness` on Macintosh, January 1997.

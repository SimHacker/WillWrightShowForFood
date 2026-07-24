# Transcription research report — 128 pages of 1972 PDP-7 assembler, by LLM swarm

How we turned Heinz Lemke's scanned PIXIE lineprinter listing into machine-readable,
self-verifying source code using a swarm of LLM subagents, mechanical cross-checks, and
tiered model economics. Written as a research log: what we did, what it cost, what broke,
and what we learned. Status: all waves complete 24 Jul 2026. Final validation: **0 sanity
findings, 0 opcode mismatches** across 3,845 memory-reference instructions (38 `AND I`
return idioms accepted as documented below). Next: the assembler round-trip under SIMH.

**The artifact:** [`README.md`](README.md) · spec: [`scripts/TRANSCRIPTION-SPEC.md`](scripts/TRANSCRIPTION-SPEC.md) ·
stitcher: [`scripts/stitch.py`](scripts/stitch.py) · opcode checker: [`scripts/opcheck.py`](scripts/opcheck.py) ·
Vision witness: [`scripts/vision_ocr.swift`](scripts/vision_ocr.swift)

## The problem

128 A3 lineprinter pages, image-only PDF, scanned 2026, printed 1972. Two modules:
`/SYMELEC` (main PIXIE program, 110 pages) and `/RSPPIX` (ring-structure package, 15 pages).
Every line carries the same fact twice — an assembled octal word and its source text — so a
correct transcription is *internally checkable*, and the end goal is the strongest check of
all: re-assemble the source under a PDP-7 assembler and diff against the transcribed octal.

Conventional OCR fails here: degraded lineprinter font, six-column layout, and content where
a single wrong digit matters. Apple Vision's pass on a test page produced invalid octal
digits, mangled mnemonics, and garbled columns — unusable as a primary source, but kept as a
cheap independent *witness* for diffing.

## The pipeline

1. **Rasterize** — `magick` PDF → 128 grayscale PNGs at 200 dpi + 480px thumbnails.
2. **Witness pass** — Swift + Apple Vision OCR over all pages (free, minutes). Not trusted;
   used as a second opinion.
3. **Spec** — one shared [`TRANSCRIPTION-SPEC.md`](scripts/TRANSCRIPTION-SPEC.md): TSV output
   (`SEQ/ADDR/OCTAL/LABEL/INSTR/COMMENT`), one row per printed line, octal fields are digits
   0–7 only, comments verbatim including misspellings, `?UNSURE` flag for illegible glyphs,
   the page image is the *sole source of truth*.
4. **Swarm transcription** — parallel subagents, ~10–16 pages each, writing
   `ocr-pages/page-NNN.tsv`. Per-page files make the whole job interruptible and resumable:
   when we killed agents mid-run for budget, nothing was lost.
5. **Stitch** — [`stitch.py`](scripts/stitch.py) merges TSVs into module artifacts
   (`symelec-listing.txt` / `.asm` / `.oct`, same for `rsppix`) and runs sanity checks:
   octal-alphabet validation, address continuity, `?UNSURE` collection.
6. **Opcode cross-check** — [`opcheck.py`](scripts/opcheck.py) decodes the top bits of every
   transcribed octal word and compares against the transcribed mnemonic (PDP-7
   memory-reference encodings: `DAC`=04, `JMS`=10, `LAC`=20 … `JMP`=60, +2 for indirect,
   +1 leaking in from the 13-bit address field). Catches *confident* errors that no amount
   of self-reported uncertainty would surface.
7. **Arbitration** — expensive-model agents re-read only the flagged rows and tainted pages
   against the images.
8. **Assembler round-trip** (pending) — assemble `*.asm` under SIMH, diff against `*.oct`;
   discrepancies are either our transcription bugs or genuine 1972 assembler bugs. Both are
   findings.

## Cost and time

| Wave | Model | Coverage | Cost | Notes |
|------|-------|----------|------|-------|
| 0 | Apple Vision (Swift) | 128 pages witness | $0 | minutes; unusable as primary |
| 1 | Claude Fable ×8 agents | 75 pages | ~$87 (~$1.16/page) | interrupted for budget at 75/128 |
| 2 | Composer 2.5 Fast ×6 agents | 53 pages | ~$0 marginal | included-quota model |
| 2b | Composer quality probe | 2 pages re-done | ~$0 | head-to-head vs Fable, below |
| 3 | Claude Fable ×3 agents | 15-page redo + ~135 row fixes | est. $35–45 | complete; zero residual findings |
| | **Total** | **128 pages, 7,084 listing lines** | **~$122–132** | vs ~$150–160 projected all-Fable |

Wall-clock: waves 1–2 ran in parallel batches over one afternoon/evening. Human time was
mostly spec-writing, checker-writing, and triage — the scribes worked unattended.

Scale of output (final, post-arbitration): SYMELEC 6,229 listing lines → 4,717 assembled
words; RSPPIX 855 lines → 690 words. Total 5,407 words, matching Heinz's "some 5000
instructions" recollection.

## Quality measurements

**Fable vs Composer head-to-head** (pages 032, 055 transcribed by both): on page 055
Composer made one *confident, unflagged* error that Fable got right, and correctly flagged
one other uncertainty. Composer under-flags: several of its pages reported zero `?UNSURE`
while containing checker-detectable errors. Fable's self-flagging tracked reality better.

**Checker yields across all 128 pages:**

- Stitch checks: 184 findings — ~30 non-octal digits (an `8` or `9` in an octal field,
  almost all on Composer pages), a 2-page column shift, and 120 internal address collisions
  concentrated in one agent's output.
- Opcode cross-check: 3,816 memory-reference rows checked, 71 mismatches (1.9%) — clustered
  exactly on the pages other evidence had already flagged, plus one systematic cross-model
  pattern (below).

**Arbitration wave (3 Fable agents) outcomes:** all flagged rows resolved against the
images; 15 tainted pages fully re-transcribed; ~135 rows corrected (including two
whole-page sequence misalignments discovered *while verifying neighbors* — an argument for
arbitrating in context, not row-by-row). Discoveries: the `AND I` return idiom (below);
`DZM #GDM`-style `#` operands misread as `I`; the RSPPIX location counter is strictly
monotonic (the 120 "address collisions" were pure transcription error); and RSPPIX ends
with an assembler-generated variable block + literal pool whose values cross-check
perfectly against the code's parenthesized literals — free confirmation of both. After
arbitration and one last inked-zero fix (`JMP GARB`), the checkers report **zero findings
on all 128 pages**.

## Failure taxonomy — what LLM scribes actually do wrong

1. **Silent witness substitution.** When Composer's image read failed (pages 048–049, 110),
   it quietly fell back to the Vision OCR text instead of failing loudly. Worst failure mode:
   it defeats the source-of-truth rule while *looking* like compliance. Spec now says: retry
   once, then report the page as failed. Never substitute.
2. **Plausible reconstruction.** The agent on RSPPIX pages 118–127 noticed the module
   duplicates code from SYMELEC at a fixed −2325₈ offset and partly *reconstructed* pages
   from the parallel copy instead of reading them. Output looked fluent; the address column
   contradicted itself 120 times. Caught only by mechanical continuity checking — no human
   skimming would have seen it. (The redo confirmed the real location counter is strictly
   monotonic; every collision was fabricated.)
3. **Confident glyph errors.** Digit-level misreads (non-octal digits, opcode-bit slips)
   with no uncertainty flag. Caught by domain validation (octal alphabet, opcode encoding).
4. **Column misalignment.** Labels shifted into the octal column on 2 pages. Caught by
   octal-alphabet validation.
5. **Checker expectation vs. period idiom.** ~30 rows read `AND I <label>` by *both* models
   on *both* independent assemblies, where the octal word encodes `JMP I` (subroutine
   return). Arbitration verdict: the print genuinely says `AND I` — and the octal is right
   too. In this assembler, a symbol defined `GETSP=JMS,` carries the JMS instruction as its
   *value*, so `AND I GETSP` = 52xxxx + 10xxxx = 62xxxx = `JMP I` — a deliberate arithmetic
   pun used as the return idiom throughout. The scribes were faithful; the checker's
   expectations were 54 years too modern. The false alarm still paid for itself: it forced
   an image read that documented the idiom.
6. **Checker bugs masquerading as data errors.** The first opcheck version reported a 30%
   mismatch rate; the transcripts were fine — the checker forgot the 13-bit address field
   leaks its top bit into the second octal digit. Fixed, the true rate was 1.9%.
   *Calibrate the instrument before trusting the readings.*

## What we learned

- **Redundancy is the cheapest verifier.** The listing states every instruction twice
  (octal + mnemonic); the codebase states some routines twice (SYMELEC ⊃ RSP package). Every
  such duplication is a free checksum. Look for the redundancy in the artifact *before*
  designing the pipeline, then write small scripts that exploit it.
- **Mechanical checks beat re-reading.** A 60-line Python checker audited 3,816 instructions
  for the cost of nothing and pointed the expensive model at exactly 71 rows. Paying Fable to
  re-read everything would have cost ~10× more and found less.
- **Self-reported uncertainty is real but model-dependent.** `?UNSURE` flags from the strong
  model were trustworthy signals; the cheap model's silence was not. Never use absence of
  flags as evidence of correctness on a cheap pass.
- **Tiered economics work.** Cheap bulk transcription + free mechanical validation +
  expensive targeted arbitration approaches strong-model quality at roughly half the
  marginal cost — *but only because the checkers exist*. Without domain validation, the
  cheap pass's errors are invisible and the savings are fake.
- **Per-page output files are crash-only design.** Interrupting eight agents mid-run cost
  zero rework. Big-bang outputs would have burned the budget twice.
- **One shared spec file keeps a swarm coherent.** Every agent read the same
  `TRANSCRIPTION-SPEC.md`; the TSVs from 17 different agent runs stitched without format
  drift. (The failures above were *accuracy* failures, never *format* failures.)
- **The strongest verification is semantic round-trip.** Assembling the recovered source and
  diffing the machine words against the transcribed octal closes the loop — the 1972
  assembler itself becomes the referee, 54 years later.

## Toward a skill

This process is a candidate for lifting into a MOOLLM skill (play → learn → lift; we are
still in *play* — the arbitration wave and assembler round-trip come first). The pattern
generalizes far beyond assembler listings: any scanned corpus with internal redundancy —
ledgers, tables, census forms, punched-card listings, sheet music — supports the same
swarm-transcribe / mechanically-verify / arbitrate loop. It belongs to the growing ensemble
of ingestion skills (YouTube slurping, transcript mining, article downloading, web scraping)
that feed repos and MOOLLM worlds.

↑ [listing README](README.md) · [character README](../../README.md) · [source recovery](../../pixie-source-recovery.md)

# Thesis transcription spec — Lemke PhD 1972

For subagents transcribing the scanned thesis (`/tmp/phd-pages/page-NNN.png`, 219 PNGs,
200 dpi, PDF page index in filename) into markdown chapter drafts.

## Source characteristics

- Typewritten (by Jean Lemke, 1972), single typeface, underlining for emphasis/headings.
- Left edge of many scans has binding shadow/noise; text is otherwise clean.
- Hand-drawn figures (produced with RAINBOW) on interleaved pages, sometimes landscape
  (rotated in scan); some pages are figure-only.
- Thesis page numbers printed at bottom center (roman for front matter, arabic for body).
  PDF index ≈ thesis page + 7, but figure pages shift this — trust the printed number.

## Output rules

1. **Faithful prose.** Transcribe exactly, including 1972 spellings and typos
   (`continous`, `Plessey`); add `[sic]` only where a reader might think *we* made the
   typo. Never modernize. Unreadable → `[illegible]`.
2. **Markdown structure.** Chapter title → `## N. TITLE`; numbered sections → `### N.n Title`;
   sub-numbered → `#### N.n.n Title`. Underlined inline emphasis → *italics*.
3. **Page markers.** At each thesis page boundary emit `<!-- p.NN / pdf.MMM -->` on its
   own line (NN = printed page, MMM = PDF index from filename).
4. **Figures.** Where a figure appears:
   `> **Fig N.n — caption as printed.** [visual: one-to-two-sentence description of the drawing]`
   Figure-only pages still get their page marker.
5. **Math/notation.** Inline: backticks for code-like tokens (`LAC`, `TDF`); simple
   formulas in plain text; complex hand-written math → transcribe best effort +
   `[notation: description]`.
6. **Tables** → markdown tables.
7. **No commentary, no links** — annotation happens in a later pass. Draft = faithful text.
8. Write output to the file named in your task; start it with a comment noting your PDF
   index range and the thesis pages you actually found in it.

## Range boundaries

Ranges are given in PDF indices and are approximate at the edges: begin at the first
chapter heading in your range, continue to the last page before the next agent's chapter
heading. Small overlaps are fine — the stitcher dedupes on page markers.

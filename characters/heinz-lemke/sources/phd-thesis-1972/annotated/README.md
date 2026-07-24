# Annotated edition — Lemke PhD thesis, 1972

A readable, intertwingled markdown edition of *Interactive Graphics in an Integrated CAD
System* (Heinz Ulrich Lemke, University College, Cambridge, March 1972): faithful
transcription of the [219-page scan](../PIXIE-PhD-Thesis-HULEMKE-Interactive-Graphics-in-an-integrated-CAD-system-1972.pdf),
enriched with links into this repo (the recovered [assembler listing](../../pixie-assembler-listing-1972/README.md),
the [link protocol decode](../../pdp7-reference/TITAN-LINK-PROTOCOL.md), the
[turist guide](../../pdp7-reference/GUIDE.md)), Wikipedia, and primary sources. Editorial
notes are blockquotes marked ✎; everything else is Lemke 1972 verbatim, typos included.

## The edition

| File | Contents | Status |
|------|----------|--------|
| [`00-front-matter.md`](00-front-matter.md) | Title, preface, originality, acknowledgements, contents | done |
| [`01-chapters-1-2.md`](01-chapters-1-2.md) | Part 1: Introduction; Integrated CAD (BCPL, RSP, Cheney compactor) | done |
| [`02-chapters-3-4.md`](02-chapters-3-4.md) | Man-machine interaction (satellite graphics!); the RAINBOW system | done |
| [`03-chapter-5-pixie.md`](03-chapter-5-pixie.md) | The PIXIE subsystem — the big one, incl. §5.7 other implementations | done |
| [`04-chapters-6-7.md`](04-chapters-6-7.md) | Translator systems; control systems (the Titan analysis pipeline) | done |
| [`05-chapters-8-9.md`](05-chapters-8-9.md) | Circuit design (the two-teletype figures); appraisal & future | done |
| [`06-references-appendices.md`](06-references-appendices.md) | References; graph/grammar definitions; RAINBOW manual excerpts | done¹ |
| [`07-appendix-4-pixie-user-manual.md`](07-appendix-4-pixie-user-manual.md) | **The PIXIE User Manual** (pp. 187–209) | done |
| `drafts/` | Raw subagent transcription drafts (kept for diffing) | — |

¹ Two small honest gaps remain: the printed List of Figures (pp. vii–ix; every figure is
captioned inline where it occurs) and the last page of Appendix 3 (p. 186). The scan has
both.

## Process

Same pipeline as the [assembler listing transcription](../../pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md),
tuned for prose: pages rasterized at 200 dpi, transcribed from images by nine
`composer-2.5-fast` subagents against [`scripts/TRANSCRIPTION-SPEC.md`](../scripts/TRANSCRIPTION-SPEC.md)
(typewritten prose doesn't need Fable-grade octal discipline), then assembled and
annotated in an editorial pass. Page markers `<!-- p.NN / pdf.MMM -->` key every
paragraph back to the scan.

## What we hunted for — and found

- **The nightly workflow** — [interview question 4b2](../../../ideas.md) answered by
  Figs 8.6/8.7: one printout from the PDP-7 teletype (PIXIE session ending in `TIT`),
  one from the Titan teletype (`SET RAINBOW`, `COMPACT`, `PLOT`, `CONN`, `LADAN`).
  Two teletypes, two chairs.
- **The Titan-side applications** — chapters 4, 6–8: CONN/CONNMAP/REPLACE/JOINUP/PLOT/
  GRAPH plus the HLFC→HLSE→HLNY control-system pipeline and the LADAN/CANOTRAN circuit
  analysers — the programs whose endpoints "verbed" the
  [link protocol](../../pdp7-reference/TITAN-LINK-PROTOCOL.md)'s otherwise verbless
  transfers.
- **Satellite graphics doctrine** — §3.3.3/3.3.4 argue the client/server split the
  [emulation plan](../../pdp7-reference/EMULATION-PLAN.md) is rebuilding; §3.2.2 defines
  interactivity as signalling rate around the man-machine loop.
- **The PIXIE User Manual** (Appendix 4) — operating instructions for the resurrection
  bench, including load-from-link vs load-from-paper-tape and the error NOTE codes that
  match `PXER1/2/3` in the recovered octal.
- **Bonus finds** — §5.7: PIXIE also ran at RCA Labs Princeton, the Institute of
  Computer Science London (INDRA PDP-9 port), and the DTI CAD Centre; §9: a measured
  session cost 5–10% CPU, and Fig 9.4 sketches four CRTs on one controller; the RAINBOW
  MEMO series (RM No. 8–41) surfaces as a new archival wishlist item.

↑ [thesis README](../README.md) · [character README](../../../README.md)

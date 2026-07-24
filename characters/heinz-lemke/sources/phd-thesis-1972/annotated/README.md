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
| `01-chapters-1-2.md` | Part 1: Introduction; Integrated CAD (BCPL, RSP) | drafting |
| `02-chapters-3-4.md` | Man-machine interaction (satellite graphics!); the RAINBOW system | drafting |
| `03-chapter-5-pixie.md` | The PIXIE subsystem — the big one | drafting |
| `04-chapters-6-8-applications.md` | Translator systems; control systems; circuit design | drafting |
| `05-chapter-9-appraisal.md` | Appraisal and future possibilities | drafting |
| `06-references-appendices.md` | References; graph/grammar definitions; RAINBOW manual | drafting |
| `07-appendix-4-pixie-user-manual.md` | **The PIXIE User Manual** (pp. 187–208) | drafting |
| `drafts/` | Raw subagent transcription drafts (kept for diffing) | — |

## Process

Same pipeline as the [assembler listing transcription](../../pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md),
tuned for prose: pages rasterized at 200 dpi, transcribed from images by nine
`composer-2.5-fast` subagents against [`scripts/TRANSCRIPTION-SPEC.md`](../scripts/TRANSCRIPTION-SPEC.md)
(typewritten prose doesn't need Fable-grade octal discipline), then assembled and
annotated in an editorial pass. Page markers `<!-- p.NN / pdf.MMM -->` key every
paragraph back to the scan.

## What we're hunting for

- **The nightly workflow** — evidence for [interview question 4b2](../../../ideas.md):
  did Heinz drive Titan from a teletype while PIXIE held the model on the PDP-7?
- **The Titan-side applications** (chapters 7–8) — the programs whose behavior "verbed"
  the [link protocol](../../pdp7-reference/TITAN-LINK-PROTOCOL.md)'s otherwise verbless
  transfers.
- **Satellite graphics doctrine** (3.3.3/3.3.4) — the 1972 argument for the
  client/server split the [emulation plan](../../pdp7-reference/EMULATION-PLAN.md) is
  rebuilding.
- **The PIXIE User Manual** (Appendix 4) — the operating instructions for the
  [resurrection bench](../../pdp7-reference/EMULATION-PLAN.md).

↑ [thesis README](../README.md) · [character README](../../../README.md)

# Pie Menu Timeline (Medium, Feb 2019)

**Author:** Don Hopkins · **Published:** Feb 11 2019 · 111-min read
**URL:** https://medium.com/@donhopkins/pie-menu-timeline-21bec9b21620

Dated primary-source timeline 1968–2018, built from Don's archived email. The evidentiary
backbone under the retrospective — most dates below are from quoted period email.

## Prehistory

| Date | Event |
|------|-------|
| 1968-12-09 | Engelbart Mother of All Demos; chord keyset (direction/combination input); Landau interviews — "make everything as modular as possible" |
| 1969 | **PIXIE** (Wiseman, Lemke, Hiles) — control lightbuttons around tracking cross; legal-actions-only display; rotating-switch sets. Wiseman notes: S/L/F/W-X-Y drawing-mode buttons |
| 1984 | **Lyn Bartram, U Waterloo** — hexagonal menus in lab paint programs since '84; "stir" clockwise/counterclockwise to adjust continuous values (hue/saturation/value). Her 1988 letter to Don quoted in full |

## Origin arc 1986–1988 (email-dated)

| Date | Event |
|------|-------|
| 1986-04-13 | **Theta menus idea** — brainstorm with Mike Gallaher about Emacs UI. **Neither knew of PIXIE** — independent invention; Don discovered PIXIE in his own subsequent research and cited it in his paper references |
| 1986-05-18 | Theta Menus email Don → Weiser (founding document) |
| 1986-05-19 | Weiser → HCIL: muscle memory "zig-zag-zig-zig-zag" |
| 1986-05-29 | Shneiderman: "you are on to something… Go to it" |
| 1986-06 | X10 prototype; then theta-menu uwm window manager (mouse-ahead, display suppression, screen-edge + warp handling already) |
| 1986-09 | **Mitch Bradley suggests the name "pie menus"**; FORTH-programmable "fuwm"; PostScript pie printer on LaserWriter |
| 1986-11 | Experiment programmed in FORTH; Callahan runs it |
| 1986-12-02 | **Don finds the Wiseman PIXIE reference** (via Newman & Sproull) — self-addressed email from crayola.cs.umd.edu, receipt in archive. He then cited PIXIE in the 1988 technical-writing proposal bibliography, the piemenus.com references page, and every history since. (Buxton learned of PIXIE the same route — Newman & Sproull 1st ed — and only read Wiseman's papers in 2008.) |
| 1987-01 | Weiser snowed in, hacks pies into SunView for his SDI game |
| 1987-02→05 | UMD patent office excited; Weiser says delay Usenix abstract; **Don submits anyway (Mar 31), decides May 1987 not to patent** — publishes code and papers instead; "tell him to get stuffed" (Usenix email, Jun 11) |
| 1987-05-29 | First NeWS pie menus ("Very nice. Tell Mark." — Callahan) |
| 1987-08 | Terry Higgins' Pastel (National Film Board of Canada) at SIGGRAPH'87 — independent radial menus with click-ahead on SGI |
| 1987-11-24 | Pies accepted at SIGCHI'88 |
| 1988-04-10 | **UMD tech-writing proposal** cites Wiseman PIXIE 1969 in its bibliography — alongside three Buxton papers, Engelbart 1967, Newman 1968 — and describes mouse-ahead, muscle memory, and gesture chunking (credited to Buxton 1986). [The citation receipt](1988-04-10-umd-tech-writing-proposal.md) |
| 1988-05-14 | CHI'88 paper presented |

## Don's 1990 no-patent explanation (quoted in article)

UMD Office of Technology Liaison wanted him to stop publishing and sharing code so lawyers
could evaluate patentability; profits routed lawyers-first through an NC licensing firm; the
inventor last, with no say. *"I decided not to patent, and I am glad I made that decision."*
By Dec 1990 the publication clock had run out — pie menus unpatentable, and Don could
challenge anyone else's. At CHI'90 he met someone who'd abandoned his own similar idea for
fear of being sued — "the technological feeding frenzy… is even discouraging the application
of ideas that aren't proprietary!"

Direct foil to the Buxton/Alias arc — same era, opposite choice.

## Kurtenbach correspondence 1990 + 2018 (quoted in full)

- **1990-11-30**: Kurtenbach (PhD student, Buxton supervising) writes Don; Don: code freely
  redistributable, "the idea is not patented or proprietary… I encourage you to experiment."
- **1990-12-10**: Kurtenbach describes marking menus — simple directional marks as accelerator
  glyphs, ink trail, novice→expert transition — explicitly building on pie menus ("expert can
  mouse ahead like you've talked about but they get an ink trail"). **The receipts**: this
  exchange, plus Don's published 1987 ;login: summary and 1991 Dr. Dobb's article (mouse-ahead,
  rehearsal, browsing/reselection all documented), predate the 1993 paper and 1995 patent that
  claimed those features as marking-menu-unique.
- **2018-05-16**: Kurtenbach's simplified lineage: *"Neuman etc does the first 'circular
  menus' way back when → Hopkins etc does the pie menus version → Kurtenbach etc later adds
  the idea of a vocabulary of marks → Others build on this with Flow menus, Flower menus,
  SHARK…"* And on patents: "we were just following SGI corporate patent policy."

## Implementation river 1987–2018

NeWS Lite → SGI 4Sight overlay-plane subclass → NDE → TNT 2.0 (tab windows, pac-man
mouse-ahead feedback, spiral scrolling pies for John Gage) → PSIBER Space Deck → HyperLook
SimCity (talking pie menus) → TCL/Tk widget + piewm (X11, multiplayer SimCity, Unix World
best-of-1992) → ScriptX DreamScape → **The Sims** (1997–2000, head in center, linear
overflow) → ActiveX/OLE → JavaScript/DHTML → ConnectedTV Palm → OpenLaszlo SimFaux →
OLPC Sugar PyGTK → Micropolis → Unity3D → jQuery → VR (HyperJaunt, High Fidelity).

Also: Jobs/Bill Joy Educom demo (1988-10-25); CACM accepted-with-rewrite, never resubmitted
(unpublished "Pies" paper online); Norman/Hopkins Almaden exchange (1993) — "Linear menus
caused the meltdown. But the round menus put the fires out."; **Alan Kay → Don 2007** OLPC
SimCity letter (SimCity as "air-guitar environment"; wants child-readable rules — the
constructionist critique).

## Show beats

- 1986-12-02 self-email finding the PIXIE reference = the moment the lineage became known
  to its own continuation — 17 years before Don and Heinz ever spoke
- The contrast in prior-art conduct: Don found PIXIE **himself**, seven months after inventing
  theta menus independently, and put it at the top of his references forever after. The Alias
  patent filers distorted and buried theirs
- The not-patenting decision as the conscientious-objector move of 1987 — reads directly
  against Alias 1995 and Buxton FUD; also against Weiser's own patent enthusiasm (Feb 1987)
- Bartram's hexagonal "stir" menus and Higgins' Pastel — independent-invention cluster
  alongside Ingalls' Fabrik (see Alan Kay 2020 thread)
- Alan Kay 2007 OLPC letter — bridge from pie menus to Micropolis/constructionist episode

→ [`pie-menus-30-year-retrospective.md`](pie-menus-30-year-retrospective.md) ·
[`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`2020-02-alan-kay-pixie-pie-menus-thread.md`](2020-02-alan-kay-pixie-pie-menus-thread.md) ·
[PIXIE show](../../../repo-shows/pixie-pie-menus-pdp7.yml)

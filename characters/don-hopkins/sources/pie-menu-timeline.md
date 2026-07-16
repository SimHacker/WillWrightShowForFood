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
| 1986-06 | **X10 prototype** — standalone pie menu, no window manager yet: **mouse-ahead out of the box**. Then theta-menu **uwm window manager**: mouse-ahead **display preemption**, screen-edge handling with **cursor warping**, **nested submenus to any depth**, **browsing and reselection**. All on video (X10 wm demo shown at BayCHI'98); **source survives** in Don's archive. Every feature later claimed as marking-menu-unique was running in 1986, before any publication by anyone |
| 1986-09 | **Mitch Bradley suggests the name "pie menus"**; FORTH-programmable "fuwm"; PostScript pie printer on LaserWriter |
| 1986-11 | Experiment programmed in FORTH; Callahan runs it |
| 1986-12-02 | **Don finds the Wiseman PIXIE reference** (via Newman & Sproull) — self-addressed email from crayola.cs.umd.edu, receipt in archive. He then cited PIXIE in the 1988 technical-writing proposal bibliography, the piemenus.com references page, and every history since. (Buxton learned of PIXIE the same route — Newman & Sproull 1st ed — and only read Wiseman's papers in 2008.) |
| 1987-01 | Weiser snowed in, hacks pies into SunView for his SDI game |
| 1987-02→05 | UMD patent office excited; Weiser says delay Usenix abstract; **Don submits anyway (Mar 31), decides May 1987 not to patent** — publishes code and papers instead; "tell him to get stuffed" (Usenix email, Jun 11). Don 2026: "I DO NOT regret that" — the [no-patent dividend](pie-menu-fud-misconceptions.md): Sun, DUX, Maxis, EA, ConnectedTV and beyond, penny-license legal-fee math, advice to students |
| 1987-05-29 | First NeWS pie menus ("Very nice. Tell Mark." — Callahan) |
| 1987-06-04 | **`pixie` file written** in the piepaper directory — UMD library call number TA174.I47 1969 Folio, full citation. Second link in the [PIXIE chain of custody](1988-04-10-umd-tech-writing-proposal.md), datestamped at donhopkins.com/home/piepaper/ |
| 1987-07-01 | **`piemenu.ps` posted to NeWS-makers** — earliest published free-software receipt: announcement names mouse-ahead, "Things to do" comment specifies display suppression, UNRESTRICTED-use license with poem. [The code receipt](1987-07-01-news-pie-menus-source-release.md) |
| 1987-08 | Terry Higgins' Pastel (National Film Board of Canada) at SIGGRAPH'87 — independent radial menus with click-ahead on SGI |
| 1987-11-24 | Pies accepted at SIGCHI'88 |
| 1988-03-23 | `references` file — PIXIE entry "[Referenced in Principles of Interactive Computer Graphics]"; next chain link |
| 1988-04-10 | **UMD tech-writing proposal** cites Wiseman PIXIE 1969 in its bibliography — alongside three Buxton papers, Engelbart 1967, Newman 1968 — and describes mouse-ahead, muscle memory, and gesture chunking (credited to Buxton 1986). [The citation receipt](1988-04-10-umd-tech-writing-proposal.md) |
| 1988-05-14 | CHI'88 paper presented |
| 1988-11-02 | **Weiser email: CACM accepts the "Pies" paper** — "a year and half later!" — wanting a minor rewrite (deemphasize experiment, make it a feature article). Never resubmitted: Weiser at PARC, too much had changed; DDJ Dec 1991 became the definitive publication instead |
| 1989-02-14 | `piepaper.comments` CACM-draft outline carries the "; pixie reference" TODO — intent to cite PIXIE in the never-finished rewrite, on disk and datestamped |

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

## Dispute arc 1993–2019 (email-dated)

| Date | Event |
|------|-------|
| 1993-01 | **Kurtenbach/Sellen/Buxton paper** (Journal HCI) claims marking menus "unique" in easing the novice→expert transition — contradicted by the 1990 email, the 1987 announcement and code, and the DDJ 1991 article. [Claim-by-claim analysis](kurtenbach-sellen-buxton-1993-claims-analysis.md) |
| 1995 | **US 5,689,667 filed** (Kurtenbach, at SGI/Alias) — radial + linear overflow combo; prior-art passage misdescribes pie menus (selection by location; submenu popup by distance) |
| 1995-06-06 / 1997-04-01 / 1999-07-20 | **US 5,926,178** (Kurtenbach) — "displaying and controlling menus with radial and linear portions"; priority / filing / issue. Same radial+linear family; later named in the zLab About box with 5,689,667 |
| ~1997–98 | **GDC trade-show encounter**: Kinetix recites the "patented marking menus" FUD (nobody there had read the patent); Alias salesman blurts "OF COURSE THEY ARE!"; Don phones Buxton from the show floor within the hour; Buxton: "there is no marking menu patent." [The 66-point timeline](2019-02-buxton-apology-demand-gdc-timeline.md) |
| 2000 | **zLab 1.0 About box** asserts in-product: "Marking Menus are protected by U.S. Patents #5,689,667 and #5,926,178" — [screenshot](../media/zlab-2000-about-box-marking-menu-patents.png) from Alias Z-Ray promo ([dKaXJ14BkjA](https://www.youtube.com/watch?v=dKaXJ14BkjA)) |
| 2000-07-05 | **Slashdot post** — Don publishes the full FUD story ("a textbook example of successful FUD") in the GUI-research thread; the first public write-up of the GDC encounter |
| 2001-12 | piemenus.com references page (archived) carries the public warning: "Alias\|Wavefront lawyers will threaten to sue you if you use 'marking menus'… I think their marking menu patent is probably invalid, and they know it" |
| 2008-05-16→17 | Dave Fleck asks Don for the PIXIE paper ("You have the reference on you web site"); Don forwards to Buxton, who promises to scan and share it |
| 2008-06-03 | **Buxton's "conversation over" email** — the "not crediting Weisman until you learned about him from us" accusation, "the most fundamental paper in the field," "Over and out forever" |
| 2008-06-05 | Don answers Buxton's "show me a single patent" challenge with the live Autodesk "Patented marking-menu technology" page and **US 6,915,492** (zoned menu). Buxton: "please stop emailing me" |
| 2008-07-07 | Buxton's Cambridge PIXIE findings email goes to Kurtenbach, Newman, Lemke, Fleck — **not Don**; Fleck forwards it. The promised copy of the paper never comes |
| 2018-05-14 | **Plaisant's "mousy" recollection**: marking-menu crew argued "no publication" for mouse-ahead and misinterpreted the separate-window demo as an always-visible menu; she cites HCIL-90-02's verbatim "mouse ahead display suppression" |
| 2018-05-15→18 | **Kurtenbach exchange**: "Yes, I was aware that pie menus could do mouse-ahead in 1990"; distinction shrinks to the ink trail; "typical pie menus" admitted to be Alias in-house naive reimplementations; "given that Max was the main rival, we didn't want to do them any favors." [The retract-or-clarify thread](2018-05-kurtenbach-retract-or-clarify-exchange.md) |
| 2018-05-15 | **30 Year Retrospective + FUD and Misconceptions published** on Medium — the 30th anniversary window of the CHI'88 presentation |
| 2019-02-07→08 | Lecture-prep emails to Brad Myers assemble the full PIXIE chain of custody with donhopkins.com URLs; Weiser's 1988 CACM-acceptance email recovered |
| 2019-02-09 | **Apology demand to Buxton** (Cc Kurtenbach, Myers, Shneiderman, Callahan) — publication notice cleared with Mike Godwin, explicit release for Kurtenbach, the 66-point GDC timeline. No reply, retraction, or evidence ever came. [The letter](2019-02-buxton-apology-demand-gdc-timeline.md) |
| 2019-02-11 | **Guest lecture at CMU** — Brad Myers's 05-640 Interaction Techniques class; Pie Menu Timeline published on Medium the same day |

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

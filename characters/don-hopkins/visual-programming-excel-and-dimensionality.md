# Visual programming — Excel, dimensionality, SimAntics, PSIBER

Don's thread on Brad Myers's 1989 VPL critique ([HN 22978454](https://news.ycombinator.com/item?id=22978454), Apr 2020 — metaobject.com).

**Primary letter:** [`../michael-mcguffin/sources/2022-10-08-don-visual-programming-letter.md`](../michael-mcguffin/sources/2022-10-08-don-visual-programming-letter.md) (Don → Michael McGuffin, Oct 2022)

Companion to [`visual-programming-taxonomy.md`](visual-programming-taxonomy.md) (boxes/lines models) and
[`drakon-control-flow-vs-dataflow.md`](drakon-control-flow-vs-dataflow.md) (SimAntics control flow).

## SimAntics as counterexample

When skeptics said VPLs are only for chatbots and non-programmers, Don pointed at **SimAntics** — shipped
in The Sims, used by modders and in Ken Forbus's game-design course.

- [Pie menu + SimAntics demo (YouTube)](https://www.youtube.com/watch?v=-exdu4ETscs)
- [Steering Committee demo, Jun 1998](https://www.youtube.com/watch?v=zC52jE60KjY)
- Wikis: [Mod The Sims](https://modthesims.info/wiki.php?title=SimAntics) · [simantics.wikidot.com](http://simantics.wikidot.com/)
- Forbus course notes: [Under the hood](http://www.cs.northwestern.edu/~forbus/c95-gd/lectures/) · [Programming Objects](http://www.qrg.northwestern.edu/papers/Files/Programming_Objects_in_The_Sims.pdf)

SimAntics is **control-flow oriented, imperative** — visual assembly with implicit VM state on the wires
(same thesis as DRAKON thread).

## C32 and Brad Myers

Don cited **C32** — Brad's 1991 Garnet spreadsheet-constraints-by-demonstration system — as follow-on
work after the 1989 paper:

- Paper: [Graphical Techniques in a Spreadsheet for Specifying User Interfaces (CHI'91)](https://www.researchgate.net/publication/221518856_Graphical_Techniques_in_a_Spreadsheet_for_Specifying_User_Interfaces)
- Demo: [C32 Spreadsheet 1991 (YouTube)](https://www.youtube.com/watch?v=IsINJ8mlD5A)
- Acronym hall of fame: [Brad's acronyms page](http://www.cs.cmu.edu/~bam/acronyms.html) (Don's contribution: **GLASS**)

→ [`../brad-myers/ideas.md`](../brad-myers/ideas.md)

## Excel is a VPL (dimensionality thesis)

Don's central argument: **visual vs textual is about syntax topology, not popularity or editor chrome.**

| Language class | Structure | Examples |
|----------------|-----------|----------|
| Textual | 1D character stream | C++, Ruby, PostScript source |
| Visual | 2D+ graph or grid | Excel, Max/MSP, Snap!, SimAntics |

- **Excel** — 2D grid, relative/absolute cell refs, continuous recalc, macro recorder (programming by demonstration). Most-used "programming language" on Earth by many measures.
- **Vi** — the *V* is "visual mode" of `ex`, but that does not make C++ a VPL; the *language* remains 1D text.
- **Visual Studio / PSIBER Space Deck** — visual *tools* for textual languages; they do not change the language's dimensionality.

Challenge Don posed: define "VPL" to exclude Excel without also excluding Max/MSP, Snap!, or spreadsheets-as-VPL research — without gerrymandering "primary editing mode."

Don linked **Programming by Demonstration** (Brad, Cypher et al.) and **Watch What I Do** ([archive.org](https://archive.org/details/watchwhatido00alle), [acypher.com/wwid](http://acypher.com/wwid)) — Excel's macro recorder as end-user PbD.

## PSIBER Space Deck

Visual debugger/UI for **NeWS** PostScript — not a visual *language*, a visual *environment* for a textual one:

- [The Shape of PSIBER Space (Medium)](https://medium.com/@donhopkins/the-shape-of-psiber-space-october-1989-6bcdf7a3a1f5)
- NeWS = multitasking object-oriented PostScript; PSIBER navigates live heap, processes, and programs
- **Pseudo Scientific Visualizer** — 2D object browser inside PSIBER (Monterey); Don later hacked a
  **3D GL** version into Dave Tristram's **Electropaint** on an **SGI at UMD** (recursive **s-expr**
  trees, not linear histories). See [`../dave-tristram/raster-masters-panel-library.md`](../dave-tristram/raster-masters-panel-library.md)
  · [JSONsters](jsonsters/README.md) lineage

Same distinction as Visual Studio vs C++: representation of the language ≠ skin you edit it with.

## Bret Victor / Engelbart line

Don cited Bret Victor's "Future of Programming" and "Inventing on Principle" ([HN 16315328](https://news.ycombinator.com/item?id=16315328)) — continuous reactive evaluation (Excel-like) vs batch compile-run.

## Show hooks

| Pairing | Topic |
|---------|-------|
| **Michael McGuffin** | Oct 2022 letter recipient; VPL debate moderator candidate | [`../michael-mcguffin/README.md`](../michael-mcguffin/README.md) |
| **Brad Myers** | C32 + Garnet + 1989 vs 2020 VPL debate — live Excel-as-VPL demo |
| **Will Wright** | SimAntics shipped — "evidence" argument with sales numbers |
| **Jamie Doornbos** | SimAntics architecture from the architect |
| **Ken Forbus** | Teaching SimAntics in Northwestern game-design course |

## Trail links

- [`../../process/trails/visual-programming-patch-cord.md`](../../process/trails/visual-programming-patch-cord.md)
- [`visual-programming-taxonomy.md`](visual-programming-taxonomy.md)
- [`yahoo-pipes-successors.md`](yahoo-pipes-successors.md) — data-flow pipes lineage

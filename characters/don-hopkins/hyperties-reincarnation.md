# HyperTIES — a pixel-perfect living-emulator reincarnation (proposal) 🔗🖥️

*A proposal to reincarnate **HyperTIES** — Ben Shneiderman's UMD HCIL hypermedia browser, and the
NeWS/PostScript version Don built — **pixel-perfect in the web browser**, as a living emulator. A
salute + documentation project with **[Ben Shneiderman](../ben-shneiderman/README.md)**, who'd love it:
we've talked about documenting our work, and a living emulator is the best documentation there is.*
[Portrayal standards](../../schemas/portrayal-standards.md) ·
Media: [hyperties/](media/hyperties/) · Trail: [augmentation-and-hypertext](../../process/trails/augmentation-and-hypertext.md)

## Why

HyperTIES was one of the first hypertext systems with **highlighted, selectable embedded links** —
Ben Shneiderman's HCIL invention, and the ancestor of the highlighted hyperlink everyone clicks
today. Don built the **NeWS/PostScript** version, which **embedded interactive PostScript applets in
hypermedia pages** — executable objects on a page, years before web applets (the reason Don's note on
the [road-pizza diagram](media/hyperties/hyperties-road-pizza-diagram.yml) reads *"PS: Fuck Eolas!"* —
prior art). It deserves to run again, exactly as it looked and felt.

## What Don has (the source layers)

This is the rare case where the reincarnation is *fully sourced* — Don has kept it all:

- **Forth** — low-level pieces of the stack.
- **MockLisp** — the extension language (Gosling-Emacs lineage; the NeMACS/Emacs integration).
- **C** — the core engine.
- **HyperTIES markup language** — the page/authoring format.
- **Documentation** — the manuals and design docs.
- **NeWS PostScript** — the display/interaction layer and the embedded PostScript applets.
- **Databases → XML** — Don already **converted the HyperTIES databases to XML** (web-ready content).

**"All I need to reincarnate it pixel-perfect in the web browser."** The pieces exist; this is
reassembly + a modern host, not archaeology from scratch.

## The reincarnation plan — a living emulator

Goal: **pixel-perfect, interactive, in the browser** — not a screenshot museum, a *running* system.

1. **Content:** serve the **XML-converted databases** directly; render the **HyperTIES markup** with a
   faithful renderer (fonts, layout, highlighted embedded links exactly as they were).
2. **Display layer:** run the **NeWS PostScript** — the truest path to *pixel-perfect*. Options to
   weigh on air: a **PostScript interpreter in the browser** (Ghostscript-to-WASM, or a JS PS
   interpreter), or a **NeWS-in-the-browser** reimplementation (canvas/WebGL backend speaking the NeWS
   imaging model). The embedded **PostScript applets** run as they did — live objects on the page.
3. **Behavior:** port the **MockLisp/Forth/C** logic (by hand and with AI) or interpret it, whichever
   gets fidelity fastest; keep the authoring + browsing semantics intact.
4. **Living, not frozen:** it browses, it links, the applets animate — a **runnable artifact** anyone
   can open, fork, and learn from.

## Documenting the work — with Ben

Ben and Don discussed **documenting their work**. A **living emulator is the documentation**: the
paper explains the idea; the running system *is* the idea. The show writes both at once — narrate the
history (HCIL, embedded menus, the NeWS applets, the road-pizza architecture with **Catherine
Plaisant**), then bring it up live and click around the real thing.

## Existing artifacts in this repo (the seed)

- [`media/hyperties/hyperties.yml`](media/hyperties/hyperties.yml) — the overview.
- [Road-pizza architecture diagram](media/hyperties/hyperties-road-pizza-diagram.yml) — drawn on a
  Xerox Star (Viewpoint) with Catherine Plaisant & Ben.
- [The NeWS Tape browser](media/hyperties/hyperties-news-tape-browser.yml) — Gosling CHED tour, Kanji
  demo, Big Brother eye.ps, pie menu.
- [NeMACS/HyperTIES shell](media/hyperties/nemacs-hyperties-shell.yml) and the
  [Hubble pop-out components](nemacs-hyperties-news-hubble.yml) demo Ben cites.

## Neighbors & lineage

- **[Ben Shneiderman](../ben-shneiderman/README.md)** — HyperTIES director; documenting-our-work partner.
- **NeWS reunion** — [`repo-shows/INDEX.yml`](../../repo-shows/INDEX.yml):
  James Gosling, David Rosenthal, Arthur van Hoff, Owen Densmore — HyperTIES rode on NeWS; "send a
  program, not a data structure" is the same PostScript-applets idea.
- **Hypertext forebears** — [augmentation-and-hypertext trail](../../process/trails/augmentation-and-hypertext.md):
  Engelbart, Ted Nelson (transclusion), Hugh Daniel (Xanadu + NeWS).
- **Sibling reincarnations** — same "bring it back pixel-perfect in the browser" spirit as
  [Rebounce](rebounce.md) (Bounce) and the [CAM6](cam6-cellular-automata-machine.md) rebuild; part of
  the broader [reincarnate-old-systems](snap-visual-engines-fundable-goals.md) energy.

## Reference links

- UMD HCIL HyperTIES history: <http://www.cs.umd.edu/hcil/hyperties/>
- Wikipedia: [HyperTIES](https://en.wikipedia.org/wiki/HyperTIES) ·
  [NeWS](https://en.wikipedia.org/wiki/NeWS) ·
  [PostScript](https://en.wikipedia.org/wiki/PostScript)

## Status

Proposal + seed artifacts live; sources in Don's hands; consent **not yet asked** of Ben. Next action:
scope the display-layer path (PS-in-WASM vs NeWS-reimpl) and stand up a first page rendering from the
XML + markup.

*Status: firsthand proposal — the system was real and Don's role real; the browser reincarnation is a
goal, not yet built. Treat exact dates/versions as pointers to confirm with Ben on air.*

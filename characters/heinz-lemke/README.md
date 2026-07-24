# Heinz U. Lemke

Invitation portrayal — **not** Heinz U. Lemke. [Standards](../../schemas/portrayal-standards.md)

**Field:** PIXIE (1969) — earliest known radial/pie menus on PDP-7/Titan; CARS / model-guided medicine

Co-authored **PIXIE** with Neil E. Wiseman and John O. Hiles at Cambridge (1969). Don's warm
correspondence (~2020–present): Chapman film recovery, *Flight of the PIXIE*, CARS workshops,
Black Forest visits. **ASAP Repo Show:** Heinz + **Lars Brinkhoff** (PDP-7/340 emulation) +
**David Rosenthal** (same Cambridge stack ~1970) — [`invitation.md`](invitation.md)
*(send-ready draft)*.

## Start here

New to this room? Three doors, pick by appetite:

1. **The story** — [Back to the Roots (Part 1, 1967)](sources/1967-back-to-the-roots-part1.md):
   Heinz's own origin memoir — the Plessey "spy" accusation, the handwritten design doc, the
   Wilkes talk, the PhD offer.
2. **The machine** — [the turist guide](sources/pdp7-reference/GUIDE.md): PDP-7, Type 340
   display, Titan mainframe, light pen, and why a display can *add instructions* to a computer.
3. **The code** — [the recovered PIXIE assembler listing](sources/pixie-assembler-listing-1972/README.md):
   ~5,000 words of commented 1972 PDP-7 assembly, OCR'd back to runnable text.

## The arc — 1967 to resurrection

The documents in this room tell one continuous story:

- **10 Mar 1967 — the seed.** A handwritten systems-analysis document
  ([scan + facsimile + transcript](sources/1967-03-10-system-analysis/README.md)) sketches a
  two-computer interactive CAD system *before* Heinz reached Cambridge. Wilkes saw these pages;
  a PhD followed.
- **1969 — PIXIE runs.** Light pen, radial control buttons traveling with the tracking cross,
  circuits drawn on a PDP-7 and analysed on Titan. Covered by
  [*Electronics* magazine, 28 Apr 1969](sources/electronics-international-1969-04-28-pixie.md);
  filmed the same year ([film notes + YouTube](media/film-1969/README.md), and
  [*Flight of the PIXIE*](cambridge-films-flight-of-the-bumblebee.md) — the Chapman digitization
  set to [Yuja Wang](../yuja-wang/README.md)'s Bumblebee).
- **Mar 1972 — the thesis.** *Interactive Graphics in an Integrated CAD System* — fully
  transcribed and intertwingled as an
  [**annotated 8-part edition**](sources/phd-thesis-1972/annotated/README.md): satellite-graphics
  doctrine, the RAINBOW ecology on Titan, the two-teletype workflow in Figs 8.6/8.7, and
  Appendix 4, the **PIXIE User Manual**.
- **Jan/Feb 1972 — the listing.** The complete PIXIE source as lineprinter output,
  [recovered by LLM transcription](sources/pixie-assembler-listing-1972/README.md) into aligned
  listings, clean `.asm`, and an octal memory image — with a
  [research report](sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md) on how, what it
  cost, and what broke.
- **2026 — the dig.** The [email storyline threads](sources/THREAD-INDEX.md) with Heinz, Roy
  Eagleson, and friends; the
  [Facebook guessing game](sources/2026-07-24-facebook-guessing-game.md) that identified the
  mystery listing pages; the [TTY film-loop idea](sources/2026-07-24-tty-film-loop-titles.md)
  that became the diegetic terminal emulator concept.
- **Next — resurrection.** The [emulation plan](sources/pdp7-reference/EMULATION-PLAN.md):
  SIMH lab bench, browser bench, virtual light pen, WebGPU phosphor, and a reimplemented
  [PDP-7 ↔ Titan link](sources/pdp7-reference/TITAN-LINK-PROTOCOL.md). Target:
  **CARS 2027 Berlin, 29 June** — see [pixie-source-recovery.md](pixie-source-recovery.md).

## For students, hackers, and turists 🎓

Everything needed to run 1969 yourself, in reading order (spelled *turist* per
[MIT AI Lab tradition](sources/pdp7-reference/GUIDE.md) — guests welcome to log in and explore):

1. [**GUIDE.md — the turist guide**](sources/pdp7-reference/GUIDE.md). Orientation: PDP-7
   architecture, how IOT instructions let devices extend the instruction set electrically, the
   Type 340 as a second computer on the same memory, Titan's extracodes, and the ITS lore behind
   "turist."
2. [**The reference library**](sources/pdp7-reference/README.md). Mirrored bitsavers manuals with
   public URLs: PDP-7 User Handbook, assembler and DDT manuals, interface manual, the
   **H-340 Type 340 display manual**, light-pen diagnostics, and the Type 30 manual for
   PDP-1-vs-PDP-7 display lineage.
3. [**The PIXIE User Manual**](sources/phd-thesis-1972/annotated/07-appendix-4-pixie-user-manual.md)
   (thesis Appendix 4). The actual operating instructions: load paths, console switches, the
   twelve light buttons, the six cursor-attached controls, the `TITAN` command, the error NOTEs.
4. [**The code artifacts**](sources/pixie-assembler-listing-1972/README.md). Aligned listings
   (`symelec-listing.txt`, `rsppix-listing.txt`), clean `rsppix.asm`, octal `rsppix.oct` — plus
   the [transcription spec](sources/pixie-assembler-listing-1972/scripts/TRANSCRIPTION-SPEC.md)
   if you want to audit or extend the recovery.
5. [**The emulation plan**](sources/pdp7-reference/EMULATION-PLAN.md) and
   [**the link protocol decode**](sources/pdp7-reference/TITAN-LINK-PROTOCOL.md). The mission
   briefs: assemble PIXIE (local clones of `simh` and `pdp7-unix` with its `as7` cross-assembler
   live in `~/GroundUp/git/`), light up the 340, build the virtual light pen, stub the Titan.
6. [**The annotated thesis**](sources/phd-thesis-1972/annotated/README.md) when you want the
   *why* behind the code — especially
   [Chapter 5](sources/phd-thesis-1972/annotated/03-chapter-5-pixie.md) (the PIXIE subsystem) and
   [Chapters 3–4](sources/phd-thesis-1972/annotated/02-chapters-3-4.md) (satellite-graphics
   doctrine and the RAINBOW ecology).

**The classroom connection:** [**Roy Eagleson**](../roy-eagleson/README.md) (Western University)
teaches HCI history anchored on Sketchpad and has students **re-implementing PIXIE** as the same
exercise — rediscover data structures, reinvent OOP from the bottom up, sometimes at assembly
level ([UWO project thread](../roy-eagleson/sources/2026-07-14-uwo-pixie-reimplementation.md) ·
[Sketchpad → PIXIE lineage essay](../roy-eagleson/sketchpad-to-pixie-lineage.md)). Presentation
target: **CARS 2027 Berlin HCI session, 29 June 2027**. Related educational rooms:
[Ivan Sutherland](../ivan-sutherland/) · [Kelly Booth](../kelly-booth/) ·
[Maurice Wilkes memorial](../maurice-wilkes/memorial.md) — and
[Andrew Armit](../andrew-armit/)'s archive for the Cambridge CAD Group's parallel surface-design
line.

## Primary sources

| Year | Document | Where |
|------|----------|-------|
| 1967 | Handwritten system analysis (the pages Wilkes saw) | [scan + facsimile + transcript](sources/1967-03-10-system-analysis/README.md) |
| 1969 | *Electronics* magazine PIXIE article | [notes](sources/electronics-international-1969-04-28-pixie.md) |
| 1969 | PIXIE films (Chapman digitization) | [media/film-1969/](media/film-1969/README.md) |
| 1969 | Heinz's US lab tour agenda | [notes](sources/heinz-1969-us-lab-tour.md) |
| 1972 | PhD thesis, 219 pp — annotated 8-part edition | [annotated/](sources/phd-thesis-1972/annotated/README.md) |
| 1972 | Complete assembler listing, 128 pp — recovered text | [pixie-assembler-listing-1972/](sources/pixie-assembler-listing-1972/README.md) |
| 2008 | Bill Buxton "memory lane" PIXIE letter | [notes](sources/2008-bill-buxton-pixie-memory-lane.md) |
| — | Newman & Sproull ref 520 "movable menu" citation | [yml](sources/newman-sproull-ref-520-movable-menu.yml) |

## Correspondence and threads

[**Thread index**](sources/THREAD-INDEX.md) — the 2026 storyline in installments (origin story,
listing offer, UWO students, delivery of the scans, Facebook guessing game, TTY film-loop).
Also: [correspondence digest](correspondence.md) · [from Alan Kay](from-alan-kay.yml) ·
[PIXIE constellation](pixie-constellation.yml).

## Working documents

[Interview ideas](ideas.md) (incl. the two-teletypes nightly-workflow question — now
pre-confirmed by thesis Figs 8.6/8.7) · [source recovery plan](pixie-source-recovery.md) ·
[pull-in gaps](pull-in-gaps.md) (open: RAINBOW MEMO series, Wiseman notes, seminar attachments) ·
[show seed](../../repo-shows/pixie-pie-menus-pdp7.yml) · Don's pie-menu history:
[`../don-hopkins/pie-menus-chi-88-and-beyond.md`](../don-hopkins/pie-menus-chi-88-and-beyond.md)

Verifiable sources in `CHARACTER.yml`. Subject may request correction or removal anytime.

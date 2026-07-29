# PIXIE thread — 28 July 2026 (Oldfield → Michie; PDP-8/9; Roy loads SIMH)

**Subject:** Re: PIXIE/Rainbow, Sketchpad, and Object-Oriented Design  
**Span this day:** Heinz → Don (Duckmouse / Robot Olympics) → Alan (Wes Clark, Popplestone, Bletchley) → Roy (SIMH progress)

[Portrayal standards](../../../schemas/portrayal-standards.md) · Index: [`THREAD-INDEX.md`](THREAD-INDEX.md)

---

## Heinz → Roy (11:25) — architecture + why the thesis grew

**PDP-8 vs PDP-7** (Heinz's memory): PDP-8 *not* a compatible extension of PDP-7; **PDP-9** (18-bit, similar registers) was.  
**Correction on the same day:** Alan Kay — PDP-8 is a **12-bit** machine (commercial follow-on to Wes Clark's LINC), not 16-bit. → [`../../alan-kay/sources/2026-07-28-wes-clark-pdp8-popplestone.md`](../../alan-kay/sources/2026-07-28-wes-clark-pdp8-popplestone.md)

**How long for ~7500 lines?** ~**3 years** for PIXIE + some BCPL for Titan. Writing instructions was half the battle; **debugging the real-time system** was the main problem — bit patterns in PDP-7 CPU and I/O registers at the moment of failure (e.g. sudden black screen). *"The dimension of time was the critical variable of the inner life of PIXIE."*

**London University cleanup:** Peter Kirstein's team used PIXIE on a **PDP-9** as a course demo.  
Lowe, H.A. *"PIXIE, Use of a CRT Display on a Satellite Computer,"* MSc thesis, Institute of Computer Science, University of London, Sept. 1970.

**John Oldfield (Edinburgh / Michie Machine Intelligence group)** — after oral PhD exam end of 1970, examiner unhappy that PIXIE was documented mainly by **film + ~50 thesis pages**. Insisted on documentation so PIXIE could be **rebuilt later**, not only reloaded from punched paper tape (as at London). Heinz extended the thesis through 1971 to ~**210 pages**. *"Now of course, I am pleased I had to do this."*

→ Direct bridge: Oldfield ↔ Michie's Edinburgh orbit ↔ Don's Turing Institute / Duckmouse thread.  
→ Memorial character: [`../../donald-michie/`](../../donald-michie/)

---

## Don → Heinz + Cc (11:53) — Oldfield gift + Duckmouse + Robot Olympics

Fortunate that Oldfield insisted — the rebuildable thesis is what the PDP-7 emulator quest needs now. *"At least we don't need to write a virtual punched paper tape device, only a virtual light pen device."*

Don at Turing Institute **Feb–Sep 1992** with Pete Mowforth + Arthur van Hoff. Forwards Pete's **April 2026** Duckmouse clarifications + Robot Olympics lore. Asks Arthur to **photograph/scan the original Olympics poster** Pete gave him for his 60th birthday (reprint risk: Olympic Committee once threatened to sue over 1000 posters).

→ Pete seed: [`../../don-hopkins/media/turing-institute/2026-04-pete-mowforth-duckmouse.md`](../../don-hopkins/media/turing-institute/2026-04-pete-mowforth-duckmouse.md)  
→ Arthur ask: [`../../arthur-van-hoff/sources/2026-07-28-robot-olympics-poster-scan-ask.md`](../../arthur-van-hoff/sources/2026-07-28-robot-olympics-poster-scan-ask.md)

---

## Alan → Don (12:05, 12:50) — Michie, Popplestone, Bletchley visitability

Michie at Bletchley with Turing; character^2/^3: **Robin Popplestone** (Pop-2).  
Bletchley Park ~**1 hour train from London**; codebreaking museum + National Museum of Computing worth a full day; cafeteria has Tyrell's crisps.

→ [`../../alan-kay/sources/2026-07-28-wes-clark-pdp8-popplestone.md`](../../alan-kay/sources/2026-07-28-wes-clark-pdp8-popplestone.md)

---

## Don → Alan (12:19) — Turing silver / Will / Cryptonomicon geocache joke

Will wants to visit Bletchley. Don: bike + not-to-find-the-silver-bars pilgrimage (Hodges + Cryptonomicon chain-count bike). Urban-safari gag: crowd-sourced map of holes where detectors found nothing — *"Foursquare for holes in the ground"* (annoying to locals).

---

## Roy → Don/Alan (23:50) — **PIXIE loads in SIMH**

Canonical: [`../../roy-eagleson/sources/2026-07-28-simh-oct-to-rim-loaded.md`](../../roy-eagleson/sources/2026-07-28-simh-oct-to-rim-loaded.md)

Headline: `.oct` → `.rim` converter; loads into Supnik SIMH; **step works**; **GO stops with no display** — suspects missing light-pen interrupts. Next: light pen (X11 C vs web mouse). Lars's 340 routines in the picture.

---

↑ [THREAD-INDEX](THREAD-INDEX.md) · [EMULATION-PLAN](pdp7-reference/EMULATION-PLAN.md)

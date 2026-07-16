# Andrew Armit — barn archive manifest (16 July 2026)

**From:** andrew armit <andrew_armit@yahoo.co.uk>  
**Date:** 16 July 2026, 11:10 GMT+2  
**Subject:** Re: AW: AW: AW: Invitation to PIXIE/Rainbow Repo Show interview  
**To:** Roy Eagleson, Alan Kay, Heinz Lemke  
**Cc:** Lars Brinkhoff, Will Wright, Franziska Schweikert (CARS), Don Hopkins, Leo Joskowicz, Mario Cypko

Triggered by [Heinz 15 Jul](../../heinz-lemke/sources/2026-07-16-pixie-storyline-thread.md) on
PIXIE digitization + CARS 2027. Alan Kay replied same day praising Armit's dedication at Utah.

[Portrayal standards](../../../schemas/portrayal-standards.md)

---

## Alan Kay on Armit (context)

Kay (16 Jul): *"If anyone is qualified to define 'single minded and dedicated', it would most
certainly be you!"*

Earlier (10 Jul): months-long Utah visitor; Coons patch system on PDP-7; Kay *"quite in awe."*
→ [`alan-kay-utah-coons-patches.md`](alan-kay-utah-coons-patches.md)

Armit remembers Kay at Utah as *"single minded and dedicated."*

---

## Cambridge / PDP-7 era

### Multipatch

- **Full listings with octal**
- **PDP-7** and **Type 340 display** manuals
- Armit wrote **every instruction** so Multipatch could be **simulated** and new designs built

### Multiobject

- Used **Titan** (like PIXIE architecture)
- Full **machine-code source listings**
- **Pristine Titan manuals** + **extracode definitions** — simulatable

### Film — Multipatch

> *"There was also a film of Multipatch."*

When Armit visited **University of Utah** (with **Henri Gouraud**), they toured US sites with CAD
leanings — **the film was shown**.

**Show hook:** Don/Heinz film hunt now has primary witness + barn notes from when film was made.

---

## ICON — Lloyd's Register of Shipping (with Heinz)

Joint work with Heinz — see also:

- Lemke HU, Armit AP (1974): *Advanced software techniques in computer graphics*, GI 74
- Armit AP, Lemke HU (1975): *ICON, The interactive creation of NASTRAN data*, CAD Journal Vol 7 No 3

### What Armit has

- Design documents and letters
- **Majority of source code in assembler**
- **BCPL** used for translation from geometry to screen control
- Project history + **notes for when a film was made** (ICON film also likely existed)
- **PDP-11/45** manuals
- **Series 3 Vector General** manual (thinks he has it)
- Meeting records + performance discussions — *"complete snapshot of the interactions"*

### The 3D weekend rewrite

Via **WSEA**, Heinz involved Armit. Armit **refused a 2D system** as then proposed; insisted hardware
must be **PDP-11/45** + **Series 3 Vector General**.

Over a **weekend**, rewrote proposal to be **fully 3D**; offered via previous consultant for LRS
submission — consultant **declined to make it his**; Armit presented at the **grand meeting**:

> *"You have to understand that while you are paying for it, I am making it for myself."*

Caused surprise; upper management correctly read full engagement.

Structured beat: [`icon-lrs-3d-proposal.yml`](icon-lrs-3d-proposal.yml)

---

## TAG — British Aerospace / RAE / Wellworthy

~**100K lines assembler** on **PDP-11/70**:

- Ran in **supervisor mode** (5 **RSX** corrections by Armit)
- Armit's **demand-paged, demand-mapped** memory management — **64 Mbytes** address space vs 32K
  used by others
- Pure code, **multiuser**, full machine speed within 8 mapping-set constraints
- One set for interrupt into **MEGA** code; others for stack/PC; ~5 for data; 2K chunks moved
  disk ↔ physical ↔ mapped

Used **VG3400** — Armit corrected hardware and firmware → led to **Parallel Graphics Machine**.

Possessions: **writable control store panel** for VG3400, full docs + circuits, all source.

---

## Parallel Graphics Machine (PGM)

- Full documentation + source
- **Still has a machine** and **video of it working**

---

## Location / visit

Lives near Cambridge. Heinz planning a visit when logistics allow (mentioned 12 Jul).
# Village-level detail: DonHopkins green-room/locations.yml

---

## Simulation roadmap (preservation)

| Target | Prerequisites Armit claims to hold |
|--------|-----------------------------------|
| Multipatch on PDP-7/340 | Octal listing + manuals |
| Multiobject + Titan | Machine code + Titan extracode |
| ICON geometry path | Assembler + BCPL layer |
| TAG / PGM | Full source + VG3400 WCS panel |

Lars Brinkhoff + Roy's UWO students = natural consumers once scans arrive.

---

## See also

- [`../../heinz-lemke/sources/2026-07-16-pixie-storyline-thread.md`](../../heinz-lemke/sources/2026-07-16-pixie-storyline-thread.md)
- [`../../heinz-lemke/sources/2026-07-10-pixie-storyline-thread.md`](../../heinz-lemke/sources/2026-07-10-pixie-storyline-thread.md) — Kay film hunt
- [`../README.md`](../README.md)

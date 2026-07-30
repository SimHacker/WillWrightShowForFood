# Multipatch vs Multiobject organisation (29 July 2026)

**From:** andrew armit <andrew_armit@yahoo.co.uk>  
**Date:** 29 July 2026, 20:31 GMT+2  
**Subject:** Re: PIXIE/Rainbow, Sketchpad, and Object-Oriented Design  
**To:** Don Hopkins, Lars Brinkhoff  
**Cc:** Roy Eagleson, Alan Kay, Heinz Lemke, Peter Mowforth, Arthur van Hoff, Leo Joskowicz, Mario Cypko, Will Wright, Franziska Schweikert (CARS)

Public-safe digest of Andrew's note recording **differences between PIXIE and Multipatch organisation**, and between **Multipatch** and **Multiobject**. Typos normalized lightly; technical claims preserved.

Prior barn inventory: [`2026-07-16-armit-archive-manifest.md`](2026-07-16-armit-archive-manifest.md)  
Thread index: [`../../heinz-lemke/sources/THREAD-INDEX.md`](../../heinz-lemke/sources/THREAD-INDEX.md)

---

## Why it matters for PIXIE

Andrew frames Multipatch against **PIXIE's Titan-linked** Cambridge pattern. Multipatch is the
**standalone PDP-7** sibling; Multiobject is the **PDP-7 ↔ Titan** sibling closer to PIXIE's shape —
but Multipatch is the easier recreation target.

---

## Multipatch (PDP-7 only)

| Fact | Detail |
|------|--------|
| Host | **Entirely in the PDP-7** — **no Titan involvement** |
| Size | ~**4K**; half a year to conceive and create |
| Code shape | **Every instruction present; no libraries** |
| Listings | Octal in the listing → easy check against extracted source assembler |
| Design I/O | **Paper tape** (remarkably compact) |
| Primary UI | **ASR-33 keyed commands** + language processor |
| Light-pen variant | Context-dependent choices on pen picks — mostly to **show how good keyed input / language processor were** (not the main path) |
| Thesis test | Sequence of commands **interspersed with miniature screen shots** → grand acceptance test for a recreation |

### Joystick hardware (Multipatch era)

- **3 axes**; **2 microswitches per axis**
- At rest: no switch closed
- Move a little → first switch closes
- Move more → second closes
- Move yet more → **first opens** (second still closed — graded deflection)

---

## Multiobject (PDP-7 + Titan)

Written in the **remainder of the ~3 years** after Multipatch. Different architecture:

| Fact | Detail |
|------|--------|
| Host split | PDP-7 **communicated with Titan** — send new commands; receive **minimal** info to update changed parts |
| Feel | "Slick and casual"; casual would-be users of the **Titan console in the room** had to be enlightened |
| Memory | **16K**, then **24K** ("expensive mode") |
| Roles | Held data defining the design; **floating point** on Titan side |
| Listings | Titan **machine code**; Armit has historic Titan manual in good repair |
| Link | Has **extracode definitions** of the high-speed link |
| Size | **Thousands** of lines; significant recreation work |
| Link software | His **100-word** PDP-7 link program — not the "ridiculous **4K handler**" that had been proposed |
| Titan uses | Store designs; **P.J. Payne** computed **plane intersections** |

---

## Corollary (Andrew)

> **Multipatch could be much more easily recreated** with tools available.  
> Thesis command sequence + miniature screenshots = grand test for the result.

Multiobject / Titan path: doable later, but a significant bunch of work (listings + extracode + link).

---

## Same-thread: Lars on SIMH devices (context)

Lars (29 Jul, earlier): adding a custom networking box / character-generator / display-list
subroutine support to SIMH is typically a new `pdp18b_foo.c` hooked in `pdp18b_defs.h` +
`pdp18b_sys.c`. Type 340 emulator **already supports the character generator** (used by PDP-10
programs); **provisional subroutine support** exists but **untested**.

→ Emulation plan: [`../../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md`](../../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md)  
→ Lars room: [`../../lars-brinkhoff/`](../../lars-brinkhoff/)

---

## Show / preservation hooks

1. **Multipatch-first** recreation path (4K, no Titan, paper tape, octal listings) before Multiobject/PIXIE Titan link
2. Thesis **command + screenshot** sequence as automated regression once SIMH boots it
3. Joystick graded microswitches — hardware story segment (or emulator analog)
4. Contrast table on air: **PIXIE** (radial menus, Titan) vs **Multipatch** (keyed language, standalone) vs **Multiobject** (minimal Titan updates)

↑ [character room](../README.md) · [archive manifest](2026-07-16-armit-archive-manifest.md)

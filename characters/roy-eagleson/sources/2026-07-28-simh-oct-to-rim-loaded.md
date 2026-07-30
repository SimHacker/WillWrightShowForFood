# Roy Eagleson — PIXIE `.oct` → `.rim` loads in SIMH (28 July 2026)

**From:** Roy Eagleson <eagleson@uwo.ca>  
**Date:** 28 July 2026, 23:50 GMT+2  
**Subject:** Re: PIXIE/Rainbow, Sketchpad, and Object-Oriented Design  
**To:** Don Hopkins, Alan Kay  
**Cc:** Heinz Lemke, Peter Mowforth, Arthur van Hoff, Leo Joskowicz, Mario Cypko, Lars Brinkhoff, Will Wright, Franziska Schweikert (CARS), Andrew Armit

[Portrayal standards](../../../schemas/portrayal-standards.md)

---

## Progress

- Wrote a utility to convert Don's extracted **`.oct`** files (from Heinz's scanned listings) to DEC **`.rim`** so the program can load into **Robert Supnik's SIMH** family (with Lars Brinkhoff's **340** display routines in play).
- Can **load Heinz's code into the simulator** and **step instruction-by-instruction**.
- **`GO` stops without displaying anything** — working hypothesis: no interrupts from a light-pen device yet.

Side note while converting: suspected bugs in **Cygwin `int32_t`** handling when slicing 32-bit ↔ 18-bit — "the sorts of problems that harken back to the days when we needed to know which bits are set."

## Next hurdles (Roy's framing)

1. **Light pen** — most natural locally: C extensions that play nicely with **X11**; for the rest of the world: **web-friendly** path (mouse events standing in for light-pen interrupts). Mentions X11-to-webpage as an open check.
2. Teaching jab: undergrad courses that try to leave hardware behind (JS/Python) vs needing architecture to write `.oct`→`.rim` for SIMH.

## Status vs EMULATION-PLAN

Advances milestone **"Loader: rsppix.oct → SIMH"** on
[`../../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md`](../../heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md):
binary loads and steps; display/light-pen still blocking `GO`.

Prior seed: [`2026-07-14-uwo-pixie-reimplementation.md`](2026-07-14-uwo-pixie-reimplementation.md)

---

↑ [Roy room](../README.md) · [THREAD-INDEX](../../heinz-lemke/sources/THREAD-INDEX.md)

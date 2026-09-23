---
title: The emulator
synonyms:
  - SIMH
  - browser bench
definition: "Two benches. Open SIMH on the desktop for correctness; a TypeScript PDP-7 with a Type 340 in the browser, running SYMELEC now."
---

**Try it:** ~PIXIE live~ runs the browser bench in a page.

Two benches are named in the emulation plan. Bench A is Open SIMH, native, the correctness referee. Bench B is the browser: `@wwsff/cabinet`, a purpose-built TypeScript PDP-7 with a Type 340 vector display drawn on canvas. The light pen, in software, is a hit test against the strokes the display just drew. It boots Heinz Lemke's 1972 SYMELEC listing, and SYMELEC's own tracking loop follows the pen.

How it is built: ~Cabinet design~, ~Web bench~, ~SIMH map~, ~Tracking~, ~Tiny Titan~. What broke on the way: ~Off by one~ and the ~Bug journal~.

~Roy Eagleson~'s students at Western are re-implementing ~PIXIE~. ~Lars Brinkhoff~ is the iron. The plan file is the receipt.

```transclude
path: characters/heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md
```

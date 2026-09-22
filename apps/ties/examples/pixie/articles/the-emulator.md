---
title: The emulator
synonyms:
  - SIMH
  - browser bench
definition: "Open SIMH on the desktop, today. A PDP-7 with a Type 340 in the browser is the goal. Not yet. Students are part of getting there."
---

The emulator we are using is a desktop app: Open SIMH, PDP-7 plus Type 340, cloned with the rest of the iron. There is no JS/WASM PDP-7 with a 340 in the browser today. That is the goal.

Two benches are already named in the emulation plan. Bench A is SIMH, native, correctness. Bench B is the browser. A purpose-built TypeScript core is thinkable — the PDP-7 is tiny — and the 340 is a vector display, so canvas is its habitat. The light pen, in software, is a hit-test. Promised. Not scheduled from this node.

~Roy Eagleson~'s students at Western are re-implementing ~PIXIE~. ~Lars Brinkhoff~ is the iron. The plan file is the receipt.

```transclude
path: characters/heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md
```

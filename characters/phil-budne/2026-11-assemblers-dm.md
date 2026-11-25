# Draft: follow-up about the tools, to Phil (November 2026)

Plain text for Facebook Messenger, a follow-up to the [first message](2026-11-facebook-dm.md).
Don sends it by hand. The details are in the linked docs.

```
Phil, a follow-up about tools, where I'd like your advice.

I'm building a programming environment around the emulators, all in TypeScript so it runs in the browser and Node: one assembler and tool core that doesn't depend on the instruction set, with parts for the PDP-7, the PDP-10 with MIDAS, and the Apple ][. The PDP-7 has three assemblers on it so far, and a source map from each word in core to its source line and to that line on the scanned printout. Next I want MIDAS's macros on the PDP-7, so one Forth source can build different header formats:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ASSEMBLERS.md#plan-macros-from-midas-and-one-core-for-every-tool

On the Apple ][ I want a 6502 macro assembler on the same core, to reverse engineer my own Forth back into source. Only its saved image and some blocks survived:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/artifacts/Apple2Forth/README.md#plan-getting-the-source-back

Which PDP-10 assemblers and tools should I study besides MIDAS, MACRO-10 and FAIL, and where are the best manuals and sources? What other tools should a cabinet have? And is there anything you'd steer me away from?
```

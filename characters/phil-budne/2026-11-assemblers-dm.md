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

A second follow-up, about mixing dialects:

```
One more about the assemblers. Heinz Lemke's PIXIE survives as a 1972 listing in Cambridge's PDP-7 assembly dialect: SYMELEC, the main program (5,341 lines), and RSPPIX, a separate ring structure processor that builds and edits PIXIE's rings (727 lines). Mitch's Forth is in as7. So I used the TypeScript assembler's Cambridge parser to translate SYMELEC and RSPPIX into as7, checked that they assemble to the same words, and assembled RSPPIX together with the Forth kernel as one program, so Forth can call PIXIE's ring routines.

The next step is an assembler that takes files in different dialects and instruction sets in one run (PDP-7 dialects, Type 340 display code, 6502, and Forth for the PDP-7 and the Apple ][) and builds one image with one symbol table and source map. Then a device like the 340 is its own front end, and its code assembles alongside whichever CPU drives it, PDP-7 or PDP-10, without wiring the 340 into either architecture:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ASSEMBLERS.md#plan-macros-from-midas-and-one-core-for-every-tool
```

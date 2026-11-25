# Draft: assemblers and tools, to Phil (November 2026)

Plain text for Facebook Messenger. Don sends it by hand.

```
Phil, I'd like your advice on the programming environment I'm building around the emulators. I'm designing a generic one, an assembler and tool core that doesn't depend on the instruction set, and implementing specific parts of it for the PDP-7, the PDP-10 with MIDAS, and the Apple ][.

For the Apple ][ I want a good 6502 macro assembler in TypeScript, so I can reverse engineer my own Apple ][ Forth back into source. Its saved image survived but the source for much of it didn't. The assembler would do the header macros, including bumping the dictionary pointer by one when a code field would land at the end of a page, because the 6502's JMP (addr) fetches the high byte from the wrong place when addr ends in FF. Then I can try different header formats, threading models, headers and metadata kept out of band, and documentation generated from the same source. I also want to write a full manual for my Forth-83 dialect, and maybe make an Apple ][ Forth coprocessor card in the emulator, like the PDP-7 one.

All of the cabinet's development tools are in TypeScript, next to the emulators, so they run in the browser and in Node and you can edit, reassemble and rerun a program in the running machine. There are three PDP-7 assemblers so far, DEC's 1964 one, the Cambridge CAD Group's 1972 one (which reassembles Heinz Lemke's PIXIE from his listing), and UNIX's as7 (which builds Mitch Bradley's PDP-7 Forth). Inside they are one assembler with three parsers. They share the symbol table, literal pools, listings and a source map that goes from each word in core to its source line, its listing line, and the rectangle of that line on the scanned printout:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ASSEMBLERS.md

What's missing is macros. I want one PDP-7 Forth source where every word is defined with a macro, and a separate file of macro definitions picked at build time: Mitch's 3-character headers, full names, names in the second memory bank, no headers, or other metacompiler jobs like Forth words that call PDP-7 library routines directly, or wrapping a PDP-7 library so Forth can call it. The PDP-7 assemblers didn't have much of a macro facility, so my plan is to bring MIDAS's macros back to the PDP-7, in the shared layer, so all three dialects get them. Then a MIDAS front end for the PDP-7, and MIDAS for the PDP-10 itself, which the KA10 running ITS will need anyway. The plan:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ASSEMBLERS.md#plan-macros-from-midas-and-one-core-for-every-tool

I want the core to be independent of the instruction set, so every assembler and tool on every machine shares the machine description, expressions, symbols, macros, listings and the source map.

Some questions, if you have time:

1. Which PDP-10 assemblers should I study besides MIDAS, MACRO-10 and FAIL, and where are the best manuals and sources? I've found MIDAS's source and info file in the PDP-10/its repo.

2. You worked on the assembler for pdp7-unix. What did you learn about as7 that I should know?

3. Which macro features matter most to port, and which would you leave out?

4. What other development tools should a cabinet have: a DDT, a linker, cross-reference listings, something else? And is there anything you'd steer me away from?

I'd welcome your help, or just pointers in the right direction (or away from the wrong ones).
```

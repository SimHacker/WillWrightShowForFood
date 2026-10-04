# The PDP-7 cabinet: a student / hacker / turist guide

The machines behind the [PIXIE listing](../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md)
and the browser emulator that runs it: what a PDP-7 is, how plugging in a device literally added
instructions to it, why the Type 340 display is a second computer, what Titan, the mainframe
across the link, was, and how all of it is built in TypeScript. Written for anyone spending
precious time here; the manuals are in [README.md](README.md).

**Inventory sheet:** [PIXIE hardware](../../../characters/heinz-lemke/pixie-hardware.md) — model numbers, memory, clock,
link protocol identifiers, documented vs missing manuals.

## Why "turist"

Not a typo — a credential. **TURIST** is MIT AI Lab / ITS spelling: SIXBIT filenames held
six characters, so TOURIST lost its O and U and the Jargon File enshrined the result — a
guest on ITS, there to explore, welcome by default. ITS shipped with no passwords; the door
was open on purpose, and turists who behaved (and some who didn't) became hackers.

Don was a turist at MIT-AI, and testifies that **ITS was the first social network**:
`:WHOJ` showed who was on, `:SEND` fired a message onto someone's screen, `:RMAIL` read
your mail, `:UNTALK` chatted back and forth in split screen — and `:UJOB` opened another
user's running job, examine-only by the book, until `:DDTSYM DPSTOK/-1` and `$$^R` let you
deposit into it and hack it live. Security through obscurity: DDT answered `$$^R` with a fake
" OP? " so onlookers would think it failed
([Don on HN, 2020](https://news.ycombinator.com/item?id=22840639)).
Presence, messaging, mail, chat, and writable-by-design shared state, a decade before
anyone said "social network."

This guide extends the same open door: a new generation of turists is invited to explore
and *run* this code — the PIXIE listing, the emulators, the light pen quest. The machines
are documented below; the door has no lock; try not to crash the PDP-7, and if you do,
write up what you learned.

## The guides

Each is one subject, readable alone. Each says what is **done**, **next**, **will** happen,
**could** happen if someone takes it on, and **won't**. Students and hackers: every *could* is
an invitation. Pick one, say so in a commit, and ask Don.

| Guide | What it covers |
|---|---|
| [GUIDE-PDP7](GUIDE-PDP7.md) | The PDP-7: 18-bit words, 13-bit addresses, the index-card instruction set, and IOT, the door every device walks through to add its own instructions. Memory extension to 32K. Side by side with an Apple ][: the same speed twelve years later, at 1/35 of the price |
| [GUIDE-340](GUIDE-340.md) | The Type 340 display: it fetches its own instructions from core, so it is a second computer. Myer & Sutherland's wheel of reincarnation |
| [GUIDE-LIGHTPEN](GUIDE-LIGHTPEN.md) | The Type 370 light pen: what it sees (strokes, not objects), how a program learns what was hit (`DDS`), interrupts or polling, several pens |
| [GUIDE-TITAN](GUIDE-TITAN.md) | Titan, Cambridge's Atlas 2, across Wiseman's link: extracodes, the first commercial time-sharing, and the blocklet protocol PIXIE spoke |
| [GUIDE-RINGS](GUIDE-RINGS.md) | PIXIE's data: ring structures, the word classes, names that are `JMS` words, and how rings compare with sexprs, JSON and YAML |
| [GUIDE-SYMELEC](GUIDE-SYMELEC.md) | SYMELEC end to end: boot, the interrupt skip chain, pen dispatch, tracking, display files, scale per item |
| [GUIDE-PHOSPHOR](GUIDE-PHOSPHOR.md) | The P7 tube: blue flash, yellow afterglow, how the bench integrates refreshes, and the WebGPU plan |
| [GUIDE-BENCH](GUIDE-BENCH.md) | The browser bench layer by layer, from JavaScript to the page, and what is emulated where |

**Then, in the cabinet:** [README](../README.md) (what runs, how to test) ·
[DESIGN](../DESIGN.md) (how it's built and why) · [ROADMAP](../ROADMAP.md) (the big work, in
order) · [TODO](../TODO.md) (loose ends, ranked) ·
[DRAWING-CONSTRAINTS](../DRAWING-CONSTRAINTS.md) (long-term, open) ·
[TRACKING](../TRACKING.md) (SYMELEC's cross, against the listing) ·
[TAGS-AND-PIES](../TAGS-AND-PIES.md) · [MANIFESTO](../MANIFESTO.md) (what we change and why).

This folder moved here from `characters/heinz-lemke/sources/pdp7-reference/` on 4 October 2026,
so the hardware, the emulator and its docs are in one place. Heinz's folder keeps his story, his
thesis and the transcription of his listing; the finished listing artifacts the cabinet runs are
copied to [tapes/symelec](../tapes/symelec/README.md).

## Further reading

- Bob Supnik, *[Architectural Evolution in DEC's 18b Computers](https://archive.computerhistory.org/resources/text/DEC/pdp-1/dec.pdp-1_15.supnik.rchitectural_evolution_in_dec%27s_18b_computers.2003.102630392.pdf)* (2003) — PDP-1 → 4 → 7 → 9 → 15 by the author of SIMH's 18-bit family: why the PDP-4 cut the instruction set in half, the ones'/two's complement mess (Bell: "a mistake"), auto-index, the skip-on-flag I/O model, PDP-7 trap mode, and the PDP-7 vs PDP-9 incompatibilities an emulator must get right. The PDP-7: first shipped Dec 1964, 120 built, 1.75 µs cycle, $45K. And a gem on p. 10: the PDP-4's assembler was one pass, so the source tape went through once. It punched binary with the forward references left unresolved, and a resolution dictionary at the end of the tape; "the resulting tape was then read, upside down and backward, by the loader," which fixed up the broken references. The PDP-7's software grew from the PDP-4's. (How: a tape frame is 8 holes, and a reader at a few hundred frames a second leaves a few hundred instructions per frame, so reversing bits in software is easy; reading the tape backward also brings the resolution dictionary first. Unverified; [TODO](../TODO.md).) Also at [simh.trailing-edge.com](https://simh.trailing-edge.com/docs/architecture18b.pdf)
- Barry Landy, *[Atlas 2 at Cambridge Mathematical Laboratory (and Aldermaston and CAD Centre)](https://curation.cs.manchester.ac.uk/atlas/docs/Atlas2%20Barry%20Final%2014th%20December.pdf)* — the insider memoir most of [GUIDE-TITAN](GUIDE-TITAN.md) draws on
- [CUCPS Titan archive](https://cucps.soc.srcf.net/titan/) — supervisor planning docs, programming manual, by permission of Landy/Needham/Hartley
- [Titan (1963 computer), Wikipedia](https://en.wikipedia.org/wiki/Titan_(1963_computer))
- [Computer Conservation Society software & emulators](https://computerconservationsociety.org/software/software-index.htm) — the Atlas 1 emulators
- Myer & Sutherland, *On the Design of Display Processors* (CACM, 1968) — the wheel of reincarnation. [Reading copy and PIXIE mapping](../../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md); [PDF](http://cva.stanford.edu/classes/cs99s/papers/myer-sutherland-design-of-display-processors.pdf)
- [Type 340 Precision Incremental Display, Computer History Wiki](https://gunkies.org/wiki/Type_340_Precision_Incremental_Display)

↑ [reference library](README.md) · [PIXIE listing](../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md) · [transcription report](../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md) · [character README](../../../characters/heinz-lemke/README.md)
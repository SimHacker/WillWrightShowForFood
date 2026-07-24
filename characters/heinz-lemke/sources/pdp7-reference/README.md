# PDP-7 + Type 340 display reference library

Everything needed to read, assemble, and run the [PIXIE listing](../pixie-assembler-listing-1972/README.md)
on an emulated PDP-7 with the DEC Type 340 display — and to build a virtual light pen.
All documents mirrored from [bitsavers.org](https://bitsavers.org) (public archive); the
public URLs below are the canonical citations. Start here, students, hackers, and turists.

**New here? Read the [turist guide](GUIDE.md) first** (spelled the ITS way — see the guide's
first section) — how devices added instructions to
the PDP-7, why the 340 is a second computer (wheel of reincarnation), the story and
architecture of **Titan** across the link, and what's emulated versus what's an open quest.

## The display

| Local copy | Public URL | Why you need it |
|------------|-----------|-----------------|
| [`H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf`](H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/graphics/H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf) | **The display manual.** Type 340 Precision Incremental CRT System (Nov 1964): display-word formats (parameter, point, vector, vector-continue, increment, subroutine — the PAR/POH/POV/VEC/DJS/DJP words all over PIXIE), interrupt behavior, light-pen flag logic, timing |
| [`7-13_340_Display_Programming_Manual.pdf`](7-13_340_Display_Programming_Manual.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf) | 340 programming manual in the PDP-7 doc series (7-13) — the software-side companion: IOT instructions, display-file conventions, service routines |
| [`DIGITAL-7-60-N_Type34DisplayTest_Apr65.pdf`](DIGITAL-7-60-N_Type34DisplayTest_Apr65.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/DIGITAL-7-60-N_Type34DisplayTest_Apr65.pdf) | DEC's own display test program — a known-good display exerciser to bring up under the emulator before trying PIXIE |
| [`Type_30E_Precision_CRT_Display_Dec63.pdf`](Type_30E_Precision_CRT_Display_Dec63.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/graphics/Type_30E_Precision_CRT_Display_Dec63.pdf) | **Lineage:** the Type 30 — the PDP-1's Spacewar display and the 340's predecessor. Same 16ADP7A radar tube, same P7 phosphor, same 1024×1024 grid — but a dumb point-plotter (50 µs per CPU-issued dot, no vectors, no display file). The 340 adds the display processor: autonomous display-file execution, 1.5 µs incremental vectors, and DJS/DJP subroutines — the leap that makes PIXIE's light buttons and subpictures data structures instead of CPU dot loops. (H-340 notes the 340 was designed for the PDP-1/-4/-6/-7; on the PDP-1 the data-break channel was optional, standard on the -4/-7.) SIMH's shared display library implements both |

## The light pen

| Local copy | Public URL | Why you need it |
|------------|-----------|-----------------|
| [`DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf`](DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf) | Type 370 light pen diagnostic for the PDP-7 — the acceptance test for any **virtual light pen driver**: emulate the pen well enough that DEC's 1964 diagnostic passes, then PIXIE's `PEN`/`TRACK` code should too |

## The processor and its tools

| Local copy | Public URL | Why you need it |
|------------|-----------|-----------------|
| [`F-75_PDP-7userHbk_Jun65.pdf`](F-75_PDP-7userHbk_Jun65.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/F-75_PDP-7userHbk_Jun65.pdf) | **PDP-7 Users Handbook** — the core processor reference: instruction set, addressing, EAE, interrupt system (program flag/API), IOT structure, memory layout |
| [`PDP7_Instruction_list.pdf`](PDP7_Instruction_list.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/PDP7_Instruction_list.pdf) | One-glance opcode card — the cheat sheet behind [`opcheck.py`](../pixie-assembler-listing-1972/scripts/opcheck.py)'s encodings |
| [`PDP-7_AsmMan.pdf`](PDP-7_AsmMan.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/PDP-7_AsmMan.pdf) | DEC's PDP-7 Symbolic Assembler manual. Note: PIXIE was assembled with the **Cambridge University CAD Group Assembler** (cross-assembled on Titan), whose syntax differs — `X=JMS,` opcode-valued symbols, `#` operands — but the DEC manual defines the baseline the Cambridge one deviates from |
| [`PDP-7_DDT_Ref.pdf`](PDP-7_DDT_Ref.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/PDP-7_DDT_Ref.pdf) | DDT debugger reference — for poking at PIXIE once it's loaded |
| [`PDP-7_InterfMan.pdf`](PDP-7_InterfMan.pdf) | [bitsavers](https://bitsavers.org/pdf/dec/pdp7/PDP-7_InterfMan.pdf) | Interface manual — I/O bus, device flags, interrupt wiring; the hardware contract an emulated 340 + light pen device must honor |

Linked, not mirrored (large maintenance sets): [F-77A PDP-7 Maintenance Manual, 1966 (17 MB)](https://bitsavers.org/pdf/dec/pdp7/F-77A_pdp7maint_1966.pdf) ·
[PDP-7 Maintenance (36 MB)](https://bitsavers.org/pdf/dec/pdp7/PDP-7_Maint.pdf) ·
full index: [bitsavers /pdf/dec/pdp7/](https://bitsavers.org/pdf/dec/pdp7/) · [/pdf/dec/graphics/](https://bitsavers.org/pdf/dec/graphics/)

## Local working clones and toolchains

Cloned next to the other repos (add them to the Cursor workspace to read source instead of guessing):

| Repo | Local path | What's inside |
|------|-----------|---------------|
| [open-simh/simh](https://github.com/open-simh/simh) | `~/GroundUp/git/simh` | The emulator. PDP-7 CPU lives in `PDP18B/` (shared 18-bit family code: PDP-4/7/9/15); the Type 340 engine is `display/type340.c`; the PDP-7↔340 glue is `PDP18B/pdp18b_dpy.c` |
| [DoctorWkt/pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) | `~/GroundUp/git/pdp7-unix` | The 1969/1970 PDP-7 UNIX restoration (Warren Toomey et al.). `tools/` is the modern cross-toolchain: `as7` (Perl cross-assembler for Ken Thompson's `as` syntax, output tweaks by Phil Budne), `b.c` (a B compiler emitting PDP-7 assembly — Robert Swierczek), `a7out`, `mkfs7`, `fsck7` |

**The light-pen gap, located.** `display/type340.c` already models pen-enable bits per
display word and calls `ty340_lp_int(x, y)` on hits — but the PDP-7 glue in
`PDP18B/pdp18b_dpy.c` reads back pen status as a hardwired zero (`dat |= 0; // Light pen.`).
That one stubbed line is where the virtual light pen driver plugs in.

**Assembler / compiler options, near to far:**

1. **No assembler at all** — we already transcribed the assembled octal (`rsppix.oct`).
   Convert it to a SIMH `DEPOSIT` script or paper-tape image and the 1972 binary runs as-is.
2. **Cross-assemble on the Mac/Linux box** — `as7` runs anywhere Perl does. PIXIE's
   Cambridge syntax (`X=JMS,` opcode-valued symbols, `#` operands) isn't Ken's `as` syntax,
   so either mechanically translate `rsppix.asm` to `as7` dialect, or write a small Python
   cross-assembler honoring the Cambridge dialect (we already parse it in
   [`stitch.py`](../pixie-assembler-listing-1972/scripts/stitch.py)) and diff against `.oct`.
3. **Assemble natively inside the emulator** — boot PDP-7 UNIX in SIMH and use Ken's
   original `as`, or run DEC's paper-tape Symbolic Assembler. Period-authentic, slowest.
4. **B, for fun** — the `pdp7-unix` toolchain compiles B (C's parent) to PDP-7 assembly on a
   modern machine; the original B ran on this very architecture.

The original chain, for the record: PIXIE was **cross-assembled on Titan** by the Cambridge
CAD Group Assembler (user HL1470) and carried to the PDP-7 — so writing our own
cross-assembler on a big machine next door is not cheating; it is the authentic workflow.

## The mission — PIXIE in the emulator

Full battle plan with architecture (SIMH lab bench + browser bench + high-level Titan
protocol service) and milestones: [**EMULATION-PLAN.md**](EMULATION-PLAN.md). Summary:

1. **Assemble**: take the recovered [`symelec.asm` / `rsppix.asm`](../pixie-assembler-listing-1972/README.md)
   and get them through a PDP-7 assembler (or write a small cross-assembler honoring the
   Cambridge syntax); diff the output against the transcribed `*.oct` memory images — the
   round-trip check described in the [transcription report](../pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md).
2. **Run**: [Open SIMH](https://github.com/open-simh/simh) has a PDP-7 with Type 340 display
   support (`DPY` device, built on the shared `display/` library that also powers the PDP-1
   Spacewar setup — which already includes light-pen plumbing to study).
3. **Virtual light pen**: map mouse/touch position to the 340's beam-intersection model —
   the pen "sees" the beam when it draws under the pen's field of view, setting the pen flag
   that fires PIXIE's interrupt path (`INT` → `JMS PEN` → `TRACK` tracking cross). Validate
   against the Type 370 diagnostic above, then against PIXIE itself.
4. **Answer the research question**: with a working pen, settle the
   [target-area vs direction radial-menu question](../../pixie-source-recovery.md) live —
   **CARS 2027 Berlin demo target (29 June 2027)**.

↑ [PIXIE listing](../pixie-assembler-listing-1972/README.md) · [character README](../../README.md) · [source recovery](../../pixie-source-recovery.md)

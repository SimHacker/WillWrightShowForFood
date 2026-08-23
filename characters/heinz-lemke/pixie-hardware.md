# PIXIE hardware — model numbers, geometry, and link

One-page inventory of the iron behind PIXIE (1967–1972): satellite CPU, display stack,
Titan host, and the Cambridge homebrew link. Deep narrative in
[the turist guide](sources/pdp7-reference/GUIDE.md); runnable path in
[the emulation plan](sources/pdp7-reference/EMULATION-PLAN.md).

**HN (Aug 2026):** Don pasted a summary of this sheet into
[49407938](https://news.ycombinator.com/item?id=49407938) on
[*I Dream of Quieter Computing*](../don-hopkins/slower-phosphor-quieter-computing-hn-2026.md)
— alongside the PIXIE film and listing-recovery announcement.

Lars Brinkhoff's mirrored DEC manual shelf:
[`../lars-brinkhoff/media/reference/cambridge-pixie-hardware-stack.md`](../lars-brinkhoff/media/reference/cambridge-pixie-hardware-stack.md).

---

## System shape

PIXIE is a **distributed CAD workstation**, not one cabinet:

| Role | Machine | Job |
|------|---------|-----|
| Interactive front end | **DEC PDP-7** + **Type 340** CRT | Real-time drawing, light pen, radial control lightbuttons, graph model in core |
| Compute / storage host | **Titan** (Cambridge name for **Ferranti/ICT Atlas 2**) | RAINBOW apps: CONN, COMPACT, PLOT, LADAN, file store |
| Wire | **Wiseman high-speed link** + **Lang supervisor software** | Move typed ring-structure models blocklet-by-blocklet |

Trade press (*Electronics*, 28 Apr 1969) names **ICL Atlas Mark 2, 120K×48** as main and
**PDP-7, 8K×18** as satellite — see
[article notes](sources/electronics-international-1969-04-28-pixie.md).
Cambridge sources consistently call the host **Titan**.

Heinz's 2026 correction: the PDP-7 was **not** a dumb terminal — ~5000 words of PDP-7 code
built the interactive graph before anything crossed the link — see
[pixie-source-recovery.md](pixie-source-recovery.md).

---

## PDP-7 — compute geometry

From [GUIDE.md](sources/pdp7-reference/GUIDE.md) and thesis
[Chapter 5](sources/phd-thesis-1972/annotated/03-chapter-5-pixie.md):

| Parameter | Value | Source |
|-----------|-------|--------|
| Word size | **18 bits** | GUIDE |
| Core (design target) | **8K words** | Thesis §5.3.2; *Electronics* 1969 |
| Core (likely installed) | **8K–16K** | GUIDE ("here likely 16K") — **not confirmed on floor** |
| Cycle time | **~1.75 µs** | GUIDE |
| Derived throughput | **~571K cycles/s** (1 ÷ 1.75 µs) | arithmetic; **not a period metric** |
| **MIPS** | **Not documented** | era measured CPU % and core footprint, not MIPS |
| Addressing | 13-bit + indirect bit | GUIDE |
| Registers | One accumulator + link bit | GUIDE |
| Opcode field | 4 bits | GUIDE |

Memory-reference set (fits on an index card): `CAL DAC JMS DZM LAC XOR ADD TAD XCT ISZ AND SAD JMP`,
plus operate micro-ops, `LAW`, optional **EAE**, and **IOT**.

### Memory budget (8K total)

| Allocation | Words | Source |
|------------|-------|--------|
| PIXIE program | ~**5K** | Thesis §5.3.2 |
| Display file + working space | ~**1K** | Thesis §5.3.2 |
| Live graph model | ~**2K** | Thesis §5.3.2 |
| Heinz 2026 framing | ~5000 instructions + ~**3000** words for model | [pixie-source-recovery.md](pixie-source-recovery.md) |

Typical drawing without Titan help: **30–35 nodes/branches**; up to **~50** depending on grouping
and text (thesis §5.3.2). Boot: address switches to **22**, press start (Appendix 4).

### Performance (measured, not MIPS)

Thesis [Chapter 9](sources/phd-thesis-1972/annotated/05-chapters-8-9.md) — typical **1-hour console session**:

| Metric | Value |
|--------|-------|
| CPU utilisation | **5–10%** |
| Effective core utilisation | **20–30%** of 8K |

Teletype output: ~**100 ms/char** via `OUT` interrupt (thesis Ch. 5).

---

## PDP-7 options and extensions

Devices that **add instructions** when plugged in (IOT mechanism — [GUIDE.md](sources/pdp7-reference/GUIDE.md)):

| Option | DEC type | What it adds |
|--------|----------|--------------|
| Extended Arithmetic Element | **Type 177 EAE** | Multiply, divide, shifts, normalize (`64xxxx` in listing) |
| Precision incremental display | **Type 340** | Required — second processor + DMA display file |
| Display ↔ host interface | **Type 341** | Cited in 340 programming manual; **341/347 memo not on bitsavers** |
| Symbol generator | **Type 342** | 6-bit character codes → stroke sequences (**H-342 manual missing**) |
| Subroutine option | **Type 347** | **`DJS` / `DJP`** display jump-to-subroutine — **inferred from PIXIE code** |
| Light pen | **Type 370** | Pen flag IOTs; diagnostic **DIGITAL-7-78-M** mirrored |
| Titan link | **Cambridge custom (Wiseman)** | `LCF`, `LSF`, `LKE`, `LLB6`, `LLB18`, `LRB18`, `LLAM`, `LSA`, `LKD` |

Don's HN shorthand for the luxury stack: **342 + 370 + 347** —
[cambridge-films-flight-of-the-bumblebee.md](cambridge-films-flight-of-the-bumblebee.md).

**PDP-9:** PIXIE manual says **PDP7/PDP9** — the **PDP-9** is the 18-bit successor (register-compatible);
**not** the 12-bit PDP-8 —
[2026 storyline thread](sources/2026-07-28-pixie-storyline-thread.md).

Other satellite peripherals: teletype, paper-tape reader (alternate boot), clock interrupts.

---

## Type 340 display — geometry and specs

Manuals mirrored in [pdp7-reference/README.md](sources/pdp7-reference/README.md):

| Parameter | Value | Source |
|-----------|-------|--------|
| Model | **DEC Type 340** Precision Incremental CRT System (H-340, Nov 1964) | README |
| Tube lineage | **Type 30E** → **16ADP7A** radar tube, **P7 phosphor** | README |
| Addressable grid | **1024×1024** | Lars stack; README (via Type 30/340 lineage) |
| Physical window | **~10 inch square** on **~40 inch** conceptual surface | [Appendix 4](sources/phd-thesis-1972/annotated/07-appendix-4-pixie-user-manual.md) |
| D/A resolution | **10 bits** on deflection | Thesis §5.6.2 |
| CPU coupling | Cycle steal / data break — 340 fetches display words from PDP-7 core | Thesis §5.3.1; GUIDE |
| Vector timing | **~1.5 µs** incremental vectors (340) vs **~50 µs**/dot (Type 30) | README |
| Display word types | PAR, POH, POV, VEC, VEC+, increment, character; with 347: DJS/DJP | Listing; thesis |
| Refresh | Tracking cross alone: kHz possible; large PDF/TDF: **10–20 cycles/s** | Thesis §5.5.1 |
| Hardware limits | Limited vector length; **no scissoring**; no hardware subroutine stack (software uses DJS/DJP) | Thesis §5.4.3 |

UI layout: **12** command lightbuttons on the right edge; **6** control buttons around the
tracking cross (Appendix 4; [Wiseman radial-menu notes](sources/buxton-2008-wiseman-notes/wiseman-notes-on-radial-menus-in-pixie.md)).

---

## Titan — host geometry

From [GUIDE.md](sources/pdp7-reference/GUIDE.md):

| Parameter | Value |
|-----------|-------|
| Identity | Ferranti/ICT **Atlas 2** prototype; Cambridge name **Titan** (1964–Oct 1973) |
| Word size | **48 bits** (8×6-bit chars or 2×24-bit halfwords) |
| Core growth | **32K → 64K → 128K** words |
| Press label | **120K×48** (*Electronics* 1969 — ICL Atlas Mark 2) |
| Addressing | Base/limit registers; user address **OR**ed with base (not added) |
| Operand store | Tunnel-diode **operand slave store** — Cambridge claims first cache |
| Software "instructions" | Up to **512 extracodes** (supervisor code in main store) |
| OS | **Titan Supervisor / Cambridge Multiple-Access System** — public **22 Mar 1967** |
| Storage | Two **Data Products 16M-word** discs; tape; card/punch |
| Terminals | Cambridge **64-line multiplexor** — 73 registered, 26 simultaneous; modems from 1967 |
| **MIPS / FLOPS** | **Not in archive** |

Titan ran RAINBOW: BCPL + FORTRAN analysis (e.g. **LADAN**), file store,
**`COMPACT`/`PLOT`/`CONN`/`CONNMAP`** — backend verbs PIXIE never sent on the wire
([Chapters 8–9](sources/phd-thesis-1972/annotated/05-chapters-8-9.md)).

---

## Homebrew networking (PDP-7 ↔ Titan)

Two layers — [TITAN-LINK-PROTOCOL.md](sources/pdp7-reference/TITAN-LINK-PROTOCOL.md),
[Planning Document 10](sources/pdp7-reference/cambridge-supervisor/pd10-titan-pdp7-link.md)
(C.A. Lang, 2 Dec 1965):

**Hardware:** Wiseman's **custom high-speed link** — not DEC catalog hardware. Implemented as
custom **IOT instructions** on the PDP-7.

**Supervisor contract (PD10):** core-to-core block transfer (18→48-bit packing extracodes);
**Attentions** (light-pen/display events queued on PDP-7); Titan disk access via peer program;
**second teletype** on the multiplexor (explains thesis Figs 8.6 vs 8.7 — two chairs, two
teletypes, one model).

**PIXIE application protocol** (from 1972 listing):

| Item | Value |
|------|-------|
| Blocklets | 4-word header + up to **8K** 18-bit words + checksum |
| Magic type word | **`PXID = 767676`** |
| Relocation | Pointer swizzling after Titan→PDP transfer |
| Wire verbs | Only `4`, `6`, `010` (NAK) — semantics = **which Titan program** received the model |
| User command | Teletype **`TITAN`** = execute link |
| While blocked | `WAITLK` loop still services display + keyboard |

Code delivery: **assembled on Titan** (Cambridge CAD Group Assembler, user **HL1470**), likely
to PDP-7 via **paper tape**; **models** went by wire. Heinz: **~3 years nightly** link sessions
(GUIDE).

**Gaps:** link **baud rate**, cable pinout, physical box model numbers, Titan-side application
programs (lost — noted in TITAN-LINK-PROTOCOL.md). Heinz claims Titan manuals and extracode
definitions in private possession — not filed in this repo.

---

## Other PIXIE installations

Thesis Ch. 5 gap-patch — ports beyond Cambridge Math Lab:

| Site | Hardware note |
|------|----------------|
| **RCA Laboratories, Princeton** | PIXIE port |
| **Institute of Computer Science, London** | **INDRA** — **PDP-9** port ("Low 70") |
| **[CAD Centre](https://en.wikipedia.org/wiki/CADCentre), Cambridge** | Industrialized from Titan/CAD lab lineage |
| **London University** | **PDP-9** course demo (Peter Kirstein's team) |

Related Cambridge CAD hardware in [Andrew Armit](../andrew-armit/)'s barn archive (not PIXIE itself):
Multipatch octal listings, **VG3400** WCS panel, **PGM** machine — see
[pull-in-gaps.md](pull-in-gaps.md).

---

## Emulation status

| Component | Status |
|-----------|--------|
| PDP-7 + Type 340 | [Open SIMH](https://github.com/open-simh/simh) — light-pen readback stubbed zero in `pdp18b_dpy.c` |
| Titan | **No emulator**; blocklet protocol documented for a mock peer |
| PIXIE binary | [Recovered listing](sources/pixie-assembler-listing-1972/README.md) — runs without Titan if link idles |

---

## Documented vs inferred vs missing

**Well documented:** PDP-7 + Type 340 + Type 370; memory budget; display-file architecture;
link application protocol from listing; PD10 supervisor plan; DEC PDFs under
[pdp7-reference/](sources/pdp7-reference/README.md) and Lars
[media/reference/](../lars-brinkhoff/media/reference/).

**Inferred:** Cambridge site had **342** and **347** installed (strong inference from DJS/DJP and
label display code; manuals missing). **16K** vs **8K** PDP-7 core at Cambridge.

**Missing from repo:** H-342, F-03-370 full manual, Bill Long **341/347 memo** (Aug 1964);
link hardware schematics; Titan emulator; full *Electronics* PDF (summary only here).

---

## See also

- [GUIDE.md — turist guide](sources/pdp7-reference/GUIDE.md)
- [TITAN-LINK-PROTOCOL.md](sources/pdp7-reference/TITAN-LINK-PROTOCOL.md)
- [PIXIE User Manual (Appendix 4)](sources/phd-thesis-1972/annotated/07-appendix-4-pixie-user-manual.md)
- [Recovered assembler listing](sources/pixie-assembler-listing-1972/README.md)
- [Lars Brinkhoff — PDP-7 development](../lars-brinkhoff/pdp7-development.md)
- [Show seed — PIXIE pie menus](../../repo-shows/pixie-pie-menus-pdp7/README.md)

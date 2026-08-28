# Cambridge PIXIE hardware stack (~1969)

Human-readable index of the PDP-7 graphics satellite ↔ Titan link and the local DEC manual
shelf. Machine index: `cambridge-pixie-hardware-stack.yml` (same directory).

Full geometry and performance numbers:
[`../../heinz-lemke/pixie-hardware.md`](../../heinz-lemke/pixie-hardware.md).

---

## Stack

### Host graphics (satellite)

| Item | Detail |
|------|--------|
| CPU | **DEC PDP-7** |
| Display | **Type 340** Precision Incremental CRT — vector, **1024×1024**, **P7** phosphor |
| Role | Interactive drawing + light pen; PIXIE radial menus ("lightbuttons"). User at graphics console; application logic often on Titan over high-speed link. |

**Display options (documented or inferred for Cambridge PIXIE):**

| Option | Function |
|--------|----------|
| **Type 342** Symbol Generator | First 64 characters — labels/text on display |
| **Type 370** High Speed Light Pen | Pen input |
| **Type 347** Subroutine Option | Display controller; **DJS/DJP** subroutines |
| **Type 341** Interface | 340 ↔ host; cited in 340 programming manual bibliography |

### Remote compute

| Item | Detail |
|------|--------|
| System | **Titan** (Cambridge Multiple Access System — Atlas-class successor) |
| Role | Application programs, analysis, batch work; PDP-7 as distributed graphics terminal |
| Link | **Wiseman high-speed data link** (Rainbow group; Lang's link software) |

Cambridge link code and PIXIE sources largely lost — separate preservation project.
See [`../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)
and [CUCPS Titan docs](https://cucps.soc.srcf.net/titan/).

---

## Local DEC manuals (this directory)

### Essential

| File | Title |
|------|-------|
| [dec-7-13-type-340-display-programming-manual.pdf](dec-7-13-type-340-display-programming-manual.pdf) | 7-13 Type 340 Display Programming Manual (DECUS) |
| [dec-h-340-type-340-system-nov64.pdf](dec-h-340-type-340-system-nov64.pdf) | H-340 Type 340 Precision Incremental CRT System |

### PDP-7 CPU

| File | Title |
|------|-------|
| [pdp7-f-75p-reference-manual-dec64.pdf](pdp7-f-75p-reference-manual-dec64.pdf) | F-75P PDP-7 Reference Manual |
| [pdp7-f-75-users-handbook-jun65.pdf](pdp7-f-75-users-handbook-jun65.pdf) | F-75 PDP-7 Users Handbook |
| [pdp7-decsys-7-operating-manual.pdf](pdp7-decsys-7-operating-manual.pdf) | DECSYS-7 Operating Manual |
| [pdp7-assembly-language-manual.pdf](pdp7-assembly-language-manual.pdf) | PDP-7 Assembly Language Manual |
| [pdp7-instruction-list.pdf](pdp7-instruction-list.pdf) | PDP-7 Instruction List |

### PDP-7 I/O

| File | Title |
|------|-------|
| [pdp7-interface-manual.pdf](pdp7-interface-manual.pdf) | PDP-7 Interface Manual |
| [pdp7-rim-loader-jul65.pdf](pdp7-rim-loader-jul65.pdf) | RIM Loader |
| [pdp7-ddt-reference.pdf](pdp7-ddt-reference.pdf) | PDP-7 DDT Debugger Reference |

### Display-related

| File | Title | Note |
|------|-------|------|
| [pdp7-type-34-display-test-apr65.pdf](pdp7-type-34-display-test-apr65.pdf) | MAINDEC 7-60N Type 34 Display Test | Earlier display family; Lars open-simh branch `lars/pdp7-type34` |
| [pdp7-370-light-pen-diagnostic-apr64.pdf](pdp7-370-light-pen-diagnostic-apr64.pdf) | MAINDEC 7-78M Type 370 Light Pen Diagnostic | |
| [dec-348-display-manual-1964.pdf](dec-348-display-manual-1964.pdf) | Type 348 Manual (1964) | Related DEC display family |
| [dec-pdp4-340-experimental-display-system.pdf](dec-pdp4-340-experimental-display-system.pdf) | PDP-4 / Type 340 Experimental Display System | 340 architecture evolution |

**Bitsavers:** [PDP-7](http://bitsavers.trailing-edge.com/pdf/dec/pdp7/) ·
[graphics](http://bitsavers.trailing-edge.com/pdf/dec/graphics/)

Also mirrored under [`../../heinz-lemke/sources/pdp7-reference/`](../../heinz-lemke/sources/pdp7-reference/README.md).

---

## Manuals cited but not on bitsavers (Jul 2026 search)

| ID | Title | PIXIE relevance |
|----|-------|-----------------|
| H-342 | 342 Symbol Generator Technical Manual | Character labels on radial menus |
| F-03-370 | 370 High Speed Light Pen (Computer Options) | Partial: 370 diagnostic above |
| memo-341-347 | Type 341 Interface and Type 347 Subroutine Options (Bill Long, 1964-08-18) | |
| drawing-A342 | 342 Shift-In First 64 Character Generator drawing #A342-0-9 | |

---

## Cambridge software and papers (web)

| Title | URL |
|-------|-----|
| PIXIE paper (1969 CAD Conference) | https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf |
| Myer & Sutherland, *On the Design of Display Processors* (CACM 1968) — wheel of reincarnation; names 340–347 | [`../../../ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md`](../../../ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md) |
| Titan / PDP-7 link software notes | https://cucps.soc.srcf.net/titan/supplan/pd10.htm |
| Cambridge Lab EDSAC99 history | https://www.cl.cam.ac.uk/events/EDSAC99/history.html |
| 1969 PIXIE films (Chapman digitization) | https://www.cl.cam.ac.uk/library/archives.html |

**Show:** [`../../../repo-shows/pixie-pie-menus-pdp7/README.md`](../../../repo-shows/pixie-pie-menus-pdp7/README.md)

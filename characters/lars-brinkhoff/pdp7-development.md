# PDP-7 development — manuals, toolchain, Lars repos

Reference for PIXIE emulation segment. Standards: [portrayal standards](../../schemas/portrayal-standards.md)  
Machine index: [`pdp7-development.yml`](pdp7-development.yml) · **Updated:** 2026-07-03

**Show:** [PIXIE trio](../../repo-shows/pixie-pie-menus-pdp7.yml)

---

## Hardware stack

→ [cambridge-pixie-hardware-stack.yml](media/reference/cambridge-pixie-hardware-stack.yml) · [MANIFEST](media/reference/MANIFEST.yml)

### CPU and system manuals (local)

| File |
|------|
| [pdp7-f-75p-reference-manual-dec64.pdf](media/reference/pdp7-f-75p-reference-manual-dec64.pdf) |
| [pdp7-f-75-users-handbook-jun65.pdf](media/reference/pdp7-f-75-users-handbook-jun65.pdf) |
| [pdp7-decsys-7-operating-manual.pdf](media/reference/pdp7-decsys-7-operating-manual.pdf) |
| [pdp7-assembly-language-manual.pdf](media/reference/pdp7-assembly-language-manual.pdf) |
| [pdp7-instruction-list.pdf](media/reference/pdp7-instruction-list.pdf) |
| [pdp7-interface-manual.pdf](media/reference/pdp7-interface-manual.pdf) |
| [pdp7-rim-loader-jul65.pdf](media/reference/pdp7-rim-loader-jul65.pdf) |
| [pdp7-ddt-reference.pdf](media/reference/pdp7-ddt-reference.pdf) |

**Bitsavers index:** http://bitsavers.trailing-edge.com/pdf/dec/pdp7/

### Type 340 display

| File |
|------|
| [dec-7-13-type-340-display-programming-manual.pdf](media/reference/dec-7-13-type-340-display-programming-manual.pdf) |
| [dec-h-340-type-340-system-nov64.pdf](media/reference/dec-h-340-type-340-system-nov64.pdf) |
| [dec-pdp4-340-experimental-display-system.pdf](media/reference/dec-pdp4-340-experimental-display-system.pdf) |

**Bitsavers graphics:** http://bitsavers.trailing-edge.com/pdf/dec/graphics/

### Light pen

- Local: [pdp7-370-light-pen-diagnostic-apr64.pdf](media/reference/pdp7-370-light-pen-diagnostic-apr64.pdf)
- Missing on Bitsavers: H-342 Symbol Generator; F-03(370) Light Pen; 341 Interface + 347 Subroutine memo (Bill Long 1964)

---

## Cross-assemblers and tools

| Tool | Repo | What |
|------|------|------|
| **macro7** | [open-simh/simtools](https://github.com/open-simh/simtools) `crossassemblers/macro7` | Bob Supnik SIMH PDP-7 cross-assembler (host → .lst / binary) |
| **as7** | [DoctorWkt/pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) `tools/as7` | Perl assembler for resurrected PDP-7 Unix v0 source |
| **pdp7-unix** | [DoctorWkt/pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) | `make` / `make run` — not PIXIE/Cambridge software |

---

## How Lars develops

Lars works in the **SIMH emulator layer** (Type 340 / Graphics-II device code, `display.c` integration, light pen) and builds **PDP-7 test programs** with macro7 or hand-assembled display lists. For runnable Unix on PDP-7 he uses DoctorWkt/pdp7-unix + his SIMH forks.

**Munching Squares on PDP-7/340** — planned port from revised PDP-10 Type 340 and Knight TV code (correspondence 2026-07-02); not yet standalone public repo at clone time.

### Workflow

1. Fork/branch SIMH (`old-simh` or `open-simh`) with 340 or `graphics2` device support
2. Build pdp7 emulator: `make pdp7` (often needs `libsdl2-dev` for display window)
3. Assemble PDP-7 code with macro7 on host, load RIM/binary into SIMH script (`.simh`)
4. Or: build pdp7-unix tree, run under Lars's graphics-enabled pdp7 binary
5. Iterate display list + light pen in Type 340 manual format; compare to ITS 340 code paths

---

## Lars repos to clone (PIXIE priority)

| Repo | Branch / note |
|------|----------------|
| [larsbrinkhoff/old-simh](https://github.com/larsbrinkhoff/old-simh) | `lars/340` (Type 340); `lars/graphics2` (Graphics-II, Space Travel) |
| [larsbrinkhoff/open-simh](https://github.com/larsbrinkhoff/open-simh) | `lars/pdp7-type34` |
| [larsbrinkhoff/ka10-simh](https://github.com/larsbrinkhoff/ka10-simh) | KA10 + Type 340 — munching squares / ITS display path |
| [larsbrinkhoff/pdp7-unix](https://github.com/larsbrinkhoff/pdp7-unix) | Fork of DoctorWkt; wiki HOWTO for graphics2 SIMH |
| [larsbrinkhoff/Vector-Display-Simulation](https://github.com/larsbrinkhoff/Vector-Display-Simulation) | Vector display research |

**Supporting:** [open-simh/simtools](https://github.com/open-simh/simtools) (macro7) · [PDP-10/its](https://github.com/PDP-10/its) (issue #644 — 340 on KA10) · [munching-squares.el](https://github.com/larsbrinkhoff/munching-squares.el) · [vt220-munching-squares](https://github.com/larsbrinkhoff/vt220-munching-squares)

**Upstream:** [simh/simh](https://github.com/simh/simh) — `simh/display/display.c` DIS_TYPE340; [issue #754](https://github.com/simh/simh/issues/754) Graphics-II proposal

### Suggested workspace

```bash
mkdir -p ~/GroundUp/git/pdp7-pixie && cd ~/GroundUp/git/pdp7-pixie
git clone https://github.com/larsbrinkhoff/old-simh.git
git clone https://github.com/DoctorWkt/pdp7-unix.git
git clone https://github.com/open-simh/simtools.git
git clone https://github.com/larsbrinkhoff/ka10-simh.git
cd old-simh && git checkout lars/340
```

---

↑ [README](README.md) · [correspondence](correspondence.md) · [invitation](invitation.md) · [media](media/README.md)

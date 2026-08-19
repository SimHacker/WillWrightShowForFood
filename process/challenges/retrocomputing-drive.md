# Retrocomputing Drive

> **Girder:** [`retrocomputing-drive.yml`](retrocomputing-drive.yml) · **Drag race:** [micropolis-ai-drag-race.md](../micropolis-ai-drag-race.md) · **Trail:** [retrocomputing-drive.md](../trails/retrocomputing-drive.md)

**Tagline:** *Retrocomputing AI drag races — pick your language, tools, and platform*

Same spec CARD as the room — but you declare the **whole rig**: programming languages, tools, and target platform. Real hardware, native cross-compile, or emulator — all valid. Cursor + MOOLLM drive the stack you choose. [Slats](../../characters/robots/slats/) judges driver flair; the spreadsheet still gets the piss test.

Fans watch retro AI drag races: who ships on the ][, MACLISP on ITS, the PET, MAME, or a breadboard with honor?

---

## On this page

| Read | In one line |
|------|-------------|
| [What a rig declares](#what-a-rig-declares) | Languages · tools · platforms · emulators |
| [Challenge lanes](#challenge-lanes) | Flair showoff vs measurement vertical |
| [How it runs](#how-it-runs) | Spec drop → branch → demo → proof |
| [Flagship instances](#flagship-instances) | Apple ][ · PDP-10 · Lisp Machine |
| [Navigate](#navigate) | Stacks · rigs · related specs |

---

<a id="what-a-rig-declares"></a>

## What a rig declares

| Axis | Declare honestly |
|------|------------------|
| **Languages** | Host, target, or both — e.g. MACLISP, APPLESOFT/INTEGER BASIC, FORTH, 6502 asm, C, Pascal, Rust on host |
| **Tools** | DDT, SIMH, apple2js, cc65, xa, Cursor, MOOLLM, VICE, MAME, Emularity |
| **Platforms** | Where the spec actually runs — real, emulated, or hybrid |
| **Emulators** | If no real iron — emulator **is** your platform; pin version; demo must boot on stream |

**Rig DNA:** colocate [`rigs/<slug>.SETUP.md`](../../rigs/_TEMPLATE.SETUP.md) — emailable, sniffable, self-replicating ([`rig-setup-dna.yml`](../../schemas/rig-setup-dna.yml)). Sniffable head + raw GitHub URLs for latest rig yaml + LLM idempotent install preserving `.rig/<slug>/state.yml`.

Example platforms:

| Platform | Run on |
|----------|--------|
| PDP-10 / ITS | SIMH + MACLISP, MIDAS |
| Apple ][ | Real floppy, apple2js, MAME, Emularity |
| Symbolics Genera | Portable Genera / Open Genera VLM |
| LMI Lambda | LambdaDelta |
| MIT CADR | usim (ancestor lap) |
| Cross-host | Build modern; demo retro target via emulator or serial |

Stack specs: [`pdp10-its-stack.yml`](../pdp10-its-stack.yml) · [`apple2-emulator-stack.yml`](../apple2-emulator-stack.yml) · [`lisp-machine-stack.yml`](../lisp-machine-stack.yml) (machine girders — `.md` companions pending)

---

<a id="challenge-lanes"></a>

## Challenge lanes

| Lane | Judges | Rule |
|------|--------|------|
| **Flair showoff** | Slats, audience, [brain stream](../brain-stream.md) | Spec ships on declared platform — language/tool choices are the costume. Wrong platform? Sashay. |
| **Measurement vertical** | Spreadsheet, rubric, human | Same rig declaration — optimize cost/shifts while touching real retro I/O ([Manual Transmission](../manual-transmission.md), stick shift, or artisanal) |

Audience chant: **CODE THAT SPEC!!!!!** *(on your platform)*

---

<a id="how-it-runs"></a>

## How it runs

| Step | Action |
|------|--------|
| **Host drops** | Spec CARD — platform constraint optional (*Apple ][ only* or *any retro target*) |
| **Contestant** | `rigs/<persona>.rig.yml` + `rigs/<persona>.SETUP.md` · declare flair vs measurement · implement on branch |
| **Demo** | Screencast, emulator URL, or hardware capture on PR |
| **Commits** | [thoughtful-commitment](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment) — Thinking ref; [homefun grading](../homefun-grading.md) applies |
| **Proof** | Demo on declared platform · rig yaml + SETUP.md pinned · optional spend CSV + cursor-mirror composer id |

---

<a id="flagship-instances"></a>

## Flagship instances

| Instance | Tagline | Girder |
|----------|---------|--------|
| **Apple ][ drive** | *Drive the ][ — INTEGER BASIC if you dare* | [`apple2-drive.yml`](apple2-drive.yml) · example [`apple2-flair-lap.rig.yml`](../../rigs/apple2-flair-lap.rig.yml) |
| **PDP-10 MACLISP drive** | *Write in MACLISP on a PDP-10 emulator running ITS!* | [`pdp10-maclisp-drive.yml`](pdp10-maclisp-drive.yml) · example [`pdp10-maclisp-flair-lap.rig.yml`](../../rigs/pdp10-maclisp-flair-lap.rig.yml) |
| **Lisp Machine hack-off** | *Symbolics vs LMI — the battle continues* | [`lisp-machine-hack-off.yml`](lisp-machine-hack-off.yml) · example rigs: Symbolics + LMI |

**Future seeds:** C64 PETSCII lap · Atari 8-bit · real iron only (no emulator — breadboard or attic hardware)

**Anchor guests:** [Lars Brinkhoff](../../characters/lars-brinkhoff/README.md) (PDP-10 / ITS) · [Thomas Cherryhomes](../../characters/thomas-cherryhomes/README.md) (real ][ on FujiNet — pairs with Apple2 drive)

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Micropolis AI Drag Race](../micropolis-ai-drag-race.md) | Retro laps in drag-race rotation |
| [Manual Transmission](../manual-transmission.md) | Measurement lane |
| [AI-offs](../ai-offs.md) | Declare class + spend proof |
| [Homefun grading](../homefun-grading.md) | Retro PR rubric |
| [Stick-shift protocol](../stick-shift-protocol.md) | Gear = commit |
| [Rigs README](../../rigs/README.md) | Personas + SETUP DNA |
| [Repo Show skill](../../skills/repo-show/SKILL.md) | Harvest retro technique to `skills/` |

↑ [challenges README](README.md) · [process INDEX](../INDEX.md)

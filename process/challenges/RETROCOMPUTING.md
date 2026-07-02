<!-- GENERATED from `process/challenges/retrocomputing-drive.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:7a842cc0caa1754e -->

# Retrocomputing Drive

> **Girder:** [`retrocomputing-drive.yml`](retrocomputing-drive.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](../markup-facades.yml)

## Pitch

Same spec CARD as the room — but you declare the whole rig: programming languages,
tools, and target platform. Real hardware, native cross-compile, or emulator — all valid.
Cursor + MOOLLM drive the stack you choose. Slats judges driver flair; spreadsheet still
gets the piss test. Fans watch retro AI drag races: who ships on the ][, MACLISP on ITS,
the PET, MAME, or a breadboard with honor?

## Tagline

*Retrocomputing AI drag races — pick your language, tools, and platform*

## Meta

| Key | Value |
|-----|-------|
| **id** | retrocomputing-drive |
| **status** | seed |
| **celebrity_judge** | ../characters/slats/judge-rubric.yml |

## What A Rig Declares

### Languages

- **what:** Host language, target language, or both — declare honestly
- **examples:**
  - MACLISP
  - APPLESOFT_FP_BASIC
  - INTEGER_BASIC
  - FORTH
  - 6502 asm
  - C
  - Pascal
  - Rust_on_host

### Tools

- **what:** Assembler, IDE, emulator front-end, disk tools, AI orchestration
- **examples:**
  - DDT
  - SIMH
  - PDP-10/its
  - apple2js
  - cc65
  - xa
  - Cursor
  - MOOLLM
  - vice
  - MAME
  - Emularity

### Platforms

- **what:** Where the spec actually runs — real, emulated, or hybrid
### Examples

- {"id": "pdp10_its", "emulated": "PDP-10/its + SIMH", "languages": ["MACLISP", "MIDAS"]}
- {"id": "symbolics_genera", "emulated": "Portable Genera / Open Genera VLM", "languages": ["ZetaLisp", "Flavors"]}
- {"id": "lmi_lambda", "emulated": "LambdaDelta", "languages": ["ZetaLisp", "Flavors"]}
- {"id": "mit_cadr", "emulated": "usim", "note": "CADR heritage — ancestor lap"}
- {"id": "apple2", "real": "Apple ][+ with floppy", "emulated": "apple2js, MAME, Emularity"}
- {"id": "commodore64", "emulated": "VICE, Emularity"}
- {"id": "atari8", "emulated": "Altirra, Atari800"}
- {"id": "trs80", "emulated": "SDLTRS, MAME"}
- {"id": "bbc_micro", "emulated": "beebem, MAME"}
- {"id": "cross_host", "note": "Build on modern host; demo on retro target via emulator or serial"}


- **emulators:**
  - when: Platform is retro but you have no real iron — emulator IS your platform
  - rule: Declare which emulator + version; demo must boot on stream
- **setup_md:**
  - what: Colocated rigs/<slug>.SETUP.md — viral Rig DNA (emailable, sniffable, self-replicating)
  - schema: ../../schemas/rig-setup-dna.yml
  - template: ../../rigs/_TEMPLATE.SETUP.md
  - rule: Sniffable head (why/what/CTA) + raw GitHub URLs for latest rig yaml + LLM idempotent
install/upgrade preserving .rig/<slug>/state.yml. Human decides whether agent executes.

## Challenge Lanes

### Flair Showoff

- **declare:** flair_class
- **judges:**
  - Slats
  - audience
  - brain_stream
- **rule:** Spec ships on declared platform — language/tool choices are the costume
- **slats:** Wrong platform for the challenge card? Sashay. Right platform, wrong werk? GOTO 20 with pride.

### Measurement Vertical

- **declare:** stick_shift_or_artisanal
- **judges:**
  - spreadsheet
  - rubric
  - human
- **rule:** Same rig declaration — optimize cost/shifts while touching real retro I/O


## How It Runs

- **host_drops:** Spec CARD — platform constraint optional (e.g. 'Apple ][ only' or 'any retro target')
- **contestant:**
  - rigs/<persona>.rig.yml — document languages, tools, platforms, emulators in components
  - rigs/<persona>.SETUP.md — Rig DNA (template: rigs/_TEMPLATE.SETUP.md; schema: schemas/rig-setup-dna.yml)
  - Declare flair vs measurement + platform lane
  - Implement on branch — screencast, emulator URL, or hardware capture on PR
  - thoughtful-commitment — Thinking ref; homefun grading applies
- **proof:**
  - Demo on declared platform (recording or live boot)
  - Rig yaml + SETUP.md — reproducible toolchain; pin versions
  - Optional: Cursor spend CSV + cursor-mirror composer id

## Flagship Instances

### Apple2 Drive

- **see:** apple2-drive.yml
- **example_rig:** ../../rigs/apple2-flair-lap.rig.yml
- **tagline:** Drive the ][ — INTEGER BASIC if you dare


### Pdp10 Maclisp Drive

- **see:** pdp10-maclisp-drive.yml
- **example_rig:** ../../rigs/pdp10-maclisp-flair-lap.rig.yml
- **tagline:** Write in MACLISP on a PDP-10 emulator running ITS!


### Lisp Machine Hack Off

- **see:** lisp-machine-hack-off.yml
- **example_rigs:**
  - ../../rigs/lisp-machine-symbolics.rig.yml
  - ../../rigs/lisp-machine-lmi.rig.yml
- **tagline:** Symbolics vs LMI — the battle continues


### Future Seeds

- {"id": "c64_drive", "note": "PETSCII flair lap — seed when first rig lands"}
- {"id": "atari800_drive", "note": "Atari 8-bit — seed when first rig lands"}
- {"id": "real_iron_only", "note": "No emulator — breadboard or attic hardware"}


- **Audience Chant:** CODE THAT SPEC!!!!! (on your platform)

## Ties to

| Link |
|------|
| [`apple2-drive.yml`](apple2-drive.yml) |
| [`pdp10-maclisp-drive.yml`](pdp10-maclisp-drive.yml) |
| [`lisp-machine-hack-off.yml`](lisp-machine-hack-off.yml) |
| [`../lisp-machine-stack.yml`](../lisp-machine-stack.yml) |
| [`../apple2-emulator-stack.yml`](../apple2-emulator-stack.yml) |
| [`../pdp10-its-stack.yml`](../pdp10-its-stack.yml) |
| [`../micropolis-ai-drag-race.yml`](../micropolis-ai-drag-race.yml) |
| [`../stick-shift-protocol.yml`](../stick-shift-protocol.yml) |
| [`../../schemas/rig-schema.yml`](../../schemas/rig-schema.yml) |
| [`../../rigs/README.md`](../../rigs/README.md) |
| [`../../characters/slats/judge-rubric.yml`](../../characters/slats/judge-rubric.yml) |

## Related

| Link | Why |
|------|-----|
| [`cross-links.yml#retrocomputing_drive`](cross-links.yml) | Narrative trail — all retro nodes |
| [`RETROCOMPUTING.md`](challenges/RETROCOMPUTING.md) | Generated markup view of this family |
| [`DRAG-RACE.md`](../DRAG-RACE.md) | Retro laps are drag race challenge rotation |
| [`manual-transmission.yml`](../manual-transmission.yml) | Measurement lane — smallest model on retro target |
| [`ai-offs.yml`](../ai-offs.yml) | Declare class + spend proof for AI-assisted retro |
| [`homefun-grading.yml`](../homefun-grading.yml) | Homefun rubric applies to retro PRs |
| [`../../characters/lars-brinkhoff/`](../../characters/lars-brinkhoff/) | PDP-10 anchor — make it so |
| [`../../characters/thomas-cherryhomes/`](../../characters/thomas-cherryhomes/) | Real ][ on FujiNet — pairs with apple2-drive |
| [`rig-setup-dna.yml`](../../schemas/rig-setup-dna.yml) | SETUP.md is Rig DNA — LLM may draft; not facade-registry bulk md |
| [`SKILL.md`](../../skills/repo-show/SKILL.md) | Repo Show harvests retro technique back to skills/ |
| [`constructionism`](https://github.com/SimHacker/moollm/skills/constructionism) | Microworlds — learn by building on your platform |

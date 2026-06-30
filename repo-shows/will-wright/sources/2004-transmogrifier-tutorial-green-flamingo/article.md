# Transmogrifier Tutorial 1: The Green Flamingo

*By Don Hopkins · Wayback capture Mar 2005 · Harvest `big-prompts.txt` (2026).*

**Goal:** Clone the Pink Flamingo (`gamedata/objects/flamingo`) and mutate it into a Green Flamingo.

---

## Prerequisites

1. **Quit The Sims** before running Transmogrifier — they cannot open the same files simultaneously.  
2. Run `Transmogrifier.exe` from The Sims top-level directory (next to `Sims.exe`).

---

## Workflow summary

| Step | Action |
|------|--------|
| 1 | Select `flamingo` in object list — file is **read-only** |
| 2 | **Edit Object** — view name, price, description (read-only until cloned) |
| 3 | **View Object** — single-tile object, one draw group, 3 zooms × 4 rotations; bilateral symmetry → 2 sprites flipped for other rotations |
| 4 | **Clone Object File** — unique filename (e.g. `flamingo813554`), optional **Magic Cookie** (16-bit producer ID from [registry](../2004-transmogrifier-magic-cookie-registry/)) |
| 5 | **Edit Object** — change to "Green Flamingo", lower price, new description |
| 6 | **Export Object File** — Export Whizzer: **Just Change Colors** + **One Zoom, One Channel** (preserves Z-buffers and alpha; auto-generates smaller zooms) |
| 7 | Edit exported BMPs in Photoshop — Hue/Saturation +180 on pink → green; or convert 8-bit palette → 24-bit RGB for detail painting |
| 8 | **Import Object File** — select matching `.xml` export |
| 9 | **View Object** — verify rotations/zooms; anti-aliased edges on white/black backgrounds |
| 10 | Quit Transmogrifier, run The Sims — buy mode → decoration category → place green flamingo; Sims react via speech icon |

---

## Export Whizzer options (reference)

- **Just Change Colors** — export color bitmaps only; keep Z-buffer + alpha in IFF  
- **One Zoom, One Channel** — largest zoom only; smallest zooms generated on import  
- **All Zooms, One Channel** — all zooms for manual touch-up  
- **Compress Bitmap Files** — RLE BMP (default)  
- **Create Sub Directories** — organize sprite tree under `*_sprites/sprite0128/`

---

## Closing advice (Don, original tutorial)

> Be creative, have fun, stop whining, share your creations, give credit to the original artists, and please play together nicely!

---

## What Transmogrifier cannot do (2004 docs)

No slots, sounds, walls, floors, character skins, SimAntics behaviors, etc. — see [Glossary](../2004-transmogrifier-glossary/) and main docs on Wayback.

**Edith** (behavior editor) and **SimShow** (character skins) were documented as separate future tools, unsupported by Maxis/EA.

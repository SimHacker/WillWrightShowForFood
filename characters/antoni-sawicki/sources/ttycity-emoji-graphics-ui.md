# ttycity — emoji / Unicode graphics mode

**Repo:** [tenox7/ttycity](https://github.com/tenox7/ttycity) · **Author:** Antoni Sawicki (Tenox) ·
**Engine:** Micropolis simulation (SimHacker/micropolis fork) · **License:** GPL v3

---

## The hook

Terminal SimCity with a **pluggable graphics ladder** — press **`u`** in-game to cycle modes. Unicode
mode uses **two columns per map tile** and emoji buildings; Antoni's verdict: *"Yeah the unicode emoji
graphics is surprisingly pretty!"*

## Rendering ladder

| Flag | Cols/tile | Look |
|------|-----------|------|
| `-gfx standard` (default) | 1 | Classic curses — ASCII + ACS line drawing, 8 colors |
| `-gfx unicode` | 2 | UTF-8 emoji buildings/vehicles; box-drawing roads; braille terrain; quadrant-block density |
| `-gfx ascii` | 1 | Strict 7-bit vt100 — bold/reverse only |
| `-gfx aa` | 2 | Optional aalib color render |

Unicode mode needs UTF-8 locale + wide-capable ncurses (ncursesw on Linux). Themes: `-theme tan|grass|dark`.

## UI shell

Single binary — scenarios and cities baked in (`cities/*.cty`). Min **80×24**. hjkl/arrows build;
Shift+letter tools; `m` overview/minimap; mouse click build, drag pan, wheel scroll. Esc/F10 menu bar;
clickable palette and minimap in unicode mode.

## Emoji tile map (highlights)

| Layer | Glyphs |
|-------|--------|
| Roads | Box-drawing auto-tile; yellow glow on light traffic; 🚗/🚕 on jams |
| Rails | Double-line box glyphs |
| Terrain | Braille stipple; water with random 🦀 ⛵ 🐟 |
| Zones | 🛖→🌇 residential; 🏪→🏦 commercial; 🏭 industrial; 🏗 construction |
| Services | 🏥 ⛪ 🚒 👮 🛫 ⚓ 🔌 … |

Same Micropolis `Map[]` decode as classic mode — only `GfxOps` swap.

## Why surprisingly pretty

- Two-column tiles align emoji without breaking ncurses grid.
- Road/rail/wire auto-tiling joins seamlessly eastward.
- Zone density fills lot cells with icons instead of abstract blocks.
- Stable per-cell hash adds variety without RNG desync.

## Interview beats

- Demo unicode mode live; press `u` through standard → emoji → ascii.
- Walk `nc_gfx.c` — pluggable GfxOps, one engine four faces.
- Why emoji are valid portability strategy for SimCity.
- Pre-HN roadmap: kinks, multi-platform binaries, contributions.
- Show Will the README credit line on air.

## Media

- Repo README screenshot: `../media/ttycity-emoji-ui-screenshot.png`
- Antoni email Jul 7 2026 PM screenshots (attachments — not in repo)

↑ [Email thread](2026-07-08-ttycity-email-thread.md) · [Sources index](README.md) · [show seed](../../../repo-shows/antoni-sawicki-ttycity/README.md)

# Antoni Sawicki (Tenox) 🖥️🏙️📟 *(retrocomputing engineer · serial Micropolis porter)*

*Portrayal of a real correspondent, written by Don — not Antoni, and not his words. Antoni may
correct, shape, reduce, or delete any of it.* [Portrayal standards](../../schemas/portrayal-standards.md)

**Point Antoni here:** this directory is his room in the repo — character card, sources, emoji UI
spec, interview plan, and draft invitation.

## Who

**Antoni Sawicki** — **Tenox** — [antoni@sawicki.cc](mailto:antoni@sawicki.cc) — has been putting
software where software was never supposed to go since [tenox.net](https://www.tenox.net/) went up in
**1994**. VirtuallyFun contributor; [github.com/tenox7](https://github.com/tenox7).

On **7 Jul 2026** he emailed Don: *"you may be interested in this"* + [ttycity](https://github.com/tenox7/ttycity).
On **8 Jul 2026** he clarified: **that's his own project** — not on Hacker News yet; ironing kinks;
binaries for more platforms; contributions welcome. On the **unicode emoji graphics**: *"surprisingly
pretty!"*

## ttycity — Micropolis for the terminal 🏙️→📟

| | |
|---|---|
| **Engine** | Original Micropolis simulation, untouched |
| **Binary** | One file — all scenarios/cities baked in |
| **Themes** | `tan` · `grass` · `dark` |
| **Play** | ssh-friendly; hjkl; mouse; minimap; down to 80×24 |
| **License** | GPL v3 — credits **Will Wright** / SimCity Classic |

### The emoji UI (unicode mode)

Press **`u`** to cycle graphics modes. **`-gfx unicode`** is the headline: **two terminal columns
per map tile**, UTF-8 emoji for buildings and vehicles, box-drawing for roads/rails/power, braille
stipple for terrain, quadrant fills for zone density.

| World | Emoji / glyphs |
|-------|----------------|
| Residential | 🛖 🏠 🏡 → 🌇 at max density+value |
| Commercial | 🏪 🏬 🏢 → 🏦 |
| Industrial | 🏭 |
| Roads | Auto-tiled ╋ ━ ┃ …; jams 🚗 🚕 |
| Water | Braille waves; 🦀 ⛵ 🐟 |
| Services | 🏥 ⛪ 🚒 👮 🛫 ⚓ 🔌 |
| Disasters | 🔥 🌊 ☢ ⚡ |

Full tile map and rendering ladder: [`sources/ttycity-emoji-graphics-ui.yml`](sources/ttycity-emoji-graphics-ui.yml)

![ttycity emoji UI](media/ttycity-emoji-ui-screenshot.png)

Implementation lives in `src/nc_gfx.c` on [tenox7/ttycity](https://github.com/tenox7/ttycity) — pluggable **GfxOps** so one engine renders as classic curses, emoji, vt100 ascii, or aalib.

Also: **wintown** — Micropolis on Windows NT RISC (Alpha, MIPS, PowerPC, Itanium, ARM).

## Interview planned

Repo show about a repo — [`repo-shows/antoni-sawicki-ttycity.yml`](../../repo-shows/antoni-sawicki-ttycity.yml)

Beats: [`ideas.md`](ideas.md) · invitation: [`invitation.md`](invitation.md)

## Artifacts

| | Path |
|---|------|
| Character | [`CHARACTER.yml`](CHARACTER.yml) |
| Email thread | [`sources/2026-07-08-ttycity-email-thread.yml`](sources/2026-07-08-ttycity-email-thread.yml) |
| Emoji UI spec | [`sources/ttycity-emoji-graphics-ui.yml`](sources/ttycity-emoji-graphics-ui.yml) |
| Show seed | [`../../repo-shows/antoni-sawicki-ttycity.yml`](../../repo-shows/antoni-sawicki-ttycity.yml) |

## Related

- [Will Wright](../will-wright/README.md) — SimCity designer; show him the emoji city
- [Peter Scott](../peter-scott/README.md) — BBC 20K SimCity 1989 — same lineage, different decade
- [Open-source saga](../will-wright/sources/simcity-open-source-saga/README.md) — how the fork started

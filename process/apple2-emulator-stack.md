# Apple II emulator stack

[Retrocomputing challenges](challenges/RETROCOMPUTING.md) · [Apple2 drive](challenges/apple2-drive.yml) · [FujiNet bridge](apple2-fujinet-bridge.md)

---

## The hook

Public pointer — authoritative layers live in DonHopkins. Layered stack: L0 raw disk I/O → L1 DOS/ProDOS/UCSD → L2 per-game drivers. **apple2js** for live hot-write; Emularity/MAME complementary.

Show: retrocomputing-drive family — rig declares languages, tools, platform, emulator.

## Show hooks

- **Slats RoboResurrection:** Legacy Slats in emulator — optional segment.
- **FujiNet three-phase:** native / browser / optional WASM hub.

## Deeper links

| Topic | Where |
|-------|--------|
| Thomas Cherryhomes | [../characters/thomas-cherryhomes/](../characters/thomas-cherryhomes/) |
| Slats reincarnation | [../repo-shows/will-wright-premiere/slats-reincarnation.md](../repo-shows/will-wright-premiere/slats-reincarnation.md) |

↑ [process index](README.md) · Girder: `apple2-emulator-stack.yml`

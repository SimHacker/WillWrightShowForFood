# Antoni Sawicki (Tenox) 🖥️🏙️📟 *(retrocomputing engineer · serial Micropolis porter)*

*Portrayal of a real correspondent, written by Don — not Antoni, and not his words. Antoni may
correct, shape, reduce, or delete any of it.* [Portrayal standards](../../schemas/portrayal-standards.md) ·
invitation drafted, not sent · authored by Don Hopkins

## Who

**Antoni Sawicki** — **Tenox** — has been putting software where software was never supposed to go
since his personal site went up in **1994**. VirtuallyFun contributor, keeper of
[github.com/tenox7](https://github.com/tenox7): ttyplot, the Web Rendering Proxy (modern web on
vintage browsers), NT Games, OpenTTD rebuilt for Alpha, MIPS, and PowerPC.

In July 2026 he emailed Don two words that earned a whole show: *"you may be interested in this."*

## ttycity — Micropolis for the terminal 🏙️→📟

**[github.com/tenox7/ttycity](https://github.com/tenox7/ttycity)** — SimCity in your terminal:

| | |
|---|---|
| **Engine** | Original Micropolis simulation, preserved as-is |
| **Rendering** | Four modes: classic curses (8 colors) · **Unicode emoji tiles** · 7-bit vt100 ASCII · aalib |
| **Distribution** | Everything baked into one binary — scenarios, cities, no installs |
| **Controls** | Arrows or **hjkl**, mouse clicks, clickable menus and minimap, resizable down to 80×24 |
| **License** | GPL v3, forked from [SimHacker/micropolis](https://github.com/SimHacker/micropolis/) — credits "SimCity Classic from Maxis, by Will Wright" |

A city you can play over ssh. Zone residential with an emoji. The 1989 simulator, the 1978
terminal discipline, and the 2020s emoji set in one screen.

And it's not his first: **wintown** already put Micropolis on **Windows NT RISC** — Alpha, MIPS,
PowerPC, Itanium, ARM. Antoni ports cities the way other people collect stamps.

## Why the show cares

- **Same medium, exact fit.** ttycity is a GitHub repo; this show is a GitHub repo. A repo show
  about a repo — interview the dev, browse the source, build a city live in the terminal.
- **Proof of the mandate.** Walter Bender asked game developers for free games kids can view the
  source of and build on. Don freed SimCity as Micropolis in 2008. Antoni is what the mandate
  looks like eighteen years on: fork, port, ship, credit.
- **Robots in the toolchain.** For his OpenTTD NT RISC port, Antoni used LLMs — *"a tireless army
  of robots"* — to downgrade modern code to Visual C 4.0. Humans author, AI does the mechanical
  rewrites, dead platforms live. That's this show's production model wearing a retro jacket.
- **Show it to Will.** The README credits Will by name. Will designed SimCity on a machine less
  powerful than the terminal emulator now rendering it in emojis.

## Show & artifacts

| Artifact | Path |
|----------|------|
| Show seed | [`repo-shows/antoni-sawicki-ttycity.yml`](../../repo-shows/antoni-sawicki-ttycity.yml) |
| Invitation (draft) | [`invitation.md`](invitation.md) |
| First contact | [`sources/2026-07-07-ttycity-email.md`](sources/2026-07-07-ttycity-email.md) |
| Character girder | [`CHARACTER.yml`](CHARACTER.yml) |

## Related people & threads

- [Will Wright](../will-wright/README.md) — SimCity's designer; ttycity's README credits him
- [The open-source saga](../will-wright/sources/simcity-open-source-saga/README.md) — how the code got freed
- [Lars Brinkhoff](../lars-brinkhoff/invitation.md) · [Thomas Cherryhomes](../../repo-shows/INDEX.yml) — the retrocomputing wing of the guest roster
- [Micropolis AI Drag Race](../../repo-shows/micropolis-ai-drag-race.yml) — Retrocomputing Drive challenge; ttycity is a ready-made vehicle

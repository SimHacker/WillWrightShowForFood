# Logo Adventure — C64 Terrapin Logo (first commercial code)

**Apr 27, 2018** · Don Hopkins · [Medium](https://medium.com/@donhopkins/logo-adventure-for-c64-terrapin-logo-4c684a240b53)

At **17**, Don shipped his **first paid commercial code** on Terrapin's **C64 Logo Utilities Disk**: a
text adventure that uses the **Logo read-eval-print loop as the parser** — no custom grammar engine.

## The trick

Classic Scott Adams–style adventures ship **world-as-data + tiny interpreter**. Logo Adventure inverts
the interpreter half: the **Logo top level** already parses commands. Don defined words — `LOOK`, `N`,
`S`, `E`, `W`, `TAKE`, `EXAMINE`, `GET`, `DROP`, `WAVE`, `FIX`, `SCORE`, `DONE` — and each word ends
by calling `CMD`, which prints `COMMAND` and jumps to `TOPLEVEL`.

```logo
TO CMD
 PR []
 PRINT1 "COMMAND
 TOPLEVEL
END
```

Startup: `MAKE "STARTUP [ADVENTURE]` so loading the disk auto-starts the game.

**Cheat-friendly by design:** because the world lives in ordinary Logo lists and globals (`ITEMS`,
`RMOVES`, `RNAMES`, `RNUM`), you can inspect and patch the model from the REPL. Don: that helps you
**learn Logo**.

## Model (three structures + player)

| Structure | Role |
|-----------|------|
| `RNAMES` | Room descriptions (1-based list indexes) |
| `RMOVES` | Per room: `[N E S W]` → room number or `0` (one-way doors allowed) |
| `ITEMS` | `[room score name]` — room `-1` = inventory, `0` = nowhere |
| `RNUM` | Player's current room |

Five rooms: weapon shop, vault, toolshed, altar, secret incanting room. Puzzle arc: broken `MACHINE` +
`SCREWDRIVER` → `WAND` → `WAVE` toggles altar ↔ secret room. Perfect score: **550**.

## INITITEMS — metaprogramming the noun vocabulary

The sneaky center: **`INITITEMS`** walks `ITEMS` and **`DEFINE`s a zero-argument function for each item
name** (`SWORD`, `HATCHET`, …). Each body is `[OP SETIT "SWORD]` (etc.), so typing `SWORD` sets global
`IT` and returns the name — enabling `GET SWORD` then `DROP IT`.

Recursive list processing (`FIRST`, `BF`, `IFT`/`IFF`) + runtime `DEFINE` = Logo as **self-extending
command language**. Don unpacks the `DEFINE`/`LPUT`/`WORD` expression in the Medium post (with a
parenthesized Lisp-style reading).

## Lineage in this repo

| Thread | Link |
|--------|------|
| Career bundle entry | [`career/lineage.yml`](career/lineage.yml) — `Logo Adventure` → MOOLLM |
| Scott Adams — adventure-as-data | [`../../repo-shows/scott-adams/invitation.md`](../../repo-shows/scott-adams/invitation.md) |
| MOOLLM — REPL-as-parser, rooms = directories | [`moollm-microworld-os-talk.md`](moollm-microworld-os-talk.md) · [`GLANCE.yml`](GLANCE.yml#future) |
| Constructionism / Logo | [`../brian-harvey/`](../brian-harvey/README.md) · [`../jens-monig/`](../jens-monig/README.md) · [`../../repo-shows/snap-logo-brian-jens.yml`](../../repo-shows/snap-logo-brian-jens.yml) |
| Papert / MIT-AI LLogo taste | [`career/lineage.yml`](career/lineage.yml) — `roots.played` |
| Adventure compiler (future) | [`ideas.md`](ideas.md#compile-the-adventure-future) |

## Show fodder

- **REPL-as-parser:** Logo Adventure (1980s) → MOOLLM (LLM chat REPL) — same architecture, different interpreter.
- **Live on air:** extend `ITEMS` / `RMOVES` from the Logo prompt; demonstrate one-way doors and score math.
- **With Scott Adams:** 16K adventure-as-data → Logo lists → YAML rooms → compiled browser palace.
- **With Brian + Jens:** what Snap! inherited from this Logo style of list + procedure literacy.

## Primary source

Full walkthrough + complete program listing:
[Logo Adventure for C64 Terrapin Logo](https://medium.com/@donhopkins/logo-adventure-for-c64-terrapin-logo-4c684a240b53)
(Medium, Apr 27, 2018). Author: Don Hopkins.

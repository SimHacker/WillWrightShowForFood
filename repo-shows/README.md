# repo-shows/

**A flat registry of Repo Show directories** — one directory per entry, no
nesting, referenced by id, exactly like [`../characters/`](../characters/README.md).
Each inherits [`skills/repo-show/`](../skills/repo-show/README.md).

> *"So you have a Repo to Show us?"*

**Format pitch:** A TV/streaming show about **developing and playing** games & tools — using AI the
best way (people author; AI orchestrates and writes code). [`../bits/tradition-make-play-tools-show/tradition-make-play-tools-show.yml`](../bits/tradition-make-play-tools-show/tradition-make-play-tools-show.yml)

## The registry model

Every entry is a directory: `<name>/<name>.yml` seed at minimum, growing
whatever it needs. **Every show directory has a human `README.md` front page**
— warm prose, images, real links. Yaml girders are for machines.
**`SHOW.yml` is added later** when the show is ready to run as
interface + state — lazy prototype promotion; the seed yml keeps its name.
The *kind* of an entry — show, idea, series, episode, pack, performance,
memorial, reunion, bridge — lives in its data, not in the directory tree.
Recombination happens by reference (`parents:`, `relates_to:`, `cast:` —
see [`REFACTOR.md`](REFACTOR.md) §2b), never by nesting. Big-endian names
group families in `ls`: `flipbook-*`, `game-bridge-*`, `remembering-*`,
`will-wright-premiere*`.

Cross-cutting material lives in sibling registries: performable bits in
[`../bits/`](../bits/README.md), programming arcs in
[`../process/tracks/`](../process/tracks/README.md).

## Read order

1. [`GLANCE.yml`](GLANCE.yml)
2. [`INDEX.yml`](INDEX.yml) — catalog: planted shows, seeds by format, ideas, packs
3. [`REPO-SHOWS.yml`](REPO-SHOWS.yml) — collection manifest (implicit inheritance)
4. Flagship: [`will-wright-premiere/README.md`](will-wright-premiere/README.md) · [**BROWSE**](will-wright-premiere/BROWSE.md)

## Landmarks

| Entry | What |
|-------|------|
| **will-wright-premiere/** ★ | 1996 Winograd talk — premiere Repo Show |
| [`will-wright-premiere-ideas/`](will-wright-premiere-ideas/README.md) | Its content pack (episode seeds, content map) |
| [`micropolis-ai-drag-race/`](micropolis-ai-drag-race/README.md) | Drag race variety game show |
| [`ca-machinima-cabaret-drag-race/`](ca-machinima-cabaret-drag-race/README.md) | CA Machinima CAbaret Drag Race — sister runway |
| lars-brinkhoff/ · heather-and-steve-alvey/ · jason-shankel/ | Planted guest shows |
| `flipbook-*/` | Flipbook packs ([format room: `flipbook/`](flipbook/README.md)) |

## Lifecycle

`SEED` (`<name>/<name>.yml` + `README.md`) → `PLANT` (add `SHOW.yml` when ready to run) → `AIR` → `HARVEST` → [`skills/`](../skills/README.md)

Read order inside a show directory: **README.md** (human) → seed yml (machine) → `SHOW.yml` (runtime, when present).

Full protocol: [`skills/repo-show/SKILL.md`](../skills/repo-show/SKILL.md) ·
Refactor rationale: [`REFACTOR.md`](REFACTOR.md)

## Related

| Direction | Link |
|-----------|------|
| Up | [`../README.md`](../README.md) |
| Guests | [`../characters/`](../characters/README.md) |
| Bits | [`../bits/`](../bits/README.md) |
| Tracks | [`../process/tracks/`](../process/tracks/README.md) |
| Process | [`../process/repo-show-format.md`](../process/repo-show-format.md) |
| Network | [`../process/showmaker-network.md`](../process/showmaker-network.md) |

# MicropolisCore — design docs, packages, code, content

Don's active **open-source SimCity** monorepo — C++ engine → WASM, SvelteKit shell, WebGPU holodeck,
Simopolis / MOOLLM federation vision. Live: [micropolisweb.com](https://micropolisweb.com).

**Repo:** [github.com/SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore)

→ Career thread: [`open-sourcing-simcity-for-olpc.md`](open-sourcing-simcity-for-olpc.md) · [`porter-duff-postscript-to-webgpu.md`](porter-duff-postscript-to-webgpu.md)

---

## Start here (design intent)

| Doc | Why read it |
|-----|-------------|
| [ELEVATOR-PITCH.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/ELEVATOR-PITCH.md) | Micropolis Federation in one page |
| [characters-as-hydrogen.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/characters-as-hydrogen.md) | Characters as federation atoms — read first for Simopolis |
| [simopolis.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/simopolis.md) | Micropolis + The Sims under one umbrella |
| [moollm-microworld-os.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/moollm-microworld-os.md) | MOOLLM agent layer on Simopolis |
| [designs/README.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/README.md) | Full design index (60+ notes) |
| [platform-lineage-index.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/platform-lineage-index.md) | NeWS → OLPC → Wasm/WebGPU eras |

## Playable game + pies (active cauldron)

| Doc | Why read it |
|-----|-------------|
| [playable-pie-publishing-cauldron/](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/playable-pie-publishing-cauldron) | Three pillars: playable slice, pie substrate, federated publishing |
| [micropolis-playable-game-readiness.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/micropolis-playable-game-readiness.md) | Evidence-based path to "actually playable" |
| [piecraft/README.md](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft) | PieCraft + SimCity totem-pole palette |
| [unified-webgpu-renderer.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/unified-webgpu-renderer.md) | Holodeck compositor + pie layers |
| [virtual-pointer-and-pie-cursors.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/virtual-pointer-and-pie-cursors.md) | Pie cursors + gestural UI |

## Rendering + imaging

| Doc | Why read it |
|-----|-------------|
| [render-core-package.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/render-core-package.md) | `@micropolis/render-core` HolodeckStage |
| [renderer-plugin-roadmap.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/renderer-plugin-roadmap.md) | Canvas / WebGL / WebGPU plugins |
| [map-compositing-and-measurement.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/map-compositing-and-measurement.md) | Overlay planes, measure protocol, vote preview |
| [wasm-bridge-and-testing-trajectory.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/wasm-bridge-and-testing-trajectory.md) | Embind, Vitest, reactive bridge |

## Multiplayer, Git, MOOLLM integration

| Doc | Why read it |
|-----|-------------|
| [collaborative-microworld-lineage.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/collaborative-microworld-lineage.md) | Engelbart → Kay → Papert → SimCityNet |
| [github-as-mmorpg-multiverse.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/github-as-mmorpg-multiverse.md) | Branches/PRs as world mechanics |
| [command-path-collaboration-modes.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/command-path-collaboration-modes.md) | Command bus + live/async collab |
| [filesystem-object-model.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/filesystem-object-model.md) | Self-style prototypes + CARD ads |
| [moollm-micropolis-integration.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/moollm-micropolis-integration.md) | Skills, MCP, GitHub compose |

## Story, album, federation bridges

| Doc | Why read it |
|-----|-------------|
| [family-album-as-storymaker.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/family-album-as-storymaker.md) | Family Album → branching story graph (Don's 35-year thread) |
| [the-imagine-loop.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-imagine-loop.md) | LLM narrator, not LLM simulator |
| [the-computer-as-portal.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md) | Sims Computer object uplift |
| [federation-peer-games.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md) | CK3, RimWorld, SPD bridge targets |
| [og-cozy-games.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/og-cozy-games.md) | Sims as OG cozy game — design receipts |

## HCI + Don history

| Doc | Why read it |
|-----|-------------|
| [interaction-design-articles-index.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/interaction-design-articles-index.md) | Pie menus, Fitts, accessibility, agents |
| [micropolis-web-hn-2024.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/micropolis-web-hn-2024.md) | micropolisweb.com launch ([HN 40693944](https://news.ycombinator.com/item?id=40693944)) |
| [cadroid-cforth-1987.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/cadroid-cforth-1987.md) | Sun internship — CForth in CADroid |
| [designing-inward-miyamoto-principles.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/designing-inward-miyamoto-principles.md) | Miyamoto + McCloud masking effect |

---

## Packages (monorepo)

| Package | Path | Role |
|---------|------|------|
| **micropolis-engine** | [`packages/micropolis-engine/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/micropolis-engine) | C++ sim core → WASM (Embind) |
| **tile-renderer** | [`packages/tile-renderer/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/tile-renderer) | Canvas 2D / WebGL / WebGPU tile plugins |
| **render-core** | [`packages/render-core/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/render-core) | Holodeck compositor, MapViewport |
| **sims-io** | [`packages/sims-io/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/sims-io) | Sims 1 IFF / save pipeline (L0–L3) |
| **vitamoo** | [`packages/vitamoo/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/vitamoo) | VitaBoy / Sims animation WebGPU path |
| **mooshow** | [`packages/mooshow/`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/mooshow) | MOO-style show runtime |

## Apps + content

| Path | Role |
|------|------|
| [`apps/micropolis/`](https://github.com/SimHacker/MicropolisCore/tree/main/apps/micropolis) | SvelteKit app + CLI + `TileView.svelte` |
| [`content/micropolis/`](https://github.com/SimHacker/MicropolisCore/tree/main/content/micropolis) | Cities (.cty), tilesets, sounds, scenarios |
| [`documentation/`](https://github.com/SimHacker/MicropolisCore/tree/main/documentation) | Manuals, talks, OpenLaszlo archive, historical |
| [`documentation/openlaszlo/`](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/openlaszlo) | Frozen TurboGears/Laszlo web era snapshot |

## Demos

- [Micropolis Web Demo 1](https://www.youtube.com/watch?v=wlHGfNlE8Os)
- [Tile sets, Space Inventory, CA](https://www.youtube.com/watch?v=319i7slXcbI)

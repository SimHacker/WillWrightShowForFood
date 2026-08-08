# 🚧 Under Development

*Palmhoo topic — software, modules, and designs that are being built right now: the workbenches,
not the museum.*
↑ [Palmhoo root](../README.md) · [Constitution](../CONSTITUTION.md)

🐒✋ *The other shelves hold finished thoughts. This one holds sawdust. Every entry is moving, so
every note here has a shorter half-life than anywhere else in Palmhoo — which makes this shelf
the best test case for [summary journalism](../JOURNALISM.md). Most entries point at a GLANCE,
CARD, or README the project already keeps; where those are good, Palmhoo borrows rather than
rewrites.*

## WWSFF — the show's own machinery

| Entry | Status | 🐒✋ Why you'd look |
|-------|--------|--------------------|
| [**apps/**](../../apps/README.md) | scaffold + first apps | The honest README says "nothing shipped yet" — then lists what's coming: stream overlay, Windows companion, OBS toys. Watch this space literally. |
| [**stream-gateway**](../../apps/stream-gateway/GLANCE.yml) | seed | The brain bus: SSE overlay + Twitch/YouTube chat, spec'd in [brain-stream.yml](../../process/brain-stream.md). Live Cursor on a stream overlay. |
| [**micropolis-angel**](../../apps/micropolis-angel/) | native scaffold | A WinUI 3 + WebView2 Windows companion for Micropolis. |
| [**packages/wwsff-tooling**](../../packages/README.md) | early | Where code that generalizes across shows gets extracted — the `@wwsff/*` layer under the skills layer. |
| [**rigs/**](../../rigs/README.md) | growing | Bring-your-own-rig setups, from artisanal VS Code to a PDP-10 MacLisp lap rig. Each rig is a reproducible way to attend a show. |
| [**skills/repo-show**](../../skills/repo-show/README.md) | active | The show orchestrator protocol itself — the first big lift target of the whole repo. |

## MicropolisCore — the city's engine room

| Entry | Status | 🐒✋ Why you'd look |
|-------|--------|--------------------|
| [**micropolis-engine**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/micropolis-engine) | active | The C++ simulation core, compiled to WASM — SimCity's beating heart as an embeddable package. |
| [**tile-renderer**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/tile-renderer) · [**render-core**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/render-core) | active | The display stack, split into reusable parts — the same separation that lets ttycity draw the city in emoji. |
| [**sims-io**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/sims-io) | active | File formats and data portability — the crown-jewel theme of Will's premiere (Proxi ↔ Sims ↔ …). |
| [**mooshow**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/mooshow) · [**vitamoo**](https://github.com/SimHacker/MicropolisCore/tree/main/packages/vitamoo) | early | Where MOOLLM meets Micropolis — show tooling and the VitaMOO experiments. |
| [**apps/micropolis · vitamoospace · yoot**](https://github.com/SimHacker/MicropolisCore/tree/main/apps) | active | The deployable fronts: the playable city, the MOO space, and the Yoot Tower work. |
| [**MicropolisReactive.svelte.ts**](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/src/lib/MicropolisReactive.svelte.ts) | active | Svelte 5 runes bridge — WASM callbacks → `$state`, `peek`/`poke`, `getSnapshot` for Snap! and MCP. See [constraint bridge digest](../../characters/don-hopkins/sources/micropolis-svelte-snap-constraint-bridge.md). |

## MOOLLM — the operating system's kernel

| Entry | Status | 🐒✋ Why you'd look |
|-------|--------|--------------------|
| [**kernel/**](https://github.com/SimHacker/moollm/tree/main/kernel) | active | Architecture, protocols (context assembly, event logging, memory, self-healing), naming, drivers. The part of MOOLLM that isn't a skill — the part skills stand on. |
| [**kernel/ARCHITECTURE.md**](https://github.com/SimHacker/moollm/blob/main/kernel/ARCHITECTURE.md) | living doc | The system diagram in prose. Read before proposing kernel changes. |
| [**cursor-mirror**](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) | active | Introspection tooling over Cursor session history — the instrument for watching the coherence engine at work. |
| [**Skills catalog**](https://github.com/SimHacker/moollm/tree/main/skills) | accreting daily | 139 on disk at last count; the count is a [tracked coherence dependency](../coherence.yml) now, not a fact. |

## Dreams (pre-development, declared)

| Entry | Status | 🐒✋ Why you'd look |
|-------|--------|--------------------|
| [**The Infinite Typewriters**](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/infinite-typewriters.md) ([`.yml` skeleton](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/infinite-typewriters.yml)) | dream | Pinocchio clause: Dasher + pluggable renderers; 3D typewriter whose keys swell and yield. |
| [**Micropolis AI Drag Race**](../../process/micropolis-ai-drag-race.md) | design | Competitive AI city-building as a show format — design exists, engine hooks pending. |
| [**RoboResurrection / Slats**](../../repo-shows/will-wright-premiere/slats-reincarnation.md) | design | Bringing Will's SFC robot brain back as a show judge. |

🐒✋ *Staleness policy: this shelf is re-verified every shelving pass, and every table above is
registered in [coherence.yml](../coherence.yml) with its sources. If you catch a dead status,
that's not embarrassment — that's a [journalism assignment](../JOURNALISM.md).*

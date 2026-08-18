# Brain stream

> **Girder:** [`brain-stream.yml`](brain-stream.yml) · **App seed:** [`../apps/stream-gateway/`](../apps/stream-gateway/README.md) · **Format:** [repo-show-format.md](repo-show-format.md) · **Pairs with:** [Manual Transmission](manual-transmission.md)

**Tagline:** *Spy on my brain thinking — prompts, shifts, attachments as repo URLs*

Tail Cursor session events into one slippery event bus. OBS Browser Source overlay for Twitch; throttled summaries to YouTube Live Chat; full scrollable page for the RTFR crowd. Collapsed = prompt + model badge + cost ticker; expand = thinking + tools + GitHub links. Pairs with [Manual Transmission](manual-transmission.md) — the tachometer the audience watches.

**Status:** seed — build phases drafted; app specs in [`stream-gateway/`](../apps/stream-gateway/)

---

## On this page

| Read | In one line |
|------|-------------|
| [When it runs](#when-it-runs) | During Twitch — also before async PRs and after harvest |
| [Architecture](#architecture) | One schema, many subscribers |
| [Overlay UX](#overlay-ux) | Collapsed teaser · expanded forensics |
| [Privacy](#privacy) | deep-snitch before the bus; strip secrets |
| [Build phases](#build-phases) | Ship incrementally — zero model cost until resummary |
| [Navigate](#navigate) | Related specs and skills |

---

## When it runs

**Repo Show clock:** `during_Twitch` — see [how it runs](repo-show-format.md#how-it-runs).

Also relevant: before async PRs · after harvest PRs (forensics gate before replay export).

---

## Architecture

**Principle:** tight integration, slippery coupling — one schema, many subscribers.

### Sources

| Source | What |
|--------|------|
| **cursor-mirror live** | Poll `state.vscdb` + agent-transcripts JSONL → new bubbles, thinking, tools ([IMPROVEMENT-MAP](https://github.com/SimHacker/moollm/blob/main/skills/cursor-mirror/designs/IMPROVEMENT-MAP.md#r5-live-daemon--watch-mode)) |
| **CursorLens proxy** | Optional token/cost firehose — complementary, not sole brain feed |
| **GitHub** | Commit webhooks → [thoughtful-commitment](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment) links on bus |

### Bus

Transport: SSE + WebSocket · implement in [`apps/stream-gateway/`](../apps/stream-gateway/)

### Sinks

| Sink | Route / behavior |
|------|------------------|
| **OBS overlay** | Transparent browser source — `/overlay/brain` |
| **Twitch chat** | EventSub bot — `!prompt` `!thinking` `!cost` `!rig` |
| **YouTube chat** | Throttled summaries only — API quotas |
| **Web full** | `/brain` — scrollable, expandable, resummarized |

**Event types:** prompt · thinking · tool_call · tool_result · assistant_chunk · commit · shift · summary · branch_fork · branch_compare · gear_shift · runbook_start · design_mode

Each event carries: composer id · model · timestamp · visibility (`overlay` / `chat` / `full` / `redacted`) · payload (text, optional rolling summary, GitHub file attachments, spend).

App specs: [`SPEC.yml`](../apps/stream-gateway/SPEC.yml) · [`cursor-tap.yml`](../apps/stream-gateway/cursor-tap.yml) · [`overlay-viewer.yml`](../apps/stream-gateway/overlay-viewer.yml)

---

## Overlay UX

| Mode | Shows |
|------|-------|
| **Collapsed** | Latest prompt · model badge · cost ticker · thinking teaser |
| **Expanded** | Full thinking · tool names · GitHub links · shift timeline |

**Resummary:** mini model on interval or bubble close — chat gets a paragraph; `/brain` keeps the full log.

---

## Privacy

Before anything hits the bus: [deep-snitch](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) · trekify · stream-mode toggle.

| Control | Detail |
|---------|--------|
| **Stream mode** | Optional delay on thinking · strip private paths · no env, no secrets |
| **Model branching** | Overlay shows fork events — Branch A vs Branch B on tachometer ([model-branching.md](model-branching.md)) |
| **After run** | Post-stream forensics before replay, harvest, or orchestration gold export — see [AI-offs post-run analysis](ai-offs.md) |
| **Subject rights** | [portrayal-standards.yml](../schemas/portrayal-standards.yml) |

---

## Build phases

| Phase | Ship | Model cost |
|-------|------|------------|
| 0 | Tail agent-transcripts JSONL → local SSE → static HTML overlay | zero |
| 1 | cursor-mirror `watch --live` + redact filter | zero |
| 2 | stream-gateway — `/overlay/brain` + `/brain` | zero |
| 3 | Twitch bot + GitHub permalink resolver | zero |
| 4 | Rolling resummary for chat | mini on interval |
| 5 | YouTube chat bot + AI-offs scoreboard tile | mini |
| 6 | Post-run forensics hook — deep-snitch gate before replay export | zero |

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Manual Transmission](manual-transmission.md) | Spend CSV piss test + overlay pairing |
| [AI-offs](ai-offs.md) | Post-run analysis · scoreboard |
| [Model branching](model-branching.md) | Fork worlds at any bubble |
| [Micropolis AI Drag Race](../repo-shows/micropolis-ai-drag-race/README.md) | Flagship game-show slot |
| [cursor-mirror skill](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) | Session archaeology |
| [ShowMaker network](showmaker-network.md) | Competitions index |

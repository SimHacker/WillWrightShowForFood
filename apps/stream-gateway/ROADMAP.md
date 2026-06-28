# stream-gateway — operationalize: build roadmap

*How to go from these specs to a running system. Consolidates the per-spec `build_phases`
into one critical path. Status: pre-build (specs done, nothing implemented).*

## Validated against a real live session (2026-06-28)

Inspected the live transcript `~/.cursor/projects/<ws>/agent-transcripts/<uuid>/<uuid>.jsonl`:

- Format: **JSONL, one `{role, message:{content:[parts]}}` per line**; grows in real time.
- Contains: **user text, assistant text, `tool_use` (with tool names)**.
- **Missing: `thinking` and `tool_result`** — NOT in the transcript at all.

**Consequence (key decision):** the brain stream's headline feature (live *thinking*) requires the
**SQLite tap** (`state.vscdb`) and/or the `agent-tools/<uuid>` cache. Transcript alone gives
prompts + assistant text + tool calls, but not the reasoning. So M0 (transcript) is the quick proof;
M1 (SQLite) is the real product.

## Decisions to lock now

| Decision | Pick | Why |
|----------|------|-----|
| Overlay host | **Electron** transparent click-through | Kandu-proven alpha hit detection (overlay-viewer.yml) |
| Bus transport v0 | **SSE** | simplest; add WS when bidirectional control needed |
| First summarizer | **remote** (OpenAI/Anthropic) | fastest to wire; move to local PC Ollama later |
| Thinking source | **SQLite `state.vscdb`** (+ agent-tools cache) | transcript lacks thinking/tool_result (validated) |
| Encoder | **Legion / NVENC** | quality + keeps Mac free |

## Unknowns to validate early (cheap spikes)

1. **Where is live thinking written?** Confirm `state.vscdb` `cursorDiskKV bubbleId:*` holds thinking
   for the *current* session in near-real-time (WAL read), and the high-water-mark strategy.
2. **`tool_result` source** — `agent-tools/<uuid>.txt` cache vs `agentKv:*` in SQLite; which updates first.
3. **Electron alpha click-through** on current macOS (per-pixel hit testing) — quick spike.
4. **NDI Mac→Legion** on the actual wired LAN — bandwidth/latency sanity.

## Critical path (milestones)

- **M0 — Transcript proof (zero cost).**
  Node script tails the live `.jsonl`, parses appended lines → walks `content[]` (text/tool_use) →
  pushes to a local SSE endpoint; dead-simple HTML page renders them. *Win: type in Cursor, see
  prompts/text/tools appear in a browser.* (No thinking yet.)
- **M1 — SQLite tap for thinking + tool_result.**
  Read-only `state.vscdb` poll by composer + high-water mark; enrich events with thinking, tool args,
  tool results, model, spend. Write our derived SQLite (`cursor-tap.yml#our_derived_db`). This is the
  real brain stream. → becomes `cursor-mirror watch --live`.
- **M2 — Privacy gate + canonical schema.**
  path-strip + secret-scan + private-repo filter + visibility tags BEFORE publish. Normalize to
  `brain-stream.yml#event_schema`. Kill-switch (`--pause`).
- **M3 — SvelteKit gateway + stable viewer.**
  `/api/events` (SSE, ring buffer), `/overlay/brain`, `/brain`. Outliner tree honoring the
  **prime_directive**: no auto-scroll, opt-in follow-tail, bookmarks, read/unread. (overlay-viewer.yml)
- **M4 — Fused redact+mipmap summarizer.**
  `process(text,channel,scope) → {redacted_full, mips}` (summarizers.yml), remote provider first;
  enables semantic zoom + cost ticker + squished-tab labels.
- **M5 — Electron overlay (local) + Bubble Wrangler basics.**
  Transparent click-through window docked over Cursor (cursor_chat_replacement); tabs, pop-out,
  stacks, read-tracking (bubble-wrangler.yml). Operator gets the non-shit chat view.
- **M6 — OBS + stream.**
  `obs` skill (obs-websocket); Browser Source loads the client; two-machine NDI; private stream test;
  delivery surfaces (obs-baked + companion app).
- **M7 — Local PC summarizer, playful-waiting, simplifier, Twitch/YouTube.**
  Ollama on the Legion (free, off the Mac); waiting-room infovis + dogfood push-to-reload; Simplifier
  screen-scrape; twitch/youtube skills + companion app / Twitch Extension.

## First tasks (M0, doable now)

1. `apps/stream-gateway/` SvelteKit skeleton: routes `/api/events` (SSE), `/overlay/brain`, `/brain`.
2. `tap/transcript-tail.mjs`: resolve current composer (ide_state MRU), seek to EOF, poll for
   appended lines, parse JSON, map `content[]` → events, POST to `/api/ingest`.
3. Minimal SSE client page: subscribe, append event rows (proves the pipe).
4. Spike: read one `thinking` bubble out of `state.vscdb` (validates M1 path).

## Tracking
Per-spec `build_phases` remain the detailed checklists; this file is the cross-cutting order.

See: [`SPEC.yml`](SPEC.yml) · [`cursor-tap.yml`](cursor-tap.yml) · [`summarizers.yml`](summarizers.yml) · [`overlay-viewer.yml`](overlay-viewer.yml) · [`bubble-wrangler.yml`](bubble-wrangler.yml) · [`playful-waiting.yml`](playful-waiting.yml) · [`simplifier.yml`](simplifier.yml)

<!-- GENERATED from `process/brain-stream.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:6814662795b02ce2 -->

# Brain stream

> **Girder:** [`brain-stream.yml`](brain-stream.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Pitch

Tail Cursor session events into one slippery event bus. OBS Browser Source overlay for
Twitch; throttled summaries to YouTube Live Chat; full scrollable page for RTFR crowd.
Collapsed = prompt + model badge + cost ticker; expand = thinking + tools + GH links.
Pairs with Manual Transmission — the tachometer the audience watches.

## Tagline

*Spy on my brain thinking — prompts, shifts, attachments as repo URLs*

## Meta

| Key | Value |
|-----|-------|
| **id** | brain-stream |
| **status** | seed |
| **app_seed** | ../apps/stream-gateway/ |

## Repo Show Clock

- **when:** during_Twitch
- **see:** repo-show-format.yml#how_it_runs
- **also:**
  - before_async_PRs
  - after_harvest_PRs

## Architecture

- **principle:** Tight integration, slippery coupling — one schema, many subscribers
### sources

## Sources

- **cursor_mirror_live:**
  - status: designed
  - see: SimHacker/moollm/skills/cursor-mirror/designs/IMPROVEMENT-MAP.md#r5-live-daemon--watch-mode
  - what: Poll state.vscdb + agent-transcripts JSONL → new bubbles, thinking, tools
- **cursor_lens_proxy:**
  - status: optional
  - note: Network proxy for token/cost firehose — complementary, not sole brain feed
  - see: SimHacker/moollm/skills/cursor-mirror/reference/assimilated/HAMEDMP-CURSORLENS.yml
- **github:**
  - what: Commit webhooks → thoughtful-commitment links on bus

### bus

## Bus

- **transport:**
  - SSE
  - WebSocket
- **implement_in:** apps/stream-gateway/

- **sinks:**
  - obs_overlay: Transparent browser source — /overlay/brain
  - twitch_chat: EventSub bot — !prompt !thinking !cost !rig
  - youtube_chat: Throttled summaries only — API quotas
  - web_full: /brain — scrollable, expandable, resummarized

## Event Schema

- **types:**
  - prompt
  - thinking
  - tool_call
  - tool_result
  - assistant_chunk
  - commit
  - shift
  - summary
  - branch_fork
  - branch_compare
  - gear_shift
  - runbook_start
  - design_mode
### fields

## Fields

- **composer_id:** string
- **model:** string
- **ts:** iso8601
- **visibility:**
  - overlay
  - chat
  - full
  - redacted
### payload

## Payload

- **text:** string
- **summary:** optional rolling resummary for chat
### attachments

## Attachments

- {"kind": "github_file", "path": "repo-relative path", "url": "public blob URL"}

- **spend:**
  - tokens_in: number
  - tokens_out: number
  - cost_usd: number



## Overlay Ux

- **collapsed:**
  - latest_prompt
  - model_badge
  - cost_ticker
  - thinking_teaser
- **expanded:**
  - full_thinking
  - tool_names
  - github_links
  - shift_timeline
- **resummary:** Mini model on interval OR on bubble close — chat gets paragraph, /brain keeps log

## Privacy

- **before_bus:**
  - deep_snitch
  - trekify
  - stream_mode_toggle
- **after_run:** Post-stream: deep-snitch + cursor-mirror forensics on the session before replay,
harvest, or orchestration gold export. See ai-offs.yml#post_run_analysis.
- **model_branching:**
  - see: model-branching.yml
  - live: Overlay shows fork events — Branch A vs Branch B on tachometer
- **stream_mode:**
  - delay_thinking_seconds: optional
  - strip_private_paths: yes
  - no_env_no_secrets: yes
- **subject_rights:** ../schemas/portrayal-standards.yml

## Build Phases

- {"id": 0, "ship": "Tail agent-transcripts JSONL → local SSE → static HTML overlay", "model_cost": "zero"}
- {"id": 1, "ship": "cursor-mirror watch --live + redact filter", "model_cost": "zero"}
- {"id": 2, "ship": "apps/stream-gateway — /overlay/brain + /brain", "model_cost": "zero"}
- {"id": 3, "ship": "Twitch bot + GitHub permalink resolver", "model_cost": "zero"}
- {"id": 4, "ship": "Rolling resummary for chat", "model_cost": "mini_on_interval"}
- {"id": 5, "ship": "YouTube chat bot + ai-offs scoreboard tile", "model_cost": "mini"}
- {"id": 6, "ship": "Post-run forensics hook — deep-snitch gate before replay export", "model_cost": "zero", "see": "ai-offs.yml#post_run_analysis"}

## Ties to

| Link |
|------|
| [`manual-transmission.yml`](manual-transmission.yml) |
| [`ai-offs.yml`](ai-offs.yml) |
| [`model-branching.yml`](model-branching.yml) |
| [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) |
| [`../apps/stream-gateway/GLANCE.yml`](../apps/stream-gateway/GLANCE.yml) |
| [`SimHacker/moollm/skills/cursor-mirror`](SimHacker/moollm/skills/cursor-mirror) |
| [`SimHacker/moollm/skills/thoughtful-commitment`](SimHacker/moollm/skills/thoughtful-commitment) |

## Related

| Link |
|------|
| [`repo-show-format.yml`](repo-show-format.yml) |
| [`showmaker-network.yml#competitions`](showmaker-network.yml) |

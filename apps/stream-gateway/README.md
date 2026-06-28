# stream-gateway

*Tap Cursor's brain → one event bus → a stable, zoomable browser overlay (running the Micropolis
GUI) → OBS → Twitch/YouTube. The audience watches the prompts, thinking, and tool stream as the
show.*

This is the buildout of [`process/brain-stream.yml`](../../process/brain-stream.yml). Start with the
[`SPEC.yml`](SPEC.yml) girder, then the two deep specs:

- [`cursor-tap.yml`](cursor-tap.yml) — how we intercept Cursor's prompt / thinking / response stream.
- [`overlay-viewer.yml`](overlay-viewer.yml) — the **stable, zoomable, bookmark-able** outliner UI
  (Psiber-Space-Deck-style), the antidote to scroll-jacking.

---

## Hardware: which machine streams?

**Decision: the Lenovo Legion (NVIDIA) is the encoder/streamer. The Mac is the source.**

Why: OBS's hardware encoders take the video-encode load off the CPU and onto a dedicated GPU block.
NVIDIA **NVENC** (Turing-gen / GTX 1650+ and up) is the strongest of the consumer encoders —
better quality-per-bitrate at aggressive settings than Apple VideoToolbox, and it frees the CPU so
the machine stays responsive while live. (Source: OBS hardware-encoding KB.)

It (mostly) doesn't matter for *running* OBS — it's cross-platform — but it matters for **encoding
headroom** and a few **Windows-first plugins**. So:

| Machine | Role | Why |
|---|---|---|
| **Mac (main)** | **Source** — runs Cursor (the brain we tap), the Micropolis browser overlay, and serves the event bus on the LAN | This is where the work happens; the tap reads Cursor's local files here |
| **Legion (NVIDIA)** | **Encoder/streamer** — runs OBS, pulls the overlay as a Browser Source, encodes with NVENC, pushes to Twitch/YouTube | NVENC quality + CPU headroom; keeps the Mac free to work |

**The elegant part:** the overlay is a *web page*, not a captured window. OBS's **Browser Source**
(CEF/Chromium, bundled) renders `http://<mac>.local:<port>/overlay/brain` natively and crisply at
any canvas resolution — so OBS on the Legion just loads the URL the Mac serves. No screen-scraping
the overlay, no scaling mush. Only the *Micropolis game video* (if you want it as pixels rather than
a second browser source) needs real capture — send that Mac→Legion over wired LAN via **NDI**
(DistroAV, below). Single-machine on the Legion also works if you'd rather run everything there.

---

## The app everyone uses: **OBS Studio**

Open Broadcaster Software — free, open-source, cross-platform, the de-facto standard. The reasons it
wins for us, all confirmed current (2026):

- **obs-websocket** is **built in** (OBS ≥ 28; v5 server on `ws://localhost:4455`). This is the
  control plane — scene switches, source toggles, recording/streaming start-stop, all over a JSON
  WebSocket. **This is what we wrap as MOOLLM skills / CLIs.**
- **Browser Source** (`obs-browser`, CEF) is **built in** — web overlays with full modern web APIs,
  transparent background, and a two-way bridge: the page can listen for OBS events
  (`window.obsstudio`) and obs-websocket can `emit_event` custom events into the page (vendor
  `obs-browser`). Our overlay rides this.
- **Plugin ecosystem** is huge and the reason to pick OBS:
  - **DistroAV** (formerly obs-ndi) — NDI in/out over LAN; how the Mac sends video to the Legion.
  - **StreamFX**, **Move Transition**, **Advanced Scene Switcher**, **Source Record**, **Aitum
    Vertical** (multi-canvas / vertical co-stream), **Background Removal**.
  - **Streamer.bot** — the big one: automation + chat + overlays glue across Twitch/YouTube; huge
    community.

### Mac vs PC for OBS
Runs on both. Encoding: NVENC (Legion) > Apple VT (Mac) for high-bitrate quality + CPU headroom.
Plugins: mostly cross-platform; a handful (some capture/automation tools) are Windows-first.
Net: **stream from the Legion**, treat the Mac as a source.

---

## How OBS relates to Twitch & YouTube (and their APIs)

OBS handles **ingest** (the video): it pushes an **RTMP/RTMPS** stream to a Twitch or YouTube
ingest server using a **stream key** (both also have "connect account" integrations). Twitch is also
rolling out WHIP/WebRTC "enhanced broadcasting." That's the *video path* — separate from the *data
path* (chat, events) which is where our bus and bots live:

### Twitch (push model — modern, clean)
- **Helix** REST API for everything (channel info, clips, polls, predictions, ads…).
- **EventSub** is now the standard for *both* lifecycle events **and chat**. As of 2024+ Twitch
  recommends `channel.chat.message` over legacy IRC. Transports: **WebSocket** (single-user / our
  case — connect to `eventsub.wss.twitch.tv/ws`, subscribe, receive pushes), **Webhook**, or
  **Conduits** (multi-channel backend scale).
- **Send chat** via the Helix *Send Chat Message* endpoint (scope `user:write:chat`).
- Scopes you'll want: `user:read:chat`, `user:write:chat`, plus `bits:read`,
  `channel:read:subscriptions` for alerts.

### YouTube (hybrid — push for lifecycle, poll for chat)
- **YouTube Live Streaming API** (part of Data API v3): `liveBroadcasts`, `liveStreams`,
  `liveChatMessages`.
- Chat is **poll-based**: get the `activeLiveChatId` from the broadcast, then poll
  `liveChat/messages` with the returned `pollingIntervalMillis` + exponential backoff. **Quota is
  the constraint** — so YouTube gets *throttled summaries*, not the firehose (already baked into
  `brain-stream.yml`).
- OAuth required for user-bound resources (device-code / installed-app flow).

---

## CLIs & libraries to build MOOLLM skills around

You don't need to reverse-engineer anything — wrap these:

| Surface | TypeScript / Node | Python | CLI |
|---|---|---|---|
| **OBS control** | `obs-websocket-js` | `simpleobsws` (asyncio), `obsws-python` | thin wrappers around the above; `obs-web` (Niek) is a ready web remote |
| **Twitch** | **Twurple** (`@twurple/api`, `/chat`, `/eventsub-ws`) | **TwitchIO** | official **twitch-cli** (twitchdev) — scaffold EventSub, mock events, test locally |
| **YouTube** | `googleapis` | `google-api-python-client` | `yt-dlp` (adjacent: metadata/VOD) |
| **Cross-platform glue** | **Streamer.bot**, NodeCG (overlay framework) | — | — |

**Skill plan:** each becomes a MOOLLM skill with a sister-script CLI:
- `obs` skill → `obs scene set <name>`, `obs source toggle <name>`, `obs stream start|stop`,
  `obs emit <event> <json>` (push to overlay) — all via obs-websocket.
- `twitch` skill → `twitch chat send <msg>`, `twitch eventsub watch` (tail chat/events to the bus).
- `youtube` skill → `youtube chat poll`, `youtube chat post <summary>` (throttled).
- `cursor-mirror watch --live` → the brain tap (see [`cursor-tap.yml`](cursor-tap.yml)).

## What others have built (and why it's popular)

- **Streamer.bot** — event→action automation across platforms; popular because it removes glue code
  and has a massive shared-import community.
- **NodeCG** — Node + browser-source overlay framework with a replicant state model; popular for
  esports/marathon broadcasts (GDQ-style) because overlays stay in sync with a shared data store.
- **Aitum / Aitum Vertical** — multi-canvas + automation; popular for horizontal+vertical co-stream.
- **Self-hosted bots** (Go/Node) doing *Twitch EventSub + YouTube polling → normalized payload →
  OBS Browser Source over WebSocket* — exactly our architecture. The recurring lesson:
  **normalize platform payloads into one canonical schema at the ingestion boundary.** We already
  do — see `brain-stream.yml#event_schema`.

## What else to know

- **Privacy gate before the bus** is non-negotiable: deep-snitch + path-stripping + optional
  thinking delay (`brain-stream.yml#privacy`). The brain stream *will* surface file paths, tokens,
  and half-formed thoughts — filter at the tap, not the overlay.
- **Latency budget:** Twitch/YouTube already add 2–20s. A few-second thinking delay for redaction is
  free, audience-wise.
- **OBS is scriptable two ways:** obs-websocket (external, language-agnostic — our choice) and
  in-process Lua/Python scripts (for tight per-frame stuff). Prefer obs-websocket.
- **NDI needs wired Ethernet** between Mac and Legion for stable HD; Wi-Fi will hitch.

---

See also: [`SPEC.yml`](SPEC.yml) · [`cursor-tap.yml`](cursor-tap.yml) · [`overlay-viewer.yml`](overlay-viewer.yml) · [`../../process/brain-stream.yml`](../../process/brain-stream.yml) · [`../../process/manual-transmission.yml`](../../process/manual-transmission.yml)

---
rig_dna:
  slug: brain-stream-dual-laptop
  version: "0.1"
  repo: SimHacker/WillWrightShowForFood
  branch: main
  rig_yaml: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/brain-stream-dual-laptop.rig.yml
  setup_md: https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/brain-stream-dual-laptop.SETUP.md
  schema: ../schemas/rig-setup-dna.yml
---

# Brain-Stream Dual-Laptop — Rig DNA

> **Why:** Stream your Cursor session as the show — tap the brain, replace Cursor's scroll-jacking
> chat with a stable zoomable viewer, and VJ it live to Twitch/YouTube — without the encode load
> hurting your dev machine.
> **What:** Mac = source (Cursor + brain-stream viewer + bus); Lenovo Legion = OBS + NVENC encoder;
> NDI between them on wired gigabit.
> **CTA:** Email this file to a friend. Paste it into your LLM. *You* decide whether to run the
> install protocol below.

**Micropolis Class · Repo Show ·** declare [`rig_classes`](./brain-stream-dual-laptop.rig.yml) honestly.

This is the first **multi-computer `stage` rig** (rig-schema 0.2). The `stage` block describes the
machines, capture, NDI transport, OBS scenes, overlay layout, and stream targets — fork it for any
single- or multi-machine screencasting setup.

---

## Official source (fetch latest)

| Artifact | URL |
|----------|-----|
| **Rig yaml (canonical)** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/brain-stream-dual-laptop.rig.yml |
| **This SETUP DNA** | https://raw.githubusercontent.com/SimHacker/WillWrightShowForFood/main/rigs/brain-stream-dual-laptop.SETUP.md |
| **App specs** | [`apps/stream-gateway/`](../apps/stream-gateway/) — SPEC · cursor-tap · overlay-viewer |
| **Browse rigs/** | https://github.com/SimHacker/WillWrightShowForFood/tree/main/rigs/ |

Local copies go stale. Install/upgrade pulls **latest yaml** from the raw URL unless you pin in
`.rig/brain-stream-dual-laptop/state.yml`.

---

## The setup at a glance

```
  MAC (source)                         LEGION (encoder/streamer)
  ────────────                         ─────────────────────────
  Cursor (full screen)  ── NDI ───────▶  OBS  ── NVENC ──▶ Twitch / YouTube
   └─ docked viewer over history          ├─ NDI source (Cursor)
   stream-gateway (bus + overlay) ─HTTP──▶├─ Browser Source (GUI, native alpha)
   cursor-mirror watch --live  (tap)      └─ obs-websocket ◀── `obs` skill (VJ)
   Ollama (free semantic mips)
        ▲ wired gigabit ethernet ▲
```

- **Local win (no stream needed):** the viewer docks over Cursor's chat **history** in
  `cursor_chat_replacement` mode — you keep typing in Cursor's real input bar (model switcher,
  attach), but the scrollback above becomes stable/zoomable/bookmarkable.
- **Stream win:** OBS renders the GUI as a Browser Source (true alpha — no chroma key) and composes
  it with the Cursor capture; scale/animate live like a VJ.

---

## For LLMs — idempotent install / upgrade

**Run this section only when the user asks you to install, upgrade, or replicate this rig.**

### Rules
1. **Idempotent** — safe to re-run; skip completed phases if verify still passes.
2. **Preserve user data** — never clobber [User data preserved](#user-data-preserved); back up first.
3. **Fetch latest** — `GET` canonical `rig_yaml`; compare SHA to `.rig/brain-stream-dual-laptop/state.yml`.
4. **Plan first** — show diff + steps; wait for OK unless told "just do it".
5. **State file** — write `.rig/brain-stream-dual-laptop/state.yml` (gitignored).

### Procedure
```
ORIENT   → Read head; fetch latest rig yaml + SETUP from raw URLs
PLAN     → Load state.yml; diff upstream vs local; list skip/run/preserve
DOWNLOAD → lifecycle.download (clone repos; install Cursor/OBS/DistroAV/Ollama)
INSTALL  → lifecycle.install (pnpm; screen-recording permission; NVENC check; wired LAN)
CONFIGURE→ lifecycle.configure (run gateway; start tap; dock viewer; OBS sources/scenes; obs-websocket)
VERIFY   → pnpm run verify; obs-websocket reachable; NDI + Browser sources live
RECORD   → Update state.yml; thoughtful-commitment if committing
UPGRADE  → On re-run: merge upstream yaml; reapply user_overrides; re-verify changed phases
```

### User data preserved
- `.rig/brain-stream-dual-laptop/` — local state, pins, machine hostnames/IPs
- OBS profiles + scene collections (on the Legion)
- `.env`, stream keys, API tokens (Twitch/YouTube), Cursor spend exports
- Local Ollama models

---

## For humans — detail

### Prerequisites
- **Mac:** macOS, Node 20+, Cursor, (optional OBS), Ollama; Screen Recording permission.
- **Legion:** Windows, NVIDIA GPU (NVENC), OBS Studio + DistroAV.
- **Network:** wired gigabit ethernet between the two (Wi-Fi will hitch NDI).

### Download / Install / Configure / Use
Follow `lifecycle.*` in the [rig yaml](./brain-stream-dual-laptop.rig.yml). The `stage:` block is the
map of machines, capture sources, transport, OBS scenes, overlay layout, and stream targets.

### Mod this rig
- **Single machine:** drop `legion-encoder`; run OBS on the Mac with Apple VT. Update `stage.machines`
  + `stage.obs.encoder`.
- **More machines:** add entries to `stage.machines` + `stage.transport` (e.g. a guest cam box, a
  dedicated playback machine). The schema is N-machine by design.
- **Add a game:** enable `src-game` NDI + the "Game + Brain" scene.

### Troubleshooting
- *NDI not appearing:* both on same wired subnet; DistroAV + NDI runtime installed; firewall allows mDNS.
- *No alpha on GUI:* you're capturing a screen, not using a Browser Source — switch to Browser Source, or chroma-key a solid bg.
- *NVENC missing:* update NVIDIA driver; enable hardware-accelerated GPU scheduling (Windows).
- *Overlay covers the input box:* shrink the docked window's bottom edge above Cursor's input (cursor_chat_replacement leaves it exposed).

### Proof checklist
- [ ] Idempotent re-run skips completed phases
- [ ] User data (OBS profiles, stream keys) preserved on upgrade
- [ ] `pnpm run verify` passes; OBS shows live NDI + Browser sources
- [ ] Private stream test succeeds before going live

---

Schema: [`rig-setup-dna.yml`](../schemas/rig-setup-dna.yml) · Rig: [`brain-stream-dual-laptop.rig.yml`](./brain-stream-dual-laptop.rig.yml) · App: [`apps/stream-gateway/`](../apps/stream-gateway/)

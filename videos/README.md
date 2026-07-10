# Cultural excerpt clips — sidecar metadata

YAML sidecars describe **which scenes to extract**, from **which source files**, with
**reproducible ffmpeg commands**. Outputs go in `clips/` (gitignored until reviewed for
YouTube fair-use / commentary).

**Source masters** may live outside this repo (e.g. `~/GroundUp/WillWrightCodeForFood/videos/`).
Sidecars record the canonical path on Don's machine.

**Public context page** (transcripts, commentary, YouTube links):
[`the-americans-clips.md`](the-americans-clips.md)

| Sidecar | Episode | Status |
|---------|---------|--------|
| [`the-americans-s02e07-arpanet.clips.yml`](the-americans-s02e07-arpanet.clips.yml) | S02E07 "Arpanet" | timecodes from Don's scrub |
| [`the-americans-s01e12-the-oath.clips.yml`](the-americans-s01e12-the-oath.clips.yml) | S01E12 "The Oath" | **10:07–12:06** verified (Pac-Man + trust rupture coda) |

Extract all clips from a sidecar:

```bash
./videos/extract-clips.sh the-americans-s02e07-arpanet.clips.yml
```

**Captions:** `captions/*.srt` — Whisper drafts per clip, proofread before uploading as
YouTube caption tracks. Pipeline model: [`clip-flow-pipeline.yml`](../process/clip-flow-pipeline.yml)

↑ [Lars cold-open refs](../characters/lars-brinkhoff/ideas.md) · [`repo-show-branding.yml`](../process/repo-show-branding.yml)

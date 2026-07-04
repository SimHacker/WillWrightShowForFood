# Clip captions — 1996 Winograd talk

**Accessibility first.** Every short-form export ships with sidecar captions.

| Source | Role |
|--------|------|
| [`../transcript.md`](../transcript.md) | Authoritative text (Don hand-proofread) |
| [`../transcript-cache/`](../transcript-cache/README.md) | Timing reference only — do not publish auto text |
| `captions/<clip_id>.vtt` | Per-clip captions — **clip-relative** times (00:00 = clip in-point) |

## File naming

Match `short-form-clips.yml` → `id` field:

```
oh-god-cliffhanger-data-portability.vtt
simearth-failure-mode-no-why.vtt
```

## Status

| File | Status |
|------|--------|
| `oh-god-cliffhanger-data-portability.vtt` | canonical — speaker labels, transcript.md text |
| *(others)* | auto-draft via `extract-clip.py` until hand-pass |

## Generate locally

```bash
python3 ~/GroundUp/repo-show/scripts/extract-clip.py oh-god-cliffhanger-data-portability
# → clips/raw/*.mp4 + clips/captions/*.vtt + *.srt
```

Git canonical VTT wins over auto-slice. Polish drafts against `transcript.md`, then commit here.

↑ [`../short-form-clips.yml`](../short-form-clips.yml) · [`../../../../process/post-production/captions.yml`](../../../../process/post-production/captions.yml)

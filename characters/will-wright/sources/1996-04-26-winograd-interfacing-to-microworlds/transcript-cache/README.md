# Transcript cache — YouTube auto-captions (reference only)

**Do not quote for the show.** The authoritative transcript is Don's hand-proofread
[`../transcript.md`](../transcript.md). Use this cache to **verify timestamps**, grep
for cut points, and diff against the perfected text.

## Files

| File | What |
|------|------|
| `PROVENANCE.yml` | Source metadata, download date, canonical vs reference |
| `youtube-auto-en.en.vtt` | Raw WebVTT from YouTube (auto English) |
| `youtube-auto-en.en.json3` | Same cues, JSON3 (machine parse) |
| `youtube-auto-en.timeline.tsv` | Flat TSV: `sec`, `display`, `text` — grep-friendly |

## Refresh

```bash
yt-dlp --write-auto-sub --sub-lang en --sub-format vtt --skip-download \
  --extractor-args "youtube:player_client=android" \
  -o "youtube-auto-en.%(ext)s" "https://www.youtube.com/watch?v=nsxoZXaYJSk"
```

Then regenerate timeline TSV from JSON3 (see `PROVENANCE.yml` → `regenerate_timeline`).

## Known drift

Auto-captions garble speaker turns in Q&A (e.g. merge student + Will at ~1:08:33).
Don's `transcript.md` fixes attribution, spelling, and duplicate-timestamp artifacts.

↑ [`../transcript.md`](../transcript.md) · [`../short-form-clips.yml`](../short-form-clips.yml)

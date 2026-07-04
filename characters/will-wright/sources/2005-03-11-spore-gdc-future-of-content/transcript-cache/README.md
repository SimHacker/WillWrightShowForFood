# Transcript cache — 2005 GDC Spore

YouTube auto-captions for **timestamp verification only**. Canonical talk text lives in
[`../medium-article.md`](../medium-article.md) (Don Hopkins, reviewed by Will Wright).

## Refresh

```bash
yt-dlp --write-auto-sub --sub-lang en --sub-format vtt --skip-download \
  --extractor-args "youtube:player_client=android" \
  -o "youtube-auto-en.%(ext)s" "https://www.youtube.com/watch?v=ofA6YWVTURU"
```

## Files (when cached)

| File | Role |
|------|------|
| `youtube-auto-en.en.vtt` | Raw YouTube auto captions |
| `youtube-auto-en.timeline.tsv` | Optional — slice helper for extract-clip.py |

Do not publish auto text without hand-proofread against Don's notes.

↑ [`PROVENANCE.yml`](PROVENANCE.yml) · [`../medium-article.md`](../medium-article.md)

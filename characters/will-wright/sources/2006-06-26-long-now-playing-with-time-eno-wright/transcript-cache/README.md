# Transcript cache — YouTube auto-captions (reference only)

**Not canonical.** Use for timestamp grep and clip discovery until Don hand-proofreads a full
transcript (same workflow as [1996 Winograd](../../1996-04-26-winograd-interfacing-to-microworlds/transcript-cache/README.md)).

## Refresh

```bash
yt-dlp --write-auto-sub --sub-lang en --sub-format vtt --skip-download \
  -o "youtube-auto-en.%(ext)s" "https://www.youtube.com/watch?v=Dfc-DQorohc"
```

↑ [summary](../summary.md) · [short form clips](../short-form-clips.yml)

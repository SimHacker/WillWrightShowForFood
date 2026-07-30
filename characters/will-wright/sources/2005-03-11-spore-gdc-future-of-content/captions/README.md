# Clip captions — 2005 GDC Spore

**Accessibility first.** Every short-form export ships with sidecar captions.

| Source | Role |
|--------|------|
| [medium article](../medium-article.md) | Canonical text (Don's GDC notes, Will-reviewed) |
| [transcript cache](../transcript-cache/README.md) | Timing reference only |
| `captions/<clip_id>.vtt` | Per-clip captions — **clip-relative** times |

## Priority clips for hand-pass

1. `procedural-mating-applause.vtt` — meme tier; verify crowd reaction timing
2. `five-thousand-to-one-compression.vtt` — flagship procedural rhetoric
3. `planet-buster-nonviolent-developer.vtt` — comedy jewel

## Generate locally

```bash
python3 ~/GroundUp/repo-show/scripts/extract-clip.py procedural-mating-applause --source sporegdc2005
```

↑ [short form clips](../short-form-clips.yml) · [captions](../../../../../process/post-production/captions.yml)

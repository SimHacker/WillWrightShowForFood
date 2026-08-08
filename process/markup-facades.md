# Markup facades registry

[README](README.md) · [Schema](../schemas/markup-facade.yml) · [Generator](../scripts/generate-markup-facades.py)

---

## Policy

**Yaml girders** = canonical for machines (MOOLLM, CI, automation).

**Markdown facades** = human views. Important docs are **instance-first** (hand-authored). `pnpm run facades` = temporary deterministic fallback until quality instance exists.

Once hand-authored: edit the `.md`; sync yaml girder separately; set `render.mode: llm` in registry.

## Instance-first (hand)

| Girder | Markdown |
|--------|----------|
| vision-and-ambition.yml | [vision-and-ambition.md](vision-and-ambition.md) |
| crazy-idea-jam.yml | [crazy-idea-jam.md](crazy-idea-jam.md) |
| character-endosymbiosis.yml | [character-endosymbiosis.md](character-endosymbiosis.md) |
| entryways.yml | [ENTRYWAYS.md](../ENTRYWAYS.md) · [entryways/](entryways/) |
| cross-links.yml | [TRAILS.md](../TRAILS.md) · [trails/](trails/) |

## Fallback deterministic (`pnpm facades`)

| Girder | Markdown |
|--------|----------|
| repo-show-format.yml | [repo-show-format.md](repo-show-format.md) → hand next |
| micropolis-ai-drag-race.yml | [micropolis-ai-drag-race.md](micropolis-ai-drag-race.md) |
| ai-offs.yml | [ai-offs.md](ai-offs.md) |
| manual-transmission.yml | [manual-transmission.md](manual-transmission.md) |
| homefun-grading.yml | [homefun-grading.md](homefun-grading.md) |
| brain-stream.yml | [brain-stream.md](brain-stream.md) |
| orchestration-gold.yml | [orchestration-gold.md](orchestration-gold.md) |
| challenges/retrocomputing-drive.yml | [challenges/retrocomputing-drive.md](challenges/retrocomputing-drive.md) |

## Kebab-case facades (hand index docs)

All other top-level girders: **`basename.yml` → `basename.md`** — see [INDEX.md](INDEX.md) for full table.

```bash
pnpm run facades        # refresh fallback entries only
pnpm run facades:check  # CI — stale fallback with GENERATED banner
```

Machine registry: [markup-facades.yml](markup-facades.yml)

↑ [process index](README.md) · Girder: `markup-facades.yml`

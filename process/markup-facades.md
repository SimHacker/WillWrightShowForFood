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
| vision-and-ambition.yml | [VISION.md](VISION.md) |
| crazy-idea-jam.yml | [CRAZY-IDEA-JAM.md](CRAZY-IDEA-JAM.md) |
| character-endosymbiosis.yml | [CHARACTER-ENDOSYMBIOSIS.md](CHARACTER-ENDOSYMBIOSIS.md) |
| entryways.yml | [ENTRYWAYS.md](../ENTRYWAYS.md) · [entryways/](entryways/) |
| cross-links.yml | [TRAILS.md](../TRAILS.md) · [trails/](trails/) |

## Fallback deterministic (`pnpm facades`)

| Girder | Markdown |
|--------|----------|
| repo-show-format.yml | [FORMAT.md](FORMAT.md) → hand next |
| micropolis-ai-drag-race.yml | [DRAG-RACE.md](DRAG-RACE.md) |
| ai-offs.yml | [AI-OFFS.md](AI-OFFS.md) |
| manual-transmission.yml | [MANUAL-TRANSMISSION.md](MANUAL-TRANSMISSION.md) |
| homefun-grading.yml | [HOMEFUN.md](HOMEFUN.md) |
| brain-stream.yml | [BRAIN-STREAM.md](BRAIN-STREAM.md) |
| orchestration-gold.yml | [ORCHESTRATION-GOLD.md](ORCHESTRATION-GOLD.md) |
| challenges/retrocomputing-drive.yml | [challenges/RETROCOMPUTING.md](challenges/RETROCOMPUTING.md) |

## Kebab-case facades (hand index docs)

All other top-level girders: **`basename.yml` → `basename.md`** — see [INDEX.md](INDEX.md) for full table.

```bash
pnpm run facades        # refresh fallback entries only
pnpm run facades:check  # CI — stale fallback with GENERATED banner
```

Machine registry: [markup-facades.yml](markup-facades.yml)

↑ [process index](README.md) · Girder: `markup-facades.yml`

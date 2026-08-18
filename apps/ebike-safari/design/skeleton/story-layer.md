# Skeleton — story layer

**Status:** not started  
**Depends on:** gesture-engine, exposure-log

## Job

Turn **ride event JSON** into optional natural-language summaries. LLM reads; engine never invents geometry.

## Input event stream (example)

```
ROUNDABOUT_LOOP @ Fountain Square
exposure: 18 homes left, park right
ENCIRCLE @ pond-4821
novel: first windmill
```

## Output

- `trips/{id}.story.md` or ephemeral chat — rider-facing, shareable if anonymized

## Rules

- Prompt includes only detected events + OSM names
- No home address inference in public exports
- TomTomagotchi needs → map to geography (pond → water) per geometry-as-language

## Show hook

Connects to [`../../../repo-shows/ebike-safari/`](../../../../repo-shows/ebike-safari/) voice-first seed — later phase.

**Graveyard tenant:** anonymous remember / flowers; Soul City summon only —
[`../graveyard-soul-city.md`](../graveyard-soul-city.md).

↑ [`../geometry-as-language.md`](../geometry-as-language.md)

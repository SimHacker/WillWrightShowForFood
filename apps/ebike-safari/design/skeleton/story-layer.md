# Skeleton — story layer

**Status:** not started  
**Depends on:** gesture-engine, exposure-log

## Job

Turn **ride event JSON** into optional natural-language summaries. LLM reads; engine never invents geometry.

Urban Safari / StoryMaker is still the card model: **drop a card at a place**,
then **link cards** — forward and back — in *when* (this ride, next day) and
in *what* (same fountain, a reply, a theme). You can ride your own graph or
follow someone else's path and play their cards in order, or hop the semantic
edges and arrive out of time.

Bodies on the table: pinball, Sim, or a vehicle that *is* a party. Live
multiball is several of those at once. Async is the taped path plus the card
chain — after the [home mask](../privacy.md).

## Input event stream (example)

```
ROUNDABOUT_LOOP @ Fountain Square
exposure: 18 homes left, park right
ENCIRCLE @ pond-4821
novel: first windmill
```

## Output

- `trips/{id}.story.md` or ephemeral chat — rider-facing, shareable if anonymized
- Cards may hold a **URL**. We point and embed. Their app handles
  reporting, privacy, AI review ([`../privacy.md`](../privacy.md)).

## Rules

- Prompt includes only detected events + OSM names
- No home address inference in public exports
- TomTomagotchi needs → map to geography (pond → water) per geometry-as-language

## Show hook

Connects to [`../../../repo-shows/ebike-safari/`](../../../../repo-shows/ebike-safari/) voice-first seed — later phase.

**Graveyard tenant:** anonymous remember / flowers; Soul City summon only —
[`../graveyard-soul-city.md`](../graveyard-soul-city.md).

↑ [`../geometry-as-language.md`](../geometry-as-language.md)

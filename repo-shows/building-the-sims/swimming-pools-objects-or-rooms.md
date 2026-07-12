# Swimming pools: objects or rooms?

*Architecture question for the Building The Sims reunion. Don proposed this for a Jamie Doornbos
interview reference in November 2007. Positions below are discussion frames — not attributed
quotes until guests speak on air.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## The question

Should swimming pools in The Sims 1 be represented as **objects**, as **rooms** (or room-like
space), or as something else — and **why**?

Three common framings from the original team:

| Framing | Summary |
|---------|---------|
| **Objects** | Multi-tile placeables; ladders and edges in the object pipeline; SimAntics interactions |
| **Rooms** | Flood-filled space with its own room ID; pathfinding treats "in the pool" like indoor space |
| **Dedicated layer** | Pool/water as per-tile grid layers edited by build tools, separate from room flood-fill |

Don's recollection of what shipped leans **dedicated layer** plus **pool pieces** in the object
pipeline for ladders and edges — not a single clean answer. Engineers on the reunion should
correct this from memory.

## What Don recalls about the lot model

The lot grid held parallel per-tile data: altitude, ground, floors, walls, object IDs, **room IDs**
(computed by flood-fill), **pool** and **water** layers, roofs, lights.

- **Rooms** were derived from walls and floors, not painted directly.
- **Pools** were drawn with a **pool tool** on a pool layer (similar in spirit to the water tool).
- **Ladders and edges** also appeared as **pool pieces** in the move/buy architectural pipeline.
- **Swimming** behavior, in Don's memory, consulted **pool tiles on the layer** rather than room ID
  or a single catalog object.

## Related engineering topics

Cross-reference [`pool-qa.md`](pool-qa.md) and [`stair-placement-tool.md`](stair-placement-tool.md):

- Removable ladders and drowning
- Locomotion edge cases (e.g. Sims surfacing and walking on water)
- Stairs placed in pools (rescue scenarios × multi-floor topology)
- Service AI (maid pathfinding to pool islands)
- Player culture (pool ladder removal)

## Origin

→ [`metaweb-2007-pool-question.md`](metaweb-2007-pool-question.md)

## Guests with direct angles

| Guest | Likely contribution |
|-------|---------------------|
| Jamie Doornbos | SimAntics, motives, smart objects |
| Eric Bowman | World grid, pool layer, pool pieces |
| Eric Hedman | Object pipeline, animation, expansion objects |
| Jim Mackraz | CTG / QA / what reached management |
| Will Wright | Design intent |
| Don Hopkins | Host recollection; bug pile |

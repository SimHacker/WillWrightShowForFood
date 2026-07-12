# Pool-related QA reports

*Internal QA and player-behavior edge cases around swimming pools. Don's memory — confirm with
team on air. **Story cards:** [`artifacts/INDEX.md`](artifacts/INDEX.md) (pools section).*
[Portrayal standards](../../schemas/portrayal-standards.md)

## Maid service on a pool island

→ [`artifacts/maid-pool-island-bbq.md`](artifacts/maid-pool-island-bbq.md)

**Reported setup (Don's memory):**

- Island in the middle of a pool
- Ladder from deck to island
- Diving board into the pool
- BBQ on the island needs cleaning

**Observed behavior:** Maid dives into the pool, swims to the island, cleans the BBQ, climbs back
into the pool to leave.

**Open questions:**

- Can the maid exit the pool afterward?
- Is this a pathfinding bug, a service-behavior bug, or expected interaction between pool layer,
  objects, and motives?
- How was it classified — fix, won't fix, or design limitation?

| Likely owner | Topic |
|--------------|-------|
| Jamie Doornbos | Service / clean interactions |
| Eric Bowman | Pool + island grid |
| Jim Mackraz | QA filing and severity |
| Eric Hedman | Object states and art |

## Urn rings

→ [`artifacts/urn-rings-around-pool.md`](artifacts/urn-rings-around-pool.md)

Lots where multiple Sims drowned in sequence, leaving **tombstones and urns** around the pool deck.
Some saves were filed as QA bugs; others as emergent player behavior.

## Locomotion

- **Walking on water:** swimming Sims sometimes surfaced and walked on pool tiles — locomotion vs
  pool-layer state.
- **Ladders:** removable pool ladders and drowning — design vs emergent behavior.

## Stairs in pools

Attempts to place **stairs in a pool** to rescue drowning Sims — interaction between
[`stair-placement-tool.md`](stair-placement-tool.md) and pool layer.

## Ingest checklist

- [ ] Maid pool-island QA write-up + screenshot
- [ ] Urn-ring lot screenshots
- [ ] Locomotion / walk-on-water bug IDs
- [ ] Irk @irkinteraction retrospective clips (pool / hot tub)

## See also

- [`swimming-pools-objects-or-rooms.md`](swimming-pools-objects-or-rooms.md)
- [`qa-bug-pile.md`](qa-bug-pile.md)

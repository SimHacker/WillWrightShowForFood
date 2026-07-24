# QA bug pile

*Don's archive of old The Sims 1 bug reports and reproductions — some **fixed**, some **not**.
Material for the reunion discussion; ingest excerpts as they are recovered.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## How we'll use this on air

For each entry:

1. **Setup** — reproduction steps
2. **Definition question** — what did the tool or subsystem think the user meant?
3. **Resolution** — fixed, won't fix, or unknown
4. **Owner** — grid, room fill, tool UX, SimAntics, service AI

## Documented entries

Browse cards: [`artifacts/INDEX.md`](artifacts/INDEX.md)

### Maid plunger incident (fixed pre-ship)

→ [`maid-plunger-incident.yml`](maid-plunger-incident.yml) ·
[`sources/maid-plunger-incident-hn-2022.md`](sources/maid-plunger-incident-hn-2022.md) ·
[`artifacts/maid-plunger-unnecessary-censorship.md`](artifacts/maid-plunger-unnecessary-censorship.md)

Pre-privacy service AI + pixelation shimmer + plunger from hammerspace = **Unnecessary Censorship**
read. Fixed in SimAntics before ship; Don did not save video. Reunion: hunt summer intern credit +
any QA severity notes.

### Maid service on pool island

→ [`artifacts/maid-pool-island-bbq.md`](artifacts/maid-pool-island-bbq.md) · [`pool-qa.md`](pool-qa.md)

### Outdoor wallpaper — "paper all walls"

→ [`artifacts/outdoor-wallpaper-shed.md`](artifacts/outdoor-wallpaper-shed.md)

Use the wallpaper tool **outside** with **paper all walls** selected.

- Which walls are included in "all"?
- Outdoor vs indoor walls
- If a **shed** is on the lot: **does it receive the same wallpaper?** Same room graph scope?

Likely owners: wall/room grid (Eric Bowman), wallpaper tool modes, Jim Mackraz (QA).

### Pool cluster

→ [`swimming-pools-objects-or-rooms.md`](swimming-pools-objects-or-rooms.md) · [`pool-qa.md`](pool-qa.md)

### Stair placement tool

→ [`stair-placement-tool.md`](stair-placement-tool.md)

## Ingest queue

- [ ] Index physical/digital pile — tag FIXED / NOT FIXED / UNKNOWN
- [ ] Maid pool-island — full QA text
- [ ] Outdoor wallpaper + shed — expected vs actual
- [ ] Additional bugs where **verb definitions** were disputed

## Guests

| Guest | Angle |
|-------|-------|
| Jim Mackraz | QA and management |
| Jamie Doornbos | SimAntics, service behaviors |
| Eric Bowman | Room flood-fill, wall grid, pool layers |
| Eric Hedman | Object pipeline |
| Will Wright | Design intent |

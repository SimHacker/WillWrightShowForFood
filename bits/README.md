# bits/ — the writers' room inventory

Cross-cutting show material: **bits you perform, threads you pull, rituals
you repeat, merch you print.** A gag is performed *in* shows; a theme runs
*across* shows; a tradition recurs; swag is worn. None of them are shows —
they are the material shows draw from, exactly like characters. Shows
reference bits by id.

This is one flat registry, on purpose. The kind lives in the big-endian
directory prefix, so `ls` sorts the kinds into groups, and recategorizing a
bit (is Unnecessary Censorship a gag or a tradition?) is a rename, not a
migration:

| Prefix | Kind | What goes here |
|--------|------|----------------|
| `gag-` | gag | Specific comedy bits with enough detail to record or rehearse |
| `theme-` | theme | Substantive threads to revisit across episodes |
| `tradition-` | tradition | Cross-show formats and homages (Foreign Poet, Rocky Horror participation) |
| `swag-` | swag | Merch design briefs (stickers, posters) |

New kinds (`segment-`, `catchphrase-`, `game-`) join without new
architecture. Programming arcs are **not** bits — those are tracks, in
[`../process/tracks/`](../process/tracks/README.md).

## Shape of a bit

One directory per bit: `<kind>-<name>/<kind>-<name>.yml` (the machine
reading), plus a handwritten `<kind>-<name>.md` companion (the human
reading) as the authoring program reaches it — themes already have theirs.
An optional `BIT.yml` interface (id, kind, status, shows) may back-fill
over time; a directory with nothing but the yml is a valid bit.

## Lifecycle

Bits **graduate**: a gag becomes a recorded POC; a theme becomes an
episode; a tradition gets copied into another show's `SHOW.yml`. Status
lives in [`INDEX.yml`](INDEX.yml) — the map of everything here.

## Related rooms

| Room | Role |
|------|------|
| [`INDEX.yml`](INDEX.yml) | The map — every bit, status, and show links |
| [`../repo-shows/`](../repo-shows/README.md) | The shows that perform these bits |
| [`../characters/`](../characters/README.md) | The people who perform them |
| [`../process/tracks/`](../process/tracks/README.md) | Programming arcs (not bits) |
| [`../process/crazy-idea-jam.yml`](../process/crazy-idea-jam.yml) | Forward-tech reactor upstream of many bits |
| [`../repo-shows/REFACTOR.md`](../repo-shows/REFACTOR.md) | Why this registry exists |

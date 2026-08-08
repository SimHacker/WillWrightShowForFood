# tracks/ — programming arcs

A **track** is a production program: a curated arc of shows, guests, and
participation formats aimed at a constituency. Not a theme (a discussion
thread), not an entryway (a reading playlist for a visitor), not a trail
(a sideways reading path). The entryway is how someone walks in; the track
is the season of programming behind that door.

| Word | Function | Where |
|------|----------|-------|
| entryway | doorway — ordered reading playlist per visitor type | [`../entryways/`](../entryways/README.md) |
| trail | sideways reading path by topic | [`../trails/`](../trails/README.md) |
| track | programming arc — shows + formats for a constituency | here |

## Tracks

| Track | Constituency | Status |
|-------|--------------|--------|
| [`educators-track/`](educators-track/educators-track.md) | Teachers and students on the DEVELOPMENT side — assign the fork, grade the PR | brewing |

## Candidate tracks (linked, not yet promoted)

Living under other names until they outgrow a paragraph:

- **interval-reunion-2026** and **hci-pie-hyperties-2026** — invitation
  batches in [`../../repo-shows/REPO-SHOWS.yml`](../../repo-shows/REPO-SHOWS.yml)
- **retrocomputing drive** — [`../challenges/retrocomputing-drive.yml`](../challenges/retrocomputing-drive.yml)

## Shape of a track

One directory per track: `<name>/<name>.yml` + handwritten `<name>.md`
companion. Optional `TRACK.yml` interface (id, audience, member shows by
id, member characters by id, status) back-fills as tracks develop.
Cross-references by id — a track is a menu, not a container; deleting one
orphans nothing. Refactor rationale:
[`../../repo-shows/REFACTOR.md`](../../repo-shows/REFACTOR.md)

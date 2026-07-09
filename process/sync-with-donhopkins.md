# Sync with DonHopkins

[Live repo](live-repo.md) · [Email attachment curation](email-attachment-curation.md) · [MANIFEST](../MANIFEST.yml)

---

## The hook

Sibling path: `../DonHopkins/` (same parent as this repo). **WWSFF is live; DonHopkins on hold for projected content** — edit WWSFF, do not backfill source. Primarily one-way export: SELECT → FILTER → AUGMENT → EXPORT → SYNC.

## Select (cream first)

- `projects/micropolis-moollm/repo-shows/will-wright-premiere/`
- Character CHARACTER.yml, GLANCE.yml, README.md, CARD.md
- MOOLLM adventure-4 don-hopkins (career + portrayal only — exclude sessions, correspondence)

Defer: bots/, ideas/scratchpad.yml

## Filter

Always exclude: expat/, private/, don-hopkins/correspondence/, credentials, .work/

Strip fields: private.home, real addresses. Coalesce master-of-ceremonies into public don-hopkins/.

## Cadence

- **Before Will email:** full cream pass — invitation.md links to this repo
- **Ongoing:** after each show segment or guest add — incremental export

Tool: manual + `scripts/wwsff-sync.sh` (TODO). Manifest: MANIFEST.yml

## Show hooks

- **Filter story:** What stays private vs what projects public — representation ethics on camera.

## Deeper links

| Topic | Where |
|-------|--------|
| Email attachment audit | [email-attachment-curation.md](email-attachment-curation.md) |
| Archive trail | [trails/archive-and-provenance.md](trails/archive-and-provenance.md) |
| Authoritative plan | DonHopkins/projects/micropolis-moollm/process/wwsff-export-sync.yml |

↑ [process index](README.md) · Girder: `sync-with-donhopkins.yml`

# `_TEMPLATE` — guest character scaffold

The starting point for a new guest/character directory under [`characters/`](../README.md). Copy these files
into `characters/<new-id>/`, fill them in, and add the rest (`GLANCE.md`, `README.md`, `media/`, …)
as the portrayal grows.

## Layout

- **`media/`** — flat room for PDFs, photos, catalogs (see [`will-wright/media/`](../will-wright/media/README.md) and [`../process/character-colocation.yml`](../../process/character-colocation.yml))
- Person stuff stays here even if the guest appears on many shows under `repo-shows/`

## Files

- [`CHARACTER.yml`](CHARACTER.yml) — canonical data (id, bio, connections, invitation status).
- [`CARD.yml`](CARD.yml) — the compact capabilities/interface card.
- [`invitation.md`](invitation.md) — the draft Repo Show invitation.

All portrayals follow [`schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml):
public sources only, no impersonation, no fabricated quotes, subject rights honored. Scaffolding is
also automated — see [`scripts/scaffold-invitation-characters.mjs`](../../scripts/scaffold-invitation-characters.mjs).

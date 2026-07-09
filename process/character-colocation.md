# Character colocation — placement constitution

[Repo Show format § placement](FORMAT.md) · [TicketPR § where not](ticket-pr.md)

---

## The hook

**Scope → directory. Reference → don't duplicate.** Characters own person stuff. Shows reference. Packages hold code. Rooms are navigable maps — shows are rooms too. CARD + ROOM + SIMULATION cardify interfaces. Postel: flexible layout, clean links.

## Scopes

| Scope | Path | Owns |
|-------|------|------|
| **Characters** | `characters/<slug>/` | Portrait, media, sources, correspondence — one guest, many shows |
| **Repo shows** | `repo-shows/<episode>/` | SHOW.yml, segments, venue/, audience/ (TicketPR) — not long-lived guest PDFs |
| **Packages** | `packages/` | Reusable @wwsff/* code from harvests |
| **Audience** | `repo-shows/<show>/audience/<you>/` | Per-episode TicketPR — NOT characters/ |
| **Catalogs** | `catalogs/` | Syndicated feeds — Soul City, SimFreaks, etc. |

## Cardify pyramid

GLANCE = nav/metadata SSOT · CARD = interface/ads · README for humans.

Show directory minimum: SHOW.yml. Recommended: README.md, CARD.yml, GLANCE.yml. Optional: ROOM.yml, SIMULATION.yml.

Character README = profile page — ticketpr_seats, shows, dreams, likes_and_joins, artifacts. Worked example: [../characters/palm/README.md](../characters/palm/README.md).

## README index policy

No human INDEX.md — index in README. Link humans to README.md; optional `./` pop-out for raw listing. GLANCE owns agent nav; README mirrors skeleton for humans.

## Show hooks

- **Migration story:** Will sources moved from show dir to character dir — why scope wins.
- **CARD sniff:** Open GLANCE + CARD on a show room — MOOLLM navigation live.

## Deeper links

| Topic | Where |
|-------|--------|
| Character endosymbiosis | [CHARACTER-ENDOSYMBIOSIS.md](CHARACTER-ENDOSYMBIOSIS.md) |
| ShowMaker network | [showmaker-network.md](showmaker-network.md) |
| MOOLLM room skill | [github.com/SimHacker/moollm/skills/room](https://github.com/SimHacker/moollm/tree/main/skills/room) |

↑ [process index](README.md) · Girder: `character-colocation.yml`

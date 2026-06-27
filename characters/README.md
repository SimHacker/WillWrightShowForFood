# characters/

Public **invitation portrayals** — polite, verifiable, respectful. **Not** the real people.

**Browse the tree.** One directory per guest — that is the interface, not a separate people index.
Refer to guests organically in show copy and trails; [`INDEX.yml`](INDEX.yml) is for machines syncing status.

## Read once

| Doc | Purpose |
|-----|---------|
| [**Portrayal standards**](../schemas/portrayal-standards.yml) | Tone, citations, subject rights, directory growth, contributions |
| [**Invitation workflow**](../schemas/invitation-workflow.yml) | `draft` → `sent` → `replied` / `accepted` / `delayed` / `declined` / … |

## How directories grow

Each `characters/<slug>/` folder fills in as we prepare the show and hear back:

| Phase | What lands in the directory |
|-------|----------------------------|
| Invite | `invitation.md`, baseline `CHARACTER.yml`, `CARD.yml`, `README.md`, `GLANCE.md` |
| Response | Status update, corrected bio, links they want cited |
| Show prep | `sources/`, URLs, transcribed attachments, public artifacts, optional `portrayal/` |

**Contributions:** guests may edit their own directory (PR or commit, per consent). We are also glad to assist — email Don Hopkins with text, attachments, or URLs; we place public-safe material with attribution. No GitHub account required.

Template: [`_TEMPLATE/`](_TEMPLATE/) · Schema: [`../schemas/guest-skills-card.yml`](../schemas/guest-skills-card.yml)

## Organic pointers (not a roster page)

| Who | Directory |
|-----|-----------|
| Host | [don-hopkins/](don-hopkins/) — self-sovereign |
| Flagship guest | [will-wright/](will-wright/) — richest portrayal; [`invitation.md`](will-wright/invitation.md) |
| Retro pair | [lars-brinkhoff/](lars-brinkhoff/) · [thomas-cherryhomes/](thomas-cherryhomes/) |
| MC / sidekick | [don-philahue/](don-philahue/) · [slats/](slats/) |

More names appear as you list this folder — or follow links from [`../repo-shows/`](../repo-shows/) and [`../process/cross-links.yml`](../process/cross-links.yml).

## Uniform baseline per guest

| File | Role |
|------|------|
| `CARD.yml` | Universal CARD — room interface + MTG invokable abilities |
| `CHARACTER.yml` | Yaml girder — bio, sources, invitation.status |
| `GLANCE.md` | One-screen sniff |
| `README.md` | Markdown facade |
| `invitation.md` | Public invitation — link from email |

Normalize from DonHopkins sources: `pnpm run normalize:characters` · Scaffold cards: `pnpm run scaffold:cards`

## Subject rights

Any portrayed person may request **correction, edit, or deletion** — we comply gracefully.
Declines, delays, and silence are honored. See portrayal standards.

## Museum map

[**ENTRYWAYS.md**](../ENTRYWAYS.md) · [**TRAILS.md**](../TRAILS.md)

| Doorway | → |
|---------|---|
| Guest (Will) | [guest-will playlist](../process/entryways/guest-will.md) |
| Guest (anyone) | [guest-any playlist](../process/entryways/guest-any.md) |
| Archivist | [provenance + sources](../process/entryways/archivist.md) |

This room: [`CARD.yml`](CARD.yml) · [`contact-queue.yml`](contact-queue.yml) (outreach order, not a public roster)

Live repo: [`process/live-repo.yml`](../process/live-repo.yml)

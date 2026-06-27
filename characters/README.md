# characters/

Public **invitation portrayals** — polite, verifiable, respectful. **Not** the real people.

## Read once

| Doc | Purpose |
|-----|---------|
| [**Portrayal standards**](../schemas/portrayal-standards.yml) | Tone, citations, subject rights, what we avoid — **not repeated in each character** |
| [**Invitation workflow**](../schemas/invitation-workflow.yml) | `draft` → `review` → `finished` → `sent` → `replied` / `accepted` / `delayed` / `declined` / … |
| [**Roster**](INDEX.yml) | All guests + invitation status |

## Host (self-sovereign)

**[Don Hopkins](don-hopkins/)** — `consent: self_sovereign`. Simulation of Don permitted by Don.
Other metadata simplified; see [`don-hopkins/CHARACTER.yml`](don-hopkins/CHARACTER.yml).

## Flagship guest

**[Will Wright](will-wright/)** — richest portrayal (this show is about him). Subdirs: [`portrayal/`](will-wright/portrayal/), public [`invitation.md`](will-wright/invitation.md) (`status: draft`).

## Everyone else

Uniform baseline per directory:

| File | Role |
|------|------|
| `CHARACTER.yml` | Yaml girder — bio, sources, invitation.status |
| `GLANCE.md` | One-screen sniff |
| `README.md` | Markdown facade |
| `invitation.md` | **Public invitation** — link from email; no private email/phone/GitHub-account requirements |

Template: [`_TEMPLATE/`](_TEMPLATE/)

Normalize guests from DonHopkins sources: `pnpm run normalize:characters`

## Fictional / orchestrator

| Who | Role |
|-----|------|
| [don-philahue/](don-philahue/) | MC orchestrator (homage) |
| [slats/](slats/) | RoboResurrection sidekick |

## Subject rights

Any portrayed person may request **correction, edit, or deletion** — we comply gracefully.
Declines, delays, and silence are honored. See portrayal standards.

Live repo: [process/live-repo.yml](../process/live-repo.yml)

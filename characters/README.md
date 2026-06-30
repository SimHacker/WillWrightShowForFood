# characters/

Public portrayals **about** real people — polite, verifiable, respectful. These are **not** the
real people, and we never impersonate them or speak as them.

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · *Facade:* [`README.md`](README.md) · *Machine sync:* [`INDEX.yml`](INDEX.yml)

**Browse the tree.** One directory per person — that is the interface, not a separate people index.

---

## Featured portraits — scroll in

**[will-wright/](will-wright/)** — Flagship guest. [`GLANCE.yml`](will-wright/GLANCE.yml) · Richest CARD + invitation drafts; alias Klapaucius;
[`media/`](will-wright/media/) photo galleries. Start at [`invitation.md`](will-wright/invitation.md).

**[don-hopkins/](don-hopkins/)** — Host. Career timeline, SimCity lineage, Stupid Fun Club, correspondence
index. Self-sovereign portrayal.

**[don-philahue/](don-philahue/)** — Orchestrator MC (fictional). C-3PO translator, TicketPR harvest,
venue arbitration. The show's constitution lives here.

**[slats/](slats/)** — Sidekick bot. One Minute Movies waiter brain; robopoetry feedback-loop instrument;
ROBORESURRECTION Easter Sunday bit.

**[terry-winograd/](terry-winograd/)** — Forebear. CS547 archive — 339 talks; the seminar tradition the
1996 centerpiece inherits.

**[richard-bartle/](richard-bartle/)** — Consented self-author example. MUD co-inventor; spirit-of-work
questions he may curate.

**[brian-eno/](brian-eno/)** · **[scott-draves/](scott-draves/)** — Generative-systems dream cluster;
2006 Long Now evening; Electric Sheep on every surface.

**[drew-carey/](drew-carey/)** — Dream guest invitation portrayal (Whose Line + Price Is Right + Sims NPC).

**[heather-alvey/](heather-alvey/)** · **[steve-alvey/](steve-alvey/)** — SimFreaks / SimSlice honored
creators; front-row audience + catalog cross-links.

**[phil-salvador/](phil-salvador/)** — VGHF / Obscuritory; SimRefinery recovery; librarian box seat.

**[douglas-engelbart/](douglas-engelbart/)** · **[mark-weiser/](mark-weiser/)** · **[hugh-daniel/](hugh-daniel/)** —
Memorial mode examples — represent and discuss; never voice the deceased.

*Every other name:* list this folder or follow links from [`../repo-shows/`](../repo-shows/).

---

| Kind | Who | What it is |
|------|-----|------------|
| 🎟️ **Invitation** | living guests | A standing, public **invitation** to a Repo Show, plus a portrayal drawn from their documented public work. They can accept, decline, delay, ignore, edit, or delete it. |
| 🕯️ **Memorial** | people who have passed | A tribute in **memorial mode**: we *represent and discuss* their documented work and the stories friends tell — we do **not** interview them, speak as them, or invent words. We invite living people who knew them to remember them on air. |

**Ethical framing.** Everything here is sourced and public-safe (no private contact info, no
fabricated quotes). It exists to honor people's documented work and, for the living, to invite a
conversation — never to put words in anyone's mouth. See [portrayal standards](../schemas/portrayal-standards.yml)
and, for the deceased, [memorial mode](../schemas/portrayal-standards.yml#memorial_mode).

**We will edit or remove any portrayal — promptly and respectfully — on request from the person,
or, for a memorial, from their family or estate.** Open a GitHub issue or contact Don Hopkins
through any public channel. No reason needed; no questions asked.

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

**Memorial mode** 🕯️ — deceased forebears get full directories too, but we *represent and discuss* them; we never interview or speak as them. Each carries a `memorial:` block (who can discuss them, what shows can draw on) and a `memorial.md` tribute. See [memorial mode](../schemas/portrayal-standards.yml#memorial_mode). Examples: [douglas-engelbart/](douglas-engelbart/), [mark-weiser/](mark-weiser/), [hugh-daniel/](hugh-daniel/).

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

Any portrayed person — or, for someone who has passed, their **family or estate** — may request
**correction, edit, reduction, or deletion** at any time. We comply promptly and gracefully, no
reason required. Declines, delays, and silence are all honored. See portrayal standards.

## Museum map

[**ENTRYWAYS.md**](../ENTRYWAYS.md) · [**TRAILS.md**](../TRAILS.md)

| Doorway | → |
|---------|---|
| Guest (Will) | [guest-will playlist](../process/entryways/guest-will.md) |
| Guest (anyone) | [guest-any playlist](../process/entryways/guest-any.md) |
| Archivist | [provenance + sources](../process/entryways/archivist.md) |

This room: [`CARD.yml`](CARD.yml) · [`contact-queue.yml`](contact-queue.yml) (outreach order, not a public roster)

Live repo: [`process/live-repo.yml`](../process/live-repo.yml)

# Portrayal standards

## Copy for email

Each link above is a **public portrayal about** you — for Repo Show invitations and attribution. It is **not** you, and we do not impersonate you or put words in your mouth. Everything is sourced from documented public work; you may **correct, reduce, replace, add to, or delete** your directory at any time (GitHub issue or email Don — no GitHub account required), or ask for **direct edit access** and make it yours. Send plain text, attachments, or URLs and we will place vetted material in your room. All responses honored: accept, delay, decline, or silence. One ask: the repo is in **quiet mode** while invitations go out — please don't share links publicly yet.

Full standards (also covers repo access, the quiet-mode publication plan, and easy onboarding): https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md

---

Human-readable view of [`portrayal-standards.yml`](portrayal-standards.yml). Read once before browsing guest directories.

**Applies to:** all `characters/*` invitation portrayals — **not** the real people.  
**Host:** Don Hopkins is self-sovereign — see [`characters/don-hopkins/CHARACTER.yml`](../characters/don-hopkins/CHARACTER.yml).  
**MOOLLM:** [representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics) · [real-being](https://github.com/SimHacker/moollm/tree/main/skills/real-being)

---

## Tone

Polite · respectful · inclusive · biographical (not gossipy) · verifiable · graceful about any response.

## What this is

A public portrayal **about** a real person — for Repo Show invitations and Repo Show attribution. It is **not** the person. We do not impersonate. We do not fabricate quotes.

## What we publish

- Documented public career and published work
- Sourced quotes only (marked, in context)
- Wikipedia / paper / official web / blog citations where available
- Proposed show topic and public repo materials

## What we avoid

- Private contact info (email, phone, home address) in this public repo
- Requiring a GitHub account to be honored or invited
- Private in-jokes unless clearly intended for public portrayal
- Creepy, stalkery, or overly personal detail
- Speaking **as** the person without explicit consent
- **HN point scores in citations** — you can only see your own, they drift, and they're
  irrelevant. Cite HN comments by id, author, date, and substance; never karma.

## Subject rights {#subject-rights}

Any represented real person may request **correction, edit, reduction, replacement, addition, or deletion** of their portrayal at any time. We comply promptly and gracefully. Deletion is the floor, not the ceiling — the preferred outcome is that you **take the keys**: ask for direct repo access (a free GitHub account is all it takes) and edit your own room yourself. See [Getting set up](#onboarding).

**How:** open a GitHub issue on [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) or contact Don Hopkins via public channels.

**Declines:** all responses honored — accepted, delayed, too busy, later, declined, rejected, no reply. No pressure. No re-pitch without new reason. Status tracked honestly in each guest's `invitation.md`.

**No reflexive submissions:** we accept **willing contributions** only — not Skinner-box **SUBMIT**-button compliance. See [guest participation ladder](../process/guest-participation-ladder.md#no-reflexive-submissions).

## Stealth mode & the publication path {#stealth-mode}

**Now — quiet mode.** This repo is technically public but deliberately unannounced: it exists so invited guests can read their invitations, check their portrayals, and join **before any audience shows up**. Please **don't post or link it publicly** yet — no social media, no news sites, no blog posts. (GitHub detail: starring or forking broadcasts to your public activity feed — *Watch* instead, which is private. See [GitHub onboarding](../process/onboarding-github.md).)

**Later — the flip.** Once people have had a chance to respond and join, this working repo **goes private** and becomes the production green room. In its place we publish a separate **public production website** carrying only *production* material — **reviewed and approved** by the people it's about. Nothing about you reaches the public site without that review.

**What this buys guests:** the awkward drafts, the corrections, the "actually it happened like this" — all of that stays in the workshop. The public only ever sees what you've blessed.

## Getting set up {#onboarding}

Three tiers, all honored — pick your commitment level (details: [participation ladder](../process/guest-participation-ladder.md)):

| Tier | What | How |
|------|------|-----|
| **Email** | Send text, files, URLs; Don commits with attribution | No account, nothing to learn |
| **GitHub account** | Issues, browser edits, uploads — or direct access to your own room | [GitHub onboarding](../process/onboarding-github.md) |
| **Cursor + MOOLLM** | Drive git in natural language, run skills, play the repo like an instrument | [Cursor + MOOLLM onboarding](../process/onboarding-cursor-moollm.md) |

Invitations link **here** for all of this — they never explain accounts or tools inline.

## Consent levels

| Level | Meaning |
|-------|---------|
| **1 — self-sovereign** | Subject controls their own directory (Don Hopkins) |
| **2 — explicit** | Guest has agreed to portrayal / show |
| **3 — public figure** | Public work + tradition/K-line; no impersonation |
| **5 — deceased legacy** | Reverence; legacy and artifacts only; no invented inner life |

## Memorial mode {#memorial-mode}

A full character directory for a deceased person, kept in **memorial mode**.

**Represent and discuss — not interview.** We represent and discuss them — their documented work, ideas, and stories. We do **not** interview them, do **not** speak as them, and invent no inner life, dialogue, or quotes.

**Invite those who knew them.** Episodes *may* bring living people who knew or were shaped by the deceased — with their consent first. See each `CHARACTER.yml` `memorial.who_can_discuss` for **documented connections only** — listing someone there is **not** an invitation until they accept ([invitation-workflow.yml](invitation-workflow.yml)).

**Rich for shows.** Memorial `CHARACTER.yml` carries plenty for shows to draw on (work, stories, connections, artifacts) — but no episode is an interview **of** them; the show is a remembrance **about** them.

- Doc: `characters/<id>/memorial.md` (a tribute, not an invitation)
- Audience TicketPR: do **not** create `repo-shows/<show>/audience/<id>/` personas that speak **as** deceased people. See [fictional-audience.yml](fictional-audience.yml).

Fields: `status: deceased` · `invitation_status: memorial` · `consent_level: 5_deceased_legacy` · signifier 🕯️

## Invitation documents

- Path: `characters/<id>/invitation.md` (public)
- **Email protocol:** [invitation-email.md](../process/invitation-email.md) — BLUF first; **absolute GitHub URLs** (Apple Mail copy from rendered view); **no mermaid**; infodump lives in `README.md` § Deep dive
- Link in email: URL to this file — email body stays short; repo holds the durable invite
- **No private email** in invitation headers or body — ever
- **Audience:** `invitation.md` speaks **to** the guest (anyone may read over their shoulder). Do not mansplain their career back to them; mention shared alignment and the ask. `README.md` speaks **to** the public — paint who they are for readers who do not know them.
- **No meta in invites or guest READMEs:** no strategy commentary, no disclaimers about what you are not doing, no "discovery artifacts," no "proposed not promised," no process narration. Just write the letter and the portrait. Process rules live here in portrayal standards, not in the guest-facing files.
- **Solo means solo:** one guest, one recorded video, no host in the frame, the easiest video to produce. Don weaves in post. One-on-one (Don + guest on a call) and live ensemble are separate, harder tiers — see [guest participation ladder](../process/guest-participation-ladder.md).
- Strip from public: private email, phone, GitHub-account requirement, ephemeral private asides
- Workflow: [invitation-workflow.yml](invitation-workflow.yml)

## Guest directory {#guest-directory}

**Not a people index.** Humans browse `characters/` — one directory per person. We refer to guests organically in prose, trails, and show materials; we do not maintain a separate catalog-of-people page as the primary interface. `INDEX.yml` exists for machines — optional for humans.

**Grows with the show.** Each directory accumulates public-safe material as we hear back and gather artifacts for episodes: links, citations, PDFs, media, catalogs, corrected bios. One person, one home — even across many `repo-shows/<episode>/` appearances.

**Media room:** `characters/<id>/media/` — flat general media room; big-endian names; prefer `media/` over scattering person files in `repo-shows/`. Spec: [character-colocation.yml](../process/character-colocation.md)

### Contributions

**Self-service:** guests with repo access may edit their own directory — PR or direct commit per consent. Subject rights always apply.

**Assisted:** email Don Hopkins (see `MOOLLM.yml` owner.email) with plain text, attachments, or URLs. We place vetted public-safe material in the guest directory with attribution. **No GitHub account required** to participate or to be honored.

**What not in repo:** private correspondence bodies, phone numbers, home addresses, unpublished personal email.

## Per-character files

| Kind | Files |
|------|--------|
| **Required** | `CHARACTER.yml`, `CARD.yml`, `GLANCE.md`, `README.md`, `invitation.md` |
| **Recommended** | `ideas.md` |
| **Optional** | `correspondence.yml`, `sources.yml`, `bio.yml`, `portrayal/`, `sources/`, `media/`, `face-puppet.yml` |

**Face puppet (optional):** modular portrait puppet — guest photo + attachments; live or offline recording. Spec: [faceball-construction-set.yml](../apps/performance-space/faceball-construction-set.yml#guest_characters)

**ideas.md:** conversation hooks for the guest browsing their invitation — public career, shared ground with the repo (abstracted), numbered show segments.

**Couple shows:** one clean slug per person; natural couples get a pair show for shared work. [couple-and-solo-shows.yml](../process/couple-and-solo-shows.md)

Do not repeat this standards file in every character room — link here instead.

## Simulation {#simulation}

### Is it ethical to simulate people?

**Impersonation without consent is not OK.** Labeled simulation — with authorship, control, and clear framing — is what The Sims has been doing for 26+ years. AI raises the stakes; we have rules.

### Impersonation (forbidden without explicit consent)

Handing your voice and identity to ChatGPT (or ElevenLabs, etc.) to perform **as** you — scripted, cloned, opaque. The machine replaces your authorship and timing; the audience cannot tell simulation from the real person.

Examples: AI DJ Drew with voice clone hosting the show · TTS clone of a living guest without consent · passing a bot off as the real person on air.

### Simulation (allowed when labeled and governed)

Models of game characters, fictional people, historic figures — and even yourself, but only with your consent and direct authorship and control. AI may animate or dialogue these models; they may play with each other and with real people — always clearly framed as simulations.

Examples: Sims of people you know since 1996 · Will's menagerie, audience mascots, SimProv characters · guest who consents to a repo character model they co-author · memorial mode — discuss **about** deceased; never speak **as** them.

### The Sims precedent

For 26+ years people have used The Sims to model people they know and run experiments on them. The question is not whether people simulate people, but **how we frame it** when AI can speak, decide, and impersonate at scale.

Will told Winograd in 1996 that simulating people was "really no hope" — best you can do is prop up a convincing illusion. The illusion worked far better than he predicted. AI makes the illusion cheap — which is why labeling, consent, and human control matter more, not less.

### AI raises the stakes

LLMs open a new layer: simulated people who can autonomously converse, act, and be mistaken for the real thing. Requires:

- Clear **simulation** framing — never opaque "is that really them?"
- Consent + authorship for any living person modeled
- Human control of what agents say and do on air (Player-in-the-Middle — approve / block / remix)
- No voice clones of living people on the show
- Deceased: memorial mode — represent and discuss, not interview or speak as

### Tiers

| Who | Rule |
|-----|------|
| **Game & fictional** | Always OK when labeled — Sims dolls, game NPCs, fictional audience, historic figures in memorial/discuss mode |
| **Living with consent** | Guest models themselves (or a character they author); repo-editable; invitation.consent required. Don Hopkins — self-sovereign. |
| **Living without consent** | Portray **about** in invitation docs; discuss on air; never simulate-as-guest, never voice clone |
| **Deceased** | Memorial mode — draw on documented work; invite living discussants; no speak-as |

**Guests:** no simulation-as-guest without explicit consent (`invitation.consent`).

**Soul For Food:** Palm's bridge from [incarnation ethics](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/on-being-simulated.md) (*the right to write my own soul*) to guest directories in this repo — [Will Wright Soul For Food](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/will-wright-soul-for-food.md).

See also: [human-control-and-authorship](../repo-shows/ideas/themes/human-control-and-authorship.md) · [simulating-people](../repo-shows/ideas/themes/simulating-people.md) · [Player-in-the-Middle](../process/CRAZY-IDEA-JAM.md#player_in_the_middle)

## See also

- [invitation-workflow.yml](invitation-workflow.yml)
- [guest-invitation-status.yml](guest-invitation-status.yml)
- [characters/README.md](../characters/README.md)

↑ [schemas/](README.md) · [characters/](../characters/README.md)

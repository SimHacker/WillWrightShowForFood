# Audience — TicketPR + MOOLLM character templates

When this show is **announced**, you are invited to participate **before** air date — even
before the guest accepts or a stream is scheduled.

**TicketPR spec:** [`../../process/ticket-pr.yml`](../../process/ticket-pr.yml)  
**MOOLLM tutorial:** [`CHARACTER.md`](CHARACTER.md)  
**Schema:** [`../../schemas/audience-character.yml`](../../schemas/audience-character.yml)

---

## Three ways in (easiest first)

1. **Hacker News** — comment on the show announcement thread
2. **GitHub issues** — open or comment on issues tagged for this show
3. **TicketPR** — PR your subdirectory under `audience/<your-github-username>/`

---

## Minimum TicketPR

```
audience/<you>/
  questions.yml     # required
```

Copy [`questions.yml`](questions.yml).

---

## MOOLLM character stack (recommended — learn by doing)

Copy the **whole template folder** into your TicketPR path:

```
audience/<you>/
  questions.yml      # required — TicketPR questions
  CHARACTER.yml      # MOOLLM body — you at this show
  CARD.yml           # abilities — ASK-QUESTION, WEAR-COSTUME, HOMEPLAY, …
  GLANCE.yml         # one-screen sniff
  SIMULATION.yml     # during/after show — MSPO RPG, inter-character protocols
  costume.yml        # optional — Come On Down rig
  CHARACTER.md  # optional in PR — link to template doc instead
```

Read [`CHARACTER.md`](CHARACTER.md) — Semantic Image Pyramid: GLANCE → CARD → CHARACTER → moollm SKILL.

Your audience character can participate in **MOOLLM simulation and interaction protocols** during
and after the show (question-advertisements, async MSPO RPG, GREET/ASK between audience members,
homefun harvest). Same skill ecosystem as the show — scoped to *you*, not guest portrayal.

**Not** `characters/` — guest portrayals live there; **audience/** is per-show, self-authored.

---

## Why TicketPR?

**Master ⇒ PR.** TicketMaster reframed: monopoly **Master** → collaborative **PR**. Free. Public.
In git. Questions visible to the guest while the show is still germinating.

Don **Philahue** harvests HN + issues + TicketPRs into the show's `audience/` tree.

---

## Live stream

Merged TicketPR → guest may know you before chat. Optional **Come On Down** with costume.

Guests may review and merge PRs. That is what GitHub is for.

Optional donations → recognition + call-on priority — never required. See `ticket-pr.yml#donations`.

---

## Template files in this directory

| File | Role |
|------|------|
| [`CHARACTER.md`](CHARACTER.md) | Human tutorial |
| [`GLANCE.yml`](GLANCE.yml) | Quick orientation |
| [`CHARACTER.yml`](CHARACTER.yml) | MOOLLM canonical body |
| [`CARD.yml`](CARD.yml) | Participation abilities |
| [`questions.yml`](questions.yml) | TicketPR question list |
| [`SIMULATION.yml`](SIMULATION.yml) | During/after show hooks |
| [`costume.yml`](costume.yml) | Stream identity |
| [`PLANTED-AUDIENCE.md`](PLANTED-AUDIENCE.md) | Guest-primed plants, running gags, late-night ethics |
| [`images/README.md`](images/README.md) | Headshot, chat avatar, photo with guest |

## Filled-out examples (Will Wright show)

Copy an example instead of starting blank:

- [`../../will-wright/audience/bot-slats/`](../../will-wright/audience/bot-slats/README.md) — bot + real Will photos
- [`../../will-wright/audience/fictional-bob-newbie/`](../../will-wright/audience/fictional-bob-newbie/README.md) — sim promo trilogy

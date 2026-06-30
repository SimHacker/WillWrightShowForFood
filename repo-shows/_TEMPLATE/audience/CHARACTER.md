# CHARACTER.md — audience character (prose companion to CHARACTER.yml)

> **Superposition.** `CHARACTER.yml` (structured outline) and `CHARACTER.md` (human-readable
> prose) are the **same character** in two renderings — both have meaning, both are read by the
> LLM. The `.md` is preferred for humans; the `.yml` is the machine girder. Keep them coherent.
> This follows official MOOLLM file-name conventions (`CHARACTER.yml`/`CHARACTER.md`,
> `CARD.yml`, `GLANCE.yml`, `SIMULATION.yml`). Learn the pattern by copying this folder.

Your **TicketPR** can be more than `questions.yml`. Copy the MOOLLM character stack from this
template folder and you get a **self-authored character** for one Repo Show — plus a gentle
on-ramp to [MOOLLM character creation](https://github.com/SimHacker/moollm/skills/character/SKILL.md).

**Schema:** [`../../../schemas/audience-character.yml`](../../../schemas/audience-character.yml)

---

## Why bother?

| Without MOOLLM stack | With MOOLLM stack |
|----------------------|-------------------|
| GitHub handle + questions | Named character with abilities |
| Guest reads plain yaml | Guest reads **CARD** abilities + your story |
| Live chat only | **MSPO RPG** — async questions when you are offline |
| Show ends | **After show** — inter-character protocols, homefun, simulation |

Audience characters participate in MOOLLM **simulation and interaction protocols** during and
after the show: question-advertisements, Don Philahue invoke, GREET/ASK between audience
members, homefun submission — same skill ecosystem as guests, scoped to *you at this episode*.

This is **not** `characters/will-wright/` (guest portrayal). You write **yourself** under
`audience/<your-github-username>/`.

---

## Semantic Image Pyramid (read in order)

| Level | File | Question |
|-------|------|----------|
| 1 | [`GLANCE.yml`](GLANCE.yml) | Is this me? |
| 2 | [`CARD.yml`](CARD.yml) | What can I *do* at the show? |
| 3 | [`CHARACTER.yml`](CHARACTER.yml) | Who am I, bound to which show? |
| 4 | [`questions.yml`](questions.yml) | What do I ask on air? (TicketPR) |
| 5 | [moollm character SKILL](https://github.com/SimHacker/moollm/skills/character/SKILL.md) | Full protocol |

Optional: [`SIMULATION.yml`](SIMULATION.yml) (during/after hooks), [`costume.yml`](costume.yml) (Come On Down).

---

## Copy checklist

Fork → create `repo-shows/<show>/audience/<your-github-username>/`:

```
audience/<you>/
  questions.yml      # required — TicketPR
  CHARACTER.yml      # recommended — MOOLLM body
  CARD.yml           # recommended — ASK-QUESTION, WEAR-COSTUME, …
  GLANCE.yml         # recommended — copy as-is, tweak one line
  SIMULATION.yml     # optional — MSPO RPG + after-show
  costume.yml        # optional — stream rig
  images/            # recommended — headshot, avatar (128²), with-guest
```

See [`images/README.md`](images/README.md). **Examples:** [`../../will-wright/audience/bot-slats/`](../../will-wright/audience/bot-slats/README.md), [`../../will-wright/audience/fictional-bob-newbie/`](../../will-wright/audience/fictional-bob-newbie/README.md).

Open PR. Guest and curators review. **Master ⇒ PR.**

---

## CARD abilities (edit the examples)

- **ASK-QUESTION** — fires when show topic matches your `questions.yml` entry
- **WEAR-COSTUME** — when called on stage (*Question Is Right*)
- **CHEER-GUEST** — good-faith appreciation (not heckling)
- **SUBMIT-HOMEFUN** — link your implementation PR after the show

Add your own abilities — keep `verifiable` pointing at your repo artifacts.

---

## Question tree — output queue + growing thread

Each character has **queues** (see [`../../../schemas/question-tree.yml`](../../../schemas/question-tree.yml)):

| Queue | Where | What |
|-------|-------|------|
| **Output** | `questions.yml` root list | Questions you want asked — `to: will-wright` or `to: any` |
| **Thread** | `children:` under each question | Answers, me-too, quorum, discussion — nested like HN |

**Owner rule:** the character who **asked** owns the tree. When Will answers your question on air,
the answer is appended as a child node — `kind: answer`, `by: will-wright`, `on_air: true`.
Other audience members pile on with `me_too`, `quorum`, or `discussion` — always attributed with `by:`.

Autonomous audience sims (MSPO) may ask while you are offline; when the guest answers during the
show, Don Philahue or the sim protocol **writes the answer into your question tree** in git.

Example after air:

```yaml
questions:
  - id: 1
    to: will-wright
    status: answered
    text: "Did your Sims feel their motive bars filling?"
    asked_at: 2026-07-01T20:12:00Z
    children:
      - kind: answer
        by: will-wright
        on_air: true
        text: "We talked about implication over simulation…"
        children:
          - kind: me_too
            by: palm
            text: "That's exactly the navigation I mean."
          - kind: follow_up
            by: palm
            text: "What about deletion — sleep or death?"
```

Statuses: `open` → `asked` → `answered` (thread may keep growing). Schema: [`question-tree.yml`](../../../schemas/question-tree.yml).

---

## During the show

- Don **Philahue** harvests TicketPRs and may **invoke** `ASK-QUESTION` from your CARD
- **Question-advertisements** (moollm `advertisement` skill) can fire when topics match — even if you are not in chat
- **MSPO RPG** — Massively Single-Player Online RPG: async audience characters participate when authors are offline (Will's Spore frame — apt for this project)

---

## After the show

- **SUBMIT-HOMEFUN** — implement an idea on your branch; link in `questions.yml` or CHARACTER
- **Inter-character** — GREET, ASK, CHEER other audience members in adventure layers
- **Harvest** — compose with new skills scooped from the show cauldron

Configure hooks in [`SIMULATION.yml`](SIMULATION.yml).

---

## Compare to guest `characters/_TEMPLATE/`

| | Guest `characters/<id>/` | Audience `audience/<you>/` |
|--|---------------------------|----------------------------|
| Who writes | Host + public sources | **You** |
| Consent | Guest invitation | **Self-sovereign** |
| Scope | Many shows | **One show** |
| CARD | Guest's public skills | **Your participation verbs** |
| Standards | `portrayal-standards.yml` | `audience-character.yml` |

Graduated? Later you may add a long-lived persona under `characters/` — audience characters are the **tutorial instance**.

---

## Links

- [`../../../process/ticket-pr.yml`](../../../process/ticket-pr.yml) — TicketPR constitution
- [`../../../characters/_TEMPLATE/`](../../../characters/_TEMPLATE/README.md) — guest portrayal template (different job)
- [MOOLLM character CARD](https://github.com/SimHacker/moollm/skills/character/CARD.yml)
- [Repo Show SKILL](../../../skills/repo-show/SKILL.md)

# TicketPR — Master ⇒ PR

[Repo Show format](FORMAT.md) · [Play Along skills](play-along-skills.md) · [Audience template](../repo-shows/_TEMPLATE/audience/)

---

## The hook

**TicketMaster → TicketPR.** Same syllable shape, opposite ethics. You don't buy a seat from a monopoly gatekeeper — you **propose** your presence to the repo. The guest and community review. Git history is the queue. Attendance is free; interest is expressed in merge requests, issues, and HN threads.

The pun is the design: **Master became PR**; the default branch became `main`. The door is wide.

## Why this matters

| Audience | Takeaway |
|----------|----------|
| Casual viewers | You never need a TicketPR to watch — HN, issues, and chat are enough |
| Committed fans | Your `audience/<you>/` folder is a public journal of every show you attended |
| Guests (even unconfirmed) | Merged TicketPRs are high-value signal — real people, real questions, before scheduling |
| Producers | Stewart Brand's 2006 Long Now mechanism, formalized in git |

## Lineage — Stewart Brand, Long Now 2006

At *Playing with Time* (Brian Eno + Will Wright, 26 June 2006), Stewart Brand gathered written audience questions, curated the pile, and read the best on stage. Two audience members (Dan Ancona, Mark Live) asked the same question — free SimCity's source so people can see how the rules work — and Will's on-stage "very open" cascaded through meetups, demos, emails, and appointments into GPL-3 Micropolis on OLPC.

**Two audience-submitted questions changed software history.** TicketPR formalizes Brand's mechanism: questions gathered before the show, curated by the producer, read to the guest, answered on the record — attributed and permanent instead of a paper pile.

See [VISION.md § Long Now](VISION.md#long-now-and-later).

## Participation ladder

| Friction | What |
|----------|------|
| Lowest | Comment on HN; open or comment on GitHub issues |
| **High value** | **TicketPR** — PR adding your subdirectory under `repo-shows/<show>/audience/<github-username>/` |

A TicketPR is harder than an issue — and that is the point. The guest sees real people building before the show is scheduled.

## Lifecycle

| Phase | Behavior |
|-------|----------|
| Before air | Seed questions; guest reads merged TicketPRs before scheduling |
| During live | Chat + PR threads; Don Philahue surfaces on stream |
| Time-shifted | Pause, explore links, append timestamped reactions |
| After air | Guest may answer long after; homefun branches; journal grows |

Starts as soon as a show is **announced** — including PROPOSED / INVITE / not_yet_scheduled.

## Directory layout

```
repo-shows/<show-slug>/audience/<github-username>/
  questions.yml          # required — your question queue
  CHARACTER.yml          # recommended MOOLLM stack
  CARD.yml · GLANCE.yml
  images/avatar.png      # 128×128 recommended
```

**Not** in `characters/` — that is for portrayed guests and long-lived personas. TicketPR is per-episode audience identity.

Optional prototype in `characters/<you>/`; reference from each episode's audience dir.

## MSPO — Massively Single-Player Online

Your audience character is **your** single-player layer on a shared artifact. Timestamped reactions; others replay with your layer visible. Journal fields: questions, answers, reactions, props thrown, simoleons, notes, homefun links.

## Live ritual — Come On Down!

Homage to *The Price Is Right*: costumed contestant called from the audience.

> **YOUR NAME HERE: COME ON DOWN to the QUESTION IS RIGHT!** You're the next contestant on the REPO SHOW!

Optional costume in your audience dir — text, image, or 3D model. Donations earn better **seats** (box front, balcony) — organic recognition, not a paywall. General admission stays free.

## Guest-primed audience

Guests may pre-prime **virtual** characters, costume plants, and running gags — transparently labeled in CHARACTER.yml. Late-night show energy, not deception. Sims and bots in a Will Wright talk are on brand when marked fiction.

| Directory | Who |
|-----------|-----|
| `audience/<github-username>/` | Fan-authored |
| `audience/guest-primed-<slug>/` | Guest or guest-approved curator |
| `audience/fictional-<slug>/` | Virtual; may be guest-, curator-, or fan-authored |

## Show hooks

- **Cold open:** Explain TicketMaster → TicketPR; show a merged audience folder live.
- **Brand lineage beat:** Two Long Now questions → Micropolis — ask your question.
- **Come On Down:** Call a merged TicketPR author on stream with costume.
- **MSPO replay:** Time-shifted viewer enables audience layers — repo as pausable object.

## Deeper links

| Topic | Where |
|-------|--------|
| Participation funnels | [participation-funnels.md](participation-funnels.md) |
| Guest participation tiers | [guest-participation-ladder.md](guest-participation-ladder.md) |
| Placement constitution | [character-colocation.md](character-colocation.md) |
| Brain stream overlay | [BRAIN-STREAM.md](BRAIN-STREAM.md) |
| ShowMaker graph | [showmaker-network.md](showmaker-network.md) |
| Audience character schema | [../schemas/audience-character.yml](../schemas/audience-character.yml) |
| Planted audience guide | [../repo-shows/_TEMPLATE/audience/PLANTED-AUDIENCE.md](../repo-shows/_TEMPLATE/audience/PLANTED-AUDIENCE.md) |

↑ [process index](README.md) · Girder: `ticket-pr.yml`

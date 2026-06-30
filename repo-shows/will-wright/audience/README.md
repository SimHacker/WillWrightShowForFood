# 🎟️ Welcome Packet — Audience of *A Repo Show with Will Wright*

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · *One-screen:* [FLIER.md](FLIER.md) · *Roster tables:* [INDEX.yml](INDEX.yml) · *Venue:* [`../venue/README.md`](../venue/README.md)

*You found your ticket. Here's everything you can do with it.*

**Get a TicketPR** — *TicketMaster, but the Master is a Pull Request.* It's your free ticket to
the live stream **and** a signal to Will before he even accepts: a real person (or a beloved
fictional character) with a real question, building in public, in git.

> **Short on time?** The one-screen version is the [FLIER](FLIER.md). This packet is the deep dive.

---

## 1. What is this?

A **Repo Show** is a live, unscripted conversation where **the GitHub repo IS the show** (a "repo"
is a GitHub project folder — the thing you're reading right now). You read along,
ask questions, and watch ideas become working code. The audience isn't passive — you participate
as a **character** with questions, a costume, and a seat, all stored as files in this folder.

- **The guest** is the topic. First up: **Will Wright** (SimCity, The Sims, Spore, Proxi).
- **Don Philahue** 🎙️ is the AI orchestrator/MC (a fictional avatar — *not* Don Hopkins) who
  surfaces your question live, renders Sims speech into Simlish, and runs the show's gears.
- **You** show up in `audience/` — as yourself, or as a clearly-labeled fictional character.

Full constitution: [`../../process/ticket-pr.yml`](../../process/ticket-pr.yml) · Format: [`../../process/repo-show-format.yml`](../../process/repo-show-format.yml)

---

## 2. Pick your friction level

| Level | How | Persists? |
|-------|-----|-----------|
| Easiest | Comment on the **Hacker News** thread when we announce | ephemeral |
| Easy | **[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues)** | in repo |
| **TicketPR** | Fork → copy [`_TEMPLATE/audience/`](../../_TEMPLATE/audience/) → `audience/<you>/` → PR | **on the record** |

A TicketPR is harder than a comment — and that's the point. The guest can see real people, real
questions, real stories building *before the show is even scheduled*.

---

## 3. Look at the examples first (steal them!)

The fastest way in is to **copy a character you like** and make it yours:

| Want to be… | Copy this | Why it's a good model |
|-------------|-----------|------------------------|
| A person with a great question | [richard-bartle/](richard-bartle/) | Real, consented, self-authored |
| A bot with real photos | [bot-slats/](bot-slats/) ⭐ | Full MOOLLM stack + `images/` |
| A Sims character | [fictional-bella-goth/](fictional-bella-goth/) | CARD advertisements + Simlish |
| A philosopher | [palm/](palm/) | Self-aware AI; links home to MOOLLM |
| A running gag | [fictional-broken-robot/](fictional-broken-robot/) | Crashes, begs, dragged off |
| Honored creator, front row | [heather-alvey/](heather-alvey/) | Real guest, reserved seat, plugs |

Or start from the blank [`_TEMPLATE/audience/`](../../_TEMPLATE/audience/). Tutorial: [`CHARACTER.md`](../../_TEMPLATE/audience/CHARACTER.md).

---

## 4. What's in a TicketPR

```
audience/<github-username>/
  questions.yml     # REQUIRED — your questions for Will (numbered)
  CHARACTER.yml     # recommended — who you are at THIS show (MOOLLM body)
  CHARACTER.md      # optional — prose companion (superposition with the .yml)
  CARD.yml          # recommended — your abilities as Sims-style ADVERTISEMENTS
  GLANCE.yml        # recommended — one-screen sniff
  SIMULATION.yml    # optional — your brain/algorithm/runbook (during + after show)
  costume.yml       # optional — Come On Down rig
  images/           # recommended — headshot, 128² avatar, with-guest (any style!)
  <anything else>   # drop in artifacts you want to show Will (see §7)
```

Minimum is **`questions.yml`**. Everything else makes you richer on stream.

---

## 5. How the PR workflow works (Master ⇒ PR)

1. **Fork** `SimHacker/WillWrightShowForFood` on GitHub.
2. **Copy** `_TEMPLATE/audience/` (or an example) into `repo-shows/will-wright/audience/<your-handle>/`.
3. **Fill in** at least `questions.yml`. Personalize the rest.
4. **Open a Pull Request.** Title it like `TicketPR: <your handle>`.
5. **Curators review.** Good-faith TicketPRs merge. Will may comment, answer early, or merge his own reply.
6. **You're in the audience** — on the record, visible to the guest, surfaced live by Don Philahue.

The default branch is `main`, by the way. The Master became a PR; the master branch became main.
We don't argue about it — the open, welcoming ecosystem is the whole statement.

> **The bigger picture: Repo Shows come with AI Skills for you to Play Along.** At the core is
> **MOOLLM**, delivered as skills you plug into **Cursor** (or another AI tool) — Anthropic-style
> skill wrappers are just the way it gets into your tool. Use them to participate **before, during,
> and after** a show: clone the GitHub repo and join in via branches, commits, pushes, PRs (reviewed
> and merged into the `main` timeline), plus issues and discussions — the same industrial-strength
> workflow the whole software industry runs on. Each show ships a **safe, focused, preloaded MOOLLM
> subset** with exactly what you need to join and play (a doorway into the full microworld). You
> don't need any of this to enjoy the show — but if you want to go deep, the real engine is right
> here. Details: [`../../../process/play-along-skills.yml`](../../../process/play-along-skills.yml).

---

## 6. How the show itself works

- **Before air:** TicketPRs accumulate. Don Philahue harvests HN + issues into `audience/`. The
  fictional warm-up act (Will's virtual children) keeps the room alive and shows newcomers the ropes.
- **Live:** pre-primed audience + Twitch/YouTube chat. Don calls questions (yours by name). Sims
  characters speak **Simlish**, translated live. "Come On Down — the Question Is Right!"
- **Seating:** donating beforehand earns front/box/balcony seats (organic visibility, called on
  first) — *never a paywall*; free general admission is picked on merit. You declare your seat as a
  property of your character. See [`FICTIONAL-AUDIENCE.md`](FICTIONAL-AUDIENCE.md#seating).
- **Closing ceremony:** the Ultimate Machine switches off the stream. Goodnight.
- **After:** submit **homefun** (implement an idea on a branch); best ones discussed on a later episode.
- **Time-shift friendly:** the show is built to be paused. A character may drop a link mid-topic
  (e.g. Palm's essay) — pause, read, fall down the MOOLLM rabbit hole, pop back primed for Will's answer.

---

## 7. Show Will something (artifacts & code)

Your folder is yours — drop in artifacts to show the guest, **within reason**:

- ✅ A **pointer to your own repo** (best — your real work)
- ✅ A **small program or code example** (a single file, a gist-sized demo)
- ✅ An image (real photo, AI-generated, photoshop, screenshot — [have fun](../../_TEMPLATE/audience/images/README.md))
- ✅ A short doc, a diagram, a rig description
- ⚠️ Keep it small and yours-to-share. Link big things; don't dump large binaries or someone else's code.

---

## 8. Fictional & planted audience (the warm-up act)

Will's **virtual children** — Sims characters, bots, tool-personae — already hold TicketPRs here.
They're **clearly-labeled fiction**: a warm-up act that shows exactly how a TicketPR works and
makes an empty `audience/` impossible *without being dishonest*. "Obvious plant" and "celebrity
audience member" gags are the late-night tradition, kept honest in git.

- **Policy:** [`FICTIONAL-AUDIENCE.md`](FICTIONAL-AUDIENCE.md)
- **Planted / running gags / guest-primed:** [`PLANTED-AUDIENCE.md`](../../_TEMPLATE/audience/PLANTED-AUDIENCE.md)
- **Cross-show regulars:** [`../../../process/repo-show-regulars.yml`](../../../process/repo-show-regulars.yml) · Balcony 🤡💀: [`fictional-tragic-clown/`](fictional-tragic-clown/) · [`fictional-grim-reaper/`](fictional-grim-reaper/)
- **Roster + ideas:** [`AUDIENCE-ROSTER-IDEAS.md`](AUDIENCE-ROSTER-IDEAS.md) · **Index:** [`INDEX.yml`](INDEX.yml)

---

## 9. House rules (short)

- Good-faith questions merge. Sharp, critical, funny — all welcome. Slurs and bad-faith bigotry are not.
- Be yourself, or a labeled character. **Don't impersonate** the guest or other real people.
- **No deceased real humans** speaking in `audience/` — memorial mode discusses *about* them with
  living guests ([portrayal-standards](../../../schemas/portrayal-standards.yml)).
- Family-friendly-ish. This is an educational show.

---

*COME ON DOWN to the QUESTION IS RIGHT — you're the next contestant on the REPO SHOW!*

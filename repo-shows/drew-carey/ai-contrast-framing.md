# AI, audience participation, and *Whose Voice Is It Anyway?*

*A note for Drew Carey — from Don Hopkins & the Will Wright Repo Show.*

*This page is about **you** (public record only — we don't speak as you). Built from your April 2023
radio experiment, our own TV experiments with Will Wright, and what we think we'd enjoy talking about
on air. Warm conversation, not a lecture.*

[Portrayal standards](../../schemas/portrayal-standards.yml) · [Show seed](SHOW.yml) · [Invitation](invitation.md)

---

## The short version

You already ran the experiment. Your audience told you the answer.

We built a show on the **other axis**: AI as backstage crew and orchestrator — **not** a synthetic
host. People talk, improvise, and voice the characters. The LLM writes code, queues audience
questions, and keeps the repo honest.

We'd love to have you on — maybe alongside Will — for improv, Sims lore, audience participation,
and an honest chat about AI if you want it. No homework. No trap.

---

## Your experiment (public record — April 2023)

On **Friday Night Freakout** (SiriXM) you tried something deliberate: **ElevenLabs voice clone +
ChatGPT-written script** hosting much of an episode. An intentional weekend test.

Fans noticed immediately. Choppy. Robotic. **"Soulless."** Missing *your* inflection. They wanted
**you** back.

What you said publicly (we're quoting the press, not putting words in your mouth):

- *"I violated a rule from Radio 101."*
- *"People like the personality of the DJs… You can just talk. That's what listeners like."*
- You agreed you wouldn't do **that** again — while staying curious about AI elsewhere (ad copy,
  tools, experiments that don't replace the personality on mic).

Sources: [Engadget](https://www.engadget.com/drew-carey-made-a-radio-show-with-ai-fans-werent-pleased-143014038.html) ·
[Inside Radio](https://www.insideradio.com/free/drew-careys-ai-lesson-people-like-personality/article_eea79b00-d1b2-11ed-a3c2-bb3ffc7002f9.html)

### *Whose Voice Is It Anyway?*

(Gentle ribbing — we couldn't resist.)

You spent years hosting the cathedral of **live human improv**. When the clone hosted the radio
show, the audience played the world's fastest game of *Whose Voice Is It Anyway?* — and voted
**Drew**. We get it. So do we.

---

## Our experiments — same itch, different lessons

Will Wright and I have been chasing **audience participation in TV and games** for a long time.
We didn't always nail it. We learned hard lessons too.

### The through-line

**Sims Family Album** → **CreationTV** (iPhone prototype) → **StoryMaker** → **Bar Karma** →
**Urban Safari** → **this Repo Show** (+ **MOOLLM** today)

| Chapter | What it was |
|---------|-------------|
| **StoryMaker** | Branching collaborative storytelling — audience proposes, votes, builds story paths |
| **Bar Karma** | **Actual network TV** (CurrentTV) — first online **community-developed** series; real episodes on real television |
| **Urban Safari** | Next iteration — **geolocated storytelling on maps**; capture cards in the field, follow other people's paths |
| **Repo Show + MOOLLM** | Bar Karma's grandchildren — git instead of opaque wiki flash; LLM orchestrates **code and cues** while **people** talk |

**Bar Karma did not win any Emmys.** (Neither did we expect it to.) What it *did* do was prove
that strangers on the internet could author broadcast television together — and that the hard part
is keeping **human personality and authorship** in the loop when the machinery gets clever.

We sympathize. You learned on radio in a weekend. We learned on TV over years. Same rule.

### Demos you can watch (no account needed)

- [CreationTV / Bar Karma](https://www.youtube.com/watch?v=Nb_-J1lv-B8)
- [StoryMaker (Stupid Fun Club)](https://www.youtube.com/watch?v=_2yEHs_WLzQ)
- [Urban Safari — GPS storytelling](https://www.youtube.com/watch?v=Db8KGNoeKHE)

More context: [make-play-tools-show tradition](../ideas/traditions/make-play-tools-show.yml#television_lineage)

---

## What we built instead of AI-DJ Drew

Our frame comes from **Douglas Engelbart** (1962): **augmentation, not replacement.** Computers —
and now LLMs — as **instruments**; humans stay in control of authorship and judgment.

| What fans rejected (your Freakout) | What we do on the Repo Show |
|-----------------------------------|----------------------------|
| AI voice clone **hosts** the show | **Humans** voice character puppets |
| ChatGPT writes the **patter** | **Zero-script** play-along improv |
| Synthetic personality replaces timing | LLM writes **code** + **orchestrates** people talking |
| Opaque *"is that really them?"* | Labeled staging; git-visible authorship |

### MOOLLM — backstage, not on the mic

**MOOLLM** is our microworld OS for the show: it writes and edits **repo code** live, queues
**TicketPR** audience questions, triggers scene cues — while **you** (or Will, or the audience)
improvise. It generates **text for fictional Sims characters**; **humans** perform them (face-puppet,
voice-puppet, Pink Trombone as a vocal instrument you *play*).

Whose Line energy: **the performer's timing is the joke.** The machine doesn't get the laugh.

### Sims Play-Along Narration — your lane

Audience sends gameplay recordings. Guest improvisers **narrate live** — making it up, Foreign Poet
style — over mute Sims footage. Same spirit as the **Maxis-built Drew Carey Show in-game segment**,
without needing EA to build a custom lot.

- [Format spec](../../process/sims-play-along-narration.yml)
- [Your gameplay segment (YouTube)](https://www.youtube.com/watch?v=5wr04-WmWkg)
- [House Party limo cameo](https://www.youtube.com/watch?v=Stgk80dcnH8)

---

## MicropolisAngel — when AI *does* talk (but not as you)

Later we're shipping **MicropolisAngel** — a Windows companion for people playing **The Sims 1**
on Steam (the game runs on PC only; Mac users get the web hub).

This is **not** a voice clone of the host. It's the thing millions of players already do manually:
**send ChatGPT a screenshot and ask for help.** We make it **easy** — capture screen + game
telemetry, get advice, **read it aloud** through the Simplifier accessibility lineage.

We playfully call it **"Chatting with God."** Pray for object-placement advice. Ask the Angel why
your Sim is on fire. (Wasn't starting a cult half the point of The Sims anyway?)

We're reclaiming **Angel**, **Soul**, and a little **God** the way culture reclaimed **Queer** —
for **gameplay**, not theology. Character models are **souls** that can live across games; the
Angel knows them. Earnest enough for people who use AI helpers seriously; funny enough for
people who've watched a Sim remove a pool ladder.

Optional subscriptions pay for tokens. Same pattern scales to **other games** — a cross-game Angel,
not a Sims impersonator.

Spec (planted, not announced yet): [MicropolisAngel](../../catalogs/micropolis-home/micropolis-angel.yml)

**The line:** AI advises **your** play in **your** game. It does not host the show pretending to
be Drew Carey.

---

## Simulation vs impersonation (if we go there)

There's a difference between **handing your voice to ChatGPT to impersonate you on air** and
**simulating game characters** (or yourself, with your consent) clearly labeled as simulation.

People have made Sims of partners, siblings, friends, and bullies for **26 years** and run
experiments on them. That ship sailed. AI raises the stakes — so we label, consent, and keep
humans in the loop.

More: [simulating-people theme](../ideas/themes/simulating-people.yml)

---

## Why we'd love to talk with you

- You're **in The Sims mythology** — House Party, the in-game *Drew Carey Show* episode, a room
  full of Sims who'd lose their minds to meet you.
- You're a **master of improv** — this show *is* improvisation inventing itself in real time.
- **The Price Is Right** is the cathedral of audience participation — our TicketPR homage grows
  straight from *Come On Down*.
- You **already proved** the AI-host rule with your own audience — we'd compare notes, not preach.
- Will and Don **already shipped audience-authored TV** — this is iteration three (or four), not a
  cold pitch.

---

## Conversation starters (only if you want them)

- Radio 101 vs Repo Show 101 — personality on mic vs personality in the puppet pit
- ChatGPT DJ scripts vs zero-script play-along narration
- Bar Karma and community TV — what would *you* add in the AI age?
- StoryMaker → Urban Safari → Repo Show — same idea, better tools
- *Whose Voice Is It Anyway?* — when the audience always picks the human

---

## This is not…

- A demand, contract, or implied endorsement
- A scheme to clone your voice or put words in your mouth
- Investor deck material or Hollywood packaging (that's not in this repo for you)

**Accepted, delayed, too busy, declined, or no reply — all honored gracefully.**

— Don Hopkins · [Will Wright Show For Food](https://github.com/SimHacker/WillWrightShowForFood)

*Machine-readable source:* [`ai-contrast-framing.yml`](ai-contrast-framing.yml)

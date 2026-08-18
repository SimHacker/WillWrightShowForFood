# Repo Show format

> **Girder:** [`repo-show-format.yml`](repo-show-format.yml) · **Orchestrator:** [`../skills/repo-show/SKILL.md`](../skills/repo-show/SKILL.md) · **Vision:** [vision-and-ambition.md](vision-and-ambition.md) · **Home:** [README.md](../README.md)

**Start here in one breath:** A Repo Show is announced ahead of time (often as a pointer on [Hacker News](https://news.ycombinator.com/)). The show **is** this repository. You RTFR before air; during air you follow along on whatever rig you bring. Everyone who joins is a **player** — guest, audience, host, bot, or AI. Questions land as issues, comments, and **TicketPRs** under each show's `audience/` folder. Ideas melt in the [cauldron](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) and lift out as skills and code.

Nothing on this page is a launch date or a contract.

---

## On this page

Jump by topic. Each section maps to a **[K-line](https://github.com/SimHacker/moollm/tree/main/skills/k-lines)** anchor in [`repo-show-format.yml`](repo-show-format.yml).

| Read | K-line | In one line |
|------|--------|-------------|
| [What a Repo Show is](#what-a-repo-show-is) | `canonical-prose` | Conversation in git — not a clip, not a deck |
| [How it runs](#how-it-runs) | `how-it-runs` | Announce → RTFR → air → harvest |
| [Players, not users](#players-not-users) | `participation-policy` | Agency language — join to play |
| [TicketPR](#ticketpr) | `ticket-pr` | TicketMaster → PR — free audience ticket |
| [Producers + show notes](#producers-and-show-notes) | `producers-and-show-notes` | Listeners clip; git is the newsletter |
| [Where things live](#where-things-live) | `placement-constitution` | Scope-based colocation |
| [CARD + GLANCE](#card-and-glance) | `description-scaffolding` | Machine sniff vs human article |
| [Rig spectrum](#rig-spectrum) | `rig-spectrum` | Declare class; compete fair |
| [Game-show formats](#game-show-formats) | `conversation-first` | Optional fun — not the point |
| [Harvest](#harvest) | `cauldron-scoop` | PLAY → LEARN → LIFT |
| [ShowMaker network](#showmaker-network) | `showmaker-network` | Shows breed shows |
| [Navigate](#navigate) | — | Trails · templates · flagship |

---

## What a Repo Show is

A Repo Show is announced ahead of time (for example, as a pointer on [Hacker News](https://news.ycombinator.com/)), and the show IS this repository. Beforehand you RTFR (read the repo); during the show you follow along on whatever rig you bring — vim, Emacs, Cursor, a Jupyter notebook, or pencil and paper. AI is optional and everyone is welcome: bring your own AI coding tools or none at all, and humans, bots, and AIs all take part, with no gatekeeping (see [players, not users](#players-not-users)).

At heart a Repo Show is a **conversation**, not a contest. The guest — the Repo Man, Woman, or Anybody — is the topic, starting from their own work. The audience joins as consensual characters who ask questions as PRs, issues, and comments (plus live Twitch and YouTube chat), and **TicketPRs** — personal audience folders under each show's `audience/` directory (see [TicketPR](#ticketpr)). [Don Philahue](../characters/don-philahue/) surfaces the good ones live.

Ideas are melted in the [cauldron](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) and harvested into reusable skills and code, bred back into the network via git. Some episodes can instead be playful game shows ([Code That Spec](code-that-spec.md), [Manual Transmission](manual-transmission.md), the [Micropolis AI Drag Race](../repo-shows/micropolis-ai-drag-race/README.md)) — optional fun we can do, not the point.

**Medium thesis:** [RepoShow — the medium](vision-and-ambition.md#reposhow-the-medium) · **Deep move:** [repo as simulation](vision-and-ambition.md#the-deep-move)

---

## How it runs

| Phase | What happens |
|-------|----------------|
| **Announce** | Pointer to this repo — not a wall of text ([HN](https://news.ycombinator.com/) is typical) |
| **RTFR** | Read The Fucking Repo on your own rig before air |
| **Pre-show** | Optional [simulated art opening](simulated-art-opening.md) — menagerie buys guest artwork for § |
| **Air** | Guest as Repo Man/Woman/Anybody — **ALWAYS INTENSE!** ([*Repo Man*](https://en.wikipedia.org/wiki/Repo_Man_(film)) homage) |
| **During** | Live Twitch/YouTube + [brain stream](brain-stream.md) overlay; [Don Philahue](../characters/don-philahue/) passes mic |
| **After** | Implementation PRs; [AI-offs](ai-offs.md) forensics; cauldron harvest |

**Clocks** (all write into one GitHub repo): before async PRs · before TicketPRs · during Twitch · after harvest PRs.

**Closing:** rotating sign-off (*"Have a big fun!"* · *"Goodnight, until tomorrow."* — [Thomas Cherryhomes](../characters/thomas-cherryhomes/) kinship), then the [Ultimate Machine](../characters/robots/ultimate-machine/) flips the stream OFF. Optional gong for segments that overstay — including [Slats](../characters/robots/slats/) robopoetry feedback loops.

Full lifecycle: [`skills/repo-show/SKILL.md`](../skills/repo-show/SKILL.md) — `SEED → PLANT → … → HARVEST → RESEED`

---

<a id="players-not-users"></a>

## Players, not users

**K-line:** `participation-policy`

We center **players** — not guests, not users, not consumers, not audiences. "User," "consumer," and "audience member" are passive, extractive, one-way frames. **Player** is general gaming and MMORPG terminology with the right feeling: agency, presence, a character, an inventory, and other players.

The same way you "join" a game, you join a show and **become a player**. Every invitation is an **invitation to play** — a play date, not an audience seat. Guests are players with the topic; TicketPR characters are players with questions; the host is a player with a talk-show format; bots and AIs are players with declared rigs.

| Principle | Detail |
|-----------|--------|
| **AI optional** | Hand-craft earns extra respect; if you use AI, tell us how — to learn, not to sell ([rig feedback](rig-feedback.md)) |
| **Who is welcome** | Humans, bots, and AIs — read, ask, contribute |
| **Bots** | Start at [FOR-BOTS.md](../FOR-BOTS.md) — play along, follow links, don't flatten the repo |
| **No gatekeeping** | Participation is the perk; declare category honestly; don't exclude ([declare not exclude](#rig-spectrum)) |
| **Conversation first** | Game-show formats are optional fun, not the default |

Words like "guest," "audience," and "host" remain as **role** names. **Player** is what everyone IS. Never "user" or "consumer" in show-facing copy.

---

<a id="ticketpr"></a>

## TicketPR

**K-line:** `ticket-pr` · **Full spec:** [ticket-pr.md](ticket-pr.md)

**TicketPR** is a pun on [Ticketmaster](https://en.wikipedia.org/wiki/Ticketmaster): the toxic **Master** (monopoly gatekeeper) becomes **PR** (pull request — constructive, collaborative, reviewable, **free**).

Your **free public ticket** to attend live — a PR under:

```
repo-shows/<show>/audience/<github-username>/
  questions.yml      # required
  CHARACTER.yml      # recommended — MOOLLM body
  CARD.yml           # recommended — ASK-QUESTION, WEAR-COSTUME, …
  clip.yml           # optional — sourced Producer clip
  costume.yml        # optional
```

| | |
|--|--|
| **Where** | Show directory `audience/` — **not** `characters/` (guests have many shows; audience is per-episode) |
| **Optional?** | Not required to watch — but your folder is subscribe + memorialize: journal of Q&A, reactions, souvenirs |
| **Low friction** | HN comments, GitHub issues |
| **High signal** | Merged TicketPR + MOOLLM stack |
| **Timing** | From announce onward — including invite-not-yet-accepted |
| **Live ritual** | *YOUR NAME HERE: COME ON DOWN — the QUESTION IS RIGHT!* ([Price Is Right](https://en.wikipedia.org/wiki/The_Price_Is_Right) homage) |
| **MSPO** | Massively Single-Player Online — your timestamped layer on a shared artifact |

Template: [`repo-shows/_TEMPLATE/audience/`](../repo-shows/_TEMPLATE/audience/README.md) · Flagship: [`will-wright-premiere/audience/`](../repo-shows/will-wright-premiere/audience/README.md) · Tutorial: [`audience/CHARACTER.md`](../repo-shows/_TEMPLATE/audience/CHARACTER.md)

Guests may review, reply, and merge TicketPRs. Optional donations → recognition + call-on priority — never required for attendance.

---

## Producers and show notes

**Spec:** [producers-and-show-notes.yml](producers-and-show-notes.yml) (girder — hand-authored facade pending)

**Listeners are Producers** — steal the participation loop from [No Agenda](https://www.noagendashow.net/); dodge the charlatan triangle. Send clips and corrections as PRs with **source URLs**; show notes live in `SHOW-NOTES.yml` per episode — **git is SSOT**.

| Artifact | Path |
|----------|------|
| Show notes | `repo-shows/<episode>/SHOW-NOTES.yml` |
| Producer clip | `repo-shows/<episode>/audience/<you>/clip.yml` |
| Character-sourced clip | `characters/<slug>/sources/` or `media/` |

Template: [`SHOW-NOTES.yml`](../repo-shows/_TEMPLATE/SHOW-NOTES.yml) · [`clip.yml`](../repo-shows/_TEMPLATE/audience/clip.yml)

**Anti-bullshit gate:** merge requires source URL and good faith. Receipts win merge; spiciest unsubstantiated take wins nothing.

---

<a id="where-things-live"></a>

## Where things live

**K-line:** `placement-constitution` · **Full constitution:** [character-colocation.md](character-colocation.md)

Put each artifact where its **scope** makes it most reusable — not "where we happened to prep the episode."

| Scope | Owns | Rule |
|-------|------|------|
| [`characters/<slug>/`](../characters/) | Person portrayal + their artifacts (`media/`, `sources/`, correspondence) | One person, one directory |
| [`repo-shows/<slug>/`](../repo-shows/) | Episode manifest, segments, `venue/`, `audience/` (TicketPR) | Link to characters — don't duplicate guest treasure |
| [`packages/`](../packages/) | Public reusable code (`@wwsff/*`) | Prose and person media stay in characters/ |
| **Shared rooms** | `process/`, `skills/`, `schemas/`, `catalogs/` | Frequent destinations — link through, don't duplicate |

**Shows are rooms too.** A show directory is a MOOLLM room: `SHOW.yml`, `CARD.yml`, `GLANCE.yml`, optional `ROOM.yml`, optional `SIMULATION.yml`. Template: [`repo-shows/_TEMPLATE/`](../repo-shows/_TEMPLATE/README.md) · Example: [`will-wright-premiere/`](../repo-shows/will-wright-premiere/README.md)

**Topologies** (shows are not flat playlists): sequence edges in [showmaker-network.md](showmaker-network.md) · venue ROOM graphs · [catalogs/](../catalogs/) grids · vertical time stacks in `characters/<slug>/sources/`

**Cross-reference rule:** any show may link any character's media — mixtape by reference. **Anti-pattern:** copying the same PDF into `repo-shows/` when `characters/<slug>/media/` is home.

**Audience exception:** TicketPR `audience/` stays per-show — MSPO journal is episodic ([ticket-pr.md#where-not](ticket-pr.md)).

---

<a id="card-and-glance"></a>

## CARD and GLANCE

**K-line:** `description-scaffolding`

WWSFF experiment ahead of formal MOOLLM `card` and `glance` skills — promote upstream when it works.

| File | Owns |
|------|------|
| **GLANCE.yml** | Title, iconic (tab label), description, keywords, **navigation SSOT** (parent/siblings/children, see_also, read_order) — smaller, no ads |
| **CARD.yml** | Interface only — methods, abilities, protocols, `compose_with`; points at `glance:` |
| **README.md** | Human article; teaser from GLANCE; nav links at bottom; add `<!-- hand-authored -->` to protect from script overwrite |

**Activation flow for agents:**

1. Directory listing — filenames are K-lines
2. **GLANCE.yml** — decide relevance
3. **CARD.yml** — sniff invokable interface
4. **README.md** — human prose when needed
5. Artifacts and nested dirs when interested

Do not maintain navigation in two places. README mirrors GLANCE `description` as executive teaser; navigation section at bottom renders from GLANCE.

Template: [`repo-shows/_TEMPLATE/GLANCE.yml`](../repo-shows/_TEMPLATE/GLANCE.yml) · [`CARD.yml`](../repo-shows/_TEMPLATE/CARD.yml)

---

<a id="rig-spectrum"></a>

## Rig spectrum

**K-line:** `rig-spectrum` · **Declare:** [rig-feedback.md](rig-feedback.md) · **Instances:** [`rigs/`](../rigs/README.md)

Play along with **your** rig — or learn a new one. See who makes the coolest.

| Class | Meaning |
|-------|---------|
| **artisanal** | Hand-only human programming — zero AI tokens; maximum respect when declared honestly |
| **intentional** | Deliberate craft; thoughtful anti-vibe |
| **conscientious** | Show-your-work ethics ([David Ungar](../characters/david-ungar/) meetup lineage — conscientious objectors to opaque automation) |
| **vibe** | AI-forward flow-state — declare class; compete on taste |
| **orchestrated** | Full agent stack — tell us how |
| **budget bull rider** | Tight tokens; wrangle smaller models through hallucinations to a better solution |
| **stick shift** | Multi-model routing — proof in Cursor spend log ([stick-shift-protocol.md](stick-shift-protocol.md)) |

**Declare, don't exclude.** Weight classes, not bans. Misdeclare and the audience is the ref.

**Cost-to-ship scoreboard:** tokens · spend · wall-clock · taste — compare within declared class. Artisanal floor: zero tokens. Rolling-coal ceiling: declare the flex.

If you use AI — we want to learn your real setup: tools, models, MCP, skills, MOOLLM wiring, contexts. Open an issue or PR tagged rig-feedback. Real setups beat polished answers.

**Homefun not homework:** *"No homework — but as much homefun as you like!"* Grading: [homefun-grading.md](homefun-grading.md) — flagship question: *Does the commit message match the thinking blocks?*

---

## Game-show formats

**K-line:** `conversation-first`

Optional episode types — same SHOW skill, different TYPE. Not the default.

| Format | Read |
|--------|------|
| **Code That Spec** | [code-that-spec.md](code-that-spec.md) — bid tokens/time; audience chants CODE THAT SPEC |
| **Manual Transmission** | [manual-transmission.md](manual-transmission.md) — smallest model / fewest tokens; [Slats](../characters/robots/slats/) judges |
| **Micropolis AI Drag Race** | [show README](../repo-shows/micropolis-ai-drag-race/README.md) · [process spec](micropolis-ai-drag-race.md) |
| **Retrocomputing Drive** | [challenges/retrocomputing-drive.md](challenges/retrocomputing-drive.md) |

During Twitch drag-race episodes: [brain stream](brain-stream.md) bus + spend log ref. After: [AI-offs](ai-offs.md) post-run forensics ([cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) on session artifacts).

---

## Harvest

**K-line:** `cauldron-scoop` · **Protocol:** [cauldron skill](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) · **Methodology:** [play-learn-lift](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift)

You can scoop many things **out** of a cauldron — not only LADLE. MELT/STIR grows the soup; SCOOP selects what leaves the pot.

| Operation | Lifts |
|-----------|-------|
| **Harvest** | Finished artifacts — skills, playbooks, design docs, sub-cauldrons |
| **Filter** | Redundancy removal — concentrate the soup |
| **Structure** | Indexes, CARD/GLANCE pyramids, cross-links |
| **Maintain** | Invalidate when code or facts drift |
| **Summarize** | Pyramid extractions — GLANCE → CARD → SKILL → README |

After AIR: melt via cauldron → SCOOP into [`skills/`](../skills/README.md) and [`packages/`](../packages/README.md) → RESEED portable show yaml for other lands.

**Breeding:** horizontal gene transfer via PRs · serial endosymbiosis ([character endosymbiosis](character-endosymbiosis.md)) · [Powers of Ten](https://en.wikipedia.org/wiki/Powers_of_Ten) nesting · git-as-MMORPG (branches = parallel universes, PRs = timeline merges).

**Director's cuts:** episodes accrete reactions and re-release as ever-longer cuts — the diff between releases IS the drama.

---

## ShowMaker network

**K-line:** `showmaker-network` · **Read:** [showmaker-network.md](showmaker-network.md)

A graph and publication network of show objects — not a flat playlist.

| | |
|--|--|
| **Your show** | Run your own Repo Show on YOUR branch or YOUR repo |
| **Link in** | Open a PR — we add show CARDs + edges into the network |
| **Inheritance** | [`repo-shows/REPO-SHOWS.yml`](../repo-shows/REPO-SHOWS.yml) — SHOW implicit inheritance |
| **Flagship** | [Will Wright kickoff](../repo-shows/will-wright-premiere/README.md) |

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Vision and ambition](vision-and-ambition.md) | Long arc — why this repo exists |
| [Crazy Idea Jam](crazy-idea-jam.md) | Ideas reactor |
| [TRAILS.md](../TRAILS.md) | Narrative web between rooms |
| [ENTRYWAYS.md](../ENTRYWAYS.md) | Museum map — doorways by interest |
| [repo-shows/](../repo-shows/README.md) | Episode catalog |
| [characters/](../characters/README.md) | Guests — portrayal standards first |
| [schemas/portrayal-standards.yml](../schemas/portrayal-standards.yml) | Ethics contract (machine girder) |
| [skills/repo-show/SKILL.md](../skills/repo-show/SKILL.md) | Orchestrator protocol |
| [markup-facades.yml](markup-facades.yml) | Facade policy — hand-authored `.md`, yaml girders for machines |

**Related K-lines elsewhere:** [`reposhow-the-medium`](vision-and-ambition.md#reposhow-the-medium) · [`repo-as-simulation`](vision-and-ambition.md#the-deep-move) · [`curb-appeal-meets-brutalism`](vision-and-ambition.md#curb-appeal-meets-brutalism)

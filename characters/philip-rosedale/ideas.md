# Ideas to explore with Philip Rosedale 🌐

*Conversation hooks for a Repo Show — **Don's proposed topics**, grounded in Philip's public work
and documented correspondence. Things Don would love to follow **with** Philip; not quotes, not
claims about what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation guest

## What Philip has done

**Philip Rosedale** — created **Second Life** (Linden Lab); co-founded **High Fidelity** (open,
distributed VR — later wound down). Built **worklist.net** so contractors could ship in-world
JavaScript via **JSON message passing**. Don shipped **voting box** and **text chat** on the
worklist (2017); Philip QA'd. They **design-jammed** on Don's **VR diffusion-limited aggregation**
simulation — Philip is into **cellular automata** as world substrate. Philip's focus returned to
**Second Life**; the Repo Show centers SL identity **import/export** ↔ MOOLLM character souls.

## Shared ground

**Caitlyn Meeks-Ferragallo** intro (2016). Don contractor via **worklist** (2017): voting box
#21257, text chat #21280 — Philip approved; **Fancy Voting Box** was his favorite. Same **JSON
message-passing / JavaScript-everywhere** architecture Don loves in **UnityJS**. Don compared HiFi
to Croquet and Livelymerge in the **Dan Ingalls** thread (2021). MOOLLM outreach drafted privately
— worlds as context, LambdaMOO heritage, GitHub-as-MMORPG, Sims character simulation. See
[`correspondence.yml`](correspondence.yml).

## The hooks

### 1. Worklist plugins — distributed JavaScript that actually shipped
The **HiFi plugin architecture**: script entities, **JSON message passing**, live in-world apps
without leaving the browser toolchain. Don's **voting box** and **range-based text chat** — Philip
QA on air. Compare to today's "metaverse" stacks that never had a worklist.

### 2. YAML Jazz + GitHub-as-MMORPG — representation and collaboration in the LLM age
**Comments** as a **semantically meaningful overlay** of intent and annotations — accessible and
generatable by humans and LLMs. **GitHub-as-MMORPG** for the durable async layer; stream for sync.
SL avatar souls as yaml-jazz character directories. See
[`yaml-jazz-collaboration-stack.md`](../../process/trails/yaml-jazz-collaboration-stack.md).

### 3. Worlds as address space — Second Life × LambdaMOO × MOOLLM
Rooms as directories, paths not central object allocators, prototype inheritance — Don took MOO
seriously. Philip built the biggest user-created world economy. MOOLLM's **GitHub-as-MMORPG** (issues
= quests, branches = timelines, PRs = deals) as the durable layer under real-time channels.

### 4. The code that creates a world…
Philip's public thread on world-code and consciousness meets MOOLLM's design: the **context window
is the stage**; one LLM call runs many characters for many turns (**speed of light**, not carrier
pigeon). Build something small on air in the open repo.

### 5. Sims lineage — character simulation in virtual worlds
Don + **Will Wright** at Maxis; **SimObliterator** bridge — drop a 25-year-old Sims save in and
talk to the character. Philip's worlds always had avatars with stories; what would persistent
characters look like with MOOLLM souls?

### 6. VR DLA / cellular automata — the HiFi design jam
Don's **CAM6** emulator (C → C++ → JavaScript) and **diffusion-limited aggregation** in VR — Don
and Philip **design-jammed** this in HiFi. Philip's CA interest (Dave Ackley thread; Wolfram on HiFi
board). Run a small CA world substrate on air; Ackley/Movable Feast as history beat if time.

### 7. Second Life avatar import/export ↔ MOOLLM souls
User-created identity portability — export an SL avatar/persona into an open **MOOLLM** character
directory (YAML soul file, git-durable). Cousin of **SimObliterator** / Bifrost for Sims saves.
Philip's economy meets Don's microworld stack.

### 8. HiFi × UnityJS × Croquet × Livelymerge — the comparison Dan started
Don named HiFi in the **Dan Ingalls** correspondence. Philip gets the architect's chair: why JSON
plugins? What would you steal for a 2026 live-object stack? Pair or cross-reference with Dan's
**Livelymerge** episode.

## Sources (public)

- [`correspondence.yml`](correspondence.yml) · [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/philip-rosedale-hifi-moollm.yml`](../../repo-shows/philip-rosedale-hifi-moollm.yml)
- VotingBox.js: http://donhopkins.com/home/hifi/VotingBox.js
- MOOLLM designs: GitHub-as-MMORPG, MOO-HERITAGE, CHARACTER-SIMULATION-INDEX (SimHacker/moollm)
- Trail: [`process/trails/yaml-jazz-collaboration-stack.md`](../../process/trails/yaml-jazz-collaboration-stack.md)
- YAML Jazz skill: https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz

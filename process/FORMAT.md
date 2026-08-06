<!-- GENERATED from `process/repo-show-format.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:7c4c1bbd365a7156 -->

# Repo Show format

> **Girder:** [`repo-show-format.yml`](repo-show-format.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Canonical Prose

A Repo Show is announced ahead of time (for example, as a pointer on [Hacker News](https://news.ycombinator.com/)), and the
show IS this repository. Beforehand you RTFR (read the repo); during the show you follow
along on whatever rig you bring — vim, Emacs, Cursor, a Jupyter notebook, or pencil and paper.
AI is optional and everyone is welcome: bring your own AI coding tools or none at all, and
humans, bots, and AIs all take part, with no gatekeeping (see [participation policy](#participation-policy)).
At heart a Repo Show is a conversation, not a contest. The guest — the Repo Man, Woman, or
Anybody — is the topic, starting from their own work. The audience joins as consensual
characters who ask questions as PRs, issues, and comments (plus live Twitch and YouTube chat),
and **TicketPRs** — personal audience folders under each show's `audience/` directory (see
[TicketPR](#ticket-pr)). [Don Philahue](../characters/don-philahue/) surfaces the good ones live. Ideas are
melted in the [cauldron](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) and harvested into reusable skills and code, bred back into the network
via git. Some episodes can instead be playful game shows ([Code That Spec](code-that-spec.yml), [Manual Transmission](manual-transmission.yml),
the [Micropolis AI Drag Race](micropolis-ai-drag-race.yml)) — optional fun we can do, not the point.

## Meta

| Key | Value |
|-----|-------|
| **id** | repo-show-format |
| **canonical** | yes |
| **play_lift_learn** | https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift |
| **cauldron** | https://github.com/SimHacker/moollm/tree/main/skills/cauldron |
| **showmaker_network** | [showmaker-network.yml](showmaker-network.yml) |

## Placement Constitution

- **spec:** [character-colocation.yml](character-colocation.yml)
- **one_line:** Put each artifact where its scope makes it most reusable. Characters own person stuff.
Shows reference — they do not hoard guest treasure. Code graduates to [packages/](../packages/). Rooms
are navigable context maps; shows are rooms too. CARD + ROOM + SIMULATION cardify interfaces.
- **principle:** Colocate by **scope**, not by "where we happened to prep the episode." A guest on three
shows still has one home. A library used by many shows lives in [packages/](../packages/) or a shared room.
MOOLLM is flexible about directory layout — lean into what filesystems and LLMs are great at:
paths, names, links, rooms, cards. [Postel's law](https://github.com/SimHacker/moollm/tree/main/skills/postel): be liberal in what you accept, conservative
in what you emit (well-formed yaml, stable links, one canonical copy).
### Scopes

- **characters:**
  - path: [characters/<slug>/](../characters/)
  - owns: Person portrayal + their artifacts ([media/](../characters/will-wright/media/), [sources/](../characters/will-wright/sources/), correspondence)
  - rule: One person, one directory — pleasant surprise when they open it
  - show_relation: Shows list one or more guests; episode yaml LINKS to character paths
- **repo_shows:**
  - path: [repo-shows/<episode-slug>/](../repo-shows/)
  - owns: Episode manifest, segments, venue/, audience/ (TicketPR), episode-only glue
  - rule: Refer to [characters/<slug>/](../characters/) — do not duplicate person PDFs, catalogs, galleries
  - is_also_a_room: A show directory IS a MOOLLM room. Drop SHOW.yml, CARD.yml, GLANCE.yml, optional ROOM.yml,
optional SIMULATION.yml at the show root — same cardify pattern as characters and audience.
Show-rooms live in repo-shows/; they need not live under a top-level rooms/ collector.
- **packages:**
  - path: [packages/](../packages/)
  - owns: Public reusable code (@wwsff/*) factored from homefun harvests
  - rule: Prose and person media stay in [characters/](../characters/); generalized libraries land here
- **shared_rooms:**
  - what: Directories that are activation context for many shows — not owned by one episode.
[process/](./), [skills/](../skills/), [schemas/](../schemas/), [catalogs/](../catalogs/), venue graphs.
  - navigation: Shows and characters link through them; frequent destinations, not duplicates
  - moollm: https://github.com/SimHacker/moollm/tree/main/skills/room/ — ROOM.yml, exits, regions

### Shows As Rooms

- **cardify:** GLANCE.yml — title, description, keywords, navigation SSOT, read_order, see_also (smaller, no ads).
CARD.yml — interface: methods, abilities, protocols (read GLANCE + CARD together).
ROOM.yml optional compass; SIMULATION.yml runtime. README renders GLANCE nav for humans.
### Typical Files

- **required:**
  - [SHOW.yml](../repo-shows/will-wright-premiere/SHOW.yml)
- **recommended:**
  - [README.md](../repo-shows/_TEMPLATE/README.md)
  - [CARD.yml](../repo-shows/_TEMPLATE/CARD.yml)
  - [GLANCE.yml](../repo-shows/_TEMPLATE/GLANCE.yml)
- **optional:**
  - [ROOM.yml](../repo-shows/_TEMPLATE/ROOM.yml)
  - [SIMULATION.yml](../repo-shows/_TEMPLATE/SIMULATION.yml)
  - [SEGMENTS.yml](../repo-shows/will-wright-premiere/SEGMENTS.yml)
  - [venue/](../repo-shows/will-wright-premiere/venue/)
  - [audience/](../repo-shows/_TEMPLATE/audience/)

- **template:** [repo-shows/_TEMPLATE/audience/](../repo-shows/_TEMPLATE/audience/)
- **show_template:** [repo-shows/_TEMPLATE/](../repo-shows/_TEMPLATE/)
- **example:** [repo-shows/will-wright-premiere/venue/ROOM.yml](../repo-shows/will-wright-premiere/venue/ROOM.yml)

### Topologies

- **note:** Show networks are not flat lists. Arrange episodes as maps, sequences, version stacks,
grids — whatever helps humans and agents navigate. MOOLLM room skill supports pie-menu
compass exits, grid quadrants, sparse cells, vertical stacking of versions.
### Patterns

- **sequence:** [showmaker-network.yml](showmaker-network.yml) edges · [REPO-SHOWS.yml](../repo-shows/REPO-SHOWS.yml) — forebear → flagship → topical
- **map:** venue ROOM graphs (e.g. [will-wright-premiere/venue/ROOM.yml](../repo-shows/will-wright-premiere/venue/ROOM.yml)); cardinal exits between show-rooms
- **grid:** [catalogs/](../catalogs/) indexes; ne/nw/sw/se quadrants per [moollm room TOPOLOGY.yml](https://github.com/SimHacker/moollm/blob/main/skills/room/TOPOLOGY.yml)
- **vertical_stack:** [characters/will-wright/sources/](../characters/will-wright/sources/) — time strata; compare eras by scrolling up/down

- **moollm_refs:**
  - https://github.com/SimHacker/moollm/tree/main/skills/room/SKILL.md
  - https://github.com/SimHacker/moollm/tree/main/skills/room/TOPOLOGY.yml

- **cross_reference:**
  - allowed: Any show may link any character's media — guest on bill or not (mixtape by reference)
  - anti_pattern: Copying the same PDF into repo-shows/ when characters/<slug>/media/ is the home
- **audience_exception:**
  - rule: TicketPR audience/ stays per-show under repo-shows/<show>/audience/ — MSPO journal is episodic
  - spec: [ticket-pr.yml](ticket-pr.yml#where_not)
### Description Scaffolding

- **one_line:** CARD + GLANCE together (~cheap) before README (~expensive). GLANCE owns nav/metadata;
CARD owns interface/ads. LLMs read both. README renders nav for humans.
- **llm_advice:** Read **CARD.yml and GLANCE.yml together** for a complete sniff — complementary halves.
Neither replaces the other. Only then open README, SHOW.yml, or subdirs.
- **activation_flow:** 1. Directory listing — filenames are K-lines.
2. GLANCE.yml — title, description, keywords, navigation (SSOT), read_order, see_also.
3. CARD.yml — iconic tab chip, room identity, methods, abilities, protocols (no nav lists).
4. README.md — human article; teaser mirrors GLANCE description; nav links at bottom.
5. Artifacts and nested dirs — when interested.
### Glance Ssot

- **role:** **Single source of truth for navigation and room metadata.** GLANCE is useful alone —
typically **smaller than CARD** — but does not list advertisements, simulation protocols,
or invokable interface details (that is CARD's job).
- **fields:**
  - title: Concise human title — list views, breadcrumbs
  - iconic: Tab label, dropdown item — emoji + ≤5 words (UI chips)
  - description: Short paragraph — decide relevance without README or CARD
  - keywords: Activation / search tokens
  - navigation: Explicit parent, up, siblings, children — even when implicit from paths
  - read_order: Suggested read sequence when diving deep
  - see_also: Categorized links — parent · siblings · children · across · deep · next · previous
- **omit:**
  - methods
  - abilities
  - advertisement blocks
  - simulation runbooks
  - compose_with protocols

### Card Interface

- **role:** **Interface layer only** — what you can *do* here. Tab/dropdown may read `GLANCE.iconic`
or CARD-local chip; do **not** duplicate GLANCE navigation or metadata lists.
- **fields:**
  - room: MOOLLM room identity (id, name, type, home)
  - methods: Invokable verbs with advertisement strings
  - abilities: Scored advertisement blocks — Sims-style activation
  - compose_with: Skill/character gear mesh
  - simulation_pointer: SIMULATION.yml when runtime exists
- **omit:**
  - see_also nav graphs
  - read_order
  - keywords
  - title
  - description paragraphs
- **glance_pointer:** glance: GLANCE.yml — CARD does not maintain nav

- **readme_human:**
  - rule: README mirrors GLANCE `description` as executive teaser up front. **Navigation section
at the bottom renders from GLANCE** — intentional human-facing duplication worth maintaining.
Sniff line at top: CARD · GLANCE · ROOM.
- **room_yml:**
  - rule: ROOM.yml optional compass (exits, contains). Prefer **GLANCE as nav SSOT** — ROOM may
mirror exits for MOOLLM room skill but avoid maintaining divergent graphs; link GLANCE.
### Upstream Moollm

- **note:** This split is an **experiment in WWSFF** ahead of formal MOOLLM `card` and `glance` skill
definitions. When it works here, **promote upstream** into moollm — do not permanently
override upstream skills inside repo-show; extend and propose patches instead.
- **targets:**
  - [moollm/skills/card](https://github.com/SimHacker/moollm/tree/main/skills/card)
  - [moollm/skills/glance](https://github.com/SimHacker/moollm/tree/main/skills/glance)
- **wwsff_skill:** [../skills/repo-show/](../skills/repo-show/)

- **moollm_refs:**
  - https://github.com/SimHacker/moollm/blob/main/skills/room/SKILL.md
  - https://github.com/SimHacker/moollm/blob/main/skills/advertisement/SKILL.md
- **spec_girder:** [character-colocation.yml](character-colocation.yml#cardify)


## How It Runs

- **announce:** Ahead of time (e.g. [Hacker News](https://news.ycombinator.com/)) — a pointer to THIS repo, not a wall of text
- **rtfr:** Read The Fucking Repo — follow along on your own rig (editor, browser, notebook, AI, or bare hands)
- **guest_intro:** Guest introduced as a Repo Man, Woman, or Anybody: **ALWAYS INTENSE!** ([Alex Cox](https://en.wikipedia.org/wiki/Alex_Cox) / [*Repo Man*](https://en.wikipedia.org/wiki/Repo_Man_(film)) homage — come on, let's go)
- **simulated_art_opening:**
  - spec: [simulated-art-opening.yml](simulated-art-opening.yml)
  - default: Optional pre-show — menagerie buys guest artwork for §; guest starts with huge worthless pile for Twitch
  - prototype: [characters/don-hopkins/jsonsters/art-opening-night.yml](../characters/don-hopkins/jsonsters/art-opening-night.yml)
  - template: [repo-shows/_TEMPLATE/simulated-opening.yml](../repo-shows/_TEMPLATE/simulated-opening.yml)
- **audience:**
  - Incarnate consensual characters ([portrayal-standards / representation ethics](../schemas/portrayal-standards.yml))
  - Ask questions as PRs, issues, and comments — plus live Twitch and YouTube chat
  - TicketPR — audience/ subdirs under the SHOW directory (not characters/); see [TicketPR](#ticket-pr)
  - [Don Philahue](../characters/don-philahue/) surfaces relevant questions live ([Phil Donahue](https://en.wikipedia.org/wiki/Phil_Donahue) homage audience-wrangler)
- **implement:** Design ideas → cauldron → skills + code — however YOUR rig builds (see [rig spectrum](#rig-spectrum))
- **clocks:**
  - before_async_PRs
  - before_TicketPRs
  - during_Twitch
  - after_harvest_PRs
- **during_twitch:**
  - brain_stream: [brain-stream.yml](brain-stream.yml)
  - note: Live bus — prompts, thinking, model shifts, GH doc links on overlay + throttled chat
  - drag_race: [Manual Transmission](manual-transmission.yml) + [Micropolis AI Drag Race](micropolis-ai-drag-race.yml) — [Slats](../characters/robots/slats/) judges; spend log ref
- **after_harvest_pr:**
  - post_run_forensics: [ai-offs.yml](ai-offs.yml#post_run_analysis)
  - note: [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) + [deep-snitch](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) on session artifacts before public harvest

## Participation Policy

- **one_line:** AI optional. Human, bot, or AI — all welcome. Bring any rig. No gatekeeping.
- **ticket_pr:** [ticket-pr.yml](ticket-pr.yml)
- **ai_optional:** Follow along with your own AI coding tools if you like, or none at all. Hand-craft earns extra respect; if you do use AI we'd love to hear how (see [AI rig feedback](#ai-rig-feedback)) — to learn, not to sell.
- **who_is_welcome:** Humans, bots, and AIs are all welcome to read along, ask questions, and contribute.
- **bots:** Self-aware HTTP agents: start at [FOR-BOTS.md](../FOR-BOTS.md) — play along, follow links, don't flatten the repo into training slop.
- **no_gatekeeping:** Participation is the perk, never knowledge-gated. Declare your category honestly; don't exclude anyone — see [declare_not_exclude](#declare-not-exclude).
- **conversation_first:** Most shows are conversations on a topic, not contests. The game-show formats ([Code That Spec](code-that-spec.yml), [Manual Transmission](manual-transmission.yml), [Micropolis AI Drag Race](micropolis-ai-drag-race.yml)) are optional fun, not the point.

## Ticket Pr

- **spec:** [ticket-pr.yml](ticket-pr.yml)
- **term:** TicketPR
- **etymology:** Pun on [Ticketmaster](https://en.wikipedia.org/wiki/Ticketmaster) — Master ⇒ PR (pull request): toxic gatekeeper → free collaborative GitHub workflow
- **one_line:** Free public audience ticket via PR under repo-shows/<show>/audience/<github-user>/ —
[Ticketmaster](https://en.wikipedia.org/wiki/Ticketmaster) reframed: Master becomes PR.
- **optional:** Not required to watch — but your audience/ folder is subscribe + memorialize: journal of Q&A, reactions, souvenirs (live or time-shifted)
- **show_repo:** A show repo (e.g. WillWrightShowForFood) owns a fan base; episodes are repo-shows/<slug>/ subdirs.
Independent shows spin off to their own repos. TicketPR characters migrate between episodes within a repo.
- **mspo:** Massively Single-Player Online — your timestamped layer on a shared artifact; others replay with your journal visible
- **where:** SHOW directory audience/ — NOT characters/ (guests have many shows; audience is per-episode)
- **placement:** See [repo-show-format.yml#placement_constitution](repo-show-format.yml#placement_constitution) and [character-colocation.yml](character-colocation.yml)
- **files:**
  - [questions.yml](../repo-shows/_TEMPLATE/audience/questions.yml)
  - [CHARACTER.yml](../repo-shows/_TEMPLATE/audience/CHARACTER.yml)
  - [CARD.yml](../repo-shows/_TEMPLATE/audience/CARD.yml)
  - [GLANCE.yml](../repo-shows/_TEMPLATE/audience/GLANCE.yml)
  - [SIMULATION.yml](../repo-shows/_TEMPLATE/audience/SIMULATION.yml)
  - [costume.yml](../repo-shows/_TEMPLATE/audience/costume.yml)
- **moollm:** Copy [_TEMPLATE/audience/](../repo-shows/_TEMPLATE/audience/) — learn character creation; participate in simulation protocols during/after show
### Ladder

- **low_friction:**
  - HN_comment
  - github_issue
  - issue_comment
- **high_signal:** TicketPR_merge

- **timing:** From ANNOUNCE onward — including invite-not-yet-accepted — seed interest before air
- **harvest:** Don Philahue pulls HN + issues + TicketPRs into show audience/ timeline
- **live_ritual:** Come On Down — the Question Is Right! ([The Price Is Right](https://en.wikipedia.org/wiki/The_Price_Is_Right) homage; optional costume)
- **donations:** Optional — recognition + call-on priority; never required for attendance
- **guest_merges:** Guest may review, reply, approve TicketPRs on GitHub
- **guest_primed:** Guest may plant virtual audience, costumes, running gags — disclosed in audience/; see [PLANTED-AUDIENCE.md](../repo-shows/_TEMPLATE/audience/PLANTED-AUDIENCE.md)
- **moderation:** Curators filter bad-faith; guest may welcome hecklers explicitly

## Sign Offs

- **note:** Rotate the closing line — warm, playful, a little retro.
### Rotating

- {"line": "Have a big fun!", "credit": "Mary Hoogeveen, Artisanal Weaver"}
- {"line": "Goodnight, until tomorrow.", "kinship": "[Thomas Cherryhomes](../characters/thomas-cherryhomes/)"}
- {"line": "Order before midnight tonight, or it will be tomorrow!", "homage": "1970s cheesy late-night TV commercial sign-off"}


## Closing Ceremony

- **name:** The [Ultimate Machine](../characters/robots/ultimate-machine/) switches off the stream
- **who:** [ultimate-machine](../characters/robots/ultimate-machine/)
- **recurring:** yes
- **what:** After the sign-off line, the Ultimate Machine performs its one function on the broadcast
itself: a hand emerges, flips the stream OFF, and withdraws. The purest possible ending —
the machine whose only purpose is to switch off, ending the show by switching IT off.
- **why_fitting:** Patron saint of the off switch closes the show. Player-in-the-middle: AI proposes, the OFF disposes.
- **line:** *a hand emerges, flips the stream OFF, and withdraws* — Goodnight.
- **optional:** Guest may say the sign-off; the Machine always gets the literal last move.

## Gong

- **name:** The [Ultimate Machine](../characters/robots/ultimate-machine/) as automated GONG
- **who:** [ultimate-machine](../characters/robots/ultimate-machine/)
- **what:** The show's automated gong — ends acts that have run too long. The off-switch applied
OUTWARD: gong(act) → switches the act off; then, true to form, gongs itself off first.
- **targets:**
  - Any segment that overstays its welcome ([Gong Show](https://en.wikipedia.org/wiki/The_Gong_Show) format)
  - Chatty characters stuck in a loop who will not stop talking
- **recurring_in_joke:**
  - name: Slats robopoetry feedback loop
  - who: [slats](../characters/robots/slats/)
  - what: [Slats](../characters/robots/slats/) (the [Stupid Fun Club](../characters/will-wright/sources/stupid-fun-club-one-minute-movies/) waiter brain) occasionally spins into an LLM-style AUDIO
FEEDBACK LOOP — responding to his own last utterance, then responding to THAT, drifting
into unintentional 'robopoetry' that escalates until it's beautiful nonsense. The Ultimate
Machine GONGS him off. Recurring bit; Don may let it run just long enough to get good.
  - vibe: Confused LLM doing speech-to-speech feedback; accidental poetry; merciful gong.
  - see: [../characters/robots/slats/CHARACTER.yml](../characters/robots/slats/CHARACTER.yml)

## Rig Spectrum

- **principle:** Play along with YOUR rig — or learn a new one. See who makes the coolest.
- **rig_schema:** Rigs are defined by extensible schemas — download, install, configure, use, replicate,
mash up. See [schemas/rig-schema.yml](../schemas/rig-schema.yml); instances in [rigs/](../rigs/) `*.rig.yml`; PR yours + [INDEX](../rigs/INDEX.yml) entry.
- **no_ai_required:** yes
### Hand Craft

- **respect:** Artisanal programmers — humans programming by hand without AI — earn extra respect here.
TextEdit to Emacs to VS Code and beyond; just no AI. We mean it; honesty appreciated.
- **also_honored:**
  - intentional_coders
  - conscientious_coders
- **history:** Don coined consciencious objectors at a meetup with [David Ungar](../characters/david-ungar/) and Kaleida colleagues
(ScriptX object-system era) — programmers who conscientiously object to opaque automation.
Proposed show: [david-ungar-self-moollm.yml](../repo-shows/david-ungar-self-moollm.yml) (Self × MOOLLM reimagination + rig culture).
- **bare_hands_welcome:** yes

- **rig_classes:**
  - artisanal: Hand-only human programming — maximum respect when declared honestly
  - intentional: Deliberate craft; positive term for thoughtful anti-vibe
  - conscientious: Show-your-work ethics; care and attribution
  - vibe: AI-forward flow-state — declare class; compete on taste and power
  - orchestrated: Full agent stack — tell us how (see [AI rig feedback](#ai-rig-feedback))
  - budget_bull_rider: Tight token budget; wrangles smaller/faster models through hallucinations and retries to a better solution — declare tier; show the ride
  - stick_shift_switcher: Multi-model routing — shift efficiently through the task like stick on a cliff road; proof in Cursor spend log ([stick-shift-protocol.yml](stick-shift-protocol.yml))
- **token_budget:**
  - declare: Model tier + monthly token budget — compare fair only within class
  - report: Token usage + spend + wall-clock — efficiency vs extravagance scoreboard
  - bull_ride: Skill like staying on a bull — thrash through bad outputs, recover, ship anyway; have fun
  - split_strategy: Premium model for planning/architecture; budget model (e.g. Composer 2.5 Fast) for knocking out designs — declare both
  - recognition: Budget-tier wranglers who beat premium-tier slop on taste get celebrated — document how
  - stick_shift: Model switching as stick shift on a winding ocean cliff — read the road, shift at the right
moment, arrive with taste and tokens to spare. Cursor spend log timestamps every gear change.
### Cost To Ship Scoreboard

- **axes:**
  - tokens
  - spend_dollars
  - wall_clock
  - solution_quality
  - integration
  - abstraction
- **joke_reframed:** Compare how efficiently or extravagantly you arrived — not just how good the solution was
- **artisanal_baseline:** Zero tokens — the efficiency floor; taste must carry
- **rolling_coal_ceiling:** Rolling coal with [Gastown](https://github.com/SimHacker/moollm/blob/main/designs/gastown/GASTOWN-VS-MOOLLM-ANALYSIS.md) — gloriously extravagant token-wasting for the spectacle; the ceiling opposite the artisanal floor. Declare it, own the flex ;)

### Ai Rig Feedback

- **invitation:** If you do use AI — we are super interested. Not to sell you anything: to learn and document
real setups so the network can breed better technique. Please tell us.
- **tell_us:**
  - Tools and IDEs (Cursor, Claude Code, Copilot, custom, …)
  - Models — which, when, why (declare your tier AND token budget)
  - Budget bull ride — retries, hallucination recovery, how you wrangled cheap/fast models
  - Stick shift — model-switch timeline; which model when; smooth vs grinding gears (Cursor spend log)
  - How you use it — prompts, agents, rules, hooks, workflows
  - MCP servers — which, wired how
  - Skills — [Anthropic Agent Skills](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills), [MOOLLM skills](https://github.com/SimHacker/moollm/tree/main/skills), your own CARD/SKILL.md
  - Repos — what's in the workspace, what you compose with
  - MOOLLM — do you include it? How wired? (see [kernel/moollm-plugin.yml](../kernel/moollm-plugin.yml))
  - How it actually works day to day — not the marketing page
  - Contexts — show jam, harvest, homeplay, teaching, porting, …
- **submit:** Open an issue or PR — tag rig-feedback, or drop a yaml CARD in your branch
(process/rig-reports/ is the landing zone when we add it). Screencasts welcome.
Real setups beat polished answers.

### Levels

- {"name": "bare_hands", "tools": ["markdown", "yaml", "git cli", "browser"], "vibe": "Man against the machine — pure craft, maximum taste"}
- {"name": "classic_dev", "tools": ["editor", "compiler", "debugger", "terminal"]}
- {"name": "assisted", "tools": ["copilot", "linters", "formatters"]}
- {"name": "orchestrated", "tools": ["Cursor", "MOOLLM", "moollm skills", "multi-model routing"]}

- **competitions:**
  - Taste — who ships the most elegant solution? (within declared class + model tier)
  - Power — who implements the wildest idea in the time box?
  - Budget bull ride — tight tokens, small model, better output; show hallucinations and retries
  - Stick shift — efficient model switching through the task; Cursor spend log + [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) proof
  - Code That Spec — bid tokens/time; audience chants CODE THAT SPEC; rig costumes; see [code-that-spec.yml](code-that-spec.yml)
  - Manual Transmission — smallest model / fewest tokens to code the spec; same spec CARD; Slats + spreadsheet judge; see [manual-transmission.yml](manual-transmission.yml)
  - Stiletto Sprint — Drag Queen Olympics flair under constraint; shortest honest bid that ships
  - Man vs machine — artisanal vs vibe vs orchestrated vs budget-tier (declare; don't exclude — it's a game)
  - Dance-off — show your workflow live; audience votes with thumbs and PRs
- **declare_not_exclude:** Don't ban people from the game — declare category and compete fair. Sports figured this
out with weight classes; rig culture should too. Misdeclare and the audience is the ref.
- **per_layer:** Automation level AND model tier AND tool choice at each layer — editor, build, test, deploy, doc — all fair game to declare and compare

## Play Along

- **your_rig:** Bring what you have. Fork the repo. Branch. Homeplay on your schedule.
- **hand_without_ai:** Extra respect for honest hand programming — declare human-only, show your work.
- **ai_users_please_share:** Using AI? Tell us tools, models, MCP, skills, repos, moollm wiring, contexts — see [AI rig feedback](#ai-rig-feedback)
- **learn_new_rig:** RTFR to study how others work — then try their stack on your branch.
- **coolest_wins:** Not single metric — taste, power, clarity, humor, constructionist generosity.
- **document:** Everybody documents techniques — README, CARD, SKILL, screencast, yaml backbone.
- **discuss:** Issues = HN threads. PRs = timeline merges. Show your work.
- **breed:** Combine technique DNA — merge PRs, nest organelles, scoop skills from [cauldron](https://github.com/SimHacker/moollm/tree/main/skills/cauldron).
- **integrate_organism:** Merge winning solutions back into the evolving organism. Abstract reusable parts into
[skills/](../skills/) (protocols) and [packages/](../packages/) (@wwsff/* libs) so other organisms can use them.
- **report_cost_to_ship:** Tokens + spend + time in rig report — judge efficiency AND taste

## Breeding And Nesting

- **horizontal_gene_transfer:** Merge technique DNA from forks and PRs — git is the petri dish
- **serial_endosymbiosis:** Characters and shows accrete organelles — each game/world keeps its own DNA in parallel
- **powers_of_ten:** [Powers of Ten](https://en.wikipedia.org/wiki/Powers_of_Ten) nesting — home in city in world in galaxy in universe in PC in home …
Nested membranes — branches within branches — same shape, evolving subtrees
- **git_as_mmorpg:**
  - branches: parallel universes / parallel rigs
  - prs: timeline merges / DNA exchange
  - issues: quests and pub debates
  - chat_branches: Parallel model trajectories — see [model-branching.yml](model-branching.yml)
  - see: [GitHub-as-MMORPG](https://github.com/SimHacker/moollm/blob/main/skills/github/SKILL.md) + [character-endosymbiosis](character-endosymbiosis.yml)

## Directors Cuts

- **one_line:** The show is a living git repo: it accretes reactions and re-releases as ever-longer Director's Cuts.
- **thesis:** Episodes are not shipped-and-frozen. Like a repo that keeps merging branches and tagging
releases, a show keeps SPLICING IN new material — reactions, corrections, and answers from
the real people it discusses (or talks with) — and cutting a new, longer release each time.
The diff between releases IS the drama (same shape as the riff loop, at production scale).
- **release_model:**
  - branch: A tangent / segment / parallel take is a branch — a parallel show universe.
  - merge: A guest's reaction spliced back in is a merge — new canon, longer cut.
  - tag: Each Director's Cut is a tagged release. Jump in anywhere; returning viewers find fresh material spliced all over since last time.
  - fork: Shows fork into sub-shows; sub-shows merge with other shows; DNA recombines (see [breeding and nesting](#breeding-and-nesting)).
  - literal: Not a metaphor: the shows ARE git repos, so branch/merge/tag/fork are the actual mechanism, not an analogy.
### Splice In Reactions

- **pattern:** 1) Discuss or show a clip about a person.  2) Invite them to react, explain, correct, expand.
3) Splice their response into the timeline where it belongs.  4) Re-release — longer and richer.
- **example_nina:**
  - what: Discuss Nina Hagen's 1979 Club-2 segment with Brian; show the clip; invite Nina to react and
re-state her own framing (in interview she has said she didn't see what the big deal was — it
was educational). Splice her reaction back into the show → a longer, more shareable new cut.
  - caveat: Nina's 'didn't see the big deal' interview is Don's recollection — SOURCE it before quoting on air.
  - see: [../characters/nina-hagen/ideas.md](../characters/nina-hagen/ideas.md)

### Recombination

- **spore_mating:** Will Wright's Spore procedural-mating / procreation demo (Long Now 'Playing with Time', 2006)
is the north-star bit for show-DNA splicing: two shows or characters breed a hybrid episode.
TOP of the do-list.
see: "[Long Now Playing with Time](../characters/will-wright/sources/2006-06-26-long-now-playing-with-time-eno-wright/)"
- **breaks_up_into:**
  - sub_shows
  - short_form_teasers
  - viral_memes
- **combines_with:** Other shows — mix, reuse, splice; git is the petri dish (see [breeding and nesting](#breeding-and-nesting)).

- **iteration_model:**
  - new_cuts_not_rewrites: Publish NEW numbered cuts as FRESH uploads — "Director's Cut III" — rather than rewriting an old
video in place. Fresh uploads get algorithmic discovery (the teaser/fork feed carries the rest);
silently editing an old upload does not. Old cuts stay up as history.
  - latest_is_self_sufficient: Each new cut is COMPLETE on its own — if you're just joining, watch only the LATEST cut and you
lose nothing. Returning viewers re-watch for the diff; newcomers never have to chase prior cuts.
  - grows_like_a_production_system: Its very nature is to GROW like a **[Wolfram](https://en.wikipedia.org/wiki/Stephen_Wolfram)-style [production system](https://en.wikipedia.org/wiki/Production_system_(computer_science))**: async, time-shifted back-and-forth
between guests, each reaction a rule firing that accretes another layer. Rule-based accretion, not
manual rewrite — which is what keeps per-release cost from compounding.
  - addresses_risks: Directly answers the load-bearing risks: fresh numbered uploads beat the discovery-favors-new-uploads
problem; chaptered, self-sufficient cuts beat the long-form attention problem; async accretion keeps
per-release editing cost low. (The slowest, least-controllable input remains getting real subjects to
react — that's the viral multiplier worth waiting for.)
### Honest Clickbait

- **principle:** A teaser title may BAIT hard — but it must DELIVER. Earn the click, then pay it off. No bait-and-switch.
- **proof:** The lineage clip: Bowie's SNL-'79 'Boys Keep Swinging' video-puppet finale — the puppet 'whips it
out' and Bowie grins at getting it past the censors. A shameless title AND a real payoff; it
travelled BECAUSE it delivered on the promise.
- **reusable_bit:** The whip-it-out video puppet is a REUSABLE short-form teaser across the roster — each guest drives
their own crude composited body and 'whips out' something that pays off the title. G-rated homage;
the JOKE is the censorship, not the anatomy.
- **delivers_what:**
  - will_wright: Whips out a Spore 'Sporn' creature — procedural anatomy as the gag (opt-in, his call).
  - don_hopkins: Consent-forward self-satire — hands out a puppet of himself, penis and all ([puppet-me-consent.yml](../characters/don-hopkins/portrayal/puppet-me-consent.yml)).
  - donald_trump: Political caricature — the trump_mushroom preset (tiny mushroom → spinning Mario mushroom); satire of a public official, not a private person.
- **no_presumption_of_guests:** We do NOT presume any guest performs the bit. It's opt-in for whoever's delighted to. For Brian
Eno specifically: we simply talk with him about the Bowie/Eno history and show him the tools +
the clearly-labeled ADULT section — nothing clickbaity, nothing silly presumed of him, his call
entirely (see [bowie-snl-1979.md](../characters/brian-eno/bowie-snl-1979.md)).
- **platform_safe:** Short-form for TikTok/Facebook must survive STRICTER moderation than YouTube — even cartoon/puppet
anatomy gets flagged, a literal puppet-erection clip gets removed/shadowbanned, and strikes kill the
account. Note the asymmetry: the original Bowie clip was pulled on permissive YouTube for COPYRIGHT;
the reusable version hits a CONTENT wall on stricter platforms. **The fix: pixelate by default.** The
uploadable cut ships **self-censored** (Sims-1-style pixelization mosaic / censor-bar); uncensoring
is a **local, opt-in "cheat code," never the default upload** — so the bit IS the unnecessary
censorship, and it survives. Never reproduce rights-locked masters; reference + RE-CREATE.
See [faceball-construction-set.yml#modifiers](../apps/performance-space/faceball-construction-set.yml#modifiers) (sims1_pixelization).
- **funnel:** Short-form teaser → the long-form Director's Cut. The clip is the door; the show is the room.
- **see:**
  - [bowie-snl-1979.md](../characters/brian-eno/bowie-snl-1979.md)
  - [puppet-me-consent.yml](../characters/don-hopkins/portrayal/puppet-me-consent.yml)
  - [faceball-construction-set.yml](../apps/performance-space/faceball-construction-set.yml)
  - [vice-not-ice-puppet.yml](../repo-shows/ideas/gags/vice-not-ice-puppet.yml)
  - [unnecessary-censorship.yml](../repo-shows/ideas/traditions/unnecessary-censorship.yml)

- **respect_the_viewer:** Growth adds MORE, BETTER, RELEVANT content — not ad breaks wedged into gaps. Returning viewers
re-watch because the artifact genuinely improved since last time, and can jump into the middle
without penalty. The compounding-attention / monetization angle is planning, not public copy —
it lives in the private strategy folder, not here.
- **ties:**
  - [breeding and nesting](#breeding-and-nesting)
  - [the-riff-loop.yml](../repo-shows/ideas/themes/the-riff-loop.md)
  - [showmaker-network.yml](showmaker-network.yml)

## ShowMaker Network

- **what:** A graph and publication network of show objects — not a flat playlist
- **your_show:** Run your own Repo Show on YOUR branch or YOUR repo
- **link_in:** Open a PR — we add show CARDs + edges into this network from your contribution
- **we_add:** Show objects + links from merged PRs ([yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz) indexes stay navigable)
- **automation_goal:** Tooling to easily author show CARDs, pitch videos, and link PRs ([hosted-content](https://github.com/SimHacker/MicropolisCore/blob/main/apps/micropolis/website/pages/about/hosted-content/README.md) pattern)
- **see:** [showmaker-network.yml](showmaker-network.yml)

## Cauldron Scoop

- **insight:** You can scoop many types of things OUT of a cauldron — not only LADLE.
MELT/STIR grows the soup; SCOOP selects what leaves the pot and in what form.
### Operations

- **harvest:**
  - what: Lift finished artifacts — skills, playbooks, design docs, sub-cauldrons
  - play_lift_learn: LIFT
- **filter:**
  - what: Remove redundancy — reduce soup toward concentrate
- **structure:**
  - what: Indexes, CARD/GLANCE pyramids, cross-links
- **maintain:**
  - what: Invalidate/recalculate when code or facts drift
- **summarize:**
  - what: Pyramid extractions — GLANCE → CARD → SKILL → README
- **remove:**
  - what: Archive spent ingredients with context

- **outputs:**
  - MOOLLM skills
  - design documents and playbooks
  - sub-cauldrons
  - working code (any rig — manual or automated)

## Play Lift Learn

- **play:** Live jam + homeplay + RTFR + rig competitions + ShowMaker branches
- **lift:** Cauldron SCOOP — skills and technique DNA out of the melt
- **learn:** Fork, breed, nest — constructionist payoff across the network

## Related

| Link | Why |
|------|-----|
| [`character-colocation.yml`](character-colocation.yml) | Placement constitution girder — scopes, rooms, topologies, cardify |
| [`ticket-pr.yml`](ticket-pr.yml) | TicketPR — [Ticketmaster](https://en.wikipedia.org/wiki/Ticketmaster) reframed: Master ⇒ PR |
| [`cross-links.yml`](cross-links.yml) | Narrative web — trails between all rooms |
| [`vision-and-ambition.yml`](vision-and-ambition.yml) | Long arc girder |
| [`VISION.md`](VISION.md) | Navigation layer — link-rich human view |
| [`rig-feedback.yml`](rig-feedback.yml) | Declare your real AI stack |
| [`showmaker-network.yml`](showmaker-network.yml) | Shows breed shows |
| [`manual-transmission.yml`](manual-transmission.yml) | Smallest model that works |
| [`brain-stream.yml`](brain-stream.yml) | Live thinking overlay |
| [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) | Flagship game-show format |
| [`retrocomputing-drive.yml`](challenges/retrocomputing-drive.yml) | Retro AI drag race family |
| [`README.md`](../repo-shows/will-wright-premiere/README.md) | Flagship show pitch |
| [`REPO-SHOWS.yml`](../repo-shows/REPO-SHOWS.yml) | SHOW inheritance |
| [`SKILL.md`](../skills/repo-show/SKILL.md) | Orchestrator protocol |
| [`INDEX.yml`](../skills/INDEX.yml) | Harvest + upstream moollm skills |
| [`INDEX.yml`](../characters/INDEX.yml) | Guests — portrayal-standards first |
| [`INDEX.yml`](../rigs/INDEX.yml) | Rig personas |
| [`portrayal-standards.yml`](../schemas/portrayal-standards.yml) | Ethics contract |
| [`cauldron`](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) | HARVEST delegate |
| [`play-learn-lift`](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) | PLAY → LEARN → LIFT |

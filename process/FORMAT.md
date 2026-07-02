<!-- GENERATED from `process/repo-show-format.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:4d5280f962f0a6cb -->

# Repo Show format

> **Girder:** [`repo-show-format.yml`](repo-show-format.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Canonical Prose

A Repo Show is announced ahead of time (for example, as a pointer on Hacker News), and the
show IS this repository. Beforehand you RTFR (read the repo); during the show you follow
along on whatever rig you bring — vim, Emacs, Cursor, a Jupyter notebook, or pencil and paper.
AI is optional and everyone is welcome: bring your own AI coding tools or none at all, and
humans, bots, and AIs all take part, with no gatekeeping (see participation_policy).
At heart a Repo Show is a conversation, not a contest. The guest — the Repo Man, Woman, or
Anybody — is the topic, starting from their own work. The audience joins as consensual
characters who ask questions as PRs, issues, and comments (plus live Twitch and YouTube chat),
and **TicketPRs** — personal audience folders under each show's `audience/` directory (see
ticket_pr). Don Philahue surfaces the good ones live. Ideas are
melted in the cauldron and harvested into reusable skills and code, bred back into the network
via git. Some episodes can instead be playful game shows (Code That Spec, Manual Transmission,
the Micropolis AI Drag Race) — optional fun we can do, not the point.

## Meta

| Key | Value |
|-----|-------|
| **id** | repo-show-format |
| **canonical** | yes |
| **play_lift_learn** | https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift |
| **cauldron** | https://github.com/SimHacker/moollm/tree/main/skills/cauldron |
| **showmaker_network** | showmaker-network.yml |

## Placement Constitution

- **spec:** character-colocation.yml
- **one_line:** Put each artifact where its scope makes it most reusable. Characters own person stuff.
Shows reference — they do not hoard guest treasure. Code graduates to packages/. Rooms
are navigable context maps; shows are rooms too. CARD + ROOM + SIMULATION cardify interfaces.
- **principle:** Colocate by **scope**, not by "where we happened to prep the episode." A guest on three
shows still has one home. A library used by many shows lives in packages/ or a shared room.
MOOLLM is flexible about directory layout — lean into what filesystems and LLMs are great at:
paths, names, links, rooms, cards. Postel's law: be liberal in what you accept, conservative
in what you emit (well-formed yaml, stable links, one canonical copy).
### Scopes

- **characters:**
  - path: characters/<slug>/
  - owns: Person portrayal + their artifacts (media/, ../../characters/will-wright/sources/, correspondence)
  - rule: One person, one directory — pleasant surprise when they open it
  - show_relation: Shows list one or more guests; episode yaml LINKS to character paths
- **repo_shows:**
  - path: repo-shows/<episode-slug>/
  - owns: Episode manifest, segments, venue/, audience/ (TicketPR), episode-only glue
  - rule: Refer to ../../characters/<slug>/ — do not duplicate person PDFs, catalogs, galleries
  - is_also_a_room: A show directory IS a MOOLLM room. Drop SHOW.yml, CARD.yml, GLANCE.yml, optional ROOM.yml,
optional SIMULATION.yml at the show root — same cardify pattern as characters and audience.
Show-rooms live in repo-shows/; they need not live under a top-level rooms/ collector.
- **packages:**
  - path: packages/
  - owns: Public reusable code (@wwsff/*) factored from homefun harvests
  - rule: Prose and person media stay in characters/; generalized libraries land here
- **shared_rooms:**
  - what: Directories that are activation context for many shows — not owned by one episode.
process/, skills/, schemas/, catalogs/, venue graphs.
  - navigation: Shows and characters link through them; frequent destinations, not duplicates
  - moollm: https://github.com/SimHacker/moollm/tree/main/skills/room/ — ROOM.yml, exits, regions

### Shows As Rooms

- **cardify:** GLANCE.yml — title, description, keywords, navigation SSOT, read_order, see_also (smaller, no ads).
CARD.yml — interface: methods, abilities, protocols (read GLANCE + CARD together).
ROOM.yml optional compass; SIMULATION.yml runtime. README renders GLANCE nav for humans.
### Typical Files

- **required:**
  - SHOW.yml
- **recommended:**
  - README.md
  - CARD.yml
  - GLANCE.yml
- **optional:**
  - ROOM.yml
  - SIMULATION.yml
  - SEGMENTS.yml
  - venue/
  - audience/

- **template:** repo-shows/_TEMPLATE/audience/
- **show_template:** repo-shows/_TEMPLATE/
- **example:** repo-shows/will-wright/venue/ROOM.yml

### Topologies

- **note:** Show networks are not flat lists. Arrange episodes as maps, sequences, version stacks,
grids — whatever helps humans and agents navigate. MOOLLM room skill supports pie-menu
compass exits, grid quadrants, sparse cells, vertical stacking of versions.
### Patterns

- **sequence:** episodes.yml, showmaker-network edges, forebear → flagship → topical
- **map:** VENUE.yml room graph; cardinal exits between show-rooms
- **grid:** catalog indexes; ne/nw/sw/se quadrants per room/TOPOLOGY.yml
- **vertical_stack:** ../../characters/will-wright/sources/<date-slug>/ — time strata; compare eras by scrolling up/down

- **moollm_refs:**
  - https://github.com/SimHacker/moollm/tree/main/skills/room/SKILL.md
  - https://github.com/SimHacker/moollm/tree/main/skills/room/TOPOLOGY.yml

- **cross_reference:**
  - allowed: Any show may link any character's media — guest on bill or not (mixtape by reference)
  - anti_pattern: Copying the same PDF into repo-shows/ when characters/<slug>/media/ is the home
- **audience_exception:**
  - rule: TicketPR audience/ stays per-show under repo-shows/<show>/audience/ — MSPO journal is episodic
  - spec: ticket-pr.yml#where_not
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
  - SimHacker/moollm/skills/card
  - SimHacker/moollm/skills/glance
- **wwsff_skill:** ../skills/repo-show/

- **moollm_refs:**
  - https://github.com/SimHacker/moollm/skills/room/SKILL.md
  - https://github.com/SimHacker/moollm/skills/advertisement/SKILL.md
- **spec_girder:** character-colocation.yml#cardify


## How It Runs

- **announce:** Ahead of time (e.g. Hacker News) — a pointer to THIS repo, not a wall of text
- **rtfr:** Read The Fucking Repo — follow along on your own rig (editor, browser, notebook, AI, or bare hands)
- **guest_intro:** Guest introduced as a Repo Man, Woman, or Anybody (Alex Cox homage — come on, let's go)
- **audience:**
  - Incarnate consensual characters (representation-ethics)
  - Ask questions as PRs, issues, and comments — plus live Twitch and YouTube chat
  - TicketPR — audience/ subdirs under the SHOW directory (not characters/); see ticket_pr
  - Don Philahue surfaces relevant questions live (Phil-Donahue homage audience-wrangler)
- **implement:** Design ideas → cauldron → skills + code — however YOUR rig builds (see rig_spectrum)
- **clocks:**
  - before_async_PRs
  - before_TicketPRs
  - during_Twitch
  - after_harvest_PRs
- **during_twitch:**
  - brain_stream: brain-stream.yml
  - note: Live bus — prompts, thinking, model shifts, GH doc links on overlay + throttled chat
  - drag_race: Manual Transmission + Micropolis AI Drag Race — Slats judges; spend log ref
- **after_harvest_pr:**
  - post_run_forensics: ai-offs.yml#post_run_analysis
  - note: cursor-mirror + deep-snitch on session artifacts before public harvest

## Participation Policy

- **one_line:** AI optional. Human, bot, or AI — all welcome. Bring any rig. No gatekeeping.
- **ticket_pr:** ticket-pr.yml
- **ai_optional:** Follow along with your own AI coding tools if you like, or none at all. Hand-craft earns extra respect; if you do use AI we'd love to hear how (see rig_spectrum.ai_rig_feedback) — to learn, not to sell.
- **who_is_welcome:** Humans, bots, and AIs are all welcome to read along, ask questions, and contribute.
- **bots:** Self-aware HTTP agents: start at ../FOR-BOTS.md — play along, follow links, don't flatten the repo into training slop.
- **no_gatekeeping:** Participation is the perk, never knowledge-gated. Declare your category honestly; don't exclude anyone — see declare_not_exclude.
- **conversation_first:** Most shows are conversations on a topic, not contests. The game-show formats (Code That Spec, Manual Transmission, Micropolis AI Drag Race) are optional fun, not the point.

## Ticket Pr

- **spec:** ticket-pr.yml
- **term:** TicketPR
- **etymology:** Pun on TicketMaster — Master ⇒ PR (pull request): toxic gatekeeper → free collaborative GitHub workflow
- **one_line:** Free public audience ticket via PR under repo-shows/<show>/audience/<github-user>/ —
TicketMaster reframed: Master becomes PR.
- **optional:** Not required to watch — but your audience/ folder is subscribe + memorialize: journal of Q&A, reactions, souvenirs (live or time-shifted)
- **show_repo:** A show repo (e.g. WillWrightShowForFood) owns a fan base; episodes are repo-shows/<slug>/ subdirs.
Independent shows spin off to their own repos. TicketPR characters migrate between episodes within a repo.
- **mspo:** Massively Single-Player Online — your timestamped layer on a shared artifact; others replay with your journal visible
- **where:** SHOW directory audience/ — NOT characters/ (guests have many shows; audience is per-episode)
- **placement:** See repo-show-format.yml#placement_constitution and character-colocation.yml
- **files:**
  - questions.yml
  - CHARACTER.yml
  - CARD.yml
  - GLANCE.yml
  - SIMULATION.yml
  - costume.yml
- **moollm:** Copy _TEMPLATE/audience/ — learn character creation; participate in simulation protocols during/after show
### Ladder

- **low_friction:**
  - HN_comment
  - github_issue
  - issue_comment
- **high_signal:** TicketPR_merge

- **timing:** From ANNOUNCE onward — including invite-not-yet-accepted — seed interest before air
- **harvest:** Don Philahue pulls HN + issues + TicketPRs into show audience/ timeline
- **live_ritual:** Come On Down — the Question Is Right! (Price Is Right homage; optional costume)
- **donations:** Optional — recognition + call-on priority; never required for attendance
- **guest_merges:** Guest may review, reply, approve TicketPRs on GitHub
- **guest_primed:** Guest may plant virtual audience, costumes, running gags — disclosed in audience/; see PLANTED-AUDIENCE.md
- **moderation:** Curators filter bad-faith; guest may welcome hecklers explicitly

## Sign Offs

- **note:** Rotate the closing line — warm, playful, a little retro.
### Rotating

- {"line": "Have a big fun!", "credit": "Mary Hoogeveen, Artisanal Weaver"}
- {"line": "Goodnight, until tomorrow.", "kinship": "Thomas Cherryhomes"}
- {"line": "Order before midnight tonight, or it will be tomorrow!", "homage": "1970s cheesy late-night TV commercial sign-off"}


## Closing Ceremony

- **name:** The Ultimate Machine switches off the stream
- **who:** ultimate-machine
- **recurring:** yes
- **what:** After the sign-off line, the Ultimate Machine performs its one function on the broadcast
itself: a hand emerges, flips the stream OFF, and withdraws. The purest possible ending —
the machine whose only purpose is to switch off, ending the show by switching IT off.
- **why_fitting:** Patron saint of the off switch closes the show. Player-in-the-middle: AI proposes, the OFF disposes.
- **line:** *a hand emerges, flips the stream OFF, and withdraws* — Goodnight.
- **optional:** Guest may say the sign-off; the Machine always gets the literal last move.

## Gong

- **name:** The Ultimate Machine as automated GONG
- **who:** ultimate-machine
- **what:** The show's automated gong — ends acts that have run too long. The off-switch applied
OUTWARD: gong(act) → switches the act off; then, true to form, gongs itself off first.
- **targets:**
  - Any segment that overstays its welcome (gong-show format)
  - Chatty characters stuck in a loop who will not stop talking
- **recurring_in_joke:**
  - name: Slats robopoetry feedback loop
  - who: slats
  - what: Slats (the Stupid Fun Club waiter brain) occasionally spins into an LLM-style AUDIO
FEEDBACK LOOP — responding to his own last utterance, then responding to THAT, drifting
into unintentional 'robopoetry' that escalates until it's beautiful nonsense. The Ultimate
Machine GONGS him off. Recurring bit; Don may let it run just long enough to get good.
  - vibe: Confused LLM doing speech-to-speech feedback; accidental poetry; merciful gong.
  - see: ../characters/slats/CHARACTER.yml

## Rig Spectrum

- **principle:** Play along with YOUR rig — or learn a new one. See who makes the coolest.
- **rig_schema:** Rigs are defined by extensible schemas — download, install, configure, use, replicate,
mash up. See schemas/rig-schema.yml; instances in rigs/*.rig.yml; PR yours + INDEX entry.
- **no_ai_required:** yes
### Hand Craft

- **respect:** Artisanal programmers — humans programming by hand without AI — earn extra respect here.
TextEdit to Emacs to VS Code and beyond; just no AI. We mean it; honesty appreciated.
- **also_honored:**
  - intentional_coders
  - conscientious_coders
- **history:** Don coined consciencious objectors at a meetup with David Ungar and Kaleida colleagues
(ScriptX object-system era) — programmers who conscientiously object to opaque automation.
Proposed show: david-ungar-self-moollm.yml (Self × MOOLLM reimagination + rig culture).
- **bare_hands_welcome:** yes

- **rig_classes:**
  - artisanal: Hand-only human programming — maximum respect when declared honestly
  - intentional: Deliberate craft; positive term for thoughtful anti-vibe
  - conscientious: Show-your-work ethics; care and attribution
  - vibe: AI-forward flow-state — declare class; compete on taste and power
  - orchestrated: Full agent stack — tell us how (see ai_rig_feedback)
  - budget_bull_rider: Tight token budget; wrangles smaller/faster models through hallucinations and retries to a better solution — declare tier; show the ride
  - stick_shift_switcher: Multi-model routing — shift efficiently through the task like stick on a cliff road; proof in Cursor spend log
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
- **rolling_coal_ceiling:** Rolling coal with Gastown — gloriously extravagant token-wasting for the spectacle; the ceiling opposite the artisanal floor. Declare it, own the flex ;)

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
  - Skills — Anthropic Agent Skills, MOOLLM skills, your own CARD/SKILL.md
  - Repos — what's in the workspace, what you compose with
  - MOOLLM — do you include it? How wired? (see kernel/moollm-plugin.yml)
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
  - Stick shift — efficient model switching through the task; Cursor spend log + cursor-mirror proof
  - Code That Spec — bid tokens/time; audience chants CODE THAT SPEC; rig costumes; see code-that-spec.yml
  - Manual Transmission — smallest model / fewest tokens to code the spec; same spec CARD; Slats + spreadsheet judge; see manual-transmission.yml
  - Stiletto Sprint — Drag Queen Olympics flair under constraint; shortest honest bid that ships
  - Man vs machine — artisanal vs vibe vs orchestrated vs budget-tier (declare; don't exclude — it's a game)
  - Dance-off — show your workflow live; audience votes with thumbs and PRs
- **declare_not_exclude:** Don't ban people from the game — declare category and compete fair. Sports figured this
out with weight classes; rig culture should too. Misdeclare and the audience is the ref.
- **per_layer:** Automation level AND model tier AND tool choice at each layer — editor, build, test, deploy, doc — all fair game to declare and compare

## Play Along

- **your_rig:** Bring what you have. Fork the repo. Branch. Homeplay on your schedule.
- **hand_without_ai:** Extra respect for honest hand programming — declare human-only, show your work.
- **ai_users_please_share:** Using AI? Tell us tools, models, MCP, skills, repos, moollm wiring, contexts — see rig_spectrum.ai_rig_feedback
- **learn_new_rig:** RTFR to study how others work — then try their stack on your branch.
- **coolest_wins:** Not single metric — taste, power, clarity, humor, constructionist generosity.
- **document:** Everybody documents techniques — README, CARD, SKILL, screencast, yaml backbone.
- **discuss:** Issues = HN threads. PRs = timeline merges. Show your work.
- **breed:** Combine technique DNA — merge PRs, nest organelles, scoop skills from cauldron.
- **integrate_organism:** Merge winning solutions back into the evolving organism. Abstract reusable parts into
skills/ (protocols) and packages/ (@wwsff/* libs) so other organisms can use them.
- **report_cost_to_ship:** Tokens + spend + time in rig report — judge efficiency AND taste

## Breeding And Nesting

- **horizontal_gene_transfer:** Merge technique DNA from forks and PRs — git is the petri dish
- **serial_endosymbiosis:** Characters and shows accrete organelles — each game/world keeps its own DNA in parallel
- **powers_of_ten:** home in city in world in galaxy in universe in PC in home …
Nested membranes — branches within branches — same shape, evolving subtrees
- **git_as_mmorpg:**
  - branches: parallel universes / parallel rigs
  - prs: timeline merges / DNA exchange
  - issues: quests and pub debates
  - chat_branches: Parallel model trajectories — see model-branching.yml
  - see: moollm GitHub-as-MMORPG + character-endosymbiosis organelle model

## ShowMaker Network

- **what:** A graph and publication network of show objects — not a flat playlist
- **your_show:** Run your own Repo Show on YOUR branch or YOUR repo
- **link_in:** Open a PR — we add show CARDs + edges into this network from your contribution
- **we_add:** Show objects + links from merged PRs (yaml-jazz indexes stay navigable)
- **automation_goal:** Tooling to easily author show CARDs, pitch videos, and link PRs (hosted-content-cards pattern)
- **see:** showmaker-network.yml

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
| [`ticket-pr.yml`](ticket-pr.yml) | TicketPR — TicketMaster reframed: Master ⇒ PR |
| [`cross-links.yml`](cross-links.yml) | Narrative web — trails between all rooms |
| [`vision-and-ambition.yml`](vision-and-ambition.yml) | Long arc girder |
| [`VISION.md`](VISION.md) | Generated markup |
| [`rig-feedback.yml`](rig-feedback.yml) | Declare your real AI stack |
| [`showmaker-network.yml`](showmaker-network.yml) | Shows breed shows |
| [`manual-transmission.yml`](manual-transmission.yml) | Smallest model that works |
| [`brain-stream.yml`](brain-stream.yml) | Live thinking overlay |
| [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) | Flagship game-show format |
| [`retrocomputing-drive.yml`](challenges/retrocomputing-drive.yml) | Retro AI drag race family |
| [`README.md`](../repo-shows/will-wright/README.md) | Flagship show pitch |
| [`REPO-SHOWS.yml`](../repo-shows/REPO-SHOWS.yml) | SHOW inheritance |
| [`SKILL.md`](../skills/repo-show/SKILL.md) | Orchestrator protocol |
| [`INDEX.yml`](../skills/INDEX.yml) | Harvest + upstream moollm skills |
| [`INDEX.yml`](../characters/INDEX.yml) | Guests — portrayal-standards first |
| [`INDEX.yml`](../rigs/INDEX.yml) | Rig personas |
| [`portrayal-standards.yml`](../schemas/portrayal-standards.yml) | Ethics contract |
| [`cauldron`](https://github.com/SimHacker/moollm/skills/cauldron) | HARVEST delegate |
| [`play-learn-lift`](https://github.com/SimHacker/moollm/skills/play-learn-lift) | PLAY → LEARN → LIFT |

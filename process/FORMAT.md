<!-- GENERATED from `process/repo-show-format.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:995ccfe4f6be628a -->

# Repo Show format

> **Girder:** [`repo-show-format.yml`](repo-show-format.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Canonical Prose

Announced ahead of time (e.g. to Hacker News) as a pointer to this repo — people RTFR
(read the repo) and follow along live on whatever rig they bring: vim and a Makefile,
Cursor and MOOLLM, or pencil and paper. You do not need AI tools. Perfectly delightful
man-against-the-machine taste and power competitions are encouraged — dance-off optional.
The guest is introduced as a Repo Man. The audience incarnates consensual characters and
submits questions as PRs; Don Philahue surfaces the relevant ones live. Design ideas get
melted (cauldron), documented, debated, and built — then bred back into the network via PRs.

## Meta

| Key | Value |
|-----|-------|
| **id** | repo-show-format |
| **canonical** | yes |
| **play_lift_learn** | https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift |
| **cauldron** | https://github.com/SimHacker/moollm/tree/main/skills/cauldron |
| **showmaker_network** | showmaker-network.yml |

## How It Runs

- **announce:** Ahead of time (e.g. Hacker News) — a pointer to THIS repo, not a wall of text
- **rtfr:** Read The Fucking Repo — follow along on your own rig (editor, browser, notebook, AI, or bare hands)
- **guest_intro:** Guest introduced as a Repo Man / Repo Woman (Alex Cox homage — come on, let's go)
- **audience:**
  - Incarnate consensual characters (representation-ethics)
  - Submit questions as PRs — pre-loaded question-advertisements in character dirs
  - Don Philahue surfaces relevant questions live (Phil-Donahue homage audience-wrangler)
- **implement:** Design ideas → cauldron → skills + code — however YOUR rig builds (see rig_spectrum)
- **clocks:**
  - before_async_PRs
  - during_Twitch
  - after_harvest_PRs
- **during_twitch:**
  - brain_stream: brain-stream.yml
  - note: Live bus — prompts, thinking, model shifts, GH doc links on overlay + throttled chat
  - drag_race: Manual Transmission + Micropolis AI Drag Race — Slats judges; spend log ref
- **after_harvest_pr:**
  - post_run_forensics: ai-offs.yml#post_run_analysis
  - note: cursor-mirror + deep-snitch on session artifacts before public harvest

## Rig Spectrum

- **principle:** Play along with YOUR rig — or learn a new one. See who makes the coolest.
- **rig_schema:** Rigs are defined by extensible schemas — download, install, configure, use, replicate,
mash up. See schemas/rig-schema.yml; instances in rigs/*.rig.yml; PR yours + INDEX entry.
- **no_ai_required:** yes
### hand_craft

## Hand Craft

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
### cost_to_ship_scoreboard

## Cost To Ship Scoreboard

- **axes:**
  - tokens
  - spend_dollars
  - wall_clock
  - solution_quality
  - integration
  - abstraction
- **joke_reframed:** Compare how efficiently or extravagantly you arrived — not just how good the solution was
- **artisanal_baseline:** Zero tokens — the efficiency floor; taste must carry

### ai_rig_feedback

## Ai Rig Feedback

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

### levels

## Levels

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
  - Manual Transmission — smallest model that ships; same spec CARD; Slats + spreadsheet judge; see manual-transmission.yml
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

## Showmaker Network

- **what:** A graph and publication network of show objects — not a flat playlist
- **your_show:** Run your own Repo Show on YOUR branch or YOUR repo
- **link_in:** Open a PR — we add show CARDs + edges into this network from your contribution
- **we_add:** Show objects + links from merged PRs (yaml-jazz indexes stay navigable)
- **automation_goal:** Tooling to easily author show CARDs, pitch videos, and link PRs (hosted-content-cards pattern)
- **see:** showmaker-network.yml

## Cauldron Scoop

- **insight:** You can scoop many types of things OUT of a cauldron — not only LADLE.
MELT/STIR grows the soup; SCOOP selects what leaves the pot and in what form.
### operations

## Operations

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
| [`cross-links.yml`](cross-links.yml) | Narrative web — trails between all rooms |
| [`vision-and-ambition.yml`](vision-and-ambition.yml) | Long arc girder |
| [`VISION.md`](VISION.md) | Generated markup |
| [`rig-feedback.yml`](rig-feedback.yml) | Declare your real AI stack |
| [`showmaker-network.yml`](showmaker-network.yml) | Shows breed shows |
| [`manual-transmission.yml`](manual-transmission.yml) | Smallest model that ships |
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

# Why now — Micropolis, Repo Shows, and the SimProv Wedding Playset

*Introductory narration for funders, collaborators, and the Steam Sims 1 audience. Maps what we are building to what was already built, shipped, and loved — and why the moment is different in 2026.*

---

## The idea in one breath

**Player-created content as a family medium.** Not a modding subculture for experts — grandparents learning Photoshop and XML to make objects for grandkids; parents who grew up on The Sims teaching Blender and the new game to their kids; weddings you orchestrate together in a toy world that takes your relationships seriously.

Will Wright named this in 1996: net-shared user content, plugin objects, data portability, the hobby model. Don Hopkins, Heather and Steve Alvey (SimFreaks / SimSlice), Donna and the SimBabes artists, and a whole community **already built it** for The Sims 1. Life interrupted. The work sat in drawers. **Now's the time** to raise it again — openly, republishably, on modern rails — for a generation that can finally marry whoever they love in the real world and wants to play that truth in the game world too.

This document is the bridge between **proof** (the archived sources in this repo) and **plan** (Micropolis Class + the Repo Show constellation).

---

## Proof it worked before

We are not pitching vapor. The evidence lives in [`sources/`](sources/INDEX.md), [`assets/sims-series/`](assets/sims-series/), and the [**content catalogs**](catalogs/):

| Catalog | What |
|---------|------|
| [SimFreaks](catalogs/simfreaks/) | Heather Alvey — object suites, SimAntics depth |
| [SimSlice](catalogs/simslice/) | Steve Alvey — SliceCity, nested SimCity |
| [SimProv](catalogs/simprov/) | Wedding playset + composable orchestration |
| [Zombie Sims](catalogs/zombie-sims/) | Current magnum-opus pack — still shipping |
| [**Micropolis Home**](catalogs/micropolis-home/) | **Create · publish · share** platform hosting all of the above |

| What | Proof in this repo |
|------|-------------------|
| **Deep UCC tools** | [Transmogrifier story](assets/sims-series/transmogrifier-story.md), [SimFreaks content catalog](sources/2005-09-18-simfreaks-content-catalog-laszlo/article.md) |
| **Web-native content CMS** | [SimFreaks catalog in OpenLaszlo + Python](sources/2005-09-18-simfreaks-content-catalog-laszlo/article.md) — thousands of objects, collections, Hypercard-like composition |
| **Games nested in games** | [Steve Alvey's SliceCity](assets/sims-series/simslice/) — Will's 1996 data-portability dream, **actually shipped** |
| **Composable SimAntics objects** | [Crowd Sitter](sources/2018-04-23-sims-crowd-sitter/medium-article.md) (10 figures), [Dumbold Voting Machine](sources/2018-04-24-dumbold-voting-machine/medium-article.md) (20 figures) |
| **Original Sims public site** | [Halloween tombstones](sources/2005-09-22-halloween-tombstones-original-sims/article.md), Dumbold, cemetery — families making and sharing personalized objects |
| **Design lineage** | [1996 Winograd talk](sources/1996-04-26-winograd-interfacing-to-microworlds/medium-article.md) (167 figures), [Soul of The Sims / Motive.c](sources/2008-02-10-soul-of-the-sims/article.md) |
| **Procedural vs hand-authored** | [Chris Trottier — tuned emergence](sources/2004-02-21-chris-trottier-tuned-emergence/article.md); [Spore GDC stub](sources/2005-03-11-spore-gdc-future-of-content/article.md) — Will's pivot toward procedural content |

The grandmother who learned Photoshop and XML for her grandkids is not a marketing fable — it is the stated motivation in Don's archival notes ([family manifesto](assets/sims-series/family-manifesto.md)). Miyamoto's GDC photo of a grandfather watching his granddaughter's face, not the screen, is the register we mean: **the player is the spectacle** (DDR, Wii Sports, a wedding you stage together).

---

## How Micropolis and WillWrightShowForFood map to this

Two repos, one arc:

### Micropolis (the engine + publishing stack)

Open-source descendant of SimCity — Don's lineage from the NeWS port through OLPC to today's WASM/SvelteKit stack. Micropolis is where **simulation meets publishing**:

- Branching pop-up dialogs (title, picture, text, pie-menu buttons) — the same machinery as family album readers and the Dumbold's illustrated agitprop
- Federation-friendly content cards, hosted catalogs, round-trippable saves (see [Micropolis Home](catalogs/micropolis-home/) · [publishing vision](assets/sims-series/micropolis-publishing-vision.md))
- **Micropolis Class**: go to the people who invented the ideas, capture them in public, implement on stream — the product is methodology + knowledge; the game is the proof

### WillWrightShowForFood (the show + corpus)

Public monorepo for **Repo Shows**: GitHub-native, live conversations whose artifact and stage is the repo itself. The Will Wright kickoff is the anchor; sibling shows ([Heather & Steve Alvey](../heather-steve-alvey/), Eric Bowman, Jamie Doornbos, …) carry specific threads.

**WWSFF is credibility packaging** for funders and fans:

1. **Describe** — clean republishable sources (essays + Medium extracts), not link rot
2. **Show** — screenshots, composable objects, CMS mockups, SliceCity proof
3. **Prove it's possible** — it was done; here are the files, the articles, the objects
4. **Follow through to code** — homefun on MicropolisCore + MOOLLM; cauldron → playable features

The [Repo Show format](../../process/repo-show-format.yml) is Terry Winograd's public UI seminar, updated: RTFR on your rig, audience character PRs, Don Philahue wrangling, ideas implemented live.

---

## The magnum opus: SimProv Wedding Playset

The **SimProv Wedding Playset** is the emotional center — unfinished in the 2000s, now rising again like a phoenix.

Built with **SimFreaks**, **SimSlice**, **SimBabes**, and Don: not one object but an **orchestration kit** — composable tools that solve practical staging problems so players conduct the ceremony:

| Object | Job |
|--------|-----|
| [Crowd Sitter](sources/2018-04-23-sims-crowd-sitter/medium-article.md) | Gather guests, seat them, manage overflow standing |
| Cupid | Speed-dating cheat — prerequisite romance for marriage |
| Buddha statue | Suppress hunger/bladder/mood so large crowds don't collapse |
| Hope Chest + wedding consultant | Onboarding, catalogs, narrative scaffolding |
| Donna's premium set pieces | Beds, buffet, tables, dolls — the craft layer |

Heather gave permission to share the archive: classic SimFreaks objects, unreleased playset pieces, Transmogrifier, Crowd Sitter, Cupid, and the rest ([big-prompts capture](assets/sims-series/micropolis-publishing-vision.md)).

**Why it matters in 2026:** When this playset was conceived, same-sex marriage was not yet legal across the United States. The playset was always about **who gets to stand up in front of friends and family and be recognized**. Republishing it now is not nostalgia — it is a deliberate act in an ongoing culture war: *here is a toy world that takes your relationships seriously; here are tools to stage joy together.*

That is agitprop too — but of inclusion and family play, not exclusion. **Intentional inclusion procedural rhetoric** — politics in orchestration rules (Cupid, Crowd Sitter, Buddha), not a manifesto dialog. Pair with the [Dumbold](#the-dumbold-voting-machine--dated-agitprop-preserved-honestly) (institutional farce, same engine). Discuss with **Ian Bogost** on a future show: [procedural-rhetoric-inclusion-agitprop.md](assets/sims-series/procedural-rhetoric-inclusion-agitprop.md) · [show seed](ian-bogost-procedural-rhetoric/SHOW.yml).

See also: [Heather & Steve show seed](../heather-steve-alvey/afterlife-zombie-bridge.yml) (`micropolis_publishing_system`, `simprov_wedding_playset`).

---

## The Dumbold Voting Machine — dated agitprop, preserved honestly

The [Dumbold Voting Machine](sources/2018-04-24-dumbold-voting-machine/medium-article.md) is a **2004 election-cycle** Sims object: procedural rhetoric (Ian Bogost's term) — argument encoded in rules, failure modes, and branching dialogs, not a essay on a page.

It satirizes **e-voting UX and auditability** (Diebold headlines, EFF, DMCA §512(f), "Monkey" debug mode, factory reset). The "accidentally vote for Pat Buchanan" gag is **interface farce**, not an endorsement of any candidate or faction.

### How we frame it (and how we do not)

**We preserve it because:**

- It demonstrates that Sims objects already had everything needed for interactive civic media — pop-ups, pie menus, SimAntics — the same stack Micropolis publishing extends
- Several concerns it raised (paper trails, vendor accountability, security-through-obscurity) **were partly addressed** in real policy and practice since 2004 — the piece is a **time capsule** of legitimate worries, not a current election playbook
- The **"Vote or Die!"** P. Diddy parody branch is unmistakably **of its moment** — celebrity GOTV hype aged into camp. We keep it as historical humor, not as a model for civic engagement today

**We do not frame it as:**

- Election denial, stop-the-steal rhetoric, or support for any contemporary politician's ideology (including Trump's)
- Proof that any specific modern election was stolen — the object is about **broken machines and bad UX**, not ballot fraud conspiracies
- A reason to distrust voting in general — if anything, the opposite: make the machinery **visible**, auditable, and mockable so people demand better systems

Valid issues remain (vendor lock-in, transparency, accessibility). The Dumbold is a **satirical lab bench** from twenty years ago — amusing, instructive, and explicitly dated. Read it next to the wedding playset: one object stages **love and recognition**; the other stages **institutional failure** — both use the same dialog engine.

---

## The Spore thread (hand-authored → procedural)

Will's [2005 GDC Spore demo](sources/2005-03-11-spore-gdc-future-of-content/article.md) (article stub — Medium removed) marks the industry pivot toward **procedural content**. Our project holds **both** truths:

- **Hand-authored artisanal UCC** (SimFreaks, SimProv, Heather and Steve's 26-year catalogs) — love, craft, family objects
- **Procedural and AI-assisted creation** (Spore lineage, MOOLLM, Micropolis Class homefun) — scale, remix, new generations

The wedding playset is the human magnum opus; Micropolis + federation publishing is how we **host, republish, and extend** that opus without losing the grandmother-with-Photoshop soul.

---

## Where to start reading

| Audience | Start here |
|----------|------------|
| Funder / producer | This file → [family manifesto](assets/sims-series/family-manifesto.md) → [Crowd Sitter + Dumbold sources](sources/INDEX.md) |
| Will / design peer | [1996 Winograd medium article](sources/1996-04-26-winograd-interfacing-to-microworlds/medium-article.md) → [SHOW.yml](SHOW.yml) |
| Heather / Steve / UCC veterans | [Catalogs hub](catalogs/) → [SimFreaks](catalogs/simfreaks/) → [afterlife-zombie-bridge](../heather-steve-alvey/afterlife-zombie-bridge.yml) |
| Player / Steam Sims 1 fan | [Content catalogs](catalogs/) → [assets/sims-series/](assets/sims-series/) galleries → download via [Micropolis Home](catalogs/micropolis-home/) |

---

*Part of [A Repo Show with Will Wright](README.md). Micropolis Class — show, don't tell.*

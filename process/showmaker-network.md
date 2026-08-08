# ShowMaker network

[Repo Show format](repo-show-format.md) · [StoryMaker inheritance](storymaker-stories-and-scenes.md) · [Repo shows INDEX](../repo-shows/INDEX.yml)

---

## The hook

A **ShowMaker network** — interrelated show proposals and finished shows as first-class objects. Not a linear playlist: a **graph** you browse, fork, and extend. Nodes = show objects (CARD dirs); edges = typed links (flows_from, guest_of, implements, bridges_to, competes_with, nests_inside).

## Show repos & franchises

A show repo owns a fan base — not one episode. Episodes live as `repo-shows/<slug>/`. Spin off **franchises**: `<ShowName>` public + `<ShowName>Private` green room. Constitutional participation: [guest-participation-ladder.md](guest-participation-ladder.md).

## StoryMaker inheritance

ShowMaker **specializes** StoryMaker — same substrate, show layer added. StoryMaker: directories + files in git (family albums, media on branches). ShowMaker adds `SHOW.yml` show interface — a show is a **graph walk** over StoryMaker content.

**2011 SFC lineage** (MicropolisCore): Don ↔ Ben Shneiderman correspondence documents StoryMaker at deployment — geo server + iPhone/iPad app, Janet Murray / GA Tech student projects, Ben Bederson's **StoryKit** as parallel iOS story tool. Same stack powered **Bar Karma** (broadcast writers' room) and **Urban Safari** (field geo capture). Full thread: [shneiderman-2011-correspondence.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/storymaker/shneiderman-2011-correspondence.md) · [Bar Karma overview](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/bar-karma/overview.md) · [Urban Safari overview](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/urban-safari/overview.md).

## Hosted video wrapper

A show can **wrap** an existing video you didn't produce — point SHOW.yml at hosted video, add bookmarks/TOC/playlists, play and augment live. Artifacts live in **character** dirs; shows draw on them. Attribution = selfish-inheritance declaration.

## Competitions — declare, don't exclude

| Format | Tagline |
|--------|---------|
| Code That Spec | NAME THAT TUNE → CODE THAT SPEC |
| Manual Transmission | Smallest model / fewest tokens |
| Micropolis AI Drag Race | Start your engines — merge or sashay |
| Stick shift | Every shift = commit |

Score: cost to ship, solution quality, merge back, abstraction to skills/packages/. Budget bull ride and stick-shift model switching get real recognition.

## Your show

Fork → plant SHOW.yml → run on your rig → PR back to link node + edges into network. Declare rig class honestly — artisanal, budget, stick shift, orchestrated.

## Show hooks

- **Graph walk playlist:** Publish the path you walked during a show as ordered playlist — branching allowed.
- **Generic show skill lift:** Instance-first — build repo-show, then lift generic `show` skill when second caller needs it.

## Deeper links

| Topic | Where |
|-------|--------|
| AI-offs | [ai-offs.md](ai-offs.md) |
| Lift pipeline | [lift-pipeline.md](lift-pipeline.md) |
| Packages | [../packages/README.md](../packages/README.md) |
| Rigs | [../rigs/README.md](../rigs/README.md) |

↑ [process index](README.md) · Girder: `showmaker-network.yml`

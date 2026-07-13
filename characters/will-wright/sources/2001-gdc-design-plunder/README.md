# Source: *Design Plunder* — Will Wright, GDC 2001

*Sniff:* [`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml)

**Video (slides + presenter):** [YouTube — c91IWh4agzU](https://www.youtube.com/watch?v=c91IWh4agzU) (~1:05, Cory Martin edit, Jul 2020)  
**Official GDC (no slides):** [Game Developer article + GDC channel](https://www.gamedeveloper.com/design/video-will-wright-s-classic-2001-keynote-on-game-design-inspirations) (Aug 2017)  
**Archive.org:** [will-wrights-design-plunder-with-slides](https://archive.org/details/will-wrights-design-plunder-with-slides)  
**Event:** Game Developers Conference · **2001** · Game Design Keynote

Cory Martin restored Will's PowerPoint — the official GDC upload was presenter-only, which made a
slide-heavy talk nearly unwatchable. Julien Barbe's slide captures on his website were the source.
Don's [1996 Winograd Medium article](../1996-04-26-winograd-interfacing-to-microworlds/medium-article.md)
pulls SimAntics slide images from this version.

## Why it matters for Repo Show

| Thread | What this talk does |
|--------|---------------------|
| **Will through-line** | Chair → Alexander → Eames → failure states → disease vectors → fitness landscapes → Japanese gardens → abstraction — the *design vocabulary* behind Sims/Spore |
| **1996 Winograd echo** | Calvin Syndrome, mental-model compiler, toys not games — same ideas, earlier keynote form |
| **2005 Spore GDC** | Powers of Ten, pollination, player stories, compression rhetoric — Design Plunder is the prequel syllabus |
| **Don / UCC** | SimFreaks fan-site tour, custom object tools, story exchange — direct line to Transmogrifier / SimCity Educational |
| **Sims Online era** | Preview of social graphs, player-as-entertainer economy — pre-MMO community design |

## Core thesis (one paragraph)

Will raids other fields for design metaphors — architecture (Christopher Alexander), furniture (Eames),
biology (ants, fitness landscapes), epidemiology (Sims as STD), Japanese gardens (Miyamoto), UI
minimalism (Zen rock gardens). The designer **surfs a huge tree of design**; any leaf can sink the
game. **Failure is fun when it's varied** — repetitive or inexplicable failure is death. **Abstraction
invites imagination**: shift from 80% in the player's head (early games) to 80% on the computer (modern
AAA) — fight to get imagination back. Close: SimCity and The Sims were the **only two games everyone
told him sucked** — determination when the box is outside consensus.

## Act structure

### I — Chair and hierarchy (0:00–9:00)

- Jack London: *"You can't wait for inspiration — go after it with a club."*
- Chair design as hard problem; Christopher Alexander — craftsman vs professional disconnect.
- Game design tree: installation failure sinks everything; designer surfs branches (Minsky society of mind).

### II — Eames, failure, Calvin (9:00–19:00)

- Charles & Ray Eames — crossover between furniture, film, toys; House of Cards.
- **Game designer chairs** — Miyamoto, Carmack, Sid Meier, Molyneux, Will's toy-chair with failure states.
- **Interaction onion** — nested feedback cycles; inner 10 seconds must be fun first.
- **Failure is bad when repetitive**; Calvin factor — bulldozer before disasters.

### III — Disease, landscapes, gardens (19:00–35:00)

- Sims spread vectors (press → male gamers → girlfriends → lateral female explosion).
- Ant pheromones → Sims happiness **fitness landscape** (fridge peak, Betty peak).
- Japanese gardens — design density, invisible UI, Miyamoto mushrooms; *"nothing else you can remove."*

### IV — Abstraction and Arnold (35:00–40:00)

- Two-processor model: player head vs computer — reclaim imagination via abstraction (Simlish, low-res Sims).
- **Schwarzenegger keyboard prank call** — she never knew; *"we could probably build an AI…"*

### V — Sims community ecology (40:00–58:00)

- Fan-site diversity: SimFreaks, seven deadly sins, armadillo pad, onion parody, mall of sites.
- Custom tools (skin remover, brain surgery, object editors); 700k engaged of 3.5M sold.
- Story exchange — lawn gnomes, snowflake lodge, abusive-relationship catharsis story.

### VI — Sims Online + story parsing (50:00–1:04)

- Sims Online — import web content, entertain-other-players economy, live social graph.
- Interactive storytelling drag: fans forcing story over simulation; Truman Show director model.
- SETI@home parallel for discovering story grammar from player telemetry.

### VII — Close (1:03–1:04)

- Self-confidence and determination; **SimCity and The Sims** — the two ideas everyone said sucked.

## Files in this folder

| File | Role |
|------|------|
| [`summary.md`](summary.md) | Timestamp index + quote pulls |
| [`short-form-clips.yml`](short-form-clips.yml) | Cut candidates |
| [`youtube-reception.md`](youtube-reception.md) | Cory Martin remaster comment themes |
| [`transcript-cache/`](transcript-cache/README.md) | Provenance + caption refresh |

## Production (local)

```bash
# Cory Martin version — slides visible (preferred for quotes citing slides)
yt-dlp -f 'bv*+ba/b' --merge-output-format mp4 \
  -o ~/GroundUp/repo-show/sources/2001-gdc-design-plunder/cory-martin-slides.mp4 \
  'https://www.youtube.com/watch?v=c91IWh4agzU'

# Screen-only Spore sibling uses archive.org; this talk's archive mirror:
# https://archive.org/download/will-wrights-design-plunder-with-slides/
```

## Navigation

↑ [sources](../README.md) · [1996 Winograd](../1996-04-26-winograd-interfacing-to-microworlds/README.md) · [2005 Spore GDC](../2005-03-11-spore-gdc-future-of-content/README.md) · [Will show](../../../../repo-shows/will-wright-premiere/README.md)

| Sibling | → |
|---------|---|
| Spore GDC 2005 | [2005-03-11-spore-gdc-future-of-content](../2005-03-11-spore-gdc-future-of-content/README.md) |
| Winograd 1996 | [1996-04-26-winograd-interfacing-to-microworlds](../1996-04-26-winograd-interfacing-to-microworlds/README.md) |
| Soul of the Sims | [2008-02-10-soul-of-the-sims](../2008-02-10-soul-of-the-sims/README.md) |

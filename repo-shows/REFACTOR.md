# repo-shows/ REFACTOR — flat registry, full polymorphism

Status: **PLAN — not yet executed.** Approve, amend, or veto sections before
any files move. Execution is phased; each phase is a separate commit that
leaves the repo consistent.

## The problem

`repo-shows/` grew three structures that fight each other:

1. **`ideas/` is a nested taxonomy inside a registry.** We are already in
   repo-shows; `ideas/` contains ideas for repo shows, sorted into buckets
   (`gags/`, `themes/`, `traditions/`, `swag/`), and — worst — `ideas/shows/`
   contains a whole `will-wright-premiere/` content pack. Shows inside ideas
   inside repo-shows. The question "what is the difference between a
   repo-show, an idea, and a show?" has no good answer because the answer is
   encoded in *directory placement* instead of *data*.
2. **`flipbook/` nests its own `shows/`** — four `FLIPBOOK.yml` packs hidden
   two levels down, invisible from the flat listing.
3. **~43 loose one-file seeds** sit beside ~80 planted directories. The
   seed/planted distinction is fine (a seed IS a repo-show — see
   `REPO-SHOWS.yml` implicit inheritance), but seeds-as-files can't grow an
   `.md` companion, notes, or assets without a rename-shaped migration each
   time — and the goal is a thoughtful md for every yml.

## The answer to "repo-show vs idea vs show"

**Nothing, structurally. Kind is data, not place.** Every entry in
`repo-shows/` is a repo-show directory. Whether it is an idea, a show, an
idea for a show, a show about an idea, a show in a show, or an idea in an
idea is expressed by fields and id-references, not by nesting. Full
polymorphism: directories can contain anything, combine and nest *by
reference* in production, and be recombined without moving files —
ingredients into many dishes served together in a meal (the full algebra:
§2b).

## Target model

### 1. `repo-shows/` — flat registry of repo-show directories

Same pattern as `characters/`:

- One directory per repo-show. **No nesting of repo-shows inside
  repo-shows.** Composition is by id reference, not containment.
- **Big-endian naming** groups related entries in the flat listing:
  `will-wright-premiere/`, `will-wright-premiere-ideas/`,
  `flipbook/`, `flipbook-soul-city-namesake/`,
  `game-bridge-proxi-sims/`, `game-bridge-sims-spore/`, …
- Registry files stay at top: `INDEX.yml` (the map), `REPO-SHOWS.yml`
  (collection manifest + implicit inheritance), `README.md`, `CARD.yml`,
  `GLANCE.yml`, `_TEMPLATE/`.

### 2. `REPO-SHOW.yml` — the optional interface

Implicit or explicit; back-fill later; **no requirements**. A directory with
nothing but a scribble is a valid repo-show. When a directory wants to be
legible to tooling and cross-references, it declares:

```yaml
# REPO-SHOW.yml — all fields optional; implicit inheritance from REPO-SHOWS.yml
id: ca-machinima-cabaret-drag-race
kind: idea            # open vocabulary: show | idea | series | episode |
                      # pack | performance | memorial | reunion | bridge | ...
status: seed          # seed | ready | send_ready | planted | recorded |
                      # aired | graduated
parents:              # SELFISH multiple inheritance — delegate to many (see §2b)
  - micropolis-ai-drag-race         # verdict culture, judging, rig personas
relates_to:           # typed edges BY ID — this is how nesting really works
  - { id: will-wright-premiere, rel: candidate_segment_of }
cast:
  regulars: [don-hopkins]                # characters/ ids — every episode
  guests: [tom-tjon-a-loi, keez-duyves]  # this show / this episode
bits: [gag-slats-robopoetry-gong]        # bits/ ids (see below)
```

Existing `SHOW.yml` files stay put — `REPO-SHOW.yml` is the *registry
interface*, `SHOW.yml` remains the show's own content. A later phase may
merge or alias them; not this refactor.

### 2b. The composition algebra — shows × episodes × cuts × casts

The registry stays flat so the OBJECTS can combine freely. The selfish
object system (Self-style prototype delegation — Ungar lineage, multiple
parents, copy-down when you need to specialize) is the mechanism; the
kitchen is the metaphor:

| Object    | Role in the meal | Lives |
|-----------|------------------|-------|
| character | ingredient       | `characters/<id>/` |
| bit / theme | seasoning — repeatable, reusable | `bits/<kind>-<id>/` |
| show      | the kitchen — a house style + recurring cast that can serve many dishes | `repo-shows/<id>/` |
| episode   | a dish — ONE composition of theme(s) × cast, actually cooked | starts inside its show's room (`episodes.yml` or `episodes/<slug>/`); graduates to its own flat entry (`<show>-<episode>/`) when it outgrows the room |
| cut       | a plating — live, broadcast, director's, clips | artifact inside the episode |
| track     | a prix-fixe menu — curated sequence of shows/episodes for a constituency | `process/tracks/<id>/` |

Rules of the algebra:

- **Shows have episodes; episodes have cuts.** Containment inside one
  entry's room is fine (that's a room's own furniture, not registry
  nesting). The moment an episode needs to be referenced from outside,
  it gets an id — graduating to a flat big-endian entry is a rename,
  not a redesign.
- **Episode = theme × cast, by inheritance.** An episode delegates to a
  repeatable theme (the format that survives recasting) and to its show
  (the house style), and binds characters as cast. Same theme, different
  characters → different episode, one line of yml. The
  "what-is-a-memory-once-playable" panel is a theme; Will + Tom + Keez is
  one casting of it; recast it next season without touching the theme.
- **A show may be named for a character.** `repo-shows/scott-draves/`
  delegates to `characters/scott-draves/` for the person and to whatever
  themes it serves — the name collision is not an accident, it's
  inheritance. Combining characters into a show built just for them
  (`will-and-yoot`) is the same move with two character parents.
- **Cast has roles:** regulars (every episode), guests (this episode),
  cameos (one scene). Character ids resolve against `characters/`; a
  character's own page backlinks its appearances.
- **Bridges and mash-ups are shows with multiple show-parents.** A
  game-bridge episode inherits from two shows and Soul City routes the
  middle. A mash-up (`flipbook` × `building-the-sims`) is the same
  algebra, no new machinery.
- **A track is a menu, not a container.** It references shows and
  episodes by id, sequences them for a constituency (educators), and
  adds participation formats. Deleting a track orphans nothing.

Everything above is expressible in `REPO-SHOW.yml` with `parents:`,
`cast:`, `relates_to:`, and ids — no directory moves required to remix.
That is what flat buys: recombination is cheap because location never
encodes meaning.

### 3. `bits/` — NEW top-level registry for cross-cutting inventory

**Decision point (recommended, veto-able):** gags, themes, traditions, and
swag move OUT of repo-shows entirely, upstairs to a top-level `bits/`
registry, sibling of `characters/`.

Why upstairs: they are not shows and not ideas-for-shows. A gag is performed
*in* shows; a theme runs *across* shows; a tradition recurs; swag is merch.
They are writers'-room inventory that shows draw from **exactly like
characters** — and characters live at top level. Together with
`process/tracks/` (§3b) this completes a clean set of registries
referenced by id:

| Registry          | Contains         | Referenced from shows as |
|-------------------|------------------|--------------------------|
| `characters/`     | people           | `players:`               |
| `repo-shows/`     | shows            | `relates_to:`            |
| `bits/`           | material         | `bits:`                  |
| `process/tracks/` | programming arcs | `tracks:`                |

The top level holds the show's **content nouns**; `process/` holds
**how the show gets made** (entryways, trails, tracks, challenges,
post-production). One meta pile, not many.

Why ONE registry, not four: the categories are fuzzy (Unnecessary Censorship
is filed as a tradition but it's Kimmel's gag). With four directories,
recategorizing means moving files and breaking links. With one flat registry
and big-endian kind prefixes, recategorization is a rename:

```
bits/
  gag-slats-robopoetry-gong/
  gag-speed-dating-with-cupid/
  theme-simulation-effect/
  theme-procedural-rhetoric/
  tradition-unnecessary-censorship/
  tradition-foreign-poet-play-along/
  swag-sfc-sticker-packs/
  swag-voystick-warning-stickers/
```

The prefix sorts kinds into groups in `ls`; the kind also lives in each
entry's `BIT.yml` (same optional-interface philosophy as `REPO-SHOW.yml`).
New kinds (segment, catchphrase, running-bit, game) join without new
architecture. Name alternatives considered: `writers-room/` (charming,
Bar Karma lineage, long), keeping `ideas/` (overloaded — show seeds are
ideas too; that's how we got here). "Do the bit" is showbiz-native and
covers all four.

### 3b. `process/tracks/` — NEW home for programming arcs

**Tracks are not themes, and tracks are not entryways.** Three words,
three functions, all needed:

- An **entryway** (`process/entryways/`) is a doorway: an ordered reading
  playlist for a kind of visitor. `entryways/educator.md` tells a teacher
  what to read, in what order.
- A **trail** (`process/trails/`) is a sideways reading path across the
  repo by topic.
- A **track** is a *production program*: a curated arc of shows, guests,
  and participation formats aimed at a constituency. `educators-track` is
  filed under `ideas/themes/` but it isn't a discussion thread — it's
  educators as co-producers, classrooms as contributor pipelines, member
  shows (Bartle, Eagleson, Snap!/Logo, Bender), formats (critical play,
  feature coursework, game jams, data lab), and a funding thesis.

The entryway is how an educator walks in; the track is the season of
programming behind that door. They already cross-link (`educator.md` lists
the track as stop 6). Keep both words.

**Where tracks live: `process/`, not top level.** The repo has two kinds
of piles: top level holds content nouns (`characters/` people,
`repo-shows/` shows, `bits/` material), and `process/` is the single
how-the-show-gets-made pile — it already holds the whole navigation-and-
programming family: `entryways/`, `trails/`, `challenges/`,
`post-production/`, `hn-harvest/`. A track is programming strategy, which
is production, which is process. A top-level registry for one entry would
be premature anyway:

```
process/tracks/
  README.md               # what a track is; entryway/trail/track distinction
  educators-track/
    educators-track.yml   # moved from repo-shows/ideas/themes/, content unchanged
    educators-track.md    # its existing handwritten companion, moved too
```

A `TRACK.yml` optional interface follows the same philosophy: id, audience,
member shows by id, member characters by id, status. Candidate future
tracks already living under other names — NOT moved now, just linked from
the README: the `interval-reunion-2026` and `hci-pie-hyperties-2026`
"batches" in `REPO-SHOWS.yml`, and the retrocomputing drive
(`process/challenges/retrocomputing-drive.yml`).

**Link warning:** `educators-track` is referenced 35 times across 23
files (characters/, process/trails/, process/entryways/, cross-links.yml,
INDEX files). Its move gets the same scripted sweep as everything else —
the reference table is built from `git mv` pairs, so nothing moves without
its links being tracked down.

### 4. Every entry gets a directory, and every yml gets a thoughtful .md

Loose seeds become directories. The seed yml moves inside, unchanged:

```
micropolis-ai-drag-race.yml   →   micropolis-ai-drag-race/micropolis-ai-drag-race.yml
```

**The goal state — this is what the refactor is FOR:** every `.yml` gets a
companion `.md`, and every directory gets a `README.md`. Not generated —
**authored**. The facade generator (`pnpm run facades`) stays for the
process/ girders it already serves, but repo-show companions are written
by hand, thoughtfully, and intertwingled:

- **The yml is the machine reading** — structure, ids, edges, status.
- **The md is the human reading** — narrative prose: what this is, why it
  exists, who it's for, how it connects. Written fresh from the yml plus
  repo context, not a field-by-field transcription.
- **Intertwingled** — every md links the characters, shows, bits, and
  tracks it mentions by relative path; the entries it links get backlinks
  when touched; yml and md reference each other. Ted Nelson's word, Ted
  Nelson's discipline: everything deeply intertwingled, no orphan pages.
- **READMEs orient** — a directory's README says what's in the room, read
  order, and where the exits go (the `characters/` and `ideas/themes/`
  READMEs are the house style).

The precedent already exists: `ideas/themes/` pairs every yml with a
handwritten md. This program generalizes the themes pattern to the whole
collection. No entry is *required* to have its md before moving — structure
first (Phases 1–5), then the authoring program (Phase 6) works through the
backlog in priority order. Existing paired `.yml`+`.md` (e.g. `ask-tog.yml`
+ `ask-tog.md`) move into their directory together and count as done.

### 5. yml/md filename consistency — one rule, no exceptions

Two conventions currently coexist in `process/` (and leak elsewhere):
~50 handwritten companions correctly use the **same lowercase basename**
as their yml (`art-thief-game.yml` + `art-thief-game.md`), while the 13
facade outputs registered in `markup-facades.yml` are UPPERCASE — and
four don't even share their girder's basename (`DRAG-RACE.md` ←
`micropolis-ai-drag-race.yml`, `FORMAT.md` ← `repo-show-format.yml`,
`HOMEFUN.md` ← `homefun-grading.yml`, `VISION.md` ←
`vision-and-ambition.yml`). A reader cannot predict the md from the yml
or vice versa. (Verified via `git ls-files` — no case-duplicates exist;
the filesystem is case-insensitive, so checks must go through git.)

**The rule:**

- A yml's companion md has the **identical basename, lowercase**:
  `ai-offs.yml` + `ai-offs.md`. One name, two readings (§4).
- **UPPERCASE is reserved for room-scoped manifests and views**:
  `README.md`, `INDEX.yml`/`INDEX.md`, `CARD.yml`/`CARD.md`,
  `GLANCE.yml`/`GLANCE.md`, `REPO-SHOWS.yml`, `SHOW.yml`,
  `REPO-SHOW.yml`, `BIT.yml`, `TRACK.yml` — files that describe the
  ROOM, not a topic. These are already consistent (same-basename pairs).

**Renames (girder basename wins):**

| Now | Becomes |
|-----|---------|
| `AI-OFFS.md` | `ai-offs.md` |
| `BRAIN-STREAM.md` | `brain-stream.md` |
| `MANUAL-TRANSMISSION.md` | `manual-transmission.md` |
| `ORCHESTRATION-GOLD.md` | `orchestration-gold.md` |
| `CHARACTER-ENDOSYMBIOSIS.md` | `character-endosymbiosis.md` |
| `CRAZY-IDEA-JAM.md` | `crazy-idea-jam.md` |
| `DRAG-RACE.md` | `micropolis-ai-drag-race.md` |
| `FORMAT.md` | `repo-show-format.md` |
| `HOMEFUN.md` | `homefun-grading.md` |
| `VISION.md` | `vision-and-ambition.md` |
| `challenges/RETROCOMPUTING.md` | `challenges/retrocomputing-drive.md` |

Mechanics: update `markup-facades.yml` outputs FIRST (or the generator
recreates the UPPERCASE files), then `git mv` (git handles case-only
renames; never rely on `mv` on this filesystem), then the scripted link
sweep — these are the most-linked files in the repo (FORMAT.md and
DRAG-RACE.md are cited from entryways, trails, characters, invitations,
and RepoShowPrivate). The generated-facade banner inside each file stays;
authored replacements per §4 supersede generation entry by entry
(`render.mode llm`, already supported by the registry).

## Migration map

| Now | Becomes |
|-----|---------|
| `ideas/ca-machinima-cabaret-drag-race.yml` | `ca-machinima-cabaret-drag-race/` (kind: idea) |
| `ideas/jsonsters-gallery-lecture.yml`, `kids-city-newspaper.yml`, `urban-safari-live.yml`, `urban-ebike-safari.yml` | own top-level dirs (kind: idea) |
| `ideas/shows/will-wright-premiere/` (INDEX, content-map, episode-seeds) | `will-wright-premiere-ideas/` (kind: pack; `relates_to: will-wright-premiere`) — sorts adjacent to its show |
| `ideas/gags/*` (~31 entries) | `bits/gag-*/` |
| `ideas/themes/*` (yml+md pairs) — EXCEPT tracks | `bits/theme-*/` |
| `ideas/themes/educators-track.{yml,md}` | `process/tracks/educators-track/` (35 refs / 23 files — scripted sweep) |
| `ideas/traditions/*` (~12 entries) | `bits/tradition-*/` |
| `ideas/swag/*` (2 entries) | `bits/swag-*/` |
| `ideas/INDEX.yml`, `README.md`, `CARD.yml`, `GLANCE.yml` | dissolved: idea entries merge into `repo-shows/INDEX.yml`; bit entries seed `bits/INDEX.yml`; READMEs rewritten for the new rooms |
| `flipbook/shows/<name>/FLIPBOOK.yml` (4 packs) | `flipbook-<name>/` (kind: pack; `relates_to: flipbook` + the show it illustrates) |
| 43 loose top-level `.yml` seeds | `<name>/<name>.yml` dirs |
| 5 loose top-level `.md` companions | move with their yml |
| `_TEMPLATE/`, registry files | stay |

Non-goals of this refactor: renaming existing planted show dirs, touching
`SHOW.yml` contents, restructuring inside any entry's directory, touching
`will-wright-premiere/audience/` (that's inside one show's room — fine).

## Phases

Each phase = one commit, repo consistent after each. **The link sweep is the
real work: 367+ files reference `repo-shows/ideas/` paths** (characters,
process, schemas, catalogs, apps, designs — plus generated facades).

- **Phase 0 — approve this plan.** Settle the decision points below.
- **Phase 1 — `bits/` + `process/tracks/`.** `git mv`
  gags/themes/traditions/swag entries into `bits/` with kind prefixes;
  `educators-track` into `process/tracks/educators-track/`; write
  `bits/README.md` + `bits/INDEX.yml` (statuses carried over from
  `ideas/INDEX.yml`) and `process/tracks/README.md` (with the
  entryway/trail/track distinction); scripted link sweep for the four
  bucket paths and every `educators-track` reference; regenerate facades
  (`pnpm run facades`).
- **Phase 2 — dissolve `ideas/`.** Remaining idea seeds → top-level dirs;
  `ideas/shows/will-wright-premiere/` → `will-wright-premiere-ideas/`;
  merge `ideas/INDEX.yml` show entries into `repo-shows/INDEX.yml`; delete
  `ideas/` scaffolding; link sweep.
- **Phase 3 — flatten `flipbook/shows/`.** Four packs → `flipbook-*/`;
  update `flipbook/INDEX.yml` to reference by id; link sweep (8 files).
- **Phase 4 — directory-ify loose seeds.** 43 ymls + 5 md companions into
  own dirs; update `INDEX.yml` + `REPO-SHOWS.yml` seed lists; link sweep.
- **Phase 4b — facade case renames.** The §5 table: update
  `markup-facades.yml` outputs, `git mv` the 11 UPPERCASE facades to
  girder-basename lowercase, regenerate, link sweep (heaviest sweep of
  all — FORMAT.md and DRAG-RACE.md are cited everywhere, including
  RepoShowPrivate).
- **Phase 5 — verify.** Full-repo `rg` for every moved path (zero hits
  outside git history — case-sensitive rg, paths checked via `git
  ls-files` since the filesystem is case-insensitive), YAML parse check
  on all touched ymls, facades regenerated, `INDEX.yml` complete against
  `ls`.
- **Phase 6 — the companion-md authoring program.** The goal state:
  every yml has a thoughtful handwritten md, every directory a README,
  everything intertwingled (see §4). This outlives the structural refactor
  and runs as a standing program:
  - **Priority order:** (1) send_ready / send_now planted shows — these
    face guests; (2) the flagship rooms (will-wright-premiere, building-
    the-sims, terry-winograd); (3) idea seeds being actively pitched
    (ca-machinima-cabaret-drag-race, soul-city bridges); (4) bits with
    `status: ready`; (5) the long tail, opportunistically — whenever an
    entry is touched for any reason, it leaves with its md.
  - **Definition of done per entry:** md answers what/why/who/connections
    in prose; links out to every character, show, bit, and track it names;
    yml and md cross-reference; parent INDEX lists both.
  - **Interfaces back-fill on the same schedule:** `REPO-SHOW.yml`,
    `BIT.yml`, `TRACK.yml` written when an entry gets its md — tend
    implicit toward explicit (the coherence-engine way).

Link sweep mechanics per phase: build an old→new path table from the `git
mv` list, rewrite references repo-wide (script, not hand edits), then `rg`
each old path to confirm zero survivors. `RepoShowPrivate` gets the same
sweep for its pointers into this repo.

## Decision points

1. **`bits/` upstairs** — recommended above. Alternative: keep them inside
   `repo-shows/` as `gag-*` etc. dirs; costs ~57 non-show entries drowning
   the show listing.
2. **Registry name** — `bits/` vs `writers-room/` vs other.
3. **Seed placement inside dirs** — `<name>/<name>.yml` (recommended: no
   content change, greppable) vs normalize to `<name>/REPO-SHOW.yml` now
   (cleaner interface, bigger diff). Recommendation: keep names now,
   normalize opportunistically in Phase 6.
4. **`swag-*` in bits** — swag is arguably merch production, not performable
   material. Two entries; cheap to move again if it earns its own registry.
5. **Future tracks** — promote the `interval-reunion-2026` /
   `hci-pie-hyperties-2026` batches and the retrocomputing drive into
   `process/tracks/` entries now, or leave them where they live and link
   them from `process/tracks/README.md` until they need rooms.
   Recommendation: link now, promote when one grows content beyond a
   paragraph.
6. **FORMAT.md's brand** — `FORMAT.md` and `DRAG-RACE.md` are used as
   K-lines in prose ("read FORMAT first" in entryways). Renaming to
   girder basenames (§5) trades that shout for predictability.
   Alternative: keep just these two as sanctioned exceptions.
   Recommendation: rename anyway — the K-line survives as prose
   ("the format doc"), and one rule with zero exceptions is the only
   rule that stays followed.

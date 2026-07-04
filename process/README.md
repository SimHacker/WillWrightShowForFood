# process/ — protocol girders + human markdown facades

**Yaml is source of truth for machines** — compact data; dependency graph; MOOLLM and CI read yaml.

**Markdown is the human view** — hand-authored for important docs. **Yaml→md (`pnpm facades`) is a temporary fallback** until a quality instance exists.

## Instance-first vs fallback

| Tier | Docs | Edit |
|------|------|------|
| **Instance-first** (hand) | [VISION.md](VISION.md) · [CRAZY-IDEA-JAM.md](CRAZY-IDEA-JAM.md) · [ENTRYWAYS.md](../ENTRYWAYS.md) · [TRAILS.md](../TRAILS.md) · [entryways/](entryways/) · [trails/](trails/) | Edit the `.md`; sync yaml girder |
| **Fallback** (script dump) | [FORMAT.md](FORMAT.md) · [DRAG-RACE.md](DRAG-RACE.md) · [HOMEFUN.md](HOMEFUN.md) · … | `pnpm run facades` until hand-authored; then flip registry to `render.mode llm` |

Registry + priority queue: [`markup-facades.yml`](markup-facades.yml) · schema: [`../schemas/markup-facade.yml`](../schemas/markup-facade.yml)

**Two renderers:**

| Renderer | Role |
|----------|------|
| **Hand-authored** (default for important docs) | LLM + human edit — link-rich, no-ai-slop, accessibility |
| **Deterministic** (`pnpm run facades`) | Temporary yaml tree walk — replace when instance exists |

[`rigs/<slug>.SETUP.md`](../rigs/_TEMPLATE.SETUP.md) is **Rig DNA** — emailable viral artifact, not in the facade registry.

## Read order

1. [**VISION.md**](VISION.md) — long arc, hand-authored ([**on this page**](VISION.md#on-this-page) · girder [`vision-and-ambition.yml`](vision-and-ambition.yml))
2. [`GLANCE.yml`](GLANCE.yml) — one-screen map
3. [`INDEX.yml`](INDEX.yml) — every girder + markup link
4. [`markup-facades.yml`](markup-facades.yml) — registry + dependency graph
5. [`entryways.yml`](entryways.yml) · [**ENTRYWAYS.md**](../ENTRYWAYS.md) — playlists by interest

## Markup facade pattern

| Yaml (girder) | Markdown | Tier |
|---------------|----------|------|
| [`vision-and-ambition.yml`](vision-and-ambition.yml) | [**VISION.md**](VISION.md) | hand |
| [`crazy-idea-jam.yml`](crazy-idea-jam.yml) | [**CRAZY-IDEA-JAM.md**](CRAZY-IDEA-JAM.md) | hand |
| [`entryways.yml`](entryways.yml) | [**ENTRYWAYS.md**](../ENTRYWAYS.md) · [entryways/](entryways/) | hand |
| [`cross-links.yml`](cross-links.yml) | [**TRAILS.md**](../TRAILS.md) · [trails/](trails/) | hand |
| [`repo-show-format.yml`](repo-show-format.yml) | [`FORMAT.md`](FORMAT.md) | fallback → hand next |
| [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) | [`DRAG-RACE.md`](DRAG-RACE.md) | fallback |
| [`challenges/retrocomputing-drive.yml`](challenges/retrocomputing-drive.yml) | [`challenges/RETROCOMPUTING.md`](challenges/RETROCOMPUTING.md) | fallback |
| [`ai-offs.yml`](ai-offs.yml) | [`AI-OFFS.md`](AI-OFFS.md) | fallback |
| [`manual-transmission.yml`](manual-transmission.yml) | [`MANUAL-TRANSMISSION.md`](MANUAL-TRANSMISSION.md) | fallback |
| [`orchestration-gold.yml`](orchestration-gold.yml) | [`ORCHESTRATION-GOLD.md`](ORCHESTRATION-GOLD.md) | fallback |
| [`brain-stream.yml`](brain-stream.yml) | [`BRAIN-STREAM.md`](BRAIN-STREAM.md) | fallback |
| [`homefun-grading.yml`](homefun-grading.yml) | [`HOMEFUN.md`](HOMEFUN.md) | fallback |

```bash
pnpm run facades        # refresh fallback entries only (skips instance-first)
pnpm run facades:check  # CI — stale fallback facades with GENERATED banner
```

**Cross-links:** [`cross-links.yml`](../cross-links.yml) — narrative trails (`retrocomputing_drive`, `retro_guests_real_wire`, …)

## Clusters

### Show format & network

- [`FORMAT.md`](FORMAT.md) — how a Repo Show runs
- [**Performance Space**](performance-space/README.md) — play-along, puppetry, OBS/webcam toys (top-level design)
- [`showmaker-network.yml`](showmaker-network.yml) — linked shows graph
- [`live-repo.yml`](live-repo.yml) — public vs DonHopkins private
- [`sync-with-donhopkins.yml`](sync-with-donhopkins.yml) — export policy

### AI competition & rigs

- [`DRAG-RACE.md`](DRAG-RACE.md) — Micropolis AI Drag Race variety show
- [`AI-OFFS.md`](AI-OFFS.md) — spend proof, post-run forensics
- [`MANUAL-TRANSMISSION.md`](MANUAL-TRANSMISSION.md) — smallest model / fewest tokens to code the spec
- [`stick-shift-protocol.yml`](stick-shift-protocol.yml) — shift = commit
- [`rig-feedback.yml`](rig-feedback.yml) — declare your stack
- [`../rigs/`](../rigs/README.md) — rig yaml + SETUP DNA

### Retrocomputing challenges

- [`challenges/`](challenges/README.md) — Apple ][, PDP-10 ITS, Lisp Machine hack-off
- [`challenges/RETROCOMPUTING.md`](challenges/RETROCOMPUTING.md) — umbrella + rig SETUP requirement

### Education & training signal

- [`HOMEFUN.md`](HOMEFUN.md) — Micropolis Class grading
- [`ORCHESTRATION-GOLD.md`](ORCHESTRATION-GOLD.md) — multi-LLM traces as gold

### Live production

- [`BRAIN-STREAM.md`](BRAIN-STREAM.md) — Cursor thinking on overlay
- [`model-branching.yml`](model-branching.yml) — fork chat at bubble

### Vision

- [**VISION.md**](VISION.md) — hand-authored long arc (instance-first; edit markdown, not `pnpm facades`)
  - [Lineage](VISION.md#lineage) · [Pyramid](VISION.md#pyramid) · [Who this is for](VISION.md#who-this-is-for) · [Long Now and Later](VISION.md#long-now-and-later) · [Navigate](VISION.md#navigate)
- [`vision-and-ambition.yml`](vision-and-ambition.yml) — yaml girder
- [**CRAZY-IDEA-JAM.md**](CRAZY-IDEA-JAM.md) · [`crazy-idea-jam.yml`](crazy-idea-jam.yml) — ideas reactor

## Up · Across · Down

| Direction | Go |
|-----------|-----|
| Up | [`../README.md`](../README.md) · [`../GLANCE.yml`](../GLANCE.yml) |
| Across | [`../repo-shows/`](../repo-shows/README.md) · [`../characters/`](../characters/README.md) · [`../skills/repo-show/`](../skills/repo-show/README.md) |
| Down | [`challenges/README.md`](challenges/README.md) · [`../schemas/README.md`](../schemas/README.md) |

## MOOLLM

[`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml)

---

## Museum map

Twelve doorways — ordered playlists. Full pages: [**ENTRYWAYS.md**](../ENTRYWAYS.md) · [`entryways/`](entryways/README.md) · [**TRAILS.md**](../TRAILS.md) · [`trails/`](trails/README.md)

| Doorway | Page | CTA |
|---------|------|-----|
| **guest_will** | [guest-will.md](entryways/guest-will.md) | Will's invitation thread |
| **guest_any** | [guest-any.md](entryways/guest-any.md) | Any guest's path |
| **player** | [player.md](entryways/player.md) | 1996 talk — no git |
| **watcher** | [watcher.md](entryways/watcher.md) | FORMAT first |
| **for_bots** | [for-bots.md](entryways/for-bots.md) | FOR-BOTS.md → one ENTRYWAY |
| **hacker** | [hacker.md](entryways/hacker.md) | `pnpm verify` |
| **ai_coder** | [ai-coder.md](entryways/ai-coder.md) | Declare rig honestly |
| **retro** | [retro.md](entryways/retro.md) | SETUP DNA required |
| **educator** | [educator.md](entryways/educator.md) | Will 1996 → Papert/Kay |
| **archivist** | [archivist.md](entryways/archivist.md) | Provenance → primary sources |
| **producer** | [producer.md](entryways/producer.md) | Run your Repo Show |
| **publisher** | [publisher.md](entryways/publisher.md) | VISION + verify |

Pick one doorway; follow numbered stops; leap sideways via [trails](../TRAILS.md) when a topic hooks you.

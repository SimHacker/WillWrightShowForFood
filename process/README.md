# process/ — protocol girders + generated markup facades

**Yaml is source of truth** — compact machine-readable data; may declare includes and references; updates propagate like a dependency graph.

**Markdown is the human view** — lazily generated markup facades. **Do not edit registered `*.md` by hand** — edit yaml and regenerate, or re-invoke an LLM with the facade map.

**Two renderers (instance-first phase):**

| Renderer | Role |
|----------|------|
| **LLM** (target quality) | Reads yaml + `depends_on` + optional `render` profile — tone, merge, empathic prose |
| **Deterministic** (`pnpm run facades`) | Cheap PyYAML tree walk — tables and headings; good for bulk refresh and CI |

[`rigs/<slug>.SETUP.md`](../rigs/_TEMPLATE.SETUP.md) is **Rig DNA** — emailable viral artifact, not in the facade registry. May be LLM-authored initially; then maintained as standalone DNA, not bulk-regenerated with `pnpm facades`.

## Read order

1. [`VISION.md`](VISION.md) — long arc (generated from [`vision-and-ambition.yml`](vision-and-ambition.yml))
2. [`GLANCE.yml`](GLANCE.yml) — one-screen map
3. [`INDEX.yml`](INDEX.yml) — every girder + markup link
4. [`markup-facades.yml`](markup-facades.yml) — registry + dependency graph
5. [`entryways.yml`](entryways.yml) · [**ENTRYWAYS.md**](../ENTRYWAYS.md) — playlists by interest

## Markup facade pattern

| Yaml (girder) | Markdown (generated view) |
|---------------|---------------------------|
| [`repo-show-format.yml`](repo-show-format.yml) | [`FORMAT.md`](FORMAT.md) |
| [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) | [`DRAG-RACE.md`](DRAG-RACE.md) |
| [`challenges/retrocomputing-drive.yml`](challenges/retrocomputing-drive.yml) | [`challenges/RETROCOMPUTING.md`](challenges/RETROCOMPUTING.md) |
| [`ai-offs.yml`](ai-offs.yml) | [`AI-OFFS.md`](AI-OFFS.md) |
| [`manual-transmission.yml`](manual-transmission.yml) | [`MANUAL-TRANSMISSION.md`](MANUAL-TRANSMISSION.md) |
| [`orchestration-gold.yml`](orchestration-gold.yml) | [`ORCHESTRATION-GOLD.md`](ORCHESTRATION-GOLD.md) |
| [`brain-stream.yml`](brain-stream.yml) | [`BRAIN-STREAM.md`](BRAIN-STREAM.md) |
| [`homefun-grading.yml`](homefun-grading.yml) | [`HOMEFUN.md`](HOMEFUN.md) |

```bash
pnpm run facades        # regenerate stale or all (--force)
pnpm run facades:check  # CI — fail if yaml newer than md
```

Schema: [`../schemas/markup-facade.yml`](../schemas/markup-facade.yml)

**Cross-links:** [`cross-links.yml`](../cross-links.yml) — narrative trails (`retrocomputing_drive`, `retro_guests_real_wire`, …)

## Clusters

### Show format & network

- [`FORMAT.md`](FORMAT.md) — how a Repo Show runs
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

- [`VISION.md`](VISION.md) · [`vision-and-ambition.yml`](vision-and-ambition.yml)

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

# process/ — protocol girders + human markdown facades

**Yaml is source of truth for machines** — compact data; dependency graph; MOOLLM and CI read yaml.

**Markdown is the human view** — hand-authored dossiers for navigation and onboarding. **Yaml→md (`pnpm facades`) is a temporary fallback** for a few legacy entries until replaced.

## Instance-first vs kebab-case

| Tier | Pattern | Examples | Edit |
|------|---------|----------|------|
| **Instance-first** (hand, special names) | `foo-bar.yml` → `SPECIAL.md` | [VISION.md](VISION.md) · [CRAZY-IDEA-JAM.md](CRAZY-IDEA-JAM.md) · [ENTRYWAYS.md](../ENTRYWAYS.md) · [TRAILS.md](../TRAILS.md) | Edit the `.md`; sync yaml girder |
| **Kebab-case facades** (hand index docs) | `foo-bar.yml` → `foo-bar.md` | [ticket-pr.md](ticket-pr.md) · [guest-participation-ladder.md](guest-participation-ladder.md) · [moollm-stage.md](moollm-stage.md) · … | Edit the `.md`; sync yaml girder |
| **Fallback** (script dump) | `pnpm run facades` | [FORMAT.md](FORMAT.md) · [DRAG-RACE.md](DRAG-RACE.md) · [HOMEFUN.md](HOMEFUN.md) · … | Replace with hand doc; flip registry |

Registry + priority queue: [`markup-facades.yml`](markup-facades.yml) · human index: [`markup-facades.md`](markup-facades.md) · schema: [`../schemas/markup-facade.yml`](../schemas/markup-facade.yml)

**Two renderers:**

| Renderer | Role |
|----------|------|
| **Hand-authored** (default) | LLM + human edit — link-rich, readable |
| **Deterministic** (`pnpm run facades`) | Temporary yaml tree walk — replace when instance exists |

[`rigs/<slug>.SETUP.md`](../rigs/_TEMPLATE.SETUP.md) is **Rig DNA** — emailable viral artifact, not in the facade registry.

## Read order

1. [**VISION.md**](VISION.md) — long arc ([**on this page**](VISION.md#on-this-page) · girder [`vision-and-ambition.yml`](vision-and-ambition.yml))
2. [**GLANCE.md**](GLANCE.md) — one-screen map (machine: [`GLANCE.yml`](GLANCE.yml))
3. [**INDEX.md**](INDEX.md) — every girder + markup link (machine: [`INDEX.yml`](INDEX.yml))
4. [**markup-facades.md**](markup-facades.md) — registry + dependency graph
5. [**ENTRYWAYS.md**](../ENTRYWAYS.md) · [`entryways/`](entryways/) — playlists by interest

## Read / Girder — complete table

### Meta & navigation

| Read | Girder |
|------|--------|
| [README.md](README.md) | — |
| [CARD.md](CARD.md) | [`CARD.yml`](CARD.yml) |
| [GLANCE.md](GLANCE.md) | [`GLANCE.yml`](GLANCE.yml) |
| [INDEX.md](INDEX.md) | [`INDEX.yml`](INDEX.yml) |
| [markup-facades.md](markup-facades.md) | [`markup-facades.yml`](markup-facades.yml) |
| [ENTRYWAYS.md](../ENTRYWAYS.md) · [entryways/](entryways/) | [`entryways.yml`](entryways.yml) |
| [TRAILS.md](../TRAILS.md) · [trails/](trails/) | [`cross-links.yml`](cross-links.yml) |
| [FOR-BOTS.md](../FOR-BOTS.md) | [`for-bots.yml`](for-bots.yml) · [for-bots.md](for-bots.md) |

### Show format & network

| Read | Girder |
|------|--------|
| [FORMAT.md](FORMAT.md) | [`repo-show-format.yml`](repo-show-format.yml) |
| [ticket-pr.md](ticket-pr.md) | [`ticket-pr.yml`](ticket-pr.yml) |
| [play-along-skills.md](play-along-skills.md) | [`play-along-skills.yml`](play-along-skills.yml) |
| [guest-participation-ladder.md](guest-participation-ladder.md) | [`guest-participation-ladder.yml`](guest-participation-ladder.yml) |
| [couple-and-solo-shows.md](couple-and-solo-shows.md) | [`couple-and-solo-shows.yml`](couple-and-solo-shows.yml) |
| [participation-funnels.md](participation-funnels.md) | [`participation-funnels.yml`](participation-funnels.yml) |
| [performance-space/README.md](performance-space/README.md) · [performance-space.md](performance-space.md) | [`performance-space.yml`](performance-space.yml) |
| [showmaker-network.md](showmaker-network.md) | [`showmaker-network.yml`](showmaker-network.yml) |
| [live-repo.md](live-repo.md) | [`live-repo.yml`](live-repo.yml) |
| [sync-with-donhopkins.md](sync-with-donhopkins.md) | [`sync-with-donhopkins.yml`](sync-with-donhopkins.yml) |
| [party-roster.md](party-roster.md) | [`party-roster.yml`](party-roster.yml) |
| [repo-show-regulars.md](repo-show-regulars.md) | [`repo-show-regulars.yml`](repo-show-regulars.yml) |
| [repo-show-branding.md](repo-show-branding.md) | [`repo-show-branding.yml`](repo-show-branding.yml) |
| [character-colocation.md](character-colocation.md) | [`character-colocation.yml`](character-colocation.yml) |
| [repo-show-class-naming.md](repo-show-class-naming.md) | — |

### Production formats

| Read | Girder |
|------|--------|
| [one-minute-intense.md](one-minute-intense.md) | [`one-minute-intense.yml`](one-minute-intense.yml) |
| [one-minute-movie-sandwich.md](one-minute-movie-sandwich.md) | [`one-minute-movie-sandwich.yml`](one-minute-movie-sandwich.yml) |
| [youtube-bridge-skill.md](youtube-bridge-skill.md) | [`youtube-bridge-skill.yml`](youtube-bridge-skill.yml) |
| [sims-play-along-narration.md](sims-play-along-narration.md) | [`sims-play-along-narration.yml`](sims-play-along-narration.yml) |
| [moollm-stage.md](moollm-stage.md) | [`moollm-stage.yml`](moollm-stage.yml) |
| [storymaker-stories-and-scenes.md](storymaker-stories-and-scenes.md) | [`storymaker-stories-and-scenes.yml`](storymaker-stories-and-scenes.yml) |
| [lift-pipeline.md](lift-pipeline.md) | [`lift-pipeline.yml`](lift-pipeline.yml) |
| [email-attachment-curation.md](email-attachment-curation.md) | [`email-attachment-curation.yml`](email-attachment-curation.yml) |

### AI competition & rigs

| Read | Girder |
|------|--------|
| [DRAG-RACE.md](DRAG-RACE.md) | [`micropolis-ai-drag-race.yml`](micropolis-ai-drag-race.yml) |
| [code-that-spec.md](code-that-spec.md) | [`code-that-spec.yml`](code-that-spec.yml) |
| [AI-OFFS.md](AI-OFFS.md) | [`ai-offs.yml`](ai-offs.yml) |
| [MANUAL-TRANSMISSION.md](MANUAL-TRANSMISSION.md) | [`manual-transmission.yml`](manual-transmission.yml) |
| [stick-shift-protocol.md](stick-shift-protocol.md) | [`stick-shift-protocol.yml`](stick-shift-protocol.yml) |
| [rig-feedback.md](rig-feedback.md) | [`rig-feedback.yml`](rig-feedback.yml) |
| [model-branching.md](model-branching.md) | [`model-branching.yml`](model-branching.yml) |
| [BRAIN-STREAM.md](BRAIN-STREAM.md) | [`brain-stream.yml`](brain-stream.yml) |
| [ORCHESTRATION-GOLD.md](ORCHESTRATION-GOLD.md) | [`orchestration-gold.yml`](orchestration-gold.yml) |
| [HOMEFUN.md](HOMEFUN.md) | [`homefun-grading.yml`](homefun-grading.yml) |
| [../rigs/](../rigs/README.md) | rig yaml + SETUP DNA |

### Retrocomputing

| Read | Girder |
|------|--------|
| [challenges/RETROCOMPUTING.md](challenges/RETROCOMPUTING.md) | [`challenges/retrocomputing-drive.yml`](challenges/retrocomputing-drive.yml) |
| [challenges/README.md](challenges/README.md) | [`challenges/`](challenges/) |
| [apple2-emulator-stack.md](apple2-emulator-stack.md) | [`apple2-emulator-stack.yml`](apple2-emulator-stack.yml) |
| [apple2-fujinet-bridge.md](apple2-fujinet-bridge.md) | [`apple2-fujinet-bridge.yml`](apple2-fujinet-bridge.yml) |
| [pdp10-its-stack.md](pdp10-its-stack.md) | [`pdp10-its-stack.yml`](pdp10-its-stack.yml) |
| [lisp-machine-stack.md](lisp-machine-stack.md) | [`lisp-machine-stack.yml`](lisp-machine-stack.yml) |

### Vision & themes

| Read | Girder |
|------|--------|
| [VISION.md](VISION.md) | [`vision-and-ambition.yml`](vision-and-ambition.yml) |
| [CRAZY-IDEA-JAM.md](CRAZY-IDEA-JAM.md) | [`crazy-idea-jam.yml`](crazy-idea-jam.yml) |
| [CHARACTER-ENDOSYMBIOSIS.md](CHARACTER-ENDOSYMBIOSIS.md) | [`character-endosymbiosis.yml`](character-endosymbiosis.yml) |
| [old-band-back-together.md](old-band-back-together.md) | [`old-band-back-together.yml`](old-band-back-together.yml) |
| [constructionist-simcity-response.md](constructionist-simcity-response.md) | [`constructionist-simcity-response.yml`](constructionist-simcity-response.yml) |
| [sims-creator-network-exodus.md](sims-creator-network-exodus.md) | [`sims-creator-network-exodus.yml`](sims-creator-network-exodus.yml) |
| [maxis-history-collaborators.md](maxis-history-collaborators.md) | [`maxis-history-collaborators.yml`](maxis-history-collaborators.yml) |
| [spore-rethinks-multiplayer-time-ownership.md](spore-rethinks-multiplayer-time-ownership.md) | — |

### Concepts & economy

| Read | Girder |
|------|--------|
| [artifactory.md](artifactory.md) | [`artifactory.yml`](artifactory.yml) |
| [artifactorio.md](artifactorio.md) | [`artifactorio.yml`](artifactorio.yml) |
| [moola.md](moola.md) | [`moola.yml`](moola.yml) |
| [simulated-art-opening.md](simulated-art-opening.md) | [`simulated-art-opening.yml`](simulated-art-opening.yml) |
| [art-thief-game.md](art-thief-game.md) | [`art-thief-game.yml`](art-thief-game.yml) |
| [auto-art-theft-grand.md](auto-art-theft-grand.md) | [`auto-art-theft-grand.yml`](auto-art-theft-grand.yml) |
| [licensing-micropolis-enterprise.md](licensing-micropolis-enterprise.md) | [`licensing-micropolis-enterprise.yml`](licensing-micropolis-enterprise.yml) |

```bash
pnpm run facades        # refresh fallback entries only (skips instance-first)
pnpm run facades:check  # CI — stale fallback facades with GENERATED banner
```

## Clusters (quick links)

### Show format & network

- [FORMAT.md](FORMAT.md) · [ticket-pr.md](ticket-pr.md) · [play-along-skills.md](play-along-skills.md)
- [**Performance Space**](performance-space/README.md) · [showmaker-network.md](showmaker-network.md)
- [live-repo.md](live-repo.md) · [sync-with-donhopkins.md](sync-with-donhopkins.md)

### AI competition & rigs

- [DRAG-RACE.md](DRAG-RACE.md) · [AI-OFFS.md](AI-OFFS.md) · [MANUAL-TRANSMISSION.md](MANUAL-TRANSMISSION.md)
- [stick-shift-protocol.md](stick-shift-protocol.md) · [rig-feedback.md](rig-feedback.md)

### Retrocomputing

- [challenges/](challenges/README.md) · [challenges/RETROCOMPUTING.md](challenges/RETROCOMPUTING.md)

### Education & training

- [HOMEFUN.md](HOMEFUN.md) · [ORCHESTRATION-GOLD.md](ORCHESTRATION-GOLD.md)

### Live production

- [BRAIN-STREAM.md](BRAIN-STREAM.md) · [model-branching.md](model-branching.md) · [performance-space/README.md](performance-space/README.md)

### Vision

- [**VISION.md**](VISION.md) · [**CRAZY-IDEA-JAM.md**](CRAZY-IDEA-JAM.md) · [old-band-back-together.md](old-band-back-together.md)

## Up · Across · Down

| Direction | Go |
|-----------|-----|
| Up | [`../README.md`](../README.md) · [`../GLANCE.yml`](../GLANCE.yml) |
| Across | [`../repo-shows/`](../repo-shows/README.md) · [`../characters/`](../characters/README.md) · [`../skills/repo-show/`](../skills/repo-show/README.md) |
| Down | [`challenges/README.md`](challenges/README.md) · [`../schemas/README.md`](../schemas/README.md) |

## MOOLLM

[CARD.md](CARD.md) · [GLANCE.md](GLANCE.md) · [INDEX.md](INDEX.md)

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

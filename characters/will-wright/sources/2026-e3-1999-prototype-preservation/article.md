# The Sims prototype preservation — E3 1999 music & missing builds

*Email thread: Jerry Martin ↔ Phil Ramsey (philarchiverunlimited) ↔ Don Hopkins, Feb–Mar 2026. Raw: [`re-e3-1999-music.txt`](../../../../DonHopkins/temp/old-email/re-e3-1999-music.txt).*

---

## What preservationists are hunting

| Build | Status (Mar 2026) | Notes |
|-------|-------------------|-------|
| Steering committee **Jun 1998** | Public (Hidden Palace Oct 2024) | [IA](https://archive.org/details/the-sims-steering-committee) · [playthrough show](../../../../repo-shows/will-wright/sims-team-steering-committee-playthrough/SHOW.yml) |
| **Jan 1999** alpha | Thrift store Seattle find | No music in build; furniture from intro video |
| **E3 1999** | Missing | **Music especially wanted** — Jerry Martin era |
| **Jefferson 1997** | Missing | Post-Dollhouse name |
| Mac **1995–96** demos | Missing | |
| Free download demo (Reddit claim) | Unverified | Father worked at Maxis? — may be hoax |

## Missing content inside shipped game

Researchers recovering assets from protos:

- Intro/trailer **skins** (partially recovered)
- First **child** sim never shipped
- **Pink car** from intro video (originally SC3K asset)
- Furniture seen only in startup video — slow to convert for retail Sims 1

## Don's pointers (Mar 2026)

Modern tooling path — not retail binaries in git:

| Tool | URL |
|------|-----|
| **SimObliterator Suite** | https://github.com/DnfJeff/SimObliterator_Suite |
| **VitaMoo** (WebGL characters) | https://github.com/DnfJeff/SimObliterator_Suite/tree/main/vitamoo |
| Live demo | https://vitamoo.space |
| Sim Obliterator designs | https://github.com/SimHacker/moollm/tree/main/designs/sim-obliterator |

**`.msh` / `.skn` viewing:** VitaMoo loads skeletons/meshes/animations in browser. Prototype builds use **`.msh`** for sims; retail uses **`.skn`**. Phil (Mar 2026) wants **Collada/OBJ export for Blender** — VitaMoo is a renderer/player, not a mesh exporter (Don pointed to SimObliterator for tooling direction).

**"Crazy Larry"** — hidden NPC buried in prototype meshes; Phil discovered independently (Mar 2026), textures recovered from both Jan 1999 + steering builds.

## Jerry Martin connection

Jerry ("Boom Bam Boom") looped Don in when Phil asked about **E3 1999 prototype music**. Don may hold or know of original-era audio not in public protos — check Don archive disks.

Character: [`../../../../jerry-martin/`](../../../../jerry-martin/README.md) (if exists) · epithet in [Jess Bird roster](../../../../DonHopkins/projects/willwrightshowforfood/research/../../characters/will-wright/sources/jess-bird-bbc-email-2025.yml)

## Thrift-store provenance guess

Phil Ramsey theorizes Jan 1999 disc + yard-sale PC screenshot = ex-Maxis/EA employee disposing of work copies — same pattern as steering committee leak (kind release vs sold).

## Policy

Link Hidden Palace / TCRF; do not host leaked `.exe` in WWSFF git. On-air play with commentary OK.

## Gaps

- [ ] Don: search archive for E3 1999 audio / build artifacts
- [ ] Article with Jerry Martin on scoring early Sims builds
- [x] Stub [`1999-01-06-sims-alpha-prototype/`](../1999-01-06-sims-alpha-prototype/README.md) — Hidden Palace links
- [ ] VitaMoo: document `.msh` → Blender workflow or export path for preservationists


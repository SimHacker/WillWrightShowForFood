# Ground-o-matic (né Voxomatic) — procedural star fort / terrain CA engine

**Status:** located · **Episode:** infodump 001-star-forts · **Live demo:** load-bearing beat #3

Working name for the de-brand: **Ground-o-matic** (`vox` → `ground`). The `-o-matic` suffix survives; only the client-era prefix gets shaved.

## Where it lives

| What | Path |
|------|------|
| Repo | `/Users/a2deh/GroundUp/Gallium/git/voxomatic` |
| Star fort op | `voxcraft/Assets/_Scripts/Vox/OpStarFort.cs` (mirror: `voxoview/Assets/Scripts/Scam/Ops/OpStarFort.cs`) |
| CA pipeline | `Scam` — layered cellular-automata-style terrain ops (`OpBlur`, `OpDLA`, `OpTerraces`, `OpStarFort`, …) |
| Viewer scene | `voxoview/Assets/Scenes/TerrainScene.unity` |
| Design notes | `Gallium/miro/Star Fort Generator.csv` |
| Example terrain data | `voxoview/Assets/StreamingAssets/VoxWorld/` |
| Python sheet tooling | `voxomatic/voxomatic.py` + `scam.py` (Google Sheets → terrain; **exclude from public repo**) |

Two Unity projects in one repo:

- **voxcraft** — authoring / op-chain tooling (voxel world + `VoxGenerator`)
- **voxoview** — terrain viewer + demo scenes (full `Scam` op tree in the Inspector)

Don described it to Will (2026-07-10) as *"that terrain generation game"* — this is it.

## What OpStarFort does

Procedural bastion outline carved into an elevation layer:

- Parameterized `sides`, `radius`, `protrude`, `gap`, `lift`, `sink`, `small`
- For each bastion point: draw lifted rampart lines (outer ring) and sunken lines (inner ring)
- Trace-italienne star geometry from angular math — SimCity-adjacent shape grammar on a heightfield

Pairs with Cyclopaedia fortification plate in the infodump sermon. Whole star-fort planet is plausible once the pipeline runs again.

## Why Don built it

Collaboration with **Will Wright** on **cellular automata terrain** — the real work. Commercial wrapper was NFT-era terrain tooling for a web3 company Don would rather not remember; he took the gig to **work with Will again**, not because he believed in get-rich-quick schemes.

Will said their business model didn't work out (polite). Don rolls his eyes at Will kindly and lovingly; what was in it for Don was the collaboration. Vox (the company) and Unity reportedly licked a lot of self-licking ice cream cones — consulting money flowed; the product didn't stick.

**Forward, not backward.** Both need money; both do better by working together again — new favors, mutual, not ledger-keeping. Will's brand and trust in Don to promote it is worth more than a line item; it can improve both bottom lines, both teams, and the old band mates. Open-source the CA/terrain core, strip commercial cruft, sustain through shows + games + honest work (*get rich the hard way*).

## What the code actually is

Brutalist programmer's engine. You configure it by hanging **Unity `MonoBehaviour` ops** on a deep object tree and twiddling Inspector fields — no friendly wizard, no onboarding. That's the charm for a show demo; it's ugly on purpose.

Techniques interpenetrated in one stack:

| Technique | Where |
|-----------|--------|
| Cellular automata | `OpDLA`, `OpAnneal`, `OpBlur`, terraces, feather |
| Voronoi | `OpVoronoiSeed/Expand/Scan/Edges`, `VoronoiCell`, force-field lots |
| Image processing | layer save/load as `.bin` + false-color `.jpg` previews |
| Seat-of-pants hacking | `Scam` = op chain as scene graph; 38 ops in voxoview |
| Voxel meshing | `VoxelTerrain` renders heightfield + land-type layers |

**Performance:** large maps (planet scale) take time; smaller maps are interactive. Good for live demo at 256×256 or modest Voronoi regions; pre-bake for cold-open satellite zoom.

**NFT/web3 in this repo:** essentially none in the Unity C# — no wallet, mint, or chain strings found. The commercial wrapper lives mostly outside the fun part: Python `voxomatic/` Google Sheets pipeline (`VoxOMatic` spreadsheet, GCP service account `voxomatic@…`). Strip or don't publish that folder.

## Voxification audit (2026-07-10)

"Vox" branding is **shallow in code, deep in assets and folder names**. The engine itself is named **`Scam`** (terrain op chain) — already neutral.

### Tier 1 — explicit brand (easy rename)

| Item | Count | Notes |
|------|-------|-------|
| `VoxGenerator` class | 1 file | voxcraft entry point |
| `VoxLayerHandler` class | 1 file | block layer bridge |
| `Assets/_Scripts/Vox/` folder | 15 `.cs` files | op implementations; class names are `Op*` not `Vox*` |
| `README.html` title | 1 file | "Galium Vox Terrain Generator" (typo: Gallium) |

### Tier 2 — `VoxWorld` data prefix (medium rename)

| Item | Count | Notes |
|------|-------|-------|
| `StreamingAssets/VoxWorld/` directory | 1 | rename → `GroundWorld/` |
| `VoxWorld_*` data files | ~137 | `.json`, `.bin`, `.jpg`, `.png` |
| `TerrainScene.unity` path strings | 88 | `loadFileName` / `saveFileName` like `VoxWorld/Data/VoxWorld_Layer_…` |
| JSON `binFileName` fields | ~40 | e.g. `"VoxWorld_Layer_ElevationFlat.bin"` — must match renamed `.bin` files |
| Unity `.meta` GUIDs | ~274 | follow file renames (do in Unity Editor or scripted with care) |

`Layer.Load()` resolves paths as `StreamingAssets/{fileName}.json` then reads `binFileName` from JSON — **all three must stay consistent**.

### Tier 3 — project / repo names (structural)

| Current | Proposed |
|---------|----------|
| `voxomatic` (repo) | `groundomatic` |
| `voxcraft` | `groundcraft` |
| `voxoview` | `groundview` |
| `voxomatic/voxomatic.py` | `groundomatic/groundomatic.py` |
| `VoxOMatic` (sheet/project) | `GroundOMatic` |

### DO NOT touch (false positives)

Naive global `vox` → `ground` **will break**:

| Keep as-is | Why |
|------------|-----|
| `VoxelTerrain`, `voxelSize`, `voxelHeight` | technical term, not brand |
| `Voronoi*` | unrelated substring |
| `JToken` | Newtonsoft JSON |

### What's already clean

- Core op classes: `OpStarFort`, `OpDLA`, `Scam`, `Layer`, `VoronoiCell` — no Vox in names
- voxoview `Scam/Ops/`: 38 ops, zero `VoxWorld` in C# (paths only in serialized scene)
- No NFT/web3 strings in Unity assets searched

## Rebrand: `vox` → `ground` blast radius

**Verdict:** targeted rename is **~1–2 days** of careful work; naive global sed is **unsafe**.

### Recommended mapping

```
VoxWorld      → GroundWorld
VoxGenerator  → GroundGenerator
VoxLayerHandler → GroundLayerHandler
Vox/          → Ground/
voxomatic     → groundomatic
voxcraft      → groundcraft
voxoview      → groundview
VoxOMatic     → GroundOMatic
Galium Vox    → Ground-o-matic   (fix Gallium typo too)
```

### Effort by layer

| Layer | Files touched | Risk | Method |
|-------|---------------|------|--------|
| C# classes + folder | ~5 | low | rename + Unity recompile |
| `TerrainScene.unity` | 1 | medium | search-replace `VoxWorld` → `GroundWorld` |
| StreamingAssets | ~137 + meta | medium | bulk rename + fix JSON `binFileName` |
| Project folders | 3 | medium | rename dirs, fix `.sln`/`.csproj` paths |
| Python wrapper | 2–3 | low | optional; may omit from public repo entirely |
| `voxomatic/venv/` | 54k files | **exclude** | never publish; gitignore |

### Simpler alternative for ep 001

Extract **minimal demo** without full rebrand:

1. Copy `OpStarFort` + `Scam` deps into a fresh Unity project
2. One scene, one heightfield, no `VoxWorld` cached layers
3. Brand the *repo README* as Ground-o-matic; leave Gallium paths internal until full pass

Full sanitize before GitHub public; demo fork can ship earlier for the show.

## Monorepo pull-in (when ready)

Not yet moved out of Gallium — when it's time, pull into a proper monorepo home (MicropolisCore org or sibling) with Don's usual Unity layout:

- Per-project `.gitignore` — `Library/`, `Temp/`, `Obj/`, `Logs/`, autogenerated `*.csproj`/`*.sln`, IDE cruft; keep `Assets/` + `ProjectSettings/` + `Packages/manifest.json`
- Root gitignore for `venv/`, credentials, client sheet IDs, Unity crash dumps
- `apps/groundview` + `apps/groundcraft` (or `packages/scam-core` shared lib) — names TBD at pull-in
- README that lets strangers clone, open one scene, generate a star fort without reading the whole op tree
- Something that **actually works**, however brutalist — reusable substrate others can build on

The Gallium tree is the prototype attic; the monorepo copy is the front door.

## Open source

| Field | Value |
|-------|-------|
| Permission | Will granted Don permission to publish (months/years ago — Don attestation) |
| License intent | Open source (TBD: MIT or Apache-2.0 after de-brand pass) |
| Publish | CA/terrain core (`voxoview` + `voxcraft` Scam pipeline) |
| Exclude | `voxomatic/venv/`, `credentials.json`, GCP service accounts, `.clasp.json`, client sheet IDs |

### De-brand checklist (before public repo)

- [ ] Targeted `Vox*` → `Ground*` rename (not global `vox` sed)
- [ ] Rename `VoxWorld/` → `GroundWorld/` + fix 88 scene paths + JSON `binFileName`
- [ ] Rename project folders (`voxcraft`/`voxoview`/`voxomatic`)
- [ ] Rewrite `README.html` → Ground-o-matic; fix Gallium typo
- [ ] Drop or quarantine `voxomatic/` Python + Google Sheets wrapper
- [ ] Fresh root README: CA terrain pipeline + OpStarFort, credit Will collaboration
- [ ] Confirm Unity opens `TerrainScene.unity` clean after rename
- [ ] Optional: minimal star-fort-only demo for infodump ep 001

## Usability (honest)

- Configuration = Unity hierarchy of op components + Inspector sliders
- No player-facing UI; programmer-facing only
- Fun to show off *because* it's brutalist — blind watchmaker energy
- Needs love: progress feedback on long runs, preset scenes, doc the op chain

## Show connections

- `repo-shows/infodump.yml` — ep 001, beat: procedural generator demo (EVAL ⇔ APPLY)
- Don → Will email: `DonHopkins/characters/don-hopkins/correspondence/attachments/will-wright/2026-07-10-star-forts-parker.md`
- Miro pitch deck rows: zombie-proof enclaves, blind watchmaker UI, billions of snowflakes

## Next steps

1. Confirm Unity version opens `TerrainScene.unity` clean (baseline before rename)
2. Screen-record star fort reveal (satellite zoom → full star — cold open match)
3. Targeted Ground-o-matic rename pass OR extract minimal ep-001 demo
4. Monorepo pull-in with standard Unity gitignores + layout (when ready — not blocking ep 001)
5. De-brand → GitHub public repo (MicropolisCore org or standalone `groundomatic`)
6. Link from infodump ep 001 show notes when demo URL exists

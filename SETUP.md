# SETUP — WillWrightShowForFood

Polyglot monorepo: **MOOLLM microworld content** (yaml-jazz, characters, repo-shows) +
**MicropolisCore-style** `apps/` + `packages/` (pnpm, TypeScript) + **Python** tooling (sync, validate).

Browse without logging in: [README.md](README.md) on GitHub. Clone to play along.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Git](https://git-scm.com/) | any recent | clone this repo |
| [Node.js](https://nodejs.org/) | ≥ 20 (`.nvmrc`: **22**) | `nvm install && nvm use` |
| [pnpm](https://pnpm.io/) | **10.28.0** | `corepack enable` (reads root `package.json`) |
| [Python](https://www.python.org/) | ≥ 3.10 | venv + `requirements.txt` |

Optional siblings (multi-root Cursor workspace — **recommended**):

| Repo | Role |
|------|------|
| [SimHacker/moollm](https://github.com/SimHacker/moollm) | Orchestrator + skills kernel |
| [SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore) | Engine + `@micropolis/*` packages |
| DonHopkins (private) | Authoritative export source → this public repo |

Suggested layout (matches Don Hopkins dev machine):

```
~/GroundUp/git/
  moollm/
  MicropolisCore/
  DonHopkins/
  WillWrightShowForFood/    ← you are here
```

---

## Quick start (content only — no Node/Python)

1. Open https://github.com/SimHacker/WillWrightShowForFood
2. Start at [README.md](README.md) → [repo-shows/will-wright/](repo-shows/will-wright/README.md)

No account required.

---

## Developer setup (full monorepo)

### 1. Node + pnpm

```bash
cd WillWrightShowForFood
nvm install && nvm use          # .nvmrc → 22
corepack enable
pnpm install
pnpm run verify                 # structure + YAML + coherence check
pnpm run setup:hooks            # pre-push hook → runs verify before every push
```

### 2. Python venv

```bash
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
pnpm run verify:yaml            # re-run with PyYAML available
```

Or one shot from repo root:

```bash
pnpm run setup:python
source .venv/bin/activate
```

### 3. MOOLLM multi-root (Cursor)

1. Clone `moollm` beside this repo (see table above).
2. **File → Add Folder to Workspace** — add both `moollm` and `WillWrightShowForFood`.
3. Agent reads `moollm` bootstrap first, then this repo's [GLANCE.yml](GLANCE.yml) + [MOOLLM.yml](MOOLLM.yml).
4. Optional: add `MicropolisCore` for engine work during shows.

Copy runtime scratch from moollm bootstrap templates (gitignored):

```bash
# From moollm repo after clone:
mkdir -p ../WillWrightShowForFood/.moollm
cp skills/bootstrap/templates/hot.yml ../WillWrightShowForFood/.moollm/hot.yml
```

---

## Repository layout

```
WillWrightShowForFood/
├── MOOLLM.yml / CARD.yml / GLANCE.yml   # microworld manifests (moollm pattern)
├── README.md / SETUP.md                 # human entry points
├── repo-shows/                          # show instances (Will kickoff + seeds)
├── characters/                          # guest + host portrayals
├── kernel/                              # moollm-plugin.yml — composition rules
├── schemas/ process/ skills/ examples/  # metadata, sync, harvested skills, demos
├── apps/                                # future SvelteKit apps, stream tools, adventure UI
├── packages/                            # @wwsff/* shared libs (tooling stub today)
├── scripts/                             # verify-monorepo-structure, verify-yaml
├── package.json / pnpm-workspace.yaml   # Node workspace (MicropolisCore pattern)
└── requirements.txt                     # Python deps
```

**Two layers:**

| Layer | Pattern source | What lives here |
|-------|----------------|-----------------|
| Content microworld | moollm + DonHopkins plugin | yaml-jazz trees at repo root |
| Code monorepo | MicropolisCore + mooco | `apps/*`, `packages/*`, pnpm |

---

## Common commands

```bash
pnpm run verify              # structure + YAML + coherence
pnpm run build               # all workspace packages (stubs OK)
pnpm run test                # workspace tests (stubs OK)

pnpm --filter @wwsff/tooling run build
```

Future (when apps land):

```bash
pnpm --filter site dev
pnpm --filter stream-gateway dev
```

---

## Export / sync from DonHopkins

Private authoritative tree → filtered public projection. See:

- [MANIFEST.yml](MANIFEST.yml)
- [process/sync-with-donhopkins.yml](process/sync-with-donhopkins.yml)

DonHopkins plan: `projects/micropolis-moollm/process/wwsff-export-sync.yml`

---

## Visibility

Repo is **public** so Will (and anyone) can browse without a GitHub account. May stay open or
flip private briefly before a wider launch — his choice. Collaborator access optional when he
creates an account.

---

## Wanna chat?

[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues) or submit a PR.

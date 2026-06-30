# packages/

Shared libraries for the **evolving organism** — abstract reusable parts from show harvests
so other organisms (repos, shows, forks) can compose them.

**Person prose and media** stay in [`characters/`](../characters/README.md) ([`character-colocation.yml`](../process/character-colocation.yml)).
**Code** that generalizes across shows lands here.

| Layer | Path | What gets abstracted |
|-------|------|----------------------|
| **Skills** | [`../skills/`](../skills/README.md) | MOOLLM protocols, CARD/SKILL.md — agent + human runnable |
| **Packages** | `packages/*` | TypeScript, Python, WASM — `@wwsff/*` libs |

**Scoreboard:** we judge **cost to ship** (tokens, spend, time — efficiency vs extravagance)
AND **solution quality** (taste, power). Then **merge** the winner back via PR and **extract**
what's reusable here — don't leave genius on a dead branch.

| Package | Status |
|---------|--------|
| [`wwsff-tooling/`](wwsff-tooling/README.md) | Dev utilities stub (verify, future sync) |

Future packages may wrap [MicropolisCore](https://github.com/SimHacker/MicropolisCore) deps
(`@micropolis/sims-io`, `@micropolis/render-core`, …) as `@wwsff/*` adapters for Repo Show bridges.

Python packages can live here too (`packages/foo/pyproject.toml`) when we add them.

See [`../process/showmaker-network.yml`](../process/showmaker-network.yml#evolving_organism).

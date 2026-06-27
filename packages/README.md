# packages/

Shared libraries — TypeScript, Python (via `pyproject` later), WASM bindings, federation clients.

| Package | Status |
|---------|--------|
| [`wwsff-tooling/`](wwsff-tooling/) | Dev utilities stub (verify, future sync) |

Future packages may wrap [MicropolisCore](https://github.com/SimHacker/MicropolisCore) deps
(`@micropolis/sims-io`, `@micropolis/render-core`, …) as `@wwsff/*` adapters for Repo Show bridges.

Python packages can live here too (`packages/foo/pyproject.toml`) when we add them.

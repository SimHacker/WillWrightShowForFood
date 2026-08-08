# Selfish-config — TypeScript fragment composition (LATER)

**Status: note for a future Repo Show + MicropolisCore package — not building now.**

Port Leela `central`'s **worker config fragment composition** into a general-purpose TypeScript
module (`packages/selfish-config` in **MicropolisCore**, or folded into vitamoo). Makes the
filesystem object model's advisory `parents:` delegation **operational**.

## Semantics to capture

| Piece | Behavior |
|-------|----------|
| **Load** | Named JSON/YAML config fragments from disk |
| **Linearize** | Resolve `parents:` DAG via **C3 linearization** (Python MRO-style deterministic MI order — central's fragments assume this) |
| **Merge pass 1** | Deep-merge **slots** with local override + **provenance tracking** (which fragment each value came from) |
| **Merge pass 2** | Overlay hook mirroring central's `shards.yml` mechanism |
| **Vocabulary** | Drop Leela-specific worker/fleet terms; keep generic selfish inheritance |
| **Test** | Mirror `image-web-caddy` composition from central |

## Upstream references (Leela central)

| Artifact | Path |
|----------|------|
| Playbook PB-44 | `skills/gcs/protocols/pipeline-optimization/playbooks/PB-44-worker-config-fragment-composition.md` |
| Implementation | `packages/leela-cicd/src/leela_cicd/worker_config.py` (two-pass merge) |

## WWSFF cross-links (concept, not implementation)

| File | Mention |
|------|---------|
| [`../david-rosenthal/slots-all-the-way-down.md`](../david-rosenthal/slots-all-the-way-down.md) | Selfish inheritance in artifactory cosmology |
| [`../../process/spore-rethinks-multiplayer-time-ownership.md`](../../process/spore-rethinks-multiplayer-time-ownership.md) | Copying as medium |
| [`../palm/README.md`](../palm/README.md) | Monkey's Paw wishes |
| [`career/lineage.yml`](career/lineage.yml) | **self-ish** pun — Self-ish config, not selfish |

## MicropolisCore target

[`MicropolisCore/documentation/designs/filesystem-object-model.md`](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/filesystem-object-model.md) — `parents:` is currently **advisory**. This module makes prototype inheritance real in TS.

## Show seed

| Show seed | Status |
|-----------|--------|
| [`../../repo-shows/selfish-config-typescript/selfish-config-typescript.yml`](../../repo-shows/selfish-config-typescript/selfish-config-typescript.yml) | **later** — live port + test on air |

Dream guests: **David Rosenthal** (NeWS `$PATH` patent / slots thesis) · **David Ungar** (Self MI) · **David Levitt** (Pantomime JSON config lineage).

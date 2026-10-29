# Selfish-config — TypeScript fragment composition (LATER)

**Status: note for a future Repo Show + MicropolisCore package — not building now.**

Port Leela AI's internal **worker config fragment composition** into a general-purpose TypeScript
module (`packages/selfish-config` in **MicropolisCore**, or folded into vitamoo). Makes the
filesystem object model's advisory `parents:` delegation **operational**.

## Semantics to capture

| Piece | Behavior |
|-------|----------|
| **Load** | Named JSON/YAML config fragments from disk |
| **Linearize** | Resolve `parents:` DAG via **C3 linearization** (Python MRO-style deterministic MI order — the original fragments assume this) |
| **Merge pass 1** | Deep-merge **slots** with local override + **provenance tracking** (which fragment each value came from) |
| **Merge pass 2** | Overlay hook mirroring the original's shards overlay mechanism |
| **Vocabulary** | Drop Leela-specific worker/fleet terms; keep generic selfish inheritance |
| **Test** | Mirror `image-web-caddy` composition from the original |

## Upstream

The original is Leela AI's internal worker-config composition: a playbook and a two-pass merge
implementation, both private.

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
| [`../../repo-shows/selfish-config-typescript/README.md`](../../repo-shows/selfish-config-typescript/README.md) | **later** — live port + test on air |

Dream guests: **David Rosenthal** (NeWS `$PATH` patent / slots thesis) · **David Ungar** (Self MI) · **David Levitt** (Pantomime JSON config lineage).

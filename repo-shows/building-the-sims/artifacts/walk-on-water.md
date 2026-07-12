---
id: walk-on-water
title: "Walk on water"
hook: "Swimming Sims sometimes surfaced and walked on pool tiles like Jesus in isometric."
category: [pools, locomotion, qa]
status: qa
heat: medium
guests: [eric-bowman, jamie-doornbos]
---

# Walk on water

## Hook

Locomotion mode and pool-layer state disagree — Sim **walks** on water surface.

## Story

QA / dev observation: after surfacing from swim, Sim sometimes entered **walk** locomotion on pool
tiles instead of swim/wade — pool layer vs pathfinding bug.

## Ask on air

- Repro steps? Fixed or WAD?
- Pool tiles vs room ID in pathfinder?

## Sources

- [`../pool-qa.md`](../pool-qa.md)

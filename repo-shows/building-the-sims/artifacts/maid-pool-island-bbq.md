---
id: maid-pool-island-bbq
title: "Maid on pool island"
hook: "Maid dives in, swims to the island, cleans the BBQ, climbs back into the pool — then what?"
category: [maid, pools, pathfinding, qa-comedy]
status: unknown
heat: high
guests: [jamie-doornbos, eric-bowman, jim-mackraz]
---

# Maid service on a pool island

## Hook

Island in the middle of the pool, ladder from deck, diving board, BBQ that needs cleaning — the
maid **swims in**, cleans, **swims out**, and then…?

## Story

QA / player setup (Don's memory):

- Pool surrounds a small **island** tile cluster.
- **Ladder** from deck; **diving board**; **BBQ** on island needs clean interaction.
- Maid path: enter pool → swim to island → clean → re-enter pool to leave.

**Open:** Can she exit the pool afterward? Pathfinding trap? Service behavior bug? Expected?

## Ask on air

- Classification: fix, won't fix, or "Sims being Sims"?
- Does service AI understand pool layer vs room vs object destination?
- Any screenshot or bug ID in Jim's pile?

## Sources

- [`../pool-qa.md`](../pool-qa.md)
- [`../qa-bug-pile.md`](../qa-bug-pile.md)

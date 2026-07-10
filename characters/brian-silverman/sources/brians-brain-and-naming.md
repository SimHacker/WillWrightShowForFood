# Brian's Brain — rule, naming, and show use

## The rule

**Brian's Brain** is a **three-state** cellular automaton (Moore neighborhood, like Life and Seeds):

| State | Meaning (informal) |
|-------|-------------------|
| **off** | quiescent |
| **on** | firing |
| **dying** | refractory — not counted as "on" for birth |

**Update (each tick):**

1. A cell turns **on** if it was off and had exactly **two** on neighbors (Seeds-like birth).
2. All **on** cells become **dying**.
3. All **dying** cells become **off**.

Result: directional **waves**, prolific **spaceships**, messy **explosions**, occasional **oscillators**.
Often compared to neural refractory periods — the name invites that metaphor; Brian invented the
*dynamics*, the community supplied the *title*.

## Naming — he did not name it after his own brain

Don's note (and Brian's usual telling): Brian **devised** the rule; **others** called it **Brian's
Brain** — he did **not** pick a self-referential name. Wikipedia lists Brian Silverman as inventor;
the article title is the community convention.

**Show beat:** credit invention vs naming — same lesson as PIXIE "movable menu" mislabel in Newman &
Sproull.

## Sources

- [Brian's Brain — Wikipedia](https://en.wikipedia.org/wiki/Brian%27s_Brain)
- [Brian Silverman — Wikipedia](https://en.wikipedia.org/wiki/Brian_Silverman)
- Resnick & Silverman (1996). *Exploring Emergence: The Brain Rules.* MIT Media Lab.

## Repo hooks

- **Rudy Rucker** multiplexed Brain + Anneal + Life into **Eco!** — run in CAM6 beside pure Brain
- Run in **CAM6** / WebGPU beside **Life** and **Seeds**
- **Dave Tristram** — perform rule as live visuals
- **Norman Margolus** CA fest — Silverman rules row on the shelf

↑ [`../README.md`](../README.md) · [`../../repo-shows/brian-silverman-ca-logo-pdp7.yml`](../../repo-shows/brian-silverman-ca-logo-pdp7.yml)

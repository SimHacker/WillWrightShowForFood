# A Repo Show with Norman Margolus 🔲

> Cellular Automata Machines — reversible computing, CAM-6, and the physics of computation.

**Norman Margolus** (MIT CSAIL; PhD under Edward Fredkin) co-built the **CAM-6** cellular-automata
machine with **Tommaso Toffoli** and co-wrote ***Cellular Automata Machines*** (MIT Press, 1987) —
the book and hardware **Don's own CAM6 simulator** follows. He invented the **block cellular
automaton** + **Margolus neighborhood**, built **reversible, universal** CA (billiard-ball
computers, the Critters rule), and proved the **Margolus–Levitin theorem** — a physical speed limit
on computation. **Milan and Henry Minsky** (MIT AI Lab) introduced Norman to Don, who made a
[long-form CAM6 demo tailored for Norman](https://www.youtube.com/watch?v=LyLMHxRNuck) as the audience.

## Two acts

- **Act 1 — Play.** Bring up the existing **CAM6.js** live and run the classic rules from the book,
  with Norman narrating — including the **DLA / Margolus-dendrite** rule (p. 167, §15.7).
- **Act 2 — Design.** The code is an honest **monolith** with lovely bones to *cauldron out* — sketch
  a modern web version together.

## What we'd get into

- **CAM-6, live** — Don's CAM6.js: C+FORTH heritage; **rules defined in JS** → lookup tables (optional
  Forth extension in repo, not embedded), running classic rules straight from the book.
- **DLA / dendrite** — the Margolus-dendrite rule aggregating live on the same lookup-table contract.
- **The Margolus neighborhood** — how partitioning the grid makes a rule **reversible**.
- **Run it backward** — reversible, universal CA; the Critters rule; no information lost.
- **Billiard-ball computers** — universal computation from elastic collisions; the "Flattop" chip.
- **The Margolus–Levitin limit** — how fast can anything compute? Energy as the bound.
- **A CA summit** — with [Jim Crutchfield](../../characters/jim-crutchfield/README.md) (edge of chaos) and
  [Scott Draves](../../characters/scott-draves/README.md) (generative art).

## In this directory

- [`SHOW.yml`](SHOW.yml) — the show seed.
- [`invitation.md`](invitation.md) — the draft invitation (reached via Milan and Henry Minsky).

Guest: [`characters/norman-margolus/`](../../characters/norman-margolus/README.md). Consent **not yet asked** —
the natural bridge is [Milan and Henry Minsky](../../characters/henry-minsky/README.md). See also Don's
[CAM6.js writeup](../../characters/don-hopkins/cam6-cellular-automata-machine.md).

— Don Hopkins, Repo Show Class

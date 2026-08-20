# David Temkin — DOMIsland embedding (20 Aug 2026)

**Thread:** Don's Declare challenge → David's DOMIsland answer → Don's SimFaux follow-up  
**Span:** 13–20 August 2026

---

## Don Hopkins → David Temkin (13 Aug 2026, 04:27)

**Subject:** Here's a challenge for Declare!

Remember the OpenLaszlo pattern: import a Flash SWF from a mapping service, wrap it so it acts
Laszlo-friendly — constraints, data replication, instance-first programming.

Don wants the same for **Declare**, documented as skill/SDK/interfaces:

| Archetype | Target |
|-----------|--------|
| **HTML video** | play, record, screencast, WebRTC |
| **Slippery map** | the map Don uses in **eBike Safari** |
| **SimFaux** | reimplement more creatively than the OL original |

Goal: **PlugOver / PlugOn**, not PlugIn — embed foreign widgets as first-class Declare instances
with bidirectional data flow, not iframe soup.

Apps in scope:

- [`../../../apps/simfaux/`](../../../apps/simfaux/) — keyword-driven media dashboard
- [`../../../apps/ebike-safari/`](../../../apps/ebike-safari/) — interactive map platform with
  intertwingled games/utilities/guides as layers on the map

---

## David Temkin → Don (20 Aug 2026, 18:10)

**Subject:** Re: Here's a challenge for Declare!

> Your wish is my command! You can now do this (and it's even fancier than the OL version).

**DOMIsland** — Declare guide §18 Embedding:

https://davidtemkin.github.io/declarelang?apps/docs/docs.declare#guide/18-embedding

| Concept | Behavior |
|---------|----------|
| **Host** | Declare app embeds HTML content in an **"island"** |
| **Instance** | Embedded content declared as instance of type **`DOMIsland`** with instance-specific attributes |
| **Host → island** | Attribute changes arrive as **function calls** on the instance |
| **Island → host** | Embedded HTML can **push attribute changes** back to the host |
| **Declare POV** | Instance attributes act like **bidirectional constraints** |

David: *"Not sure I'm totally making sense, but I think this totally does what you need! Or should :-)"*

**Supersedes** the 3 Aug note that island embedding had *"limited connectivity today"* —
see [`2026-08-03-declare-constraints-thread.md`](2026-08-03-declare-constraints-thread.md).

---

## Don → David (20 Aug 2026, 18:57)

Will dig up **SimFaux** source — extensible drop-in widgets as a Declare demo.

SimFaux had **weighted decaying keywords**:

- word-cloud widget scaled to weight
- keywords **trigger** content to play
- keywords **emitted** by content (trigger ≠ emit → producer/consumer call/response)
- natural fit for LLM *"what do I do next"* loops

---

## Repo takeaways

| Topic | Action |
|-------|--------|
| **Declare guide §18** | Primary doc for DOMIsland API |
| **eBike Safari map** | First slippery-map wrapper candidate |
| **SimFaux** | Keyword graph + widget composability → Declare port |
| **Skill/SDK** | Don's original ask still open — patterns doc on top of DOMIsland |
| **OL lineage** | Flash SWF map wrapper → DOMIsland; same architectural bet |

## Related

- Aug 3 constraints thread: [`2026-08-03-declare-constraints-thread.md`](2026-08-03-declare-constraints-thread.md)
- Declare sniff: [`declarelang.md`](declarelang.md)
- SimFaux app: [`../../../apps/simfaux/README.md`](../../../apps/simfaux/README.md)
- eBike Safari platform: [`../../../apps/ebike-safari/design/map-game-platform.md`](../../../apps/ebike-safari/design/map-game-platform.md)

↑ [David Temkin README](../README.md) · [CHARACTER.yml](../CHARACTER.yml)

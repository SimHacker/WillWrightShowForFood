# Sugar OLPC multiplayer + centralized Laszlo client (exposition backlog)

**Status:** Tier 1 — article [`article.md`](article.md); OLPC thread split to `DonHopkins/temp/old-email/`.

## Thread A — Sugar / OLPC Micropolis multiplayer UI

**Planned** (documented in OLPC-era posts and big-prompts): deeply integrate Micropolis with Sugar — mesh networking, journaling, collaboration, Constructionist kid programming (Logo-style agents, new disasters), hardware-aware UI (XO flip-to-book mode, mono/color LCD).

| Source | Link |
|--------|------|
| Alan Kay thread | [`../2007-11-16-simcity-rules-alan-kay/`](../2007-11-16-simcity-rules-alan-kay/README.md) |
| Walter Bender show | [`../../../walter-bender-olpc.yml`](../../../walter-bender-olpc.yml) |
| SimCity open-source saga | [`../simcity-open-source-saga/`](../simcity-open-source-saga/README.md) |
| big-prompts Sugar quotes | DonHopkins `temp/big-prompts.txt` — "kid-friendly multi-player user interface" |

**Implemented (partial):** TCL/Tk Micropolis on XO; Python/GTK path; community forks — document what shipped vs vision.

## Thread B — Centralized multiplayer Laszlo content-catalog client

**Implemented:** Reusable Laszlo DB browser/editor talking to **Python/SQLObject/MySQL** backend, embedded in the **Sims Content Catalog** (SimFreaks-era CMS prototype).

| Source | Path |
|--------|------|
| Laszlo database interface | [`../2005-09-18-laszlo-database-interface/`](../2005-09-18-laszlo-database-interface/README.md) |
| SimFreaks content catalog Laszlo | [`../2005-09-18-simfreaks-content-catalog-laszlo/`](../2005-09-18-simfreaks-content-catalog-laszlo/README.md) |
| Catalogs hub | [`../../../catalogs/`](../../../catalogs/README.md) |
| Micropolis publishing vision | [`../../media/sims-series-micropolis-publishing-vision.md`](../../media/sims-series-micropolis-publishing-vision.md) |

**Analysis angles:**

- Central server + thin rich client (Laszlo/Flash) as precursor to Micropolis Home federation
- Custom field editors (pie menus, color pickers, OPML, map browsers) → modern component library
- Multi-user editing: who was "multiplayer" here — concurrent CMS authors? live game state? (clarify with Don)
- MySQL/SQLObject → today's git-backed CARD + derived DB in stream-gateway

## Article outline

1. Sugar: Papert constructionism + mesh as *game* multiplayer (same city, many kids).
2. Laszlo catalog: *content* multiplayer (many authors, one canonical DB, federated storefronts).
3. Convergence in Micropolis Home — publish rails + optional live play (Simplifier, stream-gateway).
4. What we can run today vs museum pieces.

## Gaps

- [ ] Extract full OLPC mailing-list Micropolis thread
- [ ] Laszlo app binaries / screenshots from Don archive
- [ ] Clarify "centralized multiplayer" scope with Don (TSO? catalog CMS? both?)
- [ ] Link OpenLaszlo revival or historical runtime notes if any

---

↑ [sources](../README.md) · [show](../../../repo-shows/will-wright/README.md) · [portrayal](../../README.md)

*Raw directory:* [browse files in this folder](./)


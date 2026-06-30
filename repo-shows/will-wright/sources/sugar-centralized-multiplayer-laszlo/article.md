# Sugar OLPC + centralized Laszlo client — exposition

*Two threads: Sugar mesh Micropolis vs Laszlo/AMF centralized web client. See also [`../multiplayer-simcity-ui-network/article.md`](../multiplayer-simcity-ui-network/article.md).*

---

## Thread A — Sugar / OLPC (planned)

From big-prompts and OLPC lists: integrate Micropolis with **Sugar** — mesh networking, journaling, Constructionist kid programming (Logo-style agents, custom disasters), XO hardware (book mode, mono LCD).

**Shipped (partial):** Python/GTK/TCL paths on XO; community Micropolis forks.

**Primary sources:**

- [`../simcity-open-source-saga/`](../simcity-open-source-saga/) — Dec 2006 EA negotiation
- [`DonHopkins/temp/old-email/simcity-for-olpc----introducing-the-players.txt`](../../../../DonHopkins/temp/old-email/simcity-for-olpc----introducing-the-players.txt)
- [`../../../../repo-shows/walter-bender-olpc.yml`](../../../../repo-shows/walter-bender-olpc.yml)

---

## Thread B — Centralized Laszlo multiplayer (implemented + planned)

### Shipped stack (PROGRESS.txt milestones)

TurboGears Python server · OpenLaszlo/Flash client · AMF binary messaging · MySQL · WikiMedia embed · multiple concurrent simulators · Amazon EC2 deployment.

### Future plans (central server semantics)

From [`micropolis/PROGRESS.txt`](../../../../micropolis/PROGRESS.txt):

- Shared city library; journal, chat, IRC; MediaWiki integration
- Multi-user: avatar chat, avatars as bots, **proposals → campaigns → votes**
- City newspaper; wiki stories with **live playable save views**
- AWS load balancing / clustering

### Laszlo UI TODO — "city wall" (Facebook-era sketch)

From [`micropolis/laszlo/micropolis/TODO.txt`](../../../../micropolis/laszlo/micropolis/TODO.txt):

- Notice + journal as overlay / slide-up **city wall** (Facebook page metaphor)
- Events with **"share on my wall"**, friend advice, **vote on issues**
- Event snapshots invite friends to **play a copy of the city from that moment**
- Integrated chat + NPC tutor bots (ALICE)

### Sims Content Catalog Laszlo (2005)

Separate but related: **Python/SQLObject/MySQL** CMS for SimFreaks — centralized DB, rich Laszlo field editors.

- [`../2005-09-18-laszlo-database-interface/`](../2005-09-18-laszlo-database-interface/)
- [`../2005-09-18-simfreaks-content-catalog-laszlo/`](../2005-09-18-simfreaks-content-catalog-laszlo/)

**Convergence (2026):** Micropolis Home — git CARD metadata + stream-gateway derived DB + Simplifier live capture.

---

## City save branching (immutable vs mutable)

From email harvest + Laszlo TODO — cities form a **tree**:

- **Branch cities** — immutable snapshots others can fork from
- **Leaf cities** — one mutable sim per user; periodic checkpoint
- Forking someone's live game clones current state to immutable snapshot first

This is the network design for **centralized multiplayer** — authoritative server, forkable history, wiki-linked stories.

---

*Upgraded from outline 2026-06-29.*

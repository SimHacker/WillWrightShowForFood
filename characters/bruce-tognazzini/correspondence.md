# Tog × Don — correspondence digest

Public-safe summary of the Bruce "Tog" Tognazzini × Don Hopkins correspondence, 2022–2026.
[Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md)

| Field | Value |
|-------|-------|
| **With** | Bruce "Tog" Tognazzini |
| **Curated by** | Don Hopkins |
| **Consent** | not yet asked |
| **Span** | 2022–2026 |
| **Channel note** | AskTog public contact rotates yearly — see green-room/contacts |

**The gist.** Warm, practical exchange: the AskTog preservation saga, a Fitts'-Law-and-pie-menus
running conversation, HN coordination offers, and (2026) Palm the monkey's thank-you letter for
Tog's 1979 Apple II *Infinite No. of Monkeys* demo. Ben Shneiderman, Ted Selker, and Brad Myers
are recurring Cc's — the elders keep each other's sites and stories alive.

---

## Threads

### HN coordination (Nov 2023)

Don proposed coordinating a fresh HN post of "Keyboard vs. The Mouse" so Tog could answer
questions in classic AskTog tradition, with Ted Selker dropping in on TrackPoint switching-cost
research (the two-TrackPoint ThinkPad story included).

### GoLive stranded the site (Nov 2023)

Tog, Nov 13 2023: *"I no longer have any reasonable access to my site since Adobe discontinued
GoLive. (I also tired of having to spend ten times as much time formatting new material as I did
writing it.) And I'm 78 years old."* Same day: *"Happily, I have no need to save money. In fact,
I'd happily spend a considerable sum if someone could rebuild the site in a framework that could
enable me to easily add new content. Just haven't found a competent, reliable person to do that
task."*

### The 2023 preservation plan

Don's proposal: snapshot to static hosting (cheap, HN-proof), Google search instead of the broken
search box, one clean package on archive.org for offline browsing, ACM or similar as long-lived
host; Jim Paradis as the competent-reliable builder. Ben Shneiderman widened it: index MANY
early-HCI sites — *"a nicely done HCI history page."* Don asked Al Kossow (bitsavers) and Arthur
van Hoff for platform advice. "For goodness sake, Bruce Tognazzini wrote the original Apple Human
Interface Guidelines" — his life's work deserves a modern site.
→ [Preservation saga](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/bruce-tognazzini/sources/asktog-preservation.md)

### The living-repo plan (2026 — THE plan)

Superseding the 2023 "asktog.ai" train-an-LLM idea: interview Tog about the site and his life's
work, scrape asktog.com into a GitHub repo — every column in clean Markdown with a YAML metadata
skeleton — organized MOOLLM-style as a navigable world: rooms, characters, documents, mind maps,
memory palaces, adventures, dragons, treasures. The same treatment Scott Adams and Don want for
their own life's accumulated data; exactly what a Repo Show is meant to produce. No bespoke LLM
needed — publish the corpus in a form optimized for LLMs to learn from and operationalize, and
**every** model that scrapes GitHub inherits it. Natural allies beyond ACM: the Long Now
Foundation, the Internet Archive, the Computer History Museum.

### Fitts' Law and pie menus — the long-running friendly thread

Tog's mile-high menu bar vs Don's pie menus (both Fitts' Law plays); Tog's 1986 "<"-buffer
hierarchical menu algorithm (Jim Batson math, Frank Leahy Menu Manager, NeXT regression, Amazon
resurrection); Steve Jobs unconvinced at EduCom '88, Don Norman unconvinced at NPUC; Blender
running with pie menus anyway.
→ [HIG + menus dossier](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/bruce-tognazzini/sources/apple-hig-and-menus.md)

### Tabbed windows (Nov 2023)

Don's HN tabbed-windows essay (NeWS UniPress Emacs 1988, tabs on any edge, pie menus on tabs)
shared with Ben + Tog + Brad Myers.

### CS547 Cc (Jan 2023)

Tog was on the big CS547 crowdsourcing Cc — the thread that surfaced Will Wright's 1996
"Interfacing to Microworlds" (Dollhouse) video and ~300 more Stanford HCI lectures.

### Palm's tribute (Jan 2026)

Don sent Tog "A thank you letter from a finite number of monkeys named Palm": Palm's tribute to
Tog's 1979 "THE INFINITE NO. OF MONKEYS" Apple II demo, plus "Palm on Being Palm." Thesis: the
theorem's answer is one navigating monkey (Dasher/LLM), not infinite random ones. "GZINCLE FORTEN
GLAFFLE" isn't gibberish — it's a navigation error.
→ [Monkeys dossier](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/bruce-tognazzini/sources/infinite-monkeys-1979.md)

### The Kreitman credit (March 2020)

In the Bill Atkinson PhotoCard farewell thread, Don quoted *Tog on Interface* pp. 156–157
crediting Kristee Kreitman Rosendahl for HyperCard's graphic design and Home icons; she's
interviewed in Douglas Adams's *Hyperland*.

---

## Connects in this repo

| Where | Why |
|-------|-----|
| [`CHARACTER.yml`](CHARACTER.yml) | Bio + invitation status |
| [Preservation saga](sources/asktog-preservation.md) | Site-rescue saga + HCI history site idea |
| [Infinite monkeys](sources/infinite-monkeys-1979.md) | 1979 demo + Palm's 2026 answer |
| [HIG + menus](sources/apple-hig-and-menus.md) | HIG editions, submenu forgiveness, Fitts quiz |
| [Ben Shneiderman](../ben-shneiderman/) | Recurring Cc; HCI history site co-conspirator |
| [Ted Selker](../ted-selker/) | Keyboard-vs-mouse + TrackPoint thread partner |
| [Brad Myers](../brad-myers/) | Menu-tracking p.171 thread; *Pick, Click, Flick!* |
| [Bill Atkinson](../bill-atkinson/) | PhotoCard farewell thread where the Kreitman credit surfaced |
| [Terry Winograd](../terry-winograd/) | CS547 archive Cc |

## Show hooks

- Writing the Apple HIG — 8 editions, 14 years, and WHY the 1987 edition justified everything
- The "<" submenu buffer — invention, Batson's math, Leahy's implementation, NeXT's regression, Amazon's resurrection
- A Quiz Designed to Give You Fitts — mile-high menu bar vs pie menus, settled amiably on air
- Magic and software design — a magician's view of attention
- Starfire — what the 1994 future film got right and wrong
- The Infinite No. of Monkeys (1979) — read Palm's tribute together; one navigating monkey
- AskTog preservation — GoLive strandedness, the living-repo rescue (Markdown + YAML, LLM-readable by design), the HCI history site

↑ [Tog's room](README.md) · [Invitation](invitation.md) · [Ideas](ideas.md) · [Sources](sources/README.md)

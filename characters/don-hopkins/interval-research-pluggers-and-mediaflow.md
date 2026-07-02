# Interval Research — Pluggers, MediaFlow, Camelot

**Paul Allen's Interval (1992–2000):** "a PARC for the nineties" — Don's one-year **oompa loompa** gig before Maxis.

> "Like working as an oompa loompa in Willy Wonka's chocolate factory… Camelot." — Don

**Massively fun.** Exhilarating to edit **running simulations** in Bounce while live video composited underneath. Interesting people **always visiting** to give talks — Don had already been there **about a year earlier** as a guest speaker on [**pie menus**](pie-menus-chi-88-and-beyond.md) and **SimCity**, then came back to work in the factory.

## Two parallel projects (worked on both at once)

**MediaFlow** and **Bounce / Body Electric** were **separate but related** — not one port of the other. Don worked on both simultaneously, plus **Macromedia Director plug-ins**, [**Tom Ngo's ECG**](tom-ngo-embedded-constraint-graphics-at-interval.md), and the [Pluggers](https://donhopkins.com/home/interval/pluggers) component survey.

| Project | Lead / lineage | Don's work |
|---------|----------------|------------|
| [**MediaFlow**](mediaflow-design-comments.md) | Marc Davis — hypermedia / temporal stream dataflow | Own implementation in **Mac Common Lisp + QuickTime**; [design essay](mediaflow-design-comments.md) |
| [**Bounce / Body Electric**](https://www.donhopkins.com/home/archive/visual-programming/bounce-notes.txt) | David Levitt — VPL **Body Electric** lineage | Custom compositor, live TV + captions, COM on wires (below) |
| [**ECG**](tom-ngo-embedded-constraint-graphics-at-interval.md) | Tom Ngo — Embedded Constraint Graphics | Colleague system; [Mouther](../golan-levin/README.md) faces; Don wrote about it when [patent expired](https://news.ycombinator.com/item?id=12572696) |
| **Director plug-ins** | Macromedia Lingo / Xtra ecosystem | Plug-in development alongside Bounce's Director-based multimedia stack |

### Bounce — live TV, Mystery Science Theater puppets, COM on wires

Don did **not** port Bounce to Mac Common Lisp. On Bounce he:

- **Replaced** the Macromedia **Director** player multimedia rendering engine with a **custom compositor** — character animation and overlays on top of **live video**
- Tracked the synchronized **real-time closed-caption** feed
- Ran simulated characters (**Rush Limbaugh**, **Jesse Jackson**, a **house fly**) that **responded to conversations on TV shows** — *Mystery Science Theater* energy, bots commenting on the broadcast
- Added **plug-in COM object** data types and integration modules — **JSON-like polymorphic structures** via Macromedia **IMOADict** and **IMOAArray** COM interfaces; plug-in COM objects **on wires** in the dataflow graph
- Built on **Microsoft COM on Apple Mac** (Metrowerks C++); cross-platform COM from the **Internet Explorer on Mac** era — best browser on the Mac at the time

Also worked on **Director plug-ins** in the same period — same Macromedia multimedia orbit as the custom compositor that replaced the Director **player** for live video.

### Tom Ngo — Embedded Constraint Graphics (simplicial complexes)

[**ECG**](tom-ngo-embedded-constraint-graphics-at-interval.md): example poses at simplex vertices; drag features on screen → **barycentric blends** in a **simplicial complex**. [**Golan Levin**](https://www.flong.com/archive/projects/mouther/) built **Mouther** face cartoons in the ECG editor. Patent [US5933150](https://patents.google.com/patent/US5933150) (Aug 1996).

Don later connected ECG to [**breakfast simplexes**](breakfast-simplex-barycentric-direct-manipulation.md) and [**pie menus**](pie-menus-chi-88-and-beyond.md) on Hacker News — *they're not just for breakfast any more.*

### MediaFlow — Mac Common Lisp + design essay

[**MediaFlow Design Comments**](mediaflow-design-comments.md) — streams/sessions, Gabriel codesign, clay types, micro-languages. [Original HTML](https://donhopkins.com/home/interval/mediaflow-design.html)

## Don's public artifacts from Interval

| Artifact | What |
|----------|------|
| **Pluggers survey** (1996) | COM, OLE, CORBA, OpenDoc, Java… [donhopkins.com](https://donhopkins.com/home/interval/pluggers) |
| **MediaFlow** | MCL implementation + [full design essay](mediaflow-design-comments.md) |
| **Bounce / Body Electric** | Live-video compositor, caption-driven TV puppets, COM dict/array on wires |
| **ECG / Mouther** | [Tom Ngo ECG essay](tom-ngo-embedded-constraint-graphics-at-interval.md) · [Breakfast simplex](breakfast-simplex-barycentric-direct-manipulation.md) |
| **Director plug-ins** | Macromedia Xtra / multimedia plug-in work (same era) |
| **IFC vs Bongo** | Don's full comparison **inlined:** [**`ifc-vs-bongo-comparison.md`**](ifc-vs-bongo-comparison.md) — Bongo `getProperties`, Arthur van Hoff, JavaBeans wars. [Original HTML](https://donhopkins.com/home/interval/ifc-vs-bongo.html) |

## Colleagues — the Camelot circle

**Paul Allen's lab** recruited from **PARC, Apple, Atari, Stanford, MIT Media Lab** — a "PARC without a Xerox." Don's one-year staff gig (~mid-1990s) put him **directly** on MediaFlow, Bounce, ECG/Mouther, Director plug-ins. He **did not overlap** there with every name in the roster — but he was **in that circle before and after**: Kaleida/ScriptX, Terry's CS547 orbit, NeWS gang, Will Wright → Maxis, Stanford archive work, visual-programming lineage.

| Direct (Don's Interval year) | Circle (same era / before / after) |
|------------------------------|-------------------------------------|
| [David Levitt](../../david-levitt/) — Bounce / Body Electric | [Terry Winograd](../../terry-winograd/) — consulting 1993–98, not on staff w/ Don |
| Marc Davis — MediaFlow | Dan Ingalls — Smalltalk VM ~1993 |
| [Golan Levin](../../golan-levin/) — Mouther, ECG | Paul Debevec — Rouen Revisited w/ Golan |
| Tom Ngo — ECG patent | Joy Mountford — HCI (ex-Apple HIG) |
| Malcolm Slaney — audio/video | Brenda Laurel → Purple Moon; Caterina Fake → Flickr |
| | Bill Verplank, Franklin Crow, Gavin Miller (Sashimi), Trevor Darrell, … |

**Roster detail:** [Grokipedia — Interval Research Corporation](https://grokipedia.com/page/interval_research_corporation) (surprisingly good name list). Machine-readable: [`history/interval-research.yml`](history/interval-research.yml) · private outreach roster in DonHopkins `contacts/interval-alumni.yml`.

**Repo Show nexus:** Interval = dense cluster of would-be guests Don actually knows — see `repo_show_nexus` in yaml. Best episodes: Debevec + Levin (*Rouen Revisited*); Levitt + Jerry Martin ([music-and-theory](../../repo-shows/REPO-SHOWS.yml)); Fake + Ben Cerveny (two paths to Flickr).

## After Interval

→ Maxis → The Sims → Stupid Fun Club → MOOLLM

Full yaml: [`history/interval-research.yml`](history/interval-research.yml)

# OWM and NeWS window management — the synthesis

Sister document to [Window Manager Flames](i39l-window-manager-flames.md).
That file preserves the primary text verbatim; this one synthesizes,
organizes, and dedups everything Don has said across the eight HN
retellings indexed there, plus the flames doc itself. The same stories get
retold across threads from 2014 to 2025 — this is the merged account, with
each claim cited to where it's told best.

Sources: [flames doc](i39l-window-manager-flames.md) ·
HN [2014](https://news.ycombinator.com/item?id=8042726) ·
[2017a](https://news.ycombinator.com/item?id=13817649) ·
[2017b](https://news.ycombinator.com/item?id=15327339) ·
[2019](https://news.ycombinator.com/item?id=18837730) ·
[2020](https://news.ycombinator.com/item?id=22501696) ·
[2021](https://news.ycombinator.com/item?id=29094938) ·
[2025a](https://news.ycombinator.com/item?id=44090952) ·
[2025b](https://news.ycombinator.com/item?id=44098598)

## Timeline

| When | What | Told in |
|---|---|---|
| Jun 1986 | First X10 program: a pie menu test app — still called "theta menus" ([theta.test, cached](../code/piemenu-x10/theta.test/)) | [2020](https://news.ycombinator.com/item?id=22501696) |
| 1987 | X10 `uwm` modified for pie menus and made **extensible and scriptable in FORTH** ([fuwm-main.f](../code/piemenu-x10/uwm/fuwm-main.f), [Menu.c](../code/piemenu-x10/uwm/Menu.c) — [tree cached](../code/piemenu-x10/README.md)); used to run the [pie vs linear menu experiment](https://medium.com/@donhopkins/an-empirical-comparison-of-pie-vs-linear-menus-466c6fdbba4b); [hacks.f](../code/piemenu-x10/uwm1/hacks.f) let you throw windows so they bounced off screen edges; the 1987 [news.todo.txt](../code/news-tnt/news.todo.txt) already lists a "stack of cards with indexing tabs" widget | [2020](https://news.ycombinator.com/item?id=22501696), [2021](https://news.ycombinator.com/item?id=29094938), [2019](https://news.ycombinator.com/item?id=18837730), [2017a](https://news.ycombinator.com/item?id=13817649) |
| 1988 | **Tabbed windows ship commercially**: the [Tab window class](../code/news-tnt/tabwin.ps) for NeWS 1.1 in UniPress (Gosling) Emacs 2.20, on Sun NeWS and SGI 4Sight — per Wikipedia's [Tab (GUI)](https://en.wikipedia.org/wiki/Tab_(GUI)) article, the first commercially available product with multiple tabbed windows. Used daily for HyperTIES authoring at UMD HCIL with Shneiderman and Plaisant | [2014](https://news.ycombinator.com/item?id=8042726), [2019](https://news.ycombinator.com/item?id=18837730) |
| 1989 | [NDE Tab Frames](../code/news-tnt/old-xnews-tab.ps) for X11/NeWS (May 13); the **PSIBER Space Deck** puts draggable-tab windows on a literal stack spike with snap-dragging | [2014](https://news.ycombinator.com/item?id=8042726), [2019](https://news.ycombinator.com/item?id=18837730) |
| 1990 | [tNt Tab Frames 1.0](../code/news-tnt/tabframe-1.ps), reimplemented for X11/NeWS FCS — tabs draggable to **any position along any edge**, pie menus with mouse-ahead display pre-emption and overlay previewing. Gosling talks Don into returning to Sun: "We'll get it out, even if I have to spill some real blood on the floor" (on freeing NeWS, 6 Mar 1990). November: the OWPS "free for $1000" disaster ([flame, cached](1990-11-openwindows-free-flame.txt)) | [2019](https://news.ycombinator.com/item?id=18837730), [2021](https://news.ycombinator.com/item?id=29094938) |
| 1991 | [Tab Windows v3.0.2](../code/news-tnt/tab.ps) + [Pie Menus v3.0.3](../code/news-tnt/pie.ps) for TNT; **OWM**, the Open Window Manager, written with Josh Siegel ([owm.ps](../../josh-siegel/sources/owm.ps)); the ICCCM fights inside Sun ([sevans, cached](1991-07-sevans-a-story.txt), the [death match](1991-09-news-tnt-icccm-death-match.md)); the flames doc's TkWM and xinit threads | [2025a](https://news.ycombinator.com/item?id=44090952), [2021](https://news.ycombinator.com/item?id=29094938), [flames](i39l-window-manager-flames.md) |
| 1992 | Shaped windows work, no transparency yet; Sun cancels NeWS. Don lands at CMU, hacks tvtwm into **piewm** ([tree cached](../code/piewm/README.md)); ports HyperLook SimCity to X11/TCL/Tk, "accidentally" making it multi-player, with the [tkpie widget](../code/tkpie/README.md) — SimCity for X11 wins a Unix World "best product of 1992" award | [2017a](https://news.ycombinator.com/item?id=13817649), [2020](https://news.ycombinator.com/item?id=22501696) |
| 1994 | The Unix-Haters Handbook X-Windows Disaster chapter — with the hyphen and the plural in the title specifically to annoy X fanatics, a project Don says he's run since reading "Things That Happen When You Say 'X Windows'" in the June 1988 XNextEvent newsletter | [2020](https://news.ycombinator.com/item?id=22501696) |

## What OWM actually was

Deduped from all tellings:

- An **ICCCM X11 window manager written in object-oriented NeWS
  PostScript** (plus "a tiny bit of C"), running inside the window server,
  that wrapped X11 clients in the same TNT frames NeWS windows got.
  Don calls it (in [2017b](https://news.ycombinator.com/item?id=15327339))
  Josh Siegel's "beautiful PostScript **tour de force swan song** for
  X11/NeWS".
- The machinery: `ClassX11ManagerMixin` ("which is what it sounds like")
  mixed into `FavoriteBaseWindow`, redefinable to `ClassTabBaseWindow` —
  so the frame class is a plug-in point. Special window subclasses
  supported **all the OPEN LOOK dialog types** (base, popup, notice, help)
  through standard ICCCM properties. See the
  [source](../../josh-siegel/sources/owm.ps).
- The features, one lego per module, "all independent of each other…
  but worked together synergistically"
  ([2025a](https://news.ycombinator.com/item?id=44090952)):
  [tabbed frames](../code/news-tnt/tab.ps), [pie menus](../code/news-tnt/pie.ps),
  multiple rooms, a scrolling virtual desktop **with an iconic map you
  scroll your view around in**, multiple displays, shaped windows.
- **The XCalc easter egg**, rediscovered by Don in
  [2025b](https://news.ycombinator.com/item?id=44098598): OWM's
  `FrameBuffers` list hunts for your Calculator window and registers its
  button container as a framebuffer — so the window manager wraps **every
  calculator button in its own window frame**, letting you resize,
  rearrange, and iconify individual digits. The practical grievance: the
  Athena widget layout manager accumulated float-rounding drift each
  resize until XCalc "looked like it got beat up in a street fight."
  "My work here is done! MOO HAA HAA!!!"
- It was a **proof of concept for something bigger**: a HyperCard-like,
  user-customizable, persistent window manager built on HyperLook, where
  users copy and paste scriptable frame components from object warehouses
  and compose task-oriented interfaces. "But that's not how things turned
  out. ;/" ([2017b](https://news.ycombinator.com/item?id=15327339))
- **It never shipped.** "We couldn't talk Sun into letting us ship it for
  some reason! ;)" ([2025b](https://news.ycombinator.com/item?id=44098598))

## The technical argument for in-server window management

The same case, assembled once from its scattered tellings
([2020](https://news.ycombinator.com/item?id=22501696) has the fullest
version; the [flames doc](i39l-window-manager-flames.md) the earliest):

1. **Synchrony.** A window manager in the server can lock the input queue
   and handle events synchronously: perfect input focus, no lost
   keystrokes when switching apps, mouse-ahead gestures that never drop.
   An external X11 WM in another address space is "asynchronous and laggy
   and flakey and dropping events… **by design**." The flames doc's
   ceiling on this: "criminally negligent," with the xtrek photon-torpedo
   scenario.
2. **No context switches.** On a diskless Sun 3/50 paging over the
   network, avoiding a round trip to a separate WM process was the
   difference between instant and unusable.
3. **The overlay plane.** Rubber-band move/resize feedback without
   grabbing the server; X11 WMs must grab, freezing all other animation
   (and OLWM grabbed the pointer after the server without checking the
   return value, locking the system).
4. **Shaped windows as methods.** A TNT window's shape is a method that
   can apply constraints and depend on other objects — PizzaTool's round
   preview window with the cut-out frame, no oval pizzas. "Completely
   impossible with an I39L window manager."
5. **Pinned menus.** TNT menus pin by just staying put; under I39L the
   pinned menu vanishes and returns "at a different place, at a different
   size, with a different look and feel."

The counterparty's view is preserved in the
[sevans exchange, cached](1991-07-sevans-a-story.txt): "If you want NeWS to be a commercial success, why has NeWSTech
been so stubborn… resisting trying to fit into the X environment?" Don's
reply: "I think OWM can do a beautiful job of fitting the X environment
into NeWS."

## The politics, in one place

Acronym disambiguation, since three near-identical names orbit this
story: **OWM** = Open Window Manager, Don and Josh's in-NeWS X11
window manager (this doc's subject). **OLWM** = Sun's external OPEN
LOOK Window Manager for X11, written by Stuart Marks (smarks) — the
official, ICCCM-compliant, NeWS-indifferent one. **Plwm** = an
unrelated 2025 hobby X11 WM in Prolog whose HN thread is where Don
posted the owm.ps receipts.

- The axis of the fight: **X people wanted NeWS windows inside X frames
  (OLWM); NeWS people wanted X windows inside NeWS frames (OWM)** — and
  built it. "Window management is a surprisingly contentious issue!
  Everybody wants to be on top."
  ([2017b](https://news.ycombinator.com/item?id=15327339))
- Sun management chose "the worst-possible upside-down solution… after
  we'd already proven we had a working better solution with 'owm'"
  ([2021](https://news.ycombinator.com/item?id=29094938)). The flames
  doc's version: "when Sun cut our throats for the final time."
- Gosling's side: fought hard, failed. The blood quote (6 Mar 1990), and
  his read on why NeWS was kept low-profile: "DEC explicitly targeted
  NeWS as something to be trashed."
- Don's verdict: NeWS's "biggest problems weren't technical, but
  political, and it wasn't free despite all the hard effort, spilled
  blood, and broken promises. But the consequences of that experience did
  help to make Java free, eventually."
  ([2021](https://news.ycombinator.com/item?id=29094938))
- The internal fight over which windows to build TNT on is receipted in
  the [1991 ICCCM death match](1991-09-news-tnt-icccm-death-match.md).

## The tabs doctrine

Don's design principles for tabbed windows, consistent across 30+ years
of comments:

- **Text is wider than tall → side tabs.** Vertical stacking reads like
  a menu of open windows; 15–25 stay visible even when their windows are
  buried (the HyperTIES author-tool rationale, published in
  [HCIL TR 90-02](http://www.cs.umd.edu/hcil/trs/90-02/90-02-published.pdf)).
- **Any edge, any position, user-draggable.** "Why restrict yourself to
  the top edge…? I am perplexed that all tabbed user window frames don't
  allow this useful and obvious feature, after all these years."
  ([2014](https://news.ycombinator.com/item?id=8042726))
- **Tabs + pie menus are a system.** Pie menus on tabs give gestural
  window management — directional commands (open left/right, resize from
  corner, top/bottom layer) map naturally to pie directions, usable
  without looking via mouse-ahead. "A lot like 'swiping' on an iPad."
  ([2019](https://news.ycombinator.com/item?id=18837730))
- **Tabs generalize.** PSIBER's stack spike (drag a tab onto the spike to
  push, up and down to reorder, away to pop); nested sub-window tabs;
  and the endgame: pluggable edge widgets of arbitrary shape — "ears or
  antennae" — scriptable and copy-pasteable "like a HyperCard window
  manager. That's how the web browser and window manager should work
  together seamlessly." ([2019](https://news.ycombinator.com/item?id=18837730))
- **The cargo-cult critique.** "So many 'modern' user interfaces are such
  cargo cult carbon copies of each other (like tabs along just the top
  edge)… it's easy to get the impression that anything slightly different
  is actually original." Browser extension APIs still can't center a
  popup on the cursor or shape it — "the poorly designed browser
  extension APIs still have a hell of a lot of catching up to do with
  what it was trivial to do in NeWS for all windows 30 years ago."

## Films and artifacts

| Artifact | What |
|---|---|
| [NeWS Tab Window Demo](https://www.youtube.com/watch?v=tMcmQk-q0k4) | The TNT 2.0 pie menu tab window manager in motion — cited in five of the eight comments |
| [X10 Pie Menu Window Manager](https://www.youtube.com/watch?v=IJhvB6kwmog) | The 1987 FORTH uwm |
| [HyperTIES Authoring demo](https://www.youtube.com/watch?v=hhmU2B79EDU) | HCIL film: Emacs authoring tool with tab windows |
| [X11 SimCity demo](https://www.youtube.com/watch?v=Jvi98wVUmQA) · [SimCityNet](https://www.youtube.com/watch?v=_fVl4dGwUrA) | The 1992 port with tkpie menus; watch the date blur at 1:25 |
| [pizzatool.gif](http://www.art.net/~hopkins/Don/images/pizzatool.gif) | The round window ICCCM can't manage |
| Cached in this repo | [owm.ps](../../josh-siegel/sources/owm.ps) · [tab lineage + pie.ps](../code/news-tnt/README.md) · [JS pie menus](../code/javascript-pie-menus/README.md) |

## Choice quotes, deduped

- "In summary, ICCCM is a technological disaster: a toxic waste dump of
  broken protocols, backward compatibility nightmares, complex
  nonsolutions to obsolete nonproblems…" (the X-Windows Disaster chapter,
  quoted in [2025a](https://news.ycombinator.com/item?id=44090952),
  alongside Jamie Zawinski's "Using these toolkits is like trying to make
  a bookshelf out of mashed potatoes.")
- "NeWS was architecturally similar to what is now called AJAX, except
  that NeWS coherently used PostScript code instead of JavaScript…
  PostScript graphics instead of DHTML… PostScript data instead of XML
  and JSON." ([2021](https://news.ycombinator.com/item?id=29094938))
- "Pie menus and tab windows are NOT patented or restricted, and the
  interface and algorithms may be freely copied and improved upon."
  (the license header, quoted proudly in
  [2019](https://news.ycombinator.com/item?id=18837730))
- "Take that, ICCCM! ;)" ([2025a](https://news.ycombinator.com/item?id=44090952))

↑ [Sources index](README.md) · [Window Manager Flames](i39l-window-manager-flames.md) · [HN harvest](hn-window-management-harvest.md) · [Josh Siegel's room](../../josh-siegel/README.md) · [Don's room](../README.md)

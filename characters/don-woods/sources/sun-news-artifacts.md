# Don Woods — NeWS / TNT artifacts

Woods's PostScript and toolkit work at Sun, as preserved in Don Hopkins's archives.
These are the repos-within-the-repo for a two-Dons episode: real shipping code, walkable
on air.

## quicksort.ps (late 1980s)

A full quicksort in stack-based PostScript — median-of-three partitioning, tail-recursion
to avoid deep stacks, special-cased 1- and 2-element arrays, and dry commentary
("it does seem to improve average runtime by about 10%").

- Source: [donhopkins.com/home/code/quicksort.ps.txt](https://donhopkins.com/home/code/quicksort.ps.txt)
- Foil: Sam Leffler's bubble sort, submitted anonymously out of embarrassment —
  [bubblesort.ps](https://donhopkins.com/home/archive/NeWS/news-tape/utilities/sorts/bubblesort.ps)
- Don's line, in a 2025 email to Woods: it's "more efficient if you only need to sort
  two numbers (as DEK would tell you)."
- Listed on the 1988 Sun Users Group tape solicitation as
  "PostScript sorts (leffler (bubble), owen (heap), woods (quick))".

## Spider solitaire for X11/NeWS (January 1990)

A complete double-deck solitaire written entirely in NeWS PostScript, shipped with
OpenWindows. Posted to NeWS-makers in three parts (two of source, one of documentation).

- Source: [spider.ps](https://donhopkins.com/home/news-tape/fun/spider/spider.ps)
- **Provenance, from its own header:** *"The author's first computer implementation was
  on the Stanford Artificial Intelligence Lab system (SAIL). It was later ported to the
  Xerox Development Environment."* — the game traces its author's career:
  SAIL → Xerox → Sun.
- Engineering notes worth showing on air: the class hierarchy (CardImage, CardColumn,
  StacksBag, SpiderCanvas); lazy-cached face-down card images; the deliberately obscured
  save-file hash ("not so much to make the file hard to decipher, as to make it unlikely
  anyone will accidentally learn anything from a casual glance"); the shuffle workaround
  for NeWS's constant random seed (keyed off `date` minutes/seconds/day-of-year); and a
  documentation section titled "EXAMPLES AND CONUNDRUMS" containing full Spider problems
  with proofs.
- The scoring maximum is 1000 — only achievable by winning with all eight suits still in
  the tableau. The man who gave Adventure its last lousy point built the same trap into
  his card game.

## The NeWS Toolkit (TNT) design work (1990–91)

- **Pinned menus memo** (8 Nov 1990, "Dave's 6 cents... I'll see your 6 cents and raise
  you 20"): four interacting design issues (which menu is on the stack in callbacks;
  fidelity of pinned clones; whether pinned menus track their originals; target/invoker/
  basewindow binding), a tentative proposal, a radical extension, and the closing line
  *"This all strikes me as very thin ice. Can anybody direct us toward some solid
  ground?"* Follow-up memo of 4 Dec 1990 settled the design.
- **TNT 2.0 tracking service** — design credited by Don Hopkins to
  *"Don Woods, Owen Densmore, Brian Raymor, and other people on the NeWS team"*; the goal
  was minimizing objects, sends, threads, and coordinate transforms, with **safe
  (synchronous) input handling** that never loses events between focus changes. The design
  was reincarnated in Kaleida's **ScriptX tracking service** and offered to the **OLPC
  Sugar** project in 2007 ([tracking.html](https://www.art.net/~hopkins/Don/lang/scriptx/tracking.html)).
  A straight lineage: TNT → ScriptX → the zooming-interface conversations of 2007.
- **Focus wars** (31 May 1991): Woods's analysis of X11/NeWS focus race conditions —
  "Ugly, because we'll have to write still more PostScript code that picks apart X event
  structures. Slow, because we'll have to wait for OLWM to wake up..." Context:
  [NeWS/TNT vs ICCCM death match](../../don-hopkins/sources/1991-09-news-tnt-icccm-death-match.md).
  Opens with the name correction: *"I'm Woods with an `s'."*
- **Bug 1047987** (Jan 1991, reported by Woods, fixed by Hopkins): *"slider and gauge
  demo titles are over-exuberant... Are we saying that people should be amazed that we
  were able to construct demos for those objects?"* Suggested fix: *"Remove the '!'s.
  (Or put '!'s in all the other demos if it's decided that people should be amazed. ;-)"*

## The motd

The NeWS-era `/etc/motd` on Woods's Sun workstation (hostname: **colossal**):

> Welcome to Adventure. Would you like instructions?

Don's firsthand memory; woods@colossal appears throughout the 1990 mail headers.
Per Woods (2025): no one ever reported actually typing `yes` at the csh prompt.
The trap remains armed.

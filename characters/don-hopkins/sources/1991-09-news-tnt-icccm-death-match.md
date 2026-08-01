# NeWS vs X — ICCCM windows, DPS strategy, Don's manifesto (Jul–Sep 1991)

Sun internal mail while **OpenWindows 3.0** shipped — the fight over whether **TNT/NeWS** survives as more than Display PostScript.

## Chuck Price — NeWS as licensed DPS (Aug 1991)

**Chuck Price** (Sun window strategy; ex-DEC **xpert** who fought NeWS in the 1980s):

- Roadmap: (1) **Bug-for-bug DPS + X extension** — license NeWS to IBM/HP/DEC/etc. cheaper than Adobe; (2) **then** HyperNeWS dev environment.
- Reversing order = NeWS never wins significant share.
- NeWS failed **PostScript stability** commitment while X11 froze protocol — must restore credibility.
- Personal history: DEC PostScript-on-display abandoned after SunDew; became X standardization player to prevent "another NFS" for Sun.

**Owen Densmore**: pin-compatible DPS is **very big** — define terms (operators vs X extension vs client env vs NeXT env).

**Josh Siegel** (3 Sep): quotes Chuck + **David Rosenthal 1987** white paper on NeWS stability vs X.

## Don vs Chuck / Steve Evans (Jul–Sep 1991)

Don's **"A story"** (10 Jul, expanded 12 Jul) to **Steve Evans** and NeWSTech:

- Sun keeps telling ISVs NeWS is finally real; **CAD professor demo** — same story, everyone admits he'd have been right to give up before.
- **Native NeWS windows** vs **ICCCM shrink-wrap** = cage for TNT; **8 MB deskset** politics pushing NeWS off desktop.
- Years of PostScript workarounds for X bugs (OLWM focus, selection protocols, `fullscreen.ps` pointer kludge).
- *"NeWSTech doesn't want NeWS destroyed — but managers who've driven away engineers who cared are strangling it slowly."*
- Offer: if management wants to kill NeWS, make it **quick and clean**.

**Steve Evans** reply: wants **commercial success** or axe NeWS; NeWSTech must **embrace X interoperability**; recent cooperation encouraging.

**Jonathan Payne** (10 Jul, "battle plan"): asks whether the team will do
"what we think we can get away with" or "what we think is right." His
*impression* was that Josh's pure-ICCCM proposal (below) was aimed at what
customers and Steve Evans wanted; he argues for **OWM** instead — NeWS
windows fix X's inevitable race conditions, are lighter-weight, server-local,
extensible, OPEN LOOK. *"If we don't fight to use NeWS in the way that was
intended (by God), then who will?"*

Framing caveat (Don, 2026): this was never OWM-versus-Josh. **OWM is Josh's
own NeWS window manager wrapping X clients**, written with Don — nobody on
the team wanted ICCCM X window managers wrapping NeWS windows. Josh's ICCCM
proposal was a cost exploration of the other direction, and the actual
experiment (the puff/unpuff shrink-wrap prototype, below) settled it: ICCCM
management couldn't support the showcase — pie menus, PizzaTool's
pizza-shaped window, or NeWS eyes (which predated xeyes).

## Josh — ICCCM-only TNT windows (5 Jul 1991)

The same Josh Siegel who wrote OWM, costing out the opposite architecture
after talking to **David Rosenthal** + **Maurice Balick** (Frame wanted ICCCM):

- Stop maintaining native NeWS window management; architect **pure ICCCM** TNT windows.
- Reasons: dual WMs forever; **binary compatibility** after TNT 3.0 API freeze; ICCCM is only X-accepted desktop standard; NeWS interest is **inside the window**.

Cost: major TNT rebuild, GNT/Devguide, docs, all demos.

## Sydney Springer — ICCCM proposal (12 Jul 1991)

Final **ICCCM Window Management for TNT** proposal to Paula:

- Prototype: **"puff/unpuff"** ClassWindow — strip OL ornamentation except footer; X WM manages chrome.
- ~**10 person-months**, 4 engineers × 8 weeks; breaks **~80% NeWS Challenge** entries + Frame + CG3270; drag-and-drop concerns.
- This was the experiment that answered the question: shrink-wrapped ICCCM
  management left no room for pie menus, PizzaTool's round pizza window, or
  NeWS eyes — the showcase was exactly what it destroyed.
- Recommends **ClassCanvas X property utilities** + completed TNT window design (SaveWorkspace, icons, notification).

**Owen Densmore** (30 May): **native window management** decision recap — Turing/Philips customers wanted **subclassable NeWS windows**, not ICCCM; ICCCM untestable maintenance burden.

## HyperNeWS bulletin (11 Sep 1991)

**HyperNeWS 1.5** nearing completion (OpenWindows 3.0): TNT canvases, stack GC, `HyperInit.ps` global method injection, **Alan Kay maxim** — *"Make the simple things easy, and the difficult things possible."*

## Don's job anxiety (4 Sep 1991)

Don notes fight with SunSoft all-hands figure (later learned: **DEC NeWS fighter**); *"Maybe I should find a job someplace else"* — David Rosenthal CD magazine mention.

## Cross-links

- [`../../david-rosenthal/invitation.md`](../../david-rosenthal/invitation.md) — ICCCM author + NeWS co-architect
- [`../../owen-densmore/CHARACTER.yml`](../../owen-densmore/CHARACTER.yml) — native WM memo
- [`../../arthur-van-hoff/sources/1991-06-linkget-parent-scope.md`](../../arthur-van-hoff/sources/1991-06-linkget-parent-scope.md) — COOL / HyperNeWS Plan B (Jun 1991)
- [`../../repo-shows/INDEX.yml`](../../../repo-shows/INDEX.yml) → `news-postscript-window-system.yml`
- Don Woods focus/server-grab thread included in Steve Evans **Interoperability Proposals DRAFT** (29 May 1991) — bug IDs 1058278, 1056853, etc.

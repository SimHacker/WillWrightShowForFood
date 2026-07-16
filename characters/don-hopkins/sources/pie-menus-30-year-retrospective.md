# Pie Menus: A 30 Year Retrospective (Medium, May 2018)

**Author:** Don Hopkins · **Published:** May 11 2018, for the 30th anniversary of CHI'88 (May 15–19 1988)
**URL:** https://donhopkins.medium.com/pie-menus-936fed383ff1

Canonical public account of pie menu history, design principles, good/bad examples, and the
PIXIE citation chain. Primary source for the radial-menu lineage.

## The PIXIE anchor

Opens the history section with **Wiseman, Lemke & Hiles 1969** — first mention of circular menus,
cited via Newman & Sproull *Principles of Interactive Computer Graphics* (1979, ref [520],
Figure 12-35 "movable menu displayed close to the cursor").

Key technical distinction, stated in the article:

> The "lightbuttons" were apparently target area based (selected "by pointing at one of them"),
> unlike pie menus which are based purely on the direction of the gesture.

So Don's own retrospective already draws the line we use in the lineage: PIXIE = radial
*placement* around the tracking cross; pie menus = pure *direction* selection with wedge targets
to the screen edge. Includes Wiseman's notes on radial menus (S/L/F/W-X-Y control lightbuttons
in drawing mode) and a free-hand figure copy.

**Verification pending against PIXIE source.** "Apparently target area based" is an inference
from the published descriptions, not yet confirmed in code. The physics supports it: a light
pen only fires when the CRT beam refreshes a *drawn* point under the tip (David Rosenthal:
"The light pen just noticed when the beam passed underneath it… you had to figure out what
you were drawing at that time"), so selecting a lightbutton naturally means the pen hovering
over its drawn label — a lit target area — not a direction of motion. But PIXIE also had a
tracking cross, so direction-of-drag logic was at least *possible*. Heinz's 125-page
assembler listing (light pen handling + interrupt management) should shine the light on it —
see [PIXIE source recovery](../../heinz-lemke/pixie-source-recovery.md), open question #1.

## Origin artifacts quoted in full

- **1986-05-18 "Theta Menus" email** Don → Mark Weiser — the founding document, reproduced
  verbatim at the end (direction not radius selects; radius as argument; mouse-ahead without
  visual attention; submenu paths as remembered shapes).
- **1986-05-19 Weiser → HCIL**: *"Experts remember long paths by muscle memory
  ('zig-zag-zig-zig-zag') instead of symbolically ('hjjkhj')."*

## Results and reception

| Item | Detail |
|------|--------|
| CHI'88 paper | Callahan, Hopkins, Weiser, Shneiderman — pies ~15% faster, significantly lower error rate |
| Nielsen trip report | confirms 15%; flags many-item and hierarchical caveats |
| Scientific American 7/97 | Shneiderman: "30 percent faster, half the error rates"; Ted Selker: "We remember angles much better than distances" |
| Steve Jobs, Educom 1988-10-25 | *"That sucks! That sucks! Wow, that's neat! That sucks!"* — insisted NeXT Step linear menus were best possible |
| Kurtenbach/Sellen/Buxton 1993 | marking menus = pie menus + ink trail (derivative by their own definition); wrongly claims the novice pop-up → expert mark transition as "unique" and implies pies lack mouse-ahead — features Don had explained to Kurtenbach in 1990 and published in 1987/1991 |
| Kurtenbach/Buxton 1994 | marks on average **3.5× faster** than menu selection; experts still flip back to menus to refresh layout |
| Gingold *Play Design* thesis | "It is difficult to imagine The Sims without pie menus" — verbs advertised by objects map naturally to radial menus |

## Design principles catalog

- **Fitts's Law**: maximize target size (wedges to screen edge), minimize distance (menu comes to cursor).
- **Mouse-ahead display preemption**: menus "lead, follow, or get out of the way"; novice mode is
  rehearsal for expert mode.
- **Pie/Slice/Item model** (vs older Pie/Item): stable slice directions during editing; 4 and 8 ideal.
- **8 beats 7** (Kurtenbach/Buxton surprise result); pad odd menus — "Eight Days a Week" adds Today.
- Miller 7±2 as cognitive bottleneck; 12 OK when semantics fit (clock, months, zodiac).
- **Tracking callbacks** for in-world preview — The Sims head in menu center turns to look at the
  selected item (Brady Bunch intro); wanted nod/shake per desire but "had to stop thinking of cool
  stuff to do and just ship the damned game."
- SimCity tool palette as totem-pole legend mirroring pie layout; icon size = cost.
- Hybrid pie/linear slices for overflow (OLPC Sugar, jQuery pies).
- Anti-patterns: rectangular label targets, distance/timeout triggering, non-centered popups,
  screen-edge mishandling, bedazzling animation.

## Mark Weiser dedication

Framed start to finish by Weiser (d. 1999) and ubiquitous/calm computing: *"The most profound
technologies are those that disappear."* Ties the pie menu story to the invisible-interface ethos.

## Show beats

- PIXIE → theta menus → CHI'88 chain in Don's own published words — read on air with Heinz
- Steve Jobs demo story — comic beat, pairs with Norman "linear menus caused the meltdown"
- Weiser muscle-memory email 3 days before Don's theta email = the HCIL blessing moment
- Gingold quote for the Will Wright / Sims episode

→ [`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`pie-menu-timeline.md`](pie-menu-timeline.md) ·
[`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md) ·
[`2020-02-alan-kay-pixie-pie-menus-thread.md`](2020-02-alan-kay-pixie-pie-menus-thread.md) ·
[PIXIE show](../../../repo-shows/pixie-pie-menus-pdp7.yml)

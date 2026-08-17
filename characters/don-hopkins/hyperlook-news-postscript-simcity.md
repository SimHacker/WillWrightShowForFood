# HyperLook / NeWS / PostScript — SimCity's first Unix face

**DUX Software (1991–1992):** SimCity on **NeWS** with **HyperLook** — not just a port, but a
**reimagined simulation environment**: the city as a microworld you paint and play across the
network, with **integrated scalable PostScript visualizations**, a **UI editor**, and **graphics
editors** in one stack.

## HyperCard → HyperLook

**HyperLook** (Arthur van Hoff) was **HyperCard on NeWS** — stacks, cards, and live objects,
but the language is **PostScript** and the window server **ships code to the glass**. Don's
HyperLook SimCity showcase took that shape seriously: a simulation you can **see, edit, and
author** in place — scalable vector tiles and chrome, not a bolt-on UI around a black box.

## What shipped at DUX

| Layer | Role |
|-------|------|
| **SimCity engine** | Unix microworld — cooperative multiplayer ideas on workstations |
| **PostScript tile renderer** | Scalable city graphics — Porter/Duff stencil-paint in the window server |
| **PostScript UI + pie menus** | Gestural tools integrated with the simulation |
| **HyperLook authoring** | UI and graphics editing in the same object stack as the running city |
| **Shared-memory raster library** | NeWS client/server lib Don wrote — **C writes pixels**, **PostScript renders**; used by SimCity *and* the CAM-6 lab |

## Shared memory (NeWS + X11)

Don's **NeWS client/server library** let C backends (**SimCity**, **CAM-6 simulator**) **bang on
pixels in shared memory** while **PostScript in the NeWS server** painted them — paste CA cells into
HyperLook graphics, clip live CA into shaped windows, etc. SimCity forced that library into shape.

The **CAM-6 laboratory playground** on HyperLook was the other major customer: **multiple zooming
views** of the same live sim (pan/zoom PostScript views over the shared cell plane), cut/paste between
the **HyperDraw** graphics editor and running automata, garish seamlessly tiled screen backgrounds —
and a live bubbling CA view **clipped into a lava-lamp-shaped window**. Exploratorium demo stills in
[`media/simprov-exploratorium/`](media/simprov-exploratorium/simprov-exploratorium.yml) (HyperLook — not Sims SimProv); Don's catalog
[CAM.gif](http://www.donhopkins.com/home/catalog/hyperlook/CAM.gif) ·
[HyperLook demo video](http://www.donhopkins.com/home/movies/HyperLookDemo.mov).

The later **X11/Tcl-Tk** port used **MIT-SHM** when available locally; **plain X protocol fallback**
when SHM was missing or the display was remote.

## The demo that melts your city (DRM as entertainment)

Starting in 1992, DUX sold SimCity over the internet with a
**fully functional unlockable demo** distributed via FTP: play the whole
game — no crippled features — and after a few minutes **the demo melts
your city with cellular automata**. Decide to buy, phone (or fax) in a
serial number and credit card, get a key, unlock. The copy protection
was a *world event*, not a nag screen: the same CA machinery that
powered the lava-lamp window and the CAM-6 playground repurposed as the
demo timer, so the punishment was a spectacle players ran the demo to
see. Later, the melt survived into the full game as an optional
entertainment feature.

The precedent is older and funnier: Don Woods closed Colossal Cave
during prime-time hours to protect Stanford AI Lab productivity — a
denial-of-service *policy* John McCarthy insisted on (while rumor holds
McCarthy kept a bypass build for himself). Knuth cut that machinery
from his literate Adventure as not part of the game. The DUX melt is
the same lever pulled the opposite way: don't deny service, **end the
session in-fiction** and make the enforcement mechanism something worth
watching. See the harvest note in
[`../donald-knuth/sources/adventure-knuth/ANALYSIS.md`](../donald-knuth/sources/adventure-knuth/ANALYSIS.md).

Parallel to the official Sun **X11** port; ancestor of every later SimCity Unix UI and of the
**Cairo / Pango / Canvas / WebGPU** imaging braid.

## People & lineage

- **Arthur van Hoff** — HyperLook (NeWS HyperCard), GoodNeWS lineage
- **Don** — showcase package, multiplayer SimCityNet dreams, imaging/UI integration
- **Imaging braid starts here** — Illustrator semantics (vector, scalable, printable), not bitmap paint alone

## Later ports (same city, new shells)

- X11 / **Tcl-Tk** — network multiplayer SimCityNet
- OLPC — **PyGTK / Cairo / Pango** ([`olpc-micropolis-python-pygtk.md`](olpc-micropolis-python-pygtk.md))
- Web — HTML/CSS/SVG/Canvas + **WebGPU holodeck** ([`porter-duff-postscript-to-webgpu.md`](porter-duff-postscript-to-webgpu.md))

→ [`career/simcity-lineage.yml`](career/simcity-lineage.yml) · [`../../characters/arthur-van-hoff/`](../../characters/arthur-van-hoff/) · [`../../process/trails/live-objects.md`](../../process/trails/live-objects.md)

**HN (Mar 2026):** jandrese asks about networked HyperCard stacks; Don points to HyperLook's networking —
[`hypercard-network-hyperlook-hn-2026.md`](hypercard-network-hyperlook-hn-2026.md).

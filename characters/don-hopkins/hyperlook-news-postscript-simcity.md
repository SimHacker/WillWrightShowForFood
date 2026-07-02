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

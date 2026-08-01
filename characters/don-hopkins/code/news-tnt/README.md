# NeWS / TNT sources — cached

Object-oriented NeWS PostScript from Don's UMD and Sun eras, cached
verbatim from
[donhopkins.com/home/archive/NeWS/](https://donhopkins.com/home/archive/NeWS/)
on 2026-08-01. The tab window lineage below is the one Don walks through in
his [2014](https://news.ycombinator.com/item?id=8042726) and
[2019](https://news.ycombinator.com/item?id=18837730) HN comments; synthesis
in [owm-window-management-synthesis.md](../../sources/owm-window-management-synthesis.md).

## Tab window lineage

| File | Year | What |
|---|---|---|
| [tabwin.ps](tabwin.ps) | 1988 | **The original Tab window class** for NeWS 1.1 — shipped with UniPress Emacs 2.20, used by HyperTIES; the first commercially available multiple-tabbed-windows product |
| [old-xnews-tab.ps](old-xnews-tab.ps) | 1989 | **NDE Tab Frames** (May 13 1989, UMD HCIL) — first X11/NeWS version |
| [tabframe-1.ps](tabframe-1.ps) | 1990 | **tNt Tab Frames 1.0** — reimplemented from scratch for X11/NeWS FCS; tabs draggable to any position along any edge |
| [tab.ps](tab.ps) · [tab-3.0.2.ps](tab-3.0.2.ps) | 1991 | **Tab Windows for the NeWS toolkit v3.0.2** — the pie menu tab window manager for TNT 2.0/3.0, the frames OWM wrapped around X11 and NeWS windows alike. "Pie menus and tab windows are NOT patented or restricted." |

## Pie menus

| File | Year | What |
|---|---|---|
| [pie.ps](pie.ps) | 1991 | **Pie Menus for the NeWS toolkit v3.0.3** — the pie menus popped up on tab frames and desktops; OWM's other half, per [Don's 2025 comment](https://news.ycombinator.com/item?id=44090952): "They were all independent of each other and could be used separately, but worked together synergistically. Take that, ICCCM! ;)" |

## The rest of the toolkit

| File | Year | What |
|---|---|---|
| [xwm.ps](xwm.ps) | 1991 | **Tab X Windows for TNT** — the shim that put tab frames on X11 clients, the third leg of the pie/tab/xwm trio |
| [ps.ps](ps.ps) | 1989 | **Metacircular PostScript interpreter** — PostScript written in PostScript; the debugger substrate under the [PSIBER Space Deck](../psiber/README.md) |
| [news.todo.txt](news.todo.txt) | ~1990 | Don's NeWS ideas file — opens with a "window turds virus" design, then tabbed card stacks with index strips: the tab doctrine as a to-do list |

The Open Window Manager itself, which used these frames and menus, is
cached in [Josh Siegel's room](../../../josh-siegel/sources/owm.ps) —
design notes in
[Window Manager Flames](../../sources/i39l-window-manager-flames.md).

↑ [Code index](../README.md) · [Don's room](../../README.md)

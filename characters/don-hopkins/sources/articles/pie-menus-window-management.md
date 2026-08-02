# Pie Menus and Window Management

The canonical merge of the window-management passages from the Kando threads, the
macOS Sequoia window snapping thread, and the Prolog window manager thread: why
window management is the perfect application for pie menus, the forty-year lineage
of pie menu window managers from X10 to Kando, and where an overlay window manager
could go next. General pie menu history and theory live in the
[30 Year Retrospective](../pie-menus-30-year-retrospective.md) and the
[Pie Menu Timeline](../pie-menu-timeline.md) and are linked, not repeated. All
merged versions are in [Provenance](#provenance).

## Contents

- [Why window management is the perfect pie menu application](#why-window-management-is-the-perfect-pie-menu-application)
- [The window manager lineage](#the-window-manager-lineage)
- [OWM: the NeWS window manager for X11](#owm-the-news-window-manager-for-x11)
- [The XCalc easter egg](#the-xcalc-easter-egg)
- [Kando and the overlay window manager idea](#kando-and-the-overlay-window-manager-idea)
- [Craft notes: geometry beats magic](#craft-notes-geometry-beats-magic)
- [Implementations, in order](#implementations-in-order)
- [Provenance](#provenance)

## Why window management is the perfect pie menu application

Window management is a perfect application for pie menus, since many of the
directional items can be arranged in obvious layouts, and you use them frequently,
so you learn them well and can use them in expert mouse-ahead style quickly and
efficiently, saving a lot of time overall.

The NeWS tabbed window frame pie menus placed the common "front" and "back"
commands up and down, had a "grab" submenu with eight directions to drag the four
corners and four edges, and a "move" submenu with vertical, horizontal, and
unconstrained modes. They worked really well with mouse-ahead gestures (with PacMan
feedback). The HyperTIES hypermedia browser had multiple windows in left and right
panes, and right-clicking a link popped up a pie menu to open it in the left or
right pane. The tab pie menus in the PSIBER Space Deck had directional submenus to
customize the layout, pull out to configure the scale, and move tabs to different
edges.

- [NeWS Tab Window Demo](https://www.youtube.com/watch?v=tMcmQk-q0k4)
- [X10 Pie Menu Window Manager](https://www.youtube.com/watch?v=IJhvB6kwmog)
- [PSIBER Space Deck Demo](https://www.youtube.com/watch?v=iuC_DDgQmsM)
- [UIS '90, HyperTIES left/right pane link pie menus](https://youtu.be/1uyO-xUTt6Y?t=761)

## The window manager lineage

In 1986 I implemented pie menus in the X10 `uwm` window manager, integrated into
Mitch Bradley's Sun Forth system so the window manager was scriptable in Forth:
[fuwm-main.f](https://donhopkins.com/home/pub/piemenus/pietest/fuwm-main.f). You
could define pie and linear menus in your `.uwmrc` and wire them to window
management, application launching, and shell commands. That Forth-scriptable window
manager led directly to implementing pie menus in PostScript for NeWS. After NeWS I
made `piewm`, an X11 window manager based on `twm` with pie menus:
[piewm](https://donhopkins.com/home/pub/piemenus/piewm/).

The full pie menu story before and after this, PIXIE through The Sims, is in the
[30 Year Retrospective](../pie-menus-30-year-retrospective.md); this article stays
on the window management thread.

## OWM: the NeWS window manager for X11

Around 1991 we built OWM, an ICCCM window manager entirely written in object
oriented NeWS PostScript:
[owm.ps](https://donhopkins.com/home/archive/NeWS/owm.ps.txt). It incorporated NeWS
tabbed windows ([tab.ps](https://donhopkins.com/home/archive/NeWS/win/tab.ps)) that
could wrap around X11 windows, and NeWS pie menus
([pie.ps](https://donhopkins.com/home/archive/NeWS/win/pie.ps)) you could pop up on
the tabbed frames to manage X windows. There was also a virtual large scrolling
desktop and virtual multi-screen "rooms", purely in PostScript, all independent
components that plugged together seamlessly. Take that, ICCCM!

The deeper argument: NeWS could manage windows better than X could manage its own,
because NeWS could synchronize input events reliably where asynchronous X11 window
managers fall flat by definition — perfect input focus management, rubber-band
feedback without grabbing the server, window shapes defined by live methods with
constraints (PizzaTool's round pizza preview window) rather than static bitmaps.
The design notes and flames are archived locally in
[i39l window manager flames](../i39l-window-manager-flames.md) and at
[i39l.txt](https://donhopkins.com/home/archive/NeWS/i39l.txt), with the long-form
rant in [The X-Windows Disaster](https://donhopkins.medium.com/the-x-windows-disaster-128d398ebd47):
"ICCCM is a technological disaster: a toxic waste dump of broken protocols,
backward compatibility nightmares, complex nonsolutions to obsolete nonproblems."

But we couldn't talk Sun into letting us ship it for some reason. ;)

## The XCalc easter egg

Rereading OWM decades later I rediscovered a forgotten easter egg: it looks for
your X11 XCalc window, wraps two levels of its sub-windows in `ClassXClientCanvas`,
and puts the window containing the buttons into the list of framebuffers — so the
window manager wraps all your calculator's buttons in window frames, and you can
resize them, move them around, and iconify them. A NeWS window frame wrapping an X
calculator window wrapping an X sub-window wrapping NeWS window frames wrapping X
buttons.

The practical reason: XCalc got totally beat up when you resized it repeatedly,
because the Athena Widget layout manager rescaled the initial grid in floating
point and rounded to integers, drifting a little more each time. We NeWS
programmers would laugh and laugh while resizing XCalc until it looked like it lost
a street fight, then felt sorry for it and wanted a way to repair it: put frames
around all the buttons so you could lay them out yourself, iconify the digits you
never use, and zoom your favorite math operations to full screen.

The serious point under the joke: nothing in ICCCM says a window manager must run
on a root window. Hack any ICCCM window manager to take a window id as an argument
and it will happily manage the calculator's buttons. Window management is a
composable, recursive service, not a privileged singleton.

## Kando and the overlay window manager idea

[Kando](https://kando.menu) is Simon Schneegans' cross-platform open source pie
menu: an Electron app that opens a transparent window on top of the desktop and
draws pie menus and other chrome floating above everything. Simon totally gets the
inherent advantages and joys of pie menus — he has iterated on them for over a
dozen years, from Gnome-Pie through his thesis work on the
[Trace-Menu](https://vimeo.com/51073078) and [Coral-Menu](https://vimeo.com/51072812)
to Kando — and he has an impeccable sense of design. The best part is the elegant
WYSIWYG drag-and-drop editor, so anybody can design their own pie menus without
writing JSON, XML, or code, which matters because everyone has their own personal
use cases and commands they need quickly. Kando's custom themes are defined in CSS,
and menus are stored in documented JSON.

His earlier OpenPie design sketched the right architecture: a daemon listening on
D-Bus for menu-open requests, so any application can summon a menu and get the
selection back — a shared pie menu user interface manager, exactly the way window
managers are shared services.

The natural next step, and the reason this article exists: extend the Kando-style
transparent overlay into a window manager. The overlay already floats above the
desktop and draws arbitrary chrome; teach it to track native window bounding boxes,
put frames around them, and orchestrate tabs and pie menus in the overlay. That is
OWM's trick — wrap frames around windows you don't own, from a layer that can draw
anything — rebuilt on the modern cross-platform desktop, with Electron's
transparent window in place of the NeWS canvas. Tabbed frames, directional window
management submenus, rooms, and a scrolling virtual desktop all composed as overlay
services, portable across Windows, macOS, and Linux, themeable in CSS. The 1991
architecture was right; the substrate finally caught up.

## Craft notes: geometry beats magic

Two design arguments from the Kando threads worth keeping:

**Geometry beats invisible submenu magic.** The diagonal-drag-to-submenu trick in
linear menus was invented by Bruce "Tog" Tognazzini (the "drag delay" in Apple's
1987 Human Interface Guidelines, page 87). It is astonishingly clever, extremely
difficult to implement correctly (there is not even a definition of correct), needs
empirical tuning nobody does any more, and users can't see or predict it. Pie menus
geometrically avoid the problem: submenus pop up centered on the cursor with each
item in a different direction, so no magic invisible tracking kludges are needed.
Don't violate the Principle of Least Astonishment. With pie menus there is a sharp
crisp visible line between every possible gesture; with gesture recognition you
wonder where the dividing line between "u" and "v" is, and most of gesture space is
syntax errors. Pie menus saturate gesture space with meaningful, reversible,
self-revealing gestures.

**Fitts's law does the math.** The bigger and closer a target, the faster and more
reliably you can hit it. Pie menus minimize target distance while maximizing target
size — every item adjacent to the cursor, every slice extending to the screen edge,
so the further you move the more leverage and precision you get. Selection is
directional muscle memory that does not demand the visual attention loop, which is
why mouse-ahead works. Our 1988 CHI study measured eight-item pie menus 15% faster
than linear menus with fewer errors; the details and the rehearsal/self-revelation
theory are in the [30 Year Retrospective](../pie-menus-30-year-retrospective.md)
and the [DDJ 1991 article](../ddj-1991-design-implementation-pie-menus.md).

## Implementations, in order

| Year | Implementation |
|------|----------------|
| 1986 | X10 `uwm` + Forth scripting ([fuwm-main.f](https://donhopkins.com/home/pub/piemenus/pietest/fuwm-main.f)) |
| 1987-91 | NeWS PostScript pie menus, tab windows, OWM X11 window manager |
| ~1992 | `piewm`, X11 `twm` fork ([piewm](https://donhopkins.com/home/pub/piemenus/piewm/)) |
| 1993 | TCL/Tk pie menus for X11 SimCity ([source](https://github.com/SimHacker/micropolis/blob/master/micropolis-activity/src/tk/piemenu.tcl)) |
| 1998-2000 | The Sims pie menus; direct-manipulation object rotation |
| ~1999 | ActiveX / OLE Control pie menus |
| 2001 | JavaScript IE5 DHTML behavior pie menus (XML menus, HTML items) |
| 2007 | OpenLaszlo / Flash pie menus for Micropolis ([demo](https://www.youtube.com/watch?v=8snnqQSI0GE)) |
| ~2010 | [jQuery pie menus](https://github.com/SimHacker/jquery-pie) on jQuery-UI |
| ~2013 | Unity3D pie menu component ([demo](https://www.youtube.com/watch?v=sMN1LQ7qx9g)) |
| 2024- | [Kando](https://kando.menu), cross-platform Electron overlay (Simon Schneegans) |

## Provenance

This article merges and deduplicates the window-management material from:

- **Kando: The Cross-Platform Pie Menu** (HN, 2024-01-31):
  [39206966](https://news.ycombinator.com/item?id=39206966) — Tog drag-delay
  history, gesture space, Fitts's law, Unity3D demo transcript;
  [39208196](https://news.ycombinator.com/item?id=39208196) — the full
  implementation-lineage comment
- **Show HN: Kando** (HN, 2024-12-29):
  [42525290](https://news.ycombinator.com/item?id=42525290) — the Simon Schneegans
  appreciation, Gnome-Pie / Trace / Coral history, OpenPie D-Bus design
- **macOS Sequoia window snapping** (HN, 2024-10-20):
  [41895561](https://news.ycombinator.com/item?id=41895561) — window management as
  the perfect pie menu application; NeWS tab frame menu layouts; HyperTIES panes
- **Plwm, an X11 window manager in Prolog** (HN, 2025-05-25):
  [44090686](https://news.ycombinator.com/item?id=44090686) — OWM, tab.ps, pie.ps,
  i39l notes, X-Windows Disaster quote;
  [44098598](https://news.ycombinator.com/item?id=44098598) — the XCalc easter egg
  with annotated PostScript
- **Sun's NeWS was a mistake** (HN, 2020-03-01):
  [22455722](https://news.ycombinator.com/item?id=22455722) — why NeWS managed
  windows better than X: input focus, server grabs, live window shapes
- Local canon: [i39l window manager flames](../i39l-window-manager-flames.md) ·
  [30 Year Retrospective](../pie-menus-30-year-retrospective.md) ·
  [Pie Menu Timeline](../pie-menu-timeline.md) ·
  [DDJ 1991](../ddj-1991-design-implementation-pie-menus.md)

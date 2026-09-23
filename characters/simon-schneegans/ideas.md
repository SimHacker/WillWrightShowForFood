# Ideas to explore with Simon Schneegans 🥧

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Simon's
public work. Things Don would love to follow **with** Simon; not quotes, not claims about
what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest

## What Simon has done

Simon Schneegans has been designing, building, and shipping pie menus for well over a
decade: thesis work on **Trace-Menus** and **Coral-Menus** (~2012), **Gnome-Pie** (the
Fitts's-law circular launcher for Linux), **Fly-Pie** (its GNOME Shell successor), and now
**Kando** — a free, open source, cross-platform marking/pie menu with a WYSIWYG editor,
CSS themes, sound themes, keyboard selection, an IPC interface, and an achievement system.
[Kando 3.0](https://ko-fi.com/post/Kando-3-0-0-now-available-H5W727E0O3) (2026-09-23)
added automation workflows: every item holds ordered action lists, one per event, with
closing the menu as a step you place in the list. He is also the author of the wildly popular GNOME extensions **Burn-My-Windows** and
**Desktop Cube**, and a developer on **CosmoScout VR**.

## Shared ground

Don co-authored the CHI '88 pie menu study (with Callahan, Weiser, and Shneiderman) and has
championed Simon's work publicly since at least 2018 — praising Gnome-Pie and his thesis
menus in the [Pie Menus 30-Year Retrospective thread](https://news.ycombinator.com/item?id=17106453),
and returning for the [Kando Show HN](https://news.ycombinator.com/item?id=42525290) in
December 2024: *"not only do you totally get the inherent advantages and joys of pie menus,
and have the skills and persistence to implement them well and iterate on the design by
continuously using and refining them over many years... but you also have an impeccable
sense of design and creativity."* Don also supports Kando's development — including, in the
proud uncollecting tradition, tribute paid in a silver-plated counterfeit Zimbabwe
hundred-trillion-dollar note.

## The hooks

1. **A dozen years of iteration.** Trace-Menu's sub-menu preview nubs and reserved
   roll-back slice; Coral-Menu's browsable tree — what those experiments taught, what
   survived into Gnome-Pie and Kando, and what got cut. Design iteration made visible.
   ([Trace-Menu](https://vimeo.com/51073078), [Coral-Menu](https://vimeo.com/51072812))
2. **The WYSIWYG editor is the point.** Everyone's important commands are different, so
   menus users can't edit are menus half-finished. Kando's drag-and-drop editor vs. the
   1988 dream of user-craftable menus (Don's "PieCraft" thought experiment; Monster
   Hunter: World's radial menus).
3. **The Wayland wars.** Gnome-Pie's [honestly documented death by security
   model](https://schneegans.github.io/news/2017/07/09/gnome-pie-071.html) — no window
   placement, no input grabbing, no global keybindings, no pointer warping — and how
   Kando's architecture answers each one. What desktop security models cost utility
   software, and what platform vendors owe utilities like this.
4. **"But it's Electron."** Simon's [reasoned defense](https://news.ycombinator.com/item?id=42525290)
   of web tech for a menu that needs themeable rendering, animation, international text,
   emoji, and a complex WYSIWYG editor — maintainer temperament under drive-by criticism.
5. **Fitts, Steering, and marking.** The scientific spine: Fitts's law, the steering law,
   Kurtenbach's marking menus, gesture space — and the patent-FUD history that suppressed
   pie menus for decades ([Don's account](https://news.ycombinator.com/item?id=17098179)).
6. **Sustainable passion software.** Kando is free, open source, no telemetry, ko-fi
   supported, with a Discord community that co-designed the brand. How does a solo
   maintainer keep a cross-platform desktop utility alive and joyful?
7. **Pie menus in the pie-menu-history repo.** Live segment: build a Kando menu for this
   repository on stream — every show artifact one gesture away. Possible ensemble with the
   [Ben Shneiderman + Heinz Lemke pie menu history show](../../repo-shows/ben-and-heinz-pie-menus/README.md):
   1969 PIXIE → CHI '88 → Kando, the whole lineage in one room.
8. **Workflows, and what a step should be.** Kando 3.0's model: buttons and submenus, each
   with hover, select, open and center-click lists, a quick-select key per list, and
   `close-menu` as a step whose position decides what runs with the menu up and what runs
   after it's gone
   ([design post](https://ko-fi.com/post/Workflows-coming-to-Kando-3-0-N7A421KR1B)).
   The open question: desktop steps are keystrokes and delays, because that's all an OS
   lets a utility do. Where the target app has named commands, a step can be a command
   that answers, and a delay can be a wait for an event. The new
   `send-websocket-message` action is the bridge; Don's webtop design takes Kando's model
   whole ([WORKFLOWS.md](https://github.com/SimHacker/moollm/blob/main/designs/webtop/WORKFLOWS.md)).
   Live segment: a Kando slice on Simon's desktop driving a page in this repo.
9. **Recording workflows by doing them.** Conditions are next on Simon's list. Recording
   is the one after that, and it's hard for a menu that only sees keystrokes. Allen
   Cypher's *Watch What I Do* was about recovering intent from input; an app that
   announces its commands removes that problem.
10. **The center, the keyboard, and the overlay.** Kando made the center programmable and
    the back key a setting, added arrow-key walking, and puts quick-select keys on the
    items. Don argued in 2024 that 4- and 8-item pies map straight onto arrow keys, keypads
    and joysticks, as his ActiveX pie menus did with full keyboard navigation
    ([HN](https://news.ycombinator.com/item?id=38921863)). The webtop's
    [ROOM-STROLLING](https://github.com/SimHacker/moollm/blob/main/designs/webtop/ROOM-STROLLING.md)
    gives the center two meanings, *here* and *cancel*. With workflows it can have a third.
    What should the center mean?
11. **Hover as preview.** Kando 3.0's hover workflow is a place for what Don asked about in
    the first Kando thread in 2024: labels and descriptions revealed progressively as you
    browse, the title and description in the center
    ([HN](https://news.ycombinator.com/item?id=39243040)), and Tog's 1987 drag delay for
    submenus ([HN](https://news.ycombinator.com/item?id=39228342)). HyperTIES in 1988 showed
    a definition before you followed a link. What should a hover be allowed to do, and
    what must it never do?
12. **The first pie menus, running again.** PIXIE's lightbutton menus (the 1969 paper;
    Heinz Lemke's 1972 SYMELEC listing) now run in the browser: the listing transcribed
    and running on an emulated PDP-7 and Type 340, with a light pen you drive with the
    mouse ([PIXIE live](https://hyperties.org/databases/pixie/pixie-live/)). Simon can
    draw a circuit with the ancestor of Kando.

## Sources (public)

- CHARACTER.yml · invitation.md · [show seed](../../repo-shows/simon-schneegans-pie-menus/README.md)
- [kando.menu](https://kando.menu/) · [Gnome-Pie](https://schneegans.github.io/gnome-pie.html) · [GitHub](https://github.com/Schneegans)
- HN: [Show HN: Kando](https://news.ycombinator.com/item?id=42525290) · [Don's 2018 praise](https://news.ycombinator.com/item?id=17106453) · [30-Year Retrospective](https://news.ycombinator.com/item?id=17098179)

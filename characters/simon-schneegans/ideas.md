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
He is also the author of the wildly popular GNOME extensions **Burn-My-Windows** and
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
   [Ben Shneiderman + Heinz Lemke pie menu history show](../../repo-shows/ben-and-heinz-pie-menus/ben-and-heinz-pie-menus.yml):
   1969 PIXIE → CHI '88 → Kando, the whole lineage in one room.

## Sources (public)

- CHARACTER.yml · invitation.md · [show seed](../../repo-shows/simon-schneegans-pie-menus/simon-schneegans-pie-menus.yml)
- [kando.menu](https://kando.menu/) · [Gnome-Pie](https://schneegans.github.io/gnome-pie.html) · [GitHub](https://github.com/Schneegans)
- HN: [Show HN: Kando](https://news.ycombinator.com/item?id=42525290) · [Don's 2018 praise](https://news.ycombinator.com/item?id=17106453) · [30-Year Retrospective](https://news.ycombinator.com/item?id=17098179)

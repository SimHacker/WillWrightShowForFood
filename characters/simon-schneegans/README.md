# Simon Schneegans 🥧 — character room

**Simon Schneegans** is a German developer and researcher who has spent well over a decade
doing the thing almost nobody does: **continuously designing, shipping, using, and refining
pie menus**, in public, as free software.

The lineage, in one line:

**Trace-Menu / Coral-Menu** (thesis, ~2012) → **Gnome-Pie** (Linux circular launcher,
Vala/GTK/Cairo) → **Fly-Pie** (GNOME Shell successor) → **[Kando](https://kando.menu/)**
(cross-platform: Windows, macOS, Linux — marking gestures, WYSIWYG editor, CSS themes,
sound themes, achievements, IPC interface, no telemetry, free forever).

He is also the author of the enormously popular GNOME extensions **Burn-My-Windows** and
**Desktop Cube**, and a developer on **CosmoScout VR**. See
[github.com/Schneegans](https://github.com/Schneegans).

## Status

| | |
|---|---|
| Invitation | draft — [invitation.md](invitation.md), not yet sent |
| Show seed | [repo-shows/simon-schneegans-pie-menus/simon-schneegans-pie-menus.yml](../../repo-shows/simon-schneegans-pie-menus/simon-schneegans-pie-menus.yml) |
| Hooks | [ideas.md](ideas.md) |
| Card | [CARD.yml](CARD.yml) |

## Why this guest, in this repo

This repo already hosts the pie menu deep history: the
[Ben Shneiderman + Heinz Lemke pair show seed](../../repo-shows/ben-and-heinz-pie-menus/ben-and-heinz-pie-menus.yml)
runs from the 1969 PIXIE radial menus on the PDP-7 through the CHI '88 pie menu study
(Callahan, Hopkins, Weiser, Shneiderman). Simon is the living continuation of that lineage —
the person who kept baking after everyone else declared the oven patented, deprecated, or
incompatible with Wayland.

## Don and Simon (the receipts)

Don has been publicly championing Simon's work since at least May 2018, in the
[Pie Menus: A 30-Year Retrospective HN thread](https://news.ycombinator.com/item?id=17098179):

> I'm very impressed by Simon Schneegans' work on Gnome-Pie... And especially his
> delightful thesis work. [Trace-Menu:] I really love how the little nubs preview the
> structure of the sub-menus, and how you can roll back to the parent menu because it
> reserves a slice in the sub-menu to go back.
> — [Don, HN, May 2018](https://news.ycombinator.com/item?id=17106453)

And in the [Show HN: Kando thread, December 2024](https://news.ycombinator.com/item?id=42525290):

> Simon, not only do you totally get the inherent advantages and joys of pie menus, and
> have the skills and persistence to implement them well and iterate on the design by
> continuously using and refining them over many years... but you also have an impeccable
> sense of design and creativity, and they look really great! And the best part is that
> you've implemented an easy-to-use elegant wysiwyg drag-and-drop editor so anybody can
> edit and design their own pie menus... Thanks for all your work, and for making it open
> source, and going the extra mile to make it cross platform (which is extremely difficult)!
> — Don, HN, December 2024

Simon's reply, same thread:

> Hey Don, thanks for the kind words! And yes, with the latest updates we (and I can say
> "we" since various discord users collaborated on this) focused a lot on refining the
> "brand" of Kando.

Don also supports Kando's development materially — including, in the proud uncollecting
tradition documented elsewhere in this repo's orbit, a tribute paid in a **silver-plated
counterfeit Zimbabwe hundred-trillion-dollar note**. (Kando is free; the note is worth
even less; the appreciation is real.)

## The deeper story (infodump)

Simon's work matters to this repo's core thesis for three reasons:

1. **Iteration in the open.** His thesis menus tried real ideas — Trace-Menu's sub-menu
   preview nubs, Coral-Menu's browsable tree with reserved roll-back slices — and you can
   watch a decade of selection pressure act on those ideas through Gnome-Pie into Kando.
   Most UI research dies in the paper; his walked out of the lab and got a Discord server.
2. **Honest engineering writing.** His
   [Gnome-Pie 0.7.1 Wayland post](https://schneegans.github.io/news/2017/07/09/gnome-pie-071.html)
   is a model of maintainer honesty: an enumerated list of exactly which platform security
   decisions break which features, with no spin. Kando is, in a real sense, the answer to
   that post.
3. **The editor is the ideology.** From the CHI '88 paper onward, the pie menu argument was
   never just speed — it was that users should craft their own menus. Kando's WYSIWYG
   editor, themes, and achievement system are that argument, shipped.

The history he inherits — including the Alias/Autodesk marking-menu patent FUD that
suppressed pie menu adoption for decades — is told in Don's
[Pie Menus: A 30-Year Retrospective](https://medium.com/@donhopkins/pie-menus-936fed383ff1)
and the [HN thread around it](https://news.ycombinator.com/item?id=17098179).

All portrayal per [portrayal standards](../../schemas/portrayal-standards.md): public
sources only, no impersonation, no fabricated quotes; Simon may edit, expand, or delete
this directory at any time.

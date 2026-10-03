# Scott Jenson 🍺 — character room

**Scott Jenson** was the first member of Apple's Human Interface group in the late 1980s
(System 7, Newton, the Human Interface Guidelines), then UX director at Symbian, creative
director at frog design, and a UX lead at Google twice: mobile UX, then from 2013 the
**Physical Web** and Android, leaving in 2024. He wrote
**[The Simplicity Shift](https://jenson.org/The-Simplicity-Shift.pdf)**. Now "partially
retired", he mentors designers and does UX for Mastodon and Home Assistant, "to atone for
my sins" ([about](https://jenson.org/about-scott/)).

Two talks, a year apart, make one argument:

- **[Are we stuck with the same Desktop UX forever?](https://www.youtube.com/watch?v=1fZTOjd_bOQ)**
  (Ubuntu Summit 25.10): "We don't need a 37th window manager." There isn't anything left
  to copy, so explore. Three projects, easy to hard: KDE Connect 2.0, a "super windowing
  system", and "the ultimate right click". [transcript](sources/2025-ubuntu-summit-stuck-with-same-desktop-ux.transcript.txt)
- **[Are we really going to use the same Desktop UX forever?](https://www.youtube.com/watch?v=V7AfAcQwLW0)**
  (KDE 2026): the desktop's job is working memory, and windows, files and the clipboard
  each solve a slice of it in silos. Three prototypes: spatial, associative, episodic.
  [transcript](sources/2026-kde-akademy-same-desktop-ux-forever.transcript.txt)

Timestamped moments from both are in [CHARACTER.yml](CHARACTER.yml) under `talks`.

## Status

| | |
|---|---|
| Invitation | draft — [invitation.md](invitation.md), not yet sent |
| Show seed | none yet |
| Hooks | [ideas.md](ideas.md) |
| Card | [CARD.yml](CARD.yml) |
| Sources | [sources/README.md](sources/README.md) |

## Why this guest, in this repo

This house is full of the people whose work Scott says to stand on, and of the arguments
he says are still open.

- **The 1985 workshop already had the fight.** The Alvey *Methodology of Window
  Management* working group called tiled vs overlapped windows "merely options that the
  user interface designer could use if appropriate" (§17.2). See Don's
  [book page](../don-hopkins/books/methodology-of-window-management.md), thread 4.
- **The clipboard.** Scott names it one of the desktop's building blocks and its
  statelessness "the curse of direct manipulation" (KDE [24:34]). Ted Nelson has railed
  against the invisible clipboard for decades
  ([catalog](../ted-nelson/sources/invisible-clipboard-rant-catalog.md)), David Rosenthal
  wrote the ICCCM selection rules ([lineage](../david-rosenthal/selection-clipboard-lineage.md)),
  and the three of them with Don are the
  **[Unnatural Selection panel](../../repo-shows/unnatural-selection/README.md)**.
- **Pie menus.** Scott's gesture keyboard is "a little bit like pie menus if you're
  familiar with that" (Ubuntu [26:51]), and his toy WM sends windows by click-drag
  direction to "your temporary palette". Don designed pie menus with Ben Shneiderman's
  lab; [Simon Schneegans](../simon-schneegans/) ships them today as Kando.
- **Remember your past.** Scott cites Alan Kay's present / past / questions (KDE [18:41]),
  Dynamicland ([Bret Victor](../bret-victor/), Ubuntu [33:24]) and Ink & Switch. Here are
  [Alan Kay](../alan-kay/), [Ben Shneiderman](../ben-shneiderman/) (direct manipulation),
  [Brad Myers](../brad-myers/), [Ted Selker](../ted-selker/), [Henry Lieberman](../henry-lieberman/)
  (programming by demonstration), [Ken Perlin](../ken-perlin/) (Pad) and
  [David Temkin](../david-temkin/).
- **Clippy.** Scott uses Clippy as the failure everyone's afraid to repeat (Ubuntu [4:30],
  KDE [5:31]). Don's answer is the I-beam ("the anti-Clippy") and Clifford Nass read
  correctly; see [ideas.md](ideas.md).

Don's design proposals that grew out of the talks (the transformation field, rigs, live
views, photographs, storeys) are in [CHARACTER.yml](CHARACTER.yml) under
`transformation_field`, always labelled as Don's, not Scott's.

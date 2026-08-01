# Mark Weiser — software collection

Recovered source code, preserved in his memorial room.

## SDI — the SunView missile game with the blizzard pie menus (1987)

[`mark-weiser-sunview-sdi/`](mark-weiser-sunview-sdi/) — 107 files of
circa-1987 SunView C, from Don's big-bag-of-old-code, unearthed 1 Aug 2026
after Don spotted Antoni Sawicki's `sunviewgames` repo
([the thread](../../antoni-sawicki/sources/2026-08-01-sunviewgames-sdi-thread.md)).

A missile-command descendant for Sun-3s: missiles launch in one window,
arc through off-screen ballistic mode, and come down on your cities in
another; interceptors on the left button, lasers on the right. "The game
object itself is close to a megabyte."

### Why it matters

- **The blizzard pie menus, in the code.** `piemenu_track.c` and
  `piemenu.h` are Mark's SunView pie menu implementation — the one he
  reported to Don on **24 Jan 1987**: "**I used the snow to hack pies
  into sunview.** It works now without walking menus. Will have walking
  over th weekend." The CHI'88 paper's "(snowed-in) weekend" and the DDJ
  article's "while snowed in at home" trace to this code.
- **The dev diary is part of the artifact.** `HISTORY.nr` (troff, feed
  through tbl and the me macros) logs the whole build hour-by-hour from
  **Dec 31 '86** (wormtest, "tuning of blast aesthetics") through May '87
  — with the closing notes: "Almost all programming was done at home
  after 10pm at night. There were no design documents, not even scrawled
  notes."
- **A self-revealing game.** The HISTORY.nr entry "Pie-menu version of
  'Things to Read'" and `source_converter.c` are the feature Don
  remembers as "a self revealing pie menu that showed you its source
  code."
- **Provenance**: wrapped as six shar files by billr@tekred on
  **17 Jun 1987**; Don's 1 May 1988 email says Mark "posted it to
  mod.sources a while ago. SDI is on the latest Sun Users Group tape,
  too." Original shars kept alongside the tarball in Don's archive.
- **Video**: the 1987 Usenix Computer Graphics workshop demo tape (shot
  on Ben Shneiderman's camera) shows SDI's pies mid-tape —
  [youtube.com/watch?v=WTtEPbIE10I](https://www.youtube.com/watch?v=WTtEPbIE10I).

### The other SDI

No relation to Josh Siegel's **LGATE** SDI simulation at Los Alamos
([the receipt chain](../../don-hopkins/sources/1988-09-14-sug-southwest-lgate-sdi-news.md))
— except that both were NeWS-era answers to the same Reagan-era acronym,
and both ended up in this archive. Mark's is the playable satire;
Josh's was driven by the Joint Chiefs.

### Getting it running

`make` on SunOS 3.x (define `SUN3.0` for 3.0). In 2026 terms: a Sun-3
emulator (TME, or SunOS under qemu-ish setups) — or, as Don put it to
Antoni, "Claude Code would probably have a field day translating it into
TypeScript so it runs in the browser."

↑ [Mark's room](../README.md) · [Pie lineage index](../../don-hopkins/sources/README.md#pie-menu-lineage-medium-canon-ingested-jul-2026) · [1991 pie tape + stylus](../sources/1991-03-mark-weiser-pie-menu-tape-stylus.md)

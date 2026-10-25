---
status: sent
character_id: brewster-kahle
public: true
consent: not_yet_asked
first_contact: "July 2026 email; Brewster replied 16 Jul 2026 (in Amsterdam November–December, up for video interviews in theory); link to this page sent 19 Jul 2026"
updated: 2026-10-25
format: remote_or_in_person
---

# Repo Show invitation — Brewster Kahle

*Brewster may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** What GitHub as a stage turned out to mean, and a lot found again through the Archive

---

Brewster —

In July you wrote that you didn't understand how GitHub is a stage, but that it sounded like an
adventure. Since then I've built enough that I can show you instead of explain it, and a surprising
amount of it was found again through the Internet Archive.

**What runs now.** David Rosenthal wrote this summer about the PDP-7 and Type 340 he used at
Cambridge as an undergraduate. The same machine ran Heinz Lemke's PIXIE in 1969, a graphics system
with radial menus. To restore PIXIE from its printed listing I built a PDP-7 and 340 emulator that
runs in a web page, and it now runs PIXIE, DUEL, PDP-7 UNIX, and Mitch Bradley's Forth:
[the cabinet](https://hyperties.org/cabinet/) ·
[a 23-minute tour](https://www.youtube.com/watch?v=lo8kdY-5i6c). Every word in core maps to its
source line and to the scanned page of the listing, so you can go from the running machine to the
paper and back. I've also restored HyperTIES, Ben Shneiderman's 1980s hypertext system, from its
original databases, including the book that came with *Hypertext Hands-On!*:
[the reading room](https://hyperties.org/archive/reading-room/). It reminded me of your 2007
wishlist for a book reader on the XO.

**What the Archive found again.** Knuth's 2022 version of his literate Adventure came from a Wayback
capture. The Living Computer Museum's videos of a transistor radio playing a PDP-7's "munching
tunes" survive only as Wayback copies, now that the museum's YouTube channel is gone, and they are
the ground truth for the sound the emulator will make. The 2013 email thread where I first described
what became Screen Angel, my app for scripting other applications' interfaces, came back from
captures of my old wiki. So did Mitch Bradley's 2008 interview about the OLPC firmware. And David
showed Mark Weiser's 1995 page for his cats from the Wayback Machine in a 2016 talk.

**Where the Archive comes in next.** David introduced me to Jason Scott on October 23. David's 2015
report for the Mellon Foundation, *Emulation & Virtualization as Preservation Strategies*, makes the
point that a page wrapping an emulator "makes it accessible in the present, not preservable for the
future." So I'd like the cabinet's programs, each with its tapes, listing, scans and provenance,
to become Archive items that the cabinet is one way to run
([what that would take](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PRESERVATION.md)).

**The stage.** All of this lives in a public git repository, and that is the stage: each guest has a
room, each show has a directory, questions arrive as issues and pull requests, and what we talk
about gets built and stays there, with its history. It's organized like a text adventure, rooms
and objects you can walk through, which is MOOLLM's idea, after LambdaMOO and Colossal Cave
([the front door](https://github.com/SimHacker/WillWrightShowForFood)).

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

You said you'd be in Amsterdam in November and December, and that you were up for video interviews
in theory. I'd love to record one with you there, or remotely, your choice. Threads, your pick:

1. **Early dreams.** The WAIS logs, the 1996 crawl, and what keeping early intent alive means now.
2. **Archive items that run.** Cartridges for the cabinet as Archive items, with Jason; what the
   Archive wants from emulated software, and what it learned from 250,000 programs in the browser.
3. **Books.** Your 2007 reader for the XO, the Archive's book reader since, and HyperTIES's books
   read again.
4. **The Sims's family albums.** Players' illustrated stories from EA's Sims Exchange survive in the
   Wayback Machine; we'd like to bring them back into a world where they can be read and lived in
   again, and the fans have already indexed much of the old Sims web.
5. **The Archive and AI.** What the Archive is doing with AI, and what you'd want it to do: models
   that cite the Archive rather than dissolve it.
6. **The Little Garden**, with Tom Jennings and Tim Pozar, if you'd like a reunion.

No preparation needed.

— Don Hopkins

---

## Everything else, if you want more

**What runs**

- [The cabinet](https://hyperties.org/cabinet/) · [the tour](https://www.youtube.com/watch?v=lo8kdY-5i6c) ·
  [PIXIE in the emulator](https://hyperties.org/databases/pixie/pixie-live/) ·
  [the PIXIE restoration](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md)
- [HyperTIES reading room](https://hyperties.org/archive/reading-room/) ·
  [the restoration](https://github.com/SimHacker/Hyperties)
- [Micropolis](https://micropolisweb.com/), SimCity as free software · [VitaMoo](https://vitamoo.space),
  The Sims 1's characters in the browser

**Preservation**

- [What preservation asks of the cabinet](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PRESERVATION.md)
- [David Rosenthal's 2015 report, with notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-rosenthal/sources/rosenthal-emulation-2015.md)
- [Open letter to museums, libraries, archives and retro computing enthusiasts](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/FOR-MUSEUMS.md)
- [Cynthia Solomon's 90 videos of Logo history, indexed](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/cynthia-solomon/videos.md)

**Your sources here**

- [The 1996 interview with Tim Pozar](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/sources/chm-interview-1996.md) ·
  [the early-dreams clip](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/sources/chm-1996-early-dreams-clip.md)
- [Your 2007 book-reader wishlist for the XO](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/sources/olpc-book-viewer-devel-2007-01-21.md) ·
  [our 2007 thread](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/sources/olpc-internet-archive-2007.md)

**People**

- [Jason Scott](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jason-scott/README.md) ·
  [David Rosenthal](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-rosenthal/README.md) ·
  [Tom Jennings](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/tom-jennings/README.md) ·
  [Walter Bender](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/walter-bender/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/README.md) — correct, extend or delete anything
- [Don Hopkins](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/README.md)

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*

---
status: draft
character_id: jason-scott
public: true
consent: not_yet_asked
first_contact: "2025-03 email (Apple II emulation); introduced by David Rosenthal 2026-10-23"
format: remote_or_in_person
---

# Repo Show invitation — Jason Scott

*Jason may edit, decline, delay, or request removal at any time — or take direct edit access. [Portrayal standards](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/portrayal-standards.md) — also covers quiet mode and onboarding.*
**Subject:** A PDP-7 and Type 340 in the browser, and the 1969 pie menus that ran on it

---

Jason —

David Rosenthal introduced us, and I owe you a reply from March 2025, when you told me the
Internet Archive runs MAME's Apple II emulation compiled to WASM so that MAME can concentrate on
accuracy. A lot has happened since then, and this page puts it in one place.

I'm Don Hopkins. At the University of Maryland I worked with Ben Shneiderman and Mark Weiser on
pie menus; our CHI '88 paper compared them with linear menus. At Sun I worked on NeWS, where David
and James Gosling first saw my pie menus ([David's story](https://blog.dshr.org/2018/05/pie-menus.html)).
I ported SimCity to HyperLook, Arthur van Hoff's HyperCard-like system for NeWS
([David's history of window systems](https://blog.dshr.org/2021/03/history-of-window-systems.html)),
worked on The Sims at Maxis, and later open-sourced SimCity as
[Micropolis](https://micropolisweb.com/).

## What I've been doing

In July, David wrote about the PDP-7 and Type 340 he used at Cambridge as an undergraduate
([My Introduction to Computer Graphics](https://blog.dshr.org/2026/07/my-introduction-to-computer-graphics.html)).
The same machine ran Heinz Lemke's PIXIE in 1969, a graphics system with radial menus that came
nearly two decades before mine. To restore PIXIE from its 128-page 1972 listing I needed a PDP-7, so I
built one.

**The cabinet** is a PDP-7 and Type 340 emulator in TypeScript, ported device by device from Open
SIMH and checked against it. It runs in a web page. Today it runs:

- **PIXIE** (1969), restored from the listing, with the light pen:
  [try it](https://hyperties.org/databases/pixie/pixie-live/) ·
  [the restoration story](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md)
- **DUEL** (1968), spacewar for two, from its paper tape
- **PDP-7 UNIX v0** from the pdp7-unix restoration: [log in as ken](https://hyperties.org/cabinet/unix/)
- **Mitch Bradley's PDP-7 Forth**, with turtle graphics on the 340
- Devices no PDP-7 ever had: a Turing machine engine running Minsky's universal machine and
  Christopher Cherniak's busy beavers, Minsky's Ultimate Machine, and a DataHand that reports your
  webcam hand to the PDP-7. In ULTIMATE HAND, written in Forth, you are the Ultimate Machine's hand.

[Everything in the cabinet](https://hyperties.org/cabinet/) ·
[source](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet)

Every word in core maps to its source line and to the scanned page of the listing it came from,
so you can go from the running machine to the paper and back.

One more thing to play with: [vitamoo.space](https://vitamoo.space), character animation from
The Sims 1 running in the browser, open source. The same WebGPU renderer will draw the PDP-7, the
340, the Teletype and Heinz at the console in 3D, which makes modelling the machines mostly an
art task ([the portrait](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PORTRAIT.md)).

## Why I think you'd find it interesting

You and the Archive made click-to-play emulation normal at library scale, and the cabinet's design
notes adopt your lessons about save-state portability as rules
([WEB-BENCH.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/WEB-BENCH.md)).
The cabinet covers machines that MAME doesn't, including the 340's vector display (you noted in
2014 that vector games were among the hard cases for the Internet Arcade). It keeps the software
and its documents together, which I hope fits the Archive's "Access Drives Preservation."

There is also a preservation problem in this story. The two 1969 PIXIE films were found and
digitized in 2019 and 2020 through David Chapman at Cambridge University Library
([the story](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)).
By this October the library's embedded copies had become unreachable, and for now my attributed
copies are on YouTube: [B&W](https://youtu.be/j9R63T2xGCA) · [color](https://youtu.be/lCrl5QmQ9aA).

I wrote an [open letter to computer museums, libraries, archives and retro computing enthusiasts](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/FOR-MUSEUMS.md)
about what the cabinet offers them and what would help. It was written with people like you and
David in mind.

## Adventures and MUDs

The other thing I've been building should feel familiar to you. [MOOLLM](https://github.com/SimHacker/moollm)
treats a git repository as a text adventure for people and LLMs together: directories are rooms,
files are the objects in them, and characters are files that a person or a model can play. Its
[adventure skill](https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md) follows
Colossal Cave, Zork, MUD and LambdaMOO, down to Infocom's BRIEF and VERBOSE, and there is a
[maze of twisty little passages, all alike](https://github.com/SimHacker/moollm/tree/main/examples/all-alike-maze).
Will Wright Show For Food, the repo this page is in, is built the same way: each guest has a room,
and [Richard Bartle](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/richard-bartle/README.md)
has one too.

## Things I'd like to talk about

1. Whether cabinet tapes, listings and disk images would make sense as Archive items, with the
   cabinet running them the way the Emularity runs MAME and DOSBox.
2. A durable home for the PIXIE films and the Cambridge scans, with Cambridge's blessing.
3. The Apple II thread from 2025: the cabinet's virtual instruments (an Engelbart mouse and keyset,
   the DataHand) are designed to plug into an Apple ][ as well, once it has a 6502.
4. Your own work, on a **Repo Show**: a recorded conversation whose stage is a public GitHub repo.
   textfiles.com and the BBS era, *GET LAMP*, Archive Team, and emulation at library scale.
5. Adventures, MUDs and LLMs: what *GET LAMP*'s interviews say about play that MOOLLM should learn
   from, and the Infocom sources you put on GitHub in 2019.

**Will Wright is in — he's signed on to do the [premiere](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/will-wright-premiere/README.md) and more.**

Remote is fine, or in person if we're in the same place. Zero homework, as much *homefun* as you
are up to.

— Don Hopkins *(the User Interface Flower Child)*

---

## Everything else, if you want more

**The PDP-7 and PIXIE**

- [David's PDP-7 story](https://blog.dshr.org/2026/07/my-introduction-to-computer-graphics.html) ·
  [PIXIE restoration](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md) ·
  [the Cambridge films](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)
- [Heinz Lemke](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/heinz-lemke/README.md)

**The cabinet**

- [README](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/README.md) ·
  [manifesto](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MANIFESTO.md) ·
  [roadmap](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/ROADMAP.md) ·
  [web emulators we learned from](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/WEB-BENCH.md)
- [UNIX v0](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/UNIX-V0.md) ·
  [the Turing engine and the Ultimate Machine](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md) ·
  [the DataHand](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/HAND-TRACKING.md)
- [Open letter to museums, libraries, archives and retro computing enthusiasts](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/FOR-MUSEUMS.md)

**Other restorations**

- [HyperTIES](https://hyperties.org/archive/reading-room/), Ben Shneiderman's hypertext system,
  which I worked on at Maryland: [the reading room](https://hyperties.org/archive/reading-room/) ·
  [my letter to Ben](https://github.com/SimHacker/Hyperties/blob/main/docs/README.md)
- [CAM6](https://donhopkins.com/home/CAM6/), my cellular automata machine simulator, and the
  courseware Norman Margolus has given me permission to build from his and Tommaso Toffoli's book:
  [Norman Margolus](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/norman-margolus/README.md)
- [Micropolis](https://micropolisweb.com/), SimCity as free software

**Adventures and MUDs**

- [MOOLLM](https://github.com/SimHacker/moollm) ·
  [the adventure skill](https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md) ·
  [what MOOLLM learns from MOO and LambdaMOO](https://github.com/SimHacker/moollm/blob/main/designs/MOO-HERITAGE.md) ·
  [a maze, all alike](https://github.com/SimHacker/moollm/tree/main/examples/all-alike-maze)
- [Richard Bartle](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/richard-bartle/README.md)

**Pie menus and window systems**

- [David on pie menus](https://blog.dshr.org/2018/05/pie-menus.html) ·
  [Pie Menus: A 30 Year Retrospective](https://donhopkins.medium.com/pie-menus-a-30-year-retrospective-5bdcb24a835a)
- [David's history of window systems](https://blog.dshr.org/2021/03/history-of-window-systems.html) ·
  [HyperLook SimCity demo transcript](https://donhopkins.medium.com/hyperlook-simcity-demo-transcript-17f627eab14a)

**People**

- [David Rosenthal](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/david-rosenthal/README.md) ·
  [Ben Shneiderman](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/ben-shneiderman/README.md) ·
  [Mark Weiser](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/mark-weiser/README.md) ·
  [Brewster Kahle](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brewster-kahle/README.md)
- [Your page](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jason-scott/README.md) — correct, extend or delete anything
- [Don Hopkins](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/README.md)

*P.S. The repo is in quiet mode while invitations go out — please don't share links publicly just yet.*

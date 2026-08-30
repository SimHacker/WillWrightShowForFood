# TinyMUD archive (1989-1990)

Primary mirror: [donhopkins.com/home/archive/mud/](https://donhopkins.com/home/archive/mud/)

Captured 2026-08-30 from Don's web archive plus local copies of all four
files. This README is the index and summary; the `.txt` sources live
beside it unchanged.

## The four files

| File | Date | Size | What it is |
|------|------|------|------------|
| [meeting.log.txt](meeting.log.txt) | 1989-12-11 | 44K | **Minutes of the First TinyMUD Robotics Conference**, held in-world 12/9/89 7PM EST in the Robot Room off the Rec Room. Stenographer: Fiona (Stewy typing). ~40 participants. |
| [mud-log.txt](mud-log.txt) | 1990-04-23 | 19K | **Player notebook**: Oxford English Dictionary of TinyMUD commands, control volumes, in-game email how-to, player directory entries, Gloria bot help text, flexi/Terminator logs, notes on OUTPUTPREFIX/SUFFIX. |
| [mud-map.txt](mud-map.txt) | 1990-04-23 | 72K | **Rec Room exit crawl**: every advertised exit from the Rec Room, with the room description you get when you go there. A map of CMU TinyMUD as a social universe hub. |
| [tinymud.txt](tinymud.txt) | 2005-05-20 compile | 25K | **Email corpus**: launch announcement, server moves, Zarf's MIDgaard proposal, **Don's "what could be..." language letter**, furBot mapping treatise, Don's robot-protocol posts, Brian Harrison's robot ethics. |

Together they are a time capsule of **programmable social worlds before the web**:
builders, robots, ethics, parsers, and the question "what language should
objects speak?" -- all in December 1989.

## Don Hopkins in this archive

### Directory entry (mud-log.txt)

From the in-game white-pages directory:

> **don** -- Don Hopkins // **don@brillig.umd.edu** // (301) 474-8027, (301) 454-1517

He also registered `don-emailbox` in the TinyMUD mail system (`>name
unused-emailbox-5 = don-emailbox;don`).

### "what could be..." (4 Dec 1989)

Don's reply to Andrew Plotkin ("Zarf") and Moonchilde, who were designing
**MIDgaard** -- a Multi-Implementor Dungeon with object-oriented rooms and
a "cheapo Pascalish" behavior language. Don's advice, which aged well:

1. **Do not invent a language.** "Language implementation is a bitch,
   language design is a big hairy mother of a bitch, and the biggest
   nastiest bitch of all is writing the manual."
2. **Use an interactive existing language.** C is "right out" -- not
   interactive, "no fun anymore."
3. **Ranked candidates:**
   - **PostScript / NeWS** (top pick): lightweight processes, event queue,
     OO PostScript, graphical adventures; cites Rehmi Post's PreScript.
   - **Scheme**: small, powerful; lacks NeWS-style processes unless you
     build them.
   - **Forth**: Mitch Bradley's 68000/SPARC system; "always wanted to
     write an adventure authoring system in Forth."
   - **Lisp**: "Ho hum. Scheme is more elegant."
   - **Perl**: "studly" but syntax is a mash; good adventure shell.
   - **ZIL / MDL**: Infocom lineage; "I'd do just about anything for
     original muddle Zork sources."
   - **DDL** (Dungeon Definition Language): found in 4.3BSD VAX sources;
     not interactive but worth stealing ideas from.

This letter is the **genealogy of SimAntics-by-other-names**: programmable
object behavior in a multi-user world, argued in public on a mailing list
weeks before Will Wright would ship SimCity and years before The Sims.

### Mapping droids thread (19-20 Dec 1989)

After fur (Roy Riggs) published furBot's graph-mapping algorithm, Don
posted twice:

**Room identity without numbers:** Think Adventure's maze -- drop ball
bearings, do not let robots `@create` garbage; checksum descriptions but
know that fails on "You're an amazingly twisted little ass, always
different." Wants **PostScript or Scheme**, not mlisp; cites Rehmi Post's
NetScript (NeWS without graphics, C extensibility).

**Robot back-channel API:** Proposes port 4202 with **tagged packets** --
object types, IDs on every database string, typed message kinds (room
name, description, page, command reply, ignorable "Contents:"). Wants to
download PostScript procedures that define wire format. Asks whether
OUTPUTPREFIX/OUTPUTSUFFIX delimit *only* command replies. Building an
**Emacs hypertext MUD client**: one window per room, clickable objects,
parallel personal database, auto-kill ultratron on entry.

Brian Harrison's reply coined **robot ethics**: do not flood with ofail
spam; ask "mind if I map?"; bread crumbs optional because room contents
already disambiguate; hidden exits bit + `exits` command wish; Gloria as
nav server; "garbagemen should be called maids or butlers."

## First TinyMUD Robotics Conference (meeting.log.txt)

**When:** 12/9/89, ~7PM-9PM+ EST, Robot Room (# off Rec Room).
**Chair:** fur (Roy Riggs, gp5@mentor.cc.purdue.edu).
**Wizard present:** Jim Aspnes (TinyMUD author).

### Who showed up

fur, Fiona/Stewy, Wizard (Aspnes), Fuzzy (Gloria's author), flexi (Bennet
Yee -- Terminator, automaton code), MisterX, Prothan, Majik, Vern,
Hobbit, Tortoise, Yossarian, Gloria (in-world), and ~20 others.

### Robot census (languages)

| Builder | Robot | Language / method |
|---------|-------|-------------------|
| Fuzzy | Gloria | C, TCP sockets |
| flexi | Terminator, Mr.Multiply | C, lex/yacc automaton; 3s delay between commands |
| fur | furBot | C sockets (to be published) |
| Stewy | Danny the Hermit | Emacs Lisp |
| What | (unnamed) | BASIC via terminal |
| Wizard | auto-Beaker | Emacs Lisp (half hour total) |
| Vern | NARC | Pascal, two processes + comm file |
| Prothan | slave | (unnamed) |

Connection methods: raw TCP sockets (preferred), `exec telnet` with pipes,
spawned telnet child. **TinyMUD is not public domain** (flexi corrected
someone who suggested copying its network code).

### Policy debates (still live in 2026)

- **Ethics:** Is fooling robots fair? Prothan yes; Fuzzy draws line at
  "traps" that force complexity; Wizard: hostility to robots = hostility
  to users; flexi: do not hog world modeler.
- **Rate limits:** v1.4 throttles command flood; cannot CPU-DoS but can
  still object-spam the database (1500-room macro incident on TinyHELL).
- **Tape recorders / lurkers:** Wizard says they must appear on WHO with
  single-word names like players.
- **Useful robots:** Gloria (talk, quotes, map, charity); town crier,
  guard, plot device; vending machines; apartment generators.
- **Infrastructure:** Stewy proposes dedicated robot MUD; fur publishes
  socket code; flexi FTP `play.mach.cs.cmu.edu:/usr/bsy/src/automaton/`;
  MisterX offers Radiant City Robots framework; mailing list →
  `asp@cs.cmu.edu`; alt.mud / rec.games.multi-user debated.

### Technical teach-in (end of meeting)

fur walks through sockets as file descriptors: `open`, `read`, `write`,
`select`/poll for non-blocking input, fifth helper to check pending bytes.
Introduces **OUTPUTPREFIX** / **OUTPUTSUFFIX** for framing command
responses. Fuzzy publishes Gloria guts at `NL.CS.CMU.EDU:/usr/mlm/ftp/robot.c`.

## mud-log.txt -- the command encyclopedia

TinyMUD's builder vocabulary, copied like a sacred text:

- **Player commands:** drop, get, give, go, look, say, kill, rob, ...
- **Builder commands:** dig, open, link, lock, describe, fail, success,
  create, examine, find, set (DARK, LINK_OK, STICKY, TEMPLE, WIZARD), ...
- **Control volumes:** ownership rules, linkability, stickiness, homes,
  droptos, recycling (nothing destroyed -- only renamed/sacrificed).
- **Wizard words:** dump, shutdown, teleport, force, chown, toad.
- **Undocumented:** goto, take, read, open-and-link in one step.

### In-game email (circa 1990)

Full postal system built from game primitives:

- Register `NAME-emailbox` via flexi from unused-mailbox slots.
- Send mail: create object, set success msg, lock to recipient, drop in
  their mailbox, `set sticky` for return receipt.
- Drop-chute mail for non-sticky delivery.
- Directory lists every mailbox name; white-pages tomes in alcove.

This is **GitHub Issues implemented as world physics** -- the same move
Soul City makes with About boxes and object pages.

### Notable directory entries (snapshot of the community)

Jim Aspnes (Wizard), Stewart Clamen (stewy), Bennet Yee (flexi), Danny
Sleator (Darooha), Marc Ringuette (sluggo), John Ockerbloom (Yossarian),
Andrew Plotkin's circle (Moonchilde), Guy Jacobson, Dave Eckhardt (Daemon),
and dozens of CMU/MIT/Wesleyan/RPI undergrads who would go on to build
the internet.

## mud-map.txt -- the Rec Room as portal

The Rec Room is `#58240R`: "large, darkened room... stone fireplace... lawn
chair hanging by one foot from the ceiling." **Over 200 named exits** to
player-built worlds: flexi's office (5103 WeH), Harvard Square, MIT
antechamber, Wizard's room, Philcon '89 party room, alcove (emailboxes),
Brillig (Don's VAX -- `clh` exit), HRSFA, Balloon Central, Winter
Wonderland, Heart of Gold, Temple O' Slack, and on and on.

Many exits are jokes, traps, or CLOSED FOR RENOVATIONS. The file is both
**atlas and anthology** -- each `>go` records what the builder wrote that
week.

Notable for WWSFF/Soul City lineage:

- **Brillig** room contains Don's VAX, Pluribus IMP, LA36, "duct-tape
  gerbil", and **"an amazingly twisted little ass, always different"**
  (the Adventure maze joke he cites in the mapping thread).
- **Robot Room** off `>go robot` -- Nightfall's Many Rooms of Wonder.
- **Gloria's Office** -- mapping robot HQ.
- **5103 WeH** -- flexi's real grad office with Moriarty workstation.

## tinymud.txt -- timeline in email

| Date | Event |
|------|-------|
| 1989-09-11 | Todd Masco evangelizes TinyMUD (`telnet 128.2.242.79 4201`); Castle Anthrax; full Adventure port; Temple sacrifice for pennies. |
| 1989-11-28 | Aspnes moves DB to daisy.learning.cs.cmu.edu:4201; many changes lost. |
| 1989-12-03 | Zarf announces MIDgaard (OO + programmable objects + better parser). |
| 1989-12-04 | **Don's language letter** (above). |
| 1989-12-04 | Aspnes releases TinyMUD 1.3.1 source via FTP. |
| 1989-12-09 | Robotics conference (meeting.log). |
| 1989-12-19 | fur publishes furBot mapping algorithm (ordered tree, exit hashing, BFS). |
| 1989-12-19-20 | Don's mapping + protocol posts; Brian Harrison robot ethics. |

## Lineage to Soul City / The Sims / MOOLLM

| 1989 TinyMUD idea | 2026 descendant |
|-------------------|-----------------|
| Programmable object behavior (MIDgaard) | SimAntics; Soul City VPRL / plugin ladder |
| Don picks PostScript for processes + events | NeWS, pie menus, HyperLook, SimCity UI |
| Builder fail/success/osuccess messages | Object pie menu actions; preview runtime |
| In-game email from objects | About slice; object pages; GitHub issues |
| Robot ethics (rate limit, don't spam ofail) | Identification rewards; no upload flooding |
| Tagged robot wire protocol | GUID registry descriptors; manifest lockfiles |
| Rec Room as infinite portal hub | Soul City districts; sims1 suburbia of saves |
| OUTPUTPREFIX/SUFFIX framing | Parser for MUD-style command replies in tools |
| furBot graph + Gloria nav server | GUID clustering; closure-aware remapping |
| "Extend the construction set" (Vern) | TMog suite; AnythingOMatic; object shops |

## People to cross-link later

- **James Aspnes** (Wizard) -- TinyMUD author; later Yale CS theory.
- **Andrew Plotkin / Zarf** -- MIDgaard; Inform; decades of parser IF.
- **Roy Riggs / fur** -- furBot mapping; Purdue.
- **Fuzzy** -- Gloria robot; published C TCP code.
- **Bennet Yee / flexi** -- Terminator; CMU security legend.
- **Stewart Clamen / stewy** -- conference minutes; CMU SCS.
- **Brian Harrison / brie** -- robot ethics post; HyperCard MUD front-end idea.
- **Rehmi Post** -- PreScript/NetScript cited by Don (NeWS lineage).

## Related in this repo

- [1991-09-project-duh-multimedia-mud.md](../1991-09-project-duh-multimedia-mud.md) -- Don's later multimedia MUD pitch
- [qgcon-inclusivity-paper](../../../../catalogs/soul-city/) -- procedural rhetoric thread
- [object-shops.md](../../../../catalogs/soul-city/object-shops.md) -- VPRL, preview runtime
- [guid-registry.md](../../../../catalogs/soul-city/guid-registry.md) -- clustering, reference descriptors

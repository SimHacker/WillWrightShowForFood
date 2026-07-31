# Ideas to explore with James Gosling ☕

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in James's
public work and documented connections to this repository. Things Don would love to follow
**with** James Gosling; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What James has done

James Gosling (b. 1955, Calgary; CMU PhD 1983) — the father of Java. Before Java he wrote
Gosling Emacs (the first Unix Emacs, sold by UniPress — RMS's "Evil Software Hoarder Emacs",
which spurred GNU Emacs), co-designed the **Andrew** window system (CMU, with David Rosenthal),
and architected **NeWS/SunDew** at Sun — a PostScript-programmable network window system years
ahead of its time (an AJAX architecture avant la lettre). Self-described record-holder for "the
largest number of cheesy little extension languages." Later Chief Software Architect at Liquid
Robotics (Wave Glider ocean robots). Order of Canada; ACM Fellow; IEEE John von Neumann Medal.

## Shared ground

- **PDP-8 hotrod photo** — young Gosling, arms crossed, satisfied, in front of his DEC rack
  ([`media/gosling-young-pdp8-hotrod.yml`](media/gosling-young-pdp8-hotrod.yml)); contrast
  [`../heinz-lemke/`](../heinz-lemke/README.md) PDP-7/Titan PIXIE distributed CAD
- NeWS reunion — Gosling, Rosenthal, van Hoff, Densmore; [`send-code-not-commands`](../../process/trails/send-code-not-commands.md)
- CS547 1995 Java talk — Don on camera; Terry's archive

## The hooks

### 1. Alvey 1985 — Methodology of Window Management
**SunDew** (NeWS precursor) + **Andrew window manager** (with Rosenthal) — published in the
same Alvey workshop proceedings as **Warren Teitelman's** *Ten Years of Window Systems*.
Both **published and participated** in working-group discussions (architecture, input, redraw).
Teitelman later managed Sun's **NeWS Toolkit** — **Don's manager** there (pie menus, PizzaTool).
Warren invented **DWIM** (*Do What I Mean*) in Interlisp.

| Thread | Link |
|--------|------|
| Gosling angle | [`window-systems-lineage.md`](window-systems-lineage.md) |
| Rosenthal + X11/ICCCM | [`../david-rosenthal/window-systems-lineage.md`](../david-rosenthal/window-systems-lineage.md) |
| Proceedings | [Chilton — Methodology of Window Management](http://www.chilton-computing.org.uk/inf/literature/books/wm/index.htm) |
| unnatural-selection panel | [`../../repo-shows/unnatural-selection.yml`](../../repo-shows/unnatural-selection.yml) · [`../david-rosenthal/02-alvey-1985-icon-selection-table.md`](../david-rosenthal/02-alvey-1985-icon-selection-table.md) |

### 1b. unnatural-selection — co-guest with Rosenthal + Ted Nelson
Walk the **expandable Alvey table** (icon column vs selection column). SunDew vs ICCCM treaty.
NFS/NeWS/X11 send-code thread. Individual or group calls; post-production integrate.

### 2. Show seed: `repo-shows/james-gosling/`
NeWS → Java; walk the repo on air and build from the seed.

### 3. PDP-8 hotrod — bare-hands rig class
Don loves the photo — young James, arms crossed, **satisfied**, in front of his **PDP-8 hotrod
muscle car**: fully loaded DEC rack (front panel, DECtape 0 and 7, patch bays). Not gatekept
glass-room timeshare — *his* iron. **On-air ask**, not a lecture:

- Whose rig? What was running? What had just worked?
- From toggling switches → Gosling Emacs → NeWS → Java — what carried?

Sidecar + questions: [`media/gosling-young-pdp8-hotrod.yml`](media/gosling-young-pdp8-hotrod.yml)

Repo ethos (Hardware Hacker Builder audience): *Schematics in the repo. No gatekeeping.
Bare-hands rig class welcome.* — [`../../process/VISION.md`](../../process/VISION.md)
Contrast: [`../heinz-lemke/`](../heinz-lemke/README.md) PDP-7/Titan PIXIE satellite graphics.

### 4. NeWS reunion (optional group)
Rosenthal (Andrew + ICCCM), van Hoff (HyperLook), Densmore — Alvey papers as shared origin story.

### 5. Retirement fun — the side-project list
His retirement post promised "a long list of side projects to plough through." The lander.ps
dare ([`sources/2026-07-31-linkedin-retirement-thread.md`](sources/2026-07-31-linkedin-retirement-thread.md))
volunteers to be on it — design notes for the SIMH AM radio + lightpen drivers:
[`repo-shows/simh-am-radio-lightpen.md`](../../repo-shows/simh-am-radio-lightpen.md)
(GNU Radio receiver, SIMH RFI tap, and the happy fact that the PDP-7's 1.75 µs memory
cycle puts its fundamental at ~571 kHz — inside the AM broadcast band). Warm-up material from the r/programming reception
([`sources/2024-07-05-reddit-retirement-thread.md`](sources/2024-07-05-reddit-retirement-thread.md)):

- **Gosling Emacs outlived everything** — top comment was about Emacs, not Java; people still
  load gosmacs keybindings 40 years on; the redisplay algorithm is its own rabbit hole.
- **Full circle at Amazon** — Corretto (post-Oracle-license OpenJDK) and AWS IoT Greengrass;
  Java began as Oak for embedded devices, ended shepherding embedded fleets.
- **Sea robots** — Liquid Robotics Wave Gliders on JRE 7/8 ARM, soft float to hard float.
- **The 3-month Google stint** — thought the monorepo was doomed, wanted Git in 2011. Which
  prognostications panned out? (Ask, don't ambush.)

### 6. The redisplay algorithm — skull and crossbones
*A Redisplay Algorithm* (1981) — archived in the repo:
[`sources/EmacsRedisplayAlgorithm.pdf`](sources/EmacsRedisplayAlgorithm.pdf). Dynamic
programming through a cost matrix of string edit operations — string-to-string correction
(Wagner–Fischer) applied to terminal escape codes, insert/delete line costs, padding for slow
terminals. Full-screen redraw in 0.12s CPU on a VAX 11/780; 0.004 CPU seconds per keystroke.
Don's HN walkthrough (which strangers still link as their rabbit-hole entrance):
[`sources/2020-04-12-hn-redisplay-algorithm.md`](sources/2020-04-12-hn-redisplay-algorithm.md).

On-air threads:

- The famous **skull-and-crossbones** warning over the display code — *"If you think you
  understand it, You Don't, So Look Again."* Trivia with legs: the ASCII art originally came
  from **Brian Reid's Scribe** (uncopyrighted) — and [Brian Reid](../brian-reid/README.md) is
  a PostScript-lineage guest of this show. Scribe → Gosling Emacs → this repo.
- Redisplay as proto-diff: same math as Levenshtein/diff, spent on 300-baud modems. When did
  clever become overkill — and what's today's equivalent of the cost matrix (React
  reconciliation says hi)?
- Chris Torek's "severe munging and destruction" credit line in the UMD `display.c` — code
  archaeology as comedy.

### 7. Morning Sam. Morning Ralph. — the holy wars punch out
Fantasy card, staged like Ralph Wolf and Sam Sheepdog punching the timecard:
[`repo-shows/morning-sam-morning-ralph.yml`](../../repo-shows/morning-sam-morning-ralph.yml)

- **Bout 1 vs Bill Joy** — Emacs vs vi, fought by two guys who shared Sun for twenty years.
  Both editors were answers to the same slow wire; the war was about which resource to spend.
- **Bout 2 vs RMS** — MockLisp vs Emacs Lisp, Evil Software Hoarder vs Free Software. The
  contested display code is the very skull-and-crossbones redisplay archived in this room.
  Punch-out question: name one thing the other guy was right about.

Time-shifted corners welcome; a joint call is the dream, not the requirement.

## Sources (public)

- [`invitation.md`](invitation.md)
- [`window-systems-lineage.md`](window-systems-lineage.md)
- Show seed: [`repo-shows/james-gosling/`](../../repo-shows/james-gosling/)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml) — mail-sourced artifacts
- [`CHARACTER.yml`](CHARACTER.yml)

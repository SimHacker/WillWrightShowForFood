# "Who can guess what this is?" — the Facebook PIXIE guessing game (24 Jul 2026)

Hours after the [assembler listing was transcribed](pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md),
Don posted listing pages to the **Internet Old Farts Club** Facebook group as a guessing game —
and the thread became a live demonstration of exactly the archaeology this repo does, crowd-sourced
in under an hour. 41 comments and climbing the same evening.

This is the show format working **time-shifted**: evidence posted cold, an audience of
veterans deducing in comments, corrections arriving from people who were *there* (or one
machine over), the whole exchange preserved and replayable. A Repo Show episode is this
thread with voices and a screen recording; this write-up is the thread checked into git so
the discussion can keep happening — in the repo, on stream, or fifty years from now.

## The game

Don posted the SYMELEC page with `INTMO,`/`SCAMO,` (change intensity / change scale, the
light-button handlers around `PEN1` and `BLINK`) captioned only "Who can guess what this is?"
— then dripped clues: the listing header page, "Blinkenlights!" (the display-file pages), "Here
is some networking code!" (the `/LINK TRANSFER ROUTINE FOR PIXIE (PDP7-TITAN)` page), the
SYMELEC symbol table, the `/RING STRUCTURE PROCESSOR MAY 1969` page, and finally the reveal:
[*Flight of the PIXIE* — Yuja Wang](https://www.youtube.com/watch?v=jDrqR9XssJI).

## The deduction chain (the crowd got there in ~40 minutes)

1. Early guesses: PDP-8, Moon Lander, "Part of the pen driver code from an old space war
   computer game?", Super Mario Bros.
2. **Darryl Robert Seamans** spotted the label `PEN1` — "something to do with a light pen?"
3. **Don Baccus** nailed the family from the word width: "18 not 12 bit so PDP-1/4/7/9/15
   family" — six 3-bit octal digits per word, `777777` = −1 in 18-bit two's complement.
4. Baccus first guessed *original PDP-1 Spacewar* from the light pen + blinking + fame
   heuristic; **Stavros Macrakis** corrected: PDP-1 and light pen sound right, "but Spacewar
   didn't use the light pen" (tic-tac-toe and Mouse in a Maze did).
5. Don to James Temple's PDP-8 guess: "Your guess is so close it's an off-by-one error!" —
   and on the `12 2 72` header: "Those numbers at the top are not a date, it wasn't from 1957!"
   (it's the Cambridge assembler's `ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470` stamp).
6. The Titan link-transfer page gave it away. Baccus: "OK I have totally cheated. It's an
   early CAD program named 'Pixie' running on a PDP-7 hooked up to a TITAN mainframe at the
   University of Cambridge. Presumably the PDP-7 front-end handled the graphics and light pen
   code while the TITAN ran the heavy computations." Exactly right.

## The players

- **Don Baccus** — the thread's ace deducer, and no accident: 14 years as "Hacker and The
  Big Honcho" at **Oregon Software** (1977–91, the Portland compiler house — Pascal-2 for
  DEC machines), which is why 18-bit-vs-12-bit word width was his *first* observation.
  Later a co-founder of **OpenACS** (led the ArsDigita Community System port from Oracle to
  PostgreSQL) and a PostgreSQL contributor of the 2000 era — plus a published ornithologist
  and nature photographer ([donb.photo.net](https://donb.photo.net),
  [birdnotes.net](http://birdnotes.net)). Not to be confused with John Backus of
  FORTRAN/BNF fame, though the near-collision is period-appropriate.
- **Stavros Macrakis** — MIT Project MAC, **Macsyma team** (wrote its compiler and math
  modules, helped maintain MacLisp; Harvard CS PhD; still a maintainer of Maxima, Macsyma's
  open-source descendant). When he says Spacewar! didn't use the light pen, that's MIT
  lab-lore speaking with authority — tic-tac-toe and *Mouse in the Maze* were the
  light-pen games.
- **The chorus** (backgrounds as self-stated in thread): Bruce Orcutt (PDP-7, PDP-11s,
  VAXstations), Andrew Birner (GE/Honeywell 36-bit octal — L66, DPS8), Bob Eager, Darryl
  Robert Seamans (spotted `PEN1`), James Temple (guessed "assembler listing" — off by one
  PDP), Harwell Thrasher, Jim Cottrell, EJ Jaquay, Ed Gurski, Wim ten Brink, and Steve
  Cramer, whose "assembly code when a migraine is about to hit" deserves a lower third.

## Threads worth keeping

- **The Type 30 / Type 340 exchange** — Baccus: "Original Spacewars on the 18-bit PDP-1."
  Don: original Spacewar! ran on the **Type 30 Precision CRT**; PIXIE drives the **Type 340
  Precision Incremental** (also offered for the PDP-1 — [H-340 manual](https://bitsavers.org/pdf/dec/graphics/H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf), p.1).
  Full comparison + mirrored manuals: [`pdp7-reference/`](pdp7-reference/README.md).
- **The recruiting hook** — Don: "SIMH implements both displays! But it needs a virtual
  Lightpen driver to run this code. Anybody want to help write one? 😉" The starter kit for
  any volunteer: [reference library + mission brief](pdp7-reference/README.md), the
  [recovered source](pixie-assembler-listing-1972/README.md), and the Type 370 light pen
  diagnostic as the acceptance test.
- **Prior art** — Don, under the May 1969 Ring Structure Processor page: "I hope this
  invalidates the fuck out of some software patents!" A 1969 dynamic ring-structure store
  with garbage collection driving interactive graphics, timestamped by a lineprinter.
- **Audience proof for the show** — a cold room of retired engineers reverse-engineered
  machine, architecture, application, and institution from four page scans in under an hour.
  That *is* the Repo Show format working: evidence on screen, audience deduces live.

## Sequel — Ric Werme finds Planning Document 10 (25–26 Jul 2026)

Don dripped the networking page (`LTPX,` / `LINK TRANSFER ROUTINE FOR PIXIE (PDP7-TITAN)`).
Baccus: "PDP-7, not PDP-1, then… This program appears to be called 'Pixie'." Then
**Ric Werme** did the librarian move: *"I see 'PDP7-TITAN'. That gets me to"*
[Cambridge Supervisor Planning Document 10](https://cucps.soc.srcf.net/titan/supplan/pd10.htm)
— *Software for the Titan/PDP-7 link*, **C.A. Lang, 2 December 1965**. Facebook's own
link preview returned **403 Forbidden**; the document is live in a browser and now
**mirrored in-repo** so students never depend on the crawler:

→ [`pdp7-reference/cambridge-supervisor/`](pdp7-reference/cambridge-supervisor/README.md)
([readable MD](pdp7-reference/cambridge-supervisor/pd10-titan-pdp7-link.md) ·
[HTML mirror](pdp7-reference/cambridge-supervisor/pd10-titan-pdp7-link.htm))

Don: *"wow thank you, that document is very helpful for documenting the hardware and
software and getting the code running again!!"*

PD10 is the missing **system** spine under PIXIE's application blocklets: Titan-as-master,
Attentions (light-pen sees / display interrupts queued on the PDP-7), 18→48-bit packing
extracodes, Titan disk via a peer program, and the explicit recommendation of a **second
teletype** at the PDP-7 — the architectural blessing for Heinz's two-chair nightly
workflow. How it maps onto `/LTPIX`:
[`TITAN-LINK-PROTOCOL.md`](pdp7-reference/TITAN-LINK-PROTOCOL.md).

## Links

- Reveal video: *Flight of the PIXIE* — <https://www.youtube.com/watch?v=jDrqR9XssJI>
  (Don's edit of the Chapman digitizations, [production story](../cambridge-films-flight-of-the-bumblebee.md))
- The listing the pages came from: [`pixie-assembler-listing-1972/`](pixie-assembler-listing-1972/README.md)
- How it was transcribed the same day: [`TRANSCRIPTION-REPORT.md`](pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md)
- CUCPS PD10 (public): <https://cucps.soc.srcf.net/titan/supplan/pd10.htm>
- Local PD10 kit: [`pdp7-reference/cambridge-supervisor/`](pdp7-reference/cambridge-supervisor/README.md)

↑ [Thread index](THREAD-INDEX.md) · [character README](../README.md) · [show seed](../../../repo-shows/pixie-pie-menus-pdp7.yml)

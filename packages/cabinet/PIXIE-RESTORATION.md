# Restoring PIXIE: from a 1972 printout to a tool its author uses

Don Hopkins, October 2026. For Heinz Lemke, Roy Eagleson's students, the hackers who helped, and
anyone who asks how this was done. Written to be read, linked into section by section, and argued
with. The sources for every claim are linked inline; the corpus is indexed at the
[end](#where-everything-is).

**Contents:** [What PIXIE is](#what-pixie-is) ·
[Is this reverse engineering?](#is-this-reverse-engineering) ·
[What survived](#what-survived) · [Transcribing 128 pages](#transcribing-128-pages) ·
[The emulator as an instrument](#the-emulator-as-an-instrument) ·
[Test programs](#test-programs-as-test-equipment) · [The bug journal](#the-bug-journal) ·
[Running it against the films](#running-it-against-the-films) ·
[The Titan link](#the-titan-link-the-part-that-is-reverse-engineering) ·
[Rings, and Forth](#rings-and-forth) · [The people](#the-people) · [Users](#users) ·
[What it cost](#what-it-cost) · [Open questions](#open-questions) ·
[Cambridge sources and contact leads](#cambridge-sources-and-contact-leads) ·
[Where everything is](#where-everything-is)

## What PIXIE is

PIXIE is an interactive graphical editor for graph-theoretic models (electronic circuits, syntax
graphs, control systems) that Heinz Lemke wrote at the Cambridge University Mathematical
Laboratory with Neil Wiseman and John Hiles, published in 1969
([paper](https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf):
Wiseman, Lemke, Hiles, *PIXIE: A New Approach to Graphical Man-Machine Communication*, Proc. 1969
CAD Conference, Southampton, IEEE Conference Publication 51, pp. 463–471). It ran on a PDP-7 with a Teletype,
a Type 340 vector display and a light pen, connected to Cambridge's Titan mainframe by Neil
Wiseman's link. Its light pen menu pops up around the tracking cross, which makes it one of the
earliest known radial menus.

The PDP-7 was not a dumb terminal. In Heinz's words
([pixie-source-recovery.md](../../characters/heinz-lemke/pixie-source-recovery.md)): the 5000
instructions "were primarily designed to interactively build up data structures for graph
theoretic models (these had to fit in the remaining 3000 words on the PDP 7) … which were then
sent to the Titan computer for simulation." 5000 words of interaction code and a 3000 word live
model, in 8K.

PIXIE began with a lecture. Maurice Wilkes encouraged Heinz to give a talk at Cambridge in March
1967, and on 29 June 1967 Heinz gave his first lecture at the Mathematical Laboratory; a second,
on PIXIE and the Rainbow project, followed in 1970. Wilkes attended both. Heinz met Joseph
Weizenbaum at MIT in 1969 while presenting PIXIE on a tour of American labs.

Heinz is the person in the 1969 films running the code, and he is still very active. He is
Editor-in-Chief of the *International Journal of Computer Assisted Radiology and Surgery*, which
receives about 1800 full manuscripts a year, and he founded and runs the CARS congress (Computer
Assisted Radiology and Surgery), whose 40th anniversary congress was in Nagoya in July 2026. The
restoration's first user is the program's author ([Users](#users)).

PIXIE leads to CARS directly. On a 1978 sabbatical at the Cambridge Mathematical Laboratory, Heinz
took up chapter 9 of his PIXIE thesis, "Appraisal and future possibilities", whose Fig. 9.4 shows
display workstations communicating over a shared bus. With the Cambridge Ring, that became his
1979 Technical University of Berlin report *A Network of Medical Work Stations for Integrated Word
and Picture Communication in Clinical Medicine*, an early specification of what is now called
PACS, and the starting document of the CAR(S) congresses
([pacshistory.org](https://www.pacshistory.org/documents/index.html)). Its IEEE paper (Lemke,
Stiehl, Scharnweber, Jackel, 1979) was republished in 2003 as the anniversary first article on
PACS in the *Journal of Digital Imaging*
([doi:10.1007/s10278-002-6030-9](https://doi.org/10.1007/s10278-002-6030-9)). Neil Wiseman
followed the medical workstation work closely.

**Supporting this work.** Everything here is free and open. It is not free to make: the
transcription, coding the emulator, building the tools, debugging, and this documentation run on
AI model tokens, which I have paid for myself ([what it cost](#what-it-cost)), as I did for the
[Yoot Saito interview with Alan Kay](https://github.com/YootTowerManagement/YootTower/blob/main/Yoot_Saito_Alan_Kay_Interview/Yoot_Saito_Alan_Kay_Interview.md)
and the [complete *Early History of Smalltalk*](https://github.com/YootTowerManagement/YootTower/blob/main/Yoot_Saito_Alan_Kay_Interview/EarlyHistoryOfSmalltalk-Complete.md)
with its appendices and indexes. Museums, schools and anyone else are welcome to use all of it
for free ([the open letter to museums](FOR-MUSEUMS.md)). If it is useful to you, support on
[Patreon](https://www.patreon.com/c/DonHopkins) pays for the next one, and for the free software
the museums and Heinz use.

## Is this reverse engineering?

Mostly not, and the difference matters for how the work went.

Decompiling an executable starts from ground truth. The binary runs, and every byte of it is the
program; the work is recovering intent from it. We had the opposite: Heinz's own printed source,
with intent in every comment, and no binary at all. What survives is a lineprinter listing, and
the machine words on it had to be read off paper by OCR before anything could run. The octal
column was a second transcription, not a referee: it had misreads of its own
([the image had misreads too](BUG-JOURNAL.md#the-image-had-misreads-too)).

So most of this is restoration: recovering a text and its machine image from a degraded
document, with the running program as the instrument that finds the errors. Three parts are
reconstruction or reverse engineering in the ordinary sense, and they are called out where they
come up:

- **DEC's light pen diagnostic was missing a page,** and it was rebuilt from how the surviving
  pages use each symbol ([page 6](#test-programs-as-test-equipment)). Reconstruction from
  context, as a philologist fills a lacuna.
- **The Titan link's far end is gone.** Some documentation survives; no Titan code does. The
  Titan's half of the protocol was reconstructed from the PDP-7's half
  ([the Titan link](#the-titan-link-the-part-that-is-reverse-engineering)).
- **How to use PIXIE** was recovered from the films, the paper, Heinz's notes and Heinz, not from
  the code ([running it against the films](#running-it-against-the-films)).

## What survived

- **The listing.** 128 A3 lineprinter pages (about 110 of SYMELEC at 40 to 50 instructions a page,
  and 15 of the RSP package), printed 12 February 1972 ("ASSEMBLED 12 2 72 AT
  12,44,57 BY HL1470"), scanned by Heinz in 2026: `/SYMELEC`, the main program, and `/RSPPIX`,
  the ring structure processor, a separate library. Every line has the address, the octal word,
  and the source in the Cambridge assembler's dialect, and some have Heinz's pencil corrections
  ([the listing](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md)).
  Heinz had kept it all along; until July 2026 everyone assumed PIXIE's PDP-7 software was lost
  ([pixie-source-recovery.md](../../characters/heinz-lemke/pixie-source-recovery.md)).
- **Two 1969 films,** made to accompany the paper, found and digitized by David Chapman at the
  Cambridge University Library:
  [PIXIE Demo 1](https://www.youtube.com/watch?v=j9R63T2xGCA) and
  [PIXIE Demo 2](https://www.youtube.com/watch?v=lCrl5QmQ9aA).
- **The paper,** Heinz's PhD thesis, his handwritten notes, and his memory, by email.
- **Planning Document 10,** *Software for the Titan/PDP-7 link*, C. A. Lang, 2 December 1965,
  from the Cambridge University Computer Preservation Society's Titan archive
  ([mirror](reference/cambridge-supervisor/README.md),
  [original](https://cucps.soc.srcf.net/titan/supplan/pd10.htm)).
- **An *Electronics* article,** "Electronics International", 28 April 1969, on PIXIE, found by
  John Gilmore; the original issue has not been located online.
- **Bill Buxton's 2008 notes.** On a visit to Cambridge, Buxton transcribed the relevant pages of
  the paper, found Wiseman's notes on the radial menus in the university's manuscript room with
  William Newman's help, learned from them that a PIXIE film had been made, and contacted Heinz.
  Dave Fleck passed the notes on to me, which is how I knew the film existed.
- **Heinz's thesis,** whose Appendix 4 is the PIXIE User Manual.
- **No binary, no tape, no Titan code,** and no documentation of the link's IOTs beyond what
  PIXIE's own code does with them.

## Transcribing 128 pages

Told in full, with costs, in the
[transcription report](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md).
In outline:

- Apple Vision OCR on a test page produced invalid octal digits and mangled mnemonics: unusable
  as a source, kept as a free second witness.
- A swarm of LLM agents transcribed 10 to 16 pages each to one TSV per page against a shared
  spec, the page image the sole source of truth. Per-page files made the job interruptible.
- Mechanical checks found what the agents were confident about and wrong: octal alphabet,
  address continuity, and an opcode checker that decodes every word's top bits against its
  mnemonic. A stronger model re-read only the flagged rows.
- The failure modes are worth knowing
  ([taxonomy](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md#failure-taxonomy--what-llm-scribes-actually-do-wrong)).
  One agent, noticing that RSPPIX duplicates code from SYMELEC at a fixed offset, reconstructed
  pages from the copy instead of reading them; the output was fluent and the address column
  contradicted itself 120 times. Another silently substituted the OCR witness when its image read
  failed.
- One "error" was the 1972 assembler's own idiom. Some 30 rows read `AND I GETSP` where the word
  encodes `JMP I`: a symbol defined `GETSP=JMS,` carries the JMS opcode as its value, so `AND I
  GETSP` is 52xxxx + 10xxxx = 62xxxx, a subroutine return written as arithmetic. The scribes were
  right and the checker was 54 years too modern.

Shape checks pass any misread that turns one valid instruction into another. Those were found by
running it.

## The emulator as an instrument

The emulator ([README](README.md)) was built to run this listing and to show where it disagrees
with itself. It is checked against SIMH, which is the reference bench: Bob Supnik built the
18-bit family, Philip Budne and Douglas Gwyn wrote the display core and the 340 state machine,
and Lars Brinkhoff wired the 340 to the PDP-7 and recovered the Type 342 character generator's
letterforms from MIT AI Lab film, frame by frame ([SIMH-MAP.md](SIMH-MAP.md)). Where the
emulator and SIMH disagree, SIMH is right until a DEC manual says otherwise.

What it adds is visibility, because the machine is in the page with everything else
([MANIFESTO.md](MANIFESTO.md)):

- **Two-level source maps.** Each word in core maps to the source line that assembled it, and
  each line to its rectangle on the scanned page, so single-stepping highlights Heinz's listing.
  The same core can be shown against the Cambridge source, the listing, or the as7 translation.
- **The display list is in core,** beside the code, since the 340 is a second processor sharing
  memory. It disassembles as 340 instructions, can be edited live, and every stroke on the tube
  knows the display word and the code that drew it.
- **Eight light pens,** the pen being the input device the whole program is built around.
- **Assemblers** for the Cambridge dialect, DEC's 1964 syntax and UNIX's as7, and a translator
  from Cambridge to as7 that must reproduce the Cambridge image word for word
  ([ASSEMBLERS.md](ASSEMBLERS.md)).
- **Recording and replay,** so a bug can be reproduced from a session file.

## Test programs as test equipment

SYMELEC was the only program that had ever exercised the light pen, so the pen was exactly as
right as SYMELEC needed. Each program below was brought in to test one part of the machine
against something other than PIXIE:

- **DEC's 370 Light Pen Diagnostic** (DEC-4-45-M, C. Stein, 1964) tests sensitivity, follow and
  field of view. No tape survives, so it needed the assembler. Page 6 of the scan is missing; it
  was rebuilt from how the surviving pages use each symbol, and its header lists what the
  evidence fixes and what is a choice
  ([page 6](BUG-JOURNAL.md#page-6-was-missing)). It found real emulator bugs: a pen hit latched
  the vector's end point instead of the point under the pen
  ([the pen saw the end of the line](BUG-JOURNAL.md#the-pen-saw-the-end-of-the-line)), and IOT
  704 was missing ([IOT 704](BUG-JOURNAL.md#iot-704)).
- **HILO and LANDER,** written for the cabinet, test the Teletype both ways.
- **DUEL** (Peterson and Viner, DECUS 7-40, 1968), spacewar for two, tests the 340 under a
  program that draws fast and halts at the end of a round.
- **UNIX v0** from the pdp7-unix restoration tests the disk, the Teletype, and the CPU under an
  operating system.
- **Mitch Bradley's PDP-7 Forth** ([below](#rings-and-forth)) tests `XCT`, `CAL`, the auto-index
  registers, the EAE and the paper tape reader.

## The bug journal

[BUG-JOURNAL.md](BUG-JOURNAL.md) records every bug in the order it turned up, with the evidence
that settled it, and classifies each as ours (the emulator), the transcription's, or 1972's
(the listing itself, which the emulator should then reproduce). Some that show the method:

- **The literal pool was cut off at 11741,** so every `(JMP INT` read 0 and the boot looped
  forever. Settled by the listing's literal pool pages.
- **`ISZ BSZ`.** The Titan host expected `count + 1` words per blocklet; at 1734 to 1735 the
  listing complements the count and increments it as part of the end-of-transfer test, so a
  blocklet carries exactly `count` words. The 1972 code NAK'd the 2026 host for bad arithmetic,
  as designed ([OFF-BY-ONE.md](OFF-BY-ONE.md#isz-bsz-the-star-of-the-show)).
- **The octal image itself was wrong in places.** 3753 and 3761 were transcribed `777777 LAW`
  for a printed `764767 LAW X`, so the image being booted ran different code from what Heinz
  printed. 7633, `772016 LAW POINT`, had been transcribed with a 5; it was first written off as a
  1972 error from a crop too small to tell, and is a 6 when compared glyph by glyph with the 6s
  on the same page ([exhibit](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/exhibits/zoom-7633-772016.png)).
- **Heinz's pencil at 5270** states his intent, so it is read like any other correction.
- **The Cambridge assembler had rules we didn't:** forward references take a name's first value
  when it is assigned twice; literals naming an undefined symbol get a pool word per use;
  `VEC ON n` with one coordinate; `LAW -30` keeps to the 13-bit field
  ([four rules](BUG-JOURNAL.md#titans-assembler-four-rules-it-had-and-we-didnt)).

Since [rung 8](BUG-JOURNAL.md#rung-8-symelec-reassembles-word-for-word), source, listing, symbol
table and image are one program: `symelec.asm` through the Cambridge assembler gives
`symelec.oct` and its literal pool exactly, and a test keeps it that way.

## Running it against the films

The code says what PIXIE does, not how Heinz used it. That came from the 1969 films, the paper,
his notes and thesis, and Heinz.

The films were the spec once the code ran. In 2020, years before any of the code was running, I
cut them to Yuja Wang playing *Flight of the Bumble-Bee*
([Flight of the PIXIE](https://www.youtube.com/watch?v=jDrqR9XssJI)). When SYMELEC ran, I compared
it against the films stroke by stroke, did what Heinz does on screen, and worked out what each
light button and Teletype command does. The [PIXIE tutorial](../../apps/ties/examples/pixie/articles/pixie-tutorial.md)
is the result, checked against the running program and recordable as a demo.

The 340 now shows light pen tooltips naming each command button. Heinz remembers a remarkable
amount; the tooltips are for everyone else exploring the program.

Heinz's first review of the browser version, 1 October 2026, is the current list of open
usability work:

- Pointing with a mouse is much slower than the light pen was; "drag slowly or the cross is left
  behind" was not a problem in 1969.
- Contrast is low, so the light buttons and the drawing take concentration to read.
- The browser window is about 15 cm square, against the 340's 10 inches (25 cm).
- He asked what the 17 switches below the screen do, how to get a line printer copy of a
  drawing, and how to get the RSP data structure of a model he draws.
- On the cross catching on lit lines it passes over: "With hindsight, I should have programmed
  this differently."

## The Titan link: the part that is reverse engineering

PIXIE stored and retrieved its drawings on Titan over Neil Wiseman's link, which was Cambridge
hardware, not a DEC product. What survives about it: Lang's Planning Document 10 (Titan as
master, attentions, 18 to 48-bit packing, a second Teletype at the PDP-7), the paper, and PIXIE's
`/LTPIX` routine. No source for the link's system software, no Titan code, and no list of the
device's IOTs.

So the device was reconstructed from how SYMELEC drives it: `LSF`, `LCF`, `LRB18`, `LLB18`,
`LLB6`, `LKD` and the rest, read off the code that issues them
([TINY-TITAN.md](TINY-TITAN.md)), and the session was decoded from `/LTPIX`
([TITAN-LINK-PROTOCOL.md](reference/TITAN-LINK-PROTOCOL.md)): 4-word headers checked by
complement, blocklets of `count` words, an 18-bit running checksum, `PXID` (767676) as the stream
heading. Tiny Titan stands in for the far end: the unmodified 1972 code, given the `TITAN`
command, uploads its ring structure to it, checksummed and acknowledged. Serving drawings back
is the next rung.

## Rings, and Forth

PIXIE keeps its model as rings, built by RSPPIX: two-word cells, names as JMS-tagged addresses,
NIL as the JMS opcode (100000), block data behind a header of 20000 plus its length. It is a
general data structure, closer to Lisp cells than to a drawing format, and PIXIE's circuits are
one use of it, as SVG is one use of XML. It crossed the link to Titan in the format it lives in
core.

The emulator draws rings in 3D, live from core
([RINGS panel](../pixie/src/scene.ts)), and the TypeScript library reads and writes them as JSON,
YAML or the raw transfer stream ([`@wwsff/pixie`](../pixie/src/index.ts)).

Mitch Bradley wrote a PDP-7 Forth in a day in September 2026, when told the emulator needed one
([PDP7-FORTH.md](reference/PDP7-FORTH.md)); its inner interpreter runs each thread cell as a
PDP-7 instruction with `XCT`. RSPPIX, translated from the Cambridge dialect to as7, still
assembles word for word to the listing, and is linked unchanged into a full-names copy of Mitch's
Forth, with a Forth word for each RSPPIX routine, so the same rings can be built and walked from
Forth and appear in the same 3D view ([FORTH-RINGS.md](FORTH-RINGS.md)). Next is two cabinets on
one Tiny Titan, a drawing made by Forth's turtle edited in PIXIE and walked again in Forth.

## The people

- **Heinz Lemke** wrote PIXIE, kept the listing for 54 years, scanned it, and answers questions
  ([character](../../characters/heinz-lemke/README.md)).
- **Neil Wiseman** built the link, and co-wrote the paper
  ([character](../../characters/neil-wiseman/)).
- **David Chapman,** Cambridge University Library, found and digitized the films.
- **Bob Supnik, Philip Budne, Douglas Gwyn and Lars Brinkhoff** wrote the SIMH code the emulator
  is checked against ([credit](SIMH-MAP.md#credit)). When Lars's PDP-7 Type 340 support was
  merged in 2020 there was no PDP-7 software for the 340 to run on it; he had done it hoping to
  resurrect Space Travel ([simh #752](https://github.com/simh/simh/pull/752)).
- **Mitch Bradley** wrote the PDP-7 Forth, in a morning with Claude, after seeding it with his
  header and thread format. I was his summer intern at Sun in 1987, extending CADroid, a printed
  circuit design program from Lucasfilm that Sun used internally, with his C Forth, and we
  worked together again on OLPC in 2007.
- **Bill Buxton** found the evidence for the film in 2008, and **Dave Fleck** passed it on.
- **The Internet Old Farts Club.** One page of the listing, posted cold as "Who can guess what
  this is?", drew 161 reactions and 173 comments in three days; PDP-1 and PDP-7 veterans had it
  as a 1972 Cambridge CAD program called PIXIE in about 40 minutes, and Ric Werme found Planning
  Document 10 from the page captioned PDP7-TITAN
  ([the thread](../../characters/heinz-lemke/sources/2026-07-24-facebook-guessing-game.md)).
- **Charles Lang** wrote PD10 in 1965; the CUCPS keeps the Titan archive it came from.

## Users

- **Heinz.** He plans to use PIXIE, instead of PowerPoint, to build Bayesian network models of
  health care situations, and has invited the IFCARS Think Tank and their students to do the
  same. CARS 2027 in Berlin will have a session on "HCI and Modelling: where we come from and may
  be going to", chaired by Leo Joskowicz and Roy Eagleson, with PIXIE in the "where we come from"
  part; 29 June 2027 is the 60th anniversary of Heinz's first Cambridge lecture
  ([character](../../characters/heinz-lemke/README.md)).
- **Roy Eagleson** at Western University ran SYMELEC step by step under SIMH, tracing registers
  to its main loop waiting on light pen interrupts, and began a JavaScript reimplementation of
  parts of it, before the browser emulator ran it. He wants speed and accuracy measurements of
  PIXIE's radial menus. His HCI students are re-implementing PIXIE as an exercise in
  rediscovering its data structures, with the CARS 2027 session as a target
  ([Roy](../../characters/roy-eagleson/README.md),
  [Sketchpad to PIXIE](../../characters/roy-eagleson/sketchpad-to-pixie-lineage.md)).
- **Anyone,** in a browser: [the live emulator](https://hyperties.org/cabinet/symelec/), the
  [tutorial](https://hyperties.org/databases/pixie/pixie-tutorial/), and
  [Pixie Live](https://hyperties.org/databases/pixie/pixie-live/).

## What it cost

The transcription cost about $122 to $132 in model time for 128 pages and 7,084 listing lines,
against $150 to $160 projected for the strongest model alone
([costs](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md#cost-and-time)).
The emulator, assemblers, source maps, test programs and the debugging in the bug journal cost
far more, in model time and mine: a single working morning in October 2026 came to over $330 in
model charges, and the monthly bills run into the thousands of dollars.

## Open questions

- **Heinz's open requests:** RSP export of a model he draws, a line printer copy of the screen,
  and light pen speed ([his review](#running-it-against-the-films)).
- **The 340's address counter.** SIMH has it 12 bits; SYMELEC starts the display at 12301, in the
  upper 4K. Either Cambridge's 340 was wider or SYMELEC depends on something not yet found.
- **What the Titan sent back.** Serving drawings to SYMELEC needs the read path, and SYMELEC's
  name list rebuild halts on an empty SAVINS, so a test drawing has to be well formed.
- **Two faint symbol table entries,** `COMP10` and `MESIN2`, where the table and the code lines
  disagree and the scan is too faint to read.

## Cambridge sources and contact leads

Research notes added 16 October 2026 from sources supplied by Don. These
distinguish catalogue descriptions, published accounts, personal recollections,
and questions still to be answered. No new archive material has yet been
obtained through the requests proposed below.

### Neil Wiseman papers: specific folders to request

The catalogue of the N. E. Wiseman papers, **NCUACS 154/4/07**, identifies
two groups of PIXIE material in its University Mathematical Laboratory,
Cambridge section:

https://centreforscientificarchives.co.uk/wp-content/uploads/2024/01/WISEMAN_NEIL_ERNEST_v2.pdf

| Catalogue references | Folder title and dates | Described contents relevant to restoration |
|---|---|---|
| B.214–B.216 | “Pixie I,” 1967–1968 | Computer printouts; manuscript and typescript notes and drafts, including “Display File Compiler,” “Ring Structure Entertainer,” and “Notes on RSP [Ring Structure Processor] Data Structures”; requests for offprints of Wiseman's papers. |
| B.217–B.223 | “Pixie II,” 1968–1971 | Computer printouts; correspondence; Rainbow memos; an offprint of “A ring structure processor for a small computer”; a proof of “A note on compiling display file from a data structure”; drafts including “Rainbow CAD [Computer Aided Design] Project,” M. Etherton's notes on representing pictorial and topological information, and a summary of the computer-aided electronics design group's work. |

“Computer printouts” does not establish that these are source listings,
complete programs, or versions compatible with the surviving 1972 listing.
Those are questions for inspection. Likewise, “Pixie II” is the catalogue's
historical folder title, not the later medical-modelling project of that name.

There is an existing reason to start with **B.218**: Bill Buxton identifies
it as the source of his 2008 report on Wiseman's radial-menu notes,
including a hand-drawn menu figure and evidence of the demonstration film.
His report is already archived with a transcription:

[Wiseman's Notes on Radial Menus in PIXIE](../../characters/heinz-lemke/sources/buxton-2008-wiseman-notes/wiseman-notes-on-radial-menus-in-pixie.md).

### Follow up with David Chapman at Cambridge University Library

David Chapman previously traced the two PIXIE films and coordinated their
digitization through the library. The
[film-recovery history](../../characters/heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)
records that work and the earlier reference enquiries. Don proposes asking
him for help locating and obtaining more documents; this is a proposed
follow-up, not a request recorded as sent.

Give the library the collection identifier and folder references above,
and ask:

- Can they confirm the current shelfmarks, access arrangements, and
  reproduction permissions for B.214–B.223?
- Can they provide an item-level description or sample images of the
  computer printouts, especially titles, dates, first pages, and symbol
  tables, to determine what programs and versions they contain?
- Can they supply the complete “Display File Compiler,” “Ring Structure
  Entertainer,” and RSP data-structure notes, including diagrams, handwritten
  corrections, and any continuation pages?
- Can they scan the original radial-menu drawing in B.218 and surrounding
  notes, so Buxton's transcription can be checked against the originals?
- Is there material on the Titan/PDP-7 link: circuit diagrams, IOT
  definitions, supervisor routines, transfer formats, or source listings
  from either machine? Lang's 1965 Planning Document 10 is already available;
  implementation documents would answer different questions.
- Do the Rainbow records or related accessions contain PIXIE tapes,
  assemblers, loaders, circuit-analysis programs, additional films, or
  photographs showing the controls and equipment labels?
- What citation and permission wording should accompany scans, transcriptions,
  and any recovered executable software?

Prioritize identifying the printouts and compiler/RSP documents before
requesting an undifferentiated scan of the whole collection. Ask about
costs and available digitization options rather than assuming the material
can be supplied immediately.

### Cambridge hardware records

The Computer Laboratory Relics Project has two relevant objects, photographs,
and interview notes:

https://www.cl.cam.ac.uk/relics/database/?uid=&class=&name=pdp&machine=Titan

- **CL-16/97, PDP7 joystick.** The interview describes a lab-built pointer
  control with rotational movement, tentatively credits Norman Unwin, and
  says the PDP-7 was connected to Titan but mainly used independently.
  The number and function of its axes, electrical interface, and use by
  particular programs still need documentation.
  [Photograph](https://www.cl.cam.ac.uk/relics/jpegs/CL.16-97.jpg).
- **CL-54/97, Experimental graphical input for PDP7.** The notes describe
  a ferrite pickup and crossed wires for detecting pointer position.
  The speaker, labelled “DW,” credits Maurice Wilkes and himself with the
  concept, Norman Unwin with some detailed design, and another technician
  with the electronics.
  [Photograph](https://www.cl.cam.ac.uk/relics/jpegs/CL.54-97.jpg).

The second entry's tentative “late 50's or early 60's” date predates the
PDP-7's 1964 introduction. Ask whether this refers to earlier development
or is a recollection/cataloguing error. Do not assign a precise date or
expand the speaker's initials without checking the interview provenance.
Neither object record establishes that PIXIE used that device.

### Cambridge CAD/CAM account

*The Design of Mechanical Components and the Development of DUCT:
17 Years of CAD/CAM in Cambridge University*, an April 1983 Erlangen
report, provides context for the wider Cambridge graphics work:

https://www-g.eng.cam.ac.uk/125/achievements/erlangenFP/index.htm

Its abstract dates acquisition of the PDP-7 to **1965** and formation of a
joint Computer Laboratory–Engineering team to the end of that year.
It describes the work leading to POLYSURF, ROMULUS, and DUCT. These are
related Cambridge CAD developments, not interchangeable names for PIXIE.

The account also discusses GINO and R. B. Morris's smaller graphics package
for an IBM 1130 with 8K core. This is a lead for related graphics software
and personnel, not evidence that the IBM package ran on the PDP-7.

### A secondary description of PIXIE's data paths

A thesis hosted by Missouri S&T includes a section headed “C. PIXIE”
and Figure 5, “PIXIE System Data Paths”:

https://scholarsmine.mst.edu/cgi/viewcontent.cgi?article=4562&context=masters_theses

Don supplied the excerpt and figure. The PDF endpoint returned HTTP 403
when fetched during this research; author, title, date, page numbers, and
the section's references still need to be established from the full thesis.

The excerpt describes a temporary display file built while drawing, an
up-compiler that translates it into the data structure, and a down-compiler
that produces the permanent display file. It says both compilation steps
run on the satellite PDP-7, with Titan used for analysis, storage, hardcopy,
and remote batch jobs. The figure places the application above a Titan/PDP-7
boundary and the data-structure box across that boundary. It should not
be interpreted as a precise core-memory layout.

The text also says temporary input can be corrected by retracing, while
the permanent file is changed through erase mode, and that a partial
network can be compiled before drawing continues. Compare those descriptions
with the 1969 paper, films, and surviving code before treating them as
instructions for the 1972 SYMELEC version. “Permanent display file” alone
does not imply a file stored on Titan.

### Mike Kemp: recollection and outreach

In a public Facebook comment, Mike Kemp recalls using Cambridge's PDP-7
and graphics display with a friend at night around **1972**. He describes
loading a “space war” paper tape, controlling two ships from opposite ends
of the keyboard, and flying around a displayed planet. He also recalls
extending a mainframe-hosted PDP-7 assembler assignment so that the assembler
could assemble itself on the PDP-7, and briefly starting a PhD under Neil
Wiseman before leaving to build a recording studio.

Public threads:

https://www.facebook.com/groups/779220482206901/posts/5226709490791289/

https://www.facebook.com/groups/779220482206901/posts/6297725037023057/

The Discogs profile for **Spaceward Studios** identifies Mike Kemp and
Gary Lucas as its founders in Cambridge in **1972**, running it until
1988. This is consistent with Mike's recollection of leaving to build a
recording studio and provides a biographical lead to check with him.
Discogs is a community-maintained source; it does not independently
establish his Cambridge academic dates or which PDP-7 programs he used.
Ask whether Spaceward was the studio he meant and how its founding
overlapped with his studies.

https://www.discogs.com/label/274826-Spaceward-Studios

Don also supplied an archived Spaceward homepage, captured 16 April 2013.
It directs readers to a separate studio archive and discography, identifies
Mike Kemp with Sintefex and Dynamic Convolution Technology, and mentions
Spaceward Microsystems, video and graphics systems, and the Supernova,
Matisse, Rodin, and Satori products. It does not explain the relationship
of each product to Kemp or to his Cambridge work.

https://web.archive.org/web/20130416095503/http://www.spaceward.co.uk/

Studio archive linked from that page:

https://web.archive.org/web/20130114003814/http://www.spacewardstudios.ukf.net/

Punk77 publishes an interview with Kemp about Spaceward's recording work.
He explicitly identifies Gary Lucas as his co-founder and describes their
shared recording sessions. This is a first-person source about the studio,
not just a discography entry. It does not establish the PDP-7 chronology.

https://punk77.co.uk/mike-kemp-spaceward-studios/

Andrew N. Jackson's preservation notes collect further sources, including
a Sintefex biography and Cambridge's company history. The quoted biography
describes Kemp's mathematics and computer science education at Emmanuel
College, his move from Cambridge research to recording, and subsequent
technical roles at Spaceward Microsystems and Studio Audio and Video
(SADiE). Its wording about turning down a research post differs from his
Facebook account of starting and leaving a PhD; ask Mike for the sequence
rather than treating either short account as a complete chronology.

https://anjackson.net/codex/formats/spaceward/index.html

Jackson quotes Cambridge's Hall of Fame as listing Spaceward Studios
(1972) and Spaceward Microsystems (1983), with Kemp as a founder:

https://www.cst.cam.ac.uk/ring/halloffame

These sources expand the interview questions beyond the recording studio:
did his PDP-7 graphics and assembler experience influence his later graphics,
video, or audio engineering? What software, hardware designs, manuals, or
personal records survive from those transitions? No technical lineage from
PIXIE to Spaceward's products is established by the sources collected here.

**Outreach status, 16 October 2026:** Don reports sending Mike a direct
message introducing the PIXIE restoration with Heinz, linking the
[running emulator](https://hyperties.org/cabinet/symelec/), asking to talk
and record and share his recollections, and asking whether he knew David
S. H. Rosenthal. No reply or permission to record or publish an interview
is recorded here. The private message-thread URL is not needed as a public
source.

Questions for a conversation:

- Who was the friend, and who else used or maintained the machine?
- What were the approximate dates, room, display, keyboard, and controls?
- Does he recognize the restored DUEL program, or remember a tape label,
  author, title screen, or instructions? The recollection is not yet an
  identification of DUEL or any other particular Spacewar version.
- What was the assembler called, what syntax did it accept, and do source,
  tapes, listings, coursework, or notes survive? Was it related to the
  Cambridge assembler used for the PIXIE listing?
- Did he use PIXIE, RSP, GINO, or the Titan link, and what does he remember
  of Wiseman's group?
- How did his Cambridge work relate, if at all, to Spaceward Microsystems'
  graphics systems and his later audio engineering? Can he clarify the
  dates of his studies, research, and studio work?
- Does he know other users who might have records or be willing to talk?

Ask separately for permission to record, quote, identify participants, and
publish any contributed material. Do not treat a public anecdote or Don's
invitation as consent to publish later correspondence.

### Other people and records to follow up

- **Heinz Lemke:** ask which catalogue titles and program names he
  recognizes, how versions changed between the films and the 1972 listing,
  and who might know about the analysis programs or Titan software.
- **David S. H. Rosenthal:** already recalled working on the PDP-7/340 and
  Titan from about 1970 and meeting Wiseman. Ask about Mike, the game,
  assembler, controls, and other users. His earlier account is in the
  [Cambridge film notes](../../characters/heinz-lemke/cambridge-films-flight-of-the-bumblebee.md#david-rosenthal--same-cambridge-pdp-7titan).
- **Bill Buxton and Dave Fleck:** ask whether additional archive photographs,
  notes, or correspondence survive beyond the 2008 report already held.
- **Charles Lang and the Cambridge University Computer Preservation Society:**
  seek context for PD10 and surviving supervisor/link or assembler material.
  Existing archive: https://cucps.soc.srcf.net/titan/supplan/pd10.htm
- **Cambridge Computer Laboratory library/archive staff:** ask about the
  relics interviews, Norman Unwin's hardware documentation, Rainbow records,
  and relevant former staff or students. These are enquiries to route
  through the archive, not claims that any named person is available.
- **Andrew N. Jackson:** his Spaceward preservation notes document an
  earlier attempt to reach Kemp, research into Spaceward image formats,
  and conversion experiments. He may have useful references or questions
  for Mike. His notes link to Alvy Ray Smith's history of digital paint
  systems and accounts of Spaceward equipment used for *Knightmare*.
  Treat those as separate graphics-preservation leads, not as evidence
  about PIXIE's implementation. Do not assume he has established contact
  with Mike or recovered format specifications.

The Facebook captions are discovery leads, not substitutes for the paper,
code, or archive records. In particular, the claimed influence of the
IBM 2250 Model 4 needs a historical citation. Meta-generated titles and
summaries, including the page mixing Sketchpad with SketchUp and Sketchbook,
should not be used as historical evidence.

## Where everything is

| What | Where |
|---|---|
| The listing, scans, transcription | [characters/heinz-lemke/sources/pixie-assembler-listing-1972/](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/README.md) |
| Transcription report | [TRANSCRIPTION-REPORT.md](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md) |
| Bug journal | [BUG-JOURNAL.md](BUG-JOURNAL.md), and [OFF-BY-ONE.md](OFF-BY-ONE.md) |
| The emulator | [README.md](README.md), [DESIGN.md](DESIGN.md), [SIMH-MAP.md](SIMH-MAP.md) |
| Assemblers | [ASSEMBLERS.md](ASSEMBLERS.md) |
| The Titan link | [TINY-TITAN.md](TINY-TITAN.md), [TITAN-LINK-PROTOCOL.md](reference/TITAN-LINK-PROTOCOL.md), [PD10](reference/cambridge-supervisor/README.md) |
| Rings and Forth | [FORTH-RINGS.md](FORTH-RINGS.md), [PDP7-FORTH.md](reference/PDP7-FORTH.md) |
| The films | [Demo 1](https://www.youtube.com/watch?v=j9R63T2xGCA), [Demo 2](https://www.youtube.com/watch?v=lCrl5QmQ9aA), [Flight of the PIXIE](https://www.youtube.com/watch?v=jDrqR9XssJI) |
| The 2026 demo, and its transcript | [video](https://www.youtube.com/watch?v=lo8kdY-5i6c), [transcript](../../characters/heinz-lemke/media/video-2026-10-09-pixie-forth-cabinet/transcript.md) |
| The Old Farts thread | [2026-07-24-facebook-guessing-game.md](../../characters/heinz-lemke/sources/2026-07-24-facebook-guessing-game.md) |
| Heinz, Roy, Lars, Bob, Neil | [heinz-lemke](../../characters/heinz-lemke/README.md), [roy-eagleson](../../characters/roy-eagleson/README.md), [lars-brinkhoff](../../characters/lars-brinkhoff/), [bob-supnik](../../characters/bob-supnik/), [neil-wiseman](../../characters/neil-wiseman/) |
| Live | [the emulator](https://hyperties.org/cabinet/symelec/), [tutorial](https://hyperties.org/databases/pixie/pixie-tutorial/), [Pixie Live](https://hyperties.org/databases/pixie/pixie-live/), [Forth](https://hyperties.org/databases/pixie/cabinet-forth/) |
| Manifesto | [MANIFESTO.md](MANIFESTO.md) |

↑ [README](README.md) · [BUG-JOURNAL](BUG-JOURNAL.md) · [TINY-TITAN](TINY-TITAN.md) · [FORTH-RINGS](FORTH-RINGS.md)

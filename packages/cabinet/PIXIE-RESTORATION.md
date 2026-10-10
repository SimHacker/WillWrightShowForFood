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

Heinz is the person in the 1969 films running the code, and he is still very active: he founded
the CARS congress (Computer Assisted Radiology and Surgery), runs and organizes it, and reviews
and writes papers. The restoration's first user is the program's author
([Users](#users)).

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

- **The listing.** 128 A3 lineprinter pages, printed 12 February 1972 ("ASSEMBLED 12 2 72 AT
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
  is checked against ([credit](SIMH-MAP.md#credit)).
- **Mitch Bradley** wrote the PDP-7 Forth. I was his intern at Sun in 1987, and we worked
  together again on OLPC.
- **The Internet Old Farts Club.** One page of the listing, posted cold as "Who can guess what
  this is?", drew 161 reactions and 173 comments in three days; PDP-1 and PDP-7 veterans had it
  as a 1972 Cambridge CAD program called PIXIE in about 40 minutes, and Ric Werme found Planning
  Document 10 from the page captioned PDP7-TITAN
  ([the thread](../../characters/heinz-lemke/sources/2026-07-24-facebook-guessing-game.md)).
- **Charles Lang** wrote PD10 in 1965; the CUCPS keeps the Titan archive it came from.

## Users

- **Heinz,** drawing illustrations with PIXIE for the CARS 2027 HCI session in Berlin, 29 June
  2027 ([character](../../characters/heinz-lemke/README.md)).
- **Roy Eagleson's** HCI students at Western University, who are re-implementing PIXIE as an
  exercise in rediscovering its data structures, with the same CARS 2027 session as a target
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
far more, in model time and mine.

## Open questions

- **The 340's address counter.** SIMH has it 12 bits; SYMELEC starts the display at 12301, in the
  upper 4K. Either Cambridge's 340 was wider or SYMELEC depends on something not yet found.
- **What the Titan sent back.** Serving drawings to SYMELEC needs the read path, and SYMELEC's
  name list rebuild halts on an empty SAVINS, so a test drawing has to be well formed.
- **Two faint symbol table entries,** `COMP10` and `MESIN2`, where the table and the code lines
  disagree and the scan is too faint to read.

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

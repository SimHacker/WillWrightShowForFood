# To computer museums, libraries, archives, and retro computing enthusiasts

Don Hopkins, October 2026. An open letter: an offer, and some requests. For the Interim Computer
Museum specifically, and the PDP-7 that is the machine we emulate, see the
[letter in UNIX-V0.md](UNIX-V0.md#draft-letter-not-sent).

## What's on offer

The cabinet is a PDP-7 and Type 340 emulator that runs in a web page or on a server, written in
TypeScript and checked against Open SIMH, which it ports device by device
([README](README.md), [SIMH-MAP.md](SIMH-MAP.md)). It runs, today, in a browser:

- **Heinz Lemke's PIXIE** (1969), restored from its 1972 listing, with the light pen and the Titan
  link ([the restoration](PIXIE-RESTORATION.md)).
- **DUEL** (1968), spacewar for two, from its paper tape.
- **DEC's 1964 Type 370 light pen diagnostic.**
- **PDP-7 UNIX v0**, from the pdp7-unix restoration: log in as ken.
- **Mitch Bradley's PDP-7 Forth,** with turtle graphics on the 340 and PIXIE's ring structures.

Try them at [hyperties.org/cabinet](https://hyperties.org/cabinet/); UNIX is at
[hyperties.org/cabinet/unix](https://hyperties.org/cabinet/unix/).

It also runs devices that no PDP-7 ever had. They sit on free device codes, are marked as cabinet
extensions in [DESIGN.md](DESIGN.md), and stock software never touches them:

- **A Turing machine engine** (device 54, [turing.ts](src/plugins/turing.ts)): a co-processor that
  runs transition tables out of the PDP-7's core, the way the 340 runs display files.
  It runs Marvin Minsky's 7-state, 4-symbol universal machine from AIM-33, recovered from his TECO
  program, with PDP-7 code paging its tape through core. [turing.fs](tapes/pdp7forth/turing.fs)
  draws the tape on the 340 and runs the machines from Christopher Cherniak's PCOMP TM\*
  simulator, including the busy beavers. TM-Forth compiles Turing machines into the engine's
  tables ([TURING-ENGINE.md](TURING-ENGINE.md)). [Live](https://hyperties.org/cabinet/turing/).
- **Minsky's Ultimate Machine** (device 56, [ultimate.ts](src/plugins/ultimate.ts)), the box that
  Claude Shannon built at Bell Labs: switch it on and a hand comes out and switches it off.
  [ultimate.fs](tapes/pdp7forth/ultimate.fs) draws it on the 340, with the light pen on its switch. [Live](https://hyperties.org/cabinet/ultimate/).
- **A DataHand** (device 57, [datahand.ts](src/plugins/datahand.ts)), after VPL's DataGlove: a
  webcam and a hand tracker in the browser report your hand as a palm frame and twenty bones. Only
  the numbers reach the PDP-7, never the video. [datahand.fs](tapes/pdp7forth/datahand.fs) draws
  the hand with a 3D turtle ([HAND-TRACKING.md](HAND-TRACKING.md)).
- **ULTIMATE HAND**, written in Forth ([ultimate-hand.fs](tapes/pdp7forth/ultimate-hand.fs)): you
  are the Ultimate Machine's hand. Show the camera your hand and the box switches itself on, its arm
  carries your hand out to the switch, and you switch it off with a fingertip.
  [Try the live demo](https://hyperties.org/cabinet/ultimate-hand/) with your webcam.
  [ultimate-hand.fs](tapes/pdp7forth/ultimate-hand.fs) is the top-level Forth file that ties it
  together: the Ultimate Machine, the DataHand, a 3D turtle and the Type 340.

Next on the list ([ROADMAP.md](ROADMAP.md)): HAND TURTLE, turtle graphics steered by hand
gestures, and then Spacewar flown by hand. After that, a CAM-6 cellular automata device.
Norman Margolus has given me permission to turn chapters of *Cellular Automata Machines*
(Tommaso Toffoli and Norman Margolus, MIT Press, 1987) into interactive courseware on it: the
book's explanations next to rules you can run, change and paint into, in the spirit of KidPix
as much as a lab manual. My earlier CAM-6 simulator is at
[github.com/SimHacker/CAM6](https://github.com/SimHacker/CAM6).

Around the emulator: assemblers for the DEC, Cambridge, and UNIX dialects, source maps from every word in core
to its source line and its scanned page, a front panel and register view, an editable display
list, recording and replay of demos, eight light pens, and a 3D view of data structures in live
core ([MANIFESTO.md](MANIFESTO.md) explains the attitude).

All of it is free software, in public git, built to be taken apart and changed. **It is yours to
use.** Put it on your own web site; make it a web twin of a machine you have, so visitors can use
it while the real one rests or is being restored; use it to check a tape or a disk image before it
goes near the iron; teach with it. You don't have to ask, and you don't have to pay.

## For UNIX historians

PDP-7 UNIX v0 from the [pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) restoration boots on
the cabinet from an emulated RB09 disk: log in as ken, then ls, cp and date. The RB09 is a port of
Open SIMH's, and the boot follows Phil Budne's bootstrap ([UNIX-V0.md](UNIX-V0.md)). This may be of
interest to The Unix Heritage Society and the pdp7-unix list (Warren Toomey, Phil Budne and the
others who did the restoration): a browser twin that anyone can log in to, and a way to check
images before they go near a real machine. Corrections and test cases from people who know this
code are very welcome.

## For libraries and archives

The cabinet keeps a program and its documents together: every word in core maps to its source
line and to the scanned page of the listing it came from, so a reader can go from the running
machine to the paper and back. Two examples of why this matters:

- **Cambridge.** The two 1969 PIXIE films were found and digitized in 2019 and 2020 through David
  Chapman at Cambridge University Library ([the story](../../characters/heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)).
  By October 2026 the library's embedded copies had become unreachable, and the attributed copies
  I put online are, for now, on YouTube. Films, listings and the program that runs them belong
  together somewhere that will last.
- **Stanford.** Stanford Libraries hold the recordings of Terry Winograd's CS547 seminar, with a
  finding aid and some scans online. I have catalogued 339 of the talks
  ([cs547-ARCHIVE.md](../../characters/terry-winograd/media/cs547-ARCHIVE.md)).

If you hold software, listings, films or recordings like these, the cabinet can give them a
running context, and I would be glad to work with you on how they are hosted, credited and
linked.

## What would help

**Your software.** Tapes, disk images, listings, and the stories behind them. The cabinet can run
them, and we will keep each one separate, credited, and published only as you say. Programs that
exercised the 340 and the light pen are the rarest and the most wanted.

**Photographs and recordings of your machines,** to build photorealistic models of them, in 3D
and as 2D web pages, which are yours to use as well. The 3D models will be drawn by
[VitaMoo](https://vitamoo.space), the open source renderer behind The Sims 1 character demo
([PORTRAIT.md](PORTRAIT.md)):

- Straight-on views of each cabinet, the console, the display, and the Teletype, from the front at
  the height of their middles, with a ruler or tape measure in the shot.
- The console panel close up, square to the lens and sharp enough to read, once dark and once
  running, so every lamp and switch can be cut out.
- An orbit for photogrammetry: 50 to 100 overlapping shots around the whole machine at knee,
  chest and overhead height, fixed exposure, soft even light, no flash.
- Details: keyboard, tape reader, light pen and cable, and the display's screen and bezel.
- **Sound:** the machine powering up, the fans, the Teletype printing and reading tape, the tape
  reader, relays, anything that clicks. **Video** of the display running, slow enough to see the
  beam.

**Run our software on your hardware.** Mitch Bradley's Forth, DUEL, and the rest can be punched to
tape. If they run on your PDP-7, or misbehave, we'd love to know: the real machine is the final
test of the emulator.

## Support

The cabinet is free to use and will stay that way. Building it is not free: it runs on AI model
tokens that I have been paying for myself, with monthly bills in the thousands of dollars
([what it cost](PIXIE-RESTORATION.md#what-it-cost)).

If you, or your museum, university, company, or lab, would like to support it, there are
institutional tiers on [Patreon](https://www.patreon.com/c/DonHopkins). Support from anyone pays
for the work that museums, Heinz, Roy Eagleson's students and everyone else then use for free. If
you want a customized version for your own exhibit, that can be arranged, and it is support, not
a requirement.

## Contact

Don Hopkins, don@donhopkins.com. Or open an issue or a pull request at
https://github.com/SimHacker/WillWrightShowForFood.

↑ [README](README.md) · [MANIFESTO](MANIFESTO.md) · [PIXIE-RESTORATION](PIXIE-RESTORATION.md) · [UNIX-V0](UNIX-V0.md)

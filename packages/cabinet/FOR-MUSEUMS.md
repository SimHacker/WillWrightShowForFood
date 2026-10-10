# To computer museums and retro computing enthusiasts

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

Around it: assemblers for the DEC, Cambridge, and UNIX dialects, source maps from every word in core
to its source line and its scanned page, a front panel and register view, an editable display
list, recording and replay of demos, eight light pens, and a 3D view of data structures in live
core ([MANIFESTO.md](MANIFESTO.md) explains the attitude).

All of it is free software, in public git, built to be taken apart and changed. **It is yours to
use.** Put it on your own web site; make it a web twin of a machine you have, so visitors can use
it while the real one rests or is being restored; use it to check a tape or a disk image before it
goes near the iron; teach with it. You don't have to ask, and you don't have to pay.

## What would help

**Your software.** Tapes, disk images, listings, and the stories behind them. The cabinet can run
them, and we will keep each one separate, credited, and published only as you say. Programs that
exercised the 340 and the light pen are the rarest and the most wanted.

**Photographs and recordings of your machines,** to build photorealistic models of them, in 3D
and as 2D web pages, which are yours to use as well:

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

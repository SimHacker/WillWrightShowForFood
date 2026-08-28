# Production notes — *Flight of the PIXIE*

Homage edit: https://www.youtube.com/watch?v=jDrqR9XssJI

The reading copy of the video — dedication, hardware, Heinz, HN as posted —
is [`README.md`](README.md). How the 1969 films were found and digitized:

- [Finding the films — 2019–2020](../../../heinz-lemke/sources/2019-2020-film-recovery-saga.md)
- [Cambridge films → *Flight of the Bumblebee*](../../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)
- Archival player: https://www.cl.cam.ac.uk/library/archives.html

This file is the After Effects cut only.

## After Effects project (local)

`~/GroundUp/pixie/Flight of the PIXIE.aep` — canonical Bumblebee edit + telecine jiggle track.

Also in that folder: `Aether.aep`; `Flight of the PIXIE_AME/` (Media Encoder exports).

Find again: `mdfind 'kMDItemFSName == "Flight of the PIXIE.aep"c'` or `find ~/GroundUp/pixie -iname '*.aep'`

## Pipeline

1. **Source** — Two 1969 PIXIE films digitized by David Chapman, Cambridge Univ Library (July 2019).
2. **Select** — Highlight cuts of radial-menu / light-pen work.
3. **Sync** — Rimsky-Korsakov *Flight of the Bumblebee*, Yuja Wang piano
   (https://archive.org/details/FlightOfTheBumblebeeChaameh/02+Yuja+Wang+-+Piano.mp4).
   First cut used Orkestra Synthetique; Heinz: *"nothing beats Yuja Wang."*
4. **Telecine match** — Motion tracking on the digitized film; blur + glow on
   title/credit overlays so they jiggle with the telecine, not sit on top as
   sharp vector type.
5. **Credits** — Wiseman, Lemke, Hiles, Chapman.

## Telecine jiggle (as posted)

[22718422](https://news.ycombinator.com/item?id=22718422), 29 Mar 2020, on
[How TV Logos Were Made Before Computers (2017)](https://news.ycombinator.com/item?id=22716767).
This is the production note that went public. Dedication cites already in the README
are not repeated.

```
I recently used AfterEffects motion tracking, plus some blurring and glowing effects on a text overlay, to reproduce the jiggling of the telecine process of an old film recently digitized to video, and match the titles and credits at the beginning and end of the original film:

https://www.youtube.com/watch?v=jDrqR9XssJI

I'm in the progress of researching and writing an article about the subject of this video (light pen driven pie menus on a PDP-7 with a 340 vector display, in an early CAD system called PIXIE developed at Cambridge University), which I'll submit to HN when it's ready some time soon I hope.

Neil E. Wiseman, Heinz U. Lemke, John O. Hiles,
PIXIE: A New Approach to Graphical Man-Machine Communication,
Proceedings of 1969 CAD Conference Southampton
IEEE Conference Publication 51, pp. 463–471.

https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf

https://www.cl.cam.ac.uk/library/archives.html

Check out Munching Squares on the same kind of hardware currently running at the Living Computer Museum, with an AM radio so the computer can play its own music synchronized with the graphics:

https://www.youtube.com/watch?v=V4oRHv-Svwc

Here's the fucking manual!

http://bitsavers.trailing-edge.com/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf

(Be sure to order all the luxury add-on options for your 340 Precision Incremental Vector Graphics CRT Display, including the 342 Symbol Generator for drawing text along with your vector graphics, the 370 High Speed Light Pen for pointing at said text and graphics, and definitely the Type 347 Subroutine Option -- a big fan cooled cabinet with a powerful hardware subroutine accelerator that is super useful! Otherwise you have to simulate subroutines in software, which sucks.)

http://www.ultimate.com/phil/pdp10/types
```

Repo Show reuse of this same motion track:
[`../../../../process/post-production/cambridge-telecine-jiggle.yml`](../../../../process/post-production/cambridge-telecine-jiggle.yml)
— opening titles, guest slates, end credits, gag credits, not only film inserts.

## Not the original film

The YouTube piece is the commentary layer. The 1969 reels are Chapman's telecine.

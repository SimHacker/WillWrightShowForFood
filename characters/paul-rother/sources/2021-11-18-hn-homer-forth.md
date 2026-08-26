---
type: snapshot
venue: Hacker News
url: https://news.ycombinator.com/item?id=29261868
date: 2021-11-18
author: DonHopkins
parent: https://news.ycombinator.com/item?id=29243476
story: Forth vs Lisp
---

# HOMER / Forth on HN — as posted, 18 Nov 2021

Story: [Forth vs Lisp](https://news.ycombinator.com/item?id=29243476)
(17 Nov 2021). Don's comment:
[item?id=29261868](https://news.ycombinator.com/item?id=29261868)
(18 Nov 2021). HN HEAD returns 405; GET is live (checked 2026-08-26).

Coco gave permission to post. The readable history is
[Paul's 1982 page](homer-and-associates-1982.md) and
[Coco's 2021 post](2021-10-20-facebook-homer.md). Below is the comment
**as posted**, links un-abbreviated, so this file stands if HN rot sets in.

Don posted a near-duplicate of the same block elsewhere in that thread;
this is the canonical id.

```
Coco Conn and Paul Rother wrote this up about what they did with FORTH at HOMER & Assoc, who made some really classic music videos including Atomic Dog, and hired Charles Moore himself! Here's what Coco Conn posted about it, and some discussion and links about it that I'm including with her permission:

Peter Conn:

https://imgur.com/a/4Bmb4xu

Homer & Associates (1982):

http://leftbrain.us/rotherHistory/homer.html

Peter Conn Papers at Stanford:

https://library.stanford.edu/blogs/special-collections-unbound/2019/05/peter-conn-papers-available-research

https://oac.cdlib.org/findaid/ark:/13030/c8n303pn/entire_text/

George Clinton - Atomic Dog (Official Music Video) HD

https://www.youtube.com/watch?v=LMVZ36VA0wg

Steve Miller Band - Abracadabra

https://www.youtube.com/watch?v=tY8B0uQpwZs

Steve Miller Band - Bongo Bongo

https://www.youtube.com/watch?v=_NrsRZdMI-A

Flying Logos for 1989 Siggraph Electronic Theater:

https://www.youtube.com/watch?v=9hIOfEiy4lc

>First shown at the 1989 Siggraph Electronic Theater to a rave response, this 3 minute humourous film went on to win several top computer graphic awards that same year including Niccograph of Japan.

>Coco: This was a show favorite at the SIGGRAPH film show that year. The year before the conference committee decided that showing demos wasn't the way to go anymore. Peter wrote Flying Logos as a way to sneak our demo reel into the show by turning it into a story. It worked and we made it into the film show.

>Don: I truly believe that in some other alternate dimension, there is a Flying Logo Heaven where the souls of dead flying logos go, where they dramatically promenade and swoop and spin around each other in pomp and pageantry to bombastic theme music. It would make a great screen saver, at least! Somewhere the Sun Logo and the SGI Logo are still dancing together.

----

Peter Conn and I [Coco Conn] had a company called HOMER & Assoc. which was located at the Sunset Gower Studios from 1977 until we closed shop in 1997. We made music videos, commercials & computer graphics/special effects for feature films. One cool note, we worked with Paul Verhoven on both RoboCop in 1986 and the x-ray scene for Total Recall in '89.

HOMER was actually a real time visual mixing console that our in-house engineer spent 1978 - 1981 designing and building, from scratch. The name HOMER stood for "Hybrid Optical Montage Electronically Reproduced." I helped as well, soldering the LEDs on the console and running cables. Peter built his own optical printer and three years into the build we also bought an early computer paint system. Our engineer finished building the console and promptly decided to move to England. We hadn’t used it because we still hadn’t found the right software to run the system. Luckily that’s when Paul Rother joined the company.

The joy stick on our console would bump you to the next line of code (being a command or sequence of events: fade, cut, dissolve, etc.) The console had touch sensitive fader pads. There were no dials. I think they were made by Allison? Each channel (which controlled either a slide projector or a film projector) was touch sensitive. After recording a sequence we could then tweek the current version using additional effects the channels offered such as momentary, additive, on/off, etc. For instance if you wanted to crossfade two images, you could either program it or perform it. Of course everything you did was recorded and would play back on the next round. You literally performed a sequence of visual effects with your hands. Peter would do countless passes until everything was perfect. This performance would then be played back to IP film on the optical printer. Each slide tray or film real would be individually run, one by one, to IP film. Sometimes there would be 10-15 or more passes to get all the elements transferred. Once that was done we would then convert the IP film to video and do additional video editing and effects. A totally nuts analogue system. But it worked.

---------------

HOMER Explained by Paul Rother, in-house programmer, (1982):

The photo is Paul sitting in front of the Optical Printer 7-bit Paint system, Homer and Associates, circa 1982. Homer and Associates was really one of a kind kinda of company. Founded by Peter Conn, originally I got hired to program Homer II, a visual realtime mixing console. Homer I is another whole story, but before my time. Homer II consisted of 16 slide projectors, 4 movie projectors, a 4 track tape recorder, 24 visual channels (each with its own Z80) touch sensitive sliders, a master Z80 S100 bus system and featuring "the joy stick bumper " control, which looked liked the gear shift right out of a 1964 mustang convertible.

The idea was that you would program a visual sequence, then play the sequence in sync with the sound track on the joystick, including cascades, bumps, cuts, etc. The whole thing would be recorded, and if you wanted to, like an audio mixer, go back and do over dubs, making corrections. Then once you had the perfect "hero" recording, you take the 8" floppy disc with the hero recording and the trays of slides to the optical printer, and record it to IP motion picture film, making multiple passes, one tray at a time. Now that I think about it, it was a crazy idea. We actually got the whole thing to work. And it worked great!

Forth & Charles Moore

We hired Forth, Inc. and got Charles Moore, the inventor of FORTH to program the console host computer. I learned FORTH and worked with Charles. I programmed the 2K byte EPROM in each visual channel. On the Master Z80 system we ran PolyForth a multi tasking system in 32K bytes. We had an extra 16K RAM for buffers and things. If I remember right, the system ran four tasks, but that was 20 years ago, my memory may be hazy.

Anyway, I learn not only FORTH from Charles Moore, but also how to factor code in to small reusable routines, WORDs they're called in FORTH. I learned Object Oriented Programming without knowing it. Also a lot of use of vectors. Its a cool language. Charles Moore was a great inspiration to me, and really taught me a great deal that they never taught me in computer programming school.

CAT-700

After we got the basic Homer II working and were able to record on the optical printer, Peter had another idea. He wanted to be able to see the movement of the optical printer, and see a prior frame compared to the current frame. We already had a video assist on the Fries Mitchell 35mm. What we needed was a Frame Buffer. We heard of S100 video board called the CAT-100, which was 1-bit frame buffer, good enough for what we needed. Somehow we never found a 1-bit version, but we found 7-bit version in the recycler!

We flew to Reno, rented a car and drove to a log cabin up in the hills of Truckie California. We got a demo of the thing. The guys were super secret and didn't want us to see the controlling program. It worked, so we bought it, and then flew onto Palo-Alto and met the French guy who designed it. They checked it out and it was OK. This was the days before computer designed boards, and all the traces on the board were curvy, kinda like a Van Gogh painting. We learned that it was 7-bit (CAT-700) because it would have been an 8-bit, but they could not get the 8th bit to work. We spent the night in Palo Alto with a Stanford friend of Peters working on a crazy secret Apple project, the Lisa. 32KByte Paint System

So I got the CAT-700 frame buffer to work, programmed in FORTH. So in that 32K we had an optical printer control system, and a paint system, all in one. (Also the OS, compiler, debugger, etc.) We later hooked up a Summigraphic Bitpad (before the Watcom tablet) and were able to draw on top of digitized frames. It got to the point where we needed TWO optical printers, one to digitize from film, and the other to record to film. Rube Goldberg is not strong enough descriptive to describe the system, with the filter wheels and all on stepper motors, it made music. The first use of the system was effects for Steve Miller Music Video, Abracadabra. I also remember using it on the George Clinton Video, Atomic Dog.

This photo was taken right after we got the system to work. I had hooked up an analog slider box, which controlled things like color. There were 4 color maps we could switch between instantly We did a lot of work in planes, using 2 planes for the original image to be rotoscoped, and the other 5 planes to draw onto. This photo was taken for an article in Millimeter Magazine. The photo ended up being a two page color spread, and I think Peter was pissed, cause I got premier exposure.

TTL logic

At Homer and Assoc. I also learned TTL logic and designed a number of computer boards for the S100 bus. One that controlled stepper motors with a timer chip (Motorola 6840). Another to control the Slide Projectors also using the same Motorola timer chip to control the lamp triacs. My favorite thing, about the system, was the use of the cassette storage interface as a cheap timecode reader/writer.
```

## Those links now

| As posted | 2026-08-26 |
|---|---|
| imgur.com/a/4Bmb4xu | **200** — still up |
| leftbrain.us/rotherHistory/homer.html | **404** — text+photo here: [homer-and-associates-1982.md](homer-and-associates-1982.md) |
| library.stanford.edu/blogs/.../peter-conn-papers-available-research | **404** — [2019-05-17-stanford-peter-conn-papers.md](2019-05-17-stanford-peter-conn-papers.md) |
| oac.cdlib.org/.../entire_text/ | JS wall / redirect — use [archives.stanford.edu/catalog/m2262](https://archives.stanford.edu/catalog/m2262) or [OAC finding aid](https://oac.cdlib.org/findaid/ark:/13030/c8n303pn/) |
| YouTube four videos | **200** |

Same thread, Don also posted the Forth HONK (see Coco's Facebook record).

↑ [sources](README.md)

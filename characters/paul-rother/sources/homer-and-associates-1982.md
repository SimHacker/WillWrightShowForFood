---
type: source
title: "Homer and Associates (1982)"
author: paul-rother
date: 1982
original: http://leftbrain.us/rotherHistory/homer.html
original_status: "404 as of 2026-08-26"
wayback: https://web.archive.org/web/20240627184122/http://leftbrain.us/rotherHistory/homer.html
photo: ../media/1982-optical-printer-7bit-paint-system.jpg
captured: 2026-08-26 from Wayback 2024-06-27 plus Coco's 2021 posting of the same text
---

# Homer and Associates (1982) — Paul Rother

This page **is** the record. The original
[`leftbrain.us/rotherHistory/homer.html`](http://leftbrain.us/rotherHistory/homer.html)
returned **404** on 26 Aug 2026. Text below is Paul's, as that page carried
it and as Coco posted it in 2021. Photo he describes is local.

![Paul Rother at the Optical Printer 7-bit Paint system, Homer and Associates, circa 1982](../media/1982-optical-printer-7bit-paint-system.jpg)

*In front of the Optical Printer 7-bit Paint system, Homer and Associates,
circa 1982.* Same session, Facebook scan:
[png](../media/1982-optical-printer-facebook-hq.png). Original leftbrain
scan (B&W, 720×551):
[jpg](../media/1982-optical-printer-leftbrain-wayback.jpg).

Same memoir, shorter Coco frame: [2021 Facebook record](2021-10-20-facebook-homer.md).
Don posted both with Coco's permission: [HN 18 Nov 2021](2021-11-18-hn-homer-forth.md).

Homer and Associates was really one of a kind kinda of company. Founded by
Peter Conn, originally I got hired to program Homer II, a visual realtime
mixing console. Homer I is another whole story, but before my time.

**Homer II** consisted of 16 slide projectors, 4 movie projectors, a 4 track
tape recorder, 24 visual channels (each with its own Z80) touch sensitive
sliders, a master Z80 S100 bus system and featuring "the joy stick bumper"
control, which looked liked the gear shift right out of a 1964 mustang
convertible.

The idea was that you would program a visual sequence, then play the
sequence in sync with the sound track on the joystick, including cascades,
bumps, cuts, etc. The whole thing would be recorded, and if you wanted to,
like an audio mixer, go back and do over dubs, making corrections. Then
once you had the perfect "hero" recording, you take the 8" floppy disc with
the hero recording and the trays of slides to the optical printer, and
record it to motion picture film, making multiple passes, one tray at a
time. Now that I think about it, it was a crazy idea. We actually got the
whole thing to work. And it worked great!

## Forth & Charles Moore

We hired Forth, Inc. and got Charles Moore, the inventor of FORTH to
program the console host computer. I learned FORTH and worked with Charles.
I programmed the 2K byte EPROM in each visual channels. On the Master Z80
system we ran PolyForth a multi tasking system in 32K bytes. We had an
extra 16K RAM for buffers and things. If I remember right, the system ran
four tasks, but that was 20 years ago, my memory may be hazy.

Anyway, I learn not only FORTH from Charles Moore, but also how to factor
code in to small reusable routines, WORDs they're called in FORTH. I
learned Object Oriented Programming without knowing it. Also a lot of use
of vectors. Its a cool language. Charles Moore was a great inspiration to
me, and really taught me a great deal that they never taught me in computer
programming school.

## CAT-700

After we got the basic Homer II working and were able to record on the
optical printer, Peter had another idea. He wanted to be able to see the
movement of the optical printer, and see a prior frame compared to the
current frame. We already had a video assist on the Fries Mitchell 35mm.
What we needed was a Frame Buffer. We heard of S100 video board called the
CAT-100, which was 1-bit frame buffer, good enough for what we needed.
Somehow we never found a 1-bit version, but we found 7-bit version in the
recycler!

We flew to Reno, rented a car and drove to a log cabin up in the hills of
Truckie California. We got a demo of the thing. The guys were super secret
and didn't want us to see the controlling program. It worked, so we bought
it, and then flew onto Palo-Alto and met the French guy who designed it.
They checked it out and it was OK. This was the days before computer
designed boards, and all the traces on the board were curvy, kinda like a
Vango painting. We learned that it was 7-bit (CAT-700) because it would of
been an 8-bit, but they could not get the 8th bit to work. We spent the
night in Palo Alto with a Stanford friend of peters working on a crazy
secret Apple project, the Lisa.

## 32KByte Paint System

So I got the CAT-700 frame buffer to work, programmed in FORTH. So in that
32K we had an optical printer control system, and a paint system, all in
one. (Also the OS, compiler, debugger, etc.) We later hooked up a
Summigraphic Bitpad (before the Watcom tablet) and were able to draw on top
of digitized frames. It got to the point where we needed TWO optical
printers, one to digitize from film, and the other to record to film. Rube
Goldberg is not strong enough descriptive to describe the system, with the
filter wheels and all on stepper motors, it made music. The first use of
the system was effects for Steve Miller Music Video, Abracadabra. I also
remember using it on the George Clinton Video, Atomic Dog.

This photo was taken right after we got the system to work. I had hooked up
a analog slider box, which controlled things like color. There were 4 color
maps we could switch between instantly We did a lot of work in planes,
using 2 planes for the original image to be rotoscoped, and the other 5
planes to draw onto. This photo was taken for a article in Millimeter
Magazine. The photo ended up being a two page color spread, and I think
Peter was pissed, cause I got premier exposure.

## TTL logic

At Homer and Assoc. I also learned TTL logic and designed a number of
computer boards for the S100 bus. One that controlled stepper motors with a
timer chip (Motorola 6840). Another to control the Slide Projectors also
using the same Motorola timer chip to control the lamp triacs. My favorite
thing, about the system, was the use of the cassette storage interface as a
cheap timecode reader/writer.

↑ [sources](README.md) · [character](../README.md)

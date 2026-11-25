# Forth Day talk: transcript

<a href="https://www.youtube.com/watch?v=k2pwJ294r8o" target="_blank" rel="noopener">The video</a>, 41
minutes: "Forth Day Talks: Mitch Bradley, PDP-7 Forth, Don Hopkins, PDP-7 and Apple ][ Emulator",
given over Zoom at [Silicon Valley FIG](https://www.forth.org/svfig/)'s Forth Day on 21 November
2026. [Mitch Bradley](../../characters/mitch-bradley/README.md) speaks first, on how his
[PDP-7 Forth](reference/PDP7-FORTH.md) works; [Don Hopkins](../../characters/don-hopkins/README.md)
follows with the [cabinet](README.md). The talk's notes are [Forth and the PDP-7](FORTH-DAY.md), and
the demo Don recorded the day before is [transcribed here](FORTH-DAY-DEMO.md).

This is YouTube's automatic transcript, cleaned up. False starts and filler are cut, and misheard
words are fixed: "fourth" to Forth, "cores" to Korz, "Coen" to colon, "light pin" to light pen,
"touring" to Turing, "Hines Lima" to Heinz Lemke, "Jiren Laneir" to Jaron Lanier, "Tomagosi" to
Tamagotchi. Notes in square brackets are the editor's. The times link to that point in the video.

Every program shown runs at [hyperties.org/cabinet](https://hyperties.org/cabinet/).

**Mitch Bradley: PDP-7 Forth**

- [How it got written](#how-it-got-written)
- [The PDP-7](#the-pdp-7)
- [Tag threading](#tag-threading)
- [Two-word headers](#two-word-headers)
- [Primitives, colon definitions, literals](#primitives-colon-definitions-literals)
- [Teletype, paper tape and the turtle](#teletype-paper-tape-and-the-turtle)
- [What Claude knew](#what-claude-knew)

**Don Hopkins: the cabinet**

- [An emulator in the browser](#an-emulator-in-the-browser)
- [PIXIE's radial menus and rings](#pixies-radial-menus-and-rings)
- [The light pen reads what the 340 drew](#the-light-pen-reads-what-the-340-drew)
- [Editing the 340's program by dragging it](#editing-the-340s-program-by-dragging-it)
- [A source map back to paper](#a-source-map-back-to-paper)
- [DUEL](#duel)
- [Forth on the teletype](#forth-on-the-teletype)
- [PIXIE's ring library, in Forth](#pixies-ring-library-in-forth)
- [Turtle graphics, and two instruction sets in one memory](#turtle-graphics-and-two-instruction-sets-in-one-memory)
- [Korz: a compiler on top of the browser's compiler](#korz-a-compiler-on-top-of-the-browsers-compiler)
- [A sea of slots](#a-sea-of-slots)
- [Compiled blocks](#compiled-blocks)
- [Four emulators, one machine](#four-emulators-one-machine)
- [The 1964 light pen test](#the-1964-light-pen-test)
- [The Ultimate Machine](#the-ultimate-machine)
- [A data glove in 1969](#a-data-glove-in-1969)
- [The Ultimate Hand](#the-ultimate-hand)
- [The same devices on a PDP-10](#the-same-devices-on-a-pdp-10)
- [A Turing machine sharing memory](#a-turing-machine-sharing-memory)
- [Little Computer People on the Apple II](#little-computer-people-on-the-apple-ii)
- [The screen angel](#the-screen-angel)
- [Forth as a CPU](#forth-as-a-cpu)
- [Introducing good ideas to each other](#introducing-good-ideas-to-each-other)
- [LANDER and HILO, spoken](#lander-and-hilo-spoken)
- [Wrapping up](#wrapping-up)

---

# Mitch Bradley: PDP-7 Forth

## How it got written

[0:28](https://youtu.be/k2pwJ294r8o?t=28)

**Mitch:** Along the retro computing lines, I'm really going to just cue up something from Don
Hopkins, who has some really interesting stuff.

[0:44](https://youtu.be/k2pwJ294r8o?t=44) A few weeks ago Don contacted me and said he'd been
doing some PDP-7 resurrection, and asked me if I could do a Forth for it, with graphics. I didn't
think so: it's a tight memory thing. But the next morning I woke up and said, well, maybe Claude
could do it. I've implemented a lot of Forths in my life, and really didn't want to do another one,
but I'd just see if Claude could. That was like 7 in the morning, and by noon it was all done. It's
kind of crazy what you can do with AI these days.

## The PDP-7

[1:29](https://youtu.be/k2pwJ294r8o?t=89)

The constraint is that the [PDP-7](reference/GUIDE-PDP7.md) doesn't have very much memory. But
it's an interesting machine, because it was the very first thing [Unix](UNIX-V0.md) ever ran on.
I found a simulator in the [SIMH](https://github.com/open-simh/simh) group of emulators, and just
started telling Claude what I wanted, and we ended up with a pretty interesting Forth kernel.

[2:01](https://youtu.be/k2pwJ294r8o?t=121) The PDP-7 is a very efficient machine in terms of
hardware. It's implemented in discrete transistor logic, with magnetic core memory, and could only
directly address 8K of 18-bit words. They did a very parsimonious job of using those transistors.
And there was an attached graphics processor called the [Type 340](reference/GUIDE-340.md)
vector display that could do all kinds of interesting graphics, and that was used at
[Cambridge University](../../characters/neil-wiseman/README.md) to do some really cool stuff.

[2:56](https://youtu.be/k2pwJ294r8o?t=176) One of the really interesting things about this
machine is that it has 18-bit words but 13-bit addresses. Claude came up with a very tight kernel
that left 5K of memory for users, and that includes 1K for the graphics display list.

## Tag threading

[3:27](https://youtu.be/k2pwJ294r8o?t=207)

The key thing is that a memory-reference instruction has a four-bit opcode and a 13-bit address,
and that led to a pretty interesting way of doing threading, which I called *tag threading*. You
use 13 bits of a thread cell for the memory address, and that leaves four bits for describing what
kind of word it is. ([TAGS-AND-PIES.md](TAGS-AND-PIES.md), [PDP7-FORTH.md](reference/PDP7-FORTH.md))

[4:01](https://youtu.be/k2pwJ294r8o?t=241) To my way of thinking, the four key things you need to
categorize a Forth word are: a code definition, a colon definition, a literal or constant, and a
variable. Given those you can build a Forth core. With typical indirect threading you'd use all the
bits for an address that points to a code field in the word, and that code field dispatches to what
kind of word it is. But when you've got at least two bits left over, you can push the code field
out into the thread.

[5:02](https://youtu.be/k2pwJ294r8o?t=302) Because of the details of the PDP-7 instruction set,
you can actually make the threads machine instructions. A colon definition is basically a call
instruction; a jump goes directly to a code definition; a load-accumulator is a constant, and the
indirect form of that is a variable. So the threads are just machine instructions.

[5:43](https://youtu.be/k2pwJ294r8o?t=343) `NEXT` is three instructions, but in the usual case,
dispatching to a code word, only the first, an execute, runs. So you can think of this as a
one-instruction `NEXT` on average. If it's not a code definition, you fall through to the other two,
which handle the data words.

## Two-word headers

[6:24](https://youtu.be/k2pwJ294r8o?t=384)

I was worried about how much space headers would cost, so I used
[Chuck](../../characters/charles-moore/README.md)'s old three-characters-plus-count trick. A header
is only two words: three six-bit fields for characters, a five-bit field for the count, and the
miscellaneous things you need. I didn't want to spend a lot of bits on the link, so words can be at
most 512 words long, and the link is a nine-bit length. That gives a very efficient header format.

## Primitives, colon definitions, literals

[7:21](https://youtu.be/k2pwJ294r8o?t=441)

These are some primitive definitions, stack and arithmetic operations; the slide has the details.
Colon definitions use what's essentially a trap instruction that goes to a particular location in
memory, and the lower bits of the instruction are available for dispatch. That's exactly the same
mechanism [Unix used for system calls](UNIX-V0.md).

[8:09](https://youtu.be/k2pwJ294r8o?t=489) There are some tricks around literals, using a literal
pool, because you can't put a full 18-bit literal in the instruction. Control flow is very
conventional: branch and question-branch, with conventional indirect threading.

## Teletype, paper tape and the turtle

[8:43](https://youtu.be/k2pwJ294r8o?t=523)

The emulator emulates the same I/O that was on the real hardware: a Model 33
[Teletype](TELETYPE-DASHER.md), and paper tape, which we use for loading source code.

[9:03](https://youtu.be/k2pwJ294r8o?t=543) There's [turtle graphics](LOGO-TURTLE.md) using the
Type 340 emulation. It compiles the display list into the dedicated memory for the vector display,
and the display just processes that list and draws on the screen. There are Forth words for turtle
graphics, all Logo. ([Forth and the turtle](https://hyperties.org/cabinet/languages/forth-turtle/))

[9:35](https://youtu.be/k2pwJ294r8o?t=575) One of the highlights of my life was having dinner with
[Seymour Papert](../../characters/seymour-papert/README.md), who invented Logo, just a few weeks
before he was tragically hurt in an accident in Vietnam. RIP, Seymour Papert. [Papert was badly
injured in a road accident in Hanoi in December 2006, and died in 2016.]

## What Claude knew

[9:55](https://youtu.be/k2pwJ294r8o?t=595)

The interesting thing was how much Claude knew about Forth. I didn't have to explain anything. I
just told it: I know about Forth, I was on the ANS Forth committee, don't belabor anything, here's
what I want. And it went crazy. It knew a lot about Forth already. It looked at my
[Open Firmware](https://github.com/MitchBradley/openfirmware) Forth implementations for ideas, and
created a whole bunch of tests automatically to verify it had everything right.

[10:28](https://youtu.be/k2pwJ294r8o?t=628) The takeaway is: I don't write code anymore. I tell
Claude what I want, and I try to get the architecture right and make good decisions. Claude writes
code way better than I could. And now I'm going to hand this off to Don.

**Host:** You're a minute into Don's time already.

---

# Don Hopkins: the cabinet

## An emulator in the browser

[11:23](https://youtu.be/k2pwJ294r8o?t=683)

**Don:** This is called [Cabinet](README.md), a new emulator written in a really neat way to write
emulators. It's very powerful. The big point is to run it in the web browser, so there's no
installation.

## PIXIE's radial menus and rings

[11:41](https://youtu.be/k2pwJ294r8o?t=701)

My motivation was [PIXIE](PIXIE-RESTORATION.md), a CAD system. Mitch and I worked on a CAD system
called CADroid, and put [CForth](https://github.com/MitchBradley/cforth) into that circuit design
system. This is vector graphics driven by a [light pen](LIGHTPEN.md), and the demo is driving the
pen as I would with the mouse. There's a speed control: I'm slowing it down so you can see the
vector graphics being redrawn.
([PIXIE / SYMELEC](https://hyperties.org/cabinet/applications/pixie-symelec/))

[12:30](https://youtu.be/k2pwJ294r8o?t=750) This little round thing is a radial menu, where
everything is right next to you. ([Pie menus](TAGS-AND-PIES.md)) PIXIE ran on this PDP-7 at
Cambridge and talked over a network to a [Titan](TINY-TITAN.md), a giant mainframe, so this is a
distributed CAD system. It loads drawings over the network in this format.

[12:56](https://youtu.be/k2pwJ294r8o?t=776) PIXIE has something called rings. If you've heard of
JSON or XML, PIXIE uses these. This emulator knows how to reach into the memory of the [PDP-7] and
draw them. I'll reset so you can watch it draw: this is the drawing, like JSON, behind it, and as it
draws, the structure grows. That's the structure that gets sent back and forth.
([FORTH-RINGS.md](FORTH-RINGS.md))

## The light pen reads what the 340 drew

[13:34](https://youtu.be/k2pwJ294r8o?t=814)

So what we have is an emulator with a user interface layer over it that can look into the memory.
The vector display also has a character generator. The light pen is this big circle; when I move
it around, see this little popup. The vector display drew the letter C, and the user interface can
look in there and see what it is. ([BEAM-AND-PEN.md](BEAM-AND-PEN.md))

## Editing the 340's program by dragging it

[14:07](https://youtu.be/k2pwJ294r8o?t=847)

So I'm going to do something crazy. The vector display is a program that draws these lines. Right
now Forth was drawing turtle graphics, and to draw, it assembles a program into memory. I go to code
mode, and when I drag this, it shows me the disassembly. I am editing by dragging the vector on the
screen: it goes back and pokes the drawing command into memory. So this emulator gives you a direct
editor into code and memory, with a disassembler. ([DRAWING-CONSTRAINTS.md](DRAWING-CONSTRAINTS.md),
[ASSEMBLERS.md](ASSEMBLERS.md))

## A source map back to paper

[15:03](https://youtu.be/k2pwJ294r8o?t=903)

Let me not get into the weeds. This was the motivation. We recovered PIXIE's code:
[Heinz Lemke](../../characters/heinz-lemke/README.md) wrote it and printed it out in 1972, and we
scanned it, using the LLM to proofread, to get all the text. The listing had octal and then code.
This is the actual PIXIE source scanned from the line printer, and it shows me not only the code
it's executing, but the actual scan. It's a source map all the way back to paper.
([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md), [PRESERVATION.md](PRESERVATION.md))

## DUEL

[15:57](https://youtu.be/k2pwJ294r8o?t=957)

Mitch just threw this great Forth in my lap, so I'm like, what can I do with that? In the emulator
you've got things like Spacewar. This is running in the emulator, and I'll try to kill one of these
guys. Boom. Now I just hit a halt instruction, and the trace.
([DUEL](https://hyperties.org/cabinet/games/duel/), DECUS 7-40)

## Forth on the teletype

[16:30](https://youtu.be/k2pwJ294r8o?t=990)

Now we can load Forth into it. I'm sure you're dying to see that part. This is the TTY, and
`WORDS`: there's Forth. It's not running very fast, so we'll turbo it. There's a demo that starts
typing. Whoa, that was too fast. This is the Forth source code it's going through. Here's Forth
scanning for the keyboard, and look at that: type-ahead. I got my characters and it ran them.

## PIXIE's ring library, in Forth

[17:22](https://youtu.be/k2pwJ294r8o?t=1042)

This is hard to explain, but PIXIE is a big hand-written assembly program, and it has a library
for these PIXIE ring data structures. It's like a JSON library. So I took this PDP-7 assembly
language library, the data structure heart of PIXIE, and put it into Forth. Now we have Forth
words that call this library written in assembly. The demo makes some ring objects, does a few
things with them, and look: it says hello from PDP-7 Forth. ([FORTH-RINGS.md](FORTH-RINGS.md))

## Turtle graphics, and two instruction sets in one memory

[18:30](https://youtu.be/k2pwJ294r8o?t=1110)

Now it's doing turtle graphics. There's a flower. The demo drives the computer through its inputs,
the TTY and the rest. A snowflake. The daisy.
([LOGO-TURTLE.md](LOGO-TURTLE.md))

[19:04](https://youtu.be/k2pwJ294r8o?t=1144) Forth is assembling these. There are two instruction
sets: one bus and one 18-bit core memory, then the PDP-7 processor, and the graphics display, which
is a coprocessor with its own instruction codes. Forth has already run and drawn all this; it's
just staying there in display list memory. See how the draw command changes.
([DISPLAY-DEVICES.md](DISPLAY-DEVICES.md))

## Korz: a compiler on top of the browser's compiler

[19:38](https://youtu.be/k2pwJ294r8o?t=1178)

There's another level of weird going on here. Writing this in TypeScript, which compiles into
JavaScript and runs in the web browser and the Node web server, gets us into a universal
programming environment. We could use WebAssembly, but I found it's even better to just use
JavaScript.

[20:11](https://youtu.be/k2pwJ294r8o?t=1211) Sun's HotSpot, the CLR and JavaScript's V8, these
virtual machines running dynamic languages, were based on the research
[Dave](../../characters/david-ungar/README.md) did, starting at Xerox PARC and going to Stanford and
Sun, on the [Self](https://selflanguage.org/) programming language, with
[Randy Smith](../../characters/randall-smith/README.md). The idea behind Self is a just-in-time
compiler. What I've implemented is a just-in-time compiler on top of the just-in-time compiler in
the web browser. I found out what the browser's JavaScript-to-machine-language compiler is really
good at compiling efficiently, and made my higher-level compiler output that.
([KORZ-COMPILER.md](KORZ-COMPILER.md), [WEB-BENCH.md](WEB-BENCH.md))

## A sea of slots

[21:05](https://youtu.be/k2pwJ294r8o?t=1265)

Let me pause. Korz is like the next generation of Self
([Korz](https://doi.org/10.1145/2661136.2661147), David Ungar, Harold Ossher and Doug Kimelman,
Onward! 2014). It's a very elegant way
to define a CPU. This is the PDP-7 CPU: read, write, effective address, execute, skip, condition
codes, rotate, IOTs. ([KORZ-CPU.md](KORZ-CPU.md))

[21:36](https://youtu.be/k2pwJ294r8o?t=1296) The PDP-7 has these plug-ins that add instructions.
The 340 plugs in and adds instructions: an IOT is an I/O instruction, and when you plug in a 340 you
get these new opcodes. Here are the effective-address calculations for all the regular PDP-7
opcodes. ([DEVICES.md](DEVICES.md))

[22:12](https://youtu.be/k2pwJ294r8o?t=1332) This takes a description of the CPU, the backplane and
the devices, and breaks them all up into tiny pieces. Instead of objects, it's a *sea of slots*. An
object in Self has a bunch of slots, but Korz says we don't really need objects, just lots of slots
that plug together like Legos. ([SEA-OF-SLOTS.md](SEA-OF-SLOTS.md),
[KORZ-DISPATCH.md](KORZ-DISPATCH.md), [KORZ-MACHINES.md](KORZ-MACHINES.md))

[22:39](https://youtu.be/k2pwJ294r8o?t=1359) This is the description of the computer, and this is
the description of the display: your mode, pen, scale, intensity. The 340 is the vector display,
the 342 the character generator, and the 347... [the 347 is the subroutine option, `DJS` and
`DJP` ([GUIDE-340.md](reference/GUIDE-340.md)); the light pen is the Type 370
([GUIDE-LIGHTPEN.md](reference/GUIDE-LIGHTPEN.md))]. All these things plug in.

## Compiled blocks

[23:03](https://youtu.be/k2pwJ294r8o?t=1383)

Then the compiler: this is the code the CPU executes. Whatever program you load, it starts
optimizing that program's instructions. Here it found four instructions in a row and translated
them: the four PDP-7 instructions, jump to `GETC`, `LAC` display, `SNA` and jump. And this is that
translated to JavaScript. In memory, this is the machine code disassembled, the `SNA`, and the jump
to `GETC`, and we can jump to see what that is. ([KORZ-INSPECT.md](KORZ-INSPECT.md))

## Four emulators, one machine

[24:01](https://youtu.be/k2pwJ294r8o?t=1441)

It's not just an emulator; in fact this is four emulators. It's based on the
[SIMH](https://github.com/open-simh/simh) emulator, a giant monolith that emulates everything from
a VAX to a PDP-8. That's too big and too monolithic to put in the web browser, so I took just the
PDP-7 emulator from it ([Bob Supnik](../../characters/bob-supnik/README.md)'s CPU,
[Phil Budne](../../characters/phil-budne/README.md)'s 340,
[Lars Brinkhoff](../../characters/lars-brinkhoff/README.md)'s PDP-7 interface) and wrote an emulator
that's a translation of SIMH's PDP-7. That was pretty good. ([SIMH-MAP.md](SIMH-MAP.md))

[24:42](https://youtu.be/k2pwJ294r8o?t=1482) A typical emulator is a giant switch statement.
Instead I redescribed it in Korz and made an interpreter for Korz. That's much slower than the
switch. On top of the interpreter you make what's called a resolver, which optimizes everything
into tables: faster, still slow, but a step toward what a just-in-time compiler needs. Then the
compiler. These are four 100% compatible emulators, and the Korz compiler is the only level that
generates this code. It compiles instructions into JavaScript, which goes straight into the
browser's JavaScript-to-machine-language compiler, and is super efficient.
([BENCHMARKS.md](BENCHMARKS.md))

[25:56](https://youtu.be/k2pwJ294r8o?t=1556) The whole point is to be telescoping, fitting neatly
onto the next level. We're building somewhat of a tower of Babel, but we're very tightly fastening
each level. It's hard to describe how general this is: once one CPU or device is done, others are
easy.

## The 1964 light pen test

[26:24](https://youtu.be/k2pwJ294r8o?t=1584)

The devices are made this way too, so the optimizer can work on them. This is from 1964: the light
pen test DEC shipped in 1964. I actually needed it to debug the damn light pen. If I go `demo`, it
goes through the 1964 light pen test.
([Light pen test](https://hyperties.org/cabinet/devices/light-pen-test/), [LIGHTPEN.md](LIGHTPEN.md))

## The Ultimate Machine

[27:03](https://youtu.be/k2pwJ294r8o?t=1623)

Once I got the light pen working, let's make a device. This is written in Forth, using Mitch's
vector graphics library to draw text and lines. Forth is really good for handling and testing
devices; that's [Open Firmware](https://github.com/MitchBradley/openfirmware)'s thing. I click, and
a hand comes out and turns it back off. This is
[Marvin Minsky](../../characters/marvin-minsky/README.md)'s and Claude Shannon's
[useless machine](https://en.wikipedia.org/wiki/Useless_machine), or Ultimate Machine. You can buy
them at Spencer's Gifts.
([The Ultimate Machine](https://hyperties.org/cabinet/devices/ultimate-machine/),
[FORTH-DEVICE.md](FORTH-DEVICE.md))

[27:45](https://youtu.be/k2pwJ294r8o?t=1665) Let me make it really fast. This is a Forth program
driving a device with I/O instructions. We'll slow it down: it's off, we click it on, and it goes
wait, open, reach, press, return, close. That's all. It's a device that turns itself off, the
simplest device you could think of.

## A data glove in 1969

[28:07](https://youtu.be/k2pwJ294r8o?t=1687)

Then I got a little more ambitious: VPL, virtual reality,
[Jaron Lanier](../../characters/jaron-lanier/README.md), the DataGlove. This is a data glove as if
they had one back in 1969. A device reports my finger angles, and if I take my hand off, it goes into
demo mode. Forth is great at scripting these things.
([DataHand](https://hyperties.org/cabinet/devices/datahand/), [HAND-TRACKING.md](HAND-TRACKING.md))

## The Ultimate Hand

[28:48](https://youtu.be/k2pwJ294r8o?t=1728)

So I have a device that turns itself off and a device that tracks your hands. Let's write a little
more Forth that composes them. What the hell is this? The Ultimate Hand. It uses both devices at
once. I put my hand there; it detects a hand. Take your hand away. Put a hand there, and my hand
goes up, and I go whoop. Or we'll do one for no kids in the room. That's the NSFW version. You can
go, hey, hi, how you doing?
([The Ultimate Hand](https://hyperties.org/cabinet/devices/ultimate-hand/),
[source](tapes/pdp7forth/ultimate-hand.fs))

[29:49](https://youtu.be/k2pwJ294r8o?t=1789) This is what Forth is great at: driving devices and
wiring together demos. Mitch gave me this Forth plus turtle graphics.

## The same devices on a PDP-10

[29:58](https://youtu.be/k2pwJ294r8o?t=1798)

The cool thing is these devices can plug into different machines. I've got a PDP-10 emulator, 36
bits, and the PDP-10 takes the same 340 graphics display, and I'll plug in the same things.
([PDP10.md](PDP10.md), [TINY-ITS.md](TINY-ITS.md))

## A Turing machine sharing memory

[30:15](https://youtu.be/k2pwJ294r8o?t=1815)

I really love this idea of coprocessors sharing the same memory, so I made a Turing machine. Years
ago I took a philosophy and computing course at the University of Maryland from
[Christopher Cherniak](../../characters/christopher-cherniak/README.md), a philosopher, who had a
Turing machine simulator on the IBM PC, and we had an assignment to write Turing machines. I found
his courseware and translated it to Forth. This is a universal Turing machine. We'll run a demo and
make it faster. The Turing machine is another CPU sharing the same memory as the PDP-7 and the
display.
([Turing machine](https://hyperties.org/cabinet/devices/turing-machine/),
[TURING-ENGINE.md](TURING-ENGINE.md))

## Little Computer People on the Apple II

[31:18](https://youtu.be/k2pwJ294r8o?t=1878)

When I was a kid in high school I had an Apple II, and I made a ProDOS Forth for it. I won't show
that now ([Don's ProDOS Forth](https://hyperties.org/cabinet/languages/don-hopkins-prodos-forth/),
[APPLE2.md](APPLE2.md)), but we have all these other things.

[31:31](https://youtu.be/k2pwJ294r8o?t=1891) This is
[Little Computer People](https://hyperties.org/cabinet/games/little-computer-people/): "Welcome,
researcher, to Little Computer People. Please enter your name." I worked on
[The Sims](../../characters/will-wright/README.md) years later, and this is one of the things that
inspired it: [Will Wright](../../characters/will-wright/README.md) talked to the guy who made
Little Computer People ([David Crane](../../characters/david-crane/README.md)). The Sims is a lot
more complicated, but this already did the thing of a Tamagotchi, a pet rock.
([UPCYCLING-LCP.md](UPCYCLING-LCP.md), [the guide](guides/little-computer-people.md),
[the houses](worlds/little-computer-people/README.md))

[32:01](https://youtu.be/k2pwJ294r8o?t=1921) But on an Apple II it's a pain in the butt to use. Look
at this crappy text. You have to type in there, and the instructions say Control-W gets him a glass
of water. I can't remember that. "Please play another song", "Please build a fire": you can type to
it, there's a chat, but I can't remember all that.

## The screen angel

[32:28](https://youtu.be/k2pwJ294r8o?t=1948)

When you boot this, watch: it says "Please insert a disk", and then "Please flip the disk over".
You don't even see it. A normal Apple II user would have to put another disk in, flip it and hit a
key. This can look at the screen and see it, and now it just says "Please enter your name". So I have
an easy place to type my name. Don. "Please enter the date": the browser knows what the date is
and puts it in, so I just hit Return. "Wow, I can't believe it's Saturday, November 21st, 2026." If
you say so. "Hang on while someone moves in and gets settled."

[33:18](https://youtu.be/k2pwJ294r8o?t=1998) Here's the really hard thing about bringing Little
Computer People up so kids these days can do it: it takes about a minute and a half while this guy
walks around and learns, and nobody wants to wait that long. Fortunately we have a really fast 6502
emulator, so we go to max speed while he does all his stuff.

[33:53](https://youtu.be/k2pwJ294r8o?t=2033) Please build a fire. He's not listening. Dog food: he
gets dog food and gives it to the dog. Ring the alarm. I mute the sound when it's going too fast.
This is all about accessibility: making it so modern people can play it. Please play another song.
[music] It mutes at max.

[34:35](https://youtu.be/k2pwJ294r8o?t=2075) The idea is we've got an emulator, but we can look at
it from above. I call it the screen angel: an angel looking over your shoulder, helping you. Please
brush your teeth. ([CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md), [MAPPING.md](MAPPING.md))

## Forth as a CPU

[34:57](https://youtu.be/k2pwJ294r8o?t=2097)

The whole idea is to make an environment for emulators, all running in the web browser. Where does
Forth fit in? You probably won't believe me. Forth and the turtle use a certain amount of memory.
PIXIE, the CAD system, uses most of the memory. What I want is to link Forth into this CAD system,
but there's not enough memory.

[35:35](https://youtu.be/k2pwJ294r8o?t=2135) So I realized: I can have hardware devices that are
CPUs. Why don't I make a Forth CPU card? I've taken the Forth that runs in memory and said: make a
version of it in hardware that doesn't take the memory, and runs the exact same stuff out of memory
as the real Forth. I turned Forth into a hardware CPU that's emulated and doesn't exist. That
reduces the memory Forth needs.
([FORTH-DEVICE.md](FORTH-DEVICE.md), [FORTH-HIGH-MEMORY.md](FORTH-HIGH-MEMORY.md))

[36:12](https://youtu.be/k2pwJ294r8o?t=2172) This is on my to-do list. I already have the device
that is the Forth accelerator. The next step is to plug it into PIXIE, which is already using most
of memory, so I can type Forth commands that talk to and control a program written in 1967 [PIXIE's
listing is from 1972], with a Forth written a month ago. We can just virtualize parts of it out into
hardware. It's confusing and hard to get your mind around. ([TODO.md](TODO.md),
[ROADMAP.md](ROADMAP.md))

## Introducing good ideas to each other

[37:05](https://youtu.be/k2pwJ294r8o?t=2225)

The whole thing is, I'm using Claude, and I'm finding the best research and the best ideas in
programming languages, and pointing to them, because Claude has already read all the papers about
them. I'm trying not to invent new stuff. I'm trying to choose really well thought out stuff, by
people much smarter than me, and introduce them to each other. ([MANIFESTO.md](MANIFESTO.md),
[ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md))

[37:34](https://youtu.be/k2pwJ294r8o?t=2254) The Apple II emulator is going about 150 times the
speed of a normal Apple II at this point. What's the point of running an Apple that fast? It turns
out Little Computer People makes you wait a minute and a half, and nobody's got a minute and a
half. So we run that part real fast, then watch: he's moved in. Back to speed one.
([BENCHMARKS.md](BENCHMARKS.md))

## LANDER and HILO, spoken

[38:07](https://youtu.be/k2pwJ294r8o?t=2287)

Here's some low-tech stuff: a lunar lander game that speaks. "Time is zero, altitude is 500, speed
is minus 50, fuel is 60. Your burn?" 20. "Time is one. Altitude is 467.5. Speed is minus 15. Fuel
is 40." 7. Well, you know how this ends. If we just hit Return... oh no. [laughter]
([LANDER](https://hyperties.org/cabinet/games/lander/))

[39:03](https://youtu.be/k2pwJ294r8o?t=2343) Another one, for the PDP-7 teletype: "I think of a
number from 0 to 99. You guess it." It says it's not listening while the machine speaks; it's
starting the microphone. 50. "Higher than 50."
([HILO](https://hyperties.org/cabinet/games/hilo/), [TELETYPE-DASHER.md](TELETYPE-DASHER.md))

## Wrapping up

[39:41](https://youtu.be/k2pwJ294r8o?t=2381)

**Host:** Time to wrap up.

**Don:** I think I've covered most of it. We can run
[Timothy Leary](../../characters/timothy-leary/README.md)'s
[Mind Mirror](https://hyperties.org/cabinet/games/mind-mirror/),
[Wizardry](https://hyperties.org/cabinet/games/wizardry/), Forth, all this stuff,
[Apple Logo](https://hyperties.org/cabinet/languages/apple-logo-ii/). We'll run that later.

**Host:** We meet every month. Will you come back?

**Don:** I'll come back. I just got the Apple II emulator working a day ago, so it'll be better in
a month. [laughter] Oh, have you seen [Pascal](https://hyperties.org/cabinet/languages/apple-pascal/)?
End of demo.

[40:32](https://youtu.be/k2pwJ294r8o?t=2432) **Host:** Bob Armstrong, introduce yourself. [The
next talk begins.]

---

↑ [Forth and the PDP-7](FORTH-DAY.md) · [The demo transcript](FORTH-DAY-DEMO.md) ·
[Cabinet](README.md)

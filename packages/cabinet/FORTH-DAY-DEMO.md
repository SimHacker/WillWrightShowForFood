# Forth Day demo: transcript

<a href="https://youtu.be/I-Rf3XP_D0g" target="_blank" rel="noopener">The video</a>, 26 minutes,
recorded by Don Hopkins on 21 November 2026, before the talk [Forth and the PDP-7](FORTH-DAY.md)
at Silicon Valley FIG's Forth Day. This is YouTube's automatic transcript, cleaned up. False starts and
filler are cut, and misheard words are fixed, for example "fourth" to Forth, "cores" to Korz,
"light pin" to light pen and "touring" to Turing. The times link to that point in the video.

- [The cabinet](#the-cabinet)
- [Forth on the TTY, and PIXIE rings](#forth-on-the-tty-and-pixie-rings)
- [Editing the 340's instructions with the light pen](#editing-the-340s-instructions-with-the-light-pen)
- [Tracing, and the source map](#tracing-and-the-source-map)
- [Korz: a compiler on top of the browser's compiler](#korz-a-compiler-on-top-of-the-browsers-compiler)
- [Little Computer People on the Apple II](#little-computer-people-on-the-apple-ii)
- [The light pen test from 1964](#the-light-pen-test-from-1964)
- [The Ultimate Machine](#the-ultimate-machine)
- [DataHand](#datahand)
- [The Ultimate Hand](#the-ultimate-hand)
- [A Turing machine as a coprocessor](#a-turing-machine-as-a-coprocessor)
- [PDP-7 Unix](#pdp-7-unix)

## The cabinet

[0:00](https://youtu.be/I-Rf3XP_D0g?t=0)

This is an emulator that runs in the web browser. It includes an Apple II emulator and a PDP-7
emulator. Its original purpose was to run PIXIE / SYMELEC, from a 1971 listing, and we recreated
it here. The same code from back then is running. There's another demo of that.

## Forth on the TTY, and PIXIE rings

[0:28](https://youtu.be/I-Rf3XP_D0g?t=28)

What this one is about is Forth. Mitch Bradley made a PDP-7 Forth interpreter. This is a TTY,
and I'm talking to the Forth. I type some arithmetic and a dot, and it prints 13. `WORDS` lists
the Forth words. It's Forth.

The cool thing about it is that it has turtle graphics. I hit the demo button, and it says we've
got some PIXIE rings in core. Let's show them right now: there are RINGS, SLOTS and KORZ panels,
and I'll open RINGS. Forth made these structures. It's using the same PDP-7 library, in assembly
language, that PIXIE uses, so we have dynamic memory allocation.

[1:33](https://youtu.be/I-Rf3XP_D0g?t=93) You can write Logo-like programs in Forth that drive
the turtle. The way it works is that the 340 vector graphics display is actually another
processor. It runs in the same memory that Forth runs in, and it has its own instruction set for
drawing. Forth assembles 340 display opcodes in memory.

## Editing the 340's instructions with the light pen

[2:05](https://youtu.be/I-Rf3XP_D0g?t=125)

This light pen can be put into a mode that edits 340 instructions. I close the TTY, open the
memory view, pause so it doesn't run away, and go into code mode. This is like a disassembler,
but it also explains what things are. I don't know the PDP-7 or the 340, so I had it explain them
to me.

The light pen here does something a real one doesn't: it's an editable view of the instructions
for the 340's processor. At first I got nothing to grab, just little dots, because I'd edited the
opcodes while it was paused. Set the speed slow and run, and there it goes.

[3:44](https://youtu.be/I-Rf3XP_D0g?t=224) The PDP-7 is one processor running its code, and the
vector graphics display is its own processor. Now that it's running, I can drag a corner. These
are relative draw instructions that only have a certain range, so the corner is on a leash
between the incoming and the outgoing vector, like a little dog that can only get so far.

It's two processors sharing the same memory. Forth is great at having an assembler for whatever
native instruction set you have, and here you've got two instruction sets. The Forth assembler
assembles drawings as well as code.

## Tracing, and the source map

[4:34](https://youtu.be/I-Rf3XP_D0g?t=274)

In trace mode we're tracing the Forth as it runs. You can look at the PDP-7's registers, and there
are several ways of viewing memory. Source is the source code of the Forth: like the source maps
web browsers use, it maps memory locations to the source, so it can show you where it's actually
executing. Then there's follow PC, and trace live.

It's not really a debugger yet; it's a way to look at what's running. The disassembly shows
comments about the assembly instructions. Right now it's sitting waiting for a character. If I
open the TTY and hit Return, it outputs. I typed `WORDS` and Return. We can speed up, and there's
type-ahead.

This is the view of the PDP-7 running. I don't have a dedicated view of the display processor
yet.

## Korz: a compiler on top of the browser's compiler

[6:05](https://youtu.be/I-Rf3XP_D0g?t=365)

This is not just an emulator. It has four rungs. I took [SIMH](https://github.com/simh/simh) as
the definition of exactly how the PDP-7 behaves. Korz is a way of deconstructing object-oriented
programming into slots. You can look at slots as groups, and those appear to be objects, but the
basic thing is that it decomposes the definition of a CPU into little JavaScript functions.

So this is a just-in-time compiler running on top of the just-in-time compiler in the web
browser. The instructions get compiled into little snippets of code. If I pause and look at the
memory, this opcode gets compiled into this JavaScript. It runs much faster than a normal
emulator that switches on every opcode.

[7:54](https://youtu.be/I-Rf3XP_D0g?t=474) There are different levels of acceleration here:

- **Switch statements:** a standard port of SIMH's PDP-7.
- **Korz interpreter:** slow, but correct and simple.
- **Korz resolver:** table-based, a step toward a just-in-time compiler.
- **Korz compiler:** the just-in-time compiler. It just runs your code and compiles it.

This is generated from the PDP-7 code that's running. Here we got four instructions in a row
slurped up into one function that edits the virtual machine. The browser's just-in-time compiler
is very good at optimizing this kind of code, so we layer one compiler on top of another on
purpose, and feed the lower one exactly what it thrives on.

[9:08](https://youtu.be/I-Rf3XP_D0g?t=548) These are the memory references, and this is the CPU
model. It generates the code that executes the code. These are the instructions of the CPU, and
this is the JavaScript that does an exclusive or, and here's an add. The whole CPU is decomposed
into these little slots. There's a skip instruction, and these are the skip instructions and the
code that implements them. I declare the slots at a high, convenient level, and it writes the code
to emulate the CPU.

[10:09](https://youtu.be/I-Rf3XP_D0g?t=609) These are devices. Devices plug in as instructions
and memory mapping, so these are slots that define new instructions, the way the 340 plugs in.
This is the glue to the device. Then there are dispatch methods, and Korz rewrite. It's a
crystalline way to organize the definition of the CPU and the bus and the whole thing without
repeating yourself, and it runs really fast because we're stacking two just-in-time compilers.

## Little Computer People on the Apple II

[10:59](https://youtu.be/I-Rf3XP_D0g?t=659)

Now let's go way back to the Apple II, and something that inspired The Sims: *Little Computer
People*.

> Welcome, researcher, to Little Computer People. Please enter your name.

Programs made in 1985 and 1986 can be hard to use, so I put a layer of web page over it. I'm Don.
"Welcome, Don." It asks for the date, and it spares you typing into those fields. It knows the
date, so I just hit Return.

> I can't believe it's Saturday, November 21st, 2026. If you say so. Hang on while someone moves
> in and gets settled.

He's home. Take care of him with the buttons, or ask him something.

[11:45](https://youtu.be/I-Rf3XP_D0g?t=705) Did you see what it just did? It ran at maximum
speed while he moved in. In the original game that took more than a minute, and that's going to
lose the doomscrolling audience. You can't type until he's been through "oh my god, this is a
house, wow, it has a kitchen." An emulator that runs at some ridiculous speed gets you through
that. Being able to fast-forward is an accessibility thing.

We can go back to 1x and ring the phone. Then, when I'm bored, I can make it go real fast.

[12:40](https://youtu.be/I-Rf3XP_D0g?t=760) Here's the whole story of the Apple II game. It
has control characters for delivering food, and a chat command for "please play the piano," but
you don't have to remember them. When you start it, it has to flip the disk over, and it does
that for you. I hit Water. He doesn't always listen to you. "Please dance." "Please, please
dance."

[13:16](https://youtu.be/I-Rf3XP_D0g?t=796) That speech synthesizer is in the layer above, which
I call ScreenAngel. It's like someone looking over your shoulder, integrating the game with a
modern user interface. It can look at the screen and know what state the game is in, then present
a user interface for that state.

I ask him to play the piano, and go faster, really fast. Then ask him to dance, the really fast
dance. Asking for a letter is great: "Please write a letter to me." This is going to be too fast.

> As you can see from the water bottle in the kitchen, I've got plenty to drink, so at least I
> don't have to worry about that. I get awfully busy sometimes, because I have only so many hours
> in the day. That crazy canine of mine still acts like a puppy, and is as frisky as the day I
> brought it home. Love, Edward.

[14:26](https://youtu.be/I-Rf3XP_D0g?t=866) We've discovered his name. I typed my name, because
I'm the researcher, but now he has a name, and he has a dog. We can ask for dog food. That's the
doorbell. His face is green, which is probably not a good sign. He brought in the dog food. It's
fun to play fast. That's how I play The Sims all the time.

Let's ask for the piano again. At 16x it mutes, for your safety. But we can even go to max, and
play at max. Ask for a fire: he goes down there and starts one. Ask him to dance at max. It's just
running the simulation fast forward and not displaying as often. That's how it gets through the
whole startup.

[15:20](https://youtu.be/I-Rf3XP_D0g?t=920) This is also Korz. We've got floppy disks full of
our other friends, Fritz, Ivan and Rob. The web browser has full visibility into the save file.
This is the code that's being compiled to run this particular program. If it were UCSD Pascal or
something else, the workload would be a very different set of things.

[15:51](https://youtu.be/I-Rf3XP_D0g?t=951) The 6502 here is really a lookup table of 6502
instructions. It's a little simpler. There's I/O and the CPU. This is a platform for emulators
that share a lot. Korz breaks things down into slots, and not just the CPU: the devices are Korz
too, and they can plug in deeply. It's hard to explain, but the end result is that you can easily
do 16x. And there are some stats.

## The light pen test from 1964

[16:47](https://youtu.be/I-Rf3XP_D0g?t=1007)

Speaking of devices, before DataHand let me do the simple thing. This is an actual program from
DEC, from about 1964, to test the light pen. We can slow it down and see the scanning. I was in
edit mode, so I switch back to the regular light pen. I'm running it super slow. It's meant to
test the light pen, but everything has a demo, so Play Demo takes it through the test.

I actually had to use this to find bugs in the emulator. It was fortunate that DEC had this
program to help you see whether your light pen was busted.

## The Ultimate Machine

[17:50](https://youtu.be/I-Rf3XP_D0g?t=1070)

Next, higher up: the Ultimate Machine. Marvin Minsky and Claude Shannon had this crazy idea of a
machine that just turns itself off. There's a switch, a hand comes out and turns it off, and then
it goes back. It goes through these cycles and sits in the off state. I'll slow it down a little.

[18:17](https://youtu.be/I-Rf3XP_D0g?t=1097) You might notice we have tooltips over the vector
graphics, because we can tell what drew them. It can even say "I'm drawing the lever," and then
draw the lever, "I'm drawing the wait light," "I'm drawing the off switch." These drawings are
written in Forth, by the way. When it writes to the display device, it also says, "here's the
instruction that drew you."

So in memory, paused, you can click on what drew that, and there's the draw instruction. It
doesn't just draw on the vector display; it remembers what it drew, and that links you back to
the code that drew it. That's the whole idea here: mapping both ways.

[19:31](https://youtu.be/I-Rf3XP_D0g?t=1171) The Ultimate Machine has a timer, and it goes
through wait, open, reach, press, return, close and rest. It's modeled as a PDP-7 device with its
own instructions, which it adds to the PDP-7, and Forth can talk to it.

[19:59](https://youtu.be/I-Rf3XP_D0g?t=1199) At max, this is with the just-in-time compiler. It's
compiling this code, including the Forth system itself and all the code it's drawing with, so we
can run much faster than merely 30 times. This is a demo of one device, and all that device does
is turn itself off.

## DataHand

[20:28](https://youtu.be/I-Rf3XP_D0g?t=1228)

Now we have DataHand. Hello! This is like the VPL DataGlove, but you don't need a glove. It's an
abstract device that uses the camera to follow your hand.

It says what it's drawing: when it draws a finger, it says "I'm the thumb." The round thing is
the light pen cursor, and the light pen detects the finger under it: the index finger, the
little finger. You can make the hand big and small by moving in and out. Think of it as just an
input device. It plugs into the PDP-7 and converts the hand into PDP-7 coordinates.

## The Ultimate Hand

[21:28](https://youtu.be/I-Rf3XP_D0g?t=1288)

Now we have Forth to write both of these demos with, so let's load both reusable modules and
combine them into the Ultimate Hand. If you don't hold up a hand, it's in demo mode, and the hand
makes these gestures. If your face looks like a hand it doesn't work, so you have to lean out.

This is the hand driving the Ultimate Machine. There's the off switch. When I hold up my hand,
it goes. There's a latch down here: that's the state machine of going out, doing it and coming
back. That's one device driving another device. I have to take my hand away before I get another
boop. Back to demo.

[22:32](https://youtu.be/I-Rf3XP_D0g?t=1352) Hello. I'm flying, but I'm too small to reach.
Watch: as you get bigger, you reach it.

This is what Forth is great for. Forth is running the show here, assembling the instructions that
control the devices. Forth just fits the PDP-7 so nicely.

## A Turing machine as a coprocessor

[23:13](https://youtu.be/I-Rf3XP_D0g?t=1393)

This is a Turing machine as a coprocessor. Let's do the demo. It uses the vector graphics
display, and any key stops it. It's a universal Turing machine: a device that executes Turing
machine code in your memory.

The tape of a Turing machine has to be infinite, so it has something like virtual memory and page
faults. The Turing machine device can only see a window of the tape. When the program decides it
needs to go left and there's no more tape to the left, it sends an interrupt to the PDP-7, which
says "oh, you need more tape to the left" and uncompresses it. So there's a virtual infinite tape
going on.

## PDP-7 Unix

[24:26](https://youtu.be/I-Rf3XP_D0g?t=1466)

To tie it up, we've got to do PDP-7 Unix. This is what the first version of Unix was written on.
We can log in. Should we do ken or dmr? Let's see what's in the home directory: `ls`. I'll crank
it up a little, in fact why not max.

`cat` on `as`: that's assembly, the source code of a PDP-7 assembler. `ls` doesn't even have a
`-l`. `cat b.b`: this is a B compiler written in B, and that way you get a cool file name. The B
readme tells you how to compile and assemble everything. Then hello world: `cat hello.b`. One
18-bit word holds two characters.

[25:54](https://youtu.be/I-Rf3XP_D0g?t=1554) This is a TTY simulator, to the extent that it's
still convenient to use. That's the whole philosophy: simulate accurately where possible, but be
able to improve the experience like this.

We're in Unix. I don't think we have the source maps for Unix, but we can certainly trace it. It
works; that's the whole point. That's enough for now.

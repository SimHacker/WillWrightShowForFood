# First Facebook message to Phil: draft

**Status:** draft, for Don to send by hand. Not sent.

---

Hi Phil! Sorry it took me 40 years to answer your FIGIL question from September 1986, about
which Forth to get for your friend's Apple II, since BASIC was too slow (big surprise).

My answer is mine. It started as fig-FORTH for the 6502, and I extended it to be Forth-83
compliant, running under ProDOS with a Videx 80-column card. It boots to the `ok` prompt in your
browser now, no disk swapping required:
https://hyperties.org/cabinet/languages/don-hopkins-prodos-forth/

Four years after that you asked "Mind if I forward this?" about my PizzaTool post, Ben Stoltz's
tool for faxing orders to Tony & Alba's. Everybody wanted a copy, and I had to forward the whole
pile to Ben. Me and my big mouth!

Here's why I'm really writing. Your `type340.c` and `display.c` from SIMH are the heart of a
browser PDP-7 with a Type 340 that I've been building, called Cabinet. Lars told me you did most
of the work on the 340. It runs PIXIE, Heinz Lemke's 1972 CAD system from Cambridge, recovered
from the line printer listing, and Mitch Bradley's new PDP-7 Forth with turtle graphics on the
340. It also runs PDP-7 Unix from the pdp7-unix restoration, the kernel you typed in, with your
shell. Forth drives a
couple of made-up devices too, like the Ultimate Hand:
https://hyperties.org/cabinet/devices/ultimate-hand/

Mitch and I gave a talk about it at Forth Day last week:
https://www.youtube.com/watch?v=k2pwJ294r8o
and here's the demo I recorded the day before:
https://youtu.be/I-Rf3XP_D0g

Next on my playlist is a world-class PDP-10 emulator: a KA10 that runs ITS and acts like MIT-AI,
with the same 340 plugged in, and that runs Zork too, all in the browser. Here's the plan, and
I'd love your eyes on it:
https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PDP10.md

The emulator technology is the fun part. It's built on Korz, David Ungar's successor to Self
(with Harold Ossher and Doug Kimelman). Korz throws out objects and keeps the slots: a "sea of
slots" that plug together like Lego. So the CPU, the backplane and each device are written as
small slots: effective address, skip, rotate, and so on. A device like the 340 plugs in by adding
its own IOT instructions to the CPU.

The same machine runs on four rungs, all 100% compatible:

1. A straight translation of SIMH's PDP-7 into a switch statement.
2. A Korz interpreter, which is slow but simple.
3. A resolver that flattens the slots into tables.
4. A just-in-time compiler.

The compiler finds runs of PDP-7 instructions in memory and compiles each run into a JavaScript
function. That's shaped exactly the way the browser's own JIT likes it, so we stack one JIT on top
of another, and V8 takes it down to machine code. The Apple II runs about 150 times real speed
that way. I'd love to know what you think, and to have you on my show to talk about it someday.

Don

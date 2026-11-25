# First Facebook message to Phil: draft

**Status:** draft, for Don to send by hand. Not sent. Plain text for Facebook chat.

---

```
Hi Phil! A late answer to your FIGIL question from September 1986 about Forths for the Apple II: mine. It started as fig-FORTH for the 6502, and I extended it to be Forth-83 compliant. It runs under ProDOS with a Videx 80-column card, and you can run it in the browser here:

https://hyperties.org/cabinet/languages/don-hopkins-prodos-forth/

In 1990 you asked if you could forward my PizzaTool post. Ben Stoltz, who wrote PizzaTool, and his wife just visited me in Amsterdam, and we had an epic canal boat safari. You're welcome to visit too!

I've been building a PDP-7 and Type 340 emulator that runs in the browser, called Cabinet. The 340 is ported from your type340.c and display.c in SIMH; Lars told me you did most of the work on it. It runs PIXIE, Heinz Lemke's 1972 CAD system from Cambridge, which we recovered from the line printer listing. It also runs Mitch Bradley's new PDP-7 Forth with turtle graphics on the 340, and PDP-7 Unix from the pdp7-unix restoration. This demo uses Forth to drive a couple of made-up devices:

https://hyperties.org/cabinet/devices/ultimate-hand/

Mitch and I gave a talk about it at Forth Day last week:

https://www.youtube.com/watch?v=k2pwJ294r8o

and here's a demo I recorded the day before:

https://youtu.be/I-Rf3XP_D0g

Next I'm going to make a PDP-10 emulator: a KA10 that runs ITS like MIT-AI did, with the same 340, and also runs Zork, all in the browser. Here's the plan, and I'd like to hear what you think:

https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PDP10.md

The emulator is built on Korz, David Ungar's successor to Self, with Harold Ossher and Doug Kimelman. Korz has no objects, just slots. The CPU, the backplane and each device are defined as small slots (effective address, skip, rotate and so on), and a device like the 340 plugs in by adding its IOT instructions to the CPU. The same machine runs four ways, all compatible: a direct translation of SIMH's PDP-7 as a switch statement, a Korz interpreter, a resolver that turns the slots into tables, and a just-in-time compiler. The compiler turns runs of PDP-7 instructions into JavaScript functions written the way the browser's JIT optimizes best, so V8 compiles them to machine code. The Apple II runs about 150 times real speed that way.

I'd love to have you on my show to talk about it sometime.

Don
```

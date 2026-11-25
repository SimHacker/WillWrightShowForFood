# Forth and the PDP-7

Forth Day, Silicon Valley FIG, 21 November 2026, 14:10 to 14:40. [Mitch Bradley](../../characters/mitch-bradley/README.md)
has just spent ten minutes on how this Forth got written. This is the half hour after that. The
links go to work in progress: people's pages, the machines, and design notes in this repository
and in [MOOLLM](https://github.com/SimHacker/moollm).

**Video:** <a href="https://www.youtube.com/watch?v=k2pwJ294r8o" target="_blank" rel="noopener">the talk</a>,
with Mitch Bradley, and [its transcript](FORTH-DAY-TALK.md);
<a href="https://youtu.be/I-Rf3XP_D0g" target="_blank" rel="noopener">the demo, recorded before the talk</a>,
and [its transcript](FORTH-DAY-DEMO.md).

- [Introducing CADroid and CForth with Mitch at Sun](#introducing-cadroid-and-cforth-with-mitch-at-sun)
- [Chuck Moore](#chuck-moore)
- [PIXIE's radial menus, and why this PDP-7 exists](#pixies-radial-menus-and-why-this-pdp-7-exists)
- [PIXIE and Titan, a distributed CAD system](#pixie-and-titan-a-distributed-cad-system)
- [The document between the interface and the computation](#the-document-between-the-interface-and-the-computation)
- [The Forth](#the-forth)
- [The demo](#the-demo)
- [The emulator](#the-emulator)
- [The compiler under that](#the-compiler-under-that)
- [What is not built yet](#what-is-not-built-yet)

## Introducing CADroid and CForth with Mitch at Sun

In 1987 I was [Mitch Bradley](../../characters/mitch-bradley/README.md)'s summer intern at Sun.
We integrated his [CForth](https://github.com/MitchBradley/cforth) into CADroid, a schematic
editor from Lucasfilm that Sun used internally, so a higher-level language implemented in Forth
could make the editor scriptable and programmable by demonstration.

## Chuck Moore

[Chuck Moore](../../characters/charles-moore/README.md) is on this Zoom. My friends
[Peter Conn](../../characters/peter-conn/README.md) and [Coco Conn](../../characters/coco-conn/README.md)
had the honor of working with him. They hired him at
[HOMER & Associates](../../characters/coco-conn/homer-forth-flying-logos.md), their studio in
Hollywood. HOMER was their console for mixing pictures live, sixteen slide projectors and four
film projectors, and Chuck programmed its host in PolyForth, in 32K, with
[Paul Rother](../../characters/paul-rother/README.md) beside him. They used it for music
videos, commercials and effects for feature films. <a href="https://www.youtube.com/watch?v=LMVZ36VA0wg" target="_blank" rel="noopener">Atomic Dog</a>
and <a href="https://www.youtube.com/watch?v=9hIOfEiy4lc" target="_blank" rel="noopener">Flying Logos</a>
came out of that shop.

Peter Milford has just talked about Lean in Forth. Lean is in the news this weekend:
[Levent Alpöge](https://alpo.ge/remark.pdf) posted a Lean proof of the Riemann hypothesis,
written with Claude, and [Andrew Sutherland](https://math.mit.edu/~drew/grh/) and others are
still checking it.

## PIXIE's radial menus, and why this PDP-7 exists

PIXIE is [Heinz Lemke](../../characters/heinz-lemke/README.md)'s graphical editor, written at
Cambridge in 1969 with [Neil Wiseman](../../characters/neil-wiseman/README.md) and
[John Hiles](../../characters/john-hiles/README.md). You drive it with a
[light pen](reference/GUIDE-LIGHTPEN.md), and the menu is drawn around the pen's tracking cross.
It is one of the earliest radial menus. I have been building
[pie menus](../../characters/don-hopkins/pie-menus-chi-88-and-beyond.md) since the 1980s
([more in MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/PUMPING-UP-PIE-MENUS.md)).
Heinz [scanned his 1972 listing](../../characters/heinz-lemke/pixie-source-recovery.md), 128 pages
of [SYMELEC](reference/GUIDE-SYMELEC.md), and I wanted to try those menus. I did not have a PDP-7,
so I [wrote one](PIXIE-RESTORATION.md). It runs in the browser, and the light pen works.

## PIXIE and Titan, a distributed CAD system

PIXIE was already a distributed CAD system. The PDP-7 was not a terminal. About 5000 words of it
talked to you and built the model, and the model had to fit in the 3000 words left in 8K. The
model then went over [Neil Wiseman's link](reference/TITAN-LINK-PROTOCOL.md) to Cambridge's
[Titan](reference/GUIDE-TITAN.md) mainframe, which ran the simulation. Drawing was done on the
PDP-7. The simulation ran on Titan. The [hardware](../../characters/heinz-lemke/pixie-hardware.md)
is written up, and so are [David Rosenthal](../../characters/david-rosenthal/README.md)'s
[memories of the Cambridge PDP-7](../../characters/david-rosenthal/pdp7-cambridge-memories.md). The Titan code does not survive. [tiny-titan](TINY-TITAN.md) is a stand-in
for that end of the link.

### The document between the interface and the computation

What crossed Wiseman's link was the model, not a drawing of the screen. That is the split
between a user interface and a computation. They live in different places, and a document
goes between them. In X11, and in NeWS, the application is the client and the window system
is the server ([David Rosenthal](../../characters/david-rosenthal/README.md) on
[that standards war](../../characters/david-rosenthal/04-nfs-news-x11-standards-war.md);
[James Gosling](../../characters/james-gosling/README.md)'s
[window-systems lineage](../../characters/james-gosling/window-systems-lineage.md)). NeWS sends
PostScript into the window server, which draws and answers the pen, and sends back only the events
that matter ([send code, not commands](../../characters/don-hopkins/axis-of-eval-send-code-not-commands.md);
[SimCity on NeWS and HyperLook](../../characters/don-hopkins/hyperlook-news-postscript-simcity.md);
[NeWS in MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/eval/EVAL-INCARNATE-FRAMEWORK.md#7-news-james-gosling-sun-1986)). On the web the word server switches sides.
The browser is the client, the application is the server, and the document is XML, then
JSON, then YAML. PIXIE's document was the rings. The same split is what the Forth device is
for, once Forth is small enough to share that core. What of that is running, and what is
not, is below.

## What this half hour covers

The long essay, [A sea of slots](SEA-OF-SLOTS.md), is about
[Korz](https://github.com/SimHacker/moollm/tree/main/designs/korz), a way of writing the emulator.
Korz is [David Ungar](../../characters/david-ungar/README.md), Harold Ossher and Doug Kimelman's
language ([Onward! 2014](../../characters/david-ungar/sources/korz-2014-onward.pdf)): no objects,
only a sea of slots, each guarded by coordinates, and a message goes to the most specific slot
that matches. The name comes from [Alfred Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski),
who founded general semantics. His *[Science and Sanity](https://en.wikipedia.org/wiki/Science_and_Sanity)*
(1933) is about how much a point of view shapes what one sees, and it has his best-known line:
"[A map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation) it
represents, but, if correct, it has a similar structure to the territory, which accounts for its
usefulness." An emulator is that kind of map of a machine.

This note is the Forth. It says what is running, in the order a Forth programmer can check: the
PDP-7 Forth itself, the emulator it runs in, and the two compilers under that emulator.
What is not built yet is at the end.

### The two compilers

TypeScript is a superset of JavaScript, and it compiles to JavaScript.
The emulator, and Korz, are written in TypeScript. There are two just-in-time compilers. Korz
compiles the emulated machine into JavaScript. V8, inside Chrome and Node, compiles that
JavaScript into the processor's own instructions, because JavaScript is what the browser and
Node actually run. You do not need Lisp, and you do not need the Apple ][, to follow any of this.

## The Forth

Mitch's system is [pdp7forth](https://github.com/MitchBradley/pdp7forth). It is a small Forth in
8K words of 18-bit core, on the [machine](reference/GUIDE-PDP7.md) [UNIX](UNIX-V0.md) was written
on, drawing with a [turtle](LOGO-TURTLE.md) on a DEC [Type 340](reference/GUIDE-340.md). The exchange, the header layout, and the turtle are written up in
[PDP7-FORTH.md](reference/PDP7-FORTH.md).

The PDP-7 is a good Forth machine because a thread cell can be a real instruction, and the opcode
is the word's kind.

### A thread cell is a real instruction

| Cell | What it is | What executing it does |
|---|---|---|
| colon word | a bare address, `CAL` | hardwired `JMS 20`. `nest` at 21 pushes the return and enters the thread |
| primitive | `JMP code` | machine code, ending in `jmp next` |
| constant | `LAC body` | loads the value |
| variable | `LAW body` | loads the address |
| literal | `LAC` of a pool entry | the same push as a constant |

Four things in the hardware do the inner interpreter's work.

### XCT

`XCT` fetches a word and executes it in place. The program counter stays on NEXT. A cell that
jumps never comes back for the push. A cell that only loads the accumulator falls into it.

```
next:  xct i 10       / step IP, execute that cell as an instruction
       dac i 12       / push AC; only a load gets here
       jmp next
```

(source [kernel.s](tapes/pdp7forth/kernel.s#L60))

### Auto-index 10, 11, and 12

Locations 10 through 17 are not registers. They are words in low memory that auto-increment
when you address them indirectly. Forth keeps the interpreter pointer in 10, the return stack
in 11, and the data stack in 12. A push is `dac i 12`: the increment is the addressing mode.
A pop is done by hand, in the other direction.

### CAL

`CAL` is hardwired. Whatever address it carries, it is a `JMS 20`. Location 20 catches the
return address, and `nest` at 21 does the work. It does not use that return. Every `CAL`
would overwrite it. `nest` reads the cell `XCT` just executed, and the address field of that
cell is the body of the colon word. So a colon call is a bare address, and the machine
already knows that a bare address means "call." (source [kernel.s](tapes/pdp7forth/kernel.s#L47))

### Constants, variables, and literals

Constants and variables are not special words in the inner loop. They are PDP-7 instructions
sitting in the thread. `LAC` loads the value. `LAW` loads the address. Either one falls into
the push. A literal works the same way, not as the usual `(LIT)` followed by an inline cell. The
compiler searches a pool at the top of memory, growing down, and equal values share one
entry. The compiled cell is an `LAC` of that entry. Running it is a constant push.
(source [kernel.s](tapes/pdp7forth/kernel.s#L464))

Location 10 is a second program counter. The PDP-7 runs NEXT, and NEXT runs the Forth program
one instruction at a time.

### You compile into the core the display reads

You compile into the same core the display is reading. A loop typed at the prompt runs when the loop closes, without a definition
around it, which is an idea of Mitch's from [Open Firmware](../../characters/mitch-bradley/README.md). A routine from a 1972 assembly listing
becomes a Forth word with a wrapper about three instructions long: pop, `jms`, `jmp next`.

### The Type 340

The Type 340 is the other processor in the box. It fetches its own display list out of the same
core, the way NEXT fetches a thread. The turtle does not draw lines itself. It appends 340
instructions to that list, and it writes the new terminator before it overwrites the old one,
because the display may be running the list while Forth is extending it. Mitch showed that
picture. The cabinet runs the same turtle. (source [turtle.fs](tapes/pdp7forth/turtle.fs#L33),
[type340.ts](src/plugins/type340.ts))

## The demo

This is the part to show. Have [the Forth page](https://hyperties.org/cabinet/forth/) up, and
draw a square:

```
4 0 DO 200 FD 90 RT LOOP
```

### Drag a corner of the square

Those four moves are vector words in the display list. A vector word holds a step of at most
127 in each direction. A longer move is several words. Open the tool menu on the tube and
choose **Edit 340 instructions**. Point at a corner and drag it.

The corner moves, and the rest of the picture stays. The drag writes two words in core: the
vector that arrives at the corner takes the new end, and the vector that leaves absorbs the
difference. A step the 7-bit field cannot hold is refused, and the box on the screen is that
limit. Forth does not hear the drag. The light pen is put away. You are editing the
instructions the turtle assembled, and the 340 is the processor that executes them.

The same edit can be done from the prompt. The tooltip gives the address of the word under
the pointer, and `!` stores a new one. The editor is that store, done with the mouse.

### Names and CREATE DOES>

Two things were added on top of his kernel. Neither one changes NEXT.

The names are kept whole, up to 31 characters, three SIXBIT characters to a word. The layout is
Open Firmware's: name, then header, then body. The execution token is still the header address.
His own kernel, with the three-character headers, stays beside it, and the tests still compare
the two. `CREATE` `DOES>` is fifteen lines of Forth on that copy. A created word is a colon word
with one empty slot, and `DOES>` fills the slot with the code that follows it.

```
: konst  create ,  does> @ ;      42 konst answer
```

The copy is made from his source by a script. [FORTH-RINGS.md](FORTH-RINGS.md) has the name
layout, and [does.fs](tapes/pdp7forth/does.fs) is the fifteen lines. Moving the names out of the
8K bank is not done. That is below, with the macro that would build every layout from one source.

### The 1972 ring library, linked into Forth

The dynamic data is the 1972 library, linked in, not rewritten. PIXIE, Heinz Lemke's editor at
Cambridge, kept its models as rings: circular structures, graphs rather than trees.

### A ring does the job JSON does

A ring does the job JSON does. It is the value that goes from the part you touch to the part
that computes.
JSON is a tree, one thing inside another. A circuit is not. A node sits on several rings at
once, a branch joins two nodes, and the list comes back around to its owner. PostScript can
share references, and YAML can name an anchor, but a ring is already words in the core this
Forth is using. You do not parse it. You walk it. The processor in the listing is RSPPIX. It assembles
into this Forth word for word, moved up by exactly 014000 octal so the listing's address
arithmetic still adds. Each of its routines is a Forth word, most of them three instructions:
pop, `jms`, `jmp next`. The words you type sit on top of those. (source [rsppix.s](tapes/pdp7forth/rsppix.s),
[pixie.s](tapes/pdp7forth/pixie.s), [pixie.fs](tapes/pdp7forth/pixie.fs))

```
RSAVINS S" SQUARE" NAMED
RSAVINS S" TRIANGLE" NAMED
RSAVINS S" HEX" NAMED
RSAVINS .RING            \ HEX TRIANGLE SQUARE  ok
```

SYMELEC walks the same ring area. A panel reads three cells out of live core and draws the
ring in 3D while you append to it. The 1969 structure, the assembly library and the Forth
share one block of core. The same image can be written out as JSON or YAML and read back into Forth,
and the 1972 wire format was the rings themselves. The value you type, the value the panel
draws, and the value you would send across the link are one structure. (source
[scene.ts](../pixie/src/scene.ts#L293), [image.ts](../pixie/src/image.ts#L150)) The demo is
[PIXIE and FORTH on the PDP-7](https://www.youtube.com/watch?v=lo8kdY-5i6c).

### The library is in Forth; PIXIE is not driven by it yet

That ring library is the piece PIXIE calls, and it is in Forth now. PIXIE itself is not being
driven by Forth. SYMELEC already fills the 8K of 18-bit core, and Mitch's Forth wants most of
an 8K machine of its own, so the two do not both fit as programs. CADroid had room for CForth.
This machine does not, yet.

### The Forth device runs, and does not shrink the image yet

The Forth device is his PDP-7 Forth as emulated hardware, and it is running. The menu says
software or hardware, and hardware runs NEXT, on the same image. It does not yet make that
image smaller. The kernel is still in core. Fitting it into the core PIXIE leaves free is
two more steps, and only the first of those has started. `X@`, `X!`, and `XMOVE` can already
reach past 8K, which is what a header stored in the next bank needs (source [xmem.fs](tapes/pdp7forth/xmem.fs)). The headers are not
stored there yet. The assembler has no macros, and that macro is the piece in progress. A
dictionary answered from outside the 8K, so Forth can sit in SYMELEC's own machine and be
the control language, is the step after that. It is not built. The plan is at the end.

## The emulator

The emulator is a [TypeScript program](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet)
that runs in the browser. The machine you talk to is the same one: teletype in, `ok` back, turtle
on the 340. Try it at [hyperties.org/cabinet/forth](https://hyperties.org/cabinet/forth/).

### Four ways to run one image

The core image does not change when the way of running it changes. There are four of those ways,
and each one is checked against the one below it on the same bytes. The bottom is a straight port
of [Bob Supnik](../../characters/bob-supnik/README.md)'s [SIMH PDP-7](SIMH-MAP.md), a switch on the
opcode. Above that, the same instruction set is written
as a table of small behaviors. Above that, the table is compiled into one function per operation.
Above that, a run of instructions is pasted into one JavaScript function. The live pages open on
that last one. A menu reboots the same disk on any of the four. (source
[plugins/pdp7.ts](src/plugins/pdp7.ts), [korz/pdp7.ts](src/korz/pdp7.ts), [compile7.ts](src/korz/compile7.ts))

### Speed

On UNIX boot, that compiled form is about twice as fast as the hand-written switch: 5 nanoseconds
an instruction against 11, on an M4 Max under Node 26. A real PDP-7 did about 0.3 million
instructions a second. The compiled emulator, on that boot, does about 189 million. Every
benchmark for the PDP-7 and the Apple ][, with how each one was run and what changed the numbers,
is in [BENCHMARKS.md](BENCHMARKS.md).

### The Forth accelerator

Forth spends most of its time in NEXT and in a handful of primitives. A device sits on the fetch. When the
CPU fetches `xct i 10`, the device runs the cell itself. A colon word is a call on the return
stack. A constant or a variable is a push. One of about 30 primitives runs on the same stacks, in
the same auto-index registers, in the same core words. `EMIT`, a 340 instruction, or a `CODE` word
you wrote is handed back as a jump, and the PDP-7 runs it. `FIND` is answered from a table of the
names in core, and every hit is checked against the header before it is used.

The image is Mitch's either way. The menu on the Forth page says **Forth: software / hardware**.
Hardware is this device. If NEXT has been patched, if extend mode is on, if a cell is not one it
knows, it declines, and the three instructions run. A program behaves the same with or without
the device. Thirty thousand passes of `I +` take 890,000 cycles in the kernel and 107,000 with the
device. At eight cells a cycle, 29,000. That is the same shape as
[Chuck Moore](../../characters/charles-moore/README.md)'s Novix: one Forth word in the time of one
memory cycle. The writeup is [FORTH-DEVICE.md](FORTH-DEVICE.md). (source
[forth-device.ts](src/korz/forth-device.ts))

## The compiler under that

Two just-in-time compilers, one running on the other.

### Korz compiles the machine into JavaScript

The upper one is Korz, written in TypeScript, the same language as the emulators. The PDP-7 side
is [KORZ-COMPILER.md](KORZ-COMPILER.md), the 6502 side is [KORZ-CPU.md](KORZ-CPU.md), and
[David Ungar](../../characters/david-ungar/README.md)'s Korz, the idea it is named for, is
[in MOOLLM](https://github.com/SimHacker/moollm/tree/main/designs/korz). It compiles
a PDP-7, or a 6502, into JavaScript. A straight run of instructions becomes one function. The
same compiler takes the device definitions: the hardware, and a coprocessor, are slots that
can carry their behavior as a JavaScript template. When they do, that template is pasted into
the function too. A coprocessor is not a special case. It is another device. Where a PDP-7 run
fetches `xct i 10`, Korz also compiles the one Forth word that cell names, and it checks the
word before running it. An `XCT` of an `XCT` falls back. The Forth accelerator is the other
way the guest is mixed in: on the fetch of NEXT it runs one cell itself, on Mitch's stacks.
Forth is not the language Korz is written in. Forth is in the machine being compiled. (source
[compile7.ts](src/korz/compile7.ts), [compile65.ts](src/korz/compile65.ts))

### V8 compiles that JavaScript

The lower one is V8. It does not translate a whole program and then run it. It runs
JavaScript, notices which functions are hot, and compiles those to the processor. It
remembers what kinds of values a function has been seeing. When a value of a different kind
shows up, it throws the compiled code away and continues, with the stack still making sense.
That guess, and the retreat from a wrong guess, came from the Self language
([David Ungar](../../characters/david-ungar/README.md),
[reflecting on Self](../../characters/david-ungar/reflecting-on-self.md),
[Self in MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/SELF-ISH-INFLUENCES.md)).
[The essay](SEA-OF-SLOTS.md#from-self-to-v8) is the history. V8 never sees a thread cell or a
device. It sees the JavaScript function Korz emitted.

### Korz emits the kind of function V8 keeps

The design comes from [Vanessa Freudenberg](../../characters/vanessa-freudenberg/README.md).
She wrote [SqueakJS](https://squeak.js.org/), a Smalltalk virtual machine in JavaScript that
runs decades-old Squeak images in any browser. Squeak objects are plain JavaScript objects, and
her garbage collector leaves as much work as it can to JavaScript's. Her
[paper](../../characters/vanessa-freudenberg/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf)
(DLS 2014, with Dan Ingalls, Tim Felgentreff, Tobias Pape and Robert Hirschfeld) won the Most
Notable Paper award ten years later. On WebAssembly she wrote that she would rather make the
SqueakJS JIT produce code the JavaScript JIT can optimize well, because that could be faster
than WASM. Korz is built on the same approach: emit code that the host's JIT optimizes well
([her philosophy, in MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/vanessa-freudenberg-philosophy.md);
[the essay](SEA-OF-SLOTS.md#vanessas-bet)). Vanessa died in 2025.

A compiler on a compiler works here because the upper one emits code the lower one optimizes well.
Korz emits one stable function for a run of the machine, the kind V8 compiles once and keeps.
A fresh function every cycle, or a call whose target V8 cannot see, stays interpreted. A store
into a word the function was compiled from throws the function away, because PDP-7 code
rewrites itself. `JMS` stores its return address in the first word of the routine. What each of
those choices was worth, in nanoseconds, is in [BENCHMARKS.md](BENCHMARKS.md#how-it-got-there).

The essay's name for the table of device behaviors is a sea of slots. You can read that
later. Nothing in the half hour depends on the name.

## What is not built yet

### A whole colon definition, as one function

The upper compiler stops at one word. A colon definition is still a series of calls back to the
dispatch loop, one cell at a time, whether the accelerator or the `XCT` path is doing it. The step
not taken is to follow the thread and paste a whole definition into one JavaScript function,
stopping at a branch or a return. Ian Piumarta and Fabio Riccardi called that selective inlining
(PLDI 1998). Anton Ertl and David Gregg's dynamic superinstructions are the same idea. The machine
being compiled would be this Forth: four cell kinds, a few primitives, and a decline back to CODE
when the cell is anything else. The code that comes out would still be JavaScript, because that is
what V8 compiles. That is Forth as a target of the upper compiler. It is a direction, and it is
not in the image today.

Three smaller things are in the same state.

### Headers in high memory

The fetches past 8K are real: `X@`, `X!`, and `XMOVE`. Hand poses and tables already go there.
The names do not. The plan is one kernel source and one header macro, with an assignment at the
top that picks the layout. The same words recompile as Mitch's three-character headers, as the
full names running today, as names kept in the next bank with a pointer in the header, or as
headerless code. Nothing that runs a word reads a name, so NEXT stays put. The macro assembler
is the missing piece. The cabinet's assembler has no macros yet.
[FORTH-HIGH-MEMORY.md](FORTH-HIGH-MEMORY.md) is the expansion.

### Other threading models, to measure

The same switch can build other threading models, so they can be measured against this one.
`XCT` threading is already the right fit for the PDP-7. The experiment is there to compare, not
because a better inner interpreter is expected.

### A dictionary outside the 8K, so Forth can sit with PIXIE

The accelerator still jumps to primitives that live in core. A dictionary answered from outside
the 8K bank, so that Forth could sit in SYMELEC's own machine and call its rings, is the reason
the device exists. SYMELEC already fills the machine. That ROM dictionary is not built.

### tiny-ITS, in Forth

The larger goal is a Forth that does for this room what Open Firmware did for a workstation.
Mitch already worked those ideas out: a command line whose words are the commands, completion,
help, a device tree, keys bound to words, an editor with Emacs bindings. tiny-ITS is those
ideas again, in this Forth, pointed at every emulator. One command line for the machines,
their memory maps, and their devices. Completion, help, and the arguments of a command written
down where the command is. A device tree you can walk. An editor in the Emacs style. People
type at it, and so can a program on the PDP-7. The design is
[TINY-ITS.md](TINY-ITS.md). It is not the image you can boot today.

### The Apple ][, once the emulator is settled

The PDP-7 system is the one this hour is about. The Apple is the same kind of job, later.

### fig-FORTH, and Bill Ragsdale

In 1985 I wrote a fig-FORTH for the Apple ][ under ProDOS, and an H19 terminal on top of it.
fig-FORTH is the 6502 model the Forth Interest Group published. Bill Ragsdale led that model
and wrote its installation manual, and my kernel starts there. The ProDOS layer, the terminal,
and the assembler are mine. A tip of the hat to him. The
disk still boots. The banner says 1985. What I lost is the source that built the kernel: the 6502
macro assembly, and the Forth around it. Some blocks of Forth are still on the disk. The build is
not.

When the [Apple ][ emulator](APPLE2.md) is far enough along, I want the same kind of stack the PDP-7 already
has, running entirely in the browser. A 6502 macro assembler and a disassembler, in TypeScript.
Beside them, a reader and a writer for Apple ][ threaded Forth and for 6502 assembly, so a screen
of code and a block of memory are the same object from either side.

### From the image back to source

Then the recovery. Read the surviving image back into two texts: the kernel as 6502 macro
assembly, and the rest as Forth. Mitch's metacompiler runs the other way. He wrote the kernel,
assembled it, and let the running Forth compile the high-level words into the image. Mine has to
start from the image, produce source that builds that image again, and only then be free to
change. The new source is the thing I can edit. The metacompiler targets the Apple ][ first, then
other 6502 machines, and after that other processors, keeping the same Forth with a new code
field for each.

That stack does not exist yet. The disk, the [Videx card](VIDEX.md) it prints on, and the note of what is on
the disk are the part that does:
[Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md).

## If you want the rest

Open [the Forth page](https://hyperties.org/cabinet/forth/?forth=hardware), switch **software /
hardware**, and run something you can see on the 340.

In the essay, the Forth parts are [A Forth accelerator](SEA-OF-SLOTS.md#a-forth-accelerator) and
the first half of
[Virtual machines on top of virtual machines](SEA-OF-SLOTS.md#virtual-machines-on-top-of-virtual-machines).
The Type 340 and the ring picture are under
[Displays as views of memory](SEA-OF-SLOTS.md#displays-as-views-of-memory). The rest of that essay
is Korz, and it can wait.

The same Korz compiler runs an Apple ][+, fast enough that the little man in Activision's
[Little Computer People](https://hyperties.org/cabinet/games/little-computer-people/) moves in
while you watch. A screen angel reads the Apple's pixels, turns the disk over, and asks for your
name and the date in a field: [Upcycling Little Computer People](UPCYCLING-LCP.md).

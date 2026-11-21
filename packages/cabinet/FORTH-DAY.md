# Forth and the PDP-7

Forth Day, Silicon Valley FIG, 21 November 2026, 14:10 to 14:40. Mitch Bradley has just spent ten
minutes on how this Forth got written. This is the half hour after that.

It is an honor to meet Chuck Moore and to speak with him on this Zoom. Peter Conn and Coco Conn hired
him at HOMER & Associates. Their console mixed pictures live, sixteen slide projectors and four
film projectors, and he programmed its host in PolyForth, in 32K. Atomic Dog and Flying Logos
came out of that shop. I think that is one of the most amazing things anyone has done with Forth.

Peter Milford has just talked about Lean in Forth. Yesterday
[Levent Alpöge](https://alpo.ge/remark.pdf) posted a proof of the Riemann hypothesis written in
Lean with Claude, about 175,000 modules, depending only on Lean's three ordinary axioms.
[Andrew Sutherland](https://math.mit.edu/~drew/grh/) and others have been replaying it through
Lean's own kernel and through independent ones, and it has been accepting. The last check, that
the Lean statement is really the Riemann hypothesis and not a quietly redefined one, was still
running when this was written. That is why Lean is in the news this weekend. Peter's idea is to
have that language on a Forth machine.

The long essay, [A sea of slots](SEA-OF-SLOTS.md), is about Korz, a way of writing the emulator.
This note is the Forth. It says what is running, in the order a Forth programmer can check: the
PDP-7 Forth itself, the emulator it runs in, and the browser compiler underneath that emulator.
What is not built yet is at the end.

A few host words, once. **TypeScript** is the language the emulator is written in. **JavaScript**
is what the browser actually runs; the compiler in the emulator emits it. **V8** is the compiler
inside Chrome and Node. It turns hot JavaScript into the processor's own instructions while the
program is running. You do not need Lisp, and you do not need the Apple ][, to follow any of this.

## The Forth

Mitch's system is [pdp7forth](https://github.com/MitchBradley/pdp7forth). It is a small Forth in
8K words of 18-bit core, on the machine UNIX was written on, drawing with a turtle on a DEC Type
340. The exchange, the header layout, and the turtle are written up in
[PDP7-FORTH.md](reference/PDP7-FORTH.md).

The PDP-7 is a good Forth machine because a thread cell can be a real instruction, and the opcode
is the word's kind.

| Cell | What it is | What executing it does |
|---|---|---|
| colon word | a bare address, `CAL` | `CAL` is always `JMS 20`. `nest` at 21 pushes the interpreter pointer and enters the thread |
| primitive | `JMP code` | machine code, ending in `jmp next` |
| constant | `LAC body` | loads the value |
| variable | `LAW body` | loads the address |

NEXT is three instructions. Register 10 is the interpreter pointer, register 12 is the data stack,
and both are auto-index registers, so a push or a step is the addressing mode and not a separate
add.

```
next:  xct i 10       / step IP, execute that cell as an instruction
       dac i 12       / push AC; only a constant or a variable gets here
       jmp next
```

`XCT` fetches a word and executes it in place. The program counter stays on NEXT. A cell that
jumps, a colon word or a primitive, never comes back for the push. A cell that only loads the
accumulator falls into `dac i 12`. Constants and variables have no code of their own. Location 10
is a second program counter: the PDP-7 runs NEXT, and NEXT runs the Forth program one instruction
at a time.

That is also why Forth is a good way to poke at this machine. You compile into the same core the
display is reading. A loop typed at the prompt runs when the loop closes, without a definition
around it, which is an idea of Mitch's from Open Firmware. A routine from a 1972 assembly listing
becomes a Forth word with a wrapper about three instructions long: pop, `jms`, `jmp next`.

The Type 340 is the other processor in the box. It fetches its own display list out of the same
core, the way NEXT fetches a thread. The turtle does not draw lines itself. It appends 340
instructions to that list, and it writes the new terminator before it overwrites the old one,
because the display may be running the list while Forth is extending it. Mitch showed that
picture. The cabinet runs the same turtle.

## The demo

This is the part to show. Have [the Forth page](https://hyperties.org/cabinet/forth/) up, and
draw a square:

```
4 0 DO 200 FD 90 RT LOOP
```

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

### Names

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

### The PIXIE ring library, in Forth

The dynamic data is the 1972 library, linked in, not rewritten. PIXIE, Heinz Lemke's editor at
Cambridge, kept its models as rings: circular structures, graphs rather than trees, the same
role as an s-expression or a JSON value. The processor in the listing is RSPPIX. It assembles
into this Forth word for word, moved up by exactly 014000 octal so the listing's address
arithmetic still adds. Each of its routines is a Forth word, most of them three instructions:
pop, `jms`, `jmp next`. The words you type sit on top of those.

```
RSAVINS S" SQUARE" NAMED
RSAVINS S" TRIANGLE" NAMED
RSAVINS S" HEX" NAMED
RSAVINS .RING            \ HEX TRIANGLE SQUARE  ok
```

SYMELEC walks the same ring area. A panel reads three cells out of live core and draws the
ring in 3D while you append to it. One 1969 structure, the assembly library and the Forth,
one block of core. The demo is
[PIXIE and FORTH on the PDP-7](https://www.youtube.com/watch?v=lo8kdY-5i6c).

## The emulator

The emulator is a [TypeScript program](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet)
that runs in the browser. The machine you talk to is the same one: teletype in, `ok` back, turtle
on the 340. Try it at [hyperties.org/cabinet/forth](https://hyperties.org/cabinet/forth/).

The core image does not change when the way of running it changes. There are four of those ways,
and each one is checked against the one below it on the same bytes. The bottom is a straight port
of Bob Supnik's SIMH PDP-7, a switch on the opcode. Above that, the same instruction set is written
as a table of small behaviors. Above that, the table is compiled into one function per operation.
Above that, a run of instructions is pasted into one JavaScript function. The live pages open on
that last one. A menu reboots the same disk on any of the four.

On UNIX boot, that compiled form is about twice as fast as the hand-written switch: 5 nanoseconds
an instruction against 11, on an M4 Max under Node 26. A real PDP-7 did about 0.3 million
instructions a second. The compiled emulator, on that boot, does about 189 million. The table and
the sessions are in [the essay](SEA-OF-SLOTS.md#the-numbers).

### The accelerator, already plugged in

Forth spends its life in NEXT and in a handful of primitives. A device sits on the fetch. When the
CPU fetches `xct i 10`, the device runs the cell itself. A colon word is a call on the return
stack. A constant or a variable is a push. One of about 30 primitives runs on the same stacks, in
the same auto-index registers, in the same core words. `EMIT`, a 340 instruction, or a `CODE` word
you wrote is handed back as a jump, and the PDP-7 runs it. `FIND` is answered from a table of the
names in core, and every hit is checked against the header before it is believed.

The image is Mitch's either way. The menu on the Forth page says **Forth: software / hardware**.
Hardware is this device. If NEXT has been patched, if extend mode is on, if a cell is not one it
knows, it declines, and the three instructions run. A program never has to know the device is
there. Thirty thousand passes of `I +` take 890,000 cycles in the kernel and 107,000 with the
device. At eight cells a cycle, 29,000. That is the same shape as Chuck Moore's Novix: one Forth
word in the time of one memory cycle. The writeup is [FORTH-DEVICE.md](FORTH-DEVICE.md).

## The compiler under that

V8 is a just-in-time compiler. It does not translate the whole program and then run it. It runs
JavaScript, notices which functions are hot, and compiles those to the processor's own
instructions. It remembers what kinds of values a function has been seeing, and it compiles for
those. When a value of a different kind shows up, it throws the compiled code away and continues
in the interpreter, with the stack still making sense. That guess, and the orderly retreat from a
wrong guess, came from the Self language. [The essay](SEA-OF-SLOTS.md#from-self-to-v8) is the
history. The part that matters here is the consequence: a stable function, called the same way,
gets compiled once and then runs at the speed of the machine. A fresh function every cycle, or a
call whose target V8 cannot see, stays interpreted.

There are two compilers, and Forth is mixed into the upper one.

The upper one is Korz, written in TypeScript, the same language as the PDP-7 emulator. It pastes a
straight run of PDP-7 instructions into one JavaScript function. Where that run fetches
`xct i 10`, it also compiles the one Forth word that cell names, and it checks the word before
running it. An `XCT` of an `XCT` falls back to the interpreter. The accelerator is the other way
Forth is mixed in: on the fetch of NEXT it executes one cell itself, in TypeScript, on Mitch's
stacks. Both of those are running.

The lower compiler is V8. It never sees a thread cell. It sees the JavaScript function the upper
compiler emitted, and it compiles that to the processor. The upper compiler's job is to hand V8 a
function V8 can keep. A store into a word the function was compiled from throws the function away,
because PDP-7 code rewrites itself. `JMS` stores its return address in the first word of the
routine.

Korz is not written in Forth. Forth is the guest. The accelerator is a device beside the guest,
answering one fetch. The essay's name for the table of behaviors is a sea of slots. You can read
that later. Nothing in the half hour depends on the name.

## What is not built yet

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

The fetches past 8K are real: `X@`, `X!`, and `XMOVE`. Hand poses and tables already go there.
The names do not. The plan is one kernel source and one header macro, with an assignment at the
top that picks the layout. The same words recompile as Mitch's three-character headers, as the
full names running today, as names kept in the next bank with a pointer in the header, or as
headerless code. Nothing that runs a word reads a name, so NEXT stays put. The macro assembler
is the missing piece. The cabinet's assembler has no macros yet.
[FORTH-HIGH-MEMORY.md](FORTH-HIGH-MEMORY.md) is the expansion.

The same switch can build other threading models, so they can be measured against this one.
`XCT` threading is already the right fit for the PDP-7. The experiment is there to compare, not
because a better inner interpreter is expected.

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

In 1985 I wrote a fig-FORTH for the Apple ][ under ProDOS, and an H19 terminal on top of it.
fig-FORTH is the 6502 model the Forth Interest Group published. Bill Ragsdale led that model
and wrote its installation manual, and my kernel starts there. The ProDOS layer, the terminal,
and the assembler are mine. A tip of the hat to him. The
disk still boots. The banner says 1985. What I lost is the source that built the kernel: the 6502
macro assembly, and the Forth around it. Some blocks of Forth are still on the disk. The build is
not.

When the Apple ][ emulator is far enough along, I want the same kind of stack the PDP-7 already
has, running entirely in the browser. A 6502 macro assembler and a disassembler, in TypeScript.
Beside them, a reader and a writer for Apple ][ threaded Forth and for 6502 assembly, so a screen
of code and a block of memory are the same object from either side.

Then the recovery. Read the surviving image back into two texts: the kernel as 6502 macro
assembly, and the rest as Forth. Mitch's metacompiler runs the other way. He wrote the kernel,
assembled it, and let the running Forth compile the high-level words into the image. Mine has to
start from the image, produce source that builds that image again, and only then be free to
change. The new source is the thing I can edit. The metacompiler targets the Apple ][ first, then
other 6502 machines, and after that other processors. Same guest, a new code field.

That stack does not exist yet. The disk, the Videx card it prints on, and the note of what is on
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

# A sea of slots: emulating a PDP-7 with Korz, on the JIT that Self built

Don Hopkins, November 2026

I have a PDP-7 running in a web page. It boots Ken Thompson's 1969 UNIX from the original binaries
to the `@` prompt, runs Mitch Bradley's Forth, and draws on a DEC Type 340 vector display with a
light pen. It also has a Turing machine coprocessor plugged into its I/O bus, a DataHand that
reads your hand through a webcam, and Marvin Minsky's Ultimate Machine, the box whose only
function is to switch itself off. Claude Shannon built the real one. Ours is device 56.

All of that grew out of one program and its menus. In 1969 at the Cambridge University
Mathematical Laboratory, Heinz Lemke, with Neil Wiseman and John Hiles, published PIXIE, a
light-pen editor for graph models such as electronic circuits and control systems. It ran on a
PDP-7 with a Type 340, linked to Cambridge's Titan mainframe. Its menu pops up around the light
pen's tracking cross, which makes it one of the earliest known radial menus. I've been building
pie menus since the 1980s, so when Heinz scanned his 1972 printout of SYMELEC, PIXIE's main
program, 128 lineprinter pages of it, I wanted to see and feel those menus running again. There was no
PDP-7 to run it on, so I built one. SYMELEC now reassembles word for word from the transcribed
listing and runs in the browser with its light pen and its radial menus. Heinz plans to use PIXIE
again, for Bayesian network models of health care. PIXIE is on the program of an HCI session at
CARS 2027 in Berlin on 29 June 2027, the 60th anniversary of his first Cambridge lecture.

My first implementation was a straight port to TypeScript of SIMH's PDP-7 simulator, by Bob
Supnik, and SIMH's Type 340 display, by Phil Budne, with Lars Brinkhoff's PDP-7 display interface
and the 340 character shapes he recovered from MIT AI Lab film footage and the Knight TV font. Once that worked, I used it as the oracle for
three tiers of a Korz rearchitecture: an interpreter, a resolver and a compiler, each checked
instruction by instruction against the tier below. Korz is a language almost nobody has heard of,
and it runs here on a JavaScript JIT that exists because of a language almost nobody uses any
more. This article is about those two languages, Self and Korz, and why they turn out to be exactly
the right tools for building emulators you can take apart while they run.

## Self, and the JIT in your browser

In 1986 at Xerox PARC, David Ungar and Randall Smith designed Self by taking Smalltalk and removing
things. Smalltalk said everything is an object, but an object got its behavior from its class, a
separate thing above it. Self threw out classes. An object is a set of slots, and it inherits by
pointing at another object, its parent. Want a teletype that reads aloud? Copy a teletype and
give the copy a new `print` slot. Even reading a variable is a message send, so there is no
difference between a stored value and a computed one. "Self: The Power of Simplicity" (OOPSLA 1987) is still one of the best-titled papers
in computing.

A language that dynamic looked like it had to be slow. Ungar's group at Stanford and Sun,
including Craig Chambers, Urs Hölzle and Elgin Lee, made it fast, and the techniques they
invented are the ones running in your browser right now:

- **Maps.** Objects cloned from the same prototype share a hidden description of their layout, so
  a slot lookup becomes a fixed offset.
- **Customization.** Compile a separate copy of a method for each kind of receiver, so the
  compiler knows exactly what `self` is.
- **Polymorphic inline caches** (Hölzle, Chambers and Ungar, ECOOP 1991). Each call site remembers
  the few receiver maps it has seen and jumps straight to their methods. The cache doubles as a
  profile of what the program actually does.
- **Dynamic deoptimization** (PLDI 1992). Optimize aggressively on assumptions, and when an
  assumption breaks, or a debugger looks, fall back to unoptimized code mid-execution, with every
  frame intact.

Then some of the Self people started Animorphic Systems and built Strongtalk, a fast Smalltalk on
that technology. Sun bought Animorphic in 1997, and the Strongtalk VM became the basis of Java's
HotSpot. Lars Bak, who had worked on Self and Strongtalk and led HotSpot, went to Google and led
the team in Aarhus that built V8 for Chrome in 2008. V8's "hidden classes" are Self's maps. Inside
V8 they are still called maps. Its inline caches, its speculative optimization, its deoptimization
when a guess goes wrong: Self, all of it.

And V8 is only the best known. HotSpot is still the JVM in OpenJDK. Safari's JavaScriptCore calls
its hidden classes Structures, and Firefox's SpiderMonkey calls them Shapes. Both use inline
caches, and both bail out of optimized code when a speculation fails. Dart's VM came from Lars Bak
and Kasper Lund, after V8. GraalVM's Truffle makes deoptimization the center of its design. PyPy
gives Python objects maps, Ruby 3.2 gave its objects shapes, CPython 3.11 added inline caches to
its interpreter, and Eliot Miranda's Cog VM for Squeak and Pharo uses polymorphic inline caches.
Microsoft's CLR now switches running methods from quick code to optimized code by on-stack
replacement, and the .NET runtime's
[design doc](https://github.com/dotnet/runtime/blob/main/docs/design/features/OnStackReplacement.md)
says OSR "was pioneered in Self", citing the 1992 deoptimization paper. Mike Pall announced
"adaptive deoptimization support" in LuaJIT 1.1.0 in 2006, using Self as his example of code that
needs aggressive inlining. For LuaJIT 2's trace compiler he credited Gal and Franz and HP's Dynamo,
and
[noted](http://lua-users.org/lists/lua-l/2008-02/msg00051.html) that "the technique originated in
system emulators doing on-the-fly binary-to-binary translation." Emulators, again.

Brendan Eich says Self inspired JavaScript's prototypes, and every time someone repeats it, I
cringe. JavaScript missed the whole point of Self, which is right there in the title of the paper:
the power of simplicity. Self has nothing but objects with slots, all the way down. A Self object
can inherit from any number of parents, with well-defined priorities, and it can change its parents
at run time, which Self programmers do as an everyday technique and the VM handles efficiently.
JavaScript gave each object one prototype, made changing it something
[MDN warns you against](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
because it's slow, and bolted on functions that double as constructors and misbehave if you call
them without `new`. In Self, `self` is just the receiver. In JavaScript, `this` depends on how a
function was called, so pass a method as a callback and it forgets its own object. Twenty years
later ES2015 had to add arrow functions, a second kind of closure, just to get a `this` that isn't
aimed at your foot. That's stolen valor: Self's name on the box, and none of its simplicity inside.
Eich's misunderstanding of the meaning of equality shows up in JavaScript's
[`==` table](https://dorey.github.io/JavaScript-Equality-Table/), and in his
[donation against marriage equality](https://www.theguardian.com/commentisfree/2014/apr/07/brendan-eich-has-the-right-to-fight-gay-rights-but-not-to-be-mozillas-ceo).
And yet Self's JIT technology was so good that it made JavaScript fast anyway, and made up for a
lot of lackluster design decisions.

Few people program in Self today. Every Chrome tab and every Node process runs its ideas.

## Vanessa's bet

Vanessa Freudenberg wrote SqueakJS, a Smalltalk virtual machine in JavaScript that runs real
Squeak images, decades old, in any browser. Her paper (DLS 2014, with Dan Ingalls, Tim Felgentreff,
Tobias Pape and Robert Hirschfeld) won the Most Notable Paper award ten years later. Squeak objects
are plain JavaScript objects, and her hybrid garbage collector hands as much work as possible to
the JavaScript collector, keeping for itself only what JavaScript can't give her.

Talking about WebAssembly on Hacker News in December 2023, she wrote:

> I'd much rather make the SqueakJS JIT produce code that the JavaScript JIT can optimize well.
> That would potentially give us more speed than even WASM.

That is the bet this whole emulator is built on. Don't fight the host. Generate JavaScript that V8
recognizes, with stable shapes and call sites that always call the same function, and V8 does what
Self taught it to do: inline everything, speculate, and deoptimize safely when you change your
mind. Vanessa died in 2025. Every fast path in this emulator is built on her bet.

## Korz: Self without the objects

In 2014, Ungar, with Harold Ossher and Doug Kimelman at IBM Research, took the next subtraction.
Self removed classes. Korz ("Korz: Simple, Symmetric, Subjective, Context-Oriented Programming",
Onward! 2014) removes objects. The behavior stays. What goes is the rule that every piece of
behavior belongs to exactly one object. In Korz, a program is a flat "sea" of slots that belong to
nothing. Every message send happens in a context: a set of coordinates along named dimensions, like
`rcvr: myStack` or `assertions: true` or `user: don`. Each slot has a guard that says which
coordinates it cares about. A send matches the whole context against every guard at once, and the
most specific matching slot runs. If two match equally, that's an error. No argument is privileged
as "the receiver". The receiver is just one more dimension.

The paper's example shows why that matters. Define `pop()` once, guarded on `rcvr` being a stack. Later,
add a second `pop()` that checks its assertions, guarded on `rcvr` being a stack and `assertions`
being true. It is more specific, so it wins whenever the context says `assertions: true`. Now
`main()` sets `assertions: true`, and the context carries it implicitly down every call, the way
`this` flows in an object-oriented language. No code in between mentions assertions at all. You
added a new axis of variation to a running design without touching the middle.

Aspect-oriented programming fights the same war with knives. It names the problem "crosscutting
concerns", code scattered across modules and tangled together, then cuts in with pointcuts and
weaves advice back through the program. Ossher had been there before Korz. With Peri Tarr, William
Harrison and Stanley Sutton he wrote
["N Degrees of Separation"](https://dl.acm.org/doi/10.1145/302405.302457) (ICSE 1999), which
sliced programs into overlapping "hyperslices" along many dimensions and composed them back
together. Korz gives you the slices without the knives. A concern is just a dimension, and its slots
sit in the sea next to everything else. Nothing gets cut and nothing gets woven.

And objects come back, as a point of view. Gather the slots by `rcvr` and you see objects. Gather
them by `assertions` and you see the checking layer. Gather them by `user` and you see one person's
view of the system. Same sea, different cuts. That's the "subjective" in the title, and the name
comes from Alfred Korzybski: the map is not the territory.

The Korz prototype was written in Self, on the Self VM. Korz appeared in three papers and a talk in
2014 and 2015. I think it's one of the most mind-expanding ideas in
programming languages, and it fits problems I've been working on my whole career.

## Things that were Korz all along

**Adventure games.** Zork's parser binds five globals every turn: the verb (`PRSA`), the direct
object (`PRSO`), the indirect object (`PRSI`), the character acting (`WINNER`) and the room
(`HERE`). Then, roughly, the room gets first crack, then the objects, then the verb's default. That is
symmetric, most-specific-first dispatch over a five-dimensional implicit context, shipped on the
Z-machine in 1979! Say "ROBOT, PUSH BUTTON" in Zork II, and `WINNER` becomes the robot: same verb,
same object, different dispatch. The Sims, which I worked on at Maxis, did the same with two
dimensions: `me` and `stackObject`.

David Ungar assures me that Korz is only accidentally an anagram of Zork. I believe him, but
Korzybski would have loved it. Every Zork player drew a map on graph paper of a territory they could
only reach through words, and an anagram is a map of a word: same letters, different territory.

**Cellular automata.** A cell's rule dispatches on its neighborhood. Every neighbor is a dimension:
five for von Neumann, nine for Moore. Toffoli and Margolus's CAM-6 compiled rules written as Forth
words into a lookup table, by running the rule for every possible neighborhood and storing the
answers. The Margolus neighborhood has no center cell at all: a 2×2 block where all four cells
update together and none of them is "the receiver". Object-oriented programming is "this". A
cellular automaton is "us". (My CAM6.js does the same compile in the browser.)

**Emulators.** This is the one I'm building. An emulator is a dispatcher whose
coordinates are small, finite and completely known: which address, read or write or instruction
fetch, who is on the bus, which opcode bits, which device code, which I/O pulse, which memory
configuration. Emulators encode that dispatch by hand, in switch statements and
page tables. If you want to watch one address, you go find the right place in the code and patch
it. If you want a breakpoint, the emulator needed to have been built with breakpoints.

In Korz, every one of those things is a slot. The core memory is a slot on `read` and `write`.
Each opcode is a slot on `exec`, guarded on the opcode bits. Each device gate is a slot on the I/O
bus, guarded on device code and pulse. A watchpoint is a slot on `read` guarded on one address. A
breakpoint is a slot on instruction fetch. A device you invented last week is a set of slots on
device codes nobody at DEC ever used.

## The PDP-7 as a sea

So I built it. A PDP-7 is a good first machine, because it's small: 18-bit words, 16 instructions,
up to 32K of core, I/O by IOT instructions that pulse a device code. UNIX's cabinet is 99 slots,
on the selectors `read`, `write`, `ea` (effective address), `exec`, `skip`, `cc` and `rot` (the
operate group's fields), `iot` and `iop` (the I/O bus). Every device the cabinet has is on that bus:
clock, teletype, paper tape, RB09 disk, the Type 340, the Turing engine, the Ultimate Machine, the
Tiny Titan link between machines, a file service onto browser storage, and the hand tracker.

Because an emulator's coordinates are finite, two things that general Korz can't do become
possible.

**Ambiguity is decided when you install, not when you crash.** Guards are sets, so the sea can
compute at install time whether two slots overlap with neither more specific. Installs are
transactional, so a plug-in card can bring the slot that resolves its own overlap, and the sea never
passes through a broken state.

**The sea can be resolved ahead of time** into exactly the arrays a hand-written emulator would use.
For each selector, the resolver builds a table over only the dimensions some slot actually
constrains. `exec` becomes a 32-entry table. `read` becomes a one-entry table, because nothing
guards an address, until you install a watch on one address. Then `read` becomes a 32,768-entry
table, and when you remove the watch it shrinks back to one.

This is the CAM-6 move pointed at a bus: run the rules for every input and keep the answers.

Then there's `why`. Ask it about any access and it names the chain of slots that answered and who
installed each one. A powered-off device is a patch slot on its device codes, so `why` on an IOT to
a dead device names the power switch.

## Four levels, each checking the one below

I kept every level of the implementation, and each one is tested against the one below it,
instruction by instruction, comparing registers every step:

1. **`Pdp7`**, plain switch statements, the TypeScript port of SIMH's PDP-7, with Phil Budne's
   and Lars Brinkhoff's Type 340 code ported nearly line by line. This is the reference.
2. **The Korz interpreter.** For every dispatch, it filters the selector's slots, sorts the matches
   by specificity, and calls the chain. Slow, obvious and correct. It boots UNIX at about four
   times the speed of a real PDP-7.
3. **The resolver.** The tables above, with one generated JavaScript function per selector.
4. **The compiler**, which turns runs of PDP-7 instructions into JavaScript functions.

The tests run 300 random core images, UNIX booting to its prompt, and every device rig: SYMELEC
on the 340, the Turing engine, light-pen drawings sent over the Titan link, DataHand frames by
interrupt. Then I break things on purpose to check the tests notice. I planted 24 errors in the
compiler's generated code, and the tests caught 23 of them. The 24th turned out to change nothing.

My favorite bug came from the Ultimate Machine. The cabinet decided when a device would next need
attention by looking at its power state before its tick. But the Ultimate Machine switches itself
off during its tick. We needed a device that switches itself off to find that bug, and we had one!
Thank you, Minsky and Shannon.

## The compiler, and why Self is in the room

Slots can carry a template: their behavior as a snippet of JavaScript source. The sea carries it
and never looks at it. The compiler asks the sea for the chain of slots at each instruction's
coordinates, once, when it builds a block. If every slot in the chain has a template, it pastes
them together into straight-line code. If any slot doesn't (your watchpoint, your patch, a device
someone wrote in a hurry), the compiled code calls the dispatcher right there, and that slot runs
exactly as it would in the interpreter.

PDP-7 programs write into their own code constantly. JMS stores its return address in the first
word of the subroutine, and real programs of the period rewrite their own instructions. So each
compiled block remembers exactly which words of core it was compiled from, and a store into one of
them throws the block away. That's Self's dependency-driven recompilation, at the grain of 18-bit
words.

The numbers, in nanoseconds per emulated instruction, including all the devices, on an M4 Max
with Node 26:

| Workload | Live demo | `Pdp7` switch | Korz compiled | Korz resolver | Korz interpreter |
|---|---|---|---|---|---|
| UNIX v0 boot, 3M instructions | [cabinet/unix](https://hyperties.org/cabinet/unix/) | 11 | 5 | 30 | 777 |
| Forth with 340, DataHand, Ultimate Machine, 10M | [cabinet/ultimate-hand](https://hyperties.org/cabinet/ultimate-hand/) | 21 | 13 | 44 | 763 |
| Turing engine running free, 5M | [cabinet/turing](https://hyperties.org/cabinet/turing/) | 67 | 71 | 118 | 1,211 |

In steps per second that's 92 million for `Pdp7` on UNIX, 189 million compiled, 34 million
resolved and 1.3 million interpreted. The live demos run `Pdp7` today. Next, each demo gets a menu
to switch the CPU between all four levels while it runs, on the same page.

The Korz machine, made entirely of guarded slots you can inspect and replace at run time, boots
UNIX twice as fast as the hand-written switch statements. A real PDP-7 did about 0.3 million
instructions a second. This one does 189 million. On the Turing workload they tie, because the Turing
engine needs attention every three cycles, and the cabinet's loop costs the same either way.

Keeping that speed took Vanessa's discipline. The first time I ran two machines in one process, the second one
was much slower than the first: same code, same program, same tables. V8's `--trace-deopt` said
"wrong call target", over and over. Each machine had its own slots as its own closures, so V8 saw
the same code as different functions. Every call site that had inlined machine 0's function gave
up when machine 1 showed up. The fix is the split Smalltalk and Self make between shared behavior
and per-object state. Build each slot function once per process, and let a slot reach its
machine through the context, as one more coordinate, like the opcode or the device code. In Korz
that's natural, because there was never a privileged receiver to close over. Now later machines are
faster than the first.

## What you get for free when you're not using it

This is my favorite part. In a normal emulator, a debugging feature
costs you even when it's off: a check on every memory access, a flag tested every instruction. Here,
a feature that isn't installed isn't in the tables and isn't in the compiled code. It costs nothing.

- **Watchpoints and breakpoints.** A slot on one address. Install it and the table grows and the
  compiled code around that address calls out. Remove it and everything goes back to 5 ns.
- **Monitoring.** An observe slot sees every access to a region, then calls `next` to let the
  access through. The 340 display uses exactly this to hear about writes into memory it has already
  read.
- **Fault injection.** A patch slot can make a word read-only, a sector bad, a device slow.
- **Live coding.** Install and remove slots while the machine runs. The resolver rebuilds the tables
  it touched before the install returns, and the compiler throws away its blocks. The machine keeps
  running, with the new behavior, on the next instruction.
- **Explanations.** `why` on any access, any time.

None of this needed to be designed into the CPU. It's what you get by putting the CPU in the sea.

## Plug anything into anything

On real iron, a device belongs to one machine's bus. In the cabinet, a device is a set of slots
plus a little state. The PDP-7 already shares its core with two other processors, and talks to a
hand:

- **The Type 340 display** reads its display file out of PDP-7 core by DMA, drawing vectors. In the
  emulator it runs ahead of the CPU from a snapshot, optimistically, and if the CPU writes a word
  the 340 already read, the 340 rolls back and replays up to the write. That's Time Warp, David
  Jefferson's optimistic simulation, inside one emulated cabinet.
- **The Turing engine** on device 54 runs Turing machine transition tables stored in PDP-7 core,
  one 18-bit word per (state, symbol), the way the 340 runs display files. It writes its
  registers back to a control block in core, so the PDP-7 reads them as memory-mapped registers. A
  Forth called TM-Forth compiles high-level programs into its tables, the way Toffoli and Margolus
  used Forth to build CAM-6 rules.
- **The DataHand**, device 57, turns a webcam's view of your hand into 18-bit registers in the
  units PDP-7 Forth's turtle graphics already uses. A Forth program walks the 3D turtle through
  them and draws your hand on the 340, with no floating point of its own.

Every one of those devices adds instructions to the PDP-7. That's what IOTs are: a device code is a
new opcode space. With a Turing engine on the bus, the PDP-7 has Turing machine instructions.

Next come other CPUs, built on the same framework, with the same devices plugged in through
adaptors. First the Apple ][. Its language card's memory mapping will beat the ROM by being more
specific, instead of by being checked first, and a card in an expansion slot will be one
transactional set of slots. Then the PDP-10 and PDP-11, each bringing its own dimensions:
processor mode, page registers, addressing modes. A Turing engine on an Apple ][ will be the same
slots on a different bus.

And then machines sharing memory with each other. MIT's AI Lab had a Rubin 10/11 interface that
let the PDP-10 map a PDP-11's memory and device registers into its own address space. In the
cabinet, two machines will share memory through slots that say so, and `why` will tell you which
machine is answering. The Tiny Titan link already carries light-pen drawings from one machine to another.

## Fun before realism, and still exact

The cabinet has a manifesto, and its first rule is that tribute, accessibility and fun beat realism.
Realism is one way to reach them. The teletype wraps, scrolls, zooms, reads aloud and takes
dictation, which no Teletype Model 33 ever did. HILO, a guessing game from a machine with no screen,
takes "ninety nine" by voice. Listings credit the people who wrote the code, by name, even where the
real machine had no logins.

What stays honest is what makes it the machine. Every instruction does exactly what the PDP-7 did,
old binaries run unchanged, and the switch-statement oracle checks it at every level. That's the
deal Korz makes possible: the faithful machine is the 99 slots, and everything we add is more
slots, labeled with who added them, removable, and visible to `why`. You can have a scrupulously
accurate PDP-7 and a PDP-7 with a Turing machine, a camera hand and a self-switching-off box,
and it's the same machine with a different set of slots installed.

## Where this is going

The PDP-7 was the warm-up. Next on the compiler: keeping registers in JavaScript locals across a
block, blocks that call each other directly, and compiling ahead of time for ROMs and a fixed Forth
kernel. Then the Apple ][, with microM8 as its oracle, and its software library as the test suite.

And one speculative step I can't resist. A language model can propose slots: an accelerator for
UNIX's idle loop, or for Forth's inner interpreter. The proposal goes into its own layer, labeled
with who proposed it, and runs in lockstep against the oracle on recorded traces. If it agrees, it
stays. If it ever disagrees, out it goes. That's Self's speculate-and-deoptimize, with meanings in
place of types.

Self's ideas went into the engine under every web page. Korz's ideas have barely been tried. I think
they belong in emulators, adventure games, cellular automata, and any system where the interesting
question is what happens in this context, more than which object owns the method. The code is all
TypeScript, it runs in Node and the browser, and it's free software.

## Try it

Every demo runs in the browser, from the original binaries where there are any:

- [UNIX v0](https://hyperties.org/cabinet/unix/): Ken Thompson's PDP-7 UNIX, booting from the RB09
  disk to the `@` prompt.
- [Forth](https://hyperties.org/cabinet/forth/): Mitch Bradley's PDP-7 Forth, with turtle graphics
  on the 340.
- [SYMELEC](https://hyperties.org/cabinet/symelec/): PIXIE's main program, Heinz Lemke's 1972
  light-pen editor, with its radial menus. This is where the whole emulator started.
- [DUEL](https://hyperties.org/cabinet/duel/): DECUS 7-40 (Cambridge, 1968), two ships on the
  340, flown from the console switches by two players on one keyboard.
- [Turing engine](https://hyperties.org/cabinet/turing/): the Turing machine coprocessor on device
  54, driven from Forth.
- [Ultimate Machine](https://hyperties.org/cabinet/ultimate/): switch it on and it switches itself
  off.
- [ULTIMATE-HAND](https://hyperties.org/cabinet/ultimate-hand/): your hand through the webcam,
  drawn by Forth on the 340, pressing the Ultimate Machine's switch.
- [LP370](https://hyperties.org/cabinet/lp370/): DEC's 1964 Type 370 light pen diagnostic, by
  C. Stein.

## Source code

All TypeScript, in [packages/cabinet](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet/):

- [`src/korz/korz.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/korz.ts): the sea, the Korz interpreter and the resolver
- [`src/korz/pdp7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/pdp7.ts): the PDP-7 as slots, with their JavaScript templates
- [`src/korz/compile7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/compile7.ts): the compiler
- [`src/korz/iop.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/iop.ts): the I/O bus as timed pulses
- [`src/plugins/pdp7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/pdp7.ts): `Pdp7`, the switch-statement oracle, after SIMH
- [`src/cabinet.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/cabinet.ts): the backplane, with event-driven devices and batches
- Devices: [`type340.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/type340.ts),
  [`turing.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/turing.ts), [`ultimate.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/ultimate.ts),
  [`datahand.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/datahand.ts), [`hand.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/hand.ts),
  [`tiny-titan.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/tiny-titan.ts), [`rb09.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/rb09.ts)
- Tests: [`src/korz/pdp7.test.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/pdp7.test.ts),
  [`src/korz/devices.test.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/devices.test.ts),
  [`src/korz/korz.test.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/korz.test.ts)
- Benchmarks: [`scripts/korz-bench.mjs`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/scripts/korz-bench.mjs), with results in
  [`bench-results/korz.jsonl`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/bench-results/korz.jsonl)

## Design docs

- [KORZ-MACHINES.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/KORZ-MACHINES.md): the technical summary, with open questions for the
  Self and Smalltalk people
- [KORZ-DISPATCH.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/KORZ-DISPATCH.md): the sea, the resolver, the event-driven backplane and
  the 340 running ahead
- [KORZ-COMPILER.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/KORZ-COMPILER.md): the compiler, its tests, its planted errors and its
  numbers
- [MANIFESTO.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MANIFESTO.md): the cabinet manifesto
- [PIXIE-RESTORATION.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md): restoring PIXIE from a 1972 printout to a
  tool its author uses
- [TURING-ENGINE.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md): the Turing engine, the Ultimate Machine and TM-Forth
- [DEVICES.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/DEVICES.md): how a device reaches a machine, and the DataHand layer by layer
- [UNIX-V0.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/UNIX-V0.md): PDP-7 UNIX in the cabinet
- [MAPPING.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MAPPING.md): one machine's memory mapped into another's, after the Rubin 10/11
- [Korz notes in moollm](https://github.com/SimHacker/moollm/tree/main/designs/korz): Korz explained,
  with the Zork and cellular automata cases

## References

- David Ungar, Harold Ossher and Doug Kimelman. *Korz: Simple, Symmetric, Subjective,
  Context-Oriented Programming*. Onward! 2014.
- David Ungar and Randall B. Smith. *Self: The Power of Simplicity*. OOPSLA 1987.
- Urs Hölzle, Craig Chambers and David Ungar. *Optimizing Dynamically-Typed Object-Oriented
  Languages with Polymorphic Inline Caches*. ECOOP 1991.
- Urs Hölzle, Craig Chambers and David Ungar. *Debugging Optimized Code with Dynamic
  Deoptimization*. PLDI 1992.
- Vanessa Freudenberg, Dan Ingalls, Tim Felgentreff, Tobias Pape and Robert Hirschfeld. *SqueakJS: A
  Modern and Practical Smalltalk That Runs in Any Browser*. DLS 2014.
- Vanessa Freudenberg on Hacker News, [December 2023](https://news.ycombinator.com/item?id=38774277).
- Tommaso Toffoli and Norman Margolus. *Cellular Automata Machines*. MIT Press, 1987.

# A sea of slots: emulating a PDP-7 with Korz, on the JIT that Self built

Don Hopkins, November 2026

**Watch it first.**

[![PIXIE and FORTH on PDP-7 Cabinet Emulator with Type 340 Vector Graphics Display](https://img.youtube.com/vi/lo8kdY-5i6c/maxresdefault.jpg)](https://www.youtube.com/watch?v=lo8kdY-5i6c)

[PIXIE and FORTH on PDP-7 Cabinet Emulator with Type 340 Vector Graphics Display](https://www.youtube.com/watch?v=lo8kdY-5i6c)
(23 minutes) opens with Heinz Lemke at his PDP-7 on film, then runs his program in the browser: its
radial menus driven by the light pen, the display list edited live in core, every instruction
traced back to the scanned 1972 listing, then DUEL, Lunar Lander, Mitch Bradley's Forth drawing
with a turtle, and UNIX logging in as `ken`. That's the plain emulator, before any of the Korz in
this article. It's the shallow end of the deep end.

**Then try it.** [Hold your hand up to your webcam](https://hyperties.org/cabinet/ultimate-hand/).
A PDP-7 running Forth draws your hand on its vector display, and your hand becomes the hand of
[Marvin Minsky](https://en.wikipedia.org/wiki/Marvin_Minsky)'s [Ultimate Machine](https://en.wikipedia.org/wiki/Useless_machine), the box whose only function is to switch itself off. Show it your
hand and the box switches itself on, its arm carries your hand out to the switch, and you switch it
off with a fingertip.

Keep it open while you read. Every part of that page is explained below.

## A PDP-7 in a web page

### What it runs

I have a PDP-7 running in a web page. It boots [Ken Thompson](https://en.wikipedia.org/wiki/Ken_Thompson) and [Dennis Ritchie](https://en.wikipedia.org/wiki/Dennis_Ritchie)'s 1969 UNIX to the
`@` prompt. That UNIX was rebuilt from the original listings by [Warren Toomey](https://github.com/DoctorWkt)'s [pdp7-unix](https://github.com/DoctorWkt/pdp7-unix) project
(Phil Budne, Tom Everett, Sebastian Rasmussen, Robert Swierczek, and others), working from Norman
Wilson's scans. It also runs [Mitch Bradley](https://github.com/MitchBradley)'s [PDP-7 Forth](https://github.com/MitchBradley/pdp7forth).

The [PDP-7](https://en.wikipedia.org/wiki/PDP-7) draws lines on a DEC [Type 340](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/DISPLAY-DEVICES.md) [vector graphics display](https://en.wikipedia.org/wiki/Vector_monitor). You point back at the screen with
a [light pen](https://en.wikipedia.org/wiki/Light_pen), the input device that complements it: the pen sees the beam pass under it and tells
the program which line you're pointing at.

It also has a [Turing machine coprocessor](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md) plugged into its I/O bus, and a [DataHand](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/DEVICES.md#the-datahand-layer-by-layer) that reads your
hand through a webcam. And it has Marvin Minsky's Ultimate Machine, the box whose only function is
to switch itself off. [Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon) [built the real one](https://www.youtube.com/watch?v=cZ34RDn34Ws), and Minsky [tells how it
came about](https://www.webofstories.com/play/marvin.minsky/127). Ours is [device 56](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md#the-ultimate-machine).

### How it started: PIXIE's radial menus

All of that grew out of one program and its menus. In 1969 at the Cambridge University
Mathematical Laboratory, Heinz Lemke, with [Neil Wiseman](https://en.wikipedia.org/wiki/Neil_Wiseman) and John Hiles, published [PIXIE](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md). It's an
editor for graph models such as electronic circuits and control systems, and you drive it with the
light pen. It ran on a PDP-7 with a Type 340 vector graphics display, linked to Cambridge's [Titan](https://en.wikipedia.org/wiki/Titan_(1963_computer))
mainframe.

PIXIE's menu pops up around the light pen's tracking cross, which makes it one of the earliest
known radial menus. I've been building [pie menus](https://en.wikipedia.org/wiki/Pie_menu) since the 1980s. So when Heinz scanned his 1972
printout of SYMELEC, PIXIE's main program, 128 lineprinter pages of it, I wanted to see and feel
those menus running again.

I had no PDP-7 to run it on, so I built one. SYMELEC now reassembles word for word from the
transcribed listing, and runs in the browser with its light pen and its radial menus. Heinz plans
to use PIXIE again, for Bayesian network models of health care. PIXIE is on the program of an HCI
session at [CARS 2027](https://www.cars-int.org/) in Berlin on 29 June 2027, the 60th anniversary of his first Cambridge
lecture.

### How it was built

Anthropic's Claude (no relation to Shannon) was my programming partner, and
[MOOLLM](https://github.com/SimHacker/moollm) was where we worked. MOOLLM is my open-source
collection of 156 skills in Anthropic's [Agent Skills](https://agentskills.io/) format: folders of plain-text instructions, in
Markdown and YAML, that a model loads and follows when a task calls for them.

MOOLLM extends that format so the file system works like Self's object system. Directories are
objects that inherit from prototype directories, and the language model fills in whatever the
files leave open. And it treats the whole git repository as a world people and language models
share, like a text adventure.

My first implementation was a straight port to TypeScript of [SIMH](https://github.com/simh/simh)'s PDP-7 simulator, by [Bob
Supnik](https://en.wikipedia.org/wiki/Bob_Supnik), and SIMH's Type 340 display, by [Phil Budne](https://github.com/philbudne). It includes [Lars Brinkhoff](https://github.com/larsbrinkhoff)'s PDP-7 display
interface, and the 340 character shapes he recovered from MIT AI Lab film footage and the Knight
TV font.

Once that worked, it became the reference: the known-good machine every later version has to agree
with. Then I rebuilt the PDP-7 in Korz three times over, as an interpreter, as precomputed dispatch
tables, and as a compiler, each one checked instruction by instruction against the one before.

### What this article is about

[Korz](https://doi.org/10.1145/2661136.2661147) is a language almost nobody has heard of. It runs here on a JavaScript JIT that exists
because of a language almost nobody uses any more called [Self](https://selflanguage.org/). This article is about those two
languages, and why they turn out to be exactly the right tools for building emulators you can take
apart while they run.

## Self, and the JIT in your browser

### The power of simplicity

In 1986 at Xerox PARC, [David Ungar](https://en.wikipedia.org/wiki/David_Ungar) and Randall Smith designed Self by taking Smalltalk and removing
things. Smalltalk said everything is an object, but an object got its behavior from its class, a
separate thing above it.

Self threw out classes. An object is a set of slots, where a slot is a named cell holding either a
value or a method. An object inherits by pointing at another object, its parent.

Want a teletype that reads aloud? Copy a teletype and give the copy a new `print` slot. Even
reading a variable is a message send, so there is no difference between a stored value and a
computed one. ["Self: The Power of Simplicity"](https://bibliography.selflanguage.org/self-power.html) (OOPSLA 1987) is still one of the best-titled papers
in computing. To see it run, watch [Self: The Movie](https://www.youtube.com/watch?v=Ox5P7QyL774), Smith and Ungar's
1995 tour of the live system at Sun.

### Making it fast

A language that dynamic looked like it had to be slow. Ungar's group at Stanford and Sun, including
[Craig Chambers](https://en.wikipedia.org/wiki/Craig_Chambers), [Urs Hölzle](https://en.wikipedia.org/wiki/Urs_H%C3%B6lzle), and Elgin Lee, made it fast. The techniques they invented are the ones
running in your browser right now:

- **Maps.** Objects cloned from the same prototype share a hidden description of their layout, so
  a slot lookup becomes a fixed offset.
- **Customization.** Compile a separate copy of a method for each kind of receiver (the object
  the message was sent to), so the compiler knows exactly what `self` is.
- **[Polymorphic inline caches](https://bibliography.selflanguage.org/pics.html)** (Hölzle, Chambers, and Ungar, ECOOP 1991). Each call site remembers
  the few receiver maps it has seen and jumps straight to their methods. The cache doubles as a
  profile of what the program actually does.
- **[Dynamic deoptimization](https://bibliography.selflanguage.org/dynamic-deoptimization.html)** (PLDI 1992). Optimize aggressively on assumptions. When an assumption
  breaks, or a debugger looks, fall back to unoptimized code mid-execution, with every frame
  intact.

### From Self to V8

Then some of the Self people started Animorphic Systems and built [Strongtalk](http://strongtalk.org/), a fast Smalltalk on
that technology. Sun bought Animorphic in 1997, and the Strongtalk VM became the basis of Java's
[HotSpot](https://openjdk.org/groups/hotspot/).

[Lars Bak](https://en.wikipedia.org/wiki/Lars_Bak_(computer_programmer)), who had worked on Self and Strongtalk and led HotSpot, went to Google. There he led the
team in Aarhus that built V8 for Chrome in 2008. V8's "hidden classes" are Self's maps, and inside
V8 they are [still called maps](https://v8.dev/blog/fast-properties). Its inline caches, its speculative optimization, its deoptimization
when a guess goes wrong: Self, all of it.

### Everywhere else

V8 is only the best known. HotSpot is still the JVM in OpenJDK. Safari's [JavaScriptCore](https://webkit.org/blog/10308/speculation-in-javascriptcore/) calls its
hidden classes Structures, and Firefox's SpiderMonkey calls them Shapes. Both use inline caches,
and both bail out of optimized code when a speculation fails.

[Dart](https://dart.dev/)'s VM came from Lars Bak and Kasper Lund, after V8. GraalVM's [Truffle](https://www.graalvm.org/latest/graalvm-as-a-platform/language-implementation-framework/) makes deoptimization the
center of its design. PyPy gives Python objects maps, Ruby 3.2 gave its objects [shapes](https://bugs.ruby-lang.org/issues/18776), and CPython
3.11 added [inline caches](https://peps.python.org/pep-0659/) to its interpreter. [Eliot Miranda](https://github.com/eliotmiranda)'s [Cog VM](https://github.com/OpenSmalltalk/opensmalltalk-vm) for Squeak and Pharo uses
polymorphic inline caches.

Microsoft's CLR now switches running methods from quick code to optimized code by on-stack
replacement. The .NET runtime's
[design doc](https://github.com/dotnet/runtime/blob/main/docs/design/features/OnStackReplacement.md)
says OSR "was pioneered in Self", citing the 1992 deoptimization paper.

[Mike Pall](https://github.com/MikePall) announced "adaptive deoptimization support" in [LuaJIT](https://luajit.org/) 1.1.0 in 2006, using Self as his
example of code that needs aggressive inlining. LuaJIT 2 has a [trace compiler](https://en.wikipedia.org/wiki/Tracing_just-in-time_compilation), which compiles the
paths a program actually takes through its loops. For that he credited Gal and Franz and HP's
Dynamo, and [noted](http://lua-users.org/lists/lua-l/2008-02/msg00051.html) that "the technique
originated in system emulators doing on-the-fly binary-to-binary translation." Emulators, again.

### What JavaScript left out

[Brendan Eich](https://en.wikipedia.org/wiki/Brendan_Eich) says Self inspired JavaScript's prototypes, and every time someone repeats it, I
cringe. JavaScript missed the whole point of Self, which is right there in the title of the paper:
the power of simplicity.

Self has nothing but objects with slots, all the way down. A Self object can inherit from any
number of parents, with well-defined priorities. It can change its parents at run time, which Self
programmers do as an everyday technique and the VM handles efficiently.

JavaScript gave each object one prototype, and made changing it something
[MDN warns you against](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
because it's slow. It bolted on functions that double as constructors and misbehave if you call
them without `new`.

In Self, `self` is just the receiver. In JavaScript, `this` depends on how a function was called,
so pass a method as a callback and it forgets its own object. Twenty years later ES2015 had to add
arrow functions, a second kind of closure, just to get a `this` that isn't aimed at your foot.
That's stolen valor: Self's name on the box, and none of its simplicity inside.

Eich's misunderstanding of the meaning of equality shows up in JavaScript's
[`==` table](https://dorey.github.io/JavaScript-Equality-Table/), and in his
[donation against marriage equality](https://www.theguardian.com/commentisfree/2014/apr/07/brendan-eich-has-the-right-to-fight-gay-rights-but-not-to-be-mozillas-ceo).
And yet Self's JIT technology was so good that it made JavaScript fast anyway, and made up for a
lot of lackluster design decisions.

Few people program in Self today. Every Chrome tab and every Node process runs its ideas.

## Vanessa's bet

### SqueakJS

[Vanessa Freudenberg](https://github.com/codefrau) wrote [SqueakJS](https://squeak.js.org/), a Smalltalk virtual machine in JavaScript. It runs real Squeak
images (saved snapshots of a whole running Smalltalk system), decades old, in any browser. [Her
paper](https://doi.org/10.1145/2775052.2661100) (DLS 2014, with [Dan Ingalls](https://en.wikipedia.org/wiki/Dan_Ingalls), [Tim Felgentreff](https://github.com/timfel), [Tobias Pape](https://github.com/krono), and [Robert Hirschfeld](https://www.hpi.uni-potsdam.de/hirschfeld/)) won the
Most Notable Paper award ten years later.

Squeak objects are plain JavaScript objects. Her hybrid garbage collector hands as much work as
possible to the JavaScript collector, keeping for itself only what JavaScript can't give her.

### Don't fight the host

Talking about WebAssembly [on Hacker News in December 2023](https://news.ycombinator.com/item?id=38774277), she wrote:

> I'd much rather make the SqueakJS JIT produce code that the JavaScript JIT can optimize well.
> That would potentially give us more speed than even WASM.

That is the bet this whole emulator is built on. Don't fight the host. Generate JavaScript that V8
recognizes: objects that always have the same fields in the same order, and call sites that always
call the same function. Then V8 does what Self taught it to do: inline everything, speculate, and
deoptimize safely when you change your mind.

Vanessa died in 2025. Every fast path in this emulator is built on her bet.

## Korz: Self without the objects

### Slots, guards, and contexts

In 2014, Ungar, with Harold Ossher and Doug Kimelman at IBM Research, took the next subtraction.
Self removed classes. Korz (["Korz: Simple, Symmetric, Subjective, Context-Oriented Programming"](https://doi.org/10.1145/2661136.2661147),
Onward! 2014) removes objects. Ossher's [FOOL 2014 talk](https://2014.splashcon.org/details/fool2014/4/A-Simple-Symmetric-Subjective-Foundation-for-Object-Aspect-and-Context-Oriented-)
has the slides.

The behavior stays. What goes is the rule that every piece of behavior belongs to exactly one
object. In Korz, a program is a flat "sea" of slots that belong to nothing.

A Korz slot is a Self slot cut loose from its object. It has a message name (its selector, like
`pop` or `read`), a method or a value, and a guard.

Every message send happens in a context: a set of coordinates along named dimensions, like
`rcvr: myStack` or `assertions: true` or `user: don`. The guard says which coordinates the slot
cares about.

A send matches the whole context against the guard of every slot with that selector, and the most
specific match runs: the one whose guard pins down the most. If two match equally, that's an error.

No argument is privileged as "the receiver". The receiver is just one more dimension, called
`rcvr`.

### The chain, and `next`

The matching slots line up from most specific to least, in a chain. A slot can call `next` to pass
the send down the chain to the next one, the way a method calls `super`.

### A new dimension without touching the middle

The paper's example shows why that matters. Define `pop()` once, guarded on `rcvr` being a stack.
Later, add a second `pop()` that checks its assertions, guarded on `rcvr` being a stack and
`assertions` being true. It is more specific, so it wins whenever the context says
`assertions: true`.

Now `main()` sets `assertions: true`, and the context carries it implicitly down every call, the
way `this` flows in an object-oriented language. No code in between mentions assertions at all.
You added a new axis of variation to a running design without touching the middle.

### Multiple dispatch, and who gets to be special

Korz has ancestors besides Self. Multiple dispatch picks a method by looking at the run-time
values of all the arguments, not just the first one.

In Common Lisp's object system, [CLOS](https://en.wikipedia.org/wiki/Common_Lisp_Object_System), methods belong to generic functions, not to classes.
`(defmethod collide ((a asteroid) (b ship)) ...)` is a method on `collide` for an asteroid hitting
a ship, and neither the asteroid nor the ship owns it. A parameter can be specialized on a class
("is a kind of that"), or, with an `eql` specializer, on one exact object ("is that"). [Dylan](https://opendylan.org/), Apple's descendant of CLOS, kept multiple dispatch.

So is the receiver still special? Mostly not, but not completely. When two methods both apply,
CLOS compares their parameters left to right, so the first argument still gets the first say,
unless you give the generic function a different `:argument-precedence-order`. Craig Chambers,
from the Self group, made his language [Cecil](https://en.wikipedia.org/wiki/Cecil_(programming_language)) compare the arguments pointwise instead, and call a
tie ambiguous. That's the rule Korz uses.

[ScriptX](https://en.wikipedia.org/wiki/ScriptX), the multimedia language I worked on at [Kaleida Labs](https://en.wikipedia.org/wiki/Kaleida_Labs), was class-based, not prototype-based,
and its generic functions worked the CLOS way. Each method declared the class its first argument,
`self`, had to be, and you could use the same syntax to declare classes for any of the other
arguments, so dispatch looked at the class of each argument. What it didn't have, as far as I
remember, was a guard like "this argument equals this" or "is in this range."

#### Changing the rules of dispatch

[Gregor Kiczales](https://en.wikipedia.org/wiki/Gregor_Kiczales), Jim des Rivières, and [Daniel Bobrow](https://en.wikipedia.org/wiki/Daniel_G._Bobrow) wrote [*The Art of the Metaobject Protocol*](https://en.wikipedia.org/wiki/The_Art_of_the_Metaobject_Protocol)
(1991). A metaobject protocol, or MOP, implements CLOS in CLOS: classes, generic functions, and
methods are themselves objects, so you can change how dispatch works by specializing the
dispatcher.

[Predicate dispatch](https://homes.cs.washington.edu/~mernst/pubs/dispatching-ecoop98.pdf) ([Michael Ernst](https://homes.cs.washington.edu/~mernst/), Craig Kaplan, and Craig Chambers, ECOOP 1998) goes further. A
method's guard can be any condition: this parameter is that, or is in that range, or is a kind of
that, or is in that state. One method overrides another when its condition logically implies the
other's.

That's close to a Korz guard. In the cabinet, a guard is a set of allowed values on each
dimension: an exact device code, a range of addresses, or a group of opcodes.

#### More axes to cache on

Every axis you dispatch on is an axis you can cache on. PCL, the portable implementation of CLOS,
remembered the chosen method in a table keyed on the classes of all the specialized arguments
([Kiczales and Luis Rodriguez, 1990](https://doi.org/10.1145/91556.91600)). That's the multi-argument cousin of Self's inline caches.
[Julia](https://julialang.org/) compiles a separate copy of a function for each combination of argument types, which is
Self's customization applied to every argument.

Korz's dimensions go one step further. They aren't only the arguments you pass; they're the
context carried implicitly down every call. In the cabinet, the resolver turns them into tables,
and the compiler turns the tables into code.

### Aspects without the knives

[Aspect-oriented programming](https://www.cs.ubc.ca/~gregor/papers/kiczales-ECOOP1997-AOP.pdf), which Kiczales's group at Xerox PARC introduced in 1997, fights the
same war with knives. It names the problem "crosscutting
concerns": code like logging or checking that ends up scattered across modules and tangled
together. Then it cuts in with pointcuts, patterns that pick out places in the program, and a
compiler weaves advice, the code to run at those places, back through it.

Ossher had been there before Korz. With [Peri Tarr](https://en.wikipedia.org/wiki/Peri_Tarr), William Harrison, and Stanley Sutton he wrote
["N Degrees of Separation"](https://dl.acm.org/doi/10.1145/302405.302457) (ICSE 1999). It sliced
programs into overlapping "hyperslices" along many dimensions, and composed them back together.

Korz gives you the slices without the knives. A concern is just a dimension, and its slots sit in
the sea next to everything else. Nothing gets cut and nothing gets woven.

### Objects as a point of view

And objects come back, as a point of view. Gather the slots by `rcvr` and you see objects. Gather
them by `assertions` and you see all the assertion checking. Gather them by `user` and you see one
person's view of the system.

Same sea, different cuts. That's the "subjective" in the title, and the name comes from [Alfred
Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski): [the map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation).

The Korz prototype was written in Self, on the Self VM. Korz appeared in three papers and a talk in
2014 and 2015. I think it's one of the most mind-expanding ideas in programming languages, and it
fits problems I've been working on my whole career.

## Things that were Korz all along

### Adventure games

#### Zork's five dimensions

Zork's parser binds five globals every turn: the verb (`PRSA`), the direct object (`PRSO`), the
indirect object (`PRSI`), the character acting (`WINNER`), and the room (`HERE`). Then, roughly, the
room gets first crack, then the objects, then the verb's default.

That's Korz dispatch: five dimensions, carried implicitly, with the most specific handler winning,
shipped on Infocom's [Z-machine](https://en.wikipedia.org/wiki/Z-machine) virtual machine in 1979! Say "ROBOT, PUSH BUTTON" in Zork II, and
`WINNER` becomes the robot: same verb, same object, different dispatch.

[The Sims](https://en.wikipedia.org/wiki/The_Sims_(video_game)), which I worked on at Maxis, did the same with two dimensions: `me`, the person acting,
and `stackObject`, the thing being acted on.

#### Korz, Zork, and Korzybski

David Ungar assures me that Korz is only accidentally an anagram of Zork. I believe him, but
Korzybski would have loved it. Every Zork player drew a map on graph paper of a territory they
could only reach through words, and an anagram is a map of a word: same letters, different
territory.

### Cellular automata

A cell's rule dispatches on its neighborhood, and every neighbor is a dimension. That's five for
the [von Neumann neighborhood](https://en.wikipedia.org/wiki/Von_Neumann_neighborhood) (a cell and its four edge neighbors), nine for [Moore](https://en.wikipedia.org/wiki/Moore_neighborhood) (the full 3×3
square).

[Tommaso Toffoli](https://en.wikipedia.org/wiki/Tommaso_Toffoli) and [Norman Margolus](https://en.wikipedia.org/wiki/Norman_Margolus)'s [CAM-6](https://www.donhopkins.com/home/CAM6/) hardware compiled rules written as Forth functions into a lookup
table, by running the rule for every possible neighborhood and storing the answers. (My [CAM6.js](https://github.com/SimHacker/CAM6)
does the same compile in the browser.)

The [Margolus neighborhood](https://en.wikipedia.org/wiki/Block_cellular_automaton) has no center cell at all: a 2×2 block where all four cells update
together, and none of them is "the receiver". Object-oriented programming is "this". A cellular
automaton is "us".

### Emulators

This is the one I'm building. An emulator is a dispatcher whose coordinates are small, finite, and completely known: which address, read or write or instruction fetch, who is on the bus, which
opcode bits, which device code, which I/O pulse, which memory configuration.

Emulators encode that dispatch by hand, in switch statements and page tables. If you want to watch
one address, you go find the right place in the code and patch it. If you want a breakpoint, the
emulator needed to have been built with breakpoints.

In Korz, every one of those things is a slot:

- The core memory is a slot on `read` and `write`.
- Each opcode is a slot on `exec`, guarded on the opcode bits.
- Each device's handler is a slot on the I/O bus, guarded on device code and pulse.
- A watchpoint is a slot on `read` guarded on one address.
- A breakpoint is a slot on instruction fetch.
- A device you invented last week is a set of slots on device codes nobody at DEC ever used.

## The PDP-7 as a sea

### The cabinet

So I built it. A PDP-7 is a good first machine, because it's small: 18-bit words, 16 instructions,
up to 32K of core, and I/O by IOT instructions, which send timed pulses to a numbered device.

I call the whole emulated system, the CPU, its memory, and its devices, the cabinet. The cabinet
that runs UNIX is 99 slots, on these selectors:

- `read` and `write`, for memory;
- `ea`, the effective address;
- `exec` and `skip`;
- `cc` and `rot`, the operate instruction's clear, complement, and rotate bits;
- `iot` and `iop`, the I/O bus.

Every device the cabinet has is on that bus: clock, teletype, paper tape, RB09 disk, the Type 340,
the Turing engine, the Ultimate Machine, and the hand tracker. So is a file service onto browser
storage, and the [Tiny Titan](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TINY-TITAN.md) link that connects one emulated machine to another (named after
Cambridge's Titan).

Because an emulator's coordinates are finite, two things that general Korz can't do become
possible.

### Ambiguity is caught when you add a slot, not when you crash

Guards are sets, so the sea can compute, when slots are added, whether two of them overlap with
neither more specific. Slots are added in transactions. A plug-in card can bring along the slot
that settles its own overlap, and the sea never passes through a broken state.

### The sea can be resolved ahead of time

The sea compiles into exactly the arrays a hand-written emulator would use. For each selector, the
resolver builds a table over only the dimensions some slot actually constrains.

`exec` becomes a 32-entry table. `read` becomes a one-entry table, because nothing guards an
address, until you install a watch on one address. Then `read` becomes a 32,768-entry table, and
when you remove the watch it shrinks back to one.

This is the CAM-6 move pointed at a bus: run the rules for every input and keep the answers.

### Asking `why`

Ask `why` about any access, and it names the chain of slots that answered and who added each one.

Slots added on top of the machine come in two kinds. An observe slot sees an access and calls
`next` to let it through. A patch slot replaces the behavior. A powered-off device is a patch slot
on its device codes, so `why` on an IOT to a dead device names the power switch.

## Four levels, each checking the one below

### The levels

I kept every level of the implementation. Each one is tested against the one below it, instruction
by instruction, comparing registers every step:

1. **`Pdp7`**, plain switch statements, the TypeScript port of SIMH's PDP-7, with Phil Budne's
   and Lars Brinkhoff's Type 340 code ported nearly line by line. This is the reference.
2. **The Korz interpreter.** For every dispatch, it filters the selector's slots, sorts the matches
   by specificity, and calls the chain. Slow, obvious, and correct. It boots UNIX at about four
   times the speed of a real PDP-7.
3. **The Korz resolver.** The tables above, with one generated JavaScript function per selector.
4. **The Korz compiler.** It turns runs of PDP-7 instructions into JavaScript functions.

### The tests

Every Korz level runs in lockstep with `Pdp7`, and they have to agree.

The first test is garbage on purpose. It fills core with random words, starts the PC somewhere
random, raises interrupts at random, and runs both CPUs for up to 2,000 steps, comparing every
register after every step and all of core at the end. Then it does that 299 more times. Real
programs use a few well-worn paths through the instruction set. Random words hit every opcode,
every odd indirect chain, code that overwrites itself, and IOTs nobody calls. When the two CPUs
disagree, the test names the seed and the step, so the failure replays exactly. This is called
[fuzzing](https://en.wikipedia.org/wiki/Fuzzing).

Then real programs: UNIX booting to its prompt, SYMELEC on the 340, the Turing engine, drawings
made with the light pen and sent over the Titan link, and DataHand frames by interrupt.

Then I break things on purpose to check the tests notice. I planted 24 errors in the compiler's
generated code, and the tests caught 23 of them. The 24th turned out to change nothing.

### The Ultimate Machine's bug

My favorite bug came from the Ultimate Machine. The cabinet decided when a device would next need
attention by looking at its power state before its tick, its periodic update. But the Ultimate
Machine switches itself off during its tick.

It took a device that switches itself off to find that bug, and we had one! Thank you, Minsky and
Shannon.

## The compiler, and why Self is in the room

### Templates

Slots can carry a template: their behavior as a snippet of JavaScript source. The sea carries it
and never looks at it.

The compiler builds blocks, runs of instructions compiled into one JavaScript function. For each
instruction, it asks the sea once for the chain of slots at that instruction's coordinates.

If every slot in the chain has a template, the compiler pastes them together into straight-line
code. If any slot doesn't (your watchpoint, your patch, a device someone wrote in a hurry), the
compiled code calls the dispatcher right there. That slot runs exactly as it would in the
interpreter.

### Code that rewrites itself

PDP-7 programs write into their own code constantly. JMS stores its return address in the first
word of the subroutine, and real programs of the period rewrite their own instructions.

So each compiled block remembers exactly which words of core it was compiled from, and a store into
one of them throws the block away. That's Self's dependency-driven recompilation, at the grain of
18-bit words.

### The numbers

Here are the times, in nanoseconds per emulated instruction, including all the devices, on an M4
Max with Node 26:

| Workload | Live demo | `Pdp7` switch | Korz compiled | Korz resolver | Korz interpreter |
|---|---|---|---|---|---|
| UNIX v0 boot, 3M instructions | [cabinet/unix](https://hyperties.org/cabinet/unix/) | 11 | 5 | 30 | 777 |
| Forth with 340, DataHand, Ultimate Machine, 10M | [cabinet/ultimate-hand](https://hyperties.org/cabinet/ultimate-hand/) | 21 | 13 | 44 | 763 |
| Turing engine running free, 5M | [cabinet/turing](https://hyperties.org/cabinet/turing/) | 67 | 71 | 118 | 1,211 |

In instructions per second, that's 92 million for `Pdp7` on UNIX, 189 million compiled, 34 million resolved, and 1.3 million interpreted. A real PDP-7 did about 0.3 million.

The Korz machine, made entirely of guarded slots you can inspect and replace at run time, boots
UNIX twice as fast as the hand-written switch statements. On the Turing workload they tie, because
the Turing engine needs attention every three cycles, and the cabinet's loop costs the same either
way.

The live demos run on the Korz compiler. Every one has a CPU menu next to its program menu, so you
can reboot it on any of the four levels and watch the same program run on each. The address
remembers your choice: here's UNIX on the
[switch statements](https://hyperties.org/cabinet/unix/?cpu=pdp7), the
[Korz interpreter](https://hyperties.org/cabinet/unix/?cpu=interpret), the
[Korz resolver](https://hyperties.org/cabinet/unix/?cpu=resolve), and the
[Korz compiler](https://hyperties.org/cabinet/unix/?cpu=compile). Next, the menu will switch levels
while the program keeps running, without rebooting.

### Two machines, one process

Keeping that speed took Vanessa's discipline. The first time I ran two machines in one process, the
second one was much slower than the first: same code, same program, same tables. V8's
`--trace-deopt` said "wrong call target", over and over.

Each machine had its own slots as its own closures, so V8 saw the same code as different
functions. Every call site that had inlined machine 0's function gave up when machine 1 showed up.

The fix is the split Smalltalk and Self make between shared behavior and per-object state. Build
each slot function once per process, and let a slot reach its machine through the context, as one
more coordinate, like the opcode or the device code.

In Korz that's natural, because there was never a privileged receiver to close over. Now later
machines are faster than the first.

## What you get for free when you're not using it

This is my favorite part. In a normal emulator, a debugging feature costs you even when it's off: a
check on every memory access, a flag tested every instruction. Here, a feature that isn't installed
isn't in the tables and isn't in the compiled code. It costs nothing.

- **Watchpoints and breakpoints.** A slot on one address. Add it and the table grows, and the
  compiled code around that address hands that access back to the dispatcher. Remove it and
  everything goes back to 5 ns.
- **Monitoring.** An observe slot sees every access to a region, then calls `next` to let the
  access through. The 340 display uses exactly this to hear about writes into memory it has
  already read.
- **Instrumentation.** The same kind of observe slot can count reads, writes, and instruction fetches for every word, to make a heat map of where a program spends its time. It can also
  record who last wrote each word, at what program counter and on what cycle, so a corrupted word
  can tell you whodunit. That's what [Valgrind](https://valgrind.org/) and [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) do for native code, and here it
  comes free because we own the machine. These are designed and next in line, and they cost
  nothing until you add them.
- **Fault injection.** A patch slot can make a word read-only, a sector bad, a device slow.
- **Live coding.** Add and remove slots while the machine runs. The resolver rebuilds the tables
  it touched before the change returns, and the compiler throws away the blocks it affects. The
  machine keeps running, with the new behavior, on the next instruction.
- **Explanations.** `why` on any access, any time.

None of this needed to be designed into the CPU. It's what you get by putting the CPU in the sea.

## Plug anything into anything

### Devices that share memory

On real iron, a device belongs to one machine's bus. In the cabinet, a device is a set of slots
plus a little state. The PDP-7 already shares its core with two other processors, and talks to a
hand:

- **The Type 340 display** reads its display file out of PDP-7 core by DMA, drawing vectors. In
  the emulator it runs ahead of the CPU from a snapshot, optimistically. If the CPU writes a word
  the 340 already read, the 340 rolls back and replays up to the write. That's Time Warp, David
  Jefferson's [optimistic simulation](https://doi.org/10.1145/3916.3988), inside one emulated cabinet.
- **The Turing engine** on device 54 runs Turing machine transition tables stored in PDP-7 core,
  one 18-bit word per (state, symbol), the way the 340 runs display files. It writes its registers
  back to a control block in core, so the PDP-7 reads them as memory-mapped registers. When the
  head runs off the end of its window, the engine can page the tape itself, or raise a fault and
  let the PDP-7 page it: a page fault raised by a coprocessor and serviced by its host, like
  SPARC's window overflow traps or a GPU's replayable faults, which turns a few words of core into
  a virtually infinite tape.
- **The DataHand**, device 57, is named after VPL's [DataGlove](https://en.wikipedia.org/wiki/Wired_glove) (Thomas Zimmerman and [Jaron Lanier](https://en.wikipedia.org/wiki/Jaron_Lanier)).
  It uses Google's [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) in the browser to turn a webcam's view of your hand into 18-bit
  registers, in the units PDP-7 Forth's turtle graphics already uses. A Forth program walks the 3D
  turtle through them and draws your hand on the 340, with no floating point of its own.

### Devices add instructions

Every one of those devices adds instructions to the PDP-7. That's what IOTs are: a device code is
a new opcode space. With a Turing engine on the bus, the PDP-7 has Turing machine instructions.

### Writing a device

That makes writing a device short work. A device is its own state plus a list of slots on its
device codes, one line each, each labeled with its mnemonic.

The Ultimate Machine's whole instruction set is 15 slots: `UMON` turns the lever on, `UMRL` reads
the lid angle into the accumulator, `UMSB` skips if the machine is busy, and so on.

Nothing in the CPU knows the device exists. The resolver puts its slots in the I/O tables, and the
compiler handles its IOTs like any other instruction.

### A Forth accelerator

A device doesn't have to use IOTs. It can also sit on the memory bus and answer fetches. The
cabinet's first coprocessor of that kind runs Mitch Bradley's PDP-7 Forth.

[Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)) compiles a definition into a
list of addresses, called [threaded code](https://en.wikipedia.org/wiki/Threaded_code). Each cell
in the list names another word to run. NEXT, the inner interpreter, fetches the next cell and runs
it. Mitch's NEXT is one PDP-7 instruction, `XCT I 10`: execute the cell that register 10 points
at, and advance it. A Forth program spends most of its time in NEXT and in small primitives like
`DUP` and `+`.

The accelerator is a few Korz slots on `read`. One answers the CPU's fetch of NEXT. Instead of
handing back `XCT I 10`, it walks the thread itself. A call to another definition pushes the
return address on Forth's return stack. A constant or a variable goes on the data stack. A jump to
one of 30 known primitives runs in TypeScript, on the same stacks in the same core words that
Mitch's code uses. For anything else, such as `EMIT`, a 340 IOT, or a `CODE` word you wrote, the
slot hands the CPU a jump to that word's code, and the PDP-7 runs it.

The other slot answers the fetch of `FIND`, the word that looks a name up in the dictionary. It
keeps a table of the names in core, checks every hit against its header in core, and returns
the answer as `FIND` would.

The image in core is exactly the same with or without the accelerator. The slots are given the
kernel's labels at boot, and they decline whenever the code isn't what they expect: NEXT patched,
extend mode on, an interrupt waiting, a cell they don't recognize. Then the CPU runs Mitch's code
as written. A program never has to know the accelerator is there.

It runs one thread cell per memory cycle, a Forth word per cycle, the way
[Chuck Moore](https://en.wikipedia.org/wiki/Charles_H._Moore)'s Novix chip ran Forth in silicon
in the 1980s. A loop of 30,000 passes of `I +` takes 890,000 cycles in software, and 107,000 with
the accelerator. Turned up to eight cells per cycle, it takes 29,000.

Why build it? Three reasons.

- **Room.** SYMELEC fills the PDP-7. Heinz Lemke [wrote](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md)
  that its models "had to fit in the remaining 3000 words on the PDP 7". Mitch's Forth needs most of 8K too. I want a Forth that
  lives in SYMELEC's own machine and drives it: calls its routines, reads its rings, and scripts
  the light pen. That means Forth with almost nothing in core. This accelerator is the first step.
  The next is the dictionary in ROM, answered by `read` slots in bank 1, so the image itself
  shrinks.
- **Proof.** Mitch's kernel is the oracle. The tests run the same Forth sessions on the SIMH-style
  CPU and on all three Korz levels, with and without the accelerator. They must print the same
  Teletype output and draw the same picture on the 340.
- **Price.** A coprocessor is just more slots. Unplug it and they're gone, and the PDP-7 runs at
  the speed it did before. That's what Korz buys: an accelerator is a context, and when you leave
  that context it costs nothing.

The Forth page has a menu, **Forth: software / hardware**, beside the CPU menu. Switching reboots
the same image, with or without the slots. Try
[Forth with the accelerator](https://hyperties.org/cabinet/forth/?forth=hardware). The design,
including the ROM dictionary and a ring library in high memory, is in
[FORTH-DEVICE.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/FORTH-DEVICE.md).

### Displays as views of memory

Displays plug in the same way, from the other side. A display is a view projected out of memory:
it reads some range of a machine's memory and turns it into something to look at. Any number of
views can read the same memory at once, and the program can't tell it's being watched.

#### The Type 340

The Type 340 works that way today. It turns its display file into one stream of line segments.
The page draws them on a canvas, and can also export them as SVG, with each display subroutine as
an SVG group. The 340 hears about changes through an observe slot on `write`, like any other
monitor.

The 340 is also a processor with its own instruction set, and that's slots too. It decodes each
word by its mode register and the word's top two bits, so those are its two dimensions: 14 slots,
one for each thing a word can do, in a table of 32 entries. "Draw a vector" is one slot, and "draw
a vector, then escape" is a more specific one, where the original code had an `if`. Ask `why` of
any display word and it names the slot that decodes it. The original switch statement is the
oracle: random display files run on both, cycle for cycle, with a light pen wandering over the
screen. On the Korz levels the page uses the slots, and they cost nothing measurable.

#### The PIXIE ring view

The PIXIE ring view is another one that already runs. PIXIE keeps its circuits in ring structures,
linked lists of 18-bit words in core, the data structure [Ivan Sutherland](https://en.wikipedia.org/wiki/Ivan_Sutherland)'s [Sketchpad](https://en.wikipedia.org/wiki/Sketchpad) made famous.

The RINGS panel draws those rings in 3D, live from the running PDP-7's core, and lights up the
cells that just changed. Point at a cell to read it, and click to open it in the memory panel.

Today it reads core directly. Moving it onto observe slots is just repackaging. Then it will cost
nothing when the panel is closed, and only redraw when a ring actually changes.

#### Views to come

The same design covers the next ones: the Apple ]['s text and hi-res screens as raster frame
buffers, a heat map of memory drawn as a picture, a hex dump drawn as tiles, and a WebGPU
simulation of the 340's glowing phosphor.

### Other CPUs

Next come other CPUs, built on the same framework, with the same devices plugged in through
adaptors. First the Apple ][. Its language card, a RAM card that can stand in for the ROM, will win
by having the more specific guard, instead of by being checked first. Plugging a card into an
expansion slot will add all its Korz slots in one transaction.

Then the PDP-10 and PDP-11, each bringing its own dimensions: processor mode, page registers,
addressing modes. A Turing engine on an Apple ][ will be the same slots on a different bus.

### The rest of the family

The PDP-7 has siblings. In Bob Supnik's words, in SIMH's source, the PDP-4, PDP-7, PDP-9, and
PDP-15 are "upward compatible", with each new variant adding "distinct architectural features and
incompatibilities". The PDP-7 has extend mode, the PDP-9 adds user mode and a bounds register,
and the PDP-15 adds bank mode and a relocation register.

SIMH covers all four in one simulator, but picks the model when it's compiled. Its header says
"only one should be defined", and the source has 194 conditional compilation lines. Four
models, four builds.

In Korz, the model is a dimension. The slots the whole family shares don't mention it. A slot
that only one model has is guarded on that model, and a feature that arrived with the PDP-9 and
stayed is guarded on the set of the PDP-9 and the PDP-15. That's the assertions example from the
Korz paper again: the variation is a new axis, and nothing in the middle mentions it.

So one sea could be all four machines, and four machines could run side by side in one page, on the
same program, with `why` showing exactly which slots make them differ. And there's real hardware
to check the PDP-9 against: [Gavin Tersteeg](https://github.com/tergav17)'s homebrew PDP-9 clone,
[RDP-9](https://github.com/tergav17/RDP-9), which
[runs Mitch Bradley's PDP-7 Forth](https://www.youtube.com/watch?v=oNwXu50hZ44) without
modification.

### Machines sharing memory

And then machines sharing memory with each other. MIT's AI Lab had a [Rubin 10/11](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MAPPING.md) interface that let
the PDP-10 map a PDP-11's memory and device registers into its own address space.

In the cabinet, two machines will share memory through slots that say so, and `why` will tell you
which machine is answering. The Tiny Titan link already carries drawings made with the light pen
from one machine to another.

## Fun before realism, and still exact

### Fun first

The cabinet has a [manifesto](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MANIFESTO.md), and its first rule is that tribute, accessibility, and fun beat realism. Realism is one way to reach them.

The teletype wraps, scrolls, zooms, reads aloud, and takes dictation, which no [Teletype Model 33](https://en.wikipedia.org/wiki/Teletype_Model_33)
ever did. [HILO](https://hyperties.org/cabinet/hilo/), a guessing game Claude and I wrote for a machine with no screen, takes "ninety
nine" by voice. Listings credit the people who wrote the code, by name, even where the real machine
had no logins.

### And still exact

What stays honest is what makes it the machine. Every instruction does exactly what the PDP-7 did,
old binaries run unchanged, and the switch-statement reference checks it at every level.

That's the deal Korz makes possible. The faithful machine is the 99 slots, and everything we add is
more slots, labeled with who added them, removable, and visible to `why`.

You can have a scrupulously accurate PDP-7, and a PDP-7 with a Turing machine, a camera hand, and a self-switching-off box. It's the same machine with a different set of slots installed.

## Where this is going

### The compiler

The PDP-7 was the warm-up. Next on the compiler: keeping registers in JavaScript locals across a
block, blocks that call each other directly, and compiling ahead of time for ROMs and a fixed Forth
kernel.

#### Virtual machines on top of virtual machines

Mitch's Forth is a virtual machine one layer up. Every cell of a Forth definition is itself a
PDP-7 instruction: a call to another definition, a jump to a primitive, a constant, or a
variable's address. NEXT executes them one at a time, as the Forth accelerator above does.

Today the compiler compiles each cell, but leaves its block for the dispatch loop once per Forth
word. The next step is to compile a whole Forth definition as one block: follow the thread, inline
each cell, and stop at a branch or a return. [Ian Piumarta](https://www.piumarta.com/) and Fabio Riccardi's [selective inlining](https://doi.org/10.1145/277650.277743)
(PLDI 1998), and [Anton Ertl](https://www.complang.tuwien.ac.at/anton/) and David Gregg's [dynamic superinstructions](https://doi.org/10.1145/780822.781162), turn threaded code into
straight-line native code the same way. Here the native code is JavaScript, and V8 takes it from
there.

The Apple ][ has the same layering. [Steve Wozniak](https://en.wikipedia.org/wiki/Steve_Wozniak)'s [Sweet 16](https://en.wikipedia.org/wiki/SWEET16), in the Integer BASIC ROM, is a
16-bit machine with sixteen registers, interpreted by 6502 code. Infocom's Z-machine and [UCSD
Pascal](https://en.wikipedia.org/wiki/UCSD_Pascal)'s p-code are more of the same.

In Korz, a virtual machine on a real one is just more slots. Whoever loads the Forth installs a
slot that says `XCT I 10` is a step through a thread, and the compiler follows threads. Leave it
out, and XCT is just XCT. Sweet 16's opcodes would be slots the same way. The compiler never needs
to know that Forth or Sweet 16 exists. None of this is built yet. The Forth accelerator above
runs threads in slots at run time; this would compile them.

### The Apple ][

Then the Apple ][. Its reference won't be one emulator but several, and the more the better: every
emulator that runs the same program is one more oracle to run in lockstep against. And the Apple
]['s software library is the test suite.

[microM8](https://paleotronic.com/software/microm8/), April and Melody Ayres-Griffiths's
emulator, comes first. It's the cabinet's inspiration, it's MIT-licensed, and its Go core already
runs in our page as WebAssembly. Will Scullin's [apple2js](https://github.com/whscullin/apple2js)
and Chris Torrence's [Apple2TS](https://github.com/ct6502/apple2ts) are written in TypeScript, as
the cabinet is, and are MIT-licensed too. [SingleStepTests](https://github.com/SingleStepTests)
checks a 6502 one instruction at a time.

Each has its cost. microM8 does the most: 3D graphics, live rewind, an MCP server. But in the
browser it's a 41 MB module, the browser's debugger can't see into it, and it runs at about 1.7
MHz. The TypeScript emulators run in the language the cabinet does, so the browser's tools can
step through them. We surveyed the field in
[WEB-BENCH.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/WEB-BENCH.md#the-field),
explain why we're rebuilding microM8's Apple ][ in TypeScript, as slots, in
[microm8/STACK.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/microm8/STACK.md),
and weigh what each language gives the job in
[GO-AND-TYPESCRIPT.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/microm8/GO-AND-TYPESCRIPT.md).

### Slots proposed by a language model

And one speculative step I can't resist. A language model can propose slots: an accelerator for
UNIX's idle loop, or for a word in Forth that the Forth accelerator doesn't know yet.

The proposed slots go in labeled with who proposed them, and run in lockstep against the reference
machine on recorded traces. If they agree, they stay. If they ever disagree, out they go. That's
Self's speculate-and-deoptimize, with meanings in place of types.

### Back to the cave

#### The territory

The maps we drew on graph paper were never the game. The source code is the territory, and now all
of it is out in the open:

- [Will Crowther](https://en.wikipedia.org/wiki/Will_Crowther)'s original FORTRAN Adventure, recovered in 2005 from [Don Woods](https://en.wikipedia.org/wiki/Don_Woods_(programmer))'s own account on the
  Stanford backup tapes, and examined by Dennis Jerz in
  ["Somewhere Nearby is Colossal Cave"](https://www.digitalhumanities.org/dhq/vol/1/2/000009/000009.html).
- [ADVENT](https://www-cs-faculty.stanford.edu/~knuth/programs.html#advent): Crowther and Woods's
  Adventure, translated by [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) into CWEB, a literate program you can read like a book.
  It's Chapter 27 of his *Selected Papers on Fun and Games*, and the copyright line says "Don Woods
  and Don Knuth". My
  [notes on it](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/donald-knuth/sources/adventure-knuth)
  pull out the travel table, the dwarves, the pirate, and the lamp.
- [MIT Zork](https://github.com/MITDDC/zork) in MDL, from the Dynamic Modeling Group's tape, where
  `PRSA`, `PRSO`, `PRSI`, `WINNER`, and `HERE` were born.
- Infocom's ZIL source for [Zork I](https://github.com/historicalsource/zork1),
  [II](https://github.com/historicalsource/zork2), and [III](https://github.com/historicalsource/zork3),
  which Microsoft put under the MIT license in November 2025.

#### Rebuilding them in Korz

I want to rebuild both games in Korz, a piece at a time: the dwarves, the lamp running out of oil,
the thief, the troll, the parser rebinding `WINNER`.

Each translated piece gets checked against the original game, the way SIMH checked the PDP-7, with
forty-five years of players as extra testers. Knuth's commentary rides along as comments beside the
slots it explains. The plan is in
[Zorkizing Adventure](https://github.com/SimHacker/moollm/blob/main/designs/korz/case-zork.md).

### MOOLLM, where the threads meet

In MOOLLM, directories are rooms, files are the objects in them, and characters are files that a
person or a model can play. So a MOOLLM repository is already an adventure game.

Its skills shaped this whole project: its notes on Self and Korz, its cellular automata designs,
and the [no-ai-slop](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-slop/SKILL.md)
writing guide this article tries to follow.

And MOOLLM already dispatches on context. What a character can do depends on who the character is
and which room they're in, Zork's `WINNER` and `HERE`, with the directory tree standing in for the
guards.

### The adventure compiler, and Korz′

MOOLLM's
[adventure compiler](https://github.com/SimHacker/moollm/blob/main/skills/adventure/ADVENTURE-COMPILER.md)
already turns adventure worlds written in YAML (rooms, objects, verbs, and conditions on when they
apply) into deterministic JavaScript and Python. Those are already selectors and guards. So the
next version emits Korz slots and runs them on the Korz engine, not a new engine for every game.

Past that is
[Korz′](https://github.com/SimHacker/moollm/blob/main/designs/korz/korz-prime/README.md), "Korz
prime": the same slots with two ways to pick one. When the guards can decide, ordinary Korz
dispatch runs them, compiled and exact. When the player does something no guard covers, a language
model improvises. As the design doc puts it: "Korz compiles; Zork improvises."

### Sims advertisements, on the same Korz library

In [Will Wright](https://en.wikipedia.org/wiki/Will_Wright_(game_designer))'s The Sims, which I worked on at Maxis, the people aren't smart: the objects are.
Each object advertises what it can do, and how much each action would satisfy a Sim's needs. The
fridge advertises food to a hungry Sim, and the bed advertises sleep to a tired one. A Sim looks
at what's advertised nearby and picks something.

MOOLLM borrows this for every object. Its
[advertisement skill](https://github.com/SimHacker/moollm/blob/main/skills/advertisement/SKILL.md)
gives each object in a room a map of advertisements, and each one can carry a guard and a score.
I want to run them on the very Korz library that runs the PDP-7. None of this is built yet.

#### Can you, and would you want to?

An advertisement asks two questions. The guard asks "can you?": an advertisement whose guard
fails isn't offered at all. The score asks "would you want to?": how much this actor, right now,
wants this action.

In Korz, the guard is a guard. An advertisement becomes a slot whose guard constrains the actor
asking, the object offering, the room, and the object's state, each as its own dimension. Any of
them can be pinned to one value ("is that"), a group of values ("a kind of that"), or a range
("in that range"). That's the multiple dispatch from earlier, on every argument at once.

The score is a method on that slot, and it can compute anything: the actor's hunger, how far away
the fridge is, whether the stove has set the house on fire lately.

#### Scores written in prose, compiled by a language model

Nobody has to write those score methods by hand. In MOOLLM, an advertisement's `score_if` is
prose, like "the actor is tired." The adventure compiler hands that prose, along with the schema of
the actors and objects it may read, to a language model, which writes a short JavaScript function
and stores it next to the prose as `score_if_js`:

```yaml
BREW:
  score: 65
  score_if: "the actor is tired"
  score_if_js: "(actor) => actor.needs.energy < 30"
```

A function that returns true or false switches the bid between `score` and 0. A function that
returns a number is the bid, which is how a bid grows with a need:
`(actor) => 100 - actor.needs.energy`.

That function becomes the slot's score method. The language model runs once, when the world is
compiled, not every time a Sim gets hungry. What runs during the game is ordinary JavaScript, on
the same JIT as everything else, and the prose stays beside it so a person can read what it was
supposed to do and regenerate it if it's wrong.

#### An auction, not a send

Here Korz's own rule has to bend. A Korz send runs the one most specific slot, and a tie is an
error. Advertisements want the opposite: every slot that applies, all bidding at once.

So asking "what can I do here?" isn't a send. It's a view. The library already has one: `view`
returns every slot whose guard matches a query, which is how the PDP-7 debugger asks for
"everything that touches page 07." For advertisements, the query is the actor's context, the
result is the list of offers, and each offer's score method runs to set its bid.

#### Behavior dithering

The Sims didn't always take the highest bid. It picked at random among the top few, which made
Sims feel alive instead of predictable. MOOLLM's
[auction design](https://github.com/SimHacker/moollm/blob/main/designs/ADVERTISEMENT-AUCTION.md)
gives the reasons: bids are sales pitches, not truths; random picks among good options find ways
out of dead ends; and a character who never surprises you can't be taught.

Two parts of that fit Korz exactly. The random number generator's seed goes in the log, so a
replay makes the same choices. That's the same determinism that lets the emulator's four levels be
checked against each other.
And how much to dither, the temperature, is a context value, set once by a room or a scene and
inherited by every choice inside it. In Korz, that's just another dimension.

#### Turning conditions into guards

Guards go through the same compiler. "The actor has materials and the crafting skill" becomes a
`guard_js` function. When enough of those functions share a shape, the shape graduates into a standard key like
`requires_items`, `when_state`, or `requires_lighting: { min, max }`.

Those graduated keys are Korz guards: a set of items, a state value, a range. Graduating a
condition moves it out of code and into dispatch, where the library can check it for ambiguity,
precompute it into tables, and compile it.

Not every condition fits those shapes. "The actor is tired" isn't a set of items, a state, or a
range. It's a judgment, maybe `energy < 30` weighed against other needs. So it stays in the score
function the language model wrote. That function can run any JavaScript, which is why the library
can't check it, precompute it, or compile it the way it does a guard.

That split is deliberate. Dispatch has to know when one guard is more specific than another, and
only sets can tell it. A score only has to come out as a number, so it can afford to be any code.

#### Back into The Sims

JavaScript isn't the only target. Objects in The Sims are programmed in SimAntics, a visual
language whose behavior trees are stored as `BHAV` resources inside each object's file. A table in
the same file lists the object's interactions, the tree that tests whether each one is available,
the tree that performs it, and the needs it advertises to satisfy.

That's the same shape as a MOOLLM advertisement: a guard, an action, and a score. So the compiler
that writes `guard_js` and `score_if_js` can also write SimAntics.

[SimObliterator Suite](https://github.com/DnfJeff/SimObliterator_Suite), [Dnf_Jeff](https://github.com/DnfJeff)'s open source
toolkit for The Sims 1 files, can already disassemble behavior trees and inject new ones into an
object, through checked transactions it can roll back. Put the compiler in front of it, and a Sims
player could describe what an object should do in plain English and get a working object.

The language model wouldn't write raw bytecode from scratch. It would fill in templates: known-good
trees for "test a need," "walk to the object," "play an animation," and "change a need," with the
blanks filled from the prose. That's how the cabinet's own compiler works, with templates for
PDP-7 instructions instead of Sims behaviors. The templates keep the generated objects from
crashing the game, and the prose stays attached, so the next player can read what the object was
meant to do.

### Korz's turn

Self's ideas went into the engine under every web page. Korz's ideas have barely been tried.

I think they belong in emulators, adventure games, cellular automata, and any system where the
interesting question is what happens in this context, more than which object owns the method. The
code is all TypeScript, it runs in Node and the browser, and it's free software.

## Try it

Every demo runs in the browser, from the original code where it survives:

- [UNIX v0](https://hyperties.org/cabinet/unix/): Thompson and Ritchie's PDP-7 UNIX, booting from the RB09
  disk to the `@` prompt.
- [Forth](https://hyperties.org/cabinet/forth/): Mitch Bradley's PDP-7 Forth, with his turtle
  graphics on the 340, after Logo's turtle by [Seymour Papert](https://en.wikipedia.org/wiki/Seymour_Papert), [Wally Feurzeig](https://en.wikipedia.org/wiki/Wally_Feurzeig), and [Cynthia Solomon](https://en.wikipedia.org/wiki/Cynthia_Solomon).
- [SYMELEC](https://hyperties.org/cabinet/symelec/): PIXIE's main program, Heinz Lemke's 1972
  editor, driven by the light pen, with its radial menus. This is where the whole emulator started.
- [DUEL](https://hyperties.org/cabinet/duel/): DECUS 7-40, by Peterson and Viner (Cambridge, 1968), two ships on the
  340, flown from the console switches by two players on one keyboard.
- [Turing engine](https://hyperties.org/cabinet/turing/): the Turing machine coprocessor on device
  54, driven from PDP-7 Forth, with the tape drawn on the 340. It runs busy beavers, a binary
  counter, and Minsky's universal machine, written in
  [TM-Forth](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md#tm-forth),
  a little Forth whose output is transition tables, the way Toffoli and Margolus used Forth to
  build CAM-6 rules.
- [Ultimate Machine](https://hyperties.org/cabinet/ultimate/): switch it on and it switches itself
  off.
- [ULTIMATE-HAND](https://hyperties.org/cabinet/ultimate-hand/): your hand through the webcam,
  drawn by Forth on the 340, pressing the Ultimate Machine's switch.
- [LP370](https://hyperties.org/cabinet/lp370/): DEC's 1964 Type 370 light pen diagnostic, by
  C. Stein.

## Source code

All TypeScript, in [packages/cabinet](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/cabinet/):

- [`src/korz/korz.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/korz.ts): the sea, the Korz interpreter, and the resolver
- [`src/korz/pdp7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/pdp7.ts): the PDP-7 as slots, with their JavaScript templates
- [`src/korz/compile7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/compile7.ts): the compiler
- [`src/korz/iop.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/korz/iop.ts): the I/O bus as timed pulses
- [`src/plugins/pdp7.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/plugins/pdp7.ts): `Pdp7`, the switch-statement reference, after SIMH
- [`src/cabinet.ts`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/src/cabinet.ts): the cabinet itself: the bus, the devices, and the scheduler that runs them
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
- [KORZ-DISPATCH.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/KORZ-DISPATCH.md): the sea, the resolver, the device scheduler, and
  the 340 running ahead
- [KORZ-COMPILER.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/KORZ-COMPILER.md): the compiler, its tests, its planted errors, and its
  numbers
- [MANIFESTO.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MANIFESTO.md): the cabinet manifesto
- [PIXIE-RESTORATION.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PIXIE-RESTORATION.md): restoring PIXIE from a 1972 printout to a
  tool its author uses
- [TURING-ENGINE.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/TURING-ENGINE.md): the Turing engine, the Ultimate Machine, and TM-Forth
- [DEVICES.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/DEVICES.md): how a device reaches a machine, and the DataHand layer by layer
- [UNIX-V0.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/UNIX-V0.md): PDP-7 UNIX in the cabinet
- [MAPPING.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/MAPPING.md): one machine's memory mapped into another's, after the Rubin 10/11
- [Korz notes in moollm](https://github.com/SimHacker/moollm/tree/main/designs/korz): Korz explained,
  with the Zork and cellular automata cases
- [case-zork.md](https://github.com/SimHacker/moollm/blob/main/designs/korz/case-zork.md): Zorkizing
  Adventure, rebuilding Adventure and Zork as Korz slots
- [Korz′](https://github.com/SimHacker/moollm/blob/main/designs/korz/korz-prime/README.md): Korz for
  the age of LLMs, with one semantics and two dispatchers
- [ADVENTURE-COMPILER.md](https://github.com/SimHacker/moollm/blob/main/skills/adventure/ADVENTURE-COMPILER.md):
  MOOLLM's adventure compiler, from YAML worlds to playable code
- [Knuth's literate Adventure](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/donald-knuth/sources/adventure-knuth):
  `advent.w`, with notes

## References

- David Ungar, Harold Ossher, and Doug Kimelman.
  [*Korz: Simple, Symmetric, Subjective, Context-Oriented Programming*](https://doi.org/10.1145/2661136.2661147).
  Onward! 2014. [Talk page](https://2014.onward-conference.org/details/onward2014-papers/8/Korz-Simple-Symmetric-Subjective-Context-Oriented-Programming).
- Harold Ossher, David Ungar, and Doug Kimelman.
  [*A Simple, Symmetric, Subjective Foundation for Object-, Aspect- and Context-Oriented Programming*](https://2014.splashcon.org/details/fool2014/4/A-Simple-Symmetric-Subjective-Foundation-for-Object-Aspect-and-Context-Oriented-),
  with slides. FOOL 2014.
- David Ungar and Randall B. Smith. [*Self: The Power of Simplicity*](https://bibliography.selflanguage.org/self-power.html).
  OOPSLA 1987. And [*Self: The Movie*](https://www.youtube.com/watch?v=Ox5P7QyL774), Sun, 1995.
- Urs Hölzle, Craig Chambers, and David Ungar. [*Optimizing Dynamically-Typed Object-Oriented
  Languages with Polymorphic Inline Caches*](https://bibliography.selflanguage.org/pics.html). ECOOP 1991.
- Urs Hölzle, Craig Chambers, and David Ungar. [*Debugging Optimized Code with Dynamic
  Deoptimization*](https://bibliography.selflanguage.org/dynamic-deoptimization.html). PLDI 1992.
- Gregor Kiczales and Luis H. Rodriguez Jr. [*Efficient Method Dispatch in PCL*](https://doi.org/10.1145/91556.91600). LFP 1990.
- Gregor Kiczales, Jim des Rivières, and Daniel G. Bobrow. [*The Art of the Metaobject
  Protocol*](https://en.wikipedia.org/wiki/The_Art_of_the_Metaobject_Protocol). MIT Press, 1991.
- Gregor Kiczales, John Lamping, Anurag Mendhekar, Chris Maeda, Cristina Lopes, Jean-Marc Loingtier,
  and John Irwin. [*Aspect-Oriented Programming*](https://www.cs.ubc.ca/~gregor/papers/kiczales-ECOOP1997-AOP.pdf). ECOOP 1997.
- Peri Tarr, Harold Ossher, William Harrison, and Stanley M. Sutton Jr.
  [*N Degrees of Separation: Multi-Dimensional Separation of Concerns*](https://dl.acm.org/doi/10.1145/302405.302457). ICSE 1999.
- Michael D. Ernst, Craig Kaplan, and Craig Chambers. [*Predicate Dispatching: A Unified Theory of
  Dispatch*](https://homes.cs.washington.edu/~mernst/pubs/dispatching-ecoop98.pdf). ECOOP 1998.
- David R. Jefferson. [*Virtual Time*](https://doi.org/10.1145/3916.3988). TOPLAS 7(3), 1985.
- Ian Piumarta and Fabio Riccardi. [*Optimizing Direct Threaded Code by Selective
  Inlining*](https://doi.org/10.1145/277650.277743). PLDI 1998.
- M. Anton Ertl and David Gregg. [*Optimizing Indirect Branch Prediction Accuracy in Virtual
  Machine Interpreters*](https://doi.org/10.1145/780822.781162). PLDI 2003.
- Vanessa Freudenberg, Dan Ingalls, Tim Felgentreff, Tobias Pape, and Robert Hirschfeld. [*SqueakJS: A
  Modern and Practical Smalltalk That Runs in Any Browser*](https://doi.org/10.1145/2775052.2661100). DLS 2014.
  [Run it](https://squeak.js.org/).
- Vanessa Freudenberg on Hacker News, [December 2023](https://news.ycombinator.com/item?id=38774277).
- Tommaso Toffoli and Norman Margolus. *Cellular Automata Machines*. MIT Press, 1987. CAM-6 in the
  browser: [CAM6.js](https://www.donhopkins.com/home/CAM6/) ([source](https://github.com/SimHacker/CAM6)).
- Donald E. Knuth. [*Selected Papers on Fun and Games*](https://www-cs-faculty.stanford.edu/~knuth/fg.html).
  CSLI, 2011. Chapter 27: [ADVENT](https://www-cs-faculty.stanford.edu/~knuth/programs.html#advent).
- Dennis G. Jerz. [*Somewhere Nearby is Colossal Cave: Examining Will Crowther's Original
  "Adventure" in Code and in Kentucky*](https://www.digitalhumanities.org/dhq/vol/1/2/000009/000009.html).
  Digital Humanities Quarterly 1(2), 2007.
- Claude Shannon's [Ultimate Machine](https://www.youtube.com/watch?v=cZ34RDn34Ws), and Marvin
  Minsky [on inventing it](https://www.webofstories.com/play/marvin.minsky/127).

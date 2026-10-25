# Cellular automata as visual programming languages

*Don Hopkins, about 2014. Written for a collection of visual programming languages, most likely
Eric Hosick's "Visual Programming Languages — Snapshots" (the 2014 roundtable Don convened around
it is in his private correspondence); the exact place it was posted isn't confirmed. Text as Don
pasted it on 25 October 2026, with three paragraphs that appeared twice kept once, small typos
fixed, and one garbled sentence (the Huffman tokens leaving the construction arm) smoothed.*

---

I believe HyperCard deserves honorary inclusion, because it has so many important ideas that
influenced or even formed the foundation of many visual programming languages.

I'd also put Scott Kim's Viewpoint thesis in that same category. And Ivan Sutherland's Sketchpad
wasn't technically a general purpose programming language. In the linked Sketchpad video, Alan Kay
says "that might be disputed" about whether or not it was a "programming system", but its influence
can't be underestimated, and I think that kind of foundational research stuff is important to
include in the collection.

Another interesting kind of visual programming languages, even earlier than Sketchpad, are Turing
complete cellular automata rules like John von Neumann's 29 state rule.

https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

He and Stanislaw Ulam designed the rule as well as a universal constructor that could duplicate
itself or construct any other machines or decorate abstract art if the instructions said to. It
could then bring its creations to life by injecting them with their own (or its own) instructions.
https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor

John von Neumann's cellular automata work laid the foundation for things like Minecraft redstone and
AgentSheets patterns, as well as a lot of profound and interesting research, even practical
applications.

I wonder what would a modern fully powered integrated development environment for 2-dimensional
JVN29 rules look like? Or even just "Turbo Pascal" for a less minimalistic, more convenient
programmable CA rule (CISC instead of RISC), designed for teaching programming, so it's easier to
understand, learn and program practical applications? That ran in a web browser, used WebGL to
render 3D Minecraft-like http://voxeljs.com blocks, and had JavaScript dictionaries flowing along
the wires, through extensible scriptable plug-in cells.

(I am taking a look at AgentCubes right now — thanks for letting me know about that!)

I'd be glad to write up further explanation of why I think cellular automata programming languages
are so interesting!

---

What's astounding about von Neumann is that he totally designed the rule AND the universal
constructor on paper, without having the computational luxuries we take for granted, like the
ability to see it and play with it while you're designing it, let alone a nice source code control
system with an integrated bug tracking system.

What's amazing about von Neumann's 29 state rule is how simply and ingeniously it's designed, so
that the universal constructor can actually do its job of reproducing itself, or constructing
anything else, even though the rule is so extremely simple with only 29 states.

What's fascinating about the Universal Constructor is that it actually works, and how it works
within such minimalistic constraints.

The first thing you'll notice is that it's incredibly huge and extremely complicated looking!

But at least at the closest zoom, looking at individual organs, it's still not very deep in the
Turing Tar Pit. It's not too difficult to look at the cells and figure out what they're doing,
especially while it's running slow enough you can watch. Even then it's very minimal: as vast as it
looks, it's nothing compared to the hidden complexity of a typical web browser or C++ compiler.

And von Neumann designed it all on paper by hand, without all the luxurious programming tools and
environments we enjoy complaining bitterly about today, so he gets a pass on the IDE GUI and
spaghetti code criticism.

Its basic approach to life was to store, play back and record information in a "tape" loop,
containing instructions that control its body and make it create, destroy and energize other cells.
Of course it can modify itself or other machines it encounters as easily as any other cells in the
world.

One practical application of self modifying cellular automata code is that a new machine can
initialize itself when it's first powered on, by performing some "booting" operations to get all of
its timers and internal signals synchronized and set up properly, and then fire the explosive bolts
(by executing cell destruction instructions on itself) that break some connections (like cutting
the umbilical cord), and permanently switch itself from "boot" mode to "run" mode.

One less constructive application is wanton destruction: After its child is born, educated, reached
adulthood, got a job in construction, and had its own child, but never called or wrote its parent
back, the parent might get depressed, and commit suicide by cutting its own memory loop, leaving its
dead skeleton behind to haunt its child forever (those damn kids will never move out of their
parent's house).

Or it could murder its own child by stabbing and electrocution with its construction arm. It will do
whatever the little voice in its tape loop tells it to do: no less. It's completely faithful to its
God, the programmer, absolutely deterministic, and in no way artificially or naturally intelligent.

Universal constructors aren't generally known to evolve, since they are extremely delicate, and the
tiniest disruption will cause them to fail spectacularly. But given an infinite enough number of
monkeys and an even more infinite number of bananas, you never know what might happen. They could
theoretically grow armor, and evolve ways of exchanging and permuting genetic information.

But traditionally, a Universal Constructor starts with a big long "tape" loop of instructions (which
may be folded to save space), and a big complicated messy body that looks like road pizza, with a
constructor arm sticking out somewhere (although for all I know they might evolve more constructor
arms, and iPods instead of tapes, if you let it run long enough in flakey memory ;).

The instructions control the body, and they can make it extrude the tip of the construction arm in
any direction (like when a lava flow spills out into the ocean, and extrudes a tube of rock around a
hot magma core that flows to the tip, turning into rock when it touches the water).

Just like lava, a stream of excited states representing instructions flows down the arm and out of
the tip of the construction arm, spilling out into an adjacent empty cell as a Huffman encoding token
that tells what type of "rock" to make or destroy. Different building instructions require different
numbers of bits to be clocked out into a cell, changing it from empty to another state in several
steps — the more common ones shorter, of course.

It proceeds to build a copy of itself by scanning the arm back and forth like a 3D printer head (but
it's a 2D printer, that prints one 1D layer at a time). Then it plugs its arm into the "belly button"
of its child that has an entrance passage leading into its empty memory loop, and then they go into
"mind copy" mode where the tape is looped back again but this time in "play" mode, with the child in
"record" mode. After it's done it then snips off the umbilical cord, and goes on to do whatever it was
programmed to do next, which is what keeps me up at night worrying if these things got loose out of
the lab.

## Influences and applications

John von Neumann's work has led to all kinds of interesting research and pure cellular automata
programming rules, like thermodynamically efficient reversible billiard ball automata, or easier to
understand and program (by non-pool-sharks) electronic-logic-circuit-like data flow rules like
WireWorld, that were designed to be conveniently programmed and easily understood by normal humans.

And then there are zillions of cellular automata rules from the depths of the Turing Tar Pit, that
weren't specifically designed to be programming languages but just happened to be Turing
equivalent. For example, the classic Life rule is Turing equivalent, and even some extremely simple
1-dimensional rules are too. They are not even that uncommon, which is a gross understatement of the
main take home point of *A New Kind of Science*.

So just because something's Turing complete doesn't make it interesting for inclusion as a visual
programming language (but it might be good to just give one good example).

But there are some interesting cellular automata rules designed specifically to be used for
programming in various ways, some of them not actually that terrible. And the reversible cellular
automata have many important real-world applications. (You can implement them in an extremely
efficient manner in hardware.)

---

Related here: the nuts and bolts of the rule and the constructor, with Don's CAM6 implementation
([29-state-implementation-and-buckley.md](29-state-implementation-and-buckley.md)); the "explosive
bolts" boot sequence on HN ([hn/16557102-passive-construction.md](hn/16557102-passive-construction.md));
reversible billiard-ball automata ([hn/16009568-billiard-ball-heat.md](hn/16009568-billiard-ball-heat.md),
[Tommaso Toffoli](../../tommaso-toffoli/README.md)); AgentSheets and AgentCubes are Alexander
Repenning's.

Up: [sources](README.md)

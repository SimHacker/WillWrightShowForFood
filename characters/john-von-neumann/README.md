# John von Neumann 🕯️ *(1903-1957) -- self-reproducing automata · the 29 state rule · the architecture he outgrew*

*Memorial portrayal -- not John von Neumann.* [Standards](../../schemas/portrayal-standards.md#memorial-mode)

## The joke that is also the thesis

John von Neumann's 29 state cellular automata machine is (ironically) a classical, decidedly
**non-von Neumann architecture**. That is a naming joke, not a dunk: the serial
fetch-decode-execute bottleneck kept the name; he doesn't get nominative credit for his other,
more parallel architectures. The man whose name is stamped on that bottleneck spent his final
years designing its opposite: a massively parallel grid of tiny cells, each following the same
local rule, out of which he built a **universal constructor** that could print a powered-down
copy of itself, inject its program through an umbilical cord, and send a reset pulse to boot
its child to life.

He designed the whole thing **on paper**, before there were computers to run it on. It first
ran on real hardware decades after his death.

## Three universal constructors, three levels of reality

Von Neumann didn't stop at one self-replicator. He philosophized about three, at ascending
levels of reality and danger
([full text + sources](sources/three-kinds-of-universal-constructors.md)):

1. **Deterministic mathematical** -- the idealized 29 state cellular automaton: brittle,
   synchronous, intolerant of errors. Now digitally implemented and quite harmless; makes a
   great virtual pet, like a digital tribble, but not as cute and fuzzy.
2. **Physical mechanical** -- the kinematic model: a robot swimming in a sea of parts,
   assembling a copy of itself. Robust and error tolerant enough to work in the real world,
   given enough resources. Sci-fi runs on it: "von Neumann probes" at astronomical scale,
   "gray goo" at nano scale.
3. **Probabilistic quantum mechanical** -- machines that mutate, evolve, and model natural
   selection itself. Fascinating and terrifying at the same time (or outside of time). He
   died before he could finish it -- unfortunately, or fortunately, for the sake of humanity.

The p. 99 transcription from *Theory of Self-Reproducing Automata* documenting level three --
probabilistic automata, mutations as random changes of elements, "quantizing natural
selection" -- is typed in at
[sources/three-kinds-of-universal-constructors.md](sources/three-kinds-of-universal-constructors.md).

## The machine room

How the 29 state rule actually works -- construction arm huffman codes, the full cell state
table, the three signal crossing organs (including the beautiful, unconstructible "Garden of
Eden" real time crossing with its spark of life, and Buckley's autoinitializing exclusive-or
that boots itself with self modifying code), and why playing Factorio is uncannily like von
Neumann CA programming:
[sources/29-state-implementation-and-buckley.md](sources/29-state-implementation-and-buckley.md).

Working code and hard-to-find texts:

- [*Theory of Self-Reproducing Automata*](https://archive.org/details/theoryofselfrepr00vonn_0)
  (Burks, ed., 1966) -- p. 312 has the centerfold spread of the 29 state transition rule.
- [Buckley, "Signal crossing solutions in von Neumann self-replicating cellular automata"](https://donhopkins.com/home/documents/automata2008reducedsize.pdf)
  (Automata-2008, pp. 453-503) -- the nuts-and-bolts companion; Wikipedia's citation link is dead.
- [Don's CAM6 implementation (JavaScript)](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)
  and the 2005
  [OpenLaszlo implementation with pie menu editing](https://web.archive.org/web/20110720235050/https://www.donhopkins.com/drupal/node/22).
- [HN harvest](sources/hn/README.md) -- local copies of the unique comments, in case HN goes away.
- Wikipedia: [Von Neumann cellular automaton](https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton) ·
  [Von Neumann universal constructor](https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor)

## Descendants and dissenters

- **Dave Ackley's** Robust First Computing and the Moveable Feast Machine take the opposite
  bet: where von Neumann's CA is synchronous, deterministic, and dies at the first flipped
  bit, the MFM is asynchronous, fault tolerant, and indefinitely scalable. Von Neumann posed
  the reliability question himself in "Probabilistic Logics and the Synthesis of Reliable
  Organisms from Unreliable Components." See [dave-ackley](../dave-ackley/).
- **David Deutsch's Constructor Theory** carries the quantum constructor forward
  ([HN 30956403](https://news.ycombinator.com/item?id=30956403)).
- **Rudy Rucker's** CA Lab / CelLab lineage keeps the playful strain alive. See
  [rudy-rucker](../rudy-rucker/).
- **Alan Kay's "magic" thread:** when Kay drew the good/great/magic line on Quora, Robert
  Swartz nominated von Neumann in-thread, and Don seconded with the three-constructors story --
  see the [magic category recap](../alan-kay/media/quora-recaps/magic-category-and-the-good-great-line.md).

## Show hooks

- The non-von Neumann architecture irony: the best argument that "the von Neumann bottleneck"
  is a name for a moment, not a mind.
- Factorio as gateway drug to CA programming, GPU programming, and data flow thinking --
  a straight line from a 1940s graph-paper design to a game a million people play.
- Glass-box lineage: 29 state CA -> Toffoli/Margolus CAM -> CelLab -> CAM6 -> Micropolis --
  simulation you can open up and rewire, which is the north star of this repo.

[Tribute](memorial.md) · [CHARACTER.yml](CHARACTER.yml) · [sources/](sources/README.md) ·
[Alan Turing](../alan-turing/) · [Dave Ackley](../dave-ackley/) · [Rudy Rucker](../rudy-rucker/)

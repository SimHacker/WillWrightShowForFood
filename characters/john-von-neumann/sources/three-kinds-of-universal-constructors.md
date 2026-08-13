# Three kinds of universal constructors, at three levels of reality

**Source:** Don Hopkins on Hacker News --
[21858465](https://news.ycombinator.com/item?id=21858465) (Dec 2019, on *Can Programming Be
Liberated from the von Neumann Style?*) and
[22738268](https://news.ycombinator.com/item?id=22738268) (Mar 2020, on *Von Neumann Universal
Constructor*). Reposted again on the *Theory of Self Reproducing Automata* thread
([32960377](https://news.ycombinator.com/item?id=32960377), Sep 2022). Transcription from
p. 99 of *Theory of Self-Reproducing Automata* typed in by Don.

---

## The framing

John von Neumann's 29 state cellular automata machine is (ironically) a classical decidedly
"non von Neumann architecture."

He wrote the book on
[*Theory of Self-Reproducing Automata*](https://archive.org/details/theoryofselfrepr00vonn_0)
(completed and published posthumously by Arthur Burks, 1966).

He designed a
[29 state cellular automata architecture](https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton)
to implement a
[universal constructor](https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor)
that could reproduce itself -- **which he worked out on paper, amazingly**.

His concept of self-reproducing mutating probabilistic quantum mechanical machine evolution is
quite fascinating and terrifying at the same time (or outside of time), potentially much more
powerful and dangerous than mere physical nanotechnology "gray goo" and universe-infesting
self replicating von Neumann probes.

## The three kinds

He actually philosophized about **three different kinds of universal constructors at different
levels of reality**:

### 1. Mathematical (deterministic, relatively harmless)

The purely deterministic kind referenced above: an idealized abstract 29 state cellular
automaton, which could reproduce itself with a Universal Constructor, but was quite brittle,
synchronous, and intolerant of errors. These have been digitally implemented in the real world
on modern computing machinery, and they make great virtual pets, kind of like digital tribbles,
but not as cute and fuzzy.

- Don's JavaScript implementation in CAM6:
  [github.com/SimHacker/CAM6](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)
- See [29-state-implementation-and-buckley.md](29-state-implementation-and-buckley.md) for the
  nuts and bolts.

### 2. Physical mechanical (robust, potentially dangerous)

The kind which is robust and error tolerant enough to work in the real world (given enough
resources), and is now a popular theme in sci-fi: the self reproducing robot swarms called
["Von Neumann Probes"](https://en.wikipedia.org/wiki/Self-replicating_spacecraft#Von_Neumann_probes)
on the astronomical scale, or "Gray Goo" on the nanotech scale. (Von Neumann's own version was
the "kinematic model": a robot swimming in a sea of parts, assembling a copy of itself --
discussed in his 1948-49 Illinois lectures, before he switched to the cellular model at
Stanislaw Ulam's suggestion precisely because the kinematic version was too hard to analyze.)

> The von Neumann probe, nicknamed the Goo, was a self-replicating nanomass capable of
> traversing through keyholes, which are wormholes in space. The probe was named after
> Hungarian-American scientist John von Neumann, who popularized the idea of self-replicating
> machines. -- [grey-goo.fandom.com](https://grey-goo.fandom.com/wiki/Von_Neumann_probe)

### 3. Probabilistic quantum mechanical (unfinished)

The kind which could mutate and model evolutionary processes, and rip holes in the space-time
continuum, which he unfortunately (or fortunately, for the sake of humanity) didn't have time
to fully explore before his tragic death.

## The transcription -- p. 99 of *Theory of Self-Reproducing Automata*

> Von Neumann had been interested in the applications of probability theory throughout his
> career; his work on the foundations of quantum mechanics and his theory of games are
> examples. When he became interested in automata, it was natural for him to apply probability
> theory here also. The Third Lecture of Part I of the present work is devoted to this subject.
> His "Probabilistic Logics and the Synthesis of Reliable Organisms from Unreliable Components"
> is the first work on probabilistic automata, that is, automata in which the transitions
> between states are probabilistic rather than deterministic. Whenever he discussed
> self-reproduction, he mentioned mutations, which are random changes of elements (cf. p. 86
> above and Sec. 1.7.4.2 below). In Section 1.1.2.1 above and Section 1.8 below he posed the
> problems of modeling evolutionary processes in the framework of automata theory, of
> quantizing natural selection, and of explaining how highly efficient, complex, powerful
> automata can evolve from inefficient, simple, weak automata. A complete solution to these
> problems would give us a probabilistic model of self-reproduction and evolution. [9]
>
> [9] For some related work, see J. H. Holland, "Outline for a Logical Theory of Adaptive
> Systems", and "Concerning Efficient Adaptive Systems".

## Adjacent threads (Don's HN von Neumann corpus)

Readable local copies in [hn/](hn/README.md). Highlights:

- [hn/30956403-not-just-wolfram.md](hn/30956403-not-just-wolfram.md) -- David Deutsch's Constructor
  Theory (the quantum-constructor idea carried forward): "Please resist giving Steven Wolfram
  solitary credit for anything and everything related to cellular automata."
- [hn/35366971-omega-point.md](hn/35366971-omega-point.md) -- Tipler's Omega Point cosmology,
  reversible computing, and the far future of self-reproducing computation.
- [hn/21858577-robust-first-tour.md](hn/21858577-robust-first-tour.md) -- connecting von Neumann's
  brittle synchronous CA to Dave Ackley's Robust First / Moveable Feast Machine (see
  [dave-ackley](../../dave-ackley/)).
- [hn/22304373-1948-prediction.md](hn/22304373-1948-prediction.md) -- von Neumann, 1948: his own
  approach would fall down; automata will have to allow malfunctions with non-zero probability.
- [hn/17873436-radiation.md](hn/17873436-radiation.md) -- cancer from bomb-test radiation, not
  cellular automata.
- [hn/12174650-not-all-architectures.md](hn/12174650-not-all-architectures.md) -- "Not all of von
  Neumann's architectures were von Neumann architectures."
- [hn/19354538-page-312.md](hn/19354538-page-312.md) -- page 312 of the Burks volume, the
  29-state transition-rule centerfold.

Up: [character README](../README.md) - [sources README](README.md)

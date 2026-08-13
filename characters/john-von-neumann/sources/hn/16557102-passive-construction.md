# Universal construction means passive configurations

**HN:** [16557102](https://news.ycombinator.com/item?id=16557102) -- 2018-03-10 -- on *Elementary Knightship found in Conway's Game of Life*

Umbilical download, Garden of Eden crossings, auto-initializing machines. Includes the Wikipedia 'literary device' quote and Freitas/Merkle on wire-crossing fragility.

---

The Universal Constructor [1] running in John von Neumann's 29 state cellular automata [2] is able to construct passive configurations that aren't "powered up" with excited states in them (encoding information and synchronizing activities).

Once it's done building a machine (like a copy of itself, or anything else), it can connect its construction arm up to the "umbilical" plug of the child (like a usb port for downloading data into its storage loop), switch from "execute instructions" mode to "copy instructions" mode, and loop through its own instructions again, injecting a copy of its program into the child's storage loop, which the child can then start executing and eventually pass on to its own child.

It would be impossible to construct a "powered up" machine -- the signals would leak out into the world from the partially constructed machine and cause havoc. So you have to build a passive machine in the "powered down" state, then activate it by injecting a signal and (possibly) downloading instructions.

There are certain unconstructible "garden of eden" configurations (like a real-time crossing gate that looks and acts like an intersection with synchronized stop lights [3, p. 468, fig 3]) that are possible for God to build with a cell editor, but are impossible for a universal constructor to construct, because there is no practical way to inject and synchronize the signals into the machine after it's constructed [4].

But there are constructible "auto initializing" machines [3, p. 474, fig. 17] with one-time initialization circuits that trigger once then deactivate by firing "explosive bolts" when you power them up, bootstrapping all the internal synchronized signals necessary for the machine to operate. But of course they tend to be larger and more complicated than equivalent unconstructible machines.

[1] https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor

>As defined by von Neumann, universal construction entails the construction of passive configurations, only. As such, the concept of universal construction constituted nothing more than a literary (or, in this case, mathematical) device. It facilitated other proof, such as that a machine well constructed may engage in self-replication, while universal construction itself was simply assumed over a most minimal case. Universal construction under this standard is trivial. Hence, while all the configurations given here can construct any passive configuration, none can construct the real-time crossing organ devised by Gorman.

[2] https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

[3] http://uncomp.uwe.ac.uk/free-books/automata2008reducedsize.pdf

Buckley, William R. (2008), "Signal Crossing Solutions in von Neumann Self-replicating Cellular Automata", in Andrew Adamatzky; Ramon Alonso-Sanz; Anna Lawniczak; Genaro Juarez Martinez; Kenichi Morita; Thomas Worsch, Proc. Automata 2008 (PDF), Luniver Press, pp. 453–503

[4] http://www.molecularassembler.com/KSRM/2.1.4.htm

>2.1.4 Limitations of von Neumann's Cellular Automaton Model

>For instance, one might wish to introduce a new primitive cell state in the system to permit signals to cross without interference. A “wire-crossing” organ can be devised using only the original von Neumann primitive cell types, but this introduces an unnecessary complexity into the machine design process since the organ contains initially active cell states whose creation involves considerable extra care to avoid the propagation of spurious signals. This extra care is especially critical because the cell system, as von Neumann originally constituted it, is highly susceptible to signal errors. (He undoubtedly intended his probabilistic machine model to mitigate this sensitivity and fragility.)

---

Up: [HN harvest index](README.md) - [sources](../README.md) - [character README](../../README.md)

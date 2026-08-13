# Robust First tour: from brittle JvN29 to the Moveable Feast Machine

**HN:** [21858577](https://news.ycombinator.com/item?id=21858577) -- 2019-12-22 -- on *Can Programming Be Liberated from the von Neumann Style?*

Canonical later version of the Ackley/MFM tour (supersedes 15560845 and 14236973). How MFM differs from classical CA, and why that answers von Neumann's own reliability question.

---

I've posted about this before, but it's worth repeating here:

https://news.ycombinator.com/item?id=15560845

DonHopkins on Oct 26, 2017 | parent | favorite | on: Cryptography with Cellular Automata (1985) [pdf]

A "Moveable Feast Machine" is a "Robust First" asynchronous distributed fault tolerant cellular-automata-like computer architecture.
It's similar to a Cellular Automata, but it different in several important ways, for the sake of "Robust First Computing". These differences give some insight into what CA really are, and what their limitations are.

Cellular Automata are synchronous and deterministic, and can only modify the current cell: all cells are evaluated at once (so the evaluation order doesn't matter), so it's necessary to double buffer the "before" and "after" cells, and the rule can only change the value of the current (center) cell. Moveable Feast Machines are like asynchronous non-deterministic cellular automata with large windows that can modify adjacent cells.

Here's a great example with an amazing demo and explanation, and some stuff I posted about it earlier:

https://news.ycombinator.com/item?id=14236973

Robust-first Computing: Distributed City Generation:

https://www.youtube.com/watch?v=XkSXERxucPc

A Movable Feast Machine [1] is a "Robust First" asynchronous distributed fault tolerant cellular-automata-like computer architecture.

The video "Distributed City Generation" [2] demonstrates how you can program a set of Movable Feast Machine rules that build a self-healing city that fills all available space with urban sprawl, and even repairs itself after disasters!

The paper "Local Routing in a new Indefinitely Scalable Architecture" [2] by Trent Small explains how those rules work, how the city streets adaptively learn how to route the cars to nearby buildings they desire to find, and illustrated the advantages of "Robust First" computing:

Abstract: Local routing is a problem which most of us face on a daily basis as we move around the cities we live in. This study proposes several routing methods based on road signs in a procedurally generated city which does not assume knowledge of global city structure and shows its overall efficiency in a variety of dense city environments. We show that techniques such as Intersection-Canalization allow for this method to be feasible for routing information arbitrarily on an architecture with limited resources.

This talk "Robust-first computing: Demon Horde Sort" [4] by Dave Ackley describes an inherently robust sorting machine, like "sorting gas", implemented with the open source Movable Feast Machine simulator, available on github [5].

A Movable Feast Machine is similar in many ways to traditional cellular automata, except for a few important differences that are necessary for infinitely scalable, robust first computing.

First, the rules are applied to cells in random order, instead of all at once sequentially (which requires double buffering). Many rule application events may execute in parallel, as long as their "light cones" or cells visible to the executing rules do not overlap.

Second, the "light cone" of a rules, aka the "neighborhood" in cellular automata terms, is larger than typical cellular automata, so the rule can see other cells several steps away.

Third, the rules have write access to all of the cells in the light cone, not just the one in the center like cellular automata rules. So they can swap cells around to enable mobile machines, which is quite difficult in cellular automata rules like John von Neumann's classic 29 state CA. [6] [7]

Forth, diffusion is built in. A rule may move the particle to another empty cell, or swap it with another particle in a different cell. And most rules automatically move the particle into a randomly chosen adjacent cell, by default. So the particles behave like gas moving with brownian motion, unless biased by "smart" rules like Maxwell's Demon, like the "sorting gas" described in the Demon Hoard Sort video.

In this video "Robust-first computing: Announcing ULAM at ECAL 2015" [8], David Ackley explains why "Robust First" computing and computing architectures like Movable Feast Machines are so incredibly important for scaling up incredibly parallel hardware.

I think this is incredibly important stuff in the long term, because we've hit the wall with determinism, and the demos are so mind blowing and visually breathtaking, that I want to try programming some of my own Movable Feast Machine systems!

[1] http://movablefeastmachine.org/

[2] https://www.youtube.com/watch?v=XkSXERxucPc

[3] http://www.cs.unm.edu/~ackley/papers/paper_tsmall1_11_24.pdf

[4] https://www.youtube.com/watch?v=helScS3coAE

[5] https://github.com/DaveAckley/MFM

[6] https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

[7] https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor

[8] https://www.youtube.com/watch?v=aR7o8GPgSLk

https://news.ycombinator.com/item?id=18497241

DonHopkins on Nov 20, 2018 [-]

Absolutely, their important work foreshadowed and inspired so much great stuff. Also Douglas Engelbart's NLS pioneered many of the ideas of visual programming.

I think spreadsheets also qualify as visual programming languages, because they're two-dimensional and grid based in a way that one-dimensional textual programming languages aren't.

The grid enables them to use relative and absolute 2D addressing, so you can copy and paste formulae between cells, so they're reusable and relocatable. And you can enter addresses and operands by pointing and clicking and dragging, instead of (or as well as) typing text.

Some people mistakenly assume visual programming languages necessarily don't use text, or that they must use icons and wires, so they don't consider spreadsheets to be visual programming languages.

Spreadsheets are a wildly successful (and extremely popular) example of a visual programming language that doesn't forsake all the advantages of text based languages, but builds on top of them instead.

And their widespread use and success disproves the theory that visual programming languages are esoteric or obscure or not as powerful as text based languages.

Other more esoteric, graphical, grid-based visual programming languages include cellular automata (which von Neumann explored), and more recently "robust first computing" architectures like the Moveable Feast Machine.

https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor

Robust-first Computing: Distributed City Generation (Moveable Feast)

https://www.youtube.com/watch?v=XkSXERxucPc

>A rough video demo of Trent R. Small's procedural city generation dynamics in the Movable Feast Machine simulator. See http://nm8.us/q for more information. Apologies for the poor audio!

Programming the Movable Feast Machine with λ-Codons

https://www.youtube.com/watch?v=DauJ51CTIq8

>λ-Codons provide a mechanism for describing arbitrary computations in the Movable Feast Machine (MFM). A collection of λ-Codon molecules describe the computation by a series of primitive functions. Evaluator particles carry along a stack of memory (which initially contains the input to the program) and visit the λ-Codons, which they interpret as functions and apply to their stacks. When the program completes, they transmute into output particles and carry the answer to the output terminals (left).

https://news.ycombinator.com/item?id=21131468

DonHopkins 81 days ago [-]

Very beautiful and artistically rendered! Those would make great fireworks and weapons in Minecraft!
From a different engineering perspective, Dave Ackley had some interesting things to say about the difficulties of going from 2D to 3D, which I quoted in an earlier discussion about visual programming:

https://news.ycombinator.com/item?id=18497585

David Ackley, who developed the two-dimensional CA-like "Moveable Feast Machine" architecture for "Robust First Computing", touched on moving from 2D to 3D in his retirement talk:

https://youtu.be/YtzKgTxtVH8?t=3780

"Well 3D is the number one question. And my answer is, depending on what mood I'm in, we need to crawl before we fly."

"Or I say, I need to actually preserve one dimension to build the thing and fix it. Imagine if you had a three-dimensional computer, how you can actually fix something in the middle of it? It's going to be a bit of a challenge."

"So fundamentally, I'm just keeping the third dimension in my back pocket, to do other engineering. I think it would be relatively easy to imaging taking a 2D model like this, and having a finite number of layers of it, sort of a 2.1D model, where there would be a little local communication up and down, and then it was indefinitely scalable in two dimensions."

"And I think that might in fact be quite powerful. Beyond that you think about things like what about wrap-around torus connectivity rooowaaah, non-euclidian dwooraaah, aaah uuh, they say you can do that if you want, but you have to respect indefinite scalability. Our world is 3D, and you can make little tricks to make toruses embedded in a thing, but it has other consequences."

Here's more stuff about the Moveable Feast Machine:

https://news.ycombinator.com/item?id=15560845

https://news.ycombinator.com/item?id=14236973

The most amazing mind blowing demo is Robust-first Computing: Distributed City Generation:

https://www.youtube.com/watch?v=XkSXERxucPc

And a paper about how that works:

https://www.cs.unm.edu/~ackley/papers/paper_tsmall1_11_24.pd...

Plus there's a lot more here:

https://movablefeastmachine.org/

Now he's working on a hardware implementation of indefinitely scalable robust first computing:

https://www.youtube.com/channel/UC1M91QuLZfCzHjBMEKvIc-A

---

Up: [HN harvest index](README.md) - [sources](../README.md) - [character README](../../README.md)

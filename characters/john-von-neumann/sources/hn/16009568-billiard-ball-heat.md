# Billiard-ball CA: conservation, heat, reversible gates

**HN:** [16009568](https://news.ycombinator.com/item?id=16009568) -- 2017-12-26 -- on *Reversible Computing (2016) [video]*

Why there is no NOT gate in a billiard-ball computer. Fredkin and Toffoli gates. John Walker's CelLab video.

---

Yes, it requires space to store the state required to run the program in reverse, which effectively heats up the space surrounding the computer.

Billiard Ball Cellular Automata conserve mass: particles are never created or destroyed, they just bounce off of each other and static "bumper" cells. Computing by "smoke and mirrors"! Or you could think of them as electrons, but BBCA don't have "wires" like other logical CA like JVN29, just empty space and gas and bumpers.

So you can't have a "not" gate, because it would have to make billiard balls out of nowhere if the input were zero (no billiard balls => many billiard balls). And you can't destroy billiard balls either, so there has to be somewhere for them to go after they're not needed any more. Like sending them flying out into the environment -- effectively generating heat!

When you change the direction of time, they come flying back in from deep space (or bouncing back through a chaotic atmosphere, depending on the temperature of the "environment"), and run the computation in reverse.

The Fredkin Gate and the Toffoli Gate are universal reversible logic gates: you can construct any logical expression with them, and they don't create or destroy billiard balls.

https://en.wikipedia.org/wiki/Fredkin_gate

>The Fredkin gate is a circuit or device with three inputs and three outputs that transmits the first bit unchanged and swaps the last two bits if, and only if, the first bit is 1.

https://en.wikipedia.org/wiki/Toffoli_gate

>[The Toffoli gate] is also known as the "controlled-controlled-not" gate, which describes its action. It has 3-bit inputs and outputs; if the first two bits are set, it inverts the third bit, otherwise all bits stay the same.

>Universality and Toffoli gate: Any reversible gate that consumes its inputs and allows all input computations must have no more input bits than output bits, by the pigeonhole principle. For one input bit, there are two possible reversible gates. One of them is NOT. The other is the identity gate, which maps its input to the output unchanged. For two input bits, the only non-trivial gate is the controlled NOT gate, which XORs the first bit to the second bit and leaves the first bit unchanged.

https://en.wikipedia.org/wiki/Pigeonhole_principle

Here's a cool silent video by John Walker (Fourmilab, Autodesk) explaining Billiard Ball Cellular Automata in CelLab, and a link to the documentation!

https://www.youtube.com/watch?v=esgn0Dz8SOA

>It is possible to perform all logical operations by collisions of perfect billiard balls with fixed objects and one another.  A CelLab ( http://www.fourmilab.ch/cellab/ ) alternating lattice rule ( http://www.fourmilab.ch/cellab/manual/rules.html#Bbm ) models a billiard ball universe where collisions are perfect (albeit following different rules than balls on a table), and the system is reversible.

There are reversible and non-reversible variants of Billiard Ball Cellular Automata, and you can compose reversible CA to get other reversible CA. You can make reversible gas in "random" brownian motion, by changing the direction of the particles "randomly" based on a reversible pseudo-random number generating cellular automata run in parallel. For example, you could use "time tunnel" seeded with randomness as a pseudo random number generator:
https://www.youtube.com/watch?v=FMwHG_8-pOU

But once you compose it with a non-reversible rule, you can't go back! To simulate "diffusion-limited aggregation" based on the brownian motion gas, you have to break reversibility by defining a "frozen" particle that freezes other particles that touch it. That breaks reversibility because there are several ways to get into the same frozen state, and it has no way to reconstruct which of those states preceded the frozen state, or how long it has been frozen. But it looks cool, like ice crystals nucleating around a speck of dust on a window pane!

https://en.wikipedia.org/wiki/Diffusion-limited_aggregation

https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js#L5774

https://www.youtube.com/watch?v=LuvIBOTReFE

JVN29:
https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

---

Up: [HN harvest index](README.md) - [sources](../README.md) - [character README](../../README.md)

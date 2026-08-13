# Toffoli, Margolus, Fredkin, and a spin glass you can run

**HN:** [13506300](https://news.ycombinator.com/item?id=13506300) -- 2017-01-28 -- on *Scientists unveil new form of matter: Time crystals*

Reversible CA lineage with CAM6 spin-glass code and a Time Crystal / Gene Ray joke.

---

Tommaso Toffoli [1] invented the reversible Toffoli Gate [2].

Norman Margolus [3] invented the Margolus Neighborhood [4], which is useful for rotationally symmetrical cellular automata rules [5] like billiard ball cellular automata [6] [7].

Toffoli and Margolus also explored other energy conserving cellular automata like spin glasses [8], which are disordered magnets that store energy in the bonds between atoms.

Edward Fredkin [9] invented reversible second order cellular automata [10], which look back two steps in time, and are useful for simulating the Ising model of ferromagnetism.

Then again, maybe Otis Eugene "Gene" Ray, the "wisest man on earth", caused this article to quantum tunnel through time from April 1 1997 [11] [12].

To play with the following code that implements a spin glass, go here:
http://donhopkins.com/home/CAM6/
then click the square in the upper left, click "Rules", pick the rule "von Neumann Spins Only", and draw in the cells by dragging around with the left button. JavaScript sure cooks these days!

    // ruleFunction_VonNeumann_spinsOnly computes the Spins Only rule
    // for VonNeumann neighborhood lookup table.
    //
    // Cellular Automata Machines, p. 190, section 17.3, Spins Only.
    //
    // This models a spin glass, which is a matrix of atoms with
    // magnetic spins (up or down).
    //
    // https://en.wikipedia.org/wiki/Spin_glass
    //
    // A spin glass is a disordered magnet with frustrated
    // interactions, augmented by stochastic positions of the spins,
    // where conflicting interactions, namely both ferromagnetic and
    // also antiferromagnetic bonds, are randomly distributed with
    // comparable frequency. The term "glass" comes from an analogy
    // between the magnetic disorder in a spin glass and the
    // positional disorder of a conventional, chemical glass, e.g.,
    // a window glass.
    //
    // Spin glasses display many metastable structures, leading to a
    // plenitude of time scales which are difficult to explore
    // experimentally or in simulations.
    //
    function ruleFunction_VonNeumann_spinsOnly(ruleDict, state) {

        // This makes a checkerboard pattern that alternates every
        // step, so we can apply the rule to every other cell every
        // other step. That way we know our four neighbors will not be
        // changing at the same time we are changing.
        var activeSite =
            (state.horiz ^ state.phaseTime) == state.vert;

        // Count how many of our four neighbors are set.
        var sum4 =
                 state.n0 +
            state.w0 + state.e0 +
                 state.s0;

        // When it is our turn to run in this cell (at every other
        // step), then we flip our value if exactly two of our
        // neighbors are up, and two are down. Since energy is stored
        // in two adjacent cells with different spins, we can flip our
        // value without changing the energy of the system, because
        // the perimeter between up and down cells remains the same.
        var result =
            (activeSite
                ? [
                    state.c0,
                    state.c0,
                    state.c0 ^ 1,
                    state.c0,
                    state.c0
                  ][sum4]
               : state.c0);

        return result;
    }

[1] https://en.wikipedia.org/wiki/Tommaso_Toffoli

[2] https://en.wikipedia.org/wiki/Toffoli_gate

[3] https://en.wikipedia.org/wiki/Norman_Margolus

[4] https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js#L4282

[5] https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js#L5636

[6] https://en.wikipedia.org/wiki/Reversible_cellular_automaton#Billiard_ball_computation_and_low-power_computing

[7] https://en.wikipedia.org/wiki/Billiard-ball_computer

[8] https://en.wikipedia.org/wiki/Spin_glass

[9] https://en.wikipedia.org/wiki/Edward_Fredkin

[10] https://en.wikipedia.org/wiki/Second-order_cellular_automaton

[11] https://en.wikipedia.org/wiki/Time_Cube

[12] https://web.archive.org/web/19980629180418/http://www.timecube.com/

---

Up: [HN harvest index](README.md) - [sources](../README.md) - [character README](../../README.md)

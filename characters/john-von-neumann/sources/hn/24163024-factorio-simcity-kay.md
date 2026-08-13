# Factorio, SimCity, and Alan Kay on Rocky's Boots

**HN:** [24163024](https://news.ycombinator.com/item?id=24163024) -- 2020-08-14 -- on *Factorio 1.0*

Will Wright's three-dimension simulation taxonomy (CHM 2003). Factorio belts vs JvN29 arrows. Kay's reply: he tried to get Maxis to make SimCity a rule-based system children could program.

---

Factorio (and also games like SimCity) are not actually pure CA rules, but they combine cellular automata techniques together with many other techniques like system dynamics, etc.

Will Wright gave a great explanation of how simulation games combine different techniques together in three intersection dimensions: Topologies (agents, networks, and layers), dynamics (propagation, growth, grouping, order, allocation, mapping, specialization, and nesting), and paradigms (cybernetics, system dynamics, cellular automata, chaos theory, adaptive systems, network theory).

https://www.youtube.com/watch?v=CdgQyq3hEPo&t=35m50s

>Lessons in Game Design, lecture by Will Wright, Computer History Museum, November 20, 2003.

Maybe the comment I posted about Factorio and CA was this, in the discussion of John von Neumann's 29 state cellular automata rule -- It is a pure CA, and a historically interesting one that he actually designed on paper and wrote about in a book. I compared it to Factorio, in the way Factorio uses conveyor belts in four different directions to direct the flow of items, and JVN29 uses arrows in four different directions to direct the flow of signals. But you can put a lot of different kinds of things on Factorio conveyor belts, but only ones and zeros on JVN29 arrows, since it was designed to be minimal and mathematically rigorous like a Turing Machine, not practical and convenient to program and fun to play like Factorio.

https://news.ycombinator.com/item?id=22727228

>Von Neumann Universal Constructor (wikipedia.org)
90 points by amjd 4 months ago | hide | past | favorite | 29 comments

https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor

https://news.ycombinator.com/item?id=22738598

>[...]

>Factorio players will recognize these tapes of construction instructions as 2D "blueprints" that construction drones use to build patterns of factories and conveyor belts, etc. In Factorio, after your drones have build a blueprint in the unpowered, unsupplied state, you can connect it to the power grid, hook up pipes to deliver fluids, and run conveyor belts in and out of it to deliver resources and products, and it will immediately starts doing its thing. Playing Factorio is uncannily like von Neumann 29 state cellular automata programming, not by coincidence. So it's a great way to get your head around cellular automata programming, gpu programming, parallel programming, queuing systems, and data flow programming in general!

>Factorio Tutorial #20 - Bots, part 1 - Construction robots

https://www.youtube.com/watch?v=kLOyk55uI2Y&t=19m32s

>Factorio just doesn't have the ability to construct cells by spilling items off the end of conveyor belts, or destroy cells with conveyor belts, either. But maybe there's an extension for that! And John von Neumann's 29 state cellular automata doesn't have swarms of construction drones that build and tear down blueprints in parallel like Factorio does, so there are some differences. But the basic idea of grids of cells with conveyor belts carrying items between factories is the same.

Also I wrote some more about JVN32:

https://news.ycombinator.com/item?id=22737079

>The Real Time Crossing (Buckley, p. 457, The real-time crossing organ) is like a road intersection that splits the two crossing lanes, then uses traffic lights to give cars in each pair of lanes alternating turns to cross, and then merges the lanes back together (since each intersection works at 50% throughput, you need to split, use two of them, and merge -- Factorio and Satisfactory players will get what I mean, in terms of conveyor belts, splitters and mergers, and conveyor belt throughput).

Also I asked Alan Kay about Factorio and other games here, and he replied:

https://news.ycombinator.com/item?id=11807250

>DonHopkins on May 31, 2016 | parent | favorite | on: Alan Kay's reading list

>I've heard you say that Rocky's Boots was one of your favorite computer games. Please, off the top of your head, what's your top-n list of inspiring games that you think people learning to program should play?

>I've been playing Factorio [1] [2], which I think would resonate with your love of Rocky's Boots, cellular automata, queuing theory, visual programming, system dynamics and distributed control systems. It's in the spirit of John von Neumann's 29 state cellular automata [3] and universal constructor. [4]

>[1] Factorio: https://www.factorio.com/

>[2] HN Factorio discussion: https://news.ycombinator.com/item?id=11266471

>[3] John von Neumann's 29 state cellular automata: https://en.wikipedia.org/wiki/Von_Neumann_cellular_automaton

>[4] JvN Universal Constructor: https://en.wikipedia.org/wiki/Von_Neumann_universal_construc...

>alankay on June 1, 2016 [–]

>Hi Don

>I think I'm so out of context wrt video games here and now that I can't come up with a worthwhile reply. I liked Rocky's Boots because of the brilliant combination of the content and the idea behind the game play -- and they were well matched up. I liked the idea of its successor "Robot Odyssey" a lot, but advised the TLC folks to use something like Logo for the robot language rather than the Rocky's circuit diagrams (which were now not well matched up to the needs). As you know I really tried to get the Maxis people to make "Sim City" a rule based system that children could program in so they could both understand the generators and to change them (no luck there).

>If I were to look around today, I'd look for something where the underlying content was really "good" for children -- I doubt that cellular automata would be in my top 10 -- and then would also have good to great game play.

---

Up: [HN harvest index](README.md) - [sources](../README.md) - [character README](../../README.md)

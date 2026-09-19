---
title: NeWS Extensions to PostScript
synonyms:
  - NeWS extensions
definition: NeWS window system extensions to the PostScript language.
source: doc/demos/newsext.st0
---

NeWS window system extensions to the PostScript language.

→ Lightweight Processes

→ NeWS schedules many lightweight PostScript processes.

→ They all live together in the NeWS server's address space.

→ They're cheap!

→ Scheduling is non-preemptive.

→ A lightweight process consists of:

→ Graphics context

→ Execution stack

→ Dictionary stack

→ Operand stack

→ Lightweight processes are good for:

→ Servicing events.

→ Managing interactive objects.

→ Pre-processing local input on behalf of the client.

→ Performing background processing.

→ Building interactive graphical user interface toolkits.

→ Interactive animation.

→ And many other thinks too kinky to go into here.

<!-- page -->

→ Events

→ NeWS has an event queue, and a clean virtual event mechanism.

→ Input from hardware devices generates events.

→ NeWS processes can generate events.

→ It's easy to simulated input from virtual devices.

→ Coordinates of events reported in the current coordinate system.

→ NeWS processes express interest in events they want to get.

→ Then they loop waiting for and processing such events.

→ NeWS processes can communicate with each other by sending events back

and forth.

<!-- page -->

→ Canvases

→ Drawing surface.

→ Its own coordinate system.

→ Arbitrarily shaped!!!

→ Shape defined by a PostScript path.

→ Lines, arcs, bezier curves, and conic splines as edges.

→ Holes, and disconnected regions!

→ Shape influences the clipping of graphical output, and the distribution

of input events.

→ Useful as arbitrarily shaped targets.

→ NeWS processes can receive input events whenever the mouse enters,

leaves, clicks, or moves around in a canvas.

→ Natural to use as animated "sprites", using NeWS processes to

periodically blink, move, or paint them.

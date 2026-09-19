---
title: NeWS Extensions to PostScript
synonyms:
  - NeWS extensions
definition: NeWS window system extensions to the PostScript language.
source: doc/demos/newsext.st0
---

NeWS window system extensions to the PostScript language.

→ Lightweight Processes .nl

→ NeWS schedules many lightweight PostScript processes. .nl

→ They all live together in the NeWS server's address space. .nl

→ They're cheap! .nl

→ Scheduling is non-preemptive. .nl

→ A lightweight process consists of: .nl

→ Graphics context .nl

→ Execution stack .nl

→ Dictionary stack .nl

→ Operand stack .nl

→ Lightweight processes are good for: .nl

→ Servicing events. .nl

→ Managing interactive objects. .nl

→ Pre-processing local input on behalf of the client. .nl

→ Performing background processing. .nl

→ Building interactive graphical user interface toolkits. .nl

→ Interactive animation. .nl

→ And many other thinks too kinky to go into here. .nl

<!-- page -->

→ Events .nl

→ NeWS has an event queue, and a clean virtual event mechanism. .nl

→ Input from hardware devices generates events. .nl

→ NeWS processes can generate events. .nl

→ It's easy to simulated input from virtual devices. .nl

→ Coordinates of events reported in the current coordinate system. .nl

→ NeWS processes express interest in events they want to get. .nl

→ Then they loop waiting for and processing such events. .nl

→ NeWS processes can communicate with each other by sending events back

and forth. .nl

<!-- page -->

→ Canvases .nl

→ Drawing surface. .nl

→ Its own coordinate system. .nl

→ Arbitrarily shaped!!! .nl

→ Shape defined by a PostScript path. .nl

→ Lines, arcs, bezier curves, and conic splines as edges. .nl

→ Holes, and disconnected regions! .nl

→ Shape influences the clipping of graphical output, and the distribution

of input events. .nl

→ Useful as arbitrarily shaped targets. .nl

→ NeWS processes can receive input events whenever the mouse enters,

leaves, clicks, or moves around in a canvas. .nl

→ Natural to use as animated "sprites", using NeWS processes to

periodically blink, move, or paint them. .nl

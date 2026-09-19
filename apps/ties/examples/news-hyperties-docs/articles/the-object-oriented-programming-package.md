---
title: The Object Oriented Programming Package
synonyms:
  - class mechanism
definition: A package that implements object oriented programming in PostScript.
source: doc/demos/object.st0
---

Object Oriented Programming in NeWS

→ NeWS uses an object oriented programming package.

→ Provides a Smalltalk-like class mechanism.

→ Works in a PostScript laser printer, too!

→ Uses the PostScript dictionary stack to implement inheritence.

→ Each object is an instance of a class defining its behavior.

→ Customize the UI toolkit, by subclassing predefined classes.

→ Save time and reuse code, by building on top of previous work.

→ The NeWS object oriented toolkit implements menus, windows, buttons,

cycles, message fields, editable text fields, sliders, scroll bars, scrolling text canvases, terminal emulators, and other objects, entirely in object oriented PostScript.

→ The toolkit resides inside the NeWS server, not in its clients.

→ Clients can share code and data structures in the server.

→ The toolkit does not have to be linked into each client.

→ More responsive interaction, and less network traffic.

→ Modular look and feel.

→ Modify and customize parts of the toolkit, independant of

clients that use them.

→ Change the UI without altering, recompiling, or relinking clients.

You can examine the classes defined in the NeWS server, using Bruce Schwartz's Class Browser.

```target
shape: psh-button
to: NeWS/browse/browse.ps
```

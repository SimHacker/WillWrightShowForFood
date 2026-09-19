---
title: The Object Oriented Programming Package
synonyms:
  - class mechanism
definition: A package that implements object oriented programming in PostScript.
source: doc/demos/object.st0
---

Object Oriented Programming in NeWS

→ NeWS uses an object oriented programming package. .nl

→ Provides a Smalltalk-like class mechanism. .nl

→ Works in a PostScript laser printer, too! .nl

→ Uses the PostScript dictionary stack to implement inheritence. .nl

→ Each object is an instance of a class defining its behavior. .nl

→ Customize the UI toolkit, by subclassing predefined classes. .nl

→ Save time and reuse code, by building on top of previous work. .nl

→ The NeWS object oriented toolkit implements menus, windows, buttons,

cycles, message fields, editable text fields, sliders, scroll bars, scrolling text canvases, terminal emulators, and other objects, entirely in object oriented PostScript. .nl

→ The toolkit resides inside the NeWS server, not in its clients. .nl

→ Clients can share code and data structures in the server. .nl

→ The toolkit does not have to be linked into each client. .nl

→ More responsive interaction, and less network traffic. .nl

→ Modular look and feel. .nl

→ Modify and customize parts of the toolkit, independant of

clients that use them. .nl

→ Change the UI without altering, recompiling, or relinking clients. .nl

You can examine the classes defined in the NeWS server, using Bruce Schwartz's Class Browser.

```target
shape: psh-button
to: NeWS/browse/browse.ps
```

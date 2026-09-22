---
title: The stack
synonyms:
  - C FORTH PostScript MockLisp
  - four languages
definition: "The NeWS workstation HyperTIES. C formatted. FORTH interpreted the markup. PostScript drew and interacted. MockLisp authored."
---

The workstation version, on a Sun running NeWS. Four languages, each doing what it was best at. Two of them — NeWS PostScript and UniPress Emacs MockLisp — were written by James Gosling before he wrote Java.

- **C** — `fmt.c`. Text and graphics layout. ~Don Hopkins~.
- **FORTH** — HyperTIES Markup Language, storyboard compiler, browser scripting. Mitch Bradley's Sun FORTH, which later became OpenFirmware.
- **NeWS PostScript** — display lists, ~playground/PopupTarget~ regions, pie menus, embedded applets.
- **UniPress Emacs MockLisp** — YAHTITTIE, the authoring tool. ~William Weiland~'s index manager in C is what the editor completed against.

The storyboard compiler compiled each storyboard into a FORTH word, dumped a binary image, and started up showing pre-formatted pages. Don: "FORTH code that wrote FORTH code that called C code that wrote PostScript code that wrote PostScript code."

They looked at SGML and did not use it: they wanted writability for hypermedia authors. One markup language for content and shared definitions — not one language for markup and another for style.

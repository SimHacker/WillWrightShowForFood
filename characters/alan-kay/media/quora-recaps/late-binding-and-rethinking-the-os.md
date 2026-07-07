# Late binding, Croquet, and rethinking the OS (not "Linux in Smalltalk")

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Sources:** Alan Kay's public **Quora** answers to:
- *"What is the significance of late binding?"*
- *"What will happen if one rewrites the entire Linux using Smalltalk?"* (Kay reframes: *good ways to rethink
  operating systems today*)
- *"What does Alan Kay think about the harmony-oriented programming paradigm?"* (LINDA, Croquet scaling)

**Nature:** Summary with **short verbatim quotes**; verify against Quora. Credit: **Quora**. Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md).

> **Project tie-in:** Croquet/Don correspondence, **Dave Reed**, **LINDA**, MOOLLM encapsulation, send-a-program
> vs. tiny kernel. Pairs with browsers/NeWS recap.

---

## Late binding — flexibility you can remove, not add back

Late binding = desired functionality while retaining **flexibility and safety**. Examples stacked:
- **Software** late-binds how a computer behaves
- Index registers, MMUs, indirection
- **Interpreter** late-binds semantics; **microcode** late-binds hardware
- **Encapsulated objects** late-bind "hows" (methods), expose "whats" (meanings)
- Methods/how-can-be late-bound → **reflection** (Lisp/Smalltalk analyze the system)

Strategic rule: retain as much late binding as possible — **easy to remove degrees of freedom later, nearly
impossible to add them** to early-bound systems.

Smalltalk: message-passing system that **didn't manifest actual messages** unless required; could **simulate
all semantics** and retreat if low levels incomplete/buggy. Dual method sides: semantic left-hand, optional
optimized right-hand — runs correctly with optimizations off.

Deep enemies: **gratuitous dependencies** (more design required in late-bound systems, but pays off).

## "Rewrite Linux in Smalltalk" — wrong question

Kay translates to: **rethink OSes from today + 10-year future**, not port legacy.

Historical anchors:
- **Burroughs B5000** — OS essentials in hardware; first great **capabilities** protection
- **PARC microcode** — 16 program counters, zero-overhead interleaving → replace "OS" with **Smalltalk as real
  objects**; reflect learnings back into microcode
- **Unix/Linus kernel** — praise for minimal protected kernel + user processes (1000 lines); but PDP-11 era vs.
  PARC's different HW/SW bet

Systems thinking: Bertalanffy, Waddington, **Christopher Alexander** *Notes on the Synthesis of Form* —
clustering to minimize inter-module coupling; natural model = **clusters as whole computers** on networks →
**"real objects"** as universal building block (Sketchpad constraints echo here).

**Butler Lampson:** design rules **change every few years** (Moore's Law + learning) — careful what's obsolete
under your nose.

## The computer is the Internet — Reed, Croquet, pseudotime

"Crazy not to think of the computer as the **whole Internet**." Start: **Dave Reed's 1978 MIT thesis** (whole-Internet OS); implementations in **Croquet** / Open Cobalt.

Harmony-oriented architecture answer: Croquet (pseudotime, replicated over Internet) required **many
implement/test/redesign cycles** before scaling — like Internet needing TCP/IP heuristics after simulation;
Smalltalk had **5 designs in 10 years**.

OS redesign picks:
- **CYC-like expert system about systems** for dependency management
- **Pseudotime** (McCarthy, Reed, Jefferson, Lamport) — eliminate race conditions, **world-lines** for capturing
  time on replicated objects
- **LINDA** as coordination metaphor — match via descriptions not domain labels

Tiny kernel on hardware: **protection + allocation of time/space only** — mustn't know about computations;
computations shouldn't know 1st-order where they run. **Interesting language = inter-module language** (Internet
model: agreements on **intercommunication**, not node interiors). Smalltalk was a first pass at inter-module
language "all the way down" without forbidding other mechanisms inside objects.

## Graceful scaling — missing in industry

Kay (systems direction answer): **"graceful scaling"** — proper systems research — **pretty much not found** in
industry. "Systems with integrity" essentially non-existent (Facebook meltdown). 80s OOP-as-ADT **kills graceful
scaling**.

## Questions for Alan (show fodder)

- Is **MOOLLM's directory-as-room** late binding — or early-bound file paths dressed up?
- Croquet today — still the best whole-Internet OS sketch, or stale?
- **LINDA++** as inter-module language for the web — practical or research-only?
- Could a **CYC-about-systems** have prevented the Facebook config crash — or is that the wrong layer?

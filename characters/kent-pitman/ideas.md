# Conversation ideas — Kent Pitman

Topics for one long conversation or several short ones. Each starts from
something Kent wrote or did, so he can take it wherever he likes.

## His own shows

**1. Lisp origin story: from BASIC ANIMAL to the HyperSpec.**
A world "almost devoid of computers", ANIMAL in BASIC, Weizenbaum's class,
MACLISP on ITS, the Pitmanual, Symbolics, X3J13, the HyperSpec, ISLISP. He
has told part of this at LispNYC; a Repo Show can link every artifact as he
goes. (See [`:TEACH;LISP` and the bright 12-year-olds](teach-lisp.md) and [ANIMAL, the Pope, and the apology](animal.md).)

**2. "How easily we were confused."**
Weizenbaum's point about ELIZA, as Kent came to understand it, applied to
LLMs. DOCTOR meets PARRY, then DOCTOR meets a 2026 chatbot through the same
"manual typist". Is a bigger program still missing the point?
(See [DOCTOR, PARRY, and Weizenbaum's point](doctor-and-parry.md).)

**3. Conditions, restarts, and agents that ask before they fail.**
The condition system separates signaling from handling and lets the handler
pick a restart without unwinding the stack. An LLM agent hitting an error is
in the same spot: should it ask a human, retry, or choose among offered
recoveries? Kent's 2001 paper as a design guide for agent error handling.

**4. Special forms, fexprs, and skills as unevaluated context.**
"Special Forms in Lisp" (1980) argued against fexprs. MOOLLM skills are
loaded as text the model interprets, not called as functions, which is
fexpr-like on purpose. Where would Kent draw the line now?

**5. Standards as social engineering.**
X3J13, charters, "out of scope", Lisp1 vs Lisp2 ("RPG and I disagreed
completely"), and making a standard into a hypertext. What a standards
editor knows about getting people who disagree to ship one document.

## Shows he'd make better

- **The ITS / MIT-AI memorial and reunion** with Richard Stallman, Lars
  Brinkhoff, and the Minskys
  ([ITS, MACLISP, and Remembering Marvin, the planned show with Richard Stallman](../../repo-shows/richard-stallman-its-minsky-memorial/README.md),
  and [the seed for a show with Lars Brinkhoff](../../repo-shows/lars-brinkhoff/README.md)). Bring the elevator.
- **Emulation roundtable**: a PDP-10 job mapping a PDP-11 register to buzz a
  door. Does a museum emulator need a door emulator? Kent: "'need to' is the
  most interesting part of this odd sentence."
  ([the emulation roundtable plan](../../repo-shows/emulation-roundtable/README.md);
  [Call me an elevator](elevator-and-door.md) has the story)
- **ANIMAL and The Sims** with Will Wright: per-player feelings, memory and
  consequences in 1978, needs and relationships in 2000.
  ([A Repo Show with Will Wright](../../repo-shows/will-wright-premiere/README.md))
- **Lisp with Peter Norvig and L Peter Deutsch**: style, macros, and the
  1993 "Tutorial on Good Lisp Programming Style" with Guy Steele.
  ([A Repo Show with Peter Norvig](../../repo-shows/peter-norvig/README.md),
  [A Repo Show with L Peter Deutsch](../../repo-shows/l-peter-deutsch/README.md))
- **MOO, Self and MOOLLM** with David Ungar: Kent has said he's interested
  in MOO; in-band programming, prototypes, permissions.
  ([the planned show with David Ungar](../../repo-shows/david-ungar/README.md))
- **Weizenbaum remembered**, with Heinz Lemke, who met Weizenbaum on the
  1969 PIXIE tour at MIT ([Joseph Weizenbaum's memorial page](../joe-weizenbaum/README.md)).

## Small questions worth asking

- Who were DANNY and HIC, who wrote the TV-11 elevator code on 2/13/79?
- How did the duel start? Who taught Kent `EVAL-IN-OTHER-LISP` was possible?
- What did ANIMAL's mail to KMP look like from your end, and how many came?
- The Pitmanual's Saturday Evening and Sunday Morning editions: what
  changed in 24 years?
- What should we have kept from Genera that nobody has rebuilt?
- What should `:TEACH;LISP` look like in 2026?

↑ [Kent Pitman](README.md) · [invitation](invitation.md)

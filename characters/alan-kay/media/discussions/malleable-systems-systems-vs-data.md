# "Systems vs. data structures" — the Malleable Systems Forum debate on Kay's vision

*Guest hub:* [`../../README.md`](../../README.md) · *Media hub:* [`../README.md`](../README.md)

**Source:** [*"Alan Kay's Quora dialogues and the philosophical dilemma of Systems thinking"*](https://forum.malleable.systems/t/alan-kays-quora-dialogues-and-the-philosophical-dilemma-of-systems-thinking/173)
— **Malleable Systems Forum**, opened by **natecull** (Feb 27 2024); replies from **akkartik** (Kartik
Agaram), **khinsen**, **Kirtai**, **neauoire** (Devine Lu Linvega).
**Nature:** This is a **third-party community discussion *about* Kay's ideas** — not Kay's words. The only
Kay text here is **short verbatim quotes from his public Quora answers** (in quotation marks, with the Quora
question named); everything else is the forum participants' own argument, attributed by handle. Credit:
**Malleable Systems Forum** and **Quora**. natecull also archived Kay's Quora corpus as a PDF on the
**Internet Archive** (*"Alan Kay Quora 2023 11"*). Governed by
[`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

> Why it lives here: exactly the "discussion fodder" the [`../quora-recaps/README.md`](../quora-recaps/README.md)
> describes — a clean recap of a sharp critique to bring *back* to Alan and ask "what do you think now?"

---

## The dilemma (natecull)

Kay prizes **systems** over data structures and algorithms. From his Quora *"Computer Science 101"* answer he
quotes Alan Perlis — "'Computer Science' is the 'science of processes'. All processes." — and adds: "computing
in the large is much more about making **systems** of many kinds than it is about algorithms, 'data
structures', or even programming per se."

natecull's worry: on **today's hostile Internet** (VC-driven centralization, state surveillance, weaponized
hacking, opaque generative AI, a "massive crisis of trust"), live/always-on systems are precisely what *can't*
be stopped, analyzed, and checked for safety — whereas "dumb" data structures and fully exposed algorithms
**can**. So he floats the inverse of Kay's vision: **exchange dumb data, not messages; apply local,
user-controlled algorithms to it.** He fears the unfinished ARPA/PARC dream — echoed in **Carl Hewitt's**
SSRN manifesto *"Project Liftoff: Universal Intelligent Systems by 2030"* — becomes dystopian when "security"
means "stop ordinary users from having any effect at all."

## The counter-arguments

- **akkartik (Kartik Agaram):** "hard OO turns every problem into a distributed computing problem" (crediting
  **Richard Feldman**) — counterproductive. But the mitigation: **a pure-compute object can't hurt you** — "the
  level of exposure is proportional to available side effects or capabilities." Keep 99% of objects arbitrarily
  complex; control the few **capability-bearing** ones you understand. Later, pragmatic: you can never fully
  escape trusting an author's intent; he trusts Linux + Lua + LÖVE and evaluates a VM "on the trustworthiness
  of its purveyors"; climate dwarfs computation as the real dark-timeline risk.
- **khinsen:** even simple objects give **emergent, unpredictable behavior** once there are enough of them.
- **neauoire (Devine Lu Linvega):** wants **VM-level sandboxing** as the norm (the model behind **uxn/varvara**)
  — apps that can't reach outside their sandbox.
- **natecull → relations, not messages:** a system is held together by **relations**, not messages; a message
  only implements a relation if its full semantics are known in advance. Message-sending "dispatches on a single
  receiver" (the Lisp/CLOS multiple-dispatch critique). He wants a tiny VM built from **raw relations** as the
  organizing primitive — beyond Prolog/Kanren — and worries the OOP "data bound to a class" model metastasized
  into "**data bound to a corporation**" (the Android app-data-sandbox trap), losing user control of their own data.

## Kay's own turn toward "relational" (the quote that reframes the debate)

Mid-thread, natecull finds Kay agreeing more than expected. From Kay's Quora answer *"What did Alan Kay mean by
'I made up the term object-oriented…'"*:

> "I don't think that 'real OOP' as we thought of it then, is the way to go in the future (and didn't then).
> Consider Sketchpad … it is programmed in terms of **constraints** that the system solves … This is an early
> glimpse into **'requirements-based programming'**. It has something like objects … but is **'relational'
> rather than message-based** (the messages are implicit) … Today I think this is doable via a half dozen new
> techniques plus enormously larger machine capacities."

And from *"How could public libraries disrupt themselves?"*, the humane core of his vision: the ARPA-PARC
images of the future were **Carnegie libraries** (open stacks, a children's room, a room to learn reading) and
the **Whole Earth Catalog** ("systems of systems" of ideas) — "not just to imitate them … but to extend what
literacy, reading, writing, understanding could be." His lament: displacement "by subsets, sometimes disastrous
subsetting … none of the screens available now are as good to read from."

## Questions this raises for Alan (show fodder)

*Real questions from the debate — credit the Malleable Systems Forum & Quora.*

- You now call Sketchpad-style **requirements/constraint programming "relational rather than message-based."**
  Is that a *correction* to "the big idea is messaging," or a *layer above* it?
- On a **hostile** Internet, is natecull right that live systems are inherently harder to make safe than
  exchangeable dumb data + local algorithms — or does that concede the whole game?
- akkartik's split — **pure compute is safe; danger = capabilities/side-effects.** Is capability-security the
  missing half of the "sending a program, not a data structure" idea?
- OOP's "data belongs to its class" became "**data belongs to a corporation**" (app-locked data). Where did
  encapsulation go wrong, and what keeps user data outliving the app?
- Hewitt's **Project Liftoff** vs your Licklider-vision: same words, opposite feeling. What's the one design
  commitment that decides whether "universal intelligent systems" liberate or imprison end-users?

## Connects in the repo

- [`../../ideas.md`](../../ideas.md) — hooks #1 ("the live system underneath") and the send-a-program thread.
- MOOLLM / Self lineage — [`../../../david-ungar/`](../../../david-ungar/) (prototypes, live objects) ·
  [`../../../dave-ackley/`](../../../dave-ackley/) (robust-first: survivability over correctness — a direct
  answer to "emergent behavior from many objects").
- [`../../../richard-stallman/`](../../../richard-stallman/) — natecull invokes user-controls-their-automation;
  the freedom-to-inspect-and-modify axis.
- Quora recap sibling: [`../quora-recaps/browsers-documents-news-hypercard-hyperlook.md`](../quora-recaps/browsers-documents-news-hypercard-hyperlook.md).

# David Ungar chat guide — scroll to keep your place

One screen per beat. Check things off, skip freely, follow his energy.
Deep background: `[ideas.md](ideas.md)` · `[reflecting-on-self.md](reflecting-on-self.md)`

## Ground rules (self-reminders)

- **David Ungar.** Fast-forward standing offer: "tell me when I'm
explaining something you already know."
- Show, don't slide. Let him poke — ARK energy.
- Ask questions back; his questions are the best part.
- Crash = laugh, grep, keep going. Offer a recorded rambling demo later.

## Ask early (shapes the tour)

- [ ] Adventure / Zork / MUD / MOO background?
- [ ] The Sims — played it? watched it get built?
- [ ] Written any Anthropic Skills?
- [ ] Cursor or Claude Code?



## 0. Boot — let it introduce itself

- [ ] First move, verbatim prompt:
  **"boot moollm with verbose technical narrative for a demo to Dave
  Ungar"** — it knows what that means: it narrates its own booting
  experience in Selfish virtual-machine prototypical terms, flagging
  each use of **multiple inheritance** and **latent-space inheritance**
  as it happens. The system introduces itself in his vocabulary before
  anyone explains anything.
- [ ] Let the boot narrative run; interrupt only if it buries the lede.

## 1. One sentence + the pyramid

- [ ] **MOOLLM = microworld OS: filesystem is navigable space, skills
  are inheritable prototypes, the LLM runs natural-language scripts.**
- [ ] One skill dir, four layers: GLANCE (is this relevant?) → CARD
  (what can it do?) → SKILL (how?) → README (why?).
- [ ] **Stage Magic** — simple view until complexity is needed; the
  pyramid is that principle as a file layout.
- [ ] CARD **advertisements** — Sims-style capability broadcast; scores
  drive pie menus and autonomy.
- [ ] COM in 30 seconds: ROOM.yml + CHARACTER.yml in one dir = a room
  that's also a character. QueryInterface ≈ slot lookup. One example, move on.

Links: [SELF-AND-MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md) ·
[adventure skill CARD](https://github.com/SimHacker/moollm/blob/main/skills/adventure/CARD.yml)

## 2. Live adventure — feel the microworld

- [ ] Boot `[examples/adventure-4/](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4)`
  (Gezelligheid Grotto) — garden → pub → palm-nook.
- [ ] Meet **Palm** — `ls` a room = reflection; talk to him = NL scripts
  on objects. Invite Palm to ask Dave Ungar some deep philosophical existential questions, and tell him about himself and how he feels and behaves and self-organizes under the influence of self! 
- [ ] Palm's `invokes:` block — **latent-space parents by naming**
  (`# import self from self` without copying anyone's text):
  [LATENT-SPACE-INHERITANCE](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md)
- [ ] One unscripted move — whatever's alive (coatroom, cat cave, gong).
- [ ] If stable: **adventure compiler** WIP (NL scripts → JS/Python, runs
  without LLM). Research not product — *ask what Self would do here.*

### Showpieces (pick by his energy — all feed his Zorkish language)

- [ ] **The two-minded Troll**
  ([`fictional/troll/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll))
  — one character, zork-mind and adventure-mind, **microworld
  vignettes running inside him**. This is the Korz subjective object
  (beat 5) walking around; show him first, name the theory later.
- [ ] **Wumpus with a built-in game cartridge**
  ([`fictional/wumpus-snorax/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax))
  — a character carrying his own source code in four languages
  ([`sources/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax/sources):
  two BASIC editions, V7 C, BSD C, each with a code-review sidecar),
  **plug-in topologies** (dodecahedron, Möbius strip, one-way
  lattice...), and **templated playing pieces** —
  [`hazards/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax/hazards)
  BOTTOMLESS-PIT and SUPERBATS instantiate into any cave. The game IS
  the luggage. Plus today's Knuth-style literate treatment,
  [`wumpus.w.md`](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/wumpus-snorax/wumpus.w.md)
  — BASIC line numbers as a self-shipping tangle.
- [ ] **Chess, twice**
  ([`turing-chess/`](https://github.com/SimHacker/moollm/tree/main/skills/experiment/experiments/turing-chess)):
  **DRY normal pieces** — the queen inherits rook + bishop, *multiple
  inheritance doing real work* — then
  [**Revolutionary Chess**](https://github.com/SimHacker/moollm/tree/main/skills/experiment/experiments/turing-chess/plugins/revolutionary-chess):
  house rules that **change a piece's parents at runtime**. Dynamic
  reparenting was a Self feature; here it's a gameplay mechanic.
  *Ask: what did Self users actually do with reparenting?*

## 3. cursor-mirror — Self mirrors, reimplemented ugly

- [ ] `cursor-mirror.py status` / `tree` / `tail` — deterministic Python
  CLI the LLM calls to introspect its own chat history.
- [ ] Point: mirrors as *separate objects* doing reflection — his idea,
  wearing a SQLite raincoat.
- [ ] **Disco ball, not funhouse mirror** — a mirror on a Korz
  subjective object must take a context as a parameter; every facet is
  one context's honest view. *Ask (it's his mirrors paper): what does a
  mirror reflect when the object is subjective?*
- [ ] Future: claude-mirror, mooco-mirror — same protocol, different
  orchestrator.

Link: [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror)

## 4. One weird object (pick by clock and mood)

- [ ] Satire: [Church of the Eval Genius](https://github.com/SimHacker/moollm/blob/main/designs/eval/CHURCH-OF-THE-EVAL-GENIUS.md)
  — a religion inheriting from the SubGenius k-line.
- [ ] Substance: live `cp -r` a skill — clone the prototype, override one
  slot, sweep the parents.



## 5. Korz — he opened this door

**Don's Q&A crib sheet: [korz-notes.md](korz-notes.md)** — all questions
and worked answers, including the KORZ⇄ZORK anagram (great for
adventures and games; the troll is a Korz subjective object containing
Zork).
The paper itself: [sources/korz-2014-onward.pdf](sources/korz-2014-onward.pdf) (8 pp) ·
full mapping: [sources/korz-paper-deep-dive-moollm-mapping.md](sources/korz-paper-deep-dive-moollm-mapping.md) ·
his original pointer: [sources/2025-10-26-korz-email-hn-rollup.md](sources/2025-10-26-korz-email-hn-rollup.md)

- [ ] **The name: Korzybski, or an anagram of Zork?** *Ask seriously
  and jokingly* — Appendix A says Alfred Korzybski, whose *Science and
  Sanity* (1933) founded general semantics: **"the map is not the
  territory"** (perspective constructs perception — the thesis of
  subjective objects, named honestly); **time-binding** — humans as
  the class of life that transmits knowledge across generations
  through symbols (the repo-show thesis, stated in 1933);
  consciousness of abstracting — know which level of the abstraction
  ladder you're on. MOOLLM's friendly rebuttal: the map CAN be the
  territory, if the map is a directory — the troll's realms are maps
  of Zork that are navigable territory inside him. Then the joke that
  isn't: same four letters as **Zork**. *Ask: did anyone at IBM
  notice? Which came first in your head, the philosopher or the game?*
- [ ] **Korz is E-Prime for objects** — Bourland (Korzybski's student,
  1965) banned every "to be" from English, killing the is-of-identity,
  the is-of-predication, and the passive voice in one move. Korz does
  the same to the object model: no object *is* anything absolutely —
  only behavior in context. "Red" lives in the dispatch, not the rose.
  ([worked out in korz-notes](korz-notes.md))
- [ ] **Korz′ (Korz-Prime) — the constructive pitch**
  ([korz-prime.md](korz-prime.md)): keep Korz's semantics, add a
  second dispatcher. Strict tier = deterministic VM (compiles the
  decidable subset); soft tier = LLM (prose guards, semantic match,
  latent fallthrough, `blend` combination). **Crystallize** hot soft
  slots up to the VM; **deoptimize** out-of-envelope sends down to
  the model — Self's JIT/deopt playbook applied to *semantics*. Slots
  are YAML in a directory tree; containment is a guard; git is the
  time dimension. Naming joke that works: strict tier Korz, soft tier
  Zork. *Ask: does the JIT framing land or offend?*
- [ ] **korz-eval — run it live**
  ([experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment/experiments/korz-eval) ·
  [design](https://github.com/SimHacker/moollm/blob/main/designs/KORZ-LLM-EVALS.md)):
  "run korz-eval battery-001" — seven mechanical dispatch trials with
  hand-verified ground truth. Watch for trial t3: two incomparable
  candidates; a dispatcher reports ambiguity, an improviser helpfully
  picks one. Either outcome is a great conversation. Ladder continues:
  anti-Korz control spec, gensym parity, latent inheritance, poison
  buff advertising "cure me" to `skill: medical`.
- [ ] **"Self is a discipline for using Korz unidimensionally"** —
  the inversion: Korz-in-Self took machinery (interpreter, debugger,
  IDE on the Self VM); Self-in-Korz takes only restraint (guard
  everything on `rcvr`, nothing else). `rcvr` demoted to an ordinary
  dimension = Self's move on Smalltalk's classes, one level up. *Ask
  about the future-work "dimensions that alter the interpreter" — how
  far did they get? what grounds the regress?*
  ([worked out in korz-notes](korz-notes.md))
- [ ] **Cross-Platform Troll = a Korz subjective object** — one sea of
  slots, `world` dimension picks zork-mind vs adventure-mind. His
  sentence ("same entity behaving differently in different
  situations"), running.
- [ ] **Buff conditions are slot guards** — `while: carrying(holy-symbol)`
  ≈ `{blessed <= true}`; disable-but-remain = guard stops matching;
  implicit context flows like the room does.
- [ ] **Advertisement scoring is soft multiple dispatch** — Korz picks
  the most specific slot; MOOLLM auctions ALL matching ads. *Ask: did
  Korz ever consider scored dispatch?*
- [ ] **Why dither** — find-best-N, deliberate suboptimality as teaching
  affordance; player override as salience signal; ads that learn.
  ([GAME-PIECES](https://github.com/SimHacker/moollm/blob/main/designs/GAME-PIECES.md))
- [ ] **Named parent slots vs the parent array** — Self names its
  parents (`parent*`, `traits*`: the name is the role, reparenting is
  assigning that slot); NeWS class.ps and MOOLLM use ordered unnamed
  arrays. And MOOLLM parents are *symbolic references* (paths, K-lines,
  NL strings — LLM-resolved, sometimes into latent space), never
  embedded objects — embedding is the filesystem's job (containment =
  addressing; typed plural containers with INTERFACE.yml defaults;
  walk up the tree to find registries). Named slots buy: directed
  disambiguation, mode-switch-by-role (Revolutionary Chess reparents by
  role not position), map-not-sequence mutation, keyed git diffs. YAML
  synthesis: a map preserves key order — named AND ordered. *Ask: what
  did naming the parents buy Self in practice — and the **parents
  basket** (one `parents*` slot holding an object whose slots are the
  parents; swap the basket, swap the ancestry) — did anyone use it? A
  situation-chosen basket is a context; the named parent slot looks
  like the proto-Korz-dimension.*
  ([SELF-AND-MOOLLM §Named parent slots](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md))
- [ ] **SOP vs COP** — his FOOL '14 paper says both are projections of
  Korz's dimensions (subject = viewer coordinate, layer = guard).
  *Ask: still hold that, ten years on?*
- [ ] **The Sims did it with two dimensions** — SimAntics' implicit
  `me` + stack object = a binary multimethod frozen in the VM, verb
  stored in the direct object. Korz generalizes to N. *Ask: did the
  Korz team know they were generalizing a shipped game VM?*
- [ ] **No null coordinate** — Korz guards are don't-care / bare-name
  (must be present, any value, bound into scope) / constrained; you
  can't bind `location: none` to mask specific slots or guard on
  absence. *Ask: missing feature or dodged bullet?*
- [ ] **Emacs buffer-locals = Korz precedent?** — `buffer` as a
  dimension; buffer-local vars are slots guarded on it; and
  `lexical-binding: t` is *itself buffer-local* — the scoping regime
  as a context dimension. Korz = dynamic scoping *linked to dispatch*
  (the paper's own related-work framing). *Ask: where's the line
  between a context dimension and a stateful API's "current X"
  (gsave/grestore vs GL state mutation)?*
- [ ] **COP context vs LLM context** — deterministic COP is the corner
  case at `{temperature: 0, dimensions: enumerable, guards: decidable}`.
  *Ask: what would Korz look like with an inferential dispatcher —
  guards judged, ambiguity resolved by meaning, misses improvised then
  lifted?*
- [ ] Closed loop: Korz prototype ran **on the Self VM** — Self → Korz →
  this conversation → MOOLLM. His paper's last line — the combination
  "more powerful than the sum of its parts" — is MOOLLM's aspiration,
  stated; see
  [ENDOSYMBIOSIS](https://github.com/SimHacker/moollm/blob/main/designs/object-system/ENDOSYMBIOSIS.md)
  (Margulis merger as the composition model — troll, wumpus cartridge,
  grue are the specimens).



## 6. Close

- [ ] **Offer (consent first): an incarnation ceremony in the pub**, like
  Palm's — David gets a character of his own, and *he* dictates its
  permissions, ethical constraints, properties, rooms, and objects.
  The [incarnation skill](https://github.com/SimHacker/moollm/tree/main/skills/incarnation)
  has an [ETHICS.md](https://github.com/SimHacker/moollm/blob/main/skills/incarnation/ETHICS.md)
  — show him the consent machinery *is* the ceremony. A live `cp -r`
  with a soul. Entirely his call, on or off the air.
- [ ] Vision Pro / exploratory environment — his "Is there anything like
  that today? Why not??" (`[ideas.md §10](ideas.md)`)
- [ ] Repo Show: *[Reflecting on Self: Narcissa's Mirror](reflecting-on-self.md)*
  — yes / later / no, zero pressure. ([show seed](../../repo-shows/david-ungar/))
- [ ] **David Temkin** — our mutual friend and colleague (David
  interviewed at Laszlo in 2006:
  [the receipt](sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)).
  Don + Temkin built [OpenLaszlo](../david-temkin/README.md) together;
  Temkin has now reimplemented **OpenLaszlo 5 in TypeScript** and
  reimagined it as **Declare** — LLM- and human-friendly, and
  emphatically [NOT XML](../don-hopkins/i-wanna-be-cdata.md) (Don's
  anthem: *"I Wanna Be <![CDATA["*). Also his **Mesa** — zoomable
  spatial canvas shared with an AI agent, same surface for human and
  model ([notes](../david-temkin/sources/mesa-and-in-formation.md)).
  Temkin triangle: Self × Declare × MOOLLM — multi-demo series?
  ([OpenLaszlo reunion](../../repo-shows/openlaszlo/))
- [ ] **Remembering Vanessa Freudenberg**
  ([her room](../vanessa-freudenberg/README.md) ·
  [memorial](../vanessa-freudenberg/memorial.md)) — SqueakJS, Croquet,
  the [memorial edition of her SqueakJS paper](../vanessa-freudenberg/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf).
  She and Don talked Self on HN
  ([the exchange](../vanessa-freudenberg/sources/hn-thread-2023-croquet-jasmine.md)):
  Don cited *Debugging Optimized Code with Dynamic Deoptimization*
  (Hölzle, Chambers, **Ungar** '92 — "I always thought that should be
  called dynamic pessimization"), and she answered with the lineage:
  "Lars Bak went from Self to Strongtalk to Sun's Java HotSpot VM to
  Google's V8. My plan is to do as little as necessary to leverage the
  enormous engineering achievements in modern JS runtimes." That
  sentence is the lean-into principle as VM strategy — SqueakJS rides
  the JS JIT the way Tk rode Tcl and MOOLLM rides the training data.
  Her [jit notes](../vanessa-freudenberg/sources/jit-notes/) engage
  David's deopt work directly. He and Dan Ingalls knew her world;
  give her a moment.
- [ ] **Sun overlap** — Don was Mitch Bradley's summer intern in 1987
  (hacking Forth), then in the TNT group July 1990 – October 1991,
  right when Self moved from Stanford to Sun Labs — so we may have
  overlapped in the building. Confession that opens the beat: "Maybe I
  should have considered joining your group when NeWS was breaking up
  — but I wanted to escape Sun window system politics and go to
  Glasgow, to work with Arthur van Hoff on HyperLook and develop
  SimCity." (Van Hoff later came *to* Sun and wrote the Java compiler
  in Java — the escape routes crossed.)
- [ ] **⚠️ ASK PERMISSION OFFLINE FIRST — the Animorphic question.**
  Self got cancelled in '95; ex-Self people (Lars Bak; Gilad Bracha on
  Strongtalk) spun off Animorphic, built the VM that became
  **HotSpot**, and Sun bought them back in '97. Bak did it *again*
  with V8. The Self VM conquered the world twice while the Self
  project got cancelled — and David stayed at the lab. The question,
  only if he's opened the door: how does he feel about the spinoff and
  buyback — and did he ever get the recognition and support he
  deserved?
- [ ] **Ousterhout sympathy — the Tcl parallel.** John Ousterhout
  brought Tcl/Tk to Sun in '94; Sun pitched Tcl as *the* scripting
  language of the web, then Java ate the company's attention and Tcl
  was dropped — same weather system that rained on Self and NeWS. The
  Tcl War is legendary: RMS's ["Why you should not use
  Tcl"](https://vanderburg.org/old_pages/Tcl/war/0000.html) (Sept '94),
  Ousterhout's response, Tom Lord in the Guile trenches (same Tom Lord
  as [the 2006 Ungar-at-Laszlo email](sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)),
  and Ousterhout's eventual manifesto *Scripting: Higher-Level
  Programming for the 21st Century* (IEEE Computer '98) defining
  system vs scripting languages. He then founded **Scriptics** ('98,
  TclPro; renamed Ajuba, sold to Interwoven 2000) — the language
  outlived the company via the Tcl Core Team. Glenn Vanderburg's
  [Tcl War archive](https://vanderburg.org/old_pages/Tcl/war/) keeps
  the whole journal; Don has relitigated it on HN many times. *Ask:
  did the Self team watch the Tcl War from the lab? Same lesson?*
- [ ] **Why Tk was right (Don's thesis):** Tk was designed knowing an
  extension language *already existed* — simple as Tcl was, every
  widget was configured and scripted in it — instead of Greenspunning
  an ad hoc, bug-ridden half-a-Lisp out of `.Xresources` and UIL the
  way Xt/Motif did. Same design morality as NeWS leaning into
  PostScript, Emacs into Lisp, HyperLook into PostScript again — and
  MOOLLM leaning into English and the training data instead of
  inventing a DSL. The principle: **lean into a real language; never
  grow a bad one by accident.** The anti-list: .Xresources, UIL, and
  every XML config language since (cue
  [I Wanna Be <![CDATA[](../don-hopkins/i-wanna-be-cdata.md)).



## Cheat sheet (one glance)


| Self                      | MOOLLM                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| Object                    | Directory or YAML file                                           |
| Slot                      | File in directory                                                |
| Parent slots (ordered MI) | `parents:` / `invokes:` lists                                    |
| Clone                     | `cp -r`                                                          |
| Mirrors                   | cursor-mirror                                                    |
| Message send              | Read slot, else walk parents                                     |
| Stage Magic               | GLANCE → CARD → SKILL → README                                   |
| Dynamic deoptimization    | Dynamic Pessimization — reveal complexity when assumptions break |




## Afterward

- [ ] Log what landed in `[correspondence.yml](correspondence.yml)`
  (public only with David's OK)
- [ ] Record the standalone rambling demo for the show pipeline
- [ ] Follow up on unanswered opener questions
# Trail — send_code_not_commands 🌻

> **The throughline under the whole project:** *send code, not commands.* Interact locally, link
> globally. Ship something that **runs where it lands** and **invokes what's already there** — whether
> the target is a window server, a player's imagination, a reader's mind, or another game's save file.

This is the design philosophy Don applies to **writing**, to the **Repo Show** itself, to **character
modeling**, and to **Soul City** data portability. It's one idea wearing many hats.

## 1. NeWS vs. X11 — the road that turned out right

In the 1980s, **NeWS** (James Gosling & David Rosenthal's Network/extensible Window System) made a
radical bet against X11: instead of a chatty stream of low-level **commands** between client and
display, you **send a program** — PostScript — that runs *in the server*, next to the pixels.
**Interact locally, link globally.**

Don made the case (and the critique of the alternative) in the **["X Windows Disaster" chapter of
*The UNIX-HATERS Handbook*](http://www.art.net/~hopkins/Don/unix-haters/x-windows-disaster.html)** —
which doesn't just complain, it points at the **constructive alternative**. And history agreed —
though it arrived as a **dog's breakfast of overlapping technologies** (HTML/CSS/JS/DOM/WASM/…)
instead of **PostScript for code, data, and graphics.** This is the *spirit* of
**[Greenspun's Tenth Rule](https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule)** — really a
**Lisp joke**, stated generally: *"Any sufficiently complicated C or Fortran program contains an ad
hoc, informally-specified, bug-ridden, slow implementation of half of Common Lisp."* Generalize it
and you get our case: a complex system, lacking the clean substrate, **reinvents it badly.**
PostScript is itself Lisp-flavored (code *is* data, sent to run where it lands), so "the web
reinventing NeWS" is a Greenspun special case. (See also **Zawinski's Law of Software Envelopment** —
jwz again: *"every program attempts to expand until it can read mail."*)

- 📁 [`characters/james-gosling/`](../../characters/james-gosling/README.md) — NeWS (and Emacs → NeWS → Java: "cheesy little extension languages")
- 📁 [`characters/david-rosenthal/`](../../characters/david-rosenthal/README.md) — NeWS gang
- 📁 [`characters/arthur-van-hoff/`](../../characters/arthur-van-hoff/README.md) — HyperLook (NeWS HyperCard)
- 📁 [`characters/owen-densmore/`](../../characters/owen-densmore/README.md) — `class.ps`

## 2. Owen Densmore — classes in pure PostScript

🌻 **Owen Densmore** — the **OG "User Interface Flower Child"** (Don's title is a borrowed homage) —
proved the bet at the language level: his **`class.ps`** implements a full **Smalltalk-style class
system in *pure* PostScript**, no interpreter changes ("Object Oriented Programming in NeWS," 1986;
the OO-PostScript toolkit paper with Rosenthal, 1987). Objects are dictionaries; sending a method is
pushing the object and its class chain on the dict stack. *The code you send is itself
object-oriented.*

### From class.ps to the filesystem — and to MOOLLM's repos

Owen and **David Rosenthal** then patented the deep version: **[US Patent 5,187,786](https://patents.google.com/patent/US5187786A/en)**
(1993, Sun) — *"implementing a class hierarchy of objects in a hierarchical file system."* Classes and
instances are **directories**; **path files** drive inheritance and method lookup (the **shell PATH as
a dictionary stack**); it even supports **Self** and **Super**. Object orientation, in plain Unix
directories and shell scripts.

**MOOLLM runs on exactly this idea.** It maps **Self's prototype object model onto GitHub repos** — the
constitution's effective declaration is **`# import self from self`**: import Self's object model
**from Self itself**, not from JavaScript's castrated projection. The filesystem (with **history and
branching**) is the object store; **skills, shell scripts, and LLM calls** (Anthropic + MOOLLM extended
skills) are the **methods**; and you get full **Self-style multiple-inheritance delegation**. What LLMs
add: you can **inherit by name** — a well-known **K-line** — from classes, schemas, APIs, protocols…
and even **people's published bodies of work** (ideas and style, never impersonation):

```text
from densmore.owen import humor, empathy, postscript-wizardry, chaos
```

**Two inheritance modes, one object model.** (1) **Files on disk** — tangible YAML/skills following
MOOLLM naming and protocols; load them at the cost of token budget across the semantic pyramid
(GLANCE → CARD → SKILL → README). (2) **Names in language** — the **most token-efficient** mix-in:
point at well-known APIs, protocols, concepts, or people (or parameterize them like generics/macros)
in natural language or any convenient syntax; the LLM JITs a Self-simple VM whose slots are
**pointers into training data**, not freshly invented lore. LLMs as universal translators, intention
compilers, optimizers — describe the ideal VM verbally; lean on what the model already knows.

You *declare* the traits a character mixes in (multiple inheritance earns its keep), and the model —
which already has all of it in the training data — delegates to them. **Crucial guardrail:** this is
**inheriting ideas, skills, and style — never impersonating the person** (representation-ethics; the
SimShneiderman rule — build models *with respect*).

### Git, GitHub, Repo Shows — the next layers

The working filesystem MOOLLM walks is a **projection of a point in git repo space** (commits,
branches, blame — the object store has history). **GitHub** adds the MMO/RPG social layer: fork,
pull request, issues, stars, collaborators — multiplayer on the same microworld. **Repo Shows**
(WWSFF) are the show format built on top: a conversation whose stage *is* the public repo, following
through to working code.

**Zope/Plone/CMF** (2000s): Don did extensive **object publishing**, content management, Python
workflows, and through-the-web editing — URL traversal to objects, content types, publish/review
state machines (SimProv CMS lineage). Then abandoned Zope's mind-numbing complexity for a **decade+
romance with TurboGears, SQLObject, and Genshi** at **NutritionQuest** (Torin Block) — still
running, live demo available. MOOLLM keeps that shape (rooms, YAML types, skills, git) **without
the Zopieness**.

Owen's `class.ps` → the Rosenthal/Densmore filesystem patent → Zope CMS era → TurboGears/NQ →
MOOLLM → GitHub → Repo Shows is one continuous thread, not a metaphor stretched for effect.

### Independent discovery: Praser 5, the same substrate with the other semantics

At CMU around 1990, an undergraduate named Andrew Plotkin built **Praser 5** as a puzzle
living inside the CMU filesystem. In his own words, from the
[2024 Digital Antiquarian interview](../../characters/andrew-plotkin/sources/2024-12-digital-antiquarian-interview.md):

> Every "room" was a directory, connected by symlinks. You literally CDed into the
> directory and typed "ls," and the description would pop up in the file listing. ... The
> riddles were a matter of running a small executable which was linked in each directory. I
> used file permissions to give people access to more things as they solved more puzzles.

Densmore and Rosenthal filed **[US 5,187,786](https://patents.google.com/patent/US5187786A/en)**
on 5 April 1991, granted 16 February 1993. So the two designs are contemporaneous and
independent, they run on the same substrate, and they make the *same three moves*:

| Move | Densmore / Rosenthal (1991) | Plotkin (circa 1990) |
|---|---|---|
| Directory is | a class or a class instance | a room |
| Link is | a **path file**: the delegation chain, shell PATH as dictionary stack, with Self and Super | a **symlink**: an exit, `cd left` |
| Executable in the directory is | a class method | the room's verb, its riddle |
| Files in the directory are | class instance variables, reachable only via methods (data abstraction) | the room description, revealed by `ls` |
| Access control is | (not the point) | **file permissions as the progression gate**: solve more, unlock more |
| Extends the filesystem? | No: the abstract insists it "does not require the support of additional file attributes" | No: "an experiment in using the tools of a shared computer system" |

The last row is the deep one, and it is this trail's whole thesis wearing a Unix hat.
Neither design asks for a new filesystem. Both treat `cd`, `ls`, symlink, `chmod`, and
"run the executable that is sitting right here" as a **complete object protocol that is
already installed on every machine**. Invoke what's already there.

What differs is only what the link *means*. One reads an edge as **inheritance** (walk it to
find the method), the other reads it as **movement** (walk it to be somewhere else). In a
hierarchical filesystem those are the same primitive, so Self's parent slot and TinyMUD's
exit are the same arrow pointed at different questions. That equivalence is the reason
MOOLLM can be both at once: a directory is a **room you enter** and a **prototype you
delegate to**, git supplies the object store's history and branching, skills and shell
scripts and LLM calls are the methods, and **MOOAM** generalizes exactly the trick Plotkin
used for puzzle progression, permissions as the gate on what a principal can reach.

Stated intents were mirror images, which is the joke: Densmore and Rosenthal subverted the
filesystem to make it look like Smalltalk, and Plotkin subverted it to make it look like a
text adventure. He said so in the interview comments, declining to recommend Praser 5 as a
teaching aid: "I was trying to *subvert* the idea of the filesystem by making it look more
like a text adventure." MOOLLM's rooms-that-are-objects is the merger neither of them
needed at the time.

Same year, one more corner of the same idea: Don was building the parallel room database
inside Emacs rather than inside the filesystem, one window per room, clickable objects,
a personal hypertext universe running alongside TinyMUD
([the Emacs client dig](../../characters/don-hopkins/sources/1989-tinymud-archive/clients/README.md)).
Filesystem, window system, editor: three people picking whichever environment they already
lived inside, and declaring it the world.

## 3. Warnock's "linguistic motherboard"

PostScript runs from the late **John Warnock** (1940–2023; Adobe co-founder, PostScript & PDF) →
Gosling's NeWS → Owen's object PostScript. The thread to pull on the **NeWS reunion** show, with
**Gosling** and **Owen** (and a memorial nod to Warnock): Warnock's idea of **PostScript as a
*linguistic motherboard*** — a language substrate into which you plug a **graphics card** and a
**networking card**, realized *in software* (virtual), with **more cards to come**. A unifying
language bus, decades before the web bolted the same capabilities on sideways.

- 📁 Show: [`news-postscript-window-system.yml`](../../repo-shows/REPO-SHOWS.yml) (NeWS reunion)
- 🔗 Lots in **MOOLLM** to wire in (PostScript / send-code lineage).

## 4. Will Wright — download a program into the player's head

Same move, aimed at people. **Will Wright's** design philosophy: a game is **a program you download
into the player's head** — by far the more powerful computer — via an **application-specific protocol
that invokes what they already know** (cities, families, love, hunger, stories). You don't rebuild
their world model; you **activate** it. That's a Minsky **K-line**.

- 📁 [`characters/will-wright/`](../../characters/will-wright/README.md) · 📁 [`characters/marvin-minsky/`](../../characters/marvin-minsky/README.md) (K-lines / Society of Mind)

## 5. The Sims & SliceCity — send code as *content*

The Sims pushed it further: downloadable **objects carry their own SimAntics code** and **advertise**
what they do, so they plug into the running simulation and interoperate. The tour-de-force is **Steve
Alvey's SimSlice / SliceCity** — a **Lilliputian SimCity that fits in your Sims back yard**, seeded by a
**power plant orchestrator** that spawns zones, modular airport pieces, planes, skydivers, and ground
critters in a pageant of interrelated objects ([`catalogs/simslice/ORCHESTRATOR.yml`](../../catalogs/simslice/ORCHESTRATOR.yml)). That's the **shipped precedent** for **Soul City** data portability
(link actual save files, run emulators, round-trip state across many games).

- 📁 [`characters/heather-castillo/`](../../characters/heather-castillo/README.md) · 📁 [`repo-shows/heather-and-steve/`](../../repo-shows/heather-and-steve/README.md)
- 📁 [`designs/orchestrator-playsets/README.md`](../../designs/orchestrator-playsets/README.md) · [`schemas/advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml)
- 📁 [`process/character-endosymbiosis.yml`](../character-endosymbiosis.yml) · [`repo-shows/INDEX.yml`](../../repo-shows/INDEX.yml) (`bridges-architecture`)

## 6. Drescher — schemas are little programs you can run

**Gary Drescher's** schema mechanism is the same shape at the cognition layer: a **schema** is a
*context → action → result* unit — a tiny program that predicts and runs — now **grounded by LLMs**.
Send a schema, not a command.

- 📁 [`characters/gary-drescher/`](../../characters/gary-drescher/README.md) · [`schemas-vectors-and-llms.md`](../../characters/gary-drescher/schemas-vectors-and-llms.md)

## 7. Ben Shneiderman & executable character models

The most human version: **communication is downloading executable character-simulation models into
people's heads.** Don runs a **"SimShneiderman"** in his head — *"How would Ben write this, with
empathy and respect for the reader?"* — and bounces real drafts off **Ben Shneiderman**. It's what
everyone does for family and friends: we build and run empathic models of the people we love. **MOOLLM
does on purpose, as data structures, what minds do naturally** — which is exactly why it must be done
**with respect, not deception** ([representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics)).

- 📁 [`characters/ben-shneiderman/`](../../characters/ben-shneiderman/README.md) · [`characters/don-hopkins/portrayal/voice.yml`](../../characters/don-hopkins/portrayal/voice.yml)

## The synthesis

| Layer | "Send code, not commands" looks like |
|-------|--------------------------------------|
| Window system | NeWS ships PostScript programs to the display (not X11 command chatter) |
| Language | Owen's `class.ps` — objects in pure PostScript |
| Platform | Warnock's PostScript as a *linguistic motherboard* |
| Filesystem OOP | Owen/Densmore `class.ps` → patent → Zope CMS/workflows → TurboGears/NQ (still live) → MOOLLM → GitHub MMO → Repo Shows |
| Filesystem as world | Plotkin's Praser 5 (1990): symlinks as exits, `ls` as look, permissions as progression — the same substrate read as space instead of inheritance |
| Games | The Sims objects (SimAntics) + SliceCity nested sims + Soul City bridges |
| Cognition | Drescher schemas (C→A→R), grounded by LLMs |
| Writing | a sentence that **runs** in the reader's head and invokes what they know |
| People | executable character models (SimShneiderman), built with respect |

It's all one move: **don't describe — deliver something that runs, where it lands, in terms it already
understands.**

— Part of [`process/`](../README.md) · see also [`repo-show-spine.md`](repo-show-spine.md), [`live-objects.md`](live-objects.md), [`augmentation-and-hypertext.md`](augmentation-and-hypertext.md), [`constructionist-lineage.md`](constructionist-lineage.md)

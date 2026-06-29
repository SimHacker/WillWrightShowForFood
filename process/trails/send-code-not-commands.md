# Trail — send_code_not_commands 🌻

> **The throughline under the whole project:** *send code, not commands.* Interact locally, link
> globally. Ship something that **runs where it lands** and **invokes what's already there** — whether
> the target is a window server, a player's imagination, a reader's mind, or another game's save file.

This is the design philosophy Don applies to **writing**, to the **Repo Show** itself, to **character
modeling**, and to **Simopolis** data portability. It's one idea wearing many hats.

## 1. NeWS vs. X11 — the road that turned out right

In the 1980s, **NeWS** (James Gosling & David Rosenthal's Network/extensible Window System) made a
radical bet against X11: instead of a chatty stream of low-level **commands** between client and
display, you **send a program** — PostScript — that runs *in the server*, next to the pixels.
**Interact locally, link globally.**

Don made the case (and the critique of the alternative) in the **["X Windows Disaster" chapter of
*The UNIX-HATERS Handbook*](http://www.art.net/~hopkins/Don/unix-haters/x-windows-disaster.html)** —
which doesn't just complain, it points at the **constructive alternative**. And history agreed: the
web eventually reinvented "send code, interact locally, link globally" as **AJAX** — but as a **dog's
breakfast of overlapping technologies** (HTML/CSS/JS/DOM/WASM/…), each, per **Greenspun's Tenth
Rule**, an *ad-hoc, informally-specified, bug-ridden, slow* reimplementation of half of something we
already had clean — instead of **PostScript for code, PostScript for data, and PostScript for
graphics.**

- 📁 [`characters/james-gosling/`](../../characters/james-gosling/) — NeWS (and Emacs → NeWS → Java: "cheesy little extension languages")
- 📁 [`characters/david-rosenthal/`](../../characters/david-rosenthal/) — NeWS gang
- 📁 [`characters/arthur-van-hoff/`](../../characters/arthur-van-hoff/) — HyperLook (NeWS HyperCard)
- 📁 [`characters/owen-densmore/`](../../characters/owen-densmore/) — `class.ps`

## 2. Owen Densmore — classes in pure PostScript

🌻 **Owen Densmore** — the **OG "User Interface Flower Child"** (Don's title is a borrowed homage) —
proved the bet at the language level: his **`class.ps`** implements a full **Smalltalk-style class
system in *pure* PostScript**, no interpreter changes ("Object Oriented Programming in NeWS," 1986;
the OO-PostScript toolkit paper with Rosenthal, 1987). Objects are dictionaries; sending a method is
pushing the object and its class chain on the dict stack. *The code you send is itself
object-oriented.*

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

- 📁 [`characters/will-wright/`](../../characters/will-wright/) · 📁 [`characters/marvin-minsky/`](../../characters/marvin-minsky/) (K-lines / Society of Mind)

## 5. The Sims & SliceCity — send code as *content*

The Sims pushed it further: downloadable **objects carry their own SimAntics code** and **advertise**
what they do, so they plug into the running simulation and interoperate. The tour-de-force is **Steve
Alvey's SimSlice / SliceCity** — a **Lilliputian SimCity that fits in your Sims back yard**, a real
SimCity running *inside* The Sims. That's the **shipped precedent** for **Simopolis** data portability
(link actual save files, run emulators, round-trip state across many games).

- 📁 [`characters/heather-alvey/`](../../characters/heather-alvey/) · 📁 [`repo-shows/heather-steve-alvey/`](../../repo-shows/heather-steve-alvey/)
- 📁 [`process/character-endosymbiosis.yml`](../character-endosymbiosis.yml) · [`repo-shows/INDEX.yml`](../../repo-shows/INDEX.yml) (`bridges_architecture`)

## 6. Drescher — schemas are little programs you can run

**Gary Drescher's** schema mechanism is the same shape at the cognition layer: a **schema** is a
*context → action → result* unit — a tiny program that predicts and runs — now **grounded by LLMs**.
Send a schema, not a command.

- 📁 [`characters/gary-drescher/`](../../characters/gary-drescher/) · [`schemas-vectors-and-llms.md`](../../characters/gary-drescher/schemas-vectors-and-llms.md)

## 7. Ben Shneiderman & executable character models

The most human version: **communication is downloading executable character-simulation models into
people's heads.** Don runs a **"SimShneiderman"** in his head — *"How would Ben write this, with
empathy and respect for the reader?"* — and bounces real drafts off **Ben Shneiderman**. It's what
everyone does for family and friends: we build and run empathic models of the people we love. **MOOLLM
does on purpose, as data structures, what minds do naturally** — which is exactly why it must be done
**with respect, not deception** ([representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics)).

- 📁 [`characters/ben-shneiderman/`](../../characters/ben-shneiderman/) · [`characters/don-hopkins/portrayal/voice.yml`](../../characters/don-hopkins/portrayal/voice.yml)

## The synthesis

| Layer | "Send code, not commands" looks like |
|-------|--------------------------------------|
| Window system | NeWS ships PostScript programs to the display (not X11 command chatter) |
| Language | Owen's `class.ps` — objects in pure PostScript |
| Platform | Warnock's PostScript as a *linguistic motherboard* |
| Games | The Sims objects (SimAntics) + SliceCity nested sims + Simopolis bridges |
| Cognition | Drescher schemas (C→A→R), grounded by LLMs |
| Writing | a sentence that **runs** in the reader's head and invokes what they know |
| People | executable character models (SimShneiderman), built with respect |

It's all one move: **don't describe — deliver something that runs, where it lands, in terms it already
understands.**

— Part of [`process/`](../) · see also [`repo-show-spine.md`](repo-show-spine.md), [`live-objects.md`](live-objects.md), [`augmentation-and-hypertext.md`](augmentation-and-hypertext.md), [`constructionist-lineage.md`](constructionist-lineage.md)

---
status: draft
character_id: norman-margolus
public: true
audience: "Norman Margolus (as the intended audience) — and anyone who wants to learn"
about: "Don's CAM6 simulator: what it is, its Forth heritage, and what Don made with Norman's magic"
see_also:
  - ../don-hopkins/cam6-cellular-automata-machine.md
  - ../../repo-shows/norman-margolus/SHOW.yml
  - ../../characters/norman-margolus/invitation.md
---

# What I Made With Your Magic — the CAM6 Demo, for Norman

*A public draft written **to** Norman Margolus, and readable by anyone. Norman may edit, correct,
or ask for removal at any time.* · [Portrayal standards](../../schemas/portrayal-standards.yml)

Norman —

You and Tommaso wrote the book (*Cellular Automata Machines*, MIT Press, 1987) and built the machine (**CAM-6**). I read your book like a bible with color plates.

I first played with a CAM-6 when Pete Dilworth brought one to a science fiction convention, and we hacked it in Forth all night. Later I made a pilgrimage as a tourist to the MIT AI Lab, and your wife walked in on Pete Dilworth and I playing in the dark on the CAM-6 in your office at NE43, our faces glued to the screen. Unflappable, she turned on the light to find something she needed, and said bye bye, and turned the light out when she left. She sure got it!

Since I couldn't take it home with me, I wrote a software emulator in C, and compatible Forth rule table compiler / simulation orchestrator in Mitch Bradley's Sun Forth, and then spent years playing on top of it, porting it to different platforms, developing live performance interfaces for painting with overlapping CA, and rendering the cells as animated SimCity tiles as DRM.

This is the guided tour of that — the demo I made **for you as the audience**, written down so it can be run, checked, and continued in the open.

- **Watch the demo (made expressly for you, gets extremely deep and technical, and shows lots of FORTH code, which others may make of what they wish):** [https://www.youtube.com/watch?v=LyLMHxRNuck](https://www.youtube.com/watch?v=LyLMHxRNuck)
- **Run it live:** [https://donhopkins.com/home/CAM6](https://donhopkins.com/home/CAM6) 
- **Read the insane monolithic source with its own object system:** [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)
- **Don-side writeup:** [cam6-cellular-automata-machine.md](../don-hopkins/cam6-cellular-automata-machine.md)

---



## The one-sentence version

I built a **CAM6 simulator** that is **software-compatible with your CAM-6 hardware and the code examples** — book Forth rules compiled to lookup tables in Sun Forth, those tables imported into JS, then rules and compiler rewritten in JS — and I kept re-implementing the *same idea* across four decades of languages, because the interesting part was never the language. It was the **rules and lookup tables and hardware**.

---



## The trick, in your words

Everything in CAM-6 comes down to one move: **don't compute the rule in the inner loop — compute it
once for every possible neighborhood and store the answers.** Concatenate the neighbor bits into an
index, look up the new cell state. The hardware does this at video rate; my simulator does the same
thing in software.

That means **rule *definition* can be as slow, high-level, and expressive as you like** — it only
runs at compile time. The inner loop is always just a table read. This is the whole reason your Forth
layer could be so luxurious: it was a *rule compiler*, not a *rule interpreter*.

So the architecture has always been three layers:

```
  high-level rule language   →   lookup table   →   fast executor (hardware or software)
  (Forth, then JS, next TS)      (the artifact)      (CAM-6 chip / CAM6.js inner loop)
```

The middle box — the table — is the contract. Everything above it is fashion. Everything below it is
plumbing. **The table is the thing that stays true.**

---



## Layers of iteration (and reimplementation of the *idea*, not the code)

I have the receipts for this one:

1. **x86 Forth on the CAM6 floppies.** Disk images of Toffoli & Margolus's shipped stack.
2. **C emulator + Mitch Bradley's Sun Forth.** Book-compatible Forth rules compiled to **saved lookup
   tables**; C runs the hardware simulation (Open Firmware lineage Forth).
3. **C++, then Python.** Re-hosted; same table contract.
4. **JavaScript —** `CAM6.js` **(today).** **Imported** the Forth-compiled lookup tables, then rewrote
   **rules and the rule compiler in JS** — easier and better. No embedded Forth in the shipped browser
   stack; JS-Forth in the repo is only a **possible extension**.
5. **TypeScript — next.** A type-safe, self-describing rewrite (more on that below).

The point isn't the ports. The point is **feedback and iteration of feedback and iteration itself** —
each layer reads the previous one, keeps the table contract, and passes the description forward.
**A file description through a file descriptor. Streams of streams.** The rule flows from your book,
through Forth, through a table, through C, through JS, out to a screen, into a video made for you,
back into this repo, and out again to whoever runs it next. *(That "streams of streams / handles on
handles" idea is a whole OS design space — I mapped it out in
[streams-of-streams-fd-passing-zero-copy.md](../don-hopkins/streams-of-streams-fd-passing-zero-copy.md):
fd passing, Mach ports, and zero-copy GPU surfaces are exactly how you'd gang modular CA layers with
no copies.)*

---



## Show me the Forth (then show me the JS)

From your book (§3.1) — **Life uses `8SUM`**, not `9SUM`. **`8SUM`** counts the eight Moore
neighbors (excluding `CENTER`); **`9SUM`** includes the center cell and shows up in other rules
(Brain, Vote, etc.). The book defines `8SUM` explicitly, then picks the new state from a
**nine-entry table** indexed by neighbor count:

```forth
\ 8SUM — count live Moore neighbors (book §3.1)
: 8SUM  ( -- count )
  NORTH SOUTH WEST EAST
  N.WEST N.EAST S.WEST S.EAST
  + + + + + + + ;

\ LIFE — two tables: dead center vs live center
: LIFE
  CENTER 0= IF
    8SUM { 0 0 0 1 0 0 0 0 0 }   \ dead: born only when count = 3
  ELSE
    8SUM { 0 0 1 1 0 0 0 0 0 }   \ live: survive when count = 2 or 3
  THEN
  >PLNO ;
```

*(The book also uses **`MAKE-TABLE`** with procedural rule words — e.g. `: PARITY ... ;` passed to
`MAKE-TABLE` — a different idiom from Life's declarative `8SUM { ... }` tables. See §7.6.)*

And here is the **same idea** in `CAM6.js` — a JS "neighborhood function" plays the role of the Forth
rule word, and the engine runs it across all neighborhoods to generate the **identical table**
(representative — the real code is in [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)):

```js
// Conway's Life as a neighborhood function; the engine bakes it into the same lookup table.
function life(cell, n, s, e, w, ne, nw, se, sw) {
  const sum = n + s + e + w + ne + nw + se + sw;
  const alive = cell & 1;
  return alive ? (sum === 2 || sum === 3) : (sum === 3);
}
```

The Forth `make-table` and the JS table-builder are doing the exact same job: **turn a readable rule
into a table of answers.** I didn't translate the Forth line-by-line — I replaced the **Forth DSL and
its table compiler with JS**, and even built a **modular macro system** for defining structured,
parameterized, *layered* rules (compose sub-rules, plane masks, phases) that compile down to one flat
table. The executor never knows the difference.

---



## Who JITs the jitter? (a Connections detour)

*Cut, James-Burke style, between the parts that don't know they're related.*

In this world, **Forth is a shader language.** The rule you write is the shader; the **TTL circuitry
on the CAM-6's PC card — chips you could buy at Radio Shack — executed it like a GPU**, through a
**lookup table that mapped directly to the hardware**, the way **bitslice microcode** or parallel GPU
instructions do. The topology and scale were just wildly different: *much* smaller and simpler. In
its essence, a **256-byte lookup table** — 8 bits of neighborhood in, 8 bits of state out — and
**that's ALL you need** to capture a huge space of general-purpose CA rules, including **tracking
video** and **ganging multiple CAM-6 cards in parallel as connected layers.** (That framing is mine —
the essential kernel, not the whole CAM-6 datapath.)

Now the "shader" is **JavaScript**, and here's the punchline: **V8 JITs it into machine code.** The
readable rule compiles to a table; the loop that reads the table gets compiled, at runtime, to native
instructions. So — **who JITs the jitter?**

Pull that thread and it runs straight back to work you know the neighborhood of. V8 is fast because of
techniques born in **Self** (David Ungar & Randall Smith, Sun/Stanford): **maps / hidden classes**,
**polymorphic inline caches**, **adaptive optimization with dynamic deoptimization**, and
**generational GC**. Self → **Strongtalk/Animorphic** (Urs Hölzle, **Lars Bak**) → Sun's **HotSpot**
JVM; Lars Bak then carried the lineage into **V8**. The same ideas seeded **Java's HotSpot** and
**.NET's CLR**. So my CA "shader" runs at speed today because a 1980s **Smalltalk-descended object
VM** learned how to compile dynamic code on the fly.

The cut closes where it opened: **Radio Shack TTL → GPU shaders → Forth threaded code → microcode →
V8's JIT → Self's inline caches → back to a 256-byte table a kid could wire up.** The **table is the
still point**; everything orbiting it — hardware, Forth, JS, a JIT descended from Self — is the *same
idea* wearing the costume of its era. *(Don's [David Ungar](../david-ungar/README.md) show is the
place to run this loop live.)*

---



## Your DLA is running right now

Straight off **p. 167, §15.7** — the **Margolus-dendrite** rule — I have a
**diffusion-limited aggregation** running live on the **Margolus-neighborhood** engine, on the
same lookup-table contract Sun Forth compiled from the book. Gas particles random-walk via block partitioning; when a
walker touches the aggregate, it **sticks**; branching, coral-like crystals grow. It's a direct,
live-runnable Margolus artifact — and a natural bridge to my
[Musical Gas granular-CA synth](../don-hopkins/musical-gas-granular-ca-synth.md), where every
sticking event can fire a grain of sound so the crystal *sings itself*.

---

## Shared memory — C bangs pixels, PostScript paints them

**HyperLook SimCity** and the **CAM-6 engine** both sat on the same **NeWS client/server library**
I wrote: **C code writes the framebuffer** (SimCity tiles, CA cell planes) into **shared memory**;
**PostScript in the NeWS server** reads that memory and **renders** it — cut/paste between the live
simulation and the HyperLook graphics editor. The **CAM-6 playground** on HyperLook went further:
**multiple zooming views** of the same running field, garish tiled backgrounds from live cells, and a
**lava-lamp window** — live bubbling CA clipped into a lamp-shaped PostScript mask. SimCity drove that
library into existence (pie menus, sound mixer, multi-display TCL/Tk came along for the ride).

**X11 SimCity** later used the **X Shared Memory Extension** when available (local, same machine) and
**fell back to plain X11 protocol** when SHM wasn't there or the display was remote — still playable
over the network, just without the local SHM fast path.

→ [`../don-hopkins/hyperlook-news-postscript-simcity.md`](../don-hopkins/hyperlook-news-postscript-simcity.md)



## A question for the room (and especially for Lars)

Is my CAM6 engine an **emulator** or a **simulator**?

- The **hardware** was a *simulator* — it simulates a cellular universe, no emulation involved.
- My engine **emulates that simulator**, so it's an *emulator of a simulator* — which makes it a
simulator too. At what level does the distinction even matter?
- And the **Forth layer** is its own onion: the Forth DSL + table compiler is *simulating the ability
to (efficiently) program CA rules in Forth*. The **lookup table** is the output that the real
hardware and the software executor both run efficiently. I then **replaced the Forth DSL and
compiler with JS** — same table, different front end.

I think the honest answer is "**yes, all of the above, and the table is where the argument
dissolves**" — but I'd love to hear **[Lars Brinkhoff](../lars-brinkhoff/README.md)** (emulation of
old machines is his native tongue) and you referee it. It's a great, live, whiteboard-able argument.

---



## Where it wants to go: chapter playgrounds, built ground-up

You already gave me your blessing to take **chapters from *Cellular Automata Machines*** and build
**interactive playgrounds** around particular sections and rules — thank you for that. I could do it
by **stripping down, focusing, and repainting** the existing CAM6 code around one section at a
time... but honestly, I think it's **easier to do it right from the ground up than to break down the
monolith.** The current code is a gnarly, honest **monolith** — lovely bones, ugly joints. So **Act 2
of the show is the design conversation**: what does a **modular, chapter-sized** CAM6 want to be?

- **Pick a chapter, live.** We choose a section together and build the playground for it on stream. My
bias: the **physical simulations** — **billiard-ball logic**, **spin glasses / Ising-style energy
models**, lattice gases — *especially* the ones that live on your **Margolus neighborhood** (block
partitioning is what makes the momentum-conserving, reversible physics *work*). You explain **why
they're interesting**; I make them playable.
- **Modular by construction — but not lookup-table-only.** The **table contract** mattered for CAM-6
  hardware and Sun Forth; **`CAM6.js` today is high enough on the stack** that we often **code rules
  directly in JavaScript** — no lookup table required. Rules can be **much more sophisticated**: extra
  inputs, **parameters** wired to **menus, sliders, and checkboxes** in the UI, runtime tweaking while
  the sim runs. *(The monolith already does this; the old **stringy XML-based templating** for composing
  rules was a step — Act 2 wants something **more powerful and flexible** than that.)*
- **Layered, templated, composable rules.** Stack effects in the **same cell word** — classic book
  moves plus things CAM6 already ships:
  - **ECHO** (your book §3.2) — shift old bit-planes up so Life (etc.) leaves **motion trails**; **seven
    bits of diffused, dithered echo overlay** on top is beautiful.
  - **Heat** — run **heat diffusion in the upper 4–7 bits**, **CA in the lower bits**, **leak** CA
    activity into the diffusion layer ("heat pollution") so the two interact.
  - **RISCA-style opcodes**, plane masks, phased rules — **template + compose** many configurations from
    the same building blocks. A chapter playground = **small graph + prose**, not a monolith fork.
  When a rule *does* fit the classic mold, it can still **compile to lookup tables** for speed — but
  that's optional, not the ceiling.
- **The visual front end: Snap!, not from scratch.** Inspired by **eToys → Scratch →
  [Snap!](https://snap.berkeley.edu/) → [Sandspiel Studio](https://studio.sandspiel.club/)**, I could
  build a whole new visual CA language — but the **best solution is to just integrate the engine with
  Snap!** (Jens Mönig & Brian Harvey). It's JavaScript, in the browser, extensible with custom blocks,
  and a *real* language (first-class procedures, Scheme semantics) — so a CA rule becomes a **block
  palette** a student can remix, and I get the whole editor for free. (This is one of four engines I
  want behind Snap! — see [Snap! visual engines / fundable goals](../don-hopkins/snap-visual-engines-fundable-goals.md).)
- **Gang the layers.** Multiple rule-planes as **connected layers** (gang CAM-6 cards) — parameterized
  JS rules + heat/echo overlays + **zero-copy** handoffs between stages; see
  [streams-of-streams / zero-copy notes](../don-hopkins/streams-of-streams-fd-passing-zero-copy.md).
  Act 2 target: **typed, composable rule graph** (TypeScript?) replacing XML string templating.

---



## For the show: weaving the archive

A lot of this is already on the record — we don't have to start cold. The plan is to **weave it
async**: recent solo/dual/group clips plus archival video, contextualized into one coherent story,
then re-opened as a **Repo Show anyone can contribute to and learn from**:

- **The demo I made for you** — [https://www.youtube.com/watch?v=LyLMHxRNuck](https://www.youtube.com/watch?v=LyLMHxRNuck) (the spine of the story).
- **Archival threads to locate + verify** (candidates, not confirmed citations): an early-1990s CAM6
demo and a **Long Now**-style talk on computation-as-physics. *(Norman / Long Now can confirm exact
links; flagged so we don't cite from memory.)*
- **A CA looping fest** with the neighbors: **[Stephen Wolfram](../stephen-wolfram/README.md)** (a new
kind of science, the ruliad), **[Dave Ackley](../dave-ackley/README.md)** (robust-first computing, the
Movable Feast Machine, indefinitely scalable hardware — CA as *architecture*), **[Dave Tristram](../dave-tristram/README.md)**
(graphics + CA hacking), and of course **[Will Wright](../will-wright/README.md)** and **[Brian Eno](../brian-eno/README.md)**
(generative systems as an art medium), plus **[Jim Crutchfield](../jim-crutchfield/README.md)** and
**[Scott Draves](../scott-draves/README.md)**.

---



## Reference links (for anyone reading along)

**Wikipedia:** [Cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) ·
[Block cellular automaton / Margolus neighborhood](https://en.wikipedia.org/wiki/Block_cellular_automaton) ·
[Reversible cellular automaton](https://en.wikipedia.org/wiki/Reversible_cellular_automaton) ·
[Billiard-ball computer](https://en.wikipedia.org/wiki/Billiard-ball_computer) ·
[Margolus–Levitin theorem](https://en.wikipedia.org/wiki/Margolus%E2%80%93Levitin_theorem) ·
[Diffusion-limited aggregation](https://en.wikipedia.org/wiki/Diffusion-limited_aggregation) ·
[Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)) ·
[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) ·
[A New Kind of Science](https://en.wikipedia.org/wiki/A_New_Kind_of_Science)

**Who-JITs-the-jitter thread:** [Self (programming language)](https://en.wikipedia.org/wiki/Self_(programming_language)) ·
[V8 JavaScript engine](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) ·
[HotSpot (JVM)](https://en.wikipedia.org/wiki/HotSpot_(virtual_machine)) ·
[Inline caching](https://en.wikipedia.org/wiki/Inline_caching) ·
[Just-in-time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) ·
[Bit slicing](https://en.wikipedia.org/wiki/Bit_slicing) ·
[Connections (James Burke)](https://en.wikipedia.org/wiki/Connections_(British_TV_series))

**This project:** live app [https://donhopkins.com/home/CAM6](https://donhopkins.com/home/CAM6) ·
source [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) ·
demo [https://www.youtube.com/watch?v=LyLMHxRNuck](https://www.youtube.com/watch?v=LyLMHxRNuck)

— Don Hopkins *(the User Interface Flower Child)* 🌀🔲
---

## status: draft

character_id: norman-margolus
public: true
audience: "Norman Margolus (as the intended audience) — and anyone who wants to learn"
about: "Don's CAM6 simulator: what it is, its Forth heritage, and what Don made with Norman's magic"
see_also:

- ../don-hopkins/cam6-cellular-automata-machine.md   # Don-side firsthand writeup
- ../../repo-shows/norman-margolus/SHOW.yml
- [invitation.md](http://invitation.md)

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
- **Read the insane monolithic source with it's own object system:** `[CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)`
- **Don-side writeup:** [cam6-cellular-automata-machine.md](../don-hopkins/cam6-cellular-automata-machine.md)

---



## The one-sentence version

I built a **CAM6 simulator** that is **software-compatible with your CAM-6 hardware and the code examples** — it runs the FORTH rules (now translated to JavaScript) straight out of your book — and I kept re-implementing the *same idea* across four decades of languages, because the interesting part was never the language. It was the **rules and lookup tables and hardware**.

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

1. **x86 Forth on the CAM6 floppies.** I still have **disk images of the CAM6 floppies** with the
  original **x86 Forth** — your and Toffoli's software stack, the way it shipped.
2. **My own reimplementation in Mitch Bradley's Sun Forth.** I re-hosted that tech stack on a Sun
  workstation using **Mitch Bradley's Forth** (the lineage that became Open Firmware). Same idea,
   new machine, new Forth.
3. **C + FORTH.** A CAM6 simulator emulating the hardware, with Forth defining rules and driving it.
4. **C++, then Python.** It grew a life of its own and got re-hosted again.
5. **JavaScript —** `CAM6.js` **(today).** Rules are defined in **JS** and compiled to the **identical
   lookup tables** the Forth rule compiler produced. **No embedded Forth interpreter** — JS-Forth in
   the repo is a **possible extension** ("do not stick your tongue into the power supply"); an
   off-the-shelf WASM/JS Forth could be wired in later for live Forth rule authoring.
6. **TypeScript — next.** A type-safe, self-describing rewrite (more on that below).

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

Here is the shape of a CAM6 rule the way your book teaches it — **representative CAM6-style Forth**,
written to read like the book's idiom (see the book / floppy images for the canonical words). A rule
is a **Forth word** that, given the neighbor states, returns the new center state; `make-table` runs
it over *every* neighborhood to bake the lookup table:

```forth
\ Conway's Life, CAM-6 style: a Forth word run over every neighborhood to build the table.
: life  ( -- )
    &/moore   \ sum of the 8 Moore neighbors -> stack
    center @  \ current center cell
    if   dup 2 = swap 3 = or      \ alive: survives on 2 or 3
    else 3 =                       \ dead: born on exactly 3
    then ;
' life  make-table                 \ compile the rule into the lookup table
```

And here is the **same idea** in `CAM6.js` — a JS "neighborhood function" plays the role of the Forth
rule word, and the engine runs it across all neighborhoods to generate the **identical table**
(representative — the real code is in `[CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)`):

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
**diffusion-limited aggregation** running live on the **Margolus-neighborhood** engine, using the
very lookup table the Forth generated. Gas particles random-walk via block partitioning; when a
walker touches the aggregate, it **sticks**; branching, coral-like crystals grow. It's a direct,
live-runnable Margolus artifact — and a natural bridge to my
[Musical Gas granular-CA synth](../don-hopkins/musical-gas-granular-ca-synth.md), where every
sticking event can fire a grain of sound so the crystal *sings itself*.

---



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
- **Modular by construction.** Each rule/neighborhood is its own composable unit (the macro system,
  grown up), self-describing and type-safe, that compiles to the same **lookup tables**. A chapter
  playground becomes a *small graph + a page of prose*, not a fork of a monolith.
- **The visual front end: Snap!, not from scratch.** Inspired by **eToys → Scratch →
  [Snap!](https://snap.berkeley.edu/) → [Sandspiel Studio](https://studio.sandspiel.club/)**, I could
  build a whole new visual CA language — but the **best solution is to just integrate the engine with
  Snap!** (Jens Mönig & Brian Harvey). It's JavaScript, in the browser, extensible with custom blocks,
  and a *real* language (first-class procedures, Scheme semantics) — so a CA rule becomes a **block
  palette** a student can remix, and I get the whole editor for free. (This is one of four engines I
  want behind Snap! — see [Snap! visual engines / fundable goals](../don-hopkins/snap-visual-engines-fundable-goals.md).)
- **Gang the layers.** Multiple rule-planes as **connected layers** (the way you'd gang CAM-6 cards),
passed **zero-copy** between stages — see the
[streams-of-streams / zero-copy notes](../don-hopkins/streams-of-streams-fd-passing-zero-copy.md).

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
source `[CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)` ·
demo [https://www.youtube.com/watch?v=LyLMHxRNuck](https://www.youtube.com/watch?v=LyLMHxRNuck)

— Don Hopkins *(the User Interface Flower Child)* 🌀🔲
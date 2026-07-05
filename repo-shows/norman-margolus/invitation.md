---
status: draft
character_id: norman-margolus
public: true
consent: not_yet_asked
show_seed: repo-shows/norman-margolus/
---

# Repo Show invitation — Norman Margolus

*Public draft — not sent. Norman may edit, decline, delay, or request removal at any time.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

Norman —

It was a real pleasure talking cellular automata with you — **Milan and Henry Minsky** from the
**AI Lab** introduced us — and I'd love to keep that conversation going, in public, on a
**Repo Show**: a live, friendly session whose whole stage is a public GitHub repo people can clone,
run, and build on.

There's a deep personal thread here. Years ago I built a **CAM6 simulator** — CAM6-software-compatible,
straight out of *Cellular Automata Machines* — that began as **C + FORTH** emulating your hardware,
and I even made a **long-form demo tailored for you as the audience**, narrating what I did with your
book and my emulation of your machine, taking the rules into the storytelling realm:
[youtube.com/watch?v=LyLMHxRNuck](https://www.youtube.com/watch?v=LyLMHxRNuck). Since then I've
rewritten it in **JavaScript** — the high-level rules now live in JS, but they generate the
**identical lookup tables** the FORTH once did. (It used to embed a real Forth interpreter; I could
retrofit an off-the-shelf WASM/JS Forth anytime.) So your and Toffoli's **CAM-6** and book are
literally the ground I've been standing on.

I have a **DLA** (diffusion-limited aggregation) simulation running in it right now — the
**Margolus-dendrite** rule, straight off **p. 167, §15.7** — on my Margolus-neighborhood engine, using
the very lookup table the FORTH generated. I'd love to bring it all up live and let it grow while you
narrate.

I picture **two acts**:

- **Act 1 — Play.** Fire up the existing thing and run the classic rules: the **Margolus
  neighborhood** (how partitioning makes a rule **reversible**, live), **Critters** and billiard-ball
  computers running **backward**, and the **dendrite/DLA** rule aggregating in real time.
- **Act 2 — Design.** The code is a gnarly, honest **monolith** — but there are lovely bones in there
  to *cauldron out*. I'd love to sketch, with you, what a **modern web version** wants to be.

Other threads, your pick:

- **The Margolus–Levitin limit** — the physics of how fast anything can compute.
- **Computronium & programmable matter** — computing as physics, physics as computing.

If a **cellular-automata summit** sounds fun, I'd love to add **[Jim Crutchfield](../jim-crutchfield/README.md)**
(edge of chaos, evolving CA) and my friend **[Scott Draves](../scott-draves/README.md)** (Electric Sheep) —
but just you and a grid running forwards and backwards is already a great show.

**Format:** live (thinking Twitch), announced ahead, audience follows along in the repo and can
contribute. Warm and curious, not gotcha-podcast. I run it in Cursor, screen-shared, so people watch
the ideas become real. **Zero homework** — I do the setup. What we record and publish is all your
call.

I'll reach out gently through **Milan and Henry**. No pressure — accepted, delayed, declined, or no
reply, all honored gracefully.

— Don Hopkins *(the User Interface Flower Child)* 🌀🔲

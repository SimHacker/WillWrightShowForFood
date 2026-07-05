# Ideas to explore with Jeff Adkins 🪓🧬

*Conversation hooks for the show — **Don's proposed topics**, grounded in Jeff's real work on
SimObliterator/VitaMoo. Things to riff on **with** Jeff; not quotes from him.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · consent granted

## The hooks

### 1. SimObliterator, from the inside
How the Sims 1 save/object formats actually work — **IFF/FAR** containers, **OBJD** object
definitions, **GUID** identity and collision analysis — and what it took to read, write, and validate
them. The unglamorous plumbing that everything else stands on.

### 2. The soul mover — Will's 1996 holy grail, delivered
Will Wright called **data portability between games** the holy grail in 1996. SimObliterator is how a
character (and its objects, home, memories) gets **read out of one world and written into another**.
A live demo: drop in a 25-year-old save, lift it, move it, write it back.

### 3. AI-assisted reverse engineering across languages
Jeff's method: point AI at code in **different languages** — Don's documented/published sources,
open-source Sims-family reimplementations — and **analyze, translate, verify, iterate**. What works,
what breaks, how you keep it honest (tests, round-trips, real save files).

### 4. The feedback loop — AI copying AI copying people
The show's thesis, live in the codebase: Jeff built it with AI from documented + open code; Don is
rewriting it into TypeScript with AI and full credit; each pass improves the last. **Stone soup, the
cauldron, cellular automata, Wolfram, Eno's generative systems** — copying-and-improving as a
*creative* engine, not a strip-mine. Everyone credited; every iteration better.

### 5. A GitHub-native home for Sims content
A platform to **catalog, publish, review, analyze, patch, and upgrade** decades of user-created
objects — from communities like **SimFreaks, SimSlice, Zombie Sims**, and the **Simprov Wedding
Playset**. Put it on GitHub: **file issues on individual Sims objects**, discuss what's wrong and how
to fix it, and collaborate on debugging and sharing. (Ties to [`apps/micropolis-angel/`](../../apps/micropolis-angel/README.md)
and the [Sims community landscape](../../catalogs/sims1-community-landscape.yml).)

### 6. Will's pyramid of players — fan to tool maker
Will Wright's long-held idea: a huge base of casual players, and a shrinking number as you climb who
tinker, mod, and **build tools** — the ones near the top **drastically improving the game for the
millions below.** Jeff's own arc *is* that pyramid: player → reverse-engineer → **tool maker**, in the
company of **Heather Alvey (SimFreaks)** and **Steve Alvey (SimSlice)**. A great thread to explore
*with* Will and the Alveys: how the creators at the top carry the whole community — and how open tools
+ AI change who gets to climb.

### 7. VitaMoo — Sims characters in the browser
Rendering **skeletons, meshes, and animations** live on the web (`.msh` prototype vs `.skn` retail),
and where an in-browser renderer meets an editable, forkable repo.

## Sources (real, public)
- SimObliterator Suite: https://github.com/DnfJeff/SimObliterator_Suite
- VitaMoo (WebGL characters): https://github.com/DnfJeff/SimObliterator_Suite/tree/main/vitamoo · demo https://vitamoo.space
- Sim Obliterator designs: https://github.com/SimHacker/moollm/tree/main/designs/sim-obliterator
- Will Wright, *Interfacing to Microworlds* (Stanford, 1996): https://www.youtube.com/watch?v=nsxoZXaYJSk

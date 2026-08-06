# Ideas to explore with Jeff Adkins 🪓🧬

*Conversation hooks for the show — **Don's proposed topics**, grounded in Jeff's real work on
SimObliterator (which inspired Don's VitaMoo). Things to riff on **with** Jeff; not quotes from him.*
[Portrayal standards](../../schemas/portrayal-standards.md) · consent granted

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
open-source Sims-family reimplementations (**FreeSO/Simitone**, **Niotso**) — and **analyze, translate,
verify, iterate**. What works, what breaks, how you keep it honest (tests, round-trips, real save files).
The public knowledge base — open engines + the **Niotso / Mod The Sims** format wikis — is catalogued in
[`catalogs/sims-open-source-and-formats.yml`](../../catalogs/sims-open-source-and-formats.yml).

### 4. The feedback loop — AI copying AI copying people
The show's thesis, live in the codebase: Jeff built it with AI from documented + open code; Don is
rewriting it into TypeScript with AI and full credit; each pass improves the last. **Stone soup, the
cauldron, cellular automata, Wolfram, Eno's generative systems** — copying-and-improving as a
*creative* engine, not a strip-mine. Everyone credited; every iteration better. It's the same
**[riff loop](../../repo-shows/ideas/themes/the-riff-loop.md)** as **Slats' speech feedback loop** —
people and AI riffing off each other in a cycle you can steer from anywhere (talk into, over, after,
or before it).

### 5. A GitHub-native home for Sims content (+ the "file cop")
A platform to **catalog, publish, review, analyze, patch, and upgrade** decades of user-created
objects — from communities like **SimFreaks, SimSlice, Zombie Sims**, and the **Simprov Wedding
Playset**. Put it on GitHub: **file issues on individual Sims objects**, discuss what's wrong and how
to fix it, and collaborate on debugging and sharing. The engine underneath is a **"file cop" /
"virus scanner"** for Sims content: using SimObliterator's **SimAntics analysis** to **detect missing
objects and broken user-created content, repair it, and locate the original sources back in the
catalog.** This is the piece Jeff is best placed to lead — the **content-management features and the
back-end site.** (Ties to [`apps/micropolis-angel/`](../../apps/micropolis-angel/README.md) and the
[Sims community landscape](../../catalogs/sims1-community-landscape.yml).)

### 5b. VitaBoy in the browser — clean-room, then rebuilt *better*
Two parallel tracks that meet in the browser: Don's **clean-room VitaBoy** character-animation system —
**this is VitaMoo** — which Don first hand-wrote in **Unity3D (C#)** from decades-public designs, then
brought to the web as **TypeScript** (AI-translated from his OWN C#, *not* generation from scratch) and
**rebuilt better than the Unity3D version** — modern, **modular, and composable**. Alongside it, Don also
wrote **his own TypeScript modules for managing Sims content**, based on a **deep study of
SimObliterator** (with planned reorganizing/rewriting) — **all readable in the repo**; inspired-by and
credited, not a line-by-line port. Different IP lineages, same destination — a live subject to walk
through together. *(Unity3D C# zip sources: TODO link.)*

### 6. Will's pyramid of players — fan to tool maker
Will Wright's long-held idea: a huge base of casual players, and a shrinking number as you climb who
tinker, mod, and **build tools** — the ones near the top **drastically improving the game for the
millions below.** Jeff's own arc *is* that pyramid: player → reverse-engineer → **tool maker**, in the
company of **Heather Alvey (SimFreaks)** and **Steve Alvey (SimSlice)**. A great thread to explore
*with* Will and the Alveys: how the creators at the top carry the whole community — and how open tools
+ AI change who gets to climb.

### 7. VitaMoo — Sims characters in the browser (Don's TS renderer, inspired by SimObliterator)
Rendering **skeletons, meshes, and animations** live on the web (`.msh` prototype vs `.skn` retail),
**better than the earlier Unity3D version** — modern, modular, composable — and where an in-browser
renderer meets an editable, forkable repo. VitaMoo is **Don's** (the TS clean-room above); **Jeff's
SimObliterator is what inspired Don to finally build it** (and to reimplement his own TS Sims-content
modules from a deep study of it).

**7b. VitaMoo characters as 3D puppets (on the show).** Because VitaMoo already renders Sims characters
live in the browser, we can drive them as a **new puppet kind — 3D Sims-1 character puppetry** — the 3D
sibling of the 2D face/video puppets (Conan face-holes, Faceball). Real Sims characters on stage,
voiced and posed live (mic amplitude scrub applies). On-brand and *already shipped + improving*. See
[`puppet-taxonomy.yml#kinds.sims_3d_puppet`](../../repo-shows/ideas/traditions/puppet-taxonomy.yml) and
[`performance-space.yml#sims_3d_puppet`](../../process/performance-space.md).

## Sources (real, public)
- SimObliterator Suite: https://github.com/DnfJeff/SimObliterator_Suite
- VitaMoo (WebGL characters — **Don's**, TS reimpl of his own Unity3D C#): https://github.com/SimHacker/MicropolisCore/tree/main/packages/vitamoo · demo https://vitamoo.space
- Don's Unity3D C# VitaBoy (translation source): TODO link (zip)
- Sim Obliterator designs: https://github.com/SimHacker/moollm/tree/main/designs/sim-obliterator
- Open engines + format wikis: [`catalogs/sims-open-source-and-formats.yml`](../../catalogs/sims-open-source-and-formats.yml)
  (FreeSO, Simitone, Niotso wiki, Mod The Sims)
- Will Wright, *Interfacing to Microworlds* (Stanford, 1996): https://www.youtube.com/watch?v=nsxoZXaYJSk

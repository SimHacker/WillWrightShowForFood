# Don Hopkins → Mats Knutsen — The Sims AI implementation details

*Email, 7 November 2006. Mats attached `thesimsaitest.zip`; Don replied with a plain-language tour of SimAntics-level design without requiring byte-code emulation.*

**From:** Don Hopkins  
**To:** Mats Knutsen (afr088@hotmail.com)  
**Subject:** Re: Questions about The Sims AI [Implementation details]  
**Date:** 7 November 2006

Mats had read Ken Forbus's [The Sims Under the Hood](http://www.cs.northwestern.edu/~forbus/c95-gd/lectures/The_Sims_Under_the_Hood_files/frame.htm) and was building a C# simulation. His zip is archived in [`source/`](source/) and [`original/thesimsaitest.zip`](original/thesimsaitest.zip).

---

## Don's answer (excerpted for the public repo)

### Object threads

Each object has its own **thread** — a stack with program counter, scope, and variables. Sound and animation run **asynchronously**. Objects can **block** until animations finish, and can block on events at particular times in the animation to stay synchronized.

For **advertisement condition checks**, interrupt-level code can run on top of an object's stack (in its context). That's a low-level detail; you don't have to emulate SimAntics byte-for-byte.

### C# is the right level

> I think the approach you're taking of implementing the essential ideas in a high level language like C# is a good one. Don't get too tied down in making it behave exactly like The Sims or trying to be compatible with Sims objects.

The intelligence lives in **objects with their own behavioral code** — open-ended, plug-in more objects later. You don't need a new programming language, VM, and visual editor like SimAntics and Edith *to start*; consistent C# object scripts are enough. The key is a **good set of C# classes** that capture the essential aspects — easier to experiment with than backwards-compatible compatibility.

### How Sims choose what to do

1. A function gets the **top ~5 actions** for the current Sim — the heart of the decision algorithm.
2. The Sim **chooses one of those top several at random**.

Why random, not always optimal?

> If the Sims always made the best possible choice of things to do all the time, then anything the player told them to do would only make their lives less efficient and more miserable — there would be no need for the player to "help out" their Sims. Nobody always makes the right decision 100% of the time, anyway.

### Scoring actions

Each action gets a **score** for the current person, time, world state, motives, skills, personality, relationships, etc.

Score comes from:

- **Automatic** factors (distance to object, numerical modifiers)
- **Algorithmic** conditional checks attached to actions in advertisements — true/false whether the action is possible, may modify the automatic score, and may **generate variants** (e.g. the phone listing every friend you can call)

### Two uses of advertisements

1. **Pie menu** — possible actions on **one** object for the player to pick
2. **Autonomous AI** — sorted list of possible actions on **all** objects

### Favorite bed (relationship decay)

> The reason a Sim always sleeps in the same bed, is that every time they sleep in any bed, their relationship with that bed increases. And the condition check function of the bed is modified not only by how tired they are, but also by how many times they've slept in it before. So they're most drawn to their favorite bed. The bed decays its relationships over time (the bed increases its relationship with the Sim by 1.0 or so when somebody sleeps in it, and each night it multiplies all its relationships by .95 or so to exponentially decay them), so you can change a Sim's favorite bed by telling them to sleep in another bed enough times. (Or you could just put their old favorite bed out in the back yard and set it on fire, which would be quicker!)

---

## Mats's questions (summary)

| Question | Don's gist |
|----------|------------|
| Are object threads only alive during an interaction, or also for advertising needs? | Threads are the object's behavioral context; advertising uses condition checks (including interrupt-level evaluation). |
| How do Sims pick among multiple interactions when several needs compete? | Score all candidate actions across all objects; take top ~5; random pick among them. |
| How to implement need ↔ object attractiveness? | Scoring + advertisements in both pie-menu and autonomous contexts; condition functions can encode bed-relationship-style memory. |

---

## Show hooks

| Beat | Guest |
|------|-------|
| Top-5 + random = **player agency** | Will Wright |
| Advertisements × pie menus × autonomy | Don Hopkins |
| SimAntics vs C# sketch in [`source/InteractionObject.cs`](source/InteractionObject.cs) | Jamie Doornbos |
| Utility AI / GMTK thread | Mark Brown (patron saint?) |

---

↑ [TheSimsAITest README](README.md) · [Motive.c](../2008-02-10-soul-of-the-sims/Motive.c) · [Forbus Under the Hood](http://www.cs.northwestern.edu/~forbus/c95-gd/lectures/The_Sims_Under_the_Hood_files/frame.htm)

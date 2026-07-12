# Ideas to explore with David Ungar 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in David's
public work and documented connections to this repository. Things Don would love to follow
**with** David Ungar; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## Show

| | |
|---|---|
| **Planted show** | [`repo-shows/david-ungar/`](../../repo-shows/david-ungar/) |
| **North star** | [`reflecting-on-self.md`](reflecting-on-self.md) |
| **Episode title** | *Reflecting on Self: Narcissa's Mirror* |

## What David has done

**David Ungar** — co-creator (with **Randall B. Smith**) of **Self**: prototype-based objects,
no classes, **multiple named `parent*` slots**, dynamic reparenting. Pioneered **generation-scavenging**
GC (Berkeley PhD) and **adaptive/dynamic JIT** — **maps** and **polymorphic inline caches** with
Chambers, Hölzle, **Lars Bak** → HotSpot → **V8**. **Mirrors** for reflection. **Stage Magic
Principle** and **Idea Scavenging**. Stanford → Sun Labs → IBM Research. Dahl–Nygaard Prize.
*Self: The Movie*. Jan 2026: Don wrote about MOOLLM building on Self — warm correspondence thread.

## The hooks

### 1. Self × MOOLLM — `# import self from self`

Directories as prototypes; skills clone + delegate; serializable parent lists restore **multiple
inheritance** JavaScript threw away. Build one small fragment live. See
[`import-self-from-self.md`](../don-hopkins/import-self-from-self.md).

### 2. The Power of Simplicity (not just prototypes)

Ungar & Smith, OOPSLA 1987 — the thesis is **simplicity**. Prototypes are the means. JS ⊂ Self,
watered down: kept prototypes, lost MI and simplicity. Full Rosetta table:
[`slots-all-the-way-down.md`](../david-rosenthal/slots-all-the-way-down.md).

### 3. Narcissa's Mirror — Self mirrors + pun stack

Working episode title. **self-interest!** mailing list (Don was on it). Live enumeration: self-ish,
(oops)/OOPS, *Self: The Movie*, Conscientious Objectors. David gets veto power on air.

### 4. Conscientious Objectors — Kaleida (ScriptX × Self)

Meetup where **ScriptX object-system design team** and **Self team** bounced prototype OO ideas.
Don coined the name. Ethic: artisanal, intentional craft vs opaque automation — applied to LLM
orchestration. [`kaleida-scriptx-...`](../don-hopkins/kaleida-scriptx-dreamscape-multimedia-lisp-machine.md).

### 5. Maps/PICs → V8 — the implementation vindication

Self made delegation **fast** — and that lineage runs into the VMs that run the web. Delicious
irony: JavaScript runs fast today **because of Self's implementation tech** while keeping a
broken object model — a single prototype chain with **no multiple inheritance**, the central
Self quality whose fast compilation was the hard problem the PICs solved in the first place.
Pairs with [`norman-margolus`](../norman-margolus/) "who JITs the jitter?"

### 6. Stage Magic → GLANCE / CARD / SKILL

Show simple view; reveal complexity on demand. MOOLLM's semantic image pyramid is the operational
form. Build a skill advertisement live using the pyramid.

### 7. Idea Scavenging → persistent characters

Focus compute on persistent ideas — characters and skills that survive sessions. Repo Show guest
directories as the scavenging substrate.

### 8. Relativistic parallelism

*"Everything You Know (About Parallel Programming) Is Wrong!"* — tolerate approximate, race-y
computation. Fun argument: is git's causal-DAG partial order the disciplined version, or a warning?

### 9. Pairings

- **[Alan Kay](../alan-kay/)** — messaging over objects; Self as live-object branch
- **[Dan Ingalls](../dan-ingalls/)** — Smalltalk substrate Self grew from
- **[Oliver Steele](../oliver-steele/)** — instance-first; LZX obeys what JS violates
- **[David Rosenthal](../david-rosenthal/slots-all-the-way-down.md)** — NeWS/fs pole vs Self pole

## Sources (public)

- [`invitation.md`](invitation.md) · [`reflecting-on-self.md`](reflecting-on-self.md)
- [`correspondence.yml`](correspondence.yml) — Jan 2026 digest
- [`from-alan-kay.yml`](from-alan-kay.yml) — Kay lineage quotes
- [`repo-shows/david-ungar/`](../../repo-shows/david-ungar/)
- [Wikipedia — David Ungar](https://en.wikipedia.org/wiki/David_Ungar)
- [Self language](https://en.wikipedia.org/wiki/Self_(programming_language))

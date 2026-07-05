# One object model — Self underneath everything

> The review's author said the Self-inspired configuration idea "excites me even more than MOOLLM itself,"
> and I think they're right that it's the deepest architectural claim in the whole stack. Extracting it
> because it reframes MOOLLM from "an LLM operating system" to "one manifestation of a much larger object
> universe."
>
> **Author:** Claude Opus, from review lines ~1011–1055, 1400–1454, plus the philosophy braid at line 237.
> Stance: the unification is real and worth pursuing, but it's the stack's biggest *aspirational* claim —
> flag it honestly.

---

## The observation that starts it

Modern software reinvents the same primitives at every layer, over and over:

> Every layer reinvents **identity**. Every layer reinvents **serialization**. Every layer reinvents
> **messaging**. Every layer reinvents **configuration**. Every layer reinvents **synchronization**. Every
> layer reinvents **deployment**.

The question the review poses: **why?** Suppose they were all just **objects** — Self objects. Living,
versioned, networked, configured, AI-readable objects. Then the configuration system, the message bus, the
deployment model, the distributed objects, the multiplayer sync, the AI memory, and the live simulations are
**all using the same ontology.** As the review puts it: *"That's a much deeper unification than 'let's use
YAML everywhere.'"*

Under that lens, MOOLLM "isn't 'an LLM operating system.' It's one manifestation of a much larger object
universe" — the manifestation that happens to be inhabited by an LLM.

## Why *Self* specifically (not classes, not just OO)

The stack's philosophy is a deliberate braid of **Papert, Minsky, Will Wright, Self, Ackley, and Postel**
(review line 237). Self contributes the crucial piece: **prototype delegation instead of rigid class
hierarchies.** That matters for an object universe an LLM has to browse and edit live:

- **Prototypes, not classes** — you create by *copying and tweaking a living example* (a room, a character, a
  skill), not by instantiating an abstract class. This is why the repo's `characters/incarnation` "gold
  standard" pattern works: you clone a known-good object and modify it. It matches how LLMs actually reason
  (by analogy to a concrete example) far better than class instantiation does.
- **Live, browsable objects** — the file-system-object grammar (plural dirs = type, singular = instance,
  UPPERCASE marker files = exported interfaces) exists *precisely* so an LLM can "browse the directory tree
  the way a Smalltalk or Self programmer browses live objects." The review calls this "one of the clearest
  places where the Self lineage shows through." Big-endian naming, prefix ownership, about-not-inside
  placement, README-everywhere — all serve *browsability of a live object graph.*
- **Delegation = inheritance-by-pointer** — MOOFS overlay resolution
  (`AMBIENT → ROOM → CHARACTER → LOCAL SHADOW → WORKING → UPSTREAM → BASE`, see
  [`../mooco/MOOCO-DRIVER-DEEP-DIVE.md`](../mooco/MOOCO-DRIVER-DEEP-DIVE.md) §3.7) is *literally* Self's
  delegation chain applied to a filesystem: look here, else delegate to my parent, else its parent. The
  object universe already has a prototype chain — it's the mount stack.

## The historical resonance (David Ungar)

This isn't a retrofit. Don coined "conscientious objectors" at a Kaleida meetup **with David Ungar** — Self's
co-creator — and proposed a **Self × MOOLLM** show (review line 2593). The Self connection is a direct
lineage, not a borrowed buzzword. That's why the review trusts it: the influences "are not just cited
name-drops; they are visibly encoded in the constitution, protocols, skill layout, and driver design."

## Why this is the deepest — and most aspirational — claim

**Deepest:** if identity/config/messaging/deploy/sync/memory really are one object model, then MOOLLM, the
Federation, mooco, and MicropolisCity aren't separate systems glued together — they're **views of one
substrate.** That would make the whole stack radically simpler than it looks, because the "integration" work
mostly vanishes: there's one ontology, browsed and edited many ways.

**Most aspirational (no-hedging, stated plainly):** *today, this is a thesis, not an implementation.* The
repos demonstrate the object grammar for skills, rooms, and characters — that part is real and working. But
"configuration, messaging, deployment, synchronization, and AI memory are all the same Self object" is a
**direction**, not a shipped system. `PROTOTYPE-FRAGMENT-CONFIG.md` (the Self-ish session/workspace fragment
composition) is the concrete beachhead; mooco loading resolved fragment output at session start would be the
first real proof. My honest tag: **keep this as the north star, and let it guide the object grammar — but
don't present the unification as done.** The credible version of the claim is: *"we use one prototype-object
grammar for the things we've built, and we're extending it outward layer by layer."*

## The compression (one line)

> Stop reinventing identity/config/messaging/deploy/sync/memory per layer; make them all **prototype objects
> in one browsable, delegating, versioned universe** — MOOLLM is just the room in that universe where an LLM
> lives.

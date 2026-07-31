# Urs Hölzle — conversation hooks

*Menu, not homework. Pick any, skip the rest.*

## 1. The manual apprenticeship — "about 30 versions later"

Ungar handed you a draft sketch and you learned to write English by revising the Self manual
thirty times under his feedback. That's a craft ethic — the same loop as adaptive
optimization: run, profile, rewrite the hot path. What did round 30 have that round 3
didn't? And what did writing the manual teach you about the language?

## 2. Deoptimization — the trick that blew Don's mind

*Debugging Optimized Code with Dynamic Deoptimization* (PLDI '92): the compiler lies for
speed, then un-lies on demand so the debugger sees the program you wrote. Don cites this as
the moment he understood Self delivered simplicity AND performance AND honesty at once.
Walk through the idea for people who only know its descendants.

## 3. PICs → HotSpot → V8 — the lineage everyone runs

Polymorphic inline caches, maps, adaptive recompilation: Animorphic → Sun → HotSpot; Bak →
V8. Don's spicy framing: JavaScript kept Self's speed story and dropped the simplicity
story — "a castrated cover version with a world-class band behind it." Agree, disagree,
complicate. You built the band.

## 4. SIC lives — Russell Allen, 64-bit Macs

Your simple inlining compiler from the early 90s is running again on Apple Silicon, and
your advisor is programming in the IDE daily. What is it like to have a dissertation
artifact outlive most commercial software? Live demo fuel with Ungar in the room.

## 5. Split-second everything — Self's response-time contract, then and now

Ungar's line in the Jul 2026 thread: "split second response time to every operation,
including changing, running optimized code." That contract is the whole thesis. Where did
it survive (V8 tiering, hot reload) and where did the industry quietly give it up?

## 6. From one VM to a warehouse

*The Datacenter as a Computer* is the same instinct at planet scale: treat the messy
dynamic thing as one machine and optimize it adaptively. Is warehouse-scale computing
adaptive optimization with buildings? Energy proportionality as the new inline cache.

## 7. Employee #8 — what Self habits shipped inside Google

First VP of Engineering at a company that became the world's biggest dynamic-optimization
problem. Which reflexes from the Self group — measure first, deoptimize honestly, keep the
programmer's mental model intact — made it into Google's engineering culture?

## 8. Selfish MOOLLM — the object model, resurrected for LLMs

MOOLLM multiply-inherits from files *and* latent space — a parent slot can be a paper title
or a patent number ([Self and MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md),
[Latent-Space Inheritance](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md)).
The implementation question is yours by right: what does "adaptive optimization" mean when
the interpreter is a language model?

## 9. Pair beat with Ungar — design half, implementation half

Randy and Dave wrote the power of simplicity; you paid for it in compiler engineering. The
long-running argument every language team has — how much can the design lean on the
implementation to be heroic? — with the two people who settled it once, in public.

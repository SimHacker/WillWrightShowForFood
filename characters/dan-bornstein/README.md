# Dan Bornstein — danfuzz

VM and language-runtime engineer with a forty-year through-line:
object systems at **Kaleida Labs** (ScriptX), mobile platforms at
**Danger**, then **Google**, where he created the **Dalvik VM** —
the register-based runtime that Android shipped on and that ran the
Java-language world on a billion phones. Keeper of
[milk.com](https://milk.com/) and its
[Wall o' Shame](https://milk.com/wall-o-shame/), which
[hit Hacker News again in 2026](https://news.ycombinator.com/item?id=47102576).

## The Kaleida connection

Don and Dan are fellow Kaleidans, and Don remembers the working
together fondly — ScriptX was, in Don's words, "an object-oriented
multimedia Lisp machine. So fucking fun," and Dan was one of the
people making the object system actually go
([Kaleida notes](../don-hopkins/kaleida-scriptx-dreamscape-multimedia-lisp-machine.md)).

The Kaleida crowd also met up with **David Ungar** and the Self team
to talk about objects — an epic meetup Don named the
**Conscientious Objectors**: conscientious about how we design our
*objects*, prototype-based systems argued from two directions in
good faith
([the term's full lineage](../don-hopkins/conscientious-objectors-enlightened-self-interest.md)).
Don thinks Dan was in the room.

Don's recollections of the ScriptX era, recorded so he can ask Dan
to refresh his memory — if Dan remembers
(see [CHARACTER.yml](CHARACTER.yml) `recollections:`):

- **ScriptX had CLOS-like multiple dispatch, and Dan implemented
it.** The single-dispatch syntax already annotated the first
parameter with its class when defining a method outside the class;
multiple dispatch was just annotating subsequent parameters. Don
discussed it with Dan at the time, but isn't sure the feature
shipped ("I think so") — exactly the kind of thing to ask him.
- **Dan implemented a Scheme-like syntactic surface for ScriptX** —
straightforward, because the language was layered.



## Why he'd be a great guest

- **The multiple-dispatch witness.** Korz dispatches symmetrically
on the whole context; CLOS-style multimethods are the shipped
ancestor, and (per Don's recollection) Dan built one at Kaleida
while the Self team was down the hall. He connects the
[Korz conversation](../david-ungar/korz/README.md) to production
VM experience from the other direction — dispatch as an engineer's
problem, not a paper's.
- **VM lineage, firsthand.** Self's JIT research became HotSpot and
V8; Dan's Dalvik is the sibling story — a clean-sheet VM under
brutal memory constraints that put a dynamic runtime in everyone's
pocket. Crystallization and deoptimization
([design](../david-ungar/korz/design.md)) are dinner-table topics
for him.
- **The Conscientious Objectors cross-examination.** Pair him with
David Ungar and reconstruct the meetup from both sides — who was
there, what was argued, and whether the multimethods shipped.
- **milk.com.** A personal domain older than most guests' careers,
curated with total commitment to the bit.


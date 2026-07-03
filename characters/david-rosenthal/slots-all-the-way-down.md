# Slots all the way down 🗄️
### Self · Smalltalk · NeWS `class.ps` · the Unix filesystem · (and JavaScript, sigh)

*A topic Don would love to chase **with** David S. H. Rosenthal — grounded in David's public work
(co-author of *The NeWS Book* with James Gosling). Don's framing, not a claim about what David
thinks. Open in the git-in-the-open spirit: disagree in an issue, send a PR, add a system we missed.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation guest · consent not_yet_asked

---

## The thesis

Strip away the syntax and these are **the same machine**:

> **A namespace of named slots — each holding a value or some behavior — plus a lookup rule that,
> when a name isn't found locally, delegates to a parent (or a search list of parents).**

Everything else — classes vs prototypes, dictionaries vs directories, dots vs slashes — is a
variation on that one idea. Name resolution *is* inheritance. Inheritance *is* name resolution.

## The Rosetta table

| System | An "object" is… | A "slot"/binding is… | Lookup / inheritance | Model | Code = data? |
|--------|-----------------|----------------------|----------------------|-------|--------------|
| **Self** | an object | a **slot** (data *or* method — uniform) | delegate via `parent*` slots (assignable → dynamic; multiple parents OK) | **prototype** | yes (methods are objects) |
| **Smalltalk** | an instance | instance var / entry in a **method dictionary** | walk the **superclass chain** | **class** | yes (everything's an object) |
| **NeWS `class.ps`** | a **dictionary** | a `key → value/proc` in that dict | walk the **dict stack** / chained parent dicts | class *built on* dicts (Densmore) | **PostScript** — you literally *send code, not commands* |
| **Unix FS + shell** | a **directory** (or file) | a **directory entry** `name → inode` | **path resolution**; `$PATH` = ordered delegation list; symlink = alias; mount = graft | hierarchical namespace | executables are files; scripts are text |
| **JavaScript** | an object | a **property** | walk the **prototype chain** (`[[Prototype]]`/`__proto__`) | prototype **with a class veneer bolted on** | yes (functions are objects) |
| **Lua** | a **table** | a `key → value` pair | `__index` metamethod: a **table** (delegate to parent) *or* a **function** (compute the slot) | prototype via **metatables** — tiny, orthogonal | yes (functions are values) |

Read any row as: *bag of named things + "not here? ask my parent."* That's it. That's the pattern.

## Subset / superset (some for good reasons, some terrible)

- **JavaScript ⊂ Self, watered down.** Brendan Eich took Self's prototypes (and some Scheme) and
  shipped them in ten days — then **grafted a fake class model on top**: `new`, constructor
  functions, `this` that rebinds depending on *how* you call, and eventually `class` sugar that
  hides the prototype it's still made of. Two mental models fighting in one language. Self had
  *one* clean idea (delegate to a parent slot); JS kept the idea and added the confusion. **Looking
  at you, JavaScript.**
- **Lua got it right where JavaScript got it wrong.** Lua kept the *pure* Self idea and refused the
  class veneer: one data structure (the **table**), and a **metatable** whose `__index` is either a
  table (**delegate to a parent** — Self exactly) or a function (**compute the slot on demand** —
  `doesNotUnderstand:`/proxy for free). From that single hinge you build classes, single or multiple
  inheritance, read-only objects, proxies — but nothing is *baked in*. It's the smallest honest MOP
  that ships. Lua is closer to Self's original simplicity than JS ever was; JavaScript had the same
  Self genes and **obliviously abandoned** them for `new` and `class`.
- **NeWS `class.ps` ≈ Smalltalk semantics on a PostScript substrate.** Owen Densmore's object system
  built classes and inheritance out of PostScript **dictionaries** and the **dict stack** — the same
  late-bound message lookup as Smalltalk, but the "objects" are dicts and the wire protocol is
  *programs*. This is David's home turf: NeWS's whole bet was **send code, not commands** — ship a
  PostScript method to the server instead of a fixed request. The dict stack is a delegation chain.
- **The Unix filesystem is a persistent, on-disk object graph** — but coarse. "Methods" are
  executables invoked by `exec`; "messages" are `argv` (weakly typed, string-ish); `$PATH` is
  ordered multiple-delegation; symlinks are references; mounts graft one namespace into another.
  Same *shape* as the others, with the type system sanded off. **Plan 9** (Pike, Thompson) pushes it
  to the limit: per-process namespaces, *everything* is a file — arguably the most honest version of
  "the namespace **is** the object system."
- **Self and Smalltalk are the clean poles** — prototype vs class — and NeWS/PostScript, the Unix
  tree, and JS are all points between them or projections of them onto a different substrate.

## The linguistic motherboard — where "slots all the way down" actually comes from

The idea that the **linguistic substrate shapes the object system** isn't a retro-fitted thesis — it
has a named origin, and it's sitting in Don's own archive. **John Warnock** called PostScript a
**"linguistic motherboard."** The source is a 1990 email from **Owen Densmore** (`owen@Sun.COM`) to
Don (`don@cs.UMD.EDU`), recounting a LaserWriter-era lunch with Warnock at Adobe
([archived](https://donhopkins.com/home/archive/NeWS/linguistic-motherboard-owen.txt)):

> *"PostScript is a linguistic 'mother board', which has 'slots' for several 'cards'. The first card
> we (Adobe) built was a graphics card. We're considering other cards. In particular, we've thought
> about other network services, such as a file server card."* — John Warnock, as told by Owen Densmore

Read that again with this document's title in mind. Warnock's substrate metaphor is a **motherboard
with slots** — the language is the bus, and *graphics is merely the first card*. That's **"slots all
the way down" one level below the object system**: before slots hold your parent object, the language
itself is a board of slots holding *cards* (imaging, fonts, a file server, an object system, a window
system). Warnock's real goal, Densmore relays, was a **programmable network** — the printing was just
the first component. "Send code, not commands" is the motherboard's bus protocol.

And here's why it belongs in *this* conversation specifically: **Owen Densmore both told Don the story
and then implemented it** — his `class.ps` object system is one of the cards you plug into the
PostScript motherboard, and **NeWS realized the whole vision**: a host-independent interpreter, device-
independent graphics, code fragments that run on any architecture (Sun-3, Sun-4, even a Mac), and the
window system itself as cards on the linguistic bus. The same thread runs into **NeFS** (a proposed
NFS successor running a PostScript interpreter in the kernel — a "file server card," exactly as
Warnock mused) and echoes **Xerox PARC's PCR** (Portable Common Runtime) as the tightly-coupled
in-memory bus beneath the networked one. *(Primary source: Densmore→Hopkins email, 1990, in Don's
[NeWS archive](https://donhopkins.com/home/archive/NeWS/linguistic-motherboard.txt); discussed on
[HN](https://news.ycombinator.com/item?id=22456710). One to walk through with Owen, David, and James
Gosling directly.)*

## Same idea, different substrate: how you name "my parent" and the search order

Here's the honest counterweight to the thesis, and Don thinks it's the *interesting* part. Yes, all
of these are "a namespace + delegated lookup." But **how you name a parent, and how you represent the
search order (including multiple inheritance), is dictated by the substrate** — and the choices are
genuinely different, not just cosmetic. *You play the cards you are dealt. The object system is
shaped by its linguistic substrate.*

| Substrate | How a parent is referenced | Search order / MI |
|-----------|----------------------------|-------------------|
| **Self** | a slot whose name ends in **`*`** (a *parent slot*) points at **an anonymous object** — Self objects have no names; they're only *pointed to* by slots in other objects | multiple `parent*` slots = multiple inheritance; slots are **assignable**, so inheritance is **dynamic** (reparent at runtime) |
| **Explicit named drill-down** (`foo.bar.baz`) | parents are **ordinary named slots** you reach into by path; the parent link is explicit and addressable | search order is however you write the path; MI is "which named parent slot do I consult, in what order" |
| **NeWS PostScript** | **no parent pointers at all** — the model is the **dict stack** (plus *separate* execution stack and `gsave`/graphics-state stack) | lookup walks the **dict stack**; that stack *is* the search order. Totally different machine — you don't name a parent, you arrange the stack |
| **Don's JSON self-ish config** *(from Pantomime; → MOOLLM — see below)* | every config has a **name in a registry**; you list parents as **names** (not object references): `"parents": ["p1","p2"]` | ordered name list → MI + search order; **looser, serializable, jsonic** — indirection through the registry, not live pointers |
| **Lua** | `__index` = a **table** (one parent) *or* a **function** (look wherever you want) | single-table `__index` = single delegation; function `__index` lets you **implement** MI and any search order yourself |

A few things fall out of this table:

- **Direct object pointer vs. name-in-a-registry is a real fork.** Self points at a live, anonymous
  object (fast, dynamic, but not serializable as-is); Don's JSON config points at a *name* resolved
  through a registry (serializable, portable, git-friendly — the price is a lookup and a late
  binding). MOOLLM leans the JSON/name way on purpose: **names are K-lines, and a serializable
  parent list survives being written to disk and merged.**
- **NeWS is the odd one out, and that's the lesson.** There's no "parent slot" to point anywhere —
  inheritance *is* the shape of the dict stack, with separate stacks for execution and graphics
  state. It reminds you the "namespace + delegation" thesis is an *interpretation* we lay over very
  different machines, not a single blueprint they all secretly share.
- **On Lua and multiple inheritance:** Lua doesn't ship MI as syntax the way it's absent from Java's
  *classes* (Java gives you single class inheritance + multiple *interface* inheritance, later with
  default methods). But Lua's function-valued `__index` lets you **build** MI with whatever search
  order you like. And that's the point Don keeps coming back to: **Lua is SIMPLE, and simple is worth
  a LOT** — a minimal hook you compose, over a big menu baked in.

So the Rosetta table's rows agree on the *idea* and disagree on the *representation of the parent
link* — direct anonymous pointer (`*`-slot), explicit named slot, no pointer at all (dict stack), or
name-through-a-registry. Same lesson as Rees, one level down: not only is "OO" not one thing — even
"inheritance" isn't one representation.

### Not always a tree, not always *one* tree, not always pointers

Even that framing still smuggles three assumptions. Drop all three:

- **Not always a tree.** Multiple inheritance turns the "parent" into "parents" and the hierarchy
  into a **DAG** — so "walk up to the parent" becomes a **linearization** *choice*, not a walk (CLOS's
  class-precedence list and **C3 linearization**, C++ virtual bases, the MI that forced the TNT
  rewrite above). There isn't one path up; you *pick* an order.
- **Not only one tree.** An object can live in **several orthogonal hierarchies at once**, each with
  its own parent link and its own lookup: a *class/inheritance* tree, a *containment / scene-graph*
  tree (NeWS/TNT widgets, the DOM), a *namespace* tree, a *filesystem* tree. A NeWS widget was
  simultaneously in the `class` dict chain **and** the window/canvas containment tree — different
  parents, different searches, same object.
- **Not always pointers (or hashes, or lists).** The edge can be a **string naming convention you
  *parse*** — no live pointer anywhere:
  - **Tcl** namespaces: `::a::b::c`. The hierarchy *is the qualified name*; resolution splits the
    string and walks the namespace tree. Classic Tcl did objects/classes/namespaces largely **by
    naming convention** plus `namespace eval`, long before TclOO.
  - **Classic PHP / Drupal:** before real namespaces, hierarchy was encoded in **class names** —
    `views_handler_field_node` — and PSR-0 autoloading turned `_` / `\` into directory separators.
    The **name is the path is the tree**; the autoloader is the "pointer chase," done by string.
  - This is exactly David's **`$PATH` patent** (a filesystem path is a naming convention encoding the
    class chain) and **Java packages → directories**. The structure lives in the *string*, resolved
    by convention, not stored in a field.
- **One-way or two-way.** A parent link can be **unidirectional** (child knows parent: Self's parent
  slot, the JS prototype chain, a Tcl qualified name) or **bidirectional** (parent also enumerates
  children: the DOM, scene graphs, ORM back-references). Two-way buys downward traversal,
  enumeration, and change-notification/invalidation — at the cost of keeping *both* ends consistent.
  One-way links **serialize and merge trivially** (hello, Git); two-way pointer graphs are exactly
  what fights save/ship/merge — the same tension David lives at.

So the thesis generalizes twice more. **"Namespace + delegated lookup" needs no tree, no *single*
tree, no pointer, and no symmetric link.** It needs only *a way to name a relationship and a rule for
following it.* The **medium** (pointer / hash / list / parsed string), the **shape** (tree / DAG /
many overlaid trees), and the **direction** (one-way / two-way) are all free parameters — and each
choice trades traversal power against serializability.

### The instance/class line is a refactor away — Oliver Steele's instance-first

If slots go all the way down, then **the line between an instance and a class is not a wall — it's a
seam you refactor across.** Oliver Steele named the discipline **Instance-First Development**
([*Classes and Prototypes*](https://blog.osteele.com/2004/03/classes-and-prototypes/), 2004): build
functionality for a *single instance*, then refactor that instance into a *class* once a second case
appears. It dodges **premature abstraction** — *"it's easier to generalize from two examples than
from one."*

What makes the refactor seamless is his **Instance Substitution Principle**: *an instance of a class
can be replaced by the definition of the instance without changing the program's semantics* — because
class-member and instance-member definitions are **syntactically parallel**. OpenLaszlo (LZX) had it:
define a `<class>` and its name becomes a tag; an instance and its class read the same way, so you
slide between them. This is the doc's thesis stated dynamically — *there is no privileged "class"
layer, only slots you may later hoist into a shared parent.*

It also sharpens the JavaScript row: Steele's own critique is that JS 1.x is prototype-based but
**violates** the principle — no first-class `class` syntax, and instance vs. member definitions
aren't parallel — which is exactly the "prototypes with a class veneer bolted on" complaint from the
Rosetta table, diagnosed one level deeper. Self obeys it natively (a slot is a slot); NeWS and the
`$PATH` patent obey it structurally (an object dir and a class dir are the same kind of thing);
**MOOLLM's LIFT gate is instance-first as *method*** — dogfood the instance, hoist the class only when
a second real caller earns it. *(Don has shipped a lot of OpenLaszlo and vouches for it firsthand —
"tacking against the wind": make instances, refactor into classes, explore further; kin to CMU's
**Garnet** constraint/prototype UI in Common Lisp.)*

### Lua's other superpower: roll a bespoke object system to *bridge* a foreign one

If the object system is shaped by its substrate, then the moment you cross into a foreign library you
hit *its* object model — and they're all different. This is where Lua's minimalism pays a second
dividend. Because you **roll your own object system** in Lua (metatables, nothing baked in), and
because Lua was designed from the start as an **embedding/extension language** (Python's terms:
*embedding* = a C app hosts Lua; *extending* = Lua calls out to C) with a **small, clean C API and
FFI** — more elegant, in Don's view, than Tcl's or Python's, and exactly what tools like **SWIG**
auto-generate wrappers for — you can cheaply build a **special-purpose object system that mirrors the
foreign one exactly** and lets calls flow both ways.

That's a virtue, not a chore: rather than forcing a foreign library into one built-in class model,
you write a thin bespoke object system that speaks the foreign model's own dialect —

- **GObject** (GLib/GTK): classes, signals, properties, introspection — bridged in practice by
  things like **lgi** (Lua ↔ GObject-Introspection).
- **X11 resources**: the Xt widget/resource model, `Xrm` resource database, class/instance hierarchy.
- **COM**: `IUnknown`, reference counting, vtables, interface queries.
- **…or god knows what** — Objective-C runtime, CORBA, a game engine's entity system, a C++ ABI.

Each is a different "namespace + delegated lookup" with its own parent-representation (per the table
above), and Lua's job is to be the **impedance matcher** — a polyglot that grows a matching object
system per substrate and marshals calls across the boundary. It's the practical, load-bearing form of
this doc's thesis: since no two substrates share a representation, the winning move is a *simple*
core that can **cheaply model any of them** and glue them together. (It also rhymes with NeWS's *send
code, not commands*: ship a small adapter into the foreign world rather than a fixed protocol.)

### Industrial-strength bridges: SWIG and Emscripten/Embind

The hand-rolled Lua adapter is the artisanal version; the same job done at scale by a *generator* is
**SWIG** and **Emscripten/Embind** — both of which Don has used (SWIG) and is using (Embind), and
loves. *"Complex but supergenius."* They're the load-bearing proof of the thesis: an automated
**impedance matcher between two object models**.

- **SWIG** reads C/C++ declarations and *generates* the wrapper glue into a target language — Python,
  Tcl, **Lua**, Ruby, C#, and more. One C++ class, projected into each target's *native* object model
  (a Python class, a Lua table-with-metatable, …). It's the Rosetta table as a **compiler**: the same
  object, re-spelled in each substrate's "namespace + delegated lookup."
- **Emscripten/Embind** does it across the **WebAssembly** boundary: you declare bindings for C++
  classes, methods, and values, and get **JavaScript proxy objects** whose prototype chain fronts a
  C++ object living in linear memory. Two radically different models — C++ vtables/RAII on one side,
  JS prototypes/GC on the other — stitched so calls and objects flow both ways. (This is exactly the
  one-way-vs-two-way and lifetime problem from earlier: who owns the object, and when is it freed?)

That's not hypothetical here: **MicropolisCore** is the C++ SimCity/Micropolis engine compiled to WASM
with **Embind**, so a JavaScript/TypeScript front end drives the C++ simulation as if its objects were
local JS objects. It's *send-code-not-commands* inverted for the browser era — instead of shipping
code to a server, you compile the engine *into* the client and bind its object model to the host's.
The complexity is real (memory ownership, marshaling, glue), but the payoff is the thesis vindicated:
**a simple, explicit bridge lets two incompatible object systems act like one.**

## The à la carte menu — Rees's orthogonal axes (via Paul Graham)

There's a complementary way to slice this, and it's beautiful. In **Paul Graham**'s essay
*"Why Arc Isn't Especially Object-Oriented"* ([paulgraham.com/noop.html](https://paulgraham.com/noop.html))
he suggests offering the sub-concepts of OO **"à la carte."** His correspondent **Jonathan Rees**
(the Scheme / T hacker) replied with the actual menu, which Graham published with permission as
**[*Rees Re: OO*](https://paulgraham.com/reesoo.html)** — *"an à la carte menu of features or
properties… I have heard OO defined to be many different subsets of this list."*

Rees's nine orthogonal axes — pick the ones you want; **classify a language by which combination it
serves:**

1. **Encapsulation** — syntactically hide a type's implementation
2. **Protection** — clients can't detect/violate the implementation
3. **Ad hoc polymorphism** — one name, many types (overloading)
4. **Parametric polymorphism** — functions/structures over arbitrary types (generics)
5. **Everything is an object** — all values are objects
6. **Message passing** (AYCDISAM / Actors) — no direct manipulation, only messages
7. **Specification inheritance** — subtyping (Java `interface`)
8. **Implementation inheritance / reuse** — inherit code (Java `class`)
9. **Sum-of-product-of-function pattern** — an object *is* a function keyed by method name

Rees's whole point: **"object-oriented" is not a well-defined concept** — everyone picks an
arbitrary subset. That's the *dual* of this doc's thesis. Where "slots all the way down" unifies
these systems on **one** axis (a namespace + delegated lookup — roughly Rees's #5–#8), Rees
decomposes OO into **nine** you can mix freely. Same lesson from both ends: **OO isn't one thing.**
The Rosetta table above is really each system choosing a different plate from Rees's menu — Self
takes #5/#6/#8-by-delegation and skips classes; Smalltalk piles on #5/#6/#7/#8; NeWS/`class.ps`
serves them off dictionaries; the Unix tree offers a coarse #1/#8; JavaScript orders #5/#8 then
sprinkles a class garnish on top.

## Messaging over objects — Alan Kay, the dream guest

This whole doc has a tell: it's mostly about the **object** half of OO — slots, maps, dict stacks,
`$PATH`, delegation. **Alan Kay would push back on the framing itself.** His long-standing line is
that **the interesting part was never the objects — it was the *messaging*** (and the *late binding*
and *extreme late binding of everything*). His own words: *"I'm sorry that I long ago coined the term
'objects' for this topic because it gets many people to focus on the lesser idea. The big idea is
'messaging'"* — and the real design work is **how modules communicate (the `ma`, the space between)**,
not what's inside them.

That reframes every row of the Rosetta table. Rees's axis **#6 (message passing / AYCDISAM — "all you
can do is send a message")** stops being one plate on the menu and becomes **the point**:

- **Smalltalk** — `doesNotUnderstand:`, everything is a send; the object is a black box you can only *ask*.
- **Self** — even *slot access is a message*; there is no "field," only a send that a map resolves.
- **NeWS** — the literal endgame: **send the *code*, not the command** — messages are PostScript
  programs shipped to the server (see the TNT section below).
- **Unix `$PATH` patent** — a "message" is `argv` crossing a process boundary; the wire, not the struct.
- **MOOLLM** — skill invocation *is* the message; agents are late-bound black boxes that only exchange
  requests. The "object" is almost incidental; the **protocol between skills** is the design.

So Kay is a **dream guest** precisely because he'd argue the doc is admiring the *lesser* idea. The
fix isn't to demote objects — it's to add a **messaging spine**: for each system, ask *what is a
message, when is it bound, and how late can you rebind it?* (Self: at every slot. NeWS: at ship time.
`$PATH`: at `exec`. MOOLLM: at invocation, by an LLM.) That's a sharper axis than "how do you spell
the parent pointer."

#### MOOLLM's far end: from late binding to *empathic* binding

Kay's continuum has an end that classical systems literally can't reach, and **MOOLLM lives there**.
Late binding classically means *resolve the name at runtime* — but the match function is still
**equality**: Self's map matches a selector, Smalltalk compares a symbol, `$PATH` string-matches an
executable. MOOLLM pushes binding one step past runtime into **intent-resolution time**, and swaps the
match function from *equality* to **empathy**: the resolver is an LLM that binds a request to a skill
by **understanding what you meant** — smart, fuzzy, natural-language matching where the names don't
have to match, only the *intent*. This is, in Don's view, **extremely essential to MOOLLM** — not a
convenience layer but the core dispatch mechanism.

It runs the whole stack, not just method lookup:

- **Empathic dispatch** — a request binds to a skill via advertisement scores *plus* LLM judgment, not
  an exact selector. Misspelled, under-specified, or novel phrasings still resolve.
- **Empathic queries** — ask for *what you want* ("the calm-computing torchbearers") rather than an
  exact key or path; the model resolves it against the world.
- **Empathic templates** — `{{~expression}}` seeds the model *fills by reading intent*, not by string
  substitution. The template is a prompt for meaning, not a mail-merge slot.

So MOOLLM sits at the extreme of the late-binding axis: **binding time = "whenever the model reads
it," match function = empathy, not equality.** It's Postel's robustness principle ("be liberal in what
you accept") cranked all the way up — accept fuzzy human intent, resolve to a clean call. The honest
cost: this binding is **non-deterministic and can mis-bind**, so you trade reproducibility for reach
and pay it back with guardrails — consent, review, provenance (the same LEARN/LIFT gates). Late
binding's power *and* peril, amplified — which is exactly why it's worth putting on the table with Kay.

### How we'd actually run Kay (post-order traversal, then iterate)

Don's proposed protocol for bringing Kay in — and it's a *messaging* protocol, fittingly:

1. **Post-order traversal, pass 1.** Walk the discussion tree **children-first**: resolve the leaves
   (each system's concrete mechanics) before the internal nodes (the cross-cutting claims), so every
   parent statement is already backed by settled subtrees. Produce the composed draft.
2. **Show Kay the composed result** and ask what he thinks — one clean artifact, not a firehose.
3. **Post-order traversal, pass 2 (reply).** Fold his feedback back in the same children-first order,
   so a correction at a leaf propagates up into the summaries that depend on it.
4. **Iterate.** Repeat until the tree stops changing — the discussion's own **fixed point**.

This is deliberately the same shape as **late-bound message send**: each node is a black box that
only answers when *asked*, in dependency order, and the whole thing converges by re-sending rather
than by editing in place. *(Consent first, per this repo's portrayal standards — Kay is invited, and
this is Don's framing of his views from the public record, not a quote put in his mouth. The
`objects-were-the-lesser-idea` line is Kay's own, widely published.)*

Much of the raw material for this is already sitting in plain sight: Kay's long, generous **Quora**
answers and discussion threads. The writing is superb; Quora's *reading* UI is atrocious (expand
every nested comment, collapsed replies, scrambled order). Don is capturing the best and reformatting
them into **readable recaps** — flat, quotable, links preserved — as the discussion inputs we bring
back to Kay: [`../alan-kay/media/quora-recaps/`](../alan-kay/media/quora-recaps/README.md).

## Self is the RISC — and the CHON — of objects

If Rees's menu is the à la carte *cuisine* of OO, **Self is the machine language you cook it in.**
Strip OO down to its irreducible instruction set and you get one primitive: **a slot, and delegation
to a parent slot when a name isn't found locally.** That's the whole ISA. Every fancy item on the
menu is a *macro* you assemble from it:

- **Classes** = a parent object holding the shared slots (a "traits" object); *instances* delegate to it.
- **Inheritance / mixins / multiple inheritance** = one or more `parent*` slots.
- **Message passing** = slot lookup that finds a method slot and runs it.
- **Encapsulation** = which slots you expose vs keep private.
- **Metaclasses, class methods, `super`** = more objects with more parent slots. It's objects the
  whole way up; there is no floor that isn't also a slot.

And because the primitive is so small, **you're not limited to the menu — you can invent dishes
nobody's listed yet.** New dispatch schemes, prototype ecologies, delegation graphs: all just
arrangements of slots and parents. That's the RISC bet exactly — a tiny, uniform, fast core, and
let the interesting structure be *composed*, not baked in. (Not a coincidence: Ungar's earlier work
was literally **SOAR — "Smalltalk On A RISC"** — at Berkeley, RISC's home. Self carried the
minimalist reflex forward: *"The Power of Simplicity."*)

**The CHON analogy (for David, who'll get it).** In **Frederik Pohl**'s **Heechee Saga** — *Gateway*
(1977; it swept the Hugo, Nebula, *and* Locus) and especially its sequel ***Beyond the Blue Event
Horizon*** (1980), where the abandoned Heechee **Food Factory** hangs in the Oort cloud mining a
comet — life is synthesized from four cheap, universal elements: **C**arbon, **H**ydrogen,
**O**xygen, **N**itrogen. Pohl's word for the product is **"CHON-food"**: all the food and
necessities of life, assembled on demand from the four commonest atoms in a comet. **CHON is Self.**
A handful of dumb, universal primitives (slots + delegation), mined cheaply, from which every richer
structure — classes, traits, mixins, whole object cuisines — is **synthesized on demand.** You don't
ship a warehouse of pre-made classes; you ship the four elements and a constructor. That's precisely
the [artifactory](../../process/artifactory.yml)'s **selfish inheritance**: don't instantiate from a
class hierarchy, **clone a prototype and override a few slots** — CHON-food for objects, assembled
fresh in each local world.

*(Two side dishes, because Don brings these up and loves them all. There's a genuinely **great video
game** of this world — Legend Entertainment's **_Frederik Pohl's Gateway_** (1992) and *Gateway II:
Homeworld* (1993), classic illustrated text adventures faithful to the Heechee books. And for the
**comet-life** craving specifically, the desert-island pick is **Gregory Benford & David Brin,
_Heart of the Comet_** (1986) — humans riding Halley's Comet as it grows a living ecosystem — the
CHON-from-comets premise as a whole novel. Kin, not canon here; noted so nobody has to re-derive
the reading list.)*

## Metaprogramming: how each system lets you rewrite its own rules

Unifying these systems on *lookup* is only half the story. The other half is **the meta level** —
how each one lets you **reach in and change the lookup rule itself.** Same spectrum, from "reified
and principled" to "manipulate the substrate and pray":

| System | Meta hook | How you bend the rules |
|--------|-----------|------------------------|
| **CLOS MOP** | the **Metaobject Protocol** — the gold standard | Classes/generic-functions/methods are themselves objects with a documented protocol; override `compute-applicable-methods`, `slot-value-using-class`, `make-instance`, `ensure-class`. The language's own dispatch is a set of methods **you can specialize.** (Kiczales, des Rivières, Bobrow — *AMOP*.) |
| **Smalltalk** | live metaclasses + `doesNotUnderstand:` | Every class is an instance of a metaclass; `doesNotUnderstand:` intercepts misses (proxies, DSLs); `become:` swaps identity across the live image; full reflection because it's all live objects. |
| **Self** | mirrors + assignable `parent*` slots | Reflect through **mirrors**; change inheritance **at runtime** by assigning a parent slot; no classes to placate, so the meta level *is* the base level — objects all the way up. |
| **NeWS `class.ps`** | it's PostScript — homoiconic-ish | The object system is *written in the language* out of dictionaries and the dict stack; you redefine methods by editing dicts and **shipping code to the server.** Metaprogramming = sending a program. |
| **Densmore & Rosenthal `$PATH` patent** | the **filesystem** is the metaobject | Change inheritance by **editing a `PATH` file**; add a slot by **creating a file**; add a parent by appending a directory to the path. The MOP is `cd`, `ln`, and `$PATH`. (See callout below.) |
| **Lua** | **metatables** (`__index`, `__newindex`, `__call`, …) | A handful of metamethods reify exactly the operations you'd want to override — lookup, assignment, call, arithmetic — and nothing else. The whole MOP fits on a page; you compose classes/proxies/inheritance from it. |
| **JavaScript** | `Proxy` / `Reflect` (bolted on late) | ES6 finally added real interception (`Proxy` traps, `Reflect`), plus `Object.getPrototypeOf`/`defineProperty`. Powerful, but arriving *after* `class` sugar had already hidden the prototype — the meta level fights the veneer. |

The lesson rhymes with Rees: **"metaprogramming" isn't one thing either.** CLOS *reifies* the meta
level into a protocol you subclass; Lua *reifies a minimal slice* (metamethods) and stops; Self
erases the base/meta distinction; NeWS and the `$PATH` patent make the substrate itself
(dictionaries, the filesystem) the thing you edit. Different answers to one question: **when the
lookup rule isn't what you want, what do you get to change, and how principled is it?**

### The patent that *is* this thesis — US 5,187,786

David doesn't just have opinions about this equivalence — **he and Owen Densmore patented it.**
**US 5,187,786**, *"Method and apparatus for implementing a class hierarchy of objects in a
hierarchical file system"* (inventors **Owen M. Densmore & David S. H. Rosenthal**, Sun; filed
1991-04-05, granted 1993-02-16, expired 2011):

- Sending a message **changes the current directory to the target class's directory** and **sets
  the search path (`$PATH`) to the contents of that class's `PATH` file**, then executes the method
  found along that path.
- The pseudo-classes are named — no kidding — **`Self`** and **`Super`**: a message to `Self` sets
  the search path *without* changing directory; a message to `Super` sets it to the same path
  **minus the current class's own directory.** That is Smalltalk `self`/`super` dispatch,
  implemented as **`cd` + `$PATH` lookup in a filesystem.**

This is the whole doc as a granted patent: **the Unix directory tree + `$PATH` literally *is* the
method-dispatch mechanism of an object system** — and one of its two inventors is sitting right
here. It's also the same Owen Densmore who wrote `class.ps`, so NeWS and the filesystem-object idea
share an author. (It's a *patent*, so there's a whole second conversation — with David of all people,
given his blogging on IP — about what it means to patent "the filesystem is the object system.")

## Why this is David's conversation

David co-built **NeWS** with Gosling, wrote much of the window-system history, and lived the
PostScript object model when the industry went the other way (X11, which he *also* architected —
he wrote the ICCCM). So the interesting questions are his to answer, not Don's to lecture:

- Was `class.ps` / the NeWS Toolkit consciously Smalltalk-in-PostScript, or did the dict-stack
  *make* you reinvent objects whether you meant to or not?
- "Send code, not commands" vs today's REST/JSON "send commands, not code" — did the industry pick
  the worse abstraction, and is the wheel turning back (edge functions, WASM, code-shipping again)?
- The filesystem-as-object-system idea (Plan 9, `/proc`, everything-is-a-file) vs window-system
  object models — same instinct, different decade?
- **US 5,187,786** — what was the story? Was "the filesystem *is* the class hierarchy, `$PATH` *is*
  dispatch, with pseudo-classes `Self` and `Super`" a serious system, a demo, or a lark — and how do
  you feel now about it being a *patent* (given your later writing on IP)?
- Metaprogramming across the board: CLOS reifies a whole **MOP**; Lua reifies a **minimal** slice
  (metatables); Self erases base-vs-meta; NeWS/`class.ps` and your patent make the **substrate**
  itself the metaobject. Which stance ages best — and which is right for an LLM-driven constructor?
- Where did JavaScript go wrong, and where (grudgingly) right — and is **Lua** the language that
  kept Self's simplicity JS threw away?
- **The substrate shapes the model.** NeWS has *no parent pointer* — inheritance is the dict stack
  (plus separate exec and `gsave` stacks). Self points a `*`-slot at an anonymous object; a config
  system points at a *name* in a registry. Did the PostScript stack *force* NeWS's object shape, and
  what does that say about picking a representation (live pointer vs. serializable name) for objects
  meant to be shipped, saved, and merged?

## The two TNTs and the instance/parent/super dance (Don's firsthand)

This is where Don stops theorizing and starts *remembering*, because he lived it. **NeWS played some
cool tricks and dances with PostScript to resolve `instance` / parent / `super`** — all dynamically,
in the interpreter, on the dict stack (no built-in class keyword to lean on). That machinery got
reworked to support **multiple inheritance** when **The NeWS Toolkit (TNT)** was built, and getting
MI right on a dict-stack substrate is exactly the "how do you represent the parent and the search
order" problem from the table above — made concrete, in shipping code.

Don's firsthand thread (his own work; others' contributions are theirs to describe):

- There were **two versions of TNT.** Don read and hacked on the **first** — building **tabbed window
  frames** and **pie menus** for it.
- Then he **joined Sun**, where the team **rewrote TNT from the ground up**. **"Half the size and
  twice the speed" was the war cry** — and the joke is that it was *literally true*, because **TNT 1.0
  was so fluffy, bloated, and overengineered** that halving it and doubling its speed was achievable,
  not hyperbole. The rewrite was **service-based**, with a long list of architectural improvements Don
  would love to walk through.
- Afterward he **reimplemented pie menus and tabbed windows** *again*, and built an **X11 window
  manager** around them (carrying the NeWS interaction ideas across to the X world).
- **The litmus test.** Building **pie menus + tabbed windows** on *each* toolkit is Don's deliberate
  **proving ground for UI toolkits** — the two widgets are chosen because they *stress the
  architecture*: pie menus exercise custom interaction, tracking, timing, and geometry (Fitts's-law
  radial hit-testing, not a static list); tabbed window frames exercise decoration, layout,
  containment, and window management. Implement both and a toolkit's real bones — its object model,
  event plumbing, and extensibility — have nowhere to hide. Don has run this same test across all
  three (TNT v1, the rewritten TNT, and X11), which is exactly why he can compare their architectures.

That arc is a perfect **NeWS-reunion** conversation — one Don would love to have **with Owen
Densmore** (who wrote the `class.ps` object system), **David Rosenthal** and **James Gosling** (NeWS
itself), and **[Arthur van Hoff](../arthur-van-hoff/)** — who did *not* build TNT (that was Sun's
own NeWS group; Don's team rewrote it later), but who built **GoodNeWS → HyperNeWS → HyperLook** and
the **PdB ("Pure dead Brilliant")** object-oriented **C → PostScript compiler** — a whole *other*
answer to "objects in PostScript," where you could subclass a PostScript class in PdB and a PdB class
in PostScript. (Firsthand thread, Don's: Arthur came to **Sun** to collaborate on the design of
**HyperNeWS 2.0** using PdB — Don still has the design docs and code samples — but Sun decided not to
hire him, so Don went to the **Turing Institute in Glasgow** to build **HyperLook** with him and port
**SimCity** to it for **DUX**. See [Arthur's page](../arthur-van-hoff/ideas.md).) Questions to explore
*with* them (theirs to answer, not Don's to assign):

- What were the actual **PostScript tricks** for `self`/parent/`super` — `currentdict`, `begin`/`end`
  gymnastics on the dict stack, a class dict chain — and how did they change to admit **multiple
  inheritance** in TNT?
- What did the **ground-up rewrite** really buy? Where did TNT 1.0's *fluff and overengineering* live,
  and which specific **architectural improvements** ("half the size, twice the speed," service-based)
  delivered the win — object model vs. service boundaries vs. event/interaction plumbing? (Best judged
  against the same **pie-menu + tabbed-window litmus test** built on both versions.)
- **Send code, not commands** in the flesh: a window/widget toolkit shipped as *PostScript programs*
  to the server. What did that make easy that today's *send-commands* toolkits still can't?

*(Related in-repo: the [NeWS reunion](../../repo-shows/INDEX.yml) thread — James Gosling and Arthur
van Hoff feed it — and the [`send-code-not-commands`](../../process/trails/send-code-not-commands.md)
trail. Firsthand account from Don, the host; corrections and additions welcome from anyone who was
there.)*

## Two more at the table: Dan Ingalls and Dave Ungar

David anchors this from **NeWS/PostScript and the filesystem**. But the same argument has two other
living authors who'd sharpen it from the *language* side — and they belong in the room, on their own
terms and with their own consent.

### Dan Ingalls — the manifesto, one primitive, and self-hosting live objects

Dan is the architect who *implemented* Smalltalk (five generations), and his angle here is
foundational:

- **"Design Principles Behind Smalltalk"** (BYTE, 1981) is the manifesto version of this whole doc:
  *everything is an object*, a **uniform metaphor**, the **reactive principle**, factoring, and
  "Personal Mastery." When we say "bag of named things + ask my parent," Dan wrote the principled
  case for *why* that uniformity is the point.
- **BitBlt is the CHON move applied to graphics.** Dan reduced all bitmap graphics to **one general
  operation** and composed everything (windows, text, menus — which he also invented) from it.
  That's exactly the Self-as-RISC/CHON instinct: find the smallest universal primitive, synthesize
  the rest. Two clean examples of the same taste, one for objects, one for pixels.
- **Squeak is self-hosting** — Smalltalk written *in itself*, made portable by a Smalltalk→C
  translator. A system that **builds and reproduces itself**: von Neumann's constructor and the
  [artifactory](../../process/artifactory.yml) in one breath.
- **Lively Kernel / Lively Web** — live objects in the browser that can **save new versions of
  *themselves* as web pages.** An object system that is its own artifactory: edit it while it runs,
  and it persists the result. (Dan's most recent research home for this was **Y Combinator Research /
  HARC**.)

**The Ink & Switch kinship (kinship, not payroll).** Ink & Switch — the local-first / *malleable
software* lab — cites Dan's work (**Fabrik**, **Lively**) as an influence, and its **Automerge**
(a CRDT library) makes "**merge branched replicas with no central server**" an off-the-shelf
primitive. That is the same idea as the artifactory's git cosmology from a different direction:
**merge reconciles branched worlds; share content, not clocks; local-first = massively-single-player.**
So Dan's live/malleable lineage is the *ancestor* of that program — a great thing to explore with
him, without claiming he's on the Ink & Switch team (the public record shows influence, not
membership).

*Questions to explore **with** Dan (not positions assigned to him):* Is "live + malleable +
self-saving" (Lively) the same wish as "the filesystem is the object system" (David's patent) and
"git is time over the namespace" (the artifactory) — three faces of *one* live, persistent object
world? And does CRDT-merge (Automerge) or git-merge better fit an LLM-driven constructor?

### Dave Ungar — Self's simplicity, and *relativistic* time

Dave (with **Randall Smith**) built **Self** — the clean prototype pole of the Rosetta table — and
two threads of his work bear directly on this discussion:

- **The implementation vindicated the idea.** Self's **maps** and **polymorphic inline caches**
  (with Chambers, Hölzle, and later **Lars Bak**) are how you make "delegate to a parent slot" fast
  — and that same lineage runs straight into **HotSpot and V8**. The delicious irony: JavaScript
  threw away Self's *clean model* but runs fast today **because of Self's implementation tech.** Dave
  can tell that story first-hand.
- **"Everything You Know (About Parallel Programming) Is Wrong!"** — Dave's later "wild screed"
  argues for **giving up perfect synchronization** and tolerating a more *relativistic*, race-y,
  approximate computation to scale. That is startlingly close to the cosmology's **"no global clock —
  time slips at different rates in different worlds, so celebrate it."** Whether git's causal-DAG
  partial order is the disciplined version of Dave's relativistic instinct is a genuinely open,
  genuinely fun question to put to him.

*Questions to explore **with** Dave:* Is prototype delegation (clone + override a few slots) the
right base for an LLM constructor over class instantiation? And does his "abandon global
synchronization" argument endorse the many-worlds/local-time cosmology — or warn against it?

## The MOOLLM / artifactory connection

This is also **exactly** what Don's MOOLLM runs on, from the opposite direction. MOOLLM treats the
**filesystem tree as a prototype object system**: a character/skill directory is an object; its
"upstream soul + local overlay" is a **`parent*` slot plus local slots** (Self delegation); cloning
a prototype is `INSTANTIATE`. The [artifactory](../../process/artifactory.yml) skill calls this
**selfish inheritance**, and its **cosmology** says git is time flowing over that static namespace.
So David arrives at "it's all one namespace with delegated lookup" from **NeWS/Sun**, and Don
arrives at the same place from **MOOLLM** — two roads, one insight.

### The missing link: Pantomime's JSON object system → the config system → MOOLLM (Don's firsthand)

Don's road didn't jump straight from NeWS to MOOLLM — there's a concrete bridge, and it's his own
shipping code: **Pantomime's JSON object system.** Pantomime (a Unity-based AR/VR project) grew a
**reflective, dynamic, self-inspired object system expressed entirely in JSON**, and *that* system is
the direct ancestor of both **Don's current JSON/YAML config system** and **MOOLLM**. It is the
"Don's JSON self-ish config" row of the substrate table, told as history. What it did:

- **Plugin objects** — behavior added by composition, discovered and wired dynamically.
- **A multiplayer networking protocol** — objects and their changes synced across clients (the
  networked-object idea from NeWS, reborn on JSON).
- **A reflective, dynamic object system** — objects that can inspect and reshape themselves at runtime.
- **Multiple inheritance and mixins**, used the way this whole doc argues you *can* use them: for
  **templates, classes, object definitions and their variations**, *and* for **build configurations**
  across many apps and platforms — **iPhone, iPad, Android, GearVR headset, laptop, desktop.**
- **"Digital-twin" realistic, to-scale 3D models** for all those platforms, in many variations — all
  driven by the *same* self-inspired, **JSON-centric configuration and networking protocol.**

That's the thesis proven in production: a single **name + delegated-lookup** object model (MI + mixins
over JSON) spanning code, content, *and build config*, across a half-dozen device substrates at once —
exactly the "one namespace, many overlaid trees, serializable names not live pointers" argument from
the substrate section. MOOLLM inherited its bones: **JSON/YAML config as a prototype object system,
names-as-K-lines instead of pointers, mixins/MI for variation.** (Firsthand, Don's; in-repo traces:
[`../don-hopkins/media/pantomime/`](../don-hopkins/media/pantomime/). The lineage is
**Self → NeWS/HyperLook → Pantomime JSON → Don's JSON/YAML config → MOOLLM.**)

Pantomime was **[David Levitt](../david-levitt/)'s** company (Levitt CEO, Don Chief Architect) — a fun
guest to invite to walk through it, alongside **ConnectedTV**, **Bounce** and other **Interval
Research** projects, **VPL**'s early VR, and (of course) **music** (his MIT/Minsky AI-music work, a
natural pairing with composer **Jerry Martin**). See [David's page](../david-levitt/ideas.md).

### From menu to kitchen: Rees's cuisine, cooked as MOOLLM-extended Anthropic skills

This isn't only theory — Don is **implementing Rees's à la carte menu as actual skills.** MOOLLM
skills build on **Anthropic's Agent Skills** as the shared foundation (documentation-first,
`SKILL.md`, tool definitions, a `skills/` library), then **extend the skill protocol** with a
concrete, growing, *measurable* set of additions. The list isn't hand-waving; it's enumerated in
MOOLLM's own `skills/skill/SKILL.md` ("What We Share with Anthropic" + "MOOLLM's Unique
Contributions", **§1–10** with a summary table). It currently stands at **ten and growing**:

1. **Skills as prototypes** (Self-like inheritance) — clone + delegate, not instantiate-from-class
2. **Cards** — playable capability bundles (`CARD.yml` advertisements)
3. **K-lines** — names as activation vectors (Minsky)
4. **Ambient skills** — always-on behavioral shaping
5. **Empathic templates** — semantic (not string) instantiation
6. **Multi-tier state persistence** — skills stop being stateless
7. **Speed-of-light** — proven multi-agent simulation
8. **Ethical framing** — room-based context inheritance
9. **Triadic manifestation** — a skill is simultaneously room / character / object
10. **Codebase as a navigable world**

Crucially, **the menu items and the machinery that serves them are themselves skills.** The
Self→MOOLLM mapping this whole doc is about — prototypes, slots, delegation, inheritance — is written
down as protocol, not vibes: MOOLLM's `skills/skill/delegation-object-protocol.md` and
`skill-instantiation-protocol.md` define how "clone a prototype and override a few slots" actually
executes. Underneath the skills sits the **MOOLLM kernel** (`kernel/ARCHITECTURE.md`) and its
**naming conventions** (`kernel/naming/` — K-lines, path variables, constellations; plus
`kernel/DIRECTORY-AS-OBJECT.md`, `kernel/CARDS-AS-OBJECTS.md`, `kernel/SELFISH-COM-IMPLEMENTATION.md`)
— which is precisely "a namespace of named slots + delegated lookup" made load-bearing. So the
Rosetta table's thesis is a **running system**: Self's `parent*` slot is a directory's upstream
soul; NeWS's dict stack is the kernel's lookup order; the `$PATH` patent's search list is MOOLLM's
delegation chain — implemented as Anthropic-compatible skills you can open, run, diff, and revert.

*(Roughly against Rees's axes: #5 "everything is an object" and #8 "implementation inheritance" fall
straight out of directory-as-object + delegation; #6 "message passing" is skill invocation; the rest
of Rees's menu maps onto individual skills. This is Don's framing of the mapping, offered for David
to poke holes in — the files are all upstream in the MOOLLM repo.)*

### Put the artifactory skill on the table

The [`artifactory`](../../process/artifactory.yml) is a MOOLLM skill (the "Engine of Creation"):
read / write / edit / destroy / persist artifacts across the filesystem and git, with prototype
`INSTANTIATE` (clone + delegate) as its core. It's a concrete **object-to-think-with** — so it's
worth handing to David and asking how it looks through each of these lenses. Don's questions to
explore *with* David (open questions, not positions Don is assigning to him):

- **Is the artifactory just NeWS's bet, moved up a layer?** NeWS said *send code, not commands* —
  ship a PostScript method to the server. The artifactory ships **skills (code) as YAML (data)** for
  an LLM to evaluate. Same wager, new substrate? Or did the JSON/REST *send-commands* world win for
  reasons that also apply to agents?
- **Which object substrate is right for an LLM-driven constructor** — Self-style prototypes
  (clone+delegate), Smalltalk classes, PostScript dict-stack, or the Unix directory tree? MOOLLM
  picks *directory-tree-as-prototype*. What does that get right, and where will it hurt?
- **Persistence vs preservation.** The artifactory keeps construction history in git; **LOCKSS**
  keeps *lots of copies* so nothing rots. Is versioned construction a **preservation** problem in
  disguise — and what would David, of all people, demand of it before trusting it to last?
- **The governor.** Self-reproducing constructors risk *Autofac* runaway; the artifactory answers
  with reversibility + human-in-the-loop + provenance. Do those hold up as real "conservation laws,"
  or are they hopeful?

*(These live upstream in the MOOLLM `artifactory` skill — GLANCE/CARD/SKILL/README — whose
*Selfish inheritance* and *cosmology* sections make the same claims this doc makes.)*

## Draw in (their consent, together)

| Who | Seat |
|-----|------|
| [David Rosenthal](./) | NeWS / PostScript `class.ps`; the anchor |
| [Owen Densmore](../owen-densmore/) | **Wrote the NeWS class system** — object-oriented PostScript |
| [David Ungar](../david-ungar/) | **Self** — prototypes, slots, delegation (the clean prototype pole); maps/PICs → V8; "relativistic" parallelism |
| Alan Kay | **Dream guest** — messaging over objects; late binding of *everything*; "the big idea is messaging," if reachable |
| [Dan Ingalls](../dan-ingalls/) | **Smalltalk** — *Design Principles*, BitBlt, self-hosting Squeak, live/malleable **Lively**; kin to Ink & Switch's local-first work |
| [James Gosling](../james-gosling/) | NeWS co-author; PostScript engine |
| [Arthur van Hoff](../arthur-van-hoff/) | **Invite to the NeWS reunion** — GoodNeWS → HyperNeWS → HyperLook; **PdB** (OO **C → PostScript** compiler); Don's Turing-Institute collaborator (HyperLook + SimCity) |
| Gregor Kiczales | *(not a guest)* — **CLOS MOP** / *AMOP*; metaprogramming as a reified protocol, if reachable |
| Roberto Ierusalimschy | *(not a guest)* — **Lua**; metatables as the minimal MOP, if reachable |
| Oliver Steele | **Instance-First Development** / Instance Substitution Principle; OpenLaszlo (LZX); prototype+constraint UI, if reachable |
| Brendan Eich | *(not a guest)* — JavaScript's prototypes-plus-class-veneer, if reachable |

## Credit where due — the groups, not just the front names

These weren't lone geniuses; each is a lab and a crew. Naming the groups on purpose:

- **Self** — David Ungar **and Randall B. Smith**, with **Craig Chambers, Urs Hölzle, Bay-Wei
  Chang, Ole Agesen, Lars Bak** and the Stanford/Sun Self team (maps, PICs, traits).
- **Smalltalk** — **Alan Kay, Dan Ingalls, Adele Goldberg, Larry Tesler, Dave Robson** and the
  Xerox PARC Learning Research Group.
- **NeWS** — **James Gosling & David Rosenthal** (the language + system; with **Michelle J. Arden**,
  co-author of *The NeWS Book*), **Owen Densmore** (the object system / `class.ps`), the **Sun NeWS
  Toolkit (TNT)** group, and **Arthur van Hoff** (independently: **GoodNeWS/HyperNeWS/HyperLook** and
  **PdB** at the Turing Institute — the HyperCard-on-NeWS branch).
- **Unix / the tree** — **Ken Thompson & Dennis Ritchie**; **Rob Pike & the Plan 9 team** for
  per-process namespaces and the everything-is-a-file endgame.
- **JavaScript** — **Brendan Eich** (who has always been candid that prototypes came from Self and
  the class veneer came later under pressure).

*If Don named a person and skipped their collaborators, that's a gap to fix, not a verdict — add
the missing names via PR or issue.*

## Sources

- David co-authored *The NeWS Book* (Gosling, Rosenthal, **Arden**; Springer, 1989) · DSHR blog: https://blog.dshr.org/
- **Arthur van Hoff** — **GoodNeWS → HyperNeWS → HyperLook** and **PdB** ("Pure dead Brilliant", OO **C → PostScript**) at the **Turing Institute**, Glasgow; Don ported **SimCity** to HyperLook (team: van Hoff, Dug Scouler, Hopkins). [HyperLook catalog](https://www.donhopkins.com/home/catalog/hyperlook/index.html) · [Medium writeup](https://donhopkins.medium.com/hyperlook-nee-hypernews-nee-goodnews-99f411e58ce4) · guest page: [`../arthur-van-hoff/`](../arthur-van-hoff/)
- Owen Densmore, "Object-Oriented Programming in NeWS" (1986); the NeWS Toolkit (TNT)
- **John Warnock, "linguistic motherboard"** — PostScript as a board with *slots* for *cards* (graphics first; file-server, object system, window system next). Primary source: **Owen Densmore → Don Hopkins email, 1990** ([linguistic-motherboard-owen.txt](https://donhopkins.com/home/archive/NeWS/linguistic-motherboard-owen.txt) · [notes](https://donhopkins.com/home/archive/NeWS/linguistic-motherboard.txt) · [HN](https://news.ycombinator.com/item?id=22456710)); realized by **NeWS** (programmable network, host/device-independent) and **NeFS**; kin to Xerox PARC's **PCR**
- Ungar & Smith, "Self: The Power of Simplicity" (OOPSLA 1987); "Organizing Programs Without Classes" (1991)
- Ungar et al., **SOAR — "Smalltalk On A RISC"** (Berkeley, 1980s) — the RISC-minimalism reflex that runs through Self
- **Densmore & Rosenthal, US Patent 5,187,786** — "…class hierarchy of objects in a hierarchical file system" (Sun, 1993): messages `cd` to a class dir and set `$PATH` from a `PATH` file; pseudo-classes `Self` and `Super`. [Google Patents](https://patents.google.com/patent/US5187786A/en)
- **Oliver Steele, "Classes and Prototypes" / Instance-First Development** ([blog.osteele.com, 2004](https://blog.osteele.com/2004/03/classes-and-prototypes/)) — implement the instance, refactor the class out of it; avoids *premature abstraction*; the **Instance Substitution Principle** (instance ≡ its own definition; class/instance syntax parallel), realized in **OpenLaszlo (LZX)**; kin to CMU's **Garnet**
- **Hierarchy-by-naming-convention** — **Tcl** namespaces (`::a::b::c`, `namespace eval`; objects/classes by convention pre-TclOO); **classic PHP / Drupal** class names (`views_handler_field_node`) with **PSR-0/PSR-4** autoloading mapping `_`/`\` → directories; **Java packages → dirs** — the *string is the tree*. Contrast **CLOS class-precedence list / C3 linearization** (MI as a DAG you linearize, not a tree you walk)
- **Kiczales, des Rivières & Bobrow, *The Art of the Metaobject Protocol* (AMOP)** — CLOS MOP; dispatch you can specialize
- **Ierusalimschy et al., Lua** — *Programming in Lua*; metatables / `__index` as a minimal, orthogonal MOP (Self's simplicity kept); the small **C API** for embedding/extending; **lgi** (Lua ↔ GObject-Introspection) and **SWIG** (auto-generated wrappers) as bridging exemplars
- **SWIG** (Beazley et al.) & **Emscripten / Embind** (Zakai et al.) — automated cross-substrate object-model bridges: SWIG C/C++ → Python/Tcl/Lua/…; Embind C++ ⇄ **JavaScript** across the **WebAssembly** boundary (prototype-fronted proxies over C++ objects in linear memory). Live use: **[MicropolisCore](https://github.com/SimHacker/MicropolisCore)** (C++ SimCity engine → WASM via Embind)
- Kay / Ingalls, Smalltalk-80; PostScript Language Reference (dictionaries & the dict stack)
- **Alan Kay** — "prototypes vs. classes was a false dichotomy… the big idea is *messaging*" and *"I'm sorry that I long ago coined the term 'objects'… it gets many people to focus on the lesser idea"* (Kay, email to the Squeak list, 1998; echoed in "The Early History of Smalltalk," HOPL-II, 1993) — messaging + extreme late binding over objects
- **Dan Ingalls, "Design Principles Behind Smalltalk"** (BYTE, Aug 1981); **BitBlt**; **Squeak** (self-hosting, Smalltalk→C); **Lively Kernel / Lively Web** (live, self-saving objects; YC Research / HARC)
- **Ink & Switch** — local-first & malleable software; **Automerge** (CRDT merge, no central server); cites Ingalls's Fabrik/Lively as influence: https://www.inkandswitch.com/
- Ungar, Chambers, Hölzle, Bak — Self **maps** & **polymorphic inline caches** → HotSpot/V8; **David Ungar, "Everything You Know (About Parallel Programming) Is Wrong!"** (relativistic/anti-sync)
- **Frederik Pohl, the Heechee Saga** — *Gateway* (1977; Hugo/Nebula/Locus) & *Beyond the Blue Event Horizon* (1980): the **Food Factory** and **CHON-food** synthesized from C/H/O/N mined from a comet (the Self-as-primitives analogy)
- **Legend Entertainment, *Frederik Pohl's Gateway*** (1992) & *Gateway II: Homeworld* (1993) — the beloved Heechee-Saga adventure games
- **Gregory Benford & David Brin, *Heart of the Comet*** (1986) — the comet-life novel (humans + ecosystem aboard Halley's Comet)
- **Paul Graham, "Why Arc Isn't Especially Object-Oriented"** ([noop.html](https://paulgraham.com/noop.html)) — OO "à la carte"
- **Jonathan Rees, "Rees Re: OO"** ([reesoo.html](https://paulgraham.com/reesoo.html)) — the 9-item à la carte menu; OO as arbitrary subsets
- **MOOLLM skill protocol** (extends Anthropic Agent Skills): `skills/skill/SKILL.md` — "What We Share with Anthropic" + "MOOLLM's Unique Contributions" §1–10 (the tangible, growing extension list)
- **MOOLLM Self→prototype implementation**: `skills/skill/delegation-object-protocol.md`, `skill-instantiation-protocol.md`; `kernel/ARCHITECTURE.md`; `kernel/naming/` (K-lines, path variables, constellations); `kernel/DIRECTORY-AS-OBJECT.md`, `kernel/CARDS-AS-OBJECTS.md`, `kernel/SELFISH-COM-IMPLEMENTATION.md`
- Related here: [`window-systems-lineage.yml`](window-systems-lineage.yml) · [`../../process/artifactory.yml`](../../process/artifactory.yml) · MOOLLM `artifactory` skill (*Selfish inheritance*)

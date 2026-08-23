# How to Deconstruct Almost Anything (Again)
## My Oriented Adventure Through Classes, Objects, and Slot Soups

*(After Chip Morningstar's ["How to Deconstruct Almost Anything"](http://www.fudco.com/chip/deconstr.html), Second International Conference on Cyberspace, 1991 — and after MOOLLM's ["How to Incarnate Almost Anything"](https://github.com/SimHacker/moollm/blob/main/designs/postmodern-deconstruction.md), which proved the formula travels.)*

**Don Hopkins**  
*Department of Oriented Programming, University of the Slot Soup*

---

> ### Acknowledgment

> Chip Morningstar went to a postmodern conference so we wouldn't have to.
> He returned with the news that deconstruction is mostly five steps and
> a sense of humor. David Ungar went further: he **deconstructed Smalltalk
> in public**, twice — first into Self, then into Korz — and neither time
> did the sky fall. The JIT got *faster*. This paper applies Chip's
> formula to that demolition crew.

> Morningstar deconstructed academic prose. MOOLLM deconstructed YAML.
> We deconstruct **paradigm names** — because *Object-Oriented Programming*
> minus the `Object` guard is just **Oriented Programming**, and everything
> else is **Disoriented Programming**. ;)

---

> "Academics get paid for being clever, not for being right."  
> — Donald Norman (via Morningstar)

> "The map is not the territory."  
> — Alfred Korzybski (via Ungar, via Korz)

> "We removed classes and got Self; then we removed the objects themselves.
> Or rather, self itself."  
> — Don Hopkins, on Stephen Wolfram's wall, 2026

---

## Prologue: What "Oriented" Meant Before We Ruined It

To **orient** (Latin *oriens*, the rising sun, the east) was to establish
your bearing: which way is the frame, which axis organizes action. An
**oriented** language is not a language *about* objects. It is a language
where behavior is **relative to a stance** — indexed by named dimensions,
not grounded in nouns pretending to be physics.

Every *X-Oriented Programming* freezes one guard on one axis and
trademarks the compass:

| Paradigm | Frozen guard | Bearing |
|----------|--------------|---------|
| Object-oriented | `{rcvr: …}` | behavior indexed by receiver |
| Subject-oriented | `{subject: …}` | behavior indexed by composer |
| Context-oriented | `{context: …}` | behavior indexed by situation |
| Aspect-oriented | `{aspect: …}` | behavior indexed by cross-cut |

Korz's move: **ditch the modifier**. Oriented Programming — *N*
dimensions, none privileged in the name. Freeze only `rcvr` and OO
reappears as a **view**. Leave all guards open and you have a **sea of
slots**.

Corollary: paradigms that name one axis and ignore the rest are
**Disoriented Programming**.

Now. Chip's formula.

---

## The Five Steps (Morningstar's Patent Pending)

1. **Select a text.**
2. **Decide what the text says.** (Your reading — any reading.)
3. **Identify a distinction** the text presupposes.
4. **Convert the distinction to a hierarchical opposition** (society
   presumes the superiority of one pole).
5. **Derive a self-referential reading** that reverses or dissolves the
   hierarchy — ideally one that makes the text undermine itself.

Deconstruction is not destruction. It is **showing that the text already
contradicts its own premises** once you notice which guard it froze.

We run the formula twice: on **Class**, then on **Object**.

---

## Part I: Declassification — From Class to Object

### Step 1: Select a text

```smalltalk
Account subclass: #SavingsAccount
    instanceVariableNames: 'balance'
```

Or, if you prefer the ceremonial version: **"Everything is an object."**

### Step 2: What the text says

The class **is** the essence of the account. Instances **are** accounts
because they **are** members of the class. Behavior lives in the
taxonomy; objects are tokens stamped from the mold.

### Step 3: The distinction

**CLASS / INSTANCE** — type versus token. Essence versus accident.
Plato's lobby, air-conditioned.

Also smuggled in: **TAXONOMY / BEHAVIOR** — the hierarchy is primary;
what happens at runtime is derived.

### Step 4: Hierarchical opposition

Programming culture presumes **CLASS > INSTANCE**. The class file is
where the author works. The debugger shows class names. Design patterns
are named after class diagrams. The instance is a second-class citizen
— literally.

### Step 5: Self-referential reading — **Declassification**

David Ungar and Randall Smith performed the reversal in 1987:

> What if the class hierarchy is not the ground truth, but a **view**?
> What if objects inherit from objects, and "class" is just another
> object you can ignore?

**Declassification** is not anti-object. It removes the **privileged
guard** `{decomposition: class}`. The sea of behavior remains. Objects
remain. Classes become **optional grouping** — a dimension you may
project, not the axis the runtime obeys.

Self's paper title is the whole joke: *"Self: The Power of Simplicity."*
Remove the complicated thing. Keep the power. The JIT watches what
actually happens at send sites, not what the UML diagram claims.

**The class deconstructs itself:** it was always a **compression** of
prototype relations for human readers. Strip the compression; the
computation was already object-to-object.

| Before | After declassification |
|--------|------------------------|
| Class defines essence | Prototype defines delegation |
| Instance is-a Class | Object delegates-to Object |
| Refactor = move methods up/down | Refactor = rewire prototypes |
| JIT compiles class shapes | JIT compiles **what got sent** |

Smalltalk's text said classes were fundamental. Self's runtime said
otherwise. Self won on speed. The hierarchy was **literary**.

---

## Part II: Deobjectification — From Object to Slot Soup

### Step 1: Select a text

```smalltalk
anAccount withdraw: 100.
```

Or: **"A message is sent to a receiver."**

### Step 2: What the text says

There **is** an object `anAccount`. It **has** the method. The message
goes **to** it. One receiver. One privileged actor. The Single Agent
theory, frozen in syntax.

### Step 3: The distinction

**RECEIVER / EVERYTHING-ELSE** — one coordinate is sacred. Context,
caller, thread, security domain, assertion mode, user, device, time —
all secondary, unmentioned, or bolted on later (aspects, annotations,
thread-locals, dynamic scope, `Environment` records, …).

Also: **OBJECT / SLOT** — the object is the unit of ownership; slots
belong to it.

### Step 4: Hierarchical opposition

OO culture presumes **RECEIVER > CONTEXT**. The first argument is
special. `self` is a keyword. Multimethods are exotic. Subject-oriented,
context-oriented, and aspect-oriented programming are **separate
paradigms** because they weren't allowed to dissolve the receiver.

Minsky, 1982: *"Self, itself, is not a single thing."* Eleven years
before Self 1.0 shipped.

### Step 5: Self-referential reading — **Deobjectification**

Ungar, Ossher, and Kimelman performed the second reversal (Korz, Onward!
2014):

> What if the object boundary is not the ground truth, but a **view**?
> What if a program is a **sea of slots**, and "object" is what you see
> when you gather slots along the `rcvr` dimension?

**Deobjectification** removes the privileged guard `{dispatch: single-receiver}`.

What remains:

- **Slots** — data and methods, owned by nothing.
- **Dimensions** — `rcvr`, `assertions`, `user`, `device`, …
- **Guards** — each slot says which coordinates it cares about.
- **Context** — bindings flowing implicitly down the call chain.
- **Symmetric dispatch** — match the **whole** context; no receiver.

The worked example: `pop()` guarded `{rcvr ≤ stack}`. Add assertions
later: second `pop()` guarded `{rcvr ≤ stack, assertions ≤ true}`.
`main()` never mentions assertions again. No Visitor. No aspect weave.
No refactor cascade. A new **orientation** arrived; the sea rearranged.

**The object deconstructs itself:** it was always a **projection** of
slot soup along one dimension. Freeze `rcvr` → familiar nouns. Freeze
`assertions` → checking layer. Freeze `user` → subjective view. Same
sea. Different bearing.

| Before | After deobjectification |
|--------|-------------------------|
| Object owns slots | Slots pertain to coordinates |
| Message → receiver | Send → context match |
| `self` is special | `rcvr` is one dimension |
| Add concern = refactor graph | Add concern = add dimension + guards |
| Multimethods = exotic | Symmetry = default |

Self removed **classes**. Korz removed **objects**. The pattern is
identical: remove the guard that pretended to be physics.

---

## Part III: Oriented Programming (Bare)

Strip both deconstructions to the residue:

**Oriented Programming** = behavior from **alignment along named
dimensions**, with no dimension ontologically privileged in the language
name.

- **Declassification** = `{decomposition: class}` becomes optional view.
- **Deobjectification** = `{dispatch: rcvr}` becomes optional view.
- **Korz** = the slot soup + guard lattice made explicit.
- **Korz′** = same semantics; strict tier crystallizes; soft tier (Zork)
  improvises and lifts rulings into slots.

The Ungar arc in one line:

```
Smalltalk  →  Self  →  Korz
(molecules)    (atoms)   (quarks)
 classes       objects    boundaries
```

Or in Morningstar's voice: each step **selects a smaller text**, finds
a **smaller distinction**, and discovers the previous text was **already
about the thing it claimed to own**.

---

## Part IV: Disoriented Programming (The Other Kind)

A language is **disoriented** when it:

1. **Names one axis** in the paradigm (`Object`, `Class`, `Function`)
   but **runs on many** unstated dimensions.
2. **Uses "is"** for identity (Korzybski's sin) instead of indexed
   behavior.
3. **Forces homing** — to the class file, the mouse, the menu bar —
   instead of letting the frame come to the work (pie menu at cursor,
   TrackPoint at home row, radial menu at the tracking cross).

Java is disoriented. C++ is disoriented. Most "OO" shops are
disoriented in the Korzybski sense: they talk as if objects are
**territory**, while actual behavior depends on classloader, thread,
transaction, annotation, profile, AOP weave, and seventeen other
dimensions not in the name.

They are not wrong to use those dimensions. They are **disoriented** to
pretend only one appears on the compass rose.

---

## Part V: A Deconstruction Exercise (Graded)

**Beginner:**
- `Account subclass: #SavingsAccount` — declassify into prototypes
- `anAccount withdraw: 100` — who is the real receiver?
- The phrase "object-oriented"

**Intermediate:**
- CLOS `:before`/`:after`/`:around` — demons as guard dimensions
- AspectJ pointcuts — aspects as late admission the receiver wasn't enough
- `doesNotUnderstand:` — the hatch that proves dispatch was always negotiable

**Advanced:**
- Korz `pop()` + `{assertions ≤ true}` — implicit context flow
- Margolus CA neighborhood — receiverless multimethod in silicon
- MOOLLM reading a git tree as Self — filesystem as one-dimensional Korz

**Tour de force:**
- The FOOL 2014 title: *Foundation for Object-, Aspect- and Context-Oriented Programming* — three paradigms, one mechanism, still three guards in the name
- This document
- Asking David Ungar whether he'd rename Korz **Oriented Programming** and drop the modifier guard entirely

---

## Conclusion: The Slot Soup Was Always Already There

Buried under the postmodern muck — and there is muck; Morningstar
warned us — are practical claims:

1. **Classes were documentation** compressing prototype graphs for
   humans. Declassification made machines faster.

2. **Objects were projections** gathering slot soup along `rcvr`.
   Deobjectification makes other projections first-class.

3. **"-Oriented"** in a paradigm name marks the frozen guard, not the
   deepest truth. Oriented Programming names the general case.

4. **Disoriented Programming** is what happens when you freeze one
   guard in the brand but not in the runtime.

5. **Korz** is Oriented Programming with the guards visible. **Korz′**
   adds a second dispatcher for when the lattice hasn't crystallized yet.

Chip went to cyberspace and learned how to read a paper so it reads
itself. David went to Smalltalk and learned how to read a language so
it **dissolves its own nouns**. We went to a Hacker News thread about
phosphor and came back with Heinz's draftsman template, Ted Selker's
Joy Button, and the suspicion that **PIXIE was oriented programming in
1969** — drawing gestures indexed by direction, domain, and hand — before
the word *object* colonized the compass.

The sea of slots was always already there. Classes and objects were
**views with good PR**.

Hang on to your sense of humor. Don't let them intimidate you with
taxonomy. And if someone insists the paradigm *is* object-oriented —
ask which guard they froze, and which dimensions they disoriented to
sell you the name.

---

## Colophon

**Chip Morningstar** — ["How to Deconstruct Almost Anything"](http://www.fudco.com/chip/deconstr.html) (1991). The five steps. The courage to read Culler and write it up for engineers.

**David Ungar** — Self (1987), Korz (2014). Declassification and deobjectification in working code, not just essays.

**Harold Ossher** — Subject-oriented programming and Korz co-authorship. The `subject` dimension before it was a modifier guard in a title.

**Alfred Korzybski** — *Science and Sanity* (1933). Orientation as indexed perception. The map is not the territory; the object is not the behavior.

**Captain Ashford** — ["How to Incarnate Almost Anything"](https://github.com/SimHacker/moollm/blob/main/designs/postmodern-deconstruction.md). Proof the formula survives contact with YAML and grues.

→ [korz/README.md](README.md) · [ask-david.md](ask-david.md) · [design.md](design.md)

*Submitted to: Onward! 2034 (pending declassification of the submission process)*

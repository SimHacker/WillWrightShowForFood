# AGI — paradigm shifts in software, and no Moore's Law for software

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"Is AGI a matter of new paradigm shifts in
software[s] or is current hardware fundamentally incapable to generate intelligence?"*
Posted **Wed 16 Sep 2026**; answer requested by Enzo Yuzuki; 4.1K views, 90 upvotes at capture.
One of six answers to the question. Captured by Don from his Quora feed, **17–19 Sep 2026**.
Profile: <https://www.quora.com/profile/Alan-Kay-11> — **direct answer URL not yet resolved**
(this answer post-dates the archived 2023 corpus; fill in from the browser).

**Related:** [`lenat-cyc-knowledge-and-slow-thinking.md`](lenat-cyc-knowledge-and-slow-thinking.md)
(commonsense white space, symbolic + ML, slow thinking) ·
[`llms-copilots-trust-and-teaching.md`](llms-copilots-trust-and-teaching.md)
(correlation as superstition) ·
[`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md)
(successor to OOP; McCarthy pseudotime) ·
[`computer-revolution-not-yet.md`](computer-revolution-not-yet.md) ·
[`declarative-whats-vs-hows.md`](declarative-whats-vs-hows.md)

**Nature:** Reformatted recap with **verbatim quotes** from the public answer and its comment
thread. Credit: **Quora** (Alan Kay; commenters Ken Kahn, Kaveh Shahbazian, Michael McCaslin,
Mark Miller, Shyam M. Ramadoss, Haig Shahinian, Aurélien C.). Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md) — represents *about* Alan,
sourced-only quoting, no impersonation.

---

## The two questions, answered in order

> These are two quite different questions. The short answers, in order, are "probably will be
> needed" and "probably vanilla computers with enough capacities should be able to do the job,
> given the above".

So: **paradigm shifts in software, probably required. Hardware, probably already sufficient.**
Not a hardware-limits argument at all.

The two overlap through Turing: a fairly simple hardware configuration can simulate all other
describable mechanisms, so **"every thing can philosophically be considered as 'software'."**

## The molecular-dynamics test — a way to skip defining intelligence

Kay's move for checking your own philosophical position without arguing about definitions:

> You can check your philosophical views by contemplating the simulation of everything physical in
> a human, and asking: will that do the job? This very lower level approach bypasses the
> organisation of human brain/minds, but only asks if they are completely "biological"? (meaning
> they are organisations of physical entities in motion).

It costs you one posit — that what is now known can accurately simulate biology — and buys you a
question you can actually answer. He points at **molecular dynamics** simulations on YouTube as
the thing to look at while thinking about it.

## Above the atoms: the architecture question

Minsky's **Society of Mind** and **The Emotion Machine** "still have a lot to say about the
fundamental issues of trying to make minds above the atomic simulation levels." Their approach is
**organisational**: the architectural systems design of active, **less capable** components that
combine into **more capable** systems.

He names the field this belongs to:

> The general area here could be termed "The Theory of Psychologies", and at present seems to be
> less rich than it used to be decades ago.

Why it thinned out:

> This is likely because of the current ability to make correlators with many parameters (basically
> curve fitting), and the confusions between this subset of what is needed and the whole, along with
> the very human tendencies to declare subsets as the whole, and to be generally easy to fool today
> (maybe even easier).
>
> This area seems to be much more naive these days …

**The interesting question**, unchanged since the 1950s: *at which levels of organisation do we
need to represent parts and wholes to produce which kinds of behaviours?*

His read on where the correlators fit: **probably good enough to do their roles in a "mind
architecture."** Evidence that they are not the whole: **AlphaFold** got much better results with
**world/knowledge models** in the loop, and after proclaiming that "scaling alone will do the job,"
most current efforts "have now changed their tune and have been adding more semantic models and
processing to the blinder correlators."

## Five years, fifty, five hundred?

> Another age old question we can ask is: is this a 5 year problem, a 50 year problem, a 500 year
> problem, etc.? It is now the 70th anniversary of the Dartmouth summer conference, so it has been
> at least a 50 year problem so far.

## Trade schools for legacy systems — the classic line

> And, when systems organisations are a key element for a new invention, the non-linearities
> involved make good guesses really difficult. This is compounded by the short-sightedness of
> universities in their transition into what are essentially **trade schools for legacy systems in
> business**.

Two claims welded together, and the weld is the point. **Systems organisation is where the
non-linearities live**, so the one kind of invention you cannot forecast by extrapolation is the
kind that changes how the parts are arranged — which is exactly the kind Kay says AGI needs. And
the institution that used to train people to think at that level **retooled itself to service the
arrangements that already exist**. A trade school can teach anything except how to replace what it
teaches.

The consequence he draws:

> The new systems architectures for just the scalings brought by the Internet didn't happen (and
> things are a real mess already). There are hardly any "systems thinkers" left around.

Which produces "an enormous number of discouragingly naive 'sophomores' and very little actual
progress in most important areas of computing, especially how it needs to be thought about."

## The line he set off by itself

> **A Moore's Law for Software didn't happen**

Repeated at the close: **"There's been no Moore's Law for software! And especially for human
wisdom!"**

## What to build instead of universal logic schemes

> Universal logic schemes (such as everything can be built from NAND gates, or biological neurons,
> or simple matrix operations, etc.) are not very helpful here. More useful would be to better pin
> down a "meaning for meaning" that is a higher level building block than the too simple universal
> ones. **(Triples aren't it!)**

The parenthetical is a direct shot at RDF/semantic-web-style subject-predicate-object as the unit
of meaning.

## Where "real meaning" came from — Goedelisation

> it's interesting that "real meaning" (i.e. not just math but real science) had to be actually
> invented as heuristic methods to aid poor commonsense thinking. This likely piggy backs on our
> language mechanisms (which are almost certainly not as crisp as Chomsky hoped, but more like the
> way cultures generate slang/language and the way fire is preserved (i.e. ad hoc, pragmatic, with
> apparent grammars tagged on)). Jerry Bruner called this "Goedelisation".

Science as **prosthetic** for bad commonsense reasoning, running on a language faculty that is
itself ad hoc — grammar tagged on after the fact, like slang, like keeping a fire alive.
*(The Bruner attribution of "Goedelisation" is Kay's; not independently verified here.)*

## The ask to researchers, and the caveperson

Next step: get less naive, and **come up with a stronger basic mechanism than correlation for cause
and effect reasoning** — crediting **Judea Pearl** for years of pointing this out, and **Doug
Lenat** for covering ground that would very likely help.

Then the warning:

> However, the difficulty of our Palaeolithic genetic brains for "thinking" in scale with the
> industrial revolution should give researchers pause. What's going on now in general is the
> equivalent of replacing the rock held by an angry caveperson with a Tomahawk missile tipped with
> a "dial a city" W80 warhead.

---

## The comment thread

**Ken Kahn** — Society of Mind fan; says molecular or neuron-level simulation should produce AI but
that both are like "building AI by focusing on circuits or machine code," so better research
happens higher up. Kay's reply:

> I actually like (and prefer) the general notion of "growing the architecture of societies of
> interacting elements". I just haven't been bowled over by what I've seen so far.

He agrees to read the two papers Ken suggested. Follow-up, in full Raymond Chandler:

> Philip Marlowe: Hmmmmmmmm / General Sternwood: What does that mean? / Philip Marlowe: It means:
> Hmmmmmmmm

— prejudiced in favor of the first paper until he read it, same state about the second, and
**"dismayed that it didn't mention 'Society of Mind' at all."**

**Kaveh Shahbazian** — proposes the **Thousand Brains Theory** (<https://thousandbrains.org/about/>)
as a candidate higher-level building block. Kay points at a parallel: the **cerebellum** and how it
handles muscular learning and routinization, calls these good starting points, and says one of
Kaveh's own points deserves to be front and centre — **the essentially conservative nature of
evolution**.

**Michael McCaslin** — "a little scary just how much of what people do can be captured and emulated
by correlators," while being frustrated by capabilities ascribed to LLMs that aren't there.
**Mark Miller** agrees, most frustrated when technologists do it.

**Moderation, in public:** Shyam M. Ramadoss posted a long answer-shaped comment; Kay asked him to
move it to an answer and gave two days' notice before removing it; Aurélien C. asked him to keep it;
Kay: *"Let's go by your feelings and those of Aurelien C, and keep it here. The best would be for
you to also make it a separate answer — this way all purposes will be served!"* To a one-word
comment ("Fuck") he replied: *"A comment can add, illuminate, or criticise, etc., an answer. Could
you make yours more clear for readers please?"*

**Haig Shahinian** — opens by wishing Kay good health, recalls wanting to work at VPRI in the late
2000s.

---

## MOOLLM read — what this answer is asking for (Don's, not Alan's)

*Not Alan's words. Where MOOLLM's design already commits to these positions, and where it doesn't.*

| Kay's ask | What MOOLLM does about it |
|---|---|
| "Growing the architecture of societies of interacting elements" | Skills, characters and rooms as independent objects with their own advertisements; deliberation by [adversarial committee](https://github.com/SimHacker/moollm/tree/main/skills/adversarial-committee) rather than one averaged voice |
| A "meaning for meaning" bigger than triples | [CARD.yml as IDispatch](https://github.com/SimHacker/moollm/blob/main/designs/DIRECTORY-AS-IUNKNOWN.md) — an advertisement, not a triple: what this object affords, to whose motive, at what cost, in what context. [yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz) keeps the comments as data because that is where the meaning survives |
| "Declaring subsets as the whole"; easy to fool | The whole [no-ai-* suite](https://github.com/SimHacker/moollm/tree/main/skills) exists for this: eleven ambient constraints, six of them adversarial, loaded whether or not anyone asks |
| Stronger mechanism than correlation for cause and effect | **Not solved.** Nothing in MOOLLM does causal reasoning; it organises what the correlator says and makes the organisation inspectable |
| No Moore's Law for software | The one place software compounded was where the artifact was **readable and copyable by the next person** — Logo, Smalltalk, HyperCard. That is a publishing property, not a tooling property, which is the bet behind [designs/webtop](https://github.com/SimHacker/moollm/tree/main/designs/webtop) |

**The shipped instance worth putting in front of him:** The Sims' advertisement economy is a
society of interacting elements that shipped to tens of millions. Objects broadcast what they
afford; creatures score those broadcasts against their own motives; nobody scripts the result.
The unit of meaning is an advertisement, and it is strictly richer than a triple. Its failure mode
is also on topic — advertisements are cheap to overstate, so one badly tuned object hijacks
everyone's attention, which is "declaring a subset the whole" with a price tag. And the honest
limit: **the vocabulary of motives was fixed by the designers.** A Sim could not acquire a new
motive, so the society could not grow its own architecture — exactly the gap Kay says he hasn't
been bowled over by yet.

## Questions for Alan (show fodder)

- If triples aren't the unit of meaning, is an **advertisement** — affordance plus motive plus cost
  plus context, scored by the receiver — close enough to the right size, or still too small?
- The Sims fixed its motive vocabulary at design time. What would let a society of interacting
  elements **grow new motives** without a designer adding them?
- Where the correlators are "good enough to do their roles in a mind architecture" — what are the
  **other roles**, named, in the architecture you'd sketch today?
- "Goedelisation": if science is a heuristic prosthetic bolted onto an ad hoc language faculty, what
  does that say about building the prosthetic **out of** a language model?
- No Moore's Law for software — was the compounding ever going to come from tools, or only from
  artifacts the next person can read and copy?

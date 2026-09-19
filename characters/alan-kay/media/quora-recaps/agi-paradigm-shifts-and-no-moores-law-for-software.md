# AGI — paradigm shifts in software, and no Moore's Law for software

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"Is AGI a matter of new paradigm shifts in
software[s] or is current hardware fundamentally incapable to generate intelligence?"*
Posted **Wed 16 Sep 2026**; answer requested by Enzo Yuzuki; 4.1K views, 90 upvotes at capture.
One of six answers to the question; **the other five are not captured here.** Captured by Don from
his Quora feed, **17–19 Sep 2026**, with every comment and nested reply manually expanded — see
[view-state-is-the-users](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/view-state-is-the-users.md)
for why that hike is the reason this shelf exists.
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

*All comments expanded from Quora's three separate folds — feed truncation, comment collapse,
nested-reply collapse — and flattened here so the exchange reads end to end.*

### Ken Kahn — grow the society, don't hand-build it

Kahn grants the premise and then splits from Kay on method. Yes, a molecular simulation of a brain
should produce AI, and so should a good simulation of neurons and their interactions — but as a
Society of Mind fan, both look like "building AI by focusing on circuits or machine code," so the
productive level is "the high abstract level of interacting processes/agents."

Then the divergence, stated plainly:

> But where my thinking has diverged from Alan's in the last decade is that **growing** that
> architecture of societies of interacting elements is more promising than building it "by hand".

His evidence is **mechanistic interpretability** — the attempt to see the architectures that emerge
when today's LLMs are trained. He says the rich ways different parts of a network become specialists
that interact with other specialists has become apparent, some of it from the transformer itself
(attention heads, layers, residual streams), some from training models to produce trains of thought
before responding, some possibly from mixture-of-experts. The punchline is aimed directly at the
answer's framing:

> Thinking about these systems as correlators and curve fitters isn't the most productive level to
> understand what they are doing.

Two papers offered:

- **"Reasoning Models Generate Societies of Thought"** — University of Chicago, Santa Fe Institute,
  Google Research
- **"Verbalizable Representations Form a Global Workspace in Language Models"** — Anthropic

### Kay's two replies to Kahn

First, the concession:

> Hi Ken
>
> I actually like (and prefer) the general notion of "growing the architecture of societies of
> interacting elements". I just haven't been bowled over by what I've seen so far.
>
> However, I haven't read either of the papers you suggest, and will definitely get back to you
> after I have.

He does read them. The second reply opens in full Raymond Chandler — *The Big Sleep*:

> Philip Marlowe: Hmmmmmmmm
>
> General Sternwood: What does that mean?
>
> Philip Marlowe: It means: Hmmmmmmmm

Prejudiced in favor of the first paper until he read it; the same state about the second, and
**"dismayed that it didn't mention 'Society of Mind' at all."** Then the substance, which is the
part worth having:

> Basically, I don't know enough at present to have a real opinion about the claimed results. I liked
> the idea in the second paper that the n-dimensional entities could serve as intermediaries for some
> intercommunication between very different agencies.
>
> It is a bit disturbing that there seems to be much more concern about "reasoning" as opposed to
> "science" — that's a real danger with humans as well, and it is not a pleasant thought that this
> glitch seems to be an inherent part of today's models.

That last paragraph is the answer's thesis turned on the models: science had to be *invented* as a
heuristic prosthetic for poor commonsense reasoning, so a field optimizing "reasoning" while
skipping "science" is reproducing the human failure mode it was supposed to correct — and now
baking it in.

### Michael McCaslin — correlators can't hypothesize

> It's a little scary just how much of what people do can be captured and emulated by correlators,
> or perhaps competing/complementary layers of correlators. On the one hand I get frustrated when
> people ascribe capabilities to LLMs that not only aren't there but likely never will be. On the
> other, I look at some of the output and I can understand why we are fooled.
>
> But correlators can't hypothesize and test in order to build completely new correlations. It seems
> we will need something altogether different for that. But where would you start, if you had the
> time and interest to explore this? A "hypothesizer" managing a swarm of correlators could map a lot
> of territory assuming we had some way to evaluate the quality of the results.

"A hypothesizer managing a swarm of correlators" is a concrete architecture proposal at exactly the
level Kay's answer asks for, and the caveat at the end is the whole problem: it needs an evaluator.

### Mark Miller — the intelligence is in the corpus

Agrees, and is most frustrated by technologists doing it, "because I feel like they should know
better." His diagnosis: people miss that LLMs are being used as much more granular search engines
over content, with natural language processing on the prompt. New content gets generated, but from
human content and human patterns —

> The "miss" is they think the "intelligence" displayed in the result, as ("That's just what I was
> looking for," or, "It does just what I asked for/need.") is coming from the "I" in "AI," when in
> fact that "intelligence" is actually coming mostly from the content it's analyzed (generated by us
> humans), with perhaps some transformation logic mediating the translation from the original content
> into the form the interrogator asked for.

Ends with the practical rule: always check the result against something original.

### Kaveh Shahbazian — Thousand Brains as the building block, and Kay on the cerebellum

Proposes the **Thousand Brains Theory** (<https://thousandbrains.org/about/>) as a candidate for the
"higher level building block" the answer asks for: roughly 150,000 identical **cortical columns**,
each about the size of a grain of rice, all necessarily running the same basic algorithm — the
neocortex looks uniform under a microscope, visual cortex indistinguishable from auditory or motor.
It expanded so fast in evolutionary terms that there was no time to design custom structures per
skill, so the theory has it **borrowing its fundamental trick from older parts of the brain used for
physical navigation**.

Kay's reply:

> Another similar (parallel?) notion has been to examine the cerebellum and how it deals with
> muscular learning and routinization. I think these are all good starting points for thinking about
> this.
>
> One point you make should be more front and centre, which is the essential conservative nature of
> evolution (and for good reasons given the blindness of the process and the difficulties of
> morphogenesis in general).

### Shyam M. Ramadoss — and Kay moderating his own thread in public

Ramadoss posted an answer-length comment: the brain as a hardware powerhouse continually evolving a
malleable software architecture from time-delimited sensory cues, and a card-deck analogy for the
core difference — humans get **fragmented pieces of each card per day**, remodeling circuits as they
go, while models get **the complete labelled dataset at once** and remodel over epochs. Biological
forgetting is selective (older or unused learnings wiped or replaced by richer interactions);
hemispheric segregation with distributed memory versus specialized segments behind an orchestrator;
and a guess that the binary-state limit is what quantum or reliable analog computing might relieve.

Kay's moderation, conducted entirely in the open:

> With all due respect, this seems to be an answer to the question rather than a comment on my
> answer. I suggest that you move it to be an answer. In any case, I will plan to remove this two
> days from now (to give you time).

Ramadoss replies graciously; **Aurélien C.** asks "Please keep it there." Kay reverses himself on the
strength of two readers:

> Let's go by your feelings and those of Aurelien C, and keep it here. The best would be for you to
> also make it a separate answer — this way all purposes will be served!

To a one-word comment ("Fuck") from Nicky Hislop:

> A comment can add, illuminate, or criticise, etc., an answer. Could you make yours more clear for
> readers please?

### Haig Shahinian — the teleology objection (no reply from Kay at capture)

The longest comment, and the only one that attacks Kay's own framing rather than the field's. Opens
by wishing him good health, recalls wanting to work at **VPRI** in the late 2000s after USC — "I
thought you and your team really were going 'back to the future' and would revolutionize (again)
computing" — and says the industry instead "doubled down on the rube goldberg-esque pop culture that
is modern computing," which he blames on economics rather than technique.

His position: **cybernetics kept teleology** (or teleonomy, if Dennett helps it go down), and modern
complexity and AI thinking dropped it. Since the Enlightenment, science has reduced Aristotelian
causality to material and efficient causes — enormously fruitful for "dead matter, crude energy, and
blunt forces," and, he argues, a wall now that the subject is life and mind.

Then the objection to Kay directly:

> With all due respect, while your appeal to complex systems thinking and Minsky's society of minds
> is respectable, it is still locked in the old (and still current) computational paradigm of minds
> and biology. Living and thinking entities are subjective unities, not just objective systems; the
> "whole" is not just outside, but inside, and there needs to be a conscious integration and not just
> a mereological assemblage before living and thinking can occur.

And the conclusion, with the economics folded back in:

> AGI is the attempt to build a Frankenstein monster out of dead computational parts, which may get
> us to high-performing zombies, capitalism's wet dream and its true ambition for the ultimate answer
> to labor, but those zombies will still always have jagged intelligence because they will be stuck
> in the flatland (and flat-time) of dead matter/computation. Instead of AGI, we need AUM, authentic
> unified mind

Signs off: "I love you Alan, you are one of my heros." **No reply from Kay to this one as of
capture** — worth watching, since "subjective unity versus mereological assemblage" is the sharpest
available challenge to the Society of Mind position and he has answered softer ones in the same
thread.

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
- **"More concern about 'reasoning' as opposed to 'science'"** — is that fixable from inside a model,
  or does the science have to live *outside* it, in inspectable artifacts and experiments the model
  merely operates? (Don's bet is outside, which is why MOOLLM keeps the state on disk in git.)
- Ken Kahn's **grow it, don't hand-build it** — what would bowl you over? Name the demonstration.
- **Haig Shahinian's objection**, unanswered at capture: subjective unity versus mereological
  assemblage. Does Society of Mind claim the inside, or concede it?
- Michael McCaslin's **hypothesizer managing a swarm of correlators** — plausible shape, but what
  evaluates the results? Is that the same hole as the automatic inverter from the 2011 MVC email?

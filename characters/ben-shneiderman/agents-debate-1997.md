# The 1997 agents debate: what was actually argued, and the two answers nobody named

Portrayal material **about** Ben Shneiderman and Pattie Maes — **not** them, and no words are put in
anyone's mouth. Every quotation below is from the published transcript, marked and in context.
[Standards](../../schemas/portrayal-standards.md) · Corrections welcome from anyone named here.

**Primary source:** Ben Shneiderman and Pattie Maes, "Direct Manipulation vs. Interface Agents,"
*interactions* 4(6), Nov/Dec 1997, pp. 42–61 —
[doi:10.1145/267505.267514](https://doi.org/10.1145/267505.267514)

---

## Why this document exists

The debate is cited constantly as the field's founding dichotomy — direct manipulation on one side,
interface agents on the other, irreconcilable. Reading the actual transcript makes two things clear
that the citations lost.

**It ended in agreement.** And **there were two available syntheses in the room, neither of which
got named** — one of which Shneiderman himself asked for out loud, from the stage.

Both matter now, because LLM agents have made the same argument live again, mostly without the
participants' actual positions in evidence.

## It was two events, with two moderators

Worth getting right, because the record conflates them.

| Event | When | Moderator | Record |
|---|---|---|---|
| IUI 97, Orlando | January 6–9, 1997 | Jim Alty (Loughborough) | The full transcript published in *interactions* |
| CHI 97, Atlanta | March 22–27, 1997 | Jim Miller (Apple Research Laboratories) | A two-page extended abstract |

Nearly every citation to "the debate" is citing the IUI session, since that is the one with a
transcript.

## The convergence, which is the part that got dropped

From the published transcript:

> **Shneiderman:** I like the new Pattie. I am ready to be partners and collaborate with the new Pattie.
>
> **Maes:** I think we both have changed. Would you agree to that or not?
>
> **Alty:** I think before they start kissing let's move on.

Earlier in the same session, Shneiderman: "part of me is drawn to the idea of celebrating Pattie
Maes and encouraging you to follow her example."

Roughly five hundred subsequent papers treat this as the canonical opposition. The transcript is two
researchers publicly narrowing their differences and enjoying the process. **The field kept the
framing and discarded the resolution.**

## What Shneiderman actually objected to

This is the correction most worth making, because the caricature — that he was against automation —
is why his constraints were easy to dismiss rather than easy to satisfy.

His own statement of the positive position:

> I am in favor of increased automation that amplifies the productivity of users and gives them
> increased capabilities… while preserving their sense of control and their responsibility,
> responsibility, responsibility.

The objection was to **vocabulary as a design hazard** — that certain words license a designer to
skip work:

> I have trouble with the words like "agents," and "expert," and "smart," and "intelligent" because
> they mislead the designer, and designers wind up leaving out important things.

His charge sheet against anthropomorphic representation was that it "misleads the designers, it
deceives the users; it increases anxiety about computer usage, interferes with predictability,
reduces user control, and undermines users' responsibility." And on the framing itself: "the
intelligent agent notion limits the imagination of the designer, and it avoids dealing with
interface issues."

Three moves in the transcript show this was an engineering argument, not an ideological one.

**He quoted Maes's own principle back at her, approvingly:** "Make the user model available to the
user… I don't see that being done in most of the work about agents." Not a rejection of her
framework — a complaint that the field wasn't meeting it.

**He cited Tom Sheridan** on nuclear control rooms and cockpits, approvingly. Nobody opposed to
automation reaches for the supervisory-control literature.

**He conceded the architecture:** "Maybe the way agents will mature is as Pattie is suggesting; that
the agents take care of the processes below the table, and there is a nice direct manipulation
interface that the user sees."

His closing was a shipping complaint, and it is the hinge of this whole document:

> It is embarrassing that after 15 years of graphic user interface being widely available, we have no
> graphical macros tools. What is going on? This is the greatest opportunity for visual programming.

He also relayed an indictment from inside AI: "A leading AI researcher commented to me that the 30
years of planning work in AI is essentially down the tubes because of lack of attention to the user
interface."

## What Maes actually argued, and conceded

Her positive case: complexity outruns the widget vocabulary, users are not computer-trained, so some
delegation becomes necessary. But the framing was explicitly additive — agents are

> completely a complementary technique to well-designed interfaces, not a replacement. Users still
> need to be able to bypass the agent.

She granted the legibility point directly, saying agent designers have to attend to interface issues
"such as understanding and control" or users will not trust the result.

**The concession that has aged best is about stakes.** She chose low-consequence domains on purpose:

> If your World Wide Web agent gives you a wrong Web page to look at… that is not at all critical. It
> is not a big deal… I believe that it will be very hard to make agents that always come up with the
> right answer, always do the right thing.

That is a calibrated deployment position, and it is more conservative than nearly anything shipping
in 2026, where agents are pointed at code, money, and email — domains where errors are expensive and
compound. If one contemporary point comes from her side of the transcript, it should be that one.

She also drew a distinction worth preserving: software agents are not the same as autonomous agents
or synthetic characters.

## The question that went unanswered

A questioner from the floor asked for the synthesis outright:

> Will this debate between direct manipulation and agency always exist in interface design or will it
> eventually be replaced by some kind of fusion of the two approaches? In other words, are we going
> to see new Bens and new Patties every day, or is there going to be some kind of "Shneider-Maes"?

It did not get answered; the discussion moved on to how the debate itself would evolve. Two answers
existed at the time.

## Answer one: COACH — proactive, and it had the study

Ted Selker's COACH (Cognitive Adaptive Computer Help, IBM Almaden) watched a learner work and
offered adaptive, context-sensitive advice. The design is **advisory rather than assistive**, and
that distinction is what threads the needle: proactive, unasked, and adaptive — Maes's requirements —
while never acting on the user's behalf, never anthropomorphized, never blocking, always bypassable,
which are Shneiderman's. It also carried the empirical performance result Shneiderman kept asking
for, with learners completing substantially more exercises.

Selker has described it, in his own words in a later interview, as sitting at the center of this
debate.

The industry's most famous shipped attempt, two years later, was anthropomorphic, interruptive,
unpredictable, and control-removing — violating each constraint Shneiderman named — while the design
that satisfied them and had data went largely unremarked.

## Answer two: programming by demonstration — and a co-editor was in the room

This is the one that is almost comic in how available it was.

**Shneiderman asked for it by name, from the stage:** "we have no graphical macros tools… This is
the greatest opportunity for visual programming." Programming by demonstration *is* graphical macros
with generalization. He described the premise of an existing field as an unmet need while that field
was four years into a 672-page anthology — *Watch What I Do: Programming by Demonstration*, edited
by Allen Cypher (MIT Press, 1993), eighteen systems, preface by Alan Kay. The full text has been
online for decades at [acypher.com/wwid](http://acypher.com/wwid/).

**It satisfies Maes's requirements.** Cypher's Eager (Apple ATG, ~1989–91, built on HyperCard) was
always on, never needed switching on, and detected repetitive patterns by itself.

**It satisfies Shneiderman's.** The user demonstrates by direct manipulation, on visible objects, on
their own data; the system shows what it inferred *before* acting; the user stays responsible and
can decline. Eager's "anticipation" — turning the predicted next button, menu item, or text
selection green so you could see whether it had understood you, and correcting its program from your
actual choice when it hadn't — is *make the user model available to the user*, implemented as a
pixel, six years before he said nobody was doing it.
([Cypher, CHI '91](https://doi.org/10.1145/108844.108850))

**And Henry Lieberman, a co-editor of that anthology, was in the audience.** Maes pointed into the
room mid-answer — "Henry Lieberman, sitting here in the audience" — and cited his work on teaching
an agent by demonstration using speech as a side channel to disambiguate intent. That is a chapter
in the 1993 book he co-edited, "Using Voice Input to Disambiguate Intent."

So an example from the anthology was cited, with one of its editors present, and the category was
never named.

### Lieberman connects both syntheses' venues

Worth recording, because it went unnoticed here until the workshop programs were cross-checked.
Henry Lieberman gave the opening talk, "Smart Interfaces to Smart Machines," at the
**1993 First Annual NPUC at IBM Almaden** — Ted Selker's workshop series, at the research center
where COACH was built, on the same program as Don Norman, Terry Winograd, Ken Kahn, and Don Hopkins
([archived program](https://web.archive.org/web/20060210092923/http://www.almaden.ibm.com/almaden/npuc97/1993.htm)).
Four years later he was in the IUI 97 audience being cited for a PBD technique.

So one person was present at the home of the first synthesis and in the room for the second. That
also makes him the most likely person to know whether Selker and Cypher — both at Almaden — ever
compared notes.

### Why nobody raising it is the interesting part

If PBD was an answer, why did the person who co-edited the book not say so? Four reasons, none of
which require anyone to have missed anything obvious.

**He was cited as an instance, not as a school.** His system was being used as evidence in someone
else's argument. Being recruited is a passive role, and reframing the whole debate around your
field's category from the floor is a different and much larger move.

**PBD did not experience itself as a synthesis, because it was not in the fight.** The polarity ran
between a direct-manipulation group and an agents group. PBD was a third community with its own
tracks and its own vocabulary — intent inference, generalization, end-user programming. From inside
it, PBD was not the resolution of an argument happening elsewhere; it was simply the work. **You do
not notice that you are the answer to a question you were not asked.**

**The framing belonged to the disputants.** In a session titled "Direct Manipulation vs. Interface
Agents," saying "you are both describing my field" is a territorial claim inside someone else's
dichotomy, and the moderator had already signalled he was not going to referee.

**And honestly: PBD had not shipped.** Shneiderman's complaint was about the absence of *available*
graphical macro tools, and on that he was right — Eager was a research prototype. Claiming the
answer already existed while holding eighteen prototypes and no products would have conceded his
actual point. The wall was real, and it was **inferring which generalization the user meant from one
or two examples.**

So this reads less as two stubborn people and more as a field holding its own synthesis without
recognizing it.

## Why this is live rather than historical

**Both syntheses hit the same wall, and the wall has moved.** COACH and PBD both required inferring
intent from sparse evidence, which needs common-sense priors to disambiguate. That is the same
obstacle Gary Drescher's schema mechanism ran into as grounding.

Allen Cypher has since written, on his own homepage, that "with the advent of Large Language Models,
my dream of End User Programming has come true," adding that vibe coding exceeds what he had
imagined.

Which sets up the question the transcript makes possible and nobody seems to have asked: whether it
came true **in the form the field wanted.** PBD's premise was that the user demonstrates on their own
data and can see what the system inferred. Vibe coding is natural-language instruction producing
code the user often cannot read — nothing turns green before it acts. Measured against the 1997
constraints, that **satisfies Maes and abandons Shneiderman**, which makes "what would anticipation
look like in a vibe-coding interface?" a live design question rather than a retrospective one.

And Shneiderman's 1997 complaint stands unanswered in 2026: there are still no widely available
graphical macro tools.

## Open questions the participants could settle

Offered as genuine gaps, not rhetorical ones. Anyone named here is welcome to correct or fill them.

- **Floor speakers are anonymous in the transcript**, labeled only "Question." Both the questioner
  who asked for a "Shneider-Maes" and the one who called the position "reactionary… sort of
  fear-driven" are unidentified. Participants may remember.
- **Whether the two syntheses knew about each other.** Cypher and Selker were both at IBM Almaden.
  Whether they overlapped and talked is **unverified here** and would be worth knowing.
- **The CHI 2017 and CHI 2021 return debates** are unexamined in this document.
- **Whether the IUI 97 session survives in any other form** than the *interactions* transcript.

## Sources

- Shneiderman & Maes, "Direct Manipulation vs. Interface Agents," *interactions* 4(6), 1997 — [doi:10.1145/267505.267514](https://doi.org/10.1145/267505.267514)
- Maes, Shneiderman & Miller, CHI 97 debate — extended abstract, CHI '97 extended abstracts
- Cypher, "EAGER: Programming Repetitive Tasks by Example," CHI '91 — [doi:10.1145/108844.108850](https://doi.org/10.1145/108844.108850)
- Cypher (ed.), *Watch What I Do: Programming by Demonstration*, MIT Press, 1993 — full text at [acypher.com/wwid](http://acypher.com/wwid/)
- Lieberman (ed.), *Your Wish Is My Command: Programming by Example*, Morgan Kaufmann, 2001

## Related

- [`README.md`](README.md) — the portrayal
- [`ideas.md`](ideas.md) — show hooks
- [`invitation.md`](invitation.md) — the ask
- [`../don-hopkins/hyperties-reincarnation.md`](../don-hopkins/hyperties-reincarnation.md) — HyperTIES, which the debate article credits in Shneiderman's own author bio

↑ [characters](../README.md)

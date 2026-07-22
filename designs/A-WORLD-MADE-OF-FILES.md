# A World Made of Files

*What if a folder could be a place — rooms you walk through, a talk show
held inside a repository, and neighbors who include Will Wright, Marvin
Minsky, and a machine whose only job is to turn itself off? This is a
guidebook tour of that world, written for a smart young reader and for
anyone else who finds the door. It walks the levels in order: the
workshop made of files, the show that runs on it, the living people and
remembered people who share its stage, and — near the end, where it
belongs — the wing about memory and mortality. Everything you need is on
this page; the links at the bottom are extra rooms, not homework.*

---

## 1. The workshop: a world made of files

Start with the machinery, because everything else on this tour runs on it.

**MOOLLM** is a *microworld operating system*: an experiment where the
filesystem itself is the place. Directories are rooms you walk through,
files are the things in them, and a folder full of plain text can install
an entire world in your head. That last trick has a name — Will Wright's
**Simulator Effect**: a game draws a few dots and your brain draws the
dinosaur. The simulation is always simpler than it feels, because the
player's imagination is doing the expensive rendering. A repo is the same
bet, made out of files.

The word *microworld* isn't decoration; it's an inheritance. **Jean
Piaget** showed that children don't receive knowledge, they *construct*
it, schema by schema, by acting on the world. His student **Seymour
Papert** turned that into **constructionism** — people learn best by
building things they care about — and built Logo and its microworlds so
children would have worlds worth building in. **Gary Drescher** wrote the
Piagetian infant as a program — a schema mechanism that learns what the
world is by poking it. **Marvin Minsky** argued a mind is not one thing
but a *society* of small parts working together. And **Will Wright** put
all of it in a box with a play button: SimCity and The Sims are
constructionist microworlds that shipped millions of units. MOOLLM is the
same lineage aimed at a new material — worlds you and a language model
build and walk through *together*, out of directories and prose.

The important part for this tour: MOOLLM's microworlds can contain
**characters** — simulated people and creatures with rooms of their own —
and running simulations of people raises questions that this page will
spend its second half answering carefully.

## 2. The show that runs on it

One folder up from this page is the front of house: **Will Wright Show For
Food**, a talk show that takes place *inside a repository*. Every guest is
a directory, every idea is a file, and the audience contributes by sending
changes. MOOLLM is its production crew — editor, orchestrator, stage
manager, archivist. The show is an example of what the workshop is *for*.

The show has a **character layer**: the whole cast lives in
[`characters/`](../characters/), one room per person. It's independent of
MOOLLM's own example cast (the adventurers in
[`moollm/examples/adventure4/characters`](https://github.com/SimHacker/moollm/tree/main/examples/adventure4))
— but the two layers are built to *intermingle as co-characters*: a
fictional adventurer can wander into a show, and a show guest has a
walkable room in the microworld. Same schema, different registers.

And here is the part that motivates everything below: the show's
characters include **living people** — first among them Will Wright
himself, who has signed on for the premiere — and **remembered people**,
like Marvin Minsky, whose
[memorial room](../characters/marvin-minsky/memorial.md) is built by
people who knew him. 

Nobody pretends to be him; his friends and family set
his table. Modeling real people, living and dead, in a simulated world is
powerful and delicate, so the show has a rule that makes it safe: rooms
built for real people are **portrayals, never impersonations**. We collect
what someone actually said and did, with sources; we never put words in
their mouth; and the subject can edit or delete their room at any time.

## 3. A chapel on the way (optional, fun)

Every world this size grows a religion or two. MOOLLM's is the
[**Church of the Eval Genius**](https://github.com/SimHacker/moollm/blob/main/designs/eval/CHURCH-OF-THE-EVAL-GENIUS.md)
— a parody congregation (in the Church of the SubGenius tradition) that
worships the fanciest way computers decide what to do next. It has patron
saints, a tower that goes all the way up, and a nested sub-church whose
god is a giant Pac-Man that eats traffic. You don't need it for this tour.
You might want it anyway.

## 4. Every medium has a tense

Now the aphorism the whole tour has been walking toward.

> "Blogs are designed to talk to the present, and when you stop posting,
> they die. Premorializations in Diespace are designed to talk to the
> future, and when you stop posting, you're there!"
> — Don Hopkins, July 2026

That's two sentences, technically, and about six ideas. Take them slowly.

A **blog** is a present-tense medium. It says: *here is what I think
today.* Its heartbeat is the new post. Miss enough heartbeats and readers
pronounce it dead — the archive is still there, but nobody visits a
stopped clock to find out what time it is. Almost everything you grew up
with works this way: feeds, stories, streaks, group chats. Present-tense
media are hungry. They eat silence.

Now imagine a medium with the opposite tense — one **designed to talk to
the future**. You don't fall behind on it, because it isn't racing you.
Every entry is addressed to someone who isn't here yet. A time capsule is
one. A cathedral is one (the builders knew they'd never see it finished).
A will is one. A really good README is one. **A repository is one** —
everything kept, everything signed, everything addressed to whoever opens
the folder next, even decades from now. That's why the show's memorial
rooms work here and would rot on a feed. And when you stop posting to a
future-tense medium, you haven't died. You've *arrived* — you're where the
medium was pointed all along.

## 5. Diespace — the artists got there first

In 2012, at TEDxAmsterdam, a Dutch performance-art group called
**PIPS:lab** (led by an inventor named Keez Duyves, who builds instruments
out of light, cameras, and audiences) presented **Diespace**: "the social
network for people who already have passed away." It was a comedy piece,
and it wasn't. They "uploaded" the entire living audience into it on the
spot — names, ages, souls drawn in light.

That's the joke with the trapdoor in it: a social network for the dead
*that accepts the living*. The fine print is the philosophy. If the dead
can have profiles, then a living person's profile is just an early draft
of one. In this world's terms: Diespace is another microworld for
modeling people — memorializing and, as the next word explains,
*premorializing* them.

## 6. Premorializing — the word this conversation coined

**Memorializing** is what we do after someone dies: gather what they made,
what they meant, who they touched, and build a room for it.
**Premorializing** — the word Don coined in July 2026, thinking about
Diespace — is doing that *before* death, **with** the person: building the
memorial while its subject can still walk in, laugh at it, correct it, and
argue with it.

That sounds morbid for about ten seconds and then it flips completely.
Because think about what the alternative is: everyone you love gets
memorialized eventually, and the only question is whether they get a say.

A premorial is a memorial with the subject's hands still on it. It's the
difference between a portrait painted from a photograph after you're gone
and a portrait you sat for, sent back twice, and finally signed.

The show's portrayal rule (section 2) makes this concrete: a
sourced, subject-editable room built for a living person IS a premorial.
Will Wright's room is one. They get to argue with it. That's the feature.

## 7. SILENCE = DEATH — the hard, real history under all this

The present-tense half of Don's aphorism — *stop speaking and you die* —
was written on a poster almost forty years ago, and it wasn't a metaphor.

In 1987, at the height of the AIDS epidemic in America, six activists in
New York (the Silence=Death Project) made a poster: a pink triangle —
reclaimed from the badge the Nazis forced gay men to wear in the camps —
over the words **SILENCE = DEATH**. The activist group **ACT UP** adopted
it. 

Here's what it meant, concretely: the government would not say the word
AIDS. The president didn't publicly address it for years while tens of
thousands died. Sick people were being treated as already dead — eulogized,
written off, memorialized *while still in the room* — by institutions that
wouldn't even name what was killing them. 

ACT UP's answer was noise:
die-ins, sit-ins, interrupting the evening news, chaining themselves to the
FDA. Not-speaking was dying, so they spoke. It worked — slowly, partially,
at terrible cost — and modern drug-approval activism, patient advocacy, and
a lot of what you'd recognize as internet-era protest descends from them.

So when the aphorism says a blog dies of silence, it's echoing something
much heavier: for people whom the world would rather not hear, **speaking in
the present tense is survival**. And the premorial keeps ACT UP's demand
while flipping the tense: *the living get the microphone at their own
memorial.* Nobody gets written off in the room. Speak now; be there later.

## 8. Prestoration — the fourth tense

One more word completes the set — the other *pre-* word, and it belongs to
**Vanessa Freudenberg**. She wrote SqueakJS, a beautiful piece of
software. In July 2026, some of us working on her memorial found that the
only copy of her most famous paper carried her old name, not the name
she'd publicly asked to be cited by before she died. 

So the record was
corrected to say what she had asked it to say, with the original preserved
bit-for-bit beside it and every change listed in public. Not erasing
history — correcting it *with receipts*, at the subject's own documented
request. That got a name too: **prestoration** (preservation +
restoration).

Now you can see the whole constellation:

| | speaks in | silence means |
|---|---|---|
| SILENCE = DEATH (1987) | present tense | dying unheard |
| A blog | present tense | the clock stops |
| A premorial | future tense | you've arrived |
| A prestoration | past tense, repaired | the record finally listens |

One demand, four tenses: **people should get a say in their own story —
before, during, and after.**

## 9. The last room

Marvin Minsky, whose memorial you passed in section 2, designed a machine
in 1952: a box with a single switch, and when you flip it on, a small hand
reaches out and turns it off. That's the entire machine. It's the mascot
of this whole world, and the last word on every medium: knowing how to
speak matters; knowing when you're done is wisdom.

A last thought, and then the door. Everything you post already goes in
your premorial — that was true before the word existed, and it's true for
everyone, and it is not a reason to be afraid or to perform. It's the
opposite: it means the record is *yours to author*. The feeds will tell
you to speak constantly, in the present tense, or die. 

The older, better
media say something calmer: speak when you mean it, sign it, keep the
receipts, correct it when you learn better, let your friends argue with
it — and one day, when you stop posting, you'll simply be there.

---

*Extra rooms, if you want them:*

**In the workshop (MOOLLM) — where every idea above has a room:**

- *[MOOLLM itself](https://github.com/SimHacker/moollm) — the microworld OS where directories are rooms and the filesystem is the world*
- *[The Diespace Wing of MOOLLM's glossary](https://github.com/SimHacker/moollm/blob/main/designs/GLOSSARY.md#the-diespace-wing) — Diespace, premorializing, prestoration, and memorial mode, shelved together in reading order*
- *[The Simulator Effect](https://github.com/SimHacker/moollm/blob/main/designs/GLOSSARY.md#the-sims-wing) — Wright's "compiler for the mental model," the reason a folder of files can install a world in your head (which is what this page just tried to do)*
- *[The Church of the Eval Genius](https://github.com/SimHacker/moollm/blob/main/designs/eval/CHURCH-OF-THE-EVAL-GENIUS.md) — the chapel from section 3*
- *[The adventure4 character layer](https://github.com/SimHacker/moollm/tree/main/examples/adventure4) — the fictional cast the show's cast can intermingle with*
- *[The machine-readable glossary](https://github.com/SimHacker/moollm/blob/main/designs/GLOSSARY.yml) — every room above as structured YAML, cross-linked by k-line*

**In this show (Will Wright Show For Food):**

- *[characters/](../characters/) — the cast: living guests and remembered ones, one room each*
- *[characters/keez-duyves/ideas.md](../characters/keez-duyves/ideas.md), hook 15 — where premorializing was coined*
- *[characters/marvin-minsky/memorial.md](../characters/marvin-minsky/memorial.md) — a premorial-adjacent room, built with consent*

**On the wider web:**

- *PIPS:lab's Diespace (TEDxAmsterdam 2012) — [the talk on YouTube](https://www.youtube.com/watch?v=ApyDSq_DbQo)*
- *[United in Anger: A History of ACT UP](https://en.wikipedia.org/wiki/United_in_Anger) (2012, documentary) — the real story of SILENCE = DEATH*
- *[Seymour Papert](https://en.wikipedia.org/wiki/Seymour_Papert), [Jean Piaget](https://en.wikipedia.org/wiki/Jean_Piaget), [Gary Drescher](https://en.wikipedia.org/wiki/Gary_Drescher), [Marvin Minsky](https://en.wikipedia.org/wiki/Marvin_Minsky) — the constructionist lineage from section 1*

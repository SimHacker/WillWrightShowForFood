# Radio On Internet: SimRadio in context, and a call to finally do it

*Companion to the primary source:
[`simradio-moody-1999-maxis-email.md`](simradio-moody-1999-maxis-email.md)
(February 18, 1999). Design doc:
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md).
This file is the context, the joke, the counterfactual, and the plan.*

## February 1999, from inside the bandwagon

Read the email's own framing carefully:

> The technology to implement it is well understood, in fact
> everybody else is jumping onto the internet radio bandwagon these
> days, but nobody's integrated it into a game like this, that I've
> ever heard of.

That is not a claim of invention. It's the opposite: the case being
made is that internet radio was already **everybody's** idea — the
whole industry knew it, the bandwagon was public and crowded — and
therefore the move was to do it **too**, not first. The only novelty
claimed is the integration: nobody had wired the live broadcast into a
simulated household where autonomous characters could sprint to the
phone and be the 20th caller.

The dates make the point brutally. Six weeks after this email, on
April 1, 1999, **Yahoo announced its $5.7 billion acquisition of
Broadcast.com** — Mark Cuban and Todd Wagner's internet radio company,
the exact bandwagon the email names. Yahoo wound the product down
within a few years. The exit was the product.

## Russ Hanneman, or: what the Valley did with the same idea

Which brings us to *Silicon Valley*, and the scene this paragraph
rhymes with:
[**"Radio On Internet"** (S2E3, *Bad Money*, 2015)](https://www.youtube.com/watch?v=BzAdXyPYKQo).

Russ Hanneman is the show's monument to the 1999 bandwagon: the guy
who "made a billion dollars putting radio on the internet" — tres
commas, the McLaren, doors that open like *this* — a character the
audience universally reads as Mark Cuban. The joke the show
constructs, patiently, across his whole arc, is that Russ's fortune
required **no unique idea at all**. Radio on the internet was the most
public idea in tech; his billion came from being on the bandwagon at
the moment the music (money) stopped. And the show pays the setup off
in this scene with the greatest acronym reveal in television: *"ROI?
You know what that stands for? Radio. On. Internet."* — return on
investment, redefined by a man for whom the investment literally was
radio on internet, and the return had nothing to do with revenue:

> "If you show revenue, people will ask how much... it's not about
> how much you earn, it's about what you're worth. And who's worth
> the most? Companies that lose money."

That bit was satire in 2015 and is a market summary in 2026 — the
comment section under the clip is a time-lapse core sample of every
bubble since (WeWork, Rivian, SPACs, and now the pre-revenue AI pure
plays). *Silicon Valley* was accurate, foresightful, biting social
commentary, and this document tries to respond in kind, because the
show's diagnosis applies squarely here: **the Valley optimizes for
who owns the bandwagon, not for what the bandwagon could carry.**
In 1999 the bandwagon could have carried a dollhouse full of Sims
racing their owners to the phone. Instead it carried an exit.

What the wagon could carry arrived anyway — facet by facet, twenty
years late, each facet owned by somebody: time-windowed viewer
rewards became **Twitch Drops** (the 20th-caller mechanic, minus the
Sims), live synchronized events in a game world became **Fortnite
concerts**, advertising as native content became the entire live-ops
economy. Every one of those is one paragraph of the 1999 email,
built large, in isolation, without the moody track that tied them
together — the part where the *broadcast carries meaning that the
world's characters can feel*.

## The counterfactual walled garden (EAML™)

Here is the uncomfortable retrospective blessing. Suppose EA *had*
moved on SimRadio — or on Will Wright's companion idea of **porting
data between games**, creatures and objects and characters flowing
across titles. The realistic outcome isn't the open dream. The
realistic outcome is that EA names the interchange format something
like **EAML**, ships it as a "standard" that is actually a 1:1
serialization of its internal object storage — exactly the way
Microsoft's Word XML formats were OLE compound-document structures
walked mechanically into angle brackets, open in license and
proprietary in every fact that matters — and builds a walled garden
with a toll gate at every gate.

And then consider who holds the walls now. EA was
[sold in August 2026 for $55 billion](https://apnews.com/article/electronic-arts-sims-battlefield-silver-lake-e50d653ac4616d063296e2021d826a3c)
to a consortium led by Saudi Arabia's Public Investment Fund (93.4%)
with Jared Kushner's Affinity Partners. A moody track is, by design,
**a channel that modulates the emotional state of simulated people in
millions of homes, with per-person reaction models and time-windowed
calls to action**. In a commons, that's a mixing board for game
designers. Inside a walled garden owned by a sovereign wealth fund
and a presidential son-in-law, it is a persuasion instrument with a
dollhouse attached. Better that it never shipped than that it shipped
belonging to someone.

So the blessing has a moral, and the moral is the plan: these two
technologies — meaning-bearing broadcast media, and portable
world-data — are **too powerful to be owned**. They have to be built
in the open: free designs, free software, unencumbered,
non-patented.

One caution about *how* open things get built. Not by a standards
race, and not by standards committees whose members urinate on the
document to leave their mark — the way XSLT came out as an amalgam of
uncoordinated competing language models, type theories, data
representations, and workflow doctrines, each faction's totem bolted
to the spec. The alternative is organic: publish working designs,
build working implementations, let them play, learn what works, lift
what survives — convergence by imitation of running code, not by
committee conquest of a draft.

## The call to action: do it now

The technology excuse expired. Streaming is a solved commodity;
every phone does live audio and video; and the hard part of the
moody track — authoring the meaning — now has a universal decoder,
because **an LLM can listen to the lyrics**, read the scene, read
the room, and infer the parameter track that 1999 would have needed
an army of human annotators to write.

So, to whoever builds living worlds — **Paralives, inZOI, Tiny Life,
the whole life-sim renaissance, and anyone else**: take it. All of
it. Tiny Life especially wears the invitation well: its credits
already list a composer (Leiss Hoffman) and an **emotion sting
artist** (Jamal Green) — music that reacts to emotions — and the
moody track is the same wire run the other direction, music that
*causes* them, annotated by the composer's own hand. A composer
marking up the meaning they already wrote into their music is
artisanal annotation, the exact opposite of generated content. There
is a show seed waiting for exactly this conversation:
[`repo-shows/moody-midi-for-mood/`](../../repo-shows/moody-midi-for-mood/moody-midi-for-mood.yml). The moody track schema, the room-inherits-heat model, the
expiring broadcast ads, the prize-delivered-to-the-front-door loop,
the per-person reaction filtering. It is given freely, unencumbered,
non-patented, with dated prior art published right here and a full
design written up in
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md).
Implement one facet and you'll have something nice. The picture is
bigger than any one facet, and the picture is also free.

And you don't even have to wait for a game, because real life is
already running the simulation. The version that ships soonest is a
phone on a bicycle: an **ebike safari** that records a place+time
sync track of the music you're listening to, the GPS trace, the
photos and video, and your spoken impressions — with **GPS gestures**
as the input channel (stop in front of an address to select it,
encircle a fountain or a statue or a block to lasso it; the city is
the screen, the bike is the pen). The artifact is a standard moody
object, importable into any world that later wants it. Full sketch in
[MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
under "Moody IRL."

And the deep end of the pool: the inevitable **LLM-driven real-time
MOOLLM** is the platform this design was waiting for, in all its
glory and splendor — because there, media artifacts, rooms, and
characters are all objects in one advertisement auction. The moody
block is just more YAML on the artifact; the room *derives* its
emotional weather at read time; the broadcast ad is a buff with an
expiration date; and the SimDJ doesn't have to fake it — the DJ is a
character with a soul file, reading the aggregate mood of every room
tuned in, and playing what the houses need. Music that knows what it
means, in a world where meaning is executable.

The 1999 email asked for permission. This document isn't asking.

## Links

- Primary source: [`simradio-moody-1999-maxis-email.md`](simradio-moody-1999-maxis-email.md)
- Design: [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md) —
  multimoodia, parameter tracks, two knobs, ambient heat, Muzak and
  Eno lineage
- The scene: [Silicon Valley — "Radio On Internet" / no revenue (S2E3, *Bad Money*)](https://www.youtube.com/watch?v=BzAdXyPYKQo)
- The bandwagon's exit: Yahoo–Broadcast.com, announced April 1, 1999,
  $5.7B
- The current walls: [AP on the EA take-private close, August 2026](https://apnews.com/article/electronic-arts-sims-battlefield-silver-lake-e50d653ac4616d063296e2021d826a3c)

# Roles, not characters — an answer to "Video Games Are Better Without Characters"

*A response to Ian Bogost,
["Video Games Are Better Without Characters"](https://www.theatlantic.com/technology/archive/2015/03/video-games-are-better-without-characters/387556/),
The Atlantic, March 13, 2015 — written the week EA closed Maxis
Emeryville. Consent note: this is Don's reading of a published essay;
Bogost hasn't been asked about any of it yet.*

## The essay's question

Bogost's essay mourns Maxis by naming what SimCity actually was: a game
whose protagonist is a system. Not a game about people — "the city
itself, with its tiny cars and varied buildings, are really just
visualizations of the underlying simulation." He traces the whole Maxis
method (Forrester's urban dynamics, Lovelock's Gaia, Hölldobler and
Wilson's ants, Alexander's pattern language, Maslow's hierarchy) and
then asks the unpopular question the industry never answers:

> Why must we have characters in games at all?

His diagnosis: games abandoned the work of systems and behaviors for
the work of individuals and feelings, and the obsession with personal
identification produced identity politics without systems literacy. His
closing image: "we are the Sims now," user-interface elements in the
power brokers' cities.

One paragraph deserves its proper name. When the essay describes gamers
"so attached to their identity that they've been willing to burn down
anything to defend it," seeking "to exclude anyone—particularly
women—who challenge their ideas about what games and gamers look like,"
Bogost is writing about **GamerGate** — March 2015, the harassment
campaign still smoldering around him. His analysis is the systems one:
"the gamer" is what happens when identity becomes the product instead
of the seat — cherished so hard its defenders sabotaged it in the
public imagination, accelerated by the corporatized internet. Don
opposed GamerGate adamantly then and now, and the roles thesis below is
the constructive counter to its premise: identity as a fortress to
defend versus identity as a seat at a table facing a shared system. A
mayor arguing with a treasurer over a budget has an identity that
*does* something; a "gamer" defending the borders of a demographic has
an identity that can only be threatened. The Sims history in this repo
— same-sex romance shipped in 1999, the Wedding Playset, the QGCon
"How Inclusivity Saved The Sims" argument — is the receipts for the
other road.

## The answer that was already running

Here is the thing the essay walks right past, and it was sitting in
SimCity the whole time. **SimCity has no characters inside the
simulation — but playing SimCity has always been full of characters.**
The box said "mayor." The budget window is a treasurer's desk. The
queries are a city planner's clipboard. The bulldozer is a tool
operator's seat. The newspaper (in later versions) is a journalist's
column. The simulation didn't represent any of these people. It
*implied* them, as roles, on the player's side of the glass.

Don has been building and writing about this decomposition for decades:
break the singular "player" into **many roles that many people can
occupy at once** — mayor, advisors, department heads, tool operators,
critics, citizens lobbying from the floor. The multiplayer X11 SimCity
he built in the early nineties made this literal: multiple players in
the same city, sharing the map, **voting on decisions**. The lineage
line in [Micropolis](https://github.com/SimHacker/micropolis) still
reads "Unix/X11/TCL/Tk + multiplayer" — the roles were seats at a
table, not sprites in the model.

That dissolves the essay's dichotomy. Systems-as-protagonist versus
characters-as-protagonist was never either/or; it's **inside versus
around**. Keep the system as the protagonist *inside* the glass — and
let the characters gather *around* it, differentiated by what they can
see and do, not by what they look like. Identity doesn't need
representation in the model. It gets **enactment at the interface**.
Nobody asks what the mayor's sprite looks like when the mayor is you,
arguing with the treasurer, who is your friend.

## And now the roles can be cast

The part that's new in 2026: the roles don't have to be filled by
humans. [Soul City](../../catalogs/soul-city/) is the federation where
characters travel between games — and a character imported from another
game can *play* SimCity in a role. A Sim as mayor's advisor. A MOOLLM
character as the traffic engineer who files grumpy reports. An agent as
the opposition newspaper. The Sims already staged the recursion as a
gag — Sims playing SimCity on their in-game computer. Soul City takes
the gag seriously: the character comes from one world, sits down at a
role in another, and the *system* under discussion stays the
protagonist the whole time.

This is also the honest answer to the essay's politics. Bogost worried
that identification displaced systems thinking. Casting characters as
roles makes identity *operational*: who you are matters through what
your seat lets you see and do inside something bigger than you —
"the abdication of our own selfish, individual desires in the interest
of participating in systems larger than ourselves," which is the
essay's own wish, granted by role decomposition rather than by deleting
the people.

And the essay's closing — "We'll sign away anything, it would seem, so
long as we're still able to 'express ourselves' with the makeshift tools
we are rationed by the billionaires" — is a diagnosis with no exit
ramp. Soul City's answer is the punk one, with
[Nina Hagen as patron saint](../../catalogs/soul-city/README.md#the-attitude):
when the wall's owner starts rationing your tools, you don't petition —
you walk out with your voice intact and get louder. She did it to an
actual walled state in 1976; Soul Saver does it to the silos, moving
character souls onto rails nobody can expatriate you from. Bogost asked
us to play the game of systems rather than the game of identities; exit
is a systems move.

One footnote for the language-design bench: a role is a **dimension
binding**. Zork rebound WINNER when you said "ROBOT, PUSH BUTTON"; The
Sims bound `me` and `stackObject`; a SimCity role binds *which controls
and which views* a character gets over the shared model. Same move,
different substrate — see
[korz-prime](../david-ungar/korz-prime.md) on characters and locations
as the load-bearing pair.

## Show beatI

Read the essay's SimCity passages on air with Ian and Will — the
B. Dalton opening deserves to be read aloud, and it has a response beat
waiting: the essay opens with Dark Castle at Software Etc., and Don once
greeted Dark Castle's creator Jonathan Gay in the game's own
monster-voice
([sources/hn-dark-castle-nya.md](sources/hn-dark-castle-nya.md)). Then
answer with running code: Micropolis with the roles broken out, humans
and imported characters seated at the same city. The essay says games about systems
lost. The rebuttal isn't an argument; it's a table with more chairs.

## Links

- The essay: [Video Games Are Better Without Characters](https://www.theatlantic.com/technology/archive/2015/03/video-games-are-better-without-characters/387556/) (The Atlantic, 2015)
- [Micropolis](https://github.com/SimHacker/micropolis) — the open-source SimCity, multiplayer lineage included
- [Soul City catalog](../../catalogs/soul-city/) — character federation
- [ideas.md](ideas.md) — the rest of the Bogost segment map

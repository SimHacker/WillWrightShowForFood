# Invitation — Craig Hubley · Part 2 of 2: the Rosetta Stone

*[Portrayal standards](../../schemas/portrayal-standards.md) — edit, decline,
delay, or request removal anytime.*

Read [invitation-1.md](invitation-1.md) first — and watch the performance
before reading this. Spoilers for your own imagination below.

---

Now the Rosetta Stone.

What you watched is live audiovisual detournement through simulation bending —
playing Micropolis like jazz, using its cellular automata and tile engine as a
visual instrument. Nothing is synchronized or scripted. Jerry Martin's track is
prerecorded, and I improvise against it in real time with a small set of
controls, like a drag performer dancing and lip-syncing to a great song, after
decades of practice with this particular machine. (Jerry composed the music for
The Sims and later SimCity games, which makes the reuse of SimCity's visual
vocabulary land even harder: https://boombamboom.com)

And it really is a drag show. The tile sets are the costumes, and the cellular
automata rules and parameters are the acts: each automaton struts the same city
through a different number in a different outfit — outrageous, flamboyant
cabaret, completely sincere.

The mechanism: the city simulator and several cellular automata take turns
operating on the same tile map. The cellular automata see cells, neighborhoods,
birth, death, waves, and blobs. SimCity sees roads, zones, traffic, fires,
pollution, power plants, factories, and monsters. The tile renderer just
interprets whatever numbers are in memory as SimCity's visual vocabulary, so
arbitrary automata states come out as accidental urban collage. When I hand the
map back to SimCity, it wakes up inside the wreckage and tries to make
city-sense of it: erasing impossible traffic, spreading fires, recalculating
land value and crime, animating smokestacks, fountains, and radar dishes on
tiles that were never supposed to exist there.

**Two incompatible computational worldviews fighting over the same memory,
while I conduct the collision.**

The historical punchline: I built the city-melting mechanism around 1993 as
copy protection for the Unix version of SimCity. You could FTP the complete
game for free and play for a few minutes, and then the cellular automata would
melt your city, unless you called an 800 number, paid, and got an unlock code.
Secure web payment did not exist yet, so the melting WAS the business model.
Now the code is GPLv3 and the DRM purpose is dead, but the city-melting machine
has escaped and become the artwork.

More, now that you know what you are looking at:

- Another live performance, music by my housemate Juho Hietala, aka Blamstrain
  (https://blamstrain.com): https://www.youtube.com/watch?v=BBVyCpmVQew —
  a viewer summarized it as "Conway meets Wright!"
- Narrated demo of the instrument, weird things included:
  https://www.youtube.com/watch?v=wlHGfNlE8Os
- The source — the original SimCity C++ compiled to WebAssembly, with a WebGL
  tile renderer: https://github.com/SimHacker/MicropolisCore
- And something completely different, for dessert: https://vitamoo.space —
  press and drag to the left or right to spin them!

---

## You already know this story — you invented the frame

Thirty-six years ago you cast a net on Usenet for interactive performers and
found a pie-menu virtuoso doing blindfolded selections three layers deep at
CHI'88. You tracked me down, commissioned **Empowered** at CHI'90, and refused
to let me treat it as a demo:

> *"This is a performance… not so much about showing the system as showing you
> the expert using it… by pushing the pie-menu interface to the limit you get a
> gesture interface that ties the tools so tightly and personally to their user
> that they effectively become one cooperative entity."*

You gave me a drumroll, an audience that chanted *"Three! Three! Three!"*, and
the Glenn Gould closing — *every user an artist*. Ben Shneiderman photographed
me on stage in the pink cap ([photo in the archive](../don-hopkins/sources/1989-05-25-hubley-chi90-interactive-performers-cfp/assets/don-hopkins-chi90-empowered-shneiderman.png)).
Your 2007 LinkedIn note still says it best: my development methodology is
**performance art**. The Space Inventory performance is the same lineage — a
live instrument, not a recording — just with SimCity and cellular automata
instead of pie menus and PSIBER.

Full receipt chain:
[CHI'90 Empowered archive](../don-hopkins/sources/1989-05-25-hubley-chi90-interactive-performers-cfp/README.md)
· [your director's run sheet](../don-hopkins/sources/1989-05-25-hubley-chi90-interactive-performers-cfp/director-run-sheet.md)
· [Medium retrospective](https://medium.com/@donhopkins/empowered-pie-menu-performance-at-chi90-and-other-weird-stuff-869ccb75ad)

---

## And the show

This directory is your room in **Will Wright Show for Food** — a Repo Show: a
recorded conversation whose stage and product is a public GitHub repository.
Will is in; he's signed on for the
[premiere](../../repo-shows/will-wright-premiere/README.md) and more.

You invented the **interactive performance** forum at CHI when HCI still treated
live stagecraft as weird. I'm building **Repo Show** now — same bet, one level
up: the stage *is* a forkable public record. Conversation hooks and open design
questions are in [ideas.md](ideas.md).

So here is the actual ask, and it is not "come be a guest" — though you are
invited as one. In 1990 you co-designed how a *performance* should feel; in
1992 you ran the IP venue again and quoted a performer who met more worthwhile
people at CHI than at SIGGRAPH. I'm inviting you to collaborate again — as a
**co-designer of the Repo Show format**: what does "Empowered" look like when
the audience can open a pull request?

(And a design decision you already caused once: nobody here is a "guest," a
"user," or a "consumer." Everyone who joins a Repo Show **joins as a
player** — it's constitutional now. This is an invitation to play.)

---

## Someone you should meet: Tom Tjon A Loi

While you're forming your theory of the instrument, I want to introduce you to
**[Tom Tjon A Loi](../tom-tjon-a-loi/)** — Rotterdam concept designer, my 2009
Micropolis collaborator, REmemory ("AI as instrument, not output"). He storyboarded
the social multiplayer layer for open source SimCity while I was deep in engine
code; he gets performance-as-medium and worldbuilding-as-authorship the way you
get drama-over-demo.

**Tom × Craig** plans itself: you directed live HCI as theatre; he designs
social simulation as theatre; the Space Inventory is cellular-automata cabaret.
I'd love to put you in the same Repo Show room — or let you two design a segment
together. Tom's invitation is the same two-part structure:
[part 1](../tom-tjon-a-loi/invitation-1.md) ·
[part 2](../tom-tjon-a-loi/invitation-2.md).

Reply with a rough week, or "later" — interested, delayed, declined, or no
reply are all honored.

— Don Hopkins *(User Interface Flower Child)*

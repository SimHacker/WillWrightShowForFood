# Invitation — Tom Tjon A Loi · Part 2 of 2: the Rosetta Stone

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

## And the show

This directory is your room in **Will Wright Show for Food** — a Repo Show: a
recorded conversation whose stage and product is a public GitHub repository.
Will is in; he's signed on for the
[premiere](../../repo-shows/will-wright-premiere/README.md) and more.

In 2009 you storyboarded multiplayer Micropolis as a social, creative medium
and pitched it to the Architectuurfonds. That is now the roadmap: federation
plus **MOOLLM**, a LambdaMOO-descended system where LLMs are orchestration
instruments, not content dispensers. Your current line — "AI not as output,
but as instrument" — is the same stance stated independently. REmemory treats
AI reconstructions as interpretations rather than objective memories; that is
exactly the ethic our [portrayal standards](../../schemas/portrayal-standards.md)
are built on. You imagined this before it was buildable. It's buildable.

So here is the actual ask, and it is not "come be a guest" — though you are
invited as one. In 2009 you designed what multiplayer Micropolis could feel
like while I built the engine. Same division of labor, one level up: the
**Repo Show format itself** is the designable system now — the stage, the
audience participation, what a show even is when its stage is a forkable
public record. I'm inviting you to collaborate again — not as an intern this
time, but as a **co-designer of the format**. Conversation hooks and open
design questions are in [ideas.md](ideas.md); the format is young enough that
its best decisions haven't been made yet.

(And a design decision you already caused: nobody here is a "guest," a
"user," or a "consumer." Everyone who joins a Repo Show **joins as a
player** — it's constitutional now. This is an invitation to play.)

Reply with a rough week, or "later" — interested, delayed, declined, or no
reply are all honored.

— Don Hopkins *(User Interface Flower Child)*

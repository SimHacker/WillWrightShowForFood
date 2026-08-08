# Ideas — things to discuss with Tom

Conversation hooks for the show and after. Too good to cram into the
invitation ([part 1](invitation-1.md) · [part 2](invitation-2.md)) — browse
here instead.

## Cellular Automata Machinima

Is the Space Inventory performance machinima? It depends which machine you ask.

**In SimCity mode**, yes, arguably by definition: you are recording the SimCity
simulation running, panning and zooming over it, controlling it to a certain
extent — an engine performed for the camera.

**In CA mode**, no — and that's the interesting part. The cellular automata are
being used as a CA simulation engine *exactly the way a CA engine is meant to
be used*. SimCity was never meant to be used that way, but the automata aren't
bending SimCity's simulator at all — they're piggybacking on SimCity's display
engine, tile storage format, and buffer. The renderer is the borrowed part, not
the simulation.

So the form needs its own name, and there's a beautiful one sitting right
there: **Cellular Automata Machinima** — a gentle mutation of *Cellular
Automata Machine*, Toffoli and Margolus's term (and hardware, and book).
Performing cellular automata rules to tell stories.

## Nested simulations — how many machines is it, really?

"Two incompatible computational worldviews fighting over the same memory" is
the headline, but be careful with "two simulations" — several cellular
automata are involved, and they all share state with the city simulator. It's
not two programs; it's a nesting:

```
simcity
ca engine
├── dithered heat diffusion with chaotic wrapping
└── eco cellular automata
    └── anneal in one channel, deciding which rule runs in the other:
        ├── Life on land
        └── Brian's Brain in the water
```

**ECO** is the composition of three CA rules: anneal running in one channel,
used to multiplex the other two over *space* in the other channel. The anneal
layer picks which of the two rules runs at each cell — so Life and Brian's
Brain cells sit right next to each other, spilling organisms into each other
across the eroding waves of the beach. The coastline isn't a boundary between
simulations; it's a membrane where two ecosystems trade gliders.

One layer deciding which worldview governs the other layer, inside an engine
taking turns with a city simulator, on a tile map rendered as urbanism —
simulation all the way down. (Rudy Rucker had the idea of combining anneal,
Life, and Brian's Brain; the ECO composition and the beach membrane are where
it gets ecological.)

## The CAM6 lineage — storytelling with CA

The Space Inventory's automata share genes with a simulator Don wrote even
earlier, at university, using **Mitch Bradley's Sun Forth**: a software
emulation of the **CAM6 Cellular Automata Machine** — the hardware Tommaso
Toffoli and Norman Margolus built at MIT, documented in *Cellular Automata
Machines: A New Environment for Modeling* (MIT Press, 1987). It started as C
and Forth compatible with their Forth rule software, then evolved through C++
and Python into JavaScript.

The demo is all about storytelling with CA — but first it tells the story of
the CAM6 and the book:

- **CAM6 Demo** — https://www.youtube.com/watch?v=LyLMHxRNuck
- Live app: https://donhopkins.com/home/CAM6
- Source: https://github.com/SimHacker/CAM6

Things in it worth an hour of Tom's time:

- The narrated creation myth (Chapter 7): *"first the universe was complete
  chaos"* — then space, wormholes, planets, clouds, painted into being with
  convolution kernels. Literal worldbuilding as performance.
- The ECO rule (Rudy Rucker's combination): **anneal** deciding the shape of
  land and water, with **Life** on the land and **Brian's Brain** in the
  water — *"three different cellular automata sharing the same space, one
  deciding which space the other two share."* The empty space of each rule
  looks like stimulus to the other (it's actually anti-Life, the ones
  complement), so the shores breed gliders. The Space Inventory's
  shared-memory idea, decades earlier, in one rule.
- Bohemian worms vs. Yuppie worms (Zhabotinsky reactions with attitude).
- The TORBEN gray-goo rule, von Neumann's 29-state self-reproducing automaton,
  and painting *with rules as pigment* — sampling Life and Brian's Brain like
  colors off a palette.
- The throwaway line that predicts the performances: *"maybe if you're doing
  this to music it would be interesting to synchronize it with the music
  time."* (2022. The Jerry Martin performance answers it.)

## Costumes and the revue

From [invitation part 2](invitation-2.md), worth going deeper: tile sets are
the costumes, and cellular automata rules and parameters are the acts — each
automaton struts the same city through a different number in a different
outfit. Outrageous, flamboyant cabaret, completely sincere. What would Tom
costume the tile map in? He redesigned Micropolis's graphics once already.

Say the whole name out loud once: **Cellular Automata Machinima CAbaret Drag
Race**. The CA is already inside "CAbaret" — the pun stack IS the format.
Machinima names the medium, cabaret names the register, drag race names the
competition: performers bring their own tile sets (costumes), CA rules and
parameters (acts), and music, and the audience votes merge or sashay. Show
seed: [ca-machinima-cabaret-drag-race.yml](../../repo-shows/ca-machinima-cabaret-drag-race/ca-machinima-cabaret-drag-race.yml) —
verdict culture borrowed from the
[Micropolis AI Drag Race](../../process/DRAG-RACE.md). Tom is on the
candidate-player list, and on the candidate co-designer list, for the same
reason: he's the only person who has already sewn a full costume for this
particular queen.

## AI as instrument — the MOOLLM conversation

Tom's line: **"AI not as output, but as instrument."** MOOLLM's stance
exactly — LLMs as orchestration instruments in a LambdaMOO-descended world,
not content dispensers. His REmemory treats AI reconstructions as
interpretations rather than objective memories, which is the same ethic as
this repo's [portrayal standards](../../schemas/portrayal-standards.md). The
conversation isn't "look at this" — it's "play this": what does Tom's
practice do with a world-instrument?

## Storytelling, worldbuilding, adventures — simulation as narrative medium

The through-line from the CAM6 demo's creation myth ("first the universe was
complete chaos" — then space, wormholes, planets, clouds) to MOOLLM: the
worldbuilding instinct is the same, but the substrate changed from convolution
kernels to language.

MOOLLM is a microworld OS in the Colossal Cave / LambdaMOO lineage: the
filesystem is navigable space, directories are rooms, characters are
inheritable prototypes, and LLMs orchestrate rather than generate. A repo is
an adventure you walk through; a show is a world you build in public. Tom
studied Political Spatial Design at Sandberg — spatial design where the space
is political, narrative, and inhabited. MOOLLM is spatial design where the
space is a text adventure that's also a repository that's also a stage.

Things to ask him:

- The Sims' family albums were a *machinima literary genre* — captioned
  screenshot stories written by millions of players. What's the equivalent
  native genre for a MOOLLM world?
- His 2009 storyboards imagined multiplayer Micropolis as social worldbuilding.
  What does he storyboard now, with characters that talk back?
- Critical play (his DesignLAB vocabulary) inside a world where the design
  intervention *is* a playable room — what would a REmemory room look like?

## Soul City — he will totally get this

EA's old **Sims Exchange** — where players uploaded houses, families, pets,
and above all **family albums**, illustrated stories told in captioned
screenshots — survives only in the Wayback Machine. EA re-released The Sims
on Steam but left out the Exchange, the best part.

**Soul City** ([SimHacker/moollm — examples/soul-city](https://github.com/SimHacker/moollm/tree/main/examples/soul-city))
is where that content comes back to life: a Wizard of Oz tornado sweeps up the
archived houses, families, pets, and album stories and sets them down
somewhere they can live again, in color. Inspired by David Marusek's *The
Wedding Album* (1999), where simulated people campaign for the right to live
in a place called "Simopolis" — we're building that place.

This is REmemory's thesis at civilization scale: resurrection from an archive
is not retrieval, it's **interpretation**. Every rehydrated Sims family is a
reconstruction that must be honest about being one. Tom has already built the
ethical frame for this; Soul City is the biggest possible test case.

## The Repo Show form itself

The frame around all of this: a **GitHub repo as a stage** — for performance,
simulation, interviews, discussions, and debate. Not a new medium, a
reframing: blogs, podcasts, and YouTube are dead files with toxic comment
sections; a repo is a place that stays alive. Shows are directories; audience
participation arrives as pull requests; conversations are time-shifted and
recuttable; the stage and the archive are the same object. Will is in — he
signed on for the [premiere](../../repo-shows/will-wright-premiere/README.md)
and more. Format explainer: [What is a Repo Show?](../chris-trottier/repo-show.md)

This is squarely Tom's question. "Most brands know what they make. Few know
what they mean" — a Repo Show is a format where the meaning is inspectable:
the sources, the disagreements, the edit history, the audience's hands on the
material. What does a *debate* look like when its stage is a diffable public
record? What does he — a concept designer who builds narrative systems —
do with a show format that is itself a designable, forkable system?

### StoryMaker → Bar Karma → Urban Safari → ShowMaker

The format has a lineage, and Tom was in the building when it started. Don's
**StoryMaker** at Stupid Fun Club — geo server plus iPhone/iPad app, scenes as
card-based story atoms — was the substrate that powered **Bar Karma** (the
community-written TV show: the same stack in a broadcast writers' room) and
**Urban Safari** (field geo capture). Design history:
[StoryMaker / Shneiderman 2011 correspondence](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/storymaker/shneiderman-2011-correspondence.md) ·
[Bar Karma overview](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/bar-karma/overview.md) ·
[Urban Safari overview](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/urban-safari/overview.md).

**ShowMaker** is the next step in that evolution: it specializes StoryMaker —
same substrate (directories and files in git; scenes as cards; media on
branches), with a show layer added. A `SHOW.yml` makes a show a **graph walk**
over story content; the [ShowMaker network](../../process/showmaker-network.md)
treats shows and proposals as first-class objects in a browsable, forkable
graph — nodes are show dirs, edges are typed links, built from **MOOLLM
objects and graphs of YAML Jazz** in a GitHub repo. Spec:
[storymaker-stories-and-scenes.yml](../../process/storymaker-stories-and-scenes.yml).

For Tom this is one continuous conversation: the collaborative-narrative
machinery he watched being invented for television in 2009–2011, rebuilt on
git with LLM orchestration — and still young enough to co-design.

## Tom × Keez — Die Space and Soul City

Pair him with [Keez Duyves](../keez-duyves/): Keez's **Die Space** is the
afterlife social network — "you can still chat when you're dead" (TEDx
Amsterdam 2012 interred a whole live audience in it). Soul City resurrects
archived Sims families; Die Space premorializes living people. Two Dutch-scene
artists, two directions through the same membrane between the living and the
archived — with REmemory's interpretations-not-memories ethic as the third
leg. That's a two-hander (or three-hander with Don conducting) that plans
itself.

## Tom × Will × Keez — Proxi

And the panel that plans itself: add [Will Wright](../will-wright/). Will's
**Proxi** (Gallium Studios) is a game about your own memories — you rebuild
key moments of your life as playable scenes, and an AI learns who you are
from them: a memory-built twin. Now seat the table:

- **Will / Proxi** — memories reconstructed as simulation, feeding an AI self
- **Tom / REmemory** — AI reconstructions of memories as interpretations,
  never objective records
- **Keez / Die Space** — the social afterlife of selves, interment before and
  after death

Three projects, one question — *what is a memory once it's playable?* — asked
by a game designer, a concept designer, and a performance artist. Tom's
REmemory ethic is the critical hinge between Will's simulation optimism and
Keez's cabaret memento mori. Soul City is the fourth chair: memories that
millions of players already wrote, waiting for the tornado.

## Storytelling, worldbuilding, adventures, simulation — with MOOLLM

The big one. MOOLLM is one machinery inherited through one lineage: Colossal
Cave → MUD → LambdaMOO → The Sims → here. Rooms, objects, characters, a
parser — except the rooms are directories, the objects are files, the
characters are inhabitable prototypes, and the world is a git repository that
anyone can walk into, fork, and change. This character directory is already a
room. Tom could take edit access and make it his.

Threads to pull:

- **Worldbuilding as authorship.** The CAM6 demo's creation story — "first
  the universe was complete chaos," then space, wormholes, planets, clouds —
  is the same act as building a MOOLLM world, with different pigment: there
  you paint with convolution kernels, here you write rooms and characters
  into a tree. Both are storytelling with simulation. What would a Tom-built
  microworld look like?
- **Political Spatial Design, literally.** Tom studied it at Sandberg.
  LambdaMOO is the canonical case study: a shared simulated space that had to
  invent its own governance in public, dispute by dispute. A federated MOOLLM
  world re-opens every one of those questions — who owns a room, who may
  speak as whom, how a commons moderates itself. That's not a metaphor for
  his degree; it's the subject matter.
- **The family album as a genre.** The Sims Exchange hosted millions of
  captioned-screenshot stories — machinima literature written by players.
  Soul City (in [SimHacker/moollm](https://github.com/SimHacker/moollm)) is
  the Wizard of Oz tornado that lifts that archived content and sets it down
  where it can live again. Storytelling *with* a simulation's residue, not
  just inside its runtime.
- **Adventures as episodes.** A Repo Show doesn't have to be an interview —
  it can be played: an episode that is literally an adventure run inside the
  repo, with Tom designing the world it happens in. His 2009 storyboards
  imagined multiplayer Micropolis as a social creative space; MOOLLM is that
  space, generalized from cities to anything.
- **Simulation all the way down, again.** The Space Inventory nests automata
  inside an engine inside SimCity; MOOLLM nests characters who can simulate
  characters, rooms containing rooms, worlds forked from worlds. The same
  aesthetic — incompatible worldviews sharing state — as narrative
  architecture instead of tile graphics.

## 2009, unfinished

His storyboards — the social layer, multiplayer play, cities as shared
creative spaces — are now the federation + MOOLLM roadmap. He pitched open
source urbanism to the Architectuurfonds seventeen years before it was
obvious. What did he see then that still isn't built? What did he get wrong
that's more interesting than what he got right?

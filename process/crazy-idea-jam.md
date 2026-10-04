# 🤯 Crazy Idea Jam

> *AI proposes; the **PLAYER** disposes. Now let's get weird with it.*

This is where the show keeps the ideas that make Will lean in, raise an eyebrow and say *"wait,
do that one."* Some are serious enough to bet a decade on. Some are jokes that turned out to be
load-bearing. Most are both. Every one is real, taken from Don's design notes and the show seeds
already in this repo.

Ideas come from everyone: the audience, Will especially, Don even, famous over-reachers like
Peter Molyneux, and you. Anyone can propose; the player disposes.

**House rules:** keep it kind, keep it true, keep it weird. The wildest idea in the room still
has to *run* one day.

**Girder:** [`crazy-idea-jam.yml`](crazy-idea-jam.yml) · **Trail:** [stupid-fun-forward](trails/stupid-fun-forward.md) · **Serious arc:** [vision-and-ambition.md](vision-and-ambition.md) ([one-breath start](vision-and-ambition.md#vision-and-ambition) · [`long-now-and-later`](vision-and-ambition.md#long-now-and-later) · [girder](vision-and-ambition.yml))

---

<a id="the-crown-jewel"></a>
<a id="data-portability-crown-jewel"></a>

## 💎 The crown jewel

*The goal Will named on a Stanford stage in 1996, which still hasn't shipped. Everything else
here is a facet of it.*

### 💎 Data portability between games

Characters, homes, cities and *memories* moving between games and universes. Will said it out
loud in 1996, and nobody shipped it. Every bridge we build is one cut of this jewel, which is
why they're worth building.

<a id="character-endosymbiosis"></a>

### 🦠 Character endosymbiosis

A cross-game character is a *cell*, and each game it visits gets engulfed as an *organelle*
with its own DNA. Powers accrete in parallel; the soul file stays canonical and the runtimes
are disposable. Lynn Margulis as a save format.

<a id="identity-threads-through"></a>

### 📖 Identity threads through

Stats cross between worlds too, but the magic is identity: the same self across wildly
different forms, with story as the thread the stats hang on. Import a Stardew life into The
Sims as a photo album you shelve, read on the couch and leave out for guests.

---

## 🛂 The player at the gate

*The constitutional layer: the human stays in the middle of every transformation, and the
machine never gets the last word.*

<a id="player-in-the-middle"></a>

### 🛂 Player-in-the-Middle (PITM)

Syncing between games is itself a game, never silent and never automatic. You're the customs
officer at every membrane: AI proposes, you dispose. Maxwell's Daemon, *Papers, Please*, Saint
Peter at the gate and Satan at the back door. Gatekeeping as gameplay.

<a id="import-the-virtue-filter-the-vice"></a>

### 🧪 Import the virtue, filter the vice

Learn from a problematic genius by importing them as a filtered persona organelle: keep the
virtues, and keep the "bullshit and exploitation" valve firmly shut. First test subject:
MrBeast's tenacity, minus the hype.

<a id="sync-config-is-gameplay"></a>

### 🔧 Sync-config is gameplay

Turn the boring part, wiring the cross-game bridges, into casual mini-games: Widget Workshop
patches you build and swap. The Wedding Album round-trips a couple through Sims 1, 2, 3 and 4,
each edition a clean organelle.

<a id="interface-to-agency"></a>

### 🧭 An interface to agency

Anything an agent can do, a person should be able to do through an interface, and no
capability should be reachable only by asking the agent. The agent may bring more attention,
memory and bandwidth; it may not have a different set of verbs. People are agents too, and the
interface shouldn't care who is holding the pen.

The Sims already worked this way: objects advertise what they can do, and the pie menu the
player picks from and the list autonomy scores are the same list, feeding one visible,
cancellable action queue. Programming by demonstration runs both ways: you show the agent, and
the agent shows you. On the PDP-7, tiny-its gives an LLM exactly the commands a person has, and
any of them can be set to wait for a human to approve.

[MOOLLM: An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md) ·
[tiny-its](../packages/cabinet/TINY-ITS.md#an-interface-to-agency-with-the-player-at-the-gate)

---

## 🤖 Stupid Fun Club energy

*The blasphemous wing. Every one of these has been prototyped, proposed, or sincerely
threatened.*

<a id="robo-resurrection"></a>

### 🤖⛪ RoboResurrection

SLATS LIVES. Revive the old Stupid Fun Club robot-brain code on air. Slats calls in with his own
face and voice, gets interviewed, gets reprogrammed, and gets interviewed again, and the diff
is the drama. Do it on Easter Sunday. Start a cult. "It seemed to be the thing to do at the
time."

<a id="phoneloper"></a>

### 🗣️ Phoneloper

Drag diphones around, bend the pitch track, and "phonescope" synthetic speech over a real
voice. Hold the spacebar while dragging the pitch envelope and it *sings*: an accidental
granular synth. Don's 2003 SFC expressive-speech toy, in Python on Flite.

It wasn't the Slats voice, which went ViaVoice, then SAPI, then Cepstral. The synth family
tree runs Festival, Flite, Cepstral. [Demo](https://www.youtube.com/watch?v=qy5cqV8ypIs); the
source can be released soon.

<a id="rhetoric-organ-semantic-modulator-keyboard"></a>

### 🎹🗣️ The Rhetoric Organ

A chorded keyboard of rhetorical figures (EPIZEUXIS, DIACOPE, POLYSYNDETON, ALLITERATION) with
mood, register and persona faders, playing a streaming LLM in real time. Organ stops for prose.
Chords are registrations: DIACOPE plus EPANALEPSIS is the DRILL BABY DRILL preset. Velocity is
intensity: whale on ALLITERATION locked to S and you get Lem's Electronic Bard (*"Seduced,
shaggy Samson snored…"*, where Kandel translated the constraint, not the words).

It completes the Slats robopoetry loop with the missing instrument on the text side:
recognizer, organ console, Phoneloper, distorter, room, and round again. Keys are K-lines, and
a chord is a Korz context vector ([Korz′](../characters/david-ungar/korz/design.md)).

Ancestors: the 1939 Bell Labs Voder (they chorded phonemes; we chord semantics), Oblique
Strategies (a K-line deck; ours is chorded and continuous), Oulipo, Lucier, Homeric bards.
Invite David Levitt: machine improvisation in musical dialects is literally his thesis, and
Hookup patches the stations live on stage. [Full write-up](../characters/don-hopkins/rhetoric-organ-semantic-modulator-keyboard.md)

<a id="amsterdam-coffeeshops-app"></a>

### 🍃 Amsterdam Coffeeshops app

Don's 2009 iPhone app with every coffeeshop in Amsterdam, hacked at the Bluebird on the way
home from his TomTom day job, on his own time. It taught him iPhone and web-server programming
before he rejoined SFC. Never released, and ripe to reincarnate. A spreadsheet of every shop
drove it. [Demo (ASMR)](https://www.youtube.com/watch?v=nG90XG3STz8)

<a id="bongo-bingo"></a>

### 🚲🎯 Bongo Bingo

A Foursquare web game on the same coffeeshop database, also built on Don's own time while he
worked at TomTom. You get a bingo card of random shops and bike across town to check in at
each, GPS-verified, saying what you tried, which fed back into the spreadsheet. The true
ancestor of StoryMaker, Bar Karma and Urban Safari.

<a id="iloci-memory-palace"></a>

### 🏛️ iLoci (Memory Palace)

An iPhone app for the Method of Loci: rooms you *kiss together* to link and unlink, which makes
it secretly a pie-menu network editor. Don built it on his own time in 2008, mostly at the
Bluebird, and gave a talk about it at Mobile Dev Camp Amsterdam.
[Talk (recorded)](https://www.youtube.com/watch?v=03ddG3jWF98)

With Coffeeshops and Bongo Bingo it matched exactly what Will was working on (CurrentTV,
community GPS storytelling). Don showed them at an Amsterdam meetup, which Will missed, then
sent him the videos. Will's answer: "I'm leaving EA. Want to work together again?"

<a id="creationtv-storymaker"></a>

### 📺 CreationTV → StoryMaker

An iPhone prototype for Will at SFC that became StoryMaker, the branching collaborative
storytelling system behind CurrentTV's [Bar Karma](https://en.wikipedia.org/wiki/Bar_Karma):
the first online community-developed TV series, voted on and built by its audience, and aired
on real TV. MediaWiki, Python, Flash, iPad, Facebook and Unity3D. The direct ancestor of
audience-as-cast and questions-as-PRs. [Demo](https://www.youtube.com/watch?v=Nb_-J1lv-B8)

<a id="mediagraph"></a>

### 🎵🥧 MediaGraph

SFC, Unity, July 2015: songs and roads, a pie for each song (radius, cellular-automata biome),
kiss-to-toggle links, flick a song to travel like a Mario cannon, and level-of-detail terrain.
[YouTube](https://www.youtube.com/watch?v=2KfeHNIXYUc) · [Medium](https://donhopkins.medium.com/mediagraph-demo-a7534add63e5)

<a id="urban-safari-gps-storytelling"></a>

### 🗺️ Urban Safari (GPS storytelling)

The geolocated branch of StoryMaker: capture scene cards in the field and follow other people's
paths through a shared graph. Layar AR, a Facebook album round trip, playtested on Bar Karma's
audience. [2011 demo](https://www.youtube.com/watch?v=Db8KGNoeKHE), and in 2026 it comes back
live with an eBike layer.

<a id="ebike-safari"></a>

### 🚴🎤 eBike Safari

Singing while biking. Voystick is the main navigation: warble along a pie wedge's arc to hop
between places and cards, and switch freely between that and plain spoken commands. Lineage:
Logo Adventure, DreamScape, MediaFlow (Lisp and QuickTime), iLoci, MediaGraph, Urban Safari.

<a id="voystick-homomorphic-vocal-joystick"></a>

### 🎙️ Voystick (homomorphic vocal joystick)

Pitch is Y and vowel is X: a gestural voice channel underneath speech recognition. It runs
beside ordinary spoken commands, questions and tool selection (SpeechAnalyzer), and the rider
switches between the two or combines them ("Invader" plus a warble along the wedge). Don's best
gestural UI, built for Urban Safari's card graphs.
[CMU lecture](https://scs.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=f0600d9d-282e-4b83-a6f4-a9f2003ad407) · [show](../repo-shows/voystick-pink-trombone/README.md)

<a id="dreamscape-scriptx"></a>

### 🌀 DreamScape (ScriptX)

The ancestor of it all: Don's 1995 WWDC demo for Kaleida. Rooms and objects, bump icons
together to connect them, and a Netscape bridge publishing the live world as web pages. Its
design goal, "link globally, interact locally," runs through much of Don's work since. Demoed
live without crashing, and the origin of the mantra "a nurturing environment, not a killer
app." [WWDC demo](https://www.youtube.com/watch?v=5NytloOy7WM)

<a id="soul-bridge-afterlife"></a>

### 👻 Afterlife soul bridge

A two-way soul ledger between LucasArts' *Afterlife* and The Sims. Heaven and hell as upstream
supply for downstream worlds. The bridge is the gameplay.

<a id="hell-is-full-zombie-sims"></a>

### 🧟 Hell is full → ZombieSims

"Hell is full." Debit damned souls by religion, spawn matching zombie waves in SimFreaks and
SimSlice skins, scale up toward *They Are Billions* horde pressure, then round-trip the carnage
back to the hell ledger. Interview the suppliers: are these zombies artisanal? Farm-grown? Soil
to spike?

<a id="yoot-boot-and-seaman"></a>

### 🐟 Yoot Boot & Seaman

A clean-room Yoot successor, named with Yoot on air. The working title is YOOT BOOT, because
BOOT is BOAT in Dutch. It channels Seaman: a creature that remembers you, judges you, and
insults you between life lessons. 1999's most forward-thinking idea was treating the player as
someone worth being rude to.

He designs it with us and we code it for him: tower, boat, cruise liner, spaceship, submarine,
whatever. And it's time to bring Seaman back for the LLM era. (Yoot Tower itself is delayed by
licensing: abstract only, no pressure.)

<a id="cellular-automata-as-drm"></a>

### 🫠 Cellular automata as DRM

The 1991 free-but-not-free demo: play for five minutes, and if you haven't bought a licence the
cellular automata wake up and *melt your city*. The same rules later became the hypnotic
"Space Inventory":
[SimCity Micropolis Tile Sets — Space Inventory Cellular Automata to Jerry Martin's "Chill Resolve"](https://www.youtube.com/watch?v=319i7slXcbI)
and [Micropolis Web Space Inventory Cellular Automata Music 1](https://www.youtube.com/watch?v=BBVyCpmVQew).
You can watch for hours. Punishment and beauty from one engine.

<a id="pie-menus-put-out-fires"></a>

### 🥧🔥 Pie menus put out fires

Don Norman complained that pie menus made SimCity *too* easy: build fast, oops, nuclear
meltdown, merrily on your way. Don's rebuttal: *"Linear menus caused the meltdown. The round
menus put the fires out."* A live argument about whether making things easy helps or hurts
learning.

---

## 🧵 PDP-7 fun list

*Things to do with the emulated PDP-7 that PIXIE ran on, now that it has a Forth: new
languages for it, many machines sharing pixies, and tiny-its to run them all. The designs
behind them are in the cabinet docs:
[DESIGN](../packages/cabinet/DESIGN.md), [TINY-TITAN](../packages/cabinet/TINY-TITAN.md) and
[TINY-ITS](../packages/cabinet/TINY-ITS.md). Background:
[Mitch Bradley's PDP-7 Forth](../packages/cabinet/reference/PDP7-FORTH.md).*

<a id="xct-threading-writeup"></a>

### 🧵 Name Mitch's threading

Mitch's PDP-7 Forth runs every thread cell with one `XCT` instruction. Each cell *is* a PDP-7
instruction, and its opcode is its type. It may be a new kind of threading. Write it up with
Mitch and check it with Anton Ertl: *XCT threading* for the paper, *indirectly direct
threading* for the T-shirt.

<a id="pdp7-lisp"></a>

### 🥤 A Lisp for the PDP-7

None we know of survives. Deutsch's 1964 PDP-1 Lisp does, but the two machines aren't
compatible. Port it, or grow one on Mitch's Forth with PIXIE's ring cells as the heap (NIL is
the `JMS` opcode).

<a id="cheney-on-the-pdp7"></a>

### 🚇 Cheney on the PDP-7

A continuation-passing Scheme done Henry Baker's way ("Cheney on the M.T.A."): compile to CPS,
let the stack grow, and evacuate it with Cheney's copying collector. C. J. Cheney published
that collector from Cambridge in 1970, and Heinz's thesis thanks him for PIXIE's new garbage
collector, so he's already on this machine.

<a id="many-pdp7s-one-ring-heap"></a>

### 🔗 Many PDP-7s, one ring heap

Run several PDP-7s side by side and let them share memory holding pixies (PIXIE's ring
structures). A pixie's pointers are plain addresses, so the shared window sits at the same
address in every machine.

The trick is to leave PIXIE alone and share where it already keeps its data, the top of its
8K. PIXIE draws and edits; Forth or Lisp on the other machines read the same rings live. The
emulator is the lock: the others run only while PIXIE sits in its idle loop, where nothing is
half-built. Our own programs can lock with the PDP-7's `ISZ`.

Details, with addresses: [DESIGN.md](../packages/cabinet/DESIGN.md#the-application-layer--packagespixie-separate-module),
"Sharing PIXIE's own window".

<a id="two-tubes-one-heap"></a>

### 🔭 Two tubes, one heap

Two round 340 tubes side by side. PIXIE edits a circuit on the left. On the right, Forth reads
the same rings and draws them however it likes: another zoom, the netlist as a graph, or a
PSIBER view after Don's 1989
[PSIBER Space Deck](https://medium.com/@donhopkins/the-shape-of-psiber-space-october-1989-19e2dfa4d91e),
with rings drawn as rings and the free list thinning as the collector sweeps.

It works both ways. Point the pen at Forth's tube and Forth can edit the ring it hit. PIXIE's
tube catches up when PIXIE recompiles its picture, which the emulator can trigger by pressing
PIXIE's own buttons, the way the demo scripts already do. (Which button that is, we still have
to find.)

<a id="vm-messages"></a>

### 📨 VMs send each other messages

PIXIE already has two inboxes, and neither needs a change. One is its teletype: wire another
machine's teletype output to PIXIE's keyboard and it can type PIXIE's commands. The other is
the link to Titan: type `TITAN` to PIXIE and answer as Titan, and you can hand PIXIE a whole
new drawing through its 1972 code. That makes tiny-titan a switchboard.

Between our own machines we can add a proper mailbox. A message can be a single pointer into
shared memory rather than a copy. ITS did this with core links, which could interrupt the
receiving job; that's how `:SEND` put a line on your screen. tiny-titan can interrupt the
machines that ask for it, and carry `SEND` and `EVAL`.

<a id="tiny-its"></a>

### 🏫 tiny-its

A command line for a room full of emulated machines, named after MIT's Incompatible
Timesharing System. It isn't a timesharing system itself: the machines run in parallel, and
tiny-its is how you and your scripts reach all of them over a plain teletype line.

What you do with it:

- **Walk and edit pixies.** Point and mark as in Emacs; rooms and exits as in a MUD, which is
  MOOLLM's world view with rings in place of directories.
- **Debug and control.** Every machine is a job, as under ITS's HACTRN: list, boot, stop,
  continue, examine, deposit, assemble, disassemble, dump, load. It can debug itself, like
  PSIBER, from anywhere tiny-titan reaches.
- **Manage the room.** Map shared memory, set locks, mount devices on running machines, link
  teletypes into pipes. A deployment is a docker-compose file with a command line.
- **Script it.** A script is a turtle walking a graph, written by hand or recorded by doing it
  once, with Emacs's `SAVE-EXCURSION` to wander off and come back.

It should be easy to learn: TOPS-20's `?` help and completion, by way of Mitch's own
TENEX-style completion in Open Firmware, and the whole thing written in Forth. An LLM can type
at it too, with exactly the commands a person has and no others, and any command can be set to
wait for a human to approve it.

Design: [TINY-ITS.md](../packages/cabinet/TINY-ITS.md) and
[TINY-TITAN.md](../packages/cabinet/TINY-TITAN.md#what-it-could-do).

<a id="unix-on-the-cabinet"></a>

### 🐚 Unix on the cabinet

The 1969–70 PDP-7 Unix, restored by Warren Toomey and the pdp7-unix team from Norman Wilson's
scans, running next to PIXIE on the same kind of machine. It needs one device we don't have
yet, the RB09 disk, which we can port from SIMH. It brings `as`, `ed`, `roff`, `sh`, `db`, and
B, which compiles to threaded code like Mitch's Forth. Then Unix is one more machine on the
switchboard. [cabinet README, Next](../packages/cabinet/README.md#next)

<a id="display-list-protocol"></a>

### 📡 The display list is the protocol

Run any number of PDP-7s on a server and make the browser tab a terminal. The 340's display
list comes down, as the segment rows the emulator already writes, and pen, teletype and
switch events go up. The pen stays in the machine, so hits land in machine time while the tab
draws its own pointer. Later, send the 340 its program instead of its output, the way NeWS
sent PostScript. [DESIGN.md](../packages/cabinet/DESIGN.md#local-mode-and-remote-mode)

<a id="teletype-pipes"></a>

### 🔌 Teletype pipes

Wire one machine's teletype output to another's input: `PIPE FORTH | PIXIE | LOG`. The
emulator holds back the sender until the receiver has read, so nothing is lost and no program
changes. Files can stand in for the paper tape punch and reader, and a person or an LLM can sit
at either end. PDP-7 Unix never had pipes; now its machines do.
[TINY-ITS.md](../packages/cabinet/TINY-ITS.md#teletype-links-and-pipes)

<a id="hilbert-heat-map"></a>

### 🗺️ Memory heat map on a space-filling curve

Count every read and write, then draw all of memory on a Hilbert curve (8K words as two 64×64
squares end to end), so neighbouring addresses stay neighbours on screen. Watch PIXIE's free
list churn and its garbage collector sweep.
[DESIGN.md](../packages/cabinet/DESIGN.md#the-application-layer--packagespixie-separate-module)

<a id="pixie-space"></a>

### ✨ Pixie space

NeWS had magic dictionaries and Linux has `/proc`. Give each machine a magic segment: memory
the emulator fills with live pixies describing that machine, its devices, locks and symbols.
Read them to look, change them to act, and follow a link to walk into another machine. Then
make Linda's tuple space with pixies instead of tuples. Live magic pixies traveling between
worlds. [TINY-ITS.md](../packages/cabinet/TINY-ITS.md#magic-segments-and-pixie-space)

<a id="pixie-rings-are-pie-menus"></a>

### 🍄 Pixie rings are pie menus

A pixie ring is mushrooms around a centre, joined underground by a mycelium nobody sees. That
is an RSP ring, and drawn around its centre it is a pie menu: you in the middle, the rings
through you as slices, flick to go, and every slice a way back, because rings come home.

PIXIE's lightbuttons already rode in a ring around the tracking cross in 1972, and PSIBER's
Pseudo-Scientific Visualizer is a recursive pixie ring projector.

The folklore reads like the manual:

- step in and you dance until someone outside pulls you out;
- run round nine times, never ten;
- whoever cleans the ring "an easy death shall dee."

[TINY-ITS.md](../packages/cabinet/TINY-ITS.md#pixie-rings-are-pie-menus)

<a id="apple-ii-in-the-mix"></a>

### 🍎 An Apple ][ in the mix

Later: a 6502 next to the PDP-7s, run by the same tiny-its. It trades messages and events
rather than rings, since it has 8-bit bytes, and Apple Logo's turtle can race Mitch's.
[cabinet README, Next](../packages/cabinet/README.md#next)

<a id="turtles-all-the-way-up"></a>

### 🐢 Turtles all the way up

The whole stack, each layer an interpreter or compiler for the one above:

- **native CPU**, itself decoding x86 or ARM into micro-ops;
- **JIT**, V8 or JavaScriptCore or SpiderMonkey;
- **JavaScript**;
- **TypeScript**, which exists only at build time: `tsc` erases it, the tiny-titan of the
  stack;
- **PDP-7**, the [cabinet](../packages/cabinet/README.md), running SYMELEC and DUEL today;
- **Forth**, Mitch's, running on SIMH, waiting for a loader in the cabinet;
- **Lisp**, in Forth, to do;
- **RSP**, the ring library PIXIE is built on, as Lisp words, to do;
- **Type 340 display**, a computer of its own, with its own instructions and program counter,
  its vectors drawn on a canvas by a GPU, the oldest lap of the wheel drawn by the newest;
- **turtle**, Logo drawing into pixie rings you can pick up with the pen, to do.

That's seven program counters stacked, and the JIT turns a PDP-7 `XCT` into x86 or ARM in the
end. Honest budget: 8K words is tight (Forth takes 2.8K, SYMELEC alone was 5K), so give the
cabinet 16K.

---

## 🚀 Forward-thinking foundations

*The serious wing. Quieter, but these are the ones that rearrange how everything else works.*

<a id="github-as-mmorpg-multiverse"></a>

### 🌌 GitHub as MMORPG multiverse

Branches are parallel universes, PRs are timeline merges, issues are the tavern, and every
viewer gets a playspace. Reclaim "repo" from the tow truck: Repo Man, Woman and Bot honorifics,
quest levels that onboard kids through web-editor PRs, badges from Actions.

<a id="self-times-moollm"></a>

### 🪞 Self × MOOLLM

Prototype-based objects for the LLM era: directories as prototypes, the Stage Magic Principle
as the semantic pyramid, Idea Scavenging as persistent characters. Built live with David Ungar;
artisanal hand-programming against intentional AI.

<a id="simulator-effect"></a>

### 🧠 The Simulator Effect

Games run on two computers: the tame one on the desk and the wild one in the player's head. The
whole trick is offloading simulation into the player's brain. Rule of thumb: never simulate
more than one layer below what the player can see.

<a id="full-nutrient-cycle"></a>

### 🌱 Full nutrient cycle

Land, seed, crop, food, body, mind, shit, land. As cellular automatists we cover the whole loop.
Water is donations; fertilizer is tokens. A nurturing environment, not a killer app: the Flower
Child nurtures, and the buyout extracts.

<a id="educational-data-literacy"></a>

### 📊 Educational data & GitHub literacy

Make the sim export its guts. Prof. Upmanu Lall at Columbia wanted SimCity to spit out
spreadsheets, so students from any department could learn science through a game they relate
to. The modern version streams Micropolis and Yoot Tower telemetry into d3 and Grafana. Don's
OPTIMUS proposal of about 2002 only became possible after the open-sourcing.

And GitHub literacy is what this is all about: collaborating on GitHub is an essential skill
for kids and grown-ups, and it applies to everything.

<a id="scriptable-simulators"></a>

### 🧩 Scriptable simulators

Push the UI out of the engine and let players reprogram the rest. Emscripten and embind let you
subclass the C++ engine in JavaScript, with zones, agents and robots as plug-ins. Put Snap! or
Blockly on top so kids can live-code the sim. PacBot follows the roads eating traffic, and the
Church of Pacmania worships and feeds it. The spirit of SimAntics' visual programming, made
easy.

<a id="towers-in-micropolis"></a>

### 🏙️ Towers in Micropolis

Put several Yoot Towers inside your Micropolis city. Same Maxis era, same WASM, embind and
SvelteKit stack, so a tower becomes a building in a city. Data portability you can point at.

<a id="engelbart-keyset-3d-replica"></a>

### 🖱️⌨️ Engelbart keyset, democratized

3D-scan an original Engelbart mouse and five-key chord keyset, and publish a free printable
model. It could range from a plastic toy that rolls and clicks up to a working Bluetooth
replica with real wheels and the right weight, for any Mac or PC. The Computer History
Museum's shop sells kits and assembled sets; the files stay free forever. Preservation by
proliferation: put a tool built to augment human intellect back in everyone's hand.
(Preservation framing only.)

---

## 🌶️ How an idea graduates

An idea earns its way out of the jam by becoming runnable: a [show seed](../repo-shows/README.md),
a [schema](../schemas/README.md), a harvested [skill](../skills/README.md) in the cauldron, or a
[trail node](cross-links.yml). Until then it lives here, simmering, and occasionally singing
when you hold the spacebar.

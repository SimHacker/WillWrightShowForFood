# The Logo turtle: children, machines and the room

A plan to recreate the first Logo turtles as they were used: not only a robot with a pen drawing
on paper, but the children at the Teletypes, the cable and the phone line, the time-shared PDP-10
at the MIT AI Lab answering them, the classroom, and Seymour Papert and Cynthia Solomon teaching.
It is a scene for the [portrait](PORTRAIT.md)'s scene player, and the same chain of cause and effect
as [CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md): a child types, characters go down a wire, a stepping
motor turns, a pen marks the paper, and the child sees what their procedure did.

## What happened

From the History of Logo (Solomon, Harvey, Kahn, Lieberman, Miller, Minsky, Papert, Silverman,
HOPL 2020; [open access](https://dspace.mit.edu/handle/1721.1/133952)) and Solomon's own
[account of the 1970s](https://logothings.github.io/logothings/The70s.html):

- **1966–67, BBN.** Seymour Papert, Wally Feurzeig, Daniel Bobrow and Cynthia Solomon invented
  Logo. Bobrow implemented it in Lisp on BBN's time-shared SDS 940, and in summer 1967 Papert
  taught it to ten-year-olds at the Hanscom School in Lincoln, Massachusetts.
- **1968–69, Muzzey Junior High, Lexington.** Twelve Teletypes in a classroom, connected to BBN's
  PDP-1. Seventh graders wrote programs about words and games. There were no turtles yet.
- **1969–70, the MIT AI Lab.** Solomon joined Papert and the MIT Logo Group began. The turtle,
  named for Grey Walter's robot tortoises, came as the Muzzey work ended. The group built two floor
  turtles, a large yellow canister and a smaller plexiglass one, both tethered by a cable; a display
  turtle, first driven by a PDP-6 from Logo on the lab's PDP-10; and Marvin Minsky's four-voice
  music box. Ron Lebel was chief programmer of Logo on the PDP-10.
- **1970–72, the Bridge School, Lexington.** Papert and Solomon taught fifth graders in two small
  rooms with a large window between them. The children used Logo over phone lines to the AI Lab's
  PDP-10; the display turtle ran on a small Data General computer. The class also did bongo boards
  and juggling, as exercises in procedures and debugging.
- **1972, Exeter.** Logo on a PDP-11/45 with portable turtle graphics terminals, turtles, the music
  box, and children, including twelve-year-old Jonathan Pledge, who found the maze algorithm that
  carries his name.
- **After.** Radia Perlman's button box (TORTIS) let preschoolers drive the turtle; General Turtle's
  TT2500 display (about 1975) went to the Brookline project in 1977; Terrapin began selling floor
  turtles in 1977.

How the floor turtle worked, from Papert and Solomon's
[*Twenty Things to Do with a Computer*](https://dspace.mit.edu/handle/1721.1/5836) (1971): the
turtle is attached "by a wire that plugs into a control-box that connects to a telephone line that
speaks to the computer, which thinks it is talking to a teletype." It has a pen at its centre,
stepping motors, and inlets for sensors: the memo's examples use FRONTTOUCH, BACKTOUCH, LEFTTOUCH and
RIGHTTOUCH to follow a wall and find the door of a room. Children called the robot the "turtle
turtle" and the one on the screen the "display turtle."

## The software survives

The [PDP-10/its](https://github.com/PDP-10/its) project has the period's Logos, documented in
[doc/logo.md](https://github.com/PDP-10/its/blob/master/doc/logo.md), and several run under
emulation today:

- **CLOGO**, MIT's port of BBN Logo with turtle graphics added; **LLOGO**, Lisp Logo by Ira
  Goldstein and Henry Lieberman, with turtle packages for the Knight TV and the Type 340; and
  **11LOGO**, the PDP-11/45 Logo, which runs on the KA10 simulator with a 340.
- **The floor turtle's protocol** is in 11LOGO's [`turtle.62`](https://github.com/PDP-10/its/blob/master/src/11logo/turtle.62):
  one ASCII character per step down the line, `C` forward, `@` back, `B` right, `A` left; `8` pen
  up, `0` pen down; `"` lamp on, `!` lamp off; `(` for each toot.
- **Perlman's TORTIS** is in [`src/radia/tortis.31`](https://github.com/PDP-10/its/blob/master/src/radia/tortis.31),
  with its button box mapped to forward, back, left, right, lamp, pen and toot.
- Brian Silverman has revived the TT2500 in the browser
  ([MinskyLogo](http://www.playfulinvention.com/demos/MinskyLogo/)).

So the simulated turtle can be driven by the actual code: run ITS Logo, connect a virtual Teletype
line to a virtual control box, and let the 1970s program send its characters to a turtle on a
virtual floor.

## What to build

**1. The turtle as a device on a Teletype line.** It reads the `turtle.62` characters, moves its
two wheels by stepping-motor steps, raises and lowers its pen, lights its lamp, toots, and reports
its touch sensors back up the line as characters. Step size, wheel base and speed come from photos,
films and anyone who remembers; until then they are knobs, labelled as guesses.

**2. The physical world.** A floor with paper on it, a pen that leaves ink where it touches, walls
and furniture for the touch sensors to find, and the tether: a cable from the turtle to the control
box that drags behind it and can tangle, which is why later turtles went wireless.

**3. The machines.** ITS Logo running in SIMH's KA10 now, and in the cabinet's own KA10 when it
exists ([PDP10.md](PDP10.md)); Teletypes; the phone line and its modem; the control box; the music
box; the display turtle on a 340 or a TT2500. The cabinet's [Forth turtle](reference/FORTH-TURTLE-340.md)
on the PDP-7 and 340 is a different thing, a Logo-style turtle in Forth, and stays a separate demo.

**4. The room and the people.** The Bridge School's two rooms and the window between them, from
Solomon's photographs; Teletypes on tables; the turtle on the floor; children at the keyboards and
on the floor following it. The children are stylized and generic, not likenesses: the children in
the films are adults now, and none of them has been asked. Papert appears in memorial mode, from
documented photos and films, never speaking words he didn't say. Cynthia Solomon is living, and is
portrayed only with her consent and guidance ([portrayal standards](../../schemas/portrayal-standards.md)).

**5. The scenes.** Each one a recorded, replayable history, with tours anyone can author:

- A child types `FORWARD 100` at a Teletype; follow the characters down the phone line to the
  PDP-10, back out as `C`s, through the control box to the motors, to the line on the paper.
- Playing turtle: a child walks the path on the floor before typing it, what Papert in *Mindstorms*
  (1980) called body-syntonic learning; the walk and the turtle's path drawn side by side.
- The wall follower from *Twenty Things*: FRONTTOUCH and the others, the turtle finding the door.
- A bug: the square that doesn't close, and the class debugging it together.
- The music box and the turtle running from the same Teletype line.
- Slow motion through the whole chain, as in [BEAM-AND-PEN.md](BEAM-AND-PEN.md), from a keystroke
  to a stepping-motor step.

## Footage and photos to work from

- MIT AI Lab films, digitized: [the archive](https://projects.csail.mit.edu/video/history/aifilms/),
  with turtle reels 08, 17 and 22, Logo reels 25, 28, 40, 44, 50, 58 and 62, and bongo board reels
  18, 21, 54, 59 and 60; [the reel list](https://projects.csail.mit.edu/films/aifilms/FilmList.html).
- Cynthia Solomon's videos, including [Logo's Yellow Turtle](https://youtu.be/KeFhFPNO8hc),
  [Logo programming 1970](https://youtu.be/e9vQSZvSABY), and
  [Seymour Papert on a bongo board](https://youtu.be/Urn4y5kmtuU); her
  [channel](https://www.youtube.com/@cynthiaso), indexed in [her room](../../characters/cynthia-solomon/README.md).
- Her photographs of the turtles, the Bridge School rooms and Perlman's button box, on
  [logothings](https://logothings.github.io/logothings/The70s.html).
- *NOVA: Talking Turtle* (1983), [at the Internet Archive](https://archive.org/details/NOVATalkingTurtle).

## Open questions

- **Who built the yellow turtle.** HOPL credits the canister to Russell Noftsker and John Roe and the
  plexiglass turtle to Tom Callahan; Solomon's page credits the yellow one to Callahan.
- **Irving.** Wally Feurzeig is quoted as saying BBN engineer Paul Wexelblat built Irving, the first
  wireless floor turtle, in 1972; Wikipedia calls it the original Logo turtle and places it at
  Muzzey, which HOPL contradicts. The primary source needs finding.
- **The Data General machine** at the Bridge School, and the turtles' step size and speed.
- **Paper on the floor.** Whether the turtles drew on sheets laid on the floor, as photos may show.

## Who to ask

[Cynthia Solomon](../../characters/cynthia-solomon/README.md), who taught the classes and kept the
record; [Margaret Minsky](../../characters/margaret-minsky/README.md), assistant teacher at Exeter,
Logo Group staff, and one of the TT2500's builders; [Brian Silverman](../../characters/brian-silverman/README.md),
who revived the TT2500; [Henry Lieberman](../../characters/henry-lieberman/README.md), co-author of
LLOGO; [Brian Harvey](../../characters/brian-harvey/README.md) and [Ken Kahn](../../characters/ken-kahn/README.md),
co-authors of the History of Logo; and [Lars Brinkhoff](../../characters/lars-brinkhoff/README.md),
who keeps ITS running. Seymour Papert and Marvin Minsky are remembered in their
[memorial](../../characters/seymour-papert/README.md) [rooms](../../characters/marvin-minsky/README.md).

## Order of work

1. ITS Logo running in SIMH, with a Teletype line we can tap; a turtle that prints its moves.
2. The turtle device in the browser, reading `turtle.62`'s characters, with a pen on a 2D floor.
3. Touch sensors, walls, and *Twenty Things*' wall follower.
4. The tether, the lamp, the toot, and the music box.
5. The room, the machines and stylized children in 3D, with Solomon's guidance.
6. Scenes and tours, slow motion through the chain, and the cabinet's own KA10 when it runs ITS.

## Where the line goes on: the escalator to turtleSpaces

The turtle didn't stop in 1975. Apple Logo II carried it into schools, and
[turtleSpaces](https://turtlespaces.org/), by [April](../../characters/april-ayres-griffiths/README.md) and
[Melody](../../characters/melody-ayres-griffiths/README.md) Ayres-Griffiths, carries Apple Logo II into
three dimensions, in a browser and on the desktop, with a gallery to publish and remix in.

The cabinet doesn't build a modern Logo of its own. The 1970s ITS turtle is the historical end of
the escalator; turtleSpaces is the modern end, and anyone the old turtle hooks gets sent there. That
is also the most direct way to help its authors make a living from it.

**The `turtle.62` stream can drive a turtleSpaces turtle.** turtleSpaces has a socket API: the
`api` primitive opens port 1967, which you can reach with telnet or from another program, and each
connection runs its instructions as its own worker, so several can drive turtles at once
([reference](https://turtlespaces.org/reference/environment/#cmd-api)). A translator reads the
characters ITS Logo sends down the Teletype line and writes turtleSpaces Logo:

| `turtle.62` | turtleSpaces |
|---|---|
| `C` forward one step, `@` back one step | `forward 1`, `back 1` (scaled to the floor turtle's step) |
| `B` right, `A` left, one step of turning | `right` and `left` by the floor turtle's angle per step |
| `0` pen down, `8` pen up | `pendown`, `penup` |
| `"` lamp on, `!` lamp off | a light or a colour change on the turtle |
| `(` toot | a note |

Runs of the same character collapse into one command (`CCCCC` becomes `forward 5`). The browser
can't open a TCP socket, so the bytes go through tiny-titan's host side, or a few lines of Node, to
port 1967 on the desktop app. The same 1975 program then draws on the 1970s floor in the cabinet and
in turtleSpaces at once, and the second window is where a learner keeps going.

Their Apple ][ emulator, microM8, runs Apple Logo with 3D modes added, and is the target of the
cabinet's first cross-emulator demo: Forth on the PDP-7 sends a figure through
[tiny-titan](TINY-TITAN.md#first-demo-pixie-rings-to-microm8s-3d-turtle), and microM8's turtle draws it.
How the cabinet can work with both is in [MICROM8.md](MICROM8.md).

↑ [README](README.md) · [PORTRAIT](PORTRAIT.md) · [CAUSE-AND-EFFECT](CAUSE-AND-EFFECT.md)

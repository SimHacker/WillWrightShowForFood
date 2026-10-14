# Who's In The Box?

A guessing game about characters. Somebody is hiding inside a box, or
nobody is, and you can find out who only by working the box. The box has a
narrow interface, a switch or a key or a pen. The occupant answers through
it with timing and gesture. Anyone can make an occupant: type up a
character profile, write a program, or go in yourself and improvise one
with your hand.

The pilot is Minsky's Ultimate Machine, the box whose only act is to switch
itself off ([PORTRAIT.md](../../packages/cabinet/PORTRAIT.md#whos-in-the-box)).
The format works with any box.

## Precedents

- **Kempelen's Mechanical Turk** (1770): a chess automaton with a person
  hidden in the cabinet. The doors opened to show machinery and no one
  inside.
- **Turing's imitation game** (1950): an interrogator works out who is who
  only by asking questions through a narrow channel. Our channel is
  narrower still: one switch.
- **What's My Line?** and **To Tell the Truth**: panel shows in which you
  question people to work out who they are and who is bluffing.
- **The Ultimate Machine**: Minsky's idea, built by Shannon at Bell Labs,
  so each has a claim to being the one inside.

## The format

| Part | What it is |
|---|---|
| **The box** | Any cabinet device with a visible act and a few readable registers. The Ultimate Machine is the pilot. Others could be a teletype that types back, a 340 that the occupant draws on, a turtle, or a chess board. |
| **The occupant** | Whoever or whatever drives the box's registers from inside. It might be a character profile, a recorded performance, a program, a live performer, or nobody. |
| **The player** | Works the box from outside, using only what the box allows. |
| **The door** | Shows the occupant. Opening it ends the round. |
| **The replay** | After a guess, the round plays back beside the box's lights and registers, so you can see what the occupant actually did. |

**The question is always "who's in the box?"**, and "nobody" is a fair
answer. It is never "is it alive?": there is no cat here.

### Two rules that make it deduction, not luck

1. **The evidence is readable.** The box's state lights and timing
   registers are real device registers that the player can watch. A good
   player measures the occupant instead of guessing.
2. **Every impersonation gives itself away eventually.** An occupant can
   play someone else, but not perfectly. A robot doing Shannon gets the
   speed right but never improvises the flourish. Profiles are written
   with a *tell* that leaks.

### Scoring

You start with points and pay a little for each move on the box. A
correct guess scores what you have left. Opening the door gives you the
answer but costs a large penalty. Some rounds pay a bonus for guessing
"nobody" correctly.

## Rounds

- **Solo.** One occupant, one player, one guess.
- **Nobody.** The box may be empty: fixed timing, no learning, no sound.
  This is a reverse Turing test, where you have to decide whether there is
  anyone in there at all.
- **To Tell the Truth.** Three boxes all claim the same character. One
  holds the character's own author, or a living person playing themselves
  with their consent. The other two are impostors. Which is the real one?
- **Tag team.** Two occupants share one box and take turns without
  warning, like Trurl and Klapaucius. Spot the changeover.
- **Robots all the way down.** The occupant opens a smaller door inside
  and sends in a smaller occupant, until you reach a mirror or another
  empty box.
- **Improv.** A live performer goes in, the audience shouts a character,
  and the players guess who the performer is doing. The players don't hear
  the suggestion, only the box's performance.
- **Make one.** A player becomes the occupant and the others guess. This
  is how new occupants enter the roster.

## Occupants

An occupant is a **character card**: a profile and its tells, with
performances attached.

| Field | Meaning |
|---|---|
| timing | How quickly it answers, and how much that varies |
| hand | How it moves: a flourish, a hesitation, jerky precision, tidying first |
| sound | What you hear from inside. Silent for tributes (see below). |
| adaptation | What it does when you keep cancelling it: learns, gets less predictable, escalates, or nothing |
| reveal | What the door shows |
| tell | The giveaway that leaks when it impersonates someone else |
| author | Who made it. Always shown at the reveal. |

The pilot roster is in [PORTRAIT.md](../../packages/cabinet/PORTRAIT.md#whos-in-the-box):
Shannon, Minsky, Nobody, a homunculus robot, Trurl, Klapaucius and the
Sims robot maid. The roster is open.

### Who may be in the box

These follow the repo's [portrayal standards](../../schemas/portrayal-standards.yml).
Every occupant is a labeled simulation, and the reveal always names the
character and its author.

- **Fictional characters** (Trurl, Klapaucius, the Sims robot maid,
  robots, homunculi) are labeled fan portrayals and may do anything,
  including talking.
- **People who have died** (Shannon, Minsky, Turing) appear as **silent
  tributes**. Their tells come from documented work and artifacts, such as
  Shannon's juggling and unicycle and his mind-reading machine, or
  Minsky's tentacle arm, Logo turtles and *Society of Mind*. They have no
  voice, no invented quotes and no invented inner life. The hand performs;
  nobody speaks as them.
- **Living people** are in the box only as themselves or with their
  consent, never through a voice clone. To Tell the Truth is the round
  built for a real guest.
- **Yourself**, always. That is the "Make one" round.

### Gestures and the law

The game is gestural impersonation, so the first question is who owns a
gesture. Mostly nobody does: a movement your body can make is not property.
The limits sit around it.

- **Copyright protects choreography, not steps.** The US Copyright Office
  will not register social dances, simple routines or individual moves
  (*Compendium (Third)* §805). It refused Alfonso Ribeiro's Carlton dance
  in 2019 as a simple routine. But *Hanagami v. Epic Games* (9th Cir. 2023)
  held that a short routine can still be protected choreography, because the
  selection and arrangement of steps is what's owned, as notes make a song.
  A tell is a step. Copying a whole signature routine move for move is the
  risk.
- **Trademark rarely reaches a gesture.** Gene Simmons applied to register
  the "devil horns" hand sign in 2017 and abandoned the application within
  weeks. A gesture is a mark only if it identifies who sells something,
  and an impersonation sells nothing.
- **Patents cover devices, not moves.** Michael Jackson's anti-gravity lean
  is US Patent 5,255,452 (1993): the shoes and the stage pegs that made it
  possible. Anyone may lean; only the mechanism was owned, and only for
  the patent's term.
- **A pose is not a photograph.** *Rentmeester v. Nike* (9th Cir. 2018) found
  that Jordan's leap belonged to nobody. A photo's own choices of angle, light
  and arrangement were the protected part, and Nike's photo didn't copy them.
- **The person is protected, not the gesture.** The right of publicity is
  the real limit for living people. *White v. Samsung* (9th Cir. 1992)
  found that a wigged robot turning letters evoked Vanna White enough to
  count. That is why living people are in the box only as themselves or with
  consent: a recognisable impersonation can be an appropriation of identity,
  even when every move in it is free.
- **Some gestures are crimes.** Germany's StGB §86a bans the Hitler salute
  along with other symbols of unconstitutional organisations, and other
  countries have similar laws. Whatever the law where you are, hate
  salutes are out of the game, and a card that uses one is removed.

So a tell is fair game, and a whole routine needs its author's permission.
A living person needs their consent, and a hate symbol is never allowed.

## Making occupants

Everything a player makes is content for the show:

1. **Write a card.** Fill in the fields above in YAML, and the cabinet
   runs the profile as the occupant.
2. **Program one.** An occupant drives device registers like any other
   program, so it can be TypeScript, Forth on a PDP-7 next to
   [ultimate.fs](../../packages/cabinet/tapes/pdp7forth/ultimate.fs), or a
   PDP-10 job with the box mapped into its memory
   ([MAPPING.md](../../packages/cabinet/MAPPING.md#device-registers-are-memory-too)).
3. **Perform one.** Webcam hand tracking (for example MediaPipe Hand
   Landmarker, 21 points per hand, in the browser) drives the puppet hand
   as IK targets. Your hand hesitates, flutters, points, flourishes and
   presses, and the switch flips only when the puppet finger reaches it.
   The tracking driver is the cabinet's DataGlove, device 57 on the PDP-7
   ([HAND-TRACKING.md](../../packages/cabinet/HAND-TRACKING.md)), so it can
   work any machine's box through that machine's bus.
4. **Record it.** A performance is the box's register writes plus the
   hand track, timestamped on the cabinet's recording timeline. A card can
   carry several recordings and mix them, so a recorded occupant doesn't
   repeat itself exactly. Only Nobody does that.

The full-body occupant you see behind the door can be a VitaMoo Sims
character ([puppet taxonomy](../../bits/tradition-puppet-taxonomy/tradition-puppet-taxonomy.yml)).
The robot maid in particular is already a Sims character.

## Building it

| Step | Done when |
|---|---|
| The Ultimate Machine device | Done: [ultimate.ts](../../packages/cabinet/src/plugins/ultimate.ts), device 56, on the cabinet menu |
| IOTs to read the cancel count (`aborts`, already counted) and the last switch-on time | An occupant can learn a player's rhythm |
| Occupant interface and the Nobody card | A TypeScript occupant drives device 56 on the cabinet's clock |
| Cards for the pilot roster | Each one's tell is visible in its register trace |
| The floor cabinet, door and inside lights, in 3D | The door reveal and phase lights render in the portrait |
| Hand tracking into the arm | A webcam hand presses the switch through `UMOF`. The tracker is done: [DATAGLOVE](../../packages/cabinet/HAND-TRACKING.md) on the menu |
| Recording and replay | A round replays beside its registers after the guess |
| Rounds and scoring | Solo and Nobody playable on hyperties.org |
| A second box | The format works without the Ultimate Machine |

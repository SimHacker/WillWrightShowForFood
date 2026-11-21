# Upcycling Little Computer People

The goal was to make Activision's Little Computer People (1985) easy and fun to play in a web
page, on the Apple ][+, with the original disk running unchanged. Play it at
[hyperties.org/cabinet/games/little-computer-people](https://hyperties.org/cabinet/games/little-computer-people/).

"Upcycling" is microM8's word. [April](../../characters/april-ayres-griffiths/README.md) and
[Melody Ayres-Griffiths](../../characters/melody-ayres-griffiths/README.md)'s
[microM8](https://paleotronic.com/software/microm8/) runs the Apple faithfully and then gives it
what it never had ([Upcycling with microM8](https://www.youtube.com/watch?v=DSnVe0xvkos),
KansasFest 2018). The cabinet's [manifesto](MANIFESTO.md#a-federation-of-emulators-after-microm8)
takes that attitude from them. Little Computer People is the first Apple program the cabinet
upcycles all the way: a fast emulator, a helper that watches the screen, buttons, a guide, and a
way to carry the little person out to other games.

## What the game asked of a player in 1985

The game is gentle once he lives in the house. Getting there, and looking after him, asked a lot:

- **Turn the floppy over.** It boots the Guestbook side, then says *Please turn over
  HOUSE-ON-A-DISK and press a key*.
- **Type at a bare prompt.** The guestbook asks for the *name of the researcher*, then the date
  as MM/DD/YY with the zeros, on a machine with only capital letters.
- **Wait.** He takes minutes to dare to come in, inspects every room, leaves for his things and
  comes back. The keyboard does nothing until he has moved in. At the Apple's own speed that is
  minutes of watching an empty house.
- **Remember the manual.** Food is Control-F, water Control-W, dog food Control-D, the alarm
  Control-A, the phone Control-C, a pat Control-P, a record Control-R and a book Control-B.
- **Guess what to say.** He answers typed requests, if they are polite and he is in the mood,
  but the game does not list them.
- **Keep the disk.** His life is written back to the House side as he lives it. The floppy is the
  save.

## What the page does instead

| In 1985 | On the page |
|---|---|
| Flip the disk and press a key | The screen angel sees the message, puts the House side in the drive and presses the key |
| Type the name at the prompt | A text field, said aloud: *Welcome, researcher, to Little Computer People. Please enter your name.* |
| Type the date with zeros | A field already filled in with today |
| Watch the empty house | The Apple runs at max until he is home, then goes back to 1× |
| Control keys from the manual | Buttons: Food, Water, Dog Food, Ring the Alarm, Ring the Phone, Pat Him, A Record, A Book |
| Guess a request | A field for typing to him, and requests to click: PLEASE PLAY THE PIANO, PLEASE DANCE, … |
| Keep the floppy | **Save disk** downloads the House side as it is now; **Insert file…** puts it back |

Every one of these is optional. Untick **Screen angel** and the keyboard goes to the Apple, every
move is shown as a button, and the game is the 1985 game. Untick **Speak** to keep it quiet.

The [game guide](guides/little-computer-people.md) sits beside the machine on the same page: how
to move him in and look after him, where the game came from, and how it led to The Sims.

## Why the emulator has to be fast

Nothing on the screen says he has finished moving in. In one run he settled between 307 and 367
seconds of Apple time after the house first appeared, so the screen angel waits 370. At 1× that
is more than six minutes of watching. microM8's WebAssembly build runs the Apple at about 2.5 to
2.9 times real speed, which still leaves more than two minutes
([BENCHMARKS.md](BENCHMARKS.md#apple-)). The Korz Apple, at max in Chrome, read 88 MHz while the
guestbook side loaded and 30 to 35 MHz in the house, about 30 times real speed, so the whole
move-in takes seconds. Under Node, 420 seconds of Apple time, from power on to home, take 11
seconds.

So the speed is part of the accessibility. A wait nobody will sit through is a wall.

## The pieces

Each piece is there because the goal needs it.

1. **The disks.** 4am's crack of the Research Project disk, Guestbook side and House side
   ([APPS.yml](disks/apple2/APPS.yml#L41), [the crack](https://archive.org/details/LittleComputerPeople4amCrack)).
   The game runs from them unchanged.
2. **A 6502 that is exactly right.** The switch CPU ([m6502.ts](src/m6502/m6502.ts)) passes the
   SingleStepTests `6502/v1` suite, every bus cycle included. A game that times its own disk reads
   and draws its own screens needs that.
3. **The Apple ][+ around it.** The motherboard, 48K and the `$C0` page ([plus.ts](src/korz/apple2/plus.ts)),
   the 16K language card ([lang.ts](src/korz/apple2/lang.ts)), the Disk II with its ROM in slot 6
   ([disk2.ts](src/korz/apple2/disk2.ts)), and the character generator ROM for text
   ([chargen.ts](src/korz/apple2/chargen.ts)). The guestbook side needs the language card.
4. **Korz, to make it fast.** Korz is
   [David Ungar](../../characters/david-ungar/README.md)'s language of slots, dispatched on
   coordinates, named for [Alfred Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski) and
   his "[a map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation)".
   Here it is the same 6502 at four rungs: a switch statement, an interpreter, a
   resolver, and a compiler that turns the machine's code into JavaScript that V8 compiles again
   ([compile65.ts](src/korz/compile65.ts), [KORZ-MACHINES.md](KORZ-MACHINES.md)). The page opens
   on the compiler. The idea of generating JavaScript the host's JIT likes is Vanessa
   Freudenberg's, from SqueakJS ([SEA-OF-SLOTS.md](SEA-OF-SLOTS.md#vanessas-bet)).
5. **A fast wait.** While he moves in, the page runs the CPU flat out and paints one picture per
   game second, which is all the screen angel needs ([pace.ts](src/korz/apple2/pace.ts),
   [A fast wait](src/korz/apple2/README.md#a-fast-wait)).
6. **A picture that is exactly right.** Hi-res color is a port of microM8's 14 MHz scan, with the
   half-dot shift ([hiresLine](src/korz/apple2/scan.ts#L209)). Text is the ][+ character ROM, each
   dot doubled, and the cursor stays in its own cell. The screen angel compares pixels exactly, so
   the painter it was cut from is the painter it watches.
7. **The screen angel.** Watches those pixels and keeps the game's state
   ([below](#the-screen-angel)).
8. **Moves as buttons.** The app's actions are data: a label and the keys it types, or a disk it
   inserts ([APPS.yml](disks/apple2/APPS.yml#L41)). The screen angel shows the ones that work at
   that moment.
9. **Speech.** The page says the screen angel's lines with the browser's speech, queued, and holds
   them until the first click or key, because browsers stay quiet until then
   ([ScreenAngel.svelte](../../apps/ties/src/lib/machines/ScreenAngel.svelte)).
10. **The guide beside the machine.** A markdown file in the repo, rendered on the page. Its links
    open in a new tab, so the game keeps running ([repo-docs.js](../../apps/ties/src/lib/repo-docs.js#L62)).
11. **Saving the house.** The Disk II keeps what the game writes, and **Save disk** downloads the
    image.
12. **Reading the disk as files.** DOS 3.3, ProDOS and Apple Pascal in TypeScript
    ([dos33.ts](src/apple2/dos33.ts), [APPLE2.md](APPLE2.md#disk-images)), the bottom of any
    bridge.
13. **microM8, as the oracle.** Still in the page's menu. When the Korz Apple and microM8 disagree,
    microM8 is the one to check against.

## The screen angel

The screen angel watches the machine's screen as pixels, the same 560 by 192 pixels the page
shows, and keeps the game's state from what it sees. The game exposes nothing else. Nobody has
decoded where Little Computer People keeps its state in the Apple's memory, and the screen is
what the game shows the player anyway.

It is data in [ANGEL.yml](angels/little-computer-people/ANGEL.yml) and code in
[angel.ts](src/angel/angel.ts).

**Looks** are PNGs cut from the screen, each with the place it sits. They form a tree: a look's
own looks are only tried while it is seen. A look matches exactly. Transparent pixels are not
compared, so the name prompt is seen with the blinking cursor on or off. Little Computer People
has ten:

| Look | What it is |
|---|---|
| `guestbook` | the HOUSE-ON-A-DISK logo on the book cover |
| `flip` | *Please turn over HOUSE-ON-A-DISK and press a key* |
| `name`, `name-empty` | the name prompt, and its line still empty |
| `date`, `date-empty` | the date prompt, and its line still empty |
| `signed`, `session`, `session-1` | the signed page, and *SESSION 1* on a first visit |
| `house` | the attic floor left of the stairs, where he never stands |

The house look is 240 by 16 pixels. Its top three rows are transparent, because his feet cross
them when he walks the attic. Over 900 seconds of play those were the only rows that changed.

**States** are tried in order on every look at the screen, and the first whose conditions hold is
the state:

| Key | Meaning |
|---|---|
| `when`, `unless` | looks that must be seen, or must not be |
| `from` | the states it may be entered from |
| `after` | seconds of Apple time in the current state before it may be entered |
| `say`, `speak` | what the page shows, and what it says aloud on entering |
| `ask` | a field on the page: its `label`, a `default` (`{MM}/{DD}/{YY}` is today), the `keys` it types (`{value}\r`), `upper` for an Apple with only capitals, a `reply` said on OK, `examples` to click, and `keep` to leave the field for the next one |
| `lock` | the Apple's keyboard is off, so typing goes to the field |
| `moves`, `auto` | the buttons that work now, and one the angel presses itself |
| `speed`, `frames` | the Apple's speed from here on, and pictures per game second while it runs fast |

Little Computer People's states, from the replay below:

| Apple time | State | What happens |
|---:|---|---|
| 0 s | `loading` | the Guestbook side boots, at max |
| 26.6 s | `flip` | the angel inserts the House side and presses a key |
| 31.4 s | `name` | the name field, said aloud |
| 31.6 s | `signing` | the name is being written |
| 32.0 s | `date` | the date field, with today in it |
| 32.6 s | `first-visit` | *SESSION 1*: *Hang on while someone moves in and gets settled.* |
| 39.6 s | `moving-in` | the house is on the screen; max, one picture a second |
| 409.6 s | `home` | 1×, the buttons, and the field for talking to him |

A disk he already lives in goes from `signed` and `session` to `return-visit`, and straight home.

**Checking the looks.** [lcp-angel.mjs](scripts/lcp-angel.mjs) plays the game headless on the
Korz Apple with the real screen angel and prints each state as it enters it. It paints the way
the page paints and saves a PNG at each change, which is what new looks are cut from with
[angel-cut.mjs](scripts/angel-cut.mjs):

```sh
npm run build
node scripts/lcp-angel.mjs /tmp/lcp-angel 420
node scripts/angel-cut.mjs /tmp/lcp-angel/t0026.6-flip.png 69 136 270 24 angels/little-computer-people/looks/flip.png
```

**Where it comes from.** Don called the idea aQuery in 2013, in an email to
[Peter Korn](../../characters/peter-korn/README.md): selectors and event handlers over other
programs' interfaces, the way jQuery works on the DOM. It is
[Screen Angel](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/README.md)
in MicropolisCore now. [Richard Potter](../../characters/richard-potter/README.md)'s Triggers (1991)
read a Mac's pixels to drive programs that offered no other way in, and
[Morgan Dixon](../../characters/morgan-dixon/README.md) and
[James Fogarty](../../characters/james-fogarty/README.md)'s Prefab recovered interfaces from
pixels alone. The cabinet's screen angel is a small one: an emulated machine, a few exact looks,
and a state machine in YAML.

## The manifesto's part

The cabinet's [manifesto](MANIFESTO.md#tribute-accessibility-and-fun-beat-realism) says tribute,
accessibility and fun beat realism, and that
[the emulator is an advocate](MANIFESTO.md#cartridges-and-one-description-of-everything) for both
the running program and the person using it. The emulator is ours, so it does the work. The game
is not patched. Nothing in its code was changed to add a field, a button or a voice. The page
reads the screen the game already draws, types the keys the game already takes, and inserts the
disk the game already asks for.

What stays honest is the game. Every instruction runs as it did on the Apple, the disk is the
disk, and with the screen angel off the player has the 1985 game, keyboard and all.

## Soul City: carrying him out

Little Computer People is one of the first bridges for
[Soul City](../../catalogs/soul-city/README.md), where a character from one game can move to
another and back ([soul bridges](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-BRIDGES.md)).
It is the oldest one: every copy made its own person, kept in 256 bytes the disk drive rewrote as
he lived.

- **Built, on the Commodore 64.** [lcp.ts](src/c64/lcp.ts) and
  [lcp-world.mjs](scripts/lcp-world.mjs) export the person on a C64 disk as a character directory
  and import him into any copy of the game. Three lived-in houses are in
  [worlds](worlds/little-computer-people/README.md): Rob, Ivan and Fritz.
- **Not built, on the Apple.** The same template is on track 8 of the Apple disks, and its layout
  is not decoded yet. The Apple disks here were never played. This page is how they get played.
- **Where he goes.** [Tiny Life](https://tinylifegame.com/), by
  [Ell](../../characters/ellpeck/README.md), a game in the spirit of The Sims with household
  export: [the Little Computer People show](../../repo-shows/little-computer-people/README.md) and
  the [Apple ][ floppy bridge design](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/apple-ii-floppy-bridge.md).

## The people

[Rich Gold](../../characters/rich-gold/README.md) had the idea, a Pet Person you would boot and
watch. [David Crane](../../characters/david-crane/README.md) made it at Activision and made the
person answer. [Will Wright](../../characters/will-wright/README.md) has said he played it, and Rich
Gold gave him feedback while he made The Sims. 4am preserved the disk. April and Melody
Ayres-Griffiths showed what an emulator owes the people using it.

↑ [README](README.md) · [APPLE2](APPLE2.md) · [guide](guides/little-computer-people.md) · [BENCHMARKS](BENCHMARKS.md) · [MANIFESTO](MANIFESTO.md)

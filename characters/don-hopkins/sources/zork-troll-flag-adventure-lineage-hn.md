# Zork, the troll flag, and the adventure lineage — Don's HN threads

Curated archive of Don Hopkins's public Hacker News comments on Zork's source code,
the TROLL-FLAG!-FLAG bug, Bob Supnik's FORTRAN Dungeon debugger, and the General Magic
org chart that places **Don Woods** at General Magic in 1994. Everything here is public
(HN, Wikipedia talk pages, GitHub).

| Field | Value |
|---|---|
| HN threads | [31846457](https://news.ycombinator.com/item?id=31846457) (2022) · [43944506](https://news.ycombinator.com/item?id=43944506) (2025) · [19672436](https://news.ycombinator.com/item?id=19672436) (2019) · [44540509](https://news.ycombinator.com/item?id=44540509) (2025, General Magic) |
| Wikipedia | [Talk:Zork/Archive 1 — "Link to the original Zork source code in MDL"](https://en.wikipedia.org/wiki/Talk:Zork/Archive_1) (as Xardox, 2013) |
| Sources | [MDL Zork on GitHub](https://github.com/itafroma/zork-mdl) · [retro.co.za mirror](https://retro.co.za/adventure/zork-mdl/) · [Supnik's blessed copy](http://simh.trailing-edge.com/games/zork-mdl.zip) · [zork-fortran](https://github.com/historicalsource/zork-fortran) |
| Feeds | [don-woods room](../../don-woods/) · [donald-knuth room](../../donald-knuth/) · [woods-and-adams pair seed](../../../repo-shows/woods-and-adams-adventurers.yml) |

## The TROLL-FLAG!-FLAG bug — a hypothesis confirmed decades later

Don's favorite object-containment bug, discovered playing the original Zork **on MIT-DM**
and still present in the Infocom version. The troll blocks the dungeon exits and eats
anything you give him:

```
>GIVE AXE TO TROLL

The troll, who is not overly proud, graciously accepts the gift
and not having the most discriminating tastes, gleefully eats it.

The troll, disarmed, cowers in terror, pleading for
his life in the guttural tongue of the trolls.
```

Killing him in cold blood would have been cruel, so:

```
>GIVE TROLL TO TROLL

The troll, who is not overly proud, graciously accepts the gift
and not having the most discriminating tastes, gleefully eats it.
```

POOF — no more troll. Works because GIVE accepts anything *transitively in the room*,
and the troll is in the room. But the exit still refused: *"The troll fends you off with
a menacing gesture"* — from an empty room. Don hypothesized an uncleared troll flag; when
the MDL source finally surfaced decades later, there it was — **`TROLL-FLAG!-FLAG`** —
set by the troll's death in combat but never cleared by self-devouring
([`act1.mud`](https://github.com/itafroma/zork-mdl)).

The scientific arc is the show hook: **hypothesis from black-box play (~1977) → source
confirmation (~2013)** — a decades-long `git blame`. Don wrote it up on the
[Wikipedia Zork talk page](https://en.wikipedia.org/wiki/Talk:Zork/Archive_1) (as Xardox)
and in the [2019 Infocom source-release thread](https://news.ycombinator.com/item?id=19672436).

Don's HN moral: *"I've actually been able to successfully apply this technique of giving
HN trolls their own weapons (quoting their own words back to them), then giving them to
themselves (pointing them back to their previous posts), to make them disappear from HN!"*

## Supnik's GDT — the in-game debugger (1978)

From the [2025 thread](https://news.ycombinator.com/item?id=43944506): Bob Supnik's
FORTRAN translation of Zork (DUNGEON, DECUS 1978) had **GDT** — "Game Debugging
Technique" — an in-game inspector:

```
A booming voice calls out, "Who summons the right hand of the translator?
State your name, cat, and serial number!"

SUPNIK,BARNEY,70524

At your service!

GDT>
```

("Barney" was Supnik's cat; 70524 his DEC badge number.) Alter/display rooms, objects,
villains, exits; "No troll" / "Restore troll"; immortality mode. Supnik: built *before
the game was finished* because 1978 debuggers "had no semantic understanding of the
program" — a world-model debugger for a world-model program.
Sources: [zork-fortran](https://github.com/historicalsource/zork-fortran) ·
[Gunkies on GDT](https://gunkies.org/wiki/Zork#The_GDT_command).
Bonus from the same thread: WalterBright on ADVENT's self-initializing executable
(write the initialized statics back over the binary — Gosling Emacs `unexec.c` energy),
a trick that died when OSes started calling self-modifying executables malware.

## The NPC menagerie — comparative zoology across the border

Adventure and Zork are neighboring realms in the same cave country, and their creature
populations are homologous species — parallel answers to the same design problems, one
from Stanford/BBN stock, one from MIT. Show material for the assembled adventure party:
ask the Dons how each species compares.

| Niche | Adventure (Crowther/Woods, 1976–77) | Zork (MIT, 1977–79) |
|---|---|---|
| **Troll** | Toll-taking economist: burly, guards the bridge, "insists you throw him a treasure" to cross. The bear scares him off — but the bridge buckles under the combined weight of you and the bear on the return trip. | Omnivorous fighter: blocks the passages, eats anything you give him — his own axe (disarmed, cowers), then himself (POOF). Leaves the uncleared `TROLL-FLAG!-FLAG` behind. |
| **Treasure stealer** | The pirate — *"Shiver me timbers, matey!"* — snatches your loot and stashes it with his chest in the maze. | The thief: the pirate refined into a gentleman with a stiletto, "a slippery character" with his own Treasure Room gallery. Only he is skilled enough to **open the jeweled egg** — giving your treasure to the villain *is the puzzle solution*, the same move as GIVE AXE TO TROLL. |
| **Helpful bird** | The little bird: drives off the snake, but is terrified of the black rod (drop it first). | The clockwork canary inside the egg: wind it in the forest and the songbird drops a brass bauble. |
| **Death in the dark** | *"You fell into a pit and broke every bone in your body!"* — the dark just kills you. | The **grue** — Dave Lebling's invention (word borrowed from Jack Vance) to explain *why* the dark kills you. A monster engineered backward from a game mechanic. |
| **Hostile natives** | Axe-throwing dwarves (throw the axe back). | The cyclops — flees through the wall at the word **ODYSSEUS**, leaving a cyclops-shaped hole. |
| **Automaton** | — | The robot. See below. |

### The robot — actor, not vehicle (source-verified)

From [`dung.mud`](https://github.com/itafroma/zork-mdl): the robot's flags are
`OVISON + VICBIT + SACREDBIT + ACTORBIT` — **no `VEHBIT`**. You could never ride it.
The actual `VEHBIT` vehicles in mainframe Zork are the **barrel, balloon basket,
inflatable boat, and bucket**. What the robot actually is: your **remote avatar**.
It obeys `WALK TAKE DROP PUT JUMP PUSH THROW TURN` (`ROBOT-ACTIONS`), and it acts
where you can't survive acting — it pushes the high-voltage carousel buttons that
electrocute you, and lifts the steel gas-trap cage off you in the Dingy Closet.
Everything else gets *"I am only a stupid robot and cannot perform that command."*

Source gems: its parser synonyms are **`R2D2`, `C3PO`, `ROBBY`** — the 1977 parser
answered to all three famous droids. Its instruction paper reads *"FROBOZZ MAGIC ROBOT
COMPANY... I am a late-model robot, trained at MIT Tech to perform various simple
tasks."* And its death messages are literature: crushed under the cage it
"short-circuits in his vain attempt to escape"; killed otherwise, it's "injured
(being of shoddy construction)."

The remembered do-cool-stuff-with-the-robot-you-normally-couldn't experiences are
**GDT**: it could move *any object — including the player — to any room*. Teleport
yourself into the robot-only death rooms; march the robot anywhere in the dungeon;
"No troll / Restore troll"; immortality mode. GDT was the original noclip, and the
robot was the perfect toy for it: an obedient second body in a world where your
first one keeps dying.

## The General Magic org chart — Don Woods, again (July 2025)

From [Bill Atkinson's psychedelic UI thread](https://news.ycombinator.com/item?id=44540509),
Don found the [1994 General Magic org chart](http://www.datarover.com/SEKRIT/) while
googling for Josh Siegel:

- **Don Woods worked in Communicating Applications at General Magic** — a previously
  unrecorded stop in his career arc (Sun → General Magic → Postini → Google).
- Public retelling of the **colossal motd**: workstation named "colossal",
  `/etc/motd` = *"Welcome to Adventure!! Would you like instructions?"* — "to the peril
  of anyone who typed 'yes' to the csh prompt."
- Public retelling of **Spider's provenance**: written in PostScript for NeWS "after
  having previously implemented it at SAIL (Stanford AI Lab) and for XDE (at Xerox PARC)."
- **Josh Siegel**: rewrote the NeWS PostScript interpreter from Gosling's original design;
  worked with Don on an [X11 window manager written in PostScript](https://donhopkins.com/home/archive/NeWS/owm.ps.txt);
  at Los Alamos wrote "MMPORG simulations of World War III for the Joint Chiefs of Staff
  with a beautiful interactive NeWS front-end. (Sun was lucky to steal him away from LANL
  to work on NeWS instead of WWIII.)" At General Magic: Magic Cap Core Technology with
  Bill Atkinson and Andy Hertzfeld (both "on loan"). The stealing-away has a receipt:
  [Don's 11 Apr 1990 email](1990-04-11-siegel-sun-interview-mousee-art.md) — Gosling set
  up Siegel's Sun interview; "tell him about the peaceful things he could be doing at Sun!!"
- Don's through-line: NeWS PostScript → **Telescript** "was obviously the right
  approach. Today the same approach is called 'AJAX'."

## Show hooks

1. **Troll bug as the founding QA story** — black-box hypothesis to source-code
   confirmation across four decades; read the MDL aloud in the Woods/Adams/Knuth
   adventure-lineage shows. The MDL is "practically a form of literature" (Don, 2013) —
   which is literally Knuth's advent.w thesis.
2. **GDT as MOOLLM's ancestor** — an in-game, semantically aware world inspector, 1978.
   The "right hand of the translator" is a coherence engine with a cat password.
2.5. **The NPC menagerie** — comparative troll zoology and the bestiary table above;
   the encore beat when the adventure party crosses the border into Zork. Ask Woods
   about his toll-troll and pirate; ask all three Dons about the robot and GDT.
2.6. **NPC passports and the construction-set lineage** — the menagerie begs the design
   question: how do NPCs and whole games travel between worlds and plug together like
   Sims objects in one house? MOOLLM's soul-city answers with a running demo (a 1973
   wumpus, a 1980 grue, and plugin superbats/pits interoperating in one maze — with an
   ACME vending machine descended from the battery vendor Woods put in HIS maze) and a
   protocol writeup: advertisements as the socket, prototype/instance splits, ambient
   vs. instanced monsters, interop treaties, and customs for the troll's
   economy-upsetting treasure luggage. Lineage to put to the guests: Budge's Pinball
   Construction Set → Stuart Smith's Adventure Construction Set (EA 1984 — creatures as
   portable data records) → Wright's Bungeling Bay editor → SimCity → Sims objects.
   Design doc: MOOLLM `skills/soul-city/PORTABLE-NPCS.md`.
3. **Woods at General Magic** — the career arc now runs SAIL → Xerox → Sun → General
   Magic → Postini → Google; Adventure's co-author kept landing at the industry's
   most storied communicating-applications shops.
4. **Give the troll to the troll** — Don's HN moderation technique, already proven
   in production.

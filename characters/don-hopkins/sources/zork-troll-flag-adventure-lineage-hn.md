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
  Bill Atkinson and Andy Hertzfeld (both "on loan").
- Don's through-line: NeWS PostScript → **Telescript** "was obviously the right
  approach. Today the same approach is called 'AJAX'."

## Show hooks

1. **Troll bug as the founding QA story** — black-box hypothesis to source-code
   confirmation across four decades; read the MDL aloud in the Woods/Adams/Knuth
   adventure-lineage shows. The MDL is "practically a form of literature" (Don, 2013) —
   which is literally Knuth's advent.w thesis.
2. **GDT as MOOLLM's ancestor** — an in-game, semantically aware world inspector, 1978.
   The "right hand of the translator" is a coherence engine with a cat password.
3. **Woods at General Magic** — the career arc now runs SAIL → Xerox → Sun → General
   Magic → Postini → Google; Adventure's co-author kept landing at the industry's
   most storied communicating-applications shops.
4. **Give the troll to the troll** — Don's HN moderation technique, already proven
   in production.

# Pie Menus, Edith, and SimAntics visual programming demo

*YouTube: https://www.youtube.com/watch?v=-exdu4ETscs*  
*Title (yt-dlp): "The Sims, Pie Menus, Edith Editing, and SimAntics Visual Programming Demo"*

## Why this video matters

Rare on-camera walkthrough of **Edith** — the SimAntics bytecode editor — plus **pie menus** in The Sims context. Bridges:

- Will's Motive.c / behavior tree origins ([Soul of The Sims](../2008-02-10-soul-of-the-sims/README.md))  
- Jamie Doornbos SimAntics implementation  
- Don's pie menu HCI work (CHI'88 → Sims UI)

## What the demo shows

Don's description (2015): "a demonstration of the pie menus, architectural editing tools, and
Edith visual programming tools that I developed for The Sims with Will Wright at Maxis and
Electronic Arts." Recorded on a debug build with Edith running inside the game.

**Pie menus on people and objects (0:00–3:27).** Clicking an object or a person pops up a pie menu
of what you can do with it. The items change with the situation: after two Sims greet, the menu on
the stranger offers ask to leave and compliment; a friend's menu is fuller; a kiss turns them into
lovers. "Call over" appears only when the other person is in a different room, and "ask to leave"
only for guests.

**Slowing a walking Sim under the cursor (2:51).** Pointing at a walking Sim slows them down, "kind
of like the tilt of a pinball machine," so they stay under the cursor long enough to pop up a menu
on them.

**Architecture and object placement (3:34–7:50).** The player's tools pick objects up, move them,
throw them away, buy more, and place walls, windows and wallpaper. Walls refuse invalid places.
The grid is deliberately chunky, "Lego-like," so things click into place, which "makes it much
easier for kids to use than a full freedom 3D graphics editor would be."

- **Orienting while placing.** Press the button down while placing an object and drag in the
  direction it should face, "a pie menu like gesture." Chairs go around a table in one quick motion
  each, and the next object keeps the last orientation.
- **Sticky and slippery.** Between valid positions an object slides; at a valid position it clicks
  in; an invalid placement turns red. "You can kind of tell just by moving that you're not in a
  valid location," which helps people with low dexterity.

**Objects carry their own behavior (7:50–11:22).** New objects can be downloaded and plugged in at
runtime. Transmogrifier clones objects and exports their sprites as bitmaps to repaint; skins are
2D images mapped on 3D skeletal meshes. People know how to walk; objects know how to make people
use them, and bring their own animations and SimAntics code. Pie menu items are generated from the
objects' advertisements, filtered by mood, personality and relationship.

**Edith and SimAntics (11:22–29:39).** Edith (named for Edith Bunker) is the developers' editor:
class browser, tree tables of advertisements (menu name, attenuation, autonomy threshold, joinable,
visitor/child/adult flags, motive scores, including false advertising), and the SimAntics
decision-tree editor, where operands are set by filling out dialogs rather than typing. Examples:
the "come and see" object, the guinea pig cold that spreads between households, the food chain from
fridge to food processor to microwave to table, chairs with approach animations from four sides, and
the NPC Satan generator, which counts how long everyone in the family has been in a bad mood and
schedules a visit.

**Process (29:46–end).** The tools made overnight turnaround from design session to testers
possible, with a debugger that traps into the stack. A summer intern wrote the maid, the first NPC
that did much. SimShow shipped before the game so people could paint skins early.

## Show hooks

- [Steering committee playthrough](../../../../repo-shows/will-wright-premiere/sims-team-steering-committee-playthrough/SHOW.yml) — compare 1998 build to this demo  
- [Building the Sims reunion](../../../../repo-shows/REPO-SHOWS.yml) — Jamie + Eric Bowman segment  
- [`pie-menus-retrospective`](../../../../repo-shows/REPO-SHOWS.yml#pie-menus-retrospective.yml) if planted

## Related

- [multiplayer simcity ui network · article](../multiplayer-simcity-ui-network/article.md) — pie menus for cooperative edit speed  
- Hidden Palace steering committee proto — link only

*Index: [INDEX](../don-youtube-playlist-index/INDEX.yml)*

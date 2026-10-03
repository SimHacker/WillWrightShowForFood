# Ideas to explore with Scott Jenson 🍺

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Scott's
public work. Things Don would love to follow **with** Scott; not quotes, not claims about
what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest

## What Scott has done

Scott Jenson was the first member of Apple's Human Interface group (System 7, Newton, the
HIG), then led UX at Symbian, was creative director at frog design, and worked at Google
twice, the second time on the **Physical Web** and Android until 2024. He wrote
**[The Simplicity Shift](https://jenson.org/The-Simplicity-Shift.pdf)**, spent eight weeks
applying Raph Koster's *A Theory of Fun* to UX ([games](https://jenson.org/games/)), and
now does UX for Mastodon and Home Assistant. His
[Ubuntu Summit 25.10](https://www.youtube.com/watch?v=1fZTOjd_bOQ) and
[KDE 2026](https://www.youtube.com/watch?v=V7AfAcQwLW0) talks ask the free desktop to
stop copying, because "there isn't anything left to copy" (Ubuntu [7:49]), and to run small
open experiments the way Ink & Switch does. Timestamps below are from the
[transcripts](sources/README.md).

## Shared ground

- **Same era, other side.** Don was building pie menus and NeWS window managers while
  Scott was writing the guidelines everyone copied. Scott's "historical cruft" (KDE
  [15:23]) is partly their generation's cruft.
- **Pie menus.** Scott's Android text-editing gesture keyboard is "a little bit like pi
  menus if you're familiar with that" (Ubuntu [26:51]), and his toy window manager moves
  windows by click-and-drag direction (Ubuntu [29:01]). Don designed and tested pie menus
  with Ben Shneiderman's lab in 1988; [Simon Schneegans](../simon-schneegans/) ships them
  today as Kando, laid over any app.
- **Learning loops and The Sims.** Scott's learning loops (intent → action → result →
  feedback) come from game design. The Sims' pie menu plus action queue is a game UI that
  shows the loop: you see what the Sim will do, in order, and can cancel any of it.
- **Remember your past.** Scott takes Alan Kay's present / past / questions (KDE [18:41])
  and refuses to treat Lifestreams, WinFS and Nepomuk as proof the ideas were wrong (KDE
  [26:11]–[27:16]). The house has [Alan Kay](../alan-kay/), [Ben Shneiderman](../ben-shneiderman/),
  [Brad Myers](../brad-myers/), [Henry Lieberman](../henry-lieberman/), [Ted Selker](../ted-selker/),
  [Ken Perlin](../ken-perlin/), [Bret Victor](../bret-victor/) (Dynamicland, Ubuntu [33:24])
  and [David Rosenthal](../david-rosenthal/).

## 1. 1985 already said tiling vs overlapping is a choice

The Alvey *Methodology of Window Management* workshop (§17.2): "tiled and overlapped
windows were seen to be merely options that the user interface designer could use if
appropriate." Scott's KDE answer to why windows overlap at all is that the Mac was
"a whopping 342 pixels high" (KDE [17:36]), and on giant screens "you just get tired"
(KDE [18:10]). Questions for Scott: what did the 1985 group get right that we lost, and
which of its open issues (subwindows, grouping, title lines as subwindows) look like his
box model? See [Don's book page](../don-hopkins/books/methodology-of-window-management.md),
thread 4.

## 2. ST words: stuff, stanza, enfilade, storey

Scott's four layers are style, structure, strategy and **stuff** ("cuz I just liked ST
words", KDE [14:50]). Don's riffs, not Scott's:

- **Stanza**: Italian for "room". A hall is a room whose job is to connect rooms.
- **Enfilade**: Xanadu's name for its tree structures, borrowed from architecture: rooms
  whose doors line up on one axis, so the aligned doors make a hallway without a hall.
- **Storey / story**: each floor is a storey and each one can be a story. Storytelling,
  storypiling, storystacking. Elevators are vertical halls; their lobbies are named entry
  points with a directory board; stairwells are the back ways and keyboard shortcuts; a
  multi-storey suite has an atrium you can look down through. It's spatial memory with a
  third axis. Details in [CHARACTER.yml](CHARACTER.yml) under `transformation_field.storeys`.

## 3. The clipboard is a building block, and it's invisible

Scott lists windows, files and icons, and the clipboard as the desktop's building blocks
(KDE [24:03]) and calls direct manipulation's weakness that it's "completely stateless"
(KDE [24:34]). His fixes are a visual clipboard that crosses window-manager, clipboard and
file-manager boundaries (Ubuntu [29:33]) and a clipboard file attached to each document
(KDE [32:40]).

Ted Nelson has railed against the invisible clipboard for decades
([rant catalog](../ted-nelson/sources/invisible-clipboard-rant-catalog.md)). David
Rosenthal wrote the X11 selection rules in the ICCCM. The
**[Unnatural Selection panel](../../repo-shows/unnatural-selection/README.md)** puts Ted,
David and Don together on it, and
[selection-clipboard-lineage.md](../david-rosenthal/selection-clipboard-lineage.md) traces
the history: Ted's rant, DSHR's ICCCM, Don's NeWS trenches, and the 1985 Alvey arguments
over what "selection" even means. Scott would be a natural fourth chair.

Don's proposals, to try on Scott:

- **The git-ref clipboard.** Copy mints a URL pointer into a file in a snapshot of a git
  ref; paste transcludes or forks it. Nothing is overwritten, every version is inspectable,
  and the statelessness goes away.
- **Clips are cursors.** A clip is a movable selection, not a frozen copy, expandable by
  character, line or expression. Programming by demonstration becomes a two-step worm:
  *digest* (do the thing once by hand) and *advance* (select the next object, or fail and
  stop).
- **A visible command bus.** Every direct-manipulation gesture is published as a command
  both you and an LLM can read: undo for free, macros for free, and the shared context
  Scott wants ("gathering focus information and not text", KDE [39:26]) made inspectable
  instead of hidden.

## 4. Clippy, Bob, Nass, and the I-beam

Scott uses Clippy as the failure copying protects you from (Ubuntu [4:30], KDE [5:31]),
and argues WinFS and Nepomuk failed because "the hardware and the systems at the time let
the vision down", not because the ideas were wrong (KDE [27:16]). Don's hot take: the same
argument rescues Bob (rooms as a desktop) and Clippy (an assistant that watches and
offers; Scott's "ultimate right click" with a 1997 rule table).

- **Clifford Nass** and Byron Reeves (*The Media Equation*) found people already treat
  computers socially. Alan Cooper called Clippy "a really tragic misunderstanding" of that
  research: it never said to give the machine a face. Don saw Nass speak at Ted Selker's
  NPUC workshop at IBM Almaden in 1996.
- **An interface to agency, not agents instead of an interface.** Give the assistant's
  capabilities to the user as visible, operable verbs, so you can watch it use them
  ([INTERFACE-TO-AGENCY](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md)).
- **"The I-beam is the anti-Clippy."** The text cursor is the desktop's most successful
  assistant and has no face: it shows where the next thing will happen and says nothing.
  Allen Cypher's Eager turned its prediction green on the real menu item.

Will Wright on Bob: "there was some great thought and research that went into it, but the
execution was flawed" ([source](../will-wright/sources/2004-01-10-barbie-mortalkombat-jenkins/article.md)).

## 5. Spatial memory: the transformation field

Scott's three prototypes are spatial (a messy stash in the periphery), associative (a
document's own clips and files) and episodic (attention traces, "simple math", KDE
[34:48]). Don's proposals for the spatial one, all in [CHARACTER.yml](CHARACTER.yml)
under `transformation_field`:

- **Scale is a field you paint.** Weight is scale, so unused windows sink in place
  instead of being closed or shuffled by Exposé's "Cartesian sort" (KDE [29:25]).
- **Pins, rigs and rails** to hang windows on, with live crops and **live views**:
  transcluded regions of other windows, kept in place with a link back to the source.
- **Photographs**, after Tashman's [WindowScape](sources/2006-tashman-windowscape.pdf):
  snapshots of a whole arrangement you can scrub through. That's episodic memory without
  logging everything.
- **Box model and customs**: windows inside windows, with a membrane that decides what
  crosses.

Prior art Scott might enjoy: Hutchings & Stasko 2004 on display-space management
([sources](sources/README.md)), Xerox Rooms, Pad++ and WinCuts.

## 6. AI under the UX

Scott: people "keep saying this is an AI OS and that is so irritating" (KDE [20:16]);
small, local, ethically trained models, and "boring is actually good" (Ubuntu [32:19]); the
ultimate right click predicts from history and the clipboard (Ubuntu [40:27]). Don's MOOLLM
work is a test bed for that: the model reads and writes the same files and bus as the
user, in git.

## 7. Try something

"All I want us to do is to try" (Ubuntu [43:09]). Scott's funding model is Ink & Switch's:
one to three people, a few months, open source (Ubuntu [41:01]–[41:32]); he worked with
them on Upwelling. A Repo Show could be the place to scope one of his three projects (KDE
Connect 2.0, the super windowing system, the ultimate right click), with the repo as the
lab notebook.

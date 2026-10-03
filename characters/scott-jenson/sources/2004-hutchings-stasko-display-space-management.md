# Hutchings & Stasko 2004: Revisiting Display Space Management

Notes for the Scott Jenson room. They are not the paper's text.

- **Citation:** Dugald Ralph Hutchings and John Stasko, "Revisiting Display Space Management: Understanding Current Practice to Inform Next-generation Design", *Graphics Interface 2004*, Canadian Human-Computer Communications Society. ACM DL: https://doi.org/10.1145/1006058.1006074
- **Method:** structured interviews with 20 people at their own desks, 30–60 minutes each, covering 22 window systems. The systems were CDE, Enlightenment, KDE, Mac OS 9 and X, and Windows 2000 and XP. The interviews included screenshots and photos of each workspace.

## Why it belongs in Scott's room

Scott's KDE talk counts 37 window managers and asks what the desktop's job is: working memory (KDE [25:06]).
This paper is one of the few studies that watched what people actually do with windows. Twenty years
ago it reached the same diagnosis: windows serve as memory, reminders and glanceable information, and
the window manager gives people almost no tools for any of that.

## Findings, mapped

| Paper finding | Scott | Don's riffs in this room |
|---|---|---|
| **Three styles:** maximizers (5), near maximizers (5), careful coordinators (10). The authors predict maximizers "may grow extinct" as displays grow. | "Design for big monitors": the original Mac fits within an iPad Mini (KDE [27:48]) | Weight-per-window: size comes from attention, not from a maximize button |
| **§6.1 Invisibility matters as much as visibility.** 13 of 20 people hide most of a secondary window to cut distraction. 6 hide windows for privacy. Resizing is undesirable because the layout reflows. | Spatial stash, peripheral mess (KDE [29:25]) | Holes in the scale field: shrink a region without reflowing it |
| **§6.2 Strict tiling is rarely used.** Leaving a sliver of a window showing keeps it in reach. People push an IM client's button bank off-screen to show only the buddy list. | "Ignore my pixels" (Ubuntu [30:06]) | Pins and transformation fields, not tiling, springs and struts |
| **§6.3 "Empty space" is often not empty.** Icon banks are quick launches, status monitors, temporaries and reminders. Users avoid maximize and show-desktop to keep them visible. | Files are dope; the desktop as a temporary work area; "Put away" (jenson.org/files) | Pocketable scrapbooks pinned into the field, not lost under windows |
| **§6.4 Windows act as reminders.** Interruptions happened in every interview but one. "[at least six things in the dock] as reminders to come back to a task"; the dock "is not in my face enough". | Episodic memory, attention traces (KDE [36:29]) | Decay to a tab label in place; the K-pyramid saved view |
| **§6.5 Input devices shape layout.** A touchpad turned the second monitor read-only; a cramped mouse tray left one system for email only. | Learning loops; the expression problem (jenson.org/games) | Pie menus on tabs and frames: short strokes, no long travel |
| **§7.1 Rethinking iconify and resize.** Draw a rectangle around the relevant region, hide the rest, "and treat the region as a window unto itself". | Crossed boundaries (Ubuntu [29:33]) | Clips are cursors; regions pulled out of scrapbooks into their own pinned windows |
| **§7.2** "Given enough space, people will tile all windows" is doubtful. People manage space within each monitor. | Super windowing system (Ubuntu [38:50]) | One field across monitors, with pins that respect the bezels |

## Design proposals in the paper worth stealing

- **"An operation that shows or hides a user-specified region of a window"** for information or privacy, owned by the window manager because "an application designer will likely not know a priori what information will be displayed and valued by the user". That is the PbD and user-constraint argument: the user rigs the layout, not the app.
- **"Dynamic transparency or other subtle methods of obfuscation for privacy."**
- **SCWM constraints:** "constrain a secondary window with sensitive information to always be occluded … by the primary window". These are user-authored constraints between instances, as in Declare, Garnet and OpenLaszlo, and from template warehouses.
- **A "super window"** that holds reminder windows and cycles through them with change-blind animation. Compare scrapbooks, card decks that splay and deal, and book-spine fasteners.
- **"Non-empty space":** icon regions that maximize won't cover but a manual resize can.
- **Warning for AI window managers:** CIWM closed windows it judged unimportant from input focus. "Closing a reminding window could have a detrimental effect." Weight should decay to something glanceable, never to deleted, and every agent action should go on the visible, undoable command bus.

## Related systems the paper surveys

Rooms (Henderson & Card 1986), Card/Pavel/Farrell's window working set (1984), and Bly & Rosenberg's comparison of tiled and overlapping windows. Also Elastic Windows (Kandogan & Shneiderman), SCWM (Badros et al.), and Peeling and Rotating Windows (Beaudouin-Lafon). Also Non-overlapping Dragging (Bell & Feiner), QuickSpace (Hutchings & Stasko), CIWM, the Task Gallery (Robertson et al.), Exposé, and Myers's 1988 window manager taxonomy (see ../../brad-myers/).

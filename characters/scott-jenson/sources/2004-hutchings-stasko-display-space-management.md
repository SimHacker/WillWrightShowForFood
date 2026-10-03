# Hutchings & Stasko 2004: Revisiting Display Space Management

Notes for the Scott Jenson room. They are not the paper's text.

- **Citation:** Dugald Ralph Hutchings and John Stasko, "Revisiting Display Space Management: Understanding Current Practice to Inform Next-generation Design", *Graphics Interface 2004*, Canadian Human-Computer Communications Society. ACM DL: https://doi.org/10.1145/1006058.1006074
- **Cached PDF:** [2004-hutchings-stasko-display-space-management.pdf](2004-hutchings-stasko-display-space-management.pdf), from the [Wayback Machine copy](https://web.archive.org/web/20230530233017/https://facstaff.elon.edu/dhutchings/papers/hutchings2004revisiting.pdf) of the author's page.
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
- **Don's answer: a live, editable crop in the window manager, like Photoshop's crop tool.** Drag any number of edges at once (none, some or all) and the crop stays live and re-editable. Cropping is not resizing: the app keeps its full layout, nothing reflows, and you hide what you don't need. That fixes the §6.1 complaint that resizing reflows. A crop is just four optional edge pins on the window's own field (see CHARACTER.yml `transformation_field`), so you can save it, give it a name, and pull it out as a region-window.
- **"Dynamic transparency or other subtle methods of obfuscation for privacy."**
- **SCWM constraints:** "constrain a secondary window with sensitive information to always be occluded … by the primary window". These are user-authored constraints between instances, as in Declare, Garnet and OpenLaszlo, and from template warehouses.
- **A "super window"** that holds reminder windows and cycles through them with change-blind animation. Compare scrapbooks, card decks that splay and deal, and book-spine fasteners.
- **"Non-empty space":** icon regions that maximize won't cover but a manual resize can.
- **§6.3 non-empty space, quoted:** "Future systems might explore how to designate a group of icons as 'non-empty space,' where, for example, maximize does not cover the space, but manual resizing of windows allows the icons to be covered. Alternatively, the notion of desktop icons could be replaced by something that more tightly integrates with the window system." This room takes the second option: icons hang on rigs that windows snap around, and maximize grows until it meets a rig. See CHARACTER.yml `transformation_field.non_empty_space`.
- **§6.4 reminders, quoted:** "Frequently interrupted users all mentioned a desire to have a visually salient area of the screen to drop windows that should be returned to later"; the dock "is not in my face enough sometimes." The design implication: "dedicate a special area for users to drop such windows, or create a 'super window' that contains all of the reminder windows and uses change-blind animations to cycle through them. Windows marked as reminders by users could also be graphically altered to gain more prominence." For evaluation: more memory and CPU let people keep windows open, "moving the burden of remembering to complete tasks from the brain to the eyes." The admins in the study used email filters to surface "important people" and "important subjects".
- **The answer from Don's riffs:** the reminder area is one of the many holes, a region whose policy is *salience*, not shrinkage. Drop a window there and the place does the marking: it stays big enough to read, gets a glow or a border spike, and its weight doesn't decay. The super window is the same region with a cycle policy, a card deck that deals one reminder at a time. The admins' email filters are a filter policy on an inbox rail, and a rule can route a message straight into the reminder hole. Each item keeps a journey back to the room and task it came from, so returning to it restores context, not just a window. See CHARACTER.yml `transformation_field.painted_scale.reminder_hole`.
- **Warning for AI window managers:** CIWM closed windows it judged unimportant from input focus. "Closing a reminding window could have a detrimental effect." Weight should decay to something glanceable, never to deleted, and every agent action should go on the visible, undoable command bus.

## Related systems the paper surveys

Rooms (Henderson & Card 1986), Card/Pavel/Farrell's window working set (1984), and Bly & Rosenberg's comparison of tiled and overlapping windows. Also Elastic Windows (Kandogan & Shneiderman), SCWM (Badros et al.), and Peeling and Rotating Windows (Beaudouin-Lafon). Also Non-overlapping Dragging (Bell & Feiner), QuickSpace (Hutchings & Stasko), CIWM, the Task Gallery (Robertson et al.), Exposé, and Myers's 1988 window manager taxonomy (see ../../brad-myers/).

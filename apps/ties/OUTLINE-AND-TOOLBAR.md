# The outline and the toolbar — how a machine page is laid out

A machine page (the Apple ][+ now; the PDP-7, the PDP-10 and Micropolis later, each just
another CPU behind the same interface) is organized by one simple idea:

1. **A deep, rich, well-organized outline of everything.** Every control and every view of the
   machine has a home in it, under a heading that says what it is, with a summary that reads
   the same open or closed. Nothing is hidden for good; the outline is where things are found.
2. **People harvest what they want from it.** Any control (a button, a slider, a menu) or
   panel (a group of controls, a view) with a 📌 by it can be put in the toolbar under the
   screen. ⏏️ takes it out again. The toolbar shows a copy; the original stays home.
3. **They organize the harvest for a task.** Controls line up on the toolbar's row, panels in
   a column under it, in the order they were put in, and dragged into another order after.
4. **Then they share views, and move between them.** (To come; see below.)

The grain is the person's choice: the whole dance, or just its play button; all of the CPU,
or just the 15 bytes at $C041 that twist the music.

The lineage is HyperLook's warehouses: you leave the original where it is, take a copy, and
use it at home, as your own instance, customized. HyperLook's warehouses were stacks of
ready-made widget sets (window management controls among them). Here the warehouse is the
machine's whole outline, as deep as the machine is, so much more can be taken from it. The
window manager comes out of it too rather than being built beside it: containers to wrap
around panels and compose them, with edges, corners, title bars, tabs and controls, each
itself something to take from the warehouse.

The Korz CPU model and memory are the aisle where debugging things are made: go there to set
a breakpoint on an address or a slot, a watch on a byte, a word or a named variable, or a
view of a stretch of memory, and to monitor them. Each one made becomes something to take: a
breakpoint a toggle for the toolbar's row, a watch or a view a live panel under it. So a
person working on one routine keeps its breakpoints, the bytes it changes and its code next
to the screen, and leaves the rest of the machine in the outline. (Breakpoints and watches
are to come on the page; KORZ-CPU.md has the CPU device declining when one covers its bytes.)

## Page order

Above the fold, for a new player: the › button, the title, the short description, the
screen, the toolbar, then the outline, starting with the screen angel and the game's Play
node, open. What is under the lid (CPU, Memory, I/O, Korz) starts closed. Tags are not shown
on a page that runs a machine; they are in the catalog's lists.

The screen's width is capped so its height leaves the toolbar in the window
(`--screen` in `MicroM8.svelte`), and the toolbar is as wide as the screen, so the speed at
its right end sits under the screen's corner.

## The outline (`Outline.svelte`)

- A node is a heading row and its content. The row: a grip ⠿ (drag onto another row to move
  this one there; Alt+Up and Alt+Down on the title do the same), the twisty button with the
  title, the 📌 if the node's content is offered as a panel (`pin`), `actions` (buttons that
  work closed, like the dance's play), and the `summary`.
- The whole row opens and closes the node for a pointer, a target as wide as the page; the
  keyboard has the twisty button.
- Open and the content's height are kept per node id in this browser (`outline:<id>`). A
  resize bar (12px to grab, 4px to see) changes the height; a double click fits it again.
- The top level's order is the person's (`apple-outline-order`); `opened` is how a node starts
  the first time.

## The toolbar (`toolbar.svelte.js`, `MachineToolbar.svelte`, `Pinnable.svelte`)

- The component that owns a control or panel **offers** it: `bar.offer(id, label, snippet,
  kind)`, in an `$effect`, so it is withdrawn when the owner goes. The snippet takes one
  argument, `true` for the toolbar's compact look (an icon whose tooltip says what it does)
  and `false` for its home. `kind` is `'control'` (the row) or `'panel'` (the column).
- Its home places it: `<Pinnable {bar} id=… />` for a control, `pin={{ bar, id }}` on an
  `Outline` for a panel. The home has the 📌 or ⏏️, in the tab order.
- State per machine in this browser (`toolbar-<machine>`): for each id, a bit (in the toolbar
  or not) and an index (its place). Putting one in gives it the place after the last.
  Dragging deals the places of its kind out again in the new order, so the other kind's
  order is untouched. Until the person changes anything, the machine's defaults (the Apple:
  reboot, Ctrl-Reset, pause, step, speed, mute, Caps Lock, joystick).
- In the toolbar each item has ⏏️ over ⠿ in a narrow column, small and shown on hover (always
  where there is no hover), keeping its room so the row never shifts. On the row they skip
  the tab order; panels' handles are in it, and the arrow keys on a ⠿ move it.
- **Back to the warehouse.** A click on an item's ⠿, or a ⌘-click (Ctrl-click off a Mac) on
  the item itself, goes to its original in the outline: the nodes it is under open (each
  offer names them, `home`), the original scrolls to the middle of the window, flashes, and
  takes the focus. The modifier press is caught before the control sees it, so a slider
  does not slide and Step does not step. As an editor's ⌘-click goes to a definition.
- The speed at the right end is not an item: it is always there. It is a button, so a tap
  opens its numbers as a card where there is no hover, and not a live region, as it changes
  every second.

## Prototypes in the warehouse, instances at home

The originals in the outline are prototypes, and what is taken from them are instances that
inherit from them, as Self's objects delegate to their parents. A prototype keeps its own
settings, the defaults of every instance: a slider's range and width, which of the panel's
15 bytes a bit view shows, a watch's format, a map view's overlay. An instance overrides only
what it says it does, and everything else follows the prototype. So a default is changed once,
in the warehouse, for every instance that has not overridden it, and the toolbar keeps only
what is used, with none of the administration that is rarely needed.

Working down the outline is how the settings are found: drill into a prototype to tweak it,
and on the way discover more there to push up into the toolbar. The outline is the place for
depth, the toolbar for reach.

Today an instance is the prototype itself, shown compact: the same snippet over the same
machine state, with no settings of its own yet. The next step is the instance ids under "To
come": each instance a record of its overrides, read through to its prototype's settings.

## Why not a scrolling outline under a fixed screen

Asked: put the outline in its own scrolling box under the screen and toolbar, so Korz can be
scrolled up under the toolbar without changing the order. Not done, because:

- On a phone, or any short window, the screen takes most of the height, and the box left for
  the outline is a slot a few lines high.
- Nested scrolling traps the wheel and the finger: the page, the outline's box, and inside it
  Memory and Korz with their own scrolling panes, three deep. Scrolling stops where the
  pointer happens to be.
- Fitting the page to the window means two scrollbars when the page also scrolls (the title
  and the description above the screen).

What does the job instead: the toolbar, whose panels bring the part wanted next to the screen
(a pinned panel is live there), and reordering the top level. A later choice, for tall
windows only: the screen and toolbar `position: sticky` at the top while the one page scrolls
under them, with the screen's height draggable, so there is one scrollbar and the outline
gets the room the person gives it. Not on a phone.

## Light and dark

The terminal panes (memory, Korz, the speed card) take their colors from `--term-*` in
`routes/+layout.svelte`, each a `light-dark()` pair: black as a monitor's on a dark page (the
catalog), paper on a light one (`/apple2/`). New panes use the same variables.

## To come

- **Pie menus** layer onto this: the outline and the toolbar are the base they bring closer to
  the hand. A pie menu on a control or panel offers where to put it.
- **Embeddings with their own view state.** Today an id is one control or panel, and the
  toolbar shows the one instance. Next, an id names an instance of an offer (`panel-bits`,
  `map#overlay-traffic`), and the snippet's argument grows from a boolean into a place:
  where it is shown, and that instance's view state (where a map is looking, which overlay,
  its zoom), kept with its bit and index. Then several views of one thing sit side by side:
  Micropolis's whole-city map with different overlays, tile views at different places, each
  marked as a rectangle on a mini map and scrolled by dragging it.
- **Sharing views.** A view is its list of ids, bits, indexes and view states: small enough
  for a link (as `?seed=` and `?poke=` are) or a cartridge's definition, so a game can ship
  with the toolbar its author plays it with.
- **Interpolating between views**, as between music seeds: settings that are numbers move
  smoothly from one view's to another's.
- **The PDP-7 page** moves to this outline and toolbar; its dance panel already offers its
  controls (`DancePanel` with `id="pdp7"`), with no toolbar there yet to show them.
- Reordering the toolbar's row from the keyboard (its handles skip the tab order now; a
  roving tab stop over the row would give them one).

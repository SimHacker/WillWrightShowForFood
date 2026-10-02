# Tags, focus and pies: making the 340's pictures into things you can act on

Status: design, nothing built. Worked out in conversation with Don on 2 October 2026.
The gesture details are guesses. This note picks the parts that can be decided now and
builds the rest as a playground with knobs, so we can find out what feels right by
trying it rather than by arguing in our heads.

## The idea in one paragraph

A display list can say *what* it is drawing, not only how. A new 340 word marks
everything after it with a **tag**: a title, a link and a 36-bit id. Tapping
something tagged with the light pen **latches** its tag, gives it real browser focus,
and shows its title and tooltip. A screen reader announces it. Tapping again soon
after, or tapping and swiping, opens a **pie** on the latched thing. The pie's items
come from **advertisements**: every part of the system that knows something about that
kind of thing offers items, and the pie collects them. Items can open links, play
macros, feed input to the program, or run JS that walks PIXIE structures in core. PIXIE
ring structures become the format apps exchange.

## 1. The tag word (DTG)

The 347 subroutine word (SUBR mode) has a two-bit jump type in bits 0–1. DEC defined
three of the four values: DJS = 3, DJP = 2 and DDS = 1. **Type 00 was never defined.**
SIMH's `display/type340.c` puts it under `default: /* XXX ??? */`, and the cabinet
ignores it too. We use it:

| bits | meaning |
|---|---|
| 0–1 | `00` = DTG, display tag |
| 2–4 | next mode, as in every SUBR word |
| 5–17 | address of the tag record, 0 = untagged from here on |

Everything drawn after a DTG carries its tag, until the next DTG. `IDLA`, which
restarts the display list, clears the tag. DJS saves the tag and the return restores
it, so a subroutine can tag its own drawing without disturbing its caller's.

**Old programs keep working.** I ran all 72 tests with a hook on every SUBR word
(2 October 2026). About 9.4 million SUBR words ran in SYMELEC and the house demo, and
about 1.05 million in LP370; none had jump type 00. No program ever set PARAM bits 9
or 10 either. That covers only
the code the tests run, not every word in the listings, but it is strong evidence.

### The tag record, in PDP-7 memory

| word | contents |
|---|---|
| 0 | flags in bits 0–4, title pointer in bits 5–17 |
| 1 | id/URL string pointer |
| 2 | id, high 18 bits |
| 3 | id, low 18 bits |

The flags:

- bit 4: title format, 1 = ASCII with one character per word, 0 = 6-bit with three
  characters per word;
- bit 3: the same choice for the id/URL string;
- bit 2: the numeric id in words 2–3 is present.

Any field can be absent. Strings end at a zero word. 6-bit text uses the same codes
as CHAR mode, so SYMELEC's and LP370's own text tables, which run about
1.9 million and 400,000 packed character words in the tests, can be used as titles
directly. ASCII is the easy option for new code. A shared PDP-7 subroutine, or a Forth
word, builds records.

**The 36-bit id means whatever its reader wants.** It can be a type in the high half
and a type-specific number in the low half, a 2-D number (hi, lo), or one big number.
The 340 never interprets it.

**URL safety:** only `http:`, `https:` and relative links are followed. `javascript:`,
`data:` and anything else is refused.

### In Forth

Forth cells are 18 bits, so an id is two numbers on the stack, low then high. These are
new words in `turtle.fs`, so no existing program changes:

```forth
title" Front door"   id" https://example.org/door"   5 0 tag   ( draw... )   untag
hit   ( -- lo hi )   \ the latched id after a pen tap
```

`tag` writes a DTG into the display list (`dl,`), pointing at a record built from the
last `title"` and `id"`. The kernel has no double-number literals, so `5 0` is just two
numbers.

## 2. The latch

There is one register, the **pick latch**, shared by the program and the browser.

- Every pen tap latches the tag of what it hit. A tap on untagged drawing, or on empty
  screen, clears the latch.
- IDPN pulse 4, free until now, reads the latched record address into the AC. The PDP-7
  program and the browser therefore always agree on what is picked.
- A redraw keeps the latch if the record still appears in the frame. A reset clears it.
- The frame snapshot carries a `tags` map from record address to decoded record, and
  each segment carries its tag address. The browser hit-tests without asking the
  program anything.

## 3. Tapping is focusing

A tap goes to the program as a pen hit, exactly as now and with no delay. If it latched
a tag, the overlay also:

- moves **real browser focus** to an element for that tag, so the browser's own focus
  machinery and screen readers work;
- highlights the tagged segments;
- shows the title, the definition and the full URL, so you see where a link goes
  before following it: in HyperTIES, in the definition window at the bottom, not
  over the tube ([ROADMAP §10](ROADMAP.md#10-info-goes-upstairs-the-definition-window));
  standalone, in the light tooltip;
- announces the title through the `aria-live` announcer.

Keyboard: Tab and Shift-Tab move the latch through the tagged items in display-list
order, doing all of the above.

## 4. Double tap and the pie

A second press soon after the first acts on **the latch**, not on whatever is under the
second press, which makes thin vectors easy to hit.

- **Double tap and release:** do the **centre action**. For a link, that's follow it.
  Or should a double tap pop up the pie of ways to follow it? We don't know yet, so it
  is a setting (§8).
- **Double tap and hold, or tap and swipe:** the pie opens, with mouse-ahead, so a
  quick swipe chooses without the menu ever being drawn.
- **Untagged and no background advertisers:** no pie. The press goes to the program as
  usual.

The pie's items never reach the program as pen hits. The only thing the program loses
is a quick second tap on a tagged item.

This pie is an HTML overlay above the tube. It is not Heinz's ring menu, which PIXIE
draws on the 340 itself, and it is styled so nobody confuses the two.

### The first link pie

| direction | item |
|---|---|
| centre | follow the link |
| up | open in a browser tab (a webtop window, later) |
| left | open in the left pile |
| right | open in the right pile |
| down | show the definition in the definition pile below |

The pile actions use what `apps/ties` already has: `src/lib/pile.svelte.js` and
`src/lib/commands.js`.

## 5. Advertisements build the pie

The pie is **context sensitive**. A prepare step builds a context and asks every
registered advertiser for items. The context holds:

- the latched record: title, URL, id as `hi`, `lo` and `big`;
- the tap position, the segments hit and their display-list addresses;
- read-only access to core, so an advertiser can chase pointers, for example from the
  hit display word to its PIXIE element;
- which tape is running.

The emulator is paused while the pie is open, so what advertisers read stays put.

Each item has a label, a **preferred direction** (so the same item always sits in the
same place), a **score** (which items win when there are more than eight; the rest go
to a "more" submenu), and an action.

| advertiser | offers |
|---|---|
| any tag with a URL | the link pie above |
| app, keyed on the id's type half | e.g. open the card, open the listing at this address |
| tape-specific, reading core | e.g. SYMELEC: the element under the pen and its commands |
| the program itself | an optional tag-record field pointing at a menu list in its own core: label and code pairs |
| background | for a double tap on empty screen: run/stop, pen colour, listing, card |

Background is off unless something registers background ads for that tape, because
SYMELEC's tracking cross needs taps on empty screen.

## 6. What items can do

- **Follow links,** as in §4.
- **Feed input:** a pen tap, a keystroke, the switch register.
- **Play macros:** recorded pen, keyboard and switch events, with positions stored
  relative to the tapped item so a macro works wherever the item is. Playback uses
  `DemoPlayer` from `src/symelec-demo.ts`, which already times in machine cycles and
  shows captions. Every step goes in through the same path as live input, so the
  program sees a user, not a back door.
- **Deposit a code** in the program's mailbox, read by an IOT, so the program carries
  out its own menu items.
- **Run JS** with `peek` and `poke` on 18-bit core, `packages/pixie` bound to live core
  (`car`, `cdr`, `toArray`, `classify`, `RingBuilder`, `relocate`), and the context.
  Pokes happen only while the CPU is paused between instructions.

## 7. PIXIE as the exchange format

- **Out:** walk a structure in core into a TypeScript graph and serialise it with
  `encodeTransfer`.
- **In:** decode, check with `pointersResolve` and the address limits, relocate into
  core taken from PIXIE's own free list, and link it in. The 1969 program sees ordinary
  PIXIE data.
- Copy and paste, drag between windows, files, and messages between apps all carry the
  same encoded PIXIE data. Tag records live inside the structures, so a pasted graph
  keeps its titles, links and ids.

### Trust

| source of the item | may do |
|---|---|
| advertisers in the app's own code | everything, including JS and pokes |
| menu lists in tape memory | mailbox codes, macros made only of input events, links that pass the URL check |
| graphs from another app | nothing until `pointersResolve` and the address limits pass |

Tape memory can never supply JS. Otherwise any tape could run code in the page.

## 8. Cursors are vehicles

The light pen, the pie cursor, a macro and the keyboard cursor are all **vehicles**.
Input focus is the driver, who hops between them.

- Opening the pie **parks** the pen: it stays where it was and its rim dims or turns
  dotted, because that is still where the program thinks the pen is. A pie cursor
  appears at the pie's centre and you drive that.
- Choosing or cancelling ends the ride: the pen is warped back, drawn solid, and gets
  focus again, like Emacs `save-excursion`. The program never sees the pen move during
  a ride.
- Rides nest: a "more" submenu, a macro you can watch and stop with Escape, the keyboard
  stepping through tags.
- Screen readers hear where each ride starts and ends: "Pie menu, Front door", then
  "Back to light pen".

This is the virtual cursor layer MicropolisCore has already designed (below). The
cabinet should be one of its consumers, not grow a second one.

## 9. Keyboard and screen reader

- Tab and Shift-Tab move the latch. Enter, Space, the Menu key or Shift-F10 opens the
  pie.
- In the pie: arrows pick a direction (two arrows, or the number pad 1–9, for
  diagonals); Tab walks items clockwise; an item's first letter jumps to it; Enter
  chooses; Escape closes; Backspace leaves a submenu.
- The pie is an ARIA menu. Each item announces its direction, e.g. "Open in left pile,
  left". Opening announces "Front door, link, 4 items", and choosing announces the
  result.
- Focus stays in the pie while it is open and returns to the latched item.
- Tooltips appear on focus as well as hover; Escape dismisses them.
- The mouse pie, the keyboard pie and the screen-reader menu are built from the same
  advertised items, so no way of using it misses an item.

## 10. Building to find out: the playground

This cannot be designed in our heads. The gesture layer is built so every guess is a
setting, changed live from a panel beside the tube and saved per user:

- double-tap timeout and distance;
- what a double tap does: centre action, or open the pie;
- whether tap and swipe opens the pie, and how far a swipe must go;
- how long a hesitation before the pie is drawn;
- whether a single tap shows the tooltip at once or after a delay;
- how the parked pen is drawn: dimmed, dotted, or hidden.

The pieces stay separate so each can be swapped while trying things:

| piece | job |
|---|---|
| tag decoder | display list and core → tags map, in `packages/cabinet` |
| latch | in `Type340`, read by IDPN pulse 4 |
| gesture recogniser | pointer events + settings → tap, double tap, swipe; pure, testable without a browser |
| advertiser registry | context → items |
| pie | items → choice; mouse, keyboard and screen reader |
| actions | links, piles, macros, mailbox, JS |
| cursor layer | vehicles, parking, rides |

## 11. Where we build what

| what | where |
|---|---|
| DTG, tag records, latch, IDPN pulse 4, tags in frames | `packages/cabinet/src/plugins/type340.ts`, tests in `src/cabinet.test.ts` |
| Forth `title"`, `id"`, `tag`, `untag`, `hit` | `packages/cabinet/tapes/pdp7forth/turtle.fs` |
| gesture recogniser, advertiser registry | `packages/cabinet`, framework-free |
| focus, tooltip, announcer, playground panel, first pie | `apps/ties/src/lib/CabinetApplet.svelte` and new components beside it |
| the real pie, cursor layer, tabs, windows, pushpins | MicropolisCore, then shared |

MicropolisCore's designs, which the cabinet follows rather than duplicates:

- the pie model, Target → Pie → Slice → Item with `findPie` and `onshowpie`:
  `documentation/designs/piecraft/PIE-MENU-MODEL.md`. Advertisements fill Slices with
  Items, and the fixed link directions are fixed Slices;
- the virtual cursor layer: `documentation/designs/virtual-cursor-layer.md`, with
  skeleton code in `apps/micropolis/src/lib/input/` (`VirtualPointerController.ts`,
  `CursorLayer.svelte`, `PointerGrabToggle.svelte`, about 1,100 lines, in the app and
  not yet a package);
- pie cursors and wedge hit-testing:
  `documentation/designs/virtual-pointer-and-pie-cursors.md`;
- pies, tabs and windows: `documentation/notes/PIE-TAB-WINDOWS.md`;
- the command bus, so pie items are command ids with a risk policy and LLM proposals:
  `apps/micropolis/src/lib/CommandBus.ts` and `skills/micropolis-command-bus/`, with
  its event envelope in `documentation/designs/naming-conventions.md`. The cabinet
  borrows the shape, not the name: it rides tiny-bus, with `TinyCommand` and
  `TinyEvent` (see [ROADMAP §8](ROADMAP.md#8-driving-the-ui)).

The cabinet's first pie is deliberately small and uses that model's names, so it can be
swapped for MicropolisCore's package when that exists, without touching any advertiser.
Its model and its NeWS 1.1 skin are planned in
[ROADMAP §9](ROADMAP.md#9-the-first-pie-target-pie-slice-item-in-a-news-11-skin).

## 12. Order of work

**Finish first,** before the big dive into pies, pushpins, tabs and windows:

1. Work already owed: the multi-pen IDPN plan, the LP370 test for several pens, and
   Heinz's seven points, ordered in [ROADMAP.md](ROADMAP.md), which also designs the
   UI driver that pie actions use.
2. DTG, tag records, the latch and IDPN pulse 4 in `Type340`, with tests. That includes
   a test that every existing tape draws exactly the same segments as before.
3. The Forth words, and a turtle demo that draws tagged shapes.
4. Tap focuses: browser focus, highlight, title, tooltip, announcer, Tab through tags.
   This is useful on its own, with no pie at all.

**Then the playground:**

5. The gesture recogniser, with its settings panel.
6. The advertiser registry and the link pie, with keyboard and screen reader from the
   start.
7. The parked pen and the pie cursor, as the first ride.

**Then the big dive,** mostly in MicropolisCore:

8. Lift the virtual cursor layer out of `apps/micropolis` into a package; build the
   real pie on the Pie → Slice → Item model; move the cabinet onto both.
9. Macros, the program mailbox, JS actions, PIXIE graph export and import.
10. Webtop: windows, tabs and pushpins. Pinning turns a latched tag into a window that
    stays.

# 340-Windows: views of a machine's memory, drawn by your own 340

*Status: planned. The pieces already built are marked; everything else is design.*

340-Windows is a way to spy on segments of another machine's memory and render local views of
them. A view names its segments by symbols from the watched program's own symbol table, copies
them into its own memory, and runs them on its own Type 340. The program being watched needs no
change and doesn't know it is watched. Views can also write back, carry code to handle the light
pen locally, capture what they show, and be combined on one screen.

- [Where the idea comes from](#where-the-idea-comes-from)
- [What SYMELEC's display is made of](#what-symelecs-display-is-made-of)
- [A view is a memory mapping](#a-view-is-a-memory-mapping)
- [The watched program doesn't have to know](#the-watched-program-doesnt-have-to-know)
- [Code that travels with a view](#code-that-travels-with-a-view)
- [Editing through a view](#editing-through-a-view)
- [Capturing a view](#capturing-a-view)
- [One 340 for many machines](#one-340-for-many-machines)
- [What is built, and the order of work](#what-is-built-and-the-order-of-work)

## Where the idea comes from

**ITS's output spy and the Knight TV video switch.** ITS had two ways to watch someone else's
screen. `:OS`, the output spy
([os.93 in the ITS sources](https://github.com/PDP-10/its/blob/master/src/sysen2/os.93), titled
"TTY OUTPUT SPY"), copies characters out of another terminal's output buffer onto yours. On the
Knight TVs, Escape S ("SELECT VIDEO CHANNEL" in the
[TV-11's program, tv.147](https://github.com/PDP-10/its/blob/master/src/system/tv.147)) set a
video switch (`VSW==164060`) that routed another console's frame buffer to your monitor. Every
frame buffer was in the one TV-11's memory, so nothing had to be sent anywhere; the switch was
electrical. A 340-Window is an output spy for vector display instructions: what is copied is the
display list, and the watcher's own 340 runs it.

**The 340 needs no CPU to draw.** It fetches its display list from core and runs it; the CPU
only writes the list and starts it with an IOT. So a cabinet with no CPU at all, just memory, a
340 and a [tiny-titan](TINY-TITAN.md) link, is a display server: display code arrives over the
link, is deposited in core, and the link starts the display. That is the X Window System's
arrangement, programs on other machines drawing on a display server's screen.

**NeWS, with 340 code and Forth in place of PostScript.** In James Gosling's NeWS at Sun, clients
sent PostScript programs to the window server, which ran them there to draw and to handle input
without a round trip. A 340-Window can carry code the same way
([Code that travels with a view](#code-that-travels-with-a-view)).

## What SYMELEC's display is made of

A display list is rarely one block of memory. SYMELEC's, described in the
[guide to SYMELEC's code](reference/GUIDE-SYMELEC.md), is several:

- **Several display files, chained by `DJP` jumps:** `LB` (the lightbuttons), `WAREA` (the
  frame), `TEMPDF` (the element being drawn) and the finished picture, whose bounds SYMELEC keeps
  in the cells `DFB` and `DFE` (`DZM I DFB`, `LAC I DFB`). The picture sits in the upper 4K of an
  8K PDP-7.
- **Display subroutines.** The Type 347 adds `DJS`, a display subroutine call. It has one save
  register, so one level of call. PIXIE's display file compiler plants `DJS` words for subpictures.
- **Words the CPU rewrites while the 340 runs.** The tracking cross's position words, `XCROSS` and
  `YCROSS`, change every time the pen moves ([how SYMELEC tracks the pen](TRACKING.md)).
- **Words the 340 writes.** `DDS` deposits a jump into core location 3, and SYMELEC's pen handler
  reads locations 3 and 5 to find out what was hit
  ([the light pen dispatch, word by word](reference/GUIDE-LIGHTPEN.md)). So the 340 writes CPU
  memory, and the pen dispatch depends on it.

So a view has to be a list of segments and how to run them, and has to send some writes back.

## A view is a memory mapping

A view is mostly configuration: segments mapped into the view's core, each at whatever address
the view chooses.

```yaml
view: symelec-picture
map:
  - at: HERE                         # a Forth library: fetched by URL, compiled here, DP moves past it
    source: https://example.org/forth/turtle-color.fs
    as: forth
  - at: 0o4000                       # live, from the server's SYMELEC
    from: cambridge:symelec
    segment: "@DFB .. @DFE"          # the picture: DFB and DFE hold its bounds
    refresh: frame
    transform: relocate              # 340 jumps are absolute: retarget DJP, DJS, DDS
  - at: 0o6000
    from: cambridge:symelec
    segment: LB .. WAREA
    refresh: change
pen:   { handler: on-pen }           # Forth words, run locally
start: 0o4000                        # where the view's 340 begins
```

- **Segments by formula.** Addresses, sizes, refresh rates and colors are expressions over the
  program's symbol table, the view's configuration and the running environment. `@DFB` is the
  word stored at `DFB`, as `LAC I DFB` reads it, so the segment follows the picture as it grows.
  The expressions are kept current as reactive constraints, recomputed when a value they read
  changes, as attributes bound with `${...}` constraints were in OpenLaszlo and as `$derived`
  values are in Svelte.
- **Entry points.** Where the view's 340 starts, the `IDLA` address, and which jumps to follow.
  The server can also find a program's segments by watching what its own 340 fetches: every
  stroke already records the address that drew it, the block it was in and the `DJS` it was
  called from (built: `Segment` in [the Type 340 plugin](src/plugins/type340.ts)).
- **Relocation on the way in.** 340 jumps are absolute 13-bit addresses, so a segment mapped
  somewhere else needs its `DJP`, `DJS` and `DDS` targets moved. Scaling, color and filtering are
  other transformations a mapping can apply.
- **Write-back.** The locations the view's 340 writes (`DDS` targets) go back to the server, so
  the program's pen dispatch still works.
- **A refresh rate per segment:** every 340 frame, a few times a second, on change, or on demand.
  A slow client, or one across the network, asks for less.
- **Whole frames.** The server sends at an `IDLA`, the start of a refresh, so a view never runs a
  display list half rewritten. A real 340 did read lists while the CPU rewrote them, and SYMELEC
  lives with that; new programs can mark a list ready with a lock and commit message
  ([tiny-titan's services](TINY-TITAN.md#services)).
- **Libraries are segments too.** A Forth source library is fetched by URL, compiled locally into a
  segment of whatever size it needs, placed at `HERE`, relocated if needed, and `DP` is advanced
  past it. Place, relocate, advance `DP`, repeat is the main loop of the
  [multi-source assembler and linker](ASSEMBLERS.md#a-linker-and-one-object-format-after-bfd).
  A library's segment is read-only once placed.
- **Snapshots are views of saved segments,** copy on write: a snapshot shares every unchanged
  word with the live machine and with other snapshots, and copies only what is written
  afterwards, on either side. Opening a snapshot is opening a view; editing one leaves the
  machine it came from alone, and comparing two snapshots is comparing two views.
- **The source map comes along.** Segments assembled by the shared core carry their
  [source maps](ASSEMBLERS.md#source-maps-of-several-types-in-tiers), so a view can show which line
  of which file drew each stroke, and on through to the line on the scanned listing.
- **Only what you need.** A view gets the segments it names, not the whole machine.

## The watched program doesn't have to know

Everything a view needs comes from outside the program. The assembler writes the symbol table
from SYMELEC's source, the emulator reads it, and cabinet, device and view configurations name
addresses by symbol and do arithmetic on them.

Views that aren't 340 code work the same way. The RINGS panel, the cabinet's TypeScript view of
PIXIE's ring structure, already does this on the local machine (built): its configuration names
the cells that hold the ring area's start and end and the root names, by SYMELEC label or octal
address (`ringAddr` in [the cabinet applet](../../apps/ties/src/lib/CabinetApplet.svelte)), and
`captureRings` reads that span of core. Two steps make it remote:

- **Expressions, not only labels:** evaluate each field with the assembler core's expression
  evaluator, so `@DFB` or `SAVINS+1` work wherever a label does now.
- **Read through the network:** capture the span through tiny-titan's
  [`peek` service](TINY-TITAN.md#services) instead of `cpu.read`, so the RINGS panel in any
  browser watches a SYMELEC running on the server.

## Code that travels with a view

A view can carry code to run beside its display list, so it handles the pen and moves the
tracking cross locally instead of waiting on the server.

**Forth source is the best format for it.** It is more universal than PDP-7 or PDP-10 machine
code: the same source compiles on Mitch Bradley's PDP-7 Forth, on Don's Apple ][ Forth, and on a
Forth compiled by Korz straight to JavaScript. It is small and readable by the person watching,
and a Forth can take it in with no file system: tiny-titan's
[`type` service](TINY-TITAN.md#services) types it in a line at a time. Assembled PDP-7 or PDP-10
words, or source with its type declared, work too.

- **Send it once.** A view's code goes with the view the first time and is identified by its hash
  after that; the server sends it again only when it changes.
- **It may change.** When it does, the client recompiles the words that changed and drops the old
  compiled code, as Self recompiled and deoptimized when a method changed under a running program.
- **Handlers are Forth words.** The pen and command handlers run in the view and send messages
  back that edit the real memory.

**The display terminal: core, a 340 and a Forth CPU.** The smallest client that runs a view's code
has no PDP-7. It has core, a 340, and a Forth CPU device that executes threaded Forth code in
core directly. Today's [Forth device](FORTH-DEVICE.md) runs beside a PDP-7 and takes over when the
PDP-7 fetches `NEXT`; this one would be the whole processor. The Forth system isn't in the
terminal's memory either: the compiler from Forth source to threaded code is TypeScript outside
the emulator ([Mitch's metacompiler, reimplemented on
Korz](ASSEMBLERS.md#mitchs-metacompiler-in-typescript-on-korz)), which reads the view's source,
looks at the terminal's core and pokes in the compiled words. The dictionary, the names and the
outer interpreter stay on the TypeScript side, so core holds only the code that runs and the
display lists it draws.

**Embedded remote apps.** With both, an app can be embedded in any client as a remote view of its
memory plus a little glue code. The glue does only what has to be local: the pen interrupt, and
SYMELEC's dispatch through location 3. Instead of doing the work, the handler sends a command
naming the lightbutton back to the app's machine, which runs it and rewrites the segments the
client is watching. The app lives in one place, and any number of clients embed it.

## Editing through a view

A view that can read a segment can write it back, so editors work over the network:

- **The 340 display editor** ([edit340.ts](src/edit340.ts), built locally) moves a corner between
  two vector words by rewriting both words in core; the next refresh draws the edit, with no help
  from the program. Remote, the two writes go through tiny-titan's `poke`, and every view on that
  segment sees the change at its next frame. A program that rebuilds its display file (SYMELEC,
  when an element is finished) replaces the edit; one that only appends (the Forth turtle) keeps
  it.
- **The pens.** Each pen's settings (enabled, position, aperture, name: `PenInput` in
  [the Type 340 plugin](src/plugins/type340.ts)) are device configuration, so a remote client can
  add a pen, move it or change its aperture.
- **The pen callbacks.** SYMELEC's callbacks are in core, as `DDS` targets. A view can show which
  handler each stroke calls, by symbol, and an editor can repoint one by poking the `DDS` word.

**Who may write.** Watching is open, as ITS was. Writing (pokes, pen events, display code) is
scoped to the machine's owner and the people they invite ([tiny-titan's
services](TINY-TITAN.md#services)).

## Capturing a view

A view can capture what it shows into a clipboard. The clipboard is a configuration namespace,
not one system buffer: named entries that other views, editors and cabinets can read. Each capture
is stored in several types at once, and the reader takes the one it understands:

| Type | Status |
|---|---|
| SVG, each `DJS` subroutine a `<g>` and each stroke carrying the address that drew it (`toSvg` in [media.ts](src/media.ts)) | built |
| PNG of the tube, to the system clipboard | built |
| PIXIE ring images as YAML, JSON or the binary `PXID` stream (`readRings`, `packWords` in [the pixie package](../pixie/src/index.ts)) | built |
| YAML or JSONL of a frame's strokes (`toYaml`, `Recorder`) | built |
| JSON of any segment's words | planned |
| 340 display list segments with their symbols and source map, ready to paste into another machine or an editor | planned |
| Flat 340 display lists, below | planned |

Entries can contain entries, and a view can show a clipboard entry as well as live memory, so
captures nest: a window of windows, each a capture or a live segment. Laid out by its nesting, the
clipboard is a map of everything captured, and any node can be opened as a view, edited or pasted.

**Flat display lists: recording a 340 like a movie.** NeWS and HyperLook could capture PostScript
drawing by running a program against the drawing operators and keeping the flat drawing commands
that came out, with procedures, loops and conditionals unwrapped. The 340 can do the same. However
a picture was produced (subroutines, jumps, a CPU rewriting words, a Forth turtle, a remote
server), what the 340 drew in a frame is a sequence of strokes, and the `Recorder` in
[media.ts](src/media.ts) already keeps them. To add: write each frame out as a flat 340 display
list of points, vectors and parameter words, with no jumps and no CPU, so any 340, including the
display terminal, plays it like a movie. Most of a frame repeats the one before, so a frame can be
stored as the words that changed.

**After HyperLook.** HyperLook, the user-configurable GUI system for NeWS that Don developed with
Arthur van Hoff at the Turing Institute, and on which he ported SimCity to Unix, worked this way.
In Don's words ([his 1999 description of HyperLook](../../characters/gwern/sources/1999-userland-xanadu-thread.md)),
a user could "flip a stack into edit mode, then rearrange, cut, copy, paste, and edit components,
properties, graphics and scripts of any component on the stack", and "copy its image as
structured graphics onto the clipboard, paste it into the graphics editor". What you paste from a
340-Window is likewise editable structure, not a picture, so a SYMELEC lightbutton or a turtle
drawing can be taken apart and reused in another drawing or interface.

## One 340 for many machines

One client's 340 can show, operate and connect several machines at once, local and remote:
PDP-7s, a PDP-10, and Apple ][s, whose memory is viewed and poked the same way, whether a 6502
program writes 340 display lists into its own memory or a view renders its screen memory. The base
case is one app full screen. Iconify it into a corner and it keeps running there as a small live
view, as HyperLook's iconified stacks did ("a miniature dynamically updated icon"); then open four
others in a grid.

- **Placement is a transform when drawing.** The 340's scale settings only enlarge, so a window's
  position and size are applied by the client's renderer, not written into the display code. Each
  app's display list stays as its program wrote it.
- **Color and intensity per window.** Each window can have a main color, to tell machines apart,
  and an intensity that varies over time: fade in and out, dim the background, mark what needs
  attention, blink, flicker. They multiply what the display code already says (`Segment.intensity`,
  the 340's own levels, which SYMELEC uses to blink the selected item).
- **Style from the program.** A program can set color and intensity in its own display code, with
  [an extension of the display tag word](TAGS-AND-PIES.md#style-color-and-intensity-planned) no 1972
  program uses, and the Forth turtle gets `COLOR`, `DIM` and `BLINK`.
- **The default is the original.** Green phosphor, drawn exactly as the program drew it. Color and
  effects are there for programs that ask for them and for people who set them in the viewer.
- **One pen for all of them.** The pen, emulated with the mouse or driven by a script, is mapped
  back through the window under it into that machine's coordinates, and the pen event goes to that
  machine. The cabinet already takes several pens at once, each with its own color (built:
  `PEN_COLORS` in [the light pen plugin](src/plugins/lightpen.ts)), and the cabinet's `IDPN`
  instruction tells the program which pen touched. That makes possible
  [a Forth drawing program where switching pens switches color](TAGS-AND-PIES.md#style-color-and-intensity-planned),
  and pens that see only strokes of their own color.

The same machinery does several jobs:

- **Compositor and window manager:** windows placed, scaled and stacked; arranging them edits the
  client's top-level display list, which jumps to each window's segments in turn.
- **Mixer:** each window's sources are channels with their own intensity and refresh rate, faded,
  muted and combined, live from running machines or from clipboard entries.
- **Data flow:** one view's output feeds another's input, such as a Forth turtle on one machine
  writing the segments a SYMELEC window on another shows, or a capture dragged from one window to
  another.
- **Scrubber:** strokes are stamped with the machine cycle that drew them and session events with
  the cycle they arrived, so any window can be replayed, stepped and scrubbed.
- **Interpolator:** display lists with the same structure differ only in their vector words, which
  are numbers. Put example drawings at the corners of a simplex and
  [Embedded Constraint Graphics](../ecg/README.md) blends them; drag a corner with the 340 display
  editor and ECG solves for the weights that put it under the pen.
  [Blending views with ECG](../ecg/VIEW-BLENDING.md) does the same for whole window arrangements.
  A vector word moves at most 127 each way, so blends are checked against that limit as edits are.
- **A DJ and VJ booth:** all of it live, in front of an audience.

## What is built, and the order of work

Built: strokes with the address, block, subroutine, pen state and cycle that drew them; SVG, PNG,
YAML and JSONL capture; the `Recorder`; ring images in three formats; the RINGS panel, local; the
340 display editor, local; several pens with colors and `IDPN`.

Order of work:

1. **Expressions in view configurations**, starting with the RINGS panel's fields, using the
   assembler core's expression evaluator.
2. **A local 340-Window**: a second 340 on the same page, mapping segments of the running machine
   by symbol, with relocation and per-segment refresh.
3. **Remote, over tiny-titan**: `peek` for segments at whole frames, `poke` for edits and
   write-back, the ownership rule.
4. **Several windows on one 340**, with placement, color and intensity per window and one pen
   routed through them.
5. **The clipboard namespace** and the planned capture types, flat display lists first.
6. **Forth in the view**: handlers as Forth words, then the display terminal with a Forth CPU and
   the TypeScript compiler, then embedded remote apps.
7. **The style extension** to the display tag, and the Forth color words.

The tiny-titan side (link, services, ownership) is [TINY-TITAN.md](TINY-TITAN.md); the assembler,
linker and source maps the views depend on are [ASSEMBLERS.md](ASSEMBLERS.md).

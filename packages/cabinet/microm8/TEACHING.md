# Teaching the Apple ][: a live source graph

The TypeScript Apple ([STACK.md](STACK.md)) as a teaching machine: the video circuit, the Disk II,
the speaker, cassette, paddles, buttons and slots, each linked from its schematic to the code and
memory that use it, while the machine runs. The emulator's own code and data are linked to the
hardware they model, with every simplification marked.

## The graph

Everything the Apple is made of, and everything written about it, is a node. Typed links join them,
in both directions, using the cabinet's layers, spans and links
([DESIGN.md](../DESIGN.md#source-maps-as-transclusion-layers-spans-links)).

| Layer | Nodes |
|---|---|
| Schematics | a figure in the Red Book or the 1979 manual; a region of it; a chip; a signal |
| Timing | the system timing diagram; a signal's trace on it |
| The machine's memory | an address, a region, a soft switch, a screen hole |
| ROM listings | a printed line, and its rectangle on the scanned page |
| Disassembly and source | an instruction; a source line in any dialect |
| Programs | a BASIC line, a Pascal statement, a Forth word, a DOS routine |
| The emulator's code | a TypeScript unit, function or shader |
| The emulator's data | a field of a unit's state, a plane, a log |
| Writing | a section of a manual, a book, a doc in this repo, a note a student adds |

Link types are the existing ones (`assembled-from`, `printed-at`, `explained-by`, `tested-by` and
the rest) plus a few for hardware:

- `models`: emulator code or state that reproduces a part of the schematic, signal for signal.
- `abstracts`: emulator code that gets the same result another way (a unit catching up by
  elapsed cycles instead of ticking; a trap running TypeScript in place of a ROM routine). The link
  says what is skipped.
- `drives` and `reads`: a chip or signal and the addresses or soft switches that touch it.
- `decodes`: an address decoder and the range it selects.

### The emulator's code and data, annotated

A unit declares what it models next to its code, as data the graph reads, not only as comments:

```ts
export const speaker = defineUnit({
  name: "speaker",
  models: [{ figure: "redbook:S-10", part: "speaker flip-flop" }],
  switches: [{ addr: 0xc030, access: "any", effect: "toggle the speaker" }],
  state: { level: 0, toggles: [] as number[] },   // cycle of each toggle, this frame
  ...
});
```

State fields carry the same annotations: the video unit's horizontal and vertical counters link to
the counter chips in figure S-4, the Disk II's sequencer state to its state machine PROM, and so on.
When the code abstracts instead of modelling, the link says so, and where it matters for teaching
there is an exact mode to switch to: the video counters ticking cycle by cycle, the sequencer
stepping at its own clock.

### Live values on every node

The graph is navigated while the machine runs. Each node shows what it is doing now:

- a signal's level, a counter's value, a soft switch's state;
- a memory region's contents, in the view that fits it (text, hires picture, hex, disassembly);
- a ROM line's execution count and the last cycle it ran;
- a chip's activity: how often the CPU touched it this frame.

Clicking moves along links: from the speaker on figure S-10 to `$C030`, to the Monitor routine that
toggles it, to its printed line on the scanned page, to the emulator's speaker unit, to the waveform
it is producing now.

### History graphs

The rewind log ([TRANSPARENCY.md](TRANSPARENCY.md#time-rewind-without-recording-everything)) makes
every node's past available by replaying the stretch being looked at. The views over it:

- **A logic analyser**: signals and soft switches as waveforms over cycles, laid out like the Red
  Book's timing diagram, with the diagram itself beside them for comparison.
- **Timelines**: video mode changes down the frame, disk head position and motor state over a boot,
  speaker toggles as a waveform and as sound.
- **Activity over time**: the memory heat map as a film; a ROM routine's calls per frame.
- **Cause and effect**: from a key press to the character on the screen, through the keyboard
  strobe, the Monitor's input loop, the text page and the video scanner, as
  [CAUSE-AND-EFFECT.md](../CAUSE-AND-EFFECT.md) does for the PDP-7's light pen.

## Tours

A tour is a cartridge ([CARTRIDGES.md](../CARTRIDGES.md)): a machine, a program, a set of open
nodes and views, and text that walks through them. Each one ends in an experiment the student runs.

### Video

- **Shown**: figure S-11 (video generator), S-4 (sync counter), S-7 (RAM address multiplexer), S-8
  (RAM data latch), the timing diagram; the video unit, the mode log and the shaders.
- **The ideas**: the video scanner reads memory between the CPU's accesses, and its addresses also
  refresh the dynamic RAM, so one counter does two jobs. The text page's 24 lines sit in three
  interleaved groups of eight, at `$400 + 128 × (line mod 8) + 40 × (line div 8)`, because that is
  what the counters produce most cheaply; the eight bytes left over in each 128 are the screen holes
  that cards use. Hires colour comes from where a dot falls against the colour subcarrier, and the
  high bit of each byte delays its seven dots by half a dot to give a second pair of colours.
- **Experiments**: switch modes mid-line and watch the scanner cross the split; draw one byte at a
  time on the hires page and watch its colour depend on its column; read the floating bus.

### The Disk II

- **Shown**: the controller card's schematic, its boot ROM and its state machine PROM (sources to
  find; they are not in the Red Book); the drive's stepper phases, motor, drive select and the
  read and write latches at `$C0n0–$C0nF`; DOS's RWTS listing; the WOZ bit stream with the read head
  on it.
- **The ideas**: the card is a few chips and a small state machine, and the 6502 does the rest in
  software, timing its reads by counting cycles. Data is written in 6-and-2 encoding so no byte has
  too many zero bits in a row; self-sync bytes let the reader find byte boundaries; address and data
  fields start with marks (`D5 AA 96`, `D5 AA AD`). The boot ROM reads track 0 sector 0 into `$800`
  and jumps to it.
- **Experiments**: step the head and watch the phases; slow the bit stream down until the nibbles
  can be read by eye; break a sync byte and watch RWTS retry; boot a copy-protected disk and watch
  what it does differently.

### Speaker and cassette

- **Shown**: figure S-10 (on-board I/O and speaker); `$C030` for the speaker, `$C020` for cassette
  out, `$C060` for cassette in; the Monitor's bell and tape routines on the printed page.
- **The ideas**: every access to `$C030` flips the speaker, so a sound is a program's timing loop;
  the cassette interface is the same idea, measured both ways.
- **Experiments**: change the bell loop's delay and hear the pitch change; save a program to
  "tape" and see the waveform; load it back.

### Paddles, buttons and annunciators

- **Shown**: the game I/O connector; the quad timer behind the paddles; `$C070` to start the timers,
  `$C064–$C067` to read them, `$C061–$C063` for the buttons, `$C058–$C05F` for the annunciators; the
  Monitor's paddle routine.
- **The ideas**: a paddle is a resistance and a timer; the 6502 counts how long the timer runs, so
  reading a paddle takes time that grows with its value.
- **Experiments**: turn a paddle and watch the counting loop get longer; read two paddles too soon
  after each other and see why programs wait.

### Slots

- **Shown**: figure S-9 (peripheral I/O); the slot signals: device select for `$C0n0–$C0nF`, I/O
  select for `$Cn00–$CnFF`, the shared `$C800–$CFFF` space and its strobe, `$CFFF` to release it;
  each card in [STACK.md](STACK.md#cards).
- **The ideas**: a card gets sixteen registers, a page of ROM and, when selected, two kilobytes of
  shared ROM, with no configuration; the Monitor finds a boot card by looking at slot ROMs.
- **Experiments**: put a card in a different slot and follow how its code finds its own slot number.

### The 6502 and the bus

- **Shown**: figure S-1 (system diagram), S-2 (MPU and system bus), S-5 and S-6 (ROM and RAM
  select), the timing diagram; the processor unit and its opcode table; the bus trace.
- **Experiments**: step an instruction and watch its bus cycles; write to ROM and see nothing
  change; watch the keyboard strobe at `$C000` and its clear at `$C010`.

## The video circuit in 3D

In November 2018 Don wrote to Paleotronic's editor, after seeing microM8 draw an Apple's pixels in
3D: "Hey, you could even draw a 3d diagram representing of all the logic and circuitry behind the
pixels, reading from video memory and mutating it into NTSC video, like a cybertronic rube goldberg
device, to illustrate the brilliance of WOZ’s hardware design."

**Every stage is a function.** The video circuit is a pipeline: the horizontal and vertical counters,
the address multiplexer, the RAM byte on the data bus, the latch, the character generator or the
hires shift register with its half-dot delay, the dot clock, and the colour that comes out against
the subcarrier. Given the cycle, memory and the mode table, each stage's value at any beam position
is computed directly; this is the same address function and dot pass the shaders use
([STACK.md](STACK.md#video-on-the-gpu)), split at every stage. Nothing has to tick, so the 3D view can
freeze the beam, crawl it one cycle a second, or scrub it backwards through a recorded session, and
it only computes the stages it is showing.

**The scene comes from the graph.** Each chip and region of figures S-4, S-7, S-8 and S-11 is a node,
with a `models` link to the stage that computes its outputs. The scene places them as machinery:
memory as a field of byte blocks, the counters as odometers, the multiplexer as a switch yard picking
the address, the latch catching the byte, the shift register as a conveyor that pushes out dots, the
colour subcarrier as a wave the dots ride against, and at the end the screen, drawn with microM8's 3D
pixels. Signals are cables carrying their live values. Clicking any part opens its figure, its code,
and the memory it is reading.

**The work is the netlist**: which chip feeds which, signal by signal, transcribed from the figures.
Check: a chip-level simulation of the transcribed netlist, run for one frame, produces the same dots
as the reference decoder for every test screen. It is slow and only runs for that check and for the
slow-motion view.

**Cards and cables too.** The same scene holds the slots and the cards in them, with their cables to
the drives, the monitor and the game port. Plugging a card in the scene is the same act as adding it
to the save file ([SAVE-FILES.md](../SAVE-FILES.md#plugging-in-a-card-adds-its-state)); the cable is a
link in the graph. The Disk II's sequencer, with the bit stream passing under the head, the speaker's
flip-flop and the paddle timers charging get the same treatment.

## Sources

- **The Red Book**: the *Apple II Reference Manual*, January 1978. The full scan is public
  ([classiccmp](http://www.classiccmp.org/cpmarchives/AppleII/Apple%20II%20(Redbook).pdf)); the repo
  holds Don's photographs of eleven of its figures, each with a sidecar
  ([apple-ii-redbook](../../../characters/steve-wozniak/media/apple-ii-redbook/INDEX.yml)).
- **The 1979 *Apple II Reference Manual***, for the Autostart Monitor's listing and the later
  board.
- **Jim Sather's *Understanding the Apple II*** (1983) and ***Understanding the Apple IIe*** (1985),
  the standard explanations of the timing and video circuits, cited wherever a tour follows them.
- **The Disk II controller's schematic and PROM listings**, from sources still to be chosen.
- **microM8's source**, for how each part behaves in a working emulator ([MODULE-MAP.md](MODULE-MAP.md)).

The manuals are Apple's. The graph links to the public scans by page and rectangle and quotes short
passages; it doesn't republish them.

↑ [STACK](STACK.md) · [TRANSPARENCY](TRANSPARENCY.md) · [PLAN](PLAN.md) · [README](README.md)

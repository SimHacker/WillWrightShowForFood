# The cabinet manifesto

**We control the horizontal. We control the vertical.** The emulator gives us every register,
every word of core, every device, and the host around them, all at once. None of it is a black
box. When something can be improved, we change it on whichever side is closest: the program, the
emulated device or the host. The emulated 1960s machine behaves as the original did; everything
around it is ours to design.

This page sets out the design principles. [DESIGN.md](DESIGN.md) is the plan, and [README.md](README.md) is what
runs today.

## Tribute, accessibility and fun beat realism

We bend the rules and depart from realism whenever that honors someone, lets more people in, or
makes it more fun. Realism is a way to reach those, not a goal of its own.

- **Tribute.** Listings say who assembled them, and the name goes to whoever wrote the code, even
  where the real machine had no logins. Heinz Lemke's `HL1470` is real. Mitch Bradley is `wmb`, as
  he always is, and his Forth says `wmb,claude`, in his lower case, because Claude wrote it with him.
  C. Stein's 1964 PDP-4 never asked for a user name, but the listing says `CSTEIN` anyway. DUEL's
  is `PETERSON,VINER`, because it had two authors, and HILO and LANDER say `A2DEH,CLAUDE`.
- **Accessibility.** The teletype wraps, scrolls, zooms, reads aloud and takes dictation. No KSR-33
  ever did.
- **Abstract people, real machines.** Heinz at the light pen, Mitch at his Forth, Ken and dmr at
  UNIX, Don (the long-haired redhead from his photo in The Sims credits), and a robot for AI:
  retro Sims 1 characters animated by [VitaMoo](https://vitamoo.space), Don's open source
  TypeScript reimplementation of the Sims 1 animation system, at a photogrammetric PDP-7. The
  robot is The Sims' housecleaning robot, as generic as possible on purpose: it stands for AI, not
  for any particular one. This is
  Scott McCloud's masking effect from *Understanding Comics*: a simple character in a realistic
  scene is one you can identify with, and step into, while the scene stays real.
- **Fun.** HILO takes "ninety nine" by voice, and the bell rings when you rub out too far.

The machine itself stays faithful: every instruction does what the PDP-7 did, and old code runs
unchanged. Where we depart, we say so, and the original is still one click away.

## Push the driver out into the host

On a real PDP-7 the program has to do everything itself, because the teletype does no processing
of its own. In the cabinet, the emulator and its teletype are software we wrote, so the driver can
run on the host's side, where it is easier to write.

- **Duplex, line or raw input, key bindings** belong to the teletype, not the program. Each
  cartridge sets them: UNIX is half duplex with SIMH's UNIX key mapping, and Forth is full
  duplex because it echoes itself. ^S and ^Q can stop and start the machine. ^C can send the
  interrupt that UNIX calls ALT MODE. ^] is the emulator's own prefix, as in telnet and Emacs:
  the key after it talks to the cabinet, not the program (`^] {` slower, `^] }` faster, `^] ?`
  the list), and ^] twice sends a ^]. ^T, the system's status, is next.
- **SIGWINCH for a program that has never heard of it.** Mitch Bradley's Forth breaks the WORDS
  listing at 60 columns, from one constant, `dm60`. The assembler's symbol table tells the
  teletype where that constant is, so when the paper is resized, the teletype writes its width
  there. Forth breaks its lines at the right edge, with no change to Mitch's code.
- **Terminal features outside the program.** The teletype can be as comfortable as a modern terminal:
  scroll back, copy and paste, font sizes, a height you drag. A faithful KSR-33, with its sound and
  its paper, gets built separately, from video loops and 3D models. This one is for hacking.
- **Accessible input and output.** A screen reader hears what the machine prints as soon as it pauses, the
  prompt included, and not the echo of what you just typed. The command line under the paper is
  a real text field, so dictation, phone keyboards and input methods all work, and 🎤 sends a
  spoken line. HILO, a teletype game from a machine with no screen, plays by ear and voice.
- **Dasher, steered by the program's own grammar.** The emulator can read what the running
  program would accept next (Forth's dictionary, PIXIE's commands, UNIX's files) straight out of
  core, so a Dasher-style input offers only those, sized by how likely they are, for anyone who
  steers with a mouse, a finger, their eyes or one switch. For people who type, the same reading
  gives Copilot-style Tab completion and help: on an Apple ][, BASIC keywords from the token table,
  variables from the variable table, and `GOSUB` targets named by the `REM` on their first line,
  all read from the tokenized program in memory ([TELETYPE-DASHER.md](TELETYPE-DASHER.md)).

## Every machine can see every other machine

On real hardware, a PDP-7 and a mainframe communicate over a wire. Here they share one process.
Two PDP-7s, an Apple ][ and a PDP-10 can run side by side on the
[tiny-titan](TINY-TITAN.md) bus:

- **messages** between them, and **interrupts on arrival**, after ITS's core links;
- **shared memory**, with locks tiny-titan manages, as MIT-AI did in hardware when a PDP-10 job
  could map a PDP-11's memory into its own address space ([MAPPING.md](MAPPING.md));
- **tiny-titan as the switchboard**, the file server and cloud storage, and the gateway to the
  real internet.

Because they share a process, one machine can **read another's memory**. tiny-titan can walk PIXIE's
ring structures in the PDP-7's core while it runs, lift each pixie out into a file, and then
check that serializing it and loading it back gives the same rings. No PDP-7 program has to be
written or changed for that. It is a debugger, a file system and a network test at once, and it
works because no machine's memory is closed to the others.

## A federation of emulators, after microM8

**microM8 is the model for what an emulator can give the person using it.** April and Melody
Ayres-Griffiths's Apple ][ emulator ([Paleotronic](https://paleotronic.com/software/microm8/))
calls it "upcycling": it runs the machine faithfully and then adds what it never had. Its
additions include graphics in 3D and HD with cameras you can move; live rewind; a web debugger
that runs time backwards, with trace recording and memory heat maps; an Epson FX-80 that prints
to color PDF; a mouse that drives programs written for a joystick; Applesoft and Logo rewritten
in Go, with 3D modes added; and microPAK, one file that gives an old program new colors, music,
backdrops and controls, which is the nearest thing anywhere to our cartridge. It now also has an
HTTP API and an MCP server, so another program, or an AI, can drive it. Much of this page is microM8's attitude, applied to a
PDP-7. Don has been telling people so since 2018, when Melody ported his 1983 Logo Adventure to Apple
Logo ([HN](https://news.ycombinator.com/item?id=18409959)).

**Other emulators join as peers, not as ports.** The cabinet doesn't need to contain every machine.
It needs every machine to be able to talk to every other one. tiny-titan is the hub: each instance
of each emulator, ours or anyone's, registers with it, and an Apple ][ running ProDOS Logo and a
PDP-7 running Mitch's Forth exchange messages through it, each in its own operating system, at its
own speed, in its own window. Thomas Cherryhomes's [FujiNet](https://fujinet.online/) does this
for real 8-bit machines, a software-defined peripheral that puts an Atari or an Apple ][ on the
network through its own bus. The cabinet does it for emulated ones, and the two can meet.

**tiny-titan translates.** Its own language is PIXIE's rings, the PDP-7's data structure, so the
PDP-7 needs no parser. For everyone else it converts rings to and from JSON, YAML and XML, and
to whatever a peer speaks: Logo commands for a turtle, MCP calls for microM8, HTTP for a web
service. MOOLLM's adventure has [C-3PO](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/robots/README.md),
the protocol droid, on its robot roster, as a voice for these translations.

**The first demo.** Forth on the PDP-7 builds a PIXIE ring describing a figure and sends it to
tiny-titan. tiny-titan translates the ring into Logo and passes it to microM8, running beside the
PDP-7 in another view, whose 3D turtle draws it. microM8's MCP server can take it today, as typed
Logo or as interpreter code. The plan is in [TINY-TITAN.md](TINY-TITAN.md#the-hub-for-every-emulator).

**Members keep their own formats and licenses.** Each member keeps its own code, its own formats
and its own license inside the federation, the way an organelle keeps its own DNA inside a cell: microM8's
YAML presets and microPAKs stay microM8's, read and written in their own terms, with their
authors' names on them. microM8's source is MIT. The cabinet's license isn't chosen yet; a
permissive one (BSD or MIT) would let code and formats pass both ways with nothing more than a
copyright notice, and let the federation become a consortium of emulator authors who agree on
how their machines talk, and nothing else.

## Cartridges, and one description of everything

A program on the menu is really a whole configuration: what to load and from where, how to build
it, its devices and their settings, the keyboard, the panels, the help and the demo. We call that
a **cartridge**, and everything the cabinet knows about a program is in its cartridge or referred
to by it. It can carry small pieces of code of its own, such as the SIGWINCH handler that finds
Forth's constant, and call emulator utilities written for that one program. This is deliberate:
the emulator adapts the running program to the person using it, and the person's input to the
program. The idea is borrowed. Richard Potter's
[Triggers](http://acypher.com/wwid/Chapters/17Triggers.html) (HCIL, 1991) read a Mac's screen
pixels to drive applications that offered no other way in, and gave MacDraw II a tool palette it
lacked. Morgan Dixon and James Fogarty's
[Prefab](https://web.archive.org/web/20131005022032/http://homes.cs.washington.edu/~mdixon/research/prefab/) recovered interface structure
from pixels alone and added target-aware pointing to programs whose source it never saw. Simon
Schneegans's [Kando](https://kando.menu/) lays pie menus over any desktop application, and Don's
[aQuery](https://web.archive.org/web/20180826132551/http://donhopkins.com/mediawiki/index.php/AQuery) selects accessibility trees the way
jQuery selects the DOM. Each one improves a program from outside without changing it. The cabinet
does the same for PDP-7 programs. Unlike those tools, it is the machine, so it reads core instead
of pixels. A URL is a cartridge plus profiles you can stack
(`/cabinet/forth/?profile=trace`), and an article embeds exactly the same thing.

## Live coding all the way down

Mitch builds his Forth with a Perl assembler, and compiles its prelude by running the kernel
under SIMH, with Python to drive it. We promised to lift that whole pipeline into the page. The
SIMH step already runs in the browser: the emulated paper tape reader feeds Forth its own source.
Next the assembler, so the page assembles `kernel.s` itself and gets source maps and a symbol
table. Then the trace steps through Mitch's source lines, and a LIVE CODING panel lets you edit,
build and run it.

The showcase is tiny-its, the first real application of that Forth, modeled on Mitch's Open
Firmware command line, key bindings and device tree. You can hack on it at three levels at once:
rebuild the whole system from its assembly and Forth; load changed Forth words into the image
that is running, without a rebuild; and look underneath, in octal, disassembly and source, while
it runs. Then you use tiny-its to live-code the mainframe, and tiny-its itself.

## Copies, with their provenance showing

When a program needs two ways of doing something, we make two copies of the file and give them
names that say how they differ, most general word first: `kernel.s` and `kernel-names-full.s`.
No conditional assembly. Each copy says in its first lines where it came from, and a
`VARIANTS.yml` beside them lists the family: parent, upstream commit, what differs, what must stay
in step. The history of the design is in the files, where people and programs read it, not buried
in git.

An LLM keeps the copies consistent. It reads the list, sees a change to one copy, and carries it
into the others, or says why it doesn't belong there. That makes several readable copies safer than
one file of switches, and every copy still builds with the original tools.

## Many hands on one machine

**Engelbart had two cursors on one screen in 1968.** In the Mother of All Demos, Bill Paxton in
Menlo Park and Engelbart in San Francisco each had a cursor on the same document. The cabinet
already has room for more than one pointer: its `IDPN` extension on device 11 says which of up to
eight light pens fired, and stock software never issues it, so nothing old is disturbed.

- **Several people in one PIXIE.** Several light pens, one per person, drawing in the same
  SYMELEC at once.
- **Two ways to share a machine.** One central simulation that everyone watches and pokes, or
  lockstep copies in every browser that agree cycle by cycle, because the emulator is
  deterministic and the pen's input is data.
- **Distributed graphics.** The 340's segment stream goes to every screen.
- **A cursor playground** with pointer capture, for trying multi-cursor ideas, pie menus and
  flick-to-fly, Mario-cannon navigation
  ([MediaGraph](../../repo-shows/ebike-safari/ebike-safari.md), 2010–13), before they go into
  PIXIE.

Alan Kay's picture of objects is cells that talk only by messages, each one a whole computer.
The cabinet applies it to whole computers, 1960s and 1970s ones, talking by messages on a bus,
with several people using them at once.

## For the museums

Everything here is free software, in git, and built to be taken apart. If you have a machine, we
would like the cabinet to be its twin: the same programs, the same disks, the same lamps and
sounds, for visitors while the hardware is switched off or being restored, and for checking a
tape before it is loaded on the hardware. [FOR-MUSEUMS.md](FOR-MUSEUMS.md) is our open letter to museums and enthusiasts,
and [UNIX-V0.md](UNIX-V0.md) has our letter to the Interim Computer Museum.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [tiny-titan](TINY-TITAN.md) · [tiny-its](TINY-ITS.md) · [AM radio](AM-RADIO.md)

# The cabinet manifesto

**We control the horizontal. We control the vertical.** The machine in the page is ours, all of
it at once: every register, every word of core, every device, and the host around them. Nothing
here is a black box we have to squint at through a keyhole. So when something would be better,
we make it better, from whichever side is closest. The 1960s machine stays honest. Everything
around it is ours to invent.

This page is the attitude. [DESIGN.md](DESIGN.md) is the plan, and [README.md](README.md) is what
runs today.

## Tribute, accessibility and fun beat realism

We bend the rules and depart from realism whenever that honours someone, lets more people in, or
makes it more fun. Realism is a way to reach those, not a goal of its own.

- **Tribute.** Listings say who assembled them, and the name goes to whoever wrote the code, even
  where the real machine had no logins. Heinz Lemke's `HL1470` is real. Mitch Bradley is `wmb`, as
  he always is, and his Forth says `wmb,claude`, in his lower case, because Claude wrote it with him.
  C. Stein's 1964 PDP-4 never asked for a user name, but the listing says `CSTEIN` anyway. DUEL's
  is `PETERSON,VINER`, because it had two authors, and HILO and LANDER say `A2DEH,CLAUDE`.
- **Accessibility.** The teletype wraps, scrolls, zooms, reads aloud and takes dictation. No KSR-33
  ever did.
- **Abstract people, real machines.** Heinz at the light pen, Mitch at his Forth, Ken and dmr at
  UNIX: retro Sims 1 characters animated by [VitaMoo](https://vitamoo.space), Don's open source
  TypeScript reimplementation of the Sims 1 animation system, at a photogrammetric PDP-7. This is
  Scott McCloud's masking effect from *Understanding Comics*: a simple character in a realistic
  scene is one you can identify with, and step into, while the scene stays real.
- **Fun.** HILO takes "ninety nine" by voice, and the bell rings when you rub out too far.

What stays honest is what makes it the machine: every instruction does what the PDP-7 did, and
old code runs unchanged. Where we depart, we say so, and the original is still one click away.

## Push the driver out into the host

A real PDP-7 program has to do everything itself, because the teletype is dumb. Ours doesn't. The
emulator and its teletype are software we wrote, so the driver can live out there, on the host's
side, where it is easy.

- **Duplex, line or raw input, key bindings** belong to the teletype, not the program. Each
  cartridge sets them: UNIX is half duplex with SIMH's UNIX key mapping, and Forth is full
  duplex because it echoes itself. ^S and ^Q can stop and start the machine. ^C can send the
  interrupt that UNIX calls ALT MODE.
- **SIGWINCH for a program that has never heard of it.** Mitch Bradley's Forth breaks the WORDS
  listing at 60 columns, from one constant, `dm60`. The assembler's symbol table tells the
  teletype where that constant is, so when the paper is resized, the teletype writes its width
  there. Forth breaks its lines at the right edge, and not one line of Mitch's code changed.
- **The program never has to know.** The teletype can be as comfortable as a modern terminal:
  scroll back, copy and paste, font sizes, a height you drag. A faithful KSR-33, with its sound and
  its paper, gets built separately, from video loops and 3D models. This one is for hacking.
- **Anyone can play.** A screen reader hears what the machine prints as soon as it pauses, the
  prompt included, and not the echo of what you just typed. The command line under the paper is
  a real text field, so dictation, phone keyboards and input methods all work, and 🎤 sends a
  spoken line. HILO, a teletype game from a machine with no screen, plays by ear and voice.

## Every machine can see every other machine

On real iron, a PDP-7 and a mainframe see each other through a wire. Here they share one process.
Two PDP-7s, an Apple ][ and a PDP-10 can run side by side on the
[tiny-titan](TINY-TITAN.md) bus:

- **messages** between them, and **interrupts on arrival**, after ITS's core links;
- **shared memory**, with locks tiny-titan manages;
- **tiny-titan as the switchboard**, the file server and cloud storage, and the gateway to the
  real internet.

And because they share a process, one can **read another's mind**. tiny-titan can walk PIXIE's
ring structures in the PDP-7's core while it runs, lift each pixie out into a file, and then
check that serialising it and loading it back gives the same rings. No PDP-7 program has to be
written or changed for that. It is a debugger, a file system and a network test at once, and it
exists because nothing here is sealed off from anything else.

## Cartridges, and one description of everything

A program on the menu is really a whole configuration: what to load and from where, how to build
it, its devices and their settings, the keyboard, the panels, the help and the demo. We call that
a **cartridge**, and everything the cabinet knows about a program is in its cartridge or referred
to by it. It can carry small pieces of code of its own, such as the SIGWINCH handler that finds
Forth's constant, and call emulator utilities written for that one program. No shame in that:
the emulator is on the program's side. A URL is a cartridge plus profiles you can stack
(`/cabinet/forth/?profile=trace`), and an article embeds exactly the same thing.

## Live coding all the way down

Mitch builds his Forth with a Perl assembler, and compiles its prelude by running the kernel
under SIMH, with Python to drive it. We promised to lift that whole pipeline into the page. The
SIMH step already runs in the browser: the emulated paper tape reader feeds Forth its own source.
Next the assembler, so the page assembles `kernel.s` itself and gets source maps and a symbol
table. Then the trace steps through Mitch's source lines, and a LIVE CODING panel lets you edit,
build and run it.

The showcase is tiny-its, the first real application of that Forth, modelled on Mitch's Open
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

The LLM is the coherence engine. It reads the list, sees a change to one copy, and carries it into
the others, or says why it doesn't belong there. That makes several readable copies safer than
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
  ([MediaGraph](../../repo-shows/ebike-safari/ebike-safari.md), 2011–14), before they go into
  PIXIE.

Alan Kay's picture of objects is cells that talk only by messages, each one a whole computer.
The cabinet takes it literally: whole computers, 1960s and 1970s ones, talking by messages on a
bus, with people's hands in among them.

## For the museums

Everything here is free software, in git, and built to be taken apart. If you have a machine, we
would like the cabinet to be its twin: the same programs, the same disks, the same lamps and
sounds, for visitors while the iron rests or is restored, and for checking a tape before it goes
near the iron. [UNIX-V0.md](UNIX-V0.md) has our letter to the Interim Computer Museum.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [tiny-titan](TINY-TITAN.md) · [tiny-its](TINY-ITS.md) · [AM radio](AM-RADIO.md)

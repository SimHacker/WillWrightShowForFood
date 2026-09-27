# tiny-its: a command language for people, LLMs and PDP-7s

tiny-its is a command-line navigator and editor for ring structures. What you edit is a
graph, and you walk it like a MUD. Around that it is the editor, debugger, controller,
assembler, disassembler, memory mapper, lock and device manager and remote job manager for a
room full of emulated machines ([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do) has what it
manages). This page designs the language you type at it: ergonomic, two-way,
self-documenting and discoverable. Three kinds of user type at it: people, an LLM, and
PDP-7 programs. It needs only a serial teletype line.

**A word on names.** RSP is the library, Wiseman and Hiles's Ring Structure Processor. A
ring structure built with it is a **pixie**, lower case: Heinz's own manual says the
representation "is also referred to as the PIXIE data structure"
([appendix 4](../../characters/heinz-lemke/sources/phd-thesis-1972/annotated/07-appendix-4-pixie-user-manual.md)).
PIXIE in capitals stays the name of his program. Live pixies travel between worlds. (Ask
Heinz if he minds.)

## Point, mark, and rooms

The editing model is Emacs's and the world model is a MUD's, which is MOOLLM's world view
("Directories are rooms. Files are things you can touch.") with rings in place of
directories:

- **Point** is the element you are standing on; **mark** is another you set. Between them,
  along a ring, is the region, to copy, kill or yank. The kill ring is, of course, a ring.
- **Rooms and exits.** An element is a room; its rings are its exits and its contents.
  `LOOK` shows where you are, `GO` follows a ring, `BACK` returns. Because an element can
  sit on many rings, one room can open onto many places at once, which a MUD's single
  containment tree cannot say.
- **Building,** in the spirit of LambdaMOO's `@dig`, `@create` and `@recycle`: `DIG` a new
  element linked from point, `LINK` point into a ring, `UNLINK` it, `MOVE` it from one ring
  to another, `DESTROY` it. Each is an RSP splice, done at a safe point, and each is undoable.
- **Atoms and blocks** are the things in a room: `EXAMINE` a value, `SET` it, read a
  printname.

The same commands walk anything that is a pixie: a PIXIE drawing, tiny-its's own command
tables and configs, a Forth program's data, and the magic segments below.

## Scripts: a turtle in a graph

A script walks a pixie network and acts where it goes, the way a Logo turtle walks the
plane and draws. The turtle is point: `GO` along a ring is `FORWARD`, choosing another ring
at this element is `TURN`, and reading and writing an element's properties (its atoms,
printnames and blocks, by name where the schema gives names) is what the pen does.

- **Written** as commands, in a file or a macro.
- **Demonstrated:** do it once by hand, and tiny-its turns the session log into a script,
  programming by demonstration in the line of Allen Cypher's *Watch What I Do*. You name
  the parts that should vary (this element, that VM) and they become parameters.
- **`SAVE-EXCURSION`** from Emacs: go off on a local jaunt, do something, hop back.
  Emacs's saves point and the current buffer; ours saves point, mark and the current VM,
  and restores them when the body finishes, even if it fails.

```
SAVE-EXCURSION
  GO (TO) NAME-LIST
  FIND (ELEMENT NAMED) "FERN"
  SET (PROPERTY) COLOUR (TO) 3
END
```

## The opposite of HACTRN, and still a hacker's tool

ITS's DDT was terse to the point of glyph soup: `$G`, `^Z`, `addr/`, and incantations you
learned from someone who already knew them. It was powerful, and you could not discover
it by using it. tiny-its goes the other way on discovery and keeps the power: every command
reachable by asking, and nothing HACTRN could do taken away.

The models are Mitch's Open Firmware, which already has most of this worked out
([below](#start-from-open-firmware)), and DEC's TOPS-20. HACTRN never used TOPS-20's
command parser, the `COMND` monitor call, but it has ideas worth stealing shamelessly:

- **`?` anywhere** lists what may come next, with a line of help each.
- **ESC completes** a keyword and types the **guide words**, the noise words in parentheses
  that make a command read as a sentence: `COPY (FROM) A (TO) B`.
- **Unique abbreviations** are accepted, and full words always are.
- **Defaults** fill fields you leave out, and destructive commands ask to confirm.
- **Line editing** is the teletype's: DELETE rubs out a character, `^W` a word, `^U` the
  line, `^R` retypes it.
- **It is table-driven.** `COMND` parsed field by field from chained descriptor blocks: a
  keyword table, a number, a file name, with alternatives. Commands were data. That is the
  property that lets tiny-its live on a PDP-7 and grow new commands without new code.

A session sketch (guide words in parentheses are what ESC would have typed; typing them is
optional):

```
tiny-its> WHO
  PIXIE   symelec    running  pc 02125 WAITLK   maps RINGS rw
  FORTH   pdp7forth  running  pc 00042
tiny-its> EXAMINE (MEMORY OF) PIXIE (AT) FLST (FOR) 4
  PIXIE FLST    02253/ 000000
  PIXIE FLST+1  02254/ 202233  LAC OP+1
  ...
tiny-its> MAP (SEGMENT) RINGS (INTO) FORTH (AT) 12000 READ-ONLY
tiny-its> LOCK (SEGMENT) RINGS (HELD IN) PIXIE SETUP (THROUGH) GARB2
tiny-its> SEND (TO) PIXIE (TELETYPE) "TITAN"
tiny-its> ASSEMBLE (INTO) FORTH (AT) 7000
  07000/ 212011  lac 12011
  07001/ 047100  dac 7100
  .
tiny-its> EDIT (SOURCE OF) PIXIE FLST
  [opened in the cabinet's source view]
```

**Still a hacker's tool.** HACTRN syntax works as a second vocabulary (`FLST/` opens a word
the way `EXAMINE` does) for anyone whose fingers know it. Numbers are octal unless marked,
addresses are expressions over the VM's symbols (`FLST+3`, `OP 6`), and `ASSEMBLE` takes
assembly source line by line, echoing each as a listing line, until a line holding only `.`
(the `ed` convention).

## Editing is the IDE's job

tiny-its does not edit text. The emulator's interface is the IDE: it has the source view,
the octal view, the disassembler and the symbol dropdown already, and it gets a graph
editor (below). `EDIT` asks the IDE to open a source, a ring or a config at a name; the IDE
sends the result back as an ordinary command (`ASSEMBLE`, `DEPOSIT`, `LOAD`). So no Emacs in
PDP-7 assembly or in Forth. Yet.

## Friendly to an LLM on purpose

An LLM typing at the console is a user like any other, with its own login and rights, and
the language suits it for the same reasons it suits a newcomer:

- **Full words always work,** so it never needs ESC or abbreviations.
- **One grammar, discoverable:** `?` and `HELP verb`, with examples, from the same tables
  the parser runs on, so the help cannot drift from the behaviour.
- **Errors say what was expected** and list the alternatives, at the field that failed.
- **Structured replies on request:** `SET OUTPUT YAML` makes every reply parseable.
- **Look before leaping:** `EXPLAIN` shows what a command would do without doing it, and
  writes to memory can be snapshotted first so `UNDO` puts them back.
- **Everything is logged** in the session log, so any run replays exactly.
- **Rights and limits** are the tiny-its rule: writes only to machines the user owns or
  was invited to, and rate limits for everyone.

## Commands are data: ring structures

The command table is a ring structure, so the parser is a table walker small enough for a
PDP-7 and commands are added by adding data:

- a **verb** is an element: its printname, a line of help, and a ring of fields;
- a **field** is an element: its type (keyword, octal number, address expression, VM,
  segment, file, string, rest of line, assembly line), its guide words, a default, help,
  and a ring of alternatives;
- an **action** is one of: a built-in routine (a block holding its address), a **macro**
  (a ring of commands with parameters), or a **message** (a destination and a ring to
  send).

The host implementation reads the same table from its text form, YAML or the flat address
table in [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module). So a
command defined on the PDP-7 and one defined in a YAML file are the same thing.

## Macros, handlers, nodes, users

- **Macros:** `DEFINE (MACRO) name` takes a sequence of commands with parameters.
- **Handlers:** `ON (MESSAGE) name (FROM) node (DO) macro`, and likewise `ON (EVENT) pen`,
  `ON (HALT)`, `ON (LOCK WAIT)`. A handler is a macro bound to a message name, the handler
  list from [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module).
- **Many tiny-its:** each deployment runs its own, and they talk. A name can carry its
  node (`EXAMINE CAMBRIDGE:PIXIE FLST`), and a command can be sent to another tiny-its to
  run there, with its reply routed back. Programming happens at that level too: a macro on
  one node calling handlers on another.
- **tiny-titan serves the files:** switchboard and file server, holding ring files, tapes,
  snapshots, session logs, scripts and configs.
- **Users:** each deployment has its own user, a login script (TOPS-20's `LOGIN.CMD`, by
  another name), its configuration of VMs, segments, maps and locks, and its macros and
  handlers. All of it is data in the filestore, as rings and as text.

## Teletype links and pipes

The emulator can wire one VM's teletype output to another's input, and tiny-its manages
the wires: `LINK (TELETYPE OF) FORTH (TO) PIXIE`, `UNLINK`, `LINKS`, and a pipe line,
`PIPE FORTH | PIXIE | LOG`. No program changes; each still thinks it has a KSR-33.

- **Back-pressure for free.** A character leaves A only when B has taken the last one: the
  emulator holds A's printer flag until B's program reads its keyboard. A's program
  already waits on that flag, so nothing is lost and nothing needs flow control.
- **Translation per link,** such as Unix's CR to NL (SIMH's `set tti unix`).
- **Tee and merge:** one output to many inputs, many outputs into one, with the source
  kept in the session log.
- **Ends that aren't VMs:** a filestore file (the punch, capturing), a file played in (the
  reader, typing a tape in, as an ASR-33 did), a person's console, an LLM, or a tiny-its
  macro as a filter stage.
- **Loops** (A to B and B to A is a null modem) are allowed; tiny-its rate-limits them so a
  pair echoing each other can't run away.

PDP-7 Unix never had pipes; Unix got them in 1973, on the PDP-11. These are pipes between
machines, on the PDP-7.

## Written in Forth

Of course. A command line is what Forth's outer interpreter already is: read a line, parse
a word, find it, run it. Mitch's kernel builds that loop from exposed parts (`(QUERY)`,
`(PARSE)`, `(FIND)`, `(NUMBER)`, `(OK)`, `(ERR)`), so tiny-its builds its own loop from the
same parts and runs on a PDP-7 VM with a teletype.

- **Guide words are comments already.** `(` starts a comment in Forth, so
  `MAP ( SEGMENT ) RINGS ( INTO ) FORTH` reads as `MAP RINGS FORTH`. `(` is a word and
  needs its space, so either ESC types `( INTO )` with spaces, or the parser skips any
  token in parentheses.
- **Verb first, TOPS-20 order.** Forth is postfix, but parsing words read ahead in the line
  the way `:` and `'` do, so `EXAMINE` is a word that parses its own fields. Each field
  type is a parsing word: a VM, an address expression, a segment, an octal number.
- **Macros are colon definitions,** and handlers are words bound to message names; `ON`
  stores the word in the handler ring.
- **`?` and ESC need a new line reader.** The kernel's `accept` handles CR, ^D, rubout and
  backspace; tiny-its's also catches `?`, ESC, ^W, ^U and ^R and asks the command table
  what fits.
- **Full names and help live in RSP rings.** Mitch's headers keep a length and the first
  three characters, which can't tell `EXAMINE` from `EXAMPLE`. So the ring command table
  holds full names, help, guide words and the word to run: Forth runs, rings describe.
- **Forth underneath, for hacking.** Anything that isn't a tiny-its command falls through
  to Forth. Newcomers and LLMs stay in the commands; hackers drop a level.
- **Host services by message.** Other VMs' memory, maps, locks, files: tiny-its asks
  tiny-titan over the link or a mailbox. So a PDP-7 manages the machines and the mainframe
  is its peripheral, the inversion tiny-titan started.
- **Room:** the kernel leaves about 5,150 words of 8K for definitions. The command tables
  can sit in a shared segment that every tiny-its reads.

A TypeScript tiny-its stays, reading the same ring tables, for bootstrapping and for
deployments with no Forth VM.

## Two parents: HACTRN and Open Firmware

tiny-its is a cross of two command lines. From **HACTRN**: jobs, and every machine open to
examine, patch and continue, other people's included. From **Open Firmware**, Mitch
Bradley's IEEE 1275 firmware, built at Sun and then Firmworks (local clone
`~/GroundUp/git/OpenFirmware`): Forth as the command language, and a tree you walk. Its
`dev`, `pwd`, `ls`, `show-devs`, `.properties` and `select-dev` are in
`ofw/core/ofwcore.fth`, and `see` decompiles any word (`forth/lib/decomp.fth`). And FCode:
a plug-in card carried its own driver as tokenized Forth, so the firmware learned about the
hardware from the hardware.

| Open Firmware | tiny-its |
|---|---|
| device tree, `dev`, `ls`, `pwd` | a tree of nodes, VMs, their devices and segments: `dev /cambridge/pixie/340` |
| `.properties` | a VM's program, config, maps and locks |
| FCode, drivers carried by the card | VMs describe themselves on boot: symbol table, source map, their own commands |
| `see` | disassemble PDP-7 code, decompile Forth words |
| client interface, an OS calling firmware | programs on VMs calling tiny-its and tiny-titan services by message |

TOPS-20's manners go on top. And the Forth it runs on is Mitch's too.

## Start from Open Firmware

Open Firmware already has a command line built this way, in Forth, in files small enough
to read in an afternoon (paths in `~/GroundUp/git/OpenFirmware/forth/lib/`):

- **Key bindings are words.** In `editcmd.fth`, the line editor turns a typed key into a
  name (`^f`, `esc-f`, `esc-[A` for an arrow) and looks it up in the `keys-forth`
  vocabulary; `do-command` runs what it finds. ESC is a prefix that builds `esc-` names.
  Rebinding a key is defining a word. Emacs keys come by default, with history.
- **Completion "a la TENEX",** Mitch's own words in `cmdcpl.fth` (TENEX was TOPS-20's
  parent). TAB extends the word as far as every candidate agrees and adds a space when
  one is left; TAB twice, or `^_` (control-question-mark), lists the candidates. They
  come from the vocabularies in the current search order, so a vocabulary is a command
  context. `fcmdcpl.fth` binds it to the editor in 50 lines.
- **`sift`** (`sift.fth`) lists every word containing a string, an apropos.
- **Commands parse the rest of the line** (`optional-arg$` in `util.fth`,
  `optional-arg-or-/$` in `ofwcore.fth`), and come in pairs: `show-devs` for typing,
  `$show-devs` taking a string on the stack for programs. The plain word is the command
  line; the `$` word is the API. That pairing is what an LLM and a PDP-7 program need.
- **`see`** decompiles, and there are `words`, `dump`, `patch`, breakpoints
  (`breakpt.fth`) and a debugger (`debug.fth`).

**What TOPS-20 adds.** Open Firmware completes over whole vocabularies; `COMND` knew what
kind of field came next and completed from that. So:

- **Completion per field:** after `EXAMINE`, complete VM names from `who`; after a VM,
  its symbols; after `MAP`, segment names. The command's field descriptor supplies the
  candidates, and the dictionary is the default. In Open Firmware terms, one more
  `defer` in `find-candidates`.
- **Help per field:** `?` prints each candidate with its line of help, not just its name.
- **Guide words, defaults, and confirmation** for destructive commands.

**For the PDP-7.** Mitch's PDP-7 Forth is much smaller: no `defer`, no vocabularies, and
headers that keep three characters of each name. `defer` is a few lines. Instead of
vocabularies, keymaps and command contexts can be RSP rings of full names, help and the
word to run, which is the ring command table above: the same design, with rings where
Open Firmware has wordlists. Porting `editcmd.fth` and `cmdcpl.fth` is the first step,
and Mitch is the person to ask how he'd do it.

## Magic segments and pixie space

NeWS had magic dictionaries: a canvas or a process looked like an ordinary PostScript
dictionary, and reading or writing its keys reached into the server. Linux has `/proc`.
The cabinet can have **magic segments**: memory the emulator backs itself, mapped into a
VM like any segment, holding pixies that describe the VM and its world. No other VM is
needed.

- **Reading** walks live state as rings: the VM's devices, its segments and locks, its
  symbol table, `who`, the message queue.
- **Writing** acts: splice an element into the "stop" ring, change a lock's section, post
  a message. Write-watch tags in [shadow memory](DESIGN.md#the-application-layer--packagespixie-separate-module)
  tell the emulator which word changed, and it acts at the next safe point.
- **Rings need stable addresses,** so the emulator rewrites the segment at safe points or
  when the VM rings a doorbell word, not on every read.
- **Tunnels:** an element can stand for another VM, and walking into it walks that VM's
  magic segment, with the tiny-its rights rule deciding what you may see and touch.

That makes a **pixie space**: Linda's tuple space, with pixies instead of tuples. `OUT`
puts a pixie into a shared segment, `RD` finds one that matches a template pixie, `IN`
finds one and takes it, waiting at a lock until one arrives. Across VMs, across nodes,
between worlds.

## Deploying: docker-compose with a command line

A deployment is a compose file, and tiny-its is its command line and script runner. A VM
comes with whatever devices it needs and no others: a display or none, a pen, a teletype,
a paper tape reader, the link, a disk.

```yaml
vms:
  pixie:   { program: symelec,   devices: [340, lightpen, teletype, link] }
  forth:   { program: pdp7forth, devices: [teletype, papertape] }
  viewer:  { program: pdp7forth, devices: [340, lightpen] }
  its:     { program: tiny-its,  devices: [teletype, link] }
links:
  - { from: forth.teletype, to: pixie.teletype }
```

Plus the segments, maps and locks from
[DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module), and the
scripts and handlers above. `UP` and `DOWN` start and stop the lot; `WHO` is `ps`.

**Hot mounting.** `MOUNT (DEVICE) 340 (ON) FORTH` plugs a device into a running VM, and
`UNMOUNT` pulls it, onto other VMs or onto tiny-its's own. A device is a plugin on the
backplane at its device codes, and PDP-7 programs poll device flags, so mounting one a
program never asks about is harmless. Pulling one it uses is pulling a card: its skips stop
skipping. tiny-its can mount a 340 on itself to draw the pixie network around point while
you walk it.

## Why not make every document a graph?

Frontier leaned into trees: UserLand's object database and scripts were outlines, and that
made a whole system out of one data shape. PIXIE's rings go one step further. An element
can sit on many rings at once, so sharing, cycles and many-to-many links are first-class,
where a tree (an outline, JSON, XML) has to fake them with IDs. So:

- tiny-its's command tables, macros, handlers, configs and scripts are rings;
- PIXIE's drawings are rings;
- a Forth or Lisp program's data are rings;
- and the IDE edits all of them the same way: as a graph, drawn, or as round-trippable text
  (the lossless address table, or the sexpr and YAML projections with labels for sharing).

Code as data, the way Lisp has it, but a graph, not a tree.

## To decide

- The verb list for a first cut (`WHO`, `BOOT`, `STOP`, `CONTINUE`, `RESET`, `EXAMINE`,
  `DEPOSIT`, `DISASSEMBLE`, `ASSEMBLE`, `DUMP`, `LOAD`, `MAP`, `UNMAP`, `LOCK`, `UNLOCK`,
  `SEND`, `DEFINE`, `ON`, `HELP`, `EXPLAIN`, `UNDO`, `EDIT`, `SET`), and the field types.
- The ring layout of a verb and a field, so the PDP-7 walker and the host agree.
- Mitch's Forth first ([above](#written-in-forth)), and whether its line reader and parse
  loop can be replaced from Forth or need kernel changes.
- Checks against sources: the `COMND` details against the TOPS-20 Monitor Calls manual,
  and every ITS command named here against the ITS DDT documentation.
- With Mitch: port Open Firmware's line editor and TENEX completion to the PDP-7 Forth,
  and whether per-field completion belongs in Open Firmware too.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TINY-TITAN](TINY-TITAN.md)

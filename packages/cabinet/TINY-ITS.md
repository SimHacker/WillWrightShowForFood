# tiny-its: a command language for people, LLMs and PDP-7s

tiny-its is the command line for a room full of emulated machines: it lists, boots, stops,
examines, patches, maps and locks them, and sends messages between them
([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do) has what it manages). This page designs
the language you type at it. Three kinds of user type at it: people, an LLM, and PDP-7
programs. It needs only a teletype.

## The opposite of HACTRN, and still a hacker's tool

ITS's DDT was terse to the point of glyph soup: `$G`, `^Z`, `addr/`, and incantations you
learned from someone who already knew them. It was powerful, and you could not discover
it by using it. tiny-its goes the other way on discovery and keeps the power: every command
reachable by asking, and nothing HACTRN could do taken away.

The model is DEC's, not MIT's. HACTRN never used it, but TOPS-20's command parser, the
`COMND` monitor call, is the best teletype command line anyone built, and we steal it
shamelessly:

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

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TINY-TITAN](TINY-TITAN.md)

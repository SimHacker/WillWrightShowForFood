# Dasher, completion and help at the teletype

The teletype should offer [Dasher](https://en.wikipedia.org/wiki/Dasher_(software))-style text
entry, steered by the grammar of whatever program is running on the machine.

Dasher, from David MacKay's Inference Group at Cambridge (1998 on), lays every possible
continuation of what you've typed along a column of boxes, each as tall as it is likely, and you
write by steering into them: with a mouse, a finger, your eyes, your head, or one switch. Likely
text is big and easy to hit; unlikely text is still there, only smaller. Its quality depends
entirely on its language model.

## The program is the language model

A PDP-7 program's command language is small and exact, and the cabinet can read it out of the
running machine:

| Program | What can come next | Where the cabinet gets it |
|---|---|---|
| Mitch's Forth | words in the dictionary, numbers in the current base, a word's name after `:` | the dictionary, read from core: every header, name and link, as `WORDS` sees them; `BASE` from its variable |
| SYMELEC / PIXIE | `LABEL`, `UNLABEL`, `TITAN`, `GRID`, `START`, and their arguments | the command table hashed in `MESIN`, and the ring names in core |
| UNIX v0 | commands in `/bin`, file names in the current directory | the emulated file system |
| ITS Logo, DDT | primitives, defined procedures, symbols | the running Logo's procedure table; DDT's symbol table |
| tiny-its | its commands and device tree | its own tables |
| Applesoft BASIC on an Apple ][ | keywords, line numbers, subroutines, variables | the tokenized program and variable table in the Apple's memory (below) |

So the boxes offer only what the program would accept, and grow or shrink as the program changes:
define a word in Forth and it appears in the next column. Probabilities come from three places,
mixed: the grammar (what's legal here), the session's own history (what you just did), and the
program's sources and transcripts (what people usually type to it). A language model can rank
within the grammar's choices, but never adds a choice the grammar doesn't allow.

## Completion and help: BASIC on the Apple ][

The same grammar drives a second mode for people who type: Copilot-style tab completion and help
over the language and the program in memory.

An Applesoft program sits in the Apple's memory tokenized, starting at the address in zero page
`$67-$68` (TXTTAB, usually `$0801`). Each line is a two-byte pointer to the next line, a two-byte
line number, the line's bytes with every keyword as one token from `$80` (`END`) up, and a zero; a
zero pointer ends the program. The simple variables start at `$69-$6A` (VARTAB) and the arrays at
`$6B-$6C` (ARYTAB), each with its two-character name. So the teletype can read, at every prompt:

- **Keywords**, from the token table, with a line of help for each from the Applesoft manual.
- **Line numbers with names.** By convention a subroutine starts with a `REM` (token `$B2`):
  `1000 REM DRAW SHIP`. After `GOSUB` (`$B0`) or `GOTO` (`$AB`), Tab offers the program's line
  numbers labelled by those comments (`1000 DRAW SHIP`), and the lines that are actually `GOSUB`
  targets first. Help on a number shows the line and its callers.
- **Variables**, from the variable table, with their current values, and array names with their
  dimensions.
- **What the program does next**: completions ranked by the program's own text (what usually
  follows `HCOLOR=` in this program) and by the session's history; a language model may suggest a
  whole line, but only from what the grammar accepts, and the line goes in only when you press Tab.

The Apple can be the cabinet's own, or microM8, through its debug WebSocket's `memory` command or
its MCP `read_memory` and `applesoft_read` ([MICROM8.md](MICROM8.md)). microM8 also has its own
Applesoft rewritten in Go, which may not keep a tokenized program in emulated memory; for that one,
`read_interpreter_code` gives the source.
Integer BASIC and Logo get their own readers, declared like any other type of memory.

## Why only an emulator can do this

A program running on real hardware can't be asked what it would accept next without being changed.
The cabinet reads core, so it can walk Forth's dictionary or PIXIE's command table while the
program waits for input, and the program never knows. This is the manifesto's "push the driver out
into the host" applied to input, the same move as the SIGWINCH constant written into Forth from
outside ([MANIFESTO](MANIFESTO.md#push-the-driver-out-into-the-host)).

## How it fits the teletype

- Dasher is one more way into the command line under the paper, beside the keyboard, dictation and
  phone keyboards. What it writes is typed into the teletype as keystrokes; the program sees
  ordinary input.
- The grammar for each program is part of its cartridge: where its dictionary or command table is,
  how to walk it, and how to tokenize what it accepts. The typed-memory declarations
  ([DESIGN.md](DESIGN.md#typed-memory-core-as-typed-blocks)) supply the walking.
- Pointers: mouse, touch, eye gaze through the browser's camera, one switch (Dasher's button mode),
  and the hand tracker and glove ([TRACKING.md](TRACKING.md)).
- The same grammar drives completion, pie menus of what can come next, and spoken input.

## Order of work

1. A Dasher canvas under the teletype, fed by a plain character model, writing keystrokes.
2. Forth's dictionary as the model: read the headers from core each time the prompt appears.
3. Session history and source frequencies mixed in.
4. Grammars for SYMELEC, UNIX v0 and tiny-its, carried in their cartridges.
5. Applesoft: the token table, line numbers named by `REM`s, the variable table; Tab completion
   and help, first on microM8 through its debug WebSocket.
6. One-switch and gaze steering, tested with people who use them.

↑ [README](README.md) · [MANIFESTO](MANIFESTO.md) · [DESIGN](DESIGN.md)

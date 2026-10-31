# @wwsff/tiny-teco

**TinyTeco** — a TECO that can grow. The first dialect is an **ITS subset**
aimed at Marvin Minsky's 11 March 1981 `*BBOARD` Universal Turing Machine.

This is not a complete TECO. Unknown opcodes throw `UnimplementedCommandError`
with the byte and `pc`. That is the extension point: register a `Command` on
the `CommandTable`.

```ts
import { CommandTable, TinyTeco, createTinyTeco } from "@wwsff/tiny-teco";
table.register({
  name: "your-command",
  codes: [0x7a],
  execute(ctx: TinyTeco) { /* … */ return "ok"; },
});
```

## Run

```
pnpm --filter @wwsff/tiny-teco test
pnpm --filter @wwsff/tiny-teco cli ../../characters/marvin-minsky/sources/teco-utm/minsky-utm.teco
```

Raw program (control bytes intact):
[`../../characters/marvin-minsky/sources/teco-utm/minsky-utm.teco`](../../characters/marvin-minsky/sources/teco-utm/minsky-utm.teco)

Why a subset first: [`../../characters/marvin-minsky/sources/teco-utm/teco-in-javascript.md`](../../characters/marvin-minsky/sources/teco-utm/teco-in-javascript.md)

Full ITS TECO is not this package yet. The MIDAS is parked as a
reference; the runbook is [`FULL-ITS-TECO.md`](FULL-ITS-TECO.md).
`TECO.MID` (ITS `_TECO_; TECO 1213`) and TECORD 1132 live in
[`reference/its/`](reference/its/SOURCES.yml).

## The trick Marvin already played

TinyTeco's method — implement only the commands one corpus uses, throw on
everything else, let the complaint name the next command — is the same
trick Minsky's program plays one level down, with a corpus of exactly
**one** program. His TECO animates one state table. Because the table he
chose is the 7-state 4-symbol universal machine from
[AI Memo 33](../../characters/marvin-minsky/sources/papers/AIM-033-universality-tag-systems-utm-1962.md),
every other Turing machine arrives as *data on the tape*, never as a
feature request against the interpreter. Implementing one universal
machine implements them all, so here one program was enough.

His simulator is table-driven, so it runs any TM description, not only
the universal one. Hard-wiring the seven states would have computed the
same class of functions.

**Universality covers computation, not input and output.** Nothing on the
UTM's tape can type at a terminal or read a keyboard, so commands that
touch the world have to be in the emulator. That is why growing TinyTeco
toward RMAIL and EMACS is real work.

Minsky implemented one machine and got all machines. TinyTeco implements
one program's commands and grows, one complaint at a time, to as much of
TECO as its programs use. The [cabinet](../cabinet/README.md#how-the-cabinet-grows-one-program-at-a-time)
started the same way from SYMELEC's listing; it now has the whole PDP-7
instruction set and adds devices as programs need them.

**Stretch goal, off every critical path: TinyTeco as a cabinet.** The
[cabinet backplane](../cabinet/)'s CPU contract is just `step()`, words,
and IOTs — it never asks what a CPU is made of. So a `Cpu` plugin whose
`step()` is "one Turing machine transition, computed by TinyTeco running
Minsky's UTM macro" is a legal citizen: the cabinet's instruction set is
the TM's quintuples, the microcode is TECO, the micro-microcode is
TypeScript. The bridge that makes it more than a curiosity is a tape
convention — which cell ranges are core and which are the device window —
so programs on the tape can issue IOTs and light the same console lamps
the PDP-7 does. Because the UTM is itself a TM, its own description can
go on the tape, so the UTM can run itself running another machine, each
level much slower than the one below it.

## What this subset does

Insert, search, iterate, `;`, `"E…'`, point (`J`/`C`/`D`), type (`HT`/`=`),
kill (`HK`), Q-registers (`U`/`Q`/`X`/`L`/`M`/`:I`), ITS `^^` (byte `0x1E`),
`nA` as ASCII-of-character, `M` + ESC as Q-register name indirection.

Whitespace, Unix LF, and Bawden evacuated CR (`0xEE`) are no-ops in command
mode so the recovered mail can be fed in raw.

## Credits

- Dan Murphy, TECO (1962)
- ITS TECO, MIT AI Lab — the dialect of the mail
- Marvin Minsky, the 1981 program
- Harold Ancell, who returned the mail in 2015
- Christopher Cherniak, TM* / PCOMP — the classroom simulator this work
  sits next to. The disk credits the University of Maryland CogSci
  Instructional Software Project; the student programmers are not named.
  Recovered and converted: [`../turing/PCOMP.md`](../turing/PCOMP.md).

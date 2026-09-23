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
feature request against the interpreter. Implement one machine; pick it
universal; you have implemented them all. It is the only rung of this
ladder where the method provably terminates — after the first entry.

(The honest wrinkle: his simulator is table-driven, so it happens to run
any TM description; the generality came free with the representation.
Hard-wiring the seven states would have bought the same class.)

The limit that keeps this package employed: **universality buys behavior,
not interface.** Nothing on the UTM's tape can type at a terminal or read
a keyboard, so the commands that touch the world stay in the emulator
forever. That is why growing TinyTeco toward RMAIL and EMACS is real work
rather than an exercise the 1981 mail already finished.

Same bet at three scales: Minsky implemented one machine and got all
machines. TinyTeco implements one program's commands and gets, complaint
by complaint, as much of TECO as its corpus ever exercises. The
[cabinet](../cabinet/) implements one listing's instructions and gets the
PDP-7 that PIXIE needs.

**Stretch goal, off every critical path: TinyTeco as a cabinet.** The
[cabinet backplane](../cabinet/)'s CPU contract is just `step()`, words,
and IOTs — it never asks what a CPU is made of. So a `Cpu` plugin whose
`step()` is "one Turing machine transition, computed by TinyTeco running
Minsky's UTM macro" is a legal citizen: the cabinet's instruction set is
the TM's quintuples, the microcode is TECO, the micro-microcode is
TypeScript. The bridge that makes it more than a curiosity is a tape
convention — which cell ranges are core and which are the device window —
so programs on the tape can issue IOTs and light the same console lamps
the PDP-7 does. And because the UTM is itself a TM, its own description
can go on the tape: the tower of an emulator emulating itself emulating
something else, each level paying the exponential toll, runnable in a
browser tab. Universality as a party trick you can actually invoke.

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

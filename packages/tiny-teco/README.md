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
  sits next to. Don remembers **Velu Sinha** (B.S. Physics, University of
  Maryland) working on that MS-DOS program. Confirm with Cherniak / Velu.

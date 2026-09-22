# Can we run the raw TECO in a browser?

No JavaScript ITS TECO exists that we have found. The file to feed one
is [`minsky-utm.teco`](minsky-utm.teco) — 318 bytes pulled out of the
1981-03-11 mail, control characters left as bytes.

## What already exists (none of it is “ITS TECO in JS”)

| Thing | What it is | Will it run this file? |
|-------|------------|------------------------|
| [apontador/teco-js](https://github.com/apontador/teco-js) | Unrelated AMD widget kit named “teco” | No |
| [teco.el](https://github.com/mtk/teco) (Dale Worley) | TECO interpreter in Emacs Lisp | Maybe a dialect subset; not in the browser |
| [pkoning2/pyteco](https://github.com/pkoning2/pyteco) | “Nearly complete” *standard* TECO in Python | Unlikely — this program is ITS TECO |
| [blakemcbride/TECOC](https://github.com/blakemcbride/TECOC) / [TECO-64](https://github.com/fpjohnston/TECO-64) | Portable C, DEC/TECO-C lineage | Same dialect problem; WASM is possible, ITS is not |
| [paulnank/pdp10-js](https://github.com/paulnank/pdp10-js) | KI10 in the browser, TOPS-10 | Has a TECO, not ITS TECO |
| [SAILDART j5](https://www.saildart.org/j5/) | WAITS in JS, includes TECO | WAITS TECO, not ITS |
| [PDP-10/its](https://github.com/pdp-10/its) + SIMH/KLH10 | Real ITS, real `TECO` | Yes, locally. Not a JS engine. |
| [`simulator.html`](simulator.html) | Steps the *compiled TM* | Runs the machine, not the TECO |

Ancell’s note on the 2015 dump: this is ITS TECO, “by far the most
powerful version.” `M^]Q` (Q-register name substitution), `nA` as
ASCII-of-character, and `^^` are the tells. A DEC-lineage TECO will
parse this file and do the wrong thing, or error.

## Two ways to get the raw bytes to run

**Subset engine (started).** `@wwsff/teco` is a TypeScript command
table, not a one-off player. The ITS subset (insert, search, iterate,
`;`, `"E`, `J`/`C`/`D`, `HT`/`=`, `HK`, Q-registers, `^^` / `1A` /
`M`+ESC) is registered first so the 318-byte mail can be fed in raw.
Unknown opcodes throw with `pc` — that is how it grows into a TECO.
[`packages/teco/`](../../../../packages/teco/README.md).

**Full ITS TECO.** The source is `TECO.MID` (MIDAS), the environment
is ITS. Nobody has rewritten that in JavaScript. The honest port is
either compile nothing and boot ITS under SIMH, or wait for someone
to put ITS on a JS PDP-10 the way SAILDART did for WAITS. That is a
project, not a weekend.

Compiling TECOC to WASM is the tempting middle path and the wrong
dialect.

## The 318-byte file

Extracted from [`minsky-TECO-turing-machine.txt`](minsky-TECO-turing-machine.txt);
the mail around it is untouched.

| byte | count | meaning |
|------|------:|---------|
| `0x1b` ESC | 15 | TECO command terminator (`^[`) |
| `0x1e` | 5 | TECO `^^` (ASCII of next character) |
| `0xee` | 1 | Bawden evacuated standalone CR (octal 356) |
| `0x0a` | 5 | Unix LF — wrapping the recovered mail acquired, not ITS |

Hex listing: [`minsky-utm.teco.hex`](minsky-utm.teco.hex).
Human listing with `$` for ESC: [`minsky-utm.teco.txt`](minsky-utm.teco.txt).

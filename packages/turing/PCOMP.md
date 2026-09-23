# PCOMP in YAML Jazz

Christopher Cherniak's course disk (UMD Philosophy, v2.0 1990), converted.
The disk itself, verbatim, with dates and hashes:
[`characters/christopher-cherniak/sources/pcomp/`](../../characters/christopher-cherniak/sources/pcomp/README.md).

```sh
python3 packages/turing/scripts/pcomp.py convert        # disk -> YAML (overwrites pcomp-*.yml)
python3 packages/turing/scripts/pcomp.py verify         # ~5 s, includes 11.8M-step BB5
python3 packages/turing/scripts/pcomp.py verify --fast  # skip the BB5 runs
```

`verify` steps the YAML, not the disk files, so it tests the conversion as well
as the machines. It has no dependencies beyond PyYAML.

## What is here

| Dir | Files | From |
|-----|-------|------|
| [`machines/`](machines/) | `pcomp-add`, `-busy2`, `-busy5`, `-bb5`, `-bcount`, `-equals`, `-equals-patched`, `-square`, `-utm` | the eight `.TM` files |
| [`tapes/`](tapes/) | 14 `pcomp-*.yml` tapes with `expect:` | the four `.INP` files, and each machine's own PURPOSE/EXAMPLE comments |
| [`ram/`](ram/) | 7 `pcomp-ram-*.yml` with `runs:` | the seven `.RAM` files |
| [`abacus/`](abacus/) | 8 `pcomp-ab-*.yml` with `runs:` | the eight `.AB` files |

Every comment in those files is Cherniak's, verbatim, including his bracket
diagrams (`---|`, `|--INITIAL SETUP`). TM\* has no comment syntax of its own:
comments are a column in the state table, and whole-program notes sit on rows
of an unused state number (`6  - A 5-state Busy-Beaver is...`). The converter
puts those notes at the top of the YAML and keeps in-state notes in place.

## Mapping TM\* onto the schema

| TM\* | YAML |
|------|------|
| state `n` (1–99) | `qn` |
| state 0, HALT | `halt: [q0]` |
| `?` as INP: any symbol not listed in this state | door keyed `"?"`, with `wildcard: "?"` on the machine |
| `?` as OUT: leave the cell | `write: "?"` |
| no row for the scanned symbol: `ERROR:state ...` | `missing: error` |
| tape −5000..5000, `ERROR:scanhead is too far to the right on tape` | `bounds: [-5000, 5000]` |
| `.INP` tape, `^` before the head cell | `cells`, `origin: 0`, `head` |

## Verified

Every number the disk states about its own machines comes out exactly:

| Tape | Disk says | Stepped |
|------|-----------|---------|
| `pcomp-busy2-blank` | 6 steps, 4 ones | 6, 4 |
| `pcomp-busy5-blank` | 2,133,492 steps, 1915 ones | 2,133,492, 1,915 |
| `pcomp-bb5-offset` | 11,798,826 steps, 4,098 ones, start near −2000 | 11,798,826, 4,098 |
| `pcomp-bb5-at-zero` | (why start at −2000) | head passes +5000 at step 6,503,981: TM\* error |
| `pcomp-square-3` | 3² = 9 | 9 ones, 155 steps |
| `pcomp-utm-add` | UTM runs ADD | 3,095 UTM steps = 5 pseudo-TM steps, same pseudo-tape |
| `pcomp-utm-busy2` | UTM runs BUSY2 | 2,931 UTM steps = 6 pseudo-TM steps, 4 ones |

`BB5.TM` is not the 47,176,870-step 5-state champion; it prints the same 4,098
ones in a quarter of the steps. Its comment: devised by Heiner Marxen's program,
reported to Allen Brady, passed to A. K. Dewdney, "who announced a related
machine in Dec 1989 SCIENTIFIC AMERICAN."

The UTM cross-check decodes the pseudo-TM from the tape (quintuples
`CST INP NST OUT MOV`, a missing quintuple halts, as in Minsky), steps it
directly, and compares its final tape and head with the pseudo-tape the UTM
leaves left of the first `Y`. UTMBIN (the binary counter) never halts on either
side and is checked only for not halting.

## Bugs on the disk

Both kept as found. Each fix is a named patch beside the original.

**`EQUALS.TM`** is meant to halt on a 0 when two unary numbers are equal and on
a 1 when they are not. It halts on a 0 whenever the left number is exactly one
more than the right: 2/1, 3/2, 4/3, … State 7 is the "left side has extras"
exit; it finds the extra 1, erases it, and steps left off it.
[`pcomp-equals-patched`](machines/pcomp-equals-patched.yml) changes that one
row to `1 → 1 N 0`, halt on the 1. `verify` sweeps all 49 pairs in 1..7: the
original is wrong on exactly the six a = b + 1 pairs, the patch on none.

**`DESTADD.AB`** line 6 is `GTO` with no target. `NDESTADD.AB` is the same loop
with a restore and says `GTO 3`; the YAML carries `GTO 3` and a `patches:`
entry.

## RAM\* and AB\*

RAM\* is CARDIAC (Hagelbarger and Fingerman, Bell Labs, 1968) with its opcodes
renumbered: cells of sign + three digits, cell 00 hardwired `+001`, a four-digit
accumulator. `BOOT.RAM` is nothing but documentation of the hardwired one-cell
bootstrap; run it from PC 00 with the listed input stream and ADD.RAM appears in
cells 10–16. `FBOOT.RAM` is a four-instruction self-modifying loader that
increments the address field of its own `INP` instruction.

AB\* is the abacus machine of Boolos & Jeffrey, *Computability and Logic*, ch. 6,
with named subroutines. Registers are global, so `CAL` passes arguments by
convention: `EXP` → `XMULT` → `XADD` computes 3⁴ = 81 in 1,365 steps.
`COUNT.AB` calls itself once per unit of A.

What the help files do not say, and the steppers choose: STO keeps the low three
digits with sign; arithmetic wraps the accumulator at four digits; RAM\* input
running out stops the run as `input-exhausted`; AB\* registers clamp at ±9999.

# PCOMP — the Philosophy and Computers course disk

PCOMP is the University of Maryland Philosophy Department's "Computation Theory
Package": onscreen simulators and editors for three abstract machines, written
for Christopher Cherniak's PHIL 209P / HONR 258N by the CogSci Courseware
Project in Turbo Pascal 4.0 for a 256K IBM PC.

| Program | Machine | Version on disk |
|---------|---------|-----------------|
| `TM.EXE` — TM\* | Single-tape Turing machine, with a UTM mode | v2.0 June 1990, © 1985–1990 |
| `RAM.EXE` — RAM\* | CARDIAC-style von Neumann machine: 100 three-digit cells, one accumulator | v2.0 June 1990, © 1986–1990 |
| `AB.EXE` — AB\* | Abacus / register machine, registers A–J, subroutine calls | v2.0 June 1990, © 1988–1990 |
| `MENU.EXE` | Picks one of the three; looped by `PCOMP.BAT` | v2.20, 8 June 1990 |

No student programmer is named anywhere on the disk. The programs credit the
"University of Maryland CogSci Instructional Software Project"; the help files
send bug reports to Cherniak.

## In this room

| Path | What |
|------|------|
| [`disk/`](disk/) | The 35 text files, byte-identical to the distribution (CRLF, `^Z` kept; `.gitattributes` stops git rewriting them) |
| [`MANIFEST.yml`](MANIFEST.yml) | All 39 members of `pcomp.exe` with size, DOS date, sha256; says which are kept |
| [`syllabus-fall-2000.md`](syllabus-fall-2000.md) | The course page from the Wayback Machine, Feb 2002 capture |
| [`../../../../packages/turing/PCOMP.md`](../../../../packages/turing/PCOMP.md) | The conversion: YAML machines, tapes, RAM\* and AB\* programs, verifier, findings |

The four `.EXE` binaries are University of Maryland copyright and are not
committed. `MANIFEST.yml` identifies them by hash. They ran from a WinZip 1995–96
self-extractor, `pcomp.exe`, 130,530 bytes.

## Dates

The zip's DOS timestamps give three layers:

- **1985–1990** — the copyright years in TM\*; `PCOMP.BAT` is dated January 1986.
- **1990** — the executables (June–September) and every sample program (June–November).
  `README` is June 1991.
- **November 1999** — `TM.HLP`, `UTM.HLP`, `RAM.HLP`, `AB.HLP` rewritten; each ends `'99`.

## The sample programs

| File | What it is | Checked |
|------|-----------|---------|
| `ADD.TM` | Unary a + b: erase the leftmost 1, fill the separator | ✓ |
| `BUSY2.TM` | 2-state busy beaver: 6 steps, 4 ones | ✓ as stated |
| `BUSY5.TM` | "2nd best currently-known (1990)" 5-state beaver: 2,133,492 steps, 1,915 ones | ✓ as stated |
| `BB5.TM` | Heiner Marxen's 1989 contender via Allen Brady and A. K. Dewdney: 11,798,826 steps, 4,098 ones | ✓ as stated, from −2000 |
| `BCOUNT.TM` | Binary counter, forever | ✓ |
| `EQUALS.TM` | Unary equality (the file calls itself `COMPARE.TM`) | bug: 3 vs 2 reads equal |
| `SQUARE.TM` | Unary n² by N copies of N, with Cherniak's bracket diagrams in the comments | ✓ 3² = 9 |
| `UTM.TM` / `UTM.UTM` | 23-state UTM over `0 1 A B M S X Y`, after Minsky ch. 6–7 | ✓ against each pseudo-TM |
| `UTMADD.INP`, `UTMBUSY.INP`, `UTMBIN.INP` | ADD, BUSY2, BCOUNT encoded for the UTM | ✓ |
| `BINARY.INP` | BCOUNT's tape | ✓ |
| `ECHO.PRT` | A saved TM\* printout: the first steps of BUSY5 | — |
| `ADD`, `MULT`, `COUNTUP`, `COUNTDN`, `EQUALS` `.RAM` | RAM\* programs | ✓ |
| `BOOT.RAM`, `FBOOT.RAM` | Hagelbarger's one-cell slow bootstrap, and a self-modifying fast one | ✓ both load ADD.RAM |
| `COUNT`, `COUNTDN`, `DESTADD`, `NDESTADD`, `MULT`, `XADD`, `XMULT`, `EXP` `.AB` | AB\* programs; `EXP` → `XMULT` → `XADD`; `COUNT` calls itself | ✓ (`DESTADD` patched) |

Two bugs on the disk, both kept as found with a named patch beside them:

1. **`EQUALS.TM`** answers "equal" whenever the left number is exactly one more
   than the right. State 7 finds the extra 1, erases it, and steps left onto a 0.
   One row fixes it for every pair in 1..7: `7 1 → 1 N 0` instead of `1 0 L 0`.
2. **`DESTADD.AB`** line 6 is a bare `GTO` with no target. `NDESTADD.AB`, the
   same loop plus a restore, has `GTO 3`.

## RAM\* is CARDIAC

Bell Labs' CARDIAC (David Hagelbarger and Saul Fingerman, 1968) was a cardboard
computer: 100 cells of three decimal digits, an accumulator, ten opcodes, and
cell 00 hardwired to `001` so that the machine can bootstrap itself from input.
RAM\* keeps all of that and renumbers the opcodes (`0` INP, `1` OUT, `2` CLA,
`3` STO, `4` ADD, `5` SUB, `6` SFT, `7` JMP, `8` TAC, `9` HRS). `BOOT.RAM`
credits the bootstrap to Hagelbarger. The slow-boot stream `002 700` followed by
address/instruction pairs is CARDIAC's `002 800` with the jump renumbered.

## Still missing

- THERMO and Micro-SHRDLU, the other two UM CogSci Courseware programs the
  syllabus lists.
- Any earlier version of TM\* (the copyright starts in 1985).
- The names of the students who wrote PCOMP.

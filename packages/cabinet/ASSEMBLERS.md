# Assemblers

Several assemblers share one back end, as GNU's BFD shares one object library between many
front ends. What is shared is everything after parsing: the assembled words, the symbol table,
the source map, the loaders and the listings. Each language keeps its own parser. The plan and its
reasons are in [DESIGN.md](DESIGN.md#assemblers-several-front-ends-one-back-end); this page is
what exists.

```
            front ends                    back end                    writers
  ┌──────────────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
  │ asm/dec.ts               │     │ asm/core.ts         │     │ asm/listing.ts       │
  │   DEC_1964 (1964)        │ ──▶ │   AsmResult         │ ──▶ │   1972 house style   │
  │   CAMBRIDGE_1972 (1972)  │     │   Machine           │     │ source.ts            │
  │ as7 (next)               │     │   loadAsm           │     │   memory panel views │
  │ 6502 (later)             │     │ asm/pdp7.ts         │     │ formatListing        │
  └──────────────────────────┘     │   PDP7 + opcodes    │     │   plain              │
                                   └─────────────────────┘     └──────────────────────┘
```

`src/asm.ts` re-exports all of it, so `import { assemble } from "./asm.js"` works as before.

## The back end: `src/asm/core.ts`

- **`Machine`**: all the back end knows about the hardware, `{ name, wordBits, addrBits, radix }`.
  How many digits to print follows from those. `PDP7` is `{ 18, 13, 8 }`; a 6502 would be
  `{ 8, 16, 16 }`.
- **`AsmResult`**: what every front end produces. The machine, the words at their addresses, the
  symbols, the literals and variables, one `AsmLine` per source line, the errors, and the start
  address.
- **`AsmLine`**: a source line, where its first word went, and **all** the words it emitted
  (`words`). A DEC `text "AB"` emits two; a 6502 `.byte` will emit many. `endsSegment` marks
  Cambridge's `PAUSE`, which restarts the listing's line numbers.
- **`loadAsm(cpu, result)`** deposits it; **`sourceFromAsm(result)`** (`src/source.ts`) makes the
  source map the memory panel's `source` and `code` views use.

## The DEC-family front end: `src/asm/dec.ts`

DEC's 1964 assembler and the Cambridge CAD Group's 1972 one are one language: `name,` labels,
`expr/` origins, `(literals`, `/ comments`, ones' complement arithmetic, and variables for names
used but never defined. They differ in a handful of ways, and each difference is a field of a
`Dialect` object rather than an `if` in the engine:

| Field | `DEC_1964` | `CAMBRIDGE_1972` |
|---|---|---|
| `symbols` (extra) | none | the Titan link: LSF, LCF, LKD… |
| `labelsWithValues` (`name=JMS,`) | no | yes |
| `commaIsDot` (`JMP , 3`) | no | yes |
| `text` (`text "ABC"`) | yes, a cabinet extension | no |
| `start` ends a tape | yes | no |
| `display` (DISP, NODISP, PAUSE, VEC) | no | yes |
| `variableOrder` | alphabetical | first use |
| `variablesFirst` (before literals) | no | yes |

`assemble(tapes, { dialect: "dec" | "cambridge" | aDialect })`. A new dialect is a new object,
for example a 1966 DEC variant: copy one, change the fields.

**Proof it's the same assembler.** Before the split, every assembly the cabinet does was hashed:
SYMELEC, RSPPIX, the light pen test, HILO and LANDER. That covers words, symbols, literals,
variables, listing lines, errors and start, plus the plain listing text. After the split, all five
hashes are identical. The 68 tests pass.

## Listings in the 1972 house style: `src/asm/listing.ts`

Every assembler prints its listings the way Heinz Lemke's SYMELEC listing was printed on Titan in
1972:

```
/SYMELEC   ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470   PAGE  1
    1                                                      /SYMELEC
    2
    3
    4                           DISP
    5
    6      21/ 740040  21/      HLT
   10      24/ 212257  BEGRTP,  LAC (JMP INT               /INTERRUPT ENTRY
```

`printListing(result, { title, user, date, pageLines, formFeed, upperCase })`:

- **The header**: title, `ASSEMBLED day month yy AT hh,mm,ss`, `BY user`, and `PAGE  n`. Several
  users are comma separated. The cartridge gives the user (`listing: { user }` in
  `apps/ties/src/lib/cabinet-programs.js`): `HL1470`, `CSTEIN`, `PETERSON,VINER`,
  `A2DEH,CLAUDE`, `wmb,claude`, `ken`. The rule, tribute over technicality, is in
  [DESIGN.md](DESIGN.md#assemblers-several-front-ends-one-back-end).
- **The rows**: a sequence number, which starts again at 1 for each tape and after each `PAUSE`,
  then the address, a slash, the word without leading zeros, and the source line exactly as
  written. A line that emits several words prints the rest below it, address and word only.
- **Then** the variables (`12053/      0  RAYTNO`) and literals (`12066/ 777774`), in address
  order.
- **Then the symbol table**, on a page of its own, four to a row at 22-column pitch:
  `UNSTAK =*102400`. It sorts as Titan did, letters before digits and a name before its
  extensions (`T`, `TZ`, `T2`; `U`, `UNSTAK`, `U1`). A `*` marks a value too big to be an address.
  SYMELEC has 29 stars; 28 are on six-digit values, and the two whose definitions can be found,
  `WAIT` and `WINDOW`, are `name=JMS,` labels, JMS plus a location. The 29th is below.
- **Pages**: `pageLines` rows a page, 58 as in 1972. Each page starts with a blank line and the
  header, or a form feed with `formFeed: true`. `pageLines: 0` prints one continuous listing,
  headed once.
- **Case**: names and title print in whichever case the source mostly uses, or as `upperCase` says.

HILO, assembled here, in the same style:

```
/HILO   ASSEMBLED 28 9 26 AT 14,30,00 BY A2DEH,CLAUDE   PAGE  1
    1                  / HILO, a number guessing game for the PDP-7 teletype. Written in 2026
   ...
   15                  100/
   16     100/ 201024  begin,   lac (hello
   17     101/ 100214   jms puts
   18     102/ 100147   jms getc                / any key starts
```

**Tested against the original** (`src/listing.test.ts`): page 1 of the SYMELEC listing is read
back into an `AsmResult` and printed again. All 60 lines come out identical to Heinz's, header
included. The symbol table the corrected source prints is the transcribed table, row for row.

## What the symbol table told us about the transcription

Titan printed the symbol table in strict order, letters before digits, so a name out of order was
misread. Read against the scans (listing pages 108-110), the table had 20 wrong names (`BD0` for
`BDO`, `CLB1` for `CLBI`, `CHODE` for `CMODE`, `COP FIR`, `TDDIS` for `TODIS`, `WAITLX` for
`WAITLK`, ...), a stretch from `DEMP` to `GRID` transcribed in the wrong order, five wrong values
(`COMP10`, `BPNTX`, `MESIN2`, `UNSTAK`, `WRLB`), a lost digit (`UNSTKY =*111023`), and stars
dropped on 21 values. The star marks a value bigger than an address. `SUMB` really is printed
twice, 5013 and 5040: it is assigned twice. The table also settled names in the code: `ENOEX` and
`WAIT2` are how Heinz spelled them. `scripts/audit-cambridge.mjs` checks every listing line
(address, word, source) and every table row against the assembly; it reports nothing.

## RSPPIX and SYMELEC reassemble

`rsppix.asm`, unchanged, assembles at origin 22 to `rsppix.oct` word for word
(`src/rsppix.test.ts`). `CAMBRIDGE_1972` learned its 1972 spellings to get there:

- `JMP I SETUP=JMS` in an operand means SETUP−JMS, and the label `FINDP-JMS,` means `FINDP=JMS,`.
- `DZM #GDM` is DZM GDM.
- A comma glued to an operand (`JMP GNIL,`) adds nothing.
- Literals share a pool word by value, so `(JMS` and `(100000` are one word. Titan wrote the pool in
  reverse order of first use.
- The bare names after the last PAUSE (BEG … BCC) are Titan's printout of the variable block. They
  are checked against the allocation, not assembled.

`symelec.asm` assembles to `symelec.oct` and its literal pool word for word
(`src/cambridge-as7.test.ts`). SYMELEC taught the dialect four more things:

- A forward reference to a name assigned twice (`SUMB = STSTAK 44`, then `STSTAK 71`) gets the
  first value.
- A literal naming a symbol not yet defined gets its own pool word at each use; once defined,
  literals share by value. Three `(TEMPDF 10` before `TEMPDF` is defined are three words.
- `VEC ON n` with one coordinate: under 100 octal it is dy, otherwise dx.
- `LAW -30` keeps the operand to the 13-bit address field: `777747`.

The rest was the transcription, corrected in place against the scans in `symelec.asm`, the
listing text and `symelec.oct` together: names (`WRLTO`, not `WRLTD`; `ERAST`; `MESIN8`),
`OP-5` for `OP+5`, `LAM` read as `LAW`, `SAD (257` read as `SAD 13`, `772016` read as `772015`
at 7633 (the scan's 6 has a speckled top), the variable block after the
last PAUSE, and Heinz's pencilled `201130` for PIX, which Titan had rejected as `201128`.
`scripts/compare-symelec.mjs` lists any word where source and image part.

## Cambridge to as7

`src/asm/cambridge-as7.ts` translates Cambridge source to `as7` source using the Cambridge
assembler's own parser, tokenizer, assignments and literal pool, so the two cannot disagree about
what a line means. Each name gets a prefix (`s` for SYMELEC, `r` for RSPPIX) to stay apart from
the Forth kernel and `sop.s`. Ones' complement arithmetic and as7's OR-by-space are reconciled
term by term against the Cambridge value; `FINDP=JMS,` becomes a label and `FINDP` in an operand
`jms rfindp`. Literals become labelled words after the variables, in the same places.
`scripts/translate-cambridge.mjs` writes `tapes/symelec/symelec.s` and `tapes/pdp7forth/rsppix.s`
only if as7 assembles them to the Cambridge words exactly; tests check that again, and that the
checked-in files are what the translator makes today.

## Next

1. **Forth with RSPPIX, built in the page**: `kernel.s` and `rsppix.s` in one as7 run, one symbol
   table and one source map, with Forth words over RSPPIX's routines. The prebuilt Forth stays.
2. **Forth built in the page** from `kernel.s`, `prelude.fs` and `turtle.fs`, with the source map
   and symbol table from the build. It sits on the menu beside the prebuilt Forth until the two
   agree word for word.
3. **The full-names kernel, developed in the page**: `kernel-names-full.s` edited in the LIVE
   CODING panel, assembled, booted and debugged with Mitch's own source lines in the memory panel
   and the trace.
4. **Then back to Mitch as tested PRs**: first a `KERNEL` parameter for his Makefile, tests and
   name check (today `src/kernel.s` is hardcoded in the Makefile and in `test/run_tests.py`, and
   `check_names` assumes 3-character names); then `src/kernel-names-full.s`, passing his test suite
   under SIMH as well as ours.
5. **Listings in the page**: the LIVE CODING panel shows the build's listing and can save or
   print it.
6. **A 6502** machine description and front end, for symbols and source maps in a JavaScript 6502
   emulator.

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
included. In the symbol table, 563 of the 566 symbols print exactly as transcribed, and the
ordering rules hold. The other three are transcription problems, listed below.

## What the symbol table told us about the transcription

Titan printed the symbol table in strict order, so a name that sits out of order was misread. The
digit readings below break the order, but the letter readings fit it exactly, and the source file
agrees:

| Transcribed | Almost certainly | Uses in `symelec.asm` (transcribed / letter) |
|---|---|---|
| `BD0` | `BDO` | 1 / 2 |
| `CLB1` | `CLBI` | 1 / 2 |
| `CLB0` | `CLBO` | 1 / 2 |
| `CHODE` | `CMODE` | 1 / 7 |

This is also why `CLB1` and `CLB0` come out undefined when the cabinet assembles SYMELEC. A stretch
of the table from `DEMP` to `GRID` is out of order too, as if its rows were transcribed in a
different order. `SUMB` appears twice (5013 and 5040), and `COP FIR` looks like a misread
`COPFIR`. `UNSTKY =*11023` has a star on a five-digit value, the only one of 29; its neighbour is
`UNSTKX =*111011`, so a digit was probably lost. (`scripts/extract-symbols.mjs` read the star as
"multiply defined", another guess; the rows disagree with that less clearly.) None of these are
corrected yet: each needs a look at the scan page first.

## SYMELEC does not reassemble yet

Assembling `symelec.asm` with `CAMBRIDGE_1972` gives 21 errors. Among them are a `#` prefix the
dialect doesn't know (`DZM #GDM`), a label defined twice (`GR2`), and the misreadings above. One
early error moves every address after it, so most of the 4,717 words differ from `symelec.oct`,
which is what the cabinet boots. Making the assembler reproduce `symelec.oct` word for word is the
test the Cambridge dialect still has to pass.

## Next

1. **The `as7` front end**, for Ken Thompson's `as` as pdp7-unix and Mitch Bradley's Forth use it:
   `name:` labels, `"` comments, `;` between statements, `1f`/`1b` relative labels, `<c`
   character syllables, a space that ORs, and numbers that are decimal unless they start with 0.
   It is written here, not ported: pdp7-unix's `as7` is GPL, so it is the oracle, not the source.
   **Accept:** Mitch's `kernel.s` assembles to his `kernel.a7out` word for word, with the same
   `Labels:`.
2. **Forth built in the page** from `kernel.s`, `prelude.fs` and `turtle.fs`, with the source map
   and symbol table from the build. It sits on the menu beside the prebuilt Forth until the two
   agree word for word.
3. **Listings in the page**: the LIVE CODING panel shows the build's listing and can save or
   print it.
4. **A 6502** machine description and front end, for symbols and source maps in a JavaScript 6502
   emulator.

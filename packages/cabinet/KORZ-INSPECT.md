# Inspecting Korz: named slots, why, projections, and what the compiled blocks know

Don's questions, November 2026, with window and panel layout on hold: make the 6502's slots
self-explanatory and structured instead of 256 bytes; show the static and dynamic facts about
slots; a "why" browser; a way to pick dimensions and project virtual objects along them, like the
Korz browser David Ungar built in Self and Morphic; and, for each compiled block, whatever helps
understand and trace it. This file is what is built, what was learned running Don's ProDOS Forth
under it, and the plan for the rest.

## Built

**The 6502 sea by field** (`src/korz/m6502.ts`). An opcode is three coordinates, the datasheet's
`aaa` (bits 7-5), `bbb` (bits 4-2) and `cc` (bits 1-0, named `control`, `alu`, `rmw`, `combined`).
Two selectors:

- `exec`, 77 slots. A regular operation is a column: "LDA" is `cc=alu aaa=5`, every mode; "LDX" is
  `cc=rmw aaa=5 bbb=0-1,3,5,7`, the modes it has. Where the chip decodes by row the slot is a row:
  one "branch" slot takes the flag from `aaa>>1` and the sense from `aaa&1` for all eight branches,
  one "flags" slot does CLC, SEC, CLI, SEI, CLD and SED. Every opcode the fields do not explain is
  an exact cell: TYA and CLV in the flags row, "JMP (ind)", TXS, "ASL A", the undocumented ones. A
  cell is more specific than its column or row, so it wins with no ordering. Group 0's leftover
  cells fall to one slot, the undocumented NOP that reads what its mode addresses.
- `mode`, 12 slots, the addressing cycles by group and `bbb`, returning the address: `#imm`, `zp`,
  `abs`, `(zp,X)`, `(zp),Y`, `zp,X`, `abs,Y`, `abs,X`, and `zp,Y` and `abs,Y` for the X-register
  columns. A column sets `c.store` for stores and read-modify-write, which always pay the indexed
  dummy read.

Every body is the switch's own cycles and ALU, exported from `src/m6502/m6502.ts` as `parts`, so
the sea and the switch can only differ in which pieces they pick. The test runs all 256 opcodes in
the three flavors (NMOS, NES, 65C02) on random registers and hashed memory against the switch and
compares every bus cycle, and checks that each instruction that is not a jump advances PC by the
bytes the sea claims. A deliberately broken slot fails it and names the opcode. The SingleStepTests
corpus is the independent oracle; it is fetched, never vendored, and `M6502_TESTS` points the
switch's test at it.

Speed did not move outside the noise of these short runs: the resolver at 120, 62 and 67 times a
real Apple ][+ on the tight loop, the DOS boot and Applesoft (88, 70 and 68 before), the compiler
at 143, 36 and 70 (150, 38 and 78).

**Names from the sea.** `opcode65(sea, op)` names an opcode after the slots that answer it, the
exec slot's name and, for a column, the mode's: "LDA zp,X", "BNE", "JMP (ind)", "SHX abs,Y". A
patch installed into the sea renames what it takes over. Each slot carries a one-line `doc`.

**Static facts in the KORZ tree** (`src/korz/inspect.ts`), for every sea whose table is small
enough to enumerate (4,096 entries), the PDP-7's included:

- per slot: its doc, guard, layer, the table entries it runs first at ("LDX wins 5: A2 LDX #imm,
  A6 LDX zp, AE LDX abs, B6 LDX zp,Y, BE LDX abs,Y"), the slots it shadows (they run only if it
  calls `next`), the slots that shadow it, its body, and its `emit` template if it has one;
- for the 6502: the next opcode at PC with its fields in binary, its exec and mode slots, and the
  `why` lines for both selectors; and the opcode matrix, 16 rows of 16, each opcode with its slots,
  bytes and why.

`why` and guards print a coordinate by member name when its dimension has names, and in the
dimension's `radix` (8 by default, 16 with `$`).

**Compiled blocks** (`src/korz/compile65.ts`): each block keeps the opcodes it was compiled from and
whether each was inlined, how many times it ran, how many instructions it retired, and the cycle it
was built at. The tree lists a block as a disassembly (`$0800  A2 0A  LDX #imm`, named by the sea)
above its JavaScript, with its source size and its DevTools name (`korz65/blk-0800.js`); a
"Hottest" list by instructions retired; and a "Dropped" log of the last 32 blocks thrown away, each
with the address whose opcode changed, the old and new opcode, and the cycle.

## What Don's Forth showed

Don's ProDOS Forth (`forth-ok.po`) runs on the Korz Apple with the cabinet's Videx in slot 3
(`src/korz/apple2/videx.ts`), on every rung. With it at the prompt, the Hottest list is almost all
one-opcode blocks, and the listings say why:

```
$089B  A0 01     LDY #imm
$089D  B1 0B     LDA (zp),Y   (not inlined: one call to the switch)
$089F  85 0F     STA zp
$08A1  88        DEY
$08A2  B1 0B     LDA (zp),Y   (not inlined)
$08A4  85 0E     STA zp
$08A6  18        CLC
$08A7  A5 0B     LDA zp
$08A9  69 02     ADC #imm     (not inlined)
$08AB  85 0B     STA zp
$08AD  90 02     BCC
$08B1  4C 0D 00  JMP abs
$000D  6C 5C 0D  JMP (ind)    (not inlined)
```

That is fig-FORTH's `NEXT`: fetch the cell at IP (`$0B`) into W, add 2 to IP, and `JMP (W)`, where
the `JMP (ind)` sits in zero page at `$000D` and its operand bytes `$0E`-`$0F` are W, written by the
two `STA`s. The compiler has no template for `(zp),Y`, `ADC` or `JMP (ind)`, and it ends a block
at every store, so one `NEXT` is eleven block calls and four calls to the switch. And the block
cache keeps 1,024 blocks and evicts the oldest: 6,597 built for 1,024 kept, the hot ones rebuilt.

## Plan

1. **The compiler, from what the listing shows.** Templates for `(zp),Y`, `ADC`/`SBC` and
   `JMP (ind)`. A store ends a block only when it can hit one of the block's own opcode bytes:
   operands are read as the block runs, so the stores into W above are safe, and a zero-page store
   cannot hit code outside page zero. Evict the least recently run block, not the oldest. Then
   measure `NEXT` as one block. Later the templates come from the slots' `emit`, so a patch to the
   sea reaches the compiler.
2. **A why browser.** Pick a selector, set each coordinate (or take "now" from the machine), and
   show the `why` lines, the chain that runs, and the table entry. The tree is read-only today; this
   is the first editable panel, and waits for the layout layer.
3. **Projections.** Choose dimensions to gather along (`cc` and `aaa` for operations, `bbb` for
   modes, `device` and `pulse` on the PDP-7, a `by` prefix), fix the others, and show one virtual
   object per coordinate value with its slots as methods. `Sea.view` and the standings computed for
   "wins" are the pieces; what is missing is choosing the dimensions, which also waits for layout.
4. **Hit counts.** An observe-layer slot installed on demand counts dispatches per table entry and
   keeps the last context; removed, it costs nothing. It sees the sea's dispatches, which under the
   compiler are only the blocks it could not build, so blocks keep their own counts.
5. **More per block.** Exits by successor address (a Map update per call, so on demand), why a
   block ended (store, untemplated opcode, branch, length), and the guest instruction beside each
   piece of generated source as an interleaved map.
6. **A serial card** for the Korz Apple, the 2651 at `$CE00` in slot 4, so `forth.po` and its H19
   terminal run there too.

V8's own tiering of a block (interpreted, baseline, optimized) is not visible from a page.

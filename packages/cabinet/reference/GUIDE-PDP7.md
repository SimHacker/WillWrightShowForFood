# The PDP-7, and how devices add instructions

The **DEC PDP-7** (1965): 18-bit words, 4K to 32K of core memory, ~1.75 µs cycle. Cambridge's
had 8K, maybe 16K; the cabinet runs 8K by default and up to 32K.
One accumulator, a link bit, 13-bit addressing with an indirect bit, and a 4-bit opcode —
which is why the whole memory-reference instruction set fits on an index card: `CAL DAC JMS DZM LAC XOR ADD TAD XCT ISZ AND SAD JMP`, plus operate-class micro-instructions (`CLA SZA SNA SKP CMA...`), `LAW`, the optional EAE, and `IOT`. That last one is the door everything
else walks through.


## How devices add instructions — electrically

Every word starting `70xxxx` is an **IOT** (Input/Output Transfer). The processor does not
know what any IOT does. It puts the instruction's device-select bits on the I/O bus, fires
up to three timed pulses, and whatever device recognizes its own select code acts: clear a
flag, gate data onto the bus, skip the next instruction if a flag is up. **Plug in a device
and its instructions start existing; unplug it and they become no-ops.**

The PIXIE listing shows the standard ones (display and light pen IOTs, `ION`/`IOF`) and a
set no DEC manual ever documented: **Wiseman's Titan link instructions.** The link-transfer
pages are full of `70xxxx` words with names like `LKEILLB6`, `LRB18ILLAM`, `LSA`, `LKD`,
`LCF` — Cambridge built a network interface, and the network interface added networking
*instructions* to the machine. When you see `JMS WAITLK` followed by a bare link IOT, you
are reading 1969 network driver code.

Same mechanism, other boxes:


| Device                                          | Instructions it adds                                                                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EAE** (Extended Arithmetic Element, Type 177) | Multiply, divide, shifts, normalize — the `64xxxx` family (`LRS`, `LLS`, `GSM`... all over the listing). Without the cabinet, those words do nothing useful |
| **Type 370 light pen**                          | Pen flag skip/clear IOTs — pointing as an instruction                                                                                                       |
| **Titan link** (Cambridge custom)               | Read/write link words, status, control — networking as instructions                                                                                         |
| **x87 FPU** (1980, same trick reborn)           | 8086 reserved `ESC` opcodes it didn't decode; the 8087 watched the bus for them. Buy the chip, gain `FMUL`                                                  |
| **PDP-11 options** (FP11, KE11, CIS)            | DEC kept selling instructions in boxes for two more decades                                                                                                 |

## Memory beyond 8K

An instruction has 13 address bits, so it reaches one 8K **bank**. The Type 148 memory
extension adds banks up to 32K and **extend mode**, which SIMH and the cabinet both implement:

- A direct address is in the same bank as the instruction. `PC + 1` wraps within its bank.
- Extend mode **off** (the default after reset and on every interrupt): an indirect address is
  13 bits, in the current bank too. Old programs never notice the extra banks.
- Extend mode **on** (`EEM`, IOT 707702): an indirect address is 15 bits and reaches any bank.
  `LEM` (707704) turns it off; `SEM` (707701) skips if it is on.
- `JMS`, `CAL` and interrupts save the link in bit 17, extend mode in bit 16 and a 15-bit PC.
  `EMIR` (707742) turns extend mode on until the next `JMP I`, which restores it from bit 16 of
  the saved word: how an interrupt handler returns to whichever mode was running.
- With 8K or less the extension isn't there, and its IOTs do nothing.

**Forth in 32K.** Mitch's Forth runs unchanged: it never turns extend mode on, so it lives in
bank 0 exactly as in 8K. To use the upper banks, Forth needs a few code words, not a rewrite:
`far@ ( lo hi -- x )` and `far! ( x lo hi -- )`, which do `EEM`, an indirect load or store
through a 15-bit pointer, `LEM`; and block moves between banks. Cells stay 18 bits, so a far
address is two cells, or one cell holding 15 bits. The display can't follow: the 340's address
register is 13 bits, so display lists stay in bank 0 unless a display-bank IOT is added as a
marked extension. What the extra banks are for: headers and source maps (a headerless runtime in
bank 0, names and line tables above, as metacompiled Forths do), ring storage for PIXIE's
structures, and big tables.

## The PDP-7 next to an Apple ][

Twelve years apart, about the same speed, about 1/35 of the price. PDP-7 figures from Supnik's
*Architectural Evolution in DEC's 18b Computers*; Apple ][ figures are the commonly cited ones,
to check against the Apple ][ Reference Manual (1978).

| | PDP-7 (1965) | Apple ][ (1977) |
|---|---|---|
| **Price** | about $45,000 base, roughly $450K today; the 340 and light pen extra | $1,298 with 4K, $2,638 with 48K; roughly $6.5K–$13K today |
| **Built** | about 120 | millions, counting the family |
| **Size** | several cabinets, kilowatts, a machine room | a keyboard case and a TV |
| **Logic** | thousands of discrete transistors on Flip Chip cards | the 6502 (about 3,500 transistors on one chip) and about 60 other chips |
| **Word** | 18 bits | 8 bits |
| **Addresses** | 13 bits per instruction (8K), 32K with extension | 16 bits (64K) |
| **Memory** | core, 1.75 µs cycle, 4K–32K words (9–72 KB) | DRAM, 4–48 KB |
| **Timing** | 1–2 memory cycles per instruction (`LAC` 3.5 µs) | 1.023 MHz, 2–7 cycles per instruction |
| **Instructions per second** | about 300,000 | about 250,000–400,000 |
| **Instruction set** | 16 opcodes on an index card, plus OPR bits and IOTs | 56 instructions, 151 opcodes, 13 addressing modes |
| **Arithmetic** | 18-bit add in one instruction; the EAE multiplies and divides | 18 bits takes several instructions; no multiply |
| **Display** | Type 340: a vector display processor, 1024², light pen | memory-mapped raster, 280×192, 6 colours, drawn by the CPU |
| **I/O** | IOT: each device adds its own instructions | memory-mapped soft switches, 8 slots |
| **Software** | paper-tape assembler; PIXIE; UNIX (1969) | BASIC in ROM, Applesoft, VisiCalc, games |

Speed is a draw: the PDP-7 wins on wide arithmetic, the 6502 on bytes and addressing modes.
Graphics is not close: the 340 refreshes vector pictures by itself, while the Apple's CPU draws
every pixel. Cost is the story: the same computing fell from a department's capital budget to a
family's in twelve years. Both run near 0.3 MIPS, so one browser tab can run both side by side
with three orders of magnitude to spare ([WEB-BENCH.md](../WEB-BENCH.md) on borrowing an Apple ][).

**And a raster for the PDP-7** (could). Give the PDP-7 the Apple's kind of screen, as a marked
extension: a framebuffer device that reads any memory directly, like the 340, and paints it on
a canvas, 6 bits each of red, green and blue per word. 64×64 fits in Forth's free memory today;
256×256 packed three 6-bit pixels a word fits in banks 1–3 of 32K. Point it at the dictionary,
the stack or PIXIE's rings and memory becomes colour; point it at two buffers in turn and a
cellular automaton never tears. In Forth, `fb ( addr fmt -- )`, `pixel!`, `pixel@`.

## Status

- **Done:** the CPU, ported from SIMH's `pdp18b_cpu.c` and checked against it: memory
  reference, OPR, `LAW`, `XCT`, auto-index 10–17, the one interrupt level, the EAE operations
  programs use; memory extension to 32K with extend mode.
- **Will:** Forth `far@`, `far!` and bank moves; a CONFIG choice of 4K, 8K, 16K or 32K.
- **Could:** trap mode (PDP-7 memory protection); the PDP-9's differences, for programs that
  need them; an upper-bank ring store for PIXIE behind its existing calls
  ([DRAWING-CONSTRAINTS.md §6](../DRAWING-CONSTRAINTS.md#6-extended-memory-could)).
- **Won't:** the PDP-9's or PDP-15's instruction differences in the PDP-7 plugin. They'd be
  separate plugins.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)

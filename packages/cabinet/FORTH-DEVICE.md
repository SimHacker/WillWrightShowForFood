# A Forth device: Mitch's Forth in "hardware", beside SYMELEC

Status: design, nothing built. Written 15 November 2026 from a conversation with Don.

## Why: SYMELEC has no room

SYMELEC fills the PDP-7. In Heinz Lemke's words, its 5000 instructions build up models that "had
to fit in the remaining 3000 words on the PDP 7" ([PIXIE-RESTORATION.md](PIXIE-RESTORATION.md)).
Mitch Bradley's Forth needs most of 8K too. So today the plan for Forth and PIXIE to work together
is two cabinets side by side, handing drawings over a shared Tiny Titan
([FORTH-RINGS.md](FORTH-RINGS.md#next-two-pdp-7s-one-titan)).

A Forth that takes almost no core could live in SYMELEC's own machine and control it: call its
routines, read and write its variables and rings, drive its menus, and script the light pen.
The way to get there is a device that is Mitch's Forth, word for word, with its dictionary
outside core.

## Primitives as instructions

A device code is a new opcode space ([DEVICES.md](DEVICES.md)). In Mitch's Forth a primitive's
thread cell is a `JMP` to its code in core, a colon word's is a bare address that executes as
`CAL`, a constant's is `LAC`, and a variable's is `LAW`. NEXT is `XCT I 10`
([reference/PDP7-FORTH.md](reference/PDP7-FORTH.md#how-it-works)).

With the Forth device, a primitive's cell is an IOT instead: `DUP` is one IOT word, `+` another.
NEXT still executes the cell with `XCT`, and `XCT` of an IOT goes to the device like any other
IOT (the emulator's `XCT` already executes any instruction). The device runs the primitive on the
stacks where Mitch's kernel keeps them, in the auto-index registers and core. A few unused device
codes, with their subdevice and pulse bits, cover the primitive set.

- **Colon words are unchanged**: a `CAL` to core. Source written for Mitch's kernel, and the
  cabinet's `.fs` files, compile and run unchanged; threads differ only in primitive cells.
- **Each word chooses**: an IOT into the device (no core, fast), or code in core (patchable,
  inspectable, and runs on hardware without the device).
- **In Korz, the device is its slots**: one slot per primitive on the device's codes, each with a
  JavaScript template. The compiler inlines them, so a compiled block runs the primitives as
  straight JavaScript. With thread blocks ([KORZ-COMPILER.md](KORZ-COMPILER.md#threaded-code-planned)),
  Forth runs close to the speed of the generated JavaScript.

## The dictionary in ROM

- **ROM is read slots.** The device answers reads for an address range from its own image, with no
  core behind it: the headers, the names, and the precompiled high-level words of the prelude and
  the outer interpreter. In Korz that is slots on `read` guarded on an address range, the shape
  the Apple ]['s language card will have.
- **In bank 1.** Bank 0 is untouched. It is the same placement as the names in bank 1
  ([FORTH-HIGH-MEMORY.md](FORTH-HIGH-MEMORY.md#step-2-the-names-in-bank-1)), so `FIND` and `WORDS`
  need one change, extended reads, for both.
- **The core dictionary links into ROM.** The last ROM word ends the core dictionary's chain.
  Words you define go in core, or in bank 1 on a 32K machine.
- **Power-on is one instruction.** An IOT at the start address enters the ROM's `QUIT`, and the
  Teletype prints `ok`. No tape, no compiling the prelude. Core holds the stacks, the variables,
  and whatever you define.

## Two ways to share the CPU with SYMELEC

SYMELEC's main loop owns the PDP-7. Forth needs turns.

1. **Forth on interrupts.** The device raises its flag (on a clock, or when the host has a line
   typed for it), and SYMELEC's interrupt path, patched as `interrupt.fs` patches NEXT, runs Forth
   until it yields. Simple, and everything runs on the PDP-7.
2. **Forth as a coprocessor.** The device runs NEXT itself, fetching threads from core by DMA as
   the 340 fetches display lists, and runs ROM primitives itself. When it reaches a word whose
   code is in core, such as a call into SYMELEC's RSPPIX, it hands that word to the PDP-7 by
   interrupt and waits, the way the Turing engine's faults go to the host. SYMELEC keeps running
   between those calls.

The first comes first. The second is what makes Forth run in parallel.

## A ring library in high memory

Forth already speaks PIXIE rings: `pixie.s` wraps RSPPIX from the 1972 listing, and `pixie.fs`
is the layer you type at ([FORTH-RINGS.md](FORTH-RINGS.md)). Beside SYMELEC there are two kinds
of ring:

- **SYMELEC's rings, in its own ring space in bank 0.** Forth works on them by calling SYMELEC's
  own RSPPIX, which is already in core. No copy.
- **Forth's own rings,** the turtle's drawings and scratch structures, which must not take
  SYMELEC's space. They go in bank 1, with a ring library that reaches them: ring pointers stay
  13 bits within their bank, and the library adds the bank, with extended-mode indirects in a
  PDP-7 version (`rsppix-extended`) or plainly in the device's primitives (`RFIRST`, `RNEXT`,
  `RCAR`, and the rest as IOT words that address any bank).

Moving a drawing from Forth's rings into SYMELEC's is the Titan load path without the Titan: copy
the block from bank 1 into SYMELEC's ring area with `XMOVE`, and run SYMELEC's own 1972
relocation pass, which adds `RELCON` to every pointer. Then you edit it with the light pen.

## Keeping it honest

- Mitch's kernel in core stays the reference. The same Forth programs run on both, and the
  Teletype output and stacks are compared after each line, the four levels' discipline applied
  to one more implementation.
- A program that uses only core words still runs on SIMH, and on Tergav's
  [RDP-9](https://github.com/tergav17/RDP-9). One that uses the device needs the device, as one
  that draws needs the 340.
- Precedent for Forth primitives as instructions: Chuck Moore's Novix NC4016 and the Harris
  RTX2000. For a Forth in ROM that is there at power-on: Mitch's Open Firmware.

## Order of work

1. Primitives as IOT slots, with Mitch's kernel in core calling them; compare against the kernel.
2. The ROM dictionary in bank 1, shared with the names-in-bank-1 work; boot to `ok` with one IOT.
3. Forth beside SYMELEC on interrupts: read and write its variables, call RSPPIX on its rings.
4. The high-memory ring library, and moving drawings into SYMELEC with its relocation pass.
5. The coprocessor, if the interrupt version is too slow or too intrusive.

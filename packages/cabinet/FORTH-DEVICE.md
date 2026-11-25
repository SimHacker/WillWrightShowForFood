# A Forth device: Mitch's Forth in "hardware", beside SYMELEC

Status: the first form is built: same image, the device running NEXT, the primitives and FIND
([src/korz/forth-device.ts](src/korz/forth-device.ts)). The ROM dictionary, the IOT primitives,
and SYMELEC are still design. Written 15 November 2026 from a conversation with Don.

## Built: the device on the same image

Every Forth cartridge has a menu, **Forth: software / hardware**, beside the CPU menu. Hardware is
the default; `?forth=software` in the address runs Mitch's kernel instead. Switching reboots, as
switching CPUs does. The device is slots, so it needs a Korz CPU; with the SIMH-style CPU the
hardware choice is disabled and the kernel runs it all.

**The machine does not need to tell software from hardware.** The image in core is the same
either way. The device is told the kernel's labels when the cartridge boots it (where NEXT, `find`
and each primitive's code are), and it watches two instruction fetches:

- **NEXT.** When the CPU fetches `xct i 010`, the device runs the thread instead: it steps IP,
  reads the cell, and does what the cell says. A colon word is a call, done on the return stack; a
  constant or a variable is a push. A `JMP` to one of 30 primitives (`DUP`, `+`, `@`, `(LOOP)`,
  `?BRANCH`, `EXIT` …) runs in TypeScript on the stacks where the kernel keeps them, in the
  auto-index registers and core. A `JMP` to any other code word, such as `EMIT`, a 340 IOT, or a
  `CODE` word you wrote, goes back to the CPU as an instruction: the fetch of NEXT answers
  `jmp` to that code, with IP already stepped, as the kernel's `xct` would leave it.
- **FIND.** When the CPU fetches `find`'s first instruction, the device answers from a table of
  names, keyed by the count and name words `find` compares, and returns with `jmp i find`. The
  table follows `latest`: words defined since are added, and anything else (a dictionary rewritten
  under it) rebuilds it from the headers in core. A hit is checked against its header in core
  before it is used.

The compiler's view of this device, and of stacking another instruction set on top of it, is
[KORZ-CPU.md](KORZ-CPU.md#stacking-instruction-sets). What is built here is one cell per
fetch of NEXT. The inlined thread block is not.

It declines, and the CPU runs Mitch's code, whenever the code isn't what it expects: NEXT patched
(as `interrupt.fs` patches it), extend mode on, a cell it doesn't know, a divide by zero, an
interrupt waiting. So a program never has to know the device is there, and the device needs no
copy of anything in core.

**Time.** The device runs one thread cell per fetch of NEXT, one memory cycle: a Forth word per
cycle, as Chuck Moore's Novix ran them. A loop of primitives takes about an eighth of the cycles
(30,000 passes of `I +`: 890,000 cycles in software, 107,000 with the device). `cellsPerCycle`
turns it up; at eight, 29,000.

**Tested** against Mitch's kernel on the SIMH-style CPU: the same lines (arithmetic, signed
division, comparisons, nested loops with `I` and `J`, variables, constants, redefinitions, an
undefined word, the turtle, `WORDS`) print the same teletype output and draw the same picture on
all three Korz levels, with and without the device ([forth-device.test.ts](src/korz/forth-device.test.ts)).

**Next:** words that live only in the device, which `FIND` finds after the headers in core; then
the ROM dictionary below, so the image itself can shrink.

The device is PDP-7 Forth in Korz. There is no hardware to design: it is a set of slots. One slot
per primitive on the device's IOT codes, doing in JavaScript what Mitch's assembly does; `read`
slots over an address range in bank 1, answering from an image of his dictionary; and one IOT
that sets the registers and enters `QUIT`. It is Mitch's Forth written as slots instead of PDP-7
code, as the Korz CPU is SIMH's switch statements written as slots.

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

The first is built first. Only the second runs Forth in parallel with SYMELEC.

## A ring library in high memory

Forth already works with PIXIE rings: `pixie.s` wraps RSPPIX from the 1972 listing, and `pixie.fs`
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

## Checking it

- Mitch's kernel in core stays the reference. The same Forth programs run on both, and the
  Teletype output and stacks are compared after each line, as the four Korz levels are compared
  with each other.
- A program that uses only core words still runs on SIMH, and on Tergav's
  [RDP-9](https://github.com/tergav17/RDP-9). One that uses the device needs the device, as one
  that draws needs the 340.
- Precedent for Forth primitives as instructions: Chuck Moore's Novix NC4016 and the Harris
  RTX2000. For a Forth in ROM that is there at power-on: Mitch's Open Firmware.

## Order of work

1. ~~The device on the same image: NEXT, the primitives and FIND; compare against the kernel.~~ Done.
   Primitives as IOT cells come with the ROM, where there's no code in core to jump to.
2. The ROM dictionary in bank 1, shared with the names-in-bank-1 work; boot to `ok` with one IOT.
3. Forth beside SYMELEC on interrupts: read and write its variables, call RSPPIX on its rings.
4. The high-memory ring library, and moving drawings into SYMELEC with its relocation pass.
5. The coprocessor, if the interrupt version is too slow or too intrusive.

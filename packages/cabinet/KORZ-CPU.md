# The CPU kit

The sea in [`src/korz/korz.ts`](src/korz/korz.ts) does not know an instruction set. The CPU kit in
[`src/korz/cpu.ts`](src/korz/cpu.ts) is what every processor repeats: one sea, the rung, and one
reused context per nesting. A cabinet composes a CPU kit with whatever device kits the machine
needs. Kits do not import each other. This note is the cross-processor part. The PDP-7 compiler's
own record is [KORZ-COMPILER.md](KORZ-COMPILER.md). The sea, the resolver, and the device kit are
[KORZ-DISPATCH.md](KORZ-DISPATCH.md#domain-kits).

## What the host owns, and what a CPU file owns

`CpuHost` is built with the dimensions, the selectors, the slots, one context function, the names
of the nestings, and the rung. `interpret` searches the sea on every dispatch. `resolve`, the
default, binds the resolver's tables. `compile` binds those same tables. The CPU file then
replaces `step` with its own compiler. Templates stay with the instruction set.

The CPU file also keeps what the host cannot know:

- how a fetched word becomes coordinates,
- the poll that can steal the next instruction (a PDP-7 program interrupt, a 6502 IRQ or NMI or
  `ready`),
- the compiler, if the rung is `compile`.

Slots reach their machine as `c.cpu`, so one slot function serves every machine in the process. A
write watch saves the coordinates a nested read would clobber and puts them back. On the hot path
the CPU spells those fields out, so the watch allocates nothing.

## The rungs

Rungs belong to a CPU. The kit names three, and each CPU adds its own. The list can grow.

The kit's three are `interpret`, which searches the sea on every dispatch, `resolve`, the
default, which binds the tables, and `compile`, which binds those same tables while the CPU file
replaces `step` with its compiler. The PDP-7 adds the switch, `Pdp7`, under those three. The
Apple ][ adds the switch, `M6502`, and one more above the compiler: microM8, the WebAssembly
machine. Another oracle, when it earns a place, is another rung of that CPU.

microM8 is the Apple's oracle, and it is a large download. It boots the same floppies and shows
its own picture. The Apple page lists every rung in one menu: the Korz compiler, the switch,
the resolver, the interpreter, and microM8. It opens on the compiler. Choosing another Korz
rung reboots onto the same floppies. Choosing microM8, or leaving it, reloads the page, because
that engine is the Go program and it keeps the profile it was switched on with. A fast wait
paints one picture a game second and leaves the speaker quiet. The switch still finishes a DOS
boot and an Applesoft loop sooner than the compiler; those numbers are in
[microm8/GO-AND-TYPESCRIPT.md](microm8/GO-AND-TYPESCRIPT.md). The menu is how the page picks
([src/korz/apple2/README.md](src/korz/apple2/README.md#a-fast-wait)).

The rung is chosen when the CPU is built. A swap is a new CPU on the same machine, with the saved
state copied over. Saved state is the registers, the pins, and the cycle count. RAM, ROM, and
devices stay with whoever owns them. The compiler's cached blocks are not part of that state. A
new compiler starts empty, and a block already compiled bails out when a byte it depends on has
changed. Until an Apple snapshot is written, that swap reboots. The same floppies go back in, and
the CPU resets. The PDP-7 menu already reboots this way.

The words are cabinet, organelle, and rung. A cabinet is the architecture, the backplane, the
devices, and the processor state. An organelle is a whole machine nested inside, with its own
snapshot. A rung is who steps. Several rungs share one cabinet. microM8 is a rung and an organelle.

A CPU's own rungs agree where their pictures of the machine overlap. The kit's three agree
between instructions. A compiled block may retire many. The rung below is stepped once per
instruction the block retired, and the registers are compared there. The durable form of a
microM8 moment is its own freeze, kept beside the cabinet snapshot rather than folded into it
([SAVE-FILES.md](SAVE-FILES.md#a-rung-keeps-its-own-snapshot)). With no freeze, the same floppies
go in the drives and microM8 boots from a reset. A field is copied only when both sides have it.

## Stacking instruction sets

A second instruction set is a device. It may be a card, or it may plug into the cabinet and take
no slot. The processor underneath stays the cabinet's processor. The device engages on a fetch
whose bytes still hash, and it declines when they do not, or when a watch or a breakpoint covers
the bytes it stood in for.

The compiler pastes that device into a block only when its slots carry `emit`, and a guard that
the bytes are still the ones compiled. A slot with only `run` stays a call, and the host JIT stops
at the call. Stacking still runs. It does not, by itself, get optimized across.

A fetch slot with no `emit` ends the block. The block's exit calls it. A fetch slot with an
`emit` is how the block continues through the next instruction set, with the hash of those bytes
as the guard.

The rung under a layer is its oracle. A stacked device is checked against the interpreter of the
layer it replaced, on the same bytes. Korz′ may write the coarser edit, one change of state for a
whole call, and it is never on the hot path. Lockstep decides whether the edit stays. Measurement
decides which layer is worth an `emit`. A short block that only calls out is left to the rung
below.

A float, or any other order that is not a small integer, does not become a new width in the
tables. It stays a residual test beside them
([KORZ-DISPATCH.md](KORZ-DISPATCH.md#objects-floats-and-other-orders)).

## Two machines, one rule

| Layer | What is built | What the compiler does with it |
|---|---|---|
| PDP-7 instruction | [`compile7.ts`](src/korz/compile7.ts) | Inlines a slot when every slot in the chain has `emit`. |
| Forth NEXT, `XCT I 10` | the same | Compiles the one word it finds, and checks the word before running it. An XCT of an XCT falls back. A colon definition is not one block. [KORZ-COMPILER.md](KORZ-COMPILER.md#xct). |
| Forth device | [`forth-device.ts`](src/korz/forth-device.ts) | One thread cell per fetch of NEXT, declining when the bytes differ. Not inlined. The thread slot that would inline it is planned. [FORTH-DEVICE.md](FORTH-DEVICE.md). |
| PDP-7 IOT | the 340, the DataHand, the Turing engine | A call with the device and the pulse filled in. No vector, hand sample, or tape step in the block. On the Turing engine a batch is three instructions and the compiler ties the switch. [KORZ-COMPILER.md](KORZ-COMPILER.md#stacking-on-the-pdp-7). |
| 340 display word | [`type340.ts`](src/korz/type340.ts) | Its own sea, lockstepped against the switch. Not fused into a PDP-7 block. A display file compiled to one function is the same rule, still planned. |
| 6502 instruction | [`compile65.ts`](src/korz/compile65.ts) | A straight-line subset inlined. Anything else is a call to the switch. A fetch slot into a second instruction set is not followed yet. |
| SWEET16 | not built | Slotless. Enters at `$F689`, sixteen registers in page zero, one bytecode one edit, in lockstep with the 6502. Integer BASIC calls it for some of its work, so an Integer accelerator sits on it, and the 6502 under both. [SAVE-FILES.md](SAVE-FILES.md). |
| Applesoft float, a p-machine, a Forth, a Turing coprocessor | not built | The same slotless shape. The Turing engine at device 054 is the coprocessor already built, on the PDP-7. |
| Memory-mapped float | not built | A span of addresses whose reads and writes are Applesoft's five-byte float, or a fixed point, and whose `emit` pastes the arithmetic. The DataHand that is built is IOT registers holding a hand frame. This is the same idea of an imaginary device, on the memory bus. |

The prior art for following a thread of cells is Piumarta and Riccardi, "Optimizing direct
threaded code by selective inlining" (PLDI 1998), and Ertl and Gregg's dynamic superinstructions.
The PDP-7's planned thread block is that paper applied to Mitch's NEXT
([KORZ-COMPILER.md](KORZ-COMPILER.md#threaded-code-planned)). SWEET16, a p-machine, and a bytecode
Forth are the same paper applied to a different cell.

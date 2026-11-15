# A voyage through the sea of slots

Don Hopkins, November 2026

[A sea of slots](SEA-OF-SLOTS.md) tells why I built a PDP-7 out of Korz slots and what it does.
This is the long way round: a tour of the source code of the whole cabinet, port by port, from the
backplane to the compiler, for people who want to read the code itself.

The cabinet is meant to be read. The point of it is to learn how these things work, and to teach
them, by reading the code: a 1965 computer, its devices, and the dispatch and compiling machinery
of a dynamic language, each small enough to hold in your head. So this tour is for:

- **TypeScript programmers** who want to see what you can get out of V8 by generating code with
  `new Function` and keeping your objects in one shape.
- **Programming language enthusiasts** who want to see multiple dispatch, layered method
  combination, ahead-of-time dispatch tables, and a template compiler, all in about 1,200 lines.
- **Retrocomputing enthusiasts** who want to see a 1965 computer's instruction set, its I/O bus, and
  its vector display written down as code you can run, read, and change.
- **Me.** Walking the code port by port, and quoting it, is how I review it.

Every excerpt below is copied from the source as it stands. Paths are relative to
[`packages/cabinet`](.). To follow along:

```sh
cd packages/cabinet
npm test                                  # builds, then runs every test, about a minute
node scripts/korz-bench.mjs hand          # times one workload on every level
```

And keep a live machine open in another window:
[Forth and the turtle](https://hyperties.org/cabinet/languages/forth-turtle/?cpu=compile&forth=hardware).
Press SLOTS under the display. That panel shows, as the machine runs, which slots answer the
instruction the PDP-7 runs next and the word the display decodes next. Most stops on this tour
show up there.

At the end there's a workshop: projects to try, each with the files to start from and how to test
what you build.

## The chart

The cabinet is a TypeScript library with no dependencies at run time. A Svelte page drives it in
the browser, and the tests drive it in Node. The layers, from the bottom:

| Layer | Files | What it is |
|---|---|---|
| The bus | [`src/bus.ts`](src/bus.ts) | The interfaces a CPU and a device implement. 114 lines. |
| The backplane | [`src/cabinet.ts`](src/cabinet.ts) | One CPU and its devices, and the clock. |
| The CPU | [`src/plugins/pdp7.ts`](src/plugins/pdp7.ts) | The PDP-7 as switch statements, ported from SIMH. The oracle. |
| The devices | [`src/plugins/`](src/plugins) | Clock, teletype, Type 340 display, light pen, paper tape, disk, Turing engine, Ultimate Machine, DataHand, the Titan link. |
| The tools | [`src/asm/`](src/asm), [`src/disasm.ts`](src/disasm.ts), and more | Two assemblers, a disassembler, source maps, traces, recorded sessions. |
| Korz | [`src/korz/korz.ts`](src/korz/korz.ts) | The sea of slots: dispatch, resolution, `why`. Knows nothing about PDP-7s. |
| The Korz machines | [`src/korz/`](src/korz) | The PDP-7, its I/O bus, and the 340 as slots; the compiler; the Forth device. |
| The page | [`apps/ties/src/lib/CabinetApplet.svelte`](../../apps/ties/src/lib/CabinetApplet.svelte) | The applet. |

An **oracle**, in testing, is an implementation you trust, which the one under test must agree
with. The cabinet is a ladder of them. SIMH's C code is the oracle for `Pdp7`, the switch-statement
CPU. `Pdp7` is the oracle for the Korz interpreter, the interpreter for the resolver, and the
resolver for the compiler.

The display has two versions too. `Type340` decodes display words with a switch statement. It's
ported nearly line by line from Phil Budne's `display/type340.c` in SIMH, and it's the oracle for `KorzType340`, which decodes them with
slots, on the interpreter and on the resolver. Two more pairs work the same way. The backplane
that ticks every device every cycle is the oracle for the event-driven one. Mitch's Forth kernel
running by itself is the oracle for the same kernel with the Forth device plugged in.

## Port 1: the bus

[`src/bus.ts`](src/bus.ts) is the smallest file on the tour and the one everything else agrees on.
Its first line is a rule:

```ts
/** What a CPU puts on the I/O bus. Devices do not see the ISA. */
export type Iot = {
	device: number;
	pulse: number;
	ac: number;
};
```

An **IOT** (input/output transfer) is the PDP-7's one I/O instruction. Its word names a device code
(6 bits, so 64 devices) and a set of pulse bits, and the accumulator (AC) goes along for the ride.
The device answers with a new AC and, optionally, "skip the next instruction". That's how a
PDP-7 program asks a question: `KSF` means "skip if a key is waiting", and the instruction after it
is usually a jump back to ask again.

A device is anything with a name, a list of the codes it answers, and an `iot` method. The rest is
optional:

```ts
export interface Device {
	readonly name: string;
	/** Device-select codes this box claims. Unclaimed IOTs no-op. */
	readonly iots: readonly number[];
	iot(req: Iot): IotReply;
	/** Run `cycles` cycles; `at`, when the backplane knows it, is the number of the first. */
	tick?(cycles: number, at?: number): void;
	// …
	nextEvent?(lead: number): number;
	coreWrite?(addr: number, point: number): boolean;
	answersAhead?(code: number, pulse: number): boolean;
	irq?(): boolean;
	reset?(): void;
	power?: boolean;
	offIot?(req: Iot): IotReply;
	bindSwitches?(bindings: readonly SwitchBinding[]): void;
}
```

`nextEvent` is the interesting one. It asks the device: how many cycles until you next do
something anyone could see? Raise a flag, write core, print a character. Port 2 is what the
backplane does with the answer.

The CPU side is just as plain: `step()`, `read`, `write`, `skip`, `reset`, and a `pc` and `ac`. A
CPU that can run many instructions between device events implements `runBatch`, and that's the
door the compiler comes in by, at Port 10.

## Port 2: the backplane, and time

[`src/cabinet.ts`](src/cabinet.ts) holds one CPU and a list of devices, and it is "the one place
where time passes". There are two ways to run it.

The simple way is still there, as the oracle: tick every device every cycle and poll every
interrupt flag every step.

```ts
	private stepEveryCycle(): Step {
		// One IRQ line: the OR of every raised device flag. The ISA owns
		// what an interrupt does; the backplane only carries the wire.
		let irq = false;
		// …
		const result: Step = this.cpu.power === false ? { halt: true } : this.cpu.step();
		if (result.iot) {
			const reply = this.dispatch(result.iot);
			this.cpu.ac = reply.ac;
			if (reply.skip) this.cpu.skip();
		}
		for (let i = 0; i < devices.length; i += 1) {
			const d = devices[i]!;
			if (d.power !== false) d.tick?.(1, this.cycles);
		}
		this.cycles += 1;
		return result;
	}
```

The fast way is **event-driven**. Each device says when its next event is due, and the backplane
ticks it only then, once, for all the cycles since its last tick. A teletype that's printing a
character answers "in 900 cycles". An idle one answers `Infinity`, which means it can't change
until someone sends it an IOT. Before an IOT reaches a device, the backplane brings that device up
to the current cycle, so no one ever sees a device behind:

```ts
	private dispatch(iot: Iot): IotReply {
		// CAF 703302 — clear all flags. Backplane-level, like SIMH's reset_all.
		if (iot.device === 0o33 && iot.pulse === 0o02) {
			this.resetDevices();
			return { ac: iot.ac };
		}
		const i = this.devices.findIndex((d) => d.iots.includes(iot.device));
		if (i < 0) return { ac: iot.ac };
		const box = this.devices[i]!;
		if (!box.answersAhead?.(iot.device, iot.pulse)) this.syncUnit(i);
		if (box.power === false) return box.offIot?.(iot) ?? { ac: iot.ac };
		return box.iot(iot);
	}
```

The hard part is a device that answers `nextEvent` by **running ahead**, as the Type 340 display
does (Port 4). It draws up to 256 cycles into the future, then says "my next event is in k
cycles". If the CPU then writes a core word the display already read while it was running ahead,
the display is wrong. So the backplane asks every running-ahead device before each core write:

```ts
	/** Ahead of each core write: bring back any unit that has read the word too far ahead. */
	private readonly beforeWrite = (addr: number): void => {
		const w = this.watchers;
		const by = this.ticking;
		for (let k = 0; k < w.length; k += 1) {
			const i = w[k]!;
			if (i === by) continue;
			const point = by >= 0 && i < by ? this.cycles + 1 : this.cycles;
			if (this.devices[i]!.coreWrite!(addr, point)) this.syncTo(i, point);
		}
	};
```

Look at `point`. Within one cycle the CPU runs first, then the devices in order. A write by device
j at cycle s must be seen by the devices after j from cycle s, and by those before j from s + 1.
That one line is the whole ordering rule.

Every test that runs a real program checks the event-driven backplane against `everyCycle: true`.
Both must agree on every register at every step.

## Port 3: the PDP-7

[`src/plugins/pdp7.ts`](src/plugins/pdp7.ts) is the PDP-7 as switch statements, ported from Bob
Supnik's [SIMH](https://github.com/open-simh/simh) (`PDP18B/pdp18b_cpu.c`). It's 495 lines, and
reading it is the quickest way to learn the machine. Here are its high points.

**18-bit words, and the link above them.** The PDP-7 has an 18-bit accumulator and a one-bit link,
which catches carries and takes part in rotates. Following SIMH, the code keeps the link as bit 18,
just above the word, so link and AC together are one 19-bit number and a rotate is a shift:

```ts
const WORD = 18;
const WMASK = (1 << WORD) - 1; // 0o777777
const SIGN = 1 << 17; // 0o400000
const LINKBIT = 1 << 18; // link lives above the word, SIMH-style
```

**Memory in banks.** An instruction has 13 address bits, which reach 8K words. Above 8K, memory
comes in 8K banks, and the program counter wraps within its bank. Only a jump changes banks:

```ts
/** PC + 1 wraps within its 8K bank; only a jump changes banks. */
export function incr(pc: number): number {
	return (pc & BANK) | ((pc + 1) & ADDR);
}
```

Extend mode (the IOTs EEM, LEM, EMIR, and SEM on device 77) lets indirect addresses use 15 bits and
reach all 32K.

**Instructions.** The top four bits are the opcode, and the next bit says indirect. The
memory-reference instructions are a short list: `DAC` (deposit AC), `LAC` (load AC), `XOR`, `ADD`
(ones' complement, with end-around carry), `TAD` (two's complement), `AND`, `SAD` (skip if AC
differs), `ISZ` (increment and skip if zero), `JMP`, `JMS` (jump to subroutine), `DZM` (deposit
zero), and `XCT`, which executes the word at an address as if it were the next instruction.

**Auto-index registers.** Locations 10 to 17 of each bank increment themselves when used
indirectly, before the address is used. They are the PDP-7's index registers, and they live in
core:

```ts
	protected resolveIndirect(ma: number, jmp: boolean): number {
		let t: number;
		if ((ma & ADDR & ~0o7) === 0o10) {
			t = (this.read(ma) + 1) & WMASK;
			this.write(ma, t);
		} else {
			t = this.read(ma);
		}
		// …
		return this.extend ? t & XADDR : (ma & BANK) | (t & ADDR);
	}
```

**Subroutines without a stack.** `JMS` stores the return address in the subroutine's first word and
starts at its second. A subroutine returns with `JMP I` through its own first word. The stored word
carries the link in its sign bit and the extend-mode flag in bit 16:

```ts
	protected jmsWord(): number {
		return ((this.link & 1) << 17) | (this.extend ? EXTEND_BIT : 0) | (this.pc & XADDR);
	}
```

`CAL` is `JMS 20`. It ignores its own address field, which Forth turns to good use at Port 6.
An interrupt is the same trick at location 0. There is one interrupt level, with no vectors: the
CPU saves the PC at 0 and starts at 1. `ION` turns interrupts on after one more instruction, so a
handler can turn them on and return before the next one arrives.

**The operate group.** Opcode 74 isn't one instruction. It's a word of control bits for several
steps that run at once, which DEC called microprogrammed. A skip group tests the AC and link; then
clear and complement act on AC and link; then `OAS` ORs in the console switches; then a rotate;
then maybe `HLT`. `CLA CLL` is one instruction, and so is `SZA CLA` ("skip if AC is zero, then
clear it"). The code decodes each field with its own switch:

```ts
		switch ((ir >> 6) & 0o17) { // skip group, IR<8:11>
			case 0o00: break;
			case 0o01: skp = (lac & SIGN) !== 0; break; // SMA
			case 0o02: skp = (lac & WMASK) === 0; break; // SZA
			// …
		}

		switch (((ir >> 9) & 0o14) | (ir & 0o3)) { // CLA/CLL/CMA/CML, IR<5:6,16:17>
			// …
		}

		if (ir & 0o4) lac |= this.switches; // OAS; LAS is CLA OAS

		switch (((ir >> 8) & 0o4) | ((ir >> 3) & 0o3)) { // rotates, IR<7,13:14>
			// …
		}
```

With the indirect bit set, opcode 74 is `LAW`, "load AC with this word": the instruction itself is
the constant. That's the PDP-7's only immediate operand.

**The EAE.** The Extended Arithmetic Element is an option: multiply, divide, normalize, and long
shifts across AC and its multiplier-quotient register, MQ. Multiply and divide take their operand
from the word after the instruction.

**IOT.** Device 0 pulse 2 is `IOF` and pulse 42 is `ION`, handled inside the CPU. Device 77 is
memory extension. Everything else goes out on the bus. Bit 010 of an IOT clears the AC before the
pulse, so "read a key" (`KRB`, 700312) is "clear AC, then OR the key in".

## Port 4: the devices

Each device is a class implementing `Device`, in [`src/plugins/`](src/plugins). Each has its
`iot()`, and, since Port 9, a list of Korz slots that does the same thing. The `iot()` stays as the
oracle.

**The clock** ([`clock.ts`](src/plugins/clock.ts)) shows how much of the PDP-7's personality lives in
core. The line clock doesn't keep a counter of its own. Each tick, sixty times a second, it adds
one to location 7, and raises its flag when that overflows to zero. So a program sets the period of
its next interrupt by storing a negative number in location 7, and SYMELEC does exactly that to set
how fast its cursor blinks:

```ts
	tick(cycles: number): void {
		this.accum += cycles;
		while (this.accum >= this.cyclesPerTick) {
			this.accum -= this.cyclesPerTick;
			if (!this.on) continue;
			const n = (this.cpu.read(0o7) + 1) & 0o777777;
			this.cpu.write(0o7, n);
			if (n === 0) this.flag = true;
		}
	}

	/** The next tick of the line clock bumps location 7; stopped, nothing happens until CLON. */
	nextEvent(): number {
		return this.on ? this.cyclesPerTick - this.accum : Infinity;
	}
```

At 1.75 µs a cycle, a sixtieth of a second is about 9,524 cycles; the default is 9,500.

**The teletype** ([`teletype.ts`](src/plugins/teletype.ts)) is a KSR-33, keyboard on device 3 and
printer on device 4. It's the cleanest example of the pulse convention: pulse 1 skips on the flag,
pulse 2 clears it (and the keyboard ORs its character into the AC), pulse 4 loads and prints.

**The Type 340** ([`type340.ts`](src/plugins/type340.ts)) is the biggest device and the one this
whole project grew from. It's a display processor: it reads its own program, a display file, out
of the PDP-7's core by direct memory access (DMA), and draws lines on a CRT, while the PDP-7 gets
on with something else. Its instruction set has modes. A parameter word sets the mode, scale, and
intensity. Point mode moves the beam. Vector mode draws a line from a word's dx and dy. Increment
mode draws four short steps in a word, character mode draws three characters from the 342
character generator, and vector-continue draws to the edge of the screen. The 347 subroutine
option adds jumps and one level of subroutine call (DJP, DJS), and DDS, which PIXIE uses to set up
its lightbuttons. The cabinet adds a tag word, DTG, so every line it draws can say which record
in core it came from.

The 340 is also where the backplane's running ahead earns its keep. Its `nextEvent` takes a
snapshot, draws ahead up to `lead` cycles, and keeps a note of the cycle at which it read each
display address:

```ts
	nextEvent(lead = 1): number {
		if (!this.enabled || this.status !== 0) return Infinity;
		if (lead <= 1 || this.wordsPerTick !== 1) return 1;
		const max = Math.min(lead, LEAD);
		this.ahead = this.snapshot();
		let k = 0;
		while (k < max && !this.storesNext()) {
			this.ownClock += 1;
			this.cycle();
			this.time += 1;
			k += 1;
			if (this.status !== 0) break;
		}
		// …
	}

	coreWrite(addr: number, _point: number): boolean {
		return this.ahead !== null && this.readAt[addr & ADDR]! >= this.ahead.time;
	}
```

If the CPU writes a word the 340 read ahead, `coreWrite` says so, and the backplane rolls the 340
back to the snapshot and replays it to the write. A program that edits its display file while the
340 draws it, which is what PIXIE does all day, sees exactly what it would have seen on the real
machine.

**The light pen** ([`lightpen.ts`](src/plugins/lightpen.ts)) is tested against every line as it's
drawn. The 340 takes any number of pens, ORed onto its one pen input, as photocell amplifiers would
have been. 1972 programs can't tell. A cabinet IOT on the free device code 11, IDPN, says which pen
fired, so a program written now can tell them apart.

**The rest of the fleet:**

- [`papertape.ts`](src/plugins/papertape.ts): the paper tape reader that loads programs.
- [`rb09.ts`](src/plugins/rb09.ts): the RB09 fixed-head disk UNIX boots from.
- [`turing.ts`](src/plugins/turing.ts): a Turing machine coprocessor on device 54. It runs
  transition tables out of core, the way the 340 runs display files, and it comes in three layers:
  the engine knows nothing about PDP-7s, `TuringDevice` puts it on the bus, and `TuringCpu` makes
  it a whole cabinet by itself.
- [`ultimate.ts`](src/plugins/ultimate.ts): Marvin Minsky's Ultimate Machine, the box whose only
  function is to switch itself off, on devices 55 and 56. It turns its own power off with the
  backplane's power switch, and a limit switch keeps it ticking until its arm is home.
- [`hand.ts`](src/plugins/hand.ts) and [`datahand.ts`](src/plugins/datahand.ts): a hand from a
  webcam, as numbers a PDP-7 can use. The 21 points a hand tracker reports become a palm frame and
  twenty bones in turtle moves: yaw, pitch, and length in the 340's pixels. Video never reaches the
  machine.
- [`tiny-titan.ts`](src/plugins/tiny-titan.ts) and [`titan-files.ts`](src/plugins/titan-files.ts):
  the far end of PIXIE's link to Cambridge's Titan mainframe, and a file service beside it. The
  PDP-7 polls for the link in a loop, and as the source puts it, "the 1969 polling loop IS the
  await". An in-process host answers at once, and a remote one sits behind a buffer.

## Port 5: the tools

A tour of an emulator usually skips the tools. Here they're half the fun.

- **Assemblers.** [`asm/as7.ts`](src/asm/as7.ts) is Ken Thompson's `as`, the PDP-7 UNIX assembler,
  written from the language, with the Perl `as7` from Warren Toomey's pdp7-unix project as its oracle.
  [`asm/dec.ts`](src/asm/dec.ts) is DEC's 1964 assembler language, the dialect of the program
  library listings. Both share one back end, [`asm/core.ts`](src/asm/core.ts).
- **The disassembler** ([`disasm.ts`](src/disasm.ts)). Every word decodes as something, and its
  output assembles back to the same word in either dialect; the tests check every word. Whether a
  word is an instruction at all, the word can't say. That's the source map's job.
- **Source maps** ([`source.ts`](src/source.ts)): which source line assembled each core address,
  and what the assembler put there. So the page can show you where core no longer holds what the
  source says: patches, variables, return addresses, code that rewrites itself. One image can have
  several maps over the same words, such as SYMELEC's 1972 listing and its regenerated `as7` source.
- **Traces** ([`trace.ts`](src/trace.ts)): a ring of the last instructions fetched, with the AC
  each one found.
- **Recorded sessions** ([`session.ts`](src/session.ts)). Everything that reaches the machine from
  outside (switches, pen, keys, pokes) is stamped with the machine cycle it arrived at. The
  emulator only advances by cycles, so the same inputs at the same cycles replay the same run, at
  any speed, in a browser or headless in Node.
- **Hover and tags** ([`hover.ts`](src/hover.ts), [`tags.ts`](src/tags.ts)): what's under the
  cursor, read off the display list, and what the record a DTG tag points at says about it.
- **Core files** ([`core.ts`](src/core.ts)): all of core as raw words, JSON, or YAML in rows of
  eight octal words.
- **Media** ([`media.ts`](src/media.ts)): exports of the stream of line segments, which the
  screenshot, the video, the phosphor, and the light pen all consume.

## Port 6: the software

Three programs carry most of the weight: UNIX, SYMELEC, and Forth. UNIX
([`unixv0.ts`](src/unixv0.ts)) boots Ken Thompson and Dennis Ritchie's 1969 system from the RB09 disk
with Phil Budne's bootstrap. SYMELEC ([`symelec-demo.ts`](src/symelec-demo.ts)) is PIXIE's main
program, driven by a scripted light pen whose time is machine cycles, so the same script draws the
same picture at any speed.

Mitch Bradley's Forth ([`tapes/pdp7forth/kernel-names-full.s`](tapes/pdp7forth/kernel-names-full.s))
is the best demonstration of the PDP-7 I know, because it makes its odd features do the work.
Here's the whole inner interpreter:

```
next:	xct i 010	" pre-increment IP, execute the thread cell
	dac i 012	" push AC (only reached by constant/variable cells)
	jmp next
```

A Forth program is a thread: a list of cells, one per word to run. **Threaded code** usually means
a loop that reads the next cell and jumps through it. Mitch's thread cells are PDP-7 instructions,
and `NEXT` executes them with `XCT`:

- Location 10 is the instruction pointer, IP. It's an auto-index register, so `xct i 010` steps IP
  and fetches the cell in one instruction.
- A colon definition's cell is its bare address, which as an instruction is `CAL`. `CAL` ignores its
  address field and does `JMS 20`, which lands in `nest`. `nest` reads the cell back through IP to
  find the body. The trap the PDP-7 provides for system calls is Forth's call instruction.
- A constant's cell is `LAC` of where the value is. `XCT` loads it, and `NEXT` falls through to
  `dac i 012`, which pushes it.
- A variable's cell is `LAW` of its address: the cell is its own value, and it gets pushed too.
- A primitive's cell is `JMP` to its machine code, which ends with `jmp next`.

Locations 11 and 12 are the return stack and data stack pointers, also auto-index registers, so
`dac i 011` is "push AC on the return stack". And `DO … LOOP` keeps its counter as index minus
limit, so it counts up to zero, and `ISZ` (increment, skip if zero) does the test:

```
xloop:	lac 011
	dac t2
	isz i t2	" counter++; skips when it reaches 0
	jmp bran	" not done: loop back
```

[`src/forth.ts`](src/forth.ts) assembles the kernel with the cabinet's `as7` and compiles Mitch's
Forth prelude into the image. [`tapes/pdp7forth/code.fs`](tapes/pdp7forth/code.fs) writes CODE
words in Forth, laying PDP-7 instructions down at `HERE` with `,`. Port 12 comes back to this
kernel with something new.

## Port 7: Korz

Now the sea. [Korz](https://doi.org/10.1145/2661136.2661147) is David Ungar, Harold
Ossher, and Doug Kimelman's 2014 language: Self without the objects. A method is a **slot**
with a **guard**, a condition on the **context** of a call, and every call looks up the most
specific slot whose guard matches. [`src/korz/korz.ts`](src/korz/korz.ts) is my implementation
for emulators. It's 570 lines, and it knows nothing about PDP-7s.

**Dimensions and guards.** A context is a point in a space of named integer **dimensions**. A
guard constrains some dimensions to sets of values, and a dimension it doesn't mention is
unconstrained:

```ts
export type Dim = {
	readonly name: string;
	readonly width: number;
	/** Enum members, in value order. A guard may name them. */
	readonly names?: readonly string[];
};

/** A number, an enum member's name, a mask and match, or a span. A list is their union. */
export type Coord = number | string | Bits | Span;
export type GuardSpec = Readonly<Record<string, Coord | readonly Coord[]>>;
```

So `{ op: 0o17, ind: 0 }` is a guard, `{ who: "cpu", access: "fetch" }` is a guard, and
`{ top: bits(2, 2) }` matches every value with bit 1 set.

**Sets as bitsets.** Each guard becomes, per dimension, a set of values stored as a bitset in a
`Uint32Array`, with `null` meaning the whole domain. A dimension is at most 20 bits wide, so its
largest set is 32,768 words:

```ts
/** A set over one dimension's domain, as a bitset; `null` is the whole domain. */
type DimSet = Uint32Array | null;
```

**Specificity.** Slot A is at least as specific as slot B when A's set is inside B's on every
dimension. That's the entire rule, and it's a subset test:

```ts
function subset(a: DimSet, b: DimSet): boolean {
	if (b === null) return true;
	if (a === null) return false;
	return a.every((w, i) => (w & ~b[i]!) === 0);
}

function le<C>(a: Slot<C>, b: Slot<C>): boolean {
	return a.sets.every((s, d) => subset(s, b.sets[d]!));
}
```

There's no class hierarchy and no ordering of arguments. A slot that guards on more, or on less of
a dimension, is more specific, on every dimension at once. That's **multiple dispatch**, choosing
code by more than one argument, done as geometry.

**Layers, chains, and `next`.** Slots come in three layers, outermost first: `observe`, `patch`,
and `machine`. A call runs a chain: the most specific matching slot of each layer, then the next
most specific, and so on, and each slot decides whether to call `next` and run the rest. That's
**method combination** in the sense of CLOS's `:around` methods, or aspects, with the order fixed by
the guards instead of by whoever loaded last:

```ts
	chain(selector: string, c: C): Slot<C>[] {
		const matching = (this.bySelector.get(selector) ?? []).filter((s) => this.matches(s, c));
		const out: Slot<C>[] = [];
		for (const layer of LAYERS) {
			let rest = matching.filter((s) => s.layer === layer);
			let first = true;
			while (rest.length) {
				const min = rest.find((m) => rest.every((o) => o === m || le(m, o)));
				// …
				out.push(min);
				rest = rest.filter((s) => s !== min);
				first = false;
			}
		}
		return out;
	}
```

**The interpreter.** `dispatch` computes the chain and calls it. It's slow and obviously right,
and that's its job: it's the oracle for everything faster.

**Ambiguity when you install, not when you crash.** Two slots can overlap with neither more
specific, like a slot for `ind: 1` and one for `op: 0o14`. That's fine only if every point in the
overlap has a third slot more specific than both. `install` checks that by walking the points of
the overlap, and if it fails, it puts the sea back as it was and throws an error that names the
two slots and the point. Installing is a transaction:

```ts
	/** Add slots as one transaction: all of them, or none and an AmbiguityError naming the conflict. */
	install(specs: readonly SlotSpec<C>[]): Slot<C>[] {
```

**Resolution.** Here's the idea that makes it fast. For one selector, only the dimensions some of
its slots constrain can change the answer. Take the product of those dimensions' domains, compute
the chain at every point ahead of time, and the call becomes a table lookup. Equal chains are
**interned** (stored once and shared). On a PDP-7 with no devices plugged in, the `iot` table
has 4,096 entries and four distinct chains:

```ts
	resolve(selector: string, limit = TABLE_LIMIT): Resolved<C> | null {
		const slots = this.bySelector.get(selector) ?? [];
		const rel = [...new Set(slots.flatMap((s) => s.constrained))].sort((a, b) => a - b);
		const bits = rel.reduce((n, d) => n + this.dims[d]!.width, 0);
		if (2 ** bits > limit) return null;
```

A point where the interpreter would throw gets an entry that throws the same error when it's
called, so the table agrees with the interpreter even about failures.

**Kinds, when the table is too big.** A wide dimension can blow the table up. A slot guarded on
one address makes `read`'s table range over all 32,768 addresses, times `who`, times `access`:
262,144 entries, most of them the same chain. Past 65,536 entries, `plan` replaces the widest
dimensions, one at a time, by their **kinds**. Two values are the same kind when every slot's guard
on that dimension holds both or neither, so they always get the same chain. A lookup array maps
each value to its kind, and the table ranges over kinds:

```ts
/** Values are one kind when every slot's set on dimension `d` holds all of them or none. Null past 65,536 kinds. */
function kindsOf<C>(slots: readonly Slot<C>[], d: number, width: number): Kinds | null {
	const sets = slots.map((s) => s.sets[d]!).filter((s) => s !== null);
	const map = new Uint16Array(1 << width);
	const reps: number[] = [];
	const ids = new Map<string, number>();
	for (let v = 0; v < 1 << width; v += 1) {
		let key = "";
		for (const s of sets) key += has(s, v) ? "1" : "0";
		// …
		map[v] = id;
	}
	return { map, reps };
}
```

With the Forth device plugged in (Port 12), `read`'s addresses come in three kinds: `NEXT`, `find`,
and everything else. The table has 24 entries, and the index costs one more array load:

```js
this["read$"][this["read$addr"][(c["addr"] & 32767)] * 8 + (c["who"] & 3) * 2 + (c["access"] & 1)]
```

This is the compressed dispatch table that Eric Amiel, Olivier Gruber, and Eric Simon described
for multimethods in 1994. Tables that fit stay indexed by value, so compressing never costs a table
that didn't need it.

**Generated methods, shared by every machine.** The index expression is generated as JavaScript
and compiled once per selector and expression, for the whole process:

```ts
		m = new Function(`return function korz_${name}(c) {
	const e = this[${JSON.stringify(tableKey(selector))}][${expr}];
	const v = e.k === null ? e.r(c, e.p) : e.r(c, () => e.k(c));
	return v === undefined ? 0 : v;
};
//# sourceURL=korz/${name}.js`)() as (c: never) => number;
```

This is the part for TypeScript programmers. V8 makes a call fast with an **inline cache**: each
call site remembers the target and the object shape (its **hidden class**) it saw last. A site
that sees one is **monomorphic** and fast. A site that sees many becomes **megamorphic** and stays
slow. So the generated method reads its table from `this` instead of closing over it, and every
machine in the process shares the same function object. Two PDP-7s on one page have the same call
targets, and V8 specializes the sites once. The `sourceURL` comment makes each generated function
show up in the browser's debugger as `korz/exec.js`, and you can set breakpoints in it.

`bind` points an object's fields at those methods and rebuilds just the touched selectors after
every install or remove, before `install` returns. A call site never sees a stub that checks
whether its table is stale:

```ts
	/**
	 * Point each named field of `target` at its selector's resolved dispatch, with no check per call.
	 * Each install or remove rebuilds the tables of the selectors it touched before it returns, so a
	 * call site only ever sees the shared generated methods: a stub called once through a site V8 has
	 * specialized on one target would make that site megamorphic for good.
	 */
	bind<K extends string>(target: Dispatchers<C, K>, selectors: readonly K[], limit?: number): void {
```

**Asking why.** `why(selector, context)` lists every slot of a selector, whether it matched, and why
it ran, where it sits in the chain, or the first dimension that rules it out. That's what the SLOTS
panel shows. `view(query)` answers questions like "every slot that touches page 7".

## Port 8: the PDP-7 as a sea

[`src/korz/pdp7.ts`](src/korz/pdp7.ts) is `KorzPdp7`. It inherits the registers and the EAE's
arithmetic from `Pdp7`, and makes everything that decides what runs into a slot.

**The dimensions are the instruction format.** Each one is a field of the instruction word or a
fact about the access:

```ts
export const PDP7_DIMS: readonly Dim[] = [
	{ name: "op", width: 4 },
	{ name: "ind", width: 1 },
	/** OPR skip group, IR<8:11>. */
	{ name: "skp", width: 4 },
	/** OPR CLA/CLL/CMA/CML, IR<5:6,16:17>. */
	{ name: "cc", width: 4 },
	/** OPR rotates, IR<7,13:14>. */
	{ name: "rot", width: 3 },
	{ name: "addr", width: 15 },
	{ name: "who", width: 2, names: ["cpu", "device", "debugger"] },
	/** A read is a data read or an instruction fetch; a watch on fetches guards `access: "fetch"`. */
	{ name: "access", width: 1, names: ["read", "fetch"] },
	{ name: "device", width: 6 },
	{ name: "pulse", width: 6 },
	/** Pulse bits 060: the group a device splits its codes into. */
	{ name: "sub", width: 2 },
	/** The timed pulse being fired: IOP1, IOP2 or IOP4. */
	{ name: "iop", width: 3 },
];
```

**One shape for every context.** A context is a plain object, `K7`, with every field present
from the start, so V8 gives every context one hidden class. Instructions, memory accesses, and IOTs
nest (an instruction reads memory, which can run a device), so the CPU keeps three contexts, `ix`,
`mem`, and `io`, and fills in fields instead of allocating. A step allocates nothing.

**Slots reach their machine through the context.** The CPU's slots are static, built once for
the process. A slot gets its machine as `c.cpu`, so one set of slot functions serves every
machine:

```ts
			op("lac", (c) => { const m = c.cpu; m.ac = m.read(c.ea); }),
			op("xor", (c) => { const m = c.cpu; m.ac = (m.ac ^ m.read(c.ea)) & WMASK; }),
			// …
			op("jmp", (c) => { c.cpu.pc = c.ea; }),
```

**Effective addresses are where specificity shines.** The base case is a direct address.
Indirect overrides it for the memory-reference opcodes, `JMP I` overrides that (because of extend
mode's EMIR), and `CAL` overrides direct addressing:

```ts
			{ selector: "ea", by: "direct: the address field in this word's bank", run: direct, emit: T7.direct },
			{ selector: "ea", guard: { ind: 1, op: span(0, OP.jmp + 1) }, by: "indirect, auto-indexing 10-17",
				run: (c) => c.cpu.resolveIndirect(direct(c), false), emit: T7.indirect },
			{ selector: "ea", guard: { ind: 1, op: OP.jmp }, by: "JMP I: indirect, EMIR restores extend mode",
				run: (c) => c.cpu.resolveIndirect(direct(c), true), emit: T7.jmpIndirect },
			{ selector: "ea", guard: { op: OP.cal, ind: 0 }, by: "CAL: 20, absolute in extend mode", run: (c) => cal(c.cpu), emit: T7.calEa },
```

Read the guards as a lattice: `{}` is above `{ ind: 1, op: 0-14 }`, which is above
`{ ind: 1, op: 14 }`. Nobody wrote an `if` to make `JMP I` win. It's more specific, so it wins.
The `by` strings are what `why` shows you.

**The operate group is three selectors.** Its three fields are independent, so each is its own
selector, with sixteen, sixteen, and eight slots, and the `OPR` slot calls all three:

```ts
	private operate(c: K7): void {
		const ir = c.ir;
		c.lac = this.lac();
		c.skp = (ir >> 6) & 0o17;
		const skp = this.go.skip(c);
		c.cc = ((ir >> 9) & 0o14) | (ir & 0o3);
		c.lac = this.go.cc(c);
		if (ir & 0o4) c.lac |= this.switches; // OAS; LAS is CLA OAS
		c.rot = ((ir >> 8) & 0o4) | ((ir >> 3) & 0o3);
		this.setLac(this.go.rot(c));
		if (ir & 0o40) this.halted = true; // HLT
		if (skp) this.pc = incr(this.pc);
	}
```

**The CPU's own IOTs are on the same bus as the devices.** `IOF`, `ION`, and memory extension
are `iot` slots more specific than the clock's, which shares device 0. When the CPU is plugged into
a backplane, `backplaneSlots` adds the rest. Unclaimed codes do nothing, CAF clears every flag, and
each device either installs its own slots or answers through `iot()`. Each device code also gets a
**patch-layer** slot that answers for the device while its power is off:

```ts
		...box.devices.flatMap((d): SlotSpec<K7>[] => [
			...d.iots.map((device): SlotSpec<K7> =>
				({ selector: "iot", guard: { device }, layer: "patch", by: `power: ${d.name} off`, run: off(d) })),
			...(isKorzDevice(d)
				? d.korzSlots(cpu)
				: d.iots.map((device): SlotSpec<K7> => ({ selector: "iot", guard: { device }, by: `device ${d.name}: iot()`, run: call(d) }))),
		]),
```

That's why the SLOTS panel shows "power: type340 off → 340 device 06: IOP1, IOP2, IOP4" for an
IOT to the display: the power slot runs first and calls `next` because the 340 is on.

**Watching writes is an observe slot.** The backplane's "tell me before a core write lands",
from Port 2, is one slot in the `observe` layer, installed only while some device runs ahead:

```ts
		this.sea.install([{ selector: "write", layer: "observe", by: WATCH, emit: T7.watch, run: (c, next) => {
			const { addr, value, who, access } = c;
			before(addr);
			// …
			return next();
		} }]);
```

## Port 9: the I/O bus as slots

[`src/korz/iop.ts`](src/korz/iop.ts) is short, and it models a real piece of the PDP-7. An IOT's
pulse bits fire as three timed pulses, IOP1, IOP2, and IOP4, in that order. A device gate answers
one of them. So most devices are one slot per gate, on a selector named `iop`:

```ts
/** The device answers its code with timed pulses. */
export const timed = (bus: IopBus, device: number, by: string): SlotSpec<Iop> =>
	({ selector: "iot", guard: { device }, by: `${by}: IOP1, IOP2, IOP4`, run: (c) => bus.pulses(c) });

/** One gate: what the device does on one pulse of one code, optionally in one group. */
export const gate = (device: number, iop: 1 | 2 | 4, by: string, run: Run<Iop>, sub?: number | readonly number[]): SlotSpec<Iop> =>
	({ selector: "iop", guard: sub === undefined ? { device, iop } : { device, iop, sub }, by, run });
```

Here's the clock's whole instruction set, which reads like the page of the manual it came from:

```ts
	korzSlots(bus: IopBus) {
		return [
			timed(bus, 0o00, "clock"),
			skipIf(0o00, "clock CLSF: skip on tick", () => this.flag),
			gate(0o00, 4, "clock CLOF: clear flag, stop", () => { this.flag = false; this.on = false; }, [0, 1]),
			gate(0o00, 4, "clock CLON: clear flag, run", () => { this.flag = false; this.on = true; }, [2, 3]),
		];
	}
```

A device that decodes the whole pulse in its own order, as the Turing engine's group 40 does (it
sets the mode on IOP2 before it steps on IOP1), installs an `iot` slot guarded on `device` and
`sub`. That's more specific than its `timed` slot, so it wins.

Because the devices' slots go into the CPU's sea, the resolver builds one I/O table for the whole
machine: 4,096 entries over device and pulse. An IOT costs one table lookup no matter how many
devices are plugged in.

## Port 10: the compiler

[`src/korz/compile7.ts`](src/korz/compile7.ts) is the fourth level. It compiles runs of PDP-7
instructions into JavaScript functions, from the chains the sea gives each instruction, and runs
them in batches between device events. [KORZ-COMPILER.md](KORZ-COMPILER.md) is its design.

**Templates.** A slot can carry an `emit`, a template that writes its behavior as code. The
sea carries it and never looks at it. For the PDP-7, templates are functions from a `Gen7`
(the instruction, and the compiler's view of memory) to a `Code7` (statements, a value, a skip
condition, a jump target):

```ts
	lac: ((g) => ({ code: `m.ac = ${g.read(g.ea)};` })) as Emit7,
	sad: ((g) => ({ skip: `m.ac !== ${g.read(g.ea)}` })) as Emit7,
	isz: ((g) => ({ code: `const n = (${g.read(g.ea)} + 1) & ${W}; ${g.write(g.ea, "n")}`, skip: "n === 0" })) as Emit7,
	jmp: ((g) => ({ jump: g.ea })) as Emit7,
```

**Chains become code.** The compiler asks the sea for each chain, with the coordinates it knows
when it compiles. A chain where every slot has a template is composed into one piece of code:
observe slots first, then the slot that answers. Anything else is called the way the resolver
calls it. So a slot you add without a template still works; it just isn't inlined:

```ts
function compose(chain: readonly Slot<K7>[] | null, g: Gen7): Code7 | null {
	if (chain === null) return null;
	let code = "";
	for (const s of chain) {
		if (typeof s.emit !== "function") return null;
		const c = (s.emit as Emit7)(g);
		if (c === null) return null;
		if (c.next === true) {
			code += `${c.code ?? ""} `;
			continue;
		}
		return code === "" ? c : { ...c, code: `${code}${c.code ?? ""}` };
	}
	return null;
}
```

For an operate-group instruction, the `opr` template asks for its three fields' chains and
writes straight-line code with only the steps that word uses. `CLA CLL` compiles to `l = 0`.

**Blocks, and time.** A block follows the instructions from its entry until a jump it can't
follow, at most 64 instructions, compiling a skip's next word under an `if`. Every instruction
ends with a check that the next device event isn't due:

```ts
const tick = (pc: number | string): string =>
	`if (k.cycles + 1 >= k.next || k.cycles + 1 >= k.until) { m.pc = ${pc}; return 1; } k.cycles += 1;`;
```

So compiled code stops on exactly the cycle the backplane would have stopped the interpreter on.

**Code that rewrites itself.** PDP-7 programs store into their own instructions all the time:
`JMS` writes the return address into the subroutine's first word, and loops patch their own
addresses. Each core word a block was compiled from is marked. A store to a marked word invalidates
every block built from it, and a block that stores checks it's still valid before going on:

```ts
	touch(a: number): void {
		const list = this.users[a];
		this.marks[a] = 0;
		this.users[a] = undefined;
		if (list === undefined) return;
		for (const b of list) {
			if (!b.valid) continue;
			b.valid = false;
			this.invalidated += 1;
			if (this.blocks[b.entry] === b) this.blocks[b.entry] = undefined;
		}
	}
```

**XCT, and Forth's NEXT.** `xct i 010` executes a different word every time. The compiler can't
inline it, so each `XCT` keeps a little cache of the words it has executed, by address, each
compiled as a one-instruction function, and checks that the word is still the one it compiled:

```ts
	xct: ((g) => {
		const cells = g.constant(new Map());
		const e = typeof g.ea === "number" ? String(g.ea) : g.ea;
		return {
			code: `const w = ${g.read(g.ea)}; let x = ${cells}.get(${e}); if (x === undefined || x.w !== w) x = J.cell(${cells}, ${e}, w, ${g.next}); x.run(m);`,
			jump: "m.pc",
			recheck: true,
		};
	}) as Emit7,
```

**DMA gets compiled too.** The 340, the disk, and the Turing engine reach core through the
CPU's `read` and `write`. When no slot guards those on an address, the compiler generates them
as well, from the same chains, so a device's call into `cpu.read` is a single array access.

**When it steps instead.** The compiler runs blocks only while nothing can interrupt the run:
no interrupt pending, `ION`'s one-instruction delay over, the CPU not halted, and no trace
recording. Otherwise it steps one instruction at a time with the resolver. That's why the page
records a trace only while the memory panel's trace view is open.

## Port 11: the 340 as a sea

[`src/korz/type340.ts`](src/korz/type340.ts) puts the display processor's own instruction set in a
sea. Its tradeoffs are the opposite of the CPU's, and that's what makes it worth reading.

The CPU has twelve dimensions and over a hundred slots. The 340 needs two dimensions: its mode,
and the top two bits of the word, which choose what happens in some modes (escape back to parameter
mode in vector and increment modes, X or Y in point mode, the jump type in subroutine mode):

```ts
export const DIMS_340: readonly Dim[] = [
	{ name: "mode", width: 3, names: ["param", "point", "slave", "char", "vector", "vcont", "incr", "subr"] },
	{ name: "top", width: 2 },
];
```

Fourteen slots cover it, and the resolved table has 32 entries:

```ts
		{ selector: "word", guard: { mode: "subr", top: 2 }, by: "347 DJP: jump", run: (c) => {
			const d = c.d;
			d.mode = GETFIELD(c.word, 2, 4) as Mode;
			d.dac = GETFIELD(c.word, 5, 17) & ADDR;
			d.block = d.dac;
			return 0;
		} },
```

`KorzType340` overrides one method of `Type340`, `decode`, and leaves the original switch in place
as the oracle. A fuzz test runs 200 random display files on both, with a light pen and random
restarts, and compares every register and every line drawn. On the hand workload the 340 on slots
costs the same as the switch, within a nanosecond a step.

You can pick the CPU's level and the 340's separately. The page uses the switch 340 with the
switch CPU and the slots 340 with every Korz level, and the benchmark takes `--display switch` or
`--display slots`.

## Port 12: the Forth device

[`src/korz/forth-device.ts`](src/korz/forth-device.ts) is the payoff for Port 6, and the strongest
argument I have for building a CPU out of slots. [FORTH-DEVICE.md](FORTH-DEVICE.md) is its design.

It's two slots on `read`. One answers the CPU's fetch of `NEXT`'s first word:

```ts
		const slots: SlotSpec<K7>[] = [{
			selector: "read", guard: { addr: this.next, access: "fetch", who: "cpu" }, by: "forth device: NEXT",
			run: (_c, next) => {
				const w = next();
				return w === XCT_NEXT && !cpu.extend ? this.inner(cpu) : w;
			},
		}];
```

Instead of handing back `xct i 010`, the slot walks the thread itself, in TypeScript, on the same
stacks in the same core words Mitch's code uses. It decodes each cell the way `XCT` would: a bare
address nests, `LAC` and `LAW` push, and a `JMP` to one of 30 known primitives runs here. For any
other `JMP`, it hands the CPU a `JMP` to that code, and the PDP-7 runs it and comes back through
`NEXT` as always:

```ts
			} else if (op === 0o30) {
				// JMP: a primitive. Run it here, or hand its code to the CPU.
				m.write(IP, ip);
				const target = cell & A;
				const run = this.code[target];
				if (run === undefined || !run()) {
					this.stats.cells += ran + 1;
					this.stats.handoffs += 1;
					return JMP | target;
				}
			} else break;
```

When the device isn't sure, it declines and lets the CPU's own `NEXT` run: an interrupt waiting,
an unknown kind of cell, or someone having patched `NEXT`. A primitive can decline too: `/` returns
false on a divide by zero, before changing anything, and the PDP-7 code does whatever Mitch's code
does. Nothing in core changes, so the oracle is the same image with the device unplugged.

The second slot answers the fetch of `find`'s first word, from a table of names kept beside the
dictionary, so looking up a word doesn't walk the dictionary's linked list in core.

Nothing in `KorzPdp7` knows the device exists. It's two slots more specific than core's `read`. The
SLOTS panel's FORTH line counts what it does: cells run, code words handed to the CPU, fetches it
declined, and `FIND` lookups.

## Port 13: the tests

The tests live beside the code, in `*.test.ts` files, run by Node's built-in test runner. They're
worth reading as a set, because they show how to test a system made of interchangeable levels.

**Fuzzing with random cores.** The first PDP-7 test fills core with random words and runs `Pdp7` and
`KorzPdp7` side by side, comparing registers after every step and all of core at the end, for 300
seeds, at each Korz level:

```ts
	for (let seed = 1; seed <= 300; seed += 1) {
		const { a, b, r, coreWords } = cores(seed, korz);
		for (let n = 0; n < 2000; n += 1) {
			const irq = (r() & 7) === 0;
			a.irqLine = b.irqLine = irq;
			const sa = stepOf(a);
			const sb = stepOf(b);
			steps += 1;
			assert.deepEqual(sb, sa, `seed ${seed} step ${n}`);
			assert.equal(regs(b), regs(a), `seed ${seed} step ${n}`);
			if (typeof sa === "string" || a.halted) break;
		}
		// …
	}
```

Random words aren't programs, and that's the point. They hit every opcode, every odd indirect
chain, every undefined rotate, and code that writes over itself. A failure names its seed and
step, and replays exactly.

**Lockstep on real programs.** UNIX boots on the event-driven Korz side and on the every-cycle
switch side at once, compared at every step (or, for the compiler, which runs in batches, at the
ends of slices of random length). Forth draws, SYMELEC edits, the Turing engine runs, and the
DataHand interrupts, and each is compared the same way.

**Planted mutations.** To check the tests can fail, I planted errors in the compiler's generated
code and in the 340's slots, and checked each one was caught.

## Port 14: the page

[`CabinetApplet.svelte`](../../apps/ties/src/lib/CabinetApplet.svelte) is the page, in Svelte 5. It
builds a cabinet for the program you pick, and runs it from `requestAnimationFrame` at the real
PDP-7's speed, 1.75 µs a cycle, or as fast as it can go. Its menus pick the program, the CPU level
(`?cpu=pdp7`, `interpret`, `resolve`, or `compile`), and for Forth, `?forth=software` or
`?forth=hardware`. The address remembers your choices.

The panels under the display are views of the machine: the teletype, the registers, memory as
octal, code, source, or trace, Forth's rings, and SLOTS. Beside the menus, three numbers say how
hard the browser is working: emulated cycles per second, that as a multiple of a real PDP-7,
and the share of each frame spent running the machine. Hover over any of them for what it means.

## The workshop

Projects to try, smallest first. Each says where to start and how you'll know it works. The
pattern is always the same: write the new thing, keep the old thing as the oracle, and run them
side by side.

### 1. Write a device

Pick a free device code (the cabinet uses 0, 1, 3 to 11, 22 to 24, 33, 54 to 57, 71, and 77) and build a
device with a register or two: a random number generator, a bell, or a second teletype. Start from
[`clock.ts`](src/plugins/clock.ts), which is 83 lines.

- Write `iot()` first, as the oracle.
- Then `korzSlots()`, one `gate` per pulse, from [`iop.ts`](src/korz/iop.ts).
- If it does something on its own, give it `tick` and `nextEvent`. Return `Infinity` when idle.
- Test it the way [`src/korz/devices.test.ts`](src/korz/devices.test.ts) tests the clock and
  teletype: the same program on `Pdp7` with `iot()` and on `KorzPdp7` with slots, compared in
  lockstep, on the event-driven and every-cycle backplanes.

Then open SLOTS and watch your slots answer.

### 2. Add an observe slot

Count instruction fetches per 256-word page and draw a heat map. It's one slot:

```ts
cpu.sea.install([{ selector: "read", layer: "observe", guard: { access: "fetch" }, by: "heat map",
	run: (c, next) => { heat[c.addr >> 8] += 1; return next(); } }]);
```

Now look at what it did to the compiler. A slot on `read` without a template stops fetches being
inlined. Give it an `emit` that writes `H[${g.addr} >> 8]++` (with `H` passed in through
`g.constant`) and compiled blocks keep their speed. Check the counts match with and without the
template.

### 3. A breakpoint is a patch slot

Write a debugger breakpoint as a `patch`-layer slot on `exec`, guarded on the opcode you care about,
that checks `c.at` and halts or calls `next`. Then a watchpoint on `write`, guarded on `addr`. Then
make the SLOTS panel list them, and turn them on and off from the page. Notice that the table for
`write` grows when you guard on `addr`, and read Project 7.

### 4. Tag the devices' reads

Today every access is `who: cpu`, including the 340's DMA. Make `Type340`'s `fetch` and the disk's
transfers set `who: "device"`, so a slot can watch "every word the display reads" without also
seeing the CPU's reads. KORZ-DISPATCH.md, "Buses and DMA", has the plan. The test: an observe slot
on `who: "device"` counts exactly the words the 340 fetched, and the lockstep tests still pass.

### 5. Compile a display file

Port 10 compiles PDP-7 code. Do the same for the 340: a display file that doesn't change between
frames could be compiled into a function that emits its line segments. Start with templates on
`KorzType340`'s slots, invalidate on stores the way `Compiler7` does with `marks` and `touch`, and
use the 340 fuzz test in [`src/korz/type340.test.ts`](src/korz/type340.test.ts) as the oracle.

### 6. The Turing engine's table as a sea

A Turing machine's transition table is already a dispatch table over two dimensions: state and
scanned symbol. Make each entry a slot, resolve it, and compile it, so a running machine becomes
straight-line JavaScript. [`plugins/turing.ts`](src/plugins/turing.ts) is the oracle, and
[`tm.ts`](src/tm.ts) has the format. This is the most direct case on the tour of a program
that's literally a sea.

### 7. Other ways to shrink a table

Port 7's kinds are one way to keep a table small. Try others in [`korz.ts`](src/korz/korz.ts) and
measure them against it:

- A two-level table: split the wide dimension into a high part and a low part, and share the
  second-level tables that are all the same chain.
- A small map from the few special values to their chains, in front of one entry for everything
  else. That's the idea behind Self's polymorphic inline caches, which Urs Hölzle, Craig Chambers,
  and David Ungar described in 1991.
- Kinds over two dimensions at once, when they only matter together, as `who` and `access` do for
  the Forth device's slots.

The oracle is the interpreter, as always: run the random-seas test in
[`src/korz/korz.test.ts`](src/korz/korz.test.ts) with a small limit.

### 8. Forth words written in TypeScript, from Forth

The Forth device's 30 primitives are a fixed list in
[`forth-device.ts`](src/korz/forth-device.ts), matched by the labels in Mitch's kernel. The table
behind them maps a code address to a TypeScript function. Open it up, so a Forth program can add
instructions to the machine it runs on:

- From TypeScript: `forthDevice.define("STAR", (m) => { … })`.
- From Forth: a defining word that takes a JavaScript body, built with `new Function`, the way
  `korz.ts` builds its generated methods. This is like Snap!'s JavaScript function blocks, by Jens
  Mönig and Brian Harvey.

Such a word has no body in PDP-7 core. Its header and its cell are in the dictionary like any
primitive's, but the cell's `JMP` goes to an address that only the device knows how to run: the word
is a new instruction, running in the emulator with the machine's registers, core, and stacks to work
on. It works only with the device plugged in, and that's the idea. The word the cell jumps to can
hold something that stops loudly, so a machine without the device says why instead of running off
into core.

PDP-7 CODE words, written with [`code.fs`](tapes/pdp7forth/code.fs), still work beside them, and the
device hands those to the CPU as it does now.

### 9. A Forth cartridge without the kernel

Today the device accelerates Mitch's whole kernel, which is all there in core. A cartridge that
requires the device could leave the kernel out and bring only a little glue, with the Forth machine
built into the device. Its state stays in core, where you can see it, and not hidden in the device.

One way to lay it out. Locations 10, 11, and 12 stay IP, RP, and SP, the auto-index registers, so
PDP-7 CODE words work unchanged. A parameter block in core gives the regions, so the same block can
start the device or a software Forth:

```
params:	state	" the interpreter's state block: HERE, LATEST, STATE, BASE, the input buffer's pointers
	dict	" the dictionary's base, and its size in words
	dsize
	dstack	" the data stack's base and size
	dssize
	rstack	" the return stack's base and size
	rssize
```

Then the glue is a boot word and `NEXT`:

```
boot:	law params
	iot …		" the device's init IOT: read the block, set up the stacks, start the boot thread
next:	xct i 010	" answered by the device, as now
	dac i 012
	jmp next
```

The dictionary starts empty, right after the state block, and grows toward the end of its region.
That's safe if the state block's size is fixed for good, so give it a version word and a few spare
words. Separate regions with sizes also let the device check for stack overflow and a full
dictionary, which Mitch's kernel doesn't do.

Whether IP ever needs to point into the device: if the outer interpreter is a short thread in core
(`BEGIN REFILL INTERPRET AGAIN`) whose words are TypeScript, then IP always points into core. A word
that has to wait, like `KEY` with no key yet, can step IP back to its own cell and return to `NEXT`,
so the CPU spins in `NEXT` and interrupts still get taken. That's a design question to settle by
building it.

### 10. Another machine on the same library

`korz.ts` knows nothing about PDP-7s. Build something else on it: a cellular automaton whose
rule is a sea over the neighborhood, an adventure game's verbs over actor, verb, and object (SEA
OF SLOTS, "Zork's five dimensions"), or another CPU. Write the switch statement first, as the
oracle.

## Where to go next

- [SEA-OF-SLOTS.md](SEA-OF-SLOTS.md): the story, and why.
- [KORZ-DISPATCH.md](KORZ-DISPATCH.md): the design of the sea, and the plans that aren't built yet.
- [KORZ-COMPILER.md](KORZ-COMPILER.md): the compiler.
- [FORTH-DEVICE.md](FORTH-DEVICE.md): the Forth device, with its numbers.
- [DESIGN.md](DESIGN.md): the cabinet's design, including what can run where.
- [SIMH-MAP.md](SIMH-MAP.md): how the code maps onto SIMH's.
- [TURING-ENGINE.md](TURING-ENGINE.md): the Turing machine coprocessor.
- [DISPLAY-DEVICES.md](DISPLAY-DEVICES.md): the Type 340 and its relatives.

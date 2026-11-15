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

**How you know the fast parts are right.** Most of the cabinet exists twice: a simple version you
can check by reading it beside the manual, and a fast or clever version you can't check that way.
The tests run both on the same input, side by side, and stop at the first instruction where they
disagree, naming it. The simple version is called the **oracle**: the one whose answer counts.
This is why you can trust a compiler that generates JavaScript on the fly. It isn't trusted
because it looks right; it's checked against something that obviously is, millions of
instructions at a time. And when you change something, the oracle tells you within seconds what
you broke and where.

The cabinet is a ladder of oracles, each rung checking the next:

- SIMH's C code is the oracle for `Pdp7`, the CPU as switch statements.
- `Pdp7` is the oracle for the Korz interpreter, the interpreter for the Korz resolver, and the
  resolver for the Korz compiler.
- `Type340` decodes display words with a switch statement, ported nearly line by line from Phil
  Budne's `display/type340.c` in SIMH. It's the oracle for `KorzType340`, which decodes them with
  slots.
- Each device's `iot()` method is the oracle for the same device's slots.
- The backplane that ticks every device every cycle is the oracle for the event-driven one.
- Mitch's Forth kernel running by itself is the oracle for the same kernel with the Forth device
  plugged in.

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

[`src/plugins/pdp7.ts`](src/plugins/pdp7.ts) is the PDP-7 written as switch statements, ported from
Bob Supnik's [SIMH](https://github.com/open-simh/simh) (`PDP18B/pdp18b_cpu.c`). It's 495 lines, and
reading it is the quickest way to learn the machine. If you've never written machine code, start
with the next few paragraphs; if you have, skip to "Memory in banks".

### A CPU in five minutes

**Memory** is a long row of numbered boxes called **words**. On the PDP-7 each word holds 18
bits, and there are 8,192 of them in the basic machine (up to 32,768 with more memory). A word's
number is its **address**. Everything lives in those words: the program, its data, and some
of the machine's own bookkeeping.

**Registers** are a few words inside the CPU itself. The PDP-7 has very few:

- The **accumulator**, AC: the one word arithmetic happens in. To add two numbers, you load one
  into AC, add the other to it, and store AC back into memory.
- The **link**: one extra bit beside AC that catches the carry out of an addition, and takes part
  in shifts.
- The **program counter**, PC: the address of the next instruction.

The CPU does one thing forever: read the word at PC, add one to PC, and do what the word says.
That's **fetch, decode, execute**. A word that's an instruction says two things: what to do (the
**opcode**) and, usually, which memory word to do it to (the **address**).

**Assembly language** gives each opcode a short name, a **mnemonic**, so people don't have to
write the numbers. `LAC 1234` means "load AC from address 1234". `DAC 1234` means "deposit AC
into address 1234". An **assembler** turns those names into numbers, and a **disassembler**
turns numbers back into names. Port 5 has both.

**Octal.** PDP-7 people write numbers in octal, base 8, because each octal digit is exactly three
bits, so an 18-bit word is exactly six octal digits, and the fields of an instruction line up with
the digits. In TypeScript an octal number is written with `0o`: `0o777777` is the largest 18-bit
word. In this tour, addresses and instruction words are octal unless they say otherwise.

Here's how one instruction word reads. `LAC 1234` is the word 201234. Its top four bits are the
opcode, 04 for `LAC`, which puts 20 at the front of the word. The next bit is the **indirect** bit,
0 here. The low 13 bits are the address, 1234.

With the indirect bit set, the word is 221234, `LAC I 1234`: don't load from 1234, load from the
address that's stored in 1234. Location 1234 is a **pointer**. That's how the PDP-7 reaches
anything an instruction can't name directly.

**There are no "if" instructions.** Instead, some instructions **skip**: they jump over the next
word when a condition holds. So "if AC is zero, go to DONE" is written as two words:

```
	sna		" skip if AC is not zero
	jmp done	" so this runs only when AC is zero
```

### The machine itself

**18-bit words, and the link above them.** Following SIMH, the code keeps the link as bit 18, just
above the 18 bits of AC, so link and AC together are one 19-bit number, and a rotate through the
link is a shift:

```ts
const WORD = 18;
const WMASK = (1 << WORD) - 1; // 0o777777
const SIGN = 1 << 17; // 0o400000
const LINKBIT = 1 << 18; // link lives above the word, SIMH-style
```

**Memory in banks.** An instruction has 13 address bits, which reach 8K words (8,192). A machine
with more memory has it in 8K banks, and the program counter wraps around within its bank. Only a
jump changes banks:

```ts
/** PC + 1 wraps within its 8K bank; only a jump changes banks. */
export function incr(pc: number): number {
	return (pc & BANK) | ((pc + 1) & ADDR);
}
```

A mode called **extend mode** lets pointers hold 15-bit addresses, which reach all 32K.

**The instruction set.** The instructions that work on a memory word are a short list:

| Mnemonic | Word | What it does |
|---|---|---|
| `LAC` | 20xxxx | load AC from the word |
| `DAC` | 04xxxx | deposit AC into the word |
| `DZM` | 14xxxx | deposit zero into the word |
| `ADD` | 30xxxx | add the word to AC, in ones' complement, where -0 and +0 both exist |
| `TAD` | 34xxxx | add the word to the link and AC, in two's complement, as modern machines do |
| `AND`, `XOR` | 50xxxx, 24xxxx | bitwise and, exclusive or |
| `SAD` | 54xxxx | skip if AC differs from the word |
| `ISZ` | 44xxxx | add one to the word, and skip if that made it zero: a loop counter |
| `JMP` | 60xxxx | jump to the address |
| `JMS` | 10xxxx | jump to a subroutine |
| `XCT` | 40xxxx | execute the word at the address, as if it were the next instruction |
| `CAL` | 00xxxx | call location 20 |

The `xxxx` is the address, plus 20000 for indirect. Everything else is in three groups, coming up:
the operate group (74), the EAE (64), and I/O (70).

**Auto-index registers.** Locations 10 to 17 of each bank add one to themselves whenever an
instruction uses them as a pointer, before the pointer is used. So `LAC I 10` steps through
memory one word at a time, which is how the PDP-7 walks an array or a stack. They are the
machine's index registers, and they're ordinary memory words:

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

**Subroutines without a stack.** A modern CPU pushes a return address on a stack. The PDP-7 has no
stack. `JMS X` stores the return address in word X, the subroutine's first word, and starts
running at X + 1. The subroutine returns with `JMP I X`: jump to the address stored in its own
first word. (That's why a PDP-7 subroutine can't call itself: the second call would overwrite the
first one's return address.) The stored word also carries the link and the extend-mode flag:

```ts
	protected jmsWord(): number {
		return ((this.link & 1) << 17) | (this.extend ? EXTEND_BIT : 0) | (this.pc & XADDR);
	}
```

**`CAL`, a call to a fixed place.** `CAL` does exactly what `JMS 20` would (20 octal, location
16): it stores the return address in location 20 and starts running at 21. Its own address field
plays no part, so the program can put anything there. Whatever sits at 21 is the one routine every
`CAL` reaches. It finds the `CAL` that called it one word before the return address in 20, and it
can read that word's address field as an argument. So `CAL` is a one-word call with a free 13-bit
argument. In extend mode it goes to location 20 of bank 0; without it, to location 20 of the
current bank. `CAL I` is `JMS I 20`, a call through whatever pointer 20 holds. Port 6 shows what
Forth does with it.

**Interrupts.** A device that needs attention, a key pressed say, raises a flag. If interrupts
are on, the CPU stops what it's doing between instructions and does what `JMS 0` would: it saves
the address it was about to run in location 0 and starts running at location 1. Every device shares that one
interrupt, so the program at 1 has to ask each device in turn whether it was the one. The instruction `ION` turns interrupts on, after one more instruction, so a handler can turn
them on and return before the next interrupt arrives.

**The operate group.** Words starting with 74 aren't one instruction. The low bits of the word are
switches for several small steps that all run in one instruction: first a skip test on AC and the
link, then clearing and complementing AC and the link, then ORing in the 18 switches on the console,
then a rotate, then maybe a halt. Each step has its own mnemonic, and you combine them by naming
them together:

| Word | Mnemonics | What it does |
|---|---|---|
| 750000 | `CLA` | clear AC |
| 744000 | `CLL` | clear the link |
| 754000 | `CLA CLL` | both, in one instruction |
| 740200 | `SZA` | skip if AC is zero |
| 750200 | `SZA CLA` | skip if AC is zero, then clear it |
| 740040 | `HLT` | stop the machine |

The code decodes each group of bits with its own switch:

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

(`IR<8:11>` is DEC's way of naming bits 8 to 11 of the instruction register. DEC numbers bits from
the left: bit 0 is the most significant.)

With the indirect bit set, a 74 word is `LAW` instead (words starting with 76): "load AC with this
very word". `LAW 17` puts 760017 in AC. It's the PDP-7's only way to put a constant in an
instruction.

**The EAE.** The Extended Arithmetic Element is an option that adds multiply, divide, and long
shifts. It has a second register, MQ, the multiplier-quotient, which holds the other half of a
36-bit product.

**I/O, the IOT instruction.** A word starting with 70 is an **IOT**, input/output transfer: a
message to a device. The next two octal digits pick the device (64 possible devices), and the last
two say what to do. Take "read the key that was typed", `KRB`, which is 700312:

| Digits | Meaning |
|---|---|
| 70 | IOT |
| 03 | device 3, the keyboard |
| 12 | 10: clear AC first; then 2: the keyboard ORs the key's code into AC |

So `KRB` leaves the key's code in AC. The keyboard's other instruction, `KSF` (700301), is pulse 1
on the same device: "skip if a key is waiting". A program waits for a key with two words, `KSF`
then `JMP` back to the `KSF`. Port 9 shows why the pulses are numbered 1, 2, and 4.

A few IOTs never leave the CPU. Device 0 is the interrupt system: 700042 is `ION` and 700002 is
`IOF`, interrupts on and off. Device 77 controls extend mode. Every other IOT goes out on the I/O
bus to whatever device is plugged in at that number, and if nothing is, it does nothing.

## Port 4: the devices

Each device is a class implementing `Device`, in [`src/plugins/`](src/plugins). Each answers its
IOTs twice. Its `iot()` method is one plain function that looks at the pulse bits and does what the
manual says. Its Korz slots (Port 9) do the same thing as separate pieces the CPU's sea can look
up, inspect, and compile. Both are kept, so the tests can run a program once through `iot()` and
once through the slots, and fail at the first IOT where the two disagree. If you write a device,
write `iot()` first: it's short, and it tells you when your slots are wrong.

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

- **Assemblers.** An assembler turns the mnemonics a person writes into the words the machine
  runs: `lac 1234` into 201234. Different groups wrote their own assembly languages for the same
  machine, called dialects, with their own spellings for labels, comments, and numbers. The cabinet
  reads three, because its programs come in three:
  - [`asm/as7.ts`](src/asm/as7.ts) is Ken Thompson's `as`, the assembler PDP-7 UNIX was written
    in, and Mitch's Forth too. It's written from the language, with the Perl `as7` from Warren
    Toomey's pdp7-unix project as its oracle.
  - [`asm/dec.ts`](src/asm/dec.ts) is one assembler for two dialects of one language. `DEC_1964`
    is DEC's, the dialect of its 1964 program library listings. `CAMBRIDGE_1972` is the Cambridge
    University CAD Group's, which built PIXIE on Titan in 1972. No copy of that assembler
    survives, so this one is rebuilt from Heinz Lemke's listing of SYMELEC. It adds what that
    listing uses: `,` inside an operand for the current address (`JMP , 3` jumps three words
    ahead), labels like `name=JMS,`, and `DISP` and `VEC` for writing the Type 340's display words.
    The test: SYMELEC's transcribed source assembles to the printed listing's words, word for word.
  - [`asm/cambridge-as7.ts`](src/asm/cambridge-as7.ts) translates Cambridge source into `as7`
    source, so RSPPIX, Cambridge's ring library, can be assembled into Mitch's Forth. It keeps each
    word's expression rather than its number, and the translation counts only if `as7` assembles
    it back to exactly the Cambridge words.

  All three share one back end, [`asm/core.ts`](src/asm/core.ts).
- **The disassembler** ([`disasm.ts`](src/disasm.ts)) goes the other way, from a word in core to
  text. `disassemble` writes the word as assembly, `lac i 123` or `cla!cll`, in DEC and Cambridge
  syntax or in `as7`'s. The tests disassemble all 262,144 possible words and assemble each one back,
  in both syntaxes, and every one comes back the same. `explain` writes the word in English, for
  people who don't read assembly: 220123 is "load AC from the address held in 123", and 754000 is
  "clear AC, clear the link". `explainDisplay` does the same for a Type 340 display word, which
  means something different in each of the display's modes, so it needs the mode the 340 was in
  when it read the word: 600170 in vector mode is "draw 120, 0, then back to parameter mode". The
  page's code view shows these as comments when its **explain** button is on.

  Every word decodes as something, but whether it's an instruction at all, the word can't say.
  The same 18 bits could be data, a display word, or a return address. That's the source map's job.
- **Source maps** ([`source.ts`](src/source.ts)): which source line assembled each core address,
  and what the assembler put there. So the page can show you where core no longer holds what the
  source says: patches, variables, return addresses, code that rewrites itself. One image can have
  several maps over the same words, such as SYMELEC's 1972 listing and its regenerated `as7` source.
- **Traces** ([`trace.ts`](src/trace.ts)): a ring of the last instructions fetched, with the AC
  each one found.
- **Recorded sessions** ([`session.ts`](src/session.ts)) record a run so it can be played back
  exactly. Everything that reaches the machine from outside is written down with the cycle it
  arrived on: the console switches, the light pen, keys typed on the teletype, and pokes (words
  stored into core from outside, as a debugger does). Nothing else can change what the machine does,
  because the emulator only moves forward a cycle at a time and has no clock of its own. So the same
  inputs on the same cycles replay the same run, at any speed, in a browser or in Node with no
  screen at all (headless), which is how the tests replay a session.
- **Hover and tags** ([`hover.ts`](src/hover.ts), [`tags.ts`](src/tags.ts)) answer "what's under
  the mouse?" The 340 knows only lines and points, but it drew each one from a word of a display
  file, sometimes inside a subroutine. `hover.ts` finds the line nearest the mouse and gathers
  every line drawn from the same place, so the group is the thing a person points at: a menu
  button, a word of text, a line of the drawing. A program can say more with a **tag**: DTG, a
  display instruction the cabinet adds to the 340, marks everything drawn after it with the
  address of a record in core. `tags.ts` reads that record, a title and maybe a URL, and the page
  shows it.
- **Core files** ([`core.ts`](src/core.ts)) save and load all of memory, in three forms: raw
  (four bytes a word, exactly what the emulator holds), JSON, or YAML in rows of eight octal words,
  which you can read and edit by hand.
- **Rings** ([`packages/pixie`](../pixie/src/index.ts)) read and write PIXIE's data structure in
  core. PIXIE kept its drawing in rings: linked lists of two-word cells, built by RSPPIX, where the
  last cell of a ring points back to the first. `photograph` copies the ring area straight out of
  the running machine's memory, and `implant` writes one back into it, with the free list and
  root names set up the way RSPPIX sets them up, so the program finds the new structure as if it had
  built it. In 1972 rings traveled between the PDP-7 and Titan over a link; these tools reach into
  core directly, and also read and write that link's format. `graphToRing` and `ringToGraph` turn
  any graph document, nodes with properties and links written as JSON or YAML, into rings and back,
  so Colossal Cave's map can live in PDP-7 core. The page's RINGS panel draws the structure in 3D,
  lights up the cells that change, and saves and loads ring files. In Mitch's Forth with RSPPIX,
  LOAD puts a file into the running machine.
- **Pictures** ([`media.ts`](src/media.ts), [`preview340.ts`](src/preview340.ts)). The 340's
  output is a stream of line segments. Each segment ([`Segment`](src/plugins/type340.ts)) is more
  than its two ends. It remembers how it was drawn:
  - **When:** the machine cycle it was drawn on, and which refresh frame. A cycle is a place in
    machine time you can seek to and replay from.
  - **Which instruction:** the address of the display-file word that drew it, the block of the
    display file that word sits in, and the display subroutine it was drawn inside, with where that
    subroutine returns to. The 340 can only nest one subroutine deep, so that's the whole call
    chain. It also remembers the POINT words that last set the beam's x and y, which are what
    placed it on the screen.
  - **How it looked:** its kind (point, vector, increment, or character), whether the beam was on
    or just moving, its brightness (intensity), and its scale.
  - **What it means:** for a character, which character and which letter of the frame it belongs
    to; whether the light pen could hit it; and its display tag, if the program set one.

  The screen, the video, the glow of the phosphor, the light pen, and hovering all read that one
  stream. There are two ways to get a picture:
  - From the running display: `toSvg` writes any stream of segments as SVG, a vector image like
    the 340's own picture, with each display subroutine as a group and each line carrying the
    address of the word that drew it. `printScreen` is `toSvg` of the last whole frame, and it's
    what the page's print-screen button downloads. The copy-screen button puts the screen on the
    clipboard as a PNG, and `toYaml` writes a frame as data.
  - From any display list in core: `preview340` hands a chunk of core to a throwaway 340 and gets
    back one pass of the picture it draws, starting at any address, without running the CPU or
    disturbing the real display. Feed the segments to `toSvg` for a file. The page uses it to drag a
    line's corners and see the change at once, and to learn which mode the 340 reads each word in
    for the code view's comments. [`scripts/boot-picture.mjs`](scripts/boot-picture.mjs) uses
    `toSvg` in Node, headless, to save SYMELEC's boot picture.

## Port 6: the software

Three programs carry most of the weight: UNIX, SYMELEC, and Forth. UNIX
([`unixv0.ts`](src/unixv0.ts)) boots Ken Thompson and Dennis Ritchie's 1969 system from the RB09 disk
with Phil Budne's bootstrap. SYMELEC ([`symelec-demo.ts`](src/symelec-demo.ts)) is PIXIE's main
program, driven by a scripted light pen whose time is machine cycles, so the same script draws the
same picture at any speed.

Mitch Bradley's Forth ([`tapes/pdp7forth/kernel-names-full.s`](tapes/pdp7forth/kernel-names-full.s))
is the best demonstration of the PDP-7 I know, because it makes its odd features do the work.

**Forth in two minutes.** A Forth program is a series of **words**, separated by spaces. Words
pass values to each other on a **stack**, a pile where the last value put on (**pushed**) is the
first taken off (**popped**). Typing `2 3 + .` pushes 2, pushes 3, and then `+` pops both and pushes
5, and `.` pops the 5 and prints it. You make a new word out of old ones with a **colon definition**:
`: SQUARE DUP * ;` defines `SQUARE` as "duplicate the top value, then multiply the two", so
`4 SQUARE .` prints 16. Every word lives in the **dictionary**, a list of words kept in memory,
each with its name and its **body**, the part that runs. A colon definition's body is a list
of the words it uses. A **primitive** is a word whose body is machine code instead, like `+` or
`DUP`. A word that calls another word has to remember where to come back to, and Forth keeps those
return places on a second stack, the **return stack**, so the values on the **data stack** stay
out of the way.

The list of words in a body is a **thread**, and one entry in it is a **cell**, one PDP-7 word.
The **inner interpreter**, called `NEXT`, runs a thread: it steps a pointer called IP (for
"interpreter pointer") to the next cell and runs that word. In most Forths, a cell holds an
address, and `NEXT` jumps through it. In Mitch's, each cell is a PDP-7 instruction, and `NEXT` runs
it. Here's the whole inner interpreter, three instructions:

```
next:	xct i 010	" pre-increment IP, execute the thread cell
	dac i 012	" push AC (only reached by constant/variable cells)
	jmp next
```

Reading it word by word needs two PDP-7 features from Port 3.

The first is the `i` after an instruction, which means **indirect**: the instruction's address
names a location that holds the address to use, like a pointer. The second is the **auto-index
registers**, locations 10 through 17. When an instruction goes indirect through one of them, the
CPU first adds 1 to the address stored there, then uses the new address. Step and fetch happen in
one instruction.

Mitch keeps Forth's three pointers in three of them:

| Location | Holds | So |
| --- | --- | --- |
| 10 | IP, the address of the current cell | `xct i 010` steps to the next cell and reaches it |
| 11 | RP, the address of the top of the return stack | `dac i 011` pushes onto the return stack |
| 12 | SP, the address of the top of the data stack | `dac i 012` pushes onto the data stack |

Both stacks grow upward in memory: pushing adds 1 to the pointer, then stores at the new top.

Now the three lines:

1. `xct i 010` is **XCT**, "execute": it runs the word at an address as if it were the next
   instruction, then carries on after the `XCT`, unless that word jumped somewhere. With `i 010`,
   it adds 1 to IP and runs the cell IP now points at.
2. `dac i 012` is **DAC**, "deposit AC": it stores the **accumulator** (AC), the CPU's one
   working register, into memory. With `i 012`, it adds 1 to SP and stores AC there: a push.
3. `jmp next` is **JMP**, "jump": it goes back to the top for the next cell.

What happens next depends on what's in the cell. There are four kinds, and each is an instruction
that does the right thing when `XCT` runs it.

**A colon definition's cell is just the address of its body.** Running a colon definition means
calling it: save where we are, and start running its body's thread. The cell does that by itself,
using an instruction called **CAL**.

The PDP-7 has no call instruction with a stack. It has **JMS**, "jump to subroutine", which stores
the return address in the subroutine's first word and starts running at the word after it. **CAL**,
"call", is a JMS that always goes to location 20, whatever address it holds: it stores the return
address in 20 and starts running at 21. Mitch puts `nest`, his code for calling a colon definition,
at 21.

Why would a bare address run as CAL? A PDP-7 word is 18 bits. The top four are the **opcode**,
which says what the instruction does. The next bit is the indirect bit, and the low 13 are the
address. Every address in the first 8K of core fits in those 13 bits, so a bare address has zeros
in the opcode, and opcode zero is CAL. So when `XCT` runs a colon definition's cell, the CPU calls
`nest`.

`nest` ignores the return address CAL left in 20, because `NEXT` doesn't need it. What it needs is
in IP, which still points at the cell that ran:

```
nest:	lac 010		" IP -> the CAL cell just executed
	dac i 011	" push it on the return stack
	dac t
	lac i t		" cell = body address (tag 00, "CAL -- bare address")
	tad m1		" back up one for NEXT's pre-increment
	dac 010
	jmp next
```

In words:

- **LAC**, "load AC", copies a word from memory into AC, so `lac 010` loads IP.
- `dac i 011` pushes IP onto the return stack. That's where this word will come back to.
- `dac t` saves IP in a scratch word, `t`.
- `lac i t` loads the word `t` points at, which is the cell itself. CAL ignored the cell's address
  field, but `nest` reads it again, and it's the address of the body.
- **TAD**, "two's complement add", adds a word to AC, and `m1` holds −1. So `tad m1` backs up one,
  because `NEXT` will add 1 before it reads.
- `dac 010` points IP at the body.
- `jmp next` runs the body's first cell.

So a colon definition's address is its own call instruction. The return trip is a primitive called
`EXIT`: it pops the return stack into IP, and the thread carries on where it left off.

**A constant's cell is LAC of where its value is kept.** `XCT` runs the LAC, which loads the value
into AC. LAC doesn't jump, so `NEXT` carries on to its second line, `dac i 012`, which pushes the
value onto the data stack. That second line runs only for constants and variables, because every
other kind of cell jumps away first.

**A variable's cell is LAW of its address.** **LAW**, "load accumulator with", copies the
instruction word itself into AC, so the cell is its own value: running it puts 760000 plus the
variable's address in AC, and `dac i 012` pushes that. A Forth variable pushes the address where
its value lives, and `@` ("fetch") and `!` ("store") use that address. The 760000 on top doesn't
get in the way, because when the PDP-7 goes through an address, it uses only the low 13 bits.

**A primitive's cell is JMP to its machine code.** `XCT` runs the jump, and the primitive's code
runs. It ends with `jmp next`, back to the inner interpreter.

**A loop that counts with ISZ.** Forth's `DO … LOOP` repeats a thread a given number of times.
`10 0 DO … LOOP` runs its body with the index going from 0 up to 9, and stops before 10, the limit.
At the start, `DO` pushes the limit and a counter onto the return stack. Mitch's counter is the
index minus the limit, so it starts negative and counts up to zero. That's the shape of a PDP-7
instruction, **ISZ**, "increment and skip if zero": it adds 1 to a word in memory, and if the result
is zero, it skips the next instruction. The end of every loop, `(LOOP)`, is a primitive:

```
xloop:	lac 011
	dac t2
	isz i t2	" counter++; skips when it reaches 0
	jmp bran	" not done: loop back
	lac 011
	tad m2
	dac 011		" drop limit and counter
	isz 010		" step over the inline cell
	jmp next
```

In words:

- `lac 011` and `dac t2` copy RP, the address of the counter on top of the return stack, into a
  scratch word, `t2`. Location 11 can't be used for this itself, because going indirect through it
  would add 1 to it first.
- `isz i t2` adds 1 to the counter. While it's still negative, ISZ doesn't skip, and `jmp bran`
  goes to `BRANCH`'s code, which jumps the thread back to the top of the loop. The address to
  jump to is in the cell after `(LOOP)` in the thread.
- When the counter reaches zero, ISZ skips the `jmp bran`. Then `lac 011`, `tad m2` (`m2` holds
  −2), and `dac 011` take 2 off RP, which drops the counter and the limit from the return stack.
- `isz 010` adds 1 to IP, to step over the cell that holds the loop's address. Here ISZ is used
  only for its add, because IP is never zero.
- `jmp next` carries on with whatever follows the loop.

`I`, the word that gives the loop's index, adds the limit back to the counter.

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

Why only integers? Because every dimension's values are numbered from 0 up to a fixed size, the
sea can store a set of them as a row of bits and index a table by them, which is where its speed
comes from. Other kinds of value fit by being numbered:

- **A boolean** is a dimension one bit wide: 0 or 1, like `ind`, the indirect bit.
- **A small set of strings** is an **enum**: the dimension lists `names`, and the name's position is
  its number. `who` is `["cpu", "device", "debugger"]`, so a guard can say `who: "cpu"` while the
  context holds 0. The names are for people; the context only ever holds numbers.
- **An open-ended set of strings**, like any word a player might type, has to be numbered first,
  with a table from each string to a number, the same trick, called interning, that the
  resolver uses for chains below. Zork's verbs and objects would go in that way.
- **A float or an object** doesn't fit at all. A guard on one would need a test, not a set, and
  the sea has no way to build a table over tests. You turn it into a number that says what you'd
  test, such as a size class, and guard on that.

A dimension is between 1 and 20 bits wide, so it has at most about a million values. A context
field that's missing counts as 0. It's up to the caller to keep each value in range, and
`KorzPdp7` does, because it cuts each field out of the instruction word with a mask.

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

### 8. Dimensions for floats and objects

A Korz dimension holds small integers (Port 7). That's no limit for a PDP-7, whose every field is
bits of a word, but code that isn't an emulator passes floats and objects. Both can get into the sea
without giving up its tables, if the generated method does the numbering, so callers pass ordinary
JavaScript values.

**Floats, as intervals.** Nobody guards on `x === 0.1`. Float guards are ranges, like `x < 0` or
`0 <= x < 1`. Every boundary some guard mentions cuts the number line into intervals, and every
float in one interval gets the same chain. Those intervals are kinds, as in Port 7, found by
comparing instead of by trying every value. So:

- Let a dimension be a float dimension, and let guards give ranges on it.
- At install, collect the boundaries, sort them, and number the intervals between them.
- In the generated method, put comparisons where the mask goes, so the index expression turns
  `c.x` into its interval itself: `(c.x < 0 ? 0 : c.x < 1 ? 1 : 2)`. With many boundaries, a binary
  search instead.
- `bind` regenerates the method on every install, so a slot that adds a boundary renumbers the
  intervals, and no caller ever holds an old numbering.

Decide what NaN does (its own interval is the honest answer), and whether a boundary belongs to
the interval below it or above.

**Objects, as ids.** Dispatching on an object's class is dispatching on a number, once each class
has one. A static id on the class is the cheap way to get it: `c.obj.constructor.id` is two property
reads. A `WeakMap` from object to id works for any object, but it's a hash lookup, likely slower
than the table lookup it feeds; measure it. Adding an id property to an object after it's made changes its
hidden class, which is what the generated methods are trying to keep stable.

A guard can also name one particular object, as CLOS's EQL specializers do. That's where kinds
earn their keep: if the guards name three objects, every other object is the fourth kind, and the
table stays small however many ids there are.

**What to leave out.** A guard that's any test, like `(c) => c.x * c.y > 10`, is predicate
dispatch, which Michael Ernst, Craig Kaplan, and Craig Chambers described in 1998. Craig Chambers
and Weimin Chen made it fast in 1999 with dispatch trees, which test values in a good order
instead of indexing a table. It's more general, but the sea would lose its two strengths: install
checks for ambiguity by walking sets, and a call is one table lookup. A test you can turn into
"which interval" or "which id" belongs in the sea. For anything else, compute a number and guard
on that.

**How you'll know it works.** Extend the random-seas test in
[`src/korz/korz.test.ts`](src/korz/korz.test.ts) with random float ranges and random objects, and
compare the interpreter's chains with the table's at random points, including on the boundaries,
at NaN, and at -0. Then build something small that isn't an emulator, such as collision
responses guarded on two shapes' classes and the speed they hit at.

### 9. Forth words written in TypeScript, from Forth

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

### 10. A Forth cartridge without the kernel

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

### 11. Another machine on the same library

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

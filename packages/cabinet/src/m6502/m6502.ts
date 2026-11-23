/**
 * A cycle-accurate 6502, as one switch. The same chip serves an Apple ][, a C64's 6510, and a
 * NES 2A03; the machine around it owns the bus. `src/korz/m6502.ts` is the sea over this same
 * bus, and `src/korz/compile65.ts` is the compiler. This file is the switch rung, the oracle
 * those levels are measured against, the way `Pdp7` is for the PDP-7.
 *
 * The hot path is one function per opcode row, calling shared addressing and ALU functions.
 * State is number fields on one class. Nothing is allocated per instruction, and there is no
 * 256-entry table of functions: V8 inlines a monomorphic call and a dense switch, and it bails
 * out of a call site that sees a different function every opcode. That is the comparison with
 * Korz. Readability stays in front of that: every cycle is a named read or write, in the order
 * the chip puts it on the bus.
 *
 * Oracles, fetched and never vendored: SingleStepTests `6502/v1` (Tom Harte) for the NMOS part,
 * including the undocumented opcodes; `nes6502` for decimal ignored; `wdc65c02` for the CMOS
 * part. Klaus Dormann's functional tests are the program-length check. cpu6502 (Will Scullin,
 * MIT) is a second implementation, a 256-entry function table, and the speed peer. microM8 is
 * the oracle for an assembled Apple, not for this chip.
 *
 * Saved state is the registers, the pins, and the cycle count: the document a cabinet snapshot
 * stores at `cpus/<id>/state.yml`, or inside a card at `cpu/state.yml` (SAVE-FILES.md). The
 * instance follows the instance. RAM, ROM, and devices belong to the machine that owns the bus,
 * and they save themselves. `state()` is taken between instructions.
 *
 * Bus cycles follow the NMOS part. A load from an indexed address reads the unfixed address
 * only when the index crosses a page. A store or a read-modify-write always reads it, then
 * uses the fixed address. Read-modify-write writes the old byte and then the new one. The
 * 65C02 flavor reads that byte twice instead, and its indexed dummy read is the last
 * instruction byte. The NES flavor is the NMOS chip with the decimal flag ignored.
 */

export interface Bus {
	read(addr: number): number;
	write(addr: number, value: number): void;
	/** The byte at `addr` without a bus cycle. The compiler reads opcodes through this. */
	peek?(addr: number): number;
}

/** NMOS 6502, the NES 2A03 (decimal off), or the WDC 65C02 in the enhanced //e. */
export type M6502Flavor = "nmos" | "nes" | "wdc65c02";

/**
 * What a snapshot keeps of this processor. Pins are levels as the model sees them: asserted
 * means the line is requesting. The real NMI pin is active low; the machine inverts it.
 */
export type M6502State = {
	pc: number;
	a: number;
	x: number;
	y: number;
	/** Stack pointer. The stack itself is the bus page at `$0100`. */
	s: number;
	/** Status. Bits 5 and 4 stay as they were planted; PLP and RTI are what force them. */
	p: number;
	/** Bus cycles completed since power-on. */
	cycles: number;
	flavor: M6502Flavor;
	irq: boolean;
	nmi: boolean;
	/** Level of NMI at the previous sample, so restoring does not invent an edge. */
	nmiPrev: boolean;
	nmiPending: boolean;
	/** A taken branch that stayed in its page hides IRQ for the next instruction. */
	irqDelay: boolean;
	/** RDY. False holds the chip on the current read; writes always complete. */
	ready: boolean;
	jammed: boolean;
};

const C = 1 << 0;
const Z = 1 << 1;
const I = 1 << 2;
const D = 1 << 3;
const B = 1 << 4; // set only on the byte PHP and BRK push
const U = 1 << 5; // forced on by PLP and RTI
const V = 1 << 6;
const N = 1 << 7;

/** Magic constant in ANE and LXA. SingleStepTests' NMOS model uses `$EE`. */
const UNSTABLE = 0xee;

export class M6502 {
	readonly bus: Bus;
	flavor: M6502Flavor;
	pc = 0;
	a = 0;
	x = 0;
	y = 0;
	s = 0;
	p = U;
	cycles = 0;
	irq = false;
	nmi = false;
	nmiPrev = false;
	nmiPending = false;
	irqDelay = false;
	ready = true;
	jammed = false;
	/** High byte of the address before indexing. The unstable stores mask with this plus one. */
	baseHi = 0;
	crossed = false;
	/** Address of the operand byte most recently fetched. The 65C02's indexed dummy read. */
	lastByte = 0;

	constructor(bus: Bus, flavor: M6502Flavor = "nmos") {
		this.bus = bus;
		this.flavor = flavor;
	}

	/** One instruction, or the interrupt sequence if a pin wins the poll. */
	step(): void {
		execute(this);
	}

	/**
	 * RESET is the interrupt microcode with the stack writes suppressed. S still moves, I is set,
	 * and PC is loaded from `$FFFC`.
	 */
	reset(): void {
		read(this, this.pc);
		read(this, this.pc);
		read(this, 0x100 | this.s);
		this.s = (this.s - 1) & 0xff;
		read(this, 0x100 | this.s);
		this.s = (this.s - 1) & 0xff;
		read(this, 0x100 | this.s);
		this.s = (this.s - 1) & 0xff;
		const lo = read(this, 0xfffc);
		const hi = read(this, 0xfffd);
		this.pc = (hi << 8) | lo;
		this.p |= I;
		this.nmiPending = false;
		this.irqDelay = false;
		this.jammed = false;
	}

	state(): M6502State {
		return {
			pc: this.pc,
			a: this.a,
			x: this.x,
			y: this.y,
			s: this.s,
			p: this.p,
			cycles: this.cycles,
			flavor: this.flavor,
			irq: this.irq,
			nmi: this.nmi,
			nmiPrev: this.nmiPrev,
			nmiPending: this.nmiPending,
			irqDelay: this.irqDelay,
			ready: this.ready,
			jammed: this.jammed,
		};
	}

	/** Between instructions. The bus is not touched: the machine restores its own memory. */
	restore(s: M6502State): void {
		this.pc = s.pc & 0xffff;
		this.a = s.a & 0xff;
		this.x = s.x & 0xff;
		this.y = s.y & 0xff;
		this.s = s.s & 0xff;
		this.p = s.p & 0xff;
		this.cycles = s.cycles;
		this.flavor = s.flavor;
		this.irq = s.irq;
		this.nmi = s.nmi;
		this.nmiPrev = s.nmiPrev;
		this.nmiPending = s.nmiPending;
		this.irqDelay = s.irqDelay;
		this.ready = s.ready;
		this.jammed = s.jammed;
	}
}

function execute(cpu: M6502): void {
	const vector = cpuPoll(cpu);
	if (vector >= 0) {
		interrupt(cpu, vector);
		return;
	}
	cpuPerform(cpu, next(cpu));
}

/** The poll at the start of an instruction. A vector to take, or -1. The edge detect always runs. */
export function cpuPoll(cpu: M6502): number {
	if (cpu.nmi && !cpu.nmiPrev) cpu.nmiPending = true;
	cpu.nmiPrev = cpu.nmi;
	const delayed = cpu.irqDelay;
	cpu.irqDelay = false;
	if (cpu.nmiPending) {
		cpu.nmiPending = false;
		return 0xfffa;
	}
	if (!delayed && cpu.irq && (cpu.p & I) === 0) return 0xfffe;
	return -1;
}

export function cpuInterrupt(cpu: M6502, vector: number): void {
	interrupt(cpu, vector);
}

export function cpuNext(cpu: M6502): number {
	return next(cpu);
}

export function cpuRead(cpu: M6502, addr: number): number {
	return read(cpu, addr);
}

export function cpuWrite(cpu: M6502, addr: number, value: number): void {
	write(cpu, addr, value);
}

/** The opcode byte has already been fetched. This is the switch the Korz slots and the compiler call. */
export function cpuPerform(cpu: M6502, op: number): void {
	switch (op & 0xf0) {
		case 0x00: {
			row0(cpu, op);
			return;
		}
		case 0x10: {
			row1(cpu, op);
			return;
		}
		case 0x20: {
			row2(cpu, op);
			return;
		}
		case 0x30: {
			row3(cpu, op);
			return;
		}
		case 0x40: {
			row4(cpu, op);
			return;
		}
		case 0x50: {
			row5(cpu, op);
			return;
		}
		case 0x60: {
			row6(cpu, op);
			return;
		}
		case 0x70: {
			row7(cpu, op);
			return;
		}
		case 0x80: {
			row8(cpu, op);
			return;
		}
		case 0x90: {
			row9(cpu, op);
			return;
		}
		case 0xa0: {
			rowA(cpu, op);
			return;
		}
		case 0xb0: {
			rowB(cpu, op);
			return;
		}
		case 0xc0: {
			rowC(cpu, op);
			return;
		}
		case 0xd0: {
			rowD(cpu, op);
			return;
		}
		case 0xe0: {
			rowE(cpu, op);
			return;
		}
		default: return rowF(cpu, op);
	}
}

function read(cpu: M6502, addr: number): number {
	addr &= 0xffff;
	let v = 0;
	do {
		cpu.cycles += 1;
		v = cpu.bus.read(addr) & 0xff;
	} while (!cpu.ready);
	return v;
}

function write(cpu: M6502, addr: number, value: number): void {
	cpu.cycles += 1;
	cpu.bus.write(addr & 0xffff, value & 0xff);
}

/** Fetch the byte at PC and advance. This is an operand or the opcode. */
function next(cpu: M6502): number {
	const pc = cpu.pc;
	cpu.pc = (pc + 1) & 0xffff;
	cpu.lastByte = pc;
	return read(cpu, pc);
}

function setNZ(cpu: M6502, value: number): void {
	cpu.p = (cpu.p & ~(N | Z)) | (value & N) | (value === 0 ? Z : 0);
}

function push(cpu: M6502, value: number): void {
	write(cpu, 0x100 | cpu.s, value);
	cpu.s = (cpu.s - 1) & 0xff;
}

function pull(cpu: M6502): number {
	cpu.s = (cpu.s + 1) & 0xff;
	return read(cpu, 0x100 | cpu.s);
}

/** Implied instructions re-read the next opcode and leave PC on it. */
function implied(cpu: M6502): void {
	read(cpu, cpu.pc);
}

// --- addressing. Each function does the cycles that resolve the address, not the data cycle. ---

function zp(cpu: M6502): number {
	return next(cpu);
}

/** Dummy read of the unindexed zero page, then the indexed address. */
function zpXY(cpu: M6502, index: number): number {
	const base = next(cpu);
	read(cpu, base);
	return (base + index) & 0xff;
}

function absolute(cpu: M6502): number {
	const lo = next(cpu);
	const hi = next(cpu);
	return (hi << 8) | lo;
}

/**
 * Absolute indexed. `store` is also used for read-modify-write: the chip always reads the
 * address with the low byte added and the high byte not yet carried, then uses the fixed one.
 * A load pays that cycle only on a page cross.
 */
function absoluteXY(cpu: M6502, index: number, store: boolean): number {
	const lo = next(cpu);
	const hi = next(cpu);
	return indexed(cpu, (hi << 8) | lo, index, store);
}

function indirectX(cpu: M6502): number {
	const base = next(cpu);
	read(cpu, base);
	const ptr = (base + cpu.x) & 0xff;
	const lo = read(cpu, ptr);
	const hi = read(cpu, (ptr + 1) & 0xff);
	return (hi << 8) | lo;
}

function indirectY(cpu: M6502, store: boolean): number {
	const zpAddr = next(cpu);
	const lo = read(cpu, zpAddr);
	const hi = read(cpu, (zpAddr + 1) & 0xff);
	return indexed(cpu, (hi << 8) | lo, cpu.y, store);
}

function indexed(cpu: M6502, base: number, index: number, store: boolean): number {
	cpu.baseHi = base >>> 8;
	const sum = base + index;
	cpu.crossed = (sum >>> 8) !== cpu.baseHi;
	if (store || cpu.crossed) {
		const unfixed = (cpu.baseHi << 8) | (sum & 0xff);
		read(cpu, cpu.flavor === "wdc65c02" ? cpu.lastByte : unfixed);
	}
	return sum & 0xffff;
}

/** `(ind)` with the NMOS page bug: a pointer at `$xxFF` reads its high byte from `$xx00`. */
function indirect(cpu: M6502): number {
	const lo = next(cpu);
	const hi = next(cpu);
	const ptr = (hi << 8) | lo;
	const pcl = read(cpu, ptr);
	const pch = read(cpu, (ptr & 0xff00) | ((ptr + 1) & 0xff));
	return (pch << 8) | pcl;
}

// --- ALU. These touch flags and registers. They do not touch the bus. ---

function decimal(cpu: M6502): boolean {
	return cpu.flavor !== "nes" && (cpu.p & D) !== 0;
}

function adc(cpu: M6502, value: number): void {
	if (decimal(cpu)) {
		const c = cpu.p & C;
		let al = (cpu.a & 0x0f) + (value & 0x0f) + c;
		if (al > 9) al += 6;
		let ah = (cpu.a >>> 4) + (value >>> 4) + (al > 0x0f ? 1 : 0);
		const bin = (cpu.a + value + c) & 0xff;
		let p = cpu.p & ~(N | V | Z | C);
		if (bin === 0) p |= Z;
		else if ((ah & 0x08) !== 0) p |= N;
		if ((~(cpu.a ^ value) & (cpu.a ^ ((ah << 4) & 0xff)) & 0x80) !== 0) p |= V;
		if (ah > 9) ah += 6;
		if (ah > 15) p |= C;
		cpu.p = p;
		cpu.a = ((ah << 4) | (al & 0x0f)) & 0xff;
		return;
	}
	const sum = cpu.a + value + (cpu.p & C);
	const result = sum & 0xff;
	let p = (cpu.p & ~(N | V | Z | C)) | (result & N) | (result === 0 ? Z : 0);
	if ((~(cpu.a ^ value) & (cpu.a ^ sum) & 0x80) !== 0) p |= V;
	if (sum > 0xff) p |= C;
	cpu.p = p;
	cpu.a = result;
}

function sbc(cpu: M6502, value: number): void {
	if (decimal(cpu)) {
		const borrow = cpu.p & C ? 0 : 1;
		const diff = (cpu.a - value - borrow) & 0xffff;
		let al = ((cpu.a & 0x0f) - (value & 0x0f) - borrow) & 0xff;
		if ((al & 0x80) !== 0) al = (al - 6) & 0xff;
		let ah = ((cpu.a >>> 4) - (value >>> 4) - ((al & 0x80) !== 0 ? 1 : 0)) & 0xff;
		const low = diff & 0xff;
		let p = cpu.p & ~(N | V | Z | C);
		if (low === 0) p |= Z;
		else if ((low & 0x80) !== 0) p |= N;
		if (((cpu.a ^ value) & (cpu.a ^ diff) & 0x80) !== 0) p |= V;
		if ((diff & 0xff00) === 0) p |= C;
		if ((ah & 0x80) !== 0) ah = (ah - 6) & 0xff;
		cpu.p = p;
		cpu.a = ((ah << 4) | (al & 0x0f)) & 0xff;
		return;
	}
	const diff = (cpu.a - value - (cpu.p & C ? 0 : 1)) & 0xffff;
	const result = diff & 0xff;
	let p = (cpu.p & ~(N | V | Z | C)) | (result & N) | (result === 0 ? Z : 0);
	if (((cpu.a ^ value) & (cpu.a ^ diff) & 0x80) !== 0) p |= V;
	if ((diff & 0xff00) === 0) p |= C;
	cpu.p = p;
	cpu.a = result;
}

function cmp(cpu: M6502, reg: number, value: number): void {
	const diff = (reg - value) & 0xffff;
	cpu.p = (cpu.p & ~(N | Z | C)) | (diff & N) | ((diff & 0xff) === 0 ? Z : 0) | ((diff & 0xff00) === 0 ? C : 0);
}

function bit(cpu: M6502, value: number): void {
	cpu.p = (cpu.p & ~(N | V | Z)) | (value & (N | V)) | ((cpu.a & value) === 0 ? Z : 0);
}

function asl(cpu: M6502, v: number): number {
	const n = (v << 1) & 0xff;
	cpu.p = (cpu.p & ~(N | Z | C)) | (n & N) | (n === 0 ? Z : 0) | (v & 0x80 ? C : 0);
	return n;
}

function lsr(cpu: M6502, v: number): number {
	const n = v >>> 1;
	cpu.p = (cpu.p & ~(N | Z | C)) | (n === 0 ? Z : 0) | (v & 1 ? C : 0);
	return n;
}

function rol(cpu: M6502, v: number): number {
	const n = ((v << 1) | (cpu.p & C)) & 0xff;
	cpu.p = (cpu.p & ~(N | Z | C)) | (n & N) | (n === 0 ? Z : 0) | (v & 0x80 ? C : 0);
	return n;
}

function ror(cpu: M6502, v: number): number {
	const n = (v >>> 1) | ((cpu.p & C) << 7);
	cpu.p = (cpu.p & ~(N | Z | C)) | (n & N) | (n === 0 ? Z : 0) | (v & 1 ? C : 0);
	return n;
}

/** NMOS writes the old byte back. The 65C02 reads it a second time. Both then write the new byte. */
function rewrite(cpu: M6502, addr: number, v: number): void {
	if (cpu.flavor === "wdc65c02") read(cpu, addr);
	else write(cpu, addr, v);
}

function ora(cpu: M6502, value: number): void {
	cpu.a = (cpu.a | value) & 0xff;
	setNZ(cpu, cpu.a);
}

function and(cpu: M6502, value: number): void {
	cpu.a = cpu.a & value;
	setNZ(cpu, cpu.a);
}

function eor(cpu: M6502, value: number): void {
	cpu.a = cpu.a ^ value;
	setNZ(cpu, cpu.a);
}

function lda(cpu: M6502, value: number): void {
	cpu.a = value;
	setNZ(cpu, value);
}

function ldx(cpu: M6502, value: number): void {
	cpu.x = value;
	setNZ(cpu, value);
}

function ldy(cpu: M6502, value: number): void {
	cpu.y = value;
	setNZ(cpu, value);
}

function lax(cpu: M6502, value: number): void {
	cpu.a = value;
	cpu.x = value;
	setNZ(cpu, value);
}

// --- read-modify-write, and the undocumented opcodes that are one of those plus an ALU op ---

function aslMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = asl(cpu, v);
	write(cpu, addr, n);
	return n;
}

function lsrMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = lsr(cpu, v);
	write(cpu, addr, n);
	return n;
}

function rolMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = rol(cpu, v);
	write(cpu, addr, n);
	return n;
}

function rorMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = ror(cpu, v);
	write(cpu, addr, n);
	return n;
}

function incMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = (v + 1) & 0xff;
	setNZ(cpu, n);
	write(cpu, addr, n);
	return n;
}

function decMem(cpu: M6502, addr: number): number {
	const v = read(cpu, addr);
	rewrite(cpu, addr, v);
	const n = (v - 1) & 0xff;
	setNZ(cpu, n);
	write(cpu, addr, n);
	return n;
}

function slo(cpu: M6502, addr: number): void {
	ora(cpu, aslMem(cpu, addr));
}

function rla(cpu: M6502, addr: number): void {
	and(cpu, rolMem(cpu, addr));
}

function sre(cpu: M6502, addr: number): void {
	eor(cpu, lsrMem(cpu, addr));
}

function rra(cpu: M6502, addr: number): void {
	adc(cpu, rorMem(cpu, addr));
}

function dcp(cpu: M6502, addr: number): void {
	cmp(cpu, cpu.a, decMem(cpu, addr));
}

function isc(cpu: M6502, addr: number): void {
	sbc(cpu, incMem(cpu, addr));
}

/**
 * SHY, SHX, SHA, TAS. The stored byte is `value & (high + 1)`, where high is the address before
 * indexing. On a page cross the high byte of the write address becomes that same byte.
 */
function unstableStore(cpu: M6502, addr: number, value: number): void {
	const stored = value & ((cpu.baseHi + 1) & 0xff);
	write(cpu, cpu.crossed ? (stored << 8) | (addr & 0xff) : addr, stored);
}

// --- control flow ---

function branch(cpu: M6502, take: boolean): void {
	const rel = next(cpu);
	if (!take) return;
	const target = (cpu.pc + (rel < 0x80 ? rel : rel - 256)) & 0xffff;
	read(cpu, cpu.pc);
	if ((target & 0xff00) !== (cpu.pc & 0xff00)) read(cpu, (cpu.pc & 0xff00) | (target & 0xff));
	else cpu.irqDelay = true;
	cpu.pc = target;
}

function brk(cpu: M6502): void {
	read(cpu, cpu.pc);
	cpu.pc = (cpu.pc + 1) & 0xffff;
	push(cpu, cpu.pc >>> 8);
	push(cpu, cpu.pc & 0xff);
	push(cpu, cpu.p | B);
	cpu.p |= I;
	const lo = read(cpu, 0xfffe);
	const hi = read(cpu, 0xffff);
	cpu.pc = (hi << 8) | lo;
}

function interrupt(cpu: M6502, vector: number): void {
	read(cpu, cpu.pc);
	read(cpu, cpu.pc);
	push(cpu, cpu.pc >>> 8);
	push(cpu, cpu.pc & 0xff);
	push(cpu, (cpu.p & ~B) | U);
	cpu.p |= I;
	const lo = read(cpu, vector);
	const hi = read(cpu, (vector + 1) & 0xffff);
	cpu.pc = (hi << 8) | lo;
}

/** JSR pushes the address of the high operand byte, then reads it. */
function jsr(cpu: M6502): void {
	const lo = next(cpu);
	read(cpu, 0x100 | cpu.s);
	push(cpu, cpu.pc >>> 8);
	push(cpu, cpu.pc & 0xff);
	const hi = read(cpu, cpu.pc);
	cpu.pc = (hi << 8) | lo;
}

function rts(cpu: M6502): void {
	next(cpu);
	read(cpu, 0x100 | cpu.s);
	const lo = pull(cpu);
	const hi = pull(cpu);
	const ret = (hi << 8) | lo;
	read(cpu, ret);
	cpu.pc = (ret + 1) & 0xffff;
}

function rti(cpu: M6502): void {
	next(cpu);
	read(cpu, 0x100 | cpu.s);
	cpu.p = (pull(cpu) & ~B) | U;
	const lo = pull(cpu);
	const hi = pull(cpu);
	cpu.pc = (hi << 8) | lo;
}

function php(cpu: M6502): void {
	implied(cpu);
	push(cpu, cpu.p | B);
}

function plp(cpu: M6502): void {
	implied(cpu);
	read(cpu, 0x100 | cpu.s);
	cpu.p = (pull(cpu) & ~B) | U;
}

function pha(cpu: M6502): void {
	implied(cpu);
	push(cpu, cpu.a);
}

function pla(cpu: M6502): void {
	implied(cpu);
	read(cpu, 0x100 | cpu.s);
	cpu.a = pull(cpu);
	setNZ(cpu, cpu.a);
}

/** Two reads of the byte after the opcode, and PC left on the opcode. The chip is stuck. */
function jam(cpu: M6502): void {
	read(cpu, cpu.pc);
	read(cpu, cpu.pc);
	cpu.pc = (cpu.pc - 1) & 0xffff;
	cpu.jammed = true;
}

function nop(cpu: M6502): void {
	implied(cpu);
}

function anc(cpu: M6502): void {
	and(cpu, next(cpu));
	cpu.p = (cpu.p & ~C) | (cpu.a & 0x80 ? C : 0);
}

function alr(cpu: M6502): void {
	cpu.a &= next(cpu);
	cpu.a = lsr(cpu, cpu.a);
}

/** AND then a rotate whose carry and overflow come from bits 6 and 5, not from a normal ROR. */
function arr(cpu: M6502): void {
	cpu.a &= next(cpu);
	if (decimal(cpu)) {
		const carryIn = cpu.p & C;
		let a = cpu.a >>> 1;
		if (carryIn) a |= 0x80;
		let p = (cpu.p & ~(N | V | Z | C)) | (a & N) | (a === 0 ? Z : 0);
		if (((a ^ cpu.a) & 0x40) !== 0) p |= V;
		if ((cpu.a & 0x0f) >= 5) a = ((a + 6) & 0x0f) | (a & 0xf0);
		if ((cpu.a & 0xf0) >= 0x50) {
			a = (a + 0x60) & 0xff;
			p |= C;
		}
		cpu.p = p;
		cpu.a = a;
		return;
	}
	const carryIn = cpu.p & C;
	let a = cpu.a >>> 1;
	if (carryIn) a |= 0x80;
	let p = (cpu.p & ~(N | V | Z | C)) | (a & N) | (a === 0 ? Z : 0);
	if ((a & 0x40) !== 0) p |= V | C;
	if ((a & 0x20) !== 0) p ^= V;
	cpu.p = p;
	cpu.a = a;
}

function sbx(cpu: M6502): void {
	const value = next(cpu);
	const diff = ((cpu.a & cpu.x) - value) & 0xffff;
	cpu.x = diff & 0xff;
	cpu.p = (cpu.p & ~(N | Z | C)) | (cpu.x & N) | (cpu.x === 0 ? Z : 0) | ((diff & 0xff00) === 0 ? C : 0);
}

function ane(cpu: M6502): void {
	cpu.a = (cpu.a | UNSTABLE) & cpu.x & next(cpu);
	setNZ(cpu, cpu.a);
}

function lxa(cpu: M6502): void {
	cpu.a = cpu.x = (cpu.a | UNSTABLE) & next(cpu);
	setNZ(cpu, cpu.a);
}

function las(cpu: M6502): void {
	const value = read(cpu, absoluteXY(cpu, cpu.y, false));
	cpu.a = cpu.x = cpu.s = value & cpu.s;
	setNZ(cpu, cpu.a);
}

function flag(cpu: M6502, set: number, clear: number): void {
	implied(cpu);
	cpu.p = (cpu.p & ~clear) | set;
}

// The opcode matrix, one row per high nibble, the way the datasheet draws it.
// A missing opcode falls through to JAM, which the NMOS tests will catch.

function row0(cpu: M6502, op: number): void {
	switch (op) {
		case 0x00: return brk(cpu);
		case 0x01: {
			ora(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0x03: {
			slo(cpu, indirectX(cpu));
			return;
		}
		case 0x04: {
			read(cpu, zp(cpu));
			return;
		}
		case 0x05: {
			ora(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0x06: {
			aslMem(cpu, zp(cpu));
			return;
		}
		case 0x07: {
			slo(cpu, zp(cpu));
			return;
		}
		case 0x08: return php(cpu);
		case 0x09: {
			ora(cpu, next(cpu));
			return;
		}
		case 0x0a: {
			implied(cpu);
			cpu.a = asl(cpu, cpu.a);
			return;
		}
		case 0x0b: return anc(cpu);
		case 0x0c: {
			read(cpu, absolute(cpu));
			return;
		}
		case 0x0d: {
			ora(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0x0e: {
			aslMem(cpu, absolute(cpu));
			return;
		}
		case 0x0f: {
			slo(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function row1(cpu: M6502, op: number): void {
	switch (op) {
		case 0x10: {
			branch(cpu, (cpu.p & N) === 0);
			return;
		}
		case 0x11: {
			ora(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0x13: {
			slo(cpu, indirectY(cpu, true));
			return;
		}
		case 0x14: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x15: {
			ora(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0x16: {
			aslMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x17: {
			slo(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x18: {
			flag(cpu, 0, C);
			return;
		}
		case 0x19: {
			ora(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0x1a: return nop(cpu);
		case 0x1b: {
			slo(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0x1c: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0x1d: {
			ora(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0x1e: {
			aslMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0x1f: {
			slo(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

function row2(cpu: M6502, op: number): void {
	switch (op) {
		case 0x20: return jsr(cpu);
		case 0x21: {
			and(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0x23: {
			rla(cpu, indirectX(cpu));
			return;
		}
		case 0x24: {
			bit(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0x25: {
			and(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0x26: {
			rolMem(cpu, zp(cpu));
			return;
		}
		case 0x27: {
			rla(cpu, zp(cpu));
			return;
		}
		case 0x28: return plp(cpu);
		case 0x29: {
			and(cpu, next(cpu));
			return;
		}
		case 0x2a: {
			implied(cpu);
			cpu.a = rol(cpu, cpu.a);
			return;
		}
		case 0x2b: return anc(cpu);
		case 0x2c: {
			bit(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0x2d: {
			and(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0x2e: {
			rolMem(cpu, absolute(cpu));
			return;
		}
		case 0x2f: {
			rla(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function row3(cpu: M6502, op: number): void {
	switch (op) {
		case 0x30: {
			branch(cpu, (cpu.p & N) !== 0);
			return;
		}
		case 0x31: {
			and(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0x33: {
			rla(cpu, indirectY(cpu, true));
			return;
		}
		case 0x34: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x35: {
			and(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0x36: {
			rolMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x37: {
			rla(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x38: {
			flag(cpu, C, 0);
			return;
		}
		case 0x39: {
			and(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0x3a: return nop(cpu);
		case 0x3b: {
			rla(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0x3c: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0x3d: {
			and(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0x3e: {
			rolMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0x3f: {
			rla(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

function row4(cpu: M6502, op: number): void {
	switch (op) {
		case 0x40: return rti(cpu);
		case 0x41: {
			eor(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0x43: {
			sre(cpu, indirectX(cpu));
			return;
		}
		case 0x44: {
			read(cpu, zp(cpu));
			return;
		}
		case 0x45: {
			eor(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0x46: {
			lsrMem(cpu, zp(cpu));
			return;
		}
		case 0x47: {
			sre(cpu, zp(cpu));
			return;
		}
		case 0x48: return pha(cpu);
		case 0x49: {
			eor(cpu, next(cpu));
			return;
		}
		case 0x4a: {
			implied(cpu);
			cpu.a = lsr(cpu, cpu.a);
			return;
		}
		case 0x4b: return alr(cpu);
		case 0x4c:
			cpu.pc = absolute(cpu);
			return;
		case 0x4d: {
			eor(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0x4e: {
			lsrMem(cpu, absolute(cpu));
			return;
		}
		case 0x4f: {
			sre(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function row5(cpu: M6502, op: number): void {
	switch (op) {
		case 0x50: {
			branch(cpu, (cpu.p & V) === 0);
			return;
		}
		case 0x51: {
			eor(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0x53: {
			sre(cpu, indirectY(cpu, true));
			return;
		}
		case 0x54: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x55: {
			eor(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0x56: {
			lsrMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x57: {
			sre(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x58: {
			flag(cpu, 0, I);
			return;
		}
		case 0x59: {
			eor(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0x5a: return nop(cpu);
		case 0x5b: {
			sre(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0x5c: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0x5d: {
			eor(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0x5e: {
			lsrMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0x5f: {
			sre(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

function row6(cpu: M6502, op: number): void {
	switch (op) {
		case 0x60: return rts(cpu);
		case 0x61: {
			adc(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0x63: {
			rra(cpu, indirectX(cpu));
			return;
		}
		case 0x64: {
			read(cpu, zp(cpu));
			return;
		}
		case 0x65: {
			adc(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0x66: {
			rorMem(cpu, zp(cpu));
			return;
		}
		case 0x67: {
			rra(cpu, zp(cpu));
			return;
		}
		case 0x68: return pla(cpu);
		case 0x69: {
			adc(cpu, next(cpu));
			return;
		}
		case 0x6a: {
			implied(cpu);
			cpu.a = ror(cpu, cpu.a);
			return;
		}
		case 0x6b: return arr(cpu);
		case 0x6c:
			cpu.pc = indirect(cpu);
			return;
		case 0x6d: {
			adc(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0x6e: {
			rorMem(cpu, absolute(cpu));
			return;
		}
		case 0x6f: {
			rra(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function row7(cpu: M6502, op: number): void {
	switch (op) {
		case 0x70: {
			branch(cpu, (cpu.p & V) !== 0);
			return;
		}
		case 0x71: {
			adc(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0x73: {
			rra(cpu, indirectY(cpu, true));
			return;
		}
		case 0x74: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x75: {
			adc(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0x76: {
			rorMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x77: {
			rra(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0x78: {
			flag(cpu, I, 0);
			return;
		}
		case 0x79: {
			adc(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0x7a: return nop(cpu);
		case 0x7b: {
			rra(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0x7c: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0x7d: {
			adc(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0x7e: {
			rorMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0x7f: {
			rra(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

function row8(cpu: M6502, op: number): void {
	switch (op) {
		case 0x80: {
			next(cpu);
			return;
		}
		case 0x81: {
			write(cpu, indirectX(cpu), cpu.a);
			return;
		}
		case 0x82: {
			next(cpu);
			return;
		}
		case 0x83: {
			write(cpu, indirectX(cpu), cpu.a & cpu.x);
			return;
		}
		case 0x84: {
			write(cpu, zp(cpu), cpu.y);
			return;
		}
		case 0x85: {
			write(cpu, zp(cpu), cpu.a);
			return;
		}
		case 0x86: {
			write(cpu, zp(cpu), cpu.x);
			return;
		}
		case 0x87: {
			write(cpu, zp(cpu), cpu.a & cpu.x);
			return;
		}
		case 0x88: {
			implied(cpu);
			cpu.y = (cpu.y - 1) & 0xff;
			setNZ(cpu, cpu.y);
			return;
		}
		case 0x89: {
			next(cpu);
			return;
		}
		case 0x8a: {
			implied(cpu);
			cpu.a = cpu.x;
			setNZ(cpu, cpu.a);
			return;
		}
		case 0x8b: return ane(cpu);
		case 0x8c: {
			write(cpu, absolute(cpu), cpu.y);
			return;
		}
		case 0x8d: {
			write(cpu, absolute(cpu), cpu.a);
			return;
		}
		case 0x8e: {
			write(cpu, absolute(cpu), cpu.x);
			return;
		}
		case 0x8f: {
			write(cpu, absolute(cpu), cpu.a & cpu.x);
			return;
		}
		default: return jam(cpu);
	}
}

function row9(cpu: M6502, op: number): void {
	switch (op) {
		case 0x90: {
			branch(cpu, (cpu.p & C) === 0);
			return;
		}
		case 0x91: {
			write(cpu, indirectY(cpu, true), cpu.a);
			return;
		}
		case 0x93: {
			unstableStore(cpu, indirectY(cpu, true), cpu.a & cpu.x);
			return;
		}
		case 0x94: {
			write(cpu, zpXY(cpu, cpu.x), cpu.y);
			return;
		}
		case 0x95: {
			write(cpu, zpXY(cpu, cpu.x), cpu.a);
			return;
		}
		case 0x96: {
			write(cpu, zpXY(cpu, cpu.y), cpu.x);
			return;
		}
		case 0x97: {
			write(cpu, zpXY(cpu, cpu.y), cpu.a & cpu.x);
			return;
		}
		case 0x98: {
			implied(cpu);
			cpu.a = cpu.y;
			setNZ(cpu, cpu.a);
			return;
		}
		case 0x99: {
			write(cpu, absoluteXY(cpu, cpu.y, true), cpu.a);
			return;
		}
		case 0x9a: {
			implied(cpu);
			(cpu.s = cpu.x);
			return;
		}
		case 0x9b:
			cpu.s = cpu.a & cpu.x;
			return unstableStore(cpu, absoluteXY(cpu, cpu.y, true), cpu.s);
		case 0x9c: {
			unstableStore(cpu, absoluteXY(cpu, cpu.x, true), cpu.y);
			return;
		}
		case 0x9d: {
			write(cpu, absoluteXY(cpu, cpu.x, true), cpu.a);
			return;
		}
		case 0x9e: {
			unstableStore(cpu, absoluteXY(cpu, cpu.y, true), cpu.x);
			return;
		}
		case 0x9f: {
			unstableStore(cpu, absoluteXY(cpu, cpu.y, true), cpu.a & cpu.x);
			return;
		}
		default: return jam(cpu);
	}
}

function rowA(cpu: M6502, op: number): void {
	switch (op) {
		case 0xa0: {
			ldy(cpu, next(cpu));
			return;
		}
		case 0xa1: {
			lda(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0xa2: {
			ldx(cpu, next(cpu));
			return;
		}
		case 0xa3: {
			lax(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0xa4: {
			ldy(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0xa5: {
			lda(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0xa6: {
			ldx(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0xa7: {
			lax(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0xa8: {
			implied(cpu);
			cpu.y = cpu.a;
			setNZ(cpu, cpu.y);
			return;
		}
		case 0xa9: {
			lda(cpu, next(cpu));
			return;
		}
		case 0xaa: {
			implied(cpu);
			cpu.x = cpu.a;
			setNZ(cpu, cpu.x);
			return;
		}
		case 0xab: return lxa(cpu);
		case 0xac: {
			ldy(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0xad: {
			lda(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0xae: {
			ldx(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0xaf: {
			lax(cpu, read(cpu, absolute(cpu)));
			return;
		}
		default: return jam(cpu);
	}
}

function rowB(cpu: M6502, op: number): void {
	switch (op) {
		case 0xb0: {
			branch(cpu, (cpu.p & C) !== 0);
			return;
		}
		case 0xb1: {
			lda(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0xb3: {
			lax(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0xb4: {
			ldy(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0xb5: {
			lda(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0xb6: {
			ldx(cpu, read(cpu, zpXY(cpu, cpu.y)));
			return;
		}
		case 0xb7: {
			lax(cpu, read(cpu, zpXY(cpu, cpu.y)));
			return;
		}
		case 0xb8: {
			flag(cpu, 0, V);
			return;
		}
		case 0xb9: {
			lda(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0xba: {
			implied(cpu);
			cpu.x = cpu.s;
			setNZ(cpu, cpu.x);
			return;
		}
		case 0xbb: return las(cpu);
		case 0xbc: {
			ldy(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0xbd: {
			lda(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0xbe: {
			ldx(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0xbf: {
			lax(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		default: return jam(cpu);
	}
}

function rowC(cpu: M6502, op: number): void {
	switch (op) {
		case 0xc0: {
			cmp(cpu, cpu.y, next(cpu));
			return;
		}
		case 0xc1: {
			cmp(cpu, cpu.a, read(cpu, indirectX(cpu)));
			return;
		}
		case 0xc2: {
			next(cpu);
			return;
		}
		case 0xc3: {
			dcp(cpu, indirectX(cpu));
			return;
		}
		case 0xc4: {
			cmp(cpu, cpu.y, read(cpu, zp(cpu)));
			return;
		}
		case 0xc5: {
			cmp(cpu, cpu.a, read(cpu, zp(cpu)));
			return;
		}
		case 0xc6: {
			decMem(cpu, zp(cpu));
			return;
		}
		case 0xc7: {
			dcp(cpu, zp(cpu));
			return;
		}
		case 0xc8: {
			implied(cpu);
			cpu.y = (cpu.y + 1) & 0xff;
			setNZ(cpu, cpu.y);
			return;
		}
		case 0xc9: {
			cmp(cpu, cpu.a, next(cpu));
			return;
		}
		case 0xca: {
			implied(cpu);
			cpu.x = (cpu.x - 1) & 0xff;
			setNZ(cpu, cpu.x);
			return;
		}
		case 0xcb: return sbx(cpu);
		case 0xcc: {
			cmp(cpu, cpu.y, read(cpu, absolute(cpu)));
			return;
		}
		case 0xcd: {
			cmp(cpu, cpu.a, read(cpu, absolute(cpu)));
			return;
		}
		case 0xce: {
			decMem(cpu, absolute(cpu));
			return;
		}
		case 0xcf: {
			dcp(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function rowD(cpu: M6502, op: number): void {
	switch (op) {
		case 0xd0: {
			branch(cpu, (cpu.p & Z) === 0);
			return;
		}
		case 0xd1: {
			cmp(cpu, cpu.a, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0xd3: {
			dcp(cpu, indirectY(cpu, true));
			return;
		}
		case 0xd4: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xd5: {
			cmp(cpu, cpu.a, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0xd6: {
			decMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xd7: {
			dcp(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xd8: {
			flag(cpu, 0, D);
			return;
		}
		case 0xd9: {
			cmp(cpu, cpu.a, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0xda: return nop(cpu);
		case 0xdb: {
			dcp(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0xdc: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0xdd: {
			cmp(cpu, cpu.a, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0xde: {
			decMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0xdf: {
			dcp(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

function rowE(cpu: M6502, op: number): void {
	switch (op) {
		case 0xe0: {
			cmp(cpu, cpu.x, next(cpu));
			return;
		}
		case 0xe1: {
			sbc(cpu, read(cpu, indirectX(cpu)));
			return;
		}
		case 0xe2: {
			next(cpu);
			return;
		}
		case 0xe3: {
			isc(cpu, indirectX(cpu));
			return;
		}
		case 0xe4: {
			cmp(cpu, cpu.x, read(cpu, zp(cpu)));
			return;
		}
		case 0xe5: {
			sbc(cpu, read(cpu, zp(cpu)));
			return;
		}
		case 0xe6: {
			incMem(cpu, zp(cpu));
			return;
		}
		case 0xe7: {
			isc(cpu, zp(cpu));
			return;
		}
		case 0xe8: {
			implied(cpu);
			cpu.x = (cpu.x + 1) & 0xff;
			setNZ(cpu, cpu.x);
			return;
		}
		case 0xe9: {
			sbc(cpu, next(cpu));
			return;
		}
		case 0xea: return nop(cpu);
		case 0xeb: {
			sbc(cpu, next(cpu));
			return;
		}
		case 0xec: {
			cmp(cpu, cpu.x, read(cpu, absolute(cpu)));
			return;
		}
		case 0xed: {
			sbc(cpu, read(cpu, absolute(cpu)));
			return;
		}
		case 0xee: {
			incMem(cpu, absolute(cpu));
			return;
		}
		case 0xef: {
			isc(cpu, absolute(cpu));
			return;
		}
		default: return jam(cpu);
	}
}

function rowF(cpu: M6502, op: number): void {
	switch (op) {
		case 0xf0: {
			branch(cpu, (cpu.p & Z) !== 0);
			return;
		}
		case 0xf1: {
			sbc(cpu, read(cpu, indirectY(cpu, false)));
			return;
		}
		case 0xf3: {
			isc(cpu, indirectY(cpu, true));
			return;
		}
		case 0xf4: {
			read(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xf5: {
			sbc(cpu, read(cpu, zpXY(cpu, cpu.x)));
			return;
		}
		case 0xf6: {
			incMem(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xf7: {
			isc(cpu, zpXY(cpu, cpu.x));
			return;
		}
		case 0xf8: {
			flag(cpu, D, 0);
			return;
		}
		case 0xf9: {
			sbc(cpu, read(cpu, absoluteXY(cpu, cpu.y, false)));
			return;
		}
		case 0xfa: return nop(cpu);
		case 0xfb: {
			isc(cpu, absoluteXY(cpu, cpu.y, true));
			return;
		}
		case 0xfc: {
			read(cpu, absoluteXY(cpu, cpu.x, false));
			return;
		}
		case 0xfd: {
			sbc(cpu, read(cpu, absoluteXY(cpu, cpu.x, false)));
			return;
		}
		case 0xfe: {
			incMem(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		case 0xff: {
			isc(cpu, absoluteXY(cpu, cpu.x, true));
			return;
		}
		default: return jam(cpu);
	}
}

/**
 * The switch's own cycles and ALU, for the Korz sea in `src/korz/m6502.ts`. Its slots are these
 * pieces arranged by opcode field, so the sea and the switch cannot disagree about a bus cycle
 * except in how they pick the pieces.
 */
export const parts = {
	read, write, next, implied, setNZ, push, pull,
	zp, zpXY, absolute, absoluteXY, indirectX, indirectY, indirect,
	adc, sbc, cmp, bit, asl, lsr, rol, ror, ora, and, eor, lda, ldx, ldy, lax,
	aslMem, lsrMem, rolMem, rorMem, incMem, decMem, slo, rla, sre, rra, dcp, isc, unstableStore,
	branch, brk, jsr, rts, rti, php, plp, pha, pla, jam, nop, flag,
	anc, alr, arr, sbx, ane, lxa, las,
} as const;

export const FLAGS = { C, Z, I, D, B, U, V, N } as const;

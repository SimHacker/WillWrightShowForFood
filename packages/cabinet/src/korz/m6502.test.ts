import assert from "node:assert/strict";
import { test } from "node:test";
import { M6502, type Bus } from "../m6502/m6502.js";
import { Apple2Plus } from "./apple2/plus.js";
import { Korz6502, opcode65, type Korz6502Opts } from "./m6502.js";

class Ram implements Bus {
	readonly mem = new Uint8Array(0x10000);
	read(addr: number): number {
		return this.mem[addr & 0xffff] ?? 0;
	}
	write(addr: number, value: number): void {
		this.mem[addr & 0xffff] = value & 0xff;
	}
	peek(addr: number): number {
		return this.read(addr);
	}
}

function plant(mem: Uint8Array, at: number, bytes: number[]): void {
	for (let i = 0; i < bytes.length; i++) mem[(at + i) & 0xffff] = bytes[i] ?? 0;
}

function pair(opts: Korz6502Opts, bytes: number[], at = 0x800): { korz: Korz6502; sw: M6502 } {
	const a = new Ram();
	const b = new Ram();
	plant(a.mem, at, bytes);
	plant(b.mem, at, bytes);
	const korz = new Korz6502(a, opts);
	const sw = new M6502(b);
	korz.pc = at;
	sw.pc = at;
	korz.s = sw.s = 0xfd;
	korz.p = sw.p = 0x20;
	return { korz, sw };
}

function same(korz: Korz6502, sw: M6502): void {
	assert.equal(korz.pc, sw.pc);
	assert.equal(korz.a, sw.a);
	assert.equal(korz.x, sw.x);
	assert.equal(korz.y, sw.y);
	assert.equal(korz.s, sw.s);
	assert.equal(korz.p, sw.p);
	assert.equal(korz.cycles, sw.cycles);
	assert.equal(korz.jammed, sw.jammed);
	assert.equal(korz.irqDelay, sw.irqDelay);
	assert.deepStrictEqual((korz.bus as Ram).mem, (sw.bus as Ram).mem);
}

/** Step the switch as many times as the Korz rung says it retired. */
function lock(korz: Korz6502, sw: M6502, steps: number): void {
	for (let i = 0; i < steps; i++) {
		korz.step();
		assert.ok(korz.lastRun >= 1);
		for (let n = 0; n < korz.lastRun; n++) sw.step();
		same(korz, sw);
	}
}

const LOOP = [
	0xa2, 0x0a, // LDX #$0A
	0xca, // DEX
	0xd0, 0xfd, // BNE *-3
	0xa9, 0x41, // LDA #$41
	0x8d, 0x00, 0x04, // STA $0400
	0x4c, 0x0a, 0x08, // JMP $080A
];

for (const rung of ["interpret", "resolve", "compile"] as const) {
	test(`6502 ${rung}: a counted loop matches the switch`, () => {
		const { korz, sw } = pair({ korz: rung }, LOOP);
		lock(korz, sw, 40);
		assert.equal(korz.pc, 0x80a);
		assert.equal(korz.x, 0);
		assert.equal(korz.a, 0x41);
		assert.equal((korz.bus as Ram).mem[0x400], 0x41);
		if (rung === "compile") {
			korz.pc = 0x800;
			sw.pc = 0x800;
			korz.step();
			assert.ok(korz.lastRun > 1, "a straight-line block retires more than one instruction");
		}
	});
}

/** Memory as a hash of the address, the instruction planted, writes kept, and every cycle logged. */
class Soup implements Bus {
	readonly writes = new Map<number, number>();
	readonly trace: number[] = [];
	seed = 0;
	at = 0;
	code: number[] = [];
	reset(seed: number, at: number, code: number[]): void {
		this.writes.clear();
		this.trace.length = 0;
		this.seed = seed;
		this.at = at;
		this.code = code;
	}
	peek(addr: number): number {
		const w = this.writes.get(addr);
		if (w !== undefined) return w;
		const k = (addr - this.at) & 0xffff;
		if (k < this.code.length) return this.code[k]!;
		return Math.imul(addr ^ this.seed, 0x9e3779b1) >>> 24;
	}
	read(addr: number): number {
		const v = this.peek(addr);
		this.trace.push(addr, v);
		return v;
	}
	write(addr: number, value: number): void {
		this.writes.set(addr, value);
		this.trace.push(0x10000 | addr, value);
	}
}

const CONTROL_FLOW = new Set(["branch", "JMP abs", "JMP (ind)", "JSR abs", "RTS", "RTI", "BRK", "JAM"]);

for (const rung of ["resolve", "interpret"] as const) {
	test(`6502 ${rung}: every opcode, every flavor, bus cycle for bus cycle with the switch`, () => {
		const trials = rung === "resolve" ? 40 : 4;
		for (const flavor of ["nmos", "nes", "wdc65c02"] as const) {
			const kb = new Soup();
			const sb = new Soup();
			const korz = new Korz6502(kb, { korz: rung, flavor });
			const sw = new M6502(sb, flavor);
			let rng = 0x6502 + flavor.length;
			const rand = (): number => {
				rng = (Math.imul(rng, 1103515245) + 12345) >>> 0;
				return rng >>> 16;
			};
			for (let op = 0; op < 256; op++) {
				const info = opcode65(korz.sea, op);
				for (let t = 0; t < trials; t++) {
					const at = rand() & 0xffff;
					const code = [op, rand() & 0xff, rand() & 0xff];
					const seed = rand();
					kb.reset(seed, at, code);
					sb.reset(seed, at, code);
					const regs = { pc: at, a: rand() & 0xff, x: rand() & 0xff, y: rand() & 0xff, s: rand() & 0xff, p: rand() & 0xff };
					for (const m of [korz, sw]) {
						Object.assign(m, regs);
						m.cycles = 0;
						m.jammed = false;
						m.irqDelay = false;
					}
					korz.step();
					sw.step();
					const where = `${flavor} $${op.toString(16)} (${info.name}) trial ${t}`;
					assert.deepStrictEqual(kb.trace, sb.trace, `${where}: bus cycles`);
					for (const r of ["pc", "a", "x", "y", "s", "p", "cycles", "jammed", "irqDelay"] as const) assert.equal(korz[r], sw[r], `${where}: ${r}`);
					if (!CONTROL_FLOW.has(info.exec)) assert.equal((korz.pc - at) & 0xffff, info.bytes, `${where}: bytes`);
				}
			}
		}
	});
}

test("6502 sea: opcodes are named after the slots that answer them", () => {
	const korz = new Korz6502(new Ram());
	const names: Record<number, string> = {
		0xa9: "LDA #imm", 0xb5: "LDA zp,X", 0xa1: "LDA (zp,X)", 0x91: "STA (zp),Y", 0xb6: "LDX zp,Y", 0xbe: "LDX abs,Y",
		0x0a: "ASL A", 0x1e: "ASL abs,X", 0x6c: "JMP (ind)", 0x20: "JSR abs", 0x10: "BPL", 0xf0: "BEQ", 0x18: "CLC",
		0xf8: "SED", 0xb8: "CLV", 0x98: "TYA", 0x9a: "TXS", 0xea: "NOP", 0x04: "NOP zp", 0x1c: "NOP abs,X",
		0x80: "NOP #imm", 0x89: "NOP #imm", 0x02: "JAM", 0x92: "JAM", 0x9e: "SHX abs,Y", 0xb7: "LAX zp,Y",
		0xbf: "LAX abs,Y", 0x97: "SAX zp,Y", 0x03: "SLO (zp,X)", 0xeb: "USBC #imm", 0xe0: "CPX #imm", 0x2c: "BIT abs",
	};
	for (const [op, name] of Object.entries(names)) assert.equal(opcode65(korz.sea, Number(op)).name, name, `$${Number(op).toString(16)}`);
	const undocumented = Array.from({ length: 256 }, (_, op) => opcode65(korz.sea, op)).filter((o) => o.undocumented).length;
	assert.equal(undocumented, 256 - 151, "151 documented NMOS opcodes");
});

test("6502 compile: a changed opcode drops the block", () => {
	const { korz, sw } = pair({ korz: "compile" }, [0x4c, 0x00, 0x08]);
	korz.step();
	for (let i = 0; i < korz.lastRun; i++) sw.step();
	same(korz, sw);
	assert.equal(korz.pc, 0x800);
	(korz.bus as Ram).mem[0x800] = 0xea;
	(sw.bus as Ram).mem[0x800] = 0xea;
	korz.step();
	for (let i = 0; i < korz.lastRun; i++) sw.step();
	same(korz, sw);
	assert.equal(korz.pc, 0x801);
});

test("6502 compile: an IRQ is taken between instructions, with the switch", () => {
	const bytes = [0xa9, 0x01, 0xea, 0x4c, 0x02, 0x08];
	const { korz, sw } = pair({ korz: "compile" }, bytes);
	plant((korz.bus as Ram).mem, 0xfffe, [0x00, 0x09]);
	plant((sw.bus as Ram).mem, 0xfffe, [0x00, 0x09]);
	plant((korz.bus as Ram).mem, 0x900, [0xea, 0x4c, 0x00, 0x09]);
	plant((sw.bus as Ram).mem, 0x900, [0xea, 0x4c, 0x00, 0x09]);
	korz.irq = sw.irq = true;
	lock(korz, sw, 3);
	assert.equal(korz.pc, 0x900);
	assert.equal(korz.a, 0);
	assert.ok((korz.p & 4) !== 0);
});

test("6502 rungs: a soup of opcodes stays with the switch", () => {
	const soup = Array.from({ length: 256 }, (_, i) => (i * 17 + 3) & 0xff);
	for (const rung of ["interpret", "resolve", "compile"] as const) {
		const { korz, sw } = pair({ korz: rung }, soup, 0x300);
		plant((korz.bus as Ram).mem, 0xfffa, [0x00, 0x03]);
		plant((korz.bus as Ram).mem, 0xfffe, [0x00, 0x03]);
		plant((sw.bus as Ram).mem, 0xfffa, [0x00, 0x03]);
		plant((sw.bus as Ram).mem, 0xfffe, [0x00, 0x03]);
		lock(korz, sw, 60);
	}
});

test("peek reads an opcode and does not clock the scanner", () => {
	const board = new Apple2Plus(new Uint8Array(0x3000));
	board.ram[0x800] = 0xa9;
	assert.equal(board.peek(0x800), 0xa9);
	assert.equal(board.cycles, 0);
	board.read(0x800);
	assert.equal(board.cycles, 1);
});

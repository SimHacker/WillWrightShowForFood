import assert from "node:assert/strict";
import { test } from "node:test";
import { M6502, type Bus } from "../m6502/m6502.js";
import { Apple2Plus } from "./apple2/plus.js";
import { Korz6502, type Korz6502Opts } from "./m6502.js";

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

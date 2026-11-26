import assert from "node:assert/strict";
import { test } from "node:test";
import { Korz6502, opcode65 } from "../korz/m6502.js";
import { OPS65, before65, disassemble65 } from "./disasm65.js";
import { Trace65 } from "./trace65.js";

const ram = (bytes: number[], at = 0x800) => {
	const mem = new Uint8Array(0x10000);
	mem.set(bytes, at);
	return { mem, peek: (a: number) => mem[a & 0xffff]! };
};

test("6502 disassembler: every opcode's length and documentation agree with the Korz sea", () => {
	const cpu = new Korz6502({ read: () => 0, write: () => {}, peek: () => 0 } as never, { korz: "resolve" });
	for (let op = 0; op < 256; op++) {
		const sea = opcode65(cpu.sea, op);
		const mine = OPS65[op]!;
		if (mine.mnemonic !== "JAM") assert.equal(mine.bytes, sea.bytes, `$${op.toString(16)} ${mine.mnemonic} ${mine.mode} vs ${sea.name}`);
		assert.equal(mine.undocumented, sea.undocumented, `$${op.toString(16)} ${mine.mnemonic} vs ${sea.name}`);
	}
	assert.equal(OPS65.filter((o) => !o.undocumented).length, 151);
});

test("6502 disassembler: operands as an assembler writes them, named when a symbol knows the address", () => {
	const { peek } = ram([0xad, 0x00, 0xc0, 0x91, 0x28, 0xd0, 0xf9, 0x6c, 0x36, 0x00, 0xa9, 0x8d, 0x0a, 0xb6, 0x10]);
	const names = (a: number) => ({ 0xc000: "KBD", 0x28: "BASL" })[a] ?? "";
	const lines: string[] = [];
	for (let at = 0x800; at < 0x80f; ) {
		const l = disassemble65(peek, at, names);
		lines.push(l.text);
		at += l.bytes.length;
	}
	assert.deepEqual(lines, ["LDA KBD", "STA (BASL),Y", "BNE $0800", "JMP ($0036)", "LDA #$8D", "ASL A", "LDX $10,Y"]);
	assert.equal(disassemble65(peek, 0x805).target, 0x800, "a branch's target is where it goes");
});

test("6502 disassembler: the instruction before an address, walking forward until the walk lands on it", () => {
	const { peek } = ram([0xa9, 0x00, 0x8d, 0x00, 0xc0, 0xe8, 0x4c, 0x00, 0x08]);
	assert.equal(before65(peek, 0x805), 0x802);
	assert.equal(before65(peek, 0x806), 0x805);
	assert.equal(before65(peek, 0x802), 0x800);
});

test("6502 trace: a ring of instructions with the registers each one found", () => {
	const t = new Trace65(4);
	for (let i = 0; i < 6; i++) t.record(0x800 + i, 0xe8, 1, 2, i, i + 1, i + 2, 0x24, 0xfd);
	assert.equal(t.count, 6);
	assert.equal(t.held, 4);
	const w = t.window(3);
	assert.deepEqual(w.map((e) => e.pc), [0x803, 0x804, 0x805]);
	assert.deepEqual(w[2], { pc: 0x805, bytes: [0xe8, 1, 2], a: 5, x: 6, y: 7, p: 0x24, s: 0xfd, n: 5 });
	assert.deepEqual(t.window(2, 1).map((e) => e.pc), [0x803, 0x804]);
});

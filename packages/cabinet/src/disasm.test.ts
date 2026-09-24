import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { disassemble } from "./disasm.js";

test("disasm: the usual words read the way the listings write them", () => {
	const cases: Array<[number, string]> = [
		[0o200123, "lac 123"],
		[0o220123, "lac i 123"],
		[0o600022, "jmp 22"],
		[0o000000, "cal"],
		[0o740000, "nop"],
		[0o740200, "sza"],
		[0o741200, "sna"],
		[0o750000, "cla"],
		[0o750001, "clc"],
		[0o744000, "cll"],
		[0o744002, "stl"],
		[0o742010, "rtl"],
		[0o754000, "cla!cll"],
		[0o741300, "spa!sna"],
		[0o760005, "law 5"],
		[0o700601, "idsi"],
		[0o700606, "idla"],
		[0o702201, "lsf"],
		[0o653122, "mul"],
	];
	for (const [word, text] of cases) assert.equal(disassemble(word), text, word.toString(8));
});

test("disasm: operands go through the symbol lookup", () => {
	const names = new Map([[0o2140, "setup"]]);
	const sym = (a: number) => names.get(a) ?? (a > 0o2140 && a < 0o2150 ? `setup+${(a - 0o2140).toString(8)}` : "");
	assert.equal(disassemble(0o102140, sym), "jms setup");
	assert.equal(disassemble(0o042143, sym), "dac setup+3");
	assert.equal(disassemble(0o040100, sym), "dac 100");
});

test("disasm: every word assembles back to itself", () => {
	const CHUNK = 0o10000;
	for (let base = 0; base < 0o1000000; base += CHUNK) {
		const text = Array.from({ length: CHUNK }, (_, i) => disassemble(base + i)).join("\n");
		const r = assemble([{ name: "all", text }], { dialect: "cambridge", origin: 0 });
		assert.deepEqual(r.errors, [], `chunk ${base.toString(8)}`);
		for (const [addr, word] of r.words) {
			if (word !== base + addr) assert.fail(`${(base + addr).toString(8)} -> "${disassemble(base + addr)}" -> ${word.toString(8)}`);
		}
	}
});

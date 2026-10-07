import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { assembleAs7 } from "./asm/as7.js";
import { disassemble, explain, explainDisplay } from "./disasm.js";

test("disasm: explain says each word in English", () => {
	assert.equal(explain(0o200123), "load AC from 123");
	assert.equal(explain(0o220123, (a) => (a === 0o123 ? "tab" : "")), "load AC from the address held in tab");
	assert.equal(explain(0o540050), "skip if AC differs from 50");
	assert.equal(explain(0o741200), "skip if AC is not 0");
	assert.equal(explain(0o754000), "clear AC, clear the link");
	assert.equal(explain(0o700606), "start the display at the address in AC");
	assert.equal(explain(0o760005), "load AC with 5");
});

test("disasm: explainDisplay reads a display word in its mode", () => {
	assert.equal(explainDisplay(0o277400, 4), "draw 0, 127");
	assert.equal(explainDisplay(0o600170, 4), "draw 120, 0, then back to parameter mode");
	assert.equal(explainDisplay(0o030175, 0), "set light pen off, scale 8, intensity 5, then point mode");
	assert.equal(explainDisplay(0o220000, 1), "beam y to 0, then point mode");
});

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

test("disasm as7: the usual words, and symbols with octal offsets", () => {
	const as7 = (w: number, sym?: (a: number) => string) => disassemble(w, sym, "as7");
	assert.equal(as7(0o200123), "lac 0123");
	assert.equal(as7(0o220123), "lac i 0123");
	assert.equal(as7(0o754000), "cla cll");
	assert.equal(as7(0o760005), "law 05");
	assert.equal(as7(0o740000), "nop");
	assert.equal(as7(0o700606), "0700606");
	assert.equal(as7(0o000017), "017");
	assert.equal(as7(0o020005), "sys 05");
	const names = new Map([[0o2140, "setup"]]);
	const sym = (a: number) => names.get(a) ?? (a > 0o2140 && a < 0o2150 ? `setup+${(a - 0o2140).toString(8)}` : "");
	assert.equal(as7(0o102140, sym), "jms setup");
	assert.equal(as7(0o042143, sym), "dac setup+03");
});

test("disasm as7: every word assembles back to itself with as7", () => {
	const CHUNK = 0o10000;
	for (let base = 0; base < 0o1000000; base += CHUNK) {
		const text = Array.from({ length: CHUNK }, (_, i) => disassemble(base + i, undefined, "as7")).join("\n");
		const r = assembleAs7([{ name: "all", text: `.=0\n${text}` }], { base: 0 });
		assert.deepEqual(r.errors, [], `chunk ${base.toString(8)}`);
		for (const [addr, word] of r.words) {
			if (word !== base + addr) assert.fail(`${(base + addr).toString(8)} -> "${disassemble(base + addr, undefined, "as7")}" -> ${word.toString(8)}`);
		}
	}
});

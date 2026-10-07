import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { assembleAs7 } from "./asm/as7.js";
import { cambridgeToAs7 } from "./asm/cambridge-as7.js";

const dir = new URL("../tapes/symelec/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, dir), "utf8");

function parseOct(text: string): Map<number, number> {
	const words = new Map<number, number>();
	for (const raw of text.split("\n")) {
		const match = raw.match(/^\s*([0-7]+)\s+([0-7]+)/);
		if (match) words.set(Number.parseInt(match[1] as string, 8), Number.parseInt(match[2] as string, 8));
	}
	return words;
}

test("SYMELEC Cambridge source assembles with its scanned variable tail", () => {
	const source = assemble([{ name: "symelec.asm", text: read("symelec.asm") }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	assert.equal(source.variables.length, 84);
	assert.equal(source.variables[0]?.name, "cdocom");
	assert.equal(source.variables.at(-1)?.name, "test");
});

test("Cambridge pools forward-reference literals per use and resolved ones by value", () => {
	const source = assemble([{ name: "pool", text: "LAC (A 1\nLAC (A 1\nA=10\nLAC (A 1\nLAC (11\n" }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	const words = new Map(source.words);
	const at = [0o22, 0o23, 0o24, 0o25].map((addr) => (words.get(addr) as number) & 0o17777);
	assert.equal(new Set(at.slice(0, 2)).size, 2);
	assert.equal(at[2], at[3]);
	for (const addr of at) assert.equal(words.get(addr), 0o11);
});

test("Cambridge forward references to a reassigned name use its first value", () => {
	const source = assemble([{ name: "reassign", text: "LAC S\nS=100\nS=200\nLAC S\n" }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	assert.deepEqual(source.words, [[0o22, 0o200100], [0o23, 0o200200]]);
});

test("SYMELEC source assembles to the printed image word for word", () => {
	const source = assemble([{ name: "symelec.asm", text: read("symelec.asm") }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	const want = new Map([...parseOct(read("symelec.oct")), ...parseOct(read("symelec-literals.oct"))]);
	const got = new Map(source.words);
	for (const [addr, word] of got) assert.equal(word, want.get(addr) ?? 0, `word ${addr.toString(8)}`);
	for (const [addr, word] of want) if (word !== 0) assert.ok(got.has(addr), `word ${addr.toString(8)} missing`);
});

test("Cambridge VEC ON shorthand matches the SYMELEC listing", () => {
	const source = assemble([{ name: "vectors", text: "DISP\nVEC ON -170\nVEC ON 2\nVEC ON 4\nVEC ON -4\n" }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	assert.deepEqual(source.words, [[0o22, 0o200370], [0o23, 0o201000], [0o24, 0o202000], [0o25, 0o302000]]);
});

test("Cambridge LAW negative operands use the 13-bit address field", () => {
	const source = assemble([{ name: "law", text: "LAW -30\n" }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(source.errors, []);
	assert.deepEqual(source.words, [[0o22, 0o777747]]);
});

for (const [cambridge, as7, prefix, entry] of [
	["symelec.asm", "symelec.s", "s", "sbegrtp"],
	["rsppix.asm", "../pdp7forth/rsppix.s", "r", "rsetup"],
] as const) {
	test(`${cambridge} in Cambridge and ${as7} in as7 assemble to the same words`, () => {
		const cam = assemble([{ name: cambridge, text: read(cambridge) }], { dialect: "cambridge", origin: 0o22 });
		const out = assembleAs7([{ name: as7, text: read(as7) }], { base: 0 });
		assert.deepEqual(cam.errors, []);
		assert.deepEqual(out.errors, []);
		assert.deepEqual(out.words, cam.words);
		assert.equal(out.symbols.get(entry), (cam.symbols.get(entry.slice(prefix.length)) as number) & 0o17777);
	});

	test(`${as7} is what the translator makes of ${cambridge} today`, () => {
		const fresh = cambridgeToAs7([{ name: cambridge, text: read(cambridge) }], { prefix });
		assert.deepEqual(fresh.mismatches, []);
		assert.equal(read(as7).split("\n").slice(1).join("\n"), fresh.text);
	});
}
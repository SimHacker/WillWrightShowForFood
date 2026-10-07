import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { assembleAs7 } from "./asm/as7.js";

const DIR = new URL("../tapes/symelec/", import.meta.url);

test("RSPPIX, unchanged, assembles to Titan's 29 1 72 listing word for word", () => {
	const text = readFileSync(new URL("rsppix.asm", DIR), "utf8");
	const r = assemble([{ name: "rsppix", text }], { dialect: "cambridge", origin: 0o22 });
	assert.deepEqual(r.errors, []);
	const want = readFileSync(new URL("rsppix.oct", DIR), "utf8")
		.trim()
		.split("\n")
		.map((l) => l.trim().split(/\s+/).map((x) => Number.parseInt(x, 8)) as [number, number]);
	assert.deepEqual(r.words, want);
});

test("RSPPIX in as7, alone or after sop.s, is Titan's listing word for word", () => {
	const sop = readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8");
	const text = readFileSync(new URL("rsppix.oct", DIR), "utf8");
	const source = readFileSync(new URL("../pdp7forth/rsppix.s", DIR), "utf8");
	const want = text.trim().split("\n").map((line) =>
		line.trim().split(/\s+/).map((word) => Number.parseInt(word, 8)) as [number, number],
	);
	for (const tapes of [[{ name: "rsppix.s", text: source }], [{ name: "sop.s", text: sop }, { name: "rsppix.s", text: source }]]) {
		const result = assembleAs7(tapes, { base: 0 });
		assert.deepEqual(result.errors, []);
		assert.deepEqual(result.words, want);
	}
});

test("Cambridge VEC ON modifier assembles as an intensifying Type 340 vector", () => {
	const result = assemble([{ name: "vectors", text: "DISP\nVEC ON 10 0\nVEC ON 4 10\n" }], {
		dialect: "cambridge",
		origin: 0o22,
	});
	assert.deepEqual(result.errors, []);
	assert.deepEqual(result.variables, []);
	assert.deepEqual(result.words, [[0o22, 0o200010], [0o23, 0o204004]]);
});

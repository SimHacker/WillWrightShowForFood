import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble } from "./asm.js";

const DIR = new URL("../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/", import.meta.url);

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

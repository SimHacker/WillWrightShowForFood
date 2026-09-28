import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assembleAs7, formatA7out, formatAs7Labels } from "./asm/as7.js";

const tape = (path: string) => ({ name: path.split("/").pop() as string, text: readFileSync(new URL(`../tapes/${path}`, import.meta.url), "utf8") });
const forth = assembleAs7([tape("pdp7unix/sop.s"), tape("pdp7forth/kernel.s"), tape("pdp7forth/end.s")]);

test("as7: Mitch's kernel assembles to exactly what pdp7-unix's as7 made of it", () => {
	assert.deepEqual(forth.errors, []);
	assert.equal(formatA7out(forth), readFileSync(new URL("../tapes/pdp7forth/kernel.a7out", import.meta.url), "utf8"));
});

test("as7: and its Labels: table is the listing's, name for name", () => {
	const lst = readFileSync(new URL("../tapes/pdp7forth/kernel.lst", import.meta.url), "utf8");
	assert.equal(formatAs7Labels(forth), lst.slice(lst.indexOf("\nLabels:")));
	assert.equal(forth.symbols.get("cold"), 0o736);
});

test("as7: the language, piece by piece", () => {
	const r = assembleAs7([
		{
			name: "t.s",
			text: [
				".=0100",
				'a: 10; 010 " decimal, then octal',
				"b: jmp 1f; 1: 0; jmp 1b",
				"<A>B; a+b; b-a; <x",
				"loooooooong: lac i a",
				"x = 7",
				"x",
			].join("\n"),
		},
	]);
	assert.deepEqual(r.errors, []);
	assert.deepEqual(r.words, [
		[0o100, 10], [0o101, 0o10],
		[0o102, 0o600103], [0o103, 0], [0o104, 0o600103],
		[0o105, (65 << 9) | 66], [0o106, 0o100 + 0o102], [0o107, 2], [0o110, 120 << 9],
		[0o111, 0o220100],
		[0o112, 7],
	]);
	assert.equal(r.symbols.get("looooooo"), 0o111, "labels are cut to 8 characters");
});

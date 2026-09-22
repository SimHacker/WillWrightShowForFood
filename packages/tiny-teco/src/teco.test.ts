import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { CTRL_CARET, ESC } from "./engine.js";
import { createTinyTeco } from "./its.js";

const enc = (s: string): Uint8Array => new TextEncoder().encode(s);

function run(src: string | Uint8Array) {
	const e = createTinyTeco();
	e.load(typeof src === "string" ? enc(src) : src);
	e.run();
	return e;
}

test("insert and jump", () => {
	const e = run(`ihello${String.fromCharCode(ESC)}j`);
	assert.equal(e.buffer.contents, "hello");
	assert.equal(e.buffer.point, 0);
});

test("nI repeats", () => {
	const e = run(`3ix${String.fromCharCode(ESC)}`);
	assert.equal(e.buffer.contents, "xxx");
});

test("search + iterate + delete R", () => {
	const e = createTinyTeco();
	const p = enc(`i0yR2 0yR2${String.fromCharCode(ESC)}j<sR${String.fromCharCode(ESC)};-d>`);
	e.load(p);
	e.run();
	assert.equal(e.buffer.contents, "0y2 0y2");
});

test("lone minus is -1", () => {
	const e = run(`iAB${String.fromCharCode(ESC)}-d`);
	assert.equal(e.buffer.contents, "A");
});

test("Q-register numeric and :I char", () => {
	const e = createTinyTeco();
	const bytes = Uint8Array.from([
		0x33, 0x75, 0x71, // 3uq
		0x71, 0x71, 0x2b, CTRL_CARET, 0x30, 0x3a, 0x69, 0x71, // qq+^^0:iq
	]);
	e.load(bytes);
	e.run();
	assert.equal(e.qregs.get("q").numeric, 3);
	assert.equal(e.qregs.get("q").text, "3");
});

test("compile one R transition", () => {
	const e = createTinyTeco();
	const i = (s: string) => [...enc(s)];
	const bytes = Uint8Array.from([
		...i("i0yR2"),
		ESC,
		...i("j<sR"),
		ESC,
		...i(";-d-2ciql-"),
		CTRL_CARET,
		ESC,
		...i('ci"ed'),
		CTRL_CARET,
		ESC,
		...i("cii"),
		ESC,
		...i("ciuq'"),
		ESC,
		...i(">"),
	]);
	e.load(bytes);
	e.run();
	assert.match(e.buffer.contents, /ql-/);
	assert.match(e.buffer.contents, /uq'/);
	assert.ok(!e.buffer.contents.includes("R"));
});

test("Minsky mail loads and reaches an implemented halt or a named hole", () => {
	const here = dirname(fileURLToPath(import.meta.url));
	const raw = join(here, "../../../characters/marvin-minsky/sources/teco-utm/minsky-utm.teco");
	const bytes = new Uint8Array(readFileSync(raw));
	const e = createTinyTeco();
	e.load(bytes);
	try {
		e.run(200_000);
		assert.ok(e.halted);
	} catch (err) {
		assert.ok(err instanceof Error);
		assert.match(err.message, /not implemented|halt|step limit|empty Q-register|unexpected end/);
	}
});

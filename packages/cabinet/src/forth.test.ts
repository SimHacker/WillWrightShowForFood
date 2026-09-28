import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { bootForth, compileForth, forthDemo, parseAs7Labels } from "./forth.js";
import { Clock } from "./plugins/clock.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { Type340 } from "./plugins/type340.js";

const tape = (f: string) => readFileSync(new URL(`../tapes/pdp7forth/${f}`, import.meta.url), "utf8");
const tapes = {
	a7out: tape("kernel.a7out"),
	listing: tape("kernel.lst"),
	sources: [tape("prelude.fs"), tape("turtle.fs")],
};
const image = compileForth(tapes);

function machine() {
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	let lit = 0;
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		pens: [],
		onFrame: (f) => (lit = f.segments.filter((s) => s.intensify).length),
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const box = new Cabinet({ cpu, devices: [t340, tty, new Clock({ cpu })] });
	t340.clock = () => box.cycles;
	bootForth(cpu, image);
	const type = (text: string) => {
		for (const ch of text) tty.type((ch === "\n" ? 0o15 : ch.toUpperCase().charCodeAt(0)) | 0o200);
	};
	/** Type a line and run until Forth answers it. */
	const line = (text: string): string => {
		const from = paper.length;
		type(`${text}\n`);
		for (let n = 0; n < 200 && !/ok\r\n$|\?/.test(paper.slice(from)); n += 1) box.run(50_000);
		box.run(200_000);
		return paper.slice(from);
	};
	return { cpu, box, line, type, paper: () => paper, lit: () => lit };
}

test("forth: the listing's labels give cold, the entry Mitch's mkdo.py starts at", () => {
	assert.equal(parseAs7Labels(tapes.listing).get("cold"), 0o736);
	assert.equal(image.cold, 0o736);
});

test("forth: the prelude and turtle compile from paper tape with every line ok", () => {
	assert.match(image.log, /PDP-7 FORTH/);
	assert.match(image.log, /pendown clearscreen\s+ok/);
});

test("forth: boots to its banner and does arithmetic at the prompt", () => {
	const m = machine();
	m.box.run(300_000);
	assert.match(m.paper(), /PDP-7 FORTH/);
	assert.match(m.line("2 3 + ."), /2 3 \+ \. 5\s+ok/);
	assert.match(m.line(": SQ DUP * ; 7 SQ ."), / 49\s+ok/);
});

test("forth: the turtle draws a flower of eight squares on the 340", () => {
	const m = machine();
	m.box.run(300_000);
	m.line(": SQ 4 0 DO 200 FD 90 RT LOOP ;");
	m.line(": FLOWER 8 0 DO SQ 45 RT LOOP ;");
	assert.match(m.line("CS FLOWER"), /ok/);
	// 32 sides of 200 points, each two vectors of at most 127, and the turtle's 3.
	assert.equal(m.lit(), 67);
});

test("forth: the scripted demo runs to the end and Forth accepts every line", () => {
	const m = machine();
	for (const step of forthDemo({ type: m.type })) {
		if (typeof step === "number") m.box.run(step);
	}
	assert.doesNotMatch(m.paper(), /\?/);
	assert.match(m.paper(), /STAR HT\s+ok/);
	assert.equal(m.lit(), 80);
});

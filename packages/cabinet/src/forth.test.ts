import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth, forthDemo, parseAs7Labels, setForthColumns } from "./forth.js";
import { Clock } from "./plugins/clock.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { Type340 } from "./plugins/type340.js";

const tape = (f: string) => readFileSync(new URL(`../tapes/pdp7forth/${f}`, import.meta.url), "utf8");
const tapes = {
	a7out: tape("kernel.a7out"),
	listing: tape("kernel.lst"),
	sources: [tape("prelude.fs"), tape("turtle.fs"), tape("scheme.fs")],
};
const image = compileForth(tapes);

function machine(img = image) {
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
	bootForth(cpu, img);
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

test("forth: built from source here, it is the same image, word for word, as from Mitch's as7", () => {
	const kernel = assembleForthKernel({
		sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
		kernel: tape("kernel.s"),
		end: tape("end.s"),
	});
	const built = compileForth({ kernel, sources: tapes.sources });
	assert.equal(built.cold, image.cold);
	assert.deepEqual([...built.labels], [...image.labels]);
	assert.ok(built.core.every((w, a) => w === image.core[a]), "all 8K words");
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

test("forth: evaluates nested S-expressions and passes results to a CPS token", () => {
	const m = machine();
	m.box.run(300_000);
	assert.match(m.line(`S" 2" ' . EVALCPS`), /2\s+ok/);
	assert.match(m.line(`S" (+ 2 3)" ' . EVALCPS`), /5\s+ok/);
	assert.match(m.line(`S" (+ 2 3)" ' KEND EVALCPS`), /5\s+ok/);
	assert.match(m.line(`S" (+ 2 (* 3 4))" ' . EVALCPS`), /14\s+ok/);
	assert.match(m.line(`S" (+ 2 (* 3 4))" ' KPLUS1 EVALCPS`), /15\s+ok/);
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

test("forth: tell it the terminal is 40 columns and WORDS breaks its lines to fit", () => {
	const m = machine();
	m.box.run(300_000);
	assert.ok(setForthColumns(m.cpu, image, 40));
	const out = m.line("WORDS");
	const lines = out.split("\r\n").filter((l) => l.trim() !== "");
	assert.ok(lines.length > 10, out);
	for (const l of lines) assert.ok(l.length <= 40, `${l.length}: ${l}`);
	setForthColumns(m.cpu, image, 100);
	const wide = m.line("WORDS").split("\r\n").filter((l) => l.trim() !== "");
	assert.ok(wide.length < lines.length, "wider paper, fewer lines");
});

const full = compileForth({
	kernel: assembleForthKernel({
		sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
		kernel: tape("kernel-names-full.s"),
		end: tape("end.s"),
		kernelName: "kernel-names-full.s",
	}),
	sources: tapes.sources,
});

test("forth, full names: SQUARE and SQUID are two words, and WORDS spells every name out", () => {
	const m = machine(full);
	m.box.run(300_000);
	m.line(": SQUARE DUP * ;");
	assert.doesNotMatch(m.line(": SQUID 1 ;"), /redefined/);
	assert.match(m.line("7 SQUARE . SQUID ."), / 49 1\s+ok/);
	assert.match(m.line("SQUAREX"), /SQUAREX \?/);
	assert.match(m.line("5 CELL+ . 5 CELLS . 5 CHAR+ . 5 CHARS ."), / 6 5 6 5\s+ok/);
	assert.match(m.line(": SQUARE DUP DUP * * ;"), /SQUARE redefined/);
	const from = m.paper().length;
	m.line("WORDS");
	m.box.run(3_000_000); // line() stops at ONSCREEN?'s question mark
	const words = m.paper().slice(from);
	for (const w of ["SQUID", "SQUARE", "CLEARSCREEN", "EVALCPS", "IMMEDIATE", "(NUMBER)", "EXIT"]) assert.ok(words.split(/\s+/).includes(w), w);
	assert.doesNotMatch(words, /_/);
});

test("forth, full names: 31 characters is the longest name, and an abandoned definition gives its name back", () => {
	const m = machine(full);
	m.box.run(300_000);
	const n31 = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDE";
	m.line(`: ${n31} 42 ;`);
	assert.match(m.line(`${n31} .`), / 42\s+ok/);
	assert.match(m.line(`${n31.slice(0, -1)}F`), /\?/);
	assert.match(m.line(`: ${n31}F 1 ;`), /name\?/);
	const here = m.line("HERE .").match(/ (\d+)\s+ok/)?.[1];
	m.line(": AVERYLONGBROKENNAME 1 NOSUCHWORD ;");
	assert.equal(m.line("HERE .").match(/ (\d+)\s+ok/)?.[1], here);
});

test("forth, full names: the turtle and the S-expressions run as on Mitch's kernel", () => {
	const m = machine(full);
	m.box.run(300_000);
	m.line(": SQ 4 0 DO 200 FD 90 RT LOOP ;");
	m.line(": FLOWER 8 0 DO SQ 45 RT LOOP ;");
	assert.match(m.line("CS FLOWER"), /ok/);
	assert.equal(m.lit(), 67);
	assert.match(m.line(`S" (+ 2 (* 3 4))" ' KPLUS1 EVALCPS`), /15\s+ok/);
});

const ringsKernel = assembleForthKernel({
	sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
	kernel: tape("kernel-names-full.s"),
	end: tape("end.s"),
	kernelName: "kernel-names-full.s",
	pixie: { glue: tape("pixie.s"), rsppix: tape("rsppix.s") },
});
const rings = compileForth({
	kernel: ringsKernel,
	sources: [tape("prelude.fs"), tape("does.fs"), tape("turtle.fs"), tape("pixie.fs")],
});

test("forth, PIXIE rings: RSPPIX, moved up to 14022, is the 1972 code word for word", () => {
	const rsppix = assembleForthKernel({ sop: "", kernel: tape("rsppix.s"), end: "" });
	const at = rings.labels.get("rsetup") as number;
	assert.equal(at, 0o14022);
	const placed = new Map(ringsKernel.words);
	for (const [a, w] of rsppix.words) {
		if (a >= (rsppix.symbols.get("rbeg") as number) && a < (rsppix.symbols.get("rlit000") as number)) continue; // its variables are pixie.s's
		// Only operands of RSPPIX's own code and literals move; its variables are named, not placed.
		const moved = placed.get(a - 0o22 + at) as number;
		const operand = w & 0o17777;
		const isVar = operand >= (rsppix.symbols.get("rbeg") as number) && operand < (rsppix.symbols.get("rlit000") as number);
		if (isVar) continue;
		assert.ok(moved === w || moved === ((w + 0o14000) & 0o777777), `${a.toString(8)}: ${w.toString(8)} became ${moved.toString(8)}`);
	}
});

test("forth, PIXIE rings: elements named in Forth go round RSAVINS, and RSPPIX finds their names", () => {
	const m = machine(rings);
	m.box.run(300_000);
	assert.match(m.line("RSAVINS RCOUNT ."), / 0\s+ok/);
	for (const name of ["SQUARE", "TRIANGLE", "HEX"]) assert.match(m.line(`RSAVINS S" ${name}" NAMED`), /ok/);
	assert.match(m.line("RSAVINS RCOUNT ."), / 3\s+ok/);
	assert.match(m.line("RSAVINS .RING"), /HEX TRIANGLE SQUARE\s+ok/);
	assert.match(m.line("2 3 + ."), / 5\s+ok/);
});

test("forth, PIXIE rings: the 1972 garbage collector takes back deleted elements, and a full area says so", () => {
	const m = machine(rings);
	m.box.run(300_000);
	m.line(`: MANY 0 DO RSAVINS S" AB" NAMED LOOP ;`);
	m.line(": DROPALL 0 DO RSAVINS RFIRST RX RCAR RX RDELB LOOP ;");
	for (let k = 0; k < 4; k += 1) assert.match(m.line("50 MANY 50 DROPALL RSAVINS RCOUNT ."), / 0\s+ok/);
	assert.match(m.line("RINGS 60 MANY RINGS 60 MANY RSAVINS RCOUNT ."), / 60\s+ok/);
	assert.match(m.line("400 MANY"), /MANY rings full\?/);
	assert.ok(!m.cpu.halted);
	assert.match(m.line("RINGS 2 3 + ."), / 5\s+ok/);
});

test("forth, CREATE DOES>: defining words, as Open Firmware and CForth spell them", () => {
	const m = machine(rings);
	m.box.run(300_000);
	m.line(": KONST CREATE , DOES> @ ;");
	m.line("42 KONST ANSWER");
	assert.match(m.line("ANSWER ."), / 42\s+ok/);
	m.line(": ARRAY CREATE ALLOT DOES> + ;");
	m.line("10 ARRAY A");
	assert.match(m.line("7 3 A ! 3 A @ . 0 A ' A >BODY = ."), / 7 -1\s+ok/);
	assert.match(m.line("CREATE PLAIN 5 , PLAIN @ ."), / 5\s+ok/);
	assert.match(m.line("' ANSWER >BODY @ ."), / 42\s+ok/);
});

test("forth, PIXIE rings: the turtle still draws with the rings loaded", () => {
	const m = machine(rings);
	m.box.run(300_000);
	m.line(": SQ 4 0 DO 200 FD 90 RT LOOP ;");
	assert.match(m.line("CS SQ"), /ok/);
	assert.equal(m.lit(), 11);
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

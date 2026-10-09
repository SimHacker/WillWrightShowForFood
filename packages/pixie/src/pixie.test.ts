import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
	BlockletHost,
	Cabinet,
	Clock,
	Pdp7,
	Teletype,
	TinyTitan,
	toSvg,
	Type340,
} from "@wwsff/cabinet";
import { loadSymelec } from "@wwsff/cabinet/fixtures";

import { car, cdr, pointersResolve, RingBuilder, toArray } from "./cells.js";
import { fern, normalize, potLeaf, toDisplayFile } from "./graftal.js";
import { decodeTransfer, encodeTransfer, implant, packWords, photograph, relocate } from "./image.js";
import { blockHeader, classify, NIL, PXID, pointer } from "./words.js";

test("words: the relocation pass's four kinds", () => {
	assert.equal(classify(0o000315), "atom"); // a CR, a count, a coordinate
	assert.equal(classify(0o100000), "nil"); // NIL is the JMS opcode value
	assert.equal(classify(pointer(0o5162)), "pointer");
	assert.equal(classify(blockHeader(3)), "block");
});

test("relocation: pointers move, atoms hold still, block data is sacred", () => {
	const image = {
		beg: 0o10000,
		end: 0o10006,
		savins: pointer(0o10002),
		words: [
			pointer(0o10002), // pointer: moves
			0o315, // atom: stays
			blockHeader(2), // block header: stays
			pointer(0o10000), // raw block data that LOOKS like a pointer: stays
			0o777777, // raw block data: stays
			NIL, // NIL: stays
		],
	};
	const moved = relocate(image, 0o12000);
	assert.equal(moved.beg, 0o12000);
	assert.equal(moved.savins, pointer(0o12002));
	assert.deepEqual(moved.words, [
		pointer(0o12002),
		0o315,
		blockHeader(2),
		pointer(0o10000),
		0o777777,
		NIL,
	]);
});

test("cells: build a printname, walk it back with CAR and CDR", () => {
	const b = new RingBuilder(0o10000);
	const name = b.printname("FERN");
	b.savins = name;
	const image = b.build();
	assert.ok(pointersResolve(image), "every pointer lands inside the image");

	const chars = toArray(image, name).map((w) => String.fromCharCode(w & 0o177));
	assert.equal(chars.join(""), "FERN");
	assert.equal(car(image, name), "F".charCodeAt(0) | 0o200);
	assert.equal(classify(cdr(image, name)), "pointer");

	// The wire round trip, including a move to a new address.
	const stream = encodeTransfer(image);
	assert.equal(stream[0], PXID);
	const back = decodeTransfer(stream);
	assert.deepEqual(back, image);
	const moved = relocate(back, 0o14000);
	const chars2 = toArray(moved, moved.savins).map((w) => String.fromCharCode(w & 0o177));
	assert.equal(chars2.join(""), "FERN", "still walks after relocation");
});

test("graftal: the fern grows through the real 340 into SVG", () => {
	const strokes = normalize(fern(5));
	assert.ok(strokes.length > 500, `a grown fern has fronds: ${strokes.length}`);
	const file = toDisplayFile(strokes);

	// Execute on the actual mode machine over bare memory.
	const mem = new Array<number>(8192).fill(0);
	for (let i = 0; i < file.length; i += 1) mem[0o100 + i] = file[i]!;
	const t = new Type340({
		fetch: (a) => mem[a] ?? 0,
		store: (a, w) => {
			mem[a] = w;
		},
	});
	t.iot({ device: 0o06, pulse: 0o06, ac: 0o100 }); // IDLA
	for (let i = 0; i < file.length + 10; i += 1) t.tick();
	const picture = t.lastFrame?.segments ?? t.segments;
	const drawn = picture.filter((s) => s.intensify);
	assert.ok(drawn.length >= strokes.length, "every stroke made light");

	const dir = fileURLToPath(new URL("../snapshots/", import.meta.url));
	mkdirSync(dir, { recursive: true });
	writeFileSync(`${dir}graftal-fern.svg`, toSvg(picture));

	// And the leaf everyone recognizes.
	// Rehmi and Don's leaf is about 11K words of display file and core is 8K, so it goes in two loads.
	const leaf = normalize(potLeaf());
	const leafPicture: typeof picture = [];
	const half = Math.ceil(leaf.length / 2);
	for (const part of [leaf.slice(0, half), leaf.slice(half)]) {
		const leafFile = toDisplayFile(part);
		assert.ok(leafFile.length < 8192 - 0o100, `half a leaf fits in core: ${leafFile.length}`);
		mem.fill(0);
		for (let i = 0; i < leafFile.length; i += 1) mem[0o100 + i] = leafFile[i]!;
		const t2 = new Type340({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w) });
		t2.iot({ device: 0o06, pulse: 0o06, ac: 0o100 });
		for (let i = 0; i < leafFile.length + 10; i += 1) t2.tick();
		leafPicture.push(...(t2.lastFrame?.segments ?? t2.segments));
	}
	assert.ok(leafPicture.filter((s) => s.intensify).length >= leaf.length - 20, "every leaf stroke made light");
	writeFileSync(`${dir}graftal-pot-leaf.svg`, toSvg(leafPicture));
});

test("graftal: a zero-length stroke still leaves VECTOR mode before the next PARAM", () => {
	const far = { x0: 900, y0: 900, x1: 950, y1: 900 };
	const file = toDisplayFile([{ x0: 100, y0: 100, x1: 100, y1: 100 }, far]);
	const mem = new Array<number>(8192).fill(0);
	for (let i = 0; i < file.length; i += 1) mem[0o100 + i] = file[i]!;
	const t = new Type340({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w) });
	t.iot({ device: 0o06, pulse: 0o06, ac: 0o100 });
	for (let i = 0; i < file.length + 10; i += 1) t.tick();
	const lit = (t.lastFrame?.segments ?? t.segments).filter((s) => s.intensify);
	assert.deepEqual(
		lit.map((s) => [s.x0, s.y0, s.x1, s.y1]),
		[[900, 900, 950, 900]],
		"the far stroke is drawn where it belongs, and nothing else",
	);
});

test("acceptance: decode the transfer 1972 SYMELEC actually sends", () => {
	const cpu = new Pdp7({ coreWords: 8192 });
	loadSymelec(cpu);

	const host = new BlockletHost([0o30]);
	const t340 = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const tty = new Teletype({ printCycles: 200 });
	const box = new Cabinet({
		cpu,
		devices: [t340, tty, new Clock({ cpu }), new TinyTitan({ port: host })],
	});
	t340.clock = () => box.cycles;

	cpu.pc = 0o22;
	for (let i = 0; i < 30 && !t340.lastFrame; i += 1) box.run(100_000);
	for (const ch of "TITAN") tty.type(ch.charCodeAt(0) | 0o200);
	tty.type(0o215);
	box.run(3_000_000);

	const image = decodeTransfer(host.received);
	assert.equal(image.beg, cpu.read(0o5162), "heading DSBEG is the BEG variable");
	assert.equal(image.end, cpu.read(0o5163), "heading DSEND is the END variable");
	assert.equal(image.savins, cpu.read(0o5146), "heading SAVINS is the SAVINS variable");
	for (const w of image.words) assert.ok(classify(w), "every word classifies");
	// Re-encode: byte-identical to what crossed the wire.
	assert.deepEqual(encodeTransfer(image), host.received);
});

async function forthRings() {
	const { assembleForthKernel, compileForth, bootForth } = await import("@wwsff/cabinet");
	const { ringToScene } = await import("./scene.js");
	const tape = (f: string) => readFileSync(new URL(`../../cabinet/tapes/${f}`, import.meta.url), "utf8");
	const kernel = assembleForthKernel({
		sop: tape("pdp7unix/sop.s"),
		kernel: tape("pdp7forth/kernel-names-full.s"),
		end: tape("pdp7forth/end.s"),
		kernelName: "kernel-names-full.s",
		pixie: { glue: tape("pdp7forth/pixie.s"), rsppix: tape("pdp7forth/rsppix.s") },
	});
	const image = compileForth({ kernel, sources: ["prelude.fs", "does.fs", "turtle.fs", "pixie.fs"].map((f) => tape(`pdp7forth/${f}`)) });
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	const tty = new Teletype({ printCycles: 100, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const box = new Cabinet({ cpu, devices: [tty] });
	bootForth(cpu, image);
	box.run(300_000);
	const line = (text: string): string => {
		paper = "";
		for (const ch of `${text}\r`) tty.type(ch.charCodeAt(0) | 0o200);
		for (let n = 0; n < 40 && !/ok\r\n$|\?\r\n$/.test(paper); n += 1) box.run(50_000);
		return paper;
	};
	return { cpu, image, line };
}

test("Forth's PIXIE rings: elements built at the teletype show in the RINGS scene from RSAVINS", async () => {
	const { ringToScene } = await import("./scene.js");
	const { cpu, image, line } = await forthRings();
	for (const name of ["SQUARE", "TRIANGLE", "HEX"]) assert.match(line(`RSAVINS S" ${name}" NAMED`), /NAMED\s+ok\r\n$/);
	// The applet's capture: the cells RBEG, REND and RSAVINS name.
	const at = (n: string) => cpu.read(image.labels.get(n) as number);
	const beg = at("rbeg") & 0o17777;
	const end = at("rend") & 0o17777;
	const savins = at("rsavins") & 0o777777;
	const words: number[] = [];
	for (let a = beg; a < end; a += 1) words.push(cpu.read(a) & 0o777777);
	const img = { beg, end, savins, words };
	const scene = ringToScene(img, [savins]);
	// The ring item at RSAVINS, and for each element its head, its atname and its printname.
	assert.equal(scene.chains[0]?.cells[0], savins & 0o17777);
	assert.ok(!scene.chains.some((c) => c.kind === "outside"), "nothing the scene reaches lies outside RBEG..REND");
	// Each element's printname, a run of character words as RSPPIX keeps a list, reads whole.
	const names = scene.chains.map((c) => c.text).filter((t): t is string => t !== undefined);
	assert.deepEqual(names.sort(), ["HEX", "SQUARE", "TRIANGLE"]);
	assert.ok(scene.chains.length >= 7, `${scene.chains.length} chains`);
});

test("Forth's PIXIE rings: save to a file, wipe, load it back into core, and Forth walks and extends it", async () => {
	const { readRings } = await import("./scene.js");
	const { cpu, image, line } = await forthRings();
	for (const name of ["SQUARE", "TRIANGLE"]) line(`RSAVINS S" ${name}" NAMED`);
	const at = (n: string) => image.labels.get(n) as number;
	const cells = { beg: at("rbeg"), end: at("rend"), savins: at("rsavins"), free: at("rfree"), endres: at("rendres"), bot: at("rbot"), top: at("rtop") };
	const read = (a: number) => cpu.read(a);
	const photo = photograph(read, cells);
	// What SAVE writes: the binary transfer stream, which readRings takes back.
	const file = readRings(packWords(encodeTransfer(photo)));
	assert.deepEqual(file, photo);
	assert.match(line("RINGS RSAVINS RCOUNT ."), / 0\s+ok/);
	// Into core somewhere else: relocation makes it true at RBEG.
	implant(relocate(file, 0o2000), read, (a, w) => cpu.write(a, w), cells);
	assert.match(line("RSAVINS RCOUNT ."), / 2\s+ok/);
	assert.match(line("RSAVINS .RING"), /TRIANGLE SQUARE\s+ok/);
	assert.match(line(`RSAVINS S" HEX" NAMED RSAVINS .RING`), /HEX TRIANGLE SQUARE\s+ok/);
	assert.match(line(": MANY 0 DO RSAVINS S\" AB\" NAMED LOOP ; 40 MANY RSAVINS RCOUNT ."), / 43\s+ok/);
});

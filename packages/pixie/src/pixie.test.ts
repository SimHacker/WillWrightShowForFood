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
import { decodeTransfer, encodeTransfer, relocate } from "./image.js";
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
	const leaf = normalize(potLeaf());
	const leafFile = toDisplayFile(leaf);
	for (let i = 0; i < 8192; i += 1) mem[i] = 0;
	for (let i = 0; i < leafFile.length; i += 1) mem[0o100 + i] = leafFile[i]!;
	const t2 = new Type340({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w) });
	t2.iot({ device: 0o06, pulse: 0o06, ac: 0o100 });
	for (let i = 0; i < leafFile.length + 10; i += 1) t2.tick();
	const leafPicture = t2.lastFrame?.segments ?? t2.segments;
	assert.ok(leafPicture.some((s) => s.intensify), "the leaf made light");
	writeFileSync(`${dir}graftal-pot-leaf.svg`, toSvg(leafPicture));
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

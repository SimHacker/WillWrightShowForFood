import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "./forth.js";
import { Clock } from "./plugins/clock.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";

const tape = (f: string) => readFileSync(new URL(`../tapes/${f}`, import.meta.url), "utf8");
const image = compileForth({
	kernel: assembleForthKernel({
		sop: tape("pdp7unix/sop.s"),
		kernel: tape("pdp7forth/kernel-names-full.s"),
		end: tape("pdp7forth/end.s"),
		kernelName: "kernel-names-full.s",
	}),
	sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "interrupt.fs", "xmem.fs"].map((f) => tape(`pdp7forth/${f}`)),
});

function machine(coreWords: number) {
	const cpu = new Pdp7({ coreWords });
	let paper = "";
	const tty = new Teletype({ printCycles: 100, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const clock = new Clock({ cpu, cyclesPerTick: 2000 });
	const box = new Cabinet({ cpu, devices: [tty, clock] });
	bootForth(cpu, image);
	box.run(300_000);
	const line = (text: string): string => {
		const from = paper.length;
		for (const ch of `${text}\r`) tty.type(ch.toUpperCase().charCodeAt(0) | 0o200);
		for (let n = 0; n < 400 && !/ok\r\n$|\?\r\n$/.test(paper.slice(from)); n += 1) box.run(20_000);
		return paper.slice(from);
	};
	const nums = (s: string) => (s.match(/-?\d+(?=\s)/g) ?? []).map(Number);
	return { cpu, box, line, nums };
}

test("xmem: X@ and X! reach every bank of a 32K machine, and leave extend mode off", () => {
	const m = machine(32768);
	assert.match(m.line("XMEM? ."), /-1\s+ok/, "the extension is there");
	for (const [addr, value] of [[8192, 123], [16384 + 77, -5], [24576 + 8191, 262143 & 0o377777]]) {
		m.line(`${value} ${addr} X!`);
		assert.equal(m.cpu.read(addr!) & 0o777777, value! & 0o777777, `X! put ${value} at ${addr}`);
		assert.match(m.line(`${addr} X@ .`), new RegExp(`${value}\\s+ok`), `X@ reads it back from ${addr}`);
		assert.equal(m.cpu.extend, false, "extend mode is off again");
	}
	assert.equal(m.cpu.read(8192 & 0o17777), m.cpu.read(0), "bank 0's first word untouched by bank 1's store");
	assert.match(m.line("2 3 + ."), / 5\s+ok/, "and Forth is none the worse");
});

test("xmem: XMOVE copies a hand pose up into high memory and back down", () => {
	const m = machine(32768);
	m.line("CREATE POSE 63 ALLOT  CREATE BACK 63 ALLOT");
	m.line(": FILL 63 0 DO I 7 * 1000 + POSE I + ! LOOP ;");
	m.line("FILL  XHERE @ .");
	const at = m.nums(m.line("XHERE @ ."))[0]!;
	assert.equal(at, 8192, "XHERE starts at the bottom of bank 1");
	m.line("POSE XHERE @ 63 XMOVE  63 XALLOT");
	for (let i = 0; i < 63; i += 1) assert.equal(m.cpu.read(8192 + i), 1000 + 7 * i, `word ${i} copied up`);
	m.line("POSE XHERE @ 63 XMOVE  63 XALLOT");
	assert.equal(m.cpu.read(8192 + 63 + 62), 1000 + 7 * 62, "a second pose after the first");
	m.line("8192 63 + BACK 63 XMOVE");
	assert.match(m.line("BACK 62 + @ ."), / 1434\s+ok/, "copied back down");
	assert.match(m.line("XROOM ."), new RegExp(`${32768 - 8192 - 126}\\s+ok`), "the room left");
	assert.match(m.line("POSE 8192 0 XMOVE  POSE 8192 -3 XMOVE  2 3 + ."), / 5\s+ok/, "zero and negative counts do nothing");
	m.line("VARIABLE V  4321 V !  V 8192 200 + 1 XMOVE");
	assert.equal(m.cpu.read(8192 + 200), 4321, "a VARIABLE's LAW-form address is bank 0");
	assert.equal(m.cpu.extend, false);
});

test("xmem: XMOVE copies bank to bank in one step, overlapping either way, as MOVE does", () => {
	const m = machine(32768);
	const fill = (at: number, n: number) => { for (let i = 0; i < n; i += 1) m.cpu.write(at + i, 1000 + i); };
	const check = (at: number, n: number, what: string) => {
		for (let i = 0; i < n; i += 1) assert.equal(m.cpu.read(at + i), 1000 + i, `${what}: word ${i}`);
	};
	fill(8192, 300);
	m.line("8192 24576 300 XMOVE");
	check(24576, 300, "bank 1 to bank 3, straight across");
	fill(16384, 300);
	m.line("16384 16384 100 + 300 XMOVE");
	check(16384 + 100, 300, "overlapping, destination above: copied from the top down");
	fill(16384 + 1000, 300);
	m.line("16384 1000 + 16384 900 + 300 XMOVE");
	check(16384 + 900, 300, "overlapping, destination below: copied from the bottom up");
	fill(8192 + 8000, 400);
	m.line("8192 8000 + 16384 4000 + 400 XMOVE");
	check(16384 + 4000, 400, "a source that runs from bank 1 into bank 2");
	assert.equal(m.cpu.extend, false);
});

test("xmem: on a machine with only 8K, XMEM? is false and XROOM is 0", () => {
	const m = machine(8192);
	assert.match(m.line("XMEM? ."), / 0\s+ok/);
	assert.match(m.line("XROOM ."), / 0\s+ok/);
});

test("xmem: a long copy runs through clock interrupts handled in Forth and comes out whole", () => {
	const m = machine(32768);
	// Fill bank 2 with a pattern from the host, then copy it to bank 3 under interrupts.
	for (let i = 0; i < 4000; i += 1) m.cpu.write(16384 + i, (i * 13 + 5) & 0o777777);
	// The clock raises its flag when location 7 counts up past 0: preset it to -1 each tick.
	// A skip chain, as PDP-7 handlers go: the clock, else the teleprinter, else give up.
	m.line("OCTAL 700001 IOT-SKIP CLOCK? 700044 IOT-PULSE CLOCK-ON DECIMAL  VARIABLE TICKS");
	m.line(": TICK? CLOCK? IF 1 TICKS +! -1 7 ! CLOCK-ON EXIT THEN");
	m.line("  TTY-DONE? IF TTY-ACK EXIT THEN  INTERRUPTS-OFF ;");
	m.line("' TICK? INTERRUPT-VECTOR !  0 TICKS !  -1 7 ! CLOCK-ON");
	// One line, so nothing types (and interrupts) between turning them on and the copy.
	m.line("INTERRUPTS-ON 16384 24576 4000 XMOVE INTERRUPTS-OFF");
	const ticks = m.nums(m.line("TICKS @ ."))[0]!;
	assert.ok(ticks > 3, `interrupts came during the copy: ${ticks}`);
	for (let i = 0; i < 4000; i += 1) assert.equal(m.cpu.read(24576 + i), (i * 13 + 5) & 0o777777, `word ${i}`);
	assert.equal(m.cpu.extend, false);
	assert.match(m.line("2 3 + ."), / 5\s+ok/);
});

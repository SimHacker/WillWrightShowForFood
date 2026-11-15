import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "../cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "../forth.js";
import { Clock } from "../plugins/clock.js";
import { Pdp7 } from "../plugins/pdp7.js";
import { Teletype } from "../plugins/teletype.js";
import { Type340 } from "../plugins/type340.js";
import { ForthDevice } from "./forth-device.js";
import { KorzPdp7 } from "./pdp7.js";

const tape = (name: string) => readFileSync(new URL(`../../tapes/pdp7forth/${name}`, import.meta.url), "utf8");
const image = compileForth({
	kernel: assembleForthKernel({
		sop: readFileSync(new URL("../../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
		kernel: tape("kernel-names-full.s"),
		end: tape("end.s"),
		kernelName: "kernel-names-full.s",
	}),
	sources: ["prelude.fs", "does.fs", "turtle.fs"].map(tape),
});

type Level = "pdp7" | "interpret" | "resolve" | "compile";

function machine(level: Level, device: boolean) {
	const cpu = level === "pdp7" ? new Pdp7({ coreWords: 8192 }) : new KorzPdp7({ coreWords: 8192, korz: level });
	let paper = "";
	let lit = "";
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		pens: [],
		onFrame: (f) => (lit = JSON.stringify(f.segments.map(({ cycle: _c, frame: _f, ...s }) => s))),
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const box = new Cabinet({ cpu, devices: [t340, tty, new Clock({ cpu })] });
	t340.clock = () => box.cycles;
	bootForth(cpu, image);
	const dev = device ? new ForthDevice(image.labels).install(cpu as KorzPdp7) : null;
	box.run(300_000);
	/** Type a line and run until Forth answers it; the cycles it took. */
	const line = (text: string): number => {
		const from = paper.length;
		const at = box.cycles;
		for (const ch of `${text}\r`) tty.type(ch.toUpperCase().charCodeAt(0) | 0o200);
		for (let n = 0; n < 20_000 && !/ok\r\n$|\?\r\n$/.test(paper.slice(from)); n += 1) box.run(1000);
		const took = box.cycles - at;
		box.run(100_000);
		return took;
	};
	return { cpu, box, dev, line, paper: () => paper, lit: () => lit };
}

const LINES = [
	"2 3 + .",
	"5 3 - . 3 5 < . 5 3 < . -1 1 U< . 1 -1 U< . 0 0= . 4 0< . -4 0< . 7 7 = .",
	"6 7 * . -6 7 * . 12 10 AND . 12 10 OR . 12 10 XOR . 5 INVERT . 5 NEGATE .",
	"-7 2 / . -7 2 MOD . 7 -2 / . 7 -2 MOD . 100 7 / .",
	": SQ DUP * ; 9 SQ .",
	": TT 3 0 DO 2 0 DO I J * . LOOP LOOP ; TT",
	"VARIABLE V 42 V ! V @ . 10 CONSTANT TEN TEN TEN + .",
	": F 0 SWAP 0 DO I + LOOP ; 100 F .",
	": RR >R R@ R> + ; 5 RR . 1 2 OVER . . .",
	"0 BEGIN 1+ DUP 5 = UNTIL .",
	": SQ 1+ ; 3 SQ .",
	"FOO",
	"3 4 SWAP . . 9 DUP . . 1 2 DROP .",
	"CS 4 0 DO 200 FD 90 RT LOOP",
	"WORDS",
	"HERE .",
];

test("forth device: the same lines print the same on Mitch's kernel and with the device, at every CPU level", () => {
	const reference = machine("pdp7", false);
	for (const l of LINES) reference.line(l);
	assert.match(reference.paper(), / 81\s+ok/);
	for (const level of ["interpret", "resolve", "compile"] as const) {
		for (const device of [false, true]) {
			const m = machine(level, device);
			for (const l of LINES) m.line(l);
			assert.equal(m.paper(), reference.paper(), `${level}${device ? " with the device" : ""}`);
			assert.equal(m.lit(), reference.lit(), `${level}${device ? " with the device" : ""}: the 340's picture`);
			if (m.dev) {
				assert.ok(m.dev.stats.cells > 1000, "the device ran the threads");
				assert.ok(m.dev.stats.handoffs > 0, "code words went to the CPU");
				assert.ok(m.dev.stats.hits > 0, "FIND answered from the table");
			}
		}
	}
});

test("forth device: a loop of primitives takes fewer PDP-7 cycles", () => {
	const soft = machine("compile", false);
	const hard = machine("compile", true);
	const def = ": BUSY 0 SWAP 0 DO I + LOOP DROP ;";
	soft.line(def);
	hard.line(def);
	const s = soft.line("30000 BUSY");
	const h = hard.line("30000 BUSY");
	assert.ok(h * 3 < s, `software ${s} cycles, the device ${h}`);
	const fast = machine("compile", false);
	const dev = new ForthDevice(image.labels, { cellsPerCycle: 8 }).install(fast.cpu as KorzPdp7);
	fast.line(def);
	const f = fast.line("30000 BUSY");
	assert.ok(f * 2 < h, `one cell a cycle ${h} cycles, eight ${f}`);
	assert.ok(dev.stats.cells > 0);
});

test("forth device: unplugged, the CPU runs NEXT itself again", () => {
	const m = machine("resolve", true);
	const shape = (m.cpu as KorzPdp7).sea.shape("read");
	assert.deepEqual(shape, { dims: ["addr", "who", "access"], size: 24, table: true, kinds: { addr: 3 } }, "NEXT, find, and every other address");
	m.line("1 2 + .");
	const cells = m.dev!.stats.cells;
	m.dev!.remove();
	m.line("3 4 + .");
	assert.equal(m.dev!.stats.cells, cells);
	assert.match(m.paper(), / 3\s+ok[\s\S]* 7\s+ok/);
});

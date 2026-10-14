import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Iot } from "./bus.js";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth, type ForthImage } from "./forth.js";
import { DataGlove, GLOVE_BONES, GLOVE_REG, gloveRegisters, toScreen } from "./plugins/glove.js";
import { flexes, GESTURES, ONE, syntheticHand, wavingHand } from "./plugins/hand.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { type Segment, Type340 } from "./plugins/type340.js";

const iot = (pulse: number, ac = 0): Iot => ({ device: 0o57, pulse, ac });

test("hand: a synthetic hand's flex is the curl it was made with", () => {
	for (const g of GESTURES) {
		const f = flexes(syntheticHand({ curls: g.curls, heading: 25 }));
		f.forEach((x, i) => assert.ok(Math.abs(x - g.curls[i]!) < 1e-6, `${g.name} finger ${i}: ${x}`));
	}
	const half = flexes(syntheticHand({ curls: [0.5, 0.25, 0.75, 0.1, 0.9] }));
	[0.5, 0.25, 0.75, 0.1, 0.9].forEach((c, i) => assert.ok(Math.abs(half[i]! - c) < 1e-6));
});

/** Walk the registers as turtle3d.fs does, in exact arithmetic, and say where each landmark lands. */
function walk(r: readonly number[]): [number, number, number][] {
	const rad = (d: number) => (d * Math.PI) / 180;
	const turn = (a: number[], b: number[], d: number): [number[], number[]] => {
		const c = Math.cos(rad(d));
		const s = Math.sin(rad(d));
		return [a.map((v, i) => v * c - b[i]! * s), b.map((v, i) => v * c + a[i]! * s)];
	};
	const wrist = r.slice(GLOVE_REG.wrist, GLOVE_REG.wrist + 3);
	const frame = [0, 1, 2].map((k) => r.slice(GLOVE_REG.frame + 3 * k, GLOVE_REG.frame + 3 * k + 3).map((v) => v / ONE));
	const out: [number, number, number][] = new Array(21);
	out[0] = wrist as [number, number, number];
	let [h, l, u] = frame as [number[], number[], number[]];
	let at = wrist;
	GLOVE_BONES.forEach(([from, to], b) => {
		if (from === 0) [h, l, u, at] = [...(frame as [number[], number[], number[]]), wrist];
		const [yaw, pitch, len] = r.slice(GLOVE_REG.bones + 3 * b, GLOVE_REG.bones + 3 * b + 3) as [number, number, number];
		[h, l] = turn(h, l, yaw);
		[u, h] = turn(u, h, pitch);
		at = at.map((v, i) => v + h[i]! * len);
		out[to] = at as [number, number, number];
	});
	return out;
}

test("glove: the bones, walked by a 3D turtle, reach every landmark", () => {
	for (let t = 0; t < 42; t += 1.3) {
		const f = wavingHand(t);
		const r = gloveRegisters(f);
		const want = f.points.map((p) => toScreen(p));
		walk(r).forEach((p, i) => {
			const w = want[i]!;
			assert.ok(Math.hypot(p[0] - w[0], p[1] - w[1], p[2] - w[2]) < 2.5, `t ${t} landmark ${i}: ${p} vs ${w}`);
		},
		);
		assert.equal(r[GLOVE_REG.status], 3, "a right hand");
	}
	const open = gloveRegisters(syntheticHand({ curls: [0, 0, 0, 0, 0] }));
	const fist = gloveRegisters(syntheticHand({ curls: [1, 1, 1, 1, 1] }));
	assert.deepEqual(open.slice(GLOVE_REG.flex, GLOVE_REG.flex + 5), [0, 0, 0, 0, 0]);
	assert.deepEqual(fist.slice(GLOVE_REG.flex, GLOVE_REG.flex + 5), [ONE, ONE, ONE, ONE, ONE]);
	assert.ok(fist[GLOVE_REG.pinch]! < open[GLOVE_REG.pinch]!);
	assert.ok(gloveRegisters(null).every((v) => v === 0), "no hand, all zero");
});

test("glove: IOTs latch a frame and read it a register at a time", () => {
	const g = new DataGlove();
	assert.deepEqual(g.iot(iot(0o01)), { ac: 0, skip: false }, "GSF: nothing yet");
	g.feed(syntheticHand({ curls: [0, 0, 0, 0, 0], heading: 40 }));
	assert.equal(g.iot(iot(0o01)).skip, true, "GSF: a frame waits");
	assert.equal(g.iot(iot(0o21)).skip, false, "GSH: nothing latched yet");
	g.iot(iot(0o04));
	assert.equal(g.iot(iot(0o01)).skip, false, "GLT clears the flag");
	assert.equal(g.iot(iot(0o21)).skip, true);
	assert.equal(g.iot(iot(0o02)).ac, 3, "GRS: a right hand");
	const r = g.registers();
	g.iot(iot(0o24, GLOVE_REG.bones));
	for (let i = 0; i < 6; i += 1) assert.equal(g.iot(iot(0o22)).ac, r[GLOVE_REG.bones + i]! & 0o777777, "GRD steps the index");
	assert.ok(r.slice(GLOVE_REG.bones).some((v) => v < 0), "something negative, read as 18-bit two's complement");
	g.iot(iot(0o64, 1));
	assert.equal(g.irq(), false);
	g.feed(null);
	assert.equal(g.irq(), true, "GIE: a new frame interrupts");
	g.iot(iot(0o44));
	assert.equal(g.irq(), false, "GCF");
});

// --- The Forth side: turtle3d.fs and glove.fs on Mitch's kernel ---

const tape = (f: string) => readFileSync(new URL(`../tapes/pdp7forth/${f}`, import.meta.url), "utf8");
let image: ForthImage | null = null;
function gloveImage(): ForthImage {
	image ??= compileForth({
		kernel: assembleForthKernel({
			sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
			kernel: tape("kernel-names-full.s"),
			end: tape("end.s"),
			kernelName: "kernel-names-full.s",
		}),
		sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "tags.fs", "turtle3d.fs", "glove.fs"].map(tape),
	});
	return image;
}

function forthMachine(glove: DataGlove) {
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	let last: Segment[] = [];
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		onFrame: (f) => {
			const lit = f.segments.filter((s) => s.intensify);
			if (lit.length > 0) last = lit;
		},
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const box = new Cabinet({ cpu, devices: [t340, tty, glove] });
	t340.clock = () => box.cycles;
	bootForth(cpu, gloveImage());
	box.run(300_000);
	const type = (text: string) => {
		for (const ch of text) tty.type((ch === "\n" ? 0o15 : ch.toUpperCase().charCodeAt(0)) | 0o200);
	};
	const line = (text: string): string => {
		const from = paper.length;
		type(`${text}\n`);
		for (let n = 0; n < 400 && !/ok\r\n$/.test(paper.slice(from)); n += 1) box.run(50_000);
		return paper.slice(from);
	};
	return { box, line, type, frame: () => last, paper: () => paper };
}

const nums = (s: string) => (s.match(/-?\d+/g) ?? []).map(Number);

test("forth: the 3D turtle turns about its own axes", () => {
	const m = forthMachine(new DataGlove());
	assert.match(m.line("HOME3 AT3 . ."), / 512 512\s+ok/);
	assert.match(m.line("100 FWD AT3 . ."), / 612 512\s+ok/, "heading up");
	assert.match(m.line("90 YAW 100 FWD AT3 . ."), / 612 612\s+ok/, "yaw right");
	assert.match(m.line("90 PITCH 100 FWD AT3 . ."), / 612 612\s+ok/, "pitched toward the viewer: no move on the screen");
	assert.match(m.line("T3 2 + @ 16 / ."), / 100\s+ok/, "but 100 nearer");
	assert.match(m.line("90 VIEW AT3 . . 0 VIEW"), /\s+ok/);
	assert.match(m.line("HOME3 90 ROLL 90 PITCH 100 FWD AT3 . ."), / 512 612\s+ok/, "rolled right, pitched up: to the right");
});

test("forth: GLOVE's turtle lands every finger where the camera saw it", () => {
	const glove = new DataGlove();
	const m = forthMachine(glove);
	for (const [k, g] of [GESTURES[0]!, GESTURES[2]!, GESTURES[4]!].entries()) {
		const f = syntheticHand({ curls: g.curls, heading: -15 + 15 * k, size: 0.28, y: 0.8 });
		glove.feed(f);
		const want = f.points.map((p) => toScreen(p));
		m.line("GLOVE-LATCH 1 VNUM ! 1 VDEN ! 0 VOX ! 0 VOY ! 0 SPIN ! NEW-FRAME HAND");
		for (const i of [0, 4, 8, 12, 16, 20]) {
			const out = m.line(`${i} SPOT . .`);
			const [y = NaN, x = NaN] = nums(out.slice(out.indexOf(". .") + 3));
			const w = want[i]!;
			assert.ok(Math.hypot(x - w[0], y - w[1]) <= 5, `${g.name} landmark ${i}: ${x},${y} vs ${w}`);
		}
	}
});

test("forth: BIRD? knows the bird, and only the bird", () => {
	const glove = new DataGlove();
	const m = forthMachine(glove);
	for (const g of GESTURES) {
		glove.feed(syntheticHand({ curls: g.curls }));
		const out = m.line("GLOVE-LATCH BIRD? .");
		const [flag = NaN] = nums(out.slice(out.indexOf("BIRD? .") + 7));
		assert.equal(flag !== 0, g.name === "bird", `${g.name}: ${flag}`);
	}
	assert.ok(GESTURES.some((g) => g.name === "bird"), "the demo hand gives it");
});

test("forth: FIT keeps a hand on the screen, however big or off the edge the camera has it", () => {
	const glove = new DataGlove();
	const m = forthMachine(glove);
	for (const o of [{ size: 0.9, x: 0.3, y: 0.95 }, { size: 0.15, x: 0.8, y: 0.5 }, { size: 0.6, x: -0.05, y: 1.0 }]) {
		glove.feed({ ...syntheticHand({ curls: [0, 0, 0, 0, 0], ...o }), aspect: 4 / 3 });
		m.line("GLOVE-LATCH 0 SPIN ! NEW-FRAME FIT HAND");
		const at = [0, 4, 8, 12, 16, 20].map((i) => {
			const out = m.line(`${i} SPOT . .`);
			const [y = NaN, x = NaN] = nums(out.slice(out.indexOf(". .") + 3));
			return [x, y] as const;
		});
		for (const [x, y] of at) assert.ok(x > 100 && x < 924 && y > 220 && y < 920, `${JSON.stringify(o)}: ${x},${y}`);
		const ys = at.map((p) => p[1]!);
		assert.ok(Math.max(...ys) - Math.min(...ys) > 250, `${JSON.stringify(o)}: big enough to see`);
	}
});

test("forth: GLOVE draws the waving hand and its flex meters until a key", () => {
	const glove = new DataGlove({ source: wavingHand, framePeriod: 200_000 });
	const m = forthMachine(glove);
	m.type("GLOVE\n");
	m.box.run(6_000_000);
	const segs = m.frame();
	assert.ok(glove.latches >= 2, `frames latched: ${glove.latches}`);
	assert.ok(segs.length > 30, `segments: ${segs.length}`);
	assert.ok(segs.some((s) => s.y0 > 300 && s.y1 > 300), "a hand above the meters");
	assert.ok(segs.some((s) => s.y0 < 210 && s.x0 === s.x1), "meter levels");
	assert.match(m.line(""), /ok/, "a key stops it");
});

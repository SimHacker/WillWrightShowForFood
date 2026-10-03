import assert from "node:assert/strict";
import test from "node:test";

import { clampCorner, cornerAt, cornerLimits, decodeVector, encodeVector, moveCorner } from "./edit340.js";
import { Type340 } from "./plugins/type340.js";

const BASE = 0o100;

// DEC bit order, as graftal.ts builds display words.
const BIT = (n: number) => 1 << (17 - n);
const FIELD = (v: number, a: number, b: number) => (v & ((1 << (b - a + 1)) - 1)) << (17 - b);
const PARAM_TO_POINT = FIELD(1, 2, 4) | BIT(11) | BIT(14) | FIELD(5, 15, 17);
const pointY = (v: number) => FIELD(1, 2, 4) | BIT(1) | FIELD(v, 8, 17);
const pointXThenVector = (v: number) => FIELD(4, 2, 4) | FIELD(v, 8, 17);
const STOP = FIELD(1, 2, 4) | BIT(7);

/** Beam to (200, 300), then the given vector words, then a stop. */
function frame(mem: number[], words: number[]) {
	mem.fill(0);
	const file = [PARAM_TO_POINT, pointY(300), pointXThenVector(200), ...words, STOP];
	file.forEach((w, i) => (mem[BASE + i] = w));
	return () => {
		// A fresh 340 each refresh, so lastFrame can't be the frame before the edit.
		const t = new Type340({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w) });
		t.iot({ device: 0o06, pulse: 0o06, ac: BASE });
		for (let i = 0; i < 64; i += 1) t.tick();
		return (t.lastFrame?.segments ?? t.segments).filter((s) => s.intensify);
	};
}

test("edit340: vector words decode and encode as the 340 and turtle.fs read them", () => {
	for (const v of [
		{ dx: 127, dy: 0, bright: true, escape: false },
		{ dx: -5, dy: 100, bright: false, escape: true },
		{ dx: 0, dy: -127, bright: true, escape: true },
	])
		assert.deepEqual(decodeVector(encodeVector(v)), v);
	assert.equal(encodeVector({ dx: 127, dy: 0, bright: true, escape: false }), 0o200177, "SYMELEC's own word");
	assert.throws(() => encodeVector({ dx: 128, dy: 0, bright: true, escape: false }));
});

test("edit340: dragging a corner moves it and leaves the rest of the picture put", () => {
	const mem = new Array<number>(1024).fill(0);
	const run = frame(mem, [
		encodeVector({ dx: 100, dy: 0, bright: true, escape: false }),
		encodeVector({ dx: 0, dy: 100, bright: true, escape: false }),
		encodeVector({ dx: -50, dy: 0, bright: true, escape: true }),
	]);
	const before = run();
	assert.deepEqual(before.map((s) => [s.x1, s.y1]), [[300, 300], [300, 400], [250, 400]]);

	const c = cornerAt(before, 302, 299, 8);
	assert.ok(c && c.outOf, "the corner between the first two strokes");
	assert.equal(moveCorner((a) => mem[a] ?? 0, c, 340, 260), null, "the next stroke would need dy 140");
	const pokes = moveCorner((a) => mem[a] ?? 0, c, 320, 330);
	assert.ok(pokes);
	for (const [a, w] of pokes) mem[a] = w;

	const after = run();
	assert.deepEqual(after.map((s) => [s.x0, s.y0, s.x1, s.y1]), [
		[200, 300, 320, 330],
		[320, 330, 300, 400],
		[300, 400, 250, 400],
	]);
	assert.equal(decodeVector(mem[BASE + 4]!).bright, true, "brightness kept");
	assert.equal(decodeVector(mem[BASE + 5]!).escape, true, "escape kept on the last word");
});

test("edit340: a drag past the limit stops at the edge of what both words can hold", () => {
	const mem = new Array<number>(1024).fill(0);
	const run = frame(mem, [
		encodeVector({ dx: 100, dy: 0, bright: true, escape: false }),
		encodeVector({ dx: 0, dy: 100, bright: true, escape: true }),
	]);
	const c = cornerAt(run(), 300, 300, 4)!;
	const box = cornerLimits((a) => mem[a] ?? 0, c)!;
	// Right: the incoming dx 100 grows only 27. Left: the outgoing dx 0 grows only 127. Down: the outgoing dy 100 only 27.
	assert.deepEqual(box, { x0: 300 - 127, y0: 300 - 27, x1: 300 + 27, y1: 300 + 127 });
	const to = clampCorner(c, box, 900, 100);
	assert.deepEqual(to, { x: 327, y: 273 });
	for (const [a, w] of moveCorner((a) => mem[a] ?? 0, c, to.x, to.y)!) mem[a] = w;
	assert.deepEqual(run().map((s) => [s.x1, s.y1]), [[327, 273], [300, 400]]);
});

test("edit340: refuses a move a vector word cannot hold", () => {
	const mem = new Array<number>(1024).fill(0);
	const run = frame(mem, [encodeVector({ dx: 120, dy: 0, bright: true, escape: true })]);
	const c = cornerAt(run(), 320, 300, 4);
	assert.ok(c);
	assert.equal(c.outOf, null, "the last stroke has no stroke after it");
	assert.equal(moveCorner((a) => mem[a] ?? 0, c, 330, 300), null, "130 does not fit in 7 bits");
	assert.ok(moveCorner((a) => mem[a] ?? 0, c, 320, 420));
});

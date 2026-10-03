import assert from "node:assert/strict";
import test from "node:test";

import { cornerAt, encodeVector, moveCorner } from "./edit340.js";
import { preview340 } from "./preview340.js";

const BIT = (n: number) => 1 << (17 - n);
const FIELD = (v: number, a: number, b: number) => (v & ((1 << (b - a + 1)) - 1)) << (17 - b);
const BASE = 0o100;

test("preview340: an edit shows on the next preview with the CPU stopped and the real 340 untouched", () => {
	const mem = new Array<number>(1024).fill(0);
	const file = [
		FIELD(1, 2, 4) | BIT(11) | BIT(14) | FIELD(5, 15, 17),
		FIELD(1, 2, 4) | BIT(1) | FIELD(300, 8, 17),
		FIELD(4, 2, 4) | FIELD(200, 8, 17),
		encodeVector({ dx: 100, dy: 0, bright: true, escape: false }),
		encodeVector({ dx: 0, dy: 100, bright: true, escape: true }),
		// Back to the start without a stop code, as a refresh loop does.
		FIELD(4, 2, 4) | FIELD(BASE, 5, 17),
	];
	file.forEach((w, i) => (mem[BASE + i] = w));
	const read = (a: number) => mem[a] ?? 0;
	const lit = () => preview340(read, BASE).filter((s) => s.intensify).map((s) => [s.x0, s.y0, s.x1, s.y1]);
	assert.deepEqual(lit(), [[200, 300, 300, 300], [300, 300, 300, 400]]);

	const c = cornerAt(preview340(read, BASE), 300, 300, 4);
	assert.ok(c);
	for (const [a, w] of moveCorner(read, c, 290, 320)!) mem[a] = w;
	assert.deepEqual(lit(), [[200, 300, 290, 320], [290, 320, 300, 400]], "one picture, not an endless loop");
});

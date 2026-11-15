import assert from "node:assert/strict";
import { test } from "node:test";
import { LightPen } from "../plugins/lightpen.js";
import { type Segment, Type340 } from "../plugins/type340.js";
import { KorzType340 } from "./type340.js";

/**
 * `KorzType340` against `Type340`'s switch on random display files: each 340 on its own copy of the
 * same random core, with a light pen wandering over the screen. Whenever the display stops, on a
 * stop code, an edge or a pen hit, both get the same IDRS or IDLA. Registers and the newest
 * segment must match after every cycle, and core (which DDS writes) at the end.
 */

function rng(seed: number): () => number {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return (t ^ (t >>> 14)) >>> 0;
	};
}

const WORDS = 0o20000;

type Side = { t: Type340; core: Int32Array; segs: Segment[] };

function side(make: (o: ConstructorParameters<typeof Type340>[0]) => Type340, core: Int32Array, pen: LightPen): Side {
	const segs: Segment[] = [];
	const mem = Int32Array.from(core);
	const t = make({
		fetch: (a) => mem[a & (WORDS - 1)]!,
		store: (a, w) => {
			mem[a & (WORDS - 1)] = w;
		},
		pens: [pen],
		onSegment: (s) => segs.push(s),
	});
	return { t, core: mem, segs };
}

const regs = (t: Type340): string =>
	[t.dac, t.status, t.x, t.y, t.mode, t.lpEna, t.scale, t.intensity, t.shift, t.asr, t.saveFF, t.tag, t.penX, t.penY, t.enabled, t.frame].join(" ");

for (const korz of ["interpret", "resolve"] as const) {
	test(`korz 340, ${korz}: random display files match Type340 cycle for cycle`, () => {
		let cycles = 0;
		let words = 0;
		for (let seed = 1; seed <= 200; seed += 1) {
			const r = rng(seed);
			const core = new Int32Array(WORDS);
			for (let i = 0; i < WORDS; i += 1) core[i] = r() & 0o777777;
			const pen = new LightPen({ aperture: 1 + (r() % 40), name: "fuzz", enabled: true });
			const a = side((o) => new Type340(o), core, pen);
			const b = side((o) => new KorzType340({ ...o, korz }), core, pen);
			const iot = (device: number, pulse: number, ac: number): void => {
				a.t.iot({ device, pulse, ac });
				b.t.iot({ device, pulse, ac });
			};
			iot(0o06, 0o04, r() & 0o17777);
			for (let n = 0; n < 3000; n += 1) {
				if (n % 50 === 0) {
					pen.x = r() % 1024;
					pen.y = r() % 1024;
				}
				a.t.tick(1);
				b.t.tick(1);
				cycles += 1;
				assert.equal(regs(b.t), regs(a.t), `seed ${seed} cycle ${n}`);
				assert.equal(b.segs.length, a.segs.length, `seed ${seed} cycle ${n}: segments`);
				if (a.segs.length) assert.deepEqual(b.segs.at(-1), a.segs.at(-1), `seed ${seed} cycle ${n}: last segment`);
				if (a.t.status !== 0) {
					words += 1;
					if (r() & 1) iot(0o05, 0o04, 0);
					else iot(0o06, 0o04, r() & 0o17777);
				}
			}
			assert.deepEqual(b.core, a.core, `seed ${seed}: core`);
			assert.deepEqual(b.segs, a.segs, `seed ${seed}: every segment`);
		}
		assert.ok(cycles === 600_000 && words > 1000, `${cycles} cycles, ${words} restarts`);
	});
}

test("korz 340: every word in every mode has exactly one slot, and why names it", () => {
	const t = new KorzType340({ fetch: () => 0, store: () => {} });
	const resolved = t.sea.resolve("word");
	assert.ok(resolved);
	assert.equal(resolved.size, 32);
	assert.deepEqual(resolved.dims, ["mode", "top"]);
	const ran = (word: number, mode: number) => t.why(word, mode as never).find((l) => l.order === 0)?.slot;
	assert.equal(ran(0o600000, 7), "347 DJS: jump and save");
	assert.equal(ran(0o400000, 4), "340 vector, escape after");
	assert.equal(ran(0o200000, 4), "340 vector");
	assert.equal(ran(0o200000, 1), "340 point: load Y");
	assert.equal(ran(0o000000, 7), "cabinet DTG: tag what follows (not DEC's)");
});

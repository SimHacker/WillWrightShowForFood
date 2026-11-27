import { strict as assert } from "node:assert";
import { test } from "node:test";
import { exactFloat, listening } from "./float.js";
import { Ka10Halves } from "./halves.js";
import { Ka10 } from "./ka10.js";

const OPS = [0o130, 0o131, 0o132, ...Array.from({ length: 0o40 }, (_, i) => 0o140 + i)];
const FMASK = 0o777777777777n;

function rng(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const EDGES = [0n, 0o400000000000n, 0o377777777777n, 0o400000000001n, 0o201400000000n, 0o576400000000n, 0o000400000000n, 0o777400000000n, 0o377400000000n, 0o001777777777n, 0o000000000001n, 0o777777777777n, 0o200777777777n, 0o577000000001n];

/** Normalized, unnormalized, random and edge words, both signs. */
function word(r: () => number): bigint {
	const k = r();
	if (k < 0.15) return EDGES[Math.floor(r() * EDGES.length)]!;
	if (k < 0.3) return BigInt(Math.floor(r() * 2 ** 18)) * 2n ** 18n + BigInt(Math.floor(r() * 2 ** 18));
	const exp = BigInt(k < 0.5 ? Math.floor(r() * 256) : 0o200 + Math.floor(r() * 16) - 8);
	let mant = BigInt(Math.floor(r() * 2 ** 26)) | (k < 0.9 ? 1n << 26n : 0n);
	if (r() < 0.2) mant &= ~((1n << BigInt(Math.floor(r() * 26))) - 1n);
	const pos = (exp << 27n) | mant;
	return r() < 0.5 ? pos : (FMASK + 1n - pos) & FMASK;
}

function machines(): [Ka10, Ka10Halves] {
	const a = new Ka10({ memWords: 256 * 1024, its: false, mpx: false });
	const b = new Ka10Halves({ memWords: 256 * 1024, its: false, mpx: false });
	a.reset();
	b.reset();
	return [a, b];
}

test("the exact float unit agrees with the SIMH port on every floating instruction and mode", () => {
	const [a, b] = machines();
	const r = rng(Number(process.env.KA10_FLOAT_SEED ?? 1966));
	const cases = Number(process.env.KA10_FLOAT_CASES ?? 60000);
	const seen = new Set<string>();
	for (let n = 0; n < cases; n++) {
		const op = OPS[Math.floor(r() * OPS.length)]!;
		const immediate = (op & 7) === 5 && op >= 0o140;
		const y = immediate || op === 0o132 ? Math.floor(r() * 2 ** 18) : 0o2000;
		const inst = (BigInt(op) << 27n) | (1n << 23n) | BigInt(y);
		const ac = word(r);
		const ac1 = word(r);
		const mem = word(r);
		for (const cpu of [a, b]) {
			cpu.deposit(0o1000, inst);
			cpu.deposit(1, ac);
			cpu.deposit(2, ac1);
			cpu.deposit(0o2000, mem);
			cpu.FLAGS = 0;
			cpu.PC = 0o1000;
			cpu.step(1);
		}
		const got = (cpu: Ka10 | Ka10Halves) => [cpu.examine(1), cpu.examine(2), cpu.examine(0o2000), cpu.FLAGS, cpu.PC];
		const ga = got(a);
		const gb = got(b);
		const what = `${op.toString(8)} AC=${ac.toString(8)} AC+1=${ac1.toString(8)} E=${(immediate || op === 0o132 ? BigInt(y) : mem).toString(8)}`;
		assert.deepEqual(gb, ga, what);
		seen.add(op.toString(8));
	}
	assert.equal(seen.size, OPS.length);
});

test("FADR, FMPR and FDVR give the familiar answers", () => {
	const [, b] = machines();
	const run = (op: number, x: bigint, y: bigint): bigint => {
		b.deposit(0o1000, (BigInt(op) << 27n) | (1n << 23n) | 0o2000n);
		b.deposit(1, x);
		b.deposit(0o2000, y);
		b.PC = 0o1000;
		b.step(1);
		return b.examine(1);
	};
	const ONE = 0o201400000000n;
	const TWO = 0o202400000000n;
	const THREE = 0o202600000000n;
	assert.equal(run(0o144, ONE, ONE), TWO);
	assert.equal(run(0o164, TWO, THREE), 0o203600000000n);
	assert.equal(run(0o174, THREE, TWO), 0o201600000000n);
});

test("a listening unit hears every floating instruction without changing it", () => {
	const heard: string[] = [];
	const b = new Ka10Halves({ memWords: 64 * 1024, its: false, mpx: false, float: listening(exactFloat, (op, _ir, ac, e, result) => heard.push(`${op} ${ac.toString(8)} ${e.toString(8)} ${result.toString(8)}`)) });
	b.reset();
	b.deposit(0o1000, (0o144n << 27n) | (1n << 23n) | 0o2000n);
	b.deposit(1, 0o201400000000n);
	b.deposit(0o2000, 0o201400000000n);
	b.PC = 0o1000;
	b.step(1);
	assert.equal(b.examine(1), 0o202400000000n);
	assert.deepEqual(heard, ["fad 201400000000 201400000000 202400000000"]);
});

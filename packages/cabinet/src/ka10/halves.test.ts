import { strict as assert } from "node:assert";
import { test } from "node:test";
import { Ka10Halves } from "./halves.js";
import { Ka10 } from "./ka10.js";

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

const EDGES = [0n, 1n, 2n, 0o400000000000n, 0o377777777777n, 0o777777777777n, 0o400000000001n, 0o777777n, 0o1000000n, 0o777777000000n, 0o200000000000n];

function word(r: () => number): bigint {
	const k = r();
	if (k < 0.2) return EDGES[Math.floor(r() * EDGES.length)]!;
	const bits = BigInt(1 + Math.floor(r() * 36));
	const v = (BigInt(Math.floor(r() * 2 ** 18)) * 2n ** 18n + BigInt(Math.floor(r() * 2 ** 18))) & ((1n << bits) - 1n);
	return r() < 0.4 ? (FMASK + 1n - v) & FMASK : v;
}

/** An effective address for immediate modes and shift counts: small counts both ways, and anything. */
function address(r: () => number): number {
	const k = r();
	if (k < 0.4) return Math.floor(r() * 80);
	if (k < 0.8) return (0o1000000 - Math.floor(r() * 80)) & 0o777777;
	return Math.floor(r() * 2 ** 18);
}

/** Random instructions from `ops` in every mode on the SIMH port and the halves switch. */
function firstDisagreement(ops: number[], cases: number, seed: number): string | undefined {
	const a = new Ka10({ memWords: 256 * 1024, its: true, mpx: false });
	const b = new Ka10Halves({ memWords: 256 * 1024, its: true, mpx: false });
	a.reset();
	b.reset();
	const r = rng(seed);
	for (let n = 0; n < cases; n++) {
		const op = ops[Math.floor(r() * ops.length)]!;
		const pick = r() < 0.5 ? 0o2000 : address(r);
		// Never the instruction's own word: a random word there can be an endless indirect chain.
		const y = pick === 0o1000 ? 0o2000 : pick;
		const inst = (BigInt(op) << 27n) | (1n << 23n) | BigInt(y);
		const ac = word(r);
		const ac1 = word(r);
		const mem = word(r);
		for (const cpu of [a, b]) {
			cpu.deposit(0o1000, inst);
			cpu.deposit(1, ac);
			cpu.deposit(2, ac1);
			cpu.deposit(y < 0o20 ? 0o2000 : y, mem);
			cpu.FLAGS = 0;
			cpu.PC = 0o1000;
			cpu.step(1);
		}
		const got = (cpu: Ka10 | Ka10Halves) => `${cpu.examine(1).toString(8)} ${cpu.examine(2).toString(8)} ${cpu.examine(y < 0o20 ? 0o2000 : y).toString(8)} ${cpu.FLAGS.toString(8)} ${cpu.PC.toString(8)}`;
		const ga = got(a);
		const gb = got(b);
		if (ga !== gb) return `${op.toString(8)} 1,${y.toString(8)} AC=${ac.toString(8)} AC+1=${ac1.toString(8)} E=${mem.toString(8)}: SIMH ${ga}, halves ${gb}`;
	}
	return undefined;
}

const range = (lo: number, hi: number): number[] => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const CASES = Number(process.env.KA10_HALVES_CASES ?? 30000);

test("IMUL and MUL agree with the SIMH port in every mode", () => {
	assert.equal(firstDisagreement(range(0o220, 0o227), CASES, 1), undefined);
});

test("IDIV and DIV agree with the SIMH port in every mode", () => {
	assert.equal(firstDisagreement(range(0o230, 0o237), CASES, 2), undefined);
});

test("ROTC, LSHC and ITS's CIRC agree with the SIMH port", () => {
	assert.equal(firstDisagreement([0o245, 0o246, 0o247], CASES, 3), undefined);
});

test("the shifts, ASHC on the coprocessor included, agree with the SIMH port", () => {
	assert.equal(firstDisagreement(range(0o240, 0o247), CASES, 4), undefined);
});

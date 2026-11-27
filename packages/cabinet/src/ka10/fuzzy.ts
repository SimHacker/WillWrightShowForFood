/**
 * A floating unit with numerical error you can dial: any amount, any shape, on any of the
 * floating operations, at any rate, reproducibly from a seed. It wraps another unit, lets it
 * compute, then perturbs the result word before the processor stores it.
 *
 * Two uses. Testing the tests: a test that can't tell `fuzzy(exact, one unit in the last place,
 * one time in a thousand)` from `exact` isn't checking floating point. And asking programs how
 * much they care: run MACSYMA or a MacLisp numeric loop with a fraction a few bits shorter, or
 * with a rounding bias, and see what changes in what it prints.
 *
 * Every perturbation is logged, so a changed answer can be traced to the instructions that
 * were nudged.
 */
import type { FloatCpu, FloatStore, FloatUnit } from "./float.js";

export type FloatOp = keyof Omit<FloatUnit, "name">;

/** The kind of error. */
export type FuzzShape =
	/** Add a random amount from −size to +size to the word: units in the last place. */
	| { kind: "ulp"; size: number }
	/** Always add `size`: a rounding bias, upward if positive. */
	| { kind: "bias"; size: number }
	/** Flip one fraction bit chosen from `low` to `high` (0 is the last place, 26 the first). */
	| { kind: "bits"; low: number; high: number }
	/** Clear the low `bits` bits: a machine with a shorter fraction that truncates. */
	| { kind: "chop"; bits: number }
	/** Move the exponent by a random amount from −size to +size, when the sign survives it. */
	| { kind: "exponent"; size: number };

export type FuzzDial = {
	shape: FuzzShape;
	/** The chance that a result is perturbed, 0 to 1. */
	rate?: number;
	seed?: number;
	/** Which operations to perturb: all of them when absent. */
	ops?: readonly FloatOp[];
	/** Keep this many perturbations in `log`, newest last. */
	keep?: number;
};

export type Perturbation = { op: FloatOp; ir: number; exact: number; fuzzed: number };

export interface FuzzyUnit extends FloatUnit {
	/** The dial, which can be turned while the machine runs. */
	dial: FuzzDial;
	/** Results seen and results changed. */
	readonly results: number;
	readonly perturbed: number;
	readonly log: Perturbation[];
}

const T27 = 134217728;
const T35 = 34359738368;
const T36 = 68719476736;

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

const wrap36 = (x: number): number => ((x % T36) + T36) % T36;
const between = (r: () => number, lo: number, hi: number): number => lo + Math.floor(r() * (hi - lo + 1));

function perturb(w: number, shape: FuzzShape, r: () => number): number {
	switch (shape.kind) {
		case "ulp":
			return wrap36(w + between(r, -shape.size, shape.size));
		case "bias":
			return wrap36(w + shape.size);
		case "bits": {
			const b = between(r, Math.max(0, shape.low), Math.min(26, shape.high));
			const bit = 2 ** b;
			return Math.floor(w / bit) % 2 ? w - bit : w + bit;
		}
		case "chop": {
			const m = 2 ** Math.min(27, Math.max(0, shape.bits));
			return w - (w % m);
		}
		case "exponent": {
			const neg = w >= T35;
			const v = w + (neg ? -1 : 1) * between(r, -shape.size, shape.size) * T27;
			return neg ? (v >= T35 && v < T36 ? v : w) : v >= 0 && v < T35 ? v : w;
		}
	}
}

export function fuzzy(unit: FloatUnit, dial: FuzzDial): FuzzyUnit {
	let r = rng(dial.seed ?? 1);
	let seed = dial.seed;
	const log: Perturbation[] = [];
	const self = {
		name: `${unit.name}+fuzzy`,
		dial,
		results: 0,
		perturbed: 0,
		log,
	} as FuzzyUnit & { results: number; perturbed: number };
	const run =
		(op: FloatOp) =>
		(c: FloatCpu, ab = 0): FloatStore => {
			const d = self.dial;
			if (d.seed !== seed) {
				seed = d.seed;
				r = rng(seed ?? 1);
			}
			const store = op === "fsc" ? unit.fsc(c, ab) : unit[op](c);
			if (store === "none" || c.AR === 0) return store;
			self.results++;
			if ((d.ops && !d.ops.includes(op)) || r() >= (d.rate ?? 1)) return store;
			const exact = c.AR;
			const fuzzed = perturb(exact, d.shape, r);
			if (fuzzed === exact) return store;
			c.AR = fuzzed;
			self.perturbed++;
			log.push({ op, ir: c.IR, exact, fuzzed });
			if (log.length > (d.keep ?? 100)) log.shift();
			return store;
		};
	for (const op of ["fad", "fsb", "fmp", "fdv", "fdvl", "fsc"] as const) (self as unknown as Record<FloatOp, unknown>)[op] = run(op);
	return self;
}

/**
 * A dial from text, for scripts: the shape and its amount first, then options.
 * `ulp=1,rate=0.001`, `chop=8`, `bias=2,ops=fmp+fdv`, `bits=20-26,rate=0.01,seed=7`, `exponent=1,rate=1e-4`.
 */
export function parseDial(text: string): FuzzDial {
	const parts = text.split(",").map((p) => p.split("=") as [string, string | undefined]);
	const [kind, amount = "1"] = parts[0] ?? ["ulp", "1"];
	let shape: FuzzShape;
	switch (kind) {
		case "ulp":
		case "bias":
		case "exponent":
			shape = { kind, size: Number(amount) };
			break;
		case "chop":
			shape = { kind, bits: Number(amount) };
			break;
		case "bits": {
			const [lo, hi = lo] = amount.split("-");
			shape = { kind, low: Number(lo), high: Number(hi) };
			break;
		}
		default:
			throw new Error(`unknown fuzz shape ${kind}: ulp, bias, bits, chop or exponent`);
	}
	const dial: FuzzDial = { shape };
	for (const [k, v = ""] of parts.slice(1)) {
		if (k === "rate") dial.rate = Number(v);
		else if (k === "seed") dial.seed = Number(v);
		else if (k === "keep") dial.keep = Number(v);
		else if (k === "ops") dial.ops = v.split("+") as FloatOp[];
		else throw new Error(`unknown fuzz option ${k}`);
	}
	return dial;
}

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import type { Step } from "../bus.js";
import { Pdp7 } from "../plugins/pdp7.js";
import { parseRbImage } from "../plugins/rb09.js";
import { bootUnixV0 } from "../unixv0.js";
import { span } from "./korz.js";
import { KorzPdp7 } from "./pdp7.js";

/** `Pdp7` is the oracle: the Korz PDP-7 must match it register for register, step for step. */

function rng(seed: number): () => number {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return (t ^ (t >>> 14)) >>> 0;
	};
}

const regs = (c: Pdp7) =>
	[c.pc, c.ac, c.link, c.mq, c.sc, c.ion, c.ionDefer, c.extend, c.halted].map(String).join(" ");

function stepOf(c: Pdp7): Step | string {
	try {
		return c.step();
	} catch (e) {
		return `throws ${(e as Error).message}`;
	}
}

/** The same random core in both. */
function cores(seed: number, korz: "interpret" | "resolve" | "compile"): { a: Pdp7; b: KorzPdp7; r: () => number; coreWords: number } {
	const r = rng(seed);
	const coreWords = seed % 3 === 0 ? 0o100000 : 0o20000;
	const a = new Pdp7({ coreWords });
	const b = new KorzPdp7({ coreWords, korz });
	for (let i = 0; i < coreWords; i += 1) {
		const w = r() & 0o777777;
		a.write(i, w);
		b.write(i, w);
	}
	for (const c of [a, b]) {
		c.pc = seed & 0o17777;
		c.ac = (seed * 0o1234567) & 0o777777;
		c.switches = 0o525252;
	}
	return { a, b, r, coreWords };
}

for (const korz of ["interpret", "resolve", "compile"] as const) {
test(`korz pdp7, ${korz}: random programs, every opcode and IOT, match Pdp7 step for step`, () => {
	let steps = 0;
	for (let seed = 1; seed <= 300; seed += 1) {
		const { a, b, r, coreWords } = cores(seed, korz);
		for (let n = 0; n < 2000; n += 1) {
			const irq = (r() & 7) === 0;
			a.irqLine = b.irqLine = irq;
			const sa = stepOf(a);
			const sb = stepOf(b);
			steps += 1;
			assert.deepEqual(sb, sa, `seed ${seed} step ${n}`);
			assert.equal(regs(b), regs(a), `seed ${seed} step ${n}`);
			if (typeof sa === "string" || a.halted) break;
		}
		for (let i = 0; i < coreWords; i += 1) if (a.read(i) !== b.read(i)) assert.fail(`seed ${seed}: core ${i.toString(8)}`);
	}
	assert.ok(steps > 1000, `${steps} steps`);
});

test(`korz pdp7, ${korz}: UNIX v0 boots in lockstep with Pdp7 to the shell prompt`, () => {
	// A compiled CPU runs batches, not steps, so it is compared at the ends of slices of random length.
	const perStep = korz !== "compile";
	const r = rng(7);
	const platter = gunzipSync(readFileSync(new URL("../../tapes/unixv0/image.fs.gz", import.meta.url)));
	const bootTape = readFileSync(new URL("../../tapes/unixv0/boot.rim", import.meta.url));
	// The oracle ticks every unit every cycle; the Korz side runs on the event-driven backplane.
	const a = bootUnixV0({ image: parseRbImage(platter), bootTape, everyCycle: true });
	const b = bootUnixV0({ image: parseRbImage(platter), bootTape, cpu: (o) => new KorzPdp7({ ...o, korz }) });
	assert.ok(b.cpu instanceof KorzPdp7);
	const logged = (cpu: Pdp7): string[] => {
		const log: string[] = [];
		const step = cpu.step.bind(cpu);
		cpu.step = () => {
			log.push(regs(cpu));
			return step();
		};
		return log;
	};
	const logA = perStep ? logged(a.cpu) : [];
	const logB = perStep ? logged(b.cpu) : [];
	let steps = 0;
	const slice = (n: number): void => {
		for (let left = n; left > 0;) {
			const k = perStep ? left : Math.min(left, 1 + (r() % 3000));
			left -= k;
			a.box.run(k);
			b.box.run(k);
			for (let i = 0; i < logA.length; i += 1) if (logA[i] !== logB[i]) assert.equal(logB[i], logA[i], `step ${steps + i}`);
			assert.equal(logB.length, logA.length);
			assert.equal(b.box.cycles, a.box.cycles);
			assert.equal(regs(b.cpu), regs(a.cpu), `after cycle ${a.box.cycles}`);
			steps += logA.length;
			logA.length = 0;
			logB.length = 0;
		}
	};
	const lockstep = (until: string, max: number): void => {
		for (let n = 0; n < max; n += 1000) {
			slice(1000);
			if (a.paper().endsWith(until)) return;
		}
		assert.fail(`no "${until}" in ${max} steps: ${a.paper()}`);
	};
	const key = (text: string): void => {
		for (const ch of text) {
			a.key(ch);
			b.key(ch);
			for (let n = 0; n < 20_000; n += 1000) slice(1000);
		}
	};
	let fetches = 0;
	const [watch] = b.cpu instanceof KorzPdp7 ? b.cpu.sea.install([{ selector: "read", guard: { access: "fetch", addr: 0o1065 },
		layer: "observe", by: "test: count fetches of 1065", run: (_, next) => { fetches += 1; return next(); } }]) : [];
	lockstep("login: ", 5_000_000);
	assert.ok(fetches > 0, "the watch saw fetches");
	if (b.cpu instanceof KorzPdp7) b.cpu.sea.remove(watch!);
	key("ken\r");
	lockstep("password: ", 5_000_000);
	key("ken\r");
	lockstep("@ ", 10_000_000);
	assert.equal(b.paper(), a.paper());
	for (let i = 0; i < 0o20000; i += 1) if (a.cpu.read(i) !== b.cpu.read(i)) assert.fail(`core ${i.toString(8)}`);
});
}

test("korz pdp7, compile: random programs in batches of random length, with no backplane, match Pdp7", () => {
	let steps = 0;
	let blocks = 0;
	for (let seed = 1; seed <= 300; seed += 1) {
		const { a, b, r, coreWords } = cores(seed, "compile");
		const clock = { cycles: 0, next: Infinity, until: 0 };
		let done = false;
		for (let n = 0; n < 40 && !done; n += 1) {
			const len = 1 + (r() % 300);
			a.irqLine = b.irqLine = (r() & 3) === 0;
			let sa = "";
			let ran = 0;
			for (; ran < len; ran += 1) {
				const s = stepOf(a);
				if (typeof s === "string") {
					sa = s;
					break;
				}
				if (a.halted) {
					ran += 1;
					break;
				}
			}
			let sb = "";
			const from = clock.cycles;
			clock.until = from + len;
			try {
				while (clock.cycles < clock.until) {
					const s = b.runBatch!(clock);
					clock.cycles += 1;
					if (s.halt) break;
				}
			} catch (e) {
				sb = `throws ${(e as Error).message}`;
			}
			assert.equal(sb, sa, `seed ${seed} batch ${n}`);
			if (!sa) assert.equal(clock.cycles - from, ran, `seed ${seed} batch ${n}: instructions run`);
			assert.equal(regs(b), regs(a), `seed ${seed} batch ${n}`);
			steps += ran;
			done = sa !== "" || a.halted;
		}
		for (let i = 0; i < coreWords; i += 1) if (a.read(i) !== b.read(i)) assert.fail(`seed ${seed}: core ${i.toString(8)}`);
		blocks += b.compiler!.built;
	}
	assert.ok(steps > 1000, `${steps} steps`);
	assert.ok(blocks > 1000, `${blocks} blocks`);
});

test("korz pdp7, compile: watches on data and a patch on an opcode see what they see resolved", () => {
	let seen = 0;
	for (let seed = 1; seed <= 120; seed += 1) {
		const { b: resolved } = cores(seed, "resolve");
		const { b: compiled, r } = cores(seed, "compile");
		const counts = [resolved, compiled].map((m) => {
			const n = { reads: 0, writes: 0, laws: 0 };
			m.sea.install([
				{ selector: "read", guard: { addr: span(0, 0o1000), access: "read" }, layer: "observe", by: "test: reads of 0-777",
					run: (_, next) => { n.reads += 1; return next(); } },
				{ selector: "write", guard: { addr: span(0, 0o1000) }, layer: "observe", by: "test: writes to 0-777",
					run: (_, next) => { n.writes += 1; return next(); } },
				{ selector: "exec", guard: { op: 0o17, ind: 1 }, layer: "patch", by: "test: count LAW",
					run: (_, next) => { n.laws += 1; return next(); } },
			]);
			return n;
		});
		const clock = { cycles: 0, next: Infinity, until: 0 };
		for (let n = 0; n < 20; n += 1) {
			const len = 1 + (r() % 200);
			let sa = "";
			let ran = 0;
			for (; ran < len && !resolved.halted; ran += 1) {
				const s = stepOf(resolved);
				if (typeof s === "string") {
					sa = s;
					break;
				}
			}
			let sb = "";
			clock.until = clock.cycles + ran + (sa ? 1 : 0);
			try {
				while (clock.cycles < clock.until) {
					const s = compiled.runBatch!(clock);
					clock.cycles += 1;
					if (s.halt) break;
				}
			} catch (e) {
				sb = `throws ${(e as Error).message}`;
			}
			assert.equal(sb, sa, `seed ${seed} batch ${n}`);
			assert.equal(regs(compiled), regs(resolved), `seed ${seed} batch ${n}`);
			assert.deepEqual(counts[1], counts[0], `seed ${seed} batch ${n}`);
			if (sa || resolved.halted) break;
		}
		seen += counts[0]!.reads + counts[0]!.writes + counts[0]!.laws;
	}
	assert.ok(seen > 1000, `${seen} accesses watched`);
});

/** Load `words` (address: word, octal) into a `Pdp7` and a compiled `KorzPdp7`, run both to HLT, and compare. */
function handRun(name: string, coreWords: number, words: Record<number, number>, watch: boolean): void {
	const a = new Pdp7({ coreWords });
	const b = new KorzPdp7({ coreWords, korz: "compile" });
	let writes = 0;
	if (watch) b.sea.install([{ selector: "write", guard: { addr: span(0o100, 0o200) }, layer: "observe", by: "test: writes to 100-177",
		run: (_, next) => { writes += 1; return next(); } }]);
	for (const [at, w] of Object.entries(words)) {
		a.write(Number(at), w);
		b.write(Number(at), w);
	}
	a.pc = b.pc = 0o100;
	let n = 0;
	while (!a.halted && n < 100_000) {
		a.step();
		n += 1;
	}
	assert.ok(a.halted, `${name}: Pdp7 halts`);
	const clock = { cycles: 0, next: Infinity, until: 0 };
	for (let len = 1; !b.halted && clock.cycles < n; len = (len * 3) % 97 + 1) {
		clock.until = Math.min(clock.cycles + len, n);
		while (clock.cycles < clock.until) {
			const s = b.runBatch!(clock);
			clock.cycles += 1;
			if (s.halt) break;
		}
	}
	assert.equal(clock.cycles, n, `${name}: instructions`);
	assert.equal(regs(b), regs(a), name);
	for (let i = 0o100; i < 0o200; i += 1) assert.equal(b.read(i), a.read(i), `${name}: word ${i.toString(8)}`);
	if (watch) assert.ok(writes > 1000, `${name}: ${writes} writes watched`);
}

test("korz pdp7, compile: a loop that rewrites the instruction it runs next", () => {
	const loop = (store: number) => ({
		0o100: 0o200120, // LAC 120
		0o101: 0o300121, // ADD 121
		0o102: 0o040120, // DAC 120
		0o103: store, // DAC 104, or DAC I 124
		0o104: 0o760000, // LAW 0, replaced every time around
		0o105: 0o340123, // TAD 123
		0o106: 0o040123, // DAC 123
		0o107: 0o440122, // ISZ 122
		0o110: 0o600100, // JMP 100
		0o111: 0o740040, // HLT
		0o120: 0o760000,
		0o121: 0o000001,
		0o122: 0o776000,
		0o123: 0,
		0o124: 0o000104,
	});
	for (const watch of [false, true]) {
		handRun(`DAC 104, watch ${watch}`, 0o20000, loop(0o040104), watch);
		handRun(`DAC I 124, watch ${watch}`, 0o20000, loop(0o060124), watch);
	}
});

test("korz pdp7, compile: EMIR leaves extend mode at the next indirect JMP unless the pointer keeps it", () => {
	for (const pointer of [0o000200, 0o200200]) {
		handRun(`EMIR, JMP I to ${pointer.toString(8)}`, 0o100000, {
			0o100: 0o707742, // EMIR
			0o101: 0o620120, // JMP I 120
			0o120: pointer,
			0o200: 0o707701, // SEM: skip if extend mode
			0o201: 0o740040, // HLT
			0o202: 0o750001, // CLA CMA
			0o203: 0o740040, // HLT
		}, false);
	}
});

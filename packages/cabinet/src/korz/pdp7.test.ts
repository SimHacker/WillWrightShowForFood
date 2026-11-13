import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import type { Step } from "../bus.js";
import { Pdp7 } from "../plugins/pdp7.js";
import { parseRbImage } from "../plugins/rb09.js";
import { bootUnixV0 } from "../unixv0.js";
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

test("korz pdp7: random programs, every opcode and IOT, match Pdp7 step for step", () => {
	let steps = 0;
	for (let seed = 1; seed <= 300; seed += 1) {
		const r = rng(seed);
		const coreWords = seed % 3 === 0 ? 0o100000 : 0o20000;
		const a = new Pdp7({ coreWords });
		const b = new KorzPdp7({ coreWords });
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

test("korz pdp7: UNIX v0 boots in lockstep with Pdp7 to the shell prompt", () => {
	const platter = gunzipSync(readFileSync(new URL("../../tapes/unixv0/image.fs.gz", import.meta.url)));
	const bootTape = readFileSync(new URL("../../tapes/unixv0/boot.rim", import.meta.url));
	const a = bootUnixV0({ image: parseRbImage(platter), bootTape });
	const b = bootUnixV0({ image: parseRbImage(platter), bootTape, cpu: (o) => new KorzPdp7(o) });
	assert.ok(b.cpu instanceof KorzPdp7);
	const lockstep = (until: string, max: number): number => {
		for (let n = 0; n < max; n += 1) {
			a.box.step();
			b.box.step();
			if (regs(a.cpu) !== regs(b.cpu)) assert.equal(regs(b.cpu), regs(a.cpu), `step ${n}`);
			if (n % 1000 === 0 && a.paper().endsWith(until)) return n;
		}
		return assert.fail(`no "${until}" in ${max} steps: ${a.paper()}`);
	};
	const key = (text: string): void => {
		for (const ch of text) {
			a.key(ch);
			b.key(ch);
			for (let n = 0; n < 20_000; n += 1) {
				a.box.step();
				b.box.step();
			}
			assert.equal(regs(b.cpu), regs(a.cpu));
		}
	};
	lockstep("login: ", 5_000_000);
	key("ken\r");
	lockstep("password: ", 5_000_000);
	key("ken\r");
	lockstep("@ ", 10_000_000);
	assert.equal(b.paper(), a.paper());
	for (let i = 0; i < 0o20000; i += 1) if (a.cpu.read(i) !== b.cpu.read(i)) assert.fail(`core ${i.toString(8)}`);
});

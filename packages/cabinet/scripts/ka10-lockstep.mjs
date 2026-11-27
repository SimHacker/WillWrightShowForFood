#!/usr/bin/env node
// Boot ITS on the SIMH port and the halves switch side by side, one instruction at a time,
// and stop at the first instruction where they disagree.
//
//   node scripts/ka10-lockstep.mjs [workdir] [--steps N] [--mem-every N]
//
// Both machines get the same keystrokes at the same instruction: `its`, Return and Altmode G
// once DSKDMP has typed its prompt.
import { openSync, readSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ItsMachine } from "../dist/ka10/its.js";
import { lockstep } from "../dist/ka10/lockstep.js";

const args = process.argv.slice(2);
const flag = (name, dflt) => {
	const i = args.indexOf(name);
	if (i < 0) return dflt;
	const v = args[i + 1];
	args.splice(i, 2);
	return v;
};
const steps = Number(flag("--steps", "40000000"));
const memEvery = Number(flag("--mem-every", "0"));
const dir = args[0] ?? join(homedir(), "GroundUp/git/its/dl/pdp10-ka");

class ReadOnlyPack {
	constructor(path) {
		this.fd = openSync(path, "r");
		this.dirty = new Map();
		this.bytes = Buffer.alloc(1024);
	}
	read(block, into) {
		const kept = this.dirty.get(block);
		if (kept) return void into.set(kept);
		this.bytes.fill(0);
		readSync(this.fd, this.bytes, 0, 1024, block * 1024);
		for (let i = 0; i < 128; i++) into[i] = this.bytes.readBigUInt64LE(i * 8);
	}
	write(block, from) {
		this.dirty.set(block, BigUint64Array.from(from));
	}
}

const machine = (rung) => {
	const m = new ItsMachine({ rung, now: () => new Date(2026, 10, 27, 12, 0, 0) });
	["rp03.2", "rp03.3", "rp03.0", "rp03.1"].forEach((f, i) => m.dp.attach(i, new ReadOnlyPack(join(dir, f))));
	m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
	m.bootPtr();
	return m;
};
const a = machine("simh");
const b = machine("halves");

let typed = 0;
const t0 = performance.now();
const d = lockstep(a.cpu, b.cpu, steps, {
	memEvery,
	between: (n) => {
		if (typed === 0 && a.output.includes("DSKDMP")) {
			a.cty.type("its\r\x1bg");
			b.cty.type("its\r\x1bg");
			typed = 1;
		}
		if (n % 1_000_000 === 0) process.stderr.write(`\r${(n / 1e6).toFixed(0)}M instructions`);
	},
});
process.stderr.write(`\n${((performance.now() - t0) / 1000).toFixed(1)} s\n`);
console.log(a.output.slice(-400));
if (!d) {
	console.log(`agree for ${steps} instructions`);
	process.exit(0);
}
console.log(`diverge at instruction ${d.instruction}: ${d.field} simh=${d.a} halves=${d.b}`);
console.log("simh:");
console.log(d.historyA.slice(-12).join("\n"));
console.log("halves:");
console.log(d.historyB.slice(-12).join("\n"));
process.exit(1);

#!/usr/bin/env node
// Instruction history of the cabinet's KA10 booting DSKDMP, in the columns of SIMH's
// `show cpu history`, for diffing against SIMH's pdp10-ka.
//
//   node scripts/ka10-trace.mjs [workdir] --break PC [--count N] [--hit K] > ours.txt
//
// Runs `boot ptr` with the packs mounted as scripts/ka10-its.mjs mounts them, stops the
// K-th time (default 1) an instruction is fetched from PC (octal), and prints the last N
// instructions. With no --break it stops after --count instructions.
import { openSync, readSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ItsMachine } from "../dist/ka10/devices.js";

const args = process.argv.slice(2);
const flag = (name, dflt) => {
	const i = args.indexOf(name);
	if (i < 0) return dflt;
	const v = args[i + 1];
	args.splice(i, 2);
	return v;
};
const brk = flag("--break", "");
const count = Number(flag("--count", "100000"));
const hits = Number(flag("--hit", "1"));
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

const m = new ItsMachine();
const cpu = m.cpu;
["rp03.2", "rp03.3", "rp03.0", "rp03.1"].forEach((f, i) => m.dp.attach(i, new ReadOnlyPack(join(dir, f))));
m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
cpu.setHistory(count);
m.bootPtr();

if (brk) {
	cpu.breakpoints.add(parseInt(brk, 8));
	let n = 0;
	while (n < hits) {
		const why = cpu.run(1_000_000_000);
		if (why === "halt") throw new Error(`halted at ${cpu.PC.toString(8)}`);
		if (why === "breakpoint") n++;
	}
} else cpu.step(count);

process.stderr.write(`stopped at PC ${cpu.PC.toString(8)} after ${cpu.instructions} instructions, ${cpu.events.now} ticks\n`);
process.stdout.write(cpu.showHistory(count).join("\n") + "\n");

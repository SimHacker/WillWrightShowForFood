#!/usr/bin/env node
// Boot ITS on the cabinet's KA10, the way build/build.tcl boots it on SIMH's pdp10-ka:
// `boot ptr` reads DSKDMP off paper tape, then `its` and Altmode G start the system.
//
//   node scripts/ka10-its.mjs [workdir] [--login NAME] [--history N] [--seconds S]
//
// workdir holds dskdmp.rim and the packs rp03.0 to rp03.3 from the PDP-10/its
// project's prebuilt image (default ~/GroundUp/git/its/dl/work). The packs are
// only read: every block ITS writes stays in memory.
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
const login = flag("--login", "");
const history = Number(flag("--history", "0"));
const seconds = Number(flag("--seconds", "120"));
const dir = args[0] ?? join(homedir(), "GroundUp/git/its/dl/work");

const BLOCK = 128 * 8;
class FilePack {
	constructor(path) {
		this.fd = openSync(path, "r");
		this.dirty = new Map();
		this.bytes = Buffer.alloc(BLOCK);
	}
	read(block, into) {
		const kept = this.dirty.get(block);
		if (kept) {
			into.set(kept);
			return;
		}
		this.bytes.fill(0);
		readSync(this.fd, this.bytes, 0, BLOCK, block * BLOCK);
		for (let i = 0; i < 128; i++) into[i] = this.bytes.readBigUInt64LE(i * 8);
	}
	write(block, from) {
		this.dirty.set(block, BigUint64Array.from(from));
	}
}

const m = new ItsMachine({ print: (ch) => process.stdout.write(String.fromCharCode(ch)) });
const cpu = m.cpu;
if (history) cpu.setHistory(history);
// The unit order of build/build.tcl: the system pack is the third one written.
m.dp.attach(0, new FilePack(join(dir, "rp03.2")));
m.dp.attach(1, new FilePack(join(dir, "rp03.3")));
m.dp.attach(2, new FilePack(join(dir, "rp03.0")));
m.dp.attach(3, new FilePack(join(dir, "rp03.1")));
m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
m.bootPtr();

const t0 = performance.now();
const ticksPerSecond = 1_000_000 * cpu.events.ticksPerUsec;
const deadline = seconds * ticksPerSecond;

/** Run until the console has printed `text` since `from`, or the simulated deadline passes. */
function runUntil(text, from = 0) {
	while (cpu.events.now < deadline) {
		const why = cpu.run(10_000);
		if (m.output.indexOf(text, from) >= 0) return true;
		if (why === "halt") {
			console.error(`\n[halted at PC ${cpu.PC.toString(8)}]`);
			return false;
		}
	}
	console.error(`\n[gave up waiting for ${JSON.stringify(text)}]`);
	return false;
}

function report(what) {
	const s = (performance.now() - t0) / 1000;
	const sim = cpu.events.now / ticksPerSecond;
	console.error(
		`\n[${what}: ${s.toFixed(1)} s wall, ${sim.toFixed(1)} s simulated, ${cpu.instructions} instructions, ${(cpu.instructions / s / 1e6).toFixed(2)} MIPS, disk ${m.dp.reads} reads ${m.dp.writes} writes]`,
	);
}

function dump() {
	if (history) console.error(cpu.showHistory(Math.min(history, 60)).join("\n"));
}

let ok = runUntil("DSKDMP");
report("DSKDMP");
if (ok) {
	let mark = m.output.length;
	m.cty.type("its\r");
	ok = runUntil("\n", mark);
	mark = m.output.length;
	m.cty.type("\x1bg");
	ok = runUntil("IN OPERATION", mark);
	report("ITS");
	if (ok && login) {
		mark = m.output.length;
		m.cty.type("\x1a");
		runUntil("\n", mark);
		const t = cpu.events.now;
		while (cpu.events.now < t + ticksPerSecond) cpu.run(10_000);
		mark = m.output.length;
		m.cty.type(`:login ${login}\r`);
		ok = runUntil("Happy hacking", mark);
		const t2 = cpu.events.now;
		while (cpu.events.now < t2 + 2 * ticksPerSecond) cpu.run(10_000);
		report("login");
	}
}
if (!ok) dump();
process.exit(ok ? 0 : 1);

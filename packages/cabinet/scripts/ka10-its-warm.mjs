#!/usr/bin/env node
// Which parts of the ITS packs a visitor's browser needs first: boot ITS on the halves rung,
// log in, start each program the PDP-10 page offers, and note every pack chunk read. The page
// fetches these chunks in parallel before it boots, then fetches the rest one at a time as ITS
// asks for them (apps/ties/src/lib/its-worker.js).
//
//   node scripts/ka10-its-warm.mjs [workdir]     writes its/warm.json
//
// workdir holds dskdmp.rim and rp03.0 to rp03.3, as for ka10-its.mjs.
import { openSync, readSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ItsMachine } from "../dist/ka10/its.js";

const dir = process.argv[2] ?? join(homedir(), "GroundUp/git/its/dl/pdp10-ka");
const out = join(dirname(fileURLToPath(import.meta.url)), "../its/warm.json");
const BLOCK = 1024;
/** Blocks per fetch: 32 KB, the page's chunk. */
const CHUNK = 32;
/** The unit order of build/build.tcl: the system pack is the third one written. */
const UNITS = ["rp03.2", "rp03.3", "rp03.0", "rp03.1"];
/** After logging in, what each program is started with and what says it has started. */
const SESSIONS = [
	[],
	[[":macsym\r", "(C1)"]],
	[[":lisp\r", "Alloc?"], ["n\r", "*"]],
	[[":clogo\r", "?"]],
];

/** @type {Map<string, Set<number>>} */
const chunks = new Map(UNITS.map((f) => [f, new Set()]));

class FilePack {
	constructor(file) {
		this.fd = openSync(join(dir, file), "r");
		this.seen = chunks.get(file);
		this.dirty = new Map();
		this.bytes = Buffer.alloc(BLOCK);
	}
	read(block, into) {
		const kept = this.dirty.get(block);
		if (kept) return into.set(kept);
		this.seen.add(Math.floor(block / CHUNK));
		this.bytes.fill(0);
		readSync(this.fd, this.bytes, 0, BLOCK, block * BLOCK);
		for (let i = 0; i < 128; i++) into[i] = this.bytes.readBigUInt64LE(i * 8);
	}
	write(block, from) {
		this.dirty.set(block, BigUint64Array.from(from));
	}
}

for (const session of SESSIONS) {
	const m = new ItsMachine({ rung: "halves" });
	const cpu = m.cpu;
	UNITS.forEach((f, u) => m.dp.attach(u, new FilePack(f)));
	m.pt.attach(new Uint8Array(readFileSync(join(dir, "dskdmp.rim"))));
	m.bootPtr();
	const tps = 1_000_000 * cpu.events.ticksPerUsec;
	const until = (text) => {
		const from = m.output.length;
		const end = cpu.events.now + 300 * tps;
		while (cpu.events.now < end) {
			cpu.run(10_000);
			if (m.output.indexOf(text, from) >= 0) return;
		}
		throw new Error(`no ${JSON.stringify(text)}`);
	};
	const send = (keys, text) => {
		const from = m.output.length;
		m.cty.type(keys);
		const end = cpu.events.now + 300 * tps;
		while (cpu.events.now < end) {
			cpu.run(10_000);
			if (m.output.indexOf(text, from) >= 0) return;
		}
		throw new Error(`no ${JSON.stringify(text)} after ${JSON.stringify(keys)}`);
	};
	const idle = (seconds) => {
		const end = cpu.events.now + seconds * tps;
		while (cpu.events.now < end) cpu.run(10_000);
	};
	until("DSKDMP");
	send("its\r", "\n");
	send("\x1bg", "IN OPERATION");
	send("\x1a", "\n");
	idle(1);
	send(":login warm\r", "Happy hacking");
	idle(2);
	for (const [keys, text] of session) send(keys, text);
	idle(2);
}

const warm = { chunk: CHUNK * BLOCK, packs: Object.fromEntries([...chunks].map(([f, s]) => [f, [...s].sort((a, b) => a - b)])) };
writeFileSync(out, `${JSON.stringify(warm)}\n`);
const n = [...chunks.values()].reduce((a, s) => a + s.size, 0);
console.log(`${out}: ${n} chunks, ${((n * CHUNK * BLOCK) / 1e6).toFixed(1)} MB`);

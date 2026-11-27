// The PDP-10 page's KA10, off the page's thread: ITS on the halves rung, booted as
// packages/cabinet/scripts/ka10-its.mjs boots it, or a RIM tape on the bare machine.
//
// A pack is read in 32 KB chunks with HTTP Range requests. The chunks a boot needs (warm.json)
// are fetched first, eight at a time; any other is fetched the moment ITS reads it, with a
// synchronous request, which a worker may make and which the RP10 needs, since it reads a block
// inside an instruction. What ITS writes stays here, in memory.
//
// Speed: `fast` runs flat out, `real` keeps simulated time to wall time, a KA10's own pace,
// and `auto` runs flat out while the console is busy and at real time once it has been quiet
// for QUIET_MS, so an idle ITS does not hold a core.
//
// The bus dance (bus-dance.svelte.js), while the page has it on: where the PC is after each run,
// ITS's or a program's; the cylinders the packs are read and written at; and, from the KA10's
// own counters, the interrupts by level, the system calls by opcode and the share of the
// instructions run in user mode; all since the last DANCE_MS.
//
// In: { type: 'start', ... }, { type: 'keys', text }, { type: 'speed', mode }, { type: 'dance', on },
// { type: 'switches', word }.
// Out: out (text), phase (what it is doing), stats, dance, halt, error. In also: syslog (where
// the system job types its log: tty 0 for the console, -1 for nowhere).
import { ItsMachine, setSystemLog } from '@wwsff/cabinet/ka10';

const BLOCK = 1024;
const QUIET_MS = 3000;
const SLICE_MS = 25;
const STATS_MS = 500;
const DANCE_MS = 100;
/** RP03 blocks per cylinder: 20 surfaces of 10 sectors. */
const CYLINDER = 200;
/** The KA10's user-mode flag (USER in ka10/defs.ts), and what a user PC is keyed above. */
const USER = 0o200;
const USER_KEY = 0o1000000;

/** @typedef {{ keys?: string, wait?: string, prompt?: string, idle?: number, phase?: string }} Step */

class RangePack {
	/** @param {string} url @param {number} chunk bytes per fetch @param {number} unit its drive */
	constructor(url, chunk, unit) {
		this.url = url;
		this.unit = unit;
		this.chunk = chunk;
		this.per = chunk / BLOCK;
		/** @type {Map<number, Uint8Array>} */
		this.chunks = new Map();
		/** @type {Map<number, BigUint64Array>} */
		this.dirty = new Map();
		this.bytes = 0;
	}

	/** @param {number} c */
	range(c) {
		return `bytes=${c * this.chunk}-${(c + 1) * this.chunk - 1}`;
	}

	/** @param {number} c @param {ArrayBuffer} buffer @param {number} status */
	keep(c, buffer, status) {
		if (status !== 206) throw new Error(`${this.url} answered ${status} to a range request`);
		const bytes = new Uint8Array(buffer);
		this.chunks.set(c, bytes);
		this.bytes += bytes.length;
		return bytes;
	}

	/** @param {number} c */
	async prefetch(c) {
		if (this.chunks.has(c)) return;
		const res = await fetch(this.url, { headers: { Range: this.range(c) } });
		this.keep(c, await res.arrayBuffer(), res.status);
	}

	/** @param {number} c */
	fetchNow(c) {
		const x = new XMLHttpRequest();
		x.open('GET', this.url, false);
		x.responseType = 'arraybuffer';
		x.setRequestHeader('Range', this.range(c));
		x.send();
		return this.keep(c, x.response, x.status);
	}

	/** @param {number} block @param {BigUint64Array} into */
	read(block, into) {
		if (dancing) seek(this.unit, block);
		const kept = this.dirty.get(block);
		if (kept) return into.set(kept);
		const c = Math.floor(block / this.per);
		const bytes = this.chunks.get(c) ?? this.fetchNow(c);
		const at = (block % this.per) * BLOCK;
		const view = new DataView(bytes.buffer, bytes.byteOffset);
		for (let i = 0; i < 128; i++) into[i] = at + i * 8 + 8 <= bytes.length ? view.getBigUint64(at + i * 8, true) : 0n;
	}

	/** @param {number} block @param {BigUint64Array} from */
	write(block, from) {
		if (dancing) seek(this.unit, block);
		this.dirty.set(block, BigUint64Array.from(from));
	}
}

let dancing = false;
let lastDance = 0;
/** @type {Map<number, number>} */
const pcs = new Map();
/** @type {Map<number, number>} */
const cylinders = new Map();
/** The KA10's dance counters as last posted. */
let danced = { uuos: new Float64Array(0o100), interrupts: new Float64Array(8), user: 0, instructions: 0, sim: 0, wall: 0 };

/** @param {Map<number, number>} map @param {number} key */
const tally = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
/** @param {number} unit @param {number} block */
const seek = (unit, block) => tally(cylinders, unit * 1000 + Math.floor(block / CYLINDER));

/** Where the PC is now, after a run: a program's address is keyed above ITS's. */
function samplePc() {
	const cpu = m?.cpu;
	if (cpu) tally(pcs, cpu.PC + (cpu.FLAGS & USER ? USER_KEY : 0));
}

/** Start the dance's counts from now, so turning it on is not a burst of old news. */
function danceFrom(now) {
	const cpu = m?.cpu;
	pcs.clear();
	cylinders.clear();
	lastDance = now;
	if (cpu) danced = { uuos: Float64Array.from(cpu.uuos ?? []), interrupts: Float64Array.from(cpu.interrupts ?? []), user: cpu.userInstructions ?? 0, instructions: cpu.instructions, sim: cpu.events.now, wall: now };
}

/** @param {Float64Array | undefined} now @param {Float64Array} was @returns {[number, number][]} */
const deltas = (now, was) => (now ? [...now].flatMap((n, i) => (n > (was[i] ?? 0) ? [/** @type {[number, number]} */ ([i, n - (was[i] ?? 0)])] : [])) : []);

function dance(now) {
	const cpu = m?.cpu;
	if (!dancing || !cpu || now - lastDance < DANCE_MS) return;
	const ran = cpu.instructions - danced.instructions;
	post({
		type: 'dance',
		pcs: [...pcs],
		cylinders: [...cylinders],
		interrupts: deltas(cpu.interrupts, danced.interrupts),
		calls: deltas(cpu.uuos, danced.uuos),
		user: ran > 0 ? ((cpu.userInstructions ?? 0) - danced.user) / ran : 0,
		rate: (cpu.events.now - danced.sim) / tps / Math.max(0.001, (now - danced.wall) / 1000)
	});
	danceFrom(now);
}

/** @type {ItsMachine | null} */
let m = null;
/** @type {RangePack[]} */
let packs = [];
/** @type {'auto' | 'fast' | 'real'} */
let mode = 'auto';
let lastActive = 0;
let out = '';
/** Output since the current step began, for its wait. */
let since = '';
/** @type {Step[]} */
let steps = [];
let stepStarted = false;
let idleUntil = 0;
/** @type {{ wall: number, sim: number } | null} */
let anchor = null;
/** The PC a tape passes by halting at, octal; empty for ITS. */
let passAt = '';
let stopped = false;
let lastStats = 0;
let lastInstructions = 0;
let lastStatsWall = 0;
let tps = 1_000_000;
/** The console's 36 data switches, which a program reads with .RDSW (.OPER 20). */
let switches = 0;
let fastNow = true;
/** Where the system job types its log: 0 the console, -1 nowhere. Set once ITS is up, and again on change. */
let sysLog = -1;
/** @type {number | null} */
let sysLogSet = null;
/** ITS has said IN OPERATION: its symbols are in core, and writing them sticks. */
let up = false;
let tail = '';

/** @param {Record<string, unknown>} msg */
const post = (msg) => postMessage(msg);

/** Run the boot script's next step as far as it can go now. */
function script() {
	const cpu = m?.cpu;
	while (cpu && steps.length) {
		const s = steps[0];
		if (!stepStarted) {
			stepStarted = true;
			since = '';
			if (s.phase) post({ type: 'phase', text: s.phase });
			if (s.keys) m?.cty.type(s.keys);
			if (s.idle) idleUntil = cpu.events.now + s.idle * tps;
		}
		if (s.wait && !since.includes(s.wait)) return;
		if (s.prompt && !since.endsWith(s.prompt)) return;
		if (s.idle && cpu.events.now < idleUntil) return;
		steps.shift();
		stepStarted = false;
		if (!steps.length) post({ type: 'phase', text: '' });
	}
}

function stats(now) {
	const cpu = m?.cpu;
	if (!cpu || now - lastStats < STATS_MS) return;
	const mips = (cpu.instructions - lastInstructions) / ((now - lastStatsWall) * 1000);
	lastStats = lastStatsWall = now;
	lastInstructions = cpu.instructions;
	post({
		type: 'stats',
		instructions: cpu.instructions,
		seconds: cpu.events.now / tps,
		mips,
		fast: fastNow,
		pc: cpu.PC,
		reads: m?.dp.reads ?? 0,
		writes: m?.dp.writes ?? 0,
		packs: packs.map((p) => ({ chunks: p.chunks.size, bytes: p.bytes, dirty: p.dirty.size }))
	});
}

/** @param {'halt' | string} why */
function halted(why) {
	if (why !== 'halt' || !m) return false;
	stopped = true;
	const pc = m.cpu.PC.toString(8);
	post({ type: 'halt', pc, pass: passAt ? pc === passAt : null });
	return true;
}

function slice() {
	if (stopped || !m) return;
	const cpu = m.cpu;
	const t0 = performance.now();
	try {
		fastNow = mode === 'fast' || (mode === 'auto' && (steps.length > 0 || t0 - lastActive < QUIET_MS || m.cty.typeahead > 0));
		if (fastNow) {
			anchor = null;
			while (performance.now() - t0 < SLICE_MS) {
				if (halted(cpu.run(dancing ? 2_000 : 10_000))) break;
				if (dancing) samplePc();
				script();
			}
		} else {
			anchor ??= { wall: t0, sim: cpu.events.now };
			const target = anchor.sim + ((t0 - anchor.wall) / 1000) * tps;
			while (cpu.events.now < target && performance.now() - t0 < SLICE_MS) {
				if (halted(cpu.run(1_000))) break;
				if (dancing) samplePc();
				script();
			}
		}
	} catch (e) {
		stopped = true;
		post({ type: 'error', message: e instanceof Error ? e.message : String(e) });
	}
	if (up && sysLogSet !== sysLog && setSystemLog(cpu, sysLog)) sysLogSet = sysLog;
	if (out) {
		post({ type: 'out', text: out });
		out = '';
	}
	stats(performance.now());
	dance(performance.now());
	if (!stopped) setTimeout(slice, fastNow ? 0 : 10);
}

/** @param {string} url */
async function bytesOf(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	return new Uint8Array(await res.arrayBuffer());
}

/**
 * @param {{ boot: 'its' | 'tape', tape: string, packs: string[], warm: { chunk: number, packs: Record<string, number[]> }, steps: Step[], pass?: string }} start
 */
async function begin(start) {
	m = new ItsMachine({
		rung: 'halves',
		print: (ch) => {
			const c = String.fromCharCode(ch);
			out += c;
			if (steps.length) since += c;
			if (!up) up = (tail = (tail + c).slice(-12)) === 'IN OPERATION';
			lastActive = performance.now();
		}
	});
	tps = 1_000_000 * m.cpu.events.ticksPerUsec;
	passAt = start.pass ?? '';
	if (start.boot === 'its') {
		packs = start.packs.map((url, unit) => new RangePack(url, start.warm.chunk, unit));
		const todo = packs.flatMap((p) => (start.warm.packs[p.url.slice(p.url.lastIndexOf('/') + 1)] ?? []).map((c) => [p, c]));
		let done = 0;
		post({ type: 'phase', text: `Fetching the packs: 0 of ${todo.length} chunks` });
		const next = async () => {
			for (let job = todo.shift(); job; job = todo.shift()) {
				await /** @type {RangePack} */ (job[0]).prefetch(/** @type {number} */ (job[1]));
				done++;
				if (done % 8 === 0 || !todo.length) post({ type: 'phase', text: `Fetching the packs: ${done} of ${done + todo.length} chunks` });
			}
		};
		await Promise.all(Array.from({ length: 8 }, next));
		packs.forEach((p, u) => m?.dp.attach(u, p));
	}
	m.pt.attach(await bytesOf(start.tape));
	m.bootPtr();
	m.cpu.SW = switches;
	danceFrom(performance.now());
	steps = start.steps;
	lastActive = performance.now();
	lastStatsWall = performance.now();
	slice();
}

onmessage = (e) => {
	const msg = e.data;
	if (msg.type === 'start')
		begin(msg).catch((err) => {
			stopped = true;
			post({ type: 'error', message: err instanceof Error ? err.message : String(err) });
		});
	else if (msg.type === 'keys' && m) {
		m.cty.type(msg.text);
		lastActive = performance.now();
	} else if (msg.type === 'steps' && m) {
		steps.push(...msg.steps);
		lastActive = performance.now();
	} else if (msg.type === 'speed') {
		mode = msg.mode;
		anchor = null;
	} else if (msg.type === 'dance') {
		dancing = !!msg.on;
		danceFrom(performance.now());
	} else if (msg.type === 'syslog') {
		sysLog = Number(msg.tty);
	} else if (msg.type === 'switches') {
		switches = Number(msg.word) || 0;
		if (m) m.cpu.SW = switches;
	}
};

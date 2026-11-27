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
// In: { type: 'start', ... }, { type: 'keys', text }, { type: 'speed', mode }.
// Out: out (text), phase (what it is doing), stats, halt, error.
import { ItsMachine } from '@wwsff/cabinet/ka10';

const BLOCK = 1024;
const QUIET_MS = 3000;
const SLICE_MS = 25;
const STATS_MS = 500;

/** @typedef {{ keys?: string, wait?: string, idle?: number, phase?: string }} Step */

class RangePack {
	/** @param {string} url @param {number} chunk bytes per fetch */
	constructor(url, chunk) {
		this.url = url;
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
		this.dirty.set(block, BigUint64Array.from(from));
	}
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
let fastNow = true;

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
				if (halted(cpu.run(10_000))) break;
				script();
			}
		} else {
			anchor ??= { wall: t0, sim: cpu.events.now };
			const target = anchor.sim + ((t0 - anchor.wall) / 1000) * tps;
			while (cpu.events.now < target && performance.now() - t0 < SLICE_MS) {
				if (halted(cpu.run(1_000))) break;
				script();
			}
		}
	} catch (e) {
		stopped = true;
		post({ type: 'error', message: e instanceof Error ? e.message : String(e) });
	}
	if (out) {
		post({ type: 'out', text: out });
		out = '';
	}
	stats(performance.now());
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
			lastActive = performance.now();
		}
	});
	tps = 1_000_000 * m.cpu.events.ticksPerUsec;
	passAt = start.pass ?? '';
	if (start.boot === 'its') {
		packs = start.packs.map((url) => new RangePack(url, start.warm.chunk));
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
	} else if (msg.type === 'speed') {
		mode = msg.mode;
		anchor = null;
	}
};

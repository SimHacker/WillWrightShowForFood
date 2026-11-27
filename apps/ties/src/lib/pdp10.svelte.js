// The PDP-10 page's machine: the worker running the KA10 (its-worker.js), and the console
// teletype's paper as lines. One per page; starting another entry starts a fresh worker.

import dskdmpUrl from '../../../../packages/cabinet/its/dskdmp.rim?url';
import hhtestUrl from '../../../../packages/cabinet/its/hhtest.rim?url';
import warm from '../../../../packages/cabinet/its/warm.json';
import { programFor } from './its-programs.js';

/** Where the packs are served (packages/cabinet/its/README.md), in the unit order of build.tcl. */
const PACKS = ['rp03.2', 'rp03.3', 'rp03.0', 'rp03.1'].map((f) => `/packs/its/${f}`);
const TAPES = /** @type {Record<string, string>} */ ({ 'dskdmp.rim': dskdmpUrl, 'hhtest.rim': hhtestUrl });
/** Lines of paper kept; older ones are torn off. */
const PAPER = 2000;
const SPEED_KEY = 'pdp10-speed';

/** @typedef {'auto' | 'fast' | 'real'} Speed */
/** @typedef {{ instructions: number, seconds: number, mips: number, fast: boolean, pc: number, reads: number, writes: number, packs: { chunks: number, bytes: number, dirty: number }[] }} Stats */

export const SPEEDS = /** @type {{ id: Speed, label: string, title: string }[]} */ ([
	{ id: 'auto', label: 'Auto', title: 'Flat out while the console is busy, a real KA10’s pace once it has been quiet for 3 seconds' },
	{ id: 'fast', label: 'Flat out', title: 'As fast as this computer goes, all the time' },
	{ id: 'real', label: 'Real time', title: 'Simulated time kept to wall time: a KA10’s own pace' }
]);

class Pdp10 {
	/** @type {string[]} */
	lines = $state.raw(['']);
	phase = $state('');
	error = $state('');
	/** @type {Stats | null} */
	stats = $state.raw(null);
	/** @type {{ pc: string, pass: boolean | null } | null} */
	halt = $state.raw(null);
	/** @type {Speed} */
	speed = $state(keptSpeed());
	running = $state(false);
	/** What was started: an entry's title. */
	title = $state('');
	/** @type {Worker | null} */
	#worker = null;
	#col = 0;

	/**
	 * @param {{ title: string, runs?: Record<string, unknown> }} entry
	 * @param {{ login?: unknown }} values
	 */
	start(entry, values) {
		this.stop();
		const runs = entry.runs ?? {};
		const boot = runs.boot === 'tape' ? 'tape' : 'its';
		const login = String(values.login ?? 'guest').replace(/[^A-Za-z0-9]/g, '').slice(0, 6) || 'guest';
		const program = programFor(String(runs.program ?? 'ddt'));
		/** @type {{ keys?: string, wait?: string, idle?: number, phase?: string }[]} */
		const steps =
			boot === 'tape'
				? []
				: [
						{ wait: 'DSKDMP', phase: 'Reading DSKDMP off paper tape' },
						{ keys: 'its\r', wait: '\n', phase: 'Loading ITS from the packs' },
						{ keys: '\x1bg', wait: 'IN OPERATION', phase: 'Starting ITS' },
						{ keys: '\x1a', wait: '\n', phase: 'Waking DDT' },
						{ idle: 1 },
						{ keys: `:login ${login}\r`, wait: 'Happy hacking', phase: `Logging in as ${login.toUpperCase()}` },
						{ idle: 2 },
						...(program?.start ?? []).map((s, i) => ({ ...s, ...(i === 0 ? { phase: `Starting ${program?.title}` } : {}) }))
					];
		this.lines = [''];
		this.#col = 0;
		this.phase = boot === 'tape' ? `Reading ${runs.tape} off paper tape` : 'Starting the worker';
		this.error = '';
		this.halt = null;
		this.stats = null;
		this.title = entry.title;
		this.running = true;
		const w = new Worker(new URL('./its-worker.js', import.meta.url), { type: 'module' });
		this.#worker = w;
		w.onmessage = (e) => this.#heard(e.data);
		w.onerror = (e) => {
			this.error = e.message || 'the worker failed';
			this.running = false;
		};
		const abs = (/** @type {string} */ u) => new URL(u, location.href).href;
		w.postMessage({
			type: 'start',
			boot,
			tape: abs(TAPES[boot === 'tape' ? String(runs.tape) : 'dskdmp.rim'] ?? ''),
			packs: PACKS.map(abs),
			warm,
			steps,
			pass: runs.pass === undefined ? '' : String(runs.pass)
		});
		w.postMessage({ type: 'speed', mode: this.speed });
	}

	stop() {
		this.#worker?.terminate();
		this.#worker = null;
		this.running = false;
	}

	/** Keys to the console, as the teletype sends them. @param {string} text */
	type(text) {
		this.#worker?.postMessage({ type: 'keys', text });
	}

	/** @param {Speed} s */
	setSpeed(s) {
		this.speed = s;
		this.#worker?.postMessage({ type: 'speed', mode: s });
		try {
			globalThis.localStorage?.setItem(SPEED_KEY, s);
		} catch {
			/* Storage forbidden: the speed lasts until the page goes. */
		}
	}

	/** The paper as plain text, for copying. */
	get text() {
		return this.lines.join('\n');
	}

	/** @param {any} msg */
	#heard(msg) {
		if (msg.type === 'out') this.#print(msg.text);
		else if (msg.type === 'phase') this.phase = msg.text;
		else if (msg.type === 'stats') this.stats = msg;
		else if (msg.type === 'halt') {
			this.halt = { pc: msg.pc, pass: msg.pass };
			this.phase = '';
			this.running = false;
		} else if (msg.type === 'error') {
			this.error = msg.message;
			this.phase = '';
			this.running = false;
		}
	}

	/** What the teletype prints: Return goes to the left, Line Feed up a line in the same column. @param {string} text */
	#print(text) {
		const lines = this.lines.slice();
		let line = lines.pop() ?? '';
		for (const ch of text) {
			if (ch === '\r') this.#col = 0;
			else if (ch === '\n') {
				lines.push(line);
				line = '';
			} else if (ch === '\b') this.#col = Math.max(0, this.#col - 1);
			else if (ch === '\t') this.#col = (Math.floor(this.#col / 8) + 1) * 8;
			else if (ch >= ' ' && ch !== '\x7f') {
				line = line.padEnd(this.#col).slice(0, this.#col) + ch + line.slice(this.#col + 1);
				this.#col++;
			}
		}
		lines.push(line);
		this.lines = lines.length > PAPER ? lines.slice(-PAPER) : lines;
	}
}

/** @returns {Speed} */
function keptSpeed() {
	try {
		const s = globalThis.localStorage?.getItem(SPEED_KEY);
		if (s === 'auto' || s === 'fast' || s === 'real') return s;
	} catch {
		/* Storage forbidden: auto. */
	}
	return 'auto';
}

export const pdp10 = new Pdp10();

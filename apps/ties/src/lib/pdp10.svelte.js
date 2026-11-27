// The PDP-10 page's machine: the worker running the KA10 (its-worker.js), and the console
// teletype's paper as lines. One per page; starting another entry starts a fresh worker.
//
// The paper prints at the baud rate the person picks, on this page's clock, whatever speed the
// KA10 runs at; what ITS sent ahead waits here. The bus dance hears what the worker reports
// (its-worker.js), each character as it prints, and each key typed; its seed is the console's
// 36 data switches, which a program reads with .RDSW.
//
// The console is shown as paper or as a glass teletype's screen (glass-screen.js); both are fed
// the same characters, and on glass ITS is told the terminal is Glass (`:tctyp glass`), so it
// erases rubouts and stops a long typeout with --More--. Either way the bell rings, and what
// prints is announced to screen readers and, with Speak on, read aloud (tty-voice.svelte.js).

import dskdmpUrl from '../../../../packages/cabinet/its/dskdmp.rim?url';
import hhtestUrl from '../../../../packages/cabinet/its/hhtest.rim?url';
import warm from '../../../../packages/cabinet/its/warm.json';
import { ITS_CALLS, PDP10_REGIONS, PDP10_VOICES, Tally, dataSwitchWord, dataSwitchesSeedText, dataSwitchesSeedWord } from '@wwsff/cabinet/dance';
import { asset } from '$app/paths';
import { createBeeper } from './beeper.js';
import { BusDance } from './bus-dance.svelte.js';
import { GlassScreen } from './glass-screen.js';
import { TtyVoice } from './tty-voice.svelte.js';
import { programFor } from './its-programs.js';
import { grue } from './grue.svelte.js';

/** Where the packs are served (packages/cabinet/its/README.md), in the unit order of build.tcl. */
const PACKS = ['rp03.2', 'rp03.3', 'rp03.0', 'rp03.1'].map((f) => `/packs/its/${f}`);
const TAPES = /** @type {Record<string, string>} */ ({ 'dskdmp.rim': dskdmpUrl, 'hhtest.rim': hhtestUrl });
/** Lines of paper kept; older ones are torn off. */
const PAPER = 2000;
const SPEED_KEY = 'pdp10-speed';
const BAUD_KEY = 'pdp10-baud';
const SWITCHES_KEY = 'pdp10-switches';
const VIEW_KEY = 'pdp10-view';
const BELL_KEY = 'pdp10-bell-mute';
/** Set when the system job's log (LOGIN, GUNNER, the time…) should type on the console, as ITS starts. */
const SYSLOG_KEY = 'pdp10-system-log';
/** Set when GUNNER may log out an idle console, as it did at MIT. */
const IDLE_KEY = 'pdp10-idle-logout';

const CALLS = new Map(ITS_CALLS.map((c) => [c.addr, c]));

/** @typedef {'auto' | 'fast' | 'real'} Speed */
/** @typedef {{ instructions: number, seconds: number, mips: number, fast: boolean, pc: number, reads: number, writes: number, packs: { chunks: number, bytes: number, dirty: number }[] }} Stats */

export const SPEEDS = /** @type {{ id: Speed, label: string, title: string }[]} */ ([
	{ id: 'auto', label: 'Auto', title: 'Flat out while the console is busy, a real KA10’s pace once it has been quiet for 3 seconds' },
	{ id: 'fast', label: 'Flat out', title: 'As fast as this computer goes, all the time' },
	{ id: 'real', label: 'Real time', title: 'Simulated time kept to wall time: a KA10’s own pace' }
]);

/** The console's speeds. 0 prints as fast as ITS sends. */
export const BAUDS = [
	{ baud: 0, label: 'Instant', title: 'Printed as fast as ITS sends it, at any speed the KA10 runs' },
	{ baud: 110, label: '110 baud', title: "A Teletype Model 33's 10 characters a second" },
	{ baud: 300, label: '300 baud', title: '30 characters a second, a DECwriter' },
	{ baud: 1200, label: '1200 baud', title: '120 characters a second' },
	{ baud: 2400, label: '2400 baud', title: '240 characters a second' },
	{ baud: 9600, label: '9600 baud', title: "960 characters a second, a glass terminal's fastest" }
];
/** @typedef {'paper' | 'glass'} View */
export const VIEWS = /** @type {{ id: View, label: string, title: string }[]} */ ([
	{ id: 'paper', label: 'Paper', title: 'A printing teletype: everything printed stays on the paper, to scroll back through' },
	{ id: 'glass', label: 'Glass', title: 'A glass teletype: 24 lines on a screen, scrolling; ITS erases rubouts and stops at --More-- for each screenful' }
]);

/** What each thing a person notices adds to the dance's stir, the most it holds, and below what it is quiet. */
const STIR = { key: 0.12, printed: 0.006, seek: 0.08, most: 1.2, quiet: 0.05 };
/** How far each report moves an interrupt level's usual count toward what it just was. */
const PI_USUAL = 0.05;
/** Milliseconds for the stir to fade by half. */
const STIR_HALF = 1500;

/** Characters a second: 11 bits a character at 110 baud, 10 above. @param {number} baud */
const cps = (baud) => (baud === 110 ? 10 : baud / 10);

class Pdp10 {
	/** @type {string[]} */
	lines = $state.raw(['']);
	phase = $state('');
	error = $state('');
	/** @type {Stats | null} */
	stats = $state.raw(null);
	/**
	 * The words the memory node last asked for, the PC and its mode, and the accumulators.
	 * @type {{ from: number, user: boolean, words: (number | null)[], pc: number, pcUser: boolean, acs: number[] } | null}
	 */
	mem = $state.raw(null);
	/** Exec DDT's symbols, once ITS is up. @type {import('@wwsff/cabinet/ka10').ItsSym[]} */
	symbols = $state.raw([]);
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
	baud = $state(keptBaud());
	/** Characters ITS has sent that the paper has not printed yet. */
	waiting = $state(0);
	#pending = '';
	#credit = 0;
	#raf = 0;
	#then = 0;
	/** The console's 36 data switches. */
	switches = $state(keptSwitches());
	dance = new BusDance(PDP10_VOICES, 'diesel', 'pdp10');
	/** @type {View} */
	view = $state(keptView());
	#glass = new GlassScreen();
	/** The glass screen's lines and cursor, as last printed. */
	glass = $state.raw({ lines: /** @type {string[]} */ ([]), row: 0, col: 0 });
	/** What ITS thinks the console is, as far as this page has told it: null before it is up. @type {View | null} */
	told = $state(null);
	voice = new TtyVoice('pdp10-speak');
	bellMuted = $state(keptFlag(BELL_KEY));
	/** Whether the system job types its log on the console; off, ITS sends it to the null device. */
	systemLog = $state(keptFlag(SYSLOG_KEY));
	/** Whether GUNNER may log out an idle console; off, the page keeps the console's last input time current. */
	idleLogout = $state(keptFlag(IDLE_KEY));
	/** Lit for a moment when the bell rings, muted or not. */
	ringing = $state(false);
	#beeper = createBeeper({ resolve: asset });
	/** The view the boot script told ITS about. @type {View} */
	#bootView = 'paper';
	#hits = { ka10: new Tally(), rp03: new Tally(), pi: new Tally() };
	/** @type {Map<number, number>} */
	#calls = new Map();
	#gauges = { load: 0, fill: 0 };
	/**
	 * How much is going on that a person would notice: keys typed, characters printed, disk
	 * seeks. It drives the drums with the programs' share of the time, and fades by half every
	 * STIR_HALF ms, so a game waiting for its next command goes quiet. ITS idling flat out would
	 * otherwise keep the drums at full drive.
	 */
	#stir = 0;
	#user = 0;
	/**
	 * Each interrupt level's usual count a report. The interrupts voice plays only what rises
	 * above it, and only while there is a stir: the clock interrupts on its level at the same
	 * rate all the time, and would ring the same note on every beat.
	 * @type {number[]}
	 */
	#piUsual = [];
	/** The program's own baud rate, set when it starts, for a person who has not picked one. */
	#programBaud = 0;
	#toldDance = false;

	constructor() {
		this.dance.regions = PDP10_REGIONS;
		this.dance.switches = dataSwitchWord(this.switches);
		this.#beeper.muted = this.bellMuted;
		this.glass = { lines: this.#glass.lines(), row: 0, col: 0 };
	}

	/**
	 * @param {{ title: string, runs?: Record<string, unknown> }} entry
	 * @param {{ login?: unknown }} values
	 */
	start(entry, values) {
		this.stop();
		const runs = entry.runs ?? {};
		const seeded = dataSwitchesSeedWord(new URLSearchParams(globalThis.location?.search ?? '').get('seed') ?? '') ?? (runs.switches === undefined ? null : dataSwitchesSeedWord(String(runs.switches)));
		if (seeded !== null) this.setSwitches(seeded);
		// ITS checks switch 0 on every clock tick and stops in DDT while it is up (BUG DDT,
		// [SWITCH 0 IS UP], ITS 1652), so a boot starts with it down.
		if (this.switchOn(0)) this.flip(0);
		const boot = runs.boot === 'tape' ? 'tape' : 'its';
		const login = String(values.login ?? 'guest').replace(/[^A-Za-z0-9]/g, '').slice(0, 6) || 'guest';
		const program = programFor(String(runs.program ?? 'ddt'));
		this.#programBaud = program?.baud && !keptBaudChoice() ? program.baud : 0;
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
						...(this.view === 'glass' ? [{ keys: ':tctyp glass\r', wait: '*', phase: 'Telling ITS the console is glass' }, { idle: 1 }] : []),
						...(program?.start ?? []).map((s, i) => ({ ...s, ...(i === 0 ? { phase: `Starting ${program?.title}` } : {}) }))
					];
		this.lines = [''];
		this.#col = 0;
		this.#pending = '';
		this.waiting = 0;
		this.#glass.clear();
		this.glass = { lines: this.#glass.lines(), row: 0, col: 0 };
		this.told = boot === 'its' ? null : this.view;
		this.#bootView = this.view;
		this.#beeper.preload();
		this.phase = boot === 'tape' ? `Reading ${runs.tape} off paper tape` : 'Starting the worker';
		this.error = '';
		this.halt = null;
		this.stats = null;
		this.mem = null;
		this.symbols = [];
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
		w.postMessage({ type: 'switches', word: this.switches });
		w.postMessage({ type: 'syslog', tty: this.systemLog ? 0 : -1 });
		w.postMessage({ type: 'idle', logout: this.idleLogout });
		this.#toldDance = false;
		if (this.dance.on) w.postMessage({ type: 'dance', on: (this.#toldDance = true) });
		this.#then = 0;
		this.#raf = requestAnimationFrame(this.#frame);
	}

	/** Ask for `count` words from `from`, as ITS sees them or, with `user`, the job running now; `mem` gets them. @param {number} from @param {number} count @param {boolean} user */
	peek(from, count, user) {
		this.#worker?.postMessage({ type: 'peek', from, count, user });
	}

	stop() {
		this.#worker?.terminate();
		this.#worker = null;
		this.running = false;
		cancelAnimationFrame(this.#raf);
		this.dance.rest();
		this.voice.stop();
	}

	/** Keys to the console, as the teletype sends them. @param {string} text */
	type(text) {
		this.#worker?.postMessage({ type: 'keys', text });
		this.voice.typed(text);
		this.#stirUp(STIR.key * text.length);
		for (const ch of text) this.dance.touch({ kind: 'key', code: ch.charCodeAt(0) });
	}

	/**
	 * Keys typed a step at a time: each step waits for its `wait` text, or for the output to
	 * end with its `prompt`, before the next is typed.
	 * @param {{ keys: string, wait?: string, prompt?: string }[]} steps
	 */
	typeSteps(steps) {
		this.#worker?.postMessage({ type: 'steps', steps: steps.map((s) => ({ ...s })) });
		for (const s of steps) {
			this.voice.typed(s.keys);
			for (const ch of s.keys) this.dance.touch({ kind: 'key', code: ch.charCodeAt(0) });
		}
	}

	/** @param {number} baud */
	setBaud(baud) {
		this.baud = baud;
		keep(BAUD_KEY, String(baud));
	}

	/**
	 * Show the console as paper or glass, and tell ITS when it is at DDT's prompt, where typing
	 * `:tctyp` interrupts nothing; anywhere else `tell` does it when the person says.
	 * @param {View} v
	 */
	setView(v) {
		this.view = v;
		keep(VIEW_KEY, v);
		if (this.atDdt) this.tell();
	}

	/** ITS is logged in and waiting at DDT's star, with nothing still to print. */
	get atDdt() {
		return this.running && !this.phase && !this.waiting && this.lines.at(-1) === '*';
	}

	/** Type the `:tctyp` that tells ITS what the console is now. */
	tell() {
		this.type(this.view === 'glass' ? ':tctyp glass\r' : ':tctyp printing\r');
		this.told = this.view;
	}

	/** @param {boolean} on */
	muteBell(on) {
		this.bellMuted = on;
		this.#beeper.muted = on;
		keep(BELL_KEY, on ? '1' : '');
	}

	/** Let the system job type its log on the console, or send it nowhere. @param {boolean} on */
	setSystemLog(on) {
		this.systemLog = on;
		keep(SYSLOG_KEY, on ? '1' : '');
		this.#worker?.postMessage({ type: 'syslog', tty: on ? 0 : -1 });
	}

	/** Let GUNNER log out an idle console, or keep the console looking typed on. @param {boolean} on */
	setIdleLogout(on) {
		this.idleLogout = on;
		keep(IDLE_KEY, on ? '1' : '');
		this.#worker?.postMessage({ type: 'idle', logout: on });
	}

	#ring() {
		this.ringing = true;
		setTimeout(() => (this.ringing = false), 200);
		this.#beeper.ring();
	}

	/** Print everything that is waiting, now. */
	flush() {
		const text = this.#pending;
		this.#pending = '';
		this.waiting = 0;
		this.#print(text);
	}

	/** Set the data switches; a program reads them with .RDSW. @param {number} word */
	setSwitches(word) {
		this.switches = Math.max(0, Math.min(2 ** 36 - 1, Math.floor(word)));
		this.dance.switches = dataSwitchWord(this.switches);
		this.#worker?.postMessage({ type: 'switches', word: this.switches });
		keep(SWITCHES_KEY, dataSwitchesSeedText(this.switches));
	}

	/** Flip switch `bit`, 0 the leftmost, as DEC numbers them. @param {number} bit */
	flip(bit) {
		const v = 2 ** (35 - bit);
		this.setSwitches(this.switches + (Math.floor(this.switches / v) % 2 ? -v : v));
	}

	/** @param {number} bit */
	switchOn(bit) {
		return Math.floor(this.switches / 2 ** (35 - bit)) % 2 === 1;
	}

	/** The paper at its baud rate, and the dance. @param {number} now */
	#frame = (now) => {
		this.#raf = requestAnimationFrame(this.#frame);
		const dt = this.#then ? Math.min(250, now - this.#then) : 0;
		this.#then = now;
		this.#stir *= 0.5 ** (dt / STIR_HALF);
		this.#gauges = { ...this.#gauges, load: this.#load() };
		if (this.#pending) {
			let n = this.#pending.length;
			if (this.baud) {
				this.#credit += (dt * cps(this.baud)) / 1000;
				n = Math.min(n, Math.floor(this.#credit));
				this.#credit -= n;
			}
			if (n > 0) {
				const text = this.#pending.slice(0, n);
				this.#pending = this.#pending.slice(n);
				this.#print(text);
			}
		} else this.#credit = Math.min(this.#credit, 1);
		if (this.waiting !== this.#pending.length) this.waiting = this.#pending.length;
		if (this.dance.on !== this.#toldDance) this.#worker?.postMessage({ type: 'dance', on: (this.#toldDance = this.dance.on) });
		this.dance.frame(
			now,
			() => ({ ka10: this.#hits.ka10.take(), rp03: this.#hits.rp03.take(), pi: this.#hits.pi.take() }),
			() => this.#gauges,
			undefined,
			() => {
				const called = [...this.#calls].flatMap(([op, calls]) => {
					const c = CALLS.get(op);
					return c ? [{ name: c.name, calls, sound: c.sound }] : [];
				});
				this.#calls.clear();
				return called;
			}
		);
	};

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
		if (msg.type === 'out') {
			if (this.baud || this.#pending) this.#pending += msg.text;
			else this.#print(msg.text);
		} else if (msg.type === 'dance') this.#danced(msg);
		else if (msg.type === 'phase') {
			if (!msg.text && this.phase && this.told === null) this.told = this.#bootView;
			if (this.#programBaud && msg.text?.startsWith('Starting ')) {
				this.baud = this.#programBaud;
				this.#programBaud = 0;
			}
			this.phase = msg.text;
		}
		else if (msg.type === 'stats') this.stats = msg;
		else if (msg.type === 'mem') this.mem = msg;
		else if (msg.type === 'symbols') this.symbols = msg.list;
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

	/**
	 * What the worker heard since its last report. The load is how fast simulated time runs
	 * against the wall's, the fill how much of it the programs had rather than ITS.
	 * @param {{ pcs: [number, number][], cylinders: [number, number][], interrupts: [number, number][], calls: [number, number][], user: number, rate: number }} msg
	 */
	#danced(msg) {
		for (const [k, w] of msg.pcs) this.#hits.ka10.add(k, w);
		for (const [k, w] of msg.cylinders) this.#hits.rp03.add(k, w);
		for (const [k, w] of msg.interrupts) {
			const usual = this.#piUsual[k] ?? w;
			this.#piUsual[k] = usual + PI_USUAL * (w - usual);
			if (this.#stir > STIR.quiet && w > 1.5 * usual) this.#hits.pi.add(k, w - usual);
		}
		for (const [op, n] of msg.calls) if (CALLS.has(op)) this.#calls.set(op, (this.#calls.get(op) ?? 0) + n);
		for (const [, w] of msg.cylinders) this.#stirUp(STIR.seek * Math.min(1, w));
		this.#user = Math.max(0, Math.min(1, msg.user));
		this.#gauges = { load: this.#load(), fill: Math.sqrt(this.#user) };
	}

	/** @param {number} n */
	#stirUp(n) {
		this.#stir = Math.min(STIR.most, this.#stir + n);
	}

	/** The drums' drive: what a person notices, and what the programs are doing besides ITS. */
	#load() {
		return Math.min(1, this.#stir + 0.5 * this.#user);
	}

	/** What the teletype prints: Return goes to the left, Line Feed up a line in the same column. @param {string} text */
	#print(text) {
		grue.heard(text);
		this.#stirUp(STIR.printed * text.length);
		const lines = this.lines.slice();
		let line = lines.pop() ?? '';
		const bells = this.#glass.feed(text);
		if (bells) this.#ring();
		this.glass = { lines: this.#glass.lines(), row: this.#glass.row, col: this.#glass.col };
		for (const ch of text) {
			this.dance.printed(ch.charCodeAt(0));
			this.voice.hear(ch.charCodeAt(0));
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

/** @returns {View} */
function keptView() {
	try {
		return globalThis.localStorage?.getItem(VIEW_KEY) === 'glass' ? 'glass' : 'paper';
	} catch {
		return 'paper';
	}
}

/** @param {string} key */
function keptFlag(key) {
	try {
		return globalThis.localStorage?.getItem(key) === '1';
	} catch {
		return false;
	}
}

/** @param {string} key @param {string} value */
function keep(key, value) {
	try {
		globalThis.localStorage?.setItem(key, value);
	} catch {
		/* Storage forbidden: it lasts until the page goes. */
	}
}

/** Whether the person has picked a baud rate on this browser. */
function keptBaudChoice() {
	try {
		return globalThis.localStorage?.getItem(BAUD_KEY) != null;
	} catch {
		return false;
	}
}

function keptBaud() {
	try {
		const n = Number(globalThis.localStorage?.getItem(BAUD_KEY) ?? 0);
		return BAUDS.some((b) => b.baud === n) ? n : 0;
	} catch {
		return 0;
	}
}

function keptSwitches() {
	try {
		return dataSwitchesSeedWord(globalThis.localStorage?.getItem(SWITCHES_KEY) ?? '') ?? 0;
	} catch {
		return 0;
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

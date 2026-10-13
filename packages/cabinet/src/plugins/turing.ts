import type { Cpu, Device, Iot, IotReply, Step } from "../bus.js";

/**
 * A Turing machine engine: a co-processor that runs transition tables out of shared memory, the
 * way the Type 340 runs display files. TURING-ENGINE.md is the design; this file is the engine.
 *
 * Three layers, so the engine fits any host:
 *
 *   TuringEngine   the transition semantics over a MemoryPort and a TmShape. Knows nothing about
 *                  IOTs, PDP-7s or word widths beyond the shape.
 *   TuringDevice   the PDP-7 adapter: device 54 on the IOT bus, a flag on the interrupt line.
 *   TuringCpu      the engine as a whole cabinet: a stand-alone Universal Turing Machine whose
 *                  "core" holds one control block, a table and a tape.
 *
 * Memory format, in host words (TURING-ENGINE.md, "Memory format"):
 *
 *   control block (TCB), at the address the host loads:
 *     +0 STATE   current state; 0 is halt                 engine writes back every transition
 *     +1 HEAD    head cell index within the window        engine writes back; -1 or WLEN on a fault
 *     +2 ORIGIN  absolute tape index of window cell 0     engine writes back when it pages
 *     +3 WINDOW  address of the tape window
 *     +4 WLEN    window length in cells
 *     +5 TABLE   address of state 0's row; row q is at TABLE + q * NSYM
 *     +6 NSYM    symbols per row, the alphabet size
 *     +7 ALPHA   address of NSYM cell codes, symbol i is written as ALPHA[i]; 0 = codes are indices
 *     +8 COUNT   transitions executed, low word
 *     +9 COUNTH  transitions executed, high word
 *
 *   tape window: cells of `cellBits`, packed from the high end of each word, as many as fit. On a
 *   PDP-7 that is three six-bit cells a word, the Type 342's character word, so a window whose
 *   alphabet is 342 codes is a display file the 340 can draw.
 *
 *   transition entry, one word per (state, symbol):  [move:2][write:symBits][next:rest]
 *     move 0 = no door (the all-zero word: empty memory is an undefined table)
 *     move 1 = right, 2 = left, 3 = stay
 *   Symbol 0 is the blank.
 */

export type TmShape = {
	/** Host word width. */
	wordBits: number;
	/** Bits per tape cell; packed floor(wordBits / cellBits) to a word. The host's character size. */
	cellBits: number;
	/** Bits for the written symbol in a transition entry. */
	symBits: number;
	/** Address width; addresses in the TCB are masked to it. */
	addrBits: number;
};

/** PDP-7: 18-bit words, SIXBIT cells three to a word, 16 symbols, 4096 states, 8K addresses. */
export const PDP7_TM_SHAPE: TmShape = { wordBits: 18, cellBits: 6, symBits: 4, addrBits: 13 };

export interface MemoryPort {
	read(addr: number): number;
	write(addr: number, word: number): void;
}

export const TCB = {
	STATE: 0,
	HEAD: 1,
	ORIGIN: 2,
	WINDOW: 3,
	WLEN: 4,
	TABLE: 5,
	NSYM: 6,
	ALPHA: 7,
	COUNT: 8,
	COUNTH: 9,
	SIZE: 10,
} as const;

export const MOVE = { NONE: 0, R: 1, L: 2, N: 3 } as const;

/* Status word (18-bit layout; narrower hosts see the low bits shifted per adapter). */
export const TM_RUN = 0o400000;
export const TM_HALT = 0o200000;
export const TM_UNDEF = 0o100000;
export const TM_FAULT = 0o040000;
export const TM_STEP = 0o020000;
/** With FAULT: the head ran off the left of the window. */
export const TM_LEFT = 0o010000;
export const TM_FLAGS = TM_HALT | TM_UNDEF | TM_FAULT | TM_STEP;

/** Mode word: bit 17 set = the host pages the tape (fault and stop); clear = the engine pages it. */
export const TM_MODE_HOST = 0o1;
/** Mode word, bit 16: forget the spilled tape (a new program). Acts once; not remembered. */
export const TM_MODE_FORGET = 0o2;

export type StopReason = "halt" | "undef" | "fault" | "step";

/**
 * The rest of the tape, run-length encoded: only non-blank runs are kept. The engine spills to it
 * when it pages by itself; the host can preload it, read it, or ignore it and page to its own
 * storage instead (disk, DECtape, paper tape) in host mode.
 */
export class RleTape {
	/** Sorted, non-overlapping, non-adjacent-equal runs of non-blank codes. */
	runs: { start: number; length: number; code: number }[] = [];
	constructor(public blank = 0) {}

	clear(): void {
		this.runs = [];
	}

	/** Index of the first run that ends after `at`. */
	private firstEndingAfter(at: number): number {
		let lo = 0;
		let hi = this.runs.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			const r = this.runs[mid]!;
			if (r.start + r.length > at) hi = mid;
			else lo = mid + 1;
		}
		return lo;
	}

	read(at: number): number {
		const r = this.runs[this.firstEndingAfter(at)];
		return r && r.start <= at ? r.code : this.blank;
	}

	load(start: number, n: number): number[] {
		const out = new Array<number>(n).fill(this.blank);
		for (let k = this.firstEndingAfter(start); k < this.runs.length; k += 1) {
			const r = this.runs[k]!;
			if (r.start >= start + n) break;
			const lo = Math.max(start, r.start);
			const hi = Math.min(start + n, r.start + r.length);
			for (let i = lo; i < hi; i += 1) out[i - start] = r.code;
		}
		return out;
	}

	/** Replace cells [start, start + codes.length): only the runs it overlaps are touched. */
	store(start: number, codes: readonly number[]): void {
		const end = start + codes.length;
		const lo = this.firstEndingAfter(start);
		let hi = lo;
		while (hi < this.runs.length && this.runs[hi]!.start < end) hi += 1;
		const repl: typeof this.runs = [];
		const first = this.runs[lo];
		if (lo < hi && first!.start < start) repl.push({ start: first!.start, length: start - first!.start, code: first!.code });
		for (let i = 0; i < codes.length; ) {
			const code = codes[i]!;
			let j = i + 1;
			while (j < codes.length && codes[j] === code) j += 1;
			if (code !== this.blank) repl.push({ start: start + i, length: j - i, code });
			i = j;
		}
		const last = this.runs[hi - 1];
		if (lo < hi && last!.start + last!.length > end)
			repl.push({ start: end, length: last!.start + last!.length - end, code: last!.code });
		this.runs.splice(lo, hi - lo, ...repl);
		// Merge equal neighbours across the seams.
		let k = Math.max(1, lo);
		const stop = Math.min(this.runs.length, lo + repl.length + 1);
		while (k < stop && k < this.runs.length) {
			const a = this.runs[k - 1]!;
			const b = this.runs[k]!;
			if (a.code === b.code && a.start + a.length === b.start) {
				a.length += b.length;
				this.runs.splice(k, 1);
			} else k += 1;
		}
	}

	/** Lowest and one past the highest non-blank index, or null for a blank tape. */
	extent(): { start: number; end: number } | null {
		if (this.runs.length === 0) return null;
		const last = this.runs[this.runs.length - 1]!;
		return { start: this.runs[0]!.start, end: last.start + last.length };
	}
}

export type TuringEngineOpts = {
	mem: MemoryPort;
	shape?: TmShape;
};

/**
 * The transition semantics. Registers are loaded from the TCB on `load()` and written back after
 * every transition, so the host and the panels can read live state from core; the host changes the
 * TCB only while the engine is stopped and then reloads it (TMGO), as the 340 is restarted by IDLA.
 */
export class TuringEngine {
	readonly shape: TmShape;
	readonly spill = new RleTape(0);
	readonly cellsPerWord: number;

	tcb = 0;
	state = 0;
	head = 0;
	origin = 0;
	window = 0;
	wlen = 0;
	table = 0;
	nsym = 0;
	alpha = 0;
	count = 0;

	status = 0;
	/** Engine pages by itself (false) or faults to the host (true). */
	hostPaging = false;
	/** Pages taken by the engine itself, for the panel and tests. */
	pages = 0;
	/** The last symbol index read, -1 before the first. */
	scanned = -1;
	/** The address of the last transition entry used: the engine's "PC", for traces and source maps. */
	entryAddr = -1;

	private readonly mem: MemoryPort;
	private readonly wmask: number;
	private readonly amask: number;
	private readonly cmask: number;
	private readonly smask: number;
	private readonly qbits: number;
	private stepOnce = false;

	constructor(opts: TuringEngineOpts) {
		this.mem = opts.mem;
		this.shape = opts.shape ?? PDP7_TM_SHAPE;
		const s = this.shape;
		this.cellsPerWord = Math.floor(s.wordBits / s.cellBits);
		if (this.cellsPerWord < 1) throw new Error("a tape cell is wider than a word");
		this.qbits = s.wordBits - 2 - s.symBits;
		if (this.qbits < 1) throw new Error("no room for a next state in a transition entry");
		this.wmask = 2 ** s.wordBits - 1;
		this.amask = 2 ** s.addrBits - 1;
		this.cmask = 2 ** s.cellBits - 1;
		this.smask = 2 ** s.symBits - 1;
	}

	get running(): boolean {
		return (this.status & TM_RUN) !== 0;
	}

	get maxStates(): number {
		return 2 ** this.qbits;
	}

	/** Read the TCB into the registers. The spilled tape is kept: forget() it for a new program. */
	load(tcb: number): void {
		this.tcb = tcb & this.amask;
		const at = (i: number) => this.mem.read((this.tcb + i) & this.amask) & this.wmask;
		this.state = at(TCB.STATE);
		this.head = this.signed(at(TCB.HEAD));
		this.origin = this.signed(at(TCB.ORIGIN));
		this.window = at(TCB.WINDOW) & this.amask;
		this.wlen = at(TCB.WLEN);
		this.table = at(TCB.TABLE) & this.amask;
		this.nsym = at(TCB.NSYM);
		this.alpha = at(TCB.ALPHA) & this.amask;
		this.count = at(TCB.COUNT) + at(TCB.COUNTH) * (this.wmask + 1);
		this.spill.blank = this.code(0);
	}

	/** Blank the tape outside the window. */
	forget(): void {
		this.spill.clear();
		this.pages = 0;
	}

	/** Clear the flags and run (TMLA / TMGO), or run exactly one transition (TMSS). */
	go(single = false): void {
		this.status = TM_RUN;
		this.stepOnce = single;
	}

	stop(): void {
		this.status &= ~TM_RUN;
	}

	clearFlags(): void {
		this.status &= ~(TM_FLAGS | TM_LEFT);
	}

	reset(): void {
		this.status = 0;
		this.stepOnce = false;
		this.spill.clear();
		this.pages = 0;
		this.scanned = -1;
		this.entryAddr = -1;
	}

	/** One transition. Returns why it stopped, or null if it is still running. */
	step(): StopReason | null {
		if (!this.running) return null;
		if (this.state === 0) return this.halt(TM_HALT, "halt");
		if (this.head < 0 || this.head >= this.wlen) {
			if (!this.hostPaging) this.page();
			else return this.halt(TM_FAULT | (this.head < 0 ? TM_LEFT : 0), "fault");
		}

		const sym = this.symbol(this.readCell(this.head));
		this.scanned = sym;
		if (sym < 0) return this.halt(TM_UNDEF, "undef");
		this.entryAddr = (this.table + this.state * this.nsym + sym) & this.amask;
		const entry = this.mem.read(this.entryAddr) & this.wmask;
		const move = Math.floor(entry / 2 ** (this.shape.wordBits - 2)) & 3;
		const write = Math.floor(entry / 2 ** this.qbits) & this.smask;
		const next = entry % 2 ** this.qbits;
		if (move === MOVE.NONE || write >= this.nsym) return this.halt(TM_UNDEF, "undef");

		this.writeCell(this.head, this.code(write));
		if (move === MOVE.R) this.head += 1;
		else if (move === MOVE.L) this.head -= 1;
		this.state = next;
		this.count += 1;

		let reason: StopReason | null = null;
		let flags = 0;
		if (this.head < 0 || this.head >= this.wlen) {
			if (!this.hostPaging) this.page();
			else {
				flags |= TM_FAULT | (this.head < 0 ? TM_LEFT : 0);
				reason = "fault";
			}
		}
		if (next === 0) {
			flags |= TM_HALT;
			reason = "halt";
		}
		if (!reason && this.stepOnce) {
			flags |= TM_STEP;
			reason = "step";
		}
		this.writeBack();
		if (reason) return this.halt(flags, reason);
		return null;
	}

	/** The whole tape as symbol indices: the spill merged with the window. */
	snapshot(): { origin: number; cells: number[]; head: number } {
		const ext = this.spill.extent();
		const lo = Math.min(this.origin, ext?.start ?? this.origin, this.origin + this.head);
		const hi = Math.max(this.origin + this.wlen, ext?.end ?? 0, this.origin + this.head + 1);
		const codes = this.spill.load(lo, hi - lo);
		for (let i = 0; i < this.wlen; i += 1) codes[this.origin + i - lo] = this.readCell(i);
		return { origin: lo, cells: codes.map((c) => this.symbol(c)), head: this.origin + this.head };
	}

	readCell(i: number): number {
		const word = this.mem.read((this.window + Math.floor(i / this.cellsPerWord)) & this.amask);
		return Math.floor(word / 2 ** this.cellShift(i)) & this.cmask;
	}

	writeCell(i: number, code: number): void {
		const addr = (this.window + Math.floor(i / this.cellsPerWord)) & this.amask;
		const unit = 2 ** this.cellShift(i);
		const word = this.mem.read(addr) & this.wmask;
		const old = Math.floor(word / unit) & this.cmask;
		this.mem.write(addr, word - old * unit + (code & this.cmask) * unit);
	}

	/** Symbol index -> cell code. */
	code(sym: number): number {
		return this.alpha ? this.mem.read((this.alpha + sym) & this.amask) & this.cmask : sym;
	}

	/** Cell code -> symbol index, -1 if the code is not in the alphabet. */
	symbol(code: number): number {
		if (!this.alpha) return code < this.nsym ? code : -1;
		for (let i = 0; i < this.nsym; i += 1) if (this.code(i) === code) return i;
		return -1;
	}

	private cellShift(i: number): number {
		const s = this.shape;
		return s.wordBits - s.cellBits * ((i % this.cellsPerWord) + 1);
	}

	/** Slide the window half its length toward the head: evicted cells to the spill, new ones from it. */
	private page(): void {
		const words = Math.max(1, Math.floor(this.wlen / this.cellsPerWord / 2));
		const shift = Math.min(this.wlen, words * this.cellsPerWord);
		const cells: number[] = [];
		for (let i = 0; i < this.wlen; i += 1) cells.push(this.readCell(i));
		this.spill.store(this.origin, cells);
		while (this.head >= this.wlen) this.origin += shift, (this.head -= shift);
		while (this.head < 0) this.origin -= shift, (this.head += shift);
		const fresh = this.spill.load(this.origin, this.wlen);
		for (let i = 0; i < this.wlen; i += 1) this.writeCell(i, fresh[i]!);
		this.pages += 1;
		this.writeBack();
	}

	private halt(flags: number, reason: StopReason): StopReason {
		this.status = (this.status & ~TM_RUN) | flags;
		this.stepOnce = false;
		return reason;
	}

	private writeBack(): void {
		const put = (i: number, v: number) => this.mem.write((this.tcb + i) & this.amask, v & this.wmask);
		const base = this.wmask + 1;
		put(TCB.STATE, this.state);
		put(TCB.HEAD, this.head < 0 ? base + this.head : this.head);
		put(TCB.ORIGIN, this.origin < 0 ? base + this.origin : this.origin);
		put(TCB.COUNT, this.count % base);
		put(TCB.COUNTH, Math.floor(this.count / base));
	}

	private signed(w: number): number {
		const half = (this.wmask + 1) / 2;
		return w >= half ? w - (this.wmask + 1) : w;
	}
}

export type TuringDeviceOpts = {
	/** Shared core, as the 340 has it: wire to the CPU's read and write. */
	fetch: (addr: number) => number;
	store: (addr: number, word: number) => void;
	shape?: TmShape;
	/** Transitions per backplane cycle; fractions accumulate. A transition is three core cycles, so 1/3 is honest. */
	rate?: number;
	/** Every transition, for traces and the panel. */
	onStep?: (e: TuringEngine) => void;
};

/**
 * The PDP-7 adapter: device 54, a cabinet extension on a free code (TURING-ENGINE.md has the map).
 *
 *   705401 TMSF  skip on flag (halt, undefined, fault, step)
 *   705402 TMRS  OR status into AC             705412 clear AC first
 *   705404 TMLA  AC is the TCB: load it, clear flags, run
 *   705421 TMSR  skip while running
 *   705422 TMRQ  OR the current state into AC  705432 clear AC first
 *   705424 TMGO  reload the TCB (the host may have paged), clear flags, run
 *   705441 TMSS  reload, clear flags, run one transition, raise STEP
 *   705442 TMLM  AC is the mode word: bit 17 host pages, bit 16 forget the spilled tape
 *                705452 clears it: the engine pages
 *   705444 TMST  stop and clear flags
 *
 * The flag is the interrupt request, as the 340's is: halt and fault arrive on the PDP-7's one
 * level, and the handler finds the engine on its skip chain with TMSF.
 */
export class TuringDevice implements Device {
	readonly name = "turing";
	readonly iots = [0o54];
	readonly engine: TuringEngine;
	rate: number;
	onStep: ((e: TuringEngine) => void) | undefined;
	private accum = 0;

	constructor(opts: TuringDeviceOpts) {
		this.engine = new TuringEngine({
			mem: { read: opts.fetch, write: opts.store },
			...(opts.shape ? { shape: opts.shape } : {}),
		});
		this.rate = opts.rate ?? 1;
		this.onStep = opts.onStep;
	}

	iot(req: Iot): IotReply {
		const e = this.engine;
		const sub = req.pulse & 0o60;
		let ac = req.ac;
		let skip = false;
		const clear = (req.pulse & 0o10) !== 0;
		if (sub === 0o00) {
			if (req.pulse & 0o1) skip = (e.status & TM_FLAGS) !== 0;
			if (req.pulse & 0o2) ac = (clear ? 0 : ac) | e.status;
			if (req.pulse & 0o4) {
				e.load(ac);
				e.go();
			}
		} else if (sub === 0o20) {
			if (req.pulse & 0o1) skip = e.running;
			if (req.pulse & 0o2) ac = (clear ? 0 : ac) | e.state;
			if (req.pulse & 0o4) {
				e.load(e.tcb);
				e.go();
			}
		} else if (sub === 0o40) {
			if (req.pulse & 0o2) {
				const mode = clear ? 0 : ac;
				e.hostPaging = (mode & TM_MODE_HOST) !== 0;
				if (mode & TM_MODE_FORGET) e.forget();
			}
			if (req.pulse & 0o1) {
				e.load(e.tcb);
				e.go(true);
			} else if (req.pulse & 0o4) {
				e.stop();
				e.clearFlags();
			}
		}
		return { ac, skip };
	}

	tick(): void {
		if (!this.engine.running) return;
		this.accum += this.rate;
		while (this.accum >= 1 && this.engine.running) {
			this.accum -= 1;
			this.engine.step();
			this.onStep?.(this.engine);
		}
		if (!this.engine.running) this.accum = 0;
	}

	irq(): boolean {
		return (this.engine.status & TM_FLAGS) !== 0;
	}

	reset(): void {
		this.engine.reset();
		this.engine.hostPaging = false;
		this.accum = 0;
	}
}

export type TuringCpuOpts = {
	coreWords?: number;
	shape?: TmShape;
	/** Where the control block sits. The stand-alone machine boots with it at 0. */
	tcb?: number;
};

/**
 * The engine as the whole cabinet: Minsky's "Universal Turing Machine" box. Its core holds one
 * control block, a table and a tape; `step()` is one transition. PC is the state, AC the scanned
 * symbol, and it halts when the machine does. Devices (the 340 drawing the tape) still hang off
 * the backplane and share the core; it issues no IOTs.
 */
export class TuringCpu implements Cpu {
	readonly wordBits: number;
	readonly coreWords: number;
	readonly engine: TuringEngine;
	readonly tcbAddr: number;
	irqLine = false;
	private readonly core: Uint32Array;
	private started = false;

	constructor(opts: TuringCpuOpts = {}) {
		const shape = opts.shape ?? PDP7_TM_SHAPE;
		this.wordBits = shape.wordBits;
		this.coreWords = opts.coreWords ?? 2 ** shape.addrBits;
		this.core = new Uint32Array(this.coreWords);
		this.tcbAddr = opts.tcb ?? 0;
		this.engine = new TuringEngine({ mem: { read: (a) => this.read(a), write: (a, w) => this.write(a, w) }, shape });
	}

	get pc(): number {
		return this.engine.state;
	}
	set pc(q: number) {
		this.engine.state = q;
	}
	get ac(): number {
		return Math.max(0, this.engine.scanned);
	}
	set ac(_v: number) {}

	reset(): void {
		this.core.fill(0);
		this.engine.reset();
		this.started = false;
	}

	skip(): void {}

	step(): Step {
		if (!this.started) {
			this.engine.load(this.tcbAddr);
			this.engine.go();
			this.started = true;
		}
		if (!this.engine.running) return { halt: true };
		const why = this.engine.step();
		return why ? { halt: true } : {};
	}

	read(addr: number): number {
		return this.core[addr % this.coreWords] ?? 0;
	}

	write(addr: number, word: number): void {
		this.core[addr % this.coreWords] = word % 2 ** this.wordBits;
	}

	deposit(addr: number, words: readonly number[]): void {
		for (let i = 0; i < words.length; i += 1) this.write(addr + i, words[i] ?? 0);
	}
}

import { CpuHost, type Rung } from "./cpu.js";
import type { Dim, SlotSpec } from "./korz.js";

/**
 * A Turing machine as a Korz sea: state and symbol in, a transition out.
 * The default door is no transition. A more specific slot is one rule.
 * `emit` is a second selector over the same dimensions. 0 is silent.
 *
 * The PDP-7 engine in `plugins/turing.ts` still reads a word per (state,
 * symbol). `tabulate` writes those words. `TmTape` steps the same rules with
 * no PDP-7 in the room. The engine's device IOTs stay a PDP-7 device.
 *
 * A word is the engine's layout: move in the top two bits, symbol in the next
 * four, next state in the low twelve. Move 0 means there is no transition.
 */

export const TM_DIMS: readonly Dim[] = [
	{ name: "state", width: 12 },
	{ name: "sym", width: 4 },
];

export type TmCtx = { state: number; sym: number };

export const BLANK = 0;
export const ZERO = 1;
export const ONE = 2;
/** Right, left, and stay. Move 0 is "no transition", the same encoding the PDP-7 engine reads. */
export const R = 1;
export const L = 2;
export const N = 3;

export const doorWord = (move: number, write: number, next: number): number =>
	((move & 3) << 16) | ((write & 0xf) << 12) | (next & 0xfff);

export const decodeDoor = (word: number): { move: number; write: number; next: number } =>
	({ move: (word >> 16) & 3, write: (word >> 12) & 0xf, next: word & 0xfff });

const NONE: readonly SlotSpec<TmCtx>[] = [
	{ selector: "door", by: "no transition", run: () => 0 },
	{ selector: "emit", by: "silent", run: () => 0 },
];

export class TmSea {
	readonly host: CpuHost<TmCtx, "door" | "emit", "door" | "emit">;

	constructor(slots: readonly SlotSpec<TmCtx>[], rung?: Rung) {
		this.host = new CpuHost({
			dims: TM_DIMS,
			selectors: ["door", "emit"],
			slots: [...NONE, ...slots],
			context: () => ({ state: 0, sym: 0 }),
			nests: ["door", "emit"],
			rung,
		});
	}

	door(state: number, sym: number): number {
		const c = this.host.nest.door;
		c.state = state;
		c.sym = sym;
		return this.host.go.door(c);
	}

	emit(state: number, sym: number): number {
		const c = this.host.nest.emit;
		c.state = state;
		c.sym = sym;
		return this.host.go.emit(c);
	}

	/** Words the PDP-7 engine reads. Index is `state * symbols + sym`. */
	tabulate(states: number, symbols: number): Uint32Array {
		const words = new Uint32Array(states * symbols);
		for (let q = 0; q < states; q += 1)
			for (let s = 0; s < symbols; s += 1) words[q * symbols + s] = this.door(q, s);
		return words;
	}
}

/**
 * A binary incrementer. The head starts on the first digit, in state 1.
 * Blank is 0, zero is 1, one is 2. State 0 is halt.
 */
export function binaryIncrementer(rung?: Rung): TmSea {
	return new TmSea([
		{ selector: "door", guard: { state: 1 }, by: "scan right over the digits", run: (c) => doorWord(R, c.sym, 1) },
		{ selector: "door", guard: { state: 1, sym: BLANK }, by: "past the end: turn back", run: () => doorWord(L, BLANK, 2) },
		{ selector: "door", guard: { state: 2 }, by: "0 or blank: write 1, halt", run: () => doorWord(N, ONE, 0) },
		{ selector: "door", guard: { state: 2, sym: ONE }, by: "1: write 0, carry left", run: () => doorWord(L, ZERO, 2) },
	], rung);
}

export type TmStop = "halt" | "undef";

/** An unbounded tape. A cell that was never written reads as `blank`. */
export class TmTape {
	readonly cells = new Map<number, number>();
	state: number;
	head: number;
	readonly blank: number;
	steps = 0;
	lastEmit = 0;

	constructor(readonly rule: TmSea, opts: { state?: number; head?: number; blank?: number; cells?: readonly number[] } = {}) {
		this.state = opts.state ?? 1;
		this.head = opts.head ?? 0;
		this.blank = opts.blank ?? BLANK;
		opts.cells?.forEach((sym, i) => this.cells.set(i, sym));
	}

	read(at = this.head): number {
		return this.cells.get(at) ?? this.blank;
	}

	/** One transition. `"halt"` is a transition into state 0. `"undef"` is a missing door. */
	step(): TmStop | null {
		if (this.state === 0) return "halt";
		const sym = this.read();
		const word = this.rule.door(this.state, sym);
		const door = decodeDoor(word);
		if (word === 0 || door.move === 0) return "undef";
		const ch = this.rule.emit(this.state, sym);
		if (ch !== 0) this.lastEmit = ch;
		this.cells.set(this.head, door.write);
		if (door.move === R) this.head += 1;
		else if (door.move === L) this.head -= 1;
		this.state = door.next;
		this.steps += 1;
		return this.state === 0 ? "halt" : null;
	}

	run(limit = 1000): TmStop | "limit" {
		for (let i = 0; i < limit; i += 1) {
			const stop = this.step();
			if (stop) return stop;
		}
		return "limit";
	}

	/** The written span, blanks included, as 0 and 1. Any other symbol is `?`. */
	text(): string {
		if (this.cells.size === 0) return "";
		let lo = Infinity;
		let hi = -Infinity;
		for (const at of this.cells.keys()) {
			if (at < lo) lo = at;
			if (at > hi) hi = at;
		}
		let s = "";
		for (let at = lo; at <= hi; at += 1) {
			const sym = this.read(at);
			s += sym === ZERO ? "0" : sym === ONE ? "1" : sym === BLANK ? "." : "?";
		}
		return s.replace(/^\.+|\.+$/g, "");
	}
}

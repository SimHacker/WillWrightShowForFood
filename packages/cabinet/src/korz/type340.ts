import {
	DDS,
	DJP,
	GETFIELD,
	MODE,
	type Mode,
	ST340_STOP_INT,
	ST340_LPHIT,
	ST340_STOPPED,
	TESTBIT,
	Type340,
	type Type340Opts,
	ADDR,
} from "../plugins/type340.js";
import { bits, type Dim, type Dispatchers, Sea, type SlotSpec, type WhyLine } from "./korz.js";

/**
 * The context of one display word. `mode` is the 340's mode register when the word is fetched;
 * `top` is DEC bits 0-1: escape and intensify in vector and increment mode, Y or X in point mode,
 * the jump type in subroutine mode. `d` is the display the word belongs to, so one set of slot
 * functions serves every 340.
 */
export type W340 = { d: KorzType340; mode: number; top: number; word: number; addr: number };

export const DIMS_340: readonly Dim[] = [
	{ name: "mode", width: 3, names: ["param", "point", "slave", "char", "vector", "vcont", "incr", "subr"] },
	{ name: "top", width: 2 },
];

const ESC = bits(2, 2);

/**
 * The 340's instruction set as slots on `word`: what each mode does with a word, split where a
 * bit of the word chooses what happens. A slot returns 1 when the word escapes to parameter mode.
 * The common tail (edge flags cleared, the escape back through the 347's save register) stays in
 * `Type340.instruction`, as the CPU's fetch stays in `step`.
 */
export class KorzType340 extends Type340 {
	readonly sea = new Sea<W340>(DIMS_340);
	private readonly go = {} as Dispatchers<W340, "word">;
	private readonly w: W340 = { d: this, mode: 0, top: 0, word: 0, addr: 0 };

	constructor(opts: Type340Opts & { korz?: "interpret" | "resolve" }) {
		super(opts);
		this.sea.install(KorzType340.slots);
		if (opts.korz === "interpret") this.go.word = (c) => this.sea.dispatch("word", c);
		else this.sea.bind(this.go, ["word"]);
	}

	protected override decode(inst: number, addr: number): boolean {
		const w = this.w;
		w.mode = this.mode;
		w.top = inst >>> 16;
		w.word = inst;
		w.addr = addr;
		return this.go.word(w) !== 0;
	}

	/** Which slot decodes this word in the current mode, or in `mode`, and why the others don't. */
	why(word: number, mode: Mode = this.mode): WhyLine[] {
		return this.sea.why("word", { d: this, mode, top: (word >>> 16) & 3, word, addr: 0 });
	}

	private static readonly slots: readonly SlotSpec<W340>[] = [
		{ selector: "word", guard: { mode: "param" }, by: "340 parameter: mode, pen, scale, intensity, stop", run: (c) => {
			const d = c.d;
			const i = c.word;
			d.mode = GETFIELD(i, 2, 4) as Mode;
			if (TESTBIT(i, 5)) d.lpEna = TESTBIT(i, 6);
			if (TESTBIT(i, 14)) d.intensity = GETFIELD(i, 15, 17);
			if (TESTBIT(i, 11)) d.scale = 1 << GETFIELD(i, 12, 13);
			if (TESTBIT(i, 7)) d.status |= TESTBIT(i, 8) ? ST340_STOPPED | ST340_STOP_INT : ST340_STOPPED;
			return 0;
		} },
		{ selector: "word", guard: { mode: "point" }, by: "340 point: load X", run: (c) => {
			const d = c.d;
			d.pointMode(c.word);
			d.x = GETFIELD(c.word, 8, 17);
			d.xAt = c.addr;
			d.pointDot(c.word, c.addr);
			return 0;
		} },
		{ selector: "word", guard: { mode: "point", top: bits(1, 1) }, by: "340 point: load Y", run: (c) => {
			const d = c.d;
			d.pointMode(c.word);
			d.y = GETFIELD(c.word, 8, 17);
			d.yAt = c.addr;
			d.pointDot(c.word, c.addr);
			return 0;
		} },
		{ selector: "word", guard: { mode: "slave" }, by: "340 slave: no Type 343, stop", run: (c) => {
			c.d.mode = GETFIELD(c.word, 2, 4) as Mode;
			c.d.status |= ST340_STOPPED;
			return 0;
		} },
		{ selector: "word", guard: { mode: "char" }, by: "342 three characters", run: (c) => {
			const d = c.d;
			const i = c.word;
			return d.character(GETFIELD(i, 0, 5), c.addr) || d.character(GETFIELD(i, 6, 11), c.addr) || d.character(GETFIELD(i, 12, 17), c.addr)
				? 1
				: 0;
		} },
		{ selector: "word", guard: { mode: "vector" }, by: "340 vector", run: (c) => (c.d.vectorWord(c.word, c.addr) ? 1 : 0) },
		{ selector: "word", guard: { mode: "vector", top: ESC }, by: "340 vector, escape after", run: (c) => {
			c.d.vectorWord(c.word, c.addr);
			return 1;
		} },
		{ selector: "word", guard: { mode: "vcont" }, by: "340 vector continue: repeat to the edge", run: (c) => {
			/* A zero-delta vector never reaches an edge: stop after 4096, as Type340 does. */
			const d = c.d;
			for (let guard = 4096; !d.vectorWord(c.word, c.addr);) {
				guard -= 1;
				if (d.status & ST340_LPHIT) break;
				if (guard === 0) {
					d.status |= ST340_STOPPED;
					break;
				}
			}
			return 1;
		} },
		{ selector: "word", guard: { mode: "incr" }, by: "340 four increments", run: (c) => (c.d.increments(c.word, c.addr) ? 1 : 0) },
		{ selector: "word", guard: { mode: "incr", top: ESC }, by: "340 four increments, escape after", run: (c) => {
			c.d.increments(c.word, c.addr);
			return 1;
		} },
		{ selector: "word", guard: { mode: "subr", top: 0 }, by: "cabinet DTG: tag what follows (not DEC's)", run: (c) => {
			c.d.mode = GETFIELD(c.word, 2, 4) as Mode;
			c.d.tag = GETFIELD(c.word, 5, 17);
			return 0;
		} },
		{ selector: "word", guard: { mode: "subr", top: 1 }, by: "347 DDS: deposit a jump back, start a lightbutton", run: (c) => {
			/* PIXIE's pen dispatch reads the deposited DJP; the lightbutton falls through, so no return. */
			const d = c.d;
			d.mode = GETFIELD(c.word, 2, 4) as Mode;
			d.store(GETFIELD(c.word, 5, 17), (DJP << 16) | d.asr);
			d.saveFF = false;
			d.subr = d.asr;
			d.ddsBlock = true;
			return 0;
		} },
		{ selector: "word", guard: { mode: "subr", top: 2 }, by: "347 DJP: jump", run: (c) => {
			const d = c.d;
			d.mode = GETFIELD(c.word, 2, 4) as Mode;
			d.dac = GETFIELD(c.word, 5, 17) & ADDR;
			d.block = d.dac;
			return 0;
		} },
		{ selector: "word", guard: { mode: "subr", top: 3 }, by: "347 DJS: jump and save", run: (c) => {
			const d = c.d;
			const target = GETFIELD(c.word, 5, 17);
			d.mode = GETFIELD(c.word, 2, 4) as Mode;
			d.asr = d.dac;
			d.savedTag = d.tag;
			d.saveFF = true;
			d.subr = target;
			d.dac = target & ADDR;
			d.block = d.dac;
			return 0;
		} },
	];

	private pointMode(i: number): void {
		this.mode = GETFIELD(i, 2, 4) as Mode;
		if (TESTBIT(i, 5)) this.lpEna = TESTBIT(i, 6);
	}

	private pointDot(i: number, addr: number): void {
		if (TESTBIT(i, 7)) this.emit(this.x, this.y, this.x, this.y, true, "point", addr);
	}

	private vectorWord(i: number, addr: number): boolean {
		return this.vector(TESTBIT(i, 1), TESTBIT(i, 2), GETFIELD(i, 3, 9), TESTBIT(i, 10), GETFIELD(i, 11, 17), addr);
	}

	private increments(i: number, addr: number): boolean {
		const on = TESTBIT(i, 1);
		return (
			this.ipoint(on, GETFIELD(i, 2, 5), addr) ||
			this.ipoint(on, GETFIELD(i, 6, 9), addr) ||
			this.ipoint(on, GETFIELD(i, 10, 13), addr) ||
			this.ipoint(on, GETFIELD(i, 14, 17), addr)
		);
	}
}

export { DDS, MODE };

import { MOVE, PDP7_TM_SHAPE, TCB, TuringEngine, type MemoryPort, type StopReason, type TmShape } from "./plugins/turing.js";

/**
 * Turing machine programs in the engine's memory format, independent of where they came from:
 * TM-Forth (tmforth.ts), Cherniak's TM* files from the PCOMP disk (`parseTmStar`), or Minsky's
 * TECO rows. TURING-ENGINE.md is the design.
 *
 * A program is its alphabet and a table of transition entries, row 0 (the halt state) all zero:
 *
 *   entry = [move:2][write:symBits][next:rest]     move 0 = no door, 1 R, 2 L, 3 N
 */

export type TmTape = {
	/** Symbol indices; 0 is the blank. */
	cells: number[];
	/** Absolute index of cells[0]. */
	origin: number;
	/** Absolute index of the scanned cell. */
	head: number;
};

export type TmProgram = {
	name: string;
	/** Symbol names; symbols[0] is the blank. */
	symbols: string[];
	/** Cell codes for the host's character set (Type 342 codes on a PDP-7), or null: codes are indices. */
	codes: number[] | null;
	/** State names by number; states[0] is "halt". */
	states: string[];
	start: number;
	/** states.length * symbols.length entries, row-major by state. */
	table: number[];
	shape: TmShape;
	tape: TmTape | null;
	/** Whole-program notes, in order (TM* comment rows, TM-Forth `note"`). */
	notes: string[];
};

export type TmMove = "R" | "L" | "N";

export type TmTransition = { state: number; read: number; write: number; move: TmMove; next: number };

const MOVE_NAMES: readonly (TmMove | null)[] = [null, "R", "L", "N"];

export function qbits(shape: TmShape): number {
	return shape.wordBits - 2 - shape.symBits;
}

export function encodeEntry(shape: TmShape, move: TmMove, write: number, next: number): number {
	const q = qbits(shape);
	if (write < 0 || write >= 2 ** shape.symBits) throw new Error(`symbol ${write} does not fit in ${shape.symBits} bits`);
	if (next < 0 || next >= 2 ** q) throw new Error(`state ${next} does not fit in ${q} bits`);
	const m = move === "R" ? MOVE.R : move === "L" ? MOVE.L : MOVE.N;
	return m * 2 ** (shape.wordBits - 2) + write * 2 ** q + next;
}

export function decodeEntry(shape: TmShape, entry: number): { move: TmMove; write: number; next: number } | null {
	const q = qbits(shape);
	const move = MOVE_NAMES[Math.floor(entry / 2 ** (shape.wordBits - 2)) & 3] ?? null;
	if (!move) return null;
	return { move, write: Math.floor(entry / 2 ** q) % 2 ** shape.symBits, next: entry % 2 ** q };
}

/** Every door in the table, in state then symbol order. */
export function transitions(p: TmProgram): TmTransition[] {
	const n = p.symbols.length;
	const out: TmTransition[] = [];
	for (let state = 0; state < p.states.length; state += 1)
		for (let read = 0; read < n; read += 1) {
			const d = decodeEntry(p.shape, p.table[state * n + read] ?? 0);
			if (d) out.push({ state, read, ...d });
		}
	return out;
}

/**
 * The same machine, up to the order of the alphabet: every state number reads, writes, moves and
 * goes the same, by symbol name. Returns the first difference, or null.
 */
export function tmDiff(a: TmProgram, b: TmProgram): string | null {
	if (a.start !== b.start) return `start ${a.start} vs ${b.start}`;
	if (a.symbols[0] !== b.symbols[0]) return `blank ${a.symbols[0]} vs ${b.symbols[0]}`;
	const doors = (p: TmProgram) => {
		const m = new Map<string, string>();
		for (const t of transitions(p))
			m.set(`${t.state} ${p.symbols[t.read]}`, `${p.symbols[t.write]} ${t.move} ${t.next}`);
		return m;
	};
	const da = doors(a);
	const db = doors(b);
	for (const [k, v] of da) if (db.get(k) !== v) return `${k}: ${v} vs ${db.get(k) ?? "no door"}`;
	for (const [k, v] of db) if (!da.has(k)) return `${k}: no door vs ${v}`;
	return null;
}

/* ---------- tapes as text ---------- */

/** "000^0111": one character a cell, `^` before the scanned cell, as TM*'s .INP files have it. */
export function parseTapeText(symbols: readonly string[], text: string, origin = 0): TmTape {
	const cells: number[] = [];
	let head = origin;
	for (const ch of text) {
		if (ch === "^") {
			head = origin + cells.length;
			continue;
		}
		const s = symbols.indexOf(ch);
		if (s < 0) throw new Error(`tape symbol ${JSON.stringify(ch)} is not in the alphabet ${symbols.join(" ")}`);
		cells.push(s);
	}
	return { cells, origin, head };
}

export function tapeText(symbols: readonly string[], tape: TmTape, opts: { trim?: boolean; caret?: boolean } = {}): string {
	let lo = 0;
	let hi = tape.cells.length;
	if (opts.trim) {
		while (lo < hi && tape.cells[lo] === 0) lo += 1;
		while (hi > lo && tape.cells[hi - 1] === 0) hi -= 1;
	}
	let s = "";
	for (let i = lo; i < hi; i += 1) {
		if (opts.caret && tape.origin + i === tape.head) s += "^";
		s += symbols[tape.cells[i]!] ?? "?";
	}
	return s;
}

/* ---------- Cherniak's TM* (PCOMP, UMD 1990) ---------- */

export type TmStarFile = {
	program: string;
	initial: number;
	rows: { state: number; inp: string; out: string; mov: TmMove; next: number; comment: string }[];
	/** Comment rows, which TM* keeps on states with no transitions. */
	notes: { state: number; text: string }[];
};

/** A TM* "---TM State Table---" file, as saved by TM*: `CST INP  OUT MOV NST - comment`. */
export function parseTmStarFile(text: string): TmStarFile {
	const lines = text.replace(/\r/g, "").split("\n");
	const out: TmStarFile = { program: "", initial: 1, rows: [], notes: [] };
	let i = 0;
	for (; i < lines.length; i += 1) {
		const line = lines[i]!;
		const prog = /^Program:\s*"([^"]*)"/.exec(line);
		if (prog) out.program = prog[1]!;
		if (/^INITIAL STATE:/.test(line)) out.initial = Number(lines[i + 1]?.trim() ?? "1");
		if (/^STATE TABLE:/.test(line)) break;
	}
	for (i += 1; i < lines.length; i += 1) {
		const line = lines[i]!;
		if (!line.trim()) continue;
		const m = /^\s*(\d+)\s+(\S)\s+(\S)\s+([LRN])\s+(\d+)\s*(?:-\s?(.*))?$/.exec(line);
		if (m) {
			out.rows.push({
				state: Number(m[1]),
				inp: m[2]!,
				out: m[3]!,
				mov: m[4] as TmMove,
				next: Number(m[5]),
				comment: (m[6] ?? "").trimEnd(),
			});
			continue;
		}
		const c = /^\s*(\d+)\s+-\s?(.*)$/.exec(line);
		if (c) out.notes.push({ state: Number(c[1]), text: c[2]!.trimEnd() });
		else throw new Error(`TM* line ${i + 1}: ${JSON.stringify(line)}`);
	}
	return out;
}

/** A TM* "---Initial Tape---" file: the tape, `^` before the scanned cell, then a description. */
export function parseTmStarTape(text: string): { tape: string; description: string } {
	const lines = text.replace(/\r/g, "").split("\n");
	const at = lines.findIndex((l) => /^---Initial Tape---/.test(l));
	if (at < 0) throw new Error("not a TM* tape: no ---Initial Tape--- line");
	return { tape: (lines[at + 1] ?? "").trim(), description: lines.slice(at + 2).join("\n").trim() };
}

/* ---------- disassembly ---------- */

/** As TM* would save it, one row a door, `?` rows not reconstructed. */
export function disasmTmStar(p: TmProgram): string {
	const rows = transitions(p).map(
		(t) =>
			`${String(t.state).padStart(3)} ${p.symbols[t.read]}   ${p.symbols[t.write]} ${t.move} ${String(t.next).padStart(2)}`,
	);
	return [`---TM State Table---`, `Program: "${p.name}"`, `INITIAL STATE:`, `${p.start}`, `STATE TABLE:`, ...rows].join("\n");
}

/** Minsky's TECO rows (`y0L1` groups), when every symbol and state number is one character. */
export function disasmTeco(p: TmProgram): string {
	const n = p.symbols.length;
	const lines: string[] = [];
	for (let q = 1; q < p.states.length; q += 1) {
		const groups: string[] = [];
		for (let s = 0; s < n; s += 1) {
			const d = decodeEntry(p.shape, p.table[q * n + s] ?? 0);
			groups.push(d ? `${p.symbols[s]}${p.symbols[d.write]}${d.move}${d.next}` : `${p.symbols[s]}---`);
		}
		lines.push(`q${q}: ${groups.join(" ")}`);
	}
	return lines.join("\n");
}

/** TM-Forth source that compiles back to the same table: one `state:` with a `case` per state. */
export function disasmForth(p: TmProgram): string {
	const name = (q: number) => (q === 0 ? "halt" : p.states[q]!);
	const out = [`tm: ${p.name.replace(/\s+/g, "-")}`, `symbols: ${p.symbols.join(" ")} ;`];
	if (p.codes) out.push(`octal codes: ${p.codes.map((c) => c.toString(8)).join(" ")} ; decimal`);
	out.push(`states: ${p.states.slice(1).join(" ")} ;`);
	const n = p.symbols.length;
	for (let q = 1; q < p.states.length; q += 1) {
		const body: string[] = [];
		for (let s = 0; s < n; s += 1) {
			const d = decodeEntry(p.shape, p.table[q * n + s] ?? 0);
			if (!d) continue;
			const acts: string[] = [];
			if (d.write !== s) acts.push(`${p.symbols[d.write]} write`);
			acts.push(d.move === "R" ? "right" : d.move === "L" ? "left" : "stay");
			if (d.next !== q) acts.push(`${name(d.next)} goto`);
			body.push(`  ${p.symbols[s]} of ${acts.join(" ")} endof`);
		}
		out.push(`state: ${p.states[q]} case`, ...body, `  undefined endcase ;`);
	}
	out.push(`${name(p.start)} start`);
	if (p.tape) out.push(`tape: ${tapeText(p.symbols, p.tape, { caret: true })}`);
	out.push("end-tm");
	return out.join("\n");
}

/* ---------- laying a program into memory ---------- */

/** Cell codes packed into host words, high end first, as the engine reads them. The last word is padded with `pad`. */
export function packCells(shape: TmShape, codes: readonly number[], pad = 0): number[] {
	const cpw = Math.floor(shape.wordBits / shape.cellBits);
	const out: number[] = [];
	for (let w = 0; w * cpw < codes.length; w += 1) {
		let word = 0;
		for (let k = 0; k < cpw; k += 1) word += (codes[w * cpw + k] ?? pad) * 2 ** (shape.wordBits - shape.cellBits * (k + 1));
		out.push(word);
	}
	return out;
}

/** The inverse of packCells: `n` cell codes from words. */
export function unpackCells(shape: TmShape, words: readonly number[], n = words.length * Math.floor(shape.wordBits / shape.cellBits)): number[] {
	const cpw = Math.floor(shape.wordBits / shape.cellBits);
	const out: number[] = [];
	for (let i = 0; i < n; i += 1) {
		const word = words[Math.floor(i / cpw)] ?? 0;
		out.push(Math.floor(word / 2 ** (shape.wordBits - shape.cellBits * ((i % cpw) + 1))) % 2 ** shape.cellBits);
	}
	return out;
}

export type TmLayoutOpts = {
	/** Control block address. */
	tcb?: number;
	/** Table address; default right after the TCB (and the alphabet, if any). */
	table?: number;
	alpha?: number;
	window?: number;
	/** Window length in cells; default the tape plus slack, whole words. */
	wlen?: number;
	/** Tape to load; default the program's own, else a blank tape with the head at 0. */
	tape?: TmTape;
	/** Window cells left of the head when the tape does not fix it; default a quarter of the window. */
	lead?: number;
};

export type TmLayout = {
	tcb: number;
	table: number;
	alpha: number;
	window: number;
	wlen: number;
	/** Absolute index of window cell 0. */
	origin: number;
	/** Blocks of words to deposit. */
	blocks: { addr: number; words: number[] }[];
	/** Tape cells that do not fit the window, for the spill (as cell codes). */
	spill: { start: number; codes: number[] }[];
	/** The address one past everything laid out. */
	end: number;
};

/** The words to deposit: TCB, alphabet, table and a tape window, in the host's memory shape. */
export function layoutTm(p: TmProgram, opts: TmLayoutOpts = {}): TmLayout {
	const shape = p.shape;
	const cpw = Math.floor(shape.wordBits / shape.cellBits);
	const tape = opts.tape ?? p.tape ?? { cells: [], origin: 0, head: 0 };
	const want = opts.wlen ?? Math.max(48, tape.cells.length + 24);
	const wlen = Math.ceil(want / cpw) * cpw;
	const tcb = opts.tcb ?? 0o100;
	const alpha = p.codes ? (opts.alpha ?? tcb + TCB.SIZE) : 0;
	const table = opts.table ?? (p.codes ? alpha + p.codes.length : tcb + TCB.SIZE);
	const tableWords = p.states.length * p.symbols.length;
	const window = opts.window ?? table + tableWords;
	const lead = Math.min(wlen - 1, opts.lead ?? Math.floor(wlen / 4));
	// Window over the start of the tape if the head is there; else centered-ish on the head.
	let origin = tape.cells.length && tape.head >= tape.origin && tape.head - tape.origin < wlen ? tape.origin : tape.head - lead;
	if (tape.head < origin || tape.head >= origin + wlen) origin = tape.head - lead;
	const code = (s: number) => (p.codes ? p.codes[s]! : s);
	const cells = new Array<number>(wlen).fill(code(0));
	const spill: TmLayout["spill"] = [];
	let run: { start: number; codes: number[] } | null = null;
	tape.cells.forEach((s, i) => {
		const abs = tape.origin + i;
		if (abs >= origin && abs < origin + wlen) cells[abs - origin] = code(s);
		else {
			if (!run || run.start + run.codes.length !== abs) spill.push((run = { start: abs, codes: [] }));
			run.codes.push(code(s));
		}
	});
	const wmask = 2 ** shape.wordBits;
	const winWords = packCells(shape, cells);
	const signed = (v: number) => (v < 0 ? wmask + v : v);
	const tcbWords = new Array<number>(TCB.SIZE).fill(0);
	tcbWords[TCB.STATE] = p.start;
	tcbWords[TCB.HEAD] = signed(tape.head - origin);
	tcbWords[TCB.ORIGIN] = signed(origin);
	tcbWords[TCB.WINDOW] = window;
	tcbWords[TCB.WLEN] = wlen;
	tcbWords[TCB.TABLE] = table;
	tcbWords[TCB.NSYM] = p.symbols.length;
	tcbWords[TCB.ALPHA] = alpha;
	const blocks = [{ addr: tcb, words: tcbWords }];
	if (p.codes) blocks.push({ addr: alpha, words: [...p.codes] });
	blocks.push({ addr: table, words: [...p.table] });
	blocks.push({ addr: window, words: winWords });
	const end = Math.max(...blocks.map((b) => b.addr + b.words.length));
	return { tcb, table, alpha, window, wlen, origin, blocks, spill, end };
}

/* ---------- running one, with no host around it ---------- */

export type TmRunOpts = TmLayoutOpts & {
	/** Stop after this many transitions; default 10 million. */
	maxSteps?: number;
	/** TM*'s finite tape: stop with "bounds" when the head leaves [lo, hi]. */
	bounds?: [number, number];
	/** Memory words; default enough for the layout. */
	coreWords?: number;
};

export type TmRunResult = {
	reason: StopReason | "bounds" | "limit";
	steps: number;
	/** The whole tape, spill and window, as symbol indices. */
	tape: TmTape;
	state: number;
	/** The symbol under the head at the end. */
	scanned: string;
	/** The non-blank stretch of tape, one character a symbol. */
	pictured: string;
	pages: number;
	engine: TuringEngine;
	mem: Uint32Array;
};

/** Lay the program into a private memory and run it on the engine, paging automatically. */
export function runTm(p: TmProgram, opts: TmRunOpts = {}): TmRunResult {
	const lay = layoutTm(p, opts);
	const words = opts.coreWords ?? Math.max(lay.end, 2 ** 10);
	const mem = new Uint32Array(words);
	for (const b of lay.blocks) mem.set(b.words, b.addr);
	const port: MemoryPort = { read: (a) => mem[a] ?? 0, write: (a, w) => void (mem[a] = w) };
	const engine = new TuringEngine({ mem: port, shape: p.shape });
	engine.load(lay.tcb);
	engine.spill.blank = engine.code(0);
	for (const r of lay.spill) engine.spill.store(r.start, r.codes);
	engine.go();
	const max = opts.maxSteps ?? 10_000_000;
	const [lo, hi] = opts.bounds ?? [-Infinity, Infinity];
	let reason: TmRunResult["reason"] = "limit";
	while (engine.count < max) {
		const why = engine.step();
		const at = engine.origin + engine.head;
		if (at < lo || at > hi) {
			reason = "bounds";
			break;
		}
		if (why) {
			reason = why;
			break;
		}
	}
	const snap = engine.snapshot();
	const tape: TmTape = { cells: snap.cells.map((c) => Math.max(0, c)), origin: snap.origin, head: snap.head };
	const under = tape.cells[tape.head - tape.origin] ?? 0;
	return {
		reason,
		steps: engine.count,
		tape,
		state: engine.state,
		scanned: p.symbols[under]!,
		pictured: tapeText(p.symbols, tape, { trim: true }),
		pages: engine.pages,
		engine,
		mem,
	};
}

export { PDP7_TM_SHAPE };

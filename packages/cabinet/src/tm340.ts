/**
 * Turing machines for turing.fs, the PDP-7 Forth view of the engine on the 340.
 *
 * TM-Forth compiles on the host (tmforth.ts), so the PDP-7 gets each machine as data: a Forth
 * record of numbers it can lay into the engine's control block without parsing anything, and a
 * word that loads it. `pdp7TmDeck` writes that Forth source; tapes/pdp7forth/pcomp-tm.fs is its
 * output for the PCOMP machines (tm340.test.ts keeps it up to date).
 *
 * A record, in words from its address (turing.fs reads it with R@@):
 *
 *   +0 NSYM     +1 NSTATES   +2 START     +3 ORIGIN (signed, of window cell 0)
 *   +4 WOFF     +5 NWORDS    +6 BLANK3    +7 SPEED     +8 FRAMES
 *   +9          NSYM alphabet codes (Type 342), the engine's ALPHA
 *               NSTATES*NSYM transition entries, the engine's TABLE
 *               NWORDS packed tape words, for window words WOFF..
 *               strings: the machine's name, its note, each state's name
 *
 * BLANK3 is the blank symbol three to a word, to clear the window with. SPEED is transitions a
 * frame for the demo (0: let the engine run free) and FRAMES how many frames it gets. A string
 * is its length and then the 342's codes three to a word, ending in its ESC (packed342): the
 * 340 draws it with a DJS, and it takes a third of the core a character a word would.
 */
import { PDP7_TM_SHAPE } from "./plugins/turing.js";
import { packCells, runTm, type TmProgram } from "./tm.js";

/** turing.fs's window: 128 words, 384 cells, the head starting in the middle. */
export const TM340_WINDOW_WORDS = 128;
export const TM340_HOME = 192;
const RECORD_HEADER = 9;

/** The head of tapes/pdp7forth/pcomp-tm.fs. */
export const PCOMP_TM_HEADER = [
	"The PCOMP machines (tapes/turing/pcomp.tmf) for turing.fs, written by",
	"pdp7TmDeck in src/tm340.ts: do not edit, UPDATE=1 npm test rewrites it.",
	"Each record is numbers the engine reads as they are; tm340.ts has the",
	"layout. Typing a machine's name loads it; RUN runs it.",
];

export type Pdp7TmDeckOpts = {
	/** Dropped from the front of each program's name to make its Forth word: "pcomp-". */
	prefix?: string;
	/** What the demo aims to show of a machine that halts: about this many frames. */
	frames?: number;
	/** Machines that run longer than this many transitions run free in the demo. */
	freeAfter?: number;
	/** Frames the demo gives a machine that runs free. */
	freeFrames?: number;
	/** The Forth variable that gets the catalog's address. */
	catalog?: string;
	/** Comment lines for the head of the file. */
	header?: string[];
};

/** The Type 342 code for a one-character symbol name, for a symbol the 342 can draw. */
export function char342(name: string): number {
	if (name.length !== 1) throw new Error(`symbol "${name}" is not one character`);
	let c = name.toUpperCase().charCodeAt(0);
	if (c >= 64 && c < 96) c -= 64;
	if (!((c >= 1 && c <= 26) || (c >= 32 && c < 64))) throw new Error(`symbol "${name}" has no Type 342 character`);
	return c;
}

/**
 * A string as the 342 draws it: its length, then three codes a word ending in the 342's ESC
 * (37), so the 340 can DJS to it in character mode and come back. Upper case only.
 */
export function packed342(s: string): number[] {
	const codes = [...s.toUpperCase()].map((ch) => {
		const c = ch.charCodeAt(0);
		return c >= 64 && c < 91 ? c - 64 : c >= 32 && c < 64 ? c : 0o77;
	});
	return [codes.length, ...packCells(PDP7_TM_SHAPE, [...codes, 0o37], 0)];
}

/** The first sentence of the program's first note, to caption it on the tube: 80 characters at most. */
function caption(p: TmProgram): string {
	const note = (p.notes[0] ?? "")
		.replace(/\s+/g, " ")
		.replace(/^[\w-]+\.TM( \(.*?\))?: /i, "")
		.trim();
	const first = note.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() ?? note;
	return first.length <= 80 ? first : `${first.slice(0, 77)}...`;
}

/** turing.fs reads 80 characters a line; comments are cut short of that. */
const clip = (line: string) => (line.length <= 76 ? line : `${line.slice(0, 73)}...`);

/** The record's words for one program; throws if it does not fit turing.fs. */
export function tm340Record(p: TmProgram, speed: number, frames: number, title = p.name): number[] {
	const s = p.shape;
	if (s.wordBits !== PDP7_TM_SHAPE.wordBits || s.cellBits !== PDP7_TM_SHAPE.cellBits || s.symBits !== PDP7_TM_SHAPE.symBits)
		throw new Error(`${p.name}: not in the PDP-7 shape`);
	const codes = p.symbols.map(char342);
	const tape = p.tape ?? { cells: [], origin: 0, head: 0 };
	const h = tape.head - tape.origin;
	const start = TM340_HOME - h;
	const end = start + tape.cells.length;
	if (start < 0 || end > TM340_WINDOW_WORDS * 3) throw new Error(`${p.name}: the tape does not fit the window`);
	const aligned = Math.floor(start / 3) * 3;
	const cells = [...new Array<number>(start - aligned).fill(codes[0]!), ...tape.cells.map((c) => codes[c]!)];
	const words = packCells(s, cells, codes[0]!);
	const signed = (v: number) => (v < 0 ? 2 ** 18 + v : v);
	return [
		codes.length,
		p.states.length,
		p.start,
		signed(tape.head - TM340_HOME),
		aligned / 3,
		words.length,
		packCells(s, [codes[0]!, codes[0]!, codes[0]!])[0]!,
		speed,
		frames,
		...codes,
		...p.table,
		...words,
		...packed342(title),
		...packed342(caption(p)),
		...p.states.flatMap((q) => packed342(q)),
	];
}

/** Forth for turing.fs: a record and a loader word for each program, and the catalog the demo walks. */
export function pdp7TmDeck(programs: readonly TmProgram[], opts: Pdp7TmDeckOpts = {}): string {
	const prefix = opts.prefix ?? "";
	const aim = opts.frames ?? 100;
	const freeAfter = opts.freeAfter ?? 100_000;
	const freeFrames = opts.freeFrames ?? 150;
	const out: string[] = [...(opts.header ?? []).map((l) => (l ? `\\ ${l}` : "\\")), "", "decimal", ""];
	const recs: string[] = [];
	for (const p of programs) {
		const word = (p.name.startsWith(prefix) ? p.name.slice(prefix.length) : p.name).toLowerCase();
		if (!/^[a-z0-9-]+$/.test(word)) throw new Error(`${p.name}: "${word}" is no Forth name here`);
		const run = runTm(p, { maxSteps: freeAfter });
		const halts = run.reason === "halt" || run.reason === "undef";
		const speed = halts ? Math.max(1, Math.ceil(run.steps / aim)) : 0;
		const frames = halts ? Math.ceil(run.steps / speed) + 2 : freeFrames;
		const rec = `tm-${word}`;
		const words = tm340Record(p, speed, frames, word);
		const nsym = p.symbols.length;
		const at = RECORD_HEADER + nsym;
		out.push(clip(`\\ ${word.toUpperCase()}: ${caption(p)}`));
		out.push(clip(`\\ ${p.states.length} states, ${nsym} symbols (${p.symbols.join(" ")}); ${halts ? `halts after ${run.steps} steps` : "runs free"}.`));
		out.push(`create ${rec}`);
		// Words a line, as many as fit, the first line labelled.
		const chunk = (label: string, ws: number[]) => {
			let line = "";
			let first = true;
			const flush = () => {
				if (!line) return;
				const tag = first ? `  \\ ${label}` : "";
				out.push(`${line}${line.length + tag.length <= 76 ? tag : ""}`);
				line = "";
				first = false;
			};
			for (const w of ws) {
				const item = `${line ? " " : "  "}${w} ,`;
				if (line.length + item.length > 64) flush();
				line += line ? ` ${w} ,` : `  ${w} ,`;
			}
			flush();
		};
		const tw = words[5]!;
		chunk("header", words.slice(0, RECORD_HEADER));
		chunk("alphabet", words.slice(RECORD_HEADER, at));
		chunk("table", words.slice(at, at + p.table.length));
		chunk("tape", words.slice(at + p.table.length, at + p.table.length + tw));
		chunk("names and notes, 342 codes", words.slice(at + p.table.length + tw));
		out.push(`: ${word} ( -- ) ${rec} (load) ;`, "");
		recs.push(rec);
	}
	const cat = opts.catalog ?? "catalog";
	out.push("\\ The catalog DEMO and MACHINES walk, ended by 0.");
	out.push("create tm-catalog");
	for (let i = 0; i < recs.length; i += 4) out.push(`  ${recs.slice(i, i + 4).map((r) => `${r} ,`).join(" ")}`);
	out.push("  0 ,");
	out.push(`tm-catalog ${cat} !`, "");
	return out.join("\n");
}

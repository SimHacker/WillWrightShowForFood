import type { AsmResult } from "./asm.js";

/**
 * A program's source, lined up with core. `lines` is the source as
 * written, comments included; `line` maps an address to the line that
 * assembled it, and `word` to what the assembler put there, so a view can
 * tell where core no longer holds what the source says (patches,
 * self-modification, variables, JMS return addresses).
 */
export type SourceLine = { addr: number | null; word: number | null; text: string };
export type SourceMap = { lines: SourceLine[]; line: Map<number, number>; word: Map<number, number> };

function index(lines: SourceLine[]): SourceMap {
	const line = new Map<number, number>();
	const word = new Map<number, number>();
	lines.forEach((l, i) => {
		if (l.addr === null || line.has(l.addr)) return;
		line.set(l.addr, i);
		if (l.word !== null) word.set(l.addr, l.word);
	});
	return { lines, line, word };
}

/** From our assembler: every tape line, with a header line at each tape. */
export function sourceFromAsm(result: AsmResult): SourceMap {
	const lines: SourceLine[] = [];
	let tape = "";
	for (const l of result.listing) {
		if (l.tape !== tape) {
			tape = l.tape;
			lines.push({ addr: null, word: null, text: `/ ${tape}` });
		}
		lines.push({ addr: l.addr, word: l.word, text: l.source });
	}
	for (const lit of result.literals) lines.push({ addr: lit.addr, word: lit.word, text: `(${lit.text}` });
	for (const v of result.variables) lines.push({ addr: v.addr, word: null, text: `${v.name}, (variable)` });
	return index(lines);
}

const CODE = /^\s*\d+\s+([0-7]+)\/\s*([0-7]+)/;
const NUMBERED = /^\s*\d+(?:\s|$)/;

/**
 * From a 1972 Cambridge listing (symelec-listing.txt): `seq addr/ word
 * source`. The sequence number goes; page headers and the symbol table
 * stay, as printed.
 */
export function sourceFromListing(text: string): SourceMap {
	const lines: SourceLine[] = [];
	for (const raw of text.split("\n")) {
		const m = raw.match(CODE);
		if (m) {
			const slash = raw.indexOf("/");
			lines.push({ addr: Number.parseInt(m[1] as string, 8), word: Number.parseInt(m[2] as string, 8), text: raw.slice(slash + 8).replace(/^ {1,2}/, "").trimEnd() });
		} else if (NUMBERED.test(raw)) lines.push({ addr: null, word: null, text: raw.slice(22).trimEnd() });
		else lines.push({ addr: null, word: null, text: raw.trimEnd() });
	}
	return index(lines);
}

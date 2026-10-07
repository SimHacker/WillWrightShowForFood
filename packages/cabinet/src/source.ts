import type { AsmResult } from "./asm.js";

/**
 * A program's source, lined up with core. `lines` is the source as
 * written, comments included; `line` maps an address to the line that
 * assembled it, and `word` to what the assembler put there, so a view can
 * tell where core no longer holds what the source says (patches,
 * self-modification, variables, JMS return addresses).
 *
 * One image can have several maps over the same words (the 1972 listing, its
 * Cambridge source, the generated as7). Core addresses are what links them;
 * `meta` says what each one is. The general model is DESIGN.md, "Source maps
 * as transclusion".
 */
export type SourceKind = "listing" | "source" | "translation" | "intermediate" | "doc";

export type SourceMeta = {
	/** Stable within a program: the applet remembers the choice by it. */
	id: string;
	label: string;
	kind: SourceKind;
	/** The language the lines are in: `cambridge`, `dec`, `as7`, `forth`. */
	dialect?: string;
	/** Where the text comes from, for people. */
	origin?: string;
	/** A scan's page image, by page number; lines with a `page` link to it. */
	scanUrl?: (page: number) => string;
};

export type SourceLine = {
	addr: number | null;
	word: number | null;
	text: string;
	/** File and 1-based line, where the source came from tapes. */
	file?: string;
	line?: number;
	/** Page of the original scan the line was printed on. */
	page?: number;
};
export type SourceMap = { meta: SourceMeta; lines: SourceLine[]; line: Map<number, number>; word: Map<number, number> };

const DEFAULT_META: SourceMeta = { id: "source", label: "source", kind: "source" };

function index(lines: SourceLine[], meta: SourceMeta = DEFAULT_META): SourceMap {
	const line = new Map<number, number>();
	const word = new Map<number, number>();
	lines.forEach((l, i) => {
		if (l.addr === null || line.has(l.addr)) return;
		line.set(l.addr, i);
		if (l.word !== null) word.set(l.addr, l.word);
	});
	return { meta, lines, line, word };
}

const SCAN_PAGE = /----\s*scan page\s+(\d+)\s*----/;

/** From our assembler: every tape line, with a header line at each tape. `scan page N` comments set `page`. */
export function sourceFromAsm(result: AsmResult, meta: SourceMeta = DEFAULT_META): SourceMap {
	const lines: SourceLine[] = [];
	let tape = "";
	let page: number | undefined;
	for (const l of result.listing) {
		if (l.tape !== tape) {
			tape = l.tape;
			page = undefined;
			lines.push({ addr: null, word: null, text: `/ ${tape}` });
		}
		const p = l.source.match(SCAN_PAGE);
		if (p) page = Number(p[1]);
		lines.push({ addr: l.addr, word: l.word, text: l.source, file: l.tape, line: l.line, ...(page === undefined ? {} : { page }) });
	}
	for (const lit of result.literals) lines.push({ addr: lit.addr, word: lit.word, text: `(${lit.text}` });
	for (const v of result.variables) lines.push({ addr: v.addr, word: null, text: `${v.name}, (variable)` });
	return index(lines, meta);
}

// `addr/ word`, but not an origin line, which prints the address twice: `451/   451/`.
const CODE = /^\s*\d+\s+([0-7]+)\/\s*([0-7]+)(?![0-7/])/;
const NUMBERED = /^\s*\d+(?:\s|$)/;

/**
 * From a 1972 Cambridge listing (symelec-listing.txt): `seq addr/ word
 * source`. The sequence number goes; page headers and the symbol table
 * stay, as printed.
 */
export function sourceFromListing(text: string, meta: SourceMeta = { id: "listing", label: "listing", kind: "listing" }): SourceMap {
	const lines: SourceLine[] = [];
	let page: number | undefined;
	text.split("\n").forEach((raw, n) => {
		const header = raw.match(/\bPAGE\s+(\d+)\s*$/);
		if (header) page = Number(header[1]);
		const at = { line: n + 1, ...(page === undefined ? {} : { page }) };
		const m = raw.match(CODE);
		if (m) {
			const slash = raw.indexOf("/");
			lines.push({ addr: Number.parseInt(m[1] as string, 8), word: Number.parseInt(m[2] as string, 8), text: raw.slice(slash + 8).replace(/^ {1,2}/, "").trimEnd(), ...at });
		} else if (NUMBERED.test(raw)) lines.push({ addr: null, word: null, text: raw.slice(22).trimEnd(), ...at });
		else lines.push({ addr: null, word: null, text: raw.trimEnd(), ...at });
	});
	return index(lines, meta);
}

/** Every map's line for one address, in the order given, for showing them side by side. */
export function linesAt(maps: readonly SourceMap[], addr: number): Array<{ meta: SourceMeta; line: SourceLine | null }> {
	return maps.map((m) => {
		const i = m.line.get(addr);
		return { meta: m.meta, line: i === undefined ? null : (m.lines[i] ?? null) };
	});
}

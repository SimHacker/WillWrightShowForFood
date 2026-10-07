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
	/** Where on the scan, from a scan map (scripts/scanmap.py): the page image and the line's rectangles on it. */
	scan?: ScanPlace;
};

/** A line's place on a scanned page, in the image's pixels, top-left origin. `ink`: measured, not predicted. */
export type ScanRect = { x: number; y: number; w: number; h: number; ink: boolean };
export type ScanPlace = { url: string; width: number; height: number; rects: ScanRect[] };

/** scanmap.py's `<name>-lines.json`: listing file line -> rectangles `[x, y, w, h, ink]`. */
export type ScanLines = { page_offset: number; pages: Record<string, [number, number]>; lines: Record<string, number[][]> };

/**
 * Put a scan map's rectangles on a listing map's lines (by file line), then on every other map's
 * lines through the address they share: the source and the translation reach the scan through core.
 */
export function attachScan(listing: SourceMap, others: readonly SourceMap[], scan: ScanLines, url: (scanPage: number) => string): void {
	for (const l of listing.lines) {
		const rects = l.line === undefined ? undefined : scan.lines[String(l.line)];
		const size = l.page === undefined ? undefined : scan.pages[String(l.page)];
		if (!rects?.length || !size || l.page === undefined) continue;
		l.scan = { url: url(l.page + scan.page_offset), width: size[0], height: size[1], rects: rects.map(([x = 0, y = 0, w = 0, h = 0, ink = 0]) => ({ x, y, w, h, ink: ink === 1 })) };
	}
	for (const m of others)
		for (const l of m.lines) {
			if (l.addr === null || l.scan) continue;
			const i = listing.line.get(l.addr);
			const place = i === undefined ? undefined : listing.lines[i]?.scan;
			if (place) l.scan = place;
		}
}
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

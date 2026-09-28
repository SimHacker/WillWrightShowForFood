import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { AsmLine, AsmResult } from "./asm/core.js";
import { printListing } from "./asm/listing.js";
import { PDP7 } from "./asm/pdp7.js";

const heinz = fileURLToPath(new URL("../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt", import.meta.url));
const lines = readFileSync(heinz, "utf8").split("\n");
const ROW = /^\s*(\d+)(?:\s+([0-7]+)\/\s*([0-7]+))?/;
const SYMBOL = /([A-Z][A-Z0-9]*)\s*=(\*?)\s*([0-7]+)/g;

/** Page 1 of the 1972 listing, and its symbol table, as the back end's own data. */
function fromHeinz(): { result: AsmResult; page1: string[]; table: string[] } {
	// The transcription notes what was written on the paper, "{handwritten: ...}"; the printer didn't print it.
	const page1 = lines.slice(0, 61).filter((l) => !l.trim().startsWith("{"));
	const listing: AsmLine[] = page1.slice(2).map((raw, i) => {
		const m = raw.match(ROW) as RegExpMatchArray;
		const addr = m[2] === undefined ? null : Number.parseInt(m[2], 8);
		const word = m[3] === undefined ? null : Number.parseInt(m[3], 8);
		return { tape: "symelec", line: i + 1, addr, word, words: word === null ? [] : [word], source: raw.slice(23) };
	});
	const table = lines.filter((l) => /^[A-Z][A-Z0-9]* *=[ *]/.test(l));
	const symbols = new Map<string, number>();
	for (const l of [...table].reverse()) for (const s of l.matchAll(SYMBOL)) symbols.set(s[1] as string, Number.parseInt(s[3] as string, 8));
	return { result: { machine: PDP7, words: [], symbols, literals: [], variables: [], listing, errors: [], start: null }, page1, table };
}

const DATE = new Date(1972, 1, 12, 12, 44, 57);

test("listing: page 1 of SYMELEC prints as Heinz's 1972 listing did, header and all", () => {
	const { result, page1 } = fromHeinz();
	const out = printListing({ ...result, symbols: new Map() }, { title: "SYMELEC", user: "HL1470", date: DATE }).split("\n");
	assert.deepEqual(out.slice(0, 60), page1.map((l) => l.trimEnd()));
});

test("listing: the symbol table sorts letters before digits and stars values bigger than an address", () => {
	const { result, table } = fromHeinz();
	const out = printListing({ ...result, listing: [] }, { user: "HL1470", date: DATE, pageLines: 0 });
	// Cell by cell: the transcription has short rows and one name twice (SUMB), so rows don't line up.
	const cells = (text: string): string[] => [...text.matchAll(/[A-Z][A-Z0-9]* *=[ *] *[0-7]+/g)].map((m) => m[0]);
	const want = [...new Set(cells(table.join("\n")))];
	const got = cells(out);
	// Every symbol prints exactly as transcribed. The transcription's own order has misreadings
	// (BD0 for BDO, CLB1 for CLBI, CHODE for CMODE) and a D-G stretch out of order: ASSEMBLERS.md.
	const printed = new Set(got);
	const same = want.filter((c) => printed.has(c));
	assert.ok(same.length / want.length > 0.99, `${same.length} of ${want.length} symbols print as transcribed`);
	const at = (c: string): number => got.indexOf(c);
	assert.ok(at("UNSTAK =*102400") >= 0, "a value bigger than an address is starred");
	assert.ok(at("TZ     =  2016") < at("T2     =  4770"), "letters sort before digits");
	assert.ok(at("U      =  4762") < at("UNSTAK =*102400") && at("UPDAXY =  7440") < at("U1     =  5010"), "a name before its extensions");
});

test("listing: a user list, no pages, and each tape numbered from 1", () => {
	const listing: AsmLine[] = [
		{ tape: "hilo", line: 1, addr: 0o100, word: 0o740040, words: [0o740040], source: "go,     hlt" },
		{ tape: "readln", line: 1, addr: null, word: null, words: [], source: "/ readln" },
		{ tape: "readln", line: 2, addr: 0o101, word: 0o301, words: [0o301, 0o302], source: "        text \"AB\"" },
	];
	const result: AsmResult = { machine: PDP7, words: [], symbols: new Map([["go", 0o100]]), literals: [], variables: [], listing, errors: [], start: null };
	const out = printListing(result, { title: "HILO", user: "A2DEH,CLAUDE", date: new Date(2026, 8, 28, 9, 5, 0), pageLines: 0 });
	assert.equal(
		out,
		[
			"",
			"/HILO   ASSEMBLED 28 9 26 AT 09,05,00 BY A2DEH,CLAUDE",
			"    1     100/ 740040  go,     hlt",
			"    1                  / readln",
			"    2     101/    301          text \"AB\"",
			"          102/    302",
			"",
			"go     =   100",
			"",
		].join("\n"),
	);
});

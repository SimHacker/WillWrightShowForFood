// The 1972 assembler placed SYMELEC's literal pool at 12066-12257, on the
// last listing pages as bare `addr/ value` lines with no line numbers or
// mnemonics. The .oct conversion stopped at 11741, so every `(literal`
// operand read zero — the free-list loop never terminated and location 1
// got 0 instead of JMP INT. This script derives symelec-literals.oct from
// the listing; regenerate, never hand-edit.
import { readFileSync, writeFileSync } from "node:fs";

const listingUrl = new URL(
	"../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt",
	import.meta.url,
);
const outUrl = new URL(
	"../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-literals.oct",
	import.meta.url,
);

const pairs = [];
for (const line of readFileSync(listingUrl, "utf8").split("\n")) {
	const m = line.match(/^\s*([0-7]{4,5})\/\s+([0-7]+)\s*$/);
	if (m) pairs.push([Number.parseInt(m[1], 8), Number.parseInt(m[2], 8)]);
}

if (pairs.length === 0) throw new Error("no literal-pool lines matched");
for (let i = 1; i < pairs.length; i += 1) {
	if (pairs[i][0] !== pairs[i - 1][0] + 1)
		throw new Error(
			`pool not contiguous at ${pairs[i][0].toString(8)} (after ${pairs[i - 1][0].toString(8)})`,
		);
}

const header = [
	"# SYMELEC literal pool, derived from symelec-listing.txt pages 105-106",
	"# by packages/cabinet/scripts/extract-literals.mjs. Load after symelec.oct.",
	`# ${pairs.length} words, ${pairs[0][0].toString(8)}-${pairs[pairs.length - 1][0].toString(8)} octal.`,
];
const body = pairs.map(([a, w]) => `${a.toString(8)} ${w.toString(8)}`);
writeFileSync(outUrl, `${[...header, ...body].join("\n")}\n`);
console.log(
	`wrote ${pairs.length} literals, ${pairs[0][0].toString(8)}-${pairs[pairs.length - 1][0].toString(8)}`,
);

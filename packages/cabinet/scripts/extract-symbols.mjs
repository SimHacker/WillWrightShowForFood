// SYMELEC's symbols for navigating core, derived from symelec-listing.txt
// into symelec-symbols.tsv (name, octal address, source, flags);
// regenerate, never hand-edit.
//
// Two sources in the listing. The code lines, `seq addr/ word LABEL, ...`,
// give each label where the assembler put it; the assembler reproduces
// those words, so they are the authority. The printed symbol table on the
// last pages adds what the code lines do not show (variables, JMS-valued
// labels), but its OCR is lossy: where the two disagree the code wins and
// the disagreement is reported, to be checked against the scan.
//
// A table value under 20000 is an address. 1xxxxx and 6xxxxx are labels
// written `NAME=JMS,` and `NAME=JMP,`, whose address is the low 13 bits. Anything else (display
// codes, masks) is a constant and is left out. `=*` marks a name the 1972
// assembler saw defined more than once.
import { readFileSync, writeFileSync } from "node:fs";

const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
const lines = readFileSync(new URL(`${dir}symelec-listing.txt`, import.meta.url), "utf8").split("\n");
const outUrl = new URL(`${dir}symelec-symbols.tsv`, import.meta.url);

const o = (n) => n.toString(8).padStart(5, "0");

/** name -> [{ addr, source, flags }] */
const symbols = new Map();
const add = (name, addr, source, flags = "") => {
	const list = symbols.get(name) ?? [];
	const same = list.find((s) => s.addr === addr);
	if (same) {
		if (!same.source.includes(source)) same.source += `+${source}`;
		if (flags && !same.flags.includes(flags)) same.flags = [same.flags, flags].filter(Boolean).join(",");
	} else list.push({ addr, source, flags });
	symbols.set(name, list);
};

const labelList = /([A-Z][A-Z0-9]*)(?:=[^,\s]*)?,/g;
const placed = /^\s*\d+\s+([0-7]+)\/\s+[0-7]+(?:\s+((?:[A-Z][A-Z0-9]*(?:=[^,\s]*)?,\s*)+))?/;
const labelOnly = /^\s*\d+\s+((?:[A-Z][A-Z0-9]*(?:=[^,\s]*)?,\s*)+)$/;
let pending = [];
for (const line of lines) {
	const m = line.match(placed);
	if (m) {
		const addr = Number.parseInt(m[1], 8);
		for (const name of pending) add(name, addr, "code");
		pending = [];
		if (m[2]) for (const [, name] of m[2].matchAll(labelList)) add(name, addr, "code");
		continue;
	}
	const only = line.match(labelOnly);
	if (only) for (const [, name] of only[1].matchAll(labelList)) pending.push(name);
}

const entry = /([A-Z][A-Z0-9]*)\s*=\s*(\*?)([0-7]+)/g;
const tableLine = /^(\s*[A-Z][A-Z0-9]*\s*=\s*\*?[0-7]+)+\s*$/;
let constants = 0;
const disagree = [];
for (const [i, line] of lines.entries()) {
	if (!tableLine.test(line)) continue;
	for (const [, name, star, digits] of line.matchAll(entry)) {
		const v = Number.parseInt(digits, 8);
		let addr = null;
		const flags = [];
		if (star) flags.push("multiply-defined");
		if (v < 0o20000) addr = v;
		else if ((v & 0o760000) === 0o100000 || (v & 0o760000) === 0o600000) {
			addr = v & 0o17777;
			flags.push((v & 0o760000) === 0o100000 ? "jms" : "jmp");
		}
		if (addr === null) {
			constants += 1;
			continue;
		}
		const code = (symbols.get(name) ?? []).filter((s) => s.source.includes("code"));
		if (code.length && !code.some((s) => s.addr === addr) && !star) {
			disagree.push(`${name}: table ${o(addr)} (listing line ${i + 1}), code ${code.map((s) => o(s.addr)).join(" ")}`);
			continue;
		}
		add(name, addr, "table", flags.join(","));
	}
}

const rows = [...symbols].flatMap(([name, list]) => list.map((s) => [name, s.addr, s.source, s.flags]));
if (rows.length < 400) throw new Error(`only ${rows.length} symbols; the listing did not parse`);
rows.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
writeFileSync(
	outUrl,
	[
		"# name\taddress (octal)\tsource (code: where the listing places it; table: the printed symbol table)\tflags",
		"# Derived from symelec-listing.txt by packages/cabinet/scripts/extract-symbols.mjs.",
		...rows.map(([n, a, s, f]) => `${n}\t${o(a)}\t${s}\t${f}`),
	].join("\n") + "\n",
);
const count = (s) => rows.filter((r) => r[2] === s).length;
console.log(`${rows.length} symbols: ${count("code+table")} in both, ${count("code")} code only, ${count("table")} table only; ${constants} constants left out`);
for (const d of disagree) console.log(`table disagrees with code, code kept: ${d}`);

// Every place a transcription of a 1972 Cambridge listing can disagree with what its source assembles to:
// each listing line's address, word and source text, and every row of the printed symbol table.
import { readFileSync } from "node:fs";
import { assemble } from "../dist/asm.js";

const dir = new URL("../tapes/symelec/", import.meta.url);
const read = (p) => readFileSync(new URL(p, dir), "utf8");
let total = 0;

for (const prog of process.argv.slice(2).length ? process.argv.slice(2) : ["symelec", "rsppix"]) {
	const source = read(`${prog}.asm`);
	const listing = read(`${prog}-listing.txt`);
	const r = assemble([{ name: `${prog}.asm`, text: source }], { dialect: "cambridge", origin: 0o22 });
	const out = [];
	for (const e of r.errors) out.push(`assembler: ${e}`);

	// Listing lines: "  seq   addr/ word   source"
	const norm = (s) => s.replace(/\s+/g, " ").trim().toUpperCase();
	const srcCode = (s) => norm(s.replace(/\s*\/.*$/, ""));
	const asmByAddr = new Map();
	for (const l of r.listing) if (l.addr !== null) asmByAddr.set(l.addr, l);
	const words = new Map(r.words);
	let page = 0;
	for (const line of listing.split("\n")) {
		const pm = line.match(/PAGE\s+(\d+)/);
		if (pm) page = Number(pm[1]);
		const m = line.match(/^\s*(\d+)\s+([0-7]+)\/\s*([0-7]+)(?:\s{2}(.*))?$/) ?? line.match(/^\s*()([0-7]+)\/\s*([0-7]+)(?:\s{2,}(.*))?$/);
		if (!m) continue;
		m[4] ??= "";
		const addr = Number.parseInt(m[2], 8);
		const printed = Number.parseInt(m[3], 8);
		const have = words.get(addr);
		const at = `p${page} ${m[2]}`;
		if (have === undefined) {
			out.push(`${at}: listing word ${m[3]}, nothing assembled here  | ${m[4].trim()}`);
			continue;
		}
		if (have !== printed) out.push(`${at}: listing word ${m[3]}, assembles to ${have.toString(8)}  | ${m[4].trim()}`);
		const row = asmByAddr.get(addr);
		const variable = r.variables.find((v) => v.addr === addr);
		if (variable && srcCode(m[4]) !== variable.name.toUpperCase()) out.push(`${at}: listing variable ${srcCode(m[4])}, assembles ${variable.name.toUpperCase()}`);
		if (row && srcCode(m[4]) !== srcCode(row.source)) out.push(`${at}: listing source "${srcCode(m[4])}", .asm "${srcCode(row.source)}"`);
	}

	// Printed symbol table: NAME = [*]value, four to a line.
	const table = [];
	const printed = listing.split("\n").filter((l) => !l.trim().startsWith("{")).join("\n");
	for (const m of printed.matchAll(/(?:^|\s)([A-Z][A-Z0-9 ]*?)\s*=\s*(\*?)\s*([0-7]+)(?=\s|$)/gm)) {
		if (/^\s*\d+\s/.test(m.input.slice(m.input.lastIndexOf("\n", m.index) + 1, m.index + 1))) continue;
		table.push({ name: m[1].trim(), star: m[2] === "*", value: Number.parseInt(m[3], 8) });
	}
	const seen = new Map();
	for (const t of table) {
		const key = t.name.toLowerCase().replace(/\s+/g, "");
		const v = r.symbols.get(key);
		if (/\s/.test(t.name)) out.push(`table: "${t.name}" has a space`);
		if (v === undefined) out.push(`table: ${t.name} = ${t.star ? "*" : ""}${t.value.toString(8)} is not a symbol of ${prog}.asm`);
		else {
			const values = seen.get(key) ?? [];
			seen.set(key, [...values, t.value]);
			const assigned = r.assignments.filter((a) => a.name === key).map((a) => a.value);
			const ok = t.value === v || assigned.includes(t.value);
			if (!ok) out.push(`table: ${t.name} = ${t.value.toString(8)}, assembles to ${v.toString(8)}`);
			if (t.star !== v > 0o17777 && ok) out.push(`table: ${t.name} star ${t.star ? "set" : "missing"} for ${v.toString(8)}`);
		}
	}
	for (let i = 1; i < table.length; i += 1) {
		const a = table[i - 1].name;
		const b = table[i].name;
		// Titan sorts letters before digits.
		const k = (s) => [...s].map((c) => (/[0-9]/.test(c) ? `~${c}` : c)).join("");
		if (k(a) > k(b)) out.push(`table: order ${a} before ${b}`);
	}
	for (const [key, values] of seen) {
		const assigned = r.assignments.filter((a) => a.name === key).map((a) => a.value);
		const want = assigned.length > 1 ? [...new Set(assigned)] : [r.symbols.get(key)];
		if (values.length !== want.length) out.push(`table: ${key.toUpperCase()} printed ${values.length} times, defined with ${want.length} values`);
	}
	const tableNames = new Set(table.map((t) => t.name.toLowerCase().replace(/\s+/g, "")));
	if (table.length) for (const [name] of r.symbols) if (!tableNames.has(name)) out.push(`table: ${name.toUpperCase()} missing`);

	console.log(`== ${prog}: ${out.length} disagreements`);
	for (const o of out) console.log(`  ${o}`);
	total += out.length;
}
process.exitCode = total ? 1 : 0;

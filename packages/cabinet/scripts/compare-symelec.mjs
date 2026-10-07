// Strict SYMELEC check: every assembled word against symelec.oct and the literal pool,
// literal operands compared by the value they point at, everything else bit for bit.
import { readFileSync } from "node:fs";
import { assemble } from "../dist/asm.js";

const dir = new URL("../tapes/symelec/", import.meta.url);
const read = (p) => readFileSync(new URL(p, dir), "utf8");
const parse = (p) =>
	new Map(read(p).split("\n").flatMap((l) => {
		const m = l.match(/^\s*([0-7]+)\s+([0-7]+)/);
		return m ? [[Number.parseInt(m[1], 8), Number.parseInt(m[2], 8)]] : [];
	}));
const code = parse("symelec.oct");
const pool = parse("symelec-literals.oct");
const r = assemble([{ name: "symelec.asm", text: read("symelec.asm") }], { dialect: "cambridge", origin: 0o22 });
const got = new Map(r.words);
const litAddrs = new Set(r.literals.map((l) => l.addr));
const poolLo = Math.min(...pool.keys());
const diffs = [];
for (const row of r.listing) {
	if (row.addr === null) continue;
	row.words.forEach((_, k) => {
		const addr = row.addr + k;
		if (addr >= poolLo) return;
		const want = code.get(addr) ?? 0;
		const have = got.get(addr) ?? 0;
		if (want === have) return;
		const wantLit = pool.has(want & 0o17777);
		const haveLit = litAddrs.has(have & 0o17777);
		if (wantLit && haveLit && (want & 0o760000) === (have & 0o760000) && pool.get(want & 0o17777) === got.get(have & 0o17777)) return;
		diffs.push(`${addr.toString(8).padStart(5)} ${have.toString(8).padStart(6, "0")} want ${want.toString(8).padStart(6, "0")}${wantLit ? ` (=${pool.get(want & 0o17777).toString(8)})` : ""}  ${row.line}: ${row.source.trim()}`);
	});
}
const multiset = (vals) => vals.reduce((m, v) => m.set(v, (m.get(v) ?? 0) + 1), new Map());
const wantPool = multiset([...pool.values()]);
const havePool = multiset(r.literals.map((l) => got.get(l.addr)));
const poolDiff = [...new Set([...wantPool.keys(), ...havePool.keys()])]
	.filter((v) => wantPool.get(v) !== havePool.get(v))
	.map((v) => `${v.toString(8)}: want ${wantPool.get(v) ?? 0}, have ${havePool.get(v) ?? 0}`);
console.log(`errors ${r.errors.length}, variables ${r.variables.length}, literals ${r.literals.length}/${pool.size}`);
for (const e of r.errors) console.log(`  ${e}`);
console.log(`code differences ${diffs.length}`);
for (const d of diffs) console.log(`  ${d}`);
console.log(`pool differences ${poolDiff.length}`);
for (const d of poolDiff) console.log(`  ${d}`);
const exact = r.words.every(([a, w]) => a >= poolLo || (code.get(a) ?? 0) === w)
	&& [...pool].every(([a, w]) => got.get(a) === w);
console.log(exact ? "EXACT: word for word" : "not exact");
process.exitCode = diffs.length || poolDiff.length || r.errors.length ? 1 : 0;

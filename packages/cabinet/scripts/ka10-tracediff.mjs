#!/usr/bin/env node
// Compare two KA10 instruction histories in SIMH's `show cpu history` columns, ours from
// scripts/ka10-trace.mjs and SIMH's from pdp10-ka's stdout, and report the first difference.
// The clock flag (bit 4 of the flags column) is ignored: SIMH's clock runs off the wall clock.
//
//   node scripts/ka10-tracediff.mjs ours.txt simh.txt
import { readFileSync } from "node:fs";

const rows = (path) =>
	readFileSync(path, "utf8")
		.split("\n")
		.filter((l) => /^[0-7]{6} {3}/.test(l))
		.map((l) => {
			const f = l.trim().split(/\s+/);
			f[5] = (parseInt(f[5], 8) & ~4).toString(8).padStart(6, "0");
			return f.slice(0, 7).join(" ");
		});
const [a, b] = [rows(process.argv[2]), rows(process.argv[3])];
const n = Math.min(a.length, b.length);
for (let i = 0; i < n; i++) {
	if (a[i] !== b[i]) {
		console.log(`differ at line ${i + 1} of ${n}`);
		for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 2); j++) console.log(`${j === i ? ">" : " "} ours ${a[j]}\n${j === i ? ">" : " "} simh ${b[j]}`);
		process.exit(1);
	}
}
console.log(`${n} instructions identical${a.length !== b.length ? ` (lengths ${a.length} and ${b.length})` : ""}`);

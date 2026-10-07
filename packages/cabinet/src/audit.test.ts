import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("transcriptions: every listing line and symbol-table row agrees with its source", () => {
	const out = execFileSync("node", [new URL("../scripts/audit-cambridge.mjs", import.meta.url).pathname], { encoding: "utf8" });
	assert.match(out, /== symelec: 0 disagreements/);
	assert.match(out, /== rsppix: 0 disagreements/);
});

test("transcriptions: the cabinet's copies are the master copies", () => {
	const master = new URL("../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/", import.meta.url);
	const here = new URL("../tapes/symelec/", import.meta.url);
	for (const f of ["symelec.asm", "symelec.oct", "symelec-literals.oct", "symelec-listing.txt", "symelec-symbols.tsv", "rsppix.asm", "rsppix.oct", "rsppix-listing.txt"]) {
		assert.equal(readFileSync(new URL(f, here), "utf8"), readFileSync(new URL(f, master), "utf8"), f);
	}
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseOct } from "./loader.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { sourceFromListing } from "./source.js";
import { Trace } from "./trace.js";

const dir = new URL("../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/", import.meta.url);

test("source: the 1972 listing lines up with the words it printed", () => {
	const map = sourceFromListing(readFileSync(new URL("symelec-listing.txt", dir), "utf8"));
	const at = (addr: number) => map.lines[map.line.get(addr) ?? -1];
	assert.equal(at(0o2627)?.word, 0o205162);
	assert.match(at(0o2627)?.text ?? "", /LAC BEG/);
	assert.match(at(0o405)?.text ?? "", /NUL0,\s+DDS VE 4/);
	const oct = parseOct(readFileSync(new URL("symelec.oct", dir), "utf8"));
	let same = 0;
	for (const [addr, word] of oct) if (map.word.get(addr) === word) same += 1;
	assert.ok(same > 4000, `${same} words agree with symelec.oct`);
});

test("trace: the ring keeps the newest fetches, oldest first", () => {
	const cpu = new Pdp7();
	cpu.trace = new Trace(4);
	cpu.deposit(0o20, [0o750001, 0o740000, 0o740000, 0o740000, 0o740000, 0o600020]);
	cpu.pc = 0o20;
	for (let i = 0; i < 6; i += 1) cpu.step();
	assert.deepEqual(
		cpu.trace.window(4).map((e) => [e.pc, e.word]),
		[[0o22, 0o740000], [0o23, 0o740000], [0o24, 0o740000], [0o25, 0o600020]],
	);
	assert.equal(cpu.trace.window(2, 1)[1]?.pc, 0o24);
	assert.equal(cpu.trace.window(4)[0]?.ac, 0o777777);
});

import assert from "node:assert/strict";
import test from "node:test";

import { coreFromData, coreToJson, coreToRaw, coreToYaml, rawToCore, readAll, readCore } from "./core.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { loadSymelec } from "./symelec-fixtures.js";

function symelecCore(): Uint32Array {
	const cpu = new Pdp7({ coreWords: 8192 });
	loadSymelec(cpu);
	return readAll((a) => cpu.read(a), cpu.coreWords);
}

test("core: raw is the emulator's words, 4 bytes each, location 0 first", () => {
	const core = symelecCore();
	const raw = coreToRaw(core);
	assert.equal(raw.length, 8192 * 4);
	const view = new DataView(raw.buffer);
	for (const a of [0, 0o22, 0o5162, 8191]) assert.equal(view.getUint32(a * 4, true), core[a]);
	for (let i = 3; i < raw.length; i += 4) assert.equal(raw[i], 0, "upper byte is always zero");
	assert.deepEqual(rawToCore(raw), core);
});

test("core: JSON and YAML round trip, and readCore tells raw from text", () => {
	const core = symelecCore();
	assert.deepEqual(readCore(new TextEncoder().encode(coreToJson(core, "symelec"))), core);

	const yaml = coreToYaml(core, "symelec");
	assert.match(yaml, /^format: pdp7-core\n/);
	const sparse = new Uint32Array(8192);
	sparse[0o100] = 0o740040;
	assert.deepEqual(coreToYaml(sparse).match(/^ {2}".*$/gm), ['  "00100": "740040 000000 000000 000000 000000 000000 000000 000000"'], "zero rows are left out");
	// Only quoted "addr": "words" rows below rows:, so a tiny reader is enough here.
	const rows: Record<string, string> = {};
	for (const m of yaml.matchAll(/^ {2}"(\d+)": "([0-7 ]+)"$/gm)) rows[m[1]!] = m[2]!;
	assert.deepEqual(coreFromData({ format: "pdp7-core", length: 8192, rows }), core);

	assert.deepEqual(readCore(coreToRaw(core)), core);
});

test("core: refuses what isn't an 18-bit core", () => {
	assert.throws(() => rawToCore(new Uint8Array(6)), /multiple of 4/);
	assert.throws(() => rawToCore(new Uint8Array([0, 0, 4, 0])), /wider than 18 bits/);
	assert.throws(() => coreFromData({ format: "other" }), /not a pdp7-core/);
	assert.throws(() => coreFromData({ format: "pdp7-core", words: [0o1000000] }), /18-bit/);
});

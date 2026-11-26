import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { OPS65 } from "../../m6502/disasm65.js";
import { APPLE2_SYMBOLS, apple2Name } from "./symbols.js";

test("apple ][+ symbols: every ROM entry starts a documented instruction in the ][+ ROM", () => {
	const rom = readFileSync(new URL("../../../roms/apple2/apple2plus.rom", import.meta.url));
	const entries = APPLE2_SYMBOLS.filter((s) => s.addr >= 0xd000);
	assert.ok(entries.length > 50);
	for (const s of entries) {
		const op = OPS65[rom[s.addr - 0xd000]!]!;
		assert.ok(!op.undocumented, `${s.name} $${s.addr.toString(16)} starts ${op.mnemonic}`);
	}
	assert.equal(apple2Name(0xfded), "COUT");
	assert.equal(apple2Name(0xc04f), "PANEL+14");
	assert.equal(new Set(APPLE2_SYMBOLS.map((s) => s.name)).size, APPLE2_SYMBOLS.length, "no name twice");
});

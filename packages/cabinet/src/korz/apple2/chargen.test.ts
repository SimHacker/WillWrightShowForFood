import assert from "node:assert/strict";
import test from "node:test";
import { CHARGEN_GLYPHS, CHARGEN_ROWS, glyphsFromRom } from "./chargen.js";

test("a character ROM keeps the low 7 bits and the first 64 glyphs", () => {
	const rom = new Uint8Array(CHARGEN_GLYPHS * CHARGEN_ROWS + 16);
	rom[8] = 0x90;
	rom[CHARGEN_GLYPHS * CHARGEN_ROWS] = 0x7f;
	const glyphs = glyphsFromRom(rom);
	assert.equal(glyphs.length, CHARGEN_GLYPHS * CHARGEN_ROWS);
	assert.equal(glyphs[8], 0x10);
	assert.equal(glyphs[0], 0);
});

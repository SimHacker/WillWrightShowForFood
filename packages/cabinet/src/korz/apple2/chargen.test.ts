import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { M6502 } from "../../m6502/m6502.js";
import { textRows } from "../../microm8/microm8.js";
import { CHARGEN_GLYPHS, CHARGEN_ROWS, glyphsFromRom } from "./chargen.js";
import { Apple2Plus } from "./plus.js";
import { picture } from "./scan.js";

const roms = new URL("../../../roms/apple2/", import.meta.url);

test("a character ROM keeps the low 7 bits and the first 64 glyphs", () => {
	const rom = new Uint8Array(CHARGEN_GLYPHS * CHARGEN_ROWS + 16);
	rom[8] = 0x90;
	rom[CHARGEN_GLYPHS * CHARGEN_ROWS] = 0x7f;
	const glyphs = glyphsFromRom(rom);
	assert.equal(glyphs.length, CHARGEN_GLYPHS * CHARGEN_ROWS);
	assert.equal(glyphs[8], 0x10);
	assert.equal(glyphs[0], 0);
});

test("the ][+ character ROM draws an inverse @, and a bare boot shows APPLE ][", () => {
	const glyphs = glyphsFromRom(new Uint8Array(readFileSync(new URL("chargen.rom", roms))));
	assert.equal(glyphs[8], 0x08, "the A starts with its top pixel");
	assert.equal(glyphs.subarray(32 * 8, 33 * 8).every((b) => b === 0), true, "the space is empty");
	const prompt = new Uint8Array(0x800);
	prompt[0x400] = 0xc1;
	prompt[0x401] = 0x20;
	const cursor = picture(prompt, { graphics: false, mixed: false, page2: false, hires: false }, glyphs, false);
	assert.equal(cursor[6], 1, "the A's top pixel is the third dot");
	assert.equal(cursor[12], 0, "the A's blank right column stays dark beside the cursor");
	assert.equal(cursor[13], 0);
	assert.equal(cursor[14], 1, "the cursor is its own cell");
	const ram = new Uint8Array(0x800);
	const inverse = picture(ram, { graphics: false, mixed: false, page2: false, hires: false }, glyphs, false);
	let on = 0;
	for (let y = 0; y < 8; y += 1) for (let x = 0; x < 14; x += 1) if (inverse[y * 560 + x]) on += 1;
	assert.ok(on > 60, `a cleared cell is an inverse @, ${on} of 112 pixels lit`);
	ram[0x400] = 0x80;
	const normal = picture(ram, { graphics: false, mixed: false, page2: false, hires: false }, glyphs, false);
	let plain = 0;
	for (let y = 0; y < 8; y += 1) for (let x = 0; x < 14; x += 1) if (normal[y * 560 + x]) plain += 1;
	assert.ok(plain < 45, `a normal @ is the letter, ${plain} pixels, not a solid cell`);
	const rom = new Uint8Array(readFileSync(new URL("apple2plus.rom", roms)));
	assert.equal(rom.length, 0x3000);
	assert.equal(rom[0xfbb3 - 0xd000], 0xea);
	assert.equal(readFileSync(new URL("diskii.rom", roms)).length, 0x100);
	const board = new Apple2Plus(rom);
	const cpu = new M6502(board);
	cpu.reset();
	let steps = 0;
	for (; steps < 2_000_000; steps += 1) {
		if (textRows(board.textPage()).some((row) => row.includes("APPLE ]["))) break;
		cpu.step();
	}
	assert.ok(steps < 2_000_000, textRows(board.textPage()).join("\n"));
	assert.equal(board.graphics, false);
});

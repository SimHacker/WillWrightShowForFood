import assert from "node:assert/strict";
import { test } from "node:test";
import { CYCLES_PER_LINE, HBL_CYCLES, picture, scanAddress, type ScanMode } from "./scan.js";

const TEXT: ScanMode = { graphics: false, mixed: false, page2: false, hires: false };
const HIRES: ScanMode = { graphics: true, mixed: false, page2: false, hires: true };
const at = (line: number, column: number) => line * CYCLES_PER_LINE + HBL_CYCLES + column;

test("scanner: Gayler's checkpoints, both pages, mixed, and blanking", () => {
	assert.equal(scanAddress(at(0, 0), TEXT), 1024);
	assert.equal(scanAddress(at(7, 0), TEXT), 1024);
	assert.equal(scanAddress(at(8, 0), TEXT), 1152);
	assert.equal(scanAddress(at(64, 0), TEXT), 1064);
	assert.equal(scanAddress(at(128, 0), TEXT), 1104);
	assert.equal(scanAddress(at(184, 0), TEXT), 0x7d0);
	assert.equal(scanAddress(at(0, 0), { ...TEXT, page2: true }), 0x800);
	assert.equal(scanAddress(at(0, 0), HIRES), 8192);
	assert.equal(scanAddress(at(1, 0), HIRES), 9216);
	assert.equal(scanAddress(at(8, 0), HIRES), 8320);
	assert.equal(scanAddress(at(0, 0), { ...HIRES, page2: true }), 0x4000);
	assert.equal(scanAddress(at(160, 0), { ...HIRES, mixed: true }), 0x650);
	assert.equal(scanAddress(at(0, 39), TEXT), 1024 + 39);

	assert.equal(scanAddress(0, TEXT), scanAddress(1, TEXT));
	assert.equal(scanAddress(0, TEXT), 0x1468);
	assert.equal(scanAddress(24, TEXT), 0x147f);
	assert.equal(scanAddress(0, HIRES), 0x2068);
	assert.equal(scanAddress(at(192, 0), TEXT), 0x478);
	assert.equal(scanAddress(at(192, 0), HIRES), 0x2078);
});

test("scanner: the reference picture samples those addresses", () => {
	const ram = new Uint8Array(0xc000);
	ram[8192] = 0x01;
	ram[0x650] = 0x3c;
	const hires = picture(ram, HIRES);
	assert.equal(hires[0], 1);
	assert.equal(hires[1], 1);
	assert.equal(hires[2], 0);
	const lores = picture(ram, { graphics: true, mixed: false, page2: false, hires: false });
	ram[1024] = 0x3c;
	const loresPainted = picture(ram, { graphics: true, mixed: false, page2: false, hires: false });
	assert.equal(loresPainted[0], 0xc);
	assert.equal(loresPainted[4 * 560], 0x3);
	assert.equal(lores[0], 0);
	const glyphs = new Uint8Array(128 * 8);
	glyphs[8] = 0x01;
	ram[1024] = 0xc1;
	const text = picture(ram, TEXT, glyphs);
	assert.equal(text[0], 1);
	assert.equal(text[2], 0);
	const mixed = picture(ram, { ...HIRES, mixed: true });
	assert.equal(mixed[0], 1);
	assert.equal(mixed[160 * 560], 0);
});

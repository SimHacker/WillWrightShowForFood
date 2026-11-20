/**
 * The motherboard character generator socket. A ROM is 64 glyphs of 8 rows. A row is
 * the low 7 bits, bit 0 at the left. The eighth row is the gap under the letter.
 * The emulator's own default is the ][+ generator, read from microM8. A cartridge
 * passes a ROM in this layout and it replaces that default.
 */
export const CHARGEN_GLYPHS = 64;
export const CHARGEN_ROWS = 8;

export function glyphsFromRom(rom: Uint8Array): Uint8Array {
	if (rom.length < CHARGEN_ROWS) throw new Error("a character ROM is 8 bytes a glyph");
	const out = new Uint8Array(CHARGEN_GLYPHS * CHARGEN_ROWS);
	const n = Math.min(CHARGEN_GLYPHS, Math.floor(rom.length / CHARGEN_ROWS));
	for (let i = 0; i < n; i++) {
		for (let y = 0; y < CHARGEN_ROWS; y++) out[i * CHARGEN_ROWS + y] = (rom[i * CHARGEN_ROWS + y] ?? 0) & 0x7f;
	}
	return out;
}

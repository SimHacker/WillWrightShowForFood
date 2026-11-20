/**
 * The Apple ][+ video scanner. The beam is a function of the cycle: 65 cycles
 * a line, 262 lines a frame, 17,030 cycles. Forty of each line are on the
 * screen and twenty-five are horizontal blanking. The first two blanking
 * cycles read one byte twice; the twenty-four blanking addresses are the
 * twenty-four bytes before the row, wrapped inside its 128-byte segment.
 * On a ][ or ][+, text and lores blanking reads $1000 higher than the segment.
 * Vertical blanking is lines 192–261. The same address is what an undriven
 * read returns, and what the reference picture samples.
 *
 * Checkpoints from W. Gayler, *The Apple II Circuit Description*: text upper
 * left is 1024, the ninth scan line is 1152, hires upper left is 8192, the
 * second hires line is 9216. `rowBase` in microm8/STACK.md is this hires sum.
 */

export const CYCLES_PER_LINE = 65;
export const LINES_PER_FRAME = 262;
export const CYCLES_PER_FRAME = CYCLES_PER_LINE * LINES_PER_FRAME;
export const VISIBLE_LINES = 192;
export const VISIBLE_COLUMNS = 40;
/** Horizontal blanking occupies the first 25 cycles of each line. Column 0 is cycle 25. */
export const HBL_CYCLES = 25;
export const FRAME_WIDTH = 560;
export const FRAME_HEIGHT = 192;

export type ScanMode = {
	graphics: boolean;
	mixed: boolean;
	page2: boolean;
	hires: boolean;
};

const TEXT = 0x400;
const HIRES = 0x2000;

/** Hires, except the bottom four text rows while mixed is on. */
function hiresNow(line: number, mode: ScanMode): boolean {
	return mode.graphics && mode.hires && !(mode.mixed && line >= 160 && line < VISIBLE_LINES);
}

/** The byte the beam reads at this visible column. `line` may run into the blanking lines. */
function rowAddress(line: number, column: number, mode: ScanMode): number {
	if (hiresNow(line, mode)) {
		const base = mode.page2 ? HIRES * 2 : HIRES;
		return base + (line & 7) * 0x400 + ((line >> 3) & 7) * 0x80 + (line >> 6) * 0x28 + column;
	}
	const base = mode.page2 ? TEXT * 2 : TEXT;
	const row = line >> 3;
	return base + (row & 7) * 0x80 + (row >> 3) * 0x28 + column;
}

/**
 * The RAM address fetched on `cycle`. Cycle 0 is the first blanking cycle of
 * line 0. An address during text or lores blanking is $1000 above its segment.
 */
export function scanAddress(cycle: number, mode: ScanMode): number {
	const c = cycle % CYCLES_PER_FRAME;
	const line = (c / CYCLES_PER_LINE) | 0;
	const h = c % CYCLES_PER_LINE;
	if (h >= HBL_CYCLES) return rowAddress(line, h - HBL_CYCLES, mode);
	const row = rowAddress(line, 0, mode);
	const index = h === 0 ? 0 : h - 1;
	let addr = (row & ~0x7f) + (((row & 0x7f) - 24 + index) & 0x7f);
	if (!hiresNow(line, mode)) addr += 0x1000;
	return addr;
}

/**
 * One field, 560 by 192. Hires dots are 0 or 1, each doubled. Lores pixels are
 * color numbers 0–15, fourteen dots wide; the low nibble is the top half of
 * the cell. Text uses `glyphs` when it is passed: 128 characters of 8 rows,
 * the low 7 bits of a row, bit 0 at the left. `flash` draws flashing
 * characters as inverse.
 */
export function picture(ram: Uint8Array, mode: ScanMode, glyphs?: Uint8Array, flash = false): Uint8Array {
	const out = new Uint8Array(FRAME_WIDTH * FRAME_HEIGHT);
	for (let y = 0; y < VISIBLE_LINES; y += 1) {
		const hires = hiresNow(y, mode);
		const lores = mode.graphics && !mode.hires && !(mode.mixed && y >= 160);
		const row = y * FRAME_WIDTH;
		for (let col = 0; col < VISIBLE_COLUMNS; col += 1) {
			const byte = ram[rowAddress(y, col, mode)] ?? 0;
			const x0 = row + col * 14;
			if (hires) {
				for (let b = 0; b < 7; b += 1) {
					const on = (byte >> b) & 1;
					out[x0 + b * 2] = on;
					out[x0 + b * 2 + 1] = on;
				}
			} else if (lores) {
				const color = y & 4 ? byte >> 4 : byte & 0xf;
				out.fill(color, x0, x0 + 14);
			} else if (glyphs) {
				const inverse = byte < 0x40 || (byte < 0x80 && flash);
				let bits = glyphs[(byte & 0x3f) * 8 + (y & 7)] ?? 0;
				if (inverse) bits ^= 0x7f;
				for (let b = 0; b < 7; b += 1) {
					const on = (bits >> b) & 1;
					out[x0 + b * 2] = on;
					out[x0 + b * 2 + 1] = on;
				}
			}
		}
	}
	return out;
}

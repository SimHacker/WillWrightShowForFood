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

/** Even byte, then odd byte. Each is bit 7 clear, then set; each of those is an even dot, then an odd one. 1 green, 2 violet, 5 orange, 6 blue. */
const HUE = [
	[
		[2, 1],
		[6, 5]
	],
	[
		[1, 2],
		[5, 6]
	]
];

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
				const raw = glyphs[(byte & 0x3f) * 8 + (y & 7)] ?? 0;
				let bits = raw;
				if (inverse) bits ^= 0x7f;
				for (let b = 0; b < 7; b += 1) {
					const on = (bits >> b) & 1;
					out[x0 + b * 2] = on;
					out[x0 + b * 2 + 1] = on;
				}
				// A cursor is the inverse of a blank glyph. The rightmost dot of every
				// glyph is dark, so the block reaches back one dot and meets the character.
				if (inverse && raw === 0 && col > 0) {
					out[x0 - 1] = 1;
					out[x0 - 2] = 1;
				}
			}
		}
	}
	return out;
}

/**
 * 280 color indices for one hi-res scan line of 40 bytes. A lit dot beside
 * another lit dot is white (7). A dark dot whose two neighbors match takes the
 * unprocessed color of the dot on its left: a one-dot gap in a white run stays
 * that color, which is how the letters in a white bar remain visible, and a
 * 10101010 run becomes one solid color.
 */
export function hiresLine(bytes: Uint8Array): Uint8Array {
	const raw = new Uint8Array(280);
	const mono = new Uint8Array(280);
	for (let j = 0; j < 40; j += 1) {
		let abyte = bytes[j] ?? 0;
		const hue = HUE[j & 1]?.[(abyte >> 7) & 1] ?? [0, 0];
		for (let k = 0; k < 7; k += 1) {
			const x = j * 7 + k;
			const on = abyte & 1;
			mono[x] = on;
			raw[x] = on ? hue[k & 1] ?? 0 : 0;
			if (x % 14 === 6 && j < 39) {
				const next = bytes[j + 1] ?? 0;
				if (raw[x] === 2 && next & 0x80 && (next & 1) === 0) raw[x] = 6;
			}
			abyte >>= 1;
		}
	}
	const out = new Uint8Array(280);
	for (let k = 0; k < 280; k += 1) {
		const on = mono[k];
		const left = k > 0 ? mono[k - 1] : 0;
		const right = k < 279 ? mono[k + 1] : 0;
		if (k === 0) out[k] = on && mono[1] ? 7 : raw[0] ?? 0;
		else if (k === 279) out[k] = on && mono[278] ? 7 : raw[279] ?? 0;
		else if (on && (left || right)) out[k] = 7;
		else if (!on && left === right) out[k] = raw[k - 1] ?? 0;
		else out[k] = raw[k] ?? 0;
	}
	return out;
}

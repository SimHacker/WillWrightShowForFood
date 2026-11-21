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

/**
 * The 16 colors a hi-res scan line is painted with. Same RGB as microM8's scan
 * renderer: hi-res is expanded to the 14 MHz bit stream and colored with the
 * double hi-res table, so the indices are lores colors, not the six hi-res hues.
 */
export const HIRES_PALETTE: readonly (readonly [number, number, number])[] = [
	[0, 0, 0],
	[224, 0, 48],
	[0, 0, 128],
	[255, 0, 255],
	[0, 128, 0],
	[128, 128, 128],
	[47, 149, 229],
	[171, 171, 255],
	[128, 80, 0],
	[255, 80, 0],
	[192, 192, 192],
	[255, 161, 234],
	[0, 255, 0],
	[255, 255, 0],
	[64, 255, 144],
	[255, 255, 255]
];

/** What the nibble on the left contributes to the four pixels of this group. */
const DHGR_FROM = [
	[0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000],
	[0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110, 0x0000, 0x1110],
	[0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300],
	[0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300, 0x0000, 0x3300, 0x2200, 0x3300],
	[0x0400, 0x5500, 0x6400, 0x7500, 0x4400, 0x5500, 0x6400, 0x7500, 0x0400, 0x5500, 0x6400, 0x7500, 0x4400, 0x5500, 0x6400, 0x7500],
	[0x0500, 0x5500, 0x6500, 0x7500, 0x4500, 0x5500, 0x6500, 0x7500, 0x0500, 0x5500, 0x6500, 0x7500, 0x4500, 0x5500, 0x6500, 0x7500],
	[0x0600, 0x7700, 0x6600, 0x7700, 0x4600, 0x7700, 0x6600, 0x7700, 0x0600, 0x7700, 0x6600, 0x7700, 0x4600, 0x7700, 0x6600, 0x7700],
	[0x0700, 0x7700, 0x6700, 0x7700, 0x4700, 0x7700, 0x6700, 0x7700, 0x0700, 0x7700, 0x6700, 0x7700, 0x4700, 0x7700, 0x6700, 0x7700],
	[0x8000, 0x9000, 0xa000, 0xb000, 0x8000, 0x9000, 0xa000, 0xb000, 0x8000, 0x9000, 0xa000, 0xb000, 0x8000, 0x9000, 0xa000, 0xb000],
	[0x8990, 0x9990, 0xa990, 0xb990, 0x8990, 0x9990, 0xa990, 0xb990, 0x8990, 0x9990, 0xa990, 0xb990, 0x8990, 0x9990, 0xa990, 0xb990],
	[0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0, 0xaaa0, 0xbba0],
	[0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0, 0xabb0, 0xbbb0],
	[0xcc00, 0xdd00, 0xec00, 0xfd00, 0xcc00, 0xdd00, 0xec00, 0xfd00, 0xcc00, 0xdd00, 0xec00, 0xfd00, 0xcc00, 0xdd00, 0xec00, 0xfd00],
	[0xcdd0, 0xddd0, 0xedd0, 0xfdd0, 0xcdd0, 0xddd0, 0xedd0, 0xfdd0, 0xcdd0, 0xddd0, 0xedd0, 0xfdd0, 0xcdd0, 0xddd0, 0xedd0, 0xfdd0],
	[0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0, 0xeee0, 0xffe0],
	[0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0, 0xeff0, 0xfff0]
];

/** What the nibble on the right contributes. */
const DHGR_TO = [
	[0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000],
	[0x0001, 0x0001, 0x0001, 0x0001, 0x0005, 0x0005, 0x0005, 0x0005, 0x0009, 0x0009, 0x0009, 0x0009, 0x000d, 0x000d, 0x000d, 0x000d],
	[0x0020, 0x0020, 0x0022, 0x0022, 0x0026, 0x0026, 0x0026, 0x0026, 0x00aa, 0x00aa, 0x00aa, 0x00aa, 0x00ae, 0x00ae, 0x00ae, 0x00ae],
	[0x0033, 0x0033, 0x0033, 0x0033, 0x0037, 0x0037, 0x0037, 0x0037, 0x00bb, 0x00bb, 0x00bb, 0x00bb, 0x00bf, 0x00bf, 0x00bf, 0x00bf],
	[0x0000, 0x0000, 0x0000, 0x0000, 0x0044, 0x0044, 0x0044, 0x0044, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc],
	[0x0055, 0x0055, 0x0055, 0x0055, 0x0055, 0x0055, 0x0055, 0x0055, 0x00dd, 0x00dd, 0x00dd, 0x00dd, 0x00dd, 0x00dd, 0x00dd, 0x00dd],
	[0x0060, 0x0060, 0x0062, 0x0062, 0x0066, 0x0066, 0x0066, 0x0066, 0x00ee, 0x00ee, 0x00ee, 0x00ee, 0x00ee, 0x00ee, 0x00ee, 0x00ee],
	[0x0077, 0x0077, 0x0077, 0x0077, 0x0077, 0x0077, 0x0077, 0x0077, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x00ff],
	[0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0888, 0x0888, 0x0888, 0x0888, 0x0888, 0x0888, 0x0888, 0x0888],
	[0x0001, 0x0001, 0x0001, 0x0001, 0x0005, 0x0005, 0x0005, 0x0005, 0x0009, 0x0009, 0x0009, 0x0009, 0x000d, 0x000d, 0x000d, 0x000d],
	[0x0000, 0x0000, 0x0002, 0x0002, 0x0006, 0x0006, 0x0006, 0x0006, 0x000a, 0x000a, 0x000a, 0x000a, 0x000e, 0x000e, 0x000e, 0x000e],
	[0x0003, 0x0003, 0x0003, 0x0003, 0x0007, 0x0007, 0x0007, 0x0007, 0x000b, 0x000b, 0x000b, 0x000b, 0x000f, 0x000f, 0x000f, 0x000f],
	[0x0000, 0x0000, 0x0000, 0x0000, 0x0044, 0x0044, 0x0044, 0x0044, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc, 0x00cc],
	[0x0005, 0x0005, 0x0005, 0x0005, 0x0005, 0x0005, 0x0005, 0x0005, 0x000d, 0x000d, 0x000d, 0x000d, 0x000d, 0x000d, 0x000d, 0x000d],
	[0x0000, 0x0000, 0x0002, 0x0002, 0x0006, 0x0006, 0x0006, 0x0006, 0x000e, 0x000e, 0x000e, 0x000e, 0x000e, 0x000e, 0x000e, 0x000e],
	[0x0007, 0x0007, 0x0007, 0x0007, 0x0007, 0x0007, 0x0007, 0x0007, 0x000f, 0x000f, 0x000f, 0x000f, 0x000f, 0x000f, 0x000f, 0x000f]
];

/** Nibble from the double-hi-res table onto a lores palette index. */
const DHGR_TO_LORES = [0, 1, 8, 9, 4, 5, 0xc, 0xd, 2, 3, 0xa, 0xb, 6, 7, 0xe, 0xf];

const DHGR_COLOR = new Uint16Array(16 * 16 * 16);
for (let prev = 0; prev < 16; prev++) {
	for (let current = 0; current < 16; current++) {
		for (let next = 0; next < 16; next++) {
			DHGR_COLOR[(prev << 8) | (current << 4) | next] = (DHGR_FROM[current]![prev]! | DHGR_TO[current]![next]!) & 0xffff;
		}
	}
}

/** One bit stretched to two 14 MHz clocks. */
function stretchBit(b: number): number {
	const wide =
		((b & 0x40) << 6) | ((b & 0x20) << 5) | ((b & 0x10) << 4) | ((b & 0x08) << 3) | ((b & 0x04) << 2) | ((b & 0x02) << 1) | (b & 0x01);
	return wide | (wide << 1);
}

/** Rotate a lores index the way the scan renderer does after the double-hi-res table. */
function flipColor(v: number): number {
	const rolled = ((v << 1) | ((v & 8) >> 3)) & 0xf;
	return ((rolled << 2) & 0xf) | ((rolled >> 2) & 0xf);
}

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
 * 560 palette indices for one hi-res scan line of 40 bytes.
 *
 * Each of the seven bits is two clocks of the 14 MHz dot clock. Bit 7 delays
 * that byte's clocks by one, which is the half-dot shift: the two pixels of a
 * bit can be different colors, and a run of the same bit across a byte boundary
 * can turn white. The delayed bits are then colored by the double-hi-res table,
 * four bits at a time, from the group before and the group after. `HIRES_PALETTE`
 * turns an index into RGB. A one-dot hole in a white run stays a color, so the
 * letters in a white bar stay readable.
 */
export function hiresLine(bytes: Uint8Array): Uint8Array {
	const wide = new Uint8Array(80);
	let carry = false;
	for (let i = 0; i < 40; i += 2) {
		const b1 = bytes[i] ?? 0;
		const b2 = bytes[i + 1] ?? 0;
		const idx: number = carry ? b1 | 0x100 : b1;
		let word: number = (idx & 0x181) >= 0x101 ? 1 : 0;
		let left = stretchBit(idx & 0x7f);
		if (idx & 0x80) left <<= 1;
		let right = stretchBit(b2 & 0x7f);
		if (b2 & 0x80) right <<= 1;
		if ((idx & 0x40) === 0x40 && (b2 & 1) !== 0) right |= 1;
		word |= left | (right << 14);
		if (b2 & 0x40) word |= 0x10000000;
		carry = (word & 0x10000000) !== 0;
		wide[i * 2] = word & 0x7f;
		wide[i * 2 + 1] = (word >> 7) & 0x7f;
		wide[i * 2 + 2] = (word >> 14) & 0x7f;
		wide[i * 2 + 3] = (word >> 21) & 0x7f;
	}
	const nibbles = new Uint8Array(140);
	let window = 0;
	let n = 0;
	for (let j = 0; j < wide.length; j += 1) {
		let abyte = wide[j] ?? 0;
		for (let k = 0; k < 7; k += 1) {
			window = ((window << 1) & 0xf) | (abyte & 1);
			abyte >>= 1;
			if ((j * 7 + k) % 4 === 3) nibbles[n++] = window;
		}
	}
	const out = new Uint8Array(FRAME_WIDTH);
	for (let i = 0; i < n; i += 1) {
		const prev = i > 0 ? nibbles[i - 1]! : 0;
		const current = nibbles[i]!;
		const next = i + 1 < n ? nibbles[i + 1]! : 0;
		const packed = DHGR_COLOR[(prev << 8) | (current << 4) | next] ?? 0;
		const x = i * 4;
		out[x] = flipColor(DHGR_TO_LORES[(packed >> 12) & 0xf] ?? 0);
		out[x + 1] = flipColor(DHGR_TO_LORES[(packed >> 8) & 0xf] ?? 0);
		out[x + 2] = flipColor(DHGR_TO_LORES[(packed >> 4) & 0xf] ?? 0);
		out[x + 3] = flipColor(DHGR_TO_LORES[packed & 0xf] ?? 0);
	}
	return out;
}

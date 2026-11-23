import type { Card } from "./plus.js";

/**
 * The Videx Videoterm, an 80-column card for expansion slot 3, from
 * `reference/apple2/videx/SPEC.md`. The firmware is `roms/apple2/videx-fw24.rom` (1K, v2.4) and
 * the characters `roms/apple2/videx-chr.rom` (2K). The card is a 6845 CRT controller at `$C0B0`
 * (address register) and `$C0B1` (data), 2K of screen RAM seen 512 bytes at a time at
 * `$CC00`-`$CDFF`, and the firmware at `$C800`-`$CBFF`, whose last page is also `$C300`. Any
 * access to `$C0B0`-`$C0BF` latches the RAM page from address bits 2-3.
 *
 * The picture shows when annunciator 0 is on and the Apple is in text mode (the Soft Video
 * Switch); `showing` is that rule, given the board's state.
 */

export const VIDEX_COLUMNS = 80;
export const VIDEX_ROWS = 24;
/** A cell is 9 dots by 9 scan lines (R9 + 1). */
export const VIDEX_CELL_WIDTH = 9;
export const VIDEX_CELL_HEIGHT = 9;
export const VIDEX_PICTURE_WIDTH = VIDEX_COLUMNS * VIDEX_CELL_WIDTH;
export const VIDEX_PICTURE_HEIGHT = VIDEX_ROWS * VIDEX_CELL_HEIGHT;

export class Videx implements Card {
	readonly rom: Uint8Array;
	readonly expansion: Uint8Array;
	readonly ram = new Uint8Array(0x800);
	/** The 6845's R0-R17. */
	readonly regs = new Uint8Array(18);
	/** The selected 6845 register. */
	select = 0;
	/** Which 512 bytes of `ram` the `$CC00` window shows. */
	page = 0;
	readonly chars: Uint8Array;

	constructor(firmware: Uint8Array, chars: Uint8Array) {
		if (firmware.length !== 0x400) throw new Error(`Videx firmware is ${firmware.length} bytes; it is 1024`);
		if (chars.length !== 0x800) throw new Error(`Videx character ROM is ${chars.length} bytes; it is 2048`);
		this.expansion = firmware.slice();
		this.rom = firmware.slice(0x300, 0x400);
		this.chars = chars.slice();
	}

	readSwitch(offset: number): number | null {
		this.page = (offset >> 2) & 3;
		if ((offset & 1) === 0) return null;
		return this.select >= 14 && this.select <= 17 ? this.regs[this.select]! : 0;
	}

	writeSwitch(offset: number, value: number): void {
		this.page = (offset >> 2) & 3;
		if ((offset & 1) === 0) this.select = value & 31;
		else if (this.select < 16) this.regs[this.select] = value;
	}

	expansionRead(offset: number): number | null {
		if (offset < 0x400 || offset >= 0x600) return null;
		return this.ram[(offset & 0x1ff) + this.page * 512]!;
	}

	expansionWrite(offset: number, value: number): void {
		if (offset >= 0x400 && offset < 0x600) this.ram[(offset & 0x1ff) + this.page * 512] = value;
	}

	/** The 6845 start address: the cell shown top left. */
	get start(): number {
		return ((this.regs[12]! & 0x3f) << 8) | this.regs[13]!;
	}

	/** The cell address of the cursor, R14/R15. */
	get cursor(): number {
		return ((this.regs[14]! & 0x3f) << 8) | this.regs[15]!;
	}

	/** The byte in the cell at column `x`, row `y` of the picture. */
	cell(x: number, y: number): number {
		const cols = this.regs[1] || VIDEX_COLUMNS;
		return this.ram[(this.start + y * cols + x) & 0x7ff]!;
	}

	/** The screen as text, one string per row, bit 7 (the alternate set) dropped. */
	text(): string[] {
		const rows: string[] = [];
		for (let y = 0; y < VIDEX_ROWS; y++) {
			let s = "";
			for (let x = 0; x < VIDEX_COLUMNS; x++) {
				const c = this.cell(x, y) & 0x7f;
				s += c >= 0x20 && c < 0x7f ? String.fromCharCode(c) : " ";
			}
			rows.push(s);
		}
		return rows;
	}

	/** Whether the monitor shows this card: annunciator 0 on and the Apple in text mode. */
	static showing(annunciators: number, graphics: boolean): boolean {
		return (annunciators & 1) !== 0 && !graphics;
	}

	/**
	 * The picture, 720 by 216, into RGBA `into`. Bit 7 of a cell is the alternate set, drawn
	 * inverse. The cursor follows R10: mode in bits 6-5, first line in bits 4-0, last line R11.
	 * `fields` counts vertical fields, for the blink.
	 */
	paint(into: Uint8ClampedArray, fields: number, on: readonly number[] = [0x40, 0xff, 0x40], off: readonly number[] = [0, 0, 0]): void {
		const cursor = this.cursor;
		const r10 = this.regs[10]!;
		const blinkMode = (r10 >> 5) & 3;
		const cursorShown = blinkMode === 0 || (blinkMode === 2 && (fields & 16) === 0) || (blinkMode === 3 && (fields & 32) === 0);
		const first = r10 & 31;
		const last = this.regs[11]! & 31;
		const cols = this.regs[1] || VIDEX_COLUMNS;
		for (let y = 0; y < VIDEX_ROWS; y++) {
			for (let x = 0; x < VIDEX_COLUMNS; x++) {
				const addr = (this.start + y * cols + x) & 0x7ff;
				const c = this.ram[addr]!;
				const here = cursorShown && addr === (cursor & 0x7ff);
				for (let line = 0; line < VIDEX_CELL_HEIGHT; line++) {
					let bits = this.chars[(c & 0x7f) * 16 + line]!;
					if (c & 0x80) bits ^= 0xff;
					if (here && line >= first && line <= last) bits ^= 0xff;
					const row = (y * VIDEX_CELL_HEIGHT + line) * VIDEX_PICTURE_WIDTH + x * VIDEX_CELL_WIDTH;
					for (let d = 0; d < VIDEX_CELL_WIDTH; d++) {
						const lit = d < 8 ? (bits >> (7 - d)) & 1 : bits & 1;
						const color = lit ? on : off;
						const at = (row + d) * 4;
						into[at] = color[0]!;
						into[at + 1] = color[1]!;
						into[at + 2] = color[2]!;
						into[at + 3] = 255;
					}
				}
			}
		}
	}
}

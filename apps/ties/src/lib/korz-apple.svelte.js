// The Apple ][+ on a Korz rung. The motherboard ROM, the Disk II ROM, and the character
// generator are the files in packages/cabinet/roms/apple2. A rung change rebuilds the
// board and resets, which is the reboot a swap does until an Apple snapshot exists.
// A cartridge's chargen ROM replaces the character generator.
// Hi-res color is the ][+ rule: a lit dot
// takes its hue from where it sits on the line and from bit 7, two lit dots in a row are
// white, and a dark dot between two of the same kind keeps the color beside it.

import { APPLE_HZ } from '@wwsff/cabinet/angel';
import { Apple2Plus, DiskII, Korz6502, M6502, glyphsFromRom } from '@wwsff/cabinet/korz/apple2';
import { FRAME_BYTES, FRAME_HEIGHT, FRAME_WIDTH, appleKey } from '@wwsff/cabinet/microm8';
import plusRomUrl from '../../../../packages/cabinet/roms/apple2/apple2plus.rom?url';
import diskRomUrl from '../../../../packages/cabinet/roms/apple2/diskii.rom?url';
import chargenRomUrl from '../../../../packages/cabinet/roms/apple2/chargen.rom?url';

const BLACK = [0, 0, 0];
const WHITE = [0xf0, 0xf0, 0xf0];
/** Even byte, then odd byte. Each is bit 7 clear, then set; each of those is an even dot, then an odd one. */
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
/** 0 black, 1 green, 2 violet, 5 orange, 6 blue, 7 white. 3 and 4 are the second black and white. */
const HGR = [
	[0, 0, 0],
	[0x14, 0xf5, 0x3c],
	[0xff, 0x44, 0xfd],
	[0xff, 0xff, 0xff],
	[0, 0, 0],
	[0xff, 0x6a, 0x3c],
	[0x14, 0xcf, 0xfd],
	[0xff, 0xff, 0xff]
];
const hiresByte = new Uint8Array(40);
const hiresMono = new Uint8Array(280);
const hiresHue = new Uint8Array(280);
const LORES = [
	[0, 0, 0],
	[148, 12, 125],
	[32, 54, 212],
	[194, 54, 255],
	[0, 118, 26],
	[128, 128, 128],
	[20, 140, 255],
	[174, 174, 255],
	[80, 80, 0],
	[255, 108, 0],
	[128, 128, 128],
	[255, 140, 255],
	[0, 203, 0],
	[220, 220, 0],
	[80, 255, 80],
	[255, 255, 255]
];

/** @param {import('@wwsff/cabinet/korz/apple2').Apple2Plus} board */
function modes(board) {
	const m = board.mode();
	const out = [];
	if (!m.graphics) out.push(m.page2 ? 'TXT2' : 'TEXT');
	else if (m.hires) out.push(m.page2 ? 'HGR2' : 'HGR');
	else out.push(m.page2 ? 'GR2' : 'GR');
	if (m.mixed) out.push('MIXED');
	return out;
}

/**
 * @param {Uint8Array} ram
 * @param {ReturnType<import('@wwsff/cabinet/korz/apple2').Apple2Plus['mode']>} mode
 * @param {Uint8Array} face
 * @param {Uint8ClampedArray} into
 * @param {boolean} flash
 */
function paint(ram, mode, face, into, flash) {
	for (let y = 0; y < FRAME_HEIGHT; y++) {
		const hires = mode.graphics && mode.hires && !(mode.mixed && y >= 160);
		const lores = mode.graphics && !mode.hires && !(mode.mixed && y >= 160);
		for (let col = 0; col < 40; col++) {
			let addr;
			if (hires) {
				const base = mode.page2 ? 0x4000 : 0x2000;
				addr = base + (y & 7) * 0x400 + ((y >> 3) & 7) * 0x80 + (y >> 6) * 0x28 + col;
			} else {
				const base = mode.page2 ? 0x800 : 0x400;
				const row = y >> 3;
				addr = base + (row & 7) * 0x80 + (row >> 3) * 0x28 + col;
			}
			const byte = ram[addr] ?? 0;
			const x0 = (y * FRAME_WIDTH + col * 14) * 4;
			if (hires) {
				hiresByte[col] = byte;
			} else if (lores) {
				const color = LORES[(y & 4 ? byte >> 4 : byte) & 0xf] ?? BLACK;
				for (let d = 0; d < 14; d++) {
					const at = x0 + d * 4;
					into[at] = color[0];
					into[at + 1] = color[1];
					into[at + 2] = color[2];
					into[at + 3] = 255;
				}
			} else {
				const inverse = byte < 0x40 || (byte < 0x80 && flash);
				const raw = face[(byte & 0x3f) * 8 + (y & 7)] ?? 0;
				let bits = raw;
				if (inverse) bits ^= 0x7f;
				for (let b = 0; b < 7; b++) {
					const on = (bits >> b) & 1;
					const color = on ? WHITE : BLACK;
					for (let d = 0; d < 2; d++) {
						const at = x0 + (b * 2 + d) * 4;
						into[at] = color[0];
						into[at + 1] = color[1];
						into[at + 2] = color[2];
						into[at + 3] = 255;
					}
				}
				// A cursor is the inverse of a blank glyph, a solid block. The character ROM
				// leaves the rightmost dot of every glyph dark, so the block reaches back
				// one dot and meets the character before it.
				if (inverse && raw === 0 && col > 0) {
					for (let d = 1; d <= 2; d++) {
						const at = x0 - d * 4;
						into[at] = WHITE[0];
						into[at + 1] = WHITE[1];
						into[at + 2] = WHITE[2];
						into[at + 3] = 255;
					}
				}
			}
		}
		if (hires) paintHires(y, into);
	}
}

/** One hi-res scan line, 280 dots doubled to 560. A lit dot's hue depends on the byte's parity, bit 7, and the dot's parity, so the phase continues across the seven-dot bytes. Two lit dots in a row are white. A dark dot with the same kind of dot on both sides keeps the color to its left, which is how a 10101010 run becomes a solid color. */
function paintHires(y, into) {
	for (let j = 0; j < 40; j++) {
		let abyte = hiresByte[j] ?? 0;
		const which = (abyte & 0x80) >> 7;
		const hue = HUE[j & 1][which];
		for (let k = 0; k < 7; k++) {
			const x = j * 7 + k;
			const on = abyte & 1;
			hiresMono[x] = on;
			hiresHue[x] = on ? hue[k & 1] : 0;
			if (x % 14 === 6 && j < 39) {
				const next = hiresByte[j + 1] ?? 0;
				if (hiresHue[x] === 2 && next & 0x80 && (next & 1) === 0) hiresHue[x] = 6;
			}
			abyte >>= 1;
		}
	}
	const row = y * FRAME_WIDTH * 4;
	let prev = 0;
	for (let k = 0; k < 280; k++) {
		let c = hiresHue[k];
		const on = hiresMono[k];
		const left = k > 0 ? hiresMono[k - 1] : 0;
		const right = k < 279 ? hiresMono[k + 1] : 0;
		if (on && (left || right)) c = 7;
		else if (!on && left === right) c = prev;
		prev = c;
		const color = HGR[c] ?? BLACK;
		const at = row + k * 8;
		into[at] = into[at + 4] = color[0];
		into[at + 1] = into[at + 5] = color[1];
		into[at + 2] = into[at + 6] = color[2];
		into[at + 3] = into[at + 7] = 255;
	}
}

/**
 * @param {string} url
 * @param {number} bytes
 */
async function romFile(url, bytes) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`could not read ${url}`);
	const rom = new Uint8Array(await res.arrayBuffer());
	if (rom.length !== bytes) throw new Error(`${url} is ${rom.length} bytes; it is ${bytes}`);
	return rom;
}

/** @typedef {{ name: string, bytes: Uint8Array, drive: number, protect?: boolean }} DiskIn */

class KorzApple {
	/** @type {'compile' | 'switch' | 'resolve' | 'interpret'} */
	rung = 'compile';
	/** @type {'idle' | 'loading' | 'running' | 'error'} */
	phase = $state('idle');
	error = $state('');
	/** @type {string[]} */
	drives = $state(['', '']);
	caps = $state(true);
	sound = $state(true);
	warp = $state(1);
	/** Pictures per game second while running flat out. 0 paints every animation frame. */
	picturesPerSecond = 0;
	locked = $state('');
	mouseStick = $state(false);
	gamepad = $state('');
	annunciators = $state(0);
	videxShowing = $state(false);
	mhz = $state(0);
	/** @type {{ pc: number, modes: string[] } | null} */
	status = $state(null);

	/** @type {import('@wwsff/cabinet/korz/apple2').Apple2Plus | null} */
	#board = null;
	/** @type {import('@wwsff/cabinet/korz/apple2').M6502 | null} */
	#cpu = null;
	/** @type {import('@wwsff/cabinet/korz/apple2').DiskII | null} */
	#disk = null;
	/** @type {{ rom: Uint8Array, slot: Uint8Array, chargen: Uint8Array } | null} */
	#rom = null;
	/** A cartridge's character ROM, in the motherboard socket's layout. Null uses the ][+ generator. */
	/** @type {Uint8Array | null} */
	#chargen = null;
	/** @type {(DiskIn | null)[]} */
	#images = [null, null];
	/** @type {number[]} */
	#keys = [];
	#pixels = new Uint8ClampedArray(FRAME_BYTES);
	#mark = 0;
	#last = 0;
	/** @type {Promise<void> | null} */
	#booting = null;

	get picture() {
		return { width: FRAME_WIDTH, height: FRAME_HEIGHT, data: this.#pixels };
	}

	seconds() {
		return (this.#board?.cycles ?? 0) / APPLE_HZ;
	}

	async #ensureRom() {
		if (this.#rom) return;
		const [rom, slot, chargen] = await Promise.all([romFile(plusRomUrl, 0x3000), romFile(diskRomUrl, 0x100), romFile(chargenRomUrl, 64 * 8)]);
		this.#rom = { rom, slot, chargen: glyphsFromRom(chargen) };
	}

	/**
	 * Plug a character ROM into the motherboard socket, or pass null for the emulator's
	 * ][+ generator. `rom` is 64 glyphs of 8 bytes, low 7 bits, bit 0 at the left.
	 * @param {Uint8Array | null} rom
	 */
	set chargen(rom) {
		this.#chargen = rom ? glyphsFromRom(rom) : null;
	}

	/** Keep what the drives have written, then build a new board on `rung` and reset. */
	#build() {
		const rom = this.#rom;
		if (!rom) return;
		if (this.#disk) {
			for (let i = 0; i < 2; i++) {
				const cur = this.#images[i];
				const written = cur ? this.#disk.image(i + 1) : null;
				if (cur && written) this.#images[i] = { ...cur, bytes: written };
			}
		}
		const board = new Apple2Plus(rom.rom);
		board.installLanguageCard();
		const disk = new DiskII(rom.slot);
		for (const image of this.#images) {
			if (!image) continue;
			disk.insert(/** @type {1 | 2} */ (image.drive + 1), image.bytes, image.name);
			if (image.protect) disk.protect(/** @type {1 | 2} */ (image.drive + 1), true);
		}
		board.plug(6, disk);
		const cpu = this.rung === 'switch' ? new M6502(board) : new Korz6502(board, { korz: this.rung });
		cpu.reset();
		this.#board = board;
		this.#cpu = cpu;
		this.#disk = disk;
		this.#mark = board.cycles;
		this.#paint();
		this.status = { pc: cpu.pc, modes: modes(board) };
		this.annunciators = board.annunciators;
	}

	#paint() {
		const board = this.#board;
		const face = this.#chargen ?? this.#rom?.chargen;
		if (!board || !face) return;
		const flash = ((Date.now() / 500) | 0) % 2 === 0;
		paint(board.ram, board.mode(), face, this.#pixels, flash);
	}

	#pump() {
		const board = this.#board;
		if (!board || !this.#keys.length || board.key & 0x80) return;
		board.press(this.#keys.shift() ?? 0);
	}

	/** @param {number} limit */
	#step(limit) {
		const cpu = this.#cpu;
		const board = this.#board;
		if (!cpu || !board || board.cycles >= limit) return;
		if ('compiler' in cpu && cpu.compiler && limit - board.cycles <= 80) cpu.one();
		else cpu.step();
		this.#pump();
	}

	/** @param {number} [_now] */
	#run(_now) {
		const board = this.#board;
		if (!board) return;
		// The frame's own timestamp is already late by the time this runs, and a budget
		// measured from it does no work at all. Measure the slice from now.
		const start = performance.now();
		const budget = start + 12;
		const dt = this.#last ? Math.min(50, start - this.#last) : 1000 / 60;
		this.#last = start;
		if (this.picturesPerSecond > 0) {
			const span = APPLE_HZ / this.picturesPerSecond;
			if (this.#mark <= board.cycles) this.#mark = board.cycles + span;
			while (performance.now() < budget && board.cycles < this.#mark) this.#step(this.#mark);
			if (board.cycles >= this.#mark) {
				this.#paint();
				this.#mark += span;
			}
			return;
		}
		const end = board.cycles + Math.round((APPLE_HZ * Math.max(this.warp, 0) * dt) / 1000);
		while (performance.now() < budget && board.cycles < end) this.#step(end);
		this.#paint();
	}

	/**
	 * @param {DiskIn[]} entries
	 */
	boot(entries) {
		this.#booting ??= this.#boot(entries);
		return this.#booting.finally(() => {
			this.#booting = null;
		});
	}

	/** @param {DiskIn[]} entries */
	async #boot(entries) {
		this.phase = 'loading';
		this.error = '';
		try {
			await this.#ensureRom();
			this.#images = [null, null];
			for (const e of entries) this.#images[e.drive] = e;
			this.drives = [this.#images[0]?.name ?? '', this.#images[1]?.name ?? ''];
			this.#build();
			// No disk: run the monitor's opening delay here, so the first picture is the
			// Applesoft banner rather than the power-on screen of inverse @.
			if (!this.#images[0] && !this.#images[1] && this.#board) {
				const deadline = performance.now() + 800;
				const goal = this.#board.cycles + 200_000;
				while (performance.now() < deadline && this.#board.cycles < goal) this.#step(goal);
				this.#paint();
			}
			this.phase = 'running';
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
			this.phase = 'error';
			throw e;
		}
	}

	/** Switch on with whatever is already in the drives. */
	power() {
		if (this.phase === 'running' || this.phase === 'loading') return Promise.resolve();
		return this.boot(this.#images.filter((e) => e !== null));
	}

	/** @param {'compile' | 'switch' | 'resolve' | 'interpret'} rung */
	use(rung) {
		this.rung = rung;
		if (this.#rom && this.phase === 'running') this.#build();
	}

	/**
	 * @param {string} name
	 * @param {Uint8Array} bytes
	 * @param {number} drive
	 * @param {string} [_profile]
	 * @param {boolean} [protect]
	 */
	async insert(name, bytes, drive = 0, _profile = '', protect = false) {
		const entry = { name, bytes, drive, protect };
		if (this.phase !== 'running') {
			const next = [...this.#images];
			next[drive] = entry;
			await this.boot(/** @type {DiskIn[]} */ (next.filter((e) => e)));
			return;
		}
		this.#images[drive] = entry;
		this.#disk?.insert(/** @type {1 | 2} */ (drive + 1), bytes, name);
		if (protect) this.#disk?.protect(/** @type {1 | 2} */ (drive + 1), true);
		const names = [...this.drives];
		names[drive] = name;
		this.drives = names;
	}

	reboot() {
		if (!this.#rom) return;
		this.#keys.length = 0;
		this.#build();
		this.phase = 'running';
	}

	reset() {
		this.#keys.length = 0;
		this.#cpu?.reset();
	}

	/** @param {string} text */
	type(text) {
		for (const ch of text.replaceAll('\n', '\r')) {
			const c = ch.charCodeAt(0);
			if (c < 128) this.#keys.push(c);
		}
	}

	/** @param {KeyboardEvent} ev */
	press(ev) {
		if (this.locked || !this.#board) return false;
		const code = appleKey(ev, this.caps);
		if (code === null) return false;
		this.#board.press(code);
		return true;
	}

	/** @param {number} drive */
	saved(drive = 0) {
		return this.#disk?.image(/** @type {1 | 2} */ (drive + 1)) ?? null;
	}

	listen() {}

	/** @param {HTMLCanvasElement} canvas */
	attach(canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return () => {};
		ctx.imageSmoothingEnabled = false;
		const image = new ImageData(this.#pixels, FRAME_WIDTH, FRAME_HEIGHT);
		let raf = 0;
		let polled = 0;
		let lastCycles = 0;
		/** @param {number} now */
		const tick = (now) => {
			raf = requestAnimationFrame(tick);
			if (!this.#cpu || !this.#board) return;
			try {
				this.#run(now);
			} catch (e) {
				this.error = e instanceof Error ? e.stack ?? e.message : String(e);
				this.phase = 'error';
				cancelAnimationFrame(raf);
				return;
			}
			ctx.putImageData(image, 0, 0);
			if (now - polled > 250) {
				const cycles = this.#board.cycles;
				if (polled) this.mhz = (cycles - lastCycles) / (now - polled) / 1000;
				polled = now;
				lastCycles = cycles;
				this.status = { pc: this.#cpu.pc, modes: modes(this.#board) };
				this.annunciators = this.#board.annunciators;
			}
		};
		raf = requestAnimationFrame(tick);
		if (this.#board) ctx.putImageData(image, 0, 0);
		return () => cancelAnimationFrame(raf);
	}
}

export const korzApple = new KorzApple();

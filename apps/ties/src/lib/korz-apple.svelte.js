// The Apple ][+ on a Korz rung. The motherboard ROM, the Disk II ROM, and the character
// generator are the files in packages/cabinet/roms/apple2. A rung change rebuilds the
// board and resets, which is the reboot a swap does until an Apple snapshot exists.
// A cartridge's chargen ROM replaces the character generator.
// A disk whose profile names the Videx (Don's ProDOS Forth) puts a Videx Videoterm in slot 3
// for the rest of the session; its 80 columns show on the page's second canvas while
// annunciator 0 is on and the Apple is in text mode.
// Hi-res color is one pixel per 14 MHz clock. Each of the seven bits lasts two
// clocks, and bit 7 delays that byte by one clock, so the two halves of a bit
// can be different colors. The palette is the scan renderer's.

import { APPLE_HZ } from '@wwsff/cabinet/angel';
import { Apple2Plus, DiskII, HIRES_PALETTE, Korz6502, M6502, VIDEX_PICTURE_HEIGHT, VIDEX_PICTURE_WIDTH, Videx, glyphsFromRom, hiresLine } from '@wwsff/cabinet/korz/apple2';
import { block65Node, compiler65Node, dispatchNode, lister65, sea65Node } from '@wwsff/cabinet/korz/inspect';
import { FRAME_BYTES, FRAME_HEIGHT, FRAME_WIDTH, appleKey } from '@wwsff/cabinet/microm8';
import plusRomUrl from '../../../../packages/cabinet/roms/apple2/apple2plus.rom?url';
import diskRomUrl from '../../../../packages/cabinet/roms/apple2/diskii.rom?url';
import chargenRomUrl from '../../../../packages/cabinet/roms/apple2/chargen.rom?url';
import videxFirmwareUrl from '../../../../packages/cabinet/roms/apple2/videx-fw24.rom?url';
import videxCharsUrl from '../../../../packages/cabinet/roms/apple2/videx-chr.rom?url';

const BLACK = [0, 0, 0];
const WHITE = [0xf0, 0xf0, 0xf0];
const hiresByte = new Uint8Array(40);
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
 * What the CPU and I/O panels show: the 6502's registers and the board's soft switches.
 * @param {import('@wwsff/cabinet/korz/apple2').M6502} cpu
 * @param {import('@wwsff/cabinet/korz/apple2').Apple2Plus} board
 */
function snapshot(cpu, board) {
	return { pc: cpu.pc, a: cpu.a, x: cpu.x, y: cpu.y, sp: cpu.s, p: cpu.p, cycles: board.cycles, modes: modes(board), switches: board.mode() };
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
			}
		}
		if (hires) paintHires(y, into);
	}
}

/** One hi-res scan line, 560 pixels. The colors are `hiresLine`. */
function paintHires(y, into) {
	const colors = hiresLine(hiresByte);
	const row = y * FRAME_WIDTH * 4;
	for (let x = 0; x < FRAME_WIDTH; x++) {
		const color = HIRES_PALETTE[colors[x]] ?? BLACK;
		const at = row + x * 4;
		into[at] = color[0];
		into[at + 1] = color[1];
		into[at + 2] = color[2];
		into[at + 3] = 255;
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

/** @typedef {{ name: string, bytes: Uint8Array, drive: number, protect?: boolean, profile?: string }} DiskIn */

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
	/** @type {ReturnType<typeof snapshot> | null} */
	status = $state(null);

	/** @type {import('@wwsff/cabinet/korz/apple2').Apple2Plus | null} */
	#board = null;
	/** @type {import('@wwsff/cabinet/korz/apple2').M6502 | null} */
	#cpu = null;
	/** @type {import('@wwsff/cabinet/korz/apple2').DiskII | null} */
	#disk = null;
	/** @type {{ rom: Uint8Array, slot: Uint8Array, chargen: Uint8Array, videxFirmware: Uint8Array, videxChars: Uint8Array } | null} */
	#rom = null;
	/** Set by a disk that wants the Videx; the card stays in slot 3 from then on. */
	#wantVidex = false;
	/** @type {import('@wwsff/cabinet/korz/apple2').Videx | null} */
	#videx = null;
	#videxPixels = new Uint8ClampedArray(VIDEX_PICTURE_WIDTH * VIDEX_PICTURE_HEIGHT * 4);
	#fields = 0;
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
	/** Cycle the speaker samples have been generated up to. */
	#heard = 0;
	/** @type {{ ctx: AudioContext, out: AudioNode, gain: GainNode, next: number } | null} */
	#audio = null;
	#samples = new Float32Array(44100);
	/** @type {Promise<void> | null} */
	#booting = null;

	get picture() {
		return { width: FRAME_WIDTH, height: FRAME_HEIGHT, data: this.#pixels };
	}

	seconds() {
		return (this.#board?.cycles ?? 0) / APPLE_HZ;
	}

	/** The KORZ panel's tree: the 6502's compiled blocks, its sea, and the dispatch methods. */
	korzRoots() {
		const cpu = this.#cpu;
		const out = [];
		const korz = cpu instanceof Korz6502 ? cpu : null;
		if (korz?.compiler) out.push(compiler65Node(korz.compiler, lister65(korz)));
		if (korz) out.push(sea65Node(korz));
		if (out.length) out.push(dispatchNode());
		else out.push({ id: 'none', label: 'No Korz structures', note: 'the switch-statement 6502 has none; pick a Korz level in the CPU menu' });
		return out;
	}

	/** The compiled block that starts at the PC, if there is one. */
	korzFollow() {
		const cpu = this.#cpu;
		if (!(cpu instanceof Korz6502) || !cpu.compiler) return null;
		const b = cpu.compiler.list().find((x) => x.entry === (cpu.pc & 0xffff));
		return b ? block65Node(b, lister65(cpu)) : null;
	}

	async #ensureRom() {
		if (this.#rom) return;
		const [rom, slot, chargen, videxFirmware, videxChars] = await Promise.all([
			romFile(plusRomUrl, 0x3000),
			romFile(diskRomUrl, 0x100),
			romFile(chargenRomUrl, 64 * 8),
			romFile(videxFirmwareUrl, 0x400),
			romFile(videxCharsUrl, 0x800)
		]);
		this.#rom = { rom, slot, chargen: glyphsFromRom(chargen), videxFirmware, videxChars };
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
		this.#videx = null;
		if (this.#wantVidex) this.#plugVidex(board);
		const cpu = this.rung === 'switch' ? new M6502(board) : new Korz6502(board, { korz: this.rung });
		cpu.reset();
		this.#board = board;
		this.#cpu = cpu;
		this.#disk = disk;
		this.#mark = board.cycles;
		this.#heard = board.cycles;
		board.takeSpeaker();
		this.#paint();
		this.status = snapshot(cpu, board);
		this.annunciators = board.annunciators;
	}

	/** @param {import('@wwsff/cabinet/korz/apple2').Apple2Plus} board */
	#plugVidex(board) {
		const rom = this.#rom;
		if (!rom) return;
		this.#videx = new Videx(rom.videxFirmware, rom.videxChars);
		board.plug(3, this.#videx);
	}

	#paint() {
		const board = this.#board;
		const face = this.#chargen ?? this.#rom?.chargen;
		if (!board || !face) return;
		const flash = ((Date.now() / 500) | 0) % 2 === 0;
		paint(board.ram, board.mode(), face, this.#pixels, flash);
		const showing = !!this.#videx && Videx.showing(board.annunciators, board.graphics);
		if (showing) this.#videx?.paint(this.#videxPixels, this.#fields++, WHITE, BLACK);
		if (this.videxShowing !== showing) this.videxShowing = showing;
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
			this.#speak();
			return;
		}
		const end = board.cycles + Math.round((APPLE_HZ * Math.max(this.warp, 0) * dt) / 1000);
		while (performance.now() < budget && board.cycles < end) this.#step(end);
		this.#paint();
		this.#speak();
	}

	/**
	 * Open the page's audio. Browsers start sound only after a click or key.
	 */
	listen() {
		if (this.#audio) {
			if (this.#audio.ctx.state === 'suspended') this.#audio.ctx.resume();
			return;
		}
		if (typeof AudioContext === 'undefined') return;
		const ctx = new AudioContext();
		const highpass = ctx.createBiquadFilter();
		highpass.type = 'highpass';
		highpass.frequency.value = 20;
		const gain = ctx.createGain();
		gain.gain.value = 0.3 * this.#volume;
		highpass.connect(gain).connect(ctx.destination);
		this.#audio = { ctx, out: highpass, gain, next: 0 };
	}

	#volume = 1;
	/** The speaker's loudness, 0 to 1, on top of the page's own level. */
	get volume() {
		return this.#volume;
	}
	set volume(v) {
		this.#volume = v;
		if (this.#audio) this.#audio.gain.gain.value = 0.3 * v;
	}

	/** Turn the speaker flips since last time into samples and queue them. */
	#speak() {
		const board = this.#board;
		if (!board) return;
		const flips = board.takeSpeaker();
		const end = board.cycles;
		const start = this.#heard;
		this.#heard = end;
		const audio = this.#audio;
		if (!this.sound || !audio || end <= start) return;
		const rate = 44100;
		const n = Math.min(this.#samples.length, Math.max(1, Math.round(((end - start) * rate) / APPLE_HZ)));
		let level = board.speaker & 1;
		for (let i = flips.length - 1; i >= 0; i--) if ((flips[i] ?? 0) > start) level ^= 1;
		let fi = 0;
		while (fi < flips.length && (flips[fi] ?? 0) <= start) fi++;
		const span = end - start;
		const samples = this.#samples;
		for (let s = 0; s < n; s++) {
			const cycle = start + ((s + 0.5) * span) / n;
			while (fi < flips.length && (flips[fi] ?? 0) <= cycle) {
				level ^= 1;
				fi++;
			}
			samples[s] = level ? 1 : -1;
		}
		const now = audio.ctx.currentTime;
		if (audio.next < now + 0.02) audio.next = now + 0.05;
		if (audio.next > now + 0.3) return;
		const buffer = audio.ctx.createBuffer(1, n, rate);
		buffer.copyToChannel(samples.subarray(0, n), 0);
		const src = audio.ctx.createBufferSource();
		src.buffer = buffer;
		src.connect(audio.out);
		src.start(audio.next);
		audio.next += n / rate;
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
			if (entries.some((e) => e.profile?.includes('videx'))) this.#wantVidex = true;
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
	 * @param {string} [profile]
	 * @param {boolean} [protect]
	 */
	async insert(name, bytes, drive = 0, profile = '', protect = false) {
		const entry = { name, bytes, drive, protect, profile };
		if (profile.includes('videx')) {
			this.#wantVidex = true;
			if (this.#board && !this.#videx) this.#plugVidex(this.#board);
		}
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

	/** @param {HTMLCanvasElement} canvas @param {HTMLCanvasElement | null} [videxCanvas] */
	attach(canvas, videxCanvas = null) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return () => {};
		ctx.imageSmoothingEnabled = false;
		const image = new ImageData(this.#pixels, FRAME_WIDTH, FRAME_HEIGHT);
		const vctx = videxCanvas?.getContext('2d') ?? null;
		const videxImage = new ImageData(this.#videxPixels, VIDEX_PICTURE_WIDTH, VIDEX_PICTURE_HEIGHT);
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
			if (vctx && this.videxShowing) vctx.putImageData(videxImage, 0, 0);
			if (now - polled > 250) {
				const cycles = this.#board.cycles;
				if (polled) this.mhz = (cycles - lastCycles) / (now - polled) / 1000;
				polled = now;
				lastCycles = cycles;
				this.status = snapshot(this.#cpu, this.#board);
				this.annunciators = this.#board.annunciators;
			}
		};
		raf = requestAnimationFrame(tick);
		if (this.#board) ctx.putImageData(image, 0, 0);
		return () => cancelAnimationFrame(raf);
	}
}

export const korzApple = new KorzApple();

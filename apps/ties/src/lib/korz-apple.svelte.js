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
import { hushWhenHidden } from './hidden-hush.js';
import { Apple2Plus, DiskII, HIRES_PALETTE, Korz6502, M6502, Trace65, VIDEX_PICTURE_HEIGHT, VIDEX_PICTURE_WIDTH, Videx, glyphsFromRom, hiresLine } from '@wwsff/cabinet/korz/apple2';
import { APPLE2_CALLS, APPLE2_REGIONS, switchWord, APPLE2_VOICES, Deltas, Tally } from '@wwsff/cabinet/dance';

/** The ROM routines the dance listens for, by entry address. */
const CALLS = new Map(APPLE2_CALLS.map((c) => [c.addr, c]));
import { BusDance, speedLoad } from './bus-dance.svelte.js';
import { block65Node, compiler65Node, dispatchNode, lister65, sea65Node } from '@wwsff/cabinet/korz/inspect';
import { FRAME_BYTES, FRAME_HEIGHT, FRAME_WIDTH, appleKey } from '@wwsff/cabinet/microm8';
import plusRomUrl from '../../../../packages/cabinet/roms/apple2/apple2plus.rom?url';
import diskRomUrl from '../../../../packages/cabinet/roms/apple2/diskii.rom?url';
import chargenRomUrl from '../../../../packages/cabinet/roms/apple2/chargen.rom?url';
import videxFirmwareUrl from '../../../../packages/cabinet/roms/apple2/videx-fw24.rom?url';
import videxCharsUrl from '../../../../packages/cabinet/roms/apple2/videx-chr.rom?url';

const BLACK = [0, 0, 0];
/**
 * The speeds the speaker plays at. Slower, its flips are a click per instruction, not a tone;
 * faster, the samples outrun the page's audio. Outside, the dance and the ROM calls still play.
 */
const SPEAKER_SPEEDS = { min: 0.01, max: 4 };
/** The speaker cone's pull back to rest, per sample: a level held still is silence. */
const CONE = 0.995;
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
	/** Trace pace: one instruction every this many ms, the views following; 0 runs by `warp`. */
	traceMs = 0;
	#traceOwed = 0;
	/** Pictures per game second while running flat out. 0 paints every animation frame. */
	picturesPerSecond = 0;
	locked = $state('');
	mouseStick = $state(false);
	gamepad = $state('');
	annunciators = $state(0);
	/** The panel's bytes at `$C041`–`$C04F`, as last read: what the program and the person have set. */
	panel = $state(/** @type {number[]} */ ([]));
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
	/** The cone filter's last input and output, carried from one buffer to the next. */
	#cone = { x: 0, y: 0 };
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
		// Switches stay where they were flipped, as on a front panel: a reboot leaves them.
		if (this.#board) board.panel.set(this.#board.panel);
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
		this.#readPanel();
	}

	/** Bring `panel` and the dance's twist up to date with the board's bits. */
	#readPanel() {
		const bits = this.#board?.panel;
		if (!bits) return;
		if (bits.some((b, i) => b !== this.panel[i])) this.panel = [...bits];
		this.dance.switches = switchWord(bits);
	}

	/** The person flips panel bit `n`, 0 to 119: `$C041` holds bits 0–7, bit 0 its low bit. @param {number} n */
	flip(n) {
		this.#board?.flip(n);
		this.#readPanel();
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

	/** The instructions run, while the memory panel's trace view shows them; null otherwise. */
	#trace = /** @type {Trace65 | null} */ (null);
	#ring = new Trace65();

	/** The trace records only while asked: a compiled block runs as one step, so recording steps one instruction at a time. @param {boolean} on */
	tracing(on) {
		this.#trace = on ? this.#ring : null;
	}
	get trace() {
		return this.#ring;
	}
	/** The byte at `addr` with no bus cycle: soft switches are not touched, the panel and RAM and ROM are read. @param {number} addr */
	peek(addr) {
		return this.#board?.peek(addr & 0xffff) ?? 0;
	}
	/** The 6502's PC now, or -1 before a board. */
	get pc() {
		return this.#cpu?.pc ?? -1;
	}

	/** @param {number} limit */
	#step(limit) {
		const cpu = this.#cpu;
		const board = this.#board;
		if (!cpu || !board || board.cycles >= limit) return;
		const trace = this.#trace;
		if (trace) {
			const pc = cpu.pc;
			trace.record(pc, board.peek(pc), board.peek((pc + 1) & 0xffff), board.peek((pc + 2) & 0xffff), cpu.a, cpu.x, cpu.y, cpu.p, cpu.s);
		}
		const compiled = 'compiler' in cpu && !!cpu.compiler;
		const alone = compiled && (trace || this.traceMs > 0 || limit - board.cycles <= 80);
		if (alone) cpu.one();
		else cpu.step();
		// A lone instruction runs no block, so it counts where its PC lands.
		if (this.dance.on && (!compiled || alone)) {
			this.#dancePcs.add(cpu.pc);
			if (CALLS.has(cpu.pc)) this.#callPcs.add(cpu.pc);
		}
		this.#pump();
	}

	/**
	 * The bus dance: the 6502's blocks (or, without a compiler, where its PC was), the Disk II's
	 * head while the motor runs, and the speaker's click rate, over a diesel engine that throbs
	 * faster with the speed and opens up with Applesoft's free memory.
	 */
	dance = new BusDance(APPLE2_VOICES, 'diesel');
	constructor() {
		this.dance.regions = APPLE2_REGIONS;
	}
	#danceBlocks = new Deltas();
	#callBlocks = new Deltas();
	#callPcs = new Tally();
	#callsAt = -Infinity;
	#dancePcs = new Tally();
	#danceHead = -1;
	#danceClicks = 0;
	#danceAt = { cycles: 0, ms: 0 };
	/** Which prompt the Apple was at, at the last frame, or null. */
	#dancePrompt = /** @type {string | null} */ (null);

	/**
	 * Each prompt has its own song: Applesoft's sunny, another while an Applesoft program runs,
	 * Integer BASIC's techno in C minor, and the Monitor's (CALL -151) dark and industrial, each
	 * with its own riff and drums, which go when the Apple leaves its prompts for a program of
	 * its own. The two BASICs keep one tempo: they differ in key, riff and instruments. A BASIC
	 * program's length is a watched track and the harmony's depth: as it gets longer, the pad
	 * reaches an octave down, then two. The Monitor is as deep as it goes.
	 */
	#danceWatched() {
		const board = this.#board;
		if (!board) return [];
		const at = prompt(board.ram);
		if (at.mode !== this.#dancePrompt) this.dance.mode(at.mode ? PROMPT_MUSIC[at.mode] : { riff: null });
		this.#dancePrompt = at.mode;
		if (at.mode === null) return [];
		this.dance.depth = at.mode === 'monitor' ? 1 : Math.log2(Math.max(1, at.length / 32)) / 7;
		return at.mode === 'monitor' ? [] : [{ name: 'program', value: at.length }];
	}

	/**
	 * The ROM routines entered since the last beat (APPLE2_CALLS). Compiled, a call is a run of
	 * the block that starts at the routine, since a JSR's target starts a block; stepped, it is
	 * the PC landing on the entry.
	 */
	#danceCalls() {
		const cpu = this.#cpu;
		const compiler = cpu && 'compiler' in cpu ? cpu.compiler : null;
		const pcs = this.#callPcs.take();
		const hits = compiler
			? [...this.#callBlocks.step(compiler.list().flatMap((b) => (CALLS.has(b.entry) ? [/** @type {[number, number]} */ ([b.entry, b.runs])] : []))), ...pcs]
			: pcs;
		// After a gap (the dance just turned on, the tab came back) the counts are history, not news.
		const ms = performance.now();
		const fresh = ms - this.#callsAt > 1000;
		this.#callsAt = ms;
		if (fresh) return [];
		return hits.flatMap((h) => {
			const c = CALLS.get(h.key);
			return c ? [{ name: c.name, calls: h.weight, sound: c.sound }] : [];
		});
	}

	#danceHits() {
		const cpu = this.#cpu;
		const board = this.#board;
		const disk = this.#disk;
		const compiler = cpu && 'compiler' in cpu ? cpu.compiler : null;
		const head = disk?.head ?? 0;
		const moved = head !== this.#danceHead;
		this.#danceHead = head;
		const clicks = (board?.speakerClicks ?? 0) - this.#danceClicks;
		this.#danceClicks = board?.speakerClicks ?? 0;
		return {
			'6502': compiler
				? [...this.#danceBlocks.step(compiler.list().map((b) => /** @type {[number, number]} */ ([b.entry, b.retired]))), ...this.#dancePcs.take()]
				: this.#dancePcs.take(),
			disk: disk?.motor ? [{ key: head, weight: moved ? 4 : 1 }] : [],
			speaker: clicks > 0 ? [{ key: Math.round(Math.log2(clicks)), weight: clicks }] : []
		};
	}

	#danceGauges() {
		const board = this.#board;
		const ms = performance.now();
		const cycles = board?.cycles ?? 0;
		const ratio = (cycles - this.#danceAt.cycles) / Math.max(1, ms - this.#danceAt.ms) / (APPLE_HZ / 1000);
		this.#danceAt = { cycles, ms };
		return { load: speedLoad(ratio), fill: board ? applesoftFree(board.ram) : 0 };
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
		if (this.traceMs > 0) {
			this.#traceOwed = Math.min(this.#traceOwed + dt, 4 * this.traceMs);
			while (this.#traceOwed >= this.traceMs) {
				this.#traceOwed -= this.traceMs;
				this.#step(board.cycles + 1);
			}
			this.#paint();
			this.#speak();
			return;
		}
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
		hushWhenHidden(ctx);
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

	/**
	 * Turn the speaker flips since last time into samples and queue them. Slower than the Apple,
	 * the samples are stretched to the time that passed, so each flip is a click when it comes.
	 */
	#speak() {
		const board = this.#board;
		if (!board) return;
		const flips = board.takeSpeaker();
		const end = board.cycles;
		const start = this.#heard;
		this.#heard = end;
		const audio = this.#audio;
		if (!this.sound || !audio || end <= start) return;
		const warp = this.traceMs > 0 ? 0 : this.warp;
		if (warp < SPEAKER_SPEEDS.min || warp > SPEAKER_SPEEDS.max) {
			this.#cone = { x: board.speaker & 1 ? 1 : -1, y: 0 };
			return;
		}
		const rate = 44100;
		const stretch = this.warp > 0 && this.warp < 1 ? 1 / this.warp : 1;
		const n = Math.min(this.#samples.length, Math.max(1, Math.round(((end - start) * rate * stretch) / APPLE_HZ)));
		let level = board.speaker & 1;
		for (let i = flips.length - 1; i >= 0; i--) if ((flips[i] ?? 0) > start) level ^= 1;
		let fi = 0;
		while (fi < flips.length && (flips[fi] ?? 0) <= start) fi++;
		const span = end - start;
		const samples = this.#samples;
		let { x, y } = this.#cone;
		for (let s = 0; s < n; s++) {
			const cycle = start + ((s + 0.5) * span) / n;
			while (fi < flips.length && (flips[fi] ?? 0) <= cycle) {
				level ^= 1;
				fi++;
			}
			const v = level ? 1 : -1;
			y = v - x + CONE * y;
			x = v;
			samples[s] = 0.5 * y;
		}
		this.#cone = { x, y };
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
			this.dance.frame(now, () => this.#danceHits(), () => this.#danceGauges(), () => this.#danceWatched(), () => this.#danceCalls());
			ctx.putImageData(image, 0, 0);
			if (vctx && this.videxShowing) vctx.putImageData(videxImage, 0, 0);
			if (now - polled > (this.traceMs ? 40 : 250)) {
				const cycles = this.#board.cycles;
				if (polled) this.mhz = (cycles - lastCycles) / (now - polled) / 1000;
				polled = now;
				lastCycles = cycles;
				this.status = snapshot(this.#cpu, this.#board);
				this.annunciators = this.#board.annunciators;
				this.#readPanel();
			}
		};
		raf = requestAnimationFrame(tick);
		if (this.#board) ctx.putImageData(image, 0, 0);
		return () => {
			cancelAnimationFrame(raf);
			this.dance.rest();
		};
	}
}

/**
 * Applesoft's free memory as a fraction of its whole, what FRE(0) counts: from the end of the
 * arrays (STREND, $6D) up to the strings (FRETOP, $6F), over program start (TXTTAB, $67) to
 * HIMEM ($73). 0 when the pointers don't look like Applesoft's.
 * @param {Uint8Array} ram
 */
function applesoftFree(ram) {
	const word = (/** @type {number} */ a) => (ram[a] ?? 0) | ((ram[a + 1] ?? 0) << 8);
	const start = word(0x67);
	const strend = word(0x6d);
	const fretop = word(0x6f);
	const himem = word(0x73);
	if (!(start >= 0x800 && start < strend && strend <= fretop && fretop <= himem && himem <= 0xc000)) return 0;
	return (fretop - strend) / (himem - start);
}

/** @typedef {'applesoft' | 'running' | 'integer' | 'monitor'} Prompt */

/** @type {Record<Prompt, import('@wwsff/cabinet/dance').Music>} */
const PROMPT_MUSIC = {
	applesoft: { style: 'straight', bpm: 112, loops: true, mute: ['drums'], riff: 'sunny' },
	running: { style: 'jazz', bpm: 120, loops: false, mute: [], riff: 'walk' },
	integer: { style: 'minor', bpm: 112, loops: false, mute: ['loops', 'drums'], riff: 'techno' },
	monitor: { style: 'bp', bpm: 72, loops: false, mute: ['loops', 'reply', 'drums'], riff: 'industrial' }
};

/**
 * Which prompt the Apple is at, by the character in PROMPT ($33), and the BASIC program's
 * length in bytes:
 * - "]" Applesoft, from TXTTAB ($67) to VARTAB ($69); running a program when CURLIN's high
 *   byte ($76) isn't $FF;
 * - ">" Integer BASIC, whose program sits from PP ($CA) up to HIMEM ($4C);
 * - "*" the Monitor.
 * @param {Uint8Array} ram
 * @returns {{ mode: Prompt | null, length: number }}
 */
function prompt(ram) {
	const word = (/** @type {number} */ a) => (ram[a] ?? 0) | ((ram[a + 1] ?? 0) << 8);
	const span = (/** @type {number} */ from, /** @type {number} */ to) => (from >= 0x800 && from <= to && to <= 0xc000 ? to - from : -1);
	switch (ram[0x33]) {
		case 0xdd: {
			const length = span(word(0x67), word(0x69));
			return length < 0 ? { mode: null, length: 0 } : { mode: ram[0x76] === 0xff ? 'applesoft' : 'running', length };
		}
		case 0xbe: {
			const length = span(word(0xca), word(0x4c));
			return length < 0 ? { mode: null, length: 0 } : { mode: 'integer', length };
		}
		case 0xaa:
			return { mode: 'monitor', length: 0 };
		default:
			return { mode: null, length: 0 };
	}
}

export const korzApple = new KorzApple();

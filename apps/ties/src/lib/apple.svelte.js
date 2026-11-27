// The Apple page's engine. One menu: the Korz compiler, the switch, the resolver, the
// interpreter, and microM8. The page opens on the compiler unless `?cpu=` or the caller
// says otherwise. A Korz rung change reboots onto the same floppies. microM8 is a different
// program, so choosing it, or leaving it, reloads the page.

import { microM8 } from './microm8.svelte.js';
import { korzApple } from './korz-apple.svelte.js';

export const ENGINES = [
	{ id: 'compile', label: 'Korz compiler', title: 'Compiles runs of 6502 instructions into JavaScript' },
	{ id: 'resolve', label: 'Korz resolver', title: 'Dispatches through tables resolved from the slots' },
	{ id: 'interpret', label: 'Korz interpreter', title: 'Searches the sea of slots on every instruction' },
	{ id: 'switch', label: 'Switch statements', title: 'M6502: one function and a dense switch, the reference for the Korz rungs' },
	{ id: 'microm8', label: 'microM8', title: 'The Go Apple, compiled to WebAssembly. The oracle.' }
];

const KORZ = new Set(['compile', 'switch', 'resolve', 'interpret']);

const VOLUME_KEY = 'apple-speaker-volume';
const keptVolume = () => {
	const v = Number(globalThis.localStorage?.getItem(VOLUME_KEY) ?? 1);
	return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
};

class AppleEngine {
	id = $state('compile');
	#fallback = 'compile';
	#caps = $state(true);
	#sound = $state(true);
	#locked = $state('');
	#mouseStick = $state(false);
	#warp = $state(1);
	#traceMs = $state(0);
	#hush = false;
	/** The screen angel's field while it talks for the player: the screen's focus goes there. @type {HTMLInputElement | null} */
	chat = $state(null);

	get engines() {
		return ENGINES;
	}

	get active() {
		return this.id === 'microm8' ? microM8 : korzApple;
	}

	/** The KORZ panel's tree; microM8 is Go compiled to WebAssembly and has none. */
	korzRoots() {
		if (this.id === 'microm8') return [{ id: 'none', label: 'No Korz structures', note: 'microM8 is not built on Korz; pick a Korz level in the menu' }];
		return korzApple.korzRoots();
	}
	korzFollow() {
		return this.id === 'microm8' ? null : korzApple.korzFollow();
	}

	get phase() {
		return this.active.phase;
	}
	get error() {
		return this.active.error;
	}
	get drives() {
		return this.active.drives;
	}
	get mhz() {
		return this.active.mhz;
	}
	get status() {
		return this.active.status;
	}
	get annunciators() {
		return this.active.annunciators;
	}
	/** The cabinet's panel bits at `$C041`–`$C04F`, on the Korz Apples; microM8 has none. */
	get panel() {
		return this.id === 'microm8' ? null : korzApple.panel;
	}
	/** The Korz Apple, for the memory panel; null on microM8, whose memory is behind the Go core. */
	get korz() {
		return this.id === 'microm8' ? null : korzApple;
	}
	/** @param {number} n */
	flip(n) {
		if (this.id !== 'microm8') korzApple.flip(n);
	}
	/** Set the panel's 15 bytes, a music seed; microM8 has no panel and ignores it. @param {Uint8Array} bytes */
	seedPanel(bytes) {
		korzApple.seedPanel(bytes);
	}
	/** Whether the music follows the Apple's prompts, their styles and panel seeds; the Korz Apples only. */
	get followPrompts() {
		return korzApple.followPrompts;
	}
	set followPrompts(on) {
		korzApple.followPrompts = on;
	}
	get videxShowing() {
		return this.id === 'microm8' ? microM8.videxShowing : korzApple.videxShowing;
	}
	get gamepad() {
		return this.id === 'microm8' ? microM8.gamepad : '';
	}
	/** The microM8 profile, or '' on a Korz rung. A Korz machine is always the ][+. */
	get profile() {
		return this.id === 'microm8' ? microM8.profile : '';
	}
	set profile(v) {
		if (this.id === 'microm8') microM8.profile = v;
	}
	get picture() {
		return this.active.picture;
	}
	get pace() {
		return this.id === 'microm8' ? 0 : korzApple.picturesPerSecond;
	}

	get caps() {
		return this.#caps;
	}
	set caps(v) {
		this.#caps = v;
		microM8.caps = v;
		korzApple.caps = v;
	}
	#warpVolume = 1;
	#speakerVolume = $state(keptVolume());
	/** The speaker's volume the person sets, 0 to 1, kept in this browser; faster speeds turn it down further. */
	get speakerVolume() {
		return this.#speakerVolume;
	}
	set speakerVolume(v) {
		this.#speakerVolume = Math.max(0, Math.min(1, v));
		try {
			globalThis.localStorage?.setItem(VOLUME_KEY, String(this.#speakerVolume));
		} catch {
			/* Storage forbidden: the volume lasts until the page goes. */
		}
		this.#applyVolume();
	}
	constructor() {
		this.#applyVolume();
	}
	#applyVolume() {
		microM8.volume = korzApple.volume = this.#warpVolume * this.#speakerVolume;
	}
	/** The cassette output mixed into the speaker; the Korz Apples only. */
	get hearTape() {
		return korzApple.hearTape;
	}
	set hearTape(on) {
		korzApple.hearTape = on;
	}
	get sound() {
		return this.#sound;
	}
	set sound(v) {
		this.#sound = v;
		microM8.sound = v;
		korzApple.sound = v;
		if (v) this.#hush = false;
	}
	get locked() {
		return this.#locked;
	}
	set locked(v) {
		this.#locked = v;
		microM8.locked = v;
		korzApple.locked = v;
	}
	get mouseStick() {
		return this.#mouseStick;
	}
	set mouseStick(v) {
		this.#mouseStick = v;
		microM8.mouseStick = v;
		korzApple.mouseStick = v;
	}
	/** The bus dance, on the Korz Apples: microM8's Go core has no blocks to listen to. */
	get dance() {
		return this.id === 'microm8' ? null : korzApple.dance;
	}

	get warp() {
		return this.#warp;
	}
	/** One instruction every this many ms on the Korz Apple, as the PDP-7's trace notches; 0 when running by speed. */
	get traceMs() {
		return this.#traceMs;
	}
	/** Held still, on the Korz Apple; microM8 has no pause. */
	get paused() {
		return this.id !== 'microm8' && korzApple.paused;
	}
	pause(v = !this.paused) {
		if (this.id !== 'microm8') korzApple.paused = v;
	}
	/** One instruction, then held still. */
	stepOne() {
		if (this.id !== 'microm8') korzApple.stepOne();
	}

	/** @param {number} ms */
	trace(ms) {
		if (this.id === 'microm8') return;
		this.speed(0.001);
		this.#traceMs = ms;
		korzApple.traceMs = ms;
	}

	/** @param {string} fallback the engine when the address has no `cpu` */
	useDefault(fallback) {
		this.#fallback = ENGINES.some((e) => e.id === fallback) ? fallback : 'compile';
		const want = new URL(globalThis.location.href).searchParams.get('cpu');
		this.id = ENGINES.some((e) => e.id === want) ? /** @type {typeof this.id} */ (want) : this.#fallback;
		if (KORZ.has(this.id)) korzApple.rung = /** @type {'compile' | 'switch' | 'resolve' | 'interpret'} */ (this.id);
	}

	/** @param {string} id */
	choose(id) {
		if (!ENGINES.some((e) => e.id === id) || id === this.id) return;
		const url = new URL(location.href);
		if (id === this.#fallback) url.searchParams.delete('cpu');
		else url.searchParams.set('cpu', id);
		if ((id === 'microm8') !== (this.id === 'microm8')) {
			location.assign(url);
			return;
		}
		history.replaceState(history.state, '', url);
		this.id = id;
		korzApple.use(/** @type {'compile' | 'switch' | 'resolve' | 'interpret'} */ (id));
	}

	seconds() {
		return this.active.seconds();
	}

	listen() {
		if (this.id === 'microm8') microM8.listen();
		else korzApple.listen();
	}

	start() {
		return this.id === 'microm8' ? microM8.start() : korzApple.power();
	}

	/**
	 * The motherboard character ROM. Null is the emulator's ][+ generator. A cartridge
	 * passes its own: 64 glyphs, 8 bytes each, low 7 bits, bit 0 at the left.
	 * @param {Uint8Array | null} rom
	 */
	set chargen(rom) {
		korzApple.chargen = rom;
	}

	/**
	 * @param {string} name
	 * @param {Uint8Array} bytes
	 * @param {number} [drive]
	 * @param {string} [profile]
	 * @param {boolean} [writeProtect]
	 */
	insert(name, bytes, drive = 0, profile = '', writeProtect = false) {
		if (this.id === 'microm8') return microM8.insert(name, bytes, drive, profile, writeProtect);
		return korzApple.insert(name, bytes, drive, profile, writeProtect);
	}

	/**
	 * @param {{ name: string, bytes: Uint8Array, drive: number, protect?: boolean }[]} entries
	 */
	boot(entries) {
		if (this.id === 'microm8') {
			return (async () => {
				for (let i = entries.length - 1; i >= 0; i--) {
					const e = entries[i];
					if (!e) continue;
					await microM8.insert(e.name, e.bytes, e.drive, microM8.profile, !!e.protect);
				}
				microM8.reboot();
			})();
		}
		return korzApple.boot(entries);
	}

	reboot() {
		this.active.reboot();
	}

	reset() {
		this.active.reset();
	}

	/**
	 * @param {number} warp
	 * @param {number} [pictures] pictures per game second; omitted, max runs at one per game second
	 */
	speed(warp, pictures) {
		this.#warp = warp;
		this.#traceMs = 0;
		korzApple.traceMs = 0;
		const pace = pictures ?? (warp >= 100 ? 1 : 0);
		korzApple.picturesPerSecond = pace;
		korzApple.warp = warp;
		if (this.id === 'microm8') microM8.speed(warp);
		// Faster than the Apple, the speaker plays game time in snatches: quieter as it gets
		// choppier, and off past 8x, where it is only clicks. Slower, each speaker stretches its
		// samples to the time that passes, down to the Korz speaker's slowest (SPEAKER_SPEEDS).
		this.#warpVolume = warp >= 8 ? 0.25 : warp >= 4 ? 0.6 : 1;
		this.#applyVolume();
		if (warp > 8) {
			this.#hush = true;
			this.sound = false;
		} else if (this.#hush) {
			this.#hush = false;
			this.sound = true;
			this.listen();
		}
	}

	/** @param {string} text */
	type(text) {
		this.active.type(text);
	}

	/** @param {KeyboardEvent} ev */
	press(ev) {
		return this.active.press(ev);
	}

	/**
	 * @param {'key' | 'mouse' | 'pad'} source
	 * @param {number} n
	 * @param {boolean} down
	 */
	button(source, n, down) {
		if (this.id === 'microm8') microM8.button(source, n, down);
	}

	/** @param {number} n @param {number} value */
	paddle(n, value) {
		if (this.id === 'microm8') microM8.paddle(n, value);
	}

	/** @param {number} [drive] */
	saved(drive = 0) {
		return this.active.saved(drive);
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {HTMLCanvasElement | null} [videx]
	 */
	attach(canvas, videx = null) {
		if (this.id === 'microm8') return microM8.attach(canvas, videx);
		return korzApple.attach(canvas, videx);
	}
}

export const apple = new AppleEngine();

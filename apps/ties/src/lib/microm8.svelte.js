// microM8's Apple II as a WebAssembly module (packages/cabinet/src/microm8), with the page's
// view of it as runes. One machine per page: the Go side owns globalThis.microM8, so this is
// a singleton that outlives the component showing it.
//
// The module and Go's wasm_exec.js are served from static/microm8/, put there by
// packages/cabinet/scripts/microm8-wasm.mjs.

import { asset } from '$app/paths';
import { FRAME_BYTES, FRAME_HEIGHT, FRAME_WIDTH, VIDEX_BYTES, VIDEX_HEIGHT, VIDEX_WIDTH, startMicroM8 } from '@wwsff/cabinet/microm8';
import { APPLE_HZ } from '@wwsff/cabinet/angel';

/** @param {string} src */
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = () => reject(new Error(`could not load ${src}`));
		document.head.append(s);
	});
}

class MicroM8Machine {
	/** @type {'idle' | 'loading' | 'running' | 'error'} */
	phase = $state('idle');
	error = $state('');
	/** The machine profile it was switched on with, without ".yaml"; '' is the //e. Fixed once on. */
	profile = $state('');
	/** @type {import('@wwsff/cabinet/microm8').MicroM8Status | null} */
	status = $state(null);
	/** Names of the disks in drives 1 and 2, '' when empty. */
	drives = $state(['', '']);
	frames = $state(0);
	caps = $state(true);
	/** Warp asked for; microM8 still goes to 8 by itself while a drive runs. */
	warp = $state(1);
	/** Speed measured from the cycle counter, in MHz. */
	mhz = $state(0);
	sound = $state(true);
	/** The game port's outputs AN0-AN3 as bits 0-3. */
	annunciators = $state(0);
	/** The monitor is showing the Videx 80-column picture. */
	videxShowing = $state(false);
	/** Paddles 0 and 1 follow the pointer over the screen; its buttons are pushbuttons 0 and 1. */
	mouseStick = $state(false);
	/** Name of the gamepad driving the paddles, '' when none. */
	gamepad = $state('');
	/** Why the page has the keyboard instead of the Apple, '' when the Apple has it. */
	locked = $state('');
	/** Pushbuttons 0-2 as each source holds them; the Apple sees any source holding one. */
	#held = { key: [false, false, false], mouse: [false, false, false], pad: [false, false, false] };
	#sent = [false, false, false];
	/** @type {number[]} */
	#padAxes = [];
	/** @type {{ ctx: AudioContext, out: AudioNode, next: number } | null} */
	#audio = null;
	#samples = new Float32Array(48000);
	/** Switched on without a disk, the //e spins its empty drive; Ctrl-Reset lands it in Applesoft. */
	#bare = true;

	/** @type {import('@wwsff/cabinet/microm8').MicroM8 | null} */
	#m = null;
	/** @type {Promise<void> | null} */
	#starting = null;
	#pixels = new Uint8ClampedArray(FRAME_BYTES);
	#videxPixels = new Uint8ClampedArray(VIDEX_BYTES);

	start() {
		this.#starting ??= this.#start();
		return this.#starting;
	}

	async #start() {
		this.phase = 'loading';
		try {
			const g = /** @type {{ Go?: import('@wwsff/cabinet/microm8').GoRuntimeClass, microM8Exited?: unknown }} */ (globalThis);
			if (!g.Go) await loadScript(asset('/microm8/wasm_exec.js'));
			if (!g.Go) throw new Error('wasm_exec.js did not define Go');
			if (g.microM8Exited) {
				// Already running: this module was reloaded while developing.
				this.#bare = false;
				this.#m = await startMicroM8(g.Go, new Uint8Array());
			} else {
				const response = await fetch(asset('/microm8/microm8.wasm'));
				if (!response.ok) throw new Error(`microm8.wasm: ${response.status} ${response.statusText}`);
				this.#m = await startMicroM8(g.Go, response, { profile: this.profile });
			}
			this.#m.speed(this.warp);
			this.phase = 'running';
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
			this.phase = 'error';
		}
	}

	/**
	 * Draw frames into `canvas` (the Apple, FRAME_WIDTH x FRAME_HEIGHT) and `videx` (the
	 * Videoterm, VIDEX_WIDTH x VIDEX_HEIGHT) until the returned function is called.
	 * @param {HTMLCanvasElement} canvas
	 * @param {HTMLCanvasElement | null} [videx]
	 */
	attach(canvas, videx = null) {
		const ctx = canvas.getContext('2d');
		const vctx = videx?.getContext('2d') ?? null;
		if (!ctx) return () => {};
		ctx.imageSmoothingEnabled = false;
		if (vctx) vctx.imageSmoothingEnabled = false;
		const image = new ImageData(this.#pixels, FRAME_WIDTH, FRAME_HEIGHT);
		const vimage = vctx ? new ImageData(this.#videxPixels, VIDEX_WIDTH, VIDEX_HEIGHT) : null;
		let raf = 0;
		let polled = 0;
		let lastCycles = 0;
		/** @param {number} now */
		const tick = (now) => {
			raf = requestAnimationFrame(tick);
			const m = this.#m;
			if (!m) return;
			if (m.frame(this.#pixels)) {
				ctx.putImageData(image, 0, 0);
				this.frames++;
			}
			const show = !!m.status().videxShowing;
			if (show !== this.videxShowing) this.videxShowing = show;
			if (show && vctx && vimage && m.videx(this.#videxPixels)) vctx.putImageData(vimage, 0, 0);
			this.#play(m);
			this.#pollGamepad(m);
			const an = m.annunciators();
			if (an !== this.annunciators) this.annunciators = an;
			if (now - polled > 250) {
				const s = m.status();
				if (polled && s.cycles >= lastCycles) this.mhz = (s.cycles - lastCycles) / (now - polled) / 1000;
				polled = now;
				lastCycles = s.cycles;
				this.status = s;
				if (this.#bare && !this.disk && s.pc >> 8 === 0xc6) {
					this.#bare = false;
					m.reset();
				}
			}
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}

	/**
	 * Open the page's audio. Browsers start sound only after a click or key: opened before one,
	 * it waits suspended, and the next call from a click or key lets it play.
	 */
	listen() {
		if (this.#audio) {
			if (this.#audio.ctx.state === 'suspended') this.#audio.ctx.resume();
			return;
		}
		if (typeof AudioContext === 'undefined') return;
		const ctx = new AudioContext();
		// The speaker is a one-bit cone pushed one way; take off the offset it leaves.
		const highpass = ctx.createBiquadFilter();
		highpass.type = 'highpass';
		highpass.frequency.value = 20;
		const gain = ctx.createGain();
		gain.gain.value = 0.3;
		highpass.connect(gain).connect(ctx.destination);
		this.#audio = { ctx, out: highpass, next: 0 };
	}

	/**
	 * Queue the speaker's new samples right after the last ones. Running faster than the Apple
	 * makes more sound than time passes; what would queue too far ahead is dropped.
	 * @param {import('@wwsff/cabinet/microm8').MicroM8} m
	 */
	#play(m) {
		const n = m.audio(this.#samples);
		const a = this.#audio;
		if (!n || !a || !this.sound) return;
		const now = a.ctx.currentTime;
		if (a.next < now + 0.02) a.next = now + 0.05;
		if (a.next > now + 0.3) return;
		const rate = m.audioRate();
		const buffer = a.ctx.createBuffer(1, n, rate);
		buffer.copyToChannel(this.#samples.subarray(0, n), 0);
		const src = a.ctx.createBufferSource();
		src.buffer = buffer;
		src.connect(a.out);
		src.start(a.next);
		a.next += n / rate;
	}

	/**
	 * Hold or let go of pushbutton `n` for one source of presses.
	 * @param {'key' | 'mouse' | 'pad'} source
	 * @param {number} n
	 * @param {boolean} down
	 */
	button(source, n, down) {
		this.#held[source][n] = down;
		const any = this.#held.key[n] || this.#held.mouse[n] || this.#held.pad[n];
		if (any === this.#sent[n] || !this.#m) return;
		this.#sent[n] = any;
		this.#m.button(n, any);
	}

	/** @param {number} n @param {number} value 0 to 255 */
	paddle(n, value) {
		this.#m?.paddle(n, value);
	}

	/**
	 * The first gamepad: left stick paddles 0 and 1, right stick 2 and 3, its first three
	 * buttons pushbuttons 0-2. Only changes go to the Apple, so the mouse can drive between.
	 * @param {import('@wwsff/cabinet/microm8').MicroM8} m
	 */
	#pollGamepad(m) {
		const pad = typeof navigator !== 'undefined' && navigator.getGamepads ? [...navigator.getGamepads()].find((p) => p?.connected) : null;
		const id = pad?.id ?? '';
		if (id !== this.gamepad) this.gamepad = id;
		if (!pad) return;
		pad.axes.slice(0, 4).forEach((a, n) => {
			const v = Math.round(((a + 1) / 2) * 255);
			if (v !== this.#padAxes[n]) {
				this.#padAxes[n] = v;
				m.paddle(n, v);
			}
		});
		for (let n = 0; n < 3; n++) {
			const down = !!pad.buttons[n]?.pressed;
			if (down !== this.#held.pad[n]) this.button('pad', n, down);
		}
	}

	/** @param {KeyboardEvent} ev */
	press(ev) {
		const m = this.#m;
		if (!m || this.locked) return false;
		m.caps = this.caps;
		return m.press(ev);
	}

	reset() {
		this.#m?.reset();
	}

	/** @param {number} warp */
	speed(warp) {
		this.warp = warp;
		this.#m?.speed(warp);
	}

	/** @param {string} text */
	type(text) {
		this.#m?.type(text);
	}

	/** The Apple's canvas pixels as last drawn, FRAME_WIDTH x FRAME_HEIGHT RGBA, before the page scales them. */
	get picture() {
		return { width: FRAME_WIDTH, height: FRAME_HEIGHT, data: this.#pixels };
	}

	/** Machine time in seconds, from the cycle counter. */
	seconds() {
		return (this.#m?.status().cycles ?? 0) / APPLE_HZ;
	}

	/** Name of the disk in drive 1. */
	get disk() {
		return this.drives[0];
	}

	/**
	 * Put a disk in drive 0 or 1 of the running Apple, the way a hand swaps floppies: nothing
	 * restarts. Given to a machine not yet switched on, a drive 1 disk is what it boots, on
	 * `profile`.
	 * @param {string} name
	 * @param {Uint8Array} bytes
	 * @param {number} drive
	 * @param {string} [profile]
	 */
	async insert(name, bytes, drive = 0, profile = '') {
		const off = this.phase === 'idle';
		if (off) this.profile = profile;
		await this.start();
		const m = this.#m;
		if (!m) return;
		if (off && drive === 0) {
			this.#bare = false;
			m.boot(name, bytes);
		} else {
			m.insertDisk(name, bytes, drive);
		}
		this.drives[drive] = name;
	}

	/** Power cycle, booting what is in drive 1. */
	reboot() {
		this.#bare = !this.drives[0];
		this.#m?.reboot();
	}

	/**
	 * The disk in a drive as the Apple has written it.
	 * @param {number} drive
	 */
	saved(drive = 0) {
		const name = this.drives[drive];
		return name ? (this.#m?.disk(name) ?? null) : null;
	}
}

export const microM8 = new MicroM8Machine();

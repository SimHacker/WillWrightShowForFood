// A terminal that talks, as the PDP-7's teletype does (CabinetApplet.svelte): what the machine
// prints is gathered until it pauses, then announced to screen readers and, with Speak on,
// read aloud in the site's voice (voice.svelte.js), the newest output cutting off the old. The
// echo of what the person typed is not read back; they heard it as they typed.

import { currentVoice } from './voice.svelte.js';

/** How long the machine is quiet before what it printed is read. */
const PAUSE_MS = 350;
/** The most read at once: the end of a long listing, not all of it. */
const MOST = 600;

export class TtyVoice {
	/** On: read aloud. Kept under `key`. */
	speak = $state(false);
	/** The words for an aria-live region; set anew each time, so the same words twice are read twice. */
	announce = $state('');
	#key;
	#said = '';
	#echo = '';
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	#timer;
	/** @type {any} */
	#speech = null;

	/** @param {string} key */
	constructor(key) {
		this.#key = key;
		try {
			this.speak = globalThis.localStorage?.getItem(key) === '1';
		} catch {
			/* Storage forbidden: silent. */
		}
	}

	/** @param {boolean} on */
	setSpeak(on) {
		this.speak = on;
		try {
			globalThis.localStorage?.setItem(this.#key, on ? '1' : '');
		} catch {
			/* Storage forbidden: until the page goes. */
		}
		if (on) this.#aloud('Speaking.');
		else this.#speech?.cancel();
	}

	/** Keys the person typed: their echo is skipped. @param {string} text */
	typed(text) {
		this.#echo += text.replace(/[^\x20-\x7e]/g, '');
	}

	/** A character the machine printed. @param {number} code */
	hear(code) {
		const c = code & 0o177;
		const ch = c === 0o15 || c === 0o12 ? ' ' : c >= 0o40 && c < 0o177 ? String.fromCharCode(c) : '';
		if (!ch) return;
		if (this.#echo && ch === this.#echo[0]) {
			this.#echo = this.#echo.slice(1);
			return;
		}
		if (ch !== ' ') this.#echo = '';
		this.#said += ch;
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => this.#pause(), PAUSE_MS);
	}

	#pause() {
		const text = this.#said.replace(/\s+/g, ' ').trim().slice(-MOST);
		this.#said = '';
		if (!text) return;
		this.announce = '';
		requestAnimationFrame(() => (this.announce = text));
		if (this.speak) this.#aloud(text);
	}

	/** @param {string} text */
	async #aloud(text) {
		if (!globalThis.speechSynthesis) return;
		if (!this.#speech) {
			const { SpeechSystem } = await import('./speech.js');
			this.#speech = new SpeechSystem();
			await this.#speech.ready;
		}
		this.#speech.cancel();
		const opts = { rate: 1.1 };
		const voice = currentVoice();
		if (voice) this.#speech.speakWithVoice(text, voice, opts);
		else this.#speech.speak(text, { voiceType: 'female', language: 'en', ...opts });
	}

	stop() {
		clearTimeout(this.#timer);
		this.#said = '';
		this.#echo = '';
		this.#speech?.cancel();
	}
}

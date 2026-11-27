/**
 * Zork's grue warning, on any machine that runs Zork: the first time the game says you are likely
 * to be eaten by a grue, MC Frontalot's "It Is Pitch Dark" (2007, directed by Jason Scott while
 * filming Get Lamp) pops up at the top of the page. Once seen, the warning is kept in this
 * browser and the next grue stays quiet, on every machine, until Ignore Warning is unticked.
 * The PDP-10 hears its printed paper (`heard`); the Apple shows its screen rows (`saw`).
 */
import { openWeb } from './web-panel.svelte.js';

const KEY = 'grue_warning';
/** The words every Zork says, in either case, however the lines break them. */
const WARNING = /likely to be eaten by a grue/i;

export const GRUE = {
	title: 'MC Frontalot, "It Is Pitch Dark"',
	url: 'https://www.youtube.com/watch?v=YeV0pLRyM7o'
};

/** What the Ignore Warning checkbox does, on the video and in the preferences. */
export const GRUE_TIP =
	'Turns the grue warning detector off and on. Ticked, you have been warned: the next grue stays quiet. Unticked, the next time Zork says you are likely to be eaten by a grue, this video plays again.';

class Grue {
	/** Whether the video has played in this browser. */
	warned = $state(kept());
	#tail = '';
	#showing = false;

	/** Turn the detector on (the next grue plays the video) or off. */
	toggle() {
		this.warned = !this.warned;
		keep(this.warned ? '1' : '');
	}

	/** Forget that the grue has been met, so its video plays the next time. */
	forget() {
		this.warned = false;
		keep('');
	}

	/** Printed text, as it comes. @param {string} text */
	heard(text) {
		this.#tail = (this.#tail + text.replace(/[\r\n\0]+/g, ' ')).slice(-120);
		if (!WARNING.test(this.#tail.replace(/\s+/g, ' '))) return;
		this.#tail = '';
		this.#warn();
	}

	/** A screen's rows, each time it is looked at: warns when the words first show. @param {string[]} rows */
	saw(rows) {
		const showing = WARNING.test(rows.join(' ').replace(/\s+/g, ' '));
		if (showing && !this.#showing) this.#warn();
		this.#showing = showing;
	}

	#warn() {
		if (this.warned) return;
		this.warned = true;
		keep('1');
		openWeb(GRUE.url, {
			title: GRUE.title,
			reveal: true,
			top: true,
			buttons: [{ label: 'Ignore Warning', title: GRUE_TIP, checked: () => this.warned, action: () => this.toggle() }]
		});
	}
}

function kept() {
	try {
		return globalThis.localStorage?.getItem(KEY) === '1';
	} catch {
		return false;
	}
}

/** @param {string} value */
function keep(value) {
	try {
		globalThis.localStorage?.setItem(KEY, value);
	} catch {
		/* Storage forbidden: it lasts until the page goes. */
	}
}

export const grue = new Grue();

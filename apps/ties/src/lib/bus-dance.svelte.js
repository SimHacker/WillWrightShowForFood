// The bus dance on a page: the beat clock, the notes, the drums and the engine drone. A machine supplies
// `hits`, what each of its voices did since the last beat, and `gauges`, how hard it is
// working and how full it is; call `frame` from its animation loop. See AM-RADIO.md, approach 8.

import { Dance } from '@wwsff/cabinet/dance';
import { BEAT_MS, DancePlayer } from './dance-player.js';

/** @typedef {import('@wwsff/cabinet/dance').Voice} Voice */
/** @typedef {import('@wwsff/cabinet/dance').Hit} Hit */

/** Emulated speed as a 0-to-1 load: .01x is 0, 1x is a half, 100x and faster is 1. */
export const speedLoad = (/** @type {number} */ ratio) => (ratio > 0 ? Math.max(0, Math.min(1, (Math.log10(ratio) + 2) / 4)) : 0);

export class BusDance {
	on = $state(false);
	player = new DancePlayer();
	#dance;
	#engine;
	#last = 0;

	/** @param {readonly Voice[]} voices @param {'saucer' | 'diesel'} engine */
	constructor(voices, engine) {
		this.voices = voices;
		this.#dance = new Dance(voices);
		this.#engine = engine;
	}

	/** From a click: browsers start sound only then. */
	/** @type {import('@wwsff/cabinet/dance').Style} */
	style = $state('straight');

	toggleJazz() {
		this.style = this.style === 'jazz' ? 'straight' : 'jazz';
		this.#dance.style = this.style;
	}

	toggle() {
		this.on = !this.on;
		if (this.on) {
			this.player.start();
			this.player.engine(this.#engine);
		} else this.player.stop();
	}

	/**
	 * @param {number} now the animation frame's time, ms
	 * @param {() => Record<string, Hit[]>} hits
	 * @param {() => { load: number, fill: number }} gauges
	 */
	frame(now, hits, gauges) {
		if (!this.on || now - this.#last < BEAT_MS) return;
		this.#last = now - ((now - this.#last) % BEAT_MS);
		const g = gauges();
		this.player.play(this.#dance.beat(hits(), g.load));
		this.player.drive(g.load, g.fill);
	}
}

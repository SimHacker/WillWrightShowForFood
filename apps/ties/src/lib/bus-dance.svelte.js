// The bus dance on a page: the beat clock, the notes, the drums and the engine drone. A machine
// supplies `hits`, what each of its voices did since the last beat, and `gauges`, how hard it is
// working and how full it is; call `frame` from its animation loop, and `touch` with what the
// person at the console does. See AM-RADIO.md, approach 8.

import { Dance } from '@wwsff/cabinet/dance';
import { DancePlayer, sixteenth } from './dance-player.js';

/** @typedef {import('@wwsff/cabinet/dance').Voice} Voice */
/** @typedef {import('@wwsff/cabinet/dance').Hit} Hit */
/** @typedef {import('@wwsff/cabinet/dance').Style} Style */
/** @typedef {import('@wwsff/cabinet/dance').Touch} Touch */

/** Emulated speed as a 0-to-1 load: .01x is 0, 1x is a half, 100x and faster is 1. */
export const speedLoad = (/** @type {number} */ ratio) => (ratio > 0 ? Math.max(0, Math.min(1, (Math.log10(ratio) + 2) / 4)) : 0);

/** @type {{ id: Style, label: string, title: string }[]} */
export const STYLES = [
	{ id: 'straight', label: 'Straight', title: 'Triads, I vi IV V, in even sixteenths' },
	{ id: 'jazz', label: 'Jazz', title: 'Systat jazz: seventh chords round the ii V I turnaround, swung, on a ride cymbal' },
	{
		id: 'kees',
		label: 'Kees',
		title: "Kees van Prooijen's 13 steps of the tritave (Bohlen-Pierce): his major cadence on the 3:5:7 triad, odd harmonics, bars of 13"
	}
];

export class BusDance {
	on = $state(false);
	/** @type {Style} */
	style = $state('straight');
	loops = $state(false);
	bpm = $state(120);
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
	toggle() {
		this.on = !this.on;
		if (this.on) {
			this.player.start();
			this.player.engine(this.#engine);
		} else this.player.stop();
	}

	/** @param {Style} style */
	setStyle(style) {
		this.style = style;
		this.#dance.style = style;
	}

	toggleLoops() {
		this.loops = !this.loops;
		this.#dance.loops = this.loops;
	}

	/** What the person did: it bends the music on the next beats rather than sounding at once. @param {Touch} t */
	touch(t) {
		if (this.on) this.#dance.touch(t);
	}

	/**
	 * @param {number} now the animation frame's time, ms
	 * @param {() => Record<string, Hit[]>} hits
	 * @param {() => { load: number, fill: number }} gauges
	 */
	frame(now, hits, gauges) {
		const ms = sixteenth(this.bpm);
		if (!this.on || now - this.#last < ms) return;
		this.#last = now - Math.min(ms, (now - this.#last) % ms);
		const g = gauges();
		this.player.play(this.#dance.beat(hits(), g.load), ms);
		this.player.drive(g.load, Math.max(g.fill, this.#dance.tension));
	}
}

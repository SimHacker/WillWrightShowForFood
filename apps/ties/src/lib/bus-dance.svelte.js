// The bus dance on a page: the beat clock, the notes, the drums and the engine drone. A machine
// supplies `hits`, what each of its voices did since the last beat, and `gauges`, how hard it is
// working and how full it is; call `frame` from its animation loop, and `touch` with what the
// person at the console does. See AM-RADIO.md, approach 8.

import { Dance, Regions } from '@wwsff/cabinet/dance';
import { DancePlayer, sixteenth } from './dance-player.js';

/** @typedef {import('@wwsff/cabinet/dance').Voice} Voice */
/** @typedef {import('@wwsff/cabinet/dance').Hit} Hit */
/** @typedef {import('@wwsff/cabinet/dance').Style} Style */
/** @typedef {import('@wwsff/cabinet/dance').Touch} Touch */
/** @typedef {import('@wwsff/cabinet/dance').PenAt} PenAt */
/** @typedef {import('@wwsff/cabinet/dance').Watched} Watched */
/** @typedef {import('@wwsff/cabinet/dance').Music} Music */
/** @typedef {import('@wwsff/cabinet/dance').Region} Region */

/** Emulated speed as a 0-to-1 load: .01x is 0, 1x is a half, 100x and faster is 1. */
export const speedLoad = (/** @type {number} */ ratio) => (ratio > 0 ? Math.max(0, Math.min(1, (Math.log10(ratio) + 2) / 4)) : 0);

/** @type {{ id: Style, label: string, title: string }[]} */
export const STYLES = [
	{ id: 'straight', label: 'Straight', title: 'Triads, I vi IV V, in even sixteenths' },
	{ id: 'jazz', label: 'Jazz', title: 'Systat jazz: seventh chords round the ii V I turnaround, swung, on a ride cymbal; full pen tension takes the tritone substitution' },
	{ id: 'lydian', label: 'Lydian', title: "The devil's interval: major with its fourth raised a tritone, the Simpsons theme's mode, rocking between I and II" },
	{
		id: 'bp',
		label: 'Bohlen–Pierce',
		title: "13 steps of the tritave, found by Bohlen, Pierce and Kees van Prooijen (his '13 tones in the 3rd harmonic'): Kees's major cadence on the 3:5:7 triad, odd harmonics, bars of 13"
	}
];

export class BusDance {
	on = $state(false);
	/** @type {Style} */
	style = $state('straight');
	loops = $state(false);
	bpm = $state(120);
	/** Names of words in core to listen to, space separated; the machine resolves them. */
	listen = $state('');
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

	/** Memory's named regions; the first voice's hits warm them, and each warm one hums. @param {readonly Region[]} list */
	set regions(list) {
		this.#dance.regions = new Regions(list);
	}

	/** A game or round is over: a hooray, 0 barely to 1 best, panned toward the winner. @param {number} score @param {number} [pan] */
	celebrate(score, pan = 0) {
		if (this.on) this.#dance.celebrate(score, pan);
	}

	/** How deep the harmony goes, 0 to 1. @param {number} d */
	set depth(d) {
		this.#dance.depth = Math.max(0, Math.min(1, d));
	}

	/** Switch to a mode, as a screen angel's state asks; what it leaves out stays. @param {Music} m */
	mode(m) {
		if (m.style) this.setStyle(m.style);
		if (m.bpm) this.bpm = m.bpm;
		if (m.loops !== undefined && m.loops !== this.loops) this.toggleLoops();
		if (m.listen !== undefined) this.listen = m.listen;
		if (m.mute) this.#dance.mute = new Set(m.mute);
	}

	/** What the person did: it bends the music on the next beats rather than sounding at once. @param {Touch} t */
	touch(t) {
		if (this.on) this.#dance.touch(t);
	}

	/** The light pen, hovering or down, and the strokes under it; null when it leaves the tube. Sounds at once. @param {PenAt | null} p */
	pen(p) {
		if (this.on) this.player.play(this.#dance.pen(p), sixteenth(this.bpm));
	}

	/**
	 * @param {number} now the animation frame's time, ms
	 * @param {() => Record<string, Hit[]>} hits
	 * @param {() => { load: number, fill: number }} gauges
	 * @param {() => Watched[]} [watched] the listened-to words' values now
	 */
	frame(now, hits, gauges, watched) {
		const ms = sixteenth(this.bpm);
		if (!this.on || now - this.#last < ms) return;
		this.#last = now - Math.min(ms, (now - this.#last) % ms);
		const g = gauges();
		this.player.play(this.#dance.beat(hits(), g.load, watched?.() ?? []), ms);
		this.player.drive(g.load, Math.max(g.fill, this.#dance.tension));
	}
}

// The bus dance on a page: the beat clock, the notes, the drums and the engine drone. A machine
// supplies `hits`, what each of its voices did since the last beat, and `gauges`, how hard it is
// working and how full it is; call `frame` from its animation loop, and `touch` with what the
// person at the console does. See AM-RADIO.md, approach 8.

import { Dance, ENO_TRACKS, Regions, enoLayers, enoTracks, twistLabel } from '@wwsff/cabinet/dance';
import { DancePlayer, TEMPOS, sixteenth } from './dance-player.js';

/** @typedef {import('@wwsff/cabinet/dance').Voice} Voice */
/** @typedef {import('@wwsff/cabinet/dance').Hit} Hit */
/** @typedef {import('@wwsff/cabinet/dance').Style} Style */
/** @typedef {import('@wwsff/cabinet/dance').Touch} Touch */
/** @typedef {import('@wwsff/cabinet/dance').PenAt} PenAt */
/** @typedef {import('@wwsff/cabinet/dance').Watched} Watched */
/** @typedef {import('@wwsff/cabinet/dance').Called} Called */
/** @typedef {import('@wwsff/cabinet/dance').Music} Music */
/** @typedef {import('@wwsff/cabinet/dance').Region} Region */

/** Emulated speed as a 0-to-1 load: .01x is 0, 1x is a half, 100x and faster is 1. */
export const speedLoad = (/** @type {number} */ ratio) => (ratio > 0 ? Math.max(0, Math.min(1, (Math.log10(ratio) + 2) / 4)) : 0);

/** @type {{ id: Style, label: string, title: string }[]} */
export const STYLES = [
	{ id: 'straight', label: 'Straight', title: 'Triads, I vi IV V, in even sixteenths' },
	{ id: 'jazz', label: 'Jazz', title: 'Systat jazz: seventh chords round the ii V I turnaround, swung, on a ride cymbal; full pen tension takes the tritone substitution' },
	{ id: 'minor', label: 'Minor', title: 'The Aeolian loop, i bVI bIII bVII: C minor, A flat, E flat, B flat' },
	{ id: 'lydian', label: 'Lydian', title: "The devil's interval: major with its fourth raised a tritone, the Simpsons theme's mode, rocking between I and II" },
	{
		id: 'bp',
		label: 'Bohlen–Pierce',
		title: "13 steps of the tritave, found by Bohlen, Pierce and Kees van Prooijen (his '13 tones in the 3rd harmonic'): Kees's major cadence on the 3:5:7 triad, odd harmonics, bars of 13"
	},
	{ id: 'dorian', label: 'Dorian', title: 'Minor with a major sixth: the i7 IV7 vamp of So What and Oye Como Va' },
	{ id: 'mixolydian', label: 'Mixolydian', title: 'Major with a flat seventh, rocking I bVII IV I, and never a major V' },
	{ id: 'phrygian', label: 'Phrygian dominant', title: "Flamenco's Andalusian cadence, iv bIII bII I, home on a major chord with a flat second above it" },
	{ id: 'wholetone', label: 'Whole tone', title: "Debussy's: all whole steps, so nothing is home; augmented triads and the 7#5 and 7b5 chords" },
	{ id: 'octatonic', label: 'Octatonic', title: "Half step, whole step: Messiaen's second mode, major chords a minor third apart and the diminished seventh" },
	{
		id: 'alpha',
		label: 'Carlos alpha',
		title: "Wendy Carlos's alpha scale from Beauty in the Beast: 9 equal steps of the fifth, about 78 cents each, no octave at all, just-sounding thirds, triads moving by thirds"
	}
];

/** Whether the dance is on, for every machine and page; off until someone turns it on. */
const ON = 'dance-on';
/** @param {string} key */
const kept = (key) => {
	try {
		return JSON.parse(globalThis.localStorage?.getItem(key) ?? 'null');
	} catch {
		return null;
	}
};

export class BusDance {
	on = $state(false);
	/** @type {Style} */
	style = $state('straight');
	/** The Eno layers on, EN0 to EN3 as bits 1, 2, 4 and 8. @type {import('@wwsff/cabinet/dance').Eno} */
	loops = $state(0);
	#bpm = $state(120);
	get bpm() {
		return this.#bpm;
	}
	set bpm(v) {
		this.#bpm = v;
		this.#save();
	}
	#volume = $state(1);
	/** The dance's loudness, 0 to 1, kept with the style and tempo. */
	get volume() {
		return this.#volume;
	}
	set volume(v) {
		this.#volume = Math.max(0, Math.min(1, v));
		this.player.volume = this.#muted ? 0 : this.#volume;
		this.#save();
	}
	#muted = $state(false);
	/** Silent but still playing, so unmuting picks up where the dance is; kept with the volume. */
	get muted() {
		return this.#muted;
	}
	set muted(on) {
		this.#muted = on;
		this.player.volume = on ? 0 : this.#volume;
		this.#save();
	}
	/** Names of words in core to listen to, space separated; the machine resolves them. */
	listen = $state('');
	/** What the front panel's switches are doing to the music, in a few words; "" when they are all off. */
	twist = $state('');
	player = new DancePlayer();
	#dance;
	/** @type {readonly import('@wwsff/cabinet/dance').EnoTrack[]} */
	#tracks = $state.raw(ENO_TRACKS);
	#engine;
	#last = 0;

	/** @param {readonly Voice[]} voices @param {'saucer' | 'diesel'} engine */
	constructor(voices, engine) {
		this.voices = voices;
		this.#dance = new Dance(voices);
		this.#engine = engine;
		const on = kept(ON) === true;
		const was = kept(`dance-${engine}`);
		if (STYLES.some((s) => s.id === was?.style)) this.style = this.#dance.style = was.style;
		if (TEMPOS.includes(was?.bpm)) this.#bpm = was.bpm;
		if (typeof was?.volume === 'number') this.#volume = Math.max(0, Math.min(1, was.volume));
		this.#muted = was?.muted === true;
		this.player.volume = this.#muted ? 0 : this.#volume;
		if (typeof was?.loops === 'boolean' || typeof was?.loops === 'number') this.loops = this.#dance.loops = enoLayers(was.loops);
		if (on) this.#wake();
	}

	/** On from last time: sound starts at the first click or key, as browsers require. */
	#wake() {
		if (typeof window === 'undefined') return;
		this.on = true;
		const go = () => {
			window.removeEventListener('pointerdown', go, true);
			window.removeEventListener('keydown', go, true);
			if (!this.on) return;
			this.player.start();
			this.player.engine(this.#engine);
		};
		window.addEventListener('pointerdown', go, true);
		window.addEventListener('keydown', go, true);
	}

	/** The choices a person makes are kept: on or off for every machine, style, tempo and loops for each engine's. */
	#save() {
		try {
			globalThis.localStorage?.setItem(ON, JSON.stringify(this.on));
			globalThis.localStorage?.setItem(`dance-${this.#engine}`, JSON.stringify({ style: this.style, bpm: this.#bpm, loops: this.loops, volume: this.#volume, muted: this.#muted }));
		} catch {
			/* Storage full or forbidden: the dance just forgets. */
		}
	}

	/** The page let go of the machine: silence, but stay on, to sound again at the next click or key. */
	rest() {
		this.player.stop();
		if (this.on) this.#wake();
	}

	/** From a click: browsers start sound only then. */
	toggle() {
		this.on = !this.on;
		if (this.on) {
			this.player.start();
			this.player.engine(this.#engine);
		} else this.player.stop();
		this.#save();
	}

	/** @param {Style} style */
	setStyle(style) {
		this.style = style;
		this.#dance.style = style;
		this.#save();
	}

	/** Whether the dance is fading down under the machine's own music. */
	ducked = $state(false);
	/** Fade down under the machine's own music, or back up. @param {boolean} on */
	duck(on) {
		if (on === this.ducked) return;
		this.ducked = on;
		this.player.duck(on);
	}

	/** The Eno tracks, EN0 first, one button each. */
	get tracks() {
		return this.#tracks;
	}
	/** A machine brings its own tracks, or parameterizes the defaults. @param {readonly import('@wwsff/cabinet/dance').EnoTrack[]} list */
	set tracks(list) {
		this.#tracks = list;
		this.#dance.tracks = list;
	}
	/** A machine's event plays an Eno track once, in the chord, if the track is on. @param {number} track @param {number} [tone] @param {number} [weight] */
	kick(track, tone = 0, weight = 1) {
		this.#dance.kick(track, tone, weight);
	}

	/** Turn one Eno track on or off. @param {number} bit */
	toggleLayer(bit) {
		this.loops = this.#dance.loops = this.loops ^ bit;
		this.#save();
	}

	/** Memory's named regions; the first voice's hits warm them, and each warm one hums. @param {readonly Region[]} list */
	set regions(list) {
		this.#dance.regions = new Regions(list);
	}

	/**
	 * Something was just drawn or built: play it back, and say what it was at the end
	 * (`@wwsff/pixie`'s ringPhrase and sayPhrase make both from a ring).
	 * @param {readonly import('@wwsff/cabinet/dance').FlourishTone[]} tones @param {string} [say]
	 */
	flourish(tones, say = '') {
		if (this.on) this.#dance.flourish(tones, say);
	}

	/** A game or round is over: a hooray, 0 barely to 1 best, panned toward the winner. @param {number} score @param {number} [pan] */
	celebrate(score, pan = 0) {
		if (this.on) this.#dance.celebrate(score, pan);
	}

	/** The front panel's switch word: hashed into a twist of the music (twist in dance.ts). @param {number} word */
	set switches(word) {
		this.#dance.switches = word;
		this.twist = twistLabel(this.#dance.twist);
	}

	/** How deep the harmony goes, 0 to 1. @param {number} d */
	set depth(d) {
		this.#dance.depth = Math.max(0, Math.min(1, d));
	}

	/** Switch to a mode, as a screen angel's state asks; what it leaves out stays. @param {Music} m */
	mode(m) {
		if (m.style) this.style = this.#dance.style = m.style;
		if (m.bpm) this.#bpm = m.bpm;
		if (m.tracks) {
			const list = enoTracks(m.tracks);
			if (list.length) this.tracks = list;
		}
		if (m.loops !== undefined) this.loops = this.#dance.loops = enoLayers(m.loops, this.loops);
		if (m.listen !== undefined) this.listen = m.listen;
		if (m.mute) this.#dance.mute = new Set(m.mute);
		if (m.riff !== undefined) this.#dance.riff = m.riff;
	}

	/** What the person did: it bends the music on the next beats rather than sounding at once. @param {Touch} t */
	touch(t) {
		if (this.on) this.#dance.touch(t);
	}

	/** A character the teletype printed, or a key's echo on the paper: it plays a step at a time. @param {number} code */
	printed(code) {
		if (this.on) this.#dance.printed(code);
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
	 * @param {() => Called[]} [called] the routines entered since the last beat
	 */
	frame(now, hits, gauges, watched, called) {
		const ms = sixteenth(this.bpm);
		if (!this.on || now - this.#last < ms) return;
		this.#last = now - Math.min(ms, (now - this.#last) % ms);
		const g = gauges();
		this.player.play(this.#dance.beat(hits(), g.load, watched?.() ?? [], called?.() ?? []), ms);
		this.player.drive(g.load, Math.max(g.fill, this.#dance.tension));
	}
}

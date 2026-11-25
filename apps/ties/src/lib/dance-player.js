// The bus dance's instruments (packages/cabinet/src/dance.ts scores the notes). Each voice
// has its own gain, so a voice can be faded against the others: `fade` glides there, which is
// what anything driving the mix (a slider, the ECG, a program) calls.

/** @typedef {import('@wwsff/cabinet/dance').Note} Note */

/** Tempos to choose from, in beats (quarter notes) a minute; the dance plays sixteenths. */
export const TEMPOS = [40, 60, 72, 84, 96, 108, 120, 132, 144, 160, 180, 200];
/** Milliseconds a sixteenth lasts at `bpm`. */
export const sixteenth = (/** @type {number} */ bpm) => 15000 / bpm;
const STRUM = 0.018;

/** @param {number} midi */
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export class DancePlayer {
	/** @type {AudioContext | null} */
	#ctx = null;
	/** @type {GainNode | null} */
	#master = null;
	/** @type {Map<string, GainNode>} */
	#voices = new Map();
	/** @type {Map<string, number>} */
	#levels = new Map();

	/** Open the audio. Call it from a click or key: browsers start sound only then. */
	start() {
		if (this.#ctx) {
			if (this.#ctx.state === 'suspended') this.#ctx.resume();
			return;
		}
		if (typeof AudioContext === 'undefined') return;
		const ctx = new AudioContext();
		const limit = ctx.createDynamicsCompressor();
		limit.threshold.value = -12;
		limit.ratio.value = 8;
		const master = ctx.createGain();
		master.gain.value = 0.35;
		master.connect(limit).connect(ctx.destination);
		this.#ctx = ctx;
		this.#master = master;
	}

	stop() {
		this.#ctx?.close();
		this.#ctx = null;
		this.#master = null;
		this.#voices.clear();
		this.#engine = null;
	}

	/** @type {{ kind: string, set: (load: number, fill: number) => void } | null} */
	#engine = null;

	/**
	 * A continuous sound under the notes, driven by two smoothed readings, each 0 to 1: `load`,
	 * how hard the machine is working, and `fill`, a level such as free memory.
	 * - `saucer`: two detuned sines with a slow warble, rising with load; fill widens the warble.
	 * - `diesel`: a low sawtooth throbbing faster and brighter with load; fill opens the filter.
	 * @param {'saucer' | 'diesel'} kind
	 */
	engine(kind) {
		const ctx = this.#ctx;
		if (!ctx || this.#engine?.kind === kind) return;
		const bus = this.#bus('engine');
		const out = ctx.createGain();
		out.gain.value = 0;
		out.connect(bus);
		/** @param {OscillatorType} type @param {number} f */
		const osc = (type, f) => {
			const o = ctx.createOscillator();
			o.type = type;
			o.frequency.value = f;
			o.start();
			return o;
		};
		/** @param {AudioParam} p @param {number} v */
		const glide = (p, v) => p.setTargetAtTime(v, ctx.currentTime, 0.4);
		if (kind === 'saucer') {
			const a = osc('sine', 180);
			const b = osc('sine', 183);
			const warble = osc('sine', 5);
			const depth = ctx.createGain();
			depth.gain.value = 8;
			warble.connect(depth);
			depth.connect(a.frequency);
			depth.connect(b.frequency);
			a.connect(out);
			b.connect(out);
			this.#engine = {
				kind,
				set: (load, fill) => {
					glide(a.frequency, 160 + 260 * load);
					glide(b.frequency, 163 + 262 * load);
					glide(warble.frequency, 3 + 6 * load);
					glide(depth.gain, 4 + 30 * fill);
					glide(out.gain, 0.03 + 0.07 * load);
				}
			};
		} else {
			const saw = osc('sawtooth', 42);
			const lp = ctx.createBiquadFilter();
			lp.type = 'lowpass';
			lp.frequency.value = 220;
			lp.Q.value = 4;
			const throb = ctx.createGain();
			throb.gain.value = 0.5;
			const beat = osc('sine', 4);
			const swing = ctx.createGain();
			swing.gain.value = 0.5;
			beat.connect(swing).connect(throb.gain);
			saw.connect(lp).connect(throb).connect(out);
			this.#engine = {
				kind,
				set: (load, fill) => {
					glide(saw.frequency, 36 + 30 * load);
					glide(beat.frequency, 3 + 16 * load);
					glide(lp.frequency, 160 + 700 * load + 500 * fill);
					glide(out.gain, 0.08 + 0.12 * load);
				}
			};
		}
	}

	/** @param {number} load @param {number} fill */
	drive(load, fill) {
		const clamp = (/** @type {number} */ x) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));
		this.#engine?.set(clamp(load), clamp(fill));
	}

	/**
	 * Glide a voice's level, 0 to 1, over `seconds`.
	 * @param {string} voice @param {number} level @param {number} [seconds]
	 */
	fade(voice, level, seconds = 0.2) {
		this.#levels.set(voice, level);
		const g = this.#voices.get(voice);
		if (g && this.#ctx) g.gain.setTargetAtTime(level, this.#ctx.currentTime, seconds / 3);
	}

	/** @param {string} voice */
	level(voice) {
		return this.#levels.get(voice) ?? 1;
	}

	/** @param {string} voice */
	#bus(voice) {
		const ctx = /** @type {AudioContext} */ (this.#ctx);
		let g = this.#voices.get(voice);
		if (!g) {
			g = ctx.createGain();
			g.gain.value = this.level(voice);
			g.connect(/** @type {GainNode} */ (this.#master));
			this.#voices.set(voice, g);
		}
		return g;
	}

	/** @param {readonly Note[]} notes @param {number} stepMs how long a sixteenth lasts */
	play(notes, stepMs) {
		const ctx = this.#ctx;
		if (!ctx || ctx.state !== 'running') return;
		const now = ctx.currentTime + 0.02;
		for (const n of notes) this.#note(ctx, n, now + n.order * STRUM + ((n.late ?? 0) * stepMs) / 1000);
	}

	/** @type {AudioBuffer | null} */
	#white = null;

	/**
	 * Filtered white noise from `t` to `end`, into `to`.
	 * @param {AudioContext} ctx @param {BiquadFilterType} type @param {number} f @param {AudioNode} to @param {number} t @param {number} end
	 */
	#noise(ctx, type, f, to, t, end) {
		if (!this.#white || this.#white.sampleRate !== ctx.sampleRate) {
			this.#white = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
			const d = this.#white.getChannelData(0);
			for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
		}
		const src = ctx.createBufferSource();
		src.buffer = this.#white;
		const filter = ctx.createBiquadFilter();
		filter.type = type;
		filter.frequency.value = f;
		src.connect(filter).connect(to);
		src.start(t);
		src.stop(end);
	}

	/** @param {AudioContext} ctx @param {Note} n @param {number} t */
	#note(ctx, n, t) {
		const f = hz(n.midi);
		const v = 0.15 + 0.85 * n.velocity;
		const pan = ctx.createStereoPanner();
		pan.pan.value = n.pan;
		pan.connect(this.#bus(n.voice));
		const env = ctx.createGain();
		env.connect(pan);
		/** @param {OscillatorType} type @param {number} freq @param {AudioNode} to @param {number} end */
		const osc = (type, freq, to, end) => {
			const o = ctx.createOscillator();
			o.type = type;
			o.frequency.value = freq;
			o.connect(to);
			o.start(t);
			o.stop(end);
		};
		/** @param {number} peak @param {number} attack @param {number} decay */
		const shape = (peak, attack, decay) => {
			env.gain.setValueAtTime(0, t);
			env.gain.linearRampToValueAtTime(peak, t + attack);
			env.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
			return t + attack + decay + 0.05;
		};
		switch (n.timbre) {
			case 'bass': {
				osc('triangle', f, env, shape(0.5 * v, 0.006, 0.28));
				break;
			}
			case 'pluck': {
				const lp = ctx.createBiquadFilter();
				lp.type = 'lowpass';
				lp.frequency.setValueAtTime(3200, t);
				lp.frequency.exponentialRampToValueAtTime(500, t + 0.16);
				lp.connect(env);
				osc(n.odd ? 'square' : 'sawtooth', f, lp, shape((n.odd ? 0.16 : 0.22) * v, 0.003, 0.2));
				break;
			}
			case 'beep': {
				osc('square', f, env, shape(0.12 * v, 0.002, 0.09));
				break;
			}
			case 'glass': {
				const end = shape(0.12 * v, 0.03, 3.5);
				osc(n.odd ? 'triangle' : 'sine', f, env, end);
				const over = ctx.createGain();
				over.gain.value = 0.2;
				over.connect(env);
				osc('sine', f * (n.odd ? 3 : 2), over, end);
				break;
			}
			case 'chime': {
				const end = shape(0.18 * v, 0.004, 0.9);
				osc('sine', f, env, end);
				const over = ctx.createGain();
				over.gain.value = 0.35;
				over.connect(env);
				osc('sine', f * 2.76, over, end);
				break;
			}
			case 'pad': {
				osc(n.odd ? 'triangle' : 'sine', f, env, shape(0.25 * v, 0.06, 0.6));
				break;
			}
			case 'kick': {
				const o = ctx.createOscillator();
				o.frequency.setValueAtTime(150, t);
				o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
				o.connect(env);
				o.start(t);
				o.stop(shape(0.9 * v, 0.002, 0.3));
				break;
			}
			case 'snare': {
				const end = shape(0.45 * v, 0.001, 0.15);
				this.#noise(ctx, 'highpass', 1500, env, t, end);
				osc('triangle', 185, env, t + 0.05);
				break;
			}
			case 'hat': {
				this.#noise(ctx, 'highpass', 7000, env, t, shape(0.25 * v, 0.001, 0.04));
				break;
			}
			case 'ride': {
				const end = shape(0.16 * v, 0.001, 0.35);
				this.#noise(ctx, 'bandpass', 5200, env, t, end);
				osc('square', 2350, env, t + 0.02);
				break;
			}
			case 'rim': {
				const bp = ctx.createBiquadFilter();
				bp.type = 'bandpass';
				bp.frequency.value = 1700;
				bp.Q.value = 8;
				bp.connect(env);
				osc('square', 850, bp, shape(0.5 * v, 0.001, 0.025));
				break;
			}
			case 'brass': {
				const lp = ctx.createBiquadFilter();
				lp.type = 'lowpass';
				lp.Q.value = 2;
				lp.frequency.setValueAtTime(700, t);
				lp.frequency.linearRampToValueAtTime(2600, t + 0.06);
				lp.connect(env);
				const end = shape(0.16 * v, 0.03, 0.45);
				osc('sawtooth', f, lp, end);
				osc('sawtooth', f * 1.004, lp, end);
				osc('square', f / 2, lp, end);
				break;
			}
			// The pen's own: harp, lead, bell and tom are never the machine's instruments.
			case 'harp': {
				const end = shape(0.3 * v, 0.002, 1.4);
				osc('triangle', f, env, end);
				const over = ctx.createGain();
				over.gain.value = 0.25;
				over.connect(env);
				osc('sine', f * 2, over, t + 0.5);
				break;
			}
			case 'lead': {
				const lp = ctx.createBiquadFilter();
				lp.type = 'lowpass';
				lp.Q.value = 9;
				lp.frequency.setValueAtTime(500, t);
				lp.frequency.exponentialRampToValueAtTime(3500, t + 0.18);
				lp.connect(env);
				const end = shape(0.14 * v, 0.01, 0.4);
				osc('sawtooth', f, lp, end);
				osc('sawtooth', f * 1.006, lp, end);
				break;
			}
			case 'bell': {
				const end = shape(0.22 * v, 0.002, 1.3);
				const carrier = ctx.createOscillator();
				carrier.frequency.value = f;
				const mod = ctx.createOscillator();
				mod.frequency.value = f * 3.5;
				const depth = ctx.createGain();
				depth.gain.setValueAtTime(f * 2.5, t);
				depth.gain.exponentialRampToValueAtTime(f * 0.1, t + 1);
				mod.connect(depth).connect(carrier.frequency);
				carrier.connect(env);
				for (const o of [carrier, mod]) {
					o.start(t);
					o.stop(end);
				}
				break;
			}
			case 'tom': {
				const o = ctx.createOscillator();
				o.frequency.setValueAtTime(f * 2, t);
				o.frequency.exponentialRampToValueAtTime(f, t + 0.1);
				o.connect(env);
				o.start(t);
				const end = shape(0.8 * v, 0.001, 0.35);
				o.stop(end);
				this.#noise(ctx, 'highpass', 4000, env, t, t + 0.015);
				break;
			}
			case 'tick': {
				const bp = ctx.createBiquadFilter();
				bp.type = 'bandpass';
				bp.frequency.value = f * 4;
				bp.Q.value = 6;
				bp.connect(env);
				osc('square', f, bp, shape(0.4 * v, 0.001, 0.05));
				break;
			}
		}
	}
}

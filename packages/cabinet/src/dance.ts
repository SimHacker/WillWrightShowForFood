/**
 * The bus dance: what each processor on the backplane did during a beat, played as notes.
 * Approach 8 in AM-RADIO.md. Each source is a voice with its own timbre, register and pan;
 * what it did is a set of hits, a key (a block's entry, a display block, a disk track) with a
 * weight (instructions retired, strokes drawn). The heaviest hits of a beat become its notes.
 *
 * A key always plays the same note, so a loop is a motif and a program settling into its inner
 * loop is heard as a figure that repeats. Notes are quantized to a scale and played on a beat
 * clock in wall time, so the dance stays in tune and in time at any emulator speed: slowed down,
 * a beat holds fewer instructions but the same hottest blocks.
 *
 * Pure: the page owns the clock and the audio.
 */

export type Drum = "kick" | "snare" | "hat" | "ride" | "rim";
export type Timbre = "bass" | "pluck" | "chime" | "pad" | "tick" | "beep" | "glass" | Drum;

export type Voice = {
	readonly id: string;
	readonly label: string;
	readonly timbre: Timbre;
	/** MIDI note of the lowest degree. */
	readonly root: number;
	readonly octaves: number;
	/** -1 left to 1 right. */
	readonly pan: number;
	/** The most notes it plays in one beat. */
	readonly most: number;
};

export type Hit = { readonly key: number; readonly weight: number };

export type Note = {
	readonly voice: string;
	readonly timbre: Timbre;
	readonly midi: number;
	/** 0 to 1. */
	readonly velocity: number;
	readonly pan: number;
	/** Its place in the beat's strum, from 0. */
	readonly order: number;
	/** How late it plays, as a fraction of a sixteenth: the swing. */
	readonly late?: number;
	/** Play it with odd harmonics only (square, triangle), as the Kees tuning wants. */
	readonly odd?: boolean;
};

/**
 * `straight` is triads in even sixteenths; `jazz` is seventh chords, swung, on a ride; `kees` is
 * Kees van Prooijen's 13 steps of the tritave, odd harmonics, in bars of 13.
 */
export type Style = "straight" | "jazz" | "kees";

/** A tuning: `steps` equal steps of the interval `period` (2, the octave; 3, the tritave). */
export type Tuning = { readonly steps: number; readonly period: number };
export const TET12: Tuning = { steps: 12, period: 2 };
/**
 * 13 equal steps of the 3:1 tritave, each 3^(1/13), about 146.3 cents. Kees van Prooijen found
 * it in the seventies, at about the time Heinz Bohlen and later John Pierce did; it is known as
 * the Bohlen-Pierce scale. https://www.kees.cc/music/scale13/scale13.html
 */
export const KEES13: Tuning = { steps: 13, period: 3 };

/** A MIDI note number, fractional off 12-TET: `step` steps of `t` above `base`. */
export const midiAt = (base: number, step: number, t: Tuning = TET12): number => base + (12 * Math.log2(t.period) * step) / t.steps;

/** Major pentatonic: no two degrees clash, whatever the keys land on. */
export const PENTATONIC: readonly number[] = [0, 2, 4, 7, 9];
/** The blues scale: minor pentatonic with the flat fifth. */
export const BLUES: readonly number[] = [0, 3, 5, 6, 7, 10];
/** How late the swung eighths land, in sixteenths: a triplet feel. */
export const SWING = 1 / 3;

/** The note a key plays. Hashed, so neighbouring addresses land on different degrees. */
export function pitch(v: Voice, key: number, scale: readonly number[] = PENTATONIC, t: Tuning = TET12): number {
	const steps = scale.length * v.octaves;
	const d = (Math.imul(key >>> 0, 0x9e3779b1) >>> 0) % steps;
	return midiAt(v.root, t.steps * Math.floor(d / scale.length) + (scale[d % scale.length] ?? 0), t);
}

/** A beat's notes for one voice: its `most` heaviest hits, loudest first. */
export function score(v: Voice, hits: readonly Hit[], scale: readonly number[] = PENTATONIC, t: Tuning = TET12): Note[] {
	const live = hits.filter((h) => h.weight > 0).sort((a, b) => b.weight - a.weight || a.key - b.key);
	const total = live.reduce((s, h) => s + h.weight, 0);
	const out: Note[] = [];
	const seen = new Set<number>();
	for (const h of live) {
		if (out.length >= v.most) break;
		const midi = pitch(v, h.key, scale, t);
		if (seen.has(midi)) continue;
		seen.add(midi);
		out.push({ voice: v.id, timbre: v.timbre, midi, velocity: Math.sqrt(h.weight / total), pan: v.pan, order: out.length });
	}
	return out;
}

/**
 * Running counts in, what changed since the last beat out. A count that went down belongs to a
 * block that was rebuilt, so all of it is new.
 */
export class Deltas {
	private last = new Map<number, number>();

	step(counts: Iterable<readonly [number, number]>): Hit[] {
		const now = new Map<number, number>();
		const out: Hit[] = [];
		for (const [key, n] of counts) {
			now.set(key, n);
			const was = this.last.get(key) ?? 0;
			const d = n >= was ? n - was : n;
			if (d > 0) out.push({ key, weight: d });
		}
		this.last = now;
		return out;
	}
}

/** Weights summed by key, for sources that report one event at a time. */
export class Tally {
	private counts = new Map<number, number>();

	add(key: number, weight = 1): void {
		this.counts.set(key, (this.counts.get(key) ?? 0) + weight);
	}

	/** The hits since the last take, and start again. */
	take(): Hit[] {
		const out = [...this.counts].map(([key, weight]) => ({ key, weight }));
		this.counts.clear();
		return out;
	}
}

/**
 * The period, in steps, that the two heaviest hits beat at: the heavier's weight over the
 * other's, rounded, 2 to 9. An inner loop run three times for each pass of its outer loop
 * gives 3, a rim click every third step against the groove's four. 0 with fewer than two.
 */
export function period(hits: readonly Hit[]): number {
	const [a, b] = [...hits].filter((h) => h.weight > 0).sort((x, y) => y.weight - x.weight);
	if (!a || !b) return 0;
	return Math.max(2, Math.min(9, Math.round(a.weight / b.weight)));
}

/**
 * The drums on one sixteenth of a bar: a four-on-the-floor kick, a backbeat snare, hats from
 * offbeats to every step as `load` (0 to 1) rises, and a rim click every `every` steps, shifted
 * by `phase`.
 */
export function groove(step: number, load: number, every: number, phase = 0): Drum[] {
	const s = ((step % 16) + 16) % 16;
	const out: Drum[] = [];
	if (s % 4 === 0) out.push("kick");
	if (s === 4 || s === 12) out.push("snare");
	if (load >= 0.7 || (load >= 0.4 && s % 2 === 0) || (load >= 0.1 && s % 4 === 2)) out.push("hat");
	if (every >= 2 && (((step + phase) % every) + every) % every === 0) out.push("rim");
	return out;
}

/**
 * Jazz time on one sixteenth: the ride's "spang-a-lang" (1, 2 and-a, 3, 4 and-a), a feathered kick
 * on 1 and 3, a snare comp on the and of 3, more ride as `load` rises, and the same rim.
 */
export function swing(step: number, load: number, every: number, phase = 0): Drum[] {
	const s = ((step % 16) + 16) % 16;
	const out: Drum[] = [];
	if (s === 0 || s === 8) out.push("kick");
	if (s === 10) out.push("snare");
	if (s % 4 === 0 || s === 6 || s === 14 || (load >= 0.7 && s % 2 === 0)) out.push("ride");
	if (every >= 2 && (((step + phase) % every) + every) % every === 0) out.push("rim");
	return out;
}

/**
 * A bar of 13 sixteenths for the Kees tuning's 13 steps, grouped 4+3+3+3: the kick opens the
 * bar and the third group, the snare lands on the second and fourth, hats fill as load rises.
 */
export function thirteen(step: number, load: number, every: number, phase = 0): Drum[] {
	const s = ((step % 13) + 13) % 13;
	const out: Drum[] = [];
	if (s === 0 || s === 7) out.push("kick");
	if (s === 4 || s === 10) out.push("snare");
	if (load >= 0.7 || (load >= 0.4 && s % 2 === 1) || (load >= 0.1 && (s === 2 || s === 9))) out.push("hat");
	if (every >= 2 && (((step + phase) % every) + every) % every === 0) out.push("rim");
	return out;
}

/** The swung sixteenths: the second eighth of each beat. */
const swung = (step: number) => ((step % 4) + 4) % 4 === 2;

const DRUM_MIDI: Record<Drum, number> = { kick: 36, snare: 38, hat: 42, ride: 51, rim: 37 };

/** A chord as its root and the pitch classes it holds, above the key's tonic. */
export type Chord = { readonly name: string; readonly root: number; readonly tones: readonly number[] };

/** Tones from the root up; the root is the first. In steps of the tuning, `n` to its period. */
const chordIn = (n: number) => (name: string, ...tones: number[]): Chord => ({ name, root: (tones[0] ?? 0) % n, tones: tones.map((t) => t % n).sort((x, y) => x - y) });
const chord = chordIn(12);
const kees = chordIn(13);

/** I vi IV V, a bar each. */
export const POP: readonly Chord[] = [chord("I", 0, 4, 7), chord("vi", 9, 12, 16), chord("IV", 5, 9, 12), chord("V", 7, 11, 14)];
/** ii7 V7 Imaj7 vi7, the turnaround. */
export const TURNAROUND: readonly Chord[] = [chord("ii7", 2, 5, 9, 12), chord("V7", 7, 11, 14, 17), chord("Imaj7", 0, 4, 7, 11), chord("vi7", 9, 12, 16, 19)];
/** Where tension takes the harmony: the dominant, then the dominant with its seventh and flat ninth. */
export const DOMINANT = chord("V7", 7, 11, 14, 17);
export const DOMINANT_B9 = chord("V7b9", 7, 11, 14, 17, 20);

/**
 * Kees van Prooijen's major, in steps of KEES13: built as just major is from triads on the tonic,
 * dominant and subdominant, with the 3:5:7 triad (1, 5/3, 7/3) in place of 4:5:6. The ratios
 * 1, 35/27, 7/5, 5/3, 9/5, 7/3, 25/9 fall on steps 0, 3, 4, 6, 7, 10, 12.
 */
export const KEES_MAJOR: readonly number[] = [0, 3, 4, 6, 7, 10, 12];
/** Tonic 1 : 5/3 : 7/3; on 9/5 (9/5, 3, 21/5); on 5/3 (5/3, 25/9, 35/9), his dominant. */
export const KEES_I = kees("I", 0, 6, 10);
export const KEES_IV = kees("IV", 7, 13, 17);
export const KEES_V = kees("V", 6, 12, 16);
/** I IV V I, a bar of 13 each. */
export const KEES_CADENCE: readonly Chord[] = [KEES_I, KEES_IV, KEES_V, KEES_I];

/**
 * Tape loops after Brian Eno's Music for Airports: each sounds one tone of the chord in force,
 * once every `length` sixteenths, from `at`. The lengths are primes, so the loops drift against
 * each other and the bar and come round together only after their product, about 36 million
 * sixteenths; what they play is always in the harmony.
 */
export const LOOPS: readonly { readonly length: number; readonly at: number; readonly tone: number; readonly up: number }[] = [
	{ length: 23, at: 0, tone: 0, up: 0 },
	{ length: 29, at: 7, tone: 1, up: 0 },
	{ length: 31, at: 13, tone: 2, up: 0 },
	{ length: 37, at: 19, tone: 0, up: 1 },
	{ length: 41, at: 3, tone: 1, up: 1 },
];

/** What the person at the console did, as the dance hears it. */
export type Touch =
	| { readonly kind: "key"; readonly code: number }
	| { readonly kind: "press" }
	| { readonly kind: "drag"; readonly distance: number }
	| { readonly kind: "release" };

/** A held pen's drag, in 340 points, that brings tension from none to full. */
const DRAG_FULL = 3000;
/** Tension's fall each sixteenth once the pen is up. */
const EASE = 0.92;
/** Tension above this, on release, resolves home with an accent. */
const RESOLVE = 0.35;

/**
 * The voices, and each beat's hits from them in, notes out, over a chord progression that the
 * person at the console bends without playing anything directly.
 *
 * - A key shifts the rim click's phase by a step and queues a three-note reply, "beep boop
 *   bop", on the next offbeats, its notes from the chord and the key's code: the computer
 *   answering, in time and in key.
 * - Pressing the light pen and dragging it builds tension, by how far it travels. Past 0.4 the
 *   harmony leaves the progression for the dominant, past 0.8 adds the flat ninth; hats thicken
 *   and the engine is pushed. Lifting the pen resolves to the tonic on the next beat, with a
 *   kick and the chord full, and the progression starts again from there. A light touch, or one
 *   that eases off before release, just fades back into the progression.
 */
export class Dance {
	/** Sixteenths since the dance began. */
	step = 0;
	style: Style = "straight";
	/** Play the tape loops. */
	loops = false;
	/** 0 to 1: how far the pen has pulled the harmony away from home. */
	tension = 0;
	/** The rim click's shift, in steps; each key moves it one. */
	phase = 0;
	private held = false;
	private resolving = false;
	/** The step the progression's first bar starts on. */
	private home = 0;
	private last: Chord | null = null;
	private replies: { at: number; key: number; i: number }[] = [];

	constructor(readonly voices: readonly Voice[]) {}

	get progression(): readonly Chord[] {
		return this.style === "jazz" ? TURNAROUND : this.style === "kees" ? KEES_CADENCE : POP;
	}

	get tuning(): Tuning {
		return this.style === "kees" ? KEES13 : TET12;
	}

	/** Sixteenths to the bar. */
	get bar(): number {
		return this.style === "kees" ? 13 : 16;
	}

	/** The chord the next beat plays over. */
	get chord(): Chord {
		const kees = this.style === "kees";
		if (this.resolving) return kees ? KEES_I : this.progression[this.style === "jazz" ? 2 : 0]!;
		if (this.tension >= 0.8) return kees ? KEES_V : DOMINANT_B9;
		if (this.tension >= 0.4) return kees ? KEES_V : DOMINANT;
		const p = this.progression;
		return p[Math.floor((this.step - this.home) / this.bar) % p.length]!;
	}

	touch(t: Touch): void {
		switch (t.kind) {
			case "key": {
				this.phase += 1;
				const first = this.step + (this.step % 2 === 0 ? 1 : 2);
				this.replies = [0, 1, 2].map((i) => ({ at: first + i * 2, key: t.code * 7 + i, i }));
				break;
			}
			case "press":
				this.held = true;
				this.tension = Math.min(1, this.tension + 0.15);
				break;
			case "drag":
				if (this.held) this.tension = Math.min(1, this.tension + t.distance / DRAG_FULL);
				break;
			case "release":
				this.held = false;
				if (this.tension >= RESOLVE) this.resolving = true;
				break;
		}
	}

	/**
	 * One sixteenth. With `load`, the drums play too, their rim click at the period of the
	 * first voice's two heaviest hits; a machine doing nothing plays no drums, but still answers.
	 */
	beat(hits: Readonly<Record<string, readonly Hit[] | undefined>>, load?: number): Note[] {
		const step = this.step;
		const jazz = this.style === "jazz";
		const late = jazz && swung(step) ? SWING : 0;
		const now = this.chord;
		const tones = now.tones;
		const t = this.tuning;
		const notes: Note[] = this.voices.flatMap((v) => score(v, hits[v.id] ?? [], tones, t));
		const resolved = this.resolving;
		if (now !== this.last || resolved) {
			const loud = resolved ? 0.9 : 0.35 + 0.3 * this.tension;
			tones.forEach((tone, i) => notes.push({ voice: "harmony", timbre: "pad", midi: midiAt(60, tone, t), velocity: loud, pan: 0, order: i }));
			notes.push({ voice: "harmony", timbre: "bass", midi: midiAt(36, now.root, t), velocity: loud, pan: 0, order: 0 });
			this.last = now;
		}
		for (const r of this.replies.filter((r) => r.at === step))
			notes.push({ voice: "reply", timbre: "beep", midi: pitch({ id: "reply", label: "", timbre: "beep", root: 72, octaves: 2, pan: 0, most: 1 }, r.key, tones, t), velocity: 0.7 - 0.15 * r.i, pan: 0.5 - 0.5 * r.i, order: 0 });
		this.replies = this.replies.filter((r) => r.at > step);
		if (this.loops)
			for (const l of LOOPS)
				if (step % l.length === l.at % l.length) {
					const tone = tones[l.tone % tones.length] ?? 0;
					notes.push({ voice: "loops", timbre: "glass", midi: midiAt(72, tone + l.up * t.steps, t), velocity: 0.5, pan: (l.length % 5) / 2 - 1, order: 0 });
				}
		const drive = Math.min(1, (load ?? 0) + 0.5 * this.tension);
		if (drive > 0 && (load ?? 0) > 0) {
			const lead = hits[this.voices[0]?.id ?? ""] ?? [];
			const soft = (d: Drum) => (d === "hat" || d === "ride" ? 0.4 + 0.4 * drive : jazz && d === "kick" ? 0.35 : 0.8);
			for (const d of (jazz ? swing : this.style === "kees" ? thirteen : groove)(step, drive, period(lead), this.phase))
				notes.push({ voice: "drums", timbre: d, midi: DRUM_MIDI[d], velocity: soft(d), pan: d === "hat" || d === "ride" ? 0.2 : d === "rim" ? -0.2 : 0, order: 0 });
		}
		if (resolved) {
			notes.push({ voice: "drums", timbre: "kick", midi: DRUM_MIDI.kick, velocity: 1, pan: 0, order: 0 });
			this.resolving = false;
			this.tension = 0;
			this.home = step - ((step - this.home) % this.bar);
		} else if (!this.held) this.tension *= EASE;
		this.step += 1;
		const odd = this.style === "kees";
		return late || odd ? notes.map((n) => ({ ...n, ...(late ? { late } : {}), ...(odd ? { odd } : {}) })) : notes;
	}
}

/** The PDP-7 cabinet's voices: the CPU low, the 340 bright, the Forth device a bell above both. */
export const PDP7_VOICES: readonly Voice[] = [
	{ id: "cpu", label: "PDP-7", timbre: "bass", root: 36, octaves: 2, pan: -0.3, most: 2 },
	{ id: "340", label: "Type 340", timbre: "pluck", root: 60, octaves: 2, pan: 0.3, most: 3 },
	{ id: "forth", label: "Forth device", timbre: "chime", root: 84, octaves: 1, pan: 0, most: 1 },
];

/** The Apple ]['s voices: the 6502, the Disk II's head, and the speaker. */
export const APPLE2_VOICES: readonly Voice[] = [
	{ id: "6502", label: "6502", timbre: "pluck", root: 48, octaves: 2, pan: -0.2, most: 3 },
	{ id: "disk", label: "Disk II", timbre: "tick", root: 40, octaves: 3, pan: 0.4, most: 1 },
	{ id: "speaker", label: "Speaker", timbre: "chime", root: 79, octaves: 1, pan: 0, most: 1 },
];

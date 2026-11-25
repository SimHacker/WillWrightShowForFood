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
export type Timbre = "bass" | "pluck" | "chime" | "pad" | "tick" | Drum;

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
};

/** `straight` is pentatonic in even sixteenths; `jazz` is the blues scale, swung, on a ride. */
export type Style = "straight" | "jazz";

/** Major pentatonic: no two degrees clash, whatever the keys land on. */
export const PENTATONIC: readonly number[] = [0, 2, 4, 7, 9];
/** The blues scale: minor pentatonic with the flat fifth. */
export const BLUES: readonly number[] = [0, 3, 5, 6, 7, 10];
/** How late the swung eighths land, in sixteenths: a triplet feel. */
export const SWING = 1 / 3;

/** The note a key plays. Hashed, so neighbouring addresses land on different degrees. */
export function pitch(v: Voice, key: number, scale: readonly number[] = PENTATONIC): number {
	const steps = scale.length * v.octaves;
	const d = (Math.imul(key >>> 0, 0x9e3779b1) >>> 0) % steps;
	return v.root + 12 * Math.floor(d / scale.length) + (scale[d % scale.length] ?? 0);
}

/** A beat's notes for one voice: its `most` heaviest hits, loudest first. */
export function score(v: Voice, hits: readonly Hit[], scale: readonly number[] = PENTATONIC): Note[] {
	const live = hits.filter((h) => h.weight > 0).sort((a, b) => b.weight - a.weight || a.key - b.key);
	const total = live.reduce((s, h) => s + h.weight, 0);
	const out: Note[] = [];
	const seen = new Set<number>();
	for (const h of live) {
		if (out.length >= v.most) break;
		const midi = pitch(v, h.key, scale);
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
 * offbeats to every step as `load` (0 to 1) rises, and a rim click every `every` steps.
 */
export function groove(step: number, load: number, every: number): Drum[] {
	const s = ((step % 16) + 16) % 16;
	const out: Drum[] = [];
	if (s % 4 === 0) out.push("kick");
	if (s === 4 || s === 12) out.push("snare");
	if (load >= 0.7 || (load >= 0.4 && s % 2 === 0) || (load >= 0.1 && s % 4 === 2)) out.push("hat");
	if (every >= 2 && step % every === 0) out.push("rim");
	return out;
}

/**
 * Jazz time on one sixteenth: the ride's "spang-a-lang" (1, 2 and-a, 3, 4 and-a), a feathered kick
 * on 1 and 3, a snare comp on the and of 3, more ride as `load` rises, and the same rim.
 */
export function swing(step: number, load: number, every: number): Drum[] {
	const s = ((step % 16) + 16) % 16;
	const out: Drum[] = [];
	if (s === 0 || s === 8) out.push("kick");
	if (s === 10) out.push("snare");
	if (s % 4 === 0 || s === 6 || s === 14 || (load >= 0.7 && s % 2 === 0)) out.push("ride");
	if (every >= 2 && step % every === 0) out.push("rim");
	return out;
}

/** The swung sixteenths: the second eighth of each beat. */
const swung = (step: number) => ((step % 4) + 4) % 4 === 2;

const DRUM_MIDI: Record<Drum, number> = { kick: 36, snare: 38, hat: 42, ride: 51, rim: 37 };

/** The voices, and each beat's hits from them in, notes out. */
export class Dance {
	/** Sixteenths since the dance began. */
	step = 0;

	style: Style = "straight";

	constructor(readonly voices: readonly Voice[]) {}

	get scale(): readonly number[] {
		return this.style === "jazz" ? BLUES : PENTATONIC;
	}

	/**
	 * One sixteenth. With `load`, the drums play too, their rim click at the period of the
	 * first voice's two heaviest hits; a machine doing nothing plays no drums.
	 */
	beat(hits: Readonly<Record<string, readonly Hit[] | undefined>>, load?: number): Note[] {
		const step = this.step++;
		const jazz = this.style === "jazz";
		const late = jazz && swung(step) ? SWING : 0;
		const notes = this.voices.flatMap((v) => score(v, hits[v.id] ?? [], this.scale)).map((n) => (late ? { ...n, late } : n));
		if (load === undefined || load <= 0) return notes;
		const lead = hits[this.voices[0]?.id ?? ""] ?? [];
		const soft = (d: Drum) => (d === "hat" || d === "ride" ? 0.4 + 0.4 * load : jazz && d === "kick" ? 0.35 : 0.8);
		for (const d of (jazz ? swing : groove)(step, load, period(lead)))
			notes.push({ voice: "drums", timbre: d, midi: DRUM_MIDI[d], velocity: soft(d), pan: d === "hat" || d === "ride" ? 0.2 : d === "rim" ? -0.2 : 0, order: 0, late });
		return notes;
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

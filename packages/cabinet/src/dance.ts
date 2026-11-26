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

export type Drum = "kick" | "snare" | "hat" | "ride" | "rim" | "crash";
/** The pen's own instruments, `harp` `lead` `bell` `tom`, are never the machine's, so playing the picture stands apart from what plays itself. */
export type Timbre = "bass" | "pluck" | "chime" | "pad" | "tick" | "beep" | "glass" | "brass" | "keys" | "organ" | "acid" | "anvil" | "sing" | "whistle" | "harp" | "lead" | "bell" | "tom" | Drum;

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
	/** Play it with odd harmonics only (square, triangle), as the Bohlen-Pierce tuning wants. */
	readonly odd?: boolean;
};

/**
 * `straight` is triads in even sixteenths; `jazz` is seventh chords, swung, on a ride;
 * `lydian` rocks between I and II with the tritone over the tonic; `minor` walks the
 * Aeolian loop, i bVI bIII bVII; `bp` is
 * Bohlen-Pierce: 13 steps of the tritave, odd harmonics, in bars of 13.
 */
export type Style = "straight" | "jazz" | "lydian" | "minor" | "bp";

/** A tuning: `steps` equal steps of the interval `period` (2, the octave; 3, the tritave). */
export type Tuning = { readonly steps: number; readonly period: number };
export const TET12: Tuning = { steps: 12, period: 2 };
/**
 * 13 equal steps of the 3:1 tritave, each 3^(1/13), about 146.3 cents. Kees van Prooijen found
 * it in the seventies, at about the time Heinz Bohlen and later John Pierce did; it is known as
 * the Bohlen-Pierce scale. https://www.kees.cc/music/scale13/scale13.html
 */
export const BP13: Tuning = { steps: 13, period: 3 };

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
 * A bar of 13 sixteenths for the Bohlen-Pierce tuning's 13 steps, grouped 4+3+3+3: the kick opens the
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

const DRUM_MIDI: Record<Drum, number> = { kick: 36, snare: 38, hat: 42, ride: 51, rim: 37, crash: 49 };

/** A chord as its root and the pitch classes it holds, above the key's tonic. */
export type Chord = { readonly name: string; readonly root: number; readonly tones: readonly number[] };

/** Tones from the root up; the root is the first. In steps of the tuning, `n` to its period. */
const chordIn = (n: number) => (name: string, ...tones: number[]): Chord => ({ name, root: (tones[0] ?? 0) % n, tones: tones.map((t) => t % n).sort((x, y) => x - y) });
const chord = chordIn(12);
const bp = chordIn(13);

/** I vi IV V, a bar each. */
export const POP: readonly Chord[] = [chord("I", 0, 4, 7), chord("vi", 9, 12, 16), chord("IV", 5, 9, 12), chord("V", 7, 11, 14)];
/** ii7 V7 Imaj7 vi7, the turnaround. */
export const TURNAROUND: readonly Chord[] = [chord("ii7", 2, 5, 9, 12), chord("V7", 7, 11, 14, 17), chord("Imaj7", 0, 4, 7, 11), chord("vi7", 9, 12, 16, 19)];
/** Where tension takes the harmony: the dominant, then the dominant with its seventh and flat ninth. */
export const DOMINANT = chord("V7", 7, 11, 14, 17);
export const DOMINANT_B9 = chord("V7b9", 7, 11, 14, 17, 20);
/**
 * The devil's interval, the tritone, six semitones. Lydian is major with its fourth raised a
 * tritone above the tonic, the bright, slightly wrong-footed sound of the Simpsons theme. The
 * vamp rocks between I, its raised fourth added, and II major, whose third is that fourth.
 */
export const LYDIAN_I = chord("I#11", 0, 4, 6, 7, 11);
export const LYDIAN: readonly Chord[] = [LYDIAN_I, chord("II", 2, 6, 9), LYDIAN_I, chord("II7", 2, 6, 9, 12)];
/** Jazz's tritone substitution: D flat 7 for G7, its root a tritone away, sliding down a half step home. */
/** The Aeolian loop, i bVI bIII bVII, in C minor. */
export const AEOLIAN: readonly Chord[] = [chord("i", 0, 3, 7), chord("bVI", 8, 12, 15), chord("bIII", 3, 7, 10), chord("bVII", 10, 14, 17)];
export const TRITONE_SUB = chord("bII7", 1, 5, 8, 11);

/**
 * Kees van Prooijen's major, in steps of BP13: built as just major is from triads on the tonic,
 * dominant and subdominant, with the 3:5:7 triad (1, 5/3, 7/3) in place of 4:5:6. The ratios
 * 1, 35/27, 7/5, 5/3, 9/5, 7/3, 25/9 fall on steps 0, 3, 4, 6, 7, 10, 12.
 */
export const BP_MAJOR: readonly number[] = [0, 3, 4, 6, 7, 10, 12];
/** Tonic 1 : 5/3 : 7/3; on 9/5 (9/5, 3, 21/5); on 5/3 (5/3, 25/9, 35/9), his dominant. */
export const BP_I = bp("I", 0, 6, 10);
export const BP_IV = bp("IV", 7, 13, 17);
export const BP_V = bp("V", 6, 12, 16);
/** I IV V I, a bar of 13 each. */
export const BP_CADENCE: readonly Chord[] = [BP_I, BP_IV, BP_V, BP_I];

/**
 * A style's harmony as a graph: its chords, and for each the chords it may move to. The
 * first phrase is the style's own loop; every phrase after is a walk through the graph,
 * four bars long, chosen by a hash of what the machine has been running (`Dance.phrase`).
 * Even phrases start at home; odd ones end on a chord that leads home, so the walk keeps
 * cadencing however far it wanders.
 */
export type Harmony = { readonly first: readonly Chord[]; readonly home: Chord; readonly moves: ReadonlyMap<Chord, readonly Chord[]> };

function harmony(first: readonly Chord[], home: Chord, extra: readonly Chord[], moves: Record<string, string>): Harmony {
	const by = new Map<string, Chord>();
	for (const c of [...first, home, ...extra]) if (!by.has(c.name)) by.set(c.name, c);
	const get = (name: string) => {
		const c = by.get(name);
		if (!c) throw new Error(`harmony: no chord ${name}`);
		return c;
	};
	const graph = new Map<Chord, readonly Chord[]>();
	for (const [from, to] of Object.entries(moves)) graph.set(get(from), to.split(" ").map(get));
	for (const c of by.values()) if (!graph.has(c)) throw new Error(`harmony: ${c.name} goes nowhere`);
	return { first, home, moves: graph };
}

/** Major: the diatonic triads, with the flat seventh and the minor iv borrowed from minor. */
export const MAJOR_WALK = harmony(POP, POP[0]!, [chord("ii", 2, 5, 9), chord("iii", 4, 7, 11), chord("bVII", 10, 14, 17), chord("iv", 5, 8, 12)], {
	I: "IV V vi ii iii bVII",
	ii: "V IV",
	iii: "vi IV",
	IV: "V I ii iv",
	iv: "I",
	V: "I vi",
	vi: "ii IV V iii",
	bVII: "IV I",
});

/** Jazz: sevenths, the secondary dominants VI7 and II7, the backdoor bVII7, and I7 into IV. */
export const JAZZ_WALK = harmony(TURNAROUND, TURNAROUND[2]!, [chord("iii7", 4, 7, 11, 14), chord("IVmaj7", 5, 9, 12, 16), chord("VI7", 9, 13, 16, 19), chord("II7", 2, 6, 9, 12), chord("bVII7", 10, 14, 17, 20), chord("I7", 0, 4, 7, 10)], {
	Imaj7: "vi7 VI7 iii7 IVmaj7 I7 ii7",
	ii7: "V7 bVII7",
	V7: "Imaj7 vi7",
	vi7: "ii7 II7",
	VI7: "ii7",
	II7: "V7 ii7",
	iii7: "vi7 VI7",
	IVmaj7: "iii7 ii7 bVII7 V7",
	bVII7: "Imaj7",
	I7: "IVmaj7",
});

/** Minor: natural minor's chords, the half-diminished ii, and harmonic minor's major V. */
export const MINOR_WALK = harmony(AEOLIAN, AEOLIAN[0]!, [chord("iiø", 2, 5, 8), chord("iv", 5, 8, 12), chord("v", 7, 10, 14), chord("V", 7, 11, 14)], {
	i: "bVI iv bVII bIII v iiø",
	iiø: "V",
	bIII: "bVII bVI iv",
	iv: "V i bVII v",
	v: "bVI i",
	V: "i bVI",
	bVI: "bIII bVII iv V",
	bVII: "bIII i bVI",
});

/** Lydian: the vamp's I and II, and the mode's iii, V, vi and vii. */
export const LYDIAN_WALK = harmony(LYDIAN, LYDIAN_I, [chord("iii", 4, 7, 11), chord("V", 7, 11, 14), chord("vi", 9, 12, 16), chord("vii", 11, 14, 18)], {
	"I#11": "II vii V iii",
	II: "I#11 II7 vii",
	II7: "I#11 V",
	vii: "II I#11",
	V: "II I#11",
	iii: "II vi",
	vi: "II vii",
});

/** Bohlen-Pierce: Kees van Prooijen's three, in any order that comes home. */
export const BP_WALK = harmony(BP_CADENCE, BP_I, [], { I: "IV V", IV: "V I", V: "I IV" });

/** One loop of an Eno track: a tone of the chord in force, once every `length` sixteenths from `at`, `up` octaves higher. */
export type EnoLoop = { readonly length: number; readonly at: number; readonly tone: number; readonly up?: number; readonly pan?: number };

/**
 * An Eno track: a generative layer with its own instrument, register and time scale. Its loops
 * play by themselves while it is on; a machine's adaptor can also `kick` it from its own events
 * (a ROM call, a disk seek, a light-pen hit), and the kick plays in the track's voice, in the
 * chord, on the next sixteenth. The lengths are primes, so loops drift against each other and
 * the bar and come round together only after their product.
 */
export type EnoTrack = {
	readonly id: string;
	/** A word or two, shown after its EN number: "Airports". */
	readonly name: string;
	/** What it plays and after what, for the button's tooltip. */
	readonly description: string;
	readonly timbre: Timbre;
	readonly root: number;
	readonly velocity: number;
	readonly loops: readonly EnoLoop[];
};

/** Music for Airports' tape loops: five, about 36 million sixteenths before they line up again. */
export const LOOPS: readonly EnoLoop[] = [
	{ length: 23, at: 0, tone: 0 },
	{ length: 29, at: 7, tone: 1 },
	{ length: 31, at: 13, tone: 2 },
	{ length: 37, at: 19, tone: 0, up: 1 },
	{ length: 41, at: 3, tone: 1, up: 1 },
];

/**
 * The tracks every machine starts with, EN0 up: each a bit of `Dance.loops`, on or off by
 * itself. More can be added, and a machine can bring its own list (`Dance.tracks`).
 */
export const ENO_TRACKS: readonly EnoTrack[] = [
	{
		id: "airports",
		name: "Airports",
		description: "tape loops after Brian Eno's Music for Airports 1/1: five glass tones of prime lengths, 23 to 41 sixteenths, each a tone of the chord, drifting against each other",
		timbre: "glass",
		root: 72,
		velocity: 0.5,
		loops: LOOPS,
	},
	{
		id: "drone",
		name: "Drone",
		description: "two long pad loops of 53 and 59 sixteenths an octave below the harmony, after Discreet Music's slow tape delay",
		timbre: "pad",
		root: 48,
		velocity: 0.4,
		loops: [
			{ length: 53, at: 5, tone: 0, pan: -0.3 },
			{ length: 59, at: 31, tone: 2, pan: 0.3 },
		],
	},
	{
		// The bell is the light pen's, so the sparkle is chimes.
		id: "sparkle",
		name: "Sparkle",
		description: "three sparse chimes two octaves up, at 43, 47 and 61 sixteenths",
		timbre: "chime",
		root: 72,
		velocity: 0.25,
		loops: [
			{ length: 43, at: 11, tone: 1, up: 2 },
			{ length: 47, at: 23, tone: 2, up: 2 },
			{ length: 61, at: 41, tone: 0, up: 2 },
		],
	},
	{
		id: "voices",
		name: "Voices",
		description: "three wordless singers holding a tone of the chord each, at 67, 71 and 73 sixteenths, after Music for Airports 2/1",
		timbre: "sing",
		root: 60,
		velocity: 0.3,
		loops: [
			{ length: 67, at: 17, tone: 0, pan: -1 },
			{ length: 71, at: 37, tone: 1, pan: 0 },
			{ length: 73, at: 53, tone: 2, pan: 1 },
		],
	},
];

const TIMBRES: ReadonlySet<string> = new Set(["bass", "pluck", "chime", "pad", "tick", "beep", "glass", "brass", "keys", "organ", "acid", "anvil", "sing", "whistle", "harp", "lead", "bell", "tom"]);

/**
 * Eno tracks from configuration data, an angel's YAML or a machine's own: the ones that make
 * sense, each with an id, a name, a description, a known instrument and loops of whole
 * positive lengths. Anything else is dropped, so a typo silences one track, not the dance.
 */
export function enoTracks(data: unknown): EnoTrack[] {
	if (!Array.isArray(data)) return [];
	const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
	return data.flatMap((t): EnoTrack[] => {
		if (!t || typeof t !== "object") return [];
		const r = t as Record<string, unknown>;
		if (typeof r.id !== "string" || typeof r.timbre !== "string" || !TIMBRES.has(r.timbre) || !Array.isArray(r.loops)) return [];
		const loops = r.loops.flatMap((l): EnoLoop[] => {
			if (!l || typeof l !== "object") return [];
			const o = l as Record<string, unknown>;
			const length = Math.round(num(o.length, 0));
			if (length < 1) return [];
			const loop = { length, at: Math.round(num(o.at, 0)) % length, tone: Math.max(0, Math.round(num(o.tone, 0))), up: Math.round(num(o.up, 0)) };
			return [typeof o.pan === "number" ? { ...loop, pan: Math.max(-1, Math.min(1, o.pan)) } : loop];
		});
		return [{
			id: r.id,
			name: typeof r.name === "string" ? r.name : r.id,
			description: typeof r.description === "string" ? r.description : "",
			timbre: r.timbre as Timbre,
			root: Math.round(num(r.root, 60)),
			velocity: Math.max(0, Math.min(1, num(r.velocity, 0.4))),
			loops,
		}];
	});
}

/** The tracks on, as bits of `Dance.loops`: track n is bit n. */
export type Eno = number;
export const EN0 = 1, EN1 = 2, EN2 = 4, EN3 = 8;

/** A mode's `loops`, tracks as bits or the old on and off; on keeps the tracks already on, or turns on EN0. */
export function enoLayers(loops: boolean | number | undefined, now: Eno = 0): Eno {
	if (loops === true) return now || EN0;
	if (!loops) return 0;
	return Math.round(loops) >>> 0;
}

/** What the person at the console did, as the dance hears it. */
export type Touch =
	| { readonly kind: "key"; readonly code: number }
	| { readonly kind: "press" }
	| { readonly kind: "drag"; readonly distance: number }
	| { readonly kind: "release" };

/**
 * A stroke under the light pen: its display-list word, how far along it the pen is, when in
 * the frame it was drawn, and the title of the tag it was drawn under, if any ("Thumb").
 */
export type Under = { readonly addr: number; readonly along: number; readonly scan: number; readonly tag?: string };

/**
 * Where the light pen is, on the 340's grid, whether it's down, the strokes under it, nearest
 * first, and the fingertip it is on, 0 the thumb to 4 the little finger, if a hand is drawn.
 */
export type PenAt = { readonly x: number; readonly y: number; readonly down: boolean; readonly under: readonly Under[]; readonly tip?: number };

/** A hand's tags as strings of a harp, thumb lowest. */
const STRINGS: ReadonlyMap<string, number> = new Map([
	["Thumb", 0],
	["Index finger", 1],
	["Middle finger", 2],
	["Ring finger", 3],
	["Little finger", 4],
	["Knuckles", 5],
]);

/**
 * A mode of the music, as a screen angel's state sets it on entry: the style, the tempo, the
 * tape loops, the words to listen to, and the tracks to leave out, by voice ("drums",
 * "harmony", "loops", "reply", "pen", a machine's voice id, or "watch" for every watched word).
 * and a riff (`Riff`), or null for none. What a mode leaves unsaid stays as it was.
 */
export type Music = { readonly style?: Style; readonly bpm?: number; readonly loops?: boolean | Eno; readonly tracks?: readonly EnoTrack[]; readonly listen?: string; readonly mute?: readonly string[]; readonly riff?: Riff | null };

/**
 * A riff: a bar that plays itself, bass, drums and a hook, in whatever chord the progression is
 * on, whether or not the machine is busy, so a mode is heard even while it waits for a key.
 * `sunny` is a bouncing bass under an organ skank on the off-beats; `techno` four on the floor
 * under a sixteenth acid line; `industrial` a broken kick and anvils in bars of 13, the
 * Bohlen-Pierce bar; `walk` a walking bass, root, third, fifth and a step into the next chord.
 */
export type Riff = "sunny" | "techno" | "industrial" | "walk";

/** Techno's acid line, a sixteenth each: 0 the root, 1 its octave, 2 and 3 the chord's third and fifth, up an octave; -1 rests. */
const ACID = [0, -1, 1, 0, 3, -1, 1, 2, 0, -1, 1, 0, 2, -1, 3, 1] as const;

/** A named stretch of memory, from and to inclusive, as a source map names a program's parts. */
export type Region = { readonly name: string; readonly from: number; readonly to: number };

/** A region's share of recent hits, kept for about this many sixteenths: a few seconds. */
const HEAT_SPAN = 32;

/**
 * A heat map of where the program counter has been, by region. Each beat's hits add to their
 * regions, and each region's heat follows its share of the hits slowly, so a hot spot warms up
 * and cools off over seconds instead of flickering with every block.
 */
export class Regions {
	readonly heat: number[];
	constructor(readonly regions: readonly Region[]) {
		this.heat = regions.map(() => 0);
	}
	step(hits: readonly Hit[]): void {
		const share = this.regions.map(() => 0);
		let total = 0;
		for (const h of hits) {
			const i = this.regions.findIndex((r) => h.key >= r.from && h.key <= r.to);
			if (i < 0) continue;
			share[i]! += h.weight;
			total += h.weight;
		}
		if (!total) return;
		this.heat.forEach((h, i) => (this.heat[i] = h + (share[i]! / total - h) / HEAT_SPAN));
	}
	/** The hottest region's name, or null if nothing has run in any. */
	get hottest(): string | null {
		const top = Math.max(...this.heat);
		return top > 0 ? this.regions[this.heat.indexOf(top)]!.name : null;
	}
}

/** Even 1K pages of a core, named by their first address in octal: a heat map with no source map. */
export const pages = (words: number, size = 1024): Region[] =>
	Array.from({ length: Math.ceil(words / size) }, (_, i) => ({ name: (i * size).toString(8), from: i * size, to: (i + 1) * size - 1 }));

/** A word in core the dance listens to: a variable's name and what it holds now, 18 bits. */
export type Watched = { readonly name: string; readonly value: number };

/**
 * A watched name can ask to be sung instead of looped: `guess!0-99` sings the word's value as
 * a pitch, low to high across three octaves from 0 to 99, not held to the scale, so every value
 * is its own note: at once when it changes, then softly once a bar. `secret~0-99` whistles its
 * value now and then, every fourth bar, and when it changes. Two words on the same range sing
 * the same pitch for the same value, so a right guess is a unison. Without a range, 0 to 1023.
 */
export const SUNG = /^(.+?)([!~])(?:(-?\d+)-(-?\d+))?$/;
/** The name to look a watched word up by, without a `SUNG` mark. */
export const watchedName = (name: string): string => SUNG.exec(name)?.[1] ?? name;

/**
 * What a front panel's switches do to the music. Not a knob a switch: the word is hashed, so
 * every combination is its own twist and flipping any one switch gives another. `skew` delays
 * the off sixteenths by up to nearly half of one; `shift` turns the drums' pattern and the gate
 * round by that many steps; `gate` is the steps of the bar the machine's own voices and the
 * watched words get through, all of them or a pattern keeping every beat; `echo` repeats each
 * of their notes that many sixteenths later, softer, from the other side; `ratchet` doubles it
 * at the half; `octave` lifts every other beat by the tuning's period; `turn` hands each voice
 * the next instrument round; `mirror` swaps left and right. All switches off is the plain dance.
 */
export type Twist = {
	readonly skew: number;
	readonly shift: number;
	readonly gate: number;
	readonly echo: number;
	readonly ratchet: boolean;
	readonly octave: boolean;
	readonly turn: number;
	readonly mirror: boolean;
};
export const PLAIN: Twist = { skew: 0, shift: 0, gate: 0xffff, echo: 0, ratchet: false, octave: false, turn: 0, mirror: false };
/**
 * A tune on the teletype's paper: a line of nothing but note names a to g, `-` holding a step,
 * spaces resting, and `'` or `,` before a letter sending it up or down from the last note. Any
 * other letter goes to whichever octave is nearest the last note. Lower case, as UNIX keeps it.
 */
export const TUNE_LINE = /^(?=.*[a-g].*[a-g])[a-g',\- ]{4,}$/;
const NOTE_NAMES: Readonly<Record<string, number>> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
/** The most of the paper still to play; past it, what is printed is not heard. */
const PAPER = 320;
/** Past this much waiting, plain text plays several characters a step to catch up; tunes never do. */
const BACKLOG = 32;

/** The instruments `turn` hands round, the machine's own. */
export const TURNS: readonly Timbre[] = ["bass", "pluck", "chime", "glass", "beep"];
const ECHOES = [0, 2, 3, 6] as const;

const mix32 = (x: number) => {
	let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
	h ^= h >>> 13;
	h = Math.imul(h, 0xc2b2ae35);
	return (h ^ (h >>> 16)) >>> 0;
};

/** The twist an 18-bit switch word makes. */
export function twist(word: number): Twist {
	const w = word & 0o777777;
	if (!w) return PLAIN;
	const h = mix32(w);
	const g = mix32(h);
	const t = {
		skew: ((h & 7) / 7) * 0.45,
		shift: (h >>> 3) & 15,
		gate: ((h >>> 7) & 3) === 0 ? (g & 0xffff) | 0x1111 : 0xffff,
		echo: ECHOES[(h >>> 9) & 3]!,
		ratchet: ((h >>> 11) & 3) === 0,
		octave: ((h >>> 13) & 1) === 1,
		turn: (h >>> 14) % TURNS.length,
		mirror: ((h >>> 17) & 1) === 1,
	};
	return t.echo || t.ratchet || t.octave || t.turn || t.gate !== 0xffff ? t : { ...t, echo: 3 };
}

/** A twist in a few words, for the console: "" for the plain dance. */
/** Bytes of switches folded into the 18-bit word `twist` hashes: none set is 0, any set is not. */
export function switchWord(bytes: ArrayLike<number>): number {
	let h = 0x811c9dc5;
	let any = false;
	for (let i = 0; i < bytes.length; i++) {
		const b = bytes[i]! & 0xff;
		if (b) any = true;
		h = Math.imul(h ^ b, 0x01000193) >>> 0;
	}
	return any ? (h % 0o777777) + 1 : 0;
}

export function twistLabel(t: Twist): string {
	if (t === PLAIN) return "";
	const parts = [`skew ${Math.round((t.skew / 0.45) * 7)}`, `phase ${t.shift}`];
	if (t.gate !== 0xffff) parts.push("gate");
	if (t.echo) parts.push(`echo ${t.echo}`);
	if (t.ratchet) parts.push("ratchet");
	if (t.octave) parts.push("octave");
	if (t.turn) parts.push(`turn ${t.turn}`);
	if (t.mirror) parts.push("mirror");
	return parts.join(" · ");
}

const hashName = (name: string) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const signed18 = (v: number) => {
	const w = v & 0o777777;
	return w & 0o400000 ? w - 0o1000000 : w;
};
const WATCH_TIMBRES: readonly Timbre[] = ["chime", "beep", "tick", "glass", "pluck"];
/** A watch counts as moving for this many sixteenths after its value last changed. */
const STIRRED = 8;

type Watch = { len: number; at: number; timbre: Timbre; pan: number; last: number; typical: number; progress: number; stirred: number };

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
	/** The Eno tracks on, as bits: track n of `tracks` is bit n. */
	loops: Eno = 0;
	/** The Eno tracks, EN0 first; a machine may bring its own. */
	tracks: readonly EnoTrack[] = ENO_TRACKS;
	/** Notes a machine has asked of a track since the last sixteenth. */
	private kicks: { track: number; loop: EnoLoop; weight: number }[] = [];

	/**
	 * A machine's event plays track `track` once, on the next sixteenth, in the chord: `tone`
	 * picks the chord's tone, `weight` scales the track's loudness. Heard only while the track is on.
	 */
	kick(track: number, tone = 0, weight = 1, up = 0, pan?: number): void {
		if (!(this.loops & (1 << track)) || this.kicks.length >= 16) return;
		this.kicks.push({ track, loop: pan === undefined ? { length: 0, at: 0, tone, up } : { length: 0, at: 0, tone, up, pan }, weight: Math.max(0, Math.min(1, weight)) });
	}
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
	private fanfare: { at: number; score: number; pan: number } | null = null;
	private penDown = false;
	private penTip = -1;
	private sounding = new Map<number, number>();
	private watches = new Map<string, Watch>();
	private sungLast = new Map<string, number>();
	/** 0 to 1: how deep the harmony goes. Past a third the pad doubles an octave down, past two thirds two. */
	depth = 0;
	/** Voices left out; "watch" leaves out every watched word. */
	mute: ReadonlySet<string> = new Set();
	private heard = (n: Note) => !this.mute.has(n.voice) && !this.mute.has(n.voice.split(":")[0]!);

	/** The front panel's twist (`twist`), set from its switch word. */
	twist: Twist = PLAIN;
	set switches(word: number) {
		if ((word & 0o777777) !== this.switchWord) this.twist = twist((this.switchWord = word & 0o777777));
	}
	private switchWord = 0;

	/** The routines called since the last beat, as `CallSound` says each one sounds. */
	private answer(called: readonly Called[], now: Chord, t: Tuning): Note[] {
		const out: Note[] = [];
		const tones = now.tones;
		const n = Math.max(1, tones.length);
		for (const c of called) {
			if (c.calls <= 0) continue;
			const voice = `call:${c.name}`;
			const s = c.sound;
			const note = (timbre: Timbre, midi: number, velocity: number, pan = 0, order = 0, late = 0): Note => ({ voice, timbre, midi, velocity, pan, order, ...(late ? { late } : {}) });
			if (s.kind === "hit") {
				if (s.sound === "bell") out.push(note("beep", 83, 0.6, 0.2));
				else if (s.sound === "crash") out.push(note("crash", DRUM_MIDI.crash, 0.7, -0.2));
				else if (s.sound === "scroll") {
					this.phase += 1;
					out.push(note("kick", DRUM_MIDI.kick, 0.5));
				} else if (s.sound === "error") [63, 62, 61, 60].forEach((m, i) => out.push(note("brass", m - 12, 0.5 - 0.05 * i, 0, 0, i * 2)));
				else out.push(...[0, 1, 7].map((k, i) => note("pad", 30 + k, 0.4, 0, i)));
			} else if (s.param === "type") {
				const many = Math.min(3, Math.ceil(Math.log2(1 + c.calls)));
				for (let i = 0; i < many; i += 1) {
					const d = (c.calls + i * 2) % (2 * n);
					out.push(note("keys", midiAt(72, (tones[d % n] ?? 0) + Math.floor(d / n) * t.steps, t), 0.25, 0.25, i));
				}
			} else if (s.param === "sparkle") {
				const many = Math.min(4, Math.ceil(Math.log2(1 + c.calls) / 2));
				for (let i = 0; i < many; i += 1) out.push(note("glass", midiAt(84, (tones[(c.calls + i) % n] ?? 0) + (i % 2) * t.steps, t), 0.3, i % 2 ? 0.5 : -0.5, i));
			}
		}
		return out;
	}

	/** The riff playing under everything, or null. */
	riff: Riff | null = null;

	private riffed(step: number, now: Chord, t: Tuning): Note[] {
		const r = this.riff;
		if (!r) return [];
		const i = (((step - this.home) % this.bar) + this.bar) % this.bar;
		const tones = now.tones;
		const tone = (k: number) => tones[k % tones.length] ?? 0;
		const at = (base: number, deg: number): number => midiAt(base, deg, t);
		const out: Note[] = [];
		const drum = (d: Drum, velocity: number, pan = 0) => out.push({ voice: "riff", timbre: d, midi: DRUM_MIDI[d], velocity, pan, order: 0 });
		const play = (timbre: Timbre, midi: number, velocity: number, pan = 0, order = 0) => out.push({ voice: "riff", timbre, midi, velocity, pan, order });
		switch (r) {
			case "sunny": {
				if (i === 0 || i === 8) drum("kick", 0.7);
				if (i === 4 || i === 12) drum("snare", 0.45);
				if (i % 4 === 2) {
					drum("hat", 0.3, 0.3);
					tones.slice(0, 3).forEach((k, n) => play("organ", at(67, k), 0.32, -0.25, n));
				}
				const walk: Record<number, number> = { 0: 0, 3: 7, 6: 12, 8: 0, 11: 7, 14: 9 };
				if (walk[i] !== undefined) play("bass", at(36, now.root + walk[i]!), 0.55, -0.1);
				break;
			}
			case "techno": {
				if (i % 4 === 0) drum("kick", 0.95);
				if (i % 4 === 2) drum("hat", 0.45, 0.25);
				if (i === 4 || i === 12) drum("snare", 0.3, -0.15);
				const a = ACID[i % ACID.length]!;
				if (a >= 0) {
					const deg = a === 0 ? now.root : a === 1 ? now.root + t.steps : tone(a - 1) + t.steps;
					play("acid", at(36, deg), i % 4 === 3 ? 0.9 : 0.6, 0.1);
				}
				break;
			}
			case "industrial": {
				if (i === 0 || i === 5 || i === 8) drum("kick", i === 0 ? 1 : 0.7);
				if (i === 4 || i === 10) play("anvil", at(48, tone(i === 4 ? 1 : 2)), 0.7, i === 4 ? -0.4 : 0.4);
				if (i === 12) play("anvil", at(60, tone(0)), 0.35, 0);
				if (i === 6 || i === 11) drum("snare", 0.55);
				if (i === 0) play("bass", at(24, now.root), 0.8);
				break;
			}
			case "walk": {
				if (i % 4 === 0) {
					const next = this.chordOfBar(Math.floor((step - this.home) / this.bar) + 1);
					const beat = i / 4;
					const deg = beat === 3 ? next.root - 1 : beat === 0 ? now.root : tone(beat);
					play("bass", at(36, deg), 0.6, -0.1);
				}
				break;
			}
		}
		return out;
	}

	/** The teletype's paper still to play, a character a sixteenth. */
	private paper: number[] = [];
	private lineStart = true;
	private tuneLine = false;
	private tuneAt = 67;
	private tuneMark = 0;

	/**
	 * A character the teletype printed, the machine's or a key's echo. The paper plays a
	 * character a sixteenth, so the teletype is a sequencer: each line feed kicks and turns the
	 * drums' pattern a step, the shell's `@` is a snare, spaces are hats, and every other
	 * character plays a chord tone on the keys. A tune line (`TUNE_LINE`) plays its notes as
	 * written, over the home chord.
	 */
	printed(code: number): void {
		const c = code & 0o177;
		if (c === 0o15 || c === 0 || c === 0o177 || this.paper.length >= PAPER) return;
		this.paper.push(c);
	}

	private teletype(tones: readonly number[], t: Tuning): Note[] {
		const notes: Note[] = [];
		const n = Math.max(1, tones.length);
		for (let k = 0; k < 4 && this.paper.length; k += 1) {
			if (this.lineStart) {
				const end = this.paper.indexOf(0o12);
				this.tuneLine = TUNE_LINE.test(String.fromCharCode(...this.paper.slice(0, end < 0 ? this.paper.length : end)));
				this.lineStart = false;
			}
			const c = this.paper.shift()!;
			const ch = String.fromCharCode(c).toLowerCase();
			if (c === 0o12) {
				this.lineStart = true;
				this.phase += 1;
				notes.push({ voice: "teletype", timbre: "kick", midi: DRUM_MIDI.kick, velocity: 0.7, pan: 0, order: 0 });
			} else if (this.tuneLine) {
				const pc = NOTE_NAMES[ch];
				if (ch === "'") this.tuneMark = 1;
				else if (ch === ",") this.tuneMark = -1;
				else if (pc !== undefined) {
					const below = this.tuneAt - ((((this.tuneAt - pc) % 12) + 12) % 12);
					const m = this.tuneMark > 0 ? below + 12 : this.tuneMark < 0 ? (below < this.tuneAt ? below : below - 12) : this.tuneAt - below <= 6 ? below : below + 12;
					this.tuneAt = Math.max(43, Math.min(91, m));
					this.tuneMark = 0;
					notes.push({ voice: "teletype", timbre: "keys", midi: this.tuneAt + 12, velocity: 0.75, pan: 0.15, order: 0 });
				}
			} else if (c === 0o40) notes.push({ voice: "teletype", timbre: "hat", midi: DRUM_MIDI.hat, velocity: 0.2, pan: 0.3, order: 0 });
			else if (ch === "@") notes.push({ voice: "teletype", timbre: "snare", midi: DRUM_MIDI.snare, velocity: 0.55, pan: 0, order: 0 });
			else if (c > 0o40) {
				const d = c % (2 * n);
				notes.push({ voice: "teletype", timbre: "keys", midi: midiAt(72, (tones[d % n] ?? 0) + Math.floor(d / n) * t.steps, t), velocity: 0.3, pan: 0.15, order: k });
			}
			if (this.tuneLine || this.paper.length <= BACKLOG || this.lineStart) break;
		}
		return notes;
	}

	/** Where the first voice's hits land, if the machine has a map: each warm region hums. */
	regions: Regions | null = null;

	constructor(readonly voices: readonly Voice[]) {}

	get harmony(): Harmony {
		return this.style === "jazz" ? JAZZ_WALK : this.style === "lydian" ? LYDIAN_WALK : this.style === "minor" ? MINOR_WALK : this.style === "bp" ? BP_WALK : MAJOR_WALK;
	}

	/** What the machine has run, folded in beat by beat: the lead voice's keys, the code it ran. */
	private stir = 0;
	private phrases = new Map<number, readonly Chord[]>();
	private phrasesFor: Harmony | null = null;
	private phrasesHome = 0;

	/**
	 * Phrase `k`, four bars from home. Phrase 0 is the style's loop. Each one after is a walk
	 * through the style's graph from where the last one ended, each move picked by a hash of
	 * the stir, the phrase's number and the switch word: the same machine doing the same thing
	 * plays the same changes, and code that runs differently takes the harmony somewhere else.
	 */
	phrase(k: number): readonly Chord[] {
		const h = this.harmony;
		if (h !== this.phrasesFor || this.home !== this.phrasesHome) {
			this.phrases.clear();
			this.phrasesFor = h;
			this.phrasesHome = this.home;
		}
		if (k <= 0) return h.first;
		const kept = this.phrases.get(k);
		if (kept) return kept;
		const before = this.phrases.get(k - 1) ?? (k === 1 ? h.first : [h.home]);
		const seed = mix32(this.stir ^ mix32(k) ^ this.switchWord);
		const moves = (c: Chord) => h.moves.get(c) ?? [h.home];
		const firsts = k % 2 === 0 ? [h.home] : moves(before[before.length - 1]!);
		const ends = (c: Chord) => k % 2 === 0 || (c !== h.home && moves(c).includes(h.home));
		// Every four-bar walk that fits; a chord held for a second bar only when none does.
		const walks = (hold: boolean): Chord[][] => {
			const found: Chord[][] = [];
			const go = (path: Chord[]) => {
				if (path.length === 4) {
					if (ends(path[3]!)) found.push(path);
					return;
				}
				const at = path[path.length - 1]!;
				for (const c of hold ? [...moves(at), at] : moves(at)) go([...path, c]);
			};
			for (const f of firsts) go([f]);
			return found;
		};
		const fits = walks(false);
		const all = fits.length ? fits : walks(true);
		const out = all.length ? all[seed % all.length]! : [...h.first];
		this.phrases.set(k, out);
		for (const old of this.phrases.keys()) if (old < k - 2) this.phrases.delete(old);
		return out;
	}

	/** The chord of bar `b` from home. */
	private chordOfBar(b: number): Chord {
		const p = this.phrase(Math.floor(b / 4));
		return p[((b % 4) + 4) % 4]!;
	}

	/** The phrase playing now. */
	get progression(): readonly Chord[] {
		return this.phrase(Math.floor((this.step - this.home) / this.bar / 4));
	}

	get tuning(): Tuning {
		return this.style === "bp" ? BP13 : TET12;
	}

	/** Sixteenths to the bar. */
	get bar(): number {
		return this.style === "bp" ? 13 : 16;
	}

	/** Home: the chord the progression resolves to. */
	get tonic(): Chord {
		return this.harmony.home;
	}

	/** The chord the next beat plays over. */
	get chord(): Chord {
		const bp = this.style === "bp";
		if (this.fanfare || this.resolving || this.tuneLine) return this.tonic;
		if (this.tension >= 0.8) return bp ? BP_V : this.style === "jazz" ? TRITONE_SUB : DOMINANT_B9;
		if (this.tension >= 0.4) return bp ? BP_V : DOMINANT;
		return this.chordOfBar(Math.floor((this.step - this.home) / this.bar));
	}

	/**
	 * The program has finished a game or a round, as a halt or a "play again?" says: a hooray,
	 * by how well it went, 0 barely to 1 best, panned toward whoever won. A brass arpeggio of
	 * the home chord climbs, one note a sixteenth, more of them and higher and louder the better
	 * the score, over a kick on the beat; past 0.8 a snare roll takes it to the top.
	 */
	celebrate(score: number, pan = 0): void {
		this.fanfare = { at: this.step, score: Math.max(0, Math.min(1, score)), pan };
		this.tension = 0;
		this.resolving = true;
	}

	private hooray(): Note[] {
		const f = this.fanfare;
		if (!f) return [];
		const i = this.step - f.at;
		const length = 4 + Math.round(f.score * 12);
		if (i >= length) {
			this.fanfare = null;
			return [];
		}
		const tones = this.tonic.tones;
		const t = this.tuning;
		const n = tones.length;
		const notes: Note[] = [{ voice: "hooray", timbre: "brass", midi: midiAt(60, (tones[i % n] ?? 0) + Math.floor(i / n) * t.steps, t), velocity: 0.45 + 0.45 * f.score, pan: f.pan, order: 0 }];
		if (i % 4 === 0) notes.push({ voice: "hooray", timbre: "kick", midi: DRUM_MIDI.kick, velocity: 0.6 + 0.4 * f.score, pan: 0, order: 0 });
		if (f.score > 0.8 && i >= length - 4) notes.push({ voice: "hooray", timbre: "snare", midi: DRUM_MIDI.snare, velocity: 0.5 + 0.1 * (i - length + 4), pan: 0, order: 0 });
		if (i === length - 1) tones.forEach((tone, k) => notes.push({ voice: "hooray", timbre: "pad", midi: midiAt(60, tone, t), velocity: 0.5 + 0.4 * f.score, pan: f.pan, order: k }));
		return notes;
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
	 * The light pen's own tracks, played at once rather than on the beat, so the picture is an
	 * instrument. Every stroke under the pen sounds a rising arpeggio of the chord as the pen
	 * moves along it, start to end, two octaves, so stroking along a line climbs and the next
	 * stroke starts low again. Untagged strokes drawn later in the frame start higher, so a
	 * turtle's spiral is a harp; a hand's strokes start by finger, each a string a step above
	 * the last. Hovering plays a harp; holding the button down a resonant lead, brighter, while
	 * the press builds tension, until it is lifted. Setting the pen down rings a bell at its
	 * height, lifting it at its x, and touching a fingertip lands a tom with a bell for that
	 * finger. None of these is an instrument the machine plays itself.
	 */
	pen(p: PenAt | null): Note[] {
		const notes: Note[] = [];
		const tones = this.chord.tones;
		const t = this.tuning;
		const n = Math.max(1, tones.length);
		const at = (root: number, d: number) => midiAt(root, (tones[d % n] ?? 0) + Math.floor(d / n) * t.steps, t);
		if (!p) {
			this.sounding.clear();
			return notes;
		}
		const pan = Math.max(-1, Math.min(1, p.x / 512 - 1));
		if (p.down !== this.penDown) {
			const d = Math.floor(((p.down ? p.y : p.x) / 1024) * 2 * n);
			notes.push({ voice: "pen", timbre: "bell", midi: at(p.down ? 72 : 60, Math.max(0, d)), velocity: 0.5, pan, order: 0 });
			this.penDown = p.down;
		}
		const tip = p.tip ?? -1;
		if (tip >= 0 && tip !== this.penTip) {
			notes.push({ voice: "pen", timbre: "tom", midi: at(48, tip * 2), velocity: 0.95, pan, order: 0 });
			notes.push({ voice: "pen", timbre: "bell", midi: at(72, tip * 2), velocity: 0.8, pan, order: 1 });
		}
		this.penTip = tip;
		const now = new Map<number, number>();
		p.under.slice(0, 3).forEach((u, i) => {
			const string = u.tag === undefined ? undefined : (STRINGS.get(u.tag) ?? hashName(u.tag) % 6);
			const from = string === undefined ? Math.floor(u.scan * n) : string * 2;
			const d = Math.floor(Math.max(0, Math.min(0.999, u.along)) * 2 * n) + from;
			now.set(u.addr, d);
			if (this.sounding.get(u.addr) !== d)
				notes.push({ voice: "pen", timbre: p.down ? "lead" : "harp", midi: at(60, d), velocity: (p.down ? 0.6 : 0.5) * (1 - 0.2 * i), pan, order: i });
		});
		this.sounding = now;
		return notes.filter(this.heard);
	}

	/**
	 * Watched words' tracks, one beat loop each, three to seven sixteenths long by the name. A
	 * loop measures its word against its own typical change, so a turtle heading moving by
	 * degrees and a dictionary pointer moving by words both count steps of the same size: each
	 * typical change moves the loop's phase by a step and its note one chord tone, up as the
	 * word grows and down as it shrinks, so a nested call climbs and its return comes back
	 * down. While the word is changing the loop plays twice as often and louder; the word's
	 * size, by powers of 64, sets the octave. A name beginning "left" or "right" is panned that
	 * way, so two players' words are a duet.
	 */
	private listen(watched: readonly Watched[], tones: readonly number[], t: Tuning): Note[] {
		const notes: Note[] = [];
		const n = Math.max(1, tones.length);
		const names = new Set(watched.map((w) => w.name));
		for (const name of this.watches.keys()) if (!names.has(name)) this.watches.delete(name);
		for (const name of this.sungLast.keys()) if (!names.has(name)) this.sungLast.delete(name);
		for (const { name, value } of watched) {
			const sung = SUNG.exec(name);
			if (sung) {
				notes.push(...this.sing(name, sung, value));
				continue;
			}
			let w = this.watches.get(name);
			const v = signed18(value);
			if (!w) {
				const h = hashName(name);
				const side = name.startsWith("left") ? -0.7 : name.startsWith("right") ? 0.7 : (((h >>> 9) % 9) - 4) / 5;
				w = { len: 3 + (h % 5), at: (h >>> 3) % 7, timbre: WATCH_TIMBRES[(h >>> 6) % WATCH_TIMBRES.length]!, pan: side, last: v, typical: 0, progress: 0, stirred: 0 };
				this.watches.set(name, w);
			}
			const delta = signed18(v - w.last);
			const size = Math.abs(delta);
			w.last = v;
			if (size > 0) {
				w.typical = w.typical ? 0.9 * w.typical + 0.1 * size : size;
				w.progress += delta / w.typical;
				w.stirred = STIRRED;
			} else if (w.stirred > 0) w.stirred -= 1;
			const every = w.stirred > 0 ? Math.max(2, Math.ceil(w.len / 2)) : w.len;
			const phase = Math.floor(w.progress);
			if ((this.step + w.at + phase) % every !== 0) continue;
			const octave = Math.min(2, Math.floor(Math.log2(Math.abs(v) + 1) / 6));
			const d = ((phase % (2 * n)) + 2 * n) % (2 * n);
			notes.push({ voice: `watch:${name}`, timbre: w.timbre, midi: midiAt(60 + 12 * octave, (tones[d % n] ?? 0) + Math.floor(d / n) * t.steps, t), velocity: w.stirred > 0 ? 0.4 : 0.15, pan: w.pan, order: 0 });
		}
		return notes;
	}

	private sing(name: string, m: RegExpExecArray, value: number): Note[] {
		const lo = m[3] === undefined ? 0 : Number(m[3]);
		const hi = m[4] === undefined ? 1023 : Number(m[4]);
		const v = signed18(value);
		const changed = this.sungLast.get(name) !== v;
		this.sungLast.set(name, v);
		const whistle = m[2] === "~";
		const bar = this.bar;
		const due = changed || (whistle ? this.step % (4 * bar) === 2 * bar : this.step % bar === 0);
		if (!due) return [];
		const frac = Math.max(0, Math.min(1, (v - lo) / Math.max(1, hi - lo)));
		return [{ voice: `watch:${name}`, timbre: whistle ? "whistle" : "sing", midi: 48 + 36 * frac, velocity: changed ? 0.8 : whistle ? 0.45 : 0.35, pan: whistle ? 0.35 : -0.2, order: 0 }];
	}

	/**
	 * One sixteenth. With `load`, the drums play too, their rim click at the period of the
	 * first voice's two heaviest hits; a machine doing nothing plays no drums, but still answers.
	 */
	beat(hits: Readonly<Record<string, readonly Hit[] | undefined>>, load?: number, watched: readonly Watched[] = [], called: readonly Called[] = []): Note[] {
		const step = this.step;
		const drove = called.filter((c) => c.sound.kind === "rate" && c.sound.param === "drive").reduce((n, c) => n + c.calls, 0);
		if (drove > 0) load = Math.max(load ?? 0, Math.min(1, Math.log2(1 + drove) / 8));
		const jazz = this.style === "jazz";
		const late = jazz && swung(step) ? SWING : 0;
		const now = this.chord;
		const tones = now.tones;
		const t = this.tuning;
		for (const h of hits[this.voices[0]?.id ?? ""] ?? []) this.stir = mix32(this.stir ^ h.key);
		const notes: Note[] = this.voices.flatMap((v) => score(v, hits[v.id] ?? [], tones, t));
		notes.push(...this.listen(watched, tones, t), ...this.hooray(), ...this.teletype(tones, t), ...this.riffed(step, now, t), ...this.answer(called, now, t));
		const map = this.regions;
		if (map) {
			map.step(hits[this.voices[0]?.id ?? ""] ?? []);
			if (step % this.bar === 0)
				map.heat.forEach((heat, i) => {
					if (heat < 0.08) return;
					const tone = (tones[i % tones.length] ?? 0) + Math.floor(i / tones.length) * t.steps;
					notes.push({ voice: `region:${map.regions[i]!.name}`, timbre: "pad", midi: midiAt(48, tone, t), velocity: 0.08 + 0.3 * heat, pan: (i / Math.max(1, map.regions.length - 1)) * 1.2 - 0.6, order: i });
				});
		}
		const resolved = this.resolving;
		if (now !== this.last || resolved) {
			const loud = resolved ? 0.9 : 0.35 + 0.3 * this.tension;
			tones.forEach((tone, i) => notes.push({ voice: "harmony", timbre: "pad", midi: midiAt(60, tone, t), velocity: loud, pan: 0, order: i }));
			for (const [below, from] of [[1, 1 / 3], [2, 2 / 3]] as const)
				if (this.depth > from)
					tones.forEach((tone, i) => notes.push({ voice: "harmony", timbre: "pad", midi: midiAt(60, tone - below * t.steps, t), velocity: loud * Math.min(1, (this.depth - from) * 3), pan: 0, order: i }));
			notes.push({ voice: "harmony", timbre: "bass", midi: midiAt(36, now.root, t), velocity: loud, pan: 0, order: 0 });
			this.last = now;
		}
		for (const r of this.replies.filter((r) => r.at === step))
			notes.push({ voice: "reply", timbre: "beep", midi: pitch({ id: "reply", label: "", timbre: "beep", root: 72, octaves: 2, pan: 0, most: 1 }, r.key, tones, t), velocity: 0.7 - 0.15 * r.i, pan: 0.5 - 0.5 * r.i, order: 0 });
		this.replies = this.replies.filter((r) => r.at > step);
		const toneOf = (i: number) => tones[i % tones.length] ?? 0;
		this.tracks.forEach((track, n) => {
			if (!(this.loops & (1 << n))) return;
			const play = (l: EnoLoop, velocity: number) =>
				notes.push({ voice: "loops", timbre: track.timbre, midi: midiAt(track.root, toneOf(l.tone) + (l.up ?? 0) * t.steps, t), velocity, pan: l.pan ?? (l.length ? (l.length % 5) / 2 - 1 : 0), order: 0 });
			for (const l of track.loops) if (step % l.length === l.at % l.length) play(l, track.velocity);
			for (const k of this.kicks.filter((k) => k.track === n)) play(k.loop, track.velocity * k.weight);
		});
		this.kicks = [];
		const drive = Math.min(1, (load ?? 0) + 0.5 * this.tension);
		if (drive > 0 && (load ?? 0) > 0) {
			const lead = hits[this.voices[0]?.id ?? ""] ?? [];
			const soft = (d: Drum) => (d === "hat" || d === "ride" ? 0.4 + 0.4 * drive : jazz && d === "kick" ? 0.35 : 0.8);
			for (const d of (jazz ? swing : this.style === "bp" ? thirteen : groove)(step, drive, period(lead), this.phase + this.twist.shift))
				notes.push({ voice: "drums", timbre: d, midi: DRUM_MIDI[d], velocity: soft(d), pan: d === "hat" || d === "ride" ? 0.2 : d === "rim" ? -0.2 : 0, order: 0 });
		}
		if (resolved) {
			notes.push({ voice: "drums", timbre: "kick", midi: DRUM_MIDI.kick, velocity: 1, pan: 0, order: 0 });
			this.resolving = false;
			this.tension = 0;
			this.home = step - ((step - this.home) % this.bar);
		} else if (!this.held) this.tension *= EASE;
		this.step += 1;
		const odd = this.style === "bp";
		const lag = late + (step % 2 === 1 ? this.twist.skew : 0);
		const kept = this.twisted(notes.filter(this.heard), step);
		return lag || odd ? kept.map((n) => ({ ...n, ...(lag || n.late ? { late: (n.late ?? 0) + lag } : {}), ...(odd ? { odd } : {}) })) : kept;
	}

	/** The switches' twist on a beat's notes: the machine's voices and watches gated, lifted, handed round and echoed. */
	private twisted(notes: Note[], step: number): Note[] {
		const tw = this.twist;
		if (tw === PLAIN) return notes;
		const mine = new Set(this.voices.map((v) => v.id));
		const at = step + tw.shift;
		const open = ((tw.gate >>> (at % 16)) & 1) === 1;
		const up = tw.octave && Math.floor(at / 4) % 2 === 1 ? 12 * Math.log2(this.tuning.period) : 0;
		const out: Note[] = [];
		for (const n of notes) {
			const pan = tw.mirror ? -n.pan : n.pan;
			if (!mine.has(n.voice) && !n.voice.startsWith("watch:")) {
				out.push(tw.mirror ? { ...n, pan } : n);
				continue;
			}
			if (!open) continue;
			const i = TURNS.indexOf(n.timbre);
			const m: Note = { ...n, midi: n.midi + up, pan, timbre: i >= 0 && tw.turn ? TURNS[(i + tw.turn) % TURNS.length]! : n.timbre };
			out.push(m);
			if (tw.ratchet) out.push({ ...m, late: (m.late ?? 0) + 0.5, velocity: m.velocity * 0.6 });
			if (tw.echo) out.push({ ...m, late: (m.late ?? 0) + tw.echo, velocity: m.velocity * 0.4, pan: -m.pan });
		}
		return out;
	}
}

/** The PDP-7 cabinet's voices: the CPU low, the 340 bright, the Forth device a bell above both. */
export const PDP7_VOICES: readonly Voice[] = [
	{ id: "cpu", label: "PDP-7", timbre: "bass", root: 36, octaves: 2, pan: -0.3, most: 2 },
	{ id: "340", label: "Type 340", timbre: "pluck", root: 60, octaves: 2, pan: 0.3, most: 3 },
	{ id: "forth", label: "Forth device", timbre: "chime", root: 84, octaves: 1, pan: 0, most: 1 },
];

/** The Apple ]['s memory, as the 6502 runs it: where its PC is says what it is doing. */
export const APPLE2_REGIONS: readonly Region[] = [
	{ name: "low memory", from: 0x0000, to: 0x07ff },
	{ name: "program", from: 0x0800, to: 0x95ff },
	{ name: "DOS", from: 0x9600, to: 0xbfff },
	{ name: "slot ROMs", from: 0xc000, to: 0xcfff },
	{ name: "Applesoft", from: 0xd000, to: 0xf7ff },
	{ name: "Monitor", from: 0xf800, to: 0xffff },
];

/**
 * What calling a routine does to the music. A `hit` sounds once in a beat the routine was
 * called in: `bell` the Apple's own beep, about 1 kHz; `crash` a cymbal; `scroll` a kick that
 * turns the drums a step, as the teletype's line feed does; `error` a sad trombone; `rumble` a
 * low cluster. A `rate` follows how often it was called: `drive` pushes the drums as if the
 * machine were working harder; `type` plays chord tones on the keys, a few for a lot; `sparkle`
 * glints high, more of them the more it plots.
 */
export type CallSound = { readonly kind: "hit"; readonly sound: "bell" | "crash" | "scroll" | "error" | "rumble" } | { readonly kind: "rate"; readonly param: "drive" | "type" | "sparkle" };
/** A routine to listen for, by its entry address. */
export type CallAt = { readonly name: string; readonly addr: number; readonly sound: CallSound };
/** How many times a routine was entered since the last beat. */
export type Called = { readonly name: string; readonly calls: number; readonly sound: CallSound };

/** The Apple ]['s documented entry points, the Monitor's and Applesoft's, and what each one sounds like when called. */
export const APPLE2_CALLS: readonly CallAt[] = [
	{ name: "BELL1", addr: 0xfbdd, sound: { kind: "hit", sound: "bell" } },
	{ name: "HOME", addr: 0xfc58, sound: { kind: "hit", sound: "crash" } },
	{ name: "SCROLL", addr: 0xfc70, sound: { kind: "hit", sound: "scroll" } },
	{ name: "ERROR", addr: 0xd412, sound: { kind: "hit", sound: "error" } },
	{ name: "GARBAG", addr: 0xe484, sound: { kind: "hit", sound: "rumble" } },
	{ name: "NEWSTT", addr: 0xd7d2, sound: { kind: "rate", param: "drive" } },
	{ name: "COUT", addr: 0xfded, sound: { kind: "rate", param: "type" } },
	{ name: "HPLOT", addr: 0xf457, sound: { kind: "rate", param: "sparkle" } },
	{ name: "PLOT", addr: 0xf800, sound: { kind: "rate", param: "sparkle" } },
];

/** The Apple ]['s voices: the 6502, the Disk II's head, and the speaker. */
export const APPLE2_VOICES: readonly Voice[] = [
	{ id: "6502", label: "6502", timbre: "pluck", root: 48, octaves: 2, pan: -0.2, most: 3 },
	{ id: "disk", label: "Disk II", timbre: "tick", root: 40, octaves: 3, pan: 0.4, most: 1 },
	{ id: "speaker", label: "Speaker", timbre: "chime", root: 79, octaves: 1, pan: 0, most: 1 },
];

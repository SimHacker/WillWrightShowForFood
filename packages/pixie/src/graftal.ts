/**
 * Graftals for a 1965 vector tube.
 *
 * Alvy Ray Smith named them (SIGGRAPH 1984, "Plants, Fractals, and
 * Formal Languages"): plants grown from grammar rewriting — what
 * Lindenmayer systems became in graphics. A graftal is pure structure,
 * which makes it native food for a display-list machine: every F in
 * the derived string is one Type 340 vector word, and the whole plant
 * is a display file the 340 executes directly.
 *
 * Two layers, because the tube and the rings want different things:
 *   strokes        — grow(sys) -> turtle(...) -> unit-space polylines
 *   display words  — toDisplayFile(strokes): PARAM/POINT/VECTOR words
 *                    the cabinet's Type340 runs as-is (proof: the
 *                    snapshot test renders the fern through the real
 *                    mode machine into SVG)
 * The third layer — strokes as PIXIE ring elements SYMELEC can pick
 * with the light pen — belongs to the serve-back rung and is gated on
 * the RSPPIX element-semantics decode. See README.
 */

export type LSystem = {
	axiom: string;
	rules: Record<string, string>;
	/** Turn per +/- in degrees. */
	angle: number;
	/** Forward step shrink per bracket depth, 1 = none. */
	shrink?: number;
};

export type Stroke = {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
};

/** Barnsley's fern as an L-system (the classic bracketed form). */
export const FERN: LSystem = {
	axiom: "X",
	rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
	angle: 25,
};

export function grow(sys: LSystem, iterations: number): string {
	let s = sys.axiom;
	for (let i = 0; i < iterations; i += 1) {
		let next = "";
		for (const ch of s) next += sys.rules[ch] ?? ch;
		s = next;
	}
	return s;
}

/**
 * Standard bracketed-turtle interpretation: F draw, f move, +/- turn,
 * [ ] push/pop. Returns strokes in unit space (y up), unnormalized.
 */
export function turtle(
	program: string,
	angleDeg: number,
	step = 1,
	startDeg = 90,
	shrink = 1,
): Stroke[] {
	const strokes: Stroke[] = [];
	const stack: { x: number; y: number; a: number; s: number }[] = [];
	let x = 0;
	let y = 0;
	let a = (startDeg * Math.PI) / 180;
	let s = step;
	const turn = (angleDeg * Math.PI) / 180;
	for (const ch of program) {
		if (ch === "F" || ch === "f") {
			const nx = x + s * Math.cos(a);
			const ny = y + s * Math.sin(a);
			if (ch === "F") strokes.push({ x0: x, y0: y, x1: nx, y1: ny });
			x = nx;
			y = ny;
		} else if (ch === "+") a += turn;
		else if (ch === "-") a -= turn;
		else if (ch === "[") stack.push({ x, y, a, s });
		else if (ch === "]") {
			const t = stack.pop();
			if (t) ({ x, y, a, s } = t);
		} else if (ch === "<") s *= shrink;
		else if (ch === ">") s /= shrink;
	}
	return strokes;
}

export function fern(iterations = 5): Stroke[] {
	return turtle(grow(FERN, iterations), FERN.angle);
}

/**
 * Rehmi Post and Don Hopkins's fractal leaf, NeWS PostScript at UniPress:
 * https://donhopkins.com/home/archive/news-tape/pictures/leaf.ps
 * Each level draws a unit line up its own y axis, then at every grain
 * of its granularity loop sprouts a branch per angle: rotate, scale,
 * and recurse into the next level, or just draw a line at the last.
 * The procedures see the level's own grain and branchangle, as the
 * level's dictionary did, so the config below is the PostScript's.
 */
export type FractalEnv = {
	grain: number;
	branchangle: number;
	/** `limit rnd`: 0 to limit-1, an integer. */
	rnd: (limit: number) => number;
};

export type FractalLevel = {
	/** start step end, for a PostScript `for`. */
	granularity: (e: FractalEnv) => [number, number, number];
	branchscale: (e: FractalEnv) => [number, number];
	branchangles: (e: FractalEnv) => number[];
};

const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);

export const LEAF: FractalLevel[] = [
	{
		granularity: () => [1, 1, 1],
		branchscale: ({ branchangle }) => {
			const s = (cos(branchangle / 2) + 0.1) ** 2 + 0.3;
			return [s, s];
		},
		branchangles: () => [-110, -60, 0, 60, 110],
	},
	{
		granularity: () => [0.08, 0.03, 1],
		branchscale: ({ grain }) => {
			const s = sin(grain * 110 + 50) ** 2 / 7;
			return [s, s];
		},
		branchangles: ({ grain }) => [-60 + grain * 30, 60 - grain * 30],
	},
	{
		granularity: ({ rnd }) => [0.05, rnd(100) / 1000 + 0.14, 1],
		branchscale: ({ grain }) => {
			const s = 0.4 - grain * 0.3;
			return [s, s];
		},
		branchangles: ({ grain, rnd }) => [
			89 - grain * 85,
			-89 + grain * 85,
			70 - grain * 40 - rnd(30),
			-70 + grain * 40 + rnd(30),
		],
	},
	{
		granularity: () => [0, 1, -1],
		branchscale: () => [1, 1],
		branchangles: () => [],
	},
];

/** Park and Miller's minimal standard, so a seed always grows the same leaf. */
function seeded(seed: number): () => number {
	let s = Math.max(1, Math.floor(seed) % 2147483647);
	return () => {
		s = (s * 16807) % 2147483647;
		return (s - 1) / 2147483646;
	};
}

/** Affine [a b c d e f], as PostScript's CTM. */
type Ctm = [number, number, number, number, number, number];

export function fractal(levels: FractalLevel[], random: () => number = Math.random): Stroke[] {
	const out: Stroke[] = [];
	const rnd = (limit: number) => Math.floor(random() * limit);
	const line = ([a, b, c, d, e, f]: Ctm) => out.push({ x0: e, y0: f, x1: c + e, y1: d + f });
	const draw = (i: number, m: Ctm): void => {
		const level = levels[i]!;
		line(m);
		const env: FractalEnv = { grain: 0, branchangle: 0, rnd };
		const [start, step, end] = level.granularity(env);
		for (let g = start; step > 0 ? g <= end : g >= end; g += step) {
			env.grain = g;
			const [a, b, c, d, e, f] = m;
			const at: Ctm = [a, b, c, d, c * g + e, d * g + f];
			for (const angle of level.branchangles(env)) {
				env.branchangle = angle;
				const co = cos(angle);
				const si = sin(angle);
				const r: Ctm = [a * co + c * si, b * co + d * si, c * co - a * si, d * co - b * si, at[4], at[5]];
				if (i + 1 < levels.length) {
					const [sx, sy] = level.branchscale(env);
					draw(i + 1, [r[0] * sx, r[1] * sx, r[2] * sy, r[3] * sy, r[4], r[5]]);
				} else line(r);
			}
		}
	};
	if (levels.length > 0) draw(0, [1, 0, 0, 1, 0, 0]);
	return out;
}

export function potLeaf(seed = 1972, levels: FractalLevel[] = LEAF): Stroke[] {
	return fractal(levels, seeded(seed));
}

/** Fit strokes into the 340's 1024-square with a margin. */
export function normalize(strokes: Stroke[], size = 1024, margin = 64): Stroke[] {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const s of strokes) {
		minX = Math.min(minX, s.x0, s.x1);
		minY = Math.min(minY, s.y0, s.y1);
		maxX = Math.max(maxX, s.x0, s.x1);
		maxY = Math.max(maxY, s.y0, s.y1);
	}
	const scale = (size - 2 * margin) / Math.max(maxX - minX, maxY - minY, 1e-9);
	const ox = margin + (size - 2 * margin - (maxX - minX) * scale) / 2;
	const oy = margin;
	const m = (v: number, min: number, o: number) => Math.round(o + (v - min) * scale);
	return strokes.map((s) => ({
		x0: m(s.x0, minX, ox),
		y0: m(s.y0, minY, oy),
		x1: m(s.x1, minX, ox),
		y1: m(s.y1, minY, oy),
	}));
}

/* Type 340 word assembly. DEC numbers bits from the left: bit 0 is the
 * MSB of the 18-bit word. Field layouts are the mode machine's own
 * (H-340; cabinet type340.ts is the executable receipt). */
const BIT = (n: number) => 1 << (17 - n);
const FIELD = (v: number, a: number, b: number) => (v & ((1 << (b - a + 1)) - 1)) << (17 - b);

const POINT = 1;
const VECTOR = 4;

/** PARAM word: enter `mode`, set scale 1 and mid intensity; stop bit optional. */
function param(mode: number, stop = false): number {
	let w = FIELD(mode, 2, 4) | BIT(11) | FIELD(0, 12, 13) | BIT(14) | FIELD(5, 15, 17);
	if (stop) w |= BIT(7);
	return w;
}

/** POINT word: load one axis, optionally staying in POINT or moving on. */
function point(axis: "x" | "y", v: number, nextMode: number): number {
	let w = FIELD(nextMode, 2, 4) | FIELD(v, 8, 17);
	if (axis === "y") w |= BIT(1);
	return w;
}

/** VECTOR word: signed 7-bit deltas, intensify, optional escape. */
function vector(dx: number, dy: number, escape: boolean, bright = true): number {
	let w = bright ? BIT(1) : 0;
	if (escape) w |= BIT(0);
	if (dy < 0) w |= BIT(2);
	w |= FIELD(Math.abs(dy), 3, 9);
	if (dx < 0) w |= BIT(10);
	w |= FIELD(Math.abs(dx), 11, 17);
	return w;
}

/**
 * Strokes to an executable display file: for each polyline run, PARAM
 * into POINT, set Y then X (X word hands off to VECTOR), then one
 * vector word per segment — split when a delta exceeds the 7-bit
 * field — escaping back to PARAM at the run's end. Terminates with a
 * stop word, so a bare `IDLA` at this file draws one frame and halts.
 */
export function toDisplayFile(strokes: Stroke[]): number[] {
	const words: number[] = [];
	let bx: number | undefined;
	let by: number | undefined;
	let run: number[] = [];
	const flush = () => {
		if (run.length === 0) return;
		const last = run[run.length - 1]!;
		run[run.length - 1] = last | BIT(0); // escape on the run's final vector
		words.push(...run);
		run = [];
	};
	for (let i = 0; i < strokes.length; i += 1) {
		let s = strokes[i]!;
		const next = strokes[i + 1];
		const atStart = s.x0 === bx && s.y0 === by;
		const atEnd = s.x1 === bx && s.y1 === by;
		// sibling branches share a base: draw this one inward so the next starts where the beam is
		const shared = next !== undefined && next.x0 === s.x0 && next.y0 === s.y0;
		if (!atStart && (atEnd || shared)) s = { x0: s.x1, y0: s.y1, x1: s.x0, y1: s.y0 };
		const hop = bx === undefined || by === undefined ? Infinity : Math.max(Math.abs(s.x0 - bx), Math.abs(s.y0 - by));
		if (hop > 0 && hop <= 254 && run.length > 0) {
			// a dark vector or two is cheaper than a three-word reposition
			let dx = s.x0 - bx!;
			let dy = s.y0 - by!;
			while (dx !== 0 || dy !== 0) {
				const px = Math.max(-127, Math.min(127, dx));
				const py = Math.max(-127, Math.min(127, dy));
				run.push(vector(px, py, false, false));
				dx -= px;
				dy -= py;
			}
		} else if (hop > 0) {
			flush();
			words.push(param(POINT));
			words.push(point("y", s.y0, POINT));
			words.push(point("x", s.x0, VECTOR));
		}
		let dx = s.x1 - s.x0;
		let dy = s.y1 - s.y0;
		while (dx !== 0 || dy !== 0) {
			const px = Math.max(-127, Math.min(127, dx));
			const py = Math.max(-127, Math.min(127, dy));
			run.push(vector(px, py, false));
			dx -= px;
			dy -= py;
		}
		bx = s.x1;
		by = s.y1;
	}
	flush();
	words.push(param(POINT, true));
	return words;
}

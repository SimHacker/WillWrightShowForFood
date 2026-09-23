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
 * The seven-fingered leaf. Not an L-system — a procedural graftal:
 * serrated leaflets fanned from a palm point, lengths and angles from
 * the plant everyone recognizes. Serration is a sawtooth riding the
 * blade edge; each leaflet is one closed polyline of strokes.
 */
export function potLeaf(leaflets = 7, teeth = 15): Stroke[] {
	const strokes: Stroke[] = [];
	const half = (leaflets - 1) / 2;
	for (let i = 0; i < leaflets; i += 1) {
		const k = i - half;
		const fan = (k / half) * 80; // degrees off vertical
		const len = 1 - 0.18 * Math.abs(k) ** 1.4;
		blade(strokes, fan, len, teeth);
	}
	// stem
	strokes.push({ x0: 0, y0: 0, x1: 0, y1: -0.35 });
	return strokes;
}

function blade(out: Stroke[], fanDeg: number, len: number, teeth: number): void {
	const a = ((90 - fanDeg) * Math.PI) / 180;
	const ux = Math.cos(a);
	const uy = Math.sin(a);
	// perpendicular, for width
	const px = -uy;
	const py = ux;
	const pts: { x: number; y: number }[] = [];
	// up one edge and down the other, sawtooth width profile
	for (const side of [1, -1]) {
		for (let t = 0; t <= teeth; t += 1) {
			const f = side === 1 ? t / teeth : 1 - t / teeth;
			const width = 0.16 * len * Math.sin(Math.PI * f) * (1 - 0.45 * (t % 2));
			pts.push({
				x: f * len * ux + side * width * px,
				y: f * len * uy + side * width * py,
			});
		}
	}
	pts.push(pts[0]!);
	for (let i = 1; i < pts.length; i += 1) {
		out.push({ x0: pts[i - 1]!.x, y0: pts[i - 1]!.y, x1: pts[i]!.x, y1: pts[i]!.y });
	}
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
function vector(dx: number, dy: number, escape: boolean): number {
	let w = BIT(1); // intensify
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
	for (const s of strokes) {
		if (s.x0 !== bx || s.y0 !== by) {
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

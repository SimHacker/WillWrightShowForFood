/**
 * A hand as an instrument, machine-free (ROADMAP.md §13): 21 landmarks per frame, as hand
 * trackers report them, and what a VPL DataGlove would have measured from them: how far each
 * finger is bent, where the hand points, how far the thumb is from the index finger.
 *
 * Landmarks are MediaPipe's numbering and image convention, so a webcam tracker's output is a
 * HandFrame as it stands: x right and y down, 0..1 across the image; z depth relative to the
 * wrist, in the same units as x, negative toward the camera.
 *
 *   0 wrist · thumb 1 CMC 2 MCP 3 IP 4 tip · index 5 6 7 8 · middle 9 10 11 12
 *   ring 13 14 15 16 · pinky 17 18 19 20 (MCP, PIP, DIP, tip)
 *
 * The glove's measurements are in the units a PDP-7 can use with turtle.fs's trig: a fraction is
 * an integer scaled by ONE (16384, what SIN returns for 90 degrees), an angle is whole degrees,
 * and a heading is the turtle's: 0 up, clockwise.
 */

export type HandPoint = { x: number; y: number; z: number };

export type HandFrame = {
	/** 21 landmarks. */
	points: readonly HandPoint[];
	handedness?: "left" | "right";
	/** Image width / height, so angles and the picture aren't stretched. 1 if not given. */
	aspect?: number;
};

/** 1.0 in the glove's fixed point: sin 90 in turtle.fs. */
export const ONE = 16384;

export const FINGERS = ["thumb", "index", "middle", "ring", "pinky"] as const;

/** Each finger's landmarks from the joint before its first bend to the tip. */
export const FINGER_CHAINS: readonly (readonly number[])[] = [
	[1, 2, 3, 4],
	[0, 5, 6, 7, 8],
	[0, 9, 10, 11, 12],
	[0, 13, 14, 15, 16],
	[0, 17, 18, 19, 20],
];

/** How far each joint of a finger bends when it is fully curled, in degrees; the sum is a flex of ONE. */
export const JOINT_MAX: readonly (readonly number[])[] = [
	[60, 80],
	[90, 100, 80],
	[90, 100, 80],
	[90, 100, 80],
	[90, 100, 80],
];

/** The lines to draw: the five fingers and the palm. */
export const HAND_CHAINS: readonly (readonly number[])[] = [
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8],
	[9, 10, 11, 12],
	[13, 14, 15, 16],
	[17, 18, 19, 20],
	[0, 5, 9, 13, 17, 0],
];

type V3 = [number, number, number];

/** The landmarks in square units (x and y both in widths), z toward the camera positive. */
function square(f: HandFrame): V3[] {
	const a = f.aspect ?? 1;
	return f.points.map((p) => [p.x, p.y / a, -p.z]);
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
function angle(a: V3, b: V3): number {
	const la = len(a);
	const lb = len(b);
	if (la === 0 || lb === 0) return 0;
	const c = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (la * lb);
	return (Math.acos(Math.min(1, Math.max(-1, c))) * 180) / Math.PI;
}

/** Each finger's total bend in degrees, thumb first. */
export function bends(f: HandFrame): number[] {
	const p = square(f);
	return FINGER_CHAINS.map((chain) => {
		let sum = 0;
		const q = (k: number) => p[chain[k]!]!;
		for (let i = 1; i + 1 < chain.length; i += 1) sum += angle(sub(q(i), q(i - 1)), sub(q(i + 1), q(i)));
		return sum;
	});
}

/** Each finger's flex, 0 straight .. 1 fully curled, thumb first. */
export function flexes(f: HandFrame): number[] {
	return bends(f).map((b, i) => Math.min(1, b / JOINT_MAX[i]!.reduce((s, m) => s + m, 0)));
}

/** A turtle heading in degrees, 0..359, 0 up and clockwise, for a step of dx, dy with y up. */
export function headingOf(dx: number, dy: number): number {
	const h = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
	return ((h % 360) + 360) % 360;
}

/**
 * A synthetic hand, for demos and tests: palm toward the viewer, fingers curled by `curls`
 * (0..1, thumb first), so that `flexes` gives the curls back. `heading` turns it about the wrist
 * as the viewer sees it, turtle style; `x`, `y` place the wrist in the image (0..1, y down) and
 * `size` is the wrist to middle knuckle, in widths. `mirror` (default true, as the glove shows a
 * webcam) lays the image out so that, mirrored, the picture is what was asked for.
 */
export function syntheticHand(o: {
	curls: readonly number[];
	heading?: number;
	x?: number;
	y?: number;
	size?: number;
	mirror?: boolean;
	handedness?: "left" | "right";
}): HandFrame {
	const L = o.size ?? 0.3;
	const th = ((o.heading ?? 0) * Math.PI) / 180;
	const cx = o.x ?? 0.5;
	const cy = o.y ?? 0.85;
	const mirror = o.mirror ?? true;
	// Local frame: u right, v up (the hand's own up), w toward the viewer; in units of L.
	const local: V3[] = new Array(21);
	local[0] = [0, 0, 0];
	local[1] = [-0.35, 0.25, 0];
	local[5] = [-0.3, 0.95, 0];
	local[9] = [0, 1, 0];
	local[13] = [0.27, 0.93, 0];
	local[17] = [0.5, 0.8, 0];
	const bones = [
		[0.35, 0.3, 0.27],
		[0.45, 0.27, 0.22],
		[0.5, 0.3, 0.24],
		[0.46, 0.28, 0.22],
		[0.36, 0.22, 0.2],
	];
	const norm2 = (u: number, v: number): [number, number] => {
		const l = Math.hypot(u, v);
		return [u / l, v / l];
	};
	for (let f = 0; f < 5; f += 1) {
		const curl = Math.min(1, Math.max(0, o.curls[f] ?? 0));
		const base = f === 0 ? 1 : 1 + 4 * f;
		const knuckle = local[base]!;
		const [du, dv] = f === 0 ? norm2(-0.6, 0.8) : norm2(knuckle[0], knuckle[1]);
		// The thumb's first bone (1 to 2) doesn't bend; its bends are at 2 and 3.
		const joints = f === 0 ? [0, ...JOINT_MAX[0]!] : JOINT_MAX[f]!;
		let a = 0;
		let at = knuckle;
		for (let k = 0; k < 3; k += 1) {
			a += (joints[k]! * curl * Math.PI) / 180;
			const l = bones[f]![k]!;
			at = [at[0] + du * Math.cos(a) * l, at[1] + dv * Math.cos(a) * l, at[2] + Math.sin(a) * l];
			local[base + 1 + k] = at;
		}
	}
	const points = local.map(([u, v, w]) => {
		const sx = u * Math.cos(th) + v * Math.sin(th);
		const sy = -u * Math.sin(th) + v * Math.cos(th);
		const x = cx + sx * L;
		return { x: mirror ? 1 - x : x, y: cy - sy * L, z: -w * L };
	});
	return { points, handedness: o.handedness ?? "right", aspect: 1 };
}

/** Gestures the demo hand cycles through: curls, thumb first. */
export const GESTURES: readonly { name: string; curls: readonly number[] }[] = [
	{ name: "open", curls: [0, 0, 0, 0, 0] },
	{ name: "fist", curls: [1, 1, 1, 1, 1] },
	{ name: "point", curls: [1, 0, 1, 1, 1] },
	{ name: "victory", curls: [1, 0, 0, 1, 1] },
	{ name: "i love you", curls: [0, 0, 1, 1, 0] },
	{ name: "three", curls: [1, 0, 0, 0, 1] },
];

/**
 * The demo hand at `t` seconds: it waves, and every two seconds eases into the next gesture.
 * Deterministic, so a recording or a test sees the same hand.
 */
export function wavingHand(t: number): HandFrame {
	const hold = 2;
	const n = Math.floor(t / hold);
	const from = GESTURES[n % GESTURES.length]!.curls;
	const to = GESTURES[(n + 1) % GESTURES.length]!.curls;
	const s = Math.min(1, Math.max(0, (t - n * hold - hold / 2) / (hold / 2)));
	const e = s * s * (3 - 2 * s);
	return syntheticHand({
		curls: from.map((c, i) => c + (to[i]! - c) * e),
		heading: 20 * Math.sin(t * Math.PI * 0.8),
		x: 0.5,
		y: 0.82,
		size: 0.32,
	});
}

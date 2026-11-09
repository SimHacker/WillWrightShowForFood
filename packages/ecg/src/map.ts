/**
 * Lesson: A map you can drag.
 *
 * The complex is bookkeeping, but it can be drawn, and then it can be dragged. Inside one
 * triangle the drawing is exact: the dot is the weights times the corners, and the pointer's
 * barycentric coordinates are the weights. Segments are the same in one dimension.
 *
 * Triangles glued along a face lie flat side by side, so dragging across the face is dragging
 * into the next zone. A fork can't lie flat: three triangles hinged on one edge overlap. Each
 * overlapping triangle becomes its own page, with its own copy of the shared edge; when the
 * state sits on that edge it shows on every page, and you grab it on the page you want.
 *
 * A tetrahedron is three-dimensional. Put its four corners at alternate corners of a cube and
 * look down each axis: every view is a square with the corners at its corners. Dragging in a
 * view moves the state in that view's plane and keeps the third coordinate.
 *
 *     w_i = (1 + v_i · p) / 4
 */

import { barycentric2D, EPSILON } from "./barycentric.js";

export type Point2 = [number, number];
export type Point3 = [number, number, number];

/** One zone drawn flat: its vertices and where each one sits on the map. */
export interface Sheet {
	zone: number;
	verts: number[];
	at: Point2[];
}

const sub = (a: Point2, b: Point2): Point2 => [a[0] - b[0], a[1] - b[1]];
const dot = (a: Point2, b: Point2) => a[0] * b[0] + a[1] * b[1];

/** Do two triangles' interiors overlap? Separating axes, with a margin so shared edges don't count. */
function overlaps(a: Point2[], b: Point2[], margin: number): boolean {
	for (const tri of [a, b]) {
		for (let i = 0; i < 3; i++) {
			const e = sub(tri[(i + 1) % 3], tri[i]);
			const axis: Point2 = [-e[1], e[0]];
			const pa = a.map((p) => dot(p, axis));
			const pb = b.map((p) => dot(p, axis));
			const scale = Math.hypot(...axis) || 1;
			if (Math.min(Math.max(...pa), Math.max(...pb)) - Math.max(Math.min(...pa), Math.min(...pb)) <= margin * scale)
				return false;
		}
	}
	return true;
}

/**
 * Lay the zones out as sheets. Segments and triangles keep the layout; a triangle that would
 * overlap one already placed moves right, a page at a time, until it doesn't.
 */
export function sheetsOf(zones: number[][], corners: Point2[], gap = 24): Sheet[] {
	const xs = corners.map((c) => c[0]);
	const page = Math.max(...xs) - Math.min(...xs) + gap;
	const sheets: Sheet[] = [];
	for (const [z, verts] of zones.entries()) {
		if (verts.length < 2 || verts.length > 3) continue;
		let at = verts.map((v) => [...corners[v]] as Point2);
		if (verts.length === 3) {
			for (let k = 1; sheets.some((s) => s.at.length === 3 && overlaps(s.at, at, 1e-6 * page)); k++)
				at = verts.map((v) => [corners[v][0] + k * page, corners[v][1]] as Point2);
		}
		sheets.push({ zone: z, verts, at });
	}
	return sheets;
}

function onSegment(p: Point2, a: Point2, b: Point2): { t: number; d: number } {
	const ab = sub(b, a);
	const len = dot(ab, ab);
	const t = len < EPSILON ? 0 : Math.max(0, Math.min(1, dot(sub(p, a), ab) / len));
	const q: Point2 = [a[0] + t * ab[0], a[1] + t * ab[1]];
	return { t, d: Math.hypot(p[0] - q[0], p[1] - q[1]) };
}

/** The sheet's nearest point to p, as weights over the sheet's vertices, and how far away it was. */
export function nearestOnSheet(sheet: Sheet, p: Point2): { local: number[]; distance: number } {
	const [a, b, c] = sheet.at;
	if (sheet.at.length === 2) {
		const { t, d } = onSegment(p, a, b);
		return { local: [1 - t, t], distance: d };
	}
	const w = barycentric2D(p, a, b, c);
	if (w.every((x) => x >= 0)) return { local: w, distance: 0 };
	let best = { local: w, distance: Infinity };
	for (const [i, j] of [
		[0, 1],
		[1, 2],
		[2, 0],
	]) {
		const { t, d } = onSegment(p, sheet.at[i], sheet.at[j]);
		if (d < best.distance) {
			const local = [0, 0, 0];
			local[i] = 1 - t;
			local[j] = t;
			best = { local, distance: d };
		}
	}
	return best;
}

/** Where the state sits on a sheet, or null if the state has weight outside the sheet's zone. */
export function stateOnSheet(sheet: Sheet, weights: number[], tolerance = 1e-6): Point2 | null {
	if (weights.some((w, k) => Math.abs(w) > tolerance && !sheet.verts.includes(k))) return null;
	return sheet.verts.reduce<Point2>(
		(acc, v, i) => [acc[0] + weights[v] * sheet.at[i][0], acc[1] + weights[v] * sheet.at[i][1]],
		[0, 0],
	);
}

/** Two sheets are glued where their zones share a face that sits at the same place on both. */
export function gluedFace(a: Sheet, b: Sheet, face: number[], tolerance = 1e-6): boolean {
	return face.every((v) => {
		const i = a.verts.indexOf(v);
		const j = b.verts.indexOf(v);
		return (
			i >= 0 &&
			j >= 0 &&
			Math.abs(a.at[i][0] - b.at[j][0]) < tolerance &&
			Math.abs(a.at[i][1] - b.at[j][1]) < tolerance
		);
	});
}

/** The tetrahedron's corners: alternate corners of the cube [-1, 1]³. */
export const TETRAHEDRON: Point3[] = [
	[1, 1, 1],
	[1, -1, -1],
	[-1, 1, -1],
	[-1, -1, 1],
];

/** The three views down the axes: which two coordinates each one shows. */
export const AXIS_VIEWS: [number, number][] = [
	[0, 1],
	[0, 2],
	[2, 1],
];

export function tetraPoint(local: number[]): Point3 {
	const p: Point3 = [0, 0, 0];
	local.forEach((w, i) => {
		for (let k = 0; k < 3; k++) p[k] += w * TETRAHEDRON[i][k];
	});
	return p;
}

/** Weights for a point of the cube; outside the tetrahedron they clip to its surface. */
export function tetraWeights(p: Point3): number[] {
	const w = TETRAHEDRON.map((v) => (1 + v[0] * p[0] + v[1] * p[1] + v[2] * p[2]) / 4);
	if (w.every((x) => x >= 0)) return w;
	const clipped = w.map((x) => Math.max(0, x));
	const sum = clipped.reduce((s, x) => s + x, 0);
	return sum > EPSILON ? clipped.map((x) => x / sum) : [0.25, 0.25, 0.25, 0.25];
}

/**
 * The others' proportions, as a point on the face opposite vertex k: where a straight line from
 * k through the state comes out. If they've all collapsed to zero, the remembered face, else an
 * even split.
 */
export function oppositeFace(weights: number[], k: number, zone: number[], memory?: number[]): number[] {
	const others = zone.filter((v) => v !== k);
	const face = weights.map((w, v) => (others.includes(v) ? Math.max(0, w) : 0));
	let sum = face.reduce((s, w) => s + w, 0);
	if (sum > 1e-6) return face.map((w) => w / sum);
	const kept = (memory ?? []).map((w, v) => (others.includes(v) ? Math.max(0, w) : 0));
	sum = kept.reduce((s, w) => s + w, 0);
	if (sum > 1e-6) return kept.map((w) => w / sum);
	return weights.map((_, v) => (others.includes(v) ? 1 / others.length : 0));
}

/** Slide one weight to a value on the line from its vertex through the face: the rest keep their ratios. */
export function pullWeight(face: number[], k: number, value: number): number[] {
	const v = Math.max(0, Math.min(1, value));
	return face.map((w, i) => (i === k ? v : w * (1 - v)));
}

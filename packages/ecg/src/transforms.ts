/**
 * Lesson: Beyond sliding points: transformations.
 *
 *     A ── B ── C ── A' ── B' ── C' ── A'' …      four poses, walked forever
 *     └──── one stride ────┘
 *
 * A walk cycle reuses the same few poses, but the figure has to keep moving forward instead of
 * snapping back to where it started. Tom's answer: each edge of the complex carries an
 * **automatic transformation**. Walking along the edge C → A applies "one stride to the right"
 * to A; walking back A → C undoes it. Transforms are **anti-symmetric**: T(v→u) = T(u→v)⁻¹.
 *
 * The **linearized configuration map**: when the state enters a zone, place each of the zone's
 * examples once (the example's placement is its neighbour's placement composed with the edge's
 * transform), then blend the placed examples as usual. Inside the zone everything is still
 * linear, so tugging is still one small solve. A rotation blended this way isn't a true
 * rotation: halfway between a square and the same square turned 90°, the corners cut the chord
 * and the square shrinks a little. The exact alternative, integrating the transform along the
 * path every frame, gives the true arc but loses the linear solve.
 *
 * A transform can also **rename the points**. A box that rolls a quarter turn on its
 * bottom-right corner lands with that corner at its bottom-left; to roll again it must pivot
 * on the corner that was its top-right. Composing "turn 90° about (1, 0)" would keep turning
 * about (1, 0) and roll the box into the ground. "Shift one box-width and rename the corners"
 * is a linear map on the configuration like any other, so an edge can carry it.
 *
 * Configurations here are 2D points, x and y interleaved. A transform is a 2D affine map in
 * SVG order [a, b, c, d, e, f] (x' = a·x + c·y + e, y' = b·x + d·y + f), applied to every
 * point, after an optional renaming: point i of the result is point permute[i] of the input.
 */

import type { Configuration } from "./lerp.js";

export type Affine = [number, number, number, number, number, number];

export const IDENTITY: Affine = [1, 0, 0, 1, 0, 0];

export function translation(dx: number, dy: number): Affine {
	return [1, 0, 0, 1, dx, dy];
}

/** Turn by `degrees` (counter-clockwise with y up) about the point (cx, cy). */
export function rotation(degrees: number, cx = 0, cy = 0): Affine {
	const t = (degrees * Math.PI) / 180;
	const c = Math.cos(t);
	const s = Math.sin(t);
	return [c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy];
}

/** compose(m, n) applies n first, then m. */
export function compose(m: Affine, n: Affine): Affine {
	return [
		m[0] * n[0] + m[2] * n[1],
		m[1] * n[0] + m[3] * n[1],
		m[0] * n[2] + m[2] * n[3],
		m[1] * n[2] + m[3] * n[3],
		m[0] * n[4] + m[2] * n[5] + m[4],
		m[1] * n[4] + m[3] * n[5] + m[5],
	];
}

export function invert(m: Affine): Affine {
	const [a, b, c, d, e, f] = m;
	const det = a * d - b * c;
	if (Math.abs(det) < 1e-12) throw new Error("this transform squashes the plane flat and can't be undone");
	return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

export function place(m: Affine, configuration: Configuration): Configuration {
	const out = [...configuration];
	for (let i = 0; i + 1 < out.length; i += 2) {
		const x = configuration[i];
		const y = configuration[i + 1];
		out[i] = m[0] * x + m[2] * y + m[4];
		out[i + 1] = m[1] * x + m[3] * y + m[5];
	}
	return out;
}

export interface Transform {
	affine: Affine;
	permute?: number[];
}

export const NO_TRANSFORM: Transform = { affine: IDENTITY };

export function transform(t: Transform, configuration: Configuration): Configuration {
	const p = t.permute;
	const renamed = p ? p.flatMap((j) => [configuration[2 * j], configuration[2 * j + 1]]) : configuration;
	return place(t.affine, renamed);
}

/** composeTransforms(m, n) applies n first, then m. */
export function composeTransforms(m: Transform, n: Transform): Transform {
	const affine = compose(m.affine, n.affine);
	if (!m.permute && !n.permute) return { affine };
	const size = (m.permute ?? n.permute)!.length;
	const mp = m.permute ?? [...Array(size).keys()];
	const np = n.permute ?? [...Array(size).keys()];
	return { affine, permute: mp.map((j) => np[j]) };
}

export function invertTransform(t: Transform): Transform {
	const affine = invert(t.affine);
	if (!t.permute) return { affine };
	const permute = new Array<number>(t.permute.length);
	t.permute.forEach((j, i) => (permute[j] = i));
	return { affine, permute };
}

/** Transforms on edges, keyed "from>to". The reverse direction is the inverse. */
export type EdgeTransforms = Map<string, Transform>;

export function edgeTransform(edges: EdgeTransforms, from: number, to: number): Transform {
	const forward = edges.get(`${from}>${to}`);
	if (forward) return forward;
	const backward = edges.get(`${to}>${from}`);
	return backward ? invertTransform(backward) : NO_TRANSFORM;
}

/** Where each example currently sits. null: not placed yet (not in any zone the state has visited). */
export type Placements = (Transform | null)[];

/**
 * Entering `zone` through `face`: the face's examples keep their placements (that's what keeps
 * the drawing from jumping), and each new example is placed from a face example across the
 * edge joining them. With no face (the first zone), everything starts unmoved.
 */
export function register(placements: Placements, zone: number[], face: number[], edges: EdgeTransforms): Placements {
	const out = [...placements];
	const anchors = face.filter((u) => out[u]);
	for (const v of zone) {
		if (face.includes(v) && out[v]) continue;
		const u = anchors[0];
		out[v] = u === undefined ? NO_TRANSFORM : composeTransforms(out[u] as Transform, edgeTransform(edges, u, v));
	}
	return out;
}

export function placedExamples(examples: Configuration[], placements: Placements): Configuration[] {
	return examples.map((x, i) => {
		const t = placements[i];
		return t && t !== NO_TRANSFORM ? transform(t, x) : x;
	});
}

/**
 * Lesson 1: three pictures and a triangle.
 *
 *            B
 *           / \
 *          /   \        the dot is 50% A, 30% B, 20% C
 *         /  •  \
 *        A───────C
 *
 * Put one example at each corner of a triangle. A point inside the triangle names a blend: its
 * barycentric weights say how much of each corner to use. The weights are never negative and
 * always add up to 1. Four examples make a tetrahedron, and n+1 examples make an n-simplex, the
 * same rule in more dimensions. The simplex is bookkeeping you never see on screen; the blended
 * drawing is what you see.
 *
 *     weights λ₀ … λₖ,   λᵢ ≥ 0,   Σλᵢ = 1
 */

export type Weights = number[];

export const EPSILON = 1e-9;

/** One example at full strength: the corner of the simplex. */
export function vertexWeights(count: number, index: number): Weights {
	return Array.from({ length: count }, (_, i) => (i === index ? 1 : 0));
}

/** True if the weights describe a point in (or on the edge of) the simplex. */
export function isInSimplex(weights: Weights, tolerance = 1e-6): boolean {
	const sum = weights.reduce((s, w) => s + w, 0);
	return Math.abs(sum - 1) <= tolerance && weights.every((w) => w >= -tolerance);
}

/** Clip tiny negatives left by floating point, then rescale to sum to 1. */
export function normalizeWeights(weights: Weights): Weights {
	const clipped = weights.map((w) => (w < 0 ? 0 : w));
	const sum = clipped.reduce((s, w) => s + w, 0);
	if (sum <= EPSILON) {
		throw new Error("weights sum to zero: no point in the simplex");
	}
	return clipped.map((w) => w / sum);
}

/**
 * Barycentric coordinates of point p in the 2D triangle (a, b, c). Lesson 3 runs this in
 * reverse: the triangle is where one handle sits in three examples, p is the cursor.
 */
export function barycentric2D(
	p: [number, number],
	a: [number, number],
	b: [number, number],
	c: [number, number],
): Weights {
	const det = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
	if (Math.abs(det) < EPSILON) {
		throw new Error("degenerate triangle: the three positions are on one line");
	}
	const l0 = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / det;
	const l1 = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / det;
	return [l0, l1, 1 - l0 - l1];
}

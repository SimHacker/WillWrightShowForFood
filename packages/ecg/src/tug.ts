/**
 * Lesson: Tugging. Drag the drawing, solve for the weights.
 *
 *     you drag this ──▶ ●                     the weights move so it follows
 *                        \
 *     drawing:  🙂 ──────▶ 😮                 ┃λ₀ ▇▇▇▁▁   ┃λ₁ ▁▁▇▇▇
 *
 * Grab some numbers of the drawing (a handle is a point, so its x row and its y row) and say
 * where you want them. Inside one zone driving is linear, so how much each handle moves per unit
 * of weight is fixed: the Jacobian is just the grabbed rows of the example matrix. That's why
 * ECG is easier than general inverse kinematics, where the Jacobian changes every frame.
 *
 * The weights must keep summing to 1. Edge coordinates take care of that: pick one example as
 * the base x_b and describe the state by how far it has moved toward each of the others.
 *
 *     configuration = x_b + Σ μᵢ·(xᵢ − x_b)        λ_b = 1 − Σμᵢ,  λᵢ = μᵢ
 *     J[row][i]     = xᵢ[row] − x_b[row]
 *     Δμ            = damped least squares (J, target − current)
 *
 * The solve is absolute, from the state at mouse-down, not a chain of small steps: because the
 * zone is linear, one solve per frame lands exactly, with no drift to accumulate.
 *
 * One handle in a triangle: J is square, one exact answer (barycentric coordinates in reverse).
 * One handle in a bigger simplex: J is wide, many answers; the solve picks the smallest change.
 * Several handles: J is tall, usually no exact answer; least squares gets as close as it can.
 */

import type { Configuration } from "./lerp.js";
import type { Weights } from "./barycentric.js";
import { dampedLeastSquares, type Matrix } from "./linear-algebra.js";

/** "Put configuration row `row` at `value`." `importance` scales its pull (default 1). */
export interface Target {
	row: number;
	value: number;
	importance?: number;
}

/** A 2D point handle at point index p occupies configuration rows 2p and 2p+1. */
export function pointTargets(point: number, x: number, y: number, importance = 1): Target[] {
	return [
		{ row: 2 * point, value: x, importance },
		{ row: 2 * point + 1, value: y, importance },
	];
}

/**
 * One unconstrained solve. Only examples marked active may carry weight; the result can have
 * negative weights, which *Hitting walls* deals with.
 */
export function tugOnce(
	examples: Configuration[],
	start: Weights,
	targets: Target[],
	damping: number,
	active: boolean[] = examples.map(() => true),
): Weights {
	const ids = examples.map((_, i) => i).filter((i) => active[i]);
	if (ids.length === 0) throw new Error("no active examples");
	const base = ids.reduce((best, i) => (start[i] > start[best] ? i : best), ids[0]);
	const others = ids.filter((i) => i !== base);
	const xb = examples[base];
	const mu0 = others.map((i) => start[i]);

	const j: Matrix = [];
	const r: number[] = [];
	for (const t of targets) {
		const w = t.importance ?? 1;
		const rowJ = others.map((i) => w * (examples[i][t.row] - xb[t.row]));
		const current = xb[t.row] + others.reduce((s, i, c) => s + mu0[c] * (examples[i][t.row] - xb[t.row]), 0);
		j.push(rowJ);
		r.push(w * (t.value - current));
	}
	const dmu = dampedLeastSquares(j, r, damping);

	const weights = examples.map(() => 0);
	let sum = 0;
	others.forEach((i, c) => {
		weights[i] = mu0[c] + dmu[c];
		sum += weights[i];
	});
	weights[base] = 1 - sum;
	return weights;
}

/**
 * Lesson: Hitting walls.
 *
 *            B
 *           / \
 *          /   \        drag past the edge AC and the state slides along it
 *         /     \           instead of leaving the triangle
 *        A───●───C ─ ─ ─ ✕ cursor
 *
 * The unconstrained solve happily asks for negative weights: "less than none of example B".
 * Outside the simplex the drawing stops being a blend of the examples and starts to look broken.
 * The fix is an active set: solve, and if some weight comes out negative, pin the most negative
 * example at zero and solve again with the rest. The state slides along the face, then into a
 * corner, and stops there. With one example left, there is nothing to solve.
 *
 * (The patent walks across a face into a neighbouring zone when there is one. That is *Gluing
 * triangles together*, in walk.ts; a single zone has no neighbours, so every face is a wall.)
 */

import type { Configuration } from "./lerp.js";
import { normalizeWeights, vertexWeights, type Weights } from "./barycentric.js";
import { tugOnce, type Target } from "./tug.js";

export interface TugResult {
	weights: Weights;
	/** Examples pinned at zero by the walls in this solve. */
	walls: number[];
}

export function tug(
	examples: Configuration[],
	start: Weights,
	targets: Target[],
	damping: number,
	zone: boolean[] = examples.map(() => true),
): TugResult {
	const active = [...zone];
	const walls: number[] = [];
	for (;;) {
		const remaining = active.filter(Boolean).length;
		if (remaining === 1) {
			return { weights: vertexWeights(examples.length, active.indexOf(true)), walls };
		}
		const w = tugOnce(examples, start, targets, damping, active);
		let worst = -1;
		for (let i = 0; i < w.length; i++) {
			if (active[i] && w[i] < -1e-9 && (worst < 0 || w[i] < w[worst])) worst = i;
		}
		if (worst < 0) return { weights: normalizeWeights(w), walls };
		active[worst] = false;
		walls.push(worst);
	}
}

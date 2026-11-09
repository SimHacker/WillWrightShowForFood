/**
 * Lesson 2: driving. Weights in, drawing out.
 *
 *     examples (columns)        weights        drawing
 *     ┌ x₀  x₁  x₂ ┐           ┌ λ₀ ┐
 *     │ ·   ·   ·  │     ×     │ λ₁ │    =    configuration
 *     └ ·   ·   ·  ┘           └ λ₂ ┘
 *
 * Driving mixes all of a zone's examples at once, each by its weight. Put the examples side by
 * side as the columns of a matrix X, and the drawing is X times the weight vector. Driving is
 * cheap and always defined; it's what a slider panel, a timeline or a speech recognizer does.
 *
 *     configuration = λ₀·x₀ + λ₁·x₁ + … + λₖ·xₖ = X·λ
 */

import type { Configuration } from "./lerp.js";
import type { Weights } from "./barycentric.js";

export function drive(examples: Configuration[], weights: Weights): Configuration {
	if (examples.length !== weights.length) {
		throw new Error(`${examples.length} examples but ${weights.length} weights`);
	}
	const m = examples[0]?.length ?? 0;
	const out = new Array<number>(m).fill(0);
	examples.forEach((x, i) => {
		if (x.length !== m) {
			throw new Error(`example ${i} has ${x.length} numbers, expected ${m}`);
		}
		const w = weights[i];
		if (w === 0) return;
		for (let r = 0; r < m; r++) out[r] += w * x[r];
	});
	return out;
}

/**
 * Lesson: Feel.
 *
 *     rubber   damping low, spring stiff, overshoot on     snaps back with a wobble
 *     clay     damping high, no spring, no inertia         stays where you leave it
 *     puppet   inertia on, sticky faces                    flick it and it keeps going
 *
 * The patent says what the state is; it doesn't say how dragging it should feel. Each knob is a
 * few lines, and each costs something:
 *
 *     damping     calms jitter near degenerate examples         the handle lags the cursor
 *     snap        lands exactly on an example when close        hard to stop just short of one
 *     spring      eases back to an example on release           can feel floaty
 *     inertia     a flick keeps going after you let go          overshoots what you aimed at
 *     overshoot   weights may dip below zero at a wall           too much looks broken
 *     sticky      a detent at faces between zones                notchy if overdone
 *
 * Damping is the solver's d (linear-algebra.ts); overshoot and sticky change where the walls
 * are (walk.ts). The rest are here. All of them work on weights, so they work on any model.
 */

import { vertexWeights, type Weights } from "./barycentric.js";

/** The example with the most weight. */
export function nearestExample(weights: Weights, among?: number[]): number {
	const ids = among ?? weights.map((_, i) => i);
	return ids.reduce((best, i) => (weights[i] > weights[best] ? i : best), ids[0]);
}

/** Within `radius` of an example (its weight ≥ 1 − radius), jump onto it. */
export function snap(weights: Weights, radius: number, among?: number[]): Weights {
	if (radius <= 0) return weights;
	const k = nearestExample(weights, among);
	return weights[k] >= 1 - radius ? vertexWeights(weights.length, k) : weights;
}

/**
 * One step of a damped spring pulling the weights toward `target`. The velocity starts at zero
 * and every step adds a multiple of (target − weights), whose entries sum to zero, so the
 * weights keep summing to 1 all the way. A stiff spring with little friction overshoots the
 * target and wobbles: squash and stretch for free.
 */
export function springStep(
	weights: Weights,
	velocity: Weights,
	target: Weights,
	stiffness: number,
	friction: number,
	dt: number,
): { weights: Weights; velocity: Weights } {
	const v = velocity.map((x, i) => x + (stiffness * (target[i] - weights[i]) - friction * x) * dt);
	return { weights: weights.map((w, i) => w + v[i] * dt), velocity: v };
}

export function settled(weights: Weights, velocity: Weights, target: Weights, tolerance = 1e-4): boolean {
	return weights.every((w, i) => Math.abs(w - target[i]) < tolerance && Math.abs(velocity[i]) < tolerance);
}

/**
 * Inertia: after a flick the handle keeps moving at its release velocity, slowing
 * exponentially. Feed the new position to the walker as the target, so a flicked walk cycle
 * keeps walking.
 */
export function coast(
	position: number[],
	velocity: number[],
	friction: number,
	dt: number,
): { position: number[]; velocity: number[] } {
	const decay = Math.exp(-friction * dt);
	return {
		position: position.map((p, i) => p + velocity[i] * dt),
		velocity: velocity.map((v) => v * decay),
	};
}

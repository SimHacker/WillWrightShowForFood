/**
 * Lesson: Motion, skeleton, skin.
 *
 *     clip motion          graphic skeleton            graphic skin
 *     time → state    ──▶  state → configuration  ──▶  configuration → picture
 *     (a recorded drag)    (drive: one character's      (the renderer: strokes,
 *                           examples)                    fills, a mesh)
 *
 * Tom splits an animation into three parts you can swap independently. Record a motion on one
 * character and it's just weights over time, keyed by example names. Any character whose
 * examples have the same names can play it: same state space, different drawings. A character
 * with extra examples the motion never names still works; those examples get weight zero.
 */

import type { Weights } from "./barycentric.js";
import { mix } from "./lerp.js";

export interface Frame {
	time: number;
	weights: Weights;
}

/** A clip motion: weights over time, over named examples. */
export interface Motion {
	ids: string[];
	frames: Frame[];
}

export function record(motion: Motion, time: number, weights: Weights): Motion {
	return { ids: motion.ids, frames: [...motion.frames, { time, weights: [...weights] }] };
}

export function duration(motion: Motion): number {
	const f = motion.frames;
	return f.length ? f[f.length - 1].time - f[0].time : 0;
}

/** The state at `time` since the start of the motion, blending the frames either side. */
export function sample(motion: Motion, time: number): Weights {
	const f = motion.frames;
	if (!f.length) throw new Error("an empty motion has no state");
	const t = f[0].time + Math.max(0, Math.min(time, duration(motion)));
	let k = 0;
	while (k + 1 < f.length && f[k + 1].time < t) k++;
	const a = f[k];
	const b = f[Math.min(k + 1, f.length - 1)];
	return b.time > a.time ? mix(a.weights, b.weights, (t - a.time) / (b.time - a.time)) : a.weights;
}

/**
 * Paste: carry weights from one character's examples to another's, by name. Names the target
 * lacks are dropped (and the rest rescaled); names only the target has get zero.
 */
export function retarget(weights: Weights, fromIds: string[], toIds: string[]): Weights {
	const out = toIds.map((id) => {
		const i = fromIds.indexOf(id);
		return i < 0 ? 0 : weights[i];
	});
	const sum = out.reduce((s, w) => s + w, 0);
	return Math.abs(sum) > 1e-12 ? out.map((w) => w / sum) : out;
}

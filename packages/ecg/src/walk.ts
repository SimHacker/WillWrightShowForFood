/**
 * Lesson: Walking the complex. Everything so far, in one drag.
 *
 *     solve in this zone ──▶ every weight ≥ 0?  ──yes──▶ done
 *             ▲                    │ no
 *             │                    ▼
 *             │        move to where the first weight hits zero
 *             │                    │
 *             │      a zone across that face? ──no──▶ wall: drop the vertex, slide
 *             │                    │ yes
 *             └──── step in (via point, place its examples), keep going
 *
 * The walk is incremental: each frame starts from where the last one ended and heads for the
 * cursor. Inside a zone that is exact, because the zone is linear; across zones the path
 * matters, because which zone you're in depends on how you got there. That is the point of a
 * walk cycle: drag forward twice and you've taken two steps, not one.
 *
 * Two feel knobs live here because they change where the walls are:
 *
 *     overshoot   a wall with nothing across lets weights go this far below zero
 *                 (squash and stretch; feel.ts springs it back on release)
 *     sticky      a face with a zone across holds the state until the drag pushes
 *                 this far past it (a little detent between expressions)
 *
 * When the state rests on a face shared with other zones (often a single example: a vertex
 * where several edges meet) and the cursor is still out of reach, the walker tries each zone
 * that contains that face and steps into one that gets closer. That's how a figure standing in
 * one pose can start walking in either direction.
 */

import type { Configuration } from "./lerp.js";
import { vertexWeights, type Weights } from "./barycentric.js";
import { drive } from "./drive.js";
import { tugOnce, type Target } from "./tug.js";
import { tug as tugWithWalls } from "./walls.js";
import { sameFace, support, zonesAcross, type Chooser, type Zone } from "./complex.js";
import { placedExamples, register, type EdgeTransforms, type Placements } from "./transforms.js";

export interface State {
	zone: number;
	/** Over every example in the model; zero outside the zone. */
	weights: Weights;
	placements: Placements;
}

export interface Model {
	examples: Configuration[];
	zones: Zone[];
	edges: EdgeTransforms;
}

export interface WalkOptions {
	damping?: number;
	chooser?: Chooser;
	overshoot?: number;
	sticky?: number;
	maxSteps?: number;
}

export interface Candidate {
	zone: number;
	score: number;
}

export interface Crossing {
	from: number;
	to: number;
	face: number[];
	candidates: Candidate[];
}

export interface WalkResult {
	state: State;
	walls: number[];
	crossings: Crossing[];
	/** How far the handles still are from their targets. */
	residual: number;
	/** The Jacobian's shape in the last solve: target rows × free weights. */
	rows: number;
	cols: number;
}

export function startState(model: Model, example = 0): State {
	const zone = Math.max(0, model.zones.findIndex((z) => z.includes(example)));
	const placements = register(model.examples.map(() => null), model.zones[zone], [], model.edges);
	return { zone, weights: vertexWeights(model.examples.length, example), placements };
}

/** The drawing for a state: place the zone's examples, then drive. */
export function configurationOf(model: Model, state: State): Configuration {
	return drive(placedExamples(model.examples, state.placements), state.weights);
}

export function residualOf(configuration: Configuration, targets: Target[]): number {
	let s = 0;
	for (const t of targets) {
		const e = (t.importance ?? 1) * (t.value - configuration[t.row]);
		s += e * e;
	}
	return Math.sqrt(s);
}

const mask = (n: number, zone: Zone) => Array.from({ length: n }, (_, i) => zone.includes(i));

/** Try the drag inside one zone, walls only: what a candidate zone would do. */
function trial(model: Model, state: State, zone: number, face: number[], targets: Target[], damping: number) {
	const placements = register(state.placements, model.zones[zone], face, model.edges);
	const placed = placedExamples(model.examples, placements);
	const { weights } = tugWithWalls(placed, state.weights, targets, damping, mask(placed.length, model.zones[zone]));
	const configuration = drive(placed, weights);
	return { placements, weights, configuration, residual: residualOf(configuration, targets) };
}

function score(
	model: Model,
	state: State,
	zone: number,
	face: number[],
	targets: Target[],
	damping: number,
	chooser: Chooser,
): number {
	const t = trial(model, state, zone, face, targets, damping);
	if (chooser === "state") return t.weights.reduce((s, w, i) => s + Math.abs(w - state.weights[i]), 0);
	const held = new Set(targets.map((x) => x.row));
	const before = configurationOf(model, state);
	let s = 0;
	before.forEach((v, row) => {
		if (!held.has(row)) s += (t.configuration[row] - v) ** 2;
	});
	return Math.sqrt(s);
}

export function walk(model: Model, from: State, targets: Target[], options: WalkOptions = {}): WalkResult {
	const { damping = 0, chooser = "state", overshoot = 0, sticky = 0, maxSteps = 64 } = options;
	const n = model.examples.length;
	let state: State = { ...from, weights: [...from.weights] };
	const crossings: Crossing[] = [];
	let walls: number[] = [];
	let rows = targets.length;
	let cols = 0;
	let last: { from: number; face: number[] } | null = null;

	const across = (face: number[]) =>
		zonesAcross(model.zones, face, state.zone).filter(
			(z) => !(last && z === last.from && sameFace(face, last.face)),
		);

	const enter = (to: number, face: number[], candidates: Candidate[]) => {
		crossings.push({ from: state.zone, to, face, candidates });
		last = { from: state.zone, face };
		state = {
			zone: to,
			weights: state.weights,
			placements: register(state.placements, model.zones[to], face, model.edges),
		};
		walls = [];
	};

	const choose = (cands: number[], face: number[]) => {
		const scored = cands.map((z) => ({ zone: z, score: score(model, state, z, face, targets, damping, chooser) }));
		scored.sort((a, b) => a.score - b.score);
		return scored;
	};

	outer: for (let step = 0; step < maxSteps; step++) {
		const zone = model.zones[state.zone];
		const placed = placedExamples(model.examples, state.placements);
		const active = mask(n, zone);
		walls = [];
		let held = false;

		for (;;) {
			const free = active.filter(Boolean).length;
			cols = free - 1;
			if (free === 1) break;
			const w = tugOnce(placed, state.weights, targets, damping, active, true);

			let first = -1;
			let firstT = Infinity;
			let firstLevel = 0;
			let firstCross: number[] = [];
			let firstHeld = false;
			for (let i = 0; i < n; i++) {
				if (!active[i] || w[i] >= 0) continue;
				const face = zone.filter((k) => active[k] && k !== i);
				const cands = across(face);
				const crosses = cands.length > 0 && w[i] < -sticky;
				const level = crosses || cands.length > 0 ? 0 : -overshoot;
				if (w[i] >= level) continue;
				const t = Math.max(0, (state.weights[i] - level) / (state.weights[i] - w[i]));
				if (t < firstT) {
					first = i;
					firstT = t;
					firstLevel = level;
					firstCross = crosses ? cands : [];
					firstHeld = cands.length > 0 && !crosses;
				}
			}

			if (first < 0) {
				state.weights = w;
				break;
			}
			state.weights = state.weights.map((x, i) => (active[i] ? x + firstT * (w[i] - x) : x));
			state.weights[first] = firstLevel;

			if (firstCross.length) {
				const face = zone.filter((k) => active[k] && k !== first);
				const ranked = choose(firstCross, face);
				enter(ranked[0].zone, face, ranked);
				continue outer;
			}
			held ||= firstHeld;
			active[first] = false;
			walls.push(first);
		}

		// Resting on a face shared with other zones, still short of the target: try them.
		// Not when a sticky face is what's holding the state back.
		const here = residualOf(drive(placed, state.weights), targets);
		if (here < 1e-9 || held) break;
		const face = support(state.weights, zone);
		const cands = across(face);
		if (!cands.length) break;
		const tries = cands
			.map((z) => ({ zone: z, residual: trial(model, state, z, face, targets, damping).residual }))
			.filter((t) => t.residual < here * (1 - 1e-6) - 1e-9)
			.sort((a, b) => a.residual - b.residual);
		if (!tries.length) break;
		enter(
			tries[0].zone,
			face,
			tries.map((t) => ({ zone: t.zone, score: t.residual })),
		);
	}

	const configuration = configurationOf(model, state);
	return { state, walls, crossings, residual: residualOf(configuration, targets), rows, cols };
}

/**
 * Worked examples for every lesson, with numbers small enough to check by hand.
 *
 * The running example: one point, three examples on a right triangle.
 *
 *     C (0,10)
 *     │ \
 *     │   \
 *     A────B (10,0)
 *    (0,0)
 */

import assert from "node:assert/strict";
import { gluedFace, nearestOnSheet, oppositeFace, pullWeight, sheetsOf, stateOnSheet, tetraPoint, tetraWeights } from "./map.js";
import { test } from "node:test";
import {
	barycentric2D,
	drive,
	isInSimplex,
	mix,
	pointTargets,
	solve,
	tug,
	tugOnce,
	vertexWeights,
	walk,
	startState,
	configurationOf,
	translation,
	rotation,
	compose,
	invert,
	place,
	snap,
	springStep,
	coast,
	mixColors,
	retarget,
	record,
	sample,
	loadModel,
	type Model,
	type Motion,
} from "./index.js";

const A = [0, 0];
const B = [10, 0];
const C = [0, 10];
const close = (a: number[], b: number[], eps = 1e-6) =>
	assert.ok(a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < eps), `${a} ≈ ${b}`);

test("blend two pictures: a quarter of the way from A to (10, 20)", () => {
	close(mix([0, 0], [10, 20], 0.25), [2.5, 5]);
});

test("three pictures and a triangle: the centroid is a third of each corner", () => {
	close(barycentric2D([1, 1], [0, 0], [3, 0], [0, 3]), [1 / 3, 1 / 3, 1 / 3]);
	assert.ok(isInSimplex([0.5, 0.3, 0.2]));
	assert.ok(!isInSimplex([1.2, -0.5, 0.3]));
});

test("driving: half A, a quarter each of B and C", () => {
	close(drive([A, B, C], [0.5, 0.25, 0.25]), [2.5, 2.5]);
});

test("the pseudo-inverse, by hand: solve a 2×2 system", () => {
	close(solve([[2, 1], [1, 3]], [3, 5]), [0.8, 1.4]);
});

test("tugging: drag the point to (2, 3) from A: barycentric coordinates in reverse", () => {
	const w = tugOnce([A, B, C], vertexWeights(3, 0), pointTargets(0, 2, 3), 0);
	close(w, [0.5, 0.2, 0.3]);
	close(drive([A, B, C], w), [2, 3]);
});

test("tugging: one handle in a tetrahedron still lands exactly", () => {
	const D = [10, 10];
	const w = tugOnce([A, B, C, D], vertexWeights(4, 0), pointTargets(0, 4, 3), 1e-6);
	close(drive([A, B, C, D], w), [4, 3], 1e-4);
});

test("hitting walls: drag past edge AC to (-5, 3) and slide along it", () => {
	const free = tugOnce([A, B, C], vertexWeights(3, 0), pointTargets(0, -5, 3), 0);
	close(free, [1.2, -0.5, 0.3]);
	const { weights, walls } = tug([A, B, C], vertexWeights(3, 0), pointTargets(0, -5, 3), 0);
	close(weights, [0.7, 0, 0.3]);
	assert.deepEqual(walls, [1]);
});

test("hitting walls: drag far past corner C and stop there", () => {
	const { weights } = tug([A, B, C], vertexWeights(3, 0), pointTargets(0, -20, 40), 0);
	close(weights, [0, 0, 1]);
});

/*
 * Gluing triangles together. A fourth example D (10, 10) in a second zone, glued along BC:
 *
 *     C ───── D
 *     │ \  2  │
 *     │ 1  \  │
 *     A ───── B
 */
const D = [10, 10];
const square: Model = { examples: [A, B, C, D], zones: [[0, 1, 2], [1, 2, 3]], edges: new Map() };

test("gluing triangles together: drag from A to (8, 8), across BC into BCD", () => {
	const r = walk(square, startState(square, 0), pointTargets(0, 8, 8));
	assert.equal(r.state.zone, 1);
	close(r.state.weights, [0, 0.2, 0.2, 0.6]);
	assert.deepEqual(r.crossings.map((c) => c.face.sort()), [[1, 2]]);
});

test("gluing triangles together: the far wall still stops the state, at D", () => {
	const r = walk(square, startState(square, 0), pointTargets(0, 20, 20));
	close(r.state.weights, [0, 0, 0, 1]);
});

test("gluing triangles together: and back to (2, 3), in the first zone again", () => {
	const there = walk(square, startState(square, 0), pointTargets(0, 8, 8)).state;
	const r = walk(square, there, pointTargets(0, 2, 3));
	assert.equal(r.state.zone, 0);
	close(r.state.weights, [0.5, 0.2, 0.3, 0]);
});

test("gluing triangles together: three zones on one edge, the chooser picks least state movement", () => {
	// C above AB; D and E below it, both containing the target (5, -5).
	const fan: Model = {
		examples: [A, B, [5, 10], [5, -10], [5, -20]],
		zones: [[0, 1, 2], [0, 1, 3], [0, 1, 4]],
		edges: new Map(),
	};
	const r = walk(fan, startState(fan, 2), pointTargets(0, 5, -5), { chooser: "state" });
	assert.equal(r.crossings[0].candidates.length, 2);
	assert.equal(r.state.zone, 2);
	close(r.state.weights, [0.375, 0.375, 0, 0, 0.25]);
});

test("gluing triangles together: standing at a vertex, step into whichever edge gets closer", () => {
	const loop: Model = { examples: [A, B, C], zones: [[0, 1], [1, 2], [2, 0]], edges: new Map() };
	const r = walk(loop, startState(loop, 0), pointTargets(0, 0, 4));
	assert.equal(r.state.zone, 2);
	close(r.state.weights, [0.6, 0, 0.4]);
});

/*
 * Transformations. Three poses of one point on a line, in a loop of edges, and the edge C→A
 * carries "one stride (3) to the right": A, B, C, A', B', C' sit at 0, 1, 2, 3, 4, 5, …
 */
const stride: Model = {
	examples: [[0, 0], [1, 0], [2, 0]],
	zones: [[0, 1], [1, 2], [2, 0]],
	edges: new Map([["2>0", { affine: translation(3, 0) }]]),
};

test("transformations: drag to 4.5 and the point walks A B C A' B', halfway to C'", () => {
	const r = walk(stride, startState(stride, 0), pointTargets(0, 4.5, 0));
	close(configurationOf(stride, r.state), [4.5, 0]);
	assert.equal(r.state.zone, 1);
	close(r.state.weights, [0, 0.5, 0.5]);
});

test("transformations: walking back undoes the stride, and keeps going backwards", () => {
	const there = walk(stride, startState(stride, 0), pointTargets(0, 4.5, 0)).state;
	const r = walk(stride, there, pointTargets(0, -1.5, 0));
	close(configurationOf(stride, r.state), [-1.5, 0]);
	assert.ok(r.residual < 1e-6);
});

test("transformations: a box rolls over twice; each roll renames the corners", () => {
	// Corners BL, BR, TR, TL. Tilts pivot on the bottom-right corner. After a quarter roll
	// the old top-left is the new bottom-left (and so on), one box-width along.
	const box = [0, 0, 1, 0, 1, 1, 0, 1];
	const tilt = (deg: number) => place(rotation(deg, 1, 0), box);
	const roll: Model = {
		examples: [box, tilt(-30), tilt(-60)],
		zones: [[0, 1], [1, 2], [2, 0]],
		edges: new Map([["2>0", { affine: translation(1, 0), permute: [3, 0, 1, 2] }]]),
	};
	// Push the top-left corner along to x = 2.6. The first roll ends with it at (2, 1); the
	// second pivots on (2, 0), on the corner now called top-right.
	let s = startState(roll, 0);
	for (let x = 0; x <= 2.6; x += 0.05) s = walk(roll, s, pointTargets(3, x, 1)).state;
	const c = configurationOf(roll, s);
	for (let p = 0; p < 4; p++) assert.ok(c[2 * p + 1] > -1e-6, `corner ${p} stays above the ground`);
	close([c[4], c[5]], [2, 0], 1e-6);
	assert.ok(c[6] > 2.3, "the pushed corner kept going");
});

test("transformations: turning about a corner, the old way, keeps the old pivot", () => {
	const box = [0, 0, 1, 0, 1, 1, 0, 1];
	close(place(rotation(-90, 1, 0), box), [1, 1, 1, 0, 2, 0, 2, 1]);
});

test("transformations: compose, invert and rotate agree", () => {
	const m = compose(translation(2, 3), rotation(90));
	close(place(m, [1, 0]), [2, 4]);
	close(place(compose(invert(m), m), [5, 7]), [5, 7]);
});

test("feel: snap onto an example when close, not when far", () => {
	close(snap([0.97, 0.02, 0.01], 0.05), [1, 0, 0]);
	close(snap([0.9, 0.05, 0.05], 0.05), [0.9, 0.05, 0.05]);
});

test("feel: a spring eases back to the example and the weights keep summing to 1", () => {
	let s = { weights: [0.2, 0.5, 0.3], velocity: [0, 0, 0] };
	for (let i = 0; i < 600; i++) {
		s = springStep(s.weights, s.velocity, [1, 0, 0], 120, 18, 1 / 60);
		assert.ok(Math.abs(s.weights.reduce((a, b) => a + b, 0) - 1) < 1e-9);
	}
	close(s.weights, [1, 0, 0], 1e-4);
});

test("feel: overshoot lets the wall give a little, to -0.2", () => {
	const tri: Model = { examples: [A, B, C], zones: [[0, 1, 2]], edges: new Map() };
	const r = walk(tri, startState(tri, 0), pointTargets(0, -5, 3), { overshoot: 0.2 });
	close(r.state.weights, [0.9, -0.2, 0.3]);
	close(configurationOf(tri, r.state), [-2, 3]);
});

test("feel: a sticky face holds until the drag pushes far enough past it", () => {
	const push = pointTargets(0, 5.5, 5.5); // just past BC: unconstrained A = -0.1
	assert.equal(walk(square, startState(square, 0), push, { sticky: 0.2 }).state.zone, 0);
	assert.equal(walk(square, startState(square, 0), push, { sticky: 0.05 }).state.zone, 1);
});

test("feel: inertia coasts and slows", () => {
	const c = coast([0, 0], [10, 0], 2, 0.5);
	close(c.position, [5, 0]);
	close(c.velocity, [10 * Math.exp(-1), 0]);
});

test("colour: blending in OKLab keeps the ends and brightens the middle", () => {
	assert.equal(mixColors(["#ff0000", "#00ff00"], [1, 0]), "#ff0000");
	assert.equal(mixColors(["#ff0000", "#00ff00"], [0, 1]), "#00ff00");
	const mid = mixColors(["#ff0000", "#00ff00"], [0.5, 0.5]);
	const [r, g] = [1, 3].map((i) => parseInt(mid.slice(i, i + 2), 16));
	assert.ok(r > 0x80 && g > 0x80, `${mid} is brighter than raw RGB's #808000`);
	assert.equal(mixColors(["#ff0000", "#00ff00"], [0.5, 0.5], "srgb"), "#808000");
});

test("motion, skeleton, skin: paste by name, extra examples get zero", () => {
	close(retarget([0.5, 0.5], ["neutral", "smile"], ["smile", "wink", "neutral"]), [0.5, 0, 0.5]);
	let m: Motion = { ids: ["a", "b"], frames: [] };
	m = record(m, 10, [1, 0]);
	m = record(m, 12, [0, 1]);
	close(sample(m, 1), [0.5, 0.5]);
	close(sample(m, 99), [0, 1]);
});

test("model files: named points, zones by name, Tom's authoring warnings", () => {
	const loaded = loadModel({
		examples: [
			{ id: "neutral", points: { left: [-20, 10], right: [20, 10] } },
			{ id: "smile", points: { left: [-24, 4], right: [24, 4] } },
			{ id: "frown", points: { left: [-18, 16], right: [18, 16] } },
			{ id: "lost", points: { left: [0, 0], right: [1, 1] } },
		],
		zones: [["neutral", "smile"], ["neutral", "frown"]],
		start: "smile",
	});
	assert.deepEqual(loaded.errors, []);
	assert.deepEqual(loaded.pointNames, ["left", "right"]);
	assert.equal(loaded.start, 1);
	close(loaded.model.examples[1], [-24, 4, 24, 4]);
	assert.ok(loaded.warnings.some((w) => w.includes("example 3")));
	assert.ok(loadModel({ examples: [{ id: "x", points: [[0, 0]] }] }).errors.length > 0);
});

test("maps: glued sheets lie flat, a fork's third page moves over, a tetrahedron reads back", () => {
	const corners: [number, number][] = [[0, 0], [10, 0], [5, 10], [5, -10], [5, -20]];
	const sheets = sheetsOf([[0, 1, 2], [0, 1, 3], [0, 1, 4]], corners, 2);
	close(sheets[1].at.flat(), [0, 0, 10, 0, 5, -10]);
	close(sheets[2].at.flat(), [12, 0, 22, 0, 17, -20]);
	assert.ok(gluedFace(sheets[0], sheets[1], [0, 1]));
	assert.ok(!gluedFace(sheets[0], sheets[2], [0, 1]));
	close(sheetsOf([[0, 1, 2], [0, 1, 3], [0, 1, 4]], corners, 2, "down")[2].at.flat(), [0, 32, 10, 32, 5, 12]);
	const inside = nearestOnSheet(sheets[0], [5, 5]);
	assert.equal(inside.distance, 0);
	close(inside.local, [0.25, 0.25, 0.5]);
	const below = nearestOnSheet(sheets[0], [5, -3]);
	close(below.local, [0.5, 0.5, 0]);
	assert.equal(below.distance, 3);
	close(stateOnSheet(sheets[2], [0.5, 0.5, 0, 0, 0]) ?? [], [17, 0]);
	assert.equal(stateOnSheet(sheets[2], [0.5, 0, 0.5, 0, 0]), null);
	const w = [0.1, 0.2, 0.3, 0.4];
	close(tetraWeights(tetraPoint(w)), w);
	close(tetraWeights([1, 1, 1]), [1, 0, 0, 0]);
	assert.ok(tetraWeights([1, -1, 1]).every((x) => x >= 0));
});

test("weight sliders: the others keep their ratios, and remember them through zero", () => {
	const zone = [0, 1, 2];
	const face = oppositeFace([0.2, 0.2, 0.6], 0, zone);
	close(face, [0, 0.25, 0.75]);
	close(pullWeight(face, 0, 0.6), [0.6, 0.1, 0.3]);
	const top = pullWeight(face, 0, 1);
	close(top, [1, 0, 0]);
	const back = oppositeFace(top, 0, zone, face);
	close(pullWeight(back, 0, 0.2), [0.2, 0.2, 0.6]);
	close(oppositeFace([1, 0, 0], 0, zone), [0, 0.5, 0.5]);
});

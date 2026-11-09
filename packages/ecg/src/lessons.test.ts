/**
 * Worked examples for lessons 0–5, with numbers small enough to check by hand.
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
} from "./index.js";

const A = [0, 0];
const B = [10, 0];
const C = [0, 10];
const close = (a: number[], b: number[], eps = 1e-6) =>
	assert.ok(a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < eps), `${a} ≈ ${b}`);

test("lesson 0: a quarter of the way from A to (10, 20)", () => {
	close(mix([0, 0], [10, 20], 0.25), [2.5, 5]);
});

test("lesson 1: the centroid is a third of each corner", () => {
	close(barycentric2D([1, 1], [0, 0], [3, 0], [0, 3]), [1 / 3, 1 / 3, 1 / 3]);
	assert.ok(isInSimplex([0.5, 0.3, 0.2]));
	assert.ok(!isInSimplex([1.2, -0.5, 0.3]));
});

test("lesson 2: half A, a quarter each of B and C", () => {
	close(drive([A, B, C], [0.5, 0.25, 0.25]), [2.5, 2.5]);
});

test("lesson 4: solve a 2×2 system", () => {
	close(solve([[2, 1], [1, 3]], [3, 5]), [0.8, 1.4]);
});

test("lesson 3: drag the point to (2, 3) from A: barycentric coordinates in reverse", () => {
	const w = tugOnce([A, B, C], vertexWeights(3, 0), pointTargets(0, 2, 3), 0);
	close(w, [0.5, 0.2, 0.3]);
	close(drive([A, B, C], w), [2, 3]);
});

test("lesson 3: one handle in a tetrahedron still lands exactly", () => {
	const D = [10, 10];
	const w = tugOnce([A, B, C, D], vertexWeights(4, 0), pointTargets(0, 4, 3), 1e-6);
	close(drive([A, B, C, D], w), [4, 3], 1e-4);
});

test("lesson 5: drag past edge AC to (-5, 3) and slide along it", () => {
	const free = tugOnce([A, B, C], vertexWeights(3, 0), pointTargets(0, -5, 3), 0);
	close(free, [1.2, -0.5, 0.3]);
	const { weights, walls } = tug([A, B, C], vertexWeights(3, 0), pointTargets(0, -5, 3), 0);
	close(weights, [0.7, 0, 0.3]);
	assert.deepEqual(walls, [1]);
});

test("lesson 5: drag far past corner C and stop there", () => {
	const { weights } = tug([A, B, C], vertexWeights(3, 0), pointTargets(0, -20, 40), 0);
	close(weights, [0, 0, 1]);
});

/**
 * Lesson: Gluing triangles together.
 *
 *          C ─────── D
 *          │ \       │        two zones, ABC and BCD, glued along the edge BC
 *          │   \  2  │
 *          │ 1   \   │        drag from inside ABC toward D: the state reaches BC,
 *          │       \ │        steps into BCD at the same blend of B and C,
 *          A ─────── B        and keeps going
 *
 * One simplex is one zone. A model with more examples than one zone should blend is a
 * **simplicial complex**: zones glued along shared faces. A zone is just a list of example
 * indices; faces are derived from the zones, never declared.
 *
 * When the state reaches a face of its zone, three things can be across it:
 *
 *     nothing           a wall: drop the vertex and slide (walls.ts)
 *     one zone          step in at the **via point**: the same proportions of the shared
 *                       examples, zero for the new one, so the drawing doesn't jump
 *     several zones     choose one. Tom's two suggestions: the zone where the state moves
 *                       least for this drag, or where the handles you aren't holding move least
 *
 * The weights here are always over every example in the model, zero outside the current zone,
 * so the via point needs no arithmetic at all: the new example already has weight zero.
 */

import type { Weights } from "./barycentric.js";

/** A zone is a simplex: the indices of the examples it blends. */
export type Zone = number[];

export const sameFace = (a: number[], b: number[]) =>
	a.length === b.length && a.every((x) => b.includes(x));

export const contains = (zone: Zone, face: number[]) => face.every((i) => zone.includes(i));

/** Every zone containing the face, except `except`. Faces of any size: an edge, a vertex. */
export function zonesAcross(zones: Zone[], face: number[], except: number): number[] {
	return zones.map((_, z) => z).filter((z) => z !== except && contains(zones[z], face));
}

/** Tom's via point: keep the shared examples' proportions, zero for the rest. */
export function viaPoint(weights: Weights, face: number[]): Weights {
	const sum = face.reduce((s, i) => s + weights[i], 0);
	return weights.map((_, i) => (face.includes(i) ? weights[i] / sum : 0));
}

/** The examples carrying weight: the smallest face of the zone the state is on. */
export function support(weights: Weights, zone: Zone, epsilon = 1e-9): number[] {
	return zone.filter((i) => weights[i] > epsilon);
}

/**
 * Tom's authoring rules, as warnings: every example belongs to some zone, and the complex is
 * connected (you can walk from any zone to any other through shared faces, a vertex is enough).
 */
export function checkComplex(exampleCount: number, zones: Zone[]): string[] {
	const warnings: string[] = [];
	for (let i = 0; i < exampleCount; i++) {
		if (!zones.some((z) => z.includes(i))) warnings.push(`example ${i} is in no zone, so no drag can reach it`);
	}
	zones.forEach((z, k) => {
		if (z.length < 1) warnings.push(`zone ${k} is empty`);
		if (new Set(z).size !== z.length) warnings.push(`zone ${k} lists an example twice`);
	});
	if (zones.length > 1) {
		const reached = new Set([0]);
		for (let grew = true; grew; ) {
			grew = false;
			zones.forEach((z, k) => {
				if (reached.has(k)) return;
				if ([...reached].some((r) => zones[r].some((i) => z.includes(i)))) {
					reached.add(k);
					grew = true;
				}
			});
		}
		if (reached.size < zones.length) warnings.push("the complex is in pieces: some zones share nothing with the rest");
	}
	return warnings;
}

/** Tom's two rules for picking among several zones across a face. */
export type Chooser = "state" | "unheld";

/**
 * Model files: a character as plain data, written by hand or drafted by an LLM.
 *
 *     examples:
 *       - { id: neutral, points: { left: [-20, 10], right: [20, 10] } }
 *       - { id: smile,   points: { left: [-24, 4],  right: [24, 4] }, fill: "#ffd23f" }
 *     zones: [[neutral, smile, surprise], [neutral, surprise, frown]]    default: one zone
 *     edges:
 *       - { from: C, to: A, translate: [6, 0] }                          a walk cycle
 *       - { from: C, to: A, rotate: -90, about: [1, 0] }                 a turn
 *       - { from: C, to: A, translate: [1, 0], permute: [3, 0, 1, 2] }   a roll: shift, rename
 *     start: neutral
 *
 * Points are a list ([[x, y], ...]) or named ({ mouth_left: [x, y] }); named points must use
 * the same names in every example. This file takes the parsed object, not YAML text, so the
 * engine needs no parser; the caller brings one.
 */

import { checkComplex, type Zone } from "./complex.js";
import { compose, rotation, translation, type Affine, type EdgeTransforms } from "./transforms.js";
import type { Model } from "./walk.js";

export interface ExampleSpec {
	id: string;
	label?: string;
	points: [number, number][] | Record<string, [number, number]>;
	fill?: string;
}

export interface EdgeSpec {
	from: string;
	to: string;
	translate?: [number, number];
	rotate?: number;
	about?: [number, number];
	/** Point i after the edge is point permute[i] before it (indices or point names). */
	permute?: (number | string)[];
}

export interface ModelSpec {
	examples: ExampleSpec[];
	zones?: string[][];
	edges?: EdgeSpec[];
	start?: string;
}

export interface LoadedModel {
	model: Model;
	ids: string[];
	labels: string[];
	/** Point names, or their indices as strings. */
	pointNames: string[];
	fills: (string | null)[];
	start: number;
	errors: string[];
	warnings: string[];
}

const isPair = (p: unknown): p is [number, number] =>
	Array.isArray(p) && p.length === 2 && p.every((x) => typeof x === "number" && Number.isFinite(x));

export function loadModel(spec: ModelSpec): LoadedModel {
	const errors: string[] = [];
	const examples = Array.isArray(spec?.examples) ? spec.examples : [];
	if (examples.length < 2) errors.push("a model needs at least two examples");
	const ids = examples.map((e, i) => String(e?.id ?? i));
	const dup = ids.find((id, i) => ids.indexOf(id) !== i);
	if (dup) errors.push(`two examples are called ${dup}`);

	const first = examples[0]?.points;
	const pointNames = Array.isArray(first) ? first.map((_, i) => String(i)) : Object.keys(first ?? {});
	const configs = examples.map((e) => {
		const pts = e?.points;
		const list = Array.isArray(pts) ? pts : pointNames.map((name) => (pts as Record<string, [number, number]>)?.[name]);
		if (list.length !== pointNames.length || (!Array.isArray(pts) && Object.keys(pts ?? {}).length !== pointNames.length)) {
			errors.push(`${e?.id} has ${list.length} points, not ${pointNames.length}`);
		}
		const bad = list.findIndex((p) => !isPair(p));
		if (bad >= 0 && list.length) errors.push(`${e?.id}: point ${pointNames[bad] ?? bad} is not [x, y]`);
		return list.flatMap((p) => (isPair(p) ? p : [0, 0]));
	});

	const index = (id: string, where: string) => {
		const i = ids.indexOf(String(id));
		if (i < 0) errors.push(`${where} names ${id}, which is not an example`);
		return i;
	};
	const zones: Zone[] = Array.isArray(spec?.zones) && spec.zones.length
		? spec.zones.map((z, k) => (Array.isArray(z) ? z.map((id) => index(id, `zone ${k}`)).filter((i) => i >= 0) : []))
		: [ids.map((_, i) => i)];

	const edges: EdgeTransforms = new Map();
	for (const e of spec?.edges ?? []) {
		const a = index(e.from, "an edge");
		const b = index(e.to, "an edge");
		if (a < 0 || b < 0) continue;
		if (!zones.some((z) => z.includes(a) && z.includes(b))) errors.push(`no zone contains the edge ${e.from}–${e.to}`);
		let m: Affine = rotation(e.rotate ?? 0, ...(e.about ?? [0, 0]));
		if (e.translate) m = compose(translation(...e.translate), m);
		let permute: number[] | undefined;
		if (Array.isArray(e.permute)) {
			permute = e.permute.map((p) => (typeof p === "number" ? p : pointNames.indexOf(String(p))));
			const ok = permute.length === pointNames.length && new Set(permute).size === permute.length && permute.every((p) => p >= 0 && p < pointNames.length);
			if (!ok) errors.push(`the edge ${e.from}–${e.to} must rename every point exactly once`);
		}
		edges.set(`${a}>${b}`, permute ? { affine: m, permute } : { affine: m });
	}

	const start = spec?.start === undefined ? 0 : Math.max(0, ids.indexOf(String(spec.start)));
	return {
		model: { examples: configs, zones, edges },
		ids,
		labels: examples.map((e, i) => e?.label ?? ids[i]),
		pointNames,
		fills: examples.map((e) => (typeof e?.fill === "string" ? e.fill : null)),
		start,
		errors,
		warnings: errors.length ? [] : checkComplex(ids.length, zones),
	};
}

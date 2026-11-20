import { CpuHost, type Rung } from "./cpu.js";
import type { Dim, SlotSpec } from "./korz.js";

/**
 * Cellular automata as a Korz sea. The dimensions are the center cell, the
 * neighbor bits, and a count derived from those bits. The stepper fills the
 * count when it builds the context. The resolver's table for `cell` is the
 * rule table.
 *
 * Life is B3/S23. A rule that cares which neighbor is alive guards `nb`.
 * Bit 0 is northwest, then north, northeast, west, east, southwest, south,
 * southeast. `CAM6.js` remains the byte-for-byte oracle for a rule written in
 * CAM-6's neighborhood encoding. This file checks Life against B3/S23.
 */

export const LIFE_DIMS: readonly Dim[] = [
	{ name: "center", width: 1 },
	{ name: "nb", width: 8 },
	{ name: "n", width: 4 },
];

export type LifeCtx = { center: number; nb: number; n: number };

/** Northwest around to southeast, skipping the center. */
export const MOORE: readonly (readonly [number, number])[] = [
	[-1, -1], [-1, 0], [-1, 1],
	[0, -1], [0, 1],
	[1, -1], [1, 0], [1, 1],
];

export const LIFE_SLOTS: readonly SlotSpec<LifeCtx>[] = [
	{ selector: "cell", by: "otherwise dead", run: () => 0 },
	{ selector: "cell", guard: { center: 1, n: [2, 3] }, by: "S23: a live cell with two or three neighbors stays", run: () => 1 },
	{ selector: "cell", guard: { center: 0, n: 3 }, by: "B3: a dead cell with three neighbors is born", run: () => 1 },
];

export function lifeHost(rung?: Rung): CpuHost<LifeCtx, "cell", "cell"> {
	return new CpuHost({
		dims: LIFE_DIMS,
		selectors: ["cell"],
		slots: LIFE_SLOTS,
		context: () => ({ center: 0, nb: 0, n: 0 }),
		nests: ["cell"],
		rung,
	});
}

/** One generation on a torus. `cells` is row-major, 0 or 1. */
export function lifeGeneration(host: CpuHost<LifeCtx, "cell", "cell">, w: number, h: number, cells: Uint8Array): Uint8Array {
	const next = new Uint8Array(cells.length);
	const c = host.nest.cell;
	const at = (x: number, y: number) => cells[((y % h) + h) % h * w + ((x % w) + w) % w] ?? 0;
	for (let y = 0; y < h; y += 1) {
		for (let x = 0; x < w; x += 1) {
			let nb = 0;
			let n = 0;
			for (let i = 0; i < MOORE.length; i += 1) {
				const bit = at(x + MOORE[i]![1], y + MOORE[i]![0]) & 1;
				nb |= bit << i;
				n += bit;
			}
			c.center = at(x, y) & 1;
			c.nb = nb;
			c.n = n;
			next[y * w + x] = host.go.cell(c) & 1;
		}
	}
	return next;
}

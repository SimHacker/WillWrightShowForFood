import type { PenInput } from "./type340.js";

export type LightPenOpts = {
	aperture?: number;
	name?: string;
	enabled?: boolean;
};

/**
 * One pen — an input adapter, not a Device. The pen IOTs (IDSP/IDRC, dev
 * 07) live on the Type340, where the hardware put them; a pen itself is
 * just a photocell with a position. Register any number of these in
 * Type340's `pens`: sim-Heinz's hand and the user's mouse are two pens on
 * the same tube.
 */
export class LightPen implements PenInput {
	enabled: boolean;
	x = 0;
	y = 0;
	aperture: number;
	name: string | undefined;

	constructor(opts: LightPenOpts = {}) {
		this.aperture = opts.aperture ?? 8;
		this.name = opts.name;
		this.enabled = opts.enabled ?? true;
	}

	/** Host input: pointer/pen-tip position in 340 grid coordinates. */
	point(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}
}

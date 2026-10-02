import type { PenInput } from "./type340.js";

/** Default pen hues, by pen number; host overlay only, the 340 never sees them. */
export const PEN_COLORS = [
	"#ffd27a", // 0 amber yellow
	"#7ad8ff", // 1 cyan
	"#ff7ad2", // 2 magenta
	"#ff9a5a", // 3 orange
	"#b08aff", // 4 violet
	"#ff6b6b", // 5 red
	"#6b8cff", // 6 blue
	"#f0f0f0", // 7 white
] as const;

export type LightPenOpts = {
	aperture?: number;
	name?: string;
	enabled?: boolean;
	/** Pen number; picks the default color. */
	index?: number;
	color?: string;
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
	color: string;

	constructor(opts: LightPenOpts = {}) {
		this.aperture = opts.aperture ?? 8;
		this.name = opts.name;
		this.color = opts.color ?? PEN_COLORS[(opts.index ?? 0) % PEN_COLORS.length] ?? PEN_COLORS[0];
		this.enabled = opts.enabled ?? true;
	}

	/** Host input: pointer/pen-tip position in 340 grid coordinates. */
	point(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}
}

import type { Device, Iot, IotReply } from "../bus.js";
import type { Segment, Type340 } from "./type340.js";

export type LightPenOpts = {
	display: Type340;
	aperture?: number;
};

/**
 * The pen sees a beam, not a pixel.
 * In software that is a hit-test on the segments just drawn.
 * Type 370 IOTs (skip/clear flag) come when PIXIE points. The flag is here now.
 */
export class LightPen implements Device {
	readonly name = "lightpen";
	readonly iots = [0o11];
	x = 0;
	y = 0;
	aperture: number;
	flag = false;
	private readonly display: Type340;

	constructor(opts: LightPenOpts) {
		this.display = opts.display;
		this.aperture = opts.aperture ?? 8;
	}

	point(x: number, y: number): void {
		this.x = x;
		this.y = y;
		this.flag = hit(this.display.segments, x, y, this.aperture);
	}

	iot(req: Iot): IotReply {
		if ((req.pulse & 1) === 1) this.flag = false;
		return { ac: req.ac, skip: this.flag };
	}
}

export function hit(
	segments: readonly Segment[],
	x: number,
	y: number,
	aperture: number,
): boolean {
	const r2 = aperture * aperture;
	for (const s of segments) {
		if (!s.intensify) continue;
		if (dist2(x, y, s.x0, s.y0, s.x1, s.y1) <= r2) return true;
	}
	return false;
}

function dist2(px: number, py: number, x0: number, y0: number, x1: number, y1: number): number {
	const dx = x1 - x0;
	const dy = y1 - y0;
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) {
		const ex = px - x0;
		const ey = py - y0;
		return ex * ex + ey * ey;
	}
	let t = ((px - x0) * dx + (py - y0) * dy) / len2;
	if (t < 0) t = 0;
	else if (t > 1) t = 1;
	const hx = px - (x0 + t * dx);
	const hy = py - (y0 + t * dy);
	return hx * hx + hy * hy;
}

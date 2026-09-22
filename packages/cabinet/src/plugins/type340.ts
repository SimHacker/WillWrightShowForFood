import type { Device, Iot, IotReply } from "../bus.js";

export type Segment = {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	intensify: boolean;
};

/**
 * The picture, not the tube.
 * A canvas / WebGPU / dump consumes `segments`. This device does not draw.
 * Full 340 DMA and Type 342 characters are later. Hand-push segments for now.
 */
export class Type340 implements Device {
	readonly name = "type340";
	/** DEC 340 IOT block — claimed so the CPU does not no-op them silently later. */
	readonly iots = [0o05, 0o06, 0o07, 0o10];
	segments: Segment[] = [];

	iot(req: Iot): IotReply {
		return { ac: req.ac };
	}

	clear(): void {
		this.segments = [];
	}

	/** Test / host hook until the 340 executes display words from core. */
	vector(x0: number, y0: number, x1: number, y1: number): void {
		this.segments.push({ x0, y0, x1, y1, intensify: true });
	}

	stroke(ctx: StrokeTarget, segments: readonly Segment[] = this.segments): void {
		for (const s of segments) {
			if (!s.intensify) continue;
			ctx.beginPath();
			ctx.moveTo(s.x0, s.y0);
			ctx.lineTo(s.x1, s.y1);
			ctx.stroke();
		}
	}
}

/** CanvasRenderingContext2D, or anything with the same three calls. Node-safe. */
export type StrokeTarget = {
	beginPath(): void;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	stroke(): void;
};

import type { RingImage } from "./image.js";
import { changedCells, ringToScene } from "./scene.js";
import type { Scene } from "./scene.js";
import { DEFAULT_CAMERA, drawList, paint } from "./view.js";
import type { Camera, Mark, Pen } from "./view.js";

/**
 * The rings beside the characters. This is shaped like a holodeck
 * plugin in the character renderer (id, layer, render, measure, dispose)
 * without importing it: the people draw in WebGPU, the rings draw on
 * a 2D overlay above them, at the world-feedback layer, so a character
 * giving a talk can stand in front of the data structure it explains
 * and point at a cell by address.
 */
export const WORLD_FEEDBACK = 70;

export type RingSource = () => RingImage | null;

export type RingsPlugin = {
	id: string;
	layer: number;
	enabled: boolean;
	camera: Camera;
	scene: Scene | null;
	render(ctx: { time: number }): void;
	/** Where a cell is on screen: what a character walks to and points at. */
	measure(query: { objectId?: string }): { x: number; y: number; w: number; h: number } | null;
	dispose(): void;
};

export function ringsPlugin(opts: {
	source: RingSource;
	pen: () => (Pen & { canvas?: { width: number; height: number } }) | null;
	camera?: Camera;
	/** Radians a second; 0 holds still. */
	spin?: number;
}): RingsPlugin {
	let last: RingImage | null = null;
	let marks: Mark[] = [];
	let then = 0;
	const plugin: RingsPlugin = {
		id: "pixie-rings",
		layer: WORLD_FEEDBACK,
		enabled: true,
		camera: { ...(opts.camera ?? DEFAULT_CAMERA) },
		scene: null,
		render({ time }) {
			const pen = opts.pen();
			if (!plugin.enabled || !pen?.canvas) return;
			const image = opts.source();
			if (!image) return;
			const hot = changedCells(last, image);
			if (!plugin.scene || hot.size || image.beg !== last?.beg || image.words.length !== last.words.length) {
				plugin.scene = ringToScene(image);
			}
			last = image;
			plugin.camera.yaw += (opts.spin ?? 0) * Math.max(0, Math.min(0.1, (time - then) / 1000));
			then = time;
			const { width, height } = pen.canvas;
			marks = drawList(plugin.scene, plugin.camera, width, height, hot);
			paint(pen, marks, plugin.camera.distance * plugin.scene.radius * 2);
		},
		measure({ objectId }) {
			const addr = objectId === undefined ? NaN : Number.parseInt(objectId, 8);
			const m = marks.find((k) => k.type === "node" && k.addr === addr);
			return m && m.type === "node" ? { x: m.x - m.r, y: m.y - m.r, w: m.r * 2, h: m.r * 2 } : null;
		},
		dispose() {
			plugin.scene = null;
			marks = [];
			last = null;
		},
	};
	return plugin;
}

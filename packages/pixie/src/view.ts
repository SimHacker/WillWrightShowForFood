import type { EdgeKind, NodeKind, Scene, Vec3 } from "./scene.js";

/**
 * The scene through a camera, as a flat painter's list, and a painter
 * that draws it with any 2D pen. No DOM types: a CanvasRenderingContext2D
 * is a Pen, and so is anything else that can stroke, fill and print.
 * The applet's RINGS panel draws with it; a holodeck plugin in the
 * character scene draws the same list on an overlay above the people.
 */
export type Camera = {
	yaw: number;
	pitch: number;
	/** Distance in scene radii. */
	distance: number;
	/** Point looked at, in scene units. */
	target?: Vec3;
	/** The picture slid across the screen, in pixels, after projection. */
	pan?: [number, number];
};

export const DEFAULT_CAMERA: Camera = { yaw: -0.6, pitch: 0.5, distance: 2.4 };

export type Mark =
	| { type: "edge"; kind: EdgeKind; x0: number; y0: number; x1: number; y1: number; depth: number; width: number }
	| {
			type: "node";
			kind: NodeKind;
			addr: number;
			x: number;
			y: number;
			r: number;
			depth: number;
			label: string;
			hot: boolean;
			root: boolean;
	  };

type Projected = { x: number; y: number; z: number; s: number };

export function project(scene: Scene, cam: Camera, width: number, height: number): (p: Vec3) => Projected | null {
	const [tx, ty, tz] = cam.target ?? [0, 0, 0];
	const cy = Math.cos(cam.yaw);
	const sy = Math.sin(cam.yaw);
	const cp = Math.cos(cam.pitch);
	const sp = Math.sin(cam.pitch);
	const dist = cam.distance * scene.radius;
	const focal = Math.min(width, height) * 0.9;
	const [ox, oy] = cam.pan ?? [0, 0];
	return ([px, py, pz]) => {
		const x0 = px - tx;
		const y0 = py - ty;
		const z0 = pz - tz;
		const x1 = cy * x0 + sy * z0;
		const z1 = -sy * x0 + cy * z0;
		const y2 = cp * y0 - sp * z1;
		const z2 = sp * y0 + cp * z1 + dist;
		if (z2 <= 0.1) return null;
		const s = focal / z2;
		return { x: width / 2 + ox + x1 * s, y: height / 2 + oy - y2 * s, z: z2, s };
	};
}

/** Back to front, so nearer cells cover farther ones. */
export function drawList(scene: Scene, cam: Camera, width: number, height: number, hot: Set<number> = new Set()): Mark[] {
	const p = project(scene, cam, width, height);
	const at = new Map(scene.nodes.map((n) => [n.addr, n]));
	const out: Mark[] = [];
	for (const e of scene.edges) {
		const a = at.get(e.from);
		const b = at.get(e.to);
		if (!a || !b) continue;
		const pa = p(a.pos);
		const pb = p(b.pos);
		if (!pa || !pb) continue;
		out.push({
			type: "edge",
			kind: e.kind,
			x0: pa.x,
			y0: pa.y,
			x1: pb.x,
			y1: pb.y,
			depth: (pa.z + pb.z) / 2,
			width: Math.max(0.5, 0.04 * Math.min(pa.s, pb.s)),
		});
	}
	for (const n of scene.nodes) {
		const q = p(n.pos);
		if (!q) continue;
		out.push({
			type: "node",
			kind: n.kind,
			addr: n.addr,
			x: q.x,
			y: q.y,
			r: Math.max(1.5, 0.22 * q.s),
			depth: q.z,
			label: n.label,
			hot: hot.has(n.addr),
			root: n.addr === scene.root,
		});
	}
	return out.sort((a, b) => b.depth - a.depth);
}

/** The nearest node under a screen point, for pointing and talking. */
export function pick(marks: Mark[], x: number, y: number): number | null {
	for (let i = marks.length - 1; i >= 0; i -= 1) {
		const m = marks[i]!;
		if (m.type === "node" && Math.hypot(m.x - x, m.y - y) <= m.r + 2) return m.addr;
	}
	return null;
}

/** The parts of CanvasRenderingContext2D the painter uses. */
export interface Pen {
	strokeStyle: unknown;
	fillStyle: unknown;
	lineWidth: number;
	font: string;
	textAlign: string;
	textBaseline: string;
	globalAlpha: number;
	beginPath(): void;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	arc(x: number, y: number, r: number, a0: number, a1: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	stroke(): void;
	fill(): void;
	fillText(text: string, x: number, y: number): void;
}

/** Phosphor on black: the 340's green, P7 blue for the far side. */
export const PALETTE = {
	car: "#4fc3f7",
	cdr: "#9ccc65",
	close: "#ffd54f",
	forward: "#ef5350",
	cell: "#9ccc65",
	block: "#ce93d8",
	outside: "#757575",
	hot: "#ffffff",
	root: "#ffd54f",
	text: "#e0f2f1",
} as const;

export function paint(pen: Pen, marks: Mark[], far: number): void {
	for (const m of marks) {
		pen.globalAlpha = Math.max(0.25, Math.min(1, 1.4 - m.depth / far));
		if (m.type === "edge") {
			pen.strokeStyle = PALETTE[m.kind];
			pen.lineWidth = m.width;
			pen.beginPath();
			pen.moveTo(m.x0, m.y0);
			pen.lineTo(m.x1, m.y1);
			pen.stroke();
			continue;
		}
		// Stroked, not filled, so what's behind a cell and the letters stay in view; a changed
		// cell fills, so changes still flash.
		const colour = m.hot ? PALETTE.hot : m.kind === "forward" ? PALETTE.forward : PALETTE[m.kind];
		pen.beginPath();
		if (m.kind === "block") pen.rect(m.x - m.r * 1.6, m.y - m.r * 0.7, m.r * 3.2, m.r * 1.4);
		else pen.arc(m.x, m.y, m.r, 0, Math.PI * 2);
		if (m.hot) {
			pen.fillStyle = colour;
			pen.fill();
		} else {
			pen.strokeStyle = colour;
			pen.lineWidth = Math.max(1, Math.min(2.5, m.r / 4));
			pen.stroke();
		}
		if (m.root) {
			pen.strokeStyle = PALETTE.root;
			pen.lineWidth = 2;
			pen.beginPath();
			pen.arc(m.x, m.y, m.r + 3, 0, Math.PI * 2);
			pen.stroke();
		}
		// Labels stay until a node is a speck; the font keeps a readable floor.
		if (m.label && m.r >= 1.5) {
			pen.fillStyle = PALETTE.text;
			pen.font = `${Math.round(Math.max(9, Math.min(14, m.r * 1.3)))}px ui-monospace, monospace`;
			pen.textAlign = "center";
			pen.textBaseline = "middle";
			pen.fillText(m.kind === "block" ? m.label.slice(0, 12) : m.label, m.x, m.kind === "block" ? m.y : m.y - m.r - Math.max(4, Math.min(6, m.r)));
		}
	}
	pen.globalAlpha = 1;
}

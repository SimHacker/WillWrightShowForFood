import type { Cpu } from "./bus.js";
import type { LightPen } from "./plugins/lightpen.js";

/**
 * A scripted light pen for SYMELEC. The script is a generator: `yield n`
 * runs the machine n cycles with the pen as it stands; `yield "text"`
 * posts a caption. Time is machine cycles, not wall clock, so the same
 * script draws the same picture at 1x, at max, and headless under Node.
 */
export type DemoYield = number | string;
export type DemoScript = Generator<DemoYield, void, void>;

export interface DemoHost {
	cpu: Cpu;
	pen: LightPen;
}

const XCROSS = 0o5641;
const YCROSS = 0o5640;

/* Lightbuttons in the right column, 340 grid; the cross ring's S/F sits at (-50, +32). */
export const MENU = {
	DR: [984, 960], HV: [984, 896], RU: [984, 832], SF: [984, 768],
	PO: [984, 640], AT: [984, 576], IN: [984, 512], SC: [984, 448],
	CA: [984, 384], RE: [984, 320], RO: [984, 256], EN: [984, 192],
} as const satisfies Record<string, readonly [number, number]>;
const RING_S: readonly [number, number] = [-50, 32];

/* Tracking stays locked at 2 grid units per 1000 cycles; faster outruns the search raster. */
const TRACK_STEP = 6;
const TRACK_CYCLES = 3_000;
const GLIDE_STEP = 24;
const GLIDE_CYCLES = 1_500;
const PRESS_CYCLES = 20_000;
const SETTLE_CYCLES = 20_000;
const PICKUP_OFFSET = 10;

/* Location 55 holds the ring's first letter: S (233700) idle, F (63700) while an element is open. */
const RING_WORD = 0o55;
const RING_F = 0o63700;

export function drawing(cpu: Cpu): boolean {
	return cpu.read(RING_WORD) === RING_F;
}

export function cross(cpu: Cpu): [number, number] {
	return [cpu.read(XCROSS) & 0o1777, cpu.read(YCROSS) & 0o1777];
}

/** Pen lifted, carried to (x, y): the photocell sees nothing on the way. */
export function* glide(h: DemoHost, x: number, y: number): DemoScript {
	h.pen.enabled = false;
	const { x: x0, y: y0 } = h.pen;
	const n = Math.max(1, Math.ceil(Math.hypot(x - x0, y - y0) / GLIDE_STEP));
	for (let i = 1; i <= n; i += 1) {
		h.pen.point(Math.round(x0 + ((x - x0) * i) / n), Math.round(y0 + ((y - y0) * i) / n));
		yield GLIDE_CYCLES;
	}
}

/** Carry the pen to (x, y), aim it at the glass, lift it. */
export function* tap(h: DemoHost, x: number, y: number): DemoScript {
	yield* glide(h, x, y);
	h.pen.enabled = true;
	yield PRESS_CYCLES;
	h.pen.enabled = false;
	yield SETTLE_CYCLES;
}

export function* tapMenu(h: DemoHost, name: keyof typeof MENU): DemoScript {
	const [x, y] = MENU[name];
	yield* tap(h, x, y);
}

/** The ring's upper-left letter: S starts an element, and while drawing it reads F. */
export function* tapRing(h: DemoHost): DemoScript {
	const [x, y] = cross(h.cpu);
	yield* tap(h, x + RING_S[0], y + RING_S[1]);
}

/**
 * Pick up the cross and carry it to (x, y) at tracking speed. A press on a
 * cross that sits on a lit line can land on the line instead; if the cross
 * did not come along, look and try again.
 */
export function* drag(h: DemoHost, x: number, y: number): DemoScript {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		yield* carry(h, x, y);
		const [cx, cy] = cross(h.cpu);
		if (Math.hypot(cx - x, cy - y) <= 2 * h.pen.aperture) return;
	}
}

function* carry(h: DemoHost, x: number, y: number): DemoScript {
	const [cx, cy] = cross(h.cpu);
	/* The cross usually sits on the end of the line just drawn. Grip it on the
	   side it is about to travel toward: the raster is there, the line is not. */
	const d0 = Math.hypot(x - cx, y - cy) || 1;
	const grip = Math.min(PICKUP_OFFSET, d0);
	const x0 = Math.round(cx + ((x - cx) / d0) * grip);
	const y0 = Math.round(cy + ((y - cy) / d0) * grip);
	yield* glide(h, x0, y0);
	h.pen.enabled = true;
	yield SETTLE_CYCLES / 4;
	/* Tracking stops once the cross raster is inside the aperture, so the cross
	   settles about one aperture behind the pen. Aim that far past the target. */
	const d = Math.hypot(x - x0, y - y0) || 1;
	const over = Math.min(h.pen.aperture, d);
	const tx = x + ((x - x0) / d) * over;
	const ty = y + ((y - y0) / d) * over;
	const n = Math.max(1, Math.ceil((d + over) / TRACK_STEP));
	for (let i = 1; i <= n; i += 1) {
		h.pen.point(Math.round(x0 + ((tx - x0) * i) / n), Math.round(y0 + ((ty - y0) * i) / n));
		yield TRACK_CYCLES;
	}
	yield TRACK_CYCLES * 4;
	h.pen.enabled = false;
	yield SETTLE_CYCLES;
}

/** One element: S, optional RU, a corner per point, F. The cross must already be at the start. */
export function* element(h: DemoHost, points: readonly (readonly [number, number])[], straight = false): DemoScript {
	yield* tapRing(h);
	if (straight) yield* tapMenu(h, "RU");
	for (const [x, y] of points) yield* drag(h, x, y);
	/* A tap can miss the letter; a person at the tube looks and taps again. */
	for (let i = 0; i < 3 && drawing(h.cpu); i += 1) yield* tapRing(h);
	yield 200_000;
}

export function* wait(cycles: number): DemoScript {
	const n = Math.ceil(cycles / 10_000);
	for (let i = 0; i < n; i += 1) yield 10_000;
}

function ring(cx: number, cy: number, r: number, sides: number): [number, number][] {
	const pts: [number, number][] = [];
	for (let i = 1; i <= sides; i += 1) {
		const a = (2 * Math.PI * i) / sides;
		pts.push([Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))]);
	}
	return pts;
}

/**
 * The showcase: a house under a sun, drawn the 1972 way.
 *
 * Three rules of the 1972 program shape the script. An RU element is one
 * rubber-band line, start to last release; corners need HV, which steps
 * a diagonal into a staircase by itself. An element holds about twenty
 * strokes, and every stair is two. And a pen that passes over a lit line
 * hands the cross to that line, so every trip between elements goes
 * around the picture, never across it, and no element starts on one:
 * the window is drawn before the house closes around it, and the roof
 * floats a little above the walls.
 */
export function* houseDemo(h: DemoHost): DemoScript {
	yield "The pen picks up the tracking cross and carries it";
	yield* wait(200_000);
	yield* drag(h, 360, 380);

	yield "S in the ring starts an element; each drag is a corner; F ends it";
	yield* element(h, [[420, 380], [420, 440], [360, 440], [360, 380]]);

	yield "With no element open, the cross moves without ink";
	yield* drag(h, 250, 300);
	yield* drag(h, 460, 200);

	yield "HV, the default, steps along the axes: walls and a door";
	yield* element(h, [
		[300, 200], [300, 500], [700, 500], [700, 200],
		[540, 200], [540, 340], [460, 340], [460, 200],
	]);

	yield "Around the house, never across it: a lit line would catch the cross";
	yield* drag(h, 460, 160);
	yield* drag(h, 250, 160);
	yield* drag(h, 250, 520);
	yield* drag(h, 290, 520);
	yield "Drag diagonally in HV and the line becomes a staircase";
	yield* element(h, [[500, 720], [710, 520]]);

	yield* drag(h, 760, 560);
	yield* drag(h, 760, 960);
	yield* drag(h, 260, 960);
	yield "RU after S: one straight line at any angle. Five make a rising sun";
	const inner = ring(220, 840, 36, 8);
	const outer = ring(220, 840, 90, 8);
	yield* drag(h, ...outer[7]!);
	for (let i = 0; i < 5; i += 1) {
		const k = (i + 7) % 8;
		const [from, to] = i % 2 === 0 ? [outer[k]!, inner[k]!] : [inner[k]!, outer[k]!];
		if (i > 0) yield* drag(h, ...from);
		yield* element(h, [to], true);
	}

	yield* drag(h, 220, 790);
	yield* drag(h, 340, 740);
	yield* drag(h, 230, 600);
	yield* drag(h, 200, 160);
	yield* drag(h, 80, 140);
	yield "RU, tapped right after S: one straight rubber-band line";
	yield* element(h, [[900, 160]], true);

	yield* drag(h, 820, 640);
	yield "Drawn by the 1972 program. This page only moved the pen";
	yield* wait(1_500_000);
}

/** Drives a script against a machine. `advance` runs at most `budget` cycles. */
export class DemoPlayer {
	caption = "";
	done = false;
	private pending = 0;
	private readonly script: DemoScript;

	constructor(script: DemoScript) {
		this.script = script;
	}

	advance(run: (cycles: number) => void, budget: number): number {
		let spent = 0;
		while (spent < budget && !this.done) {
			if (this.pending === 0) {
				const next = this.script.next();
				if (next.done) {
					this.done = true;
					break;
				}
				if (typeof next.value === "string") {
					this.caption = next.value;
					continue;
				}
				this.pending = next.value;
			}
			const n = Math.min(this.pending, budget - spent);
			run(n);
			this.pending -= n;
			spent += n;
		}
		return spent;
	}
}

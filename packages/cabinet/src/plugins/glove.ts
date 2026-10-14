import type { Device, Iot, IotReply } from "../bus.js";
import { flexes, type HandFrame, ONE } from "./hand.js";

/**
 * A DataGlove on the PDP-7 (ROADMAP.md §13, HAND-TRACKING.md): the port for hand.ts's instrument.
 * Whatever tracks the hand (a webcam and MediaPipe in the applet, `wavingHand` in a test) calls
 * `feed` with a HandFrame; the program latches the newest one and reads it a register at a time.
 * Video never reaches the machine, only the numbers.
 *
 * Everything is in units the PDP-7 already has: pixels on the 340's 1024 x 1024 screen (x right,
 * y up, z toward the viewer), whole degrees, and fractions scaled by ONE (16384, turtle.fs's
 * SIN of 90). The hand is reported the way a 3D turtle would draw it: the palm's frame, and then
 * for each finger, from the wrist, four bones as YAW (right), PITCH (up) and FORWARD length. A
 * turtle that starts at the wrist in the palm frame and does those twenty moves, a finger at a
 * time, walks the skeleton; the device plans them with the turtle's own rounding, so the error
 * of one bone is made up by the next and never adds up along a finger.
 *
 * Registers, read with GRD at the index loaded with GLI (GRD steps the index):
 *
 *   0         status: 1 a hand, 2 a right hand (the person's own right)
 *   1..3      the wrist: x y z
 *   4..12     the palm frame scaled by ONE: H (wrist to middle knuckle) xyz, L (left) xyz, U xyz
 *   13..72    20 bones, yaw pitch length: thumb 0-1-2-3-4, then index 0-5-6-7-8 .. pinky 0-17-..-20
 *   73..77    flex, thumb .. pinky: 0 straight .. ONE curled
 *   78        pinch: thumb tip to index tip, pixels
 *   79..141   the 21 landmarks: x y z
 *
 * Cabinet extension on free device 57, pulses grouped by 060 as the 340's are; bit 010 is the
 * CPU's, clearing AC first:
 *
 *   705701 GSF  skip if a new frame waits    705712 GRS  read status of the latched frame
 *   705704 GLT  latch the newest frame, clear the flag
 *   705721 GSH  skip if the latched frame has a hand
 *   705732 GRD  read the register at the index, and step it
 *   705724 GLI  load the index from AC
 *   705744 GCF  clear the flag               705764 GIE  interrupt on a new frame iff AC<17>
 */

export const GLOVE_DEVICE = 0o57;
export const GLOVE_REG = { status: 0, wrist: 1, frame: 4, bones: 13, flex: 73, pinch: 78, points: 79, size: 142 } as const;

/** The bones in register order: each finger from the wrist. */
export const GLOVE_BONES: readonly (readonly [number, number])[] = [0, 1, 2, 3, 4].flatMap((f) => {
	const chain = [0, 4 * f + 1, 4 * f + 2, 4 * f + 3, 4 * f + 4];
	return [0, 1, 2, 3].map((k) => [chain[k]!, chain[k + 1]!] as const);
});

type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V3): V3 => {
	const l = Math.hypot(a[0], a[1], a[2]);
	return l === 0 ? [0, 0, 0] : scale(a, 1 / l);
};
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/**
 * The turtle's turn, as turtle3d.fs does it: A' = A cos - B sin, B' = B cos + A sin.
 * YAW turns H toward -L (A H, B L); PITCH turns H toward U (A U, B H).
 */
function turn(a: V3, b: V3, degrees: number): [V3, V3] {
	const c = Math.cos(rad(degrees));
	const s = Math.sin(rad(degrees));
	return [sub(scale(a, c), scale(b, s)), add(scale(b, c), scale(a, s))];
}

/** A landmark in screen pixels: mirrored (a webcam is a mirror) unless `mirror` is false. */
export function toScreen(p: { x: number; y: number; z: number }, aspect = 1, mirror = true): V3 {
	return [(mirror ? 1 - p.x : p.x) * 1023, 512 + ((0.5 - p.y) * 1023) / aspect, -p.z * 1023];
}

/** The register file for a frame (null, no hand: all zero). Values are signed, not yet 18-bit. */
export function gloveRegisters(f: HandFrame | null, mirror = true): number[] {
	const r = new Array<number>(GLOVE_REG.size).fill(0);
	if (!f || f.points.length < 21) return r;
	const p = f.points.map((q) => toScreen(q, f.aspect ?? 1, mirror));
	const pt = (i: number) => p[i]!;
	r[GLOVE_REG.status] = f.handedness === "right" ? 3 : 1;
	const wrist = pt(0).map(Math.round) as V3;
	wrist.forEach((v, i) => (r[GLOVE_REG.wrist + i] = v));
	// The palm frame: H up the hand, U out of the palm, L = U x H to the left, as the turtle's.
	const H = unit(sub(pt(9), pt(0)));
	const U = unit(cross(H, sub(pt(5), pt(17))));
	const L = cross(U, H);
	const frame = [H, L, U].map((v) => v.map((c) => Math.round(c * ONE)) as V3);
	frame.flat().forEach((v, i) => (r[GLOVE_REG.frame + i] = v));
	// Plan each finger with the frame the turtle will have, so its rounding is accounted for.
	const start = frame.map((v) => scale(v, 1 / ONE)) as [V3, V3, V3];
	let h: V3 = start[0];
	let l: V3 = start[1];
	let u: V3 = start[2];
	let at: V3 = wrist;
	GLOVE_BONES.forEach(([from, to], b) => {
		if (from === 0) [h, l, u, at] = [...start, wrist];
		const d = sub(pt(to), at);
		const yaw = Math.round(deg(Math.atan2(-dot(d, l), dot(d, h))));
		[h, l] = turn(h, l, yaw);
		const pitch = Math.round(deg(Math.atan2(dot(d, u), dot(d, h))));
		[u, h] = turn(u, h, pitch);
		const len = Math.max(0, Math.round(dot(d, h)));
		at = add(at, scale(h, len));
		r[GLOVE_REG.bones + 3 * b] = yaw;
		r[GLOVE_REG.bones + 3 * b + 1] = pitch;
		r[GLOVE_REG.bones + 3 * b + 2] = len;
	});
	flexes(f).forEach((x, i) => (r[GLOVE_REG.flex + i] = Math.round(x * ONE)));
	r[GLOVE_REG.pinch] = Math.round(Math.hypot(...sub(pt(4), pt(8))));
	p.forEach((q, i) => q.forEach((v, k) => (r[GLOVE_REG.points + 3 * i + k] = Math.round(v))));
	return r;
}

export type GloveOpts = {
	/** A hand at `t` seconds of machine time, sampled every `framePeriod` steps: a demo, a test. */
	source?: (t: number) => HandFrame | null;
	/** Steps between frames from `source`; default 20,000. */
	framePeriod?: number;
	/** Steps a second, to give `source` its seconds; default 570,000, about the PDP-7's. */
	stepsPerSecond?: number;
	/** Show the hand as a mirror does, as people expect of a webcam; default true. */
	mirror?: boolean;
};

export class DataGlove implements Device {
	readonly name = "glove";
	readonly iots = [GLOVE_DEVICE];
	source: ((t: number) => HandFrame | null) | null;
	framePeriod: number;
	stepsPerSecond: number;
	mirror: boolean;
	/** Frames fed, and frames the program latched. */
	frames = 0;
	latches = 0;
	private pending: number[] = gloveRegisters(null);
	private latched: number[] = gloveRegisters(null);
	private index = 0;
	private flag = false;
	private ie = false;
	private steps = 0;
	private untilFrame = 0;
	private _power = true;

	constructor(o: GloveOpts = {}) {
		this.source = o.source ?? null;
		this.framePeriod = o.framePeriod ?? 20_000;
		this.stepsPerSecond = o.stepsPerSecond ?? 570_000;
		this.mirror = o.mirror ?? true;
	}

	get power(): boolean {
		return this._power;
	}
	set power(on: boolean) {
		if (on && !this._power) this.reset();
		this._power = on;
	}

	/** The newest hand (null: none in view). Raises the flag. */
	feed(f: HandFrame | null): void {
		this.pending = gloveRegisters(f, this.mirror);
		this.frames += 1;
		this.flag = true;
	}

	/** The latched registers, signed: what the program sees. */
	registers(): readonly number[] {
		return this.latched;
	}

	reset(): void {
		this.flag = false;
		this.ie = false;
		this.index = 0;
	}

	irq(): boolean {
		return this.flag && this.ie;
	}

	tick(cycles: number): void {
		this.steps += cycles;
		if (!this.source) return;
		this.untilFrame -= cycles;
		if (this.untilFrame > 0) return;
		this.untilFrame += this.framePeriod;
		this.feed(this.source(this.steps / this.stepsPerSecond));
	}

	iot(req: Iot): IotReply {
		let ac = req.ac;
		let skip = false;
		const op = req.pulse & 0o7;
		switch (req.pulse & 0o60) {
			case 0o00:
				if (op & 0o1) skip = this.flag;
				if (op & 0o2) ac |= this.latched[GLOVE_REG.status] ?? 0;
				if (op & 0o4) {
					this.latched = this.pending;
					this.flag = false;
					this.latches += 1;
				}
				break;
			case 0o20:
				if (op & 0o1) skip = this.latched[GLOVE_REG.status] !== 0;
				if (op & 0o2) {
					ac |= (this.latched[this.index] ?? 0) & 0o777777;
					this.index = (this.index + 1) % GLOVE_REG.size;
				}
				if (op & 0o4) this.index = (ac & 0o777777) % GLOVE_REG.size;
				break;
			case 0o40:
				if (op & 0o4) this.flag = false;
				break;
			case 0o60:
				if (op & 0o4) this.ie = (ac & 1) !== 0;
				break;
		}
		return { ac, skip };
	}
}

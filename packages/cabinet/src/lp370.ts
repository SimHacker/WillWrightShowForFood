import { assemble, loadAsm, type AsmResult } from "./asm.js";
import type { Pdp7 } from "./plugins/pdp7.js";
import { type DemoHost, type DemoScript, glide, wait } from "./symelec-demo.js";

/**
 * DEC-4-45-M, the 370 light pen diagnostic (C. Stein, 1964), assembled
 * from tapes/lp370: the reconstructed page 6, the surviving listing, and
 * OUTNOX, in that order. See tapes/lp370/README.md.
 */
export const LP370_TAPES = ["page6.s", "lp370.s", "outnox.s"] as const;

export const LP370_START = 0o22;

/** AC switches, bit 0 leftmost, from the operating table on page 2. */
export const LP370_SWITCHES = {
	readout: 0o400000,
	sensitivity: 0o200000,
	follow: 0o040000,
	fieldOfView: 0o010000,
	/** Box corner = switches times 200 (octal). */
	boxX: (n: number) => (n & 7) << 8,
	boxY: (n: number) => (n & 7) << 4,
	intensity: (n: number) => n & 7,
} as const;

export function assembleLp370(sources: Readonly<Record<(typeof LP370_TAPES)[number], string>>): AsmResult {
	return assemble(LP370_TAPES.map((name) => ({ name, text: sources[name] })));
}

/** Deposit the program and point the CPU at 22. Throws if it did not assemble clean. */
export function bootLp370(cpu: Pdp7, program: AsmResult, switches = 0): void {
	const e = program.errors;
	if (e.length > 0) throw new Error(`lp370 did not assemble, ${e.length} errors:\n${e.join("\n")}`);
	loadAsm(cpu, program);
	cpu.switches = switches;
	cpu.pc = LP370_START;
}

const SW = LP370_SWITCHES;
const LINES = [0o100, 0o200, 0o300, 0o400, 0o500, 0o600, 0o700, 0o1000];

/** Pen on the glass at (x, y), held there for `cycles`. */
function* hold(h: DemoHost, x: number, y: number, cycles: number): DemoScript {
	yield* glide(h, x, y);
	h.pen.enabled = true;
	yield* wait(cycles);
	h.pen.enabled = false;
}

/** Pen on the glass, moved in `steps` from where it is to (x, y), `each` cycles a step. */
function* stroke(h: DemoHost, x: number, y: number, steps: number, each: number): DemoScript {
	const { x: x0, y: y0 } = h.pen;
	h.pen.enabled = true;
	for (let i = 1; i <= steps; i += 1) {
		h.pen.point(Math.round(x0 + ((x - x0) * i) / steps), Math.round(y0 + ((y - y0) * i) / steps));
		yield each;
	}
}

/**
 * The operator's walk through DEC-4-45-M: each test is selected on the AC
 * switches while the program runs, and the pen is put where page 3-5 of the
 * write-up says to look.
 */
export function* lp370Demo(h: DemoHost & { cpu: Pdp7 }, program: AsmResult): DemoScript {
	const at = (name: string) => h.cpu.read(program.symbols.get(name) ?? 0);
	h.pen.aperture = 12;
	h.pen.enabled = false;

	yield "Test 1, sensitivity: switch 1 up. Eight lines, intensity 0 at the bottom to 7 at the top";
	h.cpu.switches = SW.sensitivity;
	yield* glide(h, 0o1200, 0o1200);
	yield* wait(600_000);

	yield "Pen right of centre on a line: the display stops where the pen sees it, so the line is cut short";
	for (const y of [0o700, 0o500, 0o300, 0o100]) yield* hold(h, 0o1040, y, 400_000);

	yield "Slide the pen along a line and the cut follows it";
	yield* glide(h, 0o1070, 0o600);
	yield* stroke(h, 0o1004, 0o600, 60, 15_000);
	h.pen.enabled = false;

	yield "Left of centre the program resumes the display (IDRS), so the line is drawn in full";
	for (const y of [0o600, 0o400, 0o200]) yield* hold(h, 0o740, y, 400_000);
	h.cpu.switches = 0;
	yield* wait(200_000);

	yield "Test 2, follow: switch 3 up. A tracking cross, with two lines from the centre to it";
	h.cpu.switches = SW.follow | SW.intensity(7);
	yield* wait(400_000);
	const cx = at("xpt");
	const cy = at("ypt");
	yield "Put the pen on the cross and move slowly: the cross follows";
	yield* glide(h, cx, cy);
	h.pen.enabled = true;
	yield* wait(200_000);
	const r = 0o200;
	const corners: [number, number][] = [
		[cx + r, cy],
		[cx + r, cy + r],
		[cx - r, cy + r],
		[cx - r, cy - r],
		[cx + r, cy - r],
		[cx + r, cy],
	];
	for (const [x, y] of corners) yield* stroke(h, x, y, Math.ceil(Math.hypot(x - h.pen.x, y - h.pen.y) / 3), 20_000);
	yield "Move too fast and the cross is left behind: the pen no longer sees it";
	yield* stroke(h, cx - r, cy, 2, 20_000);
	yield* wait(400_000);
	h.pen.enabled = false;
	yield* wait(600_000);

	yield "Test 3, field of view: switch 5 up; switches 7-9 and 11-13 place a box of points";
	h.cpu.switches = SW.readout | SW.fieldOfView | SW.boxX(3) | SW.boxY(3) | SW.intensity(5);
	yield* glide(h, 0o400, 0o300);
	yield* wait(600_000);
	const bx = 0o600 + 0o30;
	const by = 0o600 + 0o30;
	yield "Pen on the box: the points it sees are drawn 4x on the other side, with their count above";
	yield* hold(h, bx, by, 1_500_000);
	yield "Across the box: the enlarged patch is the pen's field of view, its size the aperture";
	yield* glide(h, bx - 0o40, by);
	yield* stroke(h, bx + 0o40, by, 40, 40_000);
	h.pen.enabled = false;
	yield* wait(400_000);

	yield "That is the whole diagnostic. The switches under the tube are yours now";
	yield* wait(1_500_000);
}

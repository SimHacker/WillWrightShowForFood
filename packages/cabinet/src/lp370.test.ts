import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble } from "./asm.js";
import { Cabinet } from "./cabinet.js";
import { LP370_SWITCHES as SW, LP370_TAPES, assembleLp370, bootLp370 } from "./lp370.js";
import { LightPen } from "./plugins/lightpen.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { type Segment, Type340 } from "./plugins/type340.js";

const dir = new URL("../tapes/lp370/", import.meta.url);
const sources = Object.fromEntries(LP370_TAPES.map((n) => [n, readFileSync(new URL(n, dir), "utf8")])) as Record<(typeof LP370_TAPES)[number], string>;
const program = assembleLp370(sources);
const sym = (name: string): number => {
	const v = program.symbols.get(name);
	assert.notEqual(v, undefined, name);
	return v as number;
};

function machine(switches: number) {
	const cpu = new Pdp7({ coreWords: 8192 });
	const pen = new LightPen({ aperture: 12, name: "test", enabled: false });
	const t340 = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), pens: [pen] });
	const box = new Cabinet({ cpu, devices: [t340] });
	t340.clock = () => box.cycles;
	bootLp370(cpu, program, switches);
	const drawn = (cycles: number): Segment[] => {
		const out: Segment[] = [];
		t340.onSegment = (s) => out.push(s);
		box.run(cycles);
		t340.onSegment = undefined;
		return out.filter((s) => s.intensify);
	};
	return { cpu, pen, t340, box, drawn };
}

test("asm: DEC syntax, ones' complement, literals, origin, variables", () => {
	const r = assemble([{ name: "t", text: "100/\na,\tlac (-0\n\tjmp . 3\n\tlaw a-1\nb=a 2\n\tdac i b\n\ttad (jmp .+4\n\tdac tmp\nstart\n" }]);
	assert.deepEqual(r.errors, []);
	const w = new Map(r.words);
	assert.equal(w.get(0o100), 0o200000 | 0o106, "lac (-0 -> first literal after the program");
	assert.equal(w.get(0o106), 0o777777, "-0");
	assert.equal(w.get(0o101), 0o600104, "jmp . 3 is .+3");
	assert.equal(w.get(0o102), 0o760077, "law a-1");
	assert.equal(w.get(0o103), 0o060102, "dac i b, b=a+2");
	assert.equal(w.get(0o107), 0o600110, "a dot in a literal is the referring word's location");
	assert.deepEqual(r.variables, [{ name: "tmp", addr: 0o110 }]);
});

test("lp370: the listing and the reconstruction assemble clean", () => {
	assert.deepEqual(program.errors, []);
	// Every undefined name is a temporary the listing never declares; a misread label would show up here.
	assert.deepEqual(
		program.variables.map((v) => v.name),
		["bufd1", "bufdon", "cvntx", "lpct", "mag", "noswit", "outmpx", "sign", "t1x", "t2x", "t3x", "t4x", "t5x", "t68x", "t69x", "tabcon", "temp1", "temp2", "x1", "xcor", "xpt", "y1", "ycor", "ypt", "zerswt"],
	);
	assert.equal(sym("begin"), 0o22);
	// OUTNOX's decimal table is -(n-1) in ones' complement, which is two's complement -n.
	assert.equal(program.words.find(([a]) => a === sym("tab"))?.[1], (0o1000000 - 100000) & 0o777777);
});

/* Page 3, 2-1: eight horizontal vectors from x=700, y=100..1000, intensity 0..7. */
const LINE_Y = 0o500;
const onLine = (segs: Segment[]) => segs.filter((s) => s.kind === "vector" && s.y0 === LINE_Y && s.y1 === LINE_Y);

test("lp370 sensitivity: eight lines at eight intensities", () => {
	const m = machine(SW.sensitivity);
	const segs = m.drawn(200_000).filter((s) => s.kind === "vector");
	const ys = [...new Set(segs.map((s) => s.y0))].sort((a, b) => a - b);
	assert.deepEqual(ys, [0o100, 0o200, 0o300, 0o400, 0o500, 0o600, 0o700, 0o1000]);
	assert.deepEqual([...new Set(segs.map((s) => s.intensity))].sort(), [0, 1, 2, 3, 4, 5, 6, 7]);
	assert.ok(segs.every((s) => s.x0 === 0o700 && s.x1 === 0o1077));
});

test("lp370 sensitivity: pen right of centre truncates the line", () => {
	const m = machine(SW.sensitivity);
	m.drawn(50_000);
	m.pen.point(0o1040, LINE_Y);
	m.pen.enabled = true;
	const line = onLine(m.drawn(200_000));
	assert.ok(line.length > 0);
	const reach = Math.max(...line.map((s) => s.x1));
	assert.ok(reach < 0o1040, `stopped where the pen saw it, reached ${reach.toString(8)}`);
	assert.ok(reach >= 0o1000, "right of centre");
});

test("lp370 sensitivity: pen left of centre, IDRS resumes and the line appears in full", () => {
	const m = machine(SW.sensitivity);
	m.drawn(50_000);
	m.pen.point(0o740, LINE_Y);
	m.pen.enabled = true;
	const line = onLine(m.drawn(200_000));
	assert.equal(Math.max(...line.map((s) => s.x1)), 0o1077);
	assert.ok(line.some((s) => s.x1 < 0o1000 && s.x1 > 0o700), "the pen did stop it on the way");
});

/* Page 3, 2-2: the cross follows the pen; two lines from the centre to it. */
test("lp370 follow: the tracking cross follows the pen", () => {
	const m = machine(SW.follow | SW.intensity(7));
	m.drawn(50_000);
	m.pen.point(0o1000, 0o1000);
	m.pen.enabled = true;
	const target = [0o1000 + 120, 0o1000 + 80];
	for (let i = 1; i <= 40; i += 1) {
		m.pen.point(Math.round(0o1000 + (120 * i) / 40), Math.round(0o1000 + (80 * i) / 40));
		m.box.run(20_000);
	}
	m.box.run(100_000);
	const x = m.cpu.read(sym("xpt"));
	const y = m.cpu.read(sym("ypt"));
	assert.ok(Math.abs(x - (target[0] as number)) <= 4 && Math.abs(y - (target[1] as number)) <= 4, `cross at ${x},${y}`);
	const legs = m.drawn(50_000).filter((s) => s.kind === "vector" && s.x0 === 0o1000 && s.y0 === 0o1000);
	assert.ok(legs.length > 0, "the line from the centre");
	assert.equal(m.cpu.halted, false, "no edge violation");
});

/* Pages 4-5, 2-3: a box of points; the pen's count and a 4x enlargement. */
test("lp370 field of view: counts the points inside the aperture and draws them 4x", () => {
	const px = 0o600 + 0o30;
	const py = 0o600 + 0o30;
	const m = machine(SW.readout | SW.fieldOfView | SW.boxX(3) | SW.boxY(3) | SW.intensity(5));
	m.pen.point(px, py);
	m.pen.enabled = true;
	for (let i = 0; i < 400 && m.cpu.read(sym("noswit")) === 0; i += 1) m.box.run(20_000);
	assert.notEqual(m.cpu.read(sym("noswit")), 0, "a scan finished and the readout was built");

	const a = m.pen.aperture;
	let inside = 0;
	for (let x = 0o600; x < 0o660; x += 1) for (let y = 0o600; y < 0o660; y += 1) if ((x - px) ** 2 + (y - py) ** 2 <= a * a) inside += 1;
	// Every point is shown twice (jms outgo; jms outgo) and each sighting counts.
	// The first readout can carry a partial scan's count.
	let counted = decodeReadout(m.cpu, sym("nobfxx"));
	for (let i = 0; i < 40 && counted !== 2 * inside; i += 1) {
		m.box.run(20_000);
		counted = decodeReadout(m.cpu, sym("nobfxx"));
	}
	assert.equal(counted, 2 * inside);

	const seen = m.drawn(400_000).filter((s) => s.kind === "incr");
	assert.ok(seen.length > 0 && seen.every((s) => s.x0 >= 0o1000), "the enlargement is in the other half");
});

/** Read OUTNOX's display buffer back as a number: each digit is its stroke table, copied. */
function decodeReadout(cpu: Pdp7, buffer: number): number {
	const digits = ["zerox", "onex", "twox", "threex", "fourx", "fivex", "sixx", "sevenx", "eightx", "ninex"].map((n) => {
		const out: number[] = [];
		for (let a = sym(n); cpu.read(a) !== 0o777777; a += 1) out.push(cpu.read(a));
		return out;
	});
	const blank: number[] = [];
	for (let a = sym("blank"); cpu.read(a) !== 0o777777; a += 1) blank.push(cpu.read(a));
	let a = buffer + 3;
	let text = "";
	// The caller closes the buffer with an escape word, 400000.
	while (cpu.read(a) !== 0o400000) {
		const d = digits.findIndex((g) => g.every((w, k) => cpu.read(a + k) === w));
		if (d >= 0) {
			text += String(d);
			a += (digits[d] as number[]).length;
		} else if (blank.every((w, k) => cpu.read(a + k) === w)) {
			a += blank.length;
		} else throw new Error(`unrecognised digit at ${a.toString(8)}`);
	}
	return Number(text);
}

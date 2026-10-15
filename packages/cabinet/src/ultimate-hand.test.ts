import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth } from "./forth.js";
import { DataHand } from "./plugins/datahand.js";
import { type HandFrame, syntheticHand, wavingHand } from "./plugins/hand.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { type Segment, Type340 } from "./plugins/type340.js";
import { UM_MAX, UM_PHASE, UltimateMachine } from "./plugins/ultimate.js";

const tape = (f: string) => readFileSync(new URL(`../tapes/${f}`, import.meta.url), "utf8");
const image = compileForth({
	kernel: assembleForthKernel({
		sop: tape("pdp7unix/sop.s"),
		kernel: tape("pdp7forth/kernel-names-full.s"),
		end: tape("pdp7forth/end.s"),
		kernelName: "kernel-names-full.s",
	}),
	sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "tags.fs", "clip.fs", "turtle3d.fs", "datahand.fs", "ultimate-hand.fs"].map(
		(f) => tape(`pdp7forth/${f}`),
	),
});

function machine() {
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	let lit: Segment[] = [];
	const recent: Segment[][] = [];
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		// The 340 refreshes while the list is being rewritten: keep the fullest of the last few.
		onFrame: (f) => {
			const l = f.segments.filter((s) => s.intensify);
			recent.push(l);
			if (recent.length > 40) recent.shift();
			lit = recent.reduce((a, b) => (b.length > a.length ? b : a), []);
		},
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const hand = new DataHand();
	const um = new UltimateMachine({ wait: 40_000, open: 60_000, reach: 100_000, press: 40_000, return: 80_000, close: 60_000, rest: 200_000 });
	const box = new Cabinet({ cpu, devices: [t340, tty, hand, um] });
	t340.clock = () => box.cycles;
	bootForth(cpu, image);
	box.run(300_000);
	for (const ch of "ULTIMATE-HAND\r") tty.type(ch.charCodeAt(0) | 0o200);
	box.run(1_000_000);
	return { cpu, box, t340, hand, um, lit: () => lit, paper: () => paper };
}

/** Your hand, palm to the camera, fingers up; `size` grows as you bring it nearer. */
const yours = (curls: number[], size = 0.3): HandFrame => ({
	...syntheticHand({ curls, x: 0.5, y: 0.8, size, handedness: "right" }),
	aspect: 4 / 3,
});
const demo = (): HandFrame => ({ ...yours([0, 0, 0, 0, 0]), synthetic: true });
const run = (m: ReturnType<typeof machine>, f: HandFrame | null, cycles: number) => {
	for (let n = 0; n < cycles; n += 50_000) {
		m.hand.feed(f);
		m.box.run(50_000);
	}
};
const phase = (m: ReturnType<typeof machine>) => m.um.phase;

test("ultimate hand: one appearance is one round; the press waits for a fingertip on the switch", () => {
	const fist = [1, 1, 1, 1, 1];
	const m = machine();
	assert.equal(m.um.manualPress, true, "the program put the box in manual press");
	run(m, null, 1_000_000);
	assert.equal(phase(m), UM_PHASE.off, "no hand, nothing happens");
	run(m, demo(), 1_000_000);
	assert.equal(phase(m), UM_PHASE.off, "the demo's hand doesn't start it");
	run(m, yours(fist), 1_500_000);
	assert.equal(phase(m), UM_PHASE.reach, "your hand did: the arm is out");
	assert.equal(m.um.arm, UM_MAX);
	run(m, yours(fist), 2_000_000);
	assert.equal(phase(m), UM_PHASE.reach, "a fist stops short, and the box waits for as long as you like");
	run(m, null, 600_000);
	assert.ok(phase(m) >= UM_PHASE.return || phase(m) === UM_PHASE.off, `your hand gone: the arm goes home at once (phase ${phase(m)})`);
	assert.equal(m.um.presses, 0, "without a press");
	assert.equal(m.um.aborts, 1);
	run(m, demo(), 2_000_000);
	assert.equal(phase(m), UM_PHASE.off, "the demo hand doesn't start it again");
	run(m, yours(fist), 1_500_000);
	assert.equal(phase(m), UM_PHASE.reach, "your hand back: a new round");
	assert.equal(m.um.presses, 0);
	assert.equal(m.t340.status & 0o5000, 0, "nothing ran off the glass");
	run(m, yours([1, 1, 0, 1, 1]), 3_000_000);
	assert.equal(m.um.presses, 1, "back again, the middle finger up touches the switch: the press");
	run(m, yours(fist), 4_000_000);
	assert.equal(phase(m), UM_PHASE.off, "home and rested");
	run(m, yours(fist), 2_000_000);
	assert.equal(phase(m), UM_PHASE.off, "the hand is still up: no second round until it goes away");
	run(m, null, 1_000_000);
	run(m, yours(fist), 1_500_000);
	assert.equal(phase(m), UM_PHASE.reach, "away and back: the next round");
});

test("ultimate hand: the demo hand rides the arm inside the box, under the title, and opens nothing", () => {
	const m = machine();
	run(m, { ...wavingHand(1), synthetic: true }, 3_000_000);
	assert.equal(phase(m), UM_PHASE.off, "the demo hand doesn't start it");
	// The hand is what is drawn inside the hole, above the arm and below the shut lid.
	const inHole = m.lit().filter((s) => s.x0 > 220 && s.x0 < 804 && s.x0 !== 488 && s.x0 !== 536 && Math.min(s.y0, s.y1) > 130 && Math.max(s.y0, s.y1) < 760);
	assert.ok(inHole.length > 20, `the demo hand is drawn: ${inHole.length} strokes`);
	const xs = inHole.flatMap((s) => [s.x0, s.x1]);
	assert.ok(Math.max(...xs) - Math.min(...xs) < 560, "small enough to fit in the hole");
	assert.ok(m.lit().some((s) => s.y0 > 950), "the title is up top");
	assert.ok(inHole.filter((s) => s.intensity === 3).length > 20, "the demo hand is a dim ghost");
	assert.ok(m.lit().filter((s) => s.y0 < 80).every((s) => s.intensity === 5), "the box is a little dimmer than your hand will be");
});

test("ultimate hand: hands coming and going at random never corrupt the PDP-7", () => {
	let seed = 11;
	const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	for (let trial = 0; trial < 3; trial += 1) {
		const m = machine();
		const sp0 = m.cpu.read(0o12);
		let t = 0;
		for (let seg = 0; seg < 30; seg += 1) {
			const kind = rnd();
			const [x, y, size] = [rnd(), 0.2 + rnd() * 0.8, 0.1 + rnd() * 0.7];
			for (let i = 5 + Math.floor(rnd() * 30); i > 0; i -= 1) {
				t += 0.05;
				const f = kind < 0.3 ? null : kind < 0.55 ? { ...wavingHand(t), synthetic: true }
					: { ...syntheticHand({ curls: [0, 1, 2, 3, 4].map(() => rnd()), x: x + (rnd() - 0.5) * 0.3, y: y + (rnd() - 0.5) * 0.3, size, heading: (rnd() - 0.5) * 120, handedness: rnd() < 0.5 ? "left" : "right" }), aspect: 4 / 3 };
				m.hand.feed(f);
				m.box.run(57_000);
				assert.ok(m.cpu.read(0o12) <= sp0 + 16, `trial ${trial} seg ${seg}: the data stack stays bounded`);
				assert.notEqual(m.cpu.read(0o10), 0, `trial ${trial} seg ${seg}: Forth is still running`);
			}
		}
		assert.equal(m.paper(), "PDP-7 FORTH\r\nULTIMATE-HAND ", "nothing printed: no error, no abort");
	}
});

test("ultimate hand: the arm places the hand; where it is in the camera doesn't matter", () => {
	// A fist, so no fingertip reaches the switch and the arm stays out.
	const reach = (dx: number) => {
		const m = machine();
		const f = { ...syntheticHand({ curls: [1, 1, 1, 1, 1], x: 0.5 + dx, y: 0.8, size: 0.3 }), aspect: 4 / 3 };
		run(m, f, 2_500_000);
		assert.equal(phase(m), UM_PHASE.reach, `${m.paper()} arm ${m.um.arm} presses ${m.um.presses}`);
		const hand = m.lit().filter((s) => Math.max(s.y0, s.y1) > 160 && Math.max(s.y0, s.y1) < 780 && s.x0 > 210 && s.x0 < 814);
		const xs = hand.flatMap((s) => [s.x0, s.x1]);
		return { top: Math.max(...hand.map((s) => Math.max(s.y0, s.y1))), mid: (Math.min(...xs) + Math.max(...xs)) / 2 };
	};
	const middle = reach(0);
	const aside = reach(0.3);
	assert.ok(Math.abs(middle.top - aside.top) < 4 && Math.abs(middle.mid - aside.mid) < 4,
		`the same place from anywhere in the picture: ${JSON.stringify([middle, aside])}`);
	assert.ok(Math.abs(middle.mid - 512) < 90, `over the arm, under the switch: ${middle.mid}`);
	assert.ok(middle.top > 600 && middle.top < 840 - 60, `a fist stops short of it: ${middle.top}`);
});

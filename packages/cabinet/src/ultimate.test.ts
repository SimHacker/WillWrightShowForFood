import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble, loadAsm } from "./asm.js";
import type { Device, Iot, IotReply } from "./bus.js";
import { Cabinet } from "./cabinet.js";
import { assembleForthKernel, bootForth, compileForth, type ForthImage, ultimateDemo } from "./forth.js";
import { LightPen } from "./plugins/lightpen.js";
import { Pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { type Segment, Type340 } from "./plugins/type340.js";
import { strokeText } from "./hover.js";
import { readTag } from "./tags.js";
import { UM_DEFAULT_TIMING, UM_MAX, UM_PHASE, UM_TICK, UltimateMachine, type UltimateOpts } from "./plugins/ultimate.js";

const iot = (pulse: number, ac = 0): Iot => ({ device: 0o56, pulse, ac });
const UMSF = iot(0o01);
const UMRC = iot(0o02);
const UMON = iot(0o04);
const UMSB = iot(0o21);
const UMRP = iot(0o22);
const UMOF = iot(0o24);
const UMSI = iot(0o41);
const UMRL = iot(0o42);
const UMCF = iot(0o44);
const UMRA = iot(0o62);

/** Every phase quick: ten steps each. */
const QUICK: UltimateOpts = { wait: 10, open: 10, reach: 10, press: 10, return: 10, close: 10, rest: 10 };

const ticks = (u: UltimateMachine, n: number) => {
	for (let i = 0; i < n; i += 1) u.tick();
};

test("switched on, it waits, opens, reaches, presses, returns, closes and rests, then it is off", () => {
	const u = new UltimateMachine(QUICK);
	assert.equal(u.power, false);
	assert.deepEqual(u.pose(), { phase: "off", lever: false, lid: 0, arm: 0 });
	u.power = true;
	assert.equal(u.phase, UM_PHASE.wait);
	ticks(u, 10);
	assert.equal(u.phase, UM_PHASE.open);
	ticks(u, 5);
	assert.equal(u.lid, UM_MAX / 2);
	ticks(u, 5);
	assert.equal(u.phase, UM_PHASE.reach);
	ticks(u, 10);
	assert.equal(u.phase, UM_PHASE.press, "the finger is on the lever");
	assert.equal(u.lever, false, "and the lever is off");
	assert.equal(u.power, true, "but the motor runs until the arm is home");
	assert.equal(u.presses, 1);
	ticks(u, 10);
	assert.equal(u.phase, UM_PHASE.return);
	ticks(u, 10);
	assert.equal(u.phase, UM_PHASE.close);
	assert.equal(u.arm, 0);
	ticks(u, 10);
	assert.equal(u.phase, UM_PHASE.rest, "lid shut, the motor running down");
	assert.equal(u.power, true);
	ticks(u, 10);
	assert.deepEqual(u.pose(), { phase: "off", lever: false, lid: 0, arm: 0 });
	assert.equal(u.power, false);
});

test("each phase takes as long as it is told; zero is instant", () => {
	const u = new UltimateMachine({ wait: 0, open: 0, reach: 4, press: 0, return: 0, close: 0, rest: 0 });
	u.switchOn();
	assert.equal(u.phase, UM_PHASE.reach, "WAIT and OPEN took no time");
	assert.equal(u.lid, UM_MAX);
	ticks(u, 4);
	assert.equal(u.phase, UM_PHASE.off, "press, return, close and rest in the same step");
	assert.equal(u.presses, 1);
	const z = new UltimateMachine({ wait: 0, open: 0, reach: 0, press: 0, return: 0, close: 0, rest: 0 });
	z.power = true;
	assert.equal(z.power, false, "off again before the switch has finished moving");
	assert.equal(z.presses, 1);
	assert.equal(z.ons, 1);
});

test("switched off on the way out, the hand turns back; switched on on the way in, it comes out again", () => {
	const u = new UltimateMachine(QUICK);
	u.switchOn();
	ticks(u, 25); // WAIT 10, OPEN 10, half the REACH
	assert.equal(u.phase, UM_PHASE.reach);
	u.switchOff();
	assert.equal(u.aborts, 1);
	assert.equal(u.phase, UM_PHASE.return, "back from where it was");
	ticks(u, 2);
	assert.equal(u.arm, 300);
	u.switchOn();
	assert.equal(u.phase, UM_PHASE.reach, "and out again");
	assert.equal(u.ons, 2);
	ticks(u, 7);
	assert.equal(u.phase, UM_PHASE.press);
	assert.equal(u.switchOn(), false, "the finger is holding the lever down");
	assert.equal(u.lever, false);
	ticks(u, 15); // PRESS, and half the RETURN
	u.switchOn();
	assert.equal(u.phase, UM_PHASE.reach);
	ticks(u, 5);
	assert.equal(u.presses, 2);
	// Switched off while the lid is still opening: it just closes.
	const v = new UltimateMachine(QUICK);
	v.switchOn();
	ticks(v, 14);
	v.switchOff();
	assert.equal(v.phase, UM_PHASE.close);
	v.switchOn();
	assert.equal(v.phase, UM_PHASE.open, "switched on while closing, it opens again");
});

test("the IOTs: lever, phase, lid, arm, the phase-change flag and its interrupt, and the timings", () => {
	const u = new UltimateMachine(QUICK);
	const box = new Cabinet({ cpu: new Pdp7({ coreWords: 64 }), devices: [u] });
	const io = (r: Iot): IotReply => (box as unknown as { dispatch(i: Iot): IotReply }).dispatch(r);
	assert.equal(io(UMSF).skip, false);
	assert.equal(io(UMSB).skip, false);
	io(UMON);
	assert.equal(io(UMSF).skip, true);
	assert.equal(io(UMSB).skip, true);
	assert.equal(io(UMRP).ac, UM_PHASE.wait);
	assert.equal(io(UMSI).skip, true, "the phase changed");
	io(UMCF);
	assert.equal(io(UMSI).skip, false);
	ticks(u, 15);
	assert.equal(io(UMRL).ac, 500);
	assert.equal(io(UMRA).ac, 0);
	assert.equal(u.irq(), false, "no interrupt until UMIE");
	io(iot(0o64, 1));
	assert.equal(u.irq(), true);
	io(UMCF);
	assert.equal(u.irq(), false);
	io(UMOF);
	assert.equal(io(UMSF).skip, false);
	assert.equal(io(UMRP).ac, UM_PHASE.close);
	ticks(u, 20);
	assert.equal(u.power, false);
	assert.equal(io({ ...UMRC, ac: 0o70 }).ac, 0o70, "off, and still answering: no presses, ORed into AC");
	// UMLT: phase in AC<0:2>, length in UM_TICK steps.
	io(iot(0o61, (UM_PHASE.reach << 15) | 3));
	assert.equal(u.timing.reach, 3 * UM_TICK);
	io(iot(0o61, 5));
	assert.equal(u.timing.wait, 10, "phase 0 is OFF, which has no length");
});

test("Cabinet.setPower works the lever, and the cabinet ticks it until it is home", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.deposit(0, [0o600000]); // jmp 0
	const u = new UltimateMachine({ ...QUICK, wait: 20 });
	const box = new Cabinet({ cpu, devices: [u] });
	box.run(50);
	assert.equal(u.phase, UM_PHASE.off, "off: never ticked");
	box.setPower("ultimate", true);
	assert.equal(u.ons, 1);
	box.run(19);
	assert.equal(u.phase, UM_PHASE.wait);
	box.run(1 + 10 + 10);
	assert.equal(u.lever, false);
	assert.equal(u.presses, 1);
	box.run(15);
	assert.equal(u.phase, UM_PHASE.return, "the lever is off, and the backplane still runs the return");
	box.run(400);
	assert.equal(u.phase, UM_PHASE.off);
	assert.equal(u.power, false);
});

test("a PDP-7 argues with it: switch it on until it has won five times, and it still wins", () => {
	const r = assemble([
		{
			name: "fight.s",
			text: `
umsf=iot 5601
umrc=iot 5612
umon=iot 5604
100/
fight,	umrc		/ how many times has it won?
	sad (5
	hlt
	umsf		/ on?
	umon		/ off: switch it back on
	jmp fight
	start fight
`,
		},
	]);
	assert.deepEqual(r.errors, []);
	const cpu = new Pdp7({ coreWords: 256 });
	loadAsm(cpu, r);
	cpu.pc = r.start ?? 0o100;
	const u = new UltimateMachine({ wait: 40, open: 40, reach: 40, press: 20, return: 40, close: 40, rest: 40 });
	const box = new Cabinet({ cpu, devices: [u] });
	assert.ok(box.run(10_000).halt);
	assert.equal(u.presses, 5);
	assert.equal(u.ons, 5, "switched on again each time the hand let go, and it went straight back out");
	assert.equal(u.aborts, 0);
	assert.equal(cpu.ac, 5);
	assert.equal(u.lever, false, "the CPU stopped with the finger on the lever");
	for (let i = 0; i < 200; i += 1) box.step(); // the CPU is halted; the backplane still runs
	assert.equal(u.phase, UM_PHASE.off, "and the box has the last word");
	assert.equal(u.power, false);
});

test("an unpowered unit with no offIot answers nothing, and setPower brings it back", () => {
	let resets = 0;
	const plain: Device = { name: "plain", iots: [0o57], iot: (r) => ({ ac: r.ac + 1, skip: true }), reset: () => void (resets += 1) };
	const box = new Cabinet({ cpu: new Pdp7({ coreWords: 64 }), devices: [plain] });
	const io = (r: Iot): IotReply => (box as unknown as { dispatch(i: Iot): IotReply }).dispatch(r);
	const req = { device: 0o57, pulse: 0o01, ac: 7 };
	assert.deepEqual(io(req), { ac: 8, skip: true });
	box.setPower("plain", false);
	assert.deepEqual(io(req), { ac: 7 }, "a dead unit: the AC goes through, no skip");
	box.setPower("plain", true);
	assert.equal(resets, 1, "power-on reset");
	assert.deepEqual(io(req), { ac: 8, skip: true });
});

// --- The Forth side: code.fs, interrupt.fs and ultimate.fs on Mitch's kernel ---

const tape = (f: string) => readFileSync(new URL(`../tapes/pdp7forth/${f}`, import.meta.url), "utf8");
let image: ForthImage | null = null;
function ultimateImage(): ForthImage {
	image ??= compileForth({
		kernel: assembleForthKernel({
			sop: readFileSync(new URL("../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
			kernel: tape("kernel-names-full.s"),
			end: tape("end.s"),
			kernelName: "kernel-names-full.s",
		}),
		sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "interrupt.fs", "tags.fs", "ultimate.fs"].map(tape),
	});
	return image;
}

function forthMachine(opts: UltimateOpts) {
	const img = ultimateImage();
	const cpu = new Pdp7({ coreWords: 8192 });
	let paper = "";
	let last: Segment[] = [];
	const pen = new LightPen({ aperture: 8, enabled: false });
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		pens: [pen],
		onFrame: (f) => {
			const lit = f.segments.filter((s) => s.intensify);
			if (lit.length > 0) last = lit;
		},
	});
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const u = new UltimateMachine(opts);
	const box = new Cabinet({ cpu, devices: [t340, tty, u] });
	t340.clock = () => box.cycles;
	bootForth(cpu, img);
	box.run(300_000);
	const type = (text: string) => {
		for (const ch of text) tty.type((ch === "\n" ? 0o15 : ch.toUpperCase().charCodeAt(0)) | 0o200);
	};
	const line = (text: string): string => {
		const from = paper.length;
		type(`${text}\n`);
		// Not "?" for an error, as forth.test.ts does: these words have ? in their names.
		for (let n = 0; n < 60 && !/ok\r\n$/.test(paper.slice(from)); n += 1) box.run(50_000);
		return paper.slice(from);
	};
	/** Run until `done`, at most `max` steps. */
	const until = (done: () => boolean, max: number): boolean => {
		for (let n = 0; n < max && !done(); n += 1000) box.run(1000);
		return done();
	};
	return { cpu, box, u, pen, line, type, until, paper: () => paper, frame: () => last, labels: img.labels };
}

const near = (s: Segment, x: number, y: number, d = 3) => Math.abs(s.x0 - x) <= d && Math.abs(s.y0 - y) <= d;

test("forth: CODE words laid down with , read and work the box, and the ranges are constants", () => {
	const m = forthMachine(QUICK);
	assert.match(m.line("UM-MAX . PH-MAX . PH-PRESS ."), / 1000 7 4\s+ok/);
	assert.match(m.line("JMP-NEXT ."), new RegExp(` ${(0o600000 | (m.labels.get("next") ?? -1)) - 0o1000000}\\s+ok`), "NEXT, borrowed from DUP");
	assert.match(m.line("UM-ON? . UM-BUSY? . UM-PHASE ."), / 0 0 0\s+ok/);
	m.line("8000 PH-WAIT UM-TIME!");
	assert.equal(m.u.timing.wait, 8000 * UM_TICK, "UMLT, through IOT-WRITE's pop");
	assert.match(m.line("77 UM-ON UM-ON? . UM-PHASE . ."), / -1 1 77\s+ok/, "every IOT word leaves the stack as it says");
	assert.match(m.line("UM-OFF UM-ON? . UM-PRESSES ."), / 0 0\s+ok/);
	assert.equal(m.u.aborts, 1);
});

test("forth: interrupts handled in Forth count every phase of a cycle while a loop runs", () => {
	const m = forthMachine(QUICK);
	m.line(": SPIN BEGIN UM-BUSY? 0= UNTIL ;");
	m.line("30 PH-WAIT UM-TIME! 30 PH-OPEN UM-TIME! 30 PH-REACH UM-TIME!");
	m.line("30 PH-PRESS UM-TIME! 30 PH-RETURN UM-TIME!");
	m.line("30 PH-CLOSE UM-TIME! 30 PH-REST UM-TIME!");
	m.line("' ON-INTERRUPT INTERRUPT-VECTOR ! -1 UM-IE! INTERRUPTS-ON");
	assert.equal(m.cpu.read(1) & 0o760000, 0o600000, "location 1 jumps to ISR");
	assert.match(m.line("77 0 CHANGES ! UM-ON SPIN 100 0 DO LOOP INTERRUPTS-OFF CHANGES @ . ."), / 7 77\s+ok/, "WAIT OPEN REACH PRESS RETURN CLOSE REST: OFF is the power going, and an unpowered box interrupts no one");
	assert.equal(m.u.presses, 1);
	assert.equal(m.u.phase, UM_PHASE.off);
	assert.equal(m.cpu.ion, false);
	const next = m.labels.get("next") ?? -1;
	assert.equal(m.cpu.read(next), 0o420010, "NEXT is xct i 010 again");
	assert.match(m.line("2 3 + ."), / 5\s+ok/, "and Forth is none the worse");
});

test("forth: ULTIMATE draws the box from its registers, and the light pen on the switch turns it on", () => {
	const m = forthMachine({ wait: 20_000, open: 30_000, reach: 300_000, press: 40_000, return: 60_000, close: 30_000, rest: 20_000 });
	m.type("ULTIMATE\n");
	assert.ok(m.until(() => m.frame().length > 20, 2_000_000), "a picture");
	const lever = (x: number) => m.frame().some((s) => near(s, 400, 470) && Math.abs(s.x1 - x) <= 3 && Math.abs(s.y1 - 512) <= 3);
	const armOut = () => m.frame().some((s) => near(s, 600, 380));
	assert.ok(lever(370), "the lever leans left: off");
	assert.ok(!armOut(), "and the hand is in the box");

	m.pen.point(400, 420); // on the switch's plate
	m.pen.enabled = true;
	assert.ok(m.until(() => m.u.lever, 1_000_000), "the pen switched it on");
	assert.ok(m.until(() => lever(430), 500_000), "the lever leans right: on");
	assert.ok(m.until(() => m.u.phase === UM_PHASE.reach && m.u.arm > 600, 1_000_000));
	assert.ok(m.until(armOut, 300_000), "the arm is drawn coming out");
	assert.ok(m.until(() => m.u.presses === 1, 1_000_000), "and the hand switched it off");
	m.box.run(300_000);
	assert.equal(m.u.ons, 1, "the pen still held there switches it on once per touch, not once per frame");

	m.pen.enabled = false;
	assert.ok(m.until(() => m.u.phase === UM_PHASE.off, 2_000_000));
	m.box.run(300_000);
	assert.ok(lever(370) && !armOut(), "back in the box, lid shut, lever off");
	m.pen.enabled = true;
	assert.ok(m.until(() => m.u.ons === 2, 1_000_000), "touch it again and it goes again");
	m.pen.enabled = false;

	const from = m.paper().length;
	m.type("\n");
	assert.ok(m.until(() => /ok\r\n$/.test(m.paper().slice(from)), 2_000_000), "a key ends it");
	assert.equal(m.cpu.ion, false);
	assert.ok(m.until(() => m.u.presses === 2, 2_000_000), "the box goes on without the program, and wins again");
	assert.match(m.line("UM-PRESSES ."), / 2\s+ok/);
});

test("forth: the menu's demo, at the menu's timing, touches the switch twice and the hand wins twice", () => {
	const menu = Object.fromEntries(Object.entries(UM_DEFAULT_TIMING).map(([k, v]) => [k, v * 4]));
	const m = forthMachine(menu);
	for (const step of ultimateDemo({ cpu: m.cpu, pen: m.pen, type: m.type })) if (typeof step === "number") m.box.run(step);
	assert.equal(m.u.ons, 2);
	assert.ok(m.until(() => m.u.presses === 2, 8_000_000));
});

test("forth: every part is tagged with its name, the lamps are captioned, and ON/OFF follows the lever", () => {
	const m = forthMachine({ wait: 20_000, open: 30_000, reach: 300_000, press: 40_000, return: 60_000, close: 30_000, rest: 20_000 });
	m.type("ULTIMATE\n");
	assert.ok(m.until(() => m.frame().length > 20, 2_000_000), "a picture");
	const read = (a: number) => m.cpu.read(a);
	const titles = () => new Set(m.frame().map((s) => readTag(read, s.tag)?.title ?? ""));
	const t = titles();
	for (const name of ["OFF", "WAIT", "OPEN", "REACH", "PRESS", "RETURN", "CLOSE", "REST"]) assert.ok(t.has(name), `lamp ${name} tagged`);
	for (const name of ["The box", "The lid", "The lever", "The switch: tap it with the pen", "How far the lid is open"]) assert.ok(t.has(name), name);
	const spelled = (tag: string) => strokeText(m.frame().filter((s) => readTag(read, s.tag)?.title === tag));
	assert.equal(spelled("RETURN"), "RETURN", "the RETURN lamp's caption is drawn in 342 text, under its tag");
	assert.equal(spelled("The switch: tap it with the pen"), "OFF");
	const returnLamp = m.frame().filter((s) => readTag(read, s.tag)?.title === "RETURN" && s.ch < 0);
	assert.ok(returnLamp.some((s) => near(s, 5 * 64 + 312, 200)), "the lamp square carries the tag too");
	const untagged = m.frame().filter((s) => s.tag === 0);
	assert.equal(untagged.length, 0, "nothing on the tube is anonymous");

	m.pen.point(400, 420);
	m.pen.enabled = true;
	assert.ok(m.until(() => m.u.lever, 1_000_000));
	m.pen.enabled = false;
	assert.ok(m.until(() => spelled("The switch: tap it with the pen") === "ON", 500_000), "the caption says ON");
	assert.ok(m.until(() => m.u.presses === 1, 2_000_000));
	assert.ok(m.until(() => spelled("The switch: tap it with the pen") === "OFF", 500_000), "and OFF again when the hand wins");
	m.type("\n");
});

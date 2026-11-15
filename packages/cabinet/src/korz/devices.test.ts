import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "../cabinet.js";
import { assembleForthKernel, bootForth, compileForth, type ForthImage } from "../forth.js";
import { Clock } from "../plugins/clock.js";
import { LightPen } from "../plugins/lightpen.js";
import { Pdp7, type Pdp7Opts } from "../plugins/pdp7.js";
import { Teletype } from "../plugins/teletype.js";
import { BlockletHost, TinyTitan } from "../plugins/tiny-titan.js";
import { TuringDevice } from "../plugins/turing.js";
import { Type340 } from "../plugins/type340.js";
import { UltimateMachine } from "../plugins/ultimate.js";
import { loadSymelec } from "../symelec-fixtures.js";
import { KorzPdp7 } from "./pdp7.js";

/**
 * The devices' Korz slots against their `iot()`: two cabinets built alike, one a `Pdp7` whose
 * backplane calls `iot()`, one a `KorzPdp7` whose sea holds the devices' slots, fed the same keys at
 * the same step. Registers must match at every step, and paper and device state at the end.
 */

type Make = (opts: Pdp7Opts) => Pdp7;
type Rig = { cpu: Pdp7; box: Cabinet; tty: Teletype; paper: () => string; state: () => string };

const regs = (c: Pdp7) => [c.pc, c.ac, c.link, c.mq, c.sc, c.ion, c.ionDefer, c.extend, c.halted].join(" ");

function pair(build: (make: Make) => Rig, korz: "interpret" | "resolve") {
	const a = build((o) => new Pdp7(o));
	const b = build((o) => new KorzPdp7({ ...o, korz }));
	assert.ok(b.cpu instanceof KorzPdp7);
	let steps = 0;
	const run = (n: number): void => {
		for (let i = 0; i < n; i += 1) {
			a.box.step();
			b.box.step();
			steps += 1;
			if (regs(a.cpu) !== regs(b.cpu)) assert.equal(regs(b.cpu), regs(a.cpu), `step ${steps}`);
		}
	};
	const type = (text: string): void => {
		for (const ch of text) {
			const code = (ch === "\n" ? 0o15 : ch.toUpperCase().charCodeAt(0)) | 0o200;
			a.tty.type(code);
			b.tty.type(code);
		}
	};
	const line = (text: string, max = 200): string => {
		const from = a.paper().length;
		type(`${text}\n`);
		for (let n = 0; n < max && !/ok\r\n$/.test(a.paper().slice(from)); n += 1) run(50_000);
		return a.paper().slice(from);
	};
	const same = (): void => {
		assert.equal(b.paper(), a.paper());
		assert.equal(b.state(), a.state());
	};
	return { a, b, run, type, line, same, steps: () => steps };
}

const tape = (name: string) => readFileSync(new URL(`../../tapes/pdp7forth/${name}`, import.meta.url), "utf8");
const images = new Map<string, ForthImage>();
function forth(last: string): ForthImage {
	let img = images.get(last);
	if (!img) {
		img = compileForth({
			kernel: assembleForthKernel({
				sop: readFileSync(new URL("../../tapes/pdp7unix/sop.s", import.meta.url), "utf8"),
				kernel: tape("kernel-names-full.s"),
				end: tape("end.s"),
				kernelName: "kernel-names-full.s",
			}),
			sources: ["prelude.fs", "does.fs", "turtle.fs", "code.fs", "interrupt.fs", "tags.fs", ...last.split(" ")].map(tape),
		});
		images.set(last, img);
	}
	return img;
}

const frame = (t: Type340): string => JSON.stringify(t.lastFrame?.segments ?? []);

function symelec(make: Make): Rig {
	const cpu = make({ coreWords: 8192 });
	loadSymelec(cpu, ["core8k"]);
	const t = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const tty = new Teletype({ printCycles: 1000 });
	const clock = new Clock({ cpu });
	const titan = new TinyTitan();
	const box = new Cabinet({ cpu, devices: [t, tty, clock, titan] });
	t.clock = () => box.cycles;
	cpu.pc = 0o22;
	return { cpu, box, tty, paper: () => "", state: () => `${frame(t)} ${clock.flag} ${titan.flag}` };
}

function symelecTitan(make: Make) {
	const cpu = make({ coreWords: 8192 });
	loadSymelec(cpu);
	const host = new BlockletHost([0o24]);
	const pen = new LightPen({ aperture: 12, name: "pointer", enabled: false });
	const t = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), pens: [pen] });
	const tty = new Teletype({ printCycles: 200 });
	const titan = new TinyTitan({ port: host });
	const box = new Cabinet({ cpu, devices: [t, tty, new Clock({ cpu }), titan] });
	t.clock = () => box.cycles;
	cpu.pc = 0o22;
	const state = () => `${frame(t)} ${host.received.join(",")} ${host.controls.join(",")} ${host.disconnected}`;
	return { cpu, box, tty, pen, host, paper: () => tty.printed(), state };
}

function turing(make: Make): Rig {
	const cpu = make({ coreWords: 8192 });
	let paper = "";
	const t = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const tm = new TuringDevice({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w), rate: 1 / 3 });
	const box = new Cabinet({ cpu, devices: [t, tty, tm] });
	t.clock = () => box.cycles;
	bootForth(cpu, forth("turing.fs pcomp-tm.fs"));
	const e = tm.engine;
	return { cpu, box, tty, paper: () => paper, state: () => `${frame(t)} ${e.status} ${e.state} ${e.count} ${e.head}` };
}

function ultimate(make: Make): Rig {
	const cpu = make({ coreWords: 8192 });
	let paper = "";
	const t = new Type340({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const tty = new Teletype({ printCycles: 1000, onPrint: (c) => (paper += String.fromCharCode(c & 0o177)) });
	const u = new UltimateMachine({ wait: 10, open: 10, reach: 10, press: 10, return: 10, close: 10, rest: 10 });
	const box = new Cabinet({ cpu, devices: [t, tty, u] });
	t.clock = () => box.cycles;
	bootForth(cpu, forth("ultimate.fs"));
	return { cpu, box, tty, paper: () => paper, state: () => `${frame(t)} ${u.presses} ${u.phase} ${u.ons} ${u.lever}` };
}

for (const korz of ["interpret", "resolve"] as const) {
	test(`korz devices, ${korz}: SYMELEC on the 340, teletype, clock and Tiny Titan`, () => {
		const p = pair(symelec, korz);
		p.run(korz === "interpret" ? 1_000_000 : 4_000_000);
		p.same();
	});
}

test("korz devices: SYMELEC sends a drawn line over the Tiny Titan link", () => {
	const p = pair(symelecTitan, "resolve");
	const rigs = [p.a, p.b] as ReturnType<typeof symelecTitan>[];
	const cross = (): [number, number] => [p.a.cpu.read(0o5641) & 0o1777, p.a.cpu.read(0o5640) & 0o1777];
	const pen = (x: number, y: number, on: boolean): void => {
		for (const r of rigs) {
			r.pen.point(x, y);
			r.pen.enabled = on;
		}
	};
	p.run(3_000_000);
	const pressS = (): void => {
		const [x, y] = cross();
		pen(x - 50, y + 32, true);
		p.run(20_000);
		pen(x - 50, y + 32, false);
		p.run(20_000);
	};
	const drag = (x1: number, y1: number): void => {
		const [x, y] = cross();
		for (let i = 1; i <= 40; i += 1) {
			pen(Math.round(x + ((x1 - x) * i) / 40), Math.round(y + ((y1 - y) * i) / 40), true);
			p.run(6_000);
		}
		pen(x1, y1, false);
		p.run(20_000);
	};
	pressS();
	drag(400, 300);
	drag(400, 400);
	pressS();
	for (const r of rigs) {
		for (const ch of "TITAN") r.tty.type(ch.charCodeAt(0) | 0o200);
		r.tty.type(0o215);
	}
	p.run(3_000_000);
	assert.equal(rigs[0]!.host.received.length, 0o24, "the picture went over the link");
	assert.equal(rigs[0]!.host.disconnected, true);
	p.same();
});

test("korz devices: the Turing engine runs BUSY2 on the 340 from Forth", () => {
	const p = pair(turing, "resolve");
	p.run(300_000);
	p.line("BUSY2");
	p.line("STEP");
	p.line("RUN");
	assert.match(p.a.paper(), /ok/);
	p.same();
});

test("korz devices: the Turing engine runs free at 0 SPEED until a key", () => {
	const p = pair(turing, "resolve");
	p.run(300_000);
	p.line("BCOUNT");
	p.line("0 SPEED");
	p.type("RUN\n");
	p.run(3_000_000);
	assert.equal(p.line("X"), " ok\r\n  ok\r\n");
	p.same();
});

test("korz devices: the Ultimate Machine, its phase interrupts, and powering itself off", () => {
	const p = pair(ultimate, "resolve");
	p.run(300_000);
	p.line("8000 PH-WAIT UM-TIME!");
	assert.match(p.line("77 UM-ON UM-ON? . UM-PHASE . ."), / -1 1 77\s+ok/);
	p.line("UM-OFF");
	p.line(": SPIN BEGIN UM-BUSY? 0= UNTIL ;");
	p.line("30 PH-WAIT UM-TIME! 30 PH-OPEN UM-TIME! 30 PH-REACH UM-TIME!");
	p.line("30 PH-PRESS UM-TIME! 30 PH-RETURN UM-TIME!");
	p.line("30 PH-CLOSE UM-TIME! 30 PH-REST UM-TIME!");
	p.line("' ON-INTERRUPT INTERRUPT-VECTOR ! -1 UM-IE! INTERRUPTS-ON");
	assert.match(p.line("77 0 CHANGES ! UM-ON SPIN 100 0 DO LOOP INTERRUPTS-OFF CHANGES @ . ."), / 7 77\s+ok/);
	p.same();
});

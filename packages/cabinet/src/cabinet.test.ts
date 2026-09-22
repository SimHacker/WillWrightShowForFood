import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Device, Iot, IotReply } from "./bus.js";
import { Cabinet } from "./cabinet.js";
import { loadOct } from "./loader.js";
import { Clock } from "./plugins/clock.js";
import { LightPen } from "./plugins/lightpen.js";
import { Pdp7, pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { Type340 } from "./plugins/type340.js";

test("LAC / DAC / JMP", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.deposit(0, [pdp7.mr(pdp7.lac, 0o40), pdp7.mr(pdp7.dac, 0o41), pdp7.mr(pdp7.jmp, 0o00)]);
	cpu.write(0o40, 0o123);
	const box = new Cabinet({ cpu });
	box.step();
	assert.equal(cpu.ac, 0o123);
	box.step();
	assert.equal(cpu.read(0o41), 0o123);
	box.step();
	assert.equal(cpu.pc, 0);
});

test("unclaimed IOT is a no-op", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.ac = 0o77;
	cpu.deposit(0, [pdp7.iotWord(0o66, 1)]);
	const box = new Cabinet({ cpu });
	box.step();
	assert.equal(cpu.ac, 0o77);
	assert.equal(cpu.pc, 1);
});

test("light pen hit-tests the segments just drawn", () => {
	const crt = new Type340();
	const pen = new LightPen({ display: crt, aperture: 4 });
	crt.vector(0, 0, 100, 0);
	pen.point(50, 1);
	assert.equal(pen.flag, true);
	pen.point(50, 20);
	assert.equal(pen.flag, false);
});

test("cabinet wires CPU IOTs to a device without the CPU knowing the tube", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	const crt = new Type340();
	const pen = new LightPen({ display: crt });
	crt.vector(10, 10, 10, 10);
	pen.point(10, 10);
	cpu.deposit(0, [pdp7.iotWord(0o11, 0)]);
	const box = new Cabinet({ cpu, devices: [crt, pen] });
	assert.equal(cpu.pc, 0);
	box.step();
	assert.equal(cpu.pc, 2, "pen flag skips");
});

function bench(words: number[], coreWords = 256): { cpu: Pdp7; box: Cabinet } {
	const cpu = new Pdp7({ coreWords });
	cpu.deposit(0o100, words);
	cpu.pc = 0o100;
	const box = new Cabinet({ cpu });
	return { cpu, box };
}

test("OPR: CLA CLL CMA CML, rotates, skips, HLT", () => {
	// CLA CLL CMA CML = 750003 → AC all ones, link 1
	const { cpu, box } = bench([0o750003]);
	box.step();
	assert.equal(cpu.ac, 0o777777);
	assert.equal(cpu.link, 1);

	// RAL rotates link'AC left: link<-AC0, AC0<-...<-link
	cpu.deposit(0o100, [0o740010]); // RAL
	cpu.pc = 0o100;
	cpu.ac = 0o400000;
	cpu.link = 0;
	box.step();
	assert.equal(cpu.ac, 0);
	assert.equal(cpu.link, 1, "sign rotated into link");

	// RTR 742020 rotates link'AC right twice
	cpu.deposit(0o100, [0o742020]);
	cpu.pc = 0o100;
	cpu.ac = 0o3;
	cpu.link = 0;
	box.step();
	assert.equal(cpu.link, 1, "bit 1 landed in link");
	assert.equal(cpu.ac, 0o400000, "bit 0 landed in the sign");

	// SZA skips when AC zero
	cpu.deposit(0o100, [0o740200, 0o740040, 0o740040]); // SZA, HLT, HLT
	cpu.pc = 0o100;
	cpu.ac = 0;
	cpu.link = 0;
	box.step();
	assert.equal(cpu.pc, 0o102, "SZA skipped");
	box.step();
	assert.ok(cpu.halted, "HLT halts");
});

test("LAW loads the instruction word itself", () => {
	const { cpu, box } = bench([pdp7.law(0o1234)]);
	box.step();
	assert.equal(cpu.ac, 0o761234);
});

test("auto-index: indirect through 10-17 increments before use", () => {
	const { cpu, box } = bench([pdp7.mr(pdp7.lac, 0o10, true)]);
	cpu.write(0o10, 0o200); // will step to 0o201 before use
	cpu.write(0o201, 0o4321);
	box.step();
	assert.equal(cpu.read(0o10), 0o201);
	assert.equal(cpu.ac, 0o4321);
});

test("XCT executes the target in place", () => {
	const { cpu, box } = bench([pdp7.mr(pdp7.xct, 0o60)]);
	cpu.write(0o60, pdp7.mr(pdp7.lac, 0o61));
	cpu.write(0o61, 0o55);
	box.step();
	assert.equal(cpu.ac, 0o55);
	assert.equal(cpu.pc, 0o101, "pc advanced past the XCT only");
});

test("EAE: LACQ, LRS, LLS, MUL, DIV", () => {
	// LACQ 641002: clear AC, or MQ
	const { cpu, box } = bench([0o641002]);
	cpu.mq = 0o1234;
	cpu.ac = 0o777777;
	box.step();
	assert.equal(cpu.ac, 0o1234);

	// LRS 4 (640504): AC'MQ right 4, fill from link (0)
	cpu.deposit(0o100, [0o640504]);
	cpu.pc = 0o100;
	cpu.ac = 0o17;
	cpu.mq = 0;
	cpu.link = 0;
	box.step();
	assert.equal(cpu.ac, 0o0);
	assert.equal(cpu.mq, 0o740000, "low AC bits shifted into high MQ");

	// MUL (641122 = CLA + multiply 18 steps), operand next word: 5 * 3
	cpu.deposit(0o100, [0o641122, 0o3]);
	cpu.pc = 0o100;
	cpu.mq = 0o5; // multiplier in MQ
	cpu.ac = 0;
	cpu.link = 0;
	box.step();
	assert.equal(cpu.mq, 15, "product low in MQ");
	assert.equal(cpu.ac, 0, "product high in AC");
	assert.equal(cpu.pc, 0o102, "operand word consumed");

	// DIVS-style signed divide (644323), 100 / 7 = 14 r 2
	cpu.deposit(0o100, [0o644323, 0o7]);
	cpu.pc = 0o100;
	cpu.ac = 0; // dividend high
	cpu.mq = 100; // dividend low
	cpu.link = 0;
	box.step();
	assert.equal(cpu.mq, 14, "quotient in MQ");
	assert.equal(cpu.ac, 2, "remainder in AC");
});

test("interrupt: save PC with link at 0, jump to 1, ION delays one instruction", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	const tty = new Teletype({ printCycles: 4 });
	const box = new Cabinet({ cpu, devices: [tty] });
	// Handler at 1: JMP 50 (just proves entry). Main: ION; NOP; NOP…
	cpu.write(1, pdp7.mr(pdp7.jmp, 0o50));
	cpu.deposit(0o100, [pdp7.iotWord(0, 0o42), 0o740000, 0o740000, 0o740000]);
	cpu.pc = 0o100;
	cpu.link = 1;
	tty.type(0o301); // keyboard flag up before ION
	box.step(); // ION (defer)
	assert.equal(cpu.pc, 0o101);
	box.step(); // one instruction executes under the defer
	assert.equal(cpu.pc, 0o102, "defer lets one instruction run");
	box.step(); // interrupt entry, then handler JMP 50
	assert.equal(cpu.pc, 0o50, "handler entered");
	assert.equal(cpu.read(0), (1 << 17) | 0o102, "link in sign bit, PC saved at 0");
	assert.equal(cpu.ion, false, "interrupts off in handler");
});

test("teletype: KSF/KRB and TSF/TLS round trip", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	const tty = new Teletype({ printCycles: 2 });
	const box = new Cabinet({ cpu, devices: [tty] });
	// KSF; JMP .-1; KRB; TLS; TSF; JMP .-1; HLT
	cpu.deposit(0o100, [
		pdp7.iotWord(0o03, 0o01), // KSF
		pdp7.mr(pdp7.jmp, 0o100),
		pdp7.iotWord(0o03, 0o12), // KRB
		pdp7.iotWord(0o04, 0o06), // TLS
		pdp7.iotWord(0o04, 0o01), // TSF
		pdp7.mr(pdp7.jmp, 0o104),
		0o740040, // HLT
	]);
	cpu.pc = 0o100;
	box.step();
	assert.equal(cpu.pc, 0o101, "no key yet: KSF does not skip");
	tty.type(0o105); // 'E'
	box.run(50);
	assert.ok(cpu.halted);
	assert.equal(tty.output[0], 0o105, "echoed the key");
});

test("clock: CLON, core location 7 counts, overflow raises flag and interrupts", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	const clock = new Clock({ cpu, cyclesPerTick: 1 });
	const box = new Cabinet({ cpu, devices: [clock] });
	cpu.write(1, pdp7.mr(pdp7.jmp, 0o50));
	cpu.write(0o50, 0o740040); // HLT proves the handler ran
	cpu.write(0o7, 0o777776); // two ticks to overflow
	cpu.deposit(0o100, [
		pdp7.iotWord(0, 0o44), // CLON
		pdp7.iotWord(0, 0o42), // ION
		0o740000,
		0o740000,
		0o740000,
	]);
	cpu.pc = 0o100;
	box.run(10);
	assert.ok(cpu.halted, "clock overflow interrupted into the handler");
	// The clock keeps ticking during interrupt entry and the handler,
	// so the counter has moved past zero by halt time.
	assert.ok(cpu.read(0o7) < 0o10, "counter wrapped past zero");
});

/** Records every IOT reaching the display device codes. */
class IotRecorder implements Device {
	readonly name = "recorder";
	readonly iots: readonly number[];
	seen: Array<{ device: number; pulse: number }> = [];
	constructor(iots: readonly number[]) {
		this.iots = iots;
	}
	iot(req: Iot): IotReply {
		this.seen.push({ device: req.device, pulse: req.pulse });
		return { ac: req.ac };
	}
}

/** Titan link stub: never leave a flag hanging — LSF always skips. */
class TitanStub implements Device {
	readonly name = "titan";
	readonly iots = [0o22, 0o23];
	iot(req: Iot): IotReply {
		return { ac: req.ac, skip: (req.pulse & 0o1) === 0o1 };
	}
}

// The .oct stops at 11741, but the 1972 assembler put the literal pool at
// 12066-12257 (listing pages 105-106): every `(literal` operand — including
// location 1's JMP INT and the free-list loop's TAD (400001 — read zero
// until symelec-literals.oct (regenerated by scripts/extract-literals.mjs)
// is loaded on top.
test("acceptance: SYMELEC boots and issues IDLA", () => {
	const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
	const cpu = new Pdp7({ coreWords: 8192 });
	const range = loadOct(cpu, readFileSync(new URL(`${dir}symelec.oct`, import.meta.url), "utf8"));
	assert.equal(range.low, 0o21);
	loadOct(cpu, readFileSync(new URL(`${dir}symelec-literals.oct`, import.meta.url), "utf8"));

	const display = new IotRecorder([0o05, 0o06, 0o07, 0o10]);
	const tty = new Teletype({ printCycles: 1000 });
	const clock = new Clock({ cpu });
	const box = new Cabinet({ cpu, devices: [display, tty, clock, new TitanStub()] });

	cpu.pc = 0o22; // JMP BEGRTP
	box.run(2_000_000);

	const idla = display.seen.find((s) => s.device === 0o06 && s.pulse === 0o06);
	assert.ok(
		idla,
		`IDLA not issued; display IOTs seen: ${JSON.stringify(display.seen.slice(0, 10))}; pc=${cpu.pc.toString(8)} halted=${cpu.halted}`,
	);
	assert.equal(cpu.read(1), 0o605320, "JMP INT deposited at location 1 from the literal pool");
	assert.equal(cpu.ion, true, "interrupts enabled after boot");
	assert.equal(cpu.halted, false, "main loop is idling, not halted");
});

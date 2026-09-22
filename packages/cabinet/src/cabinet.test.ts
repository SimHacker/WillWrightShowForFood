import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Device, Iot, IotReply } from "./bus.js";
import { Cabinet } from "./cabinet.js";
import { loadOct } from "./loader.js";
import { toSvg, toYaml } from "./media.js";
import { Clock } from "./plugins/clock.js";
import { LightPen } from "./plugins/lightpen.js";
import { Pdp7, pdp7 } from "./plugins/pdp7.js";
import { Teletype } from "./plugins/teletype.js";
import { BlockletHost, EchoPort, TinyTitan } from "./plugins/tiny-titan.js";
import { MODE, ST340_HEDGE, ST340_LPHIT, Type340 } from "./plugins/type340.js";

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

/** A 340 over a bare 4K memory, display file deposited at 0o100, started via IDLA. */
function crt(words: number[], pens: LightPen[] = []): { t: Type340; mem: Uint32Array } {
	const mem = new Uint32Array(4096);
	words.forEach((w, i) => {
		mem[0o100 + i] = w;
	});
	const t = new Type340({
		fetch: (a) => mem[a] ?? 0,
		store: (a, w) => {
			mem[a] = w;
		},
		pens,
	});
	t.iot({ device: 0o06, pulse: 0o06, ac: 0o100 }); // IDLA
	return { t, mem };
}

test("340 decode: the listing's own words drive the mode machine", () => {
	// The LBD lightbutton file's opening block, listing page 1:
	//   PAR SB SC1 IN7 · DJS SB ,2 · (embedded CPU JMP) · DDS CH 3 · "S"+ESC
	const { t, mem } = crt([
		0o160137, // PAR SB SC1 IN7 — param: next mode SUBR, scale 2, intensity 7
		0o760104, // DJS SB ,2 — jump-and-save to 0o104, next mode SUBR
		0o605751, // embedded JMP SD — pen-dispatch data, never display-executed
		0o000000,
		0o260003, // DDS CH 3 — deposit "DJP <return>" at loc 3, next mode CHAR
		0o233700, // 'S' then ESC
		0o003000, // param: stop + stop-interrupt
	]);
	t.tick(); // PAR
	assert.equal(t.mode, MODE.SUBR);
	assert.equal(t.scale, 2, "SC1 is a multiplier of 2");
	assert.equal(t.intensity, 7, "IN7");
	t.tick(); // DJS
	assert.equal(t.dac, 0o104, "jumped over the embedded JMP");
	assert.equal(t.asr, 0o102, "return address saved");
	t.tick(); // DDS
	assert.equal(mem[3], 0o400102, "DJP <return> deposited at 3 — the pen-dispatch linkage");
	assert.equal(t.mode, MODE.CHAR);
	t.tick(); // 'S' ESC
	const charDots = t.segments.filter((s) => s.kind === "char");
	assert.ok(charDots.length > 10, "the S was drawn");
	assert.equal(charDots[0]?.subr, 0o102, "strokes grouped under their pen-dispatch identity");
	assert.equal(t.mode, MODE.PARAM, "ESC escaped to param");
	// DDS answered SIMH's `/* clear SAVE_FF? */`: fall through, don't return.
	assert.equal(t.dac, 0o106, "sequential after ESC — DDS cleared the save flip-flop");
	t.tick(); // stop word
	assert.notEqual(t.status, 0, "stop code freezes the display");
	assert.ok(t.irq(), "stop-interrupt raises the IRQ line");
	assert.equal(t.iot({ device: 0o06, pulse: 0o01, ac: 0 }).skip, true, "IDSI skips");
});

test("340 decode: VEC ES moves the beam and escapes; edge freezes; IDLA restarts", () => {
	// VEC ES from PSD's row in the listing: 405410 = escape, no intensify, dy 13, dx 10.
	const { t } = crt([0o100000 /* param -> VECTOR */, 0o405410]);
	t.tick();
	t.tick();
	assert.equal(t.x, 0o10);
	assert.equal(t.y, 0o13);
	assert.equal(t.mode, MODE.PARAM, "ES escaped");
	assert.equal(t.segments.at(-1)?.intensify, false, "beam move, not a stroke");

	// Drive the beam off the left edge: x violation is HEDGE (SYMELEC's
	// EDGEH adjusts XCROSS), and the freeze holds until IDLA restarts.
	const { t: e } = crt([0o100000, 0o200201 /* intensify, sx=1, dx=1 from (0,0) */]);
	e.tick();
	e.tick();
	assert.ok(e.status & ST340_HEDGE, "x violation raises HEDGE");
	assert.equal(e.iot({ device: 0o10, pulse: 0o01, ac: 0 }).skip, true, "IDHE skips");
	const dacBefore = e.dac;
	e.tick();
	assert.equal(e.dac, dacBefore, "frozen: no fetch while a flag is up");
	e.iot({ device: 0o06, pulse: 0o06, ac: 0o100 }); // IDLA — the EDGEH handler's recovery
	assert.equal(e.status, 0, "IDLA clears all flags");
	assert.equal(e.dac, 0o100, "restarted at the top of the file");
});

test("340 pen: fresh-stroke hit freezes, IDSP skips, IDRC packs what TRCR unrotates", () => {
	const pen = new LightPen({ aperture: 4, name: "mouse" });
	pen.point(8, 0);
	const { t } = crt(
		[
			0o114000, // param: next mode VECTOR, load lp enable = on
			0o200020, // vector: intensify, dx=0o20 right
		],
		[pen],
	);
	t.tick();
	t.tick();
	assert.ok(t.status & ST340_LPHIT, "pen saw the blue flash");
	assert.equal(t.lastHitPen?.name, "mouse", "provenance: who hit");
	assert.equal(t.lastHit?.kind, "vector", "provenance: what was hit");
	assert.equal(t.iot({ device: 0o07, pulse: 0o01, ac: 0 }).skip, true, "IDSP skips");

	// IDRC packing vs TRCR's unrotation (listing 5467-5501):
	//   AC = (x>>1)<<9 | (y>>1); TEMPY = (AC<<1)&1776; TEMPX = (AC>>8)&1776.
	const ac = t.iot({ device: 0o07, pulse: 0o12, ac: 0o777777 }).ac;
	assert.equal(ac, ((t.penX >> 1) << 9) | (t.penY >> 1));
	assert.equal((ac << 1) & 0o1776, t.penY & 0o1776, "TEMPY recovers y");
	assert.equal((ac >> 8) & 0o1776, t.penX & 0o1776, "TEMPX recovers x");

	// IDRS resumes in place without restarting the file.
	const dacAfterHit = t.dac;
	t.iot({ device: 0o05, pulse: 0o04, ac: 0 });
	assert.equal(t.status, 0);
	assert.equal(t.dac, dacAfterHit, "resumed, not restarted");
});

test("340 pen: multiple pens share one flag — 1972 software cannot tell", () => {
	const heinz = new LightPen({ aperture: 4, name: "sim-heinz" });
	const mouse = new LightPen({ aperture: 4, name: "mouse" });
	heinz.point(500, 500); // nowhere near the stroke
	mouse.point(8, 0);
	const { t } = crt([0o114000, 0o200020], [heinz, mouse]);
	t.tick();
	t.tick();
	assert.ok(t.status & ST340_LPHIT);
	assert.equal(t.lastHitPen?.name, "mouse", "the pen over the stroke fired, not the other");

	// IDPN 701112 — the cabinet extension: which pen? Numbered 1..8, 0 = none.
	// New software can multiplex; 1972 software never issues dev 011.
	assert.equal(t.iot({ device: 0o11, pulse: 0o01, ac: 0 }).skip, true, "IDPN skips: pen latched");
	assert.equal(t.iot({ device: 0o11, pulse: 0o12, ac: 0o777777 }).ac, 2, "mouse is pen 2");
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

test("tiny-titan: word round trip through the echo port; portless never wedges", () => {
	const port = new EchoPort();
	const titan = new TinyTitan({ port });
	// LKE!LLB6 with AC=4 — the session opener, "hello, headers please"
	titan.iot({ device: 0o23, pulse: 0o64, ac: 0o760004 });
	assert.deepEqual(port.controls, [4]);
	// LLB18!LLAM sends two words
	titan.iot({ device: 0o22, pulse: 0o64, ac: 0o767676 });
	titan.iot({ device: 0o22, pulse: 0o64, ac: 0o123456 });
	assert.equal(titan.iot({ device: 0o22, pulse: 0o01, ac: 0 }).skip, true, "LSF: word ready");
	// LRB18 reads them back (CPU clears AC via bit 0o10 before the pulse)
	assert.equal(titan.iot({ device: 0o22, pulse: 0o42, ac: 0 }).ac, 0o767676);
	assert.equal(titan.iot({ device: 0o22, pulse: 0o66, ac: 0 }).ac, 0o123456);
	// Drained + LCF: flag down, nothing waiting
	titan.iot({ device: 0o22, pulse: 0o22, ac: 0 });
	assert.equal(titan.iot({ device: 0o22, pulse: 0o01, ac: 0 }).skip, false, "LSF: idle");
	// LKD disconnects
	titan.iot({ device: 0o23, pulse: 0o22, ac: 0 });
	assert.equal(port.disconnected, true);

	// The rung-1 stub: no port, LSF always skips — WAITLK cannot wedge.
	const stub = new TinyTitan();
	assert.equal(stub.iot({ device: 0o22, pulse: 0o01, ac: 0 }).skip, true);
});

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
	const box = new Cabinet({ cpu, devices: [display, tty, clock, new TinyTitan()] });

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

test("acceptance: the 340 executes SYMELEC's own boot display file", () => {
	const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
	const cpu = new Pdp7({ coreWords: 8192 });
	loadOct(cpu, readFileSync(new URL(`${dir}symelec.oct`, import.meta.url), "utf8"));
	loadOct(cpu, readFileSync(new URL(`${dir}symelec-literals.oct`, import.meta.url), "utf8"));

	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
	});
	const box = new Cabinet({
		cpu,
		devices: [t340, new Teletype({ printCycles: 1000 }), new Clock({ cpu }), new TinyTitan()],
	});
	t340.clock = () => box.cycles;

	cpu.pc = 0o22;
	// Boot in chunks; stop once the display has drawn a picture's worth.
	for (let i = 0; i < 30 && t340.segments.length < 3000; i += 1) {
		box.run(100_000);
		if (cpu.halted) break;
	}

	assert.ok(t340.enabled, "IDLA started the display");
	assert.equal(cpu.halted, false);
	const drawn = t340.lastFrame?.segments ?? t340.segments;
	assert.ok(drawn.length > 100, `display file drew ${drawn.length} segments`);
	assert.ok(
		drawn.some((s) => s.kind === "char"),
		"the lightbutton letters were drawn — Lars's glyphs at work",
	);
	assert.ok(
		drawn.some((s) => s.kind === "vector" && s.intensify),
		"intensified vectors present",
	);
	assert.equal(cpu.read(3) & 0o400000, 0o400000, "DDS deposited pen-dispatch linkage at 3");

	// The media hooks eat the same stream.
	const svg = toSvg(drawn);
	assert.ok(svg.includes("<g data-subr="), "DJS subpictures became SVG groups");
	assert.ok(svg.includes("data-addr="), "provenance rides as data attributes");
	const yaml = toYaml({
		index: 0,
		cycleStart: 0,
		cycleEnd: box.cycles,
		segments: drawn.slice(0, 50),
	});
	assert.ok(yaml.includes("segments:"), "YAML capture emits");
});

// TRACKING.md documents the machinery this exercises: the pen-enabled cross
// at TRACK (0o5637) whose position words YCROSS/XCROSS (0o5640/0o5641) are
// patched in core by TRCR -> POSCR on every hit, with the SRAST raster as
// the local reacquisition net. No mode setup needed: the display file
// deposits `JMP STRCR` as the cross's dispatch linkage before DJP TRACK,
// so tracking is live from the boot picture onward.
test("acceptance: SYMELEC's 1972 tracking loop follows the virtual pen", () => {
	const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
	const cpu = new Pdp7({ coreWords: 8192 });
	loadOct(cpu, readFileSync(new URL(`${dir}symelec.oct`, import.meta.url), "utf8"));
	loadOct(cpu, readFileSync(new URL(`${dir}symelec-literals.oct`, import.meta.url), "utf8"));

	const pen = new LightPen({ aperture: 12, name: "pointer" });
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		pens: [pen],
	});
	const box = new Cabinet({
		cpu,
		devices: [t340, new Teletype({ printCycles: 1000 }), new Clock({ cpu }), new TinyTitan()],
	});
	t340.clock = () => box.cycles;

	cpu.pc = 0o22;
	for (let i = 0; i < 30 && !t340.lastFrame; i += 1) {
		box.run(100_000);
		if (cpu.halted) break;
	}
	assert.ok(t340.lastFrame, "boot picture is up");

	const YCROSS = 0o5640;
	const XCROSS = 0o5641;
	const crossX = () => cpu.read(XCROSS) & 0o1777;
	const crossY = () => cpu.read(YCROSS) & 0o1777;
	assert.equal(crossX(), 0o400, "cross parked at its start position");
	assert.equal(crossY(), 0o400);

	// Park the pen on the cross: hits recenter it in place, not away.
	let px = crossX();
	let py = crossY();
	pen.point(px, py);
	box.run(300_000);
	assert.ok(Math.abs(crossX() - px) <= 16, `acquired: x=${crossX()} pen=${px}`);
	assert.ok(Math.abs(crossY() - py) <= 16, `acquired: y=${crossY()} pen=${py}`);

	// Drag slowly — small steps, a frame or two of cycles each. TRCR reads
	// IDRC, POSCR patches the display file, the cross follows.
	for (let i = 0; i < 25; i += 1) {
		px += 4;
		py += 3;
		pen.point(px, py);
		box.run(100_000);
	}
	assert.ok(
		Math.abs(crossX() - px) <= 24,
		`cross followed the drag: x=${crossX()} pen=${px}`,
	);
	assert.ok(
		Math.abs(crossY() - py) <= 24,
		`cross followed the drag: y=${crossY()} pen=${py}`,
	);
	const followedX = crossX();
	const followedY = crossY();

	// The authentic failure mode: jump the pen far beyond the SRAST net.
	// Nothing lit there, no hits, the cross stays behind.
	pen.point(60, 900);
	box.run(500_000);
	assert.ok(Math.abs(crossX() - followedX) <= 8, "lost the pen: cross stayed");
	assert.ok(Math.abs(crossY() - followedY) <= 8, "lost the pen: cross stayed");
	assert.equal(cpu.halted, false);
});

// The command language: MESIN hashes the first three typed characters
// (SUMB = (SUMB<<6)+char) against MESL — LABEL, UNLABEL, TITAN, GRID,
// START. "TIT" in mark-parity ASCII hashes to the table's 271424.
// TITAN dispatches to MESIN5 -> JMS LTPX, whose 4-way skip return is
// checksum-fail / not-PIXIE / won't-fit / success. Our BlockletHost
// requests a write blocklet, so SYMELEC streams PXID, DSBEG, DSEND,
// SAVINS, then its own ring data — and displays its picture again on
// the success path.
test("acceptance: type TITAN and SYMELEC phones tiny-titan, PXID first", () => {
	const dir = "../../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/";
	const cpu = new Pdp7({ coreWords: 8192 });
	loadOct(cpu, readFileSync(new URL(`${dir}symelec.oct`, import.meta.url), "utf8"));
	loadOct(cpu, readFileSync(new URL(`${dir}symelec-literals.oct`, import.meta.url), "utf8"));

	const host = new BlockletHost([0o24]); // one blocklet: 4 heading + 16 data words
	const t340 = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
	});
	const tty = new Teletype({ printCycles: 200 });
	const box = new Cabinet({
		cpu,
		devices: [t340, tty, new Clock({ cpu }), new TinyTitan({ port: host })],
	});
	t340.clock = () => box.cycles;

	cpu.pc = 0o22;
	for (let i = 0; i < 30 && !t340.lastFrame; i += 1) {
		box.run(100_000);
		if (cpu.halted) break;
	}
	assert.ok(t340.lastFrame, "boot picture is up");

	// Type the command the way a KSR-33 sent it: ASCII with the mark
	// bit, CR = 0o215. INP buffers; the CR sets IMC; WAIT1 dispatches.
	for (const ch of "TITAN") tty.type(ch.charCodeAt(0) | 0o200);
	tty.type(0o215);
	box.run(3_000_000);

	assert.ok(host.controls.includes(4), `session opened: controls=${host.controls}`);
	assert.ok(host.controls.includes(6), "handshake control 6 sent");
	const words = host.received;
	assert.equal(words.length, 0o24, "exactly count words per the BSZ arithmetic");
	assert.equal(words[0], 0o767676, "PXID — PIXIE's greeting card, first word on the wire");
	assert.equal(words[1], cpu.read(0o5162), "DSBEG matches the BEG variable");
	assert.equal(words[2], cpu.read(0o5163), "DSEND matches the END variable");
	const beg = cpu.read(0o5162) & 0o17777;
	for (let i = 0; i < 16; i += 1) {
		assert.equal(words[4 + i], cpu.read(beg + i), `ring word ${i} echoed from core`);
	}
	assert.equal(host.disconnected, true, "LKD closed the session");
	assert.equal(cpu.halted, false, "back in the main loop");
	assert.ok(!tty.printed().includes("NOTE"), `no error note: tty=${tty.printed()}`);
});

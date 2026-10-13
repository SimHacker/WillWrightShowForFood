import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assemble, loadAsm } from "./asm.js";
import { Cabinet } from "./cabinet.js";
import { Pdp7 } from "./plugins/pdp7.js";
import {
	PDP7_TM_SHAPE,
	RleTape,
	TCB,
	TM_FAULT,
	TM_HALT,
	TM_LEFT,
	TM_RUN,
	TuringCpu,
	TuringDevice,
	TuringEngine,
} from "./plugins/turing.js";
import { Type340 } from "./plugins/type340.js";
import { layoutTm, packCells, runTm, tapeText, unpackCells, type TmProgram } from "./tm.js";
import { compileTmForth } from "./tmforth.js";

const tapeFile = (name: string) => readFileSync(new URL(`../tapes/turing/${name}`, import.meta.url), "utf8");
const machines = new Map<string, TmProgram>();
for (const f of ["minsky-7x4.tmf", "pcomp.tmf"]) for (const p of compileTmForth(tapeFile(f))) machines.set(p.name, p);
const machine = (name: string) => {
	const p = machines.get(name);
	assert.ok(p, `no machine ${name}`);
	return p;
};

test("RleTape agrees with a plain array under random stores and loads", () => {
	let seed = 12345;
	const rand = (n: number) => {
		seed = (seed * 1103515245 + 12345) % 2 ** 31;
		return seed % n;
	};
	const t = new RleTape();
	t.blank = 7;
	const model = new Map<number, number>();
	const at = (i: number) => model.get(i) ?? 7;
	for (let round = 0; round < 2000; round += 1) {
		const start = rand(200) - 100;
		const len = 1 + rand(12);
		const codes = Array.from({ length: len }, () => (rand(3) === 0 ? 7 : rand(3)));
		t.store(start, codes);
		codes.forEach((c, i) => model.set(start + i, c));
		const ls = rand(220) - 110;
		const ll = rand(30);
		assert.deepEqual(
			t.load(ls, ll),
			Array.from({ length: ll }, (_, i) => at(ls + i)),
			`round ${round}`,
		);
	}
	const all = t.load(-120, 240);
	assert.deepEqual(all, Array.from({ length: 240 }, (_, i) => at(i - 120)));
});

test("packCells and unpackCells are inverses, high end first", () => {
	const codes = [0o60, 0o61, 0o31, 0o01, 0o60];
	const words = packCells(PDP7_TM_SHAPE, codes, 0o37);
	assert.deepEqual(words, [0o606131, 0o016037]);
	assert.deepEqual(unpackCells(PDP7_TM_SHAPE, words, 5), codes);
});

test("auto paging: a tiny window gives the same tape as a roomy one", () => {
	const p = machine("minsky-7x4");
	const roomy = runTm(p, { wlen: 300 });
	const tiny = runTm(p, { wlen: 3 });
	assert.equal(roomy.reason, "halt");
	assert.equal(tiny.reason, "halt");
	assert.equal(tiny.steps, 1870);
	assert.equal(roomy.pages, 0);
	assert.ok(tiny.pages > 20, `paged ${tiny.pages} times`);
	assert.equal(tiny.pictured, roomy.pictured);
	assert.equal(tiny.pictured, "11010111000001001101100000000000000000000000000yAAAA");
});

test("the engine writes its registers back to the TCB after every transition", () => {
	const p = machine("bb2");
	const lay = layoutTm(p);
	const mem = new Uint32Array(1024);
	for (const b of lay.blocks) mem.set(b.words, b.addr);
	const e = new TuringEngine({ mem: { read: (a) => mem[a]!, write: (a, w) => void (mem[a] = w) } });
	e.load(lay.tcb);
	e.go(true);
	assert.equal(e.step(), "step");
	assert.equal(mem[lay.tcb + TCB.COUNT], 1);
	assert.equal(mem[lay.tcb + TCB.STATE], e.state);
	assert.equal(mem[lay.tcb + TCB.HEAD], e.head);
	assert.equal(e.running, false, "single step stops");
	e.go();
	let why = null;
	while (!why) why = e.step();
	assert.equal(why, "halt");
	assert.equal(mem[lay.tcb + TCB.COUNT], 6);
	assert.equal(mem[lay.tcb + TCB.STATE], 0);
});

test("host paging: the engine faults off the window edge and reports which side", () => {
	const p = machine("bb2");
	const lay = layoutTm(p, { wlen: 3, lead: 0 });
	const mem = new Uint32Array(1024);
	for (const b of lay.blocks) mem.set(b.words, b.addr);
	const e = new TuringEngine({ mem: { read: (a) => mem[a]!, write: (a, w) => void (mem[a] = w) } });
	e.hostPaging = true;
	e.load(lay.tcb);
	e.go();
	let why = null;
	while (!why) why = e.step();
	assert.equal(why, "fault");
	assert.ok(e.status & TM_FAULT);
	const left = (e.status & TM_LEFT) !== 0;
	assert.equal(mem[lay.tcb + TCB.HEAD], left ? 0o777777 : 3, "HEAD is -1 or WLEN in the TCB");
	assert.equal(e.status & TM_RUN, 0);
});

/** Lay a program out for the driver: its tape inside BACK, the window a slice of it. */
function driverCore(cpu: Pdp7, p: TmProgram, sym: Map<string, number>) {
	const tcb = sym.get("tcb")!;
	const back = sym.get("back")!;
	const backWords = 0o100;
	const wwords = 8;
	const lay = layoutTm(p, { tcb, alpha: 0o1100, window: 0o3000, wlen: wwords * 3 });
	for (const b of lay.blocks) if (b.addr !== lay.window) cpu.deposit(b.addr, b.words);
	const tape = p.tape!;
	const cells = new Array<number>(backWords * 3).fill(p.codes ? p.codes[0]! : 0);
	const backOrigin = tape.origin - 60;
	tape.cells.forEach((s, i) => (cells[tape.origin + i - backOrigin] = p.codes ? p.codes[s]! : s));
	cpu.deposit(back, packCells(p.shape, cells));
	const w0 = Math.max(0, Math.floor((tape.head - backOrigin) / 3) - 2);
	const origin = backOrigin + 3 * w0;
	cpu.write(tcb + TCB.WINDOW, back + w0);
	cpu.write(tcb + TCB.ORIGIN, origin & 0o777777);
	cpu.write(tcb + TCB.HEAD, (tape.head - origin) & 0o777777);
	return { back, backWords, backOrigin };
}

function driverBox(p: TmProgram) {
	const r = assemble([{ name: "utm-driver.s", text: tapeFile("utm-driver.s") }]);
	assert.deepEqual(r.errors, []);
	const cpu = new Pdp7({ coreWords: 8192 });
	loadAsm(cpu, r);
	cpu.pc = r.start ?? 0o100;
	const dev = new TuringDevice({ fetch: (a) => cpu.read(a), store: (a, w) => cpu.write(a, w) });
	const box = new Cabinet({ cpu, devices: [dev] });
	const core = driverCore(cpu, p, r.symbols);
	return { cpu, dev, box, r, ...core };
}

test("PDP-7 driver pages Minsky's machine through an 8-word window by moving WINDOW", () => {
	const p = machine("minsky-7x4");
	const { cpu, dev, box, r, back, backWords, backOrigin } = driverBox(p);
	const st = box.run(200_000);
	assert.ok(st.halt, "the CPU halted");
	assert.equal(cpu.read(r.symbols.get("done")!), 1, "the machine halted");
	assert.equal(dev.engine.count, 1870);
	assert.ok(cpu.read(r.symbols.get("faults")!) >= 3, `faults: ${cpu.read(r.symbols.get("faults")!)}`);
	assert.equal(dev.engine.spill.extent(), null, "host mode: nothing spilled inside the engine");
	const codes = unpackCells(p.shape, Array.from({ length: backWords }, (_, i) => cpu.read(back + i)));
	const syms = codes.map((c) => p.codes!.indexOf(c));
	const text = tapeText(p.symbols, { cells: syms, origin: backOrigin, head: backOrigin }, { trim: true });
	assert.equal(text, runTm(p).pictured);
});

test("PDP-7 driver stops a runaway machine at the end of its core tape", () => {
	const [p] = compileTmForth(`
		tm: walk  symbols: 0 1 ;  states: w ;
		state: w  drop 1 write left ;
		w start  tape: ^0  end-tm`);
	const { cpu, box, r } = driverBox(p!);
	const st = box.run(100_000);
	assert.ok(st.halt);
	assert.equal(cpu.read(r.symbols.get("done")!), 4, "too far left");
	const slack = cpu.read(r.symbols.get("tcb")! + TCB.WINDOW) - r.symbols.get("back")!;
	assert.ok(slack >= 0 && slack < 4, `the slice reached the left end, ${slack} words from it`);
	const [q] = compileTmForth(`tm: run  symbols: 0 1 ;  states: r ;  state: r  drop 1 write right ;  r start  tape: ^0  end-tm`);
	const right = driverBox(q!);
	assert.ok(right.box.run(100_000).halt);
	assert.equal(right.cpu.read(right.r.symbols.get("done")!), 3, "too far right");
});

test("the 340 draws the tape window straight out of shared core: cells are 342 characters", () => {
	const p = machine("minsky-7x4");
	const res = runTm(p);
	const lay = layoutTm(p, { window: 0o3000, wlen: 24, tape: res.tape });
	const mem = new Uint32Array(8192);
	for (const b of lay.blocks) mem.set(b.words, b.addr);
	mem[0o2777] = 0o060000; // param: next mode CHAR
	const end = lay.window + lay.wlen / 3;
	mem[end] = 0o370000; // ESC
	mem[end + 1] = 0o003000; // stop
	const t = new Type340({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w) });
	t.iot({ device: 0o06, pulse: 0o06, ac: 0o2777 });
	for (let i = 0; i < 40; i += 1) t.tick();
	const glyphs = new Map<number, number>();
	for (const s of t.segments) if (s.kind === "char" && s.glyph >= 0 && !glyphs.has(s.glyph)) glyphs.set(s.glyph, s.ch);
	const drawn = [...glyphs.values()];
	const window = unpackCells(p.shape, Array.from({ length: 8 }, (_, i) => mem[lay.window + i]!), 24);
	assert.equal(drawn.length, 24, "every cell drew a character");
	assert.deepEqual(drawn, window);
});

test("TuringCpu: the engine as the whole cabinet runs BB2 to a halt", () => {
	const p = machine("bb2");
	const cpu = new TuringCpu({ tcb: 0o100 });
	const lay = layoutTm(p);
	for (const b of lay.blocks) cpu.deposit(b.addr, b.words);
	const box = new Cabinet({ cpu });
	const st = box.run(100);
	assert.ok(st.halt);
	assert.equal(cpu.engine.count, 6);
	assert.equal(cpu.pc, 0, "PC is the state: halt");
	assert.equal(tapeText(p.symbols, { ...cpu.engine.snapshot() }, { trim: true }), "1111");
	assert.ok(cpu.engine.status & TM_HALT);
});

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { parse } from "yaml";
import { toYaml } from "../save/yaml.js";
import { M6502, type Bus, type M6502State } from "./m6502.js";

class TraceBus implements Bus {
	mem = new Uint8Array(0x10000);
	cycles: [number, number, string][] = [];
	read(addr: number): number {
		const v = this.mem[addr] ?? 0;
		this.cycles.push([addr, v, "read"]);
		return v;
	}
	write(addr: number, value: number): void {
		const v = value & 0xff;
		this.mem[addr] = v;
		this.cycles.push([addr, v, "write"]);
	}
}

function load(bus: TraceBus, ram: readonly (readonly [number, number])[]): void {
	bus.mem.fill(0);
	bus.cycles.length = 0;
	for (const [addr, value] of ram) bus.mem[addr] = value;
}

function plant(cpu: M6502, s: { pc: number; s: number; a: number; x: number; y: number; p: number }): void {
	const state = cpu.state();
	cpu.restore({ ...state, ...s, cycles: 0, irq: false, nmi: false, nmiPrev: false, nmiPending: false, irqDelay: false, ready: true, jammed: false });
}

test("m6502: LDA #0 sets Z and leaves the unused status bit alone", () => {
	const bus = new TraceBus();
	const cpu = new M6502(bus);
	load(bus, [[0x0000, 0xa9], [0x0001, 0x00]]);
	plant(cpu, { pc: 0, s: 0xff, a: 0x11, x: 0, y: 0, p: 0x20 });
	cpu.step();
	assert.equal(cpu.a, 0);
	assert.equal(cpu.p, 0x22);
	assert.equal(cpu.pc, 2);
	assert.deepEqual(bus.cycles, [[0, 0xa9, "read"], [1, 0, "read"]]);
});

test("m6502: SHY abs,X on a page cross writes the masked byte at the corrupted address", () => {
	const bus = new TraceBus();
	const cpu = new M6502(bus);
	// SingleStepTests 9c, case 1. Y & (H+1) = $5E & $DC = $5C, stored at $5C66.
	load(bus, [[56166, 234], [62962, 219], [62961, 143], [62960, 156]]);
	plant(cpu, { pc: 62960, s: 64, a: 215, x: 215, y: 94, p: 112 });
	cpu.step();
	assert.equal(cpu.pc, 62963);
	assert.equal(cpu.p, 112);
	assert.equal(bus.mem[0x5c66], 0x5c);
	assert.deepEqual(bus.cycles, [
		[0xf5f0, 0x9c, "read"],
		[0xf5f1, 0x8f, "read"],
		[0xf5f2, 0xdb, "read"],
		[0xdb66, 0xea, "read"],
		[0x5c66, 0x5c, "write"],
	]);
});

test("m6502: the processor state is a YAML document and does not include the bus", () => {
	const bus = new TraceBus();
	const cpu = new M6502(bus, "nes");
	load(bus, [[0, 0xa9], [1, 0x42]]);
	plant(cpu, { pc: 0, s: 0xfd, a: 0, x: 1, y: 2, p: 0x24 });
	cpu.irq = true;
	cpu.step();
	const text = toYaml(cpu.state());
	assert.match(text, /^pc: 2$/m);
	assert.match(text, /^a: 66$/m);
	assert.match(text, /^flavor: nes$/m);
	assert.equal(text.includes("mem"), false);
	const again = new M6502(new TraceBus(), "nmos");
	again.restore(parse(text) as M6502State);
	assert.equal(again.a, 0x42);
	assert.equal(again.flavor, "nes");
	assert.equal(again.pc, 2);
	assert.equal(again.irq, true);
	assert.equal(bus.mem[0], 0xa9);
});

type Harte = {
	name: string;
	initial: { pc: number; s: number; a: number; x: number; y: number; p: number; ram: [number, number][] };
	final: { pc: number; s: number; a: number; x: number; y: number; p: number; ram: [number, number][] };
	cycles: [number, number, string][];
};

const CORPUS = process.env.M6502_TESTS;

test("m6502: every NMOS opcode matches SingleStepTests, bus cycles included", { skip: !CORPUS, timeout: 600_000 }, () => {
	if (!CORPUS || !existsSync(CORPUS)) {
		return;
	}
	const files = readdirSync(CORPUS).filter((name) => name.endsWith(".json")).sort();
	assert.equal(files.length, 256, `${CORPUS} has ${files.length} opcode files`);
	const bus = new TraceBus();
	const cpu = new M6502(bus);
	let ran = 0;
	for (const file of files) {
		const cases = JSON.parse(readFileSync(`${CORPUS}/${file}`, "utf8")) as Harte[];
		for (const t of cases) {
			load(bus, t.initial.ram);
			plant(cpu, t.initial);
			cpu.step();
			ran += 1;
			if (cpu.pc !== t.final.pc || cpu.s !== t.final.s || cpu.a !== t.final.a || cpu.x !== t.final.x || cpu.y !== t.final.y || cpu.p !== t.final.p) {
				assert.deepEqual(
					{ pc: cpu.pc, s: cpu.s, a: cpu.a, x: cpu.x, y: cpu.y, p: cpu.p },
					{ pc: t.final.pc, s: t.final.s, a: t.final.a, x: t.final.x, y: t.final.y, p: t.final.p },
					t.name,
				);
			}
			if (bus.cycles.length !== t.cycles.length || bus.cycles.some((c, i) => c[0] !== t.cycles[i]![0] || c[1] !== t.cycles[i]![1] || c[2] !== t.cycles[i]![2])) {
				assert.deepEqual(bus.cycles, t.cycles, t.name);
			}
			for (const [addr, value] of t.final.ram) {
				if (bus.mem[addr] !== value) assert.equal(bus.mem[addr], value, `${t.name} ram $${addr.toString(16)}`);
			}
		}
	}
	assert.equal(ran, 2_560_000);
});

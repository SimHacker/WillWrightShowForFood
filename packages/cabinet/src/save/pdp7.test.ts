import assert from "node:assert/strict";
import test from "node:test";
import { KorzPdp7 } from "../korz/pdp7.js";
import { Pdp7 } from "../plugins/pdp7.js";
import { loadPdp7, savePdp7 } from "./pdp7.js";
import { MemoryStore } from "./store.js";

/** ISZ 3 / JMP 0. Two steps increment location 3 by one. The other registers sit still. */
const ISZ3 = (0o11 << 14) | 3;
const JMP0 = 0o14 << 14;

function program(cpu: Pdp7): void {
	cpu.write(0, ISZ3);
	cpu.write(1, JMP0);
	cpu.write(3, 0);
	cpu.pc = 0;
	cpu.ac = 0o123456;
	cpu.link = 1;
	cpu.mq = 0o654321;
	cpu.sc = 7;
	cpu.ion = true;
	cpu.ionDefer = 0;
	cpu.extend = true;
	cpu.restoreRegisters({ ...cpu.registers(), emirPending: true });
	cpu.switches = 0o400000;
	cpu.halted = false;
}

const words = (cpu: Pdp7) => Array.from({ length: cpu.coreWords }, (_, a) => cpu.read(a));

test("pdp7 snapshot: save, load, save writes the same bytes", () => {
	const cpu = new Pdp7({ coreWords: 4096 });
	program(cpu);
	cpu.step();
	const first = new MemoryStore();
	savePdp7(first, cpu, 40, "mid");
	const restored = new Pdp7({ coreWords: 4096 });
	const snap = loadPdp7(first, restored);
	assert.equal(snap.cycles, 40);
	assert.equal(snap.id, "mid");
	assert.deepEqual(restored.registers(), cpu.registers());
	assert.deepEqual(words(restored), words(cpu));
	const second = new MemoryStore();
	savePdp7(second, restored, snap.cycles, snap.id);
	assert.deepEqual(second.files, first.files);
});

test("pdp7 snapshot: a restored cpu matches one that never stopped", () => {
	const live = new Pdp7({ coreWords: 4096 });
	program(live);
	for (let i = 0; i < 10; i += 1) live.step();
	const store = new MemoryStore();
	savePdp7(store, live, 10);
	const restored = new Pdp7({ coreWords: 4096 });
	loadPdp7(store, restored);
	for (let i = 0; i < 50; i += 1) {
		live.step();
		restored.step();
	}
	assert.deepEqual(restored.registers(), live.registers());
	assert.deepEqual(words(restored), words(live));
	assert.equal(restored.read(3), 30);
});

test("pdp7 snapshot: restoring through write drops a Korz block compiled from the old core", () => {
	const live = new Pdp7({ coreWords: 4096 });
	program(live);
	const korz = new KorzPdp7({ coreWords: 4096, korz: "compile" });
	korz.write(0, JMP0);
	for (let i = 0; i < 5; i += 1) korz.step();
	const store = new MemoryStore();
	savePdp7(store, live, 0);
	loadPdp7(store, korz);
	for (let i = 0; i < 30; i += 1) {
		live.step();
		korz.step();
	}
	assert.deepEqual(korz.registers(), live.registers());
	assert.equal(korz.read(3), live.read(3));
});

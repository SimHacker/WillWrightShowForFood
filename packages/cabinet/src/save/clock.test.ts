import assert from "node:assert/strict";
import test from "node:test";
import { Cabinet } from "../cabinet.js";
import { Clock } from "../plugins/clock.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { loadCabinet, saveCabinet } from "./cabinet.js";
import { MemoryStore } from "./store.js";

/** A JMP at 0, so the cabinet can run without leaving the loop. */
function loopingCpu(): Pdp7 {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.write(0, pdp7.mr(pdp7.jmp, 0));
	cpu.pc = 0;
	cpu.write(0o7, 0o777777);
	return cpu;
}

test("clock: a restore between ticks raises the flag on the same step", () => {
	const liveCpu = loopingCpu();
	const liveClock = new Clock({ cpu: liveCpu, cyclesPerTick: 10 });
	const live = new Cabinet({ cpu: liveCpu, devices: [liveClock] });
	liveClock.iot({ device: 0, pulse: 0o44, ac: 0 });
	live.run(5);
	assert.equal(liveClock.capture().accum, 5);
	assert.equal(liveClock.flag, false);

	const store = new MemoryStore();
	saveCabinet(store, live, "between-ticks");
	const restoredCpu = loopingCpu();
	const restoredClock = new Clock({ cpu: restoredCpu, cyclesPerTick: 10 });
	const restored = new Cabinet({ cpu: restoredCpu, devices: [restoredClock] });
	loadCabinet(store, restored);
	const again = new MemoryStore();
	saveCabinet(again, restored, "between-ticks");
	assert.deepEqual(again.files, store.files);

	live.run(5);
	restored.run(5);
	assert.equal(restoredClock.flag, true);
	assert.equal(restoredClock.flag, liveClock.flag);
	assert.equal(restoredCpu.read(0o7), 0);
	assert.equal(restoredCpu.read(0o7), liveCpu.read(0o7));
	assert.equal(restored.cycles, live.cycles);
	assert.deepEqual(restoredClock.capture(), liveClock.capture());
});

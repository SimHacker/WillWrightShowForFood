import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { Cabinet } from "../cabinet.js";
import { Clock } from "../plugins/clock.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { saveCabinet } from "./cabinet.js";
import { readDirectory, writeDirectory } from "./directory.js";
import { MemoryStore } from "./store.js";

test("a snapshot directory loads back into a memory store", () => {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.write(0, pdp7.mr(pdp7.jmp, 0));
	cpu.pc = 0;
	const box = new Cabinet({ cpu, devices: [new Clock({ cpu, cyclesPerTick: 10 })] });
	const store = new MemoryStore();
	saveCabinet(store, box, "on-disk");
	const dir = join(tmpdir(), `cabinet-snap-${process.pid}`);
	try {
		writeDirectory(dir, store);
		const back = readDirectory(dir);
		assert.equal(back.files.size, store.files.size);
		for (const [path, bytes] of store.files) assert.deepEqual(back.get(path), bytes);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

import assert from "node:assert/strict";
import test from "node:test";
import { Cabinet } from "../cabinet.js";
import { strokeAt } from "../hover.js";
import { LightPen } from "../plugins/lightpen.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { ST340_LPHIT, Type340 } from "../plugins/type340.js";
import { loadCabinet, saveCabinet } from "./cabinet.js";
import { MemoryStore } from "./store.js";

/** JMP 0, and a long intensified vector the pen can stop inside. */
function tube(pen: LightPen): { cpu: Pdp7; display: Type340; box: Cabinet } {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.write(0, pdp7.mr(pdp7.jmp, 0));
	cpu.pc = 0;
	cpu.write(0o100, 0o114000);
	cpu.write(0o101, 0o200100);
	const display = new Type340({
		fetch: (a) => cpu.read(a),
		store: (a, w) => cpu.write(a, w),
		pens: [pen],
	});
	const box = new Cabinet({ cpu, devices: [display] });
	display.iot({ device: 0o06, pulse: 0o06, ac: 0o100 });
	return { cpu, display, box };
}

test("340: a vector stopped by the pen resumes at the same point", () => {
	const livePen = new LightPen({ aperture: 4, name: "mouse" });
	livePen.point(20, 0);
	const live = tube(livePen);
	live.display.tick();
	live.display.tick();
	const paused = live.display.capture();
	assert.ok(paused.pending, "the beam stopped inside the vector");
	assert.ok(live.display.status & ST340_LPHIT);
	assert.ok(strokeAt(live.display.segments, 20, 0, 4), "the pen is over the stroke drawn so far");

	const store = new MemoryStore();
	saveCabinet(store, live.box, "mid-vector");
	const restoredPen = new LightPen({ aperture: 4, name: "mouse" });
	const restored = tube(restoredPen);
	loadCabinet(store, restored.box);
	const again = new MemoryStore();
	saveCabinet(again, restored.box, "mid-vector");
	assert.deepEqual(again.files, store.files);

	assert.ok(strokeAt(restored.display.segments, 20, 0, 4), "the earlier stroke still hits");
	assert.equal(restored.display.iot({ device: 0o07, pulse: 0o01, ac: 0 }).skip, true);
	assert.equal(restoredPen.x, 20);
	assert.equal(restoredPen.y, 0);

	livePen.point(800, 800);
	restoredPen.point(800, 800);
	live.display.iot({ device: 0o05, pulse: 0o04, ac: 0 });
	restored.display.iot({ device: 0o05, pulse: 0o04, ac: 0 });
	live.display.tick();
	restored.display.tick();
	assert.equal(restored.display.capture().pending, null);
	assert.equal(restored.display.x, live.display.x);
	assert.equal(restored.display.y, live.display.y);
	assert.deepEqual(restored.display.segments, live.display.segments);
});

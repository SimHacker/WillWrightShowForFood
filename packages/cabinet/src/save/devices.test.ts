import assert from "node:assert/strict";
import test from "node:test";
import { Cabinet } from "../cabinet.js";
import { Clock } from "../plugins/clock.js";
import { DataHand } from "../plugins/datahand.js";
import { syntheticHand } from "../plugins/hand.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { FILES_DEVICE, MemoryMount, TitanFiles } from "../plugins/titan-files.js";
import { BlockletHost, TinyTitan } from "../plugins/tiny-titan.js";
import { TuringDevice } from "../plugins/turing.js";
import { UltimateMachine } from "../plugins/ultimate.js";
import { loadCabinet, saveCabinet } from "./cabinet.js";
import { MemoryStore } from "./store.js";

function loopingCpu(): Pdp7 {
	const cpu = new Pdp7({ coreWords: 256 });
	cpu.write(0, pdp7.mr(pdp7.jmp, 0));
	cpu.pc = 0;
	return cpu;
}

/** Save, load into a cabinet built the same way, and check the second save matches. */
function roundTrip(live: Cabinet, build: () => Cabinet, id: string): Cabinet {
	const store = new MemoryStore();
	saveCabinet(store, live, id);
	const restored = build();
	loadCabinet(store, restored);
	const again = new MemoryStore();
	saveCabinet(again, restored, id);
	assert.deepEqual(again.files, store.files);
	return restored;
}

test("datahand: the next register read is the latched one", () => {
	const hand = () => new DataHand();
	const liveHand = hand();
	liveHand.feed(syntheticHand({ curls: [0.5, 0.25, 0.75, 0.1, 0.9] }));
	liveHand.iot({ device: 0o57, pulse: 0o04, ac: 0 });
	liveHand.iot({ device: 0o57, pulse: 0o24, ac: 1 });
	const live = new Cabinet({ cpu: loopingCpu(), devices: [liveHand] });
	const restored = roundTrip(live, () => new Cabinet({ cpu: loopingCpu(), devices: [hand()] }), "hand");
	const restoredHand = restored.device("datahand") as DataHand;
	const read = (d: DataHand) => d.iot({ device: 0o57, pulse: 0o22, ac: 0 }).ac;
	const word = read(restoredHand);
	assert.notEqual(word, 0);
	assert.equal(word, read(liveHand));
});

test("ultimate: a hand on its way out finishes the same press", () => {
	const timing = { wait: 2, open: 20, reach: 20, press: 4, return: 20, close: 20, rest: 2 };
	const machine = () => new UltimateMachine(timing);
	const liveMachine = machine();
	const live = new Cabinet({ cpu: loopingCpu(), devices: [liveMachine] });
	liveMachine.setLever(true);
	live.run(8);
	assert.ok(liveMachine.lid > 0, "the lid is part way open");
	const restored = roundTrip(live, () => new Cabinet({ cpu: loopingCpu(), devices: [machine()] }), "ultimate");
	const restoredMachine = restored.device("ultimate") as UltimateMachine;
	live.run(200);
	restored.run(200);
	assert.equal(restoredMachine.phase, 0);
	assert.equal(restoredMachine.presses, 1);
	assert.equal(restoredMachine.presses, liveMachine.presses);
	assert.deepEqual(restoredMachine.capture(), liveMachine.capture());
});

test("tiny titan: the rest of a blocklet sums to the same checksum", () => {
	const link = () => {
		const host = new BlockletHost([2]);
		return new TinyTitan({ port: host });
	};
	const liveLink = link();
	const host = liveLink.port as BlockletHost;
	host.control(4);
	host.send(0o111);
	liveLink.flag = true;
	liveLink.enabled = true;
	const live = new Cabinet({ cpu: loopingCpu(), devices: [liveLink] });
	const restored = roundTrip(live, () => new Cabinet({ cpu: loopingCpu(), devices: [link()] }), "titan");
	const restoredLink = restored.device("tiny-titan") as TinyTitan;
	const read = (d: TinyTitan) => d.iot({ device: 0o22, pulse: 0o42, ac: 0 }).ac;
	assert.equal(read(restoredLink), read(liveLink));
	(restoredLink.port as BlockletHost).send(0o222);
	host.send(0o222);
	assert.deepEqual(restoredLink.capture(), liveLink.capture());
});

test("titan-files: a file's words and the last result come back", () => {
	const mount = () => {
		const files = new MemoryMount();
		files.files.set("note", new Uint32Array([1, 2, 0o777777]));
		return files;
	};
	const device = (cpu: Pdp7, files: MemoryMount) =>
		new TitanFiles({ core: { read: (a) => cpu.read(a), write: (a, w) => cpu.write(a, w) }, mounts: { "/tmp": files } });
	const liveCpu = loopingCpu();
	const liveFiles = mount();
	const liveDevice = device(liveCpu, liveFiles);
	liveDevice.flag = false;
	liveDevice.result = 7;
	const live = new Cabinet({ cpu: liveCpu, devices: [liveDevice] });
	const restoredFiles = mount();
	restoredFiles.files.clear();
	const restored = roundTrip(
		live,
		() => {
			const cpu = loopingCpu();
			return new Cabinet({ cpu, devices: [device(cpu, restoredFiles)] });
		},
		"files",
	);
	assert.deepEqual([...(restoredFiles.files.get("note") ?? [])], [1, 2, 0o777777]);
	const titan = restored.device("titan-files") as TitanFiles;
	const reply = titan.iot({ device: FILES_DEVICE, pulse: 0o02, ac: 0 });
	assert.equal(reply.skip, false);
	assert.equal(reply.ac, 7);
});

test("turing: a half-spent step and the spilled tape survive", () => {
	const mem = new Uint32Array(64);
	const device = () =>
		new TuringDevice({ fetch: (a) => mem[a] ?? 0, store: (a, w) => void (mem[a] = w), rate: 0.5 });
	const liveDevice = device();
	liveDevice.engine.spill.store(10, [3, 3, 3]);
	liveDevice.engine.go();
	liveDevice.tick(1);
	assert.ok(liveDevice.capture().accum > 0 && liveDevice.capture().accum < 1);
	const live = new Cabinet({ cpu: loopingCpu(), devices: [liveDevice] });
	const restored = roundTrip(live, () => new Cabinet({ cpu: loopingCpu(), devices: [device()] }), "turing");
	const restoredDevice = restored.device("turing") as TuringDevice;
	assert.equal(restoredDevice.engine.spill.read(11), 3);
	liveDevice.tick(1);
	restoredDevice.tick(1);
	assert.equal(restoredDevice.capture().accum, 0);
	assert.deepEqual(restoredDevice.capture(), liveDevice.capture());
});

test("a device this build does not know is written back unchanged", () => {
	const clock = () => new Clock({ cpu: loopingCpu(), cyclesPerTick: 10 });
	const live = new Cabinet({ cpu: loopingCpu(), devices: [clock()] });
	const store = new MemoryStore();
	saveCabinet(store, live, "kept");
	store.put("devices/widget/state.yml", "kind: widget\n");
	store.put("devices/widget/rom.bin", Uint8Array.from([1, 2, 3, 4]));
	const restored = new Cabinet({ cpu: loopingCpu(), devices: [clock()] });
	loadCabinet(store, restored);
	const out = new MemoryStore();
	saveCabinet(out, restored, "kept");
	assert.deepEqual(out.files, store.files);
});

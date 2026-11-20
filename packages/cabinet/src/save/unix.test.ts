import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import { Cabinet } from "../cabinet.js";
import { PaperTape } from "../plugins/papertape.js";
import { Pdp7, pdp7 } from "../plugins/pdp7.js";
import { parseRbImage, Rb09 } from "../plugins/rb09.js";
import { Teletype } from "../plugins/teletype.js";
import { bootUnixV0 } from "../unixv0.js";
import { loadCabinet, saveCabinet } from "./cabinet.js";
import { MemoryStore } from "./store.js";

const TAPES = new URL("../../tapes/unixv0/", import.meta.url);

function cpu(): Pdp7 {
	const c = new Pdp7({ coreWords: 4096 });
	c.write(0, pdp7.mr(pdp7.jmp, 0));
	c.pc = 0;
	return c;
}

/** Three channel-8 frames of 0o123456, high six bits first. */
const WORD = 0o123456;
const TAPE = Uint8Array.from([0o12, 0o34, 0o56].map((b) => 0o200 | b));

test("paper tape: a restore between the frames of one word delivers that word", () => {
	const liveCpu = cpu();
	const liveReader = new PaperTape({ tape: TAPE.slice(), frameCycles: 10 });
	const live = new Cabinet({ cpu: liveCpu, devices: [liveReader] });
	liveReader.iot({ device: 0o01, pulse: 0o44, ac: 0 });
	live.run(11);
	assert.equal(liveReader.capture().state, 12, "one frame assembled, two still to come");
	assert.equal(liveReader.pos, 1);

	const store = new MemoryStore();
	saveCabinet(store, live);
	const restoredCpu = cpu();
	const restoredReader = new PaperTape({ frameCycles: 10 });
	const restored = new Cabinet({ cpu: restoredCpu, devices: [restoredReader] });
	loadCabinet(store, restored);

	live.run(40);
	restored.run(40);
	assert.equal(restoredReader.flag, true);
	assert.equal(restoredReader.buf, WORD);
	assert.equal(restoredReader.buf, liveReader.buf);
	assert.equal(restoredReader.pos, liveReader.pos);
	assert.deepEqual(restoredReader.capture(), liveReader.capture());
});

test("teletype: a restore mid-character finishes the same paper and keeps the unread key", () => {
	const liveCpu = cpu();
	const liveTty = new Teletype({ printCycles: 20 });
	const live = new Cabinet({ cpu: liveCpu, devices: [liveTty] });
	liveTty.type(0o101);
	liveTty.type(0o102);
	liveTty.iot({ device: 0o04, pulse: 0o04, ac: 0o101 });
	live.run(8);
	assert.ok(liveTty.capture().printing > 0);
	assert.deepEqual(liveTty.capture().pending, [0o102]);

	const store = new MemoryStore();
	saveCabinet(store, live);
	const restoredCpu = cpu();
	const restoredTty = new Teletype({ printCycles: 20 });
	const restored = new Cabinet({ cpu: restoredCpu, devices: [restoredTty] });
	loadCabinet(store, restored);
	const again = new MemoryStore();
	saveCabinet(again, restored);
	assert.deepEqual(again.files, store.files);

	live.run(20);
	restored.run(20);
	assert.deepEqual(restoredTty.output, [0o101]);
	assert.equal(restoredTty.ttoFlag, true);
	assert.equal(restoredTty.kbdBuf, 0o101);
	assert.deepEqual(restoredTty.capture().pending, [0o102]);
	assert.deepEqual(restoredTty.capture(), liveTty.capture());
});

test("rb09: a restore while a block is still coming finishes the same core and platter", () => {
	const image = new Uint32Array(128);
	image[64] = 0o111;
	image[65] = 0o222;
	image[66] = 0o333;
	const liveCpu = cpu();
	const liveDisk = new Rb09({ cpu: liveCpu, image, wordCycles: 10 });
	const live = new Cabinet({ cpu: liveCpu, devices: [liveDisk] });
	liveDisk.iot({ device: 0o71, pulse: 0o04, ac: 0x0001 });
	liveDisk.iot({ device: 0o71, pulse: 0o24, ac: 0o177775 });
	liveDisk.iot({ device: 0o71, pulse: 0o42, ac: 0o200 });
	liveDisk.iot({ device: 0o71, pulse: 0o44, ac: 0o2000 });
	live.run(100);
	const mid = liveDisk.capture();
	assert.ok(mid.due > mid.now, "the block has not come under the heads yet");
	assert.equal(liveCpu.read(0o200), 0);

	const store = new MemoryStore();
	saveCabinet(store, live);
	const restoredImage = new Uint32Array(128);
	const restoredCpu = cpu();
	const restoredDisk = new Rb09({ cpu: restoredCpu, image: restoredImage, wordCycles: 10 });
	const restored = new Cabinet({ cpu: restoredCpu, devices: [restoredDisk] });
	loadCabinet(store, restored);

	live.run(600);
	restored.run(600);
	for (let i = 0; i < 3; i += 1) {
		assert.equal(restoredCpu.read(0o200 + i), image[64 + i]);
		assert.equal(restoredCpu.read(0o200 + i), liveCpu.read(0o200 + i));
	}
	assert.deepEqual(restoredImage, image);
	assert.equal(restoredDisk.capture().dirty, false);
	assert.deepEqual(restoredDisk.capture(), liveDisk.capture());
});

function sameImage(a: Uint32Array, b: Uint32Array): void {
	assert.equal(a.length, b.length);
	for (let i = 0; i < a.length; i += 1) {
		if (a[i] !== b[i]) assert.fail(`platter word ${i}: ${a[i]!.toString(8)} !== ${b[i]!.toString(8)}`);
	}
}

test("unix v0: a snapshot mid-boot reaches the same login", () => {
	const platter = gunzipSync(readFileSync(new URL("image.fs.gz", TAPES)));
	const bootTape = readFileSync(new URL("boot.rim", TAPES));
	const live = bootUnixV0({ image: parseRbImage(platter), bootTape });
	live.box.run(600_000);
	assert.equal(live.paper().includes("login:"), false, live.paper());

	const store = new MemoryStore();
	saveCabinet(store, live.box, "unix-mid");
	const restored = bootUnixV0({ image: parseRbImage(platter), bootTape });
	loadCabinet(store, restored.box);
	assert.deepEqual(restored.cpu.registers(), live.cpu.registers());
	assert.equal(restored.tty.printed(), live.tty.printed());

	live.box.run(800_000);
	restored.box.run(800_000);
	assert.match(live.tty.printed(), /login: /);
	assert.equal(restored.tty.printed(), live.tty.printed());
	assert.deepEqual(restored.cpu.registers(), live.cpu.registers());
	assert.equal(restored.box.cycles, live.box.cycles);
	sameImage(restored.disk.image!, live.disk.image!);

	const a = new MemoryStore();
	const b = new MemoryStore();
	saveCabinet(a, live.box, "unix-login");
	saveCabinet(b, restored.box, "unix-login");
	assert.deepEqual(b.files, a.files);
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { Cabinet } from "./cabinet.js";
import { Pdp7, pdp7 } from "./plugins/pdp7.js";
import { parseRbImage, Rb09, rbImageBytes, RB_SIZE } from "./plugins/rb09.js";
import { bootUnixV0, unixKey } from "./unixv0.js";

const BUILD = process.env.PDP7_UNIX_BUILD ?? new URL("../../../../pdp7-unix/build/", import.meta.url).pathname;
const built = existsSync(BUILD + "image.fs") && existsSync(BUILD + "boot.rim");

function run(cpu: Pdp7, box: Cabinet, words: number[]): void {
	cpu.deposit(0o100, [...words, 0o740040]); // then HLT
	cpu.pc = 0o100;
	box.run(100_000);
}

test("rb09: BCD track 180 sector 0, one block into core, then DONE", () => {
	const cpu = new Pdp7();
	const image = new Uint32Array(RB_SIZE);
	image[180 * 80 * 64] = 0o123456;
	image[180 * 80 * 64 + 63] = 0o654321;
	const disk = new Rb09({ cpu, image });
	const box = new Cabinet({ cpu, devices: [disk] });
	cpu.deposit(0o200, [-64 & 0o777777, 0o3000, 0o300000, 0o2000]);
	run(cpu, box, [
		pdp7.mr(pdp7.lac, 0o200), 0o707124, // lac -64; dslw
		pdp7.mr(pdp7.lac, 0o201), 0o707142, // lac 3000; dslm
		pdp7.mr(pdp7.lac, 0o202), 0o707104, // lac 300000 (BCD 180); dsld
		pdp7.mr(pdp7.lac, 0o203), 0o707144, // lac 2000 (busy, read); dsls
		0o707121, pdp7.mr(pdp7.jmp, 0o110), // dssf; jmp .-1
	]);
	assert.equal(cpu.read(0o3000), 0o123456);
	assert.equal(cpu.read(0o3077), 0o654321);
	assert.equal(disk.wc, 0);
	assert.equal(disk.sta & 0o010000, 0o010000, "DONE");
});

test("rb09: a BCD digit above 9 is an illegal address, the error flag rises", () => {
	const cpu = new Pdp7();
	const disk = new Rb09({ cpu, image: new Uint32Array(RB_SIZE) });
	disk.iot({ device: 0o71, pulse: 0o04, ac: 0x1200 }); // track BCD 12, sector 0: fine
	assert.equal(disk.da, 12 * 80 * 64);
	disk.iot({ device: 0o71, pulse: 0o04, ac: 0x000a }); // sector nibble 0xA
	assert.equal(disk.da, 12 * 80 * 64, "address unchanged");
	assert.equal(disk.sta & 0o500000, 0o500000, "ERR and ILA");
});

test("rb09: SIMH image format round-trips, eighteen bits a word", () => {
	const image = new Uint32Array(RB_SIZE);
	image[0] = 0o777777;
	image[RB_SIZE - 1] = 0o400001;
	const back = parseRbImage(rbImageBytes(image));
	assert.equal(back[0], 0o777777);
	assert.equal(back[RB_SIZE - 1], 0o400001);
});

test("unix keys: mark parity, CR and LF swapped, ESC is ALT MODE", () => {
	assert.equal(unixKey(0x61), 0o341);
	assert.equal(unixKey(0o15), 0o212);
	assert.equal(unixKey(0o12), 0o215);
	assert.equal(unixKey(0o33), 0o375);
});

test("unix v0: boots from the RB09, ken logs in, ls and date run", { skip: !built && `no pdp7-unix build at ${BUILD}` }, () => {
	const u = bootUnixV0({
		image: parseRbImage(readFileSync(BUILD + "image.fs")),
		bootTape: readFileSync(BUILD + "boot.rim"),
	});
	assert.ok(u.runUntil("login: ", 5_000_000), u.paper());
	u.type("ken\r");
	assert.ok(u.runUntil("password: ", 5_000_000), u.paper());
	u.type("ken\r");
	assert.ok(u.runUntil("@ ", 10_000_000), u.paper());
	u.type("ls system\r");
	assert.ok(u.runUntil("@ ", 40_000_000), u.paper());
	assert.match(u.paper(), /\rmoo\n/); // the kernel prints LF, then CR
	u.type("date\r");
	assert.ok(u.runUntil("@ ", 20_000_000), u.paper());
	assert.match(u.paper(), /Thu Jan 01 1970 00:00:\d\d/);
});

test("unix v0: a file written survives a reboot from the same platter", { skip: !built && `no pdp7-unix build at ${BUILD}` }, () => {
	const image = parseRbImage(readFileSync(BUILD + "image.fs"));
	const bootTape = readFileSync(BUILD + "boot.rim");
	const login = () => {
		const u = bootUnixV0({ image, bootTape });
		assert.ok(u.runUntil("login: ", 5_000_000));
		u.type("ken\r");
		u.runUntil("password: ", 5_000_000);
		u.type("ken\r");
		assert.ok(u.runUntil("@ ", 10_000_000));
		return u;
	};
	const first = login();
	first.type("cp sys.rc kept\r");
	assert.ok(first.runUntil("@ ", 40_000_000), first.paper());
	assert.ok(first.disk.dirty);
	const second = login();
	second.type("cat kept\r");
	assert.ok(second.runUntil("@ ", 40_000_000), second.paper());
	assert.match(second.paper(), /as sop\.s s1\.s/);
});

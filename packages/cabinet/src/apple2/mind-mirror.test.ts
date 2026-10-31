import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse } from "yaml";
import { Dos33Volume } from "./dos33.js";
import { decodeSave, encodeSave, exportDisk, importDisk } from "./mind-mirror.js";
import { wozToDsk } from "./woz.js";

const DISKS = new URL("../../disks/apple2/mind-mirror/", import.meta.url);
const volume = (name: string) => new Dos33Volume(wozToDsk(new Uint8Array(readFileSync(new URL(name, DISKS)))).image);
const LIFE_B = "mm-flux-life-simulation-b.woz";

test("dos33: the Life Simulation B catalog ends with the save RAVEN", () => {
	const v = volume(LIFE_B);
	assert.equal(v.volume, 254);
	const raven = v.entries.at(-1)!;
	assert.deepEqual([raven.name, raven.type, raven.sectors], ["RAVEN", "B", 2]);
	const { address, bytes } = v.binary(raven);
	assert.equal(address, 0x040c);
	assert.equal(bytes.length, 252);
});

test("mind mirror: RAVEN decodes and encodes back to the same bytes", () => {
	const b = volume(LIFE_B).binary("RAVEN").bytes;
	const s = decodeSave(b);
	assert.equal(s.name, "RAVEN");
	assert.deepEqual(s.scores, [1, -9, 5, 3, -1, 9, 5, 27, 39, 100, 7, 13, -10, 0, 9, 8, 16]);
	assert.equal(s.rest, undefined);
	assert.deepEqual(encodeSave(s, b), b);
	assert.deepEqual(encodeSave(s), b);
});

test("mind mirror: export and import leave the disk byte for byte", () => {
	const v = volume(LIFE_B);
	const before = v.image.slice();
	importDisk(exportDisk(v), v);
	assert.deepEqual(v.image, before);
});

test("mind mirror: RAVEN moves onto a clean Disk 2 Side B as a new file", () => {
	const files = exportDisk(volume(LIFE_B));
	const clean = volume("mm-flux-disk-2-side-b.woz");
	const filec = clean.raw("FILEC").slice();
	files.set("characters/raven/CHARACTER.yml", files.get("characters/raven/CHARACTER.yml")!.replace("name: RAVEN", "name: CORVID"));
	importDisk(files, clean);
	const reread = new Dos33Volume(clean.image);
	assert.equal(decodeSave(reread.binary("RAVEN").bytes).name, "CORVID");
	assert.deepEqual(reread.raw("FILEC"), filec);
	const c = parse(exportDisk(reread).get("characters/raven/CHARACTER.yml")!);
	assert.deepEqual(c.mind_mirror.scores, [1, -9, 5, 3, -1, 9, 5, 27, 39, 100, 7, 13, -10, 0, 9, 8, 16]);
});

test("mind mirror: the RAITAN disk has a name and no save", () => {
	const v = volume("mm-flux-raitan.woz");
	const files = exportDisk(v);
	const c = parse(files.get("characters/raitan/CHARACTER.yml")!);
	assert.deepEqual(c.mind_mirror, { file: "RAITAN", saved: false });
	const before = v.image.slice();
	importDisk(files, v);
	assert.deepEqual(v.image, before);
});

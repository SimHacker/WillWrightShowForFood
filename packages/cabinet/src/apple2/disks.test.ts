import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { blockOrder, dosOrder, openImage, read2mg, saveImage } from "./disk.js";
import { Dos33Volume } from "./dos33.js";
import { PascalVolume, pascalText } from "./pascal.js";
import { blocksFor, packDate, ProDOSVolume, unpackDate } from "./prodos.js";

const FORTH = new URL("../../../../characters/don-hopkins/artifacts/Apple2Forth/", import.meta.url);
const DISKS = new URL("../../disks/apple2/", import.meta.url);
const file = (base: URL, name: string) => new Uint8Array(readFileSync(new URL(name, base)));

// CiderPress II's cp2, when CP2 names it, reads every image these tests write.
const CP2 = process.env.CP2;
const skipCp2 = CP2 ? false : "set CP2 to CiderPress II's cp2 command to check images with it";
const cp2 = (...args: string[]) => execFileSync(CP2!, args, { encoding: "utf8" });
const scratch = () => mkdtempSync(join(tmpdir(), "disks-"));
const bytes = (n: number, seed: number) => Uint8Array.from({ length: n }, (_, i) => (i * 31 + seed * 7 + (i >> 9)) & 255);

test("openImage: order and file system of Don's Forth disk both ways, a DOS 3.3 disk, a Pascal disk", () => {
	const po = openImage(file(FORTH, "forth.dsk"), "forth.dsk");
	const dsk = openImage(file(FORTH, "f.dsk"), "f.dsk");
	assert.deepEqual([po.order, po.fs], ["prodos", "prodos"]);
	assert.deepEqual([dsk.order, dsk.fs], ["dos", "prodos"]);
	assert.deepEqual(po.blocks, dsk.blocks);
	assert.deepEqual(openImage(file(FORTH, "junk.dsk")).fs, "dos33");
	assert.deepEqual(openImage(file(DISKS, "pascal/apple-pascal-disk-0.dsk")).fs, "pascal");
	const img = file(FORTH, "f.dsk");
	assert.deepEqual(dosOrder(blockOrder(img)), img);
});

test("ProDOS: reads /H19, Don's Forth disk, the way CiderPress II catalogs it", () => {
	const v = ProDOSVolume.fromImage(file(FORTH, "forth.dsk"), "forth.dsk");
	assert.equal(v.name, "H19");
	assert.equal(v.totalBlocks, 280);
	assert.equal(v.freeBlocks(), 86);
	assert.deepEqual(
		v.list().map((e) => [e.name, e.typeName, e.aux, e.eof, e.blocksUsed * 512]),
		[
			["PRODOS", "SYS", 0x2000, 14848, 15360],
			["BLOCKS.4TH", "TXT", 0x28, 49152, 49664],
			["H19.SYSTEM", "SYS", 0x4c, 29707, 30720],
		],
	);
	assert.deepEqual(v.check(), []);
	assert.match(v.text("BLOCKS.4TH"), /^Huh \? +Zoom!/);
	assert.deepEqual(v.image(), file(FORTH, "forth.dsk"));
	const dos = ProDOSVolume.fromImage(file(FORTH, "f.dsk"), "f.dsk");
	assert.equal(dos.order, "dos");
	assert.deepEqual(dos.image(), file(FORTH, "f.dsk"));
	assert.deepEqual(dos.read("H19.SYSTEM"), v.read("H19.SYSTEM"));
});

test("ProDOS: seedling, sapling and tree files, nested directories, a directory that grows, delete, rename, lower case", () => {
	const v = ProDOSVolume.format("Work", 1600, { created: new Date(1988, 0, 11, 9, 30) });
	assert.equal(v.name, "Work");
	assert.equal(v.freeBlocks(), 1600 - 7);
	const empty = v.freeBlocks();
	const small = bytes(100, 1), mid = bytes(20000, 2), big = bytes(300000, 3), zero = new Uint8Array(0);
	assert.equal(v.write("SMALL", small, { type: "BIN", aux: 0x2000 }).storage, 1);
	assert.equal(v.write("MID", mid).storage, 2);
	const t = v.write("deep/er/BIG", big, { type: "$06" });
	assert.deepEqual([t.storage, t.blocksUsed, t.path], [3, blocksFor(300000), "deep/er/BIG"]);
	assert.equal(v.write("ZERO", zero).blocksUsed, 1);
	assert.deepEqual(v.read("SMALL"), small);
	assert.deepEqual(v.read("MID"), mid);
	assert.deepEqual(v.read("/Work/deep/er/BIG"), big);
	assert.deepEqual(v.read("ZERO"), zero);
	assert.equal(v.find("deep")!.name, "deep");
	assert.equal(v.find("DEEP/ER")!.dir, true);
	for (let i = 0; i < 30; i++) v.writeText(`deep/F${i}`, `line ${i}\n`);
	assert.equal(v.find("deep")!.blocksUsed, 3);
	assert.equal(v.find("deep")!.eof, 3 * 512);
	assert.equal(v.list("deep").length, 31);
	assert.equal(v.text("deep/F29"), "line 29\n");
	assert.deepEqual(v.check(), []);
	v.write("MID", small);
	assert.deepEqual([v.find("MID")!.storage, v.find("MID")!.at], [1, v.list()[1]!.at]);
	v.rename("deep", "Shallow");
	assert.equal(v.list("SHALLOW").length, 31);
	assert.equal(v.find("shallow/er/big")!.eof, 300000);
	v.setInfo("SMALL", { type: "SYS", aux: 0x2000 });
	assert.equal(v.find("SMALL")!.typeName, "SYS");
	assert.throws(() => v.remove("Shallow"), /not empty/);
	assert.throws(() => v.write("1BAD", small), /starting with a letter/);
	assert.deepEqual(v.check(), []);
	const again = new ProDOSVolume(v.image());
	assert.deepEqual(again.read("Shallow/er/BIG"), big);
	v.remove("Shallow", { recursive: true });
	for (const n of ["SMALL", "MID", "ZERO"]) v.remove(n);
	assert.equal(v.list().length, 0);
	assert.equal(v.freeBlocks(), empty);
	assert.deepEqual(v.check(), []);
	assert.deepEqual(v.unclaimed(), []);
	assert.equal(v.created?.getFullYear(), 1988);
});

test("ProDOS: dates, full disks and a full volume directory refuse cleanly", () => {
	const d = new Date(1986, 4, 30, 23, 59);
	assert.deepEqual(unpackDate(...packDate(d)), d);
	assert.equal(unpackDate(...packDate(new Date(2026, 10, 1)))!.getFullYear(), 2026);
	const v = ProDOSVolume.format("TINY", 20);
	assert.throws(() => v.write("BIG", new Uint8Array(20 * 512)), /needs \d+ blocks/);
	assert.deepEqual(v.check(), []);
	const w = ProDOSVolume.format("MANY", 280);
	for (let i = 0; i < 51; i++) w.write(`F${i}`, new Uint8Array(1));
	assert.throws(() => w.write("F51", new Uint8Array(1)), /volume directory is full \(51 entries\)/);
	w.write("F0", bytes(1000, 9));
	assert.deepEqual(w.check(), []);
});

test("ProDOS: a file added to Don's Forth disk, in its own sector order", () => {
	const v = ProDOSVolume.fromImage(file(FORTH, "f.dsk"), "f.dsk");
	v.writeText("NOTES", "Ok\n");
	assert.deepEqual(v.check(), []);
	const back = ProDOSVolume.fromImage(v.image(), "f.dsk");
	assert.equal(back.order, "dos");
	assert.equal(back.text("NOTES"), "Ok\n");
	assert.deepEqual(back.read("H19.SYSTEM"), ProDOSVolume.fromImage(file(FORTH, "forth.dsk")).read("H19.SYSTEM"));
});

test("DOS 3.3: format, every file type, a file longer than one track/sector list, delete, rename, lock", () => {
	const v = Dos33Volume.format(42);
	assert.equal(v.volume, 42);
	assert.equal(v.freeSectors(), 560 - 48 - 16);
	const empty = v.freeSectors();
	v.writeText("README", "HELLO\nWORLD\n");
	assert.equal(v.text("README"), "HELLO\nWORLD\n");
	v.write("PROG", "A", Uint8Array.of(1, 8, 10, 0, 0x8b, 0, 0, 0));
	assert.deepEqual(v.file("PROG"), { type: "A", length: 8, bytes: Uint8Array.of(1, 8, 10, 0, 0x8b, 0, 0, 0) });
	const big = bytes(40000, 4);
	const e = v.write("BIG", "B", big, { address: 0x0800 });
	assert.equal(e.sectors, Math.ceil(40004 / 256) + 2);
	const f = v.file("BIG");
	assert.deepEqual([f.address, f.length, f.bytes.length], [0x0800, 40000, 40000]);
	assert.deepEqual(f.bytes, big);
	v.write("SYS", "S", bytes(300, 5));
	assert.deepEqual(v.check(), []);
	v.lock("BIG");
	assert.throws(() => v.delete("BIG"), /locked/);
	assert.throws(() => v.write("BIG", "B", big), /locked/);
	v.rename("README", "READ ME");
	assert.equal(v.text("READ ME"), "HELLO\nWORLD\n");
	v.delete("READ ME");
	assert.ok(v.entries.some((x) => x.deleted && x.name === "READ ME"));
	v.writeBinary("SMALL", 0x300, Uint8Array.of(0x60));
	v.writeBinary("SMALL", 0x300, bytes(2000, 6));
	assert.equal(v.binary("SMALL").length, 2000);
	assert.deepEqual(v.check(), []);
	for (const n of ["PROG", "SYS", "SMALL"]) v.delete(n);
	v.delete("BIG", { force: true });
	assert.equal(v.freeSectors(), empty);
	assert.deepEqual(v.check(), []);
	assert.deepEqual(v.unclaimed(), []);
	assert.throws(() => v.writeText("A,B", ""), /no commas/);
});

test("DOS 3.3: junk.dsk's HELLO, and an image read in ProDOS order goes back out that way", () => {
	const v = new Dos33Volume(file(FORTH, "junk.dsk"));
	assert.deepEqual(v.file("HELLO"), { type: "A", length: 3, bytes: Uint8Array.of(0, 0, 10) });
	assert.deepEqual(v.check(), []);
	const po = blockOrder(file(FORTH, "junk.dsk"));
	const w = Dos33Volume.fromImage(po, "junk.po");
	assert.equal(w.order, "prodos");
	w.writeText("NEW", "X\n");
	assert.equal(Dos33Volume.fromImage(w.save(), "junk.po").text("NEW"), "X\n");
});

test("DOS 3.3: damage is named once per file, and space a game keeps outside files is unclaimed, not damage", () => {
	const logo = new Dos33Volume(file(DISKS, "logo/apple-logo-french-touch.dsk"));
	const p = logo.check();
	assert.ok(p.some((x) => /^the catalog links to sector 127\/127, off the disk$/.test(x)), p.join("\n"));
	assert.equal(p.filter((x) => x.startsWith("INTERPRET.LOGO")).length, 1);
	const lcp = new Dos33Volume(file(DISKS, "little-computer-people/lcp-side-b.dsk"));
	assert.deepEqual(lcp.check(), []);
	assert.ok(lcp.unclaimed().length > 200);
});

test("Pascal: reads APPLE0:, and writes, deletes, renames, krunches and formats", () => {
	const p0 = new PascalVolume(file(DISKS, "pascal/apple-pascal-disk-0.dsk"));
	assert.equal(p0.name, "APPLE0");
	assert.equal(p0.freeBlocks(), 32);
	assert.deepEqual(p0.check(), []);
	const v = PascalVolume.format("WORK", 280, { date: new Date(1980, 8, 22) });
	assert.equal(v.freeBlocks(), 274);
	const src = "PROGRAM HELLO;\nBEGIN\n    WRITELN('HELLO')\nEND.\n";
	v.writeText("HELLO.TEXT", src);
	assert.equal(v.text("HELLO.TEXT"), src);
	assert.equal(v.find("HELLO.TEXT").kind, "text");
	v.write("A.DATA", bytes(1000, 1));
	v.write("B.DATA", bytes(5000, 2));
	v.write("C.DATA", bytes(700, 3));
	assert.deepEqual(v.raw("A.DATA"), bytes(1000, 1));
	assert.equal(v.find("A.DATA").lastBytes, 1000 % 512);
	v.delete("B.DATA");
	v.rename("C.DATA", "SEE.DATA");
	assert.deepEqual(v.raw("SEE.DATA"), bytes(700, 3));
	const before = v.gaps().length;
	v.krunch();
	assert.ok(v.gaps().length < before);
	assert.deepEqual(v.raw("SEE.DATA"), bytes(700, 3));
	assert.equal(v.text("HELLO.TEXT"), src);
	v.write("HELLO.TEXT", pascalText("X\n"), "text");
	assert.equal(v.text("HELLO.TEXT"), "X\n");
	assert.deepEqual(v.check(), []);
	assert.throws(() => v.write("HUGE", new Uint8Array(300 * 512)), /contiguous blocks/);
	assert.equal(new PascalVolume(v.image()).text("HELLO.TEXT"), "X\n");
	assert.equal(v.entries.length, 3);
});

test("2MG: a ProDOS volume wrapped and unwrapped", () => {
	const v = ProDOSVolume.format("WRAP", 280);
	v.write("F", bytes(600, 1));
	const two = saveImage(v.data, "prodos", { creator: "WWSF", locked: false, comment: "a test" });
	const t = read2mg(two);
	assert.deepEqual([t.format, t.blocks, t.comment], [1, 280, "a test"]);
	const back = ProDOSVolume.fromImage(two, "x.2mg");
	assert.deepEqual(back.read("F"), bytes(600, 1));
	back.write("G", bytes(10, 2));
	assert.equal(read2mg(back.image()).comment, "a test");
});

test("CiderPress II reads every image written here", { skip: skipCp2 }, () => {
	const dir = scratch();
	const pd = ProDOSVolume.format("CHECK", 1600);
	const files: [string, Uint8Array][] = [["SEED", bytes(400, 1)], ["SAP", bytes(70000, 2)], ["DIR/SUB/TREE", bytes(200000, 3)]];
	for (const [n, b] of files) pd.write(n, b);
	for (let i = 0; i < 20; i++) pd.write(`DIR/F${i}`, bytes(i, i));
	pd.remove("DIR/F3");
	writeFileSync(join(dir, "p.po"), pd.image());
	assert.match(cp2("test", join(dir, "p.po")), /no failures/);
	const forth = ProDOSVolume.fromImage(file(FORTH, "f.dsk"), "f.dsk");
	forth.writeText("NOTES", "Ok\n");
	writeFileSync(join(dir, "forth.do"), forth.image());
	assert.match(cp2("test", join(dir, "forth.do")), /Tested 4 files; no failures/);
	const ds = Dos33Volume.format(7);
	ds.write("BIG", "B", bytes(40000, 4), { address: 0x800 });
	ds.writeText("TEXT", "ONE\nTWO\n");
	writeFileSync(join(dir, "d.do"), ds.save());
	assert.match(cp2("test", join(dir, "d.do")), /Tested 2 files; no failures/);
	const ps = PascalVolume.format("PCHK");
	ps.writeText("A.TEXT", "BEGIN\n  END.\n");
	ps.write("B.DATA", bytes(1500, 5));
	writeFileSync(join(dir, "s.dsk"), ps.image());
	assert.match(cp2("test", join(dir, "s.dsk")), /Tested 2 files; no failures/);
	const out = scratch();
	execFileSync(CP2!, ["extract", "--raw", "--no-add-ext", join(dir, "p.po"), "SEED", "SAP", "DIR/SUB/TREE"], { cwd: out });
	for (const [n, b] of files) assert.deepEqual(new Uint8Array(readFileSync(join(out, n))), b, n);
	execFileSync(CP2!, ["extract", "--no-add-ext", join(dir, "d.do"), "BIG"], { cwd: out });
	assert.deepEqual(new Uint8Array(readFileSync(join(out, "BIG"))), bytes(40000, 4));
	execFileSync(CP2!, ["extract", "--raw", "--no-add-ext", join(dir, "s.dsk"), "B.DATA"], { cwd: out });
	assert.deepEqual(new Uint8Array(readFileSync(join(out, "B.DATA"))), bytes(1500, 5));
	assert.match(cp2("catalog", join(dir, "s.dsk")), /Pascal "PCHK"/);
});
